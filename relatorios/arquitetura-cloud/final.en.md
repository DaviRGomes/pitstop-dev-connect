# Cloud Architecture: from the garage rented at the circuit to the secure, redundant car that stays under the cost cap, on AWS and Azure

*Good afternoon, good evening, good morning, wherever you are! The Cloud Architecture Grand Prix is on the air, and the grid is already formed. What is at stake in this race: learning to operate on an infrastructure that is not yours, rented by the hour, without losing control of what remains yours (the data, the access, and the bill at the end of the month). And one track rule holds for the whole race: AWS and Azure are two circuits where the same team operates, and that team is you.*

*The layout has six sectors, and I narrate each one. Sector 1, the starting straight: what the cloud is and why it swaps CapEx for OpEx. Sector 2: the service models, from the empty garage to the pit stop triggered by the call from the pit wall. Sector 3, the most technical stretch of the circuit: regions, zones, the math of the nines, and the circuit breaker. Sector 4: the comparison between providers, with method and without cheering for a side. Sector 5, the heavy engineering: storage, databases, load balancers, and the network drawn on paper before it exists. Sector 6, the home straight: security, costs, and governance, with the cost cap watching every tag.*

*A word of orientation before the start. Throughout the guide you will find blocks called **Cockpit perspective**: in them the driver speaks, in the first person, reading each concept as the operation of a team on a race weekend. My voice, the commentator's, appears in italics at the entry and exit of each sector. And a warning so nobody thinks it is a typo: in 2026 the Bahrain round was moved to Sepang, in Malaysia (as verified on 2026-10-06), and that is why this guide says "Bahrain GP in Sepang". That was the race, on October 4, 2026, that the driver recounts just below. Belts fastened, visor down. Here we go!*

> Narrated guide, final version: built on the didactic version (`01-professor.md`) of the six course materials for "Cloud Architecture" (DevOps and Cloud Architecture, Phase 1). Each lesson became a stage, in the same order. The original lessons are conceptual and use the providers' consoles as a demonstration; here each stage gains practices that run without a cloud (local calculation) or with read commands on a free account. All the technical content, the commands, the code, the tables, and the order of the exercises were preserved. What changes is the trackside layer: the driver's perspective, which reads each architecture decision as the operation of a team on a race weekend (from the garage rented at the circuit to the operations room at the factory, on the other side of the world), and the broadcast narration that guides you from stage to stage.

On Sunday, October 4, 2026, in Sepang, the race gave a lesson in cloud architecture. The start was delayed by about 40 minutes because of heavy rain. Ferrari bet on slick tires on both cars, Lewis Hamilton's and Charles Leclerc's, while almost the whole grid started on intermediates; since the decision was the same for both, both dropped back in the first laps before recovering. A safety car on lap 9 opened, all at once, the window for those on intermediates to switch to slicks. Max Verstappen controlled the race and won; Kimi Antonelli was second and Hamilton third. And George Russell's car stopped on the straight during the last safety car: zero points for him, but Mercedes still left Sepang with the points of a second place, because it had another car on the track. An alternate venue, a correlated failure, an event that triggers load all at once, and redundancy that saves the result: that is what this module is about.

> **Championship data used in this guide (verified on 2026-10-06).** Data checked against public sources on 2026-10-06 (the pitstop backend was down) and reused from the DevOps Culture guide of this same phase. Podium in Sepang: Verstappen, Antonelli, and Hamilton. Next round: Singapore GP, October 9 to 11, 2026, which this year hosts the sprint format for the first time. The full championship standings and the sources are in "F1 data sources", at the end. Every scenario with these names that did not actually happen is marked as **hypothetical**.

**For those who do not follow F1: the minimum of the track needed to read this guide.** You do not need to know anything about racing; each term below is explained again when it appears.

- **Factory and track crew.** Every team has a factory (where the car is designed, built, and tested) and a crew that travels to the circuits and operates the car on the weekend.
- **Circuit.** The racetrack where the round takes place. It offers the common structure: pit building, power, network, timing, track marshals. Teams arrive, occupy the space, and operate there.
- **Garage (pit box).** Each team's space in the pit building, where the car is prepared. The 11 teams on the grid sit side by side, each in its own.
- **Pit lane.** The lane parallel to the main straight through which cars enter to stop in front of their own garage.
- **Pit wall.** The stand at the edge of the track where engineers and strategists watch the car's data in real time.
- **Remote operations room.** At the factory, engineers follow the session live and talk to the pit wall; the big teams keep one, with dozens of people during the GP.
- **Telemetry.** The data the car's sensors stream live to the pit wall and to the factory: temperatures, pressures, speeds, hundreds of channels.
- **Set-up.** The adjustment of the car for a circuit: height, wings, suspension, tire pressures.
- **Power unit (PU) and ERS.** The F1 hybrid engine: a combustion engine plus an electric part (the ERS), which recovers energy and stores it in a battery to give it back as power.
- **Two cars.** Each team races with two cars; the regulations do not allow more.
- **Pit stop.** The stop at the pit box to change tires, done by a crew of mechanics in a few seconds, when the pit wall calls the driver on the radio ("box, box").
- **Slick tires and intermediates.** Slicks are smooth; intermediates have grooves for a damp track.
- **Safety car.** The car that enters the track after an incident and slows everybody down; it usually opens a cheap window to stop in the pit.
- **Sprint format.** A weekend with one extra short race on Saturday and only one free practice session.
- **Wind tunnel.** A facility where aerodynamics is tested with scale models; the regulations limit how much each team may use it.
- **Cost cap.** The annual spending limit that the regulations have imposed on teams since 2021.
- **Component allotment.** The regulations limit how many parts of each type of power unit each car may use in the year; going over it costs starting further back on the grid.
- **Downforce.** The force the wings and the floor create to press the car onto the ground: it helps in corners and slows the car on the straights.
- **Sea freight.** Part of the non-urgent material travels by ship, ahead of time, to rounds outside Europe; what is urgent goes by plane.
- **Paddock credential.** The pass that defines where each person may enter: paddock, garage, pit lane.
- **Stewards and unsafe release.** The stewards are the race judges and apply penalties. An unsafe release is letting the car out of the pit stop in a dangerous way, and it is an infraction.
- **Retirement.** A car that does not finish the race.

**What you will be able to do by the end of this guide:** explain what cloud computing is and why it swaps CapEx for OpEx; distinguish public, private, and hybrid cloud; choose among IaaS, PaaS, SaaS, and FaaS using the responsibility matrix; explain regions, availability zones, points of presence, SLI/SLO/SLA, and the Circuit Breaker pattern; compare the main providers with a methodology (and not by cheering for a side); design a VPC (AWS) or VNet (Azure) with subnets and CIDR blocks calculated by you; choose storage, database, and load balancer by the problem each one solves; understand IAM, encryption, MFA, and layered network security; audit tags, calculate cost savings, and apply the Well-Architected pillars. In every stage, **AWS and Azure appear side by side**, with the equivalent of each service and an honest explanation of where they differ.

## How to read this guide: the two parallel fields

The original material talks almost only about AWS (and about Google Cloud in several examples). The pairing with Azure is a **didactic addition by the professor**. Conventions:

- Every **AWS x Azure** table is an addition by the professor, except where the caption says "from the material". The raw material mentions Azure in a few places (VMs, App Service, Functions, Cosmos DB, Azure SQL, Fabric, Arc, Entra ID, Defender for Cloud, Advisor, Monitor, Resource Graph, Network Watcher, NSGs, Availability Zones and ZRS, the Well-Architected framework). The rest of the pairing is mine.
- The "What really changes" column is where the value lives. Two "equivalent" services are rarely identical: the scope changes (regional or global), the state (stateful or stateless), the billing model, the names of the surrounding pieces.
- **Market numbers** only appear when they are in the material, marked as "(material, ref. jun/2025)". They are projections and snapshots of a date; in 2026, several have expired or changed. Do not cite them as current fact.
- **Prices and discounts** in this guide are **fictitious**, measured in "UM" (an invented monetary unit) and always flagged. Real prices: each provider's official calculator.
- **Decimal separator.** In the text, decimals use a period and thousands use a comma, as in English (99.9%, 43,200). In script outputs the period also appears (`99.9%`), because `awk` and `python3` print that way; it is the same number.
- **Service names change.** The material was consulted in June 2025. Where I know there is a rename or a transition under way, I say so. When in doubt, the official documentation rules.

**Prerequisites:**

- A terminal with `bash`, `awk`, and `python3` (for the local calculations). Linux, macOS, or WSL will do.
- Optional, for the read commands: **AWS CLI v2** (`aws`) and **Azure CLI** (`az`), each with a free account. The rules for free tiers, credits, and deadlines change often: check each provider's official page before creating the account.
- Optional: `openssl` 1.1.1 or later (already included in most Linux distributions). On macOS, the system `openssl` is usually LibreSSL, and old versions of it do not accept the `-pbkdf2` option used in Stage 06; if it is rejected, install OpenSSL through Homebrew (`brew install openssl`) and use the binary it installs. Check the version with `openssl version`.
- Nothing here requires you to create machines, databases, or networks in the cloud.

> **Watch the cost.** **Read** commands (`describe-*`, `list-*`, `show`, `list`) query what already exists and, as a rule, do not generate charges. Commands that **create** resources can generate cost; when they appear, they are marked with **[CREATES RESOURCE]** and accompanied by the cleanup command. In this guide there is no command that creates resources: all the `aws` and `az` commands are read or validation commands. When you finish any cloud experiment, check in the console that nothing was left behind.

**Local files of the guide** (you will create them gradually, in the `lab-cloud` folder inside your home folder):

```text
~/lab-cloud/      # path stored in the LAB variable
  etapa-01/   # CapEx x OpEx calculation
  etapa-02/   # stateless function
  etapa-03/   # availability and Circuit Breaker
  etapa-04/   # decision matrix
  etapa-05/   # CIDR plan, CloudFormation, and Bicep
  etapa-06/   # envelope encryption, tags, and costs
```

Before Stage 01, define the `LAB` variable and create the folders. All the commands in the guide use this variable:

```sh
LAB="$HOME/lab-cloud"    # base folder of the lab; all the paths in the guide start from it
mkdir -p "$LAB"/etapa-01 "$LAB"/etapa-02 "$LAB"/etapa-03 "$LAB"/etapa-04 "$LAB"/etapa-05 "$LAB"/etapa-06
ls "$LAB"                 # checks: etapa-01 to etapa-06
```

Since the commands use the full path (`"$LAB"/etapa-XX`), they work from any folder, even after a `cd`. The variable only lasts for the open terminal: if you open another terminal, run the line `LAB="$HOME/lab-cloud"` again before continuing.

## Reference table: stick this on the steering wheel

