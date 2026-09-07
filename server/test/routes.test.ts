import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearCache } from '../src/cache';
import { app } from '../src/index';
import nextFixture from './fixtures/jolpica-next.json';

const fetchMock = vi.fn();

beforeEach(() => {
  clearCache();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

describe('GET /api/health', () => {
  it('responde 200 com ok, service e time', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.service).toBe('pitstop-server');
    expect(typeof res.body.time).toBe('string');
  });
});

describe('GET /api/f1/next', () => {
  it('devolve a próxima corrida no formato normalizado', async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(nextFixture)));

    const res = await request(app).get('/api/f1/next');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      name: 'British Grand Prix',
      circuitName: 'Silverstone Circuit',
      date: '2026-07-05',
      round: 9,
      country: 'UK',
    });
    expect(res.body.sessions.qualifying).toEqual({ date: '2026-07-04', time: '15:00:00Z' });
  });
});

describe('erro de upstream', () => {
  it('responde 502 com { ok: false } quando o fetch rejeita', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockRejectedValue(new Error('rede indisponível'));

    const res = await request(app).get('/api/f1/next');

    expect(res.status).toBe(502);
    expect(res.body.ok).toBe(false);
    expect(res.body.error).toContain('rede indisponível');
    expect(error).toHaveBeenCalled();
  });

  it('responde 502 quando a upstream devolve status de erro', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockResolvedValue(new Response('erro', { status: 500 }));

    const res = await request(app).get('/api/f1/standings');

    expect(res.status).toBe(502);
    expect(res.body.ok).toBe(false);
  });
});

describe('GET /api/f1/live', () => {
  it('devolve live=false quando a última sessão já terminou', async () => {
    const pastSession = [
      {
        session_key: 9001,
        meeting_key: 900,
        session_name: 'Race',
        session_type: 'Race',
        circuit_key: 2,
        circuit_short_name: 'Silverstone',
        country_name: 'United Kingdom',
        location: 'Silverstone',
        date_start: '2020-07-05T14:00:00+00:00',
        date_end: '2020-07-05T16:00:00+00:00',
        year: 2020,
      },
    ];
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(pastSession)));

    const res = await request(app).get('/api/f1/live');

    expect(res.status).toBe(200);
    expect(res.body.live).toBe(false);
    expect(res.body.session).toMatchObject({ name: 'Race', circuit: 'Silverstone' });
    expect(res.body.standings).toEqual([]);
  });
});

describe('POST /api/cache/clear', () => {
  it('limpa o cache e devolve ok', async () => {
    const res = await request(app).post('/api/cache/clear');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, cleared: true });
  });
});
