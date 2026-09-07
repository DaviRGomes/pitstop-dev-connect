# Servidores Web e Balanceamento de Carga: da borda à alta disponibilidade (edição comentarista)

> Versão didática do relatório bruto (`00-bruto.md`), baseada na Aula 01 do material de origem, sobre servidores web, a evolução do protocolo HTTP e as arquiteturas do Apache HTTP Server e do Nginx. Esta edição mantém 100% do conteúdo técnico e coloca por cima uma lente de Fórmula 1, com pilotos e equipes reais da temporada 2026.

> Nota de contexto: os nomes e a classificação citados são os da temporada 2026 após o GP da Bélgica (etapa 10 de 22), com Kimi Antonelli na ponta pela Mercedes (204 pontos), Lewis Hamilton em segundo pela Ferrari (159) e George Russell em terceiro (154). A próxima etapa é o GP da Hungria.

**Falando como quem está dentro do carro:** o servidor web é a sua mureta. É a operação inteira que fica entre você e o mundo lá fora (a FIA, os outros carros, os fãs, os sensores) pra que a sua única função dentro do cockpit seja pilotar. Se a lógica de negócio da aplicação é "correr", tudo que não é correr (rádio, telemetria, segurança do box, estratégia de stint) precisa estar na mureta, não no seu colo em plena curva 1. Este guia mostra como montar essa mureta com Nginx e Apache.

**O que você vai saber fazer ao final deste guia:** explicar o papel de um servidor web dentro de uma infraestrutura real (e por que ele não deveria estar dentro do código da sua aplicação); dizer qual problema cada versão do HTTP resolveu, de 1.1 até o 3/QUIC; diferenciar forward proxy de reverse proxy e saber, na hora, qual dos dois um cenário pede; escolher o MPM certo do Apache conforme a necessidade (estabilidade total ou concorrência alta); e explicar, com propriedade técnica, por que o Nginx costuma vencer o Apache em cenários de muita concorrência simultânea. Cada etapa parte de um problema concreto antes de mostrar a ferramenta, e fecha com um exercício mínimo pra você rodar no seu terminal.

**Como usar este guia:** tenha um terminal com `curl` disponível. Para a Etapa 01, basta ter Docker instalado: os comandos `docker run -d -p 8080:80 nginx:latest` e `docker run -d -p 8081:80 httpd:latest` já aparecem no texto daquela etapa e bastam para o que ela pede. Os comandos de linha de comando deste guia assumem Linux (Ubuntu/Debian), mas os conceitos valem para qualquer sistema.

> **Docker (Etapa 01) x instalação local (Etapas 03 a 05):** isto aqui é a conferência de peças antes de acender o motor. Os exercícios de "mão na massa" das Etapas 03, 04 e 05 usam comandos que atuam diretamente sobre o processo do servidor instalado no host (`nginx -s reload`, `a2enmod`, `apachectl`) e um `proxy_pass` apontando para `127.0.0.1:8000`. Dentro de um container, `127.0.0.1` aponta para o próprio container, não para um processo rodando no seu host: é como mandar o carro pro seu box quando ele está estacionado na garagem da equipe vizinha, o endereço não bate. Por isso os containers `nginx:latest`/`httpd:latest` da Etapa 01 não servem para completar esses exercícios sem ajuste. Duas saídas possíveis:
> 1. **Instalação local (recomendada, mais simples):** `sudo apt install nginx apache2` num Ubuntu/Debian. Os comandos do texto funcionam exatamente como estão escritos.
> 2. **Continuar no Docker:** suba os containers com `--network host` (recurso do Docker no Linux), por exemplo `docker run -d --network host nginx:latest`, para que `127.0.0.1` dentro do container aponte para o host; edite os arquivos de configuração e rode `nginx -s reload`/`a2enmod` de dentro do próprio container, com `docker exec -it <container> sh`.
>
> A Etapa 04 também usa o utilitário `ab` (Apache Bench) para gerar carga, o seu cronômetro de pit stop. Se ele não estiver disponível no seu terminal, instale com `sudo apt install apache2-utils` antes de chegar naquele exercício.

---

## Transmissão ao vivo: a largada do GP de Servidores Web

Boa tarde a todos, e sejam muito bem-vindos! O motor já está quente, a temperatura de pista está no ponto, e hoje a disputa é uma só: montar a mureta que separa o piloto do caos do mundo lá fora. Este é o GP de Servidores Web, e o grid de largada traz dois nomes pesados. De um lado o Apache, veterano de mais de 30 anos de asfalto. Do outro o Nginx, o chassi enxuto desenhado do zero pra era da alta concorrência.

O que está em jogo? Nada menos que a operação inteira ao redor da sua aplicação. Quem decifrar este traçado sai daqui sabendo montar a borda de qualquer infraestrutura de verdade.

O circuito de hoje tem quatorze setores. Os cinco primeiros constroem servidor web, HTTP, proxies, Apache e Nginx. Depois vêm balanceamento e failover, Ingress e TLS, Istio e tráfego gradual, mTLS e observabilidade, alta disponibilidade e defesa da borda. Quatorze setores, uma volta completa. Bandeira verde, e vamos pra pista!

---

## Quadro de-para: o software na pista

Antes de acelerar, o mapa de tradução. A regra aqui é a mesma de um bom set-up: a peça é a mesma da largada à bandeirada. Se conexão é um carro na Etapa 01, conexão segue sendo um carro na Etapa 05.

| Conceito de software | Equivalente na Fórmula 1 |
|---|---|
| Aplicação (lógica de negócio, o Node na porta 3000) | O piloto pilotando: a competência central, correr e nada mais |
| Servidor web (Nginx / Apache) | A operação de mureta e garagem: tudo ao redor do piloto |
| Requisição HTTP | Uma chamada de rádio, um pedido que chega à mureta |
| Conexão | Um carro sob os cuidados da equipe, na garagem ou na pista |
| Conteúdo estático | Dado pronto e fixo entregue sem acionar o piloto (mapas de pista, referências de volta) |
| Proxy para app dinâmica | Repassar ao piloto a pergunta que só ele ou o engenheiro responde |
| Reverse proxy | A mureta na entrada: recebe tudo de fora e distribui para os carros por trás |
| Forward proxy | O empresário do piloto, que fala com o mundo externo em nome dele (saída) |
| Load balancer | O estrategista distribuindo carga e stints entre os carros da equipe |
| Terminação TLS/SSL | O canal de rádio criptografado, gerenciado num ponto único pela equipe |
| Cache | Respostas prontas do engenheiro para as perguntas que sempre voltam |
| Controle de acesso e segurança | A credencial de paddock e o segurança do box barrando quem não tem acesso |
| HTTP (o protocolo) | O protocolo de rádio e telemetria entre carro e mureta |
| HTTP stateless | Cada chamada de rádio é independente; o contexto vive no pit board (cookies, sessão) |
| Head-of-line blocking | Fila travada no rádio: uma transmissão longa segura todas as outras |
| HTTP/1.1 keep-alive | Manter o canal de rádio aberto, porém uma transmissão por vez |
| HTTP/2 multiplexação | Vários canais de telemetria trafegando ao mesmo tempo no mesmo link |
| HTTP/3 (QUIC sobre UDP) | Trocar o transporte para que um pacote perdido não trave o resto (zona de rádio ruim) |
| MPM (Apache) | O jeito de escalar a equipe de mecânicos na garagem |
| Processo (Apache) | Um box independente, com ferramentas próprias e espaço próprio |
| Thread | Um mecânico dentro daquele box |
| Memória compartilhada do processo | A bancada de ferramentas compartilhada daquele box |
| Prefork MPM | Um box inteiro e isolado para cada carro: isolamento total, custo altíssimo |
| Worker MPM | Poucos boxes, cada um com vários mecânicos dividindo a mesma bancada |
| Event MPM | Mecânicos que não ficam parados segurando um carro que só está esperando |
| Módulo não thread-safe | Uma ferramenta legada que não pode dividir bancada: exige box isolado |
| Arquitetura event-driven (Nginx) | A mureta com event loop: poucos engenheiros vigiando o telemetry wall inteiro |
| Non-blocking I/O | O engenheiro registra "me avisa quando o dado do carro X chegar" e segue cuidando dos outros |
| Event loop | O engenheiro varrendo o painel de telemetria, agindo só quando um alerta dispara |
| Worker process (Nginx) | Cada engenheiro postado no telemetry wall |
| epoll | O sistema de telemetria que avisa qual canal acabou de receber dado novo |

