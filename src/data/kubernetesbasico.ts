// Conteúdo das 8 etapas base (aulas 1-8, Thiago Adriano / FIAP) + 1 etapa bônus de
// aplicação profissional.
// A lente geral de F1 abre o guia (LENS) e cada etapa ensina o tópico só de forma técnica,
// sem repetir a analogia.
// Gerado de relatorios/kubernetes-basico/final.md por scripts/build-lens-guide.py.
// Para mudar o texto, edite o markdown e gere de novo; o markdown inline (`código`, **negrito**)
// é renderizado pelo LensKit.

import type { ChecklistGroup, GuideLens, TechLesson } from "@/components/guide/LensKit";

export type Lesson = TechLesson;

export const INTRO: string[] = [
  "Este guia ensina Kubernetes do zero, em oito etapas e um bônus, com todos os exercícios rodando em um cluster Minikube na sua máquina. Você começa entendendo por que um orquestrador existe e como conversar com o cluster pelo kubectl; depois estuda a anatomia do cluster e os Pods, Services e ConfigMaps, ReplicaSets e Deployments, volumes persistentes, probes e o HPA. Na etapa bônus, junta essas peças em um deployment de uma imagem real do Docker Hub e decide quais delas o app precisa e quais ficam de fora. Antes das etapas, a seção seguinte apresenta a lente de F1 do guia: uma comparação geral que mostra o mesmo sistema funcionando dentro de uma equipe de Fórmula 1.",
  'Cada etapa só depende do que foi explicado antes dela e traz um exercício pequeno que prova que você entendeu. Kubernetes se aprende executando e errando de propósito, então não pule os blocos "Mão na massa".',
  "**Como usar este guia:** mantenha um terminal aberto ao lado do texto. Todos os comandos foram pensados para o Minikube, que você instala na Etapa 01. Quando um exemplo mostra a saída esperada, compare com a sua. Nomes de pods, IPs e tempos vão variar; a estrutura da saída é o que importa. Quando a saída aparece abreviada, ela está marcada com `(...)`.",
  "**Organize os arquivos por etapa.** Crie uma pasta para cada etapa (`etapa03/`, `etapa04/`, `etapa05/` e assim por diante) e salve os YAMLs dentro dela. Isso é necessário porque o nome `deployment.yaml` se repete nas Etapas 05, 08 e 09, e `service.yaml` e `hpa.yaml` se repetem nas Etapas 08 e 09, e trabalhar numa pasta só faria um arquivo sobrescrever o anterior. Rode os comandos de dentro da pasta da etapa. Ao fim de cada etapa existe um passo de limpeza; execute-o antes de seguir, para que objetos antigos não interfiram nos exercícios seguintes.",
];

export const LENS: GuideLens = {
  paragraphs: [
    "Uma equipe de Fórmula 1 chega a um fim de semana de Grande Prêmio com dois carros, uma garagem no pit lane e algumas dezenas de pessoas com funções bem separadas. Na mureta (o pit wall, a bancada voltada para a pista) ficam o estrategista e os engenheiros que decidem: o que cada carro deve fazer, quando parar, que alvo perseguir. Na garagem ficam os mecânicos, organizados em uma equipe por carro, cada uma com um chefe de mecânicos. Eles não decidem estratégia: montam, ajustam e consertam os carros conforme o que a mureta definiu. Os carros, na pista, são as unidades que de fato fazem o trabalho. O regulamento limita cada equipe a dois carros por corrida, e esse limite vai aparecer algumas vezes como o ponto em que a comparação deixa de valer.",
    "Ninguém na mureta encosta no carro. A informação circula por dois canais: o rádio e o intercom da equipe, por onde passam ordens e perguntas, e a telemetria, centenas de sensores que transmitem continuamente o estado de cada carro. Para entrar nesse canal é preciso estar na frequência da equipe e ter credencial. Tudo o que a equipe sabe e decide fica registrado nos servidores de dados: o plano do fim de semana, as versões de cada peça, o histórico de cada carro. Quem quer saber como um carro está consulta esse registro pelo canal oficial, não vai até a garagem perguntar.",
    "O carro em si é descrito por uma folha de especificação: chassi, unidade de potência (o motor do carro, que junta o motor a combustão e a parte elétrica que recupera e devolve energia), pacote aerodinâmico, cada componente com sua versão. Dois carros montados a partir da mesma folha são equivalentes, e um chassi destruído numa batida é substituído por outro montado a partir da mesma folha. O chassi é descartável; a especificação é o que permanece. Separada dela existe a folha de parâmetros (mapas de motor, modos de energia, alvos), que muda o comportamento do carro sem trocar nenhuma peça. Quem é chamado pelo rádio e pela cronometragem é o número de corrida do carro, nunca o número de série do chassi que está embaixo dele.",
  ],
  bridge: [
    "É a mesma divisão de trabalho que o Kubernetes faz: o control plane decide como a mureta, os nós executam como as garagens, os Pods rodam como os carros, cada Pod sai de um manifesto como o carro sai da folha de especificação, e tudo o que se sabe e se ordena passa por um canal único, como o rádio e a telemetria. Neste guia, você ocupa o lugar de quem escreve o plano e conversa com a mureta pelo rádio.",
    "Uma regra fixa vale para o guia inteiro: cada chassi montado é um Pod. Trocar o chassi é criar um Pod novo, com outro número de série (outro IP), enquanto o número de corrida (o Service) continua o mesmo. Já religar um sistema que desligou dentro do carro, sem trocar o chassi, é reiniciar um container dentro do mesmo Pod.",
  ],
  mappingNote:
    "O quadro abaixo traduz cada termo técnico do guia para uma ideia do dia a dia, sem F1 e sem jargão. Não precisa decorar; volte a ele quando um termo aparecer no texto.",
  mapping: [
    {
      term: "Cluster",
      plain: "Um grupo de computadores que trabalham juntos como se fossem um só.",
    },
    {
      term: "Control plane (master node)",
      plain:
        "A gerência: decide o que roda em cada computador e acompanha se tudo está como foi pedido, mas não faz o trabalho em si.",
    },
    {
      term: "Worker node",
      plain: "Um dos computadores que faz o trabalho de fato.",
    },
    {
      term: "API Server",
      plain: "O balcão de atendimento: todo pedido e toda consulta passam por ele.",
    },
    {
      term: "kubectl",
      plain: "O aplicativo que você usa para falar com o balcão.",
    },
    {
      term: "kubeconfig",
      plain: "O endereço do balcão e o seu crachá de acesso, guardados num arquivo.",
    },
    {
      term: "Imperativo e declarativo",
      plain:
        'Dar uma ordem na hora ("faça isto agora") ou deixar por escrito como as coisas devem ficar.',
    },
    {
      term: "Events",
      plain: "O histórico, com horário, do que aconteceu com cada item.",
    },
    {
      term: "etcd",
      plain:
        "O caderno oficial onde fica anotado tudo o que foi pedido e como cada coisa está agora.",
    },
    {
      term: "kubelet",
      plain: "O encarregado de cada computador, que cuida do que roda ali.",
    },
    {
      term: "kube-proxy",
      plain: "A lista de contatos de cada computador, que sabe para quem repassar cada chamada.",
    },
    {
      term: "Máquina virtual",
      plain:
        "Um computador inteiro simulado dentro de outro, com sistema operacional próprio: completo, mas pesado.",
    },
    {
      term: "Kernel do hospedeiro",
      plain: "A base do sistema do computador, dividida por todos os programas que rodam nele.",
    },
    {
      term: "Imagem de container",
      plain:
        "Uma receita fechada e com versão: seguida em qualquer lugar, dá sempre o mesmo resultado.",
    },
    {
      term: "Container",
      plain:
        "O programa preparado a partir da receita, rodando separado dos outros; pode ser reiniciado sem mexer no resto.",
    },
    {
      term: "Pod",
      plain:
        "A menor caixa que o sistema gerencia: um ou mais programas que andam sempre juntos. Se a caixa é trocada, é outra caixa, com outro endereço.",
    },
    {
      term: "Segundo container no Pod",
      plain:
        "Um programa ajudante dentro da mesma caixa, como um gravador que registra o que o principal faz.",
    },
    {
      term: "IP do Pod",
      plain: "O endereço da caixa, que muda quando ela é substituída.",
    },
    {
      term: "Namespace",
      plain: "Pastas separadas dentro do mesmo sistema, cada uma com a sua lista de itens.",
    },
    {
      term: "Label",
      plain:
        "Uma etiqueta colada no item, usada para achar de uma vez todos os itens do mesmo tipo.",
    },
    {
      term: "Annotation",
      plain: "Um bilhete preso ao item, escrito para pessoas lerem; não serve para buscar.",
    },
    {
      term: "Manifesto YAML",
      plain: "O formulário preenchido que descreve o que você quer, guardado para ser reutilizado.",
    },
    {
      term: "Estado desejado",
      plain:
        'O pedido permanente, como "quero sempre 3 funcionando", que o sistema trabalha sozinho para manter.',
    },
    {
      term: "Minikube",
      plain: "Uma versão de bancada do sistema, que roda no seu computador para estudar.",
    },
    {
      term: "Service",
      plain:
        "Um número fixo de atendimento que repassa a ligação para quem estiver disponível, mesmo que as pessoas mudem.",
    },
    {
      term: "ClusterIP, NodePort, LoadBalancer",
      plain:
        "Um ramal só interno; o mesmo ramal aberto em cada computador para quem liga de fora; um número público divulgado.",
    },
    {
      term: "ConfigMap",
      plain: "A folha de configurações separada do programa, lida quando ele começa a rodar.",
    },
    {
      term: "Secret",
      plain: "A mesma folha, para senhas e chaves, guardada com mais cuidado.",
    },
    {
      term: "ReplicaSet",
      plain: 'A regra "sempre N cópias funcionando": se uma some, outra é criada.',
    },
    {
      term: "Deployment",
      plain:
        "Quem cuida das versões: troca a versão com calma e guarda o histórico das anteriores.",
    },
    {
      term: "Rolling update",
      plain: "Trocar a versão uma cópia de cada vez, sem fechar o atendimento.",
    },
    {
      term: "Rollback",
      plain: "Voltar para a versão anterior, que funcionava.",
    },
    {
      term: "emptyDir",
      plain: "Um rascunho temporário, jogado fora junto com a caixa.",
    },
    {
      term: "hostPath",
      plain: "Uma gaveta de um computador específico: só serve para quem está naquele computador.",
    },
    {
      term: "PVC",
      plain: 'O pedido de espaço para guardar dados ("preciso de 1 GB").',
    },
    {
      term: "PV",
      plain: "O espaço de armazenamento real que atende esse pedido.",
    },
    {
      term: "StorageClass",
      plain: "O cardápio dos tipos de armazenamento que podem ser criados quando alguém pede.",
    },
    {
      term: "restartPolicy",
      plain: "A regra de religar sozinho um programa que caiu, na mesma caixa.",
    },
    {
      term: "Probes",
      plain: "Perguntas de rotina feitas a cada poucos segundos para saber se o programa está bem.",
    },
    {
      term: "Liveness, readiness, startup",
      plain:
        '"Está vivo?" (se não, reinicia); "pode atender?" (se não, fica fora do atendimento); "já terminou de ligar?" (enquanto não, as outras perguntas esperam).',
    },
    {
      term: "HPA",
      plain:
        "O ajuste automático do número de cópias conforme o movimento, sempre entre um mínimo e um máximo.",
    },
    {
      term: "metrics-server",
      plain: "O medidor de consumo que alimenta esse ajuste; sem ele, não há números para decidir.",
    },
    {
      term: "resources.requests",
      plain: "A reserva declarada de recursos; as porcentagens de uso são calculadas em cima dela.",
    },
  ],
  limitsIntro:
    "A comparação ajuda a fixar a divisão de papéis, mas não é uma equivalência perfeita. Estes são os pontos em que a F1 deixa de valer para cada etapa:",
  limits: [
    "**Etapa 01:** uma equipe repõe um carro em horas, entre sessões, e o regulamento fixa dois carros; o Kubernetes cria um Pod novo em segundos, a qualquer momento, e o limite de quantidade é só o que o cluster aguenta.",
    "**Etapa 02:** o rádio da F1 é voz, interpretada por pessoas; a API do Kubernetes é um protocolo HTTP rígido, em que cada pedido tem método, caminho e código de resposta, sem nenhuma margem de interpretação.",
    "**Etapa 03:** os sistemas de um carro são fisicamente integrados e projetados juntos, enquanto os containers de um Pod são processos independentes que podem ser trocados um a um na especificação sem mexer nos outros.",
    "**Etapa 04:** um número de corrida aponta para um carro só, enquanto o Service distribui requisições entre várias réplicas ao mesmo tempo; o balanceamento de carga não tem equivalente na F1.",
    "**Etapa 05:** na F1, um carro é reposto entre sessões, em horas, e o regulamento limita a equipe a dois carros; o ReplicaSet repõe em segundos, a qualquer momento, e mantém o número de réplicas que for declarado.",
    "**Etapa 06:** na F1, os dados do carro são transmitidos ou baixados para os servidores, ou seja, existe uma cópia; o PVC não copia nada, o Pod escreve direto no volume externo, e se o PVC for apagado com política `Delete` os dados vão junto.",
    "**Etapa 07:** na F1, religar um sistema em pista envolve o piloto e quase sempre custa a sessão; no Kubernetes, o kubelet reinicia o container em segundos, sem intervenção de ninguém, e o Pod continua sendo o mesmo Pod, com o contador de RESTARTS aumentando.",
    "**Etapa 08:** num GP a equipe corre com exatamente dois carros, por regulamento; o HPA, que coloca mais ou menos réplicas conforme a carga, só tem paralelo numa operação imaginária sem limite de carros, e esta é a etapa em que a comparação mais se afasta da F1 real.",
    "**Etapa 09:** num carro de F1 o piloto troca mapas e modos pelo volante em plena volta, e o valor novo vale na hora; no Kubernetes, uma variável de ambiente lida de um ConfigMap só muda quando o Pod é recriado.",
  ],
};

