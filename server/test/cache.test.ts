import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearCache, getOrSet, TTL } from '../src/cache';

beforeEach(() => {
  clearCache();
});

afterEach(() => {
  vi.useRealTimers();
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
});

describe('clearCache', () => {
  it('força nova busca na próxima chamada', async () => {
    const fetcher = vi.fn().mockResolvedValue('x');

    await getOrSet('chave', 60_000, fetcher);
    clearCache();
    await getOrSet('chave', 60_000, fetcher);

    expect(fetcher).toHaveBeenCalledTimes(2);
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
