# Escalabilidade nos Servidores: relatório de estudo

> Conteúdo extraído dos 6 PDFs da disciplina "Escalabilidade nos servidores" (DevOps e Arquitetura Cloud, Fase 2, FIAP). Cada aula vira uma etapa. Referências das aulas consultadas em agosto de 2025.

## Etapa 01: Fundamentos de Escalabilidade Moderna

### Motivação

Um aplicativo viraliza depois de uma campanha de marketing, milhões de usuários tentam acessá-lo ao mesmo tempo e o sistema sai do ar. O que deveria ser sucesso vira frustração e perda de receita. Isso é falha de escala. Crescer junto com a demanda é necessidade, não luxo.

### Hands on (conceitual)

As videoaulas usam analogias e diagramas para separar escalar, otimizar e medir desempenho. Depois exploram visualmente a escala vertical e a horizontal ("comprar um servidor mais potente" vs "adicionar mais servidores à frota") e, por fim, olham conceitualmente o painel do AWS Auto Scaling Groups (ASG) para entender elasticidade e autoscaling.

### Desempenho, otimização e escalabilidade

- **Desempenho (performance)**: velocidade de uma única tarefa, ou seja, a latência de uma operação. Analogia: quantos itens por minuto um caixa de supermercado escaneia.
- **Otimização**: melhorar o desempenho sem adicionar recursos. Ensinar o caixa a escanear 20% mais rápido ou reorganizar o layout dos produtos.
- **Escalabilidade**: capacidade de aumentar a produtividade (throughput) proporcionalmente aos recursos adicionados. Quando a fila fica gigantesca, não adianta ter o caixa mais rápido do mundo: abre-se mais caixas.

### O triângulo de trade-offs

Performance, custo e complexidade. É praticamente impossível maximizar os três ao mesmo tempo. Máxima performance de banco com hardware de ponta e várias camadas de cache eleva custo e complexidade. Microsserviços podem baratear o custo por requisição em larga escala, mas trazem complexidade operacional enorme comparada a um monolito. O papel do profissional é navegar esses trade-offs conforme requisitos técnicos e de negócio.

### Escala vertical (scaling up)

Aumentar a capacidade de um único servidor: mais CPU, mais RAM, discos mais rápidos. Vantagem: simplicidade, geralmente sem mudar código. Desvantagens: limite físico e financeiro (o próximo upgrade fica proibitivo ou não existe), costuma exigir downtime para o upgrade e cria um ponto único de falha (SPOF): se o super-servidor cai, tudo cai.

### Escala horizontal (scaling out)

Adicionar mais servidores para distribuir a carga: uma frota de máquinas menores e mais baratas. Escala teoricamente ilimitada e mais resiliência, pois a falha de uma instância só redireciona o tráfego para as saudáveis. Exige que a aplicação seja projetada para ambiente distribuído (idealmente stateless) e traz mais complexidade operacional, como a necessidade de um Load Balancer.

### Elasticidade e autoscaling

Elasticidade: capacidade de crescer e encolher recursos conforme a carga. Autoscaling: o mecanismo automatizado que implementa a elasticidade com regras predefinidas, sem equipe de plantão adicionando servidores na mão.

- **Baseado em métricas** (o mais comum): "se a CPU média da frota passar de 70% por mais de 5 minutos, adicione um servidor; se cair abaixo de 30% por 10 minutos, remova um".
- **Agendado**: para demanda previsível. "Todo dia útil às 8h55, suba para 10 servidores; às 18h05, desça para 2."
- **Preditivo**: usa Machine Learning sobre dados históricos para prever picos e ajustar a capacidade antes que aconteçam.

A automação é a chave para eficiência de custos: paga-se só pelo que se usa.

### Casos clássicos de falha

Grandes varejistas fora do ar na Black Friday e o "Fail Whale" do Twitter (atual X). Causam prejuízo milionário e dano de reputação. Tecnicamente, costumavam vir de gargalos em componentes difíceis de escalar horizontalmente: banco relacional sobrecarregado ou sistema de pagamentos que não aguentava a concorrência. Escalar é necessidade de negócio.

### Desafios atuais e ferramentas

