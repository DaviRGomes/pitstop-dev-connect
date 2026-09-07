// Índice de busca interno sobre os relatórios publicados (PT e EN).
// Carregado sob demanda (import dinâmico) só quando o usuário interage com a busca no SiteNav,
// pra não inflar o bundle inicial de páginas que não usam a busca.

export type Locale = "pt" | "en";

export type SearchDoc = {
  guideSlug: "kubernetes" | "kubernetes-avancado" | "servidores-web";
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
      "9 etapas da Fase 2: probes e recursos, agendamento fino, rollouts, Helm, Blue/Green, Canary, Karpenter, KEDA e segurança.",
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
];

const GUIDES_EN: GuideConfig[] = [
  {
    slug: "kubernetes",
    title: "Kubernetes explained with real examples",
    overview:
      "8 stages: the problem each piece solves, YAML commented line by line, and commands with the expected output.",
    overviewTag: "overview",
    loader: () => import("@/data/kubernetesbasico.en"),
  },
  {
    slug: "kubernetes-avancado",
    title: "Advanced Kubernetes: from health checks to security",
    overview:
      "9 stages from Phase 2: probes and resources, fine-grained scheduling, rollouts, Helm, Blue/Green, Canary, Karpenter, KEDA and security.",
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
];

function normalize(s: string) {
  return s.toLowerCase();
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
        snippet: truncate(l.lead, 140),
        text: normalize(body),
        url: `${url}#${l.id}`,
      });
    }
  });

  return docs;
}

const cache: Partial<Record<Locale, Promise<SearchDoc[]>>> = {};

export function getSearchIndex(locale: Locale): Promise<SearchDoc[]> {
  if (!cache[locale]) cache[locale] = buildIndex(locale);
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
