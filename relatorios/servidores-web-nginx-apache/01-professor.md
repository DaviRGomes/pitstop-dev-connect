# Servidores Web e Balanceamento de Carga: da borda à alta disponibilidade

> Versão didática do relatório bruto (`00-bruto.md`), baseada na Aula 01 do material de origem, sobre servidores web, a evolução do protocolo HTTP e as arquiteturas do Apache HTTP Server e do Nginx.

**O que você vai saber fazer ao final deste guia:** explicar o papel de um servidor web dentro de uma infraestrutura real (e por que ele não deveria estar dentro do código da sua aplicação); dizer qual problema cada versão do HTTP resolveu, de 1.1 até o 3/QUIC; diferenciar forward proxy de reverse proxy e saber, na hora, qual dos dois um cenário pede; escolher o MPM certo do Apache conforme a necessidade (estabilidade total ou concorrência alta); e explicar, com propriedade técnica, por que o Nginx costuma vencer o Apache em cenários de muita concorrência simultânea. Cada etapa parte de um problema concreto antes de mostrar a ferramenta, e fecha com um exercício mínimo pra você rodar no seu terminal.

**Como usar este guia:** tenha um terminal com `curl` disponível. Para a Etapa 01, basta ter Docker instalado: os comandos `docker run -d -p 8080:80 nginx:latest` e `docker run -d -p 8081:80 httpd:latest` já aparecem no texto daquela etapa e bastam para o que ela pede. Os comandos de linha de comando deste guia assumem Linux (Ubuntu/Debian), mas os conceitos valem para qualquer sistema.

> **Docker (Etapa 01) x instalação local (Etapas 03 a 05):** os exercícios de "mão na massa" das Etapas 03, 04 e 05 usam comandos que atuam diretamente sobre o processo do servidor instalado no host (`nginx -s reload`, `a2enmod`, `apachectl`) e um `proxy_pass` apontando para `127.0.0.1:8000`. Dentro de um container, `127.0.0.1` aponta para o próprio container, não para um processo rodando no seu host, então os containers `nginx:latest`/`httpd:latest` da Etapa 01 não servem para completar esses exercícios sem ajuste. Duas saídas possíveis:
> 1. **Instalação local (recomendada, mais simples):** `sudo apt install nginx apache2` num Ubuntu/Debian. Os comandos do texto funcionam exatamente como estão escritos.
> 2. **Continuar no Docker:** suba os containers com `--network host` (recurso do Docker no Linux), por exemplo `docker run -d --network host nginx:latest`, para que `127.0.0.1` dentro do container aponte para o host; edite os arquivos de configuração e rode `nginx -s reload`/`a2enmod` de dentro do próprio container, com `docker exec -it <container> sh`.
>
> A Etapa 04 também usa o utilitário `ab` (Apache Bench) para gerar carga. Se ele não estiver disponível no seu terminal, instale com `sudo apt install apache2-utils` antes de chegar naquele exercício.

---

## Etapa 01: para que serve um servidor web

### O problema

Imagine uma equipe que sobe uma aplicação Node.js e a deixa atendendo diretamente na porta 3000, sem nada na frente dela. No começo funciona bem. Só que, conforme o produto cresce, uma série de dores aparece, e nenhuma delas tem a ver com a lógica de negócio da aplicação:

1. O time quer servir imagens e arquivos estáticos do site (CSS, JavaScript, fotos de produto). Cada uma dessas requisições passa a competir pelo mesmo processo que está executando a lógica de negócio, deixando tudo mais lento.
2. Chega a hora de renovar o certificado HTTPS. Como ele está configurado dentro do código da aplicação, toda renovação exige mexer no app e reiniciar o processo, mesmo que nada tenha mudado na regra de negócio.
3. O tráfego cresce e uma única instância do Node não aguenta mais sozinha. Colocar mais réplicas ajuda, mas alguém precisa decidir, requisição a requisição, para qual réplica mandar cada uma.
4. Um bot começa a fazer scraping agressivo no catálogo de produtos. Não existe nenhuma camada filtrando esse tráfego antes de ele bater direto na aplicação.

Cada um desses problemas é de infraestrutura de borda, não de regra de negócio. Resolver todos dentro do próprio código da aplicação mistura responsabilidades que deveriam estar separadas, e é exatamente esse conjunto de responsabilidades que um servidor web como o Apache HTTP Server ou o Nginx assume.

### O conceito

**Analogia:** pense na recepção de um prédio comercial. Sem ela, cada visitante teria que descobrir sozinho a sala certa, cada escritório precisaria cuidar da própria segurança e climatização, e não haveria ninguém filtrando quem não deveria nem entrar no prédio. Com uma recepção central, o visitante fala com um único ponto, que decide para onde encaminhá-lo, barra quem não deveria passar e cuida de tarefas comuns (identificação, recados) sem envolver cada escritório individualmente. O servidor web é essa recepção da sua infraestrutura: o ponto por onde toda requisição HTTP entra antes de chegar (ou não) até a sua aplicação.

Um servidor web moderno assume, tipicamente, seis funções:

- **Servir conteúdo estático**: entregar HTML, CSS, JavaScript, imagens e vídeos diretamente do disco, sem acionar nenhum código de aplicação. O Nginx se destaca aqui pela arquitetura otimizada que você vai ver na Etapa 05.
- **Fazer proxy para aplicações dinâmicas**: encaminhar requisições para os processos que de fato rodam a lógica de negócio (PHP-FPM, Apache Tomcat, Node.js, Python com Gunicorn, etc.). Você aprofunda esse conceito na Etapa 03.
- **Balanceamento de carga**: distribuir requisições entre múltiplos servidores de aplicação, garantindo alta disponibilidade.
- **Terminação SSL/TLS**: gerenciar certificados e criptografia num único ponto central, em vez de espalhar essa responsabilidade por cada instância da aplicação.
- **Caching**: guardar respostas já processadas para entregar mais rápido em requisições futuras, sem repetir trabalho.
- **Controle de acesso e segurança**: filtrar tráfego malicioso, aplicar regras de autenticação e proteger a aplicação de ataques antes que eles cheguem perto dela.

