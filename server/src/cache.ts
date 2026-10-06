// Cache TTL em memória. Erros do fetcher nunca são cacheados.

type CacheEntry = {
  value: unknown;
  expiresAt: number;
};

const store = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<unknown>>();
let generation = 0;

const DEFAULT_MAX_ENTRIES = 256;

function configuredMaxEntries(): number {
  const parsed = Number(process.env.CACHE_MAX_ENTRIES);
  if (!Number.isInteger(parsed) || parsed < 16 || parsed > 5_000) {
    return DEFAULT_MAX_ENTRIES;
  }
  return parsed;
}

/** Remove entradas vencidas e mantém o cache dentro de um limite LRU. */
function prune(now = Date.now()): void {
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key);
  }

  const maxEntries = configuredMaxEntries();
  while (store.size > maxEntries) {
    const oldestKey = store.keys().next().value as string | undefined;
    if (oldestKey === undefined) break;
    store.delete(oldestKey);
  }
}

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
  liveSnapshot: 8 * 60 * 60 * 1000, // 8h — acumulador incremental de uma sessão
} as const;

/**
 * Retorna o valor cacheado se ainda estiver dentro do TTL; senão executa
 * `fetcher`, guarda o resultado e o retorna. Se o `fetcher` lançar, nada é
 * guardado — a próxima chamada tenta de novo.
 */
export async function getOrSet<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now();
  prune(now);

  const entry = store.get(key);
  if (entry && entry.expiresAt > now) {
    // Map preserva ordem de inserção; reinserir transforma o acesso em LRU.
    store.delete(key);
    store.set(key, entry);
    return entry.value as T;
  }

  const pending = inFlight.get(key);
  if (pending) return pending as Promise<T>;

  const startedAtGeneration = generation;
  const request = (async () => {
    const value = await fetcher();

    // clearCache() ocorrido durante o fetch não pode repopular o cache.
    if (generation === startedAtGeneration && ttlMs > 0) {
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
      prune();
    }
    return value;
  })();

  inFlight.set(key, request);
  try {
    return await request;
  } finally {
    if (inFlight.get(key) === request) inFlight.delete(key);
  }
}

export function clearCache(): void {
  generation += 1;
  store.clear();
  inFlight.clear();
}

/** Métricas sem valores/chaves, úteis para saúde e testes sem expor dados. */
export function getCacheStats(): { entries: number; inFlight: number; maxEntries: number } {
  prune();
  return {
    entries: store.size,
    inFlight: inFlight.size,
    maxEntries: configuredMaxEntries(),
  };
}
