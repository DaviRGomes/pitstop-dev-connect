// Conteúdo das 6 aulas de Escalabilidade nos servidores (DevOps e Arquitetura Cloud, Fase 2).
// A lente geral de F1 abre o guia (LENS) e cada etapa ensina o tópico só de forma técnica,
// sem repetir a analogia.
// Gerado de relatorios/escalabilidade/final.en.md por scripts/build-lens-guide.py.
// Para mudar o texto, edite o markdown e gere de novo; o markdown inline (`código`, **negrito**)
// é renderizado pelo LensKit.

import type { ChecklistGroup, GuideLens, TechLesson } from "@/components/guide/LensKit";

export type Lesson = TechLesson;

export const INTRO: string[] = [
  "This guide teaches server scalability in six stages. You start by separating performance, optimization and scalability and comparing vertical and horizontal scaling; then you study load balancers (algorithms, failover, canary and blue/green), state outside the server with Redis, queues and workers, the CDN edge, database scalability (read replica, cache-aside, sharding, CAP, RPO and RTO) and, finally, the complete architecture with metrics, logs and request tracing. Before the stages, the next section introduces the F1 lens of the guide: a general comparison that shows the same system working inside a Formula 1 team.",
  'Each stage depends only on what was explained before it and ends with a "Hands-on" block: a lab and exercises with an expected answer. Scalability is learned by measuring, so run the commands and compare the numbers.',
  "**Prerequisites:**",
  "**Lab folder structure** (you will create it gradually):",
  "All commands start from the `lab-escalabilidade` folder, unless the stage tells you to enter its own folder.",
];

export const LENS: GuideLens = {
  paragraphs: [
    "During a Grand Prix weekend (the championship round, with free practice, qualifying and the race), a Formula 1 team works in two places at the same time. At the circuit there are the garage, where the mechanics prepare the two cars, and the pit wall, the gantry facing the track where the engineers follow the session. At the factory there is the remote operations room, where several analysts look at the same data in real time. The two places talk over a single data link: if it goes down, the garage is cut off from the factory.",
    "Each car sends telemetry (the sensor data, transmitted continuously) to the team servers. The race engineer (who follows one car and talks to the driver over the radio) needs answers all the time: how worn the rear tire is, what pace the car ahead has, whether it is worth pitting this lap. Most of those questions are not answered at the circuit. They travel over the link to the operations room at the factory.",
    "When the room receives more questions than it can answer, there are two ways out. One is to give an analyst a more powerful computer, which has a limit and leaves that desk idle during the swap. The other is to add more identical analysts, working in parallel.",
    "At the room entrance, a coordinator receives each question and hands it to a free analyst. From time to time he checks with each desk whether it is working, and when a desk goes down, the following questions go to the others. A new analysis tool is used first on one car only, in free practice, and only afterwards on both.",
    "So that any analyst can continue another's work, nothing stays in anyone's head: the context of each question is in the team's shared data system. Slow work, such as a strategy simulation repeated thousands of times, is not done while the engineer waits. The request goes into the queue of the simulation computer cluster, the room answers \"received\", and each machine takes one request at a time. When the queue grows, the team turns on more machines.",
    "The material the circuit consults all the time (the circuit map, the tire reference data) does not cross the world on every query. The servers the team takes to the circuit keep a local copy, with an expiry date, and the factory can order it discarded before the deadline when the original changes.",
    "The car specification sheet (the official record of every part and every adjustment) has a single official version, at the factory, and changes are made only there. The garage consults read copies, updated shortly afterwards and, for a few moments, behind. If the link to the factory goes down, the garage has to choose: keep working with the copy it has, possibly outdated, or wait for the link to return so as not to decide with old data.",
    "To understand what is happening, the team looks at three records: the telemetry, with the numbers from each sensor throughout the session; the event diary, with what happened and at what time; and the protocol number each question receives when it enters the room, which allows reconstructing which desks it passed through and how long it stayed at each one.",
  ],
  bridge: [
    'It is the same division of labor as a scalable system. Each question is a request, the operations room is the server fleet and the coordinator at the entrance is the load balancer. Taking the context out of the analyst\'s head is making the server stateless, and the simulator queue is the queue with workers. The copy at the circuit is the CDN, the official sheet and its copies are the primary database and the read replicas, and the three records are observability. The table below translates each term of the guide into plain words, and the "Where the comparison stops" section, right after it, shows what F1 does not cover in each stage.',
    "One fixed rule holds for the whole guide: each analyst in the room is a replica of the server. All are equal and interchangeable, and none keeps alone what another will need.",
  ],
  mappingNote:
    "The table below translates each technical term of the guide into an everyday idea, with no F1 and no jargon. You do not need to memorize it; come back to it whenever a term shows up in the text.",
  mapping: [
    {
      term: "Performance (latency)",
      plain:
        "How long it takes to serve one person alone, like the minutes a cashier spends ringing up one customer's groceries.",
    },
    {
      term: "Throughput",
      plain: "How many people are served per minute in total, adding up all the open cashiers.",
    },
    {
      term: "Optimization",
      plain:
        "Making the same task cost less without hiring anyone, like the cashier who learns a faster way to scan products.",
    },
    {
      term: "Scalability",
      plain:
        "The ability to serve more people when resources are added, like the store that opens more cashiers when the line grows.",
    },
    {
      term: "Trade-off triangle",
      plain:
        "In a renovation you want it fast, cheap and simple, and you rarely get all three together. With servers it is the same: performance, cost and complexity.",
    },
    {
      term: "Vertical scaling",
      plain:
        "Swapping the kitchen stove for a bigger one. It is simple, but there is a maximum size and, during the swap, the kitchen stops.",
    },
    {
      term: "Horizontal scaling",
      plain: "Opening more identical kitchens and splitting the orders among them.",
    },
    {
      term: "Single point of failure (SPOF)",
      plain:
        "The only bridge connecting a neighborhood to the rest of the city: if it closes, nobody gets through.",
    },
    {
      term: "Elasticity and autoscaling",
      plain:
        "Opening and closing cashiers according to the traffic, following rules agreed beforehand, instead of someone deciding on the spot.",
    },
    {
      term: "Karpenter",
      plain:
        "The manager who, when cashiers are missing, provides exactly the counter size the line calls for, choosing the cheapest one available at that moment.",
    },
    {
      term: "FinOps",
      plain:
        "Looking at the electricity bill together with the comfort of the house: deciding how much each gain is worth spending, instead of leaving everything on at maximum.",
    },
    {
      term: "Load balancer",
      plain:
        "The person who organizes the bank line and tells each customer which window is free. The customer only knows the line, not the windows.",
    },
    {
      term: "Layer 4 and layer 7",
      plain:
        "At layer 4, the mail carrier delivers by looking only at the address on the envelope. At layer 7, the secretary opens the letter and forwards it to the right department according to the subject.",
    },
    {
      term: "Round-robin",
      plain:
        "Dealing the cards one to each player around the table, without looking at who already has more.",
    },
    {
      term: "Weighted Round-robin",
      plain:
        "The same rotation, but with weights: the cook who can handle triple gets three orders per round, and the others get one.",
    },
    {
      term: "Least connections",
      plain:
        "Sending the next customer to the cashier who is serving the fewest people at that moment.",
    },
    {
      term: "IP hash (session affinity)",
      plain:
        "Each customer is always served by the same branch manager, chosen by a calculation on their number.",
    },
    {
      term: "Health check",
      plain:
        'The question asked from time to time at each window, "can you serve?"; whoever does not answer stops receiving customers.',
    },
    {
      term: "Failover",
      plain:
        "When a window suddenly closes, the next customers are sent to the others without noticing.",
    },
    {
      term: "Connection draining",
      plain:
        "Before closing a window, finishing the service of those already there, without calling anyone new.",
    },
    {
      term: "Blue/Green",
      plain:
        "Two identical stores side by side and a sign at the entrance pointing to one of them. Flipping the sign moves all customers at once, and flipping it back is just as fast.",
    },
    {
      term: "Rollback",
      plain:
        "Undoing a change and going back to the previous version that worked, like putting the furniture back in the old place when the new arrangement did not work.",
    },
    {
      term: "Canary",
      plain:
        "Serving the new recipe first to one table in ten and watching the reaction before changing the whole menu.",
    },
    {
      term: "Ingress",
      plain:
        'The board at the building entrance that says: "orders, room 2; everything else, reception".',
    },
    {
      term: "Stateful",
      plain:
        "The attendant who keeps your order in their head: only they can continue the service.",
    },
    {
      term: "Stateless",
      plain:
        "The order written on a ticket left on the counter: any attendant reads it and continues.",
    },
    {
      term: "Sticky session",
      plain:
        "Forcing the customer to always return to the same attendant, because only that one remembers the order.",
    },
    {
      term: "Redis",
      plain:
        "A quick message board in the middle of the kitchen, which all the cooks read and write.",
    },
    {
      term: "ReplicaSet and Auto Scaling Group",
      plain:
        'The manager\'s rule "always three cashiers open": if one closes, another opens in its place.',
    },
    {
      term: "Queue and worker",
      plain:
        "The orders hung on the kitchen clothesline and the cooks who take one at a time to prepare.",
    },
    {
      term: "Producer and 202 response",
      plain:
        'The waiter who writes down the order, hangs it on the clothesline and says "received"; the dish arrives later.',
    },
    {
      term: "KEDA",
      plain:
        "Calling more cooks when the order clothesline fills up and dismissing them when it empties.",
    },
    {
      term: "Sidecar",
      plain:
        "An assistant who works next to the cook writing down everything that goes out, without the cook having to stop for it.",
    },
    {
      term: "Ambassador",
      plain:
        "The agent who handles all the company's dealings with outside offices, including insisting when the call drops.",
    },
    {
      term: "Service mesh",
      plain:
        "An internal telephone exchange: every call between departments goes through it, and it repeats the call when it drops, limits the waiting time and records everything, without each department having to do it alone.",
    },
    {
      term: "Retry with exponential backoff",
      plain:
        "Calling again when nobody answers, waiting 1, then 2, then 4 minutes, so as not to congest the line.",
    },
    {
      term: "Jitter",
      plain:
        "Adding a few random seconds to the wait before calling again, so that many people who called at the same time do not all insist at the same instant.",
    },
    {
      term: "Fallback",
      plain: "The plan B agreed beforehand: if the dish ran out, the house option is served.",
    },
    {
      term: "Circuit breaker",
      plain:
        "The house's breaker: after repeated failures it trips, and nobody plugs appliances back into that outlet until the breaker is switched back on.",
    },
    {
      term: "CDN",
      plain:
        "A network of bookstore branches that keep copies of the most requested books close to each neighborhood.",
    },
    {
      term: "Origin",
      plain: "The central warehouse, where the originals are kept.",
    },
    {
      term: "PoP (edge)",
      plain: "The neighborhood branch, close to the buyers.",
    },
    {
      term: "Smart DNS",
      plain:
        "The attendant at the central office who, on learning which neighborhood you are calling from, gives you the address of the nearest branch.",
    },
    {
      term: "Edge computing",
      plain:
        "The neighborhood branch that, besides keeping books, does small services on the spot (wrapping, writing the dedication) without sending the order to the central warehouse.",
    },
    {
      term: "Cache hit and cache miss",
      plain:
        "Hit: the branch has the book on the shelf. Miss: the branch has to ask the warehouse, and keeps a copy for the next customer.",
    },
    {
      term: "Cache-Control and TTL",
      plain: 'The expiry label the warehouse sticks on each copy, like "valid for one hour".',
    },
    {
      term: "ETag and 304 Not Modified",
      plain:
        'The edition number of the book. The branch asks "is edition 3 still the current one?" and the warehouse answers "yes, keep using it", without sending another copy.',
    },
    {
      term: "Invalidation (purge)",
      plain:
        "The recall: ordering all the branches to discard a copy right away, before the expiry date.",
    },
    {
      term: "Cache hit ratio",
      plain:
        "The percentage of customers served by the branch without it having to ask the warehouse for anything.",
    },
    {
      term: "WAF",
      plain:
        "The guard at the door who turns away whoever arrives with a kind of attack already known.",
    },
    {
      term: "TLS offload",
      plain:
        "The lengthy document check done at the front desk, so that the departments inside do not need to repeat it.",
    },
    {
      term: "Primary and read replica",
      plain:
        "The official ledger, the only one where entries are made, and the copies of it that are updated shortly afterwards and that everyone can consult, without writing in them.",
    },
    {
      term: "Asynchronous replication",
      plain:
        "The copy is updated shortly after the original, but the original does not wait for the copy's confirmation; for a few moments it may be behind.",
    },
    {
      term: "Write splitting",
      plain: "The house rule: entries only in the official ledger; lookups, in the copies.",
    },
    {
      term: "Cache-aside",
      plain:
        "Before going to the archive, look at the note on the desk; if there is no note, fetch from the archive and leave a note for next time.",
    },
    {
      term: "Sharding",
      plain:
        "Splitting the customer files among several cabinets, by letter of the name (range) or by a calculation on the customer's number (hash).",
    },
    {
      term: "Hotspot",
      plain: "The cabinet that everyone opens at the same time, while the others sit idle.",
    },
    {
      term: "CAP theorem and partition",
      plain:
        "When the phone between two branches goes down, each one chooses: keep serving with the information it has (available, perhaps outdated) or stop until it can confirm with the other (consistent, but stopped).",
    },
    {
      term: "Eventual consistency",
      plain:
        "A notice posted in several rooms: for a few moments one room still shows the old notice, but in the end all show the same one.",
    },
    {
      term: "Replica promotion (database failover)",
      plain:
        "The substitute who was following the ledger becomes the main keeper and starts making the entries.",
    },
    {
      term: "RPO",
      plain:
        'How much work you accept losing, like "if the computer burns, I accept redoing at most the last 5 minutes".',
    },
    {
      term: "RTO",
      plain: "How long you accept being stopped until you are serving again.",
    },
    {
      term: "Serverless",
      plain:
        "Paying for the taxi ride instead of keeping a car: someone takes care of the vehicle and, with no trip, there is no bill.",
    },
    {
      term: "Monolith",
      plain: "A restaurant with a single kitchen, from which all the dishes come out.",
    },
    {
      term: "Microservices",
      plain:
        "A food court: each counter does one thing, has its own team and needs to coordinate with the others.",
    },
    {
      term: "Conway's law",
      plain: "The way the company is organized ends up showing in the way the system is divided.",
    },
    {
      term: "Metrics",
      plain:
        "The numbers on the electricity meter over the month: they show that consumption went up, and when.",
    },
    {
      term: "Logs",
      plain: "The front-desk incident book, with the time and description of each event.",
    },
    {
      term: "Traces",
      plain:
        "The tracking of a parcel, which shows which centers it passed through and how long it stayed at each one.",
    },
    {
      term: "X-Request-ID",
      plain: "The tracking code printed on the parcel, the same at every center it passes through.",
    },
    {
      term: "SLO and error budget",
      plain:
        'The goal "the store is open 99.9% of the time"; the remaining 0.1% is the slack for surprises and changes, and when it runs out the priority becomes stability.',
    },
  ],
  limitsIntro:
    "The comparison helps fix who does what in an operation that grows, but it is not a perfect equivalence. These are the points where F1 stops holding for each stage:",
  limits: [
    "**Stage 01:** adding one more analyst to the operations room takes weeks, and each person works in a different way; a server replica starts in seconds, is identical to the others and can be created and removed by an automatic rule. And extra analysts speed up nothing if all of them wait for the same shared part, like the database: then the problem is one of optimization, not of scale.",
    '**Stage 02:** the room coordinator reads the question and uses his own judgment; the load balancer follows a fixed algorithm (round-robin, least connections, IP hash) and only knows what the health check answers, so a server that answers "I\'m fine" but returns wrong data keeps receiving traffic. The canary is also not "one car out of two": it sends a chosen percentage of requests to the new version.',
    "**Stage 03:** an analyst remembers the context even without writing it down; a stateless server cannot keep anything between requests, and if it does, the load balancer sends the next request to another replica that does not know that state. The simulation queue, besides, is just a list of messages: the one who handles failures, retries with backoff and the circuit breaker is the code, not an operator watching the queue.",
    "**Stage 04:** the team hand-picks what it takes to the circuit servers; the CDN edge decides by itself what to keep and for how long, from the `Cache-Control` and `ETag` headers the origin sends. A response that changes from user to user cannot be kept at the edge, and a TTL that is too long makes the edge deliver stale content until the purge.",
    "**Stage 05:** the specification sheet changes a few times per session, in the hands of few people; a database receives thousands of simultaneous writes, and replica lag makes a read right after a write show the old data. Sharding, which splits the data itself among several databases, has no parallel in the single sheet, and the choice between consistency and availability in CAP is made in the design, before the failure, and not decided on the spot by someone in the garage.",
    "**Stage 06:** the car's sensors already leave the factory transmitting telemetry; in a system, metrics, logs and traces only exist if the code is instrumented, and the `X-Request-ID` only accompanies the request if each service passes it along. The complete architecture also has a cost: each extra piece is one more thing to monitor, pay for and maintain.",
  ],
};

