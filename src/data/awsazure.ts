// Conteúdo das onze aulas da disciplina "AWS" (DevOps e Arquitetura Cloud, Fase 1), uma etapa por aula,
// com AWS e Azure lado a lado (todo o conteúdo Azure é acréscimo didático do professor),
// tematizado com Fórmula 1 pelo pipeline /otimizar-relatorio (relatorios/aws-azure/final.md).

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
    tema: "Provedor de nuvem (AWS ou Azure)",
    f1: "O circuito: instalações próprias, e o procedimento da equipe é o mesmo nos dois",
  },
  {
    tema: "Região e zona de disponibilidade",
    f1: "A cidade-sede onde o circuito tem instalações, e os prédios de garagens fisicamente separados dentro dela, cada um com energia e rede próprias",
  },
  {
    tema: "Conta AWS e assinatura Azure",
    f1: "O contrato da equipe com o circuito: instalações, acessos e fatura isolados das outras equipes",
  },
  {
    tema: "Responsabilidade compartilhada",
    f1: "O circuito cuida de pista, barreiras e energia; a equipe cuida do carro, da garagem e de quem entra nela",
  },
  {
    tema: "Identidade e permissão (IAM, Entra ID e Azure RBAC)",
    f1: "O passe: cada pessoa com o seu, abrindo só as áreas de que ela precisa, e a catraca registrando tudo",
  },
  {
    tema: "Rede virtual (VPC, VNet) e firewalls",
    f1: "A área cercada da equipe no paddock: setores, portões para a rua e fiscais nas portas",
  },
  {
    tema: "Máquina virtual (EC2, Azure VM)",
    f1: "Uma garagem completa, com gerador e sistemas próprios (o sistema operacional inteiro)",
  },
  {
    tema: "Container, Pod e orquestrador (EKS, AKS)",
    f1: "O carro montado a partir da especificação, e o muro que mantém na pista quantos carros a ficha pede",
  },
  {
    tema: "Serverless (Lambda, Azure Functions)",
    f1: "A estação que o circuito só abre quando chega um pedido; a primeira chamada fria é a volta de saída",
  },
  {
    tema: "Métricas, eventos e logs (CloudWatch, Azure Monitor)",
    f1: "A telemetria, as mensagens do controle de corrida e o rádio com o registro do carro",
  },
  {
    tema: "CDN, balanceador e armazenamento de objetos",
    f1: "Os postos avançados de peças, a entrada do pit lane e o almoxarifado central",
  },
  {
    tema: "Segredos, certificados e DNS",
    f1: "O cofre de combinações, a superlicença com validade e a lista de inscritos",
  },
];

export const ANALOGY_NOTES: string[] = [
  "O circuito não se escolhe: o calendário decide onde a equipe corre. Na nuvem, a escolha do provedor é sua, e dá para usar os dois ao mesmo tempo.",
  "Escala: a F1 tem dois carros por equipe e uma garagem por circuito. Na nuvem você sobe uma, cinquenta ou cinco mil máquinas e apaga todas em minutos.",
  "Cobrança por uso: nenhuma instalação de circuito cobra por segundo de uso. A nuvem cobra, e é por isso que a limpeza no fim de cada prática importa.",
  "Cópia não é peça: uma peça física existe numa unidade; imagem, objeto e segredo podem ser copiados sem limite. Por isso um segredo vazado precisa ser revogado e trocado, não só recolhido.",
  "O teto de gastos pune; o orçamento avisa. O alerta de orçamento (AWS Budgets, Cost Management) avisa quando o gasto passa do limite, mas não desliga nada sozinho.",
  "Mesmo papel, modelos diferentes: uma analogia vale para o par AWS x Azure, mas as diferenças de modelo de cada etapa continuam valendo. Uma linha na tabela de equivalência não é promessa de paridade.",
];

