# Kubernetes Básico — relatório de estudo

> Conteúdo extraído de `src/data/kubernetesbasico.ts` — 8 etapas baseadas nas aulas 1-8 (Thiago Adriano / FIAP).

## Etapa 01 — Por que o Kubernetes existe (motivação + setup)

Todo projeto de software esbarra em dois problemas: manter vários ambientes iguais (dev, testes, produção) e escalar quando a demanda muda. O Kubernetes automatiza a solução dos dois.

Pense num e-commerce: ele vive tranquilo o ano inteiro e explode na Black Friday. Comprar servidor pro pico é desperdício em 11 meses; dimensionar pro dia a dia derruba o site no pico. Você precisa crescer e encolher sob demanda. Ao mesmo tempo, qualquer diferença entre a sua máquina, a do QA e a produção vira o clássico "na minha máquina funciona".

A peça comum das duas soluções é o container. Ele parece uma máquina virtual, mas não é: a VM carrega um sistema operacional completo (gigabytes, minutos pra subir); o container compartilha o kernel do SO hospedeiro e leva só os arquivos, binários e bibliotecas que o app precisa (megabytes, segundos). Uma imagem de container é um ambiente inteiro, replicável em qualquer lugar.

Só que com dezenas ou centenas de containers, alguém precisa criá-los, destruí-los, vigiar a saúde e recriar o que falhar — fazer isso na mão não escala. O Kubernetes (K8s) é o orquestrador que assume essas tarefas: você declara o estado desejado ("quero 3 cópias disso rodando") e ele mantém a realidade de acordo, inclusive de madrugada quando um container morre.

### Conceitos-chave

- **Container ≠ VM** — VM = hardware virtual + SO completo. Container = só o necessário do app, compartilhando o kernel do hospedeiro. Muito mais leve.
- **Escala horizontal** — Mais cópias da aplicação dividindo a carga (é o que o K8s automatiza). Vertical = mais CPU/RAM na mesma máquina.
- **Cluster e Pod** — O K8s organiza máquinas (nós) em clusters. Os containers rodam agrupados em Pods — a menor unidade gerenciada.
- **kubectl** — A ferramenta de linha de comando que conversa com a API REST do cluster. É o seu controle remoto.
- **Minikube** — Um cluster K8s de 1 nó rodando na sua máquina. Feito pra estudo — é o laboratório deste guia.
- **Estado desejado** — A filosofia do K8s: você declara o que quer, ele faz acontecer e mantém. Caiu? Ele recria sozinho.

### Montando o laboratório (passo a passo)

```sh
# 1. Instale o Docker Desktop (docker.com) e confirme:
$ docker -v
Docker version 27.x

# 2. Instale o kubectl (kubernetes.io/docs/tasks/tools) e confirme:
$ kubectl version --output=yaml

# 3. Instale o Minikube (minikube.sigs.k8s.io/docs/start) e suba o cluster:
$ minikube start
😄  minikube v1.33 on Windows 11
✨  Using the docker driver
🏄  Done! kubectl is now configured to use "minikube"

# 4. Confirme que o cluster está de pé:
$ kubectl get nodes
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   1m    v1.30.x

# 5. Cluster vazio = sucesso:
$ kubectl get pods
No resources found in default namespace.
```

Nota: a primeira execução do `minikube start` baixa a imagem do cluster e demora alguns minutos.

### Comandos

- `minikube start` — sobe o cluster local de 1 nó
- `minikube stop` — para o cluster sem apagar nada
- `kubectl get nodes` — lista os nós e o status
- `kubectl get pods` — lista os pods do namespace atual

**Dica:** se o `minikube start` falhar, a causa mais comum é o Docker Desktop não estar aberto. Suba o Docker primeiro e tente de novo.

## Etapa 02 — kubectl e a API: como você comanda o cluster

Tudo no Kubernetes passa pela API REST do nó master. O kubectl é o cliente dessa API: cada comando que você digita vira uma requisição HTTP (GET, POST, PUT, DELETE) contra o cluster.

