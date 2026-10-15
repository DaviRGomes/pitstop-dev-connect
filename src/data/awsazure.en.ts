// Content from the eleven lessons of the "AWS" course (DevOps and Cloud Architecture, Phase 1), one stage per lesson,
// with AWS and Azure side by side (all Azure content is the instructor's didactic addition),
// themed around Formula 1 by the /otimizar-relatorio pipeline (relatorios/aws-azure/final.en.md).

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
    f1: "The circuit: its own facilities, and the team's procedure is the same on both",
  },
  {
    tema: "Region and availability zone",
    f1: "The host city where the circuit has facilities, and the physically separate garage buildings inside it, each with its own power and network",
  },
  {
    tema: "AWS account and Azure subscription",
    f1: "The team's contract with the circuit: facilities, access, and billing isolated from the other teams",
  },
  {
    tema: "Shared responsibility",
    f1: "The circuit looks after the track, barriers, and power; the team looks after the car, the garage, and who enters it",
  },
  {
    tema: "Identity and permission (IAM, Entra ID, and Azure RBAC)",
    f1: "The pass: each person with their own, opening only the areas they need, and the turnstile recording everything",
  },
  {
    tema: "Virtual network (VPC, VNet) and firewalls",
    f1: "The team's fenced area in the paddock: sectors, gates to the street, and marshals at the doors",
  },
  {
    tema: "Virtual machine (EC2, Azure VM)",
    f1: "A complete garage, with its own generator and systems (the entire operating system)",
  },
  {
    tema: "Container, Pod, and orchestrator (EKS, AKS)",
    f1: "The car assembled from the specification, and the wall that keeps on track as many cars as the spec sheet asks for",
  },
  {
    tema: "Serverless (Lambda, Azure Functions)",
    f1: "The station that the circuit only opens when a request arrives; the first cold call is the out-lap",
  },
  {
    tema: "Metrics, events, and logs (CloudWatch, Azure Monitor)",
    f1: "The telemetry, the race control messages, and the radio with the car's record",
  },
  {
    tema: "CDN, load balancer, and object storage",
    f1: "The forward parts depots, the pit lane entry, and the central warehouse",
  },
  {
    tema: "Secrets, certificates, and DNS",
    f1: "The combination vault, the Super Licence with an expiry date, and the entry list",
  },
];

export const ANALOGY_NOTES: string[] = [
  "You do not choose the circuit: the calendar decides where the team races. In the cloud, the choice of provider is yours, and you can use both at the same time.",
  "Scale: F1 has two cars per team and one garage per circuit. In the cloud you spin up one, fifty, or five thousand machines and delete them all in minutes.",
  "Billing by use: no circuit facility charges by the second of use. The cloud does, and that is why cleanup at the end of each practice matters.",
  "A copy is not a part: a physical part exists in one unit; images, objects, and secrets can be copied without limit. That is why a leaked secret must be revoked and replaced, not just taken back.",
  "The cost cap punishes; the budget warns. The budget alert (AWS Budgets, Cost Management) warns when spending passes the limit, but does not shut anything down by itself.",
  "Same role, different models: an analogy holds for the AWS x Azure pair, but the model differences in each stage still apply. A row in the equivalence table is not a promise of parity.",
];

