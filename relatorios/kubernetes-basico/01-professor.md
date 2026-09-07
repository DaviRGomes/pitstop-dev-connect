# Kubernetes Básico — do zero ao autoscaling, com a mão no teclado

> Versão didática do relatório bruto (`00-bruto.md`), baseado nas aulas 1-8 (Thiago Adriano / FIAP).

**O que você vai saber fazer ao final deste guia:** montar um laboratório Kubernetes na sua máquina, criar e inspecionar Pods, expô-los com Services, configurá-los com ConfigMaps, garantir réplicas e atualizações sem downtime com Deployments, persistir dados com PVCs, declarar verificações de saúde com probes e, por fim, deixar o cluster escalar sozinho com o HPA. Cada etapa depende apenas do que veio antes — e cada uma termina com um exercício mínimo que prova que você entendeu. Não pule os blocos "mão na massa": Kubernetes não se aprende lendo, se aprende quebrando e consertando.

**Como usar este guia:** reserve um terminal aberto do lado do texto. Todos os comandos foram pensados para rodar no Minikube (que você instala na Etapa 01). Quando um exemplo mostra a saída esperada, compare com a sua — divergência é oportunidade de debug, não fracasso.

---

## Etapa 01 — Por que o Kubernetes existe (motivação + setup do laboratório)

### O problema

Pense num e-commerce: ele vive tranquilo o ano inteiro e explode na Black Friday. Comprar servidor para o pico é desperdício em 11 meses; dimensionar para o dia a dia derruba o site no pico. Você precisa de uma infraestrutura que **cresça e encolha sob demanda**.

E tem um segundo problema, mais silencioso: qualquer diferença entre a sua máquina, a do QA e a produção vira o clássico *"na minha máquina funciona"*. Manter vários ambientes idênticos (dev, testes, produção) na mão é uma fonte infinita de bugs.

Todo projeto de software esbarra nesses dois problemas — e o Kubernetes automatiza a solução de ambos.

### O conceito

A peça comum das duas soluções é o **container**.

**Analogia:** uma máquina virtual é como construir uma **casa** completa para cada morador — fundação, encanamento, telhado, tudo próprio. Um container é um **apartamento**: cada morador tem seu espaço isolado, mas a fundação, o encanamento e a estrutura (o *kernel* do sistema operacional) são compartilhados com o prédio inteiro. Resultado: muito mais moradores no mesmo terreno, e mudança muito mais rápida.

Em termos técnicos: a VM carrega um sistema operacional completo (gigabytes, minutos para subir); o container compartilha o kernel do SO hospedeiro e leva só os arquivos, binários e bibliotecas que o app precisa (megabytes, segundos). Uma **imagem de container** é um ambiente inteiro, replicável em qualquer lugar — adeus "na minha máquina funciona".

Só que containers resolvem o problema do ambiente e criam outro: com dezenas ou centenas deles, alguém precisa criá-los, destruí-los, vigiar a saúde e recriar o que falhar. Fazer isso na mão não escala. O **Kubernetes (K8s)** é o **orquestrador** que assume essas tarefas.

A filosofia dele cabe numa analogia: o Kubernetes é um **termostato**. Você não liga e desliga o ar-condicionado a cada mudança de temperatura — você declara "quero 22°C" e o aparelho trabalha sozinho para manter. No K8s você declara o **estado desejado** ("quero 3 cópias disso rodando") e ele mantém a realidade de acordo — inclusive de madrugada, quando um container morre.

**Conceitos-chave desta etapa:**

- **Container ≠ VM** — VM = hardware virtual + SO completo. Container = só o necessário do app, compartilhando o kernel do hospedeiro. Muito mais leve.
- **Escala horizontal** — mais cópias da aplicação dividindo a carga (é o que o K8s automatiza). Vertical = mais CPU/RAM na mesma máquina.
- **Cluster e Pod** — o K8s organiza máquinas (nós) em clusters. Os containers rodam agrupados em **Pods** — a menor unidade gerenciada (detalhes na Etapa 03).
- **kubectl** — a ferramenta de linha de comando que conversa com a API REST do cluster. É o seu controle remoto (detalhes na Etapa 02).
- **Minikube** — um cluster K8s de 1 nó rodando na sua máquina. Feito para estudo — é o laboratório deste guia inteiro.
- **Estado desejado** — a filosofia do K8s: você declara o que quer, ele faz acontecer e mantém. Caiu? Ele recria sozinho.

### Exemplo comentado — montando o laboratório