export const LESSONS: Lesson[] = [
  {
    id: "m1",
    num: "01",
    navTitle: "Foundations",
    tag: "performance x scale",
    title: "Fundamentals of modern scalability",
    lead: 'An app goes viral after a marketing campaign. Millions of users try to access it at the same time and the system goes down. What should be a success becomes frustration and lost revenue: it is a scale failure. Large retailers offline on Black Friday and Twitter\'s (now X) "Fail Whale" are the classic examples. Technically, those outages usually came from bottlenecks in components that are hard to scale horizontally, such as an overloaded relational database or a payment system that could not handle the concurrency.\n\nGrowing along with demand is a business need. But there is a trap: not every slow system has a scale problem. Before buying more machines, you need to know what exactly is slow.',
    concept: [
      "Three words are often used as if they were the same thing, and they are not. Think of a supermarket:",
      "- **Performance** is the speed of a single task, that is, the latency of one operation: how many items per minute a cashier scans.",
      "- **Optimization** is improving performance without adding resources: teaching the cashier to scan 20% faster or reorganizing the products on the shelves.",
      "- **Scalability** is the ability to increase productivity (throughput) in proportion to the resources added. When the line gets gigantic, having the fastest cashier in the world does not help: more cashiers are opened.",
      "**The trade-off triangle.** Performance, cost and complexity: it is practically impossible to maximize all three at the same time. A database with top-end hardware and several cache layers raises cost and complexity. Microservices can lower the cost per request at large scale, but bring enormous operational complexity compared to a monolith. The professional's role is to navigate these trade-offs according to the technical and business requirements.",
      "**Vertical scaling (scaling up)** is enlarging a single server: more CPU, more RAM, faster disks.",
      "- Advantage: simplicity, usually without changing code.",
      "- Disadvantages: physical and financial limit (the next upgrade becomes prohibitive or does not exist), usually requires downtime for the upgrade and creates a **single point of failure (SPOF)**: if the super-server goes down, everything goes down.",
      "**Horizontal scaling (scaling out)** is adding more servers to distribute the load: a fleet of smaller, cheaper machines.",
      "- Advantage: theoretically unlimited scale and more resilience, since the failure of one instance only redirects traffic to the healthy ones.",
      "- Cost: the application must be designed for a distributed environment (ideally stateless) and operation becomes more complex, with the need for a load balancer (Stage 02).",
      "**Elasticity and autoscaling.** Elasticity is the ability to grow and shrink resources according to load. Autoscaling is the automated mechanism that implements it, with predefined rules, without an on-call team adding servers by hand. There are three styles:",
      "Automation is the key to cost efficiency: you pay only for what you use.",
      "**When NOT to scale.** Sometimes the bottleneck is solved with code optimization or a more efficient query. For an internal system with 50 employees and low, stable traffic, autoscaling is overkill in cost and complexity. Telling a scale problem from an optimization problem is a sign of maturity.",
      "**Current challenges and tools.** Microservices, containers, event-driven systems and unpredictable seasonal peaks multiply the components: dozens or hundreds of services, each with its own scaling need. Granularity allows scaling only the necessary component (for example, the shopping cart), but brings network latency and observability challenges. The tools cited in the material are Kubernetes (the orchestration standard), AWS Auto Scaling Groups (ASG, elasticity in the cloud), Karpenter (provisions resources by real need, with a focus on cost) and KEDA (scales based on events, such as the size of a queue).",
      "**In the market (according to the material):** iFood faces peaks on championship finals and rainy days and responds with microservices in the cloud, intensive autoscaling and queues to decouple order processing. The FinOps trend looks at scalability from the cost angle too; Karpenter provisions the exact resources using the cheapest instances available. Festival and sporting-event ticket sales taking sites down force the market to evolve in load balancing, bot protection and distributed caching via CDN.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Performance",
        d: "latency of an isolated operation.",
        color: "blue",
      },
      {
        t: "Throughput",
        d: "how much work the system completes per unit of time.",
        color: "signal",
      },
      {
        t: "Optimization",
        d: "improves performance without adding resources; usually improves throughput as well.",
        color: "violet",
      },
      {
        t: "Scalability",
        d: "increases throughput by adding resources; does not reduce the latency of an isolated request.",
        color: "ember",
      },
      {
        t: "Vertical scaling",
        d: "a bigger server; simple, with a ceiling, downtime on upgrade and a SPOF.",
        color: "blue",
      },
      {
        t: "Horizontal scaling",
        d: "more servers; resilient and with a high ceiling, requires a prepared application and a load balancer.",
        color: "signal",
      },
      {
        t: "SPOF",
        d: "a component without redundancy whose failure brings down the whole system.",
        color: "violet",
      },
      {
        t: "Elasticity and autoscaling",
        d: "growing and shrinking automatically, by metric, by schedule or by prediction.",
        color: "ember",
      },
    ],
    examplesTitle: 'A "store" with limited capacity',
    examples: [
      {
        label: "terminal",
        lang: "sh",
        code: "$ mkdir -p lab-escalabilidade/app && cd lab-escalabilidade",
        intro:
          "To feel the difference between optimizing, scaling up and scaling out, we will use a test application that models a server with finite capacity: each instance serves at most N requests at the same time (`CAPACIDADE`), and each request takes a fixed time (`TRABALHO_MS`). Requests that exceed the capacity wait their turn. It is a **model**, not a real server, but it makes the numbers predictable. The `/health` path answers immediately, without simulating work. Create the folder and the files:",
        note: "`app/app.py`:",
      },
      {
        label: 'a "store" with limited capacity',
        lang: "sh",
        code: 'import os\nimport socket\nimport threading\nimport time\nfrom http.server import BaseHTTPRequestHandler, ThreadingHTTPServer\n\nHOST = socket.gethostname()  # container name: identifies who answered\nVERSAO = os.getenv("VERSAO", "v1")  # version label (used in Stage 02)\nTRABALHO = float(os.getenv("TRABALHO_MS", "100")) / 1000  # time per request, in seconds\nCAPACIDADE = threading.Semaphore(int(os.getenv("CAPACIDADE", "2")))  # how many requests at the same time\n\n\nclass Handler(BaseHTTPRequestHandler):\n    def do_GET(self):\n        if self.path == "/health":\n            corpo = "ok\\n"  # health check: answers immediately, without simulating work\n        else:\n            with CAPACIDADE:  # only N get in at a time; the others wait in line\n                time.sleep(TRABALHO)  # simulates the real work (query, calculation)\n            corpo = f"{HOST} {VERSAO}\\n"\n        dados = corpo.encode()\n        self.send_response(200)\n        self.send_header("Content-Type", "text/plain")\n        self.send_header("Content-Length", str(len(dados)))\n        self.end_headers()\n        self.wfile.write(dados)\n\n\nclass Servidor(ThreadingHTTPServer):\n    request_queue_size = 128  # pending connection queue larger than the default\n\n\nif __name__ == "__main__":\n    Servidor(("0.0.0.0", 8080), Handler).serve_forever()',
        note: "`app/Dockerfile`:",
      },
      {
        label: "Dockerfile",
        lang: "sh",
        code: '# Small image with Python\nFROM python:3.12-alpine\n# Working folder inside the image\nWORKDIR /srv\n# Copies only the application code\nCOPY app.py .\n# Documents the port the application listens on\nEXPOSE 8080\n# -u turns off output buffering, so logs show up right away\nCMD ["python", "-u", "app.py"]',
        note: "Build the image and define a load function (100 requests, 20 in parallel, measuring the total time):",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: '# Builds the image named lab-app\n$ docker build -t lab-app ./app\n\n# Helper function: fires 100 requests, 20 at a time, against the given URL\n$ carga() { time (seq 1 100 | xargs -P 20 -I{} curl -s -o /dev/null "$1"); }',
        note: "Expected build output (shortened): `naming to docker.io/library/lab-app` at the end. The `carga` function only exists in the terminal where it was defined; if you open another terminal, define it again.",
      },
    ],
    commands: [
      {
        cmd: "docker build -t lab-app ./app",
        note: "builds the test application image",
      },
      {
        cmd: "docker run -d --name NOME -p PORTA:8080 -e VAR=valor lab-app",
        note: "starts an instance in the background, with environment variables",
      },
      {
        cmd: 'curl -s -o /dev/null -w "%{time_total}s\\n" URL',
        note: "measures the latency of one request",
      },
      {
        cmd: 'curl -s -o /dev/null -w "%{http_code}\\n" --max-time 2 URL',
        note: "shows only the HTTP code (`000` means there was no response)",
      },
      {
        cmd: "seq 1 100 | xargs -P 20 -I{} curl ...",
        note: "fires requests in parallel",
      },
      {
        cmd: "docker rm -f NOMES",
        note: "removes the lab containers",
      },
    ],
    handsOn: [
      "**Lab**",
      "**1. Baseline: one instance, capacity 2, 100 ms per request.**",
      '```sh\ndocker run -d --name base -p 8081:8080 lab-app\ncurl -s -o /dev/null -w "latência de uma requisição: %{time_total}s\\n" localhost:8081/\ncarga http://localhost:8081/\n```',
      "Expected output (approximate values, your machine varies):",
      "```text\nlatência de uma requisição: 0.10xxxxs\nreal    0m5.2s\n```",
      "The math: 2 requests every 100 ms give 20 per second; 100 requests take about 5 seconds.",
      "**2. Optimization: same machine, half the work.**",
      '```sh\ndocker run -d --name otim -p 8082:8080 -e TRABALHO_MS=50 lab-app\ncurl -s -o /dev/null -w "latência: %{time_total}s\\n" localhost:8082/\ncarga http://localhost:8082/\n```',
      "Expected: latency near 0.05s and total time near 2.5 s.",
      '**3. Vertical scaling: a "bigger server" (capacity 4).**',
      '```sh\ndocker run -d --name vert -p 8083:8080 -e CAPACIDADE=4 lab-app\ncurl -s -o /dev/null -w "latência: %{time_total}s\\n" localhost:8083/\ncarga http://localhost:8083/\n```',
      "Expected: latency stays near 0.10s; total time near 2.5 s.",
      '**4. Horizontal scaling: three small instances, with a hand-made "balancer".**',
      "```sh\ndocker run -d --name h1 -p 8084:8080 lab-app\ndocker run -d --name h2 -p 8085:8080 lab-app\ndocker run -d --name h3 -p 8086:8080 lab-app\n\n# The request number modulo 3 picks port 8084, 8085 or 8086\ntime (seq 1 100 | xargs -P 20 -I{} sh -c 'curl -s -o /dev/null http://localhost:$((8084 + {} % 3))/')\n```",
      "Expected: total time near 1.7 s (3 instances × 20 per second = 60 per second).",
      "**5. What to observe.**",
      "| Experiment | Latency of 1 request | Time for 100 requests |\n|---|---|---|\n| Base | about 0.10 s | about 5 s |\n| Optimization | about 0.05 s | about 2.5 s |\n| Vertical | about 0.10 s | about 2.5 s |\n| Horizontal (3) | about 0.10 s | about 1.7 s |",
      "Scaling (vertical or horizontal) **did not change the latency** of an isolated request, only the throughput. Optimizing changed both. This is exactly the distinction between performance and scalability.",
      "**6. The single point of failure, live.**",
      '```sh\ndocker stop base\ncurl -s -o /dev/null -w "%{http_code}\\n" --max-time 2 localhost:8081/\n\ndocker stop h1\nfor p in 8084 8085 8086; do curl -s -o /dev/null -w "%{http_code} " --max-time 2 localhost:$p/; done; echo\n```',
      "Expected: `000` on the first call (connection refused: the SPOF went down) and `000 200 200` on the second. With the fleet, only a third fails. But whoever decides where to send the request is still your `sh -c`, which does not know `h1` went down. In the next stage, the load balancer decides.",
      "**Cleanup:**",
      "```sh\ndocker rm -f base otim vert h1 h2 h3\n```",
      "**Exercises**",
      "1. **Scale or optimize?** For each situation, say which lever to use first and why: (a) a page runs 400 SQL queries in a loop; (b) the Black Friday campaign site will receive 20 times the normal traffic in 3 hours; (c) an internal system with 50 employees is slow on Monday mornings. *Expected answer:* (a) optimize, because the problem is the query and scaling would only multiply the waste; (b) scale horizontally, preferably with scheduled or metric-based autoscaling; (c) measure first, probably optimize, and avoid autoscaling as it is overkill in cost and complexity.",
      '2. **Write the three rules.** For a store with a predictable peak at 20:00, write a metric-based rule, a scheduled one and describe what a predictive one would do differently. *Expected answer:* (metric) "if the fleet\'s average CPU exceeds 70% for more than 5 minutes, add a server; if it drops below 30% for 10 minutes, remove one"; (scheduled) "every day at 19:50, scale up to the number of servers the peak requires, and at 22:00 scale down to the minimum"; (predictive) a Machine Learning model trained on the history learns the shape of the peak (for example, that Friday is stronger than Tuesday) and raises capacity before it begins, without depending on a hand-written time. The underlying difference: the metric rule reacts after the load has risen; the scheduled and predictive ones anticipate.',
      "3. **Triangle.** You need to cut the database latency in half. Name one solution that sacrifices cost and another that sacrifices complexity. *Expected answer:* sacrificing cost, top-end hardware for the database (vertical scaling: more RAM, faster disks), simple to operate but expensive, with a ceiling and a single point of failure; sacrificing complexity, one or more cache layers (for example, Redis) in front of the database, cheap per unit but with new problems (invalidation, stale data). Before either, it is worth checking whether a better query or index already solves it, because optimization costs little on all three vertices.",
    ],
    handsOnRich: true,
    tip: "Before scaling, measure two things separately: the latency of one request alone and the time of a parallel batch. If the single request is already slow, the problem is one of performance and more servers will not solve it.",
    takeaway:
      "Scaling increases how much the system can handle (throughput), optimizing makes each task cost less; before buying a server, find out which of the two problems you have.",
    figures: [
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa01-vertical-horizontal.en.svg",
            alt: "Two frames side by side. On the left, vertical scaling: the lab-app server with CAPACIDADE=1 becomes vert, with CAPACIDADE=4 on port 8083, and a red arrow points to the single point of failure. On the right, horizontal scaling: clients send requests to three servers, h1, h2 and h3, on ports 8084, 8085 and 8086.",
            caption:
              "With vertical scaling the server gets bigger but is still just one; with horizontal scaling each extra server is a copy and one failing does not take down the others.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa01-scale-cube.png",
            alt: "The scale cube on three axes. The X axis, horizontal duplication, goes from one monolithic system to many clones behind a load balancer. The Y axis splits by function or service. The Z axis splits data or users, for example by customer or SKU. The corner opposite the starting point is near infinite scale.",
            caption:
              "What you do in this stage is the X axis; splitting the data (Z axis) returns as sharding in stage 05 and splitting by function (Y axis) as microservices in stage 06.",
          },
        ],
        credit: "Image: Wikimedia Commons, Evan1945, CC BY-SA 4.0",
      },
    ],
  },
  {
    id: "m2",
    num: "02",
    navTitle: "Load balancers",
    tag: "algorithms + failover",
    title: "Load balancers in practice",
    lead: "You have three identical servers and a question: how does traffic reach them in an organized way? In Stage 01, your `sh -c` played the role of distributor and, when an instance went down, a third of the requests simply failed. In production, nobody wants the client deciding this alone, and nobody wants to take the site down to publish a new version on a Friday afternoon. This is where the load balancer comes in: it prevents overload, keeps the application up even if an instance fails and enables zero-downtime deploys, like those Netflix and Spotify do.",
    concept: [
      "A load balancer is a proxy server between the clients and the application servers. It is the single point of contact and an abstraction: the client talks to just one address. Besides distributing requests, it ensures high availability, reliability and simplified management. The material compares it to the air traffic controller, who directs planes to free runways and keeps the operation going even with a runway closed.",
      "**Layer 4 vs layer 7 (OSI model):**",
      '**External vs internal.** The external one has a public interface (public IP or DNS) and is the application\'s entry gate. The internal one exists only inside the private network (VPC) and manages communication between services: the "Cart" talks to the "Stock" without exposing the Stock to the internet, which is a security gain.',
      "**Algorithms:**",
      "- **Round-robin:** circular list, next in line. Fair and predictable, but ignores load and capacity. The **Weighted Round-robin** variant gives higher weights to more powerful servers.",
      "- **Least Connections:** sends to whoever has the fewest active connections. Good when connections have very different durations (uploads, streaming).",
      "- **IP Hashing:** the hash of the client IP defines the server, so the same IP always lands on the same server (session affinity). Disadvantages: uneven distribution when many users are behind the same corporate proxy, and session problems if a server fails and the hash is recalculated.",
      "**Health checks and failover.** The LB actively tests the health of each server. Parameters: interval, timeout, *unhealthy threshold* (consecutive failures to mark as unhealthy) and *healthy threshold* (consecutive successes to come back). When a server fails, **failover** happens: the LB stops sending new traffic to the sick instance, transparently. **Connection draining** lets existing connections finish before the instance is removed.",
      "**Deploy strategies:**",
      '- **Blue/Green:** two identical, isolated environments. The LB sends 100% to Blue (stable); Green (the new version) is validated; the "switch" points everything to Green. Rollback is just as fast. Watch out for the shared database: schema changes must be backward compatible.',
      "- **Canary:** name coming from the canaries used in coal mines. A small percentage (1%, 5%) goes to the new version; technical metrics (errors, latency) and business metrics (conversion, engagement) are monitored; it is increased gradually up to 100%.",
      "**In the market (according to the material):** Netflix uses internal LBs to decouple thousands of microservices; if recommendations get slow, traffic goes to a fallback or circuit breakers are activated, avoiding cascading failure. Service Mesh and API Gateways (Istio and Linkerd, with sidecar proxies acting as per-service L7 LBs) bring observability, mTLS and granular control. GSLB (Global Server Load Balancing) uses smart DNS for multi-cloud and hybrid environments: the user in Brazil goes to São Paulo, the one in Europe to Frankfurt, according to geolocation, latency and health. Cloudflare and F5 are cited as leaders.",
      "**How the lab fits in.** Nginx will play the role of the Application Load Balancer (L7). On AWS, the *listener* is the entry port, the *target group* is the group of destination servers and the *health check* decides who is healthy. In Nginx, `listen` is the listener, the `upstream` block is the target group and the health check is **passive**: open-source Nginx marks a server as failed when real connections to it fail. The active health check, which probes periodically, is a feature of NGINX Plus.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Load balancer",
        d: "single entry point that distributes requests among servers.",
        color: "blue",
      },
      {
        t: "L4",
        d: "decides by IP and port; fast and blind to the content.",
        color: "signal",
      },
      {
        t: "L7",
        d: "decides by the HTTP content (path, headers, cookies); smarter and more expensive to process.",
        color: "violet",
      },
      {
        t: "Round-robin, weighted, least connections, IP hash",
        d: "the rules for choosing the next server.",
        color: "ember",
      },
      {
        t: "Health check, failover, connection draining",
        d: "detecting the sick server, taking it out of rotation and letting what was already in progress finish.",
        color: "blue",
      },
      {
        t: "Blue/Green",
        d: "full switch between two environments, with equally fast rollback.",
        color: "signal",
      },
      {
        t: "Canary",
        d: "a small fraction of traffic on the new version, increased gradually.",
        color: "violet",
      },
      {
        t: "Ingress",
        d: "the Kubernetes L7 router, which takes external traffic to the right services in the cluster.",
        color: "ember",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "terminal",
        lang: "sh",
        code: "$ mkdir -p etapa-02/nginx && cd etapa-02",
        note: "`docker-compose.yml`:",
      },
      {
        label: "Nginx balancing 3 replicas",
        lang: "yaml",
        code: 'name: lab-etapa-02            # fixed project name (prefix for containers and networks)\n\nservices:\n  app:\n    build: ../app             # the Stage 01 image\n    image: lab-app            # name of the built image\n    environment:\n      VERSAO: v1              # stable version (the "blue" one)\n    deploy:\n      replicas: 3             # three identical copies of this service\n  verde:\n    build: ../app\n    image: lab-app\n    environment:\n      VERSAO: v2              # new version (the "green" one), used in the canary\n  lb:\n    image: nginx:1.27-alpine  # our L7 balancer\n    ports:\n      - "8080:80"             # host port 8080 goes into Nginx port 80\n    volumes:\n      - ./nginx:/etc/nginx/conf.d:ro   # mounts the folder (not the file) so reload sees the edits\n    depends_on:\n      - app                   # Nginx only starts after the replicas, since it resolves names at startup\n      - verde',
        note: "`nginx/default.conf`:",
      },
      {
        label: "Nginx balancing 3 replicas (2)",
        lang: "sh",
        code: 'upstream azul {\n    # zone: memory shared among the Nginx worker processes; without it,\n    # each worker would have its own round-robin counter and the distribution would be uneven\n    zone azul 64k;\n    # "app" resolves to the IPs of the 3 replicas; each IP becomes a server in the group\n    # max_fails=1 fail_timeout=10s: one failure takes the server out of rotation for 10 s (passive health check)\n    server app:8080 max_fails=1 fail_timeout=10s;\n}\n\nupstream verde {\n    server verde:8080;                  # the new version, a single container\n}\n\nserver {\n    listen 80;                          # the listener\n    location / {\n        proxy_pass http://azul;         # forwards to the blue group (round-robin by default)\n        proxy_connect_timeout 1s;       # gives up quickly on a server that does not respond\n        proxy_next_upstream error timeout;  # on error or timeout, tries the next server\n    }\n}',
        note: "Bring everything up and check:",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "$ docker compose up -d --build\n$ docker compose ps",
        note: "Expected output (shortened): three lines `lab-etapa-02-app-1`, `-2` and `-3` in `running`, plus `verde` and `lb`.",
      },
      {
        label: "a Kubernetes Ingress",
        lang: "yaml",
        code: 'apiVersion: networking.k8s.io/v1   # API version of the Ingress resource\nkind: Ingress                      # resource type\nmetadata:\n  name: loja                       # name of the Ingress\nspec:\n  ingressClassName: nginx          # which Ingress controller will implement it\n  rules:\n    - host: loja.exemplo.com       # only valid for this domain\n      http:\n        paths:\n          - path: /api             # requests that start with /api\n            pathType: Prefix       # prefix matching\n            backend:\n              service:\n                name: api          # go to the Service "api"\n                port:\n                  number: 80\n          - path: /                # everything else\n            pathType: Prefix\n            backend:\n              service:\n                name: web          # goes to the Service "web"\n                port:\n                  number: 80',
        intro:
          'The Ingress is the "smart router" that takes external traffic to the right services in the cluster. In Kubernetes, it plays the same role as the Nginx `location` blocks:',
      },
    ],
    commands: [
      {
        cmd: "docker compose up -d --build",
        note: "builds and brings up the stack in the background",
      },
      {
        cmd: "docker compose ps",
        note: "and `docker compose ps -q app`: list the containers (`-q` returns only the IDs)",
      },
      {
        cmd: "docker compose exec lb nginx -t",
        note: "validates the Nginx configuration before applying it",
      },
      {
        cmd: "docker compose exec lb nginx -s reload",
        note: "applies the new configuration without dropping connections in progress",
      },
      {
        cmd: "... | awk '{print $1}' | sort | uniq -c",
        note: "counts how many responses came from each server",
      },
      {
        cmd: "docker compose down -v",
        note: "takes the stack down and removes its volumes",
      },
    ],
    handsOn: [
      "**Lab**",
      "**1. Round-robin.** 30 requests, counting who answered:",
      "```sh\nfor i in $(seq 1 30); do curl -s localhost:8080/; done | awk '{print $1}' | sort | uniq -c\n```",
      "Expected (the IDs change):",
      "```text\n     10 3f2a1b9c0d1e\n     10 7c8d9e0f1a2b\n     10 a1b2c3d4e5f6\n```",
      "Thanks to the `zone` directive, the Nginx worker processes share the same round-robin counter, which is why the split comes out exact. Without it, each worker would have its own counter and the distribution could come out uneven (for example, 12 for one and 9 for each of the others).",
      "**2. Failover.** Take down one replica and keep calling:",
      '```sh\ndocker stop $(docker compose ps -q app | head -n 1)\nfor i in $(seq 1 20); do curl -s -o /dev/null -w "%{http_code}\\n" localhost:8080/; done | sort | uniq -c\n```',
      "Expected: `20 200`. No failure reached the client. The first request that lands on the stopped replica may take about 1 second (the `proxy_connect_timeout`) before Nginx tries another server. Compare with Stage 01, where `000` appeared.",
      "Bring the replica back and refresh Nginx, which resolves names only at startup and so may hold an outdated IP:",
      "```sh\ndocker compose up -d\ndocker compose exec lb nginx -s reload\n```",
      "**3. Algorithms.** Switch to `least_conn` and then to `ip_hash`. (On macOS, use `gsed` in place of `sed`, or edit `nginx/default.conf` by hand: insert the line `least_conn;` right below `upstream azul {` and, afterwards, replace it with `ip_hash;`.)",
      "```sh\n# Inserts \"least_conn;\" right after the opening of the upstream azul block\nsed -i 's/upstream azul {/upstream azul {\\n    least_conn;/' nginx/default.conf\ndocker compose exec lb nginx -t && docker compose exec lb nginx -s reload\n\n# Now switches to ip_hash\nsed -i 's/least_conn;/ip_hash;/' nginx/default.conf\ndocker compose exec lb nginx -t && docker compose exec lb nginx -s reload\nfor i in $(seq 1 10); do curl -s localhost:8080/; done | awk '{print $1}' | sort | uniq -c\n```",
      "Expected with `ip_hash`: a single line with `10` and a single server. Your client always has the same IP (the Docker gateway's) and so always lands on the same server: this is session affinity, and also the imbalance that happens when many people share an IP. Remove the line to go back to round-robin:",
      "```sh\nsed -i '/ip_hash;/d' nginx/default.conf\ndocker compose exec lb nginx -s reload\n```",
      "**4. Canary at 10%.** Replace the contents of `nginx/default.conf` with:",
      '```nginx\nupstream azul {\n    zone azul 64k;                      # balancing state shared among the workers\n    server app:8080 max_fails=1 fail_timeout=10s;\n}\n\nupstream verde {\n    server verde:8080;\n}\n\n# Draws the destination by each request\'s unique ID: 10% go to "verde", the rest to "azul"\nsplit_clients "${request_id}" $destino {\n    10% verde;\n    *   azul;\n}\n\nserver {\n    listen 80;\n    location / {\n        proxy_pass http://$destino;     # the group name comes from the drawn variable\n        proxy_connect_timeout 1s;\n        proxy_next_upstream error timeout;\n    }\n}\n```',
      "```sh\ndocker compose exec lb nginx -t && docker compose exec lb nginx -s reload\nseq 1 200 | xargs -P 10 -I{} curl -s localhost:8080/ | awk '{print $2}' | sort | uniq -c\n```",
      "Expected, approximately: `180 v1` and `20 v2` (the draw varies a little). If the `v2` metrics got worse, only that 10% would feel it.",
      "**5. Blue/Green: the switch and the rollback.** (On macOS, use `gsed`, or edit the file by hand: replace `10%` with `100%` for the switch and delete the `verde` line for the rollback.)",
      "```sh\n# Switch: 100% to the new version\nsed -i 's/10% verde;/100% verde;/' nginx/default.conf\ndocker compose exec lb nginx -s reload\nfor i in 1 2 3 4 5; do curl -s localhost:8080/ | awk '{print $2}'; done\n# Expected: v2 five times\n\n# Rollback: removes the verde rule and sends everything back to azul\nsed -i '/% verde;/d' nginx/default.conf\ndocker compose exec lb nginx -s reload\nfor i in 1 2 3 4 5; do curl -s localhost:8080/ | awk '{print $2}'; done\n# Expected: v1 five times\n```",
      "`nginx -s reload` is graceful: the old processes finish the connections in progress before exiting. This is the idea of connection draining.",
      "**Exercises**",
      "Exercises 1 and 2 change `nginx/default.conf` with the stack running. The file is in the canary/rollback format (with `split_clients`), and it is its `location /` block that you replace in exercise 1. After editing, run `docker compose exec lb nginx -t && docker compose exec lb nginx -s reload`.",
      "1. **L7 routing.** Replace the `location /` block with two: `location /api/` with `proxy_pass http://verde;` and `location /` with `proxy_pass http://azul;`. Call `curl -s localhost:8080/api/pagamentos` and `curl -s localhost:8080/blog`. Which version answers each one? Why is this only possible at L7? *Expected answer:* `/api/pagamentos` answers with `v2` (the `verde` group) and `/blog` with `v1` (the `azul` group). Only L7 can do it, because the `/api/...` path is inside the HTTP request, and L4 sees only IP and port.",
      "2. **Weights.** What would be the effect of `server app:8080 weight=3;` next to another server with weight 1, and in what real scenario would you use it? *Expected answer:* the weight-3 server would receive about 3 out of every 4 requests (ratio 3 to 1). It is Weighted Round-robin, useful when the machines are unequal and a more powerful server should receive more load than a smaller one.",
      "3. **Ingress (reading).** In the YAML of the second worked example, which service serves `/api/pedidos` and which serves `/`? *Expected answer:* `/api/pedidos` goes to the Service `api`; `/` goes to `web`. It is the same reasoning as the Nginx `location` blocks.",
      "**Cleanup (when you finish the lab and the exercises):**",
      "```sh\ndocker compose down -v\ncd ..\n```",
    ],
    handsOnRich: true,
    tip: "Before every `reload`, run `nginx -t`. An invalid configuration makes the reload be refused and Nginx keeps the previous configuration, but `-t` shows the error and the line right away, instead of you discovering later that the change did not take effect.",
    takeaway:
      "The load balancer is the single entry point that distributes the load, takes sick instances out of rotation and lets you swap versions without taking anyone down.",
    figures: [
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa02-canary.en.svg",
            alt: "The client reaches nginx, which uses split_clients on $request_id: 90% of requests go to azul (v1, app:8080, 3 replicas) and 10% to verde (v2, one container).",
            caption:
              "The canary sends only a small slice to the new version; the cutover and the rollback are changes to this one rule.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa02-balanceamento.en.svg",
            alt: "Frame 1: the client talks to nginx on port 8080, which spreads requests round-robin across app-1, app-2 and app-3, all healthy.",
            caption: "Each request goes to the next replica in the list.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa02-failover.en.svg",
            alt: "Frame 2: app-2 stopped responding (dashed red box). nginx records the error and tries app-1 and app-3, and the client sees no failure.",
            caption:
              "proxy_next_upstream retries on another replica, and max_fails plus fail_timeout take the sick replica out of rotation for 10 s.",
          },
        ],
        credit: "",
      },
    ],
  },
  {
    id: "m3",
    num: "03",
    navTitle: "Horizontal scale",
    tag: "stateless + queues",
    title: "Horizontal scaling patterns in cloud architectures",
    lead: "We already have a load balancer and a fleet. But what good is a fleet of identical servers if each client can only be served by one specific server? A customer puts coffee in the cart, the load balancer sends the next request to another instance, and the cart shows up empty. And what if payment processing is much slower than the rest? Adding servers for everything is a waste. This stage looks inside the application.\n\nThere is a second scenario, the e-commerce on Black Friday: confirming an order involves validating the payment, reducing stock, issuing the invoice and sending an e-mail. Done synchronously, the user waits for all of it in front of a loading screen, and each server stays busy with work that did not need to happen at that moment.",
    concept: [
      "**Golden rule: stateless.**",
      '- **Stateful:** keeps session data in the server\'s memory (for example, the cart in a session variable). The client gets "stuck" to the server; if the load balancer sends it to another one, the cart vanishes. The workaround is *sticky sessions*, which limit resilience and the efficiency of balancing.',
      "- **Stateless:** no context information stays on the server between requests; each request brings everything it needs. The state goes to a shared, fast storage (a database or a distributed cache such as Redis). Any server serves any client at any moment, which is compatible with horizontal scaling and automatic failover.",
      "**Scaling units.** These are the mechanisms that keep the right number of copies running:",
      "- **Kubernetes ReplicaSet:** guarantees a specified number of identical copies of a Pod always running.",
      "- **AWS Auto Scaling Group (ASG):** manages the lifecycle of a group of EC2 instances, keeping the desired number healthy.",
      "In Compose, the `deploy.replicas` field you used in Stage 02 plays a similar role, for local replicas.",
      '**Workers and queues.** The main application (the **producer**) publishes a message to a queue (AWS SQS, RabbitMQ) and answers right away ("Your order was received and is being processed"). The **workers** (consumers) read the queue and do the heavy work asynchronously. Workers scale independently of the API, based on the queue size.',
      "**Advanced patterns:**",
      "- **Sidecar:** helper container in the same Pod as the main one, handling logs, monitoring or network proxy without the application knowing.",
      "- **Ambassador:** a proxy variation focused on communication with the outside or with other services (retries, service discovery).",
      "- **Sharding:** horizontal scaling of data; the database is partitioned into smaller, independent databases (shards). Left for Stage 05.",
      "**Trade-offs and resilience.** An aggressive autoscaling policy gives better performance and a high bill; a conservative one saves money and degrades at peaks. FinOps seeks the balance. In distributed systems failure is certain, which is why there are **Retry** with exponential backoff (trying again, waiting longer and longer between attempts) and **Fallback** (plan B, such as serving from the cache or a default response).",
      '**Tools and market (according to the material):** KEDA (Kubernetes Event-driven Autoscaling) monitors the size of an SQS queue or the lag of a Kafka topic and scales workers from zero to N. Karpenter provisions exact, cheaper and suitable nodes at the moment. Netflix popularized the **Circuit Breaker** with the Hystrix library: repeated failures "open" the circuit, blocking calls to the failing service and going straight to the fallback; a failure in recommendations does not stop anyone from watching. Instagram and iFood use workers and queues for billions of uploads and millions of orders. Serverless (AWS Lambda) is the ultimate evolution of workers and queues: it scales from zero to thousands of executions and charges per execution. Istio and Linkerd implement Sidecar and Ambassador in a standardized way, with retries, timeouts, security and observability.',
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Stateful",
        d: "state in the server's memory; ties the client to it.",
        color: "blue",
      },
      {
        t: "Stateless",
        d: "state outside the server (Redis, database); any replica serves any client.",
        color: "signal",
      },
      {
        t: "Sticky session",
        d: "a patch that ties the client to a replica; the state still dies with it.",
        color: "violet",
      },
      {
        t: "ReplicaSet and ASG",
        d: "keep N identical, healthy copies.",
        color: "ember",
      },
      {
        t: "Producer, queue and worker",
        d: "answer right away and process the heavy work later.",
        color: "blue",
      },
      {
        t: "Scaling by queue size",
        d: "workers grow with the queue, independently of the API (the idea of KEDA).",
        color: "signal",
      },
      {
        t: "Sidecar and ambassador",
        d: "helper proxies next to the application.",
        color: "violet",
      },
      {
        t: "Retry with backoff, fallback and circuit breaker",
        d: "the mechanisms for living with failures.",
        color: "ember",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "stateful vs stateless cart, and queue with workers",
        lang: "sh",
        code: 'import json\nimport os\nimport socket\nimport threading\nimport time\nfrom http.server import BaseHTTPRequestHandler, ThreadingHTTPServer\nfrom urllib.parse import parse_qs, urlparse\n\nHOST = socket.gethostname()\nVERSAO = os.getenv("VERSAO", "v1")\nMODO = os.getenv("MODO", "memoria")  # "memoria" = stateful, "redis" = stateless\nTRABALHO = float(os.getenv("TRABALHO_MS", "100")) / 1000\nCAPACIDADE = threading.Semaphore(int(os.getenv("CAPACIDADE", "2")))\n\nmemoria = {}  # carts kept in the process (stateful)\nr = None\nif MODO == "redis":\n    import redis  # only imported when needed\n\n    r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)\n\n\nclass Handler(BaseHTTPRequestHandler):\n    def responder(self, status, corpo, tipo="text/plain"):\n        dados = corpo.encode()\n        self.send_response(status)\n        self.send_header("Content-Type", tipo)\n        self.send_header("Content-Length", str(len(dados)))\n        self.end_headers()\n        self.wfile.write(dados)\n\n    def responder_json(self, status, dados):\n        # every JSON says who answered (servidor) and in which mode\n        corpo = json.dumps({"servidor": HOST, "modo": MODO, **dados}) + "\\n"\n        self.responder(status, corpo, "application/json")\n\n    def do_GET(self):\n        url = urlparse(self.path)\n        q = parse_qs(url.query)\n        if url.path == "/health":\n            return self.responder(200, "ok\\n")\n        if url.path == "/carrinho":\n            user = q.get("user", ["anonimo"])[0]\n            # stateless: reads from Redis; stateful: reads from this process\'s memory\n            itens = r.lrange(f"carrinho:{user}", 0, -1) if r else memoria.get(user, [])\n            return self.responder_json(200, {"user": user, "itens": itens})\n        with CAPACIDADE:\n            time.sleep(TRABALHO)\n        self.responder(200, f"{HOST} {VERSAO}\\n")\n\n    def do_POST(self):\n        url = urlparse(self.path)\n        q = parse_qs(url.query)\n        if url.path == "/carrinho":\n            user = q.get("user", ["anonimo"])[0]\n            item = q.get("item", ["?"])[0]\n            if r:\n                r.rpush(f"carrinho:{user}", item)  # externalized state\n            else:\n                memoria.setdefault(user, []).append(item)  # state tied to the process\n            return self.responder_json(200, {"ok": True})\n        if url.path == "/pedido":\n            if r is None:\n                return self.responder_json(503, {"erro": "sem fila (use MODO=redis)"})\n            pedido = q.get("id", ["0"])[0]\n            r.lpush("fila:pedidos", pedido)  # producer: publishes to the queue and answers right away\n            return self.responder_json(202, {"pedido": pedido, "status": "recebido"})\n        self.responder(404, "nao encontrado\\n")\n\n    def log_message(self, formato, *args):\n        # records who served and the X-Request-ID (will be useful in Stage 06)\n        print(f"[{HOST}] {self.command} {self.path} rid={self.headers.get(\'X-Request-ID\', \'-\')}", flush=True)\n\n\nclass Servidor(ThreadingHTTPServer):\n    request_queue_size = 128\n\n\nif __name__ == "__main__":\n    Servidor(("0.0.0.0", 8080), Handler).serve_forever()',
        intro:
          "We will replace the application with a complete version: cart in memory or in Redis, depending on the `MODO` variable; an order endpoint that enqueues and answers `202`; and a worker. It keeps the Stage 01 behavior on `/` and `/health`. Replace `app/app.py`:",
        note: "Create `app/worker.py` (the consumer):",
      },
      {
        label: "stateful vs stateless cart, and queue with workers (2)",
        lang: "sh",
        code: 'import os\nimport socket\nimport time\n\nimport redis\n\nHOST = socket.gethostname()\nr = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)\n\nwhile True:\n    # BRPOP waits up to 5 s for an item in the queue; returns None if nothing arrived\n    item = r.brpop("fila:pedidos", timeout=5)\n    if item is None:\n        continue\n    _, pedido = item  # item comes as (queue_name, value)\n    print(f"[{HOST}] processando pedido {pedido}", flush=True)\n    time.sleep(1)  # simulates invoice and e-mail: 1 s of heavy work\n    print(f"[{HOST}] pedido {pedido} concluido", flush=True)',
        note: "Replace `app/Dockerfile`:",
      },
      {
        label: "Dockerfile",
        lang: "sh",
        code: 'FROM python:3.12-alpine\nWORKDIR /srv\n# Python client for Redis (pure library, installs without compiling)\nRUN pip install --no-cache-dir redis\n# Now the image carries the application and the worker\nCOPY app.py worker.py ./\nEXPOSE 8080\nCMD ["python", "-u", "app.py"]',
        note: "Create the stage folder:",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ mkdir -p etapa-03/nginx && cd etapa-03",
        note: "`docker-compose.yml`:",
      },
      {
        label: "stateful vs stateless cart, and queue with workers (3)",
        lang: "yaml",
        code: 'name: lab-etapa-03\n\nservices:\n  app:\n    build: ../app\n    image: lab-app\n    environment:\n      MODO: ${MODO:-memoria}      # reads MODO from the shell; if it does not exist, uses "memoria"\n      REDIS_HOST: redis           # name of the Redis service on the Compose network\n    deploy:\n      replicas: 3                 # three API replicas\n  redis:\n    image: redis:7-alpine         # shared state and queue\n  worker:\n    build: ../app\n    image: lab-app\n    command: ["python", "-u", "worker.py"]   # same image, different command\n    environment:\n      REDIS_HOST: redis\n    depends_on:\n      - redis\n    restart: on-failure           # if Redis was not ready yet, tries again\n    deploy:\n      replicas: 0                 # starts off; we turn it on in the queue experiment\n  lb:\n    image: nginx:1.27-alpine\n    ports:\n      - "8080:80"\n    volumes:\n      - ./nginx:/etc/nginx/conf.d:ro\n    depends_on:\n      - app',
        note: "`nginx/default.conf`:",
      },
      {
        label: "stateful vs stateless cart, and queue with workers (4)",
        lang: "sh",
        code: "upstream backend {\n    zone backend 64k;             # round-robin state shared among the Nginx worker processes\n    server app:8080;              # the 3 replicas, in round-robin\n}\n\nserver {\n    listen 80;\n    location / {\n        proxy_pass http://backend;\n        proxy_set_header X-Request-ID $request_id;   # passes along a unique request ID\n        proxy_connect_timeout 1s;                    # gives up quickly on a replica that does not respond\n        proxy_next_upstream error timeout;           # on error or timeout, tries the next replica\n    }\n}",
      },
      {
        label: "a Kubernetes ReplicaSet",
        lang: "yaml",
        code: "apiVersion: apps/v1          # API version of the ReplicaSet\nkind: ReplicaSet             # resource type\nmetadata:\n  name: carrinho             # name of the ReplicaSet\nspec:\n  replicas: 3                # how many copies of the Pod must always exist\n  selector:\n    matchLabels:\n      app: carrinho          # which Pods belong to this ReplicaSet\n  template:                  # template for the Pods created\n    metadata:\n      labels:\n        app: carrinho        # the label the selector looks for\n    spec:\n      containers:\n        - name: carrinho\n          image: nginx:1.27-alpine   # container image\n          ports:\n            - containerPort: 80",
        intro: 'The ReplicaSet describes "how many copies of which Pod must always exist":',
      },
    ],
    commands: [
      {
        cmd: "export MODO=redis",
        note: "(or `memoria`): chooses the API mode before bringing up the stack",
      },
      {
        cmd: "docker compose up -d --scale worker=N",
        note: "adjusts the number of workers without touching the API",
      },
      {
        cmd: "docker compose exec redis redis-cli LRANGE carrinho:ana 0 -1",
        note: "lists the cart stored in Redis",
      },
      {
        cmd: "docker compose exec redis redis-cli LLEN fila:pedidos",
        note: "shows the queue size",
      },
      {
        cmd: "docker compose exec -T ...",
        note: "runs without an interactive terminal, to capture the output in a script",
      },
      {
        cmd: "docker compose logs -f worker",
        note: "follows the workers' work (Ctrl+C to exit)",
      },
    ],
    handsOn: [
      "**Lab**",
      "**1. The problem: stateful cart.**",
      '```sh\nexport MODO=memoria\ndocker compose up -d --build\n\n# Three items, one per request; the LB distributes among the replicas\nfor i in 1 2 3; do curl -s -X POST "localhost:8080/carrinho?user=ana&item=item$i"; done\n# Now reads the cart three times\nfor i in 1 2 3; do curl -s "localhost:8080/carrinho?user=ana"; done\n```',
      "Expected (IDs and order vary):",
      '```text\n{"servidor": "aaa111", "modo": "memoria", "user": "ana", "itens": ["item1"]}\n{"servidor": "bbb222", "modo": "memoria", "user": "ana", "itens": ["item2"]}\n{"servidor": "ccc333", "modo": "memoria", "user": "ana", "itens": ["item3"]}\n```',
      "Each response has **only one item**. Ana's cart is spread across three memories and no replica sees it whole. This is the problem of state tied to the server. (The `zone` in the `upstream` makes the Nginx workers share the round-robin, so the six requests go through the three replicas in order and each read lands on the replica that received the corresponding item.)",
      "**2. The solution: state in Redis.**",
      '```sh\ndocker compose down\nexport MODO=redis\ndocker compose up -d\nfor i in 1 2 3; do curl -s -X POST "localhost:8080/carrinho?user=ana&item=item$i"; done\nfor i in 1 2 3; do curl -s "localhost:8080/carrinho?user=ana"; done\ndocker compose exec redis redis-cli LRANGE carrinho:ana 0 -1\n```',
      'Expected: the three responses show `"itens": ["item1", "item2", "item3"]`, coming from different servers, and `redis-cli` lists:',
      '```text\n1) "item1"\n2) "item2"\n3) "item3"\n```',
      "**3. Failover without losing the cart.**",
      '```sh\ndocker stop $(docker compose ps -q app | head -n 1)\ncurl -s "localhost:8080/carrinho?user=ana"\n```',
      "Expected: the cart is still complete. It may take up to about 1 second if the request lands on the stopped replica: open-source Nginx only notices the failure when it tries, and `proxy_connect_timeout 1s` limits the wait before it moves to another replica. Bring the replica back and refresh Nginx, which resolves names only at startup (the replica may come back with another IP):",
      "```sh\ndocker compose up -d\ndocker compose exec lb nginx -s reload\n```",
      "**4. Queue and workers.** The order returns fast and the heavy work happens later:",
      '```sh\n# Turns on 1 worker (MODO stays exported, so the API is not recreated in another mode)\ndocker compose up -d --scale worker=1\n\n# Enqueues 12 orders; each response arrives immediately with 202\nfor i in $(seq 1 12); do curl -s -o /dev/null -w "%{http_code} %{time_total}s\\n" -X POST "localhost:8080/pedido?id=$i"; done\n\n# Queue size\ndocker compose exec redis redis-cli LLEN fila:pedidos\n```',
      "Expected: twelve lines like `202 0.00xs` and an `(integer) N` with N between 1 and 11, because the worker is already consuming. Watch the worker working (Ctrl+C to exit):",
      "```sh\ndocker compose logs -f worker\n```",
      "Expected output (shortened):",
      "```text\nlab-etapa-03-worker-1  | [9f8e7d6c5b4a] processando pedido 1\nlab-etapa-03-worker-1  | [9f8e7d6c5b4a] pedido 1 concluido\n```",
      "**5. Scale the workers by queue size.** Wait for the previous step's queue to empty (`LLEN` equal to `0`, about 12 s) so the measurement does not add old orders. Then measure the time to empty the queue with 1 worker and with 3:",
      '```sh\n# With 1 worker (12 orders of 1 s: near 12 s)\nfor i in $(seq 1 12); do curl -s -o /dev/null -X POST "localhost:8080/pedido?id=$i"; done\ntime { while [ "$(docker compose exec -T redis redis-cli LLEN fila:pedidos | tr -d \'\\r\')" != "0" ]; do sleep 0.5; done; }\n\n# With 3 workers (near 4 s)\ndocker compose up -d --scale worker=3\nfor i in $(seq 1 12); do curl -s -o /dev/null -X POST "localhost:8080/pedido?id=$i"; done\ntime { while [ "$(docker compose exec -T redis redis-cli LLEN fila:pedidos | tr -d \'\\r\')" != "0" ]; do sleep 0.5; done; }\n```',
      "The workers scaled **independently of the API**, and it was the queue size that justified the scaling. This is the idea of KEDA.",
      "**Exercises**",
      "Exercises 1 and 3 need the stack running: `export MODO=redis` in exercise 1 and `export MODO=memoria` in exercise 3. To switch modes, run `docker compose down`, export the new value and `docker compose up -d`.",
      "1. **KEDA by hand.** Suppose each worker processes 1 order per second and you want to empty the queue within 4 seconds. Write the formula for the number of workers as a function of `LLEN` (round up) and test it with `--scale`. *Expected answer:* `workers = ceil(LLEN / 4)`, because each worker handles 4 orders in 4 seconds. In Bash, `n=$(( (LLEN + 3) / 4 ))`. With `LLEN` equal to 12, that is 3 workers (`docker compose up -d --scale worker=3`) and the queue empties in about 4 seconds. This is the logic KEDA automates.",
      '2. **Retry with exponential backoff.** Run the script below against a port where nothing is listening. During the wait, in another terminal, start `docker run -d --rm -p 9999:8080 lab-app` and watch the script succeed.\n```sh\nfor tentativa in 1 2 3 4 5; do\n  # --fail treats an HTTP error as a failure; --max-time 2 limits the wait of each attempt\n  if curl -sf --max-time 2 -o /dev/null http://localhost:9999/health; then\n    echo "ok na tentativa $tentativa"; break\n  fi\n  espera=$((2 ** (tentativa - 1)))   # waits 1, 2, 4, 8, 16 seconds\n  echo "tentativa $tentativa falhou, esperando ${espera}s"\n  sleep "$espera"\ndone\n```\n*Expected answer:* lines like `tentativa 1 falhou, esperando 1s`, `tentativa 2 falhou, esperando 2s`, and so on, until `ok na tentativa N` appears on the first attempt after the container starts. The interval doubles with each failure, so the script keeps trying without hammering the service. If you do not start the container, all five attempts fail and the script ends without the `ok` line. At the end, stop the test container with `docker stop $(docker ps -q --filter publish=9999)`.',
      '3. **Sticky session, the patch.** With the stack in `MODO=memoria`, add `ip_hash;` to the `upstream backend` in `nginx/default.conf` (right below the line `upstream backend {`), run `docker compose exec lb nginx -s reload` and repeat the cart test from step 1 with a new user (for example, `user=bia`). Does it work? Now take down the replica that served (the `"servidor"` field of the response is the container\'s short ID: `docker stop ID`) and read the cart again. What happened, and why does this limit resilience? *Expected answer:* with `ip_hash`, all requests from your client (always the same IP) land on the same replica, so the three reads show `["item1", "item2", "item3"]`, always with the same `"servidor"`: the patch works as long as that replica lives. After `docker stop`, the next read is diverted to another replica (possibly with about 1 s of waiting) and comes back with `"itens": []`. The cart lived in the memory of the replica that went down and died with it. Sticky session does not take the state out of the server, it only hides the problem: the failure of one instance still loses the data of the clients tied to it, and the load is distributed by IP, not by capacity. When done, delete the `ip_hash;` line, run `docker compose up -d` to recreate the replica and `docker compose exec lb nginx -s reload`.',
      "4. **ReplicaSet (reading).** In the YAML of the second worked example, map each field to Compose: which is the `replicas`, which is the image, and what has no direct equivalent? *Expected answer:* `spec.replicas: 3` corresponds to `deploy.replicas: 3`; the `image` inside `template.spec.containers` corresponds to the service's `image:`; the whole `template` is the mold, like the definition of a service in Compose; `metadata.name` plays the role of the service name; `containerPort: 80` documents the port, like the Dockerfile's `EXPOSE`. The `selector` with `matchLabels` has no equivalent that you write in Compose: there the replicas are grouped by the service name, while in Kubernetes the ReplicaSet finds \"its\" Pods by the label `app: carrinho`.",
      "**Cleanup (when you finish the lab and the exercises):**",
      "```sh\ndocker compose down -v\nunset MODO\ncd ..\n```",
    ],
    handsOnRich: true,
    tip: "To find out whether an application is stateless, run this lab's test: write something in one request, take down the replica that served and read in the next one. If the data vanished, there is state tied to the process, and no adjustment to the load balancer will fix that.",
    takeaway:
      "If the state lives on the server, the server cannot die or be replaced; take the state out (Redis, database) and take slow work out of the response path (queue and workers).",
    figures: [
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa03-stateful-stateless.en.svg",
            alt: "Two frames. With MODO=memoria, each replica (app-1, app-2, app-3) holds a different item in memory, so each cart read sees only one item. With MODO=redis, the stateless replicas read and write ana's cart in redis, and any replica returns all 3 items.",
            caption: "The state moved out of the servers, so any replica can answer any request.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa03-fila-workers.en.svg",
            alt: "Producer, queue and workers: the client sends POST /pedido to app, which enqueues the order in redis and returns 202 at once; the worker consumes the queue and processes each order in 1 s.",
            caption:
              "The 202 response does not wait for the heavy work, and the number of workers changes the total time without touching the API.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa03-nivelamento-fila.png",
            alt: "Several tasks send requests at an irregular rate into a message queue; on the other side, a service consumes the messages at a steady rate. Two bar charts show the irregular arrivals and the steady processing.",
            caption:
              "The queue absorbs the peak: arrivals are irregular, but the service consumes at a pace it can handle. That is the role of redis between the API and the worker in the lab.",
          },
        ],
        credit: "Diagram: Azure Architecture Center, Microsoft, CC BY 4.0",
      },
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa03-consumidores-concorrentes.png",
            alt: "Several application instances generate messages into a single queue, and a pool of consumer instances, inside a circle, takes messages from that same queue.",
            caption:
              "Competing consumers: several workers read from the same queue and each message is handled by only one. To scale processing, you grow the pool, as with `--scale worker=3`.",
          },
        ],
        credit: "Diagram: Azure Architecture Center, Microsoft, CC BY 4.0",
      },
    ],
  },
  {
    id: "m4",
    num: "04",
    navTitle: "CDN",
    tag: "edge caching",
    title: "CDNs and global performance",
    lead: "Your servers are in Brazil and work well for local users. But a customer in Lisbon, Tokyo or New York suffers from the latency imposed by distance and undersea cables: hundreds of milliseconds before processing even begins. No powerful server beats physics, because latency depends on the speed of light and the distance. The way out is to bring the content closer to the user, and that is what a CDN (Content Delivery Network) does. It is also a layer of security and scalability, because most requests never reach your origin.",
    concept: [
      "A CDN is a global network of proxy servers installed at internet exchange points (IXPs), called **PoPs** (Points of Presence) or **Edge Locations**, which keep copies of the content close to the user. The server where the original content lives is the **origin**.",
      "**How it works:**",
      "1. **Geolocation via DNS.** The DNS query goes to the CDN's smart DNS, which identifies the location by the IP and returns the IP of the nearest PoP, instead of the origin's IP.",
      "1. **Edge caching.** The PoP (for example, Paris) checks the local cache. The first time there is a **Cache Miss**: it fetches from the origin in Brazil, delivers and keeps a copy. The next user in the region gets a **Cache Hit**, served instantly from the edge.",
      '**Cache control.** Who decides how long a copy is valid is the origin, through the `Cache-Control` header. `max-age` defines the TTL in seconds: `Cache-Control: public, max-age=3600` keeps it for one hour. Once expired, the file becomes *stale* and is revalidated with the origin; if it has not changed, the origin answers `304 Not Modified` and the CDN renews the TTL without downloading the file again. To ask "did it change?", the `ETag` is used, an identifier of the file version, sent back in the `If-None-Match` header.',
      "**Invalidation (purging).** It is forcibly removing files from all caches, through a panel or API (for example, for an urgent bug fix in a JavaScript file). Use it with judgment: it can cost money and reduces cache efficiency.",
      "**Beyond static assets.** CDNs also scale APIs: GET responses that change little (a product catalog) can be cached at the edge, relieving the application and the database. Players cited: Amazon CloudFront, Akamai and Fastly.",
      "**Security and performance at the edge:**",
      "- **WAF** integrated into the CDN blocks SQL Injection and XSS at the edge.",
      "- **TLS Offload:** the CDN performs the TLS handshake (CPU-expensive) on the optimized edge servers and keeps an optimized secure connection to the origin.",
      "**Infrastructure and observability.** CDNs use BGP to announce the most efficient routes to their PoPs and peering agreements (direct connections with large providers) to reduce hops. The main metrics are the **Cache Hit Ratio** (the most important), bandwidth savings, response latency and error rate.",
      "**In the market (according to the material):** Fortnite and League of Legends patches (tens of GB) are pre-positioned at the PoPs days before launch. Edge Computing (AWS Lambda@Edge, Cloudflare Workers) runs code at the PoPs: rendering, A/B tests, image manipulation, authentication at the edge. Dynamic Content Acceleration (Akamai, Fastly) speeds up even non-cacheable content with TCP/IP optimization and smart routing (BGP and peering).",
      '**How the lab fits in.** A real CDN has hundreds of PoPs, but the mechanism of one PoP is a proxy with a cache. We will set up two Nginx instances: the **origin** (which defines the `Cache-Control`) and the **edge** (which caches and reports the result in the `X-Cache` header). In CloudFront, the *Origin* is the origin, the *Behavior* is the rule for handling and cache time by request type, and the domain provided by the CDN is the edge. The lesson also uses the browser\'s developer tools as a "performance detective"; here the detective is `curl`.',
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "CDN, PoP and origin",
        d: "network of caching proxies close to the user, in front of the original server.",
        color: "blue",
      },
      {
        t: "Smart DNS",
        d: "returns the IP of the PoP closest to the user.",
        color: "signal",
      },
      {
        t: "Cache miss and cache hit",
        d: "the edge had to go to the origin, or answered with the stored copy.",
        color: "violet",
      },
      {
        t: "`Cache-Control` and `max-age`",
        d: "the origin defines whether and for how long the response can be stored.",
        color: "ember",
      },
      {
        t: "`ETag`, `If-None-Match` and `304`",
        d: "revalidation without downloading the file again.",
        color: "blue",
      },
      {
        t: "Invalidation (purge)",
        d: "erasing copies before the TTL; useful, but generates new misses.",
        color: "signal",
      },
      {
        t: "Cache hit ratio",
        d: "`hits / (hits + misses)`, the main metric of a CDN.",
        color: "violet",
      },
      {
        t: "WAF and TLS offload",
        d: "security and encryption handled at the edge.",
        color: "ember",
      },
    ],
    examplesTitle: "Origin and edge",
    examples: [
      {
        label: "terminal",
        lang: "sh",
        code: "$ mkdir -p etapa-04/origem etapa-04/edge etapa-04/site/estatico && cd etapa-04\n$ echo 'console.log(\"v1\");' > site/estatico/app.js\n$ echo '<h1>Loja</h1>' > site/index.html",
        note: "`docker-compose.yml`:",
      },
      {
        label: "origin and edge",
        lang: "yaml",
        code: 'name: lab-etapa-04\n\nservices:\n  origem:\n    image: nginx:1.27-alpine\n    ports:\n      - "8082:80"                         # we expose the origin to compare with the edge\n    volumes:\n      - ./origem:/etc/nginx/conf.d:ro     # origin configuration\n      - ./site:/usr/share/nginx/html:ro   # files served\n  edge:\n    image: nginx:1.27-alpine\n    ports:\n      - "8081:80"                         # the "CDN" the user accesses\n    volumes:\n      - ./edge:/etc/nginx/conf.d:ro\n    depends_on:\n      - origem',
        note: "`origem/default.conf`:",
      },
      {
        label: "origin and edge (2)",
        lang: "sh",
        code: 'server {\n    listen 80;\n    root /usr/share/nginx/html;                 # where the files live\n\n    location /estatico/ {\n        # TTL of 10 s (short on purpose, so you can see the expiry)\n        add_header Cache-Control "public, max-age=10";\n    }\n\n    location /api/ {\n        default_type application/json;\n        # API without Cache-Control: the edge must not cache\n        return 200 \'{"produtos": ["camiseta", "caneca"]}\';\n    }\n}',
        note: "`edge/default.conf`:",
      },
      {
        label: "origin and edge (3)",
        lang: "sh",
        code: '# Cache area: folder on disk, metadata zone "edge" of 10 MB, up to 100 MB of content\nproxy_cache_path /var/cache/nginx/edge levels=1:2 keys_zone=edge:10m max_size=100m inactive=10m;\n\nserver {\n    listen 80;\n    location / {\n        proxy_pass http://origem:80;                   # the origin\n        proxy_cache edge;                              # uses the cache area above\n        proxy_cache_revalidate on;                     # on expiry, asks the origin (If-None-Match) instead of downloading again\n        add_header X-Cache $upstream_cache_status always;   # HIT, MISS, EXPIRED, REVALIDATED...\n    }\n}',
        note: "Nginx respects the `Cache-Control: max-age` coming from the origin to decide the TTL. Responses with neither `Cache-Control` nor `Expires` are not cached, unless you configure `proxy_cache_valid`.",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "$ docker compose up -d",
      },
    ],
    commands: [
      {
        cmd: "curl -sI URL",
        note: "shows only the response headers (HEAD method)",
      },
      {
        cmd: "curl -s -D - -o /dev/null URL",
        note: "makes a GET and prints the headers, discarding the body",
      },
      {
        cmd: 'curl -sI -H "If-None-Match: $ETAG" URL',
        note: "asks the origin whether the version changed",
      },
      {
        cmd: "... | tr -d '\\r' | grep -i '^x-cache'",
        note: "filters the header that says whether the response came from the cache",
      },
      {
        cmd: "docker compose logs origem | grep 'app.js'",
        note: "shows how many times the origin was actually queried",
      },
      {
        cmd: "docker compose exec origem nginx -s reload",
        note: "applies changes to the origin configuration",
      },
    ],
    handsOn: [
      "**Lab**",
      "**1. Performance detective at the origin.** Inspect the headers:",
      "```sh\ncurl -sI http://localhost:8082/estatico/app.js\n```",
      "Expected (shortened):",
      '```text\nHTTP/1.1 200 OK\n...\nETag: "6650a1b2-14"\nCache-Control: public, max-age=10\n```',
      '**2. The 304 happening.** Get the ETag and ask "did it change?":',
      "```sh\nETAG=$(curl -sI http://localhost:8082/estatico/app.js | tr -d '\\r' | awk 'tolower($1)==\"etag:\" {print $2}')\ncurl -sI -H \"If-None-Match: $ETAG\" http://localhost:8082/estatico/app.js\n```",
      "Expected: `HTTP/1.1 304 Not Modified`, with no body. The server confirmed the copy is still valid without resending the file.",
      "**3. Miss and hit at the edge.**",
      "```sh\nfor i in 1 2 3; do curl -s -D - -o /dev/null http://localhost:8081/estatico/app.js | tr -d '\\r' | grep -i '^x-cache'; done\n```",
      "Expected:",
      "```text\nX-Cache: MISS\nX-Cache: HIT\nX-Cache: HIT\n```",
      "**4. Cache Hit Ratio.** Twenty requests and the count:",
      "```sh\nfor i in $(seq 1 20); do curl -s -D - -o /dev/null http://localhost:8081/estatico/app.js | tr -d '\\r' | grep -i '^x-cache'; done | sort | uniq -c\n```",
      "Expected: `20 X-Cache: HIT` if you ran it right after step 3 (within the 10 s TTL). If more than 10 s have passed, the result is `1 X-Cache: REVALIDATED` and `19 X-Cache: HIT`: the edge already has the copy, so the first response after the TTL revalidates with the origin, and `MISS` does not appear (`MISS` only happens when the edge has nothing stored, as in step 3). Count the `REVALIDATED` as a trip to the origin: the hit ratio is 20 of 20 (100%) or 19 of 20 (95%). Confirm that the origin was barely bothered:",
      "```sh\ndocker compose logs origem | grep 'app.js' | wc -l\n```",
      "Expected: `4` or `5`. The math is this:",
      "- 3 lines from the `curl -sI` you sent straight to the origin, on port 8082 (one in step 1 and two in step 2);",
      "- 1 line from the edge, the `MISS` of step 3;",
      "- plus 1 line only if the TTL expired and there was a revalidation (the `304`).",
      "What matters: of the 20 requests in this step, the origin saw at most one.",
      "**5. Expiry and revalidation.** Wait for the TTL to pass and ask again:",
      "```sh\nsleep 11\ncurl -s -D - -o /dev/null http://localhost:8081/estatico/app.js | tr -d '\\r' | grep -i '^x-cache'\ndocker compose logs origem | grep 'app.js' | tail -n 3\n```",
      'Expected: `X-Cache: REVALIDATED` and, in the origin logs, a line with `304`. The edge asked, the origin answered "not changed" and the TTL was renewed without transferring the file.',
      "**6. A file that changed: expires and downloads again.**",
      "```sh\necho 'console.log(\"v2\");' > site/estatico/app.js\ncurl -s http://localhost:8081/estatico/app.js      # still v1, within the TTL\nsleep 11\ncurl -s -D - http://localhost:8081/estatico/app.js | tr -d '\\r' | grep -iE '^x-cache|console'\n```",
      'Expected: the first call shows `console.log("v1");` (edge copy, still valid). After the TTL, `X-Cache: EXPIRED` and `console.log("v2");` appear. Between the change and the end of the TTL, users saw the old version: this is the staleness window that every TTL accepts. If the first call already shows `v2`, the TTL from the previous step had expired; repeat the step with a new edit.',
      '**7. Simulated invalidation (purge).** Open-source Nginx has no purge API; we simulate it by erasing the cache. First fill the cache, then "invalidate":',
      "```sh\necho 'console.log(\"v3\");' > site/estatico/app.js\ncurl -s http://localhost:8081/estatico/app.js        # v2 or v3, depending on the cache state\ndocker compose exec edge sh -c 'rm -rf /var/cache/nginx/edge/*'\ndocker compose restart edge\ncurl -s -D - http://localhost:8081/estatico/app.js | tr -d '\\r' | grep -iE '^x-cache|console'\n```",
      'Expected: `X-Cache: MISS` and `console.log("v3");`, right away, without waiting for the TTL. A real CDN does this through an API or panel, and that is why invalidating too much costs efficiency: each purge forces a new miss.',
      "**Exercises**",
      "Exercises 1 and 2 need the stack running. After editing `origem/default.conf`, run `docker compose exec origem nginx -s reload`.",
      '1. **Cache the API.** In `origem/default.conf`, add `add_header Cache-Control "public, max-age=60";` in the `location /api/` and reload. Make 10 calls to `localhost:8081/api/produtos` before and after the change, looking at `X-Cache`. What changes? What kind of API response is safe to cache this way? *Expected answer:* before, the 10 calls show as `MISS`, because the response carries no `Cache-Control` and the edge does not store it (the origin is queried every time); after, the first is `MISS` and the next 9 are `HIT` (within the 60 s). It is safe for public GET responses, equal for all users and that change little, like the product catalog; it does not suit personalized responses.',
      "2. **When not to cache.** Change the value to `Cache-Control \"private, no-store\"`. Does `X-Cache` go back to `HIT`? Why should a logged-in user's data not stay on a shared edge? *Expected answer:* no. After the 60 s copy from the previous exercise expires (or is erased, as in step 7), the calls go back to `MISS`, because `no-store` forbids the edge from storing the response. A logged-in user's data on a shared edge could be delivered to another person, and `private` indicates that only the user's own browser may store it.",
      "3. **How much to cache?** For each item, choose a TTL and justify it: company logo, versioned JavaScript bundle, product catalog, user's bank balance. *Expected answer (examples):* company logo, long TTL (days), because it almost never changes; versioned JavaScript bundle, very long TTL (months), because the file name changes with each version and the copy is never stale; product catalog, short TTL (seconds to a few minutes), accepting a small staleness; bank balance, do not cache (`private, no-store`), because it is personal data and changes all the time.",
      "4. **Conceptual.** Explain, in three sentences, why the CDN's smart DNS makes the user in Lisbon talk to the Paris PoP and not to the server in Brazil. *Expected answer:* when the browser asks for the site's address, the query reaches the CDN's smart DNS. That DNS identifies the user's location by the IP and returns the IP of the nearest PoP (Paris), instead of the origin's IP. The browser then connects to that PoP, which answers from the cache (hit) and only goes to Brazil if it does not have the copy (miss).",
      "**Cleanup (when you finish the lab and the exercises):**",
      "```sh\ndocker compose down -v\ncd ..\n```",
    ],
    handsOnRich: true,
    tip: "For static files, prefer versioned names (for example, `app.3f9c.js`) with a long TTL over short TTLs with frequent purges. When the content changes, the name changes, and the old copy simply stops being requested, with no invalidation and no staleness window.",
    takeaway:
      "The CDN is cache close to the user; what rules it is the origin's `Cache-Control`, and the metric that matters is the Cache Hit Ratio.",
    figures: [
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa04-miss-hit.en.svg",
            alt: "Three scenarios between the user, edge on port 8081 and origem on port 8082. On the first request the edge fetches from the origin and answers X-Cache: MISS. Within the 10 s TTL it answers alone with HIT. After the TTL it asks with If-None-Match, the origin answers 304 and the result is REVALIDATED.",
            caption:
              "Only the MISS and the revalidation reach the origin; the HIT is resolved at the edge.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa04-cdn-latencia.png",
            alt: "Two clients request an image. The direct path to the origin takes 120 ms; the path to the CDN, which keeps a copy of the image, takes 40 ms.",
            caption:
              "The edge is closer to the user than the origin. When the copy is in the CDN, the response arrives in a fraction of the time and the origin is not even queried.",
          },
        ],
        credit: "Diagram: Azure Architecture Center, Microsoft, CC BY 4.0",
      },
    ],
  },
  {
    id: "m5",
    num: "05",
    navTitle: "Databases",
    tag: "replicas + cache + CAP",
    title: "Database scalability",
    lead: 'The application is scaled, there is a load balancer and there is a CDN. But almost every relevant action (purchase, post, search) reads or writes data, and everything points to a single place: the database, the hardest part to scale. It is stateful and needs consistency, so you cannot simply "turn on three more" as we did with the API: three independent databases would have three versions of the stock. On a Black Friday, the overloaded relational database is usually exactly the point that takes everything down.',
    concept: [
      "**The three challenges:**",
      "- **Consistency:** an atomic transaction, and subsequent reads seeing the correct result.",
      "- **Concurrency:** multiple simultaneous accesses without corrupting data.",
      "- **Latency:** fast operations even with more volume.",
      "**Scaling reads.** The read-to-write ratio is usually high (for example, 100 to 1). Two tools:",
      "1. **Caching** (Redis, Memcached) between the application and the database: the first line of defense. The **cache-aside** pattern works like this: the application tries the cache; on a *miss*, it fetches from the database and writes to the cache before returning.",
      "1. **Read Replicas:** primary-replica model (formerly called master-slave). The primary receives all writes (INSERT, UPDATE, DELETE) and replicates them, usually asynchronously, to read-only replicas. The application implements **write splitting**: writes to the primary, reads distributed among the replicas.",
      "**Scaling writes.** Even with replicas, all writes still go to one server. The solution is **sharding** (horizontal partitioning): the data is split among smaller, independent databases, each responsible for a part.",
      "- **By range** (A to M in shard 1, N to Z in shard 2): simple, but creates *hotspots* if the distribution is not uniform.",
      "- **By hash** (hash of the user ID): a more even distribution, but makes range queries harder.",
      "The complexity is immense, especially in **re-sharding** (changing the number of shards and redistributing the data).",
      '**Distributed databases.** Amazon DynamoDB (NoSQL), CockroachDB (NewSQL) and Apache Cassandra (NoSQL) do sharding and replication transparently. In DynamoDB, the lesson\'s demonstration configures "read and write capacity units", that is, you declare how much read and write you expect.',
      "**CAP theorem (Eric Brewer).** Three properties of a distributed system:",
      "- **Consistency:** all nodes see the same data.",
      "- **Availability:** every request receives a response, with no guarantee that it is the most recent write.",
      "- **Partition Tolerance:** the system operates even with a communication break between nodes.",
      "Since network partitions are inevitable, the real choice is what to do during one: prioritize consistency (CP) or availability (AP). Traditional relational databases tend toward CP; Cassandra chooses AP, which leads to **Eventual Consistency**: without new writes, the replicas converge, but for a while different nodes may return different values.",
      "**Strategy and resilience.** Scaling vertically may still be the simplest and most effective up to a point; horizontal scaling is more complex, with a higher ceiling and more resilience. Automated **failover** promotes a replica to primary when the primary goes down. Two numbers defined by the business guide the design:",
      "- **RPO (Recovery Point Objective):** how much data loss is tolerable. An RPO of 5 minutes means accepting the loss of the last 5 minutes of transactions.",
      "- **RTO (Recovery Time Objective):** how long the system can be down. An RTO of 15 minutes means detection, failover and return must take less than 15 minutes.",
      "They dictate the choice between synchronous and asynchronous replication and the level of failover automation.",
      "**In the market (according to the material):** Google Spanner delivers strong global consistency with high availability using atomic clocks, and CockroachDB brings that idea to the market without Google's hardware. Serverless databases (Aurora Serverless, MongoDB Atlas Serverless, Neon for Postgres) separate compute from storage and scale down to zero. HTAP (SingleStore, TiDB) unites OLTP and OLAP in one system, avoiding ETL and allowing real-time analysis.",
      "**How the lab fits in.** On Amazon RDS, creating a Read Replica takes a few clicks and AWS manages the asynchronous replication. Here you will do by hand, with Postgres, what RDS hides: a replica via asynchronous *streaming replication*. You will also apply cache-aside with Redis.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Cache-aside",
        d: "cache first; on a miss, database, and write to the cache before answering.",
        color: "blue",
      },
      {
        t: "Primary and read replica",
        d: "one node accepts writes; the replicas, only reads.",
        color: "signal",
      },
      {
        t: "Asynchronous replication",
        d: "the primary does not wait for the replica; it may fall a little behind.",
        color: "violet",
      },
      {
        t: "Write splitting",
        d: "the application sends writes to the primary and reads to the replicas.",
        color: "ember",
      },
      {
        t: "Sharding by range and by hash",
        d: "splitting the data to scale writes; range suffers from hotspots, hash makes range queries harder.",
        color: "blue",
      },
      {
        t: "Re-sharding",
        d: "changing the number of shards forces data to move.",
        color: "signal",
      },
      {
        t: "CAP and eventual consistency",
        d: "during a partition, you choose between consistency and availability.",
        color: "violet",
      },
      {
        t: "Failover, RPO and RTO",
        d: "promoting a replica; how much data you accept losing and how long you accept being down.",
        color: "ember",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "terminal",
        lang: "sh",
        code: "$ mkdir -p etapa-05 && cd etapa-05",
        note: "`init-primary.sh` (runs once, when the primary is created):",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: '#!/bin/bash\n# Creates the user the replica will use to copy the data\npsql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -c "CREATE ROLE replicador WITH REPLICATION LOGIN PASSWORD \'replica123\';"\n# Allows replication connections coming from other containers\necho "host replication replicador all scram-sha-256" >> "$PGDATA/pg_hba.conf"',
        note: "`replica.sh` (replaces the replica's entrypoint):",
      },
      {
        label: "terminal (3)",
        lang: "sh",
        code: '#!/bin/bash\nset -e\n# Only does the initial copy if the data directory is still empty\nif [ ! -s "$PGDATA/PG_VERSION" ]; then\n  chmod 700 "$PGDATA"   # Postgres requires restricted permission on the data directory\n  # -R writes the standby configuration; -X stream also copies the WAL in real time\n  # the password comes from the PGPASSWORD variable\n  pg_basebackup -h primary -U replicador -D "$PGDATA" -R -X stream\nfi\n# Starts Postgres; because of -R, it comes up as a read-only replica\nexec postgres',
        note: "`docker-compose.yml`:",
      },
      {
        label: "Postgres primary + replica + Redis",
        lang: "yaml",
        code: 'name: lab-etapa-05\n\nservices:\n  primary:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: senha123       # password of the postgres superuser\n    volumes:\n      - ./init-primary.sh:/docker-entrypoint-initdb.d/init-primary.sh:ro\n    healthcheck:\n      # -h 127.0.0.1 forces TCP: during initialization, the temporary server only listens on the local socket,\n      # so this test only passes when the final server is up\n      test: ["CMD-SHELL", "pg_isready -U postgres -h 127.0.0.1"]\n      interval: 2s\n      timeout: 2s\n      retries: 30\n  replica:\n    image: postgres:16\n    user: postgres                      # Postgres does not run as root\n    environment:\n      PGPASSWORD: replica123            # password of the replicador user\n    volumes:\n      - ./replica.sh:/replica.sh:ro\n    entrypoint: ["bash", "/replica.sh"]\n    depends_on:\n      primary:\n        condition: service_healthy      # waits for the primary to become healthy\n  redis:\n    image: redis:7-alpine',
        note: "Bring it up and wait for the replica:",
      },
      {
        label: "terminal (4)",
        lang: "sh",
        code: "$ docker compose up -d\n$ docker compose logs replica | tail -n 5",
        note: "Expected at the end (it may take a few seconds): a line with `database system is ready to accept read only connections`.",
      },
      {
        label: "cache-aside in a script",
        lang: "sh",
        code: '#!/usr/bin/env bash\n# usage: bash cache-aside.sh <product id>\nchave="produto:$1"\n\n# 1. Tries the cache (-T turns off the interactive terminal to capture the output)\nvalor=$(docker compose exec -T redis redis-cli GET "$chave" | tr -d \'\\r\')\nif [ -n "$valor" ]; then\n  echo "HIT  $valor"\n  exit 0\nfi\n\n# 2. Miss: fetches from the database (from the replica, which serves reads)\nvalor=$(docker compose exec -T replica psql -U postgres -tA -c "SELECT nome FROM produtos WHERE id = $1" | tr -d \'\\r\')\nif [ -z "$valor" ]; then\n  echo "não encontrado"\n  exit 1\nfi\n\n# 3. Writes to the cache with a 30 s expiry (EX) before returning\ndocker compose exec -T redis redis-cli SET "$chave" "$valor" EX 30 > /dev/null\necho "MISS $valor"',
        intro: "Create `cache-aside.sh`, which will be used in step 6 of the lab:",
      },
    ],
    commands: [
      {
        cmd: 'psql -U postgres -c "SELECT pg_is_in_recovery();"',
        note: "`f` on the primary, `t` on a replica",
      },
      {
        cmd: "SELECT client_addr, state, sync_state FROM pg_stat_replication;",
        note: "on the primary, shows the connected replicas and whether replication is synchronous or asynchronous",
      },
      {
        cmd: "SELECT pg_wal_replay_pause();",
        note: "and `SELECT pg_wal_replay_resume();`: on the replica, pause and resume the application of changes",
      },
      {
        cmd: "SELECT pg_promote();",
        note: "promotes the replica to primary (manual failover)",
      },
      {
        cmd: "redis-cli GET",
        note: ", `SET chave valor EX 30`, `TTL` and `DEL`: read, write with expiry, check the expiry and invalidate a key",
      },
      {
        cmd: "docker network disconnect",
        note: "and `docker network connect`: simulate and undo a network partition",
      },
    ],
    handsOn: [
      "**Lab**",
      "**1. Who is who.**",
      '```sh\ndocker compose exec primary psql -U postgres -c "SELECT pg_is_in_recovery();"\ndocker compose exec replica psql -U postgres -c "SELECT pg_is_in_recovery();"\n```',
      "Expected: `f` on the primary and `t` on the replica (the replica is in recovery mode, that is, following the primary).",
      "**2. Replication is alive (and asynchronous).**",
      '```sh\ndocker compose exec primary psql -U postgres -c "SELECT client_addr, state, sync_state FROM pg_stat_replication;"\n```',
      "Expected:",
      "```text\n client_addr |   state   | sync_state\n-------------+-----------+------------\n 172.x.x.x   | streaming | async\n```",
      "**3. Write to the primary, read from the replica.**",
      "```sh\ndocker compose exec primary psql -U postgres -c \"CREATE TABLE produtos (id int primary key, nome text); INSERT INTO produtos VALUES (1,'Camiseta'),(2,'Caneca');\"\nsleep 1\ndocker compose exec replica psql -U postgres -c \"SELECT * FROM produtos;\"\n```",
      "Expected: both rows appear on the replica.",
      "**4. The replica does not accept writes.**",
      "```sh\ndocker compose exec replica psql -U postgres -c \"INSERT INTO produtos VALUES (9,'Intruso');\"\n```",
      "Expected: `ERROR:  cannot execute INSERT in a read-only transaction`. This is why the application needs write splitting.",
      "**5. Eventual consistency, live.** Pause the application of changes on the replica, write to the primary and compare:",
      '```sh\ndocker compose exec replica psql -U postgres -c "SELECT pg_wal_replay_pause();"\ndocker compose exec primary psql -U postgres -c "INSERT INTO produtos VALUES (3,\'Boné\');"\necho "primary:"; docker compose exec primary psql -U postgres -tA -c "SELECT count(*) FROM produtos;"\necho "réplica:"; docker compose exec replica psql -U postgres -tA -c "SELECT count(*) FROM produtos;"\n```',
      "Expected: `3` on the primary and `2` on the replica. Now resume:",
      '```sh\ndocker compose exec replica psql -U postgres -c "SELECT pg_wal_replay_resume();"\nsleep 1\ndocker compose exec replica psql -U postgres -tA -c "SELECT count(*) FROM produtos;"\n```',
      "Expected: `3`. For a while, two nodes answered different things and then converged: eventual consistency.",
      "**6. Cache-aside with Redis, reading from the replica.** Use the `cache-aside.sh` from the second worked example:",
      "```sh\nbash cache-aside.sh 1\nbash cache-aside.sh 1\nbash cache-aside.sh 1\ndocker compose exec redis redis-cli TTL produto:1\n```",
      "Expected: `MISS Camiseta`, then `HIT  Camiseta` twice, and an `(integer)` between 1 and 30 (the seconds of life left on the key).",
      "**7. The price of the cache: stale data.** The cache key lives only 30 s, so run this step right after step 6. If more time has passed, run `bash cache-aside.sh 1` before the `UPDATE` to repopulate the cache; otherwise the stale data does not appear (you would see `MISS Camiseta Azul` directly). Change the data and read again:",
      "```sh\ndocker compose exec primary psql -U postgres -c \"UPDATE produtos SET nome='Camiseta Azul' WHERE id=1;\"\nbash cache-aside.sh 1\n```",
      "Expected: `HIT  Camiseta`. The cache serves the old value until it expires. Invalidate when writing:",
      "```sh\ndocker compose exec redis redis-cli DEL produto:1\nsleep 1   # gives the replica time to receive the UPDATE (replication is asynchronous)\nbash cache-aside.sh 1\n```",
      "Expected: `MISS Camiseta Azul`. If `MISS Camiseta` appears, the read reached the replica before the change: this is the replication lag of eventual consistency. Repeat the `DEL` and the read. Whoever writes needs to invalidate the cache (or accept the TTL as the staleness window).",
      "**Exercises**",
      "Do the exercises in order: 2 and 3 change the lab's state.",
      '1. **Sharding by hash, and the cost of re-sharding.** Distribute 10 IDs into 2 shards by modulo (a very simple hash) and then see how many IDs change shard when moving to 3 shards:\n```sh\nfor id in $(seq 1 10); do echo "usuario $id -> shard $((id % 2))"; done\n\nmudou=0\nfor id in $(seq 1 1000); do\n  # compares the old shard (2 shards) with the new one (3 shards)\n  if [ $((id % 2)) -ne $((id % 3)) ]; then mudou=$((mudou + 1)); fi\ndone\necho "IDs que trocaram de shard: $mudou de 1000"\n```\nExpected: `IDs que trocaram de shard: 667 de 1000`. About two thirds of the data would need to migrate: this is the pain of re-sharding. Databases like Cassandra and DynamoDB do this work transparently. Question: and range sharding, what problem does it have? *Expected answer:* hotspots. As each shard receives a fixed range of values, if the data or the accesses are not evenly distributed across the ranges, one shard gets overloaded while the others sit idle. Two examples: in the A to M and N to Z split, names concentrated in certain letters weigh more on one side; in a split by range of increasing ID (or date), all new writes land on the last shard. In return, range makes range queries easy, which is precisely what hash makes hard.',
      '2. **Network partition (CAP in practice).** Disconnect the replica from the network, write to the primary and read from both sides:\n```sh\ndocker network disconnect lab-etapa-05_default $(docker compose ps -q replica)\ndocker compose exec primary psql -U postgres -c "INSERT INTO produtos VALUES (4,\'Chaveiro\');"\ndocker compose exec primary psql -U postgres -tA -c "SELECT count(*) FROM produtos;"\ndocker compose exec replica psql -U postgres -tA -c "SELECT count(*) FROM produtos;"\n```\nExpected: the primary with one more row than the replica. The replica **answered** (availability) with outdated data (no consistency). Reconnect with `docker network connect lab-etapa-05_default $(docker compose ps -q replica)` and wait up to about 1 minute: the old replication connection may hang until `wal_receiver_timeout` expires (60 s by default), and the replica may come back with another IP. To follow along, run `docker compose exec replica psql -U postgres -c "SELECT status FROM pg_stat_wal_receiver;"`; when replication returns, the status is `streaming`. Run the `count(*)` again and check that the numbers converge. Question: if your priority were consistency, what should the replica have done during the partition? *Expected answer:* choosing consistency (CP), the replica should refuse the read, returning an error or leaving rotation, while it could not confirm it is up to date with the primary; the price is availability during the partition. The lab showed the other side, the choice for availability (AP): the replica answered with what it had, and the nodes converged afterwards (eventual consistency).',
      '3. **Manual failover and the RTO.** Take down the primary and promote the replica:\n```sh\ndocker compose stop primary\ntime docker compose exec replica psql -U postgres -c "SELECT pg_promote();"\ndocker compose exec replica psql -U postgres -c "SELECT pg_is_in_recovery();"\ndocker compose exec replica psql -U postgres -c "INSERT INTO produtos VALUES (5,\'Adesivo\');"\n```\nExpected: `pg_promote` returns `t`, `pg_is_in_recovery` becomes `f` and the INSERT works. You have just done a failover. Questions: which part of the RTO was automatic, and which depended on you? With asynchronous replication, what may have been left behind at the moment of the crash (what RPO did you accept)? To restart the lab afterwards, run `docker compose down -v` and bring everything up again. *Expected answer:* almost none of the RTO was automatic: noticing the outage, deciding to promote and running `pg_promote` depended on you (a managed service like RDS automates detection and promotion). As for the RPO, with asynchronous replication the transactions already confirmed on the primary that had not yet reached the replica at the moment of the crash are lost; on a local network that is usually little or nothing, but there is no guarantee, and that window is what the RPO measures.',
      "4. **RPO and RTO.** The business defines an RPO of 5 minutes and an RTO of 15. Synchronous or asynchronous replication? Can the failover be manual? Justify. *Expected answer:* asynchronous replication is enough, because the business accepts losing up to 5 minutes of transactions, as long as the replica lag is monitored and stays within that limit; synchronous would only be needed if the RPO were close to zero. The failover can be manual if the team can detect, decide and promote comfortably within the 15 minutes (with on-call staff and a tested runbook); automating it reduces the risk of blowing the RTO and of human error, at the cost of more complexity.",
      "**Cleanup (when you finish the lab and the exercises):**",
      "```sh\ndocker compose down -v\ncd ..\n```",
    ],
    handsOnRich: true,
    tip: "After promoting a replica, do not turn the old primary back on as if nothing had happened. It may have transactions the replica never received and would start accepting writes in parallel with the new primary. The safe path is to rebuild it as a replica of the new primary.",
    takeaway:
      "Reads are scaled with cache and replicas; writes are only scaled by partitioning (sharding), and everything else is consciously choosing between consistency and availability.",
    figures: [
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa05-primary-replica-cache.en.svg",
            alt: "The application reads redis first (GET produto:1); on a MISS it runs SELECT on the replica and stores the value in redis with EX 30. Writes, INSERT and UPDATE, go to the primary, which replicates asynchronously to the read-only replica.",
            caption:
              "Reads and writes follow different paths (write splitting), and the cache sits in front of the reads.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa05-cache-aside.svg",
            alt: "Three numbered steps between the application, the cache and the data store: 1, the application looks for the item in the cache; 2, if it is not there, it reads the item from the store; 3, it writes the item into the cache.",
            caption:
              "Cache-aside in three steps: try the cache, fetch from the database on a MISS and store it in the cache for the next read. That is what `cache-aside.sh` does.",
          },
        ],
        credit: "Diagram: Azure Architecture Center, Microsoft, CC BY 4.0",
      },
    ],
  },
  {
    id: "m6",
    num: "06",
    navTitle: "Full architecture",
    tag: "observability",
    title: "Scalable architectures in the real world",
    lead: "You have all the pieces (fundamentals, load balancer, patterns, CDN, database), but loose pieces are not an architecture. Consider the case of a fictional e-commerce: a traditional monolith, with application and database on the same server, went down on Black Friday. Where exactly was the failure? And, after rebuilding, how do you know where the next bottleneck is? This stage asks for the architect's view: the complete blueprint, each piece justified, and the instruments to see the system working.",
    concept: [
      "**Serverless.** With AWS Lambda, we have maximum abstraction: the developer sends the function and the provider provisions, patches and scales. It is hundreds of executions per second, and the system goes back to zero (including the cost) when demand disappears.",
      "**Scalable monolith vs microservices:**",
      "**Conway's law:** the architecture reflects the communication structure of the organization. Small, autonomous teams tend toward microservices; centralized teams tend toward monoliths.",
      "**Where is the bottleneck? Observability.** The bottleneck may be in CPU, memory, disk I/O, a query, a third-party API, network latency or a poorly configured cache. Without instruments, the investigation becomes guesswork. The three pillars:",
      "What stitches the three together is a common identifier: the same request ID recorded in each layer it passes through. In the lab, it is the `X-Request-ID` header.",
      '**How the big ones do it (according to the material):** Google has the SRE culture (operations as a software problem, automation, error budgets and SLOs). Amazon practices "you build it, you run it": each team operates and scales its own service. Nubank is cloud-native, with microservices, Clojure and Datomic for consistency in a distributed environment, a strong culture of automation and testing in a regulated business, and robust observability for explosive growth. The SRE trend replaces "Operations" teams with SRE, with SLOs, error budgets and the authority to prioritize stability when the error budget runs out. The Platform Engineering trend builds an Internal Developer Platform (IDP) with CI/CD, IaC, observability and security as a service, reducing the cognitive load on product teams.',
      "**SLO and error budget.** The SLO is the reliability goal (for example, 99.9% availability in the month). What remains up to 100% is the error budget: while there is slack, the team can take more risks (frequent deploys, experiments); when the budget runs out, the priority becomes stability.",
      "**The case study: refactoring the e-commerce.** The monolith with application and database on the same server went down on Black Friday. The points of failure: no load balancer, stateful application, overloaded database, no CDN. The redesign, step by step, ties together each stage of this guide:",
      "Result: from a fragile architecture to a distributed, resilient and scalable system.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Serverless",
        d: "the provider takes care of the server and scaling; the cost goes to zero without demand.",
        color: "blue",
      },
      {
        t: "Scalable monolith",
        d: "a single process, stateless, replicated behind a load balancer.",
        color: "signal",
      },
      {
        t: "Microservices",
        d: "services by business capability; granular scaling with high operational cost.",
        color: "violet",
      },
      {
        t: "Conway's law",
        d: "the architecture mirrors the organization.",
        color: "ember",
      },
      {
        t: "Metrics, logs and traces",
        d: "the what, the why and the where.",
        color: "blue",
      },
      {
        t: "Request ID",
        d: "the thread that links the same request across all layers.",
        color: "signal",
      },
      {
        t: "SLO and error budget",
        d: "the reliability goal and the slack it leaves.",
        color: "violet",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "terminal",
        lang: "sh",
        code: "$ mkdir -p etapa-06/edge etapa-06/lb etapa-06/site/estatico && cd etapa-06\n$ echo 'console.log(\"loja\");' > site/estatico/app.js",
        intro:
          'We will assemble the "after" version of the case: **edge (CDN) → load balancer → 3 stateless replicas → Redis (state and queue) → worker**. The database part with a read replica you already built in Stage 05; it fits behind the API in the same way (exercise 5). Here the focus is the request chain and observability, so the compose does not get huge.',
        note: "`docker-compose.yml`:",
      },
      {
        label: "the complete architecture, locally",
        lang: "yaml",
        code: 'name: lab-etapa-06\n\nservices:\n  edge:                                  # the "CDN": caches and delivers\n    image: nginx:1.27-alpine\n    ports:\n      - "8080:80"                        # only port exposed to the world\n    volumes:\n      - ./edge:/etc/nginx/conf.d:ro\n    depends_on:\n      - lb\n  lb:                                    # the "ALB": distributes among the replicas\n    image: nginx:1.27-alpine\n    volumes:\n      - ./lb:/etc/nginx/conf.d:ro\n      - ./site:/usr/share/nginx/html:ro  # static assets (the CDN\'s origin)\n    depends_on:\n      - app\n  app:                                   # the stateless monolith, in 3 replicas (the "ASG")\n    build: ../app\n    image: lab-app\n    environment:\n      MODO: redis                        # state in Redis\n      REDIS_HOST: redis\n    deploy:\n      replicas: 3\n  worker:                                # consumer of the order queue\n    build: ../app\n    image: lab-app\n    command: ["python", "-u", "worker.py"]\n    environment:\n      REDIS_HOST: redis\n    depends_on:\n      - redis\n    restart: on-failure\n  redis:                                 # session/cart and queue\n    image: redis:7-alpine',
        note: "`edge/default.conf`:",
      },
      {
        label: "the complete architecture, locally (2)",
        lang: "sh",
        code: '# Same cache area as Stage 04\nproxy_cache_path /var/cache/nginx/edge levels=1:2 keys_zone=edge:10m max_size=100m inactive=10m;\n\nserver {\n    listen 80;\n    location / {\n        proxy_pass http://lb:80;                      # the edge\'s "origin" is the load balancer\n        proxy_cache edge;                             # caches whatever comes with Cache-Control\n        proxy_cache_revalidate on;                    # revalidates with If-None-Match on expiry\n        add_header X-Cache $upstream_cache_status always;   # shows HIT, MISS etc.\n    }\n}',
        note: "`lb/default.conf`:",
      },
      {
        label: "the complete architecture, locally (3)",
        lang: "sh",
        code: 'upstream backend {\n    zone backend 64k;                   # round-robin state shared among the Nginx worker processes\n    server app:8080 max_fails=1 fail_timeout=10s;\n}\n\n# Log format with the request ID: our homemade "trace"\nlog_format rastreio \'$remote_addr "$request" $status rid=$request_id upstream=$upstream_addr\';\n\nserver {\n    listen 80;\n    access_log /dev/stdout rastreio;\n\n    # Static assets: served right here, with a TTL, for the edge to cache\n    location /estatico/ {\n        root /usr/share/nginx/html;\n        add_header Cache-Control "public, max-age=30";\n    }\n\n    # Everything else goes to the application\n    location / {\n        proxy_pass http://backend;\n        proxy_set_header X-Request-ID $request_id;    # the application records this ID in its logs\n        proxy_connect_timeout 1s;\n        proxy_next_upstream error timeout;\n    }\n}',
      },
      {
        label: "the verification script",
        lang: "sh",
        code: '#!/usr/bin/env bash\n# usage: bash verificar.sh (with the stack running)\nbase=http://localhost:8080\nok()    { echo "OK     $1"; }\nfalha() { echo "FALHA  $1"; }\n\n# Stage 04: the second read of an asset must come from the edge\ncurl -s -o /dev/null "$base/estatico/app.js"\nx=$(curl -s -D - -o /dev/null "$base/estatico/app.js" | tr -d \'\\r\' | grep -i \'^x-cache\' | awk \'{print $2}\')\n[ "$x" = "HIT" ] && ok "asset servido pela borda (HIT)" || falha "asset não veio do cache (x-cache=$x)"\n\n# Stages 01 and 02: the load must be distributed among 3 replicas\nn=$(for i in $(seq 1 12); do curl -s "$base/"; done | awk \'{print $1}\' | sort -u | wc -l)\n[ "$n" -eq 3 ] && ok "requisições distribuídas em 3 réplicas" || falha "só $n réplica(s) responderam"\n\n# Stage 03: the cart written by one replica must be seen by all (stateless)\ncurl -s -o /dev/null -X POST "$base/carrinho?user=teste&item=livro"\nn=$(for i in 1 2 3; do curl -s "$base/carrinho?user=teste"; done | grep -c livro)\n[ "$n" -eq 3 ] && ok "carrinho visível em qualquer réplica" || falha "carrinho inconsistente ($n/3)"\n\n# Stage 03: the order must be accepted right away (202) and processed later by the worker\nc=$(curl -s -o /dev/null -w \'%{http_code}\' -X POST "$base/pedido?id=99")\n[ "$c" = "202" ] && ok "pedido aceito de forma assíncrona (202)" || falha "pedido devolveu $c"',
        intro:
          "Create `verificar.sh` in the `etapa-06/` folder. It checks one property of each stage of the guide, with the stack running:",
      },
    ],
    commands: [
      {
        cmd: "bash verificar.sh",
        note: "checks the architecture's properties all at once",
      },
      {
        cmd: "docker stats --no-stream",
        note: "CPU and memory metrics for each container, at one instant",
      },
      {
        cmd: "docker compose logs --no-color SERVIÇO | tail -n N",
        note: "the last log lines of a service",
      },
      {
        cmd: 'docker compose logs --no-color lb app | grep "$RID"',
        note: "follows a request ID across two layers",
      },
      {
        cmd: "docker run -d --name monolito -p 8090:8080 -e MODO=memoria lab-app",
        note: 'brings up the "before" for comparison',
      },
    ],
    handsOn: [
      "**Lab**",
      "**1. Bring up and verify.**",
      "```sh\ndocker compose up -d --build\nsleep 3\nbash verificar.sh\n```",
      "Expected:",
      "```text\nOK     asset servido pela borda (HIT)\nOK     requisições distribuídas em 3 réplicas\nOK     carrinho visível em qualquer réplica\nOK     pedido aceito de forma assíncrona (202)\n```",
      "**2. Resilience: take down a replica.**",
      '```sh\ndocker stop $(docker compose ps -q app | head -n 1)\nfor i in $(seq 1 20); do curl -s -o /dev/null -w "%{http_code}\\n" "localhost:8080/"; done | sort | uniq -c\n```',
      "Expected: `20 200`. Bring it back and refresh Nginx, which resolves names only at startup (the replica may come back with another IP):",
      "```sh\ndocker compose up -d\ndocker compose exec lb nginx -s reload\n```",
      '**3. Before and after, in numbers.** Use the load function from Stage 01 (redefine it if you opened a new terminal) against the architecture and against a single-instance "monolith":',
      '```sh\ncarga() { time (seq 1 100 | xargs -P 20 -I{} curl -s -o /dev/null "$1"); }\n\n# After: edge, LB and 3 replicas\ncarga http://localhost:8080/\n\n# Before: a single stateful instance, with no LB and no edge\ndocker run -d --name monolito -p 8090:8080 -e MODO=memoria lab-app\ncarga http://localhost:8090/\n```',
      "Expected: about 1.7 s against about 5 s. Now the single point of failure:",
      '```sh\ndocker stop monolito\ncurl -s -o /dev/null -w "%{http_code}\\n" --max-time 2 localhost:8090/\n```',
      "Expected: `000`. Remove with `docker rm monolito`.",
      "**4. Observability: the three pillars with what we have.**",
      "*Metrics* (the what):",
      "```sh\ndocker stats --no-stream\n```",
      "Expected: a table with CPU and memory for each container (`NAME`, `CPU %`, `MEM USAGE / LIMIT`...).",
      "*Logs* (the why). The application records each request:",
      '```sh\ncurl -s "localhost:8080/carrinho?user=ana" > /dev/null\ndocker compose logs --no-color app | tail -n 3\n```',
      "Expected: lines like `app-2  | [9f8e7d6c5b4a] GET /carrinho?user=ana rid=4c1d...`.",
      "*Traces* (the where). Follow a request ID through the layers:",
      '```sh\nRID=$(docker compose logs --no-color lb | grep carrinho | tail -n 1 | grep -o \'rid=[a-f0-9]*\')\n[ -n "$RID" ] || echo "nenhum rid encontrado: rode antes o curl do carrinho do passo anterior"\necho "seguindo $RID"\ndocker compose logs --no-color lb app | grep "$RID"\n```',
      "Expected: two lines with the **same** `rid`, one from the `lb` (with `upstream=` showing which replica was chosen) and another from the `app` (the replica that served). It is a mini distributed trace: the same identifier stitching the request's path through two layers. Real tracing tools do this automatically and measure the time of each segment.",
      "**Exercises**",
      "1. **Diagnosis.** The e-commerce below went down on Black Friday. List the points of failure and, for each, the piece of the guide that solves it and in which stage it was studied: - application and database on the same server; - cart in a session variable; - images and JavaScript served by the application itself; - confirmation e-mail sent before responding to the customer; - a single server in front of everything. *Expected answer:* application and database on the same server: separate the two, with the application on its own instances and the database on a managed service with read replicas (Stages 01, 03 and 05); cart in a session variable: stateless application, with the state in Redis or in the database (Stage 03); images and JavaScript served by the application: CDN in front (Stage 04); e-mail before responding: queue and workers, with the producer responding right away (Stage 03); single server in front: load balancer with a fleet of instances (Stages 01 and 02).",
      "2. **Monolith or microservices?** A startup with 6 people, a single team, wants to \"be like Nubank\". Use Conway's law and the cost table to argue in favor of a scalable monolith (stateless, in an ASG) as a starting point. *Expected answer:* by Conway's law, a single, centralized team tends to produce (and to operate well) a monolith; microservices reflect small, autonomous teams, which the startup does not have yet. The table shows the price of microservices: massive operational complexity, latency and new points of failure in the network, hard distributed debugging. A stateless monolith in an ASG scales horizontally with simplicity of development, testing, deploy and debugging, and can be split later, when teams and bottlenecks arise that justify it.",
      "3. **Bottleneck or pillar?** You see the latency of `/carrinho` triple. Which pillar do you consult first to know *that* something changed, which to know *why* and which to know *where* the time was spent? *Expected answer:* metrics to know **that** something changed (and trigger the alert), logs to know **why** and traces to know **where** the time was spent, across the services the request passed through.",
      "4. **Error budget (calculation).** An SLO of 99.9% availability over 30 days leaves how many minutes of unavailability in the budget? (Hint: 30 days have 43,200 minutes.) *Expected answer:* 0.1% of 43,200 = 43.2 minutes.",
      "5. **Upgrade plan.** Write what you would add to the `docker-compose.yml` to include the Stage 05 primary and replica databases behind the API, and how the application would do the write splitting. *Expected answer:* add to the compose the `primary` and `replica` services (with the `init-primary.sh`, the `replica.sh` and the Stage 05 healthcheck) and pass the `app` the addresses of both through environment variables. In write splitting, write commands (INSERT, UPDATE, DELETE) go to the `primary` and reads (SELECT) to the `replica`, preferably with the Redis cache-aside in front. The test application does not talk to Postgres, so a Postgres client would have to be added to it.",
      "**Cleanup:**",
      "```sh\ndocker compose down -v\ndocker rm -f monolito 2>/dev/null\ncd ..\n```",
    ],
    handsOnRich: true,
    tip: "Generate the request ID in the first layer that receives the traffic and pass it along in all the following calls, recording it in every log. Without that common thread, logs from different layers are separate piles that you have to match by time, which does not work under load.",
    takeaway:
      "A scalable architecture is the right combination of simple pieces (edge, balancer, stateless application, queue, database with replicas), and it only stays that way if you can see the system through metrics, logs and traces.",
    figures: [
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa06-arquitetura-completa.en.svg",
            alt: "The user reaches edge (cache, port 8080), which talks to lb, which creates the X-Request-ID and spreads requests across app-1, app-2 and app-3. The replicas use redis for state and the queue, and the worker consumes the queue. A blue band shows the same ID across the layers.",
            caption:
              "Every layer of the lab appears once; the X-Request-ID ties together the lb and replica logs.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
      {
        items: [
          {
            src: "/guides/escalabilidade/etapa06-web-queue-worker.svg",
            alt: "The Web-Queue-Worker style: the client goes through an identity provider to the web front end, which talks to a remote service and to the database and sends work to a queue; a worker consumes the queue and uses the cache and the database; static content reaches the client through a CDN.",
            caption:
              "The same architecture as the lab, as it appears in production in the cloud: a scalable front end, a queue, a separate worker, a cache, a database and a CDN for static content.",
          },
        ],
        credit: "Diagram: Azure Architecture Center, Microsoft, CC BY 4.0",
      },
    ],
  },
];

