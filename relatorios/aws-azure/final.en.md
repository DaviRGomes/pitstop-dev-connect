# AWS and Azure side by side: the same team on two circuits, from the first account to the secure architecture

*Good afternoon, good evening, good morning, wherever you are! The Cloud Grand Prix, with AWS and Azure side by side, is on the air, and the grid is already formed. What is at stake in this race is leaving here operating on both circuits with a single procedure: identity, network, compute, data, observability, and security, without memorizing tables and without leaving a forgotten resource generating a bill.*

*The layout has eleven sectors, and I narrate each one. Sector 1, the starting straight: what the cloud is, regions, zones, and who answers for what. Sectors 2 and 3, the first high-speed corners: identity and network, where the security of the whole race is won or lost. Sectors 4 to 7, the technical heart of the circuit: virtual machines, containers, databases, and serverless. Sectors 8 to 10, the track-reading stretch: telemetry and logs, content delivery, and finally the vault, WAF, certificates, and DNS. Sector 11, the victory lap: study, lab work, and certifications on both sides.*

*Before the start, two agreements. First: the blocks that begin with "Cockpit perspective" are the driver's voice, in the first person. The driver translates each service for the paddock, and when the text says "I" there, it is the driver speaking from inside the car; the passages "Here the analogy stops" are the driver warning where the comparison no longer holds. I stay in the booth, in italics, at the entry and exit of each sector. Second: everything that is Azure is marked as the instructor's addition, as the note just below explains, and where F1 stands in the week of October 5 to 11, 2026 the driver himself tells you, right after the notes. Belts fastened, visor down. Here we go!*

> Technical basis: the didactic version of the eleven course materials of the "AWS" subject (DevOps and Cloud Architecture, Phase 1, FIAP POSTECH). Each lesson became a stage, in the same order. The AWS content comes from the original material. **All the Azure content is a didactic addition by the instructor**: it is not in the lessons and always appears identified: in the tables, by the "Azure (addition)" column; in the examples and commands, by the "Azure (addition)" label in the block title or in the comment that opens the Azure excerpt; in the "Where they really differ" sections, which compare the two sides, the whole Azure side is also an addition. That way you never confuse what is from the course with what is a supplement.

> **Narrated guide, final version**, built on the didactic version (`01-professor.md`). The eleven stages, the commands, the code, the technical tables, the expected outputs, and the order of the exercises are the instructor's, unchanged. On top of them comes the trackside layer: the driver's lens (the "Cockpit perspective" blocks, in the first person), which reads each cloud service as a piece of the operation of a race weekend, and the broadcast narration, in italics, which guides you from stage to stage. The rule that runs through the whole document: **AWS and Azure are two circuits where the same team operates.** Different facilities, same procedure. Neither provider becomes an F1 team, and each service analogy holds equally for the AWS x Azure pair in the equivalence table.

**Cockpit perspective:** in the week of October 5 to 11, 2026, F1 leaves Sepang for Marina Bay. On Sunday, October 4, 2026, the Bahrain GP, moved to Malaysia this season, started about 40 minutes late because of heavy rain; Max Verstappen won, Kimi Antonelli was second, and Lewis Hamilton third. From October 9 to 11, the Singapore GP hosts the sprint format for the first time. For anyone who lives in the paddock, changing circuits is routine: the equipment arrives, the garage is set up in a facility that is not ours, with the power, the network, and the access rules of that place, and the team's procedure is the same as in Sepang. That is how I read this guide. AWS and Azure are two circuits, each with its own facilities, its own names for things, and a few house rules that catch whoever arrives careless. The team is you, and your procedure (identity, network, compute, data, observability, security) is the same on both.

> **Championship data (verified on 2026-10-06).** After round 16 of 23 (the Bahrain GP held in Sepang, Malaysia, on October 4, 2026), Kimi Antonelli (Mercedes) leads with 320 points and George Russell (Mercedes) is second, with 236. The full standings and the sources are in "F1 data sources", at the end. Every scenario with these names that did not actually happen is marked as **hypothetical**.

**For those who do not follow F1: the minimum of trackside knowledge to read this guide.** You do not need to know anything about racing; each term is explained again when it appears.

- **Circuit.** The racetrack that hosts the event. It provides the track, the garages, the power, the network, and the access rules; the team arrives with its equipment and sets up the operation inside those facilities.
- **Paddock and garage (pit box).** The paddock is the restricted area behind the pit boxes, where the teams are. The garage is each team's space, facing the pit lane, where the car is prepared.
- **Pit lane.** The lane parallel to the straight where cars enter to stop at the pit box, with a speed limit and entry control.
- **Pass (credential).** The card each person in the paddock carries; it defines which areas the person can enter (paddock, garage, pit lane, grid).
- **Pit wall.** The stand at the side of the track where engineers and strategists follow the car's data live.
- **Telemetry.** The data the car's sensors transmit live to the wall and to the factory: hundreds of channels of temperature, pressure, and speed.
- **Race control.** The race direction, which publishes messages and flags when something changes on the track: safety car, yellow flag, car under investigation.
- **Safety car.** The car that enters the track after an incident and slows everyone down.
- **Car specification.** The exact list of parts and settings with which the car is assembled; from it, the team builds identical cars.
- **ERS.** The energy recovery system: the battery collects energy under braking and returns it as electric power on the straights. If the charge runs out, the car loses speed before the end of the straight.
- **Out-lap.** The first lap after leaving the pit box, with tires and brakes still cold; by definition, it is slower.
- **Entry list.** The official document that links each driver's name to the car number and the team.
- **Super Licence.** The license the FIA (the federation that regulates F1) issues so a driver can race in the category; it has an expiry date and must be renewed.
- **Cost cap.** The annual spending limit the regulations impose on each team since 2021, with punishment for those who exceed it.
- **Simulator.** The cockpit at the factory where the driver trains and tests setups without touching the real car.
- **Feeder categories.** F4, F3, and F2: the steps a driver usually climbs before reaching F1.

**What you will be able to do by the end of this guide:** explain each cloud concept (account, identity, network, virtual machine, container, database, serverless, observability, content delivery, secrets, and DNS) in a neutral way and then translate it to both providers; read an IAM policy and an RBAC role definition and say what each one allows; design a network with public and private subnets and know which firewall (Security Group, NACL, or NSG) handles what; run a Kubernetes Deployment on your machine that runs the same on EKS and AKS; write the same HTTP function for Lambda and for Azure Functions; query logs with CloudWatch Logs Insights and with KQL; and build a study plan for certifications on both sides.

**How each stage is organized:**

1. **The problem**: a concrete scenario that hurts.
2. **The concept, once, in a neutral way**: the idea holds for any provider.
3. **AWS x Azure equivalence table**: the stage's service map.
4. **Commented example on both providers**: commands and code side by side.
5. **Where they really differ**: model differences that trip up anyone who only memorizes the table.
6. **Hands-on**: practice with read commands first, then (optionally) creation with a cleanup block for both providers.
7. **Exercises with answer key**, **remember this**, and **stage checklist**.

**Prerequisites and tools:**

- A terminal with `bash`, `curl`, and `python3`. Linux, macOS, or WSL will do.
- For the AWS part: AWS CLI v2 (`aws --version`) and an AWS account. For the Azure part: Azure CLI (`az version`) and an Azure account. You can study with only one of the two, but the value of the guide is in doing both.
- For Stage 05, optionally: Docker, `kind` (or `minikube`), and `kubectl`, which let you practice Kubernetes without any cloud account.
- In the commands, `<ID>`, `<NOME-UNICO>`, and similar are placeholders that you replace with your own values. The outputs shown are examples: IDs, dates, and names vary in your account.

> **Cost warning (read before any practice).** Creating cloud resources generates charges, even on a free account, if you go over the limit or forget something running. That is why this guide follows three rules: (1) it always starts with **read commands**, which create nothing; (2) when there is creation, it is marked as **optional** and uses the smallest possible resource; (3) every creation comes with a **Cleanup** block for both providers. The free tier and free account rules **change over time** on both sides (the lesson mentions 12 months of Free Tier on AWS; check the current offer on the official site before counting on it). Set up a budget with a spending alert at the start (AWS Budgets, Azure Cost Management) and use the official price calculators (AWS Pricing Calculator and Azure Pricing Calculator). This guide does not reproduce prices.

**Naming convention in the exercises:** on Azure, everything lives inside a *resource group*. We will use `rg-lab` and, to delete everything at once, `az group delete`. Since each stage's cleanup deletes `rg-lab`, every Azure part that uses the group begins by recreating it with `az group create --name rg-lab --location brazilsouth` (the command does not fail if the group already exists). If the previous cleanup used `--no-wait`, wait for the deletion to finish with `az group wait --deleted --name rg-lab` before recreating. On AWS, note the ID of each resource created so you can delete it later.

## Mapping table: paste this on the steering wheel

The same analogy holds from the beginning to the end of the document. If the virtual machine is a complete garage in Stage 04, it is still a complete garage when it becomes a Kubernetes node in Stage 05. Only the central pieces are listed here; each analogy is explained again at the point where it appears. The complete table, with all the analogies used, is in the [Appendix: complete mapping table](#appendix-complete-mapping-table), at the end of the document.

One rule holds for the whole document: **AWS and Azure do not become F1 teams.** Both providers enter the analogy in the same way, as two different circuits where the same team operates. Each row below holds equally for the AWS service and for the Azure service in the equivalence table.

| Cloud (AWS and Azure) | Formula 1 |
|---|---|
| Cloud provider (AWS or Azure) | The circuit: its own facilities, and the team's procedure is the same on both |
| Region and availability zone | The host city where the circuit has facilities, and the physically separate garage buildings inside it, each with its own power and network |
| AWS account and Azure subscription | The team's contract with the circuit: facilities, access, and billing isolated from the other teams |
| Shared responsibility | The circuit looks after the track, barriers, and power; the team looks after the car, the garage, and who enters it |
| Identity and permission (IAM, Entra ID, and Azure RBAC) | The pass: each person with their own, opening only the areas they need, and the turnstile recording everything |
| Virtual network (VPC, VNet) and firewalls | The team's fenced area in the paddock: sectors, gates to the street, and marshals at the doors |
| Virtual machine (EC2, Azure VM) | A complete garage, with its own generator and systems (the entire operating system) |
| Container, Pod, and orchestrator (EKS, AKS) | The car assembled from the specification, and the wall that keeps on track as many cars as the spec sheet asks for |
| Serverless (Lambda, Azure Functions) | The station that the circuit only opens when a request arrives; the first cold call is the out-lap |
| Metrics, events, and logs (CloudWatch, Azure Monitor) | The telemetry, the race control messages, and the radio with the car's record |
| CDN, load balancer, and object storage | The forward parts depots, the pit lane entry, and the central warehouse |
| Secrets, certificates, and DNS | The combination vault, the Super Licence with an expiry date, and the entry list |

## Where the comparison stops

The analogy organizes the reasoning, but it does not replace the technical model. The main limits, which I repeat in the text when they appear:

- **You do not choose the circuit.** The calendar decides where the team races. In the cloud, the choice of provider is yours, and you can use both at the same time.
- **Scale.** F1 has two cars per team and one garage per circuit. In the cloud you spin up one, fifty, or five thousand machines and delete them all in minutes.
- **Billing by use.** No circuit facility charges by the second of use. The cloud does, and that is why cleanup at the end of each practice matters.
- **A copy is not a part.** A physical part exists in one unit; images, objects, and secrets can be copied without limit. That is why a leaked secret must be revoked and replaced, not just "taken back".
- **The cost cap punishes; the budget warns.** The cost cap is a rule with a penalty. The budget alert that this guide sets up (AWS Budgets, Cost Management) warns when spending passes the limit, but does not shut anything down by itself.
- **Same role, different models.** An analogy holds for the AWS x Azure pair, but the model differences in each "Where they really differ" section still apply. A row in the equivalence table is not a promise of parity.

Whenever there is a conflict between the track and the terminal, what is in the terminal prevails: definitions, commands, and expected outputs of the technical text.

---

## Stage 01: Introduction to the cloud, with AWS and Azure

*THE LIGHTS ARE OUT! The start of the GP, and the first straight is for finding out where you are: which circuit, which host city, which garage building, and who answers for what. It seems simple, but this is where the cost discipline that will stay with you until the checkered flag is born. Stay with me.*

### The problem

A retailer prepares for Black Friday. In the traditional model (on-premises), it buys extra servers just for the peak: weeks to buy, install, and configure. Once the date passes, the machines sit idle, costing energy, space, and maintenance. And if the campaign goes viral beyond forecast, there is no spare machine and the site goes down. Even setting up a simple test environment could take weeks (buying hardware, installing the operating system, pulling cable).

The cloud solves this by offering processing, storage, and network **on demand**, billed by use, through an API.

### The concept, in a neutral way

**Analogy:** the cloud is like the electric grid. You do not build a power plant to turn on the shower; you plug into the outlet and pay for consumption. The provider is the utility company.

**Cockpit perspective:** an F1 team does not build a racetrack to race. It arrives at the circuit, occupies the garage the circuit offers, plugs into the power and network there, and pays for the use of the facilities. Building your own racetrack would be on-premises. In our map, the **cloud provider is the circuit**, and AWS and Azure are two different circuits. The geography goes like this: the **region** is the host city where the circuit keeps facilities (the São Paulo region is `sa-east-1` on AWS and `brazilsouth` on Azure, the same city as Interlagos), and each **availability zone** is a physically separate garage building inside that host city, with its own power and network, connected to the others by a fast network. Spreading the application across zones is not leaving both cars depending on the same generator. **Here the analogy stops:** no racetrack has facilities in several cities or redundant garage buildings; the provider has dozens of regions, and that physical redundancy is what you are buying.

Ideas that hold for any provider:

- **On demand and pay-as-you-go:** you provision in minutes and pay for what you use (compute minutes, GB stored, requests). It eliminates the upfront investment in hardware.
- **Elasticity:** adjusting resources to demand, without forecasting capacity months in advance.
- **Economies of scale:** providers serve hundreds of thousands of customers, which drives down the unit price.
- **Regions and Availability Zones (AZs):** the infrastructure is organized into Regions (geographic areas, such as "São Paulo") and, inside them, into zones: physically separate data centers connected by a fast network. Distributing the application across zones tolerates failures; choosing the right region reduces latency and meets legal data location requirements.
- **Ways to access:** web console, command line (CLI), SDKs inside the code, and Infrastructure as Code (IaC), which describes environments in versioned files.
- **Shared responsibility:** the provider takes care of **security of the cloud** (data centers, hardware, base network). You take care of **security in the cloud** (configuration, data, access). The level of responsibility varies by service: on a VM you take care of more things than on a serverless function.
- **Accounts and governance:** each account is an isolated environment (resources, users, permissions, billing). In companies, a central service groups accounts to apply policies, spending limits, and organization by business unit.
- **Purchase models:** on demand, reserved (a discount in exchange for a 1 or 3 year commitment), spot (idle capacity at a discount, but interruptible), and monthly minimum spend plans.
- **Cost best practices:** shut down what you do not use, clean up old volumes and snapshots, use budgets and tags by team, project, or customer.
- **Best practices framework:** providers publish architecture guides. The AWS Well-Architected Framework has six pillars (the lesson details them in the following stages).

According to the lesson, AWS launched its first commercial services in 2006 (S3 and EC2) and offers more than 200 services (ref. jun/2025, according to the material). The lesson's categories: compute, storage, database, networking, security, and machine learning.

**Cockpit perspective:** shared responsibility is the division of every race weekend. The circuit answers for the track, the barriers, the power, and the structure of the garages: that is **security of the cloud**. The team answers for the car, the set-up, who enters the garage, and the data it brings: that is **security in the cloud**. If the team leaves the garage door open, the circuit is not to blame. And the boundary moves depending on the service: on a VM the team looks after almost everything inside the garage; on a serverless function the circuit hands over the station already assembled and the team only brings the procedure.

**Cockpit perspective:** the purchase models also look like the paddock. On demand is paying for the garage only on the weekend you race. Reserved is signing a 1 or 3 year contract in exchange for a discount. Spot is the capacity that was left over at the circuit, sold cheaper, which the circuit can take back at any moment: it suits work that can stand being interrupted, never the session that earns points. And cost best practices call for a budget alert, which is the personal version of the F1 **cost cap**, the annual limit that the regulations impose on each team. **Here the analogy stops:** the cost cap is a rule with punishment; the budget alert configured in this guide only warns, and does not shut anything down on its own.

### AWS x Azure equivalence

| Concept | AWS (as in the material) | Azure (addition) |
|---|---|---|
| Unit of isolation and billing | AWS account | Subscription, inside a Microsoft Entra tenant |
| Multi-account governance | AWS Organizations | Management Groups (group subscriptions) |
| Logical grouping of resources | No direct equivalent (tags and CloudFormation stacks fill part of the role) | Resource Group (mandatory: every resource lives in one) |
| Geography | Region and Availability Zone | Region and Availability Zones (not every region has zones) |
| São Paulo | `sa-east-1` | `brazilsouth` (Brazil South) |
| Web console | AWS Management Console | Azure Portal |
| CLI | `aws` | `az` |
| Browser shell | AWS CloudShell | Azure Cloud Shell |
| SDK | boto3 (Python) and others | Azure SDK (for example, `azure-*` packages for Python) |
| Native IaC | CloudFormation (and CDK) | ARM templates and Bicep |
| Multi-provider IaC | Terraform | Terraform |
| Compute | EC2, Lambda, ECS, EKS, Batch | Virtual Machines, Functions, Container Apps, AKS, Azure Batch |
| Object storage | S3 | Blob Storage (inside a storage account) |
| Block disk | EBS | Managed Disks |
| Shared files (NFS) | EFS | Azure Files |
| Managed relational database | RDS | Azure SQL Database, Azure Database for PostgreSQL and MySQL |
| NoSQL | DynamoDB | Cosmos DB |
| Data warehouse | Redshift | Azure Synapse Analytics (and Microsoft Fabric; check the current name) |
| Virtual network | VPC | Virtual Network (VNet) |
| Identity and access | IAM | Microsoft Entra ID + Azure RBAC |
| Budget and cost | AWS Budgets, Cost Explorer | Microsoft Cost Management (budgets and cost analysis) |
| Reservations and plans | Reserved Instances, Savings Plans, Spot | Azure Reservations, Savings Plan for compute, Spot VMs |
| Best practices framework | Well-Architected (six pillars) | Azure Well-Architected Framework (five pillars) |
| Security model | Shared responsibility | Shared responsibility (same idea) |

**Cockpit perspective:** the table is the floor plan of the two circuits side by side. The AWS account and the Azure subscription are the **team's contract with the circuit**: what sits inside it (facilities, access, billing) does not mix with that of another team. AWS Organizations and Management Groups are the structure for whoever has more than one team: Red Bull, for example, owns Red Bull Racing and Racing Bulls, and a rule from the parent company can apply to both. The Azure Resource Group is a **garage set up inside the contract**: everything in it leaves together when you hand it back. On AWS there is no such garage with its own door; tags and stacks fill part of the role.

### Commented example: finding out where you are

First, who am I and in which account/subscription am I operating. Read commands, no cost.

**AWS:**

```bash
# Shows the authenticated identity and the account (creates nothing)
aws sts get-caller-identity
```

Expected output (example):

```json
{
    "UserId": "AIDAEXAMPLEID",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/ana.dev"
}
```

```bash
# Lists the regions enabled in your account, as plain text
aws ec2 describe-regions --query "Regions[].RegionName" --output text
# Output: names separated by spaces, including sa-east-1 and us-east-1

# Lists the availability zones of a region
aws ec2 describe-availability-zones --region sa-east-1 \
  --query "AvailabilityZones[].ZoneName" --output text
# Expected output: sa-east-1a sa-east-1b sa-east-1c
```

**Azure (addition):**

```bash
# Authenticates in the browser (once per session)
az login

# Shows the active subscription and the tenant (creates nothing)
az account show --output table

# Lists the regions available for your subscription
az account list-locations --query "[].name" --output tsv
# Output: one name per line, including brazilsouth and eastus
```

**Cockpit perspective:** before touching anything, the mechanic checks which garage he is in and with which pass. `aws sts get-caller-identity` and `az account show` are exactly that: who am I and under which contract am I operating. Getting the account wrong is assembling the car in the neighbor's garage.

### Where they really differ

- **Account x (tenant + subscription):** on AWS, the account brings together identity (IAM users), resources, and billing. On Azure, **identity** lives in the Microsoft Entra ID tenant and **billing and resources** live in subscriptions. One tenant can have several subscriptions. This changes how you think about isolation and about who administers what.
- **Resource Group:** a concept with no exact counterpart on AWS. Every Azure resource belongs to a group, and deleting the group deletes everything inside. It is the reason "cleanup" on Azure is so simple.
- **Zones:** on AWS, each subnet is born tied to a zone (Stage 03). On Azure, zones are an attribute chosen per resource (for example, per VM), and the VNet spans the entire region. On both, the logical name of the zone can point to different physical locations across accounts or subscriptions.
- **Frameworks:** AWS Well-Architected has six pillars; the Microsoft equivalent has five. The lists are not identical, so do not memorize one as the translation of the other.

**Here the analogy stops:** on AWS, the contract (the account) brings together the people, the facilities, and the billing. On Azure, the registry of people (the Entra ID tenant) is separate from the contracts for use and billing (the subscriptions), and one registry can have several contracts. Read "contract" as a didactic label: neither model has an exact counterpart in the paddock, and it is the difference between them that weighs in day to day.

### Hands-on

*First exit from the pit box! Three parts: confirm which contract you are in, arm the cost cap alarm, and, if you want, set up the `rg-lab` garage that will serve the next stages. Reading before creating, always.*

**Part 1: reading (no cost).** Run the commands from the previous section on the provider you have. Observe: (a) the account number or the subscription ID; (b) that `sa-east-1` and `brazilsouth` are each one's "São Paulo region"; (c) how many zones AWS lists for `sa-east-1`.

**Part 2: budget (recommended).** Create a low monthly budget with an email alert: in the AWS console (Billing, Budgets) and in the Azure Portal (Cost Management, Budgets). It is the "safety lock" for all the next stages.

**Cockpit perspective:** it is your personal cost cap, with the alarm sounding before you blow it. Set it up before leaving the pit box for the first time.

**Part 3: optional creation (practically zero cost).** Create an empty resource group on Azure. The cleanup right below deletes it; that is why each following stage that uses `rg-lab` begins by recreating it:

```bash
# Azure (addition)
az group create --name rg-lab --location brazilsouth
# Expected output: JSON with "provisioningState": "Succeeded"
```

On AWS there is no equivalent needed; go straight to Stage 02.

**Cleanup:**

```bash
# Azure (addition): deletes the group and everything that exists inside it
az group delete --name rg-lab --yes --no-wait
# Before recreating rg-lab in the next stage, wait for the deletion to finish:
az group wait --deleted --name rg-lab
# AWS: nothing was created in this stage
```

*Lap complete! Three questions, without looking at the text: data location, Black Friday peak, and who applies the patch.*

**Exercises**

1. An app stores data of Brazilian customers and the law requires it to stay in Brazil. Which global infrastructure concept comes into play? Name the regions on both providers.
2. On Black Friday your load multiplies by ten for two days. Why is the cloud cheaper than buying servers? Which purchase model would you avoid for those two days?
3. On a VM (IaaS) and on a serverless function, who is responsible for applying patches to the operating system?

**Answer key**

1. Regions and data location. `sa-east-1` (AWS, São Paulo) and `brazilsouth` (Azure, Brazil South).
2. You pay only for the peak during the two days and return the capacity afterward. Avoid a 1 or 3 year commitment (reservations) for a short peak; on demand covers the case (and spot only works if the load tolerates interruption).
3. VM: you (security *in* the cloud, greater responsibility). Serverless: the provider looks after the execution environment; you look after the code, the data, and the access.

**Remember this:** the cloud is on-demand capacity billed by use, organized into regions and zones, with security split between provider and customer; AWS and Azure offer the same building blocks with different names and organizational models.

**Stage 01 checklist**

- [ ] I can explain on-premises x cloud with the Black Friday example.
- [ ] I can say what a region and an availability zone are.
- [ ] I can divide responsibility between provider and customer.
- [ ] I know the difference between an AWS account and an Azure tenant + subscription.
- [ ] I have set up (or know how to set up) a budget with an alert.

*Sector 1 in green! You know which circuit you are on, you know the host city and the garage buildings, and the budget alarm is already armed. Now comes the first high-speed corner of the circuit: who can enter where. Stage 02, identity and access.*

---

## Stage 02: Identity and access (IAM x Entra ID + Azure RBAC)

*Second sector, and the sign at the entrance to the corner already carries a warning: the Capital One case. The infrastructure was standing; the problem was too much permission in the hands of someone who did not need it. Here you learn to hand out passes with a closed fist.*

### The problem

In 2019, according to the case in the material, Capital One suffered a data breach affecting more than 100 million customers. A credential tied to a web application firewall was configured with excessive permissions and allowed listing and copying data from S3 buckets. The failure was not in AWS's infrastructure, but in the customer's access configuration. Lesson: a robust system is worth nothing if the permissions are loose.

### The concept, in a neutral way

**Analogy:** the badge of an office building. Each person has their own (identity), with access only to the floors they need (permissions). A new employee receives the badge of the department group. A contractor gets a temporary badge. Cameras record who entered where and when (auditing).

**Cockpit perspective:** in the paddock this is literal. Each person has their own **pass**, and the pass opens only the areas they need: whoever works in hospitality does not enter the pit lane, the tire mechanic does not sit on the wall, the guest gets a one-day pass. At the turnstile, the pass is read and the record stays: who entered, where, and when. **Authentication** is the turnstile checking that the pass is yours; **authorization** is the turnstile knowing which doors it opens. **Least privilege** is nobody having a pit lane pass "just in case". The Capital One case, in the paddock, would be a service pass with too broad access, obtained through a gap in a badly configured gate: the track was safe, the error was in who received access to what.

Concepts that hold for any provider:

- **Authentication** answers "who are you?"; **authorization** answers "what can you do?".
- **Principle of least privilege:** each identity has only what is necessary.
- **Human identities:** individual users, never shared, with MFA. Group users into **groups** and give permissions to the group, so that promotions and team changes become just a group swap.
- **Machine identities:** services and applications assume a temporary identity, inherit permissions, run, and release the session. It avoids access keys written in code, one of the most common failures.
- **Policies:** rules that say who can perform which action, on which resource, under which conditions.
- **Root account/supreme administrator:** exists from the creation; protect it with MFA and use it only for critical tasks.
- **Multi-account governance:** a maximum limit of permissions imposed from the top down over several accounts.
- **Auditing and detection:** record every action (who, what, when, from where) and use services that detect anomalous behavior.

**Cockpit perspective:** machine identity is the **pass attached to the equipment**. Think of the data truck that needs to enter the technical area: instead of someone leaving a human pass on the dashboard (the access key written in the code), the circuit issues a pass tied to that vehicle, valid for a short time and renewed on its own. There is no paper to lose or photograph. On AWS this is the **IAM Role** assumed by the service; on Azure, the **Managed Identity**. The root account is the master pass of the contract owner: it stays in the vault, with MFA, and only comes out for critical tasks.

### AWS x Azure equivalence

| Concept | AWS (as in the material) | Azure (addition) |
|---|---|---|
| Identity directory | IAM (users, groups) | Microsoft Entra ID (users, groups) |
| Permission over resources | JSON IAM policies attached to a user, group, or role | Azure RBAC: assignment of a role to an identity at a scope |
| Permission rule | Statement (Effect, Action, Resource, Condition) | Role definition (Actions, NotActions, DataActions, AssignableScopes) |
| AWS managed policy | `AmazonS3FullAccess` etc. | Built-in roles (Reader, Contributor, Owner, Storage Blob Data Reader...) |
| Custom policy | Customer managed policy | Custom role |
| Service identity | IAM Role (EC2, Lambda, ECS) | Managed Identity (system-assigned or user-assigned) |
| Assuming a temporary identity | STS AssumeRole | Managed Identity / workload identity (token obtained without a secret) |
| Single sign-on and federation | IAM Identity Center (AWS SSO), federation with AD, Google, Okta | Entra ID itself, with federation and SSO |
| Multi-account: permission ceiling | AWS Organizations + SCP | Management Groups + Azure Policy (approximation, see the differences) |
| Action auditing | CloudTrail | Activity Log (control plane) and Diagnostic settings (resource logs) |
| Threat detection | Amazon GuardDuty | Microsoft Defender for Cloud |
| Analysis of exposed access | IAM Access Analyzer | Defender for Cloud recommendations (approximation; not 1 to 1) |
| Temporary privilege elevation | (not mentioned in the material) | Privileged Identity Management (PIM; check the required licensing) |
| Permission simulation | Policy Simulator | Access check on the Access control (IAM) screen of the portal |

**Cockpit perspective:** on both circuits, the pieces are the same: a pass (the identity), the areas it opens (the permissions), and the turnstile record (CloudTrail on AWS, Activity Log on Azure). GuardDuty and Defender for Cloud play the role of the security staff who watch the cameras and notice someone trying to open ten doors in one minute.

### Commented example: the same rule in both models

**Requirement:** allow uploading objects (files) to a specific repository, only from one IP, with MFA and within a time window.

**AWS: IAM policy in JSON** (from the material):

```json
{
  "Version": "2012-10-17",            // policy language version
  "Statement": [
    {
      "Sid": "PutObjectWithConditions", // rule name (optional)
      "Effect": "Allow",                // grants (Deny would block, and always wins)
      "Action": "s3:PutObject",         // operation: upload object
      "Resource": "arn:aws:s3:::meu-bucket/*", // on which objects (ARN)
      "Condition": {                    // additional restrictions
        "IpAddress":  { "aws:SourceIp": "203.0.113.0/24" },       // only from this IP
        "Bool":       { "aws:MultiFactorAuthPresent": "true" },   // only with MFA
        "DateGreaterThan": { "aws:CurrentTime": "2025-05-13T13:00:00Z" }, // after
        "DateLessThan":    { "aws:CurrentTime": "2025-05-13T21:00:00Z" }  // before
      }
    }
  ]
}
```

(The `//` comments are didactic; real JSON does not accept them, so remove them before use. The same applies to every commented JSON block in this guide.)

**Azure (addition): custom role definition**, which describes only *what* can be done and *where* it can be assigned:

```json
{
  "Name": "Gravador de blobs do projeto X",   // role name
  "IsCustom": true,                            // it is a custom role
  "Description": "Permite gravar blobs no resource group rg-app.",
  "Actions": [],                               // control plane operations (none)
  "NotActions": [],                            // exclusions from Actions
  "DataActions": [                             // operations on the DATA (data plane)
    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write"
  ],
  "NotDataActions": [],
  "AssignableScopes": [                        // where this role can be assigned
    "/subscriptions/<ID-DA-ASSINATURA>/resourceGroups/rg-app"
  ]
}
```

(Note: the `//` comments are only didactic. Before using the file in `az role definition create --role-definition @arquivo.json`, remove them, otherwise the JSON is rejected.)

Notice what is **not** there: IP, MFA, and time. On Azure these conditions live in other layers: Entra ID **Conditional Access** handles requiring MFA and restricting by network location; **PIM** allows time-limited access (check the required licensing); and there are *role assignment conditions* (ABAC) to refine certain assignments, such as blob data ones. A fixed time window, as in the AWS example, has no direct equivalent in a role.

**Cockpit perspective:** the AWS policy is a pass with everything printed on the card itself: the door, the gate you may come from, the requirement to check your face (MFA), and the validity hours. The Azure role prints only *what* the pass opens; *where* it is valid comes from the assignment (the scope), and the network, MFA, and time conditions sit at other counters (Conditional Access, PIM, assignment conditions). The result may be similar; the path to it is different.

The role is then **assigned** to an identity at a scope:

```bash
# Azure (addition): gives a group the built-in blob reader role, only on the resource group
# The group ID comes from: az ad group show --group <NOME-DO-GRUPO> --query id -o tsv
az role assignment create \
  --assignee <ID-DO-OBJETO-DO-GRUPO> \
  --role "Storage Blob Data Reader" \
  --scope /subscriptions/<ID-DA-ASSINATURA>/resourceGroups/rg-app
```

**The machine role (EC2S3AccessRole from the material) on both sides.** AWS: a role with a *trust policy* (who can assume it) and a *permission policy* (what it can do):

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ec2.amazonaws.com" },  // who can assume: the EC2 service
    "Action": "sts:AssumeRole"                         // action of assuming the role
  }]
}
```

(Remove the `//` comments before using this trust policy; real JSON does not accept them.)

