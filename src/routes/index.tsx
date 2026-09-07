import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Cloud, Server, Wrench } from "lucide-react";
import { f1Logo } from "@/assets/brand/paths";
import { RaceHub } from "@/components/f1/RaceHub";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "pitstop.dev | DevOps, Cloud e Backend em ritmo de F1" },
      {
        name: "description",
        content:
          "Relatórios de estudo sobre DevOps, Cloud e Backend explicados com a lógica da Fórmula 1, do box à corrida, com exemplos práticos.",
      },
      { property: "og:title", content: "pitstop.dev | Estudos em ritmo de F1" },
      {
        property: "og:description",
        content:
          "Aprenda DevOps, Cloud e Backend com metáforas de Fórmula 1. Relatórios abertos, comentados linha a linha.",
      },
    ],
  }),
  component: Home,
});

const CATEGORIES = [
  {
    icon: Wrench,
    tag: "box · pit crew",
    title: "DevOps",
    desc: "Pipelines, orquestração, observabilidade. O box que troca os pneus em 2s: automação que segura a corrida inteira.",
  },
  {
    icon: Cloud,
    tag: "aerodinâmica",
    title: "Cloud",
    desc: "AWS, GCP, edge. A aerodinâmica que decide se o carro passa reto ou trava na curva: escala, custo e latência sob controle.",
  },
  {
    icon: Server,
    tag: "motor · powertrain",
    title: "Backend",
    desc: "APIs, bancos, filas, arquitetura. O motor V6 híbrido: o que faz o produto andar, e o que quebra quando forçado demais.",
  },
];

const REPORTS = [
  {
    id: "kubernetes",
    to: "/relatorios/kubernetes",
    num: "R01",
    area: "DevOps · Orquestração",
    title: "Kubernetes explicado com exemplos reais",
    lead: "8 etapas + 1 bônus: o problema que cada peça resolve, YAML comentado linha a linha, comandos com a saída esperada e um exemplo profissional final com imagem real do Docker Hub. Baseado nas aulas 1–8 (Thiago Adriano, FIAP).",
    status: "publicado",
    laps: "9 voltas",
  },
  {
    id: "kubernetes-avancado",
    to: "/relatorios/kubernetes-avancado",
    num: "R02",
    area: "DevOps · Cloud Avançado",
    title: "Kubernetes avançado: da saúde à segurança",
    lead: "9 etapas da Fase 2: probes e recursos, agendamento fino, rollouts, Helm, Blue/Green, Canary, Karpenter, KEDA e segurança. Baseado no módulo DevOps e Arquitetura Cloud (FIAP).",
    status: "publicado",
    laps: "9 voltas",
  },
  {
    id: "servidores-web",
    to: "/relatorios/servidores-web",
    num: "R03",
    area: "DevOps · Servidores Web",
    title: "Servidores Web e Balanceamento de Carga",
    lead: "14 etapas: servidores web, HTTP, Apache e Nginx, balanceamento, Ingress, TLS, Istio, observabilidade, alta disponibilidade e defesa da borda.",
    status: "publicado",
    laps: "14 voltas",
  },
];

function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="kicker">
            estúdio de estudos · <b>devops · cloud · backend</b>
          </p>
          <h1 className="home-title">
            Engenharia de software
            <br />
            em <span className="b">ritmo de Fórmula 1</span>
          </h1>
          <p className="lead">
            O <strong>pitstop.dev</strong> é um espaço aberto pra estudar
            <strong> DevOps, Cloud e Backend</strong> de um jeito diferente: trocando slides
            genéricos por metáforas de F1 (box, aerodinâmica, powertrain) e exemplos que rodam de
            verdade.
          </p>
          <p className="lead">
            Cada tema vira um <strong>relatório de corrida</strong>: pergunta que ele responde,
            conceito por dentro, código comentado e comandos com saída esperada. Sem enrolação, do
            grid até a bandeirada.
          </p>
          <div className="home-cta">
            <a href="#relatorios" className="btn-primary">
              ver relatórios <ArrowRight size={16} />
            </a>
            <a href="#sobre" className="btn-ghost">
              como funciona
            </a>
          </div>
        </div>
        <div className="home-hero-art">
          <RaceHub />
        </div>
      </section>

      <section className="home-section" id="sobre">
        <p className="eyebrow">sobre · briefing</p>
        <h2>Por que Fórmula 1?</h2>
        <p className="lead">
          F1 é o esporte onde <strong>engenharia, dados e execução</strong> se encontram sob pressão
          extrema. É a mesma lógica de uma stack moderna: telemetria (observabilidade), estratégia
          de pneu (deploy), pit stop (release), aerodinâmica (arquitetura). A metáfora prende e
          ajuda a lembrar.
        </p>
      </section>

      <section className="home-section" id="areas">
        <p className="eyebrow">áreas · setores da pista</p>
        <h2>Três setores, uma volta só.</h2>
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
        <p className="eyebrow">relatórios · race reports</p>
        <h2>Estudos publicados</h2>
        <p className="lead">
          Cada relatório é um estudo completo sobre um tema: abre, lê, pratica. Novos entram
          conforme o próximo GP.
        </p>
        <div className="report-grid">
          {REPORTS.map((r) => (
            <Link key={r.id} to={r.to} className="report-card">
              <div className="report-head">
                <span className="report-num">{r.num}</span>
                <span className={`report-status s-${r.status}`}>{r.status}</span>
              </div>
              <p className="report-area">{r.area}</p>
              <h3>{r.title}</h3>
              <p className="report-lead">{r.lead}</p>
              <div className="report-foot">
                <span>{r.laps}</span>
                <span className="report-go">
                  abrir relatório <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
          <div className="report-card report-card--empty">
            <div className="report-head">
              <span className="report-num">R04</span>
              <span className="report-status s-em-breve">em breve</span>
            </div>
            <p className="report-area">Cloud · AWS</p>
            <h3>Fundamentos de AWS pra quem vem do backend</h3>
            <p className="report-lead">
              VPC, IAM, EC2, S3, RDS. O que cada peça faz e como elas se conectam numa arquitetura
              mínima de produção.
            </p>
            <div className="report-foot">
              <span>a definir</span>
              <span className="report-go muted">aguardando largada</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-foot">
        <span className="foot-brand">
          <img src={f1Logo} alt="" width={38} height={19} />
          <span>
            <b>pitstop.dev</b> · estudos em ritmo de F1 · devops · cloud · backend
          </span>
        </span>
      </footer>
    </div>
  );
}
