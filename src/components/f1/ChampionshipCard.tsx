import {
  projectChampionship,
  teamLogo,
  type LiveState,
  type StandingRow,
} from "@/lib/f1";

/**
 * Tabela geral do campeonato de pilotos (pontos acumulados do ano).
 * Durante Corrida/Sprint ao vivo mostra a projeção: pontos oficiais + pontos
 * da posição atual na pista, com setas de quem sobe/desce na tabela.
 */
export function ChampionshipCard({
  standings,
  live,
  season,
}: {
  standings: StandingRow[];
  live?: LiveState;
  season?: string;
}) {
  const { rows, projecting } = projectChampionship(standings, live);

  return (
    <article className="race-card champ-card">
      <header className="champ-head">
        <span className="race-round">
          {season ? `TEMPORADA ${season}` : "TEMPORADA"}
        </span>
        {projecting ? (
          <span className="race-badge champ-live">
            <span className="live-dot" aria-hidden="true" />
            pontos ao vivo
          </span>
        ) : (
          <span className="race-badge done">tabela oficial</span>
        )}
      </header>

      <h3 className="champ-title">Campeonato de pilotos</h3>

      <ol className="champ-rows">
        {rows.map((row) => {
          const logo = teamLogo(row.constructor, season);
          return (
            <li key={`${row.driver}-${row.constructor}`} className="champ-row">
              <span className="champ-pos">{row.position}</span>
              {projecting && row.delta !== 0 && (
                <span
                  className={`champ-delta ${row.delta > 0 ? "up" : "down"}`}
                  title={`${row.delta > 0 ? "+" : ""}${row.delta} na tabela`}
                >
                  {row.delta > 0 ? "▲" : "▼"}
                </span>
              )}
              <span className="champ-driver" title={row.constructor}>
                {row.driver}
              </span>
              {projecting && row.gained > 0 && (
                <span className="champ-gain">+{row.gained}</span>
              )}
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