### Exemplo comentado: o cabeçalho `Server` denuncia quem está te atendendo

```nginx
# /etc/nginx/conf.d/default.conf
server {
    listen 80;                       # a porta que o Nginx escuta
    server_name localhost;           # o domínio que este bloco atende

    location / {
        root /usr/share/nginx/html;  # a pasta onde estão os arquivos estáticos
        index index.html;           # arquivo servido quando a URL termina em "/"
    }
}
```

Cada `location` desse arquivo é uma regra de roteamento: "requisições que batem em `/`, sirva o arquivo `index.html` desta pasta". Ainda não há nenhuma aplicação por trás; é puro conteúdo estático, servido diretamente pelo servidor web.

> **Nota:** este bloco é ilustrativo, mostra a sintaxe de um arquivo de configuração Nginx, mas você não precisa criá-lo nem editá-lo à mão para completar o mão na massa desta etapa. A imagem oficial `nginx:latest` já sobe com uma configuração equivalente pronta, servindo uma página estática padrão por conta própria. Você vai editar um arquivo de verdade como esse a partir da Etapa 03.

```sh
$ curl -I http://localhost:8080
HTTP/1.1 200 OK
Server: nginx/1.27.0
Content-Type: text/html
Content-Length: 615

$ curl -I http://localhost:8081
HTTP/1.1 200 OK
Server: Apache/2.4.58 (Unix)
Content-Type: text/html
```

Repare no cabeçalho `Server`: é o próprio servidor web se apresentando, e ele responde antes mesmo de qualquer aplicação existir por trás dele.

### Mão na massa

1. Suba um container Nginx (`docker run -d -p 8080:80 nginx:latest`) e um container Apache (`docker run -d -p 8081:80 httpd:latest`).
2. Rode `curl -I http://localhost:8080` e `curl -I http://localhost:8081`. **Observe** o cabeçalho `Server` de cada um: são dois softwares diferentes respondendo pela mesma tarefa (entregar uma página).
3. Peça um caminho que não existe em cada um (`curl -I http://localhost:8080/nao-existe`) e **observe** o `404 Not Found`. Repare que essa resposta veio do servidor web, sem nenhuma aplicação ter sido acionada.

### Anota aí

> Um servidor web não roda a lógica de negócio da sua aplicação: ele cuida de tudo que está ao redor dela (estático, proxy, TLS, cache, segurança) para que a aplicação não precise se preocupar com isso.

---

## Etapa 02: HTTP e sua evolução, de 1.1 a QUIC/HTTP-3

### O problema

Duas cenas explicam por que o protocolo HTTP precisou evoluir.

**Cena 1.** A página de um produto de e-commerce carrega o HTML principal e mais 40 miniaturas de imagem. O navegador abre uma conexão TCP com o servidor e, mesmo usando conexões persistentes (keep-alive), o HTTP/1.1 processa uma requisição de cada vez dentro daquela conexão: a segunda imagem só começa a ser baixada depois que a resposta da primeira terminar de chegar por completo. (Na prática, os navegadores contornam parcialmente isso abrindo várias conexões TCP em paralelo com o mesmo domínio, mas isso só troca um custo por outro: agora são várias conexões para gerenciar.) O resultado é uma página perceptivelmente lenta para carregar algo tão simples quanto ícones.

**Cena 2.** Mesmo depois de resolvido o problema da cena 1 (você vai ver como, mais adiante), um usuário acessando pelo celular numa rede móvel instável ainda sente lentidão: basta um único pacote se perder no meio do caminho para que o carregamento inteiro da página trave por um instante, mesmo que todos os outros pacotes já tenham chegado ao destino.

A cena 1 motivou a criação do HTTP/2. A cena 2 motivou a criação do HTTP/3.

### O conceito

Antes das versões, um fato estrutural do próprio HTTP: ele é um protocolo sem estado (stateless). Cada requisição é tratada de forma completamente independente, sem memória de requisições anteriores, como uma carta enviada pelo correio, que não carrega lembrança de cartas anteriores. Essa característica torna o protocolo mais simples de escalar, mas exige mecanismos por cima dele (cookies, sessões) para simular contexto entre requisições de um mesmo usuário.

**HTTP/1.1, a versão clássica (1997).** Introduziu conexões persistentes (keep-alive), permitindo várias requisições e respostas na mesma conexão TCP, o que reduziu bastante a sobrecarga de abrir conexão nova a cada recurso. A limitação é o **head-of-line blocking**: se a primeira requisição demora, todas as seguintes, naquela mesma conexão, ficam esperando.

**HTTP/2, a multiplexação (2015).** Resolve o head-of-line blocking da cena 1, na camada de aplicação: várias requisições e respostas trafegam simultaneamente pela mesma conexão TCP, sem uma bloquear a outra. Além disso trouxe: priorização de recursos (o cliente indica o que é mais importante), compressão de cabeçalhos via HPACK (reduz sobrecarga) e Server Push (o servidor podia enviar recursos antes de o cliente pedir; veja a nota do professor ao final sobre o estado atual desse recurso). O ganho de performance é mais perceptível justamente em páginas com muitos recursos pequenos, exatamente como a da cena 1.

**HTTP/3, QUIC sobre UDP (a evolução mais recente).** O HTTP/2 resolveu o head-of-line blocking na aplicação, mas o problema da cena 2 continua existindo numa camada abaixo: o TCP garante que os bytes cheguem em ordem estrita, então, se um pacote se perde, tudo que veio depois dele espera pela retransmissão, mesmo que pertença a um stream HTTP/2 diferente do que travou. O **HTTP/3** ataca esse problema trocando o TCP pelo **QUIC** (Quick UDP Internet Connections, desenvolvido originalmente pelo Google), que roda sobre UDP. Cada stream QUIC é independente: a perda de um pacote de um stream não trava os demais. O estabelecimento da conexão também tende a ser mais rápido, porque o QUIC combina em menos idas e vindas o que o TCP e o TLS tradicionalmente fazem em etapas separadas. O ganho é maior justamente em redes com perda de pacotes ou latência alta, o cenário típico de conexões móveis.

