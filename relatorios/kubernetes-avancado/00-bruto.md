# Kubernetes Avançado — relatório de estudo

> Conteúdo extraído das 9 aulas do módulo **DevOps e Arquitetura Cloud — Fase 2** (FIAP). As fontes originais (PDFs por aula) estão em `fonte/`. Cada etapa corresponde a uma aula. Os hands-on originais usam Rust + `kube-rs`; aqui priorizamos os conceitos, YAML e `kubectl` porque são a parte durável e transferível — o código Rust é só uma das formas de automatizar o mesmo comportamento.

Este é o guia da **Fase 2**: assume que você já sabe o básico (Pods, Deployments, Services, `kubectl`, YAML declarativo) e sobe o nível para operar clusters de verdade — saúde, agendamento fino, estratégias de deploy sem downtime, autoscaling de nós e de aplicações, empacotamento com Helm e segurança.

## Etapa 01 — Saúde da aplicação e gerenciamento de recursos

Um cluster não serve de nada se as aplicações dentro dele travam sem que ninguém perceba, ou se um pod glutão derruba os vizinhos. Esta etapa é sobre as duas ferramentas que garantem que o Kubernetes cuide da saúde dos seus apps automaticamente: **probes** (sondas de saúde) e **requests/limits** (contrato de recursos).

O Kubernetes precisa de um jeito de perguntar "você ainda está vivo?" e "você está pronto pra receber tráfego?". Sem isso, ele só sabe se o processo do container morreu — mas um app pode estar de pé e travado (deadlock), respondendo 500 pra todo mundo. As probes resolvem isso. São três:

- **Liveness probe** — "você travou?" Se falhar N vezes seguidas, o kubelet **reinicia o container**. É a autocura do Kubernetes. Use pra detectar travamentos irrecuperáveis (deadlock), não lentidão passageira — senão você entra num ciclo de reinícios.
- **Readiness probe** — "você está pronto pra receber requisições?" Se falhar, o pod é **tirado do balanceador** (removido dos endpoints do Service), mas **não é reiniciado**. Volta sozinho quando a dependência se recupera. É o que garante rollout sem erro pro usuário.
- **Startup probe** — "você já terminou de subir?" Protege apps de inicialização lenta: enquanto ela não passa, liveness e readiness ficam suspensas, evitando que o app seja morto durante um boot demorado.

A segunda peça é o gerenciamento de recursos. Todo container declara:

- **requests** — o que ele *reserva*. O scheduler usa isso pra decidir em qual nó cabe. É o piso garantido.
- **limits** — o teto que ele *não pode passar*. Estourar o limite de memória = **OOMKill** (kernel mata o container). Estourar o de CPU = **throttling** (o kernel atrasa o processo pra mantê-lo na cota).

Da combinação de requests e limits nasce a **classe de QoS** do pod, que decide quem morre primeiro sob pressão:
- **Guaranteed** (requests == limits em todos os containers) — os últimos a serem sacrificados.
- **Burstable** (requests < limits) — podem usar folga ociosa, mas cedem sob contenção.
- **BestEffort** (sem requests nem limits) — os primeiros a serem despejados.

Um ponto contraintuitivo importante (caso real da **Buffer**): colocar limite de CPU pode *piorar* a latência. O algoritmo de quota do CFS (o escalonador do Linux) pode throttlar um pod mesmo com uso médio baixo, porque pequenos picos consomem a cota de 100ms e o processo fica congelado até o próximo período. A Buffer removeu os limits de CPU de serviços sensíveis a latência e viu o p99 cair de 5 a 10x. A lição: em multi-tenant você quer limits pra isolamento; em serviço latency-sensitive, às vezes menos é mais.

### Conceitos-chave

- **Liveness ≠ Readiness** — liveness reinicia; readiness só tira do tráfego. Confundir as duas causa reinícios em cascata.
- **Startup probe** — dá tempo pro app subir antes das outras probes valerem.
- **requests = reserva (scheduling), limits = teto (OOMKill/throttling)** — sempre defina requests; pods sem requests viram BestEffort e são despejados primeiro.
- **QoS: Guaranteed > Burstable > BestEffort** — a ordem inversa da fila de despejo.
- **CPU throttling** — limite de CPU pode adicionar latência artificial mesmo com uso baixo (bug do CFS quota).
- **Disponibilidade** — `A = MTBF / (MTBF + MTTR)`. Réplicas em paralelo multiplicam disponibilidade (2 pods a 99% ≈ 99,99%); o Service age como um "OU lógico" — basta um pod `Ready`.
- **Golden Signals (Google SRE)** — latência, tráfego, erros e saturação. Probes cobrem saturação/erro; para o resto, Prometheus + Grafana.

### Exemplo — Deployment com as três probes e recursos

```yaml
apiVersion: apps/v1
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
          startupProbe:            # protege o boot lento
            httpGet: { path: /healthz, port: 8080 }
            failureThreshold: 30   # até 30 x 10s = 5min pra subir
            periodSeconds: 10
          livenessProbe:           # travou? reinicia
            httpGet: { path: /healthz, port: 8080 }
            periodSeconds: 10
            failureThreshold: 3
          readinessProbe:          # pronto? entra no balanceador
            httpGet: { path: /ready, port: 8080 }
            periodSeconds: 5
          resources:
            requests: { cpu: 100m, memory: 128Mi }
            limits:   { memory: 256Mi }   # sem limit de CPU (evita throttling)
```

### Comandos

- `kubectl describe pod <pod>` — mostra eventos de probe, OOMKill, reinícios (procure `Liveness probe failed`, `OOMKilled`).
- `kubectl top pod` / `kubectl top node` — uso real de CPU/memória vs. requests/limits (precisa do metrics-server).
- `kubectl get pod <pod> -o jsonpath='{.status.qosClass}'` — mostra a classe de QoS.

