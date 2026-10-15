// Conteúdo das seis aulas da disciplina "Escalabilidade nos servidores" (Fase 2), uma etapa por aula.
// Formato próprio deste guia: cada etapa parte de uma pergunta e de um sintoma, explica o conceito,
// traz analogias conceituais de F1 (sem corridas reais), uma tabela de trade-offs e um laboratório local.

export type Example = {
  label: string;
  lang: "yaml" | "sh";
  code: string;
  note?: string;
};

export type Command = { cmd: string; note?: string };

/** Termo técnico, a analogia de F1 e, quando existe, onde a analogia deixa de valer. */
export type Analogy = { term: string; f1: string; limit?: string };

/** Uma linha da tabela "ganha x paga". */
export type Tradeoff = { option: string; gain: string; cost: string };

export type Lesson = {
  id: string;
  num: string;
  navTitle: string;
  tag: string;
  title: string;
  question: string;
  symptom: string;
  /** A mesma situação do sintoma, contada como uma cena de box. */
  pitScene: string;
  answer: string;
  concept: string[];
  analogies: Analogy[];
  tradeoffs: Tradeoff[];
  examplesTitle: string;
  examples: Example[];
  commands: Command[];
  labGoal: string;
  labSteps: string[];
  labNote?: string;
  rule: string;
  /** A regra de bolso dita na linguagem da pista. */
  pitRule: string;
  selfCheck: string;
};

/** Peças do mapa da arquitetura no topo do guia, na ordem em que a requisição passa por elas. */
export type MapNode = {
  id: string;
  label: string;
  detail: string;
  /** O equivalente da peça no box de F1. */
  f1: string;
  stages: string[];
};

export const SYSTEM_MAP: MapNode[] = [
  {
    id: "usuario",
    label: "Usuário",
    detail: "a requisição nasce aqui",
    f1: "o carro chegando ao pit lane",
    stages: [],
  },
  {
    id: "borda",
    label: "CDN / borda",
    detail: "cache perto do usuário",
    f1: "o estoque de peças no circuito",
    stages: ["es4"],
  },
  {
    id: "lb",
    label: "Load balancer",
    detail: "um endereço, várias réplicas",
    f1: "o controle de entrada do pit lane",
    stages: ["es2"],
  },
  {
    id: "app",
    label: "Réplicas stateless",
    detail: "qualquer uma atende qualquer cliente",
    f1: "boxes idênticos, set-up no painel",
    stages: ["es1", "es3"],
  },
  {
    id: "fila",
    label: "Redis, fila e workers",
    detail: "estado e trabalho lento",
    f1: "o painel da garagem e a pilha de pneus",
    stages: ["es3"],
  },
  {
    id: "banco",
    label: "Banco primary + réplica",
    detail: "escrita num lugar, leitura em vários",
    f1: "o arquivo oficial e a cópia no circuito",
    stages: ["es5"],
  },
];

export const OBSERVABILITY_NODE: MapNode = {
  id: "obs",
  label: "Observabilidade",
  detail: "métricas, logs e traces atravessando todas as camadas",
  f1: "telemetria, rádio e minissetores",
  stages: ["es6"],
};

