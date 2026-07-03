// Conteúdo real das 8 etapas, baseado nas aulas 1-8 (Thiago Adriano / FIAP)

export type Example = {
  label: string
  lang: 'yaml' | 'sh'
  code: string
  note?: string
}

export type Command = { cmd: string; note?: string }

export type Point = { t: string; d: string; color?: string }

export type Lesson = {
  id: string
  num: string
  navTitle: string
  tag: string
  title: string
  lead: string
  concept: string[]
  points: Point[]
  pointsTitle: string
  examples: Example[]
  examplesTitle: string
  commands: Command[]
  tip: string
}

export const LESSONS: Lesson[] = [
  {
    id: 'm1',
    num: '01',
    navTitle: 'Por que K8s existe',
    tag: 'motivação + setup',
    title: 'Por que o Kubernetes existe',
    lead: 'Todo projeto de software esbarra em dois problemas: manter vários ambientes iguais (dev, testes, produção) e escalar quando a demanda muda. O Kubernetes automatiza a solução dos dois.',
    concept: [
      'Pense num e-commerce: ele vive tranquilo o ano inteiro e explode na Black Friday. Comprar servidor pro pico é desperdício em 11 meses; dimensionar pro dia a dia derruba o site no pico. Você precisa crescer e encolher sob demanda. Ao mesmo tempo, qualquer diferença entre a sua máquina, a do QA e a produção vira o clássico "na minha máquina funciona".',
      'A peça comum das duas soluções é o container. Ele parece uma máquina virtual, mas não é: a VM carrega um sistema operacional completo (gigabytes, minutos pra subir); o container compartilha o kernel do SO hospedeiro e leva só os arquivos, binários e bibliotecas que o app precisa (megabytes, segundos). Uma imagem de container é um ambiente inteiro, replicável em qualquer lugar.',
      'Só que com dezenas ou centenas de containers, alguém precisa criá-los, destruí-los, vigiar a saúde e recriar o que falhar — fazer isso na mão não escala. O Kubernetes (K8s) é o orquestrador que assume essas tarefas: você declara o estado desejado ("quero 3 cópias disso rodando") e ele mantém a realidade de acordo, inclusive de madrugada quando um container morre.',
    ],
    pointsTitle: 'Os conceitos-chave desta etapa',
    points: [
      { t: 'Container ≠ VM', d: 'VM = hardware virtual + SO completo. Container = só o necessário do app, compartilhando o kernel do hospedeiro. Muito mais leve.', color: 'ember' },
      { t: 'Escala horizontal', d: 'Mais cópias da aplicação dividindo a carga (é o que o K8s automatiza). Vertical = mais CPU/RAM na mesma máquina.', color: 'signal' },
      { t: 'Cluster e Pod', d: 'O K8s organiza máquinas (nós) em clusters. Os containers rodam agrupados em Pods — a menor unidade gerenciada.', color: 'blue' },
      { t: 'kubectl', d: 'A ferramenta de linha de comando que conversa com a API REST do cluster. É o seu controle remoto.', color: 'blue' },
      { t: 'Minikube', d: 'Um cluster K8s de 1 nó rodando na sua máquina. Feito pra estudo — é o laboratório deste guia.', color: 'signal' },
      { t: 'Estado desejado', d: 'A filosofia do K8s: você declara o que quer, ele faz acontecer e mantém. Caiu? Ele recria sozinho.', color: 'violet' },
    ],
    examplesTitle: 'Montando o laboratório (passo a passo)',
    examples: [
      {
        label: 'setup do ambiente',
        lang: 'sh',
        code: `# 1. Instale o Docker Desktop (docker.com) e confirme:
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
No resources found in default namespace.`,
        note: 'A primeira execução do minikube start baixa a imagem do cluster e demora alguns minutos.',
      },
    ],
    commands: [
      { cmd: 'minikube start', note: 'sobe o cluster local de 1 nó' },
      { cmd: 'minikube stop', note: 'para o cluster sem apagar nada' },
      { cmd: 'kubectl get nodes', note: 'lista os nós e o status' },
      { cmd: 'kubectl get pods', note: 'lista os pods do namespace atual' },
    ],
    tip: 'Se o minikube start falhar, a causa mais comum é o Docker Desktop não estar aberto. Suba o Docker primeiro e tente de novo.',
  },

  {
    id: 'm2',
    num: '02',
    navTitle: 'kubectl & API',
    tag: 'o controle remoto',
    title: 'kubectl e a API: como você comanda o cluster',
    lead: 'Tudo no Kubernetes passa pela API REST do nó master. O kubectl é o cliente dessa API: cada comando que você digita vira uma requisição HTTP (GET, POST, PUT, DELETE) contra o cluster.',
    concept: [
      'O caminho de um comando: você digita kubectl get pods → o kubectl lê o arquivo kubeconfig (que guarda o endereço do API Server, as credenciais e o contexto do cluster atual — o Minikube configura isso sozinho) → e dispara um GET /api/v1/pods contra o API Server. A resposta volta formatada no seu terminal.',
      'A API é dividida em grupos: o grupo "core" tem os recursos fundamentais (pods, services, replicasets); outros grupos cuidam de segurança, armazenamento, autoscaling. Como é REST puro, dá pra chamar de qualquer linguagem — Python, Go, Java, C# — o que abre portas pra automação.',
      'Existem dois jeitos de trabalhar: o imperativo (kubectl run nginx --image=nginx — você dá a ordem direta, bom pra testes rápidos) e o declarativo (escrever um YAML e rodar kubectl apply -f arquivo.yaml — você descreve o estado desejado). Em projetos reais o declarativo domina, porque o arquivo é versionável no Git.',
    ],
    pointsTitle: 'Os verbos que resolvem 90% do dia',
    points: [
      { t: 'get', d: 'Consultar: lista recursos e o status de cada um. kubectl get pods, get svc, get nodes...', color: 'blue' },
      { t: 'create / run / apply', d: 'Criar: run cria um pod imperativo; apply -f aplica um YAML (declarativo).', color: 'signal' },
      { t: 'delete', d: 'Remover: kubectl delete pod nginx. Cuidado — pode afetar quem depende do recurso.', color: 'ember' },
      { t: 'describe', d: 'Detalhar: mostra configuração + a seção Events. É a primeira parada quando algo trava.', color: 'violet' },
      { t: 'logs', d: 'Ver o que o container está imprimindo. Seu melhor amigo no debug.', color: 'signal' },
      { t: 'exec', d: 'Abrir um shell dentro do container: kubectl exec -it <pod> -- /bin/sh.', color: 'blue' },
    ],
    examplesTitle: 'Exemplo estruturado: ciclo de vida de um Pod',
    examples: [
      {
        label: 'criar → inspecionar → destruir',
        lang: 'sh',
        code: `# Cria um pod chamado "nginx" a partir da imagem nginx:1.14.2 do Docker Hub
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
pod "nginx" deleted`,
        note: 'Se o status ficar em ImagePullBackOff, o cluster não conseguiu baixar a imagem — confira o nome/tag e sua internet.',
      },
    ],
    commands: [
      { cmd: 'kubectl run nginx --image=nginx:1.14.2 --port=80', note: 'cria um pod imperativo' },
      { cmd: 'kubectl describe pod <nome>', note: 'detalhes + Events (troubleshooting)' },
      { cmd: 'kubectl logs <nome>', note: 'saída do container' },
      { cmd: 'kubectl exec -it <nome> -- /bin/sh', note: 'shell dentro do container' },
      { cmd: 'kubectl delete pod <nome>', note: 'remove o pod' },
    ],
    tip: 'Grave o fluxo de debug: get pods (qual o status?) → describe pod (o que dizem os Events?) → logs (o que o app diz?). Essa sequência resolve a maioria dos problemas.',
  },

  {
    id: 'm3',
    num: '03',
    navTitle: 'Cluster & Pods',
    tag: 'arquitetura + labels',
    title: 'A anatomia do cluster — e a menor unidade dele: o Pod',
    lead: 'Um cluster é um grupo de máquinas (nodes) trabalhando juntas. O Pod é a menor unidade que o Kubernetes gerencia: um "envelope" com um ou mais containers que dividem rede e armazenamento.',
    concept: [
      'O cluster tem papéis bem definidos: o Master node decide onde e como executar os Pods; os Worker nodes executam de fato; o etcd é o banco distribuído que guarda a configuração e o estado de tudo; o kubelet é o agente que roda em cada node gerenciando os Pods dali; e o kube-proxy encaminha o tráfego de rede até o Pod certo.',
      'Quatro fatos sobre Pods: (1) um Pod representa um processo em execução e pode ter mais de um container dividindo o mesmo IP e volumes; (2) Pods são efêmeros — nascem e morrem o tempo todo, nunca conte com um Pod específico existir amanhã; (3) cada Pod ganha um IP interno do cluster; (4) Pods são descritos em YAML.',
      'Pra organizar tudo isso existem os rótulos (labels) e as anotações (annotations). Labels são pares chave-valor usados pra IDENTIFICAR E SELECIONAR objetos — é por label que um Service acha seus Pods. Annotations são metadados livres (autor, documentação, auditoria) que NÃO participam de seleção. Essa diferença é o que cai em prova.',
    ],
    pointsTitle: 'Quem faz o quê dentro do cluster',
    points: [
      { t: 'Master node', d: 'O cérebro: gerencia o cluster e decide onde executar os Pods.', color: 'blue' },
      { t: 'Worker node', d: 'Os braços: executam os Pods e demais recursos.', color: 'blue' },
      { t: 'etcd', d: 'Banco de dados distribuído com a configuração e o estado do cluster.', color: 'ember' },
      { t: 'kubelet', d: 'Agente em cada node que gerencia os Pods locais.', color: 'signal' },
      { t: 'kube-proxy', d: 'Encaminha o tráfego de rede pros Pods certos.', color: 'signal' },
      { t: 'API Server', d: 'A porta de entrada — tudo que o kubectl faz passa por aqui.', color: 'violet' },
    ],
    examplesTitle: 'O primeiro YAML — decore este esqueleto',
    examples: [
      {
        label: 'meu-pod.yaml',
        lang: 'yaml',
        code: `apiVersion: v1                # versão da API do K8s p/ este objeto
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
        - containerPort: 80`,
        note: 'Todo objeto K8s segue esse esqueleto: apiVersion + kind + metadata + spec. Muda o kind e o conteúdo do spec — o resto é sempre igual.',
      },
      {
        label: 'trabalhando com labels',
        lang: 'sh',
        code: `# Aplica o YAML (declarativo)
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
$ kubectl label pod meu-pod time=devops`,
        note: 'Esse filtro -l parece bobo agora, mas Services, ReplicaSets e Deployments encontram "seus" Pods exatamente assim: por label selector.',
      },
    ],
    commands: [
      { cmd: 'kubectl apply -f arquivo.yaml', note: 'cria/atualiza pelo YAML' },
      { cmd: 'kubectl get pods --show-labels', note: 'lista exibindo rótulos' },
      { cmd: 'kubectl get pods -l app=myapp', note: 'filtra por rótulo' },
      { cmd: 'kubectl delete -f arquivo.yaml', note: 'remove o que o arquivo criou' },
    ],
    tip: 'Labels = seleção operacional (o K8s usa). Annotations = documentação (humanos usam). Autor de um Pod? Annotation. Agrupar Pods de uma app? Label.',
  },

  {
    id: 'm4',
    num: '04',
    navTitle: 'Services & ConfigMap',
    tag: 'rede + configuração',
    title: 'Services: endereço fixo pra Pods que mudam',
    lead: 'Se os Pods nascem e morrem com IPs diferentes, como alguém fala com eles de forma confiável? Resposta: o Service — um ponto de entrada estável que encontra os Pods por label e balanceia o tráfego entre eles.',
    concept: [
      'O fluxo: uma requisição chega no Service (que tem IP e nome fixos) → o Service seleciona os Pods pelo label selector → e distribui o tráfego de forma balanceada entre as réplicas saudáveis. O nome do Service vira um hostname interno do cluster: se o Service chama "auth-service", qualquer Pod acessa http://auth-service — mesmo que os Pods por trás troquem de IP mil vezes.',
      'Existem três tipos: ClusterIP (o padrão — IP interno, acessível só dentro do cluster; certo pra comunicação entre serviços), NodePort (abre uma porta fixa de 30000 a 32767 no nó; acessível de fora via IP-do-nó:porta — ótimo pra expor algo no Minikube) e LoadBalancer (provisiona um balanceador externo com IP público; é o tipo usado na nuvem).',
      'A segunda peça da etapa é o ConfigMap: serviços precisam de configuração (portas, URLs, flags), e colocar isso dentro da imagem obriga a rebuildar a cada mudança. O ConfigMap separa a configuração do container — você guarda os valores num objeto central e injeta de 3 formas: variáveis de ambiente (a mais comum, via envFrom), arquivos montados (ótimo pra configs longas) ou argumentos de linha de comando.',
    ],
    pointsTitle: 'Os 3 tipos de Service',
    points: [
      { t: 'ClusterIP (padrão)', d: 'IP interno, só dentro do cluster. Use pra comunicação entre serviços (ex.: API ↔ banco).', color: 'blue' },
      { t: 'NodePort', d: 'Porta fixa (30000–32767) aberta no nó. Acessível de fora — o jeito de expor no Minikube.', color: 'signal' },
      { t: 'LoadBalancer', d: 'Balanceador externo com IP público. É o tipo de produção na nuvem (AWS, GCP, Azure).', color: 'violet' },
    ],
    examplesTitle: 'Os YAMLs — repare no selector',
    examples: [
      {
        label: 'service-nodeport.yaml',
        lang: 'yaml',
        code: `apiVersion: v1
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
      nodePort: 30080          # porta exposta no nó (só NodePort)`,
        note: 'O selector do Service casa com o label do Pod (app: myapp). É assim que ele sabe pra quem mandar o tráfego.',
      },
      {
        label: 'configmap + injeção',
        lang: 'yaml',
        code: `# 1) O ConfigMap com os valores...
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
            name: minha-config`,
        note: 'Confirme a injeção com: kubectl exec pod-config -- env',
      },
      {
        label: 'testando no navegador',
        lang: 'sh',
        code: `$ kubectl apply -f app.yaml
$ kubectl get svc
NAME          TYPE       CLUSTER-IP    PORT(S)
meu-service   NodePort   10.96.xx.xx   80:30080/TCP

# Gera a URL de acesso (no Windows/Docker, deixe o terminal aberto — é um túnel)
$ minikube service meu-service --url
http://127.0.0.1:53412   ← abra no navegador: página do nginx!`,
      },
    ],
    commands: [
      { cmd: 'kubectl get svc', note: 'lista os Services' },
      { cmd: 'minikube service <nome> --url', note: 'URL de acesso a um NodePort' },
      { cmd: 'kubectl get configmap', note: 'lista os ConfigMaps' },
      { cmd: 'kubectl exec <pod> -- env', note: 'confere variáveis injetadas' },
    ],
    tip: 'Regra de ouro: exponha o mínimo. Banco de dados = ClusterIP (invisível de fora). Só a porta de entrada do sistema vira NodePort/LoadBalancer. Pra senhas e chaves, o irmão seguro do ConfigMap é o Secret.',
  },

  {
    id: 'm5',
    num: '05',
    navTitle: 'Deployments',
    tag: 'auto-cura + escala',
    title: 'Auto-cura e escala: ReplicaSets e Deployments',
    lead: 'Criar Pod na mão foi ótimo pra aprender — mas ninguém faz isso em produção. O ReplicaSet garante que N réplicas existam sempre; o Deployment embrulha o ReplicaSet e adiciona atualização sem downtime e rollback.',
    concept: [
      'O ReplicaSet é o vigia do número: você declara "replicas: 3" e ele monitora os Pods pelo label selector. Caiu um? Ele detecta que a contagem baixou e cria outro em segundos, sem você pedir. É a auto-cura do Kubernetes em ação — o "estado desejado" mantido de verdade.',
      'O Deployment adiciona a gestão de versões: no Rolling Update, ao trocar a imagem, ele sobe réplicas novas e desliga as antigas gradualmente — o serviço nunca fica fora do ar. Se a versão nova quebrar, o kubectl rollout undo volta pra anterior (rollback). E escalar é um comando: kubectl scale --replicas=5.',
      'Os YAMLs de ReplicaSet e Deployment são quase idênticos, mas no dia a dia usamos quase sempre o Deployment, justamente pelo controle de versão. O Deployment cria e gerencia o ReplicaSet por baixo dos panos.',
    ],
    pointsTitle: 'O que cada um garante',
    points: [
      { t: 'ReplicaSet', d: 'N réplicas rodando SEMPRE. Caiu uma, nasce outra. Seleção por label selector.', color: 'blue' },
      { t: 'Rolling Update', d: 'Troca de versão gradual: sobe as novas, desliga as antigas. Zero downtime.', color: 'signal' },
      { t: 'Rollback', d: 'A versão nova quebrou? kubectl rollout undo volta pra anterior em segundos.', color: 'ember' },
    ],
    examplesTitle: 'O Deployment completo + ciclo de vida',
    examples: [
      {
        label: 'deployment.yaml',
        lang: 'yaml',
        code: `apiVersion: apps/v1
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
            - containerPort: 80`,
      },
      {
        label: 'auto-cura na prática',
        lang: 'sh',
        code: `$ kubectl apply -f deployment.yaml
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
nginx-fiap-7d4b9c-ddd   0/1   ContainerCreating   ← auto-cura!`,
      },
      {
        label: 'update + rollback',
        lang: 'sh',
        code: `# Rolling update: troca a imagem
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
deployment.apps/nginx-fiap rolled back`,
        note: 'Repare: o K8s só desliga os Pods antigos quando os novos ficam prontos. Como a imagem quebrada nunca fica pronta, os antigos seguram o serviço no ar.',
      },
    ],
    commands: [
      { cmd: 'kubectl scale deployment <nome> --replicas=5', note: 'escala manual' },
      { cmd: 'kubectl set image deployment/<nome> ctn=img:tag', note: 'dispara rolling update' },
      { cmd: 'kubectl rollout status deployment/<nome>', note: 'acompanha a troca' },
      { cmd: 'kubectl rollout history deployment/<nome>', note: 'lista revisões' },
      { cmd: 'kubectl rollout undo deployment/<nome>', note: 'rollback!' },
    ],
    tip: 'Faça o teste da auto-cura pelo menos uma vez: aplicar o deployment, deletar um pod na mão e ver o substituto nascer. É o momento em que o Kubernetes "clica" na cabeça.',
  },

  {
    id: 'm6',
    num: '06',
    navTitle: 'Volumes',
    tag: 'persistência de dados',
    title: 'Volumes: dados que sobrevivem ao Pod',
    lead: 'Pods são efêmeros — mas os dados de um banco não podem ser. O Kubernetes resolve isso com uma cadeia de 4 conceitos: Volume, PersistentVolume (PV), PersistentVolumeClaim (PVC) e StorageClass (SC).',
    concept: [
      'Memorize pela analogia: o PVC é o PEDIDO ("quero 1Gi, leitura e escrita por um nó"), o PV é o DISCO real que atende o pedido (NFS, EBS da AWS, hostPath...), e a StorageClass é o CARDÁPIO de tipos de disco (padrão? SSD rápido?). O Pod só referencia o PVC — ele não precisa saber onde o disco fica fisicamente.',
      'Os tipos de volume mais comuns: emptyDir (nasce vazio com o Pod e MORRE com o Pod — serve pra arquivos temporários e pra compartilhar dados entre containers do mesmo Pod), hostPath (monta um diretório do nó dentro do container — útil em dev, perigoso em produção) e persistentVolumeClaim (o jeito certo pra dados de verdade: sobrevivem a reinício e recriação do Pod).',
      'Os modos de acesso do PVC dizem quem pode montar o volume: ReadWriteOnce (leitura e escrita por UM nó — o caso típico de banco de dados), ReadOnlyMany (só leitura, vários nós — assets estáticos) e ReadWriteMany (leitura e escrita por vários nós — precisa de NFS ou similar).',
    ],
    pointsTitle: 'A cadeia de armazenamento',
    points: [
      { t: 'emptyDir', d: 'Vive e morre com o Pod. Pra dado temporário e compartilhamento entre containers do Pod.', color: 'signal' },
      { t: 'hostPath', d: 'Monta diretório do NÓ no container. Dev ok; produção, cuidado (amarra o Pod ao nó).', color: 'ember' },
      { t: 'PVC → PV', d: 'O pedido (Claim) casa com o disco (Volume). Dados sobrevivem à morte do Pod.', color: 'blue' },
      { t: 'StorageClass', d: 'Provisiona PVs automaticamente por perfil. No Minikube, a classe "standard" já faz isso.', color: 'violet' },
    ],
    examplesTitle: 'Prove a persistência: escreva, destrua, leia de volta',
    examples: [
      {
        label: 'pvc.yaml',
        lang: 'yaml',
        code: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: meu-pvc
spec:
  accessModes:
    - ReadWriteOnce            # um nó lê e escreve (típico de banco)
  resources:
    requests:
      storage: 1Gi             # quanto disco eu quero
# no Minikube, a StorageClass "standard" provisiona o PV sozinha`,
      },
      {
        label: 'pod-com-pvc.yaml',
        lang: 'yaml',
        code: `apiVersion: v1
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
        claimName: meu-pvc`,
      },
      {
        label: 'o teste da sobrevivência',
        lang: 'sh',
        code: `$ kubectl apply -f pvc.yaml -f pod-com-pvc.yaml

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
sobrevivi!            ← o Pod morreu, o dado não.`,
        note: 'Experimento extra: repita com emptyDir — ao recriar o Pod, o arquivo terá sumido. Essa é exatamente a diferença entre efêmero e persistente.',
      },
    ],
    commands: [
      { cmd: 'kubectl get pvc', note: 'pedidos de volume (Bound = ok)' },
      { cmd: 'kubectl get pv', note: 'discos persistentes do cluster' },
      { cmd: 'kubectl delete pvc <nome>', note: 'remove o pedido (e libera o disco)' },
    ],
    tip: 'Dado importante SEMPRE em PVC. Se os dados sumiram após um restart, aposto que estavam em emptyDir ou no filesystem do container.',
  },

  {
    id: 'm7',
    num: '07',
    navTitle: 'Probes',
    tag: 'saúde do app',
    title: 'Probes: como o cluster sabe que seu app está vivo',
    lead: 'Sem probes, um app pode falhar silenciosamente: o processo está de pé, mas travado — e o Kubernetes não tem como saber. As probes são verificações de saúde declaradas no manifesto do Pod.',
    concept: [
      'São três probes, e o mais importante é o que acontece quando cada uma FALHA: a Liveness pergunta "está vivo?" — se falha, o Pod é REINICIADO (pra apps que travam e só voltam com restart). A Readiness pergunta "está pronto pra receber requisições?" — se falha, o Pod SAI DO BALANCEADOR (o Service para de mandar tráfego), sem reiniciar. A Startup pergunta "terminou de inicializar?" — enquanto roda, SEGURA as outras probes (evita que a liveness mate um app lento antes da hora).',
      'Como a probe verifica: httpGet (o kubelet faz um GET num endpoint tipo /health e espera 200 OK — o mais comum), tcpSocket (testa se a porta aceita conexão — pra serviços que não falam HTTP) e exec (executa um comando dentro do container; código de saída 0 = saudável).',
      'Boas práticas da aula: use as três probes juntas em produção; use endpoints diferentes pra cada probe; comece pelas configurações padrão e ajuste intervalos só quando o app pedir; monitore as falhas de probe (ex.: com Prometheus) — elas são o primeiro sinal de problema.',
    ],
    pointsTitle: 'As 3 probes e o que acontece na falha',
    points: [
      { t: 'Liveness', d: '"Está vivo?" Falhou → o Pod é REINICIADO. Pra apps que travam.', color: 'ember' },
      { t: 'Readiness', d: '"Pronto pra tráfego?" Falhou → SAI do balanceador, sem restart. Pra apps que carregam dados antes.', color: 'signal' },
      { t: 'Startup', d: '"Terminou de subir?" Enquanto roda, segura as outras. Pra apps lentos no boot.', color: 'violet' },
    ],
    examplesTitle: 'Pod com as 3 probes + sabotagem didática',
    examples: [
      {
        label: 'pod-com-probes.yaml',
        lang: 'yaml',
        code: `apiVersion: v1
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
        periodSeconds: 30`,
      },
      {
        label: 'sabotando a liveness (assista ao restart)',
        lang: 'sh',
        code: `# liveness-exec.yaml: um busybox que cria /tmp/healthy,
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
  Normal   Killing    Container liveness failed liveness probe, will be restarted`,
        note: 'Linha do tempo: 30s saudável → arquivo apagado → 3 falhas seguidas (padrão) → kubelet reinicia. Como o script recomeça, o ciclo repete pra sempre — de propósito, pra você ver.',
      },
    ],
    commands: [
      { cmd: 'kubectl get pods -w', note: 'assiste mudanças em tempo real' },
      { cmd: 'kubectl describe pod <nome>', note: 'Events mostram as falhas de probe' },
    ],
    tip: 'Running não significa saudável. Um app pode estar rodando e travado num deadlock. É exatamente por isso que as probes existem.',
  },

  {
    id: 'm8',
    num: '08',
    navTitle: 'Autoscaling (HPA)',
    tag: 'escala automática',
    title: 'HPA: escala automática baseada em métricas',
    lead: 'Você já sabe escalar na mão (kubectl scale). O Horizontal Pod Autoscaler faz isso sozinho: monitora métricas dos Pods (CPU, memória...) e ajusta o número de réplicas entre um mínimo e um máximo que você define.',
    concept: [
      'O funcionamento: o HPA monitora as métricas de utilização dos Pods e compara com o alvo configurado (ex.: manter a média de CPU em 70%). Passou do alvo → cria réplicas (até o máximo). Caiu → remove réplicas (até o mínimo), economizando recurso. O scale down é propositalmente lento (~5min de estabilidade) pra não ficar "pistonando" com variações rápidas.',
      'Métricas suportadas: CPU (a mais comum), memória, métricas personalizadas do seu app (requisições/s, tamanho de fila), métricas externas (ex.: vindas do Prometheus) e E/S de disco. A métrica certa depende do perfil do app: app pesado em CPU escala por CPU; app que devora RAM escala por memória.',
      'Dois pré-requisitos que pegam todo mundo: (1) o cluster precisa do metrics-server pra ler CPU/memória — no Minikube: minikube addons enable metrics-server; (2) o container PRECISA declarar resources.requests.cpu, porque "70% de CPU" significa 70% DO QUE O POD PEDIU. Sem requests, o HPA mostra <unknown> e não escala.',
    ],
    pointsTitle: 'O que o HPA entende',
    points: [
      { t: 'CPU / Memória', d: 'As métricas clássicas. % calculada sobre o resources.requests do container.', color: 'blue' },
      { t: 'Métricas custom', d: 'Do seu app (req/s, fila) ou externas (Prometheus). Pra escalar pelo que importa.', color: 'violet' },
      { t: 'min / max', d: 'Você sempre define o piso e o teto de réplicas. O HPA trabalha dentro da faixa.', color: 'signal' },
    ],
    examplesTitle: 'Deployment + HPA + teste de carga',
    examples: [
      {
        label: 'deployment.yaml (com requests!)',
        lang: 'yaml',
        code: `apiVersion: apps/v1
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
              cpu: "200m"`,
      },
      {
        label: 'hpa.yaml',
        lang: 'yaml',
        code: `apiVersion: autoscaling/v2
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
          averageUtilization: 70   # alvo: média de CPU em 70%`,
      },
      {
        label: 'gerando carga e assistindo escalar',
        lang: 'sh',
        code: `# Pré-requisito: metrics-server
$ minikube addons enable metrics-server

$ kubectl apply -f deployment.yaml -f hpa.yaml
# (crie também um Service ClusterIP "nginx-hpa" pro gerador achar o app)

# Gere carga de dentro do cluster:
$ kubectl run gerador --image=busybox -it --rm -- /bin/sh -c \\
  "while true; do wget -q -O- http://nginx-hpa; done"

# Em OUTRO terminal, assista:
$ kubectl get hpa -w
NAME        TARGETS         MINPODS  MAXPODS  REPLICAS
nginx-hpa   cpu: 0%/70%     1        10       1
nginx-hpa   cpu: 152%/70%   1        10       1
nginx-hpa   cpu: 152%/70%   1        10       3    ← escalou sozinho!

# Pare a carga (Ctrl+C) e aguarde ~5min: as réplicas encolhem de volta.`,
        note: 'Em produção, ferramentas como K6 e JMeter fazem esse teste de carga de forma controlada.',
      },
    ],
    commands: [
      { cmd: 'minikube addons enable metrics-server', note: 'pré-requisito do HPA' },
      { cmd: 'kubectl get hpa -w', note: 'assiste o HPA reagir à carga' },
      { cmd: 'kubectl top pods', note: 'CPU/memória por pod' },
      { cmd: 'kubectl autoscale deployment <n> --cpu-percent=70 --min=1 --max=10', note: 'cria HPA imperativo' },
    ],
    tip: 'kubectl get hpa mostrando <unknown> nos targets? Ou o metrics-server não está ativo, ou o container não declarou resources.requests. São as duas causas, sempre.',
  },
]

