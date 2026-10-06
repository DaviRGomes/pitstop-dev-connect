const SITE_ORIGIN = "https://pitstop.dev.br";

type LocalizedHeadOptions = {
  locale: "pt" | "en";
  title: string;
  description: string;
  ptPath: string;
  enPath: string;
  type?: "article" | "website";
};

/** Metadados canônicos compartilhados pelas versões localizadas de uma página. */
export function localizedHead({
  locale,
  title,
  description,
  ptPath,
  enPath,
  type = "website",
}: LocalizedHeadOptions) {
  const canonicalPath = locale === "en" ? enPath : ptPath;
  const canonical = `${SITE_ORIGIN}${canonicalPath}`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:site_name", content: "pitstop.dev" },
      { property: "og:url", content: canonical },
      { property: "og:locale", content: locale === "en" ? "en_US" : "pt_BR" },
      {
        property: "og:locale:alternate",
        content: locale === "en" ? "pt_BR" : "en_US",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: canonical },
      { rel: "alternate", hrefLang: "pt-BR", href: `${SITE_ORIGIN}${ptPath}` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}${enPath}` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}${ptPath}` },
    ],
  };
}

/** Metadados compartilhados pelas versões localizadas de cada relatório. */
export function reportHead(options: Omit<LocalizedHeadOptions, "type">) {
  return localizedHead({ ...options, type: "article" });
}
