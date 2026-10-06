import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearCache } from '../src/cache';
import {
  getMeetings,
  getSessionLaps,
  getSessionPositions,
  type OpenF1Lap,
  type OpenF1Position,
} from '../src/services/openf1';

const fetchMock = vi.fn();

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

beforeEach(() => {
  clearCache();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  process.env.UPSTREAM_GET_RETRIES = '0';
  delete process.env.OPENF1_ACCESS_TOKEN;
  delete process.env.OPENF1_USERNAME;
  delete process.env.OPENF1_PASSWORD;
});

afterEach(() => {
  vi.useRealTimers();
  delete process.env.UPSTREAM_GET_RETRIES;
  delete process.env.OPENF1_ACCESS_TOKEN;
  delete process.env.OPENF1_USERNAME;
  delete process.env.OPENF1_PASSWORD;
});

describe('snapshots incrementais', () => {
  it('repete a fronteira do cursor para não perder pilotos no mesmo timestamp', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-05T14:10:00Z'));
    const boundary = '2026-07-05T14:10:00.000000+00:00';
    const initial: OpenF1Position[] = [
      { session_key: 1, meeting_key: 1, driver_number: 1, position: 1, date: boundary },
    ];
    const incremental: OpenF1Position[] = [
      { session_key: 1, meeting_key: 1, driver_number: 63, position: 2, date: boundary },
    ];
    fetchMock.mockResolvedValueOnce(json(initial)).mockResolvedValueOnce(json(incremental));

    await expect(getSessionPositions(1)).resolves.toHaveLength(1);
    vi.advanceTimersByTime(4_001);
    const updated = await getSessionPositions(1);

    expect(updated.map((row) => row.driver_number).sort((a, b) => a - b)).toEqual([1, 63]);
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain(
      `date>=${encodeURIComponent(boundary)}`,
    );
  });

  it('substitui uma volta corrigida e recalcula a melhor do piloto', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-05T14:10:00Z'));
    const boundary = '2026-07-05T14:10:00.000000+00:00';
    const initial: OpenF1Lap[] = [
      {
        session_key: 1,
        driver_number: 1,
        lap_number: 1,
        lap_duration: 81,
        date_start: '2026-07-05T14:09:00.000000+00:00',
      },
      {
        session_key: 1,
        driver_number: 1,
        lap_number: 2,
        lap_duration: 80,
        date_start: boundary,
      },
    ];
    const correction: OpenF1Lap[] = [
      {
        session_key: 1,
        driver_number: 1,
        lap_number: 2,
        lap_duration: null,
        date_start: boundary,
      },
    ];
    fetchMock.mockResolvedValueOnce(json(initial)).mockResolvedValueOnce(json(correction));

    await expect(getSessionLaps(1)).resolves.toMatchObject([{ lap_number: 2, lap_duration: 80 }]);
    vi.advanceTimersByTime(15_001);
    await expect(getSessionLaps(1)).resolves.toMatchObject([{ lap_number: 1, lap_duration: 81 }]);
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain(
      `date_start>=${encodeURIComponent(boundary)}`,
    );
  });
});

describe('autenticação OpenF1', () => {
  it('envia um access token direto sem expô-lo na URL', async () => {
    process.env.OPENF1_ACCESS_TOKEN = 'token-direto';
    fetchMock.mockResolvedValueOnce(json([]));

    await getMeetings(2026);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).not.toContain('token-direto');
    expect(new Headers(init.headers).get('authorization')).toBe('Bearer token-direto');
  });

  it('deduplica falha de OAuth, limpa a Promise rejeitada e permite nova tentativa', async () => {
    process.env.OPENF1_USERNAME = 'usuario';
    process.env.OPENF1_PASSWORD = 'senha';
    fetchMock.mockImplementation((input: unknown) => {
      const url = String(input);
      if (url.endsWith('/token')) return Promise.resolve(json({ error: 'denied' }, 401));
      return Promise.resolve(json([]));
    });

    const first = await Promise.allSettled([getMeetings(2024), getMeetings(2025)]);
    expect(first.map((result) => result.status)).toEqual(['rejected', 'rejected']);
    expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/token'))).toHaveLength(1);

    fetchMock.mockImplementation((input: unknown) => {
      const url = String(input);
      if (url.endsWith('/token')) {
        return Promise.resolve(json({ access_token: 'novo-token', expires_in: 3600 }));
      }
      return Promise.resolve(json([]));
    });

    await expect(getMeetings(2026)).resolves.toEqual([]);
    expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/token'))).toHaveLength(2);
  });
});
