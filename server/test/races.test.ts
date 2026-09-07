import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearCache } from '../src/cache';
import type { OpenF1Meeting } from '../src/services/openf1';
import { getEnrichedCalendar, matchMeeting } from '../src/services/races';
import type { RaceEvent } from '../src/types';
import calendarFixture from './fixtures/jolpica-next.json';
import meetingsFixture from './fixtures/openf1-meetings.json';

const meetings = meetingsFixture as OpenF1Meeting[];

function makeRace(date: string): RaceEvent {
  return {
    season: '2026',
    round: 9,
    name: 'British Grand Prix',
    circuitId: 'silverstone',
    circuitName: 'Silverstone Circuit',
    locality: 'Silverstone',
    country: 'UK',
    lat: 52.0786,
    long: -1.01694,
    date,
    time: '14:00:00Z',
    sessions: {},
  };
}

const fetchMock = vi.fn();

beforeEach(() => {
  clearCache();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

describe('matchMeeting', () => {
  it('casa a corrida com o meeting cujo intervalo cobre o dia da prova', () => {
    expect(matchMeeting(makeRace('2026-07-05'), meetings)?.meeting_name).toBe('British Grand Prix');
    expect(matchMeeting(makeRace('2026-06-28'), meetings)?.meeting_name).toBe('Austrian Grand Prix');
  });

  it('inclui os limites do intervalo (primeiro e último dia)', () => {
    expect(matchMeeting(makeRace('2026-07-03'), meetings)?.meeting_name).toBe('British Grand Prix');
  });

  it('devolve undefined quando nenhum meeting cobre a data', () => {
    expect(matchMeeting(makeRace('2026-12-25'), meetings)).toBeUndefined();
  });
});

describe('getEnrichedCalendar', () => {
  it('anexa circuitImage e countryFlag quando o meeting casa', async () => {
    fetchMock.mockImplementation(async (input: unknown) => {
      const url = String(input);
      if (url.includes('api.jolpi.ca')) return new Response(JSON.stringify(calendarFixture));
      if (url.includes('api.openf1.org')) return new Response(JSON.stringify(meetingsFixture));
      throw new Error(`URL inesperada no teste: ${url}`);
    });

    const races = await getEnrichedCalendar('2026');

    expect(races).toHaveLength(1);
    expect(races[0].name).toBe('British Grand Prix');
    expect(races[0].circuitImage).toBe('https://example.com/tracks/silverstone.png');
    expect(races[0].countryFlag).toBe('https://example.com/flags/gbr.png');
    expect(races[0].circuitSlug).toBe('silverstone');
  });

  it('degrada sem ícones quando a OpenF1 falha', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    fetchMock.mockImplementation(async (input: unknown) => {
      const url = String(input);
      if (url.includes('api.jolpi.ca')) return new Response(JSON.stringify(calendarFixture));
      return Promise.reject(new Error('OpenF1 fora do ar'));
    });

    const races = await getEnrichedCalendar('2026');

    expect(races).toHaveLength(1);
    expect(races[0].name).toBe('British Grand Prix');
    expect(races[0].circuitImage).toBeUndefined();
    expect(races[0].countryFlag).toBeUndefined();
    expect(races[0].circuitSlug).toBeUndefined();
    expect(warn).toHaveBeenCalled();
  });
});
