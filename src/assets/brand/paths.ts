// Caminhos dos assets de marca — servidos estaticamente a partir de /public/brand.
// O vídeo do Senna não fica no repo (>10 MB). Coloque-o manualmente em
// public/brand/senna-bg.mp4 na VPS, ou defina VITE_SENNA_BG_URL apontando
// para uma URL absoluta (ex.: um bucket S3 seu).
export const sennaS = "/brand/senna-s.png";
export const f1Car = "/brand/f1-car.png";
export const f1Logo = "/brand/f1-logo.png";
export const helmetImg = "/brand/helmet.png";
export const sennaBg =
  (import.meta.env.VITE_SENNA_BG_URL as string | undefined) ??
  "/brand/senna-bg.mp4";