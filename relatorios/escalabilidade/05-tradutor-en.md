# Scalability on servers: from the first pit box to a pit lane that handles the peak

*Good afternoon, good evening, good morning, wherever you are! The Scalability on Servers Grand Prix is on the air, and the grid is already formed. What is at stake in this race is simple to say and hard to deliver: a system that withstands the peak without going down, from the first user to the millionth, without a single isolated failure taking down the whole event.*

*The layout has six sectors, and I narrate each one. Sector 1, the starting straight: fundamentals, where you learn the difference between being fast and handling volume. Sector 2, the pit lane entry: load balancers, failover, canary, and rollback. Sector 3, the sequence of technical corners: stateless, queues, and workers. Sector 4, the international leg of the calendar: CDN and edge caching. Sector 5, the most feared chicane on the circuit: the database. Sector 6, the victory lap: the complete architecture, with telemetry on.*

*And the backdrop could not be more timely. A warning before the start, so nobody thinks it is a typo: in 2026 the Bahrain round was moved to Sepang, in Malaysia (as verified on 2026-10-05), and that is why this guide says "Bahrain GP in Sepang". That was the race, on October 4, 2026, that the driver recounts just below. Belts fastened, visor down. Here we go!*

> Narrated guide, final version: built on the didactic version (`01-professor.md`) of the six course materials for "Scalability on servers" (DevOps and Cloud Architecture, Phase 2). Each lesson became a stage, in the same order. The original lessons are conceptual and use the AWS console as a demonstration; here each stage gains a lab that runs on your machine, with no cloud account. All the technical content, the commands, the code, and the order of the exercises were preserved. What changes is the trackside layer: the driver's perspective, which reads each scalability concept as a race weekend (from the pit lane to the factory), and the broadcast narration that guides you from stage to stage.

On Sunday, October 4, 2026, in Sepang, the entire championship went through a scaling problem. The Bahrain GP, held in Malaysia, started late because of heavy rain; two safety cars opened windows in which many people wanted to pit on the same lap; Mercedes made a perfect stop under pressure to keep Kimi Antonelli in front; and George Russell sat stopped on the straight in the final laps, behind the last safety car, apparently with the power unit shut down. Peak demand, a queue in the pit lane, a single point of failure: it was all there, in one afternoon. Scaling a server is solving the same problem the pit lane solves at every GP: serving many things at the same time, without a single failure taking down the whole race.

