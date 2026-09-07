// Conteúdo das 14 etapas, baseado nas Aulas 01 a 05 do módulo de Servidores Web e Balanceamento de Carga,
// tematizado com Fórmula 1 pelo pipeline /otimizar-relatorio (relatorios/servidores-web-nginx-apache/final.md)

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
  narration: string;
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
  outro: string;
};

export type Mapping = { sw: string; f1: string };

// O quadro de-para do piloto: a mesma analogia vale do início ao fim do guia
export const DE_PARA: Mapping[] = [
  {
    sw: "Aplicação (lógica de negócio, o Node na porta 3000)",
    f1: "O piloto pilotando: a competência central, correr e nada mais",
  },
  {
    sw: "Servidor web (Nginx / Apache)",
    f1: "A operação de mureta e garagem: tudo ao redor do piloto",
  },
  { sw: "Requisição HTTP", f1: "Uma chamada de rádio, um pedido que chega à mureta" },
  { sw: "Conexão", f1: "Um carro sob os cuidados da equipe, na garagem ou na pista" },
  {
    sw: "Conteúdo estático",
    f1: "Dado pronto e fixo entregue sem acionar o piloto (mapas de pista, referências de volta)",
  },
  {
    sw: "Proxy para app dinâmica",
    f1: "Repassar ao piloto a pergunta que só ele ou o engenheiro responde",
  },
  {
    sw: "Reverse proxy",
    f1: "A mureta na entrada: recebe tudo de fora e distribui para os carros por trás",
  },
  {
    sw: "Forward proxy",
    f1: "O empresário do piloto, que fala com o mundo externo em nome dele (saída)",
  },
  {
    sw: "Load balancer",
    f1: "O estrategista distribuindo carga e stints entre os carros da equipe",
  },
  {
    sw: "Terminação TLS/SSL",
    f1: "O canal de rádio criptografado, gerenciado num ponto único pela equipe",
  },
  { sw: "Cache", f1: "Respostas prontas do engenheiro para as perguntas que sempre voltam" },
  {
    sw: "Controle de acesso e segurança",
    f1: "A credencial de paddock e o segurança do box barrando quem não tem acesso",
  },
  { sw: "HTTP (o protocolo)", f1: "O protocolo de rádio e telemetria entre carro e mureta" },
  {
    sw: "HTTP stateless",
    f1: "Cada chamada de rádio é independente, o contexto vive no pit board (cookies, sessão)",
  },
  {
    sw: "Head-of-line blocking",
    f1: "Fila travada no rádio: uma transmissão longa segura todas as outras",
  },
  {
    sw: "HTTP/1.1 keep-alive",
    f1: "Manter o canal de rádio aberto, porém uma transmissão por vez",
  },
  {
    sw: "HTTP/2 multiplexação",
    f1: "Vários canais de telemetria trafegando ao mesmo tempo no mesmo link",
  },
  {
    sw: "HTTP/3 (QUIC sobre UDP)",
    f1: "Trocar o transporte para que um pacote perdido não trave o resto (zona de rádio ruim)",
  },
  { sw: "MPM (Apache)", f1: "O jeito de escalar a equipe de mecânicos na garagem" },
  { sw: "Processo (Apache)", f1: "Um box independente, com ferramentas próprias e espaço próprio" },
  { sw: "Thread", f1: "Um mecânico dentro daquele box" },
  {
    sw: "Memória compartilhada do processo",
    f1: "A bancada de ferramentas compartilhada daquele box",
  },
  {
    sw: "Prefork MPM",
    f1: "Um box inteiro e isolado para cada carro: isolamento total, custo altíssimo",
  },
  { sw: "Worker MPM", f1: "Poucos boxes, cada um com vários mecânicos dividindo a mesma bancada" },
  {
    sw: "Event MPM",
    f1: "Mecânicos que não ficam parados segurando um carro que só está esperando",
  },
  {
    sw: "Módulo não thread-safe",
    f1: "Uma ferramenta legada que não pode dividir bancada: exige box isolado",
  },
  {
    sw: "Arquitetura event-driven (Nginx)",
    f1: "A mureta com event loop: poucos engenheiros vigiando o telemetry wall inteiro",
  },
  {
    sw: "Non-blocking I/O",
    f1: 'O engenheiro registra "me avisa quando o dado do carro X chegar" e segue cuidando dos outros',
  },
  {
    sw: "Event loop",
    f1: "O engenheiro varrendo o painel de telemetria, agindo só quando um alerta dispara",
  },
  { sw: "Worker process (Nginx)", f1: "Cada engenheiro postado no telemetry wall" },
  { sw: "epoll", f1: "O sistema de telemetria que avisa qual canal acabou de receber dado novo" },
  {
    sw: "Balanceamento L4",
    f1: "A torre distribui carros olhando número e portão, sem ouvir a mensagem de rádio",
  },
  {
    sw: "Balanceamento L7",
    f1: "A mureta entende a mensagem completa antes de escolher quem responde",
  },
  {
    sw: "Health check e failover",
    f1: "Telemetria detectando uma peça fora da janela e acionando o sistema redundante",
  },
  {
    sw: "Ingress e Ingress Controller",
    f1: "O portão único do paddock e a equipe que lê a credencial para indicar o box correto",
  },
  {
    sw: "cert-manager",
    f1: "A central que emite e renova automaticamente as credenciais seguras do paddock",
  },
  {
    sw: "Service Mesh",
    f1: "A rede operacional que conecta todos os carros, boxes e engenheiros sob políticas comuns",
  },
  {
    sw: "Envoy sidecar",
    f1: "A unidade de telemetria ao lado de cada carro, aplicando as ordens da mureta",
  },
  {
    sw: "VirtualService e DestinationRule",
    f1: "O plano de corrida que divide tráfego entre versões e define o set-up de cada grupo",
  },
  { sw: "mTLS", f1: "Rádio em que carro e mureta autenticam um ao outro antes de trocar dados" },
  {
    sw: "Alta disponibilidade",
    f1: "Sistemas redundantes prontos para manter a operação quando uma peça falha",
  },
  {
    sw: "WAF",
    f1: "A segurança do paddock inspecionando credencial e conteúdo antes de liberar a entrada",
  },
];

// Notas do piloto: onde as analogias quebram (analogia forçada é pior que analogia nenhuma)
export const ANALOGY_NOTES: string[] = [
  "Conexão como carro, na Etapa 04 e na 05: funciona pra entender custo e isolamento, mas um processo ou uma thread sobe e morre em milissegundos e você tem milhares deles. Um carro de verdade é caro, único, e você tem dois por equipe. A escala é completamente diferente: onde a garagem tem 2 carros, o servidor tem 4 mil conexões.",
  "Engenheiro no telemetry wall, na Etapa 05: serve pra explicar o event loop, mas um humano cansa e se perde; o worker do Nginx não. O gargalo real do Nginx é CPU e memória, não atenção. A imagem é didática, o mecanismo é diferente.",
  "Rádio e telemetria como HTTP, na Etapa 02: o paralelo do head-of-line blocking é fiel, mas o rádio real da F1 tem prioridade humana (o engenheiro escolhe a hora de falar) e o protocolo não. A telemetria de F1 também é majoritariamente de mão única (carro para o box), enquanto o HTTP é sempre um par pergunta e resposta. Use a imagem pra sentir a fila e o pacote perdido, não pra igualar os protocolos byte a byte.",
  "Ingress como portão do paddock, nas Etapas 08 e 09: ajuda a visualizar um ponto de entrada e o roteamento por destino. No Kubernetes, porém, o Ingress é uma declaração e o Controller é o componente que executa; no circuito, portão e agente parecem uma coisa só.",
  "Envoy como unidade de telemetria, nas Etapas 10 a 12: a imagem explica a presença junto de cada workload, mas o proxy também altera tráfego, aplica segurança e pode introduzir latência. Telemetria real observa muito mais do que interfere.",
  "Redundância de F1 como alta disponibilidade, na Etapa 13: equipes mantêm sistemas e peças reservas, mas não escalam carros sem limite nem garantem um SLA público. A analogia explica reação a falhas, não capacidade ou contrato.",
];