O caminho de um comando: você digita `kubectl get pods` → o kubectl lê o arquivo kubeconfig (que guarda o endereço do API Server, as credenciais e o contexto do cluster atual — o Minikube configura isso sozinho) → e dispara um GET /api/v1/pods contra o API Server. A resposta volta formatada no seu terminal.

A API é dividida em grupos: o grupo "core" tem os recursos fundamentais (pods, services, replicasets); outros grupos cuidam de segurança, armazenamento, autoscaling. Como é REST puro, dá pra chamar de qualquer linguagem — Python, Go, Java, C# — o que abre portas pra automação.

Existem dois jeitos de trabalhar: o imperativo (`kubectl run nginx --image=nginx` — você dá a ordem direta, bom pra testes rápidos) e o declarativo (escrever um YAML e rodar `kubectl apply -f arquivo.yaml` — você descreve o estado desejado). Em projetos reais o declarativo domina, porque o arquivo é versionável no Git.

### Os verbos que resolvem 90% do dia

- **get** — Consultar: lista recursos e o status de cada um. `kubectl get pods`, `get svc`, `get nodes`...
- **create / run / apply** — Criar: `run` cria um pod imperativo; `apply -f` aplica um YAML (declarativo).
- **delete** — Remover: `kubectl delete pod nginx`. Cuidado — pode afetar quem depende do recurso.
- **describe** — Detalhar: mostra configuração + a seção Events. É a primeira parada quando algo trava.
- **logs** — Ver o que o container está imprimindo. Seu melhor amigo no debug.
- **exec** — Abrir um shell dentro do container: `kubectl exec -it <pod> -- /bin/sh`.

### Exemplo estruturado: ciclo de vida de um Pod

```sh
# Cria um pod chamado "nginx" a partir da imagem nginx:1.14.2 do Docker Hub
$ kubectl run nginx --image=nginx:1.14.2 --port=80
pod/nginx created

# Acompanhe até o status ficar Running (o primeiro estado é ContainerCreating)
$ kubectl get pods
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          30s

# Detalhes + eventos (veja a linha "Pulling image" na seção Events)
$ kubectl describe pod nginx

# O que o container está imprimindo
$ kubectl logs nginx

# Limpeza
$ kubectl delete pod nginx
pod "nginx" deleted
```

Nota: se o status ficar em ImagePullBackOff, o cluster não conseguiu baixar a imagem — confira o nome/tag e sua internet.

### Comandos

- `kubectl run nginx --image=nginx:1.14.2 --port=80` — cria um pod imperativo
- `kubectl describe pod <nome>` — detalhes + Events (troubleshooting)
- `kubectl logs <nome>` — saída do container
- `kubectl exec -it <nome> -- /bin/sh` — shell dentro do container
- `kubectl delete pod <nome>` — remove o pod

**Dica:** grave o fluxo de debug: `get pods` (qual o status?) → `describe pod` (o que dizem os Events?) → `logs` (o que o app diz?). Essa sequência resolve a maioria dos problemas.

## Etapa 03 — A anatomia do cluster — e a menor unidade dele: o Pod

Um cluster é um grupo de máquinas (nodes) trabalhando juntas. O Pod é a menor unidade que o Kubernetes gerencia: um "envelope" com um ou mais containers que dividem rede e armazenamento.

O cluster tem papéis bem definidos: o Master node decide onde e como executar os Pods; os Worker nodes executam de fato; o etcd é o banco distribuído que guarda a configuração e o estado de tudo; o kubelet é o agente que roda em cada node gerenciando os Pods dali; e o kube-proxy encaminha o tráfego de rede até o Pod certo.

Quatro fatos sobre Pods: (1) um Pod representa um processo em execução e pode ter mais de um container dividindo o mesmo IP e volumes; (2) Pods são efêmeros — nascem e morrem o tempo todo, nunca conte com um Pod específico existir amanhã; (3) cada Pod ganha um IP interno do cluster; (4) Pods são descritos em YAML.

Pra organizar tudo isso existem os rótulos (labels) e as anotações (annotations). Labels são pares chave-valor usados pra IDENTIFICAR E SELECIONAR objetos — é por label que um Service acha seus Pods. Annotations são metadados livres (autor, documentação, auditoria) que NÃO participam de seleção. Essa diferença é o que cai em prova.

