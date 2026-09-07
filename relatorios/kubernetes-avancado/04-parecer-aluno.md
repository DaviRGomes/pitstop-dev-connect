# Parecer do aluno — Kubernetes Avançado · Guia Prático (Fase 2) · Edição Transmissão ao Vivo

## Veredito
APROVADO COM RESSALVAS — nota 8.5. O conteúdo técnico é sólido, na ordem certa e quase todo praticável, mas um exercício da Etapa 01 tem um bug que impede o resultado prometido, e em vários pontos o excesso de jargão de F1 e de narração de transmissão obriga a reler o parágrafo pra achar o conceito.

## O que aprendi (teste de recuperação)
Kubernetes tem três sondas de saúde: liveness reinicia o container travado, readiness só o tira do balanceador sem reiniciar, e startup protege apps de boot lento. Requests/limits definem quanto cada container reserva e seu teto (estourar RAM = OOMKill, estourar CPU = throttling), e disso nasce a QoS que decide quem é despejado primeiro. Pra colocar o pod certo no nó certo uso taint (repele) + affinity (atrai) juntos. Atualizo sem downtime com RollingUpdate (maxUnavailable/maxSurge) e reverto instantâneo porque o ReplicaSet antigo fica zerado, não apagado; Helm empacota tudo como função pura (values → YAML), Blue/Green troca 100% num patch do selector e Canary migra o tráfego aos poucos com gate de SLO. Karpenter cria nós sob medida pra pods Pending, KEDA escala por evento até zero, e segurança é SA própria + Role de menor privilégio + tokens curtos (IRSA) + TLS automático via cert-manager, tudo sob Zero Trust.

(Consegui escrever as 5 linhas sem olhar — o objetivo central do relatório foi cumprido.)

## Pontos confusos (por seção)

- [Etapa 01 — Mão na massa] O exercício da liveness usa `kubectl run teste-liveness --restart=Never`. Com `restartPolicy: Never`, o kubelet **não reinicia** o container quando a liveness falha — ele mata o pod e ele vai pra `Failed`/`Error`, e a coluna `RESTARTS` **não sobe**. O texto promete "observe a coluna RESTARTS subindo a cada ~15s", que é justamente o que não acontece. Conserto: trocar por `--restart=Always` (ou criar via Deployment). **Persona: professor** (é erro de correção técnica do exercício, não de analogia). Este é o único ponto que reprovaria o hands-on se eu fosse rodar como está.

- [Etapa 01 — Conceitos/QoS] O texto define Guaranteed como `requests == limits`, mas o YAML de exemplo logo abaixo tem `requests` de CPU e memória e só `limit` de memória (sem limit de CPU) — ou seja, é Burstable. Como aluno, fiquei na dúvida em qual classe o exemplo cai, e o texto não fecha o laço. Conserto: uma frase dizendo "repare: este pod é Burstable porque abrimos mão do limit de CPU de propósito". **Persona: professor.**

- [Etapa 01 — Requests/limits] A analogia "energia de ERS garantida por volta vs. cota / envelope térmico / derate / engine mapping" empilha quatro termos de F1 relativamente avançados num parágrafo só. Entendi requests/limits pela definição técnica, não pela analogia — tive que ignorar o ERS pra não travar. **Persona: piloto** (simplificar: bastava "combustível garantido vs. teto que não pode furar").

- [Etapa 02 — Narração] A chamada de entrada do "PIT STOP CRONOMETRADO" cita "a decisão de Schumacher em Magny-Cours 2004, estratégia de quatro paradas". Essa referência histórica não ilumina taint/affinity (o tema da etapa é reservar box, não número de paradas) — é enfeite que exige F1 avançada e me distraiu do exercício que vinha logo abaixo. **Persona: comentarista** (cortar ou trocar por uma imagem de "box reservado").

- [Etapa 06 — Vocabulário] O bloco "vocabulário que vale conhecer" despeja teste z de proporções, qui-quadrado, Mann-Whitney, SPRT de Wald, M/M/c, Lei de Little e Thompson Sampling em sequência. Para aluno iniciante-intermediário isso é uma parede de teoria; li em diagonal. Não trava a compreensão do canário em si (que está claro antes), mas soterra. Conserto: encolher pra 2-3 termos ou marcar explicitamente como "opcional/aprofundamento". **Persona: professor.**

- [Etapa 05 — Mão na massa] A sequência faz `kubectl label deployment blue env=blue` e **depois** um `kubectl patch` que injeta `app=bg,env=blue` no template do pod. Rotular o Deployment e depois repatchar o template parece redundante e me deixou inseguro sobre qual label importa (a resposta: só a do template, porque o Service seleciona pods). Funciona, mas confunde. Conserto: remover os `kubectl label` no objeto Deployment (só o patch no template importa) ou explicar por que os dois. **Persona: professor.**