Microsserviços, contêineres, sistemas orientados a eventos e picos sazonais imprevisíveis. Dezenas ou centenas de serviços, cada um com sua necessidade de escala. Granularidade permite escalar só o componente necessário (ex.: carrinho de compras), mas traz latência de rede e desafios de observabilidade. Ferramentas: Kubernetes (padrão de orquestração), AWS ASG (elasticidade na nuvem), Karpenter (provisiona recursos pela necessidade real, com foco em custo) e KEDA (escala com base em eventos, como tamanho de fila).

### Quando NÃO escalar

Às vezes o gargalo se resolve com otimização de código ou uma query mais eficiente. Para um sistema interno de 50 funcionários com tráfego baixo e estável, autoscaling é exagero de custo e complexidade. Distinguir problema de escala de problema de otimização é sinal de maturidade.

### Mercado

- **Case iFood**: picos em finais de campeonato e dias chuvosos. Microsserviços na nuvem, autoscaling intensivo e filas para desacoplar o processamento de pedidos.
- **Tendência FinOps**: responsabilidade financeira na nuvem. Escalabilidade também pela ótica de custo; Karpenter provisiona os recursos exatos usando as instâncias mais baratas disponíveis.
- **Notícia**: venda de ingressos de festivais e eventos esportivos derrubando sites. Força o mercado a evoluir em balanceamento, proteção contra bots e cache distribuído via CDN.

Referências: Beyer et al., *The Site Reliability Workbook* (2018); Kleppmann, *Designing Data-Intensive Applications* (2017); Netflix Technology Blog.

Palavras-chave: Escalabilidade, Escala Vertical, Escala Horizontal, Autoscaling, Elasticidade.

## Etapa 02: Load Balancers na Prática

### Motivação

Se a escala horizontal significa vários servidores, como o tráfego chega até eles de forma organizada? Pelo Load Balancer (balanceador de carga), o "maestro" que evita sobrecarga e mantém a aplicação no ar mesmo se um "músico" falhar. Ele também é a peça que permite deploys com zero downtime (Netflix, Spotify).

### Hands on

1. Demonstração conceitual no console da AWS criando um Application Load Balancer (ALB): Listeners (portas de entrada), Target Groups (grupos de servidores de destino) e regras de Health Check.
2. Análise de um YAML simples de Ingress no Kubernetes, mostrando o Ingress como roteador inteligente que leva o tráfego externo aos serviços certos do cluster.

### O que é um Load Balancer

Servidor proxy entre clientes e servidores da aplicação, único ponto de contato e abstração. Distribui requisições e também garante alta disponibilidade, confiabilidade e gerenciamento simplificado. Analogia: controlador de tráfego aéreo que direciona aviões para pistas livres e mantém a operação mesmo com uma pista interditada.

### Camada 4 vs Camada 7 (modelo OSI)

- **L4 (transporte, TCP/UDP)**: decide com base em IP de origem/destino e portas dos primeiros pacotes. Não enxerga o conteúdo: buscar imagem e pagar são pacotes iguais. Extremamente rápido, milhões de requisições por segundo com latência mínima. Exemplo: AWS Network Load Balancer (NLB), ideal para jogos online, streaming ou para balancear outros LBs.
- **L7 (aplicação, HTTP/HTTPS)**: inspeciona cada requisição. Roteia `/api/pagamentos` para servidores robustos e `/blog` para servidores simples; usa `User-Agent` para mandar mobile para versão otimizada; `Accept-Language` para idioma; cookie para teste A/B. Exemplo: AWS Application Load Balancer (ALB), escolha padrão para aplicações web modernas.

### Externo vs interno

- **Externo**: interface pública (IP público ou DNS), portão de entrada da aplicação.
- **Interno**: só dentro da rede privada (VPC). Gerencia comunicação entre serviços, por exemplo "Carrinho" falando com "Estoque" sem expor Estoque à internet (ganho de segurança).

### Algoritmos

- **Round-robin**: lista circular, próximo da fila. Justo e previsível, ignora carga e capacidade. Variante **Weighted Round-robin** dá pesos maiores a servidores mais potentes.
- **Least Connections**: manda para quem tem menos conexões ativas. Bom quando as conexões têm durações muito diferentes (uploads, streaming).
- **IP Hashing**: hash do IP do cliente define o servidor; mesmo IP cai sempre no mesmo servidor (afinidade de sessão). Desvantagens: distribuição desigual quando muitos usuários estão atrás do mesmo proxy corporativo e problemas de sessão se um servidor falha e o hash é recalculado.

### Health checks e failover

