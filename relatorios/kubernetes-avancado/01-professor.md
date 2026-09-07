# Kubernetes Avançado — Guia Prático (Fase 2)

> Baseado nas 9 aulas do módulo **DevOps e Arquitetura Cloud — Fase 2** (FIAP). Este guia assume que você já domina o básico (Pods, Deployments, Services, `kubectl`, YAML declarativo) e sobe o nível para operar clusters de verdade. Os hands-on originais usam Rust + `kube-rs`; aqui priorizamos conceitos, YAML e `kubectl`, que é a parte durável e transferível do conhecimento.

**O que você vai saber fazer ao terminar este guia:** manter suas aplicações saudáveis e com recursos sob controle; decidir exatamente em quais nós cada carga roda; atualizar em produção sem downtime e reverter em segundos; empacotar tudo com Helm; executar deploys Blue/Green e Canário com rollback confiável; escalar nós com Karpenter e aplicações por eventos com KEDA; e fechar o cluster com identidade, RBAC de menor privilégio e TLS automatizado.

Cada etapa segue sempre a mesma trilha: **o problema** (um cenário real que dói) → **conceito** → **exemplo comentado** → **comandos** → **mão na massa** (o menor exercício que prova que você entendeu) → **anota aí** (a ideia que você leva no bolso). A ordem das etapas é proposital: cada uma só usa o que a anterior já ensinou. Não pule.

---

## Etapa 01 — Saúde da aplicação e gerenciamento de recursos

### O problema

Imagine seu e-commerce numa Black Friday. Um dos pods da API entrou em *deadlock*: o processo continua de pé, o container não morreu, mas ele responde HTTP 500 para todo cliente que chega. O Kubernetes, sozinho, só sabe uma coisa: "o processo está vivo". Ele não reinicia nada, e você perde vendas por horas até alguém perceber no gráfico. No pod ao lado, um vazamento de memória vai comendo RAM até estourar o nó inteiro e derrubar os vizinhos saudáveis junto.

**Analogia:** um funcionário pode estar sentado na mesa (processo vivo) mas dormindo de olhos abertos (travado). Você precisa de duas coisas: bater na mesa para ver se ele reage (*probes*) e definir de quanta mesa e cadeira cada um tem direito para ninguém tomar o espaço do outro (*requests/limits*).

### Conceitos-chave

**As três probes (sondas de saúde).** O Kubernetes precisa perguntar duas coisas: "você travou?" e "você está pronto pra receber tráfego?".

- **Liveness probe** — "você travou?" Se falhar N vezes seguidas, o kubelet **reinicia o container**. É a autocura do cluster. Use para detectar travamentos irrecuperáveis (deadlock), **nunca** para lentidão passageira — senão você entra num ciclo de reinícios.
- **Readiness probe** — "você está pronto?" Se falhar, o pod é **tirado do balanceador** (removido dos endpoints do Service), mas **não é reiniciado**. Volta sozinho quando a dependência se recupera. É o que garante rollout sem erro pro usuário.
- **Startup probe** — "você já terminou de subir?" Protege apps de boot lento: enquanto ela não passa, liveness e readiness ficam suspensas, evitando que o app seja morto durante uma inicialização demorada.

> **Liveness ≠ Readiness.** Liveness reinicia; readiness só tira do tráfego. Confundir as duas causa reinícios em cascata.

**Requests e limits (o contrato de recursos).** Todo container declara:

- **requests** — o que ele *reserva*. O scheduler usa isso pra decidir em qual nó o pod cabe. É o piso garantido.
- **limits** — o teto que ele *não pode passar*. Estourar limite de **memória** = **OOMKill** (o kernel mata o container). Estourar limite de **CPU** = **throttling** (o kernel atrasa o processo pra mantê-lo na cota).

**Classes de QoS (quem morre primeiro sob pressão).** Da combinação de requests e limits nasce a classe de QoS do pod:

- **Guaranteed** (requests == limits em todos os containers) — os últimos a serem sacrificados.
- **Burstable** (requests < limits) — usam folga ociosa, mas cedem sob contenção.
- **BestEffort** (sem requests nem limits) — os primeiros a serem despejados.

**O detalhe contraintuitivo (caso real da Buffer).** Colocar limite de CPU pode *piorar* a latência. O algoritmo de quota do CFS (escalonador do Linux) pode *throttlar* um pod mesmo com uso médio baixo: pequenos picos consomem a cota de 100ms e o processo fica congelado até o próximo período. A Buffer removeu os limits de CPU de serviços sensíveis a latência e viu o p99 cair de 5 a 10x. A lição: em multi-tenant você quer limits pra isolamento; em serviço *latency-sensitive*, às vezes menos é mais.

**Bônus de confiabilidade.** Disponibilidade é `A = MTBF / (MTBF + MTTR)`. Réplicas em paralelo multiplicam disponibilidade — 2 pods a 99% chegam a ~99,99%, porque o Service age como um "OU lógico": basta um pod `Ready`. Probes cobrem saturação e erro dos **Golden Signals** (latência, tráfego, erros, saturação); o resto você observa com Prometheus + Grafana.

### Exemplo comentado — Deployment com as três probes e recursos

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
                                                     # (evita throttling do CFS)
```

### Comandos

- `kubectl describe pod <pod>` — mostra eventos de probe, OOMKill, reinícios (procure `Liveness probe failed`, `OOMKilled`).
- `kubectl top pod` / `kubectl top node` — uso real de CPU/memória vs. requests/limits (precisa do metrics-server).
- `kubectl get pod <pod> -o jsonpath='{.status.qosClass}'` — mostra a classe de QoS do pod.

### Mão na massa

Prove na prática que a liveness reinicia um container travado:

```sh
# 1) Cria um pod cuja liveness aponta pra uma porta que NÃO existe -> vai falhar sempre
kubectl run teste-liveness --image=nginx --restart=Never \
  --overrides='{"spec":{"containers":[{"name":"teste-liveness","image":"nginx","livenessProbe":{"httpGet":{"path":"/","port":9999},"periodSeconds":5,"failureThreshold":2}}]}}'

# 2) Observe a coluna RESTARTS subindo a cada ~15s
kubectl get pod teste-liveness -w

