import { createFileRoute } from "@tanstack/react-router";
import { ANALOGY_NOTES, DE_PARA, LESSONS } from "@/data/arquiteturacloud";
import {
  DeParaDetails,
  GuideProgress,
  GuideRail,
  LessonSection,
} from "@/components/guide/GuideKit";
import { useGuideProgress, useScrollSpy, useSectionReveal } from "@/components/guide/hooks";
import { f1Logo } from "@/assets/brand/paths";
import { reportHead } from "@/lib/seo";

export const Route = createFileRoute("/relatorios/arquitetura-cloud")({
  head: () =>
    reportHead({
      locale: "pt",
      title: "Arquitetura Cloud: da garagem própria ao circuito global | pitstop.dev",
      description:
        "Guia imersivo de arquitetura cloud: modelos de serviço, regiões e zonas, provedores, VPC e VNet, segurança, custos e FinOps, com AWS e Azure lado a lado.",
      ptPath: "/relatorios/arquitetura-cloud",
      enPath: "/en/relatorios/arquitetura-cloud",
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

const PROGRESS_KEY = "pitstop-progress-arquitetura-cloud";

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
              guia de estudo · <b>arquitetura cloud em 6 etapas</b>
            </p>
            <h1 className="htitle">
              Arquitetura Cloud
              <br />
              direto do <span className="b">pit lane</span>.
            </h1>
            <p className="narration">
              Este guia apresenta, em seis etapas, as bases para projetar na nuvem. Você estuda o
              que é computação em nuvem e seus modelos de implantação, os modelos de serviço (IaaS,
              PaaS, SaaS e FaaS), regiões e zonas de disponibilidade, como comparar provedores, os
              elementos de arquitetura (armazenamento, bancos, balanceadores, CDN e redes) e, por
              fim, segurança e custos, sempre com AWS e Azure lado a lado. Na lente da F1, o
              provedor é o circuito que oferece garagem, energia e cronometragem; a equipe escolhe o
              que usar, monta a sua área reservada e opera sem estourar o teto de gastos.
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
              headers={["Cloud", "Fórmula 1"]}
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
                <b>pitstop.dev</b> · guia Arquitetura Cloud, etapa por etapa, baseado nas Aulas 01 a
                06 do módulo (Fase 1).
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
