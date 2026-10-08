# Arquitetura de aplicações: relatório de estudo

> Conteúdo extraído dos 4 PDFs da disciplina "Arquitetura de aplicações" (DevOps e Arquitetura Cloud, Fase 1, FIAP POSTECH). Cada aula vira uma etapa. Referências das aulas consultadas em maio de 2025. As figuras dos PDFs não vêm no texto extraído; ficam indicadas pela legenda e fonte originais.

## Etapa 01: Introdução a Monolito, Arquitetura em camadas e Microsserviços

### O que vem por aí

A aula explora como a arquitetura de microsserviços pode ser utilizada para refatorar sistemas complexos construídos com arquitetura monolítica em soluções mais modulares, flexíveis e escaláveis. Começa explicando o que é um monólito para depois avançar para o conceito de microsserviços e seus principais benefícios.

### Hands on

A aula prática explica os pontos que definem uma aplicação monolítica por meio de um sistema fictício desenvolvido para uma empresa de envio de testes. Em seguida, apresenta um desenho básico da arquitetura de um sistema monolito.

### O sistema fictício (empresa de envio de testes)

Figura 1: Arquitetura básica do sistema monolito (fonte: elaborado pelo autor, 2025).

O sistema possui cinco (5) áreas:

- Autenticação;
- ADM;
- Professor;
- Empresa;
- Candidato.

Figura 2: Funcionalidades básicas de cada perfil (fonte: elaborado pelo autor, 2025). Demonstra as responsabilidades iniciais de cada uma dessas áreas.

Na parte de código, o sistema foi desenvolvido utilizando as boas práticas da época, que focam na arquitetura em camadas.

Figura 3: Arquitetura em camadas (fonte: elaborado pelo autor, 2025).

### Microsserviços: definição

Microsserviços são uma abordagem arquitetural que divide uma aplicação em um conjunto de serviços pequenos, independentes e focados em uma única tarefa ou funcionalidade. Esses serviços, chamados de "micro", são autônomos e podem ser desenvolvidos, implantados e escalados independentemente.

Geralmente se utiliza REST para a comunicação entre eles. Por isso é muito importante aplicar, em cada retorno de API, os status codes corretos, para que não seja devolvido a um microsserviço um status code 200 no caso de um erro.

