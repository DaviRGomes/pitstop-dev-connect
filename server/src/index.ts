import { timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import { clearCache } from './cache.js';
import { UpstreamRequestError } from './http.js';
import { getCalendar, getDriverStandings, getLastResults, getNextRace, getSeasonPodiums } from './services/jolpica.js';
import { getLiveState } from './services/live.js';
import { getEnrichedCalendar } from './services/races.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 3333);

export const app = express();

app.disable('x-powered-by');

const LOCAL_CORS_ORIGINS = new Set([
  'http://localhost:3005',
  'http://127.0.0.1:3005',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

function normalizedOrigins(): Set<string> {
  const raw = process.env.CORS_ORIGINS ?? '';
  if (raw === cachedCorsEnv) return cachedCorsOrigins;

  const configured = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  cachedCorsEnv = raw;
  cachedCorsOrigins = new Set([...LOCAL_CORS_ORIGINS, ...configured]);
  return cachedCorsOrigins;
}

let cachedCorsEnv: string | undefined;
let cachedCorsOrigins = LOCAL_CORS_ORIGINS;

app.use(
  cors({
    origin(origin, callback) {
      const allowed = normalizedOrigins();
      if (!origin || allowed.has('*') || allowed.has(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  }),
);
app.use(express.json({ limit: '16kb' }));

// PNGs baixados pelo `npm run icons`.
app.use(
  '/tracks',
  express.static(path.resolve(__dirname, '../public/tracks'), {
    maxAge: '1d',
    immutable: false,
  }),
);

/** Executa uma rota async e converte falha de upstream em 502. */
function route(fn: (req: Request, res: Response) => Promise<void>) {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (err) {
      const detail = err instanceof Error ? `${err.name}: ${err.message}` : 'erro desconhecido';
      console.error(`[api] ${req.method} ${req.originalUrl} falhou: ${detail}`);

      if (err instanceof UpstreamRequestError) {
        res.status(502).json({ ok: false, error: 'Fonte de dados temporariamente indisponível' });
        return;
      }
      res.status(500).json({ ok: false, error: 'Erro interno do servidor' });
    }
  };
}

function seasonFrom(req: Request, res: Response): string | null {
  const { season } = req.query;
  if (season === undefined || season === '') return 'current';
  if (season === 'current') return season;

  const maxYear = new Date().getUTCFullYear() + 1;
  if (typeof season === 'string' && /^\d{4}$/.test(season)) {
    const year = Number(season);
    if (year >= 1950 && year <= maxYear) return season;
  }

  res.status(400).json({
    ok: false,
    error: `Temporada inválida. Use "current" ou um ano entre 1950 e ${maxYear}`,
  });
  return null;
}

function cacheTokenMatches(req: Request, expected: string): boolean {
  const authorization = req.get('authorization') ?? '';
  const provided = /^Bearer\s+(.+)$/i.exec(authorization)?.[1] ?? '';
  const expectedBytes = Buffer.from(expected);
  const providedBytes = Buffer.from(provided);
  return (
    expectedBytes.length === providedBytes.length &&
    expectedBytes.length > 0 &&
    timingSafeEqual(expectedBytes, providedBytes)
  );
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'pitstop-server', time: new Date().toISOString() });
});

app.get(
  '/api/f1/next',
  route(async (_req, res) => {
    res.json(await getNextRace());
  }),
);

app.get(
  '/api/f1/last-results',
  route(async (_req, res) => {
    res.json(await getLastResults());
  }),
);

app.get(
  '/api/f1/standings',
  route(async (_req, res) => {
    res.json(await getDriverStandings());
  }),
);

app.get(
  '/api/f1/calendar',
  route(async (req, res) => {
    const season = seasonFrom(req, res);
    if (!season) return;
    res.json(await getCalendar(season));
  }),
);

app.get(
  '/api/f1/races',
  route(async (req, res) => {
    const season = seasonFrom(req, res);
    if (!season) return;
    res.json(await getEnrichedCalendar(season));
  }),
);

app.get(
  '/api/f1/podiums',
  route(async (req, res) => {
    const season = seasonFrom(req, res);
    if (!season) return;
    res.json(await getSeasonPodiums(season));
  }),
);

app.get(
  '/api/f1/live',
  route(async (_req, res) => {
    res.json(await getLiveState());
  }),
);

app.post('/api/cache/clear', (req, res) => {
  const expected = process.env.CACHE_CLEAR_TOKEN?.trim();
  if (!expected) {
    res.status(404).json({ ok: false, error: 'Não encontrado' });
    return;
  }
  if (!cacheTokenMatches(req, expected)) {
    res.status(401).json({ ok: false, error: 'Não autorizado' });
    return;
  }

  clearCache();
  res.json({ ok: true, cleared: true });
});

// Sobe a porta só quando executado diretamente (`tsx src/index.ts`);
// os testes importam `app` sem abrir porta.
const entryPoint = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (entryPoint === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`pitstop-server rodando em http://localhost:${PORT}`);
  });
}
