import { Fragment, useState, type ReactNode } from "react";
import { CheckSquare, Flag, Info, Terminal } from "lucide-react";
import { Icon } from "@/components/Icon";
import { CodeBlock, type GuideExample, type GuidePoint } from "@/components/guide/GuideKit";

// Layout do guia de Kubernetes (PT e EN): a lente geral de F1 abre o guia (LensSection) e
// cada etapa ensina o tópico só de forma técnica (TechLessonSection). A F1 aparece uma vez,
// no início, como comparação geral; as etapas não repetem a analogia.
// Os textos vêm de relatorios/<guia>/final*.md via scripts/md-to-lens-guide.py e mantêm
// o markdown inline (`código` e **negrito**), renderizado por <Md>.

export type TechExample = GuideExample & { intro?: string };
export type TechCommand = { cmd: string; note?: string };
export type FigureItem = { src: string; alt: string; caption: string };
export type FigureGroup = { items: FigureItem[]; credit: string };
export type TechLesson = {
  id: string;
  num: string;
  navTitle: string;
  tag: string;
  title: string;
  lead: string; // parágrafos do problema separados por linha em branco
  concept: string[]; // parágrafos; itens de lista começam com "- " ou "1. "
  figures?: FigureGroup[]; // diagramas mostrados no fim de "O conceito"
  pointsTitle: string;
  points: GuidePoint[];
  examplesTitle: string;
  examples: TechExample[];
  commands: TechCommand[];
  handsOnIntro?: string;
  handsOn: string[]; // podem conter blocos ```sh
  tip: string;
  takeaway: string;
};
export type LensMapping = { term: string; plain: string }; // termo técnico em palavras do dia a dia
export type GuideLens = {
  paragraphs: string[];
  bridge: string[];
  mappingNote: string;
  mapping: LensMapping[];
  limitsIntro: string;
  limits: string[];
};
export type ChecklistGroup = { title: string; items: string[]; outro?: string };

export type TechCopy = {
  stage: string; // "Etapa" | "Stage"
  problem: string; // "O problema" | "The problem"
  howItWorks: string;
  commandsTitle: string;
  handsOn: string;
  tip: string;
  takeaway: string;
  doneLabel: (num: string) => ReactNode;
  markDoneLabel: (num: string) => string;
};

export type LensCopy = {
  eyebrow: string;
  title: string;
  mappingTitle: string;
  headers: [string, string];
  limitsTitle: string;
};

