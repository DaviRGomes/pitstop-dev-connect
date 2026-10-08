# AWS e Azure lado a lado: a mesma equipe em dois circuitos, da primeira conta à arquitetura segura

*Boa tarde, boa noite, bom dia, onde quer que você esteja! Está no ar a transmissão do GP da Nuvem, com AWS e Azure lado a lado, e o grid já está formado. O que está em jogo nesta corrida é sair daqui operando nos dois circuitos com um procedimento só: identidade, rede, computação, dados, observabilidade e segurança, sem decorar tabela e sem deixar recurso esquecido gerando fatura.*

*O traçado tem onze setores, e eu narro cada um deles. Setor 1, a reta de largada: o que é nuvem, regiões, zonas e quem responde por quê. Setores 2 e 3, as primeiras curvas de alta: identidade e rede, onde se ganha ou se perde a segurança da corrida inteira. Setores 4 a 7, o miolo técnico do circuito: máquinas virtuais, containers, bancos de dados e serverless. Setores 8 a 10, o trecho de leitura de pista: telemetria e logs, entrega de conteúdo e, por fim, cofre, WAF, certificados e DNS. Setor 11, a volta de consagração: estudo, laboratório e certificações nos dois lados.*

*Antes da largada, dois combinados. Primeiro: os blocos que começam com "Leitura de cockpit" são a voz do piloto, em primeira pessoa. É ele quem traduz cada serviço para o paddock, e quando o texto diz "eu" ali, é o piloto falando de dentro do carro; os trechos "Aqui a analogia para" são ele avisando onde a comparação deixa de valer. Eu fico na cabine, em itálico, nas entradas e saídas de cada setor. Segundo: tudo o que é Azure vem marcado como acréscimo do professor, como a nota logo abaixo explica, e onde a F1 está na semana de 5 a 11 de outubro de 2026 o próprio piloto conta, logo depois das notas. Cinto afivelado, viseira abaixada. Vai começar!*

> Base técnica: a versão didática dos onze materiais da disciplina "AWS" (DevOps e Arquitetura Cloud, Fase 1, FIAP POSTECH). Cada aula virou uma etapa, na mesma ordem. O conteúdo AWS vem do material original. **Todo o conteúdo Azure é acréscimo didático do professor**: não consta nas aulas e aparece sempre identificado: nas tabelas, pela coluna "Azure (acréscimo)"; nos exemplos e comandos, pelo rótulo "Azure (acréscimo)" no título do bloco ou no comentário que abre o trecho Azure; nas seções "Onde eles diferem de verdade", que comparam os dois lados, todo o lado Azure também é acréscimo. Assim você nunca confunde o que é do curso com o que é complemento.

> **Guia narrado, versão final**, construído sobre a versão didática (`01-professor.md`). As onze etapas, os comandos, os códigos, as tabelas técnicas, as saídas esperadas e a ordem dos exercícios são os do professor, sem alteração. Por cima deles vem a camada de pista: a lente do piloto (os blocos "Leitura de cockpit", em primeira pessoa), que lê cada serviço de nuvem como uma peça da operação de um fim de semana de corrida, e a narração de transmissão, em itálico, que conduz você de etapa em etapa. A regra que atravessa o documento inteiro: **AWS e Azure são dois circuitos onde a mesma equipe opera.** Instalações diferentes, mesmo procedimento. Nenhum dos dois provedores vira equipe de F1, e cada analogia de serviço vale igualmente para o par AWS x Azure da tabela de equivalência.

**Leitura de cockpit:** na semana de 5 a 11 de outubro de 2026, a F1 sai de Sepang para Marina Bay. No domingo, 4 de outubro de 2026, o GP do Bahrein, transferido para a Malásia nesta temporada, largou com cerca de 40 minutos de atraso por causa da chuva forte; o Max Verstappen venceu, o Kimi Antonelli foi segundo e o Lewis Hamilton, terceiro. De 9 a 11 de outubro, o GP de Singapura recebe pela primeira vez o formato sprint. Para quem vive no paddock, trocar de circuito é rotina: o material chega, a garagem é montada numa instalação que não é nossa, com a energia, a rede e as regras de acesso de lá, e o procedimento da equipe é o mesmo de Sepang. É assim que eu leio este guia. AWS e Azure são dois circuitos, cada um com as próprias instalações, os próprios nomes para as coisas e algumas regras da casa que pegam quem chega desatento. A equipe é você, e o seu procedimento (identidade, rede, computação, dados, observabilidade, segurança) é o mesmo nos dois.

> **Dados de campeonato (verificados em 2026-10-06).** Após a rodada 16 de 23 (GP do Bahrein disputado em Sepang, Malásia, em 4 de outubro de 2026), o Kimi Antonelli (Mercedes) lidera com 320 pontos e o George Russell (Mercedes) é o vice, com 236. A classificação completa e as fontes estão em "Fontes dos dados de F1", no fim. Todo cenário com esses nomes que não aconteceu de fato está marcado como **hipotético**.

**Para quem não acompanha F1: o mínimo de pista para ler este guia.** Você não precisa saber nada de corrida; cada termo volta a ser explicado quando aparece.

- **Circuito.** O autódromo que recebe a etapa. Ele fornece a pista, as garagens, a energia, a rede e as regras de acesso; a equipe chega com o seu material e monta a operação dentro dessas instalações.
- **Paddock e garagem (box).** O paddock é a área restrita atrás dos boxes, onde ficam as equipes. A garagem é o espaço de cada equipe, de frente para o pit lane, onde o carro é preparado.
- **Pit lane.** A via paralela à reta onde os carros entram para parar no box, com limite de velocidade e controle de entrada.
- **Passe (credencial).** O cartão que cada pessoa do paddock carrega; ele define em quais áreas a pessoa pode entrar (paddock, garagem, pit lane, grid).
- **Muro dos boxes (pit wall).** A bancada à beira da pista onde engenheiros e estrategistas acompanham os dados do carro ao vivo.
- **Telemetria.** Os dados que os sensores do carro transmitem ao vivo para o muro e para a fábrica: centenas de canais de temperatura, pressão e velocidade.
- **Controle de corrida (race control).** A direção de prova, que publica mensagens e bandeiras quando algo muda na pista: safety car, bandeira amarela, carro sob investigação.
- **Safety car.** O carro de segurança que entra na pista depois de um incidente e reduz o ritmo de todos.
- **Especificação do carro.** A lista exata de peças e ajustes com que o carro é montado; a partir dela, a equipe monta carros idênticos.
- **ERS.** O sistema de recuperação de energia: a bateria recolhe energia nas frenagens e a devolve como potência elétrica nas retas. Se a carga acaba, o carro perde velocidade antes do fim da reta.
- **Volta de saída (out-lap).** A primeira volta depois de sair do box, com pneus e freios ainda frios; por definição, é mais lenta.
- **Lista de inscritos (entry list).** O documento oficial que liga o nome de cada piloto ao número do carro e à equipe.
- **Superlicença.** A licença que a FIA (a federação que regula a F1) emite para o piloto poder correr na categoria; ela tem validade e precisa ser renovada.
- **Teto de gastos (cost cap).** O limite anual de gastos que o regulamento impõe a cada equipe desde 2021, com punição para quem estoura.
- **Simulador.** O cockpit na fábrica onde o piloto treina e testa ajustes sem tocar no carro real.
- **Categorias de base.** F4, F3 e F2: os degraus que um piloto costuma subir antes de chegar à F1.

**O que você vai saber fazer ao final deste guia:** explicar cada conceito de nuvem (conta, identidade, rede, máquina virtual, container, banco, serverless, observabilidade, entrega de conteúdo, segredos e DNS) de forma neutra e depois traduzi-lo para os dois provedores; ler uma policy IAM e uma definição de role RBAC e dizer o que cada uma permite; desenhar uma rede com sub-redes públicas e privadas e saber qual firewall (Security Group, NACL ou NSG) cuida de quê; subir um Deployment Kubernetes na sua máquina que roda igual em EKS e AKS; escrever a mesma função HTTP para Lambda e para Azure Functions; consultar logs com CloudWatch Logs Insights e com KQL; e montar um plano de estudo para certificações dos dois lados.

**Como cada etapa é organizada:**

1. **O problema**: um cenário concreto que dói.
2. **O conceito, uma vez, de forma neutra**: a ideia vale para qualquer provedor.
3. **Tabela de equivalência AWS x Azure**: o mapa de serviços da etapa.
4. **Exemplo comentado nos dois provedores**: comandos e código lado a lado.
5. **Onde eles diferem de verdade**: diferenças de modelo, que enganam quem só decora a tabela.
6. **Mão na massa**: prática com comandos de leitura primeiro, depois (opcional) criação com bloco de limpeza para os dois provedores.
7. **Exercícios com gabarito**, **anota aí** e **checklist da etapa**.

**Pré-requisitos e ferramentas:**

- Terminal com `bash`, `curl` e `python3`. Linux, macOS ou WSL servem.
- Para a parte AWS: AWS CLI v2 (`aws --version`) e uma conta AWS. Para a parte Azure: Azure CLI (`az version`) e uma conta Azure. Você pode estudar com só um dos dois, mas o ganho do guia está em fazer os dois.
- Para a Etapa 05, opcionalmente: Docker, `kind` (ou `minikube`) e `kubectl`, que permitem praticar Kubernetes sem nenhuma conta de nuvem.
- Nos comandos, `<ID>`, `<NOME-UNICO>` e similares são marcadores que você substitui pelos seus valores. As saídas mostradas são exemplos: IDs, datas e nomes variam na sua conta.

> **Cuidado com custos (leia antes de qualquer prática).** Criar recursos em nuvem gera cobrança, mesmo em conta gratuita, se você passar do limite ou esquecer algo ligado. Por isso este guia segue três regras: (1) começa sempre por **comandos de leitura**, que não criam nada; (2) quando há criação, ela é marcada como **opcional** e usa o menor recurso possível; (3) toda criação vem com um bloco **Limpeza** para os dois provedores. As regras de free tier e de conta gratuita **mudam com o tempo** nos dois lados (a aula cita 12 meses de Free Tier na AWS; confira a oferta vigente no site oficial antes de contar com ela). Configure um orçamento com alerta de gasto no começo (AWS Budgets, Azure Cost Management) e use as calculadoras oficiais de preço (AWS Pricing Calculator e Azure Pricing Calculator). Este guia não reproduz preços.

**Convenção de nomes nos exercícios:** no Azure, tudo vive dentro de um *resource group*. Usaremos `rg-lab` e, para apagar tudo de uma vez, `az group delete`. Como a limpeza de cada etapa apaga o `rg-lab`, toda parte Azure que usa o grupo começa recriando-o com `az group create --name rg-lab --location brazilsouth` (o comando não dá erro se o grupo já existir). Se a limpeza anterior usou `--no-wait`, espere a deleção terminar com `az group wait --deleted --name rg-lab` antes de recriar. Na AWS, anote o ID de cada recurso criado para apagá-lo depois.

## Quadro de-para: cole isto no volante

A mesma analogia vale do começo ao fim do documento. Se a máquina virtual é uma garagem completa na Etapa 04, ela continua sendo uma garagem completa quando vira nó de Kubernetes na Etapa 05. Aqui ficam só as peças centrais; cada analogia é explicada de novo no ponto em que aparece. O quadro completo, com todas as analogias usadas, está no [Apêndice: quadro de-para completo](#apêndice-quadro-de-para-completo), no fim do documento.

Uma regra vale para o documento inteiro: **AWS e Azure não viram equipes de F1.** Os dois provedores entram na analogia do mesmo jeito, como dois circuitos diferentes onde a mesma equipe opera. Cada linha abaixo vale igualmente para o serviço AWS e para o serviço Azure da tabela de equivalência.

| Nuvem (AWS e Azure) | Fórmula 1 |
|---|---|
| Provedor de nuvem (AWS ou Azure) | O circuito: instalações próprias, e o procedimento da equipe é o mesmo nos dois |
| Região e zona de disponibilidade | A cidade-sede onde o circuito tem instalações, e os prédios de garagens fisicamente separados dentro dela, cada um com energia e rede próprias |
| Conta AWS e assinatura Azure | O contrato da equipe com o circuito: instalações, acessos e fatura isolados das outras equipes |
| Responsabilidade compartilhada | O circuito cuida de pista, barreiras e energia; a equipe cuida do carro, da garagem e de quem entra nela |
| Identidade e permissão (IAM, Entra ID e Azure RBAC) | O passe: cada pessoa com o seu, abrindo só as áreas de que ela precisa, e a catraca registrando tudo |
| Rede virtual (VPC, VNet) e firewalls | A área cercada da equipe no paddock: setores, portões para a rua e fiscais nas portas |
| Máquina virtual (EC2, Azure VM) | Uma garagem completa, com gerador e sistemas próprios (o sistema operacional inteiro) |
| Container, Pod e orquestrador (EKS, AKS) | O carro montado a partir da especificação, e o muro que mantém na pista quantos carros a ficha pede |
| Serverless (Lambda, Azure Functions) | A estação que o circuito só abre quando chega um pedido; a primeira chamada fria é a volta de saída |
| Métricas, eventos e logs (CloudWatch, Azure Monitor) | A telemetria, as mensagens do controle de corrida e o rádio com o registro do carro |
| CDN, balanceador e armazenamento de objetos | Os postos avançados de peças, a entrada do pit lane e o almoxarifado central |
| Segredos, certificados e DNS | O cofre de combinações, a superlicença com validade e a lista de inscritos |

## Onde a comparação para

A analogia organiza o raciocínio, mas não substitui o modelo técnico. Os limites principais, que eu repito no texto quando aparecem:

- **O circuito não se escolhe.** O calendário decide onde a equipe corre. Na nuvem, a escolha do provedor é sua, e dá para usar os dois ao mesmo tempo.
- **Escala.** A F1 tem dois carros por equipe e uma garagem por circuito. Na nuvem você sobe uma, cinquenta ou cinco mil máquinas e apaga todas em minutos.
- **Cobrança por uso.** Nenhuma instalação de circuito cobra por segundo de uso. A nuvem cobra, e é por isso que a limpeza no fim de cada prática importa.
- **Cópia não é peça.** Uma peça física existe numa unidade; imagem, objeto e segredo podem ser copiados sem limite. Por isso um segredo vazado precisa ser revogado e trocado, não só "recolhido".
- **O teto de gastos pune; o orçamento avisa.** O cost cap é regra com penalidade. O alerta de orçamento que este guia configura (AWS Budgets, Cost Management) avisa quando o gasto passa do limite, mas não desliga nada sozinho.
- **Mesmo papel, modelos diferentes.** Uma analogia vale para o par AWS x Azure, mas as diferenças de modelo de cada seção "Onde eles diferem de verdade" continuam valendo. Uma linha na tabela de equivalência não é promessa de paridade.

Sempre que houver conflito entre a pista e o terminal, vale o que está no terminal: definições, comandos e saídas esperadas do texto técnico.

---

## Etapa 01: Introdução à nuvem, com AWS e Azure

*APAGARAM-SE AS LUZES! Largada do GP, e a primeira reta serve para saber onde você está: qual circuito, qual cidade-sede, qual prédio de garagens e quem responde por quê. Parece simples, mas é aqui que nasce a disciplina de custo que vai acompanhar você até a bandeirada. Fica comigo.*

### O problema

Um varejista se prepara para a Black Friday. No modelo tradicional (on-premises), ele compra servidores extras só para o pico: semanas para comprar, instalar e configurar. Passada a data, as máquinas ficam encostadas, custando energia, espaço e manutenção. E se a campanha viralizar além do previsto, não há máquina sobrando e o site cai. Montar até um simples ambiente de testes podia levar semanas (comprar hardware, instalar sistema operacional, puxar cabo).

A nuvem resolve isso oferecendo processamento, armazenamento e rede **sob demanda**, cobrados pelo uso, a partir de uma API.

### O conceito, de forma neutra

**Analogia:** a nuvem é como a rede elétrica. Você não constrói uma usina para ligar o chuveiro; liga na tomada e paga pelo consumo. O provedor é a concessionária.

**Leitura de cockpit:** a equipe de F1 não constrói autódromo para correr. Ela chega ao circuito, ocupa a garagem que o circuito oferece, liga na energia e na rede de lá e paga pelo uso das instalações. Construir o próprio autódromo seria o on-premises. No nosso mapa, o **provedor de nuvem é o circuito**, e AWS e Azure são dois circuitos diferentes. A geografia fica assim: a **região** é a cidade-sede onde o circuito mantém instalações (a região São Paulo é `sa-east-1` na AWS e `brazilsouth` no Azure, a mesma cidade de Interlagos), e cada **zona de disponibilidade** é um prédio de garagens fisicamente separado dentro dessa sede, com energia e rede próprias, ligado aos outros por rede rápida. Espalhar a aplicação entre zonas é não deixar os dois carros dependendo do mesmo gerador. **Aqui a analogia para:** nenhum autódromo tem instalações em várias cidades nem prédios de garagem redundantes; o provedor tem dezenas de regiões, e é essa redundância física que você contrata.

Ideias que valem para qualquer provedor:

- **Sob demanda e pay-as-you-go:** provisiona-se em minutos e paga-se pelo que usa (minutos de computação, GB armazenados, requisições). Elimina o investimento antecipado em hardware.
- **Elasticidade:** ajustar recursos conforme a demanda, sem prever capacidade com meses de antecedência.
- **Economia de escala:** provedores atendem centenas de milhares de clientes, o que derruba o preço unitário.
- **Regiões e Zonas de Disponibilidade (AZs):** a infraestrutura é organizada em Regiões (áreas geográficas, como "São Paulo") e, dentro delas, em zonas: data centers fisicamente separados, ligados por rede rápida. Distribuir a aplicação entre zonas tolera falhas; escolher a região certa reduz latência e atende exigências legais de localização de dados.
- **Formas de acesso:** console web, linha de comando (CLI), SDKs dentro do código e Infraestrutura como Código (IaC), que descreve ambientes em arquivos versionados.
- **Responsabilidade compartilhada:** o provedor cuida da **segurança da nuvem** (datacenters, hardware, rede base). Você cuida da **segurança na nuvem** (configuração, dados, acessos). O nível de responsabilidade varia por serviço: numa VM você cuida de mais coisas do que numa função serverless.
- **Contas e governança:** cada conta é um ambiente isolado (recursos, usuários, permissões, fatura). Em empresas, um serviço central agrupa contas para aplicar políticas, limites de gasto e organização por unidade de negócio.
- **Modalidades de compra:** sob demanda, reservado (desconto em troca de compromisso de 1 ou 3 anos), spot (capacidade ociosa com desconto, mas interrompível) e planos de gasto mínimo mensal.
- **Boas práticas de custo:** desligar o que não usa, limpar volumes e snapshots antigos, usar orçamentos e tags por equipe, projeto ou cliente.
- **Framework de boas práticas:** os provedores publicam guias de arquitetura. O AWS Well-Architected Framework tem seis pilares (a aula os detalha nas etapas seguintes).

Segundo a aula, a AWS lançou seus primeiros serviços comerciais em 2006 (S3 e EC2) e oferece mais de 200 serviços (ref. jun/2025, conforme o material). As categorias da aula: computação, armazenamento, banco de dados, redes, segurança e machine learning.

**Leitura de cockpit:** a responsabilidade compartilhada é a divisão de todo fim de semana. O circuito responde pela pista, pelas barreiras, pela energia e pela estrutura das garagens: é a **segurança da nuvem**. A equipe responde pelo carro, pelo set-up, por quem entra na garagem e pelos dados que leva: é a **segurança na nuvem**. Se a equipe deixa a porta da garagem aberta, o circuito não tem culpa. E a fronteira se move conforme o serviço: numa VM a equipe cuida de quase tudo dentro da garagem; numa função serverless o circuito entrega a estação montada e a equipe só traz o procedimento.

**Leitura de cockpit:** as modalidades de compra também têm cara de paddock. Sob demanda é pagar pela garagem só no fim de semana em que você corre. Reserva é fechar contrato de 1 ou 3 anos em troca de desconto. Spot é a capacidade que sobrou no circuito, vendida mais barata, que o circuito pode tomar de volta a qualquer momento: serve para trabalho que aguenta ser interrompido, nunca para a sessão que vale pontos. E as boas práticas de custo pedem um alerta de orçamento, que é a versão pessoal do **teto de gastos** da F1, o limite anual que o regulamento impõe a cada equipe. **Aqui a analogia para:** o teto de gastos é regra com punição; o alerta de orçamento configurado neste guia só avisa, e não desliga nada por conta própria.

### Equivalência AWS x Azure

| Conceito | AWS (conforme o material) | Azure (acréscimo) |
|---|---|---|
| Unidade de isolamento e cobrança | Conta AWS | Subscription (assinatura), dentro de um tenant Microsoft Entra |
| Governança multi-conta | AWS Organizations | Management Groups (agrupam subscriptions) |
| Agrupador lógico de recursos | Não há equivalente direto (tags e stacks do CloudFormation cumprem parte do papel) | Resource Group (obrigatório: todo recurso vive em um) |
| Geografia | Região e Zona de Disponibilidade | Região e Zonas de Disponibilidade (nem toda região tem zonas) |
| São Paulo | `sa-east-1` | `brazilsouth` (Brazil South) |
| Console web | AWS Management Console | Azure Portal |
| CLI | `aws` | `az` |
| Shell no navegador | AWS CloudShell | Azure Cloud Shell |
| SDK | boto3 (Python) e outros | Azure SDK (por exemplo, pacotes `azure-*` para Python) |
| IaC nativa | CloudFormation (e CDK) | ARM templates e Bicep |
| IaC multi-provedor | Terraform | Terraform |
| Computação | EC2, Lambda, ECS, EKS, Batch | Virtual Machines, Functions, Container Apps, AKS, Azure Batch |
| Armazenamento de objetos | S3 | Blob Storage (dentro de uma storage account) |
| Disco de bloco | EBS | Managed Disks |
| Arquivos compartilhados (NFS) | EFS | Azure Files |
| Banco relacional gerenciado | RDS | Azure SQL Database, Azure Database for PostgreSQL e MySQL |
| NoSQL | DynamoDB | Cosmos DB |
| Data warehouse | Redshift | Azure Synapse Analytics (e Microsoft Fabric; confira o nome atual) |
| Rede virtual | VPC | Virtual Network (VNet) |
| Identidade e acesso | IAM | Microsoft Entra ID + Azure RBAC |
| Orçamento e custo | AWS Budgets, Cost Explorer | Microsoft Cost Management (budgets e análise de custo) |
| Reservas e planos | Reserved Instances, Savings Plans, Spot | Azure Reservations, Savings Plan for compute, Spot VMs |
| Framework de boas práticas | Well-Architected (seis pilares) | Azure Well-Architected Framework (cinco pilares) |
| Modelo de segurança | Responsabilidade compartilhada | Responsabilidade compartilhada (mesma ideia) |

**Leitura de cockpit:** a tabela é a planta dos dois circuitos lado a lado. A conta AWS e a assinatura Azure são o **contrato da equipe com o circuito**: o que fica dentro dele (instalações, acessos, fatura) não se mistura com o de outra equipe. O AWS Organizations e os Management Groups são a estrutura de quem tem mais de uma equipe: a Red Bull, por exemplo, é dona da Red Bull Racing e da Racing Bulls, e uma regra da matriz pode valer para as duas. O Resource Group do Azure é uma **garagem montada dentro do contrato**: tudo o que está nela sai junto quando você a devolve. Na AWS não há essa garagem com porta própria; tags e stacks fazem parte do papel.

### Exemplo comentado: descobrindo onde você está

Primeiro, quem sou eu e em qual conta/assinatura estou operando. Comandos de leitura, sem custo.

**AWS:**

```bash
# Mostra a identidade que está autenticada e a conta (não cria nada)
aws sts get-caller-identity
```

Saída esperada (exemplo):

```json
{
    "UserId": "AIDAEXAMPLEID",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/ana.dev"
}
```

```bash
# Lista as regiões habilitadas na sua conta, em texto simples
aws ec2 describe-regions --query "Regions[].RegionName" --output text
# Saída: nomes separados por espaço, incluindo sa-east-1 e us-east-1

# Lista as zonas de disponibilidade de uma região
aws ec2 describe-availability-zones --region sa-east-1 \
  --query "AvailabilityZones[].ZoneName" --output text
# Saída esperada: sa-east-1a sa-east-1b sa-east-1c
```

**Azure (acréscimo):**

```bash
# Autentica no navegador (uma vez por sessão)
az login

# Mostra a assinatura ativa e o tenant (não cria nada)
az account show --output table

# Lista as regiões disponíveis para a sua assinatura
az account list-locations --query "[].name" --output tsv
# Saída: um nome por linha, incluindo brazilsouth e eastus
```

**Leitura de cockpit:** antes de mexer em qualquer coisa, o mecânico confere em qual garagem está e com qual passe. `aws sts get-caller-identity` e `az account show` são exatamente isso: quem sou eu e em qual contrato estou operando. Errar de conta é montar o carro na garagem do vizinho.

### Onde eles diferem de verdade

- **Conta x (tenant + subscription):** na AWS, a conta junta identidade (usuários IAM), recursos e fatura. No Azure, a **identidade** vive no tenant do Microsoft Entra ID e a **cobrança e os recursos** vivem em subscriptions. Um tenant pode ter várias subscriptions. Isso muda como você pensa em isolamento e em quem administra o quê.
- **Resource Group:** conceito sem par exato na AWS. Todo recurso Azure pertence a um grupo, e apagar o grupo apaga tudo dentro. É a razão de a "limpeza" no Azure ser tão simples.
- **Zonas:** na AWS, cada sub-rede nasce presa a uma zona (Etapa 03). No Azure, as zonas são um atributo escolhido por recurso (por exemplo, por VM), e a VNet atravessa a região inteira. Em ambos, o nome lógico da zona pode apontar para locais físicos diferentes entre contas ou assinaturas.
- **Frameworks:** o AWS Well-Architected tem seis pilares; o equivalente da Microsoft tem cinco. As listas não são idênticas, então não decore uma como tradução da outra.

**Aqui a analogia para:** na AWS, o contrato (a conta) junta as pessoas, as instalações e a fatura. No Azure, o cadastro das pessoas (o tenant do Entra ID) fica separado dos contratos de uso e fatura (as assinaturas), e um mesmo cadastro pode ter vários contratos. Leia "contrato" como rótulo didático: nenhum dos dois modelos tem par exato no paddock, e é a diferença entre eles que pesa no dia a dia.

### Mão na massa

*Primeira saída do box! Três partes: confirmar em qual contrato você está, armar o alarme do teto de gastos e, se quiser, montar a garagem `rg-lab` que vai servir às próximas etapas. Leitura antes de criação, sempre.*

**Parte 1: leitura (sem custo).** Rode os comandos da seção anterior no provedor que você tem. Observe: (a) o número da conta ou o ID da assinatura; (b) que `sa-east-1` e `brazilsouth` são a "região São Paulo" de cada um; (c) quantas zonas a AWS lista para `sa-east-1`.

**Parte 2: orçamento (recomendado).** Crie um orçamento mensal baixo com alerta por e-mail: no console AWS (Billing, Budgets) e no Azure Portal (Cost Management, Budgets). É a "trava de segurança" de todas as próximas etapas.

**Leitura de cockpit:** é o seu teto de gastos pessoal, com o alarme tocando antes do estouro. Configure antes de sair do box pela primeira vez.

**Parte 3: criação opcional (custo praticamente nulo).** Crie um agrupador vazio no Azure. A limpeza logo abaixo o apaga; por isso, cada etapa seguinte que usa o `rg-lab` começa recriando-o:

```bash
# Azure (acréscimo)
az group create --name rg-lab --location brazilsouth
# Saída esperada: JSON com "provisioningState": "Succeeded"
```

Na AWS não há equivalente necessário; vá direto à Etapa 02.

**Limpeza:**

```bash
# Azure (acréscimo): apaga o grupo e tudo que existir dentro dele
az group delete --name rg-lab --yes --no-wait
# Antes de recriar o rg-lab na próxima etapa, espere a deleção terminar:
az group wait --deleted --name rg-lab
# AWS: nada foi criado nesta etapa
```

*Volta lançada! Três perguntas, sem olhar o texto: localização de dados, pico de Black Friday e quem aplica o patch.*

**Exercícios**

1. Um app guarda dados de clientes brasileiros e a lei exige que fiquem no Brasil. Qual conceito de infraestrutura global entra em jogo? Cite as regiões nos dois provedores.
2. Na Black Friday sua carga multiplica por dez durante dois dias. Por que a nuvem é mais barata que comprar servidores? Que modalidade de compra você evitaria para esses dois dias?
3. Numa VM (IaaS) e numa função serverless, quem cuida de aplicar patches no sistema operacional?

**Gabarito**

1. Regiões e localização de dados. `sa-east-1` (AWS, São Paulo) e `brazilsouth` (Azure, Brazil South).
2. Paga-se só pelo pico durante os dois dias e devolve-se a capacidade depois. Evite compromisso de 1 ou 3 anos (reservas) para um pico curto; sob demanda cobre o caso (e spot só serve se a carga tolerar interrupção).
3. VM: você (segurança *na* nuvem, responsabilidade maior). Serverless: o provedor cuida do ambiente de execução; você cuida do código, dos dados e dos acessos.

**Anota aí:** nuvem é capacidade sob demanda cobrada por uso, organizada em regiões e zonas, com segurança dividida entre provedor e cliente; AWS e Azure oferecem os mesmos blocos com nomes e modelos de organização diferentes.

**Checklist da Etapa 01**

- [ ] Consigo explicar on-premises x nuvem com o exemplo da Black Friday.
- [ ] Sei dizer o que é região e zona de disponibilidade.
- [ ] Sei dividir a responsabilidade entre provedor e cliente.
- [ ] Sei a diferença entre conta AWS e tenant + subscription do Azure.
- [ ] Configurei (ou sei configurar) um orçamento com alerta.

*Setor 1 no verde! Você sabe em qual circuito está, conhece a cidade-sede e os prédios de garagens, e o alarme de orçamento já está armado. Agora vem a primeira curva de alta do circuito: quem pode entrar onde. Etapa 02, identidade e acesso.*

---

## Etapa 02: Identidade e acesso (IAM x Entra ID + Azure RBAC)

*Segundo setor, e a placa na entrada da curva já traz um aviso: o caso Capital One. A infraestrutura estava de pé; o problema foi permissão demais na mão de quem não precisava. Aqui se aprende a distribuir passe com a mão fechada.*

### O problema

Em 2019, segundo o caso do material, a Capital One sofreu um vazamento de dados de mais de 100 milhões de clientes. Uma credencial ligada a um firewall de aplicação web estava configurada com permissões excessivas e permitiu listar e copiar dados de buckets S3. A falha não foi da infraestrutura da AWS, e sim da configuração de acessos do cliente. Lição: um sistema robusto não vale nada se as permissões estiverem frouxas.

### O conceito, de forma neutra

**Analogia:** o crachá de um prédio comercial. Cada pessoa tem o seu (identidade), com acesso só aos andares de que precisa (permissões). Funcionário novo recebe o crachá do grupo do departamento. Terceirizado ganha crachá temporário. Câmeras registram quem entrou onde e quando (auditoria).

**Leitura de cockpit:** no paddock isso é literal. Cada pessoa tem o próprio **passe**, e o passe abre só as áreas de que ela precisa: quem trabalha na hospitalidade não entra no pit lane, o mecânico de pneus não senta no muro, o convidado ganha passe de um dia. Na catraca, o passe é lido e o registro fica: quem entrou, onde e quando. **Autenticação** é a catraca conferir que o passe é seu; **autorização** é a catraca saber quais portas ele abre. **Menor privilégio** é ninguém ter passe de pit lane "por via das dúvidas". O caso Capital One, no paddock, seria um passe de serviço com acesso amplo demais, obtido por uma brecha numa portaria mal configurada: a pista estava segura, o erro estava em quem recebeu acesso a quê.

Conceitos que valem em qualquer provedor:

- **Autenticação** responde "quem é você?"; **autorização** responde "o que você pode fazer?".
- **Princípio do menor privilégio:** cada identidade tem só o necessário.
- **Identidades humanas:** usuários individuais, nunca compartilhados, com MFA. Agrupe usuários em **grupos** e dê permissões ao grupo, para que promoções e mudanças de time virem apenas troca de grupo.
- **Identidades de máquina:** serviços e aplicações assumem uma identidade temporária, herdam permissões, executam e liberam a sessão. Evita chaves de acesso gravadas em código, uma das falhas mais comuns.
- **Políticas:** regras que dizem quem pode fazer qual ação, em qual recurso, sob quais condições.
- **Conta raiz/administrador supremo:** existe desde a criação; proteja com MFA e use só para tarefas críticas.
- **Governança multi-conta:** um limite máximo de permissões imposto de cima para baixo sobre várias contas.
- **Auditoria e detecção:** registrar toda ação (quem, o quê, quando, de onde) e usar serviços que detectam comportamento anômalo.

**Leitura de cockpit:** a identidade de máquina é o **passe preso ao equipamento**. Pense no caminhão de dados que precisa entrar na área técnica: em vez de alguém deixar um passe humano no painel (a chave de acesso escrita no código), o circuito emite um passe ligado àquele veículo, válido por pouco tempo e renovado sozinho. Não existe papel para perder ou fotografar. Na AWS isso é a **IAM Role** assumida pelo serviço; no Azure, a **Managed Identity**. A conta raiz é o passe-mestre do dono do contrato: fica no cofre, com MFA, e só sai para tarefas críticas.

### Equivalência AWS x Azure

| Conceito | AWS (conforme o material) | Azure (acréscimo) |
|---|---|---|
| Diretório de identidades | IAM (usuários, grupos) | Microsoft Entra ID (usuários, grupos) |
| Permissão sobre recursos | Políticas IAM em JSON anexadas a usuário, grupo ou role | Azure RBAC: atribuição de uma role a uma identidade em um escopo |
| Regra de permissão | Statement (Effect, Action, Resource, Condition) | Role definition (Actions, NotActions, DataActions, AssignableScopes) |
| Política gerenciada pela AWS | `AmazonS3FullAccess` etc. | Built-in roles (Reader, Contributor, Owner, Storage Blob Data Reader...) |
| Política personalizada | Customer managed policy | Custom role |
| Identidade de serviço | IAM Role (EC2, Lambda, ECS) | Managed Identity (system-assigned ou user-assigned) |
| Assumir identidade temporária | STS AssumeRole | Managed Identity / workload identity (token obtido sem segredo) |
| Login único e federação | IAM Identity Center (AWS SSO), federação com AD, Google, Okta | O próprio Entra ID, com federação e SSO |
| Multi-conta: teto de permissões | AWS Organizations + SCP | Management Groups + Azure Policy (aproximação, veja as diferenças) |
| Auditoria de ações | CloudTrail | Activity Log (plano de controle) e Diagnostic settings (logs dos recursos) |
| Detecção de ameaças | Amazon GuardDuty | Microsoft Defender for Cloud |
| Análise de acessos expostos | IAM Access Analyzer | Recomendações do Defender for Cloud (aproximação; não é 1 para 1) |
| Elevação temporária de privilégio | (não citado no material) | Privileged Identity Management (PIM; confira o licenciamento exigido) |
| Simulação de permissão | Policy Simulator | Verificação de acesso na tela de Access control (IAM) do portal |

**Leitura de cockpit:** nos dois circuitos, as peças são as mesmas: um passe (a identidade), as áreas que ele abre (as permissões) e o registro da catraca (CloudTrail na AWS, Activity Log no Azure). O GuardDuty e o Defender for Cloud fazem o papel da segurança que assiste às câmeras e estranha alguém tentando abrir dez portas em um minuto.

### Exemplo comentado: a mesma regra nos dois modelos

**Requisito:** permitir enviar objetos (arquivos) para um repositório específico, apenas a partir de um IP, com MFA e dentro de uma janela de horário.

**AWS: policy IAM em JSON** (do material):

```json
{
  "Version": "2012-10-17",            // versão da linguagem de policy
  "Statement": [
    {
      "Sid": "PutObjectWithConditions", // nome da regra (opcional)
      "Effect": "Allow",                // concede (Deny bloquearia, e sempre vence)
      "Action": "s3:PutObject",         // operação: enviar objeto
      "Resource": "arn:aws:s3:::meu-bucket/*", // sobre quais objetos (ARN)
      "Condition": {                    // restrições adicionais
        "IpAddress":  { "aws:SourceIp": "203.0.113.0/24" },       // só desse IP
        "Bool":       { "aws:MultiFactorAuthPresent": "true" },   // só com MFA
        "DateGreaterThan": { "aws:CurrentTime": "2025-05-13T13:00:00Z" }, // depois de
        "DateLessThan":    { "aws:CurrentTime": "2025-05-13T21:00:00Z" }  // antes de
      }
    }
  ]
}
```

(Os comentários `//` são didáticos; JSON real não os aceita, então remova-os antes de usar. O mesmo vale para todo bloco JSON comentado deste guia.)

**Azure (acréscimo): role definition personalizada**, que descreve só *o que* pode ser feito e *onde* pode ser atribuída:

```json
{
  "Name": "Gravador de blobs do projeto X",   // nome da role
  "IsCustom": true,                            // é uma role personalizada
  "Description": "Permite gravar blobs no resource group rg-app.",
  "Actions": [],                               // operações do plano de controle (nenhuma)
  "NotActions": [],                            // exclusões das Actions
  "DataActions": [                             // operações sobre os DADOS (plano de dados)
    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write"
  ],
  "NotDataActions": [],
  "AssignableScopes": [                        // onde esta role pode ser atribuída
    "/subscriptions/<ID-DA-ASSINATURA>/resourceGroups/rg-app"
  ]
}
```

(Atenção: os comentários `//` são só didáticos. Antes de usar o arquivo em `az role definition create --role-definition @arquivo.json`, remova-os, senão o JSON é rejeitado.)

Repare no que **não** está ali: IP, MFA e horário. No Azure essas condições vivem em outras camadas: **Conditional Access** do Entra ID cuida de exigir MFA e restringir por localização de rede; **PIM** permite acesso com prazo limitado (confira o licenciamento necessário); e há *role assignment conditions* (ABAC) para refinar certas atribuições, como as de dados de blob. A janela de horário fixa, tal como no exemplo AWS, não tem equivalente direto em uma role.

**Leitura de cockpit:** a policy da AWS é um passe com tudo impresso no próprio cartão: a porta, o portão de onde você pode vir, a exigência de conferir o rosto (MFA) e o horário de validade. A role do Azure imprime só *o que* o passe abre; *onde* ele vale sai da atribuição (o escopo), e as condições de rede, MFA e prazo ficam em outros balcões (Conditional Access, PIM, condições de atribuição). O resultado pode ser parecido; o caminho até ele é outro.

A role é então **atribuída** a uma identidade em um escopo:

```bash
# Azure (acréscimo): dá a um grupo a role built-in de leitor de blobs, somente no resource group
# O ID do grupo vem de: az ad group show --group <NOME-DO-GRUPO> --query id -o tsv
az role assignment create \
  --assignee <ID-DO-OBJETO-DO-GRUPO> \
  --role "Storage Blob Data Reader" \
  --scope /subscriptions/<ID-DA-ASSINATURA>/resourceGroups/rg-app
```

**A role de máquina (EC2S3AccessRole do material) nos dois lados.** AWS: uma role com *trust policy* (quem pode assumir) e *permission policy* (o que pode fazer):

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ec2.amazonaws.com" },  // quem pode assumir: o serviço EC2
    "Action": "sts:AssumeRole"                         // ação de assumir a role
  }]
}
```

(Remova os comentários `//` antes de usar esta trust policy; JSON real não os aceita.)