| Versão | Transporte | Problema que resolveu | Como |
|---|---|---|---|
| HTTP/1.1 | TCP | Reabrir conexão a cada requisição | Conexões persistentes (keep-alive) |
| HTTP/2 | TCP | Head-of-line blocking na aplicação | Multiplexação de streams numa única conexão |
| HTTP/3 | UDP (QUIC) | Head-of-line blocking do próprio TCP | Streams independentes sobre UDP |

### Exemplo comentado: perguntando ao próprio `curl` qual versão foi negociada

```sh
# Deixa o curl negociar livremente e mostra a versão usada na resposta
$ curl -so /dev/null -w 'Protocolo negociado: HTTP/%{http_version}\n' https://www.cloudflare.com
Protocolo negociado: HTTP/2

# Força HTTP/1.1, mesmo que o servidor suporte versões mais novas
$ curl --http1.1 -so /dev/null -w 'Protocolo negociado: HTTP/%{http_version}\n' https://www.cloudflare.com
Protocolo negociado: HTTP/1.1

# Força HTTP/3 (exige um curl compilado com suporte a QUIC, veja a nota abaixo)
$ curl --http3 -so /dev/null -w 'Protocolo negociado: HTTP/%{http_version}\n' https://www.cloudflare.com
Protocolo negociado: HTTP/3
```

Nota: nem todo `curl` vem compilado com suporte a HTTP/3 (depende de uma biblioteca QUIC, como a `ngtcp2` ou a `quiche`). Rode `curl --version | grep -i http3` (ou `grep -i quic`) para conferir se o seu suporta antes de usar a flag `--http3`.

### Mão na massa

1. Escolha um domínio que você sabe que suporta HTTP/2 (por exemplo, `www.cloudflare.com` ou `www.google.com`) e rode os três comandos do exemplo acima. **Observe** o valor de `%{http_version}` mudando conforme a flag usada.
2. Rode `curl -v --http2 https://www.cloudflare.com 2>&1 | grep -i "HTTP/2"` e ache, no meio da saída detalhada, a linha que confirma a negociação da versão durante o handshake.
3. Se o seu `curl` tiver suporte a HTTP/3, repita com `--http3` e compare o tempo de resposta com `-w '%{time_total}\n'` nas três variantes.

### Anota aí

> Cada versão do HTTP resolveu o head-of-line blocking numa camada diferente: o /2 resolveu na aplicação com multiplexação; o /3 resolveu no transporte, trocando TCP por QUIC sobre UDP.

---

## Etapa 03: Forward Proxy e Reverse Proxy, os dois intermediários da web

### O problema

Duas cenas simétricas, uma do lado do cliente e outra do lado do servidor.

**Cena A (lado do cliente).** Uma empresa quer que todo o tráfego de saída dos funcionários passe por um ponto de controle único: bloquear sites indesejados, registrar acessos por questão de conformidade, e evitar que o IP interno de cada máquina fique exposto diretamente para a internet.

**Cena B (lado do servidor).** A mesma empresa mantém cinco servidores de aplicação atrás de um único domínio público. Não faz sentido expor o IP de cada servidor individualmente, nem repetir a configuração do certificado TLS em cada um deles, nem deixar cada servidor decidir sozinho se aguenta receber mais uma conexão simultânea.

Duas necessidades diferentes, mas com uma peça em comum: um intermediário que se posiciona entre quem pede e quem responde. A diferença está em qual lado esse intermediário representa e protege.

### O conceito

**Forward Proxy: o intermediário de saída.** Fica posicionado entre um cliente (geralmente dentro de uma rede privada) e a internet, e é explicitamente configurado no lado do cliente (no navegador, no sistema operacional ou na aplicação). **Analogia:** é como um assistente pessoal. Você não vai pessoalmente à loja: pede ao assistente, ele decide onde comprar, faz a compra em seu nome e te entrega o resultado. A loja nem sabe que foi você quem pediu, só enxerga o assistente.

Funcionamento do Forward Proxy:
1. O cliente envia uma requisição ao proxy, especificando o destino.
2. O proxy intercepta, analisa e decide se encaminha ou bloqueia.
3. Se encaminhada, o proxy faz a requisição em nome do cliente.
4. A resposta volta ao proxy, que a repassa ao cliente.

Casos de uso: segurança e conformidade (forçar o tráfego por firewalls), controle de conteúdo (bloquear sites), anonimato e privacidade (mascarar o IP real do cliente) e cache (guardar respostas frequentes, economizando banda). Softwares como o Squid implementam esse papel; a configuração muda de produto para produto, mas o padrão de uso do lado do cliente é sempre parecido.

**Reverse Proxy: o guardião inteligente da entrada.** Fica na borda da infraestrutura, recebendo requisições da internet e distribuindo-as para os servidores de aplicação por trás dele. É transparente para o cliente: ele nem sabe que existe. **Analogia:** é literalmente a recepção da Etapa 01, vista de outro ângulo. Na Etapa 01 falamos do papel geral do servidor web; aqui formalizamos esse papel especificamente quando ele existe para proteger e organizar o que está atrás dele, como uma recepcionista que atende todo visitante, decide quem vai atender cada um, já tem respostas prontas para perguntas comuns e barra quem não deveria passar.

Funcionamento do Reverse Proxy:
1. O cliente envia a requisição para o IP público do proxy.
2. Com base em regras, o proxy escolhe o backend apropriado.
3. O proxy encaminha a requisição ao backend escolhido.
4. O backend processa e devolve a resposta ao proxy.
5. O proxy entrega a resposta ao cliente.