**Dica:** não coloque checagem de banco de dados na *liveness* probe. Se o banco cair, todas as réplicas falham a liveness ao mesmo tempo, reiniciam juntas e você tem uma falha em cascata. Cheque dependências na *startup* (pra não subir sem elas) e degrade graciosamente depois.

## Etapa 02 — Agendamento avançado e comportamento de nós

Por padrão o scheduler coloca o pod em qualquer nó onde ele caiba. Mas e se o pod precisa de GPU? E se você quer reservar nós caros só pra certas cargas? E se um nó fica sem memória — quem morre? Esta etapa é sobre controlar *onde* os pods rodam e *como* o cluster se protege.

Três mecanismos, com papéis complementares:

**Taints e Tolerations — repelir.** Um *taint* é uma marca no nó dizendo "não coloque pods aqui a menos que eles tolerem X". A *toleration* é a marca no pod dizendo "eu sei lidar com X, posso ir". Um taint tem chave, valor e efeito:
- `NoSchedule` — não agenda pods não-tolerantes (os que já rodam ficam).
- `PreferNoSchedule` — evita, mas não é absoluto.
- `NoExecute` — além de barrar novos, **expulsa** os pods sem toleration que já estavam lá (útil pra esvaziar um nó pra manutenção).

Ponto crucial: **taint só repele, não atrai**. Um pod que *tolera* o nó de GPU pode acabar num nó comum também. Pra garantir que ele vá *só* pra GPU, combine com affinity.

**Node Affinity — atrair.** É a contraparte positiva: "eu quero ir pra nós com o label X". Dois modos:
- `requiredDuringScheduling...` — obrigatório (hard). Sem o label, não agenda.
- `preferredDuringScheduling...` — preferência (soft), com peso; se não tiver, agenda em outro lugar.

**Pod Affinity / Anti-Affinity — relacionar pods entre si.** Em vez de olhar labels do nó, olha os pods que já estão lá. *Affinity* aproxima ("coloque o cache perto do front-end na mesma zona"); *anti-affinity* separa ("não coloque duas réplicas do banco no mesmo nó/zona"), aumentando disponibilidade. Cuidado: inter-pod affinity é caro no scheduler — a doc não recomenda em clusters acima de "algumas centenas" de nós. Pra espalhamento com garantia numérica, prefira **Topology Spread Constraints** (`maxSkew`).

**Eviction sob pressão — a autoproteção do nó.** Quando um nó fica sem memória, disco ou PIDs, o kubelet age antes do colapso. Primeiro tenta limpar (containers mortos, imagens não usadas). Se não resolve, começa a **despejar pods** nesta ordem: primeiro os que excedem suas requests (BestEffort e Burstable "estourados"), depois por PriorityClass, por último os Guaranteed. Detalhes importantes:
- Eviction **ignora o PodDisruptionBudget** — é emergência.
- `eviction-minimum-reclaim` evita o efeito dominó (matar um pod de cada vez sem nunca resolver — o "eviction storm" que derrubou ~50 pods numa startup por disco cheio de logs).
- **Eviction ≠ OOMKill**: OOMKill é o cgroup matando *um container* que passou do limit; eviction é o kubelet retirando *pods* pra salvar o *nó*.

### Conceitos-chave

- **Taint repele, affinity atrai** — pra isolamento forte (ex.: nó de GPU só pra ML), combine os dois.
- **Efeitos de taint**: `NoSchedule`, `PreferNoSchedule`, `NoExecute` (esse expulsa).
- **required (hard) vs. preferred (soft)** na affinity.
- **Anti-affinity** espalha réplicas pra reduzir raio de falha; **Topology Spread Constraints** faz isso com `maxSkew` e escala melhor.
- **Ordem de despejo**: BestEffort → Burstable estourado → (por prioridade) → Guaranteed.
- **PriorityClass** — pods de sistema (`system-cluster-critical`) têm prioridade altíssima e quase nunca são despejados/preemptados.
- **Bin packing NP-difícil** — alocar pods em nós com múltiplas restrições é NP-hard; o scheduler usa heurística gulosa (filtra nós → pontua → escolhe), rápida mas não ótima.

### Exemplo — pod de ML que exige nó com GPU

```yaml
# 1) marca o nó de GPU (uma vez, via kubectl)
#    kubectl taint nodes gpu-node-1 nvidia.com/gpu=true:NoSchedule
apiVersion: v1
kind: Pod
metadata: { name: treino-ml }
spec:
  tolerations:                     # tolera o taint da GPU
    - key: "nvidia.com/gpu"
      operator: "Equal"
      value: "true"
      effect: "NoSchedule"
  affinity:
    nodeAffinity:                  # E exige ir pra um nó com GPU
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: "accelerator"
                operator: In
                values: ["nvidia-gpu"]
  containers:
    - name: treino
      image: myregistry/treino:1.0
      resources:
        limits: { nvidia.com/gpu: 1 }
```

### Comandos

- `kubectl taint nodes <nó> chave=valor:NoSchedule` — aplica taint (adicione `-` no fim pra remover).
- `kubectl label nodes <nó> accelerator=nvidia-gpu` — rotula pra affinity.
- `kubectl describe node <nó>` — mostra taints, labels, pods e pressão de recursos.
- `kubectl get events --field-selector reason=Evicted` — lista despejos recentes.

**Dica:** monitore uso de disco/memória dos nós e alerte em 85%, *antes* de chegar nos ~95% que disparam eviction. Junto com log rotation, isso evita o "eviction storm". Prefira reagir manualmente (drenar o nó) a deixar o kubelet despejar em pânico.

## Etapa 03 — Estratégias de atualização e rollouts

Atualizar em produção sem derrubar o serviço e sem misturar versões incompatíveis. No Kubernetes, quem gerencia isso é o **Deployment**, que suporta duas estratégias nativas.

