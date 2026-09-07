// Conteúdo das 8 etapas base (aulas 1-8, Thiago Adriano / FIAP) + 1 etapa bônus de
// capstone (aplicação profissional de tudo, fora da grade oficial das aulas),
// tematizado com Fórmula 1 pelo pipeline /otimizar-relatorio (relatorios/kubernetes-basico/final.md)

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
  narration: string
  lead: string
  concept: string[]
  points: Point[]
  pointsTitle: string
  examples: Example[]
  examplesTitle: string
  commands: Command[]
  handsOnIntro?: string
  handsOn: string[]
  tip: string
  takeaway: string
  outro: string
}

export type Mapping = { k8s: string; f1: string }

// O quadro de-para do piloto — a mesma analogia vale do início ao fim do guia
export const DE_PARA: Mapping[] = [
  { k8s: 'Container', f1: 'O carro + kit da equipe: isolado na sua garagem, compartilhando a infraestrutura do circuito' },
  { k8s: 'Imagem de container', f1: 'A especificação de montagem do carro, replicável em qualquer circuito do calendário' },
  { k8s: 'Máquina virtual (VM)', f1: 'Levar a fábrica inteira da equipe para cada GP' },
  { k8s: 'Kubernetes (orquestrador)', f1: 'A operação completa de mureta + garagem' },
  { k8s: 'Estado desejado', f1: 'O target passado no rádio: você declara o alvo, o sistema mantém' },
  { k8s: 'Cluster', f1: 'A equipe montada no fim de semana de GP' },
  { k8s: 'Control plane (master node)', f1: 'A mureta (pit wall)' },
  { k8s: 'Worker node', f1: 'A garagem/box onde os carros são montados e operados' },
  { k8s: 'API Server', f1: 'O engenheiro de corrida: todo rádio passa por ele, sem exceção' },
  { k8s: 'kubectl', f1: 'O botão de rádio do piloto' },
  { k8s: 'kubeconfig', f1: 'O paddock pass + a frequência de rádio da equipe' },
  { k8s: 'etcd', f1: 'O sistema central de dados da equipe (setup sheets + estado de tudo)' },
  { k8s: 'kubelet', f1: 'O chefe de mecânicos de cada garagem' },
  { k8s: 'kube-proxy', f1: 'O sinaleiro do pit lane, direcionando cada carro ao box certo' },
  { k8s: 'Minikube', f1: 'O simulador da fábrica' },
  { k8s: 'Pod', f1: 'O carro (chassi montado e rodando)' },
  { k8s: 'IP do Pod', f1: 'A posição do carro na pista, que muda o tempo todo' },
  { k8s: 'Labels', f1: 'As etiquetas de rastreamento FIA nas peças e no carro (servem para selecionar)' },
  { k8s: 'Annotations', f1: 'As anotações do engenheiro no caderno de debrief (servem para humanos)' },
  { k8s: 'Manifesto YAML', f1: 'A folha de especificação do carro, versionada' },
  { k8s: 'Imperativo vs. declarativo', f1: 'Ordem direta no rádio ("box, box") vs. plano de corrida escrito antes do GP' },
  { k8s: 'Service', f1: 'O pit box: posição fixa no pit lane, atende qualquer carro com a etiqueta da equipe' },
  { k8s: 'ClusterIP', f1: 'Canal interno de rádio: só a equipe ouve' },
  { k8s: 'NodePort', f1: 'Portão de serviço numerado do autódromo' },
  { k8s: 'LoadBalancer', f1: 'A entrada oficial do autódromo, com bilheteria' },
  { k8s: 'ConfigMap', f1: 'A folha de set-up, separada do chassi' },
  { k8s: 'Secret', f1: 'Os mapas de motor confidenciais' },
  { k8s: 'ReplicaSet', f1: 'A regra do chefe de equipe: "N carros prontos, sempre" (e a virada de madrugada dos mecânicos)' },
  { k8s: 'Deployment', f1: 'O programa de desenvolvimento: pacotes de upgrade, spec por spec' },
  { k8s: 'Rolling update', f1: 'Introduzir o upgrade em um carro de cada vez' },
  { k8s: 'Rollback', f1: 'Voltar para a spec anterior (o assoalho antigo que funcionava)' },
  { k8s: 'emptyDir', f1: 'O quadro branco da garagem, apagado quando o fim de semana acaba' },
  { k8s: 'hostPath', f1: 'Guardar dados no caixote de frete daquele circuito' },
  { k8s: 'PVC', f1: 'A requisição de armazenamento do engenheiro de dados' },
  { k8s: 'PV', f1: 'O storage físico da fábrica que atende a requisição' },
  { k8s: 'StorageClass', f1: 'O catálogo de tipos de storage (trackside rápido vs. datacenter da fábrica)' },
  { k8s: 'Probes', f1: 'As checagens de telemetria + radio check' },
  { k8s: 'Liveness probe', f1: 'Telemetria mudou → reset completo do carro' },
  { k8s: 'Readiness probe', f1: 'O semáforo do box: segura o carro fora da pista, sem desmontar nada' },
  { k8s: 'Startup probe', f1: 'O procedimento de fire-up da PU: nada é cobrado antes do motor aquecer' },
  { k8s: 'HPA', f1: 'A mureta de estratégia alinhando mais carros conforme a carga (uma F1 sem o limite de 2 carros)' },
  { k8s: 'metrics-server', f1: 'Os sensores de telemetria: sem eles a mureta não enxerga nada' },
  { k8s: 'resources.requests', f1: 'A alocação declarada de energia/combustível, a base de qualquer percentual' },
]

// Notas do piloto: onde as analogias quebram (analogia forçada é pior que analogia nenhuma)
export const ANALOGY_NOTES: string[] = [
  'ReplicaSet (Etapa 05): na F1, reposição de carro só entre sessões, e o regulamento limita a 2 carros por equipe. O ReplicaSet repõe em segundos, a qualquer momento, em qualquer quantidade. A "virada de madrugada dos mecânicos" vale para o mecanismo (remontar da especificação), não para o tempo nem para o limite.',
  'HPA (Etapa 08): escalar réplicas não tem paralelo direto no grid de 2 carros. A analogia declarada é uma "endurance sem limite de inscrições". O comportamento da mureta (reagir à telemetria, respeitar piso e teto) se mantém fiel.',
  'Service (Etapa 04): o pit box real atende um carro por vez; o Service balanceia tráfego contínuo entre N réplicas simultâneas. A parte fiel é o endereço fixo + a seleção por etiqueta.',
  'Pod multi-container (Etapa 03): o carro com PU + MGU-K ilustra "unidades distintas compartilhando sistemas", mas containers de um Pod são processos independentes que podem ser trocados individualmente na especificação.',
]