O LB testa ativamente a saúde de cada servidor. Parâmetros: intervalo, timeout, unhealthy threshold (falhas consecutivas para marcar como não saudável) e healthy threshold (sucessos consecutivos para voltar). Falhou: failover, o LB para de mandar tráfego novo para a instância doente, de forma transparente. **Connection draining** deixa as conexões existentes terminarem antes de remover a instância.

### Estratégias de deploy

- **Blue/Green**: dois ambientes idênticos e isolados. LB manda 100% para Blue (estável); Green (nova versão) é validado; a "virada" aponta tudo para Green. Rollback igualmente rápido. Atenção ao banco compartilhado: mudanças de schema precisam ser retrocompatíveis.
- **Canary**: nome vindo dos canários nas minas de carvão. Uma pequena porcentagem (1%, 5%) vai para a versão nova; monitora-se métricas técnicas (erros, latência) e de negócio (conversão, engajamento); aumenta-se gradualmente até 100%.

### Mercado

- **Case Netflix**: Engenharia do Caos. LBs internos desacoplam milhares de microsserviços; se recomendações ficam lentas, o tráfego vai para um fallback ou circuit breakers são ativados, evitando falha em cascata.
- **Tendência Service Mesh e API Gateways**: Istio e Linkerd com sidecar proxies agindo como LBs L7 por serviço, com observabilidade, mTLS e controle granular.
- **Notícia GSLB**: Global Server Load Balancing via DNS inteligente para multi-cloud e híbrido. Usuário do Brasil vai para São Paulo, da Europa para Frankfurt, com base em geolocalização, latência e saúde. Líderes: Cloudflare e F5.

Referências: AWS, *What is an Application Load Balancer?*; Kubernetes, *Ingress*; Cloudflare, *Load Balancing*.

## Etapa 03: Padrões de Escala Horizontal em Arquiteturas Cloud

### Motivação

Já temos LB e frota. Mas de que adianta uma frota de carros idênticos se cada um só funciona com um motorista específico? E se o processamento de pagamentos for muito mais lento que o resto? Adicionar servidores para tudo é desperdício. Esta aula olha para dentro da aplicação.

### Hands on (arquitetural)

1. Código simples comparando stateful (sessão na memória do servidor, impede a livre distribuição pelo LB) e stateless (estado externalizado).
2. Arquivos que definem unidades de escala: ReplicaSet em YAML do Kubernetes e configurações de um Auto Scaling Group no console da AWS.
3. Exercício de design com pseudocódigo: um produtor envia tarefa para uma fila (AWS SQS) e um worker consome, processa e remove a tarefa.

### Regra de ouro: stateless

- **Stateful**: guarda dados da sessão na memória do servidor (ex.: carrinho em variável de sessão). Cliente fica "preso" ao servidor; se o LB o manda para outro, o carrinho some. Contorno: sticky sessions, que limitam resiliência e eficiência do balanceamento.
- **Stateless**: nenhuma informação de contexto entre requisições; cada requisição traz tudo que precisa. O estado vai para armazenamento compartilhado e rápido (banco ou cache distribuído como Redis). Qualquer servidor atende qualquer cliente a qualquer momento: compatível com escala horizontal e failover automático.

### Unidades de escala

- **Kubernetes ReplicaSet**: garante um número especificado de cópias idênticas de um Pod sempre rodando.
- **AWS Auto Scaling Group (ASG)**: gerencia o ciclo de vida de um grupo de instâncias EC2, mantendo a quantidade desejada saudável.

### Workers e Filas

E-commerce na Black Friday: confirmar pedido envolve validar pagamento, baixar estoque, emitir nota fiscal, enviar e-mail. Síncrono, o usuário espera muito. Com o padrão, a aplicação principal (produtor) publica uma mensagem numa fila (AWS SQS, RabbitMQ) e responde na hora ("Seu pedido foi recebido e está sendo processado!"). Workers (consumidores) leem a fila e fazem o trabalho pesado de forma assíncrona. Os workers escalam de forma independente, com base no tamanho da fila.

### Padrões avançados

- **Sidecar**: contêiner auxiliar no mesmo Pod do principal, cuidando de logs, monitoramento ou proxy de rede sem a aplicação saber.
- **Ambassador**: variação de proxy focada na comunicação com o exterior ou outros serviços (retries, descoberta de serviços).
- **Sharding**: escala horizontal de dados; o banco é particionado em bancos menores e independentes (shards), distribuindo leitura e escrita.

