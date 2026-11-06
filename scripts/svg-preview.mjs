// Renderiza SVGs em PNG com o Chromium do Playwright, para conferir um diagrama visualmente
// (texto cortado, setas cruzando caixas, sobreposição) antes de publicá-lo.
//
// Uso: node scripts/svg-preview.mjs <arquivo.svg> [<arquivo.svg> ...]
//      grava <arquivo>.png ao lado de cada SVG (não versione os PNGs de conferência)
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("uso: node scripts/svg-preview.mjs <arquivo.svg> [...]");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const file of files) {
  const svg = readFileSync(file, "utf8");
  const head = svg.slice(0, svg.indexOf(">", svg.indexOf("<svg")) + 1);
  const vb = /viewBox="[\d.\-]+[ ,]+[\d.\-]+[ ,]+([\d.]+)[ ,]+([\d.]+)"/.exec(head);
  const num = (re) => Number(re.exec(head)?.[1]) || 0;
  let w = num(/\swidth="([\d.]+)(?:px)?"/);
  let h = num(/\sheight="([\d.]+)(?:px)?"/);
  if ((!w || !h) && vb) [w, h] = [Number(vb[1]), Number(vb[2])];
  // escala para 960 px de largura, como o guia mostra
  const scale = 960 / (w || 960);
  const [vw, vh] = [960, Math.max(50, Math.round((h || 400) * scale))];
  await page.setViewportSize({ width: vw, height: vh });
  const src = "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
  await page.setContent(
    `<body style="margin:0;background:#fff"><img src="${src}" style="width:${vw}px;height:${vh}px;display:block"></body>`,
  );
  await page.waitForLoadState("load");
  const out = file.replace(/\.svg$/, ".png");
  await page.screenshot({ path: out });
  console.log(out);
}
await browser.close();
