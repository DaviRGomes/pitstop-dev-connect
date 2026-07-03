import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ExternalLink, Flag, Info, Terminal } from "lucide-react";
import { LESSONS, PLATFORMS, type Command, type Example, type Lesson } from "@/data/lessons";
import { Icon } from "@/components/Icon";
import { sennaS, helmetImg, f1Logo, sennaBg } from "@/assets/brand/paths";

export const Route = createFileRoute("/relatorios/kubernetes")({
  component: Index,
});

function YamlLine({ line }: { line: string }) {
  const hashIdx = line.indexOf("#");
  const main = hashIdx >= 0 ? line.slice(0, hashIdx) : line;
  const comment = hashIdx >= 0 ? line.slice(hashIdx) : "";
  const m = main.match(/^(\s*-?\s*)([A-Za-z0-9_.-]+:)(.*)$/);
  return (
    <div className="code-line">
      {m ? (
        <>
          <span>{m[1]}</span>
          <span className="tk-key">{m[2]}</span>
          <span className="tk-val">{m[3]}</span>
        </>
      ) : (
        <span className="tk-val">{main || " "}</span>
      )}
      {comment && <span className="tk-comment">{comment}</span>}
    </div>
  );
}

function ShLine({ line }: { line: string }) {
  if (line.trimStart().startsWith("#")) {
    return <div className="code-line tk-comment">{line}</div>;
  }
  if (line.startsWith("$")) {
    const hashIdx = line.indexOf(" # ");
    const cmd = hashIdx >= 0 ? line.slice(1, hashIdx) : line.slice(1);
    const comment = hashIdx >= 0 ? line.slice(hashIdx) : "";
    return (
      <div className="code-line">
        <span className="tk-prompt">$</span>
        <span className="tk-cmd">{cmd}</span>
        {comment && <span className="tk-comment">{comment}</span>}
      </div>
    );
  }
  return <div className="code-line tk-output">{line || " "}</div>;
}

function CodeBlock({ example }: { example: Example }) {
  const lines = useMemo(() => example.code.split("\n"), [example.code]);
  return (
    <div>
      <div className="code">
        <pre>
          {lines.map((l, i) =>
            example.lang === "yaml" ? <YamlLine key={i} line={l} /> : <ShLine key={i} line={l} />,
          )}
        </pre>
      </div>
      {example.note && <p className="code-note">💡 {example.note}</p>}
    </div>
  );
}