**RollingUpdate (padrão)** — substitui os pods aos poucos, mantendo o serviço no ar. O controlador cria um novo ReplicaSet e reduz o antigo proporcionalmente. Dois parâmetros controlam o ritmo:
- **maxUnavailable** — quantos pods podem ficar indisponíveis durante a troca (o *freio*: garante o piso de disponibilidade). Padrão 25%.
- **maxSurge** — quantos pods a *mais* que o desejado podem existir temporariamente (a *potência*: acelera criando extras). Padrão 25%.

Com N réplicas e padrões, durante o rollout você tem no mínimo `(1 − 0,25)·N = 75%` disponíveis e no máximo `(1 + 0,25)·N = 125%` rodando. Não é permitido `maxUnavailable` e `maxSurge` ambos zero.

**Recreate** — derruba *tudo* da v1 antes de subir a v2. Causa downtime, mas garante que as duas versões nunca coexistem — necessário quando v1 e v2 são incompatíveis (ex.: migração de banco que quebra a versão antiga).

O tuning é um trade-off: `maxUnavailable` alto acelera mas comprime a capacidade (a fila de requisições cresce — pense em `ρ = λ/(cμ)` num M/M/c: se `c` cai, a utilização sobe e a latência explode). `maxSurge` alto acelera mas dobra pods → dobra conexões → pode saturar o banco. Duas receitas úteis:
- **Disponibilidade-primeiro**: `maxUnavailable: 0` (nunca reduz capacidade), `maxSurge` generoso dentro do orçamento de recursos.
- **Tempo-mínimo sob orçamento**: escolhe `s` e `u` saturando os limites de pico (`(1+s)·N ≤ B`) e degradação mínima (`(1−u)·N ≥ D`).

Ferramentas de garantia: `minReadySeconds` (o pod precisa ficar `Ready` por X segundos antes de contar como disponível — evita oscilação), `progressDeadlineSeconds` (padrão 600s; se o rollout empaca, marca `ProgressDeadlineExceeded`), `revisionHistoryLimit` (padrão 10; quantas revisões guardar pra rollback).

Estratégias mais sofisticadas (Blue/Green, Canary — próximas etapas) **não são nativas** do Deployment; controladores como **Argo Rollouts** e **Flagger** as adicionam com gates de promoção automáticos.

### Conceitos-chave

- **RollingUpdate** = zero-downtime; **Recreate** = consistência total ao custo de downtime.
- **maxSurge = potência (acelera), maxUnavailable = freio (protege disponibilidade)**.
- Padrões 25%/25% → 75% mínimo disponível, 125% máximo em execução.
- **minReadySeconds** evita marcar como pronto um pod que ainda vai cair.
- **progressDeadlineSeconds** detecta rollout travado (mas o Deployment não faz rollback sozinho).
- Rollout só dispara com mudança em `.spec.template` — escalar réplicas não conta.
- **Argo Rollouts / Flagger** trazem canary e blue/green nativos com análise automática de métricas (Kayenta da Netflix é a referência de canary analysis estatística).

### Exemplo — RollingUpdate "disponibilidade-primeiro"

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  annotations:
    kubernetes.io/change-cause: "Rollout v2.0.0"   # aparece no history
spec:
  replicas: 10
  minReadySeconds: 30
  progressDeadlineSeconds: 600
  revisionHistoryLimit: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0        # nunca reduz a capacidade mínima
      maxSurge: "50%"          # cria até 5 pods extras pra acelerar
  selector: { matchLabels: { app: myapp } }
  template:
    metadata: { labels: { app: myapp } }
    spec:
      containers:
        - name: app
          image: myregistry/myapp:2.0.0
          readinessProbe:
            httpGet: { path: /healthz, port: 8080 }