export const LESSONS: Lesson[] = [
  {
    id: "sw1",
    num: "01",
    navTitle: "Por que existe",
    tag: "mureta + garagem",
    title: "Para que serve um servidor web",
    narration:
      "Luzes apagadas! A primeira curva já cobra a decisão que define a corrida inteira: o que fica no colo do piloto e o que vai pra mureta. As melhores equipes ganham GP no box, e uma parada de Red Bull em menos de dois segundos prova que a operação ao redor do piloto decide tanto quanto o carro. Bora entender por quê.",
    lead: "Imagine uma equipe que sobe uma aplicação Node.js e a deixa atendendo direto na porta 3000, sem nada na frente dela. No começo funciona bem, mas o produto cresce e uma série de dores aparece, e nenhuma delas tem a ver com a lógica de negócio: servir arquivos estáticos passa a competir pelo mesmo processo que roda a aplicação, renovar o certificado HTTPS exige mexer no código e reiniciar o processo, distribuir tráfego entre réplicas vira uma decisão manual a cada requisição, e não existe nenhuma camada filtrando bots antes de eles baterem direto na aplicação. Traduzindo pro cockpit: é o piloto que, além de pilotar, teria que gerenciar o próprio rádio criptografado, decidir sozinho a estratégia de stint e ainda barrar quem invade o box. Ninguém corre assim.",
    concept: [
      "Cada um desses problemas é de infraestrutura de borda, não de regra de negócio. Resolver todos dentro do próprio código da aplicação mistura responsabilidades que deveriam estar separadas, e é exatamente esse conjunto de responsabilidades que um servidor web como o Apache HTTP Server ou o Nginx assume.",
      "Analogia: pense na mureta e na garagem da sua equipe. Sem elas, o piloto teria que descobrir sozinho a estratégia, cuidar da própria comunicação segura e ainda vigiar quem entra no box. Com uma operação central, chega tudo num único ponto (a mureta), que decide o que repassar ao piloto, barra quem não tem credencial e cuida das tarefas comuns (rádio, telemetria, cronometragem) sem tirar a concentração de quem está no carro. O servidor web é essa mureta da sua infraestrutura: o ponto por onde toda requisição HTTP entra antes de chegar (ou não) até a sua aplicação.",
      "Um servidor web moderno assume, tipicamente, as seis funções dos cartões abaixo. Vale lembrar que essa peça de software é veterana de guerra: o Apache HTTP Server teve seu primeiro lançamento em 1995, ou seja, mais de 30 anos de pista.",
    ],
    pointsTitle: "As seis funções de um servidor web moderno",
    points: [
      {
        t: "Servir conteúdo estático",
        d: "HTML, CSS, JS, imagens e vídeos direto do disco, sem acionar código de aplicação. O mapa de pista entregue sem chamar o piloto no rádio.",
        color: "signal",
      },
      {
        t: "Proxy para app dinâmica",
        d: "Encaminha requisições para PHP-FPM, Tomcat, Node.js, Gunicorn etc. A mureta repassando ao piloto a pergunta que só ele responde.",
        color: "blue",
      },
      {
        t: "Balanceamento de carga",
        d: "Distribui requisições entre múltiplos servidores de aplicação. O estrategista dividindo carga, volta a volta, entre os carros da equipe.",
        color: "ember",
      },
      {
        t: "Terminação SSL/TLS",
        d: "Gerencia certificados e criptografia num ponto central, em vez de espalhar isso por cada instância. O canal de rádio criptografado da equipe.",
        color: "violet",
      },
      {
        t: "Caching",
        d: "Guarda respostas já processadas pra entregar mais rápido depois, sem repetir trabalho. O engenheiro com a resposta pronta pra pergunta que sempre volta.",
        color: "signal",
      },
      {
        t: "Controle de acesso e segurança",
        d: "Filtra tráfego malicioso e aplica autenticação antes que o ataque chegue perto da aplicação. A credencial de paddock na porta do box.",
        color: "ember",
      },
    ],
    examplesTitle: "O cabeçalho Server denuncia quem te atende",
    examples: [
      {
        label: "nginx.conf (ilustrativo)",
        lang: "yaml",
        code: `# /etc/nginx/conf.d/default.conf
server {
    listen 80;                       # a porta que o Nginx escuta
    server_name localhost;           # o domínio que este bloco atende

    location / {
        root /usr/share/nginx/html;  # a pasta onde estão os arquivos estáticos
        index index.html;           # arquivo servido quando a URL termina em "/"
    }
}`,
        note: "Este bloco é ilustrativo: mostra a sintaxe, mas você não precisa criá-lo nem editá-lo à mão pra completar o mão na massa desta etapa. A imagem oficial nginx:latest já sobe com uma configuração equivalente pronta, servindo uma página estática por conta própria. O carro já desce do caminhão com o set-up base montado.",
      },
      {
        label: "curl -I",
        lang: "sh",
        code: `$ curl -I http://localhost:8080
HTTP/1.1 200 OK
Server: nginx/1.27.0
Content-Type: text/html
Content-Length: 615

$ curl -I http://localhost:8081
HTTP/1.1 200 OK
Server: Apache/2.4.58 (Unix)
Content-Type: text/html`,
        note: "Repare no cabeçalho Server: é o próprio servidor web se apresentando, e ele responde antes mesmo de qualquer aplicação existir por trás dele. É a mureta atendendo no rádio antes de o piloto sequer entrar no carro.",
      },
    ],
    commands: [
      { cmd: "docker run -d -p 8080:80 nginx:latest", note: "sobe um Nginx de exemplo" },
      { cmd: "docker run -d -p 8081:80 httpd:latest", note: "sobe um Apache de exemplo" },
      { cmd: "curl -I http://localhost:8080", note: "só os cabeçalhos, sem baixar o corpo" },
      {
        cmd: "curl -I http://localhost:8080/nao-existe",
        note: "confirma o 404 vindo do servidor web",
      },
    ],
    handsOnIntro:
      "Dois containers no ar, um curl pra ler o cabeçalho Server, e você já sente a mureta respondendo antes do piloto entrar no carro. Sem pressa de bater tempo nessa: é volta de reconhecimento de traçado.",
    handsOn: [
      "Suba um container Nginx (docker run -d -p 8080:80 nginx:latest) e um container Apache (docker run -d -p 8081:80 httpd:latest).",
      "Rode curl -I http://localhost:8080 e curl -I http://localhost:8081. Observe o cabeçalho Server de cada um: são dois softwares diferentes respondendo pela mesma tarefa. Dois fornecedores de mureta diferentes fazendo o mesmo trabalho.",
      "Peça um caminho que não existe em cada um (curl -I http://localhost:8080/nao-existe) e observe o 404 Not Found. Essa resposta veio do servidor web, sem nenhuma aplicação ter sido acionada: a mureta barrou o pedido na entrada, o piloto nem soube que existiu.",
    ],
    tip: "Use sempre curl -I pra inspecionar só os cabeçalhos, sem baixar o corpo inteiro da resposta: é o jeito mais rápido de descobrir qual servidor está de fato respondendo antes de aprofundar a investigação.",
    takeaway:
      "Um servidor web não roda a lógica de negócio da sua aplicação: ele cuida de tudo que está ao redor dela (estático, proxy, TLS, cache, segurança) pra que a aplicação não precise se preocupar com isso. Igual à mureta, que existe pra você só pilotar.",
    outro:
      "Ficou claro: a mureta existe pra você só pilotar. Agora o traçado abre pra reta mais longa do circuito, a evolução do protocolo de rádio entre carro e box. Etapa 02, e é sobre ganhar milissegundos na comunicação.",
  },

  {
    id: "sw2",
    num: "02",
    navTitle: "HTTP 1.1 → 2 → 3",
    tag: "reta da evolução HTTP",
    title: "HTTP e sua evolução, de 1.1 a QUIC/HTTP-3",
    narration:
      "Aqui a briga é por milissegundos na conversa entre carro e mureta, e três gerações de protocolo disputam o mesmo asfalto. Lembra de Mansell colado em Senna nas voltas finais de Mônaco 1992, mais rápido e sem conseguir passar? Head-of-line blocking é exatamente isso: o veloz travado atrás de quem foi na frente.",
    lead: "Duas cenas explicam por que o HTTP precisou evoluir, pensadas como duas falhas de comunicação entre carro e mureta. Cena 1: uma página de e-commerce carrega o HTML principal e mais 40 miniaturas de imagem; mesmo com conexões persistentes (keep-alive), o HTTP/1.1 processa uma requisição de cada vez dentro daquela conexão, então a segunda imagem só começa a baixar depois que a primeira chega por completo. É um rádio só: enquanto o engenheiro despeja uma transmissão longa, todos os outros recados esperam na fila. Cena 2: mesmo resolvida a cena 1, um usuário numa rede móvel instável ainda sente lentidão, porque basta um único pacote se perder no meio do caminho pra o carregamento inteiro travar até a retransmissão chegar, mesmo que o resto já tenha chegado. É o carro entrando no túnel de Mônaco: perde uma palavra do rádio e a mensagem inteira congela até repetir, mesmo que o resto já tivesse sido recebido.",
    concept: [
      "Antes das versões, um fato estrutural do próprio HTTP: ele é um protocolo sem estado (stateless). Cada requisição é tratada de forma completamente independente, sem memória de requisições anteriores, como uma chamada de rádio isolada, que não carrega lembrança das chamadas anteriores. Isso torna o protocolo mais simples de escalar, mas exige mecanismos por cima dele (cookies, sessões) pra simular contexto entre requisições de um mesmo usuário. Na mureta, esse contexto vive no pit board e na telemetria acumulada, não na chamada de rádio em si.",
      "HTTP/1.1, a versão clássica (1997): introduziu conexões persistentes (keep-alive), permitindo várias requisições e respostas na mesma conexão TCP, o que reduziu bastante a sobrecarga de abrir conexão nova a cada recurso. A limitação é o head-of-line blocking: se a primeira requisição demora, todas as seguintes, naquela mesma conexão, ficam esperando. Canal aberto, sim, mas uma transmissão por vez, e a longa segura a fila.",
      "HTTP/2, a multiplexação (2015): resolve o head-of-line blocking da cena 1, na camada de aplicação, várias requisições e respostas trafegam simultaneamente pela mesma conexão TCP, sem uma bloquear a outra. É a telemetria moderna de um carro de 2026, que despeja dezenas de canais ao mesmo tempo pelo mesmo link (pressão de pneu, deploy de ERS, modo de asa ativa) sem que um canal segure o outro. Além disso trouxe priorização de recursos, compressão de cabeçalhos via HPACK e o Server Push (recurso que fez parte da especificação original, mas caiu em desuso: os principais navegadores removeram ou restringiram o suporte a ele desde 2022, porque o ganho raramente compensava a complexidade de usá-lo direito).",
      "HTTP/3, QUIC sobre UDP: o HTTP/2 resolveu o head-of-line blocking na aplicação, mas o problema da cena 2 continua numa camada abaixo, o TCP garante que os bytes cheguem em ordem estrita, então, se um pacote se perde, tudo que veio depois dele espera pela retransmissão, mesmo pertencendo a um stream diferente do que travou. O HTTP/3 ataca isso trocando o TCP pelo QUIC (Quick UDP Internet Connections), que roda sobre UDP: cada stream é independente, e a perda de um pacote de um stream não trava os demais. É como ter cada canal de telemetria imune ao ruído dos outros: se a leitura de temperatura de freio some por um instante no túnel, o canal de GPS nem percebe. O ganho é maior em redes com perda de pacotes ou latência alta, o cenário típico de conexões móveis, ou seja, o carro nos trechos mais distantes e ruidosos de uma pista longa como Spa.",
    ],
    pointsTitle: "As três gerações, lado a lado",
    points: [
      {
        t: "HTTP/1.1 (1997)",
        d: "Transporte TCP. Resolveu reabrir conexão a cada requisição com keep-alive. Limitação: head-of-line blocking, uma transmissão por vez.",
        color: "blue",
      },
      {
        t: "HTTP/2 (2015)",
        d: "Ainda TCP. Resolveu o head-of-line blocking na aplicação com multiplexação de streams numa única conexão, mais HPACK e priorização.",
        color: "signal",
      },
      {
        t: "HTTP/3 (QUIC)",
        d: "Transporte UDP via QUIC. Resolveu o head-of-line blocking do próprio TCP com streams independentes: pacote perdido trava só o stream dele.",
        color: "ember",
      },
    ],
    examplesTitle: "Perguntando ao próprio curl qual versão foi negociada",
    examples: [
      {
        label: "negociação de versão",
        lang: "sh",
        code: `# Deixa o curl negociar livremente e mostra a versão usada na resposta
$ curl -so /dev/null -w 'Protocolo negociado: HTTP/%{http_version}\\n' https://www.cloudflare.com
Protocolo negociado: HTTP/2

# Força HTTP/1.1, mesmo que o servidor suporte versões mais novas
$ curl --http1.1 -so /dev/null -w 'Protocolo negociado: HTTP/%{http_version}\\n' https://www.cloudflare.com
Protocolo negociado: HTTP/1.1

# Força HTTP/3 (exige um curl compilado com suporte a QUIC)
$ curl --http3 -so /dev/null -w 'Protocolo negociado: HTTP/%{http_version}\\n' https://www.cloudflare.com
Protocolo negociado: HTTP/3`,
        note: "Nem todo curl vem compilado com suporte a HTTP/3 (depende de uma biblioteca QUIC, como a ngtcp2 ou a quiche). Rode curl --version | grep -i http3 pra conferir antes de usar a flag --http3, o mesmo cuidado de checar se o carro tem o kit de telemetria QUIC instalado antes de exigir esse modo.",
      },
    ],
    commands: [
      {
        cmd: "curl -so /dev/null -w 'HTTP/%{http_version}\\n' <url>",
        note: "mostra a versão negociada",
      },
      { cmd: "curl --http1.1 <url>", note: "força HTTP/1.1" },
      { cmd: "curl --http3 <url>", note: "força HTTP/3 (exige curl com suporte a QUIC)" },
      { cmd: "curl --version | grep -i http3", note: "confere se o seu curl suporta HTTP/3" },
    ],
    handsOnIntro:
      "Três comandos curl, três versões de protocolo negociadas na sua frente. Cronometre o %{time_total} de cada uma e sinta na mão a diferença que cada geração trouxe. Essa aqui é volta de classificação.",
    handsOn: [
      "Escolha um domínio que suporte HTTP/2 (por exemplo, www.cloudflare.com ou www.google.com) e rode os três comandos do exemplo acima. Observe o valor de %{http_version} mudando conforme a flag usada.",
      'Rode curl -v --http2 https://www.cloudflare.com 2>&1 | grep -i "HTTP/2" e ache, no meio da saída detalhada, a linha que confirma a negociação da versão durante o handshake. É o aperto de mão do rádio antes da primeira transmissão de verdade.',
      'Se o seu curl tiver suporte a HTTP/3, repita com --http3 e compare o tempo de resposta com -w "%{time_total}\\n" nas três variantes.',
    ],
    tip: "Sacar que o HTTP/2 limpou a fila lá na aplicação e o HTTP/3 desceu pro transporte pra matar o problema na raiz é o tipo de distinção que engenheiro sênior faz sem pensar. Se você pegou essa diferença, já está no pelotão da frente.",
    takeaway:
      "Cada versão do HTTP resolveu o head-of-line blocking numa camada diferente: o /2 resolveu na aplicação com multiplexação, o /3 resolveu no transporte, trocando TCP por QUIC sobre UDP. Um limpou a fila do rádio, o outro deixou cada canal de telemetria imune ao ruído dos vizinhos.",
    outro:
      "Você viu o rádio limpar a fila e a telemetria ficar imune ao ruído. Agora o circuito estica pra um chicane técnico: dois intermediários que parecem gêmeos e fazem trabalhos opostos. Etapa 03, atenção na freada.",
  },

  {
    id: "sw3",
    num: "03",
    navTitle: "Forward x Reverse Proxy",
    tag: "chicane dos proxies",
    title: "Forward Proxy e Reverse Proxy, os dois intermediários da web",
    narration:
      "Cuidado com essa sequência: forward proxy e reverse proxy são gêmeos que correm em direções opostas. Errar qual é qual aqui é perder o carro na zebra. Foco total nas próximas curvas.",
    lead: "Duas cenas simétricas, uma do lado do cliente e outra do lado do servidor. Pense num carro que precisa falar com o mundo (saída) e num box que precisa receber o mundo (entrada). Cena A: uma empresa quer que todo o tráfego de saída dos funcionários passe por um ponto de controle único, pra bloquear sites indesejados, registrar acessos por conformidade e evitar que o IP interno de cada máquina fique exposto direto pra internet. Cena B: a mesma empresa mantém cinco servidores de aplicação atrás de um único domínio público, e não faz sentido expor o IP de cada servidor individualmente, repetir a configuração do certificado TLS em cada um deles, nem deixar cada servidor decidir sozinho se aguenta receber mais uma conexão simultânea. Duas necessidades diferentes, mas com uma peça em comum: um intermediário entre quem pede e quem responde. A diferença está em qual lado esse intermediário representa e protege.",
    concept: [
      "Forward Proxy, o intermediário de saída: fica posicionado entre um cliente (geralmente dentro de uma rede privada) e a internet, e é explicitamente configurado no lado do cliente (no navegador, no sistema operacional ou na aplicação). Analogia: é o empresário do piloto. O piloto não vai pessoalmente negociar com patrocinador ou responder à imprensa, fala com o empresário, que decide o que sai, negocia em nome dele e traz o resultado de volta. O patrocinador do outro lado nem sabe que a fala partiu do piloto, só enxerga o empresário. O piloto contratou aquele intermediário de propósito, exatamente como o cliente configura o forward proxy. Casos de uso: segurança e conformidade (forçar o tráfego por firewalls), controle de conteúdo (bloquear sites), anonimato e privacidade (mascarar o IP real do cliente) e cache (guardar respostas frequentes, economizando banda).",
      "Reverse Proxy, o guardião inteligente da entrada: fica na borda da infraestrutura, recebendo requisições da internet e distribuindo-as para os servidores de aplicação por trás dele. É transparente para o cliente, ele nem sabe que existe. Analogia: é literalmente a mureta da Etapa 01, vista de outro ângulo, agora formalizada especificamente pra quando ela existe pra proteger e organizar o que está atrás dela. Pense na mureta da Ferrari recebendo todo o tráfego de fora e decidindo, pedido a pedido, se aquilo é assunto do carro do Hamilton ou do carro do Leclerc, já com respostas prontas pro que é rotina e barrando quem não deveria chegar perto dos carros. Funções principais: balanceamento de carga entre múltiplos backends, terminação de SSL/TLS centralizada (tirando essa carga de CPU dos backends), cache de conteúdo, uma primeira camada de segurança contra tráfego malicioso (bloquear ataques específicos como XSS normalmente exige regras adicionais de WAF, e não apenas o proxy puro), compressão (Gzip/Brotli) e roteamento inteligente entre diferentes serviços.",
      "Resumindo no jargão do paddock: forward proxy é o empresário falando pelo piloto na saída, reverse proxy é a mureta recebendo o mundo na entrada. Mesmo tipo de intermediário, direções opostas.",
    ],
    pointsTitle: "Os dois lados do mesmo mecanismo",
    points: [
      {
        t: "Forward Proxy",
        d: "Fica do lado do cliente, configurado por ele mesmo. Protege o cliente perante a internet. Visível e explícito: você aponta pra ele de propósito.",
        color: "blue",
      },
      {
        t: "Reverse Proxy",
        d: "Fica do lado do servidor, configurado pela infraestrutura dele. Protege o servidor perante a internet. Transparente: o cliente nem sabe que existe.",
        color: "signal",
      },
      {
        t: "Funções do Reverse Proxy",
        d: "Balanceamento de carga, terminação SSL/TLS, cache, primeira camada de segurança (XSS de verdade exige WAF à parte), compressão e roteamento entre serviços.",
        color: "ember",
      },
    ],
    examplesTitle: "Um reverse proxy Nginx na frente de um backend simples",
    examples: [
      {
        label: "proxy.conf (Nginx)",
        lang: "yaml",
        code: `# /etc/nginx/conf.d/proxy.conf
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
}`,
        note: "Sem os cabeçalhos X-Real-IP/X-Forwarded-For, o backend enxergaria toda requisição como vinda do próprio Nginx (127.0.0.1), perdendo a informação de quem de fato fez o pedido. Seria a mureta repassando um recado ao piloto sem dizer de quem veio.",
      },
      {
        label: "cliente → proxy → backend",
        lang: "sh",
        code: `# Backend simples, só pra existir algo atrás do proxy
$ python3 -m http.server 8000

# Do lado do cliente, você fala com o proxy, não sabe que existe um Python atrás
$ curl -I http://localhost
HTTP/1.1 200 OK
Server: nginx/1.27.0`,
        note: "O cabeçalho Server continua nginx, mesmo com o conteúdo gerado pelo Python por trás. É exatamente essa transparência que caracteriza o reverse proxy: de fora, você fala com a mureta e ouve a mureta, mesmo que a resposta tenha nascido lá dentro, no carro.",
      },
      {
        label: "forward proxy explícito",
        lang: "sh",
        code: `# Aqui é você, cliente, quem aponta explicitamente para o proxy
$ curl -x http://proxy-da-empresa:3128 http://exemplo.com`,
        note: 'Aqui é o piloto dizendo, na cara dura, "fala com o meu empresário": ele sabe que existe um intermediário e aponta pra ele de propósito.',
      },
    ],
    commands: [
      { cmd: "python3 -m http.server 8000", note: "sobe um backend simples pra testar" },
      { cmd: "nginx -s reload", note: "recarrega a config do Nginx sem derrubar conexões" },
      { cmd: "curl -I http://localhost", note: "confere o cabeçalho Server pelo proxy" },
      {
        cmd: "curl -x http://proxy:3128 http://exemplo.com",
        note: "usa um forward proxy explícito",
      },
    ],
    handsOnIntro:
      "Sobe o backend Python, configura o Nginx na frente, dá o reload e confere o cabeçalho Server com um curl: cada passo é um pneu trocado, faça na ordem e o carro sai do box limpo. Aviso de garagem: este exercício edita a configuração real do Nginx e recarrega o processo com nginx -s reload, então use um Nginx instalado no host (sudo apt install nginx), não o container nginx:latest da Etapa 01. Se preferir continuar no Docker, veja a adaptação sugerida na abertura do guia.",
    handsOn: [
      "Suba o backend Python (python3 -m http.server 8000, numa pasta com um index.html qualquer) e configure o Nginx como no exemplo acima. Recarregue com nginx -s reload.",
      "Rode curl -I http://localhost e observe o cabeçalho Server: nginx, mesmo com o conteúdo vindo do processo Python. A mureta na frente, o carro atrás.",
      "Remova temporariamente a linha proxy_set_header X-Real-IP, recarregue, e raciocine sobre o que o backend passaria a enxergar: sem esse cabeçalho, ele só veria o IP do próprio Nginx.",
      "Compare com o comando curl -x do forward proxy: repare que ali é você quem aponta explicitamente pro intermediário; no passo 2, você nem sabia que ele existia.",
    ],
    tip: "Pra saber se você está do lado explícito ou implícito de um proxy, pergunta: quem configurou o apontamento, o cliente ou o servidor? Essa resposta sozinha já diz se é forward ou reverse.",
    takeaway:
      "Forward proxy fica do lado do cliente e é configurado por ele; reverse proxy fica do lado do servidor e é invisível para o cliente, mas ambos são o mesmo tipo de intermediário, olhando pra direções opostas. Empresário na saída, mureta na entrada.",
    outro:
      "Empresário na saída, mureta na entrada: você não erra mais qual é qual. Agora vem a zona de frenagem mais pesada da pista, onde a estratégia de garagem do Apache decide quem sobrevive ao pico. Etapa 04.",
  },

  {
    id: "sw4",
    num: "04",
    navTitle: "Apache & MPMs",
    tag: "frenagem dos MPMs",
    title: "Apache HTTP Server e os modelos de processamento (MPMs)",
    narration:
      "Aqui a pista cobra estratégia de garagem: como escalar seus mecânicos pra aguentar 5.000 carros querendo o box ao mesmo tempo. Escolher errado aqui custa caro. Pergunta pra Ferrari de Abu Dhabi 2010, que jogou um campeonato fora com a chamada de box errada no momento errado.",
    lead: "Cenário 1: um e-commerce rodando Apache com o modelo mais antigo de processamento recebe um pico de 5.000 conexões simultâneas numa promoção. Como cada conexão ganha um processo do sistema operacional inteiramente próprio e isolado, o servidor tenta abrir milhares de processos, cada um consumindo dezenas de megabytes só pra existir, antes mesmo de processar qualquer requisição. A memória se esgota, o sistema começa a paginar em disco, e o site trava justamente no pico de vendas. É a janela de pit stop sob safety car: os 22 carros querem entrar no box ao mesmo tempo, e se você exigisse uma equipe inteira e separada por carro, não haveria espaço nem gente no pit lane pra todos. Cenário 2, oposto: a mesma empresa depende de um módulo antigo, escrito sem cuidado de concorrência (não thread-safe), que precisa continuar funcionando. Trocar o modelo de processamento pra um baseado em threads compartilhando memória faria esse módulo corromper dados ou derrubar o processo de forma imprevisível. É aquela ferramenta legada de calibração que só funciona numa bancada isolada: numa bancada compartilhada, ela bagunça o trabalho de todos os outros mecânicos. Um cenário pede leveza pra escalar, o outro pede isolamento total pra sobreviver. O Apache resolve essa tensão deixando você escolher o modelo de concorrência, os MPMs (Multi-Processing Modules).",
    concept: [
      "Analogia geral: pense na garagem e no jeito de escalar os mecânicos. Nesta etapa, uma conexão é um carro que chega pra ser atendido, um processo é um box independente com ferramentas e espaço próprios, e uma thread é um mecânico dentro daquele box compartilhando a mesma bancada.",
      "Prefork MPM (não threaded): um processo filho independente é criado para cada conexão, completamente isolado dos demais. Vantagens: muito estável (um problema num processo não afeta os outros), ideal para módulos não thread-safe, alta compatibilidade com software legado. Desvantagens: alto consumo de memória e pouca escalabilidade sob alta concorrência. É comum ver o Prefork combinado com o mod_php (PHP embutido no processo do Apache, historicamente não thread-safe); a alternativa moderna é rodar o PHP como processo separado via PHP-FPM, com o Apache falando com ele por proxy, o que permite usar um MPM mais leve sem perder compatibilidade.",
      "Worker MPM (multithreaded): cria múltiplos processos filhos, cada um rodando múltiplas threads, e cada thread atende uma conexão. Mais eficiente em memória que o Prefork e com melhor performance sob alta concorrência, mas como as threads de um mesmo processo compartilham memória, um erro grave numa thread pode corromper o processo filho inteiro que a hospeda, derrubando as conexões que aquele processo específico estava servindo (os demais processos e o processo mestre continuam de pé). É o mecânico que derruba a bancada e prejudica só a equipe daquele box; os outros boxes e o chefe de equipe seguem trabalhando. Por isso os módulos precisam ser thread-safe.",
      "Event MPM (recomendado para produção): parte do modelo Worker, mas otimizado pro caso comum de conexões keep-alive abertas e ociosas, uma thread dedicada consegue vigiar várias conexões que estão só esperando, sem prender uma thread inteira de trabalho só pra segurar uma conexão parada. É o mecânico que não fica plantado ao lado de um carro que só está aguardando ordem, ele vigia vários carros em espera de uma vez e só age quando um deles de fato precisa. Eficiente para keep-alive, otimizado para alta concorrência e com suporte nativo a HTTP/2, mas exige módulos thread-safe e é mais complexo de configurar.",
    ],
    pointsTitle: "Os três MPMs lado a lado",
    points: [
      {
        t: "Prefork",
        d: "Isolamento total, processo por conexão. Memória alta, concorrência baixa. Uso: máxima estabilidade, módulos não thread-safe (ex.: mod_php legado).",
        color: "ember",
      },
      {
        t: "Worker",
        d: "Poucos processos, threads compartilhando memória. Memória média, concorrência alta. Uso: tráfego moderado a alto, exige módulos thread-safe.",
        color: "signal",
      },
      {
        t: "Event",
        d: "Como o Worker, mas otimizado pra keep-alive ocioso. Memória baixa, concorrência muito alta. Uso: recomendado pra maioria dos deployments novos.",
        color: "blue",
      },
    ],
    examplesTitle: "Descobrindo e trocando o MPM ativo",
    examples: [
      {
        label: "apachectl -V",
        lang: "sh",
        code: `# Mostra qual MPM está compilado/ativo no momento (saída resumida)
$ apachectl -V | grep -i mpm
Server MPM:     event

# Em distros Debian/Ubuntu, a2query mostra o módulo MPM habilitado
$ sudo a2query -M
event`,
      },
      {
        label: "trocar de MPM",
        lang: "sh",
        code: `# Trocando para o Prefork (por exemplo, pra rodar um módulo legado não thread-safe)
$ sudo a2dismod mpm_event      # desabilita o módulo do MPM atual
$ sudo a2enmod mpm_prefork     # habilita o Prefork
$ sudo systemctl restart apache2

$ sudo a2query -M
prefork`,
        note: "Em distros baseadas em RHEL/CentOS, a troca é feita comentando/descomentando as linhas LoadModule mpm_*_module no arquivo /etc/httpd/conf.modules.d/00-mpm.conf, em vez de usar a2enmod/a2dismod.",
      },
      {
        label: "mpm_event.conf",
        lang: "yaml",
        code: `# Trecho ilustrativo de mpm_event.conf (ajuste os valores ao seu tráfego real)
<IfModule mpm_event_module>
    StartServers             3     # processos filhos criados na inicialização
    MinSpareThreads         75     # threads ociosas mínimas mantidas em reserva
    MaxRequestWorkers      400     # limite de conexões atendidas simultaneamente
    ThreadsPerChild         25     # threads por processo filho
</IfModule>`,
        note: "Trocar de MPM é como reconfigurar a garagem entre uma corrida e outra: a mesma equipe, o mesmo Apache, muda de comportamento só pela forma de organizar boxes e mecânicos.",
      },
    ],
    commands: [
      { cmd: "apachectl -V | grep -i mpm", note: "mostra o MPM ativo" },
      { cmd: "sudo a2query -M", note: "confirma o módulo MPM habilitado (Debian/Ubuntu)" },
      { cmd: "sudo a2dismod mpm_event && sudo a2enmod mpm_prefork", note: "troca o MPM ativo" },
      { cmd: "sudo systemctl restart apache2", note: "aplica a troca de MPM" },
      { cmd: "ab -n 500 -c 50 http://localhost/", note: "gera carga de teste (Apache Bench)" },
    ],
    handsOnIntro:
      "Descubra o MPM ativo, troque, e rode o Apache Bench antes e depois: a mesma máquina parando em 2 segundos ou em 4 só pela forma de escalar a equipe. Aviso de garagem: este exercício usa a2enmod/a2dismod e apachectl, comandos que atuam sobre um Apache instalado no host (sudo apt install apache2), não sobre o container httpd:latest da Etapa 01. O passo 3 também usa o ab: se não estiver instalado, rode sudo apt install apache2-utils antes de executá-lo.",
    handsOn: [
      "Rode apachectl -V | grep -i mpm (ou httpd -V | grep -i mpm, dependendo da distro) no seu Apache e anote qual MPM está ativo agora.",
      "Se o seu sistema usa Debian/Ubuntu, troque o MPM ativo com a2dismod/a2enmod e confirme a troca com a2query -M.",
      "Rode um teste de carga simples contra o mesmo Apache, antes e depois da troca de MPM: ab -n 500 -c 50 http://localhost/. Compare as linhas Requests per second e Time per request entre as duas rodadas. Não espere um número mágico: o objetivo é sentir que a mesma máquina se comporta diferente só por causa do MPM escolhido, a mesma sensação de um pit stop que sai em 2 segundos ou em 4 dependendo de como a equipe foi escalada.",
    ],
    tip: "Prefork, Worker, Event: quem decora os três nomes está num nível; quem entende que a diferença mora em processo, thread e isolamento está em outro. Vale reler a tabela devagar antes de decidir qual usar em produção.",
    takeaway:
      "Prefork isola tudo em processos e é o mais pesado; Worker divide isso em threads dentro de poucos processos e é mais leve, mas exige código thread-safe; Event é o Worker afinado pra não gastar uma thread inteira em conexões keep-alive ociosas, e é o modelo recomendado hoje. Box isolado por carro, bancada compartilhada por equipe, ou mecânico que vigia vários carros em espera de uma vez.",
    outro:
      "Box isolado por carro, bancada compartilhada por equipe, ou mecânico vigiando vários carros em espera: você já escolhe o formato da garagem conforme a corrida. Falta só a curva rápida final, onde o Nginx mostra por que nasceu pra essa era. Etapa 05.",
  },

  {
    id: "sw5",
    num: "05",
    navTitle: "Nginx event-driven",
    tag: "curva rápida do event loop",
    title: "Nginx e a arquitetura orientada a eventos",
    narration:
      "Última parcial da volta, e é aqui que o chassi mais enxuto do grid brilha. O Nginx segue a regra de ouro dos projetistas de F1: primeiro simplifica, depois tira todo peso que não precisa estar ali. Vamos ver esse carro na sua melhor curva.",
    lead: "Cenário: uma aplicação com muitas conexões simultâneas de longa duração e majoritariamente ociosas (chat em tempo real, notificações push, keep-alive de APIs de aplicativos móveis). Mesmo com o Event MPM do Apache reduzindo o custo das conexões ociosas, o modelo continua fundamentado em reservar uma thread para cada conexão sendo ativamente processada. Escalar pra dezenas de milhares de conexões simultâneas significa escalar, na mesma proporção, a quantidade de threads e a memória que elas consomem, até esbarrar no limite prático de threads que conseguem coexistir com eficiência. Imagine querer um engenheiro dedicado por carro pra monitorar dezenas de milhares de carros ao mesmo tempo: não existe pit wall que comporte isso. Foi exatamente esse problema que o Nginx nasceu, do zero, pra resolver. Enquanto o Apache nasceu como servidor web tradicional e foi ganhando modelos de concorrência ao longo do tempo, o Nginx já foi concebido com uma arquitetura moderna em mente, pensada especialmente pra servir conteúdo estático e atuar como proxy reverso sob alta concorrência.",
    concept: [
      "A diferença central do Nginx é a arquitetura assíncrona orientada a eventos (event-driven), bem diferente do modelo de thread ou processo dedicado por conexão. Analogia: pense num engenheiro de pista no telemetry wall, o painel gigante com a telemetria de todos os carros ao mesmo tempo. Ele não fica plantado olhando fixo pra um único carro esperando algo acontecer. Ele varre o painel inteiro e só age quando um evento dispara: um alerta de temperatura de pneu no carro do Russell, um pedido de undercut no carro do Antonelli. Um único engenheiro consegue monitorar a grade inteira assim, porque nunca fica bloqueado esperando um carro só.",
      "No Apache, cada conexão ativa costuma ocupar uma thread ou processo dedicado enquanto durar (mesmo o Event MPM reserva uma thread só pra requisição sendo efetivamente processada, ele só evita gastar uma thread inteira em conexões apenas ociosas). Com 10 mil usuários conectados ao mesmo tempo, é preciso sustentar uma fração relevante de 10 mil threads ou processos consumindo memória. Seria como querer um engenheiro por carro pra uma grade de dez mil carros.",
      'No Nginx, non-blocking I/O: quando uma operação de entrada/saída é necessária (ler do disco, esperar resposta de um backend), o worker registra um evento e passa a processar outra conexão, em vez de ficar parado esperando. O engenheiro registra "me avisa quando o dado do carro X chegar" e já vai cuidar do carro Y. O event loop é o loop de eventos que cada processo worker roda, gerenciando milhares de conexões com poucos recursos, a varredura contínua do telemetry wall. Quando o evento fica pronto, o worker é notificado e retoma exatamente de onde parou: o alerta pisca no painel, o engenheiro reage naquele carro e volta a varrer o resto.',
      "Essa abordagem torna o Nginx muito eficiente, especialmente para conexões keep-alive e ociosas, exatamente o cenário do problema desta etapa. Benefícios práticos: menor consumo de memória, maior throughput, melhor latência e desempenho excelente como proxy reverso e balanceador de carga, inclusive na frente do próprio Apache.",
      "Um cuidado, pra não vender ilusão: no telemetry wall real, um engenheiro humano tem limite de atenção e se perde com carros demais. O worker do Nginx não se cansa, ele processa cada evento em microssegundos e volta ao loop, e o gargalo passa a ser CPU e memória, não atenção. A imagem do engenheiro serve pra entender a lógica do event loop, não pra dizer que existe um humano ali dentro.",
    ],
    pointsTitle: "As peças do motor event-driven",
    points: [
      {
        t: "Non-blocking I/O",
        d: "Ao invés de esperar parado por uma resposta de disco ou backend, o worker registra o evento e segue processando outra conexão.",
        color: "blue",
      },
      {
        t: "Event loop",
        d: "Cada worker roda um loop varrendo continuamente as conexões, agindo só quando um evento dispara.",
        color: "signal",
      },
      {
        t: "epoll",
        d: "Mecanismo do kernel Linux que avisa o worker exatamente qual conexão recebeu dado novo, sem varredura cega.",
        color: "ember",
      },
    ],
    examplesTitle: "Poucos processos, milhares de conexões",
    examples: [
      {
        label: "nginx.conf (workers)",
        lang: "yaml",
        code: `# /etc/nginx/nginx.conf (trecho principal)
worker_processes auto;   # 1 processo worker por núcleo de CPU disponível

events {
    worker_connections 1024;   # cada worker aguenta até 1024 conexões simultâneas
    use epoll;                 # mecanismo de notificação de eventos do kernel Linux
}`,
        note: "Com worker_processes auto e worker_connections 1024 numa máquina de 4 núcleos, o Nginx consegue, em teoria, atender até 4096 conexões simultâneas usando apenas 4 processos worker (mais o processo mestre, que só gerencia os workers). Quatro engenheiros no telemetry wall vigiando 4096 carros, e um chefe de equipe que coordena os engenheiros sem pegar em rádio.",
      },
      {
        label: "ps aux + ss",
        lang: "sh",
        code: `# Poucos processos, independente de quantas conexões estão ativas
$ ps aux | grep '[n]ginx'
root       812  0.0  0.1  55508  1420 ?  Ss  10:02  0:00 nginx: master process nginx -g daemon off;
nginx      813  0.0  0.2  55964  2116 ?  S   10:02  0:00 nginx: worker process
nginx      814  0.0  0.2  55964  2116 ?  S   10:02  0:00 nginx: worker process

# Quantas conexões TCP estabelecidas existem agora, de fato
$ ss -tn state established | wc -l
187`,
        note: "Repare: 187 conexões estabelecidas sendo atendidas por apenas 2 processos worker. Dois engenheiros dando conta de 187 carros. Num Apache com Prefork ou Worker sob a mesma carga, o ps aux costuma mostrar dezenas ou centenas de linhas, quase um mecânico ou box por carro.",
      },
    ],
    commands: [
      { cmd: "nginx -t", note: "valida a config e mostra o caminho do nginx.conf" },
      { cmd: "ps aux | grep '[n]ginx'", note: "lista os processos do Nginx" },
      { cmd: "nproc", note: "mostra o número de núcleos da máquina" },
      { cmd: "ab -n 1000 -c 200 http://localhost/", note: "gera carga de teste" },
      { cmd: "ss -tn state established | wc -l", note: "conta as conexões TCP estabelecidas" },
    ],
    handsOnIntro:
      "Conte os processos com ps aux, jogue carga com o ab e observe: o número de engenheiros no muro não muda, chegue quanto carro chegar. Aviso de garagem: assim como na Etapa 03, este exercício lê a configuração e observa processos de um Nginx instalado no host, não do container nginx:latest da Etapa 01. O passo 3 volta a usar o ab: instale com sudo apt install apache2-utils se ainda não tiver feito isso na Etapa 04.",
    handsOn: [
      "Localize o nginx.conf do seu Nginx (nginx -t mostra o caminho no início da saída) e identifique as diretivas worker_processes e worker_connections.",
      "Rode ps aux | grep '[n]ginx' e conte quantos processos aparecem. Compare com nproc (número de núcleos da sua máquina): o número de workers costuma ser igual ou próximo. Tantos engenheiros quanto núcleos disponíveis.",
      "Gere carga com múltiplas conexões simultâneas: ab -n 1000 -c 200 http://localhost/. Durante o teste, rode ps aux | grep '[n]ginx' num segundo terminal. Observe: o número de processos não muda, mesmo com centenas de conexões simultâneas batendo no servidor. Os mesmos engenheiros no muro, chegando mais carro ou não.",
      "Se tiver acesso a um Apache no mesmo tipo de teste, repita a carga nele e rode ps aux | grep '[a]pache2\\|[h]ttpd'. Dependendo do MPM configurado, observe o número de processos ou threads crescer junto com a carga, ao contrário do que aconteceu com o Nginx. Ali a garagem contrata mecânico conforme o movimento, aqui o muro segue com a mesma equipe.",
    ],
    tip: "Non-blocking I/O e event loop são o coração de tudo: um único engenheiro varre o telemetry wall inteiro sem travar em nenhum carro. Entendeu isso, entendeu por que o Nginx escala do jeito que escala.",
    takeaway:
      "Apache lida com concorrência dedicando um processo ou thread a cada conexão (mesmo otimizado pelo Event MPM); Nginx lida com concorrência usando poucos processos rodando um loop de eventos não bloqueante, e é exatamente por isso que ele domina como proxy reverso e balanceador de carga na frente de qualquer coisa, inclusive do próprio Apache. Um mecânico por carro contra um engenheiro varrendo o telemetry wall inteiro.",
    outro:
      "Poucos processos, um loop de eventos, e o Nginx dominando a borda de qualquer coisa, inclusive do próprio Apache. Você cruzou o traçado inteiro, do conteúdo estático ao event loop. Guarda o pit board, revisa o debrief com calma, e até a próxima corrida do campeonato.",
  },
  {
    id: "sw6",
    num: "06",
    navTitle: "Load balancing",
    tag: "estratégia distribui o tráfego",
    title: "Balanceamento de carga: L4, L7 e algoritmos do Nginx",
    narration:
      "A reta trouxe tráfego demais para um carro só. Agora a mureta precisa distribuir cada chamado sem perder ritmo. Escolher o algoritmo errado é colocar todos os pit stops no mesmo box enquanto o vizinho fica vazio.",
    lead: "Quando uma única instância chega ao limite, aumentar apenas CPU e memória adia o problema. A escala horizontal cria múltiplos backends, e o Load Balancer decide qual deles recebe cada nova requisição. Essa decisão pode olhar somente IP e porta, em L4, ou compreender host, path e headers HTTP, em L7.",
    concept: [
      "Balanceadores L4 trabalham no transporte TCP ou UDP. São rápidos e servem protocolos genéricos, mas não conseguem rotear por URL ou header. Balanceadores L7 entendem HTTP e HTTPS, podem terminar TLS, aplicar cache, compressão e regras por conteúdo, com uma sobrecarga um pouco maior.",
      "No Nginx, Round Robin é o padrão e distribui em sequência. weight altera a proporção para servidores com capacidades diferentes. least_conn escolhe o backend com menos conexões ativas. ip_hash cria afinidade pelo IP do cliente, útil para legado com sessão local, mas sujeito a desbalanceamento atrás de NAT ou VPN.",
      "Aplicações stateless simplificam o grid: sessão compartilhada em Redis ou tokens assinados permitem que qualquer backend responda. Assim, a estratégia não precisa manter cada usuário preso ao mesmo carro.",
    ],
    pointsTitle: "Como escolher o algoritmo",
    points: [
      {
        t: "Round Robin + weight",
        d: "Boa base para backends parecidos; use pesos quando a capacidade não for igual.",
        color: "blue",
      },
      {
        t: "Least Connections",
        d: "Prefira quando as requisições têm durações muito diferentes ou conexões longas.",
        color: "signal",
      },
      {
        t: "IP Hash",
        d: "Entrega afinidade simples, mas pode concentrar muitos usuários do mesmo IP e não substitui uma aplicação stateless.",
        color: "ember",
      },
    ],
    examplesTitle: "Um upstream com decisão explícita",
    examples: [
      {
        label: "nginx.conf",
        lang: "yaml",
        code: 'upstream pitstop_api {\n    least_conn;\n    server api-1:3000 weight=2;\n    server api-2:3000;\n    keepalive 32;\n}\n\nserver {\n    listen 80;\n    location /api/ {\n        proxy_pass http://pitstop_api;\n        proxy_http_version 1.1;\n        proxy_set_header Connection "";\n    }\n}',
        note: "least_conn observa conexões ativas; keepalive reaproveita conexões do Nginx com os backends. O peso continua influenciando a seleção entre servidores disponíveis.",
      },
    ],
    commands: [
      { cmd: "nginx -t", note: "valida a configuração antes da largada" },
      { cmd: "nginx -s reload", note: "recarrega sem derrubar conexões existentes" },
      {
        cmd: "for i in $(seq 1 8); do curl -s http://localhost/api/; done",
        note: "observa a distribuição",
      },
      {
        cmd: "ab -n 1000 -c 20 http://localhost/api/",
        note: "mede vazão e latência sob concorrência",
      },
    ],
    handsOnIntro:
      "Suba dois backends que devolvam nomes diferentes e coloque o Nginx na frente. O objetivo não é decorar diretivas, mas enxergar a escolha da mureta a cada chamada.",
    handsOn: [
      "Configure um upstream com dois backends e Round Robin. Faça oito chamadas e registre a sequência de respostas.",
      "Troque para least_conn e repita o teste enquanto um backend responde mais lentamente. Observe qual recebe menos trabalho novo.",
      "Teste ip_hash e explique por que várias chamadas do mesmo cliente tendem ao mesmo backend. Depois descreva como Redis ou JWT eliminaria essa dependência.",
    ],
    tip: "Escolha algoritmo com base no comportamento da carga. Round Robin distribui contagem; least_conn distribui ocupação; ip_hash distribui afinidade.",
    takeaway:
      "Balancear não é apenas espalhar requisições. É escolher quanta informação o balanceador enxerga e qual sinal usa para distribuir trabalho sem criar um novo gargalo.",
    outro:
      "Tráfego distribuído, stint equilibrado. Mas uma boa estratégia precisa perceber quando um carro parou de responder. A próxima etapa liga os sensores de saúde e o plano de contingência.",
  },
  {
    id: "sw7",
    num: "07",
    navTitle: "Failover e diagnóstico",
    tag: "telemetria + plano B",
    title: "Health checks, failover, métricas e troubleshooting",
    narration:
      "Bandeira amarela no setor dois. Um backend perdeu rendimento, e continuar mandando chamadas para ele transforma uma falha localizada em abandono coletivo. A telemetria precisa detectar, retirar da rotação e confirmar a recuperação.",
    lead: "Um processo pode estar ligado e ainda assim incapaz de atender. Health checks medem o serviço real; failover redireciona trabalho quando a saúde cai. Sem logs, métricas e teste de carga, porém, a equipe só descobre o problema pelo rádio do usuário.",
    concept: [
      "No Nginx Open Source, max_fails e fail_timeout implementam health checks passivos: falhas observadas em requisições reais retiram temporariamente o backend da rotação. A diretiva backup reserva um servidor para quando todos os primários estiverem indisponíveis. Verificações ativas completas são recurso do Nginx Plus ou de módulos externos.",
      "stub_status expõe conexões ativas e estados de leitura, escrita e espera. Apache Bench gera carga controlada. A leitura conjunta de RPS, latência, percentis, CPU e logs revela se a limitação está no proxy, no backend ou numa dependência.",
      "502 Bad Gateway costuma significar conexão recusada ou resposta inválida do upstream. 504 Gateway Timeout significa que a conexão ocorreu, mas o backend ultrapassou proxy_read_timeout. Aumentar o timeout sem investigar pode apenas esconder lentidão.",
    ],
    pointsTitle: "O ciclo de reação à falha",
    points: [
      {
        t: "Detectar",
        d: "Observe falhas reais, endpoints de saúde, latência e taxa de erro.",
        color: "signal",
      },
      {
        t: "Isolar",
        d: "Retire o backend doente e preserve os saudáveis; use backup somente na contingência.",
        color: "ember",
      },
      {
        t: "Diagnosticar",
        d: "Siga cliente, Nginx, backend e dependências com métricas e logs correlacionados.",
        color: "blue",
      },
    ],
    examplesTitle: "Backend primário, reserva e painel de estado",
    examples: [
      {
        label: "nginx.conf",
        lang: "yaml",
        code: "upstream pitstop_api {\n    server api-1:3000 max_fails=3 fail_timeout=15s;\n    server api-2:3000 max_fails=1 fail_timeout=5s;\n    server api-backup:3000 backup;\n}\n\nlocation = /nginx_status {\n    stub_status;\n    allow 127.0.0.1;\n    deny all;\n}",
        note: "O check passivo depende de tráfego real. Depois do fail_timeout, o Nginx tenta o backend novamente e o recoloca na rotação se a chamada funcionar.",
      },
    ],
    commands: [
      { cmd: "curl http://localhost/nginx_status", note: "consulta o painel nativo" },
      { cmd: "ab -n 2000 -c 50 http://localhost/api/", note: "gera carga mensurável" },
      { cmd: "docker stop api-1", note: "simula a falha de um backend" },
      { cmd: "docker logs -f nginx", note: "acompanha falhas e recuperação" },
    ],
    handsOn: [
      "Gere carga e registre Requests per second e o percentil de 95% do Apache Bench.",
      "Pare um backend durante o teste. Confirme nos logs que ele saiu da rotação e que as respostas continuaram pelos demais.",
      "Pare todos os primários e verifique o servidor backup assumir. Restaure um primário e acompanhe seu retorno após fail_timeout.",
      "Provoque um endereço incorreto e uma resposta lenta para diferenciar, na prática, 502 de 504.",
    ],
    tip: "Nunca mude três timeouts ao mesmo tempo. Reproduza, altere uma variável, repita a carga e compare a mesma métrica.",
    takeaway:
      "Alta disponibilidade começa quando a borda consegue detectar um backend incapaz, parar de enviar trabalho a ele e provar, com telemetria, que a experiência continuou.",
    outro:
      "O proxy aprendeu a reagir. Agora a pista muda de escala: em Kubernetes, dezenas de Services precisam compartilhar uma entrada clara, segura e declarativa.",
  },
  {
    id: "sw8",
    num: "08",
    navTitle: "Ingress no Kubernetes",
    tag: "portão único do cluster",
    title: "Ingress: roteamento por host e path no Kubernetes",
    narration:
      "Chegamos ao paddock de um grande prêmio. Há muitos boxes, mas o público entra por poucos portões. A credencial diz o destino; a equipe do portão interpreta e conduz cada chamada ao Service certo.",
    lead: "Criar um LoadBalancer para cada Service aumenta custo e multiplica IPs públicos. O recurso Ingress centraliza regras HTTP e HTTPS. Ele não encaminha pacotes sozinho: um Ingress Controller observa essas declarações e configura o proxy real.",
    concept: [
      "Ingress é o mapa de regras; ingress-nginx, Traefik ou outro Controller é quem executa. Sem Controller, criar o objeto Ingress não muda o tráfego.",
      "Roteamento por host separa domínios, como api.exemplo.com e app.exemplo.com. Roteamento por path separa caminhos no mesmo domínio. Prefix aceita subcaminhos; Exact exige correspondência completa.",
      "Anotações aplicam recursos específicos do Controller, como reescrita de URL. ingressClassName escolhe qual Controller deve atender a regra quando o cluster possui mais de um.",
    ],
    pointsTitle: "As peças do caminho externo",
    points: [
      { t: "Ingress Resource", d: "Declara hosts, paths e Services de destino.", color: "blue" },
      {
        t: "Ingress Controller",
        d: "Observa as regras e configura o proxy que recebe o tráfego real.",
        color: "signal",
      },
      {
        t: "Service ClusterIP",
        d: "Mantém um destino interno estável para os Pods selecionados.",
        color: "ember",
      },
    ],
    examplesTitle: "Um domínio, dois Services",
    examples: [
      {
        label: "ingress.yaml",
        lang: "yaml",
        code: "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: pitstop\n  annotations:\n    nginx.ingress.kubernetes.io/rewrite-target: /$2\nspec:\n  ingressClassName: nginx\n  rules:\n    - host: pitstop.local\n      http:\n        paths:\n          - path: /api(/|$)(.*)\n            pathType: ImplementationSpecific\n            backend:\n              service:\n                name: api\n                port:\n                  number: 3333\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: web\n                port:\n                  number: 3005",
        note: "A anotação rewrite-target é específica do ingress-nginx. Use regex apenas quando necessário e teste o caminho que o backend realmente recebe.",
      },
    ],
    commands: [
      {
        cmd: "helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace",
        note: "instala o Controller",
      },
      { cmd: "kubectl apply -f ingress.yaml", note: "publica as regras" },
      { cmd: "kubectl get ingress -A", note: "confere endereço e classe" },
      {
        cmd: "curl -H 'Host: pitstop.local' http://127.0.0.1/api/health",
        note: "testa host e path",
      },
    ],
    handsOn: [
      "Instale um Ingress Controller e espere seus Pods ficarem Ready.",
      "Publique dois Services e uma regra que envie / para o frontend e /api para o backend.",
      "Teste com o header Host e observe os logs dos dois backends para confirmar o destino.",
      "Troque Prefix por Exact em uma rota de saúde e teste um subcaminho para sentir a diferença.",
    ],
    tip: "Ao depurar, verifique na ordem: Controller ativo, IngressClass correta, regra reconhecida, Service com endpoints e Pod saudável. Ingress continua estável, mas sua API está congelada; em projetos novos, compare com a Gateway API recomendada pelo Kubernetes.",
    takeaway:
      "Ingress declara uma entrada HTTP compartilhada; o Controller transforma essa intenção em proxy real e encaminha cada host e path ao Service correto.",
    outro:
      "O portão já sabe onde cada requisição deve chegar. Falta garantir que a credencial seja legítima e se renove antes de vencer. É hora do TLS automático.",
  },
  {
    id: "sw9",
    num: "09",
    navTitle: "TLS automático",
    tag: "credencial renovada no prazo",
    title: "TLS e cert-manager: HTTPS sem renovação manual",
    narration:
      "Documento vencido na entrada significa carro parado antes do box. Certificado também expira. A diferença entre operação madura e incêndio é renovar antes do usuário encontrar o cadeado quebrado.",
    lead: "TLS oferece confidencialidade, integridade e autenticação do servidor. Em ambientes dinâmicos, emitir e renovar certificados manualmente não escala. cert-manager estende a API do Kubernetes e automatiza esse ciclo usando recursos declarativos.",
    concept: [
      "Issuer emite certificados dentro de um namespace; ClusterIssuer pode atender múltiplos namespaces. Certificate declara nomes DNS e o Secret de destino.",
      "Com ACME e Let's Encrypt, desafios HTTP-01 ou DNS-01 provam o controle do domínio. O cert-manager acompanha a validade e renova antes do vencimento.",
      "O Ingress referencia o Secret TLS. A chave privada permanece no cluster e não deve ser gravada diretamente no manifesto ou no repositório.",
    ],
    pointsTitle: "Do pedido ao cadeado válido",
    points: [
      { t: "Issuer", d: "Define a autoridade e como provar a posse do domínio.", color: "blue" },
      {
        t: "Certificate",
        d: "Declara nomes DNS, duração e Secret que receberá chave e certificado.",
        color: "signal",
      },
      { t: "Ingress TLS", d: "Usa o Secret emitido para terminar HTTPS na borda.", color: "ember" },
    ],
    examplesTitle: "Ingress integrado ao cert-manager",
    examples: [
      {
        label: "ingress-tls.yaml",
        lang: "yaml",
        code: "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: pitstop-secure\n  annotations:\n    cert-manager.io/cluster-issuer: letsencrypt-prod\nspec:\n  ingressClassName: nginx\n  tls:\n    - hosts:\n        - pitstop.example.com\n      secretName: pitstop-tls\n  rules:\n    - host: pitstop.example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: web\n                port:\n                  number: 3005",
        note: "Use o ambiente staging da autoridade durante testes para evitar limites de emissão. Mude para produção apenas quando DNS e rota estiverem corretos.",
      },
    ],
    commands: [
      { cmd: "kubectl get clusterissuer", note: "confirma a fonte de certificados" },
      { cmd: "kubectl describe certificate pitstop-tls", note: "mostra emissão e renovação" },
      { cmd: "kubectl get challenge,order -A", note: "investiga o fluxo ACME" },
      { cmd: "curl -Iv https://pitstop.example.com", note: "valida handshake e cadeia" },
    ],
    handsOn: [
      "Instale o cert-manager e crie primeiro um ClusterIssuer de staging.",
      "Aplique um Ingress com tls e a anotação do issuer. Acompanhe Certificate, Order e Challenge.",
      "Confirme que o Secret foi criado e valide o HTTPS com curl.",
      "Explique por que base64 em Secret não é criptografia e quais controles de acesso protegem a chave privada.",
    ],
    tip: "Se a emissão travar, leia o evento do Challenge. Quase sempre a pista aponta para DNS incorreto, IngressClass errada ou bloqueio do caminho HTTP-01.",
    takeaway:
      "cert-manager transforma certificados em estado desejado: você declara domínio e destino, e o controlador emite, armazena e renova o TLS.",
    outro:
      "Entrada roteada e canal protegido. Dentro do cluster, porém, cada serviço ainda repete retries, segurança e telemetria. A próxima volta coloca essa disciplina numa malha comum.",
  },
  {
    id: "sw10",
    num: "10",
    navTitle: "Service Mesh",
    tag: "rede operacional entre serviços",
    title: "Service Mesh e a arquitetura do Istio",
    narration:
      "Uma equipe pequena resolve tudo no rádio. Com dezenas de carros e boxes imaginários, a comunicação vira o próprio problema. A malha cria um padrão único para cada chamada, sem pedir que todo piloto reprograme o carro.",
    lead: "Microsserviços transformam chamadas internas em rede, sujeita a latência, falhas e identidades incertas. Reimplementar timeout, retry, criptografia e telemetria em cada linguagem gera inconsistência. A Service Mesh move essas políticas para proxies controlados de forma central.",
    concept: [
      "No modelo sidecar clássico do Istio, um Envoy acompanha o workload e intercepta tráfego de entrada e saída. A aplicação continua focada na regra de negócio.",
      "O Data Plane é formado pelos proxies que processam pacotes e aplicam políticas. Istiod é o Control Plane: observa serviços, traduz recursos de alto nível para configuração Envoy e distribui identidades e regras.",
      "A abstração cobra preço: sidecars consomem CPU e memória, adicionam latência por salto e aumentam a complexidade operacional. Para poucos serviços, o benefício pode não compensar.",
    ],
    pointsTitle: "Cérebro, execução e custo",
    points: [
      {
        t: "Envoy",
        d: "Proxy no caminho dos dados; aplica roteamento, resiliência, segurança e telemetria.",
        color: "signal",
      },
      {
        t: "Istiod",
        d: "Control Plane que distribui configuração, descoberta e identidades.",
        color: "blue",
      },
      {
        t: "Overhead",
        d: "Mais recursos, hops e uma plataforma adicional para atualizar e diagnosticar.",
        color: "ember",
      },
    ],
    examplesTitle: "Injeção e validação do sidecar",
    examples: [
      {
        label: "bootstrap",
        lang: "sh",
        code: "$ istioctl install --set profile=demo -y\n✔ Istio core installed\n✔ Ingress gateways installed\n\n$ kubectl label namespace demo istio-injection=enabled\nnamespace/demo labeled\n\n$ kubectl get pods -n demo\nNAME             READY   STATUS\napi-6c8d9f       2/2     Running",
        note: "READY 2/2 indica aplicação e proxy no mesmo Pod. Perfis demo servem ao laboratório, não como configuração padrão de produção.",
      },
    ],
    commands: [
      { cmd: "istioctl install --set profile=demo -y", note: "instala um laboratório local" },
      {
        cmd: "kubectl label namespace demo istio-injection=enabled",
        note: "habilita injeção clássica",
      },
      { cmd: "kubectl rollout restart deployment -n demo", note: "recria Pods com sidecar" },
      { cmd: "istioctl proxy-status", note: "confere sincronização dos proxies" },
    ],
    handsOn: [
      "Instale o perfil de demonstração num cluster descartável e habilite a injeção em um namespace.",
      "Recrie uma aplicação e confirme dois containers por Pod.",
      "Compare o consumo de recursos antes e depois e registre o custo do proxy.",
      "Desabilite a injeção em outro namespace e explique onde as políticas da malha deixam de atuar.",
    ],
    tip: "Service Mesh não conserta código ruim nem dependência lenta. Ela padroniza o comportamento da rede e oferece sinais melhores para encontrar o problema.",
    takeaway:
      "Istio separa comunicação de negócio: Envoy executa políticas no Data Plane e Istiod coordena configuração e identidade no Control Plane.",
    outro:
      "A malha está montada e cada unidade recebe a estratégia. Agora vamos dividir tráfego entre versões sem mudar uma linha do serviço.",
  },
  {
    id: "sw11",
    num: "11",
    navTitle: "Tráfego no Istio",
    tag: "canary com volante preciso",
    title: "VirtualService, DestinationRule e deploy gradual",
    narration:
      "Versão nova pronta para a pista não significa largada com cem por cento do tráfego. Primeiro vêm voltas controladas, comparação de telemetria e promoção só quando o ritmo confirma.",
    lead: "Deploy gradual exige separar versões e controlar quem recebe cada chamada. No Istio, DestinationRule nomeia subsets e políticas; VirtualService decide pesos, headers, paths, retries, timeouts e falhas simuladas.",
    concept: [
      "Canary por peso envia uma pequena porcentagem para a versão nova. A/B testing usa características da requisição, como header, para segmentar usuários. Traffic mirroring duplica chamadas para a nova versão, mas descarta sua resposta.",
      "Retries ajudam falhas transitórias, mas multiplicam carga quando usados sem limite. Timeouts definem quanto o cliente aceita esperar. Circuit breaking ejeta endpoints problemáticos e evita cascatas.",
      "Mudanças devem ser observadas por taxa de erro, latência e métricas de negócio. Peso é mecanismo de entrega, não critério automático de sucesso.",
    ],
    pointsTitle: "Três formas de testar uma versão",
    points: [
      { t: "Canary", d: "Divide tráfego real por peso e amplia gradualmente.", color: "signal" },
      { t: "A/B", d: "Seleciona grupos por header, cookie ou outra condição HTTP.", color: "blue" },
      {
        t: "Mirroring",
        d: "Copia carga real para a versão nova sem usar sua resposta.",
        color: "ember",
      },
    ],
    examplesTitle: "Noventa por cento v1, dez por cento v2",
    examples: [
      {
        label: "canary.yaml",
        lang: "yaml",
        code: "apiVersion: networking.istio.io/v1\nkind: DestinationRule\nmetadata:\n  name: api\nspec:\n  host: api\n  subsets:\n    - name: v1\n      labels: { version: v1 }\n    - name: v2\n      labels: { version: v2 }\n---\napiVersion: networking.istio.io/v1\nkind: VirtualService\nmetadata:\n  name: api\nspec:\n  hosts: [api]\n  http:\n    - route:\n        - destination: { host: api, subset: v1 }\n          weight: 90\n        - destination: { host: api, subset: v2 }\n          weight: 10\n      timeout: 2s\n      retries:\n        attempts: 2\n        perTryTimeout: 500ms",
        note: "Os pesos de uma rota precisam fechar 100. Garanta que os labels dos Pods correspondam aos subsets.",
      },
    ],
    commands: [
      { cmd: "kubectl apply -f canary.yaml", note: "publica subsets e divisão" },
      { cmd: "istioctl analyze", note: "detecta configurações inválidas" },
      {
        cmd: "for i in $(seq 1 100); do curl -s http://api/version; done | sort | uniq -c",
        note: "mede a proporção",
      },
      { cmd: "kubectl get virtualservice,destinationrule", note: "confere os recursos" },
    ],
    handsOn: [
      "Implante versões v1 e v2 com labels distintos e confirme que o Service seleciona ambas.",
      "Aplique a divisão 90/10 e conte cem respostas por versão.",
      "Crie uma regra por header que envie um usuário de teste sempre para v2.",
      "Espelhe tráfego para v2 e confirme nos logs que a chamada chegou, embora o cliente continue recebendo v1.",
    ],
    tip: "Se todo o tráfego cai numa versão, confira primeiro labels, host do Service e ordem das regras de match.",
    takeaway:
      "DestinationRule define os grupos disponíveis; VirtualService decide como cada chamada percorre esses grupos. Juntos, eles tornam o deploy gradual observável e reversível.",
    outro:
      "A versão nova ganhou voltas controladas. Na próxima etapa, a mesma malha autentica serviços e transforma cada hop em telemetria legível.",
  },
  {
    id: "sw12",
    num: "12",
    navTitle: "mTLS e observabilidade",
    tag: "identidade + telemetria",
    title: "Segurança e observabilidade dentro da malha",
    narration:
      "Não basta ouvir uma voz no rádio. A equipe precisa saber quem está falando, o que essa identidade pode pedir e por onde a mensagem passou. Segurança e telemetria entram na mesma volta.",
    lead: "Rede interna não é sinônimo de rede confiável. Istio pode autenticar workloads com certificados de curta duração, criptografar tráfego com mTLS e autorizar chamadas por identidade. Os mesmos proxies produzem métricas, logs e traces consistentes.",
    concept: [
      "PeerAuthentication controla mTLS. PERMISSIVE ajuda migrações; STRICT rejeita tráfego sem identidade da malha. AuthorizationPolicy responde o que uma identidade autenticada pode fazer.",
      "Envoy coleta volume, código de resposta e duração. Prometheus armazena métricas; Grafana apresenta painéis; Jaeger reconstrói traces; Kiali exibe topologia, erros e status de mTLS.",
      "O proxy cria e lê headers de tracing, mas a aplicação precisa propagá-los nas chamadas seguintes. Sem propagação, o trace quebra mesmo com sidecars saudáveis.",
    ],
    pointsTitle: "Autenticar, autorizar e explicar",
    points: [
      {
        t: "mTLS",
        d: "Cliente e servidor apresentam identidades e criptografam o hop.",
        color: "signal",
      },
      {
        t: "AuthorizationPolicy",
        d: "Libera origem, método e path mínimos necessários.",
        color: "ember",
      },
      {
        t: "Tracing distribuído",
        d: "Liga spans de vários serviços para revelar onde a latência nasceu.",
        color: "blue",
      },
    ],
    examplesTitle: "mTLS estrito por namespace",
    examples: [
      {
        label: "security.yaml",
        lang: "yaml",
        code: "apiVersion: security.istio.io/v1\nkind: PeerAuthentication\nmetadata:\n  name: strict-default\n  namespace: demo\nspec:\n  mtls:\n    mode: STRICT\n---\napiVersion: security.istio.io/v1\nkind: AuthorizationPolicy\nmetadata:\n  name: api-read\n  namespace: demo\nspec:\n  selector:\n    matchLabels:\n      app: api\n  action: ALLOW\n  rules:\n    - from:\n        - source:\n            principals: [cluster.local/ns/demo/sa/web]\n      to:\n        - operation:\n            methods: [GET]\n            paths: [/api/*]",
        note: "STRICT sem políticas e identidades testadas pode bloquear produção. Migre, observe e restrinja por etapas.",
      },
    ],
    commands: [
      {
        cmd: "istioctl proxy-config secret deploy/api -n demo",
        note: "confere certificados ativos no proxy",
      },
      { cmd: "kubectl get peerauthentication,authorizationpolicy -A", note: "lista políticas" },
      { cmd: "istioctl dashboard kiali", note: "abre o grafo da malha" },
      { cmd: "istioctl dashboard jaeger", note: "inspeciona traces" },
    ],
    handsOn: [
      "Ative mTLS PERMISSIVE e confirme quais workloads já usam a malha.",
      "Mude um namespace de laboratório para STRICT e teste uma chamada autorizada e outra fora da malha.",
      "Crie uma AuthorizationPolicy que permita apenas GET de um ServiceAccount conhecido.",
      "Gere tráfego, abra um trace e identifique qual serviço consumiu mais tempo.",
    ],
    tip: "Autenticação responde quem é; autorização responde o que pode fazer. Não use mTLS como substituto de política de acesso.",
    takeaway:
      "A malha torna identidade e telemetria propriedades de cada hop: mTLS autentica, AuthorizationPolicy restringe e observabilidade explica o percurso.",
    outro:
      "O rádio interno agora tem identidade e replay. Falta garantir que a própria operação sobreviva quando uma peça inteira do sistema sai da janela.",
  },
  {
    id: "sw13",
    num: "13",
    navTitle: "Alta disponibilidade",
    tag: "redundância testada",
    title: "SLA, SLO, SPOF e arquiteturas de alta disponibilidade",
    narration:
      "Corrida longa não se vence apostando que nada quebra. A equipe elimina pontos únicos, prepara sistemas redundantes e testa o plano antes de a falha escolher o pior momento.",
    lead: "Alta disponibilidade reduz indisponibilidade por falhas locais. Ela começa com uma meta mensurável, identifica componentes cuja queda derruba tudo e escolhe redundância compatível com custo e estado da aplicação.",
    concept: [
      "SLA é a promessa externa, possivelmente com penalidade. SLO é a meta interna usada pela engenharia. Um SPOF é qualquer servidor, balanceador, link ou local cuja falha interrompe todo o serviço.",
      "Ativo-passivo mantém uma instância de reserva e exige failover. Ativo-ativo usa todos os nós e redistribui carga, mas exige aplicações stateless ou sincronização correta. Keepalived e VRRP podem mover um IP virtual entre balanceadores.",
      "Health checks devem verificar a função real, não apenas o processo. Chaos Engineering formula uma hipótese, injeta uma falha controlada e mede a reação. Disaster Recovery cobre eventos amplos e usa RTO para tempo de recuperação e RPO para perda de dados aceitável.",
    ],
    pointsTitle: "Promessa, desenho e prova",
    points: [
      {
        t: "SLA e SLO",
        d: "Transformam confiabilidade em compromisso externo e objetivo interno mensurável.",
        color: "blue",
      },
      {
        t: "SPOF",
        d: "Mostra onde uma única falha ainda pode encerrar a corrida.",
        color: "ember",
      },
      {
        t: "Teste de resiliência",
        d: "Prova failover e recuperação antes do incidente real.",
        color: "signal",
      },
    ],
    examplesTitle: "Keepalived protegendo o balanceador",
    examples: [
      {
        label: "keepalived.conf",
        lang: "yaml",
        code: "vrrp_instance PITSTOP {\n    state BACKUP\n    interface eth0\n    virtual_router_id 51\n    priority 100\n    advert_int 1\n    virtual_ipaddress {\n        10.0.0.50/24\n    }\n    track_script {\n        check_nginx\n    }\n}",
        note: "Os dois nós compartilham virtual_router_id e VIP, mas usam prioridades diferentes. O script deve testar uma função útil do Nginx, não apenas a existência do processo.",
      },
    ],
    commands: [
      { cmd: "ip addr show | grep 10.0.0.50", note: "descobre qual nó possui o VIP" },
      { cmd: "systemctl status keepalived nginx", note: "confere os dois serviços" },
      { cmd: "systemctl stop nginx", note: "injeta uma falha controlada" },
      { cmd: "watch -n 1 'ip addr show | grep 10.0.0.50'", note: "acompanha o failover" },
    ],
    handsOn: [
      "Desenhe o caminho completo de uma requisição e marque cada componente sem redundância.",
      "Defina um SLO simples de disponibilidade e calcule o downtime mensal permitido.",
      "Num laboratório com dois nós, pare o Nginx primário e meça quanto o VIP leva para migrar.",
      "Escreva uma hipótese de Chaos Engineering e critérios claros de abortar o experimento.",
    ],
    tip: "Redundância não testada é só esperança cara. Meça failover, perda de requisições e tempo de recuperação.",
    takeaway:
      "HA combina objetivo mensurável, remoção de SPOFs, redundância e testes. DR complementa a estratégia quando a falha ultrapassa o servidor ou a zona local.",
    outro:
      "A operação sobreviveu à falha ensaiada. Última etapa: manter o sistema disponível sem deixá-lo disponível para quem pretende atacá-lo.",
  },
  {
    id: "sw14",
    num: "14",
    navTitle: "WAF e proteção",
    tag: "segurança na entrada",
    title: "WAF, ModSecurity, rate limiting e defesa em camadas",
    narration:
      "Última volta. O portão precisa continuar rápido para o público legítimo e implacável com carga maliciosa. Segurança boa não fecha a pista; ela reconhece o ataque sem derrubar a corrida.",
    lead: "Firewalls L3 e L4 bloqueiam redes e portas, mas não entendem um payload SQL Injection dentro de HTTP. Um Web Application Firewall inspeciona a camada de aplicação. ModSecurity fornece o motor; OWASP Core Rule Set entrega uma base de regras mantida pela comunidade.",
    concept: [
      "O WAF intercepta requisições, avalia regras e acumula uma pontuação de anomalia. Pode apenas registrar ou bloquear. Começar em modo de detecção permite ajustar falsos positivos antes de interromper usuários legítimos.",
      "TLS 1.2 ou 1.3, HSTS e headers seguros protegem o canal e o navegador. Rate limiting limita requisições por chave e ajuda contra força bruta e abuso, mas não substitui proteção DDoS distribuída.",
      "Logs do Nginx e do ModSecurity precisam chegar a uma plataforma central, com alertas por aumento de bloqueios, 5xx e latência. Segurança depende de revisão, atualização do CRS e testes repetíveis.",
    ],
    pointsTitle: "Defesa em camadas na borda",
    points: [
      {
        t: "ModSecurity + CRS",
        d: "Inspeciona conteúdo HTTP com regras para ataques conhecidos e pontuação de anomalia.",
        color: "ember",
      },
      {
        t: "Rate limiting",
        d: "Controla abuso por IP, token ou outra chave sem alterar a aplicação.",
        color: "signal",
      },
      {
        t: "Logs e alertas",
        d: "Transformam bloqueios em evidência para ajustar regras e responder incidentes.",
        color: "blue",
      },
    ],
    examplesTitle: "Protegendo o endpoint de login",
    examples: [
      {
        label: "nginx.conf",
        lang: "yaml",
        code: "limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;\n\nserver {\n    listen 443 ssl;\n    add_header Strict-Transport-Security max-age=31536000 always;\n\n    location = /login {\n        limit_req zone=login burst=3 nodelay;\n        proxy_pass http://pitstop_api;\n    }\n}",
        note: "Teste limites em ambiente controlado e defina uma chave adequada. IP pode agrupar vários usuários atrás de NAT.",
      },
      {
        label: "validação",
        lang: "sh",
        code: "$ curl -i http://localhost/login?user=admin%27%20OR%20%271%27=%271\nHTTP/1.1 403 Forbidden\n\n$ for i in $(seq 1 10); do curl -s -o /dev/null -w '%{http_code}\n' https://localhost/login; done\n200\n200\n429",
        note: "403 representa bloqueio da regra do WAF; 429 representa limite de taxa. O resultado depende da configuração real do CRS e do Nginx.",
      },
    ],
    commands: [
      { cmd: "nginx -t", note: "valida sintaxe antes do reload" },
      { cmd: "curl -I https://localhost", note: "confere TLS e HSTS" },
      { cmd: "tail -f /var/log/modsec_audit.log", note: "acompanha regras acionadas" },
      {
        cmd: "tail -f /var/log/nginx/access.log /var/log/nginx/error.log",
        note: "correlaciona resposta e causa",
      },
    ],
    handsOn: [
      "Suba Nginx com ModSecurity e OWASP CRS em modo de detecção. Envie requisições normais e payloads de laboratório.",
      "Leia o audit log, identifique a regra acionada e só depois habilite bloqueio.",
      "Aplique rate limiting em /login e confirme respostas 429 após o limite.",
      "Monte um checklist com TLS, HSTS, atualização do CRS, retenção de logs e alerta de picos de bloqueio.",
    ],
    tip: "WAF não corrige vulnerabilidade no código. Ele reduz exposição e compra tempo; a correção definitiva continua na aplicação.",
    takeaway:
      "Uma borda segura combina criptografia, inspeção L7, controle de taxa, logs e resposta operacional. Disponibilidade só vale quando o acesso legítimo continua confiável.",
    outro:
      "Bandeirada! Você saiu do primeiro servidor web e chegou a uma borda distribuída, observável, resiliente e protegida. Debrief completo, quatorze setores no verde.",
  },
];