### Quem faz o quê dentro do cluster

- **Master node** — O cérebro: gerencia o cluster e decide onde executar os Pods.
- **Worker node** — Os braços: executam os Pods e demais recursos.
- **etcd** — Banco de dados distribuído com a configuração e o estado do cluster.
- **kubelet** — Agente em cada node que gerencia os Pods locais.
- **kube-proxy** — Encaminha o tráfego de rede pros Pods certos.
- **API Server** — A porta de entrada — tudo que o kubectl faz passa por aqui.

### O primeiro YAML — decore este esqueleto

```yaml
apiVersion: v1                # versão da API do K8s p/ este objeto
kind: Pod                     # o TIPO de objeto criado
metadata:                     # dados SOBRE o objeto
  name: meu-pod
  labels:                     # rótulos: chave-valor p/ SELECIONAR
    app: myapp
    ambiente: estudo
  annotations:                # anotações: metadados livres (docs)
    autor: "Davi Gomes"
spec:                         # a ESPECIFICAÇÃO: o que roda dentro
  containers:
    - name: meu-container
      image: nginx:1.14.2
      ports:
        - containerPort: 80
```

Nota: todo objeto K8s segue esse esqueleto: apiVersion + kind + metadata + spec. Muda o kind e o conteúdo do spec — o resto é sempre igual.

```sh
# Aplica o YAML (declarativo)
$ kubectl apply -f meu-pod.yaml
pod/meu-pod created

# Lista mostrando os labels
$ kubectl get pods --show-labels
NAME      READY   STATUS    LABELS
meu-pod   1/1     Running   ambiente=estudo,app=myapp

# Filtra por label — o mecanismo central do K8s
$ kubectl get pods -l app=myapp
NAME      READY   STATUS    RESTARTS   AGE
meu-pod   1/1     Running   0          1m

# Adiciona label num pod que já existe
$ kubectl label pod meu-pod time=devops
```

Nota: esse filtro `-l` parece bobo agora, mas Services, ReplicaSets e Deployments encontram "seus" Pods exatamente assim: por label selector.

### Comandos

- `kubectl apply -f arquivo.yaml` — cria/atualiza pelo YAML
- `kubectl get pods --show-labels` — lista exibindo rótulos
- `kubectl get pods -l app=myapp` — filtra por rótulo
- `kubectl delete -f arquivo.yaml` — remove o que o arquivo criou

**Dica:** Labels = seleção operacional (o K8s usa). Annotations = documentação (humanos usam). Autor de um Pod? Annotation. Agrupar Pods de uma app? Label.

## Etapa 04 — Services: endereço fixo pra Pods que mudam

Se os Pods nascem e morrem com IPs diferentes, como alguém fala com eles de forma confiável? Resposta: o Service — um ponto de entrada estável que encontra os Pods por label e balanceia o tráfego entre eles.

O fluxo: uma requisição chega no Service (que tem IP e nome fixos) → o Service seleciona os Pods pelo label selector → e distribui o tráfego de forma balanceada entre as réplicas saudáveis. O nome do Service vira um hostname interno do cluster: se o Service chama "auth-service", qualquer Pod acessa http://auth-service — mesmo que os Pods por trás troquem de IP mil vezes.

Existem três tipos: ClusterIP (o padrão — IP interno, acessível só dentro do cluster; certo pra comunicação entre serviços), NodePort (abre uma porta fixa de 30000 a 32767 no nó; acessível de fora via IP-do-nó:porta — ótimo pra expor algo no Minikube) e LoadBalancer (provisiona um balanceador externo com IP público; é o tipo usado na nuvem).

A segunda peça da etapa é o ConfigMap: serviços precisam de configuração (portas, URLs, flags), e colocar isso dentro da imagem obriga a rebuildar a cada mudança. O ConfigMap separa a configuração do container — você guarda os valores num objeto central e injeta de 3 formas: variáveis de ambiente (a mais comum, via envFrom), arquivos montados (ótimo pra configs longas) ou argumentos de linha de comando.

