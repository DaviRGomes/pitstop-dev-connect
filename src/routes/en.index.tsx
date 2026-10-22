import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Cloud, Server, Wrench } from "lucide-react";
import { f1Logo } from "@/assets/brand/paths";
import { RaceHub } from "@/components/f1/RaceHub";
import { isGuideVisible } from "@/lib/drafts";
import { localizedHead } from "@/lib/seo";

export const Route = createFileRoute("/en/")({
  head: () =>
    localizedHead({
      locale: "en",
      title: "pitstop.dev | DevOps, Cloud and Backend at F1 pace",
      description:
        "Study reports on DevOps, Cloud and Backend explained through Formula 1 logic, from the garage to race day, with hands-on examples.",
      ptPath: "/",
      enPath: "/en",
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
    lead: "8 stages + 1 bonus: the problem each piece solves, YAML commented line by line, commands with expected output, and a final production example using a real Docker Hub image. Based on lessons 1–8 (Thiago Adriano, FIAP).",
    status: "published",
    laps: "9 laps",
  },
  {
    id: "kubernetes-avancado",
    to: "/en/relatorios/kubernetes-avancado",
    num: "R02",
    area: "DevOps · Advanced Cloud",
    title: "Advanced Kubernetes: from health checks to security",
    lead: "9 stages from Phase 2 + 1 bonus: probes and resources, fine-grained scheduling, rollouts, Helm, Blue/Green, Canary, Karpenter, KEDA, security, and a production capstone. Based on the DevOps and Cloud Architecture module (FIAP).",
    status: "published",
    laps: "10 laps",
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
  {
    id: "containers",
    to: "/en/relatorios/containers",
    num: "R04",
    area: "DevOps · Containers",
    title: "Containers and Docker: from image to production",
    lead: "13 stages: container fundamentals, images, Dockerfiles, networking, volumes, Docker Compose, security, best practices, and troubleshooting.",
    status: "published",
    laps: "13 laps",
  },
  {
    id: "escalabilidade",
    to: "/en/relatorios/escalabilidade",
    num: "R05",
    area: "DevOps · Scalability",
    title: "Server Scalability: six questions before the peak",
    lead: "6 questions: performance vs scale, load balancers, stateless apps, queues and workers, CDNs, database replicas, CAP, and observability, with trade-offs and local labs.",
    status: "published",
    laps: "6 laps",
  },
  {
    id: "cultura-devops",
    to: "/en/relatorios/cultura-devops",
    num: "R06",
    area: "DevOps · Culture",
    title: "DevOps Culture: from factory to track",
    lead: "4 stages: fundamentals, DORA metrics, IaC, CI/CD, canary, observability, organizational culture, and automation, with AWS and Azure side by side.",
    status: "published",
    laps: "4 laps",
  },
  {
    id: "arquitetura-aplicacoes",
    to: "/en/relatorios/arquitetura-aplicacoes",
    num: "R07",
    area: "Architecture · Applications",
    title: "Application Architecture: from monolith to microservices",
    lead: "4 stages: monolith and layers, microservices, database per service, sagas, Event Sourcing, gateways, and queues, with AWS and Azure side by side.",
    status: "published",
    laps: "4 laps",
  },
  {
    id: "arquitetura-cloud",
    to: "/en/relatorios/arquitetura-cloud",
    num: "R08",
    area: "Cloud · Architecture",
    title: "Cloud Architecture: from your own garage to the global circuit",
    lead: "6 stages: cloud computing, IaaS/PaaS/SaaS/FaaS, regions and zones, providers, VPC and VNet, security, costs, and FinOps, with AWS and Azure side by side.",
    status: "published",
    laps: "6 laps",
  },
  {
    id: "aws-azure",
    to: "/en/relatorios/aws-azure",
    num: "R09",
    area: "Cloud · AWS + Azure",
    title: "AWS and Azure side by side: from IAM to Route 53",
    lead: "11 stages: identity, networking, VMs, containers, databases, serverless, monitoring, CDN, secrets, DNS, and certifications, always on both providers.",
    status: "published",
    laps: "11 laps",
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
          <RaceHub locale="en" />
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
          {REPORTS.filter((r) => isGuideVisible(r.id)).map((r) => (
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