Funções principais: balanceamento de carga entre múltiplos backends, terminação de SSL/TLS centralizada (tirando essa carga de CPU dos backends), cache de conteúdo, uma primeira camada de segurança contra tráfego malicioso (para bloquear ataques específicos como XSS, normalmente é preciso adicionar regras de WAF, um módulo de segurança dedicado, e não apenas o proxy puro), compressão (Gzip/Brotli, economizando banda) e roteamento inteligente entre diferentes serviços.

| | Forward Proxy | Reverse Proxy |
|---|---|---|
| Fica do lado de | Cliente | Servidor |
| Configurado por | O próprio cliente | A infraestrutura do servidor |
| Protege/representa | O cliente perante a internet | O servidor perante a internet |
| Visível para o cliente? | Sim, é configurado explicitamente | Não, é transparente |

### Exemplo comentado: um reverse proxy Nginx na frente de um backend simples

```nginx
# /etc/nginx/conf.d/proxy.conf
upstream backend_app {
    server 127.0.0.1:8000;         # o servidor de aplicação real, atrás do proxy
}

server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://backend_app;                    # encaminha a requisição pro backend
        proxy_set_header Host $host;                       # preserva o Host original do cliente
        proxy_set_header X-Real-IP $remote_addr;           # informa ao backend o IP real do cliente
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # cadeia de IPs, se houver mais de um proxy
    }
}
```

Sem os cabeçalhos `X-Real-IP`/`X-Forwarded-For`, o backend enxergaria toda requisição como vinda do próprio Nginx (`127.0.0.1`), perdendo a informação de quem de fato fez o pedido.

```sh
# Backend simples, só pra existir algo atrás do proxy
$ python3 -m http.server 8000

# Do lado do cliente, você fala com o proxy, não sabe que existe um Python atrás
$ curl -I http://localhost
HTTP/1.1 200 OK
Server: nginx/1.27.0
```

Repare: o cabeçalho `Server` continua sendo `nginx`, mesmo que o conteúdo tenha sido gerado pelo servidor Python por trás. É exatamente essa transparência que caracteriza o reverse proxy.

Já o uso de um forward proxy aparece do lado do cliente, de forma explícita:

```sh
# Aqui é você, cliente, quem aponta explicitamente para o proxy
$ curl -x http://proxy-da-empresa:3128 http://exemplo.com
```

### Mão na massa

> Este exercício edita a configuração real do Nginx e recarrega o processo com `nginx -s reload`: use um Nginx instalado no host (`sudo apt install nginx`), não o container `nginx:latest` da Etapa 01. Se preferir continuar no Docker, veja a adaptação sugerida na abertura do guia.

1. Suba o backend Python (`python3 -m http.server 8000`, numa pasta com um `index.html` qualquer) e configure o Nginx como no exemplo acima. Recarregue com `nginx -s reload`.
2. Rode `curl -I http://localhost` e **observe** o cabeçalho `Server: nginx`, mesmo com o conteúdo vindo do processo Python.
3. Remova temporariamente a linha `proxy_set_header X-Real-IP`, recarregue, e adicione um endpoint de eco no backend (ou apenas raciocine sobre o log) para notar que, sem esse cabeçalho, o backend só veria o IP do próprio Nginx.
4. Compare com o comando `curl -x` do forward proxy: repare que ali é você quem aponta explicitamente para o intermediário; no passo 2, você nem sabia que ele existia.

### Anota aí

> Forward proxy fica do lado do cliente e é configurado por ele; reverse proxy fica do lado do servidor e é invisível para o cliente, mas ambos são o mesmo tipo de intermediário, olhando para direções opostas.

---

## Etapa 04: Apache HTTP Server e os modelos de processamento (MPMs)

### O problema

Cenário 1: um e-commerce rodando Apache com o modelo mais antigo de processamento recebe um pico de 5.000 conexões simultâneas numa promoção. Como cada conexão ganha um processo do sistema operacional inteiramente próprio e isolado, o servidor tenta abrir milhares de processos, cada um consumindo dezenas de megabytes de memória só para existir, antes mesmo de processar qualquer requisição. A memória se esgota, o sistema começa a paginar em disco (swap), e o site trava justamente no momento de pico de vendas.

Cenário 2, oposto: a mesma empresa depende de um módulo antigo, escrito sem cuidado de concorrência (não thread-safe), que precisa continuar funcionando. Trocar o modelo de processamento para um baseado em threads compartilhando memória faria esse módulo corromper dados ou derrubar o processo de forma imprevisível.

Um cenário pede leveza para escalar; o outro pede isolamento total para sobreviver. O Apache resolve essa tensão deixando você escolher o modelo de concorrência, os **MPMs** (Multi-Processing Modules).

### O conceito

**Analogia geral:** pense numa padaria. O modelo **Prefork** é ter um funcionário exclusivo, dedicado, só para cada cliente que entra: isolamento total (se um funcionário desmaia, só aquele cliente é afetado), mas caríssimo, porque contratar um funcionário novo para cada cliente não escala. O modelo **Worker** é ter poucos gerentes (processos), cada um com uma equipe de funcionários (threads) compartilhando a mesma bancada de ferramentas (a memória do processo): mais barato, mas se um funcionário derruba a bancada, todo mundo que trabalhava nela junto é afetado.

**Prefork MPM (não threaded).** Um processo filho independente é criado para cada conexão, completamente isolado dos demais.
- Vantagens: muito estável (um problema num processo não afeta os outros), ideal para módulos não thread-safe, alta compatibilidade com software legado.
- Desvantagens: alto consumo de memória (cada processo é isolado por completo) e pouca escalabilidade para alta concorrência.
- Uso típico: ambientes que precisam de máxima estabilidade ou dependem de módulos não thread-safe. É comum ver o Prefork combinado com o `mod_php` (PHP embutido diretamente no processo do Apache, historicamente não thread-safe). A alternativa moderna é rodar o PHP como processo separado via PHP-FPM e o Apache falando com ele através de proxy (`mod_proxy_fcgi`, o mesmo conceito de proxy da Etapa 03), o que permite usar um MPM mais leve sem perder compatibilidade.