---

## Etapa 01: para que serve um servidor web

> **Largada, setor 1.** Luzes apagadas! A primeira curva já cobra a decisão que define a corrida inteira: o que fica no colo do piloto e o que vai pra mureta. As melhores equipes ganham GP no box, e uma parada de Red Bull em menos de dois segundos prova que a operação ao redor do piloto decide tanto quanto o carro. Bora entender por quê.

### O problema

Imagine uma equipe que sobe uma aplicação Node.js e a deixa atendendo diretamente na porta 3000, sem nada na frente dela. No começo funciona bem. Só que, conforme o produto cresce, uma série de dores aparece, e nenhuma delas tem a ver com a lógica de negócio da aplicação:

1. O time quer servir imagens e arquivos estáticos do site (CSS, JavaScript, fotos de produto). Cada uma dessas requisições passa a competir pelo mesmo processo que está executando a lógica de negócio, deixando tudo mais lento.
2. Chega a hora de renovar o certificado HTTPS. Como ele está configurado dentro do código da aplicação, toda renovação exige mexer no app e reiniciar o processo, mesmo que nada tenha mudado na regra de negócio.
3. O tráfego cresce e uma única instância do Node não aguenta mais sozinha. Colocar mais réplicas ajuda, mas alguém precisa decidir, requisição a requisição, para qual réplica mandar cada uma.
4. Um bot começa a fazer scraping agressivo no catálogo de produtos. Não existe nenhuma camada filtrando esse tráfego antes de ele bater direto na aplicação.

Cada um desses problemas é de infraestrutura de borda, não de regra de negócio. Resolver todos dentro do próprio código da aplicação mistura responsabilidades que deveriam estar separadas, e é exatamente esse conjunto de responsabilidades que um servidor web como o Apache HTTP Server ou o Nginx assume.

Traduzindo pro cockpit: é o piloto que, além de pilotar, teria que gerenciar o próprio rádio criptografado, decidir sozinho qual stint fazer, e ainda mandar embora quem invade o box. Ninguém corre assim. Antonelli lidera o campeonato de 2026 porque, quando ele está na pista, a única coisa no colo dele é o volante. O resto vive na mureta.

### O conceito

**Analogia (F1):** pense na mureta e na garagem da sua equipe. Sem elas, o piloto teria que descobrir sozinho a estratégia, cuidar da própria comunicação segura, e ainda vigiar quem entra no box. Com uma operação central, chega tudo num único ponto (a mureta), que decide o que repassar ao piloto, barra quem não tem credencial e cuida das tarefas comuns (rádio, telemetria, cronometragem) sem tirar a concentração de quem está no carro. O servidor web é essa mureta da sua infraestrutura: o ponto por onde toda requisição HTTP entra antes de chegar (ou não) até a sua aplicação.

Um servidor web moderno assume, tipicamente, seis funções. Vale lembrar que essa peça de software é veterana de guerra: o Apache HTTP Server teve seu primeiro lançamento em 1995, ou seja, mais de 30 anos de pista (veja a nota do professor ao final).

- **Servir conteúdo estático**: entregar HTML, CSS, JavaScript, imagens e vídeos diretamente do disco, sem acionar nenhum código de aplicação. É o dado pronto que a equipe entrega na hora, tipo o mapa da pista ou a referência de volta, sem precisar chamar o piloto no rádio. O Nginx se destaca aqui pela arquitetura otimizada que você vai ver na Etapa 05.
- **Fazer proxy para aplicações dinâmicas**: encaminhar requisições para os processos que de fato rodam a lógica de negócio (PHP-FPM, Apache Tomcat, Node.js, Python com Gunicorn, etc.). Aqui a mureta repassa ao piloto a pergunta que só ele responde. Você aprofunda esse conceito na Etapa 03.
- **Balanceamento de carga**: distribuir requisições entre múltiplos servidores de aplicação, garantindo alta disponibilidade. É o estrategista da Mercedes decidindo, volta a volta, como dividir a carga entre Antonelli e Russell.
- **Terminação SSL/TLS**: gerenciar certificados e criptografia num único ponto central, em vez de espalhar essa responsabilidade por cada instância da aplicação. O rádio da equipe é criptografado num canal só, e o piloto não perde tempo com isso.
- **Caching**: guardar respostas já processadas para entregar mais rápido em requisições futuras, sem repetir trabalho. O engenheiro já tem a resposta pronta para as perguntas que sempre voltam.
- **Controle de acesso e segurança**: filtrar tráfego malicioso, aplicar regras de autenticação e proteger a aplicação de ataques antes que eles cheguem perto dela. É a credencial de paddock: quem não tem, não passa da porta do box.

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

Cada `location` desse arquivo é uma regra de roteamento: "requisições que batem em `/`, sirva o arquivo `index.html` desta pasta". Ainda não há nenhuma aplicação por trás; é puro conteúdo estático, servido diretamente pelo servidor web. Pense num pit board: informação fixa, entregue direto, sem chamar ninguém no rádio.

> **Nota:** este bloco é ilustrativo, mostra a sintaxe de um arquivo de configuração Nginx, mas você não precisa criá-lo nem editá-lo à mão para completar o mão na massa desta etapa. É um set-up de referência exposto no telão, não a folha que você vai preencher agora. A imagem oficial `nginx:latest` já sobe com uma configuração equivalente pronta, servindo uma página estática padrão por conta própria: o carro já desce do caminhão com o set-up base montado. Você vai editar um arquivo de verdade como esse a partir da Etapa 03.

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

Repare no cabeçalho `Server`: é o próprio servidor web se apresentando, e ele responde antes mesmo de qualquer aplicação existir por trás dele. É a mureta atendendo no rádio antes de o piloto sequer entrar no carro.

> **Volta de instalação, cronômetro na mão.** Dois containers no ar, um `curl` pra ler o cabeçalho `Server`, e você já sente a mureta respondendo antes do piloto entrar no carro. Sem pressa de bater tempo nessa: é volta de reconhecimento de traçado.

### Mão na massa

1. Suba um container Nginx (`docker run -d -p 8080:80 nginx:latest`) e um container Apache (`docker run -d -p 8081:80 httpd:latest`).
2. Rode `curl -I http://localhost:8080` e `curl -I http://localhost:8081`. **Observe** o cabeçalho `Server` de cada um: são dois softwares diferentes respondendo pela mesma tarefa (entregar uma página). São dois fornecedores de mureta diferentes fazendo o mesmo trabalho.
3. Peça um caminho que não existe em cada um (`curl -I http://localhost:8080/nao-existe`) e **observe** o `404 Not Found`. Repare que essa resposta veio do servidor web, sem nenhuma aplicação ter sido acionada. A mureta barrou o pedido na entrada, o piloto nem soube que existiu.

### Anota aí

> Um servidor web não roda a lógica de negócio da sua aplicação: ele cuida de tudo que está ao redor dela (estático, proxy, TLS, cache, segurança) para que a aplicação não precise se preocupar com isso. Igual à mureta, que existe pra você só pilotar.

> **Setor 1 no verde!** Ficou claro: a mureta existe pra você só pilotar. Agora o traçado abre pra reta mais longa do circuito, a evolução do protocolo de rádio entre carro e box. Setor 2, e é sobre ganhar milissegundos na comunicação.

---

## Etapa 02: HTTP e sua evolução, de 1.1 a QUIC/HTTP-3

> **Setor 2, a reta longa.** Aqui a briga é por milissegundos na conversa entre carro e mureta, e três gerações de protocolo disputam o mesmo asfalto. Lembra de Mansell colado em Senna nas voltas finais de Mônaco 1992, mais rápido e sem conseguir passar? Head-of-line blocking é exatamente isso: o veloz travado atrás de quem foi na frente.