### Os 3 tipos de Service

- **ClusterIP (padrão)** — IP interno, só dentro do cluster. Use pra comunicação entre serviços (ex.: API ↔ banco).
- **NodePort** — Porta fixa (30000–32767) aberta no nó. Acessível de fora — o jeito de expor no Minikube.
- **LoadBalancer** — Balanceador externo com IP público. É o tipo de produção na nuvem (AWS, GCP, Azure).

### Os YAMLs — repare no selector

```yaml
apiVersion: v1
kind: Service
metadata:
  name: meu-service            # vira o hostname interno
spec:
  type: NodePort               # troque p/ ClusterIP (interno) ou LoadBalancer (nuvem)
  selector:                    # ← O ELO: procura Pods com este label
    app: myapp
  ports:
    - protocol: TCP
      port: 80                 # porta em que o Service escuta
      targetPort: 80           # porta do container que recebe
      nodePort: 30080          # porta exposta no nó (só NodePort)
```

Nota: o selector do Service casa com o label do Pod (app: myapp). É assim que ele sabe pra quem mandar o tráfego.

```yaml
# 1) O ConfigMap com os valores...
apiVersion: v1
kind: ConfigMap
metadata:
  name: minha-config
data:
  MENSAGEM: "olá do configmap!"
  MODO: "estudo"
---
# 2) ...injetado como variáveis de ambiente no Pod
apiVersion: v1
kind: Pod
metadata:
  name: pod-config
spec:
  containers:
    - name: app
      image: nginx:1.14.2
      envFrom:                 # injeta TODAS as chaves de uma vez
        - configMapRef:
            name: minha-config
```

Nota: confirme a injeção com: `kubectl exec pod-config -- env`

```sh
$ kubectl apply -f app.yaml
$ kubectl get svc
NAME          TYPE       CLUSTER-IP    PORT(S)
meu-service   NodePort   10.96.xx.xx   80:30080/TCP

# Gera a URL de acesso (no Windows/Docker, deixe o terminal aberto — é um túnel)
$ minikube service meu-service --url
http://127.0.0.1:53412   ← abra no navegador: página do nginx!
```

### Comandos

- `kubectl get svc` — lista os Services
- `minikube service <nome> --url` — URL de acesso a um NodePort
- `kubectl get configmap` — lista os ConfigMaps
- `kubectl exec <pod> -- env` — confere variáveis injetadas

**Dica:** regra de ouro: exponha o mínimo. Banco de dados = ClusterIP (invisível de fora). Só a porta de entrada do sistema vira NodePort/LoadBalancer. Pra senhas e chaves, o irmão seguro do ConfigMap é o Secret.

## Etapa 05 — Auto-cura e escala: ReplicaSets e Deployments

Criar Pod na mão foi ótimo pra aprender — mas ninguém faz isso em produção. O ReplicaSet garante que N réplicas existam sempre; o Deployment embrulha o ReplicaSet e adiciona atualização sem downtime e rollback.

O ReplicaSet é o vigia do número: você declara "replicas: 3" e ele monitora os Pods pelo label selector. Caiu um? Ele detecta que a contagem baixou e cria outro em segundos, sem você pedir. É a auto-cura do Kubernetes em ação — o "estado desejado" mantido de verdade.

O Deployment adiciona a gestão de versões: no Rolling Update, ao trocar a imagem, ele sobe réplicas novas e desliga as antigas gradualmente — o serviço nunca fica fora do ar. Se a versão nova quebrar, o `kubectl rollout undo` volta pra anterior (rollback). E escalar é um comando: `kubectl scale --replicas=5`.

Os YAMLs de ReplicaSet e Deployment são quase idênticos, mas no dia a dia usamos quase sempre o Deployment, justamente pelo controle de versão. O Deployment cria e gerencia o ReplicaSet por baixo dos panos.

### O que cada um garante

