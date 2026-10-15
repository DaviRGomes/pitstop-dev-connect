import { createFileRoute } from "@tanstack/react-router";
import { ANALOGY_NOTES, DE_PARA, LESSONS } from "@/data/awsazure.en";
import {
  DeParaDetails,
  GuideProgress,
  GuideRail,
  LessonSection,
} from "@/components/guide/GuideKit";
import { useGuideProgress, useScrollSpy, useSectionReveal } from "@/components/guide/hooks";
import { f1Logo } from "@/assets/brand/paths";
import { reportHead } from "@/lib/seo";

export const Route = createFileRoute("/en/relatorios/aws-azure")({
  head: () =>
    reportHead({
      locale: "en",
      title: "AWS and Azure side by side: from IAM to Route 53 | pitstop.dev",
      description:
        "An immersive AWS and Azure side-by-side guide: IAM and Entra ID, VPC and VNet, VMs, containers, databases, serverless, monitoring, CDN, secrets, DNS, and certifications.",
      ptPath: "/relatorios/aws-azure",
      enPath: "/en/relatorios/aws-azure",
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

const PROGRESS_KEY = "pitstop-progress-aws-azure-en";

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
            content from Lessons 01 through 11
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              study guide · <b>AWS and Azure in 11 stages</b>
            </p>
            <h1 className="htitle">
              AWS and Azure
              <br />
              live from the <span className="b">pit lane</span>.
            </h1>
            <p className="narration">
              This guide walks through, in eleven stages, the essential services of the two largest
              clouds, always side by side. You start with an introduction to the cloud and study
              identity and access, networking, virtual machines, containers, databases, serverless,
              monitoring and logs, content delivery and object storage, secrets, WAF, and DNS,
              finishing with the certification path. Through the F1 lens, AWS and Azure are two
              circuits with their own facilities: the team's procedure is the same on both, and what
              changes is the name of each facility.
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
              headers={["AWS + Azure", "Formula 1"]}
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
                <b>pitstop.dev</b> · AWS and Azure guide, stage by stage, based on Lessons 01
                through 11 of the module (Phase 1).
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