**Worker MPM (multithreaded).** Cria múltiplos processos filhos, e cada um roda múltiplas threads; cada thread atende uma conexão.
- Vantagens: mais eficiente em memória do que o Prefork, melhor performance sob alta concorrência.
- Desvantagens: como as threads de um mesmo processo compartilham a mesma memória, um erro grave numa thread pode corromper o processo filho inteiro que a hospeda, derrubando todas as conexões que aquele processo específico estava servindo (os demais processos filhos e o processo mestre continuam de pé). Por isso os módulos precisam ser thread-safe.
- Uso típico: aplicações com tráfego moderado a alto.

**Event MPM (recomendado para produção).** Parte do modelo Worker, mas otimizado para o caso comum de conexões keep-alive abertas e ociosas: uma thread dedicada consegue vigiar várias conexões que estão só esperando, sem prender uma thread inteira de trabalho só para segurar uma conexão parada.
- Vantagens: eficiente para conexões keep-alive, otimizado para tráfego de alta concorrência, suporte nativo a HTTP/2.
- Desvantagens: exige módulos thread-safe e é mais complexo de configurar.
- Uso típico: recomendado para a maioria dos novos deployments.

| MPM | Isolamento | Consumo de memória | Concorrência | Quando usar |
|---|---|---|---|---|
| Prefork | Total (processo por conexão) | Alto | Baixa | Máxima estabilidade, módulos não thread-safe |
| Worker | Por processo (threads compartilham) | Médio | Alta | Tráfego moderado a alto, módulos thread-safe |
| Event | Por processo, otimizado p/ keep-alive | Baixo | Muito alta | Recomendado para a maioria dos deployments novos |

### Exemplo comentado: descobrindo e trocando o MPM ativo

```sh
# Mostra qual MPM está compilado/ativo no momento (saída resumida)
$ apachectl -V | grep -i mpm
Server MPM:     event

# Em distros Debian/Ubuntu, a2query mostra o módulo MPM habilitado
$ sudo a2query -M
event
```

```sh
# Trocando para o Prefork (por exemplo, pra rodar um módulo legado não thread-safe)
$ sudo a2dismod mpm_event      # desabilita o módulo do MPM atual
$ sudo a2enmod mpm_prefork     # habilita o Prefork
$ sudo systemctl restart apache2

$ sudo a2query -M
prefork
```

Nota: em distros baseadas em RHEL/CentOS, a troca é feita comentando/descomentando as linhas `LoadModule mpm_*_module` no arquivo `/etc/httpd/conf.modules.d/00-mpm.conf`, em vez de usar `a2enmod`/`a2dismod`.

```ini
# Trecho ilustrativo de mpm_event.conf (ajuste os valores ao seu tráfego real)
<IfModule mpm_event_module>
    StartServers             3     # processos filhos criados na inicialização
    MinSpareThreads         75     # threads ociosas mínimas mantidas em reserva
    MaxRequestWorkers      400     # limite de conexões atendidas simultaneamente
    ThreadsPerChild         25     # threads por processo filho
</IfModule>
```

### Mão na massa

> Este exercício usa `a2enmod`/`a2dismod` e `apachectl`, comandos que atuam sobre um Apache instalado no host (`sudo apt install apache2`), não sobre o container `httpd:latest` da Etapa 01. O passo 3 também usa o `ab` (Apache Bench): se não estiver instalado, rode `sudo apt install apache2-utils` antes de executá-lo.

1. Rode `apachectl -V | grep -i mpm` (ou `httpd -V | grep -i mpm`, dependendo da distro) no seu Apache e anote qual MPM está ativo agora.
2. Se o seu sistema usa Debian/Ubuntu, troque o MPM ativo com `a2dismod`/`a2enmod` e confirme a troca com `a2query -M`.
3. Rode um teste de carga simples contra o mesmo Apache, antes e depois da troca de MPM: `ab -n 500 -c 50 http://localhost/` (Apache Bench). Compare as linhas `Requests per second` e `Time per request` entre as duas rodadas. Não espere um número mágico: o objetivo é sentir que a mesma máquina, o mesmo Apache, se comporta diferente só por causa do MPM escolhido.

### Anota aí

> Prefork isola tudo em processos e é o mais pesado; Worker divide isso em threads dentro de poucos processos e é mais leve, mas exige código thread-safe; Event é o Worker afinado para não gastar uma thread inteira em conexões keep-alive ociosas, e é o modelo recomendado hoje.

---

## Etapa 05: Nginx e a arquitetura orientada a eventos

### O problema

Cenário: uma aplicação com muitas conexões simultâneas de longa duração e majoritariamente ociosas (chat em tempo real, notificações push, keep-alive de APIs de aplicativos móveis). Mesmo com o Event MPM do Apache reduzindo o custo das conexões ociosas (Etapa 04), o modelo continua fundamentado em reservar uma thread para cada conexão que está sendo ativamente processada. Escalar para dezenas de milhares de conexões simultâneas significa escalar, na mesma proporção, a quantidade de threads e a memória que elas consomem, até o sistema esbarrar no limite prático de threads que conseguem coexistir com eficiência.

Foi exatamente esse problema que o Nginx nasceu, do zero, para resolver. Enquanto o Apache nasceu como servidor web tradicional e foi ganhando modelos de concorrência ao longo do tempo, o Nginx já foi concebido com uma arquitetura moderna em mente, pensada especialmente para servir conteúdo estático e atuar como proxy reverso (a função da Etapa 03) sob alta concorrência.

### O conceito

A diferença central do Nginx é a arquitetura **assíncrona orientada a eventos (event-driven)**, bem diferente do modelo de thread ou processo dedicado por conexão.