/** Markdown inline mínimo: `código` e **negrito**. */
export function Md({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
          return <code key={i}>{part.slice(1, -1)}</code>;
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length > 3) {
          return <b key={i}>{part.slice(2, -2)}</b>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/** Texto que pode intercalar blocos ```sh (usado nos passos do mão na massa). */
function RichText({ text }: { text: string }) {
  const chunks = text.split(/```(\w*)\n([\s\S]*?)\n```\n?/g);
  const out: ReactNode[] = [];
  for (let i = 0; i < chunks.length; i += 3) {
    const prose = chunks[i].trim();
    if (prose) out.push(<Md key={`t${i}`} text={prose} />);
    if (i + 2 < chunks.length) {
      const lang = chunks[i + 1] === "yaml" ? "yaml" : "sh";
      out.push(
        <div className="lens-inline-code" key={`c${i}`}>
          <CodeBlock example={{ label: "", lang, code: chunks[i + 2] }} />
        </div>,
      );
    }
  }
  return <>{out}</>;
}

/** Parágrafos e listas: itens "- " viram <ul> e itens "1. " viram <ol>. */
function Paragraphs({ items }: { items: string[] }) {
  type List = { ordered: boolean; items: string[] };
  const groups: (string | List)[] = [];
  for (const item of items) {
    const bullet = item.startsWith("- ");
    const numbered = /^\d+\. /.test(item);
    if (bullet || numbered) {
      const text = item.replace(/^(- |\d+\. )/, "");
      const last = groups[groups.length - 1];
      if (typeof last === "object" && last.ordered === numbered) last.items.push(text);
      else groups.push({ ordered: numbered, items: [text] });
    } else {
      groups.push(item);
    }
  }
  return (
    <>
      {groups.map((g, i) => {
        if (typeof g === "string") {
          return (
            <p key={i}>
              <Md text={g} />
            </p>
          );
        }
        const Tag = g.ordered ? "ol" : "ul";
        return (
          <Tag className="lens-list" key={i}>
            {g.items.map((li, j) => (
              <li key={j}>
                <Md text={li} />
              </li>
            ))}
          </Tag>
        );
      })}
    </>
  );
}

/** Diagramas técnicos: um quadro só, ou uma sequência numerada em grade. */
function Figures({ groups }: { groups: FigureGroup[] }) {
  return (
    <>
      {groups.map((g, i) => (
        <figure className={`lens-figure ${g.items.length > 1 ? "is-sequence" : ""}`} key={i}>
          <div className="lens-figure-frames">
            {g.items.map((it) => (
              <div className="lens-figure-frame" key={it.src}>
                <img src={it.src} alt={it.alt} loading="lazy" decoding="async" />
                {g.items.length > 1 && (
                  <p className="lens-figure-step">
                    <Md text={it.caption} />
                  </p>
                )}
              </div>
            ))}
          </div>
          <figcaption>
            {g.items.length === 1 && <Md text={g.items[0].caption} />}
            {g.credit && <span className="lens-figure-credit">{g.credit}</span>}
          </figcaption>
        </figure>
      ))}
    </>
  );
}

function TechExamples({ examples }: { examples: TechExample[] }) {
  const [active, setActive] = useState(0);
  const ex = examples[active];
  return (
    <div>
      {examples.length > 1 && (
        <div className="tabs" role="tablist">
          {examples.map((e, i) => (
            <button
              key={e.label}
              role="tab"
              aria-selected={i === active}
              className={`tab ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              {e.label}
            </button>
          ))}
        </div>
      )}
      {ex.intro && (
        <p className="lens-ex-intro">
          <Md text={ex.intro} />
        </p>
      )}
      <CodeBlock example={{ label: ex.label, lang: ex.lang, code: ex.code }} />
      {ex.note && (
        <p className="code-note">
          <Md text={ex.note} />
        </p>
      )}
    </div>
  );
}

export function LensSection({ lens, copy }: { lens: GuideLens; copy: LensCopy }) {
  return (
    <section className="section lens-section" id="lente">
      <p className="eyebrow">
        <Icon name="helmet" size={14} /> {copy.eyebrow}
      </p>
      <h2>{copy.title}</h2>
      <Paragraphs items={lens.paragraphs} />
      <div className="lens-bridge">
        <Paragraphs items={lens.bridge} />
      </div>

      <details className="lens-collapse">
        <summary>
          <h3>{copy.mappingTitle}</h3>
          <span className="lens-collapse-count">{lens.mapping.length}</span>
        </summary>
        <p className="lens-note">
          <Md text={lens.mappingNote} />
        </p>
        <div className="lens-scroll">
          <table className="lens-table">
            <thead>
              <tr>
                <th scope="col">{copy.headers[0]}</th>
                <th scope="col">{copy.headers[1]}</th>
              </tr>
            </thead>
            <tbody>
              {lens.mapping.map((m) => (
                <tr key={m.term}>
                  <th scope="row">
                    <Md text={m.term} />
                  </th>
                  <td>
                    <Md text={m.plain} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {lens.limits.length > 0 && (
        <details className="lens-collapse">
          <summary>
            <h3>{copy.limitsTitle}</h3>
            <span className="lens-collapse-count">{lens.limits.length}</span>
          </summary>
          <p className="lens-note">
            <Md text={lens.limitsIntro} />
          </p>
          <Paragraphs items={lens.limits.map((l) => `- ${l}`)} />
        </details>
      )}
    </section>
  );
}

export function TechLessonSection({
  lesson,
  done,
  onToggleDone,
  copy,
}: {
  lesson: TechLesson;
  done: boolean;
  onToggleDone: () => void;
  copy: TechCopy;
}) {
  return (
    <section className="section" id={lesson.id}>
      <p className="eyebrow">
        {copy.stage} {lesson.num} <span className="tag">{lesson.tag}</span>
      </p>
      <h2>{lesson.title}</h2>

      <h3>{copy.problem}</h3>
      <div className="lens-problem">
        <Paragraphs items={lesson.lead.split("\n\n")} />
      </div>

      <h3>{copy.howItWorks}</h3>
      <Paragraphs items={lesson.concept} />
      {lesson.figures && <Figures groups={lesson.figures} />}

      <h3>{lesson.pointsTitle}</h3>
      <div className="grid g3">
        {lesson.points.map((pt) => (
          <div className="panel point-card" key={pt.t}>
            <h4 className={`pt-${pt.color || "blue"}`}>
              <Md text={pt.t} />
            </h4>
            <p>
              <Md text={pt.d} />
            </p>
          </div>
        ))}
      </div>

      <h3>{lesson.examplesTitle}</h3>
      <TechExamples examples={lesson.examples} />

      <h3 className="h-cmd">
        <Terminal size={15} aria-hidden="true" /> {copy.commandsTitle}
      </h3>
      <div className="cmd-list">
        {lesson.commands.map((c) => (
          <div className="cmd" key={c.cmd}>
            <span className="tk-prompt">$</span>
            <span>
              {c.cmd}
              {c.note && (
                <span className="tk-comment">
                  {" "}
                  # <Md text={c.note} />
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      <h3>{copy.handsOn}</h3>
      {lesson.handsOnIntro && (
        <p className="handson-intro">
          <Md text={lesson.handsOnIntro} />
        </p>
      )}
      <ol className="handson">
        {lesson.handsOn.map((step, i) => (
          <li key={i}>
            <RichText text={step} />
          </li>
        ))}
      </ol>

      <div className="callout blue">
        <Info className="co-ic" size={17} aria-hidden="true" />
        <p>
          <b>{copy.tip}</b> <Md text={lesson.tip} />
        </p>
      </div>

      <div className="callout teal">
        <Flag className="co-ic" size={17} aria-hidden="true" />
        <p>
          <b>{copy.takeaway}</b> <Md text={lesson.takeaway} />
        </p>
      </div>

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

export function ChecklistSection({
  id,
  eyebrow,
  title,
  groups,
  notesTitle,
  notes,
}: {
  id: string;
  eyebrow: string;
  title: string;
  groups: ChecklistGroup[];
  notesTitle: string;
  notes: string[];
}) {
  return (
    <section className="section" id={id}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <div className="grid g2 lens-check">
        {groups
          .filter((g) => g.items.length > 0)
          .map((g) => (
            <div className="panel" key={g.title}>
              <h4>{g.title}</h4>
              <ul>
                {g.items.map((item, i) => (
                  <li key={i}>
                    <CheckSquare size={14} aria-hidden="true" />
                    <span>
                      <Md text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
      {groups
        .filter((g) => g.outro)
        .map((g, i) => (
          <p className="lens-check-outro" key={i}>
            <Md text={g.outro as string} />
          </p>
        ))}
      {notes.length > 0 && (
        <details className="depara lens-notes">
          <summary>{notesTitle}</summary>
          <Paragraphs items={notes.map((n) => `- ${n}`)} />
        </details>
      )}
    </section>
  );
}