```sh
# 1. Instale o Docker Desktop (docker.com) — no Linux, use o Docker
#    Engine (docs.docker.com/engine/install) — e confirme:
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

Nota: a primeira execução do `minikube start` baixa a imagem do cluster e demora alguns minutos. É normal.

**Cola de comandos:**

- `minikube start` — sobe o cluster local de 1 nó
- `minikube stop` — para o cluster sem apagar nada
- `kubectl get nodes` — lista os nós e o status
- `kubectl get pods` — lista os pods do namespace atual

**Dica:** se o `minikube start` falhar, a causa mais comum é o Docker Desktop não estar aberto (no Linux, o serviço parado: `sudo systemctl start docker`). Suba o Docker primeiro e tente de novo.

### Mão na massa

O menor exercício possível: prove que seu laboratório está vivo.

1. Rode `minikube start` e aguarde o "Done!".
2. Rode `kubectl get nodes` — **observe**: o nó `minikube` com `STATUS Ready`. Se aparecer `NotReady`, aguarde 1 minuto e repita.
3. Rode `kubectl get pods` — **observe**: `No resources found`. Cluster vazio e pronto é exatamente o ponto de partida da próxima etapa.
4. Bônus: rode `minikube stop` e depois `kubectl get nodes` — veja a mensagem de erro de conexão. Suba de novo com `minikube start`. Agora você sabe o que "cluster fora do ar" parece no terminal.

### Anota aí

> Container é um ambiente leve e replicável; Kubernetes é o termostato que mantém o estado desejado desses containers — você declara, ele garante.

---

## Etapa 02 — kubectl e a API: como você comanda o cluster

### O problema

Seu cluster está de pé (Etapa 01), mas ele é uma caixa fechada. Como você manda ordens para ele? Como cria, consulta e destrói coisas lá dentro? E quando algo der errado (vai dar), como você investiga sem acesso "físico" ao container?

### O conceito

**Tudo** no Kubernetes passa pela API REST do nó master. O `kubectl` é o cliente dessa API: cada comando que você digita vira uma requisição HTTP (GET, POST, PUT, DELETE) contra o cluster.

**Analogia:** pense num restaurante. Você (cliente) não entra na cozinha — você fala com o **garçom** (`kubectl`), que anota o pedido num formato padrão (a requisição HTTP) e leva ao **balcão da cozinha** (o API Server). Toda comunicação passa por esse balcão; ninguém mexe na panela diretamente.

O caminho de um comando: você digita `kubectl get pods` → o kubectl lê o arquivo **kubeconfig** (que guarda o endereço do API Server, as credenciais e o contexto do cluster atual — o Minikube configura isso sozinho) → e dispara um `GET /api/v1/pods` contra o API Server. A resposta volta formatada no seu terminal.

A API é dividida em grupos: o grupo "core" tem os recursos fundamentais (pods, services, replicasets); outros grupos cuidam de segurança, armazenamento, autoscaling. Como é REST puro, dá para chamar de qualquer linguagem — Python, Go, Java, C# — o que abre portas para automação.

Existem **dois jeitos de trabalhar**:

- **Imperativo** — `kubectl run nginx --image=nginx` — você dá a ordem direta. Bom para testes rápidos.
- **Declarativo** — escrever um YAML e rodar `kubectl apply -f arquivo.yaml` — você descreve o estado desejado (lembra do termostato?).

Em projetos reais o declarativo domina, porque o arquivo é versionável no Git. Neste guia começamos imperativo (mais rápido para aprender) e migramos para o declarativo na Etapa 03.

**Os verbos que resolvem 90% do dia:**

- **get** — consultar: lista recursos e o status de cada um. `kubectl get pods`, `get svc`, `get nodes`...
- **create / run / apply** — criar: `run` cria um pod imperativo; `apply -f` aplica um YAML (declarativo).
- **delete** — remover: `kubectl delete pod nginx`. Cuidado — pode afetar quem depende do recurso.
- **describe** — detalhar: mostra configuração + a seção **Events**. É a primeira parada quando algo trava.
- **logs** — ver o que o container está imprimindo. Seu melhor amigo no debug.
- **exec** — abrir um shell dentro do container: `kubectl exec -it <pod> -- /bin/sh`.

### Exemplo comentado — ciclo de vida de um Pod

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

Nota: se o status ficar em `ImagePullBackOff`, o cluster não conseguiu baixar a imagem — confira o nome/tag e sua internet.

**Cola de comandos:**

- `kubectl run nginx --image=nginx:1.14.2 --port=80` — cria um pod imperativo
- `kubectl describe pod <nome>` — detalhes + Events (troubleshooting)
- `kubectl logs <nome>` — saída do container
- `kubectl exec -it <nome> -- /bin/sh` — shell dentro do container
- `kubectl delete pod <nome>` — remove o pod

### Mão na massa

Execute o ciclo completo e force o primeiro erro da sua vida no K8s:

1. Rode a sequência do exemplo acima (`run` → `get` → `describe` → `logs` → `delete`). **Observe** no `describe` a seção `Events`: as linhas `Pulling image`, `Created container`, `Started container` contam a história do pod em ordem.
2. Agora crie um pod quebrado de propósito: `kubectl run quebrado --image=nginx:versao-que-nao-existe`.
3. Rode `kubectl get pods` — **observe** o status `ImagePullBackOff` (ou `ErrImagePull`).
4. Rode `kubectl describe pod quebrado` — **observe** nos Events a mensagem explicando que a imagem não foi encontrada. Você acabou de praticar o fluxo de debug de verdade.
5. Limpe: `kubectl delete pod quebrado`.

**Dica (grave este fluxo):** `get pods` (qual o status?) → `describe pod` (o que dizem os Events?) → `logs` (o que o app diz?). Essa sequência resolve a maioria dos problemas.

### Anota aí

> Tudo no K8s é uma chamada à API REST; o kubectl é seu garçom — e quando algo trava, o caminho é sempre get → describe → logs.

---

## Etapa 03 — A anatomia do cluster e a menor unidade dele: o Pod

### O problema

Na Etapa 02 você criou um pod com um comando imperativo. Funciona, mas tem dois furos: (1) você não sabe **o que** exatamente foi criado nem **onde** dentro do cluster; (2) se amanhã precisar recriar aquele pod idêntico em outro ambiente, vai depender da memória. Precisamos entender as peças do cluster e passar a descrever tudo em arquivos versionáveis.

### O conceito

Um **cluster** é um grupo de máquinas (**nodes**) trabalhando juntas, com papéis bem definidos:

- **Master node** — o cérebro: gerencia o cluster e decide onde executar os Pods.
- **Worker node** — os braços: executam os Pods e demais recursos.
- **etcd** — banco de dados distribuído com a configuração e o estado do cluster.
- **kubelet** — agente em cada node que gerencia os Pods locais.
- **kube-proxy** — encaminha o tráfego de rede para os Pods certos.
- **API Server** — a porta de entrada — tudo que o kubectl faz passa por aqui (você já conheceu na Etapa 02).

O **Pod** é a menor unidade que o Kubernetes gerencia: um "envelope" com um ou mais containers que dividem rede e armazenamento. Quatro fatos sobre Pods:

1. Um Pod representa um processo em execução e pode ter mais de um container dividindo o mesmo IP e volumes.
2. **Pods são efêmeros** — nascem e morrem o tempo todo. Nunca conte com um Pod específico existir amanhã. (Guarde esta frase: ela é a raiz das Etapas 04, 05 e 06.)
3. Cada Pod ganha um IP interno do cluster.
4. Pods são descritos em YAML.

Para organizar dezenas de Pods existem os rótulos e as anotações. **Analogia da mudança:** labels são as **etiquetas nas caixas** ("cozinha", "frágil") que o carregador usa para decidir o que vai para onde — servem para **identificar e selecionar**. Annotations são o **bilhete colado** na caixa ("presente da vó, cuidado") — informação para humanos, que ninguém usa para separar nada.

- **Labels** — pares chave-valor usados para IDENTIFICAR E SELECIONAR objetos. É por label que um Service acha seus Pods (você verá isso acontecer na Etapa 04).
- **Annotations** — metadados livres (autor, documentação, auditoria) que NÃO participam de seleção.

Essa diferença é o que cai em prova.

### Exemplo comentado — o primeiro YAML (decore este esqueleto)

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

Nota: **todo** objeto K8s segue esse esqueleto: `apiVersion` + `kind` + `metadata` + `spec`. Muda o `kind` e o conteúdo do `spec` — o resto é sempre igual. Quem domina esse esqueleto lê qualquer manifesto.

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

Nota: esse filtro `-l` parece bobo agora, mas Services, ReplicaSets e Deployments encontram "seus" Pods **exatamente assim**: por label selector. É o fio que costura as próximas etapas.

**Cola de comandos:**

- `kubectl apply -f arquivo.yaml` — cria/atualiza pelo YAML
- `kubectl get pods --show-labels` — lista exibindo rótulos
- `kubectl get pods -l app=myapp` — filtra por rótulo
- `kubectl delete -f arquivo.yaml` — remove o que o arquivo criou

### Mão na massa

1. Salve o YAML acima como `meu-pod.yaml` e aplique com `kubectl apply -f meu-pod.yaml`.
2. Rode `kubectl get pods --show-labels` — **observe** os dois labels na última coluna.
3. Rode `kubectl get pods -l app=myapp` e depois `kubectl get pods -l app=outra-coisa` — **observe**: o primeiro encontra o pod, o segundo retorna vazio. Esse é o mecanismo de seleção em ação.
4. Adicione um label em tempo real: `kubectl label pod meu-pod time=devops` e confirme com `--show-labels`.
5. **Não delete o pod** — ele será o alvo do Service na próxima etapa. (Se deletou, é só aplicar o YAML de novo — essa é a graça do declarativo.)

**Dica:** Labels = seleção operacional (o K8s usa). Annotations = documentação (humanos usam). Autor de um Pod? Annotation. Agrupar Pods de uma app? Label.

### Anota aí

> Todo objeto K8s é apiVersion + kind + metadata + spec; e labels são o mecanismo pelo qual tudo no cluster encontra tudo.

---

## Etapa 04 — Services e ConfigMaps: endereço fixo e configuração externa

### O problema

Lembra do fato nº 2 da Etapa 03? **Pods são efêmeros.** Cada Pod novo nasce com um IP diferente. Agora imagine seu frontend tentando falar com a API: hoje ela está no IP 10.244.0.5, amanhã o Pod morre e renasce no 10.244.0.9. Como alguém fala com Pods de forma confiável se o endereço muda o tempo todo?

E tem um segundo problema: serviços precisam de configuração (portas, URLs, flags). Se você colocar isso **dentro da imagem** do container, cada mudança de configuração obriga a rebuildar e republicar a imagem. Deploy na sexta-feira para mudar uma URL? Não.

### O conceito

**Problema 1 → Service.** O Service é um ponto de entrada estável que encontra os Pods por label e balanceia o tráfego entre eles.

**Analogia:** o Service é o **telefone fixo da pizzaria**. Você liga sempre no mesmo número; qual entregador (Pod) vai trazer sua pizza muda a cada pedido — e você nem precisa saber.

O fluxo: uma requisição chega no Service (que tem IP e nome fixos) → o Service seleciona os Pods pelo **label selector** (o mecanismo da Etapa 03!) → e distribui o tráfego de forma balanceada entre as réplicas saudáveis. O nome do Service vira um **hostname interno** do cluster: se o Service chama `auth-service`, qualquer Pod acessa `http://auth-service` — mesmo que os Pods por trás troquem de IP mil vezes.

