// Baixa os ícones de pista da OpenF1 para public/tracks/ e gera um
// manifest.json mapeando circuito -> arquivo local.
//
// Uso: npm run icons            (ano atual)
//      npm run icons -- 2026    (ano específico)

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getMeetings, type OpenF1Meeting } from '../src/services/openf1';
import { slug } from '../src/utils';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public/tracks');

// O CDN da F1 às vezes ainda não tem o PNG do ano corrente (ex.: Barcelona
// 2026 renomeada); nesses casos procuramos o mesmo circuito em anos anteriores.
const FALLBACK_YEARS = 3;

interface ManifestEntry {
  file: string;
  circuit: string;
  meeting: string;
  country: string;
  source: string;
}

interface ResolvedIcon {
  buffer: Buffer;
  source: string;
  year: number;
}

async function tryDownload(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Baixa o ícone do meeting; se a URL do ano corrente falhar (ou não existir),
 * tenta o circuit_image do mesmo circuit_key nos anos anteriores.
 */
async function resolveIcon(meeting: OpenF1Meeting, year: number): Promise<ResolvedIcon> {
  const tried = new Set<string>();
  let lastError: Error | null = null;

  const attempt = async (url: string, fromYear: number): Promise<ResolvedIcon | null> => {
    if (tried.has(url)) return null;
    tried.add(url);
    try {
      return { buffer: await tryDownload(url), source: url, year: fromYear };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      return null;
    }
  };

  if (meeting.circuit_image) {
    const icon = await attempt(meeting.circuit_image, year);
    if (icon) return icon;
  }

  for (let back = 1; back <= FALLBACK_YEARS; back++) {
    const pastYear = year - back;
    let pastMeetings: OpenF1Meeting[];
    try {
      pastMeetings = await getMeetings(pastYear);
    } catch {
      continue; // ano sem dados na OpenF1
    }

    const sameCircuit = pastMeetings.find((m) => m.circuit_key === meeting.circuit_key && m.circuit_image);
    if (!sameCircuit?.circuit_image) continue;

    const icon = await attempt(sameCircuit.circuit_image, pastYear);
    if (icon) return icon;
  }

  throw lastError ?? new Error('sem circuit_image em nenhum ano consultado');
}

async function main(): Promise<void> {
  const arg = process.argv[2];
  const year = arg ? Number(arg) : new Date().getFullYear();
  if (!Number.isInteger(year) || year < 1950) {
    console.error(`Ano inválido: "${arg}". Uso: npm run icons -- 2026`);
    process.exitCode = 1;
    return;
  }

  console.log(`Buscando meetings de ${year} na OpenF1…`);
  const meetings = await getMeetings(year);
  console.log(`${meetings.length} meeting(s) encontrado(s).\n`);

  await mkdir(OUT_DIR, { recursive: true });

  const manifest: Record<string, ManifestEntry> = {};
  let baixados = 0;
  let recuperados = 0;
  let falhas = 0;

  for (const meeting of meetings) {
    const label = meeting.circuit_short_name || meeting.meeting_name;
    const key = slug(label);
    const fileName = `${key}.png`;

    try {
      const icon = await resolveIcon(meeting, year);
      await writeFile(path.join(OUT_DIR, fileName), icon.buffer);

      manifest[key] = {
        file: `/tracks/${fileName}`,
        circuit: meeting.circuit_short_name,
        meeting: meeting.meeting_name,
        country: meeting.country_name,
        source: icon.source,
      };
      baixados++;
      if (icon.year !== year) {
        recuperados++;
        console.log(`✓ ${label} → public/tracks/${fileName} (ícone de ${icon.year})`);
      } else {
        console.log(`✓ ${label} → public/tracks/${fileName}`);
      }
    } catch (err) {
      falhas++;
      console.log(`✗ ${label} — falhou: ${err instanceof Error ? err.message : err}`);
    }
  }

  const manifestPath = path.join(OUT_DIR, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const notaFallback = recuperados > 0 ? ` (${recuperados} via ano anterior)` : '';
  console.log(`\nResumo: ${baixados} baixado(s)${notaFallback}, ${falhas} falha(s).`);
  console.log(`Manifest: ${path.relative(process.cwd(), manifestPath)} (${Object.keys(manifest).length} entrada(s))`);
}

main().catch((err) => {
  console.error('Erro ao baixar ícones:', err);
  process.exitCode = 1;
});
