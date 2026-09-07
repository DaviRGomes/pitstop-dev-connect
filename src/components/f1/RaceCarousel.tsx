import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  fmtDia,
  fmtHora,
  nextRaceIndex,
  raceStart,
  trackIcon,
  type RaceEvent,
  type RoundPodium,
  type SessionTime,
} from "@/lib/f1";

export function RaceCarousel({
  races,
  podiums,
}: {
  races: RaceEvent[];
  podiums: RoundPodium[];
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
}: {
  race: RaceEvent;
  podium?: RoundPodium;
  isNext: boolean;
}) {
  const start = raceStart(race);
  const icon = trackIcon(race);
  const done = Boolean(podium);

  return (
    <article className={`race-card${isNext ? " is-next" : ""}`}>
      <header className="race-top">
        <div className="race-meta">
          <span className="race-round">R{String(race.round).padStart(2, "0")}</span>
          {isNext && <span className="race-badge">próxima etapa</span>}
          {done && <span className="race-badge done">bandeirada</span>}
          {race.countryFlag && (
            <img className="race-flag" src={race.countryFlag} alt={race.country} loading="lazy" />
          )}
        </div>

        {icon ? (
          <img
            className="race-track"
            src={icon}
            alt={`Traçado de ${race.circuitName}`}
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
          {fmtDia.format(start)}
          {race.time ? ` · ${fmtHora.format(start)} em São Paulo` : " · horário a confirmar"}
        </p>
      </header>

      <div className="race-bottom">
        {done && podium ? (
          <Podium podium={podium} />
        ) : isNext ? (
          <Countdown target={start} />
        ) : (
          <UpcomingSessions sessions={race.sessions} />
        )}
      </div>
    </article>
  );
}

function Podium({ podium }: { podium: RoundPodium }) {
  return (
    <div className="race-podium">
      <p className="race-bottom-label">pódio</p>
      <ol>
        {podium.podium.map((p) => (
          <li key={p.position} className={`podium-row p${p.position}`}>
            <span className="podium-pos">{p.position}º</span>
            <span className="podium-driver">{p.driver}</span>
            <span className="podium-team">{p.constructor}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Countdown({ target }: { target: Date }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = target.getTime() - now;
  if (diff <= 0) {
    return (
      <div className="race-count">
        <p className="race-bottom-label">largada!</p>
        <p className="race-count-live">é agora, ligando a telemetria ao vivo…</p>
      </div>
    );
  }

  const total = Math.floor(diff / 1000);
  const cells: Array<[string, number]> = [
    ["dias", Math.floor(total / 86_400)],
    ["horas", Math.floor((total % 86_400) / 3_600)],
    ["min", Math.floor((total % 3_600) / 60)],
    ["seg", total % 60],
  ];

  return (
    <div className="race-count" role="timer" aria-label="Contagem regressiva para a largada">
      <p className="race-bottom-label">contagem pra largada · horário de SP</p>
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

function UpcomingSessions({ sessions }: { sessions: RaceEvent["sessions"] }) {
  const rows = (
    [
      ["treino livre 1", sessions.firstPractice],
      ["quali sprint", sessions.sprintQualifying],
      ["sprint", sessions.sprint],
      ["classificação", sessions.qualifying],
    ] as Array<[string, SessionTime | undefined]>
  ).filter((row): row is [string, SessionTime] => Boolean(row[1]));

  return (
    <div className="race-podium">
      <p className="race-bottom-label">fim de semana · horário de SP</p>
      {rows.length === 0 ? (
        <p className="race-tbd">programação ainda não confirmada</p>
      ) : (
        <ol>
          {rows.map(([label, session]) => {
            const when = new Date(`${session.date}T${session.time ?? "00:00:00Z"}`);
            return (
              <li key={label} className="podium-row">
                <span className="podium-driver">{label}</span>
                <span className="podium-team">
                  {fmtDia.format(when)}
                  {session.time ? ` · ${fmtHora.format(when)}` : ""}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