### O problema

Duas cenas explicam por que o protocolo HTTP precisou evoluir. Pense nelas como duas falhas de comunicação entre o carro e a mureta.

**Cena 1.** A página de um produto de e-commerce carrega o HTML principal e mais 40 miniaturas de imagem. O navegador abre uma conexão TCP com o servidor e, mesmo usando conexões persistentes (keep-alive), o HTTP/1.1 processa uma requisição de cada vez dentro daquela conexão: a segunda imagem só começa a ser baixada depois que a resposta da primeira terminar de chegar por completo. (Na prática, os navegadores contornam parcialmente isso abrindo várias conexões TCP em paralelo com o mesmo domínio, mas isso só troca um custo por outro: agora são várias conexões para gerenciar.) O resultado é uma página perceptivelmente lenta para carregar algo tão simples quanto ícones. É um rádio só: enquanto o engenheiro despeja uma transmissão longa, todos os outros recados ficam esperando na fila.

**Cena 2.** Mesmo depois de resolvido o problema da cena 1 (você vai ver como, mais adiante), um usuário acessando pelo celular numa rede móvel instável ainda sente lentidão: basta um único pacote se perder no meio do caminho para que o carregamento inteiro da página trave por um instante, mesmo que todos os outros pacotes já tenham chegado ao destino. É o carro entrando no túnel de Mônaco: perdeu uma palavra do rádio e a mensagem inteira congela até a repetição chegar, mesmo que o resto já tivesse sido recebido.

A cena 1 motivou a criação do HTTP/2. A cena 2 motivou a criação do HTTP/3.

### O conceito

Antes das versões, um fato estrutural do próprio HTTP: ele é um protocolo sem estado (stateless). Cada requisição é tratada de forma completamente independente, sem memória de requisições anteriores, como uma chamada de rádio isolada, que não carrega lembrança das chamadas anteriores. Essa característica torna o protocolo mais simples de escalar, mas exige mecanismos por cima dele (cookies, sessões) para simular contexto entre requisições de um mesmo usuário. Na mureta, esse contexto vive no pit board e na telemetria acumulada, não na chamada de rádio em si.

**HTTP/1.1, a versão clássica (1997).** Introduziu conexões persistentes (keep-alive), permitindo várias requisições e respostas na mesma conexão TCP, o que reduziu bastante a sobrecarga de abrir conexão nova a cada recurso. A limitação é o **head-of-line blocking**: se a primeira requisição demora, todas as seguintes, naquela mesma conexão, ficam esperando. Canal aberto, sim, mas uma transmissão por vez, e a longa segura a fila.

**HTTP/2, a multiplexação (2015).** Resolve o head-of-line blocking da cena 1, na camada de aplicação: várias requisições e respostas trafegam simultaneamente pela mesma conexão TCP, sem uma bloquear a outra. É a telemetria moderna de um carro de 2026, que despeja dezenas de canais ao mesmo tempo pelo mesmo link (pressão de pneu, deploy de ERS, modo de asa ativa) sem que um canal segure o outro. Além disso trouxe: priorização de recursos (o cliente indica o que é mais importante), compressão de cabeçalhos via HPACK (reduz sobrecarga) e Server Push (o servidor podia enviar recursos antes de o cliente pedir; veja a nota do professor ao final sobre o estado atual desse recurso). O ganho de performance é mais perceptível justamente em páginas com muitos recursos pequenos, exatamente como a da cena 1.

**HTTP/3, QUIC sobre UDP (a evolução mais recente).** O HTTP/2 resolveu o head-of-line blocking na aplicação, mas o problema da cena 2 continua existindo numa camada abaixo: o TCP garante que os bytes cheguem em ordem estrita, então, se um pacote se perde, tudo que veio depois dele espera pela retransmissão, mesmo que pertença a um stream HTTP/2 diferente do que travou. O **HTTP/3** ataca esse problema trocando o TCP pelo **QUIC** (Quick UDP Internet Connections, desenvolvido originalmente pelo Google), que roda sobre UDP. Cada stream QUIC é independente: a perda de um pacote de um stream não trava os demais. É como ter cada canal de telemetria imune ao ruído dos outros: se a leitura de temperatura de freio some por um instante no túnel, o canal de GPS nem percebe. O estabelecimento da conexão também tende a ser mais rápido, porque o QUIC combina em menos idas e vindas o que o TCP e o TLS tradicionalmente fazem em etapas separadas. O ganho é maior justamente em redes com perda de pacotes ou latência alta, o cenário típico de conexões móveis, ou seja, o carro nos trechos mais distantes e ruidosos de uma pista longa como Spa.

| Versão | Transporte | Problema que resolveu | Como |
|---|---|---|---|
| HTTP/1.1 | TCP | Reabrir conexão a cada requisição | Conexões persistentes (keep-alive) |
| HTTP/2 | TCP | Head-of-line blocking na aplicação | Multiplexação de streams numa única conexão |
| HTTP/3 | UDP (QUIC) | Head-of-line blocking do próprio TCP | Streams independentes sobre UDP |

> **É aqui que separa os pontuadores do resto do grid.** Sacar que o /2 limpou a fila lá na aplicação e o /3 desceu pro transporte pra matar o problema na raiz é o tipo de tirada que engenheiro sênior faz sem pensar. Se você pegou essa distinção, já está no pelotão da frente.

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

Nota: nem todo `curl` vem compilado com suporte a HTTP/3 (depende de uma biblioteca QUIC, como a `ngtcp2` ou a `quiche`). Rode `curl --version | grep -i http3` (ou `grep -i quic`) para conferir se o seu suporta antes de usar a flag `--http3`. É o mesmo cuidado de checar se o carro tem o kit de telemetria QUIC instalado antes de exigir esse modo.

> **Volta rápida, agora valendo tempo.** Três comandos `curl`, três versões de protocolo negociadas na sua frente. Cronometra o `%{time_total}` de cada uma e sente na mão a diferença que cada geração trouxe. Essa aqui é volta de classificação.

### Mão na massa

1. Escolha um domínio que você sabe que suporta HTTP/2 (por exemplo, `www.cloudflare.com` ou `www.google.com`) e rode os três comandos do exemplo acima. **Observe** o valor de `%{http_version}` mudando conforme a flag usada.
2. Rode `curl -v --http2 https://www.cloudflare.com 2>&1 | grep -i "HTTP/2"` e ache, no meio da saída detalhada, a linha que confirma a negociação da versão durante o handshake. É o aperto de mão do rádio antes da primeira transmissão de verdade.
3. Se o seu `curl` tiver suporte a HTTP/3, repita com `--http3` e compare o tempo de resposta com `-w '%{time_total}\n'` nas três variantes.

### Anota aí

> Cada versão do HTTP resolveu o head-of-line blocking numa camada diferente: o /2 resolveu na aplicação com multiplexação; o /3 resolveu no transporte, trocando TCP por QUIC sobre UDP. Um limpou a fila do rádio; o outro deixou cada canal de telemetria imune ao ruído dos vizinhos.

> **Setor 2 concluído, e que reta!** Você viu o rádio limpar a fila e a telemetria ficar imune ao ruído. Agora o circuito estica pra um chicane técnico: dois intermediários que parecem gêmeos e fazem trabalhos opostos. Setor 3, atenção na freada.

---

## Etapa 03: Forward Proxy e Reverse Proxy, os dois intermediários da web

> **Setor 3, o chicane técnico.** Cuidado com essa sequência: forward proxy e reverse proxy são gêmeos que correm em direções opostas. Errar qual é qual aqui é perder o carro na zebra. Foco total nas próximas curvas.

### O problema

Duas cenas simétricas, uma do lado do cliente e outra do lado do servidor. Pense num carro que precisa falar com o mundo (saída) e num box que precisa receber o mundo (entrada).

**Cena A (lado do cliente).** Uma empresa quer que todo o tráfego de saída dos funcionários passe por um ponto de controle único: bloquear sites indesejados, registrar acessos por questão de conformidade, e evitar que o IP interno de cada máquina fique exposto diretamente para a internet.

