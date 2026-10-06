const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

function integerEnv(name: string, fallback: number, min: number, max: number): number {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value >= min && value <= max ? value : fallback;
}

function isTimeout(error: unknown): boolean {
  return error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class UpstreamRequestError extends Error {
  readonly service: string;
  readonly status?: number;
  readonly timedOut: boolean;

  constructor(service: string, options: { status?: number; timedOut?: boolean; cause?: unknown } = {}) {
    const suffix = options.timedOut ? ' (timeout)' : options.status ? ` (HTTP ${options.status})` : '';
    super(`${service} indisponível${suffix}`, { cause: options.cause });
    this.name = 'UpstreamRequestError';
    this.service = service;
    this.status = options.status;
    this.timedOut = options.timedOut ?? false;
  }
}

export interface FetchJsonOptions {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

/**
 * Fetch JSON com timeout e retry limitado. Retry só é aplicado a GET, que é
 * idempotente, e apenas para falhas transitórias de rede/HTTP.
 */
export async function fetchJson<T>(
  service: string,
  url: string,
  init: RequestInit = {},
  options: FetchJsonOptions = {},
): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase();
  const timeoutMs = options.timeoutMs ?? integerEnv('UPSTREAM_TIMEOUT_MS', 8_000, 500, 60_000);
  const requestedRetries = options.retries ?? integerEnv('UPSTREAM_GET_RETRIES', 1, 0, 3);
  const retries = method === 'GET' ? requestedRetries : 0;
  const retryDelayMs = options.retryDelayMs ?? 75;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    let response: Response;
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    const signal = init.signal ? AbortSignal.any([init.signal, timeoutSignal]) : timeoutSignal;
    try {
      response = await fetch(url, {
        ...init,
        method,
        signal,
      });
    } catch (error) {
      const callerAborted = init.signal?.aborted ?? false;
      const timedOut = timeoutSignal.aborted && !callerAborted;
      if (callerAborted) {
        throw new UpstreamRequestError(service, { cause: error });
      }
      if (attempt < retries) {
        await wait(retryDelayMs * (attempt + 1));
        continue;
      }
      throw new UpstreamRequestError(service, { timedOut: timedOut || isTimeout(error), cause: error });
    }

    if (!response.ok) {
      if (attempt < retries && RETRYABLE_STATUS.has(response.status)) {
        await response.body?.cancel();
        await wait(retryDelayMs * (attempt + 1));
        continue;
      }
      throw new UpstreamRequestError(service, { status: response.status });
    }

    try {
      return (await response.json()) as T;
    } catch (error) {
      throw new UpstreamRequestError(service, { status: response.status, cause: error });
    }
  }

  // O loop sempre retorna ou lança; mantém o narrowing do TypeScript explícito.
  throw new UpstreamRequestError(service);
}