```

### Comandos

- `kubectl rollout status deployment/myapp` — acompanha o rollout (sai com código ≠ 0 se estourar o deadline).
- `kubectl rollout history deployment/myapp` — lista as revisões (com a `change-cause`).
- `kubectl rollout undo deployment/myapp` — reverte pra revisão anterior (`--to-revision=N` pra uma específica).
- `kubectl rollout pause/resume deployment/myapp` — congela/retoma no meio (útil pra canário manual).

**Dica:** sempre preencha a annotation `kubernetes.io/change-cause` (ou use `--record`). Sem ela, o `rollout history` fica cego e você não sabe pra qual revisão voltar quando o incidente chegar às 3h da manhã.

## Etapa 04 — Gerenciador de pacotes com Helm Charts

Gerenciar dezenas de YAMLs, um conjunto por ambiente (dev, staging, prod), com 95% de campos repetidos, é um pesadelo que viola DRY e convida ao erro. O **Helm** é o "apt/yum do Kubernetes": empacota manifestos em **Charts** parametrizados, reutilizáveis e versionados.

Um chart tem uma estrutura simples:
- **`Chart.yaml`** — metadados. `version` é a versão do *chart*; `appVersion` é a versão da *aplicação* empacotada. Ambos seguem SemVer, e separá-los ajuda a governança (evoluir o chart sem trocar o app).
- **`values.yaml`** — os valores padrão configuráveis (réplicas, imagem, porta, recursos). É aqui que fica tudo que varia por ambiente.
- **`templates/`** — os manifestos como templates Go + funções Sprig. `{{ .Values.replicaCount }}` insere o valor; helpers em `_helpers.tpl` evitam repetição de lógica (nomes, labels).

A grande sacada teórica: um template Helm é uma **função pura** `T(valores) → YAML`. Mesmos inputs, mesma saída — previsível e testável (`helm template` renderiza sem aplicar). Isso encarna dois pilares de Infraestrutura como Código:
- **Idempotência** — aplicar N vezes tem o mesmo efeito que aplicar uma (`f(f(x)) = f(x)`). Rodar `helm upgrade` de novo sem mudar nada não faz nada. Segurança pra reexecutar pipelines.
- **Imutabilidade** — não muta o objeto existente; cria uma nova versão e mantém o histórico. É o que torna rollback confiável.

O ciclo de vida é: `helm install` (cria e registra a release num Secret), `helm upgrade` (calcula o diff e aplica só as mudanças, incrementa a revisão), `helm rollback` (volta pra uma revisão anterior salva). O Helm 3 não tem servidor central (Tiller) — o cliente usa direto as credenciais do `kubectl`, então **o RBAC do usuário limita o que o Helm pode fazer**.

Governança em escala: charts seguem SemVer (major = quebra, exige revisão humana), são distribuídos por repositórios (Artifact Hub, privados), podem ser **assinados digitalmente** (GPG + arquivo `.prov`) pra garantir supply chain, e devem embutir RBAC de menor privilégio (ServiceAccounts dedicadas, Roles limitadas — nada de `cluster-admin`). Subcharts permitem composição (um "umbrella chart" que junta app + banco), e `values.schema.json` valida os inputs como um "sistema de tipos" pros valores.

### Conceitos-chave

- **Chart** = pacote reutilizável; **values** = parâmetros; **templates** = manifestos parametrizados (DRY).
- **`version` (do chart) ≠ `appVersion` (do app)** — ambos SemVer.
- **Template = função pura** — determinístico, testável com `helm template`.
- **Idempotência** (aplicar N vezes = 1) + **imutabilidade** (nova versão, não muta) = rollback confiável.
- **Helm 3 usa o RBAC do kubectl** — sem Tiller; o que o usuário não pode, o Helm não faz.
- **Governança**: SemVer, repositórios, assinatura (`.prov`), RBAC de menor privilégio, `values.schema.json`.
- **Sinergia com GitOps** (ArgoCD/Flux): chart no Git → sync automático → cada release é um commit auditável.

### Exemplo — trechos de um chart

```yaml
# Chart.yaml
apiVersion: v2
name: myapp
version: 0.1.0          # versão do chart
appVersion: "1.0.0"     # versão da aplicação
type: application
```

```yaml
# values.yaml
replicaCount: 2
image:
  repository: myregistry/myapp
  tag: "1.0.0"
  pullPolicy: IfNotPresent
service: { type: ClusterIP, port: 80 }
resources:
  requests: { cpu: 250m, memory: 128Mi }
  limits:   { cpu: 500m, memory: 256Mi }
```

```yaml
# templates/deployment.yaml (trecho)
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
```

### Comandos

- `helm create <chart>` — gera a estrutura básica.
- `helm template ./chart` — renderiza o YAML sem aplicar (dry-run local).
- `helm install <release> ./chart -n <ns>` — instala.
- `helm upgrade <release> ./chart --set image.tag=1.1.0 --atomic` — atualiza (`--atomic` reverte se falhar).
- `helm history <release>` / `helm rollback <release> <rev>` — histórico e reversão.
- `helm lint ./chart` — valida boas práticas.

**Dica:** rode `helm diff upgrade` (plugin `helm-diff`) *antes* de aplicar em produção. Ver exatamente o que vai mudar no cluster evita surpresas de aplicar template "às cegas" — o medo número um de quem começa com Helm.

## Etapa 05 — Deploy Blue/Green

O "santo graal" do deploy sem sustos: mantenha **dois ambientes de produção idênticos** e alterne o tráfego entre eles quase instantaneamente. O **Blue** é a versão atual servindo 100%; o **Green** é a nova versão, pronta e quente, mas sem tráfego. Quando o Green é validado, você **vira a chave** e ele passa a servir tudo. Deu problema? Vira a chave de volta em segundos.

No Kubernetes, o truque é elegante: os dois conjuntos de pods têm labels diferentes (`env: blue`, `env: green`), e um **Service** aponta pra um deles via `selector`. A promoção é só um **patch no selector** do Service — o `kube-proxy` reconfigura o roteamento em instantes. O rollback é o patch inverso. Como os pods antigos continuam de pé (só sem tráfego), a reversão é instantânea, sem reimplantar nada.

Formalmente é uma transição atômica entre dois estados globais (B → G), com propriedade de rollback determinístico: uma operação única de swap, o "botão vermelho de emergência". Isso domina outras estratégias em minimizar o impacto: se a v2 falha após `Δt` segundos, só `λ·Δt` requisições foram afetadas — e você zera `Δt` revertendo na hora.

Mas há armadilhas:
- **Consistência de dados / esquema.** O maior desafio prático. Se a Green muda o banco de forma incompatível, reverter pra Blue quebra. A solução é **compatibilidade dupla temporária** (Martin Fowler): primeiro migrar o banco pra suportar as *duas* versões, validar, só então trocar o código. Sem isso, dados escritos pela Green podem inutilizar a Blue.
- **Custo.** Dois ambientes completos = ~100% de overhead durante a transição. A Etsy manteve 200% de capacidade. Boa prática: escalar o ambiente inativo pra zero após estabilizar.
- **Tempestade de conexões.** Trocar 100% de uma vez joga toda a carga na Green de repente — caches frios podem gerar um pico. Mitigação: aquecer a Green com tráfego sombra antes.

Antipadrão clássico: **não tratar a Green como produção o tempo todo**. Se você acumula mudanças esperando o "momento certo" de trocar, o salto Blue→Green vira gigante e arriscado. Blue/Green de verdade = deploy contínuo no ambiente passivo, só sem tráfego, virando a chave quando ganha confiança.

Ferramentas: **Argo Rollouts** suporta `blueGreen` nativo (com `preview` e promoção manual/automática por métricas); **Flagger** integra com service mesh. Curiosidade: Blue/Green também é chamado de **Red/Black** (Netflix/Spinnaker).

### Conceitos-chave

- **Dois ambientes idênticos**; só um serve tráfego por vez (ativo/passivo, "flip-flop").
- **A troca é um patch no `selector` do Service** — roteamento muda em segundos.
- **Rollback instantâneo e determinístico** — os pods antigos continuam prontos.
- **Compatibilidade de esquema é o calcanhar de Aquiles** — migre o banco de forma retrocompatível *antes* de trocar o código.
- **Overhead de ~100%** durante a transição — escale o inativo pra zero depois.
- **Trate a Green como produção contínua** — senão o salto de versão vira big-bang arriscado.
- **Blue/Green = "tudo ou nada"**; se quiser progressivo, é Canary (próxima etapa).

### Exemplo — o mesmo Service apontando pra blue, depois green

```yaml
# Service inicialmente apontando pro BLUE
apiVersion: v1
kind: Service
metadata: { name: myapp-service }
spec:
  selector: { app: myapp, env: blue }   # <- troca pra green na promoção
  ports: [ { port: 80, targetPort: 8080 } ]