- **ReplicaSet** — N réplicas rodando SEMPRE. Caiu uma, nasce outra. Seleção por label selector.
- **Rolling Update** — Troca de versão gradual: sobe as novas, desliga as antigas. Zero downtime.
- **Rollback** — A versão nova quebrou? `kubectl rollout undo` volta pra anterior em segundos.

### O Deployment completo + ciclo de vida

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-fiap
spec:
  replicas: 3                  # quero 3 cópias, sempre
  selector:
    matchLabels:
      app: nginx-app           # gerencio os Pods com este label...
  template:                    # ...e este é o "molde" de cada Pod
    metadata:
      labels:
        app: nginx-app         # tem que casar com o selector ↑
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2  # trocar esta versão dispara o rolling update
          ports:
            - containerPort: 80
```

```sh
$ kubectl apply -f deployment.yaml
$ kubectl get pods
nginx-fiap-7d4b9c-aaa   1/1   Running
nginx-fiap-7d4b9c-bbb   1/1   Running
nginx-fiap-7d4b9c-ccc   1/1   Running

# Mate um pod de propósito:
$ kubectl delete pod nginx-fiap-7d4b9c-aaa

# Olhe de novo: um pod NOVO já está nascendo pra manter as 3 réplicas
$ kubectl get pods
nginx-fiap-7d4b9c-bbb   1/1   Running
nginx-fiap-7d4b9c-ccc   1/1   Running
nginx-fiap-7d4b9c-ddd   0/1   ContainerCreating   ← auto-cura!
```

```sh
# Rolling update: troca a imagem
$ kubectl set image deployment/nginx-fiap nginx=nginx:1.16.1
$ kubectl rollout status deployment/nginx-fiap
deployment "nginx-fiap" successfully rolled out

# Quebre de propósito (imagem que não existe):
$ kubectl set image deployment/nginx-fiap nginx=nginx:nao-existe
$ kubectl get pods
nginx-fiap-7d4b9c-bbb   1/1   Running            ← antigos seguram o serviço
nginx-fiap-9f8e2a-xyz   0/1   ImagePullBackOff   ← novos travados

# Rollback: volta tudo pra versão anterior
$ kubectl rollout undo deployment/nginx-fiap
deployment.apps/nginx-fiap rolled back
```

Nota: repare: o K8s só desliga os Pods antigos quando os novos ficam prontos. Como a imagem quebrada nunca fica pronta, os antigos seguram o serviço no ar.

### Comandos

- `kubectl scale deployment <nome> --replicas=5` — escala manual
- `kubectl set image deployment/<nome> ctn=img:tag` — dispara rolling update
- `kubectl rollout status deployment/<nome>` — acompanha a troca
- `kubectl rollout history deployment/<nome>` — lista revisões
- `kubectl rollout undo deployment/<nome>` — rollback!

**Dica:** faça o teste da auto-cura pelo menos uma vez: aplicar o deployment, deletar um pod na mão e ver o substituto nascer. É o momento em que o Kubernetes "clica" na cabeça.

## Etapa 06 — Volumes: dados que sobrevivem ao Pod

Pods são efêmeros — mas os dados de um banco não podem ser. O Kubernetes resolve isso com uma cadeia de 4 conceitos: Volume, PersistentVolume (PV), PersistentVolumeClaim (PVC) e StorageClass (SC).

Memorize pela analogia: o PVC é o PEDIDO ("quero 1Gi, leitura e escrita por um nó"), o PV é o DISCO real que atende o pedido (NFS, EBS da AWS, hostPath...), e a StorageClass é o CARDÁPIO de tipos de disco (padrão? SSD rápido?). O Pod só referencia o PVC — ele não precisa saber onde o disco fica fisicamente.

Os tipos de volume mais comuns: emptyDir (nasce vazio com o Pod e MORRE com o Pod — serve pra arquivos temporários e pra compartilhar dados entre containers do mesmo Pod), hostPath (monta um diretório do nó dentro do container — útil em dev, perigoso em produção) e persistentVolumeClaim (o jeito certo pra dados de verdade: sobrevivem a reinício e recriação do Pod).

Os modos de acesso do PVC dizem quem pode montar o volume: ReadWriteOnce (leitura e escrita por UM nó — o caso típico de banco de dados), ReadOnlyMany (só leitura, vários nós — assets estáticos) e ReadWriteMany (leitura e escrita por vários nós — precisa de NFS ou similar).

### A cadeia de armazenamento

- **emptyDir** — Vive e morre com o Pod. Pra dado temporário e compartilhamento entre containers do Pod.
- **hostPath** — Monta diretório do NÓ no container. Dev ok; produção, cuidado (amarra o Pod ao nó).
- **PVC → PV** — O pedido (Claim) casa com o disco (Volume). Dados sobrevivem à morte do Pod.
- **StorageClass** — Provisiona PVs automaticamente por perfil. No Minikube, a classe "standard" já faz isso.

### Prove a persistência: escreva, destrua, leia de volta

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: meu-pvc
spec:
  accessModes:
    - ReadWriteOnce            # um nó lê e escreve (típico de banco)
  resources:
    requests:
      storage: 1Gi             # quanto disco eu quero
# no Minikube, a StorageClass "standard" provisiona o PV sozinha
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-persistente
spec:
  containers:
    - name: app
      image: nginx:1.14.2
      volumeMounts:
        - name: dados
          mountPath: /dados    # onde o volume aparece no container
  volumes:
    - name: dados
      persistentVolumeClaim:   # ← aponta pro PVC (em vez de emptyDir)
        claimName: meu-pvc
```

