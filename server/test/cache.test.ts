import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearCache, getCacheStats, getOrSet, TTL } from '../src/cache';

beforeEach(() => {
  clearCache();
});

afterEach(() => {
  vi.useRealTimers();
  delete process.env.CACHE_MAX_ENTRIES;
});

describe('getOrSet', () => {
  it('chama o fetcher uma única vez dentro do TTL', async () => {
    const fetcher = vi.fn().mockResolvedValue({ valor: 42 });

    const primeira = await getOrSet('chave', 60_000, fetcher);
    const segunda = await getOrSet('chave', 60_000, fetcher);

    expect(primeira).toEqual({ valor: 42 });
    expect(segunda).toBe(primeira); // mesma referência: veio do cache
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('busca de novo depois que o TTL expira', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn().mockResolvedValueOnce('antigo').mockResolvedValueOnce('novo');

    expect(await getOrSet('chave', 1_000, fetcher)).toBe('antigo');
    vi.advanceTimersByTime(1_001);
    expect(await getOrSet('chave', 1_000, fetcher)).toBe('novo');

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('não cacheia erro: a chamada seguinte tenta de novo', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error('falhou'))
      .mockResolvedValueOnce('recuperado');

    await expect(getOrSet('chave', 60_000, fetcher)).rejects.toThrow('falhou');
    await expect(getOrSet('chave', 60_000, fetcher)).resolves.toBe('recuperado');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('chaves diferentes não se misturam', async () => {
    expect(await getOrSet('a', 60_000, async () => 1)).toBe(1);
    expect(await getOrSet('b', 60_000, async () => 2)).toBe(2);
  });

  it('deduplica chamadas concorrentes para a mesma chave', async () => {
    let resolve!: (value: string) => void;
    const fetcher = vi.fn(
      () =>
        new Promise<string>((done) => {
          resolve = done;
        }),
    );

    const first = getOrSet('concorrente', 60_000, fetcher);
    const second = getOrSet('concorrente', 60_000, fetcher);

    expect(fetcher).toHaveBeenCalledTimes(1);
    resolve('resultado');
    await expect(Promise.all([first, second])).resolves.toEqual(['resultado', 'resultado']);
  });

  it('compartilha a rejeição concorrente e permite tentar novamente', async () => {
    const fetcher = vi.fn().mockRejectedValueOnce(new Error('falhou')).mockResolvedValue('ok');

    const results = await Promise.allSettled([
      getOrSet('rejeitada', 60_000, fetcher),
      getOrSet('rejeitada', 60_000, fetcher),
    ]);

    expect(results.map((result) => result.status)).toEqual(['rejected', 'rejected']);
    expect(fetcher).toHaveBeenCalledTimes(1);
    await expect(getOrSet('rejeitada', 60_000, fetcher)).resolves.toBe('ok');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('remove a entrada menos usada quando atinge o limite', async () => {
    process.env.CACHE_MAX_ENTRIES = '16';
    const fetcher = vi.fn(async (value: number) => value);

    for (let index = 0; index < 16; index += 1) {
      await getOrSet(`key:${index}`, 60_000, () => fetcher(index));
    }
    await getOrSet('key:0', 60_000, () => fetcher(0));
    await getOrSet('key:16', 60_000, () => fetcher(16));

    expect(getCacheStats().entries).toBe(16);
    await getOrSet('key:0', 60_000, () => fetcher(0));
    await getOrSet('key:1', 60_000, () => fetcher(1));
    expect(fetcher).toHaveBeenCalledTimes(18);
  });
});

describe('clearCache', () => {
  it('força nova busca na próxima chamada', async () => {
    const fetcher = vi.fn().mockResolvedValue('x');

    await getOrSet('chave', 60_000, fetcher);
    clearCache();
    await getOrSet('chave', 60_000, fetcher);

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('não deixa uma busca anterior repopular o cache', async () => {
    let resolve!: (value: string) => void;
    const fetcher = vi.fn(
      () =>
        new Promise<string>((done) => {
          resolve = done;
        }),
    );

    const pending = getOrSet('chave', 60_000, fetcher);
    clearCache();
    resolve('antigo');
    await pending;

    await getOrSet('chave', 60_000, async () => 'novo');
    expect(getCacheStats().entries).toBe(1);
  });
});

describe('TTL', () => {
  it('define os tempos combinados', () => {
    expect(TTL.calendar).toBe(24 * 60 * 60 * 1000);
    expect(TTL.next).toBe(60 * 60 * 1000);
    expect(TTL.results).toBe(30 * 60 * 1000);
    expect(TTL.standings).toBe(60 * 60 * 1000);
    expect(TTL.meetings).toBe(24 * 60 * 60 * 1000);
  });
});
