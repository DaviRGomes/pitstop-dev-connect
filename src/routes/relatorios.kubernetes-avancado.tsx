import { createFileRoute } from "@tanstack/react-router";
import { ANALOGY_NOTES, DE_PARA, LESSONS } from "@/data/kubernetesavancado";
import {
  DeParaDetails,
  GuideProgress,
  GuideRail,
  LessonSection,
  useGuideProgress,
  useScrollSpy,
  useSectionReveal,
} from "@/components/guide/GuideKit";
import { f1Logo } from "@/assets/brand/paths";

export const Route = createFileRoute("/relatorios/kubernetes-avancado")({
  component: Index,
});

const NAV = [
  { id: "inicio", num: "00", title: "Início" },
  ...LESSONS.map((l) => ({ id: l.id, num: l.num, title: l.navTitle })),
];

const PROGRESS_KEY = "pitstop-progress-avancado";

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
  const activeId = useScrollSpy(NAV.map((n) => n.id));

  const doneCount = LESSONS.filter((l) => done[l.id]).length;

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
            conteúdo das aulas 1–9 (Fase 2) + bônus
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              transmissão ao vivo · <b>o gp do kubernetes avançado, etapa por etapa</b>
            </p>
            <h1 className="htitle">
              Kubernetes avançado
              <br />
              direto do <span className="b">paddock</span>.
            </h1>
            <p className="narration">
              De volta à pista, e agora é campeonato de gente grande! Nove etapas da Fase 2: saúde e
              recursos, agendamento fino, rollouts, Helm, Blue/Green, Canary, Karpenter, KEDA e
              segurança, mais um pit stop bônus onde o podinfo da Etapa 09 do módulo básico sobe da
              academia pra equipe principal. Você já sabe pilotar o carro. Aqui a gente afina o
              setup pra vencer o mundial. Farol apagado, o piloto assume.
            </p>
            <p className="lead">
              Este é o guia da <strong>Fase 2</strong>: assume que você já domina o básico (Pods,
              Deployments, Services, kubectl) e sobe o nível pra operar clusters de verdade:{" "}
              <strong>o problema que cada peça resolve</strong>, a analogia de F1 honesta, o YAML
              comentado, os comandos com a saída esperada e um <strong>mão na massa</strong> por
              etapa. Na Etapa 10, tudo isso se junta pra evoluir o exemplo profissional que fechou o
              módulo básico.
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
              headers={["Kubernetes", "Fórmula 1"]}
              mapping={DE_PARA.map((m) => ({ left: m.k8s, right: m.f1 }))}
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
              onToggleDone={() => setDone((d) => ({ ...d, [lesson.id]: !d[lesson.id] }))}
              copy={LESSON_COPY}
            />
          ))}

          <footer>
            <span className="foot-brand">
              <img src={f1Logo} alt="" width={38} height={19} />
              <span>
                <b>pitstop.dev</b> · guia Kubernetes avançado etapa por etapa, baseado nas aulas 1–9
                do módulo DevOps e Arquitetura Cloud (Fase 2, FIAP), com uma etapa bônus de
                aplicação profissional.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
