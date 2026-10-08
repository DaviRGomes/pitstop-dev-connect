# AWS: relatório de estudo

> Conteúdo extraído dos 11 PDFs da disciplina "AWS" (DevOps e Arquitetura Cloud, Fase 1, FIAP POSTECH). Cada aula vira uma etapa. Referências das aulas consultadas em junho de 2025 (18 e 23 de junho, conforme cada PDF). Somente o conteúdo original da AWS está aqui; a comparação com Azure entra nas etapas seguintes do pipeline.

## Etapa 01: Introdução a AWS

### O que vem por aí

Onde estão armazenadas as fotos do seu celular? Como grandes sites atendem milhões de acessos simultâneos? Como empresas lançam novos sistemas em minutos? Tudo isso é possível graças à computação em nuvem. A aula explora o que é uma arquitetura cloud, como provedores como a AWS organizam seus serviços e por que esse modelo está revolucionando a tecnologia: conceitos da infraestrutura em nuvem, vantagens, diferenças em relação à infraestrutura tradicional (On-Premises) e por que profissionais que dominam esse ambiente são cada vez mais procurados. Palavras-chave do universo: escalabilidade, automação e inovação.

### Hands on

Vídeos práticos voltados para iniciantes com navegação completa pelo Console da AWS: primeiros passos para configurar a conta, explorar a interface, localizar serviços e entender como utilizar o plano gratuito (Free Tier). Também mostram como ativar camadas básicas de segurança e como navegar entre as regiões da AWS. Objetivo: tornar o uso da nuvem concreto, familiar e acessível, mesmo para quem nunca usou a AWS.

### Contexto histórico

Construir infraestrutura na nuvem pode parecer desafiador para quem está acostumado ao modelo tradicional de gerenciar servidores físicos dentro da empresa; a transição exige uma nova forma de pensar e operar a tecnologia.

Nas últimas duas décadas, a computação em nuvem se consolidou como o modelo rápido de entrega de infraestrutura e serviços digitais. No modelo tradicional, empresas investiam muito dinheiro em servidores físicos, licenças e manutenção. A nuvem permite acessar poder computacional, armazenamento e rede sob demanda, como um serviço público disponível a qualquer momento. Isso reduziu barreiras de entrada, aumentou a escalabilidade e acelerou a inovação em finanças, saúde, educação e entretenimento.

A Amazon Web Services (AWS) foi pioneira, lançando seus primeiros serviços comerciais em 2006. A Amazon percebeu que boa parte de sua infraestrutura interna poderia ser modularizada e oferecida como serviço para desenvolvedores e empresas externas. Assim nasceram o S3 (armazenamento de objetos) e o EC2 (servidores virtuais), que viraram padrão de mercado. Hoje a AWS é líder global em computação em nuvem, com milhares de serviços e presença em praticamente todos os continentes.

O sucesso se deve também à filosofia de blocos reutilizáveis (building blocks), altamente integrados, que permitem montar desde pequenas aplicações até sistemas globais distribuídos, e ao modelo de cobrança pay-as-you-go (paga-se apenas pelo que usa), que democratizou o acesso para startups, universidades e governos.

(Figura 1: a evolução da infraestrutura até cloud.)

### O que é computação em nuvem

Forma moderna de oferecer recursos de tecnologia pela internet (processamento, bancos de dados, armazenamento, aplicações e outros serviços) sob demanda e com pagamento baseado no uso. Antes, quem queria desenvolver uma aplicação comprava servidores, configurava toda a infraestrutura e cuidava da manutenção: caro e demorado.

Com a nuvem você acessa rapidamente recursos flexíveis e de custo acessível, sem investir pesado em hardware no início nem cuidar de equipamentos. Agilidade e pagamento sob demanda são a base do conceito.

Vantagens:

- Flexibilidade, escalabilidade e agilidade na inovação.
- Pagar apenas pelos recursos utilizados, sem altos investimentos iniciais.
- Economias de escala: provedores como a AWS atendem centenas de milhares de clientes, o que resulta em preços mais baixos.
- Eliminar a necessidade de prever capacidade com antecedência: ajusta-se os recursos conforme a demanda.
- Recursos provisionados em minutos, acelerando desenvolvimento e experimentação.
- Redução de custos operacionais; foco em clientes e produtos em vez de manter infraestrutura física.
- Implantação global de aplicações com poucos cliques, com menor latência e melhor experiência para usuários em diferentes regiões.

A AWS é a plataforma de nuvem mais completa e amplamente adotada do mundo, com mais de 200 serviços distribuídos globalmente (computação, armazenamento, banco de dados, rede, machine learning, segurança e muitos outros), acessíveis por interface web (console), linha de comando (CLI) ou APIs, permitindo automação e integração com qualquer aplicação moderna. O diferencial é o ecossistema robusto, confiável e em expansão contínua: além dos serviços, arquiteturas de referência, ferramentas de monitoramento, segurança integrada, programas de suporte e comunidade ativa.

A presença global é dividida em regiões e zonas de disponibilidade, o que permite distribuir cargas pelo mundo com baixa latência e alta disponibilidade, atender usuários de qualquer lugar e cumprir exigências legais de localização de dados. Alcance, confiabilidade e inovação constante consolidaram a AWS como líder do mercado de nuvem por mais de uma década.

(Figura 2: recurso AWS Global.)

### Antes da nuvem: o cenário on-premises

As empresas hospedavam tudo em datacenters próprios: comprar servidores físicos, montar salas refrigeradas, instalar tudo manualmente e manter uma equipe de infraestrutura. Caro e pouco ágil.

Exemplo: um varejista se preparando para a Black Friday precisava comprar servidores extras só para o pico. Depois do evento, esses servidores ficavam encostados, gerando custo sem retorno.

Com o crescimento da internet, a demanda por computação, armazenamento e rede cresceu muito e manter grande estrutura física virou inviável para muitas organizações. Em ambiente tradicional, montar um ambiente de testes exigia comprar hardware, instalar sistemas operacionais, puxar cabeamento e configurar tudo, o que podia levar semanas. Na nuvem, replica-se um ambiente inteiro de produção em minutos, pela internet, com poucos cliques. A nuvem permite focar no que importa: criar soluções, escrever código e testar ideias, sem gastar tempo configurando servidores ou em tarefas repetitivas que não agregam valor direto ao negócio.

(Figura 3: benefícios do cloud computing.)

### Infraestrutura global: Regiões e Zonas de Disponibilidade

A AWS organiza sua infraestrutura global em estrutura hierárquica de Regiões e Zonas de Disponibilidade (AZs), projetada para resiliência, baixa latência e alta disponibilidade. Cada Região é uma área geográfica específica, como "São Paulo" ou "Leste dos EUA (Virgínia)", e contém duas ou mais Zonas de Disponibilidade: data centers fisicamente separados, mas interligados por redes de alta velocidade e baixa latência. Isso permite aplicações tolerantes a falhas e facilita a replicação de dados entre zonas, reduzindo riscos operacionais.

(Figura 4: zonas de disponibilidade.)

### Categorias de serviços

Os serviços são organizados em categorias funcionais:

- Computação (ex.: EC2, Lambda);
- Armazenamento (ex.: S3, EBS);
- Banco de Dados (ex.: RDS, DynamoDB);
- Redes (ex.: VPC, Route 53);
- Segurança (ex.: IAM, WAF);
- Machine Learning (ex.: Bedrock, SageMaker).

Essa organização por produtos ajuda a encontrar rapidamente o recurso necessário, seja para hospedar aplicações, processar grandes volumes de dados ou proteger informações sensíveis com rigorosos controles de acesso.

### Contas e AWS Organizations

Cada conta AWS é um ambiente isolado, com seus próprios recursos, usuários, permissões e faturas. Com o AWS Organizations é possível gerenciar múltiplas contas de forma centralizada, aplicando políticas de segurança padronizadas, limites de gastos e estruturação por unidades de negócio. Útil em ambientes corporativos: governança, escalabilidade e controle financeiro em larga escala.

### Formas de acesso

- **Console de Gerenciamento da AWS**: a forma mais comum para iniciantes. Interface gráfica no navegador para visualizar, criar, configurar e excluir recursos com poucos cliques. Intuitivo, ideal para testes, demonstrações e gerenciamento manual em pequena escala. (Figura 5: Console AWS.)
- **CLI (Command Line Interface)**: ferramenta de linha de comando para automatizar tarefas, interagir com serviços programaticamente e gerenciar recursos de forma precisa e repetível. Com comandos como `aws ec2 run-instances` ou `aws s3 cp` é possível executar qualquer operação disponível no console, mas com scripts, pipelines e automação. Essencial para desenvolvedores, engenheiros DevOps, SysAdmin e SRE.
- **SDKs (Software Development Kits)**: integram os serviços AWS dentro de aplicações em Python (boto3), JavaScript, Java, Go e outras. Exemplo: uma aplicação web que salva arquivos diretamente em um bucket S3 ou um back-end que consulta dados em tempo real de uma instância EC2.
- **Infraestrutura como Código**: ferramentas como CloudFormation e Terraform descrevem ambientes completos em arquivos de texto, versionados e replicados com segurança.

### Computação

- **Amazon EC2 (Elastic Compute Cloud)**: o serviço mais conhecido. Cria e gerencia máquinas virtuais sob demanda, com controle total do sistema operacional, rede, armazenamento e pacotes instalados. Versátil: aplicações web, APIs, bancos de dados, ambientes de teste e até servidores de jogos.
- **AWS Lambda**: computação serverless para aplicações que exigem escalabilidade instantânea e menos gestão de infraestrutura.
- **Lightsail**: criação rápida de aplicações simples com preço previsível.
- **ECS e EKS**: gerenciamento de containers em escala.
- **Batch**: processamento de workloads pesados de forma distribuída.
- **Elastic Beanstalk**: deploy rápido de aplicações sem se preocupar com a infraestrutura.

### Armazenamento

- **Amazon S3 (Simple Storage Service)**: armazenamento de objetos (imagens, vídeos, documentos, backups, logs) escalável, seguro e com durabilidade de 99,999999999%. Muito usado para hospedar sites estáticos, integrar com aplicações web e armazenar dados analíticos.
- **Amazon EBS (Elastic Block Store)**: armazenamento em bloco, para quando uma instância EC2 precisa de um disco rígido virtual. Volumes persistentes que funcionam como HDs ou SSDs e podem ser anexados às instâncias.
- **Amazon EFS (Elastic File System)**: para quando múltiplas instâncias precisam acessar os mesmos arquivos ao mesmo tempo. Sistema de arquivos distribuído baseado em NFS, com escalabilidade automática e performance balanceada. Ideal para aplicações empresariais, ciência de dados, aprendizado de máquina ou plataformas educacionais com compartilhamento de arquivos em tempo real.

### Banco de dados

Serviços gerenciados que eliminam a necessidade de configurar e manter servidores manualmente:

- **Amazon RDS**: bancos relacionais (MySQL, PostgreSQL, Oracle, SQL Server, MariaDB). Backup automático, failover e escalabilidade vertical. Indicado para sistemas web, ERP e APIs.
- **Amazon DynamoDB**: NoSQL gerenciado, latência em milissegundos e escalabilidade automática. Perfeito para aplicações serverless, jogos, sistemas de recomendação e plataformas com grande volume de acessos simultâneos.
- **Amazon Redshift**: análise de dados em larga escala. Arquitetura em colunas para consultas rápidas e eficientes; ideal para BI, relatórios e integração com Tableau e Power BI.

### Redes

Toda comunicação de rede entre recursos ocorre dentro de uma VPC (Virtual Private Cloud), rede virtual isolada que simula de forma segura uma rede corporativa na nuvem. Ao criar a VPC, define-se um intervalo de IPs privados (por exemplo, 10.0.0.0/16), que pode ser dividido em múltiplas sub-redes (subnets) para separar produção, testes e bancos de dados e controlar acesso à internet e entre serviços.

Sub-redes podem ser públicas ou privadas, conforme tenham ou não acesso direto à internet. Públicas: instâncias acessadas externamente, como servidores web. Privadas: recursos sensíveis, como bancos de dados, back-ends e aplicações que não devem receber tráfego direto da internet.

Para comunicar a VPC com a internet pública: o Internet Gateway (ponte de entrada e saída de dados da VPC) e as tabelas de roteamento (direcionam o tráfego para o destino correto).

(Figura 6: configurar uma VPC com sub-redes privadas e um gateway NAT.)

### Segurança e responsabilidade compartilhada

A AWS coloca a segurança como prioridade desde o primeiro clique, começando pelo IAM: o serviço que controla quem pode acessar o quê na conta. Com ele se criam usuários, grupos e funções com permissões específicas, seguindo o princípio do menor privilégio (cada pessoa ou aplicação só tem acesso ao que realmente precisa).

Modelo de responsabilidade compartilhada:

- **A AWS** cuida da infraestrutura, dos datacenters, servidores, redes e tudo que mantém os serviços funcionando com segurança: a **segurança da nuvem**.
- **O cliente** é responsável pela **segurança na nuvem**: configurar corretamente os serviços, proteger seus dados, controlar o acesso e manter tudo alinhado às normas e boas práticas da organização.

Dependendo do serviço (EC2, S3, RDS ou Lambda), o nível de responsabilidade varia: em alguns o cliente cuida de mais aspectos, em outros a AWS faz boa parte. Mesmo com toda a estrutura da AWS, é o cliente quem define as regras do seu ambiente.

(Figura 7: responsabilidades de segurança AWS.)

### Custos

Modelo pay-as-you-go: paga-se só pelo consumo real (minutos de computação, gigabytes armazenados, requisições de API, tempo de execução de funções). Elimina investimento antecipado em hardware e permite começar com baixo custo inicial, crescendo proporcionalmente à demanda.

Outras modalidades para cenários previsíveis:

- **Instâncias reservadas**: desconto de até 72% em relação ao sob demanda, em troca de compromisso de uso por 1 ou 3 anos.
- **Instâncias spot**: descontos de até 90%; ideais para workloads flexíveis como processamento de dados, testes, renderização e ambientes temporários.
- **Savings Plans**: desconto em troca de um gasto mínimo mensal, com mais flexibilidade que as reservas tradicionais.

Dica: para reduzir custos, monitore o uso e aplique governança: desligue o que não está em uso, limpe volumes e snapshots antigos e use AWS Budgets e Cost Explorer. Em ambientes maiores, tags facilitam o controle por equipe, projeto ou cliente, com relatórios mais precisos.

### Carreira e certificações

Com o aumento da adoção da nuvem cresce a demanda por profissionais capacitados em AWS. Certificações validam conhecimento técnico e aumentam a visibilidade em processos seletivos. Há trilhas para diferentes níveis e perfis, começando pela Cloud Practitioner até especializações avançadas; estudar para as provas consolida o conhecimento prático de forma estruturada.

(Figura 8: AWS Certification.)

### AWS Well-Architected Framework e Free Tier

Para projetar arquitetura eficiente e segura é preciso visão estruturada e colaboração da equipe técnica. Os seis pilares do AWS Well-Architected Framework guiam as decisões segundo as melhores práticas da AWS (detalhados nas próximas aulas). O framework ajuda arquitetos e desenvolvedores a construir soluções seguras, resilientes, eficientes, de alto desempenho e sustentáveis, e a avaliar e evoluir arquiteturas de forma sistemática. Conta com guias específicos por domínio e laboratórios práticos.

A AWS oferece um plano gratuito (Free Tier), com acesso por 12 meses a diversos serviços como EC2, S3, RDS e Lambda, para criar, testar e aprender sem custo. Errar faz parte do aprendizado: a nuvem permite testar, escalar, destruir e refazer ambientes rapidamente. As videoaulas mostram o uso do console na prática.

### Mercado, cases e tendências

A computação em nuvem é a fundação da transformação digital de inúmeras empresas. Há demanda crescente por profissionais capazes de navegar no console da AWS, configurar serviços e garantir a segurança de ambientes em nuvem. Arquiteto(a) de nuvem, engenheiro(a) DevOps e desenvolvedor(a) com experiência em AWS estão entre as carreiras mais promissoras e bem remuneradas.

**Case Netflix**: antes de virar gigante global do streaming, dependia de data centers próprios incapazes de acompanhar seu crescimento explosivo. A migração para a AWS resolveu a dor de escalabilidade: agilidade para adicionar milhares de servidores virtuais sob demanda e suportar picos globais de audiência, como o lançamento de uma série de sucesso. A mudança aumentou a resiliência (distribuição por múltiplas regiões para evitar falhas) e otimizou custos ao trocar investimento fixo em hardware por pagamento por uso. Hoje toda a experiência, da recomendação de conteúdo ao play do vídeo, roda sobre a infraestrutura da AWS.

**Tendências**:

- Inteligência Artificial e Machine Learning cada vez mais integrados aos serviços da AWS, permitindo que empresas de qualquer tamanho criem aplicações inteligentes com menos esforço.
- Computação sem servidor (Serverless), exemplificada pelo AWS Lambda: o desenvolvedor foca apenas no código, abstraindo a gestão da infraestrutura.
- Estratégias multi-cloud (múltiplos provedores de nuvem).
- Sustentabilidade e eficiência energética dos data centers.

### O que você viu nesta aula

Computação em nuvem é habilidade indispensável. A AWS, líder global, oferece plataforma robusta, segura e escalável para construir aplicações modernas, operar infraestrutura global e acelerar a transformação digital. Foram vistos os fundamentos da AWS, como ela organiza seus serviços, possibilidades de computação, armazenamento, redes, segurança e caminhos de carreira. As próximas aulas aprofundam cada categoria de serviço.

### Referências

- ALMENARA, I. O que é AWS, a plataforma na nuvem do grupo Amazon. 2021. Disponível em: https://canaltech.com.br/internet/o-que-e-aws-205226/. Acesso em: 18 jun. 2025.
- AMAZON. O que é a AWS? 2023. Disponível em: https://aws.amazon.com/pt/what-is-aws/. Acesso em: 18 jun. 2025.
- AWS. Guia de boas práticas da AWS. 2023. Disponível em: https://docs.aws.amazon.com/wellarchitected/latest/framework. Acesso em: 18 jun. 2025.
- AWS. O que é a AWS? Amazon Web Services. 2025. Disponível em: https://aws.amazon.com/pt/what-is-aws/. Acesso em: 18 jun. 2025.
- DIO. Amazon Web Services (AWS): explorando a nuvem com flexibilidade e escalabilidade. 2023. Disponível em: https://www.dio.me/articles/amazon-web-services-aws-explorando-a-nuvem-com-flexibilidade-e-escalabilidade. Acesso em: 18 jun. 2025.

Palavras-chave: AWS. Arquitetura Cloud. Nuvem.

## Etapa 02: Políticas e acessos com IAM

### O que vem por aí

Depois dos primeiros passos com a AWS, o tema agora é segurança: boas práticas para proteger ambientes na nuvem com o IAM (Identity and Access Management). Exemplos práticos e dicas para controlar acessos de forma segura e eficiente. De nada adianta um sistema robusto se as permissões estiverem mal configuradas: segurança não é complemento, é parte integrante de todo o ciclo de vida na nuvem.

### Hands on

Configurar usuários, grupos, políticas e roles no IAM. Montar uma estrutura básica de controle de acesso, simular permissões com políticas gerenciadas e personalizadas e aplicar boas práticas como ativação de MFA e uso de roles para serviços. Tudo passo a passo pelo Console da AWS, usando o plano gratuito.