**Cena B (lado do servidor).** A mesma empresa mantém cinco servidores de aplicação atrás de um único domínio público. Não faz sentido expor o IP de cada servidor individualmente, nem repetir a configuração do certificado TLS em cada um deles, nem deixar cada servidor decidir sozinho se aguenta receber mais uma conexão simultânea.

Duas necessidades diferentes, mas com uma peça em comum: um intermediário que se posiciona entre quem pede e quem responde. A diferença está em qual lado esse intermediário representa e protege.

### O conceito

**Forward Proxy: o intermediário de saída.** Fica posicionado entre um cliente (geralmente dentro de uma rede privada) e a internet, e é explicitamente configurado no lado do cliente (no navegador, no sistema operacional ou na aplicação). **Analogia (F1):** é o empresário do piloto. O piloto não vai pessoalmente negociar com patrocinador ou responder a imprensa: fala com o empresário, que decide o que sai, negocia em nome dele e traz o resultado de volta. O patrocinador do outro lado nem sabe que a fala partiu do piloto, só enxerga o empresário. O piloto contratou aquele intermediário de propósito, exatamente como o cliente configura o forward proxy.

Funcionamento do Forward Proxy:
1. O cliente envia uma requisição ao proxy, especificando o destino.
2. O proxy intercepta, analisa e decide se encaminha ou bloqueia.
3. Se encaminhada, o proxy faz a requisição em nome do cliente.
4. A resposta volta ao proxy, que a repassa ao cliente.

Casos de uso: segurança e conformidade (forçar o tráfego por firewalls), controle de conteúdo (bloquear sites), anonimato e privacidade (mascarar o IP real do cliente) e cache (guardar respostas frequentes, economizando banda). Softwares como o Squid implementam esse papel; a configuração muda de produto para produto, mas o padrão de uso do lado do cliente é sempre parecido.

**Reverse Proxy: o guardião inteligente da entrada.** Fica na borda da infraestrutura, recebendo requisições da internet e distribuindo-as para os servidores de aplicação por trás dele. É transparente para o cliente: ele nem sabe que existe. **Analogia (F1):** é literalmente a mureta da Etapa 01, vista de outro ângulo. Na Etapa 01 falamos do papel geral do servidor web; aqui formalizamos esse papel especificamente quando ele existe para proteger e organizar o que está atrás dele. Pense na mureta da Ferrari recebendo todo o tráfego de fora e decidindo, pedido a pedido, se aquilo é assunto do carro do Hamilton ou do carro do Leclerc, já com respostas prontas para o que é rotina e barrando quem não deveria chegar perto dos carros.

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

Resumindo no jargão do paddock: forward proxy é o empresário falando pelo piloto na saída; reverse proxy é a mureta recebendo o mundo na entrada. Mesmo tipo de intermediário, direções opostas.

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

Sem os cabeçalhos `X-Real-IP`/`X-Forwarded-For`, o backend enxergaria toda requisição como vinda do próprio Nginx (`127.0.0.1`), perdendo a informação de quem de fato fez o pedido. Seria a mureta repassando um recado ao piloto sem dizer de quem veio: o piloto ouviria tudo como se tivesse partido da própria mureta, sem saber que era a direção de prova chamando.

```sh
# Backend simples, só pra existir algo atrás do proxy
$ python3 -m http.server 8000

# Do lado do cliente, você fala com o proxy, não sabe que existe um Python atrás
$ curl -I http://localhost
HTTP/1.1 200 OK
Server: nginx/1.27.0
```

Repare: o cabeçalho `Server` continua sendo `nginx`, mesmo que o conteúdo tenha sido gerado pelo servidor Python por trás. É exatamente essa transparência que caracteriza o reverse proxy. De fora, você fala com a mureta e ouve a mureta, mesmo que a resposta tenha nascido lá dentro, no carro.

Já o uso de um forward proxy aparece do lado do cliente, de forma explícita:

```sh
# Aqui é você, cliente, quem aponta explicitamente para o proxy
$ curl -x http://proxy-da-empresa:3128 http://exemplo.com
```

Aqui é o piloto dizendo, na cara dura, "fala com o meu empresário": ele sabe que existe um intermediário e aponta pra ele de propósito.

> **Pit stop cronometrado.** Sobe o backend Python, configura o Nginx na frente, dá o `reload` e confere o cabeçalho `Server` com um `curl`. Cada passo é um pneu trocado: faça na ordem e o carro sai do box limpo.

### Mão na massa

> **Antes de acelerar, confira a garagem certa.** Este exercício edita a configuração real do Nginx e recarrega o processo com `nginx -s reload`: use um Nginx instalado no host (`sudo apt install nginx`), não o container `nginx:latest` da Etapa 01. É a diferença entre mexer no set-up do carro que está na sua garagem e mexer no de um carro que nem é seu. Se preferir continuar no Docker, veja a adaptação sugerida na abertura do guia.

1. Suba o backend Python (`python3 -m http.server 8000`, numa pasta com um `index.html` qualquer) e configure o Nginx como no exemplo acima. Recarregue com `nginx -s reload`.
2. Rode `curl -I http://localhost` e **observe** o cabeçalho `Server: nginx`, mesmo com o conteúdo vindo do processo Python. A mureta na frente, o carro atrás.
3. Remova temporariamente a linha `proxy_set_header X-Real-IP`, recarregue, e adicione um endpoint de eco no backend (ou apenas raciocine sobre o log) para notar que, sem esse cabeçalho, o backend só veria o IP do próprio Nginx.
4. Compare com o comando `curl -x` do forward proxy: repare que ali é você quem aponta explicitamente para o intermediário; no passo 2, você nem sabia que ele existia.

### Anota aí

> Forward proxy fica do lado do cliente e é configurado por ele; reverse proxy fica do lado do servidor e é invisível para o cliente, mas ambos são o mesmo tipo de intermediário, olhando para direções opostas. Empresário na saída, mureta na entrada.

> **Setor 3 no verde.** Empresário na saída, mureta na entrada: você não erra mais qual é qual. Agora vem a zona de frenagem mais pesada da pista, onde a estratégia de garagem do Apache decide quem sobrevive ao pico. Setor 4.

---

## Etapa 04: Apache HTTP Server e os modelos de processamento (MPMs)

> **Setor 4, frenagem pesada.** Aqui a pista cobra estratégia de garagem: como escalar seus mecânicos pra aguentar 5.000 carros querendo o box ao mesmo tempo. Escolher errado aqui custa caro. Pergunta pra Ferrari de Abu Dhabi 2010, que jogou um campeonato fora com a chamada de box errada no momento errado.

### O problema

Cenário 1: um e-commerce rodando Apache com o modelo mais antigo de processamento recebe um pico de 5.000 conexões simultâneas numa promoção. Como cada conexão ganha um processo do sistema operacional inteiramente próprio e isolado, o servidor tenta abrir milhares de processos, cada um consumindo dezenas de megabytes de memória só para existir, antes mesmo de processar qualquer requisição. A memória se esgota, o sistema começa a paginar em disco (swap), e o site trava justamente no momento de pico de vendas. É a janela de pit stop sob safety car: os 22 carros querem entrar no box ao mesmo tempo e, se você exigisse uma equipe inteira e separada por carro, não haveria espaço nem gente no pit lane para todos.

Cenário 2, oposto: a mesma empresa depende de um módulo antigo, escrito sem cuidado de concorrência (não thread-safe), que precisa continuar funcionando. Trocar o modelo de processamento para um baseado em threads compartilhando memória faria esse módulo corromper dados ou derrubar o processo de forma imprevisível. É aquela ferramenta legada de calibração que só funciona numa bancada isolada: se você a colocar na bancada compartilhada, ela bagunça o trabalho de todos os outros mecânicos.

Um cenário pede leveza para escalar; o outro pede isolamento total para sobreviver. O Apache resolve essa tensão deixando você escolher o modelo de concorrência, os **MPMs** (Multi-Processing Modules). É como a equipe escolher o formato da garagem conforme a corrida.

