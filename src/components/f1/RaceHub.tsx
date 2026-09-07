import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchLive, fetchPodiums, fetchRaces, fetchStandings } from "@/lib/f1";
import { ChampionshipCard } from "./ChampionshipCard";
import { LiveBoard } from "./LiveBoard";
import { RaceCarousel } from "./RaceCarousel";

/**
 * Hub de corrida do hero: carrossel do calendário (slide inicial = próxima
 * corrida, com countdown no fuso de SP) que vira placar ao vivo quando a
 * sessão começa — polling de 5s no /api/f1/live do backend.
 */
export function RaceHub() {
  // dados só no cliente: evita mismatch de hidratação com o SSR do Start
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // deixa o usuário espiar o calendário sem sair da sessão ao vivo
  const [calendarPinned, setCalendarPinned] = useState(false);

  const races = useQuery({
    queryKey: ["f1", "races"],
    queryFn: fetchRaces,
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
    retry: 1,
    enabled: mounted,
  });
  const podiums = useQuery({
    queryKey: ["f1", "podiums"],
    queryFn: fetchPodiums,
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
    retry: 1,
    enabled: mounted,
  });
  const live = useQuery({
    queryKey: ["f1", "live"],
    queryFn: fetchLive,
    enabled: mounted,
    retry: false,
    refetchInterval: (query) => (query.state.data?.live ? 5_000 : 60_000),
  });
  const standings = useQuery({
    queryKey: ["f1", "standings"],
    queryFn: fetchStandings,
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
    retry: 1,
    enabled: mounted,
  });

  // Bandeirada: quando a sessão ao vivo termina, calendário/pódios/tabela
  // mudaram no backend — invalida tudo pra trocar o placar pelo article
  // atualizado sem esperar o próximo intervalo.
  const queryClient = useQueryClient();
  const isLive = live.data?.live ?? false;
  const wasLive = useRef(false);
  useEffect(() => {
    if (wasLive.current && !isLive) {
      queryClient.invalidateQueries({ queryKey: ["f1"] });
    }
    wasLive.current = isLive;
  }, [isLive, queryClient]);

  if (!mounted || races.isPending) {
    return (
      <div className="race-panel race-skeleton">
        <span className="live-dot" aria-hidden="true" />
        <p>sincronizando telemetria…</p>
      </div>
    );
  }

  if (races.isError || !races.data?.length) {
    return (
      <div className="race-panel race-offline">
        <p className="race-bottom-label">telemetria offline</p>
        <p>
          não consegui falar com o backend do pitstop.
          <br />
          <code>docker compose up api</code>
        </p>
      </div>
    );
  }

  const liveState = live.data;
  const seasonStandings = standings.data ?? [];

  const mainPanel =
    liveState?.live && !calendarPinned ? (
      <LiveBoard live={liveState} onShowCalendar={() => setCalendarPinned(true)} />
    ) : (
      <RaceCarousel races={races.data} podiums={podiums.data ?? []} />
    );

  return (
    <div className="race-hub">
      {liveState?.live && calendarPinned && (
        <button type="button" className="race-live-back" onClick={() => setCalendarPinned(false)}>
          <span className="live-dot" aria-hidden="true" />
          sessão ao vivo agora, voltar ao placar
        </button>
      )}
      <div className={`race-hub-cards${seasonStandings.length ? "" : " solo"}`}>
        {mainPanel}
        {seasonStandings.length > 0 && (
          <ChampionshipCard
            standings={seasonStandings}
            live={liveState}
            season={races.data[0]?.season}
          />
        )}
      </div>
    </div>
  );
}
