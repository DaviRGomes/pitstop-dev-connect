import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Github, Menu, Search, X } from "lucide-react";
import { sennaS } from "@/assets/brand/paths";
import { getSearchIndex, searchDocs, type Locale, type SearchDoc } from "@/lib/searchIndex";

const GITHUB_URL = "https://github.com/davirgomes";

const COPY = {
  pt: {
    home: "/" as const,
    links: [
      { hash: "sobre", label: "sobre" },
      { hash: "areas", label: "áreas" },
      { hash: "relatorios", label: "relatórios" },
    ],
    searchPlaceholder: "Buscar nos relatórios…",
    searchLabel: "Buscar nos relatórios",
    searchLoading: "Carregando índice…",
    searchNoResults: "Nada encontrado.",
    githubLabel: "GitHub",
    langLabel: "Mudar para inglês",
    menuLabel: "Menu",
    closeLabel: "Fechar menu",
  },
  en: {
    home: "/en" as const,
    links: [
      { hash: "sobre", label: "about" },
      { hash: "areas", label: "areas" },
      { hash: "relatorios", label: "reports" },
    ],
    searchPlaceholder: "Search the reports…",
    searchLabel: "Search the reports",
    searchLoading: "Loading index…",
    searchNoResults: "No matches found.",
    githubLabel: "GitHub",
    langLabel: "Switch to Portuguese",
    menuLabel: "Menu",
    closeLabel: "Close menu",
  },
};

function useLocale(pathname: string) {
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const otherPath = isEn
    ? pathname === "/en"
      ? "/"
      : pathname.replace(/^\/en/, "") || "/"
    : pathname === "/"
      ? "/en"
      : `/en${pathname}`;
  return { isEn, otherPath };
}

function SearchResultsList({
  index,
  query,
  emptyLabel,
  loadingLabel,
  onNavigate,
}: {
  index: SearchDoc[] | null;
  query: string;
  emptyLabel: string;
  loadingLabel: string;
  onNavigate: () => void;
}) {
  const matches = useMemo(() => (index ? searchDocs(index, query) : []), [index, query]);

  return (
    <div className="search-results" role="listbox">
      {!index ? (
        <p className="search-empty">{loadingLabel}</p>
      ) : matches.length === 0 ? (
        <p className="search-empty">{emptyLabel}</p>
      ) : (
        matches.map((m) => (
          <a
            key={`${m.guideSlug}-${m.hash}`}
            className="search-result"
            href={m.url}
            onClick={onNavigate}
          >
            <span className="search-result-guide">{m.guideTitle}</span>
            <span className="search-result-title">
              {m.num !== "00" && <span className="search-result-num">{m.num}</span>}
              {m.title}
            </span>
            <span className="search-result-snippet">{m.snippet}</span>
          </a>
        ))
      )}
    </div>
  );
}

function SearchBox({
  locale,
  placeholder,
  label,
  loadingLabel,
  emptyLabel,
  showKbdHint,
  inputRef,
}: {
  locale: Locale;
  placeholder: string;
  label: string;
  loadingLabel: string;
  emptyLabel: string;
  showKbdHint?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<SearchDoc[] | null>(null);
  const loadedLocale = useRef<Locale | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIndex(null);
    loadedLocale.current = null;
  }, [locale]);

  function ensureIndex() {
    if (loadedLocale.current === locale) return;
    loadedLocale.current = locale;
    getSearchIndex(locale).then(setIndex);
  }

  function close() {
    setOpen(false);
    setQuery("");
  }

  return (
    <div
      className="site-search"
      ref={containerRef}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Search size={15} aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          ensureIndex();
        }}
        onFocus={() => {
          setOpen(true);
          ensureIndex();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") close();
        }}
        placeholder={placeholder}
        aria-label={label}
        spellCheck={false}
      />
      {showKbdHint && (
        <kbd className="search-kbd" aria-hidden="true">
          Ctrl K
        </kbd>
      )}
      {open && query.trim() && (
        <SearchResultsList
          index={index}
          query={query}
          emptyLabel={emptyLabel}
          loadingLabel={loadingLabel}
          onNavigate={close}
        />
      )}
    </div>
  );
}

export function SiteNav() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const { isEn, otherPath } = useLocale(pathname);
  const t = isEn ? COPY.en : COPY.pt;
  const locale: Locale = isEn ? "en" : "pt";

  const [menuOpen, setMenuOpen] = useState(false);
  const desktopSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        desktopSearchRef.current?.focus();
      }
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="site-nav">
      <Link to={t.home} className="home-brand">
        <span className="brand-mark">
          <img src={sennaS} alt="" width={28} height={28} />
        </span>
        <b>
          pitstop<span className="tld">.dev.br</span>
        </b>
      </Link>

      <div className="site-nav-right">
        <nav className="site-nav-links" aria-label={isEn ? "Sections" : "Seções"}>
          {t.links.map((l) => (
            <Link key={l.hash} to={t.home} hash={l.hash}>
              {l.label}
            </Link>
          ))}
        </nav>

        <SearchBox
          locale={locale}
          placeholder={t.searchPlaceholder}
          label={t.searchLabel}
          loadingLabel={t.searchLoading}
          emptyLabel={t.searchNoResults}
          showKbdHint
          inputRef={desktopSearchRef}
        />

        <a
          className="icon-btn"
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          title={t.githubLabel}
          aria-label={t.githubLabel}
        >
          <Github size={18} aria-hidden="true" />
        </a>

        <a className="lang-toggle" href={otherPath} aria-label={t.langLabel} title={t.langLabel}>
          <span className={!isEn ? "on" : ""}>PT</span>
          <span className="sep" aria-hidden="true">
            |
          </span>
          <span className={isEn ? "on" : ""}>EN</span>
        </a>

        <button
          type="button"
          className="hamburger"
          aria-label={menuOpen ? t.closeLabel : t.menuLabel}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <div className="site-nav-mobile">
          <nav aria-label={isEn ? "Sections" : "Seções"}>
            {t.links.map((l) => (
              <Link key={l.hash} to={t.home} hash={l.hash} onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <SearchBox
            locale={locale}
            placeholder={t.searchPlaceholder}
            label={t.searchLabel}
            loadingLabel={t.searchLoading}
            emptyLabel={t.searchNoResults}
          />
          <div className="site-nav-mobile-row">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <Github size={16} aria-hidden="true" /> {t.githubLabel}
            </a>
            <a href={otherPath}>{isEn ? "Português (PT)" : "English (EN)"}</a>
          </div>
        </div>
      )}
    </header>
  );
}
