import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, SkipForward } from "lucide-react";

import { sennaBg } from "@/assets/brand/paths";
import type { F1Locale } from "@/lib/f1";
import { BOOT_SEEN_KEY, releaseBootCover } from "@/lib/bootCover";

// Marca que o intro já rodou nesta sessão do navegador. Usamos sessionStorage
// (não localStorage) para que o splash reapareça sempre que a pessoa "abre o
// site" numa nova aba/sessão, mas não a cada navegação interna. A mesma chave
// é lida pelo script inline do __root que cobre a home antes do primeiro paint.
const SEEN_KEY = BOOT_SEEN_KEY;
// Precisa casar com a transição .8s de .boot-splash no styles.css.
const FADE_MS = 900;
// Tempo que o splash fica visível DEPOIS que o vídeo aparece (não desde o
// carregamento) — assim o vídeo é sempre mostrado por esse tempo.
const HOLD_MS = 10000;
// Se o vídeo não COMEÇAR A TOCAR até aqui, pula o splash direto. É o que
// impede o play nativo do celular de ficar preso por cima do texto quando o
// navegador bloqueia o autoplay.
const PLAY_MAX_MS = 3000;
// Após esse tempo sem o vídeo tocar, mostra o botão "Pular" para que
// o usuário não fique preso. É um último recurso pro caso do navegador não
// suportar autoplay.
const SKIP_VISIBLE_MS = 2000;

const BOOT_COPY = {
  pt: {
    dialog: "Abertura",
    soundOff: "Desativar som",
    soundOn: "Ativar som",
    skip: "Pular abertura",
    skipText: "Pular",
    quote:
      '"Tenha sempre como meta muita força, muita determinação e sempre faça tudo com muito amor e muita fé em Deus, que um dia você chega lá"',
    credit: "Vídeo:",
  },
  en: {
    dialog: "Opening",
    soundOff: "Turn sound off",
    soundOn: "Turn sound on",
    skip: "Skip opening",
    skipText: "Skip",
    quote:
      '"Always aim for great strength and determination, and do everything with love and faith. One day, you will get there."',
    credit: "Video:",
  },
} as const;

/**
 * Abertura + vídeo de fundo da home — UM único elemento <video>.
 *
 * O __root monta este componente sob demanda apenas nas homes PT/EN. Assim,
 * relatórios não baixam nem decodificam o vídeo. Na home, o mesmo
 * <video.bg-video> é a fonte de imagem e som (evita processar o arquivo duas
 * vezes, que era o que deixava a tela preta no início). Ele tem dois "modos":
 *
 *  - boot (`is-boot`): 1x por sessão, no topo (z-index alto) e vívido, servindo
 *    de splash. Uma cortina preta atrás dele esconde a home; a citação fica por
 *    cima. O vídeo começa mudo e o som pode ser ativado pelo botão.
 *  - fundo: depois da abertura, fica atrás da home (z-index 0, bem apagado).
 *
 * O splash só começa a contar o tempo quando o vídeo REALMENTE começa a tocar
 * (`onPlaying`), então nunca some com a tela preta nem prende o usuário num
 * play que não rodou. Passado o tempo, a cortina e a citação dissolvem e o
 * mesmo vídeo recua pro fundo, sem cortar.
 *
 * O vídeo começa mudo porque navegadores não garantem autoplay com áudio. O
 * botão no canto ativa o som por um gesto explícito. Quando o vídeo termina
 * (`ended`), ele volta a rodar em loop silencioso como fundo da home.
 *
 * RETROCOMPATIBILIDADE MOBILE:
 * - Muitos navegadores Android (Samsung Internet, UC Browser, Firefox Mobile,
 *   navegadores em modo economia de dados) bloqueiam autoplay mesmo mudo.
 * - Quando play() falha, o splash é pulado imediatamente em vez de mostrar
 *   tela preta.
 * - Um botão "Pular" aparece após 2s caso o vídeo não carregue, para que o
 *   usuário jamais fique preso.
 * - O listener de pause→resume foi removido para evitar loops infinitos em
 *   dispositivos que pausam vídeos por política do sistema.
 */
