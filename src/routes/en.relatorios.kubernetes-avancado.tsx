import { createFileRoute } from "@tanstack/react-router";
import { ANALOGY_NOTES, DE_PARA, LESSONS } from "@/data/kubernetesavancado.en";
import {
  DeParaDetails,
  GuideProgress,
  GuideRail,
  LessonSection,
  useGuideProgress,
  useScrollSpy,
  useSectionReveal,
} from "@/components/guide/GuideKit";
import { f1Logo } from "@/assets/brand/paths";

export const Route = createFileRoute("/en/relatorios/kubernetes-avancado")({
  component: Index,
});

const NAV = [
  { id: "inicio", num: "00", title: "Start" },
  ...LESSONS.map((l) => ({ id: l.id, num: l.num, title: l.navTitle })),
];

const PROGRESS_KEY = "pitstop-progress-avancado-en";

const LESSON_COPY = {
  stage: "Stage",
  howItWorks: "How it works",
  commandsTitle: "Essential commands for this stage",
  handsOn: "Hands-on",
  tip: "Tip:",
  takeaway: "Takeaway:",
  doneLabel: (num: string) => `stage ${num} completed (click to undo)`,
  markDoneLabel: (num: string) => `mark stage ${num} as complete`,
};

function Index() {
  const [done, setDone] = useGuideProgress(PROGRESS_KEY);
  useSectionReveal();
  const activeId = useScrollSpy(NAV.map((n) => n.id));

  const doneCount = LESSONS.filter((l) => done[l.id]).length;

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
            content from lessons 1–9 (Phase 2)
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              live broadcast · <b>the advanced Kubernetes GP, stage by stage</b>
            </p>
            <h1 className="htitle">
              Advanced Kubernetes
              <br />
              live from the <span className="b">paddock</span>.
            </h1>
            <p className="narration">
              Back on track, and now it's the grown-ups' championship! Nine stages from Phase 2:
              health and resources, fine-grained scheduling, rollouts, Helm, Blue/Green, Canary,
              Karpenter, KEDA and security. You already know how to drive the car. Here we tune the
              setup to win the title. Lights out, the driver takes over.
            </p>
            <p className="lead">
              This is the <strong>Phase 2</strong> guide: it assumes you already know the basics
              (Pods, Deployments, Services, kubectl) and raises the level to operate real clusters:{" "}
              <strong>the problem each piece solves</strong>, an honest F1 analogy, commented YAML,
              commands with the expected output, and a <strong>hands-on</strong> section per stage.
            </p>
            <DeParaDetails
              summaryLabel="The cheat sheet: pin this to your visor"
              intro={
                <>
                  The same analogy holds from the first stage to the last.{" "}
                  <b>Don't try to memorize this table now.</b> It's the track map, not the exam: go
                  straight to Stage 01 and come back here whenever an analogy shows up in the text.
                </>
              }
              headers={["Kubernetes", "Formula 1"]}
              mapping={DE_PARA.map((m) => ({ left: m.k8s, right: m.f1 }))}
              breaksLabel="Where the analogies break down (a driver who hides the car's limits crashes into the wall):"
              notes={ANALOGY_NOTES}
            />
            <GuideProgress doneCount={doneCount} total={LESSONS.length} label="YOUR PROGRESS" />
          </header>

          {LESSONS.map((lesson) => (
            <LessonSection
              key={lesson.id}
              lesson={lesson}
              done={!!done[lesson.id]}
              onToggleDone={() => setDone((d) => ({ ...d, [lesson.id]: !d[lesson.id] }))}
              copy={LESSON_COPY}
            />
          ))}

          <footer>
            <span className="foot-brand">
              <img src={f1Logo} alt="" width={38} height={19} />
              <span>
                <b>pitstop.dev</b> · advanced Kubernetes guide, stage by stage, based on lessons 1–9
                of the DevOps and Cloud Architecture module (Phase 2, FIAP).
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
