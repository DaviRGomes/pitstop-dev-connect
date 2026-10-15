// Content from the six lessons of the "Cloud Architecture" course (Phase 1), one stage per lesson,
// themed around Formula 1 by the /otimizar-relatorio pipeline (relatorios/arquitetura-cloud/final.en.md).

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
};

export type Mapping = { tema: string; f1: string };

export const DE_PARA: Mapping[] = [
  {
    tema: "Cloud provider (AWS or Azure)",
    f1: "The circuit: the infrastructure the team uses to operate (garage, power, network, timing); the same team operates on both",
  },
  {
    tema: "Public, private, and hybrid cloud",
    f1: "The circuit shared by the 11 teams; the team's factory; and the two connected by a link",
  },
  {
    tema: "IaaS, PaaS, SaaS, and FaaS",
    f1: "Empty garage with a standard car; garage equipped and maintained by the circuit; ready-made service, like the official timing; pit stop triggered by the call from the pit wall",
  },
  {
    tema: "Shared responsibility",
    f1: "The circuit takes care of the track, the barriers, and the structure; the team takes care of the car, the garage, and who enters it",
  },
  {
    tema: "VM (instance)",
    f1: "A car: the unit of capacity that goes onto the track (in IaaS, the standard car the circuit hands over)",
  },
  {
    tema: "Region and availability zone",
    f1: "The circuit's geographic site; and the independent pavilions inside it, each with its own power, cooling, and network",
  },
  {
    tema: "Parallel redundancy",
    f1: "The team's two cars: if one retires, the other still scores",
  },
  {
    tema: "SLI, SLO, and SLA",
    f1: "The number on the telemetry; the internal target with slack; the formal limit that costs a penalty",
  },
  {
    tema: "Circuit Breaker",
    f1: "Shutting down the system that fails in sequence and, a few laps later, trying a single reset",
  },
  {
    tema: "VPC and subnets",
    f1: "The team's reserved area at the circuit, divided into sectors with different access",
  },
  {
    tema: "IAM",
    f1: "The credentialing: who you are and where your credential lets you in",
  },
  {
    tema: "FinOps and tags",
    f1: "The cost cap and the label on each part with its cost center",
  },
];

export const ANALOGY_NOTES: string[] = [
  "A real circuit sits in one place. A provider has sites in dozens of places around the world (the regions); here, read circuit as the owner of the infrastructure, with several sites.",
  "Two cars, always: the regulations fix two cars per team. In the cloud, the number of machines goes up and down by itself; horizontal scaling and elasticity have no equivalent on the track.",
  "Independent pavilions do not exist at the racetrack: the garages share a single pit building, and a problem in it affects all of them. Availability zones are physically separated precisely to avoid this.",
  "The circuit is not chosen: the calendar decides where the team races. In the cloud, the choice of provider is yours, leaving can be expensive (lock-in), and you can use both at the same time.",
  "A part is matter; data is a copy. A part exists in one unit; an object, a replicated disk, or a cached copy exists in as many copies as you want.",
];

