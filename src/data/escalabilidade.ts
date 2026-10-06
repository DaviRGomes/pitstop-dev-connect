// Conteúdo das seis aulas da disciplina "Escalabilidade nos servidores" (Fase 2), uma etapa por aula,
// tematizado com Fórmula 1 pelo pipeline /otimizar-relatorio (relatorios/escalabilidade/final.md).

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
  narration: string;
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
  outro: string;
};

export type Mapping = { tema: string; f1: string };

export const DE_PARA: Mapping[] = [
  { tema: "Requisição", f1: "Um carro entrando no pit lane para ser atendido" },
  { tema: "Servidor, instância ou réplica", f1: "Um box com a sua crew completa de pit stop" },
  {
    tema: "Ponto único de falha (SPOF)",
    f1: "A unidade de potência: não tem reserva, falhou, acabou a corrida",
  },
  {
    tema: "Load balancer",
    f1: "O controle de entrada do pit lane, que direciona cada carro a um box livre",
  },
  {
    tema: "Stateful e stateless",
    f1: "O set-up na cabeça de um mecânico e o set-up anotado no painel central",
  },
  {
    tema: "Redis (estado, fila e cache)",
    f1: "O painel de dados ao vivo da garagem, compartilhado por todos os boxes",
  },
  {
    tema: "Fila e worker",
    f1: "A pilha de pneus usados esperando análise e o engenheiro da fábrica que a processa",
  },
  { tema: "CDN (origem e borda)", f1: "A fábrica e o estoque de peças montado em cada circuito" },
  {
    tema: "Banco primary e read replica",
    f1: "O arquivo oficial na fábrica e a cópia somente leitura no circuito",
  },
  { tema: "X-Request-ID", f1: "O transponder: o mesmo número em cada laço de cronometragem" },
];

export const ANALOGY_NOTES: string[] = [
  "Um box por equipe: na F1 real cada carro sempre para no box da própria equipe. Servidor não tem regulamento, e qualquer réplica pode atender qualquer requisição.",
  "Um box de F1 atende um carro por vez. A capacidade 2 do laboratório é um box imaginário com duas posições de serviço.",
  "Gente não sobe em segundos: a equipe é fixa no fim de semana, enquanto réplicas e workers nascem e morrem em minutos.",
  "Com dois carros, o menor canary possível na F1 é metade da frota; no load balancer você escolhe 1%, 5% ou 10%.",
  "Peça física muda de lugar; arquivo em cache é cópia, e a origem continua com o original.",
  "O piloto decide na hora se segue ou recolhe quando o rádio cai; no banco, a escolha entre CP e AP é de projeto, feita antes da partição.",
];