# 3) Confirme o motivo nos eventos
kubectl describe pod teste-liveness | grep -i liveness
```

**O que observar:** a coluna `RESTARTS` aumenta sozinha e o `describe` mostra `Liveness probe failed`. Isso é a autocura em ação. Depois: `kubectl delete pod teste-liveness`.

### Dica do professor

Não coloque checagem de banco de dados na *liveness* probe. Se o banco cair, todas as réplicas falham a liveness ao mesmo tempo, reiniciam juntas e você tem falha em cascata. Cheque dependências na *startup* (pra não subir sem elas) e degrade graciosamente depois.

### Anota aí

> Liveness reinicia, readiness só tira do tráfego, e todo pod merece pelo menos `requests` — pod sem request é BestEffort e é o primeiro a ser despejado.

---

## Etapa 02 — Agendamento avançado e comportamento de nós

### O problema

Você tem um cluster misto: alguns nós têm GPU (caros, para treinar modelos), a maioria é comum. Por padrão o scheduler joga o pod em qualquer nó onde ele caiba — então um pod qualquer pode ocupar o nó de GPU e travar o time de ML, enquanto um job de treino pode cair num nó comum sem GPU e nunca funcionar. Pior: quando um nó fica sem memória, quem o Kubernetes mata primeiro? Se for o pod errado, seu serviço crítico vai junto.

**Analogia:** pense num estacionamento. *Taints* são placas de "vaga reservada — só quem tem autorização" (repelem). *Affinity* é a instrução no seu bolso dizendo "estacione perto da entrada" (atrai). E *eviction* é o segurança que, quando o prédio lota, começa a rebocar os carros mal estacionados antes de rebocar quem pagou mensalidade.

### Conceitos-chave

**Taints e Tolerations — repelir.** Um *taint* é uma marca no **nó**: "não coloque pods aqui a menos que tolerem X". A *toleration* é a marca no **pod**: "eu sei lidar com X, posso ir". Efeitos de um taint:

- `NoSchedule` — não agenda pods não-tolerantes (os que já rodam ficam).
- `PreferNoSchedule` — evita, mas não é absoluto.
- `NoExecute` — barra novos **e expulsa** os pods sem toleration que já estavam lá (útil pra esvaziar um nó pra manutenção).

> **Ponto crucial: taint só repele, não atrai.** Um pod que *tolera* o nó de GPU pode acabar num nó comum. Pra garantir que ele vá *só* pra GPU, combine com affinity.

**Node Affinity — atrair.** A contraparte positiva: "eu quero ir pra nós com o label X".

- `requiredDuringScheduling...` — obrigatório (hard). Sem o label, não agenda.
- `preferredDuringScheduling...` — preferência (soft), com peso; se não achar, agenda em outro lugar.

**Pod Affinity / Anti-Affinity — relacionar pods entre si.** Em vez de olhar labels do nó, olha os pods que já estão lá. *Affinity* aproxima ("coloque o cache perto do front-end na mesma zona"); *anti-affinity* separa ("não coloque duas réplicas do banco no mesmo nó/zona"), aumentando disponibilidade. Cuidado: inter-pod affinity é caro no scheduler — a documentação não recomenda acima de "algumas centenas" de nós. Pra espalhamento com garantia numérica, prefira **Topology Spread Constraints** (`maxSkew`), que escala melhor.

**Eviction sob pressão — a autoproteção do nó.** Quando um nó fica sem memória, disco ou PIDs, o kubelet age antes do colapso. Primeiro tenta limpar (containers mortos, imagens não usadas). Se não resolve, começa a **despejar pods** nesta ordem: primeiro os que excedem suas requests (BestEffort e Burstable "estourados"), depois por PriorityClass, por último os Guaranteed. Detalhes que salvam:

- Eviction por pressão de nó **ignora o PodDisruptionBudget** — é emergência.
- `eviction-minimum-reclaim` evita o efeito dominó (matar um pod de cada vez sem nunca resolver — o "eviction storm" que derrubou ~50 pods numa startup por disco cheio de logs).
- **Eviction ≠ OOMKill:** OOMKill é o cgroup matando *um container* que passou do limit; eviction é o kubelet retirando *pods* pra salvar o *nó* inteiro.
- **PriorityClass:** pods de sistema (`system-cluster-critical`) têm prioridade altíssima e quase nunca são despejados.
- **Por que é difícil:** alocar pods com múltiplas restrições é *bin packing*, um problema NP-difícil. O scheduler usa heurística gulosa (filtra nós → pontua → escolhe): rápida, mas não ótima.

### Exemplo comentado — pod de ML que exige nó com GPU

```yaml
# 1) Marca o nó de GPU (uma vez, via kubectl):
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
        limits: { nvidia.com/gpu: 1 }   # pede 1 GPU (recurso estendido)
```

Repare: **só a toleration não bastaria** (o pod poderia cair num nó comum). É a *combinação* toleration + nodeAffinity que garante isolamento forte.

### Comandos

- `kubectl taint nodes <nó> chave=valor:NoSchedule` — aplica taint (adicione `-` no fim pra remover).
- `kubectl label nodes <nó> accelerator=nvidia-gpu` — rotula pra affinity.
- `kubectl describe node <nó>` — mostra taints, labels, pods e pressão de recursos.
- `kubectl get events --field-selector reason=Evicted` — lista despejos recentes.

### Mão na massa

Veja o taint repelindo um pod em tempo real (funciona em minikube/kind de 1 nó):

```sh
# 1) Descubra o nome do nó
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
kubectl delete pod repelido
```

**O que observar:** enquanto o taint existe, o pod fica `Pending` com a mensagem `had untolerated taint`. Ao remover o taint, ele agenda sozinho.

### Dica do professor

Monitore uso de disco/memória dos nós e alerte em **85%**, *antes* dos ~95% que disparam eviction. Junto com rotação de logs, isso evita o "eviction storm". Prefira reagir manualmente (drenar o nó com `kubectl drain`) a deixar o kubelet despejar em pânico.

### Anota aí

> Taint repele, affinity atrai — pra reservar um nó de verdade, você precisa dos dois juntos.

---

## Etapa 03 — Estratégias de atualização e rollouts

### O problema

Sexta-feira, 16h. Você precisa subir a v2 da API. Se derrubar tudo de uma vez pra subir a nova, o serviço fica fora do ar no meio do expediente. Se subir errado e não tiver como voltar rápido, o fim de semana vira plantão. Pior ainda: se a v2 for incompatível com a v1 (por causa de uma migração de banco), deixar as duas rodando ao mesmo tempo corrompe dados.

**Analogia:** trocar os pneus de um caminhão. *RollingUpdate* é trocar um por um, com o caminhão ainda andando devagar (sem parar a entrega). *Recreate* é encostar, tirar todos os quatro e só então botar os novos (para, mas garante que nunca há mistura de pneu velho e novo).

### Conceitos-chave

**RollingUpdate (padrão) — zero downtime.** Substitui os pods aos poucos, mantendo o serviço no ar. O controlador cria um novo ReplicaSet e reduz o antigo proporcionalmente. Dois parâmetros controlam o ritmo:

- **maxUnavailable** — quantos pods podem ficar indisponíveis durante a troca. É o **freio**: garante o piso de disponibilidade. Padrão 25%.
- **maxSurge** — quantos pods a *mais* que o desejado podem existir temporariamente. É a **potência**: acelera criando extras. Padrão 25%.

Com N réplicas e os padrões, durante o rollout você tem no mínimo `(1 − 0,25)·N = 75%` disponíveis e no máximo `(1 + 0,25)·N = 125%` rodando. **Não é permitido** `maxUnavailable` e `maxSurge` ambos em zero.

**Recreate — consistência total, com downtime.** Derruba *tudo* da v1 antes de subir a v2. Causa indisponibilidade, mas garante que as duas versões nunca coexistem — necessário quando v1 e v2 são incompatíveis (ex.: migração de banco que quebra a versão antiga).

**O trade-off do tuning.** `maxUnavailable` alto acelera mas comprime a capacidade (a fila de requisições cresce — num modelo M/M/c, se `c` cai, a utilização `ρ = λ/(cμ)` sobe e a latência explode). `maxSurge` alto acelera mas dobra pods → dobra conexões → pode saturar o banco. Duas receitas:

- **Disponibilidade-primeiro:** `maxUnavailable: 0` (nunca reduz capacidade), `maxSurge` generoso dentro do orçamento de recursos.
- **Tempo-mínimo sob orçamento:** escolha os valores saturando o limite de pico (`(1+surge)·N ≤ orçamento`) e a degradação mínima (`(1−unavail)·N ≥ mínimo aceitável`).

**Ferramentas de garantia.**
- `minReadySeconds` — o pod precisa ficar `Ready` por X segundos antes de contar como disponível (evita marcar como pronto um pod que ainda vai cair).
- `progressDeadlineSeconds` (padrão 600s) — se o rollout empaca, marca `ProgressDeadlineExceeded`. **Atenção:** ele *detecta*, mas o Deployment **não faz rollback sozinho**.
- `revisionHistoryLimit` (padrão 10) — quantas revisões guardar pra rollback.
- O rollout **só dispara** com mudança em `.spec.template`. Só escalar réplicas **não** conta como novo rollout.

Estratégias mais sofisticadas (Blue/Green, Canary — próximas etapas) **não são nativas** do Deployment; controladores como **Argo Rollouts** e **Flagger** as adicionam com gates de promoção automáticos (a Netflix usa análise estatística com o Kayenta).

### Exemplo comentado — RollingUpdate "disponibilidade-primeiro"

```yaml
apiVersion: apps/v1
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
            httpGet: { path: /healthz, port: 8080 }