Azure (addition): a **Managed Identity** is attached to the VM and a role is assigned to it at the desired scope. This is a read example: `vm-lab` is only created in Stage 04, so run these commands after it.

```bash
# Enables the managed identity (system-assigned) on the VM and prints its ID
az vm identity assign --resource-group rg-lab --name vm-lab --query systemAssignedIdentity -o tsv
# Grants blob read to that identity (there is no password or key to leak)
az role assignment create --assignee-object-id <ID-IMPRESSO-ACIMA> \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Reader" --scope <ID-DA-STORAGE-ACCOUNT>
```

**Multi-account governance.** AWS: an SCP that denies EC2 across the entire organization, even if an account's IAM allows it:

```json
{
  "Version": "2012-10-17",
  "Statement": [{ "Effect": "Deny", "Action": "ec2:*", "Resource": "*" }]
}
```

Azure (addition): an **Azure Policy** rule that denies the creation of virtual machines in the scope (management group, subscription, or resource group):

```json
{
  "if":   { "field": "type", "equals": "Microsoft.Compute/virtualMachines" },
  "then": { "effect": "deny" }
}
```

This excerpt is only the **rule** (`policyRule`); a complete definition also has `mode` and, when applicable, `parameters`. This rule has no parameters, and the CLI assembles the rest. To test it (optional, free), save the rule in `regra.json` and run:

```bash
# Azure (addition): creates the definition from the rule and assigns it to the resource group
az group create --name rg-lab --location brazilsouth
az policy definition create --name negar-vm --rules regra.json --mode All
az policy assignment create --name negar-vm --policy negar-vm \
  --scope $(az group show --name rg-lab --query id -o tsv)
# Cleanup: removes the assignment and then the definition
az policy assignment delete --name negar-vm --scope $(az group show --name rg-lab --query id -o tsv)
az policy definition delete --name negar-vm
az group delete --name rg-lab --yes --no-wait
```

**Cockpit perspective:** multi-account governance is the rule from the parent company. When a group owns more than one team (like Red Bull, with Red Bull Racing and Racing Bulls), the parent company can forbid something for both, and no team principal can release it on their own. That is the role of the SCP on AWS. Azure Policy, in the example above, does a neighboring job: instead of limiting what a pass can do, it blocks the assembly of a type of equipment in the garage (here, virtual machines). **Hypothetical:** the situation of a parent company issuing a rule for both teams is an illustration of the concept, not a fact of the season.

*Careful, the race is heating up! This is the stretch that trips up most people who only memorized the table: a Deny that beats everything on one side, permissions that only add up on the other, and owning the garage without being able to open the car's data. This is where the point scorers are separated from the rest of the grid.*

### Where they really differ

- **Policy JSON x RBAC by scope.** On AWS, the policy carries the four pieces (effect, action, resource, condition) and is attached to an identity. On Azure, the role defines only **allowed actions**; the **resource** comes from the **scope** of the assignment (management group, subscription, resource group, or the resource itself) and inheritance flows from top to bottom.
- **Deny.** On AWS, an explicit `Deny` beats any `Allow`, and you write it in the policy. On Azure RBAC, the model is **additive**: permissions add up. `NotActions` only excludes actions *of that role*, it is not a global block. Real blocks come from Azure Policy (over resources), *deny assignments* (created by services such as managed applications), and resource locks.
- **SCP x Azure Policy.** Both form governance guardrails, but they act differently. The SCP is a **permission ceiling** for the accounts of an organization. Azure Policy evaluates **properties and configurations of resources** (allowed region, resource type, mandatory tags). They are not exact translations; the identity permission ceiling on Azure results from the combination of RBAC, Policy, and Conditional Access.
- **Control plane x data plane.** Azure separates `Actions` (managing the resource) from `DataActions` (reading and writing the content). Whoever is Owner of a storage account does not read blobs for that reason alone, if data access is through Entra ID.
- **Groups.** In IAM, groups do not nest (according to the material). In Entra ID, security groups can contain other groups, with some limitations per scenario; check the documentation before depending on it.

**Here the analogy stops:** the explicit `Deny` on AWS is the prohibition that beats any authorization: if one rule says "no entry", it does not matter how many say "enter". On Azure RBAC permissions only add up, like passes that keep accumulating areas; to prohibit, you go to another counter (Azure Policy, resource lock, deny assignment). In the real paddock there is a single credentialing; in the cloud there are several mechanisms, and confusing them is the origin of many improper accesses. And Azure's **control plane x data plane** separation is the detail that misleads most: being the owner of the garage (Owner) does not, by itself, give access to the car's data (the blobs) when access is through Entra ID. Managing the resource and reading what is inside it are different passes.

### Hands-on

*Pit lane open! First you check the passes that already exist, then you validate a policy without touching the cloud and, if you want, create a read group on both circuits. Nothing here generates charges.*

**Part 1: reading (no cost).**

AWS:

```bash
aws sts get-caller-identity                 # who am I
aws iam list-users --query "Users[].UserName" --output text   # IAM users (if you have permission)
aws iam list-groups --query "Groups[].GroupName" --output text
# Observe: is there an individual user of yours or are you using the root? (the root should be avoided)
```

Azure (addition):

```bash
az account show --query "{assinatura:name, tenant:tenantId, usuario:user.name}" -o table
# Lists the role assignments of your user, at all scopes
az role assignment list --assignee <SEU-E-MAIL> --all -o table
# Inspects what the built-in "Reader" role allows
az role definition list --name "Reader" -o json
# Observe in "Actions" the provider/type/operation pattern, and that "Reader" only has reads
```

**Part 2: validate a policy locally (no cloud).** Save the read policy from the material in `politica.json`:

```bash
cat > politica.json <<'EOF'
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"s3:GetObject","Resource":"arn:aws:s3:::meu-bucket/*"}]}
EOF
python3 -m json.tool politica.json
# Expected output: the same JSON formatted and indented. If a comma is missing, it reports the error.
```

**Part 3: optional creation (free).** Creating groups and role assignments does not generate charges.

```bash
# AWS: group with a read-only managed policy
aws iam create-group --group-name estudo-leitores
aws iam attach-group-policy --group-name estudo-leitores \
  --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess
aws iam get-group --group-name estudo-leitores   # check that the group exists

# Azure (addition): Entra ID group and assignment of the Reader role to the group, on the resource group
az group create --name rg-lab --location brazilsouth
az ad group create --display-name estudo-leitores --mail-nickname estudo-leitores
# Saves the ID of the newly created group (it is what the assignment uses)
GRUPO_ID=$(az ad group show --group estudo-leitores --query id -o tsv)
az role assignment create --assignee-object-id "$GRUPO_ID" \
  --assignee-principal-type Group --role "Reader" \
  --scope $(az group show --name rg-lab --query id -o tsv)
```

(On Azure, creating groups requires permission in the tenant; student or corporate accounts may block it. If it fails, the reading in Part 1 already meets the goal.)

**Cleanup:**

```bash
# AWS
aws iam detach-group-policy --group-name estudo-leitores \
  --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess
aws iam delete-group --group-name estudo-leitores
# Azure (addition)
az ad group delete --group estudo-leitores
az group delete --name rg-lab --yes --no-wait
# Before recreating rg-lab in the next stage, wait for the deletion to finish:
az group wait --deleted --name rg-lab
```

*Timed pit stop! Read a policy, decide who wins between Allow and Deny, and deliver access with no key in the code. Clock running.*

**Exercises**

1. Read: `{"Effect":"Allow","Action":["ec2:DescribeInstances"],"Resource":"*"}`. What does it allow? Is it dangerous to use `"*"` here?
2. A user is in a group with `AmazonS3FullAccess`, but also has a policy with `Deny` on `s3:DeleteObject`. Can they delete objects? And on Azure, if they have a role that allows deleting blobs, how do you block that only for one resource group?
3. An application on a VM needs to read a bucket/container. How do you deliver access without storing a key in the code, on both providers?

**Answer key**

1. It allows listing/describing EC2 instances, read only. Acceptable with `"*"` because it is a read; to limit it to a specific instance, replace it with the ARN.
2. No: the explicit `Deny` always prevails. On Azure, since RBAC is additive, blocking by scope is done with Azure Policy or a resource lock (or by removing/limiting the role at the scope), not with a "deny" inside the role.
3. AWS: IAM Role attached to the instance (instance profile) with read permission. Azure: Managed Identity on the VM with the Storage Blob Data Reader role at the storage account scope.

**Remember this:** give each identity the minimum necessary, prefer a temporary machine identity over a key in code; on AWS the scope lives inside the policy, on Azure it lives in the role assignment.

**Stage 02 checklist**

- [ ] I can explain Effect, Action, Resource, and Condition in an IAM policy.
- [ ] I can say why Deny wins on AWS and how Azure RBAC differs.
- [ ] I know what a role (AWS) and a Managed Identity (Azure) are and when to use them.
- [ ] I know the difference between SCP and Azure Policy.
- [ ] I know which service audits actions (CloudTrail and Activity Log).

*Sector 2 in green! Each person with their own pass, each machine with the pass attached to the equipment, and the turnstile recording everything. Now the team needs terrain: the fenced area in the paddock, with sectors, gates, and marshals. Stage 03, networks.*

---

## Stage 03: Networks (VPC x VNet)

*Third sector, and the layout gets technical. Address block, public and private subnet, route, NAT, and marshals at the doors: get it wrong here and not even the best car makes it to the grid. Keep the driver's rule, because it holds for the whole sector: what decides whether the sector is public is the route, not the sign.*

### The problem

A database was created in a subnet with a route to the internet and a rule opening the database port to "anywhere". Within hours, bots start trying passwords. A network configuration error can expose a database to the internet or, in the opposite direction, keep two internal systems from talking to each other. Before the cloud, building a network meant buying switches, routers, and pulling cables; in the cloud, the design is done by software, but the reasoning is still network reasoning.

### The concept, in a neutral way

**Analogy:** a gated community. The whole plot is the private network (block of IPs). Each apartment block is a subnet. The main gatehouse is the exit to the internet. The doorman of each building checks who enters (firewall).

**Cockpit perspective:** at the circuit, the network is the **team's fenced area in the paddock**. The IP block is the plot that the contract reserves; each subnet is a sector with its own function (the garage, the engineering room, the data truck). A sector is public when it has a gate to the street; what decides this is the **route**, not the name on the sign. The private sector receives no visits from outside, but it can send a messenger to fetch something outside and come back: that is **NAT**, outbound only. The **firewalls** are the marshals: the **stateful** marshal remembers who it let in and releases the reply without another check; the **stateless** marshal checks everything in both directions, with no memory.

- **Private virtual network:** a block of private IPs in CIDR notation, for example `10.0.0.0/16` (up to 65,536 addresses). Plan so as not to collide with company networks (important with VPN) and to have room to grow.
- **Subnets:** slices of the block (`10.0.1.0/24`, `10.0.2.0/24`...), each with a purpose (web, application, database).
- **Public x private:** what decides it is the **route**. If the subnet's traffic to `0.0.0.0/0` leaves through an internet gateway, it is public. Without that, it is private. Private subnets usually reach the internet through **NAT** (outbound only, without accepting inbound connections).
- **Route table:** says where each destination goes.
- **Firewalls:** one **stateful** layer (if the inbound was allowed, the reply returns on its own) and another **stateless** one (each direction needs a rule). Deny rules exist in some layers and not in others.
- **Connection between networks:** peering (point to point, **not transitive**), hub-and-spoke with a central router (transitive), VPN over the internet (IPsec), and a physical dedicated link (low latency, high stability).
- **Private access to managed services:** reaching a provider service (storage, database, API) without going out to the public internet.
- **Internal DNS and flow logs:** resolving names inside the network; recording traffic metadata for diagnostics and security.

**Cockpit perspective:** connections between networks also have an address in the paddock. **Peering** is a direct passage between the areas of two teams: A talks to B, B talks to C, but A does not cross B's area to reach C (it is not transitive). The **hub** is the central lane of the paddock, through which everyone passes. The **VPN** is an encrypted radio using the public network; the **dedicated link** is the exclusive connection between the circuit and the factory operations room, so the data goes and returns with low and stable latency.

### AWS x Azure equivalence

| Concept | AWS (as in the material) | Azure (addition) |
|---|---|---|
| Virtual network | VPC | VNet |
| Subnet | Subnet (tied to **one** AZ) | Subnet (spans the region; zones are a resource attribute) |
| Exit to the internet | Internet Gateway (IGW) | No dedicated gateway: public IP on the resource and default outbound (see the differences) |
| Outbound only for private subnets | NAT Gateway | NAT Gateway |
| Route table | Route table | Route table (user-defined routes, UDR) |
| Stateful firewall on the instance | Security Group | NSG (Network Security Group) |
| Stateless firewall on the subnet | NACL | NSG can also be associated with the subnet (there is no separate "NACL") |
| Peering between networks | VPC Peering | VNet Peering |
| Transitive central hub | Transit Gateway | Virtual WAN (or hub-and-spoke with its own routing) |
| Site-to-site VPN | Site-to-Site VPN | VPN Gateway |
| Dedicated link | Direct Connect | ExpressRoute |
| Private access to a service | VPC Endpoint (Interface and Gateway) | Private Endpoint (via Private Link) and Service Endpoint |
| Traffic logs | VPC Flow Logs | NSG flow logs and VNet flow logs (check the documentation for which is recommended) |
| Managed network firewall | AWS Network Firewall | Azure Firewall |
| Internal DNS | VPC DNS and Route 53 private zones | Azure-provided DNS and Azure Private DNS zones |