Azure (acréscimo): liga-se uma **Managed Identity** à VM e atribui-se a ela uma role no escopo desejado. Este é um exemplo de leitura: a `vm-lab` só é criada na Etapa 04, então execute estes comandos depois dela.

```bash
# Habilita a identidade gerenciada (system-assigned) na VM e imprime o ID dela
az vm identity assign --resource-group rg-lab --name vm-lab --query systemAssignedIdentity -o tsv
# Concede leitura de blobs a essa identidade (não existe senha nem chave para vazar)
az role assignment create --assignee-object-id <ID-IMPRESSO-ACIMA> \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Reader" --scope <ID-DA-STORAGE-ACCOUNT>
```

**Governança multi-conta.** AWS: uma SCP que nega EC2 em toda a organização, mesmo que o IAM de uma conta permita:

```json
{
  "Version": "2012-10-17",
  "Statement": [{ "Effect": "Deny", "Action": "ec2:*", "Resource": "*" }]
}
```

Azure (acréscimo): uma regra de **Azure Policy** que nega a criação de máquinas virtuais no escopo (management group, subscription ou resource group):

```json
{
  "if":   { "field": "type", "equals": "Microsoft.Compute/virtualMachines" },
  "then": { "effect": "deny" }
}
```

Esse trecho é só a **regra** (`policyRule`); uma definição completa tem também `mode` e, quando houver, `parameters`. Esta regra não tem parâmetros, e a CLI monta o resto. Para testar (opcional, gratuito), salve a regra em `regra.json` e rode:

```bash
# Azure (acréscimo): cria a definição a partir da regra e a atribui ao resource group
az group create --name rg-lab --location brazilsouth
az policy definition create --name negar-vm --rules regra.json --mode All
az policy assignment create --name negar-vm --policy negar-vm \
  --scope $(az group show --name rg-lab --query id -o tsv)
# Limpeza: remove a atribuição e depois a definição
az policy assignment delete --name negar-vm --scope $(az group show --name rg-lab --query id -o tsv)
az policy definition delete --name negar-vm
az group delete --name rg-lab --yes --no-wait
```

**Leitura de cockpit:** governança de várias contas é a regra da matriz. Quando um grupo é dono de mais de uma equipe (como a Red Bull, com a Red Bull Racing e a Racing Bulls), a matriz pode proibir algo para as duas, e nenhum chefe de equipe consegue liberar por conta própria. É o papel da SCP na AWS. A Azure Policy, no exemplo acima, faz um trabalho vizinho: em vez de limitar o que um passe pode fazer, ela barra a montagem de um tipo de equipamento na garagem (aqui, máquinas virtuais). **Hipotético:** a situação de uma matriz baixando regra para as duas equipes é ilustração do conceito, não um fato da temporada.

*Atenção, que a corrida esquenta! Este é o trecho que mais derruba quem só decorou a tabela: um Deny que vence tudo de um lado, permissões que só se somam do outro, e ser dono da garagem sem poder abrir os dados do carro. É aqui que se separam os pontuadores do resto do grid.*

### Onde eles diferem de verdade

- **JSON de policy x RBAC por escopo.** Na AWS, a policy carrega as quatro peças (efeito, ação, recurso, condição) e é anexada a uma identidade. No Azure, a role define só **ações permitidas**; o **recurso** vem do **escopo** da atribuição (management group, subscription, resource group ou o próprio recurso) e a herança vai de cima para baixo.
- **Deny.** Na AWS, `Deny` explícito vence qualquer `Allow`, e você o escreve na policy. No Azure RBAC, o modelo é **aditivo**: permissões se somam. `NotActions` apenas exclui ações *daquela role*, não é um bloqueio global. Bloqueios de verdade vêm de Azure Policy (sobre recursos), *deny assignments* (criadas por serviços como managed applications) e resource locks.
- **SCP x Azure Policy.** Ambas formam guardas de governança, mas atuam diferente. A SCP é um **teto de permissões** para contas de uma organização. A Azure Policy avalia **propriedades e configurações dos recursos** (região permitida, tipo de recurso, tags obrigatórias). Não são traduções exatas; o teto de permissões de identidade no Azure resulta da combinação de RBAC, Policy e Conditional Access.
- **Plano de controle x plano de dados.** O Azure separa `Actions` (gerenciar o recurso) de `DataActions` (ler e gravar o conteúdo). Quem é Owner de uma storage account não lê blobs por esse motivo sozinho, se o acesso aos dados for por Entra ID.
- **Grupos.** No IAM, grupos não aninham (segundo o material). No Entra ID, grupos de segurança podem conter outros grupos, com algumas limitações por cenário; confira a documentação antes de depender disso.

**Aqui a analogia para:** o `Deny` explícito da AWS é a proibição que vence qualquer autorização: se uma regra diz "não entra", não importa quantas digam "entra". No Azure RBAC as permissões só se somam, como passes que vão acumulando áreas; para proibir, você vai a outro balcão (Azure Policy, resource lock, deny assignment). No paddock real existe um credenciamento só; na nuvem são vários mecanismos, e confundi-los é a origem de muitos acessos indevidos. E a separação **plano de controle x plano de dados** do Azure é o detalhe que mais engana: ser dono da garagem (Owner) não dá, por si só, acesso aos dados do carro (os blobs) quando o acesso é por Entra ID. Gerenciar o recurso e ler o que está dentro dele são passes diferentes.

### Mão na massa

*Pit lane aberto! Primeiro você confere os passes que já existem, depois valida uma policy sem tocar na nuvem e, se quiser, cria um grupo de leitura nos dois circuitos. Nada aqui gera cobrança.*

**Parte 1: leitura (sem custo).**

AWS:

```bash
aws sts get-caller-identity                 # quem sou eu
aws iam list-users --query "Users[].UserName" --output text   # usuários IAM (se tiver permissão)
aws iam list-groups --query "Groups[].GroupName" --output text
# Observe: há usuário individual seu ou você está usando a raiz? (a raiz deve ser evitada)
```

Azure (acréscimo):

```bash
az account show --query "{assinatura:name, tenant:tenantId, usuario:user.name}" -o table
# Lista as atribuições de role do seu usuário, em todos os escopos
az role assignment list --assignee <SEU-E-MAIL> --all -o table
# Inspeciona o que a role built-in "Reader" permite
az role definition list --name "Reader" -o json
# Observe em "Actions" o padrão provedor/tipo/operação, e que "Reader" só tem leituras
```

**Parte 2: validar uma policy localmente (sem nuvem).** Salve a policy de leitura do material em `politica.json`:

```bash
cat > politica.json <<'EOF'
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"s3:GetObject","Resource":"arn:aws:s3:::meu-bucket/*"}]}
EOF
python3 -m json.tool politica.json
# Saída esperada: o mesmo JSON formatado e indentado. Se faltar uma vírgula, ele acusa o erro.
```

**Parte 3: criação opcional (gratuita).** Criar grupos e atribuições de role não gera cobrança.

```bash
# AWS: grupo com política gerenciada somente leitura
aws iam create-group --group-name estudo-leitores
aws iam attach-group-policy --group-name estudo-leitores \
  --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess
aws iam get-group --group-name estudo-leitores   # confira que o grupo existe

# Azure (acréscimo): grupo no Entra ID e atribuição da role Reader ao grupo, no resource group
az group create --name rg-lab --location brazilsouth
az ad group create --display-name estudo-leitores --mail-nickname estudo-leitores
# Guarda o ID do grupo recém-criado (é ele que a atribuição usa)
GRUPO_ID=$(az ad group show --group estudo-leitores --query id -o tsv)
az role assignment create --assignee-object-id "$GRUPO_ID" \
  --assignee-principal-type Group --role "Reader" \
  --scope $(az group show --name rg-lab --query id -o tsv)
```

(No Azure, criar grupos exige permissão no tenant; contas de estudante ou corporativas podem bloquear. Se falhar, a leitura da Parte 1 já cumpre o objetivo.)

**Limpeza:**

```bash
# AWS
aws iam detach-group-policy --group-name estudo-leitores \
  --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess
aws iam delete-group --group-name estudo-leitores
# Azure (acréscimo)
az ad group delete --group estudo-leitores
az group delete --name rg-lab --yes --no-wait
# Antes de recriar o rg-lab na próxima etapa, espere a deleção terminar:
az group wait --deleted --name rg-lab
```

*Pit stop cronometrado! Ler uma policy, decidir quem vence entre Allow e Deny e entregar acesso sem chave no código. Relógio rodando.*

**Exercícios**

1. Leia: `{"Effect":"Allow","Action":["ec2:DescribeInstances"],"Resource":"*"}`. O que ela permite? É perigoso usar `"*"` aqui?
2. Um usuário está num grupo com `AmazonS3FullAccess`, mas também tem uma policy com `Deny` em `s3:DeleteObject`. Ele consegue apagar objetos? E no Azure, se ele tem uma role que permite apagar blobs, como bloquear isso apenas para um resource group?
3. Uma aplicação em VM precisa ler um bucket/contêiner. Como entregar acesso sem guardar chave no código, nos dois provedores?

**Gabarito**

1. Permite listar/descrever instâncias EC2, só leitura. Aceitável com `"*"` por ser leitura; para limitar a uma instância específica, troca-se pelo ARN.
2. Não: o `Deny` explícito sempre prevalece. No Azure, como RBAC é aditivo, o bloqueio por escopo se faz com Azure Policy ou resource lock (ou removendo/limitando a role no escopo), não com um "deny" dentro da role.
3. AWS: IAM Role anexada à instância (instance profile) com permissão de leitura. Azure: Managed Identity na VM com a role Storage Blob Data Reader no escopo da storage account.

**Anota aí:** dê a cada identidade o mínimo necessário, prefira identidade temporária de máquina a chave em código; na AWS o escopo mora dentro da policy, no Azure ele mora na atribuição da role.

**Checklist da Etapa 02**

- [ ] Sei explicar Effect, Action, Resource e Condition numa policy IAM.
- [ ] Sei dizer por que Deny vence na AWS e como o Azure RBAC difere.
- [ ] Sei o que é role (AWS) e Managed Identity (Azure) e quando usá-las.
- [ ] Sei a diferença entre SCP e Azure Policy.
- [ ] Sei qual serviço audita ações (CloudTrail e Activity Log).

*Setor 2 no verde! Cada pessoa com o seu passe, cada máquina com o passe preso ao equipamento e a catraca registrando tudo. Agora a equipe precisa de terreno: a área cercada no paddock, com setores, portões e fiscais. Etapa 03, redes.*

---

## Etapa 03: Redes (VPC x VNet)

*Terceiro setor, e o traçado fica técnico. Bloco de endereços, sub-rede pública e privada, rota, NAT e fiscais nas portas: erre aqui e nem o melhor carro chega ao grid. Guarde a regra do piloto, porque ela vale o setor inteiro: quem decide se o setor é público é a rota, não a placa.*

### O problema

Um banco de dados foi criado numa sub-rede com rota para a internet e uma regra liberando a porta do banco para "qualquer lugar". Em horas, bots começam a tentar senhas. Um erro de configuração de rede pode expor um banco à internet ou, no sentido oposto, impedir dois sistemas internos de conversar. Antes da nuvem, montar rede era comprar switches, roteadores e puxar cabos; na nuvem, o desenho é feito por software, mas o raciocínio continua sendo de rede.

### O conceito, de forma neutra

**Analogia:** um condomínio. O terreno todo é a rede privada (bloco de IPs). Cada bloco de apartamentos é uma sub-rede. A portaria principal é a saída para a internet. O porteiro de cada prédio confere quem entra (firewall).

**Leitura de cockpit:** no circuito, a rede é a **área cercada da equipe no paddock**. O bloco de IPs é o terreno que o contrato reserva; cada sub-rede é um setor com função própria (a garagem, a sala de engenharia, o caminhão de dados). Um setor é público quando tem portão para a rua; o que decide isso é a **rota**, não o nome na placa. O setor privado não recebe visita de fora, mas pode mandar um mensageiro buscar algo lá fora e voltar: é o **NAT**, só saída. Os **firewalls** são os fiscais: o fiscal **stateful** lembra quem deixou entrar e libera a resposta sem nova conferência; o fiscal **stateless** confere tudo nos dois sentidos, sem memória.

- **Rede virtual privada:** um bloco de IPs privados em notação CIDR, por exemplo `10.0.0.0/16` (até 65.536 endereços). Planeje para não colidir com redes da empresa (importante com VPN) e para ter espaço de crescimento.
- **Sub-redes:** fatias do bloco (`10.0.1.0/24`, `10.0.2.0/24`...), cada uma com uma finalidade (web, aplicação, banco).
- **Pública x privada:** o que decide é a **rota**. Se o tráfego da sub-rede para `0.0.0.0/0` sai por um gateway de internet, ela é pública. Sem isso, é privada. Sub-redes privadas costumam sair para a internet via **NAT** (só saída, sem aceitar conexão de entrada).
- **Tabela de rotas:** diz para onde cada destino vai.
- **Firewalls:** uma camada **stateful** (se a entrada foi permitida, a resposta volta sozinha) e outra **stateless** (cada sentido precisa de regra). Regras de negação existem em algumas camadas e em outras não.
- **Conexão entre redes:** peering (ponto a ponto, **não transitivo**), hub-and-spoke com roteador central (transitivo), VPN sobre a internet (IPsec) e link dedicado físico (baixa latência, alta estabilidade).
- **Acesso privado a serviços gerenciados:** chegar a um serviço do provedor (armazenamento, banco, API) sem sair para a internet pública.
- **DNS interno e flow logs:** resolver nomes dentro da rede; registrar metadados do tráfego para diagnóstico e segurança.

