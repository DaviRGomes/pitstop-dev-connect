import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchJson, UpstreamRequestError } from '../src/http';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

describe('fetchJson', () => {
  it('repete GET em erro transitório e devolve o JSON recuperado', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response('ocupado', { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    await expect(
      fetchJson<{ ok: boolean }>('Dados', 'https://api.example/data', {}, { retries: 1, retryDelayMs: 0 }),
    ).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('não repete erro não transitório nem requisição POST', async () => {
    fetchMock.mockResolvedValue(new Response('erro', { status: 400 }));
    await expect(
      fetchJson('Dados', 'https://api.example/data', {}, { retries: 3, retryDelayMs: 0 }),
    ).rejects.toMatchObject({ status: 400 });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fetchMock.mockReset().mockResolvedValue(new Response('erro', { status: 503 }));
    await expect(
      fetchJson(
        'Auth',
        'https://api.example/token',
        { method: 'POST' },
        { retries: 3, retryDelayMs: 0 },
      ),
    ).rejects.toMatchObject({ status: 503 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('cancela no timeout e não inclui a URL na mensagem pública', async () => {
    fetchMock.mockImplementation((_input: unknown, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        const abort = () => reject(init?.signal?.reason ?? new DOMException('Abortado', 'AbortError'));
        if (init?.signal?.aborted) abort();
        else init?.signal?.addEventListener('abort', abort, { once: true });
      });
    });

    const url = 'https://api.example/private?token=nunca-expor';
    let received: unknown;
    try {
      await fetchJson('Dados', url, {}, { timeoutMs: 5, retries: 0 });
    } catch (error) {
      received = error;
    }

    expect(received).toBeInstanceOf(UpstreamRequestError);
    expect(received).toMatchObject({ timedOut: true });
    expect((received as Error).message).not.toContain(url);
    expect((received as Error).message).not.toContain('nunca-expor');
  });

  it('respeita abort do chamador sem fazer retry', async () => {
    const controller = new AbortController();
    fetchMock.mockImplementation((_input: unknown, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener(
          'abort',
          () => reject(init.signal?.reason ?? new DOMException('Abortado', 'AbortError')),
          { once: true },
        );
      });
    });

    const pending = fetchJson(
      'Dados',
      'https://api.example/data',
      { signal: controller.signal },
      { retries: 3, retryDelayMs: 0 },
    );
    controller.abort();

    await expect(pending).rejects.toMatchObject({ timedOut: false });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