**Cockpit perspective:** the same fenced area exists on both circuits; what changes is the floor plan. On AWS, each sector (subnet) sits inside **one** garage building (a zone). On Azure, the sector extends across the whole host city, and each piece of equipment chooses which building it sits in.

### Commented example: the classic design, in read commands and free creation

The design: `10.0.0.0/16`, a public subnet `10.0.1.0/24` (web) and a private one `10.0.2.0/24` (database).

**AWS (read):**

```bash
aws ec2 describe-vpcs --query "Vpcs[].{id:VpcId,cidr:CidrBlock,padrao:IsDefault}" --output table
# Shows your VPCs; the one with "padrao: True" is the default (do not use it in serious projects)
aws ec2 describe-subnets --query "Subnets[].{id:SubnetId,az:AvailabilityZone,cidr:CidrBlock}" --output table
# Each subnet shows ONE availability zone
aws ec2 describe-route-tables --query "RouteTables[].Routes[].GatewayId" --output text
# Look for an "igw-..." value: it is the route to the Internet Gateway that makes a subnet public
```

**Azure (read, addition):**

```bash
az network vnet list --output table                       # your VNets
az network vnet subnet list --resource-group <RG> --vnet-name <VNET> --output table
az network nsg list --output table                         # existing NSGs
az network route-table list --output table                 # route tables
```

**Free creation (the network itself does not generate charges; NAT Gateway, VPN, and public IPs do):**

```bash
# AWS: creates the VPC and the design's two subnets (note the returned IDs)
aws ec2 create-vpc --cidr-block 10.0.0.0/16
# "web" subnet (10.0.1.0/24) and "banco" (database) subnet (10.0.2.0/24)
aws ec2 create-subnet --vpc-id <ID-DA-VPC> --cidr-block 10.0.1.0/24 --availability-zone sa-east-1a
aws ec2 create-subnet --vpc-id <ID-DA-VPC> --cidr-block 10.0.2.0/24 --availability-zone sa-east-1a
# Note: without an Internet Gateway and a route to it, both are still private.
# It is the route that would make "web" public; this lab does not create an IGW, to stay free.

# Azure (addition): recreates the group and creates the VNet already with the first subnet, and then the second
az group create --name rg-lab --location brazilsouth
az network vnet create --resource-group rg-lab --name vnet-lab \
  --address-prefixes 10.0.0.0/16 \
  --subnet-name snet-web --subnet-prefixes 10.0.1.0/24
az network vnet subnet create --resource-group rg-lab --vnet-name vnet-lab \
  --name snet-db --address-prefixes 10.0.2.0/24
```

**Firewall rule, the same intent in both models (allow SSH only from one IP):**

```bash
# AWS: Security Group with an inbound rule on port 22 only from your IP (the reply leaves on its own: stateful)
aws ec2 create-security-group --group-name sg-lab --description "lab" --vpc-id <ID-DA-VPC>
aws ec2 authorize-security-group-ingress --group-id <ID-DO-SG> \
  --protocol tcp --port 22 --cidr 203.0.113.10/32

# Azure (addition): NSG with an inbound rule; the priority (100 to 4096) defines the evaluation order
az network nsg create --resource-group rg-lab --name nsg-lab
az network nsg rule create --resource-group rg-lab --nsg-name nsg-lab \
  --name permitir-ssh --priority 100 --direction Inbound --access Allow \
  --protocol Tcp --destination-port-ranges 22 --source-address-prefixes 203.0.113.10/32
```

**Cockpit perspective:** the two commands give the marshal the same order: "at port 22, only those coming from this address get in". In the Security Group, the order is a list of authorizations and the marshal remembers who came in. In the NSG, each rule has a **priority** number, and the marshal reads from lowest to highest, stopping at the first one that applies.

*Braking point! One marshal or two? It is the question that confuses most people in this sector, and the answer changes from one circuit to the other. Read slowly, because this is where many people think they configured the firewall and configured only half of it.*

### Where they really differ

- **Subnet tied to a zone (AWS) x regional subnet (Azure).** On AWS, for high availability you create one subnet per zone. On Azure, one subnet covers the region and you distribute the resources across zones.
- **One firewall or two.** AWS separates the Security Group (stateful, allow only, on the instance or interface) from the NACL (stateless, allows and denies, ordered by number, on the subnet). The Azure **NSG** is **stateful**, accepts **Allow and Deny** rules, is ordered by **priority**, and can be associated with the **network interface (NIC)**, the **subnet**, or both. It brings together, in one object, parts of the two AWS concepts. The NSG has default rules (for example, internal VNet traffic allowed and external inbound denied by default).
- **Beware of a false friend:** "ASG" on Azure is *Application Security Group* (a grouping of NICs to use in NSG rules), not Auto Scaling Group.
- **Internet Gateway.** AWS requires the IGW and the explicit route. On Azure there is no equivalent resource: access depends on the resource having a public IP (or a configured outbound). Traditionally, VMs without a public IP had implicit *default outbound access*. Microsoft has been retiring this behavior for new networks in favor of explicit outbound (NAT Gateway, for example); check the current state in the documentation before depending on it.
- **CIDR.** According to the material, the VPC's CIDR cannot be changed after creation. On Azure, the VNet's address space can be edited (with care, for example, resyncing peerings). On both, planning ahead remains the cheap path.
- **Peering and transitivity.** Peering is non-transitive on both: A with B and B with C does not give A with C. For many networks, use a hub (Transit Gateway on AWS, Virtual WAN or hub-and-spoke on Azure).
- **Service Endpoint x Private Endpoint.** The Private Endpoint creates a network interface with a private IP in your subnet for the service (a concept similar to the Interface Endpoint). The Service Endpoint extends your subnet's identity to the service and routes over the Microsoft backbone, but the service keeps a public address. The AWS Gateway Endpoint (S3 and DynamoDB) is a route in the route table, which makes it closer, in spirit, to the Service Endpoint.

**Here the analogy stops:** AWS puts two different marshals: one at the door of each garage (Security Group: stateful, only authorizes) and another at the turnstile of the sector (NACL: stateless, authorizes and prohibits, in numeric order). Azure uses a single marshal, the NSG, which has memory, authorizes and prohibits, and can stand at the door (the NIC), at the sector turnstile (the subnet), or both. In the paddock they would be two easy-to-tell-apart people; in the cloud it is common for someone to think they configured "the firewall" and have configured only one of the two. And beware of the false friend: **ASG** on Azure is a grouping of interfaces for NSG rules, not an autoscaling group.

### Hands-on

*Installation lap! It starts at the calculator, with no cloud at all: how many addresses fit in the plot and how many /24 sectors come out of it. Then comes the reading and, if you want, the creation at no cost.*

**Part 1: calculate CIDR without the cloud.**

```bash
python3 - <<'EOF'
import ipaddress
rede = ipaddress.ip_network("10.0.0.0/16")
print("Endereços na rede:", rede.num_addresses)
subs = list(rede.subnets(new_prefix=24))
print("Sub-redes /24:", len(subs))
print("Primeiras três:", [str(s) for s in subs[:3]])
EOF
# Expected output:
# Endereços na rede: 65536
# Sub-redes /24: 256
# Primeiras três: ['10.0.0.0/24', '10.0.1.0/24', '10.0.2.0/24']
```

**Part 2: reading in the cloud.** Run the read commands from the previous section. Observe: (a) on AWS, which subnet has a route to `igw-...`; (b) on Azure, which NSGs exist and which subnets or NICs they are associated with.

**Part 3: optional creation (free, without NAT Gateway or public IP).** Run the creation of the network and the firewall above, then list again and check that your network and your NSG appear.

**Cleanup:**

```bash
# AWS (delete in order: dependents first)
aws ec2 delete-security-group --group-id <ID-DO-SG>
aws ec2 delete-subnet --subnet-id <ID-DA-SUBNET-WEB>
aws ec2 delete-subnet --subnet-id <ID-DA-SUBNET-BANCO>
aws ec2 delete-vpc --vpc-id <ID-DA-VPC>
# Azure (addition): deletes the VNet, subnets, and NSG at once
az group delete --name rg-lab --yes --no-wait
# Before recreating rg-lab in the next stage, wait for the deletion to finish:
az group wait --deleted --name rg-lab
```

*Lap complete! Three questions: dividing the plot, blocking a malicious IP across the whole subnet, and choosing between the direct passage and the central lane.*

**Exercises**

1. The VPC is `10.0.0.0/16`. How many `/24` subnets fit? And if you already use `10.0.0.0/16` on the company network and want a VPN to the cloud? What is the risk?
2. A malicious IP was identified and you want to block it for an entire subnet. Which resource do you use on AWS? And on Azure?
3. You have 12 networks that need to talk to each other. Peering or hub? Why?

**Answer key**

1. 256 `/24` subnets. If the blocks collide, routing becomes ambiguous and the VPN does not work; avoid CIDR overlap.
2. AWS: the subnet's NACL (allows denial). Azure: a high-priority Deny rule in an NSG associated with the subnet.
3. Hub (Transit Gateway or Virtual WAN): peering requires one direct connection per pair and is not transitive, which does not scale to 12 networks.

**Remember this:** cloud networking is route plus firewall; the subnet is public because of the route, and the Azure NSG does on its own what the Security Group and NACL pair does on AWS.

**Stage 03 checklist**

- [ ] I can divide a CIDR into subnets.
- [ ] I know what makes a subnet public or private.
- [ ] I know the difference between Security Group, NACL, and NSG.
- [ ] I know why peering does not scale and what replaces it.
- [ ] I know the difference between Private Endpoint and Service Endpoint.

*Sector 3 in green! Fenced terrain, sectors with the right route, and marshals at the doors. Now it is time to raise the first garage inside that area. Stage 04, virtual machines.*

---

## Stage 04: Virtual machines (EC2 x Azure Virtual Machines)

*Fourth sector! Now the garage comes off the paper: the right size for the job, a battery of credits for the peaks, and a cost difference between the two circuits that has already caught many people off guard. Eyes on the deallocate detail.*

### The problem

A store needs a web server for the promotion weekend. Buying a physical machine takes weeks, and sizing it for the peak leaves it idle the rest of the year. Worse: on Monday morning the load drops and you keep paying. A virtual machine in the cloud comes up in minutes and can be multiplied or shut down according to demand.

### The concept, in a neutral way

**Analogy:** renting a car by the day, choosing the model according to the trip (compact for the city, van for the family), instead of buying a car for every occasion.

**Cockpit perspective:** in our map, the **virtual machine is a complete garage**, with its own generator, network, and systems (the entire operating system), set up inside the circuit's facilities. You choose the size according to the weekend's work and hand it back when you are done. The circuit supplies the land and the real hardware; what you operate is your garage. **Here the analogy stops:** an F1 garage takes days to set up and there is one per team; a VM comes up in minutes, and you can have as many as the account allows.

- **Virtual machine (VM):** a server created by software, with its own operating system, network, and disks. It serves anything from simple applications to critical systems.
- **Size families:** chosen by CPU, memory, storage, and network (general purpose, compute optimized, memory optimized, with GPU, storage optimized).
- **Variable performance (burstable) instances:** they have a CPU baseline and accumulate **credits** when they use less than it; they spend the credits on peaks. Ideal for light loads with occasional peaks.
- **Image:** a preconfigured template (operating system, software, settings) used to create identical VMs. Custom images standardize environments and feed autoscaling.
- **Persistent disk:** block storage that survives the VM shutting down (operating system, databases, logs). It can be attached, resized, encrypted, and copied by snapshots.
- **Elasticity and autoscaling:** rules that create or remove VMs by metric (CPU, queue size) or by schedule (more machines at 8 am, fewer at 8 pm), ideally behind a load balancer.
- **Lifecycle:** running, stopped, terminated.
- **Fixed public IP:** an address that survives stops and can be reassociated with another VM in case of failure.
- **Access:** SSH key (public/private pair, no password) on Linux; RDP on Windows.
- **Costs:** on demand, reserved, spot (interruptible), and spend plan. Disks keep charging even with the VM stopped.

