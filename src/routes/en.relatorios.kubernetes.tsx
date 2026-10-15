import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Flag } from "lucide-react";
import { CHECKLIST, INTRO, LENS, LESSONS, NOTES, PLATFORMS } from "@/data/kubernetesbasico.en";
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

export const Route = createFileRoute("/en/relatorios/kubernetes")({
  head: () =>
    reportHead({
      locale: "en",
      title: "Kubernetes explicado com exemplos reais | pitstop.dev",
      description:
        "A Kubernetes guide from scratch: concepts, annotated YAML, commands and hands-on exercises, with a general Formula 1 lens that shows the cluster as a team.",
      ptPath: "/relatorios/kubernetes",
      enPath: "/en/relatorios/kubernetes",
    }),
  component: Index,
});

function PlatformsSection() {
  return (
    <section className="section" id="pratica">
      <p className="eyebrow">
        Stage 10 <span className="tag">free labs</span>
      </p>
      <h2>Practice for free on real clusters</h2>
      <p className="lead">
        These platforms give you a terminal with a real Kubernetes cluster right in the browser,
        with nothing to install. Start with the 100% free ones and move to the paid ones only when
        you want bigger challenges.
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
              <b>Good for:</b> {p.goodFor}
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
          <b>Suggested route:</b> at every stage of this guide, open <strong>Killercoda</strong> and
          repeat the commands in the matching scenario (Pods, Deployments, Volumes). After the 9
          stages, use <strong>KodeKloud</strong> for troubleshooting challenges.
        </p>
      </div>
    </section>
  );
}

const NAV = [
  { id: "inicio", num: "00", title: "Start" },
  { id: "lente", num: "F1", title: "The F1 lens" },
  ...LESSONS.map((l) => ({ id: l.id, num: l.num, title: l.navTitle })),
  { id: "pratica", num: "10", title: "Practice for free" },
  { id: "checklist", num: "11", title: "Checklist" },
];

const LESSON_COPY: TechCopy = {
  stage: "Stage",
  problem: "The problem",
  howItWorks: "The concept",
  commandsTitle: "Essential commands for this stage",
  handsOn: "Hands-on",
  tip: "Tip:",
  takeaway: "Takeaway:",
  doneLabel: (num: string) => `stage ${num} completed (click to undo)`,
  markDoneLabel: (num: string) => `mark stage ${num} as complete`,
};

function Index() {
  const [done, setDone] = useGuideProgress("pitstop-progress-en");
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
        ariaLabel="Stages"
        railFoot={
          <>
            interactive guide · react
            <br />
            content from lessons 1–8 + bonus
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              study guide · <b>Kubernetes basics in 8 stages + bonus</b>
            </p>
            <h1 className="htitle">
              Kubernetes explained
              <br />
              through the <span className="b">F1</span> lens.
            </h1>
            <p className="narration">
              <Md text={opening} />
            </p>
            {howTo.map((p, i) => (
              <p className="lead" key={i}>
                <Md text={p} />
              </p>
            ))}
            <GuideProgress doneCount={doneCount} total={LESSONS.length} label="YOUR PROGRESS" />
          </header>

          <LensSection
            lens={LENS}
            copy={{
              eyebrow: "The F1 lens of this guide",
              title: "An F1 team on a GP weekend",
              mappingTitle: "The terms in plain words",
              headers: ["Technical term", "In plain words"],
              limitsTitle: "Where the comparison stops",
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
            eyebrow="Stage 11 · review"
            title="Self-assessment checklist"
            groups={CHECKLIST}
            notesTitle="Teacher's notes: technical precisions"
            notes={NOTES}
          />

          <footer>
            <span className="foot-brand">
              <img src={f1Logo} alt="" width={38} height={19} />
              <span>
                <b>pitstop.dev</b> · Kubernetes guide, stage by stage, based on lessons 1–8 (Thiago
                Adriano, FIAP), with a bonus stage of professional application.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