// ===== PLATAFORMAS GRATUITAS DE PRÁTICA =====

export type Platform = {
  name: string
  price: string
  free: boolean
  url: string
  urlLabel: string
  desc: string
  goodFor: string
}

export const PLATFORMS: Platform[] = [
  {
    name: 'Killercoda',
    price: '100% grátis',
    free: true,
    url: 'https://killercoda.com/kubernetes',
    urlLabel: 'killercoda.com/kubernetes',
    desc: 'Cenários interativos de Kubernetes direto no navegador: você recebe um terminal com cluster real e um roteiro guiado. Sucessor do Katacoda.',
    goodFor: 'Praticar cada etapa deste guia sem instalar nada. Comece por aqui.',
  },
  {
    name: 'Play with Kubernetes',
    price: '100% grátis',
    free: true,
    url: 'https://labs.play-with-k8s.com',
    urlLabel: 'labs.play-with-k8s.com',
    desc: 'Cluster Kubernetes real e temporário (sessões de 4 horas) no navegador, mantido pela Docker. Você monta o cluster na mão com kubeadm.',
    goodFor: 'Testar comandos kubectl livremente e entender a montagem de um cluster.',
  },
  {
    name: 'Kube by Example',
    price: '100% grátis',
    free: true,
    url: 'https://kubebyexample.com',
    urlLabel: 'kubebyexample.com',
    desc: 'Tutoriais e exemplos curtos mantidos pela Red Hat: um conceito por página (Pods, Services, Deployments...), com exemplos direto ao ponto.',
    goodFor: 'Revisar um conceito específico rapidamente, como uma segunda explicação.',
  },
  {
    name: 'Introduction to Kubernetes (LFS158)',
    price: '100% grátis',
    free: true,
    url: 'https://training.linuxfoundation.org/training/introduction-to-kubernetes/',
    urlLabel: 'training.linuxfoundation.org',
    desc: 'Curso oficial gratuito da Linux Foundation (quem mantém o K8s), disponível também no edX. Base teórica sólida com certificado de participação.',
    goodFor: 'Consolidar a teoria com o material oficial depois de fechar este guia.',
  },
  {
    name: 'Kubernetes the Hard Way',
    price: '100% grátis',
    free: true,
    url: 'https://github.com/kelseyhightower/kubernetes-the-hard-way',
    urlLabel: 'github.com/kelseyhightower',
    desc: 'O lendário roteiro do Kelsey Hightower: montar um cluster peça por peça, na unha, sem instaladores. Você entende CADA componente.',
    goodFor: 'Nível avançado — quando quiser entender o que o Minikube esconde de você.',
  },
  {
    name: 'KodeKloud',
    price: 'Free tier + pago',
    free: false,
    url: 'https://kodekloud.com',
    urlLabel: 'kodekloud.com',
    desc: 'Labs guiados estilo desafio: "esse Pod não sobe, descubra por quê". Alguns labs são gratuitos; o catálogo completo (e os simulados CKA/CKAD) é pago.',
    goodFor: 'Troubleshooting realista, o mais próximo de uma entrevista técnica.',
  },
  {
    name: 'iximiuz Labs',
    price: 'Free tier + pago',
    free: false,
    url: 'https://labs.iximiuz.com',
    urlLabel: 'labs.iximiuz.com',
    desc: 'Playgrounds de containers e Kubernetes no navegador com desafios práticos. Vários playgrounds e desafios liberados no plano gratuito.',
    goodFor: 'Experimentos mais profundos: rede, imagens, internals de containers.',
  },
]
