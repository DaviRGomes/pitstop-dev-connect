import { createFileRoute } from "@tanstack/react-router";
import { CHECKLIST, INTRO, LENS, LESSONS, NOTES } from "@/data/kubernetesavancado.en";
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

export const Route = createFileRoute("/en/relatorios/kubernetes-avancado")({
  head: () =>
    reportHead({
      locale: "en",
      title: "Advanced Kubernetes: from health checks to security | pitstop.dev",
      description:
        "An advanced Kubernetes guide in 9 stages plus a production bonus: probes and resources, scheduling, rollouts, Helm, Blue/Green, canary, Karpenter, KEDA and security, with a general Formula 1 lens.",
      ptPath: "/relatorios/kubernetes-avancado",
      enPath: "/en/relatorios/kubernetes-avancado",
    }),
  component: Index,
});

const NAV = [
  { id: "inicio", num: "00", title: "Start" },
  { id: "lente", num: "F1", title: "The F1 lens" },
  ...LESSONS.map((l) => ({ id: l.id, num: l.num, title: l.navTitle })),
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
  const [done, setDone] = useGuideProgress("pitstop-progress-avancado-en");
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
            content from lessons 1–9 (Phase 2) + bonus
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              study guide · <b>advanced Kubernetes in 9 stages + bonus</b>
            </p>
            <h1 className="htitle">
              Advanced Kubernetes
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
              title: "The fine-grained operation of an F1 team",
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
                <b>pitstop.dev</b> · advanced Kubernetes guide, stage by stage, based on lessons 1–9
                of the DevOps and Cloud Architecture module (Phase 2, FIAP), with a bonus stage of
                professional application.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
