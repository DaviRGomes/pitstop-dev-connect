// Índice de busca interno sobre os relatórios publicados (PT e EN).
// Carregado sob demanda (import dinâmico) só quando o usuário interage com a busca no SiteNav,
// pra não inflar o bundle inicial de páginas que não usam a busca.

export type Locale = "pt" | "en";

export type SearchDoc = {
  guideSlug:
    | "kubernetes"
    | "kubernetes-avancado"
    | "servidores-web"
    | "containers"
    | "escalabilidade"
    | "cultura-devops"
    | "arquitetura-aplicacoes"
    | "arquitetura-cloud"
    | "aws-azure";
  guideTitle: string;
  hash: string;
  num: string;
  title: string;
  tag: string;
  snippet: string;
  text: string;
  url: string;
};

type LessonLike = {
  id: string;
  num: string;
  title: string;
  tag: string;
  lead: string;
  concept: string[];
  pointsTitle: string;
  points: { t: string; d: string }[];
  takeaway: string;
  tip: string;
};

// O guia de Escalabilidade tem formato próprio (pergunta, sintoma, analogias, trade-offs);
// aqui ele é traduzido para a forma que o índice já entende.
type ScaleLessonLike = Omit<LessonLike, "lead" | "pointsTitle" | "points" | "takeaway" | "tip"> & {
  question: string;
  symptom: string;
  pitScene: string;
  answer: string;
  analogies: { term: string; f1: string }[];
  tradeoffs: { option: string; gain: string; cost: string }[];
  rule: string;
};

function fromScaleLessons(mod: { LESSONS: ScaleLessonLike[] }): { LESSONS: LessonLike[] } {
  return {
    LESSONS: mod.LESSONS.map((l) => ({
      id: l.id,
      num: l.num,
      title: l.title,
      tag: l.tag,
      lead: `${l.question} ${l.answer}`,
      concept: [...l.concept, l.pitScene, ...l.analogies.map((a) => `${a.term}: ${a.f1}`)],
      pointsTitle: l.symptom,
      points: l.tradeoffs.map((t) => ({ t: t.option, d: `${t.gain} ${t.cost}` })),
      takeaway: l.rule,
      tip: "",
    })),
  };
}

type GuideConfig = {
  slug: SearchDoc["guideSlug"];
  title: string;
  overview: string;
  overviewTag: string;
  loader: () => Promise<{ LESSONS: LessonLike[] }>;
};

