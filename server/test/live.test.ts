import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearCache } from '../src/cache';
import { bestLapByDriver, getLiveState, isSessionLive, latestByDriver } from '../src/services/live';
import type { OpenF1Session } from '../src/services/openf1';
import driversFixture from './fixtures/openf1-drivers.json';
import intervalsFixture from './fixtures/openf1-intervals.json';
import lapsFixture from './fixtures/openf1-laps.json';
import positionsFixture from './fixtures/openf1-positions.json';
import sessionFixture from './fixtures/openf1-session.json';

// Corrida do fixture: 2026-07-05 14:00 → 16:00 UTC
const session = sessionFixture[0] as OpenF1Session;

const at = (iso: string) => Date.parse(iso);

const fetchMock = vi.fn();

function stubRoutes(overrides: Partial<Record<'sessions' | 'position' | 'drivers' | 'intervals' | 'laps', () => Promise<Response>>> = {}) {
  const json = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body)));
  fetchMock.mockImplementation((input: unknown) => {
    const url = String(input);
    if (url.includes('/sessions')) return (overrides.sessions ?? (() => json(sessionFixture)))();
    if (url.includes('/position')) return (overrides.position ?? (() => json(positionsFixture)))();
    if (url.includes('/drivers')) return (overrides.drivers ?? (() => json(driversFixture)))();
    if (url.includes('/intervals')) return (overrides.intervals ?? (() => json(intervalsFixture)))();
    if (url.includes('/laps')) return (overrides.laps ?? (() => json(lapsFixture)))();
    throw new Error(`URL inesperada no teste: ${url}`);
  });
}

beforeEach(() => {
  clearCache();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('isSessionLive', () => {
  it('é true durante a sessão e na janela de tolerância', () => {
    expect(isSessionLive(session, at('2026-07-05T14:30:00Z'))).toBe(true);
    expect(isSessionLive(session, at('2026-07-05T13:55:00Z'))).toBe(true); // 10min antes
    expect(isSessionLive(session, at('2026-07-05T16:45:00Z'))).toBe(true); // pós bandeirada
  });

  it('é false bem antes e bem depois da sessão', () => {
    expect(isSessionLive(session, at('2026-07-05T10:00:00Z'))).toBe(false);
    expect(isSessionLive(session, at('2026-07-05T18:00:00Z'))).toBe(false);
  });

  it('treino livre não estica: só uma tolerância curta após o fim programado', () => {
    const practice: OpenF1Session = { ...session, session_name: 'Practice 2', session_type: 'Practice' };
    expect(isSessionLive(practice, at('2026-07-05T15:59:00Z'))).toBe(true);
    expect(isSessionLive(practice, at('2026-07-05T16:03:00Z'))).toBe(true); // últimos dados chegando
    expect(isSessionLive(practice, at('2026-07-05T16:20:00Z'))).toBe(false); // corrida ainda seria true
  });
});

describe('bestLapByDriver', () => {
  it('pega a menor volta cronometrada e ignora voltas sem tempo', () => {
    const best = bestLapByDriver(lapsFixture);

    expect(best.get(1)).toBe(88.123);
    expect(best.get(63)).toBe(89.001);
    expect(best.has(12)).toBe(false); // só tem out lap (duration null)
  });
});

describe('latestByDriver', () => {
  it('mantém só a entrada mais recente de cada piloto', () => {
    const rows = [
      { driver_number: 1, date: '2026-07-05T14:10:00Z', position: 2 },
      { driver_number: 1, date: '2026-07-05T14:25:00Z', position: 1 },
      { driver_number: 63, date: '2026-07-05T14:25:00Z', position: 2 },
      { driver_number: 63, date: '2026-07-05T14:10:00Z', position: 1 },
    ];

    const latest = latestByDriver(rows);

    expect(latest.get(1)?.position).toBe(1);
    expect(latest.get(63)?.position).toBe(2);
  });
});

describe('getLiveState', () => {
  it('monta o placar juntando posições, pilotos e gaps durante a corrida', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-05T14:30:00Z'));
    stubRoutes();

    const state = await getLiveState();

    expect(state.live).toBe(true);
    expect(state.session).toMatchObject({ name: 'Race', circuit: 'Silverstone', sessionKey: 11323 });
    expect(state.standings).toHaveLength(3);

    const [p1, p2, p3] = state.standings;
    // a última posição de cada piloto vence (Norris ultrapassou Russell)
    expect(p1).toMatchObject({ position: 1, code: 'NOR', name: 'Lando NORRIS', team: 'McLaren', teamColor: 'F47600', gapToLeader: null, bestLap: 88.123 });
    expect(p2).toMatchObject({ position: 2, code: 'RUS', gapToLeader: 1.234, bestLap: 89.001 });
    expect(p3).toMatchObject({ position: 3, code: 'ANT', gapToLeader: '+1 LAP', bestLap: null });
  });

  it('fora da janela devolve live=false sem buscar posições', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-01T12:00:00Z'));
    stubRoutes();

    const state = await getLiveState();

    expect(state.live).toBe(false);
    expect(state.session?.name).toBe('Race');
    expect(state.standings).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1); // só /sessions
  });

  it('sem sessão nenhuma devolve live=false e session=null', async () => {
    stubRoutes({ sessions: () => Promise.resolve(new Response('[]')) });

    const state = await getLiveState();

    expect(state).toMatchObject({ live: false, session: null, standings: [] });
  });

  it('degrada quando drivers, intervals e laps falham: placar sai só com posições', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-05T14:30:00Z'));
    stubRoutes({
      drivers: () => Promise.resolve(new Response('erro', { status: 500 })),
      intervals: () => Promise.reject(new Error('OpenF1 intervals fora')),
      laps: () => Promise.reject(new Error('OpenF1 laps fora')),
    });

    const state = await getLiveState();

    expect(state.live).toBe(true);
    expect(state.standings).toHaveLength(3);
    expect(state.standings[0]).toMatchObject({
      position: 1,
      driverNumber: 1,
      code: '#1',
      name: 'Piloto 1',
      gapToLeader: null,
      bestLap: null,
    });
  });
});
