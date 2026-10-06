// Content from the six lessons of the "Server Scalability" course (Phase 2), one stage per lesson,
// themed around Formula 1 by the /otimizar-relatorio pipeline (relatorios/escalabilidade/final.en.md).

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
  { tema: "Request", f1: "A car entering the pit lane to be serviced" },
  { tema: "Server, instance, or replica", f1: "A pit box with its full pit crew" },
  {
    tema: "Single point of failure (SPOF)",
    f1: "The power unit: there is no spare; when it fails, the race is over",
  },
  {
    tema: "Load balancer",
    f1: "Pit lane entry control, sending each car to a free pit box",
  },
  {
    tema: "Stateful and stateless",
    f1: "The setup kept in one mechanic's head versus the setup written on the central board",
  },
  {
    tema: "Redis (state, queue, and cache)",
    f1: "The garage's live data board, shared by every pit box",
  },
  {
    tema: "Queue and worker",
    f1: "The pile of used tyres awaiting analysis and the factory engineer who works through it",
  },
  { tema: "CDN (origin and edge)", f1: "The factory and the parts stock set up at each circuit" },
  {
    tema: "Primary database and read replica",
    f1: "The official archive at the factory and the read-only copy at the circuit",
  },
  { tema: "X-Request-ID", f1: "The transponder: the same number at every timing loop" },
];

export const ANALOGY_NOTES: string[] = [
  "One pit box per team: in real F1, each car always stops at its own team's box. Servers have no rulebook, and any replica can serve any request.",
  "An F1 pit box services one car at a time. The lab's capacity of 2 is an imaginary pit box with two service positions.",
  "People do not scale in seconds: the team is fixed for the weekend, while replicas and workers come and go in minutes.",
  "With two cars, the smallest possible canary in F1 is half the fleet; with a load balancer you pick 1%, 5%, or 10%.",
  "A physical part changes location; a cached file is a copy, and the origin keeps the original.",
  "When the radio drops, the driver decides on the spot whether to stay out or pit; in a database, choosing CP or AP is a design decision made before the partition.",
];