Figura 4: Retornos de Status Code REST (fonte: https://leandromtr.com/codigos-de-status-http/, 2025).

Ao contrário da arquitetura monolítica (onde todos os componentes estão interligados e dependem uns dos outros), os microsserviços permitem que cada parte da aplicação evolua e se mantenha de forma isolada.

### Arquitetura monolítica

Antes de mergulhar nos microsserviços, é essencial compreender a arquitetura monolítica, pois ela é a abordagem tradicional que os microsserviços vieram transformar. A arquitetura monolítica refere-se a um design de software onde todos os componentes de uma aplicação são interligados em uma única unidade. Front-end, back-end, lógica de negócio, integração com o banco de dados e outros módulos coexistem no mesmo bloco de código e são implantados como uma única entidade.

Características de uma arquitetura monolítica:

- **Unidade coesa**: a aplicação é uma unidade única e coesa. Todos os componentes estão interligados, então uma única alteração em qualquer módulo exige a recompilação e reimplantação de toda a aplicação.
- **Dependências fortes**: todos os módulos dependem uns dos outros. Uma falha em um componente pode afetar todo o sistema.
- **Dificuldade em escalar**: se uma parte específica precisar de mais recursos, é necessário escalar toda a aplicação, o que pode resultar em desperdício de recursos.
- **Ciclo de desenvolvimento lento**: como toda a aplicação é um grande bloco de código, qualquer mudança pode introduzir riscos e exigir testes extensivos, tornando mais lentos os ciclos de desenvolvimento, testes e implantação.
- **Manutenção complexa**: à medida que a aplicação cresce, a manutenção fica mais difícil. Adicionar recursos ou corrigir bugs pode ser arriscado, pois as alterações podem ter impactos inesperados em outras partes do sistema.

### Case: sistema de streaming da TV Bandeirantes (versão monolítica)

O autor traz como exemplo um sistema em que trabalhou na TV Bandeirantes.

Figura 5: Exemplo de arquitetura monolito, mostrando a solution da primeira versão do projeto (fonte indicada no PDF: https://leandromtr.com/codigos-de-status-http/, 2025).

Era um sistema de gerenciamento de streaming com as seguintes funcionalidades:

- Receber dados do satélite por meio do master;
- Converter os vídeos em um formato para executar nos navegadores;
- Cortar os vídeos (pequenos trechos);
- Upload dos vídeos em uma rede social.

Essas eram apenas as funcionalidades básicas; dentro do sistema ainda existiam mais de três (3) perfis.

Figura 6: Apresentação simples da arquitetura (fonte: elaborado pelo autor, 2025).

A primeira versão foi desenvolvida com arquitetura monolítica: todas essas funcionalidades estavam em um único projeto, com um único banco de dados e uma única interface de acesso. Quando uma equipe precisava alterar um módulo (por exemplo, o upload dos vídeos para integrá-los a uma nova rede social), isso exigia modificar o código, testar toda a aplicação e fazer o deploy do projeto como um todo.

### Características principais dos microsserviços

- **Autonomia**: cada microsserviço é independente e responsável por uma única função da aplicação.
- **Desenvolvimento descentralizado**: equipes podem trabalhar em diferentes microsserviços, de forma isolada, usando diferentes linguagens ou tecnologias.
- **Escalabilidade**: apenas os serviços que necessitam de mais recursos são escalados, otimizando a utilização de infraestrutura.
- **Comunicação via API**: os microsserviços geralmente se comunicam por meio de APIs como REST, GraphQL, RPC (Remote Procedure Call) ou por mensageria.

### Desafios na aplicação de microsserviços

A arquitetura traz diversos benefícios, mas também implica desafios que devem ser considerados antes de adotá-la:

- **Complexidade**: embora cada microsserviço seja individualmente mais simples, o sistema como um todo tende a ser mais complicado. A comunicação entre as partes e a coordenação dos serviços exigem mais atenção.
- **Desenvolvimento e testes**: desenvolver pequenos serviços que dependem de outros requer uma mentalidade diferente da usada em sistemas tradicionais. As ferramentas disponíveis nem sempre são adequadas para lidar com dependências de múltiplos serviços, o que pode dificultar a refatoração e os testes, especialmente em ambientes de desenvolvimento rápido.
- **Governança descentralizada**: a flexibilidade pode gerar desafios de padronização. Equipes diferentes podem usar linguagens e frameworks variados, complicando a manutenção e a integração. É importante definir diretrizes comuns sem limitar excessivamente a liberdade das equipes, principalmente em áreas como logs e monitoramento.
- **Latência e comunicação entre serviços**: dividir o sistema em vários serviços pequenos pode aumentar a quantidade de comunicação necessária entre eles. Sem cuidado no design das APIs, a latência pode se acumular quando vários serviços dependem uns dos outros em uma cadeia de chamadas. Comunicação assíncrona e técnicas como filas ajudam a mitigar esses efeitos.
- **Consistência de dados**: cada serviço gerencia seus próprios dados, o que dificulta garantir consistência entre eles. A consistência eventual (que permite que diferentes partes do sistema se alinhem ao longo do tempo) é mais apropriada do que tentar manter transações rígidas no estilo ACID em todos os serviços.
- **Gerenciamento**: o sucesso com microsserviços depende de uma cultura sólida de DevOps. Correlacionar logs entre serviços distintos pode ser complicado, já que várias chamadas de serviço podem estar associadas a uma única operação de usuário. Ferramentas de monitoramento e correlação de logs tornam-se essenciais.
- **Controle de versão**: uma atualização em um serviço não deve quebrar os demais que dependem dele. Exige planejamento cuidadoso para garantir compatibilidade entre versões, já que os serviços podem ser atualizados de forma independente.
- **Competências da equipe**: sistemas distribuídos tendem a ser mais complexos, então é importante avaliar se a equipe tem as habilidades necessárias. Experiência com integração contínua, automação de infraestrutura e monitoramento de sistemas distribuídos é essencial.

### Case: o sistema de streaming com microsserviços

Observação do autor: o sistema foi dividido em microsserviços, mas não utilizou todos os pontos abaixo; eles são apenas exemplos, nem todos foram utilizados na época.

- **Receber dados do satélite**: um microsserviço com o seu próprio banco de dados, que recebe os dados do satélite e os armazena tanto em um banco de dados quanto em um storage.
- **Converter os vídeos para execução nos navegadores**: um serviço que lê o banco de dados, busca o caminho do arquivo no disco e o converte para um formato acessível aos navegadores.
- **Interface**: um projeto apenas para apresentar os dados. Em analogia à arquitetura hexagonal, aqui teríamos um ator condutor.
- **Cortar os vídeos em pequenos trechos**: um serviço que busca os trechos de um vídeo solicitados pelos usuários para criação de um clip.
- **Upload dos vídeos em uma rede social**: um serviço que recebe os dados de um canal por meio de uma fila e realiza o upload para uma determinada rede social.

Figura 7: Apresentação simples da arquitetura (fonte: elaborado pelo autor, 2025). Observação: no desenho, os serviços foram separados por responsabilidades, sem foco nas integrações como banco de dados. A ideia é mostrar um fluxo desacoplado dos serviços.

Assim, cada microsserviço pode ser ajustado ou evoluído de maneira independente, sem afetar diretamente os outros, trazendo mais flexibilidade e eficiência para a arquitetura.

### Mercado, cases e tendências

A transição de aplicações monolíticas para microsserviços não é apenas uma decisão técnica: ela reflete uma mudança profunda na forma como o mercado projeta, entrega e opera sistemas digitais. A busca por maior escalabilidade, modularidade e independência entre equipes tem impulsionado a adoção desse modelo em empresas de todos os portes.

Com o time-to-market cada vez mais crítico, as empresas priorizam arquiteturas que permitam entregas frequentes sem impactar todo o sistema. Microsserviços permitem que funcionalidades específicas evoluam de forma isolada, com menor risco e maior velocidade. Startups que precisam experimentar rapidamente e grandes organizações que buscam modernizar sistemas legados têm optado por iniciar com componentização gradual, transformando partes críticas do sistema em serviços autônomos.

Empresas como o Mercado Livre popularizaram o uso de microsserviços em larga escala, demonstrando que a abordagem permite lidar com milhões de requisições por dia mantendo alta disponibilidade e resiliência. Esses cases estabelecem os microsserviços não só como tendência, mas como parte do padrão de arquitetura moderna.

**Cultura DevOps e automação: alicerces da arquitetura moderna.** A popularização de microsserviços está ligada à maturidade em práticas DevOps. O mercado exige profissionais capazes de trabalhar com pipelines de CI/CD, containers, orquestração (Kubernetes) e monitoramento de aplicações distribuídas. Mais do que escrever código, os times precisam entender observabilidade, controle de versões entre serviços e infraestrutura como código, para que a modularidade se traduza em benefícios reais.

**Tendência à composição de serviços e APIs.** Com a expansão das plataformas digitais, a composição de sistemas por meio de APIs está cada vez mais presente. Microsserviços bem projetados tornam-se blocos reutilizáveis que podem ser combinados para formar novas experiências de usuário, inclusive com parceiros externos (integrações com redes sociais, pagamentos e analytics). Isso impulsiona o uso de gateways de API, comunicação assíncrona por eventos e estratégias de segurança distribuída.

### O que você viu nesta aula

Como a arquitetura de microsserviços pode transformar sistemas complexos e monolíticos em soluções mais modulares, flexíveis e escaláveis.

### Referências

- FIELDING, R. T. Architectural Styles and the Design of Network-based Software Architectures. 2000. Disponível em: https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm. Acesso em: 30 mai. 2025.
- PRESSMAN, R. S. Engenharia de Software: Uma Abordagem Profissional. Porto Alegre: McGraw-Hill, 2011.
- SOMMERVILLE, I. Engenharia de Software. São Paulo: Pearson, 2011.
- SOMMERVILLE, I. Software Engineering: International Version. Boston: Pearson, 2016.
- SPLUNK. REST API User Manual. 2023. Disponível em: https://docs.splunk.com/Documentation/Splunk/9.1.0/RESTUM/RESTusing. Acesso em: 30 mai. 2025.
- Figuras: https://leandromtr.com/codigos-de-status-http/

Palavras-chave: Microsserviços. HTTP. SPLUNK.

## Etapa 02: Microsserviços

### O que vem por aí

Antes de migrar os serviços para microsserviços, é necessário discutir as principais características da arquitetura de ambos os modelos (monolito e microsserviços) e entender os pontos fortes e fracos de cada proposta. A aula também aborda como a modelagem estratégica do DDD ajuda na etapa de separação dos contextos para a criação dos microsserviços.

### Hands on

A aula prática evolui o projeto (o sistema da empresa de envio de testes), arquitetando a estrutura para migrar da abordagem monolítica para microsserviços. Para isso usa uma das abordagens mais utilizadas nessa migração: a modelagem estratégica do DDD. O fluxo usado no hands on é apresentado a seguir.

### Fluxo de análise de domínio (DDD estratégico)

Figura 1: Fluxo de análise de domínio (fonte: https://learn.microsoft.com/pt-br/azure/architecture/microservices/model/domain-analysis, 2025). É o fluxo que pode ser usado na migração com a abordagem estratégica do DDD.

Depois de analisar o domínio com especialistas de negócio, chega-se à separação dos domínios da aplicação.

Figura 2: Exemplo de separação de domínio (fonte: elaborado pelo autor, 2025).

Depois dessa etapa, avança-se para o desenho dos contextos delimitados (bounded contexts).

Figura 3: Contextos limitados (fonte: elaborado pelo autor, 2025).

### Definindo os limites dos serviços

Um dos maiores desafios ao trabalhar com microsserviços é definir claramente os limites entre os serviços individuais. A ideia geral é que cada serviço seja responsável por uma única funcionalidade, mas aplicar esse conceito de maneira eficaz requer análise cuidadosa.

Não existe fórmula exata (uma "bala de prata") que leve ao design ideal. É preciso refletir profundamente sobre o domínio de negócios, os requisitos do sistema, as características arquiteturais (requisitos não funcionais) e os objetivos da aplicação. Sem essa reflexão, há o risco de criar uma arquitetura aleatória, com dependências não planejadas entre serviços, acoplamento excessivo ou interfaces mal estruturadas.

Na abordagem baseada em domínio, definir os limites adequados é um processo contínuo à medida que o sistema evolui. Em alguns casos, essa avaliação leva à necessidade de redefinir limites existentes, o que pode exigir o desenvolvimento de novas funcionalidades para adaptar o sistema às mudanças.

Os microsserviços devem ser estruturados com base nas capacidades de negócio, e não em camadas técnicas (como acesso a banco de dados ou sistemas de mensagens).

- **Baixo acoplamento e alta coesão**: os serviços devem manter baixa dependência entre si e alta coesão funcional. Um acoplamento flexível permite alterar um serviço sem modificar outros simultaneamente. A coesão funcional implica que cada serviço tenha um propósito bem definido e específico, como gerenciar contas de usuários ou registrar o histórico de entregas.
- **Esconder a complexidade do domínio**: cada serviço deve oferecer uma interface simples e abstrair os detalhes internos. Exemplo: um candidato consegue agendar um bate papo com um professor sem precisar entender como o processo é tratado internamente (alocação de recursos, lógica de agendamento).
- **Características arquiteturais por serviço**: desempenho, segurança etc. devem ser determinados individualmente para cada microsserviço. Um serviço voltado ao cliente pode priorizar desempenho e disponibilidade; um serviço de back-end pode focar em tolerância a falhas e segurança. Quando os microsserviços dependem de comunicação síncrona, essas características podem acabar sendo compartilhadas entre eles, aumentando a interdependência.

Arquitetar corretamente um sistema de microsserviços envolve mais do que separar responsabilidades: é preciso garantir que os serviços sejam robustos, escaláveis, resilientes e mantenham a comunicação fluida.

### Desenho de serviços

Um dos principais desafios é garantir que cada serviço seja coeso e tenha uma responsabilidade única, seguindo o SRP (Single Responsibility Principle) aplicado à arquitetura de software. Cada microsserviço deve refletir um domínio de negócio. No sistema apresentado na aula anterior (monolito), a divisão pode ser feita assim:

**Autenticação**: serviço responsável por gerenciar a autenticação de todos os usuários. Pensando na evolução, pode-se desenvolver um serviço de autenticação usando JWT como token. Ele cuida da segurança e do processo de login/logout, garantindo que apenas usuários autenticados acessem os demais serviços e que o token possa ser compartilhado em mais de um sistema, utilizando roles.

**Serviço do Administrador (ADM)**: fornece visão geral e controle para o usuário administrador:

- Quantidade de professores cadastrados: número total de professores no sistema.
- Quantidade de empresas vinculadas: quantas empresas estão associadas à plataforma.
- Quantidade de acessos por empresa: quantos acessos cada empresa realizou.
- Quantidade de candidatos por empresa: número de candidatos vinculados a cada empresa.

Esse serviço poderia ter apenas um banco de cache, usando a estratégia de hot cache ou cold cache e fazendo uma requisição em uma API caso necessário.

**Microsserviço do Professor**: permite que professores gerenciem suas responsabilidades na plataforma:

- Listar agendamentos: visualizar todos os agendamentos de testes em aberto;
- Colocar feedback: fornecer feedback sobre o desempenho dos candidatos.

**Microsserviço da Empresa (Company)**: focado no gerenciamento de candidatos e testes:

- Listar candidatos: visualizar todos os candidatos inscritos ou atribuídos à empresa;
- Envio de acesso: enviar credenciais de acesso para os candidatos;
- Acompanhamento de testes: acompanhar o progresso dos candidatos durante os testes.

**Microsserviço do Candidato**: lida com as atividades principais do candidato:

- Realizar teste: iniciar e concluir os seus testes;
- Ver status do teste: acompanhar o status do teste realizado (concluído, pendente ou com feedback disponível).

Esse conceito de divisão está diretamente relacionado ao Domain-Driven Design (DDD), que ajuda a definir os limites de cada serviço. Além disso, deve-se:

- **Evitar dependências fortes**: os microsserviços devem ser autônomos; evitar dependências fortes garante que cada serviço possa ser escalado e mantido de maneira independente.
- **Comunicação mínima e clara**: a comunicação entre microsserviços deve ser bem definida e mínima, para evitar dependências complexas e latências desnecessárias.

### Mercado, cases e tendências

A adoção de microsserviços se consolidou como uma das estratégias mais importantes para empresas que desejam escalar sistemas complexos com maior agilidade e autonomia de equipes. A transformação digital impulsionou a necessidade de arquiteturas mais flexíveis, modulares e alinhadas aos objetivos de negócio, abrindo espaço para a modelagem orientada ao domínio como diferencial competitivo.

Empresas com sistemas monolíticos enfrentam desafios de manutenção, evolução contínua e escalabilidade. Como resposta, o mercado investe em modernização incremental, onde a decomposição de aplicações legadas é guiada por bounded contexts, inspirada no DDD. Isso reduz o risco de reescritas totais e permite entrega contínua de valor pela modularização por domínio.

A estrutura organizacional acompanha a mudança: times multidisciplinares organizados por produto (ou domínio) tornam-se padrão. Essa tendência está ligada ao conceito "You build it, you run it", em que a mesma equipe é responsável por desenvolvimento, operação e evolução dos seus serviços, o que exige uma arquitetura desacoplada e bem definida. A arquitetura deixa de ser meramente técnica e passa a refletir a estrutura de negócio.

**Arquiteturas guiadas por observabilidade.** Não basta que os serviços sejam independentes: precisam ser observáveis, com métricas, logs estruturados e tracing distribuído. Ferramentas como Prometheus, Grafana, ELK Stack, Jaeger e OpenTelemetry cresceram exponencialmente para suportar arquiteturas distribuídas. Empresas modernas não esperam o sistema "falhar e alertar depois": o comportamento é monitorado e analisado constantemente, com alertas proativos e insights baseados em dados reais.

**Arquiteturas sustentáveis no longo prazo.** Inclui documentação viva, versionamento de contratos (com ferramentas como OpenAPI e AsyncAPI), automação de testes entre serviços e práticas de engenharia de plataforma. As empresas líderes criam plataformas internas de desenvolvimento que padronizam práticas, disponibilizam bibliotecas reutilizáveis e centralizam políticas de segurança e deploy.

### O que você viu nesta aula

Antes de migrar para microsserviços, é crucial entender as características, forças e fraquezas de ambos os modelos arquiteturais. A modelagem estratégica do DDD auxilia na separação dos contextos para a criação dos microsserviços.

### Referências

- AWS. Microsserviços. 2019. Disponível em: https://aws.amazon.com/pt/microservices/. Acesso em: 30 mai. 2025.
- BASS, L.; CLEMENTS, P.; KAZMAN, R. Software Architecture in Practice. Boston: Addison-Wesley, 2012.
- KRUCHTEN, P. Architectural Blueprints: The 4+1 View Model of Software Architecture. IEEE Software, v. 12, n. 6, p. 42-50, 1995.
- SHAW, M.; GARLAN, D. Software Architecture: Perspectives on an Emerging Discipline. Upper Saddle River: Prentice Hall, 1996.
- Figura: https://learn.microsoft.com/pt-br/azure/architecture/microservices/model/domain-analysis

Palavras-chave: Projetos de Software. Arquitetura de Software. ERP.

## Etapa 03: Banco de dados com Microsserviços

### O que vem por aí

Os principais desafios e soluções no uso de bancos de dados em arquiteturas de microsserviços: separar os dados por serviço, garantir a consistência distribuída e gerenciar transações de forma eficiente.

### Hands on

O professor apresenta um fluxo que pode ser utilizado no momento da escolha entre bancos de dados SQL e NoSQL.

### Banco de dados em microsserviços

Diferente das arquiteturas monolíticas (onde um único banco pode servir toda a aplicação), cada microsserviço pode ter seu próprio banco de dados. Isso traz autonomia e escalabilidade, mas também desafios significativos.

Nos monolitos, um banco centralizado facilita a gestão da consistência e a execução de transações ACID, garantindo operações atômicas e dados consistentes. Porém essa centralização pode virar gargalo conforme a aplicação cresce, dificultando escalabilidade e flexibilidade. A migração para microsserviços, com cada serviço gerenciando seu próprio banco, resolve esses problemas mas introduz uma nova camada de complexidade na gestão de dados.

Cada serviço pode escolher a tecnologia de banco que melhor atende às suas necessidades, seja um relacional como PostgreSQL ou um NoSQL como MongoDB. Essa independência exige que os serviços encontrem maneiras eficazes de se comunicar e manter a consistência em um ambiente distribuído; coordenação e sincronização de dados entre serviços tornam-se críticas.

### Desafios comuns

**Isolamento de dados.** Cada serviço é responsável por seu próprio conjunto de dados e não deve acessar diretamente os bancos de outros serviços. Isso promove autonomia, mas leva a desafios como sincronização de dados e possível duplicação de informações. Para contornar, os serviços se comunicam por APIs ou eventos. Exemplo: um serviço de pedidos emite um evento "pedido criado", consumido por um serviço de inventário para ajustar os níveis de estoque. Isso requer planejamento para manter os dados sincronizados em toda a aplicação.

**Consistência.** Em um monolito, a consistência é garantida diretamente por transações ACID (Atomicidade, Consistência, Isolamento, Durabilidade). Em microsserviços, garantir consistência forte pode comprometer disponibilidade e escalabilidade. Por isso muitas arquiteturas adotam a consistência eventual: os dados podem ficar temporariamente inconsistentes, mas se tornam consistentes após um período. Isso melhora disponibilidade e escalabilidade, mas exige projetar o sistema para lidar com a inconsistência temporária de forma eficiente e transparente para o usuário.

**Transações distribuídas.** Transações que envolvem múltiplos serviços requerem coordenação complexa. Um exemplo é o padrão saga: cada serviço executa uma transação local e publica um evento (ou mensagem) indicando sucesso ou falha. Se uma parte falhar, os serviços executam ações compensatórias para reverter as mudanças feitas até aquele ponto. Exemplo: em um sistema de reserva de viagens, se a reserva do voo falhar, as reservas de hotel e carro alugado também devem ser canceladas.

**Evolução de esquema.** Cada serviço pode evoluir seu esquema de forma independente, o que pode gerar incompatibilidades e dificuldades de integração. É crucial ter gerenciamento de versão robusto dos esquemas e garantir compatibilidade com versões anteriores. Ferramentas de migração como **Flyway** ou **Liquibase** gerenciam mudanças de esquema de forma segura e controlada: as alterações são versionadas e aplicadas incrementalmente, minimizando incompatibilidades e facilitando a recuperação em caso de problemas.

Para mitigar esses desafios: boas práticas de design e comunicação entre equipes, além de investimento em ferramentas de monitoramento e automação que mantenham a integridade e a consistência dos dados no sistema distribuído.

### Consistência eventual

Os dados são eventualmente consistentes, mas podem estar temporariamente inconsistentes. Melhora disponibilidade e escalabilidade, mas requer mecanismos para lidar com a inconsistência. Exemplo: em um e-commerce, um item pode aparecer disponível para dois usuários, mas só um poderá comprá-lo. O sistema deve lidar com isso de forma transparente, com mecanismos de compensação ou comunicação clara ao usuário sobre o estado da transação.

- Vantagens:
  - **Disponibilidade**: serviços permanecem altamente disponíveis, mesmo durante picos de carga.
  - **Escalabilidade**: facilita a escala horizontal, com serviços processando suas operações de forma independente.
- Desafios:
  - **Complexidade de implementação**: requer planejamento cuidadoso e mecanismos de resolução de inconsistências.
  - **Transparência para o usuário**: os usuários não devem perceber as inconsistências temporárias, ou elas devem ser resolvidas sem causar problemas de usabilidade.
- Exemplo (e-commerce): um item aparece disponível para dois usuários por causa da consistência eventual. Ao tentar comprar, apenas o primeiro que completar a transação adquire o item; o sistema notifica o segundo usuário sobre a indisponibilidade.

### Padrões de transação

**Sagas.** Cada passo de uma transação é gerenciado por um serviço separado e a coordenação é feita por mensagens. Se um passo falha, uma mensagem de compensação é enviada para desfazer as ações anteriores. Exemplo: em uma reserva de viagem, o voo é reservado por um serviço, o hotel por outro e o carro alugado por um terceiro; se o voo falhar, hotel e carro também são cancelados.

- Vantagens:
  - **Isolamento de falhas**: falhas são gerenciadas de forma localizada, sem afetar o sistema como um todo.
  - **Escalabilidade**: cada serviço escala de forma independente, gerenciando suas próprias transações.
- Desafios:
  - **Complexidade de coordenação**: coordenação complexa para garantir que as transações sejam completadas ou revertidas adequadamente.
  - **Latência**: pode ser introduzida pela comunicação assíncrona entre serviços.
- Exemplo (reserva de viagens): o cliente reserva voo, hotel e carro. Se o voo falhar, o sistema cancela automaticamente hotel e carro, para que o cliente não fique com uma reserva incompleta.

**Two-Phase Commit (2PC).** Garante que todas as partes de uma transação concordem antes de confirmá-la, mas pode introduzir latência e complexidade. Duas fases: a fase de preparação, em que todos os serviços envolvidos se preparam e confirmam que podem concluir, e a fase de commit, em que a transação é finalizada.

- Vantagens:
  - **Consistência forte**: todas as partes concordam antes de finalizar, mantendo a consistência.
  - **Segurança**: minimiza o risco de dados inconsistentes ao garantir que todos estejam prontos antes do commit.
- Desafios:
  - **Latência**: pode ser significativa, especialmente com muitos serviços.
  - **Complexidade de implementação**: requer infraestrutura robusta para coordenar os serviços.
- Exemplo (sistema bancário): uma transferência entre contas usa 2PC para que débitos e créditos só sejam realizados se todas as partes puderem ser concluídas, evitando inconsistências no saldo.

### Padrões de design

**Event Sourcing.** Em vez de manter o estado atual diretamente em tabelas, todos os eventos que causam mudanças de estado são registrados em uma sequência de eventos. O estado atual é reconstruído reexecutando esses eventos. Cada evento é imutável e representa uma mudança ocorrida (criação de um pedido, atualização de um perfil). Exemplo: em um sistema de pedidos, "pedido criado", "pedido atualizado" e "pedido enviado" são registrados em ordem cronológica; o estado do pedido pode ser reconstruído a qualquer momento reexecutando os eventos desde o início. Isso facilita a auditabilidade e permite refazer ou desfazer operações reprocessando eventos específicos.

- Benefícios:
  - **Auditabilidade**: toda mudança de estado é registrada, com histórico completo; útil para auditorias e conformidade regulatória.
  - **Consistência eventual**: como as movimentações ficam registradas em ordem, os serviços convergem para um estado consistente ao processar os mesmos eventos.
  - **Escalabilidade**: permite distribuir o processamento de eventos entre vários serviços.
- Desafios:
  - **Complexidade de implementação**: exige bom design para gestão e reprocessamento dos eventos e compreensão profunda de como modelá-los e armazená-los.
  - **Espaço de armazenamento**: armazenar todos os eventos pode consumir muito espaço em sistemas com alto volume de transações; é preciso gerenciar o armazenamento para evitar problemas de desempenho e custo.
- Exemplo (sistema de contabilidade): todas as transações financeiras são eventos; o saldo de uma conta é calculado reprocessando os eventos de depósito e retirada, permitindo rastreamento preciso de todas as operações.

**CQRS (Command Query Responsibility Segregation).** Separa as operações de comando (escrita) e consulta (leitura) em modelos diferentes, otimizando cada um para seu propósito. O modelo de comando pode ser normalizado para garantir integridade; o de consulta pode ser desnormalizado para melhorar a leitura. Em sistemas tradicionais, as mesmas entidades servem para modificar e consultar dados, mas essas operações têm requisitos diferentes. Em um e-commerce, comandos como criar, atualizar status ou cancelar um pedido priorizam integridade e consistência; consultas como listar os pedidos de um cliente ou buscar detalhes de um pedido usam modelos desnormalizados para recuperação rápida.

- Benefícios:
  1. **Escalabilidade**: leitura e escrita escalam de forma independente; um serviço pode ter várias réplicas de leitura para alta demanda de consultas sem impactar a escrita.
  2. **Desempenho**: consultas otimizadas separadamente; por exemplo, uma consulta que agrega várias tabelas pode ser pré-calculada e armazenada em formato otimizado para leitura.
  3. **Flexibilidade**: adaptar e escalar partes do sistema conforme necessidades específicas, sem comprometer outras.
- Desafios:
  - **Complexidade de implementação**: mais esforço de design; é necessário manter sincronia entre os modelos de leitura e escrita.
  - **Consistência eventual**: os dados de leitura podem ficar temporariamente desatualizados em relação à escrita, exigindo estratégias para que operações críticas fiquem sempre consistentes.
- Exemplo (e-commerce): o modelo de comando processa pedidos e atualiza o inventário; o modelo de consulta responde rapidamente a buscas de produtos e exibe catálogos.

### Ferramentas e tecnologias: SQL vs. NoSQL

A escolha entre SQL e NoSQL afeta escalabilidade, flexibilidade e desempenho. SQL (Structured Query Language) tem estrutura rígida e suporte a transações ACID. NoSQL (Not Only SQL) oferece flexibilidade de esquema e é projetado para escalar horizontalmente, suportando grandes volumes de dados e alta disponibilidade.

**SQL** (exemplos: MySQL, PostgreSQL). Esquema rígido com tabelas, colunas e tipos de dados, garantindo integridade e facilitando validação. Suporte a transações ACID, mantendo consistência e durabilidade mesmo em falhas. Consultas complexas com joins e agregações. Ideal para aplicações que exigem consistência forte e integridade, como sistemas financeiros e de processamento de pagamentos.

- Características:
  - **Estrutura rígida**: esquemas definem tabelas, colunas e tipos de dados.
  - **Transações ACID**: crucial para integridade rigorosa, como em sistemas financeiros.
  - **Consultas complexas**: joins e agregações para recuperar dados relacionados.
- Quando usar:
  - Aplicações que requerem consistência forte: sistemas bancários, processamento de pagamentos, e-commerce.
  - Aplicações que precisam garantir integridade e validade dos dados.

**NoSQL** (exemplos: MongoDB, Cassandra, Redis). Flexibilidade de esquema: a estrutura pode mudar sem migrações complexas, ideal para dados não estruturados ou semiestruturados (redes sociais, análise de big data). Projetados para escalar horizontalmente adicionando nós ao cluster. Muitos adotam consistência eventual, permitindo maior disponibilidade e particionamento.

- Características:
  - **Flexibilidade de esquema**: esquemas dinâmicos, sem migrações.
  - **Escalabilidade horizontal**: mais nós no cluster para grandes volumes e alta carga.
  - **Consistência eventual**: maior disponibilidade e particionamento.
- Quando usar:
  - Aplicações que precisam escalar rapidamente: redes sociais, análise de big data, IoT.
  - Dados não estruturados ou semiestruturados que não se encaixam em um esquema relacional rígido.

### Teorema CAP

O teorema CAP (Consistência, Disponibilidade, Particionamento) descreve as limitações de sistemas distribuídos: um sistema distribuído pode oferecer, no máximo, duas das três garantias:

- **Consistência**: todos os nós veem os mesmos dados ao mesmo tempo; após uma escrita, todos retornam a versão mais recente.
- **Disponibilidade**: toda solicitação recebe uma resposta (sucesso ou falha), mantendo o sistema operacional.
- **Particionamento**: o sistema continua funcionando mesmo que partes dele estejam desconectadas ou falhem.

Escolher entre SQL e NoSQL em microsserviços frequentemente envolve concessões baseadas no CAP. Bancos SQL tendem a priorizar consistência e disponibilidade, adequados a sistemas com transações ACID. Bancos NoSQL são projetados para tolerar partições e frequentemente priorizam disponibilidade e particionamento, aceitando consistência eventual.

### Exemplos de integração

**Exemplo 1: E-commerce.** Contexto: serviços de catálogo de produtos, carrinho de compras, pedidos e pagamentos.

- **Banco de dados por serviço**: o catálogo usa MongoDB para informações flexíveis de produtos; pagamentos usa PostgreSQL para transações seguras.
- **Consistência eventual**: Event Sourcing para gerenciar o histórico de pedidos e garantir que todos os serviços tenham uma visão consistente.
- **CQRS**: separação de comandos (adicionar item ao carrinho) e consultas (listar itens do carrinho) para otimizar desempenho.

Cada serviço é independente com seu próprio banco, promovendo autonomia e escalabilidade. Os pedidos registrados como eventos dão histórico completo e consistência eventual; o CQRS separa escrita e leitura, melhorando performance e escalabilidade.

**Exemplo 2: Plataforma de streaming.** Contexto: serviços de gerenciamento de usuários, biblioteca de mídia, reprodução de vídeos e recomendações.

- **Banco de dados por serviço**: gerenciamento de usuários usa Cassandra para escalar horizontalmente e lidar com grandes volumes; recomendações usa Elasticsearch para busca rápida.
- **CQRS**: separação da escrita (gerenciamento de mídia) e da leitura (recomendações de conteúdo).
- **Event Sourcing**: cada reprodução de vídeo é armazenada como evento, permitindo reconstruir o histórico de visualizações e oferecer recomendações personalizadas.

### Mercado, cases e tendências

Com a adoção de computação em nuvem, IoT, Big Data e Inteligência Artificial, as organizações buscam soluções escaláveis, resilientes e desacopladas, características centrais dos microsserviços.

**Adoção de microsserviços nas empresas.** Segundo estudos do Gartner e da InfoQ, mais de 75% das grandes empresas já iniciaram ou planejam iniciar a transição de monolitos para microsserviços nos próximos anos. O principal motivador é agilidade no desenvolvimento, escalabilidade sob demanda e entregas contínuas com menor risco. Amazon, Netflix, Spotify e Mercado Livre são exemplos emblemáticos, usando microsserviços para escalar globalmente com times independentes e focados por domínio de negócio.

**Tendência de especialização na persistência de dados.** A "polyglot persistence" (persistência poliglota) ganha espaço: cada microsserviço escolhe a tecnologia de banco que melhor se adapta à sua necessidade, ampliando o uso combinado de bancos SQL (como PostgreSQL) e NoSQL (como MongoDB, Redis, Cassandra e DynamoDB). Isso reforça a necessidade de profissionais que entendam trade-offs técnicos e de negócio e apliquem padrões como CQRS, Event Sourcing e Sagas para lidar com consistência e integridade de dados distribuídos.

**Plataformas e ferramentas em alta.**

- AWS DynamoDB e Azure Cosmos DB, oferecendo bancos NoSQL altamente escaláveis e globais;
- Kafka e RabbitMQ, como soluções para mensageria assíncrona entre serviços.

Esse avanço demonstra que o mercado está amadurecendo em práticas de DevOps, infraestrutura como código e observabilidade em ambientes distribuídos.

**O futuro: microsserviços inteligentes e automatizados.** Com Machine Learning embarcado em serviços e o crescimento de arquiteturas event-driven, espera-se que os microsserviços evoluam para sistemas mais inteligentes, autônomos na tomada de decisão e com integração fluida entre dados em tempo real. O movimento em direção a plataformas serverless e funções como serviço (FaaS) impulsiona uma modularização ainda mais granular, reforçando a importância de estratégias de dados bem definidas e resilientes.

### O que você viu nesta aula

Os desafios e soluções do uso de bancos de dados em microsserviços: a importância de isolar dados por serviço e os desafios de manter consistência e integridade em ambiente distribuído. Foi discutida a diferença entre bancos de dados por serviço e bancos de dados compartilhados, sendo a prática recomendada que cada serviço tenha seu próprio banco.

### Referências

- AMAZON WEB SERVICES. Amazon DynamoDB. 2024. Disponível em: https://aws.amazon.com/dynamodb/. Acesso em: 30 mai. 2025.
- AMAZON WEB SERVICES. O que é a tecnologia blockchain? 2024. Disponível em: https://aws.amazon.com/pt/what-is/blockchain/. Acesso em: 30 mai. 2025.
- MICROSOFT AZURE. Azure Cosmos DB: Globally Distributed, Multi-Model Database. 2024. Disponível em: https://azure.microsoft.com/en-us/services/cosmos-db/. Acesso em: 30 mai. 2025.
- Gartner (estudo citado): https://www.gartner.com/peer-community/oneminuteinsights/omi-microservices-architecture-have-engineering-organizations-found-success-u6b

Palavras-chave: Banco de dados, Arquitetura de Software, Microsserviços, CQRS, Event Sourcing, CAP, SQL, NoSQL.

## Etapa 04: Comunicação entre Microsserviços

### O que vem por aí

Alguns dos padrões de comunicação entre microsserviços: diferenças entre comunicação síncrona e assíncrona e o uso de eventos e mensagens para integração.

### Hands on

A aula prática explora os principais padrões de comunicação entre microsserviços, analisando suas características, benefícios e quando aplicá-los de forma eficaz em arquiteturas distribuídas.

### Introdução

À medida que as aplicações migram para microsserviços, a comunicação entre os serviços torna-se um aspecto crucial do design e da implementação. Como cada microsserviço é autônomo e independente, a forma como eles interagem determina a performance, a escalabilidade e a resiliência do sistema. A aula explora os padrões de comunicação, o melhor momento para usar cada um e as ferramentas que os suportam.

### Comunicação síncrona

O serviço que faz a solicitação (cliente) espera pela resposta do serviço chamado (servidor) antes de continuar o processamento. Padrão muito comum em APIs RESTful ou gRPC, com requisições via HTTP e resposta retornada imediatamente.

**REST (Representational State Transfer)** é um estilo de arquitetura de software e de comunicação para projetar sistemas distribuídos, principalmente na web. Permite que sistemas interajam por solicitações HTTP de forma textual, seguindo princípios e restrições que promovem escalabilidade, simplicidade e flexibilidade. Características de uma API REST:

- **Estado representacional**: cada recurso é representado em um formato específico (JSON ou XML) e os estados são transferidos entre cliente e servidor por essas representações textuais.
- **Comunicação cliente-servidor**: o cliente faz solicitações e o servidor responde, com separação clara de responsabilidades.
- **Sem estado (stateless)**: cada solicitação deve conter todas as informações necessárias para ser compreendida e processada, como um pacote. O servidor não mantém estado entre solicitações, o que melhora escalabilidade e tolerância a falhas.
- **Operações HTTP**: os métodos HTTP (GET, POST, PUT, DELETE) representam operações sobre os recursos.
- **URI (Uniform Resource Identifier)**: cada recurso é acessado por um URI único, o que torna o rastreamento de dados mais fácil e seguro.
- **Cache**: respostas podem ser armazenadas em cache para melhorar desempenho e reduzir a latência de rede.
- **Interface uniforme**: interface uniforme para acessar e manipular recursos, facilitando descoberta e entendimento da API.
- **Camadas**: a arquitetura pode ser implementada em camadas, cada uma com sua responsabilidade, sem conhecer detalhes das outras.

REST é amplamente usado em aplicações web e móveis e se tornou a abordagem padrão de APIs pela simplicidade e escalabilidade. Atenção às respostas (responses): elas incluem os códigos de status do protocolo HTTP, além dos dados de conteúdo, e podem ser usadas para implementar métricas de controle e monitoramento de falhas e erros. Os códigos seguem um padrão adotado pela comunidade que desenvolve soluções para a internet.

Figura 1: Response HTTP (fonte: https://www.infidigit.com/blog/http-status-codes/, 2025).

**gRPC** é uma alternativa à comunicação baseada em HTTP/texto, desenvolvida pelo Google, que permite comunicação rápida e eficiente entre microsserviços usando a serialização Protocol Buffers (protobuf) para transmitir mensagens em binário, reduzindo latência e melhorando a performance.

- Vantagens:
  - **Simplicidade**: implementar e usar APIs RESTful é relativamente simples, pois as pessoas desenvolvedoras conhecem os padrões HTTP.
  - **Controle de fluxo**: o cliente obtém resposta imediata e pode decidir com base no resultado.
- Desvantagens:
  - **Acoplamento temporal**: o cliente depende do tempo de resposta do servidor; se o servidor estiver fora do ar ou lento, o cliente é afetado.
  - **Escalabilidade**: em alta carga, serviços dependentes de comunicação síncrona podem ter dificuldades por lidar com múltiplas conexões simultâneas.

Figura 2: Exemplo de serviços com integração HTTP (fonte: elaborado pelo autor, 2024).

### Comunicação assíncrona

Baseada em mensagens: o serviço solicitante envia uma mensagem e não precisa esperar resposta imediata; o receptor processa a solicitação em seu próprio tempo. Usa mensageria com sistemas como RabbitMQ, Kafka, AWS SQS, entre outros.

- Vantagens:
  - **Desacoplamento temporal**: o cliente não espera a resposta, tornando o sistema mais resiliente e escalável.
  - **Maior flexibilidade**: operações assíncronas permitem filas para balancear a carga em momentos de alta demanda.
- Desvantagens:
  - **Complexidade**: requer um sistema de mensageria, que introduz novos pontos de falha e complexidade operacional.
  - **Falhas de entrega**: mensagens podem ser perdidas ou duplicadas, exigindo mecanismos de retry e confirmação de entrega.

Figura 3: Exemplo de serviços com integração Async (fonte: elaborado pelo autor, 2025).

### Comunicação via API Gateway

Com muitos microsserviços, um API Gateway pode ser o ponto central de comunicação entre o cliente (ou outro serviço) e os microsserviços. Ele atua como intermediário, roteando as requisições para o microsserviço correto e agregando respostas.

- Vantagens:
  - **Simplificação de interface**: o cliente interage com um único endpoint em vez de gerenciar múltiplas APIs.
  - **Segurança centralizada**: o gateway gerencia autenticação, autorização e controle de acesso para todos os microsserviços.
- Desvantagens:
  - **Ponto único de falha**: pode virar gargalo ou ponto único de falha, exigindo alta disponibilidade e cuidado na implementação.
  - **Latência adicional**: o intermediário pode adicionar latência.

Figura 4: Exemplo de serviços com integração com API GW (fonte: elaborado pelo autor, 2025).

### Mercado, cases e tendências

Os padrões de comunicação entre microsserviços tornaram-se um pilar estratégico de sistemas distribuídos: o modo como os serviços trocam informações define a latência percebida, a resiliência e a capacidade de escalar sob demanda.

**Hibridização: comunicação síncrona e assíncrona.** Em projetos reais é cada vez mais comum combinar chamadas síncronas (REST, gRPC) para ações críticas e imediatas com eventos assíncronos (RabbitMQ, Kafka, SQS) para propagação de mudanças e desacoplamento entre domínios. Isso permite responder rápido ao usuário e manter consistência entre serviços por eventos distribuídos. Com soluções como Apache Kafka, NATS e Pulsar, empresas estão migrando integrações ponto a ponto para arquiteturas orientadas a eventos, com mais flexibilidade e tolerância a falhas.

**Crescimento dos gateways inteligentes.** API Gateways como Kong, Apigee, Amazon API Gateway ou Traefik crescem como forma de centralizar controle, roteamento e segurança. Vão além de proxies HTTP: oferecem rate limiting, monitoramento, transformações de payload e integração com OpenID Connect e OAuth2. Há tendência de delegar lógica de roteamento e autenticação aos gateways, aliviando os serviços de responsabilidades transversais.

**Observabilidade e tracing distribuído.** Consolidou-se como prática indispensável. Ferramentas como OpenTelemetry, Jaeger e Honeycomb rastreiam chamadas entre serviços, identificam gargalos e mapeiam a comunicação de ponta a ponta. Tracing distribuído virou exigência em projetos com dezenas ou centenas de microsserviços.

**Avanço do gRPC em ambientes corporativos.** Pela necessidade de baixo consumo de banda e respostas rápidas, o gRPC ganha espaço em empresas que priorizam eficiência entre data centers ou clusters internos. Protocol Buffers são uma alternativa leve ao JSON, com vantagens de performance e definição de contrato. O REST continua dominante no front-end e em integrações públicas, enquanto o gRPC é usado internamente entre microsserviços onde o desempenho é crítico.

### O que você viu nesta aula

Padrões de comunicação entre microsserviços: diferenças entre comunicação síncrona e assíncrona, uso de eventos e mensagens para integração, e como REST, gRPC e RabbitMQ podem otimizar a interação entre serviços. Também o conceito de API Gateway e como ele facilita a gestão da comunicação em arquiteturas complexas.

### Referências

- GANDOMI, A.; HAIDER, M. Beyond the hype: Big data concepts, methods, and analytics. International Journal of Information Management, v. 35, n. 2, p. 137-144, 2015.
- JSON SCHEMA. JSON Schema. 2023. Disponível em: https://json-schema.org/. Acesso em: 30 mai. 2025.
- LANEY, D. 3D data management: Controlling data volume, velocity, and variety. META Group Research Note, v. 6, n. 70, p. 1-8, 2001.
- Figura: https://www.infidigit.com/blog/http-status-codes/

Palavras-chave: Protocolo HTTP, Arquitetura de Serviços, gRPC.
