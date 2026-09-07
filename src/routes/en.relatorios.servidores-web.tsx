import { createFileRoute } from "@tanstack/react-router";
import { ANALOGY_NOTES, DE_PARA, LESSONS } from "@/data/servidoresweb.en";
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

export const Route = createFileRoute("/en/relatorios/servidores-web")({
  component: Index,
});

const NAV = [
  { id: "inicio", num: "00", title: "Start" },
  ...LESSONS.map((l) => ({ id: l.id, num: l.num, title: l.navTitle })),
];

const PROGRESS_KEY = "pitstop-progress-servidores-web-en";

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
            content from Lessons 01 through 05
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              live broadcast · <b>the Web Servers GP, stage by stage</b>
            </p>
            <h1 className="htitle">
              Web Servers narrated
              <br />
              live from the <span className="b">paddock</span>.
            </h1>
            <p className="narration">
              Good afternoon, everyone! The engine's already warm, and today there's only one fight:
              building the pit wall that keeps the driver clear of the chaos outside. Fourteen
              stages, from the purpose of a web server to load balancing, Ingress, Service Mesh,
              high availability, and edge protection. Lights out, the driver takes over.
            </p>
            <p className="lead">
              Every web server concept read the way a driver reads telemetry:{" "}
              <strong>the problem each piece solves</strong>, a technically honest F1 analogy, the
              config commented line by line, commands with the expected output, and a{" "}
              <strong>hands-on</strong> section per stage.
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
              headers={["Software concept", "Formula 1"]}
              mapping={DE_PARA.map((m) => ({ left: m.sw, right: m.f1 }))}
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
                <b>pitstop.dev</b> · Web Servers and Load Balancing guide, stage by stage, based on
                Lessons 01 through 05 of the module.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