### O conceito

**Analogia geral (F1):** pense na garagem e no jeito de escalar os mecânicos. Nesta etapa, uma conexão é um carro que chega para ser atendido, um processo é um box independente com ferramentas e espaço próprios, e uma thread é um mecânico dentro daquele box compartilhando a mesma bancada.

O modelo **Prefork** é dar um box inteiro, isolado, só para cada carro que chega: isolamento total (se um box pega fogo, só aquele carro é afetado), mas caríssimo, porque montar um box novo para cada carro não escala. O modelo **Worker** é ter poucos boxes (processos), cada um com uma equipe de mecânicos (threads) dividindo a mesma bancada de ferramentas (a memória do processo): mais barato, mas se um mecânico derruba a bancada, todo mundo que trabalhava nela junto é afetado.

**Prefork MPM (não threaded).** Um processo filho independente é criado para cada conexão, completamente isolado dos demais.
- Vantagens: muito estável (um problema num processo não afeta os outros), ideal para módulos não thread-safe, alta compatibilidade com software legado.
- Desvantagens: alto consumo de memória (cada processo é isolado por completo) e pouca escalabilidade para alta concorrência.
- Uso típico: ambientes que precisam de máxima estabilidade ou dependem de módulos não thread-safe. É comum ver o Prefork combinado com o `mod_php` (PHP embutido diretamente no processo do Apache, historicamente não thread-safe). A alternativa moderna é rodar o PHP como processo separado via PHP-FPM e o Apache falando com ele através de proxy (`mod_proxy_fcgi`, o mesmo conceito de proxy da Etapa 03), o que permite usar um MPM mais leve sem perder compatibilidade.

**Worker MPM (multithreaded).** Cria múltiplos processos filhos, e cada um roda múltiplas threads; cada thread atende uma conexão.
- Vantagens: mais eficiente em memória do que o Prefork, melhor performance sob alta concorrência.
- Desvantagens: como as threads de um mesmo processo compartilham a mesma memória, um erro grave numa thread pode corromper o processo filho inteiro que a hospeda, derrubando todas as conexões que aquele processo específico estava servindo (os demais processos filhos e o processo mestre continuam de pé). É o mecânico que derruba a bancada e prejudica só a equipe daquele box; os outros boxes e o chefe de equipe seguem trabalhando. Por isso os módulos precisam ser thread-safe.
- Uso típico: aplicações com tráfego moderado a alto.

**Event MPM (recomendado para produção).** Parte do modelo Worker, mas otimizado para o caso comum de conexões keep-alive abertas e ociosas: uma thread dedicada consegue vigiar várias conexões que estão só esperando, sem prender uma thread inteira de trabalho só para segurar uma conexão parada. É o mecânico que não fica plantado ao lado de um carro que só está aguardando ordem; ele vigia vários carros em espera de uma vez e só age quando um deles de fato precisa.
- Vantagens: eficiente para conexões keep-alive, otimizado para tráfego de alta concorrência, suporte nativo a HTTP/2.
- Desvantagens: exige módulos thread-safe e é mais complexo de configurar.
- Uso típico: recomendado para a maioria dos novos deployments.

| MPM | Isolamento | Consumo de memória | Concorrência | Quando usar |
|---|---|---|---|---|
| Prefork | Total (processo por conexão) | Alto | Baixa | Máxima estabilidade, módulos não thread-safe |
| Worker | Por processo (threads compartilham) | Médio | Alta | Tráfego moderado a alto, módulos thread-safe |
| Event | Por processo, otimizado p/ keep-alive | Baixo | Muito alta | Recomendado para a maioria dos deployments novos |

> **É neste ponto que o grid se separa.** Prefork, Worker, Event: quem decora os três nomes é um; quem entende que a diferença mora em processo, thread e isolamento é outro nível. Respira e lê a tabela devagar, porque essa curva premia quem entra no tempo certo.

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

Trocar de MPM é como reconfigurar a garagem entre uma corrida e outra: a mesma equipe, o mesmo Apache, muda de comportamento só pela forma de organizar boxes e mecânicos.

> **Pit stop cronometrado, com o Apache Bench segurando o cronômetro.** Descobre o MPM ativo, troca, e roda o `ab` antes e depois. A mesma máquina parando em 2 segundos ou em 4 só pela forma de escalar a equipe. Isso é setup de box na prática.

### Mão na massa

> **Confira o carro certo na garagem antes da parada.** Este exercício usa `a2enmod`/`a2dismod` e `apachectl`, comandos que atuam sobre um Apache instalado no host (`sudo apt install apache2`), não sobre o container `httpd:latest` da Etapa 01. O passo 3 também usa o `ab` (Apache Bench) para cronometrar a carga, o mesmo papel do cronômetro num pit stop: se não estiver instalado, rode `sudo apt install apache2-utils` antes de executá-lo.

1. Rode `apachectl -V | grep -i mpm` (ou `httpd -V | grep -i mpm`, dependendo da distro) no seu Apache e anote qual MPM está ativo agora.
2. Se o seu sistema usa Debian/Ubuntu, troque o MPM ativo com `a2dismod`/`a2enmod` e confirme a troca com `a2query -M`.
3. Rode um teste de carga simples contra o mesmo Apache, antes e depois da troca de MPM: `ab -n 500 -c 50 http://localhost/` (Apache Bench). Compare as linhas `Requests per second` e `Time per request` entre as duas rodadas. Não espere um número mágico: o objetivo é sentir que a mesma máquina, o mesmo Apache, se comporta diferente só por causa do MPM escolhido. É a mesma sensação de um pit stop que sai em 2 segundos ou em 4 dependendo de como a equipe foi escalada.

### Anota aí

> Prefork isola tudo em processos e é o mais pesado; Worker divide isso em threads dentro de poucos processos e é mais leve, mas exige código thread-safe; Event é o Worker afinado para não gastar uma thread inteira em conexões keep-alive ociosas, e é o modelo recomendado hoje. Box isolado por carro, bancada compartilhada por equipe, ou mecânico que vigia vários carros em espera de uma vez.

> **Setor 4 concluído.** Box isolado por carro, bancada compartilhada por equipe, ou mecânico vigiando vários carros em espera: você já escolhe o formato da garagem conforme a corrida. Falta só a curva rápida final, onde o Nginx mostra por que nasceu pra essa era. Setor 5.

---

## Etapa 05: Nginx e a arquitetura orientada a eventos

> **Setor 5, a curva rápida final.** Última parcial da volta, e é aqui que o chassi mais enxuto do grid brilha. O Nginx segue a regra de ouro dos projetistas de F1: primeiro simplifica, depois tira todo peso que não precisa estar ali. Vamos ver esse carro na sua melhor curva.

### O problema

Cenário: uma aplicação com muitas conexões simultâneas de longa duração e majoritariamente ociosas (chat em tempo real, notificações push, keep-alive de APIs de aplicativos móveis). Mesmo com o Event MPM do Apache reduzindo o custo das conexões ociosas (Etapa 04), o modelo continua fundamentado em reservar uma thread para cada conexão que está sendo ativamente processada. Escalar para dezenas de milhares de conexões simultâneas significa escalar, na mesma proporção, a quantidade de threads e a memória que elas consomem, até o sistema esbarrar no limite prático de threads que conseguem coexistir com eficiência. Imagine querer um engenheiro dedicado por carro para monitorar dezenas de milhares de carros ao mesmo tempo: não existe pit wall que comporte isso.

Foi exatamente esse problema que o Nginx nasceu, do zero, para resolver. Enquanto o Apache nasceu como servidor web tradicional e foi ganhando modelos de concorrência ao longo do tempo, o Nginx já foi concebido com uma arquitetura moderna em mente, pensada especialmente para servir conteúdo estático e atuar como proxy reverso (a função da Etapa 03) sob alta concorrência. Um chassi projetado desde o desenho pra ser leve e escalável, no espírito dos carros mais enxutos da era 2026.

### O conceito

A diferença central do Nginx é a arquitetura **assíncrona orientada a eventos (event-driven)**, bem diferente do modelo de thread ou processo dedicado por conexão.