export const LESSONS: Lesson[] = [
  {
    id: "m1",
    num: "01",
    navTitle: "Por que K8s existe",
    tag: "motivação + setup",
    title: "Por que o Kubernetes existe",
    lead: 'Imagine o e-commerce de uma empresa média. Durante onze meses ele recebe um volume previsível de acessos. Na semana da Black Friday, o tráfego multiplica várias vezes. Se você dimensiona os servidores para o dia a dia, o site cai no pico. Se dimensiona para o pico, paga por máquinas ociosas o ano inteiro. A infraestrutura precisa crescer e encolher conforme a demanda.\n\nExiste um segundo problema, menos visível. O desenvolvedor roda a aplicação na própria máquina, o QA testa em outra e a produção é uma terceira. Qualquer diferença de versão de biblioteca, de sistema operacional ou de configuração produz o clássico "na minha máquina funciona". Manter dev, testes e produção idênticos, na mão, é uma fonte constante de bugs.\n\nTodo projeto de software esbarra nesses dois problemas: manter ambientes iguais e escalar quando a demanda muda. O Kubernetes automatiza a solução dos dois.',
    concept: [
      "A peça comum às duas soluções é o **container**.",
      'Uma máquina virtual (VM) carrega hardware virtualizado e um sistema operacional completo: ocupa gigabytes e leva minutos para subir. Um container compartilha o kernel do sistema operacional da máquina hospedeira e leva apenas os arquivos, binários e bibliotecas de que o app precisa: ocupa megabytes e sobe em segundos. Uma **imagem de container** empacota esse ambiente inteiro e pode ser executada igual em qualquer lugar, o que resolve o "na minha máquina funciona".',
      "Containers resolvem o problema do ambiente e criam outro. Com dezenas ou centenas deles, alguém precisa criá-los, destruí-los, vigiar a saúde de cada um e recriar o que falhar. Fazer isso manualmente não escala. O **Kubernetes (K8s)** é o **orquestrador** que assume essas tarefas.",
      'A ideia central do Kubernetes é o **estado desejado**. Você não executa uma sequência de ordens ("suba este container, depois aquele"). Você declara o resultado que quer ("quero 3 cópias desta aplicação rodando") e o Kubernetes compara continuamente o que existe com o que foi declarado, corrigindo qualquer diferença. Se uma das cópias some às 3h da manhã (o Pod é apagado ou o nó onde ele rodava cai), o cluster percebe que existem 2 cópias em vez de 3 e cria a que falta, sem ninguém acordar. Quando o que falha é só o processo dentro do container, quem reage é outro mecanismo, que você vai separar com clareza na Etapa 07.',
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "Container",
        d: "processo isolado que compartilha o kernel do hospedeiro e leva só o que o app precisa. Muito mais leve que uma VM.",
        color: "blue",
      },
      {
        t: "Imagem",
        d: "pacote imutável com o ambiente do app. O container é uma imagem em execução.",
        color: "signal",
      },
      {
        t: "Escala horizontal",
        d: "mais cópias da aplicação dividindo a carga (é o que o K8s automatiza). Escala vertical é dar mais CPU e RAM à mesma máquina.",
        color: "violet",
      },
      {
        t: "Cluster e nó (node)",
        d: "o K8s organiza máquinas (nós) em um cluster, que é tratado como uma única plataforma.",
        color: "ember",
      },
      {
        t: "Pod",
        d: "o grupo de containers que o K8s gerencia como unidade. É a menor unidade gerenciada (detalhes na Etapa 03).",
        color: "blue",
      },
      {
        t: "Namespace",
        d: "separação lógica de recursos dentro do cluster. Quando você não indica nenhum, o namespace usado é o `default`.",
        color: "signal",
      },
      {
        t: "kubectl",
        d: "ferramenta de linha de comando que conversa com a API REST do cluster (detalhes na Etapa 02).",
        color: "violet",
      },
      {
        t: "Minikube",
        d: "cluster K8s de 1 nó rodando na sua máquina. Feito para estudo, é o laboratório deste guia.",
        color: "ember",
      },
      {
        t: "Estado desejado",
        d: "você declara o que quer, e o K8s faz acontecer e mantém. Se algo cai, ele recria.",
        color: "blue",
      },
    ],
    examplesTitle: "Montando o laboratório",
    examples: [
      {
        label: "montando o laboratório",
        lang: "sh",
        code: '# 1. Instale o Docker Desktop (docker.com). No Linux, use o Docker\n#    Engine (docs.docker.com/engine/install). Confirme:\n$ docker -v\nDocker version 27.x\n\n# 2. Instale o kubectl (kubernetes.io/docs/tasks/tools) e confirme.\n#    Use --client: ainda não existe cluster, então só a versão do\n#    cliente pode ser consultada (sem --client, o kubectl tentaria falar\n#    com um servidor inexistente e imprimiria um erro de conexão)\n$ kubectl version --client\nClient Version: v1.30.x\nKustomize Version: v5.x\n\n# 3. Instale o Minikube (minikube.sigs.k8s.io/docs/start) e suba o cluster:\n$ minikube start\n😄  minikube v1.33 on Windows 11\n✨  Using the docker driver\n🏄  Done! kubectl is now configured to use "minikube"\n\n# 4. Confirme que o cluster está de pé:\n$ kubectl get nodes\nNAME       STATUS   ROLES           AGE   VERSION\nminikube   Ready    control-plane   1m    v1.30.x\n\n# 5. Cluster vazio = sucesso:\n$ kubectl get pods\nNo resources found in default namespace.\n\n# 6. Agora que o cluster existe, a versão completa mostra cliente e servidor:\n$ kubectl version --output=yaml\nclientVersion:\n  (...)\nserverVersion:\n  (...)',
        note: "A primeira execução do `minikube start` baixa a imagem do cluster e demora alguns minutos. É normal.",
      },
    ],
    commands: [
      {
        cmd: "minikube start",
        note: "sobe o cluster local de 1 nó",
      },
      {
        cmd: "minikube stop",
        note: "para o cluster sem apagar nada",
      },
      {
        cmd: "kubectl version --client",
        note: "mostra a versão do kubectl, sem precisar de cluster",
      },
      {
        cmd: "kubectl get nodes",
        note: "lista os nós e o status de cada um",
      },
      {
        cmd: "kubectl get pods",
        note: "lista os pods do namespace atual",
      },
    ],
    handsOn: [
      'Rode `minikube start` e aguarde o "Done!".',
      "Rode `kubectl get nodes`. **Observe** o nó `minikube` com `STATUS Ready`. Se aparecer `NotReady`, aguarde 1 minuto e repita.",
      "Rode `kubectl get pods`. **Observe** `No resources found in default namespace.` Um cluster vazio e pronto é o ponto de partida da próxima etapa.",
      'Bônus: rode `minikube stop` e depois `kubectl get nodes`. **Observe** a mensagem de erro de conexão (o cluster não responde). Suba de novo com `minikube start`. Agora você sabe como "cluster fora do ar" aparece no terminal.',
    ],
    tip: "Se o `minikube start` falhar, a causa mais comum é o Docker Desktop não estar aberto. No Linux, o equivalente é o serviço parado: `sudo systemctl start docker`. Suba o Docker primeiro e tente de novo.",
    takeaway:
      "Container é um ambiente leve e replicável; Kubernetes mantém o estado desejado desses containers: você declara o que quer, ele garante.",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa01-evolucao-deploy.svg",
            alt: "Três colunas: deploy tradicional, com apps direto no sistema operacional; deploy virtualizado, com hypervisor e um sistema operacional por máquina virtual; deploy com containers, com container runtime sobre um único sistema operacional.",
            caption:
              "Da esquerda para a direita: apps direto no servidor, uma VM com sistema operacional próprio para cada app e containers dividindo o mesmo sistema operacional.",
          },
        ],
        credit: "Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
    ],
    handsOnIntro: "O menor exercício possível: provar que o laboratório está vivo.",
  },
  {
    id: "m2",
    num: "02",
    navTitle: "kubectl & API",
    tag: "linha de comando + API",
    title: "kubectl e a API, como você comanda o cluster",
    lead: "O cluster está de pé (Etapa 01), mas você ainda não sabe como falar com ele. Imagine que o serviço de checkout parou de responder às 2h da manhã e você está de plantão. Você precisa descobrir quais pods existem, em que estado estão, o que o app está imprimindo e, se necessário, entrar no container para investigar. Nada disso pode depender de acesso físico à máquina onde o container roda.",
    concept: [
      "Tudo no Kubernetes passa pela **API REST** do nó master (o *control plane*). O `kubectl` é o cliente dessa API: cada comando que você digita vira uma requisição HTTP (GET, POST, PUT ou DELETE) contra o cluster.",
      "O caminho de um comando é este:",
      "1. Você digita `kubectl get pods`.",
      "1. O kubectl lê o arquivo **kubeconfig**, que guarda o endereço do API Server, as credenciais e o contexto do cluster atual. O Minikube preenche esse arquivo sozinho no `minikube start`.",
      "1. O kubectl envia um `GET` ao API Server (para o namespace `default`, o caminho é `/api/v1/namespaces/default/pods`).",
      "1. A resposta volta e o kubectl a formata no terminal.",
      'A API é dividida em grupos. O grupo "core" tem os recursos fundamentais (pods, services, replicasets); outros grupos cuidam de segurança, armazenamento e autoscaling. Como é REST puro, qualquer linguagem (Python, Go, Java, C#) consegue chamá-la, o que abre espaço para automação.',
      "Existem dois jeitos de trabalhar com o kubectl:",
      "- **Imperativo**: você dá a ordem direta, como em `kubectl run nginx --image=nginx`. É rápido e serve para testes.",
      "- **Declarativo**: você escreve um arquivo YAML que descreve o estado desejado e roda `kubectl apply -f arquivo.yaml`. É o modo dominante em projetos reais, porque o arquivo pode ser versionado no Git, revisado e reaplicado.",
      "Neste guia começamos pelo imperativo, que é mais rápido para aprender, e passamos ao declarativo na Etapa 03.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "API Server",
        d: "a porta de entrada do cluster; recebe toda requisição, valida e executa.",
        color: "blue",
      },
      {
        t: "kubeconfig",
        d: "arquivo com endereço do cluster, credenciais e contexto atual.",
        color: "signal",
      },
      {
        t: "Imperativo vs. declarativo",
        d: "dar ordens passo a passo versus descrever o estado final.",
        color: "violet",
      },
      {
        t: "Events",
        d: "histórico de eventos de um objeto (imagem baixada, container criado, falha). Aparece no final do `describe`.",
        color: "ember",
      },
      {
        t: "Verbos do dia a dia",
        d: "- `get`: consulta recursos e o status de cada um (`get pods`, `get svc`, `get nodes`). - `create` / `run` / `apply`: criam recursos. `run` cria um pod imperativo; `apply -f` aplica um YAML. - `delete`: remove. Cuidado, pode afetar quem depende do recurso. - `describe`: mostra configuração e a seção Events. É a primeira parada quando algo trava. - `logs`: mostra o que o container está imprimindo. É a principal fonte de informação no debug. - `exec`: executa um comando dentro do container, por exemplo um shell.",
        color: "blue",
      },
    ],
    examplesTitle: "Ciclo de vida de um Pod",
    examples: [
      {
        label: "terminal",
        lang: "sh",
        code: '# Cria um pod chamado "nginx" a partir da imagem nginx:1.14.2 do Docker Hub\n$ kubectl run nginx --image=nginx:1.14.2 --port=80\npod/nginx created\n\n# Acompanhe até o status ficar Running (o primeiro estado é ContainerCreating)\n$ kubectl get pods\nNAME    READY   STATUS    RESTARTS   AGE\nnginx   1/1     Running   0          30s\n\n# Detalhes + eventos (veja a linha "Pulling image" na seção Events)\n$ kubectl describe pod nginx\nName:         nginx\n(...)\nEvents:\n  Type    Reason     Age   From               Message\n  Normal  Scheduled  35s   default-scheduler  Successfully assigned default/nginx to minikube\n  Normal  Pulling    34s   kubelet            Pulling image "nginx:1.14.2"\n  Normal  Pulled     20s   kubelet            Successfully pulled image "nginx:1.14.2"\n  Normal  Created    20s   kubelet            Created container nginx\n  Normal  Started    20s   kubelet            Started container nginx\n\n# O que o container está imprimindo (o nginx escreve o log de acesso na saída\n# padrão, então ele só mostra linhas depois que chegam requisições)\n$ kubectl logs nginx\n\n# Abre um shell dentro do container (digite "exit" para sair).\n# Atenção: depois deste comando você está DENTRO do container e o prompt\n# passa a ser "# ". As linhas abaixo que começam com "# " (ls e exit) não\n# são comentários: são comandos digitados no shell do container.\n$ kubectl exec -it nginx -- /bin/sh\n# ls /usr/share/nginx/html\n50x.html  index.html\n# exit\n\n# De volta ao seu terminal (prompt "$"). Limpeza:\n$ kubectl delete pod nginx\npod "nginx" deleted',
        note: "Se o status ficar em `ImagePullBackOff`, o cluster não conseguiu baixar a imagem. Confira o nome e a tag da imagem e a sua conexão com a internet. Para ver a requisição HTTP por trás de um comando, aumente o nível de log do kubectl. O formato exato muda de versão para versão, mas você deve encontrar uma linha com o método, o caminho da API e o status:",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "$ kubectl get pods -v=6\n(...) GET https://192.168.49.2:8443/api/v1/namespaces/default/pods?limit=500 200 OK in 12 milliseconds\nNAME    READY   STATUS    RESTARTS   AGE\nnginx   1/1     Running   0          2m",
      },
    ],
    commands: [
      {
        cmd: "kubectl run nginx --image=nginx:1.14.2 --port=80",
        note: "cria um pod imperativo",
      },
      {
        cmd: "kubectl get pods",
        note: "lista os pods e o status",
      },
      {
        cmd: "kubectl describe pod <nome>",
        note: "detalhes e Events (troubleshooting)",
      },
      {
        cmd: "kubectl logs <nome>",
        note: "saída do container",
      },
      {
        cmd: "kubectl exec -it <nome> -- /bin/sh",
        note: "shell dentro do container",
      },
      {
        cmd: "kubectl delete pod <nome>",
        note: "remove o pod",
      },
      {
        cmd: "kubectl get pods -v=6",
        note: "mostra a requisição HTTP que o kubectl fez",
      },
    ],
    handsOn: [
      "Rode a sequência do exemplo (`run`, `get`, `describe`, `logs`, `delete`). **Observe** a seção `Events` do `describe`: as linhas `Pulling image`, `Created container` e `Started container` contam a história do pod em ordem.",
      "Crie um pod quebrado de propósito: `kubectl run quebrado --image=nginx:versao-que-nao-existe`.",
      "Rode `kubectl get pods`. **Observe** o status `ErrImagePull`, que logo vira `ImagePullBackOff`.",
      "Rode `kubectl describe pod quebrado`. **Observe** nos Events a mensagem dizendo que a imagem não foi encontrada. Você acabou de praticar o fluxo de debug real.",
      "Rode `kubectl get pods -v=6` e **observe** a linha com `GET .../api/v1/namespaces/default/pods`. Esse é o comando traduzido em HTTP.",
      "Limpe: `kubectl delete pod quebrado`.",
    ],
    tip: "Grave o fluxo de debug: `get pods` (qual o status?), depois `describe pod` (o que dizem os Events?), depois `logs` (o que o app diz?). Essa sequência resolve a maioria dos problemas.",
    takeaway:
      "Tudo no K8s é uma chamada à API REST, o kubectl é o cliente dessa API, e quando algo trava o caminho é sempre get, describe, logs.",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa02-kubectl-api.svg",
            alt: "No terminal, kubectl get pods lê o kubeconfig, com o endereço do API Server e as credenciais, e envia GET /api/v1/namespaces/default/pods ao API Server, no control plane, que consulta o etcd; a resposta volta em JSON e o kubectl a formata. Embaixo, o modo imperativo com kubectl run e o declarativo com kubectl apply -f.",
            caption:
              "Todo comando do kubectl vira uma requisição HTTP à API. O kubeconfig diz para onde mandar e com quais credenciais, e o `-v=6` mostra a requisição feita.",
          },
        ],
        credit: "Diagrama: feito para este guia",
      },
    ],
    handsOnIntro: "Execute o ciclo completo e provoque o primeiro erro de propósito.",
  },
  {
    id: "m3",
    num: "03",
    navTitle: "Cluster & Pods",
    tag: "arquitetura + labels",
    title: "A anatomia do cluster e a menor unidade dele, o Pod",
    lead: "Na Etapa 02 você criou um pod com um comando imperativo. Funciona, mas há dois furos. Primeiro, você não sabe o que exatamente foi criado nem onde dentro do cluster. Segundo, se amanhã precisar recriar aquele pod idêntico em outro ambiente, só terá a memória do comando que digitou. Além disso, imagine um time com 40 pods no mesmo cluster (checkout, catálogo, pagamento, busca). Como listar apenas os do checkout? Precisamos entender as peças do cluster, descrever os objetos em arquivos versionáveis e agrupá-los por critérios que o próprio Kubernetes consiga usar.",
    concept: [
      "Um **cluster** é um grupo de máquinas (**nodes**) trabalhando juntas, com papéis bem definidos:",
      "- O **master node** (control plane) gerencia o cluster e decide onde executar os Pods.",
      "- Os **worker nodes** executam os Pods e os demais recursos.",
      "- O **etcd** é o banco de dados distribuído que guarda a configuração e o estado de tudo no cluster.",
      "- O **kubelet** é o agente que roda em cada node e gerencia os Pods daquele node.",
      "- O **kube-proxy** encaminha o tráfego de rede até o Pod certo.",
      "- O **API Server** é a porta de entrada, por onde passa tudo que o kubectl faz (Etapa 02).",
      "O **Pod** é a menor unidade que o Kubernetes gerencia: um envelope com um ou mais containers que dividem rede e armazenamento. Quatro fatos sobre Pods:",
      "1. Um Pod representa um processo em execução e pode ter mais de um container, todos dividindo o mesmo IP e os mesmos volumes.",
      "1. **Pods são efêmeros.** Nascem e morrem o tempo todo, e você nunca deve contar com um Pod específico existindo amanhã. Esta frase é a raiz das Etapas 04, 05 e 06.",
      "1. Cada Pod recebe um IP interno do cluster.",
      "1. Pods são descritos em YAML.",
      "Para organizar muitos objetos existem **labels** (rótulos) e **annotations** (anotações). Labels são pares chave-valor usados para **identificar e selecionar** objetos: é por label que um Service encontra seus Pods (Etapa 04) e que um Deployment sabe quais Pods são seus (Etapa 05). Annotations são metadados livres (autor, link de documentação, dados de auditoria) que **não participam de seleção**; servem para pessoas e ferramentas lerem. Essa diferença é uma pergunta clássica de prova.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "Master node",
        d: "gerencia o cluster e decide onde executar os Pods.",
        color: "blue",
      },
      {
        t: "Worker node",
        d: "executa os Pods e demais recursos.",
        color: "signal",
      },
      {
        t: "etcd",
        d: "banco distribuído com a configuração e o estado do cluster.",
        color: "violet",
      },
      {
        t: "kubelet",
        d: "agente de cada node que gerencia os Pods locais.",
        color: "ember",
      },
      {
        t: "kube-proxy",
        d: "encaminha o tráfego de rede para os Pods certos.",
        color: "blue",
      },
      {
        t: "API Server",
        d: "porta de entrada de tudo que o kubectl faz.",
        color: "signal",
      },
      {
        t: "Pod",
        d: "um ou mais containers com rede e volumes compartilhados; efêmero.",
        color: "violet",
      },
      {
        t: "Label",
        d: "chave-valor para identificar e selecionar objetos.",
        color: "ember",
      },
      {
        t: "Annotation",
        d: "metadado livre para documentação, sem papel em seleção.",
        color: "blue",
      },
      {
        t: "Manifesto",
        d: "arquivo YAML que descreve um objeto. Todo manifesto tem `apiVersion`, `kind`, `metadata` e `spec`.",
        color: "signal",
      },
    ],
    examplesTitle: "O primeiro YAML",
    examples: [
      {
        label: "o primeiro YAML",
        lang: "yaml",
        code: 'apiVersion: v1                # versão da API do K8s p/ este objeto\nkind: Pod                     # o TIPO de objeto criado\nmetadata:                     # dados SOBRE o objeto\n  name: meu-pod\n  labels:                     # rótulos: chave-valor p/ SELECIONAR\n    app: myapp\n    ambiente: estudo\n  annotations:                # anotações: metadados livres (docs)\n    autor: "Davi Gomes"\nspec:                         # a ESPECIFICAÇÃO: o que roda dentro\n  containers:\n    - name: meu-container\n      image: nginx:1.14.2\n      ports:\n        - containerPort: 80',
        intro:
          "Crie a pasta `etapa03/` e salve o manifesto abaixo nela como `meu-pod.yaml`. Este é o esqueleto que você precisa saber de cabeça.",
        note: "Todo objeto K8s segue esse esqueleto: `apiVersion` + `kind` + `metadata` + `spec`. O que muda de um objeto para outro é o valor de `kind` e o conteúdo de `spec`; o resto é sempre igual. Quem domina esse esqueleto consegue ler qualquer manifesto.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# Aplica o YAML (declarativo)\n$ kubectl apply -f meu-pod.yaml\npod/meu-pod created\n\n# Lista mostrando os labels\n$ kubectl get pods --show-labels\nNAME      READY   STATUS    RESTARTS   AGE   LABELS\nmeu-pod   1/1     Running   0          20s   ambiente=estudo,app=myapp\n\n# Filtra por label: o mecanismo central do K8s\n$ kubectl get pods -l app=myapp\nNAME      READY   STATUS    RESTARTS   AGE\nmeu-pod   1/1     Running   0          1m\n\n# Adiciona label num pod que já existe\n$ kubectl label pod meu-pod time=devops\npod/meu-pod labeled",
        note: 'O filtro `-l` parece simples, mas Services, ReplicaSets e Deployments encontram "seus" Pods exatamente assim, por **label selector**. As próximas etapas dependem desse mecanismo.',
      },
    ],
    commands: [
      {
        cmd: "kubectl apply -f arquivo.yaml",
        note: "cria ou atualiza pelo YAML",
      },
      {
        cmd: "kubectl get pods --show-labels",
        note: "lista exibindo os rótulos",
      },
      {
        cmd: "kubectl get pods -l app=myapp",
        note: "filtra por rótulo",
      },
      {
        cmd: "kubectl label pod <nome> chave=valor",
        note: "adiciona um rótulo a um pod existente",
      },
      {
        cmd: "kubectl delete -f arquivo.yaml",
        note: "remove o que o arquivo criou",
      },
    ],
    handsOn: [
      "Salve o YAML acima como `etapa03/meu-pod.yaml` e aplique com `kubectl apply -f meu-pod.yaml`.",
      "Rode `kubectl get pods --show-labels`. **Observe** os dois labels na última coluna.",
      "Rode `kubectl get pods -l app=myapp` e depois `kubectl get pods -l app=outra-coisa`. **Observe**: o primeiro encontra o pod, o segundo responde `No resources found in default namespace.` Esse é o mecanismo de seleção em ação.",
      "Adicione um label em tempo real com `kubectl label pod meu-pod time=devops` e confirme com `--show-labels`.",
      "Não delete o pod agora: ele será o alvo do Service na próxima etapa, e a limpeza dele está no final da Etapa 04. Se você deletou, aplique o YAML de novo. Essa é a vantagem do declarativo: o arquivo recria o objeto idêntico.",
    ],
    tip: "Labels são seleção operacional (o K8s usa). Annotations são documentação (pessoas usam). Para registrar o autor de um Pod, use uma annotation; para agrupar os Pods de uma aplicação, use um label.",
    takeaway:
      "Todo objeto K8s é apiVersion + kind + metadata + spec, e labels são o mecanismo pelo qual tudo no cluster encontra tudo.",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa03-arquitetura-cluster.svg",
            alt: "Diagrama de um cluster: à esquerda, o control plane com kube-api-server, etcd, scheduler, controller manager e cloud-controller-manager; à direita, dois nós, cada um com kubelet, kube-proxy, runtime de containers e Pods.",
            caption:
              "O control plane decide e guarda o estado (API Server, etcd, scheduler, controller manager); cada nó roda os Pods com kubelet e kube-proxy. O cloud-controller-manager só existe em clusters de nuvem.",
          },
        ],
        credit: "Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
      {
        items: [
          {
            src: "/guides/kubernetes/etapa03-pods.svg",
            alt: "Quatro Pods com IPs diferentes: o primeiro com um container, o segundo com um container e um volume, o terceiro com dois containers e um volume, o quarto com vários containers e volumes.",
            caption:
              "Cada Pod tem o próprio IP. Dentro dele, um ou mais containers dividem esse IP e os volumes declarados.",
          },
        ],
        credit: "Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
    ],
  },
  {
    id: "m4",
    num: "04",
    navTitle: "Services & ConfigMap",
    tag: "rede + configuração",
    title: "Services e ConfigMaps, endereço fixo e configuração externa",
    lead: "Pela Etapa 03, Pods são efêmeros e cada Pod novo nasce com um IP diferente. Agora imagine o frontend de um e-commerce chamando a API de pedidos. Hoje a API está no IP `10.244.0.5`. Amanhã o Pod morre, é recriado e passa a ser `10.244.0.9`. Se o frontend tem o IP antigo escrito no código, ele quebra a cada recriação. Como alguém fala com Pods de forma confiável se o endereço muda o tempo todo?\n\nHá um segundo problema. Todo serviço precisa de configuração (portas, URLs de outros serviços, flags). Se esses valores ficam dentro da imagem do container, cada mudança obriga a rebuildar e republicar a imagem. Trocar uma URL não deveria exigir um novo build.",
    concept: [
      "**Problema 1: o Service.** O Service é um ponto de entrada estável que encontra os Pods por label e balanceia o tráfego entre eles. O fluxo é:",
      "1. Uma requisição chega ao Service, que tem IP e nome fixos.",
      "1. O Service seleciona os Pods pelo **label selector** (o mecanismo da Etapa 03).",
      "1. O tráfego é distribuído de forma balanceada entre as réplicas saudáveis.",
      "O nome do Service vira um **hostname interno** do cluster. Se o Service se chama `auth-service`, qualquer Pod do cluster consegue acessar `http://auth-service`, mesmo que os Pods por trás dele troquem de IP repetidamente.",
      "Existem três tipos de Service:",
      "- **ClusterIP** (o padrão): IP interno, acessível só de dentro do cluster. Serve para a comunicação entre serviços (por exemplo, API para banco).",
      "- **NodePort**: abre uma porta fixa (de 30000 a 32767) em cada nó. O acesso de fora é feito por `IP-do-nó:porta`. É o jeito de expor algo no Minikube.",
      "- **LoadBalancer**: provisiona um balanceador externo com IP público. É o tipo usado em produção na nuvem (AWS, GCP, Azure).",
      "**Problema 2: o ConfigMap.** O ConfigMap guarda a configuração em um objeto separado do container. Você o injeta no Pod de três formas:",
      "- **variáveis de ambiente** (a mais comum, via `envFrom`);",
      "- **arquivos montados** (ótimo para configurações longas);",
      "- **argumentos de linha de comando**.",
      "Quando a configuração muda, você atualiza o ConfigMap e a imagem continua a mesma, sem rebuild. Mas atenção a um detalhe: **variáveis de ambiente são lidas quando o container inicia**. Atualizar o ConfigMap não altera as variáveis de um Pod que já está rodando; o Pod precisa ser recriado para enxergar os valores novos (você vai ver isso acontecer na prática na Etapa 09). Já os ConfigMaps montados como arquivos costumam ser atualizados dentro do Pod depois de algum tempo, sem recriá-lo, mas o app precisa reler o arquivo para usar o valor novo.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "Service",
        d: "endereço estável (IP e nome) que seleciona Pods por label e balanceia o tráfego.",
        color: "blue",
      },
      {
        t: "selector",
        d: "o par chave-valor que liga o Service aos Pods; precisa casar com o label dos Pods.",
        color: "signal",
      },
      {
        t: "port / targetPort / nodePort",
        d: "`port` é onde o Service escuta; `targetPort` é a porta do container que recebe; `nodePort` é a porta exposta no nó (só no tipo NodePort).",
        color: "violet",
      },
      {
        t: "ClusterIP",
        d: "acesso interno apenas. **NodePort**: acesso externo por porta do nó. **LoadBalancer**: acesso externo por IP público na nuvem.",
        color: "ember",
      },
      {
        t: "Endpoints",
        d: "a lista de IPs de Pods que o Service está de fato usando; vazia quando nenhum Pod casa com o selector.",
        color: "blue",
      },
      {
        t: "ConfigMap",
        d: "objeto com pares chave-valor de configuração, separado da imagem.",
        color: "signal",
      },
      {
        t: "envFrom",
        d: "injeta todas as chaves de um ConfigMap como variáveis de ambiente (lidas só na criação do container).",
        color: "violet",
      },
      {
        t: "Secret",
        d: "irmão do ConfigMap, destinado a senhas e chaves.",
        color: "ember",
      },
    ],
    examplesTitle: "Repare no selector",
    examples: [
      {
        label: "app.yaml",
        lang: "yaml",
        code: "# app.yaml: salve o Service neste arquivo\napiVersion: v1\nkind: Service\nmetadata:\n  name: meu-service            # vira o hostname interno\nspec:\n  type: NodePort               # troque p/ ClusterIP (interno) ou LoadBalancer (nuvem)\n  selector:                    # ← O ELO: procura Pods com este label\n    app: myapp\n  ports:\n    - protocol: TCP\n      port: 80                 # porta em que o Service escuta\n      targetPort: 80           # porta do container que recebe\n      nodePort: 30080          # porta exposta no nó (só NodePort)",
        intro: "Crie a pasta `etapa04/` e salve os manifestos desta etapa nela.",
        note: "O `selector` do Service casa com o label do Pod (`app: myapp`), exatamente o `meu-pod` da Etapa 03. É assim que o Service sabe para quem mandar o tráfego.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ kubectl apply -f app.yaml\nservice/meu-service created\n\n$ kubectl get svc\nNAME          TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE\nkubernetes    ClusterIP   10.96.0.1     <none>        443/TCP        1h\nmeu-service   NodePort    10.96.xx.xx   <none>        80:30080/TCP   10s\n\n# Gera a URL de acesso (no Windows/Docker, deixe o terminal aberto: é um túnel)\n$ minikube service meu-service --url\nhttp://127.0.0.1:53412   ← abra no navegador: página do nginx",
        note: "Agora o ConfigMap, injetado em um Pod como variáveis de ambiente:",
      },
      {
        label: "configmap-pod.yaml",
        lang: "yaml",
        code: '# configmap-pod.yaml: os dois objetos no mesmo arquivo, separados por ---\n# 1) O ConfigMap com os valores...\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: minha-config\ndata:\n  MENSAGEM: "olá do configmap!"\n  MODO: "estudo"\n---\n# 2) ...injetado como variáveis de ambiente no Pod\napiVersion: v1\nkind: Pod\nmetadata:\n  name: pod-config\nspec:\n  containers:\n    - name: app\n      image: nginx:1.14.2\n      envFrom:                 # injeta TODAS as chaves de uma vez\n        - configMapRef:\n            name: minha-config',
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "$ kubectl apply -f configmap-pod.yaml\nconfigmap/minha-config created\npod/pod-config created\n\n# Confirme a injeção: as chaves do ConfigMap aparecem como variáveis\n$ kubectl exec pod-config -- env\n(...)\nMENSAGEM=olá do configmap!\nMODO=estudo\n(...)",
      },
    ],
    commands: [
      {
        cmd: "kubectl get svc",
        note: "lista os Services",
      },
      {
        cmd: "minikube service <nome> --url",
        note: "URL de acesso a um NodePort",
      },
      {
        cmd: "kubectl get endpoints <service>",
        note: "lista os IPs de Pods que o Service está usando",
      },
      {
        cmd: "kubectl get configmap",
        note: "lista os ConfigMaps",
      },
      {
        cmd: "kubectl exec <pod> -- env",
        note: "confere as variáveis de ambiente injetadas",
      },
    ],
    handsOn: [
      "Com o `meu-pod` da Etapa 03 rodando (label `app: myapp`), salve o YAML do Service como `etapa04/app.yaml` e aplique.",
      "Rode `minikube service meu-service --url` e abra a URL no navegador. **Observe** a página de boas-vindas do nginx. Você acessou um Pod efêmero por um endereço estável.",
      "Teste o elo: delete o pod (`kubectl delete pod meu-pod`) e recarregue o navegador. **Observe** que a página deixa de carregar (o navegador mostra conexão recusada ou tempo esgotado, dependendo do sistema e do driver), já que não existe mais nenhum Pod com o label. Confirme a causa com `kubectl get endpoints meu-service`: a lista de endpoints está vazia.\n```sh\n$ kubectl get endpoints meu-service\nNAME          ENDPOINTS   AGE\nmeu-service   <none>      5m\n```\nRecrie o pod com `kubectl apply -f ../etapa03/meu-pod.yaml` e recarregue. O acesso voltou sem você tocar no Service, e `kubectl get endpoints meu-service` volta a mostrar um IP (algo como `10.244.0.7:80`).",
      "Aplique o ConfigMap e o pod (`kubectl apply -f configmap-pod.yaml`) e rode `kubectl exec pod-config -- env`. **Observe** `MENSAGEM` e `MODO` na lista de variáveis.",
      'Limpe os objetos desta etapa e da anterior:\n```sh\n$ kubectl delete -f app.yaml -f configmap-pod.yaml -f ../etapa03/meu-pod.yaml\nservice "meu-service" deleted\nconfigmap "minha-config" deleted\npod "pod-config" deleted\npod "meu-pod" deleted\n```\n(A ordem das linhas pode variar.) Feche também o terminal do `minikube service`, com Ctrl+C.',
    ],
    tip: "Regra de ouro: exponha o mínimo. Um banco de dados deve ser ClusterIP, invisível de fora. Apenas a porta de entrada do sistema vira NodePort ou LoadBalancer. Para senhas e chaves, o irmão seguro do ConfigMap é o Secret.",
    takeaway:
      "Service dá endereço fixo a Pods que mudam (achando-os por label); ConfigMap tira a configuração de dentro da imagem, mas variáveis de ambiente só mudam quando o Pod é recriado.",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa04-service-labels.svg",
            alt: "Um Service com selector app=A encaminha tráfego para três Pods com o label app: A, gerenciados por um Deployment e um ReplicaSet; um Pod com label app: B fica de fora.",
            caption:
              "O Service encontra os Pods pelo selector `app=A`, não pelo IP. O Pod com `app: B` não recebe tráfego desse Service. Deployment e ReplicaSet aparecem na Etapa 05.",
          },
        ],
        credit: "Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
    ],
  },
  {
    id: "m5",
    num: "05",
    navTitle: "Deployments",
    tag: "auto-cura + escala",
    title: "Auto-cura e escala com ReplicaSets e Deployments",
    lead: "Até aqui você criou Pods manualmente, o que serve para aprender. Em produção, três situações quebram esse modelo.",
    concept: [
      "Duas peças resolvem isso, uma embrulhando a outra.",
      "**ReplicaSet: garante o número de réplicas.** Você declara `replicas: 3` e ele monitora os Pods por label selector. Se um Pod some, o ReplicaSet percebe que a contagem caiu e cria outro em segundos, sem ninguém pedir. Essa é a **auto-cura**, o estado desejado da Etapa 01 mantido na prática. O ReplicaSet cuida de Pods que **desaparecem**. Se o que falha é só o processo dentro do container (um crash), o Pod continua existindo e quem reinicia o container é o kubelet, dentro do mesmo Pod; essa separação é detalhada na Etapa 07.",
      "**Deployment: gerencia versões.** Ele cria e gerencia o ReplicaSet por baixo dos panos e adiciona:",
      "- **Rolling Update**: ao trocar a imagem, o Deployment sobe réplicas novas e desliga as antigas gradualmente, e o serviço nunca fica fora do ar.",
      "- **Rollback**: se a versão nova quebrar, `kubectl rollout undo` volta para a anterior em segundos.",
      "- **Escala manual**: `kubectl scale --replicas=5` muda o número de réplicas com um comando.",
      "Cada versão do template tem o seu próprio ReplicaSet. Na troca de versão, o Deployment cria um ReplicaSet novo e vai reduzindo o antigo até zero. O nome de um Pod revela a quem ele pertence: em `nginx-fiap-7d4b9c-aaa`, o trecho `7d4b9c` identifica o ReplicaSet (a versão), e o sufixo final identifica o Pod. Quando o sufixo do meio muda no meio de um rolling update, você está vendo Pods de um ReplicaSet novo.",
      "Os YAMLs de ReplicaSet e Deployment são quase idênticos, mas no dia a dia usamos quase sempre o Deployment, justamente pelo controle de versão.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "ReplicaSet",
        d: "mantém N réplicas rodando sempre; se uma cai, nasce outra. Seleciona Pods por label selector.",
        color: "blue",
      },
      {
        t: "Deployment",
        d: "gerencia ReplicaSets e o histórico de versões; é o objeto que você usa na prática.",
        color: "signal",
      },
      {
        t: "template",
        d: "o molde de Pod embutido no Deployment (é o esqueleto de Pod da Etapa 03).",
        color: "violet",
      },
      {
        t: "Rolling Update",
        d: "troca gradual de versão, sem downtime.",
        color: "ember",
      },
      {
        t: "Rollback",
        d: "retorno a uma revisão anterior com `rollout undo`.",
        color: "blue",
      },
      {
        t: "Revisão",
        d: "cada alteração do template do Deployment gera uma revisão no histórico, e cada revisão corresponde a um ReplicaSet.",
        color: "signal",
      },
    ],
    examplesTitle: "O Deployment completo e o ciclo de vida",
    examples: [
      {
        label: "o Deployment completo e o ciclo de vida",
        lang: "yaml",
        code: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx-fiap\nspec:\n  replicas: 3                  # quero 3 cópias, sempre\n  selector:\n    matchLabels:\n      app: nginx-app           # gerencio os Pods com este label...\n  template:                    # ...e este é o "molde" de cada Pod\n    metadata:\n      labels:\n        app: nginx-app         # tem que casar com o selector ↑\n    spec:\n      containers:\n        - name: nginx\n          image: nginx:1.14.2  # trocar esta versão dispara o rolling update\n          ports:\n            - containerPort: 80',
        intro: "Crie a pasta `etapa05/` e salve o manifesto abaixo nela como `deployment.yaml`.",
        note: "O `template` é literalmente o esqueleto de Pod da Etapa 03 dentro do Deployment. Nada aqui é novo: o Deployment compõe peças que você já conhece.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: '$ kubectl apply -f deployment.yaml\ndeployment.apps/nginx-fiap created\n$ kubectl get pods\nnginx-fiap-7d4b9c-aaa   1/1   Running\nnginx-fiap-7d4b9c-bbb   1/1   Running\nnginx-fiap-7d4b9c-ccc   1/1   Running\n\n# O ReplicaSet que o Deployment criou por baixo dos panos\n# (o nome do RS é o prefixo dos nomes dos Pods)\n$ kubectl get rs\nNAME                DESIRED   CURRENT   READY   AGE\nnginx-fiap-7d4b9c   3         3         3       30s\n\n# Mate um pod de propósito:\n$ kubectl delete pod nginx-fiap-7d4b9c-aaa\npod "nginx-fiap-7d4b9c-aaa" deleted\n\n# Olhe de novo: um pod NOVO já está nascendo pra manter as 3 réplicas\n$ kubectl get pods\nnginx-fiap-7d4b9c-bbb   1/1   Running\nnginx-fiap-7d4b9c-ccc   1/1   Running\nnginx-fiap-7d4b9c-ddd   0/1   ContainerCreating   ← auto-cura',
        note: "Nas saídas desta etapa, as colunas RESTARTS e AGE foram omitidas para caber na tela, e os sufixos dos nomes mudam a cada execução (os hashes do exemplo são ilustrativos).",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: '# Rolling update: troca a imagem\n$ kubectl set image deployment/nginx-fiap nginx=nginx:1.16.1\ndeployment.apps/nginx-fiap image updated\n$ kubectl rollout status deployment/nginx-fiap\ndeployment "nginx-fiap" successfully rolled out\n\n# Um ReplicaSet novo assumiu; o antigo ficou com 0 réplicas (mas continua\n# existindo, é ele que permite o rollback)\n$ kubectl get rs\nNAME                DESIRED   CURRENT   READY   AGE\nnginx-fiap-6b5d8f   3         3         3       20s\nnginx-fiap-7d4b9c   0         0         0       2m\n\n# Quebre de propósito (imagem que não existe):\n$ kubectl set image deployment/nginx-fiap nginx=nginx:nao-existe\n$ kubectl get pods\nnginx-fiap-6b5d8f-bbb   1/1   Running            ← antigos seguram o serviço\nnginx-fiap-9f8e2a-xyz   0/1   ImagePullBackOff   ← novos travados\n\n# Um terceiro ReplicaSet apareceu, com 1 Pod que nunca fica pronto\n$ kubectl get rs\nNAME                DESIRED   CURRENT   READY   AGE\nnginx-fiap-6b5d8f   3         3         3       1m\nnginx-fiap-7d4b9c   0         0         0       3m\nnginx-fiap-9f8e2a   1         1         0       15s\n\n# Rollback: volta para a revisão anterior à quebrada (nginx:1.16.1)\n$ kubectl rollout undo deployment/nginx-fiap\ndeployment.apps/nginx-fiap rolled back\n\n# Revisões registradas (formato aproximado)\n$ kubectl rollout history deployment/nginx-fiap\nREVISION  CHANGE-CAUSE\n1         <none>\n3         <none>\n4         <none>',
        note: "O K8s só desliga os Pods antigos quando os novos ficam prontos. Como a imagem quebrada nunca fica pronta, os antigos continuam servindo e o serviço permanece no ar. Um deploy quebrado não derruba o que já funcionava. Repare também que o `undo` volta para a revisão imediatamente anterior, que aqui usava `nginx:1.16.1`, e não para a original `nginx:1.14.2`. A revisão restaurada ganha um número novo no histórico (a 2 reaparece como 4) e reaproveita o ReplicaSet dela (`6b5d8f`), enquanto o ReplicaSet da versão quebrada (`9f8e2a`) volta a 0 réplicas.",
      },
    ],
    commands: [
      {
        cmd: "kubectl get rs",
        note: "lista os ReplicaSets (um por versão do template)",
      },
      {
        cmd: "kubectl scale deployment <nome> --replicas=5",
        note: "escala manual",
      },
      {
        cmd: "kubectl set image deployment/<nome> ctn=img:tag",
        note: "dispara um rolling update",
      },
      {
        cmd: "kubectl rollout status deployment/<nome>",
        note: "acompanha a troca",
      },
      {
        cmd: "kubectl rollout history deployment/<nome>",
        note: "lista as revisões",
      },
      {
        cmd: "kubectl rollout undo deployment/<nome>",
        note: "faz o rollback",
      },
    ],
    handsOn: [
      "Aplique o `deployment.yaml` e confirme os 3 pods `Running`. Rode também `kubectl get rs` e **observe** o ReplicaSet `nginx-fiap-<hash>` com 3 réplicas: o prefixo dos nomes dos Pods é o nome dele.",
      "Delete um pod na mão (copie um nome real do `kubectl get pods`) e rode `kubectl get pods` de novo, rápido. **Observe** o substituto em `ContainerCreating`. Você tentou violar o estado desejado e o cluster corrigiu.",
      "Rode o rolling update para `nginx:1.16.1` e acompanhe com `kubectl rollout status`. **Observe** a mensagem de sucesso. Rode `kubectl get rs` e **observe** que há agora dois ReplicaSets: o novo com 3 réplicas e o antigo com 0. É por isso que o sufixo do nome dos Pods mudou.",
      "Quebre de propósito com a imagem `nginx:nao-existe`. **Observe** no `kubectl get pods` os pods antigos `Running` segurando o serviço e os novos em `ImagePullBackOff`, e no `kubectl get rs` um terceiro ReplicaSet com `READY 0`.",
      "Execute `kubectl rollout undo deployment/nginx-fiap` e confirme com `kubectl rollout history deployment/nginx-fiap`. **Observe** que a lista vai 1, 3, 4: a revisão 2 virou a 4. Confirme a imagem atual com `kubectl describe deployment nginx-fiap | grep Image`, que deve mostrar `nginx:1.16.1`. Você fez um rollback em um comando.",
      'Limpe: `kubectl delete -f deployment.yaml` (saída: `deployment.apps "nginx-fiap" deleted`). Os ReplicaSets e Pods do Deployment são removidos junto.',
    ],
    tip: 'Faça o teste da auto-cura pelo menos uma vez: aplicar o deployment, deletar um pod na mão e ver o substituto nascer. É nesse momento que o modelo de "estado desejado" deixa de ser teoria.',
    takeaway:
      "Ninguém cria Pod avulso em produção: o Deployment garante N réplicas (auto-cura), troca versões sem downtime e volta atrás em um comando, usando um ReplicaSet por versão.",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa05-rolling-update-1.svg",
            alt: "Rolling update, quadro 1: um Service na frente de quatro Pods da versão antiga, espalhados por três nós, e o Deployment controlando todos.",
            caption:
              "1. Antes da atualização: todos os Pods rodam a versão antiga atrás do Service.",
          },
          {
            src: "/guides/kubernetes/etapa05-rolling-update-2.svg",
            alt: "Rolling update, quadro 2: um Pod da versão nova aparece com um IP novo, e um Pod antigo começa a sair.",
            caption: "2. Um Pod novo sobe com outro IP; um antigo começa a sair.",
          },
          {
            src: "/guides/kubernetes/etapa05-rolling-update-3.svg",
            alt: "Rolling update, quadro 3: mais um Pod da versão nova entra com IP novo; ainda há Pods antigos atendendo.",
            caption:
              "3. A troca continua um Pod por vez, e o Service segue atendendo com os Pods prontos.",
          },
          {
            src: "/guides/kubernetes/etapa05-rolling-update-4.svg",
            alt: "Rolling update, quadro 4: todos os Pods rodam a versão nova, com IPs novos, atrás do mesmo Service.",
            caption:
              "4. Fim: todos os Pods estão na versão nova, e o endereço do Service não mudou.",
          },
        ],
        credit: "Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
    ],
    handsOnIntro: "Este é o exercício central do guia. Vá com calma e observe cada estado.",
  },
  {
    id: "m6",
    num: "06",
    navTitle: "Volumes",
    tag: "persistência de dados",
    title: "Volumes, dados que sobrevivem ao Pod",
    lead: "Pods são efêmeros, e a Etapa 05 mostrou como isso é frequente: pods são recriados a cada rolling update. Para uma API sem estado isso é ótimo. Para um banco de dados é um desastre. Imagine o Pod do PostgreSQL do e-commerce sendo recriado durante um update, e todos os pedidos da Black Friday desaparecendo junto, porque estavam gravados no sistema de arquivos do container. Dados de verdade não podem viver dentro do container.",
    concept: [
      "O Kubernetes resolve isso com uma cadeia de quatro conceitos: **Volume**, **PersistentVolume (PV)**, **PersistentVolumeClaim (PVC)** e **StorageClass (SC)**.",
      '- O **PVC** é o *pedido* de armazenamento: "quero 1Gi, leitura e escrita por um nó".',
      "- O **PV** é o *disco real* que atende o pedido (NFS, EBS da AWS, hostPath e outros).",
      "- A **StorageClass** descreve *tipos* de disco (padrão, SSD rápido) e permite que o cluster crie PVs automaticamente quando um PVC os solicita.",
      "O Pod referencia apenas o PVC e não precisa saber onde o disco fica fisicamente. Essa separação permite que o mesmo YAML de Pod rode no Minikube e na AWS, mudando só o que atende o pedido. No Minikube, a StorageClass `standard` já provisiona PVs automaticamente: você cria o PVC e o PV aparece.",
      "Os **tipos de volume** mais comuns:",
      "- **emptyDir**: nasce vazio junto com o Pod e **morre com o Pod**. Serve para arquivos temporários e para compartilhar dados entre containers do mesmo Pod.",
      "- **hostPath**: monta um diretório do nó dentro do container. É útil em desenvolvimento e perigoso em produção, porque amarra o Pod àquele nó.",
      "- **persistentVolumeClaim**: o jeito correto para dados de verdade, que sobrevivem a reinício e recriação do Pod.",
      "Os **modos de acesso** do PVC definem quem pode montar o volume:",
      "- **ReadWriteOnce (RWO)**: leitura e escrita por um único nó. É o caso típico de banco de dados.",
      "- **ReadOnlyMany (ROX)**: somente leitura, por vários nós. Serve para assets estáticos.",
      "- **ReadWriteMany (RWX)**: leitura e escrita por vários nós. Exige NFS ou um backend equivalente.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "emptyDir",
        d: "volume temporário que vive e morre com o Pod.",
        color: "blue",
      },
      {
        t: "hostPath",
        d: "diretório do nó montado no container; amarra o Pod ao nó.",
        color: "signal",
      },
      {
        t: "PVC (PersistentVolumeClaim)",
        d: "pedido de armazenamento feito pelo usuário.",
        color: "violet",
      },
      {
        t: "PV (PersistentVolume)",
        d: "o disco que atende o pedido.",
        color: "ember",
      },
      {
        t: "StorageClass",
        d: "perfil de armazenamento que provisiona PVs automaticamente.",
        color: "blue",
      },
      {
        t: "Bound",
        d: "status que indica que o PVC foi vinculado a um PV.",
        color: "signal",
      },
      {
        t: "volumeMounts / volumes",
        d: "no Pod, `volumes` declara a origem e `volumeMounts` define onde ela aparece dentro do container.",
        color: "violet",
      },
    ],
    examplesTitle: "Escreva, destrua, leia de volta",
    examples: [
      {
        label: "pvc.yaml",
        lang: "yaml",
        code: '# pvc.yaml\napiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: meu-pvc\nspec:\n  accessModes:\n    - ReadWriteOnce            # um nó lê e escreve (típico de banco)\n  resources:\n    requests:\n      storage: 1Gi             # quanto disco eu quero\n# no Minikube, a StorageClass "standard" provisiona o PV sozinha',
        intro: "Crie a pasta `etapa06/` e salve os manifestos desta etapa nela.",
      },
      {
        label: "pod-com-pvc.yaml",
        lang: "yaml",
        code: "# pod-com-pvc.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: pod-persistente\nspec:\n  containers:\n    - name: app\n      image: nginx:1.14.2\n      volumeMounts:\n        - name: dados\n          mountPath: /dados    # onde o volume aparece no container\n  volumes:\n    - name: dados\n      persistentVolumeClaim:   # ← aponta pro PVC (em vez de emptyDir)\n        claimName: meu-pvc",
      },
      {
        label: "terminal",
        lang: "sh",
        code: '$ kubectl apply -f pvc.yaml -f pod-com-pvc.yaml\npersistentvolumeclaim/meu-pvc created\npod/pod-persistente created\n\n# Bound = o PV foi criado e vinculado ao pedido\n$ kubectl get pvc\nNAME      STATUS   VOLUME         CAPACITY   ACCESS MODES\nmeu-pvc   Bound    pvc-3f2a1...   1Gi        RWO\n\n# Escreva um arquivo no volume\n$ kubectl exec pod-persistente -- sh -c "echo \'sobrevivi!\' > /dados/teste.txt"\n\n# DESTRUA o pod (o PVC continua existindo)\n$ kubectl delete pod pod-persistente\npod "pod-persistente" deleted\n\n# Recrie o pod e leia o arquivo:\n$ kubectl apply -f pod-com-pvc.yaml\npod/pod-persistente created\n$ kubectl exec pod-persistente -- cat /dados/teste.txt\nsobrevivi!            ← o Pod morreu, o dado não',
        note: "Para ver o contraste, crie um segundo manifesto, `pod-emptydir.yaml`, com **outro nome de Pod** e um `emptyDir` no lugar do PVC. Não edite o `pod-com-pvc.yaml` e reaplique: o `spec` de um Pod existente não pode ser alterado (o Kubernetes recusa a mudança de volumes), então a alteração só funciona se o Pod for apagado e criado de novo, ou se for um arquivo e um nome novos, como aqui.",
      },
      {
        label: "pod-emptydir.yaml",
        lang: "yaml",
        code: "# pod-emptydir.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: pod-efemero              # nome diferente do pod-persistente\nspec:\n  containers:\n    - name: app\n      image: nginx:1.14.2\n      volumeMounts:\n        - name: dados\n          mountPath: /dados      # mesmo ponto de montagem do exemplo anterior\n  volumes:\n    - name: dados\n      emptyDir: {}               # nasce vazio com o Pod e morre com o Pod",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: '$ kubectl apply -f pod-emptydir.yaml\npod/pod-efemero created\n\n# Escreva o arquivo, destrua o Pod e recrie-o a partir do mesmo YAML\n$ kubectl exec pod-efemero -- sh -c "echo \'vou sumir\' > /dados/teste.txt"\n$ kubectl delete pod pod-efemero\npod "pod-efemero" deleted\n$ kubectl apply -f pod-emptydir.yaml\npod/pod-efemero created\n\n# O arquivo não existe mais: o emptyDir morreu junto com o Pod antigo\n$ kubectl exec pod-efemero -- cat /dados/teste.txt\ncat: /dados/teste.txt: No such file or directory\ncommand terminated with exit code 1',
      },
    ],
    commands: [
      {
        cmd: "kubectl get pvc",
        note: "lista os pedidos de volume (`Bound` indica sucesso)",
      },
      {
        cmd: "kubectl get pv",
        note: "lista os discos persistentes do cluster",
      },
      {
        cmd: "kubectl delete pvc <nome>",
        note: "remove o pedido. Com a StorageClass `standard` do Minikube, o PV correspondente costuma ser apagado junto, com os dados (a política de reclaim padrão é `Delete`; confira a do seu cluster com `kubectl get storageclass`)",
      },
    ],
    handsOn: [
      "Aplique o PVC e rode `kubectl get pvc`. **Observe** o `STATUS Bound`: o pedido foi atendido por um PV criado automaticamente. Confirme com `kubectl get pv`.",
      "Execute a sequência completa do exemplo: escrever o arquivo, deletar o pod, recriar o pod, ler o arquivo. **Observe** o `sobrevivi!` voltar. Esse é o contrato do PVC.",
      "Experimento de contraste: salve o `pod-emptydir.yaml` e repita a sequência (escrever, deletar, recriar, ler). **Observe** o `No such file or directory` no final: o arquivo sumiu. Essa é a diferença entre efêmero e persistente, vista na prática.",
      "Limpe, nesta ordem: `kubectl delete pod pod-persistente pod-efemero` e depois `kubectl delete pvc meu-pvc`. Com o PVC apagado, `kubectl get pv` deve ficar vazio (o PV foi removido junto, como descrito acima).",
    ],
    tip: "Dado importante sempre fica atrás de um PVC. Se os dados sumiram após um restart ou uma recriação, quase certamente estavam em `emptyDir` ou no sistema de arquivos do próprio container.",
    takeaway:
      "PVC é o pedido, PV é o disco, StorageClass descreve os tipos de disco, e dado que importa mora sempre atrás de um PVC.",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa06-pvc.svg",
            alt: "O pod-persistente monta /dados a partir do PVC meu-pvc, que pede 1Gi em ReadWriteOnce e está Bound; o PVC é atendido por um PV criado automaticamente pela StorageClass standard, e os dados sobrevivem à recriação do Pod. Embaixo, o pod-efemero usa emptyDir, que nasce vazio e morre com o Pod.",
            caption:
              "O Pod só conhece o PVC, o pedido. Quem atende é o PV, criado pela StorageClass `standard` do Minikube. Com `emptyDir`, o dado vive só enquanto o Pod existir.",
          },
        ],
        credit: "Diagrama: feito para este guia",
      },
    ],
  },
  {
    id: "m7",
    num: "07",
    navTitle: "Probes",
    tag: "saúde do app",
    title: "Probes, como o cluster sabe que seu app está vivo",
    lead: 'Às 3h da manhã, o seu app entra em deadlock. O processo continua de pé, então para o Kubernetes está tudo `Running`, mas nenhuma requisição é respondida. Os mecanismos de recuperação que você viu até aqui agem quando um processo termina ou quando um Pod some; nenhum deles enxerga um processo vivo porém travado. Existe ainda um caso parecido: o app acabou de subir, mas ainda está carregando dados e não deveria receber tráfego, e o Service já está mandando requisições para ele. Sem informação extra, o cluster não distingue "rodando" de "funcionando".',
    concept: [
      'Antes das probes, convém separar três situações que no dia a dia todo mundo chama de "o app caiu", porque cada uma é tratada por um mecanismo diferente:',
      "1. **O processo dentro do container termina** (um crash, falta de memória, uma exceção não tratada). O Pod continua existindo e quem reage é o **kubelet** do nó: ele reinicia o **container dentro do mesmo Pod**, conforme a `restartPolicy` do Pod (o padrão é `Always`). O nome e o IP do Pod não mudam, e a coluna `RESTARTS` sobe. Isso acontece sem nenhuma probe configurada.",
      "1. **O Pod some** (alguém o apagou, o nó caiu). O Pod inteiro deixa de existir e quem reage é o **ReplicaSet** (Etapa 05), que cria um **Pod novo**, com nome e IP novos. Um Pod avulso, sem ReplicaSet ou Deployment, não volta.",
      "1. **O processo continua vivo, mas travado** (deadlock, loop infinito, dependência esgotada). Nada terminou e nenhum Pod sumiu, então os dois mecanismos anteriores não percebem. Só uma **probe de liveness** detecta, e quando ela falha o kubelet reinicia o container, como no caso 1.",
      "As **probes** são verificações de saúde declaradas no manifesto do Pod. O kubelet as executa periodicamente e age conforme o resultado.",
      "São três probes, e o ponto mais importante é o que acontece quando cada uma **falha**:",
      '- **Liveness** pergunta "está vivo?". Se falha, o kubelet **reinicia o container** (dentro do mesmo Pod). É para apps que travam e só voltam com restart.',
      '- **Readiness** pergunta "está pronto para receber requisições?". Se falha, o Pod **sai do balanceador** (o Service para de mandar tráfego) **sem ser reiniciado**. É para apps que carregam dados antes de atender ou que ficam temporariamente indisponíveis.',
      '- **Startup** pergunta "terminou de inicializar?". Enquanto roda, **segura as outras probes**, evitando que a liveness mate um app lento antes da hora.',
      "Cada probe pode verificar de três formas:",
      "- **httpGet**: o kubelet faz um GET em um endpoint (por exemplo `/health`) e espera um status de sucesso (200 OK). É o mais comum. Um status de erro, como 404 ou 500, conta como falha.",
      "- **tcpSocket**: testa se a porta aceita conexão. Serve para serviços que não falam HTTP.",
      "- **exec**: executa um comando dentro do container; código de saída 0 significa saudável.",
      "Boas práticas da aula: use as três probes juntas em produção; use endpoints diferentes para cada probe; comece pelas configurações padrão e ajuste intervalos só quando o app pedir; monitore as falhas de probe (por exemplo, com Prometheus), porque elas são o primeiro sinal de problema.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "restartPolicy",
        d: "política do Pod para containers que terminam (padrão `Always`); é o que reinicia um container que caiu, com ou sem probes.",
        color: "blue",
      },
      {
        t: "Liveness probe",
        d: "falhou, o kubelet reinicia o container.",
        color: "signal",
      },
      {
        t: "Readiness probe",
        d: "falhou, o Pod sai do balanceador sem reiniciar.",
        color: "violet",
      },
      {
        t: "Startup probe",
        d: "enquanto não passa, as outras ficam suspensas.",
        color: "ember",
      },
      {
        t: "httpGet / tcpSocket / exec",
        d: "os três mecanismos de verificação.",
        color: "blue",
      },
      {
        t: "periodSeconds",
        d: "de quantos em quantos segundos a probe roda.",
        color: "signal",
      },
      {
        t: "failureThreshold",
        d: "quantas falhas seguidas são toleradas antes de agir (o padrão é 3).",
        color: "violet",
      },
      {
        t: "initialDelaySeconds",
        d: "quanto esperar antes da primeira verificação.",
        color: "ember",
      },
    ],
    examplesTitle: "Exemplos comentados",
    examples: [
      {
        label: "Pod com as três probes",
        lang: "yaml",
        code: "apiVersion: v1\nkind: Pod\nmetadata:\n  name: exemplo-probes\nspec:\n  containers:\n    - name: app\n      image: exemplo:latest\n      ports:\n        - containerPort: 80\n      livenessProbe:           # falhou → REINICIA o container\n        httpGet:\n          path: /health\n          port: 80\n        periodSeconds: 10      # verifica a cada 10s\n        timeoutSeconds: 5\n        failureThreshold: 3    # 3 falhas seguidas → reinicia (3 é o padrão)\n      readinessProbe:          # falhou → SAI do balanceador\n        httpGet:\n          path: /ready         # boa prática: endpoint separado\n          port: 80\n        periodSeconds: 5\n      startupProbe:            # segura as outras até o app subir\n        httpGet:\n          path: /startup\n          port: 80\n        initialDelaySeconds: 120   # app lento: espera 2min\n        periodSeconds: 30",
        note: "Este YAML é ilustrativo: a imagem `exemplo:latest` é fictícia. O experimento executável vem a seguir, e na Etapa 09 você verá as probes funcionando em uma imagem real. Uma ressalva sobre a `startupProbe` do exemplo: o `initialDelaySeconds: 120` é válido, mas a forma mais comum de dar tempo a um app lento é multiplicar `failureThreshold` por `periodSeconds` (por exemplo, 30 tentativas a cada 10 segundos dão até 300 segundos). Assim a startupProbe termina assim que o app responde, em vez de esperar sempre um atraso fixo.",
      },
      {
        label: "liveness-exec.yaml",
        lang: "yaml",
        code: "# liveness-exec.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: liveness-exec\nspec:\n  containers:\n    - name: liveness\n      image: busybox\n      args:                         # o roteiro da sabotagem:\n        - /bin/sh\n        - -c\n        - touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600\n      livenessProbe:\n        exec:\n          command:                  # probe: arquivo existe? (exit 0 = saudável)\n            - cat\n            - /tmp/healthy\n        initialDelaySeconds: 5     # espera 5s antes da 1ª verificação\n        periodSeconds: 5           # verifica a cada 5s",
        intro:
          'Salve o manifesto em `etapa07/liveness-exec.yaml`. A ideia é usar um container busybox que cria o arquivo `/tmp/healthy`, vive 30 segundos "saudável", apaga o arquivo e continua rodando. A liveness probe executa `cat /tmp/healthy`: com o arquivo presente, o comando sai com 0 (saudável); sem o arquivo, falha. Este é o caso 3 da lista acima: o processo continua vivo (o `sleep 600`), mas deixa de estar saudável.',
      },
      {
        label: "terminal",
        lang: "sh",
        code: '$ kubectl apply -f liveness-exec.yaml\npod/liveness-exec created\n\n# Assista em tempo real (Ctrl+C pra sair).\n# Saída abreviada: cada linha nova aparece com dezenas de segundos de\n# intervalo. O trecho "(Ns ago)" mostra há quanto tempo foi o último\n# reinício, e não o intervalo entre um reinício e o seguinte. O primeiro\n# reinício surge cerca de 45s depois do início; os seguintes demoram mais,\n# porque o kubelet espera o container encerrar antes de recriá-lo.\n$ kubectl get pods -w\nNAME            READY   STATUS    RESTARTS\nliveness-exec   1/1     Running   0                ← logo após o início\nliveness-exec   1/1     Running   1 (2s ago)       ← cerca de 45s depois: restart automático\nliveness-exec   1/1     Running   2 (1s ago)       ← um ciclo depois, bem mais tarde: e de novo...\n\n# Investigue como um profissional:\n$ kubectl describe pod liveness-exec\nEvents:\n  Warning  Unhealthy  Liveness probe failed: cat: /tmp/healthy: No such file\n  Normal   Killing    Container liveness failed liveness probe, will be restarted',
        note: "A linha do tempo do experimento: 30s saudável, o arquivo é apagado, 3 falhas seguidas (o padrão de `failureThreshold`), o kubelet reinicia o container. Como o script recomeça do zero após o restart, o ciclo se repete indefinidamente, de propósito, para você observar. Repare que o Pod é sempre o mesmo (`liveness-exec`): quem foi reiniciado foi o container. Agora, para enxergar a diferença com o caso 1, provoque um crash sem nenhuma probe:",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: '# Um container que termina com erro 5 segundos depois de subir, sem probes\n$ kubectl run crash --image=busybox -- /bin/sh -c "sleep 5; exit 1"\npod/crash created\n\n# O kubelet reinicia o container sozinho (restartPolicy Always), com\n# intervalos cada vez maiores entre as tentativas (formato aproximado)\n$ kubectl get pods\nNAME    READY   STATUS             RESTARTS      AGE\ncrash   0/1     CrashLoopBackOff   2 (20s ago)   50s\n\n$ kubectl describe pod crash\n(...)\n    Last State:     Terminated\n      Reason:       Error\n      Exit Code:    1\n(...)\n# Nenhum evento "Liveness probe failed": não há probe nenhuma, e o\n# container mesmo assim foi reiniciado pelo kubelet.',
      },
    ],
    commands: [
      {
        cmd: "kubectl get pods -w",
        note: "acompanha mudanças em tempo real",
      },
      {
        cmd: "kubectl describe pod <nome>",
        note: "os Events mostram as falhas de probe; `Last State` mostra por que o container anterior terminou",
      },
    ],
    handsOn: [
      "Aplique o `liveness-exec.yaml` e rode `kubectl get pods -w`. **Observe** a coluna `RESTARTS` subir sozinha: a primeira reinicialização aparece cerca de 45 segundos após o início (30s saudável mais 3 falhas espaçadas de 5s). Cada incremento é o kubelet reiniciando um container que parou de passar na verificação.",
      "Em outro terminal, rode `kubectl describe pod liveness-exec`. **Observe** nos Events o par `Warning Unhealthy` seguido de `Normal Killing`. Aprenda a reconhecer essa dupla: em produção, ela é o diagnóstico de probe falhando.",
      "Rode o experimento do crash (`kubectl run crash ...`) e compare. **Observe** que o `RESTARTS` também sobe, mas o `describe` mostra `Last State: Terminated` com `Exit Code: 1` e nenhum evento `Liveness probe failed`. Este é o caso 1, tratado pelo kubelet sem probe; o do passo 2 é o caso 3, que só a liveness resolve.",
      "Limpe: `kubectl delete pod liveness-exec crash`.",
    ],
    tip: "`Running` não significa saudável. Um app pode estar rodando e travado em um deadlock. É exatamente por isso que as probes existem.",
    takeaway:
      "Processo que cai o kubelet reinicia, Pod que some o ReplicaSet recria, e processo vivo porém travado só a liveness detecta: liveness falhou reinicia o container, readiness falhou tira o Pod do balanceador sem reiniciar, e startup segura as duas até o app terminar de subir.",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa07-probes.svg",
            alt: "Três probes do Pod exemplo-probes, executadas pelo kubelet: livenessProbe em /health, que ao falhar faz o kubelet reiniciar o container no mesmo Pod; readinessProbe em /ready, que ao falhar tira o Pod do Service sem reiniciar; e startupProbe em /startup, que segura as outras duas enquanto não passa.",
            caption:
              "O que importa é a consequência de cada falha: liveness reinicia, readiness tira do tráfego, startup adia as outras. Sem probe, o kubelet só reinicia o container quando o processo termina.",
          },
        ],
        credit: "Diagrama: feito para este guia",
      },
    ],
  },
  {
    id: "m8",
    num: "08",
    navTitle: "Autoscaling (HPA)",
    tag: "escala automática",
    title: "HPA, escala automática baseada em métricas",
    lead: "Volte ao e-commerce da Etapa 01: chegou a Black Friday. Você já sabe escalar manualmente com `kubectl scale --replicas=...` (Etapa 05). Ficar de plantão no terminal ajustando réplicas a cada pico de acesso, inclusive às 2h da manhã, não é viável. O cluster deve medir a carga e ajustar o número de réplicas sozinho.",
    concept: [
      "O **Horizontal Pod Autoscaler (HPA)** monitora métricas dos Pods (CPU, memória e outras) e ajusta o número de réplicas entre um mínimo e um máximo definidos por você.",
      "O funcionamento: o HPA compara a utilização atual dos Pods com o **alvo** configurado (por exemplo, manter a média de CPU em 70%). Se a utilização passa do alvo, ele cria réplicas, até o máximo. Se cai, ele remove réplicas, até o mínimo, economizando recursos. O **scale down é propositalmente lento** (cerca de 5 minutos de estabilidade) para evitar oscilações constantes diante de variações rápidas de carga.",
      "Quando um HPA passa a controlar um Deployment, é ele quem decide o número de réplicas dentro da faixa `minReplicas` a `maxReplicas`. O valor `replicas` escrito no manifesto do Deployment vale só até o HPA agir: se ele for maior que o piso e não houver carga, o HPA o reduz depois de alguns minutos (você vai ver isso na Etapa 09).",
      "**Quais métricas o HPA consegue usar.** CPU e memória são lidas nativamente, por meio do metrics-server. As demais exigem componentes adicionais instalados no cluster: métricas personalizadas do seu app (requisições por segundo, tamanho de fila), métricas externas (por exemplo, vindas do Prometheus) e E/S de disco precisam de um adaptador de métricas customizadas ou externas. Sem esse adaptador, só CPU e memória estão disponíveis. A métrica certa depende do perfil do app: um app pesado em CPU escala por CPU; um que consome muita RAM escala por memória.",
      "Dois pré-requisitos costumam ser esquecidos:",
      "1. O cluster precisa do **metrics-server** para ler CPU e memória. No Minikube: `minikube addons enable metrics-server`.",
      '1. O container **precisa declarar `resources.requests.cpu`**, porque "70% de CPU" significa 70% **do que o Pod pediu**. Sem requests, o HPA mostra `<unknown>` e não escala.',
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "HPA",
        d: "controlador que ajusta o número de réplicas de um Deployment conforme métricas.",
        color: "blue",
      },
      {
        t: "metrics-server",
        d: "componente que coleta CPU e memória dos Pods; pré-requisito do HPA.",
        color: "signal",
      },
      {
        t: "resources.requests",
        d: "quantidade de recurso que o container declara precisar; base do cálculo de percentual.",
        color: "violet",
      },
      {
        t: "resources.limits",
        d: "teto de recurso que o container pode consumir.",
        color: "ember",
      },
      {
        t: "milicore (m)",
        d: "unidade de CPU; `100m` equivale a 0,1 CPU.",
        color: "blue",
      },
      {
        t: "minReplicas / maxReplicas",
        d: "piso e teto de réplicas; o HPA trabalha dentro dessa faixa.",
        color: "signal",
      },
      {
        t: "averageUtilization",
        d: "percentual médio de uso, relativo ao `requests`, que o HPA tenta manter.",
        color: "violet",
      },
      {
        t: "Adaptador de métricas",
        d: "componente extra necessário para métricas que não sejam CPU ou memória.",
        color: "ember",
      },
    ],
    examplesTitle: "Deployment, HPA, Service e teste de carga",
    examples: [
      {
        label: "deployment.yaml",
        lang: "yaml",
        code: '# deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx-hpa\nspec:\n  replicas: 1                  # começa com 1; o HPA assume daqui\n  selector:\n    matchLabels:\n      app: nginx-hpa\n  template:\n    metadata:\n      labels:\n        app: nginx-hpa\n    spec:\n      containers:\n        - name: nginx\n          image: nginx:1.14.2\n          resources:           # SEM requests o HPA não calcula %\n            requests:\n              cpu: "100m"      # 100 milicores = 0,1 CPU\n            limits:\n              cpu: "200m"',
        intro:
          "Crie a pasta `etapa08/` e salve os três manifestos nela (os nomes `deployment.yaml` e `service.yaml` também aparecem na Etapa 09, por isso a separação por pasta).",
      },
      {
        label: "hpa.yaml",
        lang: "yaml",
        code: "# hpa.yaml\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: nginx-hpa\nspec:\n  scaleTargetRef:              # QUEM o HPA controla\n    apiVersion: apps/v1\n    kind: Deployment\n    name: nginx-hpa\n  minReplicas: 1               # piso\n  maxReplicas: 10              # teto\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 70   # alvo: média de CPU em 70%",
        note: "Para o gerador de carga encontrar o app pelo nome, crie também um Service ClusterIP chamado `nginx-hpa`, no mesmo padrão da Etapa 04:",
      },
      {
        label: "service.yaml",
        lang: "yaml",
        code: "# service.yaml\napiVersion: v1\nkind: Service\nmetadata:\n  name: nginx-hpa              # hostname interno usado pelo gerador\nspec:\n  type: ClusterIP              # só tráfego interno (regra de ouro da Etapa 04)\n  selector:\n    app: nginx-hpa             # casa com o label dos pods do Deployment\n  ports:\n    - port: 80\n      targetPort: 80",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# Pré-requisito: metrics-server\n$ minikube addons enable metrics-server\n💡  metrics-server is an addon maintained by Kubernetes. (...)\n🌟  The 'metrics-server' addon is enabled\n\n$ kubectl apply -f deployment.yaml -f hpa.yaml -f service.yaml\ndeployment.apps/nginx-hpa created\nhorizontalpodautoscaler.autoscaling/nginx-hpa created\nservice/nginx-hpa created\n\n# Gere carga de dentro do cluster:\n$ kubectl run gerador --image=busybox -it --rm -- /bin/sh -c \\\n  \"while true; do wget -q -O- http://nginx-hpa; done\"\n\n# Em OUTRO terminal, assista:\n$ kubectl get hpa -w\nNAME        TARGETS         MINPODS  MAXPODS  REPLICAS\nnginx-hpa   cpu: 0%/70%     1        10       1\nnginx-hpa   cpu: 152%/70%   1        10       1\nnginx-hpa   cpu: 152%/70%   1        10       3    ← escalou sozinho\n\n# Métrica crua que alimenta o HPA (formato aproximado):\n$ kubectl top pods\nNAME                        CPU(cores)   MEMORY(bytes)\nnginx-hpa-5d8f7b6c4-abcde   152m         3Mi\n\n# Pare a carga (Ctrl+C) e aguarde ~5min: as réplicas encolhem de volta.",
        note: 'Em produção, ferramentas como K6 e JMeter fazem esse teste de carga de forma controlada. **Plano B, se o TARGETS não passar de 70%.** O nginx servindo uma página estática é eficiente demais e um único gerador pode não produzir carga suficiente. Há três saídas, da mais simples à mais fiel ao tutorial oficial do Kubernetes: • Rode 2 ou 3 geradores em paralelo: repita o `kubectl run` em outros terminais, trocando o nome (`gerador2`, `gerador3`). • Reduza `requests.cpu` para `"50m"` no Deployment e reaplique. O mesmo consumo passa a valer o dobro em percentual. • Troque a imagem por `registry.k8s.io/hpa-example` (o php-apache do tutorial oficial, que consome CPU a cada requisição e foi feito para esta demonstração).',
      },
    ],
    commands: [
      {
        cmd: "minikube addons enable metrics-server",
        note: "pré-requisito do HPA",
      },
      {
        cmd: "kubectl get hpa -w",
        note: "acompanha o HPA reagindo à carga",
      },
      {
        cmd: "kubectl top pods",
        note: "CPU e memória por pod",
      },
      {
        cmd: "kubectl autoscale deployment <n> --cpu-percent=70 --min=1 --max=10",
        note: "cria um HPA de forma imperativa",
      },
    ],
    handsOn: [
      "Ative o metrics-server e aplique os três YAMLs (Deployment, HPA, Service). Rode `kubectl get hpa` e **observe** os targets. Se aparecer `<unknown>`, aguarde cerca de 1 minuto: o metrics-server precisa coletar a primeira leitura.",
      "Suba o gerador de carga em um terminal e rode `kubectl get hpa -w` em outro. **Observe** o percentual de CPU passar de 70% e, em seguida, a coluna `REPLICAS` subir. Se o percentual estacionar abaixo do alvo, use o plano B. Confirme com `kubectl get pods`: pods novos nasceram sem nenhum comando seu.",
      "Pare a carga (Ctrl+C) e continue assistindo. **Observe** que as réplicas levam cerca de 5 minutos para encolher. Essa lentidão é proposital.",
      "Rode `kubectl top pods` durante o teste para ver a métrica crua que alimenta o HPA.",
      "Limpe: `kubectl delete -f deployment.yaml -f hpa.yaml -f service.yaml`. O pod `gerador` foi criado com `--rm` e já se apagou quando você interrompeu a carga; confirme com `kubectl get pods`. Mantenha o metrics-server ativo, porque a Etapa 09 também usa o HPA.",
    ],
    tip: "Se o `kubectl get hpa` mostra `<unknown>` nos targets, há duas causas possíveis: o metrics-server não está ativo ou o container não declarou `resources.requests`.",
    takeaway:
      "HPA é o estado desejado aplicado à escala: você define alvo, piso e teto, mas sem metrics-server e sem resources.requests ele não enxerga nada, e só CPU e memória vêm prontos (o resto exige um adaptador).",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa08-hpa.svg",
            alt: "O Horizontal Pod Autoscaler ajusta a escala de um Deployment, que por sua vez controla os Pods 1 a N.",
            caption:
              "O HPA não cria Pods: ele muda o número de réplicas do Deployment, e o Deployment cria ou remove os Pods. (RC, no diagrama, é o antigo ReplicationController; neste guia, o alvo é sempre um Deployment.)",
          },
        ],
        credit: "Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
    ],
    handsOnIntro: "O experimento final desta parte, que junta Deployment, Service e HPA.",
  },
  {
    id: "m9",
    num: "09",
    navTitle: "Exemplo profissional",
    tag: "bônus · imagem real do docker hub",
    title: "Bônus, aplicação profissional com uma imagem real do Docker Hub",
    lead: "As oito etapas anteriores usaram o nginx de propósito: uma imagem simples, sem ruído, para você aprender a mecânica de cada peça. Mas um deployment real não é feito de peças isoladas. Três perguntas só aparecem quando você junta tudo: como as peças se encaixam em um app de verdade, como testar probes em uma aplicação com endpoints de saúde reais (em vez do YAML ilustrativo da Etapa 07) e quais peças usar, ou deixar de fora, para esse app específico.",
    concept: [
      "Esta etapa monta um deployment completo com a imagem `stefanprodan/podinfo` do Docker Hub (`docker.io/stefanprodan/podinfo`). O podinfo é um projeto open source pensado para ser usado em demonstrações. Ele expõe `/healthz` e `/readyz` de verdade, aceita configuração por variáveis de ambiente (`PODINFO_UI_MESSAGE`, `PODINFO_UI_COLOR`) e tem um endpoint `/panic` que **encerra o processo** de propósito.",
      "Esse último ponto merece cuidado, porque `/panic` e liveness testam coisas diferentes. Quando o processo do podinfo termina, quem reinicia o container é o **kubelet, pela `restartPolicy`** do Pod (caso 1 da Etapa 07). Isso aconteceria mesmo que o manifesto não tivesse nenhuma `livenessProbe`. A liveness só entra em ação no caso 3, processo vivo que não responde de forma saudável. Por isso este exercício usa o `/panic` para demonstrar o reinício de um container que caiu, e testa a liveness de verdade apontando a probe para um caminho que não existe, de modo que o endpoint passe a devolver 404 e a probe falhe.",
      "Os quatro manifestos se encaixam pelo label `app: podinfo`, o mesmo mecanismo que costurou o guia inteiro (Etapa 03):",
      "- O **ConfigMap** injeta as variáveis via `envFrom` (Etapa 04).",
      "- O **Deployment** declara 3 réplicas (Etapa 05), `resources.requests` (obrigatório para o HPA, Etapa 08) e duas probes: liveness em `/healthz` e readiness em `/readyz` (Etapa 07).",
      "- O **Service** é NodePort porque aqui o podinfo é o ponto de entrada do sistema, aplicando a regra de ouro da Etapa 04.",
      "- O **HPA** lê a CPU declarada no Deployment e escala entre 2 e 8 réplicas (Etapa 08).",
      "Há uma interação entre o Deployment e o HPA que vale conhecer: o Deployment declara `replicas: 3`, mas o HPA tem `minReplicas: 2`. Enquanto há alguma carga, ou nos primeiros minutos, você verá 3 réplicas. Sem carga, depois de cerca de 5 minutos (a janela de estabilidade da Etapa 08), o HPA reduz o Deployment para 2. A partir daí, quem manda no número de réplicas é o HPA, e o `replicas: 3` do manifesto deixa de valer. Em produção, é comum omitir `replicas` do Deployment quando existe HPA, justamente para evitar essa disputa.",
      "Também importa o que **não** entrou. Nem toda peça aprendida cabe em todo app.",
      "- A **startupProbe** (Etapa 07) ficou de fora porque o podinfo sobe em frações de segundo. Usar uma peça só porque ela existe no manual adiciona configuração sem benefício.",
      "- O **PVC** (Etapa 06) também ficou fora do Deployment, por um motivo técnico. O problema: o PVC da Etapa 06 usa `ReadWriteOnce`, e esse modo não pode ser dividido entre réplicas em nós diferentes. No Minikube (um nó só) colar o `volumes.persistentVolumeClaim` em um Deployment com várias réplicas pode até subir sem reclamar, mas num cluster com vários nós as réplicas extras ficam presas, disputando o mesmo disco (o evento aparece como `FailedAttachVolume`). As saídas, se o app precisasse de estado: um cache compartilhado de verdade (o podinfo tem a flag `--cache-server` para falar com um Redis) ou um disco por réplica, com um StatefulSet e `volumeClaimTemplates`, assunto do módulo avançado. A Etapa 06 continua válida: ela é a resposta certa para o cenário dela, um Pod único com dados, como um banco.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "ConfigMap com envFrom",
        d: "configuração externa injetada como variáveis (Etapa 04).",
        color: "blue",
      },
      {
        t: "Deployment com 3 réplicas",
        d: "auto-cura e preparo para rolling update (Etapa 05).",
        color: "signal",
      },
      {
        t: "Probes reais",
        d: "liveness em `/healthz`, readiness em `/readyz` (Etapa 07).",
        color: "violet",
      },
      {
        t: "restartPolicy",
        d: "o que reinicia um container cujo processo terminou (`/panic`), sem relação com a liveness.",
        color: "ember",
      },
      {
        t: "Service NodePort",
        d: "o app é o ponto de entrada, então é exposto (Etapa 04).",
        color: "blue",
      },
      {
        t: "HPA entre 2 e 8 réplicas",
        d: "escala pela CPU declarada em `requests` e, sem carga, reduz as 3 réplicas iniciais para 2 (Etapa 08).",
        color: "signal",
      },
      {
        t: "Tag de versão fixa",
        d: "usar `podinfo:6.14.1` em vez de `latest`, para que o deploy seja reprodutível.",
        color: "violet",
      },
      {
        t: "rollout restart",
        d: "comando que recria os Pods de um Deployment, necessário para que eles leiam um ConfigMap alterado.",
        color: "ember",
      },
      {
        t: "Endpoints",
        d: "lista de Pods que estão de fato recebendo tráfego de um Service; Pods com readiness falhando saem dela.",
        color: "blue",
      },
    ],
    examplesTitle: "Os quatro manifestos e o teste completo",
    examples: [
      {
        label: "configmap.yaml",
        lang: "yaml",
        code: '# configmap.yaml\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: podinfo-config\ndata:\n  PODINFO_UI_MESSAGE: "olá do pitstop.dev!"   # aparece na tela do app\n  PODINFO_UI_COLOR: "#34d399"                 # cor do banner na UI',
        intro: "Crie a pasta `etapa09/` e salve os quatro manifestos nela.",
        note: "É o mesmo mecanismo da Etapa 04 (`envFrom`), mas aqui as chaves são variáveis que o podinfo realmente lê para montar a própria interface.",
      },
      {
        label: "deployment.yaml",
        lang: "yaml",
        code: '# deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: podinfo\nspec:\n  replicas: 3                        # auto-cura de verdade, Etapa 05 (o HPA pode reduzir para 2)\n  selector:\n    matchLabels:\n      app: podinfo\n  template:\n    metadata:\n      labels:\n        app: podinfo                 # casa com o selector ↑ e com o Service\n    spec:\n      containers:\n        - name: podinfo\n          image: stefanprodan/podinfo:6.14.1  # imagem real do Docker Hub, versão fixa (nunca "latest" em produção)\n          ports:\n            - containerPort: 9898\n          envFrom:                   # injeta o ConfigMap inteiro (Etapa 04)\n            - configMapRef:\n                name: podinfo-config\n          resources:                 # obrigatório pro HPA calcular %, Etapa 08\n            requests:\n              cpu: "100m"\n              memory: "64Mi"\n            limits:\n              cpu: "200m"\n              memory: "128Mi"\n          livenessProbe:             # "está vivo?" falhou → reinicia o container, Etapa 07\n            httpGet:\n              path: /healthz\n              port: 9898\n            periodSeconds: 10\n            failureThreshold: 3\n          readinessProbe:            # "pronto pro tráfego?" falhou → sai do Service\n            httpGet:\n              path: /readyz\n              port: 9898\n            periodSeconds: 5',
        note: "Este manifesto não tem `startupProbe` nem `volumes`, de propósito, pelos motivos explicados acima. Um manifesto profissional declara o que o app precisa, não tudo o que o curso ensinou.",
      },
      {
        label: "service.yaml",
        lang: "yaml",
        code: "# service.yaml\napiVersion: v1\nkind: Service\nmetadata:\n  name: podinfo\nspec:\n  type: NodePort                # ponto de entrada aqui = regra de ouro da Etapa 04\n  selector:\n    app: podinfo                # acha os Pods pelo label, sempre\n  ports:\n    - port: 9898\n      targetPort: 9898\n      nodePort: 30898",
      },
      {
        label: "hpa.yaml",
        lang: "yaml",
        code: "# hpa.yaml\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: podinfo\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: podinfo\n  minReplicas: 2                 # produção não desce de 2, nem sem carga\n  maxReplicas: 8\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 70",
        note: "Os testes abaixo seguem a ordem do exercício. Eles foram escritos para funcionar tanto com 3 réplicas (nos primeiros minutos) quanto com 2 (depois que o HPA reduz); os pontos em que o número importa estão indicados.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: '# 1) Aplica os 4 manifestos de uma vez\n$ kubectl apply -f configmap.yaml -f deployment.yaml -f service.yaml -f hpa.yaml\nconfigmap/podinfo-config created\ndeployment.apps/podinfo created\nservice/podinfo created\nhorizontalpodautoscaler.autoscaling/podinfo created\n\n# 2) Espere as réplicas Running e o HPA sair de <unknown> (saída abreviada)\n$ kubectl get pods,hpa\nNAME                           READY   STATUS    RESTARTS   AGE\npod/podinfo-7f9c6d-abc         1/1     Running   0          1m\npod/podinfo-7f9c6d-def         1/1     Running   0          1m\npod/podinfo-7f9c6d-ghi         1/1     Running   0          1m\n\nNAME                                          REFERENCE            TARGETS       MINPODS   MAXPODS   REPLICAS   AGE\nhorizontalpodautoscaler.autoscaling/podinfo   Deployment/podinfo   cpu: 3%/70%   2         8         3          1m\n\n# 3) Balanceamento. Num terminal, deixe o túnel aberto:\n$ minikube service podinfo --url\nhttp://127.0.0.1:53412   ← não feche este terminal (é o túnel)\n\n# Em OUTRO terminal, cinco requisições seguidas (use a URL que o seu terminal mostrou).\n# Cada requisição abre uma conexão nova, então o Service pode escolher réplicas diferentes:\n$ for i in 1 2 3 4 5; do curl -s http://127.0.0.1:53412 | grep hostname; done\n  "hostname": "podinfo-7f9c6d-abc",\n  "hostname": "podinfo-7f9c6d-ghi",\n  "hostname": "podinfo-7f9c6d-abc",\n  "hostname": "podinfo-7f9c6d-def",\n  "hostname": "podinfo-7f9c6d-ghi",\n\n# 4) Pegadinha de produção: mudar o ConfigMap NÃO reinicia os Pods sozinho.\n#    Edite o configmap.yaml (troque a mensagem por "mensagem nova") e reaplique:\n$ kubectl apply -f configmap.yaml\nconfigmap/podinfo-config configured\n$ kubectl exec deploy/podinfo -- env | grep MESSAGE\nPODINFO_UI_MESSAGE=olá do pitstop.dev!   ← ainda o valor ANTIGO\n\n$ kubectl rollout restart deployment/podinfo\ndeployment.apps/podinfo restarted\n$ kubectl rollout status deployment/podinfo\ndeployment "podinfo" successfully rolled out\n$ kubectl exec deploy/podinfo -- env | grep MESSAGE\nPODINFO_UI_MESSAGE=mensagem nova         ← só agora os Pods leem o valor novo\n\n# 5) Crash do processo: reinício pelo kubelet (restartPolicy), NÃO pela liveness.\n#    Guardamos o nome de um Pod para falar sempre com o mesmo.\n$ POD=$(kubectl get pods -l app=podinfo -o name | head -n 1)\n$ kubectl exec $POD -- curl -s localhost:9898/panic\n$ kubectl get pods -w\nNAME                 READY   STATUS    RESTARTS      AGE\npodinfo-7f9c6d-abc   1/1     Running   1 (4s ago)    3m   ← mesmo Pod, container reiniciado\n\n$ kubectl describe $POD\n(...)\n    Last State:     Terminated\n      Reason:       Error\n      Exit Code:    (valor diferente de 0)\n(...)\n# Nos Events não aparece nenhum "Liveness probe failed": o processo\n# terminou, e isso o kubelet resolve sem precisar de probe.\n\n# 6) Liveness de verdade: aponte a probe para um caminho que não existe (404)\n$ kubectl patch deployment podinfo --type=json \\\n  -p=\'[{"op":"replace","path":"/spec/template/spec/containers/0/livenessProbe/httpGet/path","value":"/nao-existe"}]\'\ndeployment.apps/podinfo patched\n\n# Os Pods novos sobem e passam na readiness (/readyz continua válido), mas\n# cerca de 30 segundos depois (3 falhas seguidas, a cada 10s) o RESTARTS começa a subir.\n# Durante a falha, o STATUS pode alternar entre Running e CrashLoopBackOff\n# (o kubelet espera um intervalo crescente antes de cada novo reinício); isso é esperado:\n$ kubectl get pods -w\n\n$ kubectl describe pods -l app=podinfo\nEvents:\n  Warning  Unhealthy  Liveness probe failed: HTTP probe failed with statuscode: 404\n  Normal   Killing    Container podinfo failed liveness probe, will be restarted\n\n# Restaure a probe original: reaplicar o manifesto devolve o caminho /healthz.\n# Atenção: o apply também devolve replicas para 3 (o valor do manifesto);\n# se não houver carga, o HPA volta a reduzir para 2 depois de cerca de 5 minutos.\n$ kubectl apply -f deployment.yaml\ndeployment.apps/podinfo configured\n\n# Espere a troca terminar ANTES do passo seguinte. Sem isso, o "head -n 1"\n# do passo 7 pode escolher um Pod antigo que ainda está terminando.\n$ kubectl rollout status deployment/podinfo\ndeployment "podinfo" successfully rolled out\n\n# 7) Readiness de verdade: desliga o /readyz de UM Pod sem matar o processo\n$ POD=$(kubectl get pods -l app=podinfo -o name | head -n 1)\n$ kubectl exec $POD -- curl -s -X POST localhost:9898/readyz/disable\n\n# Aguarde cerca de 15 segundos (periodSeconds 5 x 3 falhas) e compare:\n$ kubectl get pods\nNAME                 READY   STATUS    RESTARTS   AGE\npodinfo-7f9c6d-abc   0/1     Running   0          6m   ← Running, mas fora do balanceador\npodinfo-7f9c6d-def   1/1     Running   0          6m\n\n$ kubectl get endpoints podinfo\nNAME      ENDPOINTS           AGE\npodinfo   10.244.0.6:9898     6m   ← 1 IP (com 2 réplicas); com 3 réplicas seriam 2 IPs\n\n# Opcional: devolve o Pod ao balanceador\n$ kubectl exec $POD -- curl -s -X POST localhost:9898/readyz/enable',
        note: "Duas observações sobre o teste. O `curl` é usado no lugar do `wget` porque é o que a imagem oficial do podinfo traz instalado. E se o `/panic` não derrubar o processo de primeira, repita: a resposta às vezes chega fragmentada antes do processo morrer de fato. Uma observação sobre o navegador: se você abrir a URL do passo 3 no navegador e recarregar, é comum o hostname **não** mudar a cada recarga. O navegador reaproveita a conexão HTTP aberta, e o balanceamento do Service acontece por conexão, não por requisição. O laço com `curl`, que abre uma conexão nova a cada volta, é o teste confiável. A distribuição também é aleatória, não alternada: podem aparecer repetições seguidas.",
      },
    ],
    commands: [
      {
        cmd: "kubectl apply -f a.yaml -f b.yaml -f c.yaml -f d.yaml",
        note: "aplica vários manifestos de uma vez",
      },
      {
        cmd: "kubectl rollout restart deployment/<nome>",
        note: "força os Pods a lerem um ConfigMap que mudou",
      },
      {
        cmd: "kubectl exec deploy/<nome> -- <comando>",
        note: "executa em um Pod do Deployment sem precisar saber o nome exato",
      },
      {
        cmd: "kubectl patch deployment <nome> --type=json -p='[...]'",
        note: "altera um campo do Deployment sem editar o arquivo",
      },
      {
        cmd: "kubectl get endpoints <service>",
        note: "mostra quem está de fato recebendo tráfego agora (afetado pela readiness)",
      },
    ],
    handsOn: [
      "Salve os quatro YAMLs em `etapa09/` (`configmap.yaml`, `deployment.yaml`, `service.yaml`, `hpa.yaml`) e aplique com um único `kubectl apply` apontando para os quatro arquivos.",
      "Rode `kubectl get pods,hpa` até ver os pods `Running` (3 no começo) e o HPA com um valor de CPU real (não `<unknown>`). Se travar, confirme que o metrics-server da Etapa 08 continua ativo. Lembre que, sem carga, o HPA reduzirá as 3 réplicas para 2 em cerca de 5 minutos; isso é esperado, e os passos seguintes funcionam com qualquer um dos dois números.",
      "Rode `minikube service podinfo --url`, deixe esse terminal aberto e, em outro, execute o laço `for i in 1 2 3 4 5; do curl -s <URL> | grep hostname; done`. **Observe** mais de um hostname na saída. Se preferir o navegador, saiba que ele costuma reaproveitar a conexão e pode mostrar sempre o mesmo hostname.",
      "Reproduza a pegadinha do ConfigMap: edite a mensagem no `configmap.yaml`, aplique com `kubectl apply -f configmap.yaml`, confirme que `kubectl exec ... env` ainda mostra o valor antigo e só depois rode `kubectl rollout restart deployment/podinfo`. Confirme a mudança de novo. (Você também pode usar `kubectl edit configmap podinfo-config`, que abre o editor padrão do sistema, geralmente o vi; editar o arquivo e reaplicar é mais simples e mantém o YAML versionado como fonte da verdade.)",
      "Provoque um crash com `curl .../panic` e acompanhe `kubectl get pods -w` até ver o `RESTARTS` subir sozinho, sem você reiniciar nada. **Observe** com `kubectl describe` que o container anterior está em `Terminated` com código de saída diferente de zero e que não há evento de liveness: quem reiniciou foi o kubelet, pela `restartPolicy`.",
      "Teste a liveness de verdade: troque o caminho da probe para `/nao-existe` com `kubectl patch`, espere cerca de 30 segundos e **observe** o `RESTARTS` subir (o status pode alternar com `CrashLoopBackOff` entre uma reinicialização e outra, o que é esperado) e, no `describe`, os eventos `Liveness probe failed: HTTP probe failed with statuscode: 404` e `Killing`. Restaure com `kubectl apply -f deployment.yaml` e rode `kubectl rollout status deployment/podinfo`, esperando a mensagem `successfully rolled out` antes do passo 7, para que o `head -n 1` não escolha um Pod antigo que ainda está terminando. Saiba que esse `apply` devolve `replicas` para 3; o HPA reduz de novo para 2 se não houver carga.",
      "Desligue a readiness de um Pod com `curl -X POST .../readyz/disable` e, depois de cerca de 15 segundos, confirme com `kubectl get pods` (`READY 0/1`, `RESTARTS` inalterado) e `kubectl get endpoints podinfo` que aquele Pod saiu da lista, sem ser reiniciado. Com 2 réplicas sobra 1 IP; com 3, sobram 2.",
      "Feche gerando carga como na Etapa 08 (o mesmo gerador busybox contra `http://podinfo:9898`) e **observe** o HPA escalar este Deployment sozinho.",
      "Limpe: `kubectl delete -f configmap.yaml -f deployment.yaml -f service.yaml -f hpa.yaml`. Feche o terminal do `minikube service` com Ctrl+C. Se quiser desligar o laboratório, `minikube stop`.",
    ],
    tip: "A pegadinha do ConfigMap é um erro comum: editar o ConfigMap não reinicia nada sozinho (a menos que exista algo como um Reloader cuidando disso). Em produção, o comando depois de aplicar uma configuração nova quase sempre é `kubectl rollout restart deployment/<nome>`.",
    takeaway:
      "Um manifesto profissional não é a soma de tudo que você aprendeu: é a escolha do que o app precisa (ConfigMap, réplicas, probes reais, Service, HPA) e a recusa consciente do que ele não precisa (startupProbe num app rápido, PVC num Deployment com várias réplicas); e crash de processo é tratado pelo kubelet, enquanto só uma probe que falha prova a liveness.",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa09-podinfo.svg",
            alt: "O ConfigMap podinfo-config alimenta o Deployment podinfo por envFrom; o Deployment, com a imagem stefanprodan/podinfo:6.14.1, 3 réplicas, requests de CPU e probes em /healthz e /readyz, cria 3 Pods na porta 9898; o HPA podinfo ajusta as réplicas entre 2 e 8 com alvo de 70% de CPU; o Service podinfo, NodePort 30898, encontra os Pods pelo selector e recebe o navegador.",
            caption:
              "Os quatro manifestos da etapa e como se ligam: tudo se encontra pelo label `app: podinfo`, e o HPA passa a mandar no número de réplicas do Deployment.",
          },
        ],
        credit: "Diagrama: feito para este guia",
      },
    ],
    handsOnIntro:
      "Neste exercício você monta o deployment completo, provoca falhas controladas e confirma cada comportamento. Os blocos de comandos de cada passo estão no exemplo acima.",
  },
];

