# DevOps Culture: from the fight between factory and track to the conveyor that carries the upgrade to the car by itself

*Good afternoon, good evening, good morning, wherever you are! The DevOps Culture Grand Prix is on the air, and the grid is already formed. What is at stake in this race is not a tool: it is making the factory that designs the car and the team that operates it become a single team, one that ships fast without breaking things and that, when it does break, learns instead of looking for someone to blame.*

*The layout has four sectors, and I narrate each one. Sector 1, the starting straight: the fundamentals and the four DORA metrics, the stopwatch of this GP. Sector 2, the longest and most technical stretch of the circuit: IaC, idempotent configuration, CI/CD, blue-green and canary, containers, and telemetry with SLOs, each practice with its AWS circuit and its Azure circuit. Sector 3, the stretch that does not show up on the stopwatch: organizational culture and the blameless debrief. Sector 4, the victory lap: the end-to-end conveyor, with an installation lap, automatic return to the good specification, and well-guarded credentials.*

*And the backdrop could not be more timely: the race on Sunday, October 4, 2026, in Sepang, which the driver recounts just below. Belts fastened, visor down. Here we go!*

> Narrated guide, final version: built on the didactic version (`01-professor.md`) of the four course materials for the "DevOps Culture" module (DevOps and Cloud Architecture, Phase 1). Each lesson became a stage, in the same order. The original lessons are theoretical: they bring no code or commands. Here each stage gains a lab that runs on your machine, with no cloud account, and an equivalence table between AWS and Azure. All the technical content, the commands, the code, the tables, and the order of the exercises were preserved. What changes is the trackside layer: the driver's perspective, which reads each DevOps practice as a race weekend (from the factory to the car on the track and back to the factory), and the broadcast narration that guides you from stage to stage.

On Sunday, October 4, 2026, in Sepang, everything this module discusses could be seen in a single afternoon. The Bahrain GP, moved to Malaysia this season, started about 40 minutes late because of heavy rain. Ferrari bet on dry-weather tires for Lewis Hamilton and Charles Leclerc while almost the whole grid started on intermediates, and the two plummeted in the first laps before recovering. A safety car on lap 9 opened a window for those on intermediates to switch to dry-weather tires. Max Verstappen controlled the race and won; Kimi Antonelli was second and Hamilton, third. And George Russell's car stopped on the straight during the last safety car: zero points on a day when his teammate scored, and the gap between the two grew from 66 to 84 points. Decisions with data under pressure, factory and track speaking the same language, calculated risk, and failure that must become learning: that is racing, and that is DevOps.

> **Championship data verified on 2026-10-06.** The full standings and the sources are in "F1 data sources", at the end. Every scenario with these names that did not actually happen is marked as **hypothetical**.

**For those who do not follow F1: the minimum trackside knowledge to read this guide.** You do not need to know anything about racing; each term below is explained again when it appears.

- **Factory and track team.** Every team has a factory (where the car is designed, built, and tested) and a team that travels to the circuits and operates the car on the weekend. They are different worlds, with different bosses and priorities, under the same team principal.
- **Pit wall.** The bench at the side of the track where the engineers and strategists sit watching the car's data in real time.
- **Telemetry.** The data the car's sensors stream live to the pit wall and to the factory: temperatures, pressures, speeds, hundreds of channels.
- **Set-up.** The tuning of the car for a circuit: ride height, wings, suspension, tire pressures.
- **Upgrade (update package).** New parts (a wing, a floor) that the factory brings to improve the car over the season.
- **Teammate's car.** Each team races with two cars; the teammate's car is the natural reference for comparing a new part.
- **Free practice, qualifying, and race.** On the weekend, free practice sessions are for testing and adjusting; qualifying defines the starting grid; the race is the session that awards points.
- **Parc fermé.** A rule that, from qualifying on, practically freezes the car's set-up until the race; changes require authorization and, generally, a penalty.
- **Installation lap.** The first short lap after the car leaves the garage, done to check that all systems respond before the real work begins.
- **Safety car.** The car that enters the track after an incident and slows everyone down; it usually opens a cheap window to pit.
- **Debrief.** The meeting after each session in which the driver and engineers cross-check the driver's feeling against the telemetry.
- **Technical scrutineering.** The inspection by the FIA (the federation that regulates F1) that checks whether the car is within the regulations.

**What you will be able to do by the end of this guide:** explain why DevOps exists and what it changes beyond the tools; calculate the DORA metrics from a git history; write a minimal IaC in Terraform and compare it with the equivalent in CloudFormation (AWS) and Bicep (Azure); ensure idempotency with Ansible; build a CI pipeline that runs the same in your terminal and in GitHub Actions, and translate it to Azure Pipelines and AWS CodeBuild; demonstrate blue-green and canary with nginx; publish an image to a container registry (local, with the map to ECR and Azure Container Registry); calculate SLIs and trigger an SLO alert; run a blameless post-mortem; and build an end-to-end conveyor with a health check and automatic rollback, taking care of secrets from the start.

**Marking convention.** The original material only cites AWS (CloudFormation, Systems Manager, Prime Day) and agnostic tools. Everything involving **Azure** is a **professor's addition**, and comes marked with the label `[Professor's addition: Azure]` or in an identified column. The cloud commands (`aws` and `az`) appear as **reading reference**, for you to compare. The local labs require no account and generate no cost. If you ever run the cloud commands, do it in a study account and run the corresponding cleanup block. The **Cockpit perspective** blocks are narrated by the driver, in the first person: when "I" appears in them, it is the driver speaking. The paragraphs in italics are the broadcast narration.

**Prerequisites:**

- A terminal with `bash`, `git`, `awk`, `curl`, `sort`, `uniq`, `sed`, and `grep`. Linux, macOS (see the note below), or WSL will do.
- `python3` (3.8 or later) for Stage 02, with the `venv` module (on Debian and Ubuntu, install the `python3-venv` package). The `unittest` outputs shown in the guide are those of Python 3.11 or later; the difference for earlier versions is noted at the point where it appears.
- Docker with `docker compose` for the blue-green, canary, container registry, and Prometheus labs.
- Optional, each indicated in the lab that uses it: `terraform`; `ansible` and `cfn-lint`, installed with `pip` inside a Python virtual environment, as Stage 02.1 shows (Debian 12, Ubuntu 23.04, and newer systems refuse `pip install` outside of one with the `externally-managed-environment` error, a rule known as PEP 668); and `az` with Bicep (`az bicep install`).
- **Note for macOS:** the `sed -i` on macOS is BSD and requires a suffix (`sed -i ''`). Install GNU sed (`brew install gnu-sed`) and use `gsed`, or edit the file manually. Also, on macOS 12 or later port 5000 is taken by the AirPlay Receiver; that is why the registry lab (Stage 02.5) publishes the registry on port **5001** of your computer, on any system.

**Lab folder structure:**

```text
lab-devops/
  .venv/      # Python virtual environment (cfn-lint and Ansible), created in Stage 02.1
  etapa-01/   # git history and DORA metrics
  etapa-02/   # IaC, Ansible, CI, blue-green/canary, registry, SLO
    iac/  ansible/  ci/  deploy/  slo/
  etapa-03/   # post-mortem and value metrics
  etapa-04/   # end-to-end conveyor, rollback, and secrets
```

**One variable so you do not get lost between folders.** All the commands in the guide reach the folders above through the `LAB` variable, from any directory. Define it at the start and repeat the line whenever you open a new terminal:

```sh
export LAB="$HOME/lab-devops"
```

## DevOps to F1 reference: paste this on the steering wheel

The same analogy holds from the beginning to the end of the document. If deploy is installing an update on the car in Stage 01, deploy is still that in Stage 04. Only the central pieces are listed here; each analogy is explained again at the point where it appears. The complete table, with all the analogies used, is in the [Appendix: complete reference table](#appendix-complete-reference-table), at the end of the document.

One rule holds for the whole document: **AWS and Azure do not become F1 teams.** Both providers enter the analogy the same way, as two different circuits where the same team operates.

| DevOps | Formula 1 |
|---|---|
| Dev and Ops in silos | The factory that designs and the track team that operates, each blaming the other |
| DevOps culture | Factory, pit wall, and track as a single team, with the track telemetry returning to the factory every session |
| Production | The race: the session that awards points |
| Deploy | Installing an update on the car that goes to the track |
| DORA metrics | Upgrade cadence, time from drawing board to track, upgrades reverted, and time to return to the good specification |
| Cloud provider (AWS or Azure) | The circuit: each has its own facilities, and the team's procedure is the same at both |
| Infrastructure as Code (IaC) | The car's specification sheet, versioned: any crew assembles the identical car from it |
| Idempotent configuration management | The set-up target value: "pressure at 22 psi", never "add 2 psi" |
| Continuous Integration (CI) | The test bench and the simulator: a failed part does not board the truck |
| Canary and rollback | The upgrade fitted to one car only, compared with the teammate's car; and the return to the previous specification |
| Health check | The installation lap: checking the systems before the car goes to work |
| SLI, SLO, and alert | The number on the telemetry, the agreed operating window, and the alarm on the pit wall |
| Blameless post-mortem | The debrief that asks "why did the process allow it?", never "who got it wrong?" |

## Where the comparison stops

The analogy organizes the reasoning, but it does not replace the technical model. The main limits, which I repeat in the text when they appear:

- **Cadence.** An F1 team brings updates to the car at the pace of the calendar (a few per weekend at most), and parc fermé freezes the car between qualifying and the race. A mature software team makes dozens of deploys a day, at any hour.
- **Two cars.** The smallest possible canary in F1 is half the fleet. In software you choose 1%, 5%, or 10% of users.
- **A part is matter; an artifact is a copy.** A wing exists in one physical unit; to go back to the previous one, it has to be on the truck. A versioned image is copied without limit and comes back from the registry with one command.
- **The circuit is not chosen.** The calendar decides where the team races. In the cloud the choice of provider is yours, and you can use both at the same time.
- **The FIA punishes; the post-mortem does not.** F1 has safety investigations that look for systemic causes, but it also has stewards who apply fines and penalties. The blameless post-mortem is internal and has no disciplinary function.

Whenever there is a conflict between the track and the terminal, what is in the terminal prevails: definitions, commands, and expected outputs of the technical text.

---

## Stage 01: DevOps culture fundamentals

*THE LIGHTS ARE OUT! The start of the DevOps Culture Grand Prix, and the first corner is already an internal fight: the factory on one side, the track on the other, each with its own goal. Before any tool, understand why this fight exists and how to measure whether it is over. Stay with me.*

### The problem

Friday, 6 p.m. An online store is about to launch the new checkout with Pix. The development team delivers the finished code and goes home happy. The operations team receives a package it has never seen, installs it by hand, and at 9 p.m. the site goes down. Monday's conversation starts with "it worked on my machine" and ends with someone to blame.

This is the scenario the material describes: **development teams** are measured on creating and deploying features; **operations teams** are measured on stability, maintenance, and monitoring. One wants to change fast, the other wants nothing to break. In isolation, they generate delay, failure, and communication noise.

**Restaurant analogy.** The kitchen is measured on creating new dishes; the dining room is measured on serving without errors and without complaints. If the kitchen invents a dish without telling the dining room and the dining room only finds out when the customer asks what it is, the fault is nobody's and the dinner is everybody's. Now imagine the kitchen and the dining room deciding the menu together, and the waiter bringing back to the kitchen what the customer said about the dish, the same night. That is DevOps.

**Cockpit perspective:** in F1 this conflict has an address. The factory is measured on performance: it wants to bring a new part to every race. The track team is measured on reliability: it wants a car that finishes the race. If the factory dispatches a new floor that arrives at the circuit on Friday without anyone on the track knowing how it changes the set-up, the weekend turns into an argument about whose fault it is. The DevOps version of this is the track engineer sitting in the design meeting and the factory following the telemetry live during the session, in a remote operations room (the big teams keep one, with dozens of engineers at the headquarters during the GP). **Here the analogy stops:** in an F1 team, factory and track already answer to the same team principal and the same Sunday result. In many companies, Dev and Ops have different managers and goals, and that is exactly what DevOps culture needs to fix.

### The concept

**DevOps** is a cultural change that integrates Dev and Ops into a single, collaborative, continuous workflow. The material insists: it is not just a methodology or just a tool, it is a mindset of collaboration among **people, processes, and technologies**.

**Principles and practices:**

| Principle | What it means in practice |
|---|---|
| Single, integrated team | Dev and Ops act together from planning to well after delivery, and not just aligning goals from time to time |
| Automation | Tests, integration, and deployment stop being manual, which reduces human error |
| Communication | Breaks down silos; teams that rarely talked start talking every day |
| Continuous delivery | Releasing features and fixes frequently, keeping the software evolving |
| Continuous monitoring and feedback | What is observed in production returns to the team quickly |

**The life cycle** is a continuous flow, drawn as the infinity symbol, because the output of one phase feeds the input of the next:

1. **Planning:** goals, requirements, and expectations. It is collaborative from the start: Operations takes part from the beginning, so that decisions consider how the system will be deployed, monitored, and maintained.
2. **Development:** incremental coding, with continuous integration and automated tests so that failures show up early.
3. **Delivery:** features deployed to production by automated pipelines. Delivering stops being an event and becomes routine.
4. **Operation:** the software is in the users' hands. Real-time monitoring returns failures and opportunities to the start of the cycle.

**Benefits cited:** risk reduction (problems show up before reaching production), delivery quality, productivity, continuous learning, and organizational resilience.

**Cockpit perspective:** the infinity symbol is the calendar. Planning is the weekend plan, made by strategy and track engineering together, before the truck leaves. Development is the factory and the simulator. Delivery is the part fitted to the car. Operation is the sessions on the track, with the telemetry streaming to the pit wall and to the factory. The Sunday-night debrief feeds the planning of the next round; in 2026 there are 23 rounds, and the cycle turns 23 times (calendar verified on 2026-10-06).

**Origin.** In **2009**, John Allspaw and Paul Hammond, from Flickr, gave the talk **"10+ Deploys Per Day"**, showing multiple daily deployments without compromising stability. Inspired by it, **Patrick Debois** organized, still in 2009, the first **DevOpsDays**, the starting point for spreading the culture.

**Etsy case (according to the material).** Before: slow, manual, "terrifying" deploys, only **twice a week**, often causing instability. The pain was the fear of breaking production, which generated friction between Dev and Ops. After focusing on automation, monitoring, and psychological safety: **dozens of deploys a day**, safely and in a controlled way.

**Cockpit perspective:** the "terrifying" deploy is the new part nobody wants to fit to the car because there was no time to test it. The 2026 Singapore GP (October 9 to 11) makes this concrete: in the sprint format there is only one free practice before the car enters parc fermé, so whoever brought an upgrade to Marina Bay had a single session to validate it. A team that trusts its own validation process (simulator, bench, correlation with the track) fits the new part without fear; a team that does not trust it holds everything back for "a calmer round". It is the same fear as Etsy's before, only with wings and floors.

**Trends cited:** Platform Engineering (internal self-service platforms), DevSecOps (security at every stage, as a shared responsibility), and AIOps (AI to monitor, predict failures, and speed up incident resolution). You will see them again in stages 02 and 04.

**How do we know it is working? The DORA metrics.** The material (Stage 03) cites the **DORA (DevOps Research and Assessment)** framework as the industry standard for assessing maturity, and Stage 04 cites mean time to recovery, failure rate, and deploy frequency as metrics to track. Putting the two ends together, the four metrics we use in this guide are:

| Metric | Question it answers |
|---|---|
| Deploy frequency | How often do we deliver to production? |
| Change lead time | How long does a commit take to reach production? |
| Change failure rate | What fraction of deploys causes a problem? |
| Time to restore | How long do we take to return to normal after a failure? |

> **Professor's addition:** the first two measure speed and the last two, stability. The central point of DevOps culture is that a good team improves all four at the same time, instead of trading one for another.

**Cockpit perspective:** speed and stability are the pace and the reliability of a race car, and nobody wins a championship by choosing one of the two. In Sepang, George Russell's car stopped on the straight during the last safety car; no pace makes up for the zero on the table, and the gap to Kimi Antonelli, who finished second, grew from 66 to 84 points. On our map, the four metrics become:

- **Deploy frequency:** the cadence at which the team brings updates to the car.
- **Change lead time:** the time from drawing board to track, from the design of the part to its running on the car.
- **Change failure rate:** the fraction of upgrades that make the car worse and need to be removed.
- **Time to restore:** how long it takes for the car to return to the specification that worked.

**Here the analogy stops:** in F1 the cadence is limited by the calendar and the regulations; in software, it is limited only by your process.

**Cloud in this stage.** The fundamentals do not depend on a provider. AWS and Azure come in from Stage 02, where there is a managed tool for each practice.

**Cockpit perspective:** on our map, each cloud provider is a **circuit**: the local infrastructure where the team operates. AWS and Azure are two different circuits, each with its own facilities (garage, power, timing), and the team brings the same procedure to both. That is why neither of them becomes an F1 team in this guide: the team is you.

### Commented example: a git history that tells the team's story

Instead of memorizing the metrics, let us calculate them. We create a repository with dated commits that represent 5 days of work: changes (`feat`, `fix`), deployments (`deploy`), an incident, and a restoration. It is a **model**, with fixed dates so that the results are predictable.

```sh
export LAB="$HOME/lab-devops"            # lab root (repeat in every new terminal)
mkdir -p "$LAB/etapa-01" && cd "$LAB/etapa-01"
```

`gerar-historico.sh`:

```sh
#!/usr/bin/env bash
set -euo pipefail                      # stops at the first error