```sh
$ kubectl apply -f pvc.yaml -f pod-com-pvc.yaml

# Bound = o PV foi criado e vinculado ao pedido
$ kubectl get pvc
NAME      STATUS   VOLUME         CAPACITY   ACCESS MODES
meu-pvc   Bound    pvc-3f2a1...   1Gi        RWO

# Escreva um arquivo no volume
$ kubectl exec pod-persistente -- sh -c "echo 'sobrevivi!' > /dados/teste.txt"

# DESTRUA o pod (o PVC continua existindo)
$ kubectl delete pod pod-persistente

# Recrie o pod e leia o arquivo:
$ kubectl apply -f pod-com-pvc.yaml
$ kubectl exec pod-persistente -- cat /dados/teste.txt
sobrevivi!            ← o Pod morreu, o dado não.
```

Nota: experimento extra: repita com emptyDir — ao recriar o Pod, o arquivo terá sumido. Essa é exatamente a diferença entre efêmero e persistente.

### Comandos

- `kubectl get pvc` — pedidos de volume (Bound = ok)
- `kubectl get pv` — discos persistentes do cluster
- `kubectl delete pvc <nome>` — remove o pedido (e libera o disco)

**Dica:** dado importante SEMPRE em PVC. Se os dados sumiram após um restart, aposto que estavam em emptyDir ou no filesystem do container.

## Etapa 07 — Probes: como o cluster sabe que seu app está vivo

Sem probes, um app pode falhar silenciosamente: o processo está de pé, mas travado — e o Kubernetes não tem como saber. As probes são verificações de saúde declaradas no manifesto do Pod.

São três probes, e o mais importante é o que acontece quando cada uma FALHA: a Liveness pergunta "está vivo?" — se falha, o Pod é REINICIADO (pra apps que travam e só voltam com restart). A Readiness pergunta "está pronto pra receber requisições?" — se falha, o Pod SAI DO BALANCEADOR (o Service para de mandar tráfego), sem reiniciar. A Startup pergunta "terminou de inicializar?" — enquanto roda, SEGURA as outras probes (evita que a liveness mate um app lento antes da hora).

Como a probe verifica: httpGet (o kubelet faz um GET num endpoint tipo /health e espera 200 OK — o mais comum), tcpSocket (testa se a porta aceita conexão — pra serviços que não falam HTTP) e exec (executa um comando dentro do container; código de saída 0 = saudável).

Boas práticas da aula: use as três probes juntas em produção; use endpoints diferentes pra cada probe; comece pelas configurações padrão e ajuste intervalos só quando o app pedir; monitore as falhas de probe (ex.: com Prometheus) — elas são o primeiro sinal de problema.

