import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, SkipForward } from "lucide-react";

import { sennaBg } from "@/assets/brand/paths";

// Marca que o intro já rodou nesta sessão do navegador. Usamos sessionStorage
// (não localStorage) para que o splash reapareça sempre que a pessoa "abre o
// site" numa nova aba/sessão, mas não a cada navegação interna.
const SEEN_KEY = "pitstop-boot-seen";
// Precisa casar com a transição .8s de .boot-splash no styles.css.
const FADE_MS = 900;
// Tempo que o splash fica visível DEPOIS que o vídeo aparece (não desde o
// carregamento) — assim o vídeo é sempre mostrado por esse tempo.
const HOLD_MS = 12600;
// Se o vídeo não COMEÇAR A TOCAR até aqui, pula o splash direto. É o que
// impede o play nativo do celular de ficar preso por cima do texto quando o
// navegador bloqueia o autoplay.
const PLAY_MAX_MS = 3000;
// Após esse tempo sem o vídeo tocar, mostra o botão "Pular" para que
// o usuário não fique preso. É um último recurso pro caso do navegador não
// suportar autoplay.
const SKIP_VISIBLE_MS = 2000;

/**
 * Abertura + vídeo de fundo do site — UM único elemento <video>.
 *
 * Este componente vive no __root, então o mesmo <video.bg-video> é a fonte de
 * imagem e som do site inteiro (evita baixar/decodificar o arquivo duas vezes,
 * que era o que deixava a tela preta no início). Ele tem dois "modos":
 *
 *  - boot (`is-boot`): 1x por sessão, no topo (z-index alto) e vívido, servindo
 *    de splash. Uma cortina preta atrás dele esconde a home; a citação fica por
 *    cima. O som toca desde o início.
 *  - fundo: nos demais momentos, fica lá atrás (z-index 0, bem apagado), como
 *    plano de fundo enquanto a pessoa navega.
 *
 * O splash só começa a contar o tempo quando o vídeo REALMENTE começa a tocar
 * (`onPlaying`), então nunca some com a tela preta nem prende o usuário num
 * play que não rodou. Passado o tempo, a cortina e a citação dissolvem e o
 * mesmo vídeo recua pro fundo, sem cortar.
 *
 * O SOM toca uma única vez, do início ao fim: quando o vídeo termina (`ended`),
 * fica mudo e passa a rodar em loop silencioso. Autoplay com áudio depende do
 * "media engagement" do navegador; se bloqueado, o vídeo toca mudo e o primeiro
 * gesto (clique/toque/tecla) liga o som. O ícone no canto é o controle manual.
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
export function BootSplash() {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const endedRef = useRef(false);
  // Impede que o vídeo seja marcado como "tocando" mais de uma vez e que o
  // timer do splash (HOLD) seja iniciado duas vezes.
  const playingRef = useRef(false);
  const holdStartedRef = useRef(false);

  // Marca que o vídeo COMEÇOU a tocar de verdade (primeiro quadro em
  // movimento, via evento `playing`). É esse sinal — e não a mera prontidão do
  // arquivo — que libera a contagem do splash. No celular que bloqueia o
  // autoplay, ele nunca dispara e a trava de segurança pula o splash.
  const markPlaying = useCallback(() => {
    if (playingRef.current) return;
    playingRef.current = true;
    setPlaying(true);
    setShowSkip(false);
  }, []);

  // Pula o splash imediatamente (chamado pelo botão "Pular" ou quando o
  // vídeo definitivamente não vai rodar)
  const skipSplash = useCallback(() => {
    setGone(true);
    window.setTimeout(() => setShow(false), FADE_MS);
  }, []);

  // Roda uma vez no cliente: decide se mostra o splash e orquestra o áudio.
  // Só no cliente para evitar mismatch de hidratação do overlay.
  useEffect(() => {
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
      if (v) void v.play().catch(() => { });
      return;
    }
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // ignore
    }

    setShow(true);

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

    let armed = false;

    // O celular não libera áudio sem um gesto — e o WebKit (iOS) vai além: se a
    // gente desmutar sem toque um vídeo que entrou por autoplay mudo, ele PAUSA
    // o vídeo, passa a exigir gesto até pra tocar mudo de novo e desenha o play
    // nativo dele por cima do site. Era isso que obrigava a apertar play no
    // celular. Em ponteiro grosso (touch), então, nem tentamos: roda mudo e o
    // primeiro toque liga o som.
    const mayTrySound = !window.matchMedia("(pointer: coarse)").matches;

    function arm() {
      if (armed || endedRef.current) return;
      armed = true;
      document.addEventListener("pointerdown", onGesture);
      document.addEventListener("keydown", onGesture);
    }

    function disarm() {
      if (!armed) return;
      armed = false;
      document.removeEventListener("pointerdown", onGesture);
      document.removeEventListener("keydown", onGesture);
    }

    // Primeiro gesto do usuário: destrava o que o navegador tiver bloqueado —
    // o som e, no pior caso (iOS em Modo de Baixo Consumo), o próprio playback.
    function onGesture(e: Event) {
      if (e.target instanceof Element && e.target.closest(".boot-splash-sound")) return;
      if (e.target instanceof Element && e.target.closest(".boot-splash-skip")) return;
      if (!v || endedRef.current) return;
      v.muted = false;
      v.volume = 1;
      void v.play().catch(() => { });
      setSoundOn(true);
      disarm();
    }

    // Fim da (única) passada com som: silencia e volta a rodar em loop mudo.
    function onEnded() {
      endedRef.current = true;
      disarm();
      if (!v) return;
      v.muted = true;
      v.loop = true;
      void v.play().catch(() => { });
      setSoundOn(false);
    }

    // Só no desktop: tenta subir o som de um vídeo que JÁ está tocando. Se o
    // navegador não nos deu "media engagement" suficiente, ele pausa ao desmutar
    // e rejeita este play() — aí voltamos pro mudo (a imagem não para) e o 1º
    // gesto liga o som.
    function tryUnmute() {
      if (!v || endedRef.current) return;
      v.muted = false;
      v.volume = 1;
      v.play()
        .then(() => setSoundOn(true))
        .catch(() => {
          v.muted = true;
          setSoundOn(false);
          void v.play().catch(() => { });
          arm();
        });
    }

    if (v) {
      v.loop = false; // sem loop nesta 1ª passada, pra o evento 'ended' disparar
      v.addEventListener("ended", onEnded);

      // Quem dá o play é o JS (mudo), NÃO o atributo `autoPlay`. Assim o play
      // acontece só depois de garantirmos o estado mudo acima — é isso que
      // evita o play nativo do celular quando o navegador bloquearia o autoplay
      // do atributo antes do JS rodar. O som vem depois (desktop) ou no
      // primeiro toque (celular).
      v.play()
        .then(() => (mayTrySound ? tryUnmute() : arm()))
        .catch(() => {
          // Nem mudo pôde tocar: navegador bloqueou autoplay completamente.
          // Isso acontece em Samsung Internet com economia de dados, UC Browser,
          // alguns Firefox Mobile e dispositivos com pouca RAM.
          // Em vez de deixar o play nativo preso por cima do texto, PULAMOS o
          // splash na hora; o 1º gesto liga o som no fundo.
          arm(); // arma o gesto pra ligar o som no fundo
          skipSplash();
        });
    }

    return () => {
      window.clearTimeout(safety);
      window.clearTimeout(skipTimer);
      disarm();
      if (v) v.removeEventListener("ended", onEnded);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mantém o vídeo de fundo vivo no celular. iOS/Android pausam o <video>
  // quando a aba vai pro segundo plano, a tela bloqueia ou logo após a passada
  // com áudio.
  // CUIDADO: Não usamos listener de "pause" porque em alguns Androids isso
  // gera um loop infinito (o navegador pausa por política e nosso listener
  // dá play de novo, o que o navegador pausa de novo...). Usamos apenas o
  // evento "visibilitychange" para retomar quando a aba volta ao foco.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    function resume() {
      // Só reanima o que está mudo: isso cobre o fundo em loop e a abertura no
      // celular (que roda mudo), sem brigar com a passada com som do desktop —
      // lá, se o navegador pausar ao desmutar, quem trata é o tryUnmute.
      if (!v || !v.paused || !v.muted) return;
      void v.play().catch(() => { });
    }
    function onVisibility() {
      if (document.visibilityState === "visible") resume();
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
  }, []);

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
    setSoundOn(next);
    v.muted = !next;
    if (next) {
      v.volume = 1;
      void v.play().catch(() => { });
    }
  }

  const isBoot = show && !gone;

  return (
    <>
      <video
        ref={videoRef}
        className={`bg-video${isBoot ? " is-boot" : ""}`}
        src={sennaBg}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        // Sem o atributo `autoPlay`: quem dá o play é o JS, mudo, no momento
        // certo (ver useEffect). Isso evita o play nativo do celular quando o
        // navegador bloquearia o autoplay do atributo antes do JS rodar.
        // `onPlaying` é o gatilho que libera a contagem do splash.
        onPlaying={markPlaying}
        // Se o vídeo der erro (formato não suportado, rede, etc), pula direto
        onError={skipSplash}
      />

      {show && (
        <>
          <div className={`boot-curtain${gone ? " is-gone" : ""}`} aria-hidden="true" />
          <div className={`boot-splash${gone ? " is-gone" : ""}`} role="dialog" aria-label="Abertura">
            <button
              type="button"
              className="boot-splash-sound"
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? "Desativar som" : "Ativar som"}
            >
              {soundOn ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
            </button>

            {/* Botão "Pular" — aparece após SKIP_VISIBLE_MS caso o vídeo
                não tenha carregado, para que o usuário nunca fique preso */}
            {showSkip && (
              <button
                type="button"
                className="boot-splash-skip"
                onClick={skipSplash}
                aria-label="Pular abertura"
              >
                <span>Pular</span>
                <SkipForward size={16} aria-hidden="true" />
              </button>
            )}

            <blockquote className="boot-splash-quote">
              <p>
                "Tenha sempre como meta muita força, muita determinação e sempre faça
                tudo com muito amor e muita fé em Deus, que um dia você chega lá"
              </p>
              <cite>— Ayrton Senna</cite>
            </blockquote>

            <a
              href="https://www.youtube.com/watch?v=pQntm_UC47U"
              target="_blank"
              rel="noopener noreferrer"
              className="boot-splash-credit"
            >
              Vídeo: <strong>@csavfx</strong> no YouTube
            </a>
          </div>
        </>
      )}
    </>
  );
}