**Leitura de cockpit:** as conexões entre redes também têm endereço no paddock. **Peering** é uma passagem direta entre as áreas de duas equipes: A fala com B, B fala com C, mas A não atravessa a área de B para chegar a C (não é transitivo). O **hub** é a via central do paddock, por onde todos passam. A **VPN** é um rádio criptografado usando a rede pública; o **link dedicado** é o enlace exclusivo entre o circuito e a sala de operações da fábrica, para os dados irem e voltarem com latência baixa e estável.

### Equivalência AWS x Azure

| Conceito | AWS (conforme o material) | Azure (acréscimo) |
|---|---|---|
| Rede virtual | VPC | VNet |
| Sub-rede | Subnet (presa a **uma** AZ) | Subnet (atravessa a região; zonas são atributo do recurso) |
| Saída para a internet | Internet Gateway (IGW) | Sem gateway dedicado: IP público no recurso e saída padrão (veja as diferenças) |
| Saída só de saída para sub-redes privadas | NAT Gateway | NAT Gateway |
| Tabela de rotas | Route table | Route table (rotas definidas pelo usuário, UDR) |
| Firewall stateful na instância | Security Group | NSG (Network Security Group) |
| Firewall stateless na sub-rede | NACL | NSG também pode ser associado à sub-rede (não há "NACL" separada) |
| Peering entre redes | VPC Peering | VNet Peering |
| Hub central transitivo | Transit Gateway | Virtual WAN (ou hub-and-spoke com roteamento próprio) |
| VPN site a site | Site-to-Site VPN | VPN Gateway |
| Link dedicado | Direct Connect | ExpressRoute |
| Acesso privado a serviço | VPC Endpoint (Interface e Gateway) | Private Endpoint (via Private Link) e Service Endpoint |
| Logs de tráfego | VPC Flow Logs | NSG flow logs e VNet flow logs (confira na documentação qual é o recomendado) |
| Firewall gerenciado de rede | AWS Network Firewall | Azure Firewall |
| DNS interno | DNS da VPC e zonas privadas do Route 53 | DNS fornecido pelo Azure e Azure Private DNS zones |

**Leitura de cockpit:** a mesma área cercada existe nos dois circuitos; o que muda é a planta. Na AWS, cada setor (sub-rede) fica dentro de **um** prédio de garagens (uma zona). No Azure, o setor se estende pela sede inteira, e cada equipamento escolhe em qual prédio fica.

### Exemplo comentado: o desenho clássico, em comandos de leitura e criação gratuita

O desenho: `10.0.0.0/16`, uma sub-rede pública `10.0.1.0/24` (web) e uma privada `10.0.2.0/24` (banco).

**AWS (leitura):**

```bash
aws ec2 describe-vpcs --query "Vpcs[].{id:VpcId,cidr:CidrBlock,padrao:IsDefault}" --output table
# Mostra suas VPCs; a de "padrao: True" é a default (não use em projetos sérios)
aws ec2 describe-subnets --query "Subnets[].{id:SubnetId,az:AvailabilityZone,cidr:CidrBlock}" --output table
# Cada sub-rede mostra UMA zona de disponibilidade
aws ec2 describe-route-tables --query "RouteTables[].Routes[].GatewayId" --output text
# Procure um valor "igw-..." : é a rota para o Internet Gateway que torna uma sub-rede pública
```

**Azure (leitura, acréscimo):**

```bash
az network vnet list --output table                       # suas VNets
az network vnet subnet list --resource-group <RG> --vnet-name <VNET> --output table
az network nsg list --output table                         # NSGs existentes
az network route-table list --output table                 # tabelas de rotas
```

**Criação gratuita (a rede em si não gera cobrança; NAT Gateway, VPN e IPs públicos geram):**

```bash
# AWS: cria a VPC e as duas sub-redes do desenho (anote os IDs retornados)
aws ec2 create-vpc --cidr-block 10.0.0.0/16
# Sub-rede "web" (10.0.1.0/24) e sub-rede "banco" (10.0.2.0/24)
aws ec2 create-subnet --vpc-id <ID-DA-VPC> --cidr-block 10.0.1.0/24 --availability-zone sa-east-1a
aws ec2 create-subnet --vpc-id <ID-DA-VPC> --cidr-block 10.0.2.0/24 --availability-zone sa-east-1a
# Atenção: sem Internet Gateway e sem rota para ele, as duas ainda são privadas.
# É a rota que tornaria a "web" pública; este lab não cria IGW, para continuar gratuito.

# Azure (acréscimo): recria o grupo e cria a VNet já com a primeira sub-rede, e depois a segunda
az group create --name rg-lab --location brazilsouth
az network vnet create --resource-group rg-lab --name vnet-lab \
  --address-prefixes 10.0.0.0/16 \
  --subnet-name snet-web --subnet-prefixes 10.0.1.0/24
az network vnet subnet create --resource-group rg-lab --vnet-name vnet-lab \
  --name snet-db --address-prefixes 10.0.2.0/24
```

**Regra de firewall, a mesma intenção nos dois modelos (liberar SSH só de um IP):**

```bash
# AWS: Security Group com regra de entrada na porta 22 só do seu IP (resposta sai sozinha: stateful)
aws ec2 create-security-group --group-name sg-lab --description "lab" --vpc-id <ID-DA-VPC>
aws ec2 authorize-security-group-ingress --group-id <ID-DO-SG> \
  --protocol tcp --port 22 --cidr 203.0.113.10/32

# Azure (acréscimo): NSG com regra de entrada; a prioridade (100 a 4096) define a ordem de avaliação
az network nsg create --resource-group rg-lab --name nsg-lab
az network nsg rule create --resource-group rg-lab --nsg-name nsg-lab \
  --name permitir-ssh --priority 100 --direction Inbound --access Allow \
  --protocol Tcp --destination-port-ranges 22 --source-address-prefixes 203.0.113.10/32
```

**Leitura de cockpit:** os dois comandos dão a mesma ordem ao fiscal: "na porta 22, só entra quem vem deste endereço". No Security Group, a ordem é uma lista de autorizações e o fiscal lembra de quem entrou. No NSG, cada regra tem um número de **prioridade**, e o fiscal lê da menor para a maior, parando na primeira que se aplica.

*Ponto de frenagem! Um fiscal ou dois? É a pergunta que mais confunde neste setor, e a resposta muda de um circuito para o outro. Leia devagar, porque é aqui que muita gente acha que configurou o firewall e configurou só a metade.*

### Onde eles diferem de verdade

- **Sub-rede presa a uma zona (AWS) x sub-rede regional (Azure).** Na AWS, para alta disponibilidade você cria uma sub-rede por zona. No Azure, uma sub-rede cobre a região e você distribui os recursos entre zonas.
- **Um firewall ou dois.** A AWS separa Security Group (stateful, só permite, na instância ou interface) de NACL (stateless, permite e nega, ordenada por número, na sub-rede). O **NSG** do Azure é **stateful**, aceita regras de **Allow e Deny**, é ordenado por **prioridade** e pode ser associado à **interface de rede (NIC)**, à **sub-rede** ou aos dois. Ele reúne, em um objeto, partes dos dois conceitos da AWS. O NSG tem regras padrão (por exemplo, tráfego interno da VNet permitido e entrada externa negada por padrão).
- **Atenção a um falso amigo:** "ASG" no Azure é *Application Security Group* (agrupamento de NICs para usar em regras de NSG), não Auto Scaling Group.
- **Internet Gateway.** A AWS exige o IGW e a rota explícita. No Azure não existe um recurso equivalente: o acesso depende do recurso ter IP público (ou de uma saída configurada). Tradicionalmente, VMs sem IP público tinham *acesso de saída padrão* implícito. A Microsoft vem retirando esse comportamento para novas redes em favor de saída explícita (NAT Gateway, por exemplo); confira o estado atual na documentação antes de depender dele.
- **CIDR.** Segundo o material, o CIDR da VPC não pode ser alterado depois de criado. No Azure, o espaço de endereços da VNet pode ser editado (com cuidados, por exemplo, ressincronizar peerings). Em ambos, planejar antes continua sendo o caminho barato.
- **Peering e transitividade.** Peering é não transitivo nos dois: A com B e B com C não dá A com C. Para muitas redes, use um hub (Transit Gateway na AWS, Virtual WAN ou hub-and-spoke no Azure).
- **Service Endpoint x Private Endpoint.** O Private Endpoint cria uma interface de rede com IP privado na sua sub-rede para o serviço (conceito parecido com o Interface Endpoint). O Service Endpoint estende a identidade da sua sub-rede ao serviço e roteia pelo backbone da Microsoft, mas o serviço continua com endereço público. O Gateway Endpoint da AWS (S3 e DynamoDB) é uma rota na tabela de rotas, o que o torna mais parecido, em espírito, com o Service Endpoint.

**Aqui a analogia para:** a AWS põe dois fiscais diferentes: um na porta de cada garagem (Security Group: stateful, só autoriza) e outro na catraca do setor (NACL: stateless, autoriza e proíbe, em ordem numérica). O Azure usa um fiscal só, o NSG, que tem memória, autoriza e proíbe, e pode ficar na porta (a NIC), na catraca do setor (a sub-rede) ou nos dois. No paddock seriam duas pessoas fáceis de distinguir; na nuvem é comum alguém achar que configurou "o firewall" e ter configurado só um dos dois. E cuidado com o falso amigo: **ASG** no Azure é um agrupamento de interfaces para regras de NSG, não um grupo de autoescalonamento.

### Mão na massa

*Volta de instalação! Começa na calculadora, sem nuvem nenhuma: quantos endereços cabem no terreno e quantos setores /24 saem dele. Depois vem a leitura e, se quiser, a criação sem custo.*

**Parte 1: calcular CIDR sem nuvem.**

```bash
python3 - <<'EOF'
import ipaddress
rede = ipaddress.ip_network("10.0.0.0/16")
print("Endereços na rede:", rede.num_addresses)
subs = list(rede.subnets(new_prefix=24))
print("Sub-redes /24:", len(subs))
print("Primeiras três:", [str(s) for s in subs[:3]])
EOF
# Saída esperada:
# Endereços na rede: 65536
# Sub-redes /24: 256
# Primeiras três: ['10.0.0.0/24', '10.0.1.0/24', '10.0.2.0/24']
```

**Parte 2: leitura na nuvem.** Rode os comandos de leitura da seção anterior. Observe: (a) na AWS, qual sub-rede tem rota para `igw-...`; (b) no Azure, quais NSGs existem e a quais sub-redes ou NICs estão associados.

**Parte 3: criação opcional (gratuita, sem NAT Gateway nem IP público).** Rode a criação da rede e do firewall acima, depois liste de novo e confira que sua rede e seu NSG aparecem.

**Limpeza:**

```bash
# AWS (apague na ordem: dependentes primeiro)
aws ec2 delete-security-group --group-id <ID-DO-SG>
aws ec2 delete-subnet --subnet-id <ID-DA-SUBNET-WEB>
aws ec2 delete-subnet --subnet-id <ID-DA-SUBNET-BANCO>
aws ec2 delete-vpc --vpc-id <ID-DA-VPC>
# Azure (acréscimo): apaga VNet, sub-redes e NSG de uma vez
az group delete --name rg-lab --yes --no-wait
# Antes de recriar o rg-lab na próxima etapa, espere a deleção terminar:
az group wait --deleted --name rg-lab
```

*Volta lançada! Três perguntas: dividir o terreno, bloquear um IP malicioso na sub-rede inteira e escolher entre a passagem direta e a via central.*

**Exercícios**

1. A VPC é `10.0.0.0/16`. Quantas sub-redes `/24` cabem? E se você já usa `10.0.0.0/16` na rede da empresa e quer VPN com a nuvem? Qual o risco?
2. Um IP malicioso foi identificado e você quer bloqueá-lo para uma sub-rede inteira. Qual recurso usar na AWS? E no Azure?
3. Você tem 12 redes que precisam conversar entre si. Peering ou hub? Por quê?

**Gabarito**

1. 256 sub-redes `/24`. Se os blocos colidirem, o roteamento fica ambíguo e a VPN não funciona; evite sobreposição de CIDR.
2. AWS: NACL da sub-rede (permite negação). Azure: regra Deny de prioridade alta num NSG associado à sub-rede.
3. Hub (Transit Gateway ou Virtual WAN): peering exige uma conexão direta por par e não é transitivo, o que não escala para 12 redes.

**Anota aí:** rede na nuvem é rota mais firewall; a sub-rede é pública por causa da rota, e o NSG do Azure faz sozinho o que o par Security Group e NACL faz na AWS.

**Checklist da Etapa 03**

- [ ] Sei dividir um CIDR em sub-redes.
- [ ] Sei o que torna uma sub-rede pública ou privada.
- [ ] Sei a diferença entre Security Group, NACL e NSG.
- [ ] Sei por que peering não escala e o que o substitui.
- [ ] Sei a diferença entre Private Endpoint e Service Endpoint.

*Setor 3 no verde! Terreno cercado, setores com a rota certa e fiscais nas portas. Agora é hora de levantar a primeira garagem dentro dessa área. Etapa 04, máquinas virtuais.*

---

## Etapa 04: Máquinas virtuais (EC2 x Azure Virtual Machines)

*Quarto setor! Agora a garagem sai do papel: tamanho certo para o trabalho, bateria de créditos para os picos e uma diferença de custo entre os dois circuitos que já pegou muita gente desatenta. Olho no detalhe do desalocar.*

### O problema

Uma loja precisa de um servidor web para o fim de semana de promoção. Comprar uma máquina física leva semanas, e dimensioná-la para o pico a deixa ociosa o resto do ano. Pior: na segunda-feira de manhã a carga cai e você continua pagando. Uma máquina virtual na nuvem sobe em minutos e pode ser multiplicada ou desligada conforme a demanda.

### O conceito, de forma neutra

**Analogia:** alugar um carro por dia, escolhendo o modelo conforme a viagem (compacto para a cidade, van para a família), em vez de comprar um carro para toda ocasião.

**Leitura de cockpit:** no nosso mapa, a **máquina virtual é uma garagem completa**, com gerador, rede e sistemas próprios (o sistema operacional inteiro), montada dentro das instalações do circuito. Você escolhe o tamanho conforme o trabalho do fim de semana e devolve quando terminou. O circuito fornece o terreno e o hardware de verdade; o que você opera é a sua garagem. **Aqui a analogia para:** uma garagem de F1 leva dias para ser montada e é uma por equipe; uma VM sobe em minutos, e você pode ter quantas a conta permitir.

- **Máquina virtual (VM):** servidor criado por software, com sistema operacional, rede e discos próprios. Atende de aplicações simples a sistemas críticos.
- **Famílias de tamanho:** escolhidas por CPU, memória, armazenamento e rede (uso geral, otimizadas para computação, para memória, com GPU, para armazenamento).
- **Instâncias de desempenho variável (burstable):** têm uma linha de base de CPU e acumulam **créditos** quando usam menos do que ela; gastam os créditos nos picos. Ideais para cargas leves com picos ocasionais.
- **Imagem:** modelo pré-configurado (sistema operacional, softwares, configurações) usado para criar VMs idênticas. Imagens personalizadas padronizam ambientes e alimentam o autoescalonamento.
- **Disco persistente:** armazenamento em bloco que sobrevive ao desligamento da VM (sistema operacional, bancos de dados, logs). Pode ser anexado, redimensionado, criptografado e copiado por snapshots.
- **Elasticidade e autoescalonamento:** regras que criam ou removem VMs por métrica (CPU, tamanho de fila) ou por agenda (mais máquinas às 8h, menos às 20h), idealmente atrás de um balanceador de carga.
- **Ciclo de vida:** em execução, parada, encerrada.
- **IP público fixo:** um endereço que sobrevive a paradas e pode ser reassociado a outra VM em caso de falha.
- **Acesso:** chave SSH (par público/privado, sem senha) em Linux; RDP em Windows.
- **Custos:** sob demanda, reservado, spot (interrompível) e plano de gasto. Discos continuam cobrando mesmo com a VM parada.

**Leitura de cockpit:** as instâncias de desempenho variável funcionam como o **ERS**. A bateria do ERS recolhe energia quando o carro não está usando toda a potência (nas frenagens) e a devolve na reta, onde ela vale tempo. Os **créditos de CPU** acumulam quando a máquina trabalha abaixo da linha de base e são gastos nos picos. E o sintoma é o mesmo quando a reserva acaba: o carro perde velocidade antes do fim da reta, e a VM sem créditos fica presa à linha de base. **Aqui a analogia para:** o ERS recolhe energia em frenagem, um evento físico de cada volta; os créditos dependem só do tempo que a máquina passa abaixo da linha de base. E existe um "modo ilimitado" (na AWS, o padrão das T3, segundo as notas do professor) em que a máquina segue no pico e você paga o excedente; na F1, energia extra não se compra.

**Leitura de cockpit:** o resto da garagem também tem nome. A **imagem** é a especificação de montagem: dela saem garagens idênticas, e é ela que o **autoescalonamento** usa para abrir mais garagens quando a carga sobe (na F1 o limite é de dois carros por equipe; na nuvem, é o limite que você configurar). O **disco persistente** é o armário de dados da garagem: continua lá, guardando tudo, com a garagem fechada, e continua cobrando. O **IP público fixo** fica sem imagem de pista: é um endereço reservado na sua conta, que você associa à máquina que quiser e que cobra mesmo parado.

### Equivalência AWS x Azure

| Conceito | AWS (conforme o material) | Azure (acréscimo) |
|---|---|---|
| Máquina virtual | EC2 instance | Virtual Machine |
| Famílias | t, m, c, r, g, i, d, h (por exemplo `t3.micro`) | Séries (B, D, E, F, N, L...; por exemplo `Standard_B1s`) |
| Burstable com créditos | Família T (T3, T4g) | Série B |
| Imagem | AMI | Imagem do Marketplace e imagens personalizadas (Azure Compute Gallery) |
| Autoescalonamento | Auto Scaling Group | Virtual Machine Scale Sets (com regras de autoscale) |
| Disco persistente | EBS (gp3, io1/io2, sc1/st1) | Managed Disks (Standard HDD, Standard SSD, Premium SSD, Ultra Disk) |
| Disco temporário | Volume efêmero (instance store) | Disco temporário da VM |
| IP público fixo | Elastic IP | Public IP com alocação estática |
| Firewall | Security Group | NSG |
| Par de chaves | Key pair (.pem) | Chave SSH (`--generate-ssh-keys`) |
| Identidade da VM | IAM Role (instance profile) | Managed Identity |
| Backup | AWS Backup, snapshots EBS | Azure Backup, snapshots de disco |
| Desconto por compromisso | Reserved Instances, Savings Plans | Azure Reservations, Savings Plan for compute |
| Capacidade ociosa | Spot Instances | Spot VMs |
| Métricas e logs da VM | CloudWatch e CloudWatch Agent | Azure Monitor e Azure Monitor Agent |
| Balanceador | ELB (ALB, NLB) | Application Gateway, Load Balancer (Etapa 09) |

**Leitura de cockpit:** famílias e séries são o catálogo de tamanhos de garagem de cada circuito. A `t3.micro` e a `Standard_B1s` são a garagem mais simples, com ERS (créditos) para os picos. Os nomes do catálogo mudam de um circuito para o outro; o raciocínio de escolher pelo perfil da carga é o mesmo.

### Exemplo comentado: do zero a uma VM

Duas leituras para escolher o tamanho, sem custo.

```bash
# AWS: quantas vCPUs e memória tem a t3.micro?
aws ec2 describe-instance-types --instance-types t3.micro \
  --query "InstanceTypes[0].{vcpu:VCpuInfo.DefaultVCpus,memoriaMiB:MemoryInfo.SizeInMiB}"
# Saída esperada: { "vcpu": 2, "memoriaMiB": 1024 }

# Azure (acréscimo): o tamanho Standard_B1s existe na região?
az vm list-sizes --location brazilsouth --query "[?name=='Standard_B1s']" --output table
# Se a linha aparecer, mostra núcleos e memória. Se não aparecer, o tamanho não existe nessa região.
```

**Criação (opcional, gera custo se ficar ligada):**

A rede e o firewall da Etapa 03 já foram apagados na limpeza, e aquela sub-rede não tinha rota para a internet. Por isso a VM da AWS usa a **VPC padrão** da região, que já vem com sub-redes públicas (rota para o Internet Gateway e IP público automático), e ganha um Security Group próprio. Se você apagou a VPC padrão, recrie-a com `aws ec2 create-default-vpc`.

```bash
# AWS: fixa a região desta sessão do terminal (São Paulo)
export AWS_DEFAULT_REGION=sa-east-1
# 1. Descobre a imagem (AMI) mais recente do Amazon Linux 2023 pelo parâmetro público do SSM
AMI_ID=$(aws ssm get-parameters \
  --names /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 \
  --query 'Parameters[0].Value' --output text)
# 2. Cria o par de chaves e guarda a chave privada só para você
aws ec2 create-key-pair --key-name lab --query KeyMaterial --output text > lab.pem && chmod 400 lab.pem
# 3. Security Group próprio na VPC padrão, com SSH liberado só para o seu IP
VPC_ID=$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true \
  --query 'Vpcs[0].VpcId' --output text)
SG_ID=$(aws ec2 create-security-group --group-name sg-vm-lab \
  --description "SSH so do meu IP" --vpc-id "$VPC_ID" --query GroupId --output text)
MEU_IP=$(curl -s https://checkip.amazonaws.com)
aws ec2 authorize-security-group-ingress --group-id "$SG_ID" \
  --protocol tcp --port 22 --cidr "$MEU_IP/32"
# 4. Cria UMA instância pequena e imprime o ID dela (anote para a limpeza)
aws ec2 run-instances \
  --image-id "$AMI_ID" \
  --instance-type t3.micro \
  --key-name lab \
  --security-group-ids "$SG_ID" \
  --count 1 \
  --query 'Instances[0].InstanceId' --output text
```

O que cada opção do `run-instances` faz:

- `--image-id`: a imagem base (aqui, o Amazon Linux 2023 descoberto pelo SSM).
- `--instance-type`: o tamanho.
- `--key-name`: o par de chaves para SSH (a chave privada está em `lab.pem`).
- `--security-group-ids`: o firewall, com SSH só do seu IP.
- Sem `--subnet-id`: a AWS escolhe uma sub-rede padrão da VPC padrão, que é pública.
- `--count`: quantas instâncias criar.

```bash
# Azure (acréscimo): recria o grupo e cria VM, disco, NIC e IP público em um comando
az group create --name rg-lab --location brazilsouth
az vm create \
  --resource-group rg-lab \
  --name vm-lab \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --generate-ssh-keys
```

O que cada opção do `az vm create` faz:

- `--resource-group`: o agrupador (para limpar depois).
- `--name`: o nome da VM.
- `--image`: o alias de imagem (liste outros com `az vm image list -o table`).
- `--size`: o tamanho.
- `--admin-username`: o usuário administrador.
- `--generate-ssh-keys`: cria o par de chaves SSH se ele não existir.

**Ciclo de vida: um detalhe de custo que pega muita gente.**

```bash
# AWS: parar mantém o disco; a instância deixa de gerar custo de computação
aws ec2 stop-instances --instance-ids <ID-DA-INSTANCIA>
# Azure (acréscimo): parar pelo sistema operacional NÃO libera a computação; é preciso DESALOCAR
az vm deallocate --resource-group rg-lab --name vm-lab
```

**Leitura de cockpit:** o detalhe de custo é a diferença entre apagar as luzes e devolver a garagem. Na AWS, parar a instância já libera a computação: a garagem sai da conta, e só o armário de dados (o EBS) e o IP fixo seguem cobrando. No Azure, desligar pelo sistema operacional é apagar as luzes com a garagem ainda reservada e cobrando; só o `deallocate` devolve a garagem ao circuito.

### Onde eles diferem de verdade

- **Parar x desalocar.** No Azure, uma VM "Stopped" (parada de dentro do sistema) continua com a computação reservada e cobrando; "Stopped (deallocated)" libera a computação e para a cobrança dela. Na AWS, parar a instância já interrompe o custo de computação (o EBS e o IP continuam cobrando).
- **Disco raiz ao encerrar.** Na AWS, encerrar (terminate) apaga os dados da instância e, por padrão, o volume raiz. Volumes EBS adicionais podem persistir. No Azure, apagar a VM não apaga automaticamente os discos, a NIC e o IP público, a menos que você os remova ou apague o resource group.
- **Créditos de CPU.** Ambos têm o modelo burstable com créditos, mas os parâmetros (créditos por hora, limites, modo ilimitado) são de cada série. Leia a documentação do tamanho que você escolher.
- **Chaves e Windows.** Na AWS, a chave privada `.pem` também é usada para decodificar a senha de administrador de instâncias Windows. No Azure, você define usuário e senha (ou chave SSH em Linux) na criação.
- **Imagens.** A AMI é regional e compartilhável entre contas. No Azure, imagens personalizadas vivem numa galeria (Azure Compute Gallery) e são compartilhadas por assinaturas e regiões por ela.
- **Endereço IP.** Na AWS, o IP público dinâmico muda ao parar e iniciar, e o Elastic IP é fixo. No Azure, o IP público tem alocação dinâmica ou estática.
- **Spot.** Os dois cobram menos por capacidade ociosa e podem interrompê-la. As regras de aviso e remoção diferem; leia a documentação antes de usar em carga real.

### Mão na massa

*Cronômetro na mão! Primeiro a conta da bateria, sem nuvem: créditos por hora e linha de base. Depois leitura, criação opcional e uma limpeza que não pode ser pulada.*

**Parte 1: aritmética de créditos (sem nuvem).** Segundo a aula, cada crédito vale 1 minuto de uso de uma vCPU a 100%. A `t3.micro` tem 2 vCPUs e ganha 12 créditos por hora (veja a correção nas notas do professor). Calcule a linha de base de CPU.

```bash
python3 -c "
creditos_hora = 12
vcpus = 2
minutos_de_cpu_cheia_por_hora = creditos_hora
base_por_vcpu = minutos_de_cpu_cheia_por_hora / 60 / vcpus
print(f'Linha de base: {base_por_vcpu:.0%} por vCPU')
"
# Saída esperada: Linha de base: 10% por vCPU
```

**Leitura de cockpit:** linha de base de 10% por vCPU quer dizer que, abaixo disso, a bateria carrega; acima, descarrega. Um site institucional passa o dia recolhendo energia e gasta no pico. Uma carga que fica o tempo todo acima da linha de base é um carro tentando fazer a volta inteira em modo de ataque: a bateria não acompanha, e a família burstable deixa de ser a escolha certa.