```

### Comandos

- `kubectl rollout status deployment/myapp` — acompanha o rollout (sai com código ≠ 0 se estourar o deadline).
- `kubectl rollout history deployment/myapp` — lista as revisões (com a `change-cause`).
- `kubectl rollout undo deployment/myapp` — reverte pra revisão anterior (`--to-revision=N` pra uma específica).
- `kubectl rollout pause/resume deployment/myapp` — congela/retoma no meio (útil pra canário manual).

### Mão na massa

Faça um rollout e um rollback do zero e observe os ReplicaSets:

```sh
# 1) Cria e espera ficar pronto
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
kubectl delete deployment web
```

**O que observar:** no passo 3, existem dois ReplicaSets — o Kubernetes não apaga o antigo, ele o **zera** (é isso que torna o `undo` instantâneo).

### Dica do professor

Sempre preencha `kubernetes.io/change-cause` (ou use `--record`). Sem ela, o `rollout history` fica cego e você não sabe pra qual revisão voltar quando o incidente chegar às 3h da manhã.

### Anota aí

> RollingUpdate = zero-downtime com freio (`maxUnavailable`) e potência (`maxSurge`); o `undo` é instantâneo porque o ReplicaSet antigo continua guardado, só zerado.

---

## Etapa 04 — Gerenciador de pacotes com Helm Charts

### O problema

Você tem dev, staging e prod. Cada ambiente precisa dos mesmos ~15 manifestos YAML, mudando só réplicas, tag de imagem e recursos. Você copia e cola tudo três vezes. Aí um dia altera um label no Deployment de prod, esquece de replicar em staging, e passa a semana caçando por que "no staging funciona e em prod não". Isso viola DRY e é uma fábrica de erros.

**Analogia:** o Helm é o `apt`/`yum` do Kubernetes. Em vez de digitar a receita de bolo inteira toda vez, você tem uma **fôrma** (o template) e só troca os ingredientes que variam (os *values*). Mesma fôrma, bolos diferentes, sem retrabalho.

### Conceitos-chave

**Anatomia de um Chart:**

- **`Chart.yaml`** — metadados. `version` é a versão do *chart*; `appVersion` é a versão da *aplicação* empacotada. Ambos seguem SemVer, e separá-los ajuda a governança (evoluir o chart sem trocar o app).
- **`values.yaml`** — os valores padrão configuráveis (réplicas, imagem, porta, recursos). É aqui que fica tudo que varia por ambiente.
- **`templates/`** — os manifestos como templates Go + funções Sprig. `{{ .Values.replicaCount }}` insere o valor; helpers em `_helpers.tpl` evitam repetir lógica (nomes, labels).

**A sacada teórica.** Um template Helm é uma **função pura** `T(valores) → YAML`: mesmos inputs, mesma saída — previsível e testável (`helm template` renderiza sem aplicar). Isso encarna dois pilares de Infraestrutura como Código:

- **Idempotência** — aplicar N vezes tem o mesmo efeito que aplicar uma. Rodar `helm upgrade` de novo sem mudar nada não faz nada. Segurança pra reexecutar pipelines.
- **Imutabilidade** — não muta o objeto existente; cria uma nova versão e mantém o histórico. É o que torna o rollback confiável.

**Ciclo de vida:** `helm install` (cria e registra a release num Secret) → `helm upgrade` (calcula o diff e aplica só as mudanças, incrementa a revisão) → `helm rollback` (volta pra uma revisão salva). O **Helm 3 não tem servidor central (Tiller)**: o cliente usa direto as credenciais do `kubectl`, então **o RBAC do usuário limita o que o Helm pode fazer**.

**Governança em escala:** charts seguem SemVer (major = quebra, exige revisão humana), são distribuídos por repositórios (Artifact Hub, privados), podem ser **assinados digitalmente** (GPG + arquivo `.prov`) pra proteger a *supply chain*, e devem embutir RBAC de menor privilégio (ServiceAccounts dedicadas, Roles limitadas — nada de `cluster-admin`). *Subcharts* permitem composição (um "umbrella chart" que junta app + banco), e `values.schema.json` valida os inputs como um "sistema de tipos" pros valores. Combinado com GitOps (ArgoCD/Flux), cada release vira um commit auditável.

### Exemplo comentado — trechos de um chart

```yaml
# Chart.yaml — a identidade do pacote
apiVersion: v2
name: myapp
version: 0.1.0          # versão do CHART (a fôrma)
appVersion: "1.0.0"     # versão da APLICAÇÃO empacotada (o bolo)
type: application
```

```yaml
# values.yaml — tudo que varia por ambiente mora aqui
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
# templates/deployment.yaml (trecho) — a fôrma que consome os values
spec:
  replicas: {{ .Values.replicaCount }}          # injeta o valor do values.yaml
  template:
    spec:
      containers:
        - name: {{ .Chart.Name }}               # usa o nome definido no Chart.yaml
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          resources:
            {{- toYaml .Values.resources | nindent 12 }}  # serializa o bloco inteiro,
                                                          # indentado 12 espaços