rm -rf repo && mkdir repo && cd repo   # recreates the repository from scratch
git init -q                            # starts the repository without noise
git config user.name "Aluno"           # identity only for this repository
git config user.email "aluno@example.com"

evento() {                             # $1 = ISO date (UTC), $2 = message
  # forces the commit date; the empty commit is enough, only the history matters
  GIT_AUTHOR_DATE="$1" GIT_COMMITTER_DATE="$1" git commit -q --allow-empty -m "$2"
}

evento "2025-03-03T09:00:00+00:00" "feat: carrinho de compras"
evento "2025-03-03T15:00:00+00:00" "deploy: v1"
evento "2025-03-04T10:00:00+00:00" "feat: cupom de desconto"
evento "2025-03-04T11:00:00+00:00" "feat: calculo de frete"
evento "2025-03-05T09:00:00+00:00" "deploy: v2"
evento "2025-03-05T14:00:00+00:00" "incidente: v2 quebrou o checkout"
evento "2025-03-05T16:00:00+00:00" "restore: rollback da v2"
evento "2025-03-06T09:00:00+00:00" "fix: corrige checkout"
evento "2025-03-06T12:00:00+00:00" "deploy: v3"
evento "2025-03-07T10:00:00+00:00" "feat: pagamento com pix"
evento "2025-03-07T16:00:00+00:00" "deploy: v4"
```

`dora.sh`:

```sh
#!/usr/bin/env bash
set -euo pipefail
cd repo

# %ct = commit instant in seconds (epoch); %s = message
git log --reverse --format='%ct|%s' | awk -F'|' '
{
  ts = $1; tipo = $2; sub(/:.*/, "", tipo)       # tipo = text before the ":"
  if (NR == 1) primeiro = ts                     # first event of the period
  ultimo = ts                                    # last event of the period

  if (tipo == "feat" || tipo == "fix") {         # change waiting for deploy
    n++; pend[n] = ts
  } else if (tipo == "deploy") {
    deploys++
    for (i = 1; i <= n; i++) { soma += ts - pend[i]; itens++ }  # lead time of each change
    n = 0                                        # the pending queue empties
  } else if (tipo == "incidente") {
    falhas++; t_inc = ts                         # records when the failure started
  } else if (tipo == "restore") {
    soma_r += ts - t_inc; restauros++            # time until restored
  }
}
END {
  dias = int(ultimo / 86400) - int(primeiro / 86400) + 1   # calendar days (UTC)
  printf "Frequência de deploy    : %.2f por dia (%d deploys em %d dias)\n", deploys / dias, deploys, dias
  printf "Lead time médio         : %.1f horas (%d mudanças)\n", soma / itens / 3600, itens
  printf "Taxa de falha de mudança: %.0f%% (%d de %d deploys)\n", 100 * falhas / deploys, falhas, deploys
  printf "Tempo médio de restauro : %.1f horas\n", soma_r / restauros / 3600
}'
```

Run:

```sh
bash gerar-historico.sh
bash dora.sh
```

Expected output:

```text
Frequência de deploy    : 0.80 por dia (4 deploys em 5 dias)
Lead time médio         : 12.0 horas (5 mudanças)
Taxa de falha de mudança: 25% (1 de 4 deploys)
Tempo médio de restauro : 2.0 horas
```

Check the math by hand: the lead times were 6h (carrinho, the cart), 23h (cupom, the coupon), 22h (frete, shipping), 3h (fix), and 6h (pix), adding up to 60h, or a 12h average. The incident at 2 p.m. was restored at 4 p.m.

**Cockpit perspective:** this history is the season's technical diary. Each `feat` or `fix` is a part designed at the factory; each `deploy` is the time when the pending parts are fitted to the car; the `incidente` is the car with a problem on the track; the `restore` is the return to the previous specification. The coupon's 23-hour lead time is a finished part waiting on the truck until the next fitting window.

### Hands-on

*Stopwatch in hand! The lab has already calculated the four metrics; now you change a single date and watch the lead time rise without anything getting safer. It is the first timed pit stop of the GP.*

1. Look at the raw history: `cd repo && git log --reverse --format='%ad  %s' --date=iso-strict && cd ..`. You should see the 11 lines, in the order of the events.
2. Edit `gerar-historico.sh` and change the date of `deploy: v1` from `2025-03-03T15:00:00+00:00` to `2025-03-04T09:00:00+00:00` (it is still before the coupon and shipping commits). Regenerate (`bash gerar-historico.sh`) and run `bash dora.sh`. **Observe:** the average lead time rises from 12.0 to 15.6 hours, because the cart waited 24h instead of 6h. The deploy frequency did not change. Moral: holding a ready change in a queue worsens the lead time without bringing safety.
3. Restore the original date of `deploy: v1` in `gerar-historico.sh` (`2025-03-03T15:00:00+00:00`) and run `bash gerar-historico.sh` again. Keep the script: the `repo` directory may be deleted in the Cleanup below, because Stage 03 regenerates it from `gerar-historico.sh`.

**Cockpit perspective:** holding the cart for 24 hours is leaving an already approved part sitting on the truck "for safety". It does not get safer by waiting; it just arrives later. **Here the analogy stops:** in F1, holding the part is sometimes mandatory (logistics between continents, parc fermé). In software, the queue is usually a choice of the process, and that is why it can be eliminated.

### Exercises

*Flying lap! Three questions, no looking at the text. This is where those who memorized the word DevOps are separated from those who know how to diagnose a culture problem.*

1. Classify each situation as a **culture** problem, a **tool** problem, or **both**: (a) Ops only finds out about the deploy when it receives the ticket; (b) the deploy is done by copying files over SFTP; (c) the team avoids deploying on Fridays out of fear, and nobody discusses why.
2. In the lab history, if `deploy: v3` had also caused an incident, what would the new change failure rate be?
3. Why does the material say the life cycle "feeds back" into planning?

<details>
<summary>Answer key</summary>

1. (a) culture: silo and communication. (b) tool: lack of automation, although it also reveals habit. (c) both: the fear is cultural, and the manual deploy process feeds that fear.
2. 2 failures in 4 deploys, or 50%.
3. Because what is learned in operation (failures, metrics, user feedback) becomes input for the next planning, closing the loop.

</details>

### Cleanup

```sh
cd "$LAB/etapa-01" && rm -rf repo
```

(Delete only `repo`. `gerar-historico.sh` and `dora.sh` stay, because Stage 03 regenerates the repository with them.)

### Remember this

DevOps is making Dev and Ops share a goal and a continuous flow, and progress is measured in speed and stability together.

*Sector 1 in green! You now know why factory and track fight and you have the stopwatch of the four metrics in hand. And remember that they go together: in Monaco, in 1988, Ayrton Senna was leading by a huge margin and crashed alone into the guardrail near the end, because pace without reliability does not become points. Now comes the longest sector of the circuit: Stage 02, with seven tool stretches.*

---

## Stage 02: Common practices and tools

*Second sector, and it is the longest of the circuit: seven stretches in a row, from the car's specification sheet to the alarm on the pit wall, always with an AWS circuit and an Azure circuit side by side. Steady pace, because whoever burns the tires here does not make it to the end in one piece.*

### The problem

Black Friday. The team needs a test environment identical to production to validate a price fix. Who builds it? An operator, in two days, following a spreadsheet. The environment comes out a little different (a library version, a network parameter), the test passes, and in production the price is still wrong. This is **environment drift**, and the material sums up the cure in five pillars: Infrastructure as Code (IaC), Continuous Integration (CI), Continuous Delivery (CD), containerization, and continuous monitoring.

**Cockpit perspective:** in F1 this nightmare has a well-known name: **correlation**. The wind tunnel and the simulator say the part gains time, and on the track the car does not respond the same, because the test environment is not the real environment. **Here the analogy stops:** in F1, correlation is never perfect, because a physical model is never identical to the track. With IaC, the test environment can be identical to production by construction, and drift becomes a process failure, not a limit of physics.

This stage walks through the pillars in the order a student meets them: first describing the environment (IaC and configuration management), then testing and delivering it (CI/CD and deployment strategies), then packaging it (containers and registries), and finally observing it (monitoring).

### 2.1 Infrastructure as Code (IaC)

#### The concept

In IaC, servers, networks, load balancers, and even user accounts stop being configured manually and are described in readable, versioned files. The environment becomes **reproducible, auditable, and immune to drift** among development, staging, and production. The files are treated like application code:

- they live in Git repositories;
- they go through review via pull request;
- they are validated by automated tests that check syntax and run change plans (the **dry-runs**) before any change takes effect.

Creating a test environment becomes one command, and destroying it afterwards too, leaving no idle resource spending the budget.

**Recipe analogy.** Cooking "from memory" produces a different dish every time. A written recipe, with measurements, lets any cook repeat the dish, and lets you see in the history who changed the salt.

**Cockpit perspective:** the team's recipe is the car's **specification sheet**: drawings, a parts list with revision numbers, and set-up values, all versioned. With it, the factory builds a new chassis identical to the one that crashed, and the crew reassembles the car the same way at any circuit, and the history shows who changed the wing revision and when. `terraform plan` is the list of changes that the track engineer checks before the mechanics touch the car; `apply` is the assembly; `destroy` is dismantling the garage on Sunday night without leaving anything behind.

**Tools cited in the material:** Terraform (multi-cloud, its own language HCL), native services (AWS CloudFormation, Azure Resource Manager, Google Deployment Manager), and Pulumi (conventional languages such as TypeScript, Python, or Go).

#### AWS x Azure equivalence

> **Professor's addition:** the material cites CloudFormation and Azure Resource Manager side by side, without going deeper. The table and the differences below are the professor's didactic explanation.

| Role | AWS `[Professor's addition, except where cited in the source material]` | Azure `[Professor's addition]` | Agnostic bridge |
|---|---|---|---|
| Native declarative language | CloudFormation (cited in the material; templates in YAML or JSON) | Azure Resource Manager (ARM, templates in JSON) and **Bicep** (a language that compiles to ARM) | Terraform (HCL) |
| Unit that groups the deployment | Stack | Deployment, inside a Resource Group | Terraform state |
| Preview before applying | Change set (`aws cloudformation deploy --no-execute-changeset`) | `what-if` (`az deployment group what-if`) | `terraform plan` |
| Drift detection | `aws cloudformation detect-stack-drift` | Rerunning the `what-if` compares the template with what exists | `terraform plan` |

**Where they really differ:**

- **Where the state lives.** CloudFormation keeps the stack state in the service itself. ARM/Bicep uses no state file: each deployment compares the template with the resources in the scope. Terraform keeps a **state file** that needs to be protected and shared across a team (for example, with remote backends such as S3 on AWS or Azure Storage on Azure).
- **Scope.** CloudFormation and ARM/Bicep only talk to their own provider. Terraform talks to both (and to others), with the same syntax, but with resources specific to each provider: the code changes, the `init, plan, apply` flow does not.
- **Bicep vs ARM.** Bicep is the more readable way to write; underneath, it becomes an ARM template. Learning Bicep is learning ARM with less noise.
- **Optional: Deployment Stacks.** Azure also has a concept close to the CloudFormation stack: *Deployment Stacks*, which group the resources of a deployment as a managed unit and can delete or lock against changes whatever leaves the template. They are not needed for this guide.

**Cockpit perspective:** remember that each provider is a circuit. CloudFormation and ARM/Bicep are each circuit's own form: complete, but valid only there. Terraform is the team's own sheet, which travels from circuit to circuit with the same format, but with fields specific to each place; hence "the code changes, the flow does not". **Here the analogy stops:** an F1 team does not choose the circuit, the calendar does; in the cloud you choose the provider, and the Terraform state file is your responsibility (it must be stored and shared), something the paper sheet does not have.

#### Commented example: the same "minimal resource" in three languages

Our resource is object storage with an environment tag. First Terraform, in a mode that runs **without a cloud**, using the `local` provider to write a file (the `plan`/`apply`/`destroy` flow is identical to that of a real provider).

```sh
mkdir -p "$LAB/etapa-02/iac" && cd "$LAB/etapa-02/iac"
```

`main.tf`:

```hcl
terraform {
  required_providers {
    local = {
      source = "hashicorp/local"   # provider that creates local files, ideal for learning
    }
  }
}

