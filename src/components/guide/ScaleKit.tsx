import { Fragment, type ReactNode } from "react";
import { ArrowRight, FlaskConical, HelpCircle } from "lucide-react";
import { Icon } from "@/components/Icon";
import {
  CommandList,
  ExampleTabs,
  type GuideCommand,
  type GuideExample,
} from "@/components/guide/GuideKit";

// Layout próprio do guia de Escalabilidade (PT e EN): em vez da narração de transmissão
// do LessonSection, cada etapa parte de uma pergunta e de um sintoma, mostra analogias
// conceituais lado a lado, uma tabela "ganha x paga" e o laboratório numa bancada separada.

export type ScaleAnalogy = { term: string; f1: string; limit?: string };
export type ScaleTradeoff = { option: string; gain: string; cost: string };
export type ScaleLesson = {
  id: string;
  num: string;
  tag: string;
  title: string;
  question: string;
  symptom: string;
  pitScene: string;
  answer: string;
  concept: string[];
  analogies: ScaleAnalogy[];
  tradeoffs: ScaleTradeoff[];
  examplesTitle: string;
  examples: GuideExample[];
  commands: GuideCommand[];
  labGoal: string;
  labSteps: string[];
  labNote?: string;
  rule: string;
  pitRule: string;
  selfCheck: string;
};
export type ScaleMapNode = {
  id: string;
  label: string;
  detail: string;
  f1: string;
  stages: string[];
};

export type ScaleCopy = {
  question: string; // "Pergunta" | "Question"
  symptom: string;
  pitScene: string; // "No box:" | "In the pit box:"
  answer: string;
  howItWorks: string;
  analogies: string;
  analogyLimit: string;
  tradeoffs: string;
  tradeoffHeaders: [string, string, string];
  lab: string;
  labCommands: string;
  labSteps: string;
  rule: string;
  pitRule: string; // "Na pista:" | "On track:"
  selfCheck: string;
  doneLabel: (num: string) => ReactNode;
  markDoneLabel: (num: string) => string;
};

export function ScaleLessonSection({
  lesson,
  done,
  onToggleDone,
  copy,
}: {
  lesson: ScaleLesson;
  done: boolean;
  onToggleDone: () => void;
  copy: ScaleCopy;
}) {
  return (
    <section className="section sc-lesson" id={lesson.id}>
      <header className="sc-head">
        <span className="sc-num" aria-hidden="true">
          {lesson.num}
        </span>
        <div>
          <p className="sc-kicker">
            {copy.question} {lesson.num} · <span>{lesson.tag}</span>
          </p>
          <h2 className="sc-question">{lesson.question}</h2>
          <p className="sc-title">{lesson.title}</p>
        </div>
      </header>

      <div className="sc-problem">
        <div className="sc-symptom">
          <h4>{copy.symptom}</h4>
          <p>{lesson.symptom}</p>
          <p className="sc-pit-scene">
            <Icon name="speedometer" size={13} /> <b>{copy.pitScene}</b> {lesson.pitScene}
          </p>
        </div>
        <ArrowRight className="sc-problem-arrow" size={20} aria-hidden="true" />
        <div className="sc-answer">
          <h4>{copy.answer}</h4>
          <p>{lesson.answer}</p>
        </div>
      </div>

      <h3>{copy.howItWorks}</h3>
      {lesson.concept.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      <h3 className="h-cmd">
        <Icon name="speedometer" size={15} /> {copy.analogies}
      </h3>
      <dl className="sc-analogies">
        {lesson.analogies.map((a) => (
          <div className="sc-analogy" key={a.term}>
            <dt>{a.term}</dt>
            <dd>
              {a.f1}
              {a.limit && (
                <span className="sc-limit">
                  <b>{copy.analogyLimit}</b> {a.limit}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <h3>{copy.tradeoffs}</h3>
      <div className="sc-trade-scroll">
        <table className="sc-trade">
          <thead>
            <tr>
              {copy.tradeoffHeaders.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lesson.tradeoffs.map((t) => (
              <tr key={t.option}>
                <th scope="row">{t.option}</th>
                <td className="sc-gain">{t.gain}</td>
                <td className="sc-cost">{t.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sc-lab">
        <p className="sc-lab-label">
          <FlaskConical size={14} aria-hidden="true" /> {copy.lab} · {lesson.examplesTitle}
        </p>
        <p className="sc-lab-goal">{lesson.labGoal}</p>
        <ExampleTabs examples={lesson.examples} />
        <h4>{copy.labCommands}</h4>
        <CommandList commands={lesson.commands} />
        <h4>{copy.labSteps}</h4>
        <ol className="sc-steps">
          {lesson.labSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        {lesson.labNote && <p className="sc-lab-note">{lesson.labNote}</p>}
      </div>

      <div className="sc-close">
        <p className="sc-rule">
          <b>{copy.rule}</b> {lesson.rule}
        </p>
        <p className="sc-pit-rule">
          <Icon name="checkeredFlag" size={14} />
          <span>
            <b>{copy.pitRule}</b> {lesson.pitRule}
          </span>
        </p>
        <p className="sc-check">
          <HelpCircle size={16} aria-hidden="true" />
          <span>
            <b>{copy.selfCheck}</b> {lesson.selfCheck}
          </span>
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

/** Mapa da arquitetura: a requisição atravessando as peças, cada uma ligada à etapa que a explica. */
export function SystemMap({
  nodes,
  observability,
  done,
  stageLabel,
}: {
  nodes: ScaleMapNode[];
  observability: ScaleMapNode;
  done: Record<string, boolean>;
  stageLabel: string;
}) {
  const renderNode = (node: ScaleMapNode, className: string) => {
    const complete = node.stages.length > 0 && node.stages.every((s) => done[s]);
    const body = (
      <>
        <span className="sc-node-label">{node.label}</span>
        <span className="sc-node-detail">{node.detail}</span>
        <span className="sc-node-f1">{node.f1}</span>
        {node.stages.length > 0 && (
          <span className="sc-node-stages">
            {stageLabel} {node.stages.map((s) => s.replace("es", "0")).join(" · ")}
            {complete && <Icon name="checkeredFlag" size={11} />}
          </span>
        )}
      </>
    );
    return node.stages.length > 0 ? (
      <a
        key={node.id}
        href={`#${node.stages[0]}`}
        className={`${className} ${complete ? "is-done" : ""}`}
      >
        {body}
      </a>
    ) : (
      <div key={node.id} className={`${className} is-origin`}>
        {body}
      </div>
    );
  };

  return (
    <div className="sc-map">
      <div className="sc-map-flow">
        {nodes.map((node, i) => (
          <Fragment key={node.id}>
            {i > 0 && <span className="sc-map-arrow" aria-hidden="true" />}
            {renderNode(node, "sc-node")}
          </Fragment>
        ))}
      </div>
      {renderNode(observability, "sc-node sc-node-obs")}
    </div>
  );
}
