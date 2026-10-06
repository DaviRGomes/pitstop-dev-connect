// Caminhos dos assets de marca, servidos estaticamente a partir de /public/brand.
// O vídeo possui fallback local versionado. VITE_SENNA_BG_URL pode apontar para
// uma URL absoluta em CDN sem exigir mudança de código.
export const sennaS = "/brand/senna-s.png";
export const f1Car = "/brand/f1-car.png";
export const f1Logo = "/brand/f1-logo.png";
export const helmetImg = "/brand/helmet.png";
const configuredSennaBg = (import.meta.env.VITE_SENNA_BG_URL as string | undefined)?.trim();

// Docker define a variável como string vazia quando nenhuma CDN foi
// configurada. `??` não tratava esse caso e produzia `src=""`, fazendo o
// navegador tentar abrir a própria página como vídeo. Uma string vazia também
// precisa cair no arquivo local.
export const sennaBg = configuredSennaBg || "/brand/senna-bg.mp4";
