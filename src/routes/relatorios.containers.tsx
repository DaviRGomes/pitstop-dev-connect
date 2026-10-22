import { createFileRoute } from "@tanstack/react-router";
import { guardDraft } from "@/lib/drafts";
import { CHECKLIST, INTRO, LENS, LESSONS, NOTES } from "@/data/containers";
import { GuideProgress, GuideRail } from "@/components/guide/GuideKit";
import {
  ChecklistSection,
  LensSection,
  Md,
  TechLessonSection,
  type TechCopy,
} from "@/components/guide/LensKit";
import { useGuideProgress, useScrollSpy, useSectionReveal } from "@/components/guide/hooks";
import { f1Logo } from "@/assets/brand/paths";
import { reportHead } from "@/lib/seo";

export const Route = createFileRoute("/relatorios/containers")({
  beforeLoad: guardDraft("containers"),
  head: () =>
    reportHead({
      locale: "pt",
      title: "Containers e Docker: da imagem à produção | pitstop.dev",
      description:
        "Guia de containers e Docker em 13 etapas: imagens, Dockerfile, camadas, volumes, redes, Compose, segurança, segredos, troubleshooting e observabilidade, com uma lente geral de Fórmula 1.",
      ptPath: "/relatorios/containers",
      enPath: "/en/relatorios/containers",
    }),
  component: Index,
});

const NAV = [
  { id: "inicio", num: "00", title: "Início" },
  { id: "lente", num: "F1", title: "A lente de F1" },
  ...LESSONS.map((l) => ({ id: l.id, num: l.num, title: l.navTitle })),
  { id: "checklist", num: "14", title: "Checklist" },
];

const LESSON_COPY: TechCopy = {
  stage: "Etapa",
  problem: "O problema",
  howItWorks: "O conceito",
  commandsTitle: "Comandos essenciais desta etapa",
  handsOn: "Mão na massa",
  tip: "Dica:",
  takeaway: "Anota aí:",
  doneLabel: (num: string) => `etapa ${num} concluída (clique p/ desfazer)`,
  markDoneLabel: (num: string) => `marcar etapa ${num} como concluída`,
};

function Index() {
  const [done, setDone] = useGuideProgress("pitstop-progress-containers");
  useSectionReveal();
  const activeId = useScrollSpy(NAV.map((n) => n.id));

  const doneCount = LESSONS.filter((l) => done[l.id]).length;
  const [opening, ...howTo] = INTRO;

  return (
    <div className="shell">
      <GuideRail
        nav={NAV}
        activeId={activeId}
        done={done}
        ariaLabel="Etapas"
        railFoot={
          <>
            guia interativo · react
            <br />
            conteúdo das aulas 1–6
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              guia de estudo · <b>containers e docker em 13 etapas</b>
            </p>
            <h1 className="htitle">
              Containers e Docker
              <br />
              pela lente da <span className="b">F1</span>.
            </h1>
            <p className="narration">
              <Md text={opening} />
            </p>
            {howTo.map((p, i) => (
              <p className="lead" key={i}>
                <Md text={p} />
              </p>
            ))}
            <GuideProgress doneCount={doneCount} total={LESSONS.length} label="SEU PROGRESSO" />
          </header>

          <LensSection
            lens={LENS}
            copy={{
              eyebrow: "A lente de F1 deste guia",
              title: "O carro montado a partir da folha",
              mappingTitle: "Os termos em palavras simples",
              headers: ["Termo técnico", "Em palavras simples"],
              limitsTitle: "Onde a comparação para",
            }}
          />

          {LESSONS.map((lesson) => (
            <TechLessonSection
              key={lesson.id}
              lesson={lesson}
              done={!!done[lesson.id]}
              onToggleDone={() => setDone((d) => ({ ...d, [lesson.id]: !d[lesson.id] }))}
              copy={LESSON_COPY}
            />
          ))}

          <ChecklistSection
            id="checklist"
            eyebrow="Etapa 14 · revisão"
            title="Checklist de autoavaliação"
            groups={CHECKLIST}
            notesTitle="Notas do professor: precisões técnicas"
            notes={NOTES}
          />

          <footer>
            <span className="foot-brand">
              <img src={f1Logo} alt="" width={38} height={19} />
              <span>
                <b>pitstop.dev</b> · guia Containers e Docker, etapa por etapa, baseado nas aulas
                1–6 do módulo.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