```

```sh
# Promoção Blue -> Green: só repatch o selector
kubectl patch service myapp-service -p '{"spec":{"selector":{"app":"myapp","env":"green"}}}'

# Rollback: patch inverso, volta em segundos
kubectl patch service myapp-service -p '{"spec":{"selector":{"app":"myapp","env":"blue"}}}'
```

### Comandos

- `kubectl get endpoints myapp-service` — confirma pra quais pods o Service está roteando (valida a troca).
- `kubectl patch service ...` — executa a virada (mostrado acima).
- `kubectl scale deployment myapp-blue --replicas=0` — desliga o ambiente antigo após estabilizar.

**Dica:** antes de virar a chave, garanta que o banco aceita as duas versões. A pergunta a se fazer é sempre: "se eu precisar reverter pra Blue daqui a 5 minutos, os dados que a Green escreveu vão quebrar a Blue?". Se sim, você não está pronto pro cutover.

## Etapa 06 — Deploy Canário

Canary é o deploy cauteloso: em vez de expor todo mundo à v2, você manda **uma fração pequena** de usuários reais pra ela (o "canário na mina"), monitora métricas, e só aumenta se estiver tudo bem. Deu ruim? O impacto ficou contido nos poucos por cento e você reverte. É o oposto do "big bang".

A diferença pro Blue/Green: Blue/Green é "tudo ou nada" (100% de uma vez); Canary é **progressivo** (1% → 5% → 25% → 50% → 100%), validando a cada passo com carga real de produção. Você mantém as duas versões rodando e migra tráfego aos poucos.

O roteamento fino de tráfego é feito por um **service mesh** (Istio, Linkerd) ou ingress com peso: você define percentuais exatos (ex.: 90% v1 / 10% v2) independentes do número de réplicas, via proxies sidecar. No Istio, um `VirtualService` divide o tráfego entre subsets (v1/v2) e você ajusta os pesos dinamicamente.

O que decide promover ou reverter são **métricas em tempo real**: taxa de erro (5xx), latência (p95, p99), uso de recursos, métricas de negócio. Isso fecha um laço de realimentação — automatizável: se o erro do canário < threshold, aumenta o peso; se viola, rollback imediato pra v1.

A base teórica é rica e vale conhecer o vocabulário:
- **Teste A/B contínuo** — o canário é um experimento estatístico entre v1 (controle) e v2. Hipótese nula H₀: "não há diferença"; testa-se com significância (α = 0,05) via teste z de proporções, qui-quadrado, ou Mann-Whitney (o **Kayenta** da Netflix usa Mann-Whitney).
- **Testes sequenciais (SPRT de Wald)** — em vez de esperar amostra fixa, avalia continuamente e para cedo quando há evidência suficiente (pra promover ou abortar), poupando exposição.
- **Teoria de filas** — mesmo 10% de tráfego pode ter latência ruim se aqueles 10% quase saturam os pods v2 (`W = 1/(μ−λ)` explode perto da saturação). Serve pra extrapolar: se 20% já usa 30% de CPU, 100% vai precisar de mais réplicas.
- **Multi-armed bandits (Thompson Sampling)** — aloca tráfego adaptativamente, equilibrando exploração (testar) e explotação (favorecer a melhor), convergindo pra versão superior.

Casos reais: **Shopify** manda ~5% do tráfego por ~10min, com análise automática antes de ir a 100% — permite dezenas de deploys/dia. **Netflix** automatizou tudo com Kayenta no Spinnaker. **Nubank** usa feature flags + canary pra centenas de deploys/dia com confiança. Tendência: canários guiados por **SLOs** (freia se violar a meta de erro) e por **AI Ops**.

### Conceitos-chave

- **Canary = rollout progressivo** com validação por métricas a cada passo (1→5→25→50→100%).
- **Blue/Green vs Canary**: tudo-de-uma-vez vs. gradual e observável.
- **Roteamento por peso** via service mesh (Istio/Linkerd) ou ingress — independe do nº de réplicas.
- **Decisão orientada a dados**: erro, p95/p99, SLOs; promoção/rollback automáticos.
- **Canary analysis** (Kayenta) = teste estatístico baseline vs. canário; vira um "gate" automatizado.
- **SPRT / bandits** — parar cedo e alocar tráfego de forma ótima.
- Ferramentas: **Argo Rollouts** e **Flagger** implementam os steps + análise nativamente.

### Exemplo — split de tráfego com Istio (VirtualService)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata: { name: myapp }
spec:
  hosts: [ myapp ]
  http:
    - route:
        - destination: { host: myapp, subset: v1 }
          weight: 90        # estável
        - destination: { host: myapp, subset: v2 }
          weight: 10        # canário — sobe gradualmente
```

```yaml
# Argo Rollouts: steps de canário com pausa e análise
strategy:
  canary:
    steps:
      - setWeight: 5
      - pause: { duration: 60s }
      - analysis: { templates: [ { templateName: slo-check } ] }
      - setWeight: 25
      - pause: { duration: 60s }
      - setWeight: 100
```

