// Cache TTL em memória. Erros do fetcher nunca são cacheados.

type CacheEntry = {
  value: unknown;
  expiresAt: number;
};

const store = new Map<string, CacheEntry>();

/** TTLs combinados (em ms) para cada tipo de dado. */
export const TTL = {
  calendar: 24 * 60 * 60 * 1000, // 24h
  next: 60 * 60 * 1000, // 1h
  results: 30 * 60 * 1000, // 30min
  standings: 60 * 60 * 1000, // 1h
  meetings: 24 * 60 * 60 * 1000, // 24h
  session: 60 * 1000, // 1min — sessão "latest" da OpenF1
  drivers: 5 * 60 * 1000, // 5min — line-up não muda no meio da sessão
  live: 4 * 1000, // 4s — posições/gaps ao vivo (protege a OpenF1 do polling)
  laps: 15 * 1000, // 15s — melhor volta muda no máximo uma vez por volta
} as const;

/**
 * Retorna o valor cacheado se ainda estiver dentro do TTL; senão executa
 * `fetcher`, guarda o resultado e o retorna. Se o `fetcher` lançar, nada é
 * guardado — a próxima chamada tenta de novo.
 */
export async function getOrSet<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const entry = store.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.value as T;
  }

  const value = await fetcher();
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

export function clearCache(): void {
  store.clear();
}
