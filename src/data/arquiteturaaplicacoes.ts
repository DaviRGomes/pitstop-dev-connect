// Conteúdo das quatro aulas da disciplina "Arquitetura de aplicações" (Fase 1), uma etapa por aula,
// tematizado com Fórmula 1 pelo pipeline /otimizar-relatorio (relatorios/arquitetura-aplicacoes/final.md).

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
};

export type Mapping = { tema: string; f1: string };

export const DE_PARA: Mapping[] = [
  {
    tema: "Monolito",
    f1: "Uma garagem em que os mesmos mecânicos fazem todas as tarefas, com um procedimento único, ensaiado e liberado em bloco",
  },
  {
    tema: "Arquitetura em camadas",
    f1: "A cadeia de comunicação: piloto, engenheiro de corrida, muro, analistas de dados; cada nível só fala com o de baixo",
  },
  {
    tema: "Microsserviço",
    f1: "Um posto especializado (pneus, estratégia, unidade de potência, a crew de cada roda), com função, gente, equipamento e ensaio próprios",
  },
  {
    tema: "Capacidade compartilhada",
    f1: "O double stack: a crew única faz o segundo carro esperar o primeiro",
  },
  {
    tema: "Status code HTTP",
    f1: "O semáforo de liberação: verde só quando está tudo preso; 200 com erro é liberação insegura",
  },
  {
    tema: "API Gateway",
    f1: "O engenheiro de corrida: única voz entre o piloto e a equipe, que encaminha cada pedido ao posto certo",
  },
  {
    tema: "Banco por serviço",
    f1: "Cada disciplina dona dos seus dados: quem precisa pede o número, não abre a planilha do outro",
  },
  {
    tema: "Consistência eventual",
    f1: "A classificação provisória, que converge para a oficial depois das decisões dos comissários",
  },
  {
    tema: "Saga com compensação",
    f1: "A logística da viagem reservada em passos e desfeita em ordem inversa, com cancelamentos que ficam no histórico",
  },
  {
    tema: "Chamada síncrona x fila",
    f1: "O carro parado no box esperando uma tarefa x os pneus retirados que vão para a pilha e são medidos depois",
  },
  {
    tema: "Identificador de requisição",
    f1: "O código de barras do pneu, seguido por todos os registros",
  },
  {
    tema: "Provedor de nuvem (AWS ou Azure)",
    f1: "O circuito: cada um tem instalações próprias, e o procedimento da equipe é o mesmo nos dois",
  },
];

export const ANALOGY_NOTES: string[] = [
  "Uma crew por equipe: na prática, cada equipe tem uma crew só para os dois carros, e o double stack é um custo que a estratégia administra. No software, separar a capacidade de cada serviço é escolha de arquitetura, e as réplicas custam pouco.",
  "A parada é síncrona por natureza: os postos são especializados, mas o carro só sai do box quando as quatro rodas terminam. Microsserviços podem ser independentes também no tempo, conversando por fila.",
  "Gente improvisa; gateway não. O engenheiro de corrida entende o conteúdo e prioriza; o gateway encaminha pelo prefixo, conta pedidos e devolve códigos, sem entender o domínio.",
  "A rede não é a garagem: dentro da garagem, uma pergunta atravessa três postos em segundos. Entre serviços, cada salto de rede acrescenta latência e uma chance de falha parcial.",
  "Consistência eventual por software: a classificação provisória converge por decisão humana dos comissários; num sistema distribuído, a convergência é feita por eventos, compensações e regras automáticas.",
  "O circuito não se escolhe: o calendário decide onde a equipe corre. Na nuvem, a escolha do provedor é sua, e dá para usar os dois ao mesmo tempo.",
];