The same analogy holds from the beginning to the end of the document. If the VM is a car in Stage 01, it is still a car in Stage 06. Only the central pieces are listed here; each analogy is explained again at the point where it appears. The complete table, with all the analogies used, is in the [Appendix: complete reference table](#appendix-complete-reference-table), at the end of the document.

One rule holds for the whole document: **AWS and Azure do not become F1 teams.** The two providers enter the analogy in the same way, as two different circuits where the same team (you) operates.

| Cloud architecture | Formula 1 |
|---|---|
| Cloud provider (AWS or Azure) | The circuit: the infrastructure the team uses to operate (garage, power, network, timing); the same team operates on both |
| Public, private, and hybrid cloud | The circuit shared by the 11 teams; the team's factory; and the two connected by a link |
| IaaS, PaaS, SaaS, and FaaS | Empty garage with a standard car; garage equipped and maintained by the circuit; ready-made service, like the official timing; pit stop triggered by the call from the pit wall |
| Shared responsibility | The circuit takes care of the track, the barriers, and the structure; the team takes care of the car, the garage, and who enters it |
| VM (instance) | A car: the unit of capacity that goes onto the track (in IaaS, the standard car the circuit hands over) |
| Region and availability zone | The circuit's geographic site; and the independent pavilions inside it, each with its own power, cooling, and network |
| Parallel redundancy | The team's two cars: if one retires, the other still scores |
| SLI, SLO, and SLA | The number on the telemetry; the internal target with slack; the formal limit that costs a penalty |
| Circuit Breaker | Shutting down the system that fails in sequence and, a few laps later, trying a single reset |
| VPC and subnets | The team's reserved area at the circuit, divided into sectors with different access |
| IAM | The credentialing: who you are and where your credential lets you in |
| FinOps and tags | The cost cap and the label on each part with its cost center |

## Where the comparison stops

The analogy organizes the reasoning, but it does not replace the technical model. The main limits, which I repeat in the text when they appear:

- **A real circuit sits in one place.** A provider has sites in dozens of places around the world (the regions). In this guide, read "circuit" as the owner of the infrastructure, with several sites.
- **Two cars, always.** The regulations fix two cars per team. In the cloud, the number of machines goes up and down by itself; horizontal scaling and elasticity have no equivalent on the track.
- **Independent pavilions do not exist at the racetrack.** At a real racetrack there is a single pit building, with the garages side by side; a problem in the building affects all of them. Availability zones are physically separated precisely to avoid this.
- **The circuit is not chosen.** The calendar decides where the team races. In the cloud, the choice of provider is yours, leaving can be expensive (lock-in), and you can use both at the same time.
- **A part is matter; data is a copy.** A part exists in one unit. An object, a replicated disk, or a cached copy exists in as many copies as you want.

Whenever there is a conflict between the track and the terminal, what is in the terminal prevails: definitions, commands, and expected outputs of the technical text.

---

## Stage 01: Introduction to Cloud Computing

*THE LIGHTS ARE OUT! The start of the Cloud Architecture Grand Prix, and the first corner is a question of money: buy the structure for the worst day of the year or rent only when you need it? Before any service, understand what the cloud solves and what it does not promise. Stay with me.*

### The problem

An online store (let us call it Mercadinho Digital) sells little all year and a lot in November. In March, the board approves the purchase of ten servers to withstand Black Friday. The approval takes weeks, the delivery and installation take months, and the money (capital) sits idle in hardware that spends eleven months almost unused. If the campaign goes viral and the peak is bigger than predicted, the site goes down and there is no way to buy a server in one afternoon. If a flood hits the server room, everything goes down together, because everything is in a single place.

Each pain in this story is a limitation of traditional IT that the material lists: **high upfront cost (CapEx)**, **long purchase cycles**, **lack of elasticity**, **all-internal maintenance**, **vulnerability to local disasters**, and **low agility**. Cloud computing exists to attack exactly these pains.

**Cockpit perspective:** Mercadinho buying ten servers in March for Black Friday is the team that decides, at the start of the year, how much structure it will need on the worst weekend of the season and pays for it all year. In F1, the capacity bought is the in-house infrastructure: wind tunnel, simulator, test benches. It is expensive, takes time to be ready, and spends part of its time idle. And if everything is in one building, a problem in that building stops everything.

### The concept

**Cloud computing** is the delivery of computing resources (hardware, storage, databases, network, and software) **on demand**, over a network (usually the Internet), without you managing the physical infrastructure.

**The electricity analogy.** You do not build a power plant to plug in the refrigerator: you plug in the appliance and pay the bill for consumption. The cloud does the same with computing. Traditional IT is having your own generator (expensive, takes space, you repair it); the cloud is the power grid (you consume and pay for usage).

**Cockpit perspective:** this is why, on our map, each provider is a **circuit**. The team does not build the racetrack in order to race: it arrives, occupies the garage the circuit offers, uses the power, the network, and the timing from there, and operates. AWS and Azure are two different circuits, each with its own facilities and names, and the team (you) takes the same procedure to both. Neither of them becomes an F1 team in this guide. **Here the analogy stops:** a real racetrack sits in one place; a provider has sites in dozens of places around the world (the regions, in Stage 03). Read "circuit" as the owner of the infrastructure, with several sites.

**Traditional IT x cloud** (summary of Table 2 of the material):

| Characteristic | Traditional IT | Cloud |
|---|---|---|
| Cost model | CapEx: large upfront investment | OpEx: pay per use or subscription |
| Ownership | Company assets | Provider assets (rented as a service) |
| Acquisition | Months | Minutes or hours |
| Scalability and elasticity | Fixed capacity; expanding requires a purchase | On-demand resources, adjustable in real time |
| Maintenance | Internal team | Mainly the provider |
| Disaster recovery | Requires your own redundant infrastructure | Provider's integrated backup and DR |

**CapEx x OpEx.** CapEx (*Capital Expenditures*) is a one-off investment in a fixed asset (server, license, data center), depreciated over the years. OpEx (*Operational Expenditures*) is recurring operating spending (subscription, pay per use). Swapping CapEx for OpEx does not mean "getting cheaper" by definition; it means turning fixed cost into variable cost, testing ideas without a large commitment, and aligning spending with real usage. The material calls it a "paradox": the predictability of traditional IT can cost more in the long run because of inefficiency and lost opportunities.

**Cockpit perspective:** CapEx is building your own wind tunnel: a large investment, depreciated over years, and the building remains yours (and costing money) in the weeks when nobody uses it. OpEx is paying per hour of tunnel at a third party's facility: variable cost, no construction, only when there is a model to test. Neither is "cheaper" by definition; it depends on how much and how regularly you use it. **Here the analogy stops:** in F1, use of the tunnel is rationed by the regulations, whether it is your own or rented. In the cloud, the limit of OpEx is your budget.

**Scalability and elasticity.** Scalability is the ability to handle growing load by increasing resources: **vertical** (*scale up*, a bigger machine) or **horizontal** (*scale out*, more machines). Elasticity is scalability operated automatically, up and down, in real time, paying only for what you use. Scalability is the capacity to grow; elasticity is growing and shrinking by itself.

**Cockpit perspective:** vertical scaling is asking the same car for more power: it works until it hits the ceiling (in F1, the regulations; in the cloud, the largest machine size available). Horizontal scaling is putting more cars on the track. Elasticity would be the team racing with two cars in a quiet race and with six when the race heats up, without anyone asking, and going back to two at the end. **Here the analogy stops:** this does not exist in F1: the regulations fix two cars per team, always. In the cloud, the fleet grows and shrinks by itself, and that is the gain the track does not have.

**Agility, high availability (HA), disaster recovery (DR), and global reach.** Agility is assembling and dismantling resources in minutes. HA is keeping the service up even when a component fails (redundancy and automatic failover), which allows SLAs of 99.9% or 99.99%. DR is having a copy outside the main environment, which can be activated in another region. Global reach is deploying close to the customer, with low latency.

**Deployment models:**

- **Public cloud:** resources from a third-party provider, shared among several "tenants" (*multi-tenant*), delivered over the Internet. Convenience and elasticity at the cost of less control and possible compliance and data sovereignty issues. *Analogy:* public transport.
- **Private cloud:** an environment dedicated to one organization, in its own data center or hosted on dedicated servers. It is often a regulatory requirement (finance, health, government). *Analogy:* your own car.
- **Hybrid cloud:** a mix of public, private, and edge, integrated by local or wide area network, VPN, dedicated connections, and APIs. Its predominance is not indecision: it is pragmatic evolution, because not everything can (or needs to) go to the public cloud because of compliance, legacy, or latency. *Analogy:* owning a car and using public transport depending on the trip. Disadvantages from the material: it still requires investing in and maintaining in-house hardware, requires new knowledge, increases complexity, and visibility becomes difficult.

**Cockpit perspective:** public cloud is the circuit: the same structure (pit building, power, network, timing) serves the 11 teams on the grid at the same time, each in its own garage, without seeing the neighbor's. It is *multi-tenant* through and through. Private cloud is the factory: everything dedicated to the team, everything under its control, everything paid for by it. Hybrid cloud is what teams do at every GP: the garage at the circuit connected to the remote operations room at the factory. The link can be an encrypted tunnel over the Internet (VPN) or a dedicated line contracted from a connectivity partner (Direct Connect on AWS, ExpressRoute on Azure). And the reason for the hybrid arrangement is the same as in the material: not everything can or needs to go to the circuit; the car's design stays at home.

**Adoption as organizational transformation.** The material describes four domains of a "cloud-first" organization: leadership (*Lead*), learning (*Learning*), scalability (*Scaling*), and security (*Secure*). And it cites the AWS Cloud Adoption Framework, with six perspectives: Business, People, Governance, Platform, Security, and Operations. Gartner, cited in the material, points to "dissatisfaction with the cloud" (unrealistic expectations, poor implementation, uncontrolled cost) as a real risk.

**The two fields, side by side** *(professor's addition, except where indicated)*:

| Concept | AWS | Azure | What really changes |
|---|---|---|---|
| Region and zones | Regions and Availability Zones (AZs) | Regions and Availability Zones | In both, a region is a geographic area and an AZ is an isolated location inside it. On Azure, **not every region has zones**; check the region before designing. In both, the zone name you see may map to a different physical zone from the one seen by another account or subscription (see Stage 03) |
| Private hybrid network over the Internet | Site-to-Site VPN | VPN Gateway | In both, an IPsec tunnel between the cloud network and yours. On Azure, the VPN Gateway is a resource deployed in its own subnet; on AWS, you use a Virtual Private Gateway (or Transit Gateway) and a Customer Gateway |
| Dedicated connection | Direct Connect | ExpressRoute | In both, a dedicated private connection that does not go over the public Internet, with more bandwidth and less latency than VPN; contracted through a partner or connectivity provider. Price and lead times vary by location |
| Extending the cloud to your data center | AWS Outposts | Azure Stack (HCI and Hub) and Azure Arc | **They really differ.** Outposts is AWS hardware installed in your data center and operated as an extension of an AZ. Azure Arc **is not hardware**: it is an Azure management plane that sees servers and services wherever they are (material: "anywhere, on-premises or other clouds"). The closest match to Outposts is Azure Stack. Microsoft changed the name of the HCI branch (Azure Local, according to the documentation in 2026); check the documentation |
| Adoption framework | AWS Cloud Adoption Framework (CAF) | Microsoft Cloud Adoption Framework (CAF) | AWS organizes by **perspectives** (Business, People, Governance, Platform, Security, Operations, as in the material). Microsoft organizes as a **cycle of phases** (strategy, plan, ready, adopt, govern, manage, with security running through all of them). Same intention, different design |

**Cockpit perspective:** the difference between Outposts and Arc is the difference between receiving equipment and receiving a dashboard. Outposts is as if the circuit installed a piece of its own infrastructure (its rack, operated by it) inside your factory, and you only guaranteed space, power, cooling, and network. Azure Arc is the circuit's control panel starting to see and manage your equipment wherever it is, without bringing any hardware. Whoever wants the Azure circuit's hardware at home looks for the Azure Stack line. **Here the analogy stops:** no racetrack installs a garage inside a team's factory; the parallel only serves to separate "provider hardware at your site" from "provider management over your site".

**In the market (material, ref. jun/2025):** the material projects that 50% of cloud resources would be dedicated to AI workloads by 2029 and that Gartner predicts that 25% of companies would have significant dissatisfaction with the cloud by 2028. Use it as context, not as current data.

### Commented example: how much does the peak cost? (fictitious numbers)

Back to Mercadinho Digital. The model below compares two worlds with numbers **invented** for this exercise. It ignores a lot of real things (staff, data transfer, power, licenses) and serves only to see the mechanics: fixed cost pays for the peak all year; variable cost pays for the peak only when it exists.

Create the file `$LAB/etapa-01/capex_opex.sh`:

```sh
awk 'BEGIN {
  # WARNING: all values are FICTITIOUS. UM = invented monetary unit.

  # --- World 1: own servers (CapEx) ---
  preco_servidor = 3600       # purchase of 1 server
  qtd_pico = 10               # we buy for the worst day of the year
  vida_util = 36              # months over which the asset is depreciated
  manutencao = 300            # fixed monthly maintenance cost
  onprem = qtd_pico * preco_servidor / vida_util + manutencao   # equivalent monthly cost

  # --- World 2: cloud (OpEx, pay per hour) ---
  preco_hora = 0.50           # 1 VM per hour
  horas_mes = 730             # approximation of hours in a month
  normal = 2 * preco_hora * horas_mes    # 11 months with 2 VMs
  pico   = 10 * preco_hora * horas_mes   # 1 month (November) with 10 VMs
  nuvem  = (11 * normal + pico) / 12     # monthly average over the year

  printf "on-premises: %.2f UM/mes\n", onprem
  printf "nuvem:       %.2f UM/mes\n", nuvem
}'
```

Run:

```sh
sh "$LAB"/etapa-01/capex_opex.sh
```

Expected output:

```text
on-premises: 1300.00 UM/mes
nuvem:       973.33 UM/mes
```

Read the result carefully: it **does not prove** that the cloud is cheaper. It shows that, with a short peak far above the average, paying by the hour is advantageous; if the load were constant across the 24 hours of the 12 months, the math would change (and that is why usage commitments exist, in Stage 06).

**Cockpit perspective:** it is the math of the rented wind tunnel. If the team needs a lot of tunnel in a single month, renting wins. If it uses the same amount all year, having its own (or signing a long contract) starts to pay off. What decides is the shape of your demand, not fashion.

### Hands-on

*Stopwatch in hand! First you play with Mercadinho's numbers and watch the cloud's advantage shrink; then you ask each circuit where its sites are. Read-only, nothing is created.*

**1. Change the numbers and observe.** Simulate a nearly flat load by changing two things in the file `$LAB/etapa-01/capex_opex.sh`: on the line `qtd_pico = 10`, change the `10` to `4`; on the line `pico   = 10 * preco_hora * horas_mes`, change the `10` (the number of VMs in the peak month, which has no variable name) to `4`. Run again with `sh "$LAB"/etapa-01/capex_opex.sh`.

Expected output:

```text
on-premises: 700.00 UM/mes
nuvem:       790.83 UM/mes
```

The advantage **reversed**: with a low peak, the 4 own servers come out cheaper than the VMs rented all year. Moral: elasticity is only worth money when the load varies.

**2. List each provider's regions (read-only).** Requires each provider's CLI to be authenticated (`aws configure` with a key from a free account; `az login`).

Check that the CLI is installed (no account needed):

```sh
aws --version     # prints something like: aws-cli/2.x.x Python/3.x ...
az --version      # prints the azure-cli version and the installed extensions
```

Regions on AWS (queries the regions enabled for your account):

```sh
aws ec2 describe-regions --query "Regions[].RegionName" --output text
# --query: JMESPath filter, takes only the RegionName field of each region
# --output text: prints on one line, separated by tabs
```

Expected output (illustrative, your list varies depending on the enabled regions):

```text
ap-south-1  eu-west-1  ... sa-east-1  us-east-1  us-west-2 ...
```

Regions on Azure (`az account list-locations` lists the subscription's locations; the filter keeps only the physical ones):

```sh
az account list-locations \
  --query "[?metadata.regionType=='Physical'].{regiao:name, nome:displayName}" \
  --output table
```

Expected output (illustrative):

```text
Regiao       Nome
-----------  ------------
brazilsouth  Brazil South
eastus       East US
...
```

Notice: Azure uses names like `brazilsouth` (São Paulo); AWS uses `sa-east-1` (also São Paulo). Different names, same idea: the physical place where the resource lives.

**Cockpit perspective:** `sa-east-1` and `brazilsouth` are two sites in the same city, one from each circuit, each with its own naming system. At configuration time, what counts is the name that circuit uses; the team's procedure is the same on both.

### Exercises

*Flying lap! Four questions, without looking at the text: CapEx or OpEx, deployment model, scalability or elasticity, Outposts or Arc. Clock running.*

1. **CapEx or OpEx?** Classify: (a) buying 5 servers for the data center; (b) a monthly subscription to a SaaS CRM; (c) paying by the hour for a VM; (d) building a vault room. *Expected answer:* (a) CapEx; (b) OpEx; (c) OpEx; (d) CapEx.
2. **Which deployment model?** A bank is required by law to keep customer data in national territory and wants to use AI on the public cloud to analyze non-sensitive data. *Expected answer:* hybrid cloud (regulated data in a private environment or in a region that meets the rule; analysis on the public one), integrated by VPN or dedicated connection (Direct Connect on AWS, ExpressRoute on Azure).
3. **Scalability or elasticity?** The site doubles its capacity at 7 pm and goes back to normal at 11 pm without anyone touching anything. Which of the two terms describes it better? *Expected answer:* elasticity, because it is automatic adjustment in both directions; scalability is the capacity to grow, which elasticity puts into operation.
4. **Outposts or Arc?** You need a cloud rack inside your data center, with low latency to a factory. Which AWS service and what is the closest match on Azure? *Expected answer:* AWS Outposts; on Azure, the Azure Stack line (hardware and software at your site). Azure Arc, on its own, manages but does not deliver hardware.

### Remember this

> The cloud is computing sold as a service: you swap idle capital (CapEx) for metered consumption (OpEx), and you only really win when your load varies or when you need speed, reach, and resilience that you could not buy by yourself.

*Sector 1 in green! You already know why the team rents the garage instead of building the racetrack, and that renting only really pays off when the load varies. Now comes the next question: inside the rented garage, how much of the work is yours? Stage 02, the service models.*

---

## Stage 02: Service Models: IaaS, PaaS, SaaS, and FaaS

*Second sector, and the track climbs a staircase: empty garage, equipped garage, ready-made service, on-demand pit stop. At each step you operate less and control less. Only one row of the matrix does not change owner at any step, and that is where the sector's trap lives. Eyes on the table.*

### The problem

A team of three people launches a product in two months. Who will install the operating system, apply security patches, configure the web server, scale when traffic rises? If the answer is "we do, everything", there is little time left for the product. If it is "the provider, almost everything", there is little control left to adjust what is specific. The underlying question is: **how much of the technology stack do I want to operate and how much do I want to outsource?** The service models are the standardized answers to that question.

**Cockpit perspective:** every F1 team faces a version of this question: how much of the car do I make and how much do I buy ready-made? Design the power unit and the gearbox, or buy from a manufacturer and focus the factory on what differentiates the car? Whoever makes everything controls everything and pays for everything; whoever buys gains time and loses freedom to change. It is the same trade between control and convenience that the service models standardize.

### The concept

**The housing analogy.**

- **On-premises:** you buy the land, build the house, and take care of everything.
- **IaaS:** you rent an empty house. The structure and the electrical network are the owner's; furniture, painting, and interior maintenance are yours.
- **PaaS:** you rent a furnished house. You only bring your suitcase (your code and data).
- **SaaS:** you stay at a hotel. You use the service, you take care of nothing.
- **FaaS:** you take a ride-hailing car. You pay only for the ride and do not think about garage, fuel, or maintenance.

**Cockpit perspective:** on the track, the staircase looks like this, always with the provider in the role of the circuit:

- **On-premises:** having your own track and your own facilities and taking care of everything, like the test track Ferrari maintains at Fiorano.
- **IaaS:** the circuit hands over the empty garage, with power, network, and a standard car (the VM). Engine, electronics, set-up, and operation, from the operating system up, are yours.
- **PaaS:** the circuit hands over the garage equipped and maintained, with benches, tools, and a support team. You bring the set-up and the strategy (your code and your data).
- **SaaS:** you use a ready-made service from the circuit, like the official timing. You operate nothing, you only consume.
- **FaaS:** the pit stop. Triggered by an event (the "box, box" call), lasts seconds, has a time limit, and the crew keeps no memory between one stop and the next: what matters (which tire, how many laps) lives in the strategist's system.

**Here the analogy stops:** in F1 no circuit supplies a car; the regulations oblige each team to design its own chassis. The "standard car" is just the image for "ready-made machine, operated by you from the OS up". And the pit stop crew is paid for the whole weekend, stopped or not; FaaS charges only for execution time.

**Layers of abstraction.** The higher the abstraction (from IaaS to FaaS), the more responsibility the provider takes on and the less control the customer has. In exchange you gain convenience, fast deployment, built-in scalability, and a lower upfront cost; you pay with less flexibility and **vendor lock-in risk** (dependence on specific tools that makes migrating harder).

**The four models:**

- **IaaS (Infrastructure as a Service):** virtual servers (or bare metal), storage, and network on demand. You manage the OS, middleware, applications, and data. Good for full control, *lift-and-shift* migration (taking the application as it is), and environments that require controlling OS patches.
- **PaaS (Platform as a Service):** a platform to develop, run, and manage applications. The provider takes care of servers, OS, runtime, and middleware; you write code and take care of the application and data. It combines well with CI/CD and DevOps. Disadvantages: less control, lock-in risk, limited customization.
- **SaaS (Software as a Service):** a complete application, by subscription. *Multi-tenant* architecture: one instance serves several customers with separate data. Disadvantages: little control, dependence on the vendor, and risk of **Shadow IT** (employees using applications without IT management).
- **FaaS (Functions as a Service, or *serverless*):** you write small functions, triggered by events (HTTP request, file upload, database change). The provider runs them, scales from zero to the peak, and charges for execution time. Each execution is independent (**stateless**). Disadvantages: *cold start* (initial latency), maximum execution time (timeout), state that is hard to keep, more complex testing. "Serverless" does not mean the absence of servers, but that you do not worry about them.

**Shared responsibility matrix** (who takes care of each layer; Table 1 of Lesson 02 of the material, in the version corrected according to Professor's note 1: the Data row stays with the customer in all models, contrary to what the Lesson 01 table said for SaaS):

| Layer | On-prem | IaaS | PaaS | SaaS | FaaS |
|---|---|---|---|---|---|
| Applications | Customer | Customer | Customer | Provider | Customer |
| Data | Customer | Customer | Customer | Customer | Customer |
| Runtime | Customer | Customer | Provider | Provider | Provider |
| Middleware | Customer | Customer | Provider | Provider | Provider |
| Operating system | Customer | Customer | Provider | Provider | Provider |
| Virtualization | Customer | Provider | Provider | Provider | Provider |
| Servers, storage, network, facilities | Customer | Provider | Provider | Provider | Provider |

Two important readings. First: the **Data row is "Customer" in all columns**. Even in SaaS, you decide who accesses and what is stored. It is "security **in** the cloud" (customer) versus "security **of** the cloud" (provider). Second: **there is no "best" model**, there is the one that fits the project's requirements, the team's expertise, the sensitivity of the data, and the budget. Real organizations combine: IaaS for back-end processing, PaaS for development, SaaS for CRM and email.

**Cockpit perspective:** the "Data" row is the team's telemetry and set-up. It does not matter whose garage, power, or timing it is: who decides who sees the car's data and what is stored is the team. If an engineer sends the set-up spreadsheet to the wrong address, the circuit has nothing to do with it. It is "security **in** the cloud" smelling of rubber.

**The two fields, side by side** *(professor's addition; the material cites Azure VMs, App Service, and Functions)*:

| Model | AWS | Azure | What really changes |
|---|---|---|---|
| IaaS (VM) | Amazon EC2 | Azure Virtual Machines | Same concept. On AWS, the size is called *instance type*; on Azure, *VM size*. In both, you choose image, size, disk, and network, and you answer for the OS |
| IaaS (block disk) | Amazon EBS | Azure Managed Disks | A block volume attached to the VM. "Managed" on Azure means you do not take care of the storage account behind the disk. In both, the disk is billed by provisioned size |
| PaaS (web application) | AWS Elastic Beanstalk | Azure App Service | **Same promise, different philosophies.** Beanstalk orchestrates resources that remain visible in your account (instances, load balancer, autoscaling group). App Service is a hosting platform in which you choose a plan and deploy; the infrastructure underneath does not appear as resources of yours |
| FaaS | AWS Lambda | Azure Functions | In both, event-triggered code and billing by usage. On AWS, an HTTP request to the function usually goes through a separate service (API Gateway, whose price the material warns can weigh heavily); for simple cases, Lambda also offers *Function URLs*, an HTTPS address of the function itself, without API Gateway (professor's addition; check features and limits in the documentation). On Azure, the HTTP trigger comes in the Function itself. On Azure, functions are grouped into a *Function App* with a hosting plan; on AWS, the function is the unit |
| SaaS | (not the focus of the providers) | Microsoft 365 (cited in the material as Office 365) | SaaS is ready-made software from any vendor (Salesforce, Slack, Dropbox in the material). There is no "equivalent" to map: it is a category, not an infrastructure service |

**Honesty about FaaS:** billing in both is by execution and time, but the units of measurement, the time limits, and the ways to reduce *cold start* are different. Check each one's pricing page and limits before comparing cost; there is no "1 to 1" conversion.

### Commented example: why "stateless" matters

The material says FaaS is stateless and that this is a design constraint and the key to scale. See the problem in 6 lines. Create `$LAB/etapa-02/funcao.py`:

```python
contador = 0  # state kept in the process memory: NOT reliable in FaaS


def handler(evento):
    global contador  # allows changing the variable from outside the function
    contador += 1  # adds 1 for each invocation that lands on THIS instance
    return {"recebido": evento, "contador": contador}
```

Run two "invocations" in the same process:

```sh
cd "$LAB"/etapa-02    # enters the folder so python3 finds funcao.py
python3 -c "import funcao; print(funcao.handler('a')); print(funcao.handler('b'))"
```

Expected output:

```text
{'recebido': 'a', 'contador': 1}
{'recebido': 'b', 'contador': 2}
```

Here the counter "worked" because both calls landed in the same process. In Lambda or Azure Functions, the platform may reuse an instance (works sometimes) or create others (the counter goes back to 1). The behavior is unpredictable, and **that is the trap**: the function looks right in testing and breaks in production. The rule: state that matters goes outside (database, cache, object storage).

**Cockpit perspective:** in Sepang, the safety car on lap 9 was the event that opened, all at once, the pit stop window for those on intermediates. It is the load profile of FaaS: nothing, then a peak triggered by an event, then nothing. And notice how the crew works: it does not decide or remember which tire goes on the car; that information is in the strategy system, outside of it. If each mechanic counted from memory how many stops had been made, it would be enough for another mechanic (another instance) to handle the next one for the count to go back to zero. The global variable `contador` is that mechanic counting from memory. The *cold start* is the pit stop called at the last minute: the crew still has to leave the garage and position the tires before the car arrives. **Here the analogy stops:** a team's crew is the same all weekend; in FaaS you neither choose nor see which instance serves each call.

### Hands-on

*Pit lane open! Pen and paper for your own stack, then the standard car's spec sheet from each circuit and a garage check that, on a new account, must come back empty.*

**1. Classify your stack (pen and paper).** Take a system you know and fill in the matrix above: what is yours and what is the provider's, if it ran on IaaS, PaaS, and FaaS. Mark the "Data" row.

**2. Describe the instance types without creating anything (read-only).**

AWS (queries the catalog for the `t3.micro` type; does not create an instance, only describes the type):

```sh
aws ec2 describe-instance-types \
  --instance-types t3.micro \
  --query "InstanceTypes[].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB]" \
  --output text
```

Expected output (illustrative; check yours):

```text
t3.micro	2	1024
```

Azure (queries the VM SKU catalog in a region and shows only the CPU and memory capabilities of the `Standard_B1s` size; if it does not exist in the chosen region, change the region or the size):

```sh
az vm list-skus --location eastus --size Standard_B1s --resource-type virtualMachines \
  --query "[?name=='Standard_B1s'] | [0].capabilities[?name=='vCPUs' || name=='MemoryGB']" \
  --output table
```

Expected output (illustrative; memory comes in GB, and 1 GB = 1024 MB):

```text
Name      Value
--------  -------
vCPUs     1
MemoryGB  1
```

Note: in other materials you will see `az vm list-sizes`. That command is marked as obsolete in recent versions of the Azure CLI and prints a deprecation warning recommending `az vm list-skus`; the warning is expected and is not your mistake. If your version of `az` complains about a parameter, check `az vm list-skus --help`.

Observation: both say "how many CPUs and how much memory". What you choose is the *size* of the machine that, in the IaaS model, you will operate yourself.

**Cockpit perspective:** `t3.micro` and `Standard_B1s` are the spec sheet of the standard car each circuit offers: how many processors and how much memory. Choosing the size is choosing the car; getting right what runs inside it is still your job, just as the set-up is still the team's.

**3. Check what exists of PaaS and FaaS in your account (read-only; a new account should return empty):**

```sh
aws elasticbeanstalk describe-applications   # PaaS on AWS: lists Beanstalk applications
aws lambda list-functions                    # FaaS on AWS: lists functions
az webapp list --output table                # PaaS on Azure: lists App Service applications
az functionapp list --output table           # FaaS on Azure: lists Function Apps
```

Expected output on a new account: `{"Applications": []}`, `{"Functions": []}` and, on Azure, no lines (or `[]`).

### Exercises

*Flying lap! Four exercises, and the third is the trickiest: a function that looks right in the test and loses the cart in production. Whoever understood stateless nails the answer.*

1. **Choose the model.** (a) The HR team needs email and calendar; (b) a bank needs to control the OS patch of the transaction server; (c) four devs want to publish a web API without taking care of a server; (d) process each photo uploaded by users, in unpredictable peaks. *Expected answer:* (a) SaaS; (b) IaaS; (c) PaaS (App Service or Elastic Beanstalk); (d) FaaS (Lambda or Azure Functions), triggered by the upload event.
2. **Who is responsible?** In a SaaS, an employee mistakenly shares a spreadsheet publicly with customer data. Whose failure is it? *Expected answer:* the customer's. Data and access configuration are always the customer's, in any model.
3. **Why did the function fail?** A function stores the user's cart in a global variable. In production, the items "disappear" from time to time. Explain and fix. *Expected answer:* FaaS is stateless; the platform may serve different calls through different instances, which do not share memory. Fix: store the cart in an external database or cache, identified by the user.
4. **Beanstalk x App Service.** Name one real difference between the two. *Expected answer:* Beanstalk leaves visible, in your account, the resources it creates (instances, load balancer, autoscaling); App Service offers hosting by plan, without exposing the infrastructure underneath as resources of yours.

### Remember this

> The higher the model (IaaS, PaaS, FaaS, SaaS), the less you operate and the less you control, but your data and your access are always yours.

*Sector 2 in green! You go up and down the staircase from IaaS to FaaS knowing what is yours at each step, and the "Data" row is engraved. Now the track gets truly technical: where the infrastructure lives, how many nines it can sustain, and when to shut down what is failing. Stage 03, the most demanding part of the circuit.*

---

## Stage 03: Cloud Infrastructure

*Third sector, the most technical stretch of the circuit! Regions, zones, points of presence, SLI, SLO, and SLA, series and parallel, Circuit Breaker. This is where the scorers are separated from the rest of the grid, because availability is not declared: it is calculated. Brake hard and settle into the rhythm.*

### The problem

On Black Friday, the data center that hosts the store loses power for two hours. If the whole system was in that building, that is two hours of lost revenue. Worse: a customer in Manaus accesses a server on another continent and waits for the page to load, because light takes time to travel. Both problems have the same root, **geography**: where the infrastructure lives defines how well it resists failures and how fast it is for those who use it.

**Cockpit perspective:** the 2026 F1 season gave an example of geography at calendar scale: the Bahrain round, held in Sepang as I told you in the opening, did not stop happening; it changed venue. In architecture, this has a name: disaster recovery in another region. The other half of the problem, latency, is the daily routine of any round far from the factories: in Singapore, October 9 to 11, 2026, engineers thousands of kilometers away will follow cars live on the other side of the world, and distance charges its price in delay.

### The concept

**Data centers, regions, zones, and points of presence.**

- **Data center:** a physical facility with thousands of servers, networks, and storage.
- **Region:** an independent geographic area, isolated from failures in other regions. Deploying in more than one region lets you survive the loss of one of them and meets data residency requirements.
- **Availability Zone (AZ):** an isolated location **inside** a region, generally a data center or a set of nearby data centers, with independent power, cooling, and network. It is a **failure domain**: the failure of one zone should not affect the others. The zones of a region are connected by high-bandwidth, low-latency links.
- **Point of Presence (PoP) or *edge location*:** the entry door to the provider's network close to the user. Traffic enters the nearest PoP and from there follows through the provider's network. CDNs use PoPs to cache static content.

**Analogy.** A region is a city; AZs are neighborhoods of the city with their own power grid; PoPs are post offices spread around, where you drop off a parcel closer to home.

**Cockpit perspective:** on our map, the provider is the circuit; the **region** is each geographic site of it (a city, a country); the **availability zones** are independent pavilions inside the same site, each with its own power, cooling, and network and connected to each other by fast cables; the **data center** is each building of a pavilion; and the **points of presence** are forward material depots spread around the world, close to where the next round will happen. **Here the analogy stops:** at a real racetrack there are no independent pavilions: the garages sit side by side in the same pit building and share the circuit's infrastructure; a blackout in that building affects all of them. Availability zones are physically separated precisely so that this does not happen.

**Zonal and regional resources.** A **zonal** resource lives in one zone (cheaper and less resilient); a **regional** one is replicated across zones (more available and, in general, more expensive). Choosing is balancing cost and resilience.

**Cockpit perspective:** a zonal resource is material in a single pavilion; a regional one is material mirrored in several pavilions of the site. The second costs more and survives the loss of one of them. And one detail that confuses many people: your "pavilion 1" may not be another account's "pavilion 1". The label is yours; the pavilion is the circuit's. AWS's *zone ID* is the official number of the pavilion, the same for everyone.

**The two fields, side by side** *(professor's addition; the material cites AWS and Azure AZs and ZRS in Stage 05)*:

| Concept | AWS | Azure | What really changes |
|---|---|---|---|
| Region | Region (e.g., `sa-east-1`) | Region (e.g., `brazilsouth`) | Same concept. Azure also has the concept of **paired regions** for disaster recovery |
| Zone | Availability Zone | Availability Zone | On Azure, **some regions have no zones**. In both, the zone label (`a`, `b`, `c` on AWS; `1`, `2`, `3` on Azure) is mapped to a physical zone **per account or subscription**: your "zone 1" may not be someone else's "zone 1". AWS exposes a stable identifier (*zone ID*, such as `sae1-az1`) for those who need to align accounts |
| Resource scope | Zonal resources (instance, volume) or regional | Zonal, **zone-redundant** (such as ZRS storage), or regional resources | In both, the choice is yours. On Azure the term "zone-redundant" is explicit in many services |
| Edge | CloudFront (edge locations) | Azure Front Door and Azure CDN (Microsoft PoPs) | See Stage 05 for the differences in scope. The current state of classic Azure CDN has been undergoing consolidation with Front Door: check the documentation |

> **Scope note.** The material uses Google Cloud in its region examples (`europe-west1`, `southamerica-east1`) and states "each region has three or more AZs". That describes Google Cloud. On AWS and Azure, the number of zones varies among regions and Azure has regions without zones. Details in the Professor's notes.

**Latency.** It is the delay in transmission, measured by RTT (*Round Trip Time*, the round trip of the packet). According to the material: 30 to 40 ms is generally acceptable; 100 to 150 ms may be tolerable in some cases; above that the user notices; for ultra-sensitive applications (autonomous cars, cloud gaming), even 10 ms matters. The application defines what is acceptable. Strategies: **CDN**, optimized routing and infrastructure, **IPv6**, compression and content reduction, **edge computing**, and subnets that keep traffic local.

**Cockpit perspective:** RTT is the round-trip time between the car and whoever decides. From the pit wall to the car, it is negligible; from the garage at Marina Bay to an operations room in Europe, it grows with distance, because the signal crosses continents. That is why the box call happens at the pit wall, close to the car, with the factory supporting. It is the same reasoning as the edge: the decision that does not tolerate delay stays close to the source.

**Pillar: scalability.** Vertical (bigger machine, simple, but with a ceiling and generally with downtime) or horizontal (more machines, no hardware ceiling, more resilient, more complex). Two mechanisms make horizontal scaling practical: **auto-scaling** (groups that add or remove instances by metric, such as CPU or number of requests) and **load balancing** (distributes requests). The material cites Application Load Balancer (layer 7, by content) and Network Load Balancer (layer 4, TCP and UDP, high performance).

**Cockpit perspective:** the load balancer is the pit lane entry control: a single entry point that looks at each request that arrives, forwards it to one of the available VMs without leaving one overloaded while another is free, and takes the one that failed out of the route (the *health check*). The layer 4 one decides by looking only at the envelope (where it comes from, where it goes); the layer 7 one reads the whole request, like the control that asks whether it is a tire change or a wing change before indicating who is prepared for that service. Auto-scaling is the rule that puts cars on the track or takes them off according to load. **Here the analogy stops:** in the real pit lane, each car stops at its own team's garage and nobody redistributes cars; the image holds for the role of the load balancer, not for the track rule. And in F1 you do not put a new car on the track in the middle of the race. Behind a load balancer, the instances are identical and any one of them serves any request.

*(professor's addition; the material cites Application Load Balancer and Network Load Balancer, without the Azure counterpart)*

| Concept | AWS | Azure | What really changes |
|---|---|---|---|
| VM autoscaling | Auto Scaling Groups (ASG) | Virtual Machine Scale Sets (VMSS) | Same role: a set of identical VMs that grows and shrinks by rule. Terminology and integration with the load balancer differ |
| Layer 7 load balancer | Application Load Balancer (ALB) | Azure Application Gateway | Routes by content (HTTP, path, headers). On Azure, the scope is regional; for **global** entry, see Front Door |
| Layer 4 load balancer | Network Load Balancer (NLB) | Azure Load Balancer | High performance for TCP and UDP. Both distribute **per flow, with a hash**: the NLB chooses the destination of each flow by a hash of protocol, source and destination addresses and ports; the Azure Load Balancer uses, by default, a 5-tuple hash (source IP and port, destination IP and port, protocol). For session affinity, check the distribution mode on Azure (by source IP) and the target group *stickiness* on AWS |

**Pillar: high availability (HA).** It is the fraction of time the system is ready. **Five nines** (99.999%) means about 5.26 minutes of downtime per year (you will calculate this below). Each additional nine requires more redundancy, and the material says the cost rises exponentially; treat that as a tendency, not a law. The reliability hierarchy:

- **SLI** (*Service Level Indicator*): the raw measurement (uptime, response time, error rate).
- **SLO** (*Service Level Objective*): the internal target over the SLI (e.g., "99.95% monthly availability"). It allows an **error budget**.
- **SLA** (*Service Level Agreement*): the formal promise to the customer, often with a penalty, always more conservative than the SLO (a deliberate safety margin).

**Cockpit perspective:** the SLI is the number the telemetry shows: brake temperature, laps completed without failure. The SLO is the internal target with slack: the team plans the season using fewer power unit components than the regulations allow, and the slack between the plan and the limit is its **error budget**. The SLA is the formal limit with a consequence: going over the regulations' component allotment costs positions on the grid. The internal target is stricter than the formal limit for the same reason the SLO is stricter than the SLA: a deliberate margin. **Here the analogy stops:** the SLA is a promise made **to the customer**; the component allotment is a rule imposed **on the team** by the FIA. What the comparison preserves is the structure: a measurement, an internal target with slack, and an external limit that costs dearly.

Redundant systems: data replication, multi-region deployment, hardware redundancy. Automatic failover: **active-passive** (idle backup takes over) or **active-active** (all serve, behind a load balancer).

*Providers publish SLAs per service, and the guarantee changes depending on the topology (single instance or several zones). Read the SLA of the specific service; there is no single "AWS SLA" or "Azure SLA".*

**Resilience and Circuit Breaker.** Resilience is withstanding and recovering from failures while maintaining functionality, even degraded. The **Circuit Breaker** pattern works like a breaker: after consecutive failures when calling a remote service, it "opens" and stops trying for a while, avoiding cascading failures and giving the sick service a chance to recover. **Retry** tries again expecting a transient failure; Circuit Breaker prevents the attempt when the failure seems persistent. They can be combined, and the retry must stop when the breaker opens. It is not a provider service: it is a pattern implemented in a library in your code (the material refers to Microsoft's documentation on the pattern, and it applies equally to AWS and Azure).

**Cockpit perspective:** the breaker is what the team does when a system on the car starts failing in sequence. If the ERS reports failure after failure, insisting on demanding energy from it may damage other components and stop the whole car: the cascading failure. The pit wall orders the system shut down (breaker **open**): the driver is slower, but stays on the track. A few laps later, the engineer asks over the radio for a single attempt to reactivate the system from the steering wheel controls (the **half-open** state). It came back, the system returns to normal (**closed**); it failed again, it shuts down again. The retry is the driver pressing the same button at every corner, hoping it works this time: it helps with a passing failure and makes a persistent one worse.

**Fault tolerance x HA.** HA minimizes interruptions (including planned ones); fault tolerance keeps operation uninterrupted **during** unexpected failures, and goes beyond redundancy (error checking, self-healing, holistic design). Replication: of **data** (databases in different locations) and of **components** (duplicated services in zones or regions).

**Edge computing.** Moves processing close to the data source: faster responses, less bandwidth spent (filters locally and sends only the essentials). It does not replace the central cloud; it complements it. Cases from the material: IoT, autonomous vehicles, asset monitoring, predictive maintenance, hospitals, smart cities. Security becomes an issue, since more edge points mean more attack surface. See the Outposts x Azure Stack and Arc table in Stage 01.

**Cockpit perspective:** the F1 car is an edge node. It records far more data than it streams live: the on-board electronics process the sensor signals right there, only a part follows through telemetry to the pit wall during the lap, and the full record is downloaded when the car returns to the garage. The decision that cannot wait (engine control, energy management) happens in the car; the heavy analysis happens at the factory. Edge and center complement each other, exactly as the material describes.

**Market (material, ref. jun/2025):** 97 zettabytes of data generated in 2024 with a projection of 181 zettabytes in 2025; Gartner projected 75% of enterprise data processed at the edge by 2025; IDC projected 32% of large companies' AI spending on inference by 2027.

### Commented example: the math of the nines and the breaker

*Attention, the race is heating up! Three calculations in a row: the downtime of each SLA, availability in series and in parallel, and a breaker that opens and closes in front of you. Slowly and carefully, because this stretch holds up the rest of the sector.*

**Part A: how much downtime does each SLA allow?** Create `$LAB/etapa-03/noves.sh`:

```sh
awk 'BEGIN {
  n = split("99.9 99.95 99.99 99.999", disp, " ")   # the availabilities to calculate
  minutos_ano = 365 * 24 * 60                       # minutes in a 365-day year
  for (i = 1; i <= n; i++) {
    # allowed downtime = (100 - availability)% of the year
    printf "%s%% -> %.2f min/ano\n", disp[i], (100 - disp[i]) / 100 * minutos_ano
  }
}'
```

Run with `sh "$LAB"/etapa-03/noves.sh`. Expected output:

```text
99.9% -> 525.60 min/ano
99.95% -> 262.80 min/ano
99.99% -> 52.56 min/ano
99.999% -> 5.26 min/ano
```

The last value confirms the material's calculation (5.26 minutes). Note how each nine cuts the allowed time by ten.

**Part B: composite availability (the professor's math, it is not in the material).** If your application depends on two components in **series** (one depends on the other) with 99.9% each, the joint availability is the product: 0.999 x 0.999 = 0.998001, that is, 99.8001%. Worse than each one alone. If two identical components are in **parallel** (redundant in two zones), the system only goes down when **both** go down: 1 - (0.001 x 0.001) = 0.999999, or 99.9999%. This calculation assumes **independent** failures; zones that share something (the same region, the same bad deploy) violate the assumption. It is a model, not a guarantee.

**Cockpit perspective:** series is the car itself: power unit, gearbox, hydraulics, and electronics in a chain; if any one fails, the car stops. That is why the whole car is less reliable than each component alone. Parallel is the team with two cars. In Sepang, George Russell's car stopped on the straight during the last safety car, and Mercedes still scored strongly, because Kimi Antonelli finished second. For the team to score zero, both would have to stop. Now the independence assumption: in the same race, Ferrari started on slick tires on both cars, and both dropped together in the first laps. Two cars, one decision: redundancy does not protect against the failure that both share. Two zones that receive the same bad deploy are the two red cars at the start in Sepang. **Here the analogy stops:** the team adds up the points of the two cars, so a single car alone does not deliver "the whole team"; in a redundant system, one instance standing serves the whole service.

**Part C: a real breaker.** Create `$LAB/etapa-03/disjuntor.py`:

```python
import time


class Disjuntor:
    def __init__(self, limite=3, espera=2.0):
        self.limite = limite          # how many consecutive failures open the breaker
        self.espera = espera          # seconds open before accepting a new attempt
        self.falhas = 0               # counter of consecutive failures
        self.aberto_em = None         # instant it opened (None = closed)

    def chamar(self, funcao):
        if self.aberto_em is not None:                       # breaker open?
            if time.time() - self.aberto_em < self.espera:   # still within the wait time
                return "ABERTO: nem tentei"                  # fails fast, without overloading the service
            self.aberto_em = None                            # time is up: lets ONE attempt through
        try:
            resultado = funcao()                             # calls the remote service
            self.falhas = 0                                  # success resets the counter
            return f"ok: {resultado}"
        except Exception:
            self.falhas += 1                                 # one more consecutive failure
            if self.falhas >= self.limite:
                self.aberto_em = time.time()                 # opens the breaker
            return f"falhou ({self.falhas})"


servico_ok = False                                           # simulates the remote service being down


def remoto():
    if not servico_ok:
        raise RuntimeError("fora do ar")
    return "200"


d = Disjuntor()
for i in range(6):
    print(i, d.chamar(remoto))
time.sleep(2.1)                                              # waits for the breaker to accept a new attempt
servico_ok = True                                            # the service recovers
print("depois da espera:", d.chamar(remoto))
```

Run and observe:

```sh
python3 "$LAB"/etapa-03/disjuntor.py
```

Expected output:

```text
0 falhou (1)
1 falhou (2)
2 falhou (3)
3 ABERTO: nem tentei
4 ABERTO: nem tentei
5 ABERTO: nem tentei
depois da espera: ok: 200
```

Three failures opened the breaker; calls 3 to 5 did not even reach the service (this is the "fail fast" that avoids a cascade); after the time passed, one attempt went through, it worked, and the circuit went back to normal.

**Cockpit perspective:** calls 3 to 5 are the laps with the system shut down: the driver does not even try to use it, and the car goes on without risking the cascade. The "depois da espera" is the reactivation attempt requested by the engineer: a single one, and it worked.

### Hands-on

*Timed pit stop! Change the breaker's limit and wait time and write down the output before running: getting the prediction wrong here is cheap, getting it wrong in production is not. Then, the zones of a region, straight from each circuit.*

**1.** Run the two scripts above and check the outputs:

```sh
sh "$LAB"/etapa-03/noves.sh
python3 "$LAB"/etapa-03/disjuntor.py
```

Then, in `disjuntor.py`, replace the line `d = Disjuntor()` with `d = Disjuntor(limite=2, espera=5)` and predict the output **before** running. Do not touch the `time.sleep(2.1)`.

Answer key (real output with the change):

```text
0 falhou (1)
1 falhou (2)
2 ABERTO: nem tentei
3 ABERTO: nem tentei
4 ABERTO: nem tentei
5 ABERTO: nem tentei
depois da espera: ABERTO: nem tentei
```

With `limite=2`, two failures already open the breaker, and calls 2 to 5 fail fast. The last line is still `ABERTO`, and that is not a defect: the script waits only 2.1 seconds, less than the 5 seconds of `espera`, so the breaker does not yet accept the new attempt, even with the service recovered. To see the `ok: 200`, also change the `time.sleep(2.1)` to `time.sleep(5.1)`.

**2. List the zones of a region (read-only).**

AWS (`describe-availability-zones` queries the region's zones; we show name, stable ID, and state):

```sh
aws ec2 describe-availability-zones --region sa-east-1 \
  --query "AvailabilityZones[].[ZoneName,ZoneId,State]" --output text
```

Expected output (illustrative; the letter to ID mapping may differ in your account):

```text
sa-east-1a	sae1-az1	available
sa-east-1b	sae1-az2	available
sa-east-1c	sae1-az3	available
```

Azure (lists VM SKUs that support zones in the region; if the region **has no** zones, the list comes back empty, and that is already the information; `head` limits the output; if your version of `az` complains about the parameter, check `az vm list-skus --help`):

```sh
az vm list-skus --location brazilsouth --zone --resource-type virtualMachines --output table | head -n 5
```

Expected output (illustrative): columns such as `ResourceType`, `Locations`, `Name`, `Zones`, and `Restrictions`, with `Zones` showing something like `1,2,3`.

**3. Describe what already exists in compute (read-only; a new account returns empty):**

```sh
aws ec2 describe-instances \
  --query "Reservations[].Instances[].[InstanceId,InstanceType,State.Name]" --output table
az vm list --output table
```

### Exercises

*Flying lap! Five questions, with the math of nines and of series along the way. Calculator allowed, cheating not.*

1. **Region or zone?** One application needs to stay up if an entire data center loses power; another needs to stay up if an entire city is isolated. Which scope does each require? *Expected answer:* the first, multiple zones in the same region; the second, multiple regions.
2. **The math of the nines.** A monthly 99.9% SLA (30 days) allows how many minutes of unavailability? *Expected answer:* the month has 30 x 24 x 60 = 43,200 minutes; 0.1% of that (100% minus 99.9%) is 43,200 x 0.001 = 43.2 minutes per month.
3. **Series or parallel?** Three components in series with 99.9% each: approximate availability? *Expected answer:* 0.999 x 0.999 x 0.999 = 0.997003, or about 99.70%.
4. **SLO or SLA?** "Our API will have 99.95% monthly availability" is an internal commitment; "the service will be available 99.9% of the time, with a financial credit in case of failure" is a commitment to the customer. Which is which? *Expected answer:* the first is an SLO (internal target, stricter); the second is an SLA (formal promise, more conservative, with a margin).
5. **Retry or Circuit Breaker?** The payment service has been down for 5 minutes and your order service keeps calling it. Which pattern helps and why? *Expected answer:* Circuit Breaker. The failure is persistent; retry only increases the load and may cause a cascading failure.

### Remember this

> Zones protect you from data center failures, regions protect from geographic failures, the edge brings you closer to the user, and each nine of availability has to justify what it costs.

*Sector 3 in green, and it was the toughest stretch! A zone protects from the building, a region protects from the city, and each nine has to pay for what it costs. Resilience is keeping going even when degraded: at Silverstone, in 2020, Lewis Hamilton had a puncture on the last lap and won by crossing the line on three wheels. Now the track opens onto a decision straight: which circuit to operate on, and by what criteria. Stage 04.*

---

## Stage 04: Main Cloud Providers

*Fourth sector, and the danger here is not technical: it is cheering for a side. Comparing providers is comparing two circuits where the same team can operate, with criteria and weights agreed before the start. Whoever chooses with the heart pays at the exit, and the sector gives that bill a name: lock-in.*

### The problem

The board decides to migrate to the cloud and asks: "Which provider?". The worst answer is "the one I already know" or "the one in fashion". Does the company have Active Directory and Microsoft 365? Does it have a data team that lives on SQL and BI? Does it need a region in Brazil by law? Does lock-in scare it? Without a **comparison method**, the decision becomes cheering. Without understanding **lock-in**, the decision becomes a prison.

**Cockpit perspective:** before this stage, the rule of the map: AWS and Azure are **circuits**, not teams. Comparing providers here is comparing facilities, rules, and costs of two places where your team can operate, and never choosing whom to cheer for. The answer "the one I already know" is that of the engineer who takes to every circuit the set-up that worked at the previous one: sometimes right, but by luck.

### The concept

**Who the big ones are.** The market is dominated by AWS, Microsoft Azure, Google Cloud Platform (GCP), and Oracle Cloud Infrastructure (OCI). The material describes each one:

- **AWS:** leader, with more than 200 services. Core portfolio: EC2 and Lambda (compute), S3 and EBS (storage), Aurora and DynamoDB (database), VPC and CloudFront (network and delivery). A broad ecosystem, which works as a *one-stop-shop* and creates "gravity" (makes leaving harder). Requires learning the platform and dealing with complex pricing.
- **Azure:** second largest. Strong integration with the Microsoft ecosystem (Windows Server, Active Directory, Office 365), hybrid vocation (Azure Arc), and AI (Azure AI Foundry, Azure Machine Learning, Azure OpenAI Service). Data: Cosmos DB, Azure SQL, Microsoft Fabric. Compute: VMs, Azure Functions, AKS. Identity: Microsoft Entra ID (formerly Azure AD). Security: Microsoft Defender for Cloud.
- **GCP:** positioned in data, AI, and global network. Compute Engine, GKE, Cloud Storage, Cloud SQL, Spanner, BigQuery, Vertex AI, Cloud Run, Pub/Sub.
- **OCI:** second-generation cloud, focused on high performance, enterprise workloads, and Oracle applications, with autonomous services and integrated security.

**Market share (material, ref. jun/2025, not comparable with each other):** AWS about 33% in early 2023; Azure 23% at the end of 2022; GCP about 10% in Q1 2022 and 2023; together, AWS, Azure, and GCP accounted for 64% of global cloud spending in Q4 2024. Note that **the dates differ**: do not add or compare the first three as if they were a single snapshot. AWS's infrastructure, according to the material, totaled 114 AZs in 36 regions at the time. Numbers age fast; check each provider's official global infrastructure page when you need the current figure.

**Comparison methodology (six criteria from the material):**

1. IaaS, PaaS, and SaaS offerings (breadth and depth).
2. Regions and AZs (geographic presence, latency, data residency, resilience).
3. Pricing and TCO (pay per use, discounts, spot instances; complexity).
4. SLAs and support.
5. Compliance and certifications (ISO 27001, HIPAA, PCI DSS, GDPR).
6. Management tools (console, API, CLI, automation).

**Cockpit perspective:** the six criteria are what a team would evaluate in the facilities of a place where it will operate: what the garage offers ready-made (1), where the sites are and how close they are to whoever matters (2), how much it costs and how it is billed (3), what guarantees and support the place gives (4), what rules and certifications it meets (5), and what tools the team operates with there (6).

**The two fields, side by side: the portfolio map** *(professor's addition; pairs already seen in earlier stages are summarized and the new ones appear here)*:

| Category | AWS | Azure | What really changes |
|---|---|---|---|
| VM | EC2 | Azure Virtual Machines | Stage 02 |
| FaaS | Lambda | Azure Functions | Stage 02 |
| Web PaaS | Elastic Beanstalk | Azure App Service | Stage 02 |
| Managed Kubernetes | Amazon EKS | Azure Kubernetes Service (AKS) | Both manage the Kubernetes control plane; integration with network, identity, and load balancers follows each one's ecosystem. The material cites AKS and GKE; the EKS pairing is the professor's |
| Objects | S3 | Blob Storage | Stage 05 |
| Block | EBS | Managed Disks | Stage 02 |
| Relational database | Aurora and RDS | Azure SQL Database; Azure Database for PostgreSQL and MySQL | Stage 05 |
| NoSQL | DynamoDB | Cosmos DB | Stage 05 |
| Data warehouse | Redshift | Azure Synapse Analytics and Microsoft Fabric | Fabric (which the material cites) is Microsoft's unified data platform; Synapse is the more traditional data warehouse service. Check which one Microsoft recommends for new projects |
| In-memory cache | ElastiCache | Azure Cache for Redis | Azure's Redis service is going through a product transition to a successor offering; check the current name. ElastiCache also offers other engines (Valkey, Memcached) |
| Generative AI (approximate) | Amazon Bedrock | Azure AI Foundry and Azure OpenAI Service | **Approximate** pairing: the material cites Bedrock (Data Automation) and Azure's AI stack, but the model catalogs and the access mode differ; compare model by model |
| Virtual network | VPC | VNet | Stage 05 (scope differs) |
| CDN and global entry | CloudFront | Azure Front Door and CDN | Stage 05 |
| IaC | CloudFormation | ARM templates and Bicep | Stage 05 |
| Monitoring | CloudWatch | Azure Monitor | Stage 06 |
| Hybrid | Outposts | Azure Stack and Arc | Stage 01 |
| Identity | IAM | Microsoft Entra ID and Azure RBAC | Stage 06 |
| Cost | Cost Management and Trusted Advisor | Microsoft Cost Management and Azure Advisor | Stage 06 |

**The comparison, honestly.** The material states that AWS has greater variety and depth, that Azure is robust in all categories with Microsoft integration (PaaS such as App Service and Functions very competitive), and that AWS and Azure have the largest compliance libraries. On tools, it highlights CloudFormation and CloudWatch on AWS and Arc and DevOps on Azure. These are **assessments from the material**; they depend on the time and on your use case, and the real choice depends on existing ecosystem, compliance, budget, and innovation priorities.

**Multicloud and vendor lock-in.** The material cites that, in 2022, 89% of organizations used more than one cloud and only 9% used a single public cloud (ref. jun/2025). Reasons: the best services from each, resilience without a single provider point of failure, risk mitigation, cost optimization, compliance, and **avoiding lock-in**. Challenges: management complexity, consistent security, integration, **hidden costs** (such as data transfer between providers), and lack of qualified people.

**Vendor lock-in** is the dependence that makes switching prohibitively expensive or complex. Consequences: drop in quality, price increases, loss of negotiating power, expensive upgrades, complex data conversion, and reduced innovation. Mitigation: evaluate with a **proof of concept**, maintain **data portability** (non-proprietary formats), keep **your own backups** (they also protect against ransomware), and consider multicloud or hybrid. An honest trade-off: using only the "common minimum" to avoid lock-in wastes what each platform has best, and multicloud has its own operational cost.

**Cockpit perspective:** lock-in is the team that builds all its garage equipment (supports, power connectors, benches, telemetry cables) to fit only one circuit's facilities. While it stays, everything works; on the day it wants to operate somewhere else, it has to remake the parts that do not fit and relearn the facilities. Portability is using standard fittings, which work at any circuit (data in open formats, your own backups). And the material's trade-off holds on the track: the team that only uses what exists at every circuit wastes what each one has best. **Here the analogy stops:** in F1, the calendar chooses the circuit and nobody is "stuck" to a racetrack; and a team does not operate at two circuits on the same Sunday. In the cloud, the choice is yours, leaving really costs a lot, and a company can operate on both providers in the same minute (multicloud).

**Trends (material, ref. jun/2025):** public cloud spending above US$ 700 billion projected for 2025; Gartner projected 90% of companies on hybrid cloud by 2027; also cited: supercloud (an abstraction layer over several clouds), quantum computing in the cloud, and generative AI.

### Commented example: the decision matrix

One way to take emotion out of the comparison is a **weighted matrix**: criteria, weights (adding up to 100), and scores from 1 to 5. The numbers below are **fictitious**, of "Option 1" and "Option 2", and **are not an assessment of any real provider**. Create `$LAB/etapa-04/matriz.sh`:

```sh
awk 'BEGIN {
  # criteria, in order: existing ecosystem, cost, compliance, tools, regions
  split("30 25 20 15 10", peso, " ")     # weights (add up to 100)
  split("5 3 4 3 4", op1, " ")           # fictitious scores for Option 1
  split("3 4 4 4 5", op2, " ")           # fictitious scores for Option 2
  for (i = 1; i <= 5; i++) {
    soma1 += peso[i] * op1[i]            # weighted sum for Option 1
    soma2 += peso[i] * op2[i]            # weighted sum for Option 2
  }
  printf "opcao 1: %.2f | opcao 2: %.2f\n", soma1 / 100, soma2 / 100
}'
```

Run:

```sh
sh "$LAB"/etapa-04/matriz.sh
```

Expected output:

```text
opcao 1: 3.90 | opcao 2: 3.80
```

Now, in `matriz.sh`, change the text `"30 25 20 15 10"` on the weights line to `"10 35 20 15 20"` (less weight on ecosystem, more on cost and regions) and run again with `sh "$LAB"/etapa-04/matriz.sh`:

```text
opcao 1: 3.60 | opcao 2: 4.10
```

The winner **reversed** without any score changing. The lesson: whoever defines the weights defines the result, which is why the weights need to be agreed with the business before scoring.

**Cockpit perspective:** this is the calculation every engineer makes when preparing the set-up for a circuit. The available parts are the same; what changes is the weight of each criterion. In Singapore, where the grid goes on October 9 to 11, 2026, a street circuit full of slow corners, downforce (the force of the wings that presses the car onto the ground in corners and slows it on the straight) weighs more than straight-line speed; on a high-speed track the weight reverses, and the same wing becomes the wrong choice. That is why the weights are agreed before scoring: with the business, in the company; with strategy and engineering, in the team.

### Hands-on

*Set-up adjustment in the garage! You change the matrix weights for two scenarios, count each circuit's sites, and take an honest inventory of what leaving would cost.*

**1.** Run the matrix with the two sets of weights. Then invent your own weights for the scenario "company that already uses Active Directory and Microsoft 365" and for the scenario "data startup with no legacy". Which criteria go up?

**2. Compare the regions of the two clouds (read-only).** Run the region commands from Stage 01 and count each one's regions:

```sh
aws ec2 describe-regions --query "length(Regions)"
az account list-locations --query "length([?metadata.regionType=='Physical'])"
```

Each command prints an integer. Important observation: the number of **regions** is not the number of **AZs** (the material's "114 AZs in 36 regions" counts AZs). Counting regions does not measure resilience.

**3. Make your "lock-in inventory" (paper).** List five services your project uses or would use and mark, for each one, whether an equivalent exists at another provider, whether the data format is open, and how much it would cost to leave (in time and money).

### Exercises

*Flying lap! Four questions, and the third is a number trap: read the dates before adding anything up.*

1. **Which criterion weighs most?** A hospital needs to keep medical records in the country and already uses Active Directory. Which criteria of the methodology dominate the decision? *Expected answer:* compliance and certifications, regions and AZs (data residency), and the existing ecosystem (identity). Cost comes after.
2. **Lock-in.** Name two mitigation practices from the material. *Expected answer:* evaluate with a proof of concept; maintain data portability in non-proprietary formats; your own backups; multicloud or hybrid (two are enough).
3. **Number trap.** Someone states "AWS has 33%, Azure 23%, and GCP 10%, so together they have 66%". What is wrong? *Expected answer:* the numbers have different reference dates (early 2023, end of 2022, Q1 2022 and 2023); they do not form a single snapshot and do not add up validly.
4. **Approximate pair.** Why is "Amazon Bedrock x Azure AI Foundry" an approximate pairing and not an exact one? *Expected answer:* because the model catalogs, the access mode, and the scope of the services differ; it only serves as a starting point for the comparison.

### Remember this

> Choose the provider with criteria and weights agreed with the business, and treat lock-in as a cost you decide to pay with eyes open.

*Sector 4 in green! A provider is chosen with method, an agreed weight, and lock-in accepted with eyes open. Time to build the operation inside the chosen circuit: storage, databases, load balancers, and the network drawn before it exists. Stage 05, the heavy engineering.*

---

## Stage 05: Cloud Architecture Elements

*Fifth sector, the one with the most parts! Object, block, and file; SQL, NoSQL, and data warehouse; layer 4 and layer 7; CDN; and the team's reserved area divided into subnets. Each question has its own block, and swapping one for another costs track time.*

### The problem

Your store goes live. Where do the product photos go (millions of files)? Where does the orders database live (transactions that cannot be lost)? Who prevents the database from being accessed from the Internet? How do you distribute 50,000 simultaneous requests among ten servers? Each question calls for a different building block, and choosing the wrong block costs dearly (money, performance, or security). This stage is the catalog of the blocks and of when to use each one.

**Cockpit perspective:** assembling the architecture is assembling the team's operation at a circuit: where to keep thousands of parts and files, where the official record that cannot be wrong lives, who can enter each room, how to distribute the work among the cars. Each question has its solution, and swapping one for another costs track time.

### The concept

**Compute: VMs, containers, and functions.** The evolution reflects more abstraction. **VMs:** virtual instances with a dedicated OS and resources, granular control. **Containers:** package an application and its dependencies into a lightweight, portable unit that runs the same on the laptop and in the cloud, the basis of microservices. **Serverless functions:** the provider takes care of provisioning, scaling, and patches; it charges for execution time (see Stage 02 for the AWS x Azure pairs).

**Storage: object, block, and file.** There is no single solution; the choice affects performance, scale, cost, and complexity.

- **Object:** data in isolated objects with a unique identifier and metadata, in a "flat" structure (no real folders). Scales almost without limit and costs little per volume; good for videos, images, backups, logs, AI data. An object is **not modified in part**: to change it, you recreate and resend it; that is why it is bad for transactional data with frequent changes.
- **Block:** fixed-size blocks read and written individually, with low latency and high performance; for databases and VM disks. Modifying a block is efficient. You are charged for the allocated space, used or not.
- **File:** a hierarchy of folders and files, intuitive, good for sharing and collaboration; limited scale and performance that drops with volume.

**Cockpit perspective:** **object** storage is the depot of labeled parts: each part has a unique code and a record, and nobody modifies half a carbon fiber part; to change it, a new revision is made and takes the place of the previous one. **Block** is the car's on-board memory: tied to one car (and to the pavilion where it is), fast, writing and rewriting small chunks all the time. **File** is the garage's shared folder, where engineers open and edit the same set-up spreadsheets: comfortable for collaborating, but not made for millions of items. **Here the analogy stops:** a physical part exists in one unit; an object can have copies in several zones and regions without anyone noticing the difference.

*(professor's addition in the AWS and Azure columns; the material compares the three types without pairing services)*

| Type | Analogy | AWS | Azure | What really changes |
|---|---|---|---|---|
| Object | Storage cabinet with labels | Amazon S3 | Azure Blob Storage | In both, access by HTTP API and organization in "buckets" (S3) or "containers" (Blob, inside a storage account). On Azure, the **storage account** is the unit that aggregates redundancy and other data types; on AWS, the bucket is the unit |
| Block | A computer's hard drive | Amazon EBS | Azure Managed Disks | Attached to a VM. On AWS, the volume belongs to one AZ; on Azure, the disk can be zonal or have zone redundancy, depending on the type |
| File | Shared network folder | Amazon EFS *(not cited in the material)* | Azure Files *(idem)* | File sharing over a network protocol. Check the protocols (NFS, SMB) supported by each for your operating system |

**Storage redundancy.** The material cites that services with **zone redundancy (ZRS)** replicate data automatically across AZs. On Azure, redundancy is an **explicit choice at creation** of the storage account (with acronyms such as LRS, ZRS, GRS), and the price follows. On AWS, standard S3 already replicates across zones by design; cross-region replication is a separate configuration.

**Virtual networks.** A **VPC** (AWS) or **VNet** (Azure) is your private network inside the cloud: an isolated IP address space where VMs, load balancers, and databases talk.

- **Subnets:** slices of the address space (CIDR blocks) where resources are deployed.
- **Routing:** route tables decide the path of packets.
- **Gateways:** entry and exit points (Internet, VPN, dedicated connection).
- **Peering:** connects two virtual networks.

**Analogy.** The VPC is the lot of a condominium; the subnets are the streets; the gateways are the gatehouses; the routing is the map that says through which gatehouse each car leaves.

**Cockpit perspective:** at the circuit, the VPC (or VNet) is the team's reserved area: a fenced space where only those the team authorizes circulate. The subnets are the sectors inside it: the front facing the pit lane (exposed, which the cameras see), the engineering office at the back (no door to the street), and the data room (no exit at all). The gateways are the gates; the routing is the map of where each one leaves. In the same idea, NAT is the press officer: the team talks to the world through them, but nobody from outside enters through them. And peering is the cable that connects the team's area to another area of theirs, such as the area at the circuit to the remote operations room.

**Attention to scope, the trickiest point.** The material describes Google Cloud (**global** VPC, **regional** subnets). On AWS and Azure it is different:

*(professor's addition; the material describes the Google Cloud model)*

| Concept | AWS | Azure | What really changes |
|---|---|---|---|
| Virtual network | VPC (**regional** scope) | VNet (**regional** scope) | In both, the network lives in **one** region. Unlike the material's Google Cloud, where it is global |
| Subnet | Tied to **one AZ** | **Not** zonal: spans the region (and its zones) | On AWS, to have resources in 2 AZs you create at least **2 subnets**. On Azure, a subnet can have VMs in different zones. The addressing design changes because of this (see the exercise) |
| Exit to the Internet | Internet Gateway and "public" subnet (route to the gateway) | There is no "Internet Gateway": access depends on public IP, load balancer, or NAT | "Public" and "private" on AWS is a matter of the subnet's **route**. On Azure, control comes from public IP, security rules, and NAT. Professor's addition: Microsoft announced the retirement of *default outbound access* (the exit to the Internet that VMs without a public IP received without configuring anything) and began creating private subnets by default; do not count on this implicit exit and check the current state and dates in the documentation |
| NAT | NAT Gateway (lives in a public subnet, one per AZ is usually good practice) | NAT Gateway (associated with the source subnet) | Same name, different deployment |
| Network interface | Elastic Network Interface (ENI) | Network Interface (NIC) | Where the instance firewall is attached (Stage 06) |
| Peering | VPC Peering | VNet Peering | Connects two networks; the CIDR blocks **cannot overlap** (this guide's exercise shows the math) |
| Hub for several networks | Transit Gateway | Virtual WAN | Stage 06 |
| Special subnets | There are no equivalent reserved names | `GatewaySubnet` (VPN Gateway) and `AzureFirewallSubnet` (Azure Firewall) | On Azure, some services require a subnet with a **fixed name**; plan the CIDR already counting on them |

**Cockpit perspective:** the difference in subnet scope, in pavilion terms: on AWS, each sector is tied to one pavilion (zone); if the team wants cars in two pavilions, it needs two sectors, one in each. On Azure, the sector is designed for the whole site and can have cars in different pavilions. They are two circuits with different floor-plan rules, and whoever draws the plan before assembling the structure is not surprised.

**Reserved addresses.** In both providers, each subnet reserves five addresses for platform use; so a `/24` subnet (256 addresses) has 251 usable. The subnet size limits vary; check the documentation.

**Managed databases.** "Managed" means the provider takes care of provisioning, patches, backup, and scaling. The choice depends on the data model, the access pattern, and the scale.

- **SQL (relational):** tables with a schema, relationships, and **ACID** consistency (Atomicity, Consistency, Isolation, Durability). For transactions and integrity.
- **NoSQL:** flexible formats, horizontal scaling, often with **eventual consistency**. Types: documents, key-value, columns, graphs, and in-memory.
- **Data warehouse:** large-scale analysis over large volumes.
- **Vector:** stores and queries *embeddings* (numeric representations of text or images) for generative AI and similarity search.

**Cockpit perspective:** the **relational** database is the official classification: a lap counts or does not count, a time is valid or is voided, and everybody sees the same result. It is the ACID of timing. **NoSQL** with eventual consistency is the live timing screen of an app: fast, flexible, sometimes an instant behind what happened on the track, but it converges. The **data warehouse** is the archive of whole seasons that the team consults to study a circuit before arriving. The **vector** one is searching for "laps similar to this one" by the shape of the whole lap, not by an exact field.

*(professor's addition; the material cites Azure SQL and Cosmos DB)*

| Type | AWS | Azure | What really changes |
|---|---|---|---|
| Managed relational | Amazon RDS (several engines) and Aurora | Azure SQL Database; Azure Database for PostgreSQL and MySQL | Aurora is AWS's own engine, compatible with MySQL and PostgreSQL, with **no exact counterpart** on Azure. Azure SQL Database is SQL Server as a service (RDS also runs SQL Server). Check the high availability and billing model of each offering |
| NoSQL | DynamoDB | Azure Cosmos DB | DynamoDB is key-value and document, with its own API. Cosmos DB is multi-model, with several APIs (including ones compatible with other databases), and offers adjustable consistency levels. **Billing** also differs in model (capacity measured in units specific to each) |
| Cache (in-memory key-value) | ElastiCache | Azure Cache for Redis | Very low latency; see the note on the product transition in Stage 04 |
| Data warehouse | Redshift | Synapse and Fabric | See Stage 04 |

**Load balancing.** Distributes traffic among instances to maximize throughput, minimize response time, and avoid a single point of failure.

- **Layer 4 (network):** decides by TCP, UDP, etc. It is fast and simple, good for raw traffic (database connections, games).
- **Layer 7 (application):** decides by HTTP content (path, header, cookie), essential for microservices and APIs, and does SSL termination (the load balancer decrypts the HTTPS and talks to the servers behind it, which do not need to take care of the certificate).
- **Static algorithms:** *round-robin* (in sequence) and *IP hash* (same client, same server).
- **Dynamic algorithms:** *least connections* (and the weighted version), *least response time*, and *resource-based* (CPU and memory measured by agents).

**Cockpit perspective:** on our map, the load balancer is still the pit lane entry control, and the algorithms are its criteria for choosing the destination of each request. Round-robin is alternating: one for each, in sequence. IP hash is "this request always goes to the same car". Least connections is sending to whoever is least busy right now; least response time is sending to whoever has the strongest pace at the moment; resource-based is looking at the telemetry (CPU and memory play the role of temperature and wear) before deciding.

The AWS x Azure pairs (ALB x Application Gateway, NLB x Azure Load Balancer) are in Stage 03. To balance **across regions** at the entry of the web application, Azure's service is Front Door (see below).

**Managed services.** The provider takes on management, maintenance, and operation (configuration, patches, security, monitoring, scaling). Advantages: savings through usage, scale, security, availability, and focus on the business. It represents the shift from CapEx to OpEx. Serverless is the extreme case.

**Design for performance: caching and CDN.** **Caching** keeps copies in a faster place: in the browser, in DNS, in memory on the server. A **CDN** is a global network of servers that caches content close to users. **Cache hit:** the content is in the CDN and goes out at once. **Cache miss:** the CDN fetches from the origin and keeps a copy for the next ones.

**Cockpit perspective:** the CDN is the logistics of the rounds far from Europe. A good part of the non-urgent material travels by ship, ahead of time, and when the team arrives it is already near the track. The points of presence are those forward depots. A **cache hit** is the part that is already in the local material: it goes out at once. A **cache miss** is the part that is not there: it comes from the factory (the origin), by plane, more slowly, and from then on it stays at hand for next times. **Here the analogy stops:** a cached copy is identical to the origin at the moment it was made, and the problem is that it ages (which is why there is an expiry date); a part shipped by sea weeks earlier may also be from a revision prior to the one the factory has just approved. It is the same stale content problem, only in carbon fiber and with one difference: the digital copy is remade in seconds.

*(professor's addition; the material explains CDN with the Google Cloud example, without pairing services)*

| Concept | AWS | Azure | What really changes |
|---|---|---|---|
| CDN | Amazon CloudFront | Azure Front Door and Azure CDN | **They differ in scope.** CloudFront is mainly a CDN. Front Door joins, in a **global** web entry service, CDN, layer 7 load balancing across regions, and WAF. On AWS, global load balancing and the web firewall are separate services that you combine |
| Web firewall | AWS WAF | Azure Web Application Firewall (WAF) | On AWS, WAF is a service that attaches to CloudFront, the ALB, and others. On Azure, WAF is a policy that attaches to Application Gateway or Front Door |

**Design for scalability and HA.** Scale **horizontally** in the cloud (more instances, no practical ceiling) and use vertical with awareness of the limits. For HA: redundancy, automatic failover, and distribution across several locations; **AZs** (physically and logically separate data centers in the region, with independent power, cooling, and network) protect against the failure of one data center. Taking advantage of the cloud requires a **distributed mindset** and re-architecting the application, not just *lift-and-shift*.

**Outposts (AWS) and Azure Stack and Arc.** For low latency or data residency at your site, Outposts extends AWS infrastructure and services to your data center. Shared responsibility: AWS manages the Outpost infrastructure; you ensure power, cooling, and local network. The differences from Azure are in the Stage 01 table.

**Well-Architected Frameworks: the pillars.**

| Pillar (material) | What it covers |
|---|---|
| Operational Excellence | Running and monitoring systems to deliver value and continuously improve |
| Security | Protection of data, systems, and assets |
| Reliability | Working as expected and recovering from failures |
| Performance Efficiency | Efficient use of resources according to demand |
| Cost Optimization | Maximizing value at the lowest cost |
| Sustainability (pillar added by AWS) | Reducing environmental impact |

*(professor's addition; the material cites the AWS and Azure frameworks without comparing them)*

| Concept | AWS | Azure | What really changes |
|---|---|---|---|
| Best-practices framework | AWS Well-Architected Framework | Azure Well-Architected Framework | Same intention and a good part of the pillars in common. AWS adopted Sustainability as the **sixth** pillar. The Azure framework is described with **five** pillars (reliability, security, cost optimization, operational excellence, and performance efficiency); sustainability is treated within the design guidance, and not as a separate pillar. Check the current structure in the documentation |

**Cockpit perspective:** the pillars are the design commitment of a car. More downforce costs straight-line speed; more reliability usually costs weight; more performance costs money inside the cost cap. Nobody maximizes everything: you balance for the championship you want to win. A well-applied Well-Architected review asks the same question every time.

**Design for security.** *Secure by Design* (security from the start, not a patch later). Principle of **least privilege** (only the minimum permissions, for the minimum time). **Defense in depth** (overlapping layers: if one fails, the others protect). Others from OWASP: reduce attack surface, fail securely, **Zero Trust** ("never trust, always verify"). **Shift Left:** bring security into planning and design. We go deeper in Stage 06.

### Commented example: designing the network before creating it

*Attention, the race is heating up! A CIDR mistake is not fixed with a click after the network exists. Whoever does the math now, on paper, does not have to renumber anything later.*

Before clicking "create VPC", calculate the addresses. A CIDR error is costly to fix later (you cannot easily resize, and you cannot connect networks that overlap). Create `$LAB/etapa-05/cidr.py`:

```python
import ipaddress
import itertools

# Address space of the virtual network (VPC on AWS, VNet on Azure)
rede = ipaddress.ip_network("10.0.0.0/16")

# Plan: 3 tiers (publica, app, dados) x 2 zones (a, b) = 6 /24 subnets
plano = {
    "publica-a": "10.0.0.0/24",
    "publica-b": "10.0.1.0/24",
    "app-a": "10.0.10.0/24",
    "app-b": "10.0.11.0/24",
    "dados-a": "10.0.20.0/24",
    "dados-b": "10.0.21.0/24",
}

# Converts each text into a network object
subredes = {nome: ipaddress.ip_network(cidr) for nome, cidr in plano.items()}

for nome, sub in subredes.items():
    dentro = sub.subnet_of(rede)             # does the subnet fit inside the big network?
    utilizaveis = sub.num_addresses - 5      # 5 addresses reserved by the platform (AWS and Azure)
    print(nome, sub, "dentro=" + str(dentro), "utilizaveis=" + str(utilizaveis))

# Looks for pairs that overlap: the result should be an empty list
conflitos = [(a, b) for (a, ra), (b, rb) in itertools.combinations(subredes.items(), 2) if ra.overlaps(rb)]
print("conflitos:", conflitos)

# Peering or VPN test: can the network at the other end overlap with yours?
print("overlap com 192.168.0.0/16:", rede.overlaps(ipaddress.ip_network("192.168.0.0/16")))
print("overlap com 10.0.5.0/24:", rede.overlaps(ipaddress.ip_network("10.0.5.0/24")))
```

Expected output:

```text
publica-a 10.0.0.0/24 dentro=True utilizaveis=251
publica-b 10.0.1.0/24 dentro=True utilizaveis=251
app-a 10.0.10.0/24 dentro=True utilizaveis=251
app-b 10.0.11.0/24 dentro=True utilizaveis=251
dados-a 10.0.20.0/24 dentro=True utilizaveis=251
dados-b 10.0.21.0/24 dentro=True utilizaveis=251
conflitos: []
overlap com 192.168.0.0/16: False
overlap com 10.0.5.0/24: True
```

Interpretation: the plan is coherent (all inside the `/16`, none conflicts). Connecting this network to another one that uses `10.0.5.0/24` **would be impossible** (overlap). That is why companies keep a central registry of CIDRs before creating any network.

**Cockpit perspective:** CIDR overlap is two cars with the same number. In F1, each driver has a permanent, unique number precisely so that timing, stewards, and broadcast always know who is who; with two cars with the same number, nobody could assign a lap. The company's central CIDR registry is the FIA's number registry: you check before painting the car, not after. **Here the analogy stops:** the number identifies a single car; a CIDR block is a whole range of addresses, and the overlap can be partial (such as `10.0.5.0/24` inside `10.0.0.0/16`).

**The same design in two IaC languages (Infrastructure as Code).** IaC describes the infrastructure in a file and the platform creates it. On AWS, the service is **CloudFormation** (YAML or JSON); on Azure, **ARM templates** (JSON) and **Bicep** (a more readable language that compiles to ARM). *(Terraform works on both, but is not cited in the material.)*

`$LAB/etapa-05/vpc.yaml` (CloudFormation):

```yaml
AWSTemplateFormatVersion: "2010-09-09"   # template format version (fixed value)
Description: VPC de estudo                # free text
Resources:
  Vpc:                                    # logical name of the resource inside the template
    Type: AWS::EC2::VPC                   # resource type
    Properties:
      CidrBlock: 10.0.0.0/16              # address space of the VPC
      Tags:
        - Key: ambiente                   # governance tag (Stage 06)
          Value: teste
  SubredePublicaA:
    Type: AWS::EC2::Subnet                # subnet
    Properties:
      VpcId: !Ref Vpc                     # reference to the VPC above
      CidrBlock: 10.0.0.0/24
      AvailabilityZone: !Select [0, !GetAZs ""]   # the first AZ of the region where the stack is created
```

`$LAB/etapa-05/vnet.bicep` (Bicep):

```bicep
param localizacao string = resourceGroup().location   // parameter: region of the resource group

resource vnet 'Microsoft.Network/virtualNetworks@2023-11-01' = {   // type and API version
  name: 'vnet-loja'                                    // name of the VNet
  location: localizacao
  tags: {
    ambiente: 'teste'                                  // same governance tag
  }
  properties: {
    addressSpace: {
      addressPrefixes: ['10.0.0.0/16']                 // address space of the VNet
    }
    subnets: [
      {
        name: 'publica'                                // on Azure, one subnet per tier is enough
        properties: {
          addressPrefix: '10.0.0.0/24'
        }
      }
    ]
  }
}
```

Note the difference in modeling: on AWS, the subnet is a separate resource, tied to an AZ; on Azure, it is a property of the VNet and is not zonal.

**Cockpit perspective:** the difference in floor plan shows up in the file itself: on AWS, each sector is a separate piece of the sheet, tied to a pavilion; on Azure, the sector is an item inside the sheet of the whole area.

### Hands-on

*Stopwatch on! Run the address plan, validate the two IaC files without creating anything, and check with your own eyes that, on AWS, each subnet has its own zone.*

**1.** Run `python3 "$LAB"/etapa-05/cidr.py` and check the output.

**2. Validate the IaC files without creating anything.**

Bicep (compiles locally to ARM; the first time the CLI may download Bicep; no login needed):

```sh
cd "$LAB"/etapa-05
az bicep build --file vnet.bicep      # generates vnet.json (the equivalent ARM template)
grep "Microsoft.Network" vnet.json    # looks for the resource type in the generated JSON
```

Expected output of the `grep`: a line containing `"type": "Microsoft.Network/virtualNetworks"`.

CloudFormation (`validate-template` only checks the syntax; requires configured credentials, but does **not create** the stack):

```sh
aws cloudformation validate-template --template-body "file://$LAB/etapa-05/vpc.yaml"
```

Expected output: a JSON similar to `{"Parameters": [], "Description": "VPC de estudo"}`.

> **Do not run** `aws cloudformation create-stack` or `az deployment ... create` in this guide: they **create resources** and may generate cost. The stage is for reading and validation.

**3. See the networks that already exist (read-only).**

AWS (a new account usually has a **default VPC** in each region, with a `172.31.0.0/16` block):

```sh
aws ec2 describe-vpcs --query "Vpcs[].[VpcId,CidrBlock,IsDefault]" --output text
```

Expected output (illustrative):

```text
vpc-0a1b2c3d4e5f67890	172.31.0.0/16	True
```

```sh
aws ec2 describe-subnets --query "Subnets[].[SubnetId,AvailabilityZone,CidrBlock]" --output text
```

This command shows **one subnet per AZ**, each with its zone: the practical proof that, on AWS, the subnet is zonal.

Azure (lists the VNets and subnets; on a new subscription the list comes back empty):

```sh
az network vnet list --output table
```

### Exercises

*Flying lap! Six exercises, the biggest block so far. The third one charges for the floor-plan difference between the two circuits: count the subnets before answering.*

1. **Which storage?** (a) Millions of product photos; (b) disk of the orders database; (c) shared folder of team documents. *Expected answer:* (a) object (S3 or Blob Storage); (b) block (EBS or Managed Disks); (c) file (EFS or Azure Files, the professor's pairs).
2. **Which database?** (a) Financial system with transfers between accounts; (b) shopping cart with millions of reads per second and a flexible schema; (c) 5-year sales analysis. *Expected answer:* (a) relational (ACID: RDS or Aurora; Azure SQL Database or Azure Database for PostgreSQL); (b) NoSQL (DynamoDB or Cosmos DB), possibly with an in-memory cache; (c) data warehouse (Redshift; Synapse or Fabric).
3. **Design the CIDR.** You need a `10.20.0.0/16` network with 3 tiers (publica, app, dados) in **3 zones**, `/24` subnets. How many subnets on AWS and how many on Azure? List a plan on AWS. *Expected answer:* on AWS, since the subnet is zonal, 3 tiers x 3 zones = 9 subnets (for example, publica-a/b/c in `10.20.0.0/24`, `10.20.1.0/24`, `10.20.2.0/24`; app in `10.20.10.0/24` to `10.20.12.0/24`; dados in `10.20.20.0/24` to `10.20.22.0/24`). On Azure, since the subnet is not zonal, 3 subnets (one per tier) are enough, with the VMs distributed across zones 1, 2, and 3. If there is a VPN Gateway, add the `GatewaySubnet`.
4. **Overlap.** Can two VPCs with `10.0.0.0/16` and `10.0.5.0/24` be connected by peering? *Expected answer:* no; the blocks overlap. One of them has to be renumbered first.
5. **Layer 4 or layer 7?** Route `/api` to one group of servers and `/imagens` to another. *Expected answer:* layer 7 (ALB on AWS, Application Gateway on Azure), because the decision depends on the HTTP path.
6. **How many pillars?** The material lists six Well-Architected pillars. How many does Azure describe? *Expected answer:* five; Sustainability was the sixth pillar added by AWS. Check the current documentation.

### Remember this

> Choose the block by the problem (object, block, or file; SQL or NoSQL; layer 4 or 7) and design the network addressing before creating anything, remembering that the subnet is zonal on AWS and is not on Azure.

*Sector 5 in green! The right block for each problem and addressing designed on paper, with the subnet zonal on AWS and regional on Azure. What is left is the straight that decides whether the operation is safe and fits the budget: credentials, keys, firewalls, labels, and the cost cap. Stage 06.*

---

## Stage 06: Security, Costs, and Best Practices

*Last sector! Security, cost, and governance, the three topics that usually are left for "later" and that here enter the project from the drawing board. Team information is worth gold: in 2007, McLaren was excluded from the constructors' championship and fined 100 million dollars for having Ferrari's technical data in hand. Credential, key, and label: let us close this race.*

### The problem

A developer spins up a test bucket with configuration open to the world and forgets it. Months later, it is discovered that customer data leaked. In the same month, the cloud bill triples because ten development VMs were left on weekend after weekend, and twenty orphan disks were never deleted. Nobody knows whose these resources are, because nobody tagged them. Three distinct problems (**security, cost, governance**) with the same origin: treating these topics as "later" and not as part of the design.

A fact from the material that hurts: **configuration errors**, which are the customer's responsibility, are among the most common causes of data breaches in the cloud.

**Cockpit perspective:** F1 knows operating errors well from the side of those who operate. At the 2018 Bahrain GP, Ferrari released Kimi Räikkönen's car from the pit stop unsafely, and a mechanic from the team itself came out with a broken leg; the stewards fined the team 50,000 euros. The track and the pit lane were in order: the failure was in the team's procedure. It is the picture from the material: in the cloud, a good part of the leaks is born from configuration, and configuration is the customer's responsibility.

### The concept

**Shared Responsibility Model (SRM).** The provider answers for security **of** the cloud (physical infrastructure, hardware, base software, network, and facilities). You answer for security **in** the cloud (data, network configuration, OS, applications, and IAM). The split changes with IaaS, PaaS, SaaS, and FaaS (matrix in Stage 02). Both providers adopt this model.

**Cockpit perspective:** shared responsibility is the natural agreement between circuit and team. The circuit answers for the security **of** the track: asphalt, barriers, track marshals, structure of the pits. The team answers for security **in** the car and in the garage: the car it builds, the set-up, who it lets in, the way it releases the car in the pit stop. In the empty garage (IaaS), the team's share is large; in the equipped garage (PaaS), it shrinks; but the list of who enters and what is stored is always its own.

**IAM: who accesses what.** IAM is the backbone of least privilege.

- **Authentication:** proving who you are. Reinforced by **MFA** (more than one factor) and **SSO** (authenticate once for several resources).
- **Authorization:** defining what you can do on which resources.
- **Identity federation:** using credentials from another system (corporate network, identity provider) without creating new logins.
- **Roles:** group permissions; whoever receives the role inherits the privileges.
- **Policies:** formal documents that say which actions are allowed on which resources.

**Cockpit perspective:** IAM is the paddock credentialing. **Authentication** is proving the credential is yours. **Authorization** is what it unlocks: paddock, garage, pit lane. **Roles** are the types of credential (mechanic, engineer, guest): whoever receives the type inherits its access. **Policies** are the table that says which type enters where. **Federation** is accepting the identity issued by another trusted system instead of creating a new registration. And **least privilege** is the guest in the hospitality area not having access to the pit lane just because they "might need it". On Azure, who you are (Entra ID) and what you can do (RBAC) live in different services, as if issuing the credential and the access table were separate counters; on AWS, IAM takes care of both inside the account.

*(professor's addition; the material cites Entra ID)*

| Concept | AWS | Azure | What really changes |
|---|---|---|---|
| Identity service | AWS IAM (users, groups, roles, policies); for the workforce, AWS IAM Identity Center (professor's addition) | Microsoft Entra ID (identities) + Azure RBAC (authorization over resources) | **The division of roles is different.** On Azure, Entra ID is the tenant's identity directory (including Microsoft 365) and RBAC decides who can do what on Azure resources. On AWS, IAM covers both things inside the account. Entra ID was called Azure AD (the material already records the change). Professor's addition: for single sign-on (SSO) and federation of employees across several accounts, the closest match to Entra ID on AWS is IAM Identity Center (formerly called AWS SSO); check the documentation |
| Permissions | Policies (JSON documents attached to users, groups, or roles) | Role assignments: a role, a target, and a scope | On Azure, the scope (management group, subscription, resource group, resource) is part of the assignment |
| MFA | MFA in IAM; supports the FIDO2 standard | MFA in Entra ID; supports the FIDO2 standard | Both support FIDO2 keys, the most phishing-resistant method cited in the material |

**MFA.** Requires a second or third factor: "something you know" (PIN), "something you have" (token, notification, code), and "something you are" (biometrics). MFA by SMS or code can be bypassed by phishing, social engineering, and interception; the material points to **FIDO2** as the most robust method (ref. jun/2025).

**Cockpit perspective:** a credential with a photo, checked at the entrance, already combines two factors: something you have (the badge) and something you are (the face). A password alone is a badge without a photo: whoever finds it, uses it. **Here the analogy stops:** the photo is checked by a person and can be fooled; a FIDO2 key does a cryptographic verification bound to the real site, which a fake site cannot reuse.

**Encryption.**

- **In transit (TLS/SSL):** protects data between client and server and between services: encrypts, authenticates the endpoints, and verifies integrity. The material shows the Google Cloud example, where even VM to VM traffic inside a VPC is encrypted. **That is a Google characteristic described in the material, not a general rule.** On AWS and Azure, do not assume: enable TLS in your application.
- **At rest (KMS):** encrypts stored data (common algorithm: AES), preventing use of the data if it leaks. Providers allow you to manage your own keys.
- **Key hierarchy (envelope encryption):** a **DEK** (data key) encrypts the data; a **KEK** (key encryption key) encrypts the DEK. The KEK stays in a controlled central repository. Rotating the KEK requires re-enveloping the DEKs, not re-encrypting all the data.

*(professor's addition; the material talks about KMS in a generic way and cites Google's Cloud KMS)*

| Concept | AWS | Azure | What really changes |
|---|---|---|---|
| Key management | AWS Key Management Service (KMS) | Azure Key Vault | Key Vault also stores **secrets and certificates** in the same service; on AWS those live in their own services. Both support the envelope encryption standard |

**Layered network security** (defense in depth). The material (AWS model) describes:

- **VPC:** an isolated segment; segmentation is the first line of defense. **Public** subnets (direct access to the Internet, such as load balancers), **private** (application and databases; they exit through NAT), and **protected** (no exit from the VPC, ideal for databases).
- **NACL (*Network ACL*):** a **stateless** firewall at the **subnet** level, with allow and deny rules processed **in numeric order**. The default NACL allows all traffic; custom NACLs deny everything by default.
- **Security Group:** a **stateful** firewall at the **network interface (ENI)** level. If the inbound is allowed, the response is automatically allowed. Custom group: all outbound allowed and no inbound by default.
- **AWS WAF:** web application firewall, blocks malicious traffic.
- **AWS Network Firewall:** managed perimeter firewall for VPCs, with inspection of all traffic, web filtering, and intrusion prevention.
- **VPN, Direct Connect, Client VPN, and Transit Gateway:** secure connections to on-premises and between networks.

**Stateful x stateless.** Stateful remembers connections: if you authorized the outbound, the return is released automatically. Stateless does not remember: you need to authorize outbound **and** return. Analogy: the doorman who recognizes the visitor who just came in (stateful) versus the one who checks the list at every passage (stateless).

**Cockpit perspective:** the Security Group is the guard next to the car, who saw you arrive and lets you leave without checking again (stateful). The NACL is the turnstile of the sector that checks the list on the way in **and** on the way out, in order, rule by rule (stateless). The first remembers the conversation; the second only reads the list.

*(professor's addition; the material describes the AWS model and cites NSGs)*

| Concept | AWS | Azure | What really changes |
|---|---|---|---|
| Instance firewall | Security Group (stateful, **allow rules only**) | Network Security Group (NSG) on the network interface (stateful) | The NSG accepts **allow and deny** rules, with **numeric priority** (lower number counts first); the Security Group only allows |
| Subnet firewall | NACL (**stateless**, allow and deny, numeric order) | NSG associated with the subnet (**stateful**) | **Important difference:** the position is the same (subnet), but the NACL is stateless and the NSG is stateful. On Azure, one resource type (the NSG) serves at both levels |
| Exit from the private network | NAT Gateway | NAT Gateway | Stage 05 |
| Web application firewall | AWS WAF | Azure WAF | Stage 05: attaches to different entry points |
| Managed network firewall | AWS Network Firewall | Azure Firewall | Both inspect traffic centrally. Azure Firewall is deployed in a dedicated subnet (`AzureFirewallSubnet`) in a VNet, generally in a "hub" |
| Site-to-site VPN | Site-to-Site VPN (Virtual Private Gateway and Customer Gateway) | VPN Gateway (Virtual Network Gateway and Local Network Gateway) | Same role, different names for the two ends |
| Remote user VPN | AWS Client VPN | VPN Gateway in point-to-site mode (Point-to-Site) | On Azure, point-to-site is a mode of the same gateway; on AWS, it is a separate service (Client VPN) |
| Dedicated connection | Direct Connect | ExpressRoute | Stage 01 |
| Network hub | Transit Gateway | Virtual WAN | Transit Gateway is a central regional router (hub and spokes) that you configure. Virtual WAN is a more managed offering that also integrates branch connectivity; check the scope of each |

**Reading order of a rule in the NSG (to fix it in mind):** the NSG has default rules that allow traffic inside the VNet and outbound traffic to the Internet, and deny the rest of the inbound; **your rule with a lower number counts before the default ones**. In the AWS Security Group, the equivalent is: nothing comes in unless you allow it.

**Cockpit perspective:** in the NSG, the rules are numbered and the one with the lower number counts first, like an access list in which the first line that matches decides. In the AWS Security Group there is only a list of those allowed: whoever is not on it does not enter.

**FinOps.** A collaborative practice among finance, engineering, and business to manage and optimize costs, with a culture of financial responsibility. The material also cites CapOps and RevOps as emerging terms (do not memorize them as industry standard).

**Cockpit perspective:** F1 has lived on FinOps since 2021, when the cost cap came into force. Engineering does not decide on a new part without knowing how much it consumes of the year's budget, and finance does not cut without understanding what each cut costs in performance. The two ends sit together, and knowing where each amount goes has become part of performance. **Here the analogy stops:** the cost cap is imposed from outside, with punishment set out in the regulations; FinOps is an internal practice, and nobody fines your bill apart from your own finance director.

**Optimization strategies (summary from the material):**

- **Storage:** delete unused snapshots and volumes (unattached EBS); retention lifecycle; appropriate tier.
- **Serverless:** computes only when needed, charges by duration.
- **Autoscaling and load balancing:** adds and removes servers according to load.
- **Spot or low-priority VMs:** idle capacity at a large discount, **may be interrupted** when demand arises.
- **Reservations and savings plans:** discounts for predictable load in exchange for a long commitment.
- **Egress and data transfer:** reduce movement between regions and zones; use CDN and cache.
- **Scheduling:** shut down what is not in use (e.g., development at night).
- **Right-sizing:** reduce oversized resources (e.g., usage from 0 to 20%).
- **Network:** remove unused load balancers and public IPs.
- **IaC:** infrastructure on demand, without keeping what is not needed.

**Cockpit perspective:** shutting down what is not in use is the easiest waste to find: equipment on at night, with nobody working. Orphan disks are manufactured parts that were never fitted, but keep taking up space and budget. Spot is taking advantage of a cheap window that can be canceled at any moment: it suits work that tolerates restarting. Right-sizing is stopping bringing the big tool to the circuit when the small one does the job.

*(professor's addition; the material cites Trusted Advisor, Compute Optimizer, Cost Management, Azure Advisor, Azure Monitor, and Azure Resource Graph)*

| Concept | AWS | Azure | What really changes |
|---|---|---|---|
| Spending visibility and control | AWS Cost Management (Cost Explorer, Budgets) | Microsoft Cost Management | In both: cost analysis, budgets, and alerts. The categories and filter dimensions change |
| Recommendations | AWS Trusted Advisor (and Compute Optimizer) | Azure Advisor | Both recommend savings, performance, security, and reliability. On AWS, part of the Trusted Advisor checks depends on the support plan contracted |
| Commitment discount | Savings Plans and Reserved Instances (RIs) | Azure Savings Plan and Azure Reservations | The material says the tools recommend RIs and Savings Plans. Both offer both commitment styles (per specific resource or per hourly spend); the conditions, terms, and services covered differ, and **only each provider's calculator gives the value** |
| Idle capacity | Spot Instances | Spot VMs | In both, idle capacity at a discount and **with no guarantee of permanence**: the provider may take it back. The rules for interruption notice and price differ |
| Resource inventory and query | AWS Resource Groups Tagging API and AWS Config | Azure Resource Graph | The material cites Resource Graph. They serve to query resources at scale, including by tag |
| IaC | CloudFormation | ARM templates and Bicep | Stage 05 |
| Monitoring and observability | Amazon CloudWatch | Azure Monitor | Metrics, logs, and alarms. On Azure, Monitor brings metrics and logs together under one platform; on AWS, CloudWatch is the base and other services complete it |

**Governance: policies, tags, automation, and auditing.** Governance is creating, enforcing, and monitoring security, risk, compliance, and cost policies.

**Tags** are metadata (key and value) that allow allocating cost, filtering reports, and applying compliance and security. They require a **consistent policy** of names (spelling, capitalization, spacing). Examples from the material: `ambiente = teste`, `custo = projeto`, `db = database`, `compliance = hipaa`, `time = 12x05`. **Each provider has its own limits** (number of tags, key and value length, case sensitivity); check the documentation and do not memorize numbers.

**Cockpit perspective:** a tag is the label on each part with revision number, project, and cost center. Without it, at the end of the year nobody knows how much the new floor cost or how much of it went into the cost cap. And the same label written two ways (`Producao` and `producao`) becomes two different parts in the accounting; that is why the spelling rule is imposed by a system, and not by the goodwill of whoever labels.

Automation: apply tags by template, **check** by rule, and alert. In strict cases (and only outside production), terminate resources without tags after a deadline. Auditing: a policy defined with stakeholders, weekly coverage reports, email alerts, optional termination action, and continuous monitoring.

*(professor's addition; the material talks about tags without citing each provider's mechanism)*

| Concept | AWS | Azure | What really changes |
|---|---|---|---|
| Tags | Tags on resources; **Tag Policies** (AWS Organizations) to standardize | Tags on resources and resource groups; **Azure Policy** to require and inherit tags | On Azure, a resource group's tag is **not inherited** by the resources inside it by default; use Azure Policy to propagate. On AWS, tag standardization comes from Tag Policies and from AWS Config rules. Check case sensitivity and limits in the documentation |

**Well-Architected Framework (practical application).** Six pillars on AWS (five on Azure, see Stage 05). A well-architected solution **balances** all the pillars, and there are trade-offs: more security can raise cost and complexity; more availability costs more. FinOps and GreenOps (FinOps applied to environmental impact: measuring and reducing the carbon footprint of what is used) show that cost and sustainability are optimized together. The frameworks also work as a **review methodology**: evaluating the architecture against each pillar, periodically.

**Cockpit perspective:** replicating in three regions is like taking three complete sets of spare parts to every round: the car is more protected, and the bill and the logistics get heavier. The periodic review against the pillars is the project debrief: instead of "was the car fast?", the question is "is the car balanced in what matters?".

**Overview and trends (material, ref. jun/2025):** the material projected that cloud security would consume up to 20% of the total cybersecurity budget in 2025; context-based cybersecurity (lateral movement of attackers in hybrid environments); the focus shifting from pure prevention to **rapid containment and resilience** (DORA and NIS2 cited: European Union regulations, DORA on digital operational resilience of the financial sector and NIS2 on cybersecurity); and a list of projections for 2025 (edge, serverless, AI, cloud-native, quantum, sovereign cloud). **Treat these projections as historical context**; the lasting point is that security, cost, sustainability, and performance are decided together, and not in silos.

### Commented example: envelope encryption in your terminal

See the DEK and KEK hierarchy working, 100% local, with `openssl`. It is a **didactic demonstration** (it uses AES-256 in CBC mode with password-based key derivation; production uses the managed services and authenticated modes). In a KMS or Key Vault, the KEK **never leaves** the service. Requires OpenSSL 1.1.1 or later (the version in which the `-pbkdf2` option appeared); on macOS, if `-pbkdf2` is rejected, see the note about LibreSSL in the prerequisites.

```sh
cd "$LAB"/etapa-06

echo "dados do cliente" > dados.txt        # the secret we want to protect
openssl rand -hex 32 > dek.key             # DEK: random key that encrypts the data
openssl rand -hex 32 > kek.key             # KEK: key that protects the DEK (in the real world, it lives in the KMS or Key Vault)

# 1) encrypts the data with the DEK
openssl enc -aes-256-cbc -pbkdf2 -in dados.txt -out dados.enc -pass file:dek.key

# 2) encrypts (envelopes) the DEK with the KEK
openssl enc -aes-256-cbc -pbkdf2 -in dek.key -out dek.enc -pass file:kek.key

# 3) deletes the plaintext DEK: only the encrypted data and the encrypted DEK remain
rm dek.key dados.txt

# 4) to read it back: first opens the envelope (KEK -> DEK), then decrypts the data (DEK -> data)
openssl enc -d -aes-256-cbc -pbkdf2 -in dek.enc -out dek.key -pass file:kek.key
openssl enc -d -aes-256-cbc -pbkdf2 -in dados.enc -pass file:dek.key
```

Expected output of the last command:

```text
dados do cliente
```

Notice the advantage: to **change the KEK** (rotation), you only reopen and redo the DEK's envelope (a small file), without re-encrypting the data (which can be terabytes). And whoever steals `dados.enc` and `dek.enc` without the KEK reads nothing: access control is concentrated in the key.

**Cockpit perspective:** it is the key to the parts truck. Each truck has its padlock, and its key is the DEK. All those keys are locked in a safe whose combination only the head of logistics knows: the safe's combination is the KEK. Changing the safe's combination (rotating the KEK) does not require changing any truck's padlock. And whoever steals the truck and the locked box of keys, without the safe's combination, opens nothing. **Here the analogy stops:** in the KMS and in Key Vault, the KEK never leaves the service: the opening of the envelope happens inside, without anyone seeing the secret.

**Cleanup:** `cd "$LAB"/etapa-06 && rm -f dek.key kek.key dados.enc dek.enc`.

### Hands-on

*Timed pit stop, and it is the longest of the guide! Five tasks: tag audit, policy comparison, savings calculation, waste hunt, and risk with read commands and a real TLS. Steady pace to the end.*

**1. Tag audit, 100% local.** Create `$LAB/etapa-06/inventario.csv` (**fictitious** inventory):

```text
recurso,ambiente,projeto,custo
vm-web-01,producao,loja,cc-100
vm-web-02,producao,loja,
disco-01,teste,,cc-200
bucket-logs,,loja,cc-100
fn-pedidos,producao,loja,cc-100
```

Run the auditor (`-F,` splits by comma; `NR>1` skips the header; a line with any of the three tags empty is "without tag"):

```sh
awk -F, 'NR>1 {
  total++                                              # counts resources
  if ($2=="" || $3=="" || $4=="") {                    # any of the required tags empty?
    print "SEM TAG:", $1
    faltam++
  }
} END {
  printf "cobertura: %d/%d = %.0f%%\n", total-faltam, total, (total-faltam)/total*100
}' "$LAB"/etapa-06/inventario.csv
```

Expected output:

```text
SEM TAG: vm-web-02
SEM TAG: disco-01
SEM TAG: bucket-logs
cobertura: 2/5 = 40%
```

Challenge: add the line `vm-api-01,Producao,loja,cc-100` and discuss whether `Producao` and `producao` should count as the same tag (this is exactly the case sensitivity problem the material warns about). Rewrite the auditor to treat `Producao` as an error.

To add the line without opening the editor (run only once; each execution adds another copy):

```sh
echo "vm-api-01,Producao,loja,cc-100" >> "$LAB"/etapa-06/inventario.csv
```

Answer key. With the original auditor, the new line **passes**, because `Producao` is not empty: the output lists the same three resources and ends in `cobertura: 3/6 = 50%`. A version that accepts only the policy values (`producao`, `teste`, `desenvolvimento`, in lowercase) swaps the `$2` condition for a regular expression:

```sh
awk -F, 'NR>1 {
  total++
  if ($2 !~ /^(producao|teste|desenvolvimento)$/ || $3=="" || $4=="") {   # environment outside the accepted list, or empty tag
    print "SEM TAG OU FORA DO PADRAO:", $1
    faltam++
  }
} END {
  printf "cobertura: %d/%d = %.0f%%\n", total-faltam, total, (total-faltam)/total*100
}' "$LAB"/etapa-06/inventario.csv
```

Expected output:

```text
SEM TAG OU FORA DO PADRAO: vm-web-02
SEM TAG OU FORA DO PADRAO: disco-01
SEM TAG OU FORA DO PADRAO: bucket-logs
SEM TAG OU FORA DO PADRAO: vm-api-01
cobertura: 2/6 = 33%
```

Now `vm-api-01` shows up as an error and coverage drops to 2 of 6. The rule lives in the auditor, and not in each person's memory: it is the automation the material recommends.

**2. Tag policy compared (paper).** Fill in:

| Required tag | Accepted values | Why it exists | How AWS enforces it | How Azure enforces it |
|---|---|---|---|---|
| `ambiente` | `producao`, `teste`, `desenvolvimento` | Separate cost and risk | Tag Policy (standardizes values) | Azure Policy (require tag) |
| `projeto` | Project code | Cost allocation | Idem, plus a rule in AWS Config | Azure Policy |
| `custo` | Cost center code | Chargeback (billing the cost back to the area that generated it) | Idem | Azure Policy |

Tip: the "how it enforces" column is **conceptual**; the real configuration is outside the scope of this guide.

**3. Savings calculation, with fictitious numbers.** The prices and discounts below are **invented** (UM = fictitious monetary unit; the VM hour costs 0.50 UM; 730 hours per month; fictitious discount of 40% for commitment and 70% for Spot). Create `$LAB/etapa-06/economia.sh` with the content below:

```sh
awk 'BEGIN {
  # WARNING: FICTITIOUS values. Real prices: the official calculator of each provider.
  p = 0.50                     # UM per VM hour
  h24 = 730                    # hours in a month
  hcom = 12 * 22               # business hours: 12 h per day x 22 working days = 264 h

  dev24  = 10 * p * h24        # 10 development VMs on 24x7
  devcom = 10 * p * hcom       # the same 10 VMs, only in business hours (scheduling)
  printf "dev 24x7: %.2f\n", dev24
  printf "dev horario comercial (%d h): %.2f\n", hcom, devcom
  printf "economia: %.2f (%.1f%%)\n", dev24 - devcom, (dev24 - devcom) / dev24 * 100

  prod = 4 * p * h24           # 4 stable production VMs, on demand
  printf "prod sob demanda: %.2f\n", prod
  printf "prod com compromisso (desconto ficticio 40%%): %.2f\n", prod * 0.6

  spot = 5 * 100 * p           # 5 batch processing VMs, 100 h in the month
  printf "batch sob demanda: %.2f\n", spot
  printf "batch spot (desconto ficticio 70%%): %.2f\n", spot * 0.3

  printf "discos orfaos: %.2f\n", 20 * 100 * 0.08   # 20 disks x 100 GB x 0.08 UM per GB-month (fictitious)
}'
```

Run:

```sh
sh "$LAB"/etapa-06/economia.sh
```

Expected output:

```text
dev 24x7: 3650.00
dev horario comercial (264 h): 1320.00
economia: 2330.00 (63.8%)
prod sob demanda: 1460.00
prod com compromisso (desconto ficticio 40%): 876.00
batch sob demanda: 250.00
batch spot (desconto ficticio 70%): 75.00
discos orfaos: 160.00
```

Notice which lever was worth the most: **shutting down what is not in use** (63.8%) beat the commitment discount, and required no contract at all. Each technique serves one type of load: scheduling for what is intermittent, commitment for what is stable, Spot for what tolerates interruption.

**Cockpit perspective:** once again, the strongest lever was not negotiating a discount, it was to stop paying for what was idle. It is the first question of any budget review in a team under a cost cap: what is on, rented, or stored without use?

**4. Read commands to hunt waste and risk (read-only).**

Orphan disks (the material's "unattached EBS volume"):

```sh
aws ec2 describe-volumes --filters Name=status,Values=available \
  --query "Volumes[].[VolumeId,Size,CreateTime]" --output text
az disk list --query "[?diskState=='Unattached'].[name,diskSizeGb]" --output table
```

On AWS, `status=available` means a volume **with no attachment**; on Azure, the state is `Unattached`. New account: empty output.

Who can do what (least privilege):

```sh
aws iam list-users --query "Users[].UserName" --output text      # IAM users in the account
aws iam get-account-summary --query "SummaryMap.AccountMFAEnabled"   # 1 if the root account has MFA, 0 if not
az role assignment list --all \
  --query "[].{quem:principalName, papel:roleDefinitionName, escopo:scope}" --output table
```

Observation: if the second command returns `0`, the root account has no MFA, and that should be fixed first.

Rules open to the world:

```sh
aws ec2 describe-security-groups --filters Name=ip-permission.cidr,Values=0.0.0.0/0 \
  --query "SecurityGroups[].[GroupId,GroupName]" --output text
az network nsg list --output table
```

The first lists Security Groups with **some inbound opened to any address** (`0.0.0.0/0`). On a new account, the output usually comes back empty: each VPC's default security group only accepts inbound coming from the group itself, and not from `0.0.0.0/0`. If any group appears, it was created or changed by someone; evaluate case by case. On Azure, list the NSGs and inspect each one's rules with `az network nsg rule list --resource-group <grupo> --nsg-name <nome> --output table`.

Budgets and recommendations:

```sh
az advisor recommendation list --category Cost --output table        # cost recommendations from Azure Advisor
az consumption budget list --output table                            # configured budgets (may require permissions)
```

On AWS, the equivalent of Advisor is Trusted Advisor (`aws support describe-trusted-advisor-checks --language en --region us-east-1`; the support API only answers in the `us-east-1` region), which depends on the account's support plan; **without the proper plan the command returns an access error**, and that is expected. New account: empty lists.

**5. Observe real TLS (needs only Internet).**

```sh
openssl s_client -connect example.com:443 -brief < /dev/null
```

This command opens a TLS connection and shows the summary: protocol version, cipher suite, and certificate verification. Expected output (varies): lines such as `Protocol version: TLSv1.3` and `Verification: OK`.

### Exercises

*Last lap of the GP! Seven questions that stitch the whole sector together, from shared responsibility to the pillar in conflict. Clock running.*

1. **Who is responsible?** A bucket (S3 or Blob) was left public by configuration. Who answers? *Expected answer:* the customer (security **in** the cloud: configuration and data).
2. **NACL or subnet NSG?** What is the fundamental difference, even though they sit at the same level? *Expected answer:* the NACL is stateless (authorizes outbound and return separately) and the NSG is stateful (the response is released automatically).
3. **Which lever?** (a) Development servers left on at night; (b) a production database that runs 24x7 for years; (c) nightly image processing that can restart if interrupted. *Expected answer:* (a) scheduling; (b) commitment (Savings Plans or RIs; Azure Savings Plan or Reservations); (c) Spot (Spot Instances or Spot VMs).
4. **Why envelope?** Why use DEK and KEK instead of a single key? *Expected answer:* to rotate the KEK without re-encrypting all the data (only re-envelope the DEKs), and to concentrate access control in the central key.
5. **Choosing the connection.** You need a dedicated, low-latency private connection to link the data center to the cloud, and individual access for 30 remote employees. Name the service for each case on both clouds. *Expected answer:* dedicated circuit: Direct Connect (AWS) and ExpressRoute (Azure); remote users: Client VPN (AWS) and VPN Gateway point-to-site (Azure).
6. **Badly written tag.** The resources `ambiente=Producao` and `ambiente=producao` show up as distinct groups in the cost report. What is the remedy? *Expected answer:* a naming policy (capitalization convention) enforced by automation, which alerts or corrects, instead of depending on each person's discipline.
7. **Pillar in conflict.** Enabling replication in three regions improves which pillar and worsens which? *Expected answer:* it improves reliability; it worsens cost optimization (and operational complexity), which illustrates the trade-offs of Well-Architected.

### Remember this

> Security, cost, and governance are design requirements, and not post-project ones: apply least privilege and layers of defense, tag every resource, and measure what matters before buying a discount.

*Sector 6 in green! Six sectors complete: credentialing with least privilege, key in the safe, layered firewall, label on each part, and the right cost lever for each load. Now it is the home straight, straight to the checkered flag.*

---

## Self-assessment checklist

*Final stretch, checkered flag in sight! This is the parc fermé inspection, the area where cars are held after the race and nothing passes without a check. Tick only what you can do without consulting the guide, because the stewards do not accept a memorized answer.*

**Stage 01**

- [ ] I define cloud computing in my own words and give an example.
- [ ] I explain CapEx and OpEx and can say when the cloud does **not** pay off financially.
- [ ] I differentiate public, private, and hybrid cloud and give a reason for each.
- [ ] I differentiate scalability from elasticity.
- [ ] I distinguish Outposts from Azure Arc and from Azure Stack, and Direct Connect from ExpressRoute.
- [ ] I know how to list regions with `aws` and with `az`.

**Stage 02**

- [ ] I describe IaaS, PaaS, SaaS, and FaaS and give one AWS service and one Azure service for each (when there is one).
- [ ] I fill in the responsibility matrix and know that "Data" always belongs to the customer.
- [ ] I explain why FaaS is stateless and what that changes in the design.
- [ ] I can say where Elastic Beanstalk and App Service differ.

**Stage 03**

- [ ] I explain region, availability zone, and point of presence.
- [ ] I know that the zone label is mapped per account and that on Azure not every region has zones.
- [ ] I calculate the downtime of an SLA and the availability in series and in parallel.
- [ ] I distinguish SLI, SLO, and SLA.
- [ ] I explain the Circuit Breaker pattern and when it beats retry.
- [ ] I know how to pair ASG with VMSS, ALB with Application Gateway, and NLB with Azure Load Balancer.

**Stage 04**

- [ ] I apply the six-criteria methodology to compare providers.
- [ ] I explain lock-in and cite mitigations.
- [ ] I know why market share numbers with different dates do not add up.
- [ ] I build a weighted matrix and understand why the weight decides the result.

**Stage 05**

- [ ] I choose among object, block, and file storage and give the AWS and Azure pair.
- [ ] I choose among SQL, NoSQL, and data warehouse and give the pairs (Aurora and RDS, Azure SQL, DynamoDB, Cosmos DB, Redshift, Synapse and Fabric).
- [ ] I design a virtual network with subnets and CIDR and know how to check for overlap.
- [ ] I explain why on AWS the subnet is zonal and on Azure it is not.
- [ ] I differentiate layer 4 and layer 7 balancing and know the static and dynamic algorithms.
- [ ] I differentiate CloudFront from Front Door.
- [ ] I cite the Well-Architected pillars and know that AWS and Azure differ in their number.

**Stage 06**

- [ ] I explain the shared responsibility model and give examples of customer error.
- [ ] I explain IAM, MFA (and FIDO2), SSO, and federation, and the IAM x Entra ID and RBAC pair.
- [ ] I explain encryption in transit and at rest and the DEK and KEK hierarchy.
- [ ] I differentiate Security Group, NACL, and NSG (stateful x stateless).
- [ ] I pair WAF, Network Firewall, Site-to-Site VPN, Client VPN, Transit Gateway, and Direct Connect with Azure's.
- [ ] I choose the right cost lever (scheduling, commitment, Spot, right-sizing, cleanup).
- [ ] I define and audit a tag policy.
- [ ] I know that commands that **create** resources generate cost and that read commands, as a rule, do not.

*CHECKERED FLAG! If the boxes are ticked, step onto the podium: you started out torn between buying and renting and crossed the line with service models, zones and regions, the math of the nines, the breaker, the decision matrix, the network drawn on paper, credentialing, the key in the safe, and a label on each part, on both circuits. And a bad start does not decide a race: at Suzuka, in 1988, Ayrton Senna stalled his engine on the grid, dropped to the middle of the pack, and won, securing his first title. Left a box blank? No drama: pit, adjust, and get back on the track. Next, the behind-the-scenes notes from the driver and the professor.*

---

## Driver's notes: where the analogies break down

The F1 layer does not change commands, code, technical tables, expected outputs, or exercises; technical corrections came from the professor's review. The points where the comparison does not fully hold:

1. **A circuit with several sites.** A racetrack sits in one place; a provider has dozens of regions. "Circuit", in this guide, is the owner of the infrastructure.
2. **Two fixed cars.** The regulations fix two cars per team. Horizontal scaling, elasticity, and auto-scaling have no equivalent on the track.
3. **Independent pavilions.** At a racetrack, the garages share a single pit building and its infrastructure; availability zones are physically separated, with their own power, cooling, and network.
4. **The circuit's car does not exist.** In F1, each team designs its own chassis; the IaaS "standard car" is just an image for "ready-made machine, operated by you from the OS up".
5. **A pit stop does not charge for usage.** The crew is paid for the whole weekend and is always the same; FaaS charges for execution and you do not know which instance serves each call.
6. **SLA and component allotment.** The SLA is a promise to the customer; the power unit component allotment is a rule imposed on the team by the FIA. The comparison preserves only the structure (measurement, target with slack, limit that costs dearly).
7. **The pit lane does not redistribute cars.** Behind a load balancer, any identical instance serves any request; in the real pit lane, each car stops at its own team's garage.
8. **Points added up.** The team adds up the points of the two cars; in a redundant system, one instance standing serves the whole service.
9. **Part and copy.** A physical part exists in one unit; objects, replicated disks, and caches exist in as many copies as you want, and the digital copy is remade in seconds.
10. **Car number and CIDR range.** The number identifies a car; a CIDR block is a range of addresses, and the overlap can be partial.
11. **The circuit is not chosen.** The calendar decides where the team races and it never operates at two circuits on the same Sunday; in the cloud, you choose the provider, can use both at the same time, and leaving has a real cost (lock-in).
12. **Outposts and Arc.** No circuit installs a garage in a team's factory; the parallel only separates provider hardware from provider management.
13. **Cost cap and FinOps.** The cap is imposed from outside, with punishment; FinOps is an internal practice.
14. **Badge and FIDO2.** The badge photo is checked by a person; FIDO2 is a cryptographic verification bound to the real site.
15. **Real teams.** No provider was associated with a team. Mercedes appears as an example of redundancy (two cars, one scored) and Ferrari as an example of correlated failure (the same tire bet on both cars) and of operating error on the customer's side (Bahrain 2018); neither represents AWS or Azure.

## F1 data sources (consulted on 2026-10-06)

The pitstop backend was down and there was no new query for this guide: the data below were reused from the DevOps Culture guide of the same module, verified on 2026-10-06.

Championship standings after round 16 of 23 (Bahrain GP held in Sepang, on October 4, 2026), recorded here only as a reference; no stage of the guide depends on it. Drivers: 1. Kimi Antonelli (Mercedes), 320 points; 2. George Russell (Mercedes), 236; 3. Lewis Hamilton (Ferrari), 214; 4. Charles Leclerc (Ferrari), 191; 5. Lando Norris (McLaren), 188; 6. Max Verstappen (Red Bull), 188; 7. Oscar Piastri (McLaren), 128; 8. Isack Hadjar (Red Bull), 96; 9. Liam Lawson (Racing Bulls), 65; 10. Pierre Gasly (Alpine), 41.

- Drivers' standings after round 16 of 23: [RacingNews365](https://racingnews365.com/2026-f1-championship-standings-after-bahrain-grand-prix-in-malaysia) and [Motorsport Week](https://www.motorsportweek.com/2026/10/04/f1-2026-world-championship-standings-after-the-bahrain-gp-in-malaysia/).
- Result and report of the Bahrain GP in Sepang (October 4, 2026), constructors' standings: [Formula1.com](https://www.formula1.com/en/latest/article/verstappen-wins-rain-hit-bahrain-gp-in-malaysia-over-antonelli-as-russell-retires-late-on.6qfpIHPch8mIVj2YgfHdCp) and [RaceFans](https://www.racefans.net/2026/10/04/2026-bahrain-grand-prix-in-malaysia-race-result-and-championship-points/).
- 2026 Singapore GP (October 9 to 11, first sprint weekend at Marina Bay): [RacingNews365](https://racingnews365.com/f1/races/singapore-gp) and [F1 Wiki](https://f1.fandom.com/wiki/2026_Singapore_Grand_Prix).
- Historical fact, 2018 Bahrain GP (Ferrari's unsafe release, injured mechanic, 50,000 euro fine): [Formula1.com](https://www.formula1.com/en/latest/article/ferrari-handed-big-fine-for-raikkonen-unsafe-release.40Rd1aQwsgKSomC2UqqQwc) and [RACER](https://racer.com/2018/04/08/ferrari-mechanic-breaks-leg-in-pit-stop-mishap).
- General regulation and operation facts used without a new source (two cars per team, 11 teams on the 2026 grid, cost cap since 2021, permanent driver numbers, wind tunnel usage limit, power unit component allotment, sea freight for rounds outside Europe, Ferrari's Fiorano track) come from the driver's knowledge and were kept without specific numbers.

## Appendix: complete reference table

All the analogies used in the document, in the order in which they appear. The central ones are in the table at the beginning. AWS and Azure always enter in the same way, as circuits; no provider is associated with a real team.

| Cloud architecture | Formula 1 |
|---|---|
| Traditional IT with capacity bought for the peak | The in-house structure bought for the worst weekend of the year and paid for all year |
| Cloud provider (AWS or Azure) | The circuit: the infrastructure the team uses to operate; the same team operates on both |
| CapEx | Building your own wind tunnel |
| OpEx | Paying per hour of tunnel at a third party's facility |
| Vertical scaling | Asking the same car for more power, up to the ceiling |
| Horizontal scaling | Putting more cars on the track (does not exist in F1) |
| Elasticity | The fleet of cars that grows and shrinks by itself with the race (does not exist in F1) |
| Public cloud (*multi-tenant*) | The circuit shared by the 11 teams, each in its own garage |
| Private cloud | The team's factory |
| Hybrid cloud | The garage at the circuit connected to the remote operations room at the factory |
| Site-to-site VPN | The encrypted tunnel over the Internet between garage and factory |
| Direct Connect and ExpressRoute | The dedicated line contracted between garage and factory |
| AWS Outposts and Azure Stack | The circuit's rack, operated by it, installed inside your factory |
| Azure Arc | The circuit's dashboard that sees and manages your equipment wherever it is |
| Different region names (`sa-east-1`, `brazilsouth`) | Two sites in the same city, one from each circuit, each with its own naming system |
| On-premises | Having your own track and facilities, like Fiorano |
| IaaS | Empty garage with power, network, and a standard car; from the OS up it is yours |
| PaaS | Garage equipped and maintained by the circuit; you bring the set-up and the strategy |
| SaaS | Ready-made service from the circuit, like the official timing |
| FaaS | The pit stop: triggered by the box call, short, with a time limit and no memory |
| "Data" row of the matrix | The team's telemetry and set-up, always its own |
| State outside the function | The tire plan in the strategist's system, not in the crew's heads |
| Global variable in FaaS | The mechanic counting stops from memory |
| Peak triggered by an event | The safety car that opens the pit window for many cars at once |
| *Cold start* | The pit stop called at the last minute, with the crew still leaving the garage |
| Instance size (`t3.micro`, `Standard_B1s`) | The standard car's spec sheet: processors and memory |
| VM (instance) | A car: the unit of capacity that goes onto the track (in IaaS, the standard car) |
| Disaster recovery in another region | The Bahrain GP held in Sepang: the event changes venue |
| Region | The circuit's geographic site |
| Availability zone | Independent pavilion at the site, with its own power, cooling, and network |
| Data center | Each building of a pavilion |
| Point of presence | Forward material depot near the next round |
| Zonal and regional resource | Material in a single pavilion or mirrored in several |
| Zone label and *zone ID* | The name you give the pavilion and its official number, the same for everyone |
| Latency (RTT) | The round-trip time between the car and whoever decides |
| Load balancer | The pit lane entry control, forwarding each request to a free VM and taking the one that failed out of the route |
| Layer 4 and layer 7 | Deciding by the envelope or opening the message and deciding by the content |
| Auto-scaling | The rule that puts cars on the track or takes them off according to load (does not exist in F1) |
| SLI | The number on the telemetry |
| SLO and error budget | The internal target with slack, like using fewer components than the allotment allows |
| SLA | The formal limit with a consequence, like the component allotment that costs grid positions |
| Circuit Breaker open | The system with sequential failures shut down; the car goes on slower |
| Circuit Breaker half-open | A single reactivation attempt requested by the engineer |
| Retry | Pressing the same button at every corner hoping it works |
| Cascading failure | The forced system that damages other components and stops the car |
| Edge computing | The car processing the sensors on board and streaming only part of it live |
| Components in series | The chain of systems of a car: if one fails, the car stops |
| Components in parallel | The team's two cars: if one retires, the other scores |
| Correlated failure | The same tire bet on both Ferrari cars in Sepang |
| Provider comparison | Comparing the facilities of two circuits, never cheering for one |
| The six criteria of the methodology | What the team evaluates in the facilities of where it will operate |
| Vendor lock-in | Garage equipment built to fit only one circuit's facilities |
| Portability | Using standard fittings, which work at any circuit |
| Multicloud | Operating at two circuits in the same minute (impossible in F1) |
| Weighted matrix | The weight of each criterion in a circuit's set-up, like downforce in Singapore |
| Object storage | The depot of labeled parts: to change one, a new revision is made |
| Block storage | The on-board memory tied to one car and to the pavilion where it is |
| File storage | The garage's shared folder |
| VPC and VNet | The team's reserved area at the circuit |
| Public, private, and protected subnets | The front facing the pit lane, the office at the back, and the data room with no exit |
| Gateways and routing | The gates and the map of where each one leaves |
| NAT | The press officer: the team talks outward, nobody from outside enters through them |
| Peering | The cable between two areas of the same team |
| Zonal (AWS) and regional (Azure) subnet | A sector tied to one pavilion or designed for the whole site |
| Relational database (ACID) | The official classification: the lap counts or does not count |
| NoSQL with eventual consistency | The live timing screen, sometimes an instant behind the track |
| Data warehouse | The archive of whole seasons |
| Vector database | Searching for similar laps by shape, not by an exact field |
| Load balancing algorithms | Criteria of the entry control: alternate, pin, least busy, fastest, by telemetry |
| CDN | The logistics of rounds far from Europe, with material sent ahead |
| Cache hit and cache miss | The part that is already on site or the one that comes from the factory by plane |
| Well-Architected pillars | The car's design commitment: downforce, speed, reliability, cost |
| CIDR overlap | Two cars with the same number |
| Central CIDR registry | The FIA's registry of permanent numbers |
| Customer configuration error | Ferrari's unsafe release in Bahrain in 2018 |
| Shared responsibility | The circuit takes care of the track; the team takes care of the car, the garage, and who enters |
| IAM | The paddock credentialing |
| Roles and policies | The types of credential and the table of which type enters where |
| Identity federation | Accepting the identity issued by another trusted system |
| Least privilege | The hospitality guest with no access to the pit lane |
| Entra ID and RBAC | Issuing the credential and the access table at separate counters |
| MFA | Badge with a photo checked at the entrance |
| Security Group (stateful) | The guard next to the car, who saw you arrive |
| NACL (stateless) | The turnstile that checks the list on the way in and on the way out |
| NSG numeric priority | The access list in which the first line that matches decides |
| DEK and KEK | The key of each truck and the combination of the safe where the keys are kept |
| KEK rotation | Changing the safe's combination without changing any padlock |
| FinOps | The cost cap: engineering and finance deciding together |
| Resources on with no use | Equipment on at night with nobody working |
| Orphan disks | Manufactured parts that were never fitted |
| Spot | Cheap window that can be canceled at any moment |
| Right-sizing | Bringing the small tool when it does the job |
| Tags | The part label with revision, project, and cost center |
| Replication in three regions | Three complete sets of spares at every round |
| Well-Architected review | The project debrief: is the car balanced in what matters? |

---

## Professor's notes

**Clarifications and corrections to the raw material:**

In these notes, "Lesson 0X" is the lesson of the original material and "Stage 0X" is the stage of this guide. The numbering of the two coincides, but some topics of the material appear in another stage of the guide or were left out; each note indicates where.

1. **Responsibility matrix: data in SaaS.** Table 1 of Lesson 01 of the material lists, for SaaS, the provider as responsible for "the whole stack, including data", and the customer's responsibility as "only the use of the software". The Lesson 02 matrix and Lesson 06 of the material say that **data belongs to the customer in all models**. The second prevails, and it is the version used in the Stage 02 matrix of this guide: the provider operates the software and the infrastructure, but who decides what is stored and who accesses it is the customer.
2. **Sustainability as a pillar.** Lesson 06 of the material calls Sustainability the "sixth pillar, a trend for 2025" (in the guide, the pillars are in Stage 05). It was added to the AWS Well-Architected Framework in 2021 and is not a 2025 trend. Besides that, the Azure framework is described with five pillars; the "six pillars" holds for AWS.
3. **Duplicated WAF acronym.** The material uses WAF for *Well-Architected Framework* and for *Web Application Firewall* (even in the same stage). In this guide, I write "Well-Architected" in full and reserve WAF for the web firewall.
4. **Scope of VPC and subnet (Google, AWS, and Azure).** Lesson 05 of the material says the VPC is global and the subnets are regional; this holds for **Google Cloud**. Lesson 06 of the material says that "subnets are tied to AZs", which holds for **AWS**. On **Azure**, the VNet is regional and the subnet is not zonal. The material mixes the providers without warning; Stage 05 of this version separates the three behaviors.
5. **"Each region has three or more AZs".** A Google Cloud statement. On AWS and Azure the number of zones varies among regions and, on Azure, there are regions without zones.
6. **VM to VM encryption inside the VPC and AES-256 by default.** The material describes Google Cloud (TLS between VMs in the VPC, AES-256 at rest by default). Do not generalize these statements to AWS and Azure. The object storage services of both offer, in 2026, encryption at rest by default, but the behavior is per service; check each one's documentation.
7. **Market numbers and date dispersion.** The market shares (33%, 23%, 10%) have different references (early 2023, end of 2022, Q1 2022 and 2023). The "64%" from Lesson 02 of the material (cited in Stage 04 of this guide) is from Q4 2024. The edge computing market size appears as "more than US$ 111 billion in 2025" (Lesson 03) and "US$ 250 billion by 2025" (Lesson 06), numbers that were left out of this guide: in the material, the two coexist without explanation (probably different sources and definitions). The phrase "80% of the IT budget dedicated to the cloud by 2024" (Lesson 04, also outside the guide) is an expectation of the material, not a verified fact. All the projections "by 2025" have already expired in 2026; use them as a snapshot of the period.
8. **"Each nine costs exponentially more".** A qualitative heuristic of the material, not a formula. The calculation of 5.26 minutes for 99.999% **was verified** (365 x 24 x 60 x 0.00001 = 5.256 minutes).
9. **Renamings.** The material (jun/2025) uses names that may have changed: Azure AD became Microsoft Entra ID (the material already records it); Azure's Redis service and the HCI branch of Azure Stack are going through name or product transitions; classic Azure CDN is going through consolidation with Front Door. Always check the official documentation.
10. **Retry and Circuit Breaker.** The material says they "can be combined, but the retry must respect the Circuit Breaker's exceptions". I add the operational reason (the professor's explanation): if the retry ignores the breaker, it defeats the benefit of the pattern and reintroduces the cascade.

**Limits of the practices (where the analogy ends):**

- The cost calculations use **fictitious prices and discounts**. They serve to see the mechanics of each lever, not to estimate your bill. Each provider's official calculator is the source of truth.
- The decision matrix of Stage 04 uses fictitious scores for "Option 1" and "Option 2". It is not an assessment of any provider.
- The guide's Circuit Breaker is a mock-up of a few lines: it has no time window or metrics, and the half-open state is simplified (after the wait, it lets one attempt through). Real libraries (Resilience4j in Java, Polly in .NET) cover this.
- Envelope encryption with `openssl` is a didactic demonstration (CBC with a password-derived key). Production uses KMS or Key Vault, with authenticated modes such as GCM.
- The `aws` and `az` commands are **read** commands. The outputs shown are **illustrative**: IDs, region lists, and zone mappings vary by account and by period. If a parameter is rejected by your CLI version, use `--help` on the command.
- Bicep and CloudFormation were only **validated or compiled**; actually creating the infrastructure generates resources and cost, and is out of scope.
- The AWS x Azure pairing is an **orientation map**, and not a translation table. Where the "What really changes" column points to a difference, it matters: study the service documentation before migrating or designing based on equivalence.

---

## Source material references

- Original material of the "Cloud Architecture" course (6 lessons, FIAP POSTECH), with references consulted in June 2025: AWS (Cloud Adoption Framework, Well-Architected, Network Firewall, Client VPN, load balancing), Microsoft Azure and Microsoft Learn (public, private, and hybrid clouds; Azure Well-Architected Framework; Circuit Breaker pattern; Introduction to Identity and Access Management), Google Cloud (cloud computing advantages, adoption, hybrid, VPC, load balancing, databases, NoSQL, and storage), Atlassian, Cloudflare, FinOps Foundation, Check Point, Akamai, Illumio, Canalys, Gartner (through links cited in the lessons), and others listed in the PDFs.
- The pairing with Azure and the local calculation examples are additions by the professor, with no source in the material, and must be confirmed in each provider's current official documentation.

---

*And that is how we close the broadcast, live from the pit wall of the Cloud Architecture GP: six sectors, two circuits, and no forgotten resource left on generating a bill. From the commentary box, that is all. The next stop on the calendar is Singapore, October 9 to 11, 2026, for the first time with the sprint format; until then, remember: the garage is rented, but the data and the credentials are always yours. END OF BROADCAST.*
