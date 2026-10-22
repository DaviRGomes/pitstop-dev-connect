import { notFound } from "@tanstack/react-router";

// Guias em refatoração: somem da home, da busca e da URL direta em produção,
// mas continuam abertos no `npm run dev` pra revisar. Tire o slug daqui ao republicar.
export const DRAFT_GUIDES = new Set<string>([
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