**Parte 2: leitura na nuvem.** Rode os dois comandos de tamanho. Depois liste suas VMs atuais:

```bash
aws ec2 describe-instances \
  --query "Reservations[].Instances[].{id:InstanceId,estado:State.Name,tipo:InstanceType}" --output table
# Azure (acréscimo)
az vm list --show-details --output table
# Observe o estado: running, stopped, "VM running", "VM deallocated"
```

**Parte 3: criação opcional.** Rode a criação da VM, depois confirme e entre por SSH:

```bash
# Azure (acréscimo)
az vm show --resource-group rg-lab --name vm-lab --show-details --query "{ip:publicIps,estado:powerState}" -o table
ssh azureuser@<IP-PUBLICO>
# AWS: descobre o IP público da instância e entra com a chave criada acima
aws ec2 describe-instances --instance-ids <ID-DA-INSTANCIA> \
  --query 'Reservations[0].Instances[0].PublicIpAddress' --output text
ssh -i lab.pem ec2-user@<IP-PUBLICO>
# (ec2-user é o usuário do Amazon Linux; outras imagens usam outro usuário)
```

**Limpeza (não pule: VM ligada cobra):**

```bash
# AWS: encerra a instância (apaga o volume raiz por padrão) e espera o encerramento
aws ec2 terminate-instances --instance-ids <ID-DA-INSTANCIA>
aws ec2 wait instance-terminated --instance-ids <ID-DA-INSTANCIA>
# Apaga o Security Group e o par de chaves (se fechou o terminal, troque $SG_ID pelo ID sg-... anotado)
aws ec2 delete-security-group --group-id "$SG_ID"
aws ec2 delete-key-pair --key-name lab && rm -f lab.pem
# Sobrou algum volume?
aws ec2 describe-volumes --query "Volumes[].VolumeId" --output text
# Azure (acréscimo): apaga VM, disco, NIC, IP e NSG de uma vez
az group delete --name rg-lab --yes --no-wait
# Antes de recriar o rg-lab na próxima etapa, espere a deleção terminar:
az group wait --deleted --name rg-lab
```

*Pit stop cronometrado! Escolher a família certa, explicar a fatura que não para de subir e salvar o DNS do cliente.*

**Exercícios**

1. Um site institucional tem CPU baixa quase o dia todo e picos curtos. Que família escolher nos dois provedores? Que risco existe se os créditos acabarem?
2. Você parou uma VM Azure pelo sistema operacional e a fatura continuou subindo. Por quê?
3. Uma instância EC2 em sub-rede pública perdeu o IP ao ser parada e reiniciada, e o DNS do cliente quebrou. Como evitar?

**Gabarito**

1. Família T (AWS) e série B (Azure). Sem créditos, o desempenho é limitado (exceto no modo ilimitado da AWS, que pode cobrar pelo excedente).
2. A VM estava parada, mas não desalocada: a computação continuava reservada. Use `az vm deallocate`.
3. Elastic IP (AWS) ou Public IP estático (Azure). Lembre que IPs públicos têm custo e que, segundo a aula, o Elastic IP ocioso é cobrado (veja as notas do professor).

**Anota aí:** VM é aluguel de servidor por tempo; escolha o tamanho pela carga, padronize com imagens, escale por regra, e lembre que disco e IP cobram mesmo com a máquina parada.

**Checklist da Etapa 04**

- [ ] Sei escolher família/série pelo perfil da carga.
- [ ] Sei explicar créditos de CPU em instâncias burstable.
- [ ] Sei a função de imagem, disco persistente e autoescalonamento.
- [ ] Sei a diferença entre parar e desalocar no Azure.
- [ ] Sei apagar tudo o que criei para não gerar custo.

*Setor 4 no verde! Garagem do tamanho certo, bateria sob controle e luzes apagadas de verdade quando o trabalho acaba. Na China, em 2007, o Lewis Hamilton ficou tempo demais com pneus gastos e perdeu a corrida na entrada dos boxes, e é essa a lição da Etapa 04: recurso usado além do limite (créditos de CPU esgotados, VM esquecida ligada) cobra a conta na hora errada. Agora as garagens passam a receber carros em série. Etapa 05, containers.*

---

## Etapa 05: Containers (ECS/EKS x Container Apps/AKS)

*Quinto setor, e é aqui que a operação ganha escala! A especificação do carro vira arquivo, o muro passa a repor sozinho quem para e a mesma ficha roda nos dois circuitos. Quem domina este setor entende boa parte da nuvem moderna.*

### O problema

"Na minha máquina funciona." O app roda no notebook do desenvolvedor, quebra em homologação por diferença de versão de biblioteca e quebra de novo em produção. Containers empacotam o aplicativo com suas dependências numa imagem que roda igual em qualquer lugar. O novo problema: com centenas de containers, quem os coloca nas máquinas, reinicia os que caem e distribui o tráfego? Para isso existe um orquestrador.

### O conceito, de forma neutra

**Analogia:** o contêiner de transporte marítimo. Qualquer carga, empacotada num formato padrão, serve a qualquer navio, trem ou caminhão. O orquestrador é o porto que decide onde cada contêiner é guardado e movido.

**Leitura de cockpit:** a F1 vive essa analogia. O material das equipes viaja em contêineres e engradados padronizados, por avião, navio e caminhão, de um circuito para o outro sem reembalar nada. No nosso mapa, a **imagem** é a especificação replicável do carro, guardada no **registro** (o arquivo central de especificações versionadas, ECR ou ACR); o **container** é um carro montado a partir dela; o **Pod** é o carro que vai para a pista, a menor unidade que o orquestrador põe para rodar (em geral leva um container; quando leva mais de um, eles dividem o mesmo chassi e a mesma telemetria). Os **nós de trabalho** são as garagens, as mesmas máquinas virtuais da Etapa 04, e o **control plane** é o muro: decide em que garagem cada carro fica, percebe quando um carro para e manda montar outro.

- **Container x VM:** o container compartilha o kernel do host em vez de iniciar um sistema operacional por aplicação; por isso é mais leve e rápido. Não substitui a VM, complementa.
- **Imagem e registro:** a imagem é o pacote; o registro (Docker Hub, ou o registro do provedor) a armazena. Bons registros escaneiam vulnerabilidades e controlam acesso.
- **Orquestração:** manter o estado desejado (quantas réplicas, qual imagem), reiniciar o que cai, escalar e balancear.
- **Kubernetes:** padrão aberto de orquestração, nascido no Google em 2014 (evolução do projeto interno Borg) e doado à CNCF em 2015. Você declara o estado desejado e ele cuida de provisionamento, escala e auto-recuperação. Conceitos: **control plane** (o cérebro, que decide onde cada coisa roda), **nós de trabalho** (máquinas onde os containers executam), **Pod** (menor unidade, com um ou mais containers), **Deployment** (réplicas e atualizações declarativas), **Service** (endereço estável para um conjunto de pods) e **Ingress** (regras de entrada HTTP).
- **Serverless para containers:** você entrega a imagem e o provedor cuida dos servidores (cobrança pelo recurso alocado à tarefa; menos controle fino).
- **Identidade por workload:** cada tarefa ou pod com permissões próprias (menor privilégio).
- **GitOps:** o repositório Git como fonte da verdade do que está implantado.

**Leitura de cockpit:** container x VM, no paddock: a VM é a garagem com gerador e sistemas próprios; os containers são os carros dentro de uma garagem, todos ligados à mesma energia (o **kernel** do host). Por isso o container sobe rápido: ninguém liga um gerador novo para cada carro. O **Deployment** é a ficha de operação ("quero três carros desta especificação na pista"); o **Service** é o canal de rádio de endereço fixo que fala com quem estiver na pista com aquela pintura, não importa qual chassi; o **Ingress** é a regra da entrada do pit lane para o tráfego HTTP. **Aqui a analogia para:** na F1 são dois carros por equipe em cada corrida; o Deployment pede 3, 5 ou 500 réplicas, e uma réplica nova sai da especificação em segundos.

### Equivalência AWS x Azure

| Conceito | AWS (conforme o material) | Azure (acréscimo) |
|---|---|---|
| Orquestrador próprio do provedor | ECS (tasks e services) | Azure Container Apps |
| Container serverless, sem servidor | AWS Fargate | Container Apps (serverless) e Azure Container Instances (ACI) para execuções simples |
| Kubernetes gerenciado | EKS | AKS |
| Registro de imagens | ECR | ACR (Azure Container Registry) |
| Nós de trabalho | Node group (instâncias EC2) | Node pool (VMs, em VM Scale Sets) |
| Definição de tarefa | Task definition (JSON) | Configuração do container app, ou manifestos Kubernetes no AKS |
| Identidade por tarefa ou pod | IAM Roles for Tasks (ECS) e for Service Accounts (EKS) | Managed Identity (Container Apps) e Microsoft Entra Workload ID (AKS) |
| Monitoramento | CloudWatch Container Insights | Container insights (Azure Monitor) |
| Prometheus e Grafana gerenciados | (não citado no material) | Azure Monitor managed Prometheus e Azure Managed Grafana |
| Segurança de containers | GuardDuty, scan do ECR | Microsoft Defender for Containers, scan de imagens no ACR |
| Certificados HTTPS | ACM | Certificados gerenciados do Front Door e Key Vault certificates |
| Service mesh | AWS App Mesh (suporte encerrado; veja a nota 11 do professor) | Add-on de service mesh para AKS (confira a opção atual) |
| Entrada HTTP no cluster | Ingress com ALB | Ingress com Application Gateway ou controladores de ingress no AKS |
| Escala por evento | KEDA (citado nas outras aulas) | KEDA (integrado ao Container Apps e disponível no AKS) |

**Leitura de cockpit:** a especificação do carro (o manifesto Kubernetes) é a mesma nos dois circuitos, e EKS e AKS são o par direto. O que muda é a infraestrutura por baixo, que é do circuito: as garagens (node groups e node pools), o balanceador, os discos. O ECS e o Container Apps são o procedimento simplificado de cada circuito: você entrega a especificação e o circuito cuida do muro e das garagens por você, com menos controle fino.

### Exemplo comentado: o mesmo cluster, nos dois provedores

**Criar um grupo de nós com 2 máquinas, mínimo 1 e máximo 3** (o `eksctl` do material e o `az aks nodepool add`):

Os dois comandos acrescentam nós a um cluster que já existe; o cluster em si é criado no bloco seguinte.

```bash
# AWS: grupo de nós gerenciado (eksctl, ferramenta de linha de comando para EKS)
eksctl create nodegroup \
  --cluster my-cluster \
  --name my-nodegroup \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3 \
  --managed

# Azure (acréscimo): node pool equivalente em um cluster AKS que já existe
az aks nodepool add \
  --resource-group rg-lab \
  --cluster-name aks-lab \
  --name pool2 \
  --node-count 2 \
  --enable-cluster-autoscaler \
  --min-count 1 --max-count 3
```

O que cada opção faz:

- `--cluster` (eksctl) e `--cluster-name` (az): o cluster EKS ou AKS onde o grupo entra; `--resource-group`: o grupo do cluster no Azure.
- `--name`: o nome do grupo de nós (node group) ou do pool (node pool).
- `--node-type`: o tamanho de cada nó na AWS.
- `--nodes` e `--node-count`: quantos nós ao iniciar.
- `--nodes-min`/`--nodes-max` e `--min-count`/`--max-count`: mínimo e máximo do autoescalonamento.
- `--managed`: nós gerenciados pela AWS; `--enable-cluster-autoscaler`: liga o autoescalonamento do cluster no AKS.

**Leitura de cockpit:** `--nodes 2 --nodes-min 1 --nodes-max 3` e `--node-count 2 --min-count 1 --max-count 3` são o mesmo acordo de garagens nos dois circuitos: abrir com duas, nunca menos de uma, nunca mais de três, e o autoescalonamento decide dentro dessa faixa conforme a carga.

**Criar o cluster em si** (opcional, custa dinheiro: nós são VMs):

```bash
# AWS: cluster EKS com nós gerenciados (leva vários minutos)
eksctl create cluster --name my-cluster --region sa-east-1 --nodes 2
# Azure (acréscimo): recria o grupo, cria o cluster AKS com 2 nós e baixa as credenciais para o kubectl
az group create --name rg-lab --location brazilsouth
az aks create --resource-group rg-lab --name aks-lab --node-count 2 --generate-ssh-keys
az aks get-credentials --resource-group rg-lab --name aks-lab
```

**ECS x Container Apps.** No ECS, uma **Task** é descrita em JSON e agrupada em um **Service**:

```json
{
  "family": "meu-app",                    // nome da família da task
  "networkMode": "awsvpc",                // cada task ganha sua interface de rede
  "requiresCompatibilities": ["FARGATE"], // roda no Fargate, sem gerir servidores
  "cpu": "256",                           // 0,25 vCPU
  "memory": "512",                        // 512 MiB
  "containerDefinitions": [{
    "name": "web",
    "image": "nginx",                     // imagem (do Docker Hub ou do ECR)
    "essential": true,                    // se esse container cair, a task cai
    "portMappings": [{ "containerPort": 80 }]
  }]
}
```

(Remova os comentários `//` antes de registrar esta task definition; JSON real não os aceita.)

No Container Apps, a mesma intenção é um comando (a extensão `containerapp` pode ser instalada automaticamente na primeira vez):

```bash
# Azure (acréscimo): garante o grupo, cria o ambiente (a "região" lógica) e depois o app
az group create --name rg-lab --location brazilsouth
az containerapp env create --name env-lab --resource-group rg-lab --location brazilsouth
# --image: imagem de exemplo da Microsoft; --target-port e --ingress external: expõem a porta 80 para a internet
az containerapp create --name app-lab --resource-group rg-lab --environment env-lab \
  --image mcr.microsoft.com/k8se/quickstart:latest \
  --target-port 80 --ingress external
```

**Os manifestos Kubernetes são os mesmos em EKS e AKS** (Pod, Service, Deployment, Ingress do material). Veja o Deployment, comentado:

```yaml
apiVersion: apps/v1            # versão da API para Deployments
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
  type: ClusterIP              # acessível só dentro do cluster
```

**Leitura de cockpit:** leia o YAML como a ficha de operação. `replicas: 3` é quantos carros você quer na pista; o `template` é a especificação de montagem de cada um; o rótulo `app: minha-aplicacao` é a pintura que identifica o carro; o `selector` do Service é o engenheiro de rádio procurando essa pintura na pista. Carro sem a pintura não recebe chamada: é exatamente o problema do `pod.yaml` sem `labels` que as notas do professor apontam.

### Onde eles diferem de verdade

- **ECS não existe no Azure.** O ECS é um orquestrador proprietário da AWS. A resposta do Azure para "orquestração simples sem Kubernetes" é o Container Apps, que por baixo roda sobre Kubernetes mas esconde a complexidade, com escala por eventos (KEDA) e escala a zero. Para Kubernetes puro, EKS e AKS são o par direto.
- **Plano de controle e custo.** O material cita custo adicional do plano de controle no EKS. O AKS oferece uma camada gratuita de plano de controle (sem SLA financeiro) e camadas pagas com mais garantias; confira as camadas e os preços atuais.
- **Pools de sistema.** O AKS exige um node pool de sistema (componentes do cluster) e permite pools de usuário para suas aplicações.
- **Identidade.** IRSA (EKS) e Workload Identity (AKS) resolvem o mesmo problema (pod com identidade própria, sem chave), com mecanismos diferentes de federação.
- **Serviços do tipo LoadBalancer e storage.** O YAML é o mesmo, mas o que ele provisiona por baixo muda: no EKS vira um balanceador da AWS, no AKS um Azure Load Balancer. O mesmo vale para StorageClass (EBS x Managed Disks) e para o controlador de ingress.
- **Fargate x ACI/Container Apps.** O Fargate também roda sob o EKS. No Azure, o equivalente de "container sem nó para gerenciar" aparece como produto separado (Container Apps ou ACI), não como modo do AKS.

**Aqui a analogia para:** "mesma especificação" não quer dizer "mesmo fim de semana". O manifesto é o mesmo nos dois circuitos, mas o `type: LoadBalancer`, a StorageClass e o controlador de ingress viram, por baixo, equipamentos de cada circuito, com preço e comportamento próprios. E o ECS não tem gêmeo no Azure: o Container Apps resolve o mesmo problema, rodando sobre Kubernetes por baixo.

### Mão na massa

*Pit lane aberto, e sem conta de nuvem! Você sobe um cluster na própria máquina, aplica a ficha de operação e derruba um carro de propósito para ver o muro repor. A parte na nuvem é opcional e cobra: só com crédito, e apagando no mesmo dia.*

**Parte 1: leitura (sem custo).**

```bash
aws ecr describe-repositories --query "repositories[].repositoryName" --output text   # registros ECR
aws eks list-clusters
# Azure (acréscimo)
az acr list --output table
az aks list --output table
```

**Parte 2: caminho local (kind ou minikube), sem conta de nuvem.** O YAML Kubernetes é o mesmo do EKS e do AKS. Salve o manifesto acima em `app.yaml` e rode:

```bash
kind create cluster --name lab        # cria um cluster Kubernetes dentro do Docker
# (alternativa: minikube start)
kubectl apply -f app.yaml             # cria o Deployment e o Service
kubectl get pods                      # lista os pods
# Saída esperada (nomes e idades variam), após alguns segundos:
# NAME                              READY   STATUS    RESTARTS   AGE
# meu-deployment-5d9c7c8b7d-4xk2p   1/1     Running   0          25s
# meu-deployment-5d9c7c8b7d-7hm9q   1/1     Running   0          25s
# meu-deployment-5d9c7c8b7d-zl2wd   1/1     Running   0          25s

# espera os Pods ficarem prontos (a imagem pode ainda estar baixando)
kubectl wait --for=condition=available deployment/meu-deployment --timeout=90s
kubectl port-forward svc/meu-servico 8080:80 &   # abre o serviço em localhost:8080
sleep 2                                          # dá tempo de o túnel abrir antes do curl
curl -s localhost:8080 | head -4
# Saída esperada: início do HTML "Welcome to nginx!"
```

Auto-recuperação e escala, o coração do Kubernetes:

```bash
kubectl delete pod <NOME-DE-UM-POD>          # derruba um pod
kubectl get pods                             # um pod novo já apareceu: o Deployment restaurou as 3 réplicas
kubectl scale deployment meu-deployment --replicas=5
kubectl get pods                             # agora são 5
```

**Leitura de cockpit:** o `kubectl delete pod` é um carro parando na pista. O muro (o control plane) percebe que a ficha pede três e só há dois rodando, e manda montar outro a partir da especificação, sem ninguém pedir. Em Sepang, quando o carro do George Russell parou na reta durante o último safety car, não havia reposição possível: na F1, carro parado é prova perdida, e a diferença para o Kimi Antonelli chegou a 84 pontos. No Kubernetes, o Pod perdido volta em segundos. É a diferença entre ter dois carros e ter réplicas.

**Parte 3: nuvem (opcional, gera custo).** Criar cluster EKS ou AKS custa; faça só se tiver crédito e apague no mesmo dia. Depois do `az aks get-credentials` ou `aws eks update-kubeconfig --region sa-east-1 --name my-cluster`, rode o mesmo `kubectl apply -f app.yaml` e compare: o YAML não muda.

**Limpeza:**

```bash
# Local
kill %1 2>/dev/null             # encerra o port-forward
kubectl delete -f app.yaml
kind delete cluster --name lab
# AWS (se criou cluster)
eksctl delete cluster --name my-cluster --region sa-east-1
# Azure (acréscimo): apaga cluster, container app e ambiente
az group delete --name rg-lab --yes --no-wait
# Antes de recriar o rg-lab na próxima etapa, espere a deleção terminar:
az group wait --deleted --name rg-lab
```

*Volta lançada! O que sugerir a um time pequeno, se o Service acha o Pod sem pintura e por que a mesma ficha não garante a mesma fatura.*

**Exercícios**

1. Você é um time pequeno, com uma API simples, só na nuvem, sem experiência em Kubernetes. O que sugere nos dois provedores? E se a empresa já usa Kubernetes no datacenter?
2. O material traz um `pod.yaml` sem `labels` e um `service.yaml` com `selector: app: minha-aplicacao`. O Service encontrará esse pod?
3. Por que "mesmo YAML" não significa "mesma conta no fim do mês" entre EKS e AKS?

**Gabarito**

1. ECS com Fargate (AWS) e Container Apps (Azure), pela simplicidade. Já usando Kubernetes: EKS ou AKS, pela portabilidade.
2. Não. O Service seleciona pods pelo rótulo; um pod sem o rótulo `app: minha-aplicacao` não entra. No Deployment do material o rótulo existe no `template`.
3. O manifesto é igual, mas custos de plano de controle, nós, balanceadores, discos e rede são cobrados de forma diferente por cada provedor.

**Anota aí:** container empacota, orquestrador mantém o estado desejado; o Kubernetes é o idioma comum entre EKS e AKS, e a simplicidade serverless (Fargate, Container Apps) tem o preço de menos controle.

**Checklist da Etapa 05**

- [ ] Sei explicar container x VM.
- [ ] Sei o que são Pod, Deployment, Service e Ingress.
- [ ] Sei o que o control plane faz e quem o gerencia no EKS e no AKS.
- [ ] Rodei um Deployment em kind ou minikube e vi a auto-recuperação.
- [ ] Sei qual produto Azure responde ao ECS com Fargate.

*Setor 5 no verde! Especificação no arquivo central, ficha de operação aplicada e réplicas que voltam sozinhas. Mas carro nenhum vai longe sem dado. Etapa 06, bancos de dados: o livro técnico e o controle de pneus por etiqueta.*

---

## Etapa 06: Bancos de dados (RDS, Aurora e DynamoDB x Azure SQL, PostgreSQL/MySQL e Cosmos DB)

*Sexto setor! Agora a pergunta é onde mora a informação: no livro técnico que liga peça, chassi e piloto, ou no controle por etiqueta que responde na hora. A escolha certa depende da pergunta que você vai fazer todo dia.*

### O problema

Uma loja virtual guarda pedidos num banco hospedado numa VM. Na Black Friday a base trava; o backup noturno falhou há semanas e ninguém notou; o patch de segurança está atrasado. O banco é o coração do sistema: se parar ou funcionar mal, todo o resto é afetado. Bancos gerenciados tiram da equipe o peso de provisionar, atualizar e fazer backup.

### O conceito, de forma neutra

**Analogia:** relacional é uma planilha com regras rígidas entre abas (tabelas ligadas por chaves, tudo consistente). NoSQL de chave-valor é um armário com gavetas etiquetadas: você pega a gaveta pela etiqueta, rapidíssimo, mas não faz cruzamentos complexos entre gavetas.

**Leitura de cockpit:** o banco relacional é o **livro técnico oficial do carro**: cada peça ligada a um chassi, cada chassi a um piloto, com regras que não deixam registrar uma peça sem dono. O NoSQL de chave-valor é o **controle de pneus por código de barras**: pela etiqueta você acha na hora o histórico daquele jogo de pneus, mas perguntas como "quais pneus rodaram em carros com a asa nova numa pista quente" pedem cruzamentos que esse modelo não faz bem. **Aqui a analogia para:** não estou afirmando como as equipes guardam esses dados por dentro; é uma imagem do tipo de pergunta que cada modelo responde bem.

- **Relacional (SQL):** acessado com SQL, ênfase na consistência, transações **ACID** (atomicidade, consistência, isolamento, durabilidade), esquema fixo, joins e integridade referencial.
- **Não relacional (NoSQL):** escalabilidade horizontal e flexibilidade de estrutura. Modelos: chave-valor, documentos, colunar e grafos. Excelentes para altas taxas de leitura e escrita com baixa latência.
- **Serviço gerenciado:** o provedor cuida de provisionamento, patches, backups automáticos, recuperação a um ponto no tempo e alta disponibilidade (réplica em outra zona, com failover).
- **Escala:** vertical (mais CPU e memória) e horizontal (réplicas de leitura).
- **Separar armazenamento de processamento:** arquitetura em que o volume de dados é distribuído e replicado independentemente do nó de computação, o que acelera failover e permite muitas réplicas de leitura.
- **Modelo de capacidade:** provisionada (você define) ou sob demanda/serverless (ajusta sozinha e cobra por uso).
- **Cache, eventos e replicação global:** cache em memória na frente do banco, stream de mudanças e replicação entre regiões.
- **Custo e segurança:** dimensionamento errado gera gasto; criptografia em repouso e em trânsito, controle de acesso, auditoria e rede privada são obrigatórios.

**Leitura de cockpit:** o **A** de ACID (atomicidade) é a lógica de liberar um carro do pit stop: ou as quatro rodas foram trocadas e fixadas, ou o carro não volta para a pista. Não existe "metade da troca" valendo lá fora. A **alta disponibilidade entre zonas** é ter uma cópia viva do banco em outro prédio de garagens, pronta para assumir; as **réplicas de leitura** são cópias somente leitura que atendem as consultas, para o original cuidar das gravações. **Aqui a analogia para:** na transação que falha, o banco volta ao estado anterior; no pit stop que dá errado, ninguém devolve os pneus velhos, o carro só fica parado até a troca terminar.

### Equivalência AWS x Azure

| Conceito | AWS (conforme o material) | Azure (acréscimo) |
|---|---|---|
| Relacional gerenciado (SQL Server) | RDS for SQL Server | Azure SQL Database (e SQL Managed Instance) |
| Relacional gerenciado (PostgreSQL e MySQL) | RDS (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server) | Azure Database for PostgreSQL e for MySQL (flexible server) |
| Relacional de alta escala, armazenamento separado | Aurora (MySQL e PostgreSQL) | Azure SQL Database Hyperscale (arquitetura com armazenamento separado; não é uma tradução 1 para 1 do Aurora) |
| Relacional serverless | Aurora Serverless | Azure SQL Database serverless (tier de computação) |
| NoSQL | DynamoDB | Cosmos DB (múltiplas APIs) |
| Cache em memória para o NoSQL | DAX | Cache integrado do Cosmos DB |
| Stream de mudanças | DynamoDB Streams | Change feed do Cosmos DB |
| Replicação multi-região | Aurora Global Database, DynamoDB Global Tables | Georreplicação do Azure SQL e distribuição global do Cosmos DB |
| Alta disponibilidade entre zonas | Multi-AZ | Alta disponibilidade zone-redundant |
| Réplicas de leitura | Até 15 no Aurora; réplicas no RDS | Réplicas de leitura nos serviços Azure (os limites variam por serviço) |
| Backup e restauração pontual | Backups automáticos e point-in-time | Backups automáticos e point-in-time restore |
| Data warehouse | Redshift | Azure Synapse Analytics e Microsoft Fabric |
| Chaves de criptografia | KMS | Key Vault (chaves gerenciadas pelo cliente) |
| Auditoria | CloudTrail | Activity Log e logs de diagnóstico |
| Limpeza automática por validade | TTL | TTL (suportado no Cosmos DB) |