variable "ambiente" {              # input parameter, as in CloudFormation and Bicep
  type    = string
  default = "dev"
}

resource "local_file" "config" {   # type "local_file", internal name "config"
  filename = "${path.module}/saida/${var.ambiente}.conf"   # where the file will be created
  content  = "ambiente=${var.ambiente}\nreplicas=2\n"      # desired content (declared state)
}
```

Run (requires `terraform` installed):

```sh
terraform init            # downloads the provider
terraform plan            # the dry-run: shows what WOULD change
terraform apply -auto-approve
cat saida/dev.conf
terraform apply -auto-approve    # second time
```

Expected excerpts (the full texts have more lines):

```text
Plan: 1 to add, 0 to change, 0 to destroy.
...
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
ambiente=dev
replicas=2
...
No changes. Your infrastructure matches the configuration.
```

The second run does nothing: the environment is already in the desired state. This is **declarative** behavior: you describe the destination, not the steps.

Now the same resource in each cloud's native language. These files are for **comparison**, and the local validation below creates nothing in the cloud.

`cfn.yaml` (AWS CloudFormation):

```yaml
AWSTemplateFormatVersion: "2010-09-09"   # template format version (fixed value)
Parameters:
  Ambiente:                              # input parameter
    Type: String
    Default: dev
Resources:
  Bucket:                                # logical name of the resource within the stack
    Type: AWS::S3::Bucket                # resource type: S3 bucket
    Properties:
      Tags:                              # no BucketName: AWS generates a unique name
        - Key: ambiente
          Value: !Ref Ambiente           # uses the parameter value