**Os 3 tipos de Service:**

- **ClusterIP (padrão)** — IP interno, acessível só dentro do cluster. Use para comunicação entre serviços (ex.: API ↔ banco).
- **NodePort** — abre uma porta fixa (30000–32767) no nó. Acessível de fora via `IP-do-nó:porta` — o jeito de expor algo no Minikube.
- **LoadBalancer** — provisiona um balanceador externo com IP público. É o tipo de produção na nuvem (AWS, GCP, Azure).

**Problema 2 → ConfigMap.** O ConfigMap separa a configuração do container: você guarda os valores num objeto central e injeta de 3 formas: **variáveis de ambiente** (a mais comum, via `envFrom`), **arquivos montados** (ótimo para configs longas) ou **argumentos de linha de comando**. Mudou a config? Atualiza o ConfigMap — a imagem continua a mesma.

### Exemplo comentado — repare no selector

```yaml
# app.yaml — salve o Service neste arquivo
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

Nota: o `selector` do Service casa com o label do Pod (`app: myapp`) — exatamente o pod `meu-pod` que você criou na Etapa 03. É assim que ele sabe para quem mandar o tráfego.

```yaml
# configmap-pod.yaml — os dois objetos no mesmo arquivo, separados por ---
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

**Cola de comandos:**