export const CHECKLIST: ChecklistGroup[] = [
  {
    title: "Etapa 01: Motivação e setup",
    items: [
      "Sei explicar a diferença entre container e VM e por que o container é mais leve.",
      "Subi o Minikube e vi o nó `Ready` no `kubectl get nodes`.",
      'Sei o que significa "estado desejado" e consigo dar um exemplo.',
    ],
  },
  {
    title: "Etapa 02: kubectl e API",
    items: [
      "Criei um pod imperativo com `kubectl run` e o vi chegar a `Running`.",
      "Provoquei um `ImagePullBackOff` de propósito e encontrei a causa nos Events do `describe`.",
      "Sei recitar o fluxo de debug: get, describe, logs.",
      "Sei explicar o caminho de um comando: kubeconfig, API Server, resposta.",
    ],
  },
  {
    title: "Etapa 03: Cluster, Pods e labels",
    items: [
      "Sei citar o papel de master, worker, etcd, kubelet, kube-proxy e API Server.",
      "Escrevi um YAML de Pod do zero seguindo apiVersion + kind + metadata + spec.",
      "Filtrei pods com `-l` e sei explicar quando usar label e quando usar annotation.",
    ],
  },
  {
    title: "Etapa 04: Services e ConfigMap",
    items: [
      "Expus um pod via NodePort e abri a página no navegador com `minikube service --url`.",
      "Apaguei o pod, vi o Service ficar sem endpoints (`kubectl get endpoints`) e vi o acesso voltar ao recriar o pod.",
      "Sei dizer qual tipo de Service usar para banco interno, teste no Minikube e produção na nuvem.",
      "Injetei um ConfigMap como variáveis de ambiente, confirmei com `kubectl exec -- env` e sei explicar por que mudar o ConfigMap não muda as variáveis de um Pod em execução.",
    ],
  },
  {
    title: "Etapa 05: ReplicaSets e Deployments",
    items: [
      "Deletei um pod de um Deployment e vi o substituto nascer sozinho (auto-cura).",
      "Fiz um rolling update, quebrei um deploy de propósito e voltei com `rollout undo`.",
      "Usei `kubectl get rs` para ver um ReplicaSet por versão e sei explicar por que o sufixo do nome dos Pods muda numa troca de versão.",
      "Sei explicar por que os pods antigos seguram o serviço quando a imagem nova falha.",
    ],
  },
  {
    title: "Etapa 06: Volumes",
    items: [
      "Sei explicar a cadeia PVC (pedido), PV (disco), StorageClass (tipos de disco).",
      "Escrevi um arquivo num PVC, destruí o pod, recriei e li o arquivo de volta.",
      "Repeti o teste com `emptyDir` (em um Pod de outro nome) e vi o arquivo sumir.",
      "Sei dizer quando usar emptyDir, hostPath e persistentVolumeClaim.",
    ],
  },
  {
    title: "Etapa 07: Probes",
    items: [
      "Sei dizer o que acontece quando cada probe falha (liveness, readiness, startup).",
      "Sei separar os três casos: crash de processo (kubelet reinicia o container), Pod que some (ReplicaSet cria Pod novo) e processo vivo porém travado (só a liveness detecta).",
      "Rodei o experimento liveness-exec e vi a coluna RESTARTS subir sozinha, com o par `Unhealthy` e `Killing` nos Events.",
      "Sei explicar por que `Running` não significa saudável.",
    ],
  },
  {
    title: "Etapa 08: HPA",
    items: [
      "Sei citar os dois pré-requisitos do HPA (metrics-server e resources.requests).",
      "Sei dizer quais métricas vêm prontas (CPU e memória) e quais exigem um adaptador.",
      "Gerei carga e vi o HPA aumentar as réplicas sem nenhum comando meu.",
      "Sei explicar por que o scale down demora cerca de 5 minutos.",
    ],
  },
  {
    title: "Etapa 09: Aplicação profissional",
    items: [
      "Apliquei os quatro manifestos do podinfo e vi as réplicas `Running` com o HPA lendo a CPU.",
      "Reproduzi a pegadinha do ConfigMap e resolvi com `rollout restart`.",
      "Provoquei um crash com `/panic` e sei explicar que o reinício foi feito pelo kubelet (restartPolicy), não pela liveness.",
      "Provoquei uma falha real de liveness (probe em um caminho inexistente, 404) e vi os eventos `Liveness probe failed` e `Killing`.",
      "Restaurei a probe com `kubectl apply` e esperei o `rollout status` terminar antes de seguir.",
      "Tirei um Pod do Service com `/readyz/disable` e confirmei com `kubectl get endpoints` e `READY 0/1`, sem reinício.",
      "Sei explicar por que o HPA reduz as 3 réplicas para 2 e por que a startupProbe e o PVC ficaram de fora desse Deployment.",
    ],
  },
  {
    title: "",
    items: [],
    outro:
      "**Próximos passos:** com todos os itens marcados, repita os exercícios em uma das plataformas listadas na seção anterior, desta vez sem consultar o guia. O tema seguinte é o módulo avançado, onde aparece o StatefulSet citado na Etapa 09.",
  },
];