**Cockpit perspective:** variable performance instances work like the **ERS**. The ERS battery collects energy when the car is not using full power (under braking) and returns it on the straight, where it is worth time. The **CPU credits** accumulate when the machine works below the baseline and are spent on peaks. And the symptom is the same when the reserve runs out: the car loses speed before the end of the straight, and the VM without credits is stuck at the baseline. **Here the analogy stops:** the ERS collects energy under braking, a physical event of each lap; the credits depend only on the time the machine spends below the baseline. And there is an "unlimited mode" (on AWS, the default for T3, according to the instructor's notes) in which the machine stays at the peak and you pay for the excess; in F1, extra energy cannot be bought.

**Cockpit perspective:** the rest of the garage also has a name. The **image** is the assembly specification: identical garages come out of it, and it is what **autoscaling** uses to open more garages when the load rises (in F1 the limit is two cars per team; in the cloud, it is the limit you configure). The **persistent disk** is the garage's data cabinet: it is still there, keeping everything, with the garage closed, and it keeps charging. The **fixed public IP** has no trackside image: it is an address reserved in your account, which you associate with whichever machine you want and which charges even when idle.

### AWS x Azure equivalence

| Concept | AWS (as in the material) | Azure (addition) |
|---|---|---|
| Virtual machine | EC2 instance | Virtual Machine |
| Families | t, m, c, r, g, i, d, h (for example `t3.micro`) | Series (B, D, E, F, N, L...; for example `Standard_B1s`) |
| Burstable with credits | T family (T3, T4g) | B series |
| Image | AMI | Marketplace image and custom images (Azure Compute Gallery) |
| Autoscaling | Auto Scaling Group | Virtual Machine Scale Sets (with autoscale rules) |
| Persistent disk | EBS (gp3, io1/io2, sc1/st1) | Managed Disks (Standard HDD, Standard SSD, Premium SSD, Ultra Disk) |
| Temporary disk | Ephemeral volume (instance store) | VM temporary disk |
| Fixed public IP | Elastic IP | Public IP with static allocation |
| Firewall | Security Group | NSG |
| Key pair | Key pair (.pem) | SSH key (`--generate-ssh-keys`) |
| VM identity | IAM Role (instance profile) | Managed Identity |
| Backup | AWS Backup, EBS snapshots | Azure Backup, disk snapshots |
| Commitment discount | Reserved Instances, Savings Plans | Azure Reservations, Savings Plan for compute |
| Idle capacity | Spot Instances | Spot VMs |
| VM metrics and logs | CloudWatch and CloudWatch Agent | Azure Monitor and Azure Monitor Agent |
| Load balancer | ELB (ALB, NLB) | Application Gateway, Load Balancer (Stage 09) |

**Cockpit perspective:** families and series are the catalog of garage sizes of each circuit. The `t3.micro` and the `Standard_B1s` are the simplest garage, with ERS (credits) for the peaks. The catalog names change from one circuit to the other; the reasoning of choosing by the load profile is the same.

### Commented example: from zero to a VM

Two readings to choose the size, at no cost.

```bash
# AWS: how many vCPUs and how much memory does the t3.micro have?
aws ec2 describe-instance-types --instance-types t3.micro \
  --query "InstanceTypes[0].{vcpu:VCpuInfo.DefaultVCpus,memoriaMiB:MemoryInfo.SizeInMiB}"
# Expected output: { "vcpu": 2, "memoriaMiB": 1024 }

# Azure (addition): does the Standard_B1s size exist in the region?
az vm list-sizes --location brazilsouth --query "[?name=='Standard_B1s']" --output table
# If the line appears, it shows cores and memory. If it does not appear, the size does not exist in that region.
```

**Creation (optional, generates cost if left running):**

The Stage 03 network and firewall were already deleted in the cleanup, and that subnet had no route to the internet. That is why the AWS VM uses the region's **default VPC**, which already comes with public subnets (a route to the Internet Gateway and an automatic public IP), and gets its own Security Group. If you deleted the default VPC, recreate it with `aws ec2 create-default-vpc`.

```bash
# AWS: sets the region for this terminal session (São Paulo)
export AWS_DEFAULT_REGION=sa-east-1
# 1. Finds the latest Amazon Linux 2023 image (AMI) through the public SSM parameter
AMI_ID=$(aws ssm get-parameters \
  --names /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 \
  --query 'Parameters[0].Value' --output text)
# 2. Creates the key pair and keeps the private key only for you
aws ec2 create-key-pair --key-name lab --query KeyMaterial --output text > lab.pem && chmod 400 lab.pem
# 3. Own Security Group in the default VPC, with SSH open only to your IP
VPC_ID=$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true \
  --query 'Vpcs[0].VpcId' --output text)
SG_ID=$(aws ec2 create-security-group --group-name sg-vm-lab \
  --description "SSH so do meu IP" --vpc-id "$VPC_ID" --query GroupId --output text)
MEU_IP=$(curl -s https://checkip.amazonaws.com)
aws ec2 authorize-security-group-ingress --group-id "$SG_ID" \
  --protocol tcp --port 22 --cidr "$MEU_IP/32"
# 4. Creates ONE small instance and prints its ID (note it for the cleanup)
aws ec2 run-instances \
  --image-id "$AMI_ID" \
  --instance-type t3.micro \
  --key-name lab \
  --security-group-ids "$SG_ID" \
  --count 1 \
  --query 'Instances[0].InstanceId' --output text
```

What each `run-instances` option does:

- `--image-id`: the base image (here, the Amazon Linux 2023 found through SSM).
- `--instance-type`: the size.
- `--key-name`: the key pair for SSH (the private key is in `lab.pem`).
- `--security-group-ids`: the firewall, with SSH only from your IP.
- Without `--subnet-id`: AWS chooses a default subnet of the default VPC, which is public.
- `--count`: how many instances to create.

```bash
# Azure (addition): recreates the group and creates the VM, disk, NIC, and public IP in one command
az group create --name rg-lab --location brazilsouth
az vm create \
  --resource-group rg-lab \
  --name vm-lab \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --generate-ssh-keys
```

What each `az vm create` option does:

- `--resource-group`: the resource group (to clean up later).
- `--name`: the VM name.
- `--image`: the image alias (list others with `az vm image list -o table`).
- `--size`: the size.
- `--admin-username`: the administrator user.
- `--generate-ssh-keys`: creates the SSH key pair if it does not exist.

**Lifecycle: a cost detail that catches many people.**

```bash
# AWS: stopping keeps the disk; the instance stops generating compute cost
aws ec2 stop-instances --instance-ids <ID-DA-INSTANCIA>
# Azure (addition): stopping from the operating system does NOT release compute; you must DEALLOCATE
az vm deallocate --resource-group rg-lab --name vm-lab
```

**Cockpit perspective:** the cost detail is the difference between turning off the lights and handing back the garage. On AWS, stopping the instance already releases the compute: the garage leaves the account, and only the data cabinet (EBS) and the fixed IP keep charging. On Azure, shutting down from the operating system is turning off the lights with the garage still reserved and charging; only `deallocate` hands the garage back to the circuit.

### Where they really differ

- **Stop x deallocate.** On Azure, a "Stopped" VM (stopped from inside the system) keeps the compute reserved and charging; "Stopped (deallocated)" releases the compute and stops its billing. On AWS, stopping the instance already stops the compute cost (EBS and the IP keep charging).
- **Root disk on termination.** On AWS, terminating deletes the instance's data and, by default, the root volume. Additional EBS volumes may persist. On Azure, deleting the VM does not automatically delete the disks, the NIC, and the public IP, unless you remove them or delete the resource group.
- **CPU credits.** Both have the burstable model with credits, but the parameters (credits per hour, limits, unlimited mode) belong to each series. Read the documentation of the size you choose.
- **Keys and Windows.** On AWS, the `.pem` private key is also used to decrypt the administrator password of Windows instances. On Azure, you define a user and password (or an SSH key on Linux) at creation.
- **Images.** The AMI is regional and shareable between accounts. On Azure, custom images live in a gallery (Azure Compute Gallery) and are shared across subscriptions and regions through it.
- **IP address.** On AWS, the dynamic public IP changes when you stop and start, and the Elastic IP is fixed. On Azure, the public IP has dynamic or static allocation.
- **Spot.** Both charge less for idle capacity and can interrupt it. The warning and removal rules differ; read the documentation before using it on a real load.

### Hands-on

*Stopwatch in hand! First the battery math, without the cloud: credits per hour and baseline. Then reading, optional creation, and a cleanup that cannot be skipped.*

**Part 1: credit arithmetic (no cloud).** According to the lesson, each credit is worth 1 minute of use of a vCPU at 100%. The `t3.micro` has 2 vCPUs and earns 12 credits per hour (see the correction in the instructor's notes). Calculate the CPU baseline.

```bash
python3 -c "
creditos_hora = 12
vcpus = 2
minutos_de_cpu_cheia_por_hora = creditos_hora
base_por_vcpu = minutos_de_cpu_cheia_por_hora / 60 / vcpus
print(f'Linha de base: {base_por_vcpu:.0%} por vCPU')
"
# Expected output: Linha de base: 10% por vCPU
```

**Cockpit perspective:** a baseline of 10% per vCPU means that below it, the battery charges; above it, it discharges. An institutional site spends the day collecting energy and spends it at the peak. A load that stays above the baseline all the time is a car trying to run the whole lap in attack mode: the battery cannot keep up, and the burstable family stops being the right choice.

**Part 2: reading in the cloud.** Run the two size commands. Then list your current VMs:

```bash
aws ec2 describe-instances \
  --query "Reservations[].Instances[].{id:InstanceId,estado:State.Name,tipo:InstanceType}" --output table
# Azure (addition)
az vm list --show-details --output table
# Observe the state: running, stopped, "VM running", "VM deallocated"
```

**Part 3: optional creation.** Run the VM creation, then confirm and enter through SSH:

```bash
# Azure (addition)
az vm show --resource-group rg-lab --name vm-lab --show-details --query "{ip:publicIps,estado:powerState}" -o table
ssh azureuser@<IP-PUBLICO>
# AWS: finds the instance's public IP and enters with the key created above
aws ec2 describe-instances --instance-ids <ID-DA-INSTANCIA> \
  --query 'Reservations[0].Instances[0].PublicIpAddress' --output text
ssh -i lab.pem ec2-user@<IP-PUBLICO>
# (ec2-user is the Amazon Linux user; other images use a different user)
```

**Cleanup (do not skip: a running VM charges):**

```bash
# AWS: terminates the instance (deletes the root volume by default) and waits for termination
aws ec2 terminate-instances --instance-ids <ID-DA-INSTANCIA>
aws ec2 wait instance-terminated --instance-ids <ID-DA-INSTANCIA>
# Deletes the Security Group and the key pair (if you closed the terminal, replace $SG_ID with the sg-... ID you noted)
aws ec2 delete-security-group --group-id "$SG_ID"
aws ec2 delete-key-pair --key-name lab && rm -f lab.pem
# Is any volume left?
aws ec2 describe-volumes --query "Volumes[].VolumeId" --output text
# Azure (addition): deletes the VM, disk, NIC, IP, and NSG at once
az group delete --name rg-lab --yes --no-wait
# Before recreating rg-lab in the next stage, wait for the deletion to finish:
az group wait --deleted --name rg-lab
```

*Timed pit stop! Choose the right family, explain the bill that will not stop rising, and save the customer's DNS.*

**Exercises**

1. An institutional site has low CPU almost all day and short peaks. Which family do you choose on both providers? What risk exists if the credits run out?
2. You stopped an Azure VM from the operating system and the bill kept rising. Why?
3. An EC2 instance in a public subnet lost its IP when it was stopped and restarted, and the customer's DNS broke. How do you avoid it?

**Answer key**

1. T family (AWS) and B series (Azure). Without credits, performance is limited (except in AWS's unlimited mode, which may charge for the excess).
2. The VM was stopped, but not deallocated: the compute was still reserved. Use `az vm deallocate`.
3. Elastic IP (AWS) or static Public IP (Azure). Remember that public IPs have a cost and that, according to the lesson, an idle Elastic IP is charged (see the instructor's notes).

**Remember this:** a VM is server rental by time; choose the size by the load, standardize with images, scale by rule, and remember that disk and IP charge even with the machine stopped.

**Stage 04 checklist**

- [ ] I can choose a family/series by the load profile.
- [ ] I can explain CPU credits in burstable instances.
- [ ] I know the role of image, persistent disk, and autoscaling.
- [ ] I know the difference between stopping and deallocating on Azure.
- [ ] I know how to delete everything I created so as not to generate cost.

*Sector 4 in green! Garage of the right size, battery under control, and lights really off when the work ends. In China, in 2007, Lewis Hamilton stayed out too long on worn tires and lost the race at the pit entry, and that is the lesson of Stage 04: a resource used beyond its limit (exhausted CPU credits, a VM forgotten running) sends the bill at the wrong time. Now the garages start receiving cars in series. Stage 05, containers.*

---

## Stage 05: Containers (ECS/EKS x Container Apps/AKS)

*Fifth sector, and this is where the operation gains scale! The car specification becomes a file, the wall starts replacing on its own whoever stops, and the same spec sheet runs on both circuits. Whoever masters this sector understands a good part of the modern cloud.*

### The problem

"It works on my machine." The app runs on the developer's laptop, breaks in staging because of a library version difference, and breaks again in production. Containers package the application with its dependencies into an image that runs the same anywhere. The new problem: with hundreds of containers, who puts them on the machines, restarts the ones that fall, and distributes the traffic? That is what an orchestrator is for.

### The concept, in a neutral way

**Analogy:** the maritime shipping container. Any cargo, packed in a standard format, fits any ship, train, or truck. The orchestrator is the port that decides where each container is stored and moved.

**Cockpit perspective:** F1 lives this analogy. The teams' material travels in standardized containers and crates, by plane, ship, and truck, from one circuit to the next without repacking anything. In our map, the **image** is the replicable specification of the car, kept in the **registry** (the central archive of versioned specifications, ECR or ACR); the **container** is a car assembled from it; the **Pod** is the car that goes to the track, the smallest unit the orchestrator puts to run (usually it carries one container; when it carries more than one, they share the same chassis and the same telemetry). The **worker nodes** are the garages, the same virtual machines from Stage 04, and the **control plane** is the wall: it decides in which garage each car stays, notices when a car stops, and orders another one assembled.

- **Container x VM:** the container shares the host's kernel instead of starting an operating system per application; that is why it is lighter and faster. It does not replace the VM, it complements it.
- **Image and registry:** the image is the package; the registry (Docker Hub, or the provider's registry) stores it. Good registries scan for vulnerabilities and control access.
- **Orchestration:** keeping the desired state (how many replicas, which image), restarting what falls, scaling, and balancing.
- **Kubernetes:** an open orchestration standard, born at Google in 2014 (an evolution of the internal Borg project) and donated to the CNCF in 2015. You declare the desired state and it takes care of provisioning, scaling, and self-healing. Concepts: **control plane** (the brain, which decides where each thing runs), **worker nodes** (machines where the containers run), **Pod** (smallest unit, with one or more containers), **Deployment** (replicas and declarative updates), **Service** (a stable address for a set of pods), and **Ingress** (HTTP entry rules).
- **Serverless for containers:** you deliver the image and the provider takes care of the servers (billing by the resource allocated to the task; less fine-grained control).
- **Workload identity:** each task or pod with its own permissions (least privilege).
- **GitOps:** the Git repository as the source of truth for what is deployed.

**Cockpit perspective:** container x VM, in the paddock: the VM is the garage with its own generator and systems; the containers are the cars inside a garage, all connected to the same power (the host's **kernel**). That is why the container comes up fast: nobody turns on a new generator for each car. The **Deployment** is the operation sheet ("I want three cars of this specification on the track"); the **Service** is the fixed-address radio channel that talks to whoever is on the track with that livery, no matter which chassis; the **Ingress** is the pit lane entry rule for HTTP traffic. **Here the analogy stops:** in F1 there are two cars per team in each race; the Deployment asks for 3, 5, or 500 replicas, and a new replica comes out of the specification in seconds.

### AWS x Azure equivalence

| Concept | AWS (as in the material) | Azure (addition) |
|---|---|---|
| Provider's own orchestrator | ECS (tasks and services) | Azure Container Apps |
| Serverless container, no servers | AWS Fargate | Container Apps (serverless) and Azure Container Instances (ACI) for simple executions |
| Managed Kubernetes | EKS | AKS |
| Image registry | ECR | ACR (Azure Container Registry) |
| Worker nodes | Node group (EC2 instances) | Node pool (VMs, in VM Scale Sets) |
| Task definition | Task definition (JSON) | Container app configuration, or Kubernetes manifests on AKS |
| Identity per task or pod | IAM Roles for Tasks (ECS) and for Service Accounts (EKS) | Managed Identity (Container Apps) and Microsoft Entra Workload ID (AKS) |
| Monitoring | CloudWatch Container Insights | Container insights (Azure Monitor) |
| Managed Prometheus and Grafana | (not mentioned in the material) | Azure Monitor managed Prometheus and Azure Managed Grafana |
| Container security | GuardDuty, ECR scan | Microsoft Defender for Containers, image scan in ACR |
| HTTPS certificates | ACM | Front Door managed certificates and Key Vault certificates |
| Service mesh | AWS App Mesh (support ended; see the instructor's note 11) | Service mesh add-on for AKS (check the current option) |
| HTTP entry into the cluster | Ingress with ALB | Ingress with Application Gateway or ingress controllers on AKS |
| Event-driven scaling | KEDA (mentioned in the other lessons) | KEDA (integrated into Container Apps and available on AKS) |

**Cockpit perspective:** the car specification (the Kubernetes manifest) is the same on both circuits, and EKS and AKS are the direct pair. What changes is the infrastructure underneath, which belongs to the circuit: the garages (node groups and node pools), the load balancer, the disks. ECS and Container Apps are the simplified procedure of each circuit: you deliver the specification and the circuit takes care of the wall and the garages for you, with less fine-grained control.

### Commented example: the same cluster, on both providers

**Create a node group with 2 machines, minimum 1 and maximum 3** (the material's `eksctl` and `az aks nodepool add`):

Both commands add nodes to a cluster that already exists; the cluster itself is created in the next block.

```bash
# AWS: managed node group (eksctl, command-line tool for EKS)
eksctl create nodegroup \
  --cluster my-cluster \
  --name my-nodegroup \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3 \
  --managed

# Azure (addition): equivalent node pool in an AKS cluster that already exists
az aks nodepool add \
  --resource-group rg-lab \
  --cluster-name aks-lab \
  --name pool2 \
  --node-count 2 \
  --enable-cluster-autoscaler \
  --min-count 1 --max-count 3
```

What each option does:

- `--cluster` (eksctl) and `--cluster-name` (az): the EKS or AKS cluster the group joins; `--resource-group`: the cluster's group on Azure.
- `--name`: the name of the node group or of the node pool.
- `--node-type`: the size of each node on AWS.
- `--nodes` and `--node-count`: how many nodes at start.
- `--nodes-min`/`--nodes-max` and `--min-count`/`--max-count`: minimum and maximum of the autoscaling.
- `--managed`: nodes managed by AWS; `--enable-cluster-autoscaler`: turns on cluster autoscaling on AKS.

**Cockpit perspective:** `--nodes 2 --nodes-min 1 --nodes-max 3` and `--node-count 2 --min-count 1 --max-count 3` are the same garage agreement on both circuits: open with two, never fewer than one, never more than three, and the autoscaling decides within that range according to the load.

**Create the cluster itself** (optional, costs money: nodes are VMs):

```bash
# AWS: EKS cluster with managed nodes (takes several minutes)
eksctl create cluster --name my-cluster --region sa-east-1 --nodes 2
# Azure (addition): recreates the group, creates the AKS cluster with 2 nodes, and downloads the credentials for kubectl
az group create --name rg-lab --location brazilsouth
az aks create --resource-group rg-lab --name aks-lab --node-count 2 --generate-ssh-keys
az aks get-credentials --resource-group rg-lab --name aks-lab
```

**ECS x Container Apps.** On ECS, a **Task** is described in JSON and grouped into a **Service**:

```json
{
  "family": "meu-app",                    // task family name
  "networkMode": "awsvpc",                // each task gets its own network interface
  "requiresCompatibilities": ["FARGATE"], // runs on Fargate, without managing servers
  "cpu": "256",                           // 0.25 vCPU
  "memory": "512",                        // 512 MiB
  "containerDefinitions": [{
    "name": "web",
    "image": "nginx",                     // image (from Docker Hub or ECR)
    "essential": true,                    // if this container falls, the task falls
    "portMappings": [{ "containerPort": 80 }]
  }]
}
```

(Remove the `//` comments before registering this task definition; real JSON does not accept them.)

On Container Apps, the same intent is one command (the `containerapp` extension may be installed automatically the first time):

```bash
# Azure (addition): ensures the group, creates the environment (the logical "region") and then the app
az group create --name rg-lab --location brazilsouth
az containerapp env create --name env-lab --resource-group rg-lab --location brazilsouth
# --image: Microsoft sample image; --target-port and --ingress external: expose port 80 to the internet
az containerapp create --name app-lab --resource-group rg-lab --environment env-lab \
  --image mcr.microsoft.com/k8se/quickstart:latest \
  --target-port 80 --ingress external
```

**The Kubernetes manifests are the same on EKS and AKS** (Pod, Service, Deployment, Ingress from the material). See the Deployment, commented:

```yaml
apiVersion: apps/v1            # API version for Deployments
kind: Deployment               # type: declarative updates of replicas
metadata:
  name: meu-deployment         # object name
spec:
  replicas: 3                  # desired number of pods
  selector:
    matchLabels:
      app: minha-aplicacao     # which pods this Deployment manages
  template:                    # template of each pod
    metadata:
      labels:
        app: minha-aplicacao   # label the Service will use to find the pods
    spec:
      containers:
        - name: meu-container  # container name
          image: nginx         # image used
          ports:
            - containerPort: 80  # port the container listens on
---
apiVersion: v1
kind: Service                  # stable address for the set of pods
metadata:
  name: meu-servico
spec:
  selector:
    app: minha-aplicacao       # selects the pods with this label
  ports:
    - protocol: TCP
      port: 80                 # service port
      targetPort: 80           # container port
  type: ClusterIP              # reachable only inside the cluster
```

**Cockpit perspective:** read the YAML as the operation sheet. `replicas: 3` is how many cars you want on the track; the `template` is the assembly specification of each one; the label `app: minha-aplicacao` is the livery that identifies the car; the Service's `selector` is the radio engineer looking for that livery on the track. A car without the livery gets no call: it is exactly the problem of the `pod.yaml` without `labels` that the instructor's notes point out.

### Where they really differ

- **ECS does not exist on Azure.** ECS is a proprietary AWS orchestrator. Azure's answer to "simple orchestration without Kubernetes" is Container Apps, which runs on Kubernetes underneath but hides the complexity, with event-driven scaling (KEDA) and scale to zero. For pure Kubernetes, EKS and AKS are the direct pair.
- **Control plane and cost.** The material mentions an additional control plane cost on EKS. AKS offers a free control plane tier (without a financial SLA) and paid tiers with more guarantees; check the current tiers and prices.
- **System pools.** AKS requires a system node pool (cluster components) and allows user pools for your applications.
- **Identity.** IRSA (EKS) and Workload Identity (AKS) solve the same problem (a pod with its own identity, without a key), with different federation mechanisms.
- **LoadBalancer-type Services and storage.** The YAML is the same, but what it provisions underneath changes: on EKS it becomes an AWS load balancer, on AKS an Azure Load Balancer. The same goes for StorageClass (EBS x Managed Disks) and for the ingress controller.
- **Fargate x ACI/Container Apps.** Fargate also runs under EKS. On Azure, the equivalent of "container with no node to manage" appears as a separate product (Container Apps or ACI), not as a mode of AKS.

**Here the analogy stops:** "same specification" does not mean "same weekend". The manifest is the same on both circuits, but `type: LoadBalancer`, the StorageClass, and the ingress controller become, underneath, equipment of each circuit, with its own price and behavior. And ECS has no twin on Azure: Container Apps solves the same problem, running on Kubernetes underneath.

### Hands-on

*Pit lane open, and with no cloud account! You bring up a cluster on your own machine, apply the operation sheet, and take a car down on purpose to watch the wall replace it. The cloud part is optional and charges: only with credit, and deleting on the same day.*

**Part 1: reading (no cost).**

```bash
aws ecr describe-repositories --query "repositories[].repositoryName" --output text   # ECR registries
aws eks list-clusters
# Azure (addition)
az acr list --output table
az aks list --output table
```

**Part 2: local path (kind or minikube), no cloud account.** The Kubernetes YAML is the same as on EKS and AKS. Save the manifest above in `app.yaml` and run:

```bash
kind create cluster --name lab        # creates a Kubernetes cluster inside Docker
# (alternative: minikube start)
kubectl apply -f app.yaml             # creates the Deployment and the Service
kubectl get pods                      # lists the pods
# Expected output (names and ages vary), after a few seconds:
# NAME                              READY   STATUS    RESTARTS   AGE
# meu-deployment-5d9c7c8b7d-4xk2p   1/1     Running   0          25s
# meu-deployment-5d9c7c8b7d-7hm9q   1/1     Running   0          25s
# meu-deployment-5d9c7c8b7d-zl2wd   1/1     Running   0          25s

# waits for the Pods to be ready (the image may still be downloading)
kubectl wait --for=condition=available deployment/meu-deployment --timeout=90s
kubectl port-forward svc/meu-servico 8080:80 &   # opens the service at localhost:8080
sleep 2                                          # gives the tunnel time to open before curl
curl -s localhost:8080 | head -4
# Expected output: the start of the HTML "Welcome to nginx!"
```

Self-healing and scaling, the heart of Kubernetes:

```bash
kubectl delete pod <NOME-DE-UM-POD>          # takes down a pod
kubectl get pods                             # a new pod has already appeared: the Deployment restored the 3 replicas
kubectl scale deployment meu-deployment --replicas=5
kubectl get pods                             # now there are 5
```

**Cockpit perspective:** `kubectl delete pod` is a car stopping on the track. The wall (the control plane) notices that the sheet asks for three and only two are running, and orders another one assembled from the specification, without anyone asking. In Sepang, when George Russell's car stopped on the straight during the last safety car, there was no possible replacement: in F1, a stopped car is a lost race, and the gap to Kimi Antonelli reached 84 points. In Kubernetes, the lost Pod comes back in seconds. That is the difference between having two cars and having replicas.

**Part 3: cloud (optional, generates cost).** Creating an EKS or AKS cluster costs money; do it only if you have credit and delete it on the same day. After `az aks get-credentials` or `aws eks update-kubeconfig --region sa-east-1 --name my-cluster`, run the same `kubectl apply -f app.yaml` and compare: the YAML does not change.

**Cleanup:**

```bash
# Local
kill %1 2>/dev/null             # ends the port-forward
kubectl delete -f app.yaml
kind delete cluster --name lab
# AWS (if you created a cluster)
eksctl delete cluster --name my-cluster --region sa-east-1
# Azure (addition): deletes the cluster, container app, and environment
az group delete --name rg-lab --yes --no-wait
# Before recreating rg-lab in the next stage, wait for the deletion to finish:
az group wait --deleted --name rg-lab
```

*Lap complete! What to suggest to a small team, whether the Service finds the Pod without a livery, and why the same spec sheet does not guarantee the same bill.*

**Exercises**

1. You are a small team, with a simple API, only in the cloud, with no Kubernetes experience. What do you suggest on both providers? And if the company already uses Kubernetes in the data center?
2. The material brings a `pod.yaml` without `labels` and a `service.yaml` with `selector: app: minha-aplicacao`. Will the Service find that pod?
3. Why does "same YAML" not mean "same bill at the end of the month" between EKS and AKS?

**Answer key**

1. ECS with Fargate (AWS) and Container Apps (Azure), for simplicity. Already using Kubernetes: EKS or AKS, for portability.
2. No. The Service selects pods by label; a pod without the label `app: minha-aplicacao` does not get in. In the material's Deployment the label exists in the `template`.
3. The manifest is the same, but control plane, node, load balancer, disk, and network costs are charged differently by each provider.

**Remember this:** a container packages, an orchestrator maintains the desired state; Kubernetes is the common language between EKS and AKS, and serverless simplicity (Fargate, Container Apps) comes at the price of less control.

**Stage 05 checklist**

- [ ] I can explain container x VM.
- [ ] I know what Pod, Deployment, Service, and Ingress are.
- [ ] I know what the control plane does and who manages it on EKS and AKS.
- [ ] I ran a Deployment on kind or minikube and saw the self-healing.
- [ ] I know which Azure product answers to ECS with Fargate.

*Sector 5 in green! Specification in the central archive, operation sheet applied, and replicas that come back on their own. But no car goes far without data. Stage 06, databases: the technical book and the tire control by tag.*

---

## Stage 06: Databases (RDS, Aurora, and DynamoDB x Azure SQL, PostgreSQL/MySQL, and Cosmos DB)

*Sixth sector! Now the question is where the information lives: in the technical book that links part, chassis, and driver, or in the tag-based control that answers on the spot. The right choice depends on the question you will ask every day.*

### The problem

An online store keeps orders in a database hosted on a VM. On Black Friday the database locks up; the nightly backup failed weeks ago and nobody noticed; the security patch is overdue. The database is the heart of the system: if it stops or misbehaves, everything else is affected. Managed databases lift from the team the burden of provisioning, updating, and backing up.

### The concept, in a neutral way

**Analogy:** relational is a spreadsheet with strict rules between tabs (tables linked by keys, everything consistent). Key-value NoSQL is a cabinet with labeled drawers: you grab the drawer by its label, extremely fast, but you do not do complex cross-referencing between drawers.

**Cockpit perspective:** the relational database is the **car's official technical book**: each part linked to a chassis, each chassis to a driver, with rules that do not let you record a part without an owner. Key-value NoSQL is the **tire control by barcode**: by the tag you instantly find the history of that set of tires, but questions like "which tires ran on cars with the new wing on a hot track" call for cross-references that this model does not do well. **Here the analogy stops:** I am not stating how the teams keep this data internally; it is an image of the kind of question each model answers well.

- **Relational (SQL):** accessed with SQL, emphasis on consistency, **ACID** transactions (atomicity, consistency, isolation, durability), fixed schema, joins, and referential integrity.
- **Non-relational (NoSQL):** horizontal scalability and flexible structure. Models: key-value, documents, columnar, and graphs. Excellent for high read and write rates with low latency.
- **Managed service:** the provider takes care of provisioning, patches, automatic backups, point-in-time recovery, and high availability (a replica in another zone, with failover).
- **Scale:** vertical (more CPU and memory) and horizontal (read replicas).
- **Separating storage from compute:** an architecture in which the data volume is distributed and replicated independently of the compute node, which speeds up failover and allows many read replicas.
- **Capacity model:** provisioned (you define it) or on demand/serverless (adjusts on its own and charges by use).
- **Cache, events, and global replication:** in-memory cache in front of the database, change stream, and replication between regions.
- **Cost and security:** wrong sizing generates spending; encryption at rest and in transit, access control, auditing, and a private network are mandatory.

**Cockpit perspective:** the **A** in ACID (atomicity) is the logic of releasing a car from a pit stop: either all four wheels were changed and secured, or the car does not go back on the track. There is no "half a change" valid out there. **High availability across zones** is having a live copy of the database in another garage building, ready to take over; **read replicas** are read-only copies that serve the queries, so the original takes care of the writes. **Here the analogy stops:** in the transaction that fails, the database goes back to the previous state; in a pit stop that goes wrong, nobody returns the old tires, the car just stays stopped until the change is finished.

### AWS x Azure equivalence

| Concept | AWS (as in the material) | Azure (addition) |
|---|---|---|
| Managed relational (SQL Server) | RDS for SQL Server | Azure SQL Database (and SQL Managed Instance) |
| Managed relational (PostgreSQL and MySQL) | RDS (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server) | Azure Database for PostgreSQL and for MySQL (flexible server) |
| High-scale relational, separate storage | Aurora (MySQL and PostgreSQL) | Azure SQL Database Hyperscale (architecture with separate storage; not a 1 to 1 translation of Aurora) |
| Serverless relational | Aurora Serverless | Azure SQL Database serverless (compute tier) |
| NoSQL | DynamoDB | Cosmos DB (multiple APIs) |
| In-memory cache for NoSQL | DAX | Cosmos DB integrated cache |
| Change stream | DynamoDB Streams | Cosmos DB change feed |
| Multi-region replication | Aurora Global Database, DynamoDB Global Tables | Azure SQL geo-replication and Cosmos DB global distribution |
| High availability across zones | Multi-AZ | Zone-redundant high availability |
| Read replicas | Up to 15 on Aurora; replicas on RDS | Read replicas in Azure services (limits vary by service) |
| Backup and point-in-time restore | Automatic backups and point-in-time | Automatic backups and point-in-time restore |
| Data warehouse | Redshift | Azure Synapse Analytics and Microsoft Fabric |
| Encryption keys | KMS | Key Vault (customer-managed keys) |
| Auditing | CloudTrail | Activity Log and diagnostic logs |
| Automatic cleanup by expiry | TTL | TTL (supported in Cosmos DB) |

**Cockpit perspective:** both circuits offer the managed technical book (RDS, Azure SQL, and the managed PostgreSQL and MySQL) and the tag-based control (DynamoDB, Cosmos DB). Managed means the circuit takes care of maintaining the archive (patches, backups, a copy in another zone) and the team takes care of what it writes in it.

### Commented example: key-value NoSQL in both worlds

**AWS DynamoDB (on demand, no server to manage):**

```bash
# Creates the "pedidos" (orders) table with partition key "id" (text), billed per request:
# --attribute-definitions declares the id attribute as String (S);
# --key-schema makes id the partition key (HASH);
# --billing-mode PAY_PER_REQUEST is the on-demand mode.
aws dynamodb create-table --table-name pedidos \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
# Waits for the table to become ACTIVE before writing
aws dynamodb wait table-exists --table-name pedidos

aws dynamodb put-item --table-name pedidos \
  --item '{"id":{"S":"1001"},"item":{"S":"café"}}'            # writes an item

aws dynamodb get-item --table-name pedidos --key '{"id":{"S":"1001"}}'
# Expected output: {"Item": {"id": {"S": "1001"}, "item": {"S": "café"}}}
```

**Azure Cosmos DB (addition), serverless account with the NoSQL API:**

```bash
# Recreates the group (the previous stage's cleanup deleted it)
az group create --name rg-lab --location brazilsouth
# The account name is globally unique: replace <NOME-UNICO>
az cosmosdb create --name cosmos-<NOME-UNICO> --resource-group rg-lab \
  --kind GlobalDocumentDB --capabilities EnableServerless
# Creates the "loja" (store) database and the "pedidos" (orders) container with partition key /id
az cosmosdb sql database create --account-name cosmos-<NOME-UNICO> --resource-group rg-lab --name loja
az cosmosdb sql container create --account-name cosmos-<NOME-UNICO> --resource-group rg-lab \
  --database-name loja --name pedidos --partition-key-path "/id"
```

To write and read items in Cosmos DB, use the portal's **Data Explorer** or an SDK (the data plane is not operated by these management commands).

**Cockpit perspective:** the partition key `id` is the tire tag. With it, `get-item` goes straight to the right item. Choosing the key is deciding where you will search from: if the everyday question is not by the tag, the key-value model starts working against you.

### Where they really differ

- **Aurora has no exact twin.** Aurora separates storage (six copies across three zones, a volume that grows from 10 GB to 128 TB, up to 15 read replicas, according to the material) from compute. On Azure, the idea of separating storage appears in Azure SQL Hyperscale; for managed PostgreSQL and MySQL, the read scaling path is the read replica. Compare by requirements, not by name.
- **Cosmos DB has several APIs.** DynamoDB is a model (key-value and documents) with its own API. Cosmos DB exposes the same engine through several APIs: NoSQL (native), MongoDB, Cassandra, Gremlin (graphs), and Table, plus a distributed PostgreSQL option. This reduces migration effort if you already use MongoDB or Cassandra.
- **Consistency levels.** DynamoDB offers eventually consistent or strongly consistent reads, chosen per request. Cosmos DB offers five configurable levels: Strong, Bounded staleness, Session, Consistent prefix, and Eventual, trading latency and availability for read guarantees.
- **Capacity.** Both have provisioned and on-demand/serverless modes, but with different units: Cosmos DB measures operation cost in *Request Units per second*. Estimating capacity uses different calculators.
- **Engines.** The material mentions RDS with Oracle and MariaDB. For these two engines, check availability and the offering format on Azure instead of assuming parity.
- **ACID and joins.** On any provider, complex relationships, referential integrity, and multi-table transactions favor the relational database; key-value favors latency and simple scale.

**Here the analogy stops:** the **consistency levels** recall the difference between the time on the pit wall monitor and the scoreboard of a results website that only catches up with the official one after some delay. **Hypothetical:** a site that, seconds after the checkered flag in Sepang, still showed Kimi Antonelli without the points for second place would be displaying an eventually consistent read; it reaches the official 320 points shortly after. *Strong* is only accepting the number on the monitor; *Eventual* is accepting the scoreboard that catches up with the official one at some point. The intermediate levels (Bounded staleness, Session, Consistent prefix) have no clean image on the track: study them by the technical definition above.

### Hands-on

*Bench powered on! First the pit stop rule written in code: a transfer that fails midway cannot make money vanish. Then reading in the cloud and, if you want, a tag-based table on both circuits.*

**Part 1: atomicity, without the cloud.** A bank transfer that fails midway cannot let money disappear:

```bash
python3 - <<'EOF'
import sqlite3
c = sqlite3.connect(":memory:")
c.execute("create table conta(id int primary key, saldo int)")
c.executemany("insert into conta values (?,?)", [(1, 100), (2, 50)])
c.commit()
try:
    with c:  # the transaction is rolled back if there is an exception
        c.execute("update conta set saldo = saldo - 70 where id = 1")
        raise RuntimeError("falha no meio da transferência")
except RuntimeError as e:
    print("erro:", e)
print(c.execute("select * from conta").fetchall())
EOF
# Expected output:
# erro: falha no meio da transferência
# [(1, 100), (2, 50)]
```

Account 1's balance went back to 100: that is **atomicity**.

**Cockpit perspective:** it is the pit stop rule written in code: a failure midway through the operation does not leave account 1 with 70 less and account 2 without receiving it. Either the whole transfer happens, or nothing changes.

**Part 2: reading in the cloud.**

```bash
aws rds describe-db-instances --query "DBInstances[].{id:DBInstanceIdentifier,engine:Engine}" --output table
aws dynamodb list-tables
# Azure (addition)
az sql server list --output table
az postgres flexible-server list --output table
az cosmosdb list --output table
```

**Part 3: optional creation (on-demand model, minimal cost).** Run the DynamoDB and serverless Cosmos DB creation above and confirm they exist:

```bash
aws dynamodb describe-table --table-name pedidos --query "Table.TableStatus"   # "ACTIVE"
# Azure (addition)
az cosmosdb sql container show --account-name cosmos-<NOME-UNICO> --resource-group rg-lab \
  --database-name loja --name pedidos --query "resource.id"
```

**Cleanup:**

```bash
aws dynamodb delete-table --table-name pedidos
# Azure (addition): deletes the Cosmos account and everything in the group
az group delete --name rg-lab --yes --no-wait
# Before recreating rg-lab in the next stage, wait for the deletion to finish:
az group wait --deleted --name rg-lab
```

*Timed pit stop! Online game, legacy ERP, and sessions that expire on their own: one service for each case, on both circuits.*

**Exercises**

1. An online game app with millions of simultaneous accesses needs millisecond reads by key, with no joins. Which service on both providers?
2. A legacy ERP uses SQL Server with joins and transactions across many tables. Which service?
3. A sessions table must expire on its own. Which feature covers this on both?

**Answer key**

1. DynamoDB and Cosmos DB (NoSQL API), for latency and horizontal scale.
2. RDS for SQL Server (AWS) and Azure SQL Database or SQL Managed Instance (Azure).
3. TTL (exists on both).

**Remember this:** relational for integrity and joins, NoSQL for latency and scale by key; Aurora and Cosmos DB are not direct translations of anything, so compare by requirement.

**Stage 06 checklist**

- [ ] I can say what ACID is and why it matters.
- [ ] I can choose between RDS, Aurora, and DynamoDB (and their Azure counterparts).
- [ ] I know what separating storage from compute means.
- [ ] I can name the five Cosmos DB consistency levels.
- [ ] I know how to delete the tables and accounts created in the practice.

*Sector 6 in green! Atomic transaction, a well-chosen partition key, and each database in the right role. Now the circuit starts working for you: the station that only opens when a request arrives. Stage 07, serverless.*

---

## Stage 07: Serverless (Lambda and API Gateway x Azure Functions and API Management)

*Seventh sector! No server turned on waiting, billing per request, and a cold out-lap every now and then. But watch the contract: the more the procedure uses the fittings of a single circuit, the more expensive the change becomes.*

### The problem

A media company receives millions of photos uploaded by users, with unpredictable peaks. Keeping servers on 24 hours just to resize images means paying for idleness almost all the time and still risking saturation at the peak. The idea of serverless: write a function that runs in response to an event, and pay only for the time it executes.

### The concept, in a neutral way

**Analogy:** the ride-hailing taxi. You do not have a driver hired all day; you call when you need one and pay for the ride.

**Cockpit perspective:** imagine a service station that the circuit only opens when a request arrives. You hand over the written procedure (the **function**, with its **handler**), the circuit puts people and tools in place on the spot, executes, closes, and charges per request. The **trigger** is the request that opens the station: an HTTP request, a file that arrived, a message in the queue. The **cold start** is the **out-lap**: on the first call after a period idle, the function is still cold and responds more slowly, like the car leaving the pit box with tires and brakes below temperature. The **API gateway** is the paddock gatehouse: it checks the pass, limits how many enter per minute, keeps ready-made answers, and sends each person to the right sector. **Here the analogy stops:** nothing in F1 is billed per request or scales from zero to thousands of copies in seconds; the on-demand station is a didactic image, not a paddock practice.

- **Serverless does not mean "without servers":** the servers exist, but the provider takes care of installation, scaling, and maintenance. You take care of the code.
- **Evolution:** on-premises, colocation, cloud (VMs), and serverless (functions only).
- **Function:** a small unit of code with an entry point (*handler*) that receives an event and returns a response.
- **Triggers:** HTTP request, file upload, database change, queue message, schedule.
- **Automatic scaling and billing by use:** each event can generate an isolated execution; you pay for requests and duration (and allocated memory).
- **Cold start:** the delay to initialize an inactive function.
- **API gateway:** a front door that exposes HTTP routes, validates input, authenticates, rate-limits, caches, and routes to the functions.
- **Usage patterns:** token authentication at the gateway, a database with care for connections, **orchestration** of flows, **decoupling** with queues and topics, **events** as glue between services.
- **When to avoid:** long executions, persistent connections, high and constant load (it can end up more expensive), and **lock-in** (coupling to the provider).

**Cockpit perspective:** **lock-in** is the procedure written for the garage of a single circuit: it works very well there, uses the sockets, fittings, and shortcuts of that place, and does not run at the next circuit without being rewritten. The **queue** is the pile of used tires waiting for analysis: whoever produces does not wait for whoever processes. **Orchestration** is the script of a pit stop: steps in order, some in parallel, and a plan for when the wheel nut does not come off.

### AWS x Azure equivalence

| Concept | AWS (as in the material) | Azure (addition) |
|---|---|---|
| Serverless function | Lambda | Azure Functions |
| API gateway | API Gateway (REST, HTTP, and WebSocket) | API Management (APIM); Functions also expose HTTP directly |
| Real time, WebSocket | API Gateway WebSocket | Azure Web PubSub and SignalR Service |
| End-user authentication | Cognito | Microsoft Entra ID and Entra External ID (check the current name) |
| API access key | API Keys | APIM subscription keys |
| JWT token validation | Authorizer in API Gateway | APIM `validate-jwt` policy |
| Flow orchestration | Step Functions | Logic Apps or Durable Functions |
| Event bus | EventBridge | Event Grid |
| Message queue | SQS | Queue Storage or Service Bus (queues) |
| Topics and notifications | SNS | Service Bus (topics and subscriptions) and Event Grid |
| Data streaming | Kinesis | Event Hubs |
| File trigger | S3 trigger | Blob trigger or blob events via Event Grid |
| NoSQL database trigger | DynamoDB Streams | Cosmos DB change feed |
| Packaging and local deploy | SAM and CDK | Azure Functions Core Tools, Bicep |
| Distributed tracing | X-Ray | Application Insights |
| Logs and metrics | CloudWatch | Azure Monitor |

**Cockpit perspective:** the same set of stations exists on both circuits, with different names: the on-demand station (Lambda, Functions), the gatehouse (API Gateway, APIM), the waiting pile (SQS, Queue Storage or Service Bus), and the script (Step Functions, Logic Apps or Durable Functions). **Hypothetical:** a fan site stores the result of each GP in a file repository; when the Sepang file arrives, the file trigger (S3 trigger or Blob trigger) fires a function that recalculates the table and publishes Kimi Antonelli with 320 points and George Russell with 236. No server stayed on waiting for the race to end.

### Commented example: the same HTTP function

**AWS Lambda in Python:**

```python
import json

def lambda_handler(event, context):                       # entry point: receives event and context
    params = event.get("queryStringParameters") or {}      # URL parameters, if any
    nome = params.get("nome", "mundo")                     # default: "mundo"
    return {                                               # format expected by API Gateway
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"mensagem": f"Olá, {nome}!"}, ensure_ascii=False),
    }
```

**Azure Functions in Python (addition), programming model v2:**

```python
import json
import azure.functions as func

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)  # function app; no key required

@app.route(route="ola")                                    # exposes the function at /api/ola
def ola(req: func.HttpRequest) -> func.HttpResponse:       # entry point: receives the request
    nome = req.params.get("nome", "mundo")                 # URL parameter, default "mundo"
    corpo = json.dumps({"mensagem": f"Olá, {nome}!"}, ensure_ascii=False)
    return func.HttpResponse(corpo, mimetype="application/json", status_code=200)
```

Notice that the **event** (the format of what comes in) and the **response** (the format of what goes out) are different: Lambda receives a dictionary and returns a dictionary; Azure Functions receives and returns typed objects. This is a concrete example of coupling to the provider.

**Cockpit perspective:** it is lock-in at the code level. The logic is the same ("greet whoever called"), but the AWS function receives and returns dictionaries, and the Azure one receives and returns typed objects. It is the same procedure written on two different forms, one from each circuit.

Integration patterns, side by side: decoupling with a queue and orchestration.

| Pattern | AWS | Azure (addition) |
|---|---|---|
| One function enqueues, another consumes | Lambda, SQS, Lambda | Function, Queue Storage or Service Bus, Function |
| One event, several interested parties | SNS or EventBridge | Service Bus topics or Event Grid |
| Flow with errors, parallelism, and state | Step Functions | Logic Apps or Durable Functions |

### Where they really differ

- **Triggers and bindings.** In Azure Functions, input and output triggers and *bindings* are declared in the function itself (for example, "when a blob arrives, read it, and write the result to a queue") and reduce glue code. In Lambda, the integration is usually configured outside the code and done through an SDK.
- **Hosting plans.** Azure Functions offers more than one hosting plan (consumption, premium, dedicated), with different cold start and scaling behaviors. Lambda has a single per-request execution model, with configurable concurrency. Compare the current plans in the documentation.
- **API Gateway x APIM.** AWS API Gateway splits into REST, HTTP, and WebSocket, with different cost and features. APIM is a broader API management product (policies in XML, developer portal, versioning), and real-time WebSocket is usually handled by dedicated services (Web PubSub, SignalR).
- **Orchestration.** Step Functions defines flows as state machines. On Azure there are two choices: Logic Apps (visual flows with connectors) and Durable Functions (orchestration in code).
- **Queue x messaging.** SQS covers queues; SNS covers publishing to several destinations. On Azure, Queue Storage is simple and cheap; Service Bus combines queues and topics with advanced messaging features.
- **Lock-in.** The material warns that Step Functions, Cognito, and SQS reinforce coupling to AWS. The same applies to Azure: bindings, Durable Functions, and Logic Apps tie the code to the provider. One way to reduce it is to isolate the business logic in a pure function, called by a thin adapter.

**Here the analogy stops:** the thin adapter suggested above is the way to keep one team procedure and change only the cover of the form at each circuit. In practice, the more you use bindings, Durable Functions, Step Functions, and proprietary queues, the thicker the cover gets, and the more expensive the change of circuit.

### Hands-on

*Simulator on! The handler runs entirely on your machine with a fake event, before touching any circuit. Creation in the cloud comes later, optional, and ends with cleanup.*

**Part 1: run the handler without the cloud.** Save the Lambda as `handler.py` and call it like any Python function, with a fake event:

```bash
python3 -c "
import handler
print(handler.lambda_handler({'queryStringParameters': {'nome': 'Ana'}}, None))
"
# Expected output:
# {'statusCode': 200, 'headers': {'Content-Type': 'application/json'}, 'body': '{"mensagem": "Olá, Ana!"}'}
```

Now without a parameter:

```bash
python3 -c "import handler; print(handler.lambda_handler({}, None)['body'])"
# Expected output: {"mensagem": "Olá, mundo!"}
```

For the Azure version, the local path is **Azure Functions Core Tools** (`func init` and `func start`, which expose `http://localhost:7071/api/ola`). It must be installed separately; if you prefer not to install it, reading the code already meets the goal.

**Cockpit perspective:** calling the handler with a fake event is the simulator: the procedure runs entirely on your machine, without touching the circuit, and you see the exact response the gatehouse would receive.

**Part 2: reading in the cloud.**

```bash
aws lambda list-functions --query "Functions[].FunctionName" --output text
aws apigatewayv2 get-apis --query "Items[].Name" --output text
# Azure (addition)
az functionapp list --output table
az apim list --output table
```

**Part 3: optional creation.** Functions have a free tier on both providers, but the cost depends on consumption and on the account; create through the console/portal (simpler for a first contact), test the URL, and delete. On Azure, create the function app inside `rg-lab`, recreating the group first with `az group create --name rg-lab --location brazilsouth` (the previous stage's cleanup deleted it).

**Cleanup:**

```bash
aws lambda delete-function --function-name <NOME-DA-FUNCAO>
# Azure (addition): if you created the function app inside rg-lab, delete the group
az group delete --name rg-lab --yes --no-wait
# Before recreating rg-lab in the next stage, wait for the deletion to finish:
az group wait --deleted --name rg-lab
```

*Lap complete! File trigger, high and constant load, and what ties you most to the provider. Three questions, clock running.*

**Exercises**

1. A customer wants to process images uploaded to a file repository, without a server on. What is the trigger on each provider?
2. A serverless API receives high and constant load, 24 hours a day. Is serverless always the best choice? Why?
3. Which components of your serverless system tie you most to the provider?

**Answer key**

1. S3 trigger with Lambda (AWS); Blob trigger or blob event via Event Grid with Functions (Azure).
2. No: under very high and constant load, the on-demand model can end up more expensive than traditional infrastructure (according to the material).
3. Orchestration (Step Functions, Durable Functions, Logic Apps), managed authentication (Cognito, Entra), and proprietary queues and events.

**Remember this:** serverless is paying for execution instead of idleness; it is excellent for variable load and events, but ties you to each provider's event format.

**Stage 07 checklist**

- [ ] I can explain what "serverless" means and what still exists underneath.
- [ ] I know what a handler, a trigger, and a cold start are.
- [ ] I know the API types (REST, HTTP, and WebSocket) and how Azure covers each case.
- [ ] I know how to decouple with a queue and orchestrate with Step Functions, Logic Apps, or Durable Functions.
- [ ] I can point out lock-in risks.

*Sector 7 in green! The same function written on two forms and the lock-in identified before it becomes debt. Now it is time to look at the wall: telemetry, race control messages, and radio. Stage 08, monitoring and logs.*

---

## Stage 08: Monitoring and logs (CloudWatch x Azure Monitor)

*Eighth sector, and who is in charge here is the pit wall! A metric says what, an event says when, a log says why. Whoever confuses the three spends the race watching the wrong screen.*

### The problem

Black Friday, the checkout starts to slow down. Without alerts, the team only finds out when customers complain and conversion has already dropped: tens or hundreds of thousands of reais lost. On the other side, an underused VM runs 24 hours and nobody notices the spending. Monitoring is a requirement, not a differentiator.

### The concept, in a neutral way

**Analogy:** a car's dashboard. The speedometer and temperature (metrics) show **what** is happening; warning lights (events) show **when** something changed; the mechanic's report (logs) explains **why**.

**Cockpit perspective:** on the wall, this comes from three sources. **Telemetry** is the metric: continuous numbers (brake temperature, tire pressure, speed) that say **what** is happening. The **race control messages** are the events: safety car on the track, yellow flag in a sector, car under investigation; they say **when** something changed. The **radio and the car's event record** are the logs: the detail that explains **why**. In Sepang, whoever followed from outside saw the event (George Russell's car stopped on the straight during the last safety car) and the consequence in the standings. The why is in the telemetry and in the team's records; I do not know the cause, and no TV broadcast does. That is exactly the distance between event and log.

- **Metrics:** numbers aggregated over time (CPU, requests per second, latency). Ideal for detecting patterns and comparing against limits.
- **Logs:** detailed textual records (requests, errors, exceptions). Useful for debugging, auditing, and forensic analysis.
- **Events:** state changes (instance terminated, function failed, resource created), handled by automations.
- **Alarms/alerts:** rules over metrics or logs with an automatic action (notification, script, escalation).
- **Dashboards:** real-time panels, one per environment.
- **Log querying:** a dedicated language to filter, extract fields, aggregate, and generate charts.
- **Distributed tracing:** following a request across several services to find bottlenecks.
- **Cost:** irrelevant logs and indefinite retention generate spending. Define retention, filter what you send, use aggregation, and create actionable alarms.
- **Observability:** the ability to understand the system's internal state from the data it emits.

**Cockpit perspective:** the **alarm** is the engineer who only calls the driver on the radio when the number leaves the window and there is something to do: an alert that asks for no action is noise on the radio. The **dashboard** is the wall screens. **Distributed tracing** is the mini-sectors of a lap: instead of knowing only that the lap was slow, you know in which stretch the time was lost. And the **cost** of logs is that of recording everything at very high frequency and keeping it forever: someone pays for the disk.

### AWS x Azure equivalence

| Concept | AWS (as in the material) | Azure (addition) |
|---|---|---|
| Monitoring platform | CloudWatch | Azure Monitor |
| Metrics | CloudWatch Metrics | Azure Monitor Metrics |
| Log storage and querying | CloudWatch Logs (Log Groups and Log Streams) | Log Analytics workspace (tables) |
| Query language | Logs Insights | KQL (Kusto Query Language) |
| Alarms | CloudWatch Alarms | Azure Monitor Alerts (with Action Groups to notify) |
| Dashboards | CloudWatch Dashboards (widgets) | Azure Dashboards and Workbooks |
| Events and automation | EventBridge (formerly CloudWatch Events) | Event Grid and Activity Log alerts |
| Agent on the VM | CloudWatch Agent | Azure Monitor Agent |
| Container metrics and logs | Container Insights | Container insights |
| Tracing and APM | X-Ray | Application Insights |
| Custom metrics | Custom metrics | Custom metrics and log-based metrics |
| Retention | Configurable per log group (default indefinite) | Configurable on the workspace |
| Action auditing | CloudTrail | Activity Log |
| AI anomaly detection | DevOps Guru | No 1 to 1 equivalent that I can state; check the anomaly detection features of Application Insights and Azure Monitor |

**Cockpit perspective:** each circuit has its own telemetry system: CloudWatch on AWS, Azure Monitor on Azure. Both collect numbers, store records, trigger alarms, and show screens; what changes is how you ask questions of the recorded data (Logs Insights or KQL).

### Commented example: the same question, two languages

**Question:** which were the last 20 requests with a 500 error in the last two hours?

**CloudWatch Logs Insights** (from the material; the time range is chosen on the screen or in the query call):

```
fields @timestamp, @message        # chooses the fields to show
| filter @message like /500/       # keeps only lines containing "500"
| sort @timestamp desc             # most recent first
| limit 20                         # only 20 lines
```

**KQL in Log Analytics (addition), using Application Insights request data in a workspace:**

```
AppRequests                                   // application requests table
| where TimeGenerated > ago(2h)               // range: two hours
| where ResultCode == "500"                   // response code equal to 500
| project TimeGenerated, Name, Url            // chooses the columns
| order by TimeGenerated desc                 // most recent first
| take 20                                     // only 20 lines
```

Notice the common pattern: both use **pipe** (`|`) to chain steps, but KQL works over **tables with typed columns**, while Logs Insights works over **log groups** with fields such as `@message`. If the text you want to find is not a column, KQL also filters free text:

```
AppTraces
| where Message contains "timeout"
| summarize ocorrencias = count() by bin(TimeGenerated, 5m)   // counts per 5-minute window
```

**Cockpit perspective:** both languages work like the data engineer after the session: take the whole recording, filter the stretch of interest, separate the channels, aggregate, and sort. The pipe (`|`) is passing the result of one tool to the next.

And the same in Logs Insights, which the material uses to create metrics from patterns such as "timeout":

```
filter @message like /timeout/
| stats count(*) as ocorrencias by bin(5m)
```

**Alarm for CPU above 80%**, creation commands (replace the placeholders; only create it if you have the resource and a notification destination):

```bash
# AWS: alarm on an instance's CPU, 5-minute average, above 80
aws cloudwatch put-metric-alarm --alarm-name cpu-alta \
  --namespace AWS/EC2 --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=<ID-DA-INSTANCIA> \
  --statistic Average --period 300 --evaluation-periods 1 \
  --threshold 80 --comparison-operator GreaterThanThreshold \
  --alarm-actions <ARN-DO-TOPICO-SNS>

# Azure (addition): equivalent metric alert; the Action Group defines who is notified.
# Ensures the group; the monitored VM must exist (recreate it with the Stage 04 block).
az group create --name rg-lab --location brazilsouth
az monitor metrics alert create --name cpu-alta --resource-group rg-lab \
  --scopes <ID-DA-VM> \
  --condition "avg Percentage CPU > 80" \
  --window-size 5m --evaluation-frequency 1m \
  --action <ID-DO-ACTION-GROUP>
```

**Cockpit perspective:** 80% CPU on a 5-minute average is the limit of the operating window; evaluating by period is not calling the driver because of a peak in a single lap. On Azure, the list of who gets called (the **Action Group**) is kept separate from the rule: the same contact group serves several alarms.

*Careful in this corner! Azure's "where are my logs" trips up many good people: sensor installed, channel turned off. Check twice before moving on.*

### Where they really differ

- **Log collection: what is automatic.** On AWS, services such as Lambda send logs to CloudWatch automatically. On Azure, resource logs generally need **diagnostic settings** that say where to send them (workspace, storage account, or Event Hubs). Forgetting this is the classic cause of "where are my logs".
- **One workspace, many tables.** Log Analytics gathers logs from several services in one workspace, in tables, and you query everything with KQL and can correlate. In CloudWatch, the unit is the log group, and queries are made over one or more groups.
- **Application Insights.** It is the part of Azure Monitor aimed at application performance (requests, dependencies, exceptions, distributed tracing), and its role is close to X-Ray combined with application metrics.
- **Alarm x alert + action group.** On Azure, the alert rule is separate from *who to notify*: the Action Group bundles email, SMS, webhook, function, etc., and is reused by several alerts.
- **"SQL-like".** The material describes Logs Insights as similar to SQL; in practice, both are **pipeline** languages, closer to `grep | sort | head` than to `SELECT`.
- **Cost.** On both, ingested volume and retention dominate the bill. The pricing and default retention rules differ; check before turning everything on.

**Here the analogy stops:** on Azure, many resources only send logs to the workspace after you turn on the **diagnostic settings**. It is like a sensor installed on the car with the channel turned off in the broadcast: the data exists on the car, but does not reach the wall. In F1 that would be an assembly error; in the cloud it is the default behavior of several resources, and it is the classic cause of "where are my logs".

### Hands-on

*Telemetry on screen! A log pipeline made only with the terminal, which filters, counts, and sorts the way Logs Insights and KQL do. Then reading in the cloud and, if you already have something to monitor, a real alarm.*

**Part 1: log pipeline on your machine (no cloud).** Simulate `filter | stats | sort | limit` with terminal tools:

```bash
cat > acesso.log <<'EOF'
2025-06-01T10:00:01Z GET /home 200
2025-06-01T10:00:02Z GET /checkout 500
2025-06-01T10:00:03Z GET /checkout 500
2025-06-01T10:00:04Z GET /produtos 200
2025-06-01T10:00:05Z POST /pedido 500
EOF

# filter @message like /500/ | stats count(*) by rota
grep " 500" acesso.log | awk '{print $3}' | sort | uniq -c | sort -rn
# Expected output:
#       2 /checkout
#       1 /pedido
```

That is the reasoning of Logs Insights and KQL: filter, extract a field, aggregate, and sort.

**Cockpit perspective:** `grep | awk | sort | uniq -c` is the engineer counting, in the session record, at which corners the car locked a wheel: it filters the events, extracts the corner, counts, and puts the worst one at the top.

**Part 2: reading in the cloud.**

```bash
aws cloudwatch list-metrics --namespace AWS/EC2 --max-items 5
aws logs describe-log-groups --query "logGroups[].{nome:logGroupName,retencaoDias:retentionInDays}" --output table
# an empty retencaoDias means indefinite retention (default)
# Azure (addition)
az monitor log-analytics workspace list --output table
```

**Part 3: create an alert (optional).** Only if you already have a resource to monitor (the VM or instance from Stage 04) and a notification destination. Use the alarm commands above and, once created, note that it appears as "OK" or "Insufficient data" until it receives data points.

**Cleanup:**

```bash
aws cloudwatch delete-alarms --alarm-names cpu-alta
# Azure (addition)
az monitor metrics alert delete --name cpu-alta --resource-group rg-lab
az group delete --name rg-lab --yes --no-wait
# Before recreating rg-lab in the next stage, wait for the deletion to finish:
az group wait --deleted --name rg-lab
```

*Lap complete! Metric, event, and log in a slow checkout, a translation to KQL, and the first item to check when the log does not arrive.*

**Exercises**

1. How does the material differentiate metric, event, and log? Give an example of each for a slow checkout.
2. Translate to KQL: "count how many times 'timeout' appears per 5-minute window".
3. You turned on a service on Azure and see no logs in the workspace. What is the first item to check?

**Answer key**

1. Metric: average checkout latency (the what). Event: instance restarted at 2:02 pm (the when). Log: stack trace of the database timeout error (the why).
2. `AppTraces | where Message contains "timeout" | summarize count() by bin(TimeGenerated, 5m)`.
3. The resource's diagnostic settings, pointing to the workspace.

**Remember this:** a metric says what, an event says when, a log says why; define retention, alert only on what is actionable, and know how to query logs in a pipeline (Logs Insights or KQL).

**Stage 08 checklist**

- [ ] I can tell logs, metrics, and events apart.
- [ ] I can write the same query in Logs Insights and in KQL.
- [ ] I know what diagnostic settings and action groups are.
- [ ] I know why to define log retention.
- [ ] I know what X-Ray and Application Insights answer.

*Sector 8 in green! You know what each source answers and you query the recording in both languages. In Abu Dhabi, in 2010, Ferrari decided Fernando Alonso's stop by looking at the wrong rival and lost the title, and that is the lesson of Stage 08: a good alarm fires on the metric that decides the result, not on the first signal that shows up on the screen. Now the user's request needs to arrive fast. Stage 09, content delivery, balancing, and objects.*

---

## Stage 09: Content delivery, load balancing, and objects (CloudFront, Load Balancer, and S3 x Front Door, Application Gateway, and Blob Storage)

*Ninth sector! Central warehouse, forward depots close to whoever asks, and the pit lane entry control choosing the healthy pit box. It is the path a request takes to the car, and each stretch has a different name on each circuit.*

### The problem

A user in Fortaleza accesses a site hosted on the other side of the world: every image and every script crosses oceans. In a campaign, a thousand users arrive at the same time and the single server saturates. And the images, where to store them cheaply and durably? Three problems, three solutions that work together: **CDN**, **load balancer**, and **object storage**.

### The concept, in a neutral way

**Analogy:** a chain of stores. The CDN is branches close to the customer with copies of the most requested products; the load balancer is the receptionist who directs each customer to a free checkout; object storage is the big central stockroom, cheap and organized.

**Cockpit perspective:** in our map, **object storage** is the **central warehouse**: cheap, organized, each item with a unique tag. The **CDN** is the **forward parts depots** spread around the world, close to whoever asks, with copies of what goes out most, so nobody waits for the part to cross oceans. The **load balancer** is the **pit lane entry control**, which directs each car to a free pit box and closes the pit box with a problem (the **health check**). Layer 4 is directing only by the car number; layer 7 is reading the request (tire change, wing change) and sending it to the pit box prepared for that service. **Here the analogy stops:** in the real pit lane, each car stops at its own team's pit box; the image holds for the load balancer's role, not for the track rule.

- **CDN (Content Delivery Network):** a global network of edge servers that cache static content (images, videos, CSS, JavaScript, HTML) and deliver it from the point closest to the user. Benefits: **performance** (lower latency), **availability** (redirects if a point fails), **scalability** (absorbs peaks), and **security** (first line against DDoS and malicious requests). Control of **TTL**, compression, and restricted access to authorized content.
- **Load balancer:** distributes requests among several origins, with **health checks** that remove the ones that failed. Layer 4 (TCP and UDP, transport) and layer 7 (HTTP and HTTPS, decides by URL, headers, cookies). It can be done by hand with Nginx or HAProxy, but requires maintenance.
- **Object storage:** data in **logical containers** (buckets), each object with data, metadata, and a unique key, accessed through a REST API. Very high durability, practically unlimited scale, an ideal origin for static sites and for the CDN.
- **Storage classes:** frequent data in a hot tier; backups and old records moved to cheaper tiers according to access frequency.
- **Best practices:** structured key names, avoid unnecessary public access, prefer signed URLs, versioning against accidental deletion, encryption at rest and in transit.

**Cockpit perspective:** the **storage classes** are the shelf and the archive. A part from this season stays on the shelf, at hand (hot tier); a car from three years ago goes to the historical archive, cheap to keep and slow to fetch (cold tiers). The **signed URL** is the **one-day guest pass**: it opens a specific door and expires on its own. **Versioning** is keeping the previous revision of the part, in case someone throws out the current one by mistake.

### AWS x Azure equivalence

| Concept | AWS (as in the material) | Azure (addition) |
|---|---|---|
| CDN | CloudFront | Azure Front Door (and Azure CDN; check the documentation for which is recommended) |
| Layer 7 load balancer | Application Load Balancer (ALB) | Application Gateway |
| Layer 4 load balancer | Network Load Balancer (NLB) | Azure Load Balancer |
| Load balancer for third-party appliances | Gateway Load Balancer (GWLB) | Azure Gateway Load Balancer |
| Global DNS-based balancing | Route 53 (Stage 10) | Traffic Manager (Stage 10) |
| Object storage | S3 (buckets and objects) | Blob Storage (containers and blobs, inside a storage account) |
| Storage classes | S3 Standard, Infrequent Access, Glacier | Hot, Cool, Cold, and Archive tiers |
| Temporary access to an object | Signed URL (presigned URL) | SAS (Shared Access Signature) |
| Versioning | S3 versioning | Blob versioning and soft delete |
| Lifecycle rules | Lifecycle rules | Lifecycle management policies |
| Static site | S3 as a static site | Static website in a storage account |
| Encryption with your own key | SSE-S3 and SSE-KMS | Storage encryption (Microsoft-managed keys or customer keys in Key Vault) |
| DDoS and WAF protection | AWS Shield and AWS WAF | Azure DDoS Protection and Azure WAF |
| Code at the edge | Lambda@Edge and CloudFront Functions | Front Door routing rules and features (check the current equivalent) |
| Autoscaling with a load balancer | Auto Scaling + ELB | VM Scale Sets + Load Balancer or Application Gateway |

**Cockpit perspective:** both circuits have a warehouse (S3, Blob Storage), forward depots (CloudFront, Front Door), a pit lane entry at layer 7 (ALB, Application Gateway) and at layer 4 (NLB, Azure Load Balancer). The guest pass is called a signed URL on AWS and a SAS on Azure.

### Commented example: the static site, from storage to delivery

**AWS: bucket and upload**

```bash
# Creates a bucket (the name is unique worldwide, across all of AWS)
aws s3 mb s3://<NOME-UNICO-DO-BUCKET> --region sa-east-1
# Uploads a file
echo "<h1>Olá, nuvem</h1>" > index.html
aws s3 cp index.html s3://<NOME-UNICO-DO-BUCKET>/index.html
# Lists the content; expected: one line with index.html and its size
aws s3 ls s3://<NOME-UNICO-DO-BUCKET>/
# Generates a signed URL that expires in 300 seconds (the safe way to share)
aws s3 presign s3://<NOME-UNICO-DO-BUCKET>/index.html --expires-in 300
```

**Azure (addition): storage account, container, and upload**

```bash
# Recreates the group (the previous stage's cleanup deleted it)
az group create --name rg-lab --location brazilsouth
# The storage account is the level with a globally unique name (3 to 24 lowercase letters and numbers)
az storage account create --name st<NOME-UNICO> --resource-group rg-lab \
  --location brazilsouth --sku Standard_LRS --kind StorageV2 \
  --allow-blob-public-access false          # no anonymous public access

# To operate on data with your identity (--auth-mode login), you need a DATA role,
# even if you own the subscription:
az role assignment create --assignee <SEU-E-MAIL> --role "Storage Blob Data Contributor" \
  --scope $(az storage account show -n st<NOME-UNICO> -g rg-lab --query id -o tsv)
# New permissions can take a few minutes to take effect: if the next command
# fails with AuthorizationPermissionMismatch, wait a little and try again.

az storage container create --account-name st<NOME-UNICO> --name site --auth-mode login
az storage blob upload --account-name st<NOME-UNICO> --container-name site \
  --name index.html --file index.html --auth-mode login
az storage blob list --account-name st<NOME-UNICO> --container-name site --auth-mode login -o table
# The equivalent of the signed URL is a user delegation SAS.
# Validity: one day from now, in UTC (a user delegation SAS is valid for at most 7 days).
# On macOS, replace the $(date ...) with: $(date -u -v+1d '+%Y-%m-%dT%H:%MZ')
az storage blob generate-sas --account-name st<NOME-UNICO> --container-name site \
  --name index.html --permissions r --expiry $(date -u -d '+1 day' '+%Y-%m-%dT%H:%MZ') \
  --auth-mode login --as-user --full-uri
```

**Balancing and CDN, in the design's practice.**

```
User
   |
   v
CloudFront ........................ Front Door
   |  (static: S3)                     |  (static: Blob Storage)
   |  (dynamic: ALB)                   |  (dynamic: Application Gateway)
   v                                   v
ALB (layer 7) -> EC2 / ECS       Application Gateway -> VMs / AKS
```

**Cockpit perspective:** the design is the path of a request to the car. The user reaches the nearest forward depot; if it is a catalog part (static), the depot delivers its own copy or fetches it from the warehouse; if it is made-to-measure work (dynamic), the depot forwards it to the pit lane entry, which chooses a healthy pit box. **Hypothetical:** the Sepang podium video (Verstappen, Antonelli, and Hamilton) requested by a fan in Fortaleza comes from the nearest forward depot, not from the warehouse on the other side of the world.

### Where they really differ

- **Namespace.** The name of an S3 bucket is unique across all of AWS and identifies the bucket directly. On Azure, the globally unique name is that of the **storage account**; inside it, containers have names unique only within that account. The storage account also hosts other services (Files, Queues, Tables), while the S3 bucket is only objects.
- **Data permission.** On Azure, the owner role (Owner) manages the account but does not necessarily read the blobs through Entra ID: you need a data role, such as Storage Blob Data Contributor (Stage 02, control plane x data plane).
- **Public access.** The material warns against unnecessary public buckets. On Azure, anonymous public access is a setting of the account and of the container; check the current default for new accounts and disable it when it is not needed.
- **Protected origin.** "Only the CDN accesses the storage" is done on AWS with CloudFront origin access control. On Azure, it depends on the origin type: Front Door (premium tiers) can use Private Link for origins, and public origins can be restricted by the Front Door identifier header or by network rules. Check the documentation for the scenario.
- **Application Gateway x ALB.** Application Gateway lives inside a VNet, in a dedicated subnet, and integrates WAF. Front Door is a global service at the edge. The ALB is regional and CloudFront is the global layer. The roles are similar, but the combination of products is different.
- **Storage tiers.** The S3 classes (Standard, IA, Glacier) and the Blob tiers (Hot, Cool, Cold, Archive) serve the same idea (colder data, cheaper to keep and more expensive or slower to access), but with their own rules, minimum retention periods, and costs. Do not assume price equivalence.

**Here the analogy stops:** on S3, the tag that is unique in the whole world is the bucket name. On Azure, the unique name is that of the storage account (the warehouse building), and the containers inside it only need a unique name in that building. A real warehouse does not need a name that is unique on the planet; in the cloud it does, because the name becomes a public address.

### Hands-on

*Bench powered on, no cloud! You serve a folder, read the headers, and watch the `304` happen: the forward depot asking whether the revision is still the current one. Creation in the cloud costs cents, if you delete it on the same day.*

**Part 1: what the CDN uses to decide, without the cloud.** Serve a folder and observe the headers and the cache validation:

```bash
mkdir -p site && echo "<h1>Olá</h1>" > site/index.html
python3 -m http.server --directory site 8000 &   # local file server, serving the site folder
sleep 1
curl -sI localhost:8000/index.html
# Expected output (values vary): HTTP/1.0 200 OK, Content-type: text/html,
# Content-Length and Last-Modified. Note that there is NO Cache-Control: that is why you are
# the one who configures the TTL on the CDN.

# Resends the request saying "only send me if it changed since Last-Modified"
LM=$(curl -sI localhost:8000/index.html | grep -i '^Last-Modified' | cut -d' ' -f2- | tr -d '\r')
curl -sI -H "If-Modified-Since: $LM" localhost:8000/index.html | head -1
# Expected output: HTTP/1.0 304 Not Modified
```

The `304` is the validation mechanism that allows reusing a cached copy.

**Cockpit perspective:** `304 Not Modified` is the forward depot calling the warehouse and hearing "your revision is still the current one, use the one you have". Nothing travels again. The **TTL** is for how long the depot trusts its own copy without calling.

**Part 2: reading in the cloud.**

```bash
aws s3 ls
aws elbv2 describe-load-balancers --query "LoadBalancers[].{nome:LoadBalancerName,tipo:Type}" --output table
# Azure (addition)
az storage account list --output table
az network application-gateway list --output table
az network lb list --output table
```

**Part 3: optional creation (cents, if you delete it on the same day).** Run the "AWS: bucket and upload" block and the "Azure (addition): storage account" block, upload `index.html`, list, and generate the temporary link. Open the link and confirm that it expires.

**Cleanup:**

```bash
# Local: stops the server (job %1 of this terminal) and deletes the lab folder and file
kill %1 2>/dev/null; rm -rf site index.html
# If you closed the terminal, stop the server with the command: pkill -f "http.server --directory site"
aws s3 rm s3://<NOME-UNICO-DO-BUCKET> --recursive    # empties the bucket
aws s3 rb s3://<NOME-UNICO-DO-BUCKET>                # deletes the bucket
# Azure (addition): deletes the storage account and everything in the group
az group delete --name rg-lab --yes --no-wait
# Before recreating rg-lab in the next stage, wait for the deletion to finish:
az group wait --deleted --name rg-lab
```

*Timed pit stop! Design the delivery of a news site, choose the layer for URL routing, and send old backups to the historical archive.*

**Exercises**

1. A news site has static images and a dynamic API. Draw the delivery on both providers.
2. You need URL routing (`/api` to one group, `/img` to another). Layer 4 or 7? Which products?
3. Backups older than a year are rarely read. What type of tier should you use?

**Answer key**

1. Static: S3 or Blob at the origin, CloudFront or Front Door in front. Dynamic: ALB or Application Gateway distributing among instances, containers, or functions.
2. Layer 7: ALB (AWS) and Application Gateway (Azure).
3. Cold tiers: S3 IA/Glacier (AWS) and Cool, Cold, or Archive (Azure), watching costs and access times.

**Remember this:** the CDN brings it closer, the load balancer distributes, object storage keeps it cheap; on Azure, the unique name lives in the storage account, not in the container.

**Stage 09 checklist**

- [ ] I can explain what a CDN does and its four benefits.
- [ ] I know the difference between a layer 4 and a layer 7 load balancer.
- [ ] I can map S3 to storage account, container, and blob.
- [ ] I know what a signed URL (AWS) and a SAS (Azure) are.
- [ ] I know how to avoid unnecessary public access.

*Sector 9 in green! Warehouse, forward depots, and pit lane entry, on both circuits. What is left is locking down the operation: vault, inspection, Super Licence, and entry list. Stage 10, the security straight.*

---

## Stage 10: Secrets, WAF, certificates, and DNS (Secrets Manager, WAF, ACM, and Route 53 x Key Vault, Azure WAF, certificates, and Azure DNS)

*Tenth sector, the second to last! Four layers of protection in a single stretch: the combination vault, the marshal who searches the request, the Super Licence that expires, and the entry list that links name to number. Here a Friday night oversight costs the entire weekend.*

### The problem

A developer commits the database password to the repository. Days later, bots sweep the internet looking for leaked credentials. In parallel, the public API suffers SQL injection, and the HTTPS certificate expires on a Friday night, taking the site down with a "not secure" warning. And the user types `www.meuapp.com`, but the system needs to know which IP to send them to, and where to send them if a data center falls. Four layers of protection and availability beyond access control.

### The concept, in a neutral way

**Analogy:** a safe for keys (secrets), a security guard who searches whoever enters (WAF), the building's ID card (certificate), and the phone book (DNS).

**Cockpit perspective:** in the paddock, the four layers are these. The **combination vault** (the secrets) only hands over the combination on the spot to whoever has an authorized pass, records who asked, and changes the combination from time to time (the rotation). The **marshal who searches** (the **WAF**) is not content to read the pass, like the door marshals of Stage 03: he opens the bag and looks at the content of the HTTP request. The **Super Licence** (the **certificate**) is issued by a recognized authority, proves who you are, and **expires**, needing to be renewed. And the **entry list** (the **DNS**) links a name to a number: the driver's name to the car, `www.meuapp.com` to the IP.

- **Secrets management:** a digital vault for database passwords, tokens, and keys, with controlled access, auditing, encryption, **versioning**, and **automatic rotation**. It avoids credentials in code, configuration files, and repositories.
- **Encryption keys:** a service that creates and controls keys used to encrypt data at rest. On both providers, secrets and storage services integrate with it.
- **WAF (Web Application Firewall):** a layer 7 firewall that analyzes HTTP and HTTPS traffic: SQL injection patterns, scripts, vulnerability exploitation, rate limiting, blocking by country, by header, or by IP reputation.
- **Digital certificates (TLS):** guarantee confidentiality, integrity, and authenticity in HTTPS. Manual management (issuing, renewing, installing, monitoring validity) is laborious and risky. Automate **issuance, validation (by DNS or email), and renewal**. Wildcard certificates cover subdomains. Private certificates serve internal communication.
- **DNS:** translates names into IP addresses in a hierarchical and distributed structure. **TTL** defines how long an answer stays cached. **Public** and **private** zones (only inside the network). Routing policies: simple, by latency, geographic, failover, and weighted.

**Cockpit perspective:** the DNS **TTL** is how long a printed copy of the entry list is valid before being checked again. A long TTL saves queries and delays changes; a short TTL makes the change show up quickly and generates more queries. The routing policies choose which address to send each person to: the closest one (latency), the one in their country (geographic), the backup when the main one falls (failover), or a split by weight (weighted).

### AWS x Azure equivalence

| Concept | AWS (as in the material) | Azure (addition) |
|---|---|---|
| Secrets vault | Secrets Manager | Key Vault (secrets) |
| Automatic rotation | Secrets Manager (native for RDS, Redshift, and Lambda) | Rotation supported by Key Vault events and automation (for example, Event Grid and Functions); check the current features |
| Encryption keys | KMS | Key Vault (keys) and Managed HSM |
| WAF | AWS WAF (ALB, CloudFront, API Gateway) | Azure WAF (Application Gateway and Front Door) |
| Managed certificates | ACM (free public certificates) | App Service and Front Door managed certificates; certificates in Key Vault |
| Private certificate authority | ACM Private CA | No equivalent of the same name that I can state; check the documentation for private PKI on Azure |
| Managed DNS | Route 53 (public and private zones) | Azure DNS (public zones) and Azure Private DNS (private zones) |
| Smart traffic routing | Route 53 policies (latency, geographic, failover, weighted) | Traffic Manager (Performance, Geographic, Priority, Weighted) |
| Domain registration | Route 53 as registrar | Azure DNS does not register domains; use App Service Domains or another registrar |
| DDoS protection | Shield | Azure DDoS Protection |
| Network firewall | Network Firewall | Azure Firewall |

Map of the material's routing policies:

| Policy (material) | Route 53 | Traffic Manager (addition) |
|---|---|---|
| Simple | Simple | (direct DNS record in Azure DNS) |
| Latency-based | Latency | Performance |
| Geographic | Geolocation | Geographic |
| Failover | Failover | Priority |
| Weighted | Weighted | Weighted |

**Cockpit perspective:** the procedure is the same on both circuits, with a floor plan difference that matters: Azure keeps combinations, encryption keys, and certificates in the same vault (Key Vault), while AWS separates them into three counters (Secrets Manager, KMS, and ACM).

### Commented example: storing and reading a secret

```bash
# AWS: creates a secret and reads it back
aws secretsmanager create-secret --name lab/senha-banco --secret-string 'S3nh@Forte'
aws secretsmanager get-secret-value --secret-id lab/senha-banco --query SecretString --output text
# Expected output: S3nh@Forte

# Azure (addition): recreates the group, creates the vault (globally unique name), stores the secret, and reads it
az group create --name rg-lab --location brazilsouth
az keyvault create --name kv-<NOME-UNICO> --resource-group rg-lab --location brazilsouth \
  --enable-rbac-authorization true     # permissions via Azure RBAC (the model Microsoft recommends)
# Your user needs a data role on the vault to write and read secrets
az role assignment create --assignee <SEU-E-MAIL> --role "Key Vault Secrets Officer" \
  --scope $(az keyvault show -n kv-<NOME-UNICO> --query id -o tsv)
az keyvault secret set --vault-name kv-<NOME-UNICO> --name senha-banco --value 'S3nh@Forte'
az keyvault secret show --vault-name kv-<NOME-UNICO> --name senha-banco --query value -o tsv
# Expected output: S3nh@Forte
```

(New permissions can take a few minutes to take effect.)

**Cockpit perspective:** notice that, on Azure, not even the contract owner opens the vault without a data role (`Key Vault Secrets Officer`). It is the separation between managing the resource and reading what is inside it, from Stage 02, again: owning the building does not give you the vault combination.

**A DNS rule in the public zone**, in both worlds (hosted zones have a monthly cost, so use the practice with care):

```bash
# AWS: creates the zone and keeps its ID (format /hostedzone/Z...)
ZONA_ID=$(aws route53 create-hosted-zone --name exemplo-lab.example \
  --caller-reference lab-$(date +%s) --query HostedZone.Id --output text)
# Change file: A record "www" with a TTL of 300 seconds (UPSERT creates or updates)
cat > registro.json <<'EOF'
{"Changes":[{"Action":"UPSERT","ResourceRecordSet":{"Name":"www.exemplo-lab.example","Type":"A","TTL":300,"ResourceRecords":[{"Value":"203.0.113.10"}]}}]}
EOF
aws route53 change-resource-record-sets --hosted-zone-id "$ZONA_ID" --change-batch file://registro.json
aws route53 list-resource-record-sets --hosted-zone-id "$ZONA_ID" \
  --query "ResourceRecordSets[].{nome:Name,tipo:Type,ttl:TTL}" --output table

# Azure (addition): ensures the group, creates the zone and an A record "www"
az group create --name rg-lab --location brazilsouth
az network dns zone create --resource-group rg-lab --name exemplo-lab.example
az network dns record-set a add-record --resource-group rg-lab --zone-name exemplo-lab.example \
  --record-set-name www --ipv4-address 203.0.113.10
az network dns record-set a list --resource-group rg-lab --zone-name exemplo-lab.example -o table
```

(`203.0.113.10` and the `.example` domain are addresses and names reserved for documentation: nothing really resolves, which is great for practicing without risk. If the CLI refuses the reserved name, use a subdomain of a domain that is yours, for example `lab.seudominio.com.br`.)

**Cockpit perspective:** the A record `www` pointing to `203.0.113.10` is one line of the entry list: the name on the left, the number on the right. Addresses and names reserved for documentation are a fictional practice list: you can make mistakes freely, because no real car uses those numbers.

### Where they really differ

- **Secrets, keys, and certificates in a single vault.** Key Vault stores secrets, keys, and certificates in the same service. On AWS, they are separate services: Secrets Manager, KMS, and ACM. In return, Key Vault has its own authorization model (data RBAC or access policies), another reason to understand the control plane x data plane of Stage 02.
- **Rotation.** Secrets Manager brings automatic rotation integrated with some services. On Azure, secret rotation is usually assembled with events and automation; to avoid the problem at the source, prefer **Managed Identity** (Stage 02), which does away with the password.
- **Certificates.** ACM issues free certificates for the integrated AWS services (ALB, CloudFront, API Gateway) and renews on its own. On Azure, management varies by service: managed certificates in App Service and Front Door, and Key Vault certificates for other scenarios, including with partner authorities. Validate the conditions of your case.
- **WAF.** AWS WAF attaches to ALB, CloudFront, and API Gateway. Azure WAF attaches to Application Gateway and Front Door, with managed rule sets and custom rules. On both, start in detection mode before blocking, to avoid false positives.
- **DNS and domain registration.** Route 53 is DNS and also a registrar. Azure DNS hosts zones, but buying the domain is another product. Smart traffic routing lives in **Traffic Manager** (via DNS) on Azure, while on Route 53 it is a property of the records themselves. For global balancing at the HTTP layer on Azure, see also Front Door (Stage 09).

**Here the analogy stops:** a stolen padlock combination is only one, and changing the padlock solves it. A leaked secret may have been copied without limit: it must be revoked and replaced, and the source of the leak must be closed. The best way out, when the circuit allows it, is not to have a combination at all: the pass attached to the equipment (IAM Role, Managed Identity) does away with the password. And on the certificate: the Super Licence is one per driver, issued by a single authority; TLS certificates are issued by several certificate authorities, and a domain can have more than one valid at the same time.

### Hands-on

*Pit lane open! DNS and certificates read straight from the terminal, no cloud account. Then the secret stored and read back in both vaults, with one extra step in the Azure cleanup because of soft delete.*

**Part 1: DNS and certificates on your machine (no cloud).**

```bash
dig +noall +answer example.com A
# Expected output (values vary): name, TTL in seconds, type A, and the IP
# The number between the name and "IN" is the TTL: how long the result can stay cached.

dig +short example.com NS
# Expected output: the domain's authoritative name servers

openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
# Expected output: subject, issuer (who issued it), and notBefore/notAfter (validity)
```

Observe the validity (`notAfter`): it is exactly the deadline that a managed certificate service must renew for you.

**Cockpit perspective:** `notAfter` is the expiry date of the site's Super Licence. A certificate expired on a Friday night is like an expired document at the circuit gate: the car is ready and does not get on the track. Automatic renewal takes that risk out of human hands.

**Part 2: reading in the cloud.**

```bash
aws secretsmanager list-secrets --query "SecretList[].Name" --output text
aws acm list-certificates --query "CertificateSummaryList[].DomainName" --output text
aws route53 list-hosted-zones --query "HostedZones[].Name" --output text
aws wafv2 list-web-acls --scope REGIONAL --query "WebACLs[].Name" --output text
# Azure (addition)
az keyvault list --output table
az network dns zone list --output table
az network application-gateway waf-policy list --output table
```

**Part 3: optional creation.** Create the secret and read it back, on both providers (the cost is very low). Key Vault has *soft delete* on by default: the name of a deleted vault stays reserved until it is permanently removed, so the cleanup has one extra step.

**Cleanup:**

```bash
# AWS: deletes the secret with no waiting period (for lab use only)
aws secretsmanager delete-secret --secret-id lab/senha-banco --force-delete-without-recovery
# If you created the hosted zone, delete it (it charges monthly). Records other than the defaults
# (NS and SOA) must go first: the DELETE repeats exactly the values of the record created.
sed 's/"UPSERT"/"DELETE"/' registro.json > remover.json
aws route53 change-resource-record-sets --hosted-zone-id "$ZONA_ID" --change-batch file://remover.json
aws route53 delete-hosted-zone --id "$ZONA_ID"
rm -f registro.json remover.json
# (if you closed the terminal, replace "$ZONA_ID" with the ID shown in: aws route53 list-hosted-zones)

# Azure (addition): deletes the group (including the Key Vault and the DNS zone)
az group delete --name rg-lab --yes
# Purges the vault from the recycle bin (soft delete) to release the name
az keyvault purge --name kv-<NOME-UNICO>
```

*Timed pit stop! Password out of the repository, routing with failover between Europe and Brazil, and the certificate that expires tomorrow.*

**Exercises**

1. Why not put the database password in an environment variable in the repository? What should you do instead, on both providers?
2. A site has users in Europe and in Brazil, and you want to send each group to the nearest environment, with failover. Which policy on both providers?
3. The site's certificate expires tomorrow and nobody renewed it. Which feature would have prevented this?

**Answer key**

1. Variables in the repository leak. Store it in Secrets Manager (AWS) or Key Vault (Azure), with minimum permission; better still, use a role or Managed Identity to do away with the password.
2. Latency (Route 53) or Performance (Traffic Manager), with failover tied to health checks. In Traffic Manager, the Performance method itself already diverts to the next healthy endpoint when the closest one fails; combining Performance with Priority explicitly requires nested profiles.
3. Managed certificates with automatic renewal: ACM (AWS) and Front Door or App Service managed certificates (Azure), or Key Vault with renewal.

**Remember this:** secret in the vault, traffic filtered by the WAF, certificate renewed by machine, and DNS with a routing policy; on Azure, the vault brings together secrets, keys, and certificates.

**Stage 10 checklist**

- [ ] I know why secrets do not stay in the code.
- [ ] I know what a WAF sees that a network firewall does not.
- [ ] I know how certificate validation by DNS and automatic renewal work.
- [ ] I can map the five Route 53 routing policies to Traffic Manager.
- [ ] I know that Azure DNS does not register domains.

*Sector 10 in green! Secret in the vault, traffic searched, Super Licence renewed by machine, and entry list with a routing policy. Now it is the victory lap: turning all this into a study plan. Stage 11.*

---

## Stage 11: AWS Academy, study, and certifications (and the Microsoft path)

*Last sector! Time to think about moving up a category: the certification steps on both sides, the factory simulator, and a study method that looks at the telemetry of your own mistakes.*

### The problem

You finished the module, you know the theory, and you want your first cloud job. Your resume does not set you apart from the others, and practicing on your own account can generate costs. Certifications validate knowledge in a standardized way, and educational programs offer labs with no cost risk.

### The concept, in a neutral way

- **Cloud certification:** an exam administered by an official body (the provider itself), with a standardized structure, that validates practical and theoretical mastery in architecture, security, development, and operations. It is not required by law, but it adds to a resume and becomes a selection criterion in many DevOps, architecture, back-end, and data openings.
- **Levels:** entry, intermediate, advanced, and specialties. Each level has its own audience and depth.
- **Educational program:** partner institutions receive tracks, materials, and labs in a real, temporary environment, at no cost to a personal account.
- **Preparation:** hands-on experience, whitepapers and documentation, practice exams to find weak points, and targeted review of each mistake.
- **Continuous journey:** the pace of innovation demands updating and periodic recertification.

**Cockpit perspective:** the certification levels are the **feeder categories**. A driver usually climbs step by step (F4, F3, F2) before F1, and each step shows that he has mastered the previous one. The entry certification (Cloud Practitioner, AZ-900) is the first step; the Associate and Professional or Expert levels are the next ones. The **educational program** with a temporary lab (AWS Academy, Microsoft Learn sandboxes) is the **factory simulator**: you drive for real, make real mistakes, and do not crash any car (nor generate a bill on your account). **Recertification** is the regulation that changes every season: what held last year needs to be reviewed. **Here the analogy stops:** moving up a category depends on results on the track and, often, on sponsorship; certification depends on study and an exam, is not required by law, and you can take the entry one of both providers in whatever order you like.

### What the material says about AWS certifications (as in the material, 2025 reference)

> This table reproduces what the lesson reported in June 2025. **Names, curricula, prices, duration, and prerequisites of certifications change, and some may have been discontinued or replaced since then.** Always check the official AWS site before planning. This guide does not state the current status.

| Level (as in the material) | Profile | Format | Time | Cost cited |
|---|---|---|---|---|
| Foundational (for example, Cloud Practitioner) | Beginners or non-technical profiles | Multiple choice | 90 minutes | 100 dollars |
| Associate (Solutions Architect, SysOps, and Developer) | Technical people with some AWS experience | Multiple choice | 90 minutes | 150 dollars |
| Professional (for example, Solutions Architect, DevOps) | Lots of experience | Multiple choice | 170 minutes | 300 dollars |
| Specialty (for example, Security, Big Data, Machine Learning, database, and network; the lesson also cites Alexa Skill Builder) | Specialization in a topic | Multiple choice | 170 minutes | 300 dollars |

Prerequisite suggested by the lesson for Foundational: at least 6 months of AWS experience (technical, management, or sales). The exam can be taken from home on the computer, with scheduling and rules.

### AWS x Azure equivalence (addition)

Microsoft also organizes certifications in levels: **Fundamentals**, **Associate**, **Expert**, and **Specialty**, and many are by role (role-based). The comparison below is **approximate, by level and profile**, not an official equivalence.

| Profile | AWS (as in the material) | Microsoft Azure (addition; check the official site) |
|---|---|---|
| Entry, cloud concepts | Cloud Practitioner | AZ-900 (Azure Fundamentals) |
| Administration and operations | SysOps Administrator (Associate; the name may have changed, check the official site) | AZ-104 (Azure Administrator, Associate) |
| Solutions architecture | Solutions Architect Associate and Professional | AZ-305 (Azure Solutions Architect Expert) |
| DevOps | DevOps Engineer Professional | AZ-400 (DevOps Engineer Expert) |
| Development | Developer Associate | AZ-204 (Azure Developer, Associate) |
| Security | Security Specialty | Microsoft security family certifications (for example, AZ-500); check the current curriculum |
| Data, AI, network | Specialties | Microsoft topic-specific certifications; check the current curriculum |

Reminders for the table above: the codes (AZ-900, AZ-104, AZ-305, AZ-400) may change, be retired, or gain prerequisites (the Expert titles require an Associate certification as a prerequisite: the Azure Solutions Architect Expert, from AZ-305, requires AZ-104, and the DevOps Engineer Expert, from AZ-400, requires AZ-104 or AZ-204; check the official guide). Prices and durations of the Azure exams are **not** in this guide: consult each exam's page.

Educational programs:

| Resource | AWS (as in the material) | Microsoft (addition; check availability) |
|---|---|---|
| Program for educational institutions | AWS Academy (tracks, labs in a real environment, vouchers in some cases, qualified instructor) | Microsoft Learn (free tracks and modules; some with a temporary lab environment) and programs for educators |
| Lab with no cost risk | Academy labs in a temporary environment | Microsoft Learn module sandboxes (in some modules) |
| Free account to study | Free Tier (12 months, according to the lesson; rules change) | Azure free account and student plans (rules and credits change; check) |
| Preparation courses | ACloudGuru, Linux Academy, Udemy (cited in the material) | Microsoft Learn, and other third-party platforms |

### The instructor's method for preparing for the exam (as in the material)

1. Have at least two years of hands-on experience in the area of the desired certification (the material recommends it), dynamic reading, and focus.
2. Read at least two whitepapers per week, with or without a certification in mind.
3. Take practice exams (the material cites ACloudGuru, Whizlabs, and LinuxAcademy) and analyze the weakest areas.
4. For the weak topics, look for official whitepapers and videos (the material cites AWS re:Invent on YouTube).
5. Retake the practice exam, read the explanation of each mistake, and consult the official documentation.

This method is provider-independent: replace "whitepapers" and "re:Invent" with the equivalent official Microsoft content (documentation, Microsoft Learn, and each exam's study guides) and it remains valid.

**Cockpit perspective:** it is the method of someone who works in the simulator. You run the lap (the practice exam), see where you lost time (the weak areas), study that stretch in the data (whitepaper, documentation, official video), and run again. Rereading the entire material without knowing where you lost time is doing a hundred identical laps without looking at the telemetry.

**Exam tips (as in the material):** review using the official guide; solve practice exams; in a remote exam, test the environment beforehand; stay calm, read carefully, and reason from lab experience.

### Where they really differ

- **Structure.** Many AWS certifications are organized by level and areas (Foundational, Associate, Professional, Specialty). Microsoft organizes by **role** (administrator, developer, architect, security) and by **level** (Fundamentals, Associate, Expert, Specialty). The comparison is by profile, not by level number.
- **Stability.** On both providers, certification curricula are reorganized periodically. Do not treat this guide as the source of the current list.
- **Study plan.** What holds for both: a foundation in fundamentals, lab practice, and a practice exam with review of the mistakes.

### Hands-on

*Planning lap! One profile, the exam guides of both sides, a cross-reference table with dates, and one lab session per week. And, at the end, the round through both garages.*

**Part 1: build your study plan (no cost).**

1. Choose **one** profile: administration, development, architecture, or DevOps.
2. Open, on each provider's official site, the page of the entry certification and the one of the next level. Note the **exam guide** (domains covered) and the **language** of the exams.
3. Cross the guide with the stages of this material: for each exam domain, mark in which stage (01 to 10) it is covered.
4. Choose a free resource from each provider (Academy, if your institution participates; Microsoft Learn; or the free account) and schedule **one lab session per week**.

**Part 2: domain cross-reference.** Fill in a table like this one, with dates:

| Exam domain (official) | Stage of this guide | Hands-on done? | Review date |
|---|---|---|---|
| (example) Security and identity | 02 | yes | |
| (example) Networking | 03 | yes | |

**Cleanup (of costs):** before ending the study day, review what is left in both accounts. On AWS, run it in the region where you practiced (for example, `export AWS_DEFAULT_REGION=sa-east-1`); each empty line is good news.

```bash
# AWS: EC2 instances that were not terminated (stopped ones also charge for the disk)
aws ec2 describe-instances --query "Reservations[].Instances[?State.Name!='terminated'].[InstanceId,State.Name]" --output text
# AWS: EKS clusters (control plane and nodes charge by the hour)
aws eks list-clusters --query clusters --output text
# AWS: Route 53 hosted zones (charge monthly)
aws route53 list-hosted-zones --query "HostedZones[].[Id,Name]" --output text
# AWS: S3 buckets
aws s3 ls
# AWS: EBS volumes (including loose ones, without an instance)
aws ec2 describe-volumes --query "Volumes[].[VolumeId,State,Size]" --output text
# AWS: Elastic IPs (public IPv4 charges, associated or not)
aws ec2 describe-addresses --query "Addresses[].[PublicIp,AllocationId,InstanceId]" --output text
# AWS: DynamoDB tables and secrets created in Stages 06 and 10
aws dynamodb list-tables --query TableNames --output text
aws secretsmanager list-secrets --query "SecretList[].Name" --output text

# Azure (addition): all resources and groups in the subscription
az resource list --output table
az group list --query "[].name" --output tsv
# Azure (addition): deleted vaults that still reserve the name (soft delete)
az keyvault list-deleted --output table
# If something you created still appears, delete it or use: az group delete --name rg-lab --yes --no-wait
```

**Cockpit perspective:** it is the final round before the material leaves the circuit: checking in both garages that nothing was left on. In the cloud, what is left on keeps charging after you leave.

*Last lap of the GP complete! Exam numbers that age, the first certification for someone in back-end, and the why of the practice exam.*

**Exercises**

1. The lesson cites a time of 90 minutes for Foundational and Associate and 170 for Professional and Specialty. Can these numbers be used today as fact?
2. You are a back-end developer and want a first certification on both providers. Which approximate profiles do you choose?
3. Why is taking a practice exam and then studying the mistake better than just rereading the material?

**Answer key**

1. Not as current fact: they are the material's numbers (2025). Confirm on the official site, because duration and curriculum may have changed.
2. Foundational (Cloud Practitioner) and AZ-900 as entry; then Developer Associate (AWS) and AZ-204 (Azure), checking the current curricula.
3. The practice exam reveals the weak points and reviewing the mistake covers exactly the gap, which is more efficient than a generic review.

**Remember this:** certification validates, lab teaches, and both need updating, because certification names, prices, and curricula change: always check the official source.

**Stage 11 checklist**

- [ ] I can describe the AWS certification levels (as in the material) and the Microsoft ones (Fundamentals, Associate, Expert, Specialty).
- [ ] I know that names, prices, and curricula change and where to check.
- [ ] I built a study plan with weekly lab work.
- [ ] I know how to use free resources from both providers without generating cost.
- [ ] I know how to review and delete what I left on.

*Sector 11 in green! Plan built, lab scheduled, and nothing forgotten running in both accounts. In Hungary, in 1998, Ross Brawn changed Michael Schumacher's strategy mid-race and won, and that is the lesson of Stage 11: the study plan is corrected by the results of the practice exams, it does not stay frozen. Now it is the final straight, heading directly for the checkered flag.*

---

## Final self-assessment checklist

*Last straight, checkered flag in sight! This is the parc fermé inspection, the stewards' check after the race: mark honestly, box by box, because a steward does not accept a memorized answer.*

**Fundamentals and identity**

- [ ] I explain the cloud with the Black Friday example and I can divide responsibility between provider and customer.
- [ ] I can map an AWS account to an Azure tenant and subscription.
- [ ] I read an IAM policy and an RBAC role and say what each one allows.
- [ ] I know why Deny wins on AWS and how Azure RBAC is additive.
- [ ] I know which service audits (CloudTrail and Activity Log) and which detects threats (GuardDuty and Defender for Cloud).

**Network and compute**

- [ ] I divide a CIDR into subnets and explain public x private by the route.
- [ ] I tell Security Group, NACL, and NSG apart.
- [ ] I choose a VM family or series and explain CPU credits.
- [ ] I know the difference between stopping and deallocating on Azure.
- [ ] I ran a Kubernetes Deployment locally and I know that the YAML holds for EKS and AKS.

**Data, serverless, and observability**

- [ ] I choose between relational and NoSQL and I know the pairs of each service on both providers.
- [ ] I write the same HTTP function for Lambda and for Azure Functions.
- [ ] I write the same query in Logs Insights and in KQL.
- [ ] I know what diagnostic settings and action groups are.

**Delivery, security, and career**

- [ ] I design delivery with a CDN, load balancer, and object storage on both providers.
- [ ] I know where the global namespace of S3 and Blob Storage sits.
- [ ] I keep secrets in a vault and avoid credentials in code.
- [ ] I map the Route 53 routing policies to Traffic Manager.
- [ ] I build a study plan for certifications and always check the official site.

**Cost discipline**

- [ ] I set up a budget with an alert on both providers.
- [ ] Every practice ended with cleanup and I checked it with a listing command.

*CHECKERED FLAG! If the boxes are ticked, step onto the podium: you started the race not knowing which circuit you were on and crossed the line operating both with the same procedure, from the pass to the entry list, handing back the garage at the end of each practice. In Brazil, in 2008, Lewis Hamilton became champion by one point, and that is the lesson of the checklist: a single skipped item (a forgotten cleanup, a poorly understood concept) already changes the result. Left a box blank? No drama: pit, adjust, and get back on track. Next up, the behind-the-scenes records from the driver and from the instructor.*

---

## Driver's notes: where the analogies break down

The F1 layer does not change commands, code, technical tables, expected outputs, or exercises; the technical corrections are those in the Instructor's notes, right below. The points where the comparison does not hold 100%:

1. **Provider and circuit.** The calendar chooses the circuit; in the cloud you choose the provider and can use both. And no racetrack has facilities in several cities: region and zone are a didactic extension of the circuit image.
2. **Account, tenant, and subscription.** "Contract with the circuit" is a didactic label. AWS brings together people, resources, and billing in the account; Azure separates the registry of people (tenant) from the contracts for use and billing (subscriptions). Neither model has an exact counterpart in the paddock.
3. **Pass and permission.** In the paddock there is a single credentialing. In the cloud there are several mechanisms that combine (policy, role, scope, SCP, Azure Policy, Conditional Access), and AWS's explicit `Deny` does not exist inside an Azure RBAC role, which is additive.
4. **Network marshals.** AWS separates the door marshal (Security Group) from the sector turnstile marshal (NACL); Azure's NSG does both, with memory and with deny rules. The marshal image does not say which one is stateful: that is in the technical text.
5. **Garage and virtual machine.** An F1 garage takes days to set up and there is one per team; a VM comes up in minutes, in any quantity, and can be stopped or deallocated.
6. **ERS and CPU credits.** The ERS collects energy under braking, a physical event of each lap; the credits depend only on time below the baseline. And the "unlimited mode", in which you pay for the excess, does not exist in F1.
7. **Fixed IP without an analogy.** The fixed IP has no F1 image in this guide: the Elastic IP and the static Public IP belong to your account, are associated with whichever machine you choose, and public IPv4 has a cost.
8. **Two cars and replicas.** In F1 there are two cars per race and a stopped car is a lost race. The Deployment asks for as many replicas as you want and replaces the one that falls in seconds.
9. **Pit stop and atomicity.** The transaction that fails goes back to the previous state; the pit stop that goes wrong does not return the old tires, it only holds the car until the change is finished.
10. **On-demand station.** Nothing in F1 is billed per request or scales from zero to thousands of copies. The serverless image is didactic.
11. **Diagnostic settings.** A sensor with the channel turned off would be an assembly error in F1; on Azure, it is the default behavior of many resources until you configure log delivery.
12. **Pit lane entry.** In the real pit lane each car stops at its own team's pit box; the load balancer image holds for the role (distributing and taking out of rotation whoever failed), not for the track rule.
13. **Secret and combination.** A stolen combination is one; a leaked secret may have been copied without limit. And the Super Licence is one per driver and from a single authority; a domain can have more than one valid certificate, from different authorities.
14. **Cost cap and budget.** The cost cap is a rule with punishment; the budget alert only warns.
15. **Feeder categories and certifications.** Moving up a category depends on results on the track and, often, on sponsorship; certification depends on study and an exam, and is not required by law.
16. **No provider is a team.** I did not associate AWS or Azure with any real team. Red Bull appears only as an example of a group with two teams, to illustrate the concept of multi-account governance that exists on both providers.

## F1 data sources (consulted on 2026-10-06)

The championship data were verified on 2026-10-06 for the DevOps Culture guide of this same module and reused here without a new lookup (the pitstop backend, `localhost:3333`, was down at the time of writing).

Drivers' standings after round 16 of 23 (Bahrain GP held in Sepang, Malaysia, on October 4, 2026): 1. Kimi Antonelli (Mercedes), 320 points; 2. George Russell (Mercedes), 236; 3. Lewis Hamilton (Ferrari), 214; 4. Charles Leclerc (Ferrari), 191; 5. Lando Norris (McLaren), 188; 6. Max Verstappen (Red Bull), 188; 7. Oscar Piastri (McLaren), 128; 8. Isack Hadjar (Red Bull), 96; 9. Liam Lawson (Racing Bulls), 65; 10. Pierre Gasly (Alpine), 41. Podium in Sepang: Verstappen, Antonelli, and Hamilton. Next round: Singapore GP, October 9 to 11, 2026, the first sprint weekend at Marina Bay.

- Drivers' standings after round 16 of 23: [RacingNews365](https://racingnews365.com/2026-f1-championship-standings-after-bahrain-grand-prix-in-malaysia) and [Motorsport Week](https://www.motorsportweek.com/2026/10/04/f1-2026-world-championship-standings-after-the-bahrain-gp-in-malaysia/).
- Result and report of the Bahrain GP in Sepang (October 4, 2026): [Formula1.com](https://www.formula1.com/en/latest/article/verstappen-wins-rain-hit-bahrain-gp-in-malaysia-over-antonelli-as-russell-retires-late-on.6qfpIHPch8mIVj2YgfHdCp) and [RaceFans](https://www.racefans.net/2026/10/04/2026-bahrain-grand-prix-in-malaysia-race-result-and-championship-points/).
- 2026 Singapore GP (October 9 to 11, first sprint weekend at Marina Bay): [RacingNews365](https://racingnews365.com/f1/races/singapore-gp) and [F1 Wiki](https://f1.fandom.com/wiki/2026_Singapore_Grand_Prix).
- General F1 facts used without a specific source, because they are public and stable knowledge: the cost cap in force since 2021, the Interlagos racetrack in São Paulo, Red Bull as the owner of Red Bull Racing and Racing Bulls, and the general workings of ERS, passes, pit lane, and entry list.

---

## Appendix: complete mapping table

All the analogies used in the document, in the order in which they appear. The central ones are in the table at the start. AWS and Azure always enter in the same way, as circuits; no provider is associated with a real team, and each row holds for the pair of services in the equivalence table.

| Cloud (AWS and Azure) | Formula 1 |
|---|---|
| Cloud provider (AWS or Azure) | The circuit: its own facilities, and the team's procedure is the same on both |
| On-premises | Building your own racetrack in order to race |
| On demand and pay-as-you-go | Occupying the circuit's garage and paying for the use of the facilities |
| Region | The host city where the circuit keeps facilities (the São Paulo region: `sa-east-1` and `brazilsouth`) |
| Availability zone | A physically separate garage building inside the host city, with its own power and network |
| Distributing across zones | Not leaving both cars depending on the same generator |
| Shared responsibility | The circuit looks after the track, barriers, and power; the team looks after the car, the garage, and who enters it |
| On demand, reserved, and spot | Paying for the garage only on the race weekend, a 1 or 3 year contract at a discount, and leftover capacity that can be taken back |
| Budget with an alert (AWS Budgets, Cost Management) | The cost cap, with an alarm before you blow it |
| AWS account and Azure subscription | The team's contract with the circuit: facilities, access, and billing isolated |
| AWS Organizations and Management Groups | The group that owns several teams, with rules that hold for all of them |
| Resource Group (Azure) | A garage set up inside the contract: everything in it leaves together when it is handed back |
| `aws sts get-caller-identity` and `az account show` | Checking which garage you are in and with which pass, before touching anything |
| Entra ID tenant | The registry of the team's people, separate from the contracts for use |
| Identity (user, group) | The personal pass |
| Authentication | The turnstile checking that the pass is yours |
| Authorization and permissions | The areas the pass opens |
| Least privilege | Nobody with a pit lane pass "just in case" |
| Auditing (CloudTrail, Activity Log) | The turnstile record: who entered, where, and when |
| Threat detection (GuardDuty, Defender for Cloud) | The security staff who watch the cameras and notice out-of-pattern behavior |
| Machine identity (IAM Role, Managed Identity) | The pass attached to the equipment, issued and renewed by the circuit, with no paper to lose |
| Access key in code | A human pass forgotten on the truck's dashboard |
| Root account | The contract owner's master pass, kept in the vault |
| IAM policy with conditions | The pass with everything printed on the card: door, origin, face check, and hours |
| Azure RBAC role and scope | The pass that prints only what it opens; where it is valid comes from the assignment |
| SCP | The parent company's rule that no team principal can release |
| Azure Policy | The rule that blocks the assembly of a type of equipment in the garage |
| Explicit `Deny` (AWS) | The prohibition that beats any authorization |
| Additive RBAC (Azure) | Passes that only accumulate areas; to prohibit, another counter |
| Control plane x data plane | Owning the garage does not give access to the car's data |
| Virtual network (VPC, VNet) | The team's fenced area in the paddock |
| CIDR block | The plot that the contract reserves |
| Subnet | A sector of the area, with its own function |
| Public subnet (by the route) | The sector with a gate to the street; what decides it is the route, not the sign |
| NAT Gateway | The messenger who goes out to fetch something and comes back: outbound only |
| Stateful firewall | The marshal who remembers who he let in and releases the reply |
| Stateless firewall | The marshal who checks everything in both directions, with no memory |
| Security Group | The marshal at the door of each garage |
| NACL | The marshal at the sector turnstile |
| NSG | A single marshal, with memory, who authorizes and prohibits, at the door, at the turnstile, or both |
| NSG rule priority | The order in which the marshal reads the instructions, stopping at the first one that applies |
| Peering | The direct passage between two areas, which does not lead to a third |
| Hub (Transit Gateway, Virtual WAN) | The central lane of the paddock, through which everyone passes |
| VPN | The encrypted radio over the public network |
| Dedicated link (Direct Connect, ExpressRoute) | The exclusive connection between the circuit and the factory operations room |
| Virtual machine (EC2, Azure VM) | A complete garage, with its own generator and systems (the entire operating system) |
| Size families and series | The catalog of garage sizes of each circuit |
| Burstable instance and CPU credits | The ERS battery: charges below the baseline, discharges at the peaks |
| Exhausted credits | The car that loses speed before the end of the straight |
| CPU baseline | The point below which the battery charges and above which it discharges |
| Image (AMI, Marketplace, Compute Gallery) | The assembly specification from which identical garages come out |
| Autoscaling | Opening more garages when the load rises, within the limit you configured |
| Persistent disk (EBS, Managed Disks) | The garage's data cabinet, which stays (and charges) with the garage closed |
| Fixed public IP (Elastic IP, static Public IP) | No trackside analogy (see driver's note 7) |
| Stopping (AWS) and deallocating (Azure) | Handing the garage back to the circuit |
| "Stopped" VM without deallocating (Azure) | Turning off the lights with the garage still reserved and charging |
| Shipping container | The standardized containers and crates in which F1 material travels |
| Container image | The replicable specification of the car |
| Registry (ECR, ACR) | The central archive of versioned specifications |
| Container | A car assembled from the specification |
| Pod | The car that goes to the track: the smallest unit the orchestrator puts to run |
| Worker node (node group, node pool) | A garage (a virtual machine) |
| Control plane | The wall: decides in which garage each car stays and orders replacement of what stopped |
| Shared kernel | The garage's common power, used by all its cars |
| Deployment | The operation sheet: how many cars of which specification on the track |
| Label (`labels`) | The livery that identifies the car |
| Service and `selector` | The fixed-address radio channel, which calls whoever has that livery |
| Ingress | The pit lane entry rule for HTTP traffic |
| ECS and Container Apps | The simplified procedure of each circuit: you deliver the specification and the circuit takes care of the wall and the garages |
| Self-healing | The wall ordering another car assembled when one stops |
| Relational database | The car's official technical book, with rules that link part, chassis, and driver |
| Key-value NoSQL | The tire control by barcode |
| Partition key | The tag by which you will search |
| Atomicity (ACID) | The car is only released from the pit stop with all four wheels changed |
| High availability across zones | A live copy of the database in another garage building |
| Read replica | The read-only copy that serves queries |
| Managed database service | The circuit looking after the maintenance of the archive; the team looks after what it writes in it |
| Strong and eventual consistency | The time on the wall monitor and the scoreboard of a site that catches up with the official one with a delay |
| Serverless (Lambda, Azure Functions) | The station that the circuit only opens when a request arrives, billed per request |
| Function and handler | The written procedure that the team hands to the station |
| Trigger | The request that opens the station |
| Cold start | The out-lap, with cold tires and brakes |
| API gateway (API Gateway, APIM) | The paddock gatehouse: checks the pass, limits flow, and forwards |
| Queue (SQS, Queue Storage, Service Bus) | The pile of used tires waiting for analysis |
| Orchestration (Step Functions, Logic Apps, Durable Functions) | The script of a pit stop, with steps, parallelism, and a plan for the wheel nut that does not come off |
| Lock-in | The procedure written for the garage of a single circuit |
| Thin adapter | The form cover swapped at each circuit, with the same procedure inside |
| Calling the handler with a fake event | The simulator |
| Metrics | The telemetry |
| Events | The race control messages |
| Logs | The radio and the car's event record |
| Alarm and alert | The engineer who only calls the driver when there is something to do |
| Dashboard | The wall screens |
| Distributed tracing (X-Ray, Application Insights) | The mini-sectors of a lap |
| Monitoring platform (CloudWatch, Azure Monitor) | The telemetry system of each circuit |
| Pipeline query (Logs Insights, KQL) | The data engineer filtering, aggregating, and sorting the session recording |
| Alarm evaluation period | Not calling the driver because of a peak in a single lap |
| Action Group | The list of whom the wall calls |
| Diagnostic settings | Turning on the sensor's channel in the broadcast; without that, the data does not reach the wall |
| Object storage (S3, Blob Storage) | The central warehouse |
| CDN (CloudFront, Front Door) | The forward parts depots, close to whoever asks |
| Load balancer (ALB and NLB, Application Gateway and Load Balancer) | The pit lane entry control, directing each car to a free pit box |
| Load balancer health check | Closing the pit box that has a problem |
| Layer 4 and layer 7 | Directing by the car number, or reading the request and sending it to the prepared pit box |
| Storage classes and tiers | The season's shelf and the historical archive |
| Signed URL and SAS | The one-day guest pass |
| Object versioning | Keeping the previous revision of the part |
| Globally unique name (bucket, storage account) | The name of the warehouse, which becomes a public address |
| `304 Not Modified` | The warehouse saying "your revision is still the current one" |
| Cache TTL | For how long the depot trusts its own copy without calling |
| Secrets vault (Secrets Manager, Key Vault) | The combination vault, which hands over the combination on the spot to whoever has a pass |
| Secret rotation | Changing the combination from time to time |
| WAF | The marshal who searches the content, not only the pass |
| TLS certificate | The Super Licence: issued by a recognized authority, proves identity, and expires |
| Automatic certificate renewal | Taking the risk of the expired document out of human hands |
| DNS | The entry list: the name linked to the number |
| DNS TTL | For how long the printed copy of the list is valid before a new check |
| Routing policies | Sending each person to the closest address, the one in their country, the backup, or by weight |
| Certification levels | The feeder categories: F4, F3, F2, and F1 |
| Educational program with a lab (AWS Academy, Microsoft Learn) | The factory simulator: drive for real without crashing a car or generating a bill |
| Practice exam and mistake review | Running the lap, finding where you lost time, and studying that stretch |
| Recertification | The regulation that changes every season |
| Cost cleanup | The final round before the material leaves the circuit |

---

## Instructor's notes

**Technical corrections to the raw material** (the original report was preserved when there was no evident error):

1. **`t3.micro` credits (Stage 04).** The material says 6 credits per hour. That value is from the previous generation (T2). The `t3.micro` accumulates 12 credits per hour, with a baseline of 10% per vCPU across 2 vCPUs. I used 12 in the exercise. In addition, T3 instances use unlimited mode by default; check the documentation when sizing cost.
2. **EBS volumes "replicated across zones" (Stage 04).** An EBS volume is replicated within **one** availability zone; to protect against zone failure, use snapshots, which are regional. Also, "volumes continue to exist when the instance is terminated" holds for additional volumes; the root volume is deleted by default on termination.
3. **Elastic IP free when associated (Stage 04).** The statement reflected the old model. Since 2024, AWS charges for public IPv4 addresses in general (the lesson's own reference deals with identifying and optimizing public IPv4 use). Check the current billing.
4. **Reservation discount (Stages 01 and 04).** The material cites "up to 72%" at one point and "up to 70%" at another. Both are "up to": the real percentage depends on type, term, and payment method. Do not use either as a fixed number; consult the official calculator.
5. **12-month Free Tier (Stage 01).** The rules of free tier and credits for new accounts change and have already been reformulated; confirm the current offer on the official site. The same holds for the Azure free account.
6. **VPC CIDR "cannot be changed" (Stage 03).** The **primary** block cannot be changed, but it is possible to associate **secondary** CIDR blocks with the VPC. The advice to plan well beforehand remains.
7. **"Encrypted" VPC Peering (Stage 03).** Peering traffic does not go over the public internet, but this does not replace end-to-end application encryption (TLS). Read the statement as "private traffic".
8. **Logs Insights "similar to SQL" (Stage 08).** The syntax is pipeline-based (`fields | filter | stats | sort | limit`), closer to `grep | sort | head` than to `SELECT`. KQL follows the same family of ideas.
9. **Capital One case (Stage 02).** The material's summary ("credential badly configured on a WAF") is simplified. In technical terms, an incorrect configuration of the application firewall allowed obtaining temporary credentials of a role with excessive permissions, and the central problem was the excess of permissions. The lesson (customer responsibility, least privilege) remains.
10. **`pod.yaml` and `service.yaml` (Stage 05).** In the material, the Pod has no `labels` and the Service selects `app: minha-aplicacao`, so that Service would not find that Pod. The material's Deployment is correct (the label is in the `template`). I used the Deployment in the examples.
11. **AWS App Mesh (Stage 05, trends).** The material presents it as a trend. AWS announced the end of support for the service; check the current state before adopting it.
12. **Stage 11 links.** The link attributed to "LinuxAcademy" in the material points to a site whose domain seems to belong to another organization, and ACloudGuru and LinuxAcademy were unified under the same company. Check the links before using them. The courses and practice exams cited are suggestions from the lesson's instructor, not requirements.
13. **Certifications, prices, and durations (Stage 11).** They were kept "as in the material" (June 2025). Some listed certifications may have been discontinued or renamed afterward. This guide does not state the current status; the source is the official site.

**About the Azure content.** All the Azure content is a **didactic addition by the instructor**, produced from general knowledge of the services and from commands I know, and it is not in the raw report. Where I was not sure of an equivalent (for example, private certificates, AI anomaly detection, code at the edge, automatic secret rotation, and the best CDN product in 2026), I described it in prose and asked for verification instead of inventing a name or command. Azure product names change frequently (for example, Microsoft Entra ID was once called Azure Active Directory); validate against the official documentation before using in production. The equivalence tables are **learning maps**, not promises of parity: always compare by requirement, not by name.

**About the commands.** The read commands (`list`, `describe`, `show`) do not create resources. The creation commands are marked as optional and accompanied by cleanup, but the responsibility for your account's cost is yours. Validate the syntax with `aws <service> help` and `az <group> --help` on the version you installed, because the CLIs evolve.

**About the market cases** (Netflix, Capital One, Autodesk, Airbnb, GoPro, Disney, Bustle, FINRA, Condé Nast): they were preserved as the material presents them, without additions or independent verification.

---

*And that closes the broadcast, straight from the pit wall of the Cloud Grand Prix: eleven sectors, two circuits, and a single team, with the same procedure on both. From the booth, that is all. The next stop on the calendar is Singapore, from October 9 to 11, 2026; until then, remember: a forgotten resource left running is the only opponent that races the whole night. END OF BROADCAST.*
