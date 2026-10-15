// Conteúdo das seis aulas da disciplina "Arquitetura Cloud" (Fase 1), uma etapa por aula,
// tematizado com Fórmula 1 pelo pipeline /otimizar-relatorio (relatorios/arquitetura-cloud/final.md).

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
    f1: "O circuito: a infraestrutura que a equipe usa para operar (garagem, energia, rede, cronometragem); a mesma equipe opera nos dois",
  },
  {
    tema: "Nuvem pública, privada e híbrida",
    f1: "O circuito compartilhado pelas 11 equipes; a fábrica da equipe; e as duas ligadas por uma conexão",
  },
  {
    tema: "IaaS, PaaS, SaaS e FaaS",
    f1: "Garagem vazia com carro-padrão; garagem equipada e mantida pelo circuito; serviço pronto, como a cronometragem oficial; pit stop disparado pela chamada do box",
  },
  {
    tema: "Responsabilidade compartilhada",
    f1: "O circuito cuida de pista, barreiras e estrutura; a equipe cuida do carro, da garagem e de quem entra nela",
  },
  {
    tema: "VM (instância)",
    f1: "Um carro: a unidade de capacidade que vai para a pista (na IaaS, o carro-padrão que o circuito entrega)",
  },
  {
    tema: "Região e zona de disponibilidade",
    f1: "A sede geográfica do circuito; e os pavilhões independentes dentro dela, cada um com energia, refrigeração e rede próprias",
  },
  {
    tema: "Redundância em paralelo",
    f1: "Os dois carros da equipe: se um abandona, o outro ainda pontua",
  },
  {
    tema: "SLI, SLO e SLA",
    f1: "O número na telemetria; a meta interna com folga; o limite formal que custa penalidade",
  },
  {
    tema: "Circuit Breaker",
    f1: "Desligar o sistema que falha em sequência e, algumas voltas depois, tentar um único reset",
  },
  {
    tema: "VPC e sub-redes",
    f1: "A área reservada da equipe no circuito, dividida em setores com acessos diferentes",
  },
  {
    tema: "IAM",
    f1: "O credenciamento: quem é você e onde a sua credencial deixa entrar",
  },
  {
    tema: "FinOps e tags",
    f1: "O teto de gastos e a etiqueta de cada peça com o seu centro de custo",
  },
];

export const ANALOGY_NOTES: string[] = [
  "Um circuito real fica num lugar só. Um provedor tem sedes em dezenas de lugares do mundo (as regiões); aqui, leia circuito como o dono da infraestrutura, com várias sedes.",
  "Dois carros, sempre: o regulamento fixa dois carros por equipe. Na nuvem, o número de máquinas sobe e desce sozinho; escala horizontal e elasticidade não têm equivalente na pista.",
  "Pavilhões independentes não existem no autódromo: as garagens dividem um único prédio dos boxes, e um problema nele atinge todas. Zonas de disponibilidade são fisicamente separadas justamente para evitar isso.",
  "O circuito não se escolhe: o calendário decide onde a equipe corre. Na nuvem, a escolha do provedor é sua, a saída pode custar caro (lock-in) e dá para usar os dois ao mesmo tempo.",
  "Peça é matéria; dado é cópia. Uma peça existe numa unidade; um objeto, um disco replicado ou uma cópia em cache existe em quantas cópias você quiser.",
];