```

### Comandos

- `helm create <chart>` — gera a estrutura básica.
- `helm template ./chart` — renderiza o YAML sem aplicar (dry-run local; prova que é função pura).
- `helm install <release> ./chart -n <ns>` — instala.
- `helm upgrade <release> ./chart --set image.tag=1.1.0 --atomic` — atualiza (`--atomic` reverte tudo se falhar).
- `helm history <release>` / `helm rollback <release> <rev>` — histórico e reversão.
- `helm lint ./chart` — valida boas práticas.

### Mão na massa

Veja a "função pura" com os próprios olhos, sem tocar em cluster nenhum:

```sh
# 1) Cria um chart de exemplo
helm create demo

# 2) Renderiza com o valor padrão (repare em replicas: 1)
helm template demo | grep -i replicas

# 3) Renderiza mudando SÓ o input; a saída muda de forma previsível
helm template demo --set replicaCount=4 | grep -i replicas

# 4) Valida o chart
helm lint demo
```

**O que observar:** o mesmo template produz `replicas: 1` no passo 2 e `replicas: 4` no passo 3. Input diferente → saída diferente e determinística. Isso é a idempotência/imutabilidade na prática, e você testou tudo *antes* de aplicar em qualquer cluster.

### Dica do professor

Rode `helm diff upgrade` (plugin `helm-diff`) *antes* de aplicar em produção. Ver exatamente o que vai mudar no cluster evita a surpresa de aplicar template "às cegas" — o medo número um de quem começa com Helm.

### Anota aí

> Chart = fôrma (`templates`) + ingredientes (`values`); como o template é função pura, `helm template` te deixa conferir o resultado antes de mexer no cluster.

---

## Etapa 05 — Deploy Blue/Green

### O problema

Você lançou a v2, ela passou em todos os testes, mas em produção — com tráfego e dados reais — apareceu um bug crítico 3 minutos depois. Com RollingUpdate, reverter significa fazer *outro* rollout completo, que leva minutos enquanto os clientes sofrem. Você queria um "botão de desfazer" instantâneo.

**Analogia:** um palco de teatro com dois cenários montados em plataformas giratórias. O público (tráfego) vê o cenário Azul. Nos bastidores, o cenário Verde já está pronto e iluminado. Quando decide, você **gira o palco** e o público passa a ver o Verde na hora. Deu errado? Gira de volta em segundos — o cenário Azul nunca foi desmontado.

### Conceitos-chave

**A ideia central.** Mantenha **dois ambientes de produção idênticos**. O **Blue** é a versão atual servindo 100% do tráfego; o **Green** é a nova versão, pronta e "quente", mas sem tráfego. Quando o Green é validado, você **vira a chave** e ele passa a servir tudo. Deu problema? Vira de volta em segundos.

**Como funciona no Kubernetes.** Os dois conjuntos de pods têm labels diferentes (`env: blue`, `env: green`). Um único **Service** aponta pra um deles via `selector`. A promoção é só um **patch no selector** do Service — o `kube-proxy` reconfigura o roteamento em instantes. O rollback é o patch inverso. Como os pods antigos continuam de pé (só sem tráfego), a reversão é instantânea, sem reimplantar nada. Formalmente é uma transição atômica entre dois estados (B → G) com rollback determinístico: se a v2 falha após `Δt` segundos, só `λ·Δt` requisições foram afetadas — e você zera o dano revertendo na hora.

**As armadilhas (leia com atenção):**

- **Consistência de dados / esquema — o calcanhar de Aquiles.** Se a Green muda o banco de forma incompatível, reverter pra Blue quebra. A solução é **compatibilidade dupla temporária** (Martin Fowler): primeiro migrar o banco pra suportar as *duas* versões, validar, e só então trocar o código. Sem isso, dados escritos pela Green podem inutilizar a Blue.
- **Custo.** Dois ambientes completos = ~100% de overhead durante a transição (a Etsy chegou a 200% de capacidade). Boa prática: escalar o ambiente inativo pra zero depois de estabilizar.
- **Tempestade de conexões.** Trocar 100% de uma vez joga toda a carga na Green de repente — caches frios podem gerar um pico. Mitigação: aquecer a Green com tráfego sombra antes.

**Antipadrão clássico:** não tratar a Green como produção o tempo todo. Se você acumula mudanças esperando o "momento certo", o salto Blue→Green vira gigante e arriscado. Blue/Green de verdade = deploy contínuo no ambiente passivo, só sem tráfego, virando a chave quando ganha confiança.

**Ferramentas:** **Argo Rollouts** suporta `blueGreen` nativo (com ambiente `preview` e promoção manual/automática por métricas); **Flagger** integra com service mesh. Curiosidade: também é chamado de **Red/Black** (Netflix/Spinnaker).

### Exemplo comentado — o mesmo Service apontando pra blue, depois green

```yaml
# Service inicialmente apontando pro BLUE
apiVersion: v1
kind: Service
metadata: { name: myapp-service }
spec:
  selector: { app: myapp, env: blue }   # <- a "chave": troca pra green na promoção
  ports: [ { port: 80, targetPort: 8080 } ]
```

```sh
# Promoção Blue -> Green: só repatch o selector (a virada de chave)
kubectl patch service myapp-service \
  -p '{"spec":{"selector":{"app":"myapp","env":"green"}}}'

# Rollback: patch inverso, volta em segundos (Green continua de pé, só sem tráfego)
kubectl patch service myapp-service \
  -p '{"spec":{"selector":{"app":"myapp","env":"blue"}}}'
