import { createFileRoute } from "@tanstack/react-router";
import { guardDraft } from "@/lib/drafts";
import { ANALOGY_NOTES, DE_PARA, LESSONS } from "@/data/awsazure";
import {
  DeParaDetails,
  GuideProgress,
  GuideRail,
  LessonSection,
} from "@/components/guide/GuideKit";
import { useGuideProgress, useScrollSpy, useSectionReveal } from "@/components/guide/hooks";
import { f1Logo } from "@/assets/brand/paths";
import { reportHead } from "@/lib/seo";

export const Route = createFileRoute("/relatorios/aws-azure")({
  beforeLoad: guardDraft("aws-azure"),
  head: () =>
    reportHead({
      locale: "pt",
      title: "AWS e Azure lado a lado: do IAM ao Route 53 | pitstop.dev",
      description:
        "Guia imersivo de AWS e Azure lado a lado: IAM e Entra ID, VPC e VNet, VMs, containers, bancos, serverless, monitoramento, CDN, segredos, DNS e certificações.",
      ptPath: "/relatorios/aws-azure",
      enPath: "/en/relatorios/aws-azure",
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

const PROGRESS_KEY = "pitstop-progress-aws-azure";

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
            conteúdo das Aulas 01 a 11
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              guia de estudo · <b>aws e azure em 11 etapas</b>
            </p>
            <h1 className="htitle">
              AWS e Azure
              <br />
              direto do <span className="b">pit lane</span>.
            </h1>
            <p className="narration">
              Este guia percorre, em onze etapas, os serviços essenciais das duas maiores nuvens,
              sempre lado a lado. Você começa com uma introdução à nuvem e estuda identidade e
              acesso, redes, máquinas virtuais, containers, bancos de dados, serverless,
              monitoramento e logs, entrega de conteúdo e armazenamento de objetos, segredos, WAF e
              DNS, terminando com o caminho das certificações. Na lente da F1, AWS e Azure são dois
              circuitos com instalações próprias: o procedimento da equipe é o mesmo nos dois, e o
              que muda é o nome de cada instalação.
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
              headers={["AWS + Azure", "Fórmula 1"]}
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
                <b>pitstop.dev</b> · guia AWS e Azure, etapa por etapa, baseado nas Aulas 01 a 11 do
                módulo (Fase 1).
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
