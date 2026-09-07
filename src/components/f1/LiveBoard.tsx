import { fmtHoraSeg, formatGap, formatLapTime, type LiveState } from "@/lib/f1";

const SESSION_LABELS: Record<string, string> = {
  Race: "Corrida",
  Sprint: "Sprint",
  Qualifying: "Classificação",
  "Sprint Qualifying": "Quali Sprint",
  "Practice 1": "Treino Livre 1",
  "Practice 2": "Treino Livre 2",
  "Practice 3": "Treino Livre 3",
};

export function LiveBoard({
  live,
  onShowCalendar,
}: {
  live: LiveState;
  onShowCalendar: () => void;
}) {
  const session = live.session;
  const label = session ? (SESSION_LABELS[session.name] ?? session.name) : "Sessão";
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
          calendário
        </button>
      </header>

      {rows.length === 0 ? (
        <p className="live-empty">bandeira verde, aguardando o sinal de telemetria…</p>
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
              <span className={`live-lap${row.bestLap != null && row.bestLap === fastestLap ? " is-fastest" : ""}`}>
                {formatLapTime(row.bestLap)}
              </span>
              {isRace && <span className="live-gap">{formatGap(row)}</span>}
            </li>
          ))}
        </ol>
      )}

      <footer className="live-foot">
        <span>ao vivo · atualiza a cada 5s</span>
        <span>{fmtHoraSeg.format(new Date(live.updatedAt))} SP</span>
      </footer>
    </div>
  );
}
