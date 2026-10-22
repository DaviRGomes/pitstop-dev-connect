import { createFileRoute } from "@tanstack/react-router";
import { guardDraft } from "@/lib/drafts";
import { ANALOGY_NOTES, DE_PARA, LESSONS } from "@/data/arquiteturaaplicacoes.en";
import {
  DeParaDetails,
  GuideProgress,
  GuideRail,
  LessonSection,
} from "@/components/guide/GuideKit";
import { useGuideProgress, useScrollSpy, useSectionReveal } from "@/components/guide/hooks";
import { f1Logo } from "@/assets/brand/paths";
import { reportHead } from "@/lib/seo";

export const Route = createFileRoute("/en/relatorios/arquitetura-aplicacoes")({
  beforeLoad: guardDraft("arquitetura-aplicacoes"),
  head: () =>
    reportHead({
      locale: "en",
      title: "Application Architecture: from monolith to microservices | pitstop.dev",
      description:
        "An immersive application architecture guide: monoliths, layers, microservices, database per service, sagas, Event Sourcing, gateways, and queues, with AWS and Azure side by side.",
      ptPath: "/relatorios/arquitetura-aplicacoes",
      enPath: "/en/relatorios/arquitetura-aplicacoes",
    }),
  component: Index,
});

const NAV = [
  { id: "inicio", num: "00", title: "Start" },
  ...LESSONS.map((lesson) => ({
    id: lesson.id,
    num: lesson.num,
    title: lesson.navTitle,
  })),
];

const PROGRESS_KEY = "pitstop-progress-arquitetura-aplicacoes-en";

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
  const activeId = useScrollSpy(NAV.map((item) => item.id));

  const doneCount = LESSONS.filter((lesson) => done[lesson.id]).length;

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
            content from Lessons 01 through 04
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              study guide · <b>application architecture in 4 stages</b>
            </p>
            <h1 className="htitle">
              Application Architecture
              <br />
              live from the <span className="b">pit lane</span>.
            </h1>
            <p className="narration">
              This guide shows, in four stages, how to organize an application as it grows. You
              study the monolith and layered architecture, when and where to split the system into
              microservices, how each service takes ownership of its own data (with eventual
              consistency and sagas), and how services talk, through synchronous calls, an API
              Gateway, or a queue, always with AWS and Azure side by side. Through the F1 lens, it
              is the move from a garage where the same mechanics do everything to specialized
              stations (tyres, strategy, power unit), each owning its job and talking to the others
              through an agreed channel.
            </p>
            <p className="lead">
              Every concept is read like the pit lane of a GP:{" "}
              <strong>the problem each piece solves</strong>, a technically honest F1 analogy,{" "}
              <strong>AWS and Azure side by side</strong>, commands with the expected output, and a{" "}
              <strong>hands-on</strong> section per stage, with a cost warning whenever something is
              created in the cloud.
            </p>
            <DeParaDetails
              summaryLabel="The cheat sheet: pin this to your visor"
              intro={
                <>
                  The same analogy holds from the first stage to the last.{" "}
                  <b>Don't try to memorize this table now.</b> It is the track map, not the exam: go
                  straight to Stage 01 and come back here whenever an analogy shows up in the text.
                </>
              }
              headers={["Architecture", "Formula 1"]}
              mapping={DE_PARA.map((mapping) => ({
                left: mapping.tema,
                right: mapping.f1,
              }))}
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
                <b>pitstop.dev</b> · Application Architecture guide, stage by stage, based on
                Lessons 01 through 04 of the module (Phase 1).
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
