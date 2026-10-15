import { createFileRoute } from "@tanstack/react-router";
import { LESSONS, OBSERVABILITY_NODE, SYSTEM_MAP } from "@/data/escalabilidade";
import { GuideProgress, GuideRail } from "@/components/guide/GuideKit";
import { ScaleLessonSection, SystemMap, type ScaleCopy } from "@/components/guide/ScaleKit";
import { useGuideProgress, useScrollSpy, useSectionReveal } from "@/components/guide/hooks";
import { f1Logo } from "@/assets/brand/paths";
import { reportHead } from "@/lib/seo";

export const Route = createFileRoute("/relatorios/escalabilidade")({
  head: () =>
    reportHead({
      locale: "pt",
      title: "Escalabilidade nos servidores: seis perguntas antes do pico | pitstop.dev",
      description:
        "Guia de escalabilidade em seis perguntas: escala vertical e horizontal, load balancers, aplicações stateless, filas, CDN, réplicas de banco, CAP e observabilidade, com trade-offs e laboratórios locais.",
      ptPath: "/relatorios/escalabilidade",
      enPath: "/en/relatorios/escalabilidade",
    }),
  component: Index,
});

const NAV = [
  { id: "inicio", num: "00", title: "O mapa" },
  ...LESSONS.map((lesson) => ({
    id: lesson.id,
    num: lesson.num,
    title: lesson.navTitle,
  })),
];

const PROGRESS_KEY = "pitstop-progress-escalabilidade";

const READING_ORDER = [
  "Pergunta",
  "Sintoma",
  "Conceito",
  "Analogia",
  "Ganha × paga",
  "Laboratório",
];

const LESSON_COPY: ScaleCopy = {
  question: "Pergunta",
  symptom: "Sintoma",
  pitScene: "No box:",
  answer: "Resposta curta",
  howItWorks: "Como funciona",
  analogies: "Na linguagem do paddock",
  analogyLimit: "Onde a analogia quebra:",
  tradeoffs: "Ganha × paga",
  tradeoffHeaders: ["Opção", "Ganha", "Paga"],
  lab: "Laboratório",
  labCommands: "Comandos",
  labSteps: "Roteiro",
  rule: "Regra de bolso:",
  pitRule: "Na pista:",
  selfCheck: "Teste rápido:",
  doneLabel: (num: string) => `pergunta ${num} respondida (clique p/ desfazer)`,
  markDoneLabel: (num: string) => `marcar pergunta ${num} como respondida`,
};

function Index() {
  const [done, setDone] = useGuideProgress(PROGRESS_KEY);
  useSectionReveal();
  const activeId = useScrollSpy(NAV.map((item) => item.id));

  const doneCount = LESSONS.filter((lesson) => done[lesson.id]).length;

  return (
    <div className="shell">
      <GuideRail
        nav={NAV}
        activeId={activeId}
        done={done}
        ariaLabel="Perguntas"
        railFoot={
          <>
            guia técnico · react
            <br />
            conteúdo das Aulas 01 a 06
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero sc-hero" id="inicio">
            <p className="kicker">
              guia técnico · <b>6 perguntas, 6 laboratórios locais</b>
            </p>
            <h1 className="htitle">
              Escalabilidade
              <br />
              <span className="b">antes do pico.</span>
            </h1>
            <p className="lead">
              Escalar não é comprar uma máquina maior. É decidir, peça por peça, onde a carga entra,
              onde o estado mora, o que pode esperar e o que pode ser copiado. Este guia responde{" "}
              <strong>seis perguntas</strong>, uma por aula, e cada resposta acrescenta uma peça ao
              mapa abaixo. Cada peça tem um equivalente no box de F1, e a analogia acompanha todas
              as etapas para fixar o conceito, não para substituí-lo. Os laboratórios rodam com
              Docker na sua máquina, sem conta de nuvem.
            </p>

            <p className="sc-map-title">O caminho de uma requisição</p>
            <SystemMap
              nodes={SYSTEM_MAP}
              observability={OBSERVABILITY_NODE}
              done={done}
              stageLabel="pergunta"
            />

            <ol className="sc-reading" aria-label="Como cada pergunta está organizada">
              {READING_ORDER.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <GuideProgress
              doneCount={doneCount}
              total={LESSONS.length}
              label="PERGUNTAS RESPONDIDAS"
            />
          </header>

          {LESSONS.map((lesson) => (
            <ScaleLessonSection
              key={lesson.id}
              lesson={lesson}
              done={!!done[lesson.id]}
              onToggleDone={() =>
                setDone((current) => ({ ...current, [lesson.id]: !current[lesson.id] }))
              }
              copy={LESSON_COPY}
            />
          ))}

          <footer>
            <span className="foot-brand">
              <img src={f1Logo} alt="" width={38} height={19} />
              <span>
                <b>pitstop.dev</b> · guia Escalabilidade nos servidores, em seis perguntas, baseado
                nas Aulas 01 a 06 da disciplina.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