**Analogia:** pense num garçom que nunca fica parado esperando a cozinha terminar um prato. Ele anota o pedido, entrega para a cozinha, vai atender outras mesas, e só volta para aquela mesa quando o prato está pronto (o evento "prato pronto" dispara a ação de servir). Um único garçom consegue atender dezenas de mesas assim, porque nunca fica bloqueado esperando uma única mesa.

No Apache, cada conexão ativa costuma ocupar uma thread ou processo dedicado enquanto durar (mesmo o Event MPM reserva uma thread só para a requisição sendo efetivamente processada, ele só evita gastar uma thread inteira em conexões apenas ociosas). Com 10 mil usuários conectados ao mesmo tempo, é preciso sustentar uma fração relevante de 10 mil threads ou processos consumindo memória.

No Nginx:
- **Non-blocking I/O**: quando uma operação de entrada/saída é necessária (ler do disco, esperar resposta de um backend), o worker registra um evento e passa a processar outra conexão, em vez de ficar parado esperando.
- **Event loop**: cada processo worker roda um loop de eventos que gerencia milhares de conexões usando poucos recursos.
- Quando o evento fica pronto (o dado chegou, o disco respondeu), o worker é notificado e retoma exatamente de onde parou.

Essa abordagem torna o Nginx muito eficiente, especialmente para conexões keep-alive e para conexões ociosas, exatamente o cenário descrito no problema desta etapa. Benefícios práticos: menor consumo de memória, maior throughput, melhor latência e desempenho excelente como proxy reverso e balanceador de carga, inclusive na frente do próprio Apache.

### Exemplo comentado: poucos processos, milhares de conexões

```nginx
# /etc/nginx/nginx.conf (trecho principal)
worker_processes auto;   # 1 processo worker por núcleo de CPU disponível

events {
    worker_connections 1024;   # cada worker aguenta até 1024 conexões simultâneas
    use epoll;                 # mecanismo de notificação de eventos do kernel Linux
}
```

Com `worker_processes auto` e `worker_connections 1024` numa máquina de 4 núcleos, o Nginx consegue, em teoria, atender até 4096 conexões simultâneas usando apenas 4 processos worker (mais o processo mestre, que só gerencia os workers e não atende requisições diretamente).

```sh
# Poucos processos, independente de quantas conexões estão ativas
$ ps aux | grep '[n]ginx'
root       812  0.0  0.1  55508  1420 ?  Ss  10:02  0:00 nginx: master process nginx -g daemon off;
nginx      813  0.0  0.2  55964  2116 ?  S   10:02  0:00 nginx: worker process
nginx      814  0.0  0.2  55964  2116 ?  S   10:02  0:00 nginx: worker process

# Quantas conexões TCP estabelecidas existem agora, de fato
$ ss -tn state established | wc -l
187
```

Repare: 187 conexões estabelecidas sendo atendidas por apenas 2 processos worker. Num Apache com Prefork ou Worker sob a mesma carga, o `ps aux` costuma mostrar dezenas ou centenas de linhas, uma por processo ou thread envolvido.

### Mão na massa

> Assim como na Etapa 03, este exercício lê a configuração e observa processos de um Nginx instalado no host, não do container `nginx:latest` da Etapa 01. O passo 3 volta a usar o `ab`: instale com `sudo apt install apache2-utils` se ainda não tiver feito isso na Etapa 04.

1. Localize o `nginx.conf` do seu Nginx (`nginx -t` mostra o caminho no início da saída) e identifique as diretivas `worker_processes` e `worker_connections`.
2. Rode `ps aux | grep '[n]ginx'` e conte quantos processos aparecem. Compare com `nproc` (número de núcleos da sua máquina): o número de workers costuma ser igual ou próximo.
3. Gere carga com múltiplas conexões simultâneas: `ab -n 1000 -c 200 http://localhost/`. Durante o teste, rode `ps aux | grep '[n]ginx'` num segundo terminal. **Observe**: o número de processos não muda, mesmo com centenas de conexões simultâneas batendo no servidor.
4. Se tiver acesso a um Apache no mesmo tipo de teste, repita a carga nele e rode `ps aux | grep '[a]pache2\|[h]ttpd'`. Dependendo do MPM configurado, **observe** o número de processos ou threads crescer junto com a carga, ao contrário do que aconteceu com o Nginx.

### Anota aí

> Apache lida com concorrência dedicando um processo ou thread a cada conexão (mesmo otimizado pelo Event MPM); Nginx lida com concorrência usando poucos processos rodando um loop de eventos não bloqueante, e é exatamente por isso que ele domina como proxy reverso e balanceador de carga na frente de qualquer coisa, inclusive do próprio Apache.

---

## Expansão do professor: Aulas 02 a 05

As quatro aulas restantes completam o módulo com nove etapas. A progressão parte do balanceamento em uma borda Nginx, entra no gerenciamento de tráfego do Kubernetes, adiciona políticas do Istio e termina com alta disponibilidade e segurança.

### Etapa 06: balanceamento L4, L7 e algoritmos do Nginx

**Objetivo:** diferenciar decisões na camada de transporte das decisões HTTP e escolher um algoritmo coerente com o perfil da aplicação.

- L4 decide com IP e porta, sem interpretar a requisição.
- L7 entende host, path, header e cookie, por isso suporta roteamento mais expressivo.
- Round Robin distribui em sequência; `weight` representa capacidades diferentes; `least_conn` favorece quem tem menos conexões; `ip_hash` cria afinidade, mas reduz flexibilidade.
- `keepalive` reutiliza conexões com upstreams e evita pagar um novo handshake a cada chamada.

**Prática verificável:** configure três upstreams, gere carga com `ab`, compare Round Robin e `least_conn` e registre distribuição, throughput e latência.

### Etapa 07: health checks, failover e diagnóstico

**Objetivo:** retirar backends incapazes da rotação e explicar a causa de falhas observadas na borda.