### Trade-offs e resiliência

Custo vs performance no autoscaling: política agressiva dá melhor performance e conta alta; conservadora economiza e degrada em picos. FinOps busca o equilíbrio. Em sistemas distribuídos a falha é certa: **Retry** com exponential backoff e **Fallback** (plano B como servir do cache ou resposta padrão).

### Mundo real e ferramentas

Netflix com microsserviços e resiliência (falha de recomendação não impede assistir). Instagram e iFood com workers e filas para bilhões de uploads e milhões de pedidos. **KEDA** (Kubernetes Event-driven Autoscaling) monitora tamanho de fila no SQS ou lag de tópico Kafka e escala workers de zero a N. **Karpenter** provisiona nós exatos, mais baratos e adequados no momento.

### Mercado

- **Case Netflix**: popularizou o Circuit Breaker com a biblioteca Hystrix. Falhas repetidas "abrem" o circuito, bloqueando chamadas ao serviço falho e indo para fallback.
- **Tendência Serverless**: AWS Lambda como evolução máxima de workers e filas; escala de zero a milhares de execuções e cobra por execução.
- **Notícia Service Mesh**: Istio e Linkerd implementam Sidecar e Ambassador de forma padronizada, com retries, timeouts, segurança e observabilidade.

Referências: Karpenter docs; KEDA docs; Netflix Technology Blog; Newman, *Building Microservices* (2015).

## Etapa 04: CDNs e Performance Global

### Motivação

Servidores no Brasil funcionam bem para usuários locais, mas um cliente em Lisboa, Tóquio ou Nova York sofre com a latência imposta pela distância e pelos cabos submarinos. Nenhum servidor potente vence a física. CDNs (Content Delivery Networks) aproximam o conteúdo do usuário e são também camada de segurança e escalabilidade.

### Hands on

1. Console da AWS criando uma distribuição do Amazon CloudFront: Origin (servidor onde o conteúdo original mora), Behaviors (regras de tratamento e tempo de cache por tipo de requisição) e o domínio fornecido pela CDN.
2. "Detetive de performance" com as ferramentas de desenvolvedor do navegador: inspecionar `Cache-Control` (diretivas da origem) e `X-Cache` (Hit = veio da borda, Miss = foi buscar na origem).

### Latência e o que é uma CDN

Latência depende da velocidade da luz e da distância. Europa acessando Brasil: centenas de milissegundos antes mesmo do processamento. CDN é uma rede global de servidores proxy em pontos de troca de tráfego (IXPs), chamados PoPs (Points of Presence) ou Edge Locations, guardando cópias perto do usuário.

### Como funciona

1. **Geolocalização via DNS**: a consulta DNS vai para o DNS inteligente da CDN, que identifica a localização pelo IP e devolve o IP do PoP mais próximo em vez do da origem.
2. **Edge Caching**: o PoP (ex.: Paris) verifica o cache local. Primeira vez: **Cache Miss**, busca na origem no Brasil, entrega e guarda cópia. Próximo usuário próximo: **Cache Hit**, servido instantaneamente da borda.

### Controle de cache

Cabeçalho `Cache-Control`. `max-age` define o TTL em segundos. `Cache-Control: public, max-age=3600` guarda por uma hora. Expirado, o arquivo fica stale e é revalidado com a origem; se não mudou, a origem responde `304 Not Modified` e a CDN renova o TTL.

**Invalidação (purging)**: remover à força arquivos de todos os caches via painel ou API (ex.: bug fix urgente num JavaScript). Usar com critério: pode custar e reduz a eficiência do cache.

### Além de assets estáticos

CDNs também escalam APIs: respostas GET que mudam pouco (catálogo de produtos) podem ser cacheadas na borda, aliviando aplicação e banco. Players: Amazon CloudFront, Akamai, Fastly.

### Segurança e performance na borda

- **WAF** integrado à CDN bloqueia SQL Injection e XSS na borda.
- **TLS Offload**: a CDN faz o handshake TLS (caro em CPU) nos servidores de borda otimizados e mantém conexão segura otimizada com a origem.

### Infraestrutura e observabilidade

CDNs usam BGP para anunciar as rotas mais eficientes para seus PoPs e acordos de peering (conexões diretas com grandes provedores) para reduzir saltos. Métricas: **Cache Hit Ratio** (a mais importante), economia de banda, latência de resposta e taxa de erros.

