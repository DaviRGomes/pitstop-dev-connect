# Application architecture: from the garage where everyone does everything to specialist stations that talk over the radio

*Good afternoon, good evening, good morning, wherever you are! The Application Architecture Grand Prix is on the air, and the grid is already formed. What is at stake in this race is the shape of the team: leaving the garage where everyone does everything, with a single procedure that locks up completely when one step fails, and arriving at specialist stations that work on their own, keep their own data, and talk over the radio without holding the car in the pit box.*

*The layout has four sectors, and I narrate each one. Sector 1, the starting straight: monolith, layers, and microservices, with the lab that measures the double stack and the blast radius of a crash. Sector 2, the circuit design section: where to cut the services (strategic DDD) and how to publish them behind a gateway. Sector 3, the most technical part of the track: database per service, SQL or NoSQL, CAP, and the saga that compensates for failures. Sector 4, the final straight: synchronous call versus queue, rate limit at the edge, and the request identifier followed through the logs. In all of them, AWS and Azure appear the same way: two circuits where the same team operates.*

*Before the start, two warnings. First, so nobody thinks it is a typo: in 2026 the Bahrain round was moved to Sepang, in Malaysia (as verified on 2026-10-06), and that is why this guide says "Bahrain GP in Sepang". That race, held on October 4, 2026, is recounted by the driver in the first **Cockpit perspective** block, just below. Second: the **Cockpit perspective** blocks are the driver's voice, in the first person, translating each concept to the garage, the pit wall, and the pit box. My voice, from the booth, is this one, in italics, at the entry and exit of each sector. Belts fastened, visor down. Here we go!*

> Guide based on the four lessons of the course "Application architecture" (DevOps and Cloud Architecture, Phase 1), one stage per lesson, each with a lab that runs on your machine with Docker Compose, with no cloud account. The material cites only AWS (SQS, DynamoDB, Amazon API Gateway) and Azure Cosmos DB; every equivalent that was added is marked as an addition.

**Cockpit perspective:** on Sunday, October 4, 2026, in Sepang, the Bahrain GP (moved to Malaysia this season) started about 40 minutes late because of heavy rain. Ferrari bet on dry-weather tires for Lewis Hamilton and Charles Leclerc while almost the entire grid started on intermediates, and the two plunged in the first laps before recovering. A safety car on lap 9 opened the window for those on intermediates to switch to dry tires. Max Verstappen controlled the race and won; Kimi Antonelli was second and Hamilton third. George Russell's car stopped on the straight during the last safety car and he left with no points. Behind each of those scenes there is a team working as a distributed system: dozens of specialist stations, a single radio channel with the driver, data running between track and factory, and decisions that depend on who answers in time. That is what this module is about.

> **Championship data used in this guide (verified on 2026-10-06; sources in "F1 data sources", at the end).** Podium in Sepang, round 16 of 23: Verstappen, Antonelli, and Hamilton; George Russell, second in the championship, left with no points. Next round: Singapore GP, October 9 to 11, 2026, with a sprint format for the first time. Every scenario with these names that did not actually happen is marked as **hypothetical**.

**For those who do not follow F1: the minimum track knowledge to read this guide.** You do not need to know anything about racing; each term below is explained again when it appears.