- `kubectl get svc` — lista os Services
- `minikube service <nome> --url` — URL de acesso a um NodePort
- `kubectl get configmap` — lista os ConfigMaps
- `kubectl exec <pod> -- env` — confere variáveis injetadas

### Mão na massa

1. Com o `meu-pod` da Etapa 03 rodando (label `app: myapp`), salve o YAML do Service como `app.yaml` e aplique.
2. Rode `minikube service meu-service --url` e abra a URL no navegador — **observe** a página de boas-vindas do nginx. Você acabou de acessar um Pod efêmero por um endereço estável.
3. Teste o elo: delete o pod (`kubectl delete pod meu-pod`) e recarregue o navegador — **observe** o erro (não há mais Pods com o label). Recrie com `kubectl apply -f meu-pod.yaml` e recarregue — voltou, sem tocar no Service.
4. Aplique o ConfigMap + pod (`kubectl apply -f configmap-pod.yaml`) e rode `kubectl exec pod-config -- env` — **observe** `MENSAGEM` e `MODO` na lista de variáveis.

**Dica (regra de ouro):** exponha o mínimo. Banco de dados = ClusterIP (invisível de fora). Só a porta de entrada do sistema vira NodePort/LoadBalancer. Para senhas e chaves, o irmão seguro do ConfigMap é o **Secret**.

### Anota aí

> Service dá endereço fixo a Pods que mudam (achando-os por label); ConfigMap tira a configuração de dentro da imagem.

---

## Etapa 05 — Auto-cura e escala: ReplicaSets e Deployments

### O problema

Até aqui você criou Pods na mão — ótimo para aprender, mas pense na madrugada de sábado: seu único Pod morre (falha de hardware, bug, falta de memória) e o site fica fora do ar até alguém acordar. E mais: quando você lançar a versão 2.0 do app, como trocar a versão **sem derrubar o serviço**? E se a 2.0 vier com um bug catastrófico, como voltar rápido? Deploy que quebrou na sexta às 18h não pode depender de heroísmo.

### O conceito

Duas peças resolvem isso, uma embrulhando a outra:

**ReplicaSet — o vigia do número.** Você declara `replicas: 3` e ele monitora os Pods pelo label selector (de novo ele!). Caiu um? Ele detecta que a contagem baixou e cria outro em segundos, sem você pedir. **Analogia:** é o repositor de supermercado com a regra "esta prateleira sempre tem 3 caixas de leite" — sumiu uma, ele repõe, sem perguntar quem levou. É a auto-cura do Kubernetes em ação — o "estado desejado" da Etapa 01 mantido de verdade.

**Deployment — o gestor de versões.** Ele embrulha o ReplicaSet e adiciona:

- **Rolling Update** — ao trocar a imagem, sobe réplicas novas e desliga as antigas **gradualmente** — o serviço nunca fica fora do ar. Analogia: trocar as lâmpadas de um corredor uma a uma, para nunca ficar no escuro.
- **Rollback** — a versão nova quebrou? `kubectl rollout undo` volta para a anterior em segundos.
- **Escala manual** — `kubectl scale --replicas=5` e pronto.

Os YAMLs de ReplicaSet e Deployment são quase idênticos, mas no dia a dia usamos **quase sempre o Deployment**, justamente pelo controle de versão. O Deployment cria e gerencia o ReplicaSet por baixo dos panos.

### Exemplo comentado — o Deployment completo + ciclo de vida

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