### Mercado

- **Case games**: patches de Fortnite e League of Legends (dezenas de GB) são pré-posicionados nos PoPs dias antes do lançamento.
- **Tendência Edge Computing**: AWS Lambda@Edge e Cloudflare Workers executam código nos PoPs (renderização, testes A/B, manipulação de imagens, autenticação na borda).
- **Notícia Dynamic Content Acceleration**: Akamai e Fastly aceleram até conteúdo não cacheável com otimização TCP/IP e roteamento inteligente (BGP e peering).

Referências: AWS, *Amazon CloudFront Developer Guide*; Grigorik, *High Performance Browser Networking* (2013); Cloudflare, *What is a CDN?*.

## Etapa 05: Escalabilidade de Banco de Dados

### Motivação

Aplicação escalada, LB, CDN. Mas quase toda ação relevante (compra, post, busca) lê ou escreve dados, e tudo aponta para um lugar: o banco de dados, o "chefão final" da escalabilidade, por ser stateful e precisar de consistência.

### Hands on

1. Console do Amazon RDS: criar uma Read Replica a partir da instância principal com poucos cliques; a AWS gerencia replicação assíncrona e a réplica fica pronta para leitura.
2. Pseudocódigo do padrão **cache-aside**: tenta o Redis; se der cache miss, busca no banco e grava no cache antes de retornar.
3. Breve incursão no Amazon DynamoDB, configurando "unidades de capacidade de leitura e escrita".

### Desafios

- **Consistência**: transação atômica e leituras subsequentes vendo o resultado correto.
- **Concorrência**: múltiplos acessos simultâneos sem corromper dados.
- **Latência**: operações rápidas mesmo com mais volume.

### Escalando leitura

Proporção de leitura para escrita costuma ser alta (ex.: 100 para 1).
1. **Caching** (Redis, Memcached) entre aplicação e banco: primeira linha de defesa.
2. **Read Replicas**: modelo primary-replica (antes chamado master-slave). Primary recebe todas as escritas (INSERT, UPDATE, DELETE) e replica, geralmente de forma assíncrona, para réplicas somente leitura. A aplicação implementa **write splitting**: escritas no primary, leituras distribuídas nas réplicas.

### Escalando escrita

Todas as escritas ainda vão para um servidor. Solução: **Sharding** (particionamento horizontal).
- **Por range** (A-M no shard 1, N-Z no shard 2): simples, mas cria hotspots se a distribuição não é uniforme.
- **Por hash** (hash do ID do usuário): distribuição mais equitativa, mas dificulta consultas por faixa.
Complexidade imensa, especialmente no re-sharding.

### Bancos distribuídos

Amazon DynamoDB (NoSQL), CockroachDB (NewSQL), Apache Cassandra (NoSQL) fazem sharding e replicação de forma transparente.

### Teorema CAP

Eric Brewer: um sistema distribuído garante ao mesmo tempo só duas de três: **Consistência** (todos os nós veem o mesmo dado), **Disponibilidade** (toda requisição recebe resposta, sem garantia de ser a escrita mais recente) e **Tolerância a Partição** (opera mesmo com quebra de comunicação entre nós). Como partições são inevitáveis, a escolha real é CP ou AP. Relacionais tradicionais tendem a CP; Cassandra escolhe AP, levando à **Consistência Eventual**: sem novas escritas, as réplicas convergem; por um tempo, nós diferentes podem retornar valores diferentes.

### Estratégia e resiliência

Escalar verticalmente ainda pode ser o mais simples e eficaz até certo ponto. Horizontal é mais complexo, com teto maior e mais resiliência. **Failover** automatizado promove uma réplica a primary.
- **RPO (Recovery Point Objective)**: quanta perda de dados é tolerável. RPO de 5 min = aceita perder os últimos 5 minutos de transações.
- **RTO (Recovery Time Objective)**: quanto tempo pode ficar fora. RTO de 15 min = detecção, failover e retorno em menos de 15 minutos.
São definidos pelo negócio e ditam replicação síncrona vs assíncrona e automação do failover.

### Mercado