export const CHECKLIST: ChecklistGroup[] = [
  {
    title: "Stage 01: Fundamentals",
    items: [
      "I explain the difference between performance, optimization and scalability with an example.",
      "I can say why scaling does not reduce the latency of an isolated request.",
      "I compare vertical and horizontal scaling, including the concept of SPOF.",
      "I tell apart metric-based, scheduled and predictive autoscaling.",
      "I recognize when NOT to scale.",
    ],
  },
  {
    title: "Stage 02: Load balancers",
    items: [
      "I tell L4 and L7 apart and give a use for each.",
      "I explain round-robin, least connections and IP hash, with one disadvantage of each.",
      "I describe health check, failover and connection draining.",
      "I run and explain a canary and a blue/green switch, with rollback.",
      "I configure an `upstream` in Nginx, validate it with `nginx -t` and reload the configuration.",
    ],
  },
  {
    title: "Stage 03: Horizontal scaling patterns",
    items: [
      "I explain why stateful gets in the way of balancing and how Redis solves it.",
      "I reproduce the in-memory cart problem and the fix.",
      "I explain why sticky session is a patch and not a solution.",
      "I explain the producer, queue and worker pattern, and why workers scale by queue size.",
      "I write a retry with exponential backoff and explain the role of fallback and circuit breaker.",
      "I know what sidecar, ambassador, ReplicaSet and ASG are.",
    ],
  },
  {
    title: "Stage 04: CDNs",
    items: [
      "I explain how smart DNS brings the user closer to a PoP.",
      "I read `Cache-Control` and `ETag` with `curl` and provoke a `304`.",
      "I tell HIT, MISS, EXPIRED and REVALIDATED apart.",
      "I calculate the cache hit ratio and know why invalidating too much is bad.",
      "I decide what to cache, for how long, and what never goes to a shared edge.",
    ],
  },
  {
    title: "Stage 05: Database",
    items: [
      "I explain cache-aside and implement the flow with Redis, including invalidation on write.",
      "I explain primary-replica, asynchronous replication and write splitting.",
      "I demonstrate eventual consistency with a replica.",
      "I compare range and hash sharding and explain the pain of re-sharding.",
      "I explain the CAP theorem, RPO and RTO with an example.",
    ],
  },
  {
    title: "Stage 06: Architectures in the real world",
    items: [
      "I diagnose the points of failure of a monolith and redesign the architecture, justifying each piece.",
      "I compare scalable monolith and microservices and cite Conway's law.",
      'I associate metrics, logs and traces with the questions "what", "why" and "where".',
      "I run and interpret the verification of the complete architecture and follow a request ID through the logs.",
      "I explain SLO and error budget and calculate the budget of an SLO.",
    ],
  },
];

