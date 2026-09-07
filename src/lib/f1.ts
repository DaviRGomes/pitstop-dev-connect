// Cliente do backend do pitstop (pasta server/, porta 3333).
// O front nunca fala direto com Jolpica/OpenF1 — sempre passa por aqui.

// Base da API:
//  - Produção: defina VITE_PITSTOP_API no build (ex.: https://pitstop.dev.br).
//    O proxy (Caddy) roteia /api/* e /tracks/* pro container da API no MESMO
//    domínio → same-origin, sem CORS e sem mixed-content sob HTTPS.
//  - Dev/local: sem a env, cai no mesmo host da página na porta 3333
//    (o docker compose publica a api em 3333 no profile dev).
// Todas as chamadas partem do navegador, então o fallback de SSR nunca roda.
function apiBase(): string {
  const fromEnv = import.meta.env.VITE_PITSTOP_API as string | undefined;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:3333`;
  }
  return "http://localhost:3333";
}

export const F1_API = apiBase();

export interface SessionTime {
  date: string;
  time?: string;
}

export interface RaceSessions {
  firstPractice?: SessionTime;
  secondPractice?: SessionTime;
  thirdPractice?: SessionTime;
  qualifying?: SessionTime;
  sprint?: SessionTime;
  sprintQualifying?: SessionTime;
}

export interface RaceEvent {
  season: string;
  round: number;
  name: string;
  circuitId: string;
  circuitName: string;
  locality: string;
  country: string;
  date: string;
  time?: string;
  sessions: RaceSessions;
  circuitImage?: string;
  countryFlag?: string;
  circuitSlug?: string;
}

export interface PodiumEntry {
  position: number;
  driver: string;
  code?: string;
  constructor: string;
}

export interface RoundPodium {
  round: number;
  name: string;
  date: string;
  podium: PodiumEntry[];
}

export interface LiveSessionInfo {
  name: string;
  type: string;
  circuit: string;
  country: string;
  location: string;
  dateStart: string;
  dateEnd: string;
  sessionKey: number;
  meetingKey: number;
}

export interface LiveDriverRow {
  position: number;
  driverNumber: number;
  code: string;
  name: string;
  team: string;
  teamColor: string;
  headshot?: string;
  gapToLeader: number | string | null;
  interval: number | string | null;
  bestLap: number | null;
}

export interface LiveState {
  live: boolean;
  session: LiveSessionInfo | null;
  standings: LiveDriverRow[];
  updatedAt: string;
}

export interface StandingRow {
  position: number;
  driver: string;
  code?: string;
  nationality?: string;
  constructor: string;
  points: number;
  wins: number;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${F1_API}${path}`);
  if (!res.ok) {
    throw new Error(`pitstop API respondeu ${res.status} em ${path}`);
  }
  return (await res.json()) as T;
}

export const fetchRaces = () => getJson<RaceEvent[]>("/api/f1/races");
export const fetchPodiums = () => getJson<RoundPodium[]>("/api/f1/podiums");
export const fetchLive = () => getJson<LiveState>("/api/f1/live");
export const fetchStandings = () => getJson<StandingRow[]>("/api/f1/standings");

/** Instante da largada (a Jolpica manda date e time separados, em UTC). */
export function raceStart(race: RaceEvent): Date {
  return new Date(`${race.date}T${race.time ?? "00:00:00Z"}`);
}

