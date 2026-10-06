import {
  formatGap,
  formatLapTime,
  getF1DateFormatters,
  type F1Locale,
  type LiveState,
} from "@/lib/f1";
import { F1_COPY } from "./i18n";

export function LiveBoard({
  live,
  onShowCalendar,
  locale,
}: {
  live: LiveState;
  onShowCalendar: () => void;
  locale: F1Locale;
}) {
  const copy = F1_COPY[locale];
  const { timeWithSeconds } = getF1DateFormatters(locale);
  const session = live.session;
  const label = session ? (copy.sessionLabels[session.name] ?? session.name) : copy.sessionFallback;
  const rows = live.standings.slice(0, 10);

  // gap só faz sentido em corrida/sprint (a OpenF1 nem manda intervals fora delas)
  const isRace = session?.type === "Race";
  // volta mais rápida da sessão inteira (pode estar fora do top 10) pro roxo da F1
  const lapTimes = live.standings
    .map((row) => row.bestLap)
    .filter((lap): lap is number => lap != null);
  const fastestLap = lapTimes.length ? Math.min(...lapTimes) : null;

  return (
    <div className="race-panel live-board">
      <header className="live-head">
        <span className="live-dot" aria-hidden="true" />
        <span className="live-title">
          {label} · {session?.circuit ?? "F1"}
        </span>
        <button type="button" className="live-cal-btn" onClick={onShowCalendar}>
          {copy.calendar}
        </button>
      </header>

      {rows.length === 0 ? (
        <p className="live-empty">{copy.waitingTelemetry}</p>
      ) : (
        <ol className="live-rows">
          {rows.map((row) => (
            <li key={row.driverNumber} className="live-row">
              <span className="live-pos">{row.position}</span>
              <span
                className="live-team"
                style={row.teamColor ? { background: `#${row.teamColor}` } : undefined}
                aria-hidden="true"
              />
              <span className="live-code">{row.code}</span>
              <span className="live-driver">{row.team}</span>
              <span
                className={`live-lap${row.bestLap != null && row.bestLap === fastestLap ? " is-fastest" : ""}`}
              >
                {formatLapTime(row.bestLap)}
              </span>
              {isRace && <span className="live-gap">{formatGap(row, locale)}</span>}
            </li>
          ))}
        </ol>
      )}

      <footer className="live-foot">
        <span>{copy.liveRefresh}</span>
        <span>
          {timeWithSeconds.format(new Date(live.updatedAt))} {copy.timeZoneShort}
        </span>
      </footer>
    </div>
  );
}