**Analogia (F1):** pense num engenheiro de pista no telemetry wall, aquele painel gigante com a telemetria de todos os carros ao mesmo tempo. Ele não fica plantado olhando fixo para um único carro esperando algo acontecer. Ele varre o painel inteiro e só age quando um evento dispara: um alerta de temperatura de pneu no carro do Russell, um pedido de undercut no carro do Antonelli. Um único engenheiro consegue monitorar a grade inteira assim, porque nunca fica bloqueado esperando um carro só.

No Apache, cada conexão ativa costuma ocupar uma thread ou processo dedicado enquanto durar (mesmo o Event MPM reserva uma thread só para a requisição sendo efetivamente processada, ele só evita gastar uma thread inteira em conexões apenas ociosas). Com 10 mil usuários conectados ao mesmo tempo, é preciso sustentar uma fração relevante de 10 mil threads ou processos consumindo memória. Seria como querer um engenheiro por carro para uma grade de dez mil carros.

No Nginx:
- **Non-blocking I/O**: quando uma operação de entrada/saída é necessária (ler do disco, esperar resposta de um backend), o worker registra um evento e passa a processar outra conexão, em vez de ficar parado esperando. O engenheiro registra "me avisa quando o dado do carro X chegar" e já vai cuidar do carro Y.
- **Event loop**: cada processo worker roda um loop de eventos que gerencia milhares de conexões usando poucos recursos. É a varredura contínua do telemetry wall.
- Quando o evento fica pronto (o dado chegou, o disco respondeu), o worker é notificado e retoma exatamente de onde parou. O alerta pisca no painel, o engenheiro reage naquele carro e volta a varrer o resto.

Essa abordagem torna o Nginx muito eficiente, especialmente para conexões keep-alive e para conexões ociosas, exatamente o cenário descrito no problema desta etapa. Benefícios práticos: menor consumo de memória, maior throughput, melhor latência e desempenho excelente como proxy reverso e balanceador de carga, inclusive na frente do próprio Apache.

Aqui a comparação com o carro precisa de um cuidado, pra não vender ilusão: no telemetry wall real, um engenheiro humano tem limite de atenção e realmente se perde com carros demais. O worker do Nginx não "se cansa": ele processa cada evento em microssegundos e volta ao loop, e o gargalo passa a ser CPU e memória, não atenção. A imagem do engenheiro serve pra entender a lógica do event loop, não pra dizer que existe um humano ali dentro.

> **Última chance de bater o tempo da volta.** Non-blocking I/O e event loop são o coração de tudo. Se você sacar como um único engenheiro varre o telemetry wall inteiro sem travar em nenhum carro, você fechou a volta perfeita. Vai com tudo nesse trecho.

### Exemplo comentado: poucos processos, milhares de conexões

```nginx
# /etc/nginx/nginx.conf (trecho principal)
worker_processes auto;   # 1 processo worker por núcleo de CPU disponível

events {
    worker_connections 1024;   # cada worker aguenta até 1024 conexões simultâneas
    use epoll;                 # mecanismo de notificação de eventos do kernel Linux
}
```

Com `worker_processes auto` e `worker_connections 1024` numa máquina de 4 núcleos, o Nginx consegue, em teoria, atender até 4096 conexões simultâneas usando apenas 4 processos worker (mais o processo mestre, que só gerencia os workers e não atende requisições diretamente). Quatro engenheiros no telemetry wall vigiando 4096 carros, e um chefe de equipe que coordena os engenheiros sem pegar em rádio. O `epoll` é o sistema de telemetria que cutuca o engenheiro certo assim que um canal recebe dado novo.

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

Repare: 187 conexões estabelecidas sendo atendidas por apenas 2 processos worker. Dois engenheiros dando conta de 187 carros. Num Apache com Prefork ou Worker sob a mesma carga, o `ps aux` costuma mostrar dezenas ou centenas de linhas, uma por processo ou thread envolvido, ou seja, um mecânico ou box para quase cada carro.

> **Volta rápida final, cronômetro no limite.** Conta os processos com `ps aux`, joga carga com o `ab` e observa: o número de engenheiros no muro não muda, chegue quanto carro chegar. Essa é a volta que crava a pole.

### Mão na massa

> **Mesmo telemetry wall, mesma garagem certa.** Assim como na Etapa 03, este exercício lê a configuração e observa os processos de um Nginx instalado no host, não do container `nginx:latest` da Etapa 01. É o seu telemetry wall lendo dados do carro que está na sua garagem. O passo 3 volta a usar o `ab`: instale com `sudo apt install apache2-utils` se ainda não tiver feito isso na Etapa 04.

1. Localize o `nginx.conf` do seu Nginx (`nginx -t` mostra o caminho no início da saída) e identifique as diretivas `worker_processes` e `worker_connections`.
2. Rode `ps aux | grep '[n]ginx'` e conte quantos processos aparecem. Compare com `nproc` (número de núcleos da sua máquina): o número de workers costuma ser igual ou próximo. Tantos engenheiros quantos núcleos disponíveis.
3. Gere carga com múltiplas conexões simultâneas: `ab -n 1000 -c 200 http://localhost/`. Durante o teste, rode `ps aux | grep '[n]ginx'` num segundo terminal. **Observe**: o número de processos não muda, mesmo com centenas de conexões simultâneas batendo no servidor. Os mesmos engenheiros no muro, chegando mais carro ou não.
4. Se tiver acesso a um Apache no mesmo tipo de teste, repita a carga nele e rode `ps aux | grep '[a]pache2\|[h]ttpd'`. Dependendo do MPM configurado, **observe** o número de processos ou threads crescer junto com a carga, ao contrário do que aconteceu com o Nginx. Ali a garagem contrata mecânico conforme o movimento; aqui o muro segue com a mesma equipe.

### Anota aí

> Apache lida com concorrência dedicando um processo ou thread a cada conexão (mesmo otimizado pelo Event MPM); Nginx lida com concorrência usando poucos processos rodando um loop de eventos não bloqueante, e é exatamente por isso que ele domina como proxy reverso e balanceador de carga na frente de qualquer coisa, inclusive do próprio Apache. Um mecânico por carro contra um engenheiro varrendo o telemetry wall inteiro.

> **Setor 5 no verde, primeiro stint completo!** Poucos processos, um loop de eventos e o Nginx dominando a borda. A base está pronta; agora entram balanceamento, cluster, malha, disponibilidade e segurança.

---

## Etapa 06: balanceamento L4, L7 e algoritmos do Nginx

> **Reentrada na pista!** Um único carro não absorve todo o campeonato. A partir daqui, o estrategista precisa repartir trabalho sem mandar tráfego pesado sempre para o mesmo box.

No balanceamento L4, a decisão usa dados de transporte, como IP e porta. No L7, o proxy entende HTTP e pode escolher por host, path, header ou cookie. L7 entrega mais controle, mas também processa mais informação.

No Nginx, Round Robin é o comportamento padrão. `weight` representa capacidades diferentes, `least_conn` favorece quem mantém menos conexões ativas e `ip_hash` oferece afinidade pelo endereço do cliente. Afinidade ajuda aplicações com estado local, mas dificulta redistribuição e escalabilidade. Sempre que possível, prefira sessão externa e backends stateless.

```nginx
upstream api_pool {
    least_conn;
    server api-1:3000 weight=2;
    server api-2:3000;
    server api-3:3000;
    keepalive 32;
}

server {
    listen 80;
    location /api/ {
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_pass http://api_pool;
    }
}
```

### Volta de verificação

1. Valide a configuração com `nginx -t` e recarregue com `nginx -s reload`.
2. Execute `ab -n 1000 -c 50 http://localhost/api/`.
3. Compare a distribuição com Round Robin, peso e `least_conn`.
4. Registre throughput, latência e quantidade de respostas por backend.

> **Setor 6 no verde.** A carga está dividida, mas estratégia sem telemetria vira aposta. A próxima volta ensina a retirar um backend incapaz antes que ele comprometa a corrida.

---

