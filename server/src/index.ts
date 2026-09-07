import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import { clearCache } from './cache';
import { getCalendar, getDriverStandings, getLastResults, getNextRace, getSeasonPodiums } from './services/jolpica';
import { getLiveState } from './services/live';
import { getEnrichedCalendar } from './services/races';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 3333);

export const app = express();

app.use(cors());
app.use(express.json());

// PNGs baixados pelo `npm run icons`.
app.use('/tracks', express.static(path.resolve(__dirname, '../public/tracks')));

/** Executa uma rota async e converte falha de upstream em 502. */
function route(fn: (req: Request, res: Response) => Promise<void>) {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      console.error(`[api] ${req.method} ${req.originalUrl} falhou: ${error}`);
      res.status(502).json({ ok: false, error });
    }
  };
}

function seasonFrom(req: Request): string {
  const { season } = req.query;
  return typeof season === 'string' && season.length > 0 ? season : 'current';
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
    res.json(await getCalendar(seasonFrom(req)));
  }),
);

app.get(
  '/api/f1/races',
  route(async (req, res) => {
    res.json(await getEnrichedCalendar(seasonFrom(req)));
  }),
);

app.get(
  '/api/f1/podiums',
  route(async (req, res) => {
    res.json(await getSeasonPodiums(seasonFrom(req)));
  }),
);

app.get(
  '/api/f1/live',
  route(async (_req, res) => {
    res.json(await getLiveState());
  }),
);

app.post('/api/cache/clear', (_req, res) => {
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
