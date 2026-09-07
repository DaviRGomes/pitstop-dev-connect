# AULA 01: SERVIDORES WEB COM NGINX E APACHE

## Introdução aos Servidores Web

Um servidor web é a ponte fundamental entre o seu navegador e o conteúdo digital armazenado nos servidores. Nesta primeira aula, exploramos os alicerces da arquitetura web moderna, entendendo como tecnologias amplamente utilizadas no mercado como Apache HTTP Server e Nginx funcionam, quais são suas diferenças arquiteturais fundamentais e como configurá-los para obter o máximo desempenho em ambientes de produção.

O servidor web é muito mais do que um programa simples que apenas entrega arquivos. Com o advento de aplicações dinâmicas e complexas, os servidores web evoluíram para se tornarem orquestradores sofisticados, capazes de realizar múltiplas funções críticas.

Funções principais de um servidor web:
- Servir conteúdo estático: HTML, CSS, JavaScript, imagens, vídeos. O Nginx se destaca devido à sua arquitetura otimizada.
- Fazer proxy para aplicações dinâmicas: encaminhar requisições para servidores de aplicação (PHP-FPM, Apache Tomcat, Node.js, Python Gunicorn, etc.).
- Balanceamento de carga: distribuir requisições entre múltiplos servidores back-end para garantir alta disponibilidade.
- Terminação SSL/TLS: gerenciar certificados e criptografia de forma centralizada.
- Caching: armazenar respostas para entregar mais rapidamente em requisições futuras.
- Controle de acesso e segurança: filtrar tráfego malicioso, aplicar regras de autenticação, proteger contra ataques.

## O Protocolo HTTP e sua Evolução

O HTTP (Hypertext Transfer Protocol) é a linguagem fundamental que navegadores e servidores usam para conversar. É um protocolo sem estado (stateless), ou seja, cada requisição é tratada de forma completamente independente, sem 'memória' de requisições anteriores. Essa característica o torna escalável, mas exige mecanismos adicionais (como cookies e sessões) para manter o contexto do usuário.

### HTTP/1.1 - A Versão Clássica

Introduzido em 1997, o HTTP/1.1 introduziu conexões persistentes (keep-alive), permitindo que múltiplas requisições e respostas ocorram sobre uma única conexão TCP. Isso reduziu significativamente a sobrecarga de negociação de conexão. No entanto, possui uma limitação fundamental conhecida como 'head-of-line blocking' - se a primeira requisição demorar, todas as seguintes ficam bloqueadas esperando.

### HTTP/2 - A Revolução da Multiplexação

Lançado em 2015, o HTTP/2 trouxe melhorias significativas que transformaram a performance da web:

- Multiplexação: múltiplas requisições e respostas podem ser transmitidas simultaneamente em uma única conexão TCP
- Priorização de recursos: o cliente pode indicar quais recursos são mais importantes
- Compressão de cabeçalhos (HPACK): reduz a sobrecarga
- Server Push: o servidor pode enviar recursos antes mesmo do cliente pedir

Essas melhorias resultaram em ganhos notáveis de performance, especialmente em cenários com muitos pequenos recursos.

### HTTP/3 - O Futuro: QUIC sobre UDP

O HTTP/3 é a evolução mais recente, baseada no protocolo QUIC (Quick UDP Internet Connections) desenvolvido pelo Google. Em vez de usar TCP, o HTTP/3 roda sobre UDP, trazendo benefícios revolucionários.

QUIC resolve o problema de 'head-of-line blocking' do TCP. Com TCP, se um pacote é perdido, todos os pacotes subsequentes devem esperar pela retransmissão. Com UDP e QUIC, cada stream é independente, permitindo que outros streams continuem mesmo se um pacote específico for perdido.

Isso resulta em melhor desempenho em redes com perda de pacotes ou latência alta, comum em conexões móveis. O setup de conexão também é mais rápido com QUIC.

## Forward Proxy vs Reverse Proxy: Os Intermediários da Web

### Forward Proxy: O Intermediário de Saída

Um Forward Proxy fica posicionado entre um cliente (geralmente dentro de uma rede privada) e a internet. É explicitamente configurado no cliente (navegador, sistema operacional ou aplicação).

Funcionamento:
1. O cliente envia uma requisição ao Forward Proxy, especificando o destino
2. O proxy intercepta, analisa e decide se encaminha ou bloqueia
3. Se encaminhada, o proxy faz a requisição em nome do cliente
4. A resposta é enviada de volta ao proxy, que a encaminha para o cliente

Casos de uso:
- Segurança e conformidade: força tráfego através de firewalls
- Controle de conteúdo: bloqueio de sites indesejados
- Anonimato e privacidade: mascara o IP real do cliente
- Cache: armazena respostas frequentes, reduzindo consumo de banda

### Reverse Proxy: O Guardião Inteligente da Entrada

