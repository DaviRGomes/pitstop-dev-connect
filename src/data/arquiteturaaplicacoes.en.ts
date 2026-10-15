// Content from the four lessons of the "Application Architecture" course (Phase 1), one stage per lesson,
// themed around Formula 1 by the /otimizar-relatorio pipeline (relatorios/arquitetura-aplicacoes/final.en.md).

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
    tema: "Monolith",
    f1: "A garage where the same mechanics do all the tasks, with a single procedure, rehearsed and released as a block",
  },
  {
    tema: "Layered architecture",
    f1: "The communication chain: driver, race engineer, pit wall, data analysts; each level only talks to the one below",
  },
  {
    tema: "Microservice",
    f1: "A specialist station (tires, strategy, power unit, the crew of each wheel), with its own role, people, equipment, and rehearsal",
  },
  {
    tema: "Shared capacity",
    f1: "The double stack: the single crew makes the second car wait for the first",
  },
  {
    tema: "HTTP status code",
    f1: "The release light: green only when everything is secured; 200 with an error is an unsafe release",
  },
  {
    tema: "API Gateway",
    f1: "The race engineer: the single voice between the driver and the team, who forwards each request to the right station",
  },
  {
    tema: "Database per service",
    f1: "Each discipline owns its data: whoever needs it asks for the number, and does not open the other's spreadsheet",
  },
  {
    tema: "Eventual consistency",
    f1: "The provisional classification, which converges to the official one after the stewards' decisions",
  },
  {
    tema: "Saga with compensation",
    f1: "The trip logistics booked in steps and undone in reverse order, with cancellations that stay in the history",
  },
  {
    tema: "Synchronous call x queue",
    f1: "The car stopped in the pit box waiting for a task x the removed tires that go to the pile and are measured later",
  },
  {
    tema: "Request identifier",
    f1: "The tire barcode, followed by every record",
  },
  {
    tema: "Cloud provider (AWS or Azure)",
    f1: "The circuit: each has its own facilities, and the team's procedure is the same at both",
  },
];

export const ANALOGY_NOTES: string[] = [
  "One crew per team: in practice, each team has a single crew for both cars, and the double stack is a cost that strategy manages. In software, separating each service's capacity is an architecture choice, and replicas are cheap.",
  "The stop is synchronous by nature: the stations are specialized, but the car only leaves the pit box when all four wheels are done. Microservices can also be independent in time, talking through a queue.",
  "People improvise; a gateway does not. The race engineer understands the content and prioritizes; the gateway forwards by prefix, counts requests, and returns codes, without understanding the domain.",
  "The network is not the garage: inside the garage, a question crosses three stations in seconds. Between services, each network hop adds latency and a chance of partial failure.",
  "Eventual consistency by software: the provisional classification converges through a human decision by the stewards; in a distributed system, convergence is done by events, compensations, and automatic rules.",
  "The circuit is not chosen: the calendar decides where the team races. In the cloud, the choice of provider is yours, and you can use both at the same time.",
];

