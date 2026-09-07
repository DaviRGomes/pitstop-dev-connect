import { dayOf, slug } from '../utils';
import type { RaceEvent } from '../types';
import { getCalendar } from './jolpica';
import { getMeetings, type OpenF1Meeting } from './openf1';

/**
 * Encontra o meeting da OpenF1 cujo fim de semana cobre o dia da corrida:
 * dayOf(date_start) <= race.date <= dayOf(date_end).
 */
export function matchMeeting(race: RaceEvent, meetings: OpenF1Meeting[]): OpenF1Meeting | undefined {
  return meetings.find((m) => {
    if (!m.date_start) return false;
    const start = dayOf(m.date_start);
    const end = dayOf(m.date_end ?? m.date_start);
    return start <= race.date && race.date <= end;
  });
}

function seasonYear(season: string, calendar: RaceEvent[]): number {
  if (/^\d{4}$/.test(season)) return Number(season);
  const year = Number(calendar[0]?.season);
  return Number.isInteger(year) && year > 0 ? year : new Date().getFullYear();
}

/**
 * Calendário da Jolpica enriquecido com circuitImage/countryFlag da OpenF1.
 * Se a OpenF1 estiver fora do ar, devolve o calendário sem os ícones.
 */
export async function getEnrichedCalendar(season = 'current'): Promise<RaceEvent[]> {
  const calendar = await getCalendar(season);

  let meetings: OpenF1Meeting[];
  try {
    meetings = await getMeetings(seasonYear(season, calendar));
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`[races] OpenF1 indisponível (${reason}); devolvendo calendário sem ícones`);
    return calendar;
  }

  return calendar.map((race) => {
    const meeting = matchMeeting(race, meetings);
    if (!meeting) return race;
    return {
      ...race,
      circuitImage: meeting.circuit_image ?? undefined,
      countryFlag: meeting.country_flag ?? undefined,
      circuitSlug: slug(meeting.circuit_short_name),
    };
  });
}
