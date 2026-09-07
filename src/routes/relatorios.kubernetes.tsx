import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Flag } from "lucide-react";
import { ANALOGY_NOTES, DE_PARA, LESSONS, PLATFORMS } from "@/data/kubernetesbasico";
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

export const Route = createFileRoute("/relatorios/kubernetes")({
  component: Index,
});

function PlatformsSection() {
  return (
    <section className="section" id="pratica">
      <p className="eyebrow">
        Etapa 10 <span className="tag">labs online</span>
      </p>
      <h2>Pratique de graça em clusters reais</h2>
      <p className="narration">
        Volta de desaceleração: o motor esfria, mas o campeonato continua, e todo piloto sabe que
        temporada se constrói no treino. Aqui está o calendário de testes.
      </p>
      <p className="lead">
        Pense nisto como a escada de qualquer piloto: simulador público, kart, F4, e só então o
        carro de verdade. Estas plataformas dão terminal com Kubernetes real direto no navegador.
        Comece pelas 100% gratuitas.
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
  { id: "pratica", num: "10", title: "Pratique de graça" },
];

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
  const [done, setDone] = useGuideProgress("pitstop-progress");
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
            conteúdo das aulas 1–8 + bônus
          </>
        }
      />

      <main>
        <div className="wrap">
          <header className="hero" id="inicio">
            <p className="kicker">
              transmissão ao vivo · <b>o gp do kubernetes básico, etapa por etapa</b>
            </p>
            <h1 className="htitle">
              Kubernetes narrado
              <br />
              direto do <span className="b">paddock</span>.
            </h1>
            <p className="narration">
              Boa tarde, Brasil! Boa tarde, paddock! Oito etapas oficiais, da largada (por que esse
              esporte existe) à reta final do autoscaling, mais um pit stop bônus onde tudo isso
              vira um app de produção só, com uma imagem real do Docker Hub. Em jogo: sair daqui
              sabendo montar, operar, curar e escalar um cluster de verdade. O farol vai apagar, e
              quem assume o volante da narrativa é o piloto. Com vocês.
            </p>
            <p className="lead">
              Cada conceito de Kubernetes lido como um piloto lê a telemetria:{" "}
              <strong>o problema que cada peça resolve</strong>, a analogia de F1 tecnicamente
              honesta, o YAML comentado linha a linha, os comandos com a saída esperada e um{" "}
              <strong>mão na massa</strong> por etapa. Na Etapa 09, tudo isso se junta num exemplo
              profissional único. No final, os <strong>sites gratuitos</strong> pra praticar em
              clusters reais no navegador.
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

          <PlatformsSection />

          <footer>
            <span className="foot-brand">
              <img src={f1Logo} alt="" width={38} height={19} />
              <span>
                <b>pitstop.dev</b> · guia Kubernetes etapa por etapa, baseado nas aulas 1–8 (Thiago
                Adriano, FIAP), com uma etapa bônus de aplicação profissional.
              </span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