export const LESSONS: Lesson[] = [
  {
    id: "es1",
    num: "01",
    navTitle: "Fundamentos",
    tag: "desempenho x escala",
    title: "Fundamentos de escalabilidade moderna",
    narration:
      "Apagaram-se as luzes! A primeira curva já cobra uma decisão que muita equipe erra: o seu problema é velocidade ou é volume? Quem confunde as duas coisas gasta orçamento no lugar errado.",
    lead: "Escalar aumenta quanto o sistema aguenta; otimizar faz cada tarefa custar menos. Antes de comprar servidor, descubra qual dos dois problemas você tem.",
    concept: [
      "Desempenho é a latência de uma única tarefa. Otimização melhora esse desempenho sem adicionar recursos. Escalabilidade é aumentar o throughput proporcionalmente aos recursos adicionados: quando a fila fica gigantesca, não adianta o caixa mais rápido do mundo, é preciso abrir mais caixas.",
      "Escala vertical (scaling up) é um servidor maior: simples, mas tem teto físico e financeiro, costuma exigir downtime e cria um ponto único de falha. Escala horizontal (scaling out) é mais servidores dividindo a carga: teto muito maior e mais resiliência, desde que a aplicação seja stateless e exista um load balancer.",
      "Elasticidade é crescer e encolher conforme a carga; autoscaling é o mecanismo que a implementa. Por métrica (CPU acima de 70% por 5 minutos), agendado (subir às 8h55, descer às 18h05) ou preditivo (Machine Learning sobre o histórico). Performance, custo e complexidade formam um triângulo: não dá para maximizar os três.",
      "Na pista: crew treinada baixa o tempo de cada pit stop (otimização); mais boxes aumentam quantos carros voltam à pista (escala). A unidade de potência é o ponto único de falha clássico: em Sepang, em 4 de outubro de 2026, o George Russell parou na reta nas voltas finais e a corrida acabou ali.",
    ],
    pointsTitle: "O painel desta etapa",
    points: [
      {
        t: "Escalar não muda a latência",
        d: "Mais réplicas aumentam o throughput, não aceleram uma requisição isolada.",
        color: "blue",
      },
      {
        t: "Vertical tem teto e SPOF",
        d: "Um box maior continua sendo um box só: caiu, caiu tudo.",
        color: "ember",
      },
      {
        t: "Quando NÃO escalar",
        d: "Query ruim se otimiza; sistema interno de 50 pessoas não precisa de autoscaling.",
        color: "signal",
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
    handsOnIntro: "Meça a diferença entre otimizar, escalar para cima e escalar para fora.",
    handsOn: [
      "Rode a linha de base e anote a latência de uma requisição e o tempo para 100.",
      "Repita com TRABALHO_MS=50 (otimização) e com CAPACIDADE=4 (vertical).",
      "Suba h1, h2 e h3 nas portas 8084 a 8086 e distribua a carga pelo módulo 3 do número da requisição.",
      "Compare: escalar não mexeu na latência isolada, otimizar mexeu nos dois.",
      "Derrube base e h1: veja 000 no servidor único e 000 200 200 na frota.",
    ],
    tip: "Antes de escalar, meça. Um índice no banco pode valer mais que dez servidores.",
    takeaway:
      "Escalar aumenta quanto o sistema aguenta (throughput), otimizar faz cada tarefa custar menos.",
    outro:
      "Setor 1 no verde. Falta alguém na entrada do pit lane para perceber o box fechado e redirecionar: é a Etapa 02.",
  },
  {
    id: "es2",
    num: "02",
    navTitle: "Load balancers",
    tag: "L4, L7 e deploy",
    title: "Load balancers na prática",
    narration:
      "Segundo setor, e o ritmo muda. Entra em cena o controle de entrada do pit lane: algoritmos, failover, canary e rollback na mesma reta. Olho na pista.",
    lead: "O load balancer é o único ponto de entrada que distribui a carga, tira instâncias doentes de rotação e permite trocar versões sem derrubar ninguém.",
    concept: [
      "Um load balancer é um proxy entre clientes e servidores: o cliente fala com um endereço só. O L4 (TCP/UDP) decide por IP e porta, é extremamente rápido e não enxerga o conteúdo (AWS NLB). O L7 (HTTP) lê caminho, cabeçalhos e cookies e roteia /api/pagamentos para um grupo e /blog para outro (AWS ALB).",
      "Algoritmos: round-robin (fila circular, ignora carga), weighted round-robin (pesos para máquinas maiores), least connections (quem tem menos conexões ativas) e IP hash (o mesmo IP sempre no mesmo servidor, com risco de desequilíbrio atrás de um proxy corporativo).",
      "Health checks testam cada servidor; falhou, ocorre o failover e o tráfego novo vai para os saudáveis. Connection draining deixa as conexões em andamento terminarem. Blue/Green vira 100% de uma vez com rollback instantâneo; canary manda 1% a 10% para a versão nova e aumenta aos poucos.",
      "Na pista, o L4 é o laço de cronometragem que lê o transponder; o L7 é o engenheiro que ouve o rádio e entende o pedido. O IP hash é o pit lane real: cada carro sempre no box da própria equipe. Canary é o pacote de upgrade montado primeiro em um carro só.",
    ],
    pointsTitle: "Peças do balanceamento",
    points: [
      {
        t: "L4 x L7",
        d: "Velocidade bruta por IP e porta ou roteamento inteligente pelo conteúdo HTTP.",
        color: "blue",
      },
      {
        t: "Failover",
        d: "Instância doente sai de rotação sem o cliente perceber.",
        color: "signal",
      },
      {
        t: "Canary e Blue/Green",
        d: "Versão nova para poucos, ou virada total com volta em segundos.",
        color: "ember",
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
    handsOnIntro: "Pit lane aberto: algoritmos, um box derrubado de propósito e um canary.",
    handsOn: [
      "Faça 30 requisições e confirme 10 para cada réplica (round-robin).",
      "Derrube uma réplica e confirme 20 respostas 200; depois suba de volta e recarregue o Nginx.",
      "Troque para least_conn e depois ip_hash; com ip_hash todas caem no mesmo servidor.",
      "Configure o canary de 10% e conte cerca de 180 v1 e 20 v2.",
      "Vire para 100% verde (blue/green) e faça o rollback para azul.",
    ],
    tip: "No macOS, use gsed (brew install gnu-sed) no lugar de sed -i, ou edite o arquivo à mão.",
    takeaway:
      "O load balancer distribui a carga, tira instâncias doentes de rotação e troca versões sem derrubar ninguém.",
    outro:
      "Setor 2 no verde. Mas e se o set-up do carro estiver só na cabeça de um mecânico? Etapa 03 na sequência.",
  },
  {
    id: "es3",
    num: "03",
    navTitle: "Stateless e filas",
    tag: "padrões de escala",
    title: "Padrões de escala horizontal em arquiteturas cloud",
    narration:
      "Sequência de curvas técnicas! O problema não está mais na entrada do pit lane: está dentro da aplicação, com estado guardado no lugar errado e trabalho lento no caminho da resposta.",
    lead: "Se o estado mora no servidor, o servidor não pode morrer nem ser trocado. Tire o estado para fora e tire o trabalho lento do caminho da resposta.",
    concept: [
      "Stateful guarda a sessão na memória do servidor: o LB manda o cliente para outra réplica e o carrinho some. Sticky sessions remendam, mas limitam a resiliência. Stateless externaliza o estado (Redis, banco): qualquer réplica atende qualquer cliente, e o failover não perde nada.",
      "Unidades de escala mantêm N cópias rodando: ReplicaSet no Kubernetes, Auto Scaling Group na AWS, deploy.replicas no Compose. Workers e filas desacoplam o trabalho pesado: o produtor publica na fila e responde 202 na hora; os workers consomem depois e escalam pelo tamanho da fila (é o que o KEDA automatiza).",
      "Padrões avançados: sidecar (contêiner auxiliar no mesmo Pod), ambassador (proxy para o exterior), sharding (dados particionados, Etapa 05). Resiliência: retry com backoff exponencial e fallback (plano B, como servir do cache). O circuit breaker para de chamar um serviço que falha repetidamente.",
      "Na pista: o mecânico com o set-up na cabeça é stateful; o set-up no painel central da garagem é stateless. O box responde 'box confirmado' e o pneu usado vai para a pilha que os engenheiros da fábrica analisam depois.",
    ],
    pointsTitle: "Os padrões",
    points: [
      {
        t: "Stateless",
        d: "Estado no Redis ou no banco: qualquer réplica continua o trabalho.",
        color: "blue",
      },
      {
        t: "Fila e workers",
        d: "Resposta imediata (202) e trabalho pesado assíncrono, escalado pela fila.",
        color: "signal",
      },
      {
        t: "Retry e fallback",
        d: "Tente de novo esperando cada vez mais; tenha um plano B pronto.",
        color: "ember",
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
    handsOnIntro:
      "Veja o carrinho sumir, leve-o para o Redis e mande o trabalho pesado para a fila.",
    handsOn: [
      "Com MODO=memoria, adicione 3 itens e leia o carrinho 3 vezes: cada resposta tem um item só.",
      "Com MODO=redis, repita: as três respostas trazem os três itens.",
      "Derrube uma réplica e confirme que o carrinho continua completo; suba de volta e recarregue o Nginx.",
      "Ligue 1 worker, enfileire 12 pedidos e veja as respostas 202 instantâneas.",
      "Meça o tempo para esvaziar a fila com 1 worker (cerca de 12 s) e com 3 (cerca de 4 s).",
    ],
    tip: "workers = ceil(LLEN / pedidos por worker no prazo). É a conta que o KEDA faz por você.",
    takeaway:
      "Estado para fora (Redis, banco) e trabalho lento fora do caminho da resposta (fila e workers).",
    outro:
      "Setor 3 no verde. Agora o calendário fica internacional: como entregar peça rápido tão longe da fábrica? Etapa 04.",
  },
  {
    id: "es4",
    num: "04",
    navTitle: "CDN e cache",
    tag: "performance global",
    title: "CDNs e performance global",
    narration:
      "Perna internacional do campeonato! Nenhum motor vence a física: nesta etapa a gente para de lutar contra a distância e passa a contorná-la, com estoque pré-posicionado no circuito.",
    lead: "A CDN é cache perto do usuário; quem manda nela é o Cache-Control da origem, e a métrica que importa é o Cache Hit Ratio.",
    concept: [
      "Latência depende da velocidade da luz e da distância. Uma CDN é uma rede de servidores proxy (PoPs ou edge locations) que guarda cópias do conteúdo perto do usuário. O DNS inteligente devolve o IP do PoP mais próximo; o PoP responde do cache (hit) ou busca na origem e guarda a cópia (miss).",
      "O Cache-Control da origem define o TTL (max-age). Vencido o prazo, a borda revalida com a origem: se nada mudou, a origem responde 304 Not Modified e a cópia ganha mais prazo sem transferir o arquivo. A invalidação (purge) remove à força, mas cada purge obriga um novo miss.",
      "CDNs também escalam APIs (GETs públicos que mudam pouco), fazem WAF e TLS offload na borda e são medidas pelo Cache Hit Ratio. Dados de usuário logado nunca vão para uma borda compartilhada: use private, no-store.",
      "Na pista: a origem é a fábrica, o PoP é o estoque de peças montado no circuito, o ETag é o número de revisão da peça e o purge é o recall. O X-Cache é a etiqueta que diz se a peça saiu da prateleira (HIT) ou veio da fábrica (MISS).",
    ],
    pointsTitle: "O que ler nos cabeçalhos",
    points: [
      {
        t: "Cache-Control",
        d: "A origem decide se e por quanto tempo a resposta pode ser guardada.",
        color: "blue",
      },
      {
        t: "ETag e 304",
        d: "Revalidação barata: a cópia ainda vale, nada é reenviado.",
        color: "signal",
      },
      {
        t: "HIT, MISS, REVALIDATED",
        d: "O veredito da borda; o hit ratio é hits sobre o total.",
        color: "ember",
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
    handsOnIntro:
      "Leia cabeçalhos como engenheiro lê telemetria: cada resposta conta de onde veio a peça.",
    handsOn: [
      "Inspecione Cache-Control e ETag direto na origem (porta 8082).",
      "Provoque um 304 mandando If-None-Match com o ETag.",
      "Peça 3 vezes pela borda (porta 8081): MISS, HIT, HIT.",
      "Faça 20 requisições: 20 HIT dentro do TTL, ou 1 REVALIDATED e 19 HIT depois dele.",
      "Mude o arquivo, espere o TTL e veja EXPIRED com o conteúdo novo; depois simule um purge.",
    ],
    tip: "Bundle JavaScript versionado pode ter TTL de meses; saldo bancário nunca vai para a borda.",
    takeaway:
      "A CDN é cache perto do usuário, governado pelo Cache-Control da origem e medido pelo Cache Hit Ratio.",
    outro:
      "Setor 4 no verde. Agora vem a chicane mais temida do traçado: o banco de dados. Etapa 05, segura firme.",
  },
  {
    id: "es5",
    num: "05",
    navTitle: "Banco de dados",
    tag: "réplicas, sharding, CAP",
    title: "Escalabilidade de banco de dados",
    narration:
      "Chegamos à chicane! Aqui não basta ligar mais três, porque o arquivo oficial de engenharia só aceita revisão num lugar. É a etapa mais densa do GP, e é nela que campeonato se decide.",
    lead: "Leitura se escala com cache e réplicas; escrita só se escala particionando, e todo o resto é escolher, conscientemente, entre consistência e disponibilidade.",
    concept: [
      "O banco é stateful e precisa de consistência, concorrência segura e baixa latência. Para leitura (muitas vezes 100 leituras para 1 escrita): cache-aside com Redis (tenta o cache, no miss busca no banco e grava no cache) e read replicas (primary recebe as escritas e replica, em geral de forma assíncrona; a aplicação faz write splitting).",
      "Para escrita, sharding: por range (simples, mas cria hotspots) ou por hash (distribui melhor, mas dificulta consultas por faixa). Re-sharding é caro: de 2 para 3 shards por módulo, cerca de dois terços dos IDs mudam de lugar. DynamoDB, Cassandra e CockroachDB fazem isso de forma transparente.",
      "Teorema CAP: durante uma partição de rede, escolha entre consistência e disponibilidade (CP ou AP). AP leva à consistência eventual: por um tempo, nós diferentes respondem valores diferentes e depois convergem. Failover promove uma réplica; RPO é quanto dado se pode perder, RTO é quanto tempo se pode ficar fora.",
      "Na pista: o primary é o arquivo oficial na fábrica, a réplica é a cópia consultada no circuito, o cache-aside é o painel da garagem. Partição é o rádio cair; failover é o reserva que ouvia tudo pelo fone assumir o rádio.",
    ],
    pointsTitle: "As alavancas do banco",
    points: [
      {
        t: "Cache e réplicas",
        d: "Escalam leitura; a escrita continua num lugar só.",
        color: "blue",
      },
      {
        t: "Sharding",
        d: "Escala escrita, ao custo de complexidade e re-sharding doloroso.",
        color: "ember",
      },
      {
        t: "CAP, RPO, RTO",
        d: "O negócio define quanto pode perder e quanto tempo pode ficar fora.",
        color: "signal",
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
    handsOnIntro:
      "Veja a revisão chegar à cópia do circuito com atraso e aplique cache-aside na mão.",
    handsOn: [
      "Confirme quem é primary (f) e quem é réplica (t), e que a replicação está em streaming async.",
      "Escreva no primary, leia na réplica e confirme que a réplica recusa INSERT.",
      "Pause a réplica, escreva no primary e veja 3 contra 2; retome e veja convergir.",
      "Rode o cache-aside: MISS Camiseta, depois HIT Camiseta; o TTL da chave é 30 s.",
      "Altere o dado e veja o cache servir o valor velho até você invalidar com DEL.",
    ],
    tip: "Quem escreve precisa invalidar o cache, ou aceitar o TTL como janela de defasagem.",
    takeaway:
      "Leitura se escala com cache e réplicas; escrita, com sharding; e CAP é uma escolha consciente, feita antes da partição.",
    outro:
      "Setor 5 no verde. Falta a última volta: juntar todas as peças e ligar a telemetria. Etapa 06.",
  },
  {
    id: "es6",
    num: "06",
    navTitle: "Arquitetura completa",
    tag: "mundo real + observabilidade",
    title: "Arquiteturas escaláveis no mundo real",
    narration:
      "Última etapa! Agora não é peça solta: é a operação integrada de um fim de semana de GP inteiro. E arquitetura sem telemetria é pilotar de olhos fechados.",
    lead: "Arquitetura escalável é a combinação certa de peças simples, e só se mantém assim se você enxergar o sistema por métricas, logs e traces.",
    concept: [
      "Serverless (AWS Lambda) é a máxima abstração: o provedor escala e volta a zero, inclusive no custo. Um monolito stateless em ASG escala bem e é simples de testar e depurar; microsserviços dão escala granular e times independentes, ao preço de complexidade operacional, latência de rede e depuração distribuída. A Lei de Conway diz que a arquitetura reflete a organização.",
      "Observabilidade tem três pilares: métricas dizem o que está acontecendo e disparam alertas; logs dizem por que; traces dizem onde o tempo foi gasto ao longo dos serviços. SRE trata operação como software, com SLOs e error budgets: um SLO de 99,9% em 30 dias deixa 43,2 minutos de orçamento.",
      "O caso do e-commerce que caiu na Black Friday se resolve peça por peça: CDN na frente dos assets (Etapa 04), load balancer eliminando o SPOF (Etapa 02), aplicação stateless em ASG com fila para o trabalho lento (Etapas 01 e 03) e banco gerenciado com read replicas (Etapa 05).",
      "Na pista: métricas são a telemetria ao vivo, logs são o rádio, traces são os tempos de minissetor e o X-Request-ID é o transponder que costura cada passagem.",
    ],
    pointsTitle: "Os três pilares",
    points: [
      { t: "Métricas", d: "O que está acontecendo: CPU, latência, taxa de erros.", color: "blue" },
      { t: "Logs", d: "Por que aconteceu: eventos discretos com timestamp.", color: "signal" },
      { t: "Traces", d: "Onde o tempo foi gasto: a jornada de uma requisição.", color: "ember" },
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
    handsOnIntro:
      "Volta de classificação: a stack completa sobe e o transponder costura cada passagem.",
    handsOn: [
      "Suba a stack e rode verificar.sh até ver quatro linhas OK.",
      "Derrube uma réplica e confirme 20 respostas 200; suba de volta e recarregue o lb.",
      "Compare a carga contra a arquitetura (cerca de 1,7 s) e contra um monolito de uma instância (cerca de 5 s).",
      "Pare o monolito e veja o 000 do ponto único de falha.",
      "Pegue um rid nos logs do lb e encontre a mesma requisição nos logs do app.",
    ],
    tip: "Comece com um monolito stateless; divida em serviços quando times e gargalos justificarem.",
    takeaway:
      "Borda, balanceador, aplicação stateless, fila e banco com réplicas, enxergados por métricas, logs e traces.",
    outro:
      "Bandeira quadriculada! Você largou sem saber se o problema era velocidade ou volume e cruzou a linha com a arquitetura completa e a telemetria ligada.",
  },
];