### Comandos

- `kubectl -n istio-system get virtualservice` — inspeciona as regras de tráfego.
- `kubectl argo rollouts get rollout myapp --watch` — acompanha o canário (com o plugin do Argo Rollouts).
- `kubectl argo rollouts promote myapp` / `abort myapp` — promove ou aborta manualmente.

**Dica:** amarre o canário aos seus **SLOs**, não a métricas arbitrárias. Se o SLO de erro é 0,1%, o canário deve frear automaticamente quando a v2 violar isso. Assim o monitoramento de produção e o de deploy viram a mesma coisa — e a decisão de promover deixa de ser "achismo".

## Etapa 07 — Escalabilidade de nós com Karpenter

As etapas anteriores escalam *pods*. Mas e quando não há *nó* onde colocá-los? O autoscaling de **nós** entra aqui. O **Cluster Autoscaler** tradicional é lento e depende de grupos de nós fixos (ASGs) pré-configurados por tipo/zona — uma dor de manter. O **Karpenter** (criado pela AWS, open source, hoje multicloud) provisiona nós **just-in-time**, sob medida pros pods pendentes, sem grupos fixos: mais rápido (segundos a <1min), escolhe a instância ótima (inclusive Spot) e remove nós ociosos sozinho. Empresas relatam até 30% de economia.

O fluxo: pods ficam **unschedulable** (o scheduler não achou nó) → o Karpenter observa isso → calcula qual instância acomoda melhor esses pods → provisiona → os pods são agendados. E no sentido inverso: identifica nós subutilizados e **consolida** (move os pods pra outros nós e remove o nó ocioso, ou troca um On-Demand caro por um Spot mais barato).

A configuração é feita por **NodePools** (antes chamados Provisioners): definem as regras dos nós que o Karpenter pode lançar — tipos de instância permitidos, zonas, Spot vs On-Demand, limites. A recomendação é **restringir o mínimo possível**, pra dar liberdade de otimização ao Karpenter.

O problema que ele resolve é **bin packing multidimensional** (cada pod é um item com vetor CPU/memória, cada nó é um bin), que é **NP-difícil**. Então o Karpenter usa heurística gulosa: filtra tipos que não servem (sem GPU? fora; zona errada? fora), ordena por custo/adequação e faz algo próximo de First-Fit Decreasing (least-waste — a menor sobra). Diferença-chave pro Cluster Autoscaler: o CA preserva homogeneidade dentro de cada grupo (um pod pequeno pode acionar um nó grande, desperdiçando); o Karpenter faz **right-sizing** — nó pequeno pra pod pequeno, nó grande quando chegam pods grandes, misturando tipos conforme a necessidade.

Custos e Spot: instâncias **Spot** custam ~70-90% menos, mas podem ser retiradas com aviso curto (2min na AWS). O Karpenter trata isso com **interrupção proativa**: detecta o aviso, marca o nó como `terminating`, aplica taint e drena os pods pra outro lugar antes do corte. Pra não quebrar SLO, ele **respeita PodDisruptionBudgets** — nunca consolida/termina nós se isso violar o budget. Boas práticas: PDB pra controlar quantos pods caem juntos, Topology Spread pra distribuir réplicas, e NodePools separados pra cargas críticas (On-Demand) vs. tolerantes (Spot).

Casos: **Mercado Livre** usa Karpenter pra misturar instâncias e economizar com Spot/Reserved sem sacrificar performance, eliminando dezenas de ASGs. **Tinybird** cortou 20% da conta AWS (90% em CI) consolidando tudo em dois NodePools (crítico On-Demand + stateless 100% Spot).

### Conceitos-chave

- **Karpenter = autoscaling de nós just-in-time** — provisiona sob medida pros pods pendentes, sem grupos fixos.
- **Cluster Autoscaler vs Karpenter**: grupos fixos e lento vs. flexível, rápido e right-sizing.
- **NodePool/Provisioner** — define as regras dos nós (tipos, zonas, Spot, limites); restrinja o mínimo.
- **Bin packing NP-difícil** → heurística gulosa least-waste (First-Fit Decreasing).
- **Consolidação** — remove/troca nós ociosos continuamente (com histerese temporal pra não agir por lapso).
- **Spot** = ~70-90% mais barato; Karpenter faz **interrupção proativa** (drena antes do corte) e **respeita PDB**.
- **Isolar workloads** em NodePools distintos (crítico On-Demand vs. tolerante Spot).

### Exemplo — NodePool com Spot + On-Demand e consolidação

```yaml
apiVersion: karpenter.sh/v1
kind: NodePool
metadata: { name: default }
spec:
  template:
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot", "on-demand"]     # prefere spot, cai pra on-demand
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64"]
      nodeClassRef: { name: default }
  limits: { cpu: "1000", memory: 1000Gi }    # teto de custo/recursos
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized   # consolida nós ociosos
    consolidateAfter: 30s
```

### Comandos

- `kubectl get nodeclaims` — lista os nós que o Karpenter provisionou.
- `kubectl get pods --field-selector=status.phase=Pending` — vê os pods que disparam o provisionamento.
- `kubectl describe nodepool default` — inspeciona as regras e limites.
- `kubectl get nodes -L karpenter.sh/capacity-type` — mostra quais nós são Spot vs On-Demand.

**Dica:** rode cargas stateless e tolerantes a interrupção em Spot, e reserve On-Demand só pro que é crítico/stateful — em NodePools separados. Combine com PodDisruptionBudget e Topology Spread pra que uma interrupção de Spot nunca derrube réplicas demais de um serviço ao mesmo tempo.

## Etapa 08 — Escalabilidade de aplicações com KEDA