**Leitura de cockpit:** os dois circuitos oferecem o livro técnico gerenciado (RDS, Azure SQL e os PostgreSQL e MySQL gerenciados) e o controle por etiqueta (DynamoDB, Cosmos DB). Gerenciado quer dizer que o circuito cuida da manutenção do arquivo (patches, backups, cópia em outra zona) e a equipe cuida do que escreve nele.

### Exemplo comentado: o NoSQL de chave-valor nos dois mundos

**AWS DynamoDB (sob demanda, sem servidor para gerir):**

```bash
# Cria a tabela "pedidos" com chave de partição "id" (texto), cobrança por requisição:
# --attribute-definitions declara o atributo id como String (S);
# --key-schema faz de id a chave de partição (HASH);
# --billing-mode PAY_PER_REQUEST é o modo sob demanda.
aws dynamodb create-table --table-name pedidos \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
# Espera a tabela ficar ACTIVE antes de gravar
aws dynamodb wait table-exists --table-name pedidos

aws dynamodb put-item --table-name pedidos \
  --item '{"id":{"S":"1001"},"item":{"S":"café"}}'            # grava um item

aws dynamodb get-item --table-name pedidos --key '{"id":{"S":"1001"}}'
# Saída esperada: {"Item": {"id": {"S": "1001"}, "item": {"S": "café"}}}
```

**Azure Cosmos DB (acréscimo), conta serverless com a API NoSQL:**

```bash
# Recria o grupo (a limpeza da etapa anterior o apagou)
az group create --name rg-lab --location brazilsouth
# O nome da conta é globalmente único: troque <NOME-UNICO>
az cosmosdb create --name cosmos-<NOME-UNICO> --resource-group rg-lab \
  --kind GlobalDocumentDB --capabilities EnableServerless
# Cria o banco "loja" e o contêiner "pedidos" com chave de partição /id
az cosmosdb sql database create --account-name cosmos-<NOME-UNICO> --resource-group rg-lab --name loja
az cosmosdb sql container create --account-name cosmos-<NOME-UNICO> --resource-group rg-lab \
  --database-name loja --name pedidos --partition-key-path "/id"
```

Para gravar e ler itens no Cosmos DB, use o **Data Explorer** do portal ou um SDK (o plano de dados não é operado por esses comandos de gerenciamento).

**Leitura de cockpit:** a chave de partição `id` é a etiqueta do pneu. Com ela, o `get-item` vai direto ao item certo. Escolher a chave é decidir por onde você vai buscar: se a pergunta do dia a dia não for pela etiqueta, o modelo de chave-valor passa a trabalhar contra você.

### Onde eles diferem de verdade

- **Aurora não tem gêmeo exato.** O Aurora separa armazenamento (seis cópias em três zonas, volume que cresce de 10 GB a 128 TB, até 15 réplicas de leitura, segundo o material) de processamento. No Azure, a ideia de separar armazenamento aparece no Hyperscale do Azure SQL; para PostgreSQL e MySQL gerenciados, o caminho de escala de leitura é a réplica de leitura. Compare por requisitos, não por nome.
- **Cosmos DB tem várias APIs.** O DynamoDB é um modelo (chave-valor e documentos) com API própria. O Cosmos DB expõe a mesma engine por várias APIs: NoSQL (nativa), MongoDB, Cassandra, Gremlin (grafos) e Table, além de uma opção PostgreSQL distribuída. Isso reduz o esforço de migração se você já usa MongoDB ou Cassandra.
- **Níveis de consistência.** O DynamoDB oferece leitura eventualmente consistente ou fortemente consistente, escolhida por requisição. O Cosmos DB oferece cinco níveis configuráveis: Strong, Bounded staleness, Session, Consistent prefix e Eventual, trocando latência e disponibilidade por garantias de leitura.
- **Capacidade.** Os dois têm modo provisionado e sob demanda/serverless, mas com unidades diferentes: o Cosmos DB mede custo de operações em *Request Units por segundo*. Estimar capacidade usa calculadoras distintas.
- **Engines.** O material cita RDS com Oracle e MariaDB. Para esses dois engines, confira a disponibilidade e o formato de oferta no Azure em vez de assumir paridade.
- **ACID e joins.** Em qualquer provedor, relacionamentos complexos, integridade referencial e transações multi-tabela favorecem o banco relacional; chave-valor favorece latência e escala simples.

**Aqui a analogia para:** os **níveis de consistência** lembram a diferença entre o tempo no monitor do muro e o placar de um site de resultados que só alcança o oficial com algum atraso. **Hipotético:** um site que, segundos depois da bandeirada em Sepang, ainda mostrasse o Kimi Antonelli sem os pontos do segundo lugar estaria exibindo uma leitura eventualmente consistente; ele chega aos 320 pontos oficiais logo depois. *Strong* é só aceitar o número do monitor; *Eventual* é aceitar o placar que alcança o oficial em algum momento. Os níveis intermediários (Bounded staleness, Session, Consistent prefix) não têm imagem limpa na pista: estude-os pela definição técnica acima.

### Mão na massa

*Bancada ligada! Primeiro a regra do pit stop escrita em código: a transferência que falha no meio não pode sumir com dinheiro. Depois leitura na nuvem e, se quiser, uma tabela por etiqueta nos dois circuitos.*

**Parte 1: atomicidade, sem nuvem.** Uma transferência bancária que falha no meio não pode deixar dinheiro sumir:

```bash
python3 - <<'EOF'
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
# Saída esperada:
# erro: falha no meio da transferência
# [(1, 100), (2, 50)]
```

O saldo da conta 1 voltou a 100: isso é **atomicidade**.

**Leitura de cockpit:** é a regra do pit stop escrita em código: a falha no meio da operação não deixa a conta 1 com 70 a menos e a conta 2 sem receber. Ou a transferência inteira acontece, ou nada muda.

**Parte 2: leitura na nuvem.**

```bash
aws rds describe-db-instances --query "DBInstances[].{id:DBInstanceIdentifier,engine:Engine}" --output table
aws dynamodb list-tables
# Azure (acréscimo)
az sql server list --output table
az postgres flexible-server list --output table
az cosmosdb list --output table
```

**Parte 3: criação opcional (modelo sob demanda, custo mínimo).** Rode a criação do DynamoDB e do Cosmos DB serverless acima e confirme a existência:

```bash
aws dynamodb describe-table --table-name pedidos --query "Table.TableStatus"   # "ACTIVE"
# Azure (acréscimo)
az cosmosdb sql container show --account-name cosmos-<NOME-UNICO> --resource-group rg-lab \
  --database-name loja --name pedidos --query "resource.id"
```

**Limpeza:**

```bash
aws dynamodb delete-table --table-name pedidos
# Azure (acréscimo): apaga a conta Cosmos e tudo no grupo
az group delete --name rg-lab --yes --no-wait
# Antes de recriar o rg-lab na próxima etapa, espere a deleção terminar:
az group wait --deleted --name rg-lab
```

*Pit stop cronometrado! Jogo online, ERP legado e sessões que expiram sozinhas: um serviço para cada caso, nos dois circuitos.*

**Exercícios**

1. Um app de jogo online com milhões de acessos simultâneos precisa de leituras de milissegundos por chave, sem joins. Que serviço nos dois provedores?
2. Um ERP legado usa SQL Server com joins e transações entre muitas tabelas. Que serviço?
3. Uma tabela de sessões deve expirar sozinha. Que recurso cobre isso nos dois?

**Gabarito**

1. DynamoDB e Cosmos DB (API NoSQL), por latência e escala horizontal.
2. RDS for SQL Server (AWS) e Azure SQL Database ou SQL Managed Instance (Azure).
3. TTL (existe nos dois).

**Anota aí:** relacional para integridade e joins, NoSQL para latência e escala por chave; o Aurora e o Cosmos DB não são traduções diretas de nada, então compare por requisito.

**Checklist da Etapa 06**

- [ ] Sei dizer o que é ACID e por que importa.
- [ ] Sei escolher entre RDS, Aurora e DynamoDB (e seus pares no Azure).
- [ ] Sei o que é separar armazenamento de processamento.
- [ ] Sei citar os cinco níveis de consistência do Cosmos DB.
- [ ] Sei apagar tabelas e contas criadas na prática.

*Setor 6 no verde! Transação atômica, chave de partição bem escolhida e cada banco no papel certo. Agora o circuito começa a trabalhar por você: a estação que só abre quando chega um pedido. Etapa 07, serverless.*

---

## Etapa 07: Serverless (Lambda e API Gateway x Azure Functions e API Management)

*Sétimo setor! Nenhum servidor ligado esperando, cobrança por atendimento e uma volta de saída fria de vez em quando. Mas atenção ao contrato: quanto mais o procedimento usa os encaixes de um circuito só, mais cara fica a mudança.*

### O problema

Uma empresa de mídia recebe milhões de fotos enviadas pelos usuários, com picos imprevisíveis. Manter servidores ligados 24 horas só para redimensionar imagens significa pagar por ociosidade quase o tempo todo e ainda ter risco de saturar no pico. A ideia do serverless: escrever uma função que roda em resposta a um evento, e pagar só pelo tempo em que ela executa.

### O conceito, de forma neutra

**Analogia:** o táxi por aplicativo. Você não tem um motorista contratado o dia todo; chama quando precisa e paga pela corrida.

**Leitura de cockpit:** imagine uma estação de serviço que o circuito só abre quando chega um pedido. Você entrega o procedimento escrito (a **função**, com seu **handler**), o circuito põe gente e ferramenta na hora, executa, fecha e cobra por atendimento. O **gatilho** é o pedido que abre a estação: uma requisição HTTP, um arquivo que chegou, uma mensagem na fila. O **cold start** é a **volta de saída**: na primeira chamada depois de um tempo parada, a função ainda está fria e responde mais devagar, como o carro que sai do box com pneus e freios abaixo da temperatura. O **API gateway** é a portaria do paddock: confere o passe, limita quantos entram por minuto, guarda respostas prontas e manda cada um para o setor certo. **Aqui a analogia para:** nada na F1 é cobrado por atendimento nem escala de zero a milhares de cópias em segundos; a estação sob demanda é imagem didática, não prática de paddock.

- **Serverless não é "sem servidores":** os servidores existem, mas o provedor cuida de instalação, escala e manutenção. Você cuida do código.
- **Evolução:** on-premises, colocation, nuvem (VMs) e serverless (só funções).
- **Função:** pequena unidade de código com um ponto de entrada (*handler*) que recebe um evento e devolve uma resposta.
- **Gatilhos (triggers):** requisição HTTP, upload de arquivo, mudança em banco, mensagem em fila, agendamento.
- **Escala automática e cobrança por uso:** cada evento pode gerar uma execução isolada; paga-se por requisições e duração (e memória alocada).
- **Cold start:** atraso para inicializar uma função inativa.
- **API gateway:** porta de entrada que expõe rotas HTTP, valida entrada, autentica, limita taxa, faz cache e roteia para as funções.
- **Padrões de uso:** autenticação por token no gateway, banco de dados com cuidado de conexões, **orquestração** de fluxos, **desacoplamento** com filas e tópicos, **eventos** como cola entre serviços.
- **Quando evitar:** execuções longas, conexões persistentes, carga alta e constante (pode sair mais caro) e **lock-in** (acoplamento ao provedor).

**Leitura de cockpit:** o **lock-in** é o procedimento escrito para a garagem de um circuito só: funciona muito bem ali, usa as tomadas, os encaixes e os atalhos daquele lugar, e não roda no circuito seguinte sem ser reescrito. A **fila** é a pilha de pneus usados esperando análise: quem produz não espera quem processa. A **orquestração** é o roteiro de um pit stop: etapas em ordem, algumas em paralelo, e um plano para quando a porca não sai.

### Equivalência AWS x Azure

| Conceito | AWS (conforme o material) | Azure (acréscimo) |
|---|---|---|
| Função serverless | Lambda | Azure Functions |
| Gateway de API | API Gateway (REST, HTTP e WebSocket) | API Management (APIM); Functions também expõem HTTP direto |
| Tempo real, WebSocket | API Gateway WebSocket | Azure Web PubSub e SignalR Service |
| Autenticação de usuários finais | Cognito | Microsoft Entra ID e Entra External ID (confira o nome atual) |
| Chave de acesso à API | API Keys | Subscription keys do APIM |
| Validação de token JWT | Authorizer no API Gateway | Política `validate-jwt` do APIM |
| Orquestração de fluxos | Step Functions | Logic Apps ou Durable Functions |
| Barramento de eventos | EventBridge | Event Grid |
| Fila de mensagens | SQS | Queue Storage ou Service Bus (filas) |
| Tópicos e notificações | SNS | Service Bus (topics e subscriptions) e Event Grid |
| Streaming de dados | Kinesis | Event Hubs |
| Gatilho de arquivo | S3 trigger | Blob trigger ou eventos de blob via Event Grid |
| Gatilho de banco NoSQL | DynamoDB Streams | Change feed do Cosmos DB |
| Empacotamento e deploy local | SAM e CDK | Azure Functions Core Tools, Bicep |
| Rastreamento distribuído | X-Ray | Application Insights |
| Logs e métricas | CloudWatch | Azure Monitor |

**Leitura de cockpit:** o mesmo conjunto de estações existe nos dois circuitos, com nomes diferentes: a estação sob demanda (Lambda, Functions), a portaria (API Gateway, APIM), a pilha de espera (SQS, Queue Storage ou Service Bus) e o roteiro (Step Functions, Logic Apps ou Durable Functions). **Hipotético:** um site de fãs grava o resultado de cada GP num repositório de arquivos; quando chega o arquivo de Sepang, o gatilho de arquivo (S3 trigger ou Blob trigger) dispara uma função que recalcula a tabela e publica o Kimi Antonelli com 320 pontos e o George Russell com 236. Nenhum servidor ficou ligado esperando a corrida acabar.

### Exemplo comentado: a mesma função HTTP

**AWS Lambda em Python:**

```python
import json

def lambda_handler(event, context):                       # ponto de entrada: recebe evento e contexto
    params = event.get("queryStringParameters") or {}      # parâmetros da URL, se houver
    nome = params.get("nome", "mundo")                     # padrão: "mundo"
    return {                                               # formato esperado pelo API Gateway
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"mensagem": f"Olá, {nome}!"}, ensure_ascii=False),
    }
```

**Azure Functions em Python (acréscimo), modelo de programação v2:**

```python
import json
import azure.functions as func

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)  # app de funções; sem chave exigida

@app.route(route="ola")                                    # expõe a função em /api/ola
def ola(req: func.HttpRequest) -> func.HttpResponse:       # ponto de entrada: recebe a requisição
    nome = req.params.get("nome", "mundo")                 # parâmetro da URL, padrão "mundo"
    corpo = json.dumps({"mensagem": f"Olá, {nome}!"}, ensure_ascii=False)
    return func.HttpResponse(corpo, mimetype="application/json", status_code=200)
```

Perceba que o **evento** (formato do que entra) e a **resposta** (formato do que sai) são diferentes: o Lambda recebe um dicionário e devolve um dicionário; o Azure Functions recebe e devolve objetos tipados. Esse é um exemplo concreto de acoplamento ao provedor.

**Leitura de cockpit:** é o lock-in no nível do código. A lógica é a mesma ("cumprimentar quem chamou"), mas a função da AWS recebe e devolve dicionários, e a do Azure recebe e devolve objetos tipados. É o mesmo procedimento escrito em dois formulários diferentes, um de cada circuito.

Padrões de integração, lado a lado: o desacoplamento com fila e a orquestração.

| Padrão | AWS | Azure (acréscimo) |
|---|---|---|
| Uma função enfileira, outra consome | Lambda, SQS, Lambda | Function, Queue Storage ou Service Bus, Function |
| Um evento, vários interessados | SNS ou EventBridge | Service Bus topics ou Event Grid |
| Fluxo com erros, paralelismo e estado | Step Functions | Logic Apps ou Durable Functions |

### Onde eles diferem de verdade

- **Gatilhos e bindings.** No Azure Functions, gatilhos e *bindings* de entrada e saída são declarados na própria função (por exemplo, "quando chegar um blob, leia-o, e escreva o resultado em uma fila") e reduzem o código de cola. No Lambda, a integração costuma ser configurada fora do código e feita por SDK.
- **Planos de hospedagem.** O Azure Functions oferece mais de um plano de hospedagem (consumo, premium, dedicado), com comportamentos diferentes de cold start e escala. O Lambda tem um modelo único de execução por requisição, com concorrência configurável. Compare os planos atuais na documentação.
- **API Gateway x APIM.** O API Gateway da AWS se divide em REST, HTTP e WebSocket, com custo e recursos diferentes. O APIM é um produto mais amplo de gestão de APIs (políticas em XML, portal de desenvolvedores, versionamento), e WebSocket em tempo real costuma ser tratado por serviços dedicados (Web PubSub, SignalR).
- **Orquestração.** Step Functions define fluxos como máquinas de estado. No Azure há duas escolhas: Logic Apps (fluxos visuais com conectores) e Durable Functions (orquestração em código).
- **Fila x mensageria.** SQS cobre filas; SNS cobre publicação para vários destinos. No Azure, o Queue Storage é simples e barato; o Service Bus agrega filas e tópicos com recursos avançados de mensageria.
- **Lock-in.** O material alerta que Step Functions, Cognito e SQS reforçam o acoplamento com a AWS. O mesmo se aplica ao Azure: bindings, Durable Functions e Logic Apps prendem o código ao provedor. Um jeito de reduzir é isolar a lógica de negócio numa função pura, chamada por um adaptador fino.

**Aqui a analogia para:** o adaptador fino sugerido acima é o jeito de manter um procedimento da equipe e trocar só a capa do formulário em cada circuito. Na prática, quanto mais você usa bindings, Durable Functions, Step Functions e filas proprietárias, mais grossa fica a capa, e mais cara a mudança de circuito.

### Mão na massa

*Simulador ligado! O handler roda inteiro na sua máquina com um evento falso, antes de tocar em qualquer circuito. A criação na nuvem vem depois, opcional, e termina com limpeza.*

**Parte 1: executar o handler sem nuvem.** Salve o Lambda como `handler.py` e chame-o como uma função Python qualquer, com um evento falso:

```bash
python3 -c "
import handler
print(handler.lambda_handler({'queryStringParameters': {'nome': 'Ana'}}, None))
"
# Saída esperada:
# {'statusCode': 200, 'headers': {'Content-Type': 'application/json'}, 'body': '{"mensagem": "Olá, Ana!"}'}
```

Agora sem parâmetro:

```bash
python3 -c "import handler; print(handler.lambda_handler({}, None)['body'])"
# Saída esperada: {"mensagem": "Olá, mundo!"}
```

Para a versão Azure, o caminho local é o **Azure Functions Core Tools** (`func init` e `func start`, que expõem `http://localhost:7071/api/ola`). Ele precisa ser instalado à parte; se não quiser instalar, a leitura do código já cumpre o objetivo.

**Leitura de cockpit:** chamar o handler com um evento falso é o simulador: o procedimento roda inteiro na sua máquina, sem tocar no circuito, e você vê a resposta exata que a portaria receberia.

**Parte 2: leitura na nuvem.**

```bash
aws lambda list-functions --query "Functions[].FunctionName" --output text
aws apigatewayv2 get-apis --query "Items[].Name" --output text
# Azure (acréscimo)
az functionapp list --output table
az apim list --output table
```

**Parte 3: criação opcional.** Funções têm camada gratuita nos dois provedores, mas o custo depende do consumo e da conta; crie pelo console/portal (mais simples para o primeiro contato), teste a URL e apague. No Azure, crie a function app dentro do `rg-lab`, recriando o grupo antes com `az group create --name rg-lab --location brazilsouth` (a limpeza da etapa anterior o apagou).

**Limpeza:**

```bash
aws lambda delete-function --function-name <NOME-DA-FUNCAO>
# Azure (acréscimo): se criou a function app dentro do rg-lab, apague o grupo
az group delete --name rg-lab --yes --no-wait
# Antes de recriar o rg-lab na próxima etapa, espere a deleção terminar:
az group wait --deleted --name rg-lab
```

*Volta lançada! Gatilho por arquivo, carga alta e constante, e o que mais prende você ao provedor. Três perguntas, relógio rodando.*

**Exercícios**

1. Um cliente quer processar imagens enviadas a um repositório de arquivos, sem servidor ligado. Qual é o gatilho em cada provedor?
2. Uma API serverless recebe carga alta e constante, 24 horas por dia. Serverless é sempre a melhor escolha? Por quê?
3. Quais componentes do seu sistema serverless mais te prendem ao provedor?

**Gabarito**

1. S3 trigger com Lambda (AWS); Blob trigger ou evento de blob via Event Grid com Functions (Azure).
2. Não: em carga altíssima e constante, o modelo sob demanda pode ficar mais caro que infraestrutura tradicional (segundo o material).
3. Orquestração (Step Functions, Durable Functions, Logic Apps), autenticação gerenciada (Cognito, Entra) e filas e eventos proprietários.

**Anota aí:** serverless é pagar pela execução em vez da ociosidade; é excelente para carga variável e eventos, mas amarra você ao formato de evento de cada provedor.

**Checklist da Etapa 07**

- [ ] Sei explicar o que significa "serverless" e o que ainda existe por baixo.
- [ ] Sei o que é handler, gatilho e cold start.
- [ ] Sei os tipos de API (REST, HTTP e WebSocket) e como o Azure cobre cada caso.
- [ ] Sei desacoplar com fila e orquestrar com Step Functions, Logic Apps ou Durable Functions.
- [ ] Sei apontar riscos de lock-in.

*Setor 7 no verde! A mesma função escrita nos dois formulários e o lock-in identificado antes de virar dívida. Agora é hora de olhar para o muro: telemetria, mensagens do controle de corrida e rádio. Etapa 08, monitoramento e logs.*

---

## Etapa 08: Monitoramento e logs (CloudWatch x Azure Monitor)

*Oitavo setor, e quem manda aqui é o muro dos boxes! Métrica diz o que, evento diz quando, log diz por quê. Quem confunde as três passa a corrida olhando a tela errada.*

### O problema

Black Friday, o checkout começa a ficar lento. Sem alertas, a equipe só descobre quando os clientes reclamam e a conversão já caiu: dezenas ou centenas de milhares de reais perdidos. Do outro lado, uma VM subutilizada roda 24 horas e ninguém percebe o gasto. Monitorar é requisito, não diferencial.

### O conceito, de forma neutra

**Analogia:** o painel de um carro. Velocímetro e temperatura (métricas) mostram **o que** está acontecendo; luzes de alerta (eventos) mostram **quando** algo mudou; o relatório do mecânico (logs) explica **por que**.

**Leitura de cockpit:** no muro, isso vem de três fontes. A **telemetria** é a métrica: números contínuos (temperatura de freio, pressão de pneu, velocidade) que dizem **o que** está acontecendo. As **mensagens do controle de corrida** são os eventos: safety car na pista, bandeira amarela num setor, carro sob investigação; dizem **quando** algo mudou. O **rádio e o registro de eventos do carro** são os logs: o detalhe que explica **por quê**. Em Sepang, quem acompanhava de fora viu o evento (o carro do George Russell parado na reta durante o último safety car) e a consequência na tabela. O porquê está na telemetria e nos registros da equipe; eu não sei a causa, e nenhuma transmissão de TV sabe. É exatamente a distância entre evento e log.

- **Métricas:** números agregados ao longo do tempo (CPU, requisições por segundo, latência). Ideais para detectar padrões e comparar com limites.
- **Logs:** registros textuais detalhados (requisições, erros, exceções). Úteis para depuração, auditoria e análise forense.
- **Eventos:** mudanças de estado (instância encerrada, função com falha, recurso criado), tratadas por automações.
- **Alarmes/alertas:** regras sobre métricas ou logs com ação automática (notificação, script, escalonamento).
- **Dashboards:** painéis em tempo real, um por ambiente.
- **Consulta de logs:** linguagem própria para filtrar, extrair campos, agregar e gerar gráficos.
- **Rastreamento distribuído:** seguir uma requisição por vários serviços para achar gargalos.
- **Custo:** logs irrelevantes e retenção indefinida geram gasto. Defina retenção, filtre o que envia, use agregação e crie alarmes acionáveis.
- **Observabilidade:** capacidade de entender o estado interno do sistema a partir dos dados que ele emite.

**Leitura de cockpit:** o **alarme** é o engenheiro que só chama o piloto no rádio quando o número sai da janela e há algo a fazer: alerta que não pede ação é ruído no rádio. O **dashboard** são as telas do muro. O **rastreamento distribuído** são os minissetores de uma volta: em vez de saber só que a volta foi lenta, você sabe em que trecho o tempo se perdeu. E o **custo** dos logs é o de gravar tudo em altíssima frequência e guardar para sempre: alguém paga pelo disco.

### Equivalência AWS x Azure

| Conceito | AWS (conforme o material) | Azure (acréscimo) |
|---|---|---|
| Plataforma de monitoramento | CloudWatch | Azure Monitor |
| Métricas | CloudWatch Metrics | Azure Monitor Metrics |
| Armazenamento e consulta de logs | CloudWatch Logs (Log Groups e Log Streams) | Log Analytics workspace (tabelas) |
| Linguagem de consulta | Logs Insights | KQL (Kusto Query Language) |
| Alarmes | CloudWatch Alarms | Azure Monitor Alerts (com Action Groups para notificar) |
| Dashboards | CloudWatch Dashboards (widgets) | Azure Dashboards e Workbooks |
| Eventos e automação | EventBridge (antes CloudWatch Events) | Event Grid e Activity Log alerts |
| Agente na VM | CloudWatch Agent | Azure Monitor Agent |
| Métricas e logs de containers | Container Insights | Container insights |
| Rastreamento e APM | X-Ray | Application Insights |
| Métricas personalizadas | Custom metrics | Custom metrics e métricas baseadas em logs |
| Retenção | Configurável por log group (padrão indefinido) | Configurável no workspace |
| Auditoria de ações | CloudTrail | Activity Log |
| Detecção de anomalias com IA | DevOps Guru | Sem equivalente 1 para 1 que eu possa afirmar; confira os recursos de detecção de anomalias do Application Insights e do Azure Monitor |