export const LESSONS: Lesson[] = [
  {
    id: "ac1",
    num: "01",
    navTitle: "Cloud computing",
    tag: "CapEx vs OpEx",
    title: "Introduction to Cloud Computing",
    lead: "The cloud is computing sold as a service: you swap idle capital (CapEx) for metered consumption (OpEx), and you only really win when the load varies or when you need speed, reach, and resilience you could not buy by yourself.",
    concept: [
      "Cloud computing is the on-demand delivery of computing resources (hardware, storage, databases, network, and software) over a network, without you managing the physical infrastructure. Like the power grid: you do not build a power plant to plug in the fridge, you plug in the appliance and pay for what you consume. Traditional IT suffers from high CapEx, long purchasing cycles, lack of elasticity, and vulnerability to local disasters.",
      "CapEx is a one-off investment in a fixed asset, depreciated over the years; OpEx is a recurring expense per use or subscription. Swapping one for the other is not cheaper by definition: it turns a fixed cost into a variable one. Scalability is the ability to grow, vertically (a bigger machine) or horizontally (more machines); elasticity is growing and shrinking by itself, in real time, paying only for what is used.",
      "Public cloud is multi-tenant, private cloud is dedicated to one organization, and hybrid cloud integrates the two through VPN, dedicated connections, and APIs. Side by side: Site-to-Site VPN (AWS) and VPN Gateway (Azure) build the IPsec tunnel; Direct Connect and ExpressRoute are the dedicated private connection; AWS Outposts is AWS hardware in your data center, and the closest pair is Azure Stack, because Azure Arc is not hardware, it is a management plane. The AWS CAF is organized by perspectives; Microsoft's, as a cycle of phases.",
      "Trackside reading: each provider is a circuit. The team does not build the racetrack to race: it takes the garage, uses the power, network, and timing there, and operates. CapEx is building your own wind tunnel; OpEx is paying per hour of tunnel at a third-party facility. Hybrid cloud is what teams do at every GP: the garage at the circuit linked to the remote operations room at the factory, because the car's design stays at home.",
    ],
    pointsTitle: "What the cloud changes",
    points: [
      {
        t: "Fixed cost becomes variable",
        d: "OpEx only beats CapEx when the load varies; with a flat load, the math can flip.",
        color: "blue",
      },
      {
        t: "Elasticity is not scalability",
        d: "Scaling is being able to grow; elasticity is growing and shrinking by itself, both ways.",
        color: "signal",
      },
      {
        t: "Outposts is not Arc",
        d: "Outposts is the provider's hardware at your site; Arc is the provider's management over your site.",
        color: "ember",
      },
    ],
    examplesTitle: "What the peak costs (fictitious numbers)",
    examples: [
      {
        label: "capex_opex.sh",
        lang: "sh",
        code: `awk 'BEGIN {
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

  printf "on-premises: %.2f UM/mes\\n", onprem
  printf "nuvem:       %.2f UM/mes\\n", nuvem
}'`,
        note: "Output: on-premises 1300.00 and nuvem 973.33 UM/mes. With a peak of 4 VMs, it flips: 700.00 versus 790.83.",
      },
      {
        label: "AWS regions",
        lang: "sh",
        code: `$ aws ec2 describe-regions --query "Regions[].RegionName" --output text
# --query: JMESPath filter, takes only the RegionName field of each region
# --output text: prints on one line, separated by tabs
ap-south-1  eu-west-1  ... sa-east-1  us-east-1  us-west-2 ...`,
        note: "Illustrative output: the list varies with the regions enabled on the account.",
      },
      {
        label: "Azure regions",
        lang: "sh",
        code: `$ az account list-locations --query "[?metadata.regionType=='Physical'].{regiao:name, nome:displayName}" --output table
Regiao       Nome
-----------  ------------
brazilsouth  Brazil South
eastus       East US
...`,
        note: "sa-east-1 (AWS) and brazilsouth (Azure) are both in São Paulo: different names, same idea.",
      },
    ],
    commands: [
      {
        cmd: 'sh "$LAB"/etapa-01/capex_opex.sh',
        note: "compares CapEx and OpEx with fictitious numbers",
      },
      { cmd: "aws --version", note: "checks the AWS CLI (no account needed)" },
      { cmd: "az --version", note: "checks the Azure CLI and its extensions" },
      {
        cmd: 'aws ec2 describe-regions --query "Regions[].RegionName" --output text',
        note: "regions enabled on the AWS account",
      },
    ],
    handsOnIntro:
      "Play with Mercadinho's numbers and watch the cloud's advantage shrink; then ask each circuit where its sites are. Read-only, nothing is created.",
    handsOn: [
      'Set LAB="$HOME/lab-cloud", create the folders etapa-01 to etapa-06, and save capex_opex.sh.',
      "Run the script and check 1300.00 versus 973.33 UM/mes.",
      "Change qtd_pico and the VMs in the peak month from 10 to 4 and watch the advantage flip (700.00 versus 790.83).",
      "With the CLIs authenticated (aws configure and az login), list the AWS and Azure regions.",
      "Find São Paulo in both lists: sa-east-1 on AWS, brazilsouth on Azure.",
    ],
    tip: "Market figures such as 50% of cloud resources dedicated to AI by 2029 (material, ref. jun/2025) are context, not current data.",
    takeaway:
      "The cloud swaps CapEx for OpEx and only really pays off when the load varies or when you need reach and resilience you could not buy by yourself.",
  },
  {
    id: "ac2",
    num: "02",
    navTitle: "Service models",
    tag: "IaaS, PaaS, SaaS, FaaS",
    title: "Service Models: IaaS, PaaS, SaaS, and FaaS",
    lead: "The higher the model, the less you operate and the less you control, but your data and your access are always yours.",
    concept: [
      "Service models answer one question: how much of the stack do I want to operate and how much do I want to outsource? IaaS delivers servers, storage, and network, and you handle everything from the OS up. PaaS handles servers, OS, runtime, and middleware, and you bring code and data. SaaS is the ready-made, multi-tenant application, by subscription. FaaS runs small functions triggered by events, scales from zero to the peak, and charges for execution time.",
      "In the responsibility matrix, the Data row belongs to the customer in every model, SaaS included: it is security in the cloud (customer) versus security of the cloud (provider). There is no best model; there is the one that fits the requirements, the team, the sensitivity of the data, and the budget. More abstraction brings convenience and the risk of vendor lock-in.",
      "Side by side: EC2 and Azure Virtual Machines (instance type versus VM size); EBS and Managed Disks; Lambda and Azure Functions. Elastic Beanstalk and App Service make the same promise with different philosophies: Beanstalk leaves the instances, load balancer, and autoscaling visible in your account; App Service hosts by plan without exposing the infrastructure. On AWS, HTTP to the function usually goes through API Gateway; on Azure, the HTTP trigger comes with the Function itself.",
      "Trackside reading: IaaS is the empty garage with power, network, and a standard car; PaaS is the garage equipped and maintained by the circuit; SaaS is the official timing; FaaS is the pit stop, triggered by the call from the pit wall, short and without memory. When a safety car comes out, almost every car asks to pit on the same lap, and then the pit lane sits empty for a long time: that is the FaaS load profile, with short spikes and long stretches of nothing.",
    ],
    pointsTitle: "Rules of the staircase",
    points: [
      {
        t: "Data is always yours",
        d: "In IaaS, PaaS, SaaS, or FaaS, the customer decides what is stored and who has access.",
        color: "blue",
      },
      {
        t: "FaaS is stateless",
        d: "State that matters goes to a database, cache, or object store; a global variable is not reliable.",
        color: "ember",
      },
      {
        t: "Cold start and timeout",
        d: "The price of FaaS: initial latency, maximum execution time, and more complex tests.",
        color: "signal",
      },
    ],
    examplesTitle: "Why stateless matters",
    examples: [
      {
        label: "funcao.py",
        lang: "sh",
        code: `contador = 0  # state kept in the process memory: NOT reliable in FaaS


def handler(evento):
    global contador  # allows changing the variable from outside the function
    contador += 1  # adds 1 for each invocation that lands on THIS instance
    return {"recebido": evento, "contador": contador}

$ cd "$LAB"/etapa-02    # enters the folder so python3 finds funcao.py
$ python3 -c "import funcao; print(funcao.handler('a')); print(funcao.handler('b'))"
{'recebido': 'a', 'contador': 1}
{'recebido': 'b', 'contador': 2}`,
        note: "It worked because both calls landed in the same process. On Lambda or Azure Functions, another instance starts again from 1.",
      },
      {
        label: "AWS: t3.micro",
        lang: "sh",
        code: `$ aws ec2 describe-instance-types --instance-types t3.micro --query "InstanceTypes[].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB]" --output text
t3.micro	2	1024`,
        note: "It only describes the type in the catalog; it does not create an instance.",
      },
      {
        label: "Azure: Standard_B1s",
        lang: "sh",
        code: `$ az vm list-skus --location eastus --size Standard_B1s --resource-type virtualMachines --query "[?name=='Standard_B1s'] | [0].capabilities[?name=='vCPUs' || name=='MemoryGB']" --output table
Name      Value
--------  -------
vCPUs     1
MemoryGB  1`,
        note: "az vm list-sizes is deprecated and prints a deprecation warning; use az vm list-skus.",
      },
    ],
    commands: [
      {
        cmd: "aws elasticbeanstalk describe-applications",
        note: "PaaS on AWS: Beanstalk applications",
      },
      { cmd: "aws lambda list-functions", note: "FaaS on AWS: lists functions" },
      { cmd: "az webapp list --output table", note: "PaaS on Azure: App Service applications" },
      { cmd: "az functionapp list --output table", note: "FaaS on Azure: lists Function Apps" },
    ],
    handsOnIntro:
      "Pen and paper for your own stack, then the standard car's spec sheet from each circuit and a garage check that, on a new account, comes back empty.",
    handsOn: [
      "Take a system you know and fill in the responsibility matrix for IaaS, PaaS, and FaaS, marking the Data row.",
      "Create funcao.py, run the two invocations, and explain why the counter is not reliable in FaaS.",
      "Describe t3.micro on AWS and Standard_B1s on Azure: CPUs and memory of the standard car.",
      "List Beanstalk and App Service applications and Lambda and Azure Functions functions.",
      'Confirm that, on a new account, the lists come back empty: {"Applications": []}, {"Functions": []}, and no rows on Azure.',
    ],
    tip: "FaaS billing has no 1 to 1 conversion: units, time limits, and ways to reduce cold start differ between Lambda and Functions.",
    takeaway:
      "Go up or down the staircase from IaaS to FaaS knowing what is yours at each step; the Data row never changes owner.",
  },
  {
    id: "ac3",
    num: "03",
    navTitle: "Infrastructure",
    tag: "regions, SLA, breaker",
    title: "Cloud Infrastructure",
    lead: "Zones protect from data center failures, regions protect from geographic failures, the edge brings you closer to the user, and each nine of availability has to justify what it costs.",
    concept: [
      "A region is a geographic area isolated from failures in other regions. An availability zone (AZ) is an isolated location inside the region, with independent power, cooling, and network: a failure domain. A point of presence (PoP) is the entry door to the provider's network near the user. A zonal resource lives in one zone (cheaper); a regional one is replicated across zones (more available). Latency is measured by RTT: 30 to 40 ms is usually acceptable.",
      "Side by side: Regions and AZs exist on both, but on Azure not every region has zones, and on both the zone label is mapped per account or subscription (AWS exposes the stable zone ID, such as sae1-az1). Auto Scaling Groups and Virtual Machine Scale Sets; ALB and Application Gateway at layer 7; NLB and Azure Load Balancer at layer 4, both distributing per flow with a hash; CloudFront and Front Door at the edge.",
      "SLI is the raw measure, SLO the internal target with an error budget, SLA the formal promise to the customer, always more conservative. In series, availability is the product (0.999 x 0.999 = 99.8001%); in parallel, it only fails when both fail (99.9999%), assuming independent failures. The Circuit Breaker opens after consecutive failures, fails fast, and, after the wait, lets one attempt through. It is not a provider service: it is a pattern in your code, valid on AWS and Azure.",
      "Trackside reading: series is the car itself, where any system that fails stops everything; parallel is the two cars. If one car retires, the team still scores with the other. But if the team starts both cars on the same wrong tyre choice, both drop back together: redundancy does not protect against the failure both share.",
    ],
    pointsTitle: "Math that holds up the sector",
    points: [
      {
        t: "Each nine cuts by ten",
        d: "99.9% allows 525.6 min/year; 99.999% allows about 5.26 min/year.",
        color: "blue",
      },
      {
        t: "Parallel needs independence",
        d: "Two zones with the same bad deploy fail together; the model is not a guarantee.",
        color: "ember",
      },
      {
        t: "Retry vs Circuit Breaker",
        d: "Retry helps with a transient failure; the breaker stops insisting on a persistent one.",
        color: "signal",
      },
    ],
    examplesTitle: "The math of the nines and the breaker",
    examples: [
      {
        label: "noves.sh",
        lang: "sh",
        code: `awk 'BEGIN {
  n = split("99.9 99.95 99.99 99.999", disp, " ")   # the availabilities to calculate
  minutos_ano = 365 * 24 * 60                       # minutes in a 365-day year
  for (i = 1; i <= n; i++) {
    # allowed downtime = (100 - availability)% of the year
    printf "%s%% -> %.2f min/ano\\n", disp[i], (100 - disp[i]) / 100 * minutos_ano
  }
}'`,
        note: "Output: 525.60, 262.80, 52.56, and 5.26 min/ano.",
      },
      {
        label: "disjuntor.py",
        lang: "sh",
        code: `import time


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
            return f"falhou ({self.falhas})"`,
        note: "With the service down: falhou (1), (2), (3), three times ABERTO: nem tentei and, after the wait, ok: 200.",
      },
      {
        label: "zones: AWS vs Azure",
        lang: "sh",
        code: `$ aws ec2 describe-availability-zones --region sa-east-1 --query "AvailabilityZones[].[ZoneName,ZoneId,State]" --output text
sa-east-1a	sae1-az1	available
sa-east-1b	sae1-az2	available
sa-east-1c	sae1-az3	available
$ az vm list-skus --location brazilsouth --zone --resource-type virtualMachines --output table | head -n 5
# columns ResourceType, Locations, Name, Zones, and Restrictions; Zones shows something like 1,2,3`,
        note: "Illustrative outputs: the letter to ID mapping may differ on your account. On Azure, an empty list means a region without zones.",
      },
    ],
    commands: [
      { cmd: 'sh "$LAB"/etapa-03/noves.sh', note: "allowed downtime per SLA" },
      { cmd: 'python3 "$LAB"/etapa-03/disjuntor.py', note: "the breaker opening and closing" },
      {
        cmd: 'aws ec2 describe-instances --query "Reservations[].Instances[].[InstanceId,InstanceType,State.Name]" --output table',
        note: "existing compute on AWS (new account: empty)",
      },
      { cmd: "az vm list --output table", note: "existing compute on Azure (new account: empty)" },
    ],
    handsOnIntro:
      "Change the breaker's limit and wait time and write down the output before running; then, the zones of a region, straight from each circuit.",
    handsOn: [
      "Run noves.sh and disjuntor.py and check the outputs.",
      "Replace d = Disjuntor() with d = Disjuntor(limite=2, espera=5) and predict the output before running.",
      "Confirm that the last line is still ABERTO: the 2.1 s wait is shorter than 5 s; change the sleep to 5.1 to see ok: 200.",
      "Calculate 99.9% over 30 days (43.2 min) and three components in series at 99.9% (about 99.70%).",
      "List the zones of sa-east-1 on AWS and of brazilsouth on Azure.",
    ],
    tip: "There is no single AWS or Azure SLA: read the SLA of the specific service, which changes with the topology (single instance or several zones).",
    takeaway:
      "A zone protects from the building, a region protects from the city, and availability is calculated: series multiplies, parallel only holds with independent failures.",
  },
  {
    id: "ac4",
    num: "04",
    navTitle: "Providers",
    tag: "method and lock-in",
    title: "Main Cloud Providers",
    lead: "Choose the provider with criteria and weights agreed with the business, and treat lock-in as a cost you decide to pay with eyes open.",
    concept: [
      "The market is dominated by AWS, Azure, Google Cloud, and OCI. AWS leads with more than 200 services (material, ref. jun/2025) and an ecosystem that creates gravity; Azure stands out for integration with the Microsoft ecosystem, its hybrid vocation (Arc), and AI; GCP positions itself in data, AI, and global network. Shares cited: AWS about 33%, Azure 23%, GCP about 10% (material, ref. jun/2025), with different reference dates, which do not add up.",
      "The material's methodology has six criteria: IaaS, PaaS, and SaaS offerings; regions and AZs; pricing and TCO; SLAs and support; compliance and certifications; management tools. A weighted matrix takes the emotion out of the decision, but whoever defines the weights defines the result, so the weights are agreed with the business before scoring.",
      "The portfolio map puts the pairs side by side: EKS and AKS; S3 and Blob Storage; Aurora and RDS versus Azure SQL Database; DynamoDB and Cosmos DB; Redshift versus Synapse and Fabric; CloudFormation versus ARM and Bicep; CloudWatch and Azure Monitor. Bedrock versus Azure AI Foundry is an approximate pairing. Vendor lock-in is mitigated with a proof of concept, data portability, your own backups, and multicloud or hybrid; using only the lowest common denominator wastes the best of each platform.",
      "Trackside reading: AWS and Azure are circuits, not teams, and comparing is assessing facilities, never cheering. The matrix is the set-up math: on a street circuit full of slow corners, downforce weighs more than straight-line speed; on a fast track the weight flips. Lock-in is garage equipment built to fit only one circuit's facilities.",
    ],
    pointsTitle: "How to compare without cheering",
    points: [
      {
        t: "Six criteria",
        d: "Offerings, regions, price, SLA, compliance, and tools, always with weights.",
        color: "blue",
      },
      {
        t: "Weight decides",
        d: "The same scores with other weights flip the winner; agree on the weights first.",
        color: "ember",
      },
      {
        t: "Dates do not add up",
        d: "33%, 23%, and 10% (material, ref. jun/2025) have different dates: they are not a single snapshot.",
        color: "signal",
      },
    ],
    examplesTitle: "The decision matrix",
    examples: [
      {
        label: "matriz.sh",
        lang: "sh",
        code: `awk 'BEGIN {
  # criteria, in order: existing ecosystem, cost, compliance, tools, regions
  split("30 25 20 15 10", peso, " ")     # weights (add up to 100)
  split("5 3 4 3 4", op1, " ")           # fictitious scores for Option 1
  split("3 4 4 4 5", op2, " ")           # fictitious scores for Option 2
  for (i = 1; i <= 5; i++) {
    soma1 += peso[i] * op1[i]            # weighted sum for Option 1
    soma2 += peso[i] * op2[i]            # weighted sum for Option 2
  }
  printf "opcao 1: %.2f | opcao 2: %.2f\\n", soma1 / 100, soma2 / 100
}'`,
        note: "Fictitious scores for Option 1 and Option 2: this is not an assessment of any real provider.",
      },
      {
        label: "swapped weights",
        lang: "sh",
        code: `$ sh "$LAB"/etapa-04/matriz.sh
opcao 1: 3.90 | opcao 2: 3.80
# replace "30 25 20 15 10" with "10 35 20 15 20" (less ecosystem, more cost and regions)
$ sh "$LAB"/etapa-04/matriz.sh
opcao 1: 3.60 | opcao 2: 4.10`,
        note: "The winner flipped without any score changing.",
      },
      {
        label: "regions: AWS vs Azure",
        lang: "sh",
        code: `$ aws ec2 describe-regions --query "length(Regions)"
$ az account list-locations --query "length([?metadata.regionType=='Physical'])"
# each command prints an integer`,
        note: "The number of regions is not the number of AZs, and counting regions does not measure resilience.",
      },
    ],
    commands: [
      { cmd: 'sh "$LAB"/etapa-04/matriz.sh', note: "weighted matrix with fictitious scores" },
      {
        cmd: 'aws ec2 describe-regions --query "length(Regions)"',
        note: "how many regions the AWS account sees",
      },
      {
        cmd: "az account list-locations --query \"length([?metadata.regionType=='Physical'])\"",
        note: "how many physical regions the Azure subscription sees",
      },
    ],
    handsOnIntro:
      "Change the matrix weights for two scenarios, count each circuit's sites, and take an honest inventory of what leaving would cost.",
    handsOn: [
      "Run the matrix with both sets of weights and check 3.90 versus 3.80 and then 3.60 versus 4.10.",
      "Invent weights for a company that already uses Active Directory and Microsoft 365 and for a data startup with no legacy.",
      "Count the AWS and Azure regions with the read commands.",
      "List five services in your project and mark whether there is an equivalent on the other provider and whether the data format is open.",
      "Estimate how much leaving each one would cost, in time and money: that is your lock-in inventory.",
    ],
    tip: "Multicloud has its own cost: complexity, consistent security, and data transfer between providers. In 2022, 89% of organizations used more than one cloud (material, ref. jun/2025).",
    takeaway:
      "A provider is chosen with method and weights agreed with the business; lock-in is a cost accepted with eyes open.",
  },
  {
    id: "ac5",
    num: "05",
    navTitle: "Elements",
    tag: "storage, network, IaC",
    title: "Cloud Architecture Elements",
    lead: "Choose the block by the problem and design the network addressing before creating anything, remembering that the subnet is zonal on AWS and is not on Azure.",
    concept: [
      "Object storage (S3 and Blob Storage) scales almost without limit and is not modified in part; block (EBS and Managed Disks) is fast and attached to a VM; file (EFS and Azure Files) is the shared folder. Databases: relational with ACID (RDS and Aurora versus Azure SQL Database and Azure Database for PostgreSQL and MySQL; Aurora has no exact pair), NoSQL (DynamoDB and Cosmos DB), cache (ElastiCache and Azure Cache for Redis), and data warehouse (Redshift versus Synapse and Fabric).",
      "VPC (AWS) and VNet (Azure) are your private network, both with regional scope. The tricky difference: on AWS the subnet is bound to one AZ, so 2 zones require at least 2 subnets; on Azure the subnet spans the region. AWS uses an Internet Gateway and a route to define a public subnet; Azure has no Internet Gateway and requires fixed-name subnets such as GatewaySubnet. Each subnet reserves 5 addresses: a /24 has 251 usable. Peering requires CIDRs that do not overlap.",
      "Layer 4 load balancing decides by TCP and UDP; layer 7, by HTTP content, with SSL termination. CloudFront is mainly a CDN; Front Door combines CDN, layer 7 balancing across regions, and WAF in one global service. IaC describes the infrastructure in a file: CloudFormation on AWS, ARM and Bicep on Azure. The AWS Well-Architected has six pillars (with Sustainability); Azure's is described with five.",
      "Trackside reading: the VPC is the team's reserved area at the circuit; the subnets are the sectors (the front facing the pit lane, the office at the back, the data room with no exit); NAT is the press officer. CIDR overlap is two cars with the same number, and the central CIDR registry is the FIA's register of permanent numbers: you check before painting the car.",
    ],
    pointsTitle: "The right blocks for each problem",
    points: [
      {
        t: "Object, block, file",
        d: "Photos in object, the database disk in block, team documents in file.",
        color: "blue",
      },
      {
        t: "Zonal subnet only on AWS",
        d: "3 tiers in 3 zones: 9 subnets on AWS, 3 on Azure.",
        color: "ember",
      },
      {
        t: "CIDR on paper first",
        d: "Overlapping networks cannot be peered; renumbering later is expensive.",
        color: "signal",
      },
    ],
    examplesTitle: "Design the network before creating it",
    examples: [
      {
        label: "cidr.py",
        lang: "sh",
        code: `import ipaddress
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
print("overlap com 10.0.5.0/24:", rede.overlaps(ipaddress.ip_network("10.0.5.0/24")))`,
        note: "Output: six subnets with dentro=True and utilizaveis=251, conflitos: [], overlap False with 192.168.0.0/16 and True with 10.0.5.0/24.",
      },
      {
        label: "AWS: vpc.yaml",
        lang: "yaml",
        code: `AWSTemplateFormatVersion: "2010-09-09"   # template format version (fixed value)
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
      AvailabilityZone: !Select [0, !GetAZs ""]   # the first AZ of the region where the stack is created`,
        note: "On AWS, the subnet is a separate resource, bound to one AZ.",
      },
      {
        label: "Azure: vnet.bicep",
        lang: "sh",
        code: `param localizacao string = resourceGroup().location   // parameter: region of the resource group

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
}`,
        note: "On Azure, the subnet is a property of the VNet and is not zonal.",
      },
    ],
    commands: [
      { cmd: 'python3 "$LAB"/etapa-05/cidr.py', note: "validates the address plan" },
      {
        cmd: "az bicep build --file vnet.bicep",
        note: "compiles the Bicep to ARM locally, no login",
      },
      {
        cmd: 'aws cloudformation validate-template --template-body "file://$LAB/etapa-05/vpc.yaml"',
        note: "only checks the syntax; does not create the stack",
      },
      {
        cmd: 'aws ec2 describe-subnets --query "Subnets[].[SubnetId,AvailabilityZone,CidrBlock]" --output text',
        note: "one subnet per AZ: proof that on AWS it is zonal",
      },
    ],
    handsOnIntro:
      "Run the address plan, validate the two IaC files without creating anything, and check that, on AWS, each subnet has its own zone.",
    handsOn: [
      "Run cidr.py and confirm conflitos: [] and the overlap with 10.0.5.0/24.",
      'Compile vnet.bicep and look for "type": "Microsoft.Network/virtualNetworks" in the generated vnet.json.',
      "Validate vpc.yaml with validate-template and see the Description VPC de estudo in the response JSON.",
      "List VPCs and subnets on AWS (the default VPC uses 172.31.0.0/16) and the VNets on Azure.",
      "Plan 10.20.0.0/16 with 3 tiers in 3 zones: 9 subnets on AWS, 3 on Azure (plus GatewaySubnet, if there is a VPN).",
    ],
    tip: "Do not run create-stack or az deployment create: they create resources and may generate cost. This stage is for reading and validation.",
    takeaway:
      "The right block for each problem and addressing designed on paper, with the subnet zonal on AWS and regional on Azure.",
  },
  {
    id: "ac6",
    num: "06",
    navTitle: "Security and costs",
    tag: "IAM, keys, FinOps",
    title: "Security, Costs, and Best Practices",
    lead: "Security, cost, and governance are design requirements: apply least privilege and layers of defense, tag every resource, and measure what matters before buying a discount.",
    concept: [
      "In the shared responsibility model, the provider handles security of the cloud and you handle security in the cloud: data, network configuration, OS, applications, and IAM. Customer misconfigurations are among the most common causes of breaches. Side by side: AWS IAM covers identity and authorization within the account; on Azure, Entra ID handles identities and Azure RBAC handles role assignments with scope. Both support MFA with FIDO2, the most robust method cited.",
      "Encryption in transit (TLS) and at rest (KMS on AWS, Key Vault on Azure, which also stores secrets and certificates). In envelope encryption, the DEK encrypts the data and the KEK encrypts the DEK: rotating the KEK only re-envelopes the DEKs. Layered network: the Security Group is stateful and only allows; the NACL is stateless, per subnet, in numerical order; Azure's NSG is stateful at both levels, with allow and deny by priority. WAF, Network Firewall versus Azure Firewall, Transit Gateway versus Virtual WAN.",
      "FinOps brings finance, engineering, and business together. Levers: scheduling for the intermittent, commitment (Savings Plans and RIs; Azure Savings Plan and Reservations) for the stable, Spot for what tolerates interruption, right-sizing, and cleaning up orphaned disks. Cost Management and Trusted Advisor on one side, Microsoft Cost Management and Azure Advisor on the other. Tags require a consistent policy: Tag Policies on AWS, Azure Policy on Azure, where the resource group's tag is not inherited by default.",
      "Trackside reading: IAM is paddock credentialing, and least privilege is the hospitality guest with no pit lane access. An unsafe release from the pit box, with the car leaving before the wheel is secured, shows the shared responsibility: the track was in order, the failure was the team's procedure. FinOps is the cost cap, and the tag is the label on each part with its cost center.",
    ],
    pointsTitle: "Three design requirements",
    points: [
      {
        t: "Least privilege",
        d: "Only the minimum permissions, for the minimum time, with MFA on the root account.",
        color: "blue",
      },
      {
        t: "Stateful vs stateless",
        d: "Security Group and NSG remember the connection; the NACL checks both ways.",
        color: "signal",
      },
      {
        t: "Switching off pays most",
        d: "Scheduling what sits idle saved 63.8% with no contract (fictitious numbers).",
        color: "ember",
      },
    ],
    examplesTitle: "Envelope, tags, and waste hunting",
    examples: [
      {
        label: "envelope with openssl",
        lang: "sh",
        code: `$ cd "$LAB"/etapa-06
$ echo "dados do cliente" > dados.txt        # the secret we want to protect
$ openssl rand -hex 32 > dek.key             # DEK: random key that encrypts the data
$ openssl rand -hex 32 > kek.key             # KEK: key that protects the DEK (in the real world, it lives in the KMS or Key Vault)
# 1) encrypts the data with the DEK
$ openssl enc -aes-256-cbc -pbkdf2 -in dados.txt -out dados.enc -pass file:dek.key
# 2) encrypts (envelopes) the DEK with the KEK
$ openssl enc -aes-256-cbc -pbkdf2 -in dek.key -out dek.enc -pass file:kek.key
# 3) deletes the plaintext DEK: only the encrypted data and the encrypted DEK remain
$ rm dek.key dados.txt
# 4) to read it back: first opens the envelope (KEK -> DEK), then decrypts the data (DEK -> data)
$ openssl enc -d -aes-256-cbc -pbkdf2 -in dek.enc -out dek.key -pass file:kek.key
$ openssl enc -d -aes-256-cbc -pbkdf2 -in dados.enc -pass file:dek.key
dados do cliente`,
        note: "Didactic demonstration (CBC with a password-derived key). In KMS and Key Vault, the KEK never leaves the service.",
      },
      {
        label: "tag auditor",
        lang: "sh",
        code: `awk -F, 'NR>1 {
  total++                                              # counts resources
  if ($2=="" || $3=="" || $4=="") {                    # any of the required tags empty?
    print "SEM TAG:", $1
    faltam++
  }
} END {
  printf "cobertura: %d/%d = %.0f%%\\n", total-faltam, total, (total-faltam)/total*100
}' "$LAB"/etapa-06/inventario.csv
SEM TAG: vm-web-02
SEM TAG: disco-01
SEM TAG: bucket-logs
cobertura: 2/5 = 40%`,
        note: "Fictitious inventory. With the regex ^(producao|teste|desenvolvimento)$, Producao becomes an error and coverage drops to 2/6.",
      },
      {
        label: "waste: AWS vs Azure",
        lang: "sh",
        code: `# Orphaned disks: status=available on AWS, Unattached on Azure
$ aws ec2 describe-volumes --filters Name=status,Values=available --query "Volumes[].[VolumeId,Size,CreateTime]" --output text
$ az disk list --query "[?diskState=='Unattached'].[name,diskSizeGb]" --output table
# Rules open to the world
$ aws ec2 describe-security-groups --filters Name=ip-permission.cidr,Values=0.0.0.0/0 --query "SecurityGroups[].[GroupId,GroupName]" --output text
$ az network nsg list --output table`,
        note: "New account: empty outputs. If a group open to 0.0.0.0/0 shows up, someone created or changed it.",
      },
    ],
    commands: [
      {
        cmd: 'sh "$LAB"/etapa-06/economia.sh',
        note: "scheduling, commitment, and Spot (fictitious)",
      },
      {
        cmd: 'aws iam get-account-summary --query "SummaryMap.AccountMFAEnabled"',
        note: "1 if the root account has MFA, 0 if not",
      },
      {
        cmd: 'az role assignment list --all --query "[].{quem:principalName, papel:roleDefinitionName, escopo:scope}" --output table',
        note: "who can do what, with scope",
      },
      {
        cmd: "openssl s_client -connect example.com:443 -brief < /dev/null",
        note: "real TLS: version, cipher, and verification",
      },
    ],
    handsOnIntro:
      "The longest pit stop of the guide: tag audit, savings calculation, waste hunt, and risk with read commands and a real TLS.",
    handsOn: [
      "Run the envelope encryption and recover dados do cliente; then delete dek.key, kek.key, dados.enc, and dek.enc.",
      "Create the fictitious inventario.csv, run the auditor, and check cobertura: 2/5 = 40%.",
      "Add vm-api-01,Producao,loja,cc-100 and rewrite the auditor to treat Producao as an error (2/6 = 33%).",
      "Run economia.sh and compare: switching off outside business hours (63.8%) versus commitment and Spot.",
      "Look for orphaned disks, users without MFA, and rules open to the world on AWS and Azure, read-only.",
    ],
    tip: "On AWS, Trusted Advisor (aws support describe-trusted-advisor-checks) depends on the support plan; an access error without the plan is expected.",
    takeaway:
      "Least privilege, the key in the safe, layered firewalls, a label on each part, and the right cost lever for each load.",
  },
];
