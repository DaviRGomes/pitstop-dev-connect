import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Cloud, Server, Wrench } from "lucide-react";
import { f1Logo } from "@/assets/brand/paths";
import { RaceHub } from "@/components/f1/RaceHub";

export const Route = createFileRoute("/en/")({
  head: () => ({
    meta: [
      { title: "pitstop.dev | DevOps, Cloud and Backend at F1 pace" },
      {
        name: "description",
        content:
          "Study reports on DevOps, Cloud and Backend explained through Formula 1 logic, from the garage to race day, with hands-on examples.",
      },
      { property: "og:title", content: "pitstop.dev | Learning at F1 pace" },
      {
        property: "og:description",
        content:
          "Learn DevOps, Cloud and Backend through Formula 1 metaphors. Open reports, commented line by line.",
      },
    ],
  }),
  component: Home,
});

const CATEGORIES = [
  {
    icon: Wrench,
    tag: "garage · pit crew",
    title: "DevOps",
    desc: "Pipelines, orchestration, observability. The crew that changes tires in 2s: automation that carries the whole race.",
  },
  {
    icon: Cloud,
    tag: "aerodynamics",
    title: "Cloud",
    desc: "AWS, GCP, edge. The aerodynamics that decide whether the car flies straight or snaps in the corner: scale, cost and latency under control.",
  },
  {
    icon: Server,
    tag: "engine · powertrain",
    title: "Backend",
    desc: "APIs, databases, queues, architecture. The hybrid V6: what makes the product move, and what breaks when pushed too hard.",
  },
];

const REPORTS = [
  {
    id: "kubernetes",
    to: "/en/relatorios/kubernetes",
    num: "R01",
    area: "DevOps · Orchestration",
    title: "Kubernetes explained with real examples",
    lead: "8 stages: the problem each piece solves, YAML commented line by line, and commands with the expected output. Based on lessons 1–8 (Thiago Adriano, FIAP).",
    status: "published",
    laps: "8 laps",
  },
  {
    id: "kubernetes-avancado",
    to: "/en/relatorios/kubernetes-avancado",
    num: "R02",
    area: "DevOps · Advanced Cloud",
    title: "Advanced Kubernetes: from health checks to security",
    lead: "9 stages from Phase 2: probes and resources, fine-grained scheduling, rollouts, Helm, Blue/Green, Canary, Karpenter, KEDA and security. Based on the DevOps and Cloud Architecture module (FIAP).",
    status: "published",
    laps: "9 laps",
  },
  {
    id: "servidores-web",
    to: "/en/relatorios/servidores-web",
    num: "R03",
    area: "DevOps · Web Servers",
    title: "Web Servers and Load Balancing",
    lead: "14 stages: web servers, HTTP, Apache and Nginx, load balancing, Ingress, TLS, Istio, observability, high availability, and edge protection.",
    status: "published",
    laps: "14 laps",
  },
];

function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="kicker">
            study studio · <b>devops · cloud · backend</b>
          </p>
          <h1 className="home-title">
            Software engineering
            <br />
            at <span className="b">Formula 1 pace</span>
          </h1>
          <p className="lead">
            <strong>pitstop.dev</strong> is an open space to study
            <strong> DevOps, Cloud and Backend</strong> in a different way: swapping generic slides
            for F1 metaphors (the garage, aerodynamics, the powertrain) and examples that actually
            run.
          </p>
          <p className="lead">
            Every topic becomes a <strong>race report</strong>: the question it answers, the concept
            from the inside out, commented code, and commands with the expected output. No filler,
            from the grid to the checkered flag.
          </p>
          <div className="home-cta">
            <a href="#relatorios" className="btn-primary">
              see reports <ArrowRight size={16} />
            </a>
            <a href="#sobre" className="btn-ghost">
              how it works
            </a>
          </div>
        </div>
        <div className="home-hero-art">
          <RaceHub />
        </div>
      </section>

      <section className="home-section" id="sobre">
        <p className="eyebrow">about · briefing</p>
        <h2>Why Formula 1?</h2>
        <p className="lead">
          F1 is the sport where <strong>engineering, data and execution</strong> meet under extreme
          pressure. It is the same logic as a modern stack: telemetry (observability), tire strategy
          (deployment), pit stop (release), aerodynamics (architecture). The metaphor sticks, and it
          helps you remember.
        </p>
      </section>

      <section className="home-section" id="areas">
        <p className="eyebrow">areas · sectors of the track</p>
        <h2>Three sectors, one lap.</h2>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <article key={c.title} className="cat-card">
              <div className="cat-ic">
                <c.icon size={20} aria-hidden="true" />
              </div>
              <p className="cat-tag">{c.tag}</p>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" id="relatorios">
        <p className="eyebrow">reports · race reports</p>
        <h2>Published studies</h2>
        <p className="lead">
          Each report is a complete study on one topic: open it, read it, practice it. New ones land
          with the next Grand Prix.
        </p>
        <div className="report-grid">
          {REPORTS.map((r) => (
            <Link key={r.id} to={r.to} className="report-card">
              <div className="report-head">
                <span className="report-num">{r.num}</span>
                <span
                  className={`report-status s-${r.status === "published" ? "publicado" : r.status}`}
                >
                  {r.status}
                </span>
              </div>
              <p className="report-area">{r.area}</p>
              <h3>{r.title}</h3>
              <p className="report-lead">{r.lead}</p>
              <div className="report-foot">
                <span>{r.laps}</span>
                <span className="report-go">
                  open report <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
          <div className="report-card report-card--empty">
            <div className="report-head">
              <span className="report-num">R04</span>
              <span className="report-status s-em-breve">coming soon</span>
            </div>
            <p className="report-area">Cloud · AWS</p>
            <h3>AWS fundamentals for backend engineers</h3>
            <p className="report-lead">
              VPC, IAM, EC2, S3, RDS. What each piece does and how they connect in a minimal
              production architecture.
            </p>
            <div className="report-foot">
              <span>TBD</span>
              <span className="report-go muted">awaiting lights out</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-foot">
        <span className="foot-brand">
          <img src={f1Logo} alt="" width={38} height={19} />
          <span>
            <b>pitstop.dev</b> · studies at F1 pace · devops · cloud · backend
          </span>
        </span>
      </footer>
    </div>
  );
}