const GUIDES_PT: GuideConfig[] = [
  {
    slug: "kubernetes",
    title: "Kubernetes explicado com exemplos reais",
    overview:
      "8 etapas + 1 bônus: o problema que cada peça resolve, YAML comentado linha a linha, comandos com a saída esperada e um exemplo profissional final com imagem real do Docker Hub.",
    overviewTag: "visão geral",
    loader: () => import("@/data/kubernetesbasico"),
  },
  {
    slug: "kubernetes-avancado",
    title: "Kubernetes avançado: da saúde à segurança",
    overview:
      "9 etapas da Fase 2 + 1 bônus: probes e recursos, agendamento fino, rollouts, Helm, Blue/Green, Canary, Karpenter, KEDA, segurança e um capstone de produção.",
    overviewTag: "visão geral",
    loader: () => import("@/data/kubernetesavancado"),
  },
  {
    slug: "servidores-web",
    title: "Servidores Web e Balanceamento de Carga",
    overview:
      "14 etapas: servidores web, HTTP, Apache e Nginx, balanceamento de carga, Ingress, TLS com cert-manager, Service Mesh com Istio, observabilidade, alta disponibilidade e segurança de borda.",
    overviewTag: "visão geral",
    loader: () => import("@/data/servidoresweb"),
  },
  {
    slug: "containers",
    title: "Containers e Docker: da imagem à produção",
    overview:
      "13 etapas: fundamentos de containers, imagens, Dockerfile, redes, volumes, Docker Compose, segurança, boas práticas e diagnóstico.",
    overviewTag: "visão geral",
    loader: () => import("@/data/containers"),
  },
  {
    slug: "escalabilidade",
    title: "Escalabilidade nos servidores: seis perguntas antes do pico",
    overview:
      "6 perguntas: desempenho x escala, load balancers, aplicações stateless, filas e workers, CDN, réplicas de banco, CAP e observabilidade, com trade-offs e laboratórios.",
    overviewTag: "visão geral",
    loader: () => import("@/data/escalabilidade").then(fromScaleLessons),
  },
  {
    slug: "cultura-devops",
    title: "Cultura DevOps: da fábrica à pista",
    overview:
      "4 etapas: fundamentos, métricas DORA, IaC, CI/CD, canary, observabilidade, cultura organizacional e automação, com AWS e Azure lado a lado.",
    overviewTag: "visão geral",
    loader: () => import("@/data/culturadevops"),
  },
  {
    slug: "arquitetura-aplicacoes",
    title: "Arquitetura de aplicações: do monolito aos microsserviços",
    overview:
      "4 etapas: monolito e camadas, microsserviços, banco por serviço, sagas, Event Sourcing, gateway e filas, com AWS e Azure lado a lado.",
    overviewTag: "visão geral",
    loader: () => import("@/data/arquiteturaaplicacoes"),
  },
  {
    slug: "arquitetura-cloud",
    title: "Arquitetura Cloud: da garagem própria ao circuito global",
    overview:
      "6 etapas: computação em nuvem, IaaS/PaaS/SaaS/FaaS, regiões e zonas, provedores, VPC e VNet, segurança, custos e FinOps, com AWS e Azure lado a lado.",
    overviewTag: "visão geral",
    loader: () => import("@/data/arquiteturacloud"),
  },
  {
    slug: "aws-azure",
    title: "AWS e Azure lado a lado: do IAM ao Route 53",
    overview:
      "11 etapas: identidade, redes, VMs, containers, bancos, serverless, monitoramento, CDN, segredos, DNS e certificações, sempre nos dois provedores.",
    overviewTag: "visão geral",
    loader: () => import("@/data/awsazure"),
  },
];

const GUIDES_EN: GuideConfig[] = [
  {
    slug: "kubernetes",
    title: "Kubernetes explained with real examples",
    overview:
      "8 stages + 1 bonus: the problem each piece solves, annotated YAML, commands with expected output, and a final production example using a real Docker Hub image.",
    overviewTag: "overview",
    loader: () => import("@/data/kubernetesbasico.en"),
  },
  {
    slug: "kubernetes-avancado",
    title: "Advanced Kubernetes: from health checks to security",
    overview:
      "9 stages from Phase 2 + 1 bonus: probes and resources, fine-grained scheduling, rollouts, Helm, Blue/Green, Canary, Karpenter, KEDA, security, and a production capstone.",
    overviewTag: "overview",
    loader: () => import("@/data/kubernetesavancado.en"),
  },
  {
    slug: "servidores-web",
    title: "Web Servers and Load Balancing",
    overview:
      "14 stages: web servers, HTTP, Apache and Nginx, load balancing, Ingress, TLS with cert-manager, Service Mesh with Istio, observability, high availability, and edge security.",
    overviewTag: "overview",
    loader: () => import("@/data/servidoresweb.en"),
  },
  {
    slug: "containers",
    title: "Containers and Docker: from image to production",
    overview:
      "13 stages: container fundamentals, images, Dockerfiles, networking, volumes, Docker Compose, security, best practices, and troubleshooting.",
    overviewTag: "overview",
    loader: () => import("@/data/containers.en"),
  },
  {
    slug: "escalabilidade",
    title: "Server Scalability: six questions before the peak",
    overview:
      "6 questions: performance vs scale, load balancers, stateless apps, queues and workers, CDNs, database replicas, CAP, and observability, with trade-offs and labs.",
    overviewTag: "overview",
    loader: () => import("@/data/escalabilidade.en").then(fromScaleLessons),
  },
  {
    slug: "cultura-devops",
    title: "DevOps Culture: from factory to track",
    overview:
      "4 stages: fundamentals, DORA metrics, IaC, CI/CD, canary, observability, organizational culture, and automation, with AWS and Azure side by side.",
    overviewTag: "overview",
    loader: () => import("@/data/culturadevops.en"),
  },
  {
    slug: "arquitetura-aplicacoes",
    title: "Application Architecture: from monolith to microservices",
    overview:
      "4 stages: monolith and layers, microservices, database per service, sagas, Event Sourcing, gateways, and queues, with AWS and Azure side by side.",
    overviewTag: "overview",
    loader: () => import("@/data/arquiteturaaplicacoes.en"),
  },
  {
    slug: "arquitetura-cloud",
    title: "Cloud Architecture: from your own garage to the global circuit",
    overview:
      "6 stages: cloud computing, IaaS/PaaS/SaaS/FaaS, regions and zones, providers, VPC and VNet, security, costs, and FinOps, with AWS and Azure side by side.",
    overviewTag: "overview",
    loader: () => import("@/data/arquiteturacloud.en"),
  },
  {
    slug: "aws-azure",
    title: "AWS and Azure side by side: from IAM to Route 53",
    overview:
      "11 stages: identity, networking, VMs, containers, databases, serverless, monitoring, CDN, secrets, DNS, and certifications, always on both providers.",
    overviewTag: "overview",
    loader: () => import("@/data/awsazure.en"),
  },
];

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .trim();
}

