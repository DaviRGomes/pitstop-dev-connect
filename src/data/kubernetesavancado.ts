// Conteúdo das 9 aulas do módulo DevOps e Arquitetura Cloud — Fase 2 (FIAP),
// tematizado com Fórmula 1 pelo pipeline /otimizar-relatorio (relatorios/kubernetes-avancado/final.md)

export type Example = {
  label: string;
  lang: "yaml" | "sh";
  code: string;
  note?: string;
};

export type Command = { cmd: string; note?: string };

export type Point = { t: string; d: string; color?: string };

export type Lesson = {
  id: string;
  num: string;
  navTitle: string;
  tag: string;
  title: string;
  narration: string;
  lead: string;
  concept: string[];
  points: Point[];
  pointsTitle: string;
  examples: Example[];
  examplesTitle: string;
  commands: Command[];
  handsOnIntro?: string;
  handsOn: string[];
  tip: string;
  takeaway: string;
  outro: string;
};

export type Mapping = { k8s: string; f1: string };

// O quadro de-para do piloto — o mapa que vale do começo ao fim: Pod é o carro da Etapa 01 à 09
export const DE_PARA: Mapping[] = [
  {
    k8s: "Container",
    f1: "Componente do carro (a PU híbrida, a ERS, a caixa de câmbio), a peça que faz o trabalho",
  },
  {
    k8s: "Pod",
    f1: "O carro completo, menor unidade que vai pra pista; agrupa componentes que dividem o mesmo chassi e a mesma telemetria",
  },
  {
    k8s: "Node (nó)",
    f1: "O box/garagem na pit lane: hospeda vários carros e tem recurso finito (energia, ar comprimido, espaço)",
  },
  { k8s: "Cluster", f1: "A equipe inteira: todos os boxes + muro + operação" },
  {
    k8s: "kubelet",
    f1: "O chefe de mecânicos daquele box: vigia os carros ali, troca componente, chama pro reparo",
  },
  { k8s: "Deployment", f1: "A ficha de operação que garante N carros idênticos prontos no grid" },
  { k8s: "ReplicaSet", f1: "O conjunto de carros de uma mesma especificação/versão de setup" },
  { k8s: "Réplica", f1: "Cada carro idêntico da equipe no grid" },
  { k8s: "Service", f1: "O muro/rádio com endereço fixo que direciona o trabalho pro carro certo" },
  { k8s: "Endpoints", f1: "A lista de carros no momento aptos a receber trabalho" },
  {
    k8s: "Load balancing",
    f1: "O engenheiro de estratégia distribuindo stints/voltas entre os carros",
  },
  {
    k8s: "Liveness probe",
    f1: 'Telemetria "o carro travou?" → se sim, chama pro box e reinicia o componente',
  },
  {
    k8s: "Readiness probe",
    f1: 'Telemetria "o carro está em ritmo?" → tira/põe no pelotão, sem chamar pro box',
  },
  {
    k8s: "Startup probe",
    f1: '"Terminou o out-lap de aquecimento?" (pneu e freio na janela de temperatura)',
  },
  {
    k8s: "Requests / limits",
    f1: "Energia garantida por volta vs. teto que não pode furar (envelope de ERS / cota)",
  },
  {
    k8s: "OOMKill",
    f1: "Componente estourou o envelope e queimou: falha catastrófica, carro fora",
  },
  {
    k8s: "CPU throttling",
    f1: "Derate / engine mapping segurando potência pra ficar dentro da cota",
  },
  { k8s: "Classes de QoS", f1: "A ordem de quem a equipe sacrifica sob safety car / contenção" },
  {
    k8s: "Taint",
    f1: 'Placa no box: "reservado, só carro autorizado" (box de pneu de chuva, box de GPU)',
  },
  { k8s: "Toleration", f1: "A credencial do carro que aceita entrar naquele box marcado" },
  { k8s: "Node affinity", f1: 'Ordem de estratégia: "esse carro TEM que ir pra esse box/setup"' },
  {
    k8s: "Pod anti-affinity",
    f1: "Nunca colocar os dois carros da equipe no mesmo box (risco duplo)",
  },
  { k8s: "Topology Spread", f1: "Espalhar os carros por boxes/zonas com garantia numérica" },
  {
    k8s: "Eviction",
    f1: "O chefe de mecânicos sacrificando um carro pra salvar o box quando falta recurso",
  },
  {
    k8s: "PriorityClass",
    f1: "Carro do líder do campeonato vs. carro de teste: quem se salva primeiro",
  },
  {
    k8s: "RollingUpdate",
    f1: "Trocar o setup carro a carro ao longo de pit stops, sem esvaziar a pista",
  },
  { k8s: "maxUnavailable", f1: "O freio: quantos carros posso ter no box ao mesmo tempo" },
  { k8s: "maxSurge", f1: "A potência: quantos carros extras (T-car) monto pra acelerar a troca" },
  { k8s: "Recreate", f1: "Chamar todos ao box de uma vez: para tudo, mas nunca mistura versões" },
  { k8s: "rollout undo", f1: "Voltar pro setup salvo da classificação (baseline de parc fermé)" },
  { k8s: "Helm Chart", f1: "A fôrma de montagem do carro: mesma base, ajuste por circuito" },
  { k8s: "values.yaml", f1: "A folha de setup por circuito (asa, pressão de pneu, mapa de motor)" },
  {
    k8s: "helm template (função pura)",
    f1: "O simulador: mesma entrada → mesma saída, roda antes de ir pra pista",
  },
  {
    k8s: "Blue/Green",
    f1: "O T-car já montado e aquecido nos bastidores; promover = trocar de carro",
  },
  {
    k8s: "Canary",
    f1: "Mandar UM carro testar o upgrade numa fatia da corrida antes de aplicar nos dois",
  },
  {
    k8s: "Peso de tráfego (service mesh)",
    f1: "O engenheiro dosando a fração exata, independente do nº de carros",
  },
  { k8s: "SLO gate", f1: "O limite de delta/temperatura que aborta o teste na hora" },
  { k8s: "Karpenter", f1: "O gerente de logística montando box sob medida just-in-time" },
  { k8s: "Cluster Autoscaler", f1: "Boxes de tamanho fixo, pré-reservados por contrato" },
  {
    k8s: "Spot instance",
    f1: "Recurso barato que pode ser requisitado de volta a qualquer momento",
  },
  {
    k8s: "PodDisruptionBudget",
    f1: "Regra: nunca tirar réplicas demais juntas (nunca os dois carros no box)",
  },
  {
    k8s: "KEDA / scale-to-zero",
    f1: "Abrir mecânicos de pit conforme a fila; zero quando não há carro chegando",
  },
  { k8s: "ServiceAccount", f1: "O crachá de acesso de cada membro da equipe" },
  { k8s: "RBAC (Role/RoleBinding)", f1: "O que aquele crachá abre, e só isso" },
  {
    k8s: "IRSA / Workload Identity",
    f1: "Credencial temporária pra entrar no motorhome do fornecedor, sem chave-mestra",
  },
  { k8s: "cert-manager / TLS", f1: "Lacres da FIA que expiram e se renovam sozinhos" },
  { k8s: "Zero Trust", f1: "O regulamento FIA: ninguém passa sem credencial verificada" },
];

// Notas do piloto: onde as analogias quebram (analogia forçada é pior que analogia nenhuma)
export const ANALOGY_NOTES: string[] = [
  'Blue/Green (Etapa 05): trocar de carro em pista é limpo, mas o software pode "reescrever o traçado da pista", ou seja, o schema do banco. Quando a versão nova muda o esquema de forma incompatível, voltar pro carro antigo não salva: a pista já mudou embaixo dele. Por isso a migração retrocompatível (compatibilidade dupla temporária) vem ANTES da virada de chave: o T-car não cobre esse caso sozinho.',
  'Réplicas e falha compartilhada (Etapas 01 e 02): dois carros no grid multiplicam disponibilidade SÓ se não dependerem da mesma peça de infra. Liveness amarrada ao mesmo banco, ou os dois pods no mesmo nó, quebram a independência que a analogia dos "dois carros" pressupõe.',
];

