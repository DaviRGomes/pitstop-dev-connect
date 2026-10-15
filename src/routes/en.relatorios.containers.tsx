import { createFileRoute } from "@tanstack/react-router";
import { ANALOGY_NOTES, DE_PARA, LESSONS } from "@/data/containers.en";
import {
  DeParaDetails,
  GuideProgress,
  GuideRail,
  LessonSection,
} from "@/components/guide/GuideKit";
import { useGuideProgress, useScrollSpy, useSectionReveal } from "@/components/guide/hooks";
import { f1Logo } from "@/assets/brand/paths";
import { reportHead } from "@/lib/seo";

export const Route = createFileRoute("/en/relatorios/containers")({
  head: () =>
    reportHead({
      locale: "en",
      title: "Containers and Docker: from image to production | pitstop.dev",
      description:
        "An immersive guide to containers, images, Dockerfiles, networking, volumes, Docker Compose, security, and troubleshooting with hands-on examples.",
      ptPath: "/relatorios/containers",
      enPath: "/en/relatorios/containers",
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

const PROGRESS_KEY = "pitstop-progress-containers-en";

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
              study guide · <b>containers and Docker in 13 stages</b>
            </p>
            <h1 className="htitle">
              Containers and Docker
              <br />
              live from the <span className="b">paddock</span>.
            </h1>
            <p className="narration">
              This guide teaches containers and Docker in thirteen stages, from the idea to
              production. You study what a container isolates and how it differs from a virtual
              machine, how images are built with a Dockerfile and reuse cached layers, how to
              persist data with volumes, connect services through internal networks and DNS,
              orchestrate everything with Docker Compose, bring the image into CI, harden security,
              handle secrets, and troubleshoot problems. Through the F1 lens, the image is the car's
              build specification and the container is the car assembled from it: the same setup
              holds from the developer's machine to the production grid.
            </p>
            <p className="lead">
              Every concept is read the way a team prepares a car to race on any circuit:{" "}
              <strong>the problem each piece solves</strong>, a technically honest F1 analogy, files
              commented line by line, commands with the expected output, and a{" "}
              <strong>hands-on</strong> section per stage.
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
              headers={["Docker and containers", "Formula 1"]}
              mapping={DE_PARA.map((mapping) => ({
                left: mapping.docker,
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
                <b>pitstop.dev</b> · Containers and Docker guide, stage by stage, based on Lessons
                01 through 06 of the module.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