```

### Comandos

- `kubectl get endpoints myapp-service` — confirma pra quais pods o Service está roteando (valida a troca).
- `kubectl patch service ...` — executa a virada (mostrado acima).
- `kubectl scale deployment myapp-blue --replicas=0` — desliga o ambiente antigo após estabilizar.

### Mão na massa

Monte um Blue/Green de brinquedo e vire a chave observando os endpoints:

```sh
# 1) Dois "ambientes" com labels diferentes
kubectl create deployment blue  --image=nginx:1.25
kubectl create deployment green --image=nginx:1.27
kubectl label deployment blue  env=blue  --overwrite
kubectl label deployment green env=green --overwrite
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
kubectl delete deploy blue green; kubectl delete svc bg-svc
```

**O que observar:** no passo 3 o endpoint aponta pro IP do pod blue; após o patch (passo 4), passa a apontar pro pod green — sem reiniciar nada. Essa é a virada de chave.

### Dica do professor

Antes de virar a chave, garanta que o banco aceita as **duas** versões. A pergunta é sempre: "se eu precisar reverter pra Blue daqui a 5 minutos, os dados que a Green escreveu vão quebrar a Blue?". Se sim, você não está pronto pro cutover.

### Anota aí

> Blue/Green é "tudo ou nada": a promoção e o rollback são um patch no `selector` do Service — instantâneos, desde que o banco seja retrocompatível.

---

## Etapa 06 — Deploy Canário

### O problema

Blue/Green vira 100% do tráfego de uma vez. Mas e se a v2 tiver um bug que só aparece sob carga real, com 1 usuário em cada 20? Virar tudo de uma vez expõe todo mundo ao mesmo tempo. Você queria testar a v2 com uma fatia pequena e real de usuários, medir, e só então expandir.

**Analogia:** o "canário na mina de carvão". Os mineiros levavam um canário para dentro da mina; se ele passava mal, era sinal de gás tóxico e todos saíam — antes de os humanos serem afetados. Aqui, uma fração pequena de usuários é o canário: se as métricas pioram, você reverte antes de contaminar a base inteira.

### Conceitos-chave

**A ideia central.** Em vez de expor todo mundo à v2, você manda **uma fração pequena** de usuários reais pra ela, monitora métricas, e só aumenta se estiver tudo bem. Deu ruim? O impacto ficou contido nos poucos por cento e você reverte.

**Blue/Green vs Canary.** Blue/Green é "tudo ou nada" (100% de uma vez); Canary é **progressivo** (1% → 5% → 25% → 50% → 100%), validando a cada passo com carga real. As duas versões rodam juntas e você migra o tráfego aos poucos.

**Roteamento fino de tráfego.** Feito por um **service mesh** (Istio, Linkerd) ou ingress com peso: você define percentuais exatos (ex.: 90% v1 / 10% v2) **independentes do número de réplicas**, via proxies sidecar. No Istio, um `VirtualService` divide o tráfego entre subsets (v1/v2) e você ajusta os pesos dinamicamente.

**Decisão orientada a dados.** O que decide promover ou reverter são **métricas em tempo real**: taxa de erro (5xx), latência (p95, p99), uso de recursos, métricas de negócio. Isso fecha um laço de realimentação automatizável: se o erro do canário < threshold, aumenta o peso; se viola, rollback imediato pra v1.

**O vocabulário que vale conhecer:**
- **Teste A/B contínuo** — o canário é um experimento estatístico entre v1 (controle) e v2. Testa-se com significância (α = 0,05) via teste z de proporções, qui-quadrado ou Mann-Whitney (o **Kayenta** da Netflix usa Mann-Whitney).
- **Testes sequenciais (SPRT de Wald)** — avalia continuamente e para cedo quando há evidência suficiente (promover ou abortar), poupando exposição.
- **Teoria de filas** — mesmo 10% de tráfego pode ter latência ruim se aqueles 10% quase saturam os pods v2 (`W = 1/(μ−λ)` explode perto da saturação). Serve pra extrapolar: se 20% já usa 30% de CPU, 100% vai precisar de mais réplicas.
- **Multi-armed bandits (Thompson Sampling)** — aloca tráfego adaptativamente, equilibrando exploração (testar) e explotação (favorecer a melhor).

**Casos reais:** a **Shopify** manda ~5% do tráfego por ~10min com análise automática antes de ir a 100%. A **Netflix** automatizou tudo com Kayenta no Spinnaker. O **Nubank** usa feature flags + canary pra centenas de deploys/dia. Tendência: canários guiados por **SLOs** e por **AI Ops**.

### Exemplo comentado — split de tráfego com Istio e steps no Argo Rollouts

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata: { name: myapp }
spec:
  hosts: [ myapp ]
  http:
    - route:
        - destination: { host: myapp, subset: v1 }
          weight: 90        # estável recebe 90%
        - destination: { host: myapp, subset: v2 }
          weight: 10        # canário recebe 10% — sobe gradualmente
```

```yaml
# Argo Rollouts: os degraus do canário com pausa e análise automática
strategy:
  canary:
    steps:
      - setWeight: 5                                   # manda 5% pra v2
      - pause: { duration: 60s }                       # observa por 60s
      - analysis: { templates: [ { templateName: slo-check } ] }  # gate por SLO
      - setWeight: 25                                  # se passou, sobe pra 25%
      - pause: { duration: 60s }
      - setWeight: 100                                 # promoção total
```

### Comandos

- `kubectl -n istio-system get virtualservice` — inspeciona as regras de tráfego.
- `kubectl argo rollouts get rollout myapp --watch` — acompanha o canário (plugin do Argo Rollouts).
- `kubectl argo rollouts promote myapp` / `abort myapp` — promove ou aborta manualmente.

### Mão na massa

Sem Istio instalado, você consegue *aproximar* o efeito canário pela razão de réplicas atrás do mesmo Service (o balanceamento fica proporcional ao número de pods):

```sh
# 1) v1 com 9 réplicas, v2 com 1 -> ~10% do tráfego cai na v2
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
kubectl delete deploy app-v1 app-v2; kubectl delete svc canary-svc
```

**O que observar:** o Service lista *todos* os pods das duas versões como endpoints. Mudar a proporção de réplicas muda a fatia de tráfego. Repare no limite: com réplicas, você só consegue frações "grosseiras" (10%, 25%...); é justamente por isso que um service mesh, que pesa por porcentagem **independente de réplicas**, é superior pra canário de verdade.

### Dica do professor

Amarre o canário aos seus **SLOs**, não a métricas arbitrárias. Se o SLO de erro é 0,1%, o canário deve frear automaticamente quando a v2 violar isso. Assim o monitoramento de produção e o de deploy viram a mesma coisa — e promover deixa de ser "achismo".

### Anota aí

> Canary é rollout progressivo com gate de métricas a cada passo; o peso ideal vem de service mesh (independe de réplicas), e a decisão de promover deve nascer do seu SLO.

---

## Etapa 07 — Escalabilidade de nós com Karpenter

### O problema

Até agora você escalou *pods*. Mas numa promoção relâmpago o HPA pede 20 novos pods e... não há **nó** onde colocá-los. Os pods ficam `Pending` e o serviço não aguenta a demanda. O **Cluster Autoscaler** tradicional resolveria, mas é lento e depende de grupos de nós fixos (ASGs) pré-configurados por tipo/zona — uma dor de manter, e ele costuma acionar um nó gigante pra um pod pequeno, desperdiçando dinheiro.

**Analogia:** um restaurante. O Cluster Autoscaler é abrir mesas de um tamanho só, previamente reservadas — chegou um casal, você abre uma mesa de 12 lugares. O **Karpenter** é o maître que olha exatamente quantas pessoas chegaram e monta *na hora* uma mesa do tamanho certo, escolhendo até a mais barata disponível, e desmonta quando esvazia.

### Conceitos-chave

**Karpenter = autoscaling de nós just-in-time.** Criado pela AWS (open source, hoje multicloud), provisiona nós **sob medida** pros pods pendentes, **sem grupos fixos**: mais rápido (segundos a <1min), escolhe a instância ótima (inclusive Spot) e remove nós ociosos sozinho. Empresas relatam até 30% de economia.

**O fluxo:** pods ficam **unschedulable** (o scheduler não achou nó) → o Karpenter observa → calcula qual instância acomoda melhor esses pods → provisiona → os pods são agendados. No sentido inverso, ele identifica nós subutilizados e **consolida**: move os pods pra outros nós e remove o ocioso, ou troca um On-Demand caro por um Spot mais barato.