export const LESSONS: Lesson[] = [
  {
    id: 'm1',
    num: '01',
    navTitle: 'Por que K8s existe',
    tag: 'motivação + setup',
    title: 'Por que o Kubernetes existe',
    narration:
      'APAGARAM-SE AS LUZES! É largada no GP do Kubernetes! Primeira curva, primeira freada, e a pergunta que abre todo campeonato: por que esse esporte existe? A resposta desta etapa sustenta as outras sete. Segura comigo.',
    lead: 'Pense na demanda de um fim de semana de GP: o site da equipe, o timing, o streaming. Tudo dorme durante a semana e explode no domingo da corrida. E tem o carro que voa no simulador e não anda na pista: o clássico "na minha máquina funciona". Todo projeto esbarra nesses dois problemas, e o Kubernetes automatiza a solução dos dois.',
    concept: [
      'A peça comum das duas soluções é o container. Uma máquina virtual é como levar a fábrica inteira para cada GP: prensa de fibra de carbono, túnel de vento, escritório, tudo embarcado no avião. Um container é o carro com o kit da equipe. Cada equipe tem sua garagem isolada, seus segredos, suas peças, mas a estrutura do circuito (o prédio dos boxes, a energia, o pit lane, ou seja, o kernel do sistema operacional) é compartilhada entre as dez equipes. A Cadillac, estreando neste ano, não construiu um autódromo para correr: chegou com seus caixotes e plugou na infraestrutura existente.',
      'Em termos técnicos: a VM carrega um sistema operacional completo (gigabytes, minutos para subir); o container compartilha o kernel do SO hospedeiro e leva só os arquivos, binários e bibliotecas que o app precisa (megabytes, segundos). Uma imagem de container é um ambiente inteiro, replicável em qualquer lugar. É a especificação de montagem que garante que o carro embarcado para Suzuka é idêntico ao que rodou em Melbourne. Adeus "na minha máquina funciona".',
      'Só que containers resolvem o problema do ambiente e criam outro: com dezenas ou centenas deles, alguém precisa criá-los, destruí-los, vigiar a saúde e recriar o que falhar. Fazer isso na mão não escala. É como pedir para uma pessoa só operar os dois carros, a telemetria e o pit stop. O Kubernetes (K8s) é o orquestrador que assume essas tarefas: a operação completa de mureta + garagem.',
      'A filosofia dele é a do engenheiro de corrida ditando target: ele não manda uma instrução a cada curva. Declara "target +0.3 por volta, modo de energia 6" e todo o sistema trabalha sozinho para manter. No K8s você declara o estado desejado ("quero 3 cópias disso rodando") e ele faz a realidade bater com essa declaração, inclusive de madrugada, quando um container morre. A mureta nunca dorme.',
    ],
    pointsTitle: 'Os conceitos-chave desta etapa',
    points: [
      { t: 'Container ≠ VM', d: 'VM = hardware virtual + SO completo (a fábrica embarcada). Container = só o necessário do app, compartilhando o kernel do hospedeiro (o carro na garagem do circuito). Muito mais leve.', color: 'ember' },
      { t: 'Escala horizontal', d: 'Mais cópias da aplicação dividindo a carga (é o que o K8s automatiza). Vertical = mais CPU/RAM na mesma máquina: alinhar mais carros vs. motor maior num carro só.', color: 'signal' },
      { t: 'Cluster e Pod', d: 'O K8s organiza máquinas (nós) em clusters. Os containers rodam agrupados em Pods, a menor unidade gerenciada. Cluster = a equipe no fim de semana; Pod = o carro.', color: 'blue' },
      { t: 'kubectl', d: 'A ferramenta de linha de comando que conversa com a API REST do cluster. É o seu botão de rádio (detalhes na Etapa 02).', color: 'blue' },
      { t: 'Minikube', d: 'Um cluster K8s de 1 nó rodando na sua máquina. O simulador da fábrica: feito para estudo, sem risco de bater o carro de verdade. É o laboratório deste guia.', color: 'signal' },
      { t: 'Estado desejado', d: 'A filosofia do K8s: você declara o que quer, ele faz acontecer e mantém. Caiu? Ele recria sozinho. O target no rádio.', color: 'violet' },
    ],
    examplesTitle: 'Montando o laboratório (passo a passo)',
    examples: [
      {
        label: 'setup do ambiente',
        lang: 'sh',
        code: `# 1. Instale o Docker Desktop (docker.com). No Linux, use o Docker
#    Engine (docs.docker.com/engine/install). Confirme:
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
        note: 'A primeira execução do minikube start baixa a imagem do cluster e demora alguns minutos. É normal. É o fire-up do simulador, e simulador frio nunca liga instantâneo.',
      },
    ],
    commands: [
      { cmd: 'minikube start', note: 'sobe o cluster local de 1 nó' },
      { cmd: 'minikube stop', note: 'para o cluster sem apagar nada' },
      { cmd: 'kubectl get nodes', note: 'lista os nós e o status' },
      { cmd: 'kubectl get pods', note: 'lista os pods do namespace atual' },
    ],
    handsOnIntro: 'O menor exercício possível: prove que seu laboratório está vivo, o equivalente ao installation lap.',
    handsOn: [
      'Rode minikube start e aguarde o "Done!".',
      'Rode kubectl get nodes e observe: o nó minikube com STATUS Ready. Se aparecer NotReady, aguarde 1 minuto e repita.',
      'Rode kubectl get pods e observe: "No resources found". Cluster vazio e pronto é exatamente o ponto de partida da próxima etapa: garagem limpa antes do carro chegar.',
      'Bônus: rode minikube stop e depois kubectl get nodes para ver a mensagem de erro de conexão. Suba de novo com minikube start. Agora você sabe o que "cluster fora do ar" parece no terminal: é o rádio mudo, e rádio mudo em corrida é a pior sensação que existe.',
    ],
    tip: 'Se o minikube start falhar, a causa mais comum é o Docker Desktop não estar aberto (no Linux, o serviço parado: sudo systemctl start docker). Suba o Docker primeiro e tente de novo. (Todo simulador tem um disjuntor que alguém esqueceu de ligar.)',
    takeaway: 'Container é um ambiente leve e replicável, o carro que anda igual em qualquer circuito; Kubernetes é o engenheiro de corrida do estado desejado: você declara o target, ele garante.',
    outro: 'Setor 1 no verde! Laboratório de pé, simulador ligado, cluster respondendo, largada limpíssima. Agora vem a parte que todo estreante subestima: aprender a falar no rádio. Etapa 02 na sequência. Não sai daí.',
  },

  {
    id: 'm2',
    num: '02',
    navTitle: 'kubectl & API',
    tag: 'o botão de rádio',
    title: 'kubectl e a API: como você comanda o cluster',
    narration:
      'Segunda etapa e o traçado aperta: de que adianta ter o carro na garagem se você não sabe apertar o botão do rádio? A F1 vive desse canal. Foi nele que Kimi Räikkönen imortalizou o "deixa comigo, eu sei o que estou fazendo" em Abu Dhabi 2012, e venceu. Hoje é você quem aprende a dar as ordens.',
    lead: 'Seu cluster está de pé, mas é uma caixa fechada. Como mandar ordens? Como investigar quando algo der errado, sem acesso "físico" ao container? Na pista o piloto tem o mesmo problema: a 300 km/h, não dá pra descer e abrir o capô. Tudo que ele sabe do carro chega pelo rádio e pela telemetria.',
    concept: [
      'Tudo no Kubernetes passa pela API REST do nó master. O kubectl é o cliente dessa API: cada comando que você digita vira uma requisição HTTP (GET, POST, PUT, DELETE) contra o cluster. Na F1, o piloto não fala com o mecânico do pneu dianteiro esquerdo nem com a fábrica. Fala com uma pessoa: o engenheiro de corrida. Toda mensagem passa por esse canal único, que valida, registra e repassa para quem executa. O kubectl é o seu botão de rádio; o API Server é o engenheiro de corrida: nada acontece no cluster sem passar por ele.',
      'O caminho de um comando: você digita kubectl get pods → o kubectl lê o arquivo kubeconfig (endereço do API Server, credenciais e contexto do cluster atual; o Minikube configura isso sozinho e você pode pensar nele como o paddock pass com a frequência de rádio da equipe já sintonizada) → e dispara um GET /api/v1/pods contra o API Server. A resposta volta formatada no seu terminal.',
      'A API é dividida em grupos: o "core" tem os recursos fundamentais (pods, services, replicasets); outros grupos cuidam de segurança, armazenamento, autoscaling, como os departamentos da equipe: chassi, aero, PU, estratégia. Como é REST puro, dá para chamar de qualquer linguagem (Python, Go, Java, C#), o que abre portas para automação.',
      'Existem dois jeitos de trabalhar: o imperativo (kubectl run nginx --image=nginx, a ordem direta, o "box, box, box" no rádio: rápido, decisivo, bom para testes) e o declarativo (escrever um YAML e rodar kubectl apply -f arquivo.yaml, o plano de corrida escrito no sábado à noite: documentado, revisado, versionado). Em projetos reais o declarativo domina, porque o arquivo é versionável no Git. Nenhuma equipe séria improvisa a estratégia inteira no rádio.',
    ],
    pointsTitle: 'Os verbos que resolvem 90% do dia',
    points: [
      { t: 'get', d: 'Consultar: lista recursos e o status de cada um. kubectl get pods, get svc, get nodes... É a olhada no painel de timing.', color: 'blue' },
      { t: 'create / run / apply', d: 'Criar: run cria um pod imperativo; apply -f aplica um YAML (declarativo).', color: 'signal' },
      { t: 'delete', d: 'Remover: kubectl delete pod nginx. Cuidado: pode afetar quem depende do recurso.', color: 'ember' },
      { t: 'describe', d: 'Detalhar: configuração + a seção Events. Primeira parada quando algo trava. É o histórico de telemetria da sessão, evento por evento.', color: 'violet' },
      { t: 'logs', d: 'Ver o que o container está imprimindo. Seu melhor amigo no debug: é ouvir o rádio do carro direto.', color: 'signal' },
      { t: 'exec', d: 'Abrir um shell dentro do container: kubectl exec -it <pod> -- /bin/sh. O mecânico plugando o laptop no carro.', color: 'blue' },
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
        note: 'Se o status ficar em ImagePullBackOff, o cluster não conseguiu baixar a imagem. Confira o nome/tag e sua internet. É o caixote de peças que não chegou no circuito: sem a spec certa, o carro não monta.',
      },
    ],
    commands: [
      { cmd: 'kubectl run nginx --image=nginx:1.14.2 --port=80', note: 'cria um pod imperativo' },
      { cmd: 'kubectl describe pod <nome>', note: 'detalhes + Events (troubleshooting)' },
      { cmd: 'kubectl logs <nome>', note: 'saída do container' },
      { cmd: 'kubectl exec -it <nome> -- /bin/sh', note: 'shell dentro do container' },
      { cmd: 'kubectl delete pod <nome>', note: 'remove o pod' },
    ],
    handsOnIntro: 'Execute o ciclo completo e force o primeiro erro da sua vida no K8s. Todo piloto precisa da primeira rodada para calibrar o limite:',
    handsOn: [
      'Rode a sequência do exemplo acima (run → get → describe → logs → delete). Observe no describe a seção Events: as linhas Pulling image, Created container, Started container contam a história do pod em ordem, igual ao replay da telemetria, quadro a quadro.',
      'Agora crie um pod quebrado de propósito: kubectl run quebrado --image=nginx:versao-que-nao-existe.',
      'Rode kubectl get pods e observe o status ImagePullBackOff (ou ErrImagePull).',
      'Rode kubectl describe pod quebrado e observe nos Events a mensagem explicando que a imagem não foi encontrada. Você acabou de praticar o fluxo de debug de verdade.',
      'Limpe: kubectl delete pod quebrado.',
    ],
    tip: 'Grave este fluxo: get pods (qual o status?) → describe pod (o que dizem os Events?) → logs (o que o app diz?). Essa sequência resolve a maioria dos problemas. É o protocolo pós-problema do piloto: painel de timing → histórico de telemetria → rádio do carro.',
    takeaway: 'Tudo no K8s é uma chamada à API REST; o kubectl é o seu botão de rádio e o API Server é o engenheiro de corrida. E quando algo trava, o caminho é sempre get → describe → logs.',
    outro: 'Rádio calibrado, e repararam? O primeiro erro forçado e diagnosticado sem pânico. Esse setor separa quem aperta botão de quem conversa com a equipe. E atenção, porque agora vem o miolo técnico do circuito: a anatomia do cluster e a folha de especificação. Não pisca.',
  },

  {
    id: 'm3',
    num: '03',
    navTitle: 'Cluster & Pods',
    tag: 'arquitetura + labels',
    title: 'A anatomia do cluster e a menor unidade dele: o Pod',
    narration:
      'Entramos no complexo de curvas mais técnico do traçado. Aqui não adianta coragem, é precisão. E a história do esporte não perdoa spec fora do lugar: em 1999 a Ferrari quase perdeu uma vitória na Malásia por milímetros nas barge boards. Especificação não é burocracia, é resultado. Hoje você escreve a sua primeira folha de especificação.',
    lead: 'Na Etapa 02 você criou um pod com um comando imperativo. Funciona, mas tem dois furos: você não sabe o que exatamente foi criado nem onde. E se amanhã precisar recriar aquele pod idêntico, vai depender da memória. Nenhuma equipe monta um carro de memória: existe folha de especificação para tudo, do ângulo da asa ao torque de cada parafuso.',
    concept: [
      'Um cluster é um grupo de máquinas (nodes) trabalhando juntas, com papéis bem definidos: é a equipe montada no fim de semana de GP. O Pod é a menor unidade que o Kubernetes gerencia. No nosso mapa, o Pod é o carro: um "envelope" com um ou mais containers que dividem rede e armazenamento.',
      'Quatro fatos sobre Pods: (1) um Pod representa um processo em execução e pode ter mais de um container dividindo o mesmo IP e volumes, como PU e MGU-K no mesmo carro; (2) Pods são efêmeros, nascem e morrem o tempo todo; o carro que correu em Silverstone hoje será desmontado até o último parafuso antes de Spa, o que permanece é a especificação (guarde esta frase: ela é a raiz das Etapas 04, 05 e 06); (3) cada Pod ganha um IP interno do cluster, a posição do carro na pista: existe, é real, mas muda o tempo todo; (4) Pods são descritos em YAML, a folha de especificação do carro.',
      'Para organizar dezenas de Pods existem os rótulos e as anotações. Na F1, cada componente do carro (PU, turbo, MGU-K, câmbio) carrega uma etiqueta de rastreamento lacrada pela FIA: é por ela que o sistema sabe qual motor está em qual carro; a etiqueta serve para IDENTIFICAR E SELECIONAR. Já o caderno de debrief do engenheiro ("piloto reportou vibração na curva 7") é informação para humanos, e ninguém filtra componentes por anotação de caderno. Labels são a etiqueta FIA (é por label que um Service acha seus Pods, como você verá na Etapa 04); annotations são o caderno de debrief (autor, documentação, auditoria; NÃO participam de seleção). Essa diferença é o que cai em prova.',
    ],
    pointsTitle: 'Quem faz o quê dentro do cluster',
    points: [
      { t: 'Master node', d: 'A mureta (pit wall): gerencia o cluster e decide onde executar os Pods.', color: 'blue' },
      { t: 'Worker node', d: 'As garagens: executam os Pods e demais recursos. É onde o carro é montado e roda.', color: 'blue' },
      { t: 'etcd', d: 'O sistema central de dados da equipe: banco distribuído com a configuração e o estado do cluster: as setup sheets de tudo.', color: 'ember' },
      { t: 'kubelet', d: 'O chefe de mecânicos de cada garagem: agente em cada node que gerencia os Pods locais.', color: 'signal' },
      { t: 'kube-proxy', d: 'O sinaleiro do pit lane: encaminha o tráfego de rede para os Pods certos.', color: 'signal' },
      { t: 'API Server', d: 'O engenheiro de corrida: tudo que o kubectl faz passa por aqui (Etapa 02).', color: 'violet' },
    ],
    examplesTitle: 'O primeiro YAML: decore este esqueleto',
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
        note: 'Todo objeto K8s segue esse esqueleto: apiVersion + kind + metadata + spec. Muda o kind e o conteúdo do spec; o resto é sempre igual. É como o regulamento técnico: quem entende a estrutura de um artigo lê todos os outros.',
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

# Filtra por label: o mecanismo central do K8s
$ kubectl get pods -l app=myapp
NAME      READY   STATUS    RESTARTS   AGE
meu-pod   1/1     Running   0          1m

# Adiciona label num pod que já existe
$ kubectl label pod meu-pod time=devops`,
        note: 'Esse filtro -l parece bobo agora, mas Services, ReplicaSets e Deployments encontram "seus" Pods exatamente assim: por label selector. É o fio que costura as próximas etapas, como a etiqueta FIA costura o carro ao box e ao resultado na súmula.',
      },
    ],
    commands: [
      { cmd: 'kubectl apply -f arquivo.yaml', note: 'cria/atualiza pelo YAML' },
      { cmd: 'kubectl get pods --show-labels', note: 'lista exibindo rótulos' },
      { cmd: 'kubectl get pods -l app=myapp', note: 'filtra por rótulo' },
      { cmd: 'kubectl delete -f arquivo.yaml', note: 'remove o que o arquivo criou' },
    ],
    handsOn: [
      'Salve o YAML acima como meu-pod.yaml e aplique com kubectl apply -f meu-pod.yaml.',
      'Rode kubectl get pods --show-labels e observe os dois labels na última coluna.',
      'Rode kubectl get pods -l app=myapp e depois kubectl get pods -l app=outra-coisa. Observe: o primeiro encontra o pod, o segundo retorna vazio. Etiqueta certa, carro encontrado; etiqueta errada, garagem vazia.',
      'Adicione um label em tempo real: kubectl label pod meu-pod time=devops e confirme com --show-labels.',
      'NÃO delete o pod: ele será o alvo do Service na próxima etapa. (Se deletou, é só aplicar o YAML de novo. Essa é a graça do declarativo: a folha de especificação remonta o carro idêntico.)',
    ],
    tip: 'Labels = seleção operacional (o K8s usa). Annotations = documentação (humanos usam). Autor de um Pod? Annotation. Agrupar Pods de uma app? Label. Etiqueta FIA vs. caderno de debrief.',
    takeaway: 'Todo objeto K8s é apiVersion + kind + metadata + spec, a folha de especificação do carro; e labels são a etiqueta FIA pela qual tudo no cluster encontra tudo.',
    outro: 'Que setor limpo, senhoras e senhores! Esqueleto de YAML no bolso, etiquetas dominadas. E repara que o guia armou a jogada: esse label app: myapp que ficou vivo na pista é a ultrapassagem preparada da próxima etapa. Vamos para o pit box!',
  },

  {
    id: 'm4',
    num: '04',
    navTitle: 'Services & ConfigMap',
    tag: 'rede + configuração',
    title: 'Services: endereço fixo pra Pods que mudam',
    narration:
      'Volta 4 e o problema clássico do pit lane aparece: como achar um carro que muda de posição o tempo todo? Quem acompanha F1 sabe que endereço e procedimento no box não são detalhe. Christijan Albers que o diga, saindo do box em 2007 com a mangueira de combustível ainda pendurada. Endereço fixo e configuração fora do chassi: é disso que esta etapa vive.',
    lead: 'Lembra do fato nº 2 da Etapa 03? Pods são efêmeros: cada Pod novo nasce com um IP diferente. Tentar falar com eles pelo IP é como achar um carro pela posição na pista: na volta 12 ele está em P4, na volta 30 em P7. E tem o segundo problema: configuração dentro da imagem obriga a rebuildar a cada mudança. Um chassi novo toda vez que a mureta pede meio grau a mais de asa.',
    concept: [
      'Problema 1 → Service. O Service é o pit box da equipe: a posição do box no pit lane é fixa a temporada inteira: todo mundo sabe onde fica o box da Ferrari. Qual carro entra nele a cada volta muda (o de Leclerc, o de Hamilton, um chassi montado ontem), e quem precisa do box não se importa: o endereço é o mesmo, e o box atende qualquer carro que carregue a etiqueta da equipe.',
      'O fluxo: uma requisição chega no Service (IP e nome fixos) → o Service seleciona os Pods pelo label selector (o mecanismo da Etapa 03, a etiqueta FIA de novo) → e distribui o tráfego de forma balanceada entre as réplicas saudáveis. O nome do Service vira um hostname interno do cluster: se o Service chama "auth-service", qualquer Pod acessa http://auth-service, mesmo que os Pods por trás troquem de IP mil vezes.',
      'Problema 2 → ConfigMap. O ConfigMap é a folha de set-up separada do chassi: asa, pressões, mapas. Nada disso é soldado no carro; está numa folha que os mecânicos aplicam antes do carro sair da garagem. Você guarda os valores num objeto central e injeta de 3 formas: variáveis de ambiente (a mais comum, via envFrom), arquivos montados (ótimo para configs longas) ou argumentos de linha de comando. Mudou a config? Atualiza o ConfigMap; a imagem continua a mesma. Meio grau de asa não exige chassi novo.',
    ],
    pointsTitle: 'Os 3 tipos de Service',
    points: [
      { t: 'ClusterIP (padrão)', d: 'IP interno, só dentro do cluster. O canal interno de rádio: só a equipe ouve. Use para comunicação entre serviços (ex.: API ↔ banco).', color: 'blue' },
      { t: 'NodePort', d: 'Porta fixa (30000–32767) aberta no nó. O portão de serviço numerado do autódromo, o jeito de expor algo no Minikube.', color: 'signal' },
      { t: 'LoadBalancer', d: 'Balanceador externo com IP público. A entrada oficial do autódromo, com bilheteria. É o tipo de produção na nuvem (AWS, GCP, Azure).', color: 'violet' },
    ],
    examplesTitle: 'Os YAMLs: repare no selector',
    examples: [
      {
        label: 'app.yaml (Service)',
        lang: 'yaml',
        code: `# app.yaml: salve o Service neste arquivo
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
      nodePort: 30080          # porta exposta no nó (só NodePort)`,
        note: 'O selector do Service casa com o label do Pod (app: myapp), exatamente o meu-pod que você criou na Etapa 03. É assim que ele sabe pra quem mandar o tráfego: o box lê a etiqueta do carro que está chegando.',
      },
      {
        label: 'configmap-pod.yaml',
        lang: 'yaml',
        code: `# configmap-pod.yaml: os dois objetos no mesmo arquivo, separados por ---
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

# Gera a URL de acesso (no Windows/Docker, deixe o terminal aberto: é um túnel)
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
    handsOn: [
      'Com o meu-pod da Etapa 03 rodando (label app: myapp), salve o YAML do Service como app.yaml e aplique.',
      'Rode minikube service meu-service --url e abra a URL no navegador e observe a página de boas-vindas do nginx. Você acessou um Pod efêmero por um endereço estável: encontrou o carro pelo box, não pela posição na pista.',
      'Teste o elo: delete o pod (kubectl delete pod meu-pod) e recarregue o navegador para ver o erro (box vazio, nenhum carro com a etiqueta da equipe). Recrie com kubectl apply -f meu-pod.yaml e recarregue: voltou, sem tocar no Service. O box nem se mexeu.',
      'Aplique o ConfigMap + pod (kubectl apply -f configmap-pod.yaml) e rode kubectl exec pod-config -- env e observe MENSAGEM e MODO na lista de variáveis. A folha de set-up foi aplicada no carro.',
    ],
    tip: 'Regra de ouro: exponha o mínimo. Banco de dados = ClusterIP (canal interno; estratégia de corrida não vaza no rádio aberto). Só a porta de entrada do sistema vira NodePort/LoadBalancer. Pra senhas e chaves, o irmão seguro do ConfigMap é o Secret: os mapas de motor que nem todo mecânico da própria equipe conhece.',
    takeaway: 'Service é o pit box: endereço fixo para carros (Pods) que mudam, achando-os pela etiqueta (label); ConfigMap é a folha de set-up, com a configuração fora do chassi (imagem).',
    outro: 'Setor no roxo! Pod acessado por endereço estável, configuração fora do chassi. E você ainda provou o elo deletando o carro e vendo o box impassível no mesmo lugar. Mas atenção, porque agora vem a curva que decide corrida: o que acontece quando o carro PARA na pista?',
  },

  {
    id: 'm5',
    num: '05',
    navTitle: 'Deployments',
    tag: 'auto-cura + escala',
    title: 'Auto-cura e escala: ReplicaSets e Deployments',
    narration:
      'É AQUI que separa os pontuadores do resto do grid! Hoje mesmo, volta 46, o carro da Red Bull calou e o Verstappen assistiu ao fim da prova do muro. Zero ponto. Em produção, o seu Pod único morrendo às 3h da manhã é exatamente essa cena. Auto-cura e caminho de volta: a etapa mais importante do guia começa AGORA.',
    lead: 'Até aqui você criou Pods na mão. Ótimo pra aprender, mas pense em Silverstone hoje: o Verstappen parou na volta 46 e acabou, porque não há substituto no meio da corrida. Em produção, seu único Pod morrendo de madrugada é isso: site fora do ar até alguém acordar. E quando lançar a 2.0, como trocar a versão sem derrubar o serviço? E se ela vier com um bug catastrófico, como voltar rápido?',
    concept: [
      'ReplicaSet: o chefe de equipe do número. Você declara "replicas: 3" e ele monitora os Pods pelo label selector (a etiqueta FIA, de novo!). Caiu um? Ele detecta que a contagem baixou e cria outro em segundos, sem você pedir. É a regra inegociável do chefe de equipe, o "N carros prontos, sempre": o piloto destrói o chassi no sábado, os mecânicos viram a madrugada e no domingo tem um carro inteiro no grid, remontado da especificação. É a auto-cura do Kubernetes, o "estado desejado" da Etapa 01 mantido de verdade.',
      'Aqui a analogia quebra, e vale registrar: na F1, a reposição só acontece entre sessões, e o regulamento limita cada equipe a 2 carros. O ReplicaSet não tem parc fermé nem regulamento: repõe o Pod em segundos, a qualquer hora, em qualquer quantidade. Pense no K8s como uma endurance sem limite de inscrições, em que a "madrugada dos mecânicos" dura trinta segundos.',
      'Deployment: o gestor de specs. Ele embrulha o ReplicaSet e adiciona o programa de desenvolvimento: Rolling Update (ao trocar a imagem, sobe réplicas novas e desliga as antigas gradualmente, e o serviço nunca fica fora do ar, como o upgrade que entra em um carro enquanto o outro segue com a spec antiga), Rollback (kubectl rollout undo volta pra anterior em segundos: o assoalho novo não anda, o carro volta com a spec anterior; a Ferrari chegou em Barcelona este ano com pacote novo e o Hamilton venceu, mas se o pacote piorasse o carro, voltavam pra spec de Mônaco sem drama) e escala manual (kubectl scale --replicas=5: cinco carros no grid).',
      'Os YAMLs de ReplicaSet e Deployment são quase idênticos, mas no dia a dia usamos quase sempre o Deployment, pelo controle de versão. Ninguém gerencia só o número de carros; gerencia-se o número E a spec de cada um. O Deployment cria e gerencia o ReplicaSet por baixo dos panos.',
    ],
    pointsTitle: 'O que cada um garante',
    points: [
      { t: 'ReplicaSet', d: 'N réplicas rodando SEMPRE. Caiu uma, nasce outra em segundos: a madrugada dos mecânicos comprimida. Seleção por label selector.', color: 'blue' },
      { t: 'Rolling Update', d: 'Troca de versão gradual: sobe as novas, desliga as antigas. Zero downtime: upgrade introduzido em um carro por vez.', color: 'signal' },
      { t: 'Rollback', d: 'A versão nova quebrou? kubectl rollout undo restaura a anterior em segundos, de volta pra spec que funcionava.', color: 'ember' },
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
        note: 'Repare: o template é literalmente o esqueleto de Pod da Etapa 03, embutido no Deployment. Nada aqui é novo, é composição: a folha de especificação do carro, anexada à ordem do chefe de equipe ("três carros desta spec, sempre").',
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
        note: 'O K8s só desliga os Pods antigos quando os novos ficam prontos. Como a imagem quebrada nunca fica pronta, os antigos seguram o serviço no ar: os carros de spec antiga continuam pontuando enquanto a spec nova não passa nem do crash test.',
      },
    ],
    commands: [
      { cmd: 'kubectl scale deployment <nome> --replicas=5', note: 'escala manual' },
      { cmd: 'kubectl set image deployment/<nome> ctn=img:tag', note: 'dispara rolling update' },
      { cmd: 'kubectl rollout status deployment/<nome>', note: 'acompanha a troca' },
      { cmd: 'kubectl rollout history deployment/<nome>', note: 'lista revisões' },
      { cmd: 'kubectl rollout undo deployment/<nome>', note: 'rollback!' },
    ],
    handsOnIntro: 'O momento que as arquibancadas esperavam: o pit stop do guia. Mas aqui, diferente da troca de pneus, pressa é inimiga: o valor do exercício está em OBSERVAR cada estado mudando no terminal. Calma e olhos abertos.',
    handsOn: [
      'Aplique o deployment.yaml e confirme os 3 pods Running: três carros na pista, mesma spec.',
      'Delete um pod na mão (copie um nome real do kubectl get pods) e rode kubectl get pods de novo, rápido, e observe o substituto em ContainerCreating. Você tentou violar o estado desejado e o cluster corrigiu.',
      'Rode o rolling update para nginx:1.16.1 e acompanhe com kubectl rollout status e observe a mensagem de sucesso. Upgrade introduzido carro a carro, ninguém saiu da pista.',
      'Quebre de propósito com a imagem nginx:nao-existe e observe no kubectl get pods os pods antigos Running segurando o serviço e os novos em ImagePullBackOff.',
      'Execute kubectl rollout undo deployment/nginx-fiap e confirme com kubectl rollout history e observe as revisões listadas. Você fez um rollback de produção em um comando: voltou pra spec da classificação sem perder a corrida.',
    ],
    tip: 'Faça o teste da auto-cura pelo menos uma vez: matar um pod e ver o substituto nascer: a madrugada dos mecânicos comprimida em segundos. É o momento em que o Kubernetes "clica" na cabeça.',
    takeaway: 'Ninguém cria Pod avulso em produção, porque carro sem equipe não termina corrida: o Deployment garante N réplicas (auto-cura), troca specs sem tirar ninguém da pista (rolling update) e volta pra spec anterior em um comando (rollback).',
    outro: 'E o público de pé nas arquibancadas! Você MATOU um Pod e o cluster o remontou antes do replay terminar. Setor decisivo completado no verde. Agora, a pergunta que assombra qualquer equipe de ponta: e os DADOS?',
  },

  {
    id: 'm6',
    num: '06',
    navTitle: 'Volumes',
    tag: 'persistência de dados',
    title: 'Volumes: dados que sobrevivem ao Pod',
    narration:
      'Entramos no setor de alta velocidade e no assunto que não aparece nos highlights, mas ganha campeonatos: dados. A Williams dominou os anos 90 porque transformava telemetria em desenvolvimento antes de todo mundo. Carro se desmonta; histórico, jamais. Etapa 06 valendo.',
    lead: 'Pods são efêmeros, e a Etapa 05 deixou isso radical, com pods morrendo e nascendo em rolling updates. Ótimo pro app, catastrófico pra dados: o carro que correu hoje será desmontado até o monocoque, mas os gigabytes de telemetria já estão na fábrica antes do piloto tirar o capacete. Se o Pod do PostgreSQL for recriado num update, todos os pedidos da Black Friday somem junto. Dados de verdade não podem viver no filesystem de um container.',
    concept: [
      'O Kubernetes resolve isso com uma cadeia de 4 conceitos: Volume, PersistentVolume (PV), PersistentVolumeClaim (PVC) e StorageClass (SC). Memorize pela operação de dados da equipe: o PVC é a REQUISIÇÃO do engenheiro de dados ("preciso de 1Gi, leitura e escrita por um nó"); o PV é o STORAGE físico da fábrica que atende a requisição (NFS, EBS da AWS, hostPath...); a StorageClass é o CATÁLOGO de tipos de storage (o servidor trackside rápido? o datacenter da fábrica?).',
      'O Pod só referencia o PVC: o carro não sabe (nem precisa saber) em qual rack da fábrica a telemetria dele está guardada. Essa separação é o que permite o mesmo YAML rodar no Minikube e na AWS, assim como o mesmo procedimento de dados funciona em Interlagos e em Suzuka. No Minikube, a StorageClass "standard" já provisiona PVs automaticamente: você faz a requisição (PVC) e o storage (PV) aparece.',
      'Modos de acesso do PVC (quem pode montar o volume): ReadWriteOnce (leitura e escrita por UM nó, o caso típico de banco de dados; só a garagem da equipe escreve nos próprios dados), ReadOnlyMany (só leitura, vários nós, para assets estáticos; como o feed de timing da FIA: todas as equipes leem, ninguém altera) e ReadWriteMany (leitura e escrita por vários nós; precisa de NFS ou similar).',
    ],
    pointsTitle: 'A cadeia de armazenamento',
    points: [
      { t: 'emptyDir', d: 'Vive e morre com o Pod. O quadro branco da garagem: anotações da sessão, apagadas quando o fim de semana acaba. Pra dado temporário e compartilhamento entre containers do Pod.', color: 'signal' },
      { t: 'hostPath', d: 'Monta diretório do NÓ no container. O caixote de frete daquele circuito: dev ok; produção, cuidado (amarra o Pod ao nó).', color: 'ember' },
      { t: 'PVC → PV', d: 'A requisição (Claim) casa com o storage (Volume). Dados sobrevivem à morte do Pod: a telemetria na fábrica.', color: 'blue' },
      { t: 'StorageClass', d: 'O catálogo: provisiona PVs automaticamente por perfil. No Minikube, a classe "standard" já faz isso.', color: 'violet' },
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
        note: 'É o carro desmontado depois da corrida e a telemetria intacta na fábrica: o chassi novo de Spa nasce já com todo o histórico de Silverstone disponível.',
      },
    ],
    commands: [
      { cmd: 'kubectl get pvc', note: 'pedidos de volume (Bound = ok)' },
      { cmd: 'kubectl get pv', note: 'discos persistentes do cluster' },
      { cmd: 'kubectl delete pvc <nome>', note: 'remove o pedido (e libera o disco)' },
    ],
    handsOn: [
      'Aplique o PVC e rode kubectl get pvc. Observe o STATUS Bound: sua requisição foi atendida por um PV criado automaticamente (confirme com kubectl get pv).',
      'Execute a sequência completa do exemplo: escrever o arquivo → deletar o pod → recriar o pod → ler o arquivo. Observe o "sobrevivi!" voltar. Esse é o contrato do PVC: o carro morre, a telemetria fica.',
      'Experimento extra (o contraste que ensina): repita o teste trocando o volume por emptyDir e, ao recriar o Pod, o arquivo terá sumido. Essa é a diferença entre o quadro branco da garagem e o servidor da fábrica, sentida na prática.',
    ],
    tip: 'Dado importante SEMPRE em PVC. Se os dados sumiram após um restart, aposto que estavam em emptyDir ou no filesystem do container: alguém anotou a estratégia da corrida no quadro branco e a faxina passou.',
    takeaway: 'PVC é a requisição, PV é o storage, StorageClass é o catálogo. E dado que importa mora sempre atrás de um PVC: o carro é desmontado, a telemetria nunca.',
    outro: '"SOBREVIVI!" E o arquivo voltou! O carro foi desmontado até o monocoque e a telemetria estava lá, intacta, na fábrica. Setor no verde. Mas segura na cadeira, porque agora vem a pegadinha mais traiçoeira do circuito: o carro que anda... mas não anda.',
  },

  {
    id: 'm7',
    num: '07',
    navTitle: 'Probes',
    tag: 'saúde do app',
    title: 'Probes: como o cluster sabe que seu app está vivo',
    narration:
      'Atenção que esta curva é CEGA! Hoje, em Silverstone, o mundo inteiro viu: Antonelli largou na pole, cravou 1:31.777 (a volta mais rápida da prova) e cruzou a linha em DÉCIMO SEXTO. Cinquenta e duas voltas na pista, e nada saudável. E os mais antigos lembram de Senna em Interlagos, 1991: o carro andava, mas só restava a sexta marcha. É exatamente esse buraco que as probes fecham.',
    lead: 'O Antonelli esteve na pista, rodando, as 52 voltas, e mesmo assim algo claramente não estava saudável. No cluster é idêntico: seu app entra em deadlock às 3h da manhã, o processo continua de pé (pro Kubernetes está tudo Running), mas nenhuma requisição é respondida. A auto-cura da Etapa 05 só recria pods que MORREM; ela não enxerga pods vivos porém travados: o carro que anda, mas não anda.',
    concept: [
      'As probes são verificações de saúde declaradas no manifesto do Pod. É a telemetria + o radio check: a equipe não confia no fato de o carro estar se movendo. Ela verifica canais específicos em intervalos regulares: pressão de óleo, temperatura da PU, resposta do piloto no rádio. Não basta o carro estar na pista; ele precisa responder aos estímulos.',
      'Como a probe verifica (3 mecanismos): httpGet (o kubelet faz um GET num endpoint tipo /health e espera 200 OK; é o mais comum, o radio check: "me dá um ok, piloto"), tcpSocket (testa se a porta aceita conexão, pra serviços que não falam HTTP; a portadora do rádio abre, mesmo sem conversa) e exec (executa um comando dentro do container; código de saída 0 = saudável, o mecânico plugando o laptop e rodando o diagnóstico).',
      'Boas práticas da aula: use as três probes juntas em produção; use endpoints diferentes pra cada probe (canais de telemetria separados; pressão de óleo não se mede no sensor de freio); comece pelas configurações padrão e ajuste intervalos só quando o app pedir; monitore as falhas de probe (ex.: com Prometheus), porque elas são o primeiro sinal de problema, como aquele tremor na telemetria duas voltas antes de a peça quebrar.',
    ],
    pointsTitle: 'As 3 probes e o que acontece na falha',
    points: [
      { t: 'Liveness', d: '"Está vivo?" Falhou → o Pod é REINICIADO. O "faça o ciclo completo: desliga e liga o carro". Pra apps que travam e só voltam com restart.', color: 'ember' },
      { t: 'Readiness', d: '"Pronto pra tráfego?" Falhou → SAI do balanceador, sem restart. O semáforo vermelho do box: segurado na garagem, ninguém o desmonta. Pra apps que carregam dados antes.', color: 'signal' },
      { t: 'Startup', d: '"Terminou de subir?" Enquanto roda, SEGURA as outras. O fire-up da PU: ninguém cobra tempo de volta com motor frio. Pra apps lentos no boot.', color: 'violet' },
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
        periodSeconds: 30`,
        note: 'Este YAML é ilustrativo: a imagem exemplo:latest é fictícia. O experimento executável está na aba seguinte.',
      },
      {
        label: 'liveness-exec.yaml',
        lang: 'yaml',
        code: `# liveness-exec.yaml: a sabotagem é um busybox que cria /tmp/healthy,
# vive 30s "saudável", apaga o arquivo e a probe passa a falhar.
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
        periodSeconds: 5           # verifica a cada 5s`,
        note: 'É um sensor de pressão de óleo sabotado de propósito: 30 segundos de leitura boa e depois silêncio na telemetria.',
      },
      {
        label: 'assista ao restart',
        lang: 'sh',
        code: `$ kubectl apply -f liveness-exec.yaml

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
        note: 'Linha do tempo: 30s saudável → arquivo apagado → 3 falhas seguidas (o padrão do failureThreshold; a mureta também não manda resetar o carro na primeira leitura ruim, confirma três vezes) → kubelet reinicia. Como o script recomeça, o ciclo repete pra sempre, de propósito, pra você ver.',
      },
    ],
    commands: [
      { cmd: 'kubectl get pods -w', note: 'assiste mudanças em tempo real' },
      { cmd: 'kubectl describe pod <nome>', note: 'Events mostram as falhas de probe' },
    ],
    handsOn: [
      'Aplique o liveness-exec.yaml e rode kubectl get pods -w e observe a coluna RESTARTS subir sozinha a cada ~35-45s. Cada incremento é o kubelet mandando o "desliga e liga o carro" pra um Pod que parou de responder na telemetria.',
      'Em outro terminal, rode kubectl describe pod liveness-exec e observe nos Events o par Warning Unhealthy + Normal Killing. Aprenda a reconhecer essa dupla: em produção, ela é o diagnóstico de probe falhando.',
      'Limpe: kubectl delete pod liveness-exec.',
    ],
    tip: 'Running NÃO significa saudável. O Antonelli rodou as 52 voltas de Silverstone com pole e volta mais rápida no bolso, e terminou em P16. Carro na pista não é carro competitivo; processo de pé não é app funcionando. É exatamente por isso que as probes existem.',
    takeaway: 'Liveness falhou = desliga e liga o carro (reinicia); Readiness falhou = semáforo vermelho do box (sai do balanceador sem reiniciar); Startup = fire-up da PU (segura as duas até o app terminar de aquecer).',
    outro: 'RESTARTS subindo sozinho na tela: você sabotou o sensor e viu a mureta mandar o reset, três leituras confirmadas, sem pânico. Poucos setores ensinam tanto com tão pouco YAML. E agora, a reta final do circuito: o cluster vai aprender a pilotar sozinho.',
  },

  {
    id: 'm8',
    num: '08',
    navTitle: 'Autoscaling (HPA)',
    tag: 'escala automática',
    title: 'HPA: escala automática baseada em métricas',
    narration:
      'ÚLTIMA ETAPA, bandeirada à vista! E que fecho de prova: a mureta assumindo a estratégia em tempo real. Foi assim que Ross Brawn venceu a Hungria em 1998, com Schumacher voando e uma estratégia de três paradas recalculada com a corrida em andamento. Hoje, quem lê e reage é o HPA, e o ciclo do estado desejado, aberto lá na Etapa 01, se fecha diante dos seus olhos.',
    lead: 'Volte ao problema da Etapa 01: a demanda explode no domingo da corrida. Você já sabe escalar na mão (kubectl scale, Etapa 05), mas vai ficar de plantão no terminal ajustando réplicas a cada pico? Às 2h da manhã também? Nenhuma mureta funciona assim: a estratégia reage à corrida em tempo real, com base em telemetria. O ciclo precisa se fechar: o cluster deve medir a carga e escalar sozinho.',
    concept: [
      'O Horizontal Pod Autoscaler (HPA) monitora métricas dos Pods (CPU, memória...) e ajusta o número de réplicas entre um mínimo e um máximo que você define. É a mureta de estratégia com poder de alinhar mais carros conforme a carga da corrida, lembrando o combinado da Etapa 05: aqui a F1 trava em 2 carros, então pense numa endurance sem limite de inscrições. O ritmo apertou além do alvo → alinha mais carros (até o teto); a corrida acalmou → recolhe gradualmente.',
      'O funcionamento: o HPA compara a utilização dos Pods com o alvo configurado (ex.: manter a média de CPU em 70%). Passou → cria réplicas (até o máximo). Caiu → remove (até o mínimo), economizando recurso. O scale down é propositalmente lento (~5min de estabilidade) pra não ficar "pistonando" com variações rápidas. É a mesma razão pela qual a mureta não muda a estratégia a cada nuvem no radar: espera o padrão se confirmar, sem desmontar a operação no primeiro safety car.',
      'Métricas suportadas: CPU (a mais comum), memória, métricas personalizadas do app (requisições/s, fila), métricas externas (ex.: Prometheus) e E/S de disco. A métrica certa depende do perfil do app, como escolher a estratégia pelo que o carro degrada: pneu em Barcelona, freio em Montreal.',
      'Dois pré-requisitos que pegam todo mundo: (1) o cluster precisa do metrics-server pra ler CPU/memória. No Minikube: minikube addons enable metrics-server. Sem sensores no carro, a mureta não enxerga nada. (2) O container PRECISA declarar resources.requests.cpu, porque "70% de CPU" significa 70% DO QUE O POD PEDIU, como a alocação de energia do ERS por volta: "usei 70%" só faz sentido contra uma alocação declarada. Sem requests, o HPA mostra <unknown> e não escala.',
    ],
    pointsTitle: 'O que o HPA entende',
    points: [
      { t: 'CPU / Memória', d: 'As métricas clássicas. % calculada sobre o resources.requests do container: o percentual da alocação declarada, nunca um número absoluto solto.', color: 'blue' },
      { t: 'Métricas custom', d: 'Do seu app (req/s, fila) ou externas (Prometheus). Pra escalar pelo que importa, porque cada pista degrada uma coisa diferente.', color: 'violet' },
      { t: 'min / max', d: 'Você sempre define o piso e o teto de réplicas. O HPA trabalha dentro da faixa, como a estratégia dentro do regulamento.', color: 'signal' },
    ],
    examplesTitle: 'Deployment + HPA + Service + teste de carga',
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
        label: 'service.yaml',
        lang: 'yaml',
        code: `# service.yaml: pro gerador de carga achar o app pelo nome
# (o pit box com endereço fixo da Etapa 04, agora no canal interno)
apiVersion: v1
kind: Service
metadata:
  name: nginx-hpa              # hostname interno usado pelo gerador
spec:
  type: ClusterIP              # só tráfego interno (regra de ouro da Etapa 04)
  selector:
    app: nginx-hpa             # casa com o label dos pods do Deployment
  ports:
    - port: 80
      targetPort: 80`,
      },
      {
        label: 'gerando carga e assistindo escalar',
        lang: 'sh',
        code: `# Pré-requisito: metrics-server
$ minikube addons enable metrics-server

$ kubectl apply -f deployment.yaml -f hpa.yaml -f service.yaml

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
        note: 'Plano B se o TARGETS não passar de 70% (o nginx estático é eficiente demais): rode 2-3 geradores em paralelo (gerador2, gerador3), reduza requests.cpu pra "50m", ou troque a imagem por registry.k8s.io/hpa-example, o php-apache do tutorial oficial, que queima CPU a cada requisição. Em produção, K6 e JMeter fazem esse teste de forma controlada.',
      },
    ],
    commands: [
      { cmd: 'minikube addons enable metrics-server', note: 'pré-requisito do HPA' },
      { cmd: 'kubectl get hpa -w', note: 'assiste o HPA reagir à carga' },
      { cmd: 'kubectl top pods', note: 'CPU/memória por pod' },
      { cmd: 'kubectl autoscale deployment <n> --cpu-percent=70 --min=1 --max=10', note: 'cria HPA imperativo' },
    ],
    handsOnIntro: 'Volta rápida final do fim de semana, com todos os setores juntos numa tacada só:',
    handsOn: [
      'Ative o metrics-server e aplique os três YAMLs (Deployment, HPA, Service). Rode kubectl get hpa e observe os targets: se aparecer <unknown>, aguarde ~1min (sensor recém-instalado não dá dado antes da primeira volta).',
      'Suba o gerador de carga num terminal e kubectl get hpa -w em outro, e observe o percentual de CPU disparar acima de 70% e a coluna REPLICAS subir. Se estacionar abaixo do alvo, use o plano B da aba de carga. Confirme com kubectl get pods: pods novos nasceram sem nenhum comando seu, e a mureta alinhou carros sozinha, lendo a telemetria.',
      'Pare a carga (Ctrl+C) e continue assistindo: as réplicas demoram ~5min pra encolher. Essa lentidão é proposital (ninguém desmonta a garagem no primeiro momento de calmaria).',
      'Use kubectl top pods durante o teste pra ver a métrica crua que alimenta o HPA, a telemetria antes da decisão de estratégia.',
    ],
    tip: 'kubectl get hpa mostrando <unknown> nos targets? Ou o metrics-server não está ativo, ou o container não declarou resources.requests. São as duas causas, sempre: ou o sensor está desligado, ou ninguém declarou a alocação de referência.',
    takeaway: 'HPA = estado desejado aplicado à escala: você define alvo, piso e teto, e a mureta faz o resto. Mas sem metrics-server (sensores) e sem resources.requests (alocação declarada) ele não enxerga nada.',
    outro: 'E o cluster ESCALOU SOZINHO, senhoras e senhores! Réplicas subindo na tela sem um comando sequer, e o ciclo se fechou: você declara o alvo, a mureta faz a corrida. As oito etapas oficiais terminam aqui. Mas antes da volta de desaceleração, o box chama mais uma vez: pegar tudo isso, separado, e montar o carro inteiro, de verdade, com uma imagem de produção. Etapa bônus, comigo.',
  },

  {
    id: 'm9',
    num: '09',
    navTitle: 'Exemplo profissional',
    tag: 'capstone · docker hub real',
    title: 'O exemplo profissional: tudo aplicado numa imagem real do Docker Hub',
    narration:
      'Bandeira quadriculada não é fim de temporada, é fim de UMA corrida. O que separa o campeão do resto do grid é o que acontece depois: o debrief, onde cada peça testada isolada no fim de semana vira o carro completo que corre a temporada inteira. Esta é a etapa bônus, fora da grade oficial das 8 aulas: pegar as oito peças que você calibrou sozinhas e montar o carro pra valer.',
    lead: 'As oito etapas anteriores usaram o nginx de propósito: uma imagem simples, sem ruído, pra você aprender a mecânica de cada peça sem distração. Só que nenhuma equipe manda pra pista um carro que nunca rodou inteiro. Esta etapa pega ConfigMap, Deployment, Service e HPA e monta um deployment do jeito que ele existe de verdade: um único app real, o stefanprodan/podinfo, direto do Docker Hub, com endpoints de saúde de verdade em vez do YAML ilustrativo da Etapa 07.',
    concept: [
      'O podinfo (docker.io/stefanprodan/podinfo) é um projeto open source feito, de propósito, pra ser cutucado: expõe /healthz e /readyz de verdade (nada de imagem fictícia como o pod-com-probes.yaml da Etapa 07), aceita configuração por variável de ambiente (PODINFO_UI_MESSAGE, PODINFO_UI_COLOR, injetadas pelo mesmo ConfigMap da Etapa 04) e ainda tem um endpoint /panic que derruba o processo de propósito: dá pra testar liveness numa aplicação de verdade, sem precisar sabotar um busybox com sleep e rm como na Etapa 07.',
      'Os quatro arquivos abaixo se encaixam pelo mesmo fio que costurou o guia inteiro: o label app: podinfo (a etiqueta FIA, Etapa 03). O ConfigMap injeta variáveis via envFrom (Etapa 04); o Deployment declara 3 réplicas com resources.requests (obrigatório pro HPA, Etapa 08) e as duas probes que fazem sentido pra um app rápido de subir: liveness em /healthz, readiness em /readyz (Etapa 07); o Service é NodePort porque aqui o podinfo É o ponto de entrada, a regra de ouro da Etapa 04; e o HPA lê a mesma CPU declarada no Deployment pra escalar entre 2 e 8 réplicas (Etapa 08).',
      'Repare no que NÃO entrou: nem toda peça aprendida cabe em todo carro. O startupProbe (Etapa 07) ficou de fora porque o podinfo sobe em frações de segundo. Usar uma peça só porque ela existe no manual não é engenharia, é enfeite, e enfeite pesa o carro à toa.',
      'E o PVC da Etapa 06? De propósito, também fora do Deployment, e o motivo é técnico, não estético: aquele PVC usa ReadWriteOnce, e só uma réplica por vez consegue montar direito um volume assim. Colar o mesmo volumes.persistentVolumeClaim num Deployment com replicas: 3 é um erro clássico de quem decorou o YAML sem entender o porquê: no Minikube (um nó só) o acidente pode até subir sem reclamar, mas num cluster de produção multi-nó as réplicas extras ficam presas em FailedAttachVolume, brigando pelo mesmo disco. Se este app precisasse mesmo de estado persistente, a resposta certa seria um cache compartilhado de verdade (o próprio podinfo tem a flag --cache-server pra falar com um Redis) ou, pra estado por réplica, um StatefulSet com volumeClaimTemplates, um PVC próprio por carro, assunto do módulo avançado. A Etapa 06 continua 100% válida: ela é a resposta certa pro cenário dela (um Pod só, tipo banco de dados), não pra este.',
    ],
    pointsTitle: 'Cada peça, na etapa que ensinou ela',
    points: [
      { t: 'ConfigMap → env vars', d: 'Etapa 04: injeta PODINFO_UI_MESSAGE e PODINFO_UI_COLOR via envFrom. Muda a config, não a imagem.', color: 'blue' },
      { t: 'Deployment → 3 réplicas', d: 'Etapa 05: auto-cura de verdade, já pronto pra um rolling update no dia em que a imagem trocar.', color: 'signal' },
      { t: 'Probes → healthz/readyz reais', d: 'Etapa 07: liveness e readiness batendo num app de verdade, sem YAML ilustrativo.', color: 'ember' },
      { t: 'Service → NodePort', d: 'Etapa 04: aqui o podinfo é o ponto de entrada, então expõe; um banco atrás dele seria ClusterIP.', color: 'violet' },
      { t: 'HPA → 2 a 8 réplicas', d: 'Etapa 08: escala pela mesma CPU declarada no resources.requests do Deployment.', color: 'blue' },
      { t: 'PVC → explicado, não copiado', d: 'Etapa 06: fica de fora do Deployment de propósito (RWO não serve réplica múltipla); a etapa continua certa pro cenário dela.', color: 'signal' },
    ],
    examplesTitle: 'Os 4 manifestos de produção + o teste completo',
    examples: [
      {
        label: 'configmap.yaml',
        lang: 'yaml',
        code: `# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: podinfo-config
data:
  PODINFO_UI_MESSAGE: "olá do pitstop.dev!"   # aparece na tela do app
  PODINFO_UI_COLOR: "#34d399"                 # cor do banner na UI`,
        note: 'Mesmo mecanismo da Etapa 04 (envFrom), só que aqui as chaves são variáveis que o podinfo realmente lê pra montar a própria interface (confirmado no chart oficial do projeto).',
      },
      {
        label: 'deployment.yaml',
        lang: 'yaml',
        code: `# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: podinfo
spec:
  replicas: 3                        # auto-cura de verdade, Etapa 05
  selector:
    matchLabels:
      app: podinfo
  template:
    metadata:
      labels:
        app: podinfo                 # casa com o selector ↑ e com o Service
    spec:
      containers:
        - name: podinfo
          image: stefanprodan/podinfo:6.14.1  # imagem real do Docker Hub, versão fixa (nunca "latest" em produção)
          ports:
            - containerPort: 9898
          envFrom:                   # injeta o ConfigMap inteiro (Etapa 04)
            - configMapRef:
                name: podinfo-config
          resources:                 # obrigatório pro HPA calcular %, Etapa 08
            requests:
              cpu: "100m"
              memory: "64Mi"
            limits:
              cpu: "200m"
              memory: "128Mi"
          livenessProbe:             # "está vivo?" falhou → reinicia, Etapa 07
            httpGet:
              path: /healthz
              port: 9898
            periodSeconds: 10
            failureThreshold: 3
          readinessProbe:            # "pronto pro tráfego?" falhou → sai do Service
            httpGet:
              path: /readyz
              port: 9898
            periodSeconds: 5`,
        note: 'Sem startupProbe e sem volumes, de propósito: veja o porquê no texto acima. Um manifesto profissional declara o que o app precisa, não tudo que o curso ensinou.',
      },
      {
        label: 'service.yaml',
        lang: 'yaml',
        code: `# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: podinfo
spec:
  type: NodePort                # ponto de entrada aqui = regra de ouro da Etapa 04
  selector:
    app: podinfo                 # acha os Pods pela etiqueta, sempre
  ports:
    - port: 9898
      targetPort: 9898
      nodePort: 30898`,
      },
      {
        label: 'hpa.yaml',
        lang: 'yaml',
        code: `# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: podinfo
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: podinfo
  minReplicas: 2                 # produção não desce de 2, nem sem carga
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70`,
      },
      {
        label: 'apply + teste de produção',
        lang: 'sh',
        code: `# Aplica os 4 manifestos de uma vez
$ kubectl apply -f configmap.yaml -f deployment.yaml -f service.yaml -f hpa.yaml
configmap/podinfo-config created
deployment.apps/podinfo created
service/podinfo created
horizontalpodautoscaler.autoscaling/podinfo created

# Espere as 3 réplicas Running e o HPA sair de <unknown>
$ kubectl get pods,hpa

# Abre a UI de verdade: mensagem e cor vêm do ConfigMap
$ minikube service podinfo --url
http://127.0.0.1:53412   ← recarregue: o hostname muda a cada request (Service balanceando 3 réplicas)

# Pegadinha de produção: editar o ConfigMap NÃO reinicia os Pods sozinho
$ kubectl edit configmap podinfo-config
$ kubectl exec deploy/podinfo -- env | grep MESSAGE
PODINFO_UI_MESSAGE=olá do pitstop.dev!   ← ainda o valor ANTIGO

$ kubectl rollout restart deployment/podinfo
deployment.apps/podinfo restarted   ← só agora os Pods leem o valor novo

# Liveness de verdade: o /panic derruba o processo, sem sabotagem de busybox
$ kubectl exec deploy/podinfo -- curl -s localhost:9898/panic
$ kubectl get pods -w
podinfo-7f9c6d-abc   1/1   Running   1 (4s ago)   ← reiniciou sozinho (Etapa 07)

# Readiness de verdade: desliga o /readyz sem matar o processo
$ kubectl exec deploy/podinfo -- curl -s -X POST localhost:9898/readyz/disable
$ kubectl get endpoints podinfo
podinfo   10.244.0.5:9898,10.244.0.6:9898   ← o pod que desligou sumiu da lista`,
        note: 'curl, não wget: é o que a imagem oficial do podinfo instala (Alpine + curl). Se o /panic não derrubar de primeira, repita: a resposta às vezes chega fragmentada antes do processo morrer de verdade.',
      },
    ],
    commands: [
      { cmd: 'kubectl apply -f a.yaml -f b.yaml -f c.yaml -f d.yaml', note: 'aplica vários manifestos de uma vez' },
      { cmd: 'kubectl rollout restart deployment/<nome>', note: 'força os Pods a lerem um ConfigMap que mudou' },
      { cmd: 'kubectl exec deploy/<nome> -- <comando>', note: 'executa num Pod do Deployment sem saber o nome exato' },
      { cmd: 'kubectl get endpoints <service>', note: 'quem está de fato recebendo tráfego agora (afeta readiness)' },
    ],
    handsOnIntro: 'A curva final do guia bônus: monte tudo, quebre tudo de propósito, prove que entendeu.',
    handsOn: [
      'Salve os quatro YAMLs (configmap.yaml, deployment.yaml, service.yaml, hpa.yaml) e aplique com um único kubectl apply apontando pros quatro arquivos.',
      'Rode kubectl get pods,hpa até ver 3/3 Running e o HPA com um valor de CPU real (não <unknown>). Se travar, confirme que o metrics-server da Etapa 08 continua ativo.',
      'Abra minikube service podinfo --url no navegador e recarregue algumas vezes: observe o hostname mudar. É o mesmo Service da Etapa 04, agora balanceando três réplicas de verdade.',
      'Reproduza a pegadinha do ConfigMap: edite a mensagem, confirme que kubectl exec ... env ainda mostra o valor antigo, e só depois rode kubectl rollout restart deployment/podinfo. Confirme a mudança de novo.',
      'Derrube a liveness de propósito com curl .../panic e acompanhe kubectl get pods -w até ver o RESTARTS subir sozinho, sem você reiniciar nada na mão.',
      'Desligue a readiness com curl -X POST .../readyz/disable e confirme com kubectl get endpoints podinfo que aquele Pod saiu da lista, sem reiniciar: o semáforo vermelho do box, agora num app real.',
      'Feche gerando carga como na Etapa 08 (o mesmo gerador busybox contra http://podinfo:9898) e observe o HPA escalar este Deployment sozinho.',
    ],
    tip: 'A pegadinha do ConfigMap pega todo time júnior pelo menos uma vez: editar o ConfigMap não reinicia nada sozinho (a não ser que exista um sidecar tipo Reloader cuidando disso). Em produção, o comando depois de aplicar uma config nova quase sempre é kubectl rollout restart deployment/<nome>.',
    takeaway: 'Um manifesto profissional não é a soma de tudo que você aprendeu: é a escolha do que o app precisa (ConfigMap, réplicas, probes reais, Service, HPA) e a recusa consciente do que não precisa (startupProbe num app rápido, PVC num Deployment escalado). Entender o porquê de cada peça, inclusive das que ficam de fora, é a diferença entre decorar YAML e projetar sistema.',
    outro: 'Voltou pro pit lane, encostou, motor desligado. Nove etapas depois (oito da grade oficial e este pit stop bônus), o simulador virou experiência de garagem de verdade: você montou, quebrou e curou um app real, com uma imagem de produção puxada do Docker Hub. O campeonato oficial (as 8 aulas de Thiago Adriano) fecha aqui. A pista continua aberta: cada plataforma abaixo é um novo treino livre.',
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
    desc: 'O lendário roteiro do Kelsey Hightower: montar um cluster peça por peça, na unha, sem instaladores. É o "monte o carro parafuso por parafuso": quem faz, nunca mais olha a garagem do mesmo jeito.',
    goodFor: 'Nível avançado, quando quiser entender o que o Minikube esconde de você.',
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