export const LESSONS: Lesson[] = [
  {
    id: "ac1",
    num: "01",
    navTitle: "Computação em nuvem",
    tag: "CapEx x OpEx",
    title: "Introdução à Computação em Nuvem",
    lead: "Nuvem é computação vendida como serviço: você troca capital parado (CapEx) por consumo medido (OpEx), e só ganha de verdade quando a carga varia ou quando precisa de velocidade, alcance e resiliência que não compraria sozinho.",
    concept: [
      "Computação em nuvem é a entrega de recursos de computação (hardware, armazenamento, bancos, rede e software) sob demanda, por uma rede, sem que você gerencie a infraestrutura física. Como a rede elétrica: você não constrói uma usina para ligar a geladeira, liga o aparelho e paga pelo consumo. A TI tradicional sofre com CapEx alto, ciclos longos de compra, falta de elasticidade e vulnerabilidade a desastres locais.",
      "CapEx é investimento único em ativo fixo, depreciado ao longo dos anos; OpEx é gasto recorrente por uso ou assinatura. Trocar um pelo outro não é ficar mais barato por definição: é transformar custo fixo em variável. Escalabilidade é a capacidade de crescer, vertical (máquina maior) ou horizontal (mais máquinas); elasticidade é crescer e encolher sozinho, em tempo real, pagando só pelo que se usa.",
      "Nuvem pública é multi-tenant, privada é dedicada a uma organização e híbrida integra as duas por VPN, conexão dedicada e APIs. Lado a lado: Site-to-Site VPN (AWS) e VPN Gateway (Azure) fazem o túnel IPsec; Direct Connect e ExpressRoute são a conexão privada dedicada; AWS Outposts é hardware da AWS no seu data center, e o par mais próximo é o Azure Stack, porque o Azure Arc não é hardware, é um plano de gerenciamento. O CAF da AWS se organiza por perspectivas; o da Microsoft, por ciclo de fases.",
      "Leitura de pista: cada provedor é um circuito. A equipe não constrói o autódromo para correr: ocupa a garagem, usa energia, rede e cronometragem de lá e opera. CapEx é construir o próprio túnel de vento; OpEx é pagar por hora de túnel numa instalação de terceiros. Nuvem híbrida é o que as equipes fazem em todo GP: a garagem no circuito ligada à sala de operações remota na fábrica, porque o projeto do carro fica em casa.",
    ],
    pointsTitle: "O que a nuvem muda",
    points: [
      {
        t: "Custo fixo vira variável",
        d: "OpEx só vence o CapEx quando a carga varia; com carga plana, a conta pode inverter.",
        color: "blue",
      },
      {
        t: "Elasticidade não é escalabilidade",
        d: "Escalar é poder crescer; elasticidade é crescer e encolher sozinho, nos dois sentidos.",
        color: "signal",
      },
      {
        t: "Outposts não é Arc",
        d: "Outposts é hardware do provedor no seu local; Arc é gestão do provedor sobre o seu local.",
        color: "ember",
      },
    ],
    examplesTitle: "Quanto custa o pico (números fictícios)",
    examples: [
      {
        label: "capex_opex.sh",
        lang: "sh",
        code: `awk 'BEGIN {
  # ATENÇÃO: todos os valores são FICTÍCIOS. UM = unidade monetária inventada.

  # --- Mundo 1: servidores próprios (CapEx) ---
  preco_servidor = 3600       # compra de 1 servidor
  qtd_pico = 10               # compramos para o pior dia do ano
  vida_util = 36              # meses em que o ativo é depreciado
  manutencao = 300            # custo mensal fixo de manutenção
  onprem = qtd_pico * preco_servidor / vida_util + manutencao   # custo mensal equivalente

  # --- Mundo 2: nuvem (OpEx, pagamento por hora) ---
  preco_hora = 0.50           # 1 VM por hora
  horas_mes = 730             # aproximação de horas em um mês
  normal = 2 * preco_hora * horas_mes    # 11 meses com 2 VMs
  pico   = 10 * preco_hora * horas_mes   # 1 mês (novembro) com 10 VMs
  nuvem  = (11 * normal + pico) / 12     # média mensal ao longo do ano

  printf "on-premises: %.2f UM/mes\\n", onprem
  printf "nuvem:       %.2f UM/mes\\n", nuvem
}'`,
        note: "Saída: on-premises 1300.00 e nuvem 973.33 UM/mes. Com pico de 4 VMs, inverte: 700.00 contra 790.83.",
      },
      {
        label: "regiões AWS",
        lang: "sh",
        code: `$ aws ec2 describe-regions --query "Regions[].RegionName" --output text
# --query: filtro JMESPath, pega só o campo RegionName de cada região
# --output text: imprime em uma linha, separado por tabulação
ap-south-1  eu-west-1  ... sa-east-1  us-east-1  us-west-2 ...`,
        note: "Saída ilustrativa: a lista varia conforme as regiões habilitadas na conta.",
      },
      {
        label: "regiões Azure",
        lang: "sh",
        code: `$ az account list-locations --query "[?metadata.regionType=='Physical'].{regiao:name, nome:displayName}" --output table
Regiao       Nome
-----------  ------------
brazilsouth  Brazil South
eastus       East US
...`,
        note: "sa-east-1 (AWS) e brazilsouth (Azure) ficam em São Paulo: nomes diferentes, mesma ideia.",
      },
    ],
    commands: [
      {
        cmd: 'sh "$LAB"/etapa-01/capex_opex.sh',
        note: "compara CapEx e OpEx com números fictícios",
      },
      { cmd: "aws --version", note: "confere a AWS CLI (não precisa de conta)" },
      { cmd: "az --version", note: "confere a Azure CLI e as extensões" },
      {
        cmd: 'aws ec2 describe-regions --query "Regions[].RegionName" --output text',
        note: "regiões habilitadas na conta AWS",
      },
    ],
    handsOnIntro:
      "Mexa nos números do Mercadinho e veja a vantagem da nuvem encolher; depois pergunte a cada circuito onde ficam as sedes dele. Só leitura, nada é criado.",
    handsOn: [
      'Defina LAB="$HOME/lab-cloud", crie as pastas etapa-01 a etapa-06 e salve o capex_opex.sh.',
      "Rode o script e confira 1300.00 contra 973.33 UM/mes.",
      "Troque qtd_pico e as VMs do mês de pico de 10 para 4 e veja a vantagem inverter (700.00 contra 790.83).",
      "Com as CLIs autenticadas (aws configure e az login), liste as regiões da AWS e da Azure.",
      "Ache São Paulo nas duas listas: sa-east-1 na AWS, brazilsouth na Azure.",
    ],
    tip: "Números de mercado como 50% dos recursos de nuvem dedicados a IA até 2029 (material, ref. jun/2025) são contexto, não dado atual.",
    takeaway:
      "Nuvem troca CapEx por OpEx e só compensa de verdade quando a carga varia ou quando você precisa de alcance e resiliência que não compraria sozinho.",
  },
  {
    id: "ac2",
    num: "02",
    navTitle: "Modelos de serviço",
    tag: "IaaS, PaaS, SaaS, FaaS",
    title: "Modelos de Serviço: IaaS, PaaS, SaaS e FaaS",
    lead: "Quanto mais alto o modelo, menos você opera e menos você controla, mas os seus dados e o seu acesso continuam sempre sendo seus.",
    concept: [
      "Os modelos de serviço respondem a uma pergunta: quanto da pilha eu quero operar e quanto quero terceirizar? IaaS entrega servidores, armazenamento e rede, e você cuida do SO para cima. PaaS cuida de servidores, SO, runtime e middleware, e você traz código e dados. SaaS é a aplicação pronta, multi-tenant, por assinatura. FaaS executa funções pequenas disparadas por eventos, escala de zero ao pico e cobra pelo tempo de execução.",
      "Na matriz de responsabilidade, a linha Dados é do cliente em todos os modelos, inclusive no SaaS: é a segurança na nuvem (cliente) contra a segurança da nuvem (provedor). Não existe modelo melhor; existe o que combina com requisitos, equipe, sensibilidade dos dados e orçamento. Mais abstração traz conveniência e risco de vendor lock-in.",
      "Lado a lado: EC2 e Azure Virtual Machines (instance type contra VM size); EBS e Managed Disks; Lambda e Azure Functions. Elastic Beanstalk e App Service fazem a mesma promessa com filosofias diferentes: o Beanstalk deixa visíveis na sua conta as instâncias, o balanceador e o autoscaling; o App Service hospeda por plano sem expor a infraestrutura. Na AWS, HTTP para a função costuma passar pelo API Gateway; na Azure, o gatilho HTTP vem na própria Function.",
      "Leitura de pista: IaaS é a garagem vazia com energia, rede e um carro-padrão; PaaS é a garagem equipada e mantida pelo circuito; SaaS é a cronometragem oficial; FaaS é o pit stop, disparado pela chamada do box, curto e sem memória. Quando entra um safety car, quase todos os carros pedem box na mesma volta e depois o pit lane fica vazio por muito tempo: é o perfil de carga da FaaS, com picos curtos e longos períodos sem nada.",
    ],
    pointsTitle: "Regras da escada",
    points: [
      {
        t: "Dados são sempre seus",
        d: "Em IaaS, PaaS, SaaS ou FaaS, quem decide o que se guarda e quem acessa é o cliente.",
        color: "blue",
      },
      {
        t: "FaaS é stateless",
        d: "Estado que importa vai para banco, cache ou objeto; variável global não é confiável.",
        color: "ember",
      },
      {
        t: "Cold start e timeout",
        d: "O preço da FaaS: latência inicial, tempo máximo de execução e testes mais complexos.",
        color: "signal",
      },
    ],
    examplesTitle: "Por que stateless importa",
    examples: [
      {
        label: "funcao.py",
        lang: "sh",
        code: `contador = 0  # estado guardado em memória do processo: NÃO é confiável em FaaS


def handler(evento):
    global contador  # permite alterar a variável de fora da função
    contador += 1  # soma 1 a cada invocação que cair NESTA instância
    return {"recebido": evento, "contador": contador}

$ cd "$LAB"/etapa-02    # entra na pasta para o python3 encontrar o funcao.py
$ python3 -c "import funcao; print(funcao.handler('a')); print(funcao.handler('b'))"
{'recebido': 'a', 'contador': 1}
{'recebido': 'b', 'contador': 2}`,
        note: "Funcionou porque as duas chamadas caíram no mesmo processo. Em Lambda ou Azure Functions, outra instância recomeça do 1.",
      },
      {
        label: "AWS: t3.micro",
        lang: "sh",
        code: `$ aws ec2 describe-instance-types --instance-types t3.micro --query "InstanceTypes[].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB]" --output text
t3.micro	2	1024`,
        note: "Só descreve o tipo no catálogo; não cria instância.",
      },
      {
        label: "Azure: Standard_B1s",
        lang: "sh",
        code: `$ az vm list-skus --location eastus --size Standard_B1s --resource-type virtualMachines --query "[?name=='Standard_B1s'] | [0].capabilities[?name=='vCPUs' || name=='MemoryGB']" --output table
Name      Value
--------  -------
vCPUs     1
MemoryGB  1`,
        note: "O az vm list-sizes está obsoleto e imprime aviso de depreciação; use az vm list-skus.",
      },
    ],
    commands: [
      {
        cmd: "aws elasticbeanstalk describe-applications",
        note: "PaaS na AWS: aplicações do Beanstalk",
      },
      { cmd: "aws lambda list-functions", note: "FaaS na AWS: lista funções" },
      { cmd: "az webapp list --output table", note: "PaaS na Azure: aplicações do App Service" },
      { cmd: "az functionapp list --output table", note: "FaaS na Azure: lista Function Apps" },
    ],
    handsOnIntro:
      "Papel e caneta para a sua própria pilha, depois a ficha do carro-padrão de cada circuito e uma conferência de garagem que, em conta nova, volta vazia.",
    handsOn: [
      "Pegue um sistema que você conhece e preencha a matriz de responsabilidade para IaaS, PaaS e FaaS, marcando a linha Dados.",
      "Crie o funcao.py, rode as duas invocações e explique por que o contador não é confiável em FaaS.",
      "Descreva o t3.micro na AWS e o Standard_B1s na Azure: CPUs e memória do carro-padrão.",
      "Liste aplicações do Beanstalk e do App Service e funções de Lambda e Azure Functions.",
      'Confirme que, em conta nova, as listas voltam vazias: {"Applications": []}, {"Functions": []} e nenhuma linha na Azure.',
    ],
    tip: "Cobrança de FaaS não tem conversão 1 para 1: unidades, limites de tempo e formas de reduzir cold start diferem entre Lambda e Functions.",
    takeaway:
      "Suba ou desça a escada de IaaS a FaaS sabendo o que é seu em cada degrau; a linha Dados nunca muda de dono.",
  },
  {
    id: "ac3",
    num: "03",
    navTitle: "Infraestrutura",
    tag: "regiões, SLA, disjuntor",
    title: "Infraestrutura de Nuvem",
    lead: "Zonas protegem de falhas de data center, regiões protegem de falhas geográficas, a borda aproxima o usuário, e cada nove de disponibilidade tem que justificar o que custa.",
    concept: [
      "Região é uma área geográfica isolada de falhas em outras regiões. Zona de disponibilidade (AZ) é um local isolado dentro da região, com energia, refrigeração e rede independentes: um domínio de falha. Ponto de presença (PoP) é a porta de entrada da rede do provedor perto do usuário. Recurso zonal vive numa zona (mais barato); regional é replicado entre zonas (mais disponível). Latência se mede por RTT: de 30 a 40 ms costuma ser aceitável.",
      "Lado a lado: Regions e AZs existem nos dois, mas na Azure nem toda região tem zonas, e nos dois o rótulo da zona é mapeado por conta ou assinatura (a AWS expõe o zone ID estável, como sae1-az1). Auto Scaling Groups e Virtual Machine Scale Sets; ALB e Application Gateway na camada 7; NLB e Azure Load Balancer na camada 4, os dois distribuindo por fluxo com hash; CloudFront e Front Door na borda.",
      "SLI é a medida bruta, SLO a meta interna com orçamento de erros, SLA a promessa formal ao cliente, sempre mais conservadora. Em série, a disponibilidade é o produto (0,999 x 0,999 = 99,8001%); em paralelo, só cai quando ambos caem (99,9999%), supondo falhas independentes. O Circuit Breaker abre depois de falhas seguidas, falha rápido e, passada a espera, deixa uma tentativa passar. Não é serviço de provedor: é padrão no seu código, válido em AWS e Azure.",
      "Leitura de pista: série é o próprio carro, em que qualquer sistema que falha para tudo; paralelo são os dois carros. Se um carro abandona, a equipe ainda pontua com o outro. Mas se a equipe larga com a mesma escolha errada de pneu nos dois carros, os dois despencam juntos: redundância não protege contra a falha que os dois compartilham.",
    ],
    pointsTitle: "Contas que sustentam o setor",
    points: [
      {
        t: "Cada nove corta por dez",
        d: "99,9% permite 525,6 min/ano; 99,999% permite cerca de 5,26 min/ano.",
        color: "blue",
      },
      {
        t: "Paralelo exige independência",
        d: "Duas zonas com o mesmo deploy ruim caem juntas; o modelo não é garantia.",
        color: "ember",
      },
      {
        t: "Retry x Circuit Breaker",
        d: "Retry ajuda na falha passageira; o disjuntor impede insistir na falha persistente.",
        color: "signal",
      },
    ],
    examplesTitle: "A conta dos noves e o disjuntor",
    examples: [
      {
        label: "noves.sh",
        lang: "sh",
        code: `awk 'BEGIN {
  n = split("99.9 99.95 99.99 99.999", disp, " ")   # as disponibilidades a calcular
  minutos_ano = 365 * 24 * 60                       # minutos em um ano de 365 dias
  for (i = 1; i <= n; i++) {
    # downtime permitido = (100 - disponibilidade)% do ano
    printf "%s%% -> %.2f min/ano\\n", disp[i], (100 - disp[i]) / 100 * minutos_ano
  }
}'`,
        note: "Saída: 525.60, 262.80, 52.56 e 5.26 min/ano.",
      },
      {
        label: "disjuntor.py",
        lang: "sh",
        code: `import time


class Disjuntor:
    def __init__(self, limite=3, espera=2.0):
        self.limite = limite          # quantas falhas seguidas abrem o disjuntor
        self.espera = espera          # segundos aberto antes de aceitar uma nova tentativa
        self.falhas = 0               # contador de falhas seguidas
        self.aberto_em = None         # instante em que abriu (None = fechado)

    def chamar(self, funcao):
        if self.aberto_em is not None:                       # disjuntor aberto?
            if time.time() - self.aberto_em < self.espera:   # ainda no tempo de espera
                return "ABERTO: nem tentei"                  # falha rápido, sem sobrecarregar o serviço
            self.aberto_em = None                            # passou o tempo: deixa UMA tentativa passar
        try:
            resultado = funcao()                             # chama o serviço remoto
            self.falhas = 0                                  # sucesso zera o contador
            return f"ok: {resultado}"
        except Exception:
            self.falhas += 1                                 # mais uma falha seguida
            if self.falhas >= self.limite:
                self.aberto_em = time.time()                 # abre o disjuntor
            return f"falhou ({self.falhas})"`,
        note: "Com o serviço fora do ar: falhou (1), (2), (3), três vezes ABERTO: nem tentei e, depois da espera, ok: 200.",
      },
      {
        label: "zonas: AWS x Azure",
        lang: "sh",
        code: `$ aws ec2 describe-availability-zones --region sa-east-1 --query "AvailabilityZones[].[ZoneName,ZoneId,State]" --output text
sa-east-1a	sae1-az1	available
sa-east-1b	sae1-az2	available
sa-east-1c	sae1-az3	available
$ az vm list-skus --location brazilsouth --zone --resource-type virtualMachines --output table | head -n 5
# colunas ResourceType, Locations, Name, Zones e Restrictions; Zones mostra algo como 1,2,3`,
        note: "Saídas ilustrativas: o mapeamento letra para ID pode diferir na sua conta. Na Azure, lista vazia indica região sem zonas.",
      },
    ],
    commands: [
      { cmd: 'sh "$LAB"/etapa-03/noves.sh', note: "downtime permitido por SLA" },
      { cmd: 'python3 "$LAB"/etapa-03/disjuntor.py', note: "o disjuntor abrindo e fechando" },
      {
        cmd: 'aws ec2 describe-instances --query "Reservations[].Instances[].[InstanceId,InstanceType,State.Name]" --output table',
        note: "compute existente na AWS (conta nova: vazio)",
      },
      { cmd: "az vm list --output table", note: "compute existente na Azure (conta nova: vazio)" },
    ],
    handsOnIntro:
      "Mude o limite e a espera do disjuntor e escreva a saída antes de rodar; depois, as zonas de uma região, direto de cada circuito.",
    handsOn: [
      "Rode noves.sh e disjuntor.py e confira as saídas.",
      "Troque d = Disjuntor() por d = Disjuntor(limite=2, espera=5) e preveja a saída antes de rodar.",
      "Confirme que a última linha continua ABERTO: a espera de 2,1 s é menor que 5 s; troque o sleep por 5.1 para ver ok: 200.",
      "Calcule 99,9% em 30 dias (43,2 min) e três componentes em série a 99,9% (cerca de 99,70%).",
      "Liste as zonas de sa-east-1 na AWS e de brazilsouth na Azure.",
    ],
    tip: "Não existe um SLA da AWS ou da Azure único: leia o SLA do serviço específico, que muda conforme a topologia (instância única ou várias zonas).",
    takeaway:
      "Zona protege do prédio, região protege da cidade, e disponibilidade se calcula: série multiplica, paralelo só vale com falhas independentes.",
  },
  {
    id: "ac4",
    num: "04",
    navTitle: "Provedores",
    tag: "método e lock-in",
    title: "Principais Provedores de Nuvem",
    lead: "Escolha o provedor com critérios e pesos combinados com o negócio, e trate o lock-in como um custo que você decide pagar de olhos abertos.",
    concept: [
      "O mercado é dominado por AWS, Azure, Google Cloud e OCI. A AWS lidera com mais de 200 serviços (material, ref. jun/2025) e um ecossistema que cria gravidade; a Azure se destaca na integração com o ecossistema Microsoft, na vocação híbrida (Arc) e em IA; o GCP se posiciona em dados, IA e rede global. Participações citadas: AWS cerca de 33%, Azure 23%, GCP cerca de 10% (material, ref. jun/2025), com datas de referência diferentes, que não se somam.",
      "A metodologia do material tem seis critérios: ofertas de IaaS, PaaS e SaaS; regiões e AZs; precificação e TCO; SLAs e suporte; conformidade e certificações; ferramentas de gerenciamento. Uma matriz ponderada tira a decisão da emoção, mas quem define os pesos define o resultado, por isso os pesos se combinam com o negócio antes de pontuar.",
      "O mapa de portfólio põe os pares lado a lado: EKS e AKS; S3 e Blob Storage; Aurora e RDS contra Azure SQL Database; DynamoDB e Cosmos DB; Redshift contra Synapse e Fabric; CloudFormation contra ARM e Bicep; CloudWatch e Azure Monitor. Bedrock contra Azure AI Foundry é pareamento aproximado. Vendor lock-in se mitiga com prova de conceito, portabilidade de dados, backups próprios e multicloud ou híbrido; usar só o mínimo comum desperdiça o melhor de cada plataforma.",
      "Leitura de pista: AWS e Azure são circuitos, não equipes, e comparar é avaliar instalações, nunca torcer. A matriz é a conta do set-up: num circuito de rua cheio de curvas lentas, a carga aerodinâmica pesa mais que a velocidade de reta; numa pista rápida o peso se inverte. Lock-in é o equipamento de garagem fabricado para encaixar só nas instalações de um circuito.",
    ],
    pointsTitle: "Como comparar sem torcida",
    points: [
      {
        t: "Seis critérios",
        d: "Ofertas, regiões, preço, SLA, conformidade e ferramentas, sempre com pesos.",
        color: "blue",
      },
      {
        t: "Peso decide",
        d: "A mesma nota com outros pesos inverte o vencedor; combine os pesos antes.",
        color: "ember",
      },
      {
        t: "Datas não se somam",
        d: "33%, 23% e 10% (material, ref. jun/2025) têm datas diferentes: não formam uma fotografia única.",
        color: "signal",
      },
    ],
    examplesTitle: "A matriz de decisão",
    examples: [
      {
        label: "matriz.sh",
        lang: "sh",
        code: `awk 'BEGIN {
  # critérios, na ordem: ecossistema existente, custo, conformidade, ferramentas, regiões
  split("30 25 20 15 10", peso, " ")     # pesos (somam 100)
  split("5 3 4 3 4", op1, " ")           # notas fictícias da Opção 1
  split("3 4 4 4 5", op2, " ")           # notas fictícias da Opção 2
  for (i = 1; i <= 5; i++) {
    soma1 += peso[i] * op1[i]            # soma ponderada da Opção 1
    soma2 += peso[i] * op2[i]            # soma ponderada da Opção 2
  }
  printf "opcao 1: %.2f | opcao 2: %.2f\\n", soma1 / 100, soma2 / 100
}'`,
        note: "Notas fictícias de Opção 1 e Opção 2: não é avaliação de nenhum provedor real.",
      },
      {
        label: "pesos trocados",
        lang: "sh",
        code: `$ sh "$LAB"/etapa-04/matriz.sh
opcao 1: 3.90 | opcao 2: 3.80
# troque "30 25 20 15 10" por "10 35 20 15 20" (menos ecossistema, mais custo e regiões)
$ sh "$LAB"/etapa-04/matriz.sh
opcao 1: 3.60 | opcao 2: 4.10`,
        note: "O vencedor inverteu sem que nenhuma nota mudasse.",
      },
      {
        label: "regiões: AWS x Azure",
        lang: "sh",
        code: `$ aws ec2 describe-regions --query "length(Regions)"
$ az account list-locations --query "length([?metadata.regionType=='Physical'])"
# cada comando imprime um número inteiro`,
        note: "Número de regiões não é número de AZs, e contar regiões não mede resiliência.",
      },
    ],
    commands: [
      { cmd: 'sh "$LAB"/etapa-04/matriz.sh', note: "matriz ponderada com notas fictícias" },
      {
        cmd: 'aws ec2 describe-regions --query "length(Regions)"',
        note: "quantas regiões a conta AWS enxerga",
      },
      {
        cmd: "az account list-locations --query \"length([?metadata.regionType=='Physical'])\"",
        note: "quantas regiões físicas a assinatura Azure enxerga",
      },
    ],
    handsOnIntro:
      "Troque os pesos da matriz para dois cenários, conte as sedes de cada circuito e faça o inventário honesto do que custaria sair.",
    handsOn: [
      "Rode a matriz com os dois conjuntos de pesos e confira 3.90 contra 3.80 e depois 3.60 contra 4.10.",
      "Invente pesos para uma empresa que já usa Active Directory e Microsoft 365 e para uma startup de dados sem legado.",
      "Conte as regiões da AWS e da Azure com os comandos de leitura.",
      "Liste cinco serviços do seu projeto e marque se há equivalente no outro provedor e se o formato dos dados é aberto.",
      "Estime quanto custaria sair de cada um, em tempo e em dinheiro: é o seu inventário de lock-in.",
    ],
    tip: "Multicloud tem custo próprio: complexidade, segurança consistente e transferência de dados entre provedores. Em 2022, 89% das organizações usavam mais de uma nuvem (material, ref. jun/2025).",
    takeaway:
      "Provedor se escolhe com método e pesos combinados com o negócio; lock-in é um custo assumido de olhos abertos.",
  },
  {
    id: "ac5",
    num: "05",
    navTitle: "Elementos",
    tag: "armazenamento, rede, IaC",
    title: "Elementos de Arquitetura Cloud",
    lead: "Escolha o bloco pelo problema e desenhe o endereçamento da rede antes de criar qualquer coisa, lembrando que a sub-rede é zonal na AWS e não é na Azure.",
    concept: [
      "Armazenamento de objeto (S3 e Blob Storage) escala quase sem limite e não se modifica em parte; bloco (EBS e Managed Disks) é rápido e anexado a uma VM; arquivo (EFS e Azure Files) é a pasta compartilhada. Bancos: relacional com ACID (RDS e Aurora contra Azure SQL Database e Azure Database for PostgreSQL e MySQL; o Aurora não tem par exato), NoSQL (DynamoDB e Cosmos DB), cache (ElastiCache e Azure Cache for Redis) e data warehouse (Redshift contra Synapse e Fabric).",
      "VPC (AWS) e VNet (Azure) são a sua rede privada, as duas de escopo regional. A diferença traiçoeira: na AWS a sub-rede é presa a uma AZ, então 2 zonas exigem no mínimo 2 sub-redes; na Azure a sub-rede abrange a região. A AWS usa Internet Gateway e rota para definir sub-rede pública; a Azure não tem Internet Gateway e exige sub-redes de nome fixo como GatewaySubnet. Cada sub-rede reserva 5 endereços: uma /24 tem 251 utilizáveis. Peering exige CIDRs sem sobreposição.",
      "Balanceamento de camada 4 decide por TCP e UDP; de camada 7, por conteúdo HTTP, com terminação SSL. CloudFront é principalmente CDN; o Front Door junta CDN, balanceamento de camada 7 entre regiões e WAF num serviço global. IaC descreve a infraestrutura em arquivo: CloudFormation na AWS, ARM e Bicep na Azure. O Well-Architected da AWS tem seis pilares (com Sustentabilidade); o da Azure é descrito com cinco.",
      "Leitura de pista: a VPC é a área reservada da equipe no circuito; as sub-redes são os setores (a frente voltada para o pit lane, o escritório nos fundos, a sala de dados sem saída); o NAT é o assessor de imprensa. Sobreposição de CIDR é dois carros com o mesmo número, e o cadastro central de CIDRs é o registro de números permanentes da FIA: confere-se antes de pintar o carro.",
    ],
    pointsTitle: "Blocos certos para cada problema",
    points: [
      {
        t: "Objeto, bloco, arquivo",
        d: "Fotos no objeto, disco do banco em bloco, documentos do time em arquivo.",
        color: "blue",
      },
      {
        t: "Sub-rede zonal só na AWS",
        d: "3 camadas em 3 zonas: 9 sub-redes na AWS, 3 na Azure.",
        color: "ember",
      },
      {
        t: "CIDR no papel primeiro",
        d: "Redes sobrepostas não se ligam por peering; renumerar depois é caro.",
        color: "signal",
      },
    ],
    examplesTitle: "Desenhar a rede antes de criá-la",
    examples: [
      {
        label: "cidr.py",
        lang: "sh",
        code: `import ipaddress
import itertools

# Espaço de endereços da rede virtual (VPC na AWS, VNet na Azure)
rede = ipaddress.ip_network("10.0.0.0/16")

# Plano: 3 camadas (publica, app, dados) x 2 zonas (a, b) = 6 sub-redes /24
plano = {
    "publica-a": "10.0.0.0/24",
    "publica-b": "10.0.1.0/24",
    "app-a": "10.0.10.0/24",
    "app-b": "10.0.11.0/24",
    "dados-a": "10.0.20.0/24",
    "dados-b": "10.0.21.0/24",
}

# Converte cada texto em um objeto de rede
subredes = {nome: ipaddress.ip_network(cidr) for nome, cidr in plano.items()}

for nome, sub in subredes.items():
    dentro = sub.subnet_of(rede)             # a sub-rede cabe dentro da rede grande?
    utilizaveis = sub.num_addresses - 5      # 5 endereços reservados pela plataforma (AWS e Azure)
    print(nome, sub, "dentro=" + str(dentro), "utilizaveis=" + str(utilizaveis))

# Procura pares que se sobrepõem: o resultado deve ser uma lista vazia
conflitos = [(a, b) for (a, ra), (b, rb) in itertools.combinations(subredes.items(), 2) if ra.overlaps(rb)]
print("conflitos:", conflitos)

# Teste de peering ou VPN: a rede da outra ponta pode se sobrepor à sua?
print("overlap com 192.168.0.0/16:", rede.overlaps(ipaddress.ip_network("192.168.0.0/16")))
print("overlap com 10.0.5.0/24:", rede.overlaps(ipaddress.ip_network("10.0.5.0/24")))`,
        note: "Saída: seis sub-redes com dentro=True e utilizaveis=251, conflitos: [], overlap False com 192.168.0.0/16 e True com 10.0.5.0/24.",
      },
      {
        label: "AWS: vpc.yaml",
        lang: "yaml",
        code: `AWSTemplateFormatVersion: "2010-09-09"   # versão do formato do template (valor fixo)
Description: VPC de estudo                # texto livre
Resources:
  Vpc:                                    # nome lógico do recurso dentro do template
    Type: AWS::EC2::VPC                   # tipo do recurso
    Properties:
      CidrBlock: 10.0.0.0/16              # espaço de endereços da VPC
      Tags:
        - Key: ambiente                   # tag de governança (Etapa 06)
          Value: teste
  SubredePublicaA:
    Type: AWS::EC2::Subnet                # sub-rede
    Properties:
      VpcId: !Ref Vpc                     # referência à VPC acima
      CidrBlock: 10.0.0.0/24
      AvailabilityZone: !Select [0, !GetAZs ""]   # a primeira AZ da região em que o stack for criado`,
        note: "Na AWS, a sub-rede é um recurso à parte, preso a uma AZ.",
      },
      {
        label: "Azure: vnet.bicep",
        lang: "sh",
        code: `param localizacao string = resourceGroup().location   // parâmetro: região do grupo de recursos

resource vnet 'Microsoft.Network/virtualNetworks@2023-11-01' = {   // tipo e versão da API
  name: 'vnet-loja'                                    // nome da VNet
  location: localizacao
  tags: {
    ambiente: 'teste'                                  // mesma tag de governança
  }
  properties: {
    addressSpace: {
      addressPrefixes: ['10.0.0.0/16']                 // espaço de endereços da VNet
    }
    subnets: [
      {
        name: 'publica'                                // na Azure, uma sub-rede por camada basta
        properties: {
          addressPrefix: '10.0.0.0/24'
        }
      }
    ]
  }
}`,
        note: "Na Azure, a sub-rede é uma propriedade da VNet e não é zonal.",
      },
    ],
    commands: [
      { cmd: 'python3 "$LAB"/etapa-05/cidr.py', note: "valida o plano de endereços" },
      {
        cmd: "az bicep build --file vnet.bicep",
        note: "compila o Bicep para ARM localmente, sem login",
      },
      {
        cmd: 'aws cloudformation validate-template --template-body "file://$LAB/etapa-05/vpc.yaml"',
        note: "só verifica a sintaxe; não cria a pilha",
      },
      {
        cmd: 'aws ec2 describe-subnets --query "Subnets[].[SubnetId,AvailabilityZone,CidrBlock]" --output text',
        note: "uma sub-rede por AZ: prova de que na AWS ela é zonal",
      },
    ],
    handsOnIntro:
      "Rode o plano de endereços, valide os dois arquivos de IaC sem criar nada e confira que, na AWS, cada sub-rede tem a sua zona.",
    handsOn: [
      "Rode o cidr.py e confirme conflitos: [] e a sobreposição com 10.0.5.0/24.",
      'Compile o vnet.bicep e procure "type": "Microsoft.Network/virtualNetworks" no vnet.json gerado.',
      "Valide o vpc.yaml com validate-template e veja a Description VPC de estudo no JSON de resposta.",
      "Liste VPCs e sub-redes na AWS (a VPC padrão usa 172.31.0.0/16) e as VNets na Azure.",
      "Planeje 10.20.0.0/16 com 3 camadas em 3 zonas: 9 sub-redes na AWS, 3 na Azure (mais a GatewaySubnet, se houver VPN).",
    ],
    tip: "Não rode create-stack nem az deployment create: eles criam recursos e podem gerar custo. Esta etapa é de leitura e validação.",
    takeaway:
      "Bloco certo para cada problema e endereçamento desenhado no papel, com a sub-rede zonal na AWS e regional na Azure.",
  },
  {
    id: "ac6",
    num: "06",
    navTitle: "Segurança e custos",
    tag: "IAM, chaves, FinOps",
    title: "Segurança, Custos e Boas Práticas",
    lead: "Segurança, custo e governança são requisitos de design: aplique menor privilégio e camadas de defesa, marque cada recurso com tags e meça o que importa antes de comprar desconto.",
    concept: [
      "No modelo de responsabilidade compartilhada, o provedor cuida da segurança da nuvem e você da segurança na nuvem: dados, configuração de rede, SO, aplicações e IAM. Erros de configuração do cliente estão entre as causas mais comuns de violação. Lado a lado: o AWS IAM cobre identidade e autorização dentro da conta; na Azure, o Entra ID cuida das identidades e o Azure RBAC das atribuições de papel com escopo. Os dois suportam MFA com FIDO2, o método mais robusto citado.",
      "Criptografia em trânsito (TLS) e em repouso (KMS na AWS, Key Vault na Azure, que guarda também segredos e certificados). Na criptografia de envelope, a DEK cifra os dados e a KEK cifra a DEK: girar a KEK só reenvelopa as DEKs. Rede em camadas: o Security Group é stateful e só permite; a NACL é stateless, por sub-rede, em ordem numérica; o NSG da Azure é stateful nos dois níveis, com permitir e negar por prioridade. WAF, Network Firewall contra Azure Firewall, Transit Gateway contra Virtual WAN.",
      "FinOps junta finanças, engenharia e negócio. Alavancas: agendamento para o intermitente, compromisso (Savings Plans e RIs; Azure Savings Plan e Reservations) para o estável, Spot para o que tolera interrupção, right-sizing e limpeza de discos órfãos. Cost Management e Trusted Advisor de um lado, Microsoft Cost Management e Azure Advisor do outro. Tags exigem política consistente: Tag Policies na AWS, Azure Policy na Azure, onde a tag do grupo de recursos não é herdada por padrão.",
      "Leitura de pista: IAM é o credenciamento do paddock, e menor privilégio é o convidado da hospitalidade sem acesso ao pit lane. Uma liberação insegura do box, com o carro saindo antes de a roda estar presa, mostra a responsabilidade compartilhada: a pista estava em ordem, a falha foi do procedimento da equipe. FinOps é o teto de gastos, e a tag é a etiqueta de cada peça com o seu centro de custo.",
    ],
    pointsTitle: "Três requisitos de design",
    points: [
      {
        t: "Menor privilégio",
        d: "Só as permissões mínimas, pelo tempo mínimo, com MFA na conta raiz.",
        color: "blue",
      },
      {
        t: "Stateful x stateless",
        d: "Security Group e NSG lembram a conexão; a NACL confere ida e volta.",
        color: "signal",
      },
      {
        t: "Desligar vale mais",
        d: "Agendar o que está parado economizou 63,8% sem contrato (números fictícios).",
        color: "ember",
      },
    ],
    examplesTitle: "Envelope, tags e caça a desperdício",
    examples: [
      {
        label: "envelope com openssl",
        lang: "sh",
        code: `$ cd "$LAB"/etapa-06
$ echo "dados do cliente" > dados.txt        # o segredo que queremos proteger
$ openssl rand -hex 32 > dek.key             # DEK: chave aleatória que criptografa os dados
$ openssl rand -hex 32 > kek.key             # KEK: chave que protege a DEK (no mundo real, fica no KMS ou Key Vault)
# 1) criptografa os dados com a DEK
$ openssl enc -aes-256-cbc -pbkdf2 -in dados.txt -out dados.enc -pass file:dek.key
# 2) criptografa (envelopa) a DEK com a KEK
$ openssl enc -aes-256-cbc -pbkdf2 -in dek.key -out dek.enc -pass file:kek.key
# 3) apaga a DEK em claro: ficam só os dados cifrados e a DEK cifrada
$ rm dek.key dados.txt
# 4) para ler de volta: primeiro abre o envelope (KEK -> DEK), depois decifra os dados (DEK -> dados)
$ openssl enc -d -aes-256-cbc -pbkdf2 -in dek.enc -out dek.key -pass file:kek.key
$ openssl enc -d -aes-256-cbc -pbkdf2 -in dados.enc -pass file:dek.key
dados do cliente`,
        note: "Demonstração didática (CBC com chave derivada de senha). No KMS e no Key Vault, a KEK nunca sai do serviço.",
      },
      {
        label: "auditor de tags",
        lang: "sh",
        code: `awk -F, 'NR>1 {
  total++                                              # conta recursos
  if ($2=="" || $3=="" || $4=="") {                    # alguma das tags obrigatórias vazia?
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
        note: "Inventário fictício. Com a regex ^(producao|teste|desenvolvimento)$, Producao vira erro e a cobertura cai para 2/6.",
      },
      {
        label: "desperdício: AWS x Azure",
        lang: "sh",
        code: `# Discos órfãos: status=available na AWS, Unattached na Azure
$ aws ec2 describe-volumes --filters Name=status,Values=available --query "Volumes[].[VolumeId,Size,CreateTime]" --output text
$ az disk list --query "[?diskState=='Unattached'].[name,diskSizeGb]" --output table
# Regras abertas ao mundo
$ aws ec2 describe-security-groups --filters Name=ip-permission.cidr,Values=0.0.0.0/0 --query "SecurityGroups[].[GroupId,GroupName]" --output text
$ az network nsg list --output table`,
        note: "Conta nova: saídas vazias. Se aparecer algum grupo aberto a 0.0.0.0/0, alguém o criou ou alterou.",
      },
    ],
    commands: [
      { cmd: 'sh "$LAB"/etapa-06/economia.sh', note: "agendamento, compromisso e Spot (fictício)" },
      {
        cmd: 'aws iam get-account-summary --query "SummaryMap.AccountMFAEnabled"',
        note: "1 se a conta raiz tem MFA, 0 se não",
      },
      {
        cmd: 'az role assignment list --all --query "[].{quem:principalName, papel:roleDefinitionName, escopo:scope}" --output table',
        note: "quem pode o quê, com escopo",
      },
      {
        cmd: "openssl s_client -connect example.com:443 -brief < /dev/null",
        note: "TLS de verdade: versão, cifra e verificação",
      },
    ],
    handsOnIntro:
      "O pit stop mais longo do guia: auditoria de tags, conta de economia, caça a desperdício e risco com comandos de leitura e um TLS de verdade.",
    handsOn: [
      "Rode a criptografia de envelope e recupere dados do cliente; depois apague dek.key, kek.key, dados.enc e dek.enc.",
      "Crie o inventario.csv fictício, rode o auditor e confira cobertura: 2/5 = 40%.",
      "Acrescente vm-api-01,Producao,loja,cc-100 e reescreva o auditor para tratar Producao como erro (2/6 = 33%).",
      "Rode economia.sh e compare: desligar fora do horário comercial (63.8%) contra compromisso e Spot.",
      "Procure discos órfãos, usuários sem MFA e regras abertas ao mundo na AWS e na Azure, só com leitura.",
    ],
    tip: "Na AWS, o Trusted Advisor (aws support describe-trusted-advisor-checks) depende do plano de suporte; erro de acesso sem o plano é esperado.",
    takeaway:
      "Menor privilégio, chave no cofre, firewall em camadas, etiqueta em cada peça e a alavanca de custo certa para cada carga.",
  },
];