O **HPA** (Horizontal Pod Autoscaler) padrão escala pods por CPU/memória. Mas e se a carga não é CPU, e sim o tamanho de uma **fila**? E se você quer escalar até **zero** quando não há trabalho? O **KEDA** (Kubernetes Event-driven Autoscaler) resolve isso: escala com base em **eventos externos** (filas RabbitMQ/SQS/Kafka, métricas Prometheus, cron, etc.) e permite **scale-to-zero** — nenhum pod consumindo recursos quando a fila está vazia. É ideal pra workloads event-driven e cenários serverless.

Como funciona: você cria um **ScaledObject** (o CRD central do KEDA) que aponta pra um Deployment alvo e define um **trigger** (ex.: fila RabbitMQ, 1 pod a cada 10 mensagens). O KEDA cria um HPA por trás. Quando a fila está vazia, mantém o Deployment em 0 pods. Chega uma mensagem → ativa 1 pod imediatamente. A fila cresce → o HPA calcula os pods desejados pra manter ~10 msgs/pod (40 mensagens = 4 pods). A fila esvazia e fica vazia pelo `cooldownPeriod` → volta pra zero. Só o KEDA tem autoridade pra ir a zero; o HPA sozinho vai de 1 a N.

A teoria por trás é **teoria de filas**. Modele eventos chegando a taxa `λ` e cada pod processando a `μ`; com `c` pods, a capacidade é `c·μ`. Condição de estabilidade: `λ < c·μ` (senão a fila cresce sem limite — nem autoscaling salva). A **Lei de Little** (`L = λ·W`) relaciona backlog médio `L`, taxa `λ` e tempo de resposta `W`: se o backlog cresce, ou as chegadas estão rápidas demais, ou faltam pods. O autoscaler ideal controla `L` pra manter `W` dentro do SLO.

O desafio de controle é evitar **oscilação/jitter** (subir e descer pods repetidamente). Causas: atraso de realimentação e thresholds estáticos. Mitigações que o KEDA/HPA aplicam: **histerese** (tolerância de ~10% — só escala se passar de 110% ou cair abaixo de 90% do alvo), janelas de estabilização, `cooldownPeriod`, e limiares distintos de subida/descida (banda morta — escala up em 100 msgs mas só down abaixo de 20, evitando ping-pong). Como filas absorvem bursts naturalmente, aceita-se algum backlog temporário enquanto novos pods sobem.

O KEDA é **agnóstico de provedor** (AKS, EKS, GKE, on-prem) e **complementa** o HPA (não substitui). Casos: e-commerce escalando workers de pedidos por fila do Service Bus/SQS durante promoções relâmpago, voltando a zero na madrugada. Tendência: triggers guiados por **SLO** (latência/erro) e por **custo** (FinOps), além de **scalers externos** via gRPC (qualquer fonte de evento vira trigger).

### Conceitos-chave

- **KEDA = autoscaling orientado a eventos** — filas, métricas, cron; complementa (não substitui) o HPA.
- **Scale-to-zero** — economiza recursos quando não há carga; reativa na chegada do primeiro evento.
- **ScaledObject** = CRD central (alvo + trigger + min/max réplicas + cooldown).
- **Teoria de filas**: estabilidade `λ < c·μ`; **Lei de Little** `L = λ·W` (backlog ↔ latência).
- **Oscilação/jitter** — evitado com histerese (~10%), `cooldownPeriod`, banda morta e janelas de estabilização.
- **Agnóstico de nuvem**; extensível via **scalers externos gRPC**.
- Tendência: triggers por **SLO** e por **custo** (FinOps).

### Exemplo — ScaledObject escalando por fila RabbitMQ

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata: { name: worker-scaler }
spec:
  scaleTargetRef: { name: meu-deployment }   # Deployment alvo
  minReplicaCount: 0        # scale-to-zero
  maxReplicaCount: 5
  cooldownPeriod: 60        # espera 60s vazia antes de zerar
  pollingInterval: 15       # checa a fila a cada 15s
  triggers:
    - type: rabbitmq
      metadata:
        queueName: minha-fila
        protocol: amqp
        mode: QueueLength
        value: "10"         # 1 pod a cada 10 mensagens
