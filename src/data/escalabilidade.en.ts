// Content from the six lessons of the "Server Scalability" course (Phase 2), one stage per lesson.
// This guide has its own format: each stage starts from a question and a symptom, explains the concept,
// offers conceptual F1 analogies (no real races), a trade-off table, and a local lab.

export type Example = {
  label: string;
  lang: "yaml" | "sh";
  code: string;
  note?: string;
};

export type Command = { cmd: string; note?: string };

/** Technical term, its F1 analogy and, when there is one, where the analogy stops holding. */
export type Analogy = { term: string; f1: string; limit?: string };

/** One row of the "gain vs cost" table. */
export type Tradeoff = { option: string; gain: string; cost: string };

export type Lesson = {
  id: string;
  num: string;
  navTitle: string;
  tag: string;
  title: string;
  question: string;
  symptom: string;
  /** The same situation as the symptom, told as a pit box scene. */
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
  /** The rule of thumb, said in track language. */
  pitRule: string;
  selfCheck: string;
};

/** Pieces of the architecture map at the top of the guide, in the order a request goes through them. */
export type MapNode = {
  id: string;
  label: string;
  detail: string;
  /** The piece's equivalent in an F1 pit box. */
  f1: string;
  stages: string[];
};

export const SYSTEM_MAP: MapNode[] = [
  {
    id: "usuario",
    label: "User",
    detail: "the request starts here",
    f1: "the car arriving at the pit lane",
    stages: [],
  },
  {
    id: "borda",
    label: "CDN / edge",
    detail: "cache close to the user",
    f1: "the parts stock at the circuit",
    stages: ["es4"],
  },
  {
    id: "lb",
    label: "Load balancer",
    detail: "one address, many replicas",
    f1: "pit lane entry control",
    stages: ["es2"],
  },
  {
    id: "app",
    label: "Stateless replicas",
    detail: "any one serves any client",
    f1: "identical pit boxes, setup on the board",
    stages: ["es1", "es3"],
  },
  {
    id: "fila",
    label: "Redis, queue, and workers",
    detail: "state and slow work",
    f1: "the garage board and the tyre pile",
    stages: ["es3"],
  },
  {
    id: "banco",
    label: "Primary DB + replica",
    detail: "writes in one place, reads in many",
    f1: "the official archive and the circuit copy",
    stages: ["es5"],
  },
];

export const OBSERVABILITY_NODE: MapNode = {
  id: "obs",
  label: "Observability",
  detail: "metrics, logs, and traces across every layer",
  f1: "telemetry, radio, and mini-sectors",
  stages: ["es6"],
};