### As 3 probes e o que acontece na falha

- **Liveness** — "Está vivo?" Falhou → o Pod é REINICIADO. Pra apps que travam.
- **Readiness** — "Pronto pra tráfego?" Falhou → SAI do balanceador, sem restart. Pra apps que carregam dados antes.
- **Startup** — "Terminou de subir?" Enquanto roda, segura as outras. Pra apps lentos no boot.

### Pod com as 3 probes + sabotagem didática

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: exemplo-probes
spec:
  containers:
    - name: app
      image: exemplo:latest
      ports:
        - containerPort: 80
      livenessProbe:           # falhou → REINICIA o pod
        httpGet:
          path: /health
          port: 80
        periodSeconds: 10      # verifica a cada 10s
        timeoutSeconds: 5
      readinessProbe:          # falhou → SAI do balanceador
        httpGet:
          path: /ready         # boa prática: endpoint separado
          port: 80
        periodSeconds: 5
      startupProbe:            # segura as outras até o app subir
        httpGet:
          path: /startup
          port: 80
        initialDelaySeconds: 120   # app lento: espera 2min
        periodSeconds: 30
```

```sh
# liveness-exec.yaml: um busybox que cria /tmp/healthy,
# vive 30s "saudável", apaga o arquivo e a probe passa a falhar.
# A probe é: exec → cat /tmp/healthy (arquivo existe = saudável)

$ kubectl apply -f liveness-exec.yaml

# Assista em tempo real (Ctrl+C pra sair):
$ kubectl get pods -w
NAME            READY   STATUS    RESTARTS
liveness-exec   1/1     Running   0
liveness-exec   1/1     Running   1 (5s ago)    ← restart automático!
liveness-exec   1/1     Running   2 (10s ago)   ← e de novo...

# Investigue como um profissional:
$ kubectl describe pod liveness-exec
Events:
  Warning  Unhealthy  Liveness probe failed: cat: /tmp/healthy: No such file
  Normal   Killing    Container liveness failed liveness probe, will be restarted
```

Nota: linha do tempo: 30s saudável → arquivo apagado → 3 falhas seguidas (padrão) → kubelet reinicia. Como o script recomeça, o ciclo repete pra sempre — de propósito, pra você ver.

### Comandos

- `kubectl get pods -w` — assiste mudanças em tempo real
- `kubectl describe pod <nome>` — Events mostram as falhas de probe

**Dica:** Running não significa saudável. Um app pode estar rodando e travado num deadlock. É exatamente por isso que as probes existem.

## Etapa 08 — HPA: escala automática baseada em métricas

Você já sabe escalar na mão (`kubectl scale`). O Horizontal Pod Autoscaler faz isso sozinho: monitora métricas dos Pods (CPU, memória...) e ajusta o número de réplicas entre um mínimo e um máximo que você define.

O funcionamento: o HPA monitora as métricas de utilização dos Pods e compara com o alvo configurado (ex.: manter a média de CPU em 70%). Passou do alvo → cria réplicas (até o máximo). Caiu → remove réplicas (até o mínimo), economizando recurso. O scale down é propositalmente lento (~5min de estabilidade) pra não ficar "pistonando" com variações rápidas.

Métricas suportadas: CPU (a mais comum), memória, métricas personalizadas do seu app (requisições/s, tamanho de fila), métricas externas (ex.: vindas do Prometheus) e E/S de disco. A métrica certa depende do perfil do app: app pesado em CPU escala por CPU; app que devora RAM escala por memória.

Dois pré-requisitos que pegam todo mundo: (1) o cluster precisa do metrics-server pra ler CPU/memória — no Minikube: `minikube addons enable metrics-server`; (2) o container PRECISA declarar resources.requests.cpu, porque "70% de CPU" significa 70% DO QUE O POD PEDIU. Sem requests, o HPA mostra `<unknown>` e não escala.

### O que o HPA entende

- **CPU / Memória** — As métricas clássicas. % calculada sobre o resources.requests do container.
- **Métricas custom** — Do seu app (req/s, fila) ou externas (Prometheus). Pra escalar pelo que importa.
- **min / max** — Você sempre define o piso e o teto de réplicas. O HPA trabalha dentro da faixa.

### Deployment + HPA + teste de carga

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-hpa
spec:
  replicas: 1                  # começa com 1; o HPA assume daqui
  selector:
    matchLabels:
      app: nginx-hpa
  template:
    metadata:
      labels:
        app: nginx-hpa
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
          resources:           # SEM requests o HPA não calcula %
            requests:
              cpu: "100m"      # 100 milicores = 0,1 CPU
            limits:
              cpu: "200m"
```

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
spec:
  scaleTargetRef:              # QUEM o HPA controla
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-hpa
  minReplicas: 1               # piso
  maxReplicas: 10              # teto
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70   # alvo: média de CPU em 70%
```

```sh
# Pré-requisito: metrics-server
$ minikube addons enable metrics-server

