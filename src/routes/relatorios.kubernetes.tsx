import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Flag } from "lucide-react";
import { CHECKLIST, INTRO, LENS, LESSONS, NOTES, PLATFORMS } from "@/data/kubernetesbasico";
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

export const Route = createFileRoute("/relatorios/kubernetes")({
  head: () =>
    reportHead({
      locale: "pt",
      title: "Kubernetes explicado com exemplos reais | pitstop.dev",
      description:
        "Guia de Kubernetes do zero: conceitos, YAML comentado, comandos e exercícios práticos, com uma lente geral de Fórmula 1 para enxergar o cluster como uma equipe.",
      ptPath: "/relatorios/kubernetes",
      enPath: "/en/relatorios/kubernetes",
    }),
  component: Index,
});

function PlatformsSection() {
  return (
    <section className="section" id="pratica">
      <p className="eyebrow">
        Etapa 10 <span className="tag">labs online</span>
      </p>
      <h2>Pratique de graça em clusters reais</h2>
      <p className="lead">
        Estas plataformas dão um terminal com Kubernetes real direto no navegador, sem instalar
        nada. Comece pelas 100% gratuitas e passe para as pagas só quando quiser desafios maiores.
      </p>
      <div className="grid g2">
        {PLATFORMS.map((p) => (
          <div className="panel plat-card" key={p.name}>
            <div className="plat-head">
              <h4>{p.name}</h4>
              <span className={`badge ${p.free ? "badge-free" : "badge-tier"}`}>{p.price}</span>
            </div>
            <p>{p.desc}</p>
            <p className="plat-good">
              <b>Bom para:</b> {p.goodFor}
            </p>
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              {p.urlLabel} <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
      <div className="callout teal">
        <Flag className="co-ic" size={17} aria-hidden="true" />
        <p>
          <b>Roteiro sugerido:</b> a cada etapa deste guia, abra o <strong>Killercoda</strong> e
          repita os comandos no cenário equivalente (Pods, Deployments, Volumes). Depois das 9
          etapas, use o <strong>KodeKloud</strong> para desafios de troubleshooting.
        </p>
      </div>
    </section>
  );
}

const NAV = [
  { id: "inicio", num: "00", title: "Início" },
  { id: "lente", num: "F1", title: "A lente de F1" },
  ...LESSONS.map((l) => ({ id: l.id, num: l.num, title: l.navTitle })),
  { id: "pratica", num: "10", title: "Pratique de graça" },
  { id: "checklist", num: "11", title: "Checklist" },
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
  const [done, setDone] = useGuideProgress("pitstop-progress");
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
            conteúdo das aulas 1–8 + bônus
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              guia de estudo · <b>kubernetes básico em 8 etapas + bônus</b>
            </p>
            <h1 className="htitle">
              Kubernetes explicado
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
              title: "Uma equipe de F1 num fim de semana de GP",
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

          <PlatformsSection />

          <ChecklistSection
            id="checklist"
            eyebrow="Etapa 11 · revisão"
            title="Checklist de autoavaliação"
            groups={CHECKLIST}
            notesTitle="Notas do professor: precisões técnicas"
            notes={NOTES}
          />

          <footer>
            <span className="foot-brand">
              <img src={f1Logo} alt="" width={38} height={19} />
              <span>
                <b>pitstop.dev</b> · guia Kubernetes etapa por etapa, baseado nas aulas 1–8 (Thiago
                Adriano, FIAP), com uma etapa bônus de aplicação profissional.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
