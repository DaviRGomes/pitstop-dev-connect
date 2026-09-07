import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Flag } from "lucide-react";
import { ANALOGY_NOTES, DE_PARA, LESSONS, PLATFORMS } from "@/data/kubernetesbasico.en";
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

export const Route = createFileRoute("/en/relatorios/kubernetes")({
  component: Index,
});

function PlatformsSection() {
  return (
    <section className="section" id="pratica">
      <p className="eyebrow">
        Stage 09 <span className="tag">free labs</span>
      </p>
      <h2>Practice for free on real clusters</h2>
      <p className="narration">
        Cool-down lap: the engine cools off, but the championship keeps going, and every driver
        knows a season is built in practice. Here is the testing calendar.
      </p>
      <p className="lead">
        Think of this as any driver's ladder: public simulator, karting, F4, and only then the real
        car. These platforms give you a terminal with a real Kubernetes cluster right in the
        browser. Start with the 100% free ones.
      </p>
      <div className="grid g2">
        {PLATFORMS.map((p) => (
          <div className="panel plat-card" key={p.name}>
            <div className="plat-head">
              <h4>{p.name}</h4>
              <span className={`badge ${p.free ? "badge-free" : "badge-tier"}`}>{p.price}</span>
            </div>
            <p>{p.desc}</p>
            <p className="plat-good">
              <b>Good for:</b> {p.goodFor}
            </p>
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              {p.urlLabel} <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
      <div className="callout teal">
        <Flag className="co-ic" size={17} aria-hidden="true" />
        <p>
          <b>Suggested route:</b> at every stage of this guide, open <strong>Killercoda</strong> and
          repeat the commands in the matching scenario (Pods, Deployments, Volumes...). Finished all
          8 stages? Head to <strong>KodeKloud</strong> and take on troubleshooting challenges.
        </p>
      </div>
    </section>
  );
}

const NAV = [
  { id: "inicio", num: "00", title: "Start" },
  ...LESSONS.map((l) => ({ id: l.id, num: l.num, title: l.navTitle })),
  { id: "pratica", num: "09", title: "Practice for free" },
];

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
  const [done, setDone] = useGuideProgress("pitstop-progress-en");
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
            content from lessons 1–8
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              live broadcast · <b>the Kubernetes basics GP, stage by stage</b>
            </p>
            <h1 className="htitle">
              Kubernetes narrated
              <br />
              live from the <span className="b">paddock</span>.
            </h1>
            <p className="narration">
              Good afternoon, everyone! Eight stages, from lights out (why this sport exists) to the
              final straight of autoscaling, where the cluster starts driving itself. At stake:
              leaving here knowing how to build, run, heal and scale a real cluster. Lights are
              about to go out, and the driver takes the wheel of the narration. Over to you.
            </p>
            <p className="lead">
              Every Kubernetes concept read the way a driver reads telemetry:{" "}
              <strong>the problem each piece solves</strong>, a technically honest F1 analogy, YAML
              commented line by line, commands with the expected output, and a{" "}
              <strong>hands-on</strong> section per stage. At the end, the{" "}
              <strong>free platforms</strong> to practice on real clusters in your browser.
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

          <PlatformsSection />

          <footer>
            <span className="foot-brand">
              <img src={f1Logo} alt="" width={38} height={19} />
              <span>
                <b>pitstop.dev</b> · Kubernetes guide, stage by stage, based on lessons 1–8 (Thiago
                Adriano, FIAP).
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