**Configuração por NodePools** (antes chamados Provisioners): definem as regras dos nós que o Karpenter pode lançar — tipos de instância, zonas, Spot vs On-Demand, limites. Recomendação: **restrinja o mínimo possível**, pra dar liberdade de otimização ao Karpenter.

**Por que ele é esperto.** O problema é *bin packing* multidimensional (cada pod é um item com vetor CPU/memória, cada nó é um bin), que é **NP-difícil**. O Karpenter usa heurística gulosa: filtra tipos que não servem (sem GPU? fora; zona errada? fora), ordena por custo/adequação e faz algo próximo de *First-Fit Decreasing* (least-waste, a menor sobra). Diferença-chave: o Cluster Autoscaler preserva homogeneidade dentro do grupo (pod pequeno pode acionar nó grande); o Karpenter faz **right-sizing** — nó pequeno pra pod pequeno, nó grande quando chegam pods grandes.

**Spot e custo.** Instâncias **Spot** custam ~70-90% menos, mas podem ser retiradas com aviso curto (2min na AWS). O Karpenter trata isso com **interrupção proativa**: detecta o aviso, marca o nó como `terminating`, aplica taint e drena os pods pra outro lugar antes do corte. E **respeita PodDisruptionBudgets** — nunca consolida/termina nós se isso violar o budget. Boas práticas: PDB pra controlar quantos pods caem juntos, Topology Spread pra distribuir réplicas, e NodePools separados pra cargas críticas (On-Demand) vs. tolerantes (Spot).

**Casos:** o **Mercado Livre** mistura instâncias com Spot/Reserved sem perder performance, eliminando dezenas de ASGs. A **Tinybird** cortou 20% da conta AWS (90% em CI) consolidando tudo em dois NodePools (crítico On-Demand + stateless 100% Spot).

### Exemplo comentado — NodePool com Spot + On-Demand e consolidação

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
          values: ["spot", "on-demand"]     # pode usar spot; cai pra on-demand se faltar
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64"]                  # restringe arquitetura
      nodeClassRef: { name: default }        # aponta pra config de infra (AMI, subnets...)
  limits: { cpu: "1000", memory: 1000Gi }    # teto de custo: nunca passa disto
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized  # consolida nós vazios OU subutilizados
    consolidateAfter: 30s                          # histerese: espera 30s antes de agir
```

### Comandos

- `kubectl get nodeclaims` — lista os nós que o Karpenter provisionou.
- `kubectl get pods --field-selector=status.phase=Pending` — vê os pods que disparam o provisionamento.
- `kubectl describe nodepool default` — inspeciona as regras e limites.
- `kubectl get nodes -L karpenter.sh/capacity-type` — mostra quais nós são Spot vs On-Demand.

### Mão na massa

Karpenter roda em nuvem, mas você pode ver **o gatilho** que ele observa (o pod `Pending` por falta de nó) em qualquer cluster:

```sh
# 1) Peça mais CPU do que qualquer nó do cluster tem (ex.: 100 cores)
kubectl create deployment faminto --image=nginx
kubectl set resources deployment faminto --requests=cpu=100

# 2) O pod fica Pending: não há nó que comporte a request
kubectl get pods -l app=faminto           # STATUS = Pending

# 3) Veja o motivo — é EXATAMENTE o sinal que o Karpenter escuta pra provisionar
kubectl describe pod -l app=faminto | grep -A3 Events
#   -> "0/N nodes are available: Insufficient cpu" (FailedScheduling)

# 4) Limpe
kubectl delete deployment faminto
```

**O que observar:** o evento `FailedScheduling / Insufficient cpu` é o pod `unschedulable`. Num cluster com Karpenter, é esse evento que dispara o provisionamento de um nó do tamanho certo em segundos.

### Dica do professor

Rode cargas stateless e tolerantes a interrupção em **Spot**, e reserve **On-Demand** só pro que é crítico/stateful — em NodePools separados. Combine com PodDisruptionBudget e Topology Spread pra que uma interrupção de Spot nunca derrube réplicas demais de um serviço ao mesmo tempo.

### Anota aí

> Karpenter provisiona o nó certo just-in-time reagindo a pods `Pending`, faz right-sizing e economiza com Spot — sempre respeitando o PodDisruptionBudget.

---

## Etapa 08 — Escalabilidade de aplicações com KEDA

### O problema

Você tem *workers* que consomem pedidos de uma fila. O HPA padrão só sabe escalar por CPU/memória — mas o seu gargalo não é CPU, é o **tamanho da fila** de pedidos. Pior: de madrugada a fila fica vazia, e mesmo assim você paga por 3 pods parados sem nada pra fazer. Você queria escalar pelo tamanho da fila e cair até **zero** quando não há trabalho.

**Analogia:** um caixa de banco que abre guichês conforme a fila cresce. Ninguém na fila? Zero guichês abertos (não paga funcionário à toa). Chegou uma pessoa? Abre um guichê na hora. Fila de 40 e cada guichê atende de 10 em 10? Abre 4 guichês. Esvaziou e ficou vazia um tempo? Fecha todos.

### Conceitos-chave

**KEDA = autoscaling orientado a eventos.** Escala com base em **eventos externos** (filas RabbitMQ/SQS/Kafka, métricas Prometheus, cron, etc.) e permite **scale-to-zero** — nenhum pod consumindo recursos quando a fila está vazia. Ideal pra workloads event-driven e cenários serverless. Ele **complementa** o HPA, não substitui.

**Como funciona.** Você cria um **ScaledObject** (o CRD central) que aponta pra um Deployment alvo e define um **trigger** (ex.: fila RabbitMQ, 1 pod a cada 10 mensagens). O KEDA cria um HPA por trás. Fila vazia → mantém o Deployment em 0 pods. Chega mensagem → ativa 1 pod imediatamente. Fila cresce → o HPA calcula os pods pra manter ~10 msgs/pod (40 mensagens = 4 pods). Fila esvazia e fica vazia pelo `cooldownPeriod` → volta a zero. **Só o KEDA tem autoridade pra ir a zero; o HPA sozinho vai de 1 a N** (o `minReplicas` do HPA é ≥ 1).

**A teoria (teoria de filas).** Modele eventos chegando a taxa `λ` e cada pod processando a `μ`; com `c` pods, a capacidade é `c·μ`. **Condição de estabilidade:** `λ < c·μ` (senão a fila cresce sem limite — nem autoscaling salva). A **Lei de Little** (`L = λ·W`) relaciona backlog médio `L`, taxa `λ` e tempo de resposta `W`: se o backlog cresce, ou as chegadas estão rápidas demais, ou faltam pods. O autoscaler ideal controla `L` pra manter `W` dentro do SLO.

**O desafio: oscilação/jitter** (subir e descer pods repetidamente). Causas: atraso de realimentação e thresholds estáticos. Mitigações do KEDA/HPA:
- **Histerese** (~10%) — só escala se passar de 110% ou cair abaixo de 90% do alvo.
- **Janelas de estabilização** e `cooldownPeriod`.
- **Banda morta** — limiares distintos de subida e descida (escala up em 100 msgs mas só down abaixo de 20), evitando ping-pong.

Como filas absorvem bursts naturalmente, aceita-se algum backlog temporário enquanto novos pods sobem.

**Alcance.** O KEDA é **agnóstico de nuvem** (AKS, EKS, GKE, on-prem) e extensível via **scalers externos gRPC** (qualquer fonte de evento vira trigger). Caso típico: e-commerce escalando workers de pedidos por fila do Service Bus/SQS durante promoções relâmpago, voltando a zero na madrugada. Tendência: triggers por **SLO** (latência/erro) e por **custo** (FinOps).

### Exemplo comentado — ScaledObject escalando por fila RabbitMQ

```yaml
apiVersion: keda.sh/v1alpha1
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
        value: "10"         # alvo: 1 pod a cada 10 mensagens na fila
