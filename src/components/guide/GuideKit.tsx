import { useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { Flag, Info, Terminal } from "lucide-react";
import { Icon } from "@/components/Icon";
import { helmetImg } from "@/assets/brand/paths";

// Peças reaproveitadas por todas as páginas de guia (PT e EN, todos os temas).
// Os tipos aqui são estruturais de propósito: cada arquivo de dados (kubernetesbasico.ts,
// servidoresweb.ts, suas versões .en.ts etc.) continua dono do seu próprio `type Lesson`,
// e o TypeScript casa as formas sem precisar de um import compartilhado.

export type GuideExample = { label: string; lang: "yaml" | "sh"; code: string; note?: string };
export type GuideCommand = { cmd: string; note?: string };
export type GuidePoint = { t: string; d: string; color?: string };
export type GuideLesson = {
  id: string;
  num: string;
  navTitle: string;
  tag: string;
  title: string;
  narration: string;
  lead: string;
  concept: string[];
  points: GuidePoint[];
  pointsTitle: string;
  examples: GuideExample[];
  examplesTitle: string;
  commands: GuideCommand[];
  handsOnIntro?: string;
  handsOn: string[];
  tip: string;
  takeaway: string;
  outro: string;
};
export type GuideMapping = { left: string; right: string };
export type GuideNavItem = { id: string; num: string; title: string };

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

function CodeBlock({ example }: { example: GuideExample }) {
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

function ExampleTabs({ examples }: { examples: GuideExample[] }) {
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

function CommandList({ commands }: { commands: GuideCommand[] }) {
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

export function LessonSection({
  lesson,
  done,
  onToggleDone,
  copy,
}: {
  lesson: GuideLesson;
  done: boolean;
  onToggleDone: () => void;
  copy: {
    stage: string; // "Etapa" | "Stage"
    howItWorks: string; // "Como funciona" | "How it works"
    commandsTitle: string; // "Comandos essenciais desta etapa" | "..."
    handsOn: string; // "Mão na massa" | "Hands-on"
    tip: string; // "Dica:" | "Tip:"
    takeaway: string; // "Anota aí:" | "Takeaway:"
    doneLabel: (num: string) => ReactNode;
    markDoneLabel: (num: string) => string;
  };
}) {
  return (
    <section className="section" id={lesson.id}>
      <p className="eyebrow">
        {copy.stage} {lesson.num} <span className="tag">{lesson.tag}</span>
      </p>
      <h2>{lesson.title}</h2>
      <p className="narration">{lesson.narration}</p>
      <p className="lead">{lesson.lead}</p>

      <h3>{copy.howItWorks}</h3>
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
        <Terminal size={15} aria-hidden="true" /> {copy.commandsTitle}
      </h3>
      <CommandList commands={lesson.commands} />

      <h3>{copy.handsOn}</h3>
      {lesson.handsOnIntro && <p className="handson-intro">{lesson.handsOnIntro}</p>}
      <ol className="handson">
        {lesson.handsOn.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      <div className="callout blue">
        <Info className="co-ic" size={17} aria-hidden="true" />
        <p>
          <b>{copy.tip}</b> {lesson.tip}
        </p>
      </div>

      <div className="callout teal">
        <Flag className="co-ic" size={17} aria-hidden="true" />
        <p>
          <b>{copy.takeaway}</b> {lesson.takeaway}
        </p>
      </div>

      <p className="narration outro">{lesson.outro}</p>

      <button className={`btn-done ${done ? "on" : ""}`} onClick={onToggleDone}>
        {done ? (
          <>
            <Icon name="checkeredFlag" size={14} /> {copy.doneLabel(lesson.num)}
          </>
        ) : (
          copy.markDoneLabel(lesson.num)
        )}
      </button>
    </section>
  );
}

export function GuideRail({
  nav,
  activeId,
  done,
  railFoot,
  ariaLabel,
}: {
  nav: GuideNavItem[];
  activeId: string;
  done: Record<string, boolean>;
  railFoot: ReactNode;
  ariaLabel: string;
}) {
  return (
    <aside className="rail">
      <nav className="nav" aria-label={ariaLabel}>
        {nav.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={activeId === n.id ? "active" : ""}>
            <span className="n">{n.num}</span> {n.title}
            {done[n.id] ? (
              <span className="done-mark">
                <Icon name="checkeredFlag" size={12} label="" />
              </span>
            ) : activeId === n.id ? (
              <span className="active-mark" aria-hidden="true">
                <img src={helmetImg} alt="" width={18} height={18} />
              </span>
            ) : null}
          </a>
        ))}
      </nav>
      <div className="rail-foot">{railFoot}</div>
    </aside>
  );
}

export function GuideProgress({
  doneCount,
  total,
  label,
}: {
  doneCount: number;
  total: number;
  label: string;
}) {
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  return (
    <div className="progress-box">
      <div className="progress-label">
        <span className="progress-title">
          <Icon name="speedometer" size={14} /> {label}
        </span>
        <b>
          {doneCount} / {total}
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
  );
}

export function DeParaDetails({
  summaryLabel,
  intro,
  headers,
  mapping,
  breaksLabel,
  notes,
}: {
  summaryLabel: string;
  intro: ReactNode;
  headers: [string, string];
  mapping: GuideMapping[];
  breaksLabel: ReactNode;
  notes: string[];
}) {
  return (
    <details className="depara">
      <summary>{summaryLabel}</summary>
      <p className="depara-note">{intro}</p>
      <div className="depara-scroll">
        <table>
          <thead>
            <tr>
              <th>{headers[0]}</th>
              <th>{headers[1]}</th>
            </tr>
          </thead>
          <tbody>
            {mapping.map((m) => (
              <tr key={m.left}>
                <td>{m.left}</td>
                <td>{m.right}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="depara-note">
        <b>{breaksLabel}</b>
      </p>
      <ul className="depara-notes-list">
        {notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </details>
  );
}

export function useGuideProgress(storageKey: string) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(done));
    } catch {
      // ignore
    }
  }, [storageKey, done]);

  return [done, setDone] as const;
}

export function useSectionReveal() {
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
}

export function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0]);
  const key = ids.join("|");

  useEffect(() => {
    if (typeof window === "undefined") return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.querySelector(".nav a.active");
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeId]);

  return activeId;
}