- **Pit box, garage, and pit lane.** Each team has a garage and, in front of it, a pit box: the spot in the pit lane (the road parallel to the straight) where the car stops. In the pit lane there is a maximum speed, enforced by the car's **speed limiter**.
- **Pit stop and crew.** The stop at the pit box to change tires or parts. The crew has about 20 mechanics, each with a single task (one wheel's gun, taking off the tire, putting on the tire, front jack, rear jack), and the car only leaves when all of them finish. The team has a single crew for both cars.
- **Double stack.** Calling both of the team's cars into the pit box on the same lap. Since the crew is one, the second car waits for the first to finish.
- **Nose, set-up, and free practice.** The nose is the front tip of the car, which carries the front wing; replacing it in a stop takes much longer than changing tires. The set-up is the adjustment of the car for the circuit (heights, wings, pressures). Free practice is the session of tests and adjustments before qualifying.
- **Release light and unsafe release.** The light in front of the pit box that releases the car; it turns green after the wheel gun operators signal that their wheel is secured. Releasing the car with something wrong (a wheel not properly secured, another car passing) is an unsafe release, an infraction punished by the stewards.
- **Race engineer.** The only voice of the team that talks to the driver over the radio. He brings to the driver what the specialists decide and brings to the team what the driver asks for.
- **Pit wall.** The bench at the side of the track where engineers and strategists sit watching the car's data in real time.
- **Telemetry and channels.** The data that the car's sensors transmit live: each quantity (a temperature, a pressure, a speed) is a channel, with a defined name and unit.
- **Remote operations room.** The room at the factory where dozens of engineers follow the telemetry live during the GP and support the pit wall.
- **Team disciplines.** Engineering is divided by subject: aerodynamics, vehicle dynamics, power unit (the hybrid engine), tires, strategy.
- **Hydraulic system.** It actuates the gearbox, the clutch, and the power steering, among other systems. A leak usually ends the car's race, however good the rest is.
- **Window.** For the strategist, the "pit stop window" is the range of laps in which it pays to stop. For the tire engineer, the "window" is the temperature range in which the tire works.
- **Safety car.** The safety car that enters the track after an incident and slows everyone down; it usually opens a cheap window to stop in the pit box.
- **Race control and stewards.** Race control runs the session and sends messages to all teams at the same time. The stewards judge incidents and apply penalties, sometimes after the checkered flag; that is why the classification right after the race is **provisional** until it is confirmed.
- **Timing.** Loops installed in the track record each passage of each car; the times and positions are calculated from those passages.
- **Tire barcode.** Each tire is identified, and the FIA (the federation that regulates F1) tracks each set over the weekend.
- **Paddock credentials.** The credential that each team member shows at the gates, with the access level printed on it (garage, pit lane, pit wall).

**What you will be able to do by the end of this guide:** explain why a layered monolith becomes a problem and what microservices trade for it; measure, in a lab, how a slow or faulty feature affects the rest in the monolith and does not affect it when there are separate services; draw service boundaries by business capability (strategic DDD) and publish them behind a gateway; give each service its own database, choose between SQL and NoSQL with arguments, and coordinate a distributed operation with a saga that compensates for failures; compare, in practice, synchronous (HTTP) and asynchronous (queue) calls, observe message buildup and recovery, limit traffic at the gateway, and follow a request identifier through the logs; and, at each stage, point to the equivalent service on AWS and Azure and say where they really differ.

**Prerequisites:**

- Docker Engine or Docker Desktop, with the `docker compose` command (recent Compose v2). Check with `docker compose version`.
- A terminal with `bash`, `curl`, `sort`, and `uniq`. Linux, macOS, or WSL will do.
- Basic knowledge of containers (image, container, published port, Compose network) and of HTTP.
- No cloud account for the main labs. The blocks marked as **optional** use local emulators and require the `aws` and `az` CLIs installed. The blocks marked as **cloud reference** show real commands, **create resources that may incur charges**, and do not need to be run to complete the guide.

> **Cleanup warning:** each stage leaves containers running. When you finish a stage, run its "Cleanup" block before starting the next one. Several stages use port 8080. If a port is already taken on your machine (check with `lsof -i :8080` on macOS or `ss -ltn` on Linux), change only the left side of the mapping (for example, `"8081:80"` in the compose `ports` or `-p 8001:8000` in `docker run`) and use the new port in the commands of that stage.

### How to read the AWS x Azure tables

Every equivalence table has three columns: the need, the AWS service, and the Azure service. The guide's rules:

- The Azure column is an **added by the professor**, unless the cell says "cited in the material" (the case of Azure Cosmos DB and of Microsoft's domain analysis documentation). A good part of the AWS column is also an addition: the material only cites Amazon SQS, Amazon DynamoDB, and Amazon API Gateway. The header of each table says what was added.
- "Equivalent" means "solves the same problem", not "is identical". Below each table there is an honest list of differences.
- There are no prices or numeric limits. They change over time and by region; check the provider's pricing page and quotas page before deciding.

### Lab folder structure

```text
lab-arquitetura/
  app/                 # generic test application, used in Stages 01 and 02
  etapa-01/            # monolith x two services
  etapa-02/            # five services by domain + gateway
  etapa-03/            # database per service + saga
  etapa-04/            # synchronous HTTP x queue + gateway with rate limit
```

Each stage from 02 onward starts with `cd ..`, which leaves the previous stage's folder and goes back to `lab-arquitetura`. All of a stage's commands run inside its folder.

## Architecture to F1 reference: keep this on the steering wheel

The same analogy holds from the beginning to the end of the document. If a microservice is a specialist station of the team in Stage 01, it is still a station in Stage 04. Only the central pieces are listed here; each analogy is explained again at the point where it appears. The complete table is in the [Appendix: complete reference table](#appendix-complete-reference-table), at the end of the document.

One rule holds for the entire document: **AWS and Azure do not become F1 teams.** The two providers enter the analogy the same way, as two different circuits where the same team operates.

| Application architecture | Formula 1 |
|---|---|
| Application (the whole system) | The team's operation over the weekend: garage, crew, pit wall, and factory |
| A client's request | A work request that reaches the team: the driver asking over the radio or the car entering the pit box |
| Monolith | A garage where the same mechanics do all the tasks, with a single procedure, rehearsed and released as a block |
| Layered architecture | The communication chain: driver, race engineer, pit wall, data analysts; each level only talks to the one below |
| Microservice | A specialist station (tires, strategy, power unit, the crew of each wheel), with its own role, people, equipment, and rehearsal |
| Shared capacity | The double stack: the single crew makes the second car wait for the first |
| HTTP status code | The release light: green only when everything is secured; `200` with an error is an unsafe release |
| API Gateway | The race engineer: the single voice between the driver and the team, who forwards each request to the right station |
| Database per service | Each discipline owns its data: whoever needs it asks for the number, and does not open the other's spreadsheet |
| Eventual consistency | The provisional classification, which converges to the official one after the stewards' decisions |
| Saga with compensation | The trip logistics booked in steps and undone in reverse order, with cancellations that stay in the history |
| Synchronous call x queue | The car stopped in the pit box waiting for a task x the removed tires that go to the pile and are measured later |
| Request identifier | The tire barcode, followed by every record |
| Cloud provider (AWS or Azure) | The circuit: each has its own facilities, and the team's procedure is the same at both |

## Where the comparison stops

The analogy organizes the reasoning, but it does not replace the technical model. The main limits, which I repeat in the text when they appear:

- **One crew per team.** In practice, each team has a single crew for both cars, and the double stack is a cost that strategy manages. In software, separating each service's capacity is an architecture choice, and replicas are cheap.
- **The stop is synchronous by nature.** A team's stations are specialized, but the car only leaves the pit box when all four wheels are done. Microservices can also be independent in time, talking through a queue.
- **People improvise; a gateway does not.** The race engineer understands the content, prioritizes, and sometimes answers off the top of his head. The gateway forwards by prefix, counts requests, and returns codes, without understanding the domain.
- **The network is not the garage.** Inside the garage, a question crosses three stations in seconds. Between services, each network hop adds latency and a chance of partial failure.
- **Eventual consistency by software.** The provisional classification converges through a human decision by the stewards. In a distributed system, convergence is done by events, compensations, and automatic rules.
- **The circuit is not chosen.** The calendar decides where the team races. In the cloud, the choice of provider is yours, and you can use both at the same time.

Whenever there is a conflict between the track and the terminal, what is in the terminal prevails: definitions, commands, and expected outputs of the technical text.

---

## Stage 01: Monolith, layered architecture, and microservices

*THE LIGHTS ARE OUT! The start of the Application Architecture Grand Prix, and the first corner already charges a high price: a small change that forces the whole team to rehearse everything again. Before dividing the garage into stations, understand why the single block locks up and what the separation charges in return. Stay with me.*

### The problem

Friday, 4 p.m. The team of a streaming platform needs to change only the video upload integration, because a new social network entered the contract. The change is small, but the system is a single project with a single database and a single interface: you have to change the code, test the whole application, and deploy the entire block. If the video conversion module has a hidden bug, it can bring down the upload and the rest along with it. This is the real case that the material's author lived through at TV Bandeirantes, and it is the reason this module exists.

Before solving it, let us understand the architecture form that causes the pain and the one that replaced it.

**Cockpit perspective:** in the garage, the "Friday 4 p.m." is changing a single step of the work (say, the way of fitting the front left wheel) in a team where everyone does everything according to a single procedure. Since the choreography is one, changing one step forces the whole job to be rehearsed again and the new procedure to be released all at once, for everyone. If the new step has a hidden problem, it does not delay just one wheel: it locks up the stop. Keep that image, because it is the monolith.

### The concept

**Monolith (the analogy of the restaurant with a single kitchen).** A single kitchen prepares everything: starters, main dishes, desserts, and drinks. If the stove breaks, the whole restaurant stops; to double capacity, you have to build an entire new restaurant, even if the bottleneck is only the dessert.

Technically, monolithic architecture is a design in which all components (front end, back end, business logic, database integration) coexist in the same block of code and are deployed as a single entity. Characteristics according to the material:

| Characteristic | What it means in practice |
|---|---|
| Cohesive unit | Any change requires recompiling and redeploying the entire application. |
| Strong dependencies | A failure in one component can affect the whole system. |
| Difficulty scaling | If one part needs more resources, the entire application is scaled, with waste. |
| Slow development cycle | Every change brings risk and calls for extensive testing. |
| Complex maintenance | As it grows, fixing a bug or adding a feature can have unexpected effects on other parts. |

**Cockpit perspective:** picture a **hypothetical** garage where two mechanics do everything: tires, nose, wing adjustment. If one of them gets hurt, the garage loses half its capacity for every task; to double the capacity to change noses, you have to hire more people who also do everything. On the car, the real example of strong dependency is the hydraulic system: it actuates the gearbox, the clutch, and the power steering, and a leak usually ends the entire race, even with a perfect engine, tires, and aerodynamics. **Here the analogy stops:** a real F1 team is already specialized by station. The "everyone does everything" garage is a model for seeing the problem, not a description of how teams work.

**Layered architecture (the analogy of the building with floors).** The material says the example system (a test-delivery company with five areas: Authentication, ADM, Professor, Company, and Candidate) was written "with the good practices of the time", that is, in layers. Since the PDF's figures do not come in the extracted text, the description below is the classic three-layer organization, explained by the professor: each floor only talks to the floor below.

```text
sistema-testes/
  apresentacao/   # screens and controllers: receive the request and return the response
  negocio/        # rules: schedule a test, record feedback
  dados/          # repositories: the only place that talks to the database
```

Important point: **layers organize the code inside a single deployment package**. They are a horizontal cut. Even an impeccably layered monolith is still deployed all at once, scaled all at once, and brought down all at once. Microservices are another axis: a vertical cut, by business feature, each slice with its own code, deployment, and data.

**Cockpit perspective:** F1 has a well-known layered architecture: the communication chain. The driver talks to the race engineer (presentation: receives the request and returns the response); the engineer takes it to the strategy pit wall (business: decides whether the car stops this lap); the pit wall consults the data analysts, at the track and in the remote operations room (data: the only place that touches the raw telemetry). Each level only talks to the one below, and that organizes very well who decides what. But the team still goes to the track as a whole: car, crew, and pit wall arrive at the circuit, work, and are charged as one block. Organizing the hierarchy does not change the fact that the weekend is a single package, and that is exactly what the text says about layers.

**Microservices (the analogy of the food court).** Each stall has its own kitchen, its own staff, and its own cashier. If the ice cream stall closes, the pizza one keeps selling; if the pizza line grows, another pizza counter is opened, not another entire food court.

The material's definition: an architectural approach that divides an application into a set of small, independent services focused on a single task, which can be developed, deployed, and scaled independently. Main characteristics:

- **Autonomy**: each service is responsible for a single function.
- **Decentralized development**: different teams, possibly with different languages and technologies.
- **Scalability**: only what needs more resources is scaled.
- **Communication via API**: REST, GraphQL, RPC (Remote Procedure Call), or messaging.

**Cockpit perspective:** it is the garage organized by station: the tire engineer, the power unit engineer, the strategist and, in the pit stop, the crew of each wheel, each with its own task, equipment, and rehearsal. If the front left wheel station changes wheel gun, the others rehearse nothing again. If the team needs more people analyzing tires on a high-wear weekend, it reinforces only that station. And each station talks over an agreed channel (the internal radio, the telemetry channels), which plays the role of the API. **Here the analogy stops:** a team's stations have independence of people and tools, but the pit stop is still synchronous: the car only leaves when all four wheels are done. Microservices can (and often should) be independent in time as well, as Stage 04 shows.

Since REST is the most common, there is an essential caution: **each response must use the correct HTTP status code**. A service that returns `200` with an error body misleads the service that called it, which thinks it worked and moves on.

**Cockpit perspective:** the status code is the pit box release light. Green means "you can go, everything is secured", and the rest of the team acts on it without checking again. A `200` with an error body is the green light with a loose wheel: the unsafe release. That is what happened to Ferrari at the 2018 Bahrain GP: the car was released with a tire still being changed, a mechanic was hurt (he broke his leg), and the team was fined 50 thousand euros. Whoever trusts the signal moves on, and the problem shows up later, more expensive. The signal has to tell the truth.

**The price of independence.** The material is honest: before adopting, weigh the challenges.

| Challenge | In one sentence |
|---|---|
| Complexity | Each service is simple, the whole is complicated (communication and coordination). |
| Development and testing | Testing services that depend on others requires another mindset and other tools. |
| Decentralized governance | Different languages and frameworks make maintenance harder; standardize at least logs and monitoring. |
| Latency | Chains of calls accumulate delay; asynchronous communication and queues help (Stage 04). |
| Data consistency | Each service has its own data; eventual consistency is preferred over global ACID transactions (Stage 03). |
| Management | Requires a DevOps culture; correlating logs across services is essential (Stage 04). |
| Version control | Updating a service must not break whoever depends on it (contracts, Stage 02). |
| Team skills | Distributed systems call for experience in CI, infrastructure automation, and monitoring. |

**Cockpit perspective:** that table is the cost of having a team with dozens of stations. Someone has to coordinate (the pit wall); everyone has to speak the same language on the radio and record data in the same standard (governance); each question that crosses three stations takes three answers (latency); and testing the stop requires rehearsing the whole crew, not just one mechanic. A small team with a few well-trained stations beats a large disorganized team.

**The streaming case, side by side.** The system received satellite data, converted videos for the browser, cut excerpts, and uploaded clips to a social network. In the microservices version (the author warns that the points below are examples and not all of them were used at the time):

| Feature | In the monolith | As a service |
|---|---|---|
| Receive satellite data | Module of the same project | Service with its own database; writes to the database and to storage |
| Convert video | Module of the same project | Service that reads the database, finds the file, and converts it to a browser format |
| Interface | Part of the same project | Presentation-only project (the material calls it "ator condutor" (driving actor), a hexagonal architecture term for whoever triggers actions in the system, such as the user interface) |
| Cut excerpts | Module of the same project | Service that fetches the requested excerpts to create a clip |
| Upload to the social network | Module of the same project | Service that receives data from a channel through a queue and does the upload |

**In the market (according to the material):** time-to-market makes companies prioritize frequent deliveries without impacting the whole system; startups and large companies have opted for **gradual componentization**, turning critical parts into autonomous services instead of rewriting everything. Mercado Livre is cited as an example of large-scale use. Adoption is tied to DevOps (CI/CD, containers, Kubernetes, observability, infrastructure as code) and to composing systems through APIs, with gateways, events, and distributed security.

**Where this runs in the cloud.** The material does not cover hosting. As an addition by the professor, this is the table of where each service usually lives:

| Need | AWS (added by the professor) | Azure (added by the professor) |
|---|---|---|
| Virtual machine (the "lift and shift" monolith) | Amazon EC2 | Azure Virtual Machines |
| Managed containers, without administering the orchestrator | Amazon ECS (with AWS Fargate to avoid managing servers) | Azure Container Apps |
| Managed Kubernetes | Amazon EKS | Azure Kubernetes Service (AKS) |
| Functions (FaaS) | AWS Lambda | Azure Functions |

Honest differences: the names and the degree of abstraction vary. Azure Container Apps is a serverless container platform that runs on Kubernetes without exposing it to the user; ECS is AWS's own orchestrator, not Kubernetes. For those who want real Kubernetes, EKS and AKS are the pair. Billing models and limits of each change frequently: consult the official documentation.

**Cockpit perspective:** AWS and Azure are two circuits. At either one, you choose how much of the local infrastructure you will use: the virtual machine is building your whole structure inside the garage; managed containers and functions are using more and more of what the circuit already delivers ready (power, timing, structure) and taking care only of the car. The team's procedure is the same at both circuits; what changes is the name of the facilities and what each one offers. **Here the analogy stops:** the calendar chooses the team's circuit; the cloud provider is your choice.

### Commented example: the same system as a monolith and as two services

Let us use a generic test application. It is a **model** (a mock-up): each instance serves at most N requests at the same time, and each type of route has a fixed response time. That way the numbers are predictable.

**Cockpit perspective:** on our map, each instance is a group of mechanics with `CAPACIDADE` people free at the same time. The `pedidos` route is the tire change (fast, 0.1 s) and the `relatorios` route is the nose change (slow, 2 s). The `monolito` container is the garage where the same two mechanics do both things; `pedidos` and `relatorios` are two separate stations, each with its own pair. **Here the analogy stops:** the times are mock-up times. What matters is that one task is much slower than the other, as the nose change is slower than the tire change.

Create the structure:

```sh
mkdir -p lab-arquitetura/app lab-arquitetura/etapa-01 && cd lab-arquitetura
```

`app/app.py`:

```python
import json
import os
import socket
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

NOME = os.getenv("NOME", socket.gethostname())  # identifies who answered
ROTAS = set(os.getenv("ROTAS", "pedidos,relatorios").split(","))  # prefixes that THIS process serves
CAPACIDADE = threading.Semaphore(int(os.getenv("CAPACIDADE", "2")))  # simultaneous requests
DEMORA = {"relatorios": 2.0}  # seconds per route; the default is below
DEMORA_PADRAO = 0.1  # 100 ms for the other routes


class Handler(BaseHTTPRequestHandler):
    def responder(self, status, corpo):
        dados = (json.dumps(corpo, ensure_ascii=False) + "\n").encode()
        self.send_response(status)  # the status code is part of the contract
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(dados)))
        self.end_headers()
        self.wfile.write(dados)

    def do_GET(self):
        partes = [p for p in self.path.split("?")[0].split("/") if p]
        if self.path == "/health":
            return self.responder(200, {"status": "ok"})
        if self.path == "/crash":
            os._exit(1)  # simulates a serious defect: the process dies instantly
        if not partes or partes[0] not in ROTAS:
            return self.responder(404, {"erro": "rota inexistente neste serviço", "servico": NOME})
        area = partes[0]
        if partes[1:] == ["999"]:
            return self.responder(404, {"erro": "recurso não encontrado", "servico": NOME})
        if partes[1:] == ["erro"]:
            return self.responder(500, {"erro": "falha interna simulada", "servico": NOME})
        with CAPACIDADE:  # only N get in at a time; the rest wait
            time.sleep(DEMORA.get(area, DEMORA_PADRAO))  # simulated work
        self.responder(200, {"servico": NOME, "caminho": self.path})


class Servidor(ThreadingHTTPServer):
    request_queue_size = 128


if __name__ == "__main__":
    Servidor(("0.0.0.0", 8080), Handler).serve_forever()
```

`app/Dockerfile`:

```dockerfile
# Small image with Python
FROM python:3.12-alpine
# Working folder inside the image
WORKDIR /srv
# Copies only the code
COPY app.py .
# Port the application listens on
EXPOSE 8080
# -u turns off output buffering so the logs show up right away
CMD ["python", "-u", "app.py"]
```

`etapa-01/compose.yaml` (the same code, in two topologies):

```yaml
services:
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
    ports: ["8092:8080"]
```

`init: true` puts a minimal init process as the container's PID 1. Without it, Python becomes PID 1, ignores the SIGTERM sent by `docker compose stop` and `docker compose down`, and Docker waits out the 10 s deadline before killing it with SIGKILL: the command looks stuck. The compose files of the next stages repeat the option on the Python services.

Build the image and bring everything up:

```sh
docker build -t lab-arq-app ./app
cd etapa-01 && docker compose up -d
```

Expected output (shortened): three `Started` containers.

### Hands-on

*Pit lane open! Four timed tests with the same image in two topologies: the status code as a signal, the double stack in the monolith, the same load with separate stations, and a crash on purpose. Eyes on `time_total`.*

**1. Check that both topologies respond, and see the status code as a contract.**

```sh
curl -s localhost:8090/pedidos/1
curl -s -o /dev/null -w "%{http_code}\n" localhost:8091/pedidos/999
curl -s -o /dev/null -w "%{http_code}\n" localhost:8091/pedidos/erro
curl -s -o /dev/null -w "%{http_code}\n" localhost:8091/relatorios/mensal
```

Expected:

```text
{"servico": "monolito", "caminho": "/pedidos/1"}
404
500
404
```

The last `404` shows a boundary: the orders service does not know the reports route. In the monolith, both live together.

**Cockpit perspective:** the `404` from the orders station for `relatorios` is the tire mechanic saying "nose is not my job". The `500` is the station admitting the failure. Both are honest signals, and it is with them that the rest of the team decides what to do.

**2. A slow feature contaminates the other (monolith).** We fire four reports (2 s each, capacity 2) and, right after, a simple order:

```sh
for i in 1 2 3 4; do curl -s -o /dev/null localhost:8090/relatorios/mensal & done
sleep 0.2
curl -s -o /dev/null -w "pedido no monolito: %{time_total}s\n" localhost:8090/pedidos/1
wait
```

Expected: something between 2 and 4 seconds (typically close to 4), for an operation that takes 0.1 s alone. The order was queued behind the reports, because the two share the same capacity.

**Cockpit perspective:** it is the double stack. **Hypothetical** example: McLaren calls Lando Norris in to change the nose and, right behind, Oscar Piastri comes in for a simple tire change. Since the team has a single crew, Piastri waits stopped in the pit box until the crew finishes Norris's car, and his stop, which would be quick, inherits his teammate's time. It is the 0.1 s order taking almost 4 s.

**3. The same load, with separate services.**

```sh
for i in 1 2 3 4; do curl -s -o /dev/null localhost:8092/relatorios/mensal & done
sleep 0.2
curl -s -o /dev/null -w "pedido no serviço próprio: %{time_total}s\n" localhost:8091/pedidos/1
wait
```

Expected: about `0.10s`. The reports service is saturated and the orders one does not even notice.

**Cockpit perspective:** with separate stations, the nose line does not touch the tire change. **Here the analogy stops:** in practice, each F1 team has a single crew for both cars, so the double stack is a cost that strategy manages. In software, separating capacity is an architecture decision, and it costs little.

**4. The blast radius of a defect.**

```sh
# Monolith: a defect in any route kills the whole process
curl -s -o /dev/null -w "crash: %{http_code}\n" localhost:8090/crash
curl -s -o /dev/null -w "pedidos no monolito depois do crash: %{http_code}\n" localhost:8090/pedidos/1

# Services: the defect kills only the reports service
curl -s -o /dev/null -w "crash: %{http_code}\n" localhost:8092/crash
curl -s -o /dev/null -w "pedidos (serviço próprio): %{http_code}\n" localhost:8091/pedidos/1
sleep 1                                   # gives Docker time to register the processes' exit
docker compose ps -a --format "table {{.Service}}\t{{.Status}}"
```

Expected: `000` on both crashes (the process died and the connection was closed), `000` for the monolith's orders, `200` for the dedicated service's orders. The `ps` shows `monolito` and `relatorios` as `Exited (1)`.

To recover: `docker compose up -d`.

**Cockpit perspective:** the blast radius is the hydraulic leak. In the monolith, a failure in any part ends the work of the whole process (`Exited (1)`). With separate services, the failure stops one station and the rest of the team keeps working. In Sepang, George Russell's car stopped on the straight during the last safety car and he left with no points: when the process dies, it does not matter how good the rest was. **Here the analogy stops:** `docker compose up -d` is what F1 does not have. A car that retires does not come back to the race; a process that went down comes back up in seconds.

**Cleanup:**

```sh
docker compose down
```

### Exercises

*Flying lap! Four questions, no looking at the text. This is where those who repeat "microservices are modern" are separated from those who can say when not to migrate.*

1. **Do layers solve the Friday 4 p.m. problem?** Justify. *Expected answer:* no. Layers organize the code inside a single deployment artifact; the upload change still requires testing and deploying everything. What solves it is the cut by service, with independent deployment.
2. **Map the case.** Say which service of the streaming microservices version is the best candidate to be scaled when many users ask for clips at the same time, and why. *Expected answer:* the service that cuts excerpts and creates clips, because it is the one that receives the users' demand; only it needs more replicas, while the service that receives the satellite data can stay with one instance.
3. **Status code.** A payments service returns `200` with the body `{"erro": "saldo insuficiente"}`. What problems does that cause for whoever calls it? *Expected answer:* the client thinks it worked; error metrics by status code (used for monitoring) go blind; retry mechanisms and alerts do not fire. The right thing would be an appropriate error code (for example, `4xx` for a client error and `5xx` for a server failure).
4. **When NOT to migrate.** A team of 3 people maintains an internal system with little traffic. Use the challenges table to argue. *Expected answer:* the gain in deployment and scale independence does not pay for the cost of complexity, latency between services, data consistency, and operation, especially with few people and no maturity in CI/CD and monitoring. A well-organized layered monolith serves better.

### Remember this

> Layers organize the code inside one deployment; microservices split the deployment itself by feature, and trade the pain of the single block for the complexity of a distributed system.

*Sector 1 in green! You measured on the stopwatch the 0.1 s order inheriting almost 4 s in the monolith, and you saw the orders station stay up after its neighbor's crash. Strong dependency decides championships: in Adelaide, in 1986, one of Nigel Mansell's rear tires blew on the straight in the last race of the year and took with it the title that was within his reach. Now comes the circuit design section: where to cut the services, in Stage 02.*

---

## Stage 02: Microservices: where to cut and how to expose them

*Second sector, and here the track demands a racing line, not brute force. The team has already decided to separate the stations; the question now is where to cut. A wrong cut becomes a distributed monolith, with the network latency and none of the advantages. Attention to the turn-in.*

### The problem

The team decided to migrate. In the meeting, someone proposes: "one service for the database, one for the rules, one for the screens". It looks organized, but every new feature (for example, "schedule a chat with a professor") now crosses the three services, which have to be changed and deployed together. A distributed monolith was created: it has the network latency and the complexity of microservices, with none of the advantages. The mistake was cutting by **technical layer**. The material is direct: services must be structured by **business capability**.

There is no exact formula ("silver bullet"): you have to reflect on the domain, the requirements, and the architectural characteristics, or you will end up with unplanned dependencies and poorly structured interfaces.

**Cockpit perspective:** cutting by technical layer would be organizing the team into "who touches the data", "who decides", and "who talks to the driver", with no owner of any subject. Every new question ("do we stop one lap before Leclerc to try to gain the position?") would cross the three groups, and any change would require all three together. Real teams are organized by discipline (aerodynamics, vehicle dynamics, power unit, tires, strategy), and that is what the material calls business capability.

### The concept

**Analogy: the departments of a company.** Finance, HR, and Sales have their own responsibilities and talk through clear requests ("I need a report of hires"). Nobody in Sales opens HR's drawer. A company organized by "who types", "who decides", and "who files" would lock up on every task.

**Principles for defining the boundaries (from the material):**

- **Low coupling and high cohesion.** You can change one service without touching another; each service has a specific purpose (managing user accounts, recording the delivery history).
- **Hide the domain's complexity.** The interface is simple and abstracts the inside. A candidate schedules a chat without knowing how resource allocation works.
- **Architectural characteristics per service.** A customer-facing service may prioritize performance and availability; a back-end service may prioritize fault tolerance and security. Attention: when services depend on **synchronous** communication, those characteristics end up shared (one's availability depends on the other's), which increases interdependence.
- **Each service with a single responsibility** (SRP applied to architecture), reflecting a business domain, with **minimal and clear communication** between them.

**Cockpit perspective:** low coupling is the tire engineer being able to change the wear measurement method without strategy changing anything; high cohesion is everything about tires living in the tire station. Hiding complexity is what the driver lives: he asks "how many laps will this tire last?" and gets a number, without seeing the wear model behind it. And the warning about synchronous communication already appears here: if strategy decides nothing without the tire station's answer, a tire station that is down paralyzes strategy.

*Braking point! Bounded context is not memorized, it is recognized in the vocabulary of the people who work in the business. It is in this paragraph that the scorers are separated from the rest of the grid; read slowly.*

**Strategic DDD: the method for finding the cuts.** Domain-Driven Design (DDD) proposes talking to business specialists and drawing the domain before drawing the services. The flow in the Microsoft documentation used in the material (cited in the material) follows, in summary, this sequence: analyze the business domain, define the **bounded contexts**, define entities, aggregates, and services inside each context and, finally, identify the microservices. A bounded context is a boundary within which a model and its terms have a single meaning. The same word can mean different things in different contexts (for example, "scheduling" for the Professor is an agenda to fulfill; for the Candidate it is a time slot reservation). Defining boundaries is a **continuous** process: as the system evolves, it is normal to redraw boundaries.

**Cockpit perspective:** in F1, the word "window" is a textbook bounded context. For the strategist, window is the range of laps in which it pays to stop; for the tire engineer, window is the temperature range in which the tire works. Same word, two models. A team that forced a single concept of "window" would create confusion on the radio; each station keeps its own, and the conversation between them is translated at the boundary.

**Applying it to the test system.** The division proposed in the material:

| Service | Responsibility | Material's notes |
|---|---|---|
| Authentication | Login, logout, and security for all users | Can use **JWT** as a token, shareable between systems, with roles |
| ADM | Overview: registered professors, linked companies, accesses per company, candidates per company | Could have only a cache database (hot cache strategy, warmed before use, or cold cache, filled on demand) and query an API when needed |
| Professor | List open schedulings; record feedback | |
| Company | List candidates; send access; track tests | |
| Candidate | Take a test; see status (completed, pending, with feedback) | |

**Cockpit perspective:** Authentication with JWT is the paddock credential: the credential is issued once and shown at each gate, and the access level (garage, pit lane, pit wall) comes printed on it, like the token's roles. ADM with a cache is the team principal's dashboard: a summary fed by the departments, which he consults without entering anybody's spreadsheet.

**Contracts: how services understand each other without knowing each other.** Communication needs versioned contracts. The material cites **OpenAPI** (describes HTTP APIs) and **AsyncAPI** (describes event-driven and message-oriented APIs). A versioned contract is the answer to the challenge "updating a service must not break the others".

**Cockpit perspective:** a versioned contract is the telemetry channel list (name, unit, and frequency of each one) and the fixed radio vocabulary. If the power unit people rename a channel without warning, the pit wall software that read that channel stops showing the data. That is why the list has a version, and an old channel only goes away after everyone has migrated. On our map, OpenAPI describes the questions and answers; AsyncAPI describes what is transmitted without anyone asking.

**How services find each other: service discovery.** When there are several replicas and they go up and down, nobody fixes an IP in the code; you use a **name** that the system resolves to the healthy instances. In Docker Compose, the service name already works this way (internal DNS). In Kubernetes, the Service object does the same.

**Cockpit perspective:** on the team's internal radio, nobody calls the mechanic by name; you call the station ("tires", "strategy"), and whoever is assigned there that day answers. The service name in Compose, or the Service in Kubernetes, does the same: the code calls `empresa`, and DNS delivers a healthy instance, whichever it is.

**In the cloud (added by the professor).** The material does not cover service discovery; the table below is a complement.

| Need | AWS (added by the professor, except Amazon API Gateway, cited in the material) | Azure (added by the professor) |
|---|---|---|
| Service discovery, registration by name | AWS Cloud Map; on ECS, ECS Service Connect | There is no isolated 1:1 equivalent product; Azure Container Apps brings name-based discovery built into the environment, and AKS uses Kubernetes DNS |
| Managed Kubernetes, internal DNS per Service | EKS | AKS |
| Single entry facade for the services | Amazon API Gateway | Azure API Management (details in Stage 04) |

Honest differences: on AWS, service discovery is a separate product (Cloud Map). On Azure, it usually comes built into the chosen runtime platform. In Kubernetes (EKS or AKS), the mechanism is the same: cluster DNS. Before choosing, confirm in the documentation what your container service offers.

**Cockpit perspective:** at both circuits the internal radio works, but the installation changes. At one (AWS), the station directory is a separate installation that you contract (Cloud Map); at the other (Azure), it comes built into the garage you choose (Container Apps or AKS). The team and the procedure are the same.

**Trends cited in the material:** multidisciplinary teams per product ("You build it, you run it"), observability through metrics, structured logs, and distributed tracing (Prometheus, Grafana, ELK Stack, Jaeger, OpenTelemetry), living documentation, versioned contracts, automated tests between services, and platform engineering with internal developer platforms.

### Commented example: five services by domain behind a gateway

Let us reuse the `lab-arq-app` image. Each service serves a prefix (`ROTAS`), and an Nginx plays the role of **single facade**: the client only knows `localhost:8080`, and the gateway routes by the URL prefix.

**Cockpit perspective:** Nginx is the race engineer. The driver (the client) knows a single voice, `localhost:8080`, and does not know who the specialists behind it are. He says "candidato" or "empresa", and the engineer forwards each request to the right station by the prefix. It is the same figure as the communication chain in Stage 01: there, the engineer was the presentation layer of a single block; here, the gateway occupies that same single-voice place, but now in front of several independent stations.

```sh
cd ..                               # leaves etapa-01 and goes back to lab-arquitetura
mkdir -p etapa-02 && cd etapa-02
pwd                                 # should end in /lab-arquitetura/etapa-02
```

`gateway.conf`:

```nginx
server {
    listen 80;
    resolver 127.0.0.11 valid=5s;   # Docker's internal DNS; resolves service names at request time

    location /autenticacao/ { set $alvo http://autenticacao:8080; proxy_pass $alvo; }  # prefix -> service
    location /adm/          { set $alvo http://adm:8080;          proxy_pass $alvo; }
    location /professor/    { set $alvo http://professor:8080;    proxy_pass $alvo; }
    location /empresa/      { set $alvo http://empresa:8080;      proxy_pass $alvo; }
    location /candidato/    { set $alvo http://candidato:8080;    proxy_pass $alvo; }
}
```

Two observations: using a variable in `proxy_pass` (with `resolver`) makes Nginx resolve the name at each use, so the gateway starts even if a service is stopped and answers `502` only for that route. Without the variable, Nginx tries to resolve all the names at startup and refuses to start if any does not exist. Also, since `proxy_pass` has no URI, the original path is passed to the service unchanged.

**Cockpit perspective:** the variable in `proxy_pass` is the engineer checking who is at the station at the time of the request, and not only before the session. If a station is empty, he tells the driver "no answer from that station right now" (`502`) and keeps serving the others. Without the variable, the engineer would refuse to start the session if anyone on the list were missing.

`compose.yaml`:

```yaml
services:
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
    depends_on: [autenticacao, adm, professor, empresa, candidato]
```

Bring it up: `docker compose up -d`.

### Hands-on

*Radio on! Five services behind a single voice at `localhost:8080`, and three calls to check: each prefix at its station, a station brought down on purpose, and a request to a station that does not exist.*

**1. Each prefix lands on the service of its domain.**

```sh
for d in autenticacao adm professor empresa candidato; do
  curl -s localhost:8080/$d/exemplo
done
```

Expected: five lines, each with `"servico"` equal to the requested prefix, for example `{"servico": "empresa", "caminho": "/empresa/exemplo"}`.

**2. Isolated failure: bring down only the Company service.**

```sh
docker compose stop empresa
for d in autenticacao professor empresa candidato; do
  echo -n "$d: "; curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/$d/exemplo
done
```

Expected: `200` for `autenticacao`, `professor`, and `candidato`, and `502` for `empresa`. The gateway is the proof that the cut by domain contains the damage.

**Cockpit perspective:** bringing down `empresa` is a station going offline in the middle of the session. The driver keeps getting answers from the other stations; only that subject is left without a reply. **Here the analogy stops:** the real race engineer improvises, prioritizes, and sometimes answers off the top of his head. The gateway knows nothing about the domain: it only forwards and returns the code.

**3. A route that no service serves.**

```sh
curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/financeiro/relatorio
```

Expected: `404`, returned by the gateway itself.

**Cockpit perspective:** it is the engineer answering "that station does not exist in this team" without bothering anyone in the garage.

**Cleanup:**

```sh
docker compose down
```

### Exercises

*Flying lap! Four questions about where to cut. Clock running, and no peeking at the test system table.*

1. **Cut by layer or by capability?** Classify each service proposal: (a) "data access service", (b) "scheduling service", (c) "messaging service". *Expected answer:* (a) and (c) are technical layers, undesirable as a service boundary; (b) is a business capability.
2. **Where does "send access to the candidate" live?** The Company needs to send credentials, but credentials belong to Authentication. Propose how the two services collaborate without the Company reading Authentication's database. *Expected answer:* the Company calls Authentication's API (or publishes an event) asking for the creation of the credentials; Authentication owns the data and responds. The Company never accesses its database (subject of Stage 03).
3. **ADM without its own database.** The material suggests that ADM has only a cache. What are the two ways it can get "candidates per company" without reading the Company's database, and what is the cost of each? *Expected answer:* (i) query the Company's API when needed, with latency and synchronous dependency; (ii) keep a cache updated by events or by expiration, accepting temporarily stale data (eventual consistency).
4. **Bounded context.** Write a word from the system that means different things to the Professor and to the Company and explain why that justifies separating the services. *Expected answer:* for example, "test": for the Company it is something contracted and tracked; for the Professor it is something to evaluate and give feedback on. Distinct models for the same term indicate distinct contexts, and forcing a single model creates coupling.

### Remember this

> Cut by the business, not by the technology: each service owner of a capability, with a clear contract, failing and scaling on its own.

*Sector 2 in green! Services cut by business capability, a versioned contract, and a gateway that contains the damage when a station goes down. And an agreement only counts if everyone keeps it: in Sepang, in 2013, Red Bull asked over the radio for Sebastian Vettel to hold position behind Mark Webber, and he overtook anyway. It was the Multi-21 case, the code name of that order: a contract that one side ignores breaks whoever depended on it, and that is why a contract between services is versioned and kept. Now the track gets truly technical: distributed data, in Stage 03.*

---

## Stage 03: Database with microservices

*Third sector, and it is the most technical part of the circuit. Each station now keeps its own data, and with that the transaction that solved everything at once is gone. Eventual consistency, CAP, saga, compensation: corner after corner, with no runoff area. Steady hands on the wheel.*

### The problem

Black Friday. The orders service and the inventory service share the same database "to keep it simple". The inventory team renames a column on a Saturday, and the orders service, which read that column directly, stops working without anyone in orders knowing about the change. Besides, the two teams have to choose the same database, scale the same database, and wait on the same database. It was the strongest possible coupling, hidden behind two apparently independent services.

The material's answer: **each service has its own database** and nobody reads the others' database. That solves the coupling, but charges a lot: global ACID transactions are gone, and you need to learn to deal with distributed data.

**Cockpit perspective:** in F1 it would be the power unit people renaming a channel in their database on a Saturday morning, and the strategy pit wall software, which read that channel straight from that database, ceasing to show energy consumption before qualifying. Nobody in strategy knew about the change, because the "contract" was another department's internal table. That is the hidden coupling.

### The concept

**Analogy: each department's notebook.** If all departments write in the same notebook, a format change in one of them breaks all. With one notebook per department, each organizes its own as it wishes; when they need data from another, they ask (API) or receive a note (event).

**Cockpit perspective:** each discipline owns its data. The tire engineer keeps the wear history however he wants; strategy, when it needs to, asks for the number (API) or receives the notice "tire passed the limit" (event). Nobody opens the other's database.

**Database per service and polyglot persistence.** Each service chooses the technology that serves it best (PostgreSQL, MongoDB...). This brings autonomy and scalability, but requires services to find ways to communicate and maintain consistency.

**The four challenges (from the material), in order of dependency:**

1. **Data isolation.** A service does not access another's database. Data is exchanged through APIs or events (an orders service emits "order created" and the inventory one adjusts the stock). Consequences: duplicated data and the need for synchronization.
2. **Consistency.** In the monolith, ACID (Atomicity, Consistency, Isolation, Durability) solves it. In microservices, strong consistency can compromise availability and scalability, and that is why many architectures adopt **eventual consistency**: the data may be temporarily inconsistent and converge later.
3. **Distributed transactions.** An operation that involves several services needs coordination (saga, 2PC), described below.
4. **Schema evolution.** Each service evolves its schema on its own, so compatibility between versions has to be managed. Migration tools such as **Flyway** and **Liquibase** version the changes and apply them incrementally and in a controlled way.

**Eventual consistency in practice (example from the material).** In an e-commerce store, the last stock item appears as available to two users. Only whoever finishes first gets the item, and the system notifies the second. Advantages: availability and horizontal scale. Challenges: implementation complexity and transparency for the user.

**Cockpit perspective:** F1 lives in eventual consistency. The classification right after the checkered flag is provisional: penalties decided by the stewards after the race can change positions, and the result converges to the official one. During the race too: while a car is in the pit box, the position table and the real order on track diverge for a few seconds. Nobody stops the race waiting for all the data to be perfect; the system accepts the divergence and converges later. **Here the analogy stops:** on track, the final convergence is a human decision. In a distributed system, it is done by events, compensations, and automatic rules.

*High-speed corner! CAP is where the most people leave the track, because they memorize "choose two out of three". Read the "during a partition" part twice: it is the one that scores points.*

**CAP theorem.** It describes the limitations of distributed systems among **Consistency** (everyone sees the most recent data), **Availability** (every request gets a response), and **Partition tolerance** (the system works even with parts disconnected). The practical reading: since network partitions happen, **during a partition** you choose between consistency and availability. Without a partition, it is possible to have both. (See the professor's note.)

**Cockpit perspective:** a partition is the loss of the telemetry link between the car and the pit wall. While the link is down, the pit wall has two options: wait for fresh data before deciding (consistency) or keep deciding with the last data it has, knowing it may be old (availability). With the link working, there is no dilemma: fresh data and an immediate decision. **Here the analogy stops:** on the pit wall, a person chooses, case by case. In the database, the choice is made beforehand, by design or configuration, and applied automatically.

**SQL or NoSQL?** The professor presents a decision flowchart (the figure does not come in the text). In terms of criteria:

| | SQL (MySQL, PostgreSQL) | NoSQL (MongoDB, Cassandra, Redis) |
|---|---|---|
| Schema | Rigid: tables, columns, types | Flexible: changes without complex migrations |
| Transactions | ACID | Many adopt eventual consistency |
| Queries | Complex, with joins and aggregations | Access-oriented model |
| Scale | Tends to scale vertically first | Designed to scale horizontally, by adding nodes |
| When to use | Strong consistency and integrity: banking, payments, e-commerce | Fast scale and semi-structured data: social networks, big data, IoT |

**Cockpit perspective:** SQL is the set-up spreadsheet (the car's adjustment for the circuit) with fixed columns: height, wing, pressure, each with a type and unit. To record a new parameter, someone has to create the column first, and that is the migration. NoSQL is the telemetry record in which each session can bring different channels (an extra test sensor in a free practice session, for example) without anyone changing the structure; in exchange, whoever reads has to know how to deal with the channel that is missing or extra.

**In the cloud: managed relational and NoSQL.** The material cites DynamoDB and Cosmos DB as highly scalable, global NoSQL. The complete table below is an addition by the professor, except for the DynamoDB and Cosmos DB pair, which the material cites.

| Need | AWS (added by the professor, except DynamoDB, cited in the material) | Azure (added by the professor, except Cosmos DB, cited in the material) |
|---|---|---|
| Managed relational (PostgreSQL, MySQL) | Amazon RDS; Amazon Aurora (MySQL and PostgreSQL compatible) | Azure Database for PostgreSQL, Azure Database for MySQL |
| Relational with the SQL Server engine | RDS for SQL Server | Azure SQL Database |
| NoSQL key-value and document | Amazon DynamoDB | Azure Cosmos DB (cited in the material) |
| MongoDB-compatible API | Amazon DocumentDB (with MongoDB compatibility) | Azure Cosmos DB for MongoDB |
| Cassandra-compatible API | Amazon Keyspaces | Azure Cosmos DB for Apache Cassandra |
| Redis cache | Amazon ElastiCache | Azure Cache for Redis; Microsoft announced Azure Managed Redis as its successor (check the documentation for the current name and status) |
| Object storage (videos, files) | Amazon S3 | Azure Blob Storage |
| Data change stream (basis for CQRS and events) | DynamoDB Streams | Cosmos DB change feed |
| Orchestrate a saga as a workflow | AWS Step Functions | Azure Durable Functions (or Logic Apps) |

**Where AWS and Azure really differ (without numbers):**

- **NoSQL billing model.** DynamoDB charges by read and write capacity, with on-demand mode or provisioned capacity. Cosmos DB charges in **Request Units per second (RU/s)**, a unit that abstracts the cost of each operation, with provisioned, autoscale, and serverless modes. To really compare cost, you need to measure your access pattern on both.
- **Consistency.** In DynamoDB, reads are, by default, eventually consistent, with an option for strongly consistent reads per request. Cosmos DB offers **five configurable consistency levels** (strong, bounded staleness, session, consistent prefix, and eventual), with session as the common starting point. It is the CAP choice in practice, exposed as configuration.
- **API model.** Cosmos DB is multi-API (its own NoSQL, MongoDB, Cassandra, among others) on a single service. On AWS, that variety is spread across distinct services (DynamoDB, DocumentDB, Keyspaces).
- **Relational.** Aurora is an AWS-specific implementation compatible with MySQL and PostgreSQL, with no exact counterpart on Azure. Azure SQL Database is the SQL Server engine as a service; on AWS, SQL Server runs on RDS.
- **Limits** (item size, partition size, request rate) are different and change over time. Consult both providers' documentation before modeling.

**Cockpit perspective:** the two circuits offer the same kinds of warehouse, with different usage rules. The differences that weigh are the way of charging and the level of consistency you can choose; the product name weighs little.

*Now the tightest sequence of the sector: saga, 2PC, Event Sourcing, and CQRS, one after the other. Whoever understands compensation here arrives in the lab in one piece.*

**Transaction patterns:**

**Saga.** Each step is a **local** transaction of a service; if a step fails, **compensating actions** are executed for the previous steps. Example from the material: a trip booking (flight, hotel, car); if the car fails, the hotel and flight are canceled. Two ways to coordinate: by **orchestration** (a central coordinator says what each service does) or by **choreography** (each service reacts to events). The lab below uses orchestration. Advantages: isolated failures, independent scale. Challenges: complex coordination and latency.

**Cockpit perspective:** the lab's saga is already F1 logistics. **Hypothetical** example: the team books a flight, hotel, and car for Singapore, which takes place October 9 to 11, 2026. If the rental car fails, the hotel is canceled and then the flight, in reverse order, and the canceled bookings stay in the history. Orchestration is the team's logistics coordinator giving orders at each step. Choreography is the "safety car" message from race control, like the one on lap 9 in Sepang: nobody gives an individual order to each department, and each one reacts to the event on its own and in its own time (strategy recalculates the stop window, the garage prepares the tires, the engineer warns the driver), without waiting for the others to finish.

**Two-Phase Commit (2PC).** A preparation phase (everyone confirms they can complete) and a commit phase (finalizes). It gives strong consistency, at the cost of latency and complexity. Example from the material: a bank transfer. In practice, between microservices it is usually avoided, because it holds resources while waiting for the last participant and requires everyone to support the protocol.

**Cockpit perspective:** 2PC is the same release light from Stage 01, now seen as a protocol. In the preparation, each wheel gun operator signals that their wheel is secured; in the commit, the light turns green and the car leaves. Consistency is strong (nobody leaves with a loose wheel), and the price is the same as 2PC's: the car sits waiting for the slowest station, and an operator who freezes holds the whole car. In the stop that is acceptable, because everything happens in a few seconds and in the same place. Between services over the network, holding resources while waiting for the last participant is expensive, and that is why the saga is preferred.

**Design patterns:**

**Event Sourcing.** Instead of storing the current state, you store the **immutable sequence of events** (order created, updated, shipped) and the state is rebuilt by replaying them. Benefits: auditability and the possibility of reprocessing. Costs: complexity and storage space.

**CQRS (Command Query Responsibility Segregation).** Separate models for **commands** (write, normalized, prioritizes integrity) and **queries** (read, denormalized, fast). Benefits: independent scale, performance, and flexibility. Cost: keeping the two models in sync, with eventual consistency on the read side.

**Cockpit perspective:** F1 timing illustrates Event Sourcing well: the loops in the track record each passage of each car, and the classification, at any moment, is derived from that sequence of events (passages, stops, penalties). You can reprocess the entire race and audit any position. CQRS is the separation between whoever records the passages and the timing screen that the team and the public read: the screen is a precomputed read model, updated in cycles, which may be an instant behind the track. **Here the analogy stops:** I use the general idea (recorded passages and a classification derived from them), not the internal implementation of the official timing system, which I do not know in detail.

**Integration examples (from the material):**

- E-commerce: catalog in MongoDB (flexible information), payments in PostgreSQL (safe transactions), orders as events, and CQRS in the cart.
- Streaming: users in Cassandra (horizontal scale), recommendations in Elasticsearch (fast search), each playback as an event.

**In the market (according to the material):** polyglot persistence is gaining ground, along with patterns such as CQRS, Event Sourcing, and Sagas; Kafka and RabbitMQ appear as asynchronous messaging between services; Amazon, Netflix, Spotify, and Mercado Livre are cited as examples of independent teams per domain. The material states that "more than 75% of large companies" have already started or plan to migrate, citing Gartner and InfoQ; the reference provided does not allow the number to be verified (see the professor's notes).

### Commented example: database per service and a trip booking saga

Three booking services (flight, hotel, and car), each with **its own database** (SQLite on its own volume), and a saga orchestrator in shell. We use SQLite so as not to depend on external drivers; the principle holds just the same for PostgreSQL or MongoDB.

```sh
cd ..                                       # leaves etapa-02 and goes back to lab-arquitetura
mkdir -p etapa-03/reserva && cd etapa-03
pwd                                         # should end in /lab-arquitetura/etapa-03
```

`reserva/reserva.py`:

```python
import json
import os
import sqlite3
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

NOME = os.environ["NOME"]  # voo, hotel or carro
LOCK = threading.Lock()  # SQLite on a shared connection: serializes access
ESTADO = {"falhar": False}  # switch to simulate a faulty service
DB = sqlite3.connect("/data/reservas.db", check_same_thread=False)  # OWN database, on its own volume
DB.execute("CREATE TABLE IF NOT EXISTS reservas (id TEXT PRIMARY KEY, status TEXT NOT NULL)")
DB.commit()


class Handler(BaseHTTPRequestHandler):
    def responder(self, status, corpo):
        dados = (json.dumps(corpo, ensure_ascii=False) + "\n").encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(dados)))
        self.end_headers()
        self.wfile.write(dados)

    def do_GET(self):
        if self.path == "/reservas":
            with LOCK:
                linhas = DB.execute("SELECT id, status FROM reservas ORDER BY id").fetchall()
            return self.responder(200, {"servico": NOME, "reservas": [{"id": i, "status": s} for i, s in linhas]})
        self.responder(404, {"erro": "rota inexistente"})

    def do_POST(self):
        partes = [p for p in self.path.split("/") if p]
        if partes == ["modo", "falha"]:
            ESTADO["falhar"] = True
            return self.responder(200, {"servico": NOME, "modo": "falha"})
        if partes == ["modo", "normal"]:
            ESTADO["falhar"] = False
            return self.responder(200, {"servico": NOME, "modo": "normal"})
        if len(partes) == 2 and partes[0] == "reservar":
            if ESTADO["falhar"]:
                return self.responder(500, {"servico": NOME, "erro": "indisponível"})  # a real failure: status 500
            with LOCK:  # LOCAL transaction: only this service and this database
                DB.execute("INSERT OR REPLACE INTO reservas VALUES (?, 'CONFIRMADA')", (partes[1],))
                DB.commit()
            return self.responder(201, {"servico": NOME, "id": partes[1], "status": "CONFIRMADA"})
        if len(partes) == 2 and partes[0] == "cancelar":
            with LOCK:  # compensation: a new business action, idempotent (repeating does not make it worse)
                DB.execute("UPDATE reservas SET status = 'CANCELADA' WHERE id = ?", (partes[1],))
                DB.commit()
            return self.responder(200, {"servico": NOME, "id": partes[1], "status": "CANCELADA"})
        self.responder(404, {"erro": "rota inexistente"})


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
```

`reserva/Dockerfile`:

```dockerfile
# The sqlite3 module already comes with Python
FROM python:3.12-alpine
WORKDIR /srv
COPY reserva.py .
EXPOSE 8080
CMD ["python", "-u", "reserva.py"]
```

`compose.yaml`:

```yaml
services:
  voo:
    build: ./reserva
    init: true                        # fast stop (see Stage 01)
    environment: { NOME: voo }
    volumes: ["voo-data:/data"]       # exclusive volume: only this container sees this data
    ports: ["8101:8080"]
  hotel:
    build: ./reserva
    init: true                        # fast stop (see Stage 01)
    environment: { NOME: hotel }
    volumes: ["hotel-data:/data"]
    ports: ["8102:8080"]
  carro:
    build: ./reserva
    init: true                        # fast stop (see Stage 01)
    environment: { NOME: carro }
    volumes: ["carro-data:/data"]
    ports: ["8103:8080"]

volumes:                              # three volumes, three independent databases
  voo-data: {}
  hotel-data: {}
  carro-data: {}
```

`saga.sh` (the orchestrator; give it permission with `chmod +x saga.sh`):

```bash
#!/usr/bin/env bash
# Orchestrated saga: books flight, hotel, and car; if any step fails, compensates the previous ones in reverse order.
ID="$1"
PASSOS=(voo:8101 hotel:8102 carro:8103)   # name:port, in execution order
FEITOS=()                                  # steps already completed (candidates for compensation)

for passo in "${PASSOS[@]}"; do
  nome="${passo%%:*}"; porta="${passo##*:}"
  codigo=$(curl -s -o /dev/null -w "%{http_code}" -X POST "localhost:$porta/reservar/$ID")
  if [ "$codigo" = "201" ]; then
    echo "OK     reservar $nome"
    FEITOS+=("$passo")
  else
    echo "FALHA  reservar $nome (HTTP $codigo), compensando..."
    for ((i=${#FEITOS[@]}-1; i>=0; i--)); do   # from the last completed to the first
      f="${FEITOS[$i]}"
      curl -s -o /dev/null -X POST "localhost:${f##*:}/cancelar/$ID"
      echo "DESFEZ cancelar ${f%%:*}"
    done
    exit 1
  fi
done
echo "SAGA CONCLUIDA para $ID"
```

Bring it up: `docker compose up -d --build`.

### Hands-on

*Timed pit stop! Eight stops at this box: the saga on the happy path, the failure on the last step with compensation in reverse order, what stayed in the databases, the isolation proof, the rigid schema refusing a column, and Event Sourcing in miniature. The last two items are marked as optional and as cloud reference: read the markings before running.*

**1. Happy path.**

```sh
./saga.sh viagem-1
```

Expected:

```text
OK     reservar voo
OK     reservar hotel
OK     reservar carro
SAGA CONCLUIDA para viagem-1
```

**2. Failure on the last step and compensation.**

```sh
curl -s -X POST localhost:8103/modo/falha          # the car service starts failing
./saga.sh viagem-2
```

Expected:

```text
OK     reservar voo
OK     reservar hotel
FALHA  reservar carro (HTTP 500), compensando...
DESFEZ cancelar hotel
DESFEZ cancelar voo
```

**Cockpit perspective:** the `DESFEZ` in reverse order is the logistics dismantling the trip from the last completed step to the first.

**3. What the compensation left in the databases.**

```sh
curl -s localhost:8101/reservas
curl -s localhost:8102/reservas
curl -s localhost:8103/reservas
```

Expected: flight and hotel show `viagem-1` as `CONFIRMADA` and `viagem-2` as `CANCELADA`; car shows only `viagem-1`. Note: the `viagem-2` booking **was not deleted**, but canceled. Compensating is not going back in time (rollback): it is a new business action, which leaves a history. During the saga there was also a window in which flight and hotel were confirmed and the car was not: that is eventual consistency in action.

Before moving on, put the car service back in normal mode. Without that, any new run of the saga fails on the last step:

```sh
curl -s -X POST localhost:8103/modo/normal
```

Expected: `{"servico": "carro", "modo": "normal"}`.

**Cockpit perspective:** the cancellation that stays in the database is like a canceled booking that remains in the travel agency's system, with the status changed. Nobody deletes the record; a new action is added on top. That is what separates compensation from rollback.

**4. Isolation proof: each service only sees its own database.**

```sh
docker compose exec hotel python -c "import sqlite3; print(sqlite3.connect('/data/reservas.db').execute('select * from reservas').fetchall())"
docker compose exec carro python -c "import sqlite3; print(sqlite3.connect('/data/reservas.db').execute('select * from reservas').fetchall())"
```

Expected: the hotel lists `viagem-1` and `viagem-2` (canceled); the car lists only `viagem-1`. The same path `/data/reservas.db` points to different data in each container, because each volume is exclusive. There is no path for one service to read the other's database: only through the API.

**Cockpit perspective:** the same path in two containers is like the same file name on the computers of two departments: the tire `historico` and the power unit `historico` have nothing to do with each other, and nobody from outside opens either of them.

**5. Rigid x flexible schema (SQL x NoSQL), with real databases.**

```sh
docker rm -f pg 2>/dev/null   # lets you repeat the step from scratch
docker run -d --name pg -e POSTGRES_PASSWORD=lab postgres:16-alpine
until docker exec pg pg_isready -h 127.0.0.1 -U postgres >/dev/null 2>&1; do sleep 1; done   # waits for the server to accept TCP connections
docker exec pg psql -U postgres -c "CREATE TABLE produtos (id int PRIMARY KEY, nome text);"
docker exec pg psql -U postgres -c "INSERT INTO produtos (id, nome, tags) VALUES (1, 'Pneu', 'borracha');"
```

The `until` loop replaces a fixed `sleep`: on the first startup, the Postgres image creates the database on a temporary server, which only listens on the local socket, and then restarts. Testing over TCP (`-h 127.0.0.1`) only passes when the final server is up.

Expected: the first statement prints `CREATE TABLE`, and the second fails with a message that begins with `ERROR:  column "tags" of relation "produtos" does not exist`. In the rigid schema, changing the data format requires a **migration** (this is where Flyway and Liquibase come in):

```sh
docker exec pg psql -U postgres -c "ALTER TABLE produtos ADD COLUMN tags text;"
docker exec pg psql -U postgres -c "INSERT INTO produtos (id, nome, tags) VALUES (1, 'Pneu', 'borracha');"
```

Expected: `INSERT 0 1`.

**Cockpit perspective:** the `ERROR` is the set-up spreadsheet refusing a parameter that has no column. The `ALTER TABLE` is the spreadsheet revision, recorded, before the new data goes in.

**6. Event Sourcing and CQRS in miniature (in the same Postgres).**

```sh
docker exec -i pg psql -U postgres <<'SQL'
-- Lets you repeat the exercise: drops the table and the read model from a previous run
DROP TABLE IF EXISTS eventos CASCADE;
-- Event sourcing: events are only appended, the balance is never updated
CREATE TABLE eventos (id serial PRIMARY KEY, conta text, tipo text, valor numeric);
INSERT INTO eventos (conta, tipo, valor) VALUES ('c1', 'deposito', 100), ('c1', 'retirada', 30), ('c1', 'deposito', 50);
-- The current state is rebuilt from the events
SELECT conta, SUM(CASE WHEN tipo = 'deposito' THEN valor ELSE -valor END) AS saldo FROM eventos GROUP BY conta;
-- CQRS: a separate, precomputed READ model
CREATE MATERIALIZED VIEW saldos AS
  SELECT conta, SUM(CASE WHEN tipo = 'deposito' THEN valor ELSE -valor END) AS saldo FROM eventos GROUP BY conta;
-- A new event enters on the write side...
INSERT INTO eventos (conta, tipo, valor) VALUES ('c1', 'deposito', 10);
-- ...but the read model still shows the old value (eventual consistency)
SELECT * FROM saldos;
REFRESH MATERIALIZED VIEW saldos;
SELECT * FROM saldos;
SQL
```

Expected: on the first run, `DROP TABLE IF EXISTS` warns `NOTICE:  table "eventos" does not exist, skipping`, which is normal (on later runs, it warns that it also dropped `saldos`). The first `SELECT` shows balance `120`; the `SELECT * FROM saldos` before the refresh still shows `120`; after the `REFRESH`, it shows `130`. The read was temporarily stale, and the "synchronization" is the refresh. In a real system, that role is played by events published and consumed by the read service.

**Cockpit perspective:** the events are the timing passages; the `SELECT` with a sum is the rebuilt classification; the materialized view is the timing screen. Before the `REFRESH`, the screen shows `120` with the track already at `130`.

**7. Optional: local NoSQL with DynamoDB Local (needs the `aws` CLI).**

```sh
docker run -d --name ddb -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -inMemory
export AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local AWS_DEFAULT_REGION=us-east-1   # fake credentials, only for the emulator
EP=http://localhost:8000
aws dynamodb create-table --endpoint-url "$EP" --table-name produtos \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
aws dynamodb put-item --endpoint-url "$EP" --table-name produtos --item '{"id":{"S":"1"},"nome":{"S":"Pneu"}}'
aws dynamodb put-item --endpoint-url "$EP" --table-name produtos --item '{"id":{"S":"2"},"nome":{"S":"Capacete"},"tags":{"L":[{"S":"seguranca"}]}}'
aws dynamodb scan --endpoint-url "$EP" --table-name produtos
```

The quotes around `"$EP"` make the command work the same in bash and zsh (macOS's default shell). If port 8000 is taken (`lsof -i :8000` on macOS), start with `-p 8001:8000` and use `EP=http://localhost:8001`.

Expected: `create-table` returns the table description, the `put-item` calls print nothing, and `scan` lists the two items with `"Count": 2`. Both items are stored without any migration, even with different attributes (the second has `tags`). Only the key (`id`) is mandatory. It is the schema flexibility of NoSQL. The cost: validating the format becomes the application's responsibility. (Azure Cosmos DB also has a local emulator, but the setup is more laborious; consult Microsoft's documentation if you want to repeat the exercise there.)

**Cockpit perspective:** `Pneu` without tags and `Capacete` with tags live in the same table like sessions with different channels in the same telemetry record. The table does not complain; whoever reads has to know that the channel may be missing.

**8. Cloud reference (do not run it to complete the guide; it creates resources and incurs charges).**

Equivalent NoSQL, creating a table or container:

```sh
# AWS: DynamoDB table with on-demand billing
aws dynamodb create-table --table-name produtos \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Azure: Cosmos DB account, database, and container with partition key /id
az group create --name rg-lab --location brazilsouth
az cosmosdb create --name <conta-unica> --resource-group rg-lab
az cosmosdb sql database create --account-name <conta-unica> --resource-group rg-lab --name loja
az cosmosdb sql container create --account-name <conta-unica> --resource-group rg-lab \
  --database-name loja --name produtos --partition-key-path "/id"
```

Managed relational and read replica:

```sh
# AWS: PostgreSQL instance on RDS and read replica
aws rds create-db-instance --db-instance-identifier pedidos-db --db-instance-class db.t3.micro \
  --engine postgres --allocated-storage 20 --master-username labadmin --master-user-password '<senha>'
aws rds create-db-instance-read-replica --db-instance-identifier pedidos-db-leitura \
  --source-db-instance-identifier pedidos-db

# Azure: PostgreSQL flexible server and read replica
az postgres flexible-server create --resource-group rg-lab --name <servidor-unico> \
  --location brazilsouth --admin-user labadmin --admin-password '<senha>'
az postgres flexible-server replica create --replica-name <replica-unica> \
  --resource-group rg-lab --source-server <servidor-unico>
```

The administrator user is called `labadmin` on both providers because Azure Database for PostgreSQL refuses reserved names such as `admin`, `administrator`, `root`, `guest`, and `azure_superuser`.

Cleaning up the cloud resources: `aws dynamodb delete-table --table-name produtos` and `aws rds delete-db-instance --db-instance-identifier <id> --skip-final-snapshot` on AWS (delete the replica first), and `az group delete --name rg-lab --yes` on Azure, which removes everything at once. Instance class names and SKU options change; check the provider's current catalog.

**Local cleanup:**

```sh
docker compose down -v
docker rm -f pg ddb 2>/dev/null
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_DEFAULT_REGION EP   # the fake credentials do not stay in effect in the session
```

### Exercises

*Flying lap! Five questions, from the right database for each service to the orchestrator that goes down in the middle of the saga. It is the longest set of the GP; steady pace.*

1. **Choose the database.** For each e-commerce service, indicate SQL or NoSQL and the justification: (a) payments, (b) a catalog with very variable attributes per product, (c) temporary sessions and cart. *Expected answer:* (a) SQL (ACID, integrity, strong consistency); (b) document NoSQL, for schema flexibility; (c) in-memory key-value NoSQL (Redis), for fast reads and writes. In the cloud, (b) could be DynamoDB or Cosmos DB, and (c) ElastiCache or Azure Cache for Redis (or the announced successor, Azure Managed Redis).
2. **Idempotency.** In the lab, run `curl -s -X POST localhost:8101/cancelar/viagem-2` twice. What is the result and why does it matter in a saga? *Expected answer:* the status remains `CANCELADA` and there is no error. The compensation must be idempotent because the orchestrator may repeat it after a network failure or a crash midway.
3. **What if the orchestrator goes down in the middle?** What limitation of `saga.sh` does this expose and how do managed products tackle it? *Expected answer:* `saga.sh` keeps progress only in memory; if it dies between the hotel and the car, nobody knows that compensation is needed. Managed orchestration services (AWS Step Functions, Azure Durable Functions) persist the workflow state and resume from where it stopped.
4. **CAP.** A NoSQL database chooses availability during a network partition. What can the user see and how does Stage 03 say to deal with it? *Expected answer:* temporarily stale or divergent data between nodes; the system must converge later (eventual consistency) and clearly communicate the state to the user, using compensation when necessary.
5. **Compare Cosmos DB and DynamoDB.** Give one billing difference and one consistency difference. *Expected answer:* Cosmos DB charges in Request Units per second, DynamoDB in read and write capacity; DynamoDB reads with eventual consistency by default, with an option for strong reads per request, while Cosmos DB exposes five configurable levels.

### Remember this

> Each service owns its data and you only talk by API or event; without a global transaction, consistency becomes a design: saga to coordinate, compensation to undo, eventual consistency as the rule.

*Sector 3 in green, and it was the most technical stretch of the circuit! Database per service, a saga with compensation that leaves a history, and a timing screen that stays an instant behind the track until the refresh. A provisional result is part of the game: in Suzuka, in 1989, Ayrton Senna crossed the line first and was disqualified by the stewards after the race, and the victory went to Alessandro Nannini. Now the final straight: how the stations talk, in Stage 04.*

---

## Stage 04: Communication between microservices

*Fourth sector, the final straight! The stations already exist and each one keeps its own data; what remains is deciding how they talk to each other. A question over the radio or a tire on the pile? Whoever chooses wrong leaves the car stopped in the pit box because of a secondary task.*

### The problem

The orders service, on receiving a purchase, calls the notifications service by HTTP and waits for the response before confirming to the customer. On the night of a promotion, the notifications service gets slow because of an email provider. Each order starts taking the time of the email; connections pile up in orders; and soon the entire site is down because of a secondary service. Worse: if the notifications service goes down, **nobody can buy**, even though notifying is not the critical part of the purchase.

**Cockpit perspective:** it is the car stuck in the pit box waiting for a secondary task. Imagine a **hypothetical** procedure in which the crew only releases the car after the tire engineer measures the set that was just removed. On a normal day, that already delays each stop; if the measuring equipment breaks, no car leaves the pit box, even though measuring a used tire has nothing to do with the car going back to the track. That is why teams do the opposite: the car leaves, and the removed tires are analyzed later.

How should independent services talk? The answer depends on how much you need the response, and that is what the lesson teaches.

### The concept

**Analogy: phone call x letter.** Calling someone (synchronous) gives the answer right away, but requires the person to be available now, and you hang on the line until they pick up. Sending a letter (asynchronous) lets you get on with your life, but the answer arrives later, and the letter can get lost or be delivered twice.

**Cockpit perspective:** synchronous is the question over the radio that needs an answer before the driver acts ("pit this lap?"). Asynchronous is the used tire set that goes to the tire engineer's pile and is measured when he can.

**Synchronous communication.** The client sends the request and **waits** for the response before continuing. The material's two formats:

- **REST** (Representational State Transfer): an architecture style over HTTP. Properties: resources represented in a textual format (JSON or XML); client-server; **stateless** (each request carries everything the server needs, which improves scale and fault tolerance); HTTP operations (GET, POST, PUT, DELETE); a unique URI per resource; cache; uniform interface; layers. Responses carry **status codes** and can feed error metrics and monitoring.
- **gRPC**: created by Google; uses **Protocol Buffers** (protobuf) serialization to send messages in binary, reducing latency and improving performance, with a well-defined contract.

Advantages: simplicity and an immediate response to decide with. Disadvantages: **temporal coupling** (if the server is down or slow, the client suffers) and difficulty scaling under many simultaneous connections.

**Cockpit perspective:** REST is the radio with standardized vocabulary: each message is complete, readable, and independent (stateless: the engineer does not need to remember the previous conversation to understand the current sentence). gRPC is the telemetry: binary, compact, with channels defined by schema, made for volume and speed. **Here the analogy stops:** telemetry is a continuous flow from the car to the pit wall, and the most common use of gRPC is question and answer (it also supports streaming). The parallel is with the format, binary and with a schema, not with the direction of the flow.

**Asynchronous communication.** The requester sends a **message** and moves on; the receiver processes it in its own time. Tools cited: RabbitMQ, Kafka, and AWS SQS. Advantages: temporal decoupling, and queues that absorb peaks. Disadvantages: complexity (a messaging system is a new point of failure) and **delivery failures**: messages can be lost or duplicated, which requires retry and delivery confirmation (and consumers that tolerate repetition).

**Cockpit perspective:** the pile of tires absorbs the peak: in a safety car, both cars stop and the sets accumulate to be measured later. The cost is a new point of failure (the pile and whoever takes care of it) and the risk of a set getting lost or being logged twice in the record. That is why each set is identified, and logging the same set again must not duplicate the data.

**API Gateway.** With many services, the gateway is the central point: it routes requests, aggregates responses, and centralizes security (authentication, authorization, access control). Disadvantages: it can become a **single point of failure** or a bottleneck (it requires high availability) and adds latency. Modern gateways (Kong, Apigee, Amazon API Gateway, Traefik, according to the material) offer rate limiting, monitoring, payload transformation, and integration with OpenID Connect and OAuth2.

**Cockpit perspective:** it is the race engineer again: the single point between the driver and the team, who forwards, filters, and controls who can ask for what. And he has the same risk: if the radio fails, the driver is left with no station at all, however good the team is. That is why backup channels exist (the board shown at the pit wall, messages on the steering wheel display) and, in software, high availability of the gateway.

**Hybrid: what is really done.** The material describes the practice: synchronous calls for critical and immediate actions, and asynchronous events to propagate changes and decouple domains. You respond fast to the user and maintain consistency through events.

**Cockpit perspective:** hybrid is how a stop really works: what decides whether the car leaves (wheels secured) is synchronous and happens right away; what can wait (measuring the tires, updating the wear model, warning the factory) becomes an event.

**Observability and distributed tracing.** A user action crosses several services; without a common identifier, correlating logs becomes a detective story without clues. Tools cited: OpenTelemetry, Jaeger, and Honeycomb.

**Cockpit perspective:** each tire has a barcode, and the FIA tracks each set over the weekend. Following the same code through all the records is distributed tracing: you can tell where that set went without guessing.

**In the cloud: queues, events, gateway, and observability (added by the professor, except SQS and Amazon API Gateway, cited in the material).**

*Queues (one message, one consumer):*

| Need | AWS (added by the professor, except SQS, cited in the material) | Azure (added by the professor) |
|---|---|---|
| Simple, cheap queue | Amazon SQS (standard) | Azure Queue Storage |
| Queue with ordering, sessions, deduplication, transactions | SQS FIFO | Azure Service Bus (queues) |

*Publish and subscribe (one message, several consumers):*

| Need | AWS (added by the professor) | Azure (added by the professor) |
|---|---|---|
| Notification fan-out | Amazon SNS | Service Bus topics and subscriptions |
| Event routing by rules between services and sources | Amazon EventBridge | Azure Event Grid |
| Continuous high-volume event stream (Kafka's role) | Kinesis Data Streams; Amazon MSK (managed Kafka) | Azure Event Hubs (offers a Kafka protocol-compatible endpoint) |

*Gateway and observability:*

| Need | AWS (added by the professor, except Amazon API Gateway, cited in the material) | Azure (added by the professor) |
|---|---|---|
| API Gateway (routing, authentication, rate limit) | Amazon API Gateway | Azure API Management |
| Metrics, logs, and alarms | Amazon CloudWatch | Azure Monitor (with Log Analytics) |
| Distributed tracing and APM | AWS X-Ray; also OpenTelemetry support | Application Insights (inside Azure Monitor); also OpenTelemetry support |
| Managed Prometheus and Grafana | Amazon Managed Service for Prometheus and Amazon Managed Grafana | Azure Monitor managed service for Prometheus and Azure Managed Grafana |

**Cockpit perspective:** a queue is the pile of tires for the tire engineer: each set is measured by a single technician. Publish and subscribe are race control's messages: one message ("safety car") reaches all teams at the same time. The event stream (Kafka, Kinesis, Event Hubs) is the complete timing record, which stays stored and can be reread from the beginning. Both circuits have the three installations, with different names and rules, and telemetry (metrics, logs, and tracing) also exists at both.

*Attention, the track narrows: delivery semantics, DLQ, and message lifecycle change from one circuit to the other. It is this stretch that separates those who know the service name from those who know how to operate it.*

**Where they really differ:**

- **Delivery semantics.** SQS standard delivers **at least once** and without an ordering guarantee; SQS FIFO offers ordering within a message group and deduplication. Azure Queue Storage is also at least once and **does not guarantee FIFO**. Service Bus offers ordering with **sessions**, duplicate detection, and two receive modes: *peek-lock* (the message stays locked until you confirm, at least once) and *receive-and-delete* (at most once). Event Grid and SNS also work with at-least-once delivery. Practical conclusion: on both providers, **your consumer needs to be idempotent**.
- **Problem messages (DLQ).** SQS has a dead-letter queue by redrive policy; Service Bus has a built-in dead-letter queue per queue, with a configurable maximum delivery count; Azure Queue Storage **has no native DLQ**: the application must look at the attempt counter (dequeue count) and move the message itself. The exception is whoever consumes the queue through the Azure Functions queue trigger: after the maximum number of attempts, the platform moves the message by itself to a queue with the `-poison` suffix (for example, `pedidos-poison`).
- **Message lifecycle.** SQS: *visibility timeout* after receiving and `delete-message` on completion. Queue Storage: *visibility timeout* on `get`, with `delete` using a receipt (pop receipt). Service Bus: message *lock* in peek-lock and `complete` on completion. The idea is the same: the message does not disappear until the consumer confirms, and it reappears if the consumer fails.
- **Billing (without numbers).** SQS charges per request. Queue Storage charges per transaction and per storage, as part of a storage account. Service Bus charges per tier: the Standard level has a base amount plus operations, and Premium has dedicated capacity. Topics in Service Bus require Standard or Premium; Basic only has queues. Consult the pricing page.
- **Event x message.** Event Grid is designed to **notify that something happened** (a lightweight event, routed by subscriptions); Service Bus is designed for **commands and business data** that cannot be lost. EventBridge and SNS sit in similar positions on AWS (events by rules, and fan-out), while SQS holds the work to be done.
- **Kafka is not just a queue.** Kafka (cited in the material) is a distributed event **log** with consumer groups: messages stay retained and can be reread. Event Hubs and Kinesis occupy that same event stream space, not that of traditional queues.
- **Gateway.** Amazon API Gateway and Azure API Management offer routing, authentication, rate limiting, and importing of OpenAPI definitions. APIM has a developer portal and a configurable policy model in XML, and is offered in tiers; API Gateway has different API types (REST, HTTP, WebSocket) with different characteristics and prices. Compare against your use case, not by the name.

**Cockpit perspective:** the *visibility timeout*, the *peek-lock*, and the receipt are the technician who takes a set from the pile and marks it "under analysis": if he does not finish, the set goes back to the pile and another technician takes it. The DLQ is the separate box for the set that cannot be measured no matter what, so nobody keeps trying forever. In Queue Storage, whoever builds that box is you.

### Commented example: orders and notifications, synchronous and asynchronous

The lab has four pieces: a **gateway** (Nginx, with rate limit and generation of a request identifier), the **orders** service, the **notifier** (slow on purpose: 2 s per notification, reachable by HTTP **and** by queue), and **Redis**, which serves as the queue.

**Cockpit perspective:** on our map, `pedidos` is the pit stop, `notificador` is the tire engineer measuring the removed set (2 s per set, on purpose), Redis is the pile of tires, and the gateway is the race engineer, who also stamps each request with an identifier, like the tire barcode.

```sh
cd ..                                                        # leaves etapa-03 and goes back to lab-arquitetura
mkdir -p etapa-04/servicos etapa-04/gateway && cd etapa-04
pwd                                                          # should end in /lab-arquitetura/etapa-04
```

`servicos/pedidos.py`:

```python
import json
import os
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import redis

MODO = os.getenv("MODO", "sync")  # "sync" calls the notifier by HTTP; "async" uses the queue
r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)


class Handler(BaseHTTPRequestHandler):
    def responder(self, status, corpo):
        dados = (json.dumps(corpo, ensure_ascii=False) + "\n").encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(dados)))
        self.end_headers()
        self.wfile.write(dados)

    def do_POST(self):
        partes = [p for p in self.path.split("/") if p]
        if len(partes) != 2 or partes[0] != "pedidos":
            return self.responder(404, {"erro": "rota inexistente"})
        pedido = partes[1]
        req = self.headers.get("X-Request-Id", "sem-id")  # identifier created by the gateway
        inicio = time.time()

        if MODO == "sync":
            try:
                chamada = urllib.request.Request(
                    f"http://notificador:8080/notificar/{pedido}",
                    method="POST",
                    headers={"X-Request-Id": req},  # propagates the identifier
                )
                urllib.request.urlopen(chamada, timeout=5).read()  # WAITS for the response (temporal coupling)
            except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
                print(f"req={req} pedido={pedido} FALHA ao notificar: {e}", flush=True)
                return self.responder(502, {"erro": "notificador indisponível", "pedido": pedido})
            print(f"req={req} pedido={pedido} concluido em {time.time() - inicio:.2f}s (sync)", flush=True)
            return self.responder(201, {"pedido": pedido, "status": "criado e notificado"})

        # async mode: puts it on the queue and responds right away; the id travels INSIDE the message
        r.lpush("fila:notificacoes", json.dumps({"pedido": pedido, "req": req}))
        print(f"req={req} pedido={pedido} enfileirado em {time.time() - inicio:.3f}s (async)", flush=True)
        self.responder(202, {"pedido": pedido, "status": "aceito, notificação em andamento"})


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
```

`servicos/notificador.py`:

```python
import json
import os
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import redis

TRABALHO = float(os.getenv("TRABALHO_S", "2"))  # time of each notification (slow email provider)
r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)


def notificar(pedido, req, origem):
    time.sleep(TRABALHO)  # simulates the sending
    print(f"req={req} pedido={pedido} NOTIFICADO via {origem}", flush=True)


def consumidor():
    # Service entry 2 (queue consumer): reads the queue in the background, one message at a time
    while True:
        try:
            item = r.brpop("fila:notificacoes", timeout=5)  # blocks up to 5s waiting for a message
            if item is None:
                continue
            msg = json.loads(item[1])
            notificar(msg["pedido"], msg["req"], "fila")
        except redis.ConnectionError:
            time.sleep(1)  # Redis is not up yet: tries again


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Service entry 1 (synchronous HTTP): the same port 8080 as always
        partes = [p for p in self.path.split("/") if p]
        if len(partes) == 2 and partes[0] == "notificar":
            notificar(partes[1], self.headers.get("X-Request-Id", "sem-id"), "http")
            dados = b'{"status": "notificado"}\n'
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(dados)))
            self.end_headers()
            self.wfile.write(dados)
        else:
            self.send_response(404)
            self.send_header("Content-Length", "0")
            self.end_headers()


if __name__ == "__main__":
    threading.Thread(target=consumidor, daemon=True).start()
    ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
```

`servicos/Dockerfile`:

```dockerfile
FROM python:3.12-alpine
WORKDIR /srv
# Redis client (the only external dependency)
RUN pip install --no-cache-dir redis
# Copies the two services; compose chooses which one to run
COPY pedidos.py notificador.py ./
CMD ["python", "-u", "pedidos.py"]
```

`gateway/nginx.conf`:

```nginx
# Limit zone: 5 requests per second per source IP (state in 10 MB of memory)
limit_req_zone $binary_remote_addr zone=por_ip:10m rate=5r/s;

server {
    listen 80;
    resolver 127.0.0.11 valid=5s;
    limit_req_status 429;                       # excess returns 429 (the default would be 503)

    location /pedidos/ {
        limit_req zone=por_ip burst=10 nodelay; # tolerates a burst of 10 above the rate
        set $alvo http://pedidos:8080;
        proxy_set_header X-Request-Id $request_id;  # unique id per request, created HERE at the edge
        proxy_pass $alvo;
    }
}
```

`compose.yaml`:

```yaml
services:
  redis:
    image: redis:7-alpine                  # the lab's queue and messaging

  pedidos:
    build: ./servicos
    init: true                             # fast stop (see Stage 01)
    command: ["python", "-u", "pedidos.py"]
    environment:
      MODO: ${MODO:-sync}                  # sync by default; switch with MODO=async
      REDIS_HOST: redis
    depends_on: [redis]

  notificador:
    build: ./servicos
    init: true                             # fast stop (see Stage 01)
    command: ["python", "-u", "notificador.py"]
    environment:
      REDIS_HOST: redis
    depends_on: [redis]

  gateway:
    image: nginx:1.27-alpine
    ports: ["8080:80"]                     # single entry point
    volumes:
      - ./gateway/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on: [pedidos]
```

Bring it up: `docker compose up -d --build`.

### Hands-on

*Fast lap with everything on the line! Six tests in the main lab: the client paying for the slow part, the failure propagating, the queue holding five sets, the consumer emptying the pile, the same `req=` crossing the logs, and the `429` at the edge. Then, the optional and reference blocks.*

**1. Synchronous: the client waits for the notification.**

```sh
curl -s -X POST -o /dev/null -w "%{http_code} em %{time_total}s\n" localhost:8080/pedidos/p1
```

Expected: `201 em 2.0xxxxxs`. The client paid the time of the slow part.

**Cockpit perspective:** the car sat 2 s longer in the pit box waiting for the measurement.

**2. Synchronous, with the notifier down: the failure propagates.**

```sh
docker compose stop notificador
curl -s -X POST -o /dev/null -w "%{http_code} em %{time_total}s\n" localhost:8080/pedidos/p2
```

Expected: `502 em 5.0xxxxxs`. With the notifier stopped, the name `notificador` disappears from the network's DNS, and `pedidos` only gives up after about 5 s (its log shows `FALHA ao notificar`). Nobody could buy because of a secondary service. It is temporal coupling.

**Cockpit perspective:** measuring equipment broken, no car leaves the pit box.

**3. Asynchronous: the order is accepted even with the notifier down.** Recreate only `pedidos` in asynchronous mode. The notifier remains stopped since item 2:

```sh
MODO=async docker compose up -d pedidos   # recreates only pedidos; the notifier does not come back
sleep 6                                   # the gateway keeps pedidos's old IP for up to 5 s (resolver valid=5s)
for i in 1 2 3 4 5; do
  curl -s -X POST -o /dev/null -w "%{http_code} em %{time_total}s\n" localhost:8080/pedidos/a$i
done
docker compose exec redis redis-cli LLEN fila:notificacoes
```

Expected: five lines `202 em 0.0xxxxxs`, and `5` as the queue length. The messages are stored, waiting for the consumer to come back.

Attention: from here to the end of the stage, every `docker compose up` needs the `MODO=async` prefix. Without it, compose uses the `sync` default and recreates `pedidos` in synchronous mode, without warning.

**Cockpit perspective:** the car leaves right away (`202`: accepted, the rest is left for later), and the five sets wait on the pile.

**4. Recovery: the consumer comes back and empties the queue.**

```sh
docker compose start notificador
sleep 12
docker compose logs notificador | grep "via fila"
docker compose exec redis redis-cli LLEN fila:notificacoes
```

Expected: five lines `NOTIFICADO via fila`, one about every 2 s (one consumer processes one at a time), and the queue length reaches `0`. The `"via fila"` filter leaves out the `NOTIFICADO via http` line of order `p1`, from item 1, which remains in the log. To empty it faster, scale the consumer: `MODO=async docker compose up -d --scale notificador=3` (each replica takes different messages; without `MODO=async`, `pedidos` would go back to synchronous mode and item 6 would show no `429`).

**Cockpit perspective:** the tire engineer comes back and measures one set at a time. With `--scale notificador=3`, there are three technicians taking different sets from the same pile. **Here the analogy stops:** the Redis list in this lab has no "under analysis" marking. If the technician takes a set and disappears before measuring, the set is lost (see the professor's notes).

**5. One identifier, several logs (minimal tracing).**

```sh
ID=$(docker compose logs --no-log-prefix pedidos | grep -o 'req=[0-9a-f]\{32\}' | tail -1)   # id of the last order
echo "$ID"
docker compose logs pedidos notificador | grep "$ID"
```

Expected: the `echo` shows `req=` followed by 32 hexadecimal characters, created by Nginx. The `grep` returns two lines with that **same** value: one from `pedidos` ("enfileirado") and one from `notificador` ("NOTIFICADO via fila"). Filtering by an id, instead of looking at the last lines, is necessary because `docker compose logs` does not interleave the services in chronological order. That value crossed the gateway, the orders service, the queue, and the consumer. It is the principle of distributed tracing, which OpenTelemetry formalizes.

**Cockpit perspective:** the `req=` is the barcode: the same value appears in the stop (`pedidos`) and in the measurement (`notificador`).

**6. Rate limit at the gateway.** Still in asynchronous mode, fire 30 requests in a row:

```sh
for i in $(seq 1 30); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:8080/pedidos/r$i
done | sort | uniq -c
```

Expected: something like `202` for about 11 to 15 requests (the rate of 5 per second plus the burst of 10) and `429` for the rest. The protection was applied at the edge, without changing any service. (The exact number depends on the speed of your machine.)

**Cockpit perspective:** it is the pit lane speed limiter. The rule is the same for everyone, applied at the entry, without looking at who the car is or what it will do in the pit box, and no station in the garage needs to change anything for it to apply. The `429` is the answer to whoever goes over the ceiling. **Here the analogy stops:** the limiter controls each car's speed, while the rate limit controls how many requests the same origin makes per second, with room for a short burst (`burst=10`). And whoever exceeds it gets no punishment afterwards: those requests are simply refused on the spot.

**7. Optional: the same queue, in two dialects (needs the `aws` and `az` CLIs).** Local emulators: ElasticMQ (SQS-compatible API) and Azurite (Azure Storage emulator).

```sh
docker run -d --name sqs -p 9324:9324 softwaremill/elasticmq-native
docker run -d --name azurite -p 10001:10001 mcr.microsoft.com/azure-storage/azurite azurite-queue --queueHost 0.0.0.0 --skipApiVersionCheck
```

The `--skipApiVersionCheck` avoids the `The API version ... is not supported by Azurite` error, common when the `az` CLI is newer than the emulator image.

AWS (SQS, against the emulator):

```sh
export AWS_ACCESS_KEY_ID=x AWS_SECRET_ACCESS_KEY=x AWS_DEFAULT_REGION=us-east-1   # fake credentials, only for the emulator
EP=http://localhost:9324
Q=$(aws --endpoint-url "$EP" sqs create-queue --queue-name pedidos --query QueueUrl --output text)
aws --endpoint-url "$EP" sqs send-message --queue-url "$Q" --message-body '{"pedido":"p1"}'
aws --endpoint-url "$EP" sqs receive-message --queue-url "$Q" --max-number-of-messages 1
aws --endpoint-url "$EP" sqs receive-message --queue-url "$Q" --max-number-of-messages 1   # right after
```

Expected: the first `receive-message` returns a JSON with `Messages`, `Body`, and `ReceiptHandle`. The second, right after, brings no message (comes out empty or with `"Messages": []`, depending on the CLI version): the message is **invisible** (visibility timeout) until you confirm with `aws --endpoint-url "$EP" sqs delete-message --queue-url "$Q" --receipt-handle "<ReceiptHandle>"` or until the time expires, when it reappears. It is the "at least once" guarantee.

Azure (Queue Storage, against Azurite, with the emulator's default development account):

```sh
AZ_CS="DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;"
az storage queue create --name pedidos --connection-string "$AZ_CS"
az storage message put --queue-name pedidos --content '{"pedido":"p1"}' --connection-string "$AZ_CS"
az storage message get --queue-name pedidos --connection-string "$AZ_CS"
```

Expected: the `get` returns a JSON with `id`, `popReceipt`, and `dequeueCount` (equal to 1). The message stays invisible until `az storage message delete --queue-name pedidos --id <id> --pop-receipt <popReceipt> --connection-string "$AZ_CS"`. The content format (text or encoded) may vary depending on the CLI version. The `dequeueCount` is the counter that, in Queue Storage, the application uses to decide when to give up on a message and move it to a queue of its own for discards. Compare with SQS and Service Bus, which have this built in.

**Cockpit perspective:** it is the same pile of tires at two circuits. The procedure (take, mark under analysis, confirm) is the same; what changes is the name of the receipt (`ReceiptHandle` at one, `popReceipt` at the other) and the fact that, at the second, the discard box is up to you.

**8. Cloud reference (do not run it to complete the guide; it creates resources and incurs charges).**

```sh
# AWS: SQS queue and an SNS topic with a queue subscription (fan-out)
aws sqs create-queue --queue-name pedidos
aws sqs send-message --queue-url <URL-da-fila> --message-body '{"pedido":"p1"}'
aws sqs receive-message --queue-url <URL-da-fila> --wait-time-seconds 10
aws sqs delete-message --queue-url <URL-da-fila> --receipt-handle <RECIBO>
aws sns create-topic --name pedido-criado
aws sns subscribe --topic-arn <ARN-do-topico> --protocol sqs --notification-endpoint <ARN-da-fila>

# Azure: Service Bus with a queue and a topic with a subscription (the topic requires the Standard tier)
az group create --name rg-lab --location brazilsouth
az servicebus namespace create --resource-group rg-lab --name <namespace-unico> \
  --location brazilsouth --sku Standard
az servicebus queue create --resource-group rg-lab --namespace-name <namespace-unico> --name pedidos
az servicebus topic create --resource-group rg-lab --namespace-name <namespace-unico> --name pedido-criado
az servicebus topic subscription create --resource-group rg-lab --namespace-name <namespace-unico> \
  --topic-name pedido-criado --name estoque

# Azure: simpler alternative, Queue Storage inside a storage account
az storage account create --name <conta-unica> --resource-group rg-lab --location brazilsouth --sku Standard_LRS
az storage queue create --name pedidos --account-name <conta-unica> --auth-mode login
```

Two warnings for whoever runs this. The SNS subscription only delivers to the queue if the queue has a policy (the `Policy` attribute, applied with `aws sqs set-queue-attributes`) that allows `sqs:SendMessage` to the `sns.amazonaws.com` service for that topic; without it, `subscribe` works and no message arrives. And `az storage queue create --auth-mode login` uses your Microsoft Entra ID identity, which needs the "Storage Queue Data Contributor" role on the storage account, even if you own the subscription; without the role, the command is refused for lack of authorization.

Cleanup: `aws sqs delete-queue --queue-url <URL-da-fila>`, `aws sns delete-topic --topic-arn <ARN-do-topico>`, and `az group delete --name rg-lab --yes`. Sending and receiving messages in Service Bus is usually done by SDK or through the portal, not through the `az` CLI; that is why there is no `send` command above.

**Local cleanup:**

```sh
docker compose down
docker rm -f sqs azurite 2>/dev/null
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_DEFAULT_REGION EP Q AZ_CS   # the fake credentials do not stay in effect in the session
```

### Exercises

*Flying lap! Five questions, from the confirmation email to the poisoned message. It is the last timed session of the GP.*

1. **Synchronous or asynchronous?** Classify and justify: (a) validating the card before confirming the purchase, (b) sending the confirmation email, (c) updating the stock after the order, (d) querying a product's price to display on screen. *Expected answer:* (a) synchronous, since the response decides the flow; (b) asynchronous, it is not a critical part and can wait; (c) asynchronous by event, accepting eventual consistency; (d) synchronous, it is a query that needs an immediate response (REST, or gRPC if it is an internal call that is critical for performance).
2. **Duplicate message.** Your orders consumer received message `p1` twice and charged the customer twice. What property was missing and how do you fix it? *Expected answer:* idempotency. Store the identifier of the message or order already processed (for example, in a table or a key in Redis) and ignore repeats, or use the broker's deduplication when available (SQS FIFO and Service Bus offer it), without giving up the check in the consumer.
3. **Poisoned message.** A message always makes the consumer fail and reappears forever. What to do in SQS, Service Bus, and Queue Storage? *Expected answer:* SQS: configure a dead-letter queue with a maximum receive count. Service Bus: use the queue's own dead-letter queue, with the maximum delivery count. Queue Storage: there is no native DLQ; read the `dequeueCount` and, past the limit, move the message to another queue and remove it from the original (with the Azure Functions queue trigger, this already happens, to the `-poison` queue).
4. **Is the gateway dangerous?** Cite two disadvantages of the API Gateway according to the material and one mitigation for each. *Expected answer:* single point of failure (mitigate with high availability: several replicas behind a balancer, or the provider's managed service); added latency (mitigate by keeping the gateway lean, with only cross-cutting responsibilities such as authentication and rate limiting, without business logic).
5. **Which cloud service?** Choose, on both providers, the most suitable option for (a) notifying several services that "order created" happened and (b) storing the work of generating invoices, which cannot be lost. *Expected answer:* (a) SNS or EventBridge on AWS, Event Grid or Service Bus topics on Azure; (b) SQS on AWS, Service Bus (peek-lock) or Queue Storage on Azure; with the idempotency and DLQ cautions discussed above.

### Remember this

> Call synchronously only what needs an answer now; everything else becomes a message, with an idempotent consumer, and the gateway and the request identifier take care of what crosses all the services.

*Sector 4 in green! Synchronous only for what decides the flow, a queue with an idempotent consumer for the rest, rate limit at the edge, and a barcode following each order. Four sectors complete. Now it is the final straight, heading for the checkered flag.*

---

## Self-assessment checklist

*Final straight, checkered flag in sight! This is the parc fermé inspection, where the cars are checked after the flag: tick honestly, because a steward does not accept a memorized answer.*

Tick only what you can do **without consulting the text**.

**Stage 01: Monolith, layers, and microservices**

- [ ] I explain why layers do not solve the single-deployment problem.
- [ ] I list the five characteristics of a monolith and give an example of each.
- [ ] I define microservices and cite their four main characteristics.
- [ ] I explain why each response needs the correct status code.
- [ ] I name at least five challenges of microservices and I know when NOT to migrate.
- [ ] I show, in the lab, the effect of a slow route and of a crash in the monolith and in the separate services.
- [ ] I point to the AWS and Azure service for VM, managed containers, Kubernetes, and functions.

**Stage 02: Microservices**

- [ ] I explain why cutting by technical layer is a mistake and why we cut by business capability.
- [ ] I describe low coupling, high cohesion, and hiding complexity.
- [ ] I explain bounded context and the steps of strategic DDD.
- [ ] I divide the test system into services and justify each boundary.
- [ ] I explain service discovery and say where AWS and Azure differ on this point.
- [ ] I differentiate OpenAPI and AsyncAPI and explain why versioned contracts matter.

**Stage 03: Database**

- [ ] I explain why each service has its own database and what that costs.
- [ ] I distinguish ACID and eventual consistency with an example.
- [ ] I explain CAP as a choice during a partition.
- [ ] I choose SQL or NoSQL with arguments and point to the equivalent service on AWS and Azure.
- [ ] I explain DynamoDB x Cosmos DB in billing and in consistency.
- [ ] I run and explain a saga with compensation, and why the compensation needs to be idempotent.
- [ ] I explain Event Sourcing, CQRS, 2PC, and the role of Flyway and Liquibase.

**Stage 04: Communication**

- [ ] I explain REST (including stateless) and gRPC (protobuf) and compare the two approaches.
- [ ] I show the temporal coupling of the synchronous call and how the queue solves it.
- [ ] I explain "at least once" delivery, idempotency, and DLQ in the three queue services (SQS, Service Bus, Queue Storage).
- [ ] I differentiate queue, publish and subscribe, and event stream (SQS, SNS, EventBridge, Kinesis or MSK, Event Grid, Event Hubs).
- [ ] I explain what an API Gateway does, its risks, and the equivalent on AWS and Azure.
- [ ] I follow a request identifier through the logs of several services.
- [ ] I state two real differences between an AWS service and its Azure counterpart without inventing numbers.

*CHECKERED FLAG! If the boxes are ticked, step onto the podium: you started in a garage where everyone does everything and crossed the line with specialist stations, boundaries by domain, a race engineer at the edge, each discipline owning its data, a saga that undoes in reverse order, and a pile of tires that holds the peak. And do not lift before the line: at Interlagos, in 2008, Felipe Massa crossed the finish as champion for a few seconds, until Lewis Hamilton passed Timo Glock in the final corners and took the title by one point. Left a box blank? No drama: pit, adjust, and get back on the track. Next, the behind-the-scenes notes from the driver and the professor.*

---

## Driver's notes: where the analogies break down

The F1 layer does not change commands, code, technical tables, expected outputs, or exercises; the technical corrections came from the professor's review. The points where the comparison does not fully hold:

1. **The "everyone does everything" garage is a model.** Real teams are already specialized by station. I used the hypothetical garage to show the monolith, not to describe F1.
2. **One crew for two cars.** The double stack is an unavoidable cost on the track; in software, separating capacity is an architecture choice and costs little.
3. **The stop is synchronous.** The stations are independent in people and tools, but the car only leaves when all four wheels are done. Microservices can be independent in time as well.
4. **Retirement has no way back.** A car that stops on the track is out of the race; a process that goes down comes back up with one command.
5. **The race engineer understands the content.** The gateway forwards by prefix, counts requests by origin, and returns codes, without understanding the domain. The rate limit does not prioritize by importance.
6. **Human x automatic convergence.** The provisional classification converges by the stewards' decision; eventual consistency converges by events, compensations, and rules.
7. **CAP is decided beforehand.** On the pit wall, a person chooses case by case between waiting for fresh data and deciding with what they have; in the database, the choice is by design or configuration.
8. **2PC on the network costs more than in the pit box.** The release light holds the car for seconds, in the same place; between services, holding resources while waiting for the last participant is expensive and fragile.
9. **Timing as a model.** I use the general idea of recorded passages and a derived classification, not the implementation of the official system, which I do not know in detail.
10. **gRPC and telemetry.** The parallel is with the format (binary, with a schema), not with the direction of the flow.
11. **The lab's pile does not mark "under analysis".** The Redis list loses the message if the consumer dies midway; SQS, Service Bus, and Queue Storage do not lose it.
12. **Providers and circuits.** The calendar chooses the circuit; in the cloud, you choose the provider and can use both. No provider was associated with a real team.

## F1 data sources (consulted on 2026-10-06)

Reused from this module's DevOps Culture guide; no new search was made for this guide.

- Drivers' standings after round 16 of 23: [RacingNews365](https://racingnews365.com/2026-f1-championship-standings-after-bahrain-grand-prix-in-malaysia) and [Motorsport Week](https://www.motorsportweek.com/2026/10/04/f1-2026-world-championship-standings-after-the-bahrain-gp-in-malaysia/).
- Result and report of the Bahrain GP in Sepang (October 4, 2026), constructors' classification: [Formula1.com](https://www.formula1.com/en/latest/article/verstappen-wins-rain-hit-bahrain-gp-in-malaysia-over-antonelli-as-russell-retires-late-on.6qfpIHPch8mIVj2YgfHdCp) and [RaceFans](https://www.racefans.net/2026/10/04/2026-bahrain-grand-prix-in-malaysia-race-result-and-championship-points/).
- 2026 Singapore GP (October 9 to 11, first sprint weekend at Marina Bay): [RacingNews365](https://racingnews365.com/f1/races/singapore-gp) and [F1 Wiki](https://f1.fandom.com/wiki/2026_Singapore_Grand_Prix).
- Historical fact, 2018 Bahrain GP (Ferrari unsafe release, injured mechanic, 50 thousand euro fine): [Formula1.com](https://www.formula1.com/en/latest/article/ferrari-handed-big-fine-for-raikkonen-unsafe-release.40Rd1aQwsgKSomC2UqqQwc) and [RACER](https://racer.com/2018/04/08/ferrari-mechanic-breaks-leg-in-pit-stop-mishap).

---

## Appendix: complete reference table

All the analogies used in the document, in the order in which they appear. The central ones are in the table at the start. AWS and Azure always enter the same way, as circuits; no provider is associated with a real team.

| Application architecture | Formula 1 |
|---|---|
| Application (the whole system) | The team's operation over the weekend: garage, crew, pit wall, and factory |
| A client's request | A work request that reaches the team: the driver asking over the radio or the car entering the pit box |
| Client | The driver, who knows a single voice of the team |
| Small change requiring deployment of everything | Changing one step of the work and having to rehearse and release the entire procedure again |
| Monolith | A garage where the same mechanics do all the tasks, with a single procedure, rehearsed and released as a block |
| Strong dependency and blast radius | The hydraulic system: a leak ends the whole car's race |
| Layered architecture | The communication chain: driver, race engineer, pit wall, data analysts; each level only talks to the one below |
| Presentation layer | The race engineer, who receives the request and returns the response |
| Business layer | The strategy pit wall, which decides |
| Data layer | The analysts, the only ones who touch the raw telemetry |
| Microservice | A specialist station (tires, strategy, power unit, the crew of each wheel), with its own role, people, equipment, and rehearsal |
| Communication via API | The internal radio and the agreed telemetry channels |
| Scaling a service | Reinforcing only the overloaded station |
| HTTP status code | The release light: green only when everything is secured |
| `200` with an error body | The unsafe release: green light with a loose wheel |
| Microservices challenges | The cost of coordinating dozens of stations: pit wall, radio standard, questions that cross several stations |
| Cloud provider (AWS or Azure) | The circuit: each has its own facilities, and the team's procedure is the same at both |
| VM x managed containers x functions | Building the whole structure in the garage x using more and more of what the circuit delivers ready |
| Instance with `CAPACIDADE` | A group of mechanics with N people free at the same time |
| Fast route (`pedidos`) and slow route (`relatorios`) | The tire change and the nose change |
| `404` for another service's route | The tire mechanic saying "nose is not my job" |
| Shared capacity | The double stack: the single crew makes the second car wait for the first |
| Process that dies (`Exited (1)`) | The retirement: the car stops and leaves the race |
| `docker compose up -d` after the crash | What F1 does not have: putting a retired car back in the race |
| Cut by technical layer | Organizing the team into "who touches the data", "who decides", and "who talks to the driver" |
| Cut by business capability | Organizing the team by discipline: aerodynamics, vehicle dynamics, power unit, tires, strategy |
| Low coupling and high cohesion | Tires change the method without strategy changing anything; everything about tires lives in the tire station |
| Hiding complexity | The driver asks how many laps the tire will last and gets a number, without seeing the model |
| Bounded context | The word "window": pit stop for the strategist, temperature for the tire engineer |
| Authentication with JWT and roles | The paddock credential, with the access level printed on it |
| ADM with cache | The team principal's summary dashboard, fed by the departments |
| Versioned contract (OpenAPI, AsyncAPI) | The telemetry channel list and the radio vocabulary, with a version |
| Service discovery | Calling the station by role on the internal radio; whoever is assigned answers |
| Cloud Map x built-in discovery | The station directory as a separate installation at one circuit, built into the garage at the other |
| API Gateway | The race engineer: single voice between the driver and the team, who forwards each request to the right station |
| `resolver` with a variable in Nginx | The engineer who checks who is at the station at the time of the request |
| `502` at the gateway | "No answer from that station right now", with the other stations working |
| `404` from the gateway itself | "That station does not exist in this team" |
| Shared database | Reading the channel straight from another department's database, which one day is renamed without warning |
| Database per service | Each discipline owns its data: whoever needs it asks for the number, and does not open the other's spreadsheet |
| Event between services | The "tire passed the limit" notice sent to strategy |
| Eventual consistency | The provisional classification, which converges to the official one after the stewards' decisions |
| Network partition (CAP) | The loss of the telemetry link between the car and the pit wall |
| SQL, rigid schema | The set-up spreadsheet with fixed columns |
| NoSQL, flexible schema | The telemetry record in which each session can bring different channels |
| Migration (Flyway, Liquibase, `ALTER TABLE`) | The recorded revision of the spreadsheet before the new data goes in |
| DynamoDB x Cosmos DB | The same kind of warehouse at two circuits, with different billing and consistency |
| Saga with compensation | The trip logistics booked in steps and undone in reverse order, with cancellations that stay in the history |
| Saga by orchestration | The logistics coordinator giving orders at each step |
| Saga by choreography | The race control "safety car" message: each department reacts to the event on its own, without an individual order |
| Two-Phase Commit | The release light: each wheel gun confirms, then the light turns green |
| Event Sourcing | The timing: recorded passages and a classification derived from them |
| CQRS | The timing screen as a read model, separate from whoever records the passages |
| `REFRESH MATERIALIZED VIEW` | The update of the timing screen |
| Compensation that does not delete | The canceled booking that remains in the system, with the status changed |
| Exclusive volume per container | The same file name on the computers of different departments |
| Synchronous call with a secondary dependency | The car stuck in the pit box waiting for the measurement of the removed tires |
| Synchronous communication | The question over the radio that needs an answer before the driver acts |
| Asynchronous communication (queue) | The removed tires that go to the pile and are measured later, with the car already on the track |
| REST, stateless | The radio with standardized vocabulary: each message complete and independent |
| gRPC with Protocol Buffers | The telemetry: binary, compact, with channels defined by schema |
| Duplicate message and idempotency | Logging the same set twice in the record must not duplicate the data |
| Gateway as a single point of failure | The radio that fails and leaves the driver with no station at all |
| Gateway high availability | Backup channels: the board at the pit wall and the messages on the steering wheel display |
| Hybrid architecture | The real stop: wheels secured right away, measurement and analysis later |
| Request identifier and tracing | The tire barcode, followed by every record |
| Queue (SQS, Queue Storage, Service Bus) | The pile of tires: each set measured by a single technician |
| Publish and subscribe (SNS, Event Grid, topics) | Race control messages, which reach all teams at the same time |
| Event stream (Kafka, Kinesis, Event Hubs) | The complete timing record, stored and reread from the beginning |
| Visibility timeout, peek-lock, and receipt | The technician who marks the set "under analysis"; if he does not finish, the set goes back to the pile |
| Dead-letter queue | The separate box for the set that cannot be measured |
| Slow `notificador` | The tire engineer measuring one set every 2 s |
| `202 Accepted` | The car leaves right away; the rest is left for later |
| Scaling the consumer | More technicians taking different sets from the same pile |
| Rate limit at the gateway (`429`) | The pit lane speed limiter: the same ceiling for everyone, applied at the entry |
| ElasticMQ x Azurite | The same pile of tires at two circuits, with different receipt names |

---

## Professor's notes

**Precisions and corrections to the raw material:**

1. **gRPC and HTTP (Stage 04).** The material presents gRPC as an "alternative to HTTP/text-based communication". In fact, gRPC uses **HTTP/2** as transport; the difference from REST is the format (binary with Protocol Buffers, versus JSON or XML text) and the schema-defined contract.
2. **CAP theorem (Stage 03).** The material says the system can offer "at most two of the three guarantees" and that SQL databases "tend to prioritize consistency and availability". The more precise reading: network partitions happen, so, **during a partition**, you choose between consistency and availability. Without a partition, you can have both. Classifying databases as "CP" or "AP" is a simplification: many allow adjusting the behavior by configuration (Cosmos DB, with its five levels, is an example).
3. **Two-Phase Commit (Stage 03).** The material presents 2PC as "safe" and illustrates it with a bank transfer. It is worth adding that, between microservices, it is usually avoided because it blocks resources, increases latency, and requires support from all participants; the saga is the more common alternative. 2PC remains valid inside a system that supports it natively.
4. **Event Sourcing and eventual consistency (Stage 03).** The material lists "eventual consistency" as a benefit of Event Sourcing. More exact: the ordered record of events **makes it possible** for consumers to converge to the same state by processing them, but eventual consistency is a property of the distributed system, not something the pattern delivers on its own.
5. **Unverifiable market data (Stage 03).** The claim that "more than 75% of large companies" are migrating, attributed to Gartner and InfoQ, comes with a link to a Gartner peer community ("one minute insights"), which does not allow confirming a study with that number. I kept the sentence as "according to the material" and did not use it in any technical decision. The cases (Mercado Livre, Amazon, Netflix, Spotify) are also claims from the material and were not verified.
6. **Kafka as a queue (Stage 04).** The material groups Kafka with RabbitMQ and SQS as "queues". Kafka is a distributed event log, with retention and rereading, and its cloud equivalent is a streaming service (Kinesis, Event Hubs), not a traditional queue.
7. **Figure source (Stage 01).** Figure 5 (streaming monolith architecture) cites as its source the same URL as Figure 4 (HTTP status codes), which is evidently a copy error. The figures do not come in the extracted text and did not influence the content.
8. **References unrelated to the content.** In Stage 03, the reference "What is blockchain technology?" (AWS) and, in Stage 04, the big data references (Gandomi and Haider; Laney) do not correspond to the topic of the lessons. They were omitted from the reference list below.
9. **Description of the layers (Stage 01).** The material only shows layered architecture in a figure; the description in presentation, business, and data is the classic organization and was added by the professor.

**Content added by the professor (marked in the tables):**

- The entire Azure column and a good part of the AWS column of the equivalence tables, except what the material already cites: Azure Cosmos DB, Microsoft's domain analysis documentation, Amazon SQS, Amazon DynamoDB, and Amazon API Gateway.
- The everyday analogies (restaurant with one kitchen, building with floors, food court, departments, each department's notebook, phone call x letter). The material brings no analogies; the term "ator condutor" and the hot or cold cache strategy come from it.
- The service discovery section, the hosting table (Stage 01), the differences in delivery semantics and DLQ among SQS, Service Bus, and Queue Storage, and the observability table.
- The labs on saga, rigid x flexible schema, Event Sourcing and CQRS in miniature, queue x HTTP, rate limit, and request identifier.

**Limits of the labs (where the local analogy ends):**

- The Stage 01 test application **models** capacity with a semaphore and a `sleep`. The numbers are predictable by construction and serve to see the logic, not to measure hardware.
- Nginx plays the role of gateway, but does not offer ready-made authentication, developer portal, payload transformation, or OAuth2 integration as Amazon API Gateway and Azure API Management do.
- The lab's main "queue" is a **Redis list** (`LPUSH` and `BRPOP`). It has no acknowledgment or visibility timeout: if the consumer dies after removing the message and before finishing, the message is lost. SQS, Service Bus, and Queue Storage keep the message until confirmation, and that is the guarantee the real pattern requires. The optional block with ElasticMQ and Azurite shows this behavior.
- The emulators (ElasticMQ, Azurite, DynamoDB Local) reproduce the API, not the scale, durability, or billing of the real services. The exact behavior may have small differences from the cloud.
- The databases per service use SQLite to avoid drivers; the isolation principle holds for PostgreSQL, MongoDB, and the others. The shell saga orchestrator keeps its progress in memory, unlike Step Functions and Durable Functions.
- The `aws` and `az` commands marked as cloud reference create real resources. Instance class names, SKUs, regions, and parameters change; confirm in the current documentation before running, and always use the indicated cleanup.

---

## Source material references

- FIELDING, R. T. *Architectural Styles and the Design of Network-based Software Architectures*. 2000.
- PRESSMAN, R. S. *Engenharia de Software: Uma Abordagem Profissional*. McGraw-Hill, 2011.
- SOMMERVILLE, I. *Engenharia de Software*. Pearson, 2011; *Software Engineering: International Version*. Pearson, 2016.
- SPLUNK. *REST API User Manual*. 2023.
- AWS. *Microsserviços*. 2019. Amazon DynamoDB. 2024.
- Microsoft Azure. *Azure Cosmos DB: Globally Distributed, Multi-Model Database*. 2024. Microsoft Learn, *Domain analysis for microservices* (Azure Architecture Center).
- BASS, L.; CLEMENTS, P.; KAZMAN, R. *Software Architecture in Practice*. Addison-Wesley, 2012.
- KRUCHTEN, P. *Architectural Blueprints: The 4+1 View Model of Software Architecture*. IEEE Software, 1995.
- SHAW, M.; GARLAN, D. *Software Architecture: Perspectives on an Emerging Discipline*. Prentice Hall, 1996.
- JSON Schema. 2023.
- Gartner, peer community, "Microservices architecture: have engineering organizations found success" (cited in the material, not verified; see note 5).

---

*And that wraps up the broadcast, straight from the pit wall of the Application Architecture Grand Prix: four sectors, no retirements, and a team where each station works on its own and talks over the radio without holding the car in the pit box. From the booth, that is all. The next stop on the calendar is Singapore, October 9 to 11, 2026; until then, remember: call over the radio only what needs an answer now, and send the rest to the pile. END OF BROADCAST.*