/** Datas sempre exibidas no fuso de São Paulo. */
const SP_TZ = "America/Sao_Paulo";
export const fmtDia = new Intl.DateTimeFormat("pt-BR", {
  timeZone: SP_TZ,
  weekday: "short",
  day: "2-digit",
  month: "short",
});
export const fmtHora = new Intl.DateTimeFormat("pt-BR", {
  timeZone: SP_TZ,
  hour: "2-digit",
  minute: "2-digit",
});
export const fmtHoraSeg = new Intl.DateTimeFormat("pt-BR", {
  timeZone: SP_TZ,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** PNG local baixado pelo `npm run icons`; cai pro CDN da F1 se não houver. */
export function trackIcon(race: RaceEvent): string | undefined {
  if (race.circuitSlug) return `${F1_API}/tracks/${race.circuitSlug}.png`;
  return race.circuitImage;
}

/** Índice da corrida "atual": a primeira cujo fim (~3h após a largada) não passou. */
export function nextRaceIndex(races: RaceEvent[], now = Date.now()): number {
  const idx = races.findIndex((race) => raceStart(race).getTime() + 3 * 60 * 60 * 1000 > now);
  return idx === -1 ? Math.max(races.length - 1, 0) : idx;
}

/** Tempo de volta como a F1 mostra: "1:16.462". */
export function formatLapTime(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return "—";
  const min = Math.floor(seconds / 60);
  const rest = (seconds - min * 60).toFixed(3).padStart(6, "0");
  return `${min}:${rest}`;
}

/** Gap pro líder como a F1 mostra: "líder", "+1.234" ou "+1 LAP". */
export function formatGap(row: LiveDriverRow): string {
  if (row.position === 1) return "líder";
  const gap = row.gapToLeader;
  if (gap == null) return "—";
  return typeof gap === "number" ? `+${gap.toFixed(3)}` : gap;
}

// ---------------------------------------------------------------------------
// Campeonato de pilotos (tabela geral + projeção ao vivo)
// ---------------------------------------------------------------------------

/** Nome de construtor (Jolpica ou OpenF1) -> slug dos assets do CDN da F1. */
const TEAM_LOGO_SLUGS: Record<string, string> = {
  mercedes: "mercedes",
  ferrari: "ferrari",
  mclaren: "mclaren",
  "red bull": "redbullracing",
  "red bull racing": "redbullracing",
  williams: "williams",
  "aston martin": "astonmartin",
  alpine: "alpine",
  "alpine f1 team": "alpine",
  "rb f1 team": "racingbulls",
  "racing bulls": "racingbulls",
  haas: "haas",
  "haas f1 team": "haas",
  audi: "audi",
  cadillac: "cadillac",
  "cadillac f1 team": "cadillac",
};

/** Escudo (logo branco) do time no CDN da F1; undefined se o time é desconhecido. */
export function teamLogo(constructorName: string, season?: string): string | undefined {
  const slug = TEAM_LOGO_SLUGS[constructorName.trim().toLowerCase()];
  if (!slug) return undefined;
  const year = season && /^\d{4}$/.test(season) ? season : String(new Date().getFullYear());
  return `https://media.formula1.com/image/upload/c_fit,h_48/q_auto/common/f1/${year}/${slug}/${year}${slug}logowhite.webp`;
}

const RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const SPRINT_POINTS = [8, 7, 6, 5, 4, 3, 2, 1];

export interface ChampRow {
  position: number;
  driver: string;
  code?: string;
  constructor: string;
  points: number;
  /** Pontos que o piloto está somando na sessão ao vivo (0 fora de corrida). */
  gained: number;
  /** Posições ganhas (+) ou perdidas (-) na tabela em relação à oficial. */
  delta: number;
}

/**
 * Tabela do campeonato com projeção ao vivo: durante Corrida/Sprint soma os
 * pontos da posição atual de cada piloto (casado pela sigla) aos pontos
 * oficiais da Jolpica e reordena. Fora de sessão pontuável devolve a oficial.
 */
export function projectChampionship(
  base: StandingRow[],
  live?: LiveState,
): { rows: ChampRow[]; projecting: boolean } {
  const sessionName = live?.live ? live.session?.name : undefined;
  const scoring =
    sessionName === "Race" ? RACE_POINTS : sessionName === "Sprint" ? SPRINT_POINTS : null;

  const gainedByCode = new Map<string, number>();
  if (scoring && live) {
    for (const row of live.standings) {
      const pts = scoring[row.position - 1];
      if (pts) gainedByCode.set(row.code, pts);
    }
  }

  const rows: ChampRow[] = base.map((s) => {
    const gained = (s.code && gainedByCode.get(s.code)) || 0;
    return {
      position: s.position,
      driver: s.driver,
      code: s.code,
      constructor: s.constructor,
      points: s.points + gained,
      gained,
      delta: 0,
    };
  });

  if (scoring) {
    rows.sort((a, b) => b.points - a.points || a.position - b.position);
    rows.forEach((row, i) => {
      row.delta = row.position - (i + 1);
      row.position = i + 1;
    });
  }

  return { rows, projecting: Boolean(scoring) };
}