> **Championship data used in this guide (verified on 2026-10-05).** The pitstop backend (`localhost:3333`) was down at the time of writing, so I checked public sources (list in "F1 data sources", at the end). Standings after round 16 (Bahrain GP held in Sepang, Malaysia, on October 4, 2026): 1. Kimi Antonelli (Mercedes), 320 points; 2. George Russell (Mercedes), 236; 3. Lewis Hamilton (Ferrari), 214; 4. Charles Leclerc (Ferrari), 191; 5. Lando Norris (McLaren), 188; 6. Max Verstappen (Red Bull), 188; 7. Oscar Piastri (McLaren), 128; 8. Isack Hadjar (Red Bull), 96; 9. Liam Lawson (Racing Bulls), 65; 10. Pierre Gasly (Alpine), 41. Podium in Sepang: Verstappen (his first win and Red Bull's first in 2026), Antonelli, and Hamilton. Next round: Singapore GP, October 9 to 11, 2026. Every scenario with these names that did not actually happen is marked as hypothetical.

**What you will be able to do by the end of this guide:** distinguish performance, optimization, and scalability and measure the difference between them; explain vertical scaling, horizontal scaling, and elasticity; build a load balancer with three replicas and observe algorithms, failover, and canary deploys; make an application stateless with Redis; decouple heavy work with a queue and workers; inspect `Cache-Control`, `304`, and cache hit/miss on a CDN edge; build a Postgres read replica, apply cache-aside, and understand sharding and the CAP theorem; and, finally, put everything together in a complete architecture, verify it with a script, and trace it with metrics, logs, and a request identifier.

**Prerequisites:**

- Docker Engine or Docker Desktop, with the `docker compose` command (recent Compose v2). Check with `docker compose version`.
- A terminal with `bash`, `curl`, `awk`, `sort`, `uniq`, and `sed` (GNU). Linux, macOS, or WSL will do.
- **Note for macOS:** the `sed` that ships with macOS is the BSD one, which does not accept `sed -i` without a suffix or `\n` in the replacement. Install GNU sed with `brew install gnu-sed` and use `gsed` in place of `sed` in this guide's commands (Stage 02 also offers a manual-editing alternative).
- Basic knowledge of containers (image, container, published port, Compose network).
- No cloud account. Where the lesson uses AWS (ALB, ASG, SQS, CloudFront, RDS), the lab uses a local equivalent and says clearly where the analogy ends.

> **Cleanup warning:** each stage leaves containers running. When you finish a stage, run its "Cleanup" block before starting the next one. Several stages use the same ports (8080, for example).

**Lab folder structure** (you will create it gradually):

```text
lab-escalabilidade/
  app/                 # the test application, shared by several stages
  etapa-02/            # load balancer
  etapa-03/            # stateless, queue, and workers
  etapa-04/            # CDN (origin + edge)
  etapa-05/            # database (primary, replica, cache-aside)
  etapa-06/            # complete architecture
```

---

## Scalability to F1 reference: keep this on the steering wheel

The same analogy holds from the beginning to the end of the document. If a server is a pit box in Stage 01, a server is still a pit box in Stage 06. Only the ten central pieces are listed here; you do not need to know anything about F1 to follow the guide, because each analogy is explained at the point where it appears. The complete table, with all the analogies used, is in the [Appendix: complete reference table](#appendix-complete-reference-table), at the end of the document.

| Scalability | Formula 1 |
|---|---|
| Request | A car entering the pit lane to be serviced |
| Server, instance, or replica | A pit box with its complete pit stop crew |
| Single point of failure (SPOF) | The power unit: there is no spare, if it fails the race is over |
| Load balancer | The pit lane entry control, which directs each car to a free pit box |
| Stateful and stateless | The set-up in one mechanic's head and the set-up written on the central board |
| Redis (state, queue, and cache) | The garage's live data board, shared by all the pit boxes |
| Queue and worker | The pile of used tires waiting for analysis and the factory engineer who processes it |
| CDN (origin and edge) | The factory and the parts stock set up at each circuit |
| Primary database and read replica | The official archive at the factory and the read-only copy at the circuit |
| `X-Request-ID` | The transponder: the same number at every timing loop |

## Where the comparison stops

The analogy organizes the reasoning, but it does not replace the technical model. The main limits, which I repeat in the text when they appear:

- **One pit box per team.** The regulations give each team one pit box and two cars. In real F1 there is no controller distributing cars among pit boxes: each car always goes to its own team's pit box. A server has no regulations; you open as many replicas as the budget allows, and any of them can serve any request.
- **One car at a time.** An F1 pit box services one car at a time. The lab's "pit box with capacity 2" is an imaginary pit box with two service positions.
- **People do not appear in seconds.** The number of people operating the car is limited and fixed over the weekend. With autoscaling, capacity is born and dies in minutes, and you pay only for what stayed on.
- **A part is matter; data is a copy.** A physical part leaves one place to be in another. A cached file is copied without leaving the origin.

Whenever there is a conflict between the track and the terminal, what is in the terminal prevails: definitions, commands, and expected outputs of the technical text.

---

## Stage 01: Fundamentals of modern scalability

*THE LIGHTS ARE OUT! The start of the Scalability Grand Prix, and the first corner already demands a decision that many teams get wrong: is your problem speed or volume? Anyone who confuses the two spends budget in the wrong place. Stay with me.*

### The problem

An app goes viral after a marketing campaign. Millions of users try to access it at the same time and the system goes down. What should have been a success turns into frustration and lost revenue. This is a scaling failure. Large retailers going offline on Black Friday and Twitter's (now X) "Fail Whale" are the classic examples, and technically they usually came from bottlenecks in components that are hard to scale horizontally: an overloaded relational database or a payment system that could not handle the concurrency.

Growing along with demand is a business necessity, not a luxury. But there is a trap: not every slow system has a scaling problem. Before buying more machines, you need to know what exactly is slow.

### The concept

**Supermarket analogy:**

- **Performance** is the speed of a single task, that is, the latency of one operation: how many items per minute one cashier scans.
- **Optimization** is improving performance without adding resources: teaching the cashier to scan 20% faster or rearranging the products on the shelves.
- **Scalability** is the ability to increase productivity (throughput) in proportion to the resources added. When the queue gets gigantic, having the fastest cashier in the world does not help: you open more checkouts.

**Cockpit perspective:** in our map, the cashier is the pit box and each scanned item is a pit stop; the supermarket logic holds entirely. What the track adds is the peak scene: in Sepang, the safety cars opened windows in which many people wanted to pit on the same lap, and at that moment the fastest crew in the world does not help if there is only one pit box for everybody.

**The trade-off triangle.** Performance, cost, and complexity: it is practically impossible to maximize all three at the same time. A database with top-end hardware and several layers of cache raises cost and complexity. Microservices can lower the cost per request at large scale, but bring enormous operational complexity compared with a monolith. The professional's job is to navigate these trade-offs according to the technical and business requirements.

In F1 this triangle has a name: the cost cap. Every tenth of a second of performance costs wind tunnel time and factory hours, and every extra system on the car costs operating complexity and reliability risk. No team maximizes all three; the difference between them lies in choosing where to spend.

**Vertical scaling (scaling up)** is enlarging a single server: more CPU, more RAM, faster disks.

- Advantage: simplicity, usually with no code changes.
- Disadvantages: physical and financial limits (the next upgrade becomes prohibitive or does not exist), it usually requires downtime for the upgrade, and it creates a **single point of failure (SPOF)**: if the super-server goes down, everything goes down.

**Cockpit perspective:** vertical scaling is trying to solve everything with a single bigger pit box: more mechanics, more wheel guns, more equipment. It works until the pit box no longer fits in the garage, and it is still one pit box. The single point of failure I know from inside the car: the power unit has no spare. That is what we saw with George Russell in Sepang, stopped on the straight in the final laps; a single component with no redundancy and the race ended right there, a few laps from the flag, with a podium thrown away. A single server is that: everything depends on it.

**Horizontal scaling (scaling out)** is adding more servers to distribute the load: a fleet of smaller, cheaper machines.

- Advantage: theoretically unlimited scale and more resilience, since the failure of one instance only redirects traffic to the healthy ones.
- Cost: the application must be designed for a distributed environment (ideally stateless) and operations become more complex, with the need for a Load Balancer (next stage).

**Cockpit perspective:** horizontal scaling is opening more identical pit boxes in the pit lane. If one pit box has a problem, the cars go to the others. **Here the analogy stops:** the regulations give one pit box per team and two cars; a server has no regulations, and the fleet grows as far as the budget allows.

**Elasticity and autoscaling.** Elasticity is the ability to grow and shrink resources according to load. Autoscaling is the automated mechanism that implements it, with predefined rules, without an on-call team adding servers by hand. There are three styles:

| Style | How it decides | Example from the material |
|---|---|---|
| Metric-based (the most common) | Reacts to a measured number | "If the fleet's average CPU exceeds 70% for more than 5 minutes, add a server; if it drops below 30% for 10 minutes, remove one" |
| Scheduled | For predictable demand | "Every business day at 8:55, scale up to 10 servers; at 18:05, scale down to 2" |
| Predictive | Machine Learning over history predicts peaks | Adjusts capacity before the peak happens |

Automation is the key to cost efficiency: you pay only for what you use.

**Cockpit perspective:** the metric rule is the pit wall watching the queue of cars in the pit lane and reacting. The scheduled one is the crew already positioned for the pit window that was in the race plan before the start. The predictive one is the weather radar: whoever reads the rain before it arrives already has the intermediates in hand. Sepang showed the other side: Lewis Hamilton started on slick tires on a wet track, dropped to the back of the field, and needed an enormous recovery to finish third. A wrong forecast costs a lot, on track and in the cloud. **Here the analogy stops:** in an F1 team nobody hires a mechanic in the middle of the race; with autoscaling, capacity is born and dies in minutes.

**When NOT to scale.** Sometimes the bottleneck is solved with code optimization or a more efficient query. For an internal system with 50 employees and low, stable traffic, autoscaling is excessive in cost and complexity. Distinguishing a scaling problem from an optimization problem is a sign of maturity.

It is like setting up a second pit box for a private test with a single car: more people and cost, not a tenth of a second gained.

**Tools mentioned in the material:** Kubernetes (the orchestration standard), AWS Auto Scaling Groups (ASG, elasticity in the cloud), Karpenter (provisions resources according to real need, with a focus on cost), and KEDA (scales based on events, such as the size of a queue). Microservices, containers, and unpredictable seasonal peaks are the challenges of modern architectures: granularity allows scaling only the necessary component (for example, the cart), but brings network latency and observability challenges.

**In the market (according to the material):** iFood faces peaks on championship final days and rainy days, and responds with microservices in the cloud, intensive autoscaling, and queues to decouple order processing. The FinOps trend looks at scalability through the lens of cost as well. Festival and sporting event ticket sales taking sites down push the market to evolve in load balancing, bot protection, and distributed caching via CDN.

### Commented example: a "store" with limited capacity

To feel the difference between optimizing, scaling up, and scaling out, we will use a test application that models a server with finite capacity: each instance serves at most N requests at the same time, and each request takes a fixed time. It is a **model** (a mock-up), not a real server, but it makes the numbers predictable.

Read the application like this: each container is a **pit box**; `CAPACIDADE` is how many cars it services at the same time; `TRABALHO_MS` is the duration of each pit stop; and requests that exceed the capacity wait their turn, like the car behind in a double stack. `/health` answers immediately, with no work, like a radio check that does not require the car to enter the pit box. **Here the analogy stops:** an F1 pit box services one car at a time; the capacity-2 model is an imaginary pit box with two service positions.

Create the folder and the files:

```sh
mkdir -p lab-escalabilidade/app && cd lab-escalabilidade
```

`app/app.py`:

```python
import os
import socket
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOST = socket.gethostname()  # container name: identifies who answered
VERSAO = os.getenv("VERSAO", "v1")  # version label (used in Stage 02)
TRABALHO = float(os.getenv("TRABALHO_MS", "100")) / 1000  # time per request, in seconds
CAPACIDADE = threading.Semaphore(int(os.getenv("CAPACIDADE", "2")))  # how many requests at the same time


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            corpo = "ok\n"  # health check: answers immediately, without simulating work
        else:
            with CAPACIDADE:  # only N get in at a time; the others wait in the queue
                time.sleep(TRABALHO)  # simulates real work (query, calculation)
            corpo = f"{HOST} {VERSAO}\n"
        dados = corpo.encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.send_header("Content-Length", str(len(dados)))
        self.end_headers()
        self.wfile.write(dados)


class Servidor(ThreadingHTTPServer):
    request_queue_size = 128  # pending connection queue larger than the default


if __name__ == "__main__":
    Servidor(("0.0.0.0", 8080), Handler).serve_forever()
```

`app/Dockerfile`:

```dockerfile
# Small image with Python
FROM python:3.12-alpine
# Working directory inside the image
WORKDIR /srv
# Copies only the application code
COPY app.py .
# Documents the port the application listens on
EXPOSE 8080
# -u turns off output buffering, so logs show up immediately
CMD ["python", "-u", "app.py"]
```

Build the image and define a load function (100 requests, 20 in parallel, and the total time):

```sh
# Builds the image with the name lab-app
docker build -t lab-app ./app

# Helper function: fires 100 requests, 20 at a time, against the URL received
carga() { time (seq 1 100 | xargs -P 20 -I{} curl -s -o /dev/null "$1"); }
```

Expected build output (shortened): `naming to docker.io/library/lab-app` at the end.

### Hands-on

*Stopwatch zeroed, car in the garage. This is the first practice session: one instance, then optimization, then a bigger pit box, then more pit boxes. To have a measure of what a trained crew can achieve, the F1 pit stop record belongs to McLaren, 1.80 s with Lando Norris in Qatar in 2023. Write down the numbers from each round, because it is the comparison between them that teaches.*

**1. Baseline: one instance, capacity 2, 100 ms per request.**

```sh
docker run -d --name base -p 8081:8080 lab-app
curl -s -o /dev/null -w "latência de uma requisição: %{time_total}s\n" localhost:8081/
carga http://localhost:8081/
```

Expected output (approximate values, your machine will vary):

```text
latência de uma requisição: 0.10xxxxs
real    0m5.2s
```

The math: 2 requests per 100 ms = 20 per second; 100 requests take about 5 seconds.

In pit lane language: a pit box with two positions, at 100 ms per pit stop, returns 20 cars per second to the track.

**2. Optimization: same machine, half the work.**

```sh
docker run -d --name otim -p 8082:8080 -e TRABALHO_MS=50 lab-app
curl -s -o /dev/null -w "latência: %{time_total}s\n" localhost:8082/
carga http://localhost:8082/
```

Expected: latency near 0.05s and total time near 2.5s.

This is the trained crew: the same pit box, each pit stop in half the time. My car leaves sooner **and** the queue moves faster.

**3. Vertical scaling: a "bigger server" (capacity 4).**

```sh
docker run -d --name vert -p 8083:8080 -e CAPACIDADE=4 lab-app
curl -s -o /dev/null -w "latência: %{time_total}s\n" localhost:8083/
carga http://localhost:8083/
```

Expected: latency stays near 0.10s, total time near 2.5s.

This is the bigger pit box: each pit stop still lasts the same, but now four cars fit in service at once.

**4. Horizontal scaling: three small instances, with a hand-made "balancer".**

```sh
docker run -d --name h1 -p 8084:8080 lab-app
docker run -d --name h2 -p 8085:8080 lab-app
docker run -d --name h3 -p 8086:8080 lab-app

# The modulo 3 of the request number picks port 8084, 8085, or 8086
time (seq 1 100 | xargs -P 20 -I{} sh -c 'curl -s -o /dev/null http://localhost:$((8084 + {} % 3))/')
```

Expected: total time near 1.7s (3 instances × 20 per second = 60 per second).

Three identical pit boxes, and your `sh -c` playing the role of the pit lane entry control, choosing the pit box by the request number.

**5. What to observe:**

| Experiment | Latency of 1 request | Time for 100 requests |
|---|---|---|
| Baseline | about 0.10 s | about 5 s |
| Optimization | about 0.05 s | about 2.5 s |
| Vertical | about 0.10 s | about 2.5 s |
| Horizontal (3) | about 0.10 s | about 1.7 s |

Scaling (vertical or horizontal) **did not change the latency** of a single request, only the throughput. Optimizing changed both. That is exactly the distinction between performance and scalability.

From inside the car this is obvious: opening more pit boxes does not make my pit stop shorter, it only lets more cars fit. What lowers my pit stop time is the trained crew.

**6. The single point of failure, live.**

```sh
docker stop base
curl -s -o /dev/null -w "%{http_code}\n" --max-time 2 localhost:8081/

docker stop h1
for p in 8084 8085 8086; do curl -s -o /dev/null -w "%{http_code} " --max-time 2 localhost:$p/; done; echo
```

Expected: `000` on the first (connection refused, the SPOF is down) and `000 200 200` on the second: with the fleet, only a third fails. But who decides where to send the request? Right now it is your `sh -c`. In the next stage, it is the load balancer.

The `000` of the single pit box is the car stopped on the straight: there is nowhere to divert to. The `000 200 200` is the pit lane with three pit boxes and one closed, where only the cars sent to the closed pit box suffer. What is missing is someone at the pit lane entry to notice the closed pit box and redirect.

**Cleanup:**

```sh
docker rm -f base otim vert h1 h2 h3
```

### Exercises

*Flying lap! Three exercises, no consulting the text. This is where those who memorized the definition are separated from those who know how to apply it at decision time.*

1. **Scale or optimize?** For each situation, say which lever to use first and why: (a) a page runs 400 SQL queries in a loop; (b) the Black Friday campaign site will receive 20 times normal traffic in 3 hours; (c) an internal system with 50 employees is slow on Monday mornings. *Expected answer:* (a) optimize (the problem is the query, scaling would only multiply the waste); (b) scale horizontally, preferably scheduled or with autoscaling; (c) measure first, probably optimize, and avoid autoscaling as excessive in cost and complexity.
2. **Write the three rules.** For a store with a predictable peak at 20:00, write a metric-based rule, a scheduled one, and describe what a predictive one would do differently. *Expected answer:* (metric) "if the fleet's average CPU exceeds 70% for more than 5 minutes, add a server; if it drops below 30% for 10 minutes, remove one"; (scheduled) "every day at 19:50, scale up to the number of servers the peak requires, and at 22:00 scale down to the minimum"; (predictive) a Machine Learning model trained on history learns the shape of the peak (for example, that Friday is stronger than Tuesday) and raises capacity before it starts, without depending on a fixed hand-written time. The underlying difference: the metric rule reacts after the load has risen; the scheduled and predictive ones anticipate.
3. **Triangle.** You need to cut the database latency in half. Name one solution that sacrifices cost and another that sacrifices complexity. *Expected answer:* sacrificing cost, top-end hardware for the database (vertical scaling: more RAM, faster disks), which is simple to operate but expensive, with a ceiling and a single point of failure; sacrificing complexity, one or more layers of cache (for example, Redis) in front of the database, which are cheap per unit but bring new problems (invalidation, stale data). And, before either, it is worth checking whether a better query or index already solves it (optimization, which costs little on all three vertices).

### Remember this

> Scaling increases how much the system can handle (throughput), optimizing makes each task cost less; before buying a server, find out which of the two problems you have.

> **In pit box terms:** a trained crew lowers the time of each pit stop; more pit boxes increase how many cars return to the track. Find out which of the two is missing before spending.

*Sector 1 in green! You can already tell a fast crew from a big pit lane, and you know that a single pit box is a single point of failure waiting for its moment. It was in Sepang, in 2016, that Lewis Hamilton's engine blew while he was leading, and those points were missed: Nico Rosberg was champion by 5. Now comes the pit lane entry: who decides which pit box each car goes to? Stage 02 coming up.*

---

## Stage 02: Load balancers in practice

*Second sector, and the rhythm changes. In the previous stage, the script itself chose each request's destination; now the pit lane entry control comes into play. Algorithms, failover, canary, and rollback: that is a lot happening on the same straight, so eyes on the track.*

### The problem

You have three identical servers and one question: how does traffic reach them in an organized way? In Stage 01, your `sh -c` played the role of distributor and, when one instance went down, a third of the requests simply failed. In production, nobody wants a client deciding this on its own, and nobody wants to take the site down to publish a new version. This is where the Load Balancer comes in: it prevents overload, keeps the application up even if an instance fails, and enables zero-downtime deploys (as Netflix and Spotify do).

In the pit lane, nobody lets the car decide on its own where to stop. There is a controlled entry, a speed limit, a designated pit box, and a safe release. That order is what the load balancer brings to the server.

### The concept

**Analogy:** the air traffic controller. It directs planes to free runways and keeps the airport operating even with one runway closed.

A Load Balancer is a proxy server between clients and application servers, the single point of contact and an abstraction: the client talks to one address only. It distributes requests and ensures high availability, reliability, and simplified management.

**Cockpit perspective:** in our map, the control tower becomes the pit lane entry control and the airport runways become the pit boxes. **Here the analogy stops:** in real F1, each car has the fixed pit box of its own team and there is no controller distributing cars among pit boxes. The real pit lane is the case of IP hash, which appears shortly.

**Layer 4 vs Layer 7 (OSI model):**

| | L4 (transport, TCP/UDP) | L7 (application, HTTP/HTTPS) |
|---|---|---|
| Decides based on | Source and destination IP and ports, in the first packets | The content of each request |
| What it sees | Nothing of the content: fetching an image and paying are identical packets | Path, `User-Agent`, `Accept-Language`, cookies |
| Advantage | Extremely fast, millions of requests per second, minimal latency | Intelligent routing |
| Example uses | Online games, streaming, balancing other LBs (AWS NLB) | `/api/pagamentos` to robust servers and `/blog` to simple servers; mobile to an optimized version; language; A/B testing by cookie (AWS ALB) |

**Cockpit perspective:** L4 is the timing loop buried in the asphalt. It reads the transponder, knows that car 12, Antonelli's, passed and at what instant, and decides very fast, but has no idea what the car needs. L7 is the engineer who listens to the radio: "soft tires, more front wing". With the request in hand, it sends the car to the pit box prepared for that service. Smarter, and more expensive to process.

**External vs internal.** The external one has a public interface (public IP or DNS) and is the entry gate. The internal one exists only inside the private network (VPC) and manages communication between services: the "Cart" talks to the "Inventory" without exposing the Inventory to the internet, which is a security gain.

In the garage: the external one is the pit lane entry, where whoever comes from the track arrives. The internal one is the intercom between the garage departments, which connects strategy, engines, and tires without any of it going through the track.

**Algorithms:**

- **Round-robin:** circular list, next in line. Fair and predictable, but ignores load and capacity. The **Weighted Round-robin** variant gives higher weights to more powerful servers.
- **Least Connections:** sends to whoever has the fewest active connections. Good when connections have very different durations (uploads, streaming).
- **IP Hashing:** the hash of the client IP defines the server, so the same IP always lands on the same server (session affinity). Disadvantages: uneven distribution when many users are behind the same corporate proxy, and session problems if a server fails and the hash is recomputed.

**Cockpit perspective:** round-robin is sending each car to the next pit box in the circular line, without looking at whether the pit box is full or empty. The weighted one gives more cars to the pit box with the bigger crew. Least connections sends to the pit box with the fewest cars in service, and that makes a difference when one pit stop is a tire change and another is a front wing change, which takes much longer. IP hash is exactly the real pit lane: each car always in its own team's pit box; Charles Leclerc's car never stops in the McLaren pit box. The disadvantage is real too: if the team's pit box has a problem, the car has nowhere to go.

**Health checks and failover.** The LB actively tests the health of each server. Parameters: interval, timeout, *unhealthy threshold* (consecutive failures to mark as unhealthy), and *healthy threshold* (consecutive successes to come back). If it fails: **failover** occurs, and the LB stops sending new traffic to the sick instance, transparently. **Connection draining** lets existing connections finish before the instance is removed.

**Cockpit perspective:** the active health check is the periodic radio check: at each interval, control calls the pit box and waits for a response; a few failures in a row (*unhealthy threshold*) take the pit box out of rotation, and a few successes in a row (*healthy threshold*) bring it back. Failover is diverting the next car to another pit box. Connection draining is what no crew chief negotiates: the car already on the jack finishes the pit stop before the pit box closes. Releasing the car with a badly secured wheel earns a penalty, and the regulations have a name for it: unsafe release.

**Deploy strategies:**

- **Blue/Green:** two identical, isolated environments. The LB sends 100% to Blue (stable); Green (the new version) is validated; the "switch" points everything to Green. Rollback is equally fast. Watch out for the shared database: schema changes must be backward compatible.
- **Canary:** named after canaries in coal mines. A small percentage (1%, 5%) goes to the new version; technical metrics (errors, latency) and business metrics (conversion, engagement) are monitored; it is gradually increased up to 100%.

**Cockpit perspective:** blue/green is having two complete car specifications ready (the current one and the upgrade package) and switching everything at once; if the new one does not run, the rollback is going back to the previous specification, the one that worked. Canary is what teams do with a new part all the time: the package goes on one car first, the team compares telemetry with the sister car, and only then takes it to the second. Hypothetical example: if McLaren brings a new floor to Singapore, fitting it only on Oscar Piastri's car and comparing with Lando Norris's is a 50% canary. **Here the analogy stops:** with two cars, the smallest possible canary in F1 is half the fleet; on the load balancer you choose 1%, 5%, or 10%. And the canary's business metrics (conversion, engagement) have no equivalent on the track.

**In the market (according to the material):** Netflix uses internal LBs to decouple thousands of microservices (if recommendations get slow, traffic goes to a fallback or circuit breakers are activated, avoiding cascading failure). Service Mesh and API Gateways (Istio and Linkerd, with sidecar proxies acting as per-service L7 LBs) bring observability, mTLS, and granular control. GSLB (Global Server Load Balancing) uses intelligent DNS for multi-cloud and hybrid: a user in Brazil goes to São Paulo, one in Europe to Frankfurt, according to geolocation, latency, and health.

**How the lab fits in:** Nginx will play the role of the Application Load Balancer (L7). In AWS, the *listener* is the entry door, the *target group* is the group of destination servers, and the *health check* decides who is healthy. In Nginx, `listen` is the listener, the `upstream` block is the target group, and the health check is **passive** (open source Nginx marks a server as failed when its real connections fail; the active health check, which probes periodically, is a feature of NGINX Plus).

In our mapping: `listen` is the pit lane entry, `upstream` is the set of pit boxes among which the entry chooses, and the passive health check of open source Nginx is discovering that a pit box has a problem only when a real car fails in it. The ALB, with active probing, is the periodic radio check.

### Commented example: Nginx balancing 3 replicas

```sh
mkdir -p etapa-02/nginx && cd etapa-02
```

`docker-compose.yml`:

```yaml
name: lab-etapa-02            # fixed project name (prefix for containers and networks)

services:
  app:
    build: ../app             # the image from Stage 01
    image: lab-app            # name of the built image
    environment:
      VERSAO: v1              # stable version (the "blue" one)
    deploy:
      replicas: 3             # three identical copies of this service
  verde:
    build: ../app
    image: lab-app
    environment:
      VERSAO: v2              # new version (the "green" one), used in the canary
  lb:
    image: nginx:1.27-alpine  # our L7 balancer
    ports:
      - "8080:80"             # host port 8080 goes into Nginx port 80
    volumes:
      - ./nginx:/etc/nginx/conf.d:ro   # mounts the folder (not the file) so the reload sees edits
    depends_on:
      - app                   # Nginx only starts after the replicas, since it resolves names at startup
      - verde
```

`nginx/default.conf`:

```nginx
upstream azul {
    # zone: shared memory between Nginx worker processes; without it,
    # each worker would have its own round-robin counter and the distribution would come out uneven
    zone azul 64k;
    # "app" resolves to the IPs of the 3 replicas; each IP becomes a server in the group
    # max_fails=1 fail_timeout=10s: one failure takes the server out of rotation for 10 s (passive health check)
    server app:8080 max_fails=1 fail_timeout=10s;
}

upstream verde {
    server verde:8080;
}

server {
    listen 80;                          # the listener
    location / {
        proxy_pass http://azul;         # forwards to the azul group (round-robin by default)
        proxy_connect_timeout 1s;       # gives up quickly on a server that does not respond
        proxy_next_upstream error timeout;  # on error or timeout, tries the next server
    }
}
```

Bring everything up and check:

```sh
docker compose up -d --build
docker compose ps
```

Expected output (shortened): three `lab-etapa-02-app-1/2/3` lines in `running`, plus `verde` and `lb`.

### Hands-on

*Pit lane open! Now it is you at the terminal: round-robin, least connections, IP hash, a pit box knocked down on purpose, and an upgrade package fitted on a single car. Extra attention on the canary and the rollback. This is where those who publish a new version trembling are separated from those who publish with the way back already loaded.*

**1. Round-robin.** 30 requests, counting who answered:

```sh
for i in $(seq 1 30); do curl -s localhost:8080/; done | awk '{print $1}' | sort | uniq -c
```

Expected (the IDs change):

```text
     10 3f2a1b9c0d1e
     10 7c8d9e0f1a2b
     10 a1b2c3d4e5f6
```

Thanks to the `zone` directive, the Nginx worker processes share the same round-robin counter, which is why the split comes out exact. Without it, each worker would have its own counter and the distribution could come out uneven (for example, 12 for one, 9 for each of the others).

Ten cars to each pit box, in circular order: pure round-robin.

**2. Failover.** Knock down a replica and keep calling:

```sh
docker stop $(docker compose ps -q app | head -n 1)
for i in $(seq 1 20); do curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/; done | sort | uniq -c
```

Expected: `20 200`. No failure reached the client. The first request that lands on the dead replica may take about 1 second (the `proxy_connect_timeout`) before Nginx tries another server. Compare with Stage 01, where `000` appeared.

One pit box closed, the pit lane entry noticed on the failure and sent the following cars to the other two. The second of waiting is the car that reached the door of the closed pit box and needed to be redirected.

Bring the replica back and refresh Nginx, which resolves names only at startup and so may be holding an outdated IP:

```sh
docker compose up -d
docker compose exec lb nginx -s reload
```

**3. Algorithms.** Switch to `least_conn` and then `ip_hash`. (On macOS, use `gsed` in place of `sed`, or edit `nginx/default.conf` by hand: insert the line `least_conn;` right below `upstream azul {` and, afterwards, replace it with `ip_hash;`.)

```sh
# Inserts "least_conn;" right after the opening of the upstream azul block
sed -i 's/upstream azul {/upstream azul {\n    least_conn;/' nginx/default.conf
docker compose exec lb nginx -t && docker compose exec lb nginx -s reload

# Now switches to ip_hash
sed -i 's/least_conn;/ip_hash;/' nginx/default.conf
docker compose exec lb nginx -t && docker compose exec lb nginx -s reload
for i in $(seq 1 10); do curl -s localhost:8080/; done | awk '{print $1}' | sort | uniq -c
```

Expected with `ip_hash`: a single line with `10` and a single server. Your client always has the same IP (the Docker gateway's), so it always lands on the same server: that is session affinity, and also the imbalance that happens when many people share an IP. Remove the line to go back to round-robin:

```sh
sed -i '/ip_hash;/d' nginx/default.conf
docker compose exec lb nginx -s reload
```

**Cockpit perspective on `ip_hash`:** this is the F1 pit lane. Your client (the same IP) is always the same car, and it always stops at the same pit box.

**4. Canary at 10%.** Replace the contents of `nginx/default.conf` with:

```nginx
upstream azul {
    zone azul 64k;                      # balancing state shared among the workers
    server app:8080 max_fails=1 fail_timeout=10s;
}

upstream verde {
    server verde:8080;
}

# Draws the destination by each request's unique ID: 10% go to "verde", the rest to "azul"
split_clients "${request_id}" $destino {
    10% verde;
    *   azul;
}

server {
    listen 80;
    location / {
        proxy_pass http://$destino;     # the group name comes from the drawn variable
        proxy_connect_timeout 1s;
        proxy_next_upstream error timeout;
    }
}
```

```sh
docker compose exec lb nginx -t && docker compose exec lb nginx -s reload
seq 1 200 | xargs -P 10 -I{} curl -s localhost:8080/ | awk '{print $2}' | sort | uniq -c
```

Expected, approximately: `180 v1` and `20 v2` (the draw varies a little).

One in every ten cars leaves with the upgrade package; the other nine keep the current specification. If `v2`'s telemetry gets worse, nobody beyond those 10% felt it.

**5. Blue/Green: the switch and the rollback.** (On macOS, use `gsed`, or edit the file by hand: replace `10%` with `100%` for the switch and delete the `verde` line for the rollback.)

```sh
# Switch: 100% to the new version
sed -i 's/10% verde;/100% verde;/' nginx/default.conf
docker compose exec lb nginx -s reload
for i in 1 2 3 4 5; do curl -s localhost:8080/ | awk '{print $2}'; done
# Expected: v2 five times

# Rollback: removes the verde rule and sends everything back to azul
sed -i '/% verde;/d' nginx/default.conf
docker compose exec lb nginx -s reload
for i in 1 2 3 4 5; do curl -s localhost:8080/ | awk '{print $2}'; done
# Expected: v1 five times
```

`nginx -s reload` is graceful: the old processes finish ongoing connections before exiting, the idea of connection draining, like the old crew that only leaves the pit box after finishing the pit stops in progress.

**Cleanup (only after you also finish the exercises):**

```sh
docker compose down -v
cd ..
```

### Exercises

*Timed pit stop! Three exercises: L7 routing, weights, and an Ingress reading. Clock running.*

Exercises 1 and 2 change `nginx/default.conf` and need the stack up. If you already ran the cleanup above, bring it up again: from `lab-escalabilidade`, run `cd etapa-02 && docker compose up -d --build`. The file `nginx/default.conf` remains on disk in the canary/rollback format (with the `split_clients`), and it is the `location /` block of that file that you replace in exercise 1. After editing, run `docker compose exec lb nginx -t && docker compose exec lb nginx -s reload`. When finished, repeat the cleanup.

1. **L7 routing.** Replace the `location /` block with two: `location /api/` with `proxy_pass http://verde;` and `location /` with `proxy_pass http://azul;`. Call `curl -s localhost:8080/api/pagamentos` and `curl -s localhost:8080/blog`. Which version answers each one? This is only possible at L7: why? *Expected answer:* `/api/pagamentos` answers with `v2` (the `verde` group) and `/blog` answers with `v1` (the `azul` group). Only L7 can do it, because the `/api/...` path is inside the HTTP request, and L4 sees only IP and port.
2. **Weights.** What would be the effect of `server app:8080 weight=3;` next to another server with weight 1, and in what real scenario would you use it? *Expected answer:* the weight-3 server would receive about 3 out of every 4 requests (3 to 1 ratio). This is Weighted Round-robin, useful when the machines are unequal: a more powerful server should receive more load than a smaller one.
3. **Ingress (reading).** Kubernetes Ingress is the "smart router" that takes external traffic to the right services. Read the YAML and say which service serves `/api/pedidos` and which serves `/`:

```yaml
apiVersion: networking.k8s.io/v1   # API version of the Ingress resource
kind: Ingress                      # resource type
metadata:
  name: loja                       # name of the Ingress
spec:
  ingressClassName: nginx          # which Ingress controller will implement it
  rules:
    - host: loja.exemplo.com       # only applies to this domain
      http:
        paths:
          - path: /api             # requests that start with /api
            pathType: Prefix       # prefix matching
            backend:
              service:
                name: api          # go to the "api" Service
                port:
                  number: 80
          - path: /                # everything else
            pathType: Prefix
            backend:
              service:
                name: web          # goes to the "web" Service
                port:
                  number: 80
```

*Expected answer:* `/api/pedidos` goes to the `api` Service; `/` goes to `web`. It is the same reasoning as Nginx's `location`.

On the track: these are the signs at the pit lane entry, indicating where each type of service goes.

### Remember this

> The load balancer is the single entry point that distributes the load, takes sick instances out of rotation, and lets you switch versions without taking anyone down.

> **In pit box terms:** a single entry to the pit lane, which distributes the cars, stops sending cars to a pit box with a problem, and lets you swap the specification without stopping the race.

*Sector 2 in green! Single entry, a pit box with a problem out of rotation, and a specification swap without stopping the race. But notice: we have not yet looked inside each pit box. What if the car's set-up lives only in one mechanic's head? That is the technical part of the circuit coming up, in Stage 03.*

---

## Stage 03: Horizontal scaling patterns in cloud architectures

*A sequence of technical corners! This is the stage that separates the point scorers from the rest of the grid, because the problem is no longer at the pit lane entry. It is inside the application: state kept in the wrong place and slow work in the response path. Brake early, aim well, and accelerate out.*

### The problem

We already have an LB and a fleet. But what good is a fleet of identical cars if each one only works with a specific driver? A customer puts coffee in the cart, the LB sends the next request to another instance, and the cart is empty. And what if payment processing is much slower than the rest? Adding servers for everything is waste. This stage looks inside the application.

(The material uses "fleet of cars" to talk about servers. In our mapping, a server is still a pit box, and the problem described is that of a pit box where only one mechanic knows the car's set-up, kept in his head.)

There is a second scenario, that of e-commerce on Black Friday: confirming an order involves validating the payment, decrementing inventory, issuing the invoice, and sending an email. Done synchronously, the user waits for all of this staring at a loading screen.

On the track this would be absurd: the car stopped in the pit box waiting for Pirelli to finish analyzing the tires that just came off it. Nobody does that. The used tire goes onto the pile, the car goes back to the track, and the analysis happens later.

### The concept

**Golden rule: stateless.**

- **Stateful:** keeps session data in the server's memory (for example, the cart in a session variable). The client gets "stuck" to the server; if the LB sends it to another, the cart disappears. The workaround is *sticky sessions*, which limit resilience and the efficiency of balancing.
- **Stateless:** no context information stays between requests; each request carries everything it needs. State goes to a shared, fast store (a database or a distributed cache such as Redis). Any server serves any client at any time: it is compatible with horizontal scaling and with automatic failover.

**Analogy:** the waiter who writes your order on his own arm (stateful) versus the one who writes on a paper order slip that stays on the counter (stateless): if the waiter leaves, another reads the slip and continues.

**Cockpit perspective:** in the garage, the waiter who writes on his arm is the mechanic with the car's set-up in his head, and the paper order slip is the garage's live data board (the lab's Redis), shared by all the pit boxes. The sticky session is the car stuck to the pit box where the mechanic who remembers it is, which is, again, the real F1 pit lane. **Here the analogy stops:** in F1, tying the car to the team's pit box is a sensible choice (set-up, parts, and people belong to each team); on a server, tying the client to an instance limits balancing and loses state when it goes down.

**Units of scale:**

- **Kubernetes ReplicaSet:** guarantees a specified number of identical copies of a Pod always running.
- **AWS Auto Scaling Group (ASG):** manages the lifecycle of a group of EC2 instances, keeping the desired number healthy.

In Compose, the `deploy.replicas` field you used in Stage 02 plays a similar role.

In track terms: it is the team principal's rule, "N pit boxes ready, always". If one goes down, another is set up in its place.

**Workers and queues.** The main application (the **producer**) publishes a message to a queue (AWS SQS, RabbitMQ) and answers immediately ("Your order was received and is being processed!"). The **workers** (consumers) read the queue and do the heavy work asynchronously. Workers scale independently, based on the queue size.

**Cockpit perspective:** the pit box is the producer: it services the car, returns it to the track, and answers "pit box confirmed" (the `202`). The heavy work goes to a pile: used tires that Pirelli collects for analysis, stop data for the debrief. Whoever processes this pile are the workers, the engineers in the operations center at the factory (Mercedes' support room in Brackley, Ferrari's remote garage in Maranello). If the pile grows, more people are called into the operations room, without touching any pit box. **Here the analogy stops:** in F1, the number of people in those rooms is fixed during the weekend; workers go up and down with the queue.

**Advanced patterns:**

- **Sidecar:** helper container in the same Pod as the main one, handling logs, monitoring, or network proxy without the application knowing.
- **Ambassador:** proxy variation focused on communication with the outside or with other services (retries, service discovery).
- **Sharding:** horizontal scaling of data; the database is partitioned into smaller, independent databases (shards). We will see it in Stage 05.

**Cockpit perspective:** the sidecar is the data logger installed next to the car's systems: it records and reports without the rest of the car needing to know about it. The ambassador is the team manager: instead of each engineer talking to race control, one person alone makes this bridge to the outside, with the right protocol.

**Trade-offs and resilience.** An aggressive autoscaling policy gives better performance and a high bill; the conservative one saves money and degrades at peaks. FinOps seeks the balance. In distributed systems failure is certain, which is why there are **Retry** with exponential backoff and **Fallback** (plan B, such as serving from the cache or a default response).

**Cockpit perspective:** retry with backoff is what the engineer does when I do not answer on the radio: calls again, and waits longer and longer between calls so as not to congest the channel. The fallback is the strategy plan B, calculated before the start: if the tire does not hold up, the extra stop is already ready.

**Tools and market (according to the material):** KEDA (Kubernetes Event-driven Autoscaling) monitors the queue size in SQS or the lag of a Kafka topic and scales workers from zero to N. Karpenter provisions exact nodes, cheaper and suited to the moment. Netflix popularized the Circuit Breaker with the Hystrix library: repeated failures "open" the circuit, blocking calls to the failing service and going to the fallback. Instagram and iFood use workers and queues at large scale. Serverless (AWS Lambda) is the ultimate evolution of workers and queues: it scales from zero to thousands of executions and charges per execution. Istio and Linkerd implement Sidecar and Ambassador in a standardized way.

The circuit breaker has a direct parallel: when race control closes the pit lane entry (red flag or an incident at the entry), no car tries to enter and hit the closed door; the team goes straight to plan B until the entry reopens.

### Commented example: stateful vs stateless cart, and queue with workers

We will replace the application with a complete version: a cart (in memory or in Redis, depending on the `MODO` variable), an order endpoint that enqueues, and a worker. It keeps the Stage 01 behavior at `/` and `/health`.

In our mapping: `MODO=memoria` is the mechanic with the set-up in his head; `MODO=redis` is the set-up on the central board; `/pedido` is the pit box that stacks up the analysis and answers immediately; and `worker.py` is the engineer in the operations room.

Replace `app/app.py`:

```python
import json
import os
import socket
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

HOST = socket.gethostname()
VERSAO = os.getenv("VERSAO", "v1")
MODO = os.getenv("MODO", "memoria")  # "memoria" = stateful, "redis" = stateless
TRABALHO = float(os.getenv("TRABALHO_MS", "100")) / 1000
CAPACIDADE = threading.Semaphore(int(os.getenv("CAPACIDADE", "2")))

memoria = {}  # carts kept in the process (stateful)
r = None
if MODO == "redis":
    import redis  # only imported when needed

    r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)


class Handler(BaseHTTPRequestHandler):
    def responder(self, status, corpo, tipo="text/plain"):
        dados = corpo.encode()
        self.send_response(status)
        self.send_header("Content-Type", tipo)
        self.send_header("Content-Length", str(len(dados)))
        self.end_headers()
        self.wfile.write(dados)

    def responder_json(self, status, dados):
        # every JSON says who answered (server) and in which mode
        corpo = json.dumps({"servidor": HOST, "modo": MODO, **dados}) + "\n"
        self.responder(status, corpo, "application/json")

    def do_GET(self):
        url = urlparse(self.path)
        q = parse_qs(url.query)
        if url.path == "/health":
            return self.responder(200, "ok\n")
        if url.path == "/carrinho":
            user = q.get("user", ["anonimo"])[0]
            # stateless: reads from Redis; stateful: reads from this process's memory
            itens = r.lrange(f"carrinho:{user}", 0, -1) if r else memoria.get(user, [])
            return self.responder_json(200, {"user": user, "itens": itens})
        with CAPACIDADE:
            time.sleep(TRABALHO)
        self.responder(200, f"{HOST} {VERSAO}\n")

    def do_POST(self):
        url = urlparse(self.path)
        q = parse_qs(url.query)
        if url.path == "/carrinho":
            user = q.get("user", ["anonimo"])[0]
            item = q.get("item", ["?"])[0]
            if r:
                r.rpush(f"carrinho:{user}", item)  # externalized state
            else:
                memoria.setdefault(user, []).append(item)  # state tied to the process
            return self.responder_json(200, {"ok": True})
        if url.path == "/pedido":
            if r is None:
                return self.responder_json(503, {"erro": "sem fila (use MODO=redis)"})
            pedido = q.get("id", ["0"])[0]
            r.lpush("fila:pedidos", pedido)  # producer: publishes to the queue and answers right away
            return self.responder_json(202, {"pedido": pedido, "status": "recebido"})
        self.responder(404, "nao encontrado\n")

    def log_message(self, formato, *args):
        # logs who served and the X-Request-ID (will be useful in Stage 06)
        print(f"[{HOST}] {self.command} {self.path} rid={self.headers.get('X-Request-ID', '-')}", flush=True)


class Servidor(ThreadingHTTPServer):
    request_queue_size = 128


if __name__ == "__main__":
    Servidor(("0.0.0.0", 8080), Handler).serve_forever()
```

Create `app/worker.py` (the consumer):

```python
import os
import socket
import time

import redis

HOST = socket.gethostname()
r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)

while True:
    # BRPOP waits up to 5 s for an item in the queue; returns None if nothing arrived
    item = r.brpop("fila:pedidos", timeout=5)
    if item is None:
        continue
    _, pedido = item  # item comes as (queue_name, value)
    print(f"[{HOST}] processando pedido {pedido}", flush=True)
    time.sleep(1)  # simulates invoice and email: 1 s of heavy work
    print(f"[{HOST}] pedido {pedido} concluido", flush=True)
```

Replace `app/Dockerfile`:

```dockerfile
FROM python:3.12-alpine
WORKDIR /srv
# Python client for Redis (pure library, installs without compiling)
RUN pip install --no-cache-dir redis
# Now the image carries the application and the worker
COPY app.py worker.py ./
EXPOSE 8080
CMD ["python", "-u", "app.py"]
```

Create the stage folder:

```sh
mkdir -p etapa-03/nginx && cd etapa-03
```

`docker-compose.yml`:

```yaml
name: lab-etapa-03

services:
  app:
    build: ../app
    image: lab-app
    environment:
      MODO: ${MODO:-memoria}      # reads MODO from the shell; if it does not exist, uses "memoria"
      REDIS_HOST: redis           # name of the Redis service on the Compose network
    deploy:
      replicas: 3                 # three replicas of the API
  redis:
    image: redis:7-alpine         # shared state and queue
  worker:
    build: ../app
    image: lab-app
    command: ["python", "-u", "worker.py"]   # same image, different command
    environment:
      REDIS_HOST: redis
    depends_on:
      - redis
    restart: on-failure           # if Redis was not ready yet, tries again
    deploy:
      replicas: 0                 # starts turned off; we turn it on in the queue experiment
  lb:
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx:/etc/nginx/conf.d:ro
    depends_on:
      - app
```

`nginx/default.conf`:

```nginx
upstream backend {
    zone backend 64k;             # round-robin state shared among the Nginx worker processes
    server app:8080;              # the 3 replicas, in round-robin
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
        proxy_set_header X-Request-ID $request_id;   # passes along a unique request ID
        proxy_connect_timeout 1s;                    # gives up quickly on a replica that does not respond
        proxy_next_upstream error timeout;           # on error or timeout, tries the next replica
    }
}
```

### Hands-on

*Moment of truth! First you will watch the cart vanish with the set-up kept in the mechanic's head, then you will move everything to the garage's central board and, finally, you will send the pile of tires to the factory. If the cart disappears in the first round, celebrate: that was exactly the error you needed to see happen.*

**1. The problem: stateful cart.**

```sh
export MODO=memoria
docker compose up -d --build

# Three items, one per request; the LB distributes them among the replicas
for i in 1 2 3; do curl -s -X POST "localhost:8080/carrinho?user=ana&item=item$i"; done
# Now reads the cart three times
for i in 1 2 3; do curl -s "localhost:8080/carrinho?user=ana"; done
```

Expected (the IDs and the order vary):

```text
{"servidor": "aaa111", "modo": "memoria", "user": "ana", "itens": ["item1"]}
{"servidor": "bbb222", "modo": "memoria", "user": "ana", "itens": ["item2"]}
{"servidor": "ccc333", "modo": "memoria", "user": "ana", "itens": ["item3"]}
```

Each response has **only one item**. Ana's cart is scattered across three memories, and no replica sees it whole. This is the problem of state tied to the server. (The `zone` in the `upstream` makes the Nginx workers share the round-robin, so the six requests go through the three replicas in order and each read lands on the replica that received the corresponding item.)

Three pit boxes, each with a piece of Ana's set-up in the head of a different mechanic. None of them assembles the whole car.

**2. The solution: state in Redis.**

```sh
docker compose down
export MODO=redis
docker compose up -d
for i in 1 2 3; do curl -s -X POST "localhost:8080/carrinho?user=ana&item=item$i"; done
for i in 1 2 3; do curl -s "localhost:8080/carrinho?user=ana"; done
docker compose exec redis redis-cli LRANGE carrinho:ana 0 -1
```

Expected: the three responses show `"itens": ["item1", "item2", "item3"]`, coming from different servers, and `redis-cli` lists:

```text
1) "item1"
2) "item2"
3) "item3"
```

Now the set-up is on the central board: any pit box reads the same sheet, complete.

**3. Failover without losing the cart.**

```sh
docker stop $(docker compose ps -q app | head -n 1)
curl -s "localhost:8080/carrinho?user=ana"
```

Expected: the cart stays complete (it may take up to about 1 second if the request lands on the stopped replica: open source Nginx only notices the failure when it tries, and `proxy_connect_timeout 1s` limits the wait before it moves to another replica). Bring the replica back and refresh Nginx, which resolves names only at startup and the replica may come back with another IP:

```sh
docker compose up -d
docker compose exec lb nginx -s reload
```

One pit box closed and the cart stays whole, because it never lived in the pit box.

**4. Queue and workers.** The order comes back fast and the heavy work happens later:

```sh
# Turns on 1 worker (MODO stays exported, so the API is not recreated in another mode)
docker compose up -d --scale worker=1

# Enqueues 12 orders; each response arrives immediately with 202
for i in $(seq 1 12); do curl -s -o /dev/null -w "%{http_code} %{time_total}s\n" -X POST "localhost:8080/pedido?id=$i"; done

# Queue size
docker compose exec redis redis-cli LLEN fila:pedidos
```

Expected: twelve lines of the type `202 0.00xs` and an `(integer) N` with N between 1 and 11 (the workers are already consuming). Watch the worker working (Ctrl+C to exit):

```sh
docker compose logs -f worker
```

Expected output (shortened):

```text
lab-etapa-03-worker-1  | [9f8e7d6c5b4a] processando pedido 1
lab-etapa-03-worker-1  | [9f8e7d6c5b4a] pedido 1 concluido
```

The pit box answers "pit box confirmed" in milliseconds; the analysis pile is consumed by the factory engineer at his own pace.

**5. Scale the workers by queue size.** Measure the time to empty the queue with 1 worker and then with 3:

```sh
# With 1 worker (12 orders of 1 s: near 12 s)
for i in $(seq 1 12); do curl -s -o /dev/null -X POST "localhost:8080/pedido?id=$i"; done
time { while [ "$(docker compose exec -T redis redis-cli LLEN fila:pedidos | tr -d '\r')" != "0" ]; do sleep 0.5; done; }

# With 3 workers (near 4 s)
docker compose up -d --scale worker=3
for i in $(seq 1 12); do curl -s -o /dev/null -X POST "localhost:8080/pedido?id=$i"; done
time { while [ "$(docker compose exec -T redis redis-cli LLEN fila:pedidos | tr -d '\r')" != "0" ]; do sleep 0.5; done; }
```

The workers scaled **independently of the API**, and it was the queue size that justified the scaling. That is the idea of KEDA.

Three engineers in the operations room empty the pile about three times faster, and no pit box was touched.

**Cleanup (only after you also finish the exercises):**

```sh
docker compose down -v
unset MODO
cd ..
```

### Exercises

*Fast lap for pole! Four exercises, from hand-made KEDA to ReplicaSet. Retry with backoff is the radio call repeated with growing patience: do not give up on the first attempt, and do not shout on the radio every second.*

Exercises 1 and 3 need the stack up. If you already ran the cleanup above, bring it up again: from `lab-escalabilidade`, run `cd etapa-03`, then `export MODO=redis` (exercise 1) or `export MODO=memoria` (exercise 3) and `docker compose up -d --build`. If the stack is already up in the other mode, run `docker compose down` before switching `MODO`. Exercise 1 also uses `--scale worker=N`. When finished, repeat the cleanup.

1. **Hand-made KEDA.** Suppose each worker processes 1 order per second and you want to empty the queue within 4 seconds. Write the formula for the number of workers as a function of `LLEN` (hint: round up). Test with `--scale`. *Expected answer:* `workers = ceil(LLEN / 4)`, because each worker handles 4 orders in 4 seconds. In Bash, `n=$(( (LLEN + 3) / 4 ))`. With `LLEN` equal to 12, that is 3 workers (`docker compose up -d --scale worker=3`) and the queue empties in about 4 seconds. It is the logic that KEDA automates when scaling workers by queue size.
2. **Retry with exponential backoff.** Run the script below against a port where nothing is listening. Then, in another terminal, start `docker run -d --rm -p 9999:8080 lab-app` during the wait and watch the script succeed.

```sh
for tentativa in 1 2 3 4 5; do
  # --fail treats an HTTP error as a failure; --max-time 2 limits the wait of each attempt
  if curl -sf --max-time 2 -o /dev/null http://localhost:9999/health; then
    echo "ok na tentativa $tentativa"; break
  fi
  espera=$((2 ** (tentativa - 1)))   # waits 1, 2, 4, 8, 16 seconds
  echo "tentativa $tentativa falhou, esperando ${espera}s"
  sleep "$espera"
done
```

3. **Sticky session, the patch.** Go back to `MODO=memoria` (`docker compose down`, `export MODO=memoria`, `docker compose up -d`), add `ip_hash;` to the `upstream backend` in `nginx/default.conf`, run `docker compose exec lb nginx -s reload`, and repeat the cart test. Does it work? Now take down the replica that served Ana (`docker stop` on the container that answered). What happened to the cart, and why does that limit resilience?
4. **ReplicaSet (reading).** Map each field to Compose: which one is `replicas`, which one is the image?

```yaml
apiVersion: apps/v1          # API version of the ReplicaSet
kind: ReplicaSet             # resource type
metadata:
  name: carrinho             # name of the ReplicaSet
spec:
  replicas: 3                # how many copies of the Pod must always exist
  selector:
    matchLabels:
      app: carrinho          # which Pods belong to this ReplicaSet
  template:                  # template for the Pods created
    metadata:
      labels:
        app: carrinho        # the label the selector looks for
    spec:
      containers:
        - name: carrinho
          image: nginx:1.27-alpine   # container image
          ports:
            - containerPort: 80
```

### Remember this

> If state lives on the server, the server cannot die or be replaced; take state out (Redis, database) and take slow work out of the response path (queue and workers).

> **In pit box terms:** set-up on the central board, not in the mechanic's head; and tire analysis goes to the factory, it does not hold the car in the pit box.

*Sector 3 in green, and what a sector! Set-up on the central board, any pit box continues the work, and the tire analysis goes to the factory without holding anyone in the pit lane. Now the calendar goes international: the next round of the real championship is Singapore, October 9 to 11, 2026, more than ten thousand kilometers from Maranello. How do you deliver parts quickly so far from the factory? Stage 04.*

---

## Stage 04: CDNs and global performance

*International leg of the championship! No engine beats physics, and in this stage we stop fighting distance and start working around it: stock pre-positioned at the circuit, with the factory saying how long each part is valid.*

### The problem

Your servers are in Brazil and work well for local users. But a customer in Lisbon, Tokyo, or New York suffers from the latency imposed by distance and submarine cables, hundreds of milliseconds before processing even starts. No powerful server beats physics: latency depends on the speed of light and on distance. The solution is to bring the content closer to the user, and that is what a CDN (Content Delivery Network) does. It is also a layer of security and scalability, because most requests never even reach your origin.

Physics is physics in the paddock too: Singapore is more than ten thousand kilometers from Maranello, and a part that has to leave the factory does not reach the circuit in minutes.

### The concept

**Analogy:** a network of bookstore branches. Instead of every customer in the world asking the central warehouse for the book, each branch keeps copies of the best sellers. The warehouse is only bothered when the branch does not have the book.

**Cockpit perspective:** in our map, the central warehouse is the factory and the branch is the parts stock set up at each circuit. What F1 adds is pre-positioning: sea freight kits dispatched well in advance and rotated along the calendar, plus air freight. For Singapore (October 9 to 11, 2026), almost everything the team needs will already be at the circuit before the car turns a wheel (cache hit); the part that has to come by plane from the factory is the cache miss: expensive, slow, avoided at all costs.

A CDN is a global network of proxy servers at internet exchange points (IXPs), called **PoPs** (Points of Presence) or **Edge Locations**, holding copies of the content near the user.

**How it works:**

1. **Geolocation via DNS.** The DNS query goes to the CDN's intelligent DNS, which identifies the location by the IP and returns the IP of the closest PoP, instead of the origin's.
2. **Edge caching.** The PoP (for example, Paris) checks the local cache. The first time there is a **Cache Miss**: it fetches from the origin in Brazil, delivers, and stores a copy. The next nearby user gets a **Cache Hit**, served instantly from the edge.

Intelligent DNS is the logistics that knows which stock is closest to whoever asked. The first request for a part the stock does not have generates the miss; from then on, the copy stays at the circuit for the next ones. **Here the analogy stops:** a physical part leaves one place to be in another; the cached file is copied and stays at the origin.

**Cache control.** The `Cache-Control` header rules the story. `max-age` defines the TTL in seconds: `Cache-Control: public, max-age=3600` stores for one hour. Once expired, the file becomes *stale* and is revalidated with the origin; if it has not changed, the origin answers `304 Not Modified` and the CDN renews the TTL without downloading the file again.

**Cockpit perspective:** `Cache-Control` is the factory saying how long a part is cleared for use on the track. Once the deadline passes, nobody throws the part away: the engineer asks the factory "is revision C still the current one?". If it is, the answer is the `304`: keep using it, nothing was shipped. The ETag is exactly that revision number.

**Invalidation (purging).** It is forcibly removing files from all caches, through a panel or API (for example, an urgent bug fix in a JavaScript file). Use with discretion: it can cost money and reduces cache efficiency.

It is the recall: the factory discovers a problem in a batch and orders that part withdrawn from all circuits at once. Necessary when it is serious, expensive when it becomes a habit, because each recall forces a new shipment from the factory (a miss).

**Beyond static assets.** CDNs also scale APIs: GET responses that change little (a product catalog) can be cached at the edge, relieving the application and the database. Players mentioned: Amazon CloudFront, Akamai, Fastly.

**Security and performance at the edge:**

- **WAF** integrated into the CDN blocks SQL Injection and XSS at the edge.
- **TLS Offload:** the CDN does the TLS handshake (CPU-expensive) on the optimized edge servers and keeps an optimized secure connection with the origin.

At the paddock edge, the WAF is the credentials turnstile: whoever has no access is turned away at the entrance, far from the garage. TLS offload is the heavy check done at the turnstile, so the team inside does not need to repeat it.

**Infrastructure and observability.** CDNs use BGP to announce the most efficient routes to their PoPs and peering agreements (direct connections with large providers) to reduce hops. The main metrics: **Cache Hit Ratio** (the most important), bandwidth savings, response latency, and error rate.

Cache hit ratio is the metric every logistics chief watches: the percentage of requests resolved at the circuit, without calling on the factory.

**In the market (according to the material):** Fortnite and League of Legends patches (tens of GB) are pre-positioned at PoPs days before launch. Edge Computing (AWS Lambda@Edge, Cloudflare Workers) runs code at the PoPs (rendering, A/B tests, images, authentication). Dynamic Content Acceleration (Akamai, Fastly) speeds up even non-cacheable content with TCP/IP optimization and intelligent routing.

The pre-positioned patches are, no more and no less, the sea freight kit: heavy cargo dispatched weeks ahead, to be in place when the peak arrives. Edge computing is engineering done at the circuit itself, without waiting for the factory.

**How the lab fits in:** a real CDN has hundreds of PoPs, but the mechanism of one PoP is a proxy with a cache. We will set up two Nginx instances: the **origin** (which defines `Cache-Control`) and the **edge** (which caches and reports `X-Cache`). In CloudFront, the *Origin* is the origin, the *Behavior* is the cache rule per request type, and the CDN domain is the edge.

In our mapping: the `origem` Nginx is the factory, the `edge` is the stock at the circuit, and `X-Cache` is the label that says whether the part came off the circuit's shelf (`HIT`) or from the factory (`MISS`).

### Commented example: origin and edge

```sh
mkdir -p etapa-04/origem etapa-04/edge etapa-04/site/estatico && cd etapa-04
echo 'console.log("v1");' > site/estatico/app.js
echo '<h1>Loja</h1>' > site/index.html
```

`docker-compose.yml`:

```yaml
name: lab-etapa-04

services:
  origem:
    image: nginx:1.27-alpine
    ports:
      - "8082:80"                         # we expose the origin to compare with the edge
    volumes:
      - ./origem:/etc/nginx/conf.d:ro     # origin configuration
      - ./site:/usr/share/nginx/html:ro   # files served
  edge:
    image: nginx:1.27-alpine
    ports:
      - "8081:80"                         # the "CDN" the user accesses
    volumes:
      - ./edge:/etc/nginx/conf.d:ro
    depends_on:
      - origem
```

`origem/default.conf`:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;                 # where the files live

    location /estatico/ {
        # 10 s TTL (short on purpose, so you can see the expiration)
        add_header Cache-Control "public, max-age=10";
    }

    location /api/ {
        default_type application/json;
        # API without Cache-Control: the edge must not cache
        return 200 '{"produtos": ["camiseta", "caneca"]}';
    }
}
```

`edge/default.conf`:

```nginx
# Cache area: folder on disk, "edge" metadata zone of 10 MB, up to 100 MB of content
proxy_cache_path /var/cache/nginx/edge levels=1:2 keys_zone=edge:10m max_size=100m inactive=10m;

server {
    listen 80;
    location / {
        proxy_pass http://origem:80;                   # the origin
        proxy_cache edge;                              # uses the cache area above
        proxy_cache_revalidate on;                     # on expiry, asks the origin (If-None-Match) instead of downloading again
        add_header X-Cache $upstream_cache_status always;   # HIT, MISS, EXPIRED, REVALIDATED...
    }
}
```

Nginx respects the `Cache-Control: max-age` coming from the origin to decide the TTL; responses with neither `Cache-Control` nor `Expires` are not cached, unless you configure `proxy_cache_valid`.

```sh
docker compose up -d
```

### Hands-on

*Detective session open! You will read headers the way an engineer reads telemetry: MISS, HIT, revalidation with 304. Each curl response tells where the part came from. Eyes on X-Cache.*

**1. Performance detective at the origin.** Inspect the headers:

```sh
curl -sI http://localhost:8082/estatico/app.js
```

Expected (shortened):

```text
HTTP/1.1 200 OK
...
ETag: "6650a1b2-14"
Cache-Control: public, max-age=10
```

**2. The 304 happening.** Take the ETag and ask "did it change?":

```sh
ETAG=$(curl -sI http://localhost:8082/estatico/app.js | tr -d '\r' | awk 'tolower($1)=="etag:" {print $2}')
curl -sI -H "If-None-Match: $ETAG" http://localhost:8082/estatico/app.js
```

Expected: `HTTP/1.1 304 Not Modified`, with no body. The server confirmed that the copy is still valid without resending the file.

The factory confirmed that the revision is still the current one. No part shipped.

**3. Miss and hit at the edge.**

```sh
for i in 1 2 3; do curl -s -D - -o /dev/null http://localhost:8081/estatico/app.js | tr -d '\r' | grep -i '^x-cache'; done
```

Expected:

```text
X-Cache: MISS
X-Cache: HIT
X-Cache: HIT
```

The first part came from the factory; the following ones came off the circuit's shelf.

**4. Cache Hit Ratio.** Twenty requests and the count:

```sh
for i in $(seq 1 20); do curl -s -D - -o /dev/null http://localhost:8081/estatico/app.js | tr -d '\r' | grep -i '^x-cache'; done | sort | uniq -c
```

Expected: `20 X-Cache: HIT` if you ran it right after step 3 (within the 10 s TTL). If more than 10 s have passed, the result is `1 X-Cache: REVALIDATED` and `19 X-Cache: HIT`: the edge already has the copy, so the first response after the TTL revalidates with the origin and `MISS` never shows up (`MISS` only happens when the edge has nothing stored, as in step 3). The hit ratio is `hits / (hits + misses)`: here, between 95% and 100%. Confirm that the origin was barely bothered:

```sh
docker compose logs origem | grep 'app.js' | wc -l
```

Expected: about `4`. Three of those lines come from the `curl -sI` calls you sent straight to the origin, on port 8082 (one from step 1 and two from step 2), and only one comes from the edge (the `MISS` from step 3). If the TTL expired before this step and there was a revalidation, one more line is added (the `304`). What matters: the 20 requests in this step were served by the edge, and the origin was consulted at most once (in the revalidation).

Almost all requests were resolved at the circuit, and the factory was barely bothered.

**5. Expiration and revalidation.** Wait for the TTL to pass and ask again:

```sh
sleep 11
curl -s -D - -o /dev/null http://localhost:8081/estatico/app.js | tr -d '\r' | grep -i '^x-cache'
docker compose logs origem | grep 'app.js' | tail -n 3
```

Expected: `X-Cache: REVALIDATED` and, in the origin logs, a line with `304` (the edge asked, the origin said "not modified", the TTL was renewed without transferring the file).

Deadline passed, ask the factory, revision confirmed, deadline renewed: all without freight.

**6. File that changed: expires and downloads again.**

```sh
echo 'console.log("v2");' > site/estatico/app.js
curl -s http://localhost:8081/estatico/app.js      # still v1, within the TTL
sleep 11
curl -s -D - http://localhost:8081/estatico/app.js | tr -d '\r' | grep -iE '^x-cache|console'
```

Expected: the first call shows `console.log("v1");` (edge copy, still valid). After the TTL, `X-Cache: EXPIRED` and `console.log("v2");` appear.

The factory released the new revision (`v2`), but the circuit kept using `v1` until the deadline expired. That is the staleness window the TTL buys.

**7. Simulated invalidation (purge).** Open source Nginx has no purge API; we simulate it by deleting the cache. First fill the cache, then "invalidate":

```sh
echo 'console.log("v3");' > site/estatico/app.js
curl -s http://localhost:8081/estatico/app.js        # v2 or v3, depending on the cache state
docker compose exec edge sh -c 'rm -rf /var/cache/nginx/edge/*'
docker compose restart edge
curl -s -D - http://localhost:8081/estatico/app.js | tr -d '\r' | grep -iE '^x-cache|console'
```

Expected: `X-Cache: MISS` and `console.log("v3");`, immediately, without waiting for the TTL. A real CDN does this through an API or panel, and that is why invalidating too much costs efficiency: each purge forces a new miss.

It is the forced recall: the circuit discards what it had and the next part comes straight from the factory.

**Cleanup (only after you also finish the exercises):**

```sh
docker compose down -v
cd ..
```

### Exercises

*Timed pit stop! Four exercises on what to cache, for how long, and what never goes on the shared shelf. This last one trips up many experienced teams.*

Exercises 1 and 2 need the stack up. If you already ran the cleanup above, bring it up again: from `lab-escalabilidade`, run `cd etapa-04 && docker compose up -d` (the `site/`, `origem/`, and `edge/` files remain on disk). After editing `origem/default.conf`, run `docker compose exec origem nginx -s reload`. When finished, repeat the cleanup.

1. **Cache the API.** In `origem/default.conf`, add `add_header Cache-Control "public, max-age=60";` in the `location /api/` and run `docker compose exec origem nginx -s reload`. Make 10 calls to `localhost:8081/api/produtos` before and after. What changes in `X-Cache`? What kind of API response is safe to cache this way? *Expected answer:* before, all 10 calls show up as `MISS`, because the response carries no `Cache-Control` and the edge does not store it (the origin is consulted every time); after, the first is `MISS` and the next 9 are `HIT` (within the 60 s). It is safe for public GET responses, identical for all users and that change little, like the product catalog; it does not suit personalized responses.
2. **When not to cache.** Change the value to `Cache-Control "private, no-store"`. Does `X-Cache` go back to `HIT`? Why should a logged-in user's data not stay on a shared edge? *Expected answer:* no, after the 60 s copy from the previous exercise expires (or is deleted, as in step 7) the calls go back to `MISS`, because `no-store` forbids the edge from storing the response. A logged-in user's data on a shared edge could be delivered to someone else, and `private` indicates that only the user's own browser may store it.
3. **How much to cache?** For each item, choose a TTL and justify it: company logo, versioned JavaScript bundle, product catalog, user's bank balance. *Expected answer (examples):* company logo, long TTL (days), because it almost never changes; versioned JavaScript bundle, very long TTL (months), because the file name changes with each version and the copy never goes stale; product catalog, short TTL (from seconds to a few minutes), accepting a small staleness; bank balance, do not cache (`private, no-store`), because it is personal data and changes all the time.
4. **Conceptual.** Explain, in three sentences, why the CDN's intelligent DNS is what makes the user in Lisbon talk to the Paris PoP and not to the server in Brazil. *Expected answer:* when the browser asks for the site's address, the query reaches the CDN's intelligent DNS. This DNS identifies the user's location by the IP and returns the IP of the closest PoP (Paris), instead of the origin's IP. The browser then connects to that PoP, which answers from the cache (hit) and only goes to Brazil if it does not have the copy (miss).

*Cockpit tip for exercise 2:* the set-up of a specific car never goes on the circuit's shared shelf, no matter how much time that would save.

### Remember this

> The CDN is cache close to the user; what rules it is the origin's `Cache-Control`, and the metric that matters is the Cache Hit Ratio.

> **In pit box terms:** a good part is a part that is already at the circuit; the factory decides how long it is valid, and what is measured is how many requests did not need it.

*Sector 4 in green! Most requests are already resolved at the circuit, without calling on the factory. And now attention, because the most feared chicane on the layout is coming: the database, the scalability "final boss". Stage 05, hold on tight.*

---

## Stage 05: Database scalability

*We have reached the chicane! Here it is not enough to "turn on three more", because the official engineering archive only accepts a revision in one place. Replica, cache-aside, sharding, CAP, RPO, and RTO: it is the densest stage of the GP, and it is where championships are decided. Breathe, you can do it.*

### The problem

The application is scaled, there is an LB and there is a CDN. But almost every relevant action (purchase, post, search) reads or writes data, and everything points to a single place: the database, the scalability "final boss". It is stateful and needs consistency, so you cannot simply "turn on three more" as we did with the API. On a Black Friday, the overloaded relational database is usually exactly the point that takes everything down.

On the team, the equivalent is the official engineering archive: all the part revisions and all the official set-ups. Read access can be copied to as many circuits as you like, but the release of a revision has to happen in one place only, or two versions of the same part go to the track.

### The concept

**The three challenges:**

- **Consistency:** an atomic transaction and subsequent reads seeing the correct result.
- **Concurrency:** multiple simultaneous accesses without corrupting data.
- **Latency:** fast operations even with more volume.

**Scaling reads.** The read-to-write ratio is usually high (for example, 100 to 1). Two tools:

1. **Caching** (Redis, Memcached) between the application and the database: the first line of defense. The **cache-aside** pattern works like this: the application tries the cache; on a *miss*, it fetches from the database and writes to the cache before returning.
2. **Read Replicas:** primary-replica model (formerly called master-slave). The primary receives all writes (INSERT, UPDATE, DELETE) and replicates them, usually asynchronously, to read-only replicas. The application implements **write splitting**: writes to the primary, reads distributed among the replicas.

**Cockpit perspective:** the primary is the official archive at the factory, the only place where writing happens. The read replica is the mirrored copy the team consults at the circuit, read-only, which follows the factory with a small delay. Write splitting is the team rule: a revision is only released at the factory; at the circuit, you only consult. Cache-aside is the garage's data board (the same Redis from Stage 03): the engineer looks at the board first; if the information is not there, he fetches it from the archive and writes it on the board before answering.

**Scaling writes.** All writes still go to one server. The solution is **sharding** (horizontal partitioning):

- **By range** (A to M on shard 1, N to Z on shard 2): simple, but creates *hotspots* if the distribution is not uniform.
- **By hash** (hash of the user ID): more even distribution, but makes range queries harder.

The complexity is immense, especially in **re-sharding**.

**Cockpit perspective:** imagine the parts archive split among warehouses, each with a range of part numbers (range) or with each part going to the warehouse defined by a calculation on its number (hash). The hotspot appears when one warehouse's range concentrates the most frequently replaced parts, like front wings, and it is always overloaded while the others sit idle. Opening a third warehouse later forces many parts to be moved: that is re-sharding. **Here the analogy stops:** this division is a logistics image, not a documented F1 team practice; it serves to visualize the mechanism.

**Distributed databases.** Amazon DynamoDB (NoSQL), CockroachDB (NewSQL), and Apache Cassandra (NoSQL) do sharding and replication transparently. In DynamoDB, the lesson's demonstration configures "read and write capacity units", that is, you declare how much reading and writing you expect.

**CAP theorem (Eric Brewer).** A distributed system guarantees only two of three properties at the same time:

- **Consistency:** all nodes see the same data.
- **Availability:** every request gets a response, with no guarantee that it is the most recent write.
- **Partition Tolerance:** operates even when communication between nodes breaks.

Since partitions are inevitable, the real choice is CP or AP. Traditional relational databases tend toward CP; Cassandra chooses AP, which leads to **Eventual Consistency**: without new writes, the replicas converge, but for a while different nodes may return different values.

**Cockpit perspective:** a partition is the radio dropping. The car is still on the track, the pit wall is still there, but one cannot hear the other. Two choices: keep driving with the last instruction received (available, perhaps outdated: AP) or pull in and wait for confirmation (consistent, but stopped: CP). Since the radio can always drop, the real question is which of the two you choose. Eventual consistency shows up in every race: after a round of stops, the broadcast timing tower and the official timing may diverge for an instant, and converge soon after. **Here the analogy stops:** the driver decides on the spot; in the database, the choice between CP and AP is one of design and configuration, made before the partition.

**Strategy and resilience.** Scaling vertically may still be the simplest and most effective up to a point; horizontal is more complex, with a higher ceiling and more resilience. Automated **failover** promotes a replica to primary. Two numbers defined by the business guide the design:

- **RPO (Recovery Point Objective):** how much data loss is tolerable. An RPO of 5 minutes means accepting the loss of the last 5 minutes of transactions.
- **RTO (Recovery Time Objective):** how long the system may be down. An RTO of 15 minutes means detection, failover, and return must take less than 15 minutes.

They dictate the choice between synchronous and asynchronous replication and the level of failover automation.

**Cockpit perspective:** database failover is the backup who followed everything through the headset taking over the radio when the regular race engineer drops out. RPO is what the backup did not manage to hear before the switch; RTO is how long I go without anyone on the radio. **Here the analogy stops:** in the database, the promoted replica starts accepting writes, and the old primary, if it comes back, cannot simply take over again without being rebuilt as a replica. Switching who speaks on the radio does not require that operational care.

**In the market (according to the material):** Google Spanner delivers strong global consistency with high availability using atomic clocks, and CockroachDB brings this idea to the market without Google's hardware. Serverless databases (Aurora Serverless, MongoDB Atlas Serverless, Neon) separate compute from storage and scale down to zero. HTAP (SingleStore, TiDB) unites OLTP and OLAP in a single system, avoiding ETL.

**How the lab fits in:** in Amazon RDS, creating a Read Replica takes a few clicks and AWS manages the replication. Here you will do by hand, with Postgres, what RDS hides: a replica by asynchronous *streaming replication*. You will also apply cache-aside with Redis.

In our mapping: `primary` is the archive at the factory, `replica` is the copy at the circuit, and `redis` is the garage board.

### Commented example: Postgres primary + replica + Redis

```sh
mkdir -p etapa-05 && cd etapa-05
```

`init-primary.sh` (runs once, when the primary is created):

```bash
#!/bin/bash
# Creates the user the replica will use to copy the data
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -c "CREATE ROLE replicador WITH REPLICATION LOGIN PASSWORD 'replica123';"
# Allows replication connections coming from other containers
echo "host replication replicador all scram-sha-256" >> "$PGDATA/pg_hba.conf"
```

`replica.sh` (replaces the replica's entrypoint):

```bash
#!/bin/bash
set -e
# Only does the initial copy if the data directory is still empty
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  chmod 700 "$PGDATA"   # Postgres requires restricted permission on the data directory
  # -R writes the standby configuration; -X stream also copies the WAL in real time
  # the password comes from the PGPASSWORD variable
  pg_basebackup -h primary -U replicador -D "$PGDATA" -R -X stream
fi
# Starts Postgres; because of -R, it comes up as a read-only replica
exec postgres
```

`docker-compose.yml`:

```yaml
name: lab-etapa-05

services:
  primary:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: senha123       # password of the postgres superuser
    volumes:
      - ./init-primary.sh:/docker-entrypoint-initdb.d/init-primary.sh:ro
    healthcheck:
      # -h 127.0.0.1 forces TCP: during initialization, the temporary server only listens on the local socket,
      # so this test only passes when the final server is up
      test: ["CMD-SHELL", "pg_isready -U postgres -h 127.0.0.1"]
      interval: 2s
      timeout: 2s
      retries: 30
  replica:
    image: postgres:16
    user: postgres                      # Postgres does not run as root
    environment:
      PGPASSWORD: replica123            # password of the replicador user
    volumes:
      - ./replica.sh:/replica.sh:ro
    entrypoint: ["bash", "/replica.sh"]
    depends_on:
      primary:
        condition: service_healthy      # waits for the primary to become healthy
  redis:
    image: redis:7-alpine
```

Bring it up and wait for the replica:

```sh
docker compose up -d
docker compose logs replica | tail -n 5
```

Expected at the end (it may take a few seconds): a line with `database system is ready to accept read only connections`.

### Hands-on

*Green flag in the lab! Primary, replica, and garage board up. You will watch the revision reach the circuit's copy with a delay and you will apply cache-aside by hand. Do not accelerate too early, because each step depends on the previous one.*

**1. Who is who.**

```sh
docker compose exec primary psql -U postgres -c "SELECT pg_is_in_recovery();"
docker compose exec replica psql -U postgres -c "SELECT pg_is_in_recovery();"
```

Expected: `f` on the primary and `t` on the replica (the replica is in recovery mode, that is, following the primary).

`f` is the factory, which writes; `t` is the circuit's copy, following the factory.

**2. Replication is alive (and asynchronous).**

```sh
docker compose exec primary psql -U postgres -c "SELECT client_addr, state, sync_state FROM pg_stat_replication;"
```

Expected:

```text
 client_addr |   state   | sync_state
-------------+-----------+------------
 172.x.x.x   | streaming | async
```

`async`: the circuit's copy receives the revisions with a delay, and the factory does not wait for confirmation to keep working.

**3. Write on the primary, read on the replica.**

```sh
docker compose exec primary psql -U postgres -c "CREATE TABLE produtos (id int primary key, nome text); INSERT INTO produtos VALUES (1,'Camiseta'),(2,'Caneca');"
sleep 1
docker compose exec replica psql -U postgres -c "SELECT * FROM produtos;"
```

Expected: both rows appear on the replica.

**4. The replica does not accept writes.**

```sh
docker compose exec replica psql -U postgres -c "INSERT INTO produtos VALUES (9,'Intruso');"
```

Expected: `ERROR:  cannot execute INSERT in a read-only transaction`. That is why the application needs write splitting.

The circuit's copy refuses the revision. Revisions, only at the factory.

**5. Eventual consistency, live.** Pause the application of changes on the replica, write on the primary, and compare:

```sh
docker compose exec replica psql -U postgres -c "SELECT pg_wal_replay_pause();"
docker compose exec primary psql -U postgres -c "INSERT INTO produtos VALUES (3,'Boné');"
echo "primary:"; docker compose exec primary psql -U postgres -tA -c "SELECT count(*) FROM produtos;"
echo "réplica:"; docker compose exec replica psql -U postgres -tA -c "SELECT count(*) FROM produtos;"
```

Expected: `3` on the primary and `2` on the replica. Now resume:

```sh
docker compose exec replica psql -U postgres -c "SELECT pg_wal_replay_resume();"
sleep 1
docker compose exec replica psql -U postgres -tA -c "SELECT count(*) FROM produtos;"
```

Expected: `3`. For a while, two nodes answered different things and then converged: eventual consistency.

Data link with the factory paused: the circuit still saw two parts while the factory already had three. Reconnected, converged.

**6. Cache-aside with Redis, reading from the replica.** Create `cache-aside.sh`:

```bash
#!/usr/bin/env bash
# usage: bash cache-aside.sh <product id>
chave="produto:$1"

# 1. Tries the cache (-T turns off the interactive terminal to capture the output)
valor=$(docker compose exec -T redis redis-cli GET "$chave" | tr -d '\r')
if [ -n "$valor" ]; then
  echo "HIT  $valor"
  exit 0
fi

# 2. Miss: fetches from the database (from the replica, which serves reads)
valor=$(docker compose exec -T replica psql -U postgres -tA -c "SELECT nome FROM produtos WHERE id = $1" | tr -d '\r')
if [ -z "$valor" ]; then
  echo "não encontrado"
  exit 1
fi

# 3. Writes to the cache with a 30 s expiry (EX) before returning
docker compose exec -T redis redis-cli SET "$chave" "$valor" EX 30 > /dev/null
echo "MISS $valor"
```

```sh
bash cache-aside.sh 1
bash cache-aside.sh 1
bash cache-aside.sh 1
docker compose exec redis redis-cli TTL produto:1
```

Expected: `MISS Camiseta`, then `HIT  Camiseta` twice, and an `(integer)` between 1 and 30 (the remaining seconds of the key's life).

The first request went to the archive (`MISS`) and wrote a note on the board; the following ones came off the board (`HIT`) until the note expired.

**7. The price of the cache: stale data.** Mind the clock: the cache key lives only 30 s. Run this step right after step 6; if more time than that has passed, run `bash cache-aside.sh 1` before the `UPDATE` to repopulate the cache, otherwise the stale data does not appear (you would see `MISS Camiseta Azul` directly). Change the data and read it again:

```sh
docker compose exec primary psql -U postgres -c "UPDATE produtos SET nome='Camiseta Azul' WHERE id=1;"
bash cache-aside.sh 1
```

Expected: `HIT  Camiseta`. The cache serves the old value until it expires. Invalidate when writing:

```sh
docker compose exec redis redis-cli DEL produto:1
bash cache-aside.sh 1
```

Expected: `MISS Camiseta Azul`. Whoever writes needs to invalidate (or accept the TTL as a staleness window).

It is the garage board showing the old revision after the factory changed the part. Whoever releases the revision has to erase the note on the board.

**Cleanup (only after you also finish the exercises):**

```sh
docker compose down -v
cd ..
```

### Exercises

*Decisive moment of the race! Sharding, a cut radio, and a failover done by yourself, stopwatch in hand. Remember Monaco 2015: Lewis Hamilton was leading comfortably, Mercedes calculated the gap with delayed data, called the car into the pit box under the safety car, and he came back behind Nico Rosberg and Sebastian Vettel, losing a win that was guaranteed. A decision made with old information costs a lot, and that is why, in the database, the choice between CP and AP is made before the partition.*

1. **Sharding by hash, and the cost of re-sharding.** Distribute 10 IDs across 2 shards by modulo (a very simple hash) and then see how many IDs change shard when going to 3 shards:

```sh
for id in $(seq 1 10); do echo "usuario $id -> shard $((id % 2))"; done

mudou=0
for id in $(seq 1 1000); do
  # compares the old shard (2 shards) with the new one (3 shards)
  if [ $((id % 2)) -ne $((id % 3)) ]; then mudou=$((mudou + 1)); fi
done
echo "IDs que trocaram de shard: $mudou de 1000"
```

Expected: `667 de 1000`. About two thirds of the data would need to migrate: that is the pain of re-sharding. Sharding by range has another problem: which one? (Hint: hotspots.) Databases like Cassandra and DynamoDB do this work transparently.

2. **Network partition (CAP in practice).** Disconnect the replica from the network, write on the primary, and read from both sides:

```sh
docker network disconnect lab-etapa-05_default $(docker compose ps -q replica)
docker compose exec primary psql -U postgres -c "INSERT INTO produtos VALUES (4,'Chaveiro');"
docker compose exec primary psql -U postgres -tA -c "SELECT count(*) FROM produtos;"
docker compose exec replica psql -U postgres -tA -c "SELECT count(*) FROM produtos;"
```

Expected: the primary with one more row than the replica. The replica **answered** (availability) with possibly stale data (no consistency). Reconnect with `docker network connect lab-etapa-05_default $(docker compose ps -q replica)` and wait up to about 1 minute: the old replication connection may hang until `wal_receiver_timeout` expires (60 s by default), and the replica may also come back with another IP. Then run `count(*)` again and confirm the numbers converge. To follow along, run on the replica `docker compose exec replica psql -U postgres -c "SELECT status FROM pg_stat_wal_receiver;"` (when replication returns, the status is `streaming`). If your priority were consistency, what should the replica have done during the partition? *Expected answer:* choosing consistency (CP), the replica should refuse the read, returning an error or going out of rotation, while it could not confirm that it is up to date with the primary: the price is availability during the partition. The lab showed the other side, the choice for availability (AP): the replica answered with what it had, and the nodes converged afterwards (eventual consistency).

On the track: it is the cut radio. The replica kept answering with the last information it had, like the driver who follows the old plan.

3. **Manual failover and the RTO.** Take down the primary and promote the replica:

```sh
docker compose stop primary
time docker compose exec replica psql -U postgres -c "SELECT pg_promote();"
docker compose exec replica psql -U postgres -c "SELECT pg_is_in_recovery();"
docker compose exec replica psql -U postgres -c "INSERT INTO produtos VALUES (5,'Adesivo');"
```

Expected: `pg_promote` returns `t`, `pg_is_in_recovery` becomes `f`, and the INSERT works. You have just done a failover. Answer: which part of the RTO was automatic, and which depended on you? With asynchronous replication, what may have been left behind at the moment of the crash (that is, which RPO did you accept)? To start over, run `docker compose down -v` and bring everything up again. *Expected answer:* almost none of the RTO was automatic: noticing the outage, deciding to promote, and running `pg_promote` depended on you (a managed service such as RDS automates detection and promotion). As for the RPO, with asynchronous replication the transactions already committed on the primary that had not yet reached the replica at the moment of the crash are lost; in the lab, on a local network, it is usually little or nothing, but there is no guarantee, and that window is what the RPO measures.

You have just been the backup taking over the radio. The time it took to notice and act is the RTO.

4. **RPO and RTO.** The business defines an RPO of 5 minutes and an RTO of 15. Synchronous or asynchronous replication? Can the failover be manual? Justify. *Expected answer:* asynchronous replication is enough, because the business accepts losing up to 5 minutes of transactions, as long as the replica's lag is monitored and stays within that limit; synchronous would only be necessary if the RPO were close to zero. The failover can be manual if the team can detect, decide, and promote with room to spare within the 15 minutes (with on-call and a tested runbook); automating it reduces the risk of exceeding the RTO and of human error, at the cost of more complexity.

### Remember this

> Reads scale with cache and replicas; writes only scale by partitioning (sharding), and everything else is consciously choosing between consistency and availability.

> **In pit box terms:** consult at as many circuits as you like; revise only at the factory; and when the radio drops, decide beforehand whether the car keeps going or pulls in.

*Sector 5 in green, and it went through the chicane without touching the curb! Reads scaled with a copy and a cache, revisions protected at the factory, and a failover executed with your own hands. One last lap remains: putting all the pieces together and turning on the telemetry. Stage 06, the victory lap.*

---

## Stage 06: Scalable architectures in the real world

*Final stage! Now it is not a loose part: it is the integrated operation of an entire GP weekend, from the stock at the circuit to the factory's operations room. And architecture without telemetry is driving with your eyes closed. On to the debrief.*

### The problem

Last lesson. You have all the pieces (fundamentals, LB, patterns, CDN, database), but loose pieces are not an architecture. Consider the case of the fictional e-commerce: a traditional monolith, with application and database on the same server, went down on Black Friday. Where exactly was the failure? And, after rebuilding, how do you know where the next bottleneck is? This stage asks for the architect's view: the complete floor plan, each piece justified, and the instruments to see the system working.

It is the Sunday night debrief after a bad race: it is not enough to know that it went wrong; you need to know on which lap, in which system, and why, and the answer comes from the data.

### The concept

**Serverless.** With AWS Lambda, we have maximum abstraction: the developer sends the function and the provider provisions, patches, and scales. It runs hundreds of executions per second, and goes back to zero (including cost) when demand disappears.

**Here the analogy stops:** there is no good serverless equivalent in F1. The closest is a customer team that receives the power unit ready-made from the manufacturer and does not handle its development, but no team scales down to zero and stops paying when it is not racing.

**Scalable monolith vs microservices:**

| | Scalable monolith | Microservices |
|---|---|---|
| Idea | Not inherently bad: stateless and well designed, it runs in an ASG and scales horizontally | Small services by business capability (catalog, payment) |
| Gains | Simplicity of development, testing, deploy, and debugging (everything in the same process) | Granular scaling, team independence, technological flexibility |
| Costs | Scales the whole system together | Massive operational complexity, latency and new points of failure on the network, hard distributed debugging |

**Conway's Law:** the architecture reflects the communication structure of the organization. Small, autonomous teams tend toward microservices; centralized teams tend toward monoliths.

**Cockpit perspective:** a monolith is the car designed and operated as a single piece, by a single structure; microservices are independent departments (aerodynamics, power unit, chassis, strategy), each with its own interface. Conway's Law is one of the most visible things in the paddock: the car reflects the organization of whoever designs it. Mercedes, with the chassis in Brackley and the power unit in Brixworth, depends on very well-defined interfaces between the two sites.

**Where is the bottleneck? Observability.** The bottleneck may be in CPU, memory, disk I/O, a query, a third-party API, network latency, or a poorly configured cache. Without instruments, you guess. The three pillars:

| Pillar | What it is | Answers |
|---|---|---|
| **Metrics** | Numbers aggregated over time (CPU, latency, error rate) | **What** is happening; they trigger alerts |
| **Logs** | Discrete events with a timestamp | **Why** it happened |
| **Traces** | The journey of a request through the services (distributed tracing) | **Where** the time was spent |

**Cockpit perspective:** this I live from the inside. Metrics are the live telemetry, hundreds of channels that say what is happening and trigger an alarm on the pit wall. Logs are the radio and the chronological record of events: they explain why something happened. Traces are the mini-sector times of a lap: they show exactly where I lost the time. The thread that stitches it all together is the identifier: the car's transponder, the same number at every timing loop, like the `X-Request-ID` that you will follow in the lab.

**How the big ones do it (according to the material):** Google has an SRE culture (operations as a software problem, automation, error budgets, and SLOs); Amazon practices "you build it, you run it" (each team operates and scales its own service); Nubank is cloud-native, with microservices, functional programming, and robust observability for explosive growth (microservices, Clojure and Datomic for consistency in a distributed environment, with a strong culture of automation and testing in a regulated business). The SRE trend replaces "Operations" teams with SRE, with SLOs, error budgets, and the authority to prioritize stability when the error budget runs out. The Platform Engineering trend builds an Internal Developer Platform (IDP) with CI/CD, IaC, observability, and security as a service, reducing the cognitive load on product teams.

SLO and error budget have a direct parallel. Each driver has a limited number of power unit components (engine, battery, and the like) for the entire season; use more than the allotment and you lose places on the starting grid. That allotment works like an error budget: while there is slack, the team takes more risk; when it runs out, the priority changes to reliability. Russell's retirement in Sepang, apparently from a power unit failure, is the kind of event that consumes this budget. **Here the analogy stops:** the allotment is an external regulation, with a sporting penalty; the error budget is an internal agreement between product and operations.

**The case study: refactoring the e-commerce.** The monolith with application and database on the same server went down on Black Friday. The failure points: no LB, stateful application, overloaded database, no CDN. The redesign, step by step, ties together each stage of this guide:

| Stage | Problem | Piece added |
|---|---|---|
| 04 (CDN) | Static assets weighing on the origin, distance from the user | CDN (CloudFront) serving the assets |
| 02 (LB) | Single point of failure | Load Balancer (ALB) in front |
| 01 and 03 (Scale and patterns) | Application and database on the same server; stuck state; slow tasks in the path | Application separated from the database, stateless, in an ASG; emails and slow processes decoupled by a queue (SQS) |
| 05 (Database) | Overloaded database | Database on a managed service (RDS) with Read Replicas |

Result: from a fragile architecture to a distributed, resilient, and scalable system.

In track terms, it is the integrated operation of a GP weekend: stock at the circuit (CDN), pit lane entry control (load balancer), interchangeable pit boxes (stateless application), the garage's central board (Redis), analysis pile and factory engineers (queue and workers), and the official archive with copies at the circuit (database with replicas).

### Commented example: the complete architecture, local

We will build the "after" version of the case: **edge (CDN) → load balancer → 3 stateless replicas → Redis (state and queue) → worker**. The database part with read replicas you already built in Stage 05 and it plugs in behind the API in the same way; here the focus is the request chain and observability, so the compose does not get enormous.

On the track: stock at the circuit, pit lane entry, three pit boxes, central board, and the operations room engineer.

```sh
mkdir -p etapa-06/edge etapa-06/lb etapa-06/site/estatico && cd etapa-06
echo 'console.log("loja");' > site/estatico/app.js
```

`docker-compose.yml`:

```yaml
name: lab-etapa-06

services:
  edge:                                  # the "CDN": caches and delivers
    image: nginx:1.27-alpine
    ports:
      - "8080:80"                        # only port exposed to the world
    volumes:
      - ./edge:/etc/nginx/conf.d:ro
    depends_on:
      - lb
  lb:                                    # the "ALB": distributes among the replicas
    image: nginx:1.27-alpine
    volumes:
      - ./lb:/etc/nginx/conf.d:ro
      - ./site:/usr/share/nginx/html:ro  # static assets (the CDN's origin)
    depends_on:
      - app
  app:                                   # the stateless monolith, in 3 replicas (the "ASG")
    build: ../app
    image: lab-app
    environment:
      MODO: redis                        # state in Redis
      REDIS_HOST: redis
    deploy:
      replicas: 3
  worker:                                # consumer of the order queue
    build: ../app
    image: lab-app
    command: ["python", "-u", "worker.py"]
    environment:
      REDIS_HOST: redis
    depends_on:
      - redis
    restart: on-failure
  redis:                                 # session/cart and queue
    image: redis:7-alpine
```

`edge/default.conf`:

```nginx
proxy_cache_path /var/cache/nginx/edge levels=1:2 keys_zone=edge:10m max_size=100m inactive=10m;

server {
    listen 80;
    location / {
        proxy_pass http://lb:80;                      # the edge's "origin" is the load balancer
        proxy_cache edge;
        proxy_cache_revalidate on;
        add_header X-Cache $upstream_cache_status always;
    }
}
```

`lb/default.conf`:

```nginx
upstream backend {
    zone backend 64k;                   # round-robin state shared among the Nginx worker processes
    server app:8080 max_fails=1 fail_timeout=10s;
}

# Log format with the request ID: it is our home-made "trace"
log_format rastreio '$remote_addr "$request" $status rid=$request_id upstream=$upstream_addr';

server {
    listen 80;
    access_log /dev/stdout rastreio;

    # Static assets: served right here, with a TTL, for the edge to cache
    location /estatico/ {
        root /usr/share/nginx/html;
        add_header Cache-Control "public, max-age=30";
    }

    # Everything else goes to the application
    location / {
        proxy_pass http://backend;
        proxy_set_header X-Request-ID $request_id;    # the application logs this ID in its logs
        proxy_connect_timeout 1s;
        proxy_next_upstream error timeout;
    }
}
```

`verificar.sh` checks one property from each stage of the guide:

It is the pre-race checklist: each line checks one system before the car goes to the grid.

```bash
#!/usr/bin/env bash
# usage: bash verificar.sh (with the stack up)
base=http://localhost:8080
ok()    { echo "OK     $1"; }
falha() { echo "FALHA  $1"; }

# Stage 04: the second read of an asset must come from the edge
curl -s -o /dev/null "$base/estatico/app.js"
x=$(curl -s -D - -o /dev/null "$base/estatico/app.js" | tr -d '\r' | grep -i '^x-cache' | awk '{print $2}')
[ "$x" = "HIT" ] && ok "asset servido pela borda (HIT)" || falha "asset não veio do cache (x-cache=$x)"

# Stages 01 and 02: the load must be distributed among 3 replicas
n=$(for i in $(seq 1 12); do curl -s "$base/"; done | awk '{print $1}' | sort -u | wc -l)
[ "$n" -eq 3 ] && ok "requisições distribuídas em 3 réplicas" || falha "só $n réplica(s) responderam"

# Stage 03: the cart written by one replica must be seen by all (stateless)
curl -s -o /dev/null -X POST "$base/carrinho?user=teste&item=livro"
n=$(for i in 1 2 3; do curl -s "$base/carrinho?user=teste"; done | grep -c livro)
[ "$n" -eq 3 ] && ok "carrinho visível em qualquer réplica" || falha "carrinho inconsistente ($n/3)"

# Stage 03: the order must be accepted immediately (202) and processed later by the worker
c=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$base/pedido?id=99")
[ "$c" = "202" ] && ok "pedido aceito de forma assíncrona (202)" || falha "pedido devolveu $c"
```

### Hands-on

*Qualifying lap, everything on the line! The complete stack comes up, the verification script goes through each sector, and the transponder (the X-Request-ID) stitches each pass together. If an ok shows up on every line, it is pole position.*

**1. Bring it up and verify.**

```sh
docker compose up -d --build
sleep 3
bash verificar.sh
```

Expected:

```text
OK     asset servido pela borda (HIT)
OK     requisições distribuídas em 3 réplicas
OK     carrinho visível em qualquer réplica
OK     pedido aceito de forma assíncrona (202)
```

Four green lights on the checklist: the car can go to the grid.

**2. Resilience: take down a replica.**

```sh
docker stop $(docker compose ps -q app | head -n 1)
for i in $(seq 1 20); do curl -s -o /dev/null -w "%{http_code}\n" "localhost:8080/"; done | sort | uniq -c
```

Expected: `20 200`. Bring it back up and refresh Nginx, which resolves names only at startup and the replica may come back with another IP:

```sh
docker compose up -d
docker compose exec lb nginx -s reload
```

One pit box closed and no car noticed.

**3. Before and after, in numbers.** Use the load function from Stage 01 (redefine it if you opened a new terminal) against the architecture and against a single-instance "monolith":

```sh
carga() { time (seq 1 100 | xargs -P 20 -I{} curl -s -o /dev/null "$1"); }

# After: edge, LB, and 3 replicas
carga http://localhost:8080/

# Before: a single stateful instance, no LB and no edge
docker run -d --name monolito -p 8090:8080 -e MODO=memoria lab-app
carga http://localhost:8090/
```

Expected: about 1.7 s against about 5 s. Now the single point of failure:

```sh
docker stop monolito
curl -s -o /dev/null -w "%{http_code}\n" --max-time 2 localhost:8090/
```

Expected: `000`. Remove it with `docker rm monolito`.

The `000` is the monolith: a single pit box and nowhere to divert to, like the car stopped on the straight in Sepang.

**4. Observability, the three pillars with what we have.**

*Metrics* (what):

```sh
docker stats --no-stream
```

Expected: a table with the CPU and memory of each container (`NAME`, `CPU %`, `MEM USAGE / LIMIT`...).

*Logs* (why). The application logs each request:

```sh
curl -s "localhost:8080/carrinho?user=ana" > /dev/null
docker compose logs --no-color app | tail -n 3
```

Expected: lines like `app-2  | [9f8e7d6c5b4a] GET /carrinho?user=ana rid=4c1d...`.

*Traces* (where). Follow a request ID through the layers:

```sh
RID=$(docker compose logs --no-color lb | grep carrinho | tail -n 1 | grep -o 'rid=[a-f0-9]*')
echo "seguindo $RID"
docker compose logs --no-color lb app | grep "$RID"
```

Expected: two lines with the **same** `rid`, one from the `lb` (with `upstream=` showing which replica was chosen) and another from the `app` (the replica that served). It is a mini distributed trace: the same identifier stitching the request's path across two layers. Real tracing tools do this automatically and measure the time of each segment.

It is the transponder: the same number appears at the pit lane entry loop (the `lb`, which records which pit box it sent the car to) and at the pit box that serviced it (the `app`).

**Cleanup:**

```sh
docker compose down -v
docker rm -f monolito 2>/dev/null
cd ..
```

### Exercises

*Last lap of the GP! Five exercises that test the whole guide at once, from the Black Friday diagnosis to the error budget. Abu Dhabi 2010 is there to remind us: in the last race of the year, Fernando Alonso arrived as championship leader, Ferrari brought his stop forward to react to the wrong rival (Mark Webber), he came back stuck behind Vitaly Petrov until the flag, and the title went to Sebastian Vettel. Looking at the right data is half the race.*

1. **Diagnosis.** The e-commerce below went down on Black Friday. List the failure points and, for each one, the piece of the guide that solves it and in which stage it was studied:
   - application and database on the same server;
   - cart in a session variable;
   - images and JavaScript served by the application itself;
   - confirmation email sent before responding to the customer;
   - a single server in front of everything.

   *Expected answer:* application and database on the same server, separate the two (application on its own instances, database on a managed service with read replicas; Stages 01, 03, and 05); cart in a session variable, stateless application with the state in Redis or in the database (Stage 03); images and JavaScript served by the application, CDN in front (Stage 04); email before responding, queue and workers, with the producer answering immediately (Stage 03); single server in front, load balancer with a fleet of instances (Stages 01 and 02).
2. **Monolith or microservices?** A startup with 6 people, a single team, wants to "be like Nubank". Use Conway's Law and the cost table to argue in favor of a scalable monolith (stateless, in an ASG) as a starting point. *Expected answer:* by Conway's Law, a single, centralized team tends to produce (and to operate well) a monolith; microservices reflect small, autonomous teams, which the startup does not yet have. The table shows the price of microservices: massive operational complexity, latency and new points of failure on the network, hard distributed debugging. A stateless monolith, in an ASG, scales horizontally with simplicity of development, testing, deploy, and debugging, and can be split later, when teams and bottlenecks that justify it appear.
3. **Bottleneck or pillar?** You see the latency of `/carrinho` triple. Which pillar do you consult first to know *that* something changed, which to know *why*, and which to know *where* the time was spent? *Expected answer:* metrics to know **that** something changed (and trigger the alert), logs to know **why**, and traces to know **where** the time was spent, across the services the request went through.
4. **Error budget (calculation).** A 99.9% availability SLO over 30 days leaves how many minutes of downtime budget? (Hint: 30 days have 43,200 minutes.) *Answer:* 0.1% of 43,200 = 43.2 minutes.
5. **Upgrade plan.** Write what you would add to `docker-compose.yml` to include the Stage 05 primary and replica database behind the API, and how the application would do write splitting. *Expected answer:* add the `primary` and `replica` services to the compose (with `init-primary.sh`, `replica.sh`, and the healthcheck from Stage 05) and pass `app` the addresses of both through environment variables. In write splitting, write commands (INSERT, UPDATE, DELETE) go to the `primary` and reads (SELECT) to the `replica`, preferably with Redis cache-aside in front. The test application does not talk to Postgres, so a Postgres client would need to be added to it.

### Remember this

> A scalable architecture is the right combination of simple pieces (edge, balancer, stateless application, queue, database with replicas), and it only stays that way if you can see the system through metrics, logs, and traces.

> **In pit box terms:** stock at the circuit, single entry, interchangeable pit boxes, pile for the factory, archive with a copy; and telemetry, radio, and mini-sectors to know where the next tenth of a second is.

*Sector 6 in green! Six sectors complete, with telemetry, radio, and mini-sectors on. Now it is the home straight, straight to the checkered flag.*

---

## Self-assessment checklist

*Final stretch, checkered flag in sight! This is the parc fermé inspection: tick honestly, because the stewards do not accept a memorized answer.*

Tick only what you can do **without consulting the text**.

**Stage 01: Fundamentals**

- [ ] I explain the difference between performance, optimization, and scalability with an example.
- [ ] I can say why scaling does not reduce the latency of a single request.
- [ ] I compare vertical and horizontal scaling, including the SPOF concept.
- [ ] I differentiate metric-based, scheduled, and predictive autoscaling.
- [ ] I recognize when NOT to scale.

**Stage 02: Load balancers**

- [ ] I differentiate L4 and L7 and give a use for each.
- [ ] I explain round-robin, least connections, and IP hash, with one disadvantage of each.
- [ ] I describe health check, failover, and connection draining.
- [ ] I run and explain a canary and a blue/green switch.
- [ ] I can configure an `upstream` in Nginx and reload the configuration.

**Stage 03: Horizontal scaling patterns**

- [ ] I explain why stateful gets in the way of balancing and how Redis solves it.
- [ ] I reproduce the in-memory cart problem and the fix.
- [ ] I explain the producer, queue, and worker pattern, and why workers scale by queue size.
- [ ] I write a retry with exponential backoff and explain the role of the fallback.
- [ ] I know what sidecar, ambassador, ReplicaSet, and ASG are.

**Stage 04: CDNs**

- [ ] I explain how intelligent DNS brings the user closer to a PoP.
- [ ] I read `Cache-Control` and `ETag` with `curl` and provoke a `304`.
- [ ] I differentiate HIT, MISS, EXPIRED, and REVALIDATED.
- [ ] I calculate the cache hit ratio and know why invalidating too much is bad.
- [ ] I decide what to cache and what not to cache at an edge.

**Stage 05: Database**

- [ ] I explain cache-aside and implement the flow with Redis.
- [ ] I explain primary-replica, asynchronous replication, and write splitting.
- [ ] I demonstrate eventual consistency with a replica.
- [ ] I compare sharding by range and by hash and explain the pain of re-sharding.
- [ ] I explain the CAP theorem, RPO, and RTO with an example.

**Stage 06: Architectures in the real world**

- [ ] I diagnose the failure points of a monolith and redesign the architecture, justifying each piece.
- [ ] I compare a scalable monolith and microservices and cite Conway's Law.
- [ ] I associate metrics, logs, and traces with the questions "what", "why", and "where".
- [ ] I run and interpret the verification of the complete architecture.
- [ ] I explain SLO and error budget.

*CHECKERED FLAG! If the boxes are ticked, step onto the podium: you started out not knowing whether your problem was speed or volume and crossed the line with a load balancer, a stateless application, a queue, an edge, a database replica, and telemetry in your pocket. And championships are decided until the last corner: at Interlagos, in 2008, Lewis Hamilton recovered fifth place on the last lap and was champion by one point. Left a box blank? No drama: pit, adjust, and get back on the track. Next, the behind-the-scenes notes from the driver and the professor.*

---

## Driver's notes: where the analogies break down

The F1 layer does not change commands, code, expected outputs, or exercises; technical corrections came from the professor's review. The points where the comparison does not fully hold:

1. **One pit box per team, two cars.** Real F1 is "sticky" by regulation: each car only stops at its own team's pit box. Round-robin among pit boxes of different teams does not exist, and the pit lane entry control that distributes cars is a figure imagined for the analogy.
2. **One car at a time.** A pit box services one car at a time; the double stack is sequential. The lab's `CAPACIDADE` is an imaginary pit box with several service positions.
3. **Elasticity.** A team's staff is limited and fixed over the weekend. Replicas and workers go up and down in minutes, and billing follows usage.
4. **Canary.** With two cars, the smallest canary in F1 is 50% of the fleet. The canary's business metrics (conversion, engagement) have no equivalent on the track.
5. **Queue without acknowledgment.** An engineer who drops the analysis halfway does not make the tire vanish from the pile. The lab's Redis list does: if the worker dies in the middle of the task, the message is lost (see the professor's notes). SQS and RabbitMQ are more like Pirelli's pile.
6. **Part and data.** A physical part changes place; a cached file is a copy, and the origin keeps the original.
7. **Sharding.** The warehouse split by part number is a logistics image, not a documented team practice.
8. **CAP.** The driver decides on the spot whether to keep going or pull in; in the database, CP or AP is a design and configuration decision, made before the partition.
9. **Database failover.** The old primary does not take over again by itself when it returns; it needs to be rebuilt as a replica. Switching who speaks on the radio does not require that care.
10. **Serverless.** There is no good parallel: no team scales down to zero.
11. **Error budget.** The power unit component allotment is an external regulation with a sporting penalty; the error budget is an internal agreement between product and operations.

## F1 data sources (consulted on 2026-10-05)

- 2026 drivers' standings: [RacingNews365](https://racingnews365.com/f1/standings/2026/drivers) and [Formula One History](https://www.formulaonehistory.com/results/2026-f1-drivers-championship-standings/).
- Round 16 report (Bahrain GP in Sepang, October 4, 2026): [Formula1.com](https://www.formula1.com/en/latest/article/verstappen-wins-rain-hit-bahrain-gp-in-malaysia-over-antonelli-as-russell-retires-late-on.6qfpIHPch8mIVj2YgfHdCp), [Al Jazeera](https://www.aljazeera.com/sports/2026/10/4/red-bulls-verstappen-wins-rain-delayed-bahrain-gp-f1-race-in-sepang) and [Sky Sports](https://www.skysports.com/f1/news/13594860/bahrain-gp-in-malaysia-max-verstappen-wins-first-race-of-2026-f1-season-in-wild-rain-hit-grand-prix-as-lewis-hamilton-surges-back).
- 2026 Singapore GP: [Formula1.com](https://www.formula1.com/en/racing/2026/singapore).

---

## Appendix: complete reference table

All the analogies used in the document, in the order in which they appear. The ten central ones are in the table at the beginning.

| Scalability | Formula 1 |
|---|---|
| Request | A car entering the pit lane to be serviced |
| Server, instance, or application replica | A pit box with its complete pit stop crew |
| `lab-app` image | The standard pit stop procedure, identical in every pit box assembled from it |
| Latency (performance) | The duration of a pit stop: how long a car stays in service |
| Throughput | How many cars the pit lane returns to the track per second |
| Optimization | Training the crew so the same pit stop takes less time, with no extra people |
| `CAPACIDADE` (the lab's semaphore) | How many cars a pit box can service at the same time |
| Requests waiting their turn | The double stack: the car behind waiting for the one in front to leave the jack |
| Vertical scaling | A bigger pit box, with more people and more wheel guns |
| Horizontal scaling | More identical pit boxes in the pit lane |
| Single point of failure (SPOF) | A component with no spare, like the power unit: if it fails, the race is over |
| Elasticity and autoscaling | Opening and closing pit boxes according to pit lane traffic, following rules defined beforehand |
| Metric-based autoscaling | Reacting to the size of the queue of cars in the pit lane |
| Scheduled autoscaling | Crew positioned for the pit window that was already in the race plan |
| Predictive autoscaling | The weather radar anticipating the rain and the switch to intermediates |
| Performance, cost, and complexity triangle | The cost cap: performance, budget, and complexity competing for the same resource |
| Load balancer | The pit lane entry control, which directs each car to a free pit box |
| L4 balancing | The timing loop: reads the transponder, never the request |
| L7 balancing | The engineer who listens to the radio and understands the request ("soft tires and more wing") |
| External LB | The pit lane entry, where whoever comes from the track arrives |
| Internal LB | The garage intercom, which connects departments without going through the track |
| Round-robin | Each car goes to the next pit box in a circular line |
| Weighted round-robin | The pit box with the bigger crew receives more cars |
| Least connections | The car goes to the pit box with the fewest cars in service |
| IP hash and sticky session | Each car always in its own team's pit box (this is how real F1 works) |
| Active health check | The periodic radio check with each pit box |
| Passive health check (Nginx) | Discovering that the pit box has a problem only when a real car fails in it |
| Failover | Diverting the car to another pit box when its own is out of action |
| Connection draining | Finishing the pit stop in progress before closing the pit box |
| Blue/Green | Two complete car specifications ready, with a full switch from one to the other |
| Canary | The upgrade package fitted first on a single car |
| Rollback | Going back to the previous specification, the one that worked |
| Ingress | The signs at the pit lane entry, indicating the destination of each type of service |
| Stateful | The mechanic who keeps the car's set-up in his head |
| Stateless | The set-up written in the central system: any mechanic from any pit box continues the work |
| Redis (state, queue, and cache) | The garage's live data board, shared by all the pit boxes |
| ReplicaSet and ASG | The team principal's rule: "N pit boxes ready, always" |
| Producer | The pit box that services the car and returns it to the track immediately |
| Message queue | The pile of used tires and stop data waiting for analysis |
| Worker | The operations center engineer at the factory, processing that pile later |
| `202 Accepted` | "Pit box confirmed": the car is already back on the track, the analysis comes later |
| KEDA | Calling more engineers into the operations room as the pile grows |
| Sidecar | The data logger installed next to the car's systems, which records without the car knowing |
| Ambassador | The team manager, who talks to race control on behalf of the team |
| Retry with exponential backoff | Repeating the radio call, waiting longer and longer between attempts |
| Fallback | The strategy plan B, calculated before the start |
| Circuit breaker | The pit lane entry closed: nobody tries to enter while the problem exists |
| CDN | The network of freight kits and parts stocks pre-positioned along the calendar |
| Origin | The factory (Brackley, Maranello, Milton Keynes, Woking) |
| PoP or edge | The parts stock set up at the circuit |
| Cache miss | The part that is not at the circuit and has to come from the factory |
| Cache hit | The part delivered straight from the circuit's shelf |
| `Cache-Control` and TTL | The factory defines how long a part is cleared for use on the track |
| ETag and `304 Not Modified` | The part's revision number: "is revision C still valid?", "yes, keep using it" |
| Invalidation (purge) | The recall: withdrawing a part from all circuits at once |
| CDN intelligent DNS | The logistics that sends for the part from the closest stock |
| Cache hit ratio | The percentage of requests resolved at the circuit, without calling on the factory |
| WAF | The paddock credentials turnstile |
| Edge computing | Engineering done at the circuit itself, without waiting for the factory |
| Primary database | The official engineering archive at the factory: the only place where writing happens |
| Read replica | The mirrored copy of the archive, consulted at the circuit, read-only |
| Asynchronous replication | The revision reaches the circuit's copy with a delay, without the factory waiting for confirmation |
| Write splitting | A revision is only released at the factory; at the circuit, you only consult |
| Cache-aside | Look at the garage board first; if it is not there, fetch it from the archive and write it on the board |
| Eventual consistency | The broadcast timing tower and the official timing diverging for an instant and converging |
| Sharding | The parts archive split among warehouses, each with its share of the part numbers |
| Network partition and CAP theorem | The radio drops: keep going with the last instruction (AP) or pull in and wait for confirmation (CP) |
| Database failover (replica promotion) | The backup who heard everything through the headset takes over the radio when the regular race engineer drops out |
| RPO | What the backup did not manage to hear before the switch |
| RTO | How long the driver goes without anyone on the radio |
| Monolith | The car designed and operated as a single piece, by a single structure |
| Microservices | Independent departments (aerodynamics, power unit, chassis, strategy) with defined interfaces |
| Conway's Law | The car reflects the organization of the team that designs it |
| Metrics | The live telemetry: what is happening |
| Logs | The radio and the chronological record of events: why it happened |
| Traces | The mini-sector times of a lap: where the time was spent |
| `X-Request-ID` | The transponder: the same number stitching each pass through the timing loops |
| SLO and error budget | The power unit component allotment per season: use more than the allotment, lose places on the grid |
| Complete architecture | The integrated operation of a GP weekend, from the stock at the circuit to the factory's operations room |

---

## Professor's notes

**Clarifications and corrections to the raw material:**

1. **CAP theorem.** The text says the system "guarantees only two of three" properties. The more precise reading is that, **during a network partition**, you must choose between consistency and availability. Without a partition, a system can offer both. That is why the sentence "the real choice is CP or AP" from the material itself is the one that holds. Classifying databases as "CP" or "AP" is also a simplification: many allow adjusting the behavior through configuration.
2. **Hystrix.** The material cites the Hystrix library as the one that popularized the Circuit Breaker. It is a correct historical fact, but the library is in maintenance mode (Netflix itself stopped developing it) and the Hystrix repository itself recommends alternatives such as Resilience4j. The pattern remains valid; it is the library that became a historical reference.
3. **`X-Cache` header.** The material treats `X-Cache` (Hit/Miss) as something the CDN simply sends. This header is **not part of an HTTP standard**: it is a convention of each provider and the format of the value varies among them. What is standardized is `Cache-Control`. In the lab, we define `X-Cache` ourselves at the edge.
4. **ReplicaSet vs Deployment.** The material presents the ReplicaSet as a unit of scale, which is correct. In practice, you usually create a **Deployment**, which manages ReplicaSets and adds gradual updates and rollback. The ReplicaSet remains the mechanism that keeps the number of copies.
5. **Exponential backoff.** The material cites retry with exponential backoff. In real systems, a small random delay (jitter) is usually added so that many clients do not all repeat their attempts at the same instant.

**Limits of the labs (where the local analogy ends):**

- The test application **models** a server's capacity with a semaphore and a `sleep`. The numbers in the Stage 01 experiments are predictable by construction; they serve to see the logic, not to measure real hardware.
- Open source Nginx does **passive health checking** (it reacts to real failures). The ALB does active probing at a configurable interval, with *unhealthy threshold* and *healthy threshold*. Nginx also resolves server names only at startup, which is why the `reload` after changing the fleet; with an ASG, registering and removing instances in the target group is automatic.
- The `upstream` blocks use `zone` (shared memory) so that the several Nginx worker processes share the same round-robin state. Without it, each worker balances on its own and exact counts such as 10/10/10 may come out uneven.
- The `sed -i` commands with `\n` are GNU sed. On macOS (BSD sed), use `gsed` (`brew install gnu-sed`) or edit the files by hand.
- The lab's queue is a **Redis list** (`LPUSH` and `BRPOP`). It has no acknowledgment: if a worker dies in the middle of a task, the message is lost. SQS and RabbitMQ keep the message until the consumer acknowledges it, and that guarantee is what the real pattern requires.
- The local "CDN" is a single edge. It reproduces the mechanism (miss, hit, revalidation with `304`, TTL), but not the geographic distribution, the intelligent DNS, or the WAF. The purge is simulated by deleting the cache.
- The lab's Postgres uses **asynchronous** streaming replication, and the failover is manual. A managed service such as RDS automates detection and promotion; its real RTO depends on that automation.
- In Docker Compose, `deploy.replicas` is for local replicas. In production, the equivalent is the ReplicaSet/Deployment (Kubernetes) or the ASG (AWS), with real autoscaling.

---

## Source material references

- Beyer et al., *The Site Reliability Workbook* (2018) and *Site Reliability Engineering* (2016).
- Kleppmann, *Designing Data-Intensive Applications* (2017).
- Newman, *Building Microservices* (2015).
- Grigorik, *High Performance Browser Networking* (2013).
- AWS: *What is an Application Load Balancer?*, *Amazon CloudFront Developer Guide*, *Amazon Aurora Features*, *AWS Well-Architected Framework*.
- Kubernetes, *Ingress*; Karpenter and KEDA documentation; Cloudflare, *Load Balancing* and *What is a CDN?*; Cockroach Labs, *CAP Theorem*; Netflix Technology Blog.

---

*And that is how we close the broadcast, live from the pit lane of the Scalability GP: six sectors, no retirements, and a system that handles the peak. From the commentary box, that is all. Until the next GP on the calendar, and remember: a well-built pit lane is what turns a safety car into an opportunity. END OF BROADCAST.*