export const LESSONS: Lesson[] = [
  {
    id: "aa1",
    num: "01",
    navTitle: "Monolith and microservices",
    tag: "layers x services",
    title: "Monolith, layered architecture, and microservices",
    lead: "Layers organize the code inside a single deployment; microservices split the deployment itself by business feature, and trade the pain of the single block for the complexity of a distributed system.",
    concept: [
      "A monolith is a design in which front-end, back-end, business logic, and database integration coexist in the same block of code and are deployed as a single entity. Any change requires redeploying everything, a failure in one component can affect the whole system and, to scale one part, the entire application is scaled. It is the Friday 4 p.m. case: changing only the video upload integration and having to test and deploy the whole block.",
      "Layered architecture (presentation, business, and data) is a horizontal cut: it organizes the code, but it remains a single deployment package, scaled and taken down at once. Microservices are the vertical cut, by business feature: small, independent services, with their own deployment, scaling, and data, talking through APIs (REST, GraphQL, RPC, or messaging). In REST, each response needs the correct status code: a 200 with an error body deceives the caller.",
      "Independence has a price: complexity of the whole, testing across services, decentralized governance, latency of call chains, data consistency, version control, and the need for a DevOps culture. In the cloud (added by the professor), the pairs are Amazon EC2 x Azure Virtual Machines for the VM, Amazon ECS with Fargate x Azure Container Apps for managed containers, Amazon EKS x AKS for Kubernetes, and AWS Lambda x Azure Functions for functions. ECS is AWS's own orchestrator, not Kubernetes; Container Apps runs on Kubernetes without exposing it.",
      "On track: the monolith is a hypothetical garage where the same mechanics do everything, with a single procedure; the layers are the chain of driver, race engineer, pit wall, and analysts; the microservices are the specialist stations. The status code is the release light, and a 200 with an error is the unsafe release: the car leaves the pit box with a wheel not properly secured while the green light said everything was fine. AWS and Azure are two circuits: the team's procedure is the same at both.",
    ],
    pointsTitle: "This stage's dashboard",
    points: [
      {
        t: "Layers do not solve deployment",
        d: "The horizontal cut organizes the code, but the package still goes to production as a whole.",
        color: "blue",
      },
      {
        t: "Double stack",
        d: "With shared capacity, the 0.1 s order inherits almost 4 s behind the reports.",
        color: "ember",
      },
      {
        t: "When NOT to migrate",
        d: "Small team, little traffic, and no CI/CD maturity: a well-organized layered monolith serves better.",
        color: "signal",
      },
    ],
    examplesTitle: "The same image in two topologies",
    examples: [
      {
        label: "etapa-01/compose.yaml",
        lang: "yaml",
        code: `services:
  monolito:                      # ONE process serves orders AND reports
    image: lab-arq-app           # image built by the docker build just below
    init: true                   # init as PID 1: forwards SIGTERM and stop takes 1 s, not 10 s
    environment:
      NOME: monolito             # shows up in the responses
      ROTAS: pedidos,relatorios  # both areas in the same process
    ports: ["8090:8080"]         # direct access, only for the lab

  pedidos:                       # service 1: orders only
    image: lab-arq-app
    init: true
    environment:
      NOME: pedidos
      ROTAS: pedidos
    ports: ["8091:8080"]

  relatorios:                    # service 2: reports only
    image: lab-arq-app
    init: true
    environment:
      NOME: relatorios
      ROTAS: relatorios
    ports: ["8092:8080"]`,
        note: "The same code in two topologies: the monolith serves both routes; pedidos and relatorios serve one each.",
      },
      {
        label: "double stack",
        lang: "sh",
        code: `# Monolith: four reports (2 s each, capacity 2) and, right after, one order
$ for i in 1 2 3 4; do curl -s -o /dev/null localhost:8090/relatorios/mensal & done
$ sleep 0.2
$ curl -s -o /dev/null -w "pedido no monolito: %{time_total}s\\n" localhost:8090/pedidos/1
$ wait
# The same load, with separate services
$ for i in 1 2 3 4; do curl -s -o /dev/null localhost:8092/relatorios/mensal & done
$ sleep 0.2
$ curl -s -o /dev/null -w "pedido no serviço próprio: %{time_total}s\\n" localhost:8091/pedidos/1
$ wait`,
        note: "In the monolith, the order takes between 2 and 4 s (typically close to 4); in its own service, about 0.10s.",
      },
      {
        label: "blast radius",
        lang: "sh",
        code: `# Monolith: a defect in any route kills the whole process
$ curl -s -o /dev/null -w "crash: %{http_code}\\n" localhost:8090/crash
crash: 000
$ curl -s -o /dev/null -w "pedidos no monolito depois do crash: %{http_code}\\n" localhost:8090/pedidos/1
pedidos no monolito depois do crash: 000
# Services: the defect kills only the reports service
$ curl -s -o /dev/null -w "crash: %{http_code}\\n" localhost:8092/crash
crash: 000
$ curl -s -o /dev/null -w "pedidos (serviço próprio): %{http_code}\\n" localhost:8091/pedidos/1
pedidos (serviço próprio): 200
$ docker compose ps -a --format "table {{.Service}}\\t{{.Status}}"`,
        note: "The ps shows monolito and relatorios as Exited (1). To recover: docker compose up -d.",
      },
    ],
    commands: [
      { cmd: "docker build -t lab-arq-app ./app", note: "builds the test application" },
      {
        cmd: "cd etapa-01 && docker compose up -d",
        note: "starts monolito, pedidos, and relatorios",
      },
      {
        cmd: 'curl -s -o /dev/null -w "%{http_code}\\n" localhost:8091/relatorios/mensal',
        note: "404: the orders service does not know the reports route",
      },
      { cmd: "docker compose down", note: "stage cleanup" },
    ],
    handsOnIntro: "Four timed tests with the same image in two topologies.",
    handsOn: [
      "Check both topologies and the status codes: 404 for /pedidos/999, 500 for /pedidos/erro, and 404 for reports on the orders service.",
      "Fire four reports at the monolith and, right after, one order: it takes between 2 and 4 seconds.",
      "Repeat the load with separate services: the order goes back to about 0.10 s.",
      "Call /crash on the monolith and on the reports service: 000 for the monolith's orders, 200 for the dedicated service.",
      "Confirm monolito and relatorios as Exited (1) in docker compose ps -a and recover with docker compose up -d.",
    ],
    tip: "Prefer gradual componentization: turn only the critical part into a service, instead of rewriting everything.",
    takeaway:
      "Layers organize the code inside one deployment; microservices split the deployment itself by feature, and trade the pain of the single block for the complexity of a distributed system.",
  },
  {
    id: "aa2",
    num: "02",
    navTitle: "Where to cut",
    tag: "DDD and gateway",
    title: "Microservices: where to cut and how to expose them",
    lead: "Cut by the business, not by the technology: each service owns a capability, with a clear contract, published behind a single front door.",
    concept: [
      "One service for the database, one for the rules, and one for the screens looks organized, but every new feature crosses all three, which must change and ship together: it is a distributed monolith. The material's principles: low coupling and high cohesion, hiding the domain's complexity behind a simple interface, architectural characteristics per service, and a single responsibility per service, with minimal and clear communication. Watch out: with synchronous communication, one service's availability starts depending on the other's.",
      'Strategic DDD provides the method: analyze the domain, define the bounded contexts, define entities, aggregates, and services in each context and, finally, identify the microservices. A bounded context is the boundary within which a term has a single meaning: "scheduling" is an agenda to fulfill for the Professor and a time slot booking for the Candidate. The test system yields five services: Authentication (with JWT and roles), ADM (which can have only a cache), Professor, Company, and Candidate.',
      "Versioned contracts (OpenAPI for HTTP, AsyncAPI for events and messages) keep an update to one service from breaking the others, and service discovery replaces a fixed IP with a name resolved to the healthy instances. On AWS (added by the professor), discovery is a separate product, AWS Cloud Map, or ECS Service Connect; on Azure there is no 1:1 pair, and it comes built into Azure Container Apps or into Kubernetes DNS on AKS. The single front door is Amazon API Gateway at one circuit and Azure API Management at the other.",
      'On track: teams organize by discipline (aerodynamics, vehicle dynamics, power unit, tires, strategy), not by "who handles the data". The word "window" is a textbook bounded context: a range of laps for the strategist, a temperature range for the tire engineer. The gateway is the race engineer, the only voice the driver knows, and the versioned contract is the telemetry channel list, which only drops a channel after everyone has migrated.',
    ],
    pointsTitle: "Pieces of the cut",
    points: [
      {
        t: "Capability, not layer",
        d: "Scheduling is a business capability; data access and messaging are technical layers.",
        color: "blue",
      },
      {
        t: "Versioned contract",
        d: "OpenAPI and AsyncAPI: update a service without breaking whoever depends on it.",
        color: "signal",
      },
      {
        t: "Contained failure",
        d: "With one service stopped, the gateway returns 502 only for that route.",
        color: "ember",
      },
    ],
    examplesTitle: "Five services by domain behind a gateway",
    examples: [
      {
        label: "gateway.conf",
        lang: "sh",
        code: `server {
    listen 80;
    resolver 127.0.0.11 valid=5s;   # Docker's internal DNS; resolves service names at request time

    location /autenticacao/ { set $alvo http://autenticacao:8080; proxy_pass $alvo; }  # prefix -> service
    location /adm/          { set $alvo http://adm:8080;          proxy_pass $alvo; }
    location /professor/    { set $alvo http://professor:8080;    proxy_pass $alvo; }
    location /empresa/      { set $alvo http://empresa:8080;      proxy_pass $alvo; }
    location /candidato/    { set $alvo http://candidato:8080;    proxy_pass $alvo; }
}`,
        note: "The variable in proxy_pass lets Nginx start even with a service stopped and answer 502 only for that route.",
      },
      {
        label: "etapa-02/compose.yaml",
        lang: "yaml",
        code: `services:
  autenticacao:
    image: lab-arq-app
    init: true                                                  # fast stop (see Stage 01)
    environment: { NOME: autenticacao, ROTAS: autenticacao }   # only answers for its own domain
  adm:
    image: lab-arq-app
    init: true                                                  # fast stop (see Stage 01)
    environment: { NOME: adm, ROTAS: adm }
  professor:
    image: lab-arq-app
    init: true                                                  # fast stop (see Stage 01)
    environment: { NOME: professor, ROTAS: professor }
  empresa:
    image: lab-arq-app
    init: true                                                  # fast stop (see Stage 01)
    environment: { NOME: empresa, ROTAS: empresa }
  candidato:
    image: lab-arq-app
    init: true                                                  # fast stop (see Stage 01)
    environment: { NOME: candidato, ROTAS: candidato }

  gateway:
    image: nginx:1.27-alpine
    ports: ["8080:80"]                                          # only port exposed to the world
    volumes:
      - ./gateway.conf:/etc/nginx/conf.d/default.conf:ro        # replaces the default configuration
    depends_on: [autenticacao, adm, professor, empresa, candidato]`,
      },
      {
        label: "isolated failure",
        lang: "sh",
        code: `# Bring down only the Company service
$ docker compose stop empresa
$ for d in autenticacao professor empresa candidato; do echo -n "$d: "; curl -s -o /dev/null -w "%{http_code}\\n" localhost:8080/$d/exemplo; done
autenticacao: 200
professor: 200
empresa: 502
candidato: 200`,
        note: "The gateway is the proof that the cut by domain contains the damage.",
      },
    ],
    commands: [
      { cmd: "docker compose up -d", note: "starts the five services and the gateway" },
      {
        cmd: "for d in autenticacao adm professor empresa candidato; do curl -s localhost:8080/$d/exemplo; done",
        note: "each prefix lands on the service of its domain",
      },
      { cmd: "docker compose stop empresa", note: "brings down only the Company domain" },
      {
        cmd: 'curl -s -o /dev/null -w "%{http_code}\\n" localhost:8080/financeiro/relatorio',
        note: "404 returned by the gateway itself",
      },
    ],
    handsOnIntro: "Five services behind a single voice at localhost:8080.",
    handsOn: [
      "Create the etapa-02 folder with gateway.conf and compose.yaml and start everything.",
      "Call the five prefixes and check that each response carries a servico equal to the requested prefix.",
      "Stop the empresa service and see 200 on the other domains and 502 only for empresa.",
      "Request /financeiro/relatorio and get a 404 from the gateway itself.",
      "Run docker compose down before the next stage.",
    ],
    tip: "A bounded context is not memorized: recognize it in the vocabulary of the people who work in the business. The same word with different models signals different contexts.",
    takeaway:
      "Cut by the business, not by the technology: each service owner of a capability, with a clear contract, failing and scaling on its own.",
  },
  {
    id: "aa3",
    num: "03",
    navTitle: "Databases",
    tag: "database per service and saga",
    title: "Database with microservices",
    lead: "Each service owns its data and you only talk by API or event; without a global transaction, consistency becomes a design: saga to coordinate, compensation to undo.",
    concept: [
      "A shared database is the strongest coupling possible: the inventory team renames a column on a Saturday and the orders service stops without knowing why. With a database per service (and polyglot persistence), nobody reads another's database. The four challenges: data isolation (exchange by API or event, with duplicated data), consistency (ACID gives way to eventual consistency), distributed transactions, and schema evolution, versioned with Flyway or Liquibase.",
      "CAP: since network partitions happen, during a partition you choose between consistency and availability; without a partition, you can have both. SQL brings a rigid schema, ACID, and joins; NoSQL brings a flexible schema and horizontal scaling. A saga chains local transactions and, if a step fails, runs compensations in reverse order, by orchestration or by choreography. 2PC gives strong consistency, but holds resources and is usually avoided between microservices. Event Sourcing stores the sequence of events; CQRS separates the write model from the read model.",
      "AWS and Azure side by side (added by the professor, except DynamoDB and Cosmos DB, cited in the material): Amazon RDS and Aurora x Azure Database for PostgreSQL and MySQL; Amazon DynamoDB x Azure Cosmos DB; Amazon ElastiCache x Azure Cache for Redis; AWS Step Functions x Azure Durable Functions to orchestrate the saga. DynamoDB charges by read and write capacity and reads with eventual consistency by default, with optional strong reads; Cosmos DB charges in Request Units per second and exposes five configurable consistency levels.",
      'On track: each discipline owns its data, and strategy asks for the number or receives the "tire went past the limit" notice. The classification right after the checkered flag is provisional and converges to the official one after the stewards: that is eventual consistency. The CAP partition is the loss of the telemetry link between the car and the pit wall. The saga is the travel logistics for the next GP (flight, hotel, freight), booked step by step and undone in reverse order if a step fails; choreography is race control\'s safety car message: it only announces the event, and each team decides on its own how to react.',
    ],
    pointsTitle: "Rules of distributed data",
    points: [
      {
        t: "Compensating is not rolling back",
        d: "The cancelled booking stays in the database with its status changed: it is a new business action.",
        color: "ember",
      },
      {
        t: "Idempotent compensation",
        d: "Cancelling twice makes nothing worse; the orchestrator may repeat it after a failure.",
        color: "signal",
      },
      {
        t: "Schema is a choice",
        d: "SQL rejects the column without a migration; NoSQL accepts it and hands validation to the application.",
        color: "blue",
      },
    ],
    examplesTitle: "Orchestrated saga and NoSQL at both circuits",
    examples: [
      {
        label: "saga.sh",
        lang: "sh",
        code: `#!/usr/bin/env bash
# Orchestrated saga: books flight, hotel, and car; if any step fails, compensates the previous ones in reverse order.
ID="$1"
PASSOS=(voo:8101 hotel:8102 carro:8103)   # name:port, in execution order
FEITOS=()                                  # steps already completed (candidates for compensation)

for passo in "\${PASSOS[@]}"; do
  nome="\${passo%%:*}"; porta="\${passo##*:}"
  codigo=$(curl -s -o /dev/null -w "%{http_code}" -X POST "localhost:$porta/reservar/$ID")
  if [ "$codigo" = "201" ]; then
    echo "OK     reservar $nome"
    FEITOS+=("$passo")
  else
    echo "FALHA  reservar $nome (HTTP $codigo), compensando..."
    for ((i=\${#FEITOS[@]}-1; i>=0; i--)); do   # from the last completed to the first
      f="\${FEITOS[$i]}"
      curl -s -o /dev/null -X POST "localhost:\${f##*:}/cancelar/$ID"
      echo "DESFEZ cancelar \${f%%:*}"
    done
    exit 1
  fi
done
echo "SAGA CONCLUIDA para $ID"`,
        note: "With the car in failure mode, the output ends with FALHA reservar carro (HTTP 500), DESFEZ cancelar hotel, and DESFEZ cancelar voo.",
      },
      {
        label: "AWS: DynamoDB",
        lang: "sh",
        code: `# AWS: DynamoDB table with on-demand billing
$ aws dynamodb create-table --table-name produtos --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST`,
        note: "Cloud reference: it creates resources and incurs charges. Cleanup: aws dynamodb delete-table --table-name produtos.",
      },
      {
        label: "Azure: Cosmos DB",
        lang: "sh",
        code: `# Azure: Cosmos DB account, database, and container with partition key /id
$ az group create --name rg-lab --location brazilsouth
$ az cosmosdb create --name <conta-unica> --resource-group rg-lab
$ az cosmosdb sql database create --account-name <conta-unica> --resource-group rg-lab --name loja
$ az cosmosdb sql container create --account-name <conta-unica> --resource-group rg-lab --database-name loja --name produtos --partition-key-path "/id"`,
        note: "Cloud reference: it creates resources and incurs charges. Cleanup: az group delete --name rg-lab --yes.",
      },
    ],
    commands: [
      {
        cmd: "docker compose up -d --build",
        note: "starts voo, hotel, and carro, each with its own volume",
      },
      { cmd: "./saga.sh viagem-1", note: "happy path: three OK and SAGA CONCLUIDA" },
      { cmd: "curl -s -X POST localhost:8103/modo/falha", note: "the car service starts failing" },
      {
        cmd: "curl -s localhost:8102/reservas",
        note: "viagem-2 shows up as CANCELADA, not deleted",
      },
    ],
    handsOnIntro: "Database per service, a saga with compensation, and rigid x flexible schema.",
    handsOn: [
      "Start the three booking services and run ./saga.sh viagem-1 until you see SAGA CONCLUIDA.",
      "Put the car in failure mode, run ./saga.sh viagem-2, and see DESFEZ cancelar hotel and DESFEZ cancelar voo.",
      "Query /reservas on the three services: viagem-2 is CANCELADA on voo and hotel, and carro shows only viagem-1. Then restore the car with /modo/normal.",
      "In Postgres, insert the tags column without a migration, see the ERROR, and fix it with ALTER TABLE.",
      "Run the miniature Event Sourcing: the balance of 120 only becomes 130 in the view after the REFRESH. Clean up with docker compose down -v.",
    ],
    tip: 'Read CAP as a choice during the partition, not as "pick two of three". Without a partition, you can have consistency and availability.',
    takeaway:
      "Each service owns its data and you only talk by API or event; without a global transaction, consistency becomes a design: saga to coordinate, compensation to undo, eventual consistency as the rule.",
  },
  {
    id: "aa4",
    num: "04",
    navTitle: "Communication",
    tag: "synchronous x queue",
    title: "Communication between microservices",
    lead: "Call synchronously only what needs an answer now; everything else becomes a message, with an idempotent consumer.",
    concept: [
      "Synchronous: the client sends and waits. REST works over HTTP, stateless and with status codes; gRPC uses binary Protocol Buffers over HTTP/2, with a schema-defined contract. The price is temporal coupling: if the notifier gets slow, every order inherits the slowness, and if it goes down, nobody can buy, even though notifying is not the critical part of the purchase.",
      "Asynchronous: the requester sends a message and moves on; the queue absorbs peaks and decouples in time, but it becomes a new point of failure and delivers at least once, with a risk of duplicates, so the consumer must be idempotent. In practice the hybrid is used: synchronous for what decides the flow, events to propagate changes. The API Gateway routes, centralizes security, and applies rate limiting, but it can become a single point of failure; a request identifier created at the edge lets you follow the action through every log.",
      "AWS and Azure side by side (added by the professor, except SQS and Amazon API Gateway, cited in the material): Amazon SQS x Azure Queue Storage for a simple queue; SQS FIFO x Azure Service Bus for ordering and deduplication; SNS and EventBridge x Service Bus topics and Event Grid for publish and subscribe; Kinesis or MSK x Event Hubs for event streams; Amazon API Gateway x Azure API Management. A real difference: SQS and Service Bus have a native dead-letter queue; Queue Storage does not, and the application uses the dequeueCount to move the message on its own.",
      "On track: synchronous is the radio question that needs an answer before the driver acts; asynchronous is the removed set of tires that goes to the pile and is measured later, with the car already back on track. The tire barcode, followed by every record, is the request identifier. The rate limit is the pit lane speed limiter: the same rule for everyone, applied at the entry, without any station in the garage changing anything.",
    ],
    pointsTitle: "How the stations talk",
    points: [
      {
        t: "202 Accepted",
        d: "The order is accepted right away even with the notifier down; the queue keeps the work.",
        color: "blue",
      },
      {
        t: "At least once",
        d: "Messages can arrive duplicated at both providers: the consumer must be idempotent.",
        color: "ember",
      },
      {
        t: "Rate limit at the edge",
        d: "5 per second with a burst of 10: the excess gets 429 without changing any service.",
        color: "signal",
      },
    ],
    examplesTitle: "Orders and notifications, synchronous and asynchronous",
    examples: [
      {
        label: "synchronous x queue",
        lang: "sh",
        code: `# Synchronous: the client waits for the notification
$ curl -s -X POST -o /dev/null -w "%{http_code} em %{time_total}s\\n" localhost:8080/pedidos/p1
201 em 2.0xxxxxs
# Synchronous, with the notifier down: the failure propagates
$ docker compose stop notificador
$ curl -s -X POST -o /dev/null -w "%{http_code} em %{time_total}s\\n" localhost:8080/pedidos/p2
502 em 5.0xxxxxs
# Asynchronous: the order is accepted even with the notifier down
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
        note: "The five messages stay stored until the consumer comes back with docker compose start notificador.",
      },
      {
        label: "AWS: SQS (ElasticMQ)",
        lang: "sh",
        code: `$ docker run -d --name sqs -p 9324:9324 softwaremill/elasticmq-native
$ export AWS_ACCESS_KEY_ID=x AWS_SECRET_ACCESS_KEY=x AWS_DEFAULT_REGION=us-east-1   # fake credentials, only for the emulator
$ EP=http://localhost:9324
$ Q=$(aws --endpoint-url "$EP" sqs create-queue --queue-name pedidos --query QueueUrl --output text)
$ aws --endpoint-url "$EP" sqs send-message --queue-url "$Q" --message-body '{"pedido":"p1"}'
$ aws --endpoint-url "$EP" sqs receive-message --queue-url "$Q" --max-number-of-messages 1
$ aws --endpoint-url "$EP" sqs receive-message --queue-url "$Q" --max-number-of-messages 1   # right after`,
        note: "The second receive-message brings no message: it stays invisible (visibility timeout) until delete-message with the ReceiptHandle.",
      },
      {
        label: "Azure: Queue Storage (Azurite)",
        lang: "sh",
        code: `$ docker run -d --name azurite -p 10001:10001 mcr.microsoft.com/azure-storage/azurite azurite-queue --queueHost 0.0.0.0 --skipApiVersionCheck
$ AZ_CS="DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;"
$ az storage queue create --name pedidos --connection-string "$AZ_CS"
$ az storage message put --queue-name pedidos --content '{"pedido":"p1"}' --connection-string "$AZ_CS"
$ az storage message get --queue-name pedidos --connection-string "$AZ_CS"`,
        note: "The get returns id, popReceipt, and dequeueCount; with no native DLQ, the dequeueCount decides when to give up on the message.",
      },
    ],
    commands: [
      {
        cmd: "docker compose up -d --build",
        note: "starts gateway, pedidos, notificador, and Redis",
      },
      {
        cmd: "ID=$(docker compose logs --no-log-prefix pedidos | grep -o 'req=[0-9a-f]\\{32\\}' | tail -1)",
        note: "grabs the identifier of the last order",
      },
      {
        cmd: 'for i in $(seq 1 30); do curl -s -o /dev/null -w "%{http_code}\\n" -X POST localhost:8080/pedidos/r$i; done | sort | uniq -c',
        note: "rate limit: about 11 to 15 responses of 202 and the rest 429",
      },
      { cmd: "docker compose down", note: "stage cleanup" },
    ],
    handsOnIntro:
      "Six tests: synchronous, propagated failure, queue, recovery, tracing, and rate limit.",
    handsOn: [
      "Start the lab in sync mode and place an order: 201 in about 2 s.",
      "Stop the notifier and repeat: 502 after about 5 s, the temporal coupling.",
      "Recreate pedidos with MODO=async and fire five orders: an immediate 202 and 5 in the queue.",
      "Bring the notifier back and see five NOTIFICADO via fila lines, one about every 2 s, until the queue is empty.",
      "Follow a req= through the pedidos and notificador logs and fire 30 requests to see the rate limit's 429.",
    ],
    tip: "From here to the end of the stage, every docker compose up needs the MODO=async prefix; without it, pedidos goes back to synchronous mode without warning.",
    takeaway:
      "Call synchronously only what needs an answer now; everything else becomes a message, with an idempotent consumer, and the gateway and the request identifier take care of what crosses all the services.",
  },
];
