import { notFound } from "@tanstack/react-router";

// Guias escondidos em produção (refatoração ou ainda não divulgados): somem da home, da busca,
// do sitemap e da URL direta, mas continuam abertos no `npm run dev` pra revisar.
// Tire o slug daqui para publicar.
export const DRAFT_GUIDES = new Set<string>([
  "servidores-web",
  "containers",
  "escalabilidade",
  "cultura-devops",
  "arquitetura-aplicacoes",
  "arquitetura-cloud",
  "aws-azure",
]);

export function isGuideVisible(slug: string) {
  return import.meta.env.DEV || !DRAFT_GUIDES.has(slug);
}

export function guardDraft(slug: string) {
  return () => {
    if (!isGuideVisible(slug)) throw notFound();
  };
}
