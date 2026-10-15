import { createFileRoute } from "@tanstack/react-router";
import { CHECKLIST, INTRO, LENS, LESSONS, NOTES } from "@/data/servidoresweb.en";
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

export const Route = createFileRoute("/en/relatorios/servidores-web")({
  head: () =>
    reportHead({
      locale: "en",
      title: "Web Servers and Load Balancing | pitstop.dev",
      description:
        "A web servers guide in 14 stages: HTTP, Apache, Nginx, proxies, load balancing, Ingress, TLS, Service Mesh, high availability and WAF, with a general Formula 1 lens.",
      ptPath: "/relatorios/servidores-web",
      enPath: "/en/relatorios/servidores-web",
    }),
  component: Index,
});

const NAV = [
  { id: "inicio", num: "00", title: "Start" },
  { id: "lente", num: "F1", title: "The F1 lens" },
  ...LESSONS.map((l) => ({ id: l.id, num: l.num, title: l.navTitle })),
  { id: "checklist", num: "15", title: "Checklist" },
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
  const [done, setDone] = useGuideProgress("pitstop-progress-servidores-web-en");
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
            content from lessons 1–5
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              study guide · <b>web servers in 14 stages</b>
            </p>
            <h1 className="htitle">
              Web servers
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
              title: "An F1 team seen from its front door",
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
            eyebrow="Stage 15 · review"
            title="Self-assessment checklist"
            groups={CHECKLIST}
            notesTitle="Teacher's notes: technical precisions"
            notes={NOTES}
          />

          <footer>
            <span className="foot-brand">
              <img src={f1Logo} alt="" width={38} height={19} />
              <span>
                <b>pitstop.dev</b> · Web Servers and Load Balancing guide, stage by stage, based on
                lessons 1–5 of the module.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