## Etapa 07: health checks, failover e diagnóstico

> **Alerta na telemetria!** Um carro perdeu ritmo. A mureta precisa parar de enviar trabalho para ele, acionar a reserva e explicar exatamente o que aconteceu.

No Nginx Open Source, `max_fails` e `fail_timeout` oferecem verificação passiva: falhas observadas no tráfego real afastam temporariamente o upstream. Um servidor marcado como `backup` recebe chamadas quando os primários ficam indisponíveis. Verificações ativas exigem Nginx Plus ou soluções adicionais.

```nginx
upstream api_pool {
    server api-1:3000 max_fails=3 fail_timeout=10s;
    server api-2:3000 max_fails=3 fail_timeout=10s;
    server api-backup:3000 backup;
}
```

`stub_status`, logs, Prometheus e Grafana transformam sintomas em sinais. Como regra de diagnóstico, 502 costuma indicar conexão recusada ou resposta inválida do upstream; 504 aponta que o proxy esperou além do timeout.

### Volta de verificação

1. Gere carga e interrompa `api-1`.
2. Confirme nos logs sua saída temporária da rotação.
3. Interrompa os primários e observe o backup assumir.
4. Provoque um endereço inválido e uma resposta lenta para distinguir 502 de 504.

> **Setor 7 no verde.** O proxy já reage à falha. Agora a pista cresce para um cluster, com muitos Services compartilhando uma entrada declarativa.

---

## Etapa 08: Ingress no Kubernetes

> **Chegada ao paddock.** Muitos boxes, poucos portões. A credencial informa o destino e a equipe de entrada encaminha cada chamada ao Service correto.

Ingress é a declaração de hosts e paths. Ingress Controller é o software que observa essa declaração e configura o proxy real. Criar apenas o recurso, sem Controller, não altera o tráfego.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: pitstop
spec:
  ingressClassName: nginx
  rules:
    - host: pitstop.local
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api
                port:
                  number: 3333
```

`ingressClassName` escolhe o Controller e `pathType` define a correspondência. Anotações são específicas da implementação e precisam ser conferidas na documentação do Controller. Ingress continua estável, mas sua API está congelada; para arquiteturas novas, compare com Gateway API.

### Volta de verificação

Instale um Controller, publique frontend e API, teste `/` e `/api` com o header `Host` e confira os endpoints do Service antes de culpar o proxy.

> **Setor 8 no verde.** A entrada conhece o destino. Falta garantir que a credencial TLS seja válida e renovada antes de vencer.

---

## Etapa 09: TLS automático com cert-manager

> **Documento vencido não passa no portão.** Um certificado expirado também para o sistema antes da largada.

Issuer emite certificados dentro de um namespace; ClusterIssuer pode atender o cluster. Certificate declara nomes DNS e o Secret de destino. No fluxo ACME, HTTP-01 ou DNS-01 prova o controle do domínio, e o cert-manager acompanha validade e renovação.

```yaml
metadata:
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-staging
spec:
  tls:
    - hosts: [pitstop.example.com]
      secretName: pitstop-tls
```

A chave privada não deve aparecer no manifesto nem no repositório. O Ingress referencia o Secret criado pelo controlador.

### Volta de verificação

1. Comece com um emissor de staging.
2. Acompanhe `kubectl get certificate,order,challenge -A`.
3. Leia eventos com `kubectl describe certificate pitstop-tls`.
4. Valide handshake e cadeia com `curl -Iv https://pitstop.example.com`.

> **Setor 9 no verde.** A borda está roteada e criptografada. Dentro do cluster, a próxima missão é padronizar retries, identidade e telemetria entre serviços.

---

## Etapa 10: Service Mesh e arquitetura do Istio

> **A rede virou parte da corrida.** Quando dezenas de serviços conversam, cada chamada pode atrasar, falhar ou chegar sem identidade confiável.

No modelo sidecar ensinado nesta aula, um Envoy acompanha cada workload e forma o Data Plane. Ele aplica roteamento, resiliência, segurança e telemetria. Istiod forma o Control Plane, distribuindo descoberta, configuração e identidades. O Istio atual também oferece o modo ambient, mas o laboratório desta etapa usa sidecars para tornar o caminho visível.

```sh
istioctl install --set profile=demo -y
kubectl label namespace demo istio-injection=enabled
kubectl rollout restart deployment -n demo
istioctl proxy-status
```

Um Pod `2/2` mostra aplicação e proxy. Esse poder tem custo: CPU, memória, latência por salto e uma plataforma adicional para atualizar e diagnosticar.

### Volta de verificação

Compare consumo antes e depois da injeção, confirme sincronização dos proxies e descreva um cenário em que a complexidade da malha não compensa.

> **Setor 10 no verde.** Todos os carros recebem a estratégia. Agora a mureta pode liberar uma versão nova em voltas controladas.

---

## Etapa 11: VirtualService, DestinationRule e deploy gradual

> **Versão nova não larga com cem por cento do tráfego.** Primeiro vêm voltas de instalação, comparação de telemetria e promoção apenas quando o ritmo confirma.

DestinationRule define subsets, como v1 e v2. VirtualService decide quem recebe cada chamada por peso, header ou path, além de timeout, retry, mirroring e injeção de falhas.

- Canary envia uma fração real para a versão nova.
- A/B seleciona um grupo por condição HTTP.
- Mirroring copia a chamada, mas ignora a resposta da versão espelhada.
- Circuit breaking e outlier detection contêm falhas antes que virem cascata.

Retries ajudam falhas transitórias, mas também multiplicam carga. Defina limite, timeout por tentativa e critérios de promoção baseados em erros, latência e negócio.

### Volta de verificação

Aplique uma divisão 90/10, conte cem respostas, fixe um usuário de teste na v2 por header e pratique rollback. Rode `istioctl analyze` antes de atribuir um desvio ao proxy.

> **Setor 11 no verde.** A versão nova ganhou tráfego controlado. A próxima etapa garante identidade nos dois lados do rádio e reconstrói cada hop.

---

## Etapa 12: mTLS e observabilidade da malha

> **Não basta ouvir uma voz no rádio.** A equipe precisa saber quem fala, o que essa identidade pode pedir e onde a mensagem perdeu tempo.

PeerAuthentication controla mTLS. PERMISSIVE aceita tráfego com e sem identidade e ajuda na migração. STRICT exige mTLS. AuthorizationPolicy aplica privilégio mínimo por origem, método e path.

Prometheus armazena métricas, Grafana apresenta painéis, Jaeger reconstrói traces e Kiali mostra topologia e estado da malha. O proxy coleta sinais, mas a aplicação ainda deve propagar os headers de tracing para não quebrar a cadeia.

```yaml
apiVersion: security.istio.io/v1
kind: PeerAuthentication
metadata:
  name: default
  namespace: demo
spec:
  mtls:
    mode: STRICT
```

### Volta de verificação

Migre de PERMISSIVE para STRICT, prove que um cliente fora da malha falha, valide as identidades permitidas e rode `istioctl proxy-config secret deploy/api -n demo` para conferir certificados ativos.

> **Setor 12 no verde.** A comunicação interna ganhou identidade e telemetria. Agora precisamos garantir que a operação sobreviva quando uma peça inteira desaparecer.

---

## Etapa 13: alta disponibilidade, SLO e recuperação

> **Confiabilidade aparece quando algo quebra.** Se existe um único ponto cuja falha derruba a operação, a corrida depende de uma peça sem reserva.

SLA é o compromisso com o cliente; SLO é o alvo operacional usado pela equipe. Métricas e orçamento de erro mostram quanto risco ainda cabe. SPOFs devem ser removidos, reduzidos ou aceitos de forma explícita.

Active-passive mantém uma instância de espera e simplifica consistência. Active-active usa a capacidade das instâncias simultaneamente, mas exige coordenação maior. Em dois nós Nginx, Keepalived e VRRP podem mover um IP virtual quando o ativo falha.

HA e Disaster Recovery não são sinônimos. HA reduz interrupções locais; DR recupera o serviço após um desastre. RTO define quanto tempo a recuperação pode levar e RPO quanto dado pode ser perdido.