Repare: o `template` é literalmente o esqueleto de Pod da Etapa 03, embutido dentro do Deployment. Nada aqui é novo — é composição.

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

Nota: repare que o K8s **só desliga os Pods antigos quando os novos ficam prontos**. Como a imagem quebrada nunca fica pronta, os antigos seguram o serviço no ar. Um deploy quebrado não derruba o que já funcionava.

**Cola de comandos:**

- `kubectl scale deployment <nome> --replicas=5` — escala manual
- `kubectl set image deployment/<nome> ctn=img:tag` — dispara rolling update
- `kubectl rollout status deployment/<nome>` — acompanha a troca
- `kubectl rollout history deployment/<nome>` — lista revisões
- `kubectl rollout undo deployment/<nome>` — rollback!

### Mão na massa

Este é O exercício do guia — o momento em que o Kubernetes "clica" na cabeça:

1. Aplique o `deployment.yaml` e confirme os 3 pods `Running`.
2. Delete um pod na mão (copie um nome real do `kubectl get pods`) e rode `kubectl get pods` de novo, rápido — **observe** o substituto em `ContainerCreating`. Você tentou violar o estado desejado e o cluster corrigiu.
3. Rode o rolling update para `nginx:1.16.1` e acompanhe com `kubectl rollout status` — **observe** a mensagem de sucesso.
4. Quebre de propósito com a imagem `nginx:nao-existe` — **observe** no `kubectl get pods` os pods antigos `Running` segurando o serviço e os novos em `ImagePullBackOff`.
5. Execute `kubectl rollout undo deployment/nginx-fiap` e confirme com `kubectl rollout history` — **observe** as revisões listadas. Você acabou de fazer um rollback de produção em um comando.

### Anota aí

> Ninguém cria Pod avulso em produção: o Deployment garante N réplicas (auto-cura), troca versões sem downtime e volta atrás em um comando.

---

## Etapa 06 — Volumes: dados que sobrevivem ao Pod

### O problema

Você já sabe: Pods são efêmeros — e a Etapa 05 deixou isso ainda mais radical, com pods morrendo e nascendo em rolling updates. Ótimo para o app... e catastrófico para um banco de dados. Imagine o Pod do PostgreSQL do seu e-commerce ser recriado num update e **todos os pedidos da Black Friday sumirem junto**. Dados de verdade não podem viver no filesystem de um container.

### O conceito

O Kubernetes resolve isso com uma cadeia de 4 conceitos: **Volume**, **PersistentVolume (PV)**, **PersistentVolumeClaim (PVC)** e **StorageClass (SC)**.

**Memorize pela analogia do restaurante de discos:**

- o **PVC é o PEDIDO** — "quero 1Gi, leitura e escrita por um nó";
- o **PV é o DISCO real** que atende o pedido — NFS, EBS da AWS, hostPath...;
- a **StorageClass é o CARDÁPIO** de tipos de disco — padrão? SSD rápido?

O Pod só referencia o PVC — ele não precisa saber onde o disco fica fisicamente. Essa separação é o que permite o mesmo YAML rodar no Minikube e na AWS.

**Tipos de volume mais comuns:**

- **emptyDir** — nasce vazio com o Pod e **MORRE com o Pod**. Serve para arquivos temporários e para compartilhar dados entre containers do mesmo Pod.
- **hostPath** — monta um diretório do nó dentro do container. Útil em dev, perigoso em produção (amarra o Pod ao nó).
- **persistentVolumeClaim** — o jeito certo para dados de verdade: sobrevivem a reinício e recriação do Pod.

**Modos de acesso do PVC** (quem pode montar o volume):

- **ReadWriteOnce (RWO)** — leitura e escrita por UM nó — o caso típico de banco de dados.
- **ReadOnlyMany (ROX)** — só leitura, vários nós — assets estáticos.
- **ReadWriteMany (RWX)** — leitura e escrita por vários nós — precisa de NFS ou similar.

No Minikube, a StorageClass `standard` já provisiona PVs automaticamente — você faz o pedido (PVC) e o disco (PV) aparece.

### Exemplo comentado — prove a persistência: escreva, destrua, leia de volta

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

**Cola de comandos:**

- `kubectl get pvc` — pedidos de volume (Bound = ok)
- `kubectl get pv` — discos persistentes do cluster
- `kubectl delete pvc <nome>` — remove o pedido (e libera o disco)

### Mão na massa

1. Aplique o PVC e rode `kubectl get pvc` — **observe** o `STATUS Bound`: seu pedido foi atendido por um PV criado automaticamente (confirme com `kubectl get pv`).
2. Execute a sequência completa do exemplo: escrever o arquivo → deletar o pod → recriar o pod → ler o arquivo. **Observe** o `sobrevivi!` voltar. Esse é o contrato do PVC.
3. Experimento extra (o contraste que ensina): repita o teste trocando o volume por `emptyDir` — ao recriar o Pod, o arquivo terá sumido. Essa é exatamente a diferença entre efêmero e persistente, sentida na prática.

**Dica:** dado importante SEMPRE em PVC. Se os dados sumiram após um restart, aposto que estavam em `emptyDir` ou no filesystem do container.

### Anota aí

> PVC é o pedido, PV é o disco, StorageClass é o cardápio — e dado que importa mora sempre atrás de um PVC.