export const LESSONS: Lesson[] = [
  {
    id: "m1",
    num: "01",
    navTitle: "Saúde & recursos",
    tag: "telemetria de bordo",
    title: "Saúde da aplicação e gerenciamento de recursos",
    narration:
      "Senhoras e senhores, o pelotão sai da garagem pra primeira volta e a pergunta que abre TODA transmissão é a mais simples e a mais brutal: o carro está inteiro? Está em ritmo? Antes de qualquer estratégia mirabolante, é a telemetria que manda. Prende o cinto, porque a Etapa 01 é onde a gente aprende a LER o carro.",
    lead: 'Imagine seu e-commerce numa Black Friday. Um dos pods da API entrou em deadlock: o processo continua de pé, o container não morreu, mas ele responde HTTP 500 para todo cliente que chega. O Kubernetes, sozinho, só sabe uma coisa: "o processo está vivo". Ele não reinicia nada, e você perde vendas por horas até alguém perceber no gráfico. No pod ao lado, um vazamento de memória vai comendo RAM até estourar o nó inteiro e derrubar os vizinhos saudáveis junto.',
    concept: [
      'Foi exatamente o que rolou com o Antonelli em Silverstone: largou na pole (P1) e cruzou em P15. O carro estava vivo (motor rodando, dando voltas, terminou a corrida), mas não estava em ritmo. Processo de pé, resposta 500. Você precisa de duas telemetrias diferentes: uma que grita "o carro travou" e manda pro box trocar componente (liveness), e outra que diz "o carro está de pé mas sem pace, tira ele da briga até resgatar" sem chamar pro reparo (readiness). E precisa definir de quanta energia de ERS e cota cada componente tem direito pra ninguém roubar o envelope do outro (requests/limits).',
      "As três probes são a telemetria que o muro lê no fim de cada setor. A liveness reinicia o container quando falha N vezes (autocura); a readiness só tira o pod do balanceador, sem reiniciar; a startup protege apps de boot lento, suspendendo as outras duas enquanto o app não sobe. Confundir liveness com readiness causa reinícios em cascata. É a diferença entre chamar o carro pro box (perde 22s) e só mandar ele ceder posição e recuperar.",
      "Requests e limits são o contrato de recursos. requests é o que o container reserva, o piso garantido que o scheduler usa pra decidir em qual nó o pod cabe (a energia de ERS garantida por volta). limits é o teto que ele não pode passar: estourar limite de memória = OOMKill (o kernel mata o container); estourar limite de CPU = throttling (o kernel atrasa o processo pra mantê-lo na cota). Furar o envelope térmico da PU queima o componente; bater no teto de energia é o derate que segura a potência.",
      "Da combinação de requests e limits nasce a classe de QoS do pod: a ordem de sacrifício quando o box fica sem recurso. Guaranteed (requests == limits em todos os containers) são os últimos sacrificados (o carro do líder); Burstable (requests < limits) usam folga ociosa mas cedem sob contenção; BestEffort (sem requests nem limits) são os primeiros despejados (o carro de teste que ninguém protege).",
      'Um detalhe contraintuitivo (caso real da Buffer): colocar limite de CPU pode piorar a latência. O algoritmo de quota do CFS pode throttlar um pod mesmo com uso médio baixo: pequenos picos consomem a cota de 100ms e o processo congela até o próximo período. A Buffer removeu os limits de CPU de serviços sensíveis a latência e viu o p99 cair de 5 a 10x. Em multi-tenant você quer limits pra isolamento; em serviço latency-sensitive, às vezes menos é mais. E réplicas em paralelo multiplicam disponibilidade (A = MTBF / (MTBF + MTTR)): 2 pods a 99% chegam a ~99,99%, porque o Service age como um "OU lógico": basta um pod Ready. A equipe com dois carros: se um abandona, o outro pontua.',
    ],
    pointsTitle: "Os conceitos-chave desta etapa",
    points: [
      {
        t: "Liveness probe",
        d: '"Você travou?" Falhou N vezes seguidas → o kubelet reinicia o container. É a autocura; use pra deadlock, nunca pra lentidão passageira (senão vira ciclo de reinícios). Na pista: o DNF irrecuperável, tira da pista.',
        color: "ember",
      },
      {
        t: "Readiness probe",
        d: '"Está pronto pra tráfego?" Falhou → o pod sai do balanceador (dos endpoints), SEM reiniciar. Volta sozinho quando a dependência se recupera. Na pista: o carro cede posição e recupera, sem ir ao box.',
        color: "signal",
      },
      {
        t: "Startup probe",
        d: '"Já terminou de subir?" Enquanto não passa, suspende liveness e readiness, protegendo apps de boot lento de morrer durante a inicialização. Na pista: o out-lap de aquecimento; ninguém cobra pace com pneu frio.',
        color: "blue",
      },
      {
        t: "Requests e limits",
        d: "requests = piso reservado (o scheduler usa pra alocar); limits = teto que não pode passar. Estourar memória = OOMKill; estourar CPU = throttling. Energia de ERS garantida vs. cota que não pode furar.",
        color: "violet",
      },
      {
        t: "Classes de QoS",
        d: "Guaranteed (requests==limits) é o último sacrificado; Burstable (requests<limits) cede sob contenção; BestEffort (sem nada) é o primeiro despejado. A ordem de sacrifício sob safety car.",
        color: "teal",
      },
    ],
    examplesTitle: "YAML e comandos na prática",
    examples: [
      {
        label: "Deployment com as 3 probes + recursos",
        lang: "yaml",
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector: { matchLabels: { app: api } }
  template:
    metadata: { labels: { app: api } }
    spec:
      containers:
        - name: api
          image: myregistry/api:1.0.0
          ports: [ { containerPort: 8080 } ]
          startupProbe:            # 1) protege o boot lento
            httpGet: { path: /healthz, port: 8080 }
            failureThreshold: 30   #    até 30 x 10s = 5min pra subir
            periodSeconds: 10      #    checa a cada 10s
          livenessProbe:           # 2) travou? reinicia o container
            httpGet: { path: /healthz, port: 8080 }
            periodSeconds: 10
            failureThreshold: 3    #    3 falhas seguidas -> restart
          readinessProbe:          # 3) pronto? entra/sai do balanceador
            httpGet: { path: /ready, port: 8080 }
            periodSeconds: 5
          resources:
            requests: { cpu: 100m, memory: 128Mi }  # piso garantido (scheduling)
            limits:   { memory: 256Mi }              # teto de RAM; SEM limit de CPU
                                                     # (evita throttling do CFS)`,
        note: "Este Deployment é Burstable (tem requests de CPU/memória, mas limit só de memória). Pra virar Guaranteed, requests teria que ser igual a limits em todos os recursos de todos os containers.",
      },
      {
        label: "liveness que reinicia um travado",
        lang: "sh",
        code: `# 1) Cria um pod cuja liveness aponta pra uma porta que NÃO existe -> vai falhar sempre
#    IMPORTANTE: --restart=Always (padrão de Deployment). Com --restart=Never o
#    kubelet NÃO reinicia o container ao falhar a liveness (o pod só vai pra Failed).
kubectl run teste-liveness --image=nginx --restart=Always \\
  --overrides='{"spec":{"containers":[{"name":"teste-liveness","image":"nginx","livenessProbe":{"httpGet":{"path":"/","port":9999},"periodSeconds":5,"failureThreshold":2}}]}}'

# 2) Observe a coluna RESTARTS subindo a cada ~15s
kubectl get pod teste-liveness -w

# 3) Confirme o motivo nos eventos
kubectl describe pod teste-liveness | grep -i liveness`,
        note: 'A coluna RESTARTS aumenta sozinha e o describe mostra "Liveness probe failed". Isso é a autocura em ação: o carro chamado pro box automaticamente porque a telemetria acusou travamento. Depois: kubectl delete pod teste-liveness.',
      },
    ],
    commands: [
      {
        cmd: "kubectl describe pod <pod>",
        note: "eventos de probe, OOMKill, reinícios (Liveness probe failed, OOMKilled)",
      },
      {
        cmd: "kubectl top pod / kubectl top node",
        note: "uso real de CPU/memória vs. requests/limits (precisa do metrics-server)",
      },
      {
        cmd: `kubectl get pod <pod> -o jsonpath='{.status.qosClass}'`,
        note: "mostra a classe de QoS do pod",
      },
    ],
    handsOnIntro:
      "Prove na prática que a liveness reinicia um container travado, a sua primeira volta rápida do fim de semana:",
    handsOn: [
      "Crie um pod cuja liveness aponta pra uma porta que NÃO existe (porta 9999). Ele vai falhar sempre. Use --restart=Always (com --restart=Never o kubelet não reinicia ao falhar a liveness).",
      "Rode kubectl get pod teste-liveness -w e observe a coluna RESTARTS subindo a cada ~15s.",
      'Confirme o motivo: kubectl describe pod teste-liveness | grep -i liveness, e veja "Liveness probe failed".',
      "Isso é a autocura: o carro chamado pro box automaticamente porque a telemetria acusou travamento. Limpe com kubectl delete pod teste-liveness.",
    ],
    tip: "Não coloque checagem de banco de dados na liveness probe. Se o banco cair, todas as réplicas falham a liveness ao mesmo tempo, reiniciam juntas e você tem falha em cascata. Cheque dependências na startup (pra não subir sem elas) e degrade graciosamente. É como amarrar a liveness dos dois carros à mesma peça de infra: se aquilo falha, os dois entram no box juntos e você fica sem ninguém na pista.",
    takeaway:
      "Liveness reinicia, readiness só tira do tráfego, e todo pod merece pelo menos requests, porque pod sem request é BestEffort e o primeiro a ser despejado. Liveness é chamar pro box, readiness é ceder posição e recuperar; carro sem energia reservada é o primeiro sacrificado sob safety car.",
    outro:
      "SETOR 1 NO VERDE! Cruzamos o primeiro parcial e o carro está inteiro, telemetria limpa, recursos sob controle. Que largada! Mas agora o traçado se fecha: vem o complexo técnico onde a gente decide EM QUAL box cada carro entra. A estratégia entra em cena. Segura firme que a Etapa 02 é pura curva de precisão.",
  },

  {
    id: "m2",
    num: "02",
    navTitle: "Agendamento",
    tag: "complexo técnico da estratégia",
    title: "Agendamento avançado e comportamento de nós",
    narration:
      "A pista agora exige cabeça fria. Não basta ter carro rápido: é preciso pôr o carro CERTO no box CERTO e saber quem a equipe sacrifica quando o recurso aperta. É aqui que o engenheiro de estratégia ganha ou perde o domingo. Rádio ligado com o muro!",
    lead: "Você tem um cluster misto: alguns nós têm GPU (caros, para treinar modelos), a maioria é comum. Por padrão o scheduler joga o pod em qualquer nó onde ele caiba, então um pod qualquer pode ocupar o nó de GPU e travar o time de ML, enquanto um job de treino pode cair num nó comum sem GPU e nunca funcionar. Pior: quando um nó fica sem memória, quem o Kubernetes mata primeiro? Se for o pod errado, seu serviço crítico vai junto.",
    concept: [
      'Pense na pit lane. Tem box comum e tem o box especializado: o que tem a manta térmica pros pneus de chuva, o rig de calibração de GPU. Taints são a placa "box reservado, só entra carro autorizado" (repele quem não tem credencial). Affinity é a ordem de estratégia no rádio: "leva esse carro pro box da GPU" (atrai). E eviction é o chefe de mecânicos que, quando falta energia no box, começa a sacrificar o carro de teste antes de mexer no carro do líder do campeonato.',
      'Taints e Tolerations repelem. Um taint é uma marca no nó ("não coloque pods aqui a menos que tolerem X"); a toleration é a marca no pod ("eu sei lidar com X, posso ir"). Os efeitos: NoSchedule (não agenda não-tolerantes, os que já rodam ficam), PreferNoSchedule (evita, mas não é absoluto) e NoExecute (barra novos e expulsa os pods sem toleration que já estavam lá; útil pra esvaziar um nó pra manutenção). Ponto crucial: taint só repele, não atrai. Um pod que tolera o nó de GPU pode acabar num nó comum. Pra garantir que ele vá só pra GPU, combine com affinity.',
      'Node Affinity é a contraparte positiva ("quero ir pra nós com o label X"): required (hard: sem o label, não agenda) vs. preferred (soft, com peso; se não achar, agenda em outro lugar). Já Pod Affinity/Anti-Affinity relaciona pods entre si: affinity aproxima ("coloque o cache perto do front-end"); anti-affinity separa ("não coloque duas réplicas do banco no mesmo nó/zona"), nunca os dois carros no mesmo box. Inter-pod affinity é caro no scheduler acima de centenas de nós; pra espalhamento com garantia numérica, prefira Topology Spread Constraints (maxSkew), que escala melhor.',
      "Eviction sob pressão é a autoproteção do nó. Quando falta memória, disco ou PIDs, o kubelet primeiro tenta limpar (containers mortos, imagens não usadas); se não resolve, despeja pods nesta ordem: primeiro os que excedem suas requests (BestEffort e Burstable estourados), depois por PriorityClass, por último os Guaranteed. Detalhes que salvam: eviction por pressão de nó ignora o PodDisruptionBudget (é emergência); eviction ≠ OOMKill (OOMKill é o cgroup matando um container que passou do limit; eviction é o kubelet retirando pods pra salvar o nó inteiro). Alocar pods com múltiplas restrições é bin packing, NP-difícil. O scheduler usa heurística gulosa (filtra nós → pontua → escolhe): rápida, nunca ótima.",
    ],
    pointsTitle: "Os conceitos-chave desta etapa",
    points: [
      {
        t: "Taints e Tolerations",
        d: 'Taint é a marca no nó ("não coloque pods aqui a menos que tolerem X"); toleration é a marca no pod ("eu lido com X, posso ir"). A placa no box e o crachá do carro. Só repele, não atrai.',
        color: "ember",
      },
      {
        t: "Efeitos do taint",
        d: "NoSchedule (não agenda não-tolerantes), PreferNoSchedule (evita, não é absoluto) e NoExecute (barra novos E expulsa os sem toleration que já estavam; esvazia o nó pra manutenção).",
        color: "signal",
      },
      {
        t: "Node Affinity",
        d: 'A contraparte positiva ("quero ir pra nós com o label X"). required (hard: sem o label, não agenda) vs. preferred (soft, com peso). Só a affinity força o carro pro box certo.',
        color: "blue",
      },
      {
        t: "Pod (anti-)affinity e Topology Spread",
        d: 'Anti-affinity separa réplicas ("nunca os dois carros no mesmo box"); é caro no scheduler acima de centenas de nós; pra espalhar com garantia numérica, prefira Topology Spread (maxSkew).',
        color: "violet",
      },
      {
        t: "Eviction sob pressão",
        d: "Sem memória/disco/PIDs, o kubelet despeja pods: primeiro os que excedem requests, depois por PriorityClass, por último os Guaranteed. Ignora o PodDisruptionBudget (emergência). ≠ OOMKill (cgroup mata um container).",
        color: "teal",
      },
    ],
    examplesTitle: "YAML e comandos na prática",
    examples: [
      {
        label: "Pod de ML que exige nó com GPU",
        lang: "yaml",
        code: `# 1) Marca o nó de GPU (uma vez, via kubectl):
#    kubectl taint nodes gpu-node-1 nvidia.com/gpu=true:NoSchedule
apiVersion: v1
kind: Pod
metadata: { name: treino-ml }
spec:
  tolerations:                     # PARTE 1: tolera o taint da GPU (permite entrar)
    - key: "nvidia.com/gpu"
      operator: "Equal"
      value: "true"
      effect: "NoSchedule"
  affinity:
    nodeAffinity:                  # PARTE 2: E exige ir pra um nó com GPU (força ir)
      requiredDuringSchedulingIgnoredDuringExecution:   # hard: sem label, não agenda
        nodeSelectorTerms:
          - matchExpressions:
              - key: "accelerator"
                operator: In
                values: ["nvidia-gpu"]
  containers:
    - name: treino
      image: myregistry/treino:1.0
      resources:
        limits: { nvidia.com/gpu: 1 }   # pede 1 GPU (recurso estendido)`,
        note: "Só a toleration não bastaria (o pod poderia cair num nó comum). É a combinação toleration + nodeAffinity que garante isolamento forte: credencial pra entrar no box de chuva MAIS a ordem de estratégia mandando ir pra lá.",
      },
      {
        label: "taint repelindo um pod",
        lang: "sh",
        code: `# 1) Descubra o nome do nó
kubectl get nodes

# 2) Taint o nó: nada sem toleration pode ser agendado
kubectl taint nodes <NOME_DO_NO> demo=sim:NoSchedule

# 3) Tente subir um pod comum (sem toleration)
kubectl run repelido --image=nginx

# 4) Ele fica Pending; veja o motivo
kubectl get pod repelido           # STATUS = Pending
kubectl describe pod repelido | grep -A2 Events   # "had untolerated taint"

# 5) Limpe: remove o taint (note o "-" no fim) e o pod
kubectl taint nodes <NOME_DO_NO> demo=sim:NoSchedule-
kubectl delete pod repelido`,
        note: 'Enquanto o taint existe, o pod fica Pending com a mensagem "had untolerated taint": carro sem credencial barrado na entrada do box. Ao remover o taint, ele agenda sozinho.',
      },
    ],
    commands: [
      {
        cmd: "kubectl taint nodes <nó> chave=valor:NoSchedule",
        note: "aplica taint (adicione - no fim pra remover)",
      },
      { cmd: "kubectl label nodes <nó> accelerator=nvidia-gpu", note: "rotula o nó pra affinity" },
      {
        cmd: "kubectl describe node <nó>",
        note: "mostra taints, labels, pods e pressão de recursos",
      },
      {
        cmd: "kubectl get events --field-selector reason=Evicted",
        note: "lista despejos recentes",
      },
    ],
    handsOnIntro:
      "Veja o taint repelindo um pod em tempo real (funciona em minikube/kind de 1 nó):",
    handsOn: [
      "Descubra o nome do nó: kubectl get nodes.",
      "Aplique o taint: kubectl taint nodes <NOME_DO_NO> demo=sim:NoSchedule. Nada sem toleration pode ser agendado.",
      "Suba um pod comum sem toleration: kubectl run repelido --image=nginx.",
      'Ele fica Pending; veja o motivo: kubectl describe pod repelido | grep -A2 Events, que mostra "had untolerated taint".',
      'Limpe: remova o taint (note o "-" no fim) com kubectl taint nodes <NOME_DO_NO> demo=sim:NoSchedule- e delete o pod.',
    ],
    tip: 'Monitore uso de disco/memória dos nós e alerte em 85%, antes dos ~95% que disparam eviction. Junto com rotação de logs, isso evita o "eviction storm". Prefira reagir manualmente (drenar o nó com kubectl drain) a deixar o kubelet despejar em pânico. É a diferença entre chamar o carro pro box na sua janela planejada e ser forçado a parar sob safety car junto com todo mundo.',
    takeaway:
      "Taint repele, affinity atrai. Pra reservar um nó de verdade, você precisa dos dois juntos. Credencial de box + ordem de estratégia: um sem o outro não garante que o carro certo vá pro box certo.",
    outro:
      "SETOR 2 COMPLETO, e que aula de estratégia! Você colocou o carro certo no box certo e já sabe quem a equipe sacrifica sob pressão. Mas agora vem a parte que faz o coração da equipe de pit bater forte: a corrida está em andamento e você PRECISA atualizar o carro sem tirar ninguém da briga. Bem-vindo à arte do pit stop. Etapa 03, LÁ VAMOS NÓS!",
  },

  {
    id: "m3",
    num: "03",
    navTitle: "Rollouts",
    tag: "a reta de boxes",
    title: "Estratégias de atualização e rollouts",
    narration:
      "Sexta-feira, produção rodando, e você precisa subir a v2 sem que o público perceba. Este é o setor dos nervos de aço: um pit stop mal calculado joga a liderança fora. Aqui a gente aprende a trocar tudo com o carro em movimento. RESPIRA e vem comigo.",
    lead: "Sexta-feira, 16h. Você precisa subir a v2 da API. Se derrubar tudo de uma vez pra subir a nova, o serviço fica fora do ar no meio do expediente. Se subir errado e não tiver como voltar rápido, o fim de semana vira plantão. Pior ainda: se a v2 for incompatível com a v1 (por causa de uma migração de banco), deixar as duas rodando ao mesmo tempo corrompe dados.",
    concept: [
      "É o dilema do pit stop numa corrida longa. RollingUpdate é trocar o setup dos carros um pit stop de cada vez, com o resto da equipe ainda pontuando na pista (a operação nunca para). Recreate é a bandeira vermelha: chama todos ao box de uma vez, para tudo, mas garante que nenhum carro roda com meia-versão de peça: nunca há mistura de spec velha e nova em pista ao mesmo tempo.",
      "RollingUpdate (padrão) dá zero downtime: substitui os pods aos poucos, criando um novo ReplicaSet e reduzindo o antigo proporcionalmente. Dois parâmetros controlam o ritmo. maxUnavailable é o freio: quantos pods podem ficar indisponíveis durante a troca (padrão 25%), garantindo o piso de disponibilidade. maxSurge é a potência: quantos pods a mais que o desejado podem existir temporariamente (padrão 25%), os T-cars que aceleram a rodada de trocas. Com N réplicas e os padrões, durante o rollout você tem no mínimo 75% disponíveis e no máximo 125% rodando. Não é permitido maxUnavailable e maxSurge ambos em zero (senão a fila de troca trava).",
      "Recreate garante consistência total, com downtime: derruba tudo da v1 antes de subir a v2. Garante que as duas versões nunca coexistem, necessário quando v1 e v2 são incompatíveis (migração de banco que quebra a versão antiga). O trade-off do tuning: maxUnavailable alto acelera mas comprime a capacidade (a latência explode); maxSurge alto acelera mas dobra pods → dobra conexões → pode saturar o banco. Duas receitas: disponibilidade-primeiro (maxUnavailable: 0, maxSurge generoso) ou tempo-mínimo sob orçamento (satura o pico e a degradação mínima aceitável).",
      "Ferramentas de garantia: minReadySeconds (o pod precisa ficar Ready por X segundos antes de contar como disponível); progressDeadlineSeconds (padrão 600s; se o rollout empaca, marca ProgressDeadlineExceeded, mas o Deployment NÃO faz rollback sozinho: quem decide voltar é você); revisionHistoryLimit (padrão 10, quantas revisões guardar pra rollback). O rollout só dispara com mudança em .spec.template, e só escalar réplicas não conta. Estratégias mais sofisticadas (Blue/Green, Canary) não são nativas do Deployment; controladores como Argo Rollouts e Flagger as adicionam com gates de promoção automáticos.",
    ],
    pointsTitle: "Os conceitos-chave desta etapa",
    points: [
      {
        t: "RollingUpdate (padrão)",
        d: "Substitui pods aos poucos mantendo o serviço no ar: cria um novo ReplicaSet e reduz o antigo proporcionalmente. Zero downtime: troca o setup carro a carro enquanto os outros marcam tempo.",
        color: "signal",
      },
      {
        t: "maxUnavailable (o freio)",
        d: "Quantos pods podem ficar indisponíveis durante a troca. Garante o piso de disponibilidade. Padrão 25%. Quantos carros você aceita no box sem esvaziar a pista.",
        color: "ember",
      },
      {
        t: "maxSurge (a potência)",
        d: "Quantos pods a mais que o desejado podem existir temporariamente. Acelera criando extras (os T-cars). Padrão 25%. Proibido zerar os dois juntos (a fila de troca trava).",
        color: "blue",
      },
      {
        t: "Recreate",
        d: "Derruba TUDO da v1 antes de subir a v2. Causa downtime, mas garante que as duas versões nunca coexistem, necessário quando v1 e v2 são incompatíveis (migração de banco). A bandeira vermelha.",
        color: "violet",
      },
      {
        t: "Garantias do rollout",
        d: "minReadySeconds (só conta como pronto após X s estável), progressDeadlineSeconds (detecta o travamento, mas NÃO faz rollback sozinho), revisionHistoryLimit (revisões guardadas). Rollout só dispara com mudança em .spec.template.",
        color: "teal",
      },
    ],
    examplesTitle: "YAML e comandos na prática",
    examples: [
      {
        label: 'RollingUpdate "disponibilidade-primeiro"',
        lang: "yaml",
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  annotations:
    kubernetes.io/change-cause: "Rollout v2.0.0"   # aparece no rollout history
spec:
  replicas: 10
  minReadySeconds: 30           # pod só "vale" após 30s estável Ready
  progressDeadlineSeconds: 600  # se travar por 10min, marca ProgressDeadlineExceeded
  revisionHistoryLimit: 10      # guarda 10 revisões pra rollback
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0         # FREIO: nunca reduz a capacidade mínima
      maxSurge: "50%"           # POTÊNCIA: cria até 5 pods extras pra acelerar
  selector: { matchLabels: { app: myapp } }
  template:
    metadata: { labels: { app: myapp } }
    spec:
      containers:
        - name: app
          image: myregistry/myapp:2.0.0
          readinessProbe:        # sem readiness, o rolling "mente" que está pronto
            httpGet: { path: /healthz, port: 8080 }`,
      },
      {
        label: "rollout + rollback do zero",
        lang: "sh",
        code: `# 1) Cria e espera ficar pronto
kubectl create deployment web --image=nginx:1.25 --replicas=3
kubectl rollout status deployment/web

# 2) Atualiza a imagem (dispara o rollout porque muda o template)
kubectl set image deployment/web nginx=nginx:1.27
kubectl rollout status deployment/web

# 3) Veja os DOIS ReplicaSets (o antigo zerado, o novo com 3)
kubectl get rs -l app=web

# 4) Reverte e confirme que voltou pra 1.25
kubectl rollout undo deployment/web
kubectl describe deployment web | grep Image

# 5) Limpe
kubectl delete deployment web`,
        note: "No passo 3 existem dois ReplicaSets: o Kubernetes não apaga o antigo, ele o zera. É isso que torna o undo instantâneo: o setup da classificação fica salvo no sistema, recarregar leva segundos porque nunca foi apagado.",
      },
    ],
    commands: [
      {
        cmd: "kubectl rollout status deployment/myapp",
        note: "acompanha o rollout (sai com código ≠ 0 se estourar o deadline)",
      },
      {
        cmd: "kubectl rollout history deployment/myapp",
        note: "lista as revisões (com a change-cause)",
      },
      {
        cmd: "kubectl rollout undo deployment/myapp",
        note: "reverte pra revisão anterior (--to-revision=N pra uma específica)",
      },
      {
        cmd: "kubectl rollout pause/resume deployment/myapp",
        note: "congela/retoma no meio (útil pra canário manual)",
      },
    ],
    handsOnIntro: "Faça um rollout e um rollback do zero e observe os ReplicaSets:",
    handsOn: [
      "Crie e espere ficar pronto: kubectl create deployment web --image=nginx:1.25 --replicas=3 e kubectl rollout status deployment/web.",
      "Atualize a imagem (dispara o rollout porque muda o template): kubectl set image deployment/web nginx=nginx:1.27 e acompanhe com rollout status.",
      "Veja os DOIS ReplicaSets (o antigo zerado, o novo com 3): kubectl get rs -l app=web.",
      "Reverta e confirme que voltou pra 1.25: kubectl rollout undo deployment/web e kubectl describe deployment web | grep Image.",
      "Limpe: kubectl delete deployment web.",
    ],
    tip: 'Sempre preencha kubernetes.io/change-cause (ou use --record). Sem ela, o rollout history fica cego e você não sabe pra qual revisão voltar quando o incidente chegar às 3h da manhã. É o seu log de setup: sem anotar "o que mudei e por quê", quando o carro ficar ruim você vai adivinhar no escuro no meio da corrida.',
    takeaway:
      "RollingUpdate = zero-downtime com freio (maxUnavailable) e potência (maxSurge); o undo é instantâneo porque o ReplicaSet antigo continua guardado, só zerado. Igual ao setup da classificação que fica salvo: voltar pra ele é recarregar, não remontar.",
    outro:
      "QUE PIT STOP, SENHORAS E SENHORES! Setor 3 no verde, o carro trocou de setup em movimento e ainda temos o botão de voltar atrás na mão. Mas agora a gente sobe de nível na organização da equipe: como montar TODOS os carros a partir da mesma fôrma, mudando só a folha de setup? O Helm assume o comando. Etapa 04!",
  },

  {
    id: "m4",
    num: "04",
    navTitle: "Helm",
    tag: "os bastidores da fábrica",
    title: "Gerenciador de pacotes com Helm Charts",
    narration:
      "Longe das câmeras, é na fábrica que o campeonato é construído. Mesmo chassi o ano inteiro, folha de setup diferente a cada circuito. Chega de copiar e colar YAML e rezar pra não esquecer nada. O Helm é o apt do Kubernetes e vai organizar sua garagem. Vem pra oficina!",
    lead: 'Você tem dev, staging e prod. Cada ambiente precisa dos mesmos ~15 manifestos YAML, mudando só réplicas, tag de imagem e recursos. Você copia e cola tudo três vezes. Aí um dia altera um label no Deployment de prod, esquece de replicar em staging, e passa a semana caçando por que "no staging funciona e em prod não". Isso viola DRY e é uma fábrica de erros.',
    concept: [
      "O Helm é o apt/yum do Kubernetes. Pensa na fôrma de montagem do carro: o chassi, a filosofia de suspensão, a arquitetura aero são a mesma base o ano inteiro. O que muda de circuito pra circuito é a folha de setup: nível de asa em Monza (baixa) vs. Mônaco (alta), pressão de pneu, mapa de motor. Você não redesenha o carro em cada GP; troca só os ingredientes que variam (os values) na mesma fôrma (o template).",
      "Anatomia de um Chart: Chart.yaml são os metadados: version é a versão do chart e appVersion é a versão da aplicação empacotada (ambos SemVer; separá-los ajuda a governança). values.yaml são os valores padrão configuráveis (réplicas, imagem, porta, recursos), e tudo que varia por ambiente mora aqui. templates/ são os manifestos como templates Go + funções Sprig, onde {{ .Values.replicaCount }} insere o valor e helpers em _helpers.tpl evitam repetir lógica.",
      "A sacada teórica: um template Helm é uma função pura T(valores) → YAML: mesmos inputs, mesma saída, previsível e testável (helm template renderiza sem aplicar). É o simulador: você joga a folha de setup e ele te devolve exatamente como o carro vai ficar, sem tocar na pista. Isso encarna dois pilares de Infraestrutura como Código: idempotência (aplicar N vezes tem o mesmo efeito que aplicar uma) e imutabilidade (não muta o objeto existente, cria uma nova versão e mantém o histórico, o que torna o rollback confiável).",
      "Ciclo de vida: helm install (cria e registra a release num Secret) → helm upgrade (calcula o diff e aplica só as mudanças) → helm rollback (volta pra uma revisão salva). O Helm 3 não tem servidor central (Tiller): o cliente usa direto as credenciais do kubectl, então o RBAC do usuário limita o que o Helm pode fazer. Em escala, charts seguem SemVer, são distribuídos por repositórios (Artifact Hub, privados), podem ser assinados digitalmente (GPG + .prov) pra proteger a supply chain, e devem embutir RBAC de menor privilégio. Combinado com GitOps (ArgoCD/Flux), cada release vira um commit auditável.",
    ],
    pointsTitle: "Os conceitos-chave desta etapa",
    points: [
      {
        t: "Chart.yaml",
        d: "Metadados. version é a versão do chart (a fôrma); appVersion é a versão da aplicação empacotada. Ambos SemVer, e separá-los evolui o chart sem trocar o app.",
        color: "blue",
      },
      {
        t: "values.yaml",
        d: "Os valores padrão configuráveis (réplicas, imagem, porta, recursos). Tudo que varia por ambiente mora aqui. A folha de setup por circuito.",
        color: "signal",
      },
      {
        t: "templates/",
        d: "Os manifestos como templates Go + funções Sprig. {{ .Values.replicaCount }} insere o valor; helpers em _helpers.tpl evitam repetição. A fôrma que recebe os números da folha de setup.",
        color: "violet",
      },
      {
        t: "Função pura",
        d: "Um template é T(valores) → YAML: mesmos inputs, mesma saída. helm template renderiza sem aplicar (o simulador). Sustenta idempotência (aplicar N vezes = aplicar 1) e imutabilidade (nova versão, histórico preservado).",
        color: "teal",
      },
      {
        t: "Helm 3 sem Tiller",
        d: "Não há servidor central: o cliente usa direto as credenciais do kubectl, então o RBAC do usuário limita o que o Helm pode fazer. O crachá de quem opera define o que a fôrma monta.",
        color: "ember",
      },
    ],
    examplesTitle: "YAML e comandos na prática",
    examples: [
      {
        label: "Chart.yaml: a identidade do pacote",
        lang: "yaml",
        code: `# Chart.yaml: a identidade do pacote
apiVersion: v2
name: myapp
version: 0.1.0          # versão do CHART (a fôrma)
appVersion: "1.0.0"     # versão da APLICAÇÃO empacotada (o bolo)
type: application`,
      },
      {
        label: "values.yaml",
        lang: "yaml",
        code: `# values.yaml: tudo que varia por ambiente mora aqui
replicaCount: 2
image:
  repository: myregistry/myapp
  tag: "1.0.0"
  pullPolicy: IfNotPresent
service: { type: ClusterIP, port: 80 }
resources:
  requests: { cpu: 250m, memory: 128Mi }
  limits:   { cpu: 500m, memory: 256Mi }`,
      },
      {
        label: "templates/deployment.yaml (trecho)",
        lang: "yaml",
        code: `# templates/deployment.yaml (trecho): a fôrma que consome os values
spec:
  replicas: {{ .Values.replicaCount }}          # injeta o valor do values.yaml
  template:
    spec:
      containers:
        - name: {{ .Chart.Name }}               # usa o nome definido no Chart.yaml
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          resources:
            {{- toYaml .Values.resources | nindent 12 }}  # serializa o bloco inteiro,
                                                          # indentado 12 espaços`,
      },
      {
        label: "a função pura no simulador",
        lang: "sh",
        code: `# 1) Cria um chart de exemplo
helm create demo

# 2) Renderiza com o valor padrão (repare em replicas: 1)
helm template demo | grep -i replicas

# 3) Renderiza mudando SÓ o input; a saída muda de forma previsível
helm template demo --set replicaCount=4 | grep -i replicas

# 4) Valida o chart
helm lint demo`,
        note: "O mesmo template produz replicas: 1 no passo 2 e replicas: 4 no passo 3. Input diferente → saída determinística. É a idempotência/imutabilidade na prática, testada antes de aplicar em qualquer cluster: rodou no simulador antes de mandar o carro pra pista.",
      },
    ],
    commands: [
      { cmd: "helm create <chart>", note: "gera a estrutura básica" },
      {
        cmd: "helm template ./chart",
        note: "renderiza o YAML sem aplicar (dry-run local; prova que é função pura)",
      },
      { cmd: "helm install <release> ./chart -n <ns>", note: "instala" },
      {
        cmd: "helm upgrade <release> ./chart --set image.tag=1.1.0 --atomic",
        note: "atualiza (--atomic reverte tudo se falhar)",
      },
      {
        cmd: "helm history <release> / helm rollback <release> <rev>",
        note: "histórico e reversão",
      },
      {
        cmd: "helm lint ./chart",
        note: "valida boas práticas (a inspeção técnica antes de ir pra pista)",
      },
    ],
    handsOnIntro: 'Veja a "função pura" com os próprios olhos, sem tocar em cluster nenhum:',
    handsOn: [
      "Crie um chart de exemplo: helm create demo.",
      "Renderize com o valor padrão: helm template demo | grep -i replicas (repare em replicas: 1).",
      "Renderize mudando SÓ o input: helm template demo --set replicaCount=4 | grep -i replicas, e a saída muda de forma previsível.",
      "Valide o chart: helm lint demo. Você testou tudo antes de aplicar em cluster nenhum: rodou no simulador antes de mandar o carro pra pista.",
    ],
    tip: 'Rode helm diff upgrade (plugin helm-diff) antes de aplicar em produção. Ver exatamente o que vai mudar no cluster evita a surpresa de aplicar template "às cegas", o medo número um de quem começa com Helm. É comparar a folha de setup nova com a que está no carro antes de mexer no macaco.',
    takeaway:
      "Chart = fôrma (templates) + ingredientes (values); como o template é função pura, helm template te deixa conferir o resultado antes de mexer no cluster. Mesma fôrma de carro, folha de setup por circuito, e o simulador te mostra o resultado antes da pista.",
    outro:
      "SETOR 4 FECHADO com a garagem organizada! A fábrica está redonda, cada carro sai da mesma fôrma com a folha de setup certa. Agora a gente volta pra ADRENALINA do domingo: como lançar a v2 com um botão de desfazer INSTANTÂNEO? O T-car está aquecido nos bastidores. Etapa 05, Blue/Green. Segura essa emoção!",
  },

  {
    id: "m5",
    num: "05",
    navTitle: "Blue/Green",
    tag: "o T-car quente na garagem",
    title: "Deploy Blue/Green",
    narration:
      "Imagina ter um carro reserva, mesma equipe, setup novo, motor na temperatura, PRONTO pra assumir num estalar de dedos. Era assim na era dos carros reserva, antes de 2008, quando um piloto trocava pro spare no grid e largava mesmo assim. É esse o espírito do Blue/Green: virar a chave e voltar em segundos. Rádio na garagem!",
    lead: 'Você lançou a v2, ela passou em todos os testes, mas em produção, com tráfego e dados reais, apareceu um bug crítico 3 minutos depois. Com RollingUpdate, reverter significa fazer outro rollout completo, que leva minutos enquanto os clientes sofrem. Você queria um "botão de desfazer" instantâneo.',
    concept: [
      "É o T-car (carro reserva) já montado e aquecido nos bastidores. O carro Azul é o que está em pista servindo o público (tráfego); o Verde é o reserva: mesma equipe, setup novo, motor já na temperatura, pronto pra assumir. Quando você valida o Verde, troca de carro na hora: o público passa a ver o Verde imediatamente. Deu ruim? Você volta pro Azul em segundos, porque ele nunca foi desmontado, ficou quente à espera.",
      'A ideia central: mantenha dois ambientes de produção idênticos. O Blue é a versão atual servindo 100% do tráfego; o Green é a nova versão, pronta e "quente", mas sem tráfego. Quando o Green é validado, você vira a chave e ele passa a servir tudo. No Kubernetes, os dois conjuntos de pods têm labels diferentes (env: blue, env: green) e um único Service aponta pra um deles via selector. A promoção é só um patch no selector do Service, e o kube-proxy reconfigura o roteamento em instantes. O rollback é o patch inverso. É uma transição atômica entre dois estados (B → G) com rollback determinístico.',
      'As armadilhas: a consistência de dados/esquema é o calcanhar de Aquiles. Se a Green muda o banco de forma incompatível, reverter pra Blue quebra. A solução é compatibilidade dupla temporária (Martin Fowler): primeiro migrar o banco pra suportar as duas versões, validar, e só então trocar o código. Aqui a analogia do T-car para um pouco: se o carro novo "reescreve o traçado da pista" (o schema do banco), voltar pro carro antigo não adianta: a pista já mudou embaixo dele. Por isso a migração retrocompatível vem antes.',
      'Custo: dois ambientes completos = ~100% de overhead durante a transição (a Etsy chegou a 200% de capacidade). Boa prática: escalar o ambiente inativo pra zero depois de estabilizar. Tempestade de conexões: trocar 100% de uma vez joga toda a carga na Green de repente, e caches frios podem gerar um pico; mitigue aquecendo a Green com tráfego sombra antes. Antipadrão clássico: não tratar a Green como produção o tempo todo. Se você acumula mudanças esperando o "momento certo", o salto Blue→Green vira gigante e arriscado. Ferramentas: Argo Rollouts suporta blueGreen nativo; Flagger integra com service mesh (também chamado Red/Black na Netflix/Spinnaker).',
    ],
    pointsTitle: "Os conceitos-chave desta etapa",
    points: [
      {
        t: "Dois ambientes idênticos",
        d: 'Blue = versão atual servindo 100% do tráfego; Green = nova versão pronta e "quente", sem tráfego. Valida o Green, vira a chave, ele serve tudo. Deu problema? Vira de volta em segundos.',
        color: "blue",
      },
      {
        t: "A virada de chave",
        d: "Os dois conjuntos têm labels diferentes (env: blue/green); um Service aponta pra um via selector. A promoção é um patch no selector, e o kube-proxy reconfigura em instantes. Rollback é o patch inverso.",
        color: "signal",
      },
      {
        t: "Consistência de dados (o calcanhar de Aquiles)",
        d: "Se a Green muda o banco de forma incompatível, reverter pra Blue quebra. Solução: compatibilidade dupla temporária, migrando o banco pra suportar as DUAS versões ANTES de trocar o código.",
        color: "ember",
      },
      {
        t: "Custo e tempestade de conexões",
        d: "Dois ambientes = ~100% de overhead (escale o inativo pra zero após estabilizar). Trocar 100% de uma vez com caches frios gera pico; aqueça a Green com tráfego sombra antes.",
        color: "violet",
      },
      {
        t: "Antipadrão",
        d: 'Não tratar a Green como produção o tempo todo: acumular mudanças esperando o "momento certo" torna o salto gigante e arriscado. Blue/Green de verdade = deploy contínuo no ambiente passivo, só sem tráfego.',
        color: "teal",
      },
    ],
    examplesTitle: "YAML e comandos na prática",
    examples: [
      {
        label: "Service apontando pro BLUE",
        lang: "yaml",
        code: `# Service inicialmente apontando pro BLUE
apiVersion: v1
kind: Service
metadata: { name: myapp-service }
spec:
  selector: { app: myapp, env: blue }   # <- a "chave": troca pra green na promoção
  ports: [ { port: 80, targetPort: 8080 } ]`,
      },
      {
        label: "promoção e rollback (patch no selector)",
        lang: "sh",
        code: `# Promoção Blue -> Green: só repatch o selector (a virada de chave)
kubectl patch service myapp-service \\
  -p '{"spec":{"selector":{"app":"myapp","env":"green"}}}'

# Rollback: patch inverso, volta em segundos (Green continua de pé, só sem tráfego)
kubectl patch service myapp-service \\
  -p '{"spec":{"selector":{"app":"myapp","env":"blue"}}}'`,
      },
      {
        label: "Blue/Green de brinquedo",
        lang: "sh",
        code: `# 1) Dois "ambientes": o que importa pro Service são os labels do TEMPLATE do pod
#    (o Service seleciona pods, não o objeto Deployment), então definimos env=blue/green ali:
kubectl create deployment blue  --image=nginx:1.25
kubectl create deployment green --image=nginx:1.27
kubectl patch deployment blue  -p '{"spec":{"template":{"metadata":{"labels":{"app":"bg","env":"blue"}}}}}'
kubectl patch deployment green -p '{"spec":{"template":{"metadata":{"labels":{"app":"bg","env":"green"}}}}}'

# 2) Um Service apontando pro BLUE
kubectl expose deployment blue --name=bg-svc --port=80 --selector='app=bg,env=blue'

# 3) Veja qual pod recebe tráfego (IP do pod BLUE)
kubectl get endpoints bg-svc

# 4) Vire a chave pro GREEN e olhe os endpoints mudarem
kubectl patch service bg-svc -p '{"spec":{"selector":{"app":"bg","env":"green"}}}'
kubectl get endpoints bg-svc

# 5) Limpe
kubectl delete deploy blue green; kubectl delete svc bg-svc`,
        note: "No passo 3 o endpoint aponta pro IP do pod blue; após o patch (passo 4), passa a apontar pro pod green, sem reiniciar nada. Essa é a virada de chave: o muro simplesmente muda de carro sem ninguém entrar no box.",
      },
    ],
    commands: [
      {
        cmd: "kubectl get endpoints myapp-service",
        note: "confirma pra quais pods o Service está roteando (valida a troca)",
      },
      { cmd: "kubectl patch service ...", note: "executa a virada de chave (patch no selector)" },
      {
        cmd: "kubectl scale deployment myapp-blue --replicas=0",
        note: "desliga o ambiente antigo após estabilizar",
      },
    ],
    handsOnIntro: "Monte um Blue/Green de brinquedo e vire a chave observando os endpoints:",
    handsOn: [
      'Crie dois "ambientes": kubectl create deployment blue --image=nginx:1.25 e green --image=nginx:1.27.',
      "Marque os labels no TEMPLATE do pod (o Service seleciona pods): patch em blue com env=blue e green com env=green (app=bg).",
      "Exponha um Service apontando pro BLUE: kubectl expose deployment blue --name=bg-svc --port=80 --selector=app=bg,env=blue.",
      "Veja qual pod recebe tráfego: kubectl get endpoints bg-svc (o IP do pod blue).",
      "Vire a chave pro GREEN: kubectl patch service bg-svc -p ... env green, e olhe os endpoints mudarem, sem reiniciar nada.",
      "Limpe: kubectl delete deploy blue green; kubectl delete svc bg-svc.",
    ],
    tip: 'Antes de virar a chave, garanta que o banco aceita as duas versões. A pergunta é sempre: "se eu precisar reverter pra Blue daqui a 5 minutos, os dados que a Green escreveu vão quebrar a Blue?". Se sim, você não está pronto pro cutover. Só troca pro T-car se você tem certeza de que consegue voltar pro titular sem que a pista tenha mudado embaixo dele.',
    takeaway:
      'Blue/Green é "tudo ou nada": a promoção e o rollback são um patch no selector do Service, instantâneos, desde que o banco seja retrocompatível. É trocar de carro na hora, com o antigo quente na garagem, e só funciona se a pista (o schema) não mudou embaixo.',
    outro:
      "SETOR 5 NO VERDE, virada de chave perfeita! Você tem agora o botão de desfazer instantâneo no bolso. Mas o Blue/Green joga 100% do público na v2 de uma vez. E se o bug só aparecer com 1 usuário em 20? Aí a gente não arrisca a dupla toda: manda UM carro testar a peça nova em pista. O canário está no cockpit. Etapa 06!",
  },

  {
    id: "m6",
    num: "06",
    navTitle: "Canary",
    tag: "um carro testa a peça nova",
    title: "Deploy Canário",
    narration:
      "A Ferrari não coloca a asa nova nos dois carros de uma vez. Ela bota no do Leclerc, lê a telemetria por algumas voltas, e só então libera pro Hamilton. Um sente o gás antes de todo mundo: o velho canário na mina. É a estratégia mais cirúrgica do grid, e é a próxima curva. Telemetria ligada!",
    lead: "Blue/Green vira 100% do tráfego de uma vez. Mas e se a v2 tiver um bug que só aparece sob carga real, com 1 usuário em cada 20? Virar tudo de uma vez expõe todo mundo ao mesmo tempo. Você queria testar a v2 com uma fatia pequena e real de usuários, medir, e só então expandir.",
    concept: [
      'É mandar um único carro testar o upgrade em condição de corrida antes de aplicar na dupla. A Ferrari não coloca a asa nova nos dois carros de uma vez: bota no do Leclerc por algumas voltas, lê a telemetria (delta de tempo, temperatura de pneu, degradação), e só então libera pro Hamilton também. Se o delta piorar, tira a peça daquele carro e a base inteira nunca foi contaminada. O nome vem do "canário na mina": uma fração pequena sente o gás tóxico antes de todo mundo.',
      'A ideia central: em vez de expor todo mundo à v2, você manda uma fração pequena de usuários reais pra ela, monitora métricas, e só aumenta se estiver tudo bem. Blue/Green é "tudo ou nada" (100% de uma vez); Canary é progressivo (1% → 5% → 25% → 50% → 100%), validando a cada passo com carga real. As duas versões rodam juntas e você migra o tráfego aos poucos.',
      "Roteamento fino de tráfego: feito por um service mesh (Istio, Linkerd) ou ingress com peso, e você define percentuais exatos (ex.: 90% v1 / 10% v2) independentes do número de réplicas, via proxies sidecar. No Istio, um VirtualService divide o tráfego entre subsets (v1/v2) e você ajusta os pesos dinamicamente. O que decide promover ou reverter são métricas em tempo real: taxa de erro (5xx), latência (p95, p99), uso de recursos, métricas de negócio. Isso fecha um laço de realimentação automatizável: se o erro do canário < threshold, aumenta o peso; se viola, rollback imediato pra v1.",
      "O vocabulário que vale conhecer (aprofundamento teórico): o canário é um teste A/B contínuo, um experimento estatístico entre v1 (controle) e v2, testado com significância (α = 0,05) via teste z, qui-quadrado ou Mann-Whitney (o Kayenta da Netflix usa Mann-Whitney). Testes sequenciais (SPRT de Wald) param cedo quando há evidência suficiente. Teoria de filas: mesmo 10% de tráfego pode ter latência ruim se aqueles 10% quase saturam os pods v2 (W = 1/(μ−λ) explode perto da saturação). Multi-armed bandits (Thompson Sampling) alocam tráfego adaptativamente. Casos reais: a Shopify manda ~5% por ~10min com análise automática; a Netflix automatizou tudo com Kayenta; o Nubank usa feature flags + canary pra centenas de deploys/dia.",
    ],
    pointsTitle: "Os conceitos-chave desta etapa",
    points: [
      {
        t: "Rollout progressivo",
        d: "Em vez de expor todo mundo, manda uma fração pequena de usuários reais pra v2, monitora e só aumenta se estiver tudo bem (1% → 5% → 25% → 50% → 100%). As duas versões rodam juntas.",
        color: "signal",
      },
      {
        t: "Canary vs Blue/Green",
        d: 'Blue/Green é "tudo ou nada" (100% de uma vez); Canary é progressivo, validando a cada passo com carga real. Liberar a peça de carro em carro, medindo a cada stint.',
        color: "blue",
      },
      {
        t: "Roteamento fino por peso",
        d: "Feito por service mesh (Istio, Linkerd) ou ingress com peso: percentuais exatos (ex.: 90/10) independentes do número de réplicas, via proxies sidecar. O engenheiro dosa a fração exata.",
        color: "violet",
      },
      {
        t: "Decisão orientada a dados",
        d: "O que decide promover ou reverter são métricas em tempo real: taxa de erro (5xx), latência (p95/p99), recursos, negócio. Fecha um laço: erro < threshold sobe o peso; violou, rollback imediato.",
        color: "ember",
      },
      {
        t: "SLO gate",
        d: "Amarre o canário aos SLOs, não a métricas arbitrárias. Ferramentas como o Kayenta (Netflix) e o Argo Rollouts aplicam a análise estatística por você. Defina o delta-limite ANTES de mandar o carro pra pista.",
        color: "teal",
      },
    ],
    examplesTitle: "YAML e comandos na prática",
    examples: [
      {
        label: "split de tráfego com Istio (VirtualService)",
        lang: "yaml",
        code: `apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata: { name: myapp }
spec:
  hosts: [ myapp ]
  http:
    - route:
        - destination: { host: myapp, subset: v1 }
          weight: 90        # estável recebe 90%
        - destination: { host: myapp, subset: v2 }
          weight: 10        # canário recebe 10%, sobe gradualmente`,
      },
      {
        label: "degraus do canário no Argo Rollouts",
        lang: "yaml",
        code: `# Argo Rollouts: os degraus do canário com pausa e análise automática
strategy:
  canary:
    steps:
      - setWeight: 5                                   # manda 5% pra v2
      - pause: { duration: 60s }                       # observa por 60s
      - analysis: { templates: [ { templateName: slo-check } ] }  # gate por SLO
      - setWeight: 25                                  # se passou, sobe pra 25%
      - pause: { duration: 60s }
      - setWeight: 100                                 # promoção total`,
      },
      {
        label: "canário aproximado por réplicas",
        lang: "sh",
        code: `# 1) v1 com 9 réplicas, v2 com 1 -> ~10% do tráfego cai na v2
kubectl create deployment app-v1 --image=nginx:1.25 --replicas=9
kubectl create deployment app-v2 --image=nginx:1.27 --replicas=1
kubectl label deployment app-v1 app=canary --overwrite
kubectl label deployment app-v2 app=canary --overwrite
kubectl patch deployment app-v1 -p '{"spec":{"template":{"metadata":{"labels":{"app":"canary"}}}}}'
kubectl patch deployment app-v2 -p '{"spec":{"template":{"metadata":{"labels":{"app":"canary"}}}}}'

# 2) Um Service cobre AMBAS as versões (mesmo label app=canary)
kubectl expose deployment app-v1 --name=canary-svc --port=80 --selector='app=canary'

# 3) Confirme: 10 endpoints (9 v1 + 1 v2) atrás do Service
kubectl get endpoints canary-svc -o wide

# 4) "Promova": aumente a v2 e reduza a v1 (25% -> 50% -> 100%)
kubectl scale deployment app-v2 --replicas=3
kubectl scale deployment app-v1 --replicas=1

# 5) Limpe
kubectl delete deploy app-v1 app-v2; kubectl delete svc canary-svc`,
        note: 'O Service lista todos os pods das duas versões como endpoints; mudar a proporção de réplicas muda a fatia de tráfego. Com réplicas você só consegue frações "grosseiras" (10%, 25%...). Por isso um service mesh, que pesa por porcentagem independente de réplicas, é superior pra canário de verdade.',
      },
    ],
    commands: [
      {
        cmd: "kubectl -n istio-system get virtualservice",
        note: "inspeciona as regras de tráfego",
      },
      {
        cmd: "kubectl argo rollouts get rollout myapp --watch",
        note: "acompanha o canário (plugin do Argo Rollouts)",
      },
      {
        cmd: "kubectl argo rollouts promote myapp / abort myapp",
        note: "promove ou aborta manualmente",
      },
    ],
    handsOnIntro:
      "Sem Istio instalado, você consegue aproximar o efeito canário pela razão de réplicas atrás do mesmo Service (o balanceamento fica proporcional ao número de pods):",
    handsOn: [
      "Crie v1 com 9 réplicas e v2 com 1 (~10% do tráfego cai na v2): kubectl create deployment app-v1 --image=nginx:1.25 --replicas=9 e app-v2 --image=nginx:1.27 --replicas=1.",
      "Dê o mesmo label app=canary aos dois, inclusive no template do pod (via patch).",
      "Exponha um Service que cobre AMBAS as versões: kubectl expose deployment app-v1 --name=canary-svc --port=80 --selector=app=canary.",
      "Confirme 10 endpoints (9 v1 + 1 v2): kubectl get endpoints canary-svc -o wide.",
      '"Promova" ajustando réplicas: kubectl scale deployment app-v2 --replicas=3 e app-v1 --replicas=1.',
      "Limpe: kubectl delete deploy app-v1 app-v2; kubectl delete svc canary-svc.",
    ],
    tip: 'Amarre o canário aos seus SLOs, não a métricas arbitrárias. Se o SLO de erro é 0,1%, o canário deve frear automaticamente quando a v2 violar isso. Assim o monitoramento de produção e o de deploy viram a mesma coisa, e promover deixa de ser "achismo". Defina o delta-limite antes: "se passar de +0,3s por volta ou 110°C de pneu, aborta". Número claro, decisão automática.',
    takeaway:
      "Canary é rollout progressivo com gate de métricas a cada passo; o peso ideal vem de service mesh (independe de réplicas), e a decisão de promover deve nascer do seu SLO. Um carro testa a peça nova por umas voltas, a telemetria decide, e só então a equipe toda recebe.",
    outro:
      "SETOR 6 CONCLUÍDO, canário aprovado! Você já sabe lançar sem medo, do jeito mais cirúrgico do grid. Chegamos à metade final da prova, e agora a pergunta muda de escala: e quando não tem BOX suficiente pros carros que chegam? Quem monta a garagem sob demanda? A logística assume o controle. Etapa 07, acelera na reta longa!",
  },

  {
    id: "m7",
    num: "07",
    navTitle: "Karpenter",
    tag: "potência de infraestrutura sob demanda",
    title: "Escalabilidade de nós com Karpenter",
    narration:
      "Numa promoção relâmpago, o HPA pede 20 pods e... não tem box pra ninguém. Os carros ficam na fila da pit lane. É como um fim de semana back-to-back onde a equipe precisa montar a estrutura na hora, no lugar certo, com o material mais barato disponível. O Karpenter é o gerente de logística mais rápido do paddock. Pé no fundo!",
    lead: "Até agora você escalou pods. Mas numa promoção relâmpago o HPA pede 20 novos pods e... não há nó onde colocá-los. Os pods ficam Pending e o serviço não aguenta a demanda. O Cluster Autoscaler tradicional resolveria, mas é lento e depende de grupos de nós fixos (ASGs) pré-configurados por tipo/zona, uma dor de manter. E ele costuma acionar um nó gigante pra um pod pequeno, desperdiçando dinheiro.",
    concept: [
      "É a diferença entre dois jeitos de montar box na pit lane. O Cluster Autoscaler é ter contratos fixos de box de um tamanho só, reservados com meses de antecedência: chegou um carro pequeno, você é obrigado a abrir um box gigante, pagando pelo espaço vazio. O Karpenter é o gerente de logística que olha exatamente quantos carros e de que tamanho chegaram e monta na hora o box do tamanho certo, escolhendo até o material mais barato disponível, e desmonta assim que esvazia.",
      "Karpenter = autoscaling de nós just-in-time. Criado pela AWS (open source, hoje multicloud), provisiona nós sob medida pros pods pendentes, sem grupos fixos: mais rápido (segundos a <1min), escolhe a instância ótima (inclusive Spot) e remove nós ociosos sozinho. Empresas relatam até 30% de economia. O fluxo: pods ficam unschedulable (o scheduler não achou nó) → o Karpenter observa → calcula qual instância acomoda melhor esses pods → provisiona → os pods são agendados. No sentido inverso, ele identifica nós subutilizados e consolida: move os pods pra outros nós e remove o ocioso, ou troca um On-Demand caro por um Spot mais barato.",
      "Configuração por NodePools (antes chamados Provisioners): definem as regras dos nós que o Karpenter pode lançar: tipos de instância, zonas, Spot vs On-Demand, limites. Recomendação: restrinja o mínimo possível, pra dar liberdade de otimização ao Karpenter. Por que ele é esperto: o problema é bin packing multidimensional (NP-difícil); ele usa heurística gulosa (filtra tipos que não servem, ordena por custo/adequação, faz algo próximo de First-Fit Decreasing). Diferença-chave: o Cluster Autoscaler preserva homogeneidade dentro do grupo (pod pequeno pode acionar nó grande); o Karpenter faz right-sizing, com nó pequeno pra pod pequeno.",
      "Spot e custo: instâncias Spot custam ~70-90% menos, mas podem ser retiradas com aviso curto (2min na AWS). São o material emprestado que o fornecedor pode pedir de volta a qualquer hora: barato, mas você precisa de plano B. O Karpenter trata isso com interrupção proativa: detecta o aviso, marca o nó como terminating, aplica taint e drena os pods pra outro lugar antes do corte. E respeita PodDisruptionBudgets, nunca consolidando ou terminando nós se isso violar o budget. Boas práticas: PDB pra controlar quantos pods caem juntos, Topology Spread pra distribuir réplicas, e NodePools separados pra cargas críticas (On-Demand) vs. tolerantes (Spot).",
    ],
    pointsTitle: "Os conceitos-chave desta etapa",
    points: [
      {
        t: "Autoscaling de nós just-in-time",
        d: "Provisiona nós sob medida pros pods pendentes, SEM grupos fixos: rápido (segundos a <1min), escolhe a instância ótima (inclusive Spot) e remove nós ociosos sozinho. Até ~30% de economia.",
        color: "signal",
      },
      {
        t: "O fluxo",
        d: "Pods ficam unschedulable → o Karpenter observa → calcula a instância que acomoda melhor → provisiona → os pods são agendados. No inverso, consolida nós subutilizados: move pods e remove o ocioso.",
        color: "blue",
      },
      {
        t: "NodePools",
        d: "Definem as regras dos nós que o Karpenter pode lançar (tipos, zonas, Spot vs On-Demand, limites). Recomendação: restrinja o mínimo possível, pra dar liberdade de otimização.",
        color: "violet",
      },
      {
        t: "Right-sizing vs Cluster Autoscaler",
        d: "O CA preserva homogeneidade do grupo (pod pequeno pode acionar nó grande); o Karpenter faz right-sizing, com nó pequeno pra pod pequeno. É bin packing NP-difícil resolvido por heurística gulosa (First-Fit Decreasing).",
        color: "ember",
      },
      {
        t: "Spot e PodDisruptionBudget",
        d: "Spot custa ~70-90% menos mas pode ser retirado com aviso curto (2min). O Karpenter faz interrupção proativa (drena antes do corte) e respeita o PDB, nunca tirando réplicas demais juntas.",
        color: "teal",
      },
    ],
    examplesTitle: "YAML e comandos na prática",
    examples: [
      {
        label: "NodePool com Spot + On-Demand e consolidação",
        lang: "yaml",
        code: `apiVersion: karpenter.sh/v1
kind: NodePool
metadata: { name: default }
spec:
  template:
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot", "on-demand"]     # pode usar spot; cai pra on-demand se faltar
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64"]                  # restringe arquitetura
      nodeClassRef: { name: default }        # aponta pra config de infra (AMI, subnets...)
  limits: { cpu: "1000", memory: 1000Gi }    # teto de custo: nunca passa disto
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized  # consolida nós vazios OU subutilizados
    consolidateAfter: 30s                          # histerese: espera 30s antes de agir`,
      },
      {
        label: "o gatilho: pod Pending por falta de nó",
        lang: "sh",
        code: `# 1) Peça mais CPU do que qualquer nó do cluster tem (ex.: 100 cores)
kubectl create deployment faminto --image=nginx
kubectl set resources deployment faminto --requests=cpu=100

# 2) O pod fica Pending: não há nó que comporte a request
kubectl get pods -l app=faminto           # STATUS = Pending

# 3) Veja o motivo: é EXATAMENTE o sinal que o Karpenter escuta pra provisionar
kubectl describe pod -l app=faminto | grep -A3 Events
#   -> "0/N nodes are available: Insufficient cpu" (FailedScheduling)

# 4) Limpe
kubectl delete deployment faminto`,
        note: "O evento FailedScheduling / Insufficient cpu é o pod unschedulable: o carro chegou e não tem box que o comporte. Num cluster com Karpenter, é esse evento que dispara o provisionamento de um nó do tamanho certo em segundos.",
      },
    ],
    commands: [
      {
        cmd: "kubectl get nodeclaims",
        note: "lista os nós que o Karpenter provisionou (os boxes montados sob medida)",
      },
      {
        cmd: "kubectl get pods --field-selector=status.phase=Pending",
        note: "vê os pods que disparam o provisionamento (os carros esperando box)",
      },
      { cmd: "kubectl describe nodepool default", note: "inspeciona as regras e limites" },
      {
        cmd: "kubectl get nodes -L karpenter.sh/capacity-type",
        note: "mostra quais nós são Spot vs On-Demand",
      },
    ],
    handsOnIntro:
      "Karpenter roda em nuvem, mas você pode ver o gatilho que ele observa (o pod Pending por falta de nó) em qualquer cluster:",
    handsOn: [
      "Peça mais CPU do que qualquer nó tem: kubectl create deployment faminto --image=nginx e kubectl set resources deployment faminto --requests=cpu=100.",
      "O pod fica Pending (não há nó que comporte a request): kubectl get pods -l app=faminto.",
      'Veja o motivo, o sinal que o Karpenter escuta: kubectl describe pod -l app=faminto | grep -A3 Events → "Insufficient cpu" (FailedScheduling).',
      "Limpe: kubectl delete deployment faminto.",
    ],
    tip: "Rode cargas stateless e tolerantes a interrupção em Spot, e reserve On-Demand só pro que é crítico/stateful, em NodePools separados. Combine com PodDisruptionBudget e Topology Spread pra que uma interrupção de Spot nunca derrube réplicas demais de um serviço ao mesmo tempo. Material emprestado (Spot) só nos componentes que você aguenta perder; no carro do líder, só material próprio garantido.",
    takeaway:
      "Karpenter provisiona o nó certo just-in-time reagindo a pods Pending, faz right-sizing e economiza com Spot, sempre respeitando o PodDisruptionBudget. É o gerente de logística montando box na medida do carro, com material barato onde dá, sem nunca esvaziar a equipe de uma vez.",
    outro:
      "SETOR 7 NO VERDE, que ultrapassagem na reta! Você resolveu a escala dos BOXES. Agora falta o outro lado da moeda: dimensionar a EQUIPE DE PIT pela fila de carros chegando, e recolher todo mundo a zero na calmaria da madrugada. Escala por evento, não por esforço. O KEDA entra em cena. Etapa 08!",
  },

  {
    id: "m8",
    num: "08",
    navTitle: "KEDA",
    tag: "escala orientada a evento",
    title: "Escalabilidade de aplicações com KEDA",
    narration:
      "Sem carro entrando no box, zero mecânico parado no macaco recebendo à toa. Chegou uma fila de 40 pedidos? Abre 4 estações na hora. Esvaziou? Recolhe todo mundo. O que dispara não é o suor de um mecânico, e sim quantos carros estão na fila. Escala orientada a evento. Vamos ao KEDA!",
    lead: "Você tem workers que consomem pedidos de uma fila. O HPA padrão só sabe escalar por CPU/memória, mas o seu gargalo não é CPU, é o tamanho da fila de pedidos. Pior: de madrugada a fila fica vazia, e mesmo assim você paga por 3 pods parados sem nada pra fazer. Você queria escalar pelo tamanho da fila e cair até zero quando não há trabalho.",
    concept: [
      "É a equipe de pit stop dimensionada pela fila de carros chegando. Sem carro entrando no box? Zero mecânicos parados no macaco (a equipe não paga gente à toa). Chegou um carro? Um conjunto de mecânicos assume na hora. Fila de 40 pedidos e cada estação atende de 10 em 10? Abre 4 estações. Esvaziou e ficou vazia um tempo? Recolhe todos. O que dispara não é o esforço de um mecânico (CPU), e sim quantos carros estão na fila (o evento).",
      "KEDA = autoscaling orientado a eventos. Escala com base em eventos externos (filas RabbitMQ/SQS/Kafka, métricas Prometheus, cron, etc.) e permite scale-to-zero: nenhum pod consumindo recursos quando a fila está vazia. Ele complementa o HPA, não substitui. Como funciona: você cria um ScaledObject (o CRD central) que aponta pra um Deployment alvo e define um trigger (ex.: fila RabbitMQ, 1 pod a cada 10 mensagens). O KEDA cria um HPA por trás. Fila vazia → mantém o Deployment em 0 pods; chega mensagem → ativa 1 pod imediatamente; fila cresce → o HPA calcula os pods (40 mensagens = 4 pods); fila esvazia pelo cooldownPeriod → volta a zero. Só o KEDA tem autoridade pra ir a zero; o HPA sozinho vai de 1 a N (minReplicas ≥ 1).",
      "A teoria (teoria de filas): modele eventos chegando a taxa λ e cada pod processando a μ; com c pods, a capacidade é c·μ. Condição de estabilidade: λ < c·μ (senão a fila cresce sem limite, e nem autoscaling salva). A Lei de Little (L = λ·W) relaciona backlog médio L, taxa λ e tempo de resposta W: se o backlog cresce, ou as chegadas estão rápidas demais, ou faltam pods. O autoscaler ideal controla L pra manter W dentro do SLO.",
      "O desafio: oscilação/jitter (subir e descer pods repetidamente), causado por atraso de realimentação e thresholds estáticos. Mitigações do KEDA/HPA: histerese (~10%: só escala se passar de 110% ou cair abaixo de 90% do alvo); janelas de estabilização e cooldownPeriod; banda morta (limiares distintos de subida e descida: escala up em 100 msgs mas só down abaixo de 20). O KEDA é agnóstico de nuvem (AKS, EKS, GKE, on-prem) e extensível via scalers externos gRPC. Caso típico: e-commerce escalando workers de pedidos por fila durante promoções relâmpago, voltando a zero na madrugada.",
    ],
    pointsTitle: "Os conceitos-chave desta etapa",
    points: [
      {
        t: "Autoscaling orientado a eventos",
        d: "Escala por eventos externos (filas RabbitMQ/SQS/Kafka, Prometheus, cron) e permite scale-to-zero: nenhum pod quando a fila está vazia. Complementa o HPA, não substitui.",
        color: "signal",
      },
      {
        t: "ScaledObject e trigger",
        d: "O CRD central aponta pra um Deployment e define um trigger (ex.: 1 pod a cada 10 mensagens). O KEDA cria um HPA por trás. 40 mensagens = 4 pods; fila vazia pelo cooldownPeriod → volta a zero.",
        color: "blue",
      },
      {
        t: "Só o KEDA vai a zero",
        d: "O HPA sozinho vai de 1 a N (minReplicas ≥ 1); só o KEDA tem autoridade pra ir a zero. O HPA sempre deixa um mecânico de plantão; só o KEDA fecha o box quando não vem carro.",
        color: "violet",
      },
      {
        t: "Condição de estabilidade",
        d: "Modele chegadas a λ e processamento a μ com c pods: capacidade c·μ. Estável só se λ < c·μ; senão a fila cresce sem limite e nenhum autoscaling salva. Lei de Little: L = λ·W.",
        color: "ember",
      },
      {
        t: "Oscilação (jitter)",
        d: "Subir e descer pods repetidamente. Mitigações: histerese (~10%: sobe acima de 110%, desce abaixo de 90%), janelas de estabilização/cooldownPeriod e banda morta (limiares distintos de subida e descida).",
        color: "teal",
      },
    ],
    examplesTitle: "YAML e comandos na prática",
    examples: [
      {
        label: "ScaledObject escalando por fila RabbitMQ",
        lang: "yaml",
        code: `apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata: { name: worker-scaler }
spec:
  scaleTargetRef: { name: meu-deployment }   # o Deployment que será escalado
  minReplicaCount: 0        # scale-to-zero: zero pod quando não há trabalho
  maxReplicaCount: 5        # teto de segurança
  cooldownPeriod: 60        # espera 60s de fila vazia antes de zerar
  pollingInterval: 15       # checa a fila a cada 15s
  triggers:
    - type: rabbitmq
      metadata:
        queueName: minha-fila
        protocol: amqp
        mode: QueueLength
        value: "10"         # alvo: 1 pod a cada 10 mensagens na fila`,
      },
      {
        label: "scale-to-zero com trigger cron",
        lang: "sh",
        code: `# Pré-requisito: KEDA instalado (helm repo add kedacore https://kedacore.github.io/charts && helm install keda kedacore/keda -n keda --create-namespace)

# 1) Um Deployment qualquer
kubectl create deployment cron-demo --image=nginx

# 2) ScaledObject que mantém 0 pods e sobe pra 3 numa janela de horário
cat <<'EOF' | kubectl apply -f -
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata: { name: cron-demo }
spec:
  scaleTargetRef: { name: cron-demo }
  minReplicaCount: 0
  maxReplicaCount: 3
  triggers:
    - type: cron
      metadata:
        timezone: America/Sao_Paulo
        start: "0 * * * *"      # sobe no minuto 0 de cada hora
        end: "30 * * * *"       # desce no minuto 30
        desiredReplicas: "3"
EOF

# 3) Observe o Deployment: fora da janela fica em 0; na janela vai pra 3
kubectl get scaledobject cron-demo
kubectl get deployment cron-demo -w

# 4) Limpe
kubectl delete scaledobject cron-demo; kubectl delete deployment cron-demo`,
        note: "Fora da janela cron, o Deployment fica com 0 réplicas (o HPA comum nunca faria isso) e volta pra 3 dentro da janela. Esse é o scale-to-zero, sem depender de RabbitMQ: o box fechado quando não há corrida, e a equipe de volta na janela de pit.",
      },
    ],
    commands: [
      { cmd: "kubectl get scaledobject", note: "lista os ScaledObjects e o HPA gerado por trás" },
      {
        cmd: "kubectl describe hpa <nome>",
        note: "mostra os eventos de escalonamento (Scaled up to 4 replicas...)",
      },
      {
        cmd: "kubectl get deployment meu-deployment -w",
        note: "observa as réplicas subindo/descendo em tempo real",
      },
    ],
    handsOnIntro:
      "Você pode testar o KEDA sem fila externa, usando o trigger cron (que não depende de nenhum sistema) pra ver scale-to-zero e reativação:",
    handsOn: [
      "Pré-requisito: KEDA instalado (helm install keda kedacore/keda -n keda --create-namespace).",
      "Crie um Deployment qualquer: kubectl create deployment cron-demo --image=nginx.",
      "Aplique um ScaledObject com trigger cron: minReplicaCount 0, maxReplicaCount 3, sobe no minuto 0 e desce no minuto 30 de cada hora (timezone America/Sao_Paulo).",
      "Observe o Deployment: fora da janela fica em 0; na janela vai pra 3 (kubectl get deployment cron-demo -w).",
      "Limpe: kubectl delete scaledobject cron-demo; kubectl delete deployment cron-demo.",
    ],
    tip: "Ajuste pollingInterval e cooldownPeriod pensando na dinâmica da carga. Cooldown curto demais mata pods bons no meio de um burst intermitente; longo demais desperdiça recursos. E lembre: se λ ≥ c·μ de forma sustentada, nenhum autoscaling resolve: o gargalo é capacidade ou código, não número de pods. Contratar mecânico não conserta um box que atende mais devagar do que os carros chegam.",
    takeaway:
      "KEDA escala por eventos (fila, cron, métrica) e é o único que leva a zero; mas se λ ≥ c·μ de forma sustentada, o problema é capacidade, não autoscaler. Equipe de pit dimensionada pela fila de carros, recolhida a zero na calmaria. Mas nenhum reforço salva um box que atende mais devagar do que os carros chegam.",
    outro:
      "SETOR 8 CONCLUÍDO, escala sob domínio total! Boxes e equipe agora respiram junto com a demanda. Falta o último setor, e é o mais implacável. Aqui não se perde corrida na pista: se perde FORA dela, na inspeção técnica. É a chicane final da segurança. Concentração máxima, porque um crachá errado custa o campeonato. Etapa 09, a volta decisiva!",
  },

  {
    id: "m9",
    num: "09",
    navTitle: "Segurança",
    tag: "a chicane final",
    title: "Segurança no cluster",
    narration:
      "A FIA não perdoa. Já vimos carros vencerem na pista e serem desclassificados na inspeção por um detalhe de regulamento. No cluster é igual: um container furado com a chave-mestra no bolso entrega o reino inteiro. Zero Trust, crachá nominal, lacre que expira sozinho. É a última curva, e é aqui que os campeões provam que merecem o troféu. FOCO!",
    lead: "Seu cluster tem vários times e serviços. Um deles roda uma dependência com vulnerabilidade e é comprometido. Se aquele pod usava a ServiceAccount default com permissões amplas (ou pior, tinha uma chave AWS estática embutida no container), o invasor acabou de virar dono do reino: lê segredos de todos os namespaces, cria pods de mineração, acessa buckets. Um único container furado não pode custar o cluster inteiro.",
    concept: [
      "É o controle de acesso do paddock da FIA. Cada membro da equipe recebe um crachá que abre só a zona dele: o mecânico de pneu não entra na sala de estratégia, o engenheiro de dados não mexe na PU (ServiceAccount + RBAC de menor privilégio). Ninguém anda com a chave-mestra do autódromo. Os crachás expiram no fim do fim de semana e as áreas se trancam sozinhas (TLS e tokens de curta duração). A filosofia é a mesma do regulamento, o Zero Trust: ninguém passa por uma cancela sem credencial verificada, nem que seja o chefe de equipe. Segurança em Kubernetes se apoia em três pilares: identidade, autorização e criptografia.",
      "Identidade (ServiceAccounts): cada aplicação deve ter a sua própria ServiceAccount, nunca a default. Ela dá ao pod um token pra falar com o API Server. Isolar identidades por workload é o que permite delimitar o estrago quando um pod é comprometido: cada função da equipe com o seu crachá nominal, e se um cai em mãos erradas, você sabe exatamente qual zona foi exposta e revoga só ele.",
      'Autorização (RBAC): concede permissões via Roles (namespaced) ou ClusterRoles (cluster-wide), ligadas a sujeitos por RoleBindings. O modelo é um grafo: Subject → RoleBinding → Role → Permissão. Menor privilégio na prática: prefira Role namespaced a ClusterRole; conceda só os verbos necessários (get, list, nunca *) e só os recursos necessários. O RBAC do Kubernetes é estático e aditivo (só soma permissões, não há negações), o que o torna auditável. Pra políticas condicionais ("negar pod sem limits", "só imagem stable"), usa-se OPA/Gatekeeper com a linguagem Rego (Policy as Code).',
      "Identidade federada com a nuvem: aplicações precisam acessar S3, buckets, Key Vault, sem embutir chaves estáticas no container. A solução é federar a ServiceAccount do K8s com uma identidade cloud via OIDC, recebendo tokens de curta duração: IRSA (IAM Roles for Service Accounts) no EKS, Workload Identity no GKE e no AKS. Os incidentes provam o valor: no ataque SCARLETEEL (2023), o dano foi limitado porque a Role do pod tinha escopo restrito; no caso da Tesla (2018), um dashboard sem senha + credenciais AWS amplas num pod levou a cryptojacking. Criptografia (cert-manager): automatiza o ciclo de vida do TLS via CRDs (Issuer/ClusterIssuer emite; Certificate define CN, SANs, duração e renewBefore), gera o CSR, assina, preenche o Secret e renova sozinho. E a rotação de segredos usa período de convivência: nova e antiga válidas ao mesmo tempo até todos migrarem, depois invalida a antiga.",
    ],
    pointsTitle: "Os conceitos-chave desta etapa",
    points: [
      {
        t: "Identidade: ServiceAccounts",
        d: "Cada app com a SUA ServiceAccount, nunca a default. Ela dá ao pod um token pra falar com o API Server. Isolar identidades por workload delimita o estrago quando um pod é comprometido. Crachá nominal.",
        color: "blue",
      },
      {
        t: "Autorização: RBAC",
        d: "Permissões via Roles (namespaced) ou ClusterRoles, ligadas por RoleBindings (Subject → RoleBinding → Role → Permissão). Menor privilégio: prefira Role namespaced, só os verbos/recursos necessários, nunca curinga *.",
        color: "signal",
      },
      {
        t: "RBAC aditivo e auditável",
        d: "Estático e aditivo (só soma, não nega), o que o torna auditável: dá pra listar quem pode o quê deterministicamente. Pra políticas condicionais, use OPA/Gatekeeper com Rego (Policy as Code).",
        color: "violet",
      },
      {
        t: "Identidade federada (IRSA / Workload Identity)",
        d: "Acessar S3/buckets/Key Vault sem chaves estáticas: federe a SA com uma identidade cloud via OIDC, recebendo tokens de curta duração. IRSA no EKS, Workload Identity no GKE/AKS. O crachá temporário do fornecedor.",
        color: "ember",
      },
      {
        t: "Criptografia: cert-manager",
        d: "Automatiza o ciclo de vida do TLS via CRDs: Issuer/ClusterIssuer (quem emite) e Certificate (o que emitir, com renewBefore). Gera CSR, assina, preenche o Secret e renova sozinho. Os lacres da FIA que expiram e se renovam.",
        color: "teal",
      },
    ],
    examplesTitle: "YAML e comandos na prática",
    examples: [
      {
        label: "SA + Role de menor privilégio + IRSA",
        lang: "yaml",
        code: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: analytics-sa
  namespace: analytics
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/S3Reader  # IRSA:
                                                       # federa esta SA com uma IAM Role
                                                       # (token curto, zero chave estática)
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role                    # namespaced (limita ao namespace analytics), NÃO ClusterRole
metadata: { name: analytics-read, namespace: analytics }
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list"]    # só leitura de pods, sem "*"
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get"]            # só get de configmaps
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding             # amarra a Role ao sujeito (a SA)
metadata: { name: bind-analytics-read, namespace: analytics }
roleRef: { apiGroup: rbac.authorization.k8s.io, kind: Role, name: analytics-read }
subjects:
  - kind: ServiceAccount
    name: analytics-sa
    namespace: analytics`,
      },
      {
        label: "cert-manager: Certificate com renovação automática",
        lang: "yaml",
        code: `# cert-manager: emite e renova TLS interno automaticamente
apiVersion: cert-manager.io/v1
kind: Certificate
metadata: { name: service-a-cert }
spec:
  secretName: service-a-tls   # onde o cert-manager grava tls.crt / tls.key
  duration: 2160h             # validade de 90 dias
  renewBefore: 360h           # renova 15 dias ANTES de expirar (sem intervenção)
  commonName: service-a.default.svc.cluster.local
  dnsNames: [ service-a, service-a.default.svc.cluster.local ]  # SANs
  issuerRef: { name: cluster-ca-issuer, kind: Issuer }          # quem assina`,
      },
      {
        label: "menor privilégio com auth can-i",
        lang: "sh",
        code: `# 1) Namespace, SA e Role de só-leitura de pods
kubectl create namespace lab
kubectl create serviceaccount leitor -n lab
kubectl create role ler-pods --verb=get,list --resource=pods -n lab
kubectl create rolebinding bind-leitor --role=ler-pods --serviceaccount=lab:leitor -n lab

# 2) A SA PODE listar pods no namespace lab?
kubectl auth can-i list pods -n lab --as=system:serviceaccount:lab:leitor
#   -> yes

# 3) A SA PODE deletar pods? (não concedemos "delete")
kubectl auth can-i delete pods -n lab --as=system:serviceaccount:lab:leitor
#   -> no

# 4) A SA PODE ler Secrets? (não concedemos esse recurso)
kubectl auth can-i get secrets -n lab --as=system:serviceaccount:lab:leitor
#   -> no

# 5) Limpe
kubectl delete namespace lab`,
        note: 'yes só para o que você concedeu explicitamente (list pods); no para tudo o mais. É o RBAC aditivo e auditável em ação: se um pod com essa SA for comprometido, o invasor fica preso a "listar pods neste namespace" e nada além.',
      },
    ],
    commands: [
      {
        cmd: "kubectl auth can-i <verbo> <recurso> --as=system:serviceaccount:<ns>:<sa>",
        note: "testa se uma SA tem uma permissão (auditoria de RBAC)",
      },
      {
        cmd: "kubectl get rolebindings,clusterrolebindings -A -o wide",
        note: "mapeia quem tem acesso a quê",
      },
      {
        cmd: "kubectl get certificate -A",
        note: "estado dos certificados gerenciados pelo cert-manager",
      },
      {
        cmd: "kubectl create token <sa>",
        note: "gera um token de curta duração pra uma ServiceAccount",
      },
    ],
    handsOnIntro: "Prove o menor privilégio com kubectl auth can-i, sem precisar de nuvem:",
    handsOn: [
      "Crie namespace, SA e Role de só-leitura de pods: kubectl create namespace lab; kubectl create serviceaccount leitor -n lab; kubectl create role ler-pods --verb=get,list --resource=pods -n lab; kubectl create rolebinding bind-leitor --role=ler-pods --serviceaccount=lab:leitor -n lab.",
      "A SA PODE listar pods? kubectl auth can-i list pods -n lab --as=system:serviceaccount:lab:leitor → yes.",
      'A SA PODE deletar pods? (não concedemos "delete") → no.',
      "A SA PODE ler Secrets? (não concedemos esse recurso) → no.",
      "Limpe: kubectl delete namespace lab. Crachá que só abre uma porta: quem o rouba fica preso naquela sala.",
    ],
    tip: "Use kubectl auth can-i --as=... no CI pra validar que suas ServiceAccounts têm exatamente as permissões esperadas e nada além. Combine com IRSA/Workload Identity de escopo mínimo. Assim, mesmo que um container seja comprometido, o invasor fica preso ao que aquela identidade específica pode fazer. Faça a vistoria de credenciais antes do fim de semana começar, não depois do vazamento.",
    takeaway:
      'Uma SA por app + Role namespaced de verbos específicos + tokens de curta duração (IRSA/Workload Identity): é isso que transforma "container comprometido" em incidente contido, não em cluster perdido. Crachá nominal, que abre só a zona certa e expira sozinho: o Zero Trust do paddock aplicado ao cluster.',
    outro:
      "BANDEIRA QUADRICULADA À VISTA! O carro passou na chicane final sem tocar em nada, a vistoria da FIA aprovou, e o troféu é SEU. Nove setores completados de ponta a ponta. Você não é mais passageiro nesse cluster: você é o piloto no comando do muro. Mas todo campeão sabe que o troféu não fica parado na vitrine: ele volta pra fábrica pro test day que decide quem sobe da academia pra equipe principal. Etapa bônus, o pit stop que junta os dois módulos numa corrida só. Vem comigo.",
  },

  {
    id: "m10",
    num: "10",
    navTitle: "Exemplo profissional",
    tag: "capstone · da academia pro grid principal",
    title: "O exemplo profissional: o podinfo sobe pra equipe principal",
    narration:
      "Dezembro de 2024: a Mercedes anuncia que Kimi Antonelli, o piloto da academia que só tinha testado o carro no simulador da fábrica, assina como titular da equipe principal pra 2025, ao lado do Russell. Não é mais treino livre, é temporada inteira, sob os holofotes, sem margem pra erro de setup. O nosso podinfo, que rodou a Etapa 09 do módulo básico inteira isolado no simulador do Minikube, está prestes a passar pela mesma promoção. Capacete na cabeça: esta é a etapa bônus que fecha os dois módulos numa corrida só.",
    lead: "Relembrando onde você parou: a Etapa 09 do módulo básico deixou o podinfo de pé com um ConfigMap, um Deployment de 3 réplicas, um Service NodePort e um HPA de 2 a 8. Funciona, mas é o carro da academia: um ambiente só, copiado e colado à mão, rodando com a ServiceAccount default (o crachá genérico de visitante), sem nenhuma garantia de que as réplicas não caiam todas juntas se um nó falhar, e sem nenhum jeito de testar uma versão nova sem apostar as 3 réplicas de uma vez. As nove etapas deste módulo ensinaram, cada uma, a peça que fecha exatamente esses furos. Esta décima etapa monta o carro que vai pra pista de verdade.",
    concept: [
      "O Helm (Etapa 04) é a fôrma que agora hospeda tudo. O ConfigMap, o Service e o HPA da Etapa 09 do básico entram no chart sem mudar uma linha, viram templates/configmap.yaml, templates/service.yaml e templates/hpa.yaml: a mesma peça, só que agora fabricada em série. O Deployment é o único que ganha reforço estrutural de verdade, porque é nele que moram a identidade, o espalhamento e o ritmo de troca. E o mesmo chart serve dev, staging e prod trocando só o arquivo de values, o resto (Chart.yaml, templates/) nunca muda: a fôrma do carro é uma só, a folha de setup é que muda de circuito.",
      'Identidade mínima (Etapa 09): o podinfo ganha a sua própria ServiceAccount, nunca mais a default. Mas repare na diferença pro exemplo da Etapa 09 (a analytics-sa, que precisava ler pods e configmaps): o podinfo é só um servidor HTTP, ele NUNCA fala com a API Server pra fazer o próprio trabalho. Então o crachá dele não abre porta nenhuma do RBAC (nenhum Role, nenhum RoleBinding) e o token de acesso nem é montado no pod (automountServiceAccountToken: false). É o menor privilégio levado ao extremo lógico: zero credencial onde zero credencial é necessária, a versão mais estrita do "crachá nominal" que a Etapa 09 ensinou.',
      "Alta disponibilidade real e ritmo de troca (Etapas 01, 02 e 03): tiramos o limit de CPU dos recursos (a lição da Buffer, Etapa 01), porque o podinfo é latency-sensitive e o teto de CPU vira throttling do CFS em picos curtos; o pod passa a Burstable, com folga de CPU ociosa sem risco de engasgo artificial. Um topologySpreadConstraints (Etapa 02) espalha as réplicas por nó com maxSkew: 1, pra um nó caído nunca levar o serviço inteiro junto. E a estratégia de rollout (Etapa 03) ganha freio e potência definidos: maxUnavailable: 0 nunca reduz a capacidade mínima, maxSurge cria um pod extra por vez, e um PodDisruptionBudget garante que nem uma drenagem de nó planejada tire réplicas demais de uma vez. Vale registrar a ressalva da própria Etapa 02: eviction por PRESSÃO de recurso (nó sem memória) ignora o PDB, porque é emergência; o PDB protege contra disrupção VOLUNTÁRIA (drain, upgrade de nó, consolidação do Karpenter), não contra a garagem pegando fogo.",
      "O que fica de fora, e por quê: Karpenter (Etapa 07) e IRSA/Workload Identity (Etapa 09) são conceitos de nuvem real, sem efeito num Minikube de 1 nó, então ficam só na prosa, como a própria Etapa 07 já tratou o gatilho de pods Pending. cert-manager (Etapa 09) depende de uma CA de verdade; sem ingress com TLS neste laboratório, não tem o que renovar. KEDA (Etapa 08) não entra porque o HPA que já veio pronto da Etapa 09 do básico cobre exatamente o perfil do podinfo (API HTTP que nunca deveria ir a zero, dado o PDB); scale-to-zero orientado a fila brilha em worker de fila, não numa API pública sempre-ligada. E Blue/Green (Etapa 05) fica de fora por escolha, não por limitação: pra um único Service público, você escolhe UMA estratégia de promoção, e o Canário (Etapa 06), progressivo e orientado a dado real, encaixa melhor num serviço que já tem métrica de saúde (/healthz, /readyz) do que a virada seca de 100% do Blue/Green.",
    ],
    pointsTitle: "Cada peça, na etapa que ensinou ela",
    points: [
      {
        t: "Helm → o chart que hospeda tudo",
        d: "Etapa 04: ConfigMap, Service e HPA da Etapa 09 do básico viram templates sem mudar uma linha; só o Deployment ganha reforço. Um values.yaml por ambiente, a mesma fôrma.",
        color: "blue",
      },
      {
        t: "ServiceAccount sem nenhuma permissão",
        d: "Etapa 09: o podinfo nunca fala com a API Server, então ganha identidade própria sem nenhum Role e sem token montado (automountServiceAccountToken: false). O menor privilégio levado ao limite.",
        color: "violet",
      },
      {
        t: "Sem limit de CPU",
        d: "Etapa 01: evita o throttling do CFS num app latency-sensitive (a lição da Buffer). O pod vira Burstable: folga de CPU ociosa, mas ainda cede memória sob pressão real.",
        color: "signal",
      },
      {
        t: "Topology Spread + PDB",
        d: "Etapa 02: maxSkew: 1 espalha réplicas por nó (ScheduleAnyway no Minikube de 1 nó; DoNotSchedule em produção multi-nó); o PDB garante um piso de réplicas de pé sob drenagem planejada.",
        color: "teal",
      },
      {
        t: "RollingUpdate tunado",
        d: "Etapa 03: maxUnavailable: 0 (freio) + maxSurge (potência) + change-cause no rollout history. Zero downtime de verdade, com o motivo de cada troca registrado.",
        color: "ember",
      },
      {
        t: "Canário via release paralela do Helm",
        d: "Etapa 06: uma segunda release, mesmo label, poucas réplicas, versão nova. O Service enxerga as duas, o tráfego se divide pela proporção, e a promoção é um helm upgrade --atomic.",
        color: "blue",
      },
    ],
    examplesTitle: "O chart Helm, a identidade mínima e o canário: tudo junto",
    examples: [
      {
        label: "values.yaml (produção)",
        lang: "yaml",
        code: `# values.yaml: a folha de setup do ambiente de produção
# (dev/staging usam o MESMO chart, só trocando -f values-dev.yaml,
#  tipicamente com replicaCount menor e sem podDisruptionBudget)
replicaCount: 3                # o chute de largada; o HPA (herdado da Etapa 09
                                # do básico) assume o número dali pra frente
image:
  repository: stefanprodan/podinfo
  tag: "6.14.1"                 # nunca "latest" em produção
serviceAccount:
  name: podinfo-sa              # crachá nominal, nunca o default
resources:
  requests: { cpu: 100m, memory: 64Mi }
  limits:   { memory: 128Mi }   # SEM limit de cpu (Etapa 01: evita throttling do CFS)
rollout:
  maxUnavailable: 0             # freio: nunca reduz a capacidade mínima
  maxSurge: 1                   # potência: 1 pod extra por vez
  minReadySeconds: 10
topologySpread:
  maxSkew: 1                    # no máx. 1 réplica de diferença entre nós
podDisruptionBudget:
  minAvailable: 2               # nunca menos de 2 réplicas de pé sob drenagem planejada
hpa:                             # consumido pelo templates/hpa.yaml herdado do básico
  minReplicas: 2
  maxReplicas: 8
  targetCPUUtilization: 70`,
      },
      {
        label: "templates/deployment.yaml",
        lang: "yaml",
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: podinfo
  annotations:
    kubernetes.io/change-cause: "{{ .Values.image.tag }}"  # Etapa 03: alimenta o rollout history
spec:
  replicas: {{ .Values.replicaCount }}
  minReadySeconds: {{ .Values.rollout.minReadySeconds }}
  revisionHistoryLimit: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: {{ .Values.rollout.maxUnavailable }}   # Etapa 03: o freio
      maxSurge: {{ .Values.rollout.maxSurge }}                # Etapa 03: a potência
  selector:
    matchLabels: { app: podinfo }
  template:
    metadata:
      labels: { app: podinfo }
    spec:
      serviceAccountName: {{ .Values.serviceAccount.name }}   # Etapa 09: nunca a default
      topologySpreadConstraints:               # Etapa 02: espalha com garantia numérica
        - maxSkew: {{ .Values.topologySpread.maxSkew }}
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: ScheduleAnyway     # Minikube de 1 nó: DoNotSchedule prenderia
          labelSelector: { matchLabels: { app: podinfo } }  # as réplicas 2 e 3 em Pending pra
      containers:                                            # sempre. Produção multi-nó: DoNotSchedule.
        - name: podinfo
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          ports: [ { containerPort: 9898 } ]
          envFrom: [ { configMapRef: { name: podinfo-config } } ]  # a config da Etapa 09 do básico
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          livenessProbe:
            httpGet: { path: /healthz, port: 9898 }
            periodSeconds: 10
            failureThreshold: 3
          readinessProbe:
            httpGet: { path: /readyz, port: 9898 }
            periodSeconds: 5`,
        note: "Repare no que NÃO está aqui: nenhum PVC (o motivo continua o mesmo da Etapa 09 do básico) e nenhum podAntiAffinity. A própria Etapa 02 recomendou Topology Spread em vez de inter-pod affinity acima de poucas dezenas de nós, e este chart segue o próprio conselho do módulo.",
      },
      {
        label: "templates/serviceaccount.yaml + pdb.yaml",
        lang: "yaml",
        code: `# templates/serviceaccount.yaml: identidade própria, ZERO permissão
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ .Values.serviceAccount.name }}
automountServiceAccountToken: false   # o podinfo nunca fala com a API Server:
                                       # nem o token é montado no pod. Sem Role,
                                       # sem RoleBinding: não há o que conceder.
---
# templates/pdb.yaml: nunca menos de N réplicas de pé sob drenagem planejada
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: podinfo }
spec:
  minAvailable: {{ .Values.podDisruptionBudget.minAvailable }}
  selector:
    matchLabels: { app: podinfo }`,
      },
      {
        label: "install, canário e promoção",
        lang: "sh",
        code: `# 1) Sobe a produção com a release "podinfo"
helm install podinfo ./podinfo-chart -f values.yaml -n podinfo --create-namespace
kubectl get pods -n podinfo -o wide

# 2) CANÁRIO: uma segunda release, MESMO label app=podinfo, 1 réplica só, versão nova
helm install podinfo-canary ./podinfo-chart -f values.yaml \\
  --set replicaCount=1 --set image.tag=6.15.0 \\
  --set podDisruptionBudget.minAvailable=0 -n podinfo

# 3) O Service da release "podinfo" enxerga as duas releases: 4 endpoints
kubectl get endpoints podinfo -n podinfo
#   -> 4 IPs (3 da v6.14.1 + 1 da v6.15.0): o canário recebe ~25% do tráfego real

# 4) Telemetria limpa? Promove a versão na release principal...
helm upgrade podinfo ./podinfo-chart -f values.yaml \\
  --set image.tag=6.15.0 --atomic -n podinfo

# 5) ...e desliga o carro de teste
helm uninstall podinfo-canary -n podinfo

# 6) A troca ficou registrada (change-cause = a própria tag)
kubectl rollout history deployment/podinfo -n podinfo`,
        note: "--atomic faz o Helm reverter sozinho se o upgrade não ficar saudável dentro do timeout (o rollback automático da Etapa 03, agora garantido pelo próprio Helm). O canário nunca tira réplicas da v1: ele soma, então o Service nunca fica abaixo do que o PDB da produção exige.",
      },
      {
        label: "a prova de identidade mínima",
        lang: "sh",
        code: `# A SA do podinfo não pode NADA — prove, igual à Etapa 09, só que ao contrário:
kubectl auth can-i list pods -n podinfo --as=system:serviceaccount:podinfo:podinfo-sa
#   -> no
kubectl auth can-i get configmaps -n podinfo --as=system:serviceaccount:podinfo:podinfo-sa
#   -> no
kubectl auth can-i get secrets -n podinfo --as=system:serviceaccount:podinfo:podinfo-sa
#   -> no

# O PDB e o efeito de uma drenagem planejada:
kubectl get pdb podinfo -n podinfo
NAME      MIN AVAILABLE   ALLOWED DISRUPTIONS
podinfo   2               1

# Limpeza final dos dois módulos:
helm uninstall podinfo podinfo-canary -n podinfo 2>/dev/null
kubectl delete namespace podinfo`,
        note: 'Na Etapa 09, a analytics-sa tinha "yes" pra list pods: um privilégio concedido de propósito. Aqui é "no" pra tudo: a prova de que um app sem motivo pra falar com a API Server não ganha NENHUMA credencial, nem por comodidade.',
      },
    ],
    commands: [
      {
        cmd: "helm install <release> ./chart -f values.yaml --set k=v -n <ns>",
        note: "sobe uma release (produção ou canário, mudando só os --set)",
      },
      {
        cmd: "helm upgrade <release> ./chart -f values.yaml --set image.tag=X --atomic -n <ns>",
        note: "promove a versão, com rollback automático se não ficar saudável",
      },
      {
        cmd: "kubectl get endpoints <service> -n <ns>",
        note: "confirma quantas réplicas (de quais releases) o Service está enxergando",
      },
      { cmd: "kubectl get pdb -n <ns>", note: "piso de disponibilidade sob drenagem planejada" },
    ],
    handsOnIntro:
      "A curva final dos dois módulos: monte o chart, prove a identidade mínima, e promova uma versão nova sem apostar tudo de uma vez.",
    handsOn: [
      "Empacote os 4 manifestos da Etapa 09 do básico (ConfigMap, Deployment, Service, HPA) num chart Helm, adicionando os 3 arquivos novos desta etapa: values.yaml, o ServiceAccount sem permissões e o PodDisruptionBudget.",
      "Suba a produção: helm install podinfo ./podinfo-chart -f values.yaml -n podinfo --create-namespace, e confirme 3 réplicas Running com kubectl get pods -n podinfo -o wide.",
      "Rode a prova de identidade mínima: as 3 chamadas kubectl auth can-i pra podinfo-sa. Diferente da analytics-sa da Etapa 09, aqui todas retornam no, porque o app não tem nenhum motivo pra chamar a API Server.",
      "Confirme o PDB: kubectl get pdb podinfo -n podinfo e observe ALLOWED DISRUPTIONS.",
      "Suba o canário: helm install podinfo-canary ... --set replicaCount=1 --set image.tag=6.15.0, e confira com kubectl get endpoints podinfo -n podinfo que agora existem 4 IPs, um deles já servindo tráfego real da versão nova.",
      "Promova: helm upgrade podinfo ... --set image.tag=6.15.0 --atomic, e desligue o carro de teste com helm uninstall podinfo-canary. Confirme com kubectl rollout history deployment/podinfo -n podinfo que a troca ficou registrada.",
      "Limpe os dois módulos: helm uninstall podinfo -n podinfo (ignore erro se o canário já saiu) e kubectl delete namespace podinfo.",
    ],
    tip: 'helm upgrade --atomic sozinho não é uma garantia completa: ele desfaz a release se as probes não ficarem saudáveis, mas só DEPOIS de tentar. Combine sempre com o PDB e um maxUnavailable baixo, pra que a tentativa fracassada nunca derrube capacidade demais enquanto o "atomic" ainda está decidindo se desiste. É o airbag, não o cinto de segurança: os dois juntos, não um no lugar do outro.',
    takeaway:
      "Produção de verdade não é mais YAML, é a composição certa: Helm empacota, uma ServiceAccount sem nenhuma permissão isola a identidade no menor privilégio possível, Topology Spread mais PDB garantem que uma falha de nó nunca tira o serviço do ar, RollingUpdate tunado garante zero downtime, e um canário via release paralela do Helm testa a versão nova com tráfego real antes de comprometer todo mundo.",
    outro:
      "PÓDIO NOS DOIS MÓDULOS! O podinfo saiu de um pod solto no simulador da Etapa 09 do básico pra uma release de produção com identidade mínima, alta disponibilidade real e um pit stop de canário auditável, do jeito que uma equipe principal de verdade opera. Dezenove etapas, dois módulos, um piloto só: você. A próxima corrida é sua: um cluster de nuvem de verdade, com Karpenter provisionando nó e KEDA escalando por fila, os dois setores que este laboratório só pôde te mostrar de longe. Boa pista!",
  },
];
