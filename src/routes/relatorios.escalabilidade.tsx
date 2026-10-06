import { createFileRoute } from "@tanstack/react-router";
import { ANALOGY_NOTES, DE_PARA, LESSONS } from "@/data/escalabilidade";
import {
  DeParaDetails,
  GuideProgress,
  GuideRail,
  LessonSection,
} from "@/components/guide/GuideKit";
import { useGuideProgress, useScrollSpy, useSectionReveal } from "@/components/guide/hooks";
import { f1Logo } from "@/assets/brand/paths";
import { reportHead } from "@/lib/seo";

export const Route = createFileRoute("/relatorios/escalabilidade")({
  head: () =>
    reportHead({
      locale: "pt",
      title: "Escalabilidade nos servidores: do box ao pico | pitstop.dev",
      description:
        "Guia imersivo sobre escalabilidade: escala vertical e horizontal, load balancers, aplicações stateless, filas, CDN, réplicas de banco, CAP e observabilidade, com laboratórios locais.",
      ptPath: "/relatorios/escalabilidade",
      enPath: "/en/relatorios/escalabilidade",
    }),
  component: Index,
});

const NAV = [
  { id: "inicio", num: "00", title: "Início" },
  ...LESSONS.map((lesson) => ({
    id: lesson.id,
    num: lesson.num,
    title: lesson.navTitle,
  })),
];

const PROGRESS_KEY = "pitstop-progress-escalabilidade";

const LESSON_COPY = {
  stage: "Etapa",
  howItWorks: "Como funciona",
  commandsTitle: "Comandos essenciais desta etapa",
  handsOn: "Mão na massa",
  tip: "Dica:",
  takeaway: "Anota aí:",
  doneLabel: (num: string) => `etapa ${num} concluída (clique p/ desfazer)`,
  markDoneLabel: (num: string) => `marcar etapa ${num} como concluída`,
};

function Index() {
  const [done, setDone] = useGuideProgress(PROGRESS_KEY);
  useSectionReveal();
  const activeId = useScrollSpy(NAV.map((item) => item.id));

  const doneCount = LESSONS.filter((lesson) => done[lesson.id]).length;

  return (
    <div className="shell">
      <GuideRail
        nav={NAV}
        activeId={activeId}
        done={done}
        ariaLabel="Etapas"
        railFoot={
          <>
            guia interativo · react
            <br />
            conteúdo das Aulas 01 a 06
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              transmissão ao vivo · <b>o gp da escalabilidade, setor por setor</b>
            </p>
            <h1 className="htitle">
              Escalabilidade nos servidores
              <br />
              direto do <span className="b">pit lane</span>.
            </h1>
            <p className="narration">
              Boa tarde a todos! Está no ar o GP da Escalabilidade: um sistema que aguenta o pico
              sem cair, do primeiro usuário ao milionésimo. São seis setores, um por aula:
              fundamentos, load balancers, stateless e filas, CDN, banco de dados e a arquitetura
              completa com a telemetria ligada. Farol apagado, o piloto assume a narrativa.
            </p>
            <p className="lead">
              Cada conceito é lido como o pit lane de um GP:{" "}
              <strong>o problema que cada peça resolve</strong>, uma analogia de F1 tecnicamente
              honesta, configurações comentadas, comandos com a saída esperada e um{" "}
              <strong>mão na massa</strong> por etapa que roda na sua máquina, sem conta de nuvem.
            </p>
            <DeParaDetails
              summaryLabel="O quadro de-para: cole isto no volante"
              intro={
                <>
                  A mesma analogia vale do início ao fim do guia.{" "}
                  <b>Não tente decorar esta tabela agora.</b> Ela é o mapa do circuito, não a prova:
                  siga direto para a Etapa 01 e volte aqui sempre que uma analogia aparecer no
                  texto.
                </>
              }
              headers={["Escalabilidade", "Fórmula 1"]}
              mapping={DE_PARA.map((mapping) => ({
                left: mapping.tema,
                right: mapping.f1,
              }))}
              breaksLabel="Onde as analogias quebram (piloto que esconde limitação do carro quebra no muro):"
              notes={ANALOGY_NOTES}
            />
            <GuideProgress doneCount={doneCount} total={LESSONS.length} label="SEU PROGRESSO" />
          </header>

          {LESSONS.map((lesson) => (
            <LessonSection
              key={lesson.id}
              lesson={lesson}
              done={!!done[lesson.id]}
              onToggleDone={() =>
                setDone((current) => ({ ...current, [lesson.id]: !current[lesson.id] }))
              }
              copy={LESSON_COPY}
            />
          ))}

          <footer>
            <span className="foot-brand">
              <img src={f1Logo} alt="" width={38} height={19} />
              <span>
                <b>pitstop.dev</b> · guia Escalabilidade nos servidores, etapa por etapa, baseado
                nas Aulas 01 a 06 da disciplina.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