- **Case Google Spanner e NewSQL**: consistência forte global com alta disponibilidade usando relógios atômicos; CockroachDB leva isso ao mercado sem o hardware do Google.
- **Tendência bancos serverless**: Aurora Serverless, MongoDB Atlas Serverless, Neon (Postgres). Separam computação de armazenamento e escalam até zero.
- **Notícia HTAP**: SingleStore e TiDB unem OLTP e OLAP num único sistema, evitando ETL e permitindo análise em tempo real.

Referências: AWS, *Amazon Aurora Features*; Cockroach Labs, *CAP Theorem*; Kleppmann, *Designing Data-Intensive Applications* (2017).

## Etapa 06: Arquiteturas Escaláveis no Mundo Real

### Motivação

Última aula. Com todas as peças (fundamentos, LB, padrões, CDN, banco), é hora da planta baixa completa e da visão de arquiteto: Serverless, Microsserviços vs Monolitos escaláveis, observabilidade e um caso resolvido do começo ao fim.

### Hands on (estudo de caso)

E-commerce fictício com monolito tradicional que caiu num pico. Identificar pontos de falha: falta de LB, aplicação stateful, banco sobrecarregado, ausência de CDN. Depois redesenhar no quadro branco: CDN para assets, ALB, aplicação em ASG, fila para pedidos e banco com Read Replicas, cada peça justificada.

### Serverless

AWS Lambda: máxima abstração. A pessoa desenvolvedora envia a função; o provedor provisiona, aplica patches e escala. Centenas de execuções por segundo e volta a zero (custo também) quando a demanda some.

### Monolito escalável vs microsserviços

- **Monolito escalável**: não é inerentemente ruim. Stateless e bem projetado, roda num ASG e escala horizontalmente. Simplicidade de desenvolvimento, teste, deploy e depuração (tudo no mesmo processo).
- **Microsserviços**: serviços pequenos por capacidade de negócio (catálogo, pagamento). Escala granular, independência de equipes, flexibilidade tecnológica. Custo: complexidade operacional massiva, latência e novos pontos de falha na rede, depuração distribuída difícil.
- **Lei de Conway**: a arquitetura reflete a estrutura de comunicação da organização. Times pequenos e autônomos tendem a microsserviços; times centralizados tendem a monolitos.

### Onde está o gargalo? Observabilidade

O gargalo pode estar em CPU, memória, I/O de disco, query, API de terceiro, latência de rede ou cache mal configurado. Três pilares:
- **Métricas**: números agregados no tempo (CPU, latência, taxa de erros). Dizem **o que** está acontecendo e disparam alertas.
- **Logs**: eventos discretos com timestamp. Dizem **por que** aconteceu.
- **Traces** (rastreamento distribuído): jornada de uma requisição pelos serviços. Dizem **onde** o tempo foi gasto.

### Como os grandes fazem

- **Google**: cultura SRE, operações como problema de software, automação, error budgets e SLOs.
- **Amazon**: "you build it, you run it"; cada time opera e escala seu serviço.
- **Nubank**: nativo da nuvem, microsserviços e programação funcional, observabilidade robusta para crescimento explosivo.

### Estudo de caso: refatoração do e-commerce

Monolito com aplicação e banco no mesmo servidor caiu na Black Friday. Passo a passo:
- **Aula 4 (CDN)**: CloudFront na frente servindo assets estáticos.
- **Aula 2 (LB)**: Application Load Balancer, eliminando o ponto único de falha.
- **Aulas 1 e 3 (Escala e Padrões)**: separa aplicação e banco; aplicação stateless num Auto Scaling Group; processos lentos (e-mails) desacoplados com fila SQS.
- **Aula 5 (Banco)**: banco movido para serviço gerenciado (RDS) com Read Replicas.

Resultado: de arquitetura frágil a sistema distribuído, resiliente e escalável.

### Mercado

- **Case Nubank**: microsserviços, Clojure e Datomic para consistência em ambiente distribuído; cultura forte de automação e testes num negócio regulado.
- **Tendência SRE**: troca de times de "Operações" por SRE, com SLOs, error budgets e autoridade para priorizar estabilidade quando o orçamento de erro estoura.
- **Tendência Platform Engineering**: times de plataforma constroem uma Internal Developer Platform (IDP) com CI/CD, IaC, observabilidade e segurança como serviço, reduzindo a carga cognitiva dos times de produto.

Referências: AWS Well-Architected Framework; Beyer et al., *Site Reliability Engineering* (2016); Newman, *Building Microservices* (2015).
