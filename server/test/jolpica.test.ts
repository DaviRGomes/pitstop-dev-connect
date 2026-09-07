import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearCache } from '../src/cache';
import { getDriverStandings, getLastResults, getNextRace, getSeasonPodiums } from '../src/services/jolpica';
import lastResultsFixture from './fixtures/jolpica-last-results.json';
import nextFixture from './fixtures/jolpica-next.json';
import standingsFixture from './fixtures/jolpica-standings.json';

const fetchMock = vi.fn();

function respondWith(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

beforeEach(() => {
  clearCache();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

describe('getNextRace', () => {
  it('normaliza a próxima corrida (nome, circuito, data e sessões)', async () => {
    fetchMock.mockResolvedValueOnce(respondWith(nextFixture));

    const race = await getNextRace();

    expect(race).not.toBeNull();
    expect(race?.name).toBe('British Grand Prix');
    expect(race?.circuitName).toBe('Silverstone Circuit');
    expect(race?.date).toBe('2026-07-05');
    expect(race?.time).toBe('14:00:00Z');
    expect(race?.round).toBe(9);
    expect(race?.country).toBe('UK');
    expect(race?.sessions.firstPractice).toEqual({ date: '2026-07-03', time: '11:30:00Z' });
    expect(race?.sessions.qualifying).toEqual({ date: '2026-07-04', time: '15:00:00Z' });
    expect(race?.sessions.sprint).toEqual({ date: '2026-07-04', time: '11:00:00Z' });
    // fim de semana de sprint não tem FP2/FP3
    expect(race?.sessions.secondPractice).toBeUndefined();
    expect(race?.sessions.thirdPractice).toBeUndefined();
  });

  it('chama a Jolpica com o User-Agent combinado', async () => {
    fetchMock.mockResolvedValueOnce(respondWith(nextFixture));

    await getNextRace();

    expect(fetchMock).toHaveBeenCalledWith('https://api.jolpi.ca/ergast/f1/current/next.json', {
      headers: { 'User-Agent': 'pitstop-dev-study/1.0' },
    });
  });
});

describe('getLastResults', () => {
  it('parseia posição, piloto, construtor e status de cada resultado', async () => {
    fetchMock.mockResolvedValueOnce(respondWith(lastResultsFixture));

    const last = await getLastResults();

    expect(last).not.toBeNull();
    expect(last?.name).toBe('Austrian Grand Prix');
    expect(last?.circuitName).toBe('Red Bull Ring');
    expect(last?.results).toHaveLength(3);

    const [p1, p2, p3] = last!.results;
    expect(p1.position).toBe(1);
    expect(p1.driver).toBe('Lando Norris');
    expect(p1.constructor).toBe('McLaren');
    expect(p1.points).toBe(25);
    expect(p1.grid).toBe(1);
    expect(p1.status).toBe('Finished');
    expect(p1.time).toBe('1:23:20.000');
    expect(p1.fastestLap).toBe('1:07.924');

    expect(p2.driver).toBe('Oscar Piastri');
    expect(p2.time).toBe('+2.695');

    // retardatário: sem Time nem FastestLap no cru
    expect(p3.driver).toBe('Charles Leclerc');
    expect(p3.status).toBe('+1 Lap');
    expect(p3.time).toBeUndefined();
    expect(p3.fastestLap).toBeUndefined();
  });
});

describe('getDriverStandings', () => {
  it('parseia a classificação de pilotos', async () => {
    fetchMock.mockResolvedValueOnce(respondWith(standingsFixture));

    const standings = await getDriverStandings();

    expect(standings).toHaveLength(3);
    expect(standings[0]).toEqual({
      position: 1,
      driver: 'Lando Norris',
      code: 'NOR',
      nationality: 'British',
      constructor: 'McLaren',
      points: 216,
      wins: 7,
    });
    expect(standings[2].driver).toBe('Max Verstappen');
    expect(standings[2].constructor).toBe('Red Bull');
  });
});

describe('getSeasonPodiums', () => {
  // resposta crua de /{season}/results/{posição}.json com um piloto por corrida
  const rawResult = (position: string, given: string, family: string, code: string, team: string) => ({
    position,
    points: '0',
    grid: '1',
    laps: '58',
    status: 'Finished',
    Driver: { givenName: given, familyName: family, code },
    Constructor: { name: team },
  });
  const rawRace = (round: string, raceName: string, date: string, result: unknown) => ({
    season: '2026',
    round,
    raceName,
    date,
    Circuit: { circuitId: 'c', circuitName: 'C', Location: { lat: '0', long: '0', locality: 'L', country: 'P' } },
    Results: [result],
  });
  const responseFor = (races: unknown[]) => ({ MRData: { RaceTable: { Races: races } } });

  it('agrupa os três primeiros de cada etapa por round', async () => {
    fetchMock.mockImplementation(async (input: unknown) => {
      const url = String(input);
      if (url.includes('/results/1.json')) {
        return respondWith(
          responseFor([
            rawRace('1', 'Australian Grand Prix', '2026-03-08', rawResult('1', 'George', 'Russell', 'RUS', 'Mercedes')),
            rawRace('2', 'Chinese Grand Prix', '2026-03-15', rawResult('1', 'Lando', 'Norris', 'NOR', 'McLaren')),
          ]),
        );
      }
      if (url.includes('/results/2.json')) {
        return respondWith(
          responseFor([
            rawRace('1', 'Australian Grand Prix', '2026-03-08', rawResult('2', 'Lando', 'Norris', 'NOR', 'McLaren')),
            rawRace('2', 'Chinese Grand Prix', '2026-03-15', rawResult('2', 'Kimi', 'Antonelli', 'ANT', 'Mercedes')),
          ]),
        );
      }
      if (url.includes('/results/3.json')) {
        return respondWith(
          responseFor([
            rawRace('1', 'Australian Grand Prix', '2026-03-08', rawResult('3', 'Charles', 'Leclerc', 'LEC', 'Ferrari')),
            rawRace('2', 'Chinese Grand Prix', '2026-03-15', rawResult('3', 'Max', 'Verstappen', 'VER', 'Red Bull')),
          ]),
        );
      }
      throw new Error(`URL inesperada no teste: ${url}`);
    });

    const podiums = await getSeasonPodiums('2026');

    expect(podiums).toHaveLength(2);
    expect(podiums[0]).toMatchObject({ round: 1, name: 'Australian Grand Prix', date: '2026-03-08' });
    expect(podiums[0].podium.map((p) => [p.position, p.driver])).toEqual([
      [1, 'George Russell'],
      [2, 'Lando Norris'],
      [3, 'Charles Leclerc'],
    ]);
    expect(podiums[1].round).toBe(2);
    expect(podiums[1].podium[0].constructor).toBe('McLaren');
  });
});

describe('erros HTTP', () => {
  it('lança quando a Jolpica responde !ok', async () => {
    fetchMock.mockResolvedValue(respondWith({ erro: true }, 500));

    await expect(getNextRace()).rejects.toThrow(/500/);
    await expect(getDriverStandings()).rejects.toThrow(/500/);
  });
});