Um Reverse Proxy fica na 'borda' da infraestrutura, recebendo requisições da internet e distribuindo-as para múltiplos servidores backend. É transparente para o cliente.

Funcionamento:
1. Cliente envia requisição para o Reverse Proxy (IP público)
2. Proxy, com base em regras, escolhe o backend apropriado
3. Proxy encaminha requisição ao backend
4. Backend processa e envia resposta ao proxy
5. Proxy envia resposta ao cliente

Funções principais:
- Balanceamento de carga: distribui entre múltiplos backends
- Terminação SSL/TLS centralizada: descarrega CPU dos backends
- Cache de conteúdo: acelera entrega de respostas
- Segurança: primeira linha contra ataques DDoS e XSS
- Compressão: Gzip/Brotli economiza banda
- Roteamento inteligente: direciona para diferentes serviços

## Apache HTTP Server: O Canivete Suíço da Web

Com mais de 25 anos de história, o Apache HTTP Server continua sendo um gigante resiliente e confiável. Sua robustez vem de sua arquitetura modular, permitindo carregar apenas os módulos necessários, e seus diferentes modelos de processamento (MPMs).

### Modelos de Processamento Múltiplo (MPMs)

Os MPMs definem como o Apache lida com conexões. A escolha do MPM correto é crucial para performance e consumo de recursos.

#### Prefork MPM (não-threaded)

Como funciona: Um processo filho independente é criado para cada conexão, cada um completamente isolado.

Vantagens:
- Muito estável - problemas em um processo não afetam outros
- Ideal para módulos não thread-safe
- Alta compatibilidade com software legado

Desvantagens:
- Alto consumo de memória - cada processo é isolado
- Pouco escalável para alta concorrência

Uso: Ambientes que precisam de máxima estabilidade ou módulos não thread-safe.

#### Worker MPM (multi-threaded)

Como funciona: Cria múltiplos processos filhos, cada um com múltiplos threads. Cada thread lida com uma conexão.

Vantagens:
- Mais eficiente em memória
- Melhor performance para alta concorrência

Desvantagens:
- Problemas em um thread podem corromper o processo pai
- Módulos devem ser thread-safe

Uso: Aplicações com tráfego moderado a alto.

#### Event MPM (recomendado para produção)

Como funciona: Baseado no worker, mas com otimização para keep-alive. Uma thread pode lidar com várias conexões.

Vantagens:
- Eficiente para conexões keep-alive
- Otimizado para tráfego de alta concorrência
- Suporte nativo para HTTP/2

Desvantagens:
- Exige módulos thread-safe
- Mais complexo de configurar

Uso: Recomendado para maioria dos novos deployments.

## Nginx: O Velocista e Orquestrador Eficiente

O Nginx foi projetado do zero para alta performance e concorrência, especialmente para servir conteúdo estático e atuar como proxy reverso. Enquanto o Apache nasceu como servidor web tradicional, o Nginx foi concebido com arquitetura moderna em mente.

### Arquitetura Event-Driven: A Chave da Eficiência

A principal diferença do Nginx é sua arquitetura assíncrona orientada a eventos, completamente diferente dos modelos tradicionais de threads/processos dedicados.

No Apache, cada conexão geralmente recebe sua própria thread ou processo. Com 10.000 usuários, você precisa de 10.000 threads/processos consumindo memória.

No Nginx:
- Non-blocking I/O: quando uma operação I/O é necessária, o worker registra um evento e processa outra conexão
- Event Loop: cada worker tem um event loop que gerencia milhares de conexões com poucos recursos
- Quando o evento está pronto, o worker é notificado e retoma o processamento

Essa abordagem torna o Nginx extremamente eficiente, especialmente para conexões keep-alive e conexões ociosas.

Benefícios práticos:
- Menor consumo de memória
- Maior throughput
- Melhor latência
- Excelente como proxy reverso e balanceador
## AULA 02: BALANCEAMENTO DE CARGA NA PRÁTICA

### Camadas e estratégias de balanceamento

Um Load Balancer distribui requisições entre múltiplos backends para aumentar capacidade e disponibilidade. Em L4, ele decide usando IP e porta, com baixa sobrecarga e sem interpretar HTTP. Em L7, ele inspeciona host, path, headers, cookies e métodos, podendo terminar TLS, aplicar cache, compressão e regras de segurança.

No Nginx, os algoritmos centrais são:

- Round Robin: alterna requisições entre os servidores. A diretiva `weight` aumenta ou reduz a proporção recebida por cada backend.
- Least Connections: envia a nova requisição ao backend com menos conexões ativas. É útil quando as requisições têm durações muito diferentes.
- IP Hash: mantém um cliente no mesmo backend usando o IP de origem. Ajuda aplicações com estado local, mas pode desbalancear usuários atrás do mesmo NAT ou VPN.

