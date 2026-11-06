import { createFileRoute } from "@tanstack/react-router";
import { guardDraft } from "@/lib/drafts";
import { CHECKLIST, INTRO, LENS, LESSONS, NOTES } from "@/data/escalabilidade.en";
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

export const Route = createFileRoute("/en/relatorios/escalabilidade")({
  beforeLoad: guardDraft("escalabilidade"),
  head: () =>
    reportHead({
      locale: "en",
      title: "Server scalability: from the first server to the peak | pitstop.dev",
      description:
        "A scalability guide in 6 stages: performance vs scale, load balancers, stateless apps, queues and workers, CDNs, database replicas, CAP and observability, with local labs and a general Formula 1 lens.",
      ptPath: "/relatorios/escalabilidade",
      enPath: "/en/relatorios/escalabilidade",
    }),
  component: Index,
});

const NAV = [
  { id: "inicio", num: "00", title: "Start" },
  { id: "lente", num: "F1", title: "The F1 lens" },
  ...LESSONS.map((l) => ({ id: l.id, num: l.num, title: l.navTitle })),
  { id: "checklist", num: "07", title: "Checklist" },
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
  const [done, setDone] = useGuideProgress("pitstop-progress-escalabilidade-en");
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
            content from the 6 lessons
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              study guide · <b>scalability in 6 stages</b>
            </p>
            <h1 className="htitle">
              Server scalability
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
              title: "The operations room that handles the peak",
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
            eyebrow="Stage 07 · review"
            title="Self-assessment checklist"
            groups={CHECKLIST}
            notesTitle="Teacher's notes: technical precisions"
            notes={NOTES}
          />

          <footer>
            <span className="foot-brand">
              <img src={f1Logo} alt="" width={38} height={19} />
              <span>
                <b>pitstop.dev</b> · Server scalability guide, stage by stage, based on the 6
                lessons of the course.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