**Leitura de cockpit:** cada circuito tem o seu sistema de telemetria: CloudWatch na AWS, Azure Monitor no Azure. Os dois coletam números, guardam registros, disparam alarmes e mostram telas; o que muda é como você faz perguntas aos dados gravados (Logs Insights ou KQL).

### Exemplo comentado: a mesma pergunta, duas linguagens

**Pergunta:** quais foram as últimas 20 requisições com erro 500 nas últimas duas horas?

**CloudWatch Logs Insights** (do material; o intervalo de tempo é escolhido na tela ou na chamada da consulta):

```
fields @timestamp, @message        # escolhe os campos a mostrar
| filter @message like /500/       # mantém só linhas que contêm "500"
| sort @timestamp desc             # mais recentes primeiro
| limit 20                         # só 20 linhas
```

**KQL no Log Analytics (acréscimo), usando os dados de requisições do Application Insights em um workspace:**

```
AppRequests                                   // tabela de requisições da aplicação
| where TimeGenerated > ago(2h)               // intervalo: duas horas
| where ResultCode == "500"                   // código de resposta igual a 500
| project TimeGenerated, Name, Url            // escolhe as colunas
| order by TimeGenerated desc                 // mais recentes primeiro
| take 20                                     // só 20 linhas
```

Repare no padrão em comum: os dois usam **pipe** (`|`) para encadear passos, mas o KQL trabalha sobre **tabelas com colunas tipadas**, enquanto o Logs Insights trabalha sobre **log groups** com campos como `@message`. Se o texto que você quer achar não for uma coluna, o KQL também filtra texto livre:

```
AppTraces
| where Message contains "timeout"
| summarize ocorrencias = count() by bin(TimeGenerated, 5m)   // conta por janela de 5 minutos
```

**Leitura de cockpit:** as duas linguagens trabalham como o engenheiro de dados depois da sessão: pega a gravação inteira, filtra o trecho que interessa, separa os canais, agrega e ordena. O pipe (`|`) é passar o resultado de uma ferramenta para a seguinte.

E o mesmo no Logs Insights, que o material usa para criar métricas a partir de padrões como "timeout":

```
filter @message like /timeout/
| stats count(*) as ocorrencias by bin(5m)
```

**Alarme de CPU acima de 80%**, comandos de criação (substitua os marcadores; só crie se tiver o recurso e um destino de notificação):

```bash
# AWS: alarme na CPU de uma instância, média de 5 minutos, acima de 80
aws cloudwatch put-metric-alarm --alarm-name cpu-alta \
  --namespace AWS/EC2 --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=<ID-DA-INSTANCIA> \
  --statistic Average --period 300 --evaluation-periods 1 \
  --threshold 80 --comparison-operator GreaterThanThreshold \
  --alarm-actions <ARN-DO-TOPICO-SNS>

# Azure (acréscimo): alerta de métrica equivalente; o Action Group define quem é notificado.
# Garante o grupo; a VM monitorada precisa existir (recrie-a com o bloco da Etapa 04).
az group create --name rg-lab --location brazilsouth
az monitor metrics alert create --name cpu-alta --resource-group rg-lab \
  --scopes <ID-DA-VM> \
  --condition "avg Percentage CPU > 80" \
  --window-size 5m --evaluation-frequency 1m \
  --action <ID-DO-ACTION-GROUP>
```

**Leitura de cockpit:** 80% de CPU na média de 5 minutos é o limite da janela operacional; avaliar por período é não chamar o piloto por causa de um pico numa volta só. No Azure, a lista de quem é chamado (o **Action Group**) fica separada da regra: o mesmo grupo de contatos atende vários alarmes.

*Atenção nesta curva! O "cadê meus logs" do Azure derruba muita gente boa: sensor instalado, canal desligado. Confira duas vezes antes de seguir.*

### Onde eles diferem de verdade

- **Coleta de logs: o que é automático.** Na AWS, serviços como o Lambda enviam logs ao CloudWatch automaticamente. No Azure, os logs de recursos precisam, em geral, de **configurações de diagnóstico** (diagnostic settings) que dizem para onde enviá-los (workspace, storage account ou Event Hubs). Esquecer isso é a causa clássica de "cadê meus logs".
- **Um workspace, muitas tabelas.** O Log Analytics reúne logs de vários serviços em um workspace, em tabelas, e você consulta tudo com KQL e pode correlacionar. No CloudWatch, a unidade é o log group, e as consultas se fazem sobre um ou mais grupos.
- **Application Insights.** É a parte do Azure Monitor voltada para o desempenho de aplicações (requisições, dependências, exceções, rastreamento distribuído), e seu papel se aproxima do X-Ray combinado com métricas de aplicação.
- **Alarme x alerta + action group.** No Azure, a regra do alerta é separada de *quem avisar*: o Action Group agrupa e-mail, SMS, webhook, função etc., e é reutilizado por vários alertas.
- **"SQL-like".** O material descreve o Logs Insights como semelhante ao SQL; na prática, ambos são linguagens por **pipeline**, mais próximas de um `grep | sort | head` do que de `SELECT`.
- **Custo.** Nos dois, volume ingerido e retenção dominam a conta. As regras de preço e de retenção padrão diferem; confira antes de ligar tudo.

**Aqui a analogia para:** no Azure, muitos recursos só mandam logs para o workspace depois que você liga as **configurações de diagnóstico**. É como um sensor instalado no carro com o canal desligado na transmissão: o dado existe no carro, mas não chega ao muro. Na F1 isso seria erro de montagem; na nuvem é o comportamento padrão de vários recursos, e é a causa clássica do "cadê meus logs".

### Mão na massa

*Telemetria na tela! Um pipeline de logs feito só com o terminal, que filtra, conta e ordena do jeito que o Logs Insights e o KQL fazem. Depois leitura na nuvem e, se você já tem algo para monitorar, um alarme de verdade.*

**Parte 1: pipeline de logs na sua máquina (sem nuvem).** Simule o `filter | stats | sort | limit` com ferramentas de terminal:

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
# Saída esperada:
#       2 /checkout
#       1 /pedido
```

Esse é o raciocínio do Logs Insights e do KQL: filtrar, extrair um campo, agregar e ordenar.

**Leitura de cockpit:** o `grep | awk | sort | uniq -c` é o engenheiro contando, no registro da sessão, em quais curvas o carro travou a roda: filtra os eventos, extrai a curva, conta e põe a pior no topo.

**Parte 2: leitura na nuvem.**

```bash
aws cloudwatch list-metrics --namespace AWS/EC2 --max-items 5
aws logs describe-log-groups --query "logGroups[].{nome:logGroupName,retencaoDias:retentionInDays}" --output table
# retencaoDias vazio significa retenção indefinida (padrão)
# Azure (acréscimo)
az monitor log-analytics workspace list --output table
```

**Parte 3: criar um alerta (opcional).** Só se já tiver um recurso para monitorar (a VM ou instância da Etapa 04) e um destino de notificação. Use os comandos de alarme acima e, depois de criado, observe que ele aparece como "OK" ou "Insufficient data" até receber pontos.

**Limpeza:**

```bash
aws cloudwatch delete-alarms --alarm-names cpu-alta
# Azure (acréscimo)
az monitor metrics alert delete --name cpu-alta --resource-group rg-lab
az group delete --name rg-lab --yes --no-wait
# Antes de recriar o rg-lab na próxima etapa, espere a deleção terminar:
az group wait --deleted --name rg-lab
```

*Volta lançada! Métrica, evento e log num checkout lento, uma tradução para KQL e o primeiro item a conferir quando o log não chega.*

**Exercícios**

1. Como o material diferencia métrica, evento e log? Dê um exemplo de cada para um checkout lento.
2. Traduza para KQL: "contar quantas vezes aparece 'timeout' por janela de 5 minutos".
3. Você ligou um serviço no Azure e não vê logs no workspace. Qual é o primeiro item a conferir?

**Gabarito**

1. Métrica: latência média do checkout (o quê). Evento: instância reiniciada às 14h02 (quando). Log: stack trace do erro de timeout no banco (por quê).
2. `AppTraces | where Message contains "timeout" | summarize count() by bin(TimeGenerated, 5m)`.
3. As configurações de diagnóstico (diagnostic settings) do recurso, apontando para o workspace.

**Anota aí:** métrica diz o que, evento diz quando, log diz por quê; defina retenção, alerte só o que é acionável e saiba consultar logs em pipeline (Logs Insights ou KQL).

**Checklist da Etapa 08**

- [ ] Sei distinguir logs, métricas e eventos.
- [ ] Sei escrever a mesma consulta em Logs Insights e em KQL.
- [ ] Sei o que são diagnostic settings e action groups.
- [ ] Sei por que definir retenção de logs.
- [ ] Sei o que o X-Ray e o Application Insights respondem.

*Setor 8 no verde! Você sabe o que cada fonte responde e consulta a gravação nos dois idiomas. Em Abu Dhabi, em 2010, a Ferrari decidiu a parada do Fernando Alonso olhando o rival errado e perdeu o título, e é essa a lição da Etapa 08: o alarme bom dispara pela métrica que decide o resultado, não pelo primeiro sinal que aparece na tela. Agora o pedido do usuário precisa chegar rápido. Etapa 09, entrega de conteúdo, balanceamento e objetos.*

---

## Etapa 09: Entrega de conteúdo, balanceamento e objetos (CloudFront, Load Balancer e S3 x Front Door, Application Gateway e Blob Storage)

*Nono setor! Almoxarifado central, postos avançados perto de quem pede e o controle de entrada do pit lane escolhendo o box saudável. É o caminho que um pedido faz até o carro, e cada trecho tem um nome diferente em cada circuito.*

### O problema

Um usuário em Fortaleza acessa um site hospedado do outro lado do mundo: cada imagem e cada script atravessa oceanos. Numa campanha, mil usuários chegam ao mesmo tempo e o único servidor satura. E as imagens, onde guardar de forma barata e durável? Três problemas, três soluções que trabalham juntas: **CDN**, **balanceador de carga** e **armazenamento de objetos**.

### O conceito, de forma neutra

**Analogia:** uma rede de lojas. A CDN são filiais perto do cliente com cópias dos produtos mais pedidos; o balanceador é o atendente da recepção que direciona cada cliente ao caixa livre; o armazenamento de objetos é o grande estoque central, barato e organizado.

**Leitura de cockpit:** no nosso mapa, o **armazenamento de objetos** é o **almoxarifado central**: barato, organizado, cada item com etiqueta única. A **CDN** são os **postos avançados de peças** espalhados pelo mundo, perto de quem pede, com cópias do que mais sai, para ninguém esperar a peça atravessar oceanos. O **balanceador** é o **controle de entrada do pit lane**, que direciona cada carro a um box livre e fecha o box com problema (o **health check**). Camada 4 é direcionar só pelo número do carro; camada 7 é ler o pedido (troca de pneus, troca de asa) e mandar para o box preparado para aquele serviço. **Aqui a analogia para:** no pit lane real, cada carro para no box da própria equipe; a imagem vale para o papel do balanceador, não para a regra da pista.

- **CDN (Content Delivery Network):** rede global de servidores de borda que guardam em cache conteúdo estático (imagens, vídeos, CSS, JavaScript, HTML) e o entregam do ponto mais próximo do usuário. Benefícios: **desempenho** (menos latência), **disponibilidade** (redireciona se um ponto falha), **escalabilidade** (absorve picos) e **segurança** (primeira linha contra DDoS e requisições maliciosas). Controle de **TTL**, compressão e acesso restrito a conteúdo autorizado.
- **Balanceador de carga:** distribui requisições entre várias origens, com **health checks** que removem as que falharam. Camada 4 (TCP e UDP, transporte) e camada 7 (HTTP e HTTPS, decide por URL, cabeçalhos, cookies). Pode ser feito à mão com Nginx ou HAProxy, mas exige manutenção.
- **Armazenamento de objetos:** dados em **contêineres lógicos** (buckets), cada objeto com dados, metadados e chave única, acessado por API REST. Durabilidade muito alta, escala praticamente ilimitada, origem ideal para sites estáticos e para a CDN.
- **Classes de armazenamento:** dados frequentes em camada quente; backups e registros antigos migrados para camadas mais baratas conforme a frequência de acesso.
- **Boas práticas:** nomes de chave estruturados, evitar acesso público desnecessário, preferir URLs assinadas, versionamento contra exclusão acidental, criptografia em repouso e em trânsito.

**Leitura de cockpit:** as **classes de armazenamento** são a prateleira e o arquivo. Peça da temporada fica na prateleira, à mão (camada quente); carro de três anos atrás vai para o arquivo histórico, barato de guardar e demorado de buscar (camadas frias). A **URL assinada** é o **passe de convidado de um dia**: abre uma porta específica e expira sozinho. O **versionamento** é guardar a revisão anterior da peça, para o caso de alguém jogar fora a atual por engano.

### Equivalência AWS x Azure

| Conceito | AWS (conforme o material) | Azure (acréscimo) |
|---|---|---|
| CDN | CloudFront | Azure Front Door (e Azure CDN; confira na documentação qual é o recomendado) |
| Balanceador de camada 7 | Application Load Balancer (ALB) | Application Gateway |
| Balanceador de camada 4 | Network Load Balancer (NLB) | Azure Load Balancer |
| Balanceador para appliances de terceiros | Gateway Load Balancer (GWLB) | Azure Gateway Load Balancer |
| Balanceamento global por DNS | Route 53 (Etapa 10) | Traffic Manager (Etapa 10) |
| Armazenamento de objetos | S3 (buckets e objetos) | Blob Storage (containers e blobs, dentro de uma storage account) |
| Classes de armazenamento | S3 Standard, Infrequent Access, Glacier | Camadas Hot, Cool, Cold e Archive |
| Acesso temporário a um objeto | URL assinada (presigned URL) | SAS (Shared Access Signature) |
| Versionamento | Versionamento do S3 | Versionamento de blobs e soft delete |
| Regras de ciclo de vida | Lifecycle rules | Lifecycle management policies |
| Site estático | S3 como site estático | Static website em storage account |
| Criptografia com chave própria | SSE-S3 e SSE-KMS | Criptografia do Storage (chaves gerenciadas pela Microsoft ou do cliente no Key Vault) |
| Proteção contra DDoS e WAF | AWS Shield e AWS WAF | Azure DDoS Protection e Azure WAF |
| Código na borda | Lambda@Edge e CloudFront Functions | Regras e recursos de roteamento do Front Door (confira o equivalente atual) |
| Autoescalonamento com balanceador | Auto Scaling + ELB | VM Scale Sets + Load Balancer ou Application Gateway |

**Leitura de cockpit:** os dois circuitos têm almoxarifado (S3, Blob Storage), postos avançados (CloudFront, Front Door), entrada do pit lane em camada 7 (ALB, Application Gateway) e em camada 4 (NLB, Azure Load Balancer). O passe de convidado se chama URL assinada na AWS e SAS no Azure.

### Exemplo comentado: o site estático, do armazenamento à entrega

**AWS: bucket e upload**

```bash
# Cria um bucket (o nome é único no mundo todo, em toda a AWS)
aws s3 mb s3://<NOME-UNICO-DO-BUCKET> --region sa-east-1
# Envia um arquivo
echo "<h1>Olá, nuvem</h1>" > index.html
aws s3 cp index.html s3://<NOME-UNICO-DO-BUCKET>/index.html
# Lista o conteúdo; esperado: uma linha com index.html e seu tamanho
aws s3 ls s3://<NOME-UNICO-DO-BUCKET>/
# Gera uma URL assinada que expira em 300 segundos (a forma segura de compartilhar)
aws s3 presign s3://<NOME-UNICO-DO-BUCKET>/index.html --expires-in 300
```

**Azure (acréscimo): storage account, container e upload**

```bash
# Recria o grupo (a limpeza da etapa anterior o apagou)
az group create --name rg-lab --location brazilsouth
# A storage account é o nível com nome globalmente único (3 a 24 letras minúsculas e números)
az storage account create --name st<NOME-UNICO> --resource-group rg-lab \
  --location brazilsouth --sku Standard_LRS --kind StorageV2 \
  --allow-blob-public-access false          # sem acesso público anônimo

# Para operar dados com sua identidade (--auth-mode login), você precisa de uma role de DADOS,
# mesmo sendo dono da assinatura:
az role assignment create --assignee <SEU-E-MAIL> --role "Storage Blob Data Contributor" \
  --scope $(az storage account show -n st<NOME-UNICO> -g rg-lab --query id -o tsv)
# As permissões novas podem levar alguns minutos para valer: se o próximo comando
# falhar com AuthorizationPermissionMismatch, espere um pouco e repita.

az storage container create --account-name st<NOME-UNICO> --name site --auth-mode login
az storage blob upload --account-name st<NOME-UNICO> --container-name site \
  --name index.html --file index.html --auth-mode login
az storage blob list --account-name st<NOME-UNICO> --container-name site --auth-mode login -o table
# O equivalente da URL assinada é um SAS de delegação de usuário.
# Validade: daqui a 1 dia, em UTC (o SAS de delegação de usuário vale no máximo 7 dias).
# No macOS, troque o $(date ...) por: $(date -u -v+1d '+%Y-%m-%dT%H:%MZ')
az storage blob generate-sas --account-name st<NOME-UNICO> --container-name site \
  --name index.html --permissions r --expiry $(date -u -d '+1 day' '+%Y-%m-%dT%H:%MZ') \
  --auth-mode login --as-user --full-uri
```

**Balanceamento e CDN, na prática do desenho.**

```
Usuário
   |
   v
CloudFront ........................ Front Door
   |  (estáticos: S3)                  |  (estáticos: Blob Storage)
   |  (dinâmico: ALB)                  |  (dinâmico: Application Gateway)
   v                                   v
ALB (camada 7) -> EC2 / ECS      Application Gateway -> VMs / AKS
```

**Leitura de cockpit:** o desenho é o caminho de um pedido até o carro. O usuário chega ao posto avançado mais próximo; se é peça de catálogo (estático), o posto entrega a própria cópia ou busca no almoxarifado; se é trabalho sob medida (dinâmico), o posto encaminha para a entrada do pit lane, que escolhe um box saudável. **Hipotético:** o vídeo do pódio de Sepang (Verstappen, Antonelli e Hamilton) pedido por um torcedor em Fortaleza sai do posto avançado mais próximo, não do almoxarifado do outro lado do mundo.

### Onde eles diferem de verdade

- **Namespace.** O nome de um bucket S3 é único em toda a AWS e identifica o bucket diretamente. No Azure, o nome globalmente único é o da **storage account**; dentro dela, os contêineres têm nomes únicos apenas naquela conta. A storage account também hospeda outros serviços (Files, Queues, Tables), enquanto o bucket S3 é só objetos.
- **Permissão de dados.** No Azure, o papel de dono (Owner) gerencia a conta mas não necessariamente lê os blobs por Entra ID: é preciso uma role de dados, como Storage Blob Data Contributor (Etapa 02, plano de controle x plano de dados).
- **Acesso público.** O material alerta contra buckets públicos desnecessários. No Azure, o acesso público anônimo é uma configuração da conta e do contêiner; confira o padrão atual para contas novas e desative-o quando não for necessário.
- **Origem protegida.** "Só a CDN acessa o armazenamento" é feito na AWS com controle de acesso de origem do CloudFront. No Azure, depende do tipo de origem: o Front Door (camadas premium) pode usar Private Link para origens, e origens públicas podem ser restritas por cabeçalho identificador do Front Door ou por regras de rede. Confira a documentação do cenário.
- **Application Gateway x ALB.** O Application Gateway vive dentro de uma VNet, em uma sub-rede dedicada, e integra WAF. O Front Door é um serviço global na borda. O ALB é regional e a CloudFront é a camada global. Os papéis são parecidos, mas a combinação de produtos é diferente.
- **Camadas de armazenamento.** As classes S3 (Standard, IA, Glacier) e as camadas do Blob (Hot, Cool, Cold, Archive) servem à mesma ideia (dado mais frio, mais barato guardar e mais caro ou lento acessar), mas com regras, prazos mínimos de permanência e custos próprios. Não presuma equivalência de preços.

**Aqui a analogia para:** no S3, a etiqueta única no mundo inteiro é o nome do bucket. No Azure, o nome único é o da storage account (o prédio do almoxarifado), e os containers dentro dela só precisam de nome único naquele prédio. Um almoxarifado real não precisa de nome único no planeta; na nuvem precisa, porque o nome vira endereço público.

### Mão na massa

*Bancada ligada, sem nuvem! Você serve uma pasta, lê os cabeçalhos e vê o `304` acontecer: o posto avançado perguntando se a revisão ainda é a atual. A criação na nuvem custa centavos, se apagar no mesmo dia.*

**Parte 1: o que a CDN usa para decidir, sem nuvem.** Sirva uma pasta e observe os cabeçalhos e a validação de cache:

```bash
mkdir -p site && echo "<h1>Olá</h1>" > site/index.html
python3 -m http.server --directory site 8000 &   # servidor de arquivos local, servindo a pasta site
sleep 1
curl -sI localhost:8000/index.html
# Saída esperada (valores variam): HTTP/1.0 200 OK, Content-type: text/html,
# Content-Length e Last-Modified. Note que NÃO há Cache-Control: por isso é você
# quem configura o TTL na CDN.

# Reenvia o pedido dizendo "só me mande se mudou desde Last-Modified"
LM=$(curl -sI localhost:8000/index.html | grep -i '^Last-Modified' | cut -d' ' -f2- | tr -d '\r')
curl -sI -H "If-Modified-Since: $LM" localhost:8000/index.html | head -1
# Saída esperada: HTTP/1.0 304 Not Modified
```

O `304` é o mecanismo de validação que permite reaproveitar uma cópia em cache.

**Leitura de cockpit:** o `304 Not Modified` é o posto avançado ligando para o almoxarifado e ouvindo "sua revisão ainda é a atual, use a que você tem". Nada viaja de novo. O **TTL** é por quanto tempo o posto confia na própria cópia sem ligar.

**Parte 2: leitura na nuvem.**

```bash
aws s3 ls
aws elbv2 describe-load-balancers --query "LoadBalancers[].{nome:LoadBalancerName,tipo:Type}" --output table
# Azure (acréscimo)
az storage account list --output table
az network application-gateway list --output table
az network lb list --output table
```

**Parte 3: criação opcional (centavos, se apagar no mesmo dia).** Rode o bloco "AWS: bucket e upload" e o bloco "Azure (acréscimo): storage account", envie o `index.html`, liste e gere o link temporário. Abra o link e confirme que ele expira.

**Limpeza:**

```bash
# Local: encerra o servidor (job %1 deste terminal) e apaga a pasta e o arquivo do lab
kill %1 2>/dev/null; rm -rf site index.html
# Se fechou o terminal, encerre o servidor pelo comando: pkill -f "http.server --directory site"
aws s3 rm s3://<NOME-UNICO-DO-BUCKET> --recursive    # esvazia o bucket
aws s3 rb s3://<NOME-UNICO-DO-BUCKET>                # apaga o bucket
# Azure (acréscimo): apaga storage account e tudo no grupo
az group delete --name rg-lab --yes --no-wait
# Antes de recriar o rg-lab na próxima etapa, espere a deleção terminar:
az group wait --deleted --name rg-lab
```

*Pit stop cronometrado! Desenhar a entrega de um site de notícias, escolher a camada do roteamento por URL e mandar backup antigo para o arquivo histórico.*

**Exercícios**

1. Um site de notícias tem imagens estáticas e uma API dinâmica. Desenhe a entrega nos dois provedores.
2. Você precisa de roteamento por URL (`/api` para um grupo, `/img` para outro). Camada 4 ou 7? Que produtos?
3. Backups com mais de um ano raramente são lidos. Que tipo de camada usar?

**Gabarito**

1. Estáticos: S3 ou Blob na origem, CloudFront ou Front Door na frente. Dinâmico: ALB ou Application Gateway distribuindo entre instâncias, containers ou funções.
2. Camada 7: ALB (AWS) e Application Gateway (Azure).
3. Camadas frias: S3 IA/Glacier (AWS) e Cool, Cold ou Archive (Azure), observando custos e tempos de acesso.

**Anota aí:** a CDN aproxima, o balanceador distribui, o armazenamento de objetos guarda barato; no Azure, o nome único mora na storage account, não no container.

**Checklist da Etapa 09**

- [ ] Sei explicar o que uma CDN faz e seus quatro benefícios.
- [ ] Sei a diferença entre balanceador de camada 4 e de camada 7.
- [ ] Sei mapear S3 para storage account, container e blob.
- [ ] Sei o que é URL assinada (AWS) e SAS (Azure).
- [ ] Sei evitar acesso público desnecessário.

*Setor 9 no verde! Almoxarifado, postos avançados e entrada do pit lane, nos dois circuitos. Falta trancar a operação: cofre, revista, superlicença e lista de inscritos. Etapa 10, a reta da segurança.*

---

## Etapa 10: Segredos, WAF, certificados e DNS (Secrets Manager, WAF, ACM e Route 53 x Key Vault, Azure WAF, certificados e Azure DNS)

*Décimo setor, o penúltimo! Quatro camadas de proteção num trecho só: o cofre de combinações, o fiscal que revista o pedido, a superlicença que vence e a lista de inscritos que liga nome a número. Aqui um descuido de sexta à noite custa o fim de semana inteiro.*

### O problema

Um desenvolvedor commita a senha do banco no repositório. Dias depois, bots varrem a internet atrás de credenciais vazadas. Em paralelo, a API pública sofre injeção de SQL, e o certificado HTTPS vence numa sexta à noite, derrubando o site com aviso de "não seguro". E o usuário digita `www.meuapp.com`, mas o sistema precisa saber para qual IP enviá-lo, e para onde enviá-lo se um datacenter cair. Quatro camadas de proteção e disponibilidade além do controle de acesso.

### O conceito, de forma neutra

**Analogia:** um cofre para chaves (segredos), um segurança que revista quem entra (WAF), a carteira de identidade do prédio (certificado) e a lista telefônica (DNS).

**Leitura de cockpit:** no paddock, as quatro camadas são estas. O **cofre de combinações** (os segredos) só entrega a combinação na hora para quem tem passe autorizado, registra quem pediu e troca a combinação de tempos em tempos (a rotação). O **fiscal que revista** (o **WAF**) não se contenta em ler o passe, como os fiscais de porta da Etapa 03: ele abre a bolsa e olha o conteúdo do pedido HTTP. A **superlicença** (o **certificado**) é emitida por uma autoridade reconhecida, prova quem você é e **vence**, precisando ser renovada. E a **lista de inscritos** (o **DNS**) liga o nome a um número: o nome do piloto ao carro, o `www.meuapp.com` ao IP.

- **Gerenciamento de segredos:** um cofre digital para senhas de banco, tokens e chaves, com acesso controlado, auditoria, criptografia, **versionamento** e **rotação automática**. Evita credenciais em código, arquivos de configuração e repositórios.
- **Chaves de criptografia:** serviço que cria e controla chaves usadas para criptografar dados em repouso. Nos dois provedores, serviços de segredos e de armazenamento se integram a ele.
- **WAF (Web Application Firewall):** firewall de camada 7 que analisa o tráfego HTTP e HTTPS: padrões de SQL injection, scripts, exploração de vulnerabilidades, limite de taxa, bloqueio por país, por cabeçalho ou reputação de IP.
- **Certificados digitais (TLS):** garantem confidencialidade, integridade e autenticidade no HTTPS. A gestão manual (emitir, renovar, instalar, monitorar validade) é trabalhosa e arriscada. Automatize a **emissão, validação (por DNS ou e-mail) e renovação**. Certificados curinga (wildcard) cobrem subdomínios. Certificados privados servem a comunicação interna.
- **DNS:** traduz nomes em endereços IP numa estrutura hierárquica e distribuída. **TTL** define por quanto tempo uma resposta fica em cache. Zonas **públicas** e **privadas** (só dentro da rede). Políticas de roteamento: simples, por latência, geográfico, failover e ponderado.

**Leitura de cockpit:** o **TTL** do DNS é por quanto tempo uma cópia impressa da lista de inscritos vale antes de ser conferida de novo. TTL longo economiza consultas e atrasa mudanças; TTL curto faz a mudança aparecer rápido e gera mais consultas. As políticas de roteamento escolhem para qual endereço mandar cada um: o mais próximo (latência), o do país (geográfico), o de reserva quando o principal cai (failover) ou uma divisão por peso (ponderado).

### Equivalência AWS x Azure

| Conceito | AWS (conforme o material) | Azure (acréscimo) |
|---|---|---|
| Cofre de segredos | Secrets Manager | Key Vault (secrets) |
| Rotação automática | Secrets Manager (nativa para RDS, Redshift e Lambda) | Rotação com apoio de eventos do Key Vault e automação (por exemplo, Event Grid e Functions); confira os recursos atuais |
| Chaves de criptografia | KMS | Key Vault (keys) e Managed HSM |
| WAF | AWS WAF (ALB, CloudFront, API Gateway) | Azure WAF (Application Gateway e Front Door) |
| Certificados gerenciados | ACM (certificados públicos gratuitos) | Certificados gerenciados do App Service e do Front Door; certificados no Key Vault |
| Autoridade certificadora privada | ACM Private CA | Sem equivalente de mesmo nome que eu possa afirmar; confira a documentação para PKI privada no Azure |
| DNS gerenciado | Route 53 (zonas públicas e privadas) | Azure DNS (zonas públicas) e Azure Private DNS (zonas privadas) |
| Roteamento inteligente de tráfego | Políticas do Route 53 (latência, geográfico, failover, ponderado) | Traffic Manager (Performance, Geographic, Priority, Weighted) |
| Registro de domínios | Route 53 como registrador | Azure DNS não registra domínios; use App Service Domains ou outro registrador |
| Proteção DDoS | Shield | Azure DDoS Protection |
| Firewall de rede | Network Firewall | Azure Firewall |

Mapa das políticas de roteamento do material:

| Política (material) | Route 53 | Traffic Manager (acréscimo) |
|---|---|---|
| Simples | Simple | (registro DNS direto no Azure DNS) |
| Baseado em latência | Latency | Performance |
| Geográfico | Geolocation | Geographic |
| Failover | Failover | Priority |
| Ponderado | Weighted | Weighted |

**Leitura de cockpit:** o procedimento é o mesmo nos dois circuitos, com uma diferença de planta que importa: o Azure guarda combinações, chaves de criptografia e certificados no mesmo cofre (o Key Vault), enquanto a AWS os separa em três balcões (Secrets Manager, KMS e ACM).

### Exemplo comentado: guardar e ler um segredo

```bash
# AWS: cria um segredo e o lê de volta
aws secretsmanager create-secret --name lab/senha-banco --secret-string 'S3nh@Forte'
aws secretsmanager get-secret-value --secret-id lab/senha-banco --query SecretString --output text
# Saída esperada: S3nh@Forte