- [Geral — Densidade de narração] Cada etapa tem chamada de entrada em caixa-alta, "VOLTA CRONOMETRADA/PIT STOP CRONOMETRADO" antes de cada exercício, e chamada de saída também em caixa-alta. Em blocos como Setor 1 e Setor 9 há três interrupções de narração antes de eu chegar ao conteúdo. Não impede a leitura, mas em maratona cansa e eu comecei a pular os quadros de transmissão. Conserto: reduzir o CAPS LOCK e enxugar uma das chamadas por etapa. **Persona: comentarista.**

## Analogias

- **Pod = carro / Node = box / Cluster = equipe** (quadro de-para) — ajudou muito. É consistente da Etapa 01 à 09 e o texto avisa "Pod é o carro do começo ao fim", o que me deu um chão estável. Melhor decisão do guia.
- **Liveness = chamar pro box / readiness = ceder posição sem parar** — ajudou bastante; a comparação "perde 22s no box vs. só recuar" fixa a diferença que costuma confundir. O caso Antonelli pole→P15 (vivo mas sem ritmo) é a melhor analogia do documento.
- **Taint repele / affinity atrai, precisa dos dois** — ajudou; "credencial pra entrar no box não obriga a entrar; só a ordem manda ir" tornou óbvio por que toleration sozinha não isola. O texto marca honestamente onde a analogia é fiel.
- **maxUnavailable = freio / maxSurge = potência** — ajudou; simples e memorável.
- **Blue/Green = T-car quente / rollback = virar a chave** — ajudou, e o guia é honesto ao marcar onde a analogia PARA (schema do banco "reescreve o traçado da pista"). Esse aviso de limite foi exatamente o que evitou que a analogia me enganasse.
- **Helm = fôrma do carro + folha de setup / `helm template` = simulador** — ajudou; "função pura = mesmo setup, mesmo resultado no simulador" caiu bem.
- **QoS = ordem de quem a equipe sacrifica sob safety car** — meio atrapalhou: exige saber a hierarquia de decisão de uma equipe sob safety car, que não é intuitiva pra fã casual. A definição técnica (BestEffort morre primeiro) foi mais clara que a analogia.
- **Requests/limits = ERS/derate/envelope** — atrapalhou (ver ponto confuso da Etapa 01): F1 avançada demais.

## Exercícios

- **Etapa 01 (liveness)** — NÃO consegui como está: `--restart=Never` não produz os restarts prometidos. Precisa de conserto antes de rodar (ver ponto confuso).
- **Etapa 02 (taint repele pod)** — consegui seguir. Passos claros, sei o que rodar e que verei `Pending` + `had untolerated taint`, e a limpeza com o `-` no fim está explicada. Executável em minikube/kind de 1 nó.
- **Etapa 03 (rollout + undo)** — consegui. Muito bom ver os dois ReplicaSets e entender que o antigo fica zerado. Comandos autoexplicativos.
- **Etapa 04 (helm template)** — consegui, e é o exercício mais limpo: não toca cluster nenhum, só `helm create` + `helm template --set`. Sei exatamente o que esperar (replicas 1 → 4).
- **Etapa 05 (Blue/Green)** — consegui, com a ressalva de que os `kubectl label` extras me confundiram (ver acima). O resultado (endpoints mudando de IP) é observável.
- **Etapa 06 (canário por réplicas)** — consegui. Boa a honestidade de dizer que só dá frações grosseiras e que por isso service mesh é superior.
- **Etapa 07 (Karpenter — pod Pending)** — consegui. Inteligente reproduzir só o *gatilho* (pod Pending por CPU) em qualquer cluster, já que Karpenter exige nuvem. Sei que verei `FailedScheduling / Insufficient cpu`.
- **Etapa 08 (KEDA cron scale-to-zero)** — consegui, mas exige instalar o KEDA via Helm primeiro (o pré-requisito está no comando, ok). Único exercício com dependência pesada; poderia avisar que a janela cron faz esperar até o minuto 0 da hora pra ver o efeito.
- **Etapa 09 (auth can-i)** — consegui. Rápido, sem nuvem, e o contraste yes/no prova o menor privilégio de forma convincente.

---

## Resumo dos consertos por persona

**Professor (didática/técnica):**
- Etapa 01: corrigir o exercício de liveness — trocar `--restart=Never` por `--restart=Always`, senão RESTARTS não sobe (bug que quebra o hands-on).
- Etapa 01: fechar o laço da QoS do YAML de exemplo (é Burstable, não Guaranteed).
- Etapa 05: remover/explicar os `kubectl label` redundantes no objeto Deployment.
- Etapa 06: encolher ou marcar como "opcional" o bloco de estatística/teoria de filas.

**Piloto (analogia):**
- Etapa 01: simplificar a analogia de requests/limits (ERS/derate/envelope é F1 avançada demais); "combustível garantido vs. teto" basta.
- Etapa 01: suavizar a analogia de QoS (hierarquia de sacrifício sob safety car não é intuitiva).

**Comentarista (narração):**
- Etapa 02: cortar/trocar a referência a Schumacher em Magny-Cours 2004, que não ilumina taint/affinity.
- Geral: reduzir o CAPS LOCK e enxugar para uma chamada de transmissão por etapa; três interrupções antes do conteúdo cansam na maratona.