### Por que IAM

Segurança é um dos pilares mais importantes de qualquer arquitetura em nuvem e começa pelo controle de quem pode acessar o quê. O IAM permite criar usuários, definir permissões, organizar acessos por grupo e atribuir funções a serviços automatizados, de forma centralizada e auditável.

O modelo de segurança da AWS se baseia no princípio do menor privilégio: nenhuma identidade (usuário humano ou serviço) deve ter mais permissões do que realmente precisa. Isso reduz o risco de acessos indevidos e protege dados sensíveis, especialmente com múltiplas equipes, aplicações e contas interligadas. Elementos estudados: usuários, grupos, políticas, roles e permissões.

### Identity and Access Management (IAM)

(Figura 1: como o IAM funciona.)

O IAM centraliza o controle de identidade e autorização: define quem pode acessar recursos e o que essas identidades podem fazer. É uma camada de segurança universal aplicada a todos os serviços AWS (S3, EC2, RDS, Lambda), sem exceção.

Ao criar uma conta, existe apenas o usuário root, com acesso irrestrito. Seu uso contínuo é altamente desencorajado. O ideal é criar usuários IAM individuais, cada um com permissões específicas e rastreáveis, organizados em grupos com políticas associadas.

O IAM funciona com políticas em JSON que definem ações (como `s3:PutObject`), recursos (`arn:aws:s3:::meu-bucket/*`) e condições (IPs permitidos, horários ou MFA ativado). As políticas são aplicadas a usuários, grupos ou roles (identidades sem login humano, usadas por serviços automatizados como EC2 ou Lambda). O IAM processa as políticas em tempo real, autorizando ou negando cada solicitação.