# Azure (acréscimo): recria o grupo, cria o cofre (nome globalmente único), guarda o segredo e o lê
az group create --name rg-lab --location brazilsouth
az keyvault create --name kv-<NOME-UNICO> --resource-group rg-lab --location brazilsouth \
  --enable-rbac-authorization true     # permissões por Azure RBAC (modelo recomendado pela Microsoft)
# Seu usuário precisa de uma role de dados no cofre para gravar e ler segredos
az role assignment create --assignee <SEU-E-MAIL> --role "Key Vault Secrets Officer" \
  --scope $(az keyvault show -n kv-<NOME-UNICO> --query id -o tsv)
az keyvault secret set --vault-name kv-<NOME-UNICO> --name senha-banco --value 'S3nh@Forte'
az keyvault secret show --vault-name kv-<NOME-UNICO> --name senha-banco --query value -o tsv
# Saída esperada: S3nh@Forte
```

(As permissões novas podem levar alguns minutos para valer.)

**Leitura de cockpit:** repare que, no Azure, nem o dono do contrato abre o cofre sem uma role de dados (`Key Vault Secrets Officer`). É a separação entre gerenciar o recurso e ler o que está dentro dele, da Etapa 02, de novo: ser dono do prédio não dá a combinação do cofre.

**Uma regra de DNS na zona pública**, nos dois mundos (zonas hospedadas têm custo mensal, então use a prática com cuidado):

```bash
# AWS: cria a zona e guarda o ID dela (formato /hostedzone/Z...)
ZONA_ID=$(aws route53 create-hosted-zone --name exemplo-lab.example \
  --caller-reference lab-$(date +%s) --query HostedZone.Id --output text)
# Arquivo de mudança: registro A "www" com TTL de 300 segundos (UPSERT cria ou atualiza)
cat > registro.json <<'EOF'
{"Changes":[{"Action":"UPSERT","ResourceRecordSet":{"Name":"www.exemplo-lab.example","Type":"A","TTL":300,"ResourceRecords":[{"Value":"203.0.113.10"}]}}]}
EOF
aws route53 change-resource-record-sets --hosted-zone-id "$ZONA_ID" --change-batch file://registro.json
aws route53 list-resource-record-sets --hosted-zone-id "$ZONA_ID" \
  --query "ResourceRecordSets[].{nome:Name,tipo:Type,ttl:TTL}" --output table

# Azure (acréscimo): garante o grupo, cria a zona e um registro A "www"
az group create --name rg-lab --location brazilsouth
az network dns zone create --resource-group rg-lab --name exemplo-lab.example
az network dns record-set a add-record --resource-group rg-lab --zone-name exemplo-lab.example \
  --record-set-name www --ipv4-address 203.0.113.10
az network dns record-set a list --resource-group rg-lab --zone-name exemplo-lab.example -o table
```

(`203.0.113.10` e o domínio `.example` são endereços e nomes reservados para documentação: nada resolve de verdade, o que é ótimo para treinar sem risco. Se a CLI recusar o nome reservado, use um subdomínio de um domínio que seja seu, por exemplo `lab.seudominio.com.br`.)

**Leitura de cockpit:** o registro A `www` apontando para `203.0.113.10` é uma linha da lista de inscritos: o nome à esquerda, o número à direita. Endereços e nomes reservados para documentação são uma lista fictícia de treino: dá para errar à vontade, porque nenhum carro de verdade usa aqueles números.

### Onde eles diferem de verdade

- **Segredos, chaves e certificados num só cofre.** O Key Vault guarda segredos, chaves e certificados no mesmo serviço. Na AWS, são serviços separados: Secrets Manager, KMS e ACM. Em compensação, o Key Vault tem seu próprio modelo de autorização (RBAC de dados ou access policies), outra razão para entender o plano de controle x dados da Etapa 02.
- **Rotação.** O Secrets Manager traz rotação automática integrada a alguns serviços. No Azure, a rotação de segredos costuma ser montada com eventos e automação; para evitar o problema na origem, prefira **Managed Identity** (Etapa 02), que dispensa a senha.
- **Certificados.** O ACM emite certificados gratuitos para os serviços AWS integrados (ALB, CloudFront, API Gateway) e renova sozinho. No Azure, a gestão varia por serviço: certificados gerenciados em App Service e Front Door, e certificados do Key Vault para outros cenários, inclusive com autoridades parceiras. Valide as condições do seu caso.
- **WAF.** O AWS WAF se anexa a ALB, CloudFront e API Gateway. O Azure WAF se anexa ao Application Gateway e ao Front Door, com conjuntos de regras gerenciadas e regras personalizadas. Em ambos, comece em modo de detecção antes de bloquear, para evitar falsos positivos.
- **DNS e registro de domínio.** O Route 53 é DNS e também registrador. O Azure DNS hospeda zonas, mas a compra do domínio é outro produto. O roteamento inteligente de tráfego fica no **Traffic Manager** (por DNS) no Azure, enquanto no Route 53 é uma propriedade dos próprios registros. Para balanceamento global na camada HTTP no Azure, veja também o Front Door (Etapa 09).

**Aqui a analogia para:** uma combinação de cadeado roubada é uma só, e trocar o cadeado resolve. Um segredo vazado pode ter sido copiado sem limite: precisa ser revogado e trocado, e a origem do vazamento precisa ser fechada. A melhor saída, quando o circuito permite, é nem ter combinação: o passe preso ao equipamento (IAM Role, Managed Identity) dispensa a senha. E sobre o certificado: a superlicença é uma por piloto, emitida por uma única autoridade; certificados TLS são emitidos por várias autoridades certificadoras, e um domínio pode ter mais de um válido ao mesmo tempo.

### Mão na massa

*Pit lane aberto! DNS e certificados lidos direto do terminal, sem conta de nuvem. Depois o segredo guardado e lido de volta nos dois cofres, com um passo a mais na limpeza do Azure por causa do soft delete.*

**Parte 1: DNS e certificados na sua máquina (sem nuvem).**

```bash
dig +noall +answer example.com A
# Saída esperada (valores variam): nome, TTL em segundos, tipo A e o IP
# O número entre o nome e "IN" é o TTL: por quanto tempo o resultado pode ficar em cache.

dig +short example.com NS
# Saída esperada: os servidores de nomes autoritativos do domínio

openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
# Saída esperada: subject, issuer (quem emitiu) e notBefore/notAfter (validade)
```

Observe a validade (`notAfter`): é exatamente o prazo que um serviço de certificados gerenciados deve renovar por você.

**Leitura de cockpit:** o `notAfter` é a data de vencimento da superlicença do site. Certificado vencido numa sexta à noite é como documento vencido na porta do circuito: o carro está pronto e não entra na pista. A renovação automática tira esse risco da mão humana.

**Parte 2: leitura na nuvem.**

```bash
aws secretsmanager list-secrets --query "SecretList[].Name" --output text
aws acm list-certificates --query "CertificateSummaryList[].DomainName" --output text
aws route53 list-hosted-zones --query "HostedZones[].Name" --output text
aws wafv2 list-web-acls --scope REGIONAL --query "WebACLs[].Name" --output text
# Azure (acréscimo)
az keyvault list --output table
az network dns zone list --output table
az network application-gateway waf-policy list --output table
```

**Parte 3: criação opcional.** Crie o segredo e leia-o de volta, nos dois provedores (o custo é muito baixo). O Key Vault tem *soft delete* ativo por padrão: o nome do cofre apagado continua reservado até ser eliminado de vez, por isso a limpeza tem um passo a mais.

**Limpeza:**

```bash
# AWS: apaga o segredo sem período de espera (somente para laboratório)
aws secretsmanager delete-secret --secret-id lab/senha-banco --force-delete-without-recovery
# Se criou a zona hospedada, apague (ela cobra por mês). Registros diferentes dos padrões
# (NS e SOA) precisam sair antes: o DELETE repete exatamente os valores do registro criado.
sed 's/"UPSERT"/"DELETE"/' registro.json > remover.json
aws route53 change-resource-record-sets --hosted-zone-id "$ZONA_ID" --change-batch file://remover.json
aws route53 delete-hosted-zone --id "$ZONA_ID"
rm -f registro.json remover.json
# (se fechou o terminal, troque "$ZONA_ID" pelo ID mostrado em: aws route53 list-hosted-zones)

# Azure (acréscimo): apaga o grupo (inclusive o Key Vault e a zona DNS)
az group delete --name rg-lab --yes
# Elimina o cofre da lixeira (soft delete) para liberar o nome
az keyvault purge --name kv-<NOME-UNICO>
```

*Pit stop cronometrado! Senha fora do repositório, roteamento com failover entre Europa e Brasil e o certificado que vence amanhã.*

**Exercícios**

1. Por que não colocar a senha do banco em variável de ambiente no repositório? O que fazer no lugar, nos dois provedores?
2. Um site tem usuários na Europa e no Brasil, e você quer enviar cada grupo ao ambiente mais próximo, com failover. Que política nos dois provedores?
3. O certificado do site vence amanhã e ninguém renovou. Que recurso evitaria isso?

**Gabarito**

1. Variáveis no repositório vazam. Guarde no Secrets Manager (AWS) ou no Key Vault (Azure), com permissão mínima; melhor ainda, use role ou Managed Identity para dispensar a senha.
2. Latência (Route 53) ou Performance (Traffic Manager), com failover ligado a health checks. No Traffic Manager, o próprio método Performance já desvia para o próximo endpoint saudável quando o mais próximo falha; combinar Performance com Priority de forma explícita exige perfis aninhados (nested profiles).
3. Certificados gerenciados com renovação automática: ACM (AWS) e certificados gerenciados do Front Door ou App Service (Azure), ou Key Vault com renovação.

**Anota aí:** segredo no cofre, tráfego filtrado pelo WAF, certificado renovado por máquina e DNS com política de roteamento; no Azure, o cofre reúne segredos, chaves e certificados.

**Checklist da Etapa 10**

- [ ] Sei por que segredos não ficam no código.
- [ ] Sei o que um WAF vê que um firewall de rede não vê.
- [ ] Sei como funciona a validação de certificado por DNS e a renovação automática.
- [ ] Sei mapear as cinco políticas de roteamento do Route 53 ao Traffic Manager.
- [ ] Sei que o Azure DNS não registra domínios.

*Setor 10 no verde! Segredo no cofre, tráfego revistado, superlicença renovada por máquina e lista de inscritos com política de roteamento. Agora é a volta de consagração: transformar tudo isso em plano de estudo. Etapa 11.*

---

## Etapa 11: AWS Academy, estudo e certificações (e o caminho Microsoft)

*Último setor! Hora de pensar em subir de categoria: os degraus de certificação nos dois lados, o simulador da fábrica e um método de estudo que olha a telemetria do próprio erro.*

### O problema

Você terminou o módulo, sabe a teoria e quer o primeiro emprego em nuvem. O currículo não diferencia você dos demais, e praticar em conta própria pode gerar custos. Certificações validam conhecimento de forma padronizada, e programas educacionais oferecem laboratórios sem risco de custo.

### O conceito, de forma neutra

- **Certificação em nuvem:** prova aplicada por órgão oficial (o próprio provedor), com estrutura padronizada, que valida domínio prático e teórico em arquitetura, segurança, desenvolvimento e operações. Não é exigida por lei, mas agrega ao currículo e vira critério de seleção em muitas vagas de DevOps, arquitetura, back-end e dados.
- **Níveis:** entrada, intermediário, avançado e especialidades. Cada nível tem público e profundidade próprios.
- **Programa educacional:** instituições parceiras recebem trilhas, materiais e laboratórios em ambiente real e temporário, sem custo de conta pessoal.
- **Preparação:** experiência prática, whitepapers e documentação, simulados para achar pontos fracos, e revisão direcionada de cada erro.
- **Jornada contínua:** o ritmo de inovação exige atualização e recertificação periódica.

**Leitura de cockpit:** os níveis de certificação são as **categorias de base**. Um piloto costuma subir degrau por degrau (F4, F3, F2) antes da F1, e cada degrau mostra que ele domina o anterior. A certificação de entrada (Cloud Practitioner, AZ-900) é o primeiro degrau; os níveis Associate e Professional ou Expert são os seguintes. O **programa educacional** com laboratório temporário (AWS Academy, sandboxes do Microsoft Learn) é o **simulador da fábrica**: você pilota de verdade, erra de verdade e não amassa nenhum carro (nem gera fatura na sua conta). A **recertificação** é o regulamento que muda a cada temporada: o que valia no ano passado precisa ser revisto. **Aqui a analogia para:** subir de categoria depende de resultado na pista e, muitas vezes, de patrocínio; a certificação depende de estudo e prova, não é exigida por lei, e você pode fazer a de entrada dos dois provedores na ordem que quiser.

### O que o material diz sobre certificações AWS (conforme o material, referência de 2025)

> Esta tabela reproduz o que a aula informou em junho de 2025. **Nomes, grades, preços, duração e pré-requisitos de certificações mudam, e algumas podem ter sido descontinuadas ou substituídas desde então.** Confira sempre o site oficial da AWS antes de planejar. Este guia não afirma o estado atual.

| Nível (conforme o material) | Perfil | Formato | Tempo | Custo citado |
|---|---|---|---|---|
| Foundational (por exemplo, Cloud Practitioner) | Quem começa ou perfis não técnicos | Múltipla escolha | 90 minutos | 100 dólares |
| Associate (Arquiteto de Soluções, SysOps e Desenvolvedor) | Técnicos com alguma vivência em AWS | Múltipla escolha | 90 minutos | 150 dólares |
| Professional (por exemplo, Arquiteto de Soluções, DevOps) | Muita experiência | Múltipla escolha | 170 minutos | 300 dólares |
| Specialty (por exemplo, Security, Big Data, Machine Learning, banco de dados e rede; a aula cita ainda Alexa Skill Builder) | Especialização em um tema | Múltipla escolha | 170 minutos | 300 dólares |

Pré-requisito sugerido para Foundational pela aula: pelo menos 6 meses de experiência em AWS (técnica, gestão ou vendas). A prova pode ser feita de casa pelo computador, com agendamento e regras.

### Equivalência AWS x Azure (acréscimo)

A Microsoft também organiza as certificações em níveis: **Fundamentals**, **Associate**, **Expert** e **Specialty**, e muitas são por função (role-based). A comparação abaixo é **aproximada, por nível e perfil**, não uma equivalência oficial.

| Perfil | AWS (conforme o material) | Microsoft Azure (acréscimo; confira o site oficial) |
|---|---|---|
| Entrada, conceitos de nuvem | Cloud Practitioner | AZ-900 (Azure Fundamentals) |
| Administração e operações | SysOps Administrator (Associate; o nome pode ter mudado, confira no site oficial) | AZ-104 (Azure Administrator, Associate) |
| Arquitetura de soluções | Solutions Architect Associate e Professional | AZ-305 (Azure Solutions Architect Expert) |
| DevOps | DevOps Engineer Professional | AZ-400 (DevOps Engineer Expert) |
| Desenvolvimento | Developer Associate | AZ-204 (Azure Developer, Associate) |
| Segurança | Security Specialty | Certificações da família de segurança da Microsoft (por exemplo, AZ-500); confira a grade atual |
| Dados, IA, rede | Specialties | Certificações específicas da Microsoft por tema; confira a grade atual |

Lembretes para a tabela acima: os códigos (AZ-900, AZ-104, AZ-305, AZ-400) podem mudar, ser aposentados ou ganhar pré-requisitos (os títulos Expert exigem uma certificação Associate como pré-requisito: o Azure Solutions Architect Expert, da AZ-305, exige a AZ-104, e o DevOps Engineer Expert, da AZ-400, exige a AZ-104 ou a AZ-204; confira o guia oficial). Preços e duração das provas Azure **não** estão neste guia: consulte a página de cada exame.

Programas educacionais:

| Recurso | AWS (conforme o material) | Microsoft (acréscimo; confira disponibilidade) |
|---|---|---|
| Programa para instituições de ensino | AWS Academy (trilhas, labs em ambiente real, vouchers em alguns casos, instrutor habilitado) | Microsoft Learn (trilhas e módulos gratuitos; alguns com ambiente de laboratório temporário) e programas para educadores |
| Laboratório sem risco de custo | Labs da Academy em ambiente temporário | Sandboxes de módulos do Microsoft Learn (em alguns módulos) |
| Conta gratuita para estudar | Free Tier (12 meses, segundo a aula; regras mudam) | Conta gratuita Azure e planos para estudantes (as regras e os créditos mudam; confira) |
| Cursos de preparação | ACloudGuru, Linux Academy, Udemy (citados no material) | Microsoft Learn, e outras plataformas de terceiros |

### O método do professor para preparar a prova (conforme o material)

1. Ter pelo menos dois anos de experiência prática na área da certificação desejada (o material recomenda), leitura dinâmica e foco.
2. Ler pelo menos dois whitepapers por semana, com ou sem certificação em mente.
3. Fazer simulados (o material cita ACloudGuru, Whizlabs e LinuxAcademy) e analisar as áreas mais fracas.
4. Para os tópicos fracos, buscar whitepapers e vídeos oficiais (o material cita o AWS re:Invent no YouTube).
5. Refazer o simulado, ler a explicação de cada erro e consultar a documentação oficial.

Esse método é independente do provedor: troque "whitepapers" e "re:Invent" pelo conteúdo oficial equivalente da Microsoft (documentação, Microsoft Learn e guias de estudo de cada exame) e ele continua válido.

**Leitura de cockpit:** é o método de quem trabalha no simulador. Você roda a volta (o simulado), vê onde perdeu tempo (as áreas fracas), estuda aquele trecho nos dados (whitepaper, documentação, vídeo oficial) e roda de novo. Reler o material inteiro sem saber onde perdeu tempo é dar cem voltas iguais sem olhar a telemetria.

**Dicas de prova (conforme o material):** revisar pelo guia oficial; resolver simulados; em prova remota, testar o ambiente antes; manter a calma, ler com atenção e raciocinar a partir da experiência de laboratório.

### Onde eles diferem de verdade

- **Estrutura.** Muitas certificações AWS se organizam por nível e áreas (Foundational, Associate, Professional, Specialty). A Microsoft organiza por **função** (administrador, desenvolvedor, arquiteto, segurança) e por **nível** (Fundamentals, Associate, Expert, Specialty). A comparação é de perfil, não de número de nível.
- **Estabilidade.** Em ambos os provedores, grades de certificação são reorganizadas periodicamente. Não trate este guia como fonte da lista vigente.
- **Plano de estudo.** O que vale para os dois: base em fundamentos, prática em laboratório e simulado com revisão dos erros.

### Mão na massa

*Volta de planejamento! Um perfil, os guias de exame dos dois lados, uma tabela de cruzamento com datas e uma sessão de laboratório por semana. E, no fim, a ronda nas duas garagens.*

**Parte 1: montar seu plano de estudo (sem custo).**

1. Escolha **um** perfil: administração, desenvolvimento, arquitetura ou DevOps.
2. Abra, no site oficial de cada provedor, a página da certificação de entrada e a do nível seguinte. Anote o **guia do exame** (domínios cobrados) e o **idioma** das provas.
3. Cruze o guia com as etapas deste material: para cada domínio do exame, marque em qual etapa (01 a 10) ele é coberto.
4. Escolha um recurso gratuito de cada provedor (a Academy, se sua instituição participar; o Microsoft Learn; ou a conta gratuita) e agende **uma sessão de laboratório por semana**.

**Parte 2: cruzamento de domínios.** Preencha uma tabela como esta, com datas:

| Domínio do exame (oficial) | Etapa deste guia | Prático feito? | Data da revisão |
|---|---|---|---|
| (exemplo) Segurança e identidade | 02 | sim | |
| (exemplo) Redes | 03 | sim | |

**Limpeza (de custos):** antes de encerrar o dia de estudo, revise o que sobrou nas duas contas. Na AWS, rode na região em que você praticou (por exemplo, `export AWS_DEFAULT_REGION=sa-east-1`); cada linha vazia é boa notícia.

```bash
# AWS: instâncias EC2 que não foram encerradas (paradas também cobram disco)
aws ec2 describe-instances --query "Reservations[].Instances[?State.Name!='terminated'].[InstanceId,State.Name]" --output text
# AWS: clusters EKS (plano de controle e nós cobram por hora)
aws eks list-clusters --query clusters --output text
# AWS: zonas hospedadas do Route 53 (cobram por mês)
aws route53 list-hosted-zones --query "HostedZones[].[Id,Name]" --output text
# AWS: buckets S3
aws s3 ls
# AWS: volumes EBS (inclusive os soltos, sem instância)
aws ec2 describe-volumes --query "Volumes[].[VolumeId,State,Size]" --output text
# AWS: Elastic IPs (IPv4 público cobra, associado ou não)
aws ec2 describe-addresses --query "Addresses[].[PublicIp,AllocationId,InstanceId]" --output text
# AWS: tabelas DynamoDB e segredos criados nas Etapas 06 e 10
aws dynamodb list-tables --query TableNames --output text
aws secretsmanager list-secrets --query "SecretList[].Name" --output text

