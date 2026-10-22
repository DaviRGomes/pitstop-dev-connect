import { createFileRoute } from "@tanstack/react-router";
import { guardDraft } from "@/lib/drafts";
import { ANALOGY_NOTES, DE_PARA, LESSONS } from "@/data/arquiteturaaplicacoes";
import {
  DeParaDetails,
  GuideProgress,
  GuideRail,
  LessonSection,
} from "@/components/guide/GuideKit";
import { useGuideProgress, useScrollSpy, useSectionReveal } from "@/components/guide/hooks";
import { f1Logo } from "@/assets/brand/paths";
import { reportHead } from "@/lib/seo";

export const Route = createFileRoute("/relatorios/arquitetura-aplicacoes")({
  beforeLoad: guardDraft("arquitetura-aplicacoes"),
  head: () =>
    reportHead({
      locale: "pt",
      title: "Arquitetura de aplicações: do monolito aos microsserviços | pitstop.dev",
      description:
        "Guia imersivo de arquitetura de aplicações: monolito, camadas, microsserviços, banco por serviço, sagas, Event Sourcing, gateway e filas, com AWS e Azure lado a lado.",
      ptPath: "/relatorios/arquitetura-aplicacoes",
      enPath: "/en/relatorios/arquitetura-aplicacoes",
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

const PROGRESS_KEY = "pitstop-progress-arquitetura-aplicacoes";

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
            conteúdo das Aulas 01 a 04
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              guia de estudo · <b>arquitetura de aplicações em 4 etapas</b>
            </p>
            <h1 className="htitle">
              Arquitetura de aplicações
              <br />
              direto do <span className="b">pit lane</span>.
            </h1>
            <p className="narration">
              Este guia mostra, em quatro etapas, como organizar uma aplicação à medida que ela
              cresce. Você estuda o monolito e a arquitetura em camadas, quando e onde cortar o
              sistema em microsserviços, como cada serviço passa a cuidar dos próprios dados (com
              consistência eventual e sagas) e como os serviços conversam, por chamada síncrona, API
              Gateway ou fila, sempre com AWS e Azure lado a lado. Na lente da F1, é a passagem de
              uma garagem em que os mesmos mecânicos fazem tudo para postos especializados (pneus,
              estratégia, unidade de potência), cada um dono da sua função e falando com os outros
              por um canal combinado.
            </p>
            <p className="lead">
              Cada conceito é lido como o pit lane de um GP:{" "}
              <strong>o problema que cada peça resolve</strong>, uma analogia de F1 tecnicamente
              honesta, <strong>AWS e Azure lado a lado</strong>, comandos com a saída esperada e um{" "}
              <strong>mão na massa</strong> por etapa, com aviso de custo sempre que algo é criado
              na nuvem.
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
              headers={["Arquitetura", "Fórmula 1"]}
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
                <b>pitstop.dev</b> · guia Arquitetura de aplicações, etapa por etapa, baseado nas
                Aulas 01 a 04 do módulo (Fase 1).
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