export const LESSONS: Lesson[] = [
  {
    id: "aa1",
    num: "01",
    navTitle: "Monolito e microsserviços",
    tag: "camadas x serviços",
    title: "Monolito, arquitetura em camadas e microsserviços",
    lead: "Camadas organizam o código dentro de um único deploy; microsserviços dividem o próprio deploy por funcionalidade de negócio e trocam a dor do bloco único pela complexidade de um sistema distribuído.",
    concept: [
      "Monolito é o design em que front-end, back-end, lógica de negócio e integração com o banco coexistem no mesmo bloco de código e são implantados como uma única entidade. Qualquer alteração exige reimplantar tudo, uma falha num componente pode afetar o sistema inteiro e, para escalar uma parte, escala-se a aplicação toda. É o caso da sexta-feira 16h: trocar só a integração de upload de vídeos e ter de testar e implantar o bloco inteiro.",
      "A arquitetura em camadas (apresentação, negócio e dados) é um corte horizontal: organiza o código, mas continua num único pacote de deploy, escalado e derrubado de uma vez. Microsserviços são o corte vertical, por funcionalidade de negócio: serviços pequenos e independentes, com deploy, escala e dados próprios, conversando por API (REST, GraphQL, RPC ou mensageria). Em REST, cada resposta precisa do status code correto: um 200 com corpo de erro engana quem chamou.",
      "A independência tem preço: complexidade do conjunto, testes entre serviços, governança descentralizada, latência de cadeias de chamadas, consistência de dados, controle de versão e exigência de cultura DevOps. Na nuvem (acréscimo do professor), os pares são Amazon EC2 x Azure Virtual Machines para a VM, Amazon ECS com Fargate x Azure Container Apps para containers gerenciados, Amazon EKS x AKS para Kubernetes e AWS Lambda x Azure Functions para funções. O ECS é o orquestrador próprio da AWS, não Kubernetes; o Container Apps roda sobre Kubernetes sem expô-lo.",
      "Na pista: o monolito é uma garagem hipotética em que os mesmos mecânicos fazem tudo, com um procedimento único; as camadas são a cadeia piloto, engenheiro de corrida, muro e analistas; os microsserviços são os postos especializados. O status code é o semáforo de liberação, e o 200 com erro é a liberação insegura: o carro sai do box com uma roda mal presa enquanto o semáforo verde dizia que estava tudo certo. AWS e Azure são dois circuitos: o procedimento da equipe é o mesmo nos dois.",
    ],
    pointsTitle: "O painel desta etapa",
    points: [
      {
        t: "Camadas não resolvem o deploy",
        d: "O corte horizontal organiza o código, mas o pacote continua indo inteiro para produção.",
        color: "blue",
      },
      {
        t: "Double stack",
        d: "Com capacidade compartilhada, o pedido de 0,1 s herda quase 4 s atrás dos relatórios.",
        color: "ember",
      },
      {
        t: "Quando NÃO migrar",
        d: "Equipe pequena, pouco tráfego e sem maturidade em CI/CD: um monolito bem organizado em camadas atende melhor.",
        color: "signal",
      },
    ],
    examplesTitle: "A mesma imagem em duas topologias",
    examples: [
      {
        label: "etapa-01/compose.yaml",
        lang: "yaml",
        code: `services:
  monolito:                      # UM processo atende pedidos E relatórios
    image: lab-arq-app           # imagem construída com o docker build logo abaixo
    init: true                   # init como PID 1: repassa o SIGTERM e o stop leva 1 s, não 10 s
    environment:
      NOME: monolito             # aparece nas respostas
      ROTAS: pedidos,relatorios  # as duas áreas no mesmo processo
    ports: ["8090:8080"]         # acesso direto, só para o laboratório

  pedidos:                       # serviço 1: só pedidos
    image: lab-arq-app
    init: true
    environment:
      NOME: pedidos
      ROTAS: pedidos
    ports: ["8091:8080"]

  relatorios:                    # serviço 2: só relatórios
    image: lab-arq-app
    init: true
    environment:
      NOME: relatorios
      ROTAS: relatorios
    ports: ["8092:8080"]`,
        note: "O mesmo código em duas topologias: o monolito atende as duas rotas; pedidos e relatorios atendem uma cada.",
      },
      {
        label: "double stack",
        lang: "sh",
        code: `# Monolito: quatro relatórios (2 s cada, capacidade 2) e, logo depois, um pedido
$ for i in 1 2 3 4; do curl -s -o /dev/null localhost:8090/relatorios/mensal & done
$ sleep 0.2
$ curl -s -o /dev/null -w "pedido no monolito: %{time_total}s\\n" localhost:8090/pedidos/1
$ wait
# A mesma carga, com serviços separados
$ for i in 1 2 3 4; do curl -s -o /dev/null localhost:8092/relatorios/mensal & done
$ sleep 0.2
$ curl -s -o /dev/null -w "pedido no serviço próprio: %{time_total}s\\n" localhost:8091/pedidos/1
$ wait`,
        note: "No monolito, o pedido leva entre 2 e 4 s (tipicamente perto de 4); no serviço próprio, cerca de 0.10s.",
      },
      {
        label: "raio de explosão",
        lang: "sh",
        code: `# Monolito: um defeito em qualquer rota mata o processo inteiro
$ curl -s -o /dev/null -w "crash: %{http_code}\\n" localhost:8090/crash
crash: 000
$ curl -s -o /dev/null -w "pedidos no monolito depois do crash: %{http_code}\\n" localhost:8090/pedidos/1
pedidos no monolito depois do crash: 000
# Serviços: o defeito mata só o serviço de relatórios
$ curl -s -o /dev/null -w "crash: %{http_code}\\n" localhost:8092/crash
crash: 000
$ curl -s -o /dev/null -w "pedidos (serviço próprio): %{http_code}\\n" localhost:8091/pedidos/1
pedidos (serviço próprio): 200
$ docker compose ps -a --format "table {{.Service}}\\t{{.Status}}"`,
        note: "O ps mostra monolito e relatorios como Exited (1). Para recuperar: docker compose up -d.",
      },
    ],
    commands: [
      { cmd: "docker build -t lab-arq-app ./app", note: "constrói a aplicação de teste" },
      {
        cmd: "cd etapa-01 && docker compose up -d",
        note: "sobe monolito, pedidos e relatorios",
      },
      {
        cmd: 'curl -s -o /dev/null -w "%{http_code}\\n" localhost:8091/relatorios/mensal',
        note: "404: o serviço de pedidos não conhece a rota de relatórios",
      },
      { cmd: "docker compose down", note: "limpeza da etapa" },
    ],
    handsOnIntro: "Quatro testes cronometrados com a mesma imagem em duas topologias.",
    handsOn: [
      "Confira as duas topologias e os status codes: 404 para /pedidos/999, 500 para /pedidos/erro e 404 para relatórios no serviço de pedidos.",
      "Dispare quatro relatórios no monolito e, logo depois, um pedido: ele leva entre 2 e 4 segundos.",
      "Repita a carga com serviços separados: o pedido volta para cerca de 0,10 s.",
      "Chame /crash no monolito e no serviço de relatórios: 000 nos pedidos do monolito, 200 no serviço próprio.",
      "Confirme monolito e relatorios como Exited (1) no docker compose ps -a e recupere com docker compose up -d.",
    ],
    tip: "Prefira a componentização gradual: transforme em serviço só a parte crítica, em vez de reescrever tudo.",
    takeaway:
      "Camadas organizam o código dentro de um deploy; microsserviços dividem o próprio deploy por funcionalidade, e trocam a dor do bloco único pela complexidade de um sistema distribuído.",
  },
  {
    id: "aa2",
    num: "02",
    navTitle: "Onde cortar",
    tag: "DDD e gateway",
    title: "Microsserviços: onde cortar e como expor",
    lead: "Corte pelo negócio, não pela tecnologia: cada serviço dono de uma capacidade, com contrato claro, publicado atrás de uma fachada única.",
    concept: [
      "Um serviço para o banco, um para as regras e um para as telas parece organizado, mas toda funcionalidade nova atravessa os três, que precisam mudar e subir juntos: é um monolito distribuído. Os princípios do material: baixo acoplamento e alta coesão, esconder a complexidade do domínio atrás de uma interface simples, características arquiteturais por serviço e uma única responsabilidade por serviço, com comunicação mínima e clara. Atenção: com comunicação síncrona, a disponibilidade de um passa a depender da do outro.",
      'O DDD estratégico dá o método: analisar o domínio, definir os bounded contexts, definir entidades, agregados e serviços de cada contexto e, por fim, identificar os microsserviços. Um bounded context é a fronteira dentro da qual um termo tem significado único: "agendamento" é agenda a cumprir para o Professor e reserva de horário para o Candidato. No sistema de testes saem cinco serviços: Autenticação (com JWT e roles), ADM (que pode ter só um cache), Professor, Empresa e Candidato.',
      "Contratos versionados (OpenAPI para HTTP, AsyncAPI para eventos e mensagens) evitam que atualizar um serviço quebre os outros, e o service discovery troca IP fixo por um nome resolvido para as instâncias saudáveis. Na AWS (acréscimo do professor), a descoberta é um produto à parte, o AWS Cloud Map, ou o ECS Service Connect; no Azure não há par 1:1, e ela vem embutida no Azure Container Apps ou no DNS do Kubernetes no AKS. A fachada única é o Amazon API Gateway num circuito e o Azure API Management no outro.",
      'Na pista: as equipes se organizam por disciplina (aerodinâmica, dinâmica veicular, unidade de potência, pneus, estratégia), não por "quem mexe nos dados". A palavra "janela" é um bounded context de livro: intervalo de voltas para o estrategista, faixa de temperatura para o engenheiro de pneus. O gateway é o engenheiro de corrida, a única voz que o piloto conhece, e o contrato versionado é a lista de canais da telemetria, que só perde um canal depois que todo mundo migrou.',
    ],
    pointsTitle: "Peças do corte",
    points: [
      {
        t: "Capacidade, não camada",
        d: "Agendamento é capacidade de negócio; acesso a dados e mensagens são camadas técnicas.",
        color: "blue",
      },
      {
        t: "Contrato versionado",
        d: "OpenAPI e AsyncAPI: atualizar um serviço sem quebrar quem depende dele.",
        color: "signal",
      },
      {
        t: "Falha contida",
        d: "Com um serviço parado, o gateway devolve 502 só para aquela rota.",
        color: "ember",
      },
    ],
    examplesTitle: "Cinco serviços por domínio atrás de um gateway",
    examples: [
      {
        label: "gateway.conf",
        lang: "sh",
        code: `server {
    listen 80;
    resolver 127.0.0.11 valid=5s;   # DNS interno do Docker; resolve os nomes dos serviços em tempo de requisição

    location /autenticacao/ { set $alvo http://autenticacao:8080; proxy_pass $alvo; }  # prefixo -> serviço
    location /adm/          { set $alvo http://adm:8080;          proxy_pass $alvo; }
    location /professor/    { set $alvo http://professor:8080;    proxy_pass $alvo; }
    location /empresa/      { set $alvo http://empresa:8080;      proxy_pass $alvo; }
    location /candidato/    { set $alvo http://candidato:8080;    proxy_pass $alvo; }
}`,
        note: "A variável no proxy_pass faz o Nginx subir mesmo com um serviço parado e responder 502 só para aquela rota.",
      },
      {
        label: "etapa-02/compose.yaml",
        lang: "yaml",
        code: `services:
  autenticacao:
    image: lab-arq-app
    init: true                                                  # stop rápido (veja a Etapa 01)
    environment: { NOME: autenticacao, ROTAS: autenticacao }   # só responde pelo seu domínio
  adm:
    image: lab-arq-app
    init: true                                                  # stop rápido (veja a Etapa 01)
    environment: { NOME: adm, ROTAS: adm }
  professor:
    image: lab-arq-app
    init: true                                                  # stop rápido (veja a Etapa 01)
    environment: { NOME: professor, ROTAS: professor }
  empresa:
    image: lab-arq-app
    init: true                                                  # stop rápido (veja a Etapa 01)
    environment: { NOME: empresa, ROTAS: empresa }
  candidato:
    image: lab-arq-app
    init: true                                                  # stop rápido (veja a Etapa 01)
    environment: { NOME: candidato, ROTAS: candidato }

  gateway:
    image: nginx:1.27-alpine
    ports: ["8080:80"]                                          # única porta exposta ao mundo
    volumes:
      - ./gateway.conf:/etc/nginx/conf.d/default.conf:ro        # substitui a configuração padrão
    depends_on: [autenticacao, adm, professor, empresa, candidato]`,
      },
      {
        label: "falha isolada",
        lang: "sh",
        code: `# Derrube só o serviço de Empresa
$ docker compose stop empresa
$ for d in autenticacao professor empresa candidato; do echo -n "$d: "; curl -s -o /dev/null -w "%{http_code}\\n" localhost:8080/$d/exemplo; done
autenticacao: 200
professor: 200
empresa: 502
candidato: 200`,
        note: "O gateway é a prova de que o corte por domínio contém o dano.",
      },
    ],
    commands: [
      { cmd: "docker compose up -d", note: "sobe os cinco serviços e o gateway" },
      {
        cmd: "for d in autenticacao adm professor empresa candidato; do curl -s localhost:8080/$d/exemplo; done",
        note: "cada prefixo cai no serviço do seu domínio",
      },
      { cmd: "docker compose stop empresa", note: "derruba só o domínio Empresa" },
      {
        cmd: 'curl -s -o /dev/null -w "%{http_code}\\n" localhost:8080/financeiro/relatorio',
        note: "404 devolvido pelo próprio gateway",
      },
    ],
    handsOnIntro: "Cinco serviços atrás de uma única voz em localhost:8080.",
    handsOn: [
      "Crie a pasta etapa-02 com gateway.conf e compose.yaml e suba tudo.",
      "Chame os cinco prefixos e confira que cada resposta traz o servico igual ao prefixo pedido.",
      "Pare o serviço empresa e veja 200 nos outros domínios e 502 só para empresa.",
      "Peça /financeiro/relatorio e receba 404 do próprio gateway.",
      "Rode docker compose down antes da próxima etapa.",
    ],
    tip: "Bounded context não se decora: reconheça-o no vocabulário de quem trabalha no negócio. A mesma palavra com modelos distintos indica contextos distintos.",
    takeaway:
      "Corte pelo negócio, não pela tecnologia: cada serviço dono de uma capacidade, com contrato claro, falhando e escalando sozinho.",
  },
  {
    id: "aa3",
    num: "03",
    navTitle: "Banco de dados",
    tag: "banco por serviço e saga",
    title: "Banco de dados com microsserviços",
    lead: "Cada serviço é dono dos seus dados e só se fala por API ou evento; sem transação global, a consistência vira projeto: saga para coordenar, compensação para desfazer.",
    concept: [
      "Banco compartilhado é o acoplamento mais forte possível: a equipe de estoque renomeia uma coluna num sábado e o serviço de pedidos para sem saber por quê. Com banco por serviço (e persistência poliglota), ninguém lê o banco do outro. Os quatro desafios: isolamento de dados (troca por API ou evento, com dados duplicados), consistência (o ACID dá lugar à consistência eventual), transações distribuídas e evolução de esquema, versionada com Flyway ou Liquibase.",
      "CAP: como partições de rede acontecem, durante uma partição você escolhe entre consistência e disponibilidade; sem partição, dá para ter as duas. SQL traz esquema rígido, ACID e joins; NoSQL traz esquema flexível e escala horizontal. A saga encadeia transações locais e, se um passo falha, executa compensações em ordem inversa, por orquestração ou por coreografia. O 2PC dá consistência forte, mas segura recursos e costuma ser evitado entre microsserviços. Event Sourcing guarda a sequência de eventos; CQRS separa o modelo de escrita do de leitura.",
      "AWS e Azure lado a lado (acréscimo do professor, salvo DynamoDB e Cosmos DB, citados no material): Amazon RDS e Aurora x Azure Database for PostgreSQL e MySQL; Amazon DynamoDB x Azure Cosmos DB; Amazon ElastiCache x Azure Cache for Redis; AWS Step Functions x Azure Durable Functions para orquestrar a saga. O DynamoDB cobra por capacidade de leitura e escrita e lê com consistência eventual por padrão, com leitura forte opcional; o Cosmos DB cobra em Request Units por segundo e expõe cinco níveis de consistência configuráveis.",
      'Na pista: cada disciplina é dona dos seus dados, e a estratégia pede o número ou recebe o aviso "pneu passou do limite". A classificação logo após a bandeirada é provisória e converge para a oficial depois dos comissários: é a consistência eventual. A partição do CAP é a perda do link de telemetria entre o carro e o muro. A saga é a logística da viagem para o próximo GP (voo, hotel, frete), reservada em passos e desfeita em ordem inversa se um passo falhar; a coreografia é a mensagem de safety car da direção de prova: ela só anuncia o evento, e cada equipe decide sozinha como reagir.',
    ],
    pointsTitle: "Regras dos dados distribuídos",
    points: [
      {
        t: "Compensar não é rollback",
        d: "A reserva cancelada fica no banco, com o status trocado: é uma nova ação de negócio.",
        color: "ember",
      },
      {
        t: "Compensação idempotente",
        d: "Cancelar duas vezes não piora nada; o orquestrador pode repetir depois de uma falha.",
        color: "signal",
      },
      {
        t: "Esquema é escolha",
        d: "SQL recusa a coluna sem migração; NoSQL aceita e passa a validação para a aplicação.",
        color: "blue",
      },
    ],
    examplesTitle: "Saga orquestrada e NoSQL nos dois circuitos",
    examples: [
      {
        label: "saga.sh",
        lang: "sh",
        code: `#!/usr/bin/env bash
# Saga orquestrada: reserva voo, hotel e carro; se algum passo falhar, compensa os anteriores em ordem inversa.
ID="$1"
PASSOS=(voo:8101 hotel:8102 carro:8103)   # nome:porta, na ordem de execução
FEITOS=()                                  # passos já concluídos (candidatos à compensação)

for passo in "\${PASSOS[@]}"; do
  nome="\${passo%%:*}"; porta="\${passo##*:}"
  codigo=$(curl -s -o /dev/null -w "%{http_code}" -X POST "localhost:$porta/reservar/$ID")
  if [ "$codigo" = "201" ]; then
    echo "OK     reservar $nome"
    FEITOS+=("$passo")
  else
    echo "FALHA  reservar $nome (HTTP $codigo), compensando..."
    for ((i=\${#FEITOS[@]}-1; i>=0; i--)); do   # do último concluído para o primeiro
      f="\${FEITOS[$i]}"
      curl -s -o /dev/null -X POST "localhost:\${f##*:}/cancelar/$ID"
      echo "DESFEZ cancelar \${f%%:*}"
    done
    exit 1
  fi
done
echo "SAGA CONCLUIDA para $ID"`,
        note: "Com o carro em modo falha, a saída termina em FALHA reservar carro (HTTP 500), DESFEZ cancelar hotel e DESFEZ cancelar voo.",
      },
      {
        label: "AWS: DynamoDB",
        lang: "sh",
        code: `# AWS: tabela DynamoDB com cobrança sob demanda
$ aws dynamodb create-table --table-name produtos --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST`,
        note: "Referência de nuvem: cria recursos e gera cobrança. Limpeza: aws dynamodb delete-table --table-name produtos.",
      },
      {
        label: "Azure: Cosmos DB",
        lang: "sh",
        code: `# Azure: conta Cosmos DB, banco e contêiner com chave de partição /id
$ az group create --name rg-lab --location brazilsouth
$ az cosmosdb create --name <conta-unica> --resource-group rg-lab
$ az cosmosdb sql database create --account-name <conta-unica> --resource-group rg-lab --name loja
$ az cosmosdb sql container create --account-name <conta-unica> --resource-group rg-lab --database-name loja --name produtos --partition-key-path "/id"`,
        note: "Referência de nuvem: cria recursos e gera cobrança. Limpeza: az group delete --name rg-lab --yes.",
      },
    ],
    commands: [
      {
        cmd: "docker compose up -d --build",
        note: "sobe voo, hotel e carro, cada um com seu volume",
      },
      { cmd: "./saga.sh viagem-1", note: "caminho feliz: três OK e SAGA CONCLUIDA" },
      {
        cmd: "curl -s -X POST localhost:8103/modo/falha",
        note: "o serviço de carro passa a falhar",
      },
      {
        cmd: "curl -s localhost:8102/reservas",
        note: "viagem-2 aparece como CANCELADA, não apagada",
      },
    ],
    handsOnIntro: "Banco por serviço, saga com compensação e esquema rígido x flexível.",
    handsOn: [
      "Suba os três serviços de reserva e rode ./saga.sh viagem-1 até ver SAGA CONCLUIDA.",
      "Coloque o carro em modo falha, rode ./saga.sh viagem-2 e veja DESFEZ cancelar hotel e DESFEZ cancelar voo.",
      "Consulte /reservas nos três serviços: viagem-2 está CANCELADA em voo e hotel, e o carro mostra só viagem-1. Depois, volte o carro com /modo/normal.",
      "No Postgres, insira a coluna tags sem migração, veja o ERROR e corrija com ALTER TABLE.",
      "Rode o Event Sourcing em miniatura: o saldo 120 só vira 130 na view depois do REFRESH. Limpe com docker compose down -v.",
    ],
    tip: 'Leia o CAP como uma escolha durante a partição, não como "escolha duas de três". Sem partição, dá para ter consistência e disponibilidade.',
    takeaway:
      "Cada serviço é dono dos seus dados e só se fala por API ou evento; sem transação global, a consistência vira projeto: saga para coordenar, compensação para desfazer, consistência eventual como regra.",
  },
  {
    id: "aa4",
    num: "04",
    navTitle: "Comunicação",
    tag: "síncrono x fila",
    title: "Comunicação entre microsserviços",
    lead: "Chame de forma síncrona só o que precisa de resposta agora; todo o resto vira mensagem, com consumidor idempotente.",
    concept: [
      "Síncrono: o cliente envia e espera. REST trabalha sobre HTTP, sem estado e com status codes; gRPC usa Protocol Buffers em binário sobre HTTP/2, com contrato definido por esquema. O preço é o acoplamento temporal: se o notificador fica lento, cada pedido herda a lentidão, e se ele cai, ninguém compra, embora notificar não seja a parte crítica da compra.",
      "Assíncrono: o solicitante envia uma mensagem e segue; a fila absorve picos e desacopla no tempo, mas vira um novo ponto de falha e entrega pelo menos uma vez, com risco de duplicata, então o consumidor precisa ser idempotente. Na prática se faz o híbrido: síncrono para o que decide o fluxo, eventos para propagar mudanças. O API Gateway roteia, centraliza segurança e aplica rate limit, mas pode virar ponto único de falha; um identificador de requisição criado na borda permite seguir a ação por todos os logs.",
      "AWS e Azure lado a lado (acréscimo do professor, salvo SQS e Amazon API Gateway, citados no material): Amazon SQS x Azure Queue Storage para fila simples; SQS FIFO x Azure Service Bus para ordem e deduplicação; SNS e EventBridge x Service Bus topics e Event Grid para publicação e assinatura; Kinesis ou MSK x Event Hubs para fluxo de eventos; Amazon API Gateway x Azure API Management. Diferença real: SQS e Service Bus têm dead-letter queue nativa; o Queue Storage não, e a aplicação usa o dequeueCount para mover a mensagem sozinha.",
      "Na pista: síncrono é a pergunta pelo rádio que precisa de resposta antes de o piloto agir; assíncrono é o jogo de pneus retirado que vai para a pilha e é medido depois, com o carro já na pista. O código de barras do pneu, seguido por todos os registros, é o identificador de requisição. O rate limit é o limitador de velocidade do pit lane: a mesma regra para todos, aplicada na entrada, sem que nenhum posto da garagem mude nada.",
    ],
    pointsTitle: "Como os postos conversam",
    points: [
      {
        t: "202 Accepted",
        d: "O pedido é aceito na hora mesmo com o notificador fora; a fila guarda o trabalho.",
        color: "blue",
      },
      {
        t: "Pelo menos uma vez",
        d: "Mensagens podem chegar duplicadas nos dois provedores: o consumidor precisa ser idempotente.",
        color: "ember",
      },
      {
        t: "Rate limit na borda",
        d: "5 por segundo com rajada de 10: o excesso recebe 429 sem alterar nenhum serviço.",
        color: "signal",
      },
    ],
    examplesTitle: "Pedidos e notificações, síncrono e assíncrono",
    examples: [
      {
        label: "síncrono x fila",
        lang: "sh",
        code: `# Síncrono: o cliente espera a notificação
$ curl -s -X POST -o /dev/null -w "%{http_code} em %{time_total}s\\n" localhost:8080/pedidos/p1
201 em 2.0xxxxxs
# Síncrono, com o notificador fora do ar: a falha se propaga
$ docker compose stop notificador
$ curl -s -X POST -o /dev/null -w "%{http_code} em %{time_total}s\\n" localhost:8080/pedidos/p2
502 em 5.0xxxxxs
# Assíncrono: o pedido é aceito mesmo com o notificador fora
$ MODO=async docker compose up -d pedidos
$ sleep 6
$ for i in 1 2 3 4 5; do curl -s -X POST -o /dev/null -w "%{http_code} em %{time_total}s\\n" localhost:8080/pedidos/a$i; done
202 em 0.0xxxxxs
202 em 0.0xxxxxs
202 em 0.0xxxxxs
202 em 0.0xxxxxs
202 em 0.0xxxxxs
$ docker compose exec redis redis-cli LLEN fila:notificacoes
5`,
        note: "As cinco mensagens ficam guardadas até o consumidor voltar com docker compose start notificador.",
      },
      {
        label: "AWS: SQS (ElasticMQ)",
        lang: "sh",
        code: `$ docker run -d --name sqs -p 9324:9324 softwaremill/elasticmq-native
$ export AWS_ACCESS_KEY_ID=x AWS_SECRET_ACCESS_KEY=x AWS_DEFAULT_REGION=us-east-1   # credenciais falsas, só para o emulador
$ EP=http://localhost:9324
$ Q=$(aws --endpoint-url "$EP" sqs create-queue --queue-name pedidos --query QueueUrl --output text)
$ aws --endpoint-url "$EP" sqs send-message --queue-url "$Q" --message-body '{"pedido":"p1"}'
$ aws --endpoint-url "$EP" sqs receive-message --queue-url "$Q" --max-number-of-messages 1
$ aws --endpoint-url "$EP" sqs receive-message --queue-url "$Q" --max-number-of-messages 1   # logo em seguida`,
        note: "O segundo receive-message não traz mensagem: ela fica invisível (visibility timeout) até o delete-message com o ReceiptHandle.",
      },
      {
        label: "Azure: Queue Storage (Azurite)",
        lang: "sh",
        code: `$ docker run -d --name azurite -p 10001:10001 mcr.microsoft.com/azure-storage/azurite azurite-queue --queueHost 0.0.0.0 --skipApiVersionCheck
$ AZ_CS="DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;"
$ az storage queue create --name pedidos --connection-string "$AZ_CS"
$ az storage message put --queue-name pedidos --content '{"pedido":"p1"}' --connection-string "$AZ_CS"
$ az storage message get --queue-name pedidos --connection-string "$AZ_CS"`,
        note: "O get devolve id, popReceipt e dequeueCount; sem DLQ nativa, é o dequeueCount que decide quando desistir da mensagem.",
      },
    ],
    commands: [
      { cmd: "docker compose up -d --build", note: "sobe gateway, pedidos, notificador e Redis" },
      {
        cmd: "ID=$(docker compose logs --no-log-prefix pedidos | grep -o 'req=[0-9a-f]\\{32\\}' | tail -1)",
        note: "pega o identificador do último pedido",
      },
      {
        cmd: 'for i in $(seq 1 30); do curl -s -o /dev/null -w "%{http_code}\\n" -X POST localhost:8080/pedidos/r$i; done | sort | uniq -c',
        note: "rate limit: cerca de 11 a 15 respostas 202 e o resto 429",
      },
      { cmd: "docker compose down", note: "limpeza da etapa" },
    ],
    handsOnIntro:
      "Seis testes: síncrono, falha propagada, fila, recuperação, rastreio e rate limit.",
    handsOn: [
      "Suba o laboratório em modo sync e faça um pedido: 201 em cerca de 2 s.",
      "Pare o notificador e repita: 502 depois de cerca de 5 s, o acoplamento temporal.",
      "Recrie o pedidos com MODO=async e dispare cinco pedidos: 202 imediato e 5 na fila.",
      "Volte o notificador e veja cinco NOTIFICADO via fila, um a cada cerca de 2 s, até a fila zerar.",
      "Siga um req= pelos logs de pedidos e notificador e dispare 30 requisições para ver o 429 do rate limit.",
    ],
    tip: "Daqui até o fim da etapa, todo docker compose up precisa do prefixo MODO=async; sem ele, o pedidos volta ao modo síncrono sem avisar.",
    takeaway:
      "Chame de forma síncrona só o que precisa de resposta agora; todo o resto vira mensagem, com consumidor idempotente, e o gateway e o identificador de requisição cuidam do que atravessa todos os serviços.",
  },
];
