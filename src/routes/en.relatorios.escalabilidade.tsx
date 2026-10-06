import { createFileRoute } from "@tanstack/react-router";
import { ANALOGY_NOTES, DE_PARA, LESSONS } from "@/data/escalabilidade.en";
import {
  DeParaDetails,
  GuideProgress,
  GuideRail,
  LessonSection,
} from "@/components/guide/GuideKit";
import { useGuideProgress, useScrollSpy, useSectionReveal } from "@/components/guide/hooks";
import { f1Logo } from "@/assets/brand/paths";
import { reportHead } from "@/lib/seo";

export const Route = createFileRoute("/en/relatorios/escalabilidade")({
  head: () =>
    reportHead({
      locale: "en",
      title: "Server Scalability: from pit box to peak load | pitstop.dev",
      description:
        "An immersive guide to scalability: vertical and horizontal scaling, load balancers, stateless apps, queues, CDNs, database replicas, CAP, and observability, with local labs.",
      ptPath: "/relatorios/escalabilidade",
      enPath: "/en/relatorios/escalabilidade",
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

const PROGRESS_KEY = "pitstop-progress-escalabilidade-en";

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
            content from Lessons 01 through 06
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              live broadcast · <b>the Scalability GP, sector by sector</b>
            </p>
            <h1 className="htitle">
              Server Scalability
              <br />
              live from the <span className="b">pit lane</span>.
            </h1>
            <p className="narration">
              Good afternoon, everyone! The Scalability GP is on air: a system that handles the peak
              without going down, from the first user to the millionth. Six sectors, one per lesson:
              fundamentals, load balancers, stateless and queues, CDN, databases, and the full
              architecture with the telemetry switched on. Lights out, the driver takes over.
            </p>
            <p className="lead">
              Every concept is read like the pit lane of a GP:{" "}
              <strong>the problem each piece solves</strong>, a technically honest F1 analogy,
              annotated configurations, commands with the expected output, and a{" "}
              <strong>hands-on</strong> section per stage that runs on your machine, no cloud
              account needed.
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
              headers={["Scalability", "Formula 1"]}
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
                <b>pitstop.dev</b> · Server Scalability guide, stage by stage, based on Lessons 01
                through 06 of the course.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