- `max_fails` e `fail_timeout` implementam verificação passiva no Nginx Open Source.
- Um servidor `backup` assume quando os primários estão indisponíveis.
- `stub_status`, logs e métricas exportadas para Prometheus mostram conexões, erros e saturação.
- Em geral, 502 indica resposta inválida ou conexão recusada pelo upstream; 504 indica estouro do tempo de espera.

**Prática verificável:** interrompa um backend durante a carga, confirme o failover pelos logs e provoque separadamente um 502 e um 504.

### Etapa 08: Ingress no Kubernetes

**Objetivo:** expor vários Services por uma entrada HTTP compartilhada e distinguir intenção de execução.

- O recurso Ingress declara host, path e Service de destino.
- O Ingress Controller observa essa declaração e configura o proxy real. Sem Controller, o recurso não altera o tráfego.
- `ingressClassName` escolhe o Controller; `pathType` define a semântica da correspondência.
- Ingress segue estável, mas sua API está congelada. Para novos desenhos, a Gateway API deve ser avaliada.

**Prática verificável:** publique frontend e API no mesmo host, teste caminhos `/` e `/api` e confirme o destino nos logs dos Pods.

### Etapa 09: TLS automático com cert-manager

**Objetivo:** declarar, emitir, armazenar e renovar certificados sem operação manual recorrente.

- Issuer tem escopo de namespace; ClusterIssuer tem escopo do cluster.
- Certificate descreve nomes DNS e o Secret de destino.
- No fluxo ACME, HTTP-01 ou DNS-01 prova o controle do domínio.
- A anotação `cert-manager.io/cluster-issuer` pode acionar o ingress-shim para criar o Certificate usado pelo Ingress.

**Prática verificável:** use primeiro um emissor de staging, acompanhe Certificate, Order e Challenge e valide a cadeia com `curl -Iv`.

### Etapa 10: Service Mesh e arquitetura do Istio

**Objetivo:** separar políticas de comunicação da lógica de negócio.

- Envoy forma o Data Plane e aplica roteamento, segurança, resiliência e telemetria no caminho da requisição.
- Istiod forma o Control Plane e distribui configuração, descoberta e identidades.
- Sidecars consomem CPU e memória, adicionam um salto e ampliam a superfície operacional. A adoção precisa justificar esse custo.

**Prática verificável:** instale um perfil de laboratório, habilite a injeção, confirme `2/2` containers nos Pods e compare consumo antes e depois.

### Etapa 11: tráfego gradual com VirtualService e DestinationRule

**Objetivo:** lançar versões de modo mensurável e reversível.

- DestinationRule nomeia subsets e políticas de destino.
- VirtualService seleciona rotas e controla peso, header, path, timeout, retry, espelhamento e injeção de falhas.
- Canary distribui por peso; A/B seleciona grupos; mirroring copia a chamada e ignora a resposta da versão espelhada.
- Retry sem limite pode multiplicar uma sobrecarga. Promoção depende de erro, latência e métrica de negócio, não apenas do peso configurado.

**Prática verificável:** aplique uma divisão 90/10, conte cem respostas, fixe um usuário de teste na v2 por header e execute rollback.

### Etapa 12: mTLS e observabilidade da malha

**Objetivo:** autenticar workloads, aplicar privilégio mínimo e reconstruir o caminho de uma requisição.

- PeerAuthentication controla mTLS. PERMISSIVE facilita migração; STRICT recusa tráfego sem identidade da malha.
- AuthorizationPolicy restringe origem, método e path depois da autenticação.
- Prometheus, Grafana, Jaeger e Kiali cobrem métricas, painéis, traces e topologia.
- A aplicação ainda precisa propagar headers de tracing entre chamadas.

**Prática verificável:** migre de PERMISSIVE para STRICT, prove que um cliente fora da malha falha e inspecione certificados com `istioctl proxy-config secret`.

### Etapa 13: alta disponibilidade, SLO e recuperação

**Objetivo:** projetar e testar continuidade diante de falhas reais.

- SLA é compromisso; SLO é alvo operacional; métricas e orçamento de erro dizem se o alvo está sendo respeitado.
- Todo SPOF precisa ser removido, reduzido ou aceito conscientemente.
- Active-passive simplifica consistência; active-active usa capacidade simultânea e exige coordenação maior.
- Keepalived com VRRP move um IP virtual entre nós. HA reduz interrupções locais; DR trata desastres com RTO e RPO.

**Prática verificável:** derrube o nó ativo, meça o tempo de troca do IP virtual e registre o impacto no SLO.

### Etapa 14: defesa da borda

**Objetivo:** combinar disponibilidade com controles que preservem acesso legítimo.

- TLS e HSTS protegem o canal; rate limiting controla abuso; WAF inspeciona conteúdo HTTP.
- ModSecurity executa regras e OWASP CRS fornece um conjunto mantido de detecções comuns.
- Comece em modo de detecção, analise falsos positivos e só então habilite bloqueio.
- Logs, alertas, atualização de regras, menor privilégio e correção na aplicação formam a defesa em camadas.

**Prática verificável:** envie tráfego normal e payloads de laboratório, leia o audit log, valide 403 do WAF e 429 do limitador.

---
## Checklist de autoavaliação

Marque cada item apenas se você **fez** ou **conseguiu explicar em voz alta**, não se apenas leu. Se algum item ficar em branco, volte à etapa correspondente e refaça o mão na massa.

**Etapa 01: para que serve um servidor web**
- [ ] Sei citar as seis funções de um servidor web sem consultar o texto.
- [ ] Rodei um Nginx e um Apache e comparei o cabeçalho `Server` de cada um.
- [ ] Sei explicar por que essas funções não deveriam ficar dentro do código da aplicação.

**Etapa 02: HTTP e sua evolução**
- [ ] Sei explicar o que é head-of-line blocking e em qual camada cada versão do HTTP resolveu esse problema.
- [ ] Usei o `curl` para forçar diferentes versões do HTTP e observei a mudança em `%{http_version}`.
- [ ] Sei explicar por que o QUIC roda sobre UDP em vez de TCP.