export const NOTES: string[] = [
  "**Clarifications and corrections to the raw material:**",
  '**CAP theorem.** The material says the system "guarantees only two of three" properties. The more accurate reading is that, **during a network partition**, you must choose between consistency and availability; without a partition, a system can offer both. That is why the material\'s own phrase "the real choice is CP or AP" is the one that holds, and the Stage 05 text was written in that sense. Classifying databases as "CP" or "AP" is also a simplification: many allow the behavior to be tuned by configuration.',
  "**Hystrix.** The material cites the Hystrix library as the one that popularized the Circuit Breaker. This is a correct historical fact, but the library is in maintenance mode (Netflix itself stopped developing it) and the Hystrix repository recommends alternatives such as Resilience4j. The pattern remains valid; the library is now a historical reference.",
  "**`X-Cache` header.** The material treats `X-Cache` (Hit/Miss) as something the CDN simply sends. That header is **not part of an HTTP standard**: it is a convention of each provider, and the format of the value varies among them. What is standardized is `Cache-Control`. In the lab, `X-Cache` is defined by us at the edge.",
  "**ReplicaSet vs Deployment.** The material presents the ReplicaSet as the scaling unit, which is correct. In practice, one usually creates a **Deployment**, which manages ReplicaSets and adds gradual updates and rollback. The ReplicaSet remains the mechanism that keeps the number of copies.",
  "**Exponential backoff.** In real systems, a small random delay (jitter) is usually added to the backoff, so that many clients do not all retry at the same instant.",
  "**Changes from the previous version of the guide:**",
  'Each stage now has the sections "Key concepts", "Essential commands" and "Tip". The reading YAMLs (Ingress and ReplicaSet) and the support scripts (`cache-aside.sh`, `verificar.sh`) became worked examples of their own, and the exercises moved into "Hands-on".',
  "The exercises that had none gained an expected answer: the retry with backoff and the sticky session in Stage 03, the ReplicaSet reading and the question about range sharding in Stage 05.",
  "In the sticky session exercise (Stage 03), the test uses a new user (`bia`), because `ana`'s cart already has items spread across the replicas' memories since step 1, and it gained the step of undoing the `ip_hash`.",
  "In step 5 of Stage 03, the warning to wait for the step 4 queue to empty before measuring was added; without it, the measurement with 1 worker adds old orders and goes past the expected 12 s.",
  "**Lab limits (where the local equivalence ends):**",
  "The test application **models** a server's capacity with a semaphore and a `sleep`. The Stage 01 numbers are predictable by construction; they serve to see the logic, not to measure real hardware.",
  "Open-source Nginx does **passive health checks** (reacts to real failures). The ALB does active probing at a configurable interval, with *unhealthy threshold* and *healthy threshold*. Nginx also resolves server names only at startup, which is why the `reload` after changing the fleet; in an ASG, registering and removing instances in the target group is automatic.",
  "The `upstream` blocks use `zone` (shared memory) so that the several Nginx worker processes share the same round-robin state. Without it, each worker balances on its own and exact counts such as 10/10/10 may come out uneven.",
  "The `sed -i` commands with `\\n` are GNU sed. On macOS (BSD sed), use `gsed` (`brew install gnu-sed`) or edit the files by hand.",
  "The lab queue is a **Redis list** (`LPUSH` and `BRPOP`). It has no acknowledgment: if a worker dies in the middle of a task, the message is lost. SQS and RabbitMQ keep the message until the consumer acknowledges it, and that guarantee is what the real pattern requires.",
  'The local "CDN" is a single edge. It reproduces the mechanism (miss, hit, revalidation with `304`, TTL), but not the geographic distribution, the smart DNS or the WAF. The purge is simulated by erasing the cache.',
  "The lab Postgres uses **asynchronous** streaming replication, and the failover is manual. A managed service such as RDS automates detection and promotion; its real RTO depends on that automation.",
  "In Docker Compose, `deploy.replicas` serves for local replicas. In production, the equivalent is the ReplicaSet/Deployment (Kubernetes) or the ASG (AWS), with real autoscaling.",
  "**References from the material:**",
  "Beyer et al., *The Site Reliability Workbook* (2018) and *Site Reliability Engineering* (2016).",
  "Kleppmann, *Designing Data-Intensive Applications* (2017).",
  "Newman, *Building Microservices* (2015).",
  "Grigorik, *High Performance Browser Networking* (2013).",
  "AWS: *What is an Application Load Balancer?*, *Amazon CloudFront Developer Guide*, *Amazon Aurora Features*, *AWS Well-Architected Framework*.",
  "Kubernetes, *Ingress*; Karpenter and KEDA documentation; Cloudflare, *Load Balancing* and *What is a CDN?*; Cockroach Labs, *CAP Theorem*; Netflix Technology Blog.",
];
