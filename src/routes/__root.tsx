import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "@/components/SiteNav";
import { BOOT_COVER_MAX_MS, BOOT_PENDING_CLASS, BOOT_SEEN_KEY } from "@/lib/bootCover";

const LazyBootSplash = lazy(() =>
  import("@/components/BootSplash").then(({ BootSplash }) => ({ default: BootSplash })),
);

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "pitstop.dev | Relatórios imersivos de engenharia" },
      {
        name: "description",
        content:
          "Relatórios educacionais interativos sobre DevOps, Cloud e Backend, com conceitos, código comentado, comandos e exercícios práticos.",
      },
      { name: "author", content: "pitstop.dev.br" },
      { property: "og:title", content: "pitstop.dev.br | Estudos de engenharia em ritmo de F1" },
      {
        property: "og:description",
        content:
          "Relatórios imersivos de DevOps, Cloud e Backend com exemplos reais e prática guiada.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Saira+Condensed:wght@600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Roda antes do primeiro paint: na primeira visita da sessão à home, cobre a
// página de preto (classe boot-pending) até o BootSplash assumir com o vídeo.
// Sem isso, a home aparecia enquanto o chunk do splash e o vídeo carregavam.
// As condições espelham o BootSplash (sessão já vista, movimento reduzido,
// economia de dados); a trava final libera o site se o JS nunca chegar.
const BOOT_COVER_SCRIPT = `(function(){try{
var p=location.pathname;if(p!=="/"&&p!=="/en"&&p!=="/en/")return;
if(sessionStorage.getItem("${BOOT_SEEN_KEY}")==="1")return;
if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var c=navigator.connection;if(c&&c.saveData)return;
var d=document.documentElement;d.classList.add("${BOOT_PENDING_CLASS}");
setTimeout(function(){d.classList.remove("${BOOT_PENDING_CLASS}")},${BOOT_COVER_MAX_MS});
}catch(e){}})();`;

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const lang = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "pt-BR";

  return (
    // O script de boot adiciona uma classe no <html> antes da hidratação.
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_COVER_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useLocation({ select: (location) => location.pathname });
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const isHome = pathname === "/" || pathname === "/en" || pathname === "/en/";

  return (
    <QueryClientProvider client={queryClient}>
      {isHome && (
        <Suspense fallback={null}>
          <LazyBootSplash locale={isEnglish ? "en" : "pt"} />
        </Suspense>
      )}
      <SiteNav />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
