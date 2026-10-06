import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  getF1DateFormatters,
  nextRaceIndex,
  raceStart,
  trackIcon,
  type F1Locale,
  type RaceEvent,
  type RoundPodium,
  type SessionTime,
} from "@/lib/f1";
import { F1_COPY } from "./i18n";

export function RaceCarousel({
  races,
  podiums,
  locale,
}: {
  races: RaceEvent[];
  podiums: RoundPodium[];
  locale: F1Locale;
}) {
  const startIndex = nextRaceIndex(races);
  const podiumByRound = new Map(podiums.map((p) => [p.round, p]));

  return (
    <Carousel opts={{ startIndex, align: "start" }} className="race-carousel">
      <CarouselContent>
        {races.map((race, i) => (
          <CarouselItem key={race.round}>
            <RaceCard
              race={race}
              podium={podiumByRound.get(race.round)}
              isNext={i === startIndex}
              locale={locale}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="race-nav race-nav-prev" />
      <CarouselNext className="race-nav race-nav-next" />
    </Carousel>
  );
}

function RaceCard({
  race,
  podium,
  isNext,
  locale,
}: {
  race: RaceEvent;
  podium?: RoundPodium;
  isNext: boolean;
  locale: F1Locale;
}) {
  const copy = F1_COPY[locale];
  const { day, time } = getF1DateFormatters(locale);
  const start = raceStart(race);
  const icon = trackIcon(race);
  const done = Boolean(podium);

  return (
    <article className={`race-card${isNext ? " is-next" : ""}`}>
      <header className="race-top">
        <div className="race-meta">
          <span className="race-round">R{String(race.round).padStart(2, "0")}</span>
          {isNext && <span className="race-badge">{copy.nextRound}</span>}
          {done && <span className="race-badge done">{copy.finished}</span>}
          {race.countryFlag && (
            <img className="race-flag" src={race.countryFlag} alt={race.country} loading="lazy" />
          )}
        </div>

        {icon ? (
          <img
            className="race-track"
            src={icon}
            alt={copy.trackAlt(race.circuitName)}
            loading="lazy"
            onError={(e) => {
              // PNG local ainda não baixado? cai pra imagem do CDN da F1
              if (race.circuitImage && e.currentTarget.src !== race.circuitImage) {
                e.currentTarget.src = race.circuitImage;
              }
            }}
          />
        ) : (
          <div className="race-track" aria-hidden="true" />
        )}

        <h3 className="race-name">{race.name}</h3>
        <p className="race-circuit">{race.circuitName}</p>
        <p className="race-place">
          {race.locality} · {race.country}
        </p>
        <p className="race-when">
          {day.format(start)}
          {race.time ? copy.raceTime(time.format(start)) : copy.raceTimeTbd}
        </p>
      </header>

      <div className="race-bottom">
        {done && podium ? (
          <Podium locale={locale} podium={podium} />
        ) : isNext ? (
          <Countdown locale={locale} target={start} />
        ) : (
          <UpcomingSessions locale={locale} sessions={race.sessions} />
        )}
      </div>
    </article>
  );
}

function Podium({ podium, locale }: { podium: RoundPodium; locale: F1Locale }) {
  const copy = F1_COPY[locale];
  return (
    <div className="race-podium">
      <p className="race-bottom-label">{copy.podium}</p>
      <ol>
        {podium.podium.map((p) => (
          <li key={p.position} className={`podium-row p${p.position}`}>
            <span className="podium-pos">{copy.ordinal(p.position)}</span>
            <span className="podium-driver">{p.driver}</span>
            <span className="podium-team">{p.constructor}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Countdown({ target, locale }: { target: Date; locale: F1Locale }) {
  const copy = F1_COPY[locale];
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = target.getTime() - now;
  if (diff <= 0) {
    return (
      <div className="race-count">
        <p className="race-bottom-label">{copy.lightsOut}</p>
        <p className="race-count-live">{copy.connectingLive}</p>
      </div>
    );
  }

  const total = Math.floor(diff / 1000);
  const cells: Array<[string, number]> = [
    [copy.countdownUnits[0], Math.floor(total / 86_400)],
    [copy.countdownUnits[1], Math.floor((total % 86_400) / 3_600)],
    [copy.countdownUnits[2], Math.floor((total % 3_600) / 60)],
    [copy.countdownUnits[3], total % 60],
  ];

  return (
    <div className="race-count" role="timer" aria-label={copy.countdownAria}>
      <p className="race-bottom-label">{copy.countdownTitle}</p>
      <div className="race-count-grid">
        {cells.map(([label, value]) => (
          <div key={label} className="race-count-cell">
            <span className="race-count-num">{String(value).padStart(2, "0")}</span>
            <span className="race-count-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingSessions({
  sessions,
  locale,
}: {
  sessions: RaceEvent["sessions"];
  locale: F1Locale;
}) {
  const copy = F1_COPY[locale];
  const { day, time } = getF1DateFormatters(locale);
  const rows = copy.upcomingSessions
    .map(([label, key]) => [label, sessions[key]] as const)
    .filter((row): row is readonly [string, SessionTime] => Boolean(row[1]));

  return (
    <div className="race-podium">
      <p className="race-bottom-label">{copy.weekendTitle}</p>
      {rows.length === 0 ? (
        <p className="race-tbd">{copy.scheduleTbd}</p>
      ) : (
        <ol>
          {rows.map(([label, session]) => {
            const when = new Date(`${session.date}T${session.time ?? "00:00:00Z"}`);
            return (
              <li key={label} className="podium-row">
                <span className="podium-driver">{label}</span>
                <span className="podium-team">
                  {day.format(when)}
                  {session.time ? ` · ${time.format(when)}` : ""}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