### Volta de verificação

Derrube o nó ativo, meça o tempo de troca do IP virtual e relacione o resultado ao SLO. Depois injete perda de rede, latência e indisponibilidade de dependência em ambiente controlado. Isso é Chaos Engineering com hipótese, limite e observação, não falha aleatória em produção.

> **Setor 13 no verde.** A operação resiste à quebra. A última volta protege a borda sem bloquear quem realmente deveria entrar.

---

## Etapa 14: WAF, rate limiting e defesa em camadas

> **Última volta!** Disponibilidade sem segurança mantém a porta aberta também para abuso. A borda precisa distinguir acesso legítimo de comportamento hostil.

TLS e HSTS protegem o canal. Rate limiting reduz abuso e rajadas. Um WAF inspeciona conteúdo HTTP; ModSecurity executa regras e OWASP CRS oferece um conjunto mantido de detecções comuns.

WAF não corrige vulnerabilidade no código. Ele reduz exposição e compra tempo para a correção definitiva. Comece em modo de detecção, leia falsos positivos e só então habilite bloqueio.

```nginx
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/s;

server {
    add_header Strict-Transport-Security "max-age=31536000" always;
    location /login {
        limit_req zone=login burst=10 nodelay;
        proxy_pass http://api_pool;
    }
}
```

### Volta de verificação

Envie tráfego normal e payloads de laboratório, acompanhe `modsec_audit.log`, valide um 403 do WAF e um 429 do limitador. Termine com um checklist de TLS, HSTS, atualização do CRS, retenção de logs, alertas e menor privilégio.

> **Setor 14 no verde, bandeira quadriculada!** A volta começou num servidor web isolado e termina numa borda distribuída, observável, resiliente e protegida.

---
## Bandeira quadriculada: hora da pesagem

Bandeira quadriculada agitando na reta dos boxes! Quatorze setores completados, da primeira requisição à borda resiliente e protegida. Mas em F1 ninguém sobe no pódio sem passar pela pesagem, e o checklist abaixo confirma se o tempo foi limpo. Marque cada item só se você conseguiu fazer ou explicar em voz alta.

## Checklist de autoavaliação

Marque cada item apenas se você **fez** ou **conseguiu explicar em voz alta**, não se apenas leu. Se algum item ficar em branco, volte à etapa correspondente e refaça o mão na massa. É o seu debrief pós-corrida: sem enrolar o engenheiro.

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

Se todos os quadradinhos estão marcados, pode subir no pódio: você domina o caminho da requisição, do servidor isolado ao balanceamento, cluster, malha, alta disponibilidade e segurança. Se sobrou algum em branco, volte ao setor correspondente e repita a prática.

---

## Notas do professor

1. **Correção técnica (Etapa 04, Worker MPM):** o relatório bruto afirmava que "problemas em um thread podem corromper o processo pai". Isso é impreciso: threads de uma mesma requisição vivem dentro de um processo **filho**, e é esse processo filho específico que pode ser corrompido ou derrubado por um erro grave numa de suas threads (já que elas compartilham a mesma memória). O processo mestre e os demais processos filhos não são afetados. Na imagem da garagem: o mecânico derruba a bancada do próprio box e prejudica só a equipe dele; os outros boxes e o chefe de equipe seguem de pé. Corrigi essa descrição no texto principal.
2. **Nota, não correção (Etapa 02, Server Push do HTTP/2):** o relatório bruto lista o Server Push como um dos ganhos do HTTP/2, o que é historicamente correto (fez parte da especificação original de 2015). Vale registrar que, na prática de 2026, esse recurso caiu em desuso: os principais navegadores (o Chrome, por exemplo, desde 2022) removeram ou restringiram o suporte a ele, porque o ganho real de performance raramente compensava a complexidade de usá-lo corretamente. As demais melhorias do HTTP/2 (multiplexação, HPACK, priorização) seguem plenamente em uso.
3. **Atualização de contexto temporal (Etapa 01, idade do Apache):** o relatório bruto descreve o Apache HTTP Server como tendo "mais de 25 anos de história". Isso ainda é verdade, mas impreciso: o projeto teve seu primeiro lançamento em 1995, o que hoje (2026) equivale a mais de 30 anos. Ajustei a referência no texto principal.
4. **Nota, não correção (Etapa 03, reverse proxy e XSS):** o relatório bruto cita proteção contra XSS como uma função de segurança do reverse proxy. Isso só é verdade quando o proxy está configurado com regras adicionais de WAF (Web Application Firewall, como o ModSecurity); um reverse proxy puro, sem esse módulo, filtra bem certos padrões de tráfego e ataques de rede, mas não inspeciona por padrão o conteúdo em busca de payloads de XSS. Deixei essa ressalva explícita no texto principal.
5. **Ajuste de trilha prática (revisão pós-publicação):** um aluno seguindo a rota Docker sugerida na Etapa 01 travava nos exercícios das Etapas 03, 04 e 05, porque `nginx -s reload`, `a2enmod` e o `proxy_pass` para `127.0.0.1:8000` pressupõem Nginx/Apache instalados no host, e `127.0.0.1` dentro de um container não alcança um processo do host (o endereço do box não bate com o da garagem certa). Adicionei uma nota logo na abertura do guia (com a alternativa de instalação local ou de usar `--network host` para quem preferir continuar no Docker), reforcei o aviso no início do "mão na massa" das três etapas afetadas, avisei sobre o pré-requisito do pacote `apache2-utils` para o `ab` antes do primeiro exercício que o usa, e deixei explícito, na Etapa 01, que o bloco `server { listen 80; ... }` ali mostrado é ilustrativo e não precisa ser editado à mão para completar aquele exercício. A tematização de F1 dessas notas segue a mesma linha do resto: mexer no set-up do carro certo, na garagem certa.

---

## Onde a analogia de F1 ajuda e onde ela para

A lente de F1 é boa pra sentir a lógica, mas todo set-up tem limite. Três pontos onde a comparação começa a escorregar, pra você não levar a metáfora pra dentro da curva rápido demais:

- **Conexão como carro, na Etapa 04 e na 05.** Funciona pra entender custo e isolamento, mas um Pod, um processo ou uma thread sobe e morre em milissegundos e você tem milhares deles. Um carro de verdade é caro, único e você tem dois por equipe. A escala é completamente diferente: onde a garagem tem 2 carros, o servidor tem 4 mil conexões.
- **Engenheiro no telemetry wall, na Etapa 05.** Serve pra explicar o event loop, mas um humano cansa e se perde; o worker do Nginx não. O gargalo real do Nginx é CPU e memória, não atenção. A imagem é didática, o mecanismo é diferente.
- **Rádio e telemetria como HTTP, na Etapa 02.** O paralelo do head-of-line blocking é fiel, mas o rádio real da F1 tem prioridade humana (o engenheiro escolhe a hora de falar) e o protocolo não. E a telemetria de F1 é majoritariamente de mão única (carro para o box), enquanto o HTTP é sempre um par pergunta e resposta. Use a imagem pra sentir a fila e o pacote perdido, não pra igualar os protocolos byte a byte.

- **Ingress como portão, nas Etapas 08 e 09.** Ajuda a visualizar uma entrada compartilhada, mas Ingress é uma declaração e o Controller é quem executa. Na pista, portão e agente parecem uma coisa só.
- **Envoy como unidade de telemetria, nas Etapas 10 a 12.** Explica a presença junto ao workload, mas o proxy também interfere no tráfego, aplica segurança e acrescenta latência. Telemetria real observa muito mais do que controla.
- **Redundância de F1 como alta disponibilidade, na Etapa 13.** Explica reação a falhas, mas uma equipe não promete SLA público nem escala carros como réplicas. A imagem não substitui capacidade, RTO ou RPO.

---

Fechamento de transmissão: você entrou com uma aplicação exposta e sai com o traçado inteiro na cabeça, do conteúdo estático ao balanceamento, Ingress, Istio, failover e defesa em camadas. Guarde o pit board, revise o debrief e boa pista!