---

## Etapa 07 — Probes: como o cluster sabe que seu app está vivo

### O problema

Cenário real: seu app entra em deadlock às 3h da manhã. O **processo continua de pé** — então para o Kubernetes está tudo `Running` — mas nenhuma requisição é respondida. Sem informação extra, o cluster não tem como saber que "rodando" não é "funcionando". A auto-cura da Etapa 05 só recria pods que **morrem**; ela não enxerga pods **vivos porém travados**.

### O conceito

As **probes** são verificações de saúde declaradas no manifesto do Pod. **Analogia:** é o médico da UTI checando sinais vitais em intervalos regulares — não basta o paciente estar na cama (processo de pé), é preciso responder aos estímulos.

São três probes, e o mais importante é o que acontece quando cada uma **FALHA**:

- **Liveness** — pergunta "está vivo?". Falhou → o Pod é **REINICIADO**. Para apps que travam e só voltam com restart.
- **Readiness** — pergunta "está pronto para receber requisições?". Falhou → o Pod **SAI DO BALANCEADOR** (o Service para de mandar tráfego), **sem reiniciar**. Para apps que carregam dados antes de atender.
- **Startup** — pergunta "terminou de inicializar?". Enquanto roda, **SEGURA as outras probes** — evita que a liveness mate um app lento antes da hora.

**Como a probe verifica** (3 mecanismos):

- **httpGet** — o kubelet faz um GET num endpoint tipo `/health` e espera 200 OK. O mais comum.
- **tcpSocket** — testa se a porta aceita conexão. Para serviços que não falam HTTP.
- **exec** — executa um comando dentro do container; código de saída 0 = saudável.

**Boas práticas da aula:** use as três probes juntas em produção; use endpoints diferentes para cada probe; comece pelas configurações padrão e ajuste intervalos só quando o app pedir; monitore as falhas de probe (ex.: com Prometheus) — elas são o primeiro sinal de problema.

### Exemplo comentado — Pod com as 3 probes

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
        failureThreshold: 3    # 3 falhas seguidas → reinicia (3 é o padrão)
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

(Este YAML é ilustrativo — a imagem `exemplo:latest` é fictícia. O experimento executável vem a seguir.)

### Exemplo comentado — sabotagem didática (executável)

A ideia: um busybox que cria o arquivo `/tmp/healthy`, vive 30s "saudável", apaga o arquivo — e a partir daí a liveness probe (`cat /tmp/healthy`) passa a falhar. Arquivo existe = saudável; arquivo sumiu = doente.

```yaml
# liveness-exec.yaml
apiVersion: v1
kind: Pod
metadata:
  name: liveness-exec
spec:
  containers:
    - name: liveness
      image: busybox
      args:                         # o "roteiro da sabotagem":
        - /bin/sh
        - -c
        - touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600
      livenessProbe:
        exec:
          command:                  # probe: arquivo existe? (exit 0 = saudável)
            - cat
            - /tmp/healthy
        initialDelaySeconds: 5     # espera 5s antes da 1ª verificação
        periodSeconds: 5           # verifica a cada 5s
```

```sh
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

Nota — linha do tempo do experimento: 30s saudável → arquivo apagado → 3 falhas seguidas (o padrão do `failureThreshold`) → kubelet reinicia. Como o script recomeça do zero após o restart, o ciclo repete para sempre — de propósito, para você ver.

**Cola de comandos:**

- `kubectl get pods -w` — assiste mudanças em tempo real
- `kubectl describe pod <nome>` — Events mostram as falhas de probe

### Mão na massa

1. Aplique o `liveness-exec.yaml` e rode `kubectl get pods -w` — **observe** a coluna `RESTARTS` subir sozinha a cada ~35-45s. Cada incremento é o kubelet "matando o paciente que parou de responder".
2. Em outro terminal, rode `kubectl describe pod liveness-exec` — **observe** nos Events o par `Warning Unhealthy` + `Normal Killing`. Aprenda a reconhecer essa dupla: em produção, ela é o diagnóstico de probe falhando.
3. Limpe: `kubectl delete pod liveness-exec`.

**Dica:** `Running` **não** significa saudável. Um app pode estar rodando e travado num deadlock. É exatamente por isso que as probes existem.

### Anota aí

> Liveness falhou = reinicia; Readiness falhou = sai do balanceador sem reiniciar; Startup segura as duas até o app terminar de subir.

---

## Etapa 08 — HPA: escala automática baseada em métricas

### O problema

Volte ao e-commerce da Etapa 01: chegou a Black Friday. Você já sabe escalar na mão (`kubectl scale --replicas=...`, Etapa 05) — mas vai ficar de plantão no terminal ajustando réplicas a cada pico de acesso? Às 2h da manhã também? O ciclo precisa se fechar: o cluster deve **medir a carga e escalar sozinho**.

### O conceito

O **Horizontal Pod Autoscaler (HPA)** monitora métricas dos Pods (CPU, memória...) e ajusta o número de réplicas entre um mínimo e um máximo que você define.

**Analogia:** é o gerente do supermercado olhando as filas dos caixas. Fila cresceu além do aceitável → abre mais caixas (até o limite de caixas que existem). Fila esvaziou → fecha caixas gradualmente — sem fechar tudo de uma vez só porque a fila deu uma respirada.

O funcionamento: o HPA compara a utilização dos Pods com o **alvo** configurado (ex.: manter a média de CPU em 70%). Passou do alvo → cria réplicas (até o máximo). Caiu → remove réplicas (até o mínimo), economizando recurso. O **scale down é propositalmente lento** (~5min de estabilidade) para não ficar "pistonando" com variações rápidas.

**Métricas suportadas:** CPU (a mais comum), memória, métricas personalizadas do seu app (requisições/s, tamanho de fila), métricas externas (ex.: vindas do Prometheus) e E/S de disco. A métrica certa depende do perfil do app: app pesado em CPU escala por CPU; app que devora RAM escala por memória.

**Dois pré-requisitos que pegam todo mundo:**

1. O cluster precisa do **metrics-server** para ler CPU/memória — no Minikube: `minikube addons enable metrics-server`.
2. O container **PRECISA declarar `resources.requests.cpu`**, porque "70% de CPU" significa 70% **do que o Pod pediu**. Sem requests, o HPA mostra `<unknown>` e não escala.

**O que o HPA entende:**

- **CPU / Memória** — as métricas clássicas. % calculada sobre o `resources.requests` do container.
- **Métricas custom** — do seu app (req/s, fila) ou externas (Prometheus). Para escalar pelo que importa.
- **min / max** — você sempre define o piso e o teto de réplicas. O HPA trabalha dentro da faixa.

### Exemplo comentado — Deployment + HPA + teste de carga

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

Para o gerador de carga achar o app pelo nome, crie também um Service ClusterIP chamado `nginx-hpa` — é o mesmo padrão da Etapa 04:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-hpa              # hostname interno usado pelo gerador
spec:
  type: ClusterIP              # só tráfego interno — regra de ouro da Etapa 04
  selector:
    app: nginx-hpa             # casa com o label dos pods do Deployment
  ports:
    - port: 80
      targetPort: 80
```