```

### Comandos

- `kubectl get scaledobject` — lista os ScaledObjects e o HPA gerado.
- `kubectl describe hpa <nome>` — mostra os eventos de escalonamento (`Scaled up to 4 replicas; reason: queueLength above target`).
- `kubectl get deployment meu-deployment -w` — observa as réplicas subindo/descendo em tempo real.

**Dica:** ajuste `pollingInterval` e `cooldownPeriod` pensando na dinâmica da sua carga. Cooldown curto demais mata pods bons no meio de um burst intermitente; longo demais desperdiça recursos. E lembre: se `λ ≥ c·μ` de forma sustentada, nenhum autoscaling resolve — o gargalo é capacidade ou código, não número de pods.

## Etapa 09 — Segurança no cluster

Cluster de verdade tem múltiplos serviços e times — e cada workload comprometido não pode virar chave do reino. Segurança em Kubernetes se apoia em três pilares: **identidade** (ServiceAccounts), **autorização** (RBAC de menor privilégio) e **criptografia** (TLS automatizado). Tudo sob a filosofia **Zero Trust**: nada é confiável por padrão.

**Identidade — ServiceAccounts.** Cada aplicação deve ter sua **própria** ServiceAccount, nunca a `default`. Ela dá ao pod um token pra falar com o API Server. Isolar identidades por workload é o que permite delimitar o estrago quando um pod é comprometido.

**Autorização — RBAC.** Concede permissões via **Roles** (namespaced) ou **ClusterRoles** (cluster-wide), ligadas a sujeitos por **RoleBindings**. O modelo é um grafo: `Subject → RoleBinding → Role → Permissão`. Boas práticas de menor privilégio:
- Prefira **Role namespaced** a ClusterRole — limita ao namespace.
- Conceda só os **verbos** necessários (`get`, `list` — nada de `*`) e só os **recursos** necessários.
- Nunca use curinga `*` em recursos nem verbos.

O RBAC do Kubernetes é **estático e aditivo** (só soma permissões, sem negações), o que o torna **auditável** — dá pra listar quem pode fazer o quê deterministicamente. O **ABAC** (baseado em atributos) é mais expressivo mas opaco e foi praticamente aposentado. Pra políticas condicionais (ex.: "negar pod sem limits", "só imagem `stable`"), usa-se **OPA/Gatekeeper** com a linguagem **Rego** (Policy as Code) — poderoso, mas quanto mais expressivo, mais difícil de provar propriedades.

**Identidade federada com a nuvem.** Aplicações precisam acessar S3, buckets, Key Vault — sem embutir chaves estáticas no container. A solução é federar a ServiceAccount do K8s com uma identidade cloud via OIDC, recebendo **tokens de curta duração**:
- **IRSA** (IAM Roles for Service Accounts) no EKS — anota a SA com o ARN de uma IAM Role. Cada app com sua própria Role mínima.
- **Workload Identity** no GKE e no AKS — mapeia a SA a uma conta de serviço cloud.

Isso elimina segredos estáticos e restringe a credencial ao contexto do pod. Casos reais provam o valor: no ataque **SCARLETEEL** (2023) o dano foi limitado porque a Role do pod tinha escopo restrito; no incidente da **Tesla** (2018), um dashboard sem senha + credenciais AWS amplas num pod levou a cryptojacking. Lições: menor privilégio no IAM, nunca expor dashboards, nunca colocar segredos estáticos em pods.

**TLS automatizado — cert-manager.** Gerenciar certificados TLS na mão não escala (expiram, ficam inconsistentes). O **cert-manager** automatiza o ciclo de vida via CRDs: **Issuer/ClusterIssuer** (quem emite — self-signed, CA interna, ACME/Let's Encrypt, Vault) e **Certificate** (o que emitir, com CN, SANs, duração e `renewBefore` pra renovação antecipada). Ele gera CSR, assina, preenche o Secret com `tls.crt`/`tls.key` e renova sozinho. Isso apoia a **PKI** do cluster: certificados X.509 numa cadeia de confiança até uma Root CA, com o Kubernetes usando **múltiplas CAs** (etcd, API server, front-proxy) pra compartimentalizar — se uma vaza, não compromete as outras.

**Rotação de segredos.** Segredos precisam ser trocados pra reduzir a janela de exposição. Rotação instantânea é impraticável em sistemas distribuídos (não há lock global), então usa-se **período de convivência**: nova e antiga válidas ao mesmo tempo até todos migrarem, depois invalida a antiga. Segredos **dinâmicos** (Vault, tokens JWT de minutos) quase dispensam rotação porque já são efêmeros. Cuidado na rotação de chave de criptografia do etcd: todos os nós de controle precisam conhecer a nova chave *antes* de alguém escrever com ela, senão vira split-brain.

### Conceitos-chave

- **Três pilares**: ServiceAccount (identidade) + RBAC (autorização) + cert-manager/TLS (criptografia), sob **Zero Trust**.
- **Uma ServiceAccount por app** — nunca a `default`.
- **RBAC de menor privilégio**: Role namespaced, verbos/recursos específicos, sem `*`.
- **RBAC é estático/aditivo (auditável)**; **ABAC** aposentado; **OPA/Rego** pra políticas condicionais.
- **Identidade federada** (IRSA / Workload Identity) — tokens de curta duração, zero chave estática no pod.
- **cert-manager**: Issuer + Certificate automatizam emissão/renovação de TLS; **PKI com múltiplas CAs** compartimentaliza confiança.
- **Rotação com convivência** — nova e antiga válidas até todos migrarem; segredos dinâmicos são efêmeros.
- Lições de incidentes (SCARLETEEL, Tesla): menor privilégio no IAM limita o estrago.

### Exemplo — ServiceAccount + Role de menor privilégio + IRSA

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: analytics-sa
  namespace: analytics
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/S3Reader  # IRSA
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role                    # namespaced, não ClusterRole
metadata: { name: analytics-read, namespace: analytics }
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list"]    # só leitura, sem "*"
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata: { name: bind-analytics-read, namespace: analytics }
roleRef: { apiGroup: rbac.authorization.k8s.io, kind: Role, name: analytics-read }
subjects:
  - kind: ServiceAccount
    name: analytics-sa
    namespace: analytics
```

```yaml
# cert-manager: emite e renova TLS interno automaticamente
apiVersion: cert-manager.io/v1
kind: Certificate
metadata: { name: service-a-cert }
spec:
  secretName: service-a-tls
  duration: 2160h          # 90 dias
  renewBefore: 360h        # renova 15 dias antes
  commonName: service-a.default.svc.cluster.local
  dnsNames: [ service-a, service-a.default.svc.cluster.local ]
  issuerRef: { name: cluster-ca-issuer, kind: Issuer }
```

### Comandos

- `kubectl auth can-i <verbo> <recurso> --as=system:serviceaccount:<ns>:<sa>` — testa se uma SA tem uma permissão (auditoria de RBAC).
- `kubectl get rolebindings,clusterrolebindings -A -o wide` — mapeia quem tem acesso a quê.
- `kubectl get certificate -A` — estado dos certificados gerenciados pelo cert-manager.
- `kubectl create token <sa>` — gera um token de curta duração pra uma ServiceAccount.

**Dica:** use `kubectl auth can-i --as=...` no CI pra validar que suas ServiceAccounts têm *exatamente* as permissões esperadas e nada além. Combine com IRSA/Workload Identity de escopo mínimo — assim, mesmo que um container seja comprometido, o invasor fica preso ao que aquela identidade específica pode fazer, dentro e fora do cluster.
