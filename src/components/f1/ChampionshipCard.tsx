import {
  projectChampionship,
  teamLogo,
  type F1Locale,
  type LiveState,
  type StandingRow,
} from "@/lib/f1";
import { F1_COPY } from "./i18n";

/**
 * Tabela geral do campeonato de pilotos (pontos acumulados do ano).
 * Durante Corrida/Sprint ao vivo mostra a projeção: pontos oficiais + pontos
 * da posição atual na pista, com setas de quem sobe/desce na tabela.
 */
export function ChampionshipCard({
  standings,
  live,
  season,
  locale,
}: {
  standings: StandingRow[];
  live?: LiveState;
  season?: string;
  locale: F1Locale;
}) {
  const { rows, projecting } = projectChampionship(standings, live);
  const copy = F1_COPY[locale];

  return (
    <article className="race-card champ-card">
      <header className="champ-head">
        <span className="race-round">{season ? `${copy.season} ${season}` : copy.season}</span>
        {projecting ? (
          <span className="race-badge champ-live">
            <span className="live-dot" aria-hidden="true" />
            {copy.livePoints}
          </span>
        ) : (
          <span className="race-badge done">{copy.officialStandings}</span>
        )}
      </header>

      <h3 className="champ-title">{copy.championshipTitle}</h3>

      <ol className="champ-rows">
        {rows.map((row) => {
          const logo = teamLogo(row.constructor, season);
          return (
            <li key={`${row.driver}-${row.constructor}`} className="champ-row">
              <span className="champ-pos">{row.position}</span>
              {projecting && row.delta !== 0 && (
                <span
                  className={`champ-delta ${row.delta > 0 ? "up" : "down"}`}
                  title={copy.standingsDelta(row.delta)}
                >
                  {row.delta > 0 ? "▲" : "▼"}
                </span>
              )}
              <span className="champ-driver" title={row.constructor}>
                {row.driver}
              </span>
              {projecting && row.gained > 0 && <span className="champ-gain">+{row.gained}</span>}
              {logo ? (
                <img
                  className="champ-logo"
                  src={logo}
                  alt={row.constructor}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="champ-logo" aria-hidden="true" />
              )}
              <span className="champ-pts">{row.points}</span>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