export const LESSONS: Lesson[] = [
  {
    id: "es1",
    num: "01",
    navTitle: "Fundamentals",
    tag: "performance vs scale",
    title: "Modern scalability fundamentals",
    narration:
      "Lights out! The first corner already demands a decision many teams get wrong: is your problem speed or volume? Mix the two up and you spend the budget in the wrong place.",
    lead: "Scaling increases how much the system can handle; optimizing makes each task cost less. Before buying servers, find out which of the two problems you have.",
    concept: [
      "Performance is the latency of a single task. Optimization improves that performance without adding resources. Scalability is increasing throughput in proportion to the resources added: when the queue gets huge, the world's fastest cashier does not help; you need more checkouts.",
      "Vertical scaling (scaling up) is a bigger server: simple, but it has a physical and financial ceiling, usually needs downtime, and creates a single point of failure. Horizontal scaling (scaling out) is more servers sharing the load: a much higher ceiling and more resilience, as long as the application is stateless and there is a load balancer.",
      "Elasticity is growing and shrinking with the load; autoscaling is the mechanism that implements it. Metric-based (CPU above 70% for 5 minutes), scheduled (scale up at 08:55, down at 18:05), or predictive (Machine Learning over historical data). Performance, cost, and complexity form a triangle: you cannot maximize all three.",
      "On track: a trained crew cuts the time of each pit stop (optimization); more pit boxes increase how many cars return to the track (scale). The power unit is the classic single point of failure: in Sepang, on October 4, 2026, George Russell stopped on the straight in the closing laps and his race ended there.",
    ],
    pointsTitle: "This stage's dashboard",
    points: [
      {
        t: "Scaling does not change latency",
        d: "More replicas raise throughput; they do not speed up a single request.",
        color: "blue",
      },
      {
        t: "Vertical has a ceiling and a SPOF",
        d: "A bigger pit box is still one pit box: when it goes down, everything goes down.",
        color: "ember",
      },
      {
        t: "When NOT to scale",
        d: "A bad query gets optimized; an internal system for 50 people does not need autoscaling.",
        color: "signal",
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
    handsOnIntro: "Measure the difference between optimizing, scaling up, and scaling out.",
    handsOn: [
      "Run the baseline and write down the latency of one request and the time for 100.",
      "Repeat with TRABALHO_MS=50 (optimization) and with CAPACIDADE=4 (vertical).",
      "Start h1, h2, and h3 on ports 8084 to 8086 and spread the load using the request number modulo 3.",
      "Compare: scaling did not change single-request latency; optimizing changed both.",
      "Stop base and h1: see 000 on the single server and 000 200 200 on the fleet.",
    ],
    tip: "Measure before you scale. One database index can be worth more than ten servers.",
    takeaway:
      "Scaling increases how much the system can handle (throughput); optimizing makes each task cost less.",
    outro:
      "Sector 1 is green. Someone is still missing at the pit lane entry to notice the closed box and redirect: that is Stage 02.",
  },
  {
    id: "es2",
    num: "02",
    navTitle: "Load balancers",
    tag: "L4, L7, and deploys",
    title: "Load balancers in practice",
    narration:
      "Sector two, and the pace changes. Pit lane entry control takes the stage: algorithms, failover, canary, and rollback on the same straight. Eyes on the track.",
    lead: "The load balancer is the single entry point that spreads the load, takes sick instances out of rotation, and lets you swap versions without taking anyone down.",
    concept: [
      "A load balancer is a proxy between clients and servers: the client talks to a single address. L4 (TCP/UDP) decides by IP and port, is extremely fast, and does not see the content (AWS NLB). L7 (HTTP) reads paths, headers, and cookies and routes /api/pagamentos to one group and /blog to another (AWS ALB).",
      "Algorithms: round-robin (circular list, ignores load), weighted round-robin (weights for bigger machines), least connections (whoever has the fewest active connections), and IP hash (the same IP always on the same server, with a risk of imbalance behind a corporate proxy).",
      "Health checks test each server; when one fails, failover kicks in and new traffic goes to the healthy ones. Connection draining lets in-flight connections finish. Blue/Green switches 100% at once with an instant rollback; canary sends 1% to 10% to the new version and ramps up gradually.",
      "On track, L4 is the timing loop that reads the transponder; L7 is the engineer who listens to the radio and understands the request. IP hash is the real pit lane: each car always goes to its own team's box. Canary is the upgrade package fitted to one car first.",
    ],
    pointsTitle: "Load balancing parts",
    points: [
      {
        t: "L4 vs L7",
        d: "Raw speed by IP and port, or smart routing based on HTTP content.",
        color: "blue",
      },
      {
        t: "Failover",
        d: "A sick instance leaves rotation without the client noticing.",
        color: "signal",
      },
      {
        t: "Canary and Blue/Green",
        d: "A new version for a few, or a full switch you can undo in seconds.",
        color: "ember",
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
    handsOnIntro: "Pit lane open: algorithms, a pit box taken down on purpose, and a canary.",
    handsOn: [
      "Send 30 requests and confirm 10 per replica (round-robin).",
      "Stop one replica and confirm 20 responses with 200; then bring it back and reload Nginx.",
      "Switch to least_conn and then ip_hash; with ip_hash every request lands on the same server.",
      "Configure the 10% canary and count about 180 v1 and 20 v2.",
      "Switch to 100% verde (blue/green) and roll back to azul.",
    ],
    tip: "On macOS, use gsed (brew install gnu-sed) instead of sed -i, or edit the file by hand.",
    takeaway:
      "The load balancer spreads the load, takes sick instances out of rotation, and swaps versions without taking anyone down.",
    outro:
      "Sector 2 is green. But what if the car's setup lives only in one mechanic's head? Stage 03 is next.",
  },
  {
    id: "es3",
    num: "03",
    navTitle: "Stateless and queues",
    tag: "scaling patterns",
    title: "Horizontal scaling patterns in cloud architectures",
    narration:
      "A sequence of technical corners! The problem is no longer at the pit lane entry: it is inside the application, with state kept in the wrong place and slow work in the response path.",
    lead: "If state lives on the server, the server cannot die or be replaced. Move the state out and move slow work out of the response path.",
    concept: [
      "Stateful keeps the session in the server's memory: the LB sends the client to another replica and the cart disappears. Sticky sessions patch it but limit resilience. Stateless moves state out (Redis, a database): any replica serves any client, and failover loses nothing.",
      "Scaling units keep N copies running: ReplicaSet in Kubernetes, Auto Scaling Group on AWS, deploy.replicas in Compose. Workers and queues decouple heavy work: the producer publishes to the queue and answers 202 right away; workers consume later and scale with the queue length (what KEDA automates).",
      "Advanced patterns: sidecar (helper container in the same Pod), ambassador (proxy to the outside world), sharding (partitioned data, Stage 05). Resilience: retry with exponential backoff and fallback (a plan B, such as serving from cache). The circuit breaker stops calling a service that keeps failing.",
      "On track: the mechanic with the setup in his head is stateful; the setup on the garage's central board is stateless. The pit box answers 'box confirmed' and the used tyre goes to the pile that factory engineers analyze later.",
    ],
    pointsTitle: "The patterns",
    points: [
      {
        t: "Stateless",
        d: "State in Redis or the database: any replica can pick up the work.",
        color: "blue",
      },
      {
        t: "Queue and workers",
        d: "Immediate response (202) and asynchronous heavy work, scaled by the queue.",
        color: "signal",
      },
      {
        t: "Retry and fallback",
        d: "Try again, waiting longer each time; have a plan B ready.",
        color: "ember",
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
    handsOnIntro:
      "Watch the cart disappear, move it to Redis, and send the heavy work to the queue.",
    handsOn: [
      "With MODO=memoria, add 3 items and read the cart 3 times: each response has a single item.",
      "With MODO=redis, repeat: all three responses show all three items.",
      "Stop one replica and confirm the cart is still complete; bring it back and reload Nginx.",
      "Turn on 1 worker, enqueue 12 orders, and see the instant 202 responses.",
      "Time how long it takes to drain the queue with 1 worker (about 12 s) and with 3 (about 4 s).",
    ],
    tip: "workers = ceil(LLEN / orders per worker within the deadline). That is the math KEDA does for you.",
    takeaway:
      "State out (Redis, a database) and slow work out of the response path (queue and workers).",
    outro:
      "Sector 3 is green. Now the calendar goes international: how do you deliver parts fast so far from the factory? Stage 04.",
  },
  {
    id: "es4",
    num: "04",
    navTitle: "CDN and cache",
    tag: "global performance",
    title: "CDNs and global performance",
    narration:
      "The international leg of the championship! No engine beats physics: in this stage we stop fighting distance and start working around it, with stock prepositioned at the circuit.",
    lead: "A CDN is a cache close to the user; the origin's Cache-Control is in charge of it, and the metric that matters is the Cache Hit Ratio.",
    concept: [
      "Latency depends on the speed of light and on distance. A CDN is a network of proxy servers (PoPs or edge locations) that keeps copies of the content close to the user. Smart DNS returns the IP of the nearest PoP; the PoP answers from cache (hit) or fetches from the origin and keeps a copy (miss).",
      "The origin's Cache-Control sets the TTL (max-age). Once it expires, the edge revalidates with the origin: if nothing changed, the origin answers 304 Not Modified and the copy gets more time without transferring the file. Invalidation (purge) removes it by force, but every purge forces a new miss.",
      "CDNs also scale APIs (public GETs that rarely change), run WAF and TLS offload at the edge, and are measured by the Cache Hit Ratio. Logged-in user data never goes to a shared edge: use private, no-store.",
      "On track: the origin is the factory, the PoP is the parts stock set up at the circuit, the ETag is the part's revision number, and a purge is a recall. X-Cache is the label that says whether the part came off the shelf (HIT) or from the factory (MISS).",
    ],
    pointsTitle: "What to read in the headers",
    points: [
      {
        t: "Cache-Control",
        d: "The origin decides whether, and for how long, a response may be stored.",
        color: "blue",
      },
      {
        t: "ETag and 304",
        d: "Cheap revalidation: the copy is still valid, nothing is resent.",
        color: "signal",
      },
      {
        t: "HIT, MISS, REVALIDATED",
        d: "The edge's verdict; hit ratio is hits over the total.",
        color: "ember",
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
    handsOnIntro:
      "Read headers the way an engineer reads telemetry: each response tells where the part came from.",
    handsOn: [
      "Inspect Cache-Control and ETag directly at the origin (port 8082).",
      "Trigger a 304 by sending If-None-Match with the ETag.",
      "Request 3 times through the edge (port 8081): MISS, HIT, HIT.",
      "Send 20 requests: 20 HIT within the TTL, or 1 REVALIDATED and 19 HIT after it.",
      "Change the file, wait for the TTL, and see EXPIRED with the new content; then simulate a purge.",
    ],
    tip: "A versioned JavaScript bundle can have a TTL of months; a bank balance never goes to the edge.",
    takeaway:
      "A CDN is a cache close to the user, governed by the origin's Cache-Control and measured by the Cache Hit Ratio.",
    outro:
      "Sector 4 is green. Next comes the most feared chicane on the track: the database. Stage 05, hold on tight.",
  },
  {
    id: "es5",
    num: "05",
    navTitle: "Databases",
    tag: "replicas, sharding, CAP",
    title: "Database scalability",
    narration:
      "We reach the chicane! Turning on three more is not enough here, because the official engineering archive accepts revisions in one place only. It is the densest stage of the GP, and championships are decided here.",
    lead: "Reads scale with cache and replicas; writes only scale by partitioning, and everything else is a conscious choice between consistency and availability.",
    concept: [
      "The database is stateful and needs consistency, safe concurrency, and low latency. For reads (often 100 reads per write): cache-aside with Redis (try the cache; on a miss, read the database and store it in the cache) and read replicas (the primary takes the writes and replicates them, usually asynchronously; the application does write splitting).",
      "For writes, sharding: by range (simple, but it creates hotspots) or by hash (spreads better, but makes range queries harder). Re-sharding is expensive: going from 2 to 3 shards by modulo moves about two thirds of the IDs. DynamoDB, Cassandra, and CockroachDB do this transparently.",
      "CAP theorem: during a network partition, choose between consistency and availability (CP or AP). AP leads to eventual consistency: for a while, different nodes return different values and then converge. Failover promotes a replica; RPO is how much data you can lose, RTO is how long you can be down.",
      "On track: the primary is the official archive at the factory, the replica is the copy consulted at the circuit, and cache-aside is the garage board. A partition is the radio dropping; failover is the backup engineer who heard everything on the headset taking over the radio.",
    ],
    pointsTitle: "The database levers",
    points: [
      {
        t: "Cache and replicas",
        d: "They scale reads; writes still happen in one place.",
        color: "blue",
      },
      {
        t: "Sharding",
        d: "Scales writes, at the cost of complexity and painful re-sharding.",
        color: "ember",
      },
      {
        t: "CAP, RPO, RTO",
        d: "The business sets how much it can lose and how long it can be down.",
        color: "signal",
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
    handsOnIntro:
      "Watch the revision reach the circuit copy with a delay and apply cache-aside by hand.",
    handsOn: [
      "Confirm which node is primary (f) and which is the replica (t), and that replication is streaming async.",
      "Write to the primary, read from the replica, and confirm the replica rejects INSERT.",
      "Pause the replica, write to the primary, and see 3 versus 2; resume and watch it converge.",
      "Run cache-aside: MISS Camiseta, then HIT Camiseta; the key's TTL is 30 s.",
      "Change the data and see the cache serve the stale value until you invalidate it with DEL.",
    ],
    tip: "Whoever writes must invalidate the cache, or accept the TTL as a staleness window.",
    takeaway:
      "Reads scale with cache and replicas; writes, with sharding; and CAP is a conscious choice made before the partition.",
    outro:
      "Sector 5 is green. One lap to go: put all the pieces together and switch on the telemetry. Stage 06.",
  },
  {
    id: "es6",
    num: "06",
    navTitle: "Full architecture",
    tag: "real world + observability",
    title: "Scalable architectures in the real world",
    narration:
      "Final stage! No more loose parts: this is the integrated operation of a whole GP weekend. And architecture without telemetry is driving with your eyes closed.",
    lead: "A scalable architecture is the right combination of simple parts, and it only stays that way if you can see the system through metrics, logs, and traces.",
    concept: [
      "Serverless (AWS Lambda) is the ultimate abstraction: the provider scales and goes back to zero, cost included. A stateless monolith in an ASG scales well and is simple to test and debug; microservices give fine-grained scaling and independent teams, at the price of operational complexity, network latency, and distributed debugging. Conway's Law says the architecture mirrors the organization.",
      "Observability has three pillars: metrics tell what is happening and trigger alerts; logs tell why; traces tell where the time went across services. SRE treats operations as software, with SLOs and error budgets: a 99.9% SLO over 30 days leaves a 43.2-minute budget.",
      "The e-commerce site that went down on Black Friday is fixed part by part: a CDN in front of the assets (Stage 04), a load balancer removing the SPOF (Stage 02), a stateless application in an ASG with a queue for slow work (Stages 01 and 03), and a managed database with read replicas (Stage 05).",
      "On track: metrics are live telemetry, logs are the radio, traces are the mini-sector times, and X-Request-ID is the transponder that stitches each pass together.",
    ],
    pointsTitle: "The three pillars",
    points: [
      { t: "Metrics", d: "What is happening: CPU, latency, error rate.", color: "blue" },
      { t: "Logs", d: "Why it happened: discrete, timestamped events.", color: "signal" },
      { t: "Traces", d: "Where the time went: the journey of one request.", color: "ember" },
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
    handsOnIntro:
      "Qualifying lap: the full stack comes up and the transponder stitches each pass together.",
    handsOn: [
      "Start the stack and run verificar.sh until you see four OK lines.",
      "Stop one replica and confirm 20 responses with 200; bring it back and reload the lb.",
      "Compare the load against the architecture (about 1.7 s) and against a single-instance monolith (about 5 s).",
      "Stop the monolith and see the 000 of the single point of failure.",
      "Grab a rid from the lb logs and find the same request in the app logs.",
    ],
    tip: "Start with a stateless monolith; split it into services when teams and bottlenecks justify it.",
    takeaway:
      "Edge, balancer, stateless application, queue, and a database with replicas, seen through metrics, logs, and traces.",
    outro:
      "Checkered flag! You started without knowing whether the problem was speed or volume and crossed the line with the full architecture and the telemetry switched on.",
  },
];
