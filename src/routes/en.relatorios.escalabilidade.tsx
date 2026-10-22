import { createFileRoute } from "@tanstack/react-router";
import { guardDraft } from "@/lib/drafts";
import { LESSONS, OBSERVABILITY_NODE, SYSTEM_MAP } from "@/data/escalabilidade.en";
import { GuideProgress, GuideRail } from "@/components/guide/GuideKit";
import { ScaleLessonSection, SystemMap, type ScaleCopy } from "@/components/guide/ScaleKit";
import { useGuideProgress, useScrollSpy, useSectionReveal } from "@/components/guide/hooks";
import { f1Logo } from "@/assets/brand/paths";
import { reportHead } from "@/lib/seo";

export const Route = createFileRoute("/en/relatorios/escalabilidade")({
  beforeLoad: guardDraft("escalabilidade"),
  head: () =>
    reportHead({
      locale: "en",
      title: "Server Scalability: six questions before the peak | pitstop.dev",
      description:
        "A scalability guide in six questions: vertical and horizontal scaling, load balancers, stateless apps, queues, CDNs, database replicas, CAP, and observability, with trade-offs and local labs.",
      ptPath: "/relatorios/escalabilidade",
      enPath: "/en/relatorios/escalabilidade",
    }),
  component: Index,
});

const NAV = [
  { id: "inicio", num: "00", title: "The map" },
  ...LESSONS.map((lesson) => ({
    id: lesson.id,
    num: lesson.num,
    title: lesson.navTitle,
  })),
];

const PROGRESS_KEY = "pitstop-progress-escalabilidade-en";

const READING_ORDER = ["Question", "Symptom", "Concept", "Analogy", "Gain × cost", "Lab"];

const LESSON_COPY: ScaleCopy = {
  question: "Question",
  symptom: "Symptom",
  pitScene: "In the pit box:",
  answer: "Short answer",
  howItWorks: "How it works",
  analogies: "In paddock terms",
  analogyLimit: "Where the analogy breaks:",
  tradeoffs: "Gain × cost",
  tradeoffHeaders: ["Option", "Gain", "Cost"],
  lab: "Lab",
  labCommands: "Commands",
  labSteps: "Steps",
  rule: "Rule of thumb:",
  pitRule: "On track:",
  selfCheck: "Quick check:",
  doneLabel: (num: string) => `question ${num} answered (click to undo)`,
  markDoneLabel: (num: string) => `mark question ${num} as answered`,
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
        ariaLabel="Questions"
        railFoot={
          <>
            technical guide · react
            <br />
            content from Lessons 01 through 06
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero sc-hero" id="inicio">
            <p className="kicker">
              technical guide · <b>6 questions, 6 local labs</b>
            </p>
            <h1 className="htitle">
              Scalability
              <br />
              <span className="b">before the peak.</span>
            </h1>
            <p className="lead">
              Scaling is not buying a bigger machine. It is deciding, piece by piece, where the load
              comes in, where state lives, what can wait, and what can be copied. This guide answers{" "}
              <strong>six questions</strong>, one per lesson, and each answer adds a piece to the
              map below. Each piece has an equivalent in an F1 pit box, and the analogy runs through
              every stage to anchor the concept, not to replace it. The labs run with Docker on your
              machine, no cloud account needed.
            </p>

            <p className="sc-map-title">The path of a request</p>
            <SystemMap
              nodes={SYSTEM_MAP}
              observability={OBSERVABILITY_NODE}
              done={done}
              stageLabel="question"
            />

            <ol className="sc-reading" aria-label="How each question is organized">
              {READING_ORDER.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <GuideProgress
              doneCount={doneCount}
              total={LESSONS.length}
              label="QUESTIONS ANSWERED"
            />
          </header>

          {LESSONS.map((lesson) => (
            <ScaleLessonSection
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
                <b>pitstop.dev</b> · Server Scalability guide, in six questions, based on Lessons 01
                through 06 of the course.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