// Alguns guias guardam markdown inline (`código`, **negrito**) no texto das etapas.
function plain(s: string) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ");
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n).trimEnd()}…` : s;
}

async function buildIndex(locale: Locale): Promise<SearchDoc[]> {
  const guides = locale === "pt" ? GUIDES_PT : GUIDES_EN;
  const base = locale === "pt" ? "" : "/en";
  const modules = await Promise.all(guides.map((g) => g.loader()));

  const docs: SearchDoc[] = [];

  guides.forEach((g, i) => {
    const url = `${base}/relatorios/${g.slug}`;

    docs.push({
      guideSlug: g.slug,
      guideTitle: g.title,
      hash: "inicio",
      num: "00",
      title: g.title,
      tag: g.overviewTag,
      snippet: g.overview,
      text: normalize(`${g.title} ${g.overview}`),
      url: `${url}#inicio`,
    });

    for (const l of modules[i].LESSONS) {
      const body = [
        l.title,
        l.tag,
        l.lead,
        ...(l.concept ?? []),
        l.pointsTitle,
        ...(l.points ?? []).flatMap((p) => [p.t, p.d]),
        l.takeaway,
        l.tip,
      ].join(" ");

      docs.push({
        guideSlug: g.slug,
        guideTitle: g.title,
        hash: l.id,
        num: l.num,
        title: l.title,
        tag: l.tag,
        snippet: truncate(plain(l.lead), 140),
        text: normalize(plain(body)),
        url: `${url}#${l.id}`,
      });
    }
  });

  return docs;
}

const cache: Partial<Record<Locale, Promise<SearchDoc[]>>> = {};

export function getSearchIndex(locale: Locale): Promise<SearchDoc[]> {
  if (!cache[locale]) {
    cache[locale] = buildIndex(locale).catch((error: unknown) => {
      // Permite uma nova tentativa após falha transitória ao baixar um chunk.
      delete cache[locale];
      throw error;
    });
  }
  return cache[locale]!;
}

export function searchDocs(index: SearchDoc[], query: string, limit = 8): SearchDoc[] {
  const q = normalize(query.trim());
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);

  const scored = index
    .map((doc) => {
      const title = normalize(doc.title);
      const tag = normalize(doc.tag);
      let score = 0;
      if (title.includes(q)) score += 20;
      for (const w of words) {
        if (title.includes(w)) score += 6;
        if (tag.includes(w)) score += 3;
        if (doc.text.includes(w)) score += 1;
      }
      return { doc, score };
    })
    .filter((s) => s.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.doc);
}