export const LESSONS: Lesson[] = [
  {
    id: "es1",
    num: "01",
    navTitle: "Velocidade ou volume",
    tag: "desempenho x escala",
    title: "Fundamentos de escalabilidade moderna",
    question: "O seu problema é velocidade ou volume?",
    symptom:
      "O sistema fica lento quando muita gente chega ao mesmo tempo, e a primeira reação é comprar uma máquina maior.",
    pitScene:
      "A fila no pit lane cresce. Treinar a crew deixa cada parada mais curta; abrir mais boxes atende mais carros ao mesmo tempo. São remédios diferentes para problemas diferentes.",
    answer:
      "Escalar aumenta quanto o sistema aguenta; otimizar faz cada tarefa custar menos. Antes de comprar servidor, descubra qual dos dois problemas você tem.",
    concept: [
      "Desempenho é a latência de uma única tarefa. Otimização melhora esse desempenho sem adicionar recursos. Escalabilidade é aumentar o throughput proporcionalmente aos recursos adicionados: quando a fila fica gigantesca, não adianta o caixa mais rápido do mundo, é preciso abrir mais caixas.",
      "Escala vertical (scaling up) é um servidor maior: simples, mas tem teto físico e financeiro, costuma exigir downtime e cria um ponto único de falha. Escala horizontal (scaling out) é mais servidores dividindo a carga: teto muito maior e mais resiliência, desde que a aplicação seja stateless e exista um load balancer.",
      "Elasticidade é crescer e encolher conforme a carga; autoscaling é o mecanismo que a implementa. Por métrica (CPU acima de 70% por 5 minutos), agendado (subir às 8h55, descer às 18h05) ou preditivo (Machine Learning sobre o histórico). Performance, custo e complexidade formam um triângulo: não dá para maximizar os três.",
    ],
    analogies: [
      {
        term: "Otimização",
        f1: "Treinar a crew para baixar o tempo de cada pit stop: o mesmo box atende cada carro mais rápido.",
      },
      {
        term: "Escala horizontal",
        f1: "Abrir mais boxes: cada pit stop continua levando o mesmo tempo, mas mais carros voltam à pista no mesmo intervalo.",
      },
      {
        term: "Capacidade da instância",
        f1: "Quantas posições de serviço um box tem ao mesmo tempo.",
        limit:
          "Um box de F1 atende um carro por vez. A capacidade 2 do laboratório é um box imaginário com duas posições de serviço.",
      },
      {
        term: "Ponto único de falha",
        f1: "A unidade de potência: não existe reserva dentro do carro. Se ela falha, o carro para, por melhor que esteja todo o resto.",
      },
    ],
    tradeoffs: [
      {
        option: "Otimizar",
        gain: "Melhora latência e throughput de uma vez, sem custo de infraestrutura.",
        cost: "Tem retorno decrescente: uma hora o código já está bom e a fila continua.",
      },
      {
        option: "Escala vertical",
        gain: "Simples: nada muda na aplicação.",
        cost: "Teto físico e financeiro, downtime na troca e um ponto único de falha.",
      },
      {
        option: "Escala horizontal",
        gain: "Teto muito maior e resiliência à queda de uma máquina.",
        cost: "Exige aplicação stateless e um load balancer na frente.",
      },
      {
        option: "Autoscaling",
        gain: "Paga só pela capacidade que a carga pede.",
        cost: "Reage com atraso; picos instantâneos ainda precisam de folga.",
      },
    ],
    examplesTitle: "Uma loja com capacidade limitada",
    examples: [
      {
        label: "app/app.py",
        lang: "sh",
        code: `# Modelo de servidor: no máximo CAPACIDADE requisições ao mesmo tempo
HOST = socket.gethostname()  # nome do container: identifica quem respondeu
TRABALHO = float(os.getenv("TRABALHO_MS", "100")) / 1000
CAPACIDADE = threading.Semaphore(int(os.getenv("CAPACIDADE", "2")))

def do_GET(self):
    if self.path == "/health":
        corpo = "ok\\n"
    else:
        with CAPACIDADE:            # só N entram de cada vez
            time.sleep(TRABALHO)    # simula o trabalho real
        corpo = f"{HOST} {VERSAO}\\n"`,
        note: "É uma maquete, não um servidor real: os números ficam previsíveis por construção.",
      },
      {
        label: "experimento",
        lang: "sh",
        code: `$ docker build -t lab-app ./app
$ carga() { time (seq 1 100 | xargs -P 20 -I{} curl -s -o /dev/null "$1"); }
# Linha de base: capacidade 2, 100 ms
$ docker run -d --name base -p 8081:8080 lab-app
$ carga http://localhost:8081/
real    0m5.2s
# Otimização: metade do trabalho
$ docker run -d --name otim -p 8082:8080 -e TRABALHO_MS=50 lab-app
# Vertical: capacidade 4
$ docker run -d --name vert -p 8083:8080 -e CAPACIDADE=4 lab-app`,
        note: "Base cerca de 5 s; otimização e vertical cerca de 2,5 s; três instâncias cerca de 1,7 s.",
      },
    ],
    commands: [
      { cmd: "docker build -t lab-app ./app", note: "constrói a aplicação de teste" },
      {
        cmd: 'curl -s -o /dev/null -w "%{time_total}s\\n" localhost:8081/',
        note: "latência de uma requisição",
      },
      { cmd: "docker stop base", note: "derruba o servidor único e expõe o SPOF" },
      { cmd: "docker rm -f base otim vert h1 h2 h3", note: "limpeza da etapa" },
    ],
    labGoal: "Meça a diferença entre otimizar, escalar para cima e escalar para fora.",
    labSteps: [
      "Rode a linha de base e anote a latência de uma requisição e o tempo para 100.",
      "Repita com TRABALHO_MS=50 (otimização) e com CAPACIDADE=4 (vertical).",
      "Suba h1, h2 e h3 nas portas 8084 a 8086 e distribua a carga pelo módulo 3 do número da requisição.",
      "Compare: escalar não mexeu na latência isolada, otimizar mexeu nos dois.",
      "Derrube base e h1: veja 000 no servidor único e 000 200 200 na frota.",
    ],
    rule: "Antes de escalar, meça. Um índice no banco pode valer mais que dez servidores.",
    pitRule: "crew mais rápida não abre box novo, e box novo não deixa a parada mais curta.",
    selfCheck:
      "Você consegue explicar por que três réplicas não deixam uma requisição isolada mais rápida?",
  },
  {
    id: "es2",
    num: "02",
    navTitle: "Distribuir a carga",
    tag: "L4, L7 e deploy",
    title: "Load balancers na prática",
    question: "Como espalhar a carga e trocar de versão sem ninguém perceber?",
    symptom:
      "Há várias réplicas, mas o cliente precisa de um endereço só; e quando uma réplica cai ou uma versão nova sai com bug, alguém tem de reagir em segundos.",
    pitScene:
      "Os carros entram todos pela mesma porta do pit lane. Se ninguém controla essa entrada, um box fecha e o próximo carro para na frente da porta dele, esperando à toa.",
    answer:
      "O load balancer é o único ponto de entrada que distribui a carga, tira instâncias doentes de rotação e permite trocar versões sem derrubar ninguém.",
    concept: [
      "Um load balancer é um proxy entre clientes e servidores: o cliente fala com um endereço só. O L4 (TCP/UDP) decide por IP e porta, é extremamente rápido e não enxerga o conteúdo (AWS NLB). O L7 (HTTP) lê caminho, cabeçalhos e cookies e roteia /api/pagamentos para um grupo e /blog para outro (AWS ALB).",
      "Algoritmos: round-robin (fila circular, ignora carga), weighted round-robin (pesos para máquinas maiores), least connections (quem tem menos conexões ativas) e IP hash (o mesmo IP sempre no mesmo servidor, com risco de desequilíbrio atrás de um proxy corporativo).",
      "Health checks testam cada servidor; falhou, ocorre o failover e o tráfego novo vai para os saudáveis. Connection draining deixa as conexões em andamento terminarem. Blue/Green vira 100% de uma vez com rollback instantâneo; canary manda 1% a 10% para a versão nova e aumenta aos poucos.",
    ],
    analogies: [
      {
        term: "Load balancer",
        f1: "O controle de entrada do pit lane, que manda cada carro para um box livre.",
        limit:
          "Na F1 cada carro sempre para no box da própria equipe. Servidor não tem regulamento: qualquer réplica pode atender qualquer requisição.",
      },
      {
        term: "L4 x L7",
        f1: "O L4 é o laço de cronometragem, que só lê o número do transponder; o L7 é o engenheiro que ouve o rádio e entende o pedido.",
      },
      {
        term: "Health check e failover",
        f1: "O fiscal que vê um box fechado e desvia o próximo carro para outro antes que ele pare na frente da porta.",
      },
      {
        term: "Canary",
        f1: "Um pacote de atualização montado primeiro em um carro só, para comparar com o outro antes de equipar os dois.",
        limit:
          "Com dois carros, o menor canary possível é metade da frota; no load balancer você escolhe 1%, 5% ou 10%.",
      },
    ],
    tradeoffs: [
      {
        option: "Round-robin",
        gain: "Simples e previsível.",
        cost: "Ignora a carga real: um servidor lento recebe tanto quanto um rápido.",
      },
      {
        option: "Least connections",
        gain: "Acompanha a carga de verdade.",
        cost: "Precisa contar conexões; requisições curtas e longas pesam igual.",
      },
      {
        option: "IP hash",
        gain: "O mesmo cliente cai sempre no mesmo servidor.",
        cost: "Desequilibra atrás de um proxy corporativo, onde mil pessoas têm um IP só.",
      },
      {
        option: "Blue/Green",
        gain: "Virada e rollback instantâneos.",
        cost: "Dobra a infraestrutura durante a troca.",
      },
      {
        option: "Canary",
        gain: "Um bug atinge só uma fração dos usuários.",
        cost: "Exige métricas para decidir se avança ou volta.",
      },
    ],
    examplesTitle: "Nginx balanceando 3 réplicas",
    examples: [
      {
        label: "docker-compose.yml",
        lang: "yaml",
        code: `name: lab-etapa-02
services:
  app:
    build: ../app
    image: lab-app
    environment:
      VERSAO: v1              # versão estável (a "azul")
    deploy:
      replicas: 3             # três cópias idênticas
  verde:
    image: lab-app
    environment:
      VERSAO: v2              # versão nova, usada no canary
  lb:
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx:/etc/nginx/conf.d:ro
    depends_on: [app, verde]`,
      },
      {
        label: "nginx/default.conf",
        lang: "sh",
        code: `upstream azul {
    zone azul 64k;   # round-robin compartilhado entre os workers do Nginx
    server app:8080 max_fails=1 fail_timeout=10s;   # health check passivo
}
upstream verde { server verde:8080; }

server {
    listen 80;
    location / {
        proxy_pass http://azul;
        proxy_connect_timeout 1s;           # desiste rápido de quem não responde
        proxy_next_upstream error timeout;  # tenta o próximo servidor
    }
}`,
        note: "O Nginx de código aberto faz health check passivo; o ALB sonda ativamente em intervalo.",
      },
      {
        label: "canary 10%",
        lang: "sh",
        code: `# Sorteia pelo ID da requisição: 10% para verde, o resto para azul
split_clients "\${request_id}" $destino {
    10% verde;
    *   azul;
}
# no location /: proxy_pass http://$destino;

$ seq 1 200 | xargs -P 10 -I{} curl -s localhost:8080/ | awk '{print $2}' | sort | uniq -c
    180 v1
     20 v2`,
        note: "Troque 10% por 100% para a virada blue/green; apague a linha para o rollback.",
      },
    ],
    commands: [
      {
        cmd: "for i in $(seq 1 30); do curl -s localhost:8080/; done | awk '{print $1}' | sort | uniq -c",
        note: "10 respostas para cada réplica",
      },
      {
        cmd: "docker stop $(docker compose ps -q app | head -n 1)",
        note: "derruba uma réplica para ver o failover",
      },
      {
        cmd: "docker compose exec lb nginx -t && docker compose exec lb nginx -s reload",
        note: "valida e recarrega sem derrubar conexões",
      },
    ],
    labGoal: "Veja os algoritmos em ação, derrube uma réplica de propósito e faça um canary.",
    labSteps: [
      "Faça 30 requisições e confirme 10 para cada réplica (round-robin).",
      "Derrube uma réplica e confirme 20 respostas 200; depois suba de volta e recarregue o Nginx.",
      "Troque para least_conn e depois ip_hash; com ip_hash todas caem no mesmo servidor.",
      "Configure o canary de 10% e conte cerca de 180 v1 e 20 v2.",
      "Vire para 100% verde (blue/green) e faça o rollback para azul.",
    ],
    labNote:
      "No macOS, use gsed (brew install gnu-sed) no lugar de sed -i, ou edite o arquivo à mão.",
    rule: "Todo deploy precisa de um caminho de volta que leve segundos, não minutos.",
    pitRule:
      "o controle de entrada nunca manda um carro para um box fechado, e toda peça nova tem como ser desmontada antes da próxima volta.",
    selfCheck:
      "Você sabe dizer o que acontece com as conexões em andamento quando uma réplica sai de rotação?",
  },
  {
    id: "es3",
    num: "03",
    navTitle: "Estado e filas",
    tag: "padrões de escala",
    title: "Padrões de escala horizontal em arquiteturas cloud",
    question: "Onde mora o estado, e quem faz o trabalho lento?",
    symptom:
      "O usuário adiciona itens ao carrinho e, na requisição seguinte, o carrinho aparece vazio; ou o checkout demora porque espera a nota fiscal e o e-mail ficarem prontos.",
    pitScene:
      "O set-up do carro está só na cabeça de um mecânico: ele sai do box e ninguém sabe o acerto. E o carro fica parado esperando a análise do pneu, que poderia ser feita depois.",
    answer:
      "Se o estado mora no servidor, o servidor não pode morrer nem ser trocado. Tire o estado para fora e tire o trabalho lento do caminho da resposta.",
    concept: [
      "Stateful guarda a sessão na memória do servidor: o LB manda o cliente para outra réplica e o carrinho some. Sticky sessions remendam, mas limitam a resiliência. Stateless externaliza o estado (Redis, banco): qualquer réplica atende qualquer cliente, e o failover não perde nada.",
      "Unidades de escala mantêm N cópias rodando: ReplicaSet no Kubernetes, Auto Scaling Group na AWS, deploy.replicas no Compose. Workers e filas desacoplam o trabalho pesado: o produtor publica na fila e responde 202 na hora; os workers consomem depois e escalam pelo tamanho da fila (é o que o KEDA automatiza).",
      "Padrões avançados: sidecar (contêiner auxiliar no mesmo Pod), ambassador (proxy para o exterior), sharding (dados particionados, Etapa 05). Resiliência: retry com backoff exponencial e fallback (plano B, como servir do cache). O circuit breaker para de chamar um serviço que falha repetidamente.",
    ],
    analogies: [
      {
        term: "Stateful",
        f1: "O set-up do carro guardado só na cabeça de um mecânico: se ele sai do box, a informação vai junto.",
      },
      {
        term: "Stateless com Redis",
        f1: "O set-up anotado no painel central da garagem, que qualquer mecânico de qualquer box consulta.",
      },
      {
        term: "Fila e worker",
        f1: "O box confirma a parada na hora; o pneu usado vai para a pilha que os engenheiros analisam depois, no ritmo deles.",
        limit:
          "Gente não sobe em segundos: a equipe é fixa no fim de semana, enquanto réplicas e workers nascem e morrem em minutos.",
      },
      {
        term: "Circuit breaker",
        f1: "Parar de pedir peça a um fornecedor que falhou várias vezes seguidas e usar o estoque reserva até ele se recuperar.",
      },
    ],
    tradeoffs: [
      {
        option: "Sticky sessions",
        gain: "Nada muda no código.",
        cost: "A réplica que cai leva as sessões junto, e a carga fica desigual.",
      },
      {
        option: "Estado no Redis ou no banco",
        gain: "Qualquer réplica atende qualquer cliente.",
        cost: "Mais um componente para operar, e ele também precisa escalar.",
      },
      {
        option: "Fila e workers",
        gain: "Resposta imediata e escala independente do trabalho pesado.",
        cost: "O processamento é eventual e precisa de confirmação (ack) para não perder mensagem.",
      },
      {
        option: "Retry com backoff",
        gain: "Absorve falhas passageiras sem o usuário perceber.",
        cost: "Sem limite e sem espera crescente, amplifica a sobrecarga que tentava contornar.",
      },
    ],
    examplesTitle: "Carrinho stateless e fila com workers",
    examples: [
      {
        label: "app.py (trecho)",
        lang: "sh",
        code: `MODO = os.getenv("MODO", "memoria")  # "memoria" = stateful, "redis" = stateless

# GET /carrinho: lê do Redis ou da memória deste processo
itens = r.lrange(f"carrinho:{user}", 0, -1) if r else memoria.get(user, [])

# POST /pedido: produtor publica na fila e responde já
r.lpush("fila:pedidos", pedido)
return self.responder_json(202, {"pedido": pedido, "status": "recebido"})`,
      },
      {
        label: "worker.py",
        lang: "sh",
        code: `while True:
    # BRPOP espera até 5 s por um item na fila
    item = r.brpop("fila:pedidos", timeout=5)
    if item is None:
        continue
    _, pedido = item
    print(f"[{HOST}] processando pedido {pedido}", flush=True)
    time.sleep(1)  # nota fiscal e e-mail: 1 s de trabalho pesado`,
        note: "A lista do Redis não tem confirmação: se o worker morrer no meio, a mensagem se perde. SQS e RabbitMQ guardam até o ack.",
      },
      {
        label: "docker-compose.yml",
        lang: "yaml",
        code: `name: lab-etapa-03
services:
  app:
    image: lab-app
    environment:
      MODO: \${MODO:-memoria}     # lê MODO do shell
      REDIS_HOST: redis
    deploy:
      replicas: 3
  redis:
    image: redis:7-alpine        # estado compartilhado e fila
  worker:
    image: lab-app
    command: ["python", "-u", "worker.py"]
    restart: on-failure
    deploy:
      replicas: 0                # ligado no experimento da fila`,
      },
    ],
    commands: [
      {
        cmd: 'for i in 1 2 3; do curl -s -X POST "localhost:8080/carrinho?user=ana&item=item$i"; done',
        note: "três itens, um por réplica",
      },
      {
        cmd: "docker compose exec redis redis-cli LRANGE carrinho:ana 0 -1",
        note: "o carrinho inteiro, fora das réplicas",
      },
      { cmd: "docker compose up -d --scale worker=3", note: "escala só os workers" },
      { cmd: "docker compose exec redis redis-cli LLEN fila:pedidos", note: "tamanho da fila" },
    ],
    labGoal: "Veja o carrinho sumir, leve-o para o Redis e mande o trabalho pesado para a fila.",
    labSteps: [
      "Com MODO=memoria, adicione 3 itens e leia o carrinho 3 vezes: cada resposta tem um item só.",
      "Com MODO=redis, repita: as três respostas trazem os três itens.",
      "Derrube uma réplica e confirme que o carrinho continua completo; suba de volta e recarregue o Nginx.",
      "Ligue 1 worker, enfileire 12 pedidos e veja as respostas 202 instantâneas.",
      "Meça o tempo para esvaziar a fila com 1 worker (cerca de 12 s) e com 3 (cerca de 4 s).",
    ],
    labNote:
      "workers = ceil(LLEN / pedidos por worker no prazo). É a conta que o KEDA faz por você.",
    rule: "Estado para fora (Redis, banco) e trabalho lento fora do caminho da resposta (fila e workers).",
    pitRule: "o set-up vai para o painel, e a análise do pneu sai do caminho do pit stop.",
    selfCheck: "Você consegue explicar por que o pedido responde 202, e não 200?",
  },
  {
    id: "es4",
    num: "04",
    navTitle: "Distância e cache",
    tag: "performance global",
    title: "CDNs e performance global",
    question: "Como servir rápido quem está longe da origem?",
    symptom:
      "A página carrega bem perto do datacenter e mal do outro lado do mundo; e a origem gasta CPU entregando o mesmo arquivo milhares de vezes.",
    pitScene:
      "Toda peça de reposição sai da fábrica. Num circuito do outro lado do mundo, cada pedido demora, e a fábrica despacha a mesma peça várias vezes seguidas.",
    answer:
      "A CDN é cache perto do usuário; quem manda nela é o Cache-Control da origem, e a métrica que importa é o Cache Hit Ratio.",
    concept: [
      "Latência depende da velocidade da luz e da distância. Uma CDN é uma rede de servidores proxy (PoPs ou edge locations) que guarda cópias do conteúdo perto do usuário. O DNS inteligente devolve o IP do PoP mais próximo; o PoP responde do cache (hit) ou busca na origem e guarda a cópia (miss).",
      "O Cache-Control da origem define o TTL (max-age). Vencido o prazo, a borda revalida com a origem: se nada mudou, a origem responde 304 Not Modified e a cópia ganha mais prazo sem transferir o arquivo. A invalidação (purge) remove à força, mas cada purge obriga um novo miss.",
      "CDNs também escalam APIs (GETs públicos que mudam pouco), fazem WAF e TLS offload na borda e são medidas pelo Cache Hit Ratio. Dados de usuário logado nunca vão para uma borda compartilhada: use private, no-store.",
    ],
    analogies: [
      {
        term: "Origem e PoP",
        f1: "A fábrica e o estoque de peças montado em cada circuito.",
        limit:
          "Peça física muda de lugar; arquivo em cache é cópia, e a origem continua com o original.",
      },
      {
        term: "ETag e 304",
        f1: "O número de revisão da peça: se a revisão no circuito é a mesma da fábrica, não é preciso mandar outra.",
      },
      {
        term: "Purge",
        f1: "O recall: toda peça daquela revisão sai da prateleira, e a próxima precisa vir da fábrica.",
      },
      {
        term: "X-Cache",
        f1: "A etiqueta que diz se a peça saiu da prateleira (HIT) ou veio da fábrica (MISS).",
      },
    ],
    tradeoffs: [
      {
        option: "TTL longo",
        gain: "Hit ratio alto e origem descansada.",
        cost: "Mudança demora a aparecer; funciona bem só com arquivos versionados.",
      },
      {
        option: "TTL curto",
        gain: "Mudança aparece rápido.",
        cost: "Mais revalidações chegam à origem.",
      },
      {
        option: "Purge",
        gain: "Remove a cópia velha na hora.",
        cost: "Cada purge gera uma onda de miss sobre a origem.",
      },
      {
        option: "Cache de API na borda",
        gain: "Absorve picos de leitura sem tocar na aplicação.",
        cost: "Só serve para GET público que muda pouco.",
      },
    ],
    examplesTitle: "Origem e borda com Nginx",
    examples: [
      {
        label: "origem/default.conf",
        lang: "sh",
        code: `server {
    listen 80;
    root /usr/share/nginx/html;
    location /estatico/ {
        # TTL de 10 s, curto de propósito para ver a expiração
        add_header Cache-Control "public, max-age=10";
    }
    location /api/ {
        default_type application/json;
        # sem Cache-Control: a borda não cacheia
        return 200 '{"produtos": ["camiseta", "caneca"]}';
    }
}`,
      },
      {
        label: "edge/default.conf",
        lang: "sh",
        code: `proxy_cache_path /var/cache/nginx/edge levels=1:2 keys_zone=edge:10m max_size=100m inactive=10m;

server {
    listen 80;
    location / {
        proxy_pass http://origem:80;
        proxy_cache edge;
        proxy_cache_revalidate on;   # ao expirar, pergunta à origem (If-None-Match)
        add_header X-Cache $upstream_cache_status always;
    }
}`,
        note: "X-Cache não é cabeçalho padrão HTTP: cada provedor tem o seu. Aqui nós mesmos o definimos.",
      },
      {
        label: "miss e hit",
        lang: "sh",
        code: `$ for i in 1 2 3; do curl -s -D - -o /dev/null http://localhost:8081/estatico/app.js | tr -d '\\r' | grep -i '^x-cache'; done
X-Cache: MISS
X-Cache: HIT
X-Cache: HIT`,
      },
    ],
    commands: [
      {
        cmd: "curl -sI http://localhost:8082/estatico/app.js",
        note: "ETag e Cache-Control da origem",
      },
      {
        cmd: 'curl -sI -H "If-None-Match: $ETAG" http://localhost:8082/estatico/app.js',
        note: "304 Not Modified",
      },
      {
        cmd: "docker compose exec edge sh -c 'rm -rf /var/cache/nginx/edge/*'",
        note: "purge simulado (depois, restart do edge)",
      },
    ],
    labGoal: "Leia os cabeçalhos: cada resposta conta de onde a peça veio.",
    labSteps: [
      "Inspecione Cache-Control e ETag direto na origem (porta 8082).",
      "Provoque um 304 mandando If-None-Match com o ETag.",
      "Peça 3 vezes pela borda (porta 8081): MISS, HIT, HIT.",
      "Faça 20 requisições: 20 HIT dentro do TTL, ou 1 REVALIDATED e 19 HIT depois dele.",
      "Mude o arquivo, espere o TTL e veja EXPIRED com o conteúdo novo; depois simule um purge.",
    ],
    rule: "Bundle JavaScript versionado pode ter TTL de meses; saldo bancário nunca vai para a borda.",
    pitRule:
      "peça de série fica no estoque do circuito; peça feita sob medida para um piloto não vai para a prateleira comum.",
    selfCheck:
      "Lendo só o Cache-Control, você consegue prever se a próxima requisição vai dar HIT, MISS ou REVALIDATED?",
  },
  {
    id: "es5",
    num: "05",
    navTitle: "O banco de dados",
    tag: "réplicas, sharding, CAP",
    title: "Escalabilidade de banco de dados",
    question: "Como escalar a peça que não aceita cópias soltas?",
    symptom:
      "A aplicação já escala horizontalmente, mas todas as réplicas batem no mesmo banco, que vira o gargalo e o ponto único de falha.",
    pitScene:
      "Os boxes se multiplicaram, mas todos consultam e alteram o mesmo arquivo oficial de engenharia, e a fila para mexer nele vira o novo gargalo.",
    answer:
      "Leitura se escala com cache e réplicas; escrita só se escala particionando, e todo o resto é escolher, conscientemente, entre consistência e disponibilidade.",
    concept: [
      "O banco é stateful e precisa de consistência, concorrência segura e baixa latência. Para leitura (muitas vezes 100 leituras para 1 escrita): cache-aside com Redis (tenta o cache, no miss busca no banco e grava no cache) e read replicas (primary recebe as escritas e replica, em geral de forma assíncrona; a aplicação faz write splitting).",
      "Para escrita, sharding: por range (simples, mas cria hotspots) ou por hash (distribui melhor, mas dificulta consultas por faixa). Re-sharding é caro: de 2 para 3 shards por módulo, cerca de dois terços dos IDs mudam de lugar. DynamoDB, Cassandra e CockroachDB fazem isso de forma transparente.",
      "Teorema CAP: durante uma partição de rede, escolha entre consistência e disponibilidade (CP ou AP). AP leva à consistência eventual: por um tempo, nós diferentes respondem valores diferentes e depois convergem. Failover promove uma réplica; RPO é quanto dado se pode perder, RTO é quanto tempo se pode ficar fora.",
    ],
    analogies: [
      {
        term: "Primary e read replica",
        f1: "O arquivo oficial de engenharia na fábrica e a cópia somente leitura consultada no circuito.",
      },
      {
        term: "Cache-aside",
        f1: "O painel da garagem: consulta-se ali primeiro; se a informação não está, busca-se no arquivo e anota-se no painel.",
      },
      {
        term: "Partição de rede (CAP)",
        f1: "O rádio cai: ou o carro espera a comunicação voltar para agir (consistência), ou segue com a última instrução que recebeu (disponibilidade).",
        limit:
          "O piloto decide na hora; no banco, a escolha entre CP e AP é de projeto, feita antes da partição.",
      },
      {
        term: "Failover",
        f1: "O engenheiro reserva, que ouvia tudo pelo fone, assume o rádio quando o titular sai.",
      },
    ],
    tradeoffs: [
      {
        option: "Cache-aside",
        gain: "Tira a maior parte das leituras do banco.",
        cost: "O dado pode ficar velho até o TTL vencer ou alguém invalidar.",
      },
      {
        option: "Read replicas",
        gain: "Escala leitura sem mexer no modelo de dados.",
        cost: "Atraso de replicação: ler logo depois de escrever pode não mostrar o dado novo.",
      },
      {
        option: "Sharding por range",
        gain: "Consulta por faixa continua simples.",
        cost: "Cria hotspots quando a carga se concentra numa faixa.",
      },
      {
        option: "Sharding por hash",
        gain: "Distribui a escrita de forma uniforme.",
        cost: "Consulta por faixa precisa visitar todos os shards, e re-sharding move muitos dados.",
      },
    ],
    examplesTitle: "Postgres primary, réplica e Redis",
    examples: [
      {
        label: "replica.sh",
        lang: "sh",
        code: `#!/bin/bash
set -e
# Só faz a cópia inicial se o diretório de dados ainda está vazio
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  chmod 700 "$PGDATA"
  # -R grava a configuração de standby; -X stream copia o WAL em tempo real
  pg_basebackup -h primary -U replicador -D "$PGDATA" -R -X stream
fi
# Por causa do -R, sobe como réplica somente leitura
exec postgres`,
      },
      {
        label: "docker-compose.yml",
        lang: "yaml",
        code: `name: lab-etapa-05
services:
  primary:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: senha123
    volumes:
      - ./init-primary.sh:/docker-entrypoint-initdb.d/init-primary.sh:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -h 127.0.0.1"]
      interval: 2s
      retries: 30
  replica:
    image: postgres:16
    user: postgres
    environment:
      PGPASSWORD: replica123      # senha do usuário replicador
    volumes:
      - ./replica.sh:/replica.sh:ro
    entrypoint: ["bash", "/replica.sh"]
    depends_on:
      primary:
        condition: service_healthy
  redis:
    image: redis:7-alpine`,
        note: "O init-primary.sh cria o papel replicador e libera a replicação no pg_hba.conf.",
      },
      {
        label: "consistência eventual",
        lang: "sh",
        code: `$ docker compose exec replica psql -U postgres -c "SELECT pg_wal_replay_pause();"
$ docker compose exec primary psql -U postgres -c "INSERT INTO produtos VALUES (3,'Boné');"
# primary: 3   réplica: 2
$ docker compose exec replica psql -U postgres -c "SELECT pg_wal_replay_resume();"
# réplica: 3 (convergiu)`,
      },
    ],
    commands: [
      {
        cmd: 'docker compose exec replica psql -U postgres -c "SELECT pg_is_in_recovery();"',
        note: "t na réplica, f no primary",
      },
      {
        cmd: 'docker compose exec primary psql -U postgres -c "SELECT client_addr, state, sync_state FROM pg_stat_replication;"',
        note: "streaming e async",
      },
      { cmd: "bash cache-aside.sh 1", note: "MISS na primeira, HIT nas seguintes" },
      {
        cmd: 'docker compose exec replica psql -U postgres -c "SELECT pg_promote();"',
        note: "failover manual",
      },
    ],
    labGoal: "Veja a escrita chegar à réplica com atraso e aplique cache-aside na mão.",
    labSteps: [
      "Confirme quem é primary (f) e quem é réplica (t), e que a replicação está em streaming async.",
      "Escreva no primary, leia na réplica e confirme que a réplica recusa INSERT.",
      "Pause a réplica, escreva no primary e veja 3 contra 2; retome e veja convergir.",
      "Rode o cache-aside: MISS Camiseta, depois HIT Camiseta; o TTL da chave é 30 s.",
      "Altere o dado e veja o cache servir o valor velho até você invalidar com DEL.",
    ],
    rule: "Quem escreve precisa invalidar o cache, ou aceitar o TTL como janela de defasagem.",
    pitRule:
      "só a fábrica altera o arquivo oficial; o circuito lê a cópia sabendo que ela pode estar uma revisão atrás.",
    selfCheck:
      "Durante uma partição, o seu sistema prefere responder um valor velho ou não responder? Você sabe justificar a escolha?",
  },
  {
    id: "es6",
    num: "06",
    navTitle: "Juntar e enxergar",
    tag: "mundo real + observabilidade",
    title: "Arquiteturas escaláveis no mundo real",
    question: "Como as peças se juntam, e como você enxerga o que acontece lá dentro?",
    symptom:
      "Cada peça funciona sozinha, mas quando algo fica lento em produção ninguém consegue dizer em qual camada o tempo está sendo gasto.",
    pitScene:
      "O carro está lento, mas sem telemetria, rádio e tempos de minissetor ninguém sabe dizer se o problema está no motor, nos pneus ou na aerodinâmica.",
    answer:
      "Arquitetura escalável é a combinação certa de peças simples, e só se mantém assim se você enxergar o sistema por métricas, logs e traces.",
    concept: [
      "Serverless (AWS Lambda) é a máxima abstração: o provedor escala e volta a zero, inclusive no custo. Um monolito stateless em ASG escala bem e é simples de testar e depurar; microsserviços dão escala granular e times independentes, ao preço de complexidade operacional, latência de rede e depuração distribuída. A Lei de Conway diz que a arquitetura reflete a organização.",
      "Observabilidade tem três pilares: métricas dizem o que está acontecendo e disparam alertas; logs dizem por que; traces dizem onde o tempo foi gasto ao longo dos serviços. SRE trata operação como software, com SLOs e error budgets: um SLO de 99,9% em 30 dias deixa 43,2 minutos de orçamento.",
      "O caso do e-commerce que caiu na Black Friday se resolve peça por peça: CDN na frente dos assets (Etapa 04), load balancer eliminando o SPOF (Etapa 02), aplicação stateless em ASG com fila para o trabalho lento (Etapas 01 e 03) e banco gerenciado com read replicas (Etapa 05).",
    ],
    analogies: [
      {
        term: "Métricas",
        f1: "A telemetria ao vivo: velocidade, temperaturas e pressões em tempo real.",
      },
      { term: "Logs", f1: "O rádio: o registro do que foi dito e em que momento." },
      { term: "Traces", f1: "Os tempos de minissetor: onde, exatamente, a volta perdeu tempo." },
      {
        term: "X-Request-ID",
        f1: "O transponder: o mesmo número lido em cada laço de cronometragem, costurando a passagem do carro pelo circuito.",
      },
    ],
    tradeoffs: [
      {
        option: "Serverless",
        gain: "Escala sozinho e volta a zero, inclusive no custo.",
        cost: "Cold start, limites de execução e dependência do provedor.",
      },
      {
        option: "Monolito stateless",
        gain: "Simples de testar, depurar e implantar.",
        cost: "Tudo escala junto e sai no mesmo deploy.",
      },
      {
        option: "Microsserviços",
        gain: "Escala granular e times independentes.",
        cost: "Latência de rede, depuração distribuída e mais operação.",
      },
      {
        option: "SLO e error budget",
        gain: "Decide com dado quando acelerar entregas ou frear.",
        cost: "Só funciona com métricas confiáveis e combinadas com o negócio.",
      },
    ],
    examplesTitle: "Borda, LB, réplicas, Redis e worker",
    examples: [
      {
        label: "docker-compose.yml",
        lang: "yaml",
        code: `name: lab-etapa-06
services:
  edge:                     # a "CDN"
    image: nginx:1.27-alpine
    ports:
      - "8080:80"           # única porta exposta ao mundo
    volumes:
      - ./edge:/etc/nginx/conf.d:ro
  lb:                       # o "ALB"
    image: nginx:1.27-alpine
    volumes:
      - ./lb:/etc/nginx/conf.d:ro
      - ./site:/usr/share/nginx/html:ro
  app:                      # monolito stateless em 3 réplicas (o "ASG")
    image: lab-app
    environment:
      MODO: redis
      REDIS_HOST: redis
    deploy:
      replicas: 3
  worker:
    image: lab-app
    command: ["python", "-u", "worker.py"]
    restart: on-failure
  redis:
    image: redis:7-alpine`,
      },
      {
        label: "lb/default.conf",
        lang: "sh",
        code: `upstream backend {
    zone backend 64k;
    server app:8080 max_fails=1 fail_timeout=10s;
}
# Log com o ID da requisição: o nosso trace caseiro
log_format rastreio '$remote_addr "$request" $status rid=$request_id upstream=$upstream_addr';

server {
    listen 80;
    access_log /dev/stdout rastreio;
    location /estatico/ {
        root /usr/share/nginx/html;
        add_header Cache-Control "public, max-age=30";
    }
    location / {
        proxy_pass http://backend;
        proxy_set_header X-Request-ID $request_id;
        proxy_connect_timeout 1s;
        proxy_next_upstream error timeout;
    }
}`,
      },
      {
        label: "verificar.sh",
        lang: "sh",
        code: `$ bash verificar.sh
OK     asset servido pela borda (HIT)
OK     requisições distribuídas em 3 réplicas
OK     carrinho visível em qualquer réplica
OK     pedido aceito de forma assíncrona (202)`,
        note: "Cada linha confere uma propriedade de uma etapa do guia.",
      },
    ],
    commands: [
      { cmd: "docker compose up -d --build && bash verificar.sh", note: "sobe e verifica" },
      { cmd: "docker stats --no-stream", note: "métricas: CPU e memória por container" },
      {
        cmd: 'docker compose logs --no-color lb app | grep "$RID"',
        note: "trace: o mesmo rid no lb e na réplica",
      },
    ],
    labGoal: "Suba a stack completa e siga uma requisição de ponta a ponta pelo X-Request-ID.",
    labSteps: [
      "Suba a stack e rode verificar.sh até ver quatro linhas OK.",
      "Derrube uma réplica e confirme 20 respostas 200; suba de volta e recarregue o lb.",
      "Compare a carga contra a arquitetura (cerca de 1,7 s) e contra um monolito de uma instância (cerca de 5 s).",
      "Pare o monolito e veja o 000 do ponto único de falha.",
      "Pegue um rid nos logs do lb e encontre a mesma requisição nos logs do app.",
    ],
    rule: "Comece com um monolito stateless; divida em serviços quando times e gargalos justificarem.",
    pitRule: "ninguém mexe no acerto sem olhar a telemetria primeiro.",
    selfCheck:
      "Dado um rid no log do load balancer, você consegue achar em segundos qual réplica atendeu a requisição?",
  },
];
