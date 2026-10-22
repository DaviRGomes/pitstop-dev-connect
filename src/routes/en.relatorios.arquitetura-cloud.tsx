import { createFileRoute } from "@tanstack/react-router";
import { guardDraft } from "@/lib/drafts";
import { ANALOGY_NOTES, DE_PARA, LESSONS } from "@/data/arquiteturacloud.en";
import {
  DeParaDetails,
  GuideProgress,
  GuideRail,
  LessonSection,
} from "@/components/guide/GuideKit";
import { useGuideProgress, useScrollSpy, useSectionReveal } from "@/components/guide/hooks";
import { f1Logo } from "@/assets/brand/paths";
import { reportHead } from "@/lib/seo";

export const Route = createFileRoute("/en/relatorios/arquitetura-cloud")({
  beforeLoad: guardDraft("arquitetura-cloud"),
  head: () =>
    reportHead({
      locale: "en",
      title: "Cloud Architecture: from your own garage to the global circuit | pitstop.dev",
      description:
        "An immersive cloud architecture guide: service models, regions and zones, providers, VPC and VNet, security, costs, and FinOps, with AWS and Azure side by side.",
      ptPath: "/relatorios/arquitetura-cloud",
      enPath: "/en/relatorios/arquitetura-cloud",
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

const PROGRESS_KEY = "pitstop-progress-arquitetura-cloud-en";

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
              study guide · <b>cloud architecture in 6 stages</b>
            </p>
            <h1 className="htitle">
              Cloud Architecture
              <br />
              live from the <span className="b">pit lane</span>.
            </h1>
            <p className="narration">
              This guide presents, in six stages, the foundations for designing in the cloud. You
              study what cloud computing is and its deployment models, the service models (IaaS,
              PaaS, SaaS, and FaaS), regions and availability zones, how to compare providers, the
              architecture elements (storage, databases, load balancers, CDN, and networking), and
              finally security and costs, always with AWS and Azure side by side. Through the F1
              lens, the provider is the circuit that offers the garage, power, and timing; the team
              picks what to use, sets up its reserved area, and operates without breaking the cost
              cap.
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
              headers={["Cloud", "Formula 1"]}
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
                <b>pitstop.dev</b> · Cloud Architecture guide, stage by stage, based on Lessons 01
                through 06 of the module (Phase 1).
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
