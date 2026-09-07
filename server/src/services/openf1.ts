import { getOrSet, TTL } from '../cache';

const BASE = 'https://api.openf1.org/v1';

/** Meeting como a OpenF1 devolve (nomes de campo da própria API). */
export interface OpenF1Meeting {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  circuit_key: number;
  circuit_short_name: string;
  circuit_image?: string | null;
  country_name: string;
  country_code: string;
  country_flag?: string | null;
  location: string;
  date_start: string;
  date_end?: string;
  year: number;
}

export interface OpenF1Session {
  session_key: number;
  meeting_key: number;
  session_name: string; // "Race", "Sprint", "Qualifying", "Practice 1"…
  session_type: string; // "Race", "Qualifying", "Practice"
  circuit_key: number;
  circuit_short_name: string;
  country_name: string;
  location: string;
  date_start: string;
  date_end: string;
  year: number;
}

export interface OpenF1Position {
  session_key: number;
  meeting_key: number;
  driver_number: number;
  date: string;
  position: number;
}

export interface OpenF1Driver {
  session_key: number;
  driver_number: number;
  full_name: string;
  name_acronym: string;
  team_name: string | null;
  team_colour: string | null;
  headshot_url?: string | null;
}

export interface OpenF1Lap {
  session_key: number;
  driver_number: number;
  lap_number: number;
  lap_duration: number | null; // segundos; null em volta não cronometrada (out lap, box)
}

export interface OpenF1Interval {
  session_key: number;
  driver_number: number;
  date: string;
  gap_to_leader: number | string | null; // número em segundos ou "+1 LAP"; null p/ líder
  interval: number | string | null;
}

async function fetchOpenF1<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    throw new Error(`OpenF1 respondeu ${res.status} em ${path}`);
  }
  return (await res.json()) as T;
}

/**
 * Alguns endpoints (ex.: intervals fora de corrida) respondem um objeto de
 * erro em vez de array; normaliza para array vazio.
 */
function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export async function getMeetings(year: number): Promise<OpenF1Meeting[]> {
  return getOrSet(`openf1:meetings:${year}`, TTL.meetings, async () => {
    return asArray<OpenF1Meeting>(await fetchOpenF1(`/meetings?year=${year}`));
  });
}

/** Sessão mais recente (ou em andamento) segundo a OpenF1. */
export async function getLatestSession(): Promise<OpenF1Session | null> {
  return getOrSet('openf1:session:latest', TTL.session, async () => {
    const sessions = asArray<OpenF1Session>(await fetchOpenF1('/sessions?session_key=latest'));
    return sessions[0] ?? null;
  });
}

export async function getSessionDrivers(sessionKey: number): Promise<OpenF1Driver[]> {
  return getOrSet(`openf1:drivers:${sessionKey}`, TTL.drivers, async () => {
    return asArray<OpenF1Driver>(await fetchOpenF1(`/drivers?session_key=${sessionKey}`));
  });
}

/** Histórico completo de posições da sessão (reduzimos em services/live.ts). */
export async function getSessionPositions(sessionKey: number): Promise<OpenF1Position[]> {
  return getOrSet(`openf1:positions:${sessionKey}`, TTL.live, async () => {
    return asArray<OpenF1Position>(await fetchOpenF1(`/position?session_key=${sessionKey}`));
  });
}

/** Todas as voltas da sessão; reduzimos à melhor de cada piloto em services/live.ts. */
export async function getSessionLaps(sessionKey: number): Promise<OpenF1Lap[]> {
  return getOrSet(`openf1:laps:${sessionKey}`, TTL.laps, async () => {
    return asArray<OpenF1Lap>(await fetchOpenF1(`/laps?session_key=${sessionKey}`));
  });
}

/** Histórico de gaps (só existe em corrida/sprint; vazio nas demais sessões). */
export async function getSessionIntervals(sessionKey: number): Promise<OpenF1Interval[]> {
  return getOrSet(`openf1:intervals:${sessionKey}`, TTL.live, async () => {
    return asArray<OpenF1Interval>(await fetchOpenF1(`/intervals?session_key=${sessionKey}`));
  });
}