export const LESSONS: Lesson[] = [
  {
    id: "az1",
    num: "01",
    navTitle: "Introdução à nuvem",
    tag: "regiões, contas e custo",
    title: "Introdução à nuvem, com AWS e Azure",
    lead: "Nuvem é capacidade sob demanda cobrada por uso, organizada em regiões e zonas, com segurança dividida entre provedor e cliente. AWS e Azure oferecem os mesmos blocos com nomes e modelos de organização diferentes.",
    concept: [
      "No modelo on-premises, o varejista compra servidores extras para a Black Friday e eles ficam encostados depois. A nuvem oferece processamento, armazenamento e rede sob demanda (pay-as-you-go), com elasticidade, organizada em regiões e, dentro delas, em zonas de disponibilidade: data centers fisicamente separados, ligados por rede rápida. O provedor cuida da segurança da nuvem; você cuida da segurança na nuvem. As modalidades de compra são sob demanda, reservado (1 ou 3 anos), spot (interrompível) e planos de gasto.",
      "Os pares AWS x Azure (acréscimo): conta AWS x subscription dentro de um tenant Microsoft Entra; AWS Organizations x Management Groups; a região São Paulo é sa-east-1 de um lado e brazilsouth do outro; aws x az na linha de comando; CloudFormation x ARM templates e Bicep; AWS Budgets x Microsoft Cost Management; Well-Architected com seis pilares x Azure Well-Architected Framework com cinco.",
      "Onde eles diferem de verdade: na AWS, a conta junta identidade, recursos e fatura; no Azure, a identidade vive no tenant e a cobrança e os recursos vivem em subscriptions. O Resource Group não tem par exato na AWS: todo recurso Azure pertence a um, e apagar o grupo apaga tudo dentro. E as zonas mudam de papel: na AWS cada sub-rede nasce presa a uma zona; no Azure a zona é um atributo escolhido por recurso.",
      "Na pista: o provedor é o circuito, a região é a cidade-sede (sa-east-1 e brazilsouth ficam no estado de São Paulo) e cada zona é um prédio de garagens com energia e rede próprias. Espalhar a aplicação entre zonas é não deixar os dois carros dependendo do mesmo gerador. O alerta de orçamento é a versão pessoal do teto de gastos, com uma diferença: o cost cap pune, o alerta só avisa.",
    ],
    pointsTitle: "O painel desta etapa",
    points: [
      {
        t: "Região e zona",
        d: "Região atende latência e localização de dados; várias zonas toleram falhas.",
        color: "blue",
      },
      {
        t: "Responsabilidade compartilhada",
        d: "O provedor protege a nuvem; você protege configuração, dados e acessos.",
        color: "signal",
      },
      {
        t: "Orçamento antes de tudo",
        d: "Alerta de gasto armado antes da primeira criação, nos dois provedores.",
        color: "ember",
      },
    ],
    examplesTitle: "Descobrindo onde você está",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Mostra a identidade que está autenticada e a conta (não cria nada)
$ aws sts get-caller-identity
{
    "UserId": "AIDAEXAMPLEID",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/ana.dev"
}
# Lista as zonas de disponibilidade de uma região
$ aws ec2 describe-availability-zones --region sa-east-1 \\
  --query "AvailabilityZones[].ZoneName" --output text
sa-east-1a sa-east-1b sa-east-1c`,
        note: "As saídas são exemplos: IDs, datas e nomes variam na sua conta.",
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (acréscimo): autentica no navegador (uma vez por sessão)
$ az login
# Mostra a assinatura ativa e o tenant (não cria nada)
$ az account show --output table
# Lista as regiões disponíveis para a sua assinatura
$ az account list-locations --query "[].name" --output tsv`,
        note: "Saída: um nome por linha, incluindo brazilsouth e eastus.",
      },
      {
        label: "rg-lab",
        lang: "sh",
        code: `# Azure (acréscimo): cria um agrupador vazio (custo praticamente nulo)
$ az group create --name rg-lab --location brazilsouth
# Saída esperada: JSON com "provisioningState": "Succeeded"
# Limpeza: apaga o grupo e tudo que existir dentro dele
$ az group delete --name rg-lab --yes --no-wait
# Antes de recriar o rg-lab na próxima etapa, espere a deleção terminar
$ az group wait --deleted --name rg-lab`,
        note: "Na AWS não há equivalente necessário: nada é criado nesta etapa.",
      },
    ],
    commands: [
      { cmd: "aws sts get-caller-identity", note: "quem sou eu e em qual conta" },
      {
        cmd: 'aws ec2 describe-regions --query "Regions[].RegionName" --output text',
        note: "regiões habilitadas na conta",
      },
      { cmd: "az account show --output table", note: "assinatura ativa e tenant" },
      {
        cmd: 'az account list-locations --query "[].name" --output tsv',
        note: "regiões disponíveis na assinatura",
      },
    ],
    handsOnIntro:
      "Primeira saída do box: confirmar o contrato, armar o alarme do teto de gastos e, se quiser, montar a garagem rg-lab.",
    handsOn: [
      "Rode os comandos de leitura no provedor que você tem e anote o número da conta ou o ID da assinatura.",
      "Confirme que sa-east-1 e brazilsouth são a região São Paulo de cada um e conte quantas zonas a AWS lista para sa-east-1.",
      "Crie um orçamento mensal baixo com alerta por e-mail no AWS Budgets e no Cost Management. Criar recursos gera cobrança mesmo em conta gratuita, e as regras de free tier mudam: confira a oferta vigente no site oficial.",
      "Opcional: crie o rg-lab com az group create (custo praticamente nulo).",
      "Limpeza: az group delete --name rg-lab --yes --no-wait e, antes de recriá-lo, az group wait --deleted --name rg-lab.",
    ],
    tip: "Antes de mexer em qualquer coisa, rode aws sts get-caller-identity e az account show. Errar de conta é montar o carro na garagem do vizinho.",
    takeaway:
      "Nuvem é capacidade sob demanda cobrada por uso, organizada em regiões e zonas, com segurança dividida entre provedor e cliente.",
  },
  {
    id: "az2",
    num: "02",
    navTitle: "Identidade e acesso",
    tag: "IAM x Entra ID + RBAC",
    title: "Identidade e acesso (IAM x Entra ID + Azure RBAC)",
    lead: "Dê a cada identidade o mínimo necessário e prefira identidade temporária de máquina a chave em código. Na AWS o escopo mora dentro da policy; no Azure, na atribuição da role.",
    concept: [
      "Autenticação responde quem é você; autorização responde o que você pode fazer. O menor privilégio dá a cada identidade só o necessário. Usuários individuais com MFA, agrupados em grupos; serviços assumem identidades temporárias em vez de chaves gravadas em código; a conta raiz fica protegida com MFA; toda ação é auditada. Em 2019, segundo o material, a Capital One vazou dados de mais de 100 milhões de clientes por permissões excessivas, uma falha de configuração do cliente.",
      "Os pares AWS x Azure (acréscimo): IAM x Microsoft Entra ID; políticas IAM em JSON x Azure RBAC (role atribuída a uma identidade em um escopo); IAM Role x Managed Identity; AWS Organizations e SCP x Management Groups e Azure Policy (aproximação); CloudTrail x Activity Log; GuardDuty x Microsoft Defender for Cloud.",
      "Onde eles diferem de verdade: a policy da AWS carrega efeito, ação, recurso e condição, e um Deny explícito vence qualquer Allow. No Azure, a role define só ações; o recurso vem do escopo da atribuição, e o RBAC é aditivo: bloqueios vêm de Azure Policy, deny assignments ou resource locks. A SCP é um teto de permissões; a Azure Policy avalia propriedades dos recursos. E o Azure separa Actions (gerenciar) de DataActions (ler e gravar dados): Owner não lê blobs só por isso.",
      "Na pista: cada pessoa tem o próprio passe, que abre só as áreas de que precisa, e a catraca registra tudo. A identidade de máquina é o passe preso ao equipamento, renovado sozinho, sem papel para perder. A SCP é a regra da matriz: um grupo dono de duas equipes pode proibir algo para as duas, e nenhum chefe de equipe consegue liberar o que a matriz vetou. E ser dono da garagem não dá acesso aos dados do carro.",
    ],
    pointsTitle: "Os passes do paddock",
    points: [
      {
        t: "Menor privilégio",
        d: "Ninguém com passe de pit lane por via das dúvidas.",
        color: "blue",
      },
      {
        t: "Identidade de máquina",
        d: "IAM Role e Managed Identity dispensam chave no código.",
        color: "signal",
      },
      {
        t: "Deny x aditivo",
        d: "Na AWS o Deny vence tudo; no Azure RBAC as permissões só se somam.",
        color: "ember",
      },
    ],
    examplesTitle: "A mesma regra nos dois modelos",
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
        note: "Policy IAM do material: enviar objetos só de um IP, com MFA e dentro de uma janela de horário.",
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
        note: "Azure (acréscimo): a role descreve só o que e onde pode ser atribuída. IP e MFA ficam no Conditional Access; prazo limitado, no PIM.",
      },
      {
        label: "SCP x Azure Policy",
        lang: "sh",
        code: `# AWS: SCP que nega EC2 em toda a organização, mesmo que o IAM de uma conta permita
{
  "Version": "2012-10-17",
  "Statement": [{ "Effect": "Deny", "Action": "ec2:*", "Resource": "*" }]
}
# Azure (acréscimo): regra de Azure Policy que nega a criação de máquinas virtuais no escopo
{
  "if":   { "field": "type", "equals": "Microsoft.Compute/virtualMachines" },
  "then": { "effect": "deny" }
}`,
        note: "A SCP limita permissões; a Azure Policy barra tipos e configurações de recursos. Não são traduções exatas.",
      },
    ],
    commands: [
      {
        cmd: 'aws iam list-users --query "Users[].UserName" --output text',
        note: "usuários IAM (se tiver permissão)",
      },
      {
        cmd: 'aws iam list-groups --query "Groups[].GroupName" --output text',
        note: "grupos IAM",
      },
      {
        cmd: "az role assignment list --assignee <SEU-E-MAIL> --all -o table",
        note: "suas atribuições de role em todos os escopos",
      },
      {
        cmd: 'az role definition list --name "Reader" -o json',
        note: "o que a role built-in Reader permite",
      },
    ],
    handsOnIntro:
      "Pit lane aberto: confira os passes que já existem, valide uma policy sem nuvem e, se quiser, crie um grupo de leitura nos dois circuitos.",
    handsOn: [
      "Leitura: rode os comandos acima e observe se você usa um usuário individual ou a raiz (a raiz deve ser evitada).",
      "Salve a policy de leitura do material em politica.json e valide com python3 -m json.tool politica.json.",
      "Opcional e gratuito: na AWS, crie o grupo estudo-leitores com a política ReadOnlyAccess; no Azure, crie o grupo no Entra ID e atribua a role Reader no rg-lab (criar grupos exige permissão no tenant).",
      "Leia uma role definition e diga quais Actions e DataActions ela concede, e onde pode ser atribuída.",
      "Limpeza: aws iam detach-group-policy e aws iam delete-group; az ad group delete --group estudo-leitores e az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "Os comentários // dos JSON do relatório são didáticos: JSON real não os aceita. Remova-os antes de usar em az role definition create ou numa policy.",
    takeaway:
      "Mínimo necessário para cada identidade, passe de máquina no lugar de chave em código; o escopo mora na policy (AWS) ou na atribuição (Azure).",
  },
  {
    id: "az3",
    num: "03",
    navTitle: "Redes",
    tag: "VPC x VNet",
    title: "Redes (VPC x VNet)",
    lead: "Rede na nuvem é rota mais firewall: a sub-rede é pública por causa da rota, e o NSG do Azure faz sozinho o que o par Security Group e NACL faz na AWS.",
    concept: [
      "Uma rede virtual é um bloco de IPs privados em CIDR (10.0.0.0/16 tem 65.536 endereços), fatiado em sub-redes por finalidade. Pública ou privada quem decide é a rota: se 0.0.0.0/0 sai por um gateway de internet, é pública. Sub-redes privadas saem via NAT, só saída. Há firewalls stateful e stateless; redes se conectam por peering (não transitivo), hub, VPN ou link dedicado.",
      "Os pares AWS x Azure (acréscimo): VPC x VNet; Internet Gateway x IP público no recurso; NAT Gateway nos dois; Security Group x NSG; NACL x NSG associado à sub-rede; VPC Peering x VNet Peering; Transit Gateway x Virtual WAN; Direct Connect x ExpressRoute; VPC Endpoint x Private Endpoint e Service Endpoint; VPC Flow Logs x NSG e VNet flow logs.",
      "Onde eles diferem de verdade: na AWS a sub-rede fica presa a uma zona; no Azure ela atravessa a região. A AWS separa Security Group (stateful, só permite) de NACL (stateless, permite e nega, por número); o NSG é stateful, aceita Allow e Deny por prioridade e se associa à NIC, à sub-rede ou aos dois. Falso amigo: ASG no Azure é Application Security Group. E o Azure não tem recurso equivalente ao Internet Gateway.",
      "Na pista: a rede é a área cercada da equipe no paddock, cada sub-rede é um setor e o NAT é o mensageiro que sai e volta. A AWS põe dois fiscais (um na porta de cada garagem, outro na catraca do setor); o Azure usa um fiscal só, com memória, que autoriza e proíbe. Peering é a passagem direta entre duas áreas que não leva a uma terceira.",
    ],
    pointsTitle: "Rota e fiscais",
    points: [
      {
        t: "A rota decide",
        d: "Sem rota para o gateway de internet, a sub-rede é privada.",
        color: "blue",
      },
      {
        t: "Um fiscal ou dois",
        d: "Security Group e NACL na AWS; NSG faz as duas coisas no Azure.",
        color: "ember",
      },
      {
        t: "Peering não transita",
        d: "Para muitas redes, use hub: Transit Gateway ou Virtual WAN.",
        color: "signal",
      },
    ],
    examplesTitle: "O desenho clássico: 10.0.0.0/16 com web e banco",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Mostra suas VPCs; a de "padrao: True" é a default (não use em projetos sérios)
$ aws ec2 describe-vpcs --query "Vpcs[].{id:VpcId,cidr:CidrBlock,padrao:IsDefault}" --output table
# Cria a VPC e as duas sub-redes do desenho (anote os IDs retornados)
$ aws ec2 create-vpc --cidr-block 10.0.0.0/16
$ aws ec2 create-subnet --vpc-id <ID-DA-VPC> --cidr-block 10.0.1.0/24 --availability-zone sa-east-1a
$ aws ec2 create-subnet --vpc-id <ID-DA-VPC> --cidr-block 10.0.2.0/24 --availability-zone sa-east-1a
# Sem Internet Gateway e sem rota para ele, as duas ainda são privadas`,
        note: "A rede em si não gera cobrança; NAT Gateway, VPN e IPs públicos geram.",
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (acréscimo): recria o grupo e cria a VNet já com a primeira sub-rede, e depois a segunda
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
        code: `# AWS: Security Group com entrada na porta 22 só do seu IP (a resposta sai sozinha: stateful)
$ aws ec2 create-security-group --group-name sg-lab --description "lab" --vpc-id <ID-DA-VPC>
$ aws ec2 authorize-security-group-ingress --group-id <ID-DO-SG> \\
  --protocol tcp --port 22 --cidr 203.0.113.10/32
# Azure (acréscimo): NSG com regra de entrada; a prioridade (100 a 4096) define a ordem
$ az network nsg create --resource-group rg-lab --name nsg-lab
$ az network nsg rule create --resource-group rg-lab --nsg-name nsg-lab \\
  --name permitir-ssh --priority 100 --direction Inbound --access Allow \\
  --protocol Tcp --destination-port-ranges 22 --source-address-prefixes 203.0.113.10/32`,
        note: "O NSG lê as regras da menor prioridade para a maior e para na primeira que se aplica.",
      },
    ],
    commands: [
      {
        cmd: 'aws ec2 describe-subnets --query "Subnets[].{id:SubnetId,az:AvailabilityZone,cidr:CidrBlock}" --output table',
        note: "cada sub-rede mostra UMA zona",
      },
      {
        cmd: 'aws ec2 describe-route-tables --query "RouteTables[].Routes[].GatewayId" --output text',
        note: "procure igw-...: a rota que torna a sub-rede pública",
      },
      { cmd: "az network vnet list --output table", note: "suas VNets" },
      { cmd: "az network nsg list --output table", note: "NSGs existentes" },
    ],
    handsOnIntro:
      "Volta de instalação: começa na calculadora, sem nuvem, e só depois vem a leitura e a criação sem custo.",
    handsOn: [
      "Com o módulo ipaddress do Python, confirme que 10.0.0.0/16 tem 65.536 endereços e cabe 256 sub-redes /24.",
      "Leitura: descubra na AWS qual sub-rede tem rota para igw-... e, no Azure, a quais sub-redes ou NICs cada NSG está associado.",
      "Opcional e gratuito (sem NAT Gateway nem IP público): crie a VPC, as sub-redes, o Security Group e o NSG, e liste de novo.",
      "Responda: para bloquear um IP malicioso na sub-rede inteira, NACL na AWS e regra Deny num NSG associado à sub-rede no Azure.",
      "Limpeza na ordem dos dependentes: delete-security-group, delete-subnet (duas vezes) e delete-vpc; no Azure, az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "Planeje o CIDR antes: blocos sobrepostos com a rede da empresa deixam o roteamento ambíguo e a VPN não funciona.",
    takeaway:
      "Rede na nuvem é rota mais firewall; a rota torna a sub-rede pública, e o NSG reúne o que Security Group e NACL separam.",
  },
  {
    id: "az4",
    num: "04",
    navTitle: "Máquinas virtuais",
    tag: "EC2 x Azure VM",
    title: "Máquinas virtuais (EC2 x Azure Virtual Machines)",
    lead: "VM é aluguel de servidor por tempo: escolha o tamanho pela carga, padronize com imagens, escale por regra e lembre que disco e IP cobram mesmo com a máquina parada.",
    concept: [
      "Uma máquina virtual tem sistema operacional, rede e discos próprios. Famílias de tamanho são escolhidas por CPU, memória, armazenamento e rede. Instâncias burstable têm uma linha de base de CPU e acumulam créditos abaixo dela para gastar nos picos. Imagens padronizam VMs idênticas e alimentam o autoescalonamento; discos persistentes sobrevivem ao desligamento e continuam cobrando.",
      "Os pares AWS x Azure (acréscimo): EC2 x Virtual Machine; família T (t3.micro) x série B (Standard_B1s); AMI x Marketplace e Azure Compute Gallery; Auto Scaling Group x VM Scale Sets; EBS x Managed Disks; Elastic IP x Public IP estático; key pair x --generate-ssh-keys; Spot Instances x Spot VMs.",
      "Onde eles diferem de verdade: no Azure, uma VM parada de dentro do sistema continua com a computação reservada e cobrando; só o deallocate libera. Na AWS, parar já interrompe o custo de computação (EBS e IP seguem cobrando). Encerrar na AWS apaga o volume raiz por padrão; apagar a VM no Azure não apaga disco, NIC e IP público, a menos que você apague o resource group.",
      "Na pista: a VM é uma garagem completa, com gerador próprio. Os créditos de CPU funcionam como o ERS: carregam abaixo da linha de base e descarregam nos picos; sem carga, o carro perde velocidade antes do fim da reta. Aqui a analogia para: o ERS recolhe energia em frenagem, os créditos dependem só do tempo, e no modo ilimitado se paga o excedente, coisa que a F1 não vende.",
    ],
    pointsTitle: "A garagem certa",
    points: [
      {
        t: "Burstable",
        d: "Família T e série B: cargas leves com picos curtos.",
        color: "blue",
      },
      {
        t: "Parar x desalocar",
        d: "No Azure, só o deallocate para a cobrança de computação.",
        color: "ember",
      },
      {
        t: "Disco e IP cobram",
        d: "Mesmo com a máquina parada; confira na limpeza.",
        color: "signal",
      },
    ],
    examplesTitle: "Do zero a uma VM",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Quantas vCPUs e memória tem a t3.micro?
$ aws ec2 describe-instance-types --instance-types t3.micro \\
  --query "InstanceTypes[0].{vcpu:VCpuInfo.DefaultVCpus,memoriaMiB:MemoryInfo.SizeInMiB}"
{ "vcpu": 2, "memoriaMiB": 1024 }
# Criação opcional (gera custo se ficar ligada): região, imagem, chave e firewall
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
# Cria UMA instância pequena e imprime o ID dela (anote para a limpeza)
$ aws ec2 run-instances \\
  --image-id "$AMI_ID" \\
  --instance-type t3.micro \\
  --key-name lab \\
  --security-group-ids "$SG_ID" \\
  --count 1 \\
  --query 'Instances[0].InstanceId' --output text`,
        note: "Sem --subnet-id, a AWS usa uma sub-rede padrão da VPC padrão, que é pública.",
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (acréscimo): o tamanho Standard_B1s existe na região?
$ az vm list-sizes --location brazilsouth --query "[?name=='Standard_B1s']" --output table
# Recria o grupo e cria VM, disco, NIC e IP público em um comando
$ az group create --name rg-lab --location brazilsouth
$ az vm create \\
  --resource-group rg-lab \\
  --name vm-lab \\
  --image Ubuntu2204 \\
  --size Standard_B1s \\
  --admin-username azureuser \\
  --generate-ssh-keys`,
        note: "Se a linha do tamanho não aparecer, ele não existe nessa região.",
      },
      {
        label: "parar x desalocar",
        lang: "sh",
        code: `# AWS: parar mantém o disco; a instância deixa de gerar custo de computação
$ aws ec2 stop-instances --instance-ids <ID-DA-INSTANCIA>
# Azure (acréscimo): parar pelo sistema operacional NÃO libera a computação; é preciso DESALOCAR
$ az vm deallocate --resource-group rg-lab --name vm-lab`,
      },
    ],
    commands: [
      {
        cmd: 'aws ec2 describe-instances --query "Reservations[].Instances[].{id:InstanceId,estado:State.Name,tipo:InstanceType}" --output table',
        note: "suas instâncias e o estado de cada uma",
      },
      {
        cmd: "az vm list --show-details --output table",
        note: "VM running ou VM deallocated",
      },
      {
        cmd: 'aws ec2 describe-volumes --query "Volumes[].VolumeId" --output text',
        note: "sobrou algum volume?",
      },
    ],
    handsOnIntro:
      "Cronômetro na mão: primeiro a conta da bateria, sem nuvem; depois leitura, criação opcional e uma limpeza que não pode ser pulada.",
    handsOn: [
      "Calcule a linha de base da t3.micro: 12 créditos por hora em 2 vCPUs dão 10% por vCPU.",
      "Leitura: rode os comandos de tamanho e liste suas VMs, observando os estados running, stopped e deallocated.",
      "Opcional (gera custo se ficar ligada): crie a instância e a VM e entre por SSH (ec2-user no Amazon Linux, azureuser no Azure).",
      "No Azure, desaloque com az vm deallocate e confirme o estado; na AWS, compare com stop-instances.",
      "Limpeza (VM ligada cobra): terminate-instances, wait instance-terminated, delete-security-group, delete-key-pair e conferência dos volumes; no Azure, az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "Carga que fica o tempo todo acima da linha de base esgota os créditos: a família burstable deixa de ser a escolha certa.",
    takeaway:
      "Tamanho pela carga, imagem para padronizar, regra para escalar, e disco e IP cobram mesmo com a máquina parada.",
  },
  {
    id: "az5",
    num: "05",
    navTitle: "Containers",
    tag: "ECS/EKS x Container Apps/AKS",
    title: "Containers (ECS/EKS x Container Apps/AKS)",
    lead: "Container empacota, orquestrador mantém o estado desejado. O Kubernetes é o idioma comum entre EKS e AKS, e a simplicidade serverless (Fargate, Container Apps) custa controle fino.",
    concept: [
      "O container compartilha o kernel do host em vez de iniciar um sistema operacional por aplicação; a imagem é guardada num registro. O orquestrador mantém o estado desejado, reinicia o que cai e escala. No Kubernetes, o control plane decide onde cada coisa roda nos nós de trabalho; Pod é a menor unidade, Deployment declara réplicas, Service dá um endereço estável e Ingress define a entrada HTTP.",
      "Os pares AWS x Azure (acréscimo): ECS x Azure Container Apps; Fargate x Container Apps e Azure Container Instances; EKS x AKS; ECR x ACR; node group x node pool; IAM Roles for Service Accounts x Microsoft Entra Workload ID; Container Insights nos dois lados; KEDA integrado ao Container Apps e disponível no AKS.",
      "Onde eles diferem de verdade: o ECS não existe no Azure; a resposta para orquestração simples é o Container Apps, que roda sobre Kubernetes e escala a zero. O AKS tem camada gratuita de plano de controle e exige um node pool de sistema. O YAML é o mesmo, mas o type LoadBalancer, a StorageClass e o ingress viram equipamentos diferentes em cada provedor, com preço próprio.",
      "Na pista: a imagem é a especificação replicável do carro, o Pod é o carro na pista, os nós são as garagens e o control plane é o muro, que manda montar outro carro quando um para. Na F1, o carro que para na reta não tem reposição até o fim da corrida; no Kubernetes, o Pod perdido volta em segundos.",
    ],
    pointsTitle: "A ficha de operação",
    points: [
      {
        t: "Mesmo YAML",
        d: "Manifestos Kubernetes valem para EKS, AKS e kind.",
        color: "blue",
      },
      {
        t: "Auto-recuperação",
        d: "O Deployment repõe a réplica que cair.",
        color: "signal",
      },
      {
        t: "Mesma ficha, outra fatura",
        d: "Plano de controle, nós, balanceador e discos custam diferente.",
        color: "ember",
      },
    ],
    examplesTitle: "O mesmo cluster nos dois provedores",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Cluster EKS com nós gerenciados (opcional, custa: nós são VMs; leva vários minutos)
$ eksctl create cluster --name my-cluster --region sa-east-1 --nodes 2
# Grupo de nós gerenciado: 2 nós, mínimo 1 e máximo 3
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
        code: `# Azure (acréscimo): recria o grupo, cria o cluster AKS com 2 nós e baixa as credenciais
$ az group create --name rg-lab --location brazilsouth
$ az aks create --resource-group rg-lab --name aks-lab --node-count 2 --generate-ssh-keys
$ az aks get-credentials --resource-group rg-lab --name aks-lab
# Node pool equivalente: 2 nós, mínimo 1 e máximo 3
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
        code: `apiVersion: apps/v1            # versão da API para Deployments
kind: Deployment               # tipo: atualizações declarativas de réplicas
metadata:
  name: meu-deployment         # nome do objeto
spec:
  replicas: 3                  # quantidade desejada de pods
  selector:
    matchLabels:
      app: minha-aplicacao     # quais pods este Deployment gerencia
  template:                    # molde de cada pod
    metadata:
      labels:
        app: minha-aplicacao   # rótulo que o Service usará para achar os pods
    spec:
      containers:
        - name: meu-container  # nome do container
          image: nginx         # imagem usada
          ports:
            - containerPort: 80  # porta em que o container escuta
---
apiVersion: v1
kind: Service                  # endereço estável para o conjunto de pods
metadata:
  name: meu-servico
spec:
  selector:
    app: minha-aplicacao       # seleciona os pods com esse rótulo
  ports:
    - protocol: TCP
      port: 80                 # porta do serviço
      targetPort: 80           # porta do container
  type: ClusterIP              # acessível só dentro do cluster`,
        note: "Pod sem o rótulo app: minha-aplicacao não é encontrado pelo Service.",
      },
    ],
    commands: [
      {
        cmd: 'aws ecr describe-repositories --query "repositories[].repositoryName" --output text',
        note: "registros ECR",
      },
      { cmd: "aws eks list-clusters", note: "clusters EKS" },
      { cmd: "az acr list --output table", note: "registros ACR" },
      { cmd: "az aks list --output table", note: "clusters AKS" },
    ],
    handsOnIntro:
      "Pit lane aberto, sem conta de nuvem: suba um cluster na sua máquina e derrube um carro de propósito para ver o muro repor.",
    handsOn: [
      "Crie o cluster local com kind create cluster --name lab (ou minikube start) e aplique o app.yaml com kubectl apply -f app.yaml.",
      "Confira 3 pods Running, abra o serviço com kubectl port-forward svc/meu-servico 8080:80 e veja o Welcome to nginx!",
      "Apague um pod com kubectl delete pod e veja um novo aparecer; depois escale para 5 réplicas com kubectl scale.",
      "Opcional, gera custo: crie EKS ou AKS só com crédito, aplique o mesmo app.yaml e apague no mesmo dia.",
      "Limpeza: kubectl delete -f app.yaml e kind delete cluster --name lab; eksctl delete cluster --name my-cluster --region sa-east-1; az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "Time pequeno, API simples e sem experiência em Kubernetes: ECS com Fargate ou Container Apps. Já usa Kubernetes: EKS ou AKS.",
    takeaway:
      "Container empacota, orquestrador mantém o estado desejado, e o Kubernetes é o idioma comum entre EKS e AKS.",
  },
  {
    id: "az6",
    num: "06",
    navTitle: "Bancos de dados",
    tag: "RDS e DynamoDB x Azure SQL e Cosmos DB",
    title: "Bancos de dados (RDS, Aurora e DynamoDB x Azure SQL, PostgreSQL/MySQL e Cosmos DB)",
    lead: "Relacional para integridade e joins, NoSQL para latência e escala por chave. O Aurora e o Cosmos DB não são traduções diretas de nada: compare por requisito.",
    concept: [
      "O relacional usa SQL, transações ACID, esquema fixo, joins e integridade referencial. O NoSQL (chave-valor, documentos, colunar, grafos) troca isso por escala horizontal e baixa latência. Gerenciado, o provedor cuida de patches, backups, restauração a um ponto no tempo e alta disponibilidade em outra zona. Capacidade pode ser provisionada ou sob demanda.",
      "Os pares AWS x Azure (acréscimo): RDS x Azure SQL Database e Azure Database for PostgreSQL e MySQL; Aurora x Azure SQL Hyperscale (não é tradução 1 para 1); DynamoDB x Cosmos DB; DAX x cache integrado do Cosmos DB; DynamoDB Streams x change feed; Multi-AZ x alta disponibilidade zone-redundant; TTL nos dois.",
      "Onde eles diferem de verdade: o Aurora separa armazenamento (seis cópias em três zonas, até 15 réplicas de leitura, segundo o material) de processamento. O Cosmos DB expõe a engine por várias APIs (NoSQL, MongoDB, Cassandra, Gremlin, Table) e oferece cinco níveis de consistência (Strong, Bounded staleness, Session, Consistent prefix, Eventual), enquanto o DynamoDB escolhe eventual ou forte por requisição. O Cosmos DB mede custo em Request Units por segundo.",
      "Na pista: o relacional é o livro técnico oficial do carro, o chave-valor é o controle de pneus por código de barras e a chave de partição é a etiqueta. A atomicidade é a liberação do pit stop: ou as quatro rodas foram trocadas, ou o carro não volta. Aqui a analogia para: a transação que falha volta ao estado anterior; o pit stop errado não devolve os pneus velhos.",
    ],
    pointsTitle: "Qual arquivo usar",
    points: [
      {
        t: "ACID",
        d: "Ou a transação inteira acontece, ou nada muda.",
        color: "blue",
      },
      {
        t: "Chave de partição",
        d: "Escolha pela pergunta que você fará todo dia.",
        color: "signal",
      },
      {
        t: "Consistência",
        d: "Dois níveis no DynamoDB, cinco no Cosmos DB.",
        color: "ember",
      },
    ],
    examplesTitle: "Chave-valor nos dois mundos",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Cria a tabela "pedidos" com chave de partição "id" (texto), cobrança por requisição
$ aws dynamodb create-table --table-name pedidos \\
  --attribute-definitions AttributeName=id,AttributeType=S \\
  --key-schema AttributeName=id,KeyType=HASH \\
  --billing-mode PAY_PER_REQUEST
# Espera a tabela ficar ACTIVE antes de gravar
$ aws dynamodb wait table-exists --table-name pedidos
# Grava um item e lê de volta pela chave
$ aws dynamodb put-item --table-name pedidos \\
  --item '{"id":{"S":"1001"},"item":{"S":"café"}}'
$ aws dynamodb get-item --table-name pedidos --key '{"id":{"S":"1001"}}'
{"Item": {"id": {"S": "1001"}, "item": {"S": "café"}}}`,
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (acréscimo): recria o grupo (a limpeza da etapa anterior o apagou)
$ az group create --name rg-lab --location brazilsouth
# O nome da conta é globalmente único: troque <NOME-UNICO>
$ az cosmosdb create --name cosmos-<NOME-UNICO> --resource-group rg-lab \\
  --kind GlobalDocumentDB --capabilities EnableServerless
# Cria o banco "loja" e o contêiner "pedidos" com chave de partição /id
$ az cosmosdb sql database create --account-name cosmos-<NOME-UNICO> --resource-group rg-lab --name loja
$ az cosmosdb sql container create --account-name cosmos-<NOME-UNICO> --resource-group rg-lab \\
  --database-name loja --name pedidos --partition-key-path "/id"`,
        note: "Para gravar e ler itens no Cosmos DB, use o Data Explorer do portal ou um SDK.",
      },
      {
        label: "atomicidade",
        lang: "sh",
        code: `$ python3 - <<'EOF'
import sqlite3
c = sqlite3.connect(":memory:")
c.execute("create table conta(id int primary key, saldo int)")
c.executemany("insert into conta values (?,?)", [(1, 100), (2, 50)])
c.commit()
try:
    with c:  # a transação é revertida se houver exceção
        c.execute("update conta set saldo = saldo - 70 where id = 1")
        raise RuntimeError("falha no meio da transferência")
except RuntimeError as e:
    print("erro:", e)
print(c.execute("select * from conta").fetchall())
EOF
erro: falha no meio da transferência
[(1, 100), (2, 50)]`,
        note: "O saldo da conta 1 voltou a 100: isso é atomicidade, sem nuvem nenhuma.",
      },
    ],
    commands: [
      {
        cmd: 'aws rds describe-db-instances --query "DBInstances[].{id:DBInstanceIdentifier,engine:Engine}" --output table',
        note: "instâncias RDS e engine",
      },
      { cmd: "aws dynamodb list-tables", note: "tabelas DynamoDB" },
      { cmd: "az postgres flexible-server list --output table", note: "PostgreSQL gerenciado" },
      { cmd: "az cosmosdb list --output table", note: "contas Cosmos DB" },
    ],
    handsOnIntro:
      "Bancada ligada: a regra do pit stop escrita em código, depois leitura e, se quiser, uma tabela por etiqueta nos dois circuitos.",
    handsOn: [
      "Rode o script de atomicidade e confirme que a falha no meio não sumiu com os 70.",
      "Leitura: liste instâncias RDS, tabelas DynamoDB, servidores Azure SQL e PostgreSQL e contas Cosmos DB.",
      "Opcional, custo mínimo (modelo sob demanda): crie a tabela DynamoDB e a conta Cosmos DB serverless.",
      "Confirme: describe-table devolve ACTIVE e az cosmosdb sql container show encontra o contêiner pedidos.",
      "Limpeza: aws dynamodb delete-table --table-name pedidos e az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "Sessões que devem expirar sozinhas pedem TTL, que existe no DynamoDB e no Cosmos DB.",
    takeaway:
      "Relacional para integridade e joins, NoSQL para latência e escala por chave; compare por requisito, não por nome.",
  },
  {
    id: "az7",
    num: "07",
    navTitle: "Serverless",
    tag: "Lambda x Azure Functions",
    title: "Serverless (Lambda e API Gateway x Azure Functions e API Management)",
    lead: "Serverless é pagar pela execução em vez da ociosidade: excelente para carga variável e eventos, mas amarra você ao formato de evento de cada provedor.",
    concept: [
      "Serverless não é sem servidores: o provedor cuida de instalação, escala e manutenção, e você cuida do código. A função tem um handler que recebe um evento disparado por um gatilho (HTTP, arquivo, banco, fila, agenda) e cobra por requisição e duração. O cold start é o atraso de uma função inativa. O API gateway expõe rotas, autentica, limita taxa e roteia. Evite em execuções longas, carga alta e constante e quando o lock-in pesa.",
      "Os pares AWS x Azure (acréscimo): Lambda x Azure Functions; API Gateway x API Management (APIM); Cognito x Entra ID e Entra External ID; Step Functions x Logic Apps ou Durable Functions; EventBridge x Event Grid; SQS x Queue Storage ou Service Bus; SNS x Service Bus topics e Event Grid; Kinesis x Event Hubs; X-Ray x Application Insights.",
      "Onde eles diferem de verdade: no Azure Functions, gatilhos e bindings de entrada e saída são declarados na própria função; no Lambda, a integração costuma ser configurada fora do código. O Functions tem vários planos de hospedagem (consumo, premium, dedicado). O APIM é um produto amplo de gestão de APIs. E o lock-in vale para os dois: isole a lógica numa função pura chamada por um adaptador fino.",
      "Na pista: é a estação que o circuito só abre quando chega um pedido, o gatilho é o pedido e o cold start é a volta de saída, com pneus e freios frios. A fila é a pilha de pneus usados esperando análise. Aqui a analogia para: nada na F1 é cobrado por atendimento nem escala de zero a milhares de cópias em segundos.",
    ],
    pointsTitle: "A estação sob demanda",
    points: [
      {
        t: "Handler e gatilho",
        d: "Um ponto de entrada que reage a um evento.",
        color: "blue",
      },
      {
        t: "Cold start",
        d: "A primeira chamada depois de um tempo parada é mais lenta.",
        color: "signal",
      },
      {
        t: "Lock-in",
        d: "Bindings, orquestração e filas proprietárias prendem ao provedor.",
        color: "ember",
      },
    ],
    examplesTitle: "A mesma função HTTP",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `import json

def lambda_handler(event, context):                       # ponto de entrada: recebe evento e contexto
    params = event.get("queryStringParameters") or {}      # parâmetros da URL, se houver
    nome = params.get("nome", "mundo")                     # padrão: "mundo"
    return {                                               # formato esperado pelo API Gateway
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"mensagem": f"Olá, {nome}!"}, ensure_ascii=False),
    }`,
        note: "O Lambda recebe um dicionário e devolve um dicionário.",
      },
      {
        label: "Azure",
        lang: "sh",
        code: `import json
import azure.functions as func

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)  # app de funções; sem chave exigida

@app.route(route="ola")                                    # expõe a função em /api/ola
def ola(req: func.HttpRequest) -> func.HttpResponse:       # ponto de entrada: recebe a requisição
    nome = req.params.get("nome", "mundo")                 # parâmetro da URL, padrão "mundo"
    corpo = json.dumps({"mensagem": f"Olá, {nome}!"}, ensure_ascii=False)
    return func.HttpResponse(corpo, mimetype="application/json", status_code=200)`,
        note: "Azure (acréscimo), modelo de programação v2: recebe e devolve objetos tipados.",
      },
      {
        label: "handler local",
        lang: "sh",
        code: `# Chama o handler.py com um evento falso, sem nuvem
$ python3 -c "
import handler
print(handler.lambda_handler({'queryStringParameters': {'nome': 'Ana'}}, None))
"
{'statusCode': 200, 'headers': {'Content-Type': 'application/json'}, 'body': '{"mensagem": "Olá, Ana!"}'}
# Agora sem parâmetro
$ python3 -c "import handler; print(handler.lambda_handler({}, None)['body'])"
{"mensagem": "Olá, mundo!"}`,
      },
    ],
    commands: [
      {
        cmd: 'aws lambda list-functions --query "Functions[].FunctionName" --output text',
        note: "funções Lambda",
      },
      {
        cmd: 'aws apigatewayv2 get-apis --query "Items[].Name" --output text',
        note: "APIs HTTP e WebSocket",
      },
      { cmd: "az functionapp list --output table", note: "function apps" },
      { cmd: "az apim list --output table", note: "instâncias do API Management" },
    ],
    handsOnIntro:
      "Simulador ligado: o handler roda inteiro na sua máquina com um evento falso, antes de tocar em qualquer circuito.",
    handsOn: [
      "Salve o Lambda como handler.py e chame-o com o evento falso de Ana; depois sem parâmetro.",
      "Para o Azure, o caminho local é o Azure Functions Core Tools (func init e func start, em http://localhost:7071/api/ola); se não quiser instalar, leia o código.",
      "Leitura: liste funções, APIs, function apps e instâncias do APIM.",
      "Opcional: crie uma função pelo console ou portal (no Azure, dentro do rg-lab). Há camada gratuita, mas o custo depende do consumo e da conta.",
      "Limpeza: aws lambda delete-function --function-name <NOME-DA-FUNCAO> e az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "Carga altíssima e constante, 24 horas por dia, pode sair mais cara no modelo sob demanda do que em infraestrutura tradicional.",
    takeaway:
      "Serverless é pagar pela execução em vez da ociosidade, ao preço de se amarrar ao formato de evento de cada provedor.",
  },
  {
    id: "az8",
    num: "08",
    navTitle: "Monitoramento e logs",
    tag: "CloudWatch x Azure Monitor",
    title: "Monitoramento e logs (CloudWatch x Azure Monitor)",
    lead: "Métrica diz o que, evento diz quando, log diz por quê. Defina retenção, alerte só o que é acionável e saiba consultar logs em pipeline (Logs Insights ou KQL).",
    concept: [
      "Métricas são números agregados ao longo do tempo; logs são registros detalhados para depuração e auditoria; eventos são mudanças de estado. Alarmes disparam ações sobre métricas ou logs, dashboards mostram tudo em tempo real e o rastreamento distribuído segue uma requisição por vários serviços. Logs irrelevantes e retenção indefinida geram custo.",
      "Os pares AWS x Azure (acréscimo): CloudWatch x Azure Monitor; CloudWatch Logs (log groups) x Log Analytics workspace (tabelas); Logs Insights x KQL; CloudWatch Alarms x Azure Monitor Alerts com Action Groups; EventBridge x Event Grid; CloudWatch Agent x Azure Monitor Agent; X-Ray x Application Insights; CloudTrail x Activity Log.",
      "Onde eles diferem de verdade: na AWS, serviços como o Lambda enviam logs ao CloudWatch automaticamente; no Azure, os logs de recursos precisam, em geral, de diagnostic settings que dizem para onde enviá-los. Esquecer isso é o clássico cadê meus logs. O Log Analytics reúne vários serviços num workspace; no Azure a regra do alerta é separada de quem avisar (o Action Group). E as duas linguagens são de pipeline, não SQL.",
      "Na pista: a telemetria é a métrica, as mensagens do controle de corrida são os eventos e o rádio é o log. Quem assiste à corrida vê o evento (um carro parado na reta); o porquê só aparece na telemetria da equipe. Aqui a analogia para: sensor com canal desligado seria erro de montagem na F1; no Azure é o padrão até você ligar as diagnostic settings.",
    ],
    pointsTitle: "As três fontes do muro",
    points: [
      { t: "Métrica", d: "O que está acontecendo: CPU, latência, requisições.", color: "blue" },
      {
        t: "Evento",
        d: "Quando algo mudou: instância reiniciada, função com falha.",
        color: "signal",
      },
      { t: "Log", d: "Por que aconteceu: o stack trace do erro.", color: "ember" },
    ],
    examplesTitle: "A mesma pergunta, duas linguagens",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `fields @timestamp, @message        # escolhe os campos a mostrar
| filter @message like /500/       # mantém só linhas que contêm "500"
| sort @timestamp desc             # mais recentes primeiro
| limit 20                         # só 20 linhas`,
        note: "CloudWatch Logs Insights: o intervalo de tempo é escolhido na tela ou na chamada da consulta.",
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
        note: "Azure (acréscimo): KQL no Log Analytics, sobre a tabela de requisições do Application Insights.",
      },
      {
        label: "alarme de CPU",
        lang: "sh",
        code: `# AWS: alarme na CPU de uma instância, média de 5 minutos, acima de 80
$ aws cloudwatch put-metric-alarm --alarm-name cpu-alta \\
  --namespace AWS/EC2 --metric-name CPUUtilization \\
  --dimensions Name=InstanceId,Value=<ID-DA-INSTANCIA> \\
  --statistic Average --period 300 --evaluation-periods 1 \\
  --threshold 80 --comparison-operator GreaterThanThreshold \\
  --alarm-actions <ARN-DO-TOPICO-SNS>
# Azure (acréscimo): alerta de métrica equivalente; o Action Group define quem é notificado
$ az monitor metrics alert create --name cpu-alta --resource-group rg-lab \\
  --scopes <ID-DA-VM> \\
  --condition "avg Percentage CPU > 80" \\
  --window-size 5m --evaluation-frequency 1m \\
  --action <ID-DO-ACTION-GROUP>`,
        note: "Só crie se tiver o recurso monitorado e um destino de notificação.",
      },
    ],
    commands: [
      {
        cmd: "aws cloudwatch list-metrics --namespace AWS/EC2 --max-items 5",
        note: "métricas disponíveis",
      },
      {
        cmd: 'aws logs describe-log-groups --query "logGroups[].{nome:logGroupName,retencaoDias:retentionInDays}" --output table',
        note: "retenção vazia significa indefinida",
      },
      {
        cmd: "az monitor log-analytics workspace list --output table",
        note: "workspaces do Log Analytics",
      },
    ],
    handsOnIntro:
      "Telemetria na tela: um pipeline de logs feito só com o terminal, depois leitura na nuvem e, se houver o que monitorar, um alarme de verdade.",
    handsOn: [
      "Crie um acesso.log com cinco linhas e rode grep \" 500\" acesso.log | awk '{print $3}' | sort | uniq -c | sort -rn: 2 /checkout e 1 /pedido.",
      "Leitura: liste métricas, log groups com retenção e workspaces do Log Analytics.",
      'Traduza para KQL: AppTraces | where Message contains "timeout" | summarize count() by bin(TimeGenerated, 5m).',
      "Opcional: crie o alarme de CPU só se tiver a VM da Etapa 04 e um destino de notificação; ele fica OK ou Insufficient data até receber pontos.",
      "Limpeza: aws cloudwatch delete-alarms --alarm-names cpu-alta; az monitor metrics alert delete --name cpu-alta --resource-group rg-lab e az group delete.",
    ],
    tip: "Ligou um serviço no Azure e não vê logs no workspace? Confira primeiro as diagnostic settings do recurso.",
    takeaway:
      "Métrica diz o que, evento diz quando, log diz por quê; retenção definida e alertas acionáveis.",
  },
  {
    id: "az9",
    num: "09",
    navTitle: "Entrega e objetos",
    tag: "CloudFront e S3 x Front Door e Blob",
    title: "Entrega de conteúdo, balanceamento e objetos",
    lead: "A CDN aproxima, o balanceador distribui, o armazenamento de objetos guarda barato. No Azure, o nome único mora na storage account, não no container.",
    concept: [
      "A CDN guarda conteúdo estático em servidores de borda perto do usuário: desempenho, disponibilidade, escalabilidade e segurança, com controle de TTL. O balanceador distribui requisições com health checks, em camada 4 (TCP e UDP) ou camada 7 (HTTP, por URL e cabeçalho). O armazenamento de objetos guarda dados com chave única via API REST, com classes de armazenamento, URLs assinadas e versionamento.",
      "Os pares AWS x Azure (acréscimo): CloudFront x Azure Front Door; ALB x Application Gateway; NLB x Azure Load Balancer; S3 x Blob Storage numa storage account; S3 Standard, IA e Glacier x camadas Hot, Cool, Cold e Archive; presigned URL x SAS; AWS Shield e WAF x Azure DDoS Protection e Azure WAF.",
      "Onde eles diferem de verdade: o nome do bucket S3 é único em toda a AWS; no Azure, o nome globalmente único é o da storage account, e os containers só são únicos dentro dela. No Azure, o Owner não lê blobs por Entra ID sem uma role de dados como Storage Blob Data Contributor. O Application Gateway vive numa sub-rede dedicada da VNet; o Front Door é global na borda. As camadas frias têm regras e prazos próprios.",
      "Na pista: o armazenamento de objetos é o almoxarifado central, a CDN são os postos avançados de peças e o balanceador é o controle de entrada do pit lane, fechando o box com problema. A URL assinada é o passe de convidado de um dia. O vídeo do pódio pedido por alguém em Fortaleza sai do posto mais próximo, não da fábrica.",
    ],
    pointsTitle: "O caminho do pedido",
    points: [
      { t: "CDN", d: "Cópia perto do usuário, governada pelo TTL.", color: "blue" },
      {
        t: "Camada 4 x 7",
        d: "Rotear por URL pede camada 7: ALB ou Application Gateway.",
        color: "signal",
      },
      { t: "Namespace", d: "Bucket único na AWS; storage account única no Azure.", color: "ember" },
    ],
    examplesTitle: "O site estático, do armazenamento à entrega",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Cria um bucket (o nome é único no mundo todo, em toda a AWS)
$ aws s3 mb s3://<NOME-UNICO-DO-BUCKET> --region sa-east-1
# Envia um arquivo e lista o conteúdo
$ echo "<h1>Olá, nuvem</h1>" > index.html
$ aws s3 cp index.html s3://<NOME-UNICO-DO-BUCKET>/index.html
$ aws s3 ls s3://<NOME-UNICO-DO-BUCKET>/
# Gera uma URL assinada que expira em 300 segundos (a forma segura de compartilhar)
$ aws s3 presign s3://<NOME-UNICO-DO-BUCKET>/index.html --expires-in 300`,
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (acréscimo): a storage account tem nome globalmente único, sem acesso público anônimo
$ az group create --name rg-lab --location brazilsouth
$ az storage account create --name st<NOME-UNICO> --resource-group rg-lab \\
  --location brazilsouth --sku Standard_LRS --kind StorageV2 \\
  --allow-blob-public-access false
# Para operar dados com sua identidade, você precisa de uma role de DADOS
$ az role assignment create --assignee <SEU-E-MAIL> --role "Storage Blob Data Contributor" \\
  --scope $(az storage account show -n st<NOME-UNICO> -g rg-lab --query id -o tsv)
$ az storage container create --account-name st<NOME-UNICO> --name site --auth-mode login
$ az storage blob upload --account-name st<NOME-UNICO> --container-name site \\
  --name index.html --file index.html --auth-mode login
# O equivalente da URL assinada é um SAS de delegação de usuário (validade: 1 dia, em UTC)
$ az storage blob generate-sas --account-name st<NOME-UNICO> --container-name site \\
  --name index.html --permissions r --expiry $(date -u -d '+1 day' '+%Y-%m-%dT%H:%MZ') \\
  --auth-mode login --as-user --full-uri`,
        note: "As permissões novas podem levar alguns minutos para valer. No macOS, use $(date -u -v+1d '+%Y-%m-%dT%H:%MZ').",
      },
      {
        label: "cabeçalhos e 304",
        lang: "sh",
        code: `$ mkdir -p site && echo "<h1>Olá</h1>" > site/index.html
# Servidor de arquivos local, servindo a pasta site
$ python3 -m http.server --directory site 8000 &
$ sleep 1
$ curl -sI localhost:8000/index.html
# Sem Cache-Control: por isso é você quem configura o TTL na CDN
# Reenvia o pedido dizendo "só me mande se mudou desde Last-Modified"
$ LM=$(curl -sI localhost:8000/index.html | grep -i '^Last-Modified' | cut -d' ' -f2- | tr -d '\\r')
$ curl -sI -H "If-Modified-Since: $LM" localhost:8000/index.html | head -1
HTTP/1.0 304 Not Modified`,
        note: "O 304 é o mecanismo de validação que permite reaproveitar uma cópia em cache.",
      },
    ],
    commands: [
      { cmd: "aws s3 ls", note: "seus buckets" },
      {
        cmd: 'aws elbv2 describe-load-balancers --query "LoadBalancers[].{nome:LoadBalancerName,tipo:Type}" --output table',
        note: "balanceadores e tipo",
      },
      { cmd: "az storage account list --output table", note: "storage accounts" },
      {
        cmd: "az network application-gateway list --output table",
        note: "Application Gateways",
      },
    ],
    handsOnIntro:
      "Bancada ligada, sem nuvem: sirva uma pasta, leia os cabeçalhos e veja o 304 acontecer. A criação na nuvem custa centavos, se apagar no mesmo dia.",
    handsOn: [
      "Rode o servidor local, inspecione os cabeçalhos e provoque o 304 Not Modified com If-Modified-Since.",
      "Leitura: liste buckets, balanceadores, storage accounts, Application Gateways e Azure Load Balancers.",
      "Opcional (centavos, se apagar no mesmo dia): crie o bucket e a storage account, envie o index.html e liste.",
      "Gere a URL assinada e o SAS, abra o link e confirme que ele expira.",
      "Limpeza: kill %1 e rm -rf site index.html; aws s3 rm --recursive e aws s3 rb no bucket; az group delete --name rg-lab --yes --no-wait.",
    ],
    tip: "Backups com mais de um ano raramente lidos vão para camadas frias: S3 IA ou Glacier, Cool, Cold ou Archive, observando custo e tempo de acesso.",
    takeaway:
      "A CDN aproxima, o balanceador distribui e o armazenamento de objetos guarda barato; no Azure, o nome único é o da storage account.",
  },
  {
    id: "az10",
    num: "10",
    navTitle: "Segredos, WAF e DNS",
    tag: "Secrets Manager x Key Vault",
    title: "Segredos, WAF, certificados e DNS",
    lead: "Segredo no cofre, tráfego filtrado pelo WAF, certificado renovado por máquina e DNS com política de roteamento. No Azure, o cofre reúne segredos, chaves e certificados.",
    concept: [
      "Um cofre de segredos guarda senhas e tokens com acesso controlado, auditoria, versionamento e rotação. O serviço de chaves criptografa dados em repouso. O WAF analisa o tráfego HTTP em camada 7 (SQL injection, limite de taxa, bloqueio por país). Certificados TLS devem ter emissão, validação e renovação automatizadas. O DNS traduz nomes em IPs, com TTL, zonas públicas e privadas e políticas de roteamento.",
      "Os pares AWS x Azure (acréscimo): Secrets Manager x Key Vault (secrets); KMS x Key Vault (keys) e Managed HSM; AWS WAF x Azure WAF; ACM x certificados gerenciados do App Service e do Front Door e certificados no Key Vault; Route 53 x Azure DNS e Private DNS; políticas Latency, Geolocation, Failover e Weighted x Traffic Manager Performance, Geographic, Priority e Weighted.",
      "Onde eles diferem de verdade: o Key Vault guarda segredos, chaves e certificados num só serviço, com modelo de autorização próprio; na AWS são três serviços. O Secrets Manager traz rotação nativa para alguns serviços; no Azure ela se monta com eventos e automação, ou se evita com Managed Identity. O Route 53 também registra domínios; o Azure DNS não. Nos dois, comece o WAF em modo de detecção.",
      "Na pista: o cofre de combinações entrega a combinação na hora a quem tem passe, o WAF é o fiscal que abre a bolsa, o certificado é a superlicença que vence e o DNS é a lista de inscritos. Aqui a analogia para: a combinação roubada é uma; o segredo vazado pode ter sido copiado sem limite e precisa ser revogado e trocado. E um domínio pode ter mais de um certificado válido.",
    ],
    pointsTitle: "As quatro camadas",
    points: [
      { t: "Cofre", d: "Segredo fora do código, com permissão mínima.", color: "blue" },
      {
        t: "Certificado gerenciado",
        d: "Renovação automática tira o risco da mão humana.",
        color: "signal",
      },
      { t: "Roteamento por DNS", d: "Latência, geográfico, failover e ponderado.", color: "ember" },
    ],
    examplesTitle: "Guardar e ler um segredo",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Cria um segredo e o lê de volta
$ aws secretsmanager create-secret --name lab/senha-banco --secret-string 'S3nh@Forte'
$ aws secretsmanager get-secret-value --secret-id lab/senha-banco --query SecretString --output text
S3nh@Forte`,
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (acréscimo): cofre com nome globalmente único e permissões por Azure RBAC
$ az group create --name rg-lab --location brazilsouth
$ az keyvault create --name kv-<NOME-UNICO> --resource-group rg-lab --location brazilsouth \\
  --enable-rbac-authorization true
# Seu usuário precisa de uma role de dados no cofre para gravar e ler segredos
$ az role assignment create --assignee <SEU-E-MAIL> --role "Key Vault Secrets Officer" \\
  --scope $(az keyvault show -n kv-<NOME-UNICO> --query id -o tsv)
$ az keyvault secret set --vault-name kv-<NOME-UNICO> --name senha-banco --value 'S3nh@Forte'
$ az keyvault secret show --vault-name kv-<NOME-UNICO> --name senha-banco --query value -o tsv
S3nh@Forte`,
        note: "Nem o dono da assinatura abre o cofre sem a role de dados. As permissões novas podem levar alguns minutos.",
      },
      {
        label: "DNS e certificado",
        lang: "sh",
        code: `# O número entre o nome e "IN" é o TTL
$ dig +noall +answer example.com A
# Os servidores de nomes autoritativos do domínio
$ dig +short example.com NS
# Quem emitiu o certificado e a validade (notBefore/notAfter)
$ openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null \\
  | openssl x509 -noout -subject -issuer -dates`,
        note: "O notAfter é exatamente o prazo que um serviço de certificados gerenciados deve renovar por você.",
      },
    ],
    commands: [
      {
        cmd: 'aws secretsmanager list-secrets --query "SecretList[].Name" --output text',
        note: "segredos existentes",
      },
      {
        cmd: 'aws acm list-certificates --query "CertificateSummaryList[].DomainName" --output text',
        note: "certificados do ACM",
      },
      { cmd: "az keyvault list --output table", note: "cofres do Key Vault" },
      { cmd: "az network dns zone list --output table", note: "zonas do Azure DNS" },
    ],
    handsOnIntro:
      "Pit lane aberto: DNS e certificados lidos direto do terminal, depois o segredo guardado e lido de volta nos dois cofres.",
    handsOn: [
      "Rode dig e openssl contra example.com e anote o TTL e a data notAfter.",
      "Leitura: liste segredos, certificados, zonas hospedadas, web ACLs e cofres nos dois provedores.",
      "Opcional (custo muito baixo): crie o segredo e leia-o de volta nos dois. Zonas hospedadas têm custo mensal: use com cuidado.",
      "Responda: usuários na Europa e no Brasil com failover pedem Latency no Route 53 ou Performance no Traffic Manager.",
      "Limpeza: aws secretsmanager delete-secret --secret-id lab/senha-banco --force-delete-without-recovery; az group delete --name rg-lab --yes e az keyvault purge --name kv-<NOME-UNICO> por causa do soft delete.",
    ],
    tip: "A melhor senha é a que não existe: IAM Role e Managed Identity dispensam o segredo na origem.",
    takeaway:
      "Segredo no cofre, tráfego filtrado pelo WAF, certificado renovado por máquina e DNS com política de roteamento.",
  },
  {
    id: "az11",
    num: "11",
    navTitle: "Certificações",
    tag: "estudo e carreira",
    title: "AWS Academy, estudo e certificações (e o caminho Microsoft)",
    lead: "Certificação valida, laboratório ensina, e as duas coisas precisam de atualização: nomes, preços e grades mudam, então confira sempre o site oficial.",
    concept: [
      "Certificação em nuvem é uma prova aplicada pelo próprio provedor, com níveis de entrada, intermediário, avançado e especialidades. Não é exigida por lei, mas vira critério de seleção em muitas vagas. Programas educacionais oferecem laboratórios em ambiente temporário, sem custo de conta pessoal. A preparação combina prática, documentação, simulados e revisão de cada erro, e a jornada pede recertificação.",
      "Conforme o material (junho de 2025): Foundational (Cloud Practitioner) com 90 minutos e 100 dólares; Associate com 90 minutos e 150 dólares; Professional e Specialty com 170 minutos e 300 dólares. Do lado Microsoft (acréscimo, comparação aproximada e não oficial): AZ-900 na entrada, AZ-104 em administração, AZ-204 em desenvolvimento, AZ-305 em arquitetura e AZ-400 em DevOps. Confira tudo no site oficial antes de planejar.",
      "Onde eles diferem de verdade: muitas certificações AWS se organizam por nível (Foundational, Associate, Professional, Specialty); a Microsoft organiza por função e por nível (Fundamentals, Associate, Expert, Specialty), e os títulos Expert exigem uma Associate como pré-requisito. Nos dois lados as grades são reorganizadas periodicamente: este conteúdo não é fonte da lista vigente.",
      "Na pista: os níveis são as categorias de base (F4, F3, F2 e F1), o programa educacional é o simulador da fábrica e a recertificação é o regulamento que muda a cada temporada. A estratégia de corrida é revista a cada volta pela telemetria; o plano de estudo se corrige do mesmo jeito, pelos resultados dos simulados.",
    ],
    pointsTitle: "Subindo de categoria",
    points: [
      { t: "Conforme o material", d: "Números de 2025: confira o site oficial.", color: "ember" },
      {
        t: "Laboratório",
        d: "AWS Academy e sandboxes do Microsoft Learn, sem fatura pessoal.",
        color: "blue",
      },
      {
        t: "Simulado e erro",
        d: "Rodar a volta, achar onde perdeu tempo, estudar aquele trecho.",
        color: "signal",
      },
    ],
    examplesTitle: "A ronda final nas duas contas",
    examples: [
      {
        label: "AWS",
        lang: "sh",
        code: `# Rode na região em que você praticou; cada linha vazia é boa notícia
$ export AWS_DEFAULT_REGION=sa-east-1
# Instâncias EC2 que não foram encerradas (paradas também cobram disco)
$ aws ec2 describe-instances --query "Reservations[].Instances[?State.Name!='terminated'].[InstanceId,State.Name]" --output text
# Zonas hospedadas do Route 53 (cobram por mês)
$ aws route53 list-hosted-zones --query "HostedZones[].[Id,Name]" --output text
# Volumes EBS (inclusive os soltos, sem instância)
$ aws ec2 describe-volumes --query "Volumes[].[VolumeId,State,Size]" --output text
# Tabelas DynamoDB e segredos criados nas Etapas 06 e 10
$ aws dynamodb list-tables --query TableNames --output text
$ aws secretsmanager list-secrets --query "SecretList[].Name" --output text`,
      },
      {
        label: "Azure",
        lang: "sh",
        code: `# Azure (acréscimo): todos os recursos e grupos da assinatura
$ az resource list --output table
$ az group list --query "[].name" --output tsv
# Se algo que você criou ainda aparece, apague-o ou use o az group delete
$ az group delete --name rg-lab --yes --no-wait`,
      },
    ],
    commands: [
      {
        cmd: "aws eks list-clusters --query clusters --output text",
        note: "plano de controle e nós cobram por hora",
      },
      {
        cmd: 'aws ec2 describe-addresses --query "Addresses[].[PublicIp,AllocationId,InstanceId]" --output text',
        note: "IPv4 público cobra, associado ou não",
      },
      { cmd: "aws s3 ls", note: "buckets que sobraram" },
      {
        cmd: "az keyvault list-deleted --output table",
        note: "cofres apagados que ainda reservam o nome",
      },
    ],
    handsOnIntro:
      "Volta de planejamento: um perfil, os guias de exame dos dois lados, um cruzamento com as etapas e uma sessão de laboratório por semana.",
    handsOn: [
      "Escolha um perfil: administração, desenvolvimento, arquitetura ou DevOps.",
      "Abra no site oficial de cada provedor a certificação de entrada e a do nível seguinte, e anote o guia do exame e o idioma das provas.",
      "Cruze cada domínio do exame com a etapa deste guia (01 a 10) que o cobre, com prático feito e data de revisão.",
      "Agende uma sessão de laboratório por semana em um recurso gratuito (AWS Academy, Microsoft Learn ou conta gratuita, cujas regras mudam).",
      "Antes de encerrar o dia, faça a ronda de limpeza nas duas contas e apague o que sobrou ligado.",
    ],
    tip: "Desenvolvedor back-end: Cloud Practitioner e AZ-900 como entrada, depois Developer Associate e AZ-204, conferindo as grades vigentes.",
    takeaway:
      "Certificação valida, laboratório ensina, e nomes, preços e grades mudam: a fonte é sempre o site oficial.",
  },
];