export function BootSplash({ locale = "pt" }: { locale?: F1Locale }) {
  const copy = BOOT_COPY[locale];
  const [videoAllowed, setVideoAllowed] = useState<boolean | null>(null);
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const endedRef = useRef(false);
  // Enquanto a mídia carrega, a home fica sob a capa preta do __root
  // (boot-pending). A cortina do splash só aparece depois do primeiro quadro
  // reproduzível; se o vídeo falhar ou o autoplay for bloqueado, a capa sai e
  // a home é liberada (no máximo PLAY_MAX_MS, ou a trava do script inline).
  const splashPendingRef = useRef(false);
  // Impede que o vídeo seja marcado como "tocando" mais de uma vez e que o
  // timer do splash (HOLD) seja iniciado duas vezes.
  const playingRef = useRef(false);
  const holdStartedRef = useRef(false);

  // Não cria nem baixa o vídeo antes de conhecer as preferências do cliente.
  // Em economia de dados ou movimento reduzido, o site abre direto no conteúdo.
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;

    const updatePolicy = () => {
      const allowed = !reducedMotion.matches && !connection?.saveData;
      setVideoAllowed(allowed);
      if (!allowed) releaseBootCover();
    };

    updatePolicy();
    reducedMotion.addEventListener("change", updatePolicy);
    return () => reducedMotion.removeEventListener("change", updatePolicy);
  }, []);

  // Marca que o vídeo COMEÇOU a tocar de verdade (primeiro quadro em
  // movimento, via evento `playing`). É esse sinal — e não a mera prontidão do
  // arquivo — que libera a contagem do splash. No celular que bloqueia o
  // autoplay, ele nunca dispara e a trava de segurança pula o splash.
  const markPlaying = useCallback(() => {
    if (!playingRef.current) {
      playingRef.current = true;
      setPlaying(true);
      setShowSkip(false);
    }

    if (splashPendingRef.current) {
      splashPendingRef.current = false;
      setShow(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // sessionStorage indisponível: a abertura poderá reaparecer.
      }
    }
  }, []);

  // Pula o splash imediatamente (chamado pelo botão "Pular" ou quando o
  // vídeo definitivamente não vai rodar)
  const skipSplash = useCallback(() => {
    splashPendingRef.current = false;
    releaseBootCover();
    setGone(true);
    window.setTimeout(() => setShow(false), FADE_MS);
  }, []);

  // Roda uma vez no cliente: decide se mostra o splash e orquestra o áudio.
  // Só no cliente para evitar mismatch de hidratação do overlay.
  useEffect(() => {
    if (!videoAllowed) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // sessionStorage indisponível — segue mostrando.
    }

    const v = videoRef.current;

    // Garante `muted` como atributo E propriedade ANTES de qualquer play(). O
    // React não reflete o `muted` como atributo HTML (bug conhecido) e, sem
    // ele, o celular trata o vídeo como "com som", bloqueia o autoplay e
    // desenha o play nativo por cima. Setando aqui, o autoplay mudo é liberado.
    if (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.setAttribute("muted", "");
    }

    // Já rodou nesta sessão: sem splash nem som — só mantém o vídeo de fundo
    // tocando, mudo e em loop.
    if (seen) {
      splashPendingRef.current = false;
      releaseBootCover();
      if (v)
        void v
          .play()
          .then(markPlaying)
          .catch(() => {});
      return;
    }

    splashPendingRef.current = true;

    // Trava de segurança: se o vídeo não COMEÇAR A TOCAR a tempo, pula o splash
    // direto. Garante que ninguém fique preso na tela preta nem no play nativo
    // do celular por mais de PLAY_MAX_MS.
    const safety = window.setTimeout(() => {
      if (!playingRef.current) skipSplash();
    }, PLAY_MAX_MS);

    // Após SKIP_VISIBLE_MS, mostra o botão "Pular" caso o vídeo ainda não
    // tenha começado a tocar. É o fallback visual para o usuário.
    const skipTimer = window.setTimeout(() => {
      if (!playingRef.current) {
        setShowSkip(true);
      }
    }, SKIP_VISIBLE_MS);

    // Fim da (única) passada com som: silencia e volta a rodar em loop mudo.
    function onEnded() {
      endedRef.current = true;
      if (!v) return;
      v.muted = true;
      v.loop = true;
      void v.play().catch(() => {});
      setSoundOn(false);
    }

    if (v) {
      v.loop = false; // sem loop nesta 1ª passada, pra o evento 'ended' disparar
      v.addEventListener("ended", onEnded);

      // O atributo `autoPlay` cobre o comportamento nativo e este play() roda
      // depois de garantirmos a propriedade `muted`. A Promise também cobre a
      // rara situação em que o evento `playing` ocorre antes deste efeito.
      v.play()
        .then(markPlaying)
        .catch(() => {
          // Nem mudo pôde tocar: navegador bloqueou autoplay completamente.
          // Em vez de prender a pessoa numa tela vazia, mantém a home visível.
          skipSplash();
        });
    }

    return () => {
      window.clearTimeout(safety);
      window.clearTimeout(skipTimer);
      splashPendingRef.current = false;
      releaseBootCover();
      if (v) {
        v.removeEventListener("ended", onEnded);
        v.pause();
        v.removeAttribute("src");
        v.load();
      }
    };
  }, [markPlaying, skipSplash, videoAllowed]);

  // Mantém o vídeo de fundo vivo no celular. iOS/Android pausam o <video>
  // quando a aba vai pro segundo plano, a tela bloqueia ou logo após a passada
  // com áudio.
  // CUIDADO: Não usamos listener de "pause" porque em alguns Androids isso
  // gera um loop infinito (o navegador pausa por política e nosso listener
  // dá play de novo, o que o navegador pausa de novo...). Usamos apenas o
  // evento "visibilitychange" para retomar quando a aba volta ao foco.
  useEffect(() => {
    if (!videoAllowed) return;
    const v = videoRef.current;
    if (!v) return;

    function resume() {
      // Só reanima o que está mudo: isso cobre o fundo em loop e a abertura sem
      // tentar contornar a política de áudio do navegador.
      if (!v || !v.paused || !v.muted) return;
      void v.play().catch(() => {});
    }
    function onVisibility() {
      if (document.visibilityState === "hidden") {
        v?.pause();
        return;
      }
      resume();
    }

    // Tenta retomar o vídeo se ele foi pausado por outra razão
    // (navegação interna / splash já visto: garante o fundo rodando)
    // Fazemos isso com um pequeno delay para evitar conflito com o useEffect
    // de boot que pode estar rodando ao mesmo tempo.
    const initialResumeTimer = window.setTimeout(resume, 200);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(initialResumeTimer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [videoAllowed]);

  // A capa preta do __root segura a home até aqui. Assim que a cortina e o
  // vídeo do splash estão no DOM (antes do paint), ela sai sem deixar a home
  // piscar entre uma e outra.
  useLayoutEffect(() => {
    if (show) releaseBootCover();
  }, [show]);

  // Começa a contar o tempo do splash só quando o vídeo REALMENTE começou a
  // tocar (evento `playing`) — nunca some com a tela preta nem prende o usuário
  // num play que não rodou. Passado HOLD_MS, dissolve e abre o site.
  useEffect(() => {
    if (!show || !playing || holdStartedRef.current) return;
    holdStartedRef.current = true;

    const hold = window.setTimeout(() => {
      setGone(true);
      window.setTimeout(() => setShow(false), FADE_MS);
    }, HOLD_MS);
    return () => window.clearTimeout(hold);
  }, [show, playing]);

  function toggleSound() {
    const v = videoRef.current;
    if (!v || endedRef.current) return;
    const next = !soundOn;
    v.muted = !next;
    if (next) {
      v.volume = 1;
      void v
        .play()
        .then(() => setSoundOn(true))
        .catch(() => {
          v.muted = true;
          setSoundOn(false);
        });
      return;
    }
    setSoundOn(false);
  }

  if (!videoAllowed) return null;

  const isBoot = show && !gone;

  return (
    <>
      <video
        ref={videoRef}
        className={`bg-video${isBoot ? " is-boot" : ""}`}
        src={sennaBg}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onLoadedMetadata={(event) => {
          // O arquivo tem uma breve faixa preta de codificação no início.
          event.currentTarget.currentTime = 0.2;
        }}
        // `onPlaying` é o gatilho que libera a contagem do splash.
        onPlaying={markPlaying}
        // Se o vídeo der erro (formato não suportado, rede, etc), pula direto
        onError={skipSplash}
      />

      {show && (
        <>
          <div className={`boot-curtain${gone ? " is-gone" : ""}`} aria-hidden="true" />
          <div
            className={`boot-splash${gone ? " is-gone" : ""}`}
            role="dialog"
            aria-label={copy.dialog}
          >
            <button
              type="button"
              className="boot-splash-sound"
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? copy.soundOff : copy.soundOn}
            >
              {soundOn ? (
                <Volume2 size={20} aria-hidden="true" />
              ) : (
                <VolumeX size={20} aria-hidden="true" />
              )}
            </button>

            {/* Botão "Pular" — aparece após SKIP_VISIBLE_MS caso o vídeo
                não tenha carregado, para que o usuário nunca fique preso */}
            {showSkip && (
              <button
                type="button"
                className="boot-splash-skip"
                onClick={skipSplash}
                aria-label={copy.skip}
              >
                <span>{copy.skipText}</span>
                <SkipForward size={16} aria-hidden="true" />
              </button>
            )}

            <blockquote className="boot-splash-quote">
              <p>{copy.quote}</p>
              <cite>— Ayrton Senna</cite>
            </blockquote>

            <a
              href="https://www.youtube.com/watch?v=pQntm_UC47U"
              target="_blank"
              rel="noopener noreferrer"
              className="boot-splash-credit"
            >
              {copy.credit} <strong>@csavfx</strong> {locale === "pt" ? "no" : "on"} YouTube
            </a>
          </div>
        </>
      )}
    </>
  );
}