# Azure (acréscimo): todos os recursos e grupos da assinatura
az resource list --output table
az group list --query "[].name" --output tsv
# Azure (acréscimo): cofres apagados que ainda reservam o nome (soft delete)
az keyvault list-deleted --output table
# Se algo que você criou ainda aparece, apague-o ou use: az group delete --name rg-lab --yes --no-wait
```

**Leitura de cockpit:** é a ronda final antes de o material sair do circuito: conferir nas duas garagens se não ficou nada ligado. Na nuvem, o que fica ligado continua cobrando depois que você vai embora.

*Última volta lançada do GP! Números de prova que envelhecem, a primeira certificação de quem é back-end e o porquê do simulado.*

**Exercícios**

1. A aula cita um tempo de 90 minutos para Foundational e Associate e 170 para Professional e Specialty. Esses números podem ser usados hoje como fato?
2. Você é desenvolvedor back-end e quer uma primeira certificação nos dois provedores. Que perfis aproximados escolher?
3. Por que fazer simulado e depois estudar o erro é melhor do que apenas reler o material?

**Gabarito**

1. Não como fato atual: são os números do material (2025). Confirme no site oficial, porque duração e grade podem ter mudado.
2. Foundational (Cloud Practitioner) e AZ-900 como entrada; depois Developer Associate (AWS) e AZ-204 (Azure), conferindo as grades vigentes.
3. O simulado revela os pontos fracos e a revisão do erro cobre exatamente a lacuna, o que é mais eficiente que revisão genérica.

**Anota aí:** certificação valida, laboratório ensina, e as duas coisas precisam de atualização, porque nomes, preços e grades de certificação mudam: confira sempre a fonte oficial.

**Checklist da Etapa 11**

- [ ] Sei descrever os níveis de certificação da AWS (conforme o material) e os da Microsoft (Fundamentals, Associate, Expert, Specialty).
- [ ] Sei que nomes, preços e grades mudam e onde conferir.
- [ ] Montei um plano de estudo com laboratório semanal.
- [ ] Sei usar recursos gratuitos dos dois provedores sem gerar custo.
- [ ] Sei revisar e apagar o que deixei ligado.

*Setor 11 no verde! Plano montado, laboratório agendado e nada esquecido ligado nas duas contas. Na Hungria, em 1998, o Ross Brawn trocou a estratégia do Michael Schumacher no meio da prova e venceu, e é essa a lição da Etapa 11: o plano de estudo se corrige pelos resultados dos simulados, não fica congelado. Agora é a reta final, direto para a bandeira quadriculada.*

---

## Checklist final de autoavaliação

*Última reta, bandeira quadriculada à vista! Esta é a vistoria do parque fechado, a conferência dos comissários depois da corrida: marque com honestidade, caixa por caixa, porque comissário não aceita resposta decorada.*

**Fundamentos e identidade**

- [ ] Explico nuvem com o exemplo da Black Friday e sei dividir a responsabilidade entre provedor e cliente.
- [ ] Sei mapear conta AWS para tenant e subscription do Azure.
- [ ] Leio uma policy IAM e uma role RBAC e digo o que cada uma permite.
- [ ] Sei por que o Deny vence na AWS e como o Azure RBAC é aditivo.
- [ ] Sei qual serviço audita (CloudTrail e Activity Log) e qual detecta ameaças (GuardDuty e Defender for Cloud).

**Rede e computação**

- [ ] Divido um CIDR em sub-redes e explico pública x privada pela rota.
- [ ] Distingo Security Group, NACL e NSG.
- [ ] Escolho família ou série de VM e explico créditos de CPU.
- [ ] Sei a diferença entre parar e desalocar no Azure.
- [ ] Rodei um Deployment Kubernetes localmente e sei que o YAML vale para EKS e AKS.

**Dados, serverless e observabilidade**

- [ ] Escolho entre relacional e NoSQL e sei os pares de cada serviço nos dois provedores.
- [ ] Escrevo a mesma função HTTP para Lambda e para Azure Functions.
- [ ] Escrevo a mesma consulta em Logs Insights e em KQL.
- [ ] Sei o que são diagnostic settings e action groups.

**Entrega, segurança e carreira**

- [ ] Desenho a entrega com CDN, balanceador e armazenamento de objetos nos dois provedores.
- [ ] Sei onde fica o namespace global do S3 e do Blob Storage.
- [ ] Guardo segredos em cofre e evito credenciais no código.
- [ ] Mapeio as políticas de roteamento do Route 53 ao Traffic Manager.
- [ ] Monto um plano de estudo para certificações e confiro sempre o site oficial.

**Disciplina de custo**

- [ ] Configurei orçamento com alerta nos dois provedores.
- [ ] Toda prática terminou com limpeza e conferi com um comando de listagem.

*BANDEIRA QUADRICULADA! Se as caixas estão marcadas, sobe no pódio: você largou sem saber em qual circuito estava e cruzou a linha operando os dois com o mesmo procedimento, do passe à lista de inscritos, devolvendo a garagem no fim de cada prática. No Brasil, em 2008, o Lewis Hamilton foi campeão por um ponto, e é essa a lição do checklist: um único item pulado (uma limpeza esquecida, um conceito mal entendido) já muda o resultado. Ficou caixa em branco? Sem drama: box, ajusta e volta para a pista. Na sequência, os registros de bastidor do piloto e do professor.*

---

## Notas do piloto: onde as analogias quebram

A camada de F1 não altera comandos, código, tabelas técnicas, saídas esperadas nem exercícios; as correções técnicas são as das Notas do professor, logo abaixo. Os pontos em que a comparação não fecha 100%:

1. **Provedor e circuito.** O calendário escolhe o circuito; na nuvem você escolhe o provedor e pode usar os dois. E nenhum autódromo tem instalações em várias cidades: a região e a zona são uma extensão didática da imagem do circuito.
2. **Conta, tenant e assinatura.** "Contrato com o circuito" é um rótulo didático. A AWS junta pessoas, recursos e fatura na conta; o Azure separa o cadastro de pessoas (tenant) dos contratos de uso e fatura (assinaturas). Nenhum dos dois modelos tem par exato no paddock.
3. **Passe e permissão.** No paddock há um único credenciamento. Na nuvem há vários mecanismos que se combinam (policy, role, escopo, SCP, Azure Policy, Conditional Access), e o `Deny` explícito da AWS não existe dentro de uma role do Azure RBAC, que é aditivo.
4. **Fiscais de rede.** A AWS separa o fiscal da porta (Security Group) do fiscal da catraca do setor (NACL); o NSG do Azure faz as duas coisas, com memória e com regras de negação. A imagem dos fiscais não diz qual é stateful: isso está no texto técnico.
5. **Garagem e máquina virtual.** Uma garagem de F1 leva dias para montar e é uma por equipe; uma VM sobe em minutos, em qualquer quantidade, e pode ser parada ou desalocada.
6. **ERS e créditos de CPU.** O ERS recolhe energia em frenagem, um evento físico de cada volta; os créditos dependem só do tempo abaixo da linha de base. E o "modo ilimitado", em que se paga pelo excedente, não existe na F1.
7. **IP fixo sem analogia.** O IP fixo não tem imagem de F1 neste guia: o Elastic IP e o Public IP estático pertencem à sua conta, são associados à máquina que você escolher, e o IPv4 público tem custo.
8. **Dois carros e réplicas.** Na F1 são dois carros por corrida e carro parado é prova perdida. O Deployment pede quantas réplicas você quiser e repõe a que cair em segundos.
9. **Pit stop e atomicidade.** A transação que falha volta ao estado anterior; o pit stop que dá errado não devolve os pneus velhos, só segura o carro até a troca terminar.
10. **Estação sob demanda.** Nada na F1 é cobrado por atendimento nem escala de zero a milhares de cópias. A imagem do serverless é didática.
11. **Diagnostic settings.** Sensor com canal desligado seria erro de montagem na F1; no Azure, é o comportamento padrão de muitos recursos até você configurar o envio de logs.
12. **Entrada do pit lane.** No pit lane real cada carro para no box da própria equipe; a imagem do balanceador vale para o papel (distribuir e tirar de rota quem falhou), não para a regra da pista.
13. **Segredo e combinação.** A combinação roubada é uma; o segredo vazado pode ter sido copiado sem limite. E a superlicença é uma por piloto e de uma única autoridade; um domínio pode ter mais de um certificado válido, de autoridades diferentes.
14. **Teto de gastos e orçamento.** O cost cap é regra com punição; o alerta de orçamento só avisa.
15. **Categorias de base e certificações.** Subir de categoria depende de resultado na pista e, muitas vezes, de patrocínio; certificação depende de estudo e prova, e não é exigida por lei.
16. **Nenhum provedor é equipe.** Não associei AWS nem Azure a equipe real nenhuma. A Red Bull aparece só como exemplo de grupo com duas equipes, para ilustrar o conceito de governança de várias contas que existe nos dois provedores.

## Fontes dos dados de F1 (consultadas em 2026-10-06)

Os dados de campeonato foram verificados em 2026-10-06 para o guia de Cultura DevOps deste mesmo módulo e reutilizados aqui sem nova consulta (o backend do pitstop, `localhost:3333`, estava fora do ar no momento da escrita).

Classificação de pilotos após a rodada 16 de 23 (GP do Bahrein disputado em Sepang, Malásia, em 4 de outubro de 2026): 1. Kimi Antonelli (Mercedes), 320 pontos; 2. George Russell (Mercedes), 236; 3. Lewis Hamilton (Ferrari), 214; 4. Charles Leclerc (Ferrari), 191; 5. Lando Norris (McLaren), 188; 6. Max Verstappen (Red Bull), 188; 7. Oscar Piastri (McLaren), 128; 8. Isack Hadjar (Red Bull), 96; 9. Liam Lawson (Racing Bulls), 65; 10. Pierre Gasly (Alpine), 41. Pódio em Sepang: Verstappen, Antonelli e Hamilton. Próxima etapa: GP de Singapura, 9 a 11 de outubro de 2026, primeiro fim de semana sprint em Marina Bay.

- Classificação de pilotos após a rodada 16 de 23: [RacingNews365](https://racingnews365.com/2026-f1-championship-standings-after-bahrain-grand-prix-in-malaysia) e [Motorsport Week](https://www.motorsportweek.com/2026/10/04/f1-2026-world-championship-standings-after-the-bahrain-gp-in-malaysia/).
- Resultado e relato do GP do Bahrein em Sepang (4 de outubro de 2026): [Formula1.com](https://www.formula1.com/en/latest/article/verstappen-wins-rain-hit-bahrain-gp-in-malaysia-over-antonelli-as-russell-retires-late-on.6qfpIHPch8mIVj2YgfHdCp) e [RaceFans](https://www.racefans.net/2026/10/04/2026-bahrain-grand-prix-in-malaysia-race-result-and-championship-points/).
- GP de Singapura 2026 (9 a 11 de outubro, primeiro fim de semana sprint em Marina Bay): [RacingNews365](https://racingnews365.com/f1/races/singapore-gp) e [F1 Wiki](https://f1.fandom.com/wiki/2026_Singapore_Grand_Prix).
- Fatos gerais de F1 usados sem fonte específica, por serem de conhecimento público e estável: o teto de gastos em vigor desde 2021, o autódromo de Interlagos em São Paulo, a Red Bull como dona da Red Bull Racing e da Racing Bulls, e o funcionamento geral de ERS, passes, pit lane e lista de inscritos.

---

## Apêndice: quadro de-para completo

Todas as analogias usadas no documento, na ordem em que aparecem. As centrais estão no quadro do início. AWS e Azure entram sempre da mesma forma, como circuitos; nenhum provedor é associado a uma equipe real, e cada linha vale para o par de serviços da tabela de equivalência.

| Nuvem (AWS e Azure) | Fórmula 1 |
|---|---|
| Provedor de nuvem (AWS ou Azure) | O circuito: instalações próprias, e o procedimento da equipe é o mesmo nos dois |
| On-premises | Construir o próprio autódromo para poder correr |
| Sob demanda e pay-as-you-go | Ocupar a garagem do circuito e pagar pelo uso das instalações |
| Região | A cidade-sede onde o circuito mantém instalações (a região São Paulo: `sa-east-1` e `brazilsouth`) |
| Zona de disponibilidade | Um prédio de garagens fisicamente separado dentro da sede, com energia e rede próprias |
| Distribuir entre zonas | Não deixar os dois carros dependendo do mesmo gerador |
| Responsabilidade compartilhada | O circuito cuida de pista, barreiras e energia; a equipe cuida do carro, da garagem e de quem entra nela |
| Sob demanda, reserva e spot | Pagar a garagem só no fim de semana, contrato de 1 ou 3 anos com desconto, e capacidade que sobrou e pode ser tomada de volta |
| Orçamento com alerta (AWS Budgets, Cost Management) | O teto de gastos, com alarme antes do estouro |
| Conta AWS e assinatura Azure | O contrato da equipe com o circuito: instalações, acessos e fatura isolados |
| AWS Organizations e Management Groups | O grupo dono de várias equipes, com regras que valem para todas |
| Resource Group (Azure) | Uma garagem montada dentro do contrato: tudo o que está nela sai junto quando ela é devolvida |
| `aws sts get-caller-identity` e `az account show` | Conferir em qual garagem você está e com qual passe, antes de mexer em qualquer coisa |
| Tenant do Entra ID | O cadastro das pessoas da equipe, separado dos contratos de uso |
| Identidade (usuário, grupo) | O passe pessoal |
| Autenticação | A catraca conferindo que o passe é seu |
| Autorização e permissões | As áreas que o passe abre |
| Menor privilégio | Ninguém com passe de pit lane "por via das dúvidas" |
| Auditoria (CloudTrail, Activity Log) | O registro da catraca: quem entrou, onde e quando |
| Detecção de ameaças (GuardDuty, Defender for Cloud) | A segurança que assiste às câmeras e estranha comportamento fora do padrão |
| Identidade de máquina (IAM Role, Managed Identity) | O passe preso ao equipamento, emitido e renovado pelo circuito, sem papel para perder |
| Chave de acesso no código | Um passe humano esquecido no painel do caminhão |
| Conta raiz | O passe-mestre do dono do contrato, guardado no cofre |
| Policy IAM com condições | O passe com tudo impresso no cartão: porta, origem, conferência de rosto e horário |
| Role do Azure RBAC e escopo | O passe que imprime só o que abre; onde ele vale vem da atribuição |
| SCP | A regra da matriz que nenhum chefe de equipe consegue liberar |
| Azure Policy | A regra que barra a montagem de um tipo de equipamento na garagem |
| `Deny` explícito (AWS) | A proibição que vence qualquer autorização |
| RBAC aditivo (Azure) | Passes que só acumulam áreas; para proibir, outro balcão |
| Plano de controle x plano de dados | Ser dono da garagem não dá acesso aos dados do carro |
| Rede virtual (VPC, VNet) | A área cercada da equipe no paddock |
| Bloco CIDR | O terreno que o contrato reserva |
| Sub-rede | Um setor da área, com função própria |
| Sub-rede pública (pela rota) | O setor com portão para a rua; quem decide é a rota, não a placa |
| NAT Gateway | O mensageiro que sai para buscar algo e volta: só saída |
| Firewall stateful | O fiscal que lembra quem deixou entrar e libera a resposta |
| Firewall stateless | O fiscal que confere tudo nos dois sentidos, sem memória |
| Security Group | O fiscal na porta de cada garagem |
| NACL | O fiscal na catraca do setor |
| NSG | Um fiscal só, com memória, que autoriza e proíbe, na porta, na catraca ou nos dois |
| Prioridade de regra no NSG | A ordem em que o fiscal lê as instruções, parando na primeira que se aplica |
| Peering | A passagem direta entre duas áreas, que não leva a uma terceira |
| Hub (Transit Gateway, Virtual WAN) | A via central do paddock, por onde todos passam |
| VPN | O rádio criptografado sobre a rede pública |
| Link dedicado (Direct Connect, ExpressRoute) | O enlace exclusivo entre o circuito e a sala de operações da fábrica |
| Máquina virtual (EC2, Azure VM) | Uma garagem completa, com gerador e sistemas próprios (o sistema operacional inteiro) |
| Famílias e séries de tamanho | O catálogo de tamanhos de garagem de cada circuito |
| Instância burstable e créditos de CPU | A bateria do ERS: carrega abaixo da linha de base, descarrega nos picos |
| Créditos esgotados | O carro que perde velocidade antes do fim da reta |
| Linha de base de CPU | O ponto abaixo do qual a bateria carrega e acima do qual descarrega |
| Imagem (AMI, Marketplace, Compute Gallery) | A especificação de montagem de onde saem garagens idênticas |
| Autoescalonamento | Abrir mais garagens quando a carga sobe, dentro do limite que você configurou |
| Disco persistente (EBS, Managed Disks) | O armário de dados da garagem, que fica (e cobra) com a garagem fechada |
| IP público fixo (Elastic IP, Public IP estático) | Sem analogia de pista (veja a nota 7 do piloto) |
| Parar (AWS) e desalocar (Azure) | Devolver a garagem ao circuito |
| VM "Stopped" sem desalocar (Azure) | Apagar as luzes com a garagem ainda reservada e cobrando |
| Container de transporte | Os contêineres e engradados padronizados com que o material da F1 viaja |
| Imagem de container | A especificação replicável do carro |
| Registro (ECR, ACR) | O arquivo central de especificações versionadas |
| Container | Um carro montado a partir da especificação |
| Pod | O carro que vai para a pista: a menor unidade que o orquestrador põe para rodar |
| Nó de trabalho (node group, node pool) | Uma garagem (uma máquina virtual) |
| Control plane | O muro: decide em que garagem cada carro fica e manda repor o que parou |
| Kernel compartilhado | A energia comum da garagem, usada por todos os carros dela |
| Deployment | A ficha de operação: quantos carros de qual especificação na pista |
| Rótulo (`labels`) | A pintura que identifica o carro |
| Service e `selector` | O canal de rádio de endereço fixo, que chama quem tem aquela pintura |
| Ingress | A regra da entrada do pit lane para o tráfego HTTP |
| ECS e Container Apps | O procedimento simplificado de cada circuito: você entrega a especificação e o circuito cuida do muro e das garagens |
| Auto-recuperação | O muro mandando montar outro carro quando um para |
| Banco relacional | O livro técnico oficial do carro, com regras que ligam peça, chassi e piloto |
| NoSQL de chave-valor | O controle de pneus por código de barras |
| Chave de partição | A etiqueta pela qual você vai buscar |
| Atomicidade (ACID) | O carro só é liberado do pit stop com as quatro rodas trocadas |
| Alta disponibilidade entre zonas | Uma cópia viva do banco em outro prédio de garagens |
| Réplica de leitura | A cópia somente leitura que atende consultas |
| Serviço gerenciado de banco | O circuito cuidando da manutenção do arquivo; a equipe cuida do que escreve nele |
| Consistência forte e eventual | O tempo no monitor do muro e o placar de um site que alcança o oficial com atraso |
| Serverless (Lambda, Azure Functions) | A estação que o circuito só abre quando chega um pedido, cobrada por atendimento |
| Função e handler | O procedimento escrito que a equipe entrega à estação |
| Gatilho | O pedido que abre a estação |
| Cold start | A volta de saída, com pneus e freios frios |
| API gateway (API Gateway, APIM) | A portaria do paddock: confere passe, limita fluxo e encaminha |
| Fila (SQS, Queue Storage, Service Bus) | A pilha de pneus usados esperando análise |
| Orquestração (Step Functions, Logic Apps, Durable Functions) | O roteiro de um pit stop, com etapas, paralelismo e plano para a porca que não sai |
| Lock-in | O procedimento escrito para a garagem de um circuito só |
| Adaptador fino | A capa de formulário trocada em cada circuito, com o mesmo procedimento dentro |
| Chamar o handler com evento falso | O simulador |
| Métricas | A telemetria |
| Eventos | As mensagens do controle de corrida |
| Logs | O rádio e o registro de eventos do carro |
| Alarme e alerta | O engenheiro que só chama o piloto quando há algo a fazer |
| Dashboard | As telas do muro |
| Rastreamento distribuído (X-Ray, Application Insights) | Os minissetores de uma volta |
| Plataforma de monitoramento (CloudWatch, Azure Monitor) | O sistema de telemetria de cada circuito |
| Consulta em pipeline (Logs Insights, KQL) | O engenheiro de dados filtrando, agregando e ordenando a gravação da sessão |
| Período de avaliação do alarme | Não chamar o piloto por causa de um pico numa volta só |
| Action Group | A lista de quem o muro chama |
| Diagnostic settings | Ligar o canal do sensor na transmissão; sem isso, o dado não chega ao muro |
| Armazenamento de objetos (S3, Blob Storage) | O almoxarifado central |
| CDN (CloudFront, Front Door) | Os postos avançados de peças, perto de quem pede |
| Balanceador de carga (ALB e NLB, Application Gateway e Load Balancer) | O controle de entrada do pit lane, direcionando cada carro a um box livre |
| Health check do balanceador | Fechar o box que está com problema |
| Camada 4 e camada 7 | Direcionar pelo número do carro, ou ler o pedido e mandar para o box preparado |
| Classes e camadas de armazenamento | A prateleira da temporada e o arquivo histórico |
| URL assinada e SAS | O passe de convidado de um dia |
| Versionamento de objetos | Guardar a revisão anterior da peça |
| Nome globalmente único (bucket, storage account) | O nome do almoxarifado, que vira endereço público |
| `304 Not Modified` | O almoxarifado dizendo "sua revisão ainda é a atual" |
| TTL de cache | Por quanto tempo o posto confia na própria cópia sem ligar |
| Cofre de segredos (Secrets Manager, Key Vault) | O cofre de combinações, que entrega a combinação na hora a quem tem passe |
| Rotação de segredo | Trocar a combinação de tempos em tempos |
| WAF | O fiscal que revista o conteúdo, não só o passe |
| Certificado TLS | A superlicença: emitida por autoridade reconhecida, prova identidade e vence |
| Renovação automática de certificado | Tirar da mão humana o risco do documento vencido |
| DNS | A lista de inscritos: o nome ligado ao número |
| TTL do DNS | Por quanto tempo vale a cópia impressa da lista antes de nova conferência |
| Políticas de roteamento | Mandar cada um ao endereço mais próximo, do país, de reserva ou por peso |
| Níveis de certificação | As categorias de base: F4, F3, F2 e F1 |
| Programa educacional com laboratório (AWS Academy, Microsoft Learn) | O simulador da fábrica: pilota de verdade sem amassar carro nem gerar fatura |
| Simulado e revisão do erro | Rodar a volta, achar onde perdeu tempo e estudar aquele trecho |
| Recertificação | O regulamento que muda a cada temporada |
| Limpeza de custos | A ronda final antes de o material sair do circuito |

---

## Notas do professor

**Correções técnicas ao material bruto** (o relatório original foi preservado quando não havia erro evidente):

1. **Créditos da `t3.micro` (Etapa 04).** O material diz 6 créditos por hora. Esse valor é o da geração anterior (T2). A `t3.micro` acumula 12 créditos por hora, com linha de base de 10% por vCPU em 2 vCPUs. Usei 12 no exercício. Além disso, as instâncias T3 usam o modo ilimitado por padrão; confira a documentação ao dimensionar custo.
2. **Volumes EBS "replicados entre zonas" (Etapa 04).** Um volume EBS é replicado dentro de **uma** zona de disponibilidade; para proteger contra falha de zona, use snapshots, que são regionais. Também, "os volumes continuam existindo ao encerrar a instância" vale para volumes adicionais; o volume raiz é apagado por padrão ao encerrar.
3. **Elastic IP gratuito quando associado (Etapa 04).** A afirmação refletia o modelo antigo. Desde 2024, a AWS cobra por endereços IPv4 públicos em geral (a própria referência da aula trata de identificar e otimizar o uso de IPv4 público). Confira a cobrança vigente.
4. **Desconto de reservas (Etapas 01 e 04).** O material cita "até 72%" em um ponto e "até 70%" em outro. Ambos são "até": o percentual real depende de tipo, prazo e forma de pagamento. Não use nenhum dos dois como número fixo; consulte a calculadora oficial.
5. **Free Tier de 12 meses (Etapa 01).** As regras de free tier e de créditos para contas novas mudam e já foram reformuladas; confirme a oferta vigente no site oficial. O mesmo vale para a conta gratuita do Azure.
6. **CIDR da VPC "não pode ser alterado" (Etapa 03).** O bloco **primário** não pode ser alterado, mas é possível associar blocos CIDR **secundários** à VPC. O conselho de planejar bem antes permanece.
7. **VPC Peering "criptografada" (Etapa 03).** O tráfego de peering não passa pela internet pública, mas isso não substitui a criptografia ponta a ponta das aplicações (TLS). Leia a afirmação como "tráfego privado".
8. **Logs Insights "semelhante a SQL" (Etapa 08).** A sintaxe é de pipeline (`fields | filter | stats | sort | limit`), mais próxima de `grep | sort | head` do que de `SELECT`. O KQL segue a mesma família de ideias.
9. **Caso Capital One (Etapa 02).** O resumo do material ("credencial mal configurada em um WAF") é simplificado. Em termos técnicos, uma configuração incorreta do firewall de aplicação permitiu obter credenciais temporárias de uma role com permissões excessivas, e o problema central foi o excesso de permissões. A lição (responsabilidade do cliente, menor privilégio) permanece.
10. **`pod.yaml` e `service.yaml` (Etapa 05).** No material, o Pod não tem `labels` e o Service seleciona `app: minha-aplicacao`, logo esse Service não encontraria aquele Pod. O Deployment do material está correto (o rótulo está no `template`). Usei o Deployment nos exemplos.
11. **AWS App Mesh (Etapa 05, tendências).** O material o apresenta como tendência. A AWS anunciou o encerramento do suporte ao serviço; verifique o estado atual antes de adotá-lo.
12. **Links da Etapa 11.** O link atribuído ao "LinuxAcademy" no material aponta para um site cujo domínio parece de outra organização, e o ACloudGuru e o LinuxAcademy foram unificados sob a mesma empresa. Confira os links antes de usar. Os cursos e simulados citados são sugestões do professor da aula, não requisitos.
13. **Certificações, preços e durações (Etapa 11).** Foram mantidos "conforme o material" (junho de 2025). Algumas certificações listadas podem ter sido descontinuadas ou renomeadas depois. Este guia não afirma o estado atual; a fonte é o site oficial.

**Sobre o conteúdo Azure.** Todo o conteúdo Azure é **acréscimo didático do professor**, produzido a partir de conhecimento geral dos serviços e de comandos que conheço, e não consta do relatório bruto. Onde não tive certeza de um equivalente (por exemplo, certificados privados, detecção de anomalias com IA, código na borda, rotação automática de segredos e o melhor produto de CDN em 2026), descrevi em prosa e pedi conferência em vez de inventar um nome ou comando. Nomes de produtos Azure mudam com frequência (por exemplo, o Microsoft Entra ID já se chamou Azure Active Directory); valide na documentação oficial antes de usar em produção. As tabelas de equivalência são **mapas de aprendizado**, não promessas de paridade: sempre compare por requisito, e não por nome.

**Sobre os comandos.** Os comandos de leitura (`list`, `describe`, `show`) não criam recursos. Os comandos de criação estão marcados como opcionais e acompanhados de limpeza, mas a responsabilidade pelo custo da sua conta é sua. Valide a sintaxe com `aws <serviço> help` e `az <grupo> --help` na versão que você instalou, porque as CLIs evoluem.

**Sobre os casos de mercado** (Netflix, Capital One, Autodesk, Airbnb, GoPro, Disney, Bustle, FINRA, Condé Nast): foram preservados como o material os apresenta, sem acréscimos nem verificação independente.

---

*E assim encerramos a transmissão, direto do muro dos boxes do GP da Nuvem: onze setores, dois circuitos e uma equipe só, com o mesmo procedimento nos dois. Da cabine, é tudo. A próxima parada do calendário é Singapura, de 9 a 11 de outubro de 2026; até lá, lembre: recurso esquecido ligado é o único adversário que corre a madrugada inteira. FIM DE TRANSMISSÃO.*