export const NOTES: string[] = [
  "Este bloco reúne detalhes que ajudam a ler os exemplos com segurança. Nada aqui muda o caminho dos exercícios; são esclarecimentos sobre comportamentos que costumam gerar dúvida.",
  "**Sobre o que você vai ver no terminal**",
  "**Saídas de exemplo.** As saídas mostradas são formatos típicos. Nomes de pods, hashes de ReplicaSet, IPs, idades e colunas variam conforme a versão do Kubernetes e do ambiente. Compare a estrutura, não o texto exato. O histórico de `rollout history` e as saídas de `kubectl top` são aproximados, e as saídas de `get pods -w` são abreviadas: no ambiente real, as linhas aparecem com intervalos maiores do que o exemplo sugere.",
  "**Caminho da API (Etapa 02).** `kubectl get pods` no namespace `default` faz `GET /api/v1/namespaces/default/pods`. O caminho `/api/v1/pods` lista pods de todos os namespaces. O `-v=6` mostra a requisição real, e o formato da linha de log varia entre versões do kubectl.",
  "**Versão do kubectl antes do cluster (Etapa 01).** `kubectl version` sem `--client` tenta consultar o servidor. Antes do `minikube start` isso termina em erro de conexão, o que é esperado e não indica instalação defeituosa.",
  "**`kubectl get endpoints` (Etapas 04 e 09).** Em versões recentes do Kubernetes, o comando pode exibir um aviso de depreciação em favor de EndpointSlices. Ele continua útil para os exercícios; a alternativa é `kubectl get endpointslices`.",
  "**Sobre comportamentos que surpreendem**",
  "**Rollback (Etapa 05).** `rollout undo` volta para a revisão imediatamente anterior, não para a original. No exemplo, restaura `nginx:1.16.1`, não `nginx:1.14.2`. A revisão restaurada recebe um número novo no histórico e reaproveita o ReplicaSet dela.",
  "**`kubectl delete pvc` (Etapa 06).** Com a StorageClass `standard` do Minikube, a política de reclaim costuma ser `Delete`: apagar o PVC apaga o PV e os dados. Confira a política do seu cluster com `kubectl get storageclass`. Em ambientes de produção, essa política é uma decisão importante.",
  "**Alterar um Pod existente (Etapa 06).** O `spec` de um Pod não pode ser modificado depois de criado (com poucas exceções, como a imagem). Para trocar o tipo de volume, crie um Pod com outro nome ou apague e recrie o Pod.",
  "**Tempo do restart (Etapa 07).** No experimento do liveness-exec, a primeira reinicialização ocorre por volta de 45 segundos (30s saudável mais 3 falhas espaçadas de 5s). Os ciclos seguintes podem demorar mais, porque o kubelet aguarda o container encerrar (até 30s por padrão, o `terminationGracePeriodSeconds`) antes de recriá-lo.",
  "**Quem reinicia o quê (Etapas 07 e 09).** O kubelet reinicia containers cujo processo terminou, por causa da `restartPolicy`, com ou sem probe. A liveness probe existe para o caso em que o processo continua vivo mas não responde. Um endpoint que derruba o processo (como o `/panic` do podinfo) demonstra o primeiro caso, não o segundo.",
  "**Métricas do HPA (Etapa 08).** O HPA lê nativamente CPU e memória, via metrics-server. Requisições por segundo, métricas do Prometheus, E/S de disco e qualquer outra métrica exigem um adaptador de métricas customizadas ou externas instalado no cluster.",
  "**HPA e `replicas` (Etapas 08 e 09).** Com um HPA ativo, o número de réplicas é decidido por ele dentro de `minReplicas` e `maxReplicas`. O `replicas` do Deployment funciona como ponto de partida e é ajustado pelo HPA, o que explica as 3 réplicas virarem 2 na Etapa 09. Reaplicar o manifesto (`kubectl apply`) devolve `replicas` ao valor escrito nele, e o HPA volta a ajustar depois da janela de estabilidade.",
  "**Balanceamento do Service (Etapa 09).** O balanceamento é por conexão e a escolha da réplica é aleatória. Clientes que reaproveitam a conexão (como um navegador) tendem a falar sempre com a mesma réplica.",
  "**startupProbe (Etapa 07).** A forma mais comum de dar tempo a um app lento é `failureThreshold` multiplicado por `periodSeconds`, em vez de um `initialDelaySeconds` fixo. O exemplo com `initialDelaySeconds: 120` é válido e foi mantido por fidelidade ao material de origem.",
  "**Terminologia e pontos a verificar**",
  '**Master node e control plane.** O material das aulas usa "Master node". A documentação atual do Kubernetes prefere **control plane**, que é o que aparece na coluna ROLES do `kubectl get nodes` na Etapa 01. Os dois nomes se referem à mesma coisa.',
  "**Tag da imagem (Etapa 09).** A tag `stefanprodan/podinfo:6.14.1` vem do material do guia. Confirme no Docker Hub que ela existe antes de executar; se não existir, use uma tag publicada mais recente. A tag fixa, em vez de `latest`, é o ponto didático e permanece.",
  "**Manifestos de apoio.** Os arquivos `liveness-exec.yaml` (Etapa 07), `service.yaml` do HPA (Etapa 08) e `pod-emptydir.yaml` (Etapa 06) são complementos de apoio aos exercícios, no padrão da documentação oficial do Kubernetes.",
];