Exemplo com as configurações mencionadas (Código-fonte 1):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PutObjectWithConditions",
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::meu-bucket/*",
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "203.0.113.0/24"
        },
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        },
        "DateGreaterThan": {
          "aws:CurrentTime": "2025-05-13T13:00:00Z"
        },
        "DateLessThan": {
          "aws:CurrentTime": "2025-05-13T21:00:00Z"
        }
      }
    }
  ]
}
```

### Usuários

Representam identidades individuais que acessam a AWS de forma interativa: desenvolvedores, administradores, analistas de dados, equipe de segurança. Cada usuário pode ter nome, senha, autenticação multifator (MFA) e credenciais de acesso programático (chaves de acesso). Crie um usuário IAM separado por pessoa; nunca compartilhe o root ou contas genéricas, pois isso dificulta a auditoria e aumenta os riscos.

### Grupos

Um grupo atribui uma ou mais políticas a vários usuários de uma vez. Exemplo: grupo "DevOps" com acesso total a EC2 e S3; grupo "Financeiro" com acesso só ao painel de custos (Billing Dashboard). Se alguém é promovido, basta incluí-lo no grupo adequado; se as responsabilidades mudam, remove-se dos grupos antigos e adiciona-se aos novos, sem editar políticas. Evita retrabalho e garante consistência.

Boas práticas: nomear usuários de forma padronizada (joao.dev, ana.analista) quando não há integração com SAML ou LDAP; MFA obrigatório para todo acesso à console; menor privilégio desde o início; revisar acessos periodicamente e remover usuários inativos (reduz a superfície de ataque e garante conformidade).

Características dos grupos no IAM:

- Um grupo pode conter múltiplos usuários e um usuário pode pertencer a vários grupos simultaneamente.
- Grupos não podem conter outros grupos (sem grupos aninhados), apenas usuários.
- Não existe grupo padrão com todos os usuários automaticamente; é preciso criar e adicionar os usuários manualmente.
- Há limites para a quantidade de grupos e de grupos por usuário em uma conta. Consulte as cotas do IAM e do AWS STS.

(Figura 2: grupo de usuários IAM.)

### Políticas IAM

Documentos JSON que definem o que uma identidade (usuário, grupo ou role) pode fazer. Funcionam como regras que autorizam ou negam ações em serviços. Cada política tem uma ou mais declarações (statements) com ação (Action), recurso (Resource) e, opcionalmente, condição (Condition).

**Statement (Declaração)**: cada declaração representa uma regra de permissão: o que é permitido ou negado, quem está envolvido e em quais condições. Estrutura básica:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::meu-bucket/*"
    }
  ]
}
```

**Effect (Efeito)**: `Allow` concede permissão para a ação; `Deny` bloqueia explicitamente, mesmo que outras políticas permitam. Exemplo: `"Effect": "Deny"`. Útil para negar acesso a um recurso específico mesmo que o usuário esteja em um grupo com acesso geral.

**Action (Ação)**: operações permitidas, no formato `serviço:ação`, como `s3:PutObject` (enviar objeto para um bucket S3), `ec2:StartInstances` (iniciar instância EC2) ou `dynamodb:GetItem` (buscar item no DynamoDB). `"*"` é curinga para todas as ações. Exemplo:

```json
"Action": [
  "s3:GetObject",
  "s3:PutObject"
]
```

**Resource (Recurso)**: sobre qual recurso a ação pode ser executada, especificado por um ARN (Amazon Resource Name), identificador único de recursos na AWS. Formato comum: `arn:aws:s3:::nome-do-bucket/*`. Exemplo: `"Resource": "arn:aws:s3:::meu-bucket/*"`. `"*"` aplica a qualquer recurso, mas deve ser usado com cuidado.

**Condition (Condição), opcional**: impõe restrições adicionais com base em endereço IP (`aws:SourceIp`), horário (`aws:CurrentTime`), MFA (`aws:MultiFactorAuthPresent`) ou prefixo de objetos em bucket S3 (`s3:prefix`). Exemplo, só permitir envio a partir de um IP:

```json
"Condition": {
  "IpAddress": {
    "aws:SourceIp": "203.0.113.0/24"
  }
}
```

Uma política pode permitir que um usuário envie arquivos a um bucket (`s3:PutObject`) ou proibir que ele delete uma instância EC2 (`ec2:TerminateInstances`). Há políticas gerenciadas pela AWS (como `AmazonS3FullAccess`) e personalizadas. Negação explícita (`Effect: Deny`) sempre prevalece sobre `Allow`. Exemplo de política personalizada que permite leitura de arquivos em um bucket específico:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::meu-bucket/*"
  }]
}
```

### Roles (funções)

Diferente dos usuários IAM (usados por pessoas), roles são identidades assumidas por serviços, aplicações ou contas externas. Essenciais quando uma instância EC2, uma função Lambda, um cluster ECS ou um pipeline de CI/CD precisa interagir com outros serviços (ler arquivos do S3, gravar logs no CloudWatch) sem expor credenciais.

A role funciona como identidade temporária: o serviço assume a role, herda suas permissões, executa a ação e libera a sessão. Evita chaves de acesso gravadas em código, uma das falhas mais comuns. Ao configurar uma role define-se quem pode assumi-la (Trust Policy) e quais ações ela pode realizar (Permission Policy).

Exemplo: a role `EC2S3AccessRole` permite leitura em um bucket S3. Associada a uma instância EC2, qualquer script ou aplicação na instância acessa o S3 com segurança, sem autenticação manual. Também é possível permitir que a conta de outra empresa assuma uma role para acessar um recurso seu, com controle total, rastreabilidade e revogação imediata.

(Figura 3: IAM explicado com uma analogia, FreeCodeCamp.)

### Políticas gerenciadas vs personalizadas

- **Gerenciadas pela AWS**: modelos prontos mantidos pela AWS para permissões comuns, como acesso completo ao S3 (`AmazonS3FullAccess`), leitura de logs no CloudWatch (`CloudWatchReadOnlyAccess`) ou administração de EC2. Ideais para começar rápido ou quando a permissão é genérica e bem definida. Não são editáveis.
- **Personalizadas (Customer Managed Policies)**: criadas por você, com máximo controle. Recomendadas para restringir acesso a recursos específicos (um único bucket S3, um banco RDS específico) ou limitar por horários, IPs ou condições. Podem ser versionadas, ajustadas e aplicadas a múltiplas identidades.

Boa prática: começar com gerenciadas enquanto estrutura o ambiente e migrar para personalizadas conforme os requisitos de segurança amadurecem. Manter um repositório versionado das políticas personalizadas ajuda governança e rastreabilidade.

(Figura 4: comparação de políticas de acesso.)

### Interpretar e testar políticas

Ler o padrão Effect / Action / Resource / Condition permite analisar qualquer política. No Console IAM, o editor de políticas tem validação automática e há o "Simulador de Políticas", para testar cenários de acesso antes de aplicar (por exemplo, se um usuário realmente pode acessar um bucket S3 ou iniciar uma instância EC2). Essencial em ambientes restritos, onde um erro de permissão pode interromper serviços ou abrir brechas.

Exemplo e interpretação:

```json
{
  "Effect": "Allow",
  "Action": ["ec2:DescribeInstances"],
  "Resource": "*"
}
```

Permite visualizar instâncias EC2, sem criar ou alterar. `Resource: "*"` aplica a todos os recursos EC2, aceitável por ser apenas leitura. Para limitar a uma instância específica, troca-se o `*` por um ARN detalhado.

### Boas práticas em ambientes reais

- Evitar o usuário root em atividades rotineiras; protegê-lo com MFA e usá-lo só para tarefas administrativas críticas (alterar configurações da conta, recuperar acessos).
- Aplicar o menor privilégio desde o início: limita impacto de acessos indevidos, previne erros operacionais e reduz o alcance de um comprometimento.
- Usar tags para categorizar recursos e aplicar políticas baseadas em contexto.
- MFA obrigatório para todos os usuários com acesso à console.
- Revisar permissões regularmente e ter processo claro de entrada e saída de colaboradores.
- IAM Access Analyzer para detectar acessos públicos ou permissões excessivas.
- Em grandes ambientes, contas separadas para produção, homologação e desenvolvimento, com AWS Organizations centralizando políticas, billing e auditoria.

### Integração, Access Analyzer e CloudTrail

O IAM é integrado nativamente a todos os serviços AWS: qualquer leitura, escrita, exclusão ou configuração de recursos só ocorre se o IAM autorizar, seja via console, API ou CLI.

Permissões tendem a ficar mal configuradas com o tempo. O **IAM Access Analyzer** analisa automaticamente as políticas e identifica recursos acessíveis publicamente ou expostos a contas externas. Responde perguntas como "Este bucket S3 pode ser acessado por alguém fora da minha organização?" ou "Esta role pode ser assumida por qualquer um?". Funciona de forma contínua, mostra qual política permite o acesso, para quem e como, sem auditar milhares de linhas de JSON manualmente. Muito útil em ambientes grandes ou multi-conta.

O **CloudTrail** é o serviço de auditoria que grava todas as ações na conta (criação de instâncias, leitura de arquivos, exclusão de recursos, alterações de permissões e mais): quem fez o quê, quando e de onde.

### Governança multi-conta com AWS Organizations

Com o crescimento, múltiplas contas se tornam inevitáveis: separação por time, projeto ou finalidade (produção, desenvolvimento, segurança, dados etc.). O AWS Organizations centraliza o controle de múltiplas contas de forma hierárquica, padronizando políticas e consolidando a cobrança.

**Service Control Policies (SCPs)** funcionam como limites máximos de permissões. Mesmo que um usuário tenha política permitindo criar instâncias EC2, se a SCP bloquear esse serviço na organização, o acesso é negado. O time de segurança define políticas globais para todas as contas, garantindo uniformidade.

Organizations combinado com IAM e AWS SSO (Single Sign-On) permite identidade centralizada, diretórios corporativos, autenticação federada (Google, AD, Okta) e login unificado.

(Figura 5: AWS Organizations.)

O IAM é o coração da segurança na AWS: do upload de um arquivo à criação de uma instância, tudo passa por validação de permissões via IAM. As próximas aulas tratam de redes, EC2 e banco de dados, e esta base de segurança se aplica a todos eles.

### Mercado, cases e tendências

Com a migração para a nuvem, segurança vira pilar central. Dominar o IAM é uma das competências mais críticas e valorizadas: configurar políticas, gerenciar usuários, grupos e roles de maneira granular previne acessos não autorizados e protege dados sensíveis. A demanda por especialistas em Cloud Security cresce exponencialmente, e implementar o menor privilégio é um diferencial de carreira.

**Case Capital One (2019)**: violação de dados significativa em que uma ex-funcionária da AWS explorou uma credencial de acesso mal configurada em um firewall de aplicação web (WAF). A credencial tinha permissões excessivas, permitindo listar e copiar dados sensíveis de mais de 100 milhões de clientes armazenados em buckets do Amazon S3. A falha não estava na segurança da AWS, mas na má configuração das políticas IAM pela Capital One. O incidente reforçou que a configuração de acessos é responsabilidade do cliente (Shared Responsibility Model) e que uma política IAM fraca pode ser a porta de entrada para desastres.

**Tendências**:

- Zero Trust (Confiança Zero): abandona a ideia de perímetro seguro e trata toda solicitação de acesso como potencialmente hostil, exigindo verificação rigorosa sempre.
- CIEM (Cloud Infrastructure Entitlement Management): ferramentas que analisam e visualizam as "permissões efetivas" de uma identidade, muitas vezes complexas e sobrepostas.
- IA e Machine Learning, com serviços como o Amazon GuardDuty, para detectar automaticamente comportamentos anômalos em contas e identidades e identificar ameaças em tempo real.

### O que você viu nesta aula

Estruturar usuários e grupos, criar políticas personalizadas e usar roles com segurança para integrar serviços. Ferramentas como Access Analyzer e sua integração com outros serviços para visibilidade e segurança. Boas práticas de gestão de acesso e o uso de múltiplas contas com AWS Organizations como base estruturada, escalável e auditável.

### Referências

- AWS. Computação em nuvem com a AWS. 2023. Disponível em: https://aws.amazon.com/pt/what-is-aws/. Acesso em: 18 jun. 2025.
- AWS. Guia de boas práticas da AWS. 2023. Disponível em: https://docs.aws.amazon.com/wellarchitected/latest/framework. Acesso em: 18 jun. 2025.
- AWS. IAM policy types: How and when to use them. 2022. Disponível em: https://aws.amazon.com/pt/blogs/security/iam-policy-types-how-and-when-to-use-them/. Acesso em: 18 jun. 2025.
- DIO. Amazon Web Services (AWS): explorando a nuvem com flexibilidade e escalabilidade. 2023. Disponível em: https://www.dio.me/articles/amazon-web-services-aws-explorando-a-nuvem-com-flexibilidade-e-escalabilidade. Acesso em: 18 jun. 2025.

Palavras-chave: Segurança. IAM. AWS.

## Etapa 03: Redes com VPC

### O que vem por aí

Fundamentos para construir e organizar redes na AWS: VPCs, sub-redes públicas e privadas, tabelas de roteamento, NAT e Internet Gateways. Conceitos de segurança com Security Groups e NACLs, conexões privadas com serviços da AWS via Endpoints e como conectar múltiplas VPCs ou integrar com redes locais usando Peering, Transit Gateway, VPN e Direct Connect.

### Hands on

Criar uma VPC personalizada, configurar sub-redes públicas e privadas, associar tabelas de rotas e implantar recursos como IGW, NAT Gateway e VPC endpoints. Ao final, estar pronto para aplicações reais com segurança, organização e conectividade planejada.

### Da rede on-premises para a VPC

Antes da nuvem, montar uma rede significava comprar switches, configurar roteadores físicos, distribuir cabos, reservar IPs e lidar com salas cheias de servidores; como montar o esqueleto de um prédio, com planejamento preciso. Exigia investimento, tempo e operação complexa, além de profissionais especializados sempre atualizados: a cada nova tecnologia ou atualização de firmware, atualizar equipamento por equipamento e torcer para não haver problema em produção. Mais o custo de reciclar hardware velho, lidar com falhas físicas e manter tudo 24 por 7.

Com a VPC (Virtual Private Cloud) recria-se toda essa estrutura com alguns cliques, na nuvem: isolada, segura e personalizável. Você define blocos de IP, cria sub-redes, escolhe o que vai para a internet e configura firewalls e roteamento. A VPC é o primeiro passo de qualquer arquitetura bem construída na AWS.

A aplicação precisa de conectividade para falar entre serviços internos ou atender usuários externos. Como em redes físicas, a VPC define onde os recursos "se conectam" e como se integram ao resto da infraestrutura e à internet. É como um data center privado dentro da AWS: intervalos de IP, sub-redes, firewalls, rotas e até conexão com redes locais via VPN. Cada conta AWS vem com uma VPC padrão, mas é possível (e recomendado) criar VPCs próprias por projeto.

Dica: evite usar a VPC default em projetos sérios ou ambientes profissionais. Crie VPCs próprias separadas por ambiente, como `vpc-homolog`, `vpc-producao`, `vpc-dev`, para ter controle total sobre IPs, sub-redes, rotas e segurança e evitar surpresas quando o projeto crescer.

A gestão de rede é um dos pontos mais críticos para segurança, desempenho e escalabilidade. Um erro de configuração pode expor um banco de dados à internet ou impedir a comunicação entre sistemas.

(Figura 1: diagrama de rede VPC com três sub-redes em três zonas de disponibilidade.)

### Endereçamento IP e CIDR

Ao criar a VPC, define-se um bloco de IPs privados para todos os recursos, em notação CIDR (Classless Inter-Domain Routing). Exemplo: uma VPC 10.0.0.0/16 comporta até 65.536 endereços IP privados.

- O CIDR não pode ser alterado depois da criação da VPC.
- Evite conflitos com redes internas existentes da empresa (especialmente com VPN ou Direct Connect).
- Reserve espaço para crescimento: 10.0.0.0/16, 172.16.0.0/16 ou 192.168.0.0/16 são boas escolhas.
- A AWS permite VPCs com blocos de /28 a /16.

O bloco principal é dividido em sub-redes menores, como 10.0.1.0/24, 10.0.2.0/24 e assim por diante, cada uma com uma finalidade (separar bancos de dados de servidores web, produção de desenvolvimento). Planejar bem evita retrabalho e organiza segurança e roteamento.

A VPC padrão já vem com uma sub-rede em cada Zona de Disponibilidade da região, todas públicas (com Internet Gateway e "auto-atribuir IP público" ativado), de modo que qualquer instância lançada ali já fala com o mundo. Cada instância recebe IP privado e IP público. É pensada para testes e protótipos; para projetos sérios, crie VPCs próprias por ambiente.

Curiosidade: nomes de zonas como `us-east-1a`, `us-east-1b` podem representar locais físicos diferentes para cada conta; duas contas podem ter `us-east-1a` apontando para datacenters distintos.

Por padrão, até 5 VPCs por região (limite aumentável via solicitação). Na VPC personalizada há controle total: blocos de IP, sub-redes públicas ou privadas, tabelas de roteamento, gateways de internet ou NAT, regras de segurança, garantindo isolamento, performance e segurança.

(Figura 2: blocos CIDR de sub-redes, Amazon VPC.)

### Sub-redes públicas e privadas

- **Públicas**: acesso direto à internet; servidores web, balanceadores de carga e pontos de entrada externos.
- **Privadas**: recursos sensíveis (bancos de dados, sistemas internos, back-ends), não expostos à internet.

Uma sub-rede é pública quando associada a uma tabela de rotas que envia tráfego para um Internet Gateway (IGW), componente que permite às instâncias acessar ou ser acessadas pela internet. Sub-redes privadas não têm essa rota e normalmente usam um NAT Gateway para sair à internet sem aceitar conexões externas.

Exemplo: um servidor web em subnet pública fala com um banco em subnet privada, mas o banco não é acessível diretamente da internet. Protege contra ataques diretos, reduz a superfície de exposição e facilita o controle de acessos. Security Groups e Network ACLs reforçam essa estrutura.

Cada sub-rede é criada em uma única Zona de Disponibilidade e não pode se estender por várias; pertence a um datacenter específico na região. Pode haver múltiplas sub-redes por AZ.

O tipo da sub-rede é determinado pelas rotas:

- Rota para um Internet Gateway: **sub-rede pública**.
- Sem essa rota: **sub-rede privada**.
- Tráfego direcionado a um Virtual Private Gateway (usado com VPN): **sub-rede somente VPN**.
- Nenhuma rota para fora da VPC: **sub-rede isolada**, ideal para dados sensíveis ou recursos que não devem se comunicar externamente.

(Figura 3: diagrama simples de duas redes VPC.)

### Internet Gateway, NAT Gateway e tabelas de rotas

**Internet Gateway (IGW)**: conecta a VPC à internet pública. Para uma instância EC2 ser acessada de fora, ela precisa estar em sub-rede com rota para o IGW e ter IP público ou Elastic IP associado.

**NAT (Network Address Translation)**: permite que dispositivos com IPs privados acessem a internet sem que a internet os acesse diretamente. O **NAT Gateway** dá às instâncias de sub-redes privadas acesso apenas de saída: atualizações de sistema, consultas a APIs, repositórios externos, sem exposição a conexões de entrada. Atua como intermediário, mascarando o IP da instância privada: de dentro para fora tudo flui, de fora para dentro o acesso é bloqueado.

**Tabelas de rotas**: o cérebro da comunicação na VPC; definem para onde cada pacote vai. Toda sub-rede precisa estar associada a uma tabela de rotas ("se o destino do tráfego for tal IP, envie por tal caminho"). Exemplo: tráfego para 0.0.0.0/0 (qualquer endereço da internet) vai para o Internet Gateway em uma sub-rede pública ou para um NAT Gateway em uma sub-rede privada. Uma boa configuração garante que cada parte da aplicação fale só com o que deve, evitando instâncias sem internet ou recursos acidentalmente expostos.

(Figura 4: associação de sub-rede implícita e explícita. O diagrama mostra o roteamento para uma VPC com um gateway da Internet, um gateway privado virtual, uma sub-rede pública e uma sub-rede somente VPN.)

### Security Groups e Network ACLs

A segurança na arquitetura de nuvem deve começar pela rede. Na VPC há duas camadas principais de firewall: Security Groups (SGs) e Network ACLs (NACLs). Ambos controlam tráfego, mas diferem em comportamento, granularidade, estado de conexão e nível de aplicação.

**Security Groups**:

- Firewalls com estado (stateful), aplicados às interfaces de rede das instâncias (EC2, ALBs, Lambdas configuradas em VPC).
- Stateful: ao permitir uma conexão de entrada, a resposta é automaticamente permitida na saída, sem regra explícita.
- Só regras de permissão: nunca se nega tráfego diretamente, apenas define-se o que é aceito. Mais simples e previsível.
- Exemplo: para permitir SSH, cria-se regra de entrada liberando a porta 22 para um IP específico; a resposta de saída é liberada automaticamente.

(Figura 5: diagrama de VPC com Security Group.)

**Network ACLs**:

- Associadas à sub-rede, não às instâncias.
- Sem estado (stateless): toda conexão precisa de regras explícitas de entrada e saída; se a saída correspondente não for permitida, a resposta é bloqueada.
- Avaliadas em ordem crescente de número de regra.
- Regras de permissão e de negação.
- Permitem bloquear tráfego malicioso antes de chegar à instância. Exemplo: identificado um IP malicioso, cria-se regra de negação na NACL da sub-rede e nenhuma instância dela recebe pacotes desse endereço. Útil em arquiteturas maiores, onde o bloqueio deve ser amplo e não instância por instância.

Diagrama de referência: uma VPC com duas sub-redes, cada uma com uma ACL. Quando o tráfego entra na VPC (de uma VPC emparelhada, VPN ou internet), o roteador envia ao destino. A ACL da rede A determina o que pode entrar e sair da sub-rede 1; a ACL da rede B, o que pode entrar e sair da sub-rede 2.

(Figura: diagrama de Network ACLs com Security Group.)

### DNS na VPC e Route 53

Dentro da VPC, a AWS oferece DNS interno para acessar instâncias EC2, RDS e outros serviços por nome, em vez de IP; útil em ambientes dinâmicos com IPs que mudam. Por padrão toda VPC tem DNS habilitado, permitindo acessar uma instância por um nome como `ip-10-0-1-10.ec2.internal`, e resolve automaticamente nomes de serviços AWS (S3, RDS, DynamoDB).

Para múltiplas VPCs ou nomes mais amigáveis, o **Route 53** é o DNS gerenciado e altamente disponível da AWS, com zonas hospedadas públicas e privadas. Em zonas privadas definem-se registros que só funcionam dentro da VPC, como `db.empresa.internal` ou `backend.internal`, evitando IPs fixos. O Route 53 também suporta balanceamento de carga, failover e integração com outros serviços (tema de aulas futuras).

### VPC Peering

Com o crescimento, recursos se distribuem em várias VPCs (segurança, separação de produção e homologação, contas diferentes). O VPC Peering cria conexão direta entre duas VPCs, com tráfego interno como se estivessem na mesma rede. A conexão é ponto a ponto, criptografada e não passa pela internet. O tráfego é bidirecional, mas precisa ser autorizado explicitamente nas rotas e nos Security Groups.

Limitação importante: **não transitividade**. Se A faz peering com B e B com C, A não fala com C através de B; é preciso peering direto entre A e C. Isso torna o peering pouco escalável com muitas VPCs; nesses casos o Transit Gateway é mais apropriado. Para poucas VPCs, o peering continua eficiente e de baixo custo.

Detalhes:

- Conexão ponto a ponto entre duas VPCs.
- Não suporta roteamento transitivo: cada par de VPCs precisa de peering direto.
- Limite: até 125 conexões de peering ativas por VPC.
- Custo: cobra-se apenas a transferência de dados entre VPCs.

### AWS Transit Gateway (TGW)

Roteador centralizado que interconecta milhares de VPCs, VPNs e conexões Direct Connect de forma eficiente e escalável. Arquitetura hub-and-spoke: cada VPC se conecta ao TGW, eliminando múltiplas conexões ponto a ponto. Suporta roteamento transitivo.

Com o TGW é possível:

- Conectar até 5.000 VPCs a um único Transit Gateway.
- Usar tabelas de rotas para controlar o tráfego entre VPCs e redes locais.
- Integrar com o AWS Resource Access Manager (RAM) para compartilhar o TGW entre contas.
- Conectar redes locais via VPN ou AWS Direct Connect.

Ideal para ambientes multi-conta ou multi-região. Resumo: VPC Peering para cenários simples com poucas VPCs; Transit Gateway para arquiteturas complexas com escalabilidade e roteamento transitivo.

(Figura 6: Architecture 3, AWS Transit Gateway.)

### Ambientes híbridos: Site-to-Site VPN e Direct Connect

Pergunta comum: "Professor, e se minha empresa ainda estiver migrando e parte do ambiente continuar no datacenter?". Sim, é possível integrar. Muitas empresas operam em modelo híbrido. Duas opções principais:

- **AWS Site-to-Site VPN**: conexão segura e criptografada entre a rede local e a VPC pela internet, baseada em IPsec, com dois túneis criados automaticamente para alta disponibilidade.
- **AWS Direct Connect**: conexão de rede física dedicada entre o ambiente local e a AWS, sem passar pela internet. Mais rápida, baixa latência, maior estabilidade e alta capacidade de transferência. Ideal para aplicações críticas ou de grande volume (ERP, backups massivos, dados em tempo real).

### VPC Endpoints

Por padrão, o acesso de recursos da VPC a serviços como S3 ou DynamoDB sairia da rede privada pela internet pública. VPC Endpoints permitem comunicação com serviços AWS sem sair da rede da Amazon, com tráfego 100% privado. Dois tipos:

- **Interface Endpoints**: criam uma interface de rede (ENI) privada na sub-rede para serviços baseados em API, como SSM, Secrets Manager ou API Gateway.
- **Gateway Endpoints**: para serviços de armazenamento como S3 e DynamoDB; funcionam como rota especial na tabela de rotas da VPC.

Aumentam a segurança, melhoram a performance e reduzem custos (evitam internet e NAT Gateway), além de permitir políticas específicas de acesso e governança centralizada.

### VPC Flow Logs

Capturam informações detalhadas do tráfego IP que entra e sai das interfaces de rede da VPC, para segurança, detecção de anomalias e troubleshooting. Respondem perguntas como "Essa instância está realmente recebendo tráfego?" ou "Por que o acesso a esse serviço está falhando?". Os logs podem ir para Amazon CloudWatch ou Amazon S3 (análise em tempo real e armazenamento de longo prazo).

### Mercado, cases e tendências

Uma rede bem planejada está no coração de qualquer arquitetura segura e escalável. Dominar sub-redes, tabelas de roteamento, Gateways (NAT e Internet) e a diferença entre Security Groups e NACLs é indispensável. Desenhar topologias complexas, conectar VPCs com Transit Gateway ou integrar on-premises via Direct Connect coloca engenheiros e arquitetos em patamar sênior, com alta demanda e remuneração.

**Case Autodesk** (AutoCAD): precisava consolidar e simplificar a infraestrutura de TI global, composta por múltiplos data centers e redes complexas pelo mundo; a dor era falta de agilidade e alto custo operacional. Na AWS, usou o Transit Gateway como hub central de rede, conectando centenas de VPCs de forma simples e escalável. Eliminou inúmeras conexões ponto a ponto (VPC Peering), reduziu a complexidade de gerenciamento, melhorou a postura de segurança, acelerou a inovação, reduziu drasticamente custos de conectividade e entregou experiência mais rápida e confiável a milhões de usuários.

**Tendências**:

- Automação com Infraestrutura como Código (IaC), usando AWS CloudFormation ou Terraform, como padrão para provisionar e gerenciar VPCs: consistência, reprodutibilidade e fim dos erros manuais.
- Segurança integrada à rede com o AWS Network Firewall, para políticas de filtragem de tráfego centralizadas e escaláveis diretamente na VPC.
- Redes cada vez mais híbridas e distribuídas, com integração transparente entre on-premises e múltiplas nuvens.

### O que você viu nesta aula

Conceitos de VPC e fundamentos de construção e organização de redes na AWS: VPCs personalizadas, sub-redes públicas e privadas, tabelas de roteamento, NAT e Internet Gateways. Segurança com Security Groups e NACLs, conexões privadas via Endpoints e conexão de múltiplas VPCs ou redes locais com Peering, Transit Gateway, VPN e Direct Connect.

### Referências

- AMAZON WEB SERVICES. What is Amazon VPC? 2024. Disponível em: https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. Connect your VPC to remote networks using AWS Virtual Private Network (VPN). 2024. Disponível em: https://docs.aws.amazon.com/vpc/latest/userguide/vpn-connections.html. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. Control subnet traffic with network access control lists. 2024. Disponível em: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. Control traffic to your AWS resources using security groups. 2024. Disponível em: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html. Acesso em: 23 jun. 2025.

Palavras-chave: Segurança. Redes. VPC.

## Etapa 04: Computação com EC2

### O que vem por aí

Conceitos fundamentais do EC2 e prática de criação e configuração de uma instância na nuvem, rumo a uma infraestrutura mais completa e profissional. Introdução de recursos para escalar, automatizar e monitorar instâncias com eficiência.

### Hands on

Criar uma instância EC2 do zero, configurá-la com segurança e executar um pequeno servidor web para validar a operação. Simula o cenário mais comum da nuvem: provisionar uma máquina virtual, instalar um software, expô-la à internet com controle de acesso e validar o funcionamento. Base para estruturas mais complexas nas próximas aulas.

### Contexto: do servidor físico à máquina virtual

Antes era comum adquirir servidores físicos, instalar sistemas operacionais manualmente, configurar redes e manter tudo em datacenters próprios: alto investimento inicial, tempo e equipe especializada para falhas de hardware, segurança física e escalabilidade.

A computação em nuvem trouxe recursos computacionais sob demanda, sem comprar ou manter servidores físicos. Reduziu drasticamente o tempo de provisionamento e aumentou a flexibilidade, com escala automática e eficiente. A arquitetura se baseia em virtualização, elasticidade e automação: em vez de comprar um servidor físico, aloca-se uma "máquina virtual" criada em minutos com toda a configuração necessária.

O Amazon EC2 é a camada de computação da AWS. Fornece instâncias virtuais (VMs) com diversas configurações, acessíveis via API, console ou automações. Elas podem rodar diferentes sistemas operacionais, receber volumes de armazenamento, ser protegidas por grupos de segurança e pertencer a VPCs. Atende desde aplicações simples até sistemas de missão crítica com alta disponibilidade.

### Tipos e famílias de instâncias

Ampla variedade de tipos, cada um otimizado para um tipo de carga, escolhidos com base em CPU, memória, armazenamento e rede.

(Figura 1: guia de tipos de instâncias do Amazon EC2.)

Famílias:

- **t**: uso geral.
- **m**: equilíbrio entre recursos.
- **c**: otimizadas para computação.
- **r**: cargas com muita memória.
- **g**: GPU para machine learning e gráficos.
- **i, d, h** e outras especializadas: armazenamento intensivo ou cargas específicas.

Cada tipo tem tamanhos diferentes, como `t3.micro`, `c5.large` ou `r6a.2xlarge`.

(Figura 2: tipos de instâncias do Amazon EC2.)

### Instâncias burstable (família T) e créditos de CPU

Instâncias da família T (como `t3.micro` ou `t4g.small`) são burstable: ideais para workloads com uso leve de CPU na maior parte do tempo, mas com picos ocasionais.

Funcionamento dos créditos:

- A cada hora a instância ganha uma quantidade fixa de créditos (por exemplo, 6 créditos/hora para `t3.micro`).
- Cada crédito permite 1 minuto de uso de CPU a 100%.
- Se a CPU não é usada totalmente, os créditos são armazenados para uso futuro (até um limite).
- Quando os créditos acabam e a carga continua alta, a performance é limitada, exceto em modo **unlimited**.

(Figura 3: créditos AWS T2/T3.)

Exemplo: uma `t3.micro` com um pequeno site institucional tem baixo uso de CPU e acumula créditos ao longo do dia. Num pico de acesso ou tarefa mais pesada, usa os créditos para responder rápido, sem pagar por uma instância mais cara.

O EC2 combina instâncias com volumes EBS (Elastic Block Store), Elastic IPs e Auto Scaling Groups, criando ambientes robustos, resilientes e com escala automática.

### Elasticidade e Auto Scaling

Elasticidade: adaptar recursos computacionais à necessidade da aplicação. No EC2 inicia-se e encerra-se instâncias a qualquer momento, com arquitetura ajustada automaticamente ao uso real.

O serviço de **Auto Scaling** define regras para iniciar ou terminar instâncias EC2 automaticamente, considerando parâmetros como uso de CPU, quantidade de requisições em uma fila ou métricas personalizadas do Amazon CloudWatch.

Exemplo: uma aplicação web com muitos acessos no horário comercial e poucos à noite. Com Auto Scaling, o EC2 sobe automaticamente de 2 para 6 instâncias no pico e volta ao mínimo em baixa demanda, reduzindo custos e melhorando a experiência.

Auto Scaling em conjunto com o **Elastic Load Balancer (ELB)**, que distribui o tráfego entre as instâncias ativas, garante alta disponibilidade e balanceamento inteligente mesmo durante falhas ou picos.

Dois modos principais de Auto Scaling:

- **Escalonamento dinâmico**: reage a eventos em tempo real (como CPU acima de 80%).
- **Escalonamento programado**: segue uma agenda, como iniciar mais instâncias às 8h e encerrar às 20h.

(Figura 4: Auto Scaling Group AWS.)

### Ciclo de vida da instância

- **running**: iniciada e ativa.
- **stopped**: parada temporariamente, mantendo o disco e o IP elástico.
- **terminated**: encerrada totalmente, liberando os recursos alocados e apagando dados armazenados.

Durante o ciclo, instâncias podem ser monitoradas, reiniciadas, reconfiguradas ou migradas para outro tipo com poucos comandos ou pela interface gráfica, o que torna o EC2 poderoso para ambientes replicáveis e resilientes.

### Amazon Machine Image (AMI)

Imagem pré-configurada com tudo para iniciar uma instância: sistema operacional, aplicações, bibliotecas e configurações de segurança (e também discos, configurações de rede, permissões e softwares pré-instalados). Ao iniciar uma instância, a AWS usa uma AMI como base.

AMIs permitem lançar instâncias de forma rápida e padronizada, garantindo consistência em produção. Com Auto Scaling, cada nova instância criada é idêntica às anteriores, evitando variações inesperadas.

- AMIs públicas da AWS com Amazon Linux, Ubuntu, Red Hat, Windows Server, entre outros.
- AMIs de fornecedores de software e da comunidade, gratuitas ou licenciadas conforme conteúdo e suporte.
- **AMIs personalizadas**: capturar uma instância depois de configurar o ambiente, instalar aplicações e ajustar rede e segurança, salvando tudo como um "snapshot" reutilizável. Replicação consistente e rápida de ambientes.
- Úteis para DevOps: versionamento de ambientes, criação rápida de instâncias para novos membros ou testes, integração com pipelines de CI/CD.
- Podem ser compartilhadas com outras contas AWS (mesma organização ou parceiros externos), padronizando ambientes entre equipes, regiões ou clientes.

### Armazenamento: EBS e volumes efêmeros

Com as instâncias padronizadas, o passo seguinte é o armazenamento: persistente (EBS) ou temporário (volumes efêmeros).

(Figura 5: Amazon Elastic Block Store.)

O **Amazon EBS** é o armazenamento em bloco gerenciado e persistente da AWS, entregando blocos de dados diretamente ao sistema operacional da instância. Funciona como um "HD virtual" que pode ser anexado, destacado, redimensionado ou replicado em zonas de disponibilidade. Os volumes continuam existindo mesmo que a instância seja desligada ou encerrada, ideal para sistemas operacionais, bancos de dados, arquivos e logs.

Tipos de volume:

- **gp3**: uso geral.
- **io1/io2**: alto desempenho para IOPS.
- **sc1/st1**: grandes volumes de dados com acesso sequencial.

A escolha depende do padrão de acesso: um banco relacional se beneficia de io2; um servidor web simples funciona bem com gp3.

Uma instância pode usar múltiplos volumes EBS (secundários para dados, logs ou backups). Volumes podem ser criptografados, ter snapshots automáticos e ser migrados entre instâncias. Tipo e tamanho são escolhidos na criação da instância e impactam diretamente durabilidade e performance.

### Segurança: security groups e pares de chaves

Grupos de segurança (security groups) funcionam como firewalls virtuais controlando tráfego de entrada e saída das instâncias, com regras por protocolo (TCP, UDP, ICMP), faixa de IPs e portas. Regra comum: permitir SSH (porta 22) apenas de um IP específico ou HTTP (porta 80) de qualquer lugar.

Na criação da instância, a AWS associa uma chave pública ao sistema operacional; o usuário precisa da chave privada (`.pem`) correspondente para autenticar remotamente, sem senhas. Guarde a chave privada com cuidado: se for perdida, não há como recuperar o acesso, sendo necessário criar outra instância ou usar um snapshot. Use chaves diferentes por ambiente (produção, homologação, desenvolvimento). No Windows, o acesso é via Remote Desktop (RDP) e a chave privada decodifica a senha de administrador fornecida pela AWS.

(Figura 6: arquitetura EC2.)

Boas práticas: mínimo de portas abertas, limitar acesso por IP ou VPC específica, evitar chaves genéricas compartilhadas e usar roles IAM em vez de credenciais em arquivos. Isso mantém o EC2 seguro e compatível com padrões como ISO, PCI-DSS e LGPD.

### Custos e modelos de preço

Custos dependem de tipo de instância, região, sistema operacional, volume de armazenamento e tempo de uso.

(Figura 7: custos com EC2.)

- **Sob demanda (On-Demand)**: paga-se por hora (ou segundo, em alguns tipos), sem compromisso. Maior custo por hora.
- **Instâncias reservadas (Reserved Instances)**: compromisso de 1 ou 3 anos com desconto que pode chegar a 70%. Pagamento adiantado, parcial ou sem pagamento inicial.
- **Instâncias spot**: capacidade ociosa da AWS com descontos de até 90%. Para cargas tolerantes a interrupção (processamento em lote, renderização de vídeo, simulações). A AWS pode encerrar a instância spot a qualquer momento com dois minutos de aviso; não recomendadas para cargas críticas.
- **Savings Plans**: compromisso com um valor/hora de uso EC2 por 1 ou 3 anos, com flexibilidade para variar tipos e tamanhos de instância.

Otimização: usar burstable (T3/T4g) em baixa demanda, parar instâncias sem uso, Auto Scaling para ajustar dinamicamente, monitorar com AWS Cost Explorer e CloudWatch, e revisar volumes EBS associados, que continuam gerando custo mesmo com a instância parada.

### Conectividade e Elastic IP

Uma instância pode ser acessada via IP público ou privado. Por padrão, em sub-rede pública, recebe um IP público dinâmico ao iniciar, que muda se a instância for parada e reiniciada.

**Elastic IP (EIP)**: endereço público fixo associável a qualquer instância EC2 da conta. Útil para APIs, serviços web ou bancos com acesso externo que precisam de endereço estável. Diferencial: portabilidade; se uma instância falhar, associa-se rapidamente o mesmo IP a uma nova instância, garantindo continuidade. Gratuito quando associado a uma instância em execução, mas cobrado se estiver alocado e não associado (evita desperdício de endereços públicos).

(Figura 8: Elastic IP.)

Para acesso direto da internet, a instância precisa estar em sub-rede pública, com Internet Gateway configurado e security group permitindo o tráfego. Para instâncias em sub-redes privadas, o acesso externo ocorre via NAT Gateway, e o Elastic IP pode estar associado ao NAT para rotear esse tráfego.

Boas práticas: restringir acesso aos Elastic IPs por firewall, autenticação por chave, não expor portas desnecessárias e, sempre que possível, colocar serviços sensíveis atrás de um Load Balancer ou API Gateway.

### Segurança operacional, backup e monitoramento

- **Privilégio mínimo** via IAM Roles nas instâncias, evitando credenciais embutidas em código.
- **Security Groups e Network ACLs**: acesso remoto (SSH ou RDP) só de IPs específicos e sempre com autenticação por chave.
- **Snapshots regulares** dos volumes EBS, especialmente o root, agendados com políticas no AWS Backup ou por scripts com AWS CLI.
- **Amazon CloudWatch**: métricas de CPU, disco e rede e alarmes quando uma instância está sobrecarregada ou inativa, permitindo decisões automatizadas como acionar Auto Scaling ou reiniciar uma instância problemática.
- **CloudWatch Logs**: envio de logs de sistema, de aplicação e eventos de segurança para armazenamento centralizado, ajudando no diagnóstico e em auditoria e conformidade.

### Mercado, cases e tendências

O EC2 é um dos serviços mais fundamentais da AWS e seu domínio é requisito indispensável. São valorizados profissionais que sabem escolher a família correta (uso geral, computação ou memória), configurar Auto Scaling para picos, distribuir tráfego com Elastic Load Balancers, gerenciar o ciclo de vida das VMs, otimizar custos com Spot ou Savings Plans e garantir segurança.

**Case Airbnb**: na expansão global, demanda extremamente variável, com picos em feriados e férias e períodos de menor atividade. Infraestrutura própria dimensionada para o pico seria cara e ineficiente; a dor era custo e falta de agilidade. Na AWS, adotou EC2 com Auto Scaling, ajustando automaticamente o número de instâncias à demanda: nos picos, novas instâncias em minutos; na calmaria, desligadas para economizar. Isso permitiu crescer de forma sustentável, pagando só pela capacidade usada, com alta disponibilidade para milhões de anfitriões e hóspedes.

**Tendências**:

- Processadores Graviton (baseados em ARM), desenvolvidos pela AWS, com performance por custo significativamente melhor para muitas cargas.
- Explosão de instâncias especializadas para IA e Machine Learning, acelerando o treinamento de modelos complexos.
- Orquestração de contêineres com Amazon EKS (Kubernetes) e ECS, rodando sobre instâncias EC2, como padrão para microsserviços modernos, com mais portabilidade e eficiência.

### O que você viu nesta aula

Computação em nuvem com foco no EC2, entre teoria e prática, para criar, configurar e gerenciar instâncias de forma segura, escalável e eficiente: o que é uma instância, tipos disponíveis, Elastic IP, Auto Scaling, armazenamento EBS, criação de AMIs, custos e boas práticas.

### Referências

- AMAZON WEB SERVICES. Comece a usar o Amazon EC2. 2024. Disponível em: https://docs.aws.amazon.com/pt_br/AWSEC2/latest/UserGuide/EC2_GetStarted.html. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. Exemplos de modo ilimitado de instâncias com capacidade de expansão. 2024. Disponível em: https://docs.aws.amazon.com/pt_br/AWSEC2/latest/UserGuide/unlimited-mode-examples.html. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. Identifique e otimize o uso de endereços IPv4 públicos na AWS. 2024. Disponível em: https://aws.amazon.com/pt/blogs/aws-brasil/identifique-e-otimize-o-uso-de-enderecos-ipv4-publicos-na-aws/. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. O que é o Amazon EC2? 2024. Disponível em: https://docs.aws.amazon.com/pt_br/AWSEC2/latest/UserGuide/concepts.html. Acesso em: 23 jun. 2025.
- SILVA, P. Amazon EC2, o incrível serviço de computação em nuvem da Amazon. 2024. Disponível em: https://www.dio.me/articles/amazon-ec2-o-incrivel-servico-de-computacao-em-nuvem-da-amazon. Acesso em: 23 jun. 2025.

Palavras-chave: EC2. Virtualização. Elasticidade.

## Etapa 05: Containers com ECS e EKS

### O que vem por aí

Conceitos fundamentais do ECS e EKS e prática de criação e configuração desses serviços, introduzindo recursos para escalar, automatizar e monitorar com eficiência.

### Hands on

Criar um cluster ECS com Fargate, implantar uma aplicação em contêiner e depois fazer o mesmo no EKS, usando imagens Docker armazenadas no Amazon ECR. Na prática: configurar tasks, services, roles de IAM, balanceamento de carga, observabilidade e implantações automatizadas.

### Containers

Containers revolucionaram como aplicações são desenvolvidas, empacotadas e implantadas: isolam a aplicação e suas dependências, garantindo portabilidade e consistência entre ambientes. Na AWS, entregam agilidade, escalabilidade e automação no ciclo de vida das aplicações.

(Figura 1: ECS e EKS.)

Principais orquestradores na AWS: **ECS (Elastic Container Service)**, solução própria da AWS com integração nativa e gestão mais simples, e **EKS (Elastic Kubernetes Service)**, plataforma gerenciada para clusters Kubernetes com toda a complexidade do ecossistema Kubernetes. A escolha depende do nível de controle, da familiaridade com Kubernetes e da complexidade da aplicação. Ambos suportam escalabilidade automática, balanceamento de carga, CI/CD, monitoramento, segurança e alta disponibilidade.

### Docker, Docker Hub e LXC

- **Docker**: tecnologia mais popular para criar e gerenciar containers; empacota a aplicação e dependências em uma imagem executável em qualquer lugar.
- **Docker Hub**: repositório público e privado de imagens Docker, onde desenvolvedores publicam e compartilham imagens prontas (servidores web, bancos de dados, aplicações completas). Muito usado em pipelines de CI/CD e por orquestradores como ECS e Kubernetes.
- **LXC (Linux Containers)**: outra forma de usar containers, utilizada por plataformas como o Proxmox VE. Virtualização em nível de sistema operacional, mais leve que VMs tradicionais, ideal para laboratório ou data centers autogerenciados.

(Figura 2: Virtual Machines and Containers.)

Containers não substituem máquinas virtuais, mas trazem abordagem mais leve: em vez de iniciar um sistema operacional por aplicação, compartilham o kernel do host, sendo mais rápidos e leves.

### Amazon ECS (Elastic Container Service)

Serviço de orquestração de containers totalmente gerenciado pela AWS. Executa, para e gerencia containers Docker em um cluster de servidores. Curva de aprendizado mais suave que Kubernetes e forte integração com o ecossistema AWS.

Modos de execução:

- **ECS com EC2**: você gerencia as instâncias do cluster.
- **ECS com Fargate**: sem gerenciar servidores; a AWS cuida da infraestrutura e você foca no código. Ideal para simplicidade, escala automaticamente conforme a demanda. Em contrapartida, pode custar mais e oferece menor controle fino sobre o ambiente.

(Figura 3: como funcionam o ECS e o EKS.)

O ECS organiza containers em **Tasks**, definidas em arquivos JSON com os detalhes da aplicação: imagem Docker, recursos necessários, variáveis de ambiente, portas expostas, entre outros. Tasks são agrupadas em **Services**, responsáveis por manter disponibilidade e balanceamento.

### AWS Fargate

Solução serverless para executar containers, integrada ao ECS e ao EKS. Sem provisionar, configurar ou gerenciar servidores.

- Aloca automaticamente a quantidade exata de CPU e memória para cada task, eliminando desperdício.
- Lida com falhas e atualizações automaticamente.
- Segurança: cada task roda isolada, com permissões específicas via IAM e sem compartilhar o kernel com outras workloads, melhorando isolamento e governança em ambientes multiusuário ou com múltiplos serviços.

(Figura 4: AWS ECS, Docker Container Deployment Onto EC2.)

O ECS é indicado quando se quer solução totalmente gerenciada e integrada à AWS sem a complexidade inicial do Kubernetes. Para workloads previsíveis, tasks simples, containers com Fargate sem se preocupar com nós EC2 e aproveitando IAM, CloudWatch e ALB nativamente, o ECS é mais rápido para começar e tem curva menor.

### Kubernetes: origem

O Kubernetes nasceu no Google em 2014 como evolução interna do projeto Borg, que já gerenciava bilhões de containers por dia. A proposta: sistema open-source para orquestrar deployments em larga escala com auto-recuperação, balanceamento de carga e atualizações sem downtime. Em 2015 passou para a Cloud Native Computing Foundation, atraindo contribuições de Red Hat, Microsoft e AWS, o que consolidou a adoção global.

Antes do Kubernetes, equipes gerenciavam containers (Docker, rkt etc.) manualmente ou com ferramentas caseiras: inconsistência, falta de escalabilidade automatizada e operações complexas em múltiplos clusters. O K8s resolveu com abstrações como Pods, Services e Deployments: define-se o estado desejado e o sistema cuida de provisionamento, scale-out e self-healing.

### Amazon EKS (Elastic Kubernetes Service)

Entrega o poder do Kubernetes gerenciado pela AWS, sem a complexidade de instalar, atualizar e manter o plano de controle (control plane). Kubernetes permite definir com precisão como aplicações escalam, se comunicam, se recuperam de falhas e se distribuem em ambientes multi-cloud e híbridos.

O EKS automatiza provisionamento do plano de controle, atualizações de versão, integração com IAM, monitoramento com CloudWatch e balanceamento com ELB. É compatível com Helm, ArgoCD, Prometheus e Grafana. O plano de controle é gerenciado, mas os nós de trabalho e os recursos lógicos precisam ser configurados pela equipe.

(Figura 5: Kubernetes cluster in action.)

**Control Plane**: coração do cluster. Gerencia o estado desejado, decide onde os containers rodam e mantém a comunicação entre componentes. No EKS é gerenciado automaticamente pela AWS, com alta disponibilidade e atualizações seguras.

Exemplo de configuração com eksctl (Código-fonte 1):

```bash
eksctl create nodegroup \
  --cluster my-cluster \
  --name my-nodegroup \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3 \
  --managed
```

**Worker nodes (nós de trabalho)**: máquinas, geralmente instâncias EC2, onde os containers executam. Cada nó roda o kubelet, que se comunica com o plano de controle, e contém os pods e containers da aplicação.

**Pods**: menores unidades executáveis do Kubernetes. Um pod pode ter um ou mais containers que compartilham armazenamento, rede e configuração. Exemplo `pod.yaml` (Código-fonte 2):

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: meu-pod
spec:
  containers:
    - name: meu-container
      image: nginx
      ports:
        - containerPort: 80
```

**Service**: expõe uma aplicação executada em um conjunto de pods como serviço de rede, permitindo descoberta e comunicação entre partes do cluster. Exemplo `service.yaml` (Código-fonte 3):

```yaml
apiVersion: v1
kind: Service
metadata:
  name: meu-servico
spec:
  selector:
    app: minha-aplicacao
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
```

**Deployment**: atualizações declarativas para pods e réplicas; gerencia criação e atualização de réplicas. Exemplo `deployment.yaml` (Código-fonte 4):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: meu-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: minha-aplicacao
  template:
    metadata:
      labels:
        app: minha-aplicacao
    spec:
      containers:
        - name: meu-container
          image: nginx
          ports:
            - containerPort: 80
```

**Ingress**: gerencia acesso externo aos serviços do cluster, geralmente HTTP, com regras de roteamento. Exemplo `ingress.yaml` (Código-fonte 5):

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: meu-ingress
spec:
  rules:
    - host: minha-aplicacao.exemplo.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: meu-servico
                port:
                  number: 80
```

O EKS se integra à VPC usando ENIs (Elastic Network Interfaces) para isolamento e comunicação entre pods. Segurança via IAM e RBAC, com controle granular de permissões.

Ideal para empresas que já usam Kubernetes on-premises ou em outros provedores (portabilidade e consistência). Por ser mais complexo que o ECS, exige curva de aprendizado maior e atenção a namespaces, RBAC, pods e ingress controllers.

### ECS ou EKS?

Depende da experiência da equipe, complexidade da aplicação, custos operacionais e nível de controle desejado.

- **ECS**: simplicidade, integração nativa com serviços AWS, curva mais leve. Para aplicações exclusivamente na AWS e times que preferem abstrair a orquestração.
- **EKS**: portabilidade, padronização em múltiplos ambientes (multi-cloud ou híbrido) ou quando já se usa Kubernetes fora da AWS. Mais flexibilidade e vasto ecossistema open source, mas exige mais conhecimento técnico.
- **Custo**: ECS com Fargate pode ser mais caro em workloads contínuas, mas reduz custos operacionais com servidores. No EKS há custos adicionais com o plano de controle e maior responsabilidade sobre segurança e escalabilidade dos nós.

Ponto de partida sugerido: ECS para aplicações novas ou de baixo acoplamento, evoluindo para EKS conforme a complexidade e os requisitos crescem.

### CI/CD com containers

Integrar pipelines de CI/CD com ECS ou EKS permite entregar código com mais frequência, segurança e previsibilidade. No EKS, é comum usar ArgoCD, FluxCD ou Jenkins em implantações baseadas em GitOps: versionamento de configurações, revisão por pull request e controle de mudanças estruturado, para times mais maduros em DevOps.

Para ECS e EKS, o **ECR** é o repositório de imagens recomendado: integração nativa, controle de acesso por IAM e escaneamento automático de vulnerabilidades. Essas integrações reduzem falhas humanas, aumentam a velocidade de entrega e dão rastreabilidade a todo o ciclo de vida.

### Monitoramento

Essencial para desempenho, estabilidade e detecção proativa de falhas. Na AWS: CloudWatch e Container Insights; no EKS, também Prometheus e Grafana. O ECS se integra nativamente ao CloudWatch, coletando logs e métricas sem configuração complexa. No EKS é comum Prometheus para métricas e Grafana para visualização, com agentes como o CloudWatch Agent ou o AWS Distro for OpenTelemetry para integração.

### Boas práticas de segurança em containers

Segurança vai além da aplicação: imagem, runtime, rede, controle de acesso e infraestrutura subjacente.

- **Imagens seguras e confiáveis**: repositórios verificados no Docker Hub ou no Amazon ECR, com escaneamento automático de vulnerabilidades conhecidas. Evite imagens genéricas ou mal documentadas.
- **IAM granular por task ou pod**: IAM Roles for Tasks (ECS) ou IAM Roles for Service Accounts (EKS), aplicando o menor privilégio.
- **Redes privadas com segurança em camadas**: Security Groups, NACLs e políticas de rede Kubernetes (NetworkPolicies), isolando serviços sensíveis.
- **Comunicação externa**: APIs autenticadas e criptografadas com certificados gerenciados pelo AWS ACM.
- **Detecção**: AWS GuardDuty, CloudTrail e CloudWatch Logs, com alertas e respostas automatizadas.

Resumo: o ECS se destaca pela simplicidade e integração nativa, ideal para menor complexidade operacional; o EKS oferece flexibilidade e poder do Kubernetes, adequado a quem usa ou quer adotar padrões de mercado, com mais controle e portabilidade. A escolha considera experiência da equipe, portabilidade, complexidade e objetivos estratégicos; ambos escalam com disponibilidade e segurança.

### Mercado, cases e tendências

Conteinerização é o padrão moderno de desenvolvimento e implantação, e dominar ECS e EKS é uma das habilidades mais impactantes. Empresas buscam DevOps, arquitetos e desenvolvedores que empacotem com Docker, gerenciem imagens no Amazon ECR (Elastic Container Registry) e orquestrem microsserviços em larga escala, construam pipelines de CI/CD, garantam escalabilidade automática e otimizem custos com AWS Fargate.

**Case GoPro**: a plataforma de mídia na nuvem era monolítica, difícil de escalar e atualizar; a dor era lentidão para lançar recursos e dificuldade de gerenciar infraestrutura. Migrando para microsserviços no Amazon EKS, ganhou agilidade para desenvolver, testar e implantar serviços de forma independente e rápida, com robustez e escalabilidade do Kubernetes sem gerenciar o control plane. Resultado: aceleração drástica do ciclo de desenvolvimento, mais resiliência e inovação mais rápida.

**Tendências**:

- Abstração crescente da infraestrutura: AWS Fargate como principal tendência para rodar contêineres sem gerenciar servidores.
- Service Mesh, como o AWS App Mesh, padronizando comunicação, monitoramento e segurança entre microsserviços.
- GitOps como método preferido de deploy contínuo em Kubernetes, com o repositório Git como única fonte da verdade.
- Container security: ferramentas integradas ao ECR para escanear imagens antes de chegarem à produção.

### O que você viu nesta aula

Containers na AWS: tecnologias base (Docker e LXC) e serviços gerenciados ECS, Fargate e EKS; como escolher entre eles, integrar com CI/CD, monitorar e aplicar segurança. ECS e Fargate oferecem abordagem simplificada para agilidade; EKS atende projetos complexos que exigem portabilidade, flexibilidade e controle detalhado.

### Referências

- AMAZON WEB SERVICES. AWS Fargate. 2024. Disponível em: https://aws.amazon.com/pt/fargate/. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. Conceitos do Kubernetes no Amazon EKS. 2024. Disponível em: https://docs.aws.amazon.com/pt_br/eks/latest/userguide/kubernetes-concepts.html. Acesso em: 23 jun. 2025.
- CODER SOCIETY. ECS vs EKS: Which One is Right for You? 2024. Disponível em: https://codersociety.com/blog/articles/ecs-vs-eks. Acesso em: 23 jun. 2025.
- KERNO. AWS ECS: Docker, Fargate & Containers. 2024. Disponível em: https://www.kerno.io/learn/aws-ecs-docker-fargate-containers. Acesso em: 23 jun. 2025.
- WECLOUDDATA. Install and run containers on Linux virtual machines (LXD/LXC). 2024. Disponível em: https://weclouddata.com/blog/learning-guide/install-and-run-containers-on-linux-virtual-machines-lxd-lxc/. Acesso em: 23 jun. 2025.

Palavras-chave: ECS. EKS. Elasticidade.

## Etapa 06: Banco de dados com Aurora, RDS e DynamoDB

### O que vem por aí

Diferenças entre bancos relacionais e não relacionais, com foco em RDS, Aurora e DynamoDB: como funcionam, vantagens, limitações e cenários ideais. Comparações práticas entre os três e dicas de custo, segurança e integração com outros serviços da AWS.

### Hands on

Criar uma instância RDS no console da AWS, configurar e testar um banco Aurora com réplica de leitura e montar uma tabela DynamoDB com operações via Lambda. Conteúdo em vídeo para criar, configurar e testar cada solução.

### Bancos de dados

Estruturas fundamentais de qualquer sistema: armazenam, organizam e dão acesso rápido e confiável a informações cruciais (e-commerce, redes sociais). A persistência depende de uma arquitetura sólida. A escolha entre "relacional" e "não relacional" depende das necessidades da aplicação.

A AWS oferece bancos em diferentes formatos e modelos de gestão, de bancos gerenciados a soluções otimizadas para cargas específicas (análises em tempo real, armazenamento de documentos), tirando o peso do gerenciamento manual e entregando escalabilidade, alta disponibilidade e segurança. O banco de dados é o coração do sistema: se parar ou funcionar mal, todo o resto é impactado.

(Figura 1: trilha de banco de dados.)

### Relacionais e não relacionais

**Relacionais**: acessados e manipulados com SQL (Structured Query Language). Ênfase na consistência dos dados, frequentemente mais valorizada que a disponibilidade. Transações seguem o princípio **ACID**:

- **Atomicidade**: todas as operações da transação concluem com sucesso ou, em falha, a transação é revertida completamente.
- **Consistência**: o banco permanece em estado válido antes e depois da transação.
- **Isolamento**: cada transação ocorre de forma independente, sem interferência de outras em andamento.
- **Durabilidade**: dados gravados são preservados mesmo em falhas do sistema.

Pela estrutura rígida, são ideais para análises complexas e operações estruturadas com esquema fixo. Essa rigidez vira obstáculo quando os dados não se encaixam em estruturas pré-definidas, o que ficou evidente nos anos 1990 com a internet e aplicações web gerando grandes volumes de dados não estruturados ou semi-estruturados.

**Não relacionais (NoSQL, "not only SQL")**: surgiram para escalabilidade horizontal e flexibilidade de estrutura. Modelos: chave-valor, documentos, colunar e grafos. O DynamoDB segue o modelo chave-valor, excelente para altas taxas de leitura e escrita com baixa latência. Oferecem agilidade para mudanças e maior elasticidade; comuns em redes sociais, jogos online e streaming.

(Figura 2: banco de dados não relacional.)

### Amazon RDS (Relational Database Service)

Bancos relacionais na nuvem sem se preocupar com provisionamento, atualização, backup e manutenção da infraestrutura; a AWS assume a responsabilidade operacional.

- Engines: MySQL, PostgreSQL, MariaDB, Oracle e Microsoft SQL Server, facilitando a migração de sistemas legados.
- Instâncias únicas ou replicadas, com alta disponibilidade (Multi-AZ) e réplicas de leitura para escalabilidade.
- Backups automáticos, snapshots manuais e recuperação pontual (point-in-time).
- Escala vertical (mais CPU e memória) ou horizontal (réplicas de leitura) via console ou API; ideal para aplicações que crescem ou têm picos previsíveis, como e-commerces em datas especiais.

(Figura 3: arquitetura de banco de dados relacional.)

**Vantagens**: modelo gerenciado (manutenção, patches, backups automáticos e recuperação pela AWS), reduzindo a sobrecarga da equipe; compatibilidade com bancos populares; Multi-AZ para resiliência.

**Limitações**: não é o melhor para performance extrema e latência muito baixa em grande escala (respostas em milissegundos); nesses casos Aurora ou DynamoDB se destacam. Exige atenção a parâmetros como alocação de IOPS, escalabilidade e monitoramento de conexões. Custo pode ficar elevado, conforme instância e tipo de armazenamento, se a aplicação tiver picos constantes que exijam escalabilidade frequente.

### Amazon Aurora

Banco relacional compatível com MySQL e PostgreSQL, projetado pela AWS para alta performance, disponibilidade e escalabilidade. Une simplicidade e compatibilidade de MySQL/PostgreSQL com a performance de bancos comerciais de alto custo. Totalmente gerenciado e compatível com aplicações dessas duas engines.

(Figura 4: arquitetura do banco de dados Aurora.)

Diferença para o RDS tradicional, a arquitetura: o RDS replica instâncias completas para alta disponibilidade; o Aurora **separa armazenamento de processamento**.

- Armazenamento distribuído, replicado automaticamente em **seis cópias em três zonas de disponibilidade**: confiabilidade, escalabilidade e menor latência.
- Volume virtual que cresce automaticamente de **10 GB até 128 TB**, sem provisionamento prévio. Como a camada é independente do nó de processamento, instâncias podem reiniciar ou migrar sem afetar os dados.
- Log contínuo de transações e recuperação automática: restauração rápida a qualquer ponto no tempo, útil em operações críticas e em desenvolvimento e testes para reverter alterações.
- Até **15 réplicas de leitura** que compartilham o mesmo volume de armazenamento, com balanceamento automático de carga; reduz o tempo de replicação e melhora a escalabilidade de leitura.
- **Global Database**: replicação entre regiões, para aplicações globais com leitura rápida em diferentes continentes.

Custo: costuma ser mais caro que uma instância RDS equivalente, mas entrega muito mais performance por unidade de hardware. Excelente para aplicações críticas: sistemas bancários, jogos online, grandes marketplaces.

### Amazon DynamoDB

Banco NoSQL da AWS para escalabilidade massiva, baixa latência e alta disponibilidade. Modelo chave-valor, extremamente rápido para leituras e escritas simples.

(Figura 5: arquitetura de banco chave-valor.)

- Distribuído desde a concepção, com desempenho consistente mesmo com milhões de requisições por segundo. Usado em recomendação, marketplaces, jogos online e apps móveis com muitos acessos simultâneos.
- **Serverless**: sem provisionar instâncias, configurar escalabilidade ou backups; a AWS gerencia tudo e você paga pelo que consome.
- **DAX**: aceleração com cache em memória.
- **Streams**: processamento de eventos em tempo real.
- **Global Tables**: replicação multi-região.

(Figura 6: performance RDS / Aurora / DynamoDB.)

Destaca-se quando velocidade, escalabilidade automática e simplicidade de dados são cruciais, com grandes volumes de requisições simultâneas e respostas em milissegundos, quando o modelo cabe em chave-valor ou documentos. Exemplos:

- Aplicativos móveis e jogos online com milhares de usuários ativos ao mesmo tempo.
- Plataformas de streaming (música ou vídeo sob demanda) armazenando preferências, listas de reprodução e progresso de consumo.
- Sistemas de recomendação e personalização, aliado ao Amazon Personalize ou ao Lambda, com respostas adaptadas ao comportamento do cliente em tempo real.

Não substitui bancos relacionais em todas as situações: com relacionamentos complexos, integridade referencial, uso intensivo de joins e transações multi-tabela, Aurora ou RDS são mais indicados.

### Como escolher

Considere modelo de dados, volume e frequência de acessos, requisitos de consistência e transações e complexidade do sistema.

- **RDS**: aplicações legadas ou tradicionais em MySQL, PostgreSQL, SQL Server ou Oracle que exigem estrutura relacional com ACID, controle transacional, joins, triggers, procedures e modelo bem estruturado.
- **Aurora**: tudo do RDS com performance otimizada e arquitetura para alta escalabilidade e disponibilidade. Sistemas críticos e modernos com failover automático, alta capacidade de leitura e escrita e replicação global. Se o custo for justificado pela performance, é a melhor escolha relacional.
- **DynamoDB**: aplicações serverless, altamente escaláveis e com estrutura de dados simples, sem relacionamentos complexos e com latência extremamente baixa. Cobrança por uso real atrai em tráfego variável.

### Custos e segurança

Configurações inadequadas (instâncias superdimensionadas no RDS, modelo de capacidade incorreto no DynamoDB) geram gastos excessivos. Boas práticas: réplicas de leitura, Auto Scaling e TTL. Monitorar com CloudWatch permite ajustes proativos, como redefinir janelas de backup ou mover dados frios para o S3.

Segurança: RDS, Aurora e DynamoDB oferecem criptografia em repouso e em trânsito com AWS KMS, controle de acesso com IAM, autenticação forte e auditoria com CloudTrail. Redes privadas via VPC, com security groups e ACLs, restringem acessos externos.

### Mercado, cases e tendências

Demanda por aplicações com performance instantânea e escala planetária levou a modelos serverless de banco, como **Amazon Aurora Serverless** e **DynamoDB On-Demand**, que eliminam o gerenciamento de capacidade e se ajustam automaticamente à carga. Mudança de paradigma: paga-se pelo consumo real, não por infraestrutura fixa.

**Case The Walt Disney Company**: para unificar a experiência de milhões de usuários em serviços como o Disney+, precisava suportar picos massivos e imprevisíveis sem falhas. O DynamoDB ofereceu latência de milissegundos em escala global e liberou as equipes para focar no produto.

Carreira: saber discernir quando usar RDS para sistemas estruturados, quando escalar com Aurora ou quando adotar a flexibilidade NoSQL do DynamoDB virou competência de alto valor. Não basta saber SQL; é preciso ser arquiteto(a) de dados na nuvem capaz de desenhar soluções resilientes e com custo otimizado.

### O que você viu nesta aula

Soluções da AWS para armazenamento e manipulação de dados com RDS, Aurora e DynamoDB, cada uma otimizada para tipos de aplicação diferentes; como escolher, otimizar custos, aplicar segurança e integrar ao restante do ecossistema AWS em arquiteturas completas e escaláveis.

### Referências

- ABYLEAD. AWS Database Overview: RDS vs Aurora vs Redshift vs DynamoDB. 2024. Disponível em: https://medium.com/@abylead/aws-database-overview-rds-vs-aurora-vs-redshift-vs-dynamodb-7eeebb61ca98. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. Aurora: visão geral. 2024. Disponível em: https://docs.aws.amazon.com/pt_br/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. The difference between relational and non-relational databases. 2024. Disponível em: https://aws.amazon.com/pt/compare/the-difference-between-relational-and-non-relational-databases/. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. Use cross-region read replicas with Amazon Relational Database Service for SQL Server. 2024. Disponível em: https://aws.amazon.com/pt/blogs/aws-brasil/use-cross-region-read-replicas-with-amazon-relational-database-service-for-sql-server/. Acesso em: 23 jun. 2025.
- SALESFORCE TRAILHEAD. Understand the Basics of Databases. 2024. Disponível em: https://trailhead.salesforce.com/pt-BR/content/learn/modules/big-data-strategy/understand-the-basics-of-databases. Acesso em: 23 jun. 2025.

Palavras-chave: Banco de Dados. Gerenciamento. Performance.

## Etapa 07: Serverless com Lambda e API Gateway

### O que vem por aí

O universo da arquitetura serverless no ecossistema AWS: como o modelo funciona e por que é cada vez mais adotado por empresas que buscam agilidade, escalabilidade e redução de custos operacionais. Conceitos do AWS Lambda e do API Gateway, com eventos disparando funções que executam código sob demanda, sem provisionamento manual de servidores.

### Hands on

Construir uma aplicação completa: criar uma função Lambda em Python, expô-la por uma API HTTP no Amazon API Gateway, integrar com o DynamoDB para persistência e monitorar o desempenho pelo CloudWatch. Também proteger a API com uma chave de acesso e explorar versionamento e boas práticas de deploy.

### Arquitetura serverless

Mudança de mentalidade: em vez de construir e manter infraestrutura, o desenvolvedor escreve funções executadas em resposta a eventos (requisições HTTP, envio de arquivos, interações com filas de mensagens). O desenvolvimento fica mais ágil e focado na lógica de negócio.

Serverless não significa ausência de servidores: o gerenciamento, a escalabilidade e a manutenção ficam a cargo do provedor (a AWS), liberando a equipe para desenvolver funcionalidades.

Vantagem econômica: cobrança por execução, só pelo tempo em que a função roda, eliminando custo de servidores ociosos. Somado à escalabilidade automática e à integração com outros serviços, forma um modelo altamente eficiente.

### Evolução: on-premises, colocation, cloud e serverless

- **On-premises**: até os anos 1990, empresas compravam servidores físicos e os mantinham em espaço próprio (centro de processamento de dados, depois popularizado como data center), nas instalações físicas da empresa.
- **Colocation**: ainda nos anos 1990 surgiram data centers que ofereciam infraestrutura física para hospedar servidores de outras empresas, dispensando espaço interno com infraestrutura elétrica, refrigeração, segurança e conectividade. Abrigam servidores de diferentes empresas no mesmo ambiente.
- **Cloud computing**: no início dos anos 2000, plataformas de nuvem passaram a oferecer servidores virtuais como serviço; recursos sob demanda, sem comprar ou alugar máquinas físicas, com a infraestrutura física sob responsabilidade do provedor.
- **Serverless**: a empresa desenvolve apenas pequenas unidades de código (funções serverless ou funções Lambda) e as envia para a nuvem, sem alugar servidores físicos ou virtuais. As funções executam sob demanda, chamadas por aplicações ou acionadas por eventos.

(Figura 1: comparando On-Premises, Colocation, Cloud e Serverless.)

O nome vem do fato de que o desenvolvedor não se preocupa com instalação, configuração e escalabilidade de servidores; eles continuam existindo, mantidos pelas empresas de cloud. Paga-se pelo tempo de execução: só quando ocorre um evento ou chamada as funções são carregadas, executadas, encerradas e cobradas.

### AWS Lambda

(Figura 2: arquitetura Lambda.)

Serviço de computação serverless da Amazon. Executa código em resposta a eventos sem provisionar ou administrar servidores: escreve-se a função, define-se um gatilho (requisição HTTP, alteração em banco de dados, upload de arquivo no S3) e a AWS cuida de escalabilidade, balanceamento de carga e execução sob demanda.

- Cada função tem código principal e dependências, empacotados e enviados pelo console, CLI ou ferramentas como o SAM (Serverless Application Model).
- Linguagens: Python, Node.js, Java, Go e .NET, entre outras.
- **Escalabilidade automática**: cada evento faz o Lambda criar uma instância isolada para processá-lo; centenas de eventos simultâneos geram centenas de execuções em paralelo, sem configuração.
- **Cobrança por uso** com dois fatores: número de requisições e duração da execução, com base na memória alocada. Otimização precisa de custos para workloads variáveis ou sazonais.

### Gatilhos (eventos)

(Figura 3: arquitetura de gatilhos do Lambda.)

O Lambda se integra a diversos serviços e reage a muitos eventos; cada evento é um gatilho. Isso permite arquiteturas complexas apenas com componentes serverless.

- **HTTP via Amazon API Gateway**: o mais comum. Uma API REST ou HTTP chama uma função ao receber requisição; sistemas web sem servidores dedicados. Cada endpoint pode ser vinculado a uma função específica.
- **Amazon S3**: ao enviar um arquivo para um bucket, a função processa o conteúdo (redimensionar imagem, extrair metadados, registrar em banco). Útil em upload, processamento de mídia ou ingestão de dados.
- **Amazon DynamoDB e Amazon Kinesis**: processamento de alterações em tempo real (monitoramento, processamento de logs, atualização de dados em múltiplas fontes); o Lambda consome os eventos à medida que chegam.
- Também SNS, SQS, CloudWatch, EventBridge e Cognito, entre outros.

O Lambda pode estar no centro de uma arquitetura orientada a eventos, como elo entre serviços e fluxos de trabalho.

### Amazon API Gateway

(Figura 4: API Gateway AWS.)

Expõe endpoints HTTP e WebSocket de forma segura e escalável. Cria APIs RESTful como interfaces públicas (ou privadas) para funções Lambda, serviços AWS ou sistemas externos. No serverless, é o intermediador entre o cliente e a lógica da aplicação.

- Rotas específicas, cada uma ligada a uma função Lambda ou recurso interno, organizadas por métodos HTTP (GET, POST, PUT, DELETE).
- Recursos avançados: validação de entrada, transformação de payloads, mapeamento de respostas, caching e controle de quotas e limites de uso.
- Segurança: autenticação via tokens JWT (com Cognito ou sistemas externos), API Keys, controle de CORS e integração com o WAF (Web Application Firewall).

A dupla API Gateway e Lambda é a base de sistemas 100% serverless, rápidos e econômicos, permitindo que aplicações web e mobile chamem funcionalidades na nuvem sem servidores ligados continuamente.

### Tipos de API: REST, HTTP e WebSocket

(Figura 5: API Gateway REST/HTTP/WebSocket.)

- **REST**: a mais completa e tradicional. Recursos organizados em caminhos (`/clientes`, `/produtos` etc.) com métodos GET, POST, PUT e DELETE. Inclui autenticação com Cognito, caching nativo, modelos para validação e mapeamento de dados. Poderosa, porém mais complexa de configurar.
- **HTTP**: mais leve e moderna, lançada depois, desenhada para reduzir custos e latência. Ideal para integrar com Lambda ou serviços HTTP simples; suporta autenticação, roteamento direto e monitoramento, mas deixa de fora recursos da REST, como transformações detalhadas de payload.
- **WebSocket**: comunicação em tempo real (chats, notificações, jogos). Conexão persistente com troca de mensagens bidirecional. Estrutura baseada em mensagens e rotas específicas para conexão, envio e desconexão.

Escolha: REST para integrações completas e regras de negócio sofisticadas; HTTP para microsserviços leves ou chamadas pontuais; WebSocket quando há necessidade de tempo real.

### Escrevendo, empacotando e monitorando funções

- A escolha da linguagem (Python, Node.js, Java, Go, .NET e outras) influencia o tempo de inicialização (cold start) e deve considerar o perfil da equipe e os requisitos de desempenho.
- Cada função tem um arquivo de entrada, normalmente o **handler**, que recebe um evento e retorna uma resposta, mais bibliotecas e arquivos auxiliares. O pacote pode ser um `.zip` ou uma imagem Docker para aplicações mais complexas.
- Configurações: variáveis de ambiente, timeout, quantidade de memória e permissões via IAM Role. Impactam desempenho e custo. É comum começar com 128 MB e ajustar, já que mais memória também significa mais CPU.
- Monitoramento com Amazon CloudWatch, que armazena os logs de execução automaticamente: tempo total, uso de memória, erros e mensagens personalizadas; permite métricas personalizadas, alarmes e dashboards em tempo real.
- **AWS SAM (Serverless Application Model)** e **AWS CDK (Cloud Development Kit)** permitem empacotar, testar e versionar funções localmente antes de implantar, aumentando produtividade e evitando erros em produção.

### Padrões de uso

(Figura 6: Lambda Functions com SQS.)

Funções Lambda raramente operam isoladas; integram-se a bancos, autenticação, filas e orquestradores.

- **Autenticação e autorização**: em APIs públicas, Amazon Cognito com JWTs permite que o API Gateway controle o acesso às rotas, validando tokens sem que a função precise fazer esse trabalho.
- **Acesso a banco de dados**: o Lambda lê e escreve diretamente no DynamoDB com baixa latência e ótima escalabilidade. Para relacionais (Aurora ou RDS), é preciso gerenciar conexões com cuidado, com pools ou middlewares, pois cada execução é isolada e pode esgotar recursos.
- **Orquestração**: AWS Step Functions define fluxos visuais e controlados entre Lambdas, com tratamento de erros, paralelismo e controle de estado; reduz complexidade e melhora rastreabilidade.
- **Desacoplamento**: SQS (filas) e SNS (notificações); uma função processa mensagens assíncronas enquanto outra envia notificações a diferentes canais. Ideal para sistemas distribuídos resilientes e escaláveis.

### Desafios e boas práticas

- **Cold start**: tempo adicional para inicializar uma função após inatividade, prejudicial em tempo real. Mitigação: linguagens de inicialização rápida (Node.js ou Python) e manter funções "aquecidas" com chamadas periódicas.
- **Conexões com banco relacional**: execuções isoladas podem criar conexões em excesso e sobrecarregar o banco. Mitigação: RDS Proxy ou reuso inteligente de conexões.
- **Observabilidade**: CloudWatch Logs é essencial; o **X-Ray** fornece rastreamento completo de requisições e identifica gargalos em funções encadeadas. Logs, métricas e traços juntos dão visão rica da operação. (Figura 7: observabilidade do Lambda no CloudWatch.)
- **Segurança**: menor privilégio nas políticas IAM de cada função, reduzindo superfície de ataque e uso indevido por código malicioso ou erro humano.

### Quando usar (e quando evitar) serverless

Indicado para:

- Aplicações com carga variável, que precisam escalar rápido sem custo ocioso.
- Eventos esporádicos: processamentos em segundo plano, integração entre serviços, automações internas.
- Protótipos rápidos e MVPs, com equipes pequenas entregando valor sem se preocupar com infraestrutura.
- Microsserviços autônomos, tarefas programadas e APIs de baixo volume, com lógica simples e uso imprevisível.

Limitações:

- Execuções longas, conexões persistentes ou bibliotecas pesadas sofrem com o **timeout máximo do Lambda (15 minutos)** ou com o cold start.
- Em altíssima carga constante, o modelo sob demanda pode sair mais caro que infraestrutura tradicional.
- **Lock-in** com a AWS: uma função Lambda acessada por usuários externos depende diretamente do API Gateway, acoplando a aplicação à AWS e dificultando migração. Step Functions e integrações como Cognito ou SQS reforçam esse acoplamento.

Com o Lambda abstrai-se a infraestrutura e foca-se na lógica de negócio; o API Gateway é a porta de entrada segura, organizada e escalável. Mais do que dominar ferramentas, a chave é entender como os serviços se conectam para entregar valor.

### Mercado, cases e tendências

**Case Bustle Digital Group**: gigante da mídia digital que precisava processar e redimensionar milhões de fotos enviadas por usuários diariamente, com picos imprevisíveis; infraestrutura tradicional exigiria muitos servidores ociosos. Com AWS Lambda, cada imagem enviada dispara uma função que a processa em tempo real e descarta os recursos em seguida. Resultado: economia de mais de 80% nos custos de processamento e agilidade para qualquer volume.

Profissionais que pensam "sem servidor", conectam serviços por eventos com o API Gateway e constroem lógica em funções Lambda são arquitetos da eficiência, pagando apenas pelos milissegundos de computação usados.

**Tendências**:

- Expansão do serverless além da computação: bancos de dados, contêineres e serviços de análise no mesmo modelo sob demanda.
- Amazon EventBridge como sistema nervoso central para orquestrar comunicação entre microsserviços de forma desacoplada e escalável.
- Observabilidade mais sofisticada, tornando o fluxo de execução em sistemas distribuídos transparente e fácil de depurar.

### O que você viu nesta aula

Fundamentos e aplicações práticas do serverless na AWS com Lambda e API Gateway: uma nova forma de pensar aplicações baseada em eventos, escalabilidade automática e redução de responsabilidade operacional. Tipos de API (REST, HTTP e WebSocket) e como escolher. Vantagens e limitações do serverless, cenários ideais e situações em que não é o mais indicado, inclusive pelo lock-in com a AWS.

### Referências

- AMAZON WEB SERVICES. Amazon API Gateway: Developer Guide. 2024. Disponível em: https://docs.aws.amazon.com/pt_br/apigateway/latest/developerguide/welcome.html. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. AWS Lambda to Amazon SQS to AWS Lambda. 2024. Disponível em: https://docs.aws.amazon.com/pt_br/solutions/latest/constructs/aws-lambda-sqs-lambda.html. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. Monitore funções AWS Lambda com Amazon CloudWatch. 2024. Disponível em: https://aws.amazon.com/pt/blogs/aws-brasil/8541-2/. Acesso em: 23 jun. 2025.
- MITTAL, A. REST API vs HTTP API vs WebSocket API. 2024. Disponível em: https://dev.to/akhil_mittal/rest-api-vs-http-api-vs-websocket-api-55ci. Acesso em: 23 jun. 2025.
- PESSÔA, F K; WERNER, Claus. Serverless. 2024. Disponível em: https://engsoftmoderna.info/artigos/serverless.html. Acesso em: 23 jun. 2025.
- REHEMÄGI, T. Monitoring serverless applications with AWS CloudWatch alarms. 2021. Disponível em: https://dashbird.io/blog/configuring-cloudwatch-alarms-with-aws-lambda/. Acesso em: 23 jun. 2025.

Palavras-chave: Lambda. Arquitetura Serverless. Handler.

## Etapa 08: Monitoramento e Logs com CloudWatch

### O que vem por aí

Como o monitoramento deixou de ser recurso técnico opcional e virou componente estratégico da operação na nuvem. Como logs, métricas e eventos se complementam para dar visibilidade total sobre os serviços AWS, ajudando a prevenir falhas, responder rápido a incidentes e otimizar recursos.

### Hands on

Configuração básica do CloudWatch em instâncias EC2, ativando o agente de monitoramento e enviando logs para análise. Depois, dashboards personalizados e alarmes inteligentes que disparam notificações e até ações automatizadas com base em métricas reais. Por fim, Logs Insights com consultas para investigar falhas e extrair métricas diretamente dos registros.

### Por que monitorar

Com sistemas mais complexos, monitorar o comportamento em tempo real é necessário para disponibilidade, performance e segurança. Na nuvem é ainda mais crítico: recursos dinâmicos, elásticos e distribuídos em várias regiões. Monitorar é requisito, não diferencial.

Monitoramento é coletar, analisar e responder a métricas e eventos em tempo real, identificando comportamentos fora do padrão, falhas iminentes, consumo excessivo e oportunidades de otimização. On-premises era manual e fragmentado; na nuvem, com o Amazon CloudWatch, é automatizado, escalável e integrado.

Sem monitoramento, a empresa fica à mercê do acaso. Exemplo: um pico de CPU em uma EC2 derruba um serviço crítico; sem alertas, a equipe só descobre quando usuários reclamam. Prejuízos: receita, reputação e até riscos legais. O monitoramento também serve a auditorias, segurança e planejamento financeiro: acompanhar o uso ao longo do tempo revela tendências e prevê necessidade de expansão ou redução, otimizando custos sem comprometer performance.

O CloudWatch é o serviço central para logs, métricas e eventos na AWS: alarmes, dashboards customizados e ações automatizadas com base em thresholds.

(Figura 1: métricas do CloudWatch.)

### Monitoramento como estratégia de negócio

Cada falha detectada a tempo pode significar economia de milhares de reais e preservação da experiência do cliente; cada segundo conta. Analogia: uma aplicação sem monitoramento é como dirigir com os olhos fechados; dá para seguir reto por um tempo, mas qualquer buraco ou curva causa acidente. Com informações e alertas em tempo real, mantêm-se "os olhos abertos", mesmo com sistemas distribuídos em várias regiões e serviços.

Governança e conformidade: empresas precisam comprovar controle sobre seus sistemas para normas como LGPD ou ISO 27001. Para a equipe técnica, visibilidade ajuda a resolver problemas. Monitoramento também é útil em desenvolvimento e testes: logs revelam falhas de lógica, interações inesperadas entre serviços ou problemas de desempenho antes de o código chegar ao usuário.

(Figura 2: exemplo de painel do Container Insights.)

### O custo de não monitorar

- **Sem monitoramento**: uma loja virtual na Black Friday começa a ter lentidão no checkout. Sem alerta em tempo real, a queda na conversão pode custar dezenas ou centenas de milhares de reais.
- **Com monitoramento**: o aumento no tempo de resposta é detectado em segundos, um alarme dispara para a equipe de infraestrutura e os recursos escalam automaticamente com base em métricas definidas. Vendas mantidas, usuários satisfeitos, problema resolvido antes de virar crise.
- **Gastos desnecessários**: uma EC2 subutilizada rodando 24h por dia gera despesa relevante em semanas.
- **Erros silenciosos**: falhas de autenticação, serviços intermitentes, problemas em integrações com APIs externas. Se não forem registrados e alertados, o suporte será sempre reativo.

O investimento em monitoramento pode parecer alto, mas se dilui ao evitar prejuízos maiores; alarmes e regras de amostragem otimizam custos, monitorando só o que importa.

### Logs, métricas e eventos

Três categorias de dados, complementares:

- **Logs**: registros textuais detalhados das operações internas (requisições HTTP, mensagens de erro, autenticações, exceções, fluxos de execução). Úteis para depuração, auditoria e análise forense. Ex.: investigar por que um usuário não conseguiu logar. (Figura 3: logs no CloudWatch.)
- **Métricas**: dados numéricos agregados que representam o comportamento ao longo do tempo (uso de CPU, memória, requisições por segundo, tempo médio de resposta). Ideais para detectar padrões e gerar alertas comparando com limites (thresholds). (Figura 4: métricas no CloudWatch.)
- **Eventos**: ocorrências específicas e geralmente mais raras que representam mudanças importantes de estado (término de uma instância, falha de uma função Lambda, criação de um recurso). Acionados por transições de estado e tratados com automações (notificações, scripts corretivos). (Figura 5: eventos no CloudWatch.)

As métricas mostram **o que** está acontecendo, os eventos mostram **quando** aconteceu e os logs explicam **por que** aconteceu. O CloudWatch integra os três em interface centralizada.

### Amazon CloudWatch

Serviço central de monitoramento na AWS, com visibilidade operacional completa sobre aplicações, serviços e infraestrutura: EC2, Lambda, RDS, containers e até recursos híbridos (servidores locais). Coleta e visualiza métricas, armazena e busca logs, configura alarmes e reage automaticamente a eventos.

- Integração nativa com praticamente todos os serviços AWS. Instâncias EC2 já enviam métricas básicas (CPU, disco, rede); com o **agente CloudWatch** a coleta se expande para memória, processos e logs do sistema operacional.
- **Alarmes**: condições como "uso de CPU acima de 80% por mais de 5 minutos" com ação automática: envio de e-mail, disparo de função Lambda ou até desligamento da instância.
- **Dashboards personalizados** com gráficos interativos em tempo real, úteis em operação contínua, reuniões de status e incidentes.
- **Monitoramento customizado**: enviar métricas próprias, como pedidos processados por minuto ou mensagens em uma fila, levando o monitoramento ao nível da lógica de negócio.

### CloudWatch Logs

Ponto de entrada para análise textual do comportamento das aplicações.

- **Log Groups**: pastas lógicas que agrupam logs por aplicação, ambiente ou funcionalidade.
- **Log Streams**: dentro dos grupos, geralmente separados por instância ou container.
- **Logs Insights**: buscas e análises com linguagem de consulta própria, semelhante a SQL: identificar erros, medir tempos de resposta, rastrear fluxos e gerar gráficos, em tempo real.
- **Coleta em EC2**: instalar o CloudWatch Agent, configurar os arquivos de log desejados e definir o destino no CloudWatch. Containers integrados com ECS, EKS ou serviços de log forwarding enviam logs automaticamente.
- **Retenção**: por padrão os logs são armazenados indefinidamente; é possível configurar 7, 30, 90 ou 365 dias, equilibrando custo e conformidade.

### Métricas e alarmes

Métricas são representações numéricas contínuas de desempenho e atividade, permitindo visualizar, comparar e reagir com base em tempo, volume ou uso de recursos.

- A maioria dos serviços AWS envia métricas automaticamente. Em EC2, gratuitamente: CPU, leitura e gravação em disco, tráfego de rede, entre outros. Em SQS ou DynamoDB: número de mensagens em fila, latência de leitura e escrita, taxa de erros.
- **Métricas customizadas**: definidas conforme o negócio; um e-commerce pode enviar a quantidade de pedidos finalizados por minuto, levando o monitoramento da infraestrutura para a camada lógica.
- **Alarmes**: regras com condições específicas sobre as métricas.

(Figura 6: métricas e alertas no CloudWatch.)

### CloudWatch Dashboards

Painéis visuais personalizados para acompanhar em tempo real a saúde de serviços, aplicações e métricas.

- Cada dashboard tem múltiplos **widgets**: gráficos de linha, de barras, tabelas ou números agregados.
- Widgets exibem métricas padrão da AWS, métricas customizadas ou resultados de consultas do Logs Insights, servindo tanto ao monitoramento técnico quanto a indicadores de negócio.
- Prática comum: um painel por ambiente (produção, homologação, desenvolvimento).
- Muito usados em reuniões de status, war rooms e plantões; em incidentes de produção, o painel é a principal ferramenta de suporte.
- Interativos, acessíveis via console, compartilháveis por link seguro ou integráveis a telas de NOC (Network Operation Center). Permissões restringem quem visualiza ou edita.

### Eventos e Amazon EventBridge

(Figura 7: regra de evento no CloudWatch.)

Eventos representam ações ou mudanças de estado (criação de instância, falha de execução de Lambda, alteração em tabela DynamoDB) e podem ser capturados como gatilho para ações automatizadas.

Até 2019 o recurso se chamava **CloudWatch Events**; evoluiu para **Amazon EventBridge**, com arquitetura mais robusta e flexível, inclusive para fontes externas (Zendesk, Datadog, Shopify, entre outras). Na prática ainda se usa muito o termo "CloudWatch Events", mas o nome oficial é EventBridge.

- **Regras** escutam eventos e disparam ações. Ex.: ao detectar que uma EC2 foi encerrada inesperadamente, uma função Lambda recria a instância e envia e-mail ao suporte. Outro uso: disparar pipelines de CI/CD a cada push em um repositório Git hospedado na AWS.
- **Segurança e conformidade**: regras que identificam recursos fora do padrão (ex.: instância lançada sem tag obrigatória) e acionam correção automática, tornando o ambiente autogerenciado.
- **Roteamento avançado** com filtros por tipo de evento, origem e dados do payload, enviando para Lambda, Step Functions ou filas SQS conforme a situação.

### CloudWatch Logs Insights

Consultas sobre grandes volumes de logs em tempo real com linguagem simples e expressiva, similar a SQL mas otimizada para logs: filtrar por palavra-chave, extrair campos, agregar, ordenar e criar visualizações gráficas.

Exemplo, identificar todos os erros 500 das últimas duas horas:

```
fields @timestamp, @message
| filter @message like /500/
| sort @timestamp desc
| limit 20
```

Também cria métricas customizadas a partir de padrões de log. Ex.: sempre que "timeout" aparece no log, gera-se uma métrica que conta as ocorrências, usada depois em dashboards e alarmes. Ideal para problemas que não aparecem em métricas padrão: falhas em integrações externas, erros de lógica de negócio, picos anormais de latência em pontos específicos.

### Boas práticas e custos

O CloudWatch é cobrado conforme o uso, então decisões técnicas impactam o custo final.

- **Evitar logs irrelevantes ou redundantes** (mensagens repetidas, detalhamento exagerado de rotinas). Registrar só o necessário e usar filtros no agente CloudWatch para enviar apenas os arquivos ou linhas importantes.
- **Definir a retenção dos logs**: por padrão é indefinida, gerando custos inesperados. Configurar 7, 14, 30, 90 dias ou outro período conforme políticas internas, requisitos legais e utilidade prática.
- **Métricas customizadas com agregação e amostragem**: reduz frequência de envio e processamento sem perder visibilidade. Evitar métricas granulares em tempo real se uma média de 1 ou 5 minutos atende.
- **Alarmes relevantes e acionáveis** em pontos críticos: alta CPU prolongada, fila de mensagens acumulada, picos de latência em endpoints sensíveis.
- **Conhecer os limites da AWS** (número máximo de alarmes, dashboards, consultas simultâneas no Logs Insights); muitos podem ser aumentados por solicitação.

Monitorar é cuidar do ambiente: construir uma cultura de observabilidade em que falhas são antecipadas, decisões se baseiam em evidências e a experiência do usuário é priorizada.

### Mercado, cases e tendências

O que não pode ser medido não pode ser gerenciado. Observabilidade (capacidade de entender o estado interno de um sistema a partir de seus dados externos) virou disciplina central, e o CloudWatch é o coração dessa prática na AWS. O mercado busca quem vai além do básico: dashboards que correlacionam performance com resultados de negócio, alarmes que previnem falhas e Logs Insights para causa raiz. SRE (Site Reliability Engineering), DevOps e administradores de nuvem com essa visão são peças-chave.

**Case FINRA (Financial Industry Regulatory Authority)**: órgão regulador do mercado financeiro dos EUA que analisa trilhões de eventos de mercado diariamente para detectar fraudes e abusos; a dor era processar esse volume de forma rápida e confiável. Com CloudWatch e outros serviços AWS, criou um sistema de vigilância de mercado robusto, usando métricas, logs e alarmes para monitorar a saúde da plataforma de análise em tempo real e responder instantaneamente a anomalias operacionais.

**Tendências**:

- **AIOps** (AI for IT Operations): o Amazon DevOps Guru se integra ao CloudWatch e usa machine learning para detectar automaticamente comportamentos anômalos e recomendar soluções antes que um humano perceba.
- **Observability-driven development**: instrumentação do código e definição de métricas relevantes como parte do desenvolvimento, não reflexão tardia. Monitoramento preditivo e integrado ao ciclo de vida do software.

### O que você viu nesta aula

O monitoramento inteligente depende de três pilares (logs, métricas e eventos) e o CloudWatch os integra em uma plataforma, com visibilidade sobre EC2, Lambda, bancos de dados, filas e aplicações customizadas, painéis em tempo real e automações. Configuração de alarmes eficientes, Logs Insights para investigar falhas, métricas customizadas que refletem o negócio e boas práticas para manter custos sob controle sem abrir mão de segurança e performance.

### Referências

- BANGAD, S. How to use Amazon CloudWatch Events to monitor application health. 2024. Disponível em: https://aws.amazon.com/pt/blogs/security/how-to-use-amazon-cloudwatch-events-to-monitor-application-health/. Acesso em: 23 jun. 2025.
- LUMIGO. CloudWatch Logs: the basics and a quick tutorial. 2024. Disponível em: https://lumigo.io/aws-cloudwatch/cloudwatch-logs-the-basics-and-a-quick-tutorial/. Acesso em: 23 jun. 2025.
- MENDES, C. Monitore funções AWS Lambda com Amazon CloudWatch. 2024. Disponível em: https://aws.amazon.com/pt/blogs/aws-brasil/8541-2/. Acesso em: 23 jun. 2025.
- NHAGA, U. .NET: observabilidade com Amazon CloudWatch e AWS X-Ray, Parte 1 (Métricas). 2023. Disponível em: https://aws.amazon.com/pt/blogs/aws-brasil/net-observabilidade-com-amazon-cloudwatch-e-aws-x-ray-parte-1-metricas/. Acesso em: 23 jun. 2025.
- REHEMÄGI, T. Monitoring serverless applications with AWS CloudWatch alarms. 2021. Disponível em: https://dashbird.io/blog/configuring-cloudwatch-alarms-with-aws-lambda/. Acesso em: 23 jun. 2025.
- SILVA, R.; PAULINO, T. Observabilidade na AWS com CloudWatch, Parte II. 2020. Disponível em: https://aws.amazon.com/pt/blogs/aws-brasil/observabilidade-na-aws-com-cloudwatch-parte-ii/. Acesso em: 23 jun. 2025.

Palavras-chave: Monitoração. Métricas. Alertas.

## Etapa 09: CDN, Load Balancer e S3

### O que vem por aí

Três serviços essenciais para aplicações resilientes, rápidas e seguras: Amazon S3, CloudFront e Load Balancer. Como o S3 armazena e serve arquivos estáticos com eficiência, como o CloudFront acelera a entrega global de conteúdo como CDN e como o ALB distribui tráfego entre servidores para garantir escalabilidade. Como funcionam sozinhos e, principalmente, como se integram em arquiteturas robustas.

### Hands on

Construir passo a passo uma aplicação moderna com Amazon S3, CloudFront e Elastic Load Balancer (ELB):

- Configurar um bucket S3 para armazenar e servir um site estático.
- Usar o CloudFront como CDN para entregar esse conteúdo globalmente com baixa latência.
- Configurar um ALB para distribuir tráfego entre instâncias EC2 que rodam o back-end.
- Ativar HTTPS com certificados da AWS.
- Testar o cache do CloudFront.
- Criar regras de roteamento no ALB.
- Proteger o S3 para que apenas o CloudFront acesse os objetos.

### CDN (Content Delivery Network)

Depois do monitoramento, o tema é resiliência. A velocidade de entrega de conteúdo pode ser a diferença entre sucesso e abandono; milissegundos impactam conversões e engajamento.

(Figura 1: CDN.)

Uma CDN é uma rede global de servidores estrategicamente distribuídos para armazenar em cache e entregar conteúdos estáticos (imagens, vídeos, CSS, JavaScript, páginas HTML) o mais próximo possível do usuário final. Reduz drasticamente o tempo de carregamento e melhora a experiência independentemente da localização.

Exemplo: um usuário no Brasil acessando um site hospedado nos Estados Unidos. Sem CDN, tudo vem do servidor de origem, com alta latência. Com CDN, o conteúdo pode estar num servidor em São Paulo, carregando muito mais rápido.

Benefícios:

- **Aceleração do desempenho**: entrega a partir de servidores próximos reduz tempo de resposta e número de saltos entre redes, mesmo em conexões menos robustas.
- **Disponibilidade**: se um servidor está inoperante ou sobrecarregado, a CDN redireciona automaticamente as requisições para outro servidor ativo. Útil em tráfego intenso (eventos promocionais, lançamentos).
- **Escalabilidade**: em picos (datas promocionais, transmissões ao vivo) distribui a carga entre servidores geográficos, evitando sobrecarga do servidor principal.
- **Segurança**: primeira linha de defesa; filtra requisições maliciosas, identifica comportamentos suspeitos e mitiga ataques DDoS automaticamente, já que o tráfego é diluído entre várias regiões e nenhum ponto único é sobrecarregado.

(Figura 2: AWS Best Practices for DDoS Resiliency.)

### Provedores de CDN

Cada provedor tem modelos de cobrança, pontos de presença (PoPs) e recursos específicos de cache, compressão, roteamento e monitoramento.

- **Akamai**: pioneira, uma das redes mais antigas e com a maior malha de servidores distribuídos do mundo. Muito usada por grandes empresas de mídia e e-commerce para vídeos e arquivos em alta velocidade, com foco em confiabilidade e disponibilidade global.
- **Cloudflare**: abordagem moderna e acessível, com planos gratuitos para pequenos sites. Integra firewall de aplicação (WAF), proteção contra bots, regras de cache inteligentes e suporte a HTTP/3. Diferencial: performance e segurança em uma só plataforma.
- **Google Cloud CDN**: integração com os serviços do Google e sua rede global; baixa latência, compressão automática e integração fácil com Cloud Storage e backends do Google Compute Engine.
- **Amazon CloudFront**: o destaque na AWS, totalmente integrado à nuvem da Amazon. Entrega conteúdo do S3, de instâncias EC2 ou gerado dinamicamente em APIs com Lambda e API Gateway. Suporte nativo a TLS, autenticação com tokens personalizados, compressão GZIP e Brotli e integração com AWS Shield e WAF.

### Amazon CloudFront

(Figura 3: tutorial do AWS CloudFront.)

CDN da AWS para entregar conteúdo com muita velocidade e baixa latência em alcance global. Conecta-se facilmente a S3, EC2, Lambda e API Gateway, distribuindo conteúdo estático (imagens, vídeos) ou dinâmico (páginas personalizadas).

- **Distribuição**: o conteúdo do back-end (bucket S3, servidor EC2 ou site fora da AWS) é replicado em centenas de pontos de presença no mundo; o usuário recebe do local mais próximo. Como ter cópias do site em várias cidades, prontas para atender.
- **Cache**: controle total; configurar quanto tempo os arquivos ficam armazenados (TTL, time-to-live), ativar compressão automática para economizar banda e personalizar o comportamento com base em headers ou cookies.
- **Segurança**: URLs assinadas ou cookies para restringir conteúdo a pessoas autorizadas; integração com AWS Shield (proteção DDoS) e AWS WAF (regras avançadas como bloquear acessos por país, IP ou padrões de requisição).
- **Métricas e logs**: integração com Amazon CloudWatch e logs de acesso salvos no S3, para ajustar cache ou segurança com base em dados reais.

### Load Balancer

(Figura 4: Application Load Balancer Simplifies Deployment.)

Com muitas requisições simultâneas, uma única instância não garante disponibilidade e desempenho. O balanceador de carga distribui as requisições entre múltiplas origens, evitando sobrecarga e aumentando a resiliência.

Atua como intermediário entre usuários e servidores: a cada nova conexão, decide qual servidor atende com base em estratégias como **round-robin**, **menor carga** ou **verificação de saúde**, garantindo que nenhuma instância seja sobrecarregada e que requisições não sejam enviadas a servidores inativos ou em falha.

Tipos mais comuns:

- **Camada 4**: nível de transporte (TCP e UDP).
- **Camada 7**: nível de aplicação (HTTP/HTTPS), com decisões baseadas em cabeçalhos, conteúdo e parâmetros de URL.

(Figura 5: Modelo OSI.)

Também é possível montar balanceadores próprios com **Nginx** ou **HAProxy**. O Nginx, por exemplo, balanceia entre múltiplas APIs ou servidores web, com regras de fallback, cache local e monitoramento de saúde. Essas soluções customizadas dão controle fino e rodam localmente ou em EC2, mas exigem manutenção contínua e conhecimento técnico aprofundado para alta disponibilidade.

### Elastic Load Balancing (ELB)

(Figura 6: como o Elastic Load Balancing funciona.)

Serviço gerenciado de balanceamento da AWS que distribui automaticamente o tráfego entre múltiplas instâncias, contêineres ou serviços em diferentes zonas de disponibilidade. Diferente de soluções manuais como Nginx, oferece escalabilidade automática, alta disponibilidade nativa e integração direta com outros serviços.

Três tipos principais:

- **Application Load Balancer (ALB)**: camada 7 (HTTP/HTTPS); balanceamento por conteúdo, como path da URL ou headers. Ideal para aplicações web, microsserviços e APIs REST.
- **Network Load Balancer (NLB)**: camada 4 (TCP/UDP); otimizado para grandes volumes de tráfego e conexões de baixa latência. Para cargas críticas ou protocolos não HTTP.
- **Gateway Load Balancer (GWLB)**: integração com appliances virtuais de terceiros, como firewalls e sistemas de inspeção de tráfego; ponto de entrada para esses serviços antes de encaminhar aos destinos finais.

Integração com Auto Scaling: com mais demanda, novas instâncias são registradas automaticamente no load balancer; com menos, são removidas, sem intervenção manual. Health checks periódicos removem da rotação qualquer recurso fora do ar. Trabalha com certificados SSL do AWS Certificate Manager (ACM), permitindo HTTPS com segurança gerenciada e renovação automática.

### Amazon S3

(Figura 7: Improved Cost Optimizations for Short-Lived and Small Objects.)

O serviço de armazenamento em nuvem mais utilizado do mundo. Armazenamento de objetos com alta durabilidade, escalabilidade praticamente ilimitada e facilidade de uso, de arquivos simples (imagens, documentos) a grandes volumes analíticos, backups e conteúdos distribuídos por CDNs.

- Dados organizados em **buckets**, contêineres lógicos para os objetos.
- Cada **objeto** tem dados (ex.: arquivo de imagem ou vídeo), metadados e uma chave única (nome). Armazenamento e recuperação via APIs REST ou SDKs da AWS.
- Durabilidade de **99,999999999% (11 noves)**; a AWS replica os objetos em múltiplas zonas de disponibilidade.
- Origem para **sites estáticos** (HTML, CSS, JavaScript e imagens via HTTP).
- Usado com CloudFront (cache e entrega global) e Lambda (processamento sob demanda ao enviar arquivos).
- Permissões granulares: políticas por bucket, por objeto, por IP ou via credenciais temporárias com IAM.
- Criptografia automática em repouso (SSE) e integração com KMS para controle de chaves.

### Boas práticas no S3

- **Estrutura de chaves** com nomes que representem categorias, datas ou departamentos; facilita buscas, automações e regras de retenção ou versionamento.
- **Classes de armazenamento** conforme frequência de acesso: dados frequentes na S3 Standard; backups ou registros antigos migrados automaticamente para S3 Infrequent Access (IA) ou S3 Glacier, reduzindo drasticamente o custo.
- **Evitar buckets públicos desnecessários**, um dos erros mais frequentes, que expõe arquivos sensíveis. Preferir URLs assinadas ou permissões IAM para controlar quem visualiza, modifica ou exclui objetos.
- **Versionamento**: mantém todas as versões de um objeto, protegendo contra exclusões acidentais ou sobrescritas e apoiando auditoria. Combinar com políticas de expiração para não acumular dados.
- **Criptografia em repouso e em trânsito**: SSE-S3 ou chaves gerenciadas no AWS KMS (SSE-KMS). Políticas de bucket devem restringir acesso público, salvo quando absolutamente necessário.

Resumo: a CDN (CloudFront) acelera a entrega em escala global; o Load Balancer é o controlador de tráfego inteligente, distribuindo requisições de forma balanceada e monitorada; o S3 armazena qualquer tipo de dado de forma econômica e durável (sites estáticos, mídia, backups).

### Mercado, cases e tendências

Aplicações web modernas enfrentam três desafios: alta disponibilidade, baixa latência e segurança robusta. A combinação S3, CloudFront e ELB é a resposta padrão na AWS.

**Case Condé Nast** (Vogue, The New Yorker): para unificar as publicações digitais globais em uma plataforma, precisava entregar conteúdo rapidamente a milhões de leitores e suportar picos sem falhas. Arquitetura: S3 para ativos estáticos (imagens, CSS), CloudFront para cache em pontos de presença globais e ELB para distribuir as requisições dinâmicas entre instâncias EC2. Resultado: plataforma unificada, performance drasticamente melhor e custos operacionais reduzidos.

O mercado busca quem saiba orquestrar esses serviços: configurar S3 para sites estáticos, implementar estratégia de cache eficiente no CloudFront e balancear carga com o ELB.

**Tendências**:

- Computação de borda (Edge Computing) com **Lambda@Edge** e **CloudFront Functions**, executando código perto do usuário para personalizar conteúdo e tomar decisões de segurança antes de a requisição chegar à origem.
- Segurança na borda mais inteligente, com AWS WAF integrado nativamente ao CloudFront para mitigar DDoS e outras ameaças de forma proativa.

### O que você viu nesta aula

Os três pilares para entregar aplicações modernas com alta performance, disponibilidade e segurança na AWS: CloudFront, Elastic Load Balancer e Amazon S3; como atuam isoladamente e como se integram em arquiteturas escaláveis e eficientes.

### Referências

- AMAZON WEB SERVICES. Amazon CloudFront: Recursos. 2024. Disponível em: https://aws.amazon.com/pt/cloudfront/resources/?nc=sn&loc=5&dn=1. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. Como o Elastic Load Balancing funciona. 2024. Disponível em: https://docs.aws.amazon.com/pt_br/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html. Acesso em: 23 jun. 2025.
- CLOUDFLARE. Modelo OSI (Open Systems Interconnection). 2024. Disponível em: https://www.cloudflare.com/pt-br/learning/ddos/glossary/open-systems-interconnection-model-osi/. Acesso em: 23 jun. 2025.
- CLOUDFLARE. O que é uma CDN? 2024. Disponível em: https://www.cloudflare.com/pt-br/learning/cdn/what-is-a-cdn/. Acesso em: 23 jun. 2025.
- STORMACQ, S. New: Application Load Balancer Simplifies Deployment with Weighted Target Groups. 2019. Disponível em: https://aws.amazon.com/pt/blogs/aws/new-application-load-balancer-simplifies-deployment-with-weighted-target-groups/. Acesso em: 23 jun. 2025.
- TRACEY, S. Amazon S3 Intelligent-Tiering: Improved Cost Optimizations for Short-Lived and Small Objects. 2024. Disponível em: https://aws.amazon.com/pt/blogs/aws/amazon-s3-intelligent-tiering-further-automating-cost-savings-for-short-lived-and-small-objects/. Acesso em: 23 jun. 2025.

Palavras-chave: Balanceamento. Resiliência. Arquivos.

## Etapa 10: Secrets, WAF, ACM e Route53

### O que vem por aí

Quatro serviços fundamentais para segurança, confiabilidade e disponibilidade: Secrets Manager, WAF (Web Application Firewall), ACM (AWS Certificate Manager) e Route 53. Gerenciar credenciais com segurança, proteger o ambiente contra ataques, emitir e gerenciar certificados SSL e configurar domínios e zonas DNS.

### Hands on

Criar e testar segredos com o AWS Secrets Manager, configurar certificados com o ACM e aplicar políticas de DNS com o Route 53. O WAF é apresentado apenas de forma teórica no vídeo, para entender as possibilidades do serviço. Passo a passo direto no console da AWS; reproduza os comandos e explore os recursos.

### Camadas de segurança além do controle de acesso

Segurança e governança não se limitam a controle de acesso e autenticação. Há camadas igualmente importantes: proteção contra ameaças externas, gestão de certificados digitais, resolução de nomes de domínio e armazenamento seguro de informações sensíveis.

- Armazenar com segurança senhas, chaves de API e dados de conexão com banco é exigência básica; mal gerenciados, viram pontos críticos de ataque e vazamento.
- A web sofre tentativas constantes de exploração (injeções de código, acessos maliciosos); firewalls de aplicação analisam o tráfego, bloqueiam padrões suspeitos e aplicam políticas perto do usuário.
- Certificados digitais garantem autenticidade e confidencialidade via HTTPS; automatizar emissão, renovação e gestão é estratégico para quem tem alto volume de acessos.

(Figura 1: arquitetura.)

### Gerenciamento de segredos e AWS Secrets Manager

Gerenciamento de segredos: processos e ferramentas para armazenamento, controle de acesso e rotatividade de informações sensíveis usadas por aplicações, scripts e serviços automatizados: senhas de banco, tokens de autenticação, chaves criptográficas e certificados de acesso a APIs.

Sem estratégia segura, essas credenciais acabam expostas em arquivos de configuração, variáveis de ambiente mal protegidas ou repositórios de código, causa de boa parte dos incidentes de segurança. Soluções automatizadas guardam os dados em cofres digitais com acesso controlado e auditoria, rotação automática de senhas, criptografia em repouso e em trânsito e integração com autenticação e autorização.

(Figura 2: Secrets Manager.)

O **AWS Secrets Manager**:

- Armazena e recupera segredos com segurança via chamadas autenticadas à API.
- Integração nativa com RDS, Redshift e Lambda, permitindo atualizar senhas automaticamente sem impacto nas aplicações.
- Versionamento de segredos.
- Permissões granulares via IAM.
- Eventos que disparam ações automaticamente ao atualizar ou expirar um segredo.

### WAF: firewalls de aplicação

Aplicações expostas na internet sofrem de bots que testam credenciais a ataques sofisticados que exploram falhas de código.

(Figura 3: o que é WAF.)

Diferente dos firewalls tradicionais (camadas mais baixas da rede), os WAFs operam diretamente no tráfego HTTP e HTTPS, analisando o conteúdo das requisições e detectando padrões maliciosos como comandos SQL injetados, scripts de navegação forçada ou exploração de vulnerabilidades conhecidas. Também oferecem limitação de taxa de requisições, bloqueio geográfico, controle por cabeçalhos e bloqueio por reputação de IPs, prevenindo comportamentos anômalos, negação de serviço e exploração em larga escala.

### AWS WAF

- Regras personalizadas para bloquear ou permitir requisições por método HTTP, parâmetros da URL, padrões de string e integrações com serviços de análise de tráfego.
- Integração direta com Application Load Balancer e Amazon CloudFront, protegendo aplicações distribuídas e de alta disponibilidade.
- Dashboards simples para acompanhar métricas, ajustar regras e aplicar filtros em tempo real.

### Certificados digitais, SSL e TLS

A troca de informações exige confidencialidade, integridade e autenticidade, fornecidas por certificados digitais dentro de protocolos como SSL e TLS, que estabelecem conexões criptografadas entre navegador e servidor.

(Figura 4: o que é SSL.)

Com HTTPS, o certificado garante que os dados não sejam interceptados ou alterados e atesta que o site pertence à entidade informada, ajudando a prevenir phishing e falsificação. Navegadores modernos sinalizam como "não seguro" qualquer site sem HTTPS.

A gestão manual é trabalhosa: emitir, renovar, instalar e monitorar validade. Um descuido derruba serviços ou gera alertas aos usuários, prejudicando a reputação; por isso empresas automatizam.

### AWS Certificate Manager (ACM)

- Emite **certificados públicos gratuitos** para domínios validados e gerencia certificados privados internos.
- Elimina etapas manuais do ciclo de vida e reduz erros operacionais; útil com múltiplas aplicações e serviços distribuídos.
- **Validação por DNS ou por e-mail**; depois da validação inicial, o ACM **renova automaticamente**, evitando falhas por certificado expirado.
- **ACM Private CA**: autoridade certificadora própria para sistemas internos que exigem comunicação segura entre microsserviços, APIs ou workloads isolados.
- Certificados anexados facilmente a **Application Load Balancer, CloudFront e API Gateway**: HTTPS em poucos cliques, sem carregar arquivos de certificado manualmente.

Boas práticas: ativar sempre a renovação automática e monitorar certificados ativos via CloudWatch; separar certificados públicos e privados para não expor dados internos; usar certificados curinga (wildcard) para múltiplos domínios ou subdomínios, reduzindo a quantidade de certificados. Em cenários avançados, políticas de controle de acesso definem quem pode emitir, renovar ou revogar certificados, alinhando-se a governança e compliance em ambientes regulados.

### DNS e Amazon Route 53

(Figura 5: diagrama do Domain Name System.)

O DNS é um dos pilares da internet: traduz nomes amigáveis, como `www.meuaplicativo.com`, em endereços IP. Estrutura hierárquica e distribuída: cada solicitação passa por uma cadeia de servidores que refina a resposta até o IP correto, em milissegundos e de forma transparente. Recursos como **TTL (Time to Live)**, que define por quanto tempo uma resposta pode ficar em cache, e mecanismos de failover e balanceamento baseados em políticas de resposta.

Nas empresas, o DNS é estratégico: direcionar tráfego por localização geográfica, redirecionar para ambientes redundantes em caso de falha e aplicar políticas de segurança por domínio.

O **Amazon Route 53** gerencia domínios e resolve nomes na AWS:

- Zonas de DNS públicas e privadas e gestão simples de registros.
- Roteamento inteligente por latência, geolocalização e integridade do destino.
- Atua como **registrador de domínios**, gerenciando o ciclo de vida do domínio da compra à configuração, facilitando automação, versionamento de configurações via código e resposta rápida a mudanças.

(Figura 6: Route 53.)

### Políticas de roteamento do Route 53

- **Simples**: um único destino para o nome de domínio.
- **Baseado em latência**: envia o tráfego à região com menor latência para o usuário, melhorando aplicações distribuídas globalmente.
- **Geográfico**: respostas diferentes conforme a localização do usuário; útil para direcionar conteúdo ou respeitar políticas regionais.
- **Failover**: redireciona automaticamente para destinos de backup quando o principal está indisponível; crucial para alta disponibilidade e continuidade.
- **Ponderado (weighted)**: distribui requisições entre recursos com base em pesos definidos; ideal para escalonamento ou balanceamento gradual.

Zonas:

- **Públicas**: visíveis na internet, para domínios acessíveis por qualquer usuário.
- **Privadas**: funcionam dentro da VPC, resolvendo nomes só para recursos internos; isolam ambientes, separam desenvolvimento e produção e aumentam a segurança.

A configuração pode ser manual via console ou automatizada com CloudFormation ou Terraform. O Route 53 faz parte da estratégia de resiliência, controle de tráfego e organização de ambientes híbridos e multirregionais.

### Visão integrada das quatro camadas

Segurança e disponibilidade resultam de camadas complementares:

- **Secrets Manager**: aplicações acessam informações sensíveis sem expô-las no código ou em configuração; isolamento de credenciais e rotação automatizada reduzem acessos indevidos.
- **WAF**: linha de defesa contra ameaças externas, filtrando requisições maliciosas e aplicando regras personalizadas; protege APIs e interfaces web contra injeções de código e bots.
- **ACM**: comunicações protegidas por criptografia, sem a complexidade da gestão manual e sem interrupções por certificados expirados.
- **Route 53**: garante que os serviços sejam encontrados com eficiência e segurança; redireciona tráfego em falhas, distribui requisições e protege recursos internos com zonas privadas.

Juntos promovem automação, escalabilidade e segurança, encaixando-se em microsserviços, aplicações de alta demanda e ambientes multirregião.

### Mercado, cases e tendências

Confiança é a moeda da economia digital. Empresas buscam especialistas em DevSecOps e Cloud Security que gerenciem segredos e chaves de API de forma segura e rotativa com Secrets Manager, emitam e renovem certificados SSL/TLS automaticamente com ACM, filtrem tráfego malicioso com WAF e garantam que usuários cheguem ao destino de forma rápida e resiliente com o roteamento avançado do Route 53.

**Case Autodesk**: defesa em múltiplas camadas na AWS para proteger aplicações web e APIs e garantir experiência global consistente. Route 53 gerencia o tráfego DNS globalmente para otimizar latência e disponibilidade; ACM automatiza a gestão de milhares de certificados SSL/TLS para inúmeros domínios; AWS WAF é a primeira linha de defesa contra exploits web e tráfego malicioso, permitindo que as equipes inovem com a infraestrutura protegida.

**Tendências**:

- **Segurança como Código (Security as Code)**: regras do WAF, políticas de acesso e configurações de DNS versionadas e implantadas por pipelines de CI/CD como o código da aplicação; mais ágil, consistente e menos sujeito a erro humano.
- WAF incorporando Machine Learning para detectar novas ameaças automaticamente.
- Route 53 com gerenciamento de tráfego DNS (latência e geolocalização) cada vez mais sofisticado.
- Segurança e confiabilidade passando de reativas para preditivas e automatizadas.

### O que você viu nesta aula

Os quatro serviços que tornam aplicações mais seguras, confiáveis e eficientes: AWS Secrets Manager, AWS WAF, AWS Certificate Manager e Route 53, base para arquiteturas em nuvem que protegem dados, melhoram a experiência do usuário e facilitam a gestão.

### Referências

- AMAZON WEB SERVICES. Amazon Route 53. 2024. Disponível em: https://aws.amazon.com/pt/route53/. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. AWS WAF. 2024. Disponível em: https://aws.amazon.com/pt/waf/. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. Amazon S3 Intelligent-Tiering: automação ainda maior para economia com objetos pequenos e de curta duração. AWS Blog. 2024. Disponível em: https://aws.amazon.com/pt/blogs/aws/amazon-s3-intelligent-tiering-further-automating-cost-savings-for-short-lived-and-small-objects/. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. Arquitetura de zona de perímetro com AWS Network Firewall. 2024. Disponível em: https://docs.aws.amazon.com/pt_br/prescriptive-guidance/latest/migration-perimeter-zone-apps-network-firewall/architecture.html. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. AWS Secrets Manager. 2024. Disponível em: https://aws.amazon.com/pt/secrets-manager/. Acesso em: 23 jun. 2025.
- CLOUDFLARE. O que é SSL? 2024. Disponível em: https://www.cloudflare.com/pt-br/learning/ssl/what-is-ssl/. Acesso em: 23 jun. 2025.
- CLOUDFLARE. O que é um WAF (Web Application Firewall)? 2024. Disponível em: https://www.cloudflare.com/pt-br/learning/ddos/glossary/web-application-firewall-waf/. Acesso em: 23 jun. 2025.
- QUIZLET. AWS Route 53: Domain Name System (DNS) diagram. 2024. Disponível em: https://quizlet.com/307436736/aws-route-53-domain-name-system-dns-diagram/. Acesso em: 23 jun. 2025.

Palavras-chave: WAF. Route 53. Secrets.

## Etapa 11: AWS Academy e Certificações

### O que vem por aí

O que são certificações em nuvem com AWS, como funcionam e por que fazem diferença na carreira. O programa AWS Academy, seus recursos práticos e como ajuda estudantes e profissionais a se prepararem para as certificações.

### Hands on

Simular a jornada de um estudante usando os recursos da AWS Academy para se preparar para uma certificação: acessar um curso da Academy (ou equivalente gratuito), explorar os módulos, realizar um laboratório básico e identificar os principais tópicos cobrados na certificação Cloud Practitioner.

### Recapitulação do módulo

O módulo começou pelos fundamentos da computação em nuvem e o que diferencia a AWS; seguiu com controle de acesso via IAM, redes personalizadas com VPC e instâncias EC2. Depois, containers com ECS e EKS, bancos relacionais e não relacionais com RDS, Aurora e DynamoDB, serverless com Lambda e API Gateway e monitoramento com CloudWatch. Por fim, distribuição de conteúdo com CloudFront, balanceamento com Load Balancer, objetos no S3, proteção de APIs com WAF, segredos com Secrets Manager, certificados com ACM e DNS com Route 53. Esta aula fecha com capacitação oficial via AWS Academy e certificações reconhecidas mundialmente.

### Certificações em nuvem

A demanda por profissionais de nuvem cresce todo ano. Certificações em arquitetura de nuvem são credenciais que comprovam habilidades específicas: forma prática e reconhecida de validar conhecimento em arquitetura, segurança, desenvolvimento, operações e outros temas. Não são exigidas por lei, mas agregam muito valor ao currículo.

Diferente de um curso comum, a certificação envolve uma **prova aplicada por órgão oficial** (no caso, a própria AWS), com estrutura padronizada, exigindo domínio prático e teórico. A maioria é dividida em níveis (iniciante, intermediário, avançado) e por áreas (infraestrutura, desenvolvimento, dados, segurança).

(Figura 1: Certification.)

Três grandes grupos:

- **Foundational** (entrada): por exemplo, Cloud Practitioner, introdutória e cobre fundamentos.
- **Associate** (intermediária).
- **Professional** e **Specialty** (avançadas ou especializadas).

Quem atua com arquitetura de soluções (desenvolvedor, arquiteto, administrador, engenheiro de dados) segue para Associate ou Professional, com exames mais técnicos sobre ferramentas, boas práticas e problemas complexos de segurança, performance e escalabilidade. Há também divisão por especialidade (Machine Learning, segurança, banco de dados, rede), permitindo montar um "mapa" de conhecimento.

### Níveis de certificação AWS

(Figura 2: Foundational.)

**Foundational**

- Conhecimento básico de nuvem; para quem está começando ou para perfis não técnicos que trabalham em times ou empresas que usam nuvem. É possível fazer a prova de casa, pelo computador, seguindo algumas regras (agendamento de exame).
- Pré-requisitos: recomendado ter pelo menos 6 meses de experiência em AWS (técnica, gestão, vendas etc.).
- Formato: múltipla escolha.
- Tempo: 90 minutos.
- Custo: 100 dólares.
- Áreas: básico de arquitetura AWS, proposta de valor da nuvem, serviços essenciais, básico de segurança e compliance, modelo compartilhado de segurança, básico de operações e deploy.

(Figura 3: Associate.)

**Associate**

- Nível básico para pessoas técnicas com alguma vivência em AWS. Cada certificação é voltada a um perfil: Arquiteto de Soluções, SysOps e Desenvolvedor.
- Formato: múltipla escolha.
- Tempo: 90 minutos.
- Custo: 150 dólares.

(Figura 4: Professional.)

**Professional**

- Nível avançado, com muita experiência nos assuntos. Provas complexas pelo grande conjunto de áreas e pela complexidade das questões; junto com Specialty, as certificações AWS mais difíceis.
- Formato: múltipla escolha.
- Tempo: 170 minutos.
- Custo: 300 dólares.

(Figura 5: Specialty.)

**Specialty**

- Semelhante ao Professional, mas com mergulho profundo em um tema específico, como Big Data ou Security. Para quem quer se especializar. Além das mostradas na figura, existe uma certificação adicional de Alexa Skill Builder.
- Formato: múltipla escolha.
- Tempo: 170 minutos.
- Custo: 300 dólares.

### Método de preparação do professor

O professor compartilha o método que funciona para ele (com experiência autodidata, em projetos reais e consultoria), a ser adaptado à realidade de cada um. Para quem tem pouco tempo, sites com bom material, principalmente em vídeo:

- **ACloudGuru**: ótimo para quem não é de TI ou prefere abordagem generalista. Simulados ajudam a reforçar os temas, embora não representem a prova com total fidelidade.
- **LinuxAcademy**: mais técnico e prático, com laboratórios que simulam bem o uso real da AWS.
- **Udemy**: boa opção, principalmente com cursos do ACloudGuru em desconto.

Metodologia:

1. Pelo menos dois anos de experiência prática com AWS na área da certificação desejada, boa capacidade de leitura dinâmica e muito foco.
2. Hábito de ler pelo menos dois whitepapers por semana sobre temas de interesse, com ou sem certificação em mente, criando cultura de estudo contínuo.
3. Fazer simulados no ACloudGuru, Whizlabs (o preferido) ou LinuxAcademy e analisar as áreas de desempenho mais fraco.
4. Para esses tópicos, buscar os whitepapers correspondentes e assistir a vídeos do AWS re:Invent no YouTube.
5. Refazer o simulado e, a cada questão errada, ler a explicação detalhada e consultar as referências indicadas (documentação oficial da AWS, no caso do ACloudGuru, ou os comentários do Whizlabs), ajustando o conhecimento de forma direcionada.

### AWS Academy

(Figura 6: Academy.)

Iniciativa da AWS para o ambiente educacional: universidades, faculdades e centros de ensino preparam alunos para o mercado de nuvem com conteúdos alinhados às certificações oficiais.

- Instituições parceiras recebem trilhas completas, materiais de apoio, laboratórios em ambiente real da AWS e, em alguns casos, vouchers de desconto para as provas oficiais.
- Conteúdo dividido em trilhas conectadas às certificações: Cloud Practitioner, Solutions Architect Associate e trilhas específicas como Data Analytics e Machine Learning. Modular e adaptável ao curso ou turma.
- Capacitação de instrutores: pelo menos um professor da instituição precisa passar por processo de habilitação.

Estudar por conta própria vs AWS Academy: sozinho, é preciso montar a trilha, buscar materiais confiáveis e testar serviços na conta pessoal, o que pode gerar custos. Na Academy tudo vem organizado e sem pagar para praticar. Além disso:

- Formação completa: não só usar a AWS, mas entender fundamentos de arquitetura de sistemas, segurança, boas práticas e padrões de mercado.
- Laboratórios práticos em ambiente de nuvem temporário, sem risco de custo, com desafios que simulam situações reais.
- Suporte à certificação: simulados, guias de estudo e, em alguns casos, vouchers com desconto.

### Estrutura dos cursos da Academy

Estrutura modular: blocos por tema com objetivos, atividades práticas e avaliações próprias.

- **Cloud Practitioner**: começa com fundamentos de computação em nuvem, tipos de serviço (IaaS, PaaS e SaaS), segurança e arquitetura global da AWS; evolui para os principais serviços, como EC2, S3, RDS e IAM, entre outros. Cada módulo tem textos, vídeos e exercícios interativos.
- **Solutions Architect Associate**: design de soluções escaláveis, alta disponibilidade, balanceamento de carga, redes híbridas, banco de dados e segurança avançada, com laboratórios mais próximos da realidade empresarial.
- Habilidades transversais: pensamento crítico, resolução de problemas e comunicação técnica, importantes em equipes multidisciplinares e projetos de transformação digital.

### Dicas para a prova e valor da certificação

- Antes da prova: revisar com base no guia oficial da certificação, resolver simulados e, na prova remota, fazer um teste de ambiente para garantir que tudo funciona.
- Durante a prova: perguntas práticas, voltadas ao cotidiano de quem trabalha com nuvem; algumas serão desafiadoras mesmo para quem estudou bem. Manter a calma, ler com atenção e raciocinar com base na experiência dos laboratórios e materiais.
- Uma certificação AWS representa competências reconhecidas mundialmente e muitas vezes é critério de seleção em DevOps, arquitetura de soluções, back-end e engenharia de dados.
- Além do retorno financeiro, ajuda a direcionar a carreira, revelando afinidades (Machine Learning, Big Data, segurança, arquitetura). A certificação não é o fim, mas um passo em uma jornada contínua de aprendizado.

### Mercado, cases e tendências

Validar habilidades é decisivo em um mercado competitivo. Pesquisas como as da Global Knowledge apontam consistentemente as certificações AWS entre as mais bem pagas e procuradas do mundo. Para as empresas, um profissional certificado tem conhecimento padronizado e reconhecido pela AWS; para quem começa, a Cloud Practitioner funciona como passaporte para entrevistas e prova de compromisso com a carreira.

Programas como o AWS Academy pavimentam a jornada com ambiente estruturado, hands-on labs e conteúdo oficial, resolvendo a dor de ganhar experiência prática sem emprego na área ou sem gastar com conta pessoal na AWS.

**Case**: incontáveis profissionais que migraram de áreas não relacionadas à tecnologia, ou recém-formados, que ao concluir um curso da Academy e obter a certificação conseguiram o primeiro emprego em nuvem muito mais rápido do que quem não tinha essa validação.

**Tendências**:

- Especialização contínua: Cloud Practitioner como porta de entrada; crescimento via Associate (Arquiteto, Desenvolvedor, SysOps) e Professional (Arquiteto, DevOps).
- Mercado migrando de demanda genérica por "conhecimento em nuvem" para especialistas em segurança, redes, dados e machine learning.
- Aprendizado contínuo e recertificação periódica para acompanhar o ritmo de inovação da AWS. A carreira em nuvem não tem linha de chegada; as certificações são marcos de progresso.

### O que você viu nesta aula

Certificações em nuvem são mais do que títulos: representam uma evolução na forma como profissionais de tecnologia constroem suas carreiras. O AWS Academy atua na formação de novos profissionais com conteúdos atualizados, recursos gratuitos e laboratórios práticos.

### Referências

- AMAZON WEB SERVICES. AWS Certified Security: Specialty. 2024. Disponível em: https://aws.amazon.com/pt/certification/certified-security-specialty/. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. AWS Certified Solutions Architect: Professional. 2024. Disponível em: https://aws.amazon.com/pt/certification/certified-solutions-architect-professional/. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. Certificações AWS. 2024. Disponível em: https://aws.amazon.com/pt/certification/. Acesso em: 23 jun. 2025.
- AMAZON WEB SERVICES. AWS Training and Certification. 2024. Disponível em: https://www.aws.training/Certification. Acesso em: 23 jun. 2025.

Links citados no texto da aula:

- Agendamento de exame: https://aws.amazon.com/pt/certification/certification-prep/testing/
- ACloudGuru: https://www.pluralsight.com/cloud-guru
- LinuxAcademy: https://www.linuxtrainingacademy.com/
- Udemy: https://www.udemy.com/

Palavras-chave: Treinamento. Especialização. Certificação.