function ExampleTabs({ examples }: { examples: Example[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="tabs" role="tablist">
        {examples.map((ex, i) => (
          <button
            key={ex.label}
            role="tab"
            aria-selected={i === active}
            className={`tab ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}
          >
            {ex.label}
          </button>
        ))}
      </div>
      <CodeBlock example={examples[active]} />
    </div>
  );
}

function CommandList({ commands }: { commands: Command[] }) {
  return (
    <div className="cmd-list">
      {commands.map((c) => (
        <div className="cmd" key={c.cmd}>
          <span className="tk-prompt">$</span>
          <span>
            {c.cmd}
            {c.note && <span className="tk-comment"> # {c.note}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

function LessonSection({
  lesson,
  done,
  onToggleDone,
}: {
  lesson: Lesson;
  done: boolean;
  onToggleDone: () => void;
}) {
  return (
    <section className="section" id={lesson.id}>
      <p className="eyebrow">
        Etapa {lesson.num} <span className="tag">{lesson.tag}</span>
      </p>
      <h2>{lesson.title}</h2>
      <p className="lead">{lesson.lead}</p>

      <h3>Como funciona</h3>
      {lesson.concept.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      <h3>{lesson.pointsTitle}</h3>
      <div className="grid g3">
        {lesson.points.map((pt) => (
          <div className="panel point-card" key={pt.t}>
            <h4 className={`pt-${pt.color || "blue"}`}>{pt.t}</h4>
            <p>{pt.d}</p>
          </div>
        ))}
      </div>

      <h3>{lesson.examplesTitle}</h3>
      <ExampleTabs examples={lesson.examples} />

      <h3 className="h-cmd">
        <Terminal size={15} aria-hidden="true" /> Comandos essenciais desta etapa
      </h3>
      <CommandList commands={lesson.commands} />

      <div className="callout blue">
        <Info className="co-ic" size={17} aria-hidden="true" />
        <p>
          <b>Anota aí:</b> {lesson.tip}
        </p>
      </div>

      <button className={`btn-done ${done ? "on" : ""}`} onClick={onToggleDone}>
        {done ? (
          <>
            <Icon name="checkeredFlag" size={14} /> etapa {lesson.num} concluída — clique p/ desfazer
          </>
        ) : (
          `marcar etapa ${lesson.num} como concluída`
        )}
      </button>
    </section>
  );
}

function PlatformsSection() {
  return (
    <section className="section" id="pratica">
      <p className="eyebrow">
        Etapa 09 <span className="tag">labs online</span>
      </p>
      <h2>Pratique de graça em clusters reais</h2>
      <p className="lead">
        Você não precisa pagar nada pra colocar a mão num cluster: estas plataformas dão terminal com
        Kubernetes real direto no navegador. Comece pelas 100% gratuitas.
      </p>
      <div className="grid g2">
        {PLATFORMS.map((p) => (
          <div className="panel plat-card" key={p.name}>
            <div className="plat-head">
              <h4>{p.name}</h4>
              <span className={`badge ${p.free ? "badge-free" : "badge-tier"}`}>{p.price}</span>
            </div>
            <p>{p.desc}</p>
            <p className="plat-good">
              <b>Bom para:</b> {p.goodFor}
            </p>
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              {p.urlLabel} <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
      <div className="callout teal">
        <Flag className="co-ic" size={17} aria-hidden="true" />
        <p>
          <b>Roteiro sugerido:</b> a cada etapa deste guia, abra o <strong>Killercoda</strong> e
          repita os comandos no cenário equivalente (Pods, Deployments, Volumes...). Fechou as 8
          etapas? Vá pro <strong>KodeKloud</strong> encarar desafios de troubleshooting.
        </p>
      </div>
    </section>
  );
}

const NAV = [
  { id: "inicio", num: "00", title: "Início" },
  ...LESSONS.map((l) => ({ id: l.id, num: l.num, title: l.navTitle })),
  { id: "pratica", num: "09", title: "Pratique de graça" },
];

function Index() {
  const [activeId, setActiveId] = useState("inicio");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 2600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pitstop-progress");
      if (raw) setDone(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("pitstop-progress", JSON.stringify(done));
    } catch {
      // ignore
    }
  }, [done]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".section"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    for (const el of sections) {
      el.classList.add("reveal");
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = NAV.map((n) => n.id);
    const onScroll = () => {
      const pos = window.scrollY + window.innerHeight * 0.3;
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= pos) cur = id;
      }
      setActiveId(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const doneCount = LESSONS.filter((l) => done[l.id]).length;
  const progress = Math.round((doneCount / LESSONS.length) * 100);

  return (
    <div className="shell">
      <video
        className="bg-video"
        src={sennaBg.url}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className={`boot-splash ${booted ? "is-gone" : ""}`} aria-hidden="true">
        <video
          className="boot-splash-video"
          src={sennaBg.url}
          autoPlay
          muted
          playsInline
        />
        <blockquote className="boot-splash-quote">
          <p>
            "Tenha sempre como meta muita força, muita determinação e sempre faça
            tudo com muito amor e muita fé em Deus, que um dia você chega lá."
          </p>
          <cite>— Ayrton Senna</cite>
        </blockquote>
      </div>
      <aside className="rail">
        <div className="brand">
          <span className="brand-mark">
            <img src={sennaS.url} alt="" width={30} height={30} />
          </span>
          <div>
            <b>
              pitstop<span className="tld">.dev.br</span>
            </b>
            <span>guia kubernetes · etapa por etapa</span>
          </div>
        </div>
        <nav className="nav" aria-label="Etapas">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={activeId === n.id ? "active" : ""}>
              <span className="n">{n.num}</span> {n.title}
              {done[n.id] ? (
                <span className="done-mark">
                  <Icon name="checkeredFlag" size={12} label="etapa concluída" />
                </span>
              ) : activeId === n.id ? (
                <span className="active-mark" aria-hidden="true">
                  <img src={helmetImg.url} alt="" width={18} height={18} />
                </span>
              ) : null}
            </a>
          ))}
        </nav>
        <div className="rail-foot">
          guia interativo · react
          <br />
          conteúdo das aulas 1–8
        </div>
      </aside>

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              guia de estudo · <b>como o kubernetes funciona, etapa por etapa</b>
            </p>
            <h1 className="htitle">
              Kubernetes explicado
              <br />
              com <span className="b">exemplos reais</span>.
            </h1>
            <p className="lead">
              8 etapas no conceito geral: <strong>o problema que cada peça resolve</strong>, como
              ela funciona por dentro, o YAML comentado linha a linha e os comandos com a saída
              esperada. No final, os <strong>sites gratuitos</strong> pra praticar em clusters
              reais no navegador.
            </p>
            <div className="progress-box">
              <div className="progress-label">
                <span className="progress-title">
                  <Icon name="speedometer" size={14} /> SEU PROGRESSO
                </span>
                <b>
                  {doneCount} de {LESSONS.length} etapas
                </b>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="sectors" aria-hidden="true">
                <span className={progress >= 100 / 3 ? "on" : ""}>S1</span>
                <span className={progress >= 200 / 3 ? "on" : ""}>S2</span>
                <span className={progress >= 100 ? "on" : ""}>S3</span>
              </div>
            </div>
          </header>

          {LESSONS.map((lesson) => (
            <LessonSection
              key={lesson.id}
              lesson={lesson}
              done={!!done[lesson.id]}
              onToggleDone={() => setDone((d) => ({ ...d, [lesson.id]: !d[lesson.id] }))}
            />
          ))}

          <PlatformsSection />

          <footer>
            <span className="foot-brand">
              <img src={f1Logo.url} alt="" width={38} height={19} />
              <span>
                <b>pitstop.dev.br</b> — guia Kubernetes etapa por etapa, baseado nas aulas
                1–8 (Thiago Adriano, FIAP).
              </span>
            </span>
            <span className="foot-note">100% estático · progresso salvo em localStorage</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
