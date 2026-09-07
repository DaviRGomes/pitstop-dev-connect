import { getOrSet, TTL } from '../cache';
import type { RaceEvent, RaceResult, ResultRow, SessionTime, StandingRow } from '../types';

const BASE = 'https://api.jolpi.ca/ergast/f1';
const HEADERS = { 'User-Agent': 'pitstop-dev-study/1.0' };

// ---------------------------------------------------------------------------
// Formato cru da Jolpica-F1 (compatível com Ergast) — só os campos que usamos.
// ---------------------------------------------------------------------------

interface RawSession {
  date: string;
  time?: string;
}

export interface RawRace {
  season: string;
  round: string;
  url?: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: { lat: string; long: string; locality: string; country: string };
  };
  date: string;
  time?: string;
  FirstPractice?: RawSession;
  SecondPractice?: RawSession;
  ThirdPractice?: RawSession;
  Qualifying?: RawSession;
  Sprint?: RawSession;
  SprintQualifying?: RawSession;
  Results?: RawResult[];
}

export interface RawResult {
  position: string;
  points: string;
  grid: string;
  laps: string;
  status: string;
  Driver: { givenName: string; familyName: string; code?: string; nationality?: string };
  Constructor: { name: string };
  Time?: { time: string };
  FastestLap?: { Time?: { time: string } };
}

export interface RawStanding {
  position: string;
  points: string;
  wins: string;
  Driver: { givenName: string; familyName: string; code?: string; nationality?: string };
  Constructors: Array<{ name: string }>;
}

interface JolpicaResponse {
  MRData: {
    RaceTable?: { Races?: RawRace[] };
    StandingsTable?: { StandingsLists?: Array<{ DriverStandings?: RawStanding[] }> };
  };
}

async function fetchJolpica(path: string): Promise<JolpicaResponse> {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`Jolpica respondeu ${res.status} em ${path}`);
  }
  return (await res.json()) as JolpicaResponse;
}

// ---------------------------------------------------------------------------
// Mapeamento cru -> normalizado (funções puras, exportadas para os testes).
// ---------------------------------------------------------------------------

function mapSession(raw?: RawSession): SessionTime | undefined {
  return raw ? { date: raw.date, time: raw.time } : undefined;
}

export function mapRace(raw: RawRace): RaceEvent {
  return {
    season: raw.season,
    round: Number(raw.round),
    name: raw.raceName,
    url: raw.url,
    circuitId: raw.Circuit.circuitId,
    circuitName: raw.Circuit.circuitName,
    locality: raw.Circuit.Location.locality,
    country: raw.Circuit.Location.country,
    lat: Number(raw.Circuit.Location.lat),
    long: Number(raw.Circuit.Location.long),
    date: raw.date,
    time: raw.time,
    sessions: {
      firstPractice: mapSession(raw.FirstPractice),
      secondPractice: mapSession(raw.SecondPractice),
      thirdPractice: mapSession(raw.ThirdPractice),
      qualifying: mapSession(raw.Qualifying),
      sprint: mapSession(raw.Sprint),
      sprintQualifying: mapSession(raw.SprintQualifying),
    },
  };
}

export function mapResult(raw: RawResult): ResultRow {
  return {
    position: Number(raw.position),
    driver: `${raw.Driver.givenName} ${raw.Driver.familyName}`,
    code: raw.Driver.code,
    nationality: raw.Driver.nationality,
    constructor: raw.Constructor.name,
    points: Number(raw.points),
    grid: Number(raw.grid),
    laps: Number(raw.laps),
    status: raw.status,
    time: raw.Time?.time,
    fastestLap: raw.FastestLap?.Time?.time,
  };
}

export function mapStanding(raw: RawStanding): StandingRow {
  return {
    position: Number(raw.position),
    driver: `${raw.Driver.givenName} ${raw.Driver.familyName}`,
    code: raw.Driver.code,
    nationality: raw.Driver.nationality,
    constructor: raw.Constructors[0]?.name ?? '',
    points: Number(raw.points),
    wins: Number(raw.wins),
  };
}

// ---------------------------------------------------------------------------
// API pública do serviço (com cache).
// ---------------------------------------------------------------------------

export async function getCalendar(season = 'current'): Promise<RaceEvent[]> {
  return getOrSet(`jolpica:calendar:${season}`, TTL.calendar, async () => {
    const data = await fetchJolpica(`/${encodeURIComponent(season)}.json?limit=100`);
    return (data.MRData.RaceTable?.Races ?? []).map(mapRace);
  });
}

export async function getNextRace(): Promise<RaceEvent | null> {
  return getOrSet('jolpica:next', TTL.next, async () => {
    const data = await fetchJolpica('/current/next.json');
    const raw = data.MRData.RaceTable?.Races?.[0];
    return raw ? mapRace(raw) : null;
  });
}

export async function getLastResults(): Promise<RaceResult | null> {
  return getOrSet('jolpica:last-results', TTL.results, async () => {
    const data = await fetchJolpica('/current/last/results.json');
    const raw = data.MRData.RaceTable?.Races?.[0];
    if (!raw) return null;
    return {
      season: raw.season,
      round: Number(raw.round),
      name: raw.raceName,
      circuitName: raw.Circuit.circuitName,
      date: raw.date,
      results: (raw.Results ?? []).map(mapResult),
    };
  });
}

/** Pódio (top 3) de cada etapa já disputada da temporada. */
export interface RoundPodium {
  round: number;
  name: string;
  date: string;
  podium: ResultRow[];
}

export async function getSeasonPodiums(season = 'current'): Promise<RoundPodium[]> {
  return getOrSet(`jolpica:podiums:${season}`, TTL.results, async () => {
    const seasonPath = encodeURIComponent(season);
    // /results/{posição} devolve, por corrida, quem terminou naquela posição.
    const responses = await Promise.all(
      [1, 2, 3].map((position) => fetchJolpica(`/${seasonPath}/results/${position}.json?limit=100`)),
    );

    const byRound = new Map<number, RoundPodium>();
    for (const data of responses) {
      for (const race of data.MRData.RaceTable?.Races ?? []) {
        const round = Number(race.round);
        const entry = byRound.get(round) ?? {
          round,
          name: race.raceName,
          date: race.date,
          podium: [],
        };
        entry.podium.push(...(race.Results ?? []).map(mapResult));
        byRound.set(round, entry);
      }
    }

    return [...byRound.values()]
      .map((entry) => ({ ...entry, podium: [...entry.podium].sort((a, b) => a.position - b.position) }))
      .sort((a, b) => a.round - b.round);
  });
}

export async function getDriverStandings(): Promise<StandingRow[]> {
  return getOrSet('jolpica:standings', TTL.standings, async () => {
    const data = await fetchJolpica('/current/driverStandings.json');
    const list = data.MRData.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
    return list.map(mapStanding);
  });
}