```

### Comandos

- `kubectl get scaledobject` — lista os ScaledObjects e o HPA gerado por trás.
- `kubectl describe hpa <nome>` — mostra os eventos de escalonamento (`Scaled up to 4 replicas; reason: queueLength above target`).
- `kubectl get deployment meu-deployment -w` — observa as réplicas subindo/descendo em tempo real.

### Mão na massa

Você pode testar o KEDA **sem fila externa**, usando o trigger `cron` (que não depende de nenhum sistema) pra ver scale-to-zero e reativação:

```sh
# Pré-requisito: KEDA instalado (helm repo add kedacore https://kedacore.github.io/charts && helm install keda kedacore/keda -n keda --create-namespace)

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
kubectl delete scaledobject cron-demo; kubectl delete deployment cron-demo
```

**O que observar:** fora da janela cron, o Deployment fica com **0 réplicas** (o HPA comum nunca faria isso) e volta pra 3 dentro da janela. Esse é o scale-to-zero, sem depender de RabbitMQ.

### Dica do professor

Ajuste `pollingInterval` e `cooldownPeriod` pensando na dinâmica da carga. Cooldown curto demais mata pods bons no meio de um burst intermitente; longo demais desperdiça recursos. E lembre: se `λ ≥ c·μ` de forma sustentada, **nenhum autoscaling resolve** — o gargalo é capacidade ou código, não número de pods.

### Anota aí

> KEDA escala por eventos (fila, cron, métrica) e é o único que leva a zero; mas se `λ ≥ c·μ` de forma sustentada, o problema é capacidade, não autoscaler.

---

## Etapa 09 — Segurança no cluster

### O problema

Seu cluster tem vários times e serviços. Um deles roda uma dependência com vulnerabilidade e é comprometido. Se aquele pod usava a ServiceAccount `default` com permissões amplas — ou pior, tinha uma chave AWS estática embutida no container — o invasor acabou de virar dono do reino: lê segredos de todos os namespaces, cria pods de mineração, acessa buckets. Um único container furado não pode custar o cluster inteiro.

**Analogia:** um hotel. Cada hóspede recebe um cartão que abre **só o próprio quarto** (ServiceAccount + RBAC de menor privilégio), não a chave-mestra. As portas se trancam sozinhas e os cartões expiram no checkout (TLS e tokens de curta duração). A filosofia é **Zero Trust**: ninguém é confiável por padrão, todo acesso é verificado.

### Conceitos-chave

Segurança em Kubernetes se apoia em três pilares — **identidade**, **autorização** e **criptografia** — todos sob Zero Trust.

**Identidade — ServiceAccounts.** Cada aplicação deve ter a **sua própria** ServiceAccount, nunca a `default`. Ela dá ao pod um token pra falar com o API Server. Isolar identidades por workload é o que permite delimitar o estrago quando um pod é comprometido.

**Autorização — RBAC.** Concede permissões via **Roles** (namespaced) ou **ClusterRoles** (cluster-wide), ligadas a sujeitos por **RoleBindings**. O modelo é um grafo: `Subject → RoleBinding → Role → Permissão`. Menor privilégio na prática:
- Prefira **Role namespaced** a ClusterRole — limita ao namespace.
- Conceda só os **verbos** necessários (`get`, `list` — nunca `*`) e só os **recursos** necessários.
- Nunca use curinga `*` em recursos nem verbos.

O RBAC do Kubernetes é **estático e aditivo** (só soma permissões, não há negações), o que o torna **auditável**: dá pra listar quem pode fazer o quê deterministicamente. O **ABAC** (baseado em atributos) é mais expressivo mas opaco, e foi praticamente aposentado. Pra políticas condicionais ("negar pod sem limits", "só imagem `stable`"), usa-se **OPA/Gatekeeper** com a linguagem **Rego** (Policy as Code).

**Identidade federada com a nuvem.** Aplicações precisam acessar S3, buckets, Key Vault — **sem embutir chaves estáticas** no container. A solução é federar a ServiceAccount do K8s com uma identidade cloud via OIDC, recebendo **tokens de curta duração**:
- **IRSA** (IAM Roles for Service Accounts) no EKS — anota a SA com o ARN de uma IAM Role. Cada app com sua Role mínima.
- **Workload Identity** no GKE e no AKS — mapeia a SA a uma conta de serviço cloud.

Isso elimina segredos estáticos e restringe a credencial ao contexto do pod. Os incidentes provam o valor: no ataque **SCARLETEEL** (2023), o dano foi limitado porque a Role do pod tinha escopo restrito; no caso da **Tesla** (2018), um dashboard sem senha + credenciais AWS amplas num pod levou a *cryptojacking*. Lições: menor privilégio no IAM, nunca expor dashboards, nunca colocar segredos estáticos em pods.

**Criptografia — cert-manager.** Gerenciar certificados TLS na mão não escala (expiram, ficam inconsistentes). O **cert-manager** automatiza o ciclo de vida via CRDs: **Issuer/ClusterIssuer** (quem emite — self-signed, CA interna, ACME/Let's Encrypt, Vault) e **Certificate** (o que emitir: CN, SANs, duração e `renewBefore`). Ele gera o CSR, assina, preenche o Secret com `tls.crt`/`tls.key` e renova sozinho. Isso apoia a **PKI** do cluster: certificados X.509 numa cadeia de confiança até uma Root CA. O próprio Kubernetes usa **múltiplas CAs** (etcd, API server, front-proxy) pra compartimentalizar — se uma vaza, não compromete as outras.

**Rotação de segredos.** Segredos precisam ser trocados pra reduzir a janela de exposição. Rotação instantânea é impraticável em sistemas distribuídos (não há lock global), então usa-se **período de convivência**: nova e antiga válidas ao mesmo tempo até todos migrarem, depois invalida a antiga. Segredos **dinâmicos** (Vault, tokens JWT de minutos) quase dispensam rotação porque já são efêmeros. Cuidado ao rotacionar a chave de criptografia do etcd: todos os nós de controle precisam conhecer a nova chave *antes* de alguém escrever com ela, senão vira split-brain.

### Exemplo comentado — ServiceAccount + Role de menor privilégio + IRSA

```yaml
apiVersion: v1
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
    namespace: analytics