Aplicações stateless, com sessão em Redis ou token assinado, reduzem a dependência de afinidade. `keepalive` reaproveita conexões do Nginx com os backends. `proxy_connect_timeout`, `proxy_send_timeout` e `proxy_read_timeout` limitam cada fase da conversa com o upstream.

### Health checks, failover e operação

O Nginx Open Source realiza health checks passivos com `max_fails` e `fail_timeout`. Falhas reais de tráfego retiram temporariamente um backend da rotação. A diretiva `backup` reserva um servidor para quando todos os primários estiverem indisponíveis. Health checks ativos e mais detalhados exigem Nginx Plus ou módulos externos.

O módulo `stub_status` expõe conexões ativas, requisições, leituras, escritas e conexões em espera. O Apache Bench gera carga com `ab -n 1000 -c 10 http://localhost/`. A investigação deve seguir cliente, Nginx, backend e dependências. Um erro 502 indica que o gateway não recebeu uma resposta válida do backend; um 504 indica que o backend não respondeu dentro do timeout.

## AULA 03: GERENCIAMENTO DE TRÁFEGO NO KUBERNETES

### Ingress e Nginx Ingress Controller

`ClusterIP` expõe um Service apenas dentro do cluster. `NodePort` publica uma porta alta em cada nó. `LoadBalancer` costuma criar um balanceador externo por Service. O Ingress centraliza regras HTTP e HTTPS sob um único ponto de entrada, mas é apenas uma declaração: um Ingress Controller, como ingress-nginx, precisa observar e aplicar essas regras.

O roteamento pode usar host, como `api.exemplo.com`, ou path, como `/api`. `pathType: Prefix` aceita subcaminhos; `Exact` exige igualdade. Anotações específicas do controller permitem reescrita de URL e ajustes por Ingress. ConfigMaps definem parâmetros globais do controller.

### TLS com cert-manager

O cert-manager automatiza emissão e renovação de certificados X.509. `Issuer` atua no namespace; `ClusterIssuer` atende todo o cluster. Um recurso `Certificate`, ou a integração direta por anotação no Ingress, solicita o certificado e grava chave e certificado em um Secret. Desafios HTTP-01 ou DNS-01 comprovam a posse do domínio.

## AULA 04: CONTROLE DE TRÁFEGO COM SERVICE MESH E ISTIO

### Arquitetura da malha

Uma Service Mesh retira do código de cada microsserviço preocupações de comunicação, como retries, timeouts, circuit breaking, mTLS e telemetria. No modelo sidecar, um proxy Envoy acompanha cada workload e intercepta tráfego de entrada e saída. O Data Plane executa as políticas; o Istiod, no Control Plane, distribui configuração e identidades.

`VirtualService` define como o tráfego é roteado. `DestinationRule` cria subsets e políticas para as versões de um serviço. Juntos, eles permitem canary por peso, A/B testing por header, traffic mirroring, injeção de falhas e circuit breaking. Gateways controlam entrada e saída da malha.

### Segurança e observabilidade

`PeerAuthentication` habilita mTLS nos modos permissive, strict ou disable. `AuthorizationPolicy` decide quem pode chamar qual serviço, método e path. Envoy coleta métricas, logs de acesso e dados de tracing. Prometheus e Grafana mostram métricas; Jaeger reconstrói traces; Kiali exibe o grafo da malha. A aplicação ainda precisa propagar os headers de tracing entre chamadas.

## AULA 05: ALTA DISPONIBILIDADE E SEGURANÇA

### Alta disponibilidade

SLA é o compromisso externo de serviço; SLO é a meta interna que ajuda a cumprir esse compromisso. Um SPOF é qualquer componente cuja falha derruba o sistema inteiro. Em ativo-passivo, um nó de reserva assume após o failover. Em ativo-ativo, todos atendem simultaneamente e a carga é redistribuída quando um falha.

Keepalived e VRRP podem manter um IP virtual entre dois balanceadores Nginx. Configurações precisam permanecer sincronizadas por automação, como Ansible, ou mecanismos declarativos do Kubernetes. Health checks devem avaliar o serviço real, não apenas o processo. Testes de resiliência e Chaos Engineering validam as hipóteses antes de uma falha real. HA reduz falhas locais; Disaster Recovery trata desastres amplos e mede RTO e RPO.

### Segurança da borda

Um WAF inspeciona HTTP e HTTPS em L7. ModSecurity é o motor; OWASP Core Rule Set oferece regras contra padrões como SQL Injection e XSS. O WAF pode começar em modo de detecção, gerar logs e depois bloquear com base em pontuação, reduzindo falsos positivos durante o ajuste.

Nginx também pode aplicar TLS 1.2 ou 1.3, HSTS e rate limiting. `limit_req_zone` define a memória e a taxa; `limit_req` aplica o limite no endpoint, como `/login`. Logs do Nginx e do ModSecurity, métricas, alertas e testes regulares fecham a camada operacional de segurança.

