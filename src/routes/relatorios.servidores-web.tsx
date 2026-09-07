import { createFileRoute } from "@tanstack/react-router";
import { ANALOGY_NOTES, DE_PARA, LESSONS } from "@/data/servidoresweb";
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

export const Route = createFileRoute("/relatorios/servidores-web")({
  component: Index,
});

const NAV = [
  { id: "inicio", num: "00", title: "Início" },
  ...LESSONS.map((l) => ({ id: l.id, num: l.num, title: l.navTitle })),
];

const PROGRESS_KEY = "pitstop-progress-servidores-web";

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
            conteúdo das Aulas 01 a 05
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              transmissão ao vivo · <b>o gp de servidores web, etapa por etapa</b>
            </p>
            <h1 className="htitle">
              Servidores Web narrado
              <br />
              direto do <span className="b">paddock</span>.
            </h1>
            <p className="narration">
              Boa tarde a todos! O motor já está quente, e hoje a disputa é uma só: montar a mureta
              que separa o piloto do caos do mundo lá fora. Quatorze etapas, do papel de um servidor
              web ao balanceamento, Ingress, Service Mesh, alta disponibilidade e defesa da borda.
              Farol apagado, o piloto assume a narrativa.
            </p>
            <p className="lead">
              Cada conceito de servidores web lido como um piloto lê a telemetria:{" "}
              <strong>o problema que cada peça resolve</strong>, a analogia de F1 tecnicamente
              honesta, a configuração comentada linha a linha, os comandos com a saída esperada e um{" "}
              <strong>mão na massa</strong> por etapa.
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
              headers={["Conceito de software", "Fórmula 1"]}
              mapping={DE_PARA.map((m) => ({ left: m.sw, right: m.f1 }))}
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
                <b>pitstop.dev</b> · guia Servidores Web e Balanceamento de Carga, etapa por etapa,
                baseado nas Aulas 01 a 05 do módulo.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
