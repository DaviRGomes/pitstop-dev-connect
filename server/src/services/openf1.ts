import { getOrSet, TTL } from '../cache.js';
import { fetchJson, UpstreamRequestError } from '../http.js';

const BASE = 'https://api.openf1.org/v1';
const TOKEN_URL = 'https://api.openf1.org/token';
const FULL_SNAPSHOT_REFRESH_MS = 15 * 60 * 1000;

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
  date_start?: string;
}

export interface OpenF1Interval {
  session_key: number;
  driver_number: number;
  date: string;
  gap_to_leader: number | string | null; // número em segundos ou "+1 LAP"; null p/ líder
  interval: number | string | null;
}

interface TokenResponse {
  access_token?: string;
  expires_in?: string | number;
}

interface ManagedToken {
  value: string;
  expiresAt: number;
}

interface AuthContext {
  token: string;
  managed: boolean;
}

let managedToken: ManagedToken | null = null;
let managedTokenRequest: Promise<ManagedToken> | null = null;
let warnedIncompleteCredentials = false;

async function requestManagedToken(username: string, password: string): Promise<ManagedToken> {
  const body = new URLSearchParams({ username, password });
  const data = await fetchJson<TokenResponse>(
    'OpenF1 auth',
    TOKEN_URL,
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body,
    },
    { retries: 0 },
  );

  const value = data.access_token?.trim();
  if (!value) throw new UpstreamRequestError('OpenF1 auth');

  const seconds = Number(data.expires_in);
  const lifetimeMs = Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 55 * 60 * 1000;
  const safetyMarginMs = Math.min(60_000, Math.max(5_000, lifetimeMs * 0.1));
  return { value, expiresAt: Date.now() + lifetimeMs - safetyMarginMs };
}

async function getAuthContext(): Promise<AuthContext | null> {
  const directToken = process.env.OPENF1_ACCESS_TOKEN?.trim();
  if (directToken) return { token: directToken, managed: false };

  const username = process.env.OPENF1_USERNAME?.trim();
  const password = process.env.OPENF1_PASSWORD;
  if (!username || !password) {
    if ((username || password) && !warnedIncompleteCredentials) {
      console.warn('[openf1] OPENF1_USERNAME e OPENF1_PASSWORD devem ser configurados juntos');
      warnedIncompleteCredentials = true;
    }
    return null;
  }

  if (managedToken && managedToken.expiresAt > Date.now()) {
    return { token: managedToken.value, managed: true };
  }

  if (!managedTokenRequest) {
    // O cleanup acontece na mesma cadeia consumida pelos chamadores. Criar uma
    // Promise separada com `void request.finally(...)` pode gerar rejection não
    // observada quando a autenticação falha.
    managedTokenRequest = (async () => {
      try {
        return await requestManagedToken(username, password);
      } finally {
        managedTokenRequest = null;
      }
    })();
  }

  managedToken = await managedTokenRequest;
  return { token: managedToken.value, managed: true };
}

async function fetchOpenF1<T>(path: string): Promise<T> {
  let auth = await getAuthContext();

  const execute = (context: AuthContext | null) => {
    const headers: Record<string, string> = { accept: 'application/json' };
    if (context) headers.authorization = `Bearer ${context.token}`;
    return fetchJson<T>('OpenF1', `${BASE}${path}`, { headers });
  };

  try {
    return await execute(auth);
  } catch (error) {
    // Token obtido por usuário/senha pode expirar ou ser revogado antes do TTL.
    if (error instanceof UpstreamRequestError && error.status === 401 && auth?.managed) {
      managedToken = null;
      auth = await getAuthContext();
      return execute(auth);
    }
    throw error;
  }
}

/**
 * Alguns endpoints (ex.: intervals fora de corrida) respondem um objeto de
 * erro em vez de array; normaliza para array vazio.
 */
function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

interface LatestSnapshot<T> {
  byDriver: Map<number, T>;
  cursor: string | null;
  fullFetchedAt: number;
}

/**
 * Faz uma leitura completa no início e depois pede apenas eventos posteriores
 * ao último timestamp, incluindo novamente a fronteira do cursor. Uma leitura
 * integral periódica corrige atualizações
 * retroativas ou perda eventual de uma janela incremental.
 */