```

`main.bicep` (Azure Bicep, `[Professor's addition: Azure]`):

```bicep
param ambiente string = 'dev'                         // input parameter
param localizacao string = resourceGroup().location   // region of the resource group where it is deployed

resource conta 'Microsoft.Storage/storageAccounts@2023-01-01' = {   // type and API version
  name: 'st${uniqueString(resourceGroup().id)}'       // unique, valid name (lowercase letters and numbers only)
  location: localizacao
  sku: { name: 'Standard_LRS' }                       // storage replication tier
  kind: 'StorageV2'                                   // account type
  tags: { ambiente: ambiente }                        // the same tag as the AWS example
}
```

Local validation, without credentials. `cfn-lint` is installed with `pip` inside a **virtual environment** (`venv`), because on Debian 12, Ubuntu 23.04, and newer systems a direct `pip install` on the system fails with `externally-managed-environment` (PEP 668). The same environment serves Ansible, in section 2.2. (Alternative without venv: `pipx install cfn-lint`.) The `az bicep` commands require the Azure CLI (`az`) to be installed.

```sh
python3 -m venv "$LAB/.venv"           # creates the virtual environment (once)
. "$LAB/.venv/bin/activate"            # activates the environment in this terminal
pip install cfn-lint
cfn-lint cfn.yaml && echo "cfn ok"     # expected output: cfn ok (cfn-lint prints nothing when everything is fine)

az bicep install                       # requires the Azure CLI; downloads the Bicep compiler (once)
az bicep build --file main.bicep       # generates main.json, the equivalent ARM template
ls main.json
```

`main.json` is the **ARM** generated from the Bicep: open it and compare its size with the `.bicep`. This shows, in practice, why Bicep exists.

Cloud commands (**reference, no need to run**):

```sh
# AWS: preview (change set), apply, and removal
aws cloudformation deploy --template-file cfn.yaml --stack-name loja-dev \
  --parameter-overrides Ambiente=dev --no-execute-changeset
aws cloudformation deploy --template-file cfn.yaml --stack-name loja-dev \
  --parameter-overrides Ambiente=dev
aws cloudformation delete-stack --stack-name loja-dev

# Azure: group, preview (what-if), apply, and removal
az group create --name rg-devops --location brazilsouth
az deployment group what-if --resource-group rg-devops --template-file main.bicep
az deployment group create --resource-group rg-devops --template-file main.bicep \
  --parameters ambiente=dev
az group delete --name rg-devops --yes
```

Note the difference in model: on Azure everything lives in a **Resource Group**, and deleting the group deletes its contents; on AWS you delete the **stack**.

**Cockpit perspective:** the two models work as different ways of vacating the circuit. With the Resource Group, you hand back the entire garage and everything inside leaves together. With the stack, you dismantle the kit that was assembled from a sheet. In both cases, the goal is the same: at the end of the weekend, nothing forgotten and generating cost.

#### Hands-on

*Pit lane open! You are going to delete a file by hand, like the mechanic who swaps a part without recording it on the sheet, and watch the `plan` flag the difference right away.*

1. Run `terraform plan` again (`No changes`), then `rm saida/dev.conf` and `terraform plan` once more. **Observe:** the plan now proposes to **create** the file again (`local_file.config will be created` and `Plan: 1 to add, 0 to change, 0 to destroy.`). You simulated a drift (someone deleted something by hand) and the IaC detects it. Close the drift with `terraform apply -auto-approve`, which recreates `saida/dev.conf`.
2. With `dev.conf` back, run `terraform apply -auto-approve -var ambiente=prod`. **Observe:** the plan shows `local_file.config must be replaced` and `Plan: 1 to add, 0 to change, 1 to destroy.`: `dev.conf` is deleted and `prod.conf` is created in its place (check with `ls saida`).
3. Clean up: `terraform destroy -auto-approve`. The `saida/` folder is left empty. "Destroying after validation is just as fast", as the material states.

**Cockpit perspective:** deleting `dev.conf` by hand is the mechanic who swaps a part without recording it on the sheet. At the next check, the difference between the sheet and the car shows up. That is the value of having the sheet as the source of truth: it is the real car that has to explain why it differs from it.

#### Remember this

IaC is the versioned recipe of the environment: if you cannot destroy it and recreate it with one command, you still have hidden manual configuration.

### 2.2 Configuration management and idempotency

#### The problem

Terraform creates the server. And what happens **inside** it (packages, files, services)? If each server is adjusted by hand, in six months none is the same as another. The material calls this **configuration drift**. Configuration management tools (**Ansible, Chef, Puppet**) describe the desired state of each machine and apply it **idempotently**: running once or ten times gives the same result.

**Thermostat analogy.** You do not say "heat for 10 minutes"; you say "keep it at 22 degrees". If it is already at 22, nothing happens.

**Cockpit perspective:** in the pit box this is tire pressure. The right instruction is "leave it at 22 psi", never "add 2 psi". If the tire is already at 22, the mechanic checks it and does not touch it; if it is at 20, corrects it. Running the instruction ten times always gives the same tire. **Here the analogy stops:** tire pressure changes with temperature and has a measurement tolerance; a configuration file does not fluctuate on its own, and the tool compares the exact state.

#### AWS x Azure equivalence

| Role | AWS `[Professor's addition, except where cited in the source material]` | Azure `[Professor's addition]` | Agnostic bridge |
|---|---|---|---|
| Apply and maintain configuration on machines | **AWS Systems Manager** (cited in the material) | **Azure Automation** and **Azure Arc** (to extend management to machines outside Azure, such as on-premises ones) | Ansible, Chef, Puppet |
| Store configuration parameters | Systems Manager Parameter Store | Azure App Configuration | Versioned files in Git |

**Where they really differ:** Systems Manager gathers many capabilities under one name (remote command execution, parameters, inventory, and patching), while on Azure these capabilities are spread across different services (Automation, Arc, App Configuration). **The equivalence is approximate, not one to one.** If you have machines in several places, Ansible serves as a common language.

**Cockpit perspective:** they are two circuits with the same toolbox distributed in different ways: in one, everything in a single cabinet; in the other, on separate benches. Ansible is the case the team carries from circuit to circuit and that works at both.

CLI reference for parameters (**no need to run**):

```sh
# AWS: writes and reads a parameter in Parameter Store
aws ssm put-parameter --name /loja/dev/porta --value 8080 --type String
aws ssm get-parameter --name /loja/dev/porta --query Parameter.Value --output text

# Azure: creates an App Configuration store and writes a key
az appconfig create --name appcfg-loja-exemplo --resource-group rg-devops --location brazilsouth
az appconfig kv set --name appcfg-loja-exemplo --key loja/dev/porta --value 8080 --yes
```

#### Commented example: an idempotent playbook

Requires `ansible`, installed in the same virtual environment as section 2.1. The playbook runs on the machine itself, without SSH, and lives in its own folder:

```sh
mkdir -p "$LAB/etapa-02/ansible" && cd "$LAB/etapa-02/ansible"
python3 -m venv "$LAB/.venv"           # only if you have not yet created the environment in section 2.1
. "$LAB/.venv/bin/activate"
pip install ansible
```

`playbook.yml`:

```yaml
- hosts: localhost                  # target: the local machine
  connection: local                 # does not use SSH
  gather_facts: false               # skips fact gathering, to keep the output short
  tasks:
    - name: Garante o arquivo de configuração da aplicação
      ansible.builtin.copy:         # module that ensures a file with certain content
        dest: "{{ playbook_dir }}/app.conf"   # where the file must exist
        content: "porta=8080\n"               # how it must be
```

```sh
ansible-playbook playbook.yml    # 1st time
ansible-playbook playbook.yml    # 2nd time
```

Expected summary (the `PLAY RECAP` line, at the end of each run):

```text
localhost                  : ok=1    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
localhost                  : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

At the top of each run two `[WARNING]` messages about an empty inventory appear (`No inventory was parsed...`). Here they are normal: there is no inventory, and the target is only the local machine.

`changed=1` the first time and `changed=0` the second: **idempotency**.

**Cockpit perspective:** `changed=0` is the mechanic who touches the gauge, reads 22 psi, and takes his hand away. Checked, did not touch.

#### Hands-on

*A short, quick lap: spoil the file on purpose and watch Ansible bring everything back to the target value, like the tire that returns to 22 psi.*

1. Edit `app.conf` by hand and change `8080` to `9999`. Run the playbook again. **Observe:** `changed=1` and the file goes back to `porta=8080`. Ansible fixed the drift.
2. Run `ansible-playbook playbook.yml --check --diff`. **Observe:** dry-run mode, which shows the difference without applying it (and, if the file is already correct, nothing to show).
3. Leave the virtual environment with `deactivate` (to return to it: `. "$LAB/.venv/bin/activate"`).

#### Remember this

Managing configuration is declaring the desired state and letting the tool converge to it, as many times as needed.

### 2.3 Continuous Integration (CI) and Continuous Delivery (CD)

#### The problem

Two people work on different branches for three weeks. When they merge, the code does not compile, the tests break, and nobody remembers which change caused what. The later the defect shows up, the more expensive it is to fix.

**Cockpit perspective:** it is the front wing and the floor designed by different groups, each in its own corner, for three weeks. Together on the car, the airflow that comes off one is not what the other expected. Discovering this on the bench costs a day; discovering it on the track costs a weekend.

#### The concept

**CI.** Each commit triggers automatic checks: the CI server compiles, generates artifacts, and runs unit tests. If something fails, the feedback arrives in minutes, while the mental context is still fresh.

**CD.** CI alone is not enough in complex scenarios. After the initial tests, the artifact goes through integration tests, load simulations, and automated security checks. All orchestrated by a **unified configuration file**, the **declarative pipeline**, usually in YAML. It defines everything from the trigger on each push to the main branch to the conditions that block a merge (test coverage dropped, lint failed).

> **Professor's note:** the material uses "Continuous Delivery (Continuous Delivery and Deployment)" almost as synonyms. Distinguishing helps: in **delivery** the artifact is always ready to go to production, and a person approves the last step; in **deployment** that step is also automatic.

**Cockpit perspective:** CI is the **test bench and the simulator**. Every new part goes through them before boarding: structural load, suspension rig, virtual laps. Failed, it does not go on the truck. The declarative pipeline is the written validation protocol, the same for every part. In the professor's distinction, **delivery** is the approved part, packed on the truck, with the chief engineer deciding whether it will be fitted; **deployment** would be the part fitted to the car automatically, with nobody approving. **Here the analogy stops:** in F1 there is no continuous deployment. A person always decides, and the regulations (scrutineering, parc fermé) control when the car can be touched. In software, the last step can be automatic with safety, as long as the tests and the metrics are good.

**Tools cited:** Jenkins (extensible through plugins), GitHub Actions and GitLab CI/CD (integrated with the repository), and Argo CD (on Kubernetes, treats Git as the single source of truth).

#### AWS x Azure equivalence

| Role | AWS `[Professor's addition]` | Azure `[Professor's addition]` | Agnostic bridge |
|---|---|---|---|
| Build and tests | **CodeBuild** (defined in `buildspec.yml`) | **Azure Pipelines**, part of Azure DevOps (defined in `azure-pipelines.yml`) | GitHub Actions, GitLab CI/CD, Jenkins |
| Orchestration of the stages up to production | **CodePipeline** | Azure Pipelines (same product, with `stages`) | GitHub Actions (jobs and environments) |
| Deployment to instances or services | **CodeDeploy** | Azure Pipelines deployment tasks | Argo CD, Spinnaker |

**Where they really differ:** on AWS, build, orchestration, and deployment are **separate services** that you connect. In Azure DevOps, Azure Pipelines concentrates build and release in **one** product, which also brings boards and repositories in the same package. Nothing prevents using GitHub as the code source in both cases.

Reference CLI (**no need to run**):

```sh
aws codebuild start-build --project-name loja-build           # AWS: triggers a build
aws codepipeline start-pipeline-execution --name loja-pipe    # AWS: triggers the pipeline

az extension add --name azure-devops                          # Azure: adds the extension (once)
az pipelines run --name loja-ci \
  --org https://dev.azure.com/<org> --project <projeto>       # Azure: triggers a pipeline (organization and project are required)
```

(`<org>` and `<projeto>` are placeholders. To avoid repeating them in every command, set them once with `az devops configure --defaults organization=https://dev.azure.com/<org> project=<projeto>`.)

#### Commented example: the same CI running locally, in GitHub Actions, in Azure Pipelines, and in CodeBuild

The key idea: **the pipeline calls a script**; the script also runs in your terminal. That way you test the CI before pushing.

```sh
mkdir -p "$LAB/etapa-02/ci" && cd "$LAB/etapa-02/ci"
```

`calc.py`:

```python
def soma(a, b):
    return a + b
```

`test_calc.py`:

```python
import unittest
from calc import soma


class TestCalc(unittest.TestCase):
    def test_soma(self):
        self.assertEqual(soma(2, 3), 5)


if __name__ == "__main__":
    unittest.main()
```

`ci.sh`:

```sh
#!/usr/bin/env bash
set -euo pipefail                                   # any error interrupts the pipeline

echo "[1/3] lint (sintaxe)"
python3 -m py_compile calc.py test_calc.py          # fails if there is a syntax error

echo "[2/3] testes"
python3 -m unittest -v                              # fails if any test fails

echo "[3/3] build (artefato)"
mkdir -p dist
tar -czf dist/app.tar.gz calc.py                    # the generated "artifact"
echo "artefato: $(ls dist)"
```

```sh
chmod +x ci.sh
./ci.sh
```

Expected output on Python 3.11 or later (the time in "Ran 1 test" varies; on Python 3.10 or earlier, the third line appears as `test_soma (test_calc.TestCalc) ... ok`, without the method name inside the parentheses, and that is not an error):

```text
[1/3] lint (sintaxe)
[2/3] testes
test_soma (test_calc.TestCalc.test_soma) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
[3/3] build (artefato)
artefato: app.tar.gz
```

Now the same script orchestrated by three services. Compare how each one expresses the same idea.

`.github/workflows/ci.yml` (GitHub Actions, agnostic; the path is relative to the **repository root**, see step 3 of Hands-on):

```yaml
name: ci                              # name shown in the Actions tab
on:                                   # triggers
  push:
    branches: [main]                  # on every push to main
  pull_request:                       # and on every pull request
jobs:
  build-test:                         # job name
    runs-on: ubuntu-latest            # machine that runs it
    steps:
      - uses: actions/checkout@v4     # downloads the repository code
      - uses: actions/setup-python@v5 # installs Python
        with:
          python-version: "3.12"      # Python version
      - run: ./ci.sh                  # runs exactly the same script as your terminal
```

`azure-pipelines.yml` (Azure Pipelines, `[Professor's addition: Azure]`):

```yaml
trigger:
  - main                              # triggers on every push to main
pool:
  vmImage: ubuntu-latest              # hosted machine that runs it
steps:
  - task: UsePythonVersion@0          # task that installs Python
    inputs:
      versionSpec: "3.12"             # Python version
  - script: ./ci.sh                   # the same script
    displayName: Rodar CI             # step name in the interface
```

`buildspec.yml` (AWS CodeBuild):

```yaml
version: 0.2                          # buildspec format version
phases:
  build:
    commands:
      - ./ci.sh                       # the same script
artifacts:
  files:
    - dist/app.tar.gz                 # what CodeBuild keeps as an artifact
```

See the pattern: three formats, **one** script. Whoever learns the logic (trigger, environment, steps, artifact) switches tools easily. The first two YAMLs concentrate the path in one file, as the material says; on AWS, `buildspec.yml` takes care of the build and CodePipeline orchestrates the rest.

**Cockpit perspective:** it is the pit stop procedure. The crew trains at the factory exactly the same sequence it executes at any circuit, because what changes from one place to another is the garage, not the choreography. `ci.sh` is that choreography; GitHub Actions, Azure Pipelines, and CodeBuild are the garages.

#### Hands-on

*Bench on! Now you fail a part on purpose and confirm that it does not even get close to the truck.*

1. Break the test: change `5` to `6` in `test_calc.py` and run `./ci.sh; echo "código de saída: $?"`. **Observe:** the test fails, step 3 **does not run** (`set -e`), and the exit code is nonzero. That is what the CI server interprets as a "red build".
2. Fix the test and run again to see the pipeline pass again.
3. Optional: create a GitHub repository whose **root** is the `ci/` folder itself (`cd "$LAB/etapa-02/ci" && git init`), with `ci.yml` at `.github/workflows/ci.yml` inside it. This matters for two reasons: GitHub only looks for workflows in `.github/workflows/` at the repository root, and `run: ./ci.sh` is executed from that root. If you publish the entire `lab-devops` folder, the workflow does not run. The execution bit of `ci.sh` also needs to go in the commit (on Windows, run `git update-index --chmod=+x ci.sh` before committing). Push and watch the job run in the Actions tab. It is not required to complete the lab.

**Cockpit perspective:** a red build is the part that failed on the bench. Step 3 does not run for the same reason a failed part is not packed: it makes no sense to generate an artifact of something that already failed the test.

#### Remember this

A good pipeline is a declarative file that calls scripts you can run on your own machine.

### 2.4 Deployment strategies: blue-green and canary

*Attention, the race is heating up! Blue-green and canary are the point where a deploy stops being a bet and gets a plan to go back. This is where the point-scorers are separated from the rest of the grid.*

#### The problem

The Friday-night deploy fails and the site goes down. The question is not only "how to avoid the error", but "how to make the error hurt as few people as possible and be undone quickly".

#### The concept

- **Blue-green:** two identical environments coexist, one with the current version and another with the new one. Traffic is redirected in a controlled way to validate the new one before shutting down the old one.
- **Canary release:** the new version goes to a small percentage of users; performance and experience indicators are observed before expanding. Regressions stay contained.

**Analogy.** Blue-green is having two stages set up and rotating the audience from one to the other. Canary is sending a miner with a canary ahead: if the canary falls ill, the whole crew does not go in.

**Cockpit perspective:** blue-green is having two complete specifications of the car ready, the current one and the new package's, and switching everything at once; if the new one does not run, you go back to the previous one, which stayed intact in the garage. That is the **rollback**. Canary is what teams do with a new part all the time: the package goes on one car first, the telemetry is compared with the teammate's car, and only then does it go on the second one. **Hypothetical** example: if Ferrari brought a new floor to Singapore, fitting it only to Lewis Hamilton's car and comparing it with Charles Leclerc's would be a 50% canary. **Here the analogy stops:** with two cars, the smallest canary in F1 is half the fleet, and the comparison still mixes the part with the difference between the drivers. In a software canary, the slice is small and users are distributed at random, which isolates the effect of the version.

Stage 04 adds **rolling updates** (replacing instances in batches, gradually).

#### AWS x Azure equivalence

| Strategy | AWS `[Professor's addition]` | Azure `[Professor's addition]` |
|---|---|---|
| Blue-green | CodeDeploy (blue/green deployment) | App Service **deployment slots**, with swap |
| Canary by traffic weight | Weights between target groups on the load balancer (ALB) | Routing a percentage of traffic between App Service slots |

**Where they really differ:** on Azure, the concept of a "slot" (a parallel environment of the same service, which can be swapped) is native to App Service and makes the blue-green swap very direct. On AWS, the same idea is assembled with more pieces (load balancer, target groups, CodeDeploy). For containers on Kubernetes, both clouds (EKS and AKS) use the same ecosystem tools, such as Argo CD.

#### Commented example: blue-green and canary with nginx (local)

Two containers (`azul` and `verde`) answer with the version name, and an nginx in front decides which one to send traffic to.

```sh
mkdir -p "$LAB/etapa-02/deploy/conf" && cd "$LAB/etapa-02/deploy"
docker network create devops-lab
docker run -d --name azul  --network devops-lab hashicorp/http-echo -text="v1 azul"
docker run -d --name verde --network devops-lab hashicorp/http-echo -text="v2 verde"
```

`conf/default.conf` (starts 100% on blue):

```nginx
server {
    listen 80;                              # port inside the container
    location / {
        proxy_pass http://azul:5678;        # current target: the blue environment (http-echo listens on 5678)
    }
}
```

```sh
docker run -d --name proxy --network devops-lab -p 8080:80 \
  -v "$PWD/conf:/etc/nginx/conf.d:ro" nginx:alpine
sleep 1                                     # gives nginx time to come up
curl -s localhost:8080
```

Expected output: `v1 azul`.

**Blue-green:** switch the target and reload nginx, without taking the container down.

```sh
sed -i 's/azul:5678/verde:5678/' conf/default.conf
docker exec proxy nginx -s reload && sleep 1    # the reload is asynchronous: wait for the new workers to take over
curl -s localhost:8080
```

Expected output: `v2 verde` (before it, the `reload` prints a `[notice] ... signal process started` line, which is normal). The `sleep 1` exists because the `reload` returns before it finishes: nginx swaps the workers in the background, and an immediate `curl` may still land on an old worker and answer `v1 azul`. To do the **rollback**, just undo the edit and reload (the blue environment stayed up the whole time, and that is the value of blue-green).

**Cockpit perspective:** the blue still standing is the old specification, with the parts still in the garage, ready to go back on the car. Going back does not require manufacturing anything. **Here the analogy stops:** current F1 has no complete spare car available on the weekend, so going back requires work from the mechanics. In blue-green, both environments stay whole and live at the same time, and going back is just redirecting traffic.

**Canary:** replace the file with an `upstream` with weights (9 for blue, 1 for green). The `zone` line is what makes the count exact: nginx runs several worker processes (the *workers*, usually one per CPU), and without a shared memory zone each one has its own weight counter, so 10 requests can come out 8/2 or 10/0.

```nginx
upstream app {
    zone app 64k;                           # shared memory: all workers use the same weight counter
    server azul:5678  weight=9;             # receives 9 out of every 10 requests
    server verde:5678 weight=1;             # receives 1 out of every 10 (the canary)
}
server {
    listen 80;
    location / {
        proxy_pass http://app;              # now the target is the weighted group
    }
}
```

```sh
docker exec proxy nginx -s reload && sleep 1
for i in $(seq 1 10); do curl -s localhost:8080; done | sort | uniq -c
```

Expected output:

```text
      9 v1 azul
      1 v2 verde
```

#### Hands-on

*Timed pit stop! Play with the weights, bring down the canary, and watch who decides whether it continues: the metric, not the eye.*

1. Change the weights to 7 and 3, reload (`docker exec proxy nginx -s reload && sleep 1`) and repeat the count. **Observe:** `7 v1 azul` and `3 v2 verde`; the proportion follows the weights. That is how the canary is "expanded" little by little.
2. Follow this order: (a) put the weights back to 9 and 1; (b) run `docker exec proxy nginx -s reload && sleep 1`; (c) only then stop the canary with `docker stop verde`; (d) run the count. The order matters: with the container stopped, the name `verde` ceases to exist on the network, and a `reload` done afterwards would fail with `host not found in upstream "verde:5678"`. **Observe:** `10 v1 azul`. When a server in the group does not respond, nginx passes the request to the next server and marks the one that failed as unavailable for 10 seconds (the default); that is why no request is lost, but the count may take up to about a minute, because the attempts on `verde` wait for the connection timeout. In production, what decides when to abort the canary is the **metric** (Stage 2.6), not the eye.

**Cockpit perspective:** this I know from inside the car. I can swear on the radio that the new part improved the rear, and the telemetry can show the opposite. What decides whether the upgrade stays is the data compared with the teammate's car, not my feeling.

#### Cleanup

```sh
docker rm -f proxy azul verde
docker network rm devops-lab
```

#### Remember this

Blue-green switches the whole environment at once with an immediate way back; canary exposes the new version to a few before exposing it to everyone.

### 2.5 Virtualization, containers, and registries

#### The problem

"It worked on my machine." The application depends on library versions and on the operating system, and each environment has its own.

#### The concept

- **Virtual machines:** carry a complete operating system on top of a **hypervisor**. They isolate well, but carry the weight of an entire OS per VM.
- **Containers:** package only the runtime and the essential dependencies, **sharing the host's kernel**. They consume less and start faster.
- **Immutable, versioned images** live in **registries**. The same artifact tested in staging is exactly what reaches production, and going back to a previous version is one command.
- **Kubernetes** orchestrates containers at scale: schedules replicas, balances traffic, and recovers failing instances, all through declarative configuration.
- **Container security (material):** AppArmor, SELinux, and Falco restrict what each container can do.
- **On-premises (material):** VMware vSphere, Proxmox, and Hyper-V; hybrid architectures mix VMs (rigid isolation) and containers (fast scale).

**Analogy.** A VM is renting an entire apartment, with kitchen and bathroom, for each person. A container is a room in a shared house: each has its own space, and everyone uses the same structure.

**Cockpit perspective:** in the paddock, the VM would be each team bringing its own generator and almost its own track. The container is the garage: each team has its isolated space, but all use the same power and the same track of the circuit, which play the role of the host kernel. The immutable image is the part with a frozen revision number: the part that passed the bench is exactly the one that goes on the car. The registry is the parts store cataloged by revision. **Here the analogy stops:** a physical part exists in one unit and wears out; an image is copied without limit and is identical in every copy.

#### AWS x Azure equivalence

| Role | AWS `[Professor's addition]` | Azure `[Professor's addition]` | Agnostic bridge |
|---|---|---|---|
| Image registry | **ECR** (Elastic Container Registry) | **ACR** (Azure Container Registry) | `registry:2` registry (local), Docker Hub |
| Managed Kubernetes | EKS | AKS | Kubernetes |

**Where they really differ:** ECR and ACR fulfill the same role (storing private images, access control, integration with the respective cloud). In ECR, the repository can be configured to **prevent tag overwriting** (`--image-tag-mutability IMMUTABLE`). In ACR, the equivalent feature is to **lock** an image against writing: `az acr repository update --name <registro> --image loja:1.0.0 --write-enabled false` prevents the `loja:1.0.0` tag from being overwritten or deleted (with `--repository loja` in place of `--image`, the lock applies to the whole repository). Docker authentication also changes form (see below).

**Cockpit perspective:** an immutable tag is the rule that a revision number is never reused for another part. If "wing revision C" could change design without changing number, nobody would know what is fitted to the car.

Reference CLI (**no need to run**):

```sh
# AWS: creates the repository, authenticates Docker, pushes the image
aws ecr create-repository --repository-name loja --image-tag-mutability IMMUTABLE
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
docker tag loja:1.0.0 123456789012.dkr.ecr.us-east-1.amazonaws.com/loja:1.0.0
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/loja:1.0.0

# Azure: creates the registry, authenticates Docker, pushes the image, and locks the tag
az acr create --resource-group rg-devops --name acrlojaexemplo --sku Basic
az acr login --name acrlojaexemplo
docker tag loja:1.0.0 acrlojaexemplo.azurecr.io/loja:1.0.0
docker push acrlojaexemplo.azurecr.io/loja:1.0.0
az acr repository update --name acrlojaexemplo --image loja:1.0.0 --write-enabled false
```

(The number `123456789012` and the name `acrlojaexemplo` are fictitious; the ACR name needs to be globally unique.)

#### Commented example: your own local registry

The pattern is identical to that of both providers: **tag with version, push, pull**. Only the address changes. The registry listens on port 5000 inside the container, and we publish it on **5001** of your computer (`-p 5001:5000`), because on macOS 12 or later 5000 is taken by the AirPlay Receiver.

```sh
docker run -d --name registro -p 5001:5000 registry:2        # a minimal local registry, on port 5001
docker pull alpine:3.20                                      # any image to serve as the "app"
docker tag alpine:3.20 localhost:5001/loja:1.0.0             # registry address + name + version
docker push localhost:5001/loja:1.0.0                        # publishes
curl -s localhost:5001/v2/_catalog
curl -s localhost:5001/v2/loja/tags/list
```

Expected output of the two `curl` commands:

```text
{"repositories":["loja"]}
{"name":"loja","tags":["1.0.0"]}
```

#### Hands-on

*Fast in the terminal: publish a second revision and fetch the first one back from the parts store.*

1. Publish a second version: `docker tag alpine:3.20 localhost:5001/loja:1.0.1 && docker push localhost:5001/loja:1.0.1`. Run `tags/list` again. **Observe:** the two tags coexist, and that is what allows going back to a previous version.
2. Delete the local image and download a specific version from the registry: `docker rmi localhost:5001/loja:1.0.0 && docker run --rm localhost:5001/loja:1.0.0 echo "rodei a 1.0.0"`. **Observe:** Docker downloads from the registry and runs it. The output ends with `rodei a 1.0.0`.

**Cockpit perspective:** the previous revision of the part is still in the parts store. Without it, there is no way back to the good specification.

#### Cleanup

```sh
docker rm -f registro
docker rmi localhost:5001/loja:1.0.0 localhost:5001/loja:1.0.1 2>/dev/null || true
```

#### Remember this

An immutable image with a version tag, stored in a registry, is what makes "the same artifact from test to production" a truth and not a wish.

### 2.6 Continuous feedback in production: metrics, logs, tracing, and SLOs

#### The problem

The site is slow and nobody knows since when. The customer complains to support before the team notices. Without observing, you only find out about the problem through the complaint.

#### The concept

Every request, every byte of memory, and every millisecond of latency tells a story. Three pillars:

- **Metrics:** CPU, memory, response time, success rate.
- **Logs:** events centralized in a searchable repository.
- **Distributed tracing:** follows a call across microservices, from the front end to the database, exposing invisible bottlenecks.

Collecting is not enough; you need to turn data into decisions. That is why **SLIs** (measured indicators) and **SLOs** (agreed objectives) are defined, along with alerts for when the limit is breached, like the examples in the material: **error above 1% of requests** or **average latency above 200 ms**.

**Car dashboard analogy.** The speedometer shows the number (SLI); the "limit 80" sign is the objective (SLO); the alert is the beep when you go past it.

**Cockpit perspective:** this analogy is literal for me. The **metrics** are the live telemetry, hundreds of channels. The **logs** are the radio and the event record: they explain why something happened. **Tracing** starts as the mini-sector times of a lap, which show in which part of the circuit time was lost; but, since it follows a call **across services**, the full picture is following a part through each station of the chain, from the factory to the car, noting how long it stayed at each one. The **SLI** is the measured number (the front brake temperature); the **SLO** is the operating window the team agreed (the brake must stay within that range); the **alert** is the engineer on the radio asking me to lift off before the braking zone to save the brake. The `for: 5m` in the Prometheus rule, further below, is the engineer who does not call me because of a spike on a single lap: he waits for the problem to repeat.

**Tools cited:** Prometheus and Grafana (dashboards), Elasticsearch and Kibana (logs), Jaeger (tracing), Datadog and New Relic (commercial, all-in-one).

#### AWS x Azure equivalence

| Role | AWS `[Professor's addition]` | Azure `[Professor's addition]` | Agnostic bridge |
|---|---|---|---|
| Metrics, logs, and alarms | **CloudWatch** (Metrics, Logs, Alarms) | **Azure Monitor** (Metrics, Log Analytics, Alerts) | Prometheus + Grafana, ELK |
| Distributed tracing and application telemetry | **X-Ray** | **Application Insights** (inside Azure Monitor) | Jaeger |
| Managed Prometheus and Grafana | Amazon Managed Service for Prometheus and Amazon Managed Grafana | Azure Monitor managed service for Prometheus and Azure Managed Grafana | Self-hosted Prometheus + Grafana |

**Where they really differ:** on both clouds, native monitoring is the fastest choice for the cloud's own resources. The Prometheus + Grafana bridge exists on both sides, which lets you keep **the same queries and dashboards** when migrating. The agents and the way of querying logs, however, differ (CloudWatch Logs Insights on one side, Log Analytics queries on the other), so you do not learn one and use the other without studying.

**Cockpit perspective:** each circuit has its own timing and its own monitors, but the team brings its telemetry software to all of them. Prometheus and Grafana are that software: the same charts and alarms, at either circuit.

Reference CLI (**no need to run**; `i-0abc...` and `<id-do-recurso>` are placeholders):

```sh
# AWS: high CPU alarm (the 70 is just an example)
aws cloudwatch put-metric-alarm --alarm-name cpu-alta \
  --namespace AWS/EC2 --metric-name CPUUtilization --statistic Average \
  --period 300 --evaluation-periods 1 --threshold 70 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=InstanceId,Value=i-0abc1234567890def

# Azure: equivalent metric alert
az monitor metrics alert create --name cpu-alta --resource-group rg-devops \
  --scopes <id-do-recurso> --condition "avg Percentage CPU > 70" \
  --window-size 5m --evaluation-frequency 1m
```

#### Commented example: calculating SLIs from a log and triggering an SLO alert

We generate a predictable access log (200 requests, with an error every 40 and latency that varies from 100 to 280 ms) and calculate the two SLIs from the material. The generator lives in a file, `gerar-log.sh`, so you can edit it and run it again in Hands-on.

```sh
mkdir -p "$LAB/etapa-02/slo" && cd "$LAB/etapa-02/slo"
```

`gerar-log.sh`:

```sh
#!/usr/bin/env bash
# generates acesso.log: one line per request, in the format "status latency_ms"
awk 'BEGIN{ for (i=1; i<=200; i++) {
  status = (i % 40 == 0) ? 500 : 200          # 5 errors in 200 requests
  lat = 100 + (i % 10) * 20                   # latency from 100 to 280 ms, in cycles
  print status, lat } }' > acesso.log
```

```sh
bash gerar-log.sh
head -3 acesso.log
```

Expected output of `head`:

```text
200 120
200 140
200 160
```

`slo.sh`:

```sh
#!/usr/bin/env bash
awk '
{ total++; lat += $2; if ($1 >= 500) erros++ }       # counts requests, sums latencies, counts errors
END {
  taxa = 100 * erros / total                         # SLI 1: error rate (%)
  media = lat / total                                # SLI 2: average latency (ms)
  printf "taxa de erro: %.1f%% | latência média: %.0f ms\n", taxa, media
  if (taxa > 1)    print "ALERTA: erro acima de 1% das requisições"
  if (media > 200) print "ALERTA: latência média acima de 200 ms"
}' acesso.log
```

```sh
bash slo.sh
```

Expected output:

```text
taxa de erro: 2.5% | latência média: 190 ms
ALERTA: erro acima de 1% das requisições
```

The average latency (190 ms) is within the limit, but the error rate (2.5%) was breached: a single indicator is enough to wake someone up.

**Cockpit perspective:** the brake within the window does not save the car if the oil pressure is dropping. A single channel outside the limit is enough for the pit wall to call the driver.

The same alert, in Prometheus language (agnostic, valid for both providers). Two pieces of the expression, before the YAML: `http_requests_total` is a **counter** that the application exposes, which only grows (one unit for each request served) and carries labels such as `status`; `rate(...[5m])` turns that counter into **requests per second**, averaged over the last 5 minutes. The rule divides the rate of 5xx responses (`status=~"5.."`) by the total rate, and `sum` adds up the series of all the application's instances. `alertas.yml`:

```yaml
groups:
  - name: slo-loja                       # rule group
    rules:
      - alert: TaxaDeErroAlta            # alert name
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.01
        # expr: ratio of 5xx errors over the total, in the last 5 minutes, above 1%
        for: 5m                          # only fires if it persists for 5 minutes (avoids noise)
        labels:
          severity: page                 # label used to route the notification
```

Validation, without starting anything:

```sh
docker run --rm -v "$PWD":/cfg --entrypoint promtool prom/prometheus check rules /cfg/alertas.yml
```

(On systems with SELinux, such as Fedora, add `:z` to the volume: `-v "$PWD":/cfg:z`.)

Expected output:

```text
Checking /cfg/alertas.yml
  SUCCESS: 1 rules found
```

#### Hands-on

*Eyes on the telemetry! Two adjustments to the log generator and two alarms on the pit wall: one that goes out and one that lights up.*

1. In `gerar-log.sh`, change `i % 40` to `i % 200` (1 error in 200, or 0.5%), regenerate the log with `bash gerar-log.sh` and run `bash slo.sh`. **Observe:** `taxa de erro: 0.5% | latência média: 190 ms` and no alert, because the SLI is back inside the SLO.
2. In the same file, change `(i % 10) * 20` to `(i % 10) * 40`, run `bash gerar-log.sh && bash slo.sh` and **observe** the latency alert fire: `latência média: 280 ms` and `ALERTA: latência média acima de 200 ms`.

#### Remember this

A metric without an agreed limit is just a number; the SLO turns data into a decision about when to act.

### 2.7 Closing the stage: what the market tells

**Netflix case (according to the material):** how to make thousands of changes a day, at global scale, without collapse? Automate everything: infrastructure as code, robust CI/CD pipelines (such as **Spinnaker**, which Netflix itself helped create), and standardized containers. The professional is valued less for knowing the tool and more for replicating a fraction of that efficiency.

**Trends:** **GitOps** (Git as the single source of truth, with Argo CD or Flux ensuring that production reflects the code) and **Policy as Code** (for example, with Open Policy Agent, so that the infrastructure is born already within the security and cost rules). Each cloud has its own native policy service (AWS Config and Azure Policy), but this stage does not go deeper into them.

**Cockpit perspective:** GitOps is the specification sheet running the car: if the car differs from the sheet, it is the car that gets corrected. Policy as Code is having the technical regulations checked already in the design of the part, instead of discovering at FIA scrutineering that it is outside the rules.

### Stage exercises

*Flying lap! Four questions that cover the whole sector, from `plan` to SLO. Clock running.*

1. What is the difference between a `terraform plan` and a `terraform apply`? And what is the equivalent of `plan` in CloudFormation and in Bicep?
2. Your playbook ran twice and the second time showed `changed=1`. What hypotheses do you raise?
3. To do a canary with 5% of the traffic using the lab's nginx, what weights would you use?
4. Which two SLIs does the material use as alert examples, and with what limits?

<details>
<summary>Answer key</summary>

1. `plan` only shows what would change (dry-run); `apply` executes the change. Equivalents: change set (`aws cloudformation deploy --no-execute-changeset`) in CloudFormation and `az deployment group what-if` in Bicep/ARM.
2. The task is not idempotent (for example, it uses a command module instead of one that checks the state), or something in the environment changes the resource between runs (a second source of truth touching the same file).
3. `weight=19` on the stable one and `weight=1` on the canary (1 in every 20, or 5%).
4. Error rate above 1% of requests and average latency above 200 ms.

</details>

### Remember this (whole stage)

IaC describes, CI validates, CD delivers, containers package, and monitoring returns to the team what production has learned.

*Sector 2 in green, and it was the longest stretch of the circuit! Versioned sheet, idempotent set-up, bench, spare specification, parts store, and telemetry. But no tool performs in a garage where making a mistake is scary. Now comes the stretch that does not show up on the stopwatch: culture, in Stage 03.*

---

## Stage 03: Organizational culture

*Third sector, and the asphalt changes. Here no memorized command saves you, because the opponent is the fear of making mistakes. This is the stage that separates the team that learns from the team that hides. Eyes on the debrief.*

### The problem

Friday again, but now the focus is on what happens **after** the failure. The night's deploy takes the site down. Dev says the infrastructure is unstable; Ops says the new code is bad; management wants someone to blame. The following week, nobody wants to touch anything important, and changes pile up in giant batches (which are, precisely, riskier). It is the "witch hunt" described in the material: fear, distrust, and risk aversion. The previous stage gave the tools; this one shows why they fail in an environment where making mistakes is dangerous.

**Cockpit perspective:** in the paddock, the witch hunt happens when the driver blames the car, the factory blames the driver, and both sides talk through the press. The consequence is the same too: afraid of making mistakes, the team stockpiles parts and brings everything at once. If the car gets worse with five new parts, nobody knows which one was to blame.

### The concept

#### DevOps as a change of mindset

DevOps culture flourishes when organizational culture is mature enough. It is not adopting tools or redrawing the org chart: it is **turning silos into bridges**. Dev, Ops, QA, and security share the responsibilities of design, deployment, and monitoring. Each person's delivery **is only complete when the service works stably in the real environment and generates value for the user**.

Three practices sustain this:

- **Constructive post-mortems:** no hunting for culprits; the failure is documented with transparency and the learning is converted into a process, checklist, or tool.
- **Safe experimentation:** small tests in controlled environments, backed by fast feedback.
- **Focus on customer value:** what counts is stability, how quickly new things go live, and the user experience, and not the number of merges.

**Cockpit perspective:** the constructive post-mortem is the **debrief**: driver and engineers cross-check the feeling with the telemetry and leave with actions, not culprits. Safe experimentation is free practice and the simulator, where mistakes cost little. Focus on value is the points on Sunday: nobody celebrates the number of new parts they brought, they celebrate the result.

#### What organizational culture is

It is the "corporate DNA": values, beliefs, norms, and rituals, many unwritten, that guide how people interact and how conflicts are resolved. Four factors shape it:

| Factor | How it shapes culture |
|---|---|
| History and founding | Startups tend toward innovation and tolerance of error; traditional corporations, toward hierarchy and process |
| Leadership | Teams mirror the behavior of managers |
| HR and management policies | Frequent feedback, career plans, and celebrations turn abstract value into habit |
| Symbols and ceremonies | Learning meetings, hackathons, the collective Friday coffee |

#### Culture types and their relationship with DevOps

| Type | Central trait | Receptiveness to DevOps (according to the material) |
|---|---|---|
| Clan | Belonging, mutual care, error as collective learning | Naturally receptive (values bonds, essential to integrate Dev and Ops) |
| Adhocracy | Innovation, small teams, calculated risk | Naturally receptive (already used to experimenting) |
| Market | Results and competition, urgency | Can benefit a lot, but faces barriers: shifting the focus from purely financial metrics to continuous customer value |
| Hierarchy | Standardized processes, chain of command, predictability | Can benefit a lot, but faces barriers: deconstructing rigid command |

Understanding the cultural profile is the first step in choosing the transformation strategy.

**Here the analogy stops:** I will not associate real F1 teams with these four culture types. It would be my opinion presented as fact, and a team's internal culture is not public enough for that.

#### Transformation challenges

Resistance to change; learning curve of the tools; balance between standardizing and allowing experimentation; security from the start (DevSecOps); unrealistic expectations (deploys in minutes in the first months, without investing in training); **adequate metrics**; and long-term vision from leadership.

On metrics, the material contrasts **real value** indicators (incident response time, frequency of successful releases, customer satisfaction) with **superficial** indicators (number of commits, hours of uptime).

#### How to start the journey (10 steps)

1. Map what exists: processes, bottlenecks, and goals.
2. Culture first: create spaces for dialogue among Dev, Ops, QA, and other areas.
3. Pilot project in a small team.
4. Automate what is manual and error-prone (CI on every commit, tests, gradually IaC).
5. Introduce tools gradually.
6. Collect feedback and refine.
7. Continuous education.
8. Monitor the metrics that matter.
9. Celebrate achievements and document learnings.
10. Scale the pilot when it is solid, at the pace of each team.

#### Google case (SRE) and DORA

Google institutionalized the **blameless post-mortem**: the question is never "who got it wrong?", but "why did the process allow the error to happen?". This creates **psychological safety**: engineers are not afraid to experiment, report errors, and collaborate. Finally, the material states that **DORA** research shows that "elite" teams (more speed and stability) have a **generative, high-trust** culture: culture is the main driver of technical performance.

**Cockpit perspective:** F1 has a historical example of a safety culture that asks "why did the system allow it?". At the 2020 Bahrain GP, Romain Grosjean's car hit the barrier, broke apart, and caught fire, and he managed to get out of the car on his own. The FIA investigation looked at the whole system (fuel tank, survival cell, barrier, rescue team response) and published more than 20 improvement recommendations, instead of looking for someone to blame. **Here the analogy stops:** the FIA also has stewards who punish teams and drivers. The blameless post-mortem is internal and has no such disciplinary role; mixing the two is the shortest path to the team hiding errors again.

**Cloud in this stage.** Culture has no equivalent managed tool, so **there is no AWS x Azure table** here, and forcing one would be misleading. The connection to the cloud is indirect: what gives safety to make mistakes are the practices from Stage 02 (IaC, rollback, observability), which exist on both providers.

### Commented example: from the culprit to the process

**Scenario (from the material, expanded):** on Friday, v2 was deployed at 09:00 and the checkout failed from 14:00 to 16:00 (2 hours).

An account **with blame** sounds like this:

> "João deployed v2 without testing properly and took down the checkout."

A **blameless** account documents facts and systemic causes. Create the stage folder and save this template as `postmortem.md` inside it:

```sh
mkdir -p "$LAB/etapa-03" && cd "$LAB/etapa-03"
```

`postmortem.md`:

```markdown
# Post-mortem: v2 quebrou o checkout

## Resumo
v2 implantada às 09:00. Checkout falhou a partir das 14:00. Restaurado às 16:00 (2 horas).

## Linha do tempo
- 09:00 deploy da v2
- 14:00 alerta de erro no checkout
- 16:00 rollback concluído

## Impacto
Parte dos usuários não conseguiu finalizar compra durante 2 horas.

## Causas (do processo, não de pessoas)
- O teste automatizado não cobria o fluxo de pagamento com cupom.
- O deploy foi feito para 100% dos usuários de uma vez.
- Não havia alerta de taxa de erro; o problema foi percebido pelo suporte.

## O que funcionou
- O rollback foi rápido porque a v1 estava disponível como imagem versionada.

## Ações (cada uma com dono e prazo)
- Adicionar teste de checkout com cupom ao CI. (dono: time de pagamentos)
- Adotar canary na próxima versão. (dono: plataforma)
- Criar alerta de erro acima de 1%. (dono: operações)
```

Note that the actions point to the practices from Stage 02 (CI, canary, SLO). The post-mortem is where culture becomes technical improvement.

**Cockpit perspective:** a case from the track shows the difference between the two questions. At the 2018 Bahrain GP, a Ferrari car was released from a pit stop with the left rear tire still to be changed, and the mechanic on that wheel had his leg fractured. The stewards fined the team 50 thousand euros for an unsafe release. The question with blame is "who let the car go?". The question without blame is "why did the release system allow the car to leave with a wheel still to be changed?", and only that second one leads to an action that prevents a repeat. I do not name anyone from the crew here, on purpose.

### Hands-on

*Two parts in this session: first the numbers from the history, then an honest mirror of your own team. No hurry on Part B; five minutes of honesty are worth more than a pretty lap.*

**Part A: what the metrics tell.** Generate the Stage 01 repository again (`cd "$LAB/etapa-01" && bash gerar-historico.sh`) and compare a superficial metric with the value ones:

```sh
cd repo
git log --oneline | wc -l                                        # superficial metric: number of commits
git log --format=%s | grep -c '^deploy'                          # deploys made
git log --format=%s | grep -c '^incidente'                       # incidents
cd ..
```

Expected output: `11`, `4`, and `1`. The "11 commits" does not say whether the team is doing well; "4 deploys in 5 days, 1 incident restored in 2 hours" says much more. It is the difference between a **superficial** indicator and a **value** indicator, as the material proposes.

**Cockpit perspective:** the number of commits is the number of laps done in practice. A team can complete a hundred laps and learn nothing; another completes thirty, with a clear program, and leaves with the race set-up. A lap done is not a useful lap.

**Part B: cultural diagnosis.** In 5 minutes, answer in writing about your current team or company (or one you know):

1. When something breaks, is the first question "who?" or "why?"
2. Which of the four types (Clan, Adhocracy, Market, Hierarchy) looks most like your organization, and why?
3. Which one of the 10 steps could you take on your own this week?

### Exercises

*Timed pit stop! Rewrite without blame, diagnose the hierarchy, and dismantle a superficial indicator. Three exercises, clock running.*

1. Rewrite without blame: "Ana forgot to run the tests and the bug went to production."
2. A company with a hierarchical culture wants to adopt DevOps. What barrier does the material predict and which step of the 10-step journey reduces the initial risk?
3. Why does "hours of uptime" appear as a superficial indicator in the material?

<details>
<summary>Answer key</summary>

1. Example: "The bug reached production because running the tests depended on a manual action. Action: make the tests a mandatory pipeline step, which blocks the merge if it fails."
2. The barrier is rigid command and the need to deconstruct it. Step 3 (pilot project in a small team, controlled environment) reduces the risk, because it validates the practices without risking critical initiatives.
3. Because availability alone does not say whether the team delivers value quickly or how it recovers from failures; the material prefers indicators such as incident response time and frequency of successful releases.

</details>

### Cleanup

```sh
cd "$LAB/etapa-01" && rm -rf repo
```

### Remember this

A tool only performs where making mistakes is safe: without blame, the team learns; with blame, the team hides.

*Sector 3 in green! The debrief stopped being a tribunal and became an action with an owner and a deadline. And failing does not decide the race: in Canada, in 2011, Jenson Button dropped to last, went through the pit lane six times, and won on the last lap. What is left is putting it all together in a single conveyor that blocks, delivers, and undoes by itself. Stage 04, the final straight.*

---

## Stage 04: Integration and automation

*Last sector! Everything you assembled piece by piece now becomes a single chain, from the factory to the car, with an installation lap and a return to the good specification without anyone asking. And with the paddock credential well guarded.*

### The problem

Black Friday again. The team makes monthly deploys because each one demands a marathon: provision a server, copy the artifact, adjust configuration, run tests, notify everyone. A security flaw is discovered on a Thursday and the fix only goes live the following month. Automation attacks this: it does not just speed up tasks, it ensures **consistent, predictable, and traceable** deliveries, leaving the team free to innovate. The material states that deploy frequency can jump from monthly cycles to daily, or even hourly.

**Cockpit perspective:** it is the team that can only bring a new part every four races, because each update demands a war operation between factory and track. Meanwhile, the security problem identified on a Thursday waits a month on the truck.

### The concept

DevOps automation is more than scripts: it is an integrated set of technologies and practices that orchestrate the software life cycle end to end, with minimal human intervention. Each code contribution triggers a sequence (compilation, tests, security analysis, provisioning), and the result is a consistent environment: what was tested in staging runs in production, which reduces the "it works on my machine".

**Assembly line analogy.** Each station performs a check and passes the item along; if a station rejects, the line stops before the defect reaches the customer.

**Cockpit perspective:** on the team, the conveyor is the chain that carries the upgrade from the factory to the car: design, manufacturing, bench, quality control, shipping, fitting, and installation lap. Each station can fail the part, and failing early is always cheaper than discovering the defect on the track.

#### The blocks of the conveyor (from the material)

| Block | Tools cited |
|---|---|
| Infrastructure provisioning | Terraform, Ansible (Pulumi also appears in the text) |
| Pipeline building | Jenkins, GitLab CI/CD, GitHub Actions |
| Continuous deployment | Argo CD, Helm, Spinnaker |
| Post-deploy monitoring | Prometheus, Grafana, ELK |

Plus security (**DevSecOps**, with scanners such as Snyk and Aqua Security), **ChatOps** (bots in Slack and Microsoft Teams that trigger rollbacks, generate health check reports, or redistribute traffic with commands in a channel), and **pipeline metrics** (build duration, failure rate, mean time to recovery).

**Cockpit perspective:** DevSecOps is checking security at every station of the chain, and not only at scrutineering at the end. ChatOps is the team radio: one short phrase in the right channel ("box, box") triggers a coordinated action by many people at the same time. Pipeline metrics are the stopwatch of the operation itself: how long the part takes at each station and how many are failed.

#### The end-to-end flow, with AWS and Azure side by side

The five steps from the material, plus the provider map. The AWS columns come from the material only where indicated.

| Step | What happens | AWS `[Professor's addition, except where cited in the source material]` | Azure `[Professor's addition]` | Agnostic bridge |
|---|---|---|---|---|
| 1. Provision | Environment described in files and created with one command | CloudFormation (cited in the material) | ARM/Bicep | Terraform, Pulumi |
| 2. Build and validate | Compilation and tests on every commit | CodeBuild, CodePipeline | Azure Pipelines | GitHub Actions, GitLab CI, Jenkins |
| 3. Deploy | Blue/green, canary, or rolling, with health check and rollback | CodeDeploy | Azure Pipelines and App Service slots | Argo CD, Spinnaker, Helm |
| 4. Configure and maintain | Packages, variables, and policies without drift | Systems Manager (cited in the material) | Azure Automation and Azure Arc | Ansible, Puppet, Chef |
| 5. Monitor and alert | Metrics, logs, and traces; alerts by SLO | CloudWatch, X-Ray | Azure Monitor, Application Insights | Prometheus, Grafana, ELK |
| Cross-cutting: images | Versioned registry | ECR | ACR | `registry:2`, Docker Hub |
| Cross-cutting: secrets | Credential vault | Secrets Manager | Key Vault | CI environment variables, Vault |
| Cross-cutting: security scanning | Analysis of images and dependencies | Amazon Inspector (for images in ECR, among others) | Microsoft Defender for Cloud | Snyk, Aqua (cited in the material) |

**Where they really differ** (beyond what has already been seen in the previous stages): on AWS, the conveyor is made of specialized services that you fit together; on Azure, Azure DevOps delivers a good part of it in the same product. Neither is "better": the choice depends on where your code, team, and workload already are. The agnostic tools in the right-hand column are precisely the bridge when the company uses both.

**Cockpit perspective:** again, two circuits. At one, the team fits together specialized equipment from several suppliers; at the other, it receives a good part of the garage already assembled in a single package. The agnostic column is the equipment the team carries from circuit to circuit, and that lets it race at both without relearning everything.

#### Secrets: where the conveyor leaks the most

> **Professor's addition:** the material cites integrated security (DevSecOps), but does not detail secrets management. Since every pipeline needs passwords and keys, this block goes in here.

**Problem.** Someone puts the database password in the repository "just to test". It stays in the history forever, and anyone with access to the code reads it. **Rule:** a secret never goes into Git; the pipeline fetches it from a vault at run time.

**Cockpit perspective:** on our map, a secret is the **paddock credential**. Committing the password is painting the credential's code on the side of the car: it has been photographed, and repainting does not erase the photos (the Git history). The vault (Secrets Manager or Key Vault) is the accreditation office, which issues the credential on the spot to whoever has permission, at the moment it is needed. And a credential that leaked is canceled and issued again, never "hidden". **Here the analogy stops:** a physical credential is in one place only; a leaked secret may have been copied by anyone, as many times as they like, and that is why the only safe response is to revoke it.

| Role | AWS `[Professor's addition]` | Azure `[Professor's addition]` |
|---|---|---|
| Secrets vault | **Secrets Manager** | **Key Vault** |
| Encryption keys and certificates | KMS (keys) and ACM (certificates), separate services | Also in Key Vault (which stores secrets, keys, and certificates) |

**Where they really differ:** Key Vault concentrates secrets, keys, and certificates in a single service, while on AWS each type usually has its own service. In both, access is controlled by permissions (on Azure, depending on the vault configuration, via RBAC or access policy: if the command denies access, check the permission).

Reference CLI (**no need to run**):

```sh
# AWS
aws secretsmanager create-secret --name loja/db --secret-string '{"user":"app","pass":"troque-isto"}'
aws secretsmanager get-secret-value --secret-id loja/db --query SecretString --output text

# Azure
az keyvault create --name kv-loja-exemplo --resource-group rg-devops --location brazilsouth
az keyvault secret set --vault-name kv-loja-exemplo --name db-pass --value 'troque-isto'
az keyvault secret show --vault-name kv-loja-exemplo --name db-pass --query value --output tsv
```

(`kv-loja-exemplo` is fictitious; the vault name needs to be globally unique.)

#### Automation cases (according to the material)

- **Netflix:** an almost autonomous deploy pipeline, with **hundreds of daily deploys** and automatic recovery that isolates and replaces failing instances.
- **Amazon:** automation that scales the infrastructure in the face of peaks such as Prime Day, based on IaC and on monitoring that triggers corrective actions before perceptible degradation.
- **Etsy:** full CI/CD, with **canary deployments** that detect subtle regressions before they reach the entire base.
- **Red Hat:** Ansible to manage and deploy OpenShift components, with clusters created by **playbooks** that define dependencies and policies.

**Market and trends:** AIOps and Platform Engineering. Amazon case, "you build it, you run it": developers do not open tickets to provision or deploy; they consume an automated internal platform. Demand for Automation Engineers, Platform Engineers, and SREs, with Python or Go, IaC with Terraform, and pipeline architecture.

### Commented example: a complete conveyor with automatic rollback (local)

We build the conveyor in four stages: **security** (secret scanning), **build and test** (the `ci.sh` from Stage 02), **deploy** with a health check, and **automatic rollback** if the health check fails. The "production environment" is a symbolic link `current` that points to the active release: swapping the link is the local analog of redirecting traffic.

**Cockpit perspective:** the `current` link says which specification is fitted to the car that is on the track. The health check is the **installation lap**: the car leaves the garage, the systems are checked, and, if something does not respond, it comes back before starting work. The automatic rollback is returning to the previous specification without a meeting. **Here the analogy stops:** in F1, after qualifying parc fermé prevents free changes, and there is no rollback in the middle of the race. In software, the conveyor can undo a bad version at any moment, in seconds.

```sh
mkdir -p "$LAB/etapa-04" && cd "$LAB/etapa-04"
cp "$LAB/etapa-02/ci/calc.py" "$LAB/etapa-02/ci/test_calc.py" "$LAB/etapa-02/ci/ci.sh" .
```

(If you skipped Stage 02, first create these three files with the content from section 2.3.)

`esteira.sh`:

```sh
#!/usr/bin/env bash
set -u                                               # an undefined variable is an error

escanear_segredos() {                                # stage 1: simplified DevSecOps
  # looks for AWS key patterns (AKIA + 16 characters) and a literal "password=" in the files
  if grep -rnE 'AKIA[0-9A-Z]{16}|password\s*=' --include='*.py' --include='*.sh' --include='*.yml' \
       --exclude=esteira.sh .; then
    echo "SEGURANÇA: possível segredo no código. Pipeline interrompido."
    return 1
  fi
  echo "segurança: nenhum segredo encontrado"
}

deploy() {                                           # $1 = version, $2 = state the app will report
  local nova="$1" anterior
  anterior=$(readlink current 2>/dev/null || echo "")    # saves the current release, for the rollback
  mkdir -p "releases/$nova"
  printf '%s\n' "$2" > "releases/$nova/status"       # the "application" reports its own state
  ln -sfn "releases/$nova" current                   # "redirects traffic" to the new release
  echo "deploy: current -> releases/$nova"
  if grep -q '^OK$' current/status; then             # health check: did the app answer OK?
    echo "health check: passou"
  else
    echo "health check: FALHOU"
    if [ -n "$anterior" ]; then
      ln -sfn "$anterior" current                    # automatic rollback to the previous release
      echo "rollback automático: current -> $anterior"
    fi
    return 1
  fi
}

escanear_segredos || exit 1                          # stage 1
./ci.sh > /dev/null 2>&1 && echo "ci: passou" || exit 1   # stage 2 (silences stdout and stderr)
deploy v1 OK                                         # stage 3: first healthy version
deploy v2 QUEBRADO                                   # version that fails the health check
echo "versão em produção: $(readlink current)"
echo "status: $(cat current/status)"
```

```sh
chmod +x ci.sh && rm -rf releases current dist
bash esteira.sh
```

Expected output:

```text
segurança: nenhum segredo encontrado
ci: passou
deploy: current -> releases/v1
health check: passou
deploy: current -> releases/v2
health check: FALHOU
rollback automático: current -> releases/v1
versão em produção: releases/v1
status: OK
```

The `2>&1` in stage 2 matters: `unittest` writes to **stderr**, and without it the lines `test_soma ... ok`, `Ran 1 test`, and `OK` would appear between the first and second lines of the output.

In real production, the same roles are fulfilled by services such as CodeDeploy (with configurable automatic rollback), by App Service slots (swapping the slot back), or, on Kubernetes, by tools such as Argo CD and Helm (`helm rollback`).

**Cockpit perspective:** note what this output tells. The v2 was fitted, failed the installation lap, and the car went back to v1 without anyone having to decide anything. Production never kept the broken version beyond the instant of the test. It is the weekend every team wanted to have.

### Hands-on

*Qualifying lap, everything on the line! Four tests on the conveyor: a planted secret, a failed part, a good version, and a credential read without touching Git.*

1. **Trigger the security stage.** Add two lines to the end of `calc.py`: `SENHA = "x"` and, right below, the comment `# password = 123`. Run `bash esteira.sh`. **Observe:** the scanner prints only `./calc.py:4:# password = 123`, the conveyor stops **before** the deploy, and the output ends with the security message. Note that `SENHA = "x"` was **not** detected, because it matches neither of the scanner's two patterns. That is the lesson of this step: a pattern-based scanner only finds what it knows, and that is why dedicated tools exist (such as gitleaks and Snyk), with hundreds of rules. Remove the two lines and the conveyor passes again.
2. **Break the CI.** Change the `5` in the test to `6` and run `bash esteira.sh; echo "código de saída: $?"`. **Observe:** the output stops at `segurança: nenhum segredo encontrado`; the line `ci: passou` does **not** appear, no `deploy:` is executed, and the exit code is `1`. The test failure does not appear because stage 2 silences the output of `ci.sh`; run `./ci.sh` directly to see it. Fix it and confirm that everything goes back to normal.
3. **Flip the deploy.** Change the call `deploy v2 QUEBRADO` to `deploy v2 OK` and run (`rm -rf releases current` beforehand). **Observe:** v2 passes the health check and `versão em produção: releases/v2`.
4. **Use a real secret, without putting it in Git.** Export a value in the terminal and read it in the script, instead of writing it in the file: `export DB_PASS='troque-isto'` and `python3 -c "import os; print('lido:', bool(os.environ['DB_PASS']))"` should print `lido: True`. It is the same principle as CI secrets and vaults (Secrets Manager, Key Vault), which inject the value at run time. Then, `unset DB_PASS`.

### Exercises

*Last lap of the GP! Four questions that stitch the whole flow together, from `terraform apply` to the leaked secret.*

1. In which of the five steps of the flow does each item belong: (a) `terraform apply`, (b) Prometheus, (c) `helm rollback`, (d) Ansible, (e) `docker push`?
2. Why does the lab's `deploy` save `anterior` **before** swapping the link?
3. Give the Azure equivalent of: CloudFormation, CodeBuild, Systems Manager, ECR, Secrets Manager, CloudWatch.
4. What is the risk of a secret that is committed and then "deleted" in the next commit?

<details>
<summary>Answer key</summary>

1. (a) step 1; (b) step 5; (c) step 3; (d) step 4 (configuration; the material also cites it in step 1, as provisioning); (e) `docker push` ends step 2 (artifact ready), feeding step 3.
2. Because after the swap the information about the previous release is lost; without it the automatic rollback would not know where to go back to.
3. ARM/Bicep; Azure Pipelines; Azure Automation and Azure Arc (approximate equivalence); ACR; Key Vault; Azure Monitor.
4. The secret remains in the Git history and can be recovered. The right thing is to consider it compromised, **revoke it and generate another**, besides removing it from the code.

</details>

### Cleanup

```sh
rm -rf releases current dist __pycache__
```

### Remember this

Good automation is a conveyor that blocks what is wrong, delivers what is right, and undoes by itself what slipped through.

*Sector 4 in green! Four sectors complete, conveyor built, and automatic rollback working. The F1 pit stop record (the stop to change all four tires) is 1.80 s, by McLaren with Lando Norris in Qatar in 2023, and it only exists because the choreography is rehearsed until it always comes out the same; your conveyor chases the same thing. Now it is the final straight, heading for the checkered flag.*

---

## Self-assessment checklist

*Final stretch, checkered flag in sight! This is the parc fermé inspection (see the glossary): tick honestly, because the stewards do not accept a memorized answer.*

Tick only what you can do **without consulting the guide**.

**Fundamentals (Stage 01)**

- [ ] I explain the conflict between Dev and Ops with a real example.
- [ ] I describe the four phases of the life cycle and why it is continuous.
- [ ] I tell the 2009 story (Flickr and DevOpsDays) and the Etsy case.
- [ ] I calculate deploy frequency, lead time, failure rate, and time to restore from a history.

**Practices and tools (Stage 02)**

- [ ] I explain what IaC is and know how to run `init`, `plan`, `apply`, and `destroy` in Terraform.
- [ ] I compare CloudFormation, ARM/Bicep, and Terraform, including where the state lives.
- [ ] I demonstrate idempotency with Ansible (`changed=1` and then `changed=0`).
- [ ] I write a CI pipeline that calls a local script and translate it to GitHub Actions, Azure Pipelines, and CodeBuild.
- [ ] I distinguish Continuous Delivery from Continuous Deployment.
- [ ] I do blue-green and canary with nginx and explain when to use each.
- [ ] I publish a versioned image to a registry and map the commands to ECR and ACR.
- [ ] I calculate SLIs, compare them with SLOs, and write an alert rule in Prometheus.
- [ ] I map CloudWatch and Azure Monitor, and say why Prometheus + Grafana serves as a bridge.

**Culture (Stage 03)**

- [ ] I rewrite an incident account with blame as a blameless post-mortem.
- [ ] I describe the four culture types and each one's receptiveness to DevOps.
- [ ] I cite the ten steps of the journey and choose the first one for a real team.
- [ ] I differentiate a superficial indicator from a value indicator, with examples.

**Integration and automation (Stage 04)**

- [ ] I describe the five steps of the end-to-end flow and the tool for each one in AWS, Azure, and agnostic.
- [ ] I explain why secrets do not go into Git and how Secrets Manager and Key Vault solve this.
- [ ] I build a local conveyor with scanning, CI, deploy, health check, and automatic rollback.
- [ ] I explain what DevSecOps, ChatOps, Platform Engineering, and AIOps are in one sentence each.

*CHECKERED FLAG! If the boxes are ticked, step onto the podium: you started with factory and track fighting and crossed the line with DORA metrics, a versioned sheet, a bench, canary, telemetry, a blameless debrief, and a conveyor that undoes itself when needed. Finishing is also technique: in Interlagos, in 1991, Ayrton Senna won for the first time at home with the gearbox stuck in sixth gear in the final laps. Left a box blank? No drama: pit, adjust, and back to the track. Next, the behind-the-scenes records of the driver and the professor.*

---

## Driver's notes: where the analogies break down

The F1 layer does not change commands, code, technical tables, expected outputs, or exercises; the technical corrections came from the professor's review. The points where the comparison does not fully hold:

1. **Factory and track already have the same boss.** In an F1 team, both ends answer to the same team principal and the same result. In many companies, Dev and Ops have different managers and goals, and that is what DevOps culture needs to change.
2. **Cadence.** F1 delivers updates at the pace of the calendar and the regulations; mature software makes dozens of deploys a day. Holding the part is sometimes mandatory on the track; in software, the queue is usually a choice of the process.
3. **Correlation and drift.** The correlation between wind tunnel and track is never perfect, because it is a physical limit of the model. Environment drift is a process failure, and IaC eliminates it by construction.
4. **Providers and circuits.** The calendar chooses the circuit; in the cloud, you choose the provider and can use both. The Terraform state file has no equivalent in the paper sheet.
5. **Idempotency.** Tire pressure varies with temperature and has a measurement tolerance; a configuration file is exact and does not change on its own.
6. **Continuous deployment.** It does not exist in F1: a person always approves the fitting, and the regulations control when the car can be touched.
7. **Canary.** With two cars, the smallest canary is 50% of the fleet, and the comparison mixes the part with the driver. In software, the slice is small and random.
8. **Part and image.** A physical part exists in one unit and wears out; an image is an identical, unlimited copy, and comes back from the registry with one command.
9. **Rollback during the race.** Parc fermé prevents free changes after qualifying, and there is no rollback in the middle of the race. The software conveyor undoes a version at any moment.
10. **Post-mortem and FIA.** The FIA investigates systemic causes, but also punishes through the stewards. The blameless post-mortem is internal and has no disciplinary role.
11. **Secret and credential.** The physical credential is in one place only; the leaked secret may have been copied without limit, and that is why it needs to be revoked and replaced.
12. **Culture types.** I did not associate real teams with the four culture types from the material, because it would be opinion presented as fact.

## F1 data sources (consulted on 2026-10-06)

The pitstop backend (`localhost:3333`) was down at the time of writing, so the data came from the public sources listed below. Drivers' standings after round 16 of 23 (Bahrain GP held in Sepang, Malaysia, on October 4, 2026): 1. Kimi Antonelli (Mercedes), 320 points; 2. George Russell (Mercedes), 236; 3. Lewis Hamilton (Ferrari), 214; 4. Charles Leclerc (Ferrari), 191; 5. Lando Norris (McLaren), 188; 6. Max Verstappen (Red Bull), 188; 7. Oscar Piastri (McLaren), 128; 8. Isack Hadjar (Red Bull), 96; 9. Liam Lawson (Racing Bulls), 65; 10. Pierre Gasly (Alpine), 41. Podium in Sepang: Verstappen, Antonelli, and Hamilton. Next round: Singapore GP, October 9 to 11, 2026, which this year receives the sprint format for the first time.

- Drivers' standings after round 16 of 23: [RacingNews365](https://racingnews365.com/2026-f1-championship-standings-after-bahrain-grand-prix-in-malaysia) and [Motorsport Week](https://www.motorsportweek.com/2026/10/04/f1-2026-world-championship-standings-after-the-bahrain-gp-in-malaysia/).
- Result and report of the Bahrain GP in Sepang (October 4, 2026), constructors' standings: [Formula1.com](https://www.formula1.com/en/latest/article/verstappen-wins-rain-hit-bahrain-gp-in-malaysia-over-antonelli-as-russell-retires-late-on.6qfpIHPch8mIVj2YgfHdCp) and [RaceFans](https://www.racefans.net/2026/10/04/2026-bahrain-grand-prix-in-malaysia-race-result-and-championship-points/).
- 2026 Singapore GP (October 9 to 11, first sprint weekend at Marina Bay): [RacingNews365](https://racingnews365.com/f1/races/singapore-gp) and [F1 Wiki](https://f1.fandom.com/wiki/2026_Singapore_Grand_Prix).
- Historical fact, 2018 Bahrain GP (Ferrari unsafe release, injured mechanic, 50 thousand euro fine): [Formula1.com](https://www.formula1.com/en/latest/article/ferrari-handed-big-fine-for-raikkonen-unsafe-release.40Rd1aQwsgKSomC2UqqQwc) and [RACER](https://racer.com/2018/04/08/ferrari-mechanic-breaks-leg-in-pit-stop-mishap).
- Historical fact, FIA investigation into Romain Grosjean's crash at the 2020 Bahrain GP: [RaceFans](https://www.racefans.net/2021/03/05/fia-details-22-areas-of-improvement-for-driver-safety-following-grosjean-crash-investigation/) and [ESPN](https://www.espn.com/f1/story/_/id/31011179/fia-releases-findings-grosjean-bahrain-gp-crash).

---

## Appendix: complete reference table

All the analogies used in the document, in the order in which they appear. The central ones are in the table at the beginning. AWS and Azure always enter the same way, as circuits; no provider is associated with a real team.

| DevOps | Formula 1 |
|---|---|
| Dev and Ops in silos | The factory that designs and the track team that operates, each blaming the other |
| DevOps culture | Factory, pit wall, and track as a single team, with the track telemetry returning to the factory every session |
| Continuous monitoring and feedback | The remote operations room at the factory following the telemetry live |
| Infinity life cycle | The calendar: weekend plan, factory, fitting, sessions, and debrief, 23 times a year |
| Planning | The weekend plan, made by strategy and track engineering together |
| Development | The factory and the simulator |
| Production | The race: the session that awards points |
| Deploy | Installing an update on the car that goes to the track |
| "Terrifying" deploy | Fitting a new part without having had time to test it |
| Speed and stability | Pace and reliability of the car |
| Deploy frequency | The cadence at which the team brings updates to the car |
| Change lead time | The time from drawing board to track |
| Change failure rate | The fraction of upgrades that make the car worse and need to be removed |
| Time to restore | The time for the car to return to the specification that worked |
| Cloud provider (AWS or Azure) | The circuit: each has its own facilities, and the team's procedure is the same at both |
| Git history | The season's technical diary |
| `feat` or `fix` commit | A part designed at the factory |
| Incident | The car with a problem on the track |
| Restore | The return to the previous specification |
| Ready change waiting for deploy | Approved part sitting on the truck until the next fitting window |
| Environment drift | The correlation problem: the test says one thing, the track says another |
| Infrastructure as Code (IaC) | The car's specification sheet, versioned: any crew assembles the identical car from it |
| `terraform plan`, change set, and `what-if` | The list of changes checked by the engineer before the mechanics touch the car |
| `terraform apply` | The assembly of the car according to the sheet |
| `terraform destroy` | Dismantling the garage on Sunday night without leaving anything behind |
| CloudFormation and ARM/Bicep | Each circuit's own form, valid only there |
| Terraform | The team's own sheet, which travels from circuit to circuit |
| Resource Group and stack | Handing back the entire garage or dismantling the kit assembled from a sheet |
| Drift detection | The check that finds the part swapped without a record on the sheet |
| Idempotent configuration management | The set-up target value: "pressure at 22 psi", never "add 2 psi" |
| `changed=0` | The mechanic checks the gauge, reads the right value, and does not touch it |
| Systems Manager and Azure Automation/Arc | The same toolbox in a single cabinet or on separate benches |
| Ansible | The toolcase the team carries to any circuit |
| Late branch integration | Wing and floor designed separately, which do not work together when fitted together |
| Continuous Integration (CI) | The test bench and the simulator: a failed part does not board the truck |
| Declarative pipeline | The written validation protocol, the same for every part |
| Continuous Delivery | The approved part on the truck, with the chief engineer deciding the fitting |
| Continuous Deployment | Automatic fitting without human approval (does not exist in F1) |
| `ci.sh` script called by several services | The pit stop choreography trained at the factory and executed the same in any garage |
| Red build | The part that failed on the bench, which is never even packed |
| Blue-green | Two complete specifications of the car ready, with a full switch from one to the other |
| Rollback | Going back to the previous specification, which stayed intact in the garage |
| Canary | The upgrade fitted to one car only and compared with the teammate's car |
| Aborting the canary by metric | The telemetry decides whether the part stays, not the driver's feeling |
| Virtual machine | A team that brings its own generator and almost its own track |
| Container | The isolated garage, sharing the circuit's power and track |
| Host kernel | The circuit's common infrastructure |
| Immutable, versioned image | The part with a frozen revision number |
| Container registry | The parts store cataloged by revision |
| Immutable tag | A revision number that is never reused for another part |
| Old tags in the registry | The previous revision kept in the parts store, which allows going back |
| Metrics | The live telemetry |
| Logs | The radio and the event record |
| Distributed tracing | The part followed through each station of the chain, from the factory to the car, with the time noted at each one (the mini-sectors of the lap, only across services) |
| SLI | The measured number, such as the brake temperature |
| SLO | The operating window agreed by the team |
| Alert | The engineer on the radio asking to save the brake |
| `for: 5m` in the alert | Not calling the driver because of a spike on a single lap |
| Prometheus and Grafana as a bridge | The team's telemetry software, taken to any circuit |
| GitOps | The sheet runs the car: if they diverge, the car is corrected |
| Policy as Code | The technical regulations checked already in the design of the part, not only at scrutineering |
| Witch hunt | Driver blaming the car and factory blaming the driver through the press |
| Giant batches of changes | Five new parts at once, without knowing which one made the car worse |
| Blameless post-mortem | The debrief that asks "why did the process allow it?", never "who got it wrong?" |
| Safe experimentation | Free practice and the simulator |
| Focus on customer value | The points on Sunday, not the number of new parts |
| Psychological safety and safety culture | The FIA's systemic investigation after Grosjean's crash |
| Superficial indicator | Laps done in practice; a lap done is not a useful lap |
| Monthly marathon deploys | A new part only every four races, in a war operation |
| Automation conveyor | The upgrade chain: design, manufacturing, bench, quality, shipping, fitting, and installation lap |
| DevSecOps | Checking security at every station, not only at final scrutineering |
| ChatOps | The team radio: one phrase ("box, box") triggers a coordinated action |
| Pipeline metrics | The stopwatch of the upgrade operation itself |
| Agnostic tools | The equipment the team carries from circuit to circuit |
| Secret | The paddock credential |
| Secret committed to Git | The credential's code painted on the side of the car: the photos remain |
| Vault (Secrets Manager or Key Vault) | The accreditation office, which issues the credential on the spot to whoever has permission |
| Revoking and generating a new secret | Canceling the leaked credential and issuing another |
| `current` link | The specification fitted to the car that is on the track |
| Health check | The installation lap: checking the systems before the car goes to work |
| Automatic rollback | Returning to the previous specification without a meeting |

---

## Professor's notes

Corrections and clarifications made relative to the raw material, plus the limitations assumed:

1. **CD is not just "delivery and deployment" mixed together.** The raw material treats Continuous Delivery and Deployment almost as synonyms. I clarified the difference in Stage 02 (manual approval of the last step versus fully automatic deployment).
2. **Spinnaker is a delivery (CD) platform, not a CI one.** The raw material (Stage 02) presents it as a "robust CI/CD pipeline"; it handles deployment and release strategies, and it appears in Stage 04 correctly under "Continuous deployment".
3. **Helm and Argo CD do not "coordinate" canary on their own.** The raw material (Stage 04) says that blue/green, canary, and rolling updates are "coordinated by Spinnaker, Argo CD, or Helm". Helm is a package manager for Kubernetes (it installs and rolls back releases), and Argo CD applies the Git state to the cluster; truly progressive strategies usually require dedicated tools (such as Spinnaker, or Argo Rollouts, from the Argo ecosystem). I kept the raw material's names in the blocks table and left this caveat.
4. **Ansible appears in two categories.** In the Stage 04 table, Ansible is under "Infrastructure provisioning" next to Terraform; in the Stage 02 text, it is under "configuration management" (software provisioning inside the machines). I treated it as configuration management (which is its main role), and noted that the raw material also cites it in the provisioning step.
5. **Google Deployment Manager.** The raw material lists it as a native IaC service. To my knowledge, Google announced the deprecation of that service in favor of another; **confirm the current status in Google's documentation** before choosing this tool. I did not go deeper because it is outside the AWS and Azure scope.
6. **"Scales in fractions of a second" (Amazon, Stage 04).** It is marketing language; do not treat it as a technical guarantee of provisioning latency. I added no numbers.
7. **The raw material does not define the DORA metrics.** It cites the framework and metrics such as deploy frequency, recovery time, and failure rate, but does not list them as the four standardized metrics. The list in Stage 01 is the professor's explanation, based on what the framework has established.
8. **Secrets, Azure, and containers as additions.** Secrets management (Secrets Manager and Key Vault), the registry map (ECR and ACR), the monitoring map (CloudWatch, Azure Monitor, and related), and all Azure content are **professor's additions**. The raw material cites only AWS CloudFormation, AWS Systems Manager, and Amazon's Prime Day. No market data, number, or price was added: the quantities (twice a week, dozens and hundreds of deploys, 1% and 200 ms) come from the raw material.
9. **Approximate equivalences.** Systems Manager x Azure Automation and Arc, and Secrets Manager x Key Vault (which also stores keys and certificates) are **not one to one**. I made this explicit in the tables.
10. **Cloud commands were not executed in the production of this guide.** The `aws` and `az` commands are reference and use fictitious names; before using them, check the parameters with `--help` in your CLI version. The local labs (git, Terraform with the `local` provider, Ansible, nginx, local registry, SLO and conveyor scripts) were designed for a deterministic result, and the outputs shown were checked by running the labs (Python 3.12, Terraform 1.16, Ansible core 2.21, and cfn-lint 1.57 in a virtual environment, Docker with nginx, a local registry, and `promtool`); only the `az bicep` commands, which require the Azure CLI, were not executed; long tool texts (Terraform, Ansible, Docker) appear in excerpts and may vary slightly depending on the version.

---

*And that wraps up the broadcast, straight from the pit wall of the DevOps Culture Grand Prix: four sectors, no retirements, and a team that speaks the same language from the factory to the track. From the booth, that is all. The next stop on the calendar is Singapore, October 9 to 11, 2026; until then, remember: a good debrief is what turns failure into a new part. END OF BROADCAST.*