export type Platform = {
  name: string;
  price: string;
  free: boolean;
  url: string;
  urlLabel: string;
  desc: string;
  goodFor: string;
};

export const PLATFORMS: Platform[] = [
  {
    name: "Killercoda",
    price: "100% grátis",
    free: true,
    url: "https://killercoda.com/kubernetes",
    urlLabel: "killercoda.com/kubernetes",
    desc: "Cenários interativos de Kubernetes direto no navegador: você recebe um terminal com cluster real e um roteiro guiado. Sucessor do Katacoda.",
    goodFor: "Praticar cada etapa deste guia sem instalar nada. Comece por aqui.",
  },
  {
    name: "Play with Kubernetes",
    price: "100% grátis",
    free: true,
    url: "https://labs.play-with-k8s.com",
    urlLabel: "labs.play-with-k8s.com",
    desc: "Cluster Kubernetes real e temporário (sessões de 4 horas) no navegador, mantido pela Docker. Você monta o cluster na mão com kubeadm.",
    goodFor: "Testar comandos kubectl livremente e entender a montagem de um cluster.",
  },
  {
    name: "Kube by Example",
    price: "100% grátis",
    free: true,
    url: "https://kubebyexample.com",
    urlLabel: "kubebyexample.com",
    desc: "Tutoriais e exemplos curtos mantidos pela Red Hat: um conceito por página (Pods, Services, Deployments...), com exemplos direto ao ponto.",
    goodFor: "Revisar um conceito específico rapidamente, como uma segunda explicação.",
  },
  {
    name: "Introduction to Kubernetes (LFS158)",
    price: "100% grátis",
    free: true,
    url: "https://training.linuxfoundation.org/training/introduction-to-kubernetes/",
    urlLabel: "training.linuxfoundation.org",
    desc: "Curso oficial gratuito da Linux Foundation (quem mantém o K8s), disponível também no edX. Base teórica sólida com certificado de participação.",
    goodFor: "Consolidar a teoria com o material oficial depois de fechar este guia.",
  },
  {
    name: "Kubernetes the Hard Way",
    price: "100% grátis",
    free: true,
    url: "https://github.com/kelseyhightower/kubernetes-the-hard-way",
    urlLabel: "github.com/kelseyhightower",
    desc: 'O lendário roteiro do Kelsey Hightower: montar um cluster peça por peça, na unha, sem instaladores. É o "monte o carro parafuso por parafuso": quem faz, nunca mais olha a garagem do mesmo jeito.',
    goodFor: "Nível avançado, quando quiser entender o que o Minikube esconde de você.",
  },
  {
    name: "KodeKloud",
    price: "Free tier + pago",
    free: false,
    url: "https://kodekloud.com",
    urlLabel: "kodekloud.com",
    desc: 'Labs guiados estilo desafio: "esse Pod não sobe, descubra por quê". Alguns labs são gratuitos; o catálogo completo (e os simulados CKA/CKAD) é pago.',
    goodFor: "Troubleshooting realista, o mais próximo de uma entrevista técnica.",
  },
  {
    name: "iximiuz Labs",
    price: "Free tier + pago",
    free: false,
    url: "https://labs.iximiuz.com",
    urlLabel: "labs.iximiuz.com",
    desc: "Playgrounds de containers e Kubernetes no navegador com desafios práticos. Vários playgrounds e desafios liberados no plano gratuito.",
    goodFor: "Experimentos mais profundos: rede, imagens, internals de containers.",
  },
];