**Etapa 03: Forward Proxy e Reverse Proxy**
- [ ] Sei dizer, para um cenário dado, se ele pede um forward proxy ou um reverse proxy.
- [ ] Configurei um reverse proxy Nginx na frente de um backend simples e confirmei com `curl -I`.
- [ ] Sei explicar a diferença entre `X-Real-IP` e a ausência dele no backend.

**Etapa 04: Apache e os MPMs**
- [ ] Sei explicar a diferença entre Prefork, Worker e Event em termos de processo, thread e isolamento.
- [ ] Descobri qual MPM está ativo no meu Apache com `apachectl -V`.
- [ ] Sei explicar por que módulos não thread-safe exigem o Prefork.

**Etapa 05: Nginx e a arquitetura orientada a eventos**
- [ ] Sei explicar o que é non-blocking I/O e o event loop, com uma analogia própria.
- [ ] Localizei `worker_processes` e `worker_connections` num `nginx.conf` real.
- [ ] Sei explicar por que o número de processos do Nginx não cresce junto com o número de conexões, ao contrário do Apache.

**Etapa 06: balanceamento L4 e L7**
- [ ] Sei escolher entre Round Robin, peso, `least_conn` e afinidade explicando o custo.
- [ ] Comparei distribuição e latência sob carga.

**Etapa 07: health checks e failover**
- [ ] Retirei um backend durante o teste e confirmei failover pelos logs.
- [ ] Sei diferenciar 502 de 504 a partir do caminho da requisição.

**Etapa 08: Ingress no Kubernetes**
- [ ] Sei explicar por que Ingress e Ingress Controller não são a mesma coisa.
- [ ] Testei roteamento por host e path até Services com endpoints saudáveis.

**Etapa 09: TLS e cert-manager**
- [ ] Acompanhei Certificate, Order e Challenge usando um emissor de staging.
- [ ] Validei o Secret TLS e a cadeia apresentada pelo Ingress.

**Etapa 10: arquitetura do Istio**
- [ ] Sei separar Data Plane, Control Plane e custo operacional da malha.
- [ ] Confirmei a injeção do proxy e sua sincronização com Istiod.

**Etapa 11: deploy gradual**
- [ ] Configurei subsets e uma divisão 90/10 com rollback verificável.
- [ ] Sei diferenciar canary, A/B e mirroring.

**Etapa 12: mTLS e observabilidade**
- [ ] Migrei de PERMISSIVE para STRICT sem perder visibilidade dos clientes.
- [ ] Inspecionei identidade, autorização, métricas e um trace completo.

**Etapa 13: alta disponibilidade**
- [ ] Sei relacionar SLA, SLO, SPOF, RTO e RPO.
- [ ] Medi o failover de um IP virtual ou outro mecanismo redundante.

**Etapa 14: defesa da borda**
- [ ] Testei WAF primeiro em detecção e analisei falsos positivos.
- [ ] Validei TLS, HSTS, 403 do WAF, 429 do rate limiting, logs e alertas.

---

## Notas do professor

1. **Correção técnica (Etapa 04, Worker MPM):** o relatório bruto afirmava que "problemas em um thread podem corromper o processo pai". Isso é impreciso: threads de uma mesma requisição vivem dentro de um processo **filho**, e é esse processo filho específico que pode ser corrompido ou derrubado por um erro grave numa de suas threads (já que elas compartilham a mesma memória). O processo mestre e os demais processos filhos não são afetados. Corrigi essa descrição no texto principal.
2. **Nota, não correção (Etapa 02, Server Push do HTTP/2):** o relatório bruto lista o Server Push como um dos ganhos do HTTP/2, o que é historicamente correto (fez parte da especificação original de 2015). Vale registrar que, na prática de 2026, esse recurso caiu em desuso: os principais navegadores (o Chrome, por exemplo, desde 2022) removeram ou restringiram o suporte a ele, porque o ganho real de performance raramente compensava a complexidade de usá-lo corretamente. As demais melhorias do HTTP/2 (multiplexação, HPACK, priorização) seguem plenamente em uso.
3. **Atualização de contexto temporal (Etapa 01, idade do Apache):** o relatório bruto descreve o Apache HTTP Server como tendo "mais de 25 anos de história". Isso ainda é verdade, mas impreciso: o projeto teve seu primeiro lançamento em 1995, o que hoje (2026) equivale a mais de 30 anos. Ajustei a referência no texto principal.
4. **Nota, não correção (Etapa 03, reverse proxy e XSS):** o relatório bruto cita proteção contra XSS como uma função de segurança do reverse proxy. Isso só é verdade quando o proxy está configurado com regras adicionais de WAF (Web Application Firewall, como o ModSecurity); um reverse proxy puro, sem esse módulo, filtra bem certos padrões de tráfego e ataques de rede, mas não inspeciona por padrão o conteúdo em busca de payloads de XSS. Deixei essa ressalva explícita no texto principal.
5. **Ajuste de trilha prática (revisão pós-publicação):** um aluno seguindo a rota Docker sugerida na Etapa 01 travava nos exercícios das Etapas 03, 04 e 05, porque `nginx -s reload`, `a2enmod` e o `proxy_pass` para `127.0.0.1:8000` pressupõem Nginx/Apache instalados no host, e `127.0.0.1` dentro de um container não alcança um processo do host. Adicionei uma nota logo na abertura do guia (com a alternativa de instalação local ou de usar `--network host` para quem preferir continuar no Docker), reforcei o aviso no início do "mão na massa" das três etapas afetadas, avisei sobre o pré-requisito do pacote `apache2-utils` para o `ab` antes do primeiro exercício que o usa, e deixei explícito, na Etapa 01, que o bloco `server { listen 80; ... }` ali mostrado é ilustrativo e não precisa ser editado à mão para completar aquele exercício.