export const LESSONS: Lesson[] = [
  {
    id: "es1",
    num: "01",
    navTitle: "Speed or volume",
    tag: "performance vs scale",
    title: "Modern scalability fundamentals",
    question: "Is your problem speed or volume?",
    symptom:
      "The system slows down when many people arrive at once, and the first reaction is to buy a bigger machine.",
    pitScene:
      "The queue in the pit lane keeps growing. Training the crew makes each stop shorter; opening more pit boxes serves more cars at the same time. They are different remedies for different problems.",
    answer:
      "Scaling increases how much the system can handle; optimizing makes each task cost less. Before buying servers, find out which of the two problems you have.",
    concept: [
      "Performance is the latency of a single task. Optimization improves that performance without adding resources. Scalability is increasing throughput in proportion to the resources added: when the queue gets huge, the world's fastest cashier does not help; you need more checkouts.",
      "Vertical scaling (scaling up) is a bigger server: simple, but it has a physical and financial ceiling, usually needs downtime, and creates a single point of failure. Horizontal scaling (scaling out) is more servers sharing the load: a much higher ceiling and more resilience, as long as the application is stateless and there is a load balancer.",
      "Elasticity is growing and shrinking with the load; autoscaling is the mechanism that implements it. Metric-based (CPU above 70% for 5 minutes), scheduled (scale up at 08:55, down at 18:05), or predictive (Machine Learning over historical data). Performance, cost, and complexity form a triangle: you cannot maximize all three.",
    ],
    analogies: [
      {
        term: "Optimization",
        f1: "Training the crew to cut the time of each pit stop: the same pit box services each car faster.",
      },
      {
        term: "Horizontal scaling",
        f1: "Opening more pit boxes: each pit stop still takes the same time, but more cars return to the track in the same window.",
      },
      {
        term: "Instance capacity",
        f1: "How many service positions a pit box has at the same time.",
        limit:
          "An F1 pit box services one car at a time. The lab's capacity of 2 is an imaginary pit box with two service positions.",
      },
      {
        term: "Single point of failure",
        f1: "The power unit: there is no spare inside the car. When it fails, the car stops, no matter how good everything else is.",
      },
    ],
    tradeoffs: [
      {
        option: "Optimize",
        gain: "Improves latency and throughput at once, with no infrastructure cost.",
        cost: "Diminishing returns: at some point the code is already good and the queue is still there.",
      },
      {
        option: "Vertical scaling",
        gain: "Simple: nothing changes in the application.",
        cost: "Physical and financial ceiling, downtime for the swap, and a single point of failure.",
      },
      {
        option: "Horizontal scaling",
        gain: "A much higher ceiling and resilience to losing one machine.",
        cost: "Requires a stateless application and a load balancer in front.",
      },
      {
        option: "Autoscaling",
        gain: "You pay only for the capacity the load asks for.",
        cost: "It reacts with a delay; instant spikes still need headroom.",
      },
    ],
    examplesTitle: "A shop with limited capacity",
    examples: [
      {
        label: "app/app.py",
        lang: "sh",
        code: `# Server model: at most CAPACIDADE requests at the same time
HOST = socket.gethostname()  # container name: identifies who answered
TRABALHO = float(os.getenv("TRABALHO_MS", "100")) / 1000
CAPACIDADE = threading.Semaphore(int(os.getenv("CAPACIDADE", "2")))

def do_GET(self):
    if self.path == "/health":
        corpo = "ok\\n"
    else:
        with CAPACIDADE:            # only N get in at a time
            time.sleep(TRABALHO)    # simulates real work
        corpo = f"{HOST} {VERSAO}\\n"`,
        note: "It is a scale model, not a real server: the numbers are predictable by design.",
      },
      {
        label: "experiment",
        lang: "sh",
        code: `$ docker build -t lab-app ./app
$ carga() { time (seq 1 100 | xargs -P 20 -I{} curl -s -o /dev/null "$1"); }
# Baseline: capacity 2, 100 ms
$ docker run -d --name base -p 8081:8080 lab-app
$ carga http://localhost:8081/
real    0m5.2s
# Optimization: half the work
$ docker run -d --name otim -p 8082:8080 -e TRABALHO_MS=50 lab-app
# Vertical: capacity 4
$ docker run -d --name vert -p 8083:8080 -e CAPACIDADE=4 lab-app`,
        note: "Baseline about 5 s; optimization and vertical about 2.5 s; three instances about 1.7 s.",
      },
    ],
    commands: [
      { cmd: "docker build -t lab-app ./app", note: "builds the test application" },
      {
        cmd: 'curl -s -o /dev/null -w "%{time_total}s\\n" localhost:8081/',
        note: "latency of a single request",
      },
      { cmd: "docker stop base", note: "takes down the single server and exposes the SPOF" },
      { cmd: "docker rm -f base otim vert h1 h2 h3", note: "stage cleanup" },
    ],
    labGoal: "Measure the difference between optimizing, scaling up, and scaling out.",
    labSteps: [
      "Run the baseline and write down the latency of one request and the time for 100.",
      "Repeat with TRABALHO_MS=50 (optimization) and with CAPACIDADE=4 (vertical).",
      "Start h1, h2, and h3 on ports 8084 to 8086 and spread the load using the request number modulo 3.",
      "Compare: scaling did not change single-request latency; optimizing changed both.",
      "Stop base and h1: see 000 on the single server and 000 200 200 on the fleet.",
    ],
    rule: "Measure before you scale. One database index can be worth more than ten servers.",
    pitRule:
      "a faster crew does not open a new pit box, and a new pit box does not make the stop any shorter.",
    selfCheck: "Can you explain why three replicas do not make a single request any faster?",
  },
  {
    id: "es2",
    num: "02",
    navTitle: "Spreading the load",
    tag: "L4, L7, and deploys",
    title: "Load balancers in practice",
    question: "How do you spread the load and swap versions without anyone noticing?",
    symptom:
      "There are several replicas, but the client needs a single address; and when a replica dies or a new version ships with a bug, someone has to react within seconds.",
    pitScene:
      "Every car comes in through the same pit lane entry. If nobody controls that entry, a pit box closes and the next car stops in front of its door, waiting for nothing.",
    answer:
      "The load balancer is the single entry point that spreads the load, takes sick instances out of rotation, and lets you swap versions without taking anyone down.",
    concept: [
      "A load balancer is a proxy between clients and servers: the client talks to a single address. L4 (TCP/UDP) decides by IP and port, is extremely fast, and does not see the content (AWS NLB). L7 (HTTP) reads paths, headers, and cookies and routes /api/pagamentos to one group and /blog to another (AWS ALB).",
      "Algorithms: round-robin (circular list, ignores load), weighted round-robin (weights for bigger machines), least connections (whoever has the fewest active connections), and IP hash (the same IP always on the same server, with a risk of imbalance behind a corporate proxy).",
      "Health checks test each server; when one fails, failover kicks in and new traffic goes to the healthy ones. Connection draining lets in-flight connections finish. Blue/Green switches 100% at once with an instant rollback; canary sends 1% to 10% to the new version and ramps up gradually.",
    ],
    analogies: [
      {
        term: "Load balancer",
        f1: "Pit lane entry control, sending each car to a free pit box.",
        limit:
          "In F1 each car always stops at its own team's box. Servers have no rulebook: any replica can serve any request.",
      },
      {
        term: "L4 vs L7",
        f1: "L4 is the timing loop, which only reads the transponder number; L7 is the engineer who listens to the radio and understands the request.",
      },
      {
        term: "Health check and failover",
        f1: "The marshal who sees a closed pit box and waves the next car to another one before it stops at the door.",
      },
      {
        term: "Canary",
        f1: "An upgrade package fitted to one car first, to compare it with the other before equipping both.",
        limit:
          "With two cars, the smallest possible canary is half the fleet; with a load balancer you pick 1%, 5%, or 10%.",
      },
    ],
    tradeoffs: [
      {
        option: "Round-robin",
        gain: "Simple and predictable.",
        cost: "Ignores the real load: a slow server gets as much as a fast one.",
      },
      {
        option: "Least connections",
        gain: "Follows the actual load.",
        cost: "Has to count connections; short and long requests weigh the same.",
      },
      {
        option: "IP hash",
        gain: "The same client always lands on the same server.",
        cost: "Unbalanced behind a corporate proxy, where a thousand people share one IP.",
      },
      {
        option: "Blue/Green",
        gain: "Instant switch and rollback.",
        cost: "Doubles the infrastructure during the swap.",
      },
      {
        option: "Canary",
        gain: "A bug only reaches a fraction of the users.",
        cost: "Needs metrics to decide whether to move forward or roll back.",
      },
    ],
    examplesTitle: "Nginx balancing 3 replicas",
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
      VERSAO: v1              # stable version (the "blue" one)
    deploy:
      replicas: 3             # three identical copies
  verde:
    image: lab-app
    environment:
      VERSAO: v2              # new version, used for the canary
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
    zone azul 64k;   # round-robin shared across Nginx workers
    server app:8080 max_fails=1 fail_timeout=10s;   # passive health check
}
upstream verde { server verde:8080; }

server {
    listen 80;
    location / {
        proxy_pass http://azul;
        proxy_connect_timeout 1s;           # gives up quickly on unresponsive servers
        proxy_next_upstream error timeout;  # tries the next server
    }
}`,
        note: "Open source Nginx does passive health checks; the ALB actively probes on an interval.",
      },
      {
        label: "canary 10%",
        lang: "sh",
        code: `# Picks by request ID: 10% to verde, the rest to azul
split_clients "\${request_id}" $destino {
    10% verde;
    *   azul;
}
# in location /: proxy_pass http://$destino;

$ seq 1 200 | xargs -P 10 -I{} curl -s localhost:8080/ | awk '{print $2}' | sort | uniq -c
    180 v1
     20 v2`,
        note: "Change 10% to 100% for the blue/green switch; delete the line to roll back.",
      },
    ],
    commands: [
      {
        cmd: "for i in $(seq 1 30); do curl -s localhost:8080/; done | awk '{print $1}' | sort | uniq -c",
        note: "10 responses per replica",
      },
      {
        cmd: "docker stop $(docker compose ps -q app | head -n 1)",
        note: "takes down a replica to watch failover",
      },
      {
        cmd: "docker compose exec lb nginx -t && docker compose exec lb nginx -s reload",
        note: "validates and reloads without dropping connections",
      },
    ],
    labGoal: "See the algorithms in action, take down a replica on purpose, and run a canary.",
    labSteps: [
      "Send 30 requests and confirm 10 per replica (round-robin).",
      "Stop one replica and confirm 20 responses with 200; then bring it back and reload Nginx.",
      "Switch to least_conn and then ip_hash; with ip_hash every request lands on the same server.",
      "Configure the 10% canary and count about 180 v1 and 20 v2.",
      "Switch to 100% verde (blue/green) and roll back to azul.",
    ],
    labNote:
      "On macOS, use gsed (brew install gnu-sed) instead of sed -i, or edit the file by hand.",
    rule: "Every deploy needs a way back that takes seconds, not minutes.",
    pitRule:
      "entry control never sends a car to a closed pit box, and every new part can be taken off before the next lap.",
    selfCheck: "Can you say what happens to in-flight connections when a replica leaves rotation?",
  },
  {
    id: "es3",
    num: "03",
    navTitle: "State and queues",
    tag: "scaling patterns",
    title: "Horizontal scaling patterns in cloud architectures",
    question: "Where does the state live, and who does the slow work?",
    symptom:
      "The user adds items to the cart and, on the next request, the cart shows up empty; or checkout is slow because it waits for the invoice and the email to be ready.",
    pitScene:
      "The car's setup lives only in one mechanic's head: they leave the pit box and nobody knows the setup. And the car sits there waiting for the tyre analysis, which could be done later.",
    answer:
      "If state lives on the server, the server cannot die or be replaced. Move the state out and move slow work out of the response path.",
    concept: [
      "Stateful keeps the session in the server's memory: the LB sends the client to another replica and the cart disappears. Sticky sessions patch it but limit resilience. Stateless moves state out (Redis, a database): any replica serves any client, and failover loses nothing.",
      "Scaling units keep N copies running: ReplicaSet in Kubernetes, Auto Scaling Group on AWS, deploy.replicas in Compose. Workers and queues decouple heavy work: the producer publishes to the queue and answers 202 right away; workers consume later and scale with the queue length (what KEDA automates).",
      "Advanced patterns: sidecar (helper container in the same Pod), ambassador (proxy to the outside world), sharding (partitioned data, Stage 05). Resilience: retry with exponential backoff and fallback (a plan B, such as serving from cache). The circuit breaker stops calling a service that keeps failing.",
    ],
    analogies: [
      {
        term: "Stateful",
        f1: "The car's setup kept only in one mechanic's head: if they leave the pit box, the information leaves too.",
      },
      {
        term: "Stateless with Redis",
        f1: "The setup written on the garage's central board, which any mechanic from any pit box can read.",
      },
      {
        term: "Queue and worker",
        f1: "The pit box confirms the stop right away; the used tyre goes to the pile the engineers analyze later, at their own pace.",
        limit:
          "People do not scale in seconds: the team is fixed for the weekend, while replicas and workers come and go in minutes.",
      },
      {
        term: "Circuit breaker",
        f1: "Stop ordering parts from a supplier that failed several times in a row and use the spare stock until it recovers.",
      },
    ],
    tradeoffs: [
      {
        option: "Sticky sessions",
        gain: "Nothing changes in the code.",
        cost: "A replica that dies takes its sessions with it, and the load becomes uneven.",
      },
      {
        option: "State in Redis or a database",
        gain: "Any replica serves any client.",
        cost: "One more component to run, and it also has to scale.",
      },
      {
        option: "Queue and workers",
        gain: "Instant response and independent scaling of the heavy work.",
        cost: "Processing is eventual and needs acknowledgment (ack) to avoid losing messages.",
      },
      {
        option: "Retry with backoff",
        gain: "Absorbs transient failures without the user noticing.",
        cost: "Without a limit and a growing wait, it amplifies the overload it was trying to get around.",
      },
    ],
    examplesTitle: "Stateless cart and a queue with workers",
    examples: [
      {
        label: "app.py (excerpt)",
        lang: "sh",
        code: `MODO = os.getenv("MODO", "memoria")  # "memoria" = stateful, "redis" = stateless

# GET /carrinho: reads from Redis or from this process's memory
itens = r.lrange(f"carrinho:{user}", 0, -1) if r else memoria.get(user, [])

# POST /pedido: the producer publishes to the queue and answers right away
r.lpush("fila:pedidos", pedido)
return self.responder_json(202, {"pedido": pedido, "status": "recebido"})`,
      },
      {
        label: "worker.py",
        lang: "sh",
        code: `while True:
    # BRPOP waits up to 5 s for an item in the queue
    item = r.brpop("fila:pedidos", timeout=5)
    if item is None:
        continue
    _, pedido = item
    print(f"[{HOST}] processando pedido {pedido}", flush=True)
    time.sleep(1)  # invoice and email: 1 s of heavy work`,
        note: "A Redis list has no acknowledgment: if the worker dies midway, the message is lost. SQS and RabbitMQ keep it until the ack.",
      },
      {
        label: "docker-compose.yml",
        lang: "yaml",
        code: `name: lab-etapa-03
services:
  app:
    image: lab-app
    environment:
      MODO: \${MODO:-memoria}     # reads MODO from the shell
      REDIS_HOST: redis
    deploy:
      replicas: 3
  redis:
    image: redis:7-alpine        # shared state and queue
  worker:
    image: lab-app
    command: ["python", "-u", "worker.py"]
    restart: on-failure
    deploy:
      replicas: 0                # turned on in the queue experiment`,
      },
    ],
    commands: [
      {
        cmd: 'for i in 1 2 3; do curl -s -X POST "localhost:8080/carrinho?user=ana&item=item$i"; done',
        note: "three items, one per replica",
      },
      {
        cmd: "docker compose exec redis redis-cli LRANGE carrinho:ana 0 -1",
        note: "the whole cart, outside the replicas",
      },
      { cmd: "docker compose up -d --scale worker=3", note: "scales only the workers" },
      { cmd: "docker compose exec redis redis-cli LLEN fila:pedidos", note: "queue length" },
    ],
    labGoal: "Watch the cart disappear, move it to Redis, and send the heavy work to the queue.",
    labSteps: [
      "With MODO=memoria, add 3 items and read the cart 3 times: each response has a single item.",
      "With MODO=redis, repeat: all three responses show all three items.",
      "Stop one replica and confirm the cart is still complete; bring it back and reload Nginx.",
      "Turn on 1 worker, enqueue 12 orders, and see the instant 202 responses.",
      "Time how long it takes to drain the queue with 1 worker (about 12 s) and with 3 (about 4 s).",
    ],
    labNote:
      "workers = ceil(LLEN / orders per worker within the deadline). That is the math KEDA does for you.",
    rule: "State out (Redis, a database) and slow work out of the response path (queue and workers).",
    pitRule: "the setup goes on the board, and the tyre analysis moves out of the pit stop's way.",
    selfCheck: "Can you explain why the order answers 202 and not 200?",
  },
  {
    id: "es4",
    num: "04",
    navTitle: "Distance and cache",
    tag: "global performance",
    title: "CDNs and global performance",
    question: "How do you serve users far from the origin quickly?",
    symptom:
      "The page loads well near the data center and poorly on the other side of the world; and the origin burns CPU serving the same file thousands of times.",
    pitScene:
      "Every spare part ships from the factory. At a circuit on the other side of the world, each order takes a long time, and the factory ships the same part over and over.",
    answer:
      "A CDN is a cache close to the user; the origin's Cache-Control is in charge of it, and the metric that matters is the Cache Hit Ratio.",
    concept: [
      "Latency depends on the speed of light and on distance. A CDN is a network of proxy servers (PoPs or edge locations) that keeps copies of the content close to the user. Smart DNS returns the IP of the nearest PoP; the PoP answers from cache (hit) or fetches from the origin and keeps a copy (miss).",
      "The origin's Cache-Control sets the TTL (max-age). Once it expires, the edge revalidates with the origin: if nothing changed, the origin answers 304 Not Modified and the copy gets more time without transferring the file. Invalidation (purge) removes it by force, but every purge forces a new miss.",
      "CDNs also scale APIs (public GETs that rarely change), run WAF and TLS offload at the edge, and are measured by the Cache Hit Ratio. Logged-in user data never goes to a shared edge: use private, no-store.",
    ],
    analogies: [
      {
        term: "Origin and PoP",
        f1: "The factory and the parts stock set up at each circuit.",
        limit:
          "A physical part changes location; a cached file is a copy, and the origin keeps the original.",
      },
      {
        term: "ETag and 304",
        f1: "The part's revision number: if the revision at the circuit matches the factory's, there is no need to ship another one.",
      },
      {
        term: "Purge",
        f1: "The recall: every part of that revision comes off the shelf, and the next one has to come from the factory.",
      },
      {
        term: "X-Cache",
        f1: "The label that says whether the part came off the shelf (HIT) or from the factory (MISS).",
      },
    ],
    tradeoffs: [
      {
        option: "Long TTL",
        gain: "High hit ratio and a relaxed origin.",
        cost: "Changes take a while to show up; it only works well with versioned files.",
      },
      {
        option: "Short TTL",
        gain: "Changes show up quickly.",
        cost: "More revalidations reach the origin.",
      },
      {
        option: "Purge",
        gain: "Removes the stale copy immediately.",
        cost: "Every purge sends a wave of misses to the origin.",
      },
      {
        option: "API cache at the edge",
        gain: "Absorbs read spikes without touching the application.",
        cost: "Only fits public GETs that rarely change.",
      },
    ],
    examplesTitle: "Origin and edge with Nginx",
    examples: [
      {
        label: "origem/default.conf",
        lang: "sh",
        code: `server {
    listen 80;
    root /usr/share/nginx/html;
    location /estatico/ {
        # 10 s TTL, short on purpose so you can see it expire
        add_header Cache-Control "public, max-age=10";
    }
    location /api/ {
        default_type application/json;
        # no Cache-Control: the edge does not cache
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
        proxy_cache_revalidate on;   # on expiry, asks the origin (If-None-Match)
        add_header X-Cache $upstream_cache_status always;
    }
}`,
        note: "X-Cache is not a standard HTTP header: each provider has its own. Here we define it ourselves.",
      },
      {
        label: "miss and hit",
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
        note: "the origin's ETag and Cache-Control",
      },
      {
        cmd: 'curl -sI -H "If-None-Match: $ETAG" http://localhost:8082/estatico/app.js',
        note: "304 Not Modified",
      },
      {
        cmd: "docker compose exec edge sh -c 'rm -rf /var/cache/nginx/edge/*'",
        note: "simulated purge (then restart the edge)",
      },
    ],
    labGoal: "Read the headers: each response tells where the part came from.",
    labSteps: [
      "Inspect Cache-Control and ETag directly at the origin (port 8082).",
      "Trigger a 304 by sending If-None-Match with the ETag.",
      "Request 3 times through the edge (port 8081): MISS, HIT, HIT.",
      "Send 20 requests: 20 HIT within the TTL, or 1 REVALIDATED and 19 HIT after it.",
      "Change the file, wait for the TTL, and see EXPIRED with the new content; then simulate a purge.",
    ],
    rule: "A versioned JavaScript bundle can have a TTL of months; a bank balance never goes to the edge.",
    pitRule:
      "standard parts stay in the circuit stock; a part made to measure for one driver never goes on the common shelf.",
    selfCheck:
      "Reading only the Cache-Control, can you predict whether the next request will be a HIT, MISS, or REVALIDATED?",
  },
  {
    id: "es5",
    num: "05",
    navTitle: "The database",
    tag: "replicas, sharding, CAP",
    title: "Database scalability",
    question: "How do you scale the one piece that does not accept loose copies?",
    symptom:
      "The application already scales horizontally, but every replica hits the same database, which becomes the bottleneck and the single point of failure.",
    pitScene:
      "The pit boxes multiplied, but they all read and change the same official engineering archive, and the queue to touch it becomes the new bottleneck.",
    answer:
      "Reads scale with cache and replicas; writes only scale by partitioning, and everything else is a conscious choice between consistency and availability.",
    concept: [
      "The database is stateful and needs consistency, safe concurrency, and low latency. For reads (often 100 reads per write): cache-aside with Redis (try the cache; on a miss, read the database and store it in the cache) and read replicas (the primary takes the writes and replicates them, usually asynchronously; the application does write splitting).",
      "For writes, sharding: by range (simple, but it creates hotspots) or by hash (spreads better, but makes range queries harder). Re-sharding is expensive: going from 2 to 3 shards by modulo moves about two thirds of the IDs. DynamoDB, Cassandra, and CockroachDB do this transparently.",
      "CAP theorem: during a network partition, choose between consistency and availability (CP or AP). AP leads to eventual consistency: for a while, different nodes return different values and then converge. Failover promotes a replica; RPO is how much data you can lose, RTO is how long you can be down.",
    ],
    analogies: [
      {
        term: "Primary and read replica",
        f1: "The official engineering archive at the factory and the read-only copy consulted at the circuit.",
      },
      {
        term: "Cache-aside",
        f1: "The garage board: you check it first; if the information is not there, you fetch it from the archive and write it on the board.",
      },
      {
        term: "Network partition (CAP)",
        f1: "The radio drops: either the car waits for the link to come back before acting (consistency), or it carries on with the last instruction it received (availability).",
        limit:
          "The driver decides on the spot; in a database, choosing CP or AP is a design decision made before the partition.",
      },
      {
        term: "Failover",
        f1: "The backup engineer, who heard everything on the headset, takes over the radio when the lead engineer steps away.",
      },
    ],
    tradeoffs: [
      {
        option: "Cache-aside",
        gain: "Takes most reads off the database.",
        cost: "Data can be stale until the TTL expires or someone invalidates it.",
      },
      {
        option: "Read replicas",
        gain: "Scales reads without touching the data model.",
        cost: "Replication lag: reading right after writing may not show the new data.",
      },
      {
        option: "Range sharding",
        gain: "Range queries stay simple.",
        cost: "Creates hotspots when the load concentrates on one range.",
      },
      {
        option: "Hash sharding",
        gain: "Spreads writes evenly.",
        cost: "Range queries must visit every shard, and re-sharding moves a lot of data.",
      },
    ],
    examplesTitle: "Postgres primary, replica, and Redis",
    examples: [
      {
        label: "replica.sh",
        lang: "sh",
        code: `#!/bin/bash
set -e
# Only takes the initial copy if the data directory is still empty
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  chmod 700 "$PGDATA"
  # -R writes the standby configuration; -X stream copies the WAL in real time
  pg_basebackup -h primary -U replicador -D "$PGDATA" -R -X stream
fi
# Because of -R, it starts as a read-only replica
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
      PGPASSWORD: replica123      # replication user's password
    volumes:
      - ./replica.sh:/replica.sh:ro
    entrypoint: ["bash", "/replica.sh"]
    depends_on:
      primary:
        condition: service_healthy
  redis:
    image: redis:7-alpine`,
        note: "init-primary.sh creates the replicador role and allows replication in pg_hba.conf.",
      },
      {
        label: "eventual consistency",
        lang: "sh",
        code: `$ docker compose exec replica psql -U postgres -c "SELECT pg_wal_replay_pause();"
$ docker compose exec primary psql -U postgres -c "INSERT INTO produtos VALUES (3,'Boné');"
# primary: 3   replica: 2
$ docker compose exec replica psql -U postgres -c "SELECT pg_wal_replay_resume();"
# replica: 3 (converged)`,
      },
    ],
    commands: [
      {
        cmd: 'docker compose exec replica psql -U postgres -c "SELECT pg_is_in_recovery();"',
        note: "t on the replica, f on the primary",
      },
      {
        cmd: 'docker compose exec primary psql -U postgres -c "SELECT client_addr, state, sync_state FROM pg_stat_replication;"',
        note: "streaming and async",
      },
      { cmd: "bash cache-aside.sh 1", note: "MISS the first time, HIT afterwards" },
      {
        cmd: 'docker compose exec replica psql -U postgres -c "SELECT pg_promote();"',
        note: "manual failover",
      },
    ],
    labGoal: "Watch the write reach the replica with a delay and apply cache-aside by hand.",
    labSteps: [
      "Confirm which node is primary (f) and which is the replica (t), and that replication is streaming async.",
      "Write to the primary, read from the replica, and confirm the replica rejects INSERT.",
      "Pause the replica, write to the primary, and see 3 versus 2; resume and watch it converge.",
      "Run cache-aside: MISS Camiseta, then HIT Camiseta; the key's TTL is 30 s.",
      "Change the data and see the cache serve the stale value until you invalidate it with DEL.",
    ],
    rule: "Whoever writes must invalidate the cache, or accept the TTL as a staleness window.",
    pitRule:
      "only the factory changes the official archive; the circuit reads the copy knowing it may be one revision behind.",
    selfCheck:
      "During a partition, does your system prefer to return a stale value or not answer at all? Can you justify the choice?",
  },
  {
    id: "es6",
    num: "06",
    navTitle: "Assemble and observe",
    tag: "real world + observability",
    title: "Scalable architectures in the real world",
    question: "How do the pieces fit together, and how do you see what happens inside?",
    symptom:
      "Each piece works on its own, but when something gets slow in production nobody can say which layer is spending the time.",
    pitScene:
      "The car is slow, but without telemetry, radio, and mini-sector times nobody can say whether the problem is the engine, the tyres, or the aerodynamics.",
    answer:
      "A scalable architecture is the right combination of simple parts, and it only stays that way if you can see the system through metrics, logs, and traces.",
    concept: [
      "Serverless (AWS Lambda) is the ultimate abstraction: the provider scales and goes back to zero, cost included. A stateless monolith in an ASG scales well and is simple to test and debug; microservices give fine-grained scaling and independent teams, at the price of operational complexity, network latency, and distributed debugging. Conway's Law says the architecture mirrors the organization.",
      "Observability has three pillars: metrics tell what is happening and trigger alerts; logs tell why; traces tell where the time went across services. SRE treats operations as software, with SLOs and error budgets: a 99.9% SLO over 30 days leaves a 43.2-minute budget.",
      "The e-commerce site that went down on Black Friday is fixed part by part: a CDN in front of the assets (Stage 04), a load balancer removing the SPOF (Stage 02), a stateless application in an ASG with a queue for slow work (Stages 01 and 03), and a managed database with read replicas (Stage 05).",
    ],
    analogies: [
      { term: "Metrics", f1: "Live telemetry: speed, temperatures, and pressures in real time." },
      { term: "Logs", f1: "The radio: the record of what was said and when." },
      { term: "Traces", f1: "Mini-sector times: exactly where the lap lost time." },
      {
        term: "X-Request-ID",
        f1: "The transponder: the same number read at every timing loop, stitching the car's pass around the circuit together.",
      },
    ],
    tradeoffs: [
      {
        option: "Serverless",
        gain: "Scales on its own and goes back to zero, cost included.",
        cost: "Cold starts, execution limits, and provider lock-in.",
      },
      {
        option: "Stateless monolith",
        gain: "Simple to test, debug, and deploy.",
        cost: "Everything scales together and ships in the same deploy.",
      },
      {
        option: "Microservices",
        gain: "Fine-grained scaling and independent teams.",
        cost: "Network latency, distributed debugging, and more operations.",
      },
      {
        option: "SLO and error budget",
        gain: "Decide with data when to speed up delivery or slow down.",
        cost: "Only works with reliable metrics agreed with the business.",
      },
    ],
    examplesTitle: "Edge, LB, replicas, Redis, and a worker",
    examples: [
      {
        label: "docker-compose.yml",
        lang: "yaml",
        code: `name: lab-etapa-06
services:
  edge:                     # the "CDN"
    image: nginx:1.27-alpine
    ports:
      - "8080:80"           # the only port exposed to the world
    volumes:
      - ./edge:/etc/nginx/conf.d:ro
  lb:                       # the "ALB"
    image: nginx:1.27-alpine
    volumes:
      - ./lb:/etc/nginx/conf.d:ro
      - ./site:/usr/share/nginx/html:ro
  app:                      # stateless monolith in 3 replicas (the "ASG")
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
# Log with the request ID: our homemade trace
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
        note: "Each line checks one property from one stage of the guide.",
      },
    ],
    commands: [
      { cmd: "docker compose up -d --build && bash verificar.sh", note: "starts and checks" },
      { cmd: "docker stats --no-stream", note: "metrics: CPU and memory per container" },
      {
        cmd: 'docker compose logs --no-color lb app | grep "$RID"',
        note: "trace: the same rid in the lb and in the replica",
      },
    ],
    labGoal: "Start the full stack and follow one request end to end through its X-Request-ID.",
    labSteps: [
      "Start the stack and run verificar.sh until you see four OK lines.",
      "Stop one replica and confirm 20 responses with 200; bring it back and reload the lb.",
      "Compare the load against the architecture (about 1.7 s) and against a single-instance monolith (about 5 s).",
      "Stop the monolith and see the 000 of the single point of failure.",
      "Grab a rid from the lb logs and find the same request in the app logs.",
    ],
    rule: "Start with a stateless monolith; split it into services when teams and bottlenecks justify it.",
    pitRule: "nobody touches the setup without looking at the telemetry first.",
    selfCheck:
      "Given a rid in the load balancer log, can you find within seconds which replica served the request?",
  },
];
