// Constantes compartilhadas entre o script inline do __root (que cobre a home
// antes do primeiro paint) e o BootSplash (que tira a capa quando assume).
// Ficam fora do BootSplash para o __root não puxar o componente lazy.

// Marca que o intro já rodou nesta sessão do navegador.
export const BOOT_SEEN_KEY = "pitstop-boot-seen";

// Classe no <html> que mantém a home coberta de preto até o vídeo assumir.
export const BOOT_PENDING_CLASS = "boot-pending";

// Trava do script inline: se o BootSplash nunca tirar a capa (JS falhou, rede
// muito lenta), o site é liberado depois deste tempo.
export const BOOT_COVER_MAX_MS = 6000;

export function releaseBootCover() {
  document.documentElement.classList.remove(BOOT_PENDING_CLASS);
}