```sh
# Pré-requisito: metrics-server
$ minikube addons enable metrics-server

$ kubectl apply -f deployment.yaml -f hpa.yaml
# (aplique também o service.yaml acima, pro gerador achar o app)

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

**Plano B (se o TARGETS não passar de 70%):** o nginx servindo página estática é eficiente demais — um único gerador pode não gerar carga suficiente. Três saídas, da mais simples à mais fiel ao tutorial oficial:

1. Rode 2–3 geradores em paralelo: repita o `kubectl run` em outros terminais trocando o nome (`gerador2`, `gerador3`).
2. Reduza `requests.cpu` para `"50m"` no Deployment e reaplique — o mesmo consumo passa a valer o dobro em %.
3. Troque a imagem por `registry.k8s.io/hpa-example` (o php-apache do tutorial oficial do K8s, que queima CPU a cada requisição — feito exatamente pra essa demo).

**Cola de comandos:**

- `minikube addons enable metrics-server` — pré-requisito do HPA
- `kubectl get hpa -w` — assiste o HPA reagir à carga
- `kubectl top pods` — CPU/memória por pod
- `kubectl autoscale deployment <n> --cpu-percent=70 --min=1 --max=10` — cria HPA imperativo

### Mão na massa

O experimento final, que junta tudo:

1. Ative o metrics-server e aplique os três YAMLs (Deployment, HPA, Service). Rode `kubectl get hpa` — **observe** os targets: se aparecer `<unknown>`, aguarde ~1min (o metrics-server precisa coletar a primeira leitura).
2. Suba o gerador de carga num terminal e `kubectl get hpa -w` em outro — **observe** o percentual de CPU disparar acima de 70% e, em seguida, a coluna `REPLICAS` subir. Se o percentual estacionar abaixo do alvo, use o plano B acima. Confirme com `kubectl get pods`: pods novos nasceram sem nenhum comando seu.
3. Pare a carga (Ctrl+C) e continue assistindo — **observe** que as réplicas demoram ~5min para encolher. Essa lentidão é proposital (estabilidade contra "pistonagem").
4. Use `kubectl top pods` durante o teste para ver a métrica crua que alimenta o HPA.

**Dica:** `kubectl get hpa` mostrando `<unknown>` nos targets? Ou o metrics-server não está ativo, ou o container não declarou `resources.requests`. São as duas causas, sempre.

### Anota aí

> HPA = estado desejado aplicado à escala: você define alvo, piso e teto — mas sem metrics-server e sem resources.requests ele não enxerga nada.

---

## Plataformas gratuitas de prática

Ordem sugerida: comece pelo Killercoda (zero instalação), use o Kube by Example como consulta rápida, e deixe o Hard Way para quando as 8 etapas estiverem sólidas.

- **Killercoda** (100% grátis) — killercoda.com/kubernetes — Cenários interativos de Kubernetes direto no navegador: terminal com cluster real e roteiro guiado. Sucessor do Katacoda. Bom para: praticar cada etapa deste guia sem instalar nada. **Comece por aqui.**
- **Play with Kubernetes** (100% grátis) — labs.play-with-k8s.com — Cluster Kubernetes real e temporário (sessões de 4 horas) no navegador, mantido pela Docker. Você monta o cluster na mão com kubeadm. Bom para: testar comandos kubectl livremente e entender a montagem de um cluster.
- **Kube by Example** (100% grátis) — kubebyexample.com — Tutoriais e exemplos curtos mantidos pela Red Hat: um conceito por página, com exemplos direto ao ponto. Bom para: revisar um conceito específico rapidamente.
- **Introduction to Kubernetes (LFS158)** (100% grátis) — training.linuxfoundation.org — Curso oficial gratuito da Linux Foundation, disponível também no edX. Base teórica sólida com certificado de participação. Bom para: consolidar a teoria com o material oficial.
- **Kubernetes the Hard Way** (100% grátis) — github.com/kelseyhightower — O lendário roteiro do Kelsey Hightower: montar um cluster peça por peça, sem instaladores. Bom para: nível avançado, entender o que o Minikube esconde.
- **KodeKloud** (free tier + pago) — kodekloud.com — Labs guiados estilo desafio. Alguns labs gratuitos; catálogo completo e simulados CKA/CKAD pagos. Bom para: troubleshooting realista.
- **iximiuz Labs** (free tier + pago) — labs.iximiuz.com — Playgrounds de containers e Kubernetes no navegador com desafios práticos. Bom para: experimentos mais profundos (rede, imagens, internals).

---

## Checklist de autoavaliação

Marque cada item apenas se você **fez**, não se você "entendeu lendo". Se algum ficar em branco, volte à etapa correspondente e refaça o mão na massa.

**Etapa 01 — Motivação e setup**
- [ ] Sei explicar, com minhas palavras, a diferença entre container e VM (e por que container é mais leve).
- [ ] Subi o Minikube e vi o nó `Ready` no `kubectl get nodes`.
- [ ] Sei o que significa "estado desejado" e consigo dar um exemplo.

**Etapa 02 — kubectl e API**
- [ ] Criei um pod imperativo com `kubectl run` e o vi chegar a `Running`.
- [ ] Provoquei um `ImagePullBackOff` de propósito e encontrei a causa nos Events do `describe`.
- [ ] Sei recitar o fluxo de debug: get → describe → logs.

**Etapa 03 — Cluster, Pods e labels**
- [ ] Sei citar o papel de master, worker, etcd, kubelet, kube-proxy e API Server.
- [ ] Escrevi um YAML de Pod do zero seguindo o esqueleto apiVersion + kind + metadata + spec.
- [ ] Filtrei pods com `-l` e sei explicar quando usar label e quando usar annotation.

**Etapa 04 — Services e ConfigMap**
- [ ] Expus um pod via NodePort e abri a página no navegador com `minikube service --url`.
- [ ] Sei dizer qual tipo de Service usar para: banco interno, teste no Minikube e produção na nuvem.
- [ ] Injetei um ConfigMap como variáveis de ambiente e confirmei com `kubectl exec -- env`.

**Etapa 05 — ReplicaSets e Deployments**
- [ ] Deletei um pod de um Deployment e vi o substituto nascer sozinho (auto-cura).
- [ ] Fiz um rolling update, quebrei um deploy de propósito e voltei com `rollout undo`.
- [ ] Sei explicar por que os pods antigos seguram o serviço quando a imagem nova falha.

**Etapa 06 — Volumes**
- [ ] Sei explicar a cadeia PVC (pedido) → PV (disco) → StorageClass (cardápio).
- [ ] Escrevi um arquivo num PVC, destruí o pod, recriei e li o arquivo de volta.
- [ ] Sei dizer quando usar emptyDir, hostPath e persistentVolumeClaim.

**Etapa 07 — Probes**
- [ ] Sei dizer o que acontece quando cada probe falha (liveness / readiness / startup).
- [ ] Rodei o experimento liveness-exec e vi a coluna RESTARTS subir sozinha.
- [ ] Sei explicar por que `Running` não significa saudável.

**Etapa 08 — HPA**
- [ ] Sei citar os dois pré-requisitos do HPA (metrics-server + resources.requests).
- [ ] Gerei carga e vi o HPA aumentar as réplicas sem nenhum comando meu.
- [ ] Sei explicar por que o scale down demora ~5 minutos.

---

## Notas do professor

Nenhum erro técnico evidente foi encontrado no relatório bruto. Registro aqui os complementos que adicionei para tornar tudo executável (conteúdo padrão da documentação oficial do Kubernetes, não invenção):

1. **Etapa 07:** o relatório bruto referenciava o `liveness-exec.yaml` apenas em comentários (descrevendo o comportamento do busybox). Incluí o manifesto completo — é o exemplo clássico da documentação oficial do Kubernetes (`touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600` com probe `exec: cat /tmp/healthy`) — para que o leitor consiga executar o experimento sem sair do guia.
2. **Etapa 08:** o relatório pedia "crie também um Service ClusterIP nginx-hpa" sem mostrar o YAML. Incluí o manifesto do Service (ClusterIP, selector `app: nginx-hpa`, porta 80), reutilizando exatamente o padrão já ensinado na Etapa 04.
3. **Terminologia (nota, não correção):** o material usa "Master node", termo das aulas de origem. A documentação atual do Kubernetes prefere **control plane** (é inclusive o que aparece na coluna ROLES do `kubectl get nodes` na Etapa 01). Os dois nomes referem-se à mesma coisa.
