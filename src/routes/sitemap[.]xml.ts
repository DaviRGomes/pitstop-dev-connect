import { createFileRoute } from "@tanstack/react-router";
import { isGuideVisible } from "@/lib/drafts";

const SITE_ORIGIN = "https://pitstop.dev.br";

// Um slug por guia em src/routes/relatorios.<slug>.tsx. Os rascunhos de
// src/lib/drafts.ts ficam fora em produção, como na home e na busca.
const GUIDE_SLUGS = [
  "kubernetes",
  "kubernetes-avancado",
  "servidores-web",
  "containers",
  "escalabilidade",
  "cultura-devops",
  "arquitetura-aplicacoes",
  "arquitetura-cloud",
  "aws-azure",
];

type Page = { pt: string; en: string };

function pages(): Page[] {
  return [
    { pt: "/", en: "/en/" },
    ...GUIDE_SLUGS.filter(isGuideVisible).map((slug) => ({
      pt: `/relatorios/${slug}`,
      en: `/en/relatorios/${slug}`,
    })),
  ];
}

// Cada URL entra uma vez, com as duas versões de idioma ligadas por hreflang.
function urlEntry(loc: string, page: Page) {
  return [
    "  <url>",
    `    <loc>${SITE_ORIGIN}${loc}</loc>`,
    `    <xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE_ORIGIN}${page.pt}"/>`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${SITE_ORIGIN}${page.en}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${page.pt}"/>`,
    "  </url>",
  ].join("\n");
}

function buildSitemap() {
  const entries = pages().flatMap((page) => [urlEntry(page.pt, page), urlEntry(page.en, page)]);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemap(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
