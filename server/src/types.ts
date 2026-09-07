// Formato normalizado que este backend entrega ao frontend.

export interface SessionTime {
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm:ssZ — temporadas antigas podem não ter horário
}

export interface RaceSessions {
  firstPractice?: SessionTime;
  secondPractice?: SessionTime;
  thirdPractice?: SessionTime;
  qualifying?: SessionTime;
  sprint?: SessionTime;
  sprintQualifying?: SessionTime;
}

export interface RaceEvent {
  season: string;
  round: number;
  name: string;
  url?: string;
  circuitId: string;
  circuitName: string;
  locality: string;
  country: string;
  lat: number;
  long: number;
  date: string; // dia da corrida, YYYY-MM-DD
  time?: string;
  sessions: RaceSessions;
  circuitImage?: string; // OpenF1 — presente só no calendário enriquecido
  countryFlag?: string; // OpenF1 — presente só no calendário enriquecido
  circuitSlug?: string; // slug do circuito OpenF1 — casa com /tracks/{circuitSlug}.png
}

export interface ResultRow {
  position: number;
  driver: string; // "Nome Sobrenome"
  code?: string;
  nationality?: string;
  constructor: string;
  points: number;
  grid: number;
  laps: number;
  status: string;
  time?: string; // tempo do vencedor ou gap — ausente p/ retardatários/DNF
  fastestLap?: string;
}

export interface RaceResult {
  season: string;
  round: number;
  name: string;
  circuitName: string;
  date: string;
  results: ResultRow[];
}

export interface StandingRow {
  position: number;
  driver: string;
  code?: string;
  nationality?: string;
  constructor: string;
  points: number;
  wins: number;
}