async function getLatestSnapshot<T extends { driver_number: number }>(
  kind: 'positions' | 'intervals',
  endpoint: 'position' | 'intervals',
  sessionKey: number,
  ttlMs: number,
  dateOf: (row: T) => string,
): Promise<T[]> {
  return getOrSet(`openf1:${kind}:${sessionKey}`, ttlMs, async () => {
    const state = await getOrSet<LatestSnapshot<T>>(
      `openf1:snapshot:${kind}:${sessionKey}`,
      TTL.liveSnapshot,
      async () => ({ byDriver: new Map(), cursor: null, fullFetchedAt: 0 }),
    );

    const now = Date.now();
    const fullRefresh = !state.cursor || now - state.fullFetchedAt >= FULL_SNAPSHOT_REFRESH_MS;
    const filter = !fullRefresh && state.cursor ? `&date>=${encodeURIComponent(state.cursor)}` : '';
    const rows = asArray<T>(await fetchOpenF1(`/${endpoint}?session_key=${sessionKey}${filter}`));

    if (fullRefresh) {
      state.byDriver.clear();
      state.cursor = null;
      state.fullFetchedAt = now;
    }

    for (const row of rows) {
      const date = dateOf(row);
      const current = state.byDriver.get(row.driver_number);
      if (!current || date >= dateOf(current)) state.byDriver.set(row.driver_number, row);
      if (date && (!state.cursor || date > state.cursor)) state.cursor = date;
    }

    return [...state.byDriver.values()];
  });
}

interface LapSnapshot {
  byLap: Map<string, OpenF1Lap>;
  cursor: string | null;
  fullFetchedAt: number;
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

/** Última posição conhecida por piloto, atualizada de forma incremental. */
export async function getSessionPositions(sessionKey: number): Promise<OpenF1Position[]> {
  return getLatestSnapshot('positions', 'position', sessionKey, TTL.live, (row: OpenF1Position) => row.date);
}

/** Melhor volta conhecida por piloto, atualizada de forma incremental. */
export async function getSessionLaps(sessionKey: number): Promise<OpenF1Lap[]> {
  return getOrSet(`openf1:laps:${sessionKey}`, TTL.laps, async () => {
    const state = await getOrSet<LapSnapshot>(
      `openf1:snapshot:laps:${sessionKey}`,
      TTL.liveSnapshot,
      async () => ({ byLap: new Map(), cursor: null, fullFetchedAt: 0 }),
    );

    const now = Date.now();
    const fullRefresh = !state.cursor || now - state.fullFetchedAt >= FULL_SNAPSHOT_REFRESH_MS;
    const filter = !fullRefresh && state.cursor
      ? `&date_start>=${encodeURIComponent(state.cursor)}`
      : '';
    const rows = asArray<OpenF1Lap>(
      await fetchOpenF1(`/laps?session_key=${sessionKey}${filter}`),
    );

    if (fullRefresh) {
      state.byLap.clear();
      state.cursor = null;
      state.fullFetchedAt = now;
    }

    for (const lap of rows) {
      if (lap.date_start && (!state.cursor || lap.date_start > state.cursor)) {
        state.cursor = lap.date_start;
      }
      // Guardar a volta por identidade permite substituir correções publicadas
      // com o mesmo date_start (inclusive invalidação para duration=null).
      state.byLap.set(`${lap.driver_number}:${lap.lap_number}`, lap);
    }

    const bestByDriver = new Map<number, OpenF1Lap>();
    for (const lap of state.byLap.values()) {
      if (typeof lap.lap_duration !== 'number' || !Number.isFinite(lap.lap_duration)) continue;
      const current = bestByDriver.get(lap.driver_number);
      if (
        !current ||
        typeof current.lap_duration !== 'number' ||
        lap.lap_duration < current.lap_duration
      ) {
        bestByDriver.set(lap.driver_number, lap);
      }
    }

    return [...bestByDriver.values()];
  });
}

/** Último gap conhecido por piloto (vazio fora de corrida/sprint). */
export async function getSessionIntervals(sessionKey: number): Promise<OpenF1Interval[]> {
  return getLatestSnapshot('intervals', 'intervals', sessionKey, TTL.live, (row: OpenF1Interval) => row.date);
}