```

```yaml
# cert-manager: emite e renova TLS interno automaticamente
apiVersion: cert-manager.io/v1
kind: Certificate
metadata: { name: service-a-cert }
spec:
  secretName: service-a-tls   # onde o cert-manager grava tls.crt / tls.key
  duration: 2160h             # validade de 90 dias
  renewBefore: 360h           # renova 15 dias ANTES de expirar (sem intervenção)
  commonName: service-a.default.svc.cluster.local
  dnsNames: [ service-a, service-a.default.svc.cluster.local ]  # SANs
  issuerRef: { name: cluster-ca-issuer, kind: Issuer }          # quem assina
```

### Comandos

- `kubectl auth can-i <verbo> <recurso> --as=system:serviceaccount:<ns>:<sa>` — testa se uma SA tem uma permissão (auditoria de RBAC).
- `kubectl get rolebindings,clusterrolebindings -A -o wide` — mapeia quem tem acesso a quê.
- `kubectl get certificate -A` — estado dos certificados gerenciados pelo cert-manager.
- `kubectl create token <sa>` — gera um token de curta duração pra uma ServiceAccount.

### Mão na massa

Prove o menor privilégio com `kubectl auth can-i`, sem precisar de nuvem:

```sh
# 1) Namespace, SA e Role de só-leitura de pods
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
kubectl delete namespace lab
```

**O que observar:** `yes` só para o que você concedeu explicitamente (`list pods`); `no` para tudo o mais. É o RBAC aditivo e auditável em ação — se um pod com essa SA for comprometido, o invasor fica preso a "listar pods neste namespace" e nada além.

### Dica do professor

Use `kubectl auth can-i --as=...` **no CI** pra validar que suas ServiceAccounts têm *exatamente* as permissões esperadas e nada além. Combine com IRSA/Workload Identity de escopo mínimo — assim, mesmo que um container seja comprometido, o invasor fica preso ao que aquela identidade específica pode fazer, dentro e fora do cluster.

### Anota aí

> Uma SA por app + Role namespaced de verbos específicos + tokens de curta duração (IRSA/Workload Identity): é isso que transforma "container comprometido" em incidente contido, não em cluster perdido.

---

## Checklist de autoavaliação

Marque cada item só quando conseguir **explicar em voz alta e reproduzir em um cluster**:

**Etapa 01 — Saúde e recursos**
- [ ] Sei a diferença entre liveness (reinicia), readiness (tira do tráfego) e startup (protege o boot).
- [ ] Sei por que banco de dados não vai na liveness probe.
- [ ] Consigo dizer a classe de QoS de um pod olhando seus requests/limits e prever quem é despejado primeiro.
- [ ] Entendo por que limitar CPU pode piorar a latência (throttling do CFS).

**Etapa 02 — Agendamento**
- [ ] Sei que taint repele e affinity atrai, e por que preciso dos dois pra isolar um nó.
- [ ] Diferencio `NoSchedule`, `PreferNoSchedule` e `NoExecute`.
- [ ] Distingo eviction (kubelet salva o nó) de OOMKill (cgroup mata um container).

**Etapa 03 — Rollouts**
- [ ] Explico `maxUnavailable` (freio) e `maxSurge` (potência) e calculo a disponibilidade durante o rollout.
- [ ] Sei quando usar Recreate em vez de RollingUpdate.
- [ ] Faço `rollout undo` e entendo por que ele é instantâneo.

**Etapa 04 — Helm**
- [ ] Distingo `version` (chart) de `appVersion` (app).
- [ ] Explico por que o template é função pura e uso `helm template` pra testar antes de aplicar.
- [ ] Entendo idempotência e imutabilidade e como elas sustentam o rollback.

**Etapa 05 — Blue/Green**
- [ ] Sei promover e reverter com um patch no `selector` do Service.
- [ ] Consigo explicar por que a compatibilidade de esquema do banco é o maior risco.

**Etapa 06 — Canário**
- [ ] Diferencio Canary (progressivo) de Blue/Green (tudo ou nada).
- [ ] Entendo por que roteamento por peso (service mesh) é superior a controlar por réplicas.
- [ ] Sei amarrar a promoção/rollback a SLOs.

**Etapa 07 — Karpenter**
- [ ] Explico o fluxo pod `Pending` → provisiona nó sob medida → agenda.
- [ ] Diferencio Karpenter (right-sizing) de Cluster Autoscaler (grupos fixos).
- [ ] Sei por que rodar Spot pra stateless e On-Demand pra crítico, com PDB.

**Etapa 08 — KEDA**
- [ ] Sei o que é ScaledObject, trigger e scale-to-zero.
- [ ] Entendo a condição de estabilidade `λ < c·μ` e por que autoscaling não salva quando ela é violada.
- [ ] Sei o que causa jitter e como histerese/cooldown/banda morta o evitam.

**Etapa 09 — Segurança**
- [ ] Crio SA + Role + RoleBinding de menor privilégio e valido com `kubectl auth can-i`.
- [ ] Explico IRSA/Workload Identity e por que eliminam chaves estáticas.
- [ ] Entendo o papel do cert-manager (Issuer + Certificate) e da rotação com período de convivência.

---

## Notas do professor (revisão técnica)

Revisei o material bruto tecnicamente. Ele estava sólido e sem erros técnicos relevantes — não precisei corrigir nenhuma afirmação de fato. Os ajustes que fiz foram **de clareza e ênfase**, não de conteúdo:

1. **Reforço, não correção:** deixei explícito em duas passagens que o Deployment com `progressDeadlineSeconds` apenas *detecta* rollout travado, mas **não** faz rollback sozinho (o material já dizia isso nos conceitos-chave; só trouxe pro corpo do texto pra evitar mal-entendido comum).
2. **Precisão sobre eviction e PDB:** confirmei e mantive a afirmação de que a *eviction por pressão de nó* (feita pelo kubelet) ignora o PodDisruptionBudget — isso está correto e é diferente da *eviction via API* (`kubectl drain` / o `/eviction` endpoint), que **respeita** o PDB. Adicionei a nuance "por pressão de nó" para não generalizar demais.
3. **Limite do exercício de canário:** como a maioria dos ambientes de estudo não tem Istio, o hands-on da Etapa 06 aproxima o canário por proporção de réplicas — e deixei anotado que essa técnica só dá frações grosseiras, justamente para reforçar por que um service mesh (peso independente de réplicas) é a ferramenta correta.
4. **Sobre o `issuerRef` do exemplo de cert-manager:** mantive `kind: Issuer` como no original. Vale a observação de que, se o emissor for de escopo de cluster, o campo deve ser `kind: ClusterIssuer`; o nome `cluster-ca-issuer` no exemplo é apenas um rótulo e não muda o `kind`.

Nenhum YAML, comando ou fórmula do material original foi alterado em seu significado técnico.