$ kubectl apply -f deployment.yaml -f hpa.yaml
# (crie também um Service ClusterIP "nginx-hpa" pro gerador achar o app)

# Gere carga de dentro do cluster:
$ kubectl run gerador --image=busybox -it --rm -- /bin/sh -c \
  "while true; do wget -q -O- http://nginx-hpa; done"

# Em OUTRO terminal, assista:
$ kubectl get hpa -w
NAME        TARGETS         MINPODS  MAXPODS  REPLICAS
nginx-hpa   cpu: 0%/70%     1        10       1
nginx-hpa   cpu: 152%/70%   1        10       1
nginx-hpa   cpu: 152%/70%   1        10       3    ← escalou sozinho!

# Pare a carga (Ctrl+C) e aguarde ~5min: as réplicas encolhem de volta.
```

Nota: em produção, ferramentas como K6 e JMeter fazem esse teste de carga de forma controlada.

### Comandos

- `minikube addons enable metrics-server` — pré-requisito do HPA
- `kubectl get hpa -w` — assiste o HPA reagir à carga
- `kubectl top pods` — CPU/memória por pod
- `kubectl autoscale deployment <n> --cpu-percent=70 --min=1 --max=10` — cria HPA imperativo

**Dica:** `kubectl get hpa` mostrando `<unknown>` nos targets? Ou o metrics-server não está ativo, ou o container não declarou resources.requests. São as duas causas, sempre.

## Plataformas gratuitas de prática

- **Killercoda** (100% grátis) — killercoda.com/kubernetes — Cenários interativos de Kubernetes direto no navegador: terminal com cluster real e roteiro guiado. Sucessor do Katacoda. Bom para: praticar cada etapa deste guia sem instalar nada. Comece por aqui.
- **Play with Kubernetes** (100% grátis) — labs.play-with-k8s.com — Cluster Kubernetes real e temporário (sessões de 4 horas) no navegador, mantido pela Docker. Você monta o cluster na mão com kubeadm. Bom para: testar comandos kubectl livremente e entender a montagem de um cluster.
- **Kube by Example** (100% grátis) — kubebyexample.com — Tutoriais e exemplos curtos mantidos pela Red Hat: um conceito por página, com exemplos direto ao ponto. Bom para: revisar um conceito específico rapidamente.
- **Introduction to Kubernetes (LFS158)** (100% grátis) — training.linuxfoundation.org — Curso oficial gratuito da Linux Foundation, disponível também no edX. Base teórica sólida com certificado de participação. Bom para: consolidar a teoria com o material oficial.
- **Kubernetes the Hard Way** (100% grátis) — github.com/kelseyhightower — O lendário roteiro do Kelsey Hightower: montar um cluster peça por peça, sem instaladores. Bom para: nível avançado, entender o que o Minikube esconde.
- **KodeKloud** (free tier + pago) — kodekloud.com — Labs guiados estilo desafio. Alguns labs gratuitos; catálogo completo e simulados CKA/CKAD pagos. Bom para: troubleshooting realista.
- **iximiuz Labs** (free tier + pago) — labs.iximiuz.com — Playgrounds de containers e Kubernetes no navegador com desafios práticos. Bom para: experimentos mais profundos (rede, imagens, internals).
