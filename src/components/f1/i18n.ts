import type { F1Locale } from "@/lib/f1";

export type F1UiCopy = {
  syncingTelemetry: string;
  telemetryOffline: string;
  telemetryOfflineBody: string;
  liveSessionBack: string;
  season: string;
  livePoints: string;
  officialStandings: string;
  championshipTitle: string;
  standingsDelta: (delta: number) => string;
  sessionLabels: Record<string, string>;
  sessionFallback: string;
  calendar: string;
  waitingTelemetry: string;
  liveRefresh: string;
  timeZoneShort: string;
  nextRound: string;
  finished: string;
  trackAlt: (circuit: string) => string;
  raceTime: (time: string) => string;
  raceTimeTbd: string;
  podium: string;
  ordinal: (position: number) => string;
  lightsOut: string;
  connectingLive: string;
  countdownAria: string;
  countdownTitle: string;
  countdownUnits: [string, string, string, string];
  weekendTitle: string;
  scheduleTbd: string;
  upcomingSessions: Array<[string, "firstPractice" | "sprintQualifying" | "sprint" | "qualifying"]>;
};

function englishOrdinal(position: number) {
  const mod100 = position % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${position}th`;
  const suffix =
    position % 10 === 1 ? "st" : position % 10 === 2 ? "nd" : position % 10 === 3 ? "rd" : "th";
  return `${position}${suffix}`;
}

export const F1_COPY: Record<F1Locale, F1UiCopy> = {
  pt: {
    syncingTelemetry: "sincronizando telemetria…",
    telemetryOffline: "telemetria offline",
    telemetryOfflineBody: "não consegui falar com o backend do pitstop.",
    liveSessionBack: "sessão ao vivo agora, voltar ao placar",
    season: "TEMPORADA",
    livePoints: "pontos ao vivo",
    officialStandings: "tabela oficial",
    championshipTitle: "Campeonato de pilotos",
    standingsDelta: (delta) => `${delta > 0 ? "+" : ""}${delta} na tabela`,
    sessionLabels: {
      Race: "Corrida",
      Sprint: "Sprint",
      Qualifying: "Classificação",
      "Sprint Qualifying": "Quali Sprint",
      "Practice 1": "Treino Livre 1",
      "Practice 2": "Treino Livre 2",
      "Practice 3": "Treino Livre 3",
    },
    sessionFallback: "Sessão",
    calendar: "calendário",
    waitingTelemetry: "bandeira verde, aguardando o sinal de telemetria…",
    liveRefresh: "ao vivo · atualiza a cada 5s",
    timeZoneShort: "SP",
    nextRound: "próxima etapa",
    finished: "bandeirada",
    trackAlt: (circuit) => `Traçado de ${circuit}`,
    raceTime: (time) => ` · ${time} em São Paulo`,
    raceTimeTbd: " · horário a confirmar",
    podium: "pódio",
    ordinal: (position) => `${position}º`,
    lightsOut: "largada!",
    connectingLive: "é agora, ligando a telemetria ao vivo…",
    countdownAria: "Contagem regressiva para a largada",
    countdownTitle: "contagem pra largada · horário de SP",
    countdownUnits: ["dias", "horas", "min", "seg"],
    weekendTitle: "fim de semana · horário de SP",
    scheduleTbd: "programação ainda não confirmada",
    upcomingSessions: [
      ["treino livre 1", "firstPractice"],
      ["quali sprint", "sprintQualifying"],
      ["sprint", "sprint"],
      ["classificação", "qualifying"],
    ],
  },
  en: {
    syncingTelemetry: "syncing telemetry…",
    telemetryOffline: "telemetry offline",
    telemetryOfflineBody: "I couldn't reach the pitstop backend.",
    liveSessionBack: "live session now, return to the timing board",
    season: "SEASON",
    livePoints: "live points",
    officialStandings: "official standings",
    championshipTitle: "Drivers' championship",
    standingsDelta: (delta) => `${delta > 0 ? "+" : ""}${delta} in the standings`,
    sessionLabels: {
      Race: "Race",
      Sprint: "Sprint",
      Qualifying: "Qualifying",
      "Sprint Qualifying": "Sprint Qualifying",
      "Practice 1": "Free Practice 1",
      "Practice 2": "Free Practice 2",
      "Practice 3": "Free Practice 3",
    },
    sessionFallback: "Session",
    calendar: "calendar",
    waitingTelemetry: "green flag, waiting for the telemetry signal…",
    liveRefresh: "live · refreshes every 5s",
    timeZoneShort: "São Paulo",
    nextRound: "next round",
    finished: "finished",
    trackAlt: (circuit) => `${circuit} track layout`,
    raceTime: (time) => ` · ${time} in São Paulo`,
    raceTimeTbd: " · time to be confirmed",
    podium: "podium",
    ordinal: englishOrdinal,
    lightsOut: "lights out!",
    connectingLive: "it's time, connecting live telemetry…",
    countdownAria: "Countdown to lights out",
    countdownTitle: "countdown to lights out · São Paulo time",
    countdownUnits: ["days", "hours", "min", "sec"],
    weekendTitle: "race weekend · São Paulo time",
    scheduleTbd: "schedule not confirmed yet",
    upcomingSessions: [
      ["free practice 1", "firstPractice"],
      ["sprint qualifying", "sprintQualifying"],
      ["sprint", "sprint"],
      ["qualifying", "qualifying"],
    ],
  },
};
