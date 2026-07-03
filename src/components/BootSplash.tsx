import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { sennaBg } from "@/assets/brand/paths";

// Marca que o intro já rodou nesta sessão do navegador. Usamos sessionStorage
// (não localStorage) para que o splash reapareça sempre que a pessoa "abre o
// site" numa nova aba/sessão, mas não a cada navegação interna.
const SEEN_KEY = "pitstop-boot-seen";
// Precisa casar com a transição .8s de .boot-splash no styles.css.
const FADE_MS = 900;
// Quanto tempo o splash fica na tela antes de dissolver e abrir o site.
const HOLD_MS = 12600;

/**
 * Splash de abertura com o vídeo do Ayrton Senna.
 *
 * O SOM toca uma única vez, do início ao fim do vídeo:
 *  1. Ao abrir o site (1x por sessão), o vídeo de fundo (`video.bg-video`) —
 *     que já roda atrás do conteúdo — vira a FONTE ÚNICA de áudio e começa a
 *     tocar com som desde o início, enquanto o splash cobre a tela por ~3,6s.
 *  2. Passados ~3,6s o splash dissolve e abre a home; o mesmo vídeo continua
 *     tocando com som ao fundo, sem cortar.
 *  3. Quando esse vídeo chega ao FIM (`ended`), o som acaba de vez: ele fica
 *     mudo e passa a rodar em loop silencioso. Sem som infinito.
 *
 * Autoplay com áudio depende do "media engagement" do navegador (só libera
 * onde a pessoa já interagiu). Se for bloqueado, o vídeo toca mudo e o primeiro
 * gesto (clique/toque/tecla) liga o som; o ícone no canto é o controle manual.
 */
export function BootSplash() {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const bgRef = useRef<HTMLVideoElement | null>(null);
  const endedRef = useRef(false);

  // Roda uma vez no cliente: decide se mostra o splash, agenda o fade e
  // orquestra o áudio do vídeo de fundo. Só no cliente para evitar mismatch de
  // hidratação (server e primeiro render devolvem null).
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // sessionStorage indisponível — segue mostrando.
    }
    if (seen) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // ignore
    }

    // Mostra o splash e agenda o fade após ~3,6s (independente do áudio).
    setShow(true);
    const hold = window.setTimeout(() => {
      setGone(true);
      window.setTimeout(() => setShow(false), FADE_MS);
    }, HOLD_MS);

    // Vídeo de fundo = fonte única de som.
    const bg = document.querySelector<HTMLVideoElement>("video.bg-video");
    bgRef.current = bg;

    let armed = false;

    function disarm() {
      if (!armed) return;
      armed = false;
      document.removeEventListener("pointerdown", onGesture);
      document.removeEventListener("keydown", onGesture);
    }

    // Primeiro gesto do usuário libera o som, caso o autoplay com áudio tenha
    // sido bloqueado — mas só enquanto o vídeo ainda não terminou.
    function onGesture(e: Event) {
      if (e.target instanceof Element && e.target.closest(".boot-splash-sound")) return;
      if (!bg || endedRef.current) return;
      bg.muted = false;
      bg.volume = 1;
      void bg.play().catch(() => { });
      setSoundOn(true);
      disarm();
    }

    // Fim da (única) passada com som: silencia e volta a rodar em loop mudo.
    function onEnded() {
      endedRef.current = true;
      disarm();
      if (!bg) return;
      bg.muted = true;
      bg.loop = true;
      void bg.play().catch(() => { });
      setSoundOn(false);
    }

    if (bg) {
      bg.loop = false; // sem loop nesta 1ª passada, pra o evento 'ended' disparar
      bg.currentTime = 0;
      bg.muted = false;
      bg.volume = 1;
      bg.addEventListener("ended", onEnded);
      bg.play()
        .then(() => setSoundOn(true))
        .catch(() => {
          // Autoplay com som bloqueado: toca mudo e espera o 1º gesto.
          bg.muted = true;
          void bg.play().catch(() => { });
          armed = true;
          document.addEventListener("pointerdown", onGesture);
          document.addEventListener("keydown", onGesture);
        });
    }

    return () => {
      window.clearTimeout(hold);
      disarm();
      if (bg) bg.removeEventListener("ended", onEnded);
    };
  }, []);

  function toggleSound() {
    const bg = bgRef.current;
    if (!bg || endedRef.current) return;
    const next = !soundOn;
    setSoundOn(next);
    bg.muted = !next;
    if (next) {
      bg.volume = 1;
      void bg.play().catch(() => { });
    }
  }

  if (!show) return null;

  return (
    <div className={`boot-splash ${gone ? "is-gone" : ""}`} role="dialog" aria-label="Abertura">
      <video
        className="boot-splash-video"
        src={sennaBg}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      <button
        type="button"
        className="boot-splash-sound"
        onClick={toggleSound}
        aria-pressed={soundOn}
        aria-label={soundOn ? "Desativar som" : "Ativar som"}
      >
        {soundOn ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
      </button>

      <blockquote className="boot-splash-quote">
        <p>
          "Tenha sempre como meta muita força, muita determinação e sempre faça
          tudo com muito amor e muita fé em Deus, que um dia você chega lá"
        </p>
        <cite>— Ayrton Senna</cite>
      </blockquote>
    </div>
  );
}
