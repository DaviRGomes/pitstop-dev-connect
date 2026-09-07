import {
  getLatestSession,
  getSessionDrivers,
  getSessionIntervals,
  getSessionLaps,
  getSessionPositions,
  type OpenF1Lap,
  type OpenF1Session,
} from './openf1';

export interface LiveSessionInfo {
  name: string; // "Race", "Sprint", "Qualifying", "Practice 1"…
  type: string; // "Race", "Qualifying", "Practice"
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
  code: string; // sigla (VER, NOR…)
  name: string;
  team: string;
  teamColor: string; // hex sem "#" (como a OpenF1 manda) ou ""
  headshot?: string;
  gapToLeader: number | string | null; // segundos, "+1 LAP" ou null (líder)
  interval: number | string | null;
  bestLap: number | null; // melhor volta em segundos
}

export interface LiveState {
  live: boolean;
  session: LiveSessionInfo | null;
  standings: LiveDriverRow[];
  updatedAt: string;
}

// Consideramos "ao vivo" um pouco antes da largada (formação) e um pouco
// depois do fim programado. Quali e corrida podem passar do horário (bandeira
// vermelha para o relógio/estica a prova), mas treino livre nunca estica — o
// relógio corre até sob bandeira vermelha —, então a tolerância ali é só pros
// últimos dados chegarem.
const PRE_WINDOW_MS = 10 * 60 * 1000;
const POST_WINDOW_MS = 60 * 60 * 1000;
const POST_WINDOW_PRACTICE_MS = 5 * 60 * 1000;

export function isSessionLive(session: OpenF1Session, now = Date.now()): boolean {
  const start = Date.parse(session.date_start);
  const end = Date.parse(session.date_end);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
  const postWindow = session.session_type === 'Practice' ? POST_WINDOW_PRACTICE_MS : POST_WINDOW_MS;
  return now >= start - PRE_WINDOW_MS && now <= end + postWindow;
}

/** Melhor volta cronometrada (em segundos) de cada piloto. */
export function bestLapByDriver(laps: OpenF1Lap[]): Map<number, number> {
  const best = new Map<number, number>();
  for (const lap of laps) {
    if (typeof lap.lap_duration !== 'number' || !Number.isFinite(lap.lap_duration)) continue;
    const current = best.get(lap.driver_number);
    if (current === undefined || lap.lap_duration < current) {
      best.set(lap.driver_number, lap.lap_duration);
    }
  }
  return best;
}

/** Reduz um histórico (position/intervals) à entrada mais recente por piloto. */
export function latestByDriver<T extends { driver_number: number; date: string }>(rows: T[]): Map<number, T> {
  const latest = new Map<number, T>();
  for (const row of rows) {
    const current = latest.get(row.driver_number);
    if (!current || row.date >= current.date) {
      latest.set(row.driver_number, row);
    }
  }
  return latest;
}

function mapSession(session: OpenF1Session): LiveSessionInfo {
  return {
    name: session.session_name,
    type: session.session_type,
    circuit: session.circuit_short_name,
    country: session.country_name,
    location: session.location,
    dateStart: session.date_start,
    dateEnd: session.date_end,
    sessionKey: session.session_key,
    meetingKey: session.meeting_key,
  };
}

/**
 * Estado ao vivo da sessão corrente: fora da janela devolve só a sessão
 * (live=false); dentro, monta o placar juntando posições + pilotos + gaps.
 * Drivers/intervals indisponíveis degradam sem derrubar o placar.
 */
export async function getLiveState(): Promise<LiveState> {
  const updatedAt = new Date().toISOString();
  const session = await getLatestSession();
  if (!session) {
    return { live: false, session: null, standings: [], updatedAt };
  }
  if (!isSessionLive(session)) {
    return { live: false, session: mapSession(session), standings: [], updatedAt };
  }

  const [positions, drivers, intervals, laps] = await Promise.all([
    getSessionPositions(session.session_key),
    getSessionDrivers(session.session_key).catch(() => []),
    getSessionIntervals(session.session_key).catch(() => []),
    getSessionLaps(session.session_key).catch(() => []),
  ]);

  const driverByNumber = new Map(drivers.map((d) => [d.driver_number, d]));
  const intervalByDriver = latestByDriver(intervals);
  const bestLaps = bestLapByDriver(laps);

  const standings = [...latestByDriver(positions).values()]
    .sort((a, b) => a.position - b.position)
    .map((pos): LiveDriverRow => {
      const driver = driverByNumber.get(pos.driver_number);
      const gap = intervalByDriver.get(pos.driver_number);
      return {
        position: pos.position,
        driverNumber: pos.driver_number,
        code: driver?.name_acronym ?? `#${pos.driver_number}`,
        name: driver?.full_name ?? `Piloto ${pos.driver_number}`,
        team: driver?.team_name ?? '',
        teamColor: driver?.team_colour ?? '',
        headshot: driver?.headshot_url ?? undefined,
        gapToLeader: gap?.gap_to_leader ?? null,
        interval: gap?.interval ?? null,
        bestLap: bestLaps.get(pos.driver_number) ?? null,
      };
    });

  return { live: true, session: mapSession(session), standings, updatedAt };
}