export const LESSONS: Lesson[] = [
  {
    id: "az1",
    num: "01",
    navTitle: "Intro to the cloud",
    tag: "regions, accounts, and cost",
    title: "Introduction to the cloud, with AWS and Azure",
    lead: "The cloud is on-demand capacity billed by use, organized into regions and zones, with security split between provider and customer. AWS and Azure offer the same building blocks with different names and organization models.",
    concept: [
      "In the on-premises model, the retailer buys extra servers for Black Friday and they sit idle afterwards. The cloud offers compute, storage, and networking on demand (pay-as-you-go), with elasticity, organized into regions and, inside them, availability zones: physically separate data centers linked by a fast network. The provider handles security of the cloud; you handle security in the cloud. Purchase options are on-demand, reserved (1 or 3 years), spot (interruptible), and spending plans.",
      "The AWS x Azure pairs (addition): AWS account x subscription inside a Microsoft Entra tenant; AWS Organizations x Management Groups; the São Paulo region is sa-east-1 on one side and brazilsouth on the other; aws x az on the command line; CloudFormation x ARM templates and Bicep; AWS Budgets x Microsoft Cost Management; Well-Architected with six pillars x Azure Well-Architected Framework with five.",
      "Where they really differ: on AWS, the account brings together identity, resources, and billing; on Azure, identity lives in the tenant, and billing and resources live in subscriptions. The Resource Group has no exact counterpart on AWS: every Azure resource belongs to one, and deleting the group deletes everything inside. And zones play a different role: on AWS each subnet is tied to one zone; on Azure the zone is an attribute chosen per resource.",
      "On track: the provider is the circuit, the region is the host city (sa-east-1 and brazilsouth are in São Paulo state), and each zone is a garage building with its own power and network. Spreading the application across zones is not leaving both cars dependent on the same generator. The budget alert is the personal version of the cost cap, with one difference: the cost cap punishes, the alert only warns.",
    ],
    pointsTitle: "This stage's dashboard",
    points: [
      {
        t: "Region and zone",
        d: "The region serves latency and data residency; several zones tolerate failures.",
        color: "blue",
      },
      {
        t: "Shared responsibility",
        d: "The provider protects the cloud; you protect configuration, data, and access.",
        color: "signal",
      },
      {
        t: "Budget before anything",
        d: "Spending alert armed before the first creation, on both providers.",
        color: "ember",
      },
    ],
    examplesTitle: "Finding out where you are",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Shows the authenticated identity and the account (creates nothing)
$ aws sts get-caller-identity
{
    "UserId": "AIDAEXAMPLEID",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/ana.dev"
}
# Lists the availability zones of a region
$ aws ec2 describe-availability-zones --region sa-east-1 \\
  --query "AvailabilityZones[].ZoneName" --output text
sa-east-1a sa-east-1b sa-east-1c`,
        note: "The outputs are examples: IDs, dates, and names vary in your account.",
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (addition): authenticates in the browser (once per session)
$ az login
# Shows the active subscription and the tenant (creates nothing)
$ az account show --output table
# Lists the regions available for your subscription
$ az account list-locations --query "[].name" --output tsv`,
        note: "Output: one name per line, including brazilsouth and eastus.",
      },
      {
        label: "rg-lab",
        lang: "sh",
        code: `# Azure (addition): creates an empty grouping (practically zero cost)
$ az group create --name rg-lab --location brazilsouth
# Expected output: JSON with "provisioningState": "Succeeded"
# Cleanup: deletes the group and everything inside it
$ az group delete --name rg-lab --yes --no-wait
# Before recreating rg-lab in the next stage, wait for the deletion to finish
$ az group wait --deleted --name rg-lab`,
        note: "On AWS there is no equivalent needed: nothing is created in this stage.",
      },
    ],
    commands: [
      { cmd: "aws sts get-caller-identity", note: "who am I and in which account" },
      {
        cmd: 'aws ec2 describe-regions --query "Regions[].RegionName" --output text',
        note: "regions enabled in the account",
      },
      { cmd: "az account show --output table", note: "active subscription and tenant" },
      {
        cmd: 'az account list-locations --query "[].name" --output tsv',
        note: "regions available in the subscription",
      },
    ],
    handsOnIntro:
      "First time out of the pit box: confirm the contract, arm the cost cap alarm, and, if you want, set up the rg-lab garage.",
    handsOn: [
      "Run the read commands on the provider you have and note the account number or the subscription ID.",
      "Confirm that sa-east-1 and brazilsouth are each one's São Paulo region and count how many zones AWS lists for sa-east-1.",
      "Create a low monthly budget with an email alert in AWS Budgets and in Cost Management. Creating resources generates charges even on a free account, and free tier rules change: check the current offer on the official site.",
      "Optional: create rg-lab with az group create (practically zero cost).",
      "Cleanup: az group delete --name rg-lab --yes --no-wait and, before recreating it, az group wait --deleted --name rg-lab.",
    ],
    tip: "Before touching anything, run aws sts get-caller-identity and az account show. Getting the account wrong is building the car in the neighbor's garage.",
    takeaway:
      "The cloud is on-demand capacity billed by use, organized into regions and zones, with security split between provider and customer.",
  },
  {
    id: "az2",
    num: "02",
    navTitle: "Identity and access",
    tag: "IAM x Entra ID + RBAC",
    title: "Identity and access (IAM x Entra ID + Azure RBAC)",
    lead: "Give each identity the minimum it needs and prefer a temporary machine identity over a key in code. On AWS the scope lives inside the policy; on Azure, in the role assignment.",
    concept: [
      "Authentication answers who you are; authorization answers what you can do. Least privilege gives each identity only what it needs. Individual users with MFA, grouped into groups; services assume temporary identities instead of keys stored in code; the root account is protected with MFA; every action is audited. In 2019, according to the material, Capital One leaked data from more than 100 million customers through excessive permissions, a customer configuration failure.",
      "The AWS x Azure pairs (addition): IAM x Microsoft Entra ID; IAM policies in JSON x Azure RBAC (a role assigned to an identity at a scope); IAM Role x Managed Identity; AWS Organizations and SCP x Management Groups and Azure Policy (an approximation); CloudTrail x Activity Log; GuardDuty x Microsoft Defender for Cloud.",
      "Where they really differ: the AWS policy carries effect, action, resource, and condition, and an explicit Deny beats any Allow. On Azure, the role defines only actions; the resource comes from the assignment scope, and RBAC is additive: blocks come from Azure Policy, deny assignments, or resource locks. The SCP is a permissions ceiling; Azure Policy evaluates resource properties. And Azure separates Actions (manage) from DataActions (read and write data): an Owner does not read blobs for that reason alone.",
      "On track: each person has their own pass, which opens only the areas they need, and the turnstile records everything. The machine identity is the pass attached to the equipment, renewed on its own, with no paper to lose. The SCP is the parent company's rule: a group that owns two teams can forbid something for both, and no team principal can allow what the parent company vetoed. And owning the garage does not give access to the car's data.",
    ],
    pointsTitle: "The paddock passes",
    points: [
      {
        t: "Least privilege",
        d: "Nobody holds a pit lane pass just in case.",
        color: "blue",
      },
      {
        t: "Machine identity",
        d: "IAM Role and Managed Identity remove the key from the code.",
        color: "signal",
      },
      {
        t: "Deny x additive",
        d: "On AWS Deny beats everything; in Azure RBAC permissions only add up.",
        color: "ember",
      },
    ],
    examplesTitle: "The same rule in both models",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PutObjectWithConditions",
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::meu-bucket/*",
      "Condition": {
        "IpAddress":  { "aws:SourceIp": "203.0.113.0/24" },
        "Bool":       { "aws:MultiFactorAuthPresent": "true" },
        "DateGreaterThan": { "aws:CurrentTime": "2025-05-13T13:00:00Z" },
        "DateLessThan":    { "aws:CurrentTime": "2025-05-13T21:00:00Z" }
      }
    }
  ]
}`,
        note: "IAM policy from the material: upload objects only from one IP, with MFA, and within a time window.",
      },
      {
        label: "Azure",
        lang: "sh",
        code: `{
  "Name": "Gravador de blobs do projeto X",
  "IsCustom": true,
  "Description": "Permite gravar blobs no resource group rg-app.",
  "Actions": [],
  "NotActions": [],
  "DataActions": [
    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write"
  ],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/<ID-DA-ASSINATURA>/resourceGroups/rg-app"
  ]
}`,
        note: "Azure (addition): the role describes only what and where it can be assigned. IP and MFA live in Conditional Access; time-limited access, in PIM.",
      },
      {
        label: "SCP x Azure Policy",
        lang: "sh",
        code: `# AWS: SCP that denies EC2 across the entire organization, even if an account's IAM allows it
{
  "Version": "2012-10-17",
  "Statement": [{ "Effect": "Deny", "Action": "ec2:*", "Resource": "*" }]
}
# Azure (addition): Azure Policy rule that denies the creation of virtual machines in the scope
{
  "if":   { "field": "type", "equals": "Microsoft.Compute/virtualMachines" },
  "then": { "effect": "deny" }
}`,
        note: "The SCP limits permissions; Azure Policy blocks resource types and configurations. They are not exact translations.",
      },
    ],
    commands: [
      {
        cmd: 'aws iam list-users --query "Users[].UserName" --output text',
        note: "IAM users (if you have permission)",
      },
      {
        cmd: 'aws iam list-groups --query "Groups[].GroupName" --output text',
        note: "IAM groups",
      },
      {
        cmd: "az role assignment list --assignee <SEU-E-MAIL> --all -o table",
        note: "your role assignments at all scopes",
      },
      {
        cmd: 'az role definition list --name "Reader" -o json',
        note: "what the built-in Reader role allows",
      },
    ],
    handsOnIntro:
      "Pit lane open: check the passes that already exist, validate a policy without the cloud, and, if you want, create a read group on both circuits.",
    handsOn: [
      "Reading: run the commands above and check whether you use an individual user or the root (the root should be avoided).",
      "Save the material's read policy in politica.json and validate it with python3 -m json.tool politica.json.",
      "Optional and free: on AWS, create the estudo-leitores group with the ReadOnlyAccess policy; on Azure, create the group in Entra ID and assign the Reader role on rg-lab (creating groups requires permission in the tenant).",
      "Read a role definition and say which Actions and DataActions it grants, and where it can be assigned.",
      "Cleanup: aws iam detach-group-policy and aws iam delete-group; az ad group delete --group estudo-leitores and az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "The // comments in the report's JSON are didactic: real JSON does not accept them. Remove them before using the file in az role definition create or in a policy.",
    takeaway:
      "The minimum for each identity, a machine pass instead of a key in code; the scope lives in the policy (AWS) or in the assignment (Azure).",
  },
  {
    id: "az3",
    num: "03",
    navTitle: "Networks",
    tag: "VPC x VNet",
    title: "Networks (VPC x VNet)",
    lead: "A cloud network is route plus firewall: the subnet is public because of the route, and Azure's NSG does on its own what the Security Group and NACL pair does on AWS.",
    concept: [
      "A virtual network is a block of private IPs in CIDR (10.0.0.0/16 has 65,536 addresses), sliced into subnets by purpose. The route decides public or private: if 0.0.0.0/0 leaves through an internet gateway, it is public. Private subnets go out through NAT, outbound only. There are stateful and stateless firewalls; networks connect through peering (non-transitive), a hub, VPN, or a dedicated link.",
      "The AWS x Azure pairs (addition): VPC x VNet; Internet Gateway x public IP on the resource; NAT Gateway on both; Security Group x NSG; NACL x NSG associated with the subnet; VPC Peering x VNet Peering; Transit Gateway x Virtual WAN; Direct Connect x ExpressRoute; VPC Endpoint x Private Endpoint and Service Endpoint; VPC Flow Logs x NSG and VNet flow logs.",
      "Where they really differ: on AWS the subnet is tied to one zone; on Azure it spans the region. AWS separates the Security Group (stateful, allow only) from the NACL (stateless, allow and deny, by number); the NSG is stateful, accepts Allow and Deny by priority, and is associated with the NIC, the subnet, or both. False friend: ASG on Azure is Application Security Group. And Azure has no resource equivalent to the Internet Gateway.",
      "On track: the network is the team's fenced area in the paddock, each subnet is a sector, and NAT is the messenger who goes out and comes back. AWS puts two marshals in place (one at each garage door, another at the sector turnstile); Azure uses a single marshal, with memory, who allows and forbids. Peering is the direct passage between two areas that does not lead to a third.",
    ],
    pointsTitle: "Route and marshals",
    points: [
      {
        t: "The route decides",
        d: "Without a route to the internet gateway, the subnet is private.",
        color: "blue",
      },
      {
        t: "One marshal or two",
        d: "Security Group and NACL on AWS; the NSG does both on Azure.",
        color: "ember",
      },
      {
        t: "Peering is not transitive",
        d: "For many networks, use a hub: Transit Gateway or Virtual WAN.",
        color: "signal",
      },
    ],
    examplesTitle: "The classic design: 10.0.0.0/16 with web and database",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Shows your VPCs; the one with "padrao: True" is the default (do not use it in serious projects)
$ aws ec2 describe-vpcs --query "Vpcs[].{id:VpcId,cidr:CidrBlock,padrao:IsDefault}" --output table
# Creates the VPC and the design's two subnets (note the returned IDs)
$ aws ec2 create-vpc --cidr-block 10.0.0.0/16
$ aws ec2 create-subnet --vpc-id <ID-DA-VPC> --cidr-block 10.0.1.0/24 --availability-zone sa-east-1a
$ aws ec2 create-subnet --vpc-id <ID-DA-VPC> --cidr-block 10.0.2.0/24 --availability-zone sa-east-1a
# Without an Internet Gateway and a route to it, both are still private`,
        note: "The network itself does not generate charges; NAT Gateway, VPN, and public IPs do.",
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (addition): recreates the group and creates the VNet already with the first subnet, and then the second
$ az group create --name rg-lab --location brazilsouth
$ az network vnet create --resource-group rg-lab --name vnet-lab \\
  --address-prefixes 10.0.0.0/16 \\
  --subnet-name snet-web --subnet-prefixes 10.0.1.0/24
$ az network vnet subnet create --resource-group rg-lab --vnet-name vnet-lab \\
  --name snet-db --address-prefixes 10.0.2.0/24`,
      },
      {
        label: "SG x NSG",
        lang: "sh",
        code: `# AWS: Security Group with inbound port 22 only from your IP (the reply leaves on its own: stateful)
$ aws ec2 create-security-group --group-name sg-lab --description "lab" --vpc-id <ID-DA-VPC>
$ aws ec2 authorize-security-group-ingress --group-id <ID-DO-SG> \\
  --protocol tcp --port 22 --cidr 203.0.113.10/32
# Azure (addition): NSG with an inbound rule; the priority (100 to 4096) defines the order
$ az network nsg create --resource-group rg-lab --name nsg-lab
$ az network nsg rule create --resource-group rg-lab --nsg-name nsg-lab \\
  --name permitir-ssh --priority 100 --direction Inbound --access Allow \\
  --protocol Tcp --destination-port-ranges 22 --source-address-prefixes 203.0.113.10/32`,
        note: "The NSG reads the rules from the lowest priority to the highest and stops at the first one that applies.",
      },
    ],
    commands: [
      {
        cmd: 'aws ec2 describe-subnets --query "Subnets[].{id:SubnetId,az:AvailabilityZone,cidr:CidrBlock}" --output table',
        note: "each subnet shows ONE zone",
      },
      {
        cmd: 'aws ec2 describe-route-tables --query "RouteTables[].Routes[].GatewayId" --output text',
        note: "look for igw-...: the route that makes the subnet public",
      },
      { cmd: "az network vnet list --output table", note: "your VNets" },
      { cmd: "az network nsg list --output table", note: "existing NSGs" },
    ],
    handsOnIntro:
      "Installation lap: it starts on the calculator, with no cloud, and only then come reading and no-cost creation.",
    handsOn: [
      "With Python's ipaddress module, confirm that 10.0.0.0/16 has 65,536 addresses and fits 256 /24 subnets.",
      "Reading: find out on AWS which subnet has a route to igw-... and, on Azure, which subnets or NICs each NSG is associated with.",
      "Optional and free (no NAT Gateway or public IP): create the VPC, the subnets, the Security Group, and the NSG, and list again.",
      "Answer: to block a malicious IP for an entire subnet, use a NACL on AWS and a Deny rule in an NSG associated with the subnet on Azure.",
      "Cleanup in dependency order: delete-security-group, delete-subnet (twice), and delete-vpc; on Azure, az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "Plan the CIDR first: blocks that overlap with the company network make routing ambiguous and the VPN does not work.",
    takeaway:
      "A cloud network is route plus firewall; the route makes the subnet public, and the NSG combines what the Security Group and NACL keep apart.",
  },
  {
    id: "az4",
    num: "04",
    navTitle: "Virtual machines",
    tag: "EC2 x Azure VM",
    title: "Virtual machines (EC2 x Azure Virtual Machines)",
    lead: "A VM is renting a server by time: pick the size by the workload, standardize with images, scale by rule, and remember that disk and IP charge even with the machine stopped.",
    concept: [
      "A virtual machine has its own operating system, network, and disks. Size families are chosen by CPU, memory, storage, and network. Burstable instances have a CPU baseline and accumulate credits below it to spend at peaks. Images standardize identical VMs and feed autoscaling; persistent disks survive shutdown and keep charging.",
      "The AWS x Azure pairs (addition): EC2 x Virtual Machine; T family (t3.micro) x B series (Standard_B1s); AMI x Marketplace and Azure Compute Gallery; Auto Scaling Group x VM Scale Sets; EBS x Managed Disks; Elastic IP x static Public IP; key pair x --generate-ssh-keys; Spot Instances x Spot VMs.",
      "Where they really differ: on Azure, a VM stopped from inside the system keeps its compute reserved and charging; only deallocate releases it. On AWS, stopping already ends the compute cost (EBS and IP keep charging). Terminating on AWS deletes the root volume by default; deleting the VM on Azure does not delete the disk, NIC, and public IP unless you delete the resource group.",
      "On track: the VM is a complete garage, with its own generator. CPU credits work like the ERS: they charge below the baseline and discharge at the peaks; without charge, the car loses speed before the end of the straight. Here the analogy stops: the ERS harvests energy under braking, credits depend only on time, and in unlimited mode you pay for the excess, something F1 does not sell.",
    ],
    pointsTitle: "The right garage",
    points: [
      {
        t: "Burstable",
        d: "T family and B series: light workloads with short peaks.",
        color: "blue",
      },
      {
        t: "Stop x deallocate",
        d: "On Azure, only deallocate stops the compute charge.",
        color: "ember",
      },
      {
        t: "Disk and IP charge",
        d: "Even with the machine stopped; check them during cleanup.",
        color: "signal",
      },
    ],
    examplesTitle: "From zero to a VM",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# How many vCPUs and how much memory does the t3.micro have?
$ aws ec2 describe-instance-types --instance-types t3.micro \\
  --query "InstanceTypes[0].{vcpu:VCpuInfo.DefaultVCpus,memoriaMiB:MemoryInfo.SizeInMiB}"
{ "vcpu": 2, "memoriaMiB": 1024 }
# Optional creation (charges if left running): region, image, key, and firewall
$ export AWS_DEFAULT_REGION=sa-east-1
$ AMI_ID=$(aws ssm get-parameters \\
  --names /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 \\
  --query 'Parameters[0].Value' --output text)
$ aws ec2 create-key-pair --key-name lab --query KeyMaterial --output text > lab.pem && chmod 400 lab.pem
$ VPC_ID=$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true \\
  --query 'Vpcs[0].VpcId' --output text)
$ SG_ID=$(aws ec2 create-security-group --group-name sg-vm-lab \\
  --description "SSH so do meu IP" --vpc-id "$VPC_ID" --query GroupId --output text)
$ MEU_IP=$(curl -s https://checkip.amazonaws.com)
$ aws ec2 authorize-security-group-ingress --group-id "$SG_ID" \\
  --protocol tcp --port 22 --cidr "$MEU_IP/32"
# Creates ONE small instance and prints its ID (note it for the cleanup)
$ aws ec2 run-instances \\
  --image-id "$AMI_ID" \\
  --instance-type t3.micro \\
  --key-name lab \\
  --security-group-ids "$SG_ID" \\
  --count 1 \\
  --query 'Instances[0].InstanceId' --output text`,
        note: "Without --subnet-id, AWS uses a default subnet of the default VPC, which is public.",
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (addition): does the Standard_B1s size exist in the region?
$ az vm list-sizes --location brazilsouth --query "[?name=='Standard_B1s']" --output table
# Recreates the group and creates the VM, disk, NIC, and public IP in one command
$ az group create --name rg-lab --location brazilsouth
$ az vm create \\
  --resource-group rg-lab \\
  --name vm-lab \\
  --image Ubuntu2204 \\
  --size Standard_B1s \\
  --admin-username azureuser \\
  --generate-ssh-keys`,
        note: "If the size line does not appear, the size does not exist in that region.",
      },
      {
        label: "stop x deallocate",
        lang: "sh",
        code: `# AWS: stopping keeps the disk; the instance stops generating compute cost
$ aws ec2 stop-instances --instance-ids <ID-DA-INSTANCIA>
# Azure (addition): stopping from the operating system does NOT release compute; you must DEALLOCATE
$ az vm deallocate --resource-group rg-lab --name vm-lab`,
      },
    ],
    commands: [
      {
        cmd: 'aws ec2 describe-instances --query "Reservations[].Instances[].{id:InstanceId,estado:State.Name,tipo:InstanceType}" --output table',
        note: "your instances and the state of each one",
      },
      {
        cmd: "az vm list --show-details --output table",
        note: "VM running or VM deallocated",
      },
      {
        cmd: 'aws ec2 describe-volumes --query "Volumes[].VolumeId" --output text',
        note: "is any volume left over?",
      },
    ],
    handsOnIntro:
      "Stopwatch in hand: first the battery math, with no cloud; then reading, optional creation, and a cleanup that cannot be skipped.",
    handsOn: [
      "Calculate the t3.micro baseline: 12 credits per hour across 2 vCPUs give 10% per vCPU.",
      "Reading: run the size commands and list your VMs, watching the running, stopped, and deallocated states.",
      "Optional (charges if left running): create the instance and the VM and log in over SSH (ec2-user on Amazon Linux, azureuser on Azure).",
      "On Azure, deallocate with az vm deallocate and confirm the state; on AWS, compare with stop-instances.",
      "Cleanup (a running VM charges): terminate-instances, wait instance-terminated, delete-security-group, delete-key-pair, and a check of the volumes; on Azure, az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "A workload that stays above the baseline all the time exhausts the credits: the burstable family stops being the right choice.",
    takeaway:
      "Size by workload, image to standardize, rule to scale, and disk and IP charge even with the machine stopped.",
  },
  {
    id: "az5",
    num: "05",
    navTitle: "Containers",
    tag: "ECS/EKS x Container Apps/AKS",
    title: "Containers (ECS/EKS x Container Apps/AKS)",
    lead: "The container packages, the orchestrator keeps the desired state. Kubernetes is the common language between EKS and AKS, and serverless simplicity (Fargate, Container Apps) costs fine-grained control.",
    concept: [
      "The container shares the host kernel instead of booting an operating system per application; the image is stored in a registry. The orchestrator keeps the desired state, restarts what crashes, and scales. In Kubernetes, the control plane decides where each thing runs on the worker nodes; the Pod is the smallest unit, the Deployment declares replicas, the Service gives a stable address, and the Ingress defines HTTP entry.",
      "The AWS x Azure pairs (addition): ECS x Azure Container Apps; Fargate x Container Apps and Azure Container Instances; EKS x AKS; ECR x ACR; node group x node pool; IAM Roles for Service Accounts x Microsoft Entra Workload ID; Container Insights on both sides; KEDA built into Container Apps and available on AKS.",
      "Where they really differ: ECS does not exist on Azure; the answer for simple orchestration is Container Apps, which runs on Kubernetes and scales to zero. AKS has a free control plane tier and requires a system node pool. The YAML is the same, but the LoadBalancer type, the StorageClass, and the ingress become different equipment on each provider, with their own price.",
      "On track: the image is the car's replicable specification, the Pod is the car on track, the nodes are the garages, and the control plane is the wall, which orders another car built when one stops. In F1, a car that stops on the straight has no replacement until the end of the race; in Kubernetes, the lost Pod comes back in seconds.",
    ],
    pointsTitle: "The operation sheet",
    points: [
      {
        t: "Same YAML",
        d: "Kubernetes manifests work on EKS, AKS, and kind.",
        color: "blue",
      },
      {
        t: "Self-healing",
        d: "The Deployment replaces the replica that goes down.",
        color: "signal",
      },
      {
        t: "Same sheet, different bill",
        d: "Control plane, nodes, load balancer, and disks cost differently.",
        color: "ember",
      },
    ],
    examplesTitle: "The same cluster on both providers",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# EKS cluster with managed nodes (optional, it costs: nodes are VMs; takes several minutes)
$ eksctl create cluster --name my-cluster --region sa-east-1 --nodes 2
# Managed node group: 2 nodes, minimum 1 and maximum 3
$ eksctl create nodegroup \\
  --cluster my-cluster \\
  --name my-nodegroup \\
  --node-type t3.medium \\
  --nodes 2 \\
  --nodes-min 1 \\
  --nodes-max 3 \\
  --managed`,
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (addition): recreates the group, creates the AKS cluster with 2 nodes, and downloads the credentials
$ az group create --name rg-lab --location brazilsouth
$ az aks create --resource-group rg-lab --name aks-lab --node-count 2 --generate-ssh-keys
$ az aks get-credentials --resource-group rg-lab --name aks-lab
# Equivalent node pool: 2 nodes, minimum 1 and maximum 3
$ az aks nodepool add \\
  --resource-group rg-lab \\
  --cluster-name aks-lab \\
  --name pool2 \\
  --node-count 2 \\
  --enable-cluster-autoscaler \\
  --min-count 1 --max-count 3`,
      },
      {
        label: "app.yaml",
        lang: "yaml",
        code: `apiVersion: apps/v1            # API version for Deployments
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
  type: ClusterIP              # reachable only inside the cluster`,
        note: "A Pod without the app: minha-aplicacao label is not found by the Service.",
      },
    ],
    commands: [
      {
        cmd: 'aws ecr describe-repositories --query "repositories[].repositoryName" --output text',
        note: "ECR registries",
      },
      { cmd: "aws eks list-clusters", note: "EKS clusters" },
      { cmd: "az acr list --output table", note: "ACR registries" },
      { cmd: "az aks list --output table", note: "AKS clusters" },
    ],
    handsOnIntro:
      "Pit lane open, with no cloud account: spin up a cluster on your machine and take down a car on purpose to watch the wall replace it.",
    handsOn: [
      "Create the local cluster with kind create cluster --name lab (or minikube start) and apply app.yaml with kubectl apply -f app.yaml.",
      "Check 3 Running pods, open the service with kubectl port-forward svc/meu-servico 8080:80, and see Welcome to nginx!",
      "Delete a pod with kubectl delete pod and watch a new one appear; then scale to 5 replicas with kubectl scale.",
      "Optional, it costs: create EKS or AKS only with credit, apply the same app.yaml, and delete it the same day.",
      "Cleanup: kubectl delete -f app.yaml and kind delete cluster --name lab; eksctl delete cluster --name my-cluster --region sa-east-1; az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "Small team, simple API, and no Kubernetes experience: ECS with Fargate or Container Apps. Already using Kubernetes: EKS or AKS.",
    takeaway:
      "The container packages, the orchestrator keeps the desired state, and Kubernetes is the common language between EKS and AKS.",
  },
  {
    id: "az6",
    num: "06",
    navTitle: "Databases",
    tag: "RDS and DynamoDB x Azure SQL and Cosmos DB",
    title: "Databases (RDS, Aurora, and DynamoDB x Azure SQL, PostgreSQL/MySQL, and Cosmos DB)",
    lead: "Relational for integrity and joins, NoSQL for latency and scale by key. Aurora and Cosmos DB are not direct translations of anything: compare by requirement.",
    concept: [
      "Relational uses SQL, ACID transactions, a fixed schema, joins, and referential integrity. NoSQL (key-value, documents, columnar, graphs) trades that for horizontal scale and low latency. When managed, the provider handles patches, backups, point-in-time restore, and high availability in another zone. Capacity can be provisioned or on demand.",
      "The AWS x Azure pairs (addition): RDS x Azure SQL Database and Azure Database for PostgreSQL and MySQL; Aurora x Azure SQL Hyperscale (not a 1-to-1 translation); DynamoDB x Cosmos DB; DAX x Cosmos DB integrated cache; DynamoDB Streams x change feed; Multi-AZ x zone-redundant high availability; TTL on both.",
      "Where they really differ: Aurora separates storage (six copies across three zones, up to 15 read replicas, according to the material) from compute. Cosmos DB exposes its engine through several APIs (NoSQL, MongoDB, Cassandra, Gremlin, Table) and offers five consistency levels (Strong, Bounded staleness, Session, Consistent prefix, Eventual), while DynamoDB chooses eventual or strong per request. Cosmos DB measures cost in Request Units per second.",
      "On track: relational is the car's official technical book, key-value is the tire control by barcode, and the partition key is the tag. Atomicity is the pit stop release: either all four wheels were changed, or the car does not go back out. Here the analogy stops: a failed transaction returns to the previous state; a botched pit stop does not give back the old tires.",
    ],
    pointsTitle: "Which archive to use",
    points: [
      {
        t: "ACID",
        d: "Either the whole transaction happens, or nothing changes.",
        color: "blue",
      },
      {
        t: "Partition key",
        d: "Choose it by the question you will ask every day.",
        color: "signal",
      },
      {
        t: "Consistency",
        d: "Two levels on DynamoDB, five on Cosmos DB.",
        color: "ember",
      },
    ],
    examplesTitle: "Key-value in both worlds",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Creates the "pedidos" (orders) table with partition key "id" (text), billed per request
$ aws dynamodb create-table --table-name pedidos \\
  --attribute-definitions AttributeName=id,AttributeType=S \\
  --key-schema AttributeName=id,KeyType=HASH \\
  --billing-mode PAY_PER_REQUEST
# Waits for the table to become ACTIVE before writing
$ aws dynamodb wait table-exists --table-name pedidos
# Writes an item and reads it back by key
$ aws dynamodb put-item --table-name pedidos \\
  --item '{"id":{"S":"1001"},"item":{"S":"café"}}'
$ aws dynamodb get-item --table-name pedidos --key '{"id":{"S":"1001"}}'
{"Item": {"id": {"S": "1001"}, "item": {"S": "café"}}}`,
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (addition): recreates the group (the previous stage's cleanup deleted it)
$ az group create --name rg-lab --location brazilsouth
# The account name is globally unique: replace <NOME-UNICO>
$ az cosmosdb create --name cosmos-<NOME-UNICO> --resource-group rg-lab \\
  --kind GlobalDocumentDB --capabilities EnableServerless
# Creates the "loja" (store) database and the "pedidos" (orders) container with partition key /id
$ az cosmosdb sql database create --account-name cosmos-<NOME-UNICO> --resource-group rg-lab --name loja
$ az cosmosdb sql container create --account-name cosmos-<NOME-UNICO> --resource-group rg-lab \\
  --database-name loja --name pedidos --partition-key-path "/id"`,
        note: "To write and read items in Cosmos DB, use the portal's Data Explorer or an SDK.",
      },
      {
        label: "atomicity",
        lang: "sh",
        code: `$ python3 - <<'EOF'
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
erro: falha no meio da transferência
[(1, 100), (2, 50)]`,
        note: "Account 1's balance went back to 100: that is atomicity, with no cloud at all.",
      },
    ],
    commands: [
      {
        cmd: 'aws rds describe-db-instances --query "DBInstances[].{id:DBInstanceIdentifier,engine:Engine}" --output table',
        note: "RDS instances and engine",
      },
      { cmd: "aws dynamodb list-tables", note: "DynamoDB tables" },
      { cmd: "az postgres flexible-server list --output table", note: "managed PostgreSQL" },
      { cmd: "az cosmosdb list --output table", note: "Cosmos DB accounts" },
    ],
    handsOnIntro:
      "Bench switched on: the pit stop rule written in code, then reading and, if you want, a table by tag on both circuits.",
    handsOn: [
      "Run the atomicity script and confirm that the failure halfway through did not make the 70 disappear.",
      "Reading: list RDS instances, DynamoDB tables, Azure SQL and PostgreSQL servers, and Cosmos DB accounts.",
      "Optional, minimal cost (on-demand model): create the DynamoDB table and the serverless Cosmos DB account.",
      "Confirm: describe-table returns ACTIVE and az cosmosdb sql container show finds the pedidos container.",
      "Cleanup: aws dynamodb delete-table --table-name pedidos and az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "Sessions that should expire on their own call for TTL, which exists in DynamoDB and in Cosmos DB.",
    takeaway:
      "Relational for integrity and joins, NoSQL for latency and scale by key; compare by requirement, not by name.",
  },
  {
    id: "az7",
    num: "07",
    navTitle: "Serverless",
    tag: "Lambda x Azure Functions",
    title: "Serverless (Lambda and API Gateway x Azure Functions and API Management)",
    lead: "Serverless is paying for execution instead of idleness: excellent for variable load and events, but it ties you to each provider's event format.",
    concept: [
      "Serverless does not mean no servers: the provider handles installation, scaling, and maintenance, and you handle the code. The function has a handler that receives an event fired by a trigger (HTTP, file, database, queue, schedule) and is billed by requests and duration. Cold start is the delay of an inactive function. The API gateway exposes routes, authenticates, rate-limits, and routes. Avoid it for long executions, high and constant load, and when lock-in weighs.",
      "The AWS x Azure pairs (addition): Lambda x Azure Functions; API Gateway x API Management (APIM); Cognito x Entra ID and Entra External ID; Step Functions x Logic Apps or Durable Functions; EventBridge x Event Grid; SQS x Queue Storage or Service Bus; SNS x Service Bus topics and Event Grid; Kinesis x Event Hubs; X-Ray x Application Insights.",
      "Where they really differ: in Azure Functions, input and output triggers and bindings are declared in the function itself; in Lambda, integration is usually configured outside the code. Functions has several hosting plans (consumption, premium, dedicated). APIM is a broad API management product. And lock-in applies to both: isolate the logic in a pure function called by a thin adapter.",
      "On track: it is the station that the circuit only opens when a request arrives, the trigger is the request, and the cold start is the out-lap, with cold tires and brakes. The queue is the pile of used tires awaiting analysis. Here the analogy stops: nothing in F1 is billed per request or scales from zero to thousands of copies in seconds.",
    ],
    pointsTitle: "The on-demand station",
    points: [
      {
        t: "Handler and trigger",
        d: "An entry point that reacts to an event.",
        color: "blue",
      },
      {
        t: "Cold start",
        d: "The first call after a while idle is slower.",
        color: "signal",
      },
      {
        t: "Lock-in",
        d: "Bindings, orchestration, and proprietary queues tie you to the provider.",
        color: "ember",
      },
    ],
    examplesTitle: "The same HTTP function",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `import json

def lambda_handler(event, context):                       # entry point: receives event and context
    params = event.get("queryStringParameters") or {}      # URL parameters, if any
    nome = params.get("nome", "mundo")                     # default: "mundo"
    return {                                               # format expected by API Gateway
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"mensagem": f"Olá, {nome}!"}, ensure_ascii=False),
    }`,
        note: "Lambda receives a dictionary and returns a dictionary.",
      },
      {
        label: "Azure",
        lang: "sh",
        code: `import json
import azure.functions as func

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)  # function app; no key required

@app.route(route="ola")                                    # exposes the function at /api/ola
def ola(req: func.HttpRequest) -> func.HttpResponse:       # entry point: receives the request
    nome = req.params.get("nome", "mundo")                 # URL parameter, default "mundo"
    corpo = json.dumps({"mensagem": f"Olá, {nome}!"}, ensure_ascii=False)
    return func.HttpResponse(corpo, mimetype="application/json", status_code=200)`,
        note: "Azure (addition), programming model v2: receives and returns typed objects.",
      },
      {
        label: "local handler",
        lang: "sh",
        code: `# Calls handler.py with a fake event, with no cloud
$ python3 -c "
import handler
print(handler.lambda_handler({'queryStringParameters': {'nome': 'Ana'}}, None))
"
{'statusCode': 200, 'headers': {'Content-Type': 'application/json'}, 'body': '{"mensagem": "Olá, Ana!"}'}
# Now without a parameter
$ python3 -c "import handler; print(handler.lambda_handler({}, None)['body'])"
{"mensagem": "Olá, mundo!"}`,
      },
    ],
    commands: [
      {
        cmd: 'aws lambda list-functions --query "Functions[].FunctionName" --output text',
        note: "Lambda functions",
      },
      {
        cmd: 'aws apigatewayv2 get-apis --query "Items[].Name" --output text',
        note: "HTTP and WebSocket APIs",
      },
      { cmd: "az functionapp list --output table", note: "function apps" },
      { cmd: "az apim list --output table", note: "API Management instances" },
    ],
    handsOnIntro:
      "Simulator on: the handler runs entirely on your machine with a fake event, before touching any circuit.",
    handsOn: [
      "Save the Lambda as handler.py and call it with Ana's fake event; then without a parameter.",
      "For Azure, the local path is Azure Functions Core Tools (func init and func start, at http://localhost:7071/api/ola); if you do not want to install it, read the code.",
      "Reading: list functions, APIs, function apps, and APIM instances.",
      "Optional: create a function through the console or portal (on Azure, inside rg-lab). There is a free tier, but the cost depends on consumption and the account.",
      "Cleanup: aws lambda delete-function --function-name <NOME-DA-FUNCAO> and az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "Very high and constant load, 24 hours a day, can end up more expensive in the on-demand model than on traditional infrastructure.",
    takeaway:
      "Serverless is paying for execution instead of idleness, at the price of tying yourself to each provider's event format.",
  },
  {
    id: "az8",
    num: "08",
    navTitle: "Monitoring and logs",
    tag: "CloudWatch x Azure Monitor",
    title: "Monitoring and logs (CloudWatch x Azure Monitor)",
    lead: "A metric says what, an event says when, a log says why. Set retention, alert only on what is actionable, and know how to query logs as a pipeline (Logs Insights or KQL).",
    concept: [
      "Metrics are numbers aggregated over time; logs are detailed records for debugging and auditing; events are state changes. Alarms trigger actions on metrics or logs, dashboards show everything in real time, and distributed tracing follows a request across several services. Irrelevant logs and indefinite retention generate cost.",
      "The AWS x Azure pairs (addition): CloudWatch x Azure Monitor; CloudWatch Logs (log groups) x Log Analytics workspace (tables); Logs Insights x KQL; CloudWatch Alarms x Azure Monitor Alerts with Action Groups; EventBridge x Event Grid; CloudWatch Agent x Azure Monitor Agent; X-Ray x Application Insights; CloudTrail x Activity Log.",
      "Where they really differ: on AWS, services such as Lambda send logs to CloudWatch automatically; on Azure, resource logs generally need diagnostic settings that say where to send them. Forgetting this is the classic where are my logs. Log Analytics brings several services into one workspace; on Azure the alert rule is separate from who to notify (the Action Group). And both languages are pipelines, not SQL.",
      "On track: telemetry is the metric, race control messages are the events, and the radio is the log. Viewers see the event (a car stopped on the straight); the why only shows up in the team's telemetry. Here the analogy stops: a sensor with its channel switched off would be an assembly error in F1; on Azure it is the default until you turn on the diagnostic settings.",
    ],
    pointsTitle: "The wall's three sources",
    points: [
      { t: "Metric", d: "What is happening: CPU, latency, requests.", color: "blue" },
      {
        t: "Event",
        d: "When something changed: instance restarted, function failed.",
        color: "signal",
      },
      { t: "Log", d: "Why it happened: the error's stack trace.", color: "ember" },
    ],
    examplesTitle: "The same question, two languages",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `fields @timestamp, @message        # chooses the fields to show
| filter @message like /500/       # keeps only lines containing "500"
| sort @timestamp desc             # most recent first
| limit 20                         # only 20 lines`,
        note: "CloudWatch Logs Insights: the time range is chosen on the screen or in the query call.",
      },
      {
        label: "Azure",
        lang: "sh",
        code: `AppRequests
| where TimeGenerated > ago(2h)
| where ResultCode == "500"
| project TimeGenerated, Name, Url
| order by TimeGenerated desc
| take 20`,
        note: "Azure (addition): KQL in Log Analytics, over the Application Insights requests table.",
      },
      {
        label: "CPU alarm",
        lang: "sh",
        code: `# AWS: alarm on an instance's CPU, 5-minute average, above 80
$ aws cloudwatch put-metric-alarm --alarm-name cpu-alta \\
  --namespace AWS/EC2 --metric-name CPUUtilization \\
  --dimensions Name=InstanceId,Value=<ID-DA-INSTANCIA> \\
  --statistic Average --period 300 --evaluation-periods 1 \\
  --threshold 80 --comparison-operator GreaterThanThreshold \\
  --alarm-actions <ARN-DO-TOPICO-SNS>
# Azure (addition): equivalent metric alert; the Action Group defines who is notified
$ az monitor metrics alert create --name cpu-alta --resource-group rg-lab \\
  --scopes <ID-DA-VM> \\
  --condition "avg Percentage CPU > 80" \\
  --window-size 5m --evaluation-frequency 1m \\
  --action <ID-DO-ACTION-GROUP>`,
        note: "Only create it if you have the monitored resource and a notification target.",
      },
    ],
    commands: [
      {
        cmd: "aws cloudwatch list-metrics --namespace AWS/EC2 --max-items 5",
        note: "available metrics",
      },
      {
        cmd: 'aws logs describe-log-groups --query "logGroups[].{nome:logGroupName,retencaoDias:retentionInDays}" --output table',
        note: "empty retention means indefinite",
      },
      {
        cmd: "az monitor log-analytics workspace list --output table",
        note: "Log Analytics workspaces",
      },
    ],
    handsOnIntro:
      "Telemetry on screen: a log pipeline built with the terminal alone, then reading in the cloud and, if there is something to monitor, a real alarm.",
    handsOn: [
      "Create an acesso.log with five lines and run grep \" 500\" acesso.log | awk '{print $3}' | sort | uniq -c | sort -rn: 2 /checkout and 1 /pedido.",
      "Reading: list metrics, log groups with retention, and Log Analytics workspaces.",
      'Translate to KQL: AppTraces | where Message contains "timeout" | summarize count() by bin(TimeGenerated, 5m).',
      "Optional: create the CPU alarm only if you have the Stage 04 VM and a notification target; it stays OK or Insufficient data until it receives data points.",
      "Cleanup: aws cloudwatch delete-alarms --alarm-names cpu-alta; az monitor metrics alert delete --name cpu-alta --resource-group rg-lab and az group delete.",
    ],
    tip: "Turned on a service on Azure and see no logs in the workspace? Check the resource's diagnostic settings first.",
    takeaway:
      "A metric says what, an event says when, a log says why; defined retention and actionable alerts.",
  },
  {
    id: "az9",
    num: "09",
    navTitle: "Delivery and objects",
    tag: "CloudFront and S3 x Front Door and Blob",
    title: "Content delivery, load balancing, and objects",
    lead: "The CDN brings content closer, the load balancer distributes, object storage keeps things cheaply. On Azure, the unique name lives in the storage account, not in the container.",
    concept: [
      "The CDN keeps static content on edge servers close to the user: performance, availability, scalability, and security, with TTL control. The load balancer distributes requests with health checks, at layer 4 (TCP and UDP) or layer 7 (HTTP, by URL and header). Object storage keeps data under a unique key through a REST API, with storage classes, signed URLs, and versioning.",
      "The AWS x Azure pairs (addition): CloudFront x Azure Front Door; ALB x Application Gateway; NLB x Azure Load Balancer; S3 x Blob Storage in a storage account; S3 Standard, IA, and Glacier x Hot, Cool, Cold, and Archive tiers; presigned URL x SAS; AWS Shield and WAF x Azure DDoS Protection and Azure WAF.",
      "Where they really differ: an S3 bucket name is unique across all of AWS; on Azure, the globally unique name is the storage account's, and containers are only unique inside it. On Azure, the Owner does not read blobs through Entra ID without a data role such as Storage Blob Data Contributor. Application Gateway lives in a dedicated VNet subnet; Front Door is global at the edge. The cold tiers have their own rules and minimum periods.",
      "On track: object storage is the central warehouse, the CDN is the forward parts depots, and the load balancer is the pit lane entry control, closing the pit box that has a problem. The signed URL is the one-day guest pass. The podium video requested by someone in Fortaleza comes from the nearest depot, not from the factory.",
    ],
    pointsTitle: "The request's path",
    points: [
      { t: "CDN", d: "A copy close to the user, governed by the TTL.", color: "blue" },
      {
        t: "Layer 4 x 7",
        d: "Routing by URL needs layer 7: ALB or Application Gateway.",
        color: "signal",
      },
      {
        t: "Namespace",
        d: "Unique bucket on AWS; unique storage account on Azure.",
        color: "ember",
      },
    ],
    examplesTitle: "The static site, from storage to delivery",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Creates a bucket (the name is unique worldwide, across all of AWS)
$ aws s3 mb s3://<NOME-UNICO-DO-BUCKET> --region sa-east-1
# Uploads a file and lists the content
$ echo "<h1>Olá, nuvem</h1>" > index.html
$ aws s3 cp index.html s3://<NOME-UNICO-DO-BUCKET>/index.html
$ aws s3 ls s3://<NOME-UNICO-DO-BUCKET>/
# Generates a signed URL that expires in 300 seconds (the safe way to share)
$ aws s3 presign s3://<NOME-UNICO-DO-BUCKET>/index.html --expires-in 300`,
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (addition): the storage account has a globally unique name, with no anonymous public access
$ az group create --name rg-lab --location brazilsouth
$ az storage account create --name st<NOME-UNICO> --resource-group rg-lab \\
  --location brazilsouth --sku Standard_LRS --kind StorageV2 \\
  --allow-blob-public-access false
# To operate on data with your identity, you need a DATA role
$ az role assignment create --assignee <SEU-E-MAIL> --role "Storage Blob Data Contributor" \\
  --scope $(az storage account show -n st<NOME-UNICO> -g rg-lab --query id -o tsv)
$ az storage container create --account-name st<NOME-UNICO> --name site --auth-mode login
$ az storage blob upload --account-name st<NOME-UNICO> --container-name site \\
  --name index.html --file index.html --auth-mode login
# The equivalent of the signed URL is a user delegation SAS (validity: 1 day, in UTC)
$ az storage blob generate-sas --account-name st<NOME-UNICO> --container-name site \\
  --name index.html --permissions r --expiry $(date -u -d '+1 day' '+%Y-%m-%dT%H:%MZ') \\
  --auth-mode login --as-user --full-uri`,
        note: "New permissions can take a few minutes to take effect. On macOS, use $(date -u -v+1d '+%Y-%m-%dT%H:%MZ').",
      },
      {
        label: "headers and 304",
        lang: "sh",
        code: `$ mkdir -p site && echo "<h1>Olá</h1>" > site/index.html
# Local file server, serving the site folder
$ python3 -m http.server --directory site 8000 &
$ sleep 1
$ curl -sI localhost:8000/index.html
# No Cache-Control: that is why you are the one who configures the TTL on the CDN
# Resends the request saying "only send me if it changed since Last-Modified"
$ LM=$(curl -sI localhost:8000/index.html | grep -i '^Last-Modified' | cut -d' ' -f2- | tr -d '\\r')
$ curl -sI -H "If-Modified-Since: $LM" localhost:8000/index.html | head -1
HTTP/1.0 304 Not Modified`,
        note: "The 304 is the validation mechanism that allows a cached copy to be reused.",
      },
    ],
    commands: [
      { cmd: "aws s3 ls", note: "your buckets" },
      {
        cmd: 'aws elbv2 describe-load-balancers --query "LoadBalancers[].{nome:LoadBalancerName,tipo:Type}" --output table',
        note: "load balancers and type",
      },
      { cmd: "az storage account list --output table", note: "storage accounts" },
      {
        cmd: "az network application-gateway list --output table",
        note: "Application Gateways",
      },
    ],
    handsOnIntro:
      "Bench switched on, with no cloud: serve a folder, read the headers, and watch the 304 happen. Cloud creation costs cents, if you delete it the same day.",
    handsOn: [
      "Run the local server, inspect the headers, and trigger the 304 Not Modified with If-Modified-Since.",
      "Reading: list buckets, load balancers, storage accounts, Application Gateways, and Azure Load Balancers.",
      "Optional (cents, if you delete it the same day): create the bucket and the storage account, upload index.html, and list.",
      "Generate the signed URL and the SAS, open the link, and confirm that it expires.",
      "Cleanup: kill %1 and rm -rf site index.html; aws s3 rm --recursive and aws s3 rb on the bucket; az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "Backups older than a year that are rarely read go to cold tiers: S3 IA or Glacier, Cool, Cold, or Archive, watching cost and access time.",
    takeaway:
      "The CDN brings content closer, the load balancer distributes, and object storage keeps things cheaply; on Azure, the unique name is the storage account's.",
  },
  {
    id: "az10",
    num: "10",
    navTitle: "Secrets, WAF, and DNS",
    tag: "Secrets Manager x Key Vault",
    title: "Secrets, WAF, certificates, and DNS",
    lead: "Secret in the vault, traffic filtered by the WAF, certificate renewed by machine, and DNS with a routing policy. On Azure, the vault brings together secrets, keys, and certificates.",
    concept: [
      "A secrets vault stores passwords and tokens with controlled access, auditing, versioning, and rotation. The key service encrypts data at rest. The WAF analyzes HTTP traffic at layer 7 (SQL injection, rate limiting, country blocking). TLS certificates should have automated issuance, validation, and renewal. DNS translates names into IPs, with TTL, public and private zones, and routing policies.",
      "The AWS x Azure pairs (addition): Secrets Manager x Key Vault (secrets); KMS x Key Vault (keys) and Managed HSM; AWS WAF x Azure WAF; ACM x App Service and Front Door managed certificates and Key Vault certificates; Route 53 x Azure DNS and Private DNS; Latency, Geolocation, Failover, and Weighted policies x Traffic Manager Performance, Geographic, Priority, and Weighted.",
      "Where they really differ: Key Vault stores secrets, keys, and certificates in a single service, with its own authorization model; on AWS they are three services. Secrets Manager brings native rotation for some services; on Azure it is assembled with events and automation, or avoided with Managed Identity. Route 53 also registers domains; Azure DNS does not. On both, start the WAF in detection mode.",
      "On track: the combination vault hands over the combination on the spot to whoever has a pass, the WAF is the marshal who opens the bag, the certificate is the Super Licence that expires, and DNS is the entry list. Here the analogy stops: a stolen combination is just one; a leaked secret may have been copied without limit and must be revoked and replaced. And a domain can have more than one valid certificate.",
    ],
    pointsTitle: "The four layers",
    points: [
      { t: "Vault", d: "Secret out of the code, with minimum permission.", color: "blue" },
      {
        t: "Managed certificate",
        d: "Automatic renewal takes the risk out of human hands.",
        color: "signal",
      },
      { t: "DNS routing", d: "Latency, geographic, failover, and weighted.", color: "ember" },
    ],
    examplesTitle: "Storing and reading a secret",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Creates a secret and reads it back
$ aws secretsmanager create-secret --name lab/senha-banco --secret-string 'S3nh@Forte'
$ aws secretsmanager get-secret-value --secret-id lab/senha-banco --query SecretString --output text
S3nh@Forte`,
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (addition): vault with a globally unique name and permissions via Azure RBAC
$ az group create --name rg-lab --location brazilsouth
$ az keyvault create --name kv-<NOME-UNICO> --resource-group rg-lab --location brazilsouth \\
  --enable-rbac-authorization true
# Your user needs a data role on the vault to write and read secrets
$ az role assignment create --assignee <SEU-E-MAIL> --role "Key Vault Secrets Officer" \\
  --scope $(az keyvault show -n kv-<NOME-UNICO> --query id -o tsv)
$ az keyvault secret set --vault-name kv-<NOME-UNICO> --name senha-banco --value 'S3nh@Forte'
$ az keyvault secret show --vault-name kv-<NOME-UNICO> --name senha-banco --query value -o tsv
S3nh@Forte`,
        note: "Not even the subscription owner opens the vault without the data role. New permissions can take a few minutes.",
      },
      {
        label: "DNS and certificate",
        lang: "sh",
        code: `# The number between the name and "IN" is the TTL
$ dig +noall +answer example.com A
# The domain's authoritative name servers
$ dig +short example.com NS
# Who issued the certificate and its validity (notBefore/notAfter)
$ openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null \\
  | openssl x509 -noout -subject -issuer -dates`,
        note: "notAfter is exactly the deadline that a managed certificate service should renew for you.",
      },
    ],
    commands: [
      {
        cmd: 'aws secretsmanager list-secrets --query "SecretList[].Name" --output text',
        note: "existing secrets",
      },
      {
        cmd: 'aws acm list-certificates --query "CertificateSummaryList[].DomainName" --output text',
        note: "ACM certificates",
      },
      { cmd: "az keyvault list --output table", note: "Key Vault vaults" },
      { cmd: "az network dns zone list --output table", note: "Azure DNS zones" },
    ],
    handsOnIntro:
      "Pit lane open: DNS and certificates read straight from the terminal, then the secret stored and read back in both vaults.",
    handsOn: [
      "Run dig and openssl against example.com and note the TTL and the notAfter date.",
      "Reading: list secrets, certificates, hosted zones, web ACLs, and vaults on both providers.",
      "Optional (very low cost): create the secret and read it back on both. Hosted zones have a monthly cost: use them with care.",
      "Answer: users in Europe and Brazil with failover call for Latency on Route 53 or Performance on Traffic Manager.",
      "Cleanup: aws secretsmanager delete-secret --secret-id lab/senha-banco --force-delete-without-recovery; az group delete --name rg-lab --yes and az keyvault purge --name kv-<NOME-UNICO> because of soft delete.",
    ],
    tip: "The best password is the one that does not exist: IAM Role and Managed Identity remove the secret at the source.",
    takeaway:
      "Secret in the vault, traffic filtered by the WAF, certificate renewed by machine, and DNS with a routing policy.",
  },
  {
    id: "az11",
    num: "11",
    navTitle: "Certifications",
    tag: "study and career",
    title: "AWS Academy, study, and certifications (and the Microsoft path)",
    lead: "Certification validates, the lab teaches, and both need updating: names, prices, and catalogs change, so always check the official site.",
    concept: [
      "A cloud certification is an exam given by the provider itself, with entry, intermediate, advanced, and specialty levels. It is not required by law, but it becomes a selection criterion in many job openings. Educational programs offer labs in a temporary environment, at no cost to a personal account. Preparation combines practice, documentation, practice exams, and review of each mistake, and the journey calls for recertification.",
      "As in the material (June 2025): Foundational (Cloud Practitioner) with 90 minutes and 100 dollars; Associate with 90 minutes and 150 dollars; Professional and Specialty with 170 minutes and 300 dollars. On the Microsoft side (addition, an approximate and unofficial comparison): AZ-900 at entry, AZ-104 for administration, AZ-204 for development, AZ-305 for architecture, and AZ-400 for DevOps. Check everything on the official site before planning.",
      "Where they really differ: many AWS certifications are organized by level (Foundational, Associate, Professional, Specialty); Microsoft organizes by role and by level (Fundamentals, Associate, Expert, Specialty), and Expert titles require an Associate as a prerequisite. On both sides the catalogs are reorganized periodically: this content is not a source for the current list.",
      "On track: the levels are the feeder series (F4, F3, F2, and F1), the educational program is the factory simulator, and recertification is the rulebook that changes every season. A race strategy is revised every lap based on telemetry; the study plan is corrected the same way, by the results of the practice exams.",
    ],
    pointsTitle: "Moving up a category",
    points: [
      { t: "As in the material", d: "2025 numbers: check the official site.", color: "ember" },
      {
        t: "Lab",
        d: "AWS Academy and Microsoft Learn sandboxes, with no personal bill.",
        color: "blue",
      },
      {
        t: "Practice exam and mistake",
        d: "Run the lap, find where you lost time, study that stretch.",
        color: "signal",
      },
    ],
    examplesTitle: "The final round on both accounts",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Run it in the region where you practiced; each empty line is good news
$ export AWS_DEFAULT_REGION=sa-east-1
# EC2 instances that were not terminated (stopped ones also charge for the disk)
$ aws ec2 describe-instances --query "Reservations[].Instances[?State.Name!='terminated'].[InstanceId,State.Name]" --output text
# Route 53 hosted zones (charge monthly)
$ aws route53 list-hosted-zones --query "HostedZones[].[Id,Name]" --output text
# EBS volumes (including loose ones, without an instance)
$ aws ec2 describe-volumes --query "Volumes[].[VolumeId,State,Size]" --output text
# DynamoDB tables and secrets created in Stages 06 and 10
$ aws dynamodb list-tables --query TableNames --output text
$ aws secretsmanager list-secrets --query "SecretList[].Name" --output text`,
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (addition): all resources and groups in the subscription
$ az resource list --output table
$ az group list --query "[].name" --output tsv
# If something you created still appears, delete it or use az group delete
$ az group delete --name rg-lab --yes --no-wait`,
      },
    ],
    commands: [
      {
        cmd: "aws eks list-clusters --query clusters --output text",
        note: "control plane and nodes charge by the hour",
      },
      {
        cmd: 'aws ec2 describe-addresses --query "Addresses[].[PublicIp,AllocationId,InstanceId]" --output text',
        note: "public IPv4 charges, associated or not",
      },
      { cmd: "aws s3 ls", note: "leftover buckets" },
      {
        cmd: "az keyvault list-deleted --output table",
        note: "deleted vaults that still reserve the name",
      },
    ],
    handsOnIntro:
      "Planning lap: one profile, the exam guides on both sides, a cross-reference with the stages, and one lab session per week.",
    handsOn: [
      "Choose one profile: administration, development, architecture, or DevOps.",
      "Open on each provider's official site the entry certification and the next level, and note the exam guide and the exam languages.",
      "Cross-reference each exam domain with the stage of this guide (01 to 10) that covers it, with practice done and a review date.",
      "Schedule one lab session per week on a free resource (AWS Academy, Microsoft Learn, or a free account, whose rules change).",
      "Before ending the day, do the cleanup round on both accounts and delete whatever was left running.",
    ],
    tip: "Back-end developer: Cloud Practitioner and AZ-900 as entry, then Developer Associate and AZ-204, checking the current catalogs.",
    takeaway:
      "Certification validates, the lab teaches, and names, prices, and catalogs change: the source is always the official site.",
  },
];
