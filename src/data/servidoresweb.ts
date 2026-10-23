// Conteúdo das aulas 1-5 do módulo de Servidores Web e Balanceamento de Carga, em 14 etapas.
// A lente geral de F1 abre o guia (LENS) e cada etapa ensina o tópico só de forma técnica,
// sem repetir a analogia.
// Gerado de relatorios/servidores-web-nginx-apache/final.md por scripts/build-lens-guide.py.
// Para mudar o texto, edite o markdown e gere de novo; o markdown inline (`código`, **negrito**)
// é renderizado pelo LensKit.

import type { ChecklistGroup, GuideLens, TechLesson } from "@/components/guide/LensKit";

export type Lesson = TechLesson;

export const INTRO: string[] = [
  "Este guia ensina, em 14 etapas, o caminho que uma requisição faz do navegador até a aplicação e como configurar cada peça desse caminho. Você começa entendendo para que serve um servidor web, como o HTTP evoluiu da versão 1.1 ao HTTP/3 e a diferença entre forward proxy e reverse proxy; depois estuda os modelos de processamento do Apache (MPMs), a arquitetura orientada a eventos do Nginx, o balanceamento de carga com seus algoritmos e os health checks com failover e diagnóstico de 502 e 504. No Kubernetes, você publica serviços com Ingress e TLS automático pelo cert-manager e, com o Istio, estuda a arquitetura da service mesh, o deploy gradual com VirtualService e DestinationRule, e o mTLS com autorização e observabilidade; por fim, calcula metas de disponibilidade (SLA e SLO), testa o failover de um IP virtual com Keepalived e protege a borda com WAF, rate limiting e HSTS. Antes das etapas, a seção seguinte apresenta a lente de F1 do guia: uma comparação geral que mostra o mesmo caminho funcionando dentro de uma equipe de Fórmula 1.",
  'Cada etapa só depende do que foi explicado antes dela e termina com um exercício pequeno que prova que você entendeu. Servidores se aprendem derrubando e religando peças de propósito, então não pule os blocos "Mão na massa".',
  "**O que você precisa ter:** um terminal com `curl` e o Docker (com Compose v2), que bastam para as Etapas 01 a 07, 13 e 14. As Etapas 08 a 12 rodam no Minikube e partem do que os guias de Kubernetes ensinam: Pods, Deployments, Services e o `kubectl` com YAML declarativo vêm do guia de Kubernetes básico, e o Helm, usado aqui para instalar o cert-manager, é apresentado no guia de Kubernetes avançado. Se esses temas forem novos para você, estude esses guias antes da Etapa 08.",
  "**Como usar este guia:** mantenha um terminal aberto ao lado do texto. Os laboratórios assumem Linux (Ubuntu ou Debian), Docker com Compose v2 (comando `docker compose`), `curl`, `python3` e `openssl`. O utilitário `ab` (Apache Bench) vem no pacote `apache2-utils` (`sudo apt install apache2-utils`). Organize os arquivos em uma pasta por etapa (`etapa01/`, `etapa02/` e assim por diante), porque nomes como `compose.yaml` e `nginx.conf` se repetem, e rode `docker compose down` no fim de cada etapa antes de seguir. Quando um exemplo mostra a saída esperada, compare com a sua: versões, IPs, tempos e contagens vão variar, e a estrutura da saída é o que importa. Saídas abreviadas estão marcadas com `(...)` e saídas que dependem de versão ou de ambiente aparecem como aproximadas.",
  "**O que roda onde:** as Etapas 01 a 07, 13 e 14 rodam em Docker (Compose), sem instalar nginx nem apache2 no seu computador. A Etapa 04 traz, além do caminho em Docker, os comandos equivalentes para um Apache instalado no host (`sudo apt install apache2`), e a Etapa 05 pode ser repetida com um Nginx instalado no host (`sudo apt install nginx`). As Etapas 08 e 09 rodam no Minikube (com o addon `ingress` e o cert-manager instalado por Helm). As Etapas 10, 11 e 12 rodam no Minikube com o Istio instalado por `istioctl`; recomenda-se um perfil com 4 CPUs e 8 GB de memória, ajustado ao que a sua máquina tem. Ficam só como leitura: a emissão de certificados reais com Let's Encrypt (exige domínio público), a política de circuit breaking com ejeção de endpoints e a coleta de traces com Jaeger (exige configurar um provedor de tracing). A Etapa 13 usa Docker em Linux, com permissão de rede (`NET_ADMIN`) para o Keepalived.",
];

export const LENS: GuideLens = {
  paragraphs: [
    "Os guias de Kubernetes apresentaram o cluster como uma equipe de Fórmula 1 num fim de semana de Grande Prêmio. Na mureta (o pit wall, a bancada voltada para a pista) ficam os engenheiros que decidem, nas garagens ficam os mecânicos que executam, e os carros na pista fazem o trabalho. Cada carro é chamado pelo seu número de corrida, o número que aparece no rádio e na cronometragem, mesmo quando o chassi embaixo dele é trocado. Este guia olha para a mesma equipe por outro ângulo: por onde os pedidos e as pessoas entram nela, por onde passam e quem responde. Em volta das garagens fica o paddock, a área de trabalho das equipes, fechada ao público. Só entra quem tem credencial, e a entrada é feita por catracas que leem o passe de cada pessoa.",
    "Dentro do paddock, cada equipe tem uma recepção na sua área de hospitalidade (o motorhome, a estrutura onde a equipe recebe imprensa e convidados). Todo pedido de fora chega a ela. O que já está pronto, como o comunicado de imprensa ou a folha de tempos da sessão, a recepção entrega na hora. O resto ela encaminha a quem resolve: uma pergunta técnica vai ao engenheiro responsável, e a resposta volta pela recepção. Quem perguntou não sabe qual engenheiro respondeu nem quantos existem atrás da recepção, e o engenheiro recebe, junto com a pergunta, um bilhete dizendo quem perguntou de verdade. No sentido contrário, a saída também tem um ponto único. Quando um engenheiro precisa de algo de um fornecedor, o pedido passa pelo setor de compras, que aprova ou recusa, registra e faz o pedido em nome da equipe. O fornecedor só conhece o setor de compras.",
    "As conversas da equipe seguem dois formatos. No rádio de voz, entre o engenheiro de corrida (quem acompanha um carro na mureta) e o piloto, só um fala por vez: o engenheiro faz uma pergunta, espera a resposta e só então faz a próxima, mesmo que a segunda fosse rápida. A telemetria funciona de outro jeito. Os sensores do carro enviam dados continuamente à garagem, e centenas de fluxos, cada um identificado pelo sensor de origem, viajam juntos pelo mesmo link, sem que um fluxo espere o outro.",
    "A recepção pode organizar o atendimento de jeitos diferentes. Num deles, cada visitante ganha uma sala e um atendente só para ele: um problema numa sala não afeta as outras, mas com centenas de visitantes faltam salas. Em outro, poucas salas recebem vários atendentes cada, que dividem mesa e arquivos: cabe mais gente, mas um atendente que derruba o arquivo atrapalha a sala inteira. Uma variação desse segundo jeito põe uma pessoa só para vigiar os visitantes que estão sentados sem pedir nada, e libera os atendentes para quem está falando. Há ainda um jeito bem diferente: poucos atendentes, um por mesa, que nunca ficam parados esperando. Quando a resposta depende de um engenheiro, o atendente anota o pedido, combina que será avisado quando ela chegar e atende o próximo. Com poucas pessoas, a recepção acompanha muitos visitantes ao mesmo tempo.",
    "Muitos pedidos podem ser respondidos por qualquer um de um grupo de analistas de dados que fazem o mesmo trabalho. Quem decide qual analista recebe cada pedido é a própria recepção, no mesmo balcão onde o pedido chegou, e não outra pessoa em outro lugar. Ela pode revezar em ordem, dar o dobro de pedidos ao analista mais rápido, escolher quem tem menos pedidos abertos ou mandar os pedidos de um carro sempre ao mesmo analista, que já tem o histórico dele na mesa. Pode decidir só pelo remetente (de qual carro veio) ou ler o pedido e mandar a dúvida de aerodinâmica a quem cuida disso.",
    "A recepção também acompanha a saúde do grupo. Ela nota quando um pedido volta sem resposta e chama cada analista de tempos em tempos, como no radio check (a chamada de rotina no rádio para confirmar que o canal funciona). Quem não responde sai da escala, e um analista reserva só entra quando todos os titulares estão fora.",
    "A recepção não inventa para onde mandar cada pedido. Ela segue uma folha de encaminhamento escrita pela equipe: perguntas sobre o carro 1 vão para quem atende pelo número 1, convidados vão para a hospitalidade, fornecedores vão para a logística. A folha só funciona porque há alguém na recepção que a lê e age; uma folha pregada numa porta sem ninguém não encaminha nada. A recepção também precisa provar que é mesmo da equipe. Ela exibe uma credencial emitida pelo escritório de credenciamento do evento, que qualquer visitante pode conferir. Cada credencial tem validade, e quem cuida dos passes pede a renovação antes do vencimento, sem esperar alguém perceber que venceu.",
    "Por dentro, a equipe conversa pelo intercom, o sistema de rádio interno com canais separados (estratégia, carro 1, carro 2, garagem). Cada pessoa usa um rádio de cinto ligado ao fone, e é esse aparelho, não a pessoa, que cifra a conversa, repete a mensagem que não teve confirmação e grava tudo com horário. As regras de cada aparelho saem de uma central, onde o engenheiro de comunicações define os canais e quem fala em cada um. Só entra num canal um rádio registrado no passe de quem o usa, e estar registrado não basta: a central também diz quem pode falar no canal de estratégia. A gravação com horário permite reconstruir por onde uma decisão passou e onde ela demorou.",
    "Para estrear uma novidade, a equipe usa o caminho cauteloso do guia avançado: a peça nova vai só no carro 1, e o carro 2 continua com a antiga. Um software de estratégia novo pode rodar na fábrica em paralelo, recebendo os mesmos dados ao vivo, sem que a mureta use a resposta dele. A equipe também evita depender de uma peça única. O rádio da garagem tem um equipamento principal e um reserva, que respondem pelo mesmo canal: se o principal cai, o reserva assume, e quem chama não precisa trocar de canal. Cada sistema crítico tem uma meta de tempo no ar, e a equipe treina as trocas com falhas provocadas de propósito, com hora para começar e para parar.",
    "Na entrada, a proteção também vem em camadas. A catraca do paddock confere só a credencial e o portão por onde a pessoa passa. Na hospitalidade, a segurança revista o que a pessoa carrega, soma as suspeitas e só barra quem passa de um limite. E cada veículo de imprensa tem um número máximo de pedidos de entrevista por dia.",
  ],
  bridge: [
    "É o mesmo caminho que uma requisição faz até a aplicação. A recepção é o servidor web na função de reverse proxy: entrega o conteúdo estático (o comunicado pronto), encaminha o resto ao backend (o engenheiro) e anota o cliente real no X-Forwarded-For (o bilhete). O setor de compras é o forward proxy. As regras da conversa são o HTTP: no rádio de voz um fala por vez e a segunda pergunta espera a primeira resposta, como no HTTP/1.1, enquanto a telemetria, com muitos fluxos identificados no mesmo link, é a multiplexação do HTTP/2. A sala por visitante é o MPM Prefork do Apache, as salas com vários atendentes são o Worker, a pessoa que vigia quem só espera é o Event, e o atendente que anota e passa ao próximo é o worker do Nginx com seu event loop.",
    "A recepção, quando escolhe o analista, é o balanceador de carga: o mesmo Nginx que faz o proxy, com o grupo de analistas declarado no bloco upstream. Decidir pelo remetente é a camada 4, ler o pedido é a camada 7, e os quatro critérios são Round Robin, weight, least_conn e ip_hash. A chamada periódica é o health check ativo, o pedido sem resposta é o passivo, e o analista reserva é o servidor backup. A folha de encaminhamento é o Ingress, e quem a lê na recepção é o Ingress Controller. A credencial da recepção é o certificado TLS, o escritório de credenciamento é o Issuer, e a renovação antes do vencimento é o trabalho do cert-manager.",
    "O intercom é o service mesh: o rádio de cinto é o sidecar Envoy (o data plane), a central do engenheiro de comunicações é o Istiod (o control plane), e a mensagem repetida sem confirmação é o retry. O rádio registrado no passe é o mTLS, com identidade derivada da ServiceAccount, a permissão de falar no canal é a AuthorizationPolicy, e a gravação com horário é o tracing distribuído. A peça só no carro 1 é o canário, e o software em paralelo é o mirroring. O equipamento reserva no mesmo canal é o IP virtual movido pelo Keepalived, a meta de tempo no ar é o SLO, e os treinos de falha são o chaos engineering. A catraca é o firewall de rede, a revista é o WAF, e o limite de pedidos de entrevista é o rate limiting.",
    "As regras dos guias de Kubernetes continuam valendo: cada chassi montado é um Pod, cada garagem é um nó e o número de corrida é o Service. Este guia acrescenta uma: a recepção é sempre a borda. Todo pedido de fora passa por ela antes de chegar a qualquer engenheiro, e quem está atrás dela não precisa saber lidar com a fila, a credencial ou a revista.",
  ],
  mappingNote:
    "O quadro abaixo traduz cada termo técnico do guia para uma ideia do dia a dia, sem F1 e sem jargão. Não precisa decorar; volte a ele quando um termo aparecer no texto.",
  mapping: [
    {
      term: "Servidor web",
      plain:
        "O balcão de atendimento de um prédio: recebe quem chega, entrega na hora o que já está pronto (folhetos, formulários) e encaminha os pedidos mais complicados para o setor responsável.",
    },
    {
      term: "Backend (servidor de aplicação)",
      plain:
        "O setor que de fato resolve o pedido, como o departamento que calcula o preço de uma entrega. Fica atrás do balcão e não precisa lidar com a fila.",
    },
    {
      term: "Conteúdo estático",
      plain:
        "Material que é igual para todo mundo, como um folheto impresso: basta entregar o arquivo, sem calcular nada.",
    },
    {
      term: "Requisição e resposta",
      plain:
        "O pedido que o cliente faz e a resposta que volta, como entregar um formulário no balcão e receber o carimbo de volta.",
    },
    {
      term: "Cabeçalho e código de status",
      plain:
        'Cabeçalho é a etiqueta colada na correspondência, com informações sobre ela (quem enviou, tipo de conteúdo). Código de status é o resultado resumido em um número: 200 "tudo certo", 404 "não achei", 502 e 504 "o setor de trás falhou ou demorou".',
    },
    {
      term: "Terminação TLS",
      plain:
        "Abrir o envelope lacrado (criptografado) em um único guichê na entrada, em vez de cada setor ter que saber abrir envelopes.",
    },
    {
      term: "Cache",
      plain:
        "Uma gaveta com cópias de respostas que se repetem, para não ir ao arquivo a cada pedido.",
    },
    {
      term: "Sem estado (stateless)",
      plain:
        "Cada atendimento começa do zero, como um balcão que não reconhece quem já passou ali. Por isso o cliente carrega um comprovante (cookie) que o identifica.",
    },
    {
      term: "Cookie e sessão",
      plain:
        "O comprovante que o cliente apresenta a cada visita (cookie) e a ficha que o prédio guarda sobre ele (sessão).",
    },
    {
      term: "Conexão persistente (keep-alive)",
      plain:
        "Deixar a linha telefônica aberta entre uma pergunta e outra, em vez de ligar de novo a cada pergunta.",
    },
    {
      term: "Head-of-line blocking",
      plain:
        "Uma fila de caixa única em que o primeiro cliente demora e todos atrás esperam, mesmo com pedidos simples.",
    },
    {
      term: "Multiplexação",
      plain:
        "Vários pedidos andando juntos pela mesma linha, cada um com seu número, de modo que a resposta de um não precise esperar a do outro.",
    },
    {
      term: "HTTP/1.1, HTTP/2 e HTTP/3",
      plain:
        "Três gerações das regras de conversa entre cliente e servidor, cada uma criada para eliminar um tipo de espera da geração anterior.",
    },
    {
      term: "QUIC",
      plain:
        "Uma forma de entregar as mensagens em que cada conversa tem a sua própria esteira, então uma encomenda perdida em uma esteira não para as outras.",
    },
    {
      term: "Proxy",
      plain: "Um intermediário que recebe um pedido e o repassa a outro lugar em nome de alguém.",
    },
    {
      term: "Forward proxy",
      plain:
        "A portaria de saída de uma empresa: os funcionários só falam com o exterior por ela, e o exterior só enxerga a portaria.",
    },
    {
      term: "Reverse proxy",
      plain:
        "A recepção de uma empresa: quem vem de fora fala só com a recepção, que encaminha cada pedido ao setor certo sem que o visitante saiba quantos setores existem.",
    },
    {
      term: "Upstream",
      plain: "O grupo de setores de trás, para onde a recepção encaminha os pedidos.",
    },
    {
      term: "X-Forwarded-For",
      plain:
        "Um bilhete que a recepção anexa ao pedido dizendo quem o enviou de verdade, já que o setor de trás só vê a recepção entregando.",
    },
    {
      term: "Processo e thread",
      plain:
        "Processo é uma sala de trabalho independente, com mesa e arquivos próprios. Thread é uma pessoa trabalhando dentro de uma sala, dividindo mesa e arquivos com os colegas.",
    },
    {
      term: "Thread-safe",
      plain:
        "Uma ferramenta que várias pessoas podem usar ao mesmo tempo sem se atrapalhar. Uma ferramenta que não é thread-safe só funciona bem quando uma pessoa a usa por vez.",
    },
    {
      term: "MPM",
      plain:
        "A regra que o Apache usa para organizar o atendimento: uma sala por cliente, poucas salas com várias pessoas, ou pessoas que vigiam vários clientes em espera.",
    },
    {
      term: "Prefork, Worker e Event",
      plain:
        "As três regras de organização do Apache: uma sala isolada por cliente; poucas salas com várias pessoas cada; e a segunda regra com um jeito de não prender uma pessoa a um cliente que só está esperando.",
    },
    {
      term: "mod_php e PHP-FPM",
      plain:
        "No primeiro, o programa PHP trabalha dentro da sala do Apache. No segundo, ele é um setor separado que o Apache chama quando precisa.",
    },
    {
      term: "I/O não bloqueante e event loop",
      plain:
        'Em vez de ficar parado diante de um cliente esperando uma resposta, o atendente anota "me avise quando chegar" e atende outro. O event loop é o ciclo de olhar a lista de avisos, tratar o que está pronto e voltar à lista.',
    },
    {
      term: "Worker (Nginx)",
      plain: "Cada atendente que executa esse ciclo; costuma haver um por núcleo do processador.",
    },
    {
      term: "Balanceador de carga",
      plain:
        "Quem distribui os pedidos entre vários guichês iguais, seguindo uma regra: revezamento, quem tem menos fila ou sempre o mesmo guichê para o mesmo cliente.",
    },
    {
      term: "Camada 4 e camada 7",
      plain:
        "Camada 4 decide olhando só endereço e porta, como separar cartas pelo CEP sem abrir o envelope. Camada 7 abre e lê o conteúdo para decidir.",
    },
    {
      term: "Round Robin, weight, least_conn e ip_hash",
      plain:
        "Revezamento em ordem; revezamento dando mais vezes ao guichê mais forte; escolher o guichê com menos clientes agora; e mandar o mesmo cliente sempre ao mesmo guichê, a partir do endereço dele.",
    },
    {
      term: "Afinidade de sessão",
      plain:
        "Preferir que o mesmo cliente seja sempre atendido no mesmo guichê, porque a ficha dele está lá.",
    },
    {
      term: "Health check passivo e ativo",
      plain:
        "Passivo: perceber que um guichê está falhando porque clientes reais reclamaram. Ativo: alguém passar de tempos em tempos perguntando a cada guichê se ele está funcionando.",
    },
    {
      term: "Failover e servidor backup",
      plain:
        "Failover é redirecionar o atendimento quando um guichê falha. O backup é um guichê reserva, que só abre quando os principais estão fechados.",
    },
    {
      term: "Percentil (p95)",
      plain:
        "Dizer que 95% dos atendimentos foram mais rápidos que um certo tempo. Mostra a experiência dos mais lentos, que a média esconde.",
    },
    {
      term: "stub_status",
      plain: "Um painel simples do balcão que mostra quantos clientes estão sendo atendidos agora.",
    },
    {
      term: "Ingress e Ingress Controller",
      plain:
        'O Ingress é o quadro de avisos na portaria de um condomínio ("bloco A vai para o prédio 1, bloco B para o prédio 2"). O Controller é o porteiro que lê o quadro e age. Sem porteiro, o quadro não muda nada.',
    },
    {
      term: "ClusterIP, NodePort e LoadBalancer",
      plain:
        "Três jeitos de dar um endereço estável a um grupo de programas: só para uso interno; uma porta em cada máquina; ou um endereço externo próprio.",
    },
    {
      term: "Annotation",
      plain: "Observação extra colada em um recurso, que só é lida por quem sabe interpretá-la.",
    },
    {
      term: "pathType",
      plain:
        "A regra que diz se um endereço precisa ser exatamente igual ao combinado ou só começar igual a ele.",
    },
    {
      term: "Certificado, ACME e Let's Encrypt",
      plain:
        "Certificado é o documento que prova que o site é quem diz ser. ACME é o protocolo automático para pedir e renovar esse documento. Let's Encrypt é uma entidade gratuita que o emite.",
    },
    {
      term: "SNI",
      plain:
        "O nome do destino que o visitante diz logo no início da conversa segura, para que uma mesma entrada possa apresentar o documento certo de cada site.",
    },
    {
      term: "Issuer, ClusterIssuer e Certificate",
      plain:
        "Issuer é o cartório que emite documentos para uma área; ClusterIssuer é o cartório de todas as áreas; Certificate é o pedido de um documento específico.",
    },
    {
      term: "HTTP-01 e DNS-01",
      plain:
        "Duas formas de provar ao cartório que o domínio é seu: publicar um arquivo no site ou publicar um registro no cadastro de endereços (DNS).",
    },
    {
      term: "Secret",
      plain:
        "Um cofre pequeno para senhas e chaves. O conteúdo é apenas codificado; quem protege é o controle de quem pode abrir o cofre.",
    },
    {
      term: "Service mesh",
      plain:
        "Uma rede de fiscais ao lado de cada programa, que cuidam da comunicação entre eles (reenvio, criptografia, medição) para que os programas não precisem cuidar disso.",
    },
    {
      term: "Sidecar e Envoy",
      plain:
        "Sidecar é o assistente que trabalha ao lado do programa, na mesma mesa. Envoy é o assistente que o Istio usa.",
    },
    {
      term: "Data plane e control plane",
      plain:
        "Control plane é a central que decide as regras; data plane são os assistentes que as aplicam a cada pedido.",
    },
    {
      term: "Istiod",
      plain: "A central do Istio: distribui regras, endereços e identidades aos assistentes.",
    },
    {
      term: "ServiceAccount",
      plain: "O crachá de um programa dentro do cluster, que diz em nome de quem ele trabalha.",
    },
    {
      term: "VirtualService e DestinationRule",
      plain:
        "O primeiro define para onde cada pedido vai (rotas e porcentagens). O segundo dá nome aos grupos de destino e define regras sobre eles.",
    },
    {
      term: "Subset",
      plain:
        'Um subgrupo nomeado de programas iguais com uma etiqueta em comum, por exemplo "versão 1".',
    },
    {
      term: "Canary, A/B e mirroring",
      plain:
        "Canário: testar com poucos clientes antes de liberar para todos. A/B: dar versões diferentes a grupos escolhidos por alguma característica. Mirroring: mandar uma cópia do pedido à versão nova só para observar, sem entregar a resposta dela ao cliente.",
    },
    {
      term: "Retry e timeout",
      plain:
        "Retry é tentar de novo um pedido que falhou. Timeout é o tempo máximo de espera antes de desistir.",
    },
    {
      term: "Circuit breaking",
      plain:
        "O disjuntor: parar de enviar pedidos a um destino que está falhando, para não piorar a situação.",
    },
    {
      term: "mTLS",
      plain:
        "As duas pontas mostram o crachá uma à outra antes de conversar, e a conversa é em código.",
    },
    {
      term: "PeerAuthentication e AuthorizationPolicy",
      plain:
        "A primeira exige crachá na conversa. A segunda é a lista de quem, com crachá, pode pedir o quê.",
    },
    {
      term: "Tracing distribuído",
      plain:
        "Um número de protocolo que acompanha um pedido por todos os setores, para ver onde ele demorou mais.",
    },
    {
      term: "SLA e SLO",
      plain:
        "SLA é a promessa escrita ao cliente, com consequências se falhar. SLO é a meta interna, em geral mais rigorosa.",
    },
    {
      term: "Orçamento de erro",
      plain: "A quantidade de falha que a meta permite no período, como um limite de faltas.",
    },
    {
      term: "SPOF",
      plain: "Um ponto único de falha: a única chave de uma porta. Se ela se perde, ninguém entra.",
    },
    {
      term: "Ativo-passivo e ativo-ativo",
      plain: "Uma recepção principal com uma reserva parada, ou duas recepções trabalhando juntas.",
    },
    {
      term: "VRRP, Keepalived e IP virtual",
      plain:
        "Dois atendentes combinam um número de telefone compartilhado. O telefone toca no que está de plantão e passa para o outro se ele sair.",
    },
    {
      term: "RTO e RPO",
      plain:
        "O tempo máximo aceito para voltar a atender e a quantidade máxima de informação (medida em tempo) que se aceita perder.",
    },
    {
      term: "HA e DR",
      plain:
        "HA é manter o atendimento quando uma peça falha. DR é o plano para recomeçar depois de um desastre grande, como a perda de todo o prédio.",
    },
    {
      term: "Chaos engineering",
      plain:
        "Um simulado de incêndio: provocar uma falha controlada, com hipótese e hora para parar, para ver se o plano funciona.",
    },
    {
      term: "WAF",
      plain:
        "Segurança de portaria que lê o conteúdo do pedido procurando golpes conhecidos, além de conferir documentos.",
    },
    {
      term: "ModSecurity e OWASP CRS",
      plain:
        "O mecanismo que aplica as regras de segurança e o livro de regras mantido pela comunidade.",
    },
    {
      term: "Pontuação de anomalia e modo de detecção",
      plain:
        "Cada suspeita soma pontos e só quem passa de um limite é barrado. No modo de detecção, o segurança apenas anota o que barraria, sem barrar, para calibrar.",
    },
    {
      term: "Rate limiting",
      plain: "Um limite de quantos pedidos por minuto cada pessoa pode fazer.",
    },
    {
      term: "HSTS",
      plain:
        'O aviso que o site dá ao navegador: "daqui para a frente, só fale comigo pela via segura".',
    },
    {
      term: "Defesa em camadas",
      plain:
        "Várias barreiras em sequência (portaria, catraca, porta), de modo que a falha de uma não deixe tudo exposto.",
    },
  ],
  limitsIntro:
    "A comparação ajuda a fixar quem faz o quê na borda, mas não é uma equivalência perfeita. Estes são os pontos em que a F1 deixa de valer para cada etapa:",
  limits: [
    "**Etapa 01:** na equipe, a recepção e os engenheiros são pessoas diferentes por natureza; no software, a aplicação pode atender direto a internet (um Node.js na porta 3000, sem nada na frente), e separar o servidor web da aplicação é uma decisão de arquitetura, não algo dado.",
    "**Etapa 02:** o rádio de voz é conduzido por pessoas que lembram da conversa e pedem para repetir; o HTTP é sem estado, cada requisição chega sem memória das anteriores, e o contexto do usuário precisa vir de cookie ou sessão. A troca do TCP pelo QUIC no HTTP/3, que limita o atraso de um pacote perdido ao stream afetado, não tem equivalente no rádio de voz.",
    "**Etapa 03:** o bilhete que a recepção anexa é confiável porque só ela o escreve; o X-Forwarded-For pode ser forjado pelo próprio cliente, e o backend só deve confiar nele quando vier de um proxy conhecido. Além disso, o visitante sabe que fala com uma recepção, enquanto o reverse proxy é transparente para o cliente.",
    "**Etapa 04:** na recepção, o limite é o número de pessoas e salas; no Apache, o MPM é escolhido na configuração, só um fica ativo por vez, e o limite é a memória de cada processo. No Worker e no Event, um erro grave numa thread pode derrubar o processo filho inteiro e as conexões que ele atendia, e a exigência de módulos thread-safe não tem par numa equipe de pessoas.",
    "**Etapa 05:** um atendente que anota pedidos precisa lembrar de cada um; o worker do Nginx recebe do kernel (epoll) a lista do que ficou pronto, e o limite passa a ser CPU, memória e descritores de arquivo. Como proxy, cada cliente ocupa duas conexões (uma com o cliente e outra com o backend), conta que não aparece na recepção.",
    "**Etapa 06:** os analistas são pessoas com ritmos diferentes; os backends de um upstream são cópias idênticas da mesma aplicação. O ip_hash agrupa clientes pelo endereço, então muitos usuários atrás do mesmo NAT ou VPN caem num backend só, e a recomendação é guardar a sessão fora do backend (Redis ou token assinado), ao contrário do analista, que guarda o histórico na própria mesa.",
    "**Etapa 07:** o radio check é uma chamada ativa feita por pessoas; no Nginx Open Source a verificação é só passiva, a partir de requisições reais (max_fails e fail_timeout), e o Nginx tenta outro backend sozinho em caso de erro de conexão ou timeout. A distinção entre 502 (resposta inválida ou conexão recusada) e 504 (resposta que não chegou a tempo) não tem equivalente.",
    "**Etapa 08:** a folha de encaminhamento é lida por pessoas que interpretam uma regra ambígua; no Ingress, o pathType (Prefix, Exact) define a correspondência exata, as annotations valem para o Ingress inteiro, e com mais de um Controller o ingressClassName escolhe quem lê cada folha. Se o Service de destino não tem Pods prontos, o Ingress não tem para onde encaminhar.",
    "**Etapa 09:** a credencial do paddock é um objeto físico conferido por pessoas; o certificado é verificado por software a cada conexão, a chave privada fica num Secret que é só codificado em base64 (a proteção vem do RBAC), e a prova de controle do domínio (HTTP-01 ou DNS-01) não tem equivalente no credenciamento.",
    "**Etapa 10:** o rádio de cinto é entregue a cada pessoa no começo do dia; o sidecar só é injetado na criação do Pod, então Pods que já existiam precisam ser recriados para entrar na malha. E cada sidecar consome CPU e memória e soma latência a cada salto, custo que, com poucos serviços, pode não compensar.",
    "**Etapa 11:** com dois carros, a peça nova vai para metade da equipe; o VirtualService divide o tráfego por pesos exatos que somam 100, ou por header, cookie ou path. Repetir uma mensagem no rádio não sobrecarrega ninguém, enquanto retries sem limite multiplicam a carga sobre um serviço que já falha, e por isso existe o circuit breaking, que ejeta endpoints com falhas seguidas.",
    "**Etapa 12:** a gravação do intercom já sai completa e com horário; no tracing distribuído, a aplicação precisa propagar os headers de rastreamento em cada chamada seguinte, e sem isso o trace quebra mesmo com os sidecars saudáveis. E uma AuthorizationPolicy ALLOW nega com HTTP 403 tudo o que não casa com uma regra, sem o bom senso de quem administra um canal.",
    "**Etapa 13:** na garagem, basta o equipamento reserva estar ligado no mesmo canal; com VRRP, os dois balanceadores trocam anúncios o tempo todo, o de maior prioridade com saúde confirmada responde pelo IP virtual, a configuração dos dois precisa ser mantida igual por automação, e em muitas redes de nuvem o VRRP não funciona como numa rede local. As contas de disponibilidade (componentes em série multiplicam, réplicas independentes em paralelo melhoram) não têm par direto.",
    "**Etapa 14:** a segurança da hospitalidade reconhece um comportamento que nunca viu; o WAF só pontua padrões descritos nas regras do CRS, níveis de paranoia maiores trazem mais falsos positivos, e ele não corrige a falha no código, só reduz a exposição. O rate limiting conta por IP, então usuários atrás do mesmo NAT dividem o mesmo limite, e ele não protege contra um ataque distribuído em que cada origem envia pouco.",
  ],
};

export const LESSONS: Lesson[] = [
  {
    id: "m1",
    num: "01",
    navTitle: "Por que existe",
    tag: "papel do servidor web",
    title: "Para que serve um servidor web",
    lead: "Uma equipe publica uma aplicação Node.js e a deixa atendendo diretamente na porta 3000, sem nada na frente dela. No começo funciona bem. Conforme o produto cresce, aparecem dores que não têm relação com a regra de negócio. As imagens e os arquivos CSS e JavaScript do site passam a competir pelo mesmo processo que executa a lógica da aplicação, e tudo fica mais lento.\n\nChega a hora de renovar o certificado HTTPS, e como ele está configurado dentro do código, a renovação exige mexer na aplicação e reiniciar o processo mesmo sem nenhuma mudança de regra de negócio. O tráfego sobe e uma única instância não aguenta mais, mas distribuir o tráfego entre réplicas vira uma decisão manual a cada requisição. Por fim, um bot começa a fazer scraping agressivo do catálogo, e não existe camada nenhuma filtrando esse tráfego antes de ele bater direto na aplicação.\n\nTodos esses problemas são de infraestrutura de borda, não de regra de negócio. Resolvê-los dentro do código da aplicação mistura responsabilidades que deveriam estar separadas, e é exatamente esse conjunto de responsabilidades que um servidor web como o Apache HTTP Server ou o Nginx assume.",
    concept: [
      "Um servidor web é o ponto por onde toda requisição HTTP entra antes de chegar (ou não) à aplicação. A aplicação, também chamada de backend ou servidor de aplicação (Node.js, PHP-FPM, Tomcat, Gunicorn), executa a lógica de negócio. O servidor web cuida de tudo o que está ao redor dela. Um servidor web moderno assume, tipicamente, seis funções:",
      "- **Servir conteúdo estático**: entrega HTML, CSS, JavaScript, imagens e vídeos direto do disco, sem acionar código de aplicação.",
      "- **Fazer proxy para aplicações dinâmicas**: encaminha requisições para PHP-FPM, Tomcat, Node.js, Gunicorn e similares.",
      "- **Balancear carga**: distribui as requisições entre vários servidores de aplicação.",
      "- **Terminar TLS**: gerencia certificados e criptografia em um ponto central, em vez de espalhar essa tarefa por cada instância.",
      "- **Fazer cache**: guarda respostas já produzidas para entregá-las mais rápido depois, sem repetir o trabalho.",
      "- **Controlar acesso e segurança**: filtra tráfego malicioso e aplica autenticação antes que o ataque chegue perto da aplicação.",
      "O Apache HTTP Server teve seu primeiro lançamento em 1995, então a categoria tem mais de três décadas de uso. Quando o servidor web responde antes de qualquer aplicação existir (por exemplo, um 404 para um arquivo inexistente), ele mostra que é uma camada própria, e o cabeçalho `Server` da resposta identifica qual software atendeu. As etapas seguintes aprofundam cada função: proxy na Etapa 03, MPMs do Apache na Etapa 04, arquitetura do Nginx na Etapa 05 e balanceamento na Etapa 06.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "Servidor web",
        d: "software na borda que recebe as requisições HTTP e decide se responde sozinho ou encaminha à aplicação.",
        color: "blue",
      },
      {
        t: "Backend",
        d: "o processo que executa a regra de negócio; não deveria cuidar de TLS, arquivos estáticos nem filtragem de tráfego.",
        color: "signal",
      },
      {
        t: "Conteúdo estático",
        d: "arquivo pronto servido direto do disco, sem código de aplicação.",
        color: "violet",
      },
      {
        t: "Proxy para aplicação dinâmica",
        d: "o servidor web repassa ao backend o que só ele sabe responder.",
        color: "ember",
      },
      {
        t: "Terminação TLS",
        d: "a criptografia é aberta em um único ponto, e a renovação de certificado deixa de tocar na aplicação.",
        color: "blue",
      },
      {
        t: "Cabeçalho `Server`",
        d: "identifica o software que respondeu e permite descobrir rapidamente quem está na frente.",
        color: "signal",
      },
    ],
    examplesTitle: "Um servidor web mínimo e o cabeçalho Server",
    examples: [
      {
        label: "default.conf",
        lang: "sh",
        code: '# default.conf\nserver {\n    listen 80;                       # a porta que o Nginx escuta\n    server_name localhost;           # o nome que este bloco atende\n\n    location / {                     # regra para todas as URLs que começam com "/"\n        root /usr/share/nginx/html;  # a pasta onde estão os arquivos estáticos\n        index index.html;            # arquivo servido quando a URL termina em "/"\n    }\n}',
        intro:
          "O bloco abaixo mostra a sintaxe de uma configuração Nginx que serve uma página estática. Ele é ilustrativo: a imagem oficial do Nginx já sobe com uma configuração equivalente, então você não precisa criar este arquivo para fazer o exercício desta etapa.",
        note: "Cada `location` é uma regra de roteamento. Aqui não há aplicação nenhuma por trás: é conteúdo estático servido diretamente pelo servidor web. O comando `curl -I` mostra só os cabeçalhos da resposta, e o `Server` revela quem atendeu.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# saída aproximada: as versões variam\n$ curl -I http://localhost:8080\nHTTP/1.1 200 OK\nServer: nginx/1.xx.x\nContent-Type: text/html\nContent-Length: 615\n\n$ curl -I http://localhost:8081\nHTTP/1.1 200 OK\nServer: Apache/2.4.xx (Unix)\nContent-Type: text/html",
        note: "São dois softwares diferentes cumprindo a mesma tarefa (entregar uma página), e ambos responderam antes de qualquer aplicação existir.",
      },
    ],
    commands: [
      {
        cmd: "docker run -d --name nginx-lab -p 8080:80 nginx:stable",
        note: "sobe um Nginx de exemplo na porta 8080 (a tag `stable` é móvel; fixe a versão quando precisar reproduzir um resultado)",
      },
      {
        cmd: "docker run -d --name apache-lab -p 8081:80 httpd:2.4",
        note: "sobe um Apache de exemplo na porta 8081",
      },
      {
        cmd: "curl -I http://localhost:8080",
        note: "mostra só os cabeçalhos, sem baixar o corpo",
      },
      {
        cmd: "curl -I http://localhost:8080/nao-existe",
        note: "confirma o 404 vindo do servidor web",
      },
      {
        cmd: "docker logs nginx-lab",
        note: "mostra o registro de acessos que o próprio servidor web mantém",
      },
    ],
    handsOn: [
      "Suba os dois containers: `docker run -d --name nginx-lab -p 8080:80 nginx:stable` e `docker run -d --name apache-lab -p 8081:80 httpd:2.4`.",
      "Rode `curl -I http://localhost:8080` e `curl -I http://localhost:8081`. **Observe** o cabeçalho `Server` de cada um e o `200 OK`.",
      "Peça um caminho que não existe (`curl -I http://localhost:8080/nao-existe`) e **observe** o `404 Not Found`. Essa resposta veio do servidor web, sem nenhuma aplicação ter sido acionada.",
      "Rode `docker logs nginx-lab` e **observe** as linhas de acesso com as suas requisições, inclusive a que resultou em 404.",
      "Limpe: `docker rm -f nginx-lab apache-lab`.",
    ],
    tip: "Use `curl -I` para inspecionar só os cabeçalhos. É o jeito mais rápido de descobrir qual servidor está respondendo antes de aprofundar uma investigação. Lembre que o cabeçalho `Server` também informa a versão do software, o que é útil para você e para quem ataca; a Etapa 14 mostra como ocultar a versão.",
    takeaway:
      "Um servidor web não executa a regra de negócio: ele cuida de tudo ao redor dela (estático, proxy, TLS, cache, segurança) para que a aplicação não precise cuidar disso.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa01-conteudo-estatico.svg",
            alt: "Três clientes ligados pela rede a um processo de servidor HTTP, que lê os arquivos de um sistema de arquivos.",
            caption:
              "Servir conteúdo estático: o processo do servidor HTTP lê o arquivo do disco e o devolve ao cliente, sem acionar código de aplicação.",
          },
        ],
        credit: "Diagrama: Wikimedia Commons, Giga Bang, CC BY-SA 4.0",
      },
    ],
  },
  {
    id: "m2",
    num: "02",
    navTitle: "HTTP 1.1 → 2 → 3",
    tag: "evolução do protocolo",
    title: "HTTP e sua evolução, de 1.1 a HTTP/3",
    lead: "Duas cenas explicam por que o HTTP precisou evoluir. Na primeira, a página de um produto de e-commerce carrega o HTML principal e mais 40 miniaturas de imagem. Mesmo com conexões persistentes (keep-alive), o HTTP/1.1 processa uma requisição de cada vez dentro de uma conexão: a segunda imagem só começa a baixar depois que a resposta da primeira terminar de chegar. Os navegadores contornam parcialmente isso abrindo várias conexões TCP em paralelo com o mesmo domínio (em geral cerca de seis), mas isso apenas troca um custo por outro, porque agora há várias conexões para gerenciar.\n\nNa segunda cena, mesmo com a primeira resolvida, um usuário em uma rede móvel instável ainda sente lentidão. Basta um único pacote se perder no caminho para que o carregamento inteiro trave até a retransmissão chegar, mesmo que todos os outros pacotes já tenham chegado ao destino.\n\nA primeira cena motivou o HTTP/2. A segunda motivou o HTTP/3.",
    concept: [
      "Antes das versões, um fato estrutural: o HTTP é um protocolo **sem estado** (stateless). Cada requisição é tratada de forma independente, sem memória das anteriores. Isso simplifica a escala, mas exige mecanismos por cima do protocolo (cookies e sessões) para manter o contexto de um mesmo usuário.",
      "- **HTTP/1.1 (1997)**: introduziu conexões persistentes (keep-alive), permitindo várias requisições e respostas na mesma conexão TCP e reduzindo o custo de abrir uma conexão nova por recurso. A limitação é o **head-of-line blocking**: se a primeira requisição demora, as seguintes na mesma conexão esperam.",
      "- **HTTP/2 (2015)**: resolve o head-of-line blocking da primeira cena, na camada de aplicação. Várias requisições e respostas (streams) trafegam ao mesmo tempo pela mesma conexão TCP, sem uma bloquear a outra. Também trouxe priorização de recursos, compressão de cabeçalhos (HPACK) e o Server Push, que caiu em desuso porque os principais navegadores removeram ou restringiram o suporte, já que o ganho raramente compensava a complexidade. Na web, o HTTP/2 é usado sobre TLS, e cliente e servidor combinam a versão durante o handshake TLS (extensão ALPN).",
      "- **HTTP/3 (QUIC sobre UDP)**: o HTTP/2 resolveu o problema na aplicação, mas o TCP garante que os bytes cheguem em ordem estrita. Se um pacote se perde, tudo o que veio depois dele espera a retransmissão, mesmo que pertença a outro stream. O HTTP/3 troca o TCP pelo QUIC, que roda sobre UDP: cada stream é independente, e a perda de um pacote só atrasa o stream afetado. O QUIC também combina o handshake de transporte com o de TLS 1.3, o que tende a estabelecer a conexão mais rápido. O ganho é maior em redes com perda de pacotes ou latência alta, como conexões móveis.",
      "Na prática, o cliente descobre que o servidor oferece HTTP/3 pelo cabeçalho de resposta `Alt-Svc`. Redes que bloqueiam UDP na porta 443 fazem o cliente voltar para HTTP/2 ou HTTP/1.1.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "Stateless",
        d: "cada requisição é independente; cookies e sessões simulam contexto por cima.",
        color: "blue",
      },
      {
        t: "Keep-alive (HTTP/1.1)",
        d: "reaproveita a conexão TCP, mas atende uma requisição por vez nela.",
        color: "signal",
      },
      {
        t: "Head-of-line blocking",
        d: "um item lento segura os que vêm depois dele na mesma fila.",
        color: "violet",
      },
      {
        t: "Multiplexação (HTTP/2)",
        d: "vários streams na mesma conexão TCP; resolve o bloqueio na aplicação.",
        color: "ember",
      },
      {
        t: "QUIC (HTTP/3)",
        d: "streams independentes sobre UDP; resolve o bloqueio no transporte.",
        color: "blue",
      },
      {
        t: "ALPN e Alt-Svc",
        d: "ALPN negocia h2 durante o handshake TLS; `Alt-Svc` anuncia o HTTP/3.",
        color: "signal",
      },
    ],
    examplesTitle: "Perguntando ao curl qual versão foi negociada",
    examples: [
      {
        label: "terminal",
        lang: "sh",
        code: "# Deixa o curl negociar livremente e mostra a versão usada (saída aproximada)\n$ curl -so /dev/null -w 'Protocolo negociado: HTTP/%{http_version}\\n' https://www.cloudflare.com\nProtocolo negociado: HTTP/2\n\n# Força HTTP/1.1, mesmo que o servidor suporte versões mais novas\n$ curl --http1.1 -so /dev/null -w 'Protocolo negociado: HTTP/%{http_version}\\n' https://www.cloudflare.com\nProtocolo negociado: HTTP/1.1\n\n# Força HTTP/3 (exige um curl compilado com suporte a QUIC)\n$ curl --http3 -so /dev/null -w 'Protocolo negociado: HTTP/%{http_version}\\n' https://www.cloudflare.com\nProtocolo negociado: HTTP/3",
        note: "Nem todo `curl` vem com suporte a HTTP/3 (depende de uma biblioteca QUIC). Rode `curl --version | grep -i http3` para conferir antes de usar `--http3`. Os resultados dependem de o domínio escolhido suportar cada versão e de a sua rede permitir UDP. Para ver a negociação acontecer em um servidor seu, sem depender da internet, suba um Nginx com HTTP/2 usando um certificado autoassinado.",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: '# Gera um certificado autoassinado de laboratório (válido por 30 dias)\n$ mkdir -p certs\n$ openssl req -x509 -newkey rsa:2048 -nodes -days 30 -subj "/CN=localhost" \\\n    -keyout certs/key.pem -out certs/cert.pem',
      },
      {
        label: "h2.conf",
        lang: "sh",
        code: '# h2.conf\nserver {\n    listen 443 ssl;                              # escuta HTTPS na porta 443 do container\n    http2 on;                                    # habilita HTTP/2 (nginx 1.25.1 ou superior)\n    ssl_certificate     /etc/nginx/certs/cert.pem;      # certificado\n    ssl_certificate_key /etc/nginx/certs/key.pem;       # chave privada\n    default_type text/plain;                     # tipo da resposta de teste\n\n    location / {\n        return 200 "ola\\n";                      # resposta fixa, sem backend\n    }\n}',
      },
      {
        label: "terminal (3)",
        lang: "sh",
        code: "# Sobe o Nginx montando a configuração e os certificados\n$ docker run -d --name h2-lab -p 8443:443 \\\n    -v \"$PWD/h2.conf:/etc/nginx/conf.d/default.conf:ro\" \\\n    -v \"$PWD/certs:/etc/nginx/certs:ro\" nginx:stable\n\n# -k aceita o certificado autoassinado\n$ curl -sk -o /dev/null -w 'HTTP/%{http_version}\\n' https://localhost:8443/\nHTTP/2\n\n$ curl -sk --http1.1 -o /dev/null -w 'HTTP/%{http_version}\\n' https://localhost:8443/\nHTTP/1.1",
      },
    ],
    commands: [
      {
        cmd: "curl -so /dev/null -w 'HTTP/%{http_version}\\n' <url>",
        note: "mostra a versão negociada",
      },
      {
        cmd: "curl --http1.1 <url>",
        note: "força HTTP/1.1",
      },
      {
        cmd: "curl --http2 <url>",
        note: "pede HTTP/2",
      },
      {
        cmd: "curl --http3 <url>",
        note: "força HTTP/3 (exige curl com suporte a QUIC)",
      },
      {
        cmd: "curl --version | grep -i http3",
        note: "confere se o seu curl suporta HTTP/3",
      },
      {
        cmd: "curl -sI https://www.cloudflare.com | grep -i alt-svc",
        note: "mostra o anúncio de HTTP/3 feito pelo servidor (depende do domínio)",
      },
      {
        cmd: "docker restart h2-lab",
        note: "reinicia o container quando uma edição do `h2.conf` não aparece depois do reload",
      },
    ],
    handsOn: [
      "Escolha um domínio que suporte HTTP/2 (por exemplo, `www.cloudflare.com`) e rode os dois primeiros comandos do exemplo. **Observe** o valor de `%{http_version}` mudando conforme a flag.",
      'Rode `curl -v --http2 https://www.cloudflare.com 2>&1 | grep -i "HTTP/2"` e **observe** a linha que confirma a versão negociada no handshake.',
      "Se o seu curl tiver suporte a HTTP/3, repita com `--http3` e compare `-w '%{time_total}\\n'` nas três variantes. Não espere uma diferença grande em uma rede estável.",
      "Gere o certificado, crie `h2.conf` e suba o `h2-lab`. **Observe** `HTTP/2` na primeira chamada e `HTTP/1.1` com `--http1.1`.",
      "Apague a linha `http2 on;` do `h2.conf` local e rode `docker exec h2-lab nginx -s reload`. Repita o `curl` sem flag e **observe** que a versão volta a ser `HTTP/1.1`, porque o servidor deixou de oferecer h2 no handshake. Atenção: o arquivo é montado individualmente no container, e alguns editores e o `sed -i` substituem o arquivo por um novo em vez de alterar o original. Nesse caso o container continua vendo a versão antiga e o `reload` parece não fazer nada; rode `docker restart h2-lab` e repita o teste.",
      "Limpe: `docker rm -f h2-lab`.",
    ],
    tip: "O HTTP/2 eliminou a fila na camada de aplicação, e o HTTP/3 resolveu o mesmo problema na camada de transporte. Ao diagnosticar lentidão, pergunte primeiro em qual camada a espera acontece.",
    takeaway:
      "Cada versão do HTTP resolveu o head-of-line blocking em uma camada diferente: o HTTP/2 na aplicação, com multiplexação, e o HTTP/3 no transporte, trocando TCP por QUIC sobre UDP.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa02-tcp-streams.png",
            alt: "Dois computadores ligados por uma única corrente cujos elos alternam entre vermelho e verde.",
            caption:
              "HTTP/2: os streams vermelho e verde dividem a mesma conexão TCP. Se um elo se perde, tudo o que vem depois dele espera a retransmissão, seja de qual stream for.",
          },
          {
            src: "/guides/servidores-web/etapa02-quic-streams.png",
            alt: "Dois computadores ligados por duas correntes separadas, uma amarela e uma azul.",
            caption:
              "HTTP/3: no QUIC, cada stream é uma corrente independente, e a perda de um elo só atrasa a corrente em que ele estava.",
          },
        ],
        credit: "Ilustração: HTTP/3 explained, Daniel Stenberg e colaboradores, CC BY 4.0",
      },
      {
        items: [
          {
            src: "/guides/servidores-web/etapa02-pilha-http.svg",
            alt: "Três pilhas lado a lado sobre IPv4/IPv6 e sob a camada HTTP Semantics: HTTP 1.1 sobre TLS opcional e TCP; HTTP/2 sobre TLS 1.2+ e TCP; HTTP/3 sobre QUIC, que inclui o TLS 1.3, e UDP.",
            caption:
              "O significado de métodos, cabeçalhos e códigos de status é o mesmo nas três versões; o que muda é o transporte. O HTTP/3 troca o TCP pelo QUIC sobre UDP, e o TLS 1.3 passa a fazer parte do QUIC.",
          },
        ],
        credit: "Diagrama: Wikimedia Commons, Sedrubal, CC BY-SA 4.0",
      },
    ],
  },
  {
    id: "m3",
    num: "03",
    navTitle: "Forward x Reverse Proxy",
    tag: "intermediários",
    title: "Forward proxy e reverse proxy",
    lead: "Duas necessidades simétricas, uma do lado do cliente e outra do lado do servidor. No lado do cliente, uma empresa quer que todo o tráfego de saída dos funcionários passe por um ponto de controle único, para bloquear sites indesejados, registrar acessos por conformidade e evitar que o IP interno de cada máquina fique exposto diretamente à internet.\n\nNo lado do servidor, a mesma empresa mantém cinco servidores de aplicação atrás de um único domínio público. Não faz sentido expor o IP de cada servidor, repetir a configuração do certificado TLS em cada um deles, nem deixar cada servidor decidir sozinho se aguenta mais uma conexão.\n\nSão duas necessidades diferentes com uma peça em comum: um intermediário entre quem pede e quem responde. A diferença está em qual lado o intermediário representa e protege.",
    concept: [
      "**Forward proxy, o intermediário de saída.** Fica entre um cliente (geralmente em uma rede privada) e a internet, e é configurado explicitamente no lado do cliente (navegador, sistema operacional ou aplicação). O fluxo é este: o cliente envia a requisição ao proxy indicando o destino; o proxy analisa e decide se encaminha ou bloqueia; se encaminha, faz a requisição em nome do cliente; a resposta volta ao proxy, que a repassa ao cliente. Para HTTPS, o cliente pede ao proxy um túnel (método `CONNECT`), e o proxy só enxerga o conteúdo se fizer inspeção de TLS. Casos de uso: segurança e conformidade, controle de conteúdo, anonimato (mascarar o IP do cliente) e cache. O Squid é um exemplo de software que cumpre esse papel.",
      "**Reverse proxy, o intermediário de entrada.** Fica na borda da infraestrutura, recebe as requisições da internet e as distribui para os servidores de aplicação atrás dele. É transparente para o cliente, que nem sabe que ele existe. O fluxo: o cliente envia a requisição ao IP público do proxy; com base em regras, o proxy escolhe o backend; encaminha a requisição; o backend responde ao proxy; o proxy entrega a resposta ao cliente. Funções principais: balanceamento de carga, terminação TLS centralizada (tirando essa carga dos backends), cache, uma primeira camada de segurança, compressão (Gzip ou Brotli) e roteamento entre serviços. Sobre a segurança, o proxy puro filtra certos padrões de tráfego, mas bloquear ataques como XSS normalmente exige regras de WAF (Etapa 14).",
      "A regra prática para distinguir os dois: pergunte quem configurou o apontamento para o intermediário. Se foi o cliente, é forward proxy. Se foi a infraestrutura do servidor e o cliente não sabe, é reverse proxy.",
      "Há uma consequência para o backend: ele só enxerga o proxy abrindo a conexão. Para saber quem fez o pedido de verdade, o proxy repassa o IP do cliente em cabeçalhos como `X-Real-IP` e `X-Forwarded-For` (não padronizados, mas amplamente usados; o cabeçalho padronizado é o `Forwarded`). O backend só deve confiar nesses cabeçalhos quando vierem de um proxy conhecido, porque um cliente pode enviá-los forjados.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "Forward proxy",
        d: "do lado do cliente, configurado por ele, representa o cliente perante a internet.",
        color: "blue",
      },
      {
        t: "Reverse proxy",
        d: "do lado do servidor, configurado pela infraestrutura, transparente ao cliente.",
        color: "signal",
      },
      {
        t: "upstream",
        d: "o grupo de backends para onde o reverse proxy encaminha.",
        color: "violet",
      },
      {
        t: "proxy_pass",
        d: "a diretiva do Nginx que encaminha a requisição ao backend.",
        color: "ember",
      },
      {
        t: "X-Real-IP e X-Forwarded-For",
        d: "cabeçalhos que carregam o IP do cliente original até o backend.",
        color: "blue",
      },
      {
        t: "Host",
        d: "sem `proxy_set_header Host`, o Nginx envia ao backend o nome do upstream, e não o domínio que o cliente usou.",
        color: "signal",
      },
    ],
    examplesTitle: "Reverse proxy Nginx e forward proxy Squid no mesmo laboratório",
    examples: [
      {
        label: "backend.py",
        lang: "sh",
        code: '# backend.py\nimport os\nimport time\nfrom http.server import BaseHTTPRequestHandler, ThreadingHTTPServer\n\nNAME = os.environ.get("NAME", "backend")      # nome devolvido nas respostas\nPORT = int(os.environ.get("PORT", "3000"))    # porta de escuta\nDELAY = float(os.environ.get("DELAY", "0"))   # atraso artificial, em segundos\n\n\nclass Handler(BaseHTTPRequestHandler):\n    protocol_version = "HTTP/1.1"             # permite conexões persistentes\n\n    def responder(self, com_corpo):\n        if self.path == "/slow":\n            time.sleep(10)                    # simula um backend travado\n        elif self.path != "/healthz":\n            time.sleep(DELAY)                 # simula um backend lento\n        if self.path.endswith("/headers"):\n            linhas = [f"peer: {self.client_address[0]}"]   # quem abriu a conexão TCP\n            linhas += [f"{k}: {v}" for k, v in self.headers.items()]\n            corpo = "\\n".join(linhas) + "\\n"\n        else:\n            corpo = f"{NAME} recebeu {self.path}\\n"\n        dados = corpo.encode()\n        self.send_response(200)\n        self.send_header("Content-Length", str(len(dados)))\n        self.end_headers()\n        if com_corpo:                         # HEAD não envia corpo\n            self.wfile.write(dados)\n\n    def do_GET(self):\n        self.responder(True)\n\n    def do_HEAD(self):\n        self.responder(False)\n\n\nThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()',
        intro:
          "Primeiro, um backend didático em Python (só biblioteca padrão). Ele devolve o próprio nome, o caminho recebido e, em `/headers`, os cabeçalhos que chegaram e o IP de quem abriu a conexão. Este mesmo `backend.py` será reaproveitado nas etapas seguintes.",
      },
      {
        label: "nginx.conf",
        lang: "sh",
        code: "# nginx.conf\nupstream backend_app {\n    server backend:3000;             # nome do serviço no Compose, resolvido pelo DNS do Docker\n}\n\nserver {\n    listen 80;\n    server_name localhost;\n\n    location / {\n        proxy_pass http://backend_app;                     # encaminha a requisição ao backend\n        proxy_set_header Host $host;                       # preserva o domínio pedido pelo cliente (sem a porta)\n        proxy_set_header X-Real-IP $remote_addr;           # informa o IP do cliente ao backend\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # cadeia de IPs, se houver mais de um proxy\n    }\n}",
      },
      {
        label: "squid.conf",
        lang: "sh",
        code: "# squid.conf\nhttp_port 3128                                  # porta em que o proxy escuta\nvisible_hostname squid-lab                      # nome usado no cabeçalho Via\nacl rede_lab src 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16   # redes privadas, onde ficam os clientes do laboratório\nhttp_access allow rede_lab                      # libera quem vem dessas redes\nhttp_access deny all                            # nega todo o resto",
      },
      {
        label: "compose.yaml",
        lang: "yaml",
        code: '# compose.yaml\nservices:\n  backend:\n    image: python:3.12-alpine                   # imagem pequena com Python\n    command: ["python", "/app/backend.py"]      # executa o backend didático\n    environment:\n      NAME: app                                 # nome devolvido nas respostas\n    volumes:\n      - ./backend.py:/app/backend.py:ro         # monta o script em modo somente leitura\n  nginx:\n    image: nginx:stable                         # o reverse proxy\n    ports:\n      - "8080:80"                               # único ponto de entrada publicado para o backend\n    volumes:\n      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro   # substitui a configuração padrão\n    depends_on:\n      - backend                                 # sobe o backend antes do proxy\n  squid:\n    image: ubuntu/squid                         # o forward proxy\n    ports:\n      - "3128:3128"                             # porta do proxy para o seu terminal\n    volumes:\n      - ./squid.conf:/etc/squid/squid.conf:ro   # configuração mínima de laboratório',
        note: "Sem os cabeçalhos `X-Real-IP` e `X-Forwarded-For`, o backend enxergaria toda requisição como vinda do próprio Nginx. O cabeçalho `Server` da resposta continua sendo `nginx`, mesmo com o conteúdo gerado pelo Python: essa transparência é o que caracteriza o reverse proxy.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ docker compose up -d\n$ curl -s http://localhost:8080/headers\n# saída aproximada: IPs e versões variam\npeer: 172.18.0.3\nHost: localhost\nX-Real-IP: 172.18.0.1\nX-Forwarded-For: 172.18.0.1\nConnection: close\nUser-Agent: curl/8.x\n\n# O backend não é publicado: de fora, só o proxy responde\n$ curl -sI http://localhost:8080/\nHTTP/1.1 200 OK\nServer: nginx/1.xx.x\n\n# Forward proxy: aqui é o cliente que aponta explicitamente para o intermediário\n$ curl -s -x http://localhost:3128 http://backend:3000/headers\n# saída aproximada\npeer: 172.18.0.4\nHost: backend:3000\nVia: 1.1 squid-lab (squid/x.y)\nX-Forwarded-For: 172.18.0.1\n\n# Sem o proxy, o seu terminal nem consegue resolver o nome do backend\n$ curl -s http://backend:3000/\ncurl: (6) Could not resolve host: backend",
        note: "Observe que, no forward proxy, quem abre a conexão com o backend é o Squid (`peer` mostra o IP do Squid), e o nome `backend` só funciona porque o proxy está dentro da rede do Docker.",
      },
    ],
    commands: [
      {
        cmd: "docker compose up -d",
        note: "sobe backend, Nginx e Squid em segundo plano",
      },
      {
        cmd: "docker compose exec nginx nginx -t",
        note: "valida a sintaxe da configuração antes de aplicar",
      },
      {
        cmd: "docker compose exec nginx nginx -s reload",
        note: "recarrega a configuração sem derrubar conexões existentes",
      },
      {
        cmd: "docker compose restart nginx",
        note: "reinicia o Nginx quando uma edição do `nginx.conf` não aparece depois do reload",
      },
      {
        cmd: "curl -s http://localhost:8080/headers",
        note: "mostra o que o backend recebeu pelo proxy",
      },
      {
        cmd: "curl -s -x http://localhost:3128 http://backend:3000/headers",
        note: "usa o forward proxy explicitamente",
      },
    ],
    handsOn: [
      "Crie a pasta `etapa03/` com `backend.py`, `nginx.conf`, `squid.conf` e `compose.yaml`, e rode `docker compose up -d`. Confirme os três serviços com `docker compose ps`.",
      "Rode `curl -s http://localhost:8080/headers` e **observe** `X-Real-IP`, `X-Forwarded-For` e `Host: localhost`. Em seguida rode `curl -sI http://localhost:8080/` e **observe** `Server: nginx`, mesmo com o conteúdo vindo do Python.",
      "Apague a linha `proxy_set_header Host $host;` do `nginx.conf`, rode `docker compose exec nginx nginx -s reload` e repita o `/headers`. **Observe** `Host: backend_app`, o nome do upstream, em vez do domínio que o cliente pediu. Atenção: o `nginx.conf` é montado como arquivo único, e alguns editores e o `sed -i` o substituem por um arquivo novo, o que deixa o container vendo a versão antiga. Se a mudança não aparecer depois do reload, rode `docker compose restart nginx`.",
      "Restaure a linha, apague `proxy_set_header X-Real-IP $remote_addr;`, recarregue e repita. **Observe** que `X-Real-IP` desaparece, mas o `X-Forwarded-For` continua trazendo o IP do cliente, e que `peer` mostra o IP do Nginx (o `peer` sempre foi o Nginx, porque é ele quem abre a conexão com o backend). Apague também a linha do `X-Forwarded-For`, recarregue e repita: sem os dois cabeçalhos, o backend só enxerga o Nginx.",
      "Restaure as linhas e rode `curl -s -x http://localhost:3128 http://backend:3000/headers`. **Observe** os cabeçalhos `Via` e `X-Forwarded-For` acrescentados pelo Squid. Compare com `curl -s http://backend:3000/`, que falha ao resolver o nome.",
      "Limpe: `docker compose down`.",
    ],
    tip: "Para saber de que lado você está, pergunte quem configurou o apontamento: se foi o cliente, é forward proxy; se o cliente não sabe que o intermediário existe, é reverse proxy. Em produção, configure o backend para confiar em `X-Forwarded-For` apenas quando a conexão vier do seu proxy, porque o cabeçalho pode ser forjado por qualquer cliente.",
    takeaway:
      "O forward proxy fica do lado do cliente e é configurado por ele; o reverse proxy fica do lado do servidor e é invisível ao cliente, e o IP original só chega ao backend se o proxy o repassar em cabeçalhos.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa03-forward-proxy.svg",
            alt: "Um usuário e um proxy dentro da rede interna; o usuário fala com o proxy, e o proxy fala com example.com na internet.",
            caption:
              "Forward proxy: o proxy fica na rede do cliente, e é o cliente que o usa para sair. O site externo só enxerga o proxy.",
          },
          {
            src: "/guides/servidores-web/etapa03-reverse-proxy.svg",
            alt: "A internet fala com um proxy dentro da rede interna de example.com, e o proxy fala com o servidor web.",
            caption:
              "Reverse proxy: o proxy fica na rede do servidor, e quem vem da internet fala só com ele, sem saber qual servidor respondeu.",
          },
        ],
        credit: "Diagramas: Wikimedia Commons, H2g2bob, CC0 (domínio público)",
      },
    ],
  },
  {
    id: "m4",
    num: "04",
    navTitle: "Apache & MPMs",
    tag: "processos + threads",
    title: "Apache HTTP Server e os modelos de processamento (MPMs)",
    lead: "Primeiro cenário: um e-commerce roda Apache com o modelo mais antigo de processamento e recebe um pico de 5.000 conexões simultâneas em uma promoção. Como cada conexão ganha um processo do sistema operacional inteiramente próprio, o servidor tenta abrir milhares de processos, cada um consumindo dezenas de megabytes só para existir. A memória se esgota, o sistema começa a usar swap em disco e o site trava justamente no pico de vendas.\n\nSegundo cenário, oposto: a mesma empresa depende de um módulo antigo, escrito sem cuidado de concorrência (não thread-safe), que precisa continuar funcionando. Trocar para um modelo baseado em threads que compartilham memória faria esse módulo corromper dados ou derrubar o processo de forma imprevisível.\n\nUm cenário pede leveza para escalar, o outro pede isolamento total para sobreviver. O Apache resolve essa tensão deixando você escolher o modelo de concorrência, os MPMs (Multi-Processing Modules).",
    concept: [
      "Antes dos modelos, dois termos. Um **processo** tem memória própria e isolada dos demais; se ele falha, os outros seguem. Uma **thread** vive dentro de um processo e compartilha a memória dele com as outras threads, o que a torna mais leve e mais perigosa: um erro grave em uma thread pode corromper o processo inteiro. Código que funciona corretamente quando várias threads o executam ao mesmo tempo é chamado de thread-safe.",
      "- **Prefork (sem threads)**: um processo filho independente atende cada conexão, completamente isolado dos demais. Vantagens: muito estável (um problema em um processo não afeta os outros), compatível com módulos não thread-safe e com software legado. Desvantagens: alto consumo de memória e pouca escalabilidade sob alta concorrência. É comum ver o Prefork com o `mod_php` (PHP embutido no processo do Apache, historicamente não thread-safe). A alternativa é rodar o PHP como processo separado, o PHP-FPM, com o Apache falando com ele por proxy (`mod_proxy_fcgi`, o mesmo conceito da Etapa 03), o que permite usar um MPM mais leve sem perder compatibilidade.",
      "- **Worker (com threads)**: cria vários processos filhos, cada um com várias threads, e cada thread atende uma conexão. Usa menos memória que o Prefork e suporta mais concorrência. Como as threads de um processo compartilham memória, um erro grave em uma delas pode derrubar o processo filho que a hospeda e as conexões que ele atendia; os demais filhos e o processo mestre continuam de pé. Por isso os módulos precisam ser thread-safe.",
      "- **Event (recomendado para a maioria dos deployments novos)**: parte do Worker, mas otimizado para o caso comum de conexões keep-alive abertas e ociosas. Uma thread dedicada consegue vigiar várias conexões que só estão esperando, sem prender uma thread de trabalho a cada conexão parada. Mantém a exigência de módulos thread-safe e é o MPM indicado para HTTP/2, que o Apache oferece pelo módulo `mod_http2` (habilitado com `a2enmod http2` e `Protocols h2 http/1.1`).",
      "Dois pontos de leitura da comparação: o consumo de memória cresce na ordem Event, Worker, Prefork, e a concorrência suportada cresce na ordem inversa. A escolha, portanto, é sempre uma troca entre isolamento e eficiência.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "MPM",
        d: "o módulo que define como o Apache atende conexões em paralelo (processos, threads ou ambos).",
        color: "blue",
      },
      {
        t: "Prefork",
        d: "um processo por conexão; isolamento total, memória alta, concorrência baixa; serve a módulos não thread-safe.",
        color: "signal",
      },
      {
        t: "Worker",
        d: "poucos processos com várias threads; memória média, concorrência alta; exige módulos thread-safe.",
        color: "violet",
      },
      {
        t: "Event",
        d: "como o Worker, mas não prende uma thread a conexões keep-alive ociosas; memória baixa, concorrência muito alta.",
        color: "ember",
      },
      {
        t: "Thread-safe",
        d: "código que tolera execução simultânea por várias threads no mesmo processo.",
        color: "blue",
      },
      {
        t: "PHP-FPM",
        d: "PHP como processo separado, que permite sair do Prefork sem abandonar PHP.",
        color: "signal",
      },
    ],
    examplesTitle: "Descobrindo e trocando o MPM ativo",
    examples: [
      {
        label: "terminal",
        lang: "sh",
        code: "# Mostra o MPM em uso (saída resumida)\n$ apachectl -V | grep -i mpm\nServer MPM:     event\n\n# Em Debian e Ubuntu, a2query mostra o módulo MPM habilitado\n$ sudo a2query -M\nevent\n\n# Troca para o Prefork (por exemplo, para rodar um módulo legado não thread-safe)\n$ sudo a2dismod mpm_event      # desabilita o MPM atual\n$ sudo a2enmod mpm_prefork     # habilita o Prefork\n$ sudo systemctl restart apache2\n\n$ sudo a2query -M\nprefork",
        intro:
          "Em um Apache instalado no host (Debian ou Ubuntu), `apachectl` e `a2query` informam o MPM ativo, e `a2dismod` e `a2enmod` fazem a troca.",
        note: "Em distribuições baseadas em RHEL, a troca é feita comentando e descomentando as linhas `LoadModule mpm_*_module` em `/etc/httpd/conf.modules.d/00-mpm.conf`, e o serviço se chama `httpd`.",
      },
      {
        label: "mpm_event.conf",
        lang: "sh",
        code: "# /etc/apache2/mods-available/mpm_event.conf\n# Trecho ilustrativo: ajuste os valores ao seu tráfego real\n<IfModule mpm_event_module>\n    StartServers             3     # processos filhos criados na inicialização\n    MinSpareThreads         75     # threads ociosas mínimas mantidas em reserva\n    MaxSpareThreads        250     # teto de threads ociosas; acima disso o Apache encerra processos\n    ThreadsPerChild         25     # threads em cada processo filho\n    MaxRequestWorkers      400     # requisições processadas ao mesmo tempo (16 processos x 25 threads)\n</IfModule>",
        note: "O número 400 não é arbitrário: `MaxRequestWorkers` precisa caber em `ServerLimit` (16 por padrão) multiplicado por `ThreadsPerChild`, que aqui dá 16 x 25 = 400. No Event, conexões ociosas em keep-alive não ocupam uma dessas threads de trabalho cada. Para praticar sem alterar o seu computador, o mesmo contraste pode ser feito com a imagem oficial `httpd`, escolhendo o MPM na construção da imagem.",
      },
      {
        label: "Dockerfile",
        lang: "sh",
        code: "# Dockerfile\nFROM httpd:2.4\nARG MPM=event\n# 1) comenta a linha do MPM event; 2) descomenta a linha do MPM pedido em MPM\nRUN sed -i \\\n      -e 's/^LoadModule mpm_event_module/#LoadModule mpm_event_module/' \\\n      -e \"s/^#LoadModule mpm_${MPM}_module/LoadModule mpm_${MPM}_module/\" \\\n      /usr/local/apache2/conf/httpd.conf",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "$ docker build --build-arg MPM=event   -t apache-event   .\n$ docker build --build-arg MPM=prefork -t apache-prefork .\n\n$ docker run -d --name apache-event   -p 8081:80 apache-event\n$ docker run -d --name apache-prefork -p 8082:80 apache-prefork\n\n# Lista os módulos carregados e filtra os MPMs (saída aproximada)\n$ docker exec apache-event   httpd -M | grep mpm\n mpm_event_module (shared)\n$ docker exec apache-prefork httpd -M | grep mpm\n mpm_prefork_module (shared)",
      },
    ],
    commands: [
      {
        cmd: "apachectl -V | grep -i mpm",
        note: "mostra o MPM ativo (em algumas distribuições o comando é `httpd -V`)",
      },
      {
        cmd: "sudo a2query -M",
        note: "confirma o módulo MPM habilitado (Debian e Ubuntu)",
      },
      {
        cmd: "sudo a2dismod mpm_event && sudo a2enmod mpm_prefork",
        note: "troca o MPM ativo",
      },
      {
        cmd: "sudo systemctl restart apache2",
        note: "aplica a troca (a troca de MPM exige reinício, não basta recarregar)",
      },
      {
        cmd: "docker exec <container> httpd -M | grep mpm",
        note: "mostra o MPM carregado em um container",
      },
      {
        cmd: "ab -n 50000 -c 100 http://localhost:8081/",
        note: "gera carga de teste (Apache Bench)",
      },
      {
        cmd: "docker top <container>",
        note: "lista os processos do container, vistos do host",
      },
    ],
    handsOn: [
      "Crie a pasta `etapa04/` com o `Dockerfile` acima, construa as duas imagens e suba os dois containers como no exemplo.",
      "Confirme o MPM de cada um com `docker exec <container> httpd -M | grep mpm`. **Observe** `mpm_event_module` e `mpm_prefork_module`.",
      "Em um terminal, rode `ab -n 50000 -c 100 http://localhost:8082/` (Prefork). Em outro, rode várias vezes `docker top apache-prefork | grep -c httpd` durante o teste e **observe** o número de processos crescer.",
      "Repita o passo 3 contra `http://localhost:8081/` (Event) e `apache-event`. **Observe** que o número de processos fica pequeno, porque cada processo comporta várias threads. Compare também `docker stats --no-stream apache-event apache-prefork` ao fim dos testes. Os números exatos variam; o que importa é a diferença de ordem de grandeza nos processos.",
      "Se você tem um Apache instalado no host (`sudo apt install apache2`), troque o MPM com `a2dismod` e `a2enmod`, reinicie o serviço e confirme com `sudo a2query -M`.",
      "Limpe: `docker rm -f apache-event apache-prefork`. As imagens `apache-event` e `apache-prefork` continuam no computador e podem ser reaproveitadas na Etapa 05.",
    ],
    tip: "A diferença entre os três MPMs está em processo, thread e isolamento, e é esse critério que orienta a escolha em produção. Antes de trocar de MPM em um servidor real, verifique se todos os módulos carregados são thread-safe, porque essa é a restrição que decide a escolha.",
    takeaway:
      "Prefork isola cada conexão em um processo e é o mais pesado; Worker usa threads dentro de poucos processos e exige código thread-safe; Event é o Worker afinado para não gastar uma thread em conexões keep-alive ociosas.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa04-mpm.svg",
            alt: "Três colunas. Prefork: um processo pai e três processos filhos, cada um com uma conexão. Worker: dois processos com três threads cada, sobre uma faixa de memória do processo, cada thread com uma conexão. Event: dois processos com duas threads de trabalho e uma thread ouvinte, que segura várias conexões keep-alive ociosas.",
            caption:
              "No Prefork, cada conexão ocupa um processo inteiro. No Worker, threads de poucos processos dividem a memória do processo. No Event, uma thread ouvinte segura as conexões keep-alive ociosas, e as threads de trabalho ficam livres para quem está enviando dados.",
          },
        ],
        credit: "Diagrama: feito para este guia",
      },
    ],
  },
  {
    id: "m5",
    num: "05",
    navTitle: "Nginx event-driven",
    tag: "event loop",
    title: "Nginx e a arquitetura orientada a eventos",
    lead: "Uma aplicação mantém muitas conexões simultâneas, de longa duração e quase sempre ociosas: chat em tempo real, notificações push, keep-alive de APIs de aplicativos móveis. Mesmo com o Event MPM reduzindo o custo das conexões ociosas, o Apache continua reservando uma thread para cada requisição que está sendo processada. Escalar para dezenas de milhares de conexões significa escalar, na mesma proporção, o número de threads e a memória que elas consomem, até esbarrar no limite prático de threads que convivem com eficiência.\n\nO Nginx foi desenhado para esse cenário. Enquanto o Apache nasceu como servidor web tradicional e ganhou modelos de concorrência ao longo do tempo, o Nginx já nasceu com uma arquitetura voltada a servir conteúdo estático e a atuar como proxy reverso sob alta concorrência.",
    concept: [
      "A diferença central é a arquitetura **assíncrona e orientada a eventos**, em vez de um processo ou thread dedicado por conexão.",
      "Um processo **master** lê a configuração e gerencia os processos **worker**, que são os que atendem conexões (o master não atende requisições). Cada worker roda um **event loop**: um laço que espera eventos (dado novo em uma conexão, resposta de um backend, escrita liberada), trata o que ficou pronto e volta ao laço. Quando uma operação de entrada e saída precisaria esperar (ler do disco, aguardar um backend), o worker não fica parado: ele registra o interesse naquele evento e passa a tratar outra conexão. Isso é **I/O não bloqueante**. Quando o evento fica pronto, o worker é notificado e retoma exatamente de onde parou.",
      "No Linux, a notificação de quais conexões têm dado novo vem de um mecanismo do kernel, o `epoll`, que evita varrer todas as conexões a cada ciclo. O Nginx escolhe o método mais eficiente disponível sozinho, então a diretiva `use epoll;` costuma ser opcional no Linux.",
      'O resultado prático é que o número de processos fica estável e pequeno (em geral um worker por núcleo de CPU), enquanto o número de conexões cresce. O limite deixa de ser "uma thread por conexão" e passa a ser CPU, memória e descritores de arquivo. Benefícios: menor consumo de memória, maior vazão, boa latência e desempenho excelente como proxy reverso e balanceador, inclusive na frente do próprio Apache. Cuidado com a conta de capacidade: `worker_processes` vezes `worker_connections` é o teto de conexões simultâneas, mas, quando o Nginx atua como proxy, cada requisição de cliente usa duas conexões (uma com o cliente e uma com o backend), então o número de clientes simultâneos é cerca de metade desse teto. Além disso, `worker_connections` não deve passar do limite de arquivos abertos do processo (ajustável com `worker_rlimit_nofile`).',
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "Event-driven",
        d: "poucos processos tratam muitas conexões reagindo a eventos.",
        color: "blue",
      },
      {
        t: "I/O não bloqueante",
        d: "o worker registra o evento e atende outra conexão em vez de esperar.",
        color: "signal",
      },
      {
        t: "Event loop",
        d: "o laço de cada worker que trata os eventos prontos.",
        color: "violet",
      },
      {
        t: "master e worker",
        d: "o master gerencia; os workers atendem; o número de workers costuma igualar o de núcleos (`worker_processes auto`).",
        color: "ember",
      },
      {
        t: "epoll",
        d: "mecanismo do kernel Linux que avisa quais conexões têm dado novo.",
        color: "blue",
      },
      {
        t: "worker_connections",
        d: "o máximo de conexões simultâneas por worker, contando as conexões com backends.",
        color: "signal",
      },
    ],
    examplesTitle: "Poucos processos, muitas conexões",
    examples: [
      {
        label: "nginx.conf",
        lang: "sh",
        code: "# nginx.conf (trecho principal)\nworker_processes auto;          # um processo worker por núcleo de CPU disponível\n\nevents {\n    worker_connections 1024;    # cada worker aceita até 1024 conexões simultâneas\n    use epoll;                  # opcional no Linux: o Nginx já escolhe o método mais eficiente\n}",
        note: "Em uma máquina de 4 núcleos, essa configuração permite, em teoria, até 4096 conexões simultâneas usando apenas 4 workers (mais o master). Se o Nginx estiver atuando como proxy, conte cerca de metade disso em clientes simultâneos.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# Poucos processos, independentemente de quantas conexões estão ativas (saída aproximada)\n$ docker top nginx-lab\nUID    PID   PPID  C  STIME  TTY  TIME      CMD\nroot   2101  2080  0  10:02  ?    00:00:00  nginx: master process nginx -g daemon off;\n101    2140  2101  0  10:02  ?    00:00:00  nginx: worker process\n101    2141  2101  0  10:02  ?    00:00:00  nginx: worker process\n\n# No host, conta as conexões TCP estabelecidas (inclui todas as conexões do computador)\n$ ss -tn state established | wc -l\n187",
        note: "Um Apache com Prefork ou Worker sob a mesma carga costuma mostrar dezenas ou centenas de processos na mesma listagem.",
      },
    ],
    commands: [
      {
        cmd: "docker run -d --name nginx-lab -p 8080:80 nginx:stable",
        note: "sobe o Nginx de teste",
      },
      {
        cmd: "docker exec nginx-lab nginx -T | grep -E 'worker_processes|worker_connections'",
        note: "mostra os valores efetivos da configuração",
      },
      {
        cmd: "docker top nginx-lab",
        note: "lista o master e os workers",
      },
      {
        cmd: "nproc",
        note: "número de núcleos da máquina, para comparar com o número de workers",
      },
      {
        cmd: "ab -n 50000 -c 200 http://localhost:8080/",
        note: "gera carga com 200 conexões simultâneas",
      },
      {
        cmd: "docker run -d --name apache-prefork -p 8082:80 apache-prefork",
        note: "recria o Apache com Prefork da Etapa 04 (a imagem já existe no computador)",
      },
      {
        cmd: "nginx -t",
        note: "em um Nginx instalado no host, valida a configuração e mostra o caminho do `nginx.conf`",
      },
    ],
    handsOn: [
      "Suba o Nginx de teste com `docker run -d --name nginx-lab -p 8080:80 nginx:stable` e rode `docker exec nginx-lab nginx -T | grep -E 'worker_processes|worker_connections'`. **Observe** `worker_processes auto` e `worker_connections 1024`.",
      "Rode `docker top nginx-lab` e conte os processos worker. Compare com `nproc`: o número de workers costuma ser igual ou próximo ao de núcleos (o container enxerga os núcleos do host).",
      "Rode `ab -n 50000 -c 200 http://localhost:8080/` e, durante o teste, repita `docker top nginx-lab` em outro terminal. **Observe** que o número de processos não muda, mesmo com 200 conexões simultâneas.",
      "O container `apache-prefork` foi apagado no fim da Etapa 04, então recrie-o com `docker run -d --name apache-prefork -p 8082:80 apache-prefork` (a imagem continua no computador; se você a removeu, reconstrua-a com `docker build --build-arg MPM=prefork -t apache-prefork .` na pasta `etapa04/`). Repita a carga em `http://localhost:8082/` e rode `docker top apache-prefork | grep -c httpd`. **Observe** o número de processos crescer junto com a carga, ao contrário do que aconteceu com o Nginx.",
      "Compare o consumo de memória com `docker stats --no-stream nginx-lab apache-prefork`.",
      "Opcional, em um Nginx instalado no host (`sudo apt install nginx`): rode `nginx -t` e `ps aux | grep '[n]ginx'` e repita os passos 2 e 3 contra `http://localhost/`.",
      "Limpe: `docker rm -f nginx-lab apache-prefork`.",
    ],
    tip: "O ponto central é que um worker nunca espera parado: ele registra o evento e segue, e é isso que permite ao Nginx atender muitas conexões sem multiplicar processos. Ao diagnosticar um Nginx saturado, olhe CPU, memória e o limite de arquivos abertos, e não o número de processos, que quase não muda.",
    takeaway:
      "O Apache dedica um processo ou thread a cada requisição em andamento (mesmo otimizado pelo Event MPM); o Nginx usa poucos workers com um event loop não bloqueante, e por isso é muito usado como proxy reverso e balanceador na frente de qualquer backend.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa05-nginx-arquitetura.png",
            alt: "Um processo master acima de três workers; os clientes conversam por HTTP e HTTPS com os workers, que multiplexam conexões via kevent, epoll ou select, falam com servidores web, de aplicação e Memcached no backend e compartilham um proxy cache mantido pelos processos cache loader e cache manager.",
            caption:
              "O master carrega a configuração e inicia os workers; cada worker atende muitas conexões de clientes e de backends no mesmo event loop. Os nomes dos módulos dentro dos workers são de 2012; a divisão entre master e workers continua a mesma.",
          },
        ],
        credit:
          "Diagrama: The Architecture of Open Source Applications, vol. II, Andrew Alexeev, CC BY 3.0",
      },
    ],
  },
  {
    id: "m6",
    num: "06",
    navTitle: "Load balancing",
    tag: "L4 + L7 + algoritmos",
    title: "Balanceamento de carga: L4, L7 e algoritmos do Nginx",
    lead: "Uma única instância chega ao limite e a loja começa a perder pedidos na Black Friday. Aumentar CPU e memória da mesma máquina (escala vertical) adia o problema, mas tem teto e continua sendo um único ponto de falha. A saída é a escala horizontal: vários backends idênticos. Surge então uma pergunta que o código da aplicação não responde: quem decide, a cada requisição, qual backend recebe o trabalho? E com qual critério, se um backend é mais forte que o outro, ou se algumas requisições levam um segundo e outras dez milissegundos?",
    concept: [
      "Um **balanceador de carga** distribui as requisições entre os backends. A decisão pode usar pouca ou muita informação, e isso define a camada em que ele trabalha.",
      "- **L4 (transporte)**: decide com IP e porta, sobre TCP ou UDP. É rápido, serve a protocolos genéricos (bancos de dados, por exemplo), mas não consegue rotear por URL, host ou cabeçalho porque nem lê o HTTP. No Nginx, isso é feito pelo módulo `stream`.",
      "- **L7 (aplicação)**: entende HTTP e HTTPS. Pode terminar TLS, aplicar cache e compressão e rotear por host, path, cabeçalho ou cookie, com uma sobrecarga um pouco maior.",
      "No Nginx, os algoritmos do bloco `upstream` são:",
      "- **Round Robin**: o padrão; distribui em sequência. O parâmetro `weight` altera a proporção para servidores com capacidades diferentes (`weight=2` recebe o dobro).",
      "- **least_conn**: envia a requisição ao backend com menos conexões ativas. É adequado quando as requisições têm durações muito diferentes.",
      "- **ip_hash**: o mesmo cliente tende a cair sempre no mesmo backend, a partir do endereço IPv4 (usa os três primeiros octetos) ou IPv6 (inteiro). Ajuda aplicações com estado local, mas concentra muitos usuários atrás do mesmo NAT ou VPN em um backend só.",
      'Afinidade como a do `ip_hash` dificulta a redistribuição e a escalabilidade. Sempre que possível, prefira aplicações **stateless**: sessão em Redis ou token assinado (como JWT) permitem que qualquer backend responda a qualquer requisição. Duas diretivas completam o quadro: `keepalive` reaproveita conexões entre o Nginx e os backends (exige `proxy_http_version 1.1` e `proxy_set_header Connection ""`), e os timeouts `proxy_connect_timeout`, `proxy_send_timeout` e `proxy_read_timeout` limitam cada fase da conversa com o upstream.',
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "L4 e L7",
        d: "L4 decide por IP e porta (rápido, genérico); L7 entende HTTP (flexível, mais custo).",
        color: "blue",
      },
      {
        t: "Round Robin e weight",
        d: "sequência simples; pesos para capacidades diferentes.",
        color: "signal",
      },
      {
        t: "least_conn",
        d: "favorece quem tem menos conexões ativas; bom para durações heterogêneas.",
        color: "violet",
      },
      {
        t: "ip_hash",
        d: "afinidade pelo IP do cliente; sujeita a desbalanceamento atrás de NAT.",
        color: "ember",
      },
      {
        t: "Stateless",
        d: "sessão externa ou token assinado dispensam afinidade.",
        color: "blue",
      },
      {
        t: "keepalive",
        d: "reaproveita conexões com os backends e reduz o custo de abrir conexões novas.",
        color: "signal",
      },
    ],
    examplesTitle: "Um upstream com decisão explícita",
    examples: [
      {
        label: "compose.yaml",
        lang: "yaml",
        code: '# compose.yaml\nx-backend: &backend                        # molde reutilizado pelos dois backends\n  image: python:3.12-alpine\n  command: ["python", "/app/backend.py"]   # executa o backend didático\n  volumes:\n    - ./backend.py:/app/backend.py:ro      # monta o script somente leitura\n\nservices:\n  api-1:\n    <<: *backend                           # herda o molde acima\n    environment:\n      NAME: api-1                          # nome devolvido nas respostas\n      DELAY: "${API1_DELAY:-0}"            # atraso configurável por variável de ambiente (padrão 0)\n  api-2:\n    <<: *backend\n    environment:\n      NAME: api-2\n  nginx:                                   # balanceador L7 (HTTP)\n    image: nginx:stable\n    ports:\n      - "8080:80"\n    volumes:\n      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro\n    depends_on:\n      - api-1\n      - api-2\n  nginx-l4:                                # balanceador L4 (TCP puro)\n    image: nginx:stable\n    ports:\n      - "9090:9090"\n    volumes:\n      - ./nginx-l4.conf:/etc/nginx/nginx.conf:ro   # substitui o nginx.conf inteiro\n    depends_on:\n      - api-1\n      - api-2',
        intro:
          "O laboratório tem dois backends (`api-1` e `api-2`, o `backend.py` da Etapa 03), um Nginx L7 na porta 8080 e um Nginx L4 na porta 9090. Copie o `backend.py` da Etapa 03 para a pasta `etapa06/`.",
      },
      {
        label: "nginx.conf",
        lang: "sh",
        code: '# nginx.conf\nupstream pitstop_api {\n    # Escolha no máximo uma destas linhas (sem nenhuma, o padrão é Round Robin):\n    # least_conn;\n    # ip_hash;\n    server api-1:3000;                     # backend 1 (acrescente weight=2 para dar a ele o dobro)\n    server api-2:3000;                     # backend 2\n    keepalive 32;                          # até 32 conexões ociosas reaproveitadas com os backends\n}\n\nserver {\n    listen 80;\n    default_type text/plain;               # tipo da resposta fixa abaixo\n\n    location = / {\n        return 200 "home servida pelo proprio Nginx\\n";   # L7 decide pelo path: esta rota não toca nos backends\n    }\n\n    location /api/ {\n        proxy_pass http://pitstop_api;     # encaminha ao grupo de backends\n        proxy_http_version 1.1;            # necessário para o keepalive com os backends\n        proxy_set_header Connection "";    # remove o "Connection: close" padrão\n    }\n}',
      },
      {
        label: "nginx-l4.conf",
        lang: "sh",
        code: "# nginx-l4.conf\nevents {}                                  # bloco obrigatório, mesmo vazio\n\nstream {                                   # contexto de balanceamento TCP/UDP\n    upstream api_tcp {\n        server api-1:3000;\n        server api-2:3000;\n    }\n    server {\n        listen 9090;                       # escuta TCP, sem interpretar HTTP\n        proxy_pass api_tcp;                # repassa os bytes ao backend escolhido\n    }\n}",
      },
      {
        label: "terminal",
        lang: "sh",
        code: '$ docker compose up -d\n\n# L7: a rota "/" é decidida pelo Nginx; "/api/" vai aos backends em sequência\n$ curl -s http://localhost:8080/\nhome servida pelo proprio Nginx\n$ for i in $(seq 1 4); do curl -s http://localhost:8080/api/; done\napi-1 recebeu /api/\napi-2 recebeu /api/\napi-1 recebeu /api/\napi-2 recebeu /api/\n\n# L4: não lê o HTTP, então "/" também chega a um backend (e não existe rota própria do Nginx)\n$ curl -s http://localhost:9090/\napi-1 recebeu /',
        note: "O `weight=2` só altera a proporção no Round Robin: com 30 requisições, esperam-se cerca de 20 para `api-1` e 10 para `api-2`. O `least_conn` observa conexões ativas, e o peso continua influenciando a escolha entre servidores disponíveis.",
      },
    ],
    commands: [
      {
        cmd: "docker compose exec nginx nginx -t",
        note: "valida a configuração antes de aplicar",
      },
      {
        cmd: "docker compose exec nginx nginx -s reload",
        note: "recarrega sem derrubar conexões existentes",
      },
      {
        cmd: "docker compose restart nginx",
        note: "reinicia o Nginx quando uma edição do `nginx.conf` não aparece depois do reload",
      },
      {
        cmd: "for i in $(seq 1 30); do curl -s http://localhost:8080/api/; done | sort | uniq -c",
        note: "conta a distribuição entre os backends",
      },
      {
        cmd: "seq 1 20 | xargs -P 10 -I{} curl -s http://localhost:8080/api/ | sort | uniq -c",
        note: "gera requisições concorrentes (10 ao mesmo tempo) e conta a distribuição",
      },
      {
        cmd: "ab -n 1000 -c 20 -k http://localhost:8080/api/",
        note: "mede vazão e latência sob concorrência (`-k` usa keep-alive; sem ele, o `ab` abre uma conexão por requisição)",
      },
      {
        cmd: "API1_DELAY=1 docker compose up -d api-1",
        note: "recria `api-1` com 1 segundo de atraso por resposta",
      },
    ],
    handsOn: [
      "Crie `etapa06/` com `backend.py`, `compose.yaml`, `nginx.conf` e `nginx-l4.conf`, e rode `docker compose up -d`.",
      "Com Round Robin, rode `for i in $(seq 1 30); do curl -s http://localhost:8080/api/; done | sort | uniq -c`. **Observe** uma divisão de 15 para 15.",
      "Acrescente `weight=2` a `api-1`, valide e recarregue (`docker compose exec nginx nginx -t` e depois `nginx -s reload`) e repita a contagem. **Observe** cerca de 20 para `api-1` e 10 para `api-2`. Se a divisão não mudar, o container pode estar vendo a versão antiga do arquivo (editores e `sed -i` substituem o arquivo montado por um novo); rode `docker compose restart nginx` e repita a contagem.",
      "Remova o peso, ative `least_conn;`, recarregue e rode `API1_DELAY=1 docker compose up -d api-1`. Recarregue o Nginx de novo (o IP de `api-1` pode ter mudado) e rode `seq 1 20 | xargs -P 10 -I{} curl -s http://localhost:8080/api/ | sort | uniq -c`. **Observe** que o backend lento recebe menos trabalho novo (por exemplo, 5 contra 15; os números variam).",
      "Troque `least_conn;` por `ip_hash;`, recarregue e repita a contagem. **Observe** que todas as respostas vêm do mesmo backend. Explique por quê: pelo mapeamento de portas do Docker, todas as requisições chegam ao Nginx com o mesmo IP de origem (o do gateway da rede). É o efeito de vários usuários atrás de um mesmo NAT.",
      "Compare L4 e L7: rode `curl -s http://localhost:8080/` e `curl -s http://localhost:9090/`. **Observe** que só o L7 responde sozinho por uma rota, porque só ele lê o path.",
      "Meça com `ab -n 1000 -c 20 -k http://localhost:8080/api/` e anote `Requests per second` e o tempo médio por requisição. Depois descreva em uma frase como Redis ou JWT eliminariam a necessidade do `ip_hash`.",
      "Limpe: `docker compose down`.",
    ],
    tip: "Escolha o algoritmo pelo comportamento da carga: Round Robin distribui contagem, `least_conn` distribui ocupação e `ip_hash` distribui afinidade. Se você precisa de afinidade para a aplicação funcionar, o problema está no estado guardado dentro do backend, e a solução de longo prazo é tirá-lo de lá.",
    takeaway:
      "Balancear não é só espalhar requisições: é escolher quanta informação o balanceador enxerga (L4 ou L7) e qual sinal ele usa (sequência, peso, conexões ativas ou afinidade) sem criar um novo gargalo.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa06-l4-l7.svg",
            alt: "Dois painéis. L7, Nginx na porta 8080: GET / é respondido pelo próprio Nginx em location = /, e GET /api/ vai por location /api/ a api-1 e api-2 em Round Robin. L4, Nginx stream na porta 9090: a conexão TCP do cliente vai direto a api-1 ou api-2.",
            caption:
              "As duas portas do laboratório. O balanceador L7 lê o path e decide: `/` não chega aos backends. O L4 só vê IP e porta e repassa cada conexão TCP, então `/` também chega a um backend.",
          },
        ],
        credit: "Diagrama: feito para este guia",
      },
    ],
  },
  {
    id: "m7",
    num: "07",
    navTitle: "Failover e diagnóstico",
    tag: "health checks + 502/504",
    title: "Health checks, failover, métricas e diagnóstico",
    lead: "Em uma promoção, um dos três backends trava, mas o processo continua de pé. Para o sistema operacional está tudo bem, e o balanceador segue mandando um terço das requisições para ele. Um terço dos usuários recebe erro ou espera até o timeout, e a equipe só descobre porque os clientes reclamam. Um balanceador precisa medir se o serviço atende de verdade, retirar da rotação quem não atende, ter um plano B e, quando algo dá errado, mostrar onde está o problema com logs e métricas.",
    concept: [
      "**Health checks.** No Nginx Open Source, os parâmetros `max_fails` e `fail_timeout` implementam verificação **passiva**: falhas observadas em requisições reais retiram temporariamente o backend da rotação. Com `max_fails=3 fail_timeout=10s`, três falhas dentro de 10 segundos tiram o servidor da rotação por 10 segundos; depois disso o Nginx volta a tentá-lo e o recoloca se a chamada funcionar. A verificação passiva depende de tráfego real: sem requisições, não há falhas para observar. Verificações **ativas** (sondas periódicas independentes do tráfego, com a diretiva `health_check`) são recurso do Nginx Plus, a edição comercial, ou de módulos externos. Um detalhe: em um grupo com um único servidor, `max_fails` e `fail_timeout` são ignorados.",
      "**Failover e backup.** Quando uma tentativa falha por erro de conexão ou timeout, o Nginx tenta o próximo servidor do grupo (comportamento padrão de `proxy_next_upstream`), então o cliente nem sempre percebe a falha. O parâmetro `backup` reserva um servidor que só recebe requisições quando todos os primários estão indisponíveis (não pode ser combinado com `ip_hash`, `hash` ou `random`).",
      "**Métricas.** O módulo `stub_status` expõe conexões ativas, total de conexões e requisições aceitas, e os estados de leitura, escrita e espera. O Apache Bench (`ab`) gera carga controlada. Leia em conjunto requisições por segundo, latência, percentis (o p95 mostra a experiência dos mais lentos, que a média esconde), CPU e logs, para saber se o limite está no proxy, no backend ou em uma dependência.",
      "**Diagnóstico de 502 e 504.** O erro `502 Bad Gateway` indica que o Nginx não obteve uma resposta válida do upstream: conexão recusada, conexão encerrada ou resposta inválida. O erro `504 Gateway Timeout` indica que a conexão foi feita, mas o backend não respondeu dentro do `proxy_read_timeout`. A investigação segue o caminho da requisição: cliente, Nginx, backend, dependências. Aumentar um timeout sem investigar pode apenas esconder lentidão.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "Check passivo (`max_fails`, `fail_timeout`)",
        d: "falhas em tráfego real retiram o backend por um tempo; disponível no Open Source.",
        color: "blue",
      },
      {
        t: "Check ativo (`health_check`)",
        d: "sondas periódicas; exige Nginx Plus ou módulo externo.",
        color: "signal",
      },
      {
        t: "`backup`",
        d: "servidor reserva usado só quando os primários caem.",
        color: "violet",
      },
      {
        t: "`proxy_next_upstream`",
        d: "define em que falhas o Nginx tenta outro servidor do grupo.",
        color: "ember",
      },
      {
        t: "`stub_status`",
        d: "painel nativo com conexões ativas e estados de leitura, escrita e espera.",
        color: "blue",
      },
      {
        t: "502 e 504",
        d: "502 é falha ao obter resposta válida (por exemplo, conexão recusada); 504 é espera além do `proxy_read_timeout`.",
        color: "signal",
      },
    ],
    examplesTitle: "Backends primários, reserva, painel de estado e erros provocados",
    examples: [
      {
        label: "compose.yaml",
        lang: "yaml",
        code: '# compose.yaml\nx-backend: &backend\n  image: python:3.12-alpine\n  command: ["python", "/app/backend.py"]\n  volumes:\n    - ./backend.py:/app/backend.py:ro\n  networks: [lab]\n\nservices:\n  api-1:\n    <<: *backend\n    environment: { NAME: api-1 }\n  api-2:\n    <<: *backend\n    environment: { NAME: api-2 }\n  api-backup:\n    <<: *backend\n    environment: { NAME: api-backup }      # só responde quando os primários caem\n  nginx:\n    image: nginx:stable\n    ports:\n      - "8080:80"\n    volumes:\n      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro\n    networks: [lab]\n    depends_on: [api-1, api-2, api-backup]\n  tools:                                   # container só para rodar curl dentro da rede\n    image: curlimages/curl\n    entrypoint: ["tail", "-f", "/dev/null"]\n    networks: [lab]\n\nnetworks:\n  lab:\n    ipam:\n      config:\n        - subnet: 172.30.0.0/24            # sub-rede fixa, usada na regra allow do stub_status',
        intro:
          "O laboratório tem `api-1`, `api-2`, `api-backup` e um Nginx com rotas para provocar 502 e 504. Copie o `backend.py` da Etapa 03 para `etapa07/`.",
      },
      {
        label: "nginx.conf",
        lang: "sh",
        code: "# nginx.conf\nlog_format lab '$remote_addr \"$request\" $status upstream=$upstream_addr ust=$upstream_status rt=$request_time';\n\nupstream pitstop_api {\n    server api-1:3000 max_fails=3 fail_timeout=10s;   # 3 falhas em 10s tiram o servidor por 10s\n    server api-2:3000 max_fails=3 fail_timeout=10s;\n    server api-backup:3000 backup;                    # reserva: só entra se api-1 e api-2 estiverem fora\n}\n\nserver {\n    listen 80;\n    default_type text/plain;\n    access_log /var/log/nginx/access.log lab;         # log com o endereço do upstream e o tempo de cada requisição\n\n    location / {\n        proxy_pass http://pitstop_api;\n    }\n\n    location = /nginx_status {\n        stub_status;                                  # painel nativo de conexões\n        allow 127.0.0.1;                              # apenas a própria máquina\n        allow 172.30.0.0/24;                          # e a rede do laboratório\n        deny all;                                     # nega o resto\n    }\n\n    location = /quebrado {\n        proxy_pass http://api-1:9999;                 # porta onde ninguém escuta: conexão recusada (502)\n    }\n\n    location = /lento {\n        proxy_read_timeout 2s;                        # espera no máximo 2s pela resposta\n        proxy_pass http://api-1:3000/slow;            # rota do backend que demora 10s (504)\n    }\n}",
        note: "As rotas `/quebrado` e `/lento` usam o `api-1`, então teste-as com ele no ar.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: '# Com tráfego normal, o log mostra um único upstream por requisição (saída aproximada)\n$ curl -s http://localhost:8080/\napi-1 recebeu /\n$ docker compose logs nginx --tail 2\nnginx-1  | 172.30.0.1 "GET / HTTP/1.1" 200 upstream=172.30.0.3:3000 ust=200 rt=0.003\n\n# Depois de "docker compose stop api-1", o container some da rede. A tentativa de conexão ao IP\n# antigo costuma falhar com "No route to host" ou com timeout de conexão depois de alguns segundos\n# (e não com recusa imediata). O Nginx então tenta o próximo servidor: o cliente recebe 200,\n# mas a requisição demora, e o log mostra dois endereços (o que falhou e o que respondeu)\n# saída aproximada\nnginx-1  | 172.30.0.1 "GET / HTTP/1.1" 200 upstream=172.30.0.3:3000, 172.30.0.4:3000 ust=502, 200 rt=3.005\n\n# Erros provocados, com o api-1 no ar (saída aproximada)\n$ curl -s -o /dev/null -w \'%{http_code} em %{time_total}s\\n\' http://localhost:8080/quebrado\n502 em 0.004s\n$ curl -s -o /dev/null -w \'%{http_code} em %{time_total}s\\n\' http://localhost:8080/lento\n504 em 2.003s\n\n# Painel de estado, de dentro da rede (saída aproximada)\n$ docker compose exec tools curl -s http://nginx/nginx_status\nActive connections: 1\nserver accepts handled requests\n 25 25 25\nReading: 0 Writing: 1 Waiting: 0',
        note: "O `502` de `/quebrado` volta quase imediatamente porque a conexão é recusada por um IP que existe e não tem nada escutando na porta; o `504` só aparece depois do `proxy_read_timeout`. Essa diferença de tempo, vista junto com a mensagem no log de erros (`Connection refused`, `No route to host` ou `timed out`), já aponta a causa. O backend parado com `docker compose stop` se comporta de outro jeito: como o IP some da rede, a primeira requisição que cai nele pode levar alguns segundos, e as falhas contam para o `max_fails`. O Nginx resolve os nomes do `upstream` quando carrega a configuração: se um container for recriado com outro IP, recarregue o Nginx (`nginx -s reload`).",
      },
    ],
    commands: [
      {
        cmd: "docker compose logs -f nginx",
        note: "acompanha acessos, falhas e recuperação",
      },
      {
        cmd: "docker compose stop api-1",
        note: "simula a falha de um backend",
      },
      {
        cmd: "docker compose start api-1",
        note: "devolve o backend (depois, recarregue o Nginx se o IP mudou)",
      },
      {
        cmd: "docker compose exec tools curl -s http://nginx/nginx_status",
        note: "consulta o painel nativo",
      },
      {
        cmd: "ab -n 2000 -c 50 -k http://localhost:8080/",
        note: "gera carga mensurável e imprime os percentis",
      },
      {
        cmd: "docker compose logs nginx | grep -E 'refused|timed out|unreachable|No route'",
        note: "mostra a causa dos 502 e 504 no log de erros",
      },
    ],
    handsOn: [
      "Crie `etapa07/` com `backend.py`, `compose.yaml` e `nginx.conf`, e rode `docker compose up -d`. Confirme com `for i in $(seq 1 6); do curl -s http://localhost:8080/; done` que as respostas alternam entre `api-1` e `api-2` e nunca vêm de `api-backup`.",
      "Rode `ab -n 2000 -c 50 -k http://localhost:8080/` e anote `Requests per second` e a linha `95%` da tabela de percentis.",
      "Em um terminal, rode `for i in $(seq 1 60); do curl -s -o /dev/null -w '%{http_code} ' http://localhost:8080/; sleep 0.5; done`. Em outro, rode `docker compose stop api-1`. **Observe** que todos os códigos seguem 200, mas que as primeiras requisições que caírem em `api-1` podem demorar alguns segundos cada (a tentativa de conexão a um IP que sumiu da rede não é recusada na hora; os tempos variam). Confirme em `docker compose logs nginx --tail 30` as linhas com dois endereços de upstream (o primeiro falhou) e, depois das três falhas do `max_fails`, só o endereço de `api-2` durante a janela de 10 segundos.",
      "Rode `docker compose stop api-2` e `curl -s http://localhost:8080/`. **Observe** `api-backup recebeu /`: com os primários fora, a reserva assume, e a primeira chamada pode demorar alguns segundos pelo mesmo motivo do passo anterior.",
      "Rode `docker compose start api-1 api-2`, recarregue o Nginx (`docker compose exec nginx nginx -s reload`) e repita o laço do passo 1. **Observe** o retorno dos primários e o fim do uso do backup.",
      "Com `api-1` no ar, provoque os dois erros: `curl -s -o /dev/null -w '%{http_code} em %{time_total}s\\n' http://localhost:8080/quebrado` e o mesmo para `/lento`. **Observe** `502` imediato e `504` em cerca de 2 segundos, e procure a causa com `docker compose logs nginx | grep -E 'refused|timed out|unreachable|No route'`.",
      "Consulte `docker compose exec tools curl -s http://nginx/nginx_status` durante um `ab` e **observe** `Active connections` subindo.",
      "Limpe: `docker compose down`.",
    ],
    tip: "Nunca mude três timeouts ao mesmo tempo. Reproduza o problema, altere uma variável, repita a carga e compare a mesma métrica. E lembre que o check passivo só descobre a falha quando um cliente real é afetado por ela: a primeira requisição que cai em um backend doente paga o preço.",
    takeaway:
      "Alta disponibilidade começa quando a borda detecta um backend incapaz, para de enviar trabalho a ele e prova, com logs e métricas, que a experiência do usuário continuou.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa07-failover.svg",
            alt: "O Nginx com o upstream pitstop_api: a conexão com api-1 falha e o Nginx tenta o próximo; api-2 responde 200; api-backup, tracejado, só entra se api-1 e api-2 caírem. Embaixo, 502 quando a conexão com o backend falha e 504 quando o backend não responde dentro do proxy_read_timeout.",
            caption:
              "O upstream do laboratório: uma falha de conexão leva o Nginx ao próximo servidor, três falhas em 10 segundos tiram o servidor da rotação, e o `backup` só recebe tráfego sem nenhum primário. Embaixo, onde nasce cada erro: 502 sem resposta válida, 504 sem resposta a tempo.",
          },
        ],
        credit: "Diagrama: feito para este guia",
      },
    ],
  },
  {
    id: "m8",
    num: "08",
    navTitle: "Ingress no Kubernetes",
    tag: "host + path",
    title: "Ingress no Kubernetes",
    lead: "No cluster, cada Service que precisa ser acessado de fora poderia ganhar o seu próprio `LoadBalancer`. Com dez serviços, são dez balanceadores externos, dez IPs públicos para gerenciar, dez conjuntos de regras e dez custos na nuvem. Os tipos de Service existentes resolvem partes do problema: `ClusterIP` expõe o serviço só dentro do cluster, `NodePort` publica uma porta alta em cada nó e `LoadBalancer` costuma criar um balanceador externo por Service. Falta um ponto de entrada único que entenda HTTP e roteie por domínio e caminho.",
    concept: [
      'O **Ingress** centraliza regras HTTP e HTTPS de roteamento sob um único ponto de entrada. Ele é só uma declaração: um objeto da API que diz "o host X e o caminho Y vão para o Service Z". Quem executa essas regras é o **Ingress Controller** (ingress-nginx, Traefik, entre outros), que observa os objetos Ingress e configura o proxy real que recebe o tráfego. Sem Controller, criar o objeto Ingress não muda o tráfego.',
      "- **Roteamento por host** separa domínios (`api.exemplo.com` e `app.exemplo.com`). **Roteamento por path** separa caminhos no mesmo domínio (`/api` e `/`).",
      "- `pathType: Prefix` aceita o caminho e seus subcaminhos; `Exact` exige igualdade completa; `ImplementationSpecific` deixa a interpretação para o Controller (é o tipo usado quando o caminho tem expressão regular no ingress-nginx).",
      "- Annotations aplicam recursos específicos do Controller, como a reescrita de URL. Elas valem para o Ingress inteiro, e não para um path só. `ingressClassName` escolhe qual Controller atende a regra quando há mais de um no cluster.",
      "- O Service de destino continua sendo um `ClusterIP` estável para os Pods selecionados. Se o Service não tem endpoints (Pods prontos), o Ingress não tem para onde encaminhar.",
      "O Ingress segue estável, mas sua API está congelada (a evolução acontece na Gateway API, `gateway.networking.k8s.io`, que o Kubernetes recomenda para arquiteturas novas). O ingress-nginx, o Controller usado neste laboratório, foi aposentado pelo projeto Kubernetes: a aposentadoria foi anunciada em novembro de 2025 e a manutenção terminou em março de 2026. Ele continua útil para estudar o conceito no Minikube, mas, para produção, prefira um Controller mantido ou a Gateway API. Isso não se aplica ao NGINX Ingress Controller mantido pela F5, que é outro projeto.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "Ingress",
        d: "declaração de hosts, paths e Services de destino (`networking.k8s.io/v1`).",
        color: "blue",
      },
      {
        t: "Ingress Controller",
        d: "o componente que lê os Ingress e configura o proxy real.",
        color: "signal",
      },
      {
        t: "ingressClassName",
        d: "escolhe o Controller responsável pela regra.",
        color: "violet",
      },
      {
        t: "pathType",
        d: "`Prefix`, `Exact` ou `ImplementationSpecific`.",
        color: "ember",
      },
      {
        t: "Annotation `rewrite-target`",
        d: "reescreve o caminho antes de enviar ao backend; vale para todos os paths do mesmo Ingress.",
        color: "blue",
      },
      {
        t: "Service com endpoints",
        d: "pré-requisito para o Ingress funcionar; sem Pods prontos, não há destino.",
        color: "signal",
      },
    ],
    examplesTitle: "Um domínio, dois Services",
    examples: [
      {
        label: "apps.yaml",
        lang: "yaml",
        code: '# apps.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api                                # backend "api"\nspec:\n  replicas: 2                              # duas réplicas\n  selector:\n    matchLabels:\n      app: api                             # seleciona os Pods pelo label\n  template:\n    metadata:\n      labels:\n        app: api                           # precisa casar com o selector\n    spec:\n      containers:\n        - name: api\n          image: python:3.12-alpine        # imagem com Python\n          command: ["python", "/app/backend.py"]   # executa o backend didático\n          env:\n            - name: NAME\n              value: api                   # nome devolvido nas respostas\n          ports:\n            - containerPort: 3000          # porta do backend\n          readinessProbe:                  # só recebe tráfego quando responde\n            httpGet:\n              path: /healthz\n              port: 3000\n          volumeMounts:\n            - name: code\n              mountPath: /app              # o script aparece em /app/backend.py\n      volumes:\n        - name: code\n          configMap:\n            name: backend-py               # ConfigMap criado a partir do backend.py\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: api\nspec:\n  selector:\n    app: api                               # encaminha aos Pods com este label\n  ports:\n    - port: 80                             # porta do Service\n      targetPort: 3000                     # porta do container\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web                                # mesmo molde, outro nome\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n        - name: web\n          image: python:3.12-alpine\n          command: ["python", "/app/backend.py"]\n          env:\n            - name: NAME\n              value: web                   # único campo que muda\n          ports:\n            - containerPort: 3000\n          readinessProbe:\n            httpGet:\n              path: /healthz\n              port: 3000\n          volumeMounts:\n            - name: code\n              mountPath: /app\n      volumes:\n        - name: code\n          configMap:\n            name: backend-py\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: web\nspec:\n  selector:\n    app: web\n  ports:\n    - port: 80\n      targetPort: 3000',
        intro:
          "Os dois Services (`api` e `web`) usam o `backend.py` da Etapa 03 (copie-o para `etapa08/`), entregue ao cluster por um ConfigMap.",
        note: "A reescrita de URL vale para todos os paths do Ingress em que a annotation aparece, então a rota `/api` (com reescrita) e a rota `/` (sem reescrita) ficam em dois objetos Ingress separados.",
      },
      {
        label: "ingress.yaml",
        lang: "yaml",
        code: '# ingress.yaml\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: pitstop-api\n  annotations:\n    nginx.ingress.kubernetes.io/rewrite-target: /$2    # envia ao backend só o que casou no segundo grupo\nspec:\n  ingressClassName: nginx                  # atendido pelo ingress-nginx\n  rules:\n    - host: pitstop.local                  # roteamento por host\n      http:\n        paths:\n          - path: /api(/|$)(.*)            # expressão regular: grupo 2 é o resto do caminho\n            pathType: ImplementationSpecific\n            backend:\n              service:\n                name: api\n                port:\n                  number: 80\n---\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: pitstop-web                        # sem reescrita: o caminho segue intacto\nspec:\n  ingressClassName: nginx\n  rules:\n    - host: pitstop.local\n      http:\n        paths:\n          - path: /status                  # caminho exato: só "/status", sem subcaminhos\n            pathType: Exact\n            backend:\n              service:\n                name: api\n                port:\n                  number: 80\n          - path: /                        # todo o resto vai para o frontend\n            pathType: Prefix\n            backend:\n              service:\n                name: web\n                port:\n                  number: 80',
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ kubectl create configmap backend-py --from-file=backend.py\n$ kubectl apply -f apps.yaml -f ingress.yaml\n\n# Port-forward do Controller, para não depender de IP do Minikube nem de /etc/hosts\n# (o \"&\" o deixa em segundo plano; sem ele, o comando prende o terminal e é preciso abrir outro)\n$ kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80 &\n\n# O cabeçalho Host escolhe a regra; o rewrite remove o prefixo /api (saída aproximada)\n$ curl -s -H 'Host: pitstop.local' http://127.0.0.1:8080/api/health\napi recebeu /health\n$ curl -s -H 'Host: pitstop.local' http://127.0.0.1:8080/\nweb recebeu /\n\n# Exact casa só \"/status\"; um subcaminho cai na regra \"/\" (Prefix)\n$ curl -s -H 'Host: pitstop.local' http://127.0.0.1:8080/status\napi recebeu /status\n$ curl -s -H 'Host: pitstop.local' http://127.0.0.1:8080/status/extra\nweb recebeu /status/extra",
      },
    ],
    commands: [
      {
        cmd: "minikube addons enable ingress -p lab",
        note: "instala o ingress-nginx no perfil `lab` do Minikube",
      },
      {
        cmd: "kubectl wait -n ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=180s",
        note: "espera o Controller ficar pronto",
      },
      {
        cmd: "helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace",
        note: "alternativa de instalação em outros clusters (exige `helm repo add` do repositório do ingress-nginx)",
      },
      {
        cmd: "kubectl get ingress,ingressclass",
        note: "confere endereço e classe",
      },
      {
        cmd: "kubectl get endpointslices -l kubernetes.io/service-name=api",
        note: "confere se o Service tem Pods prontos (`kubectl get endpoints api` também funciona, com aviso de depreciação em versões recentes)",
      },
      {
        cmd: "kubectl exec -n ingress-nginx deploy/ingress-nginx-controller -- cat /etc/nginx/nginx.conf | grep -n pitstop.local",
        note: "mostra o `nginx.conf` que o Controller gerou a partir dos Ingress",
      },
    ],
    handsOn: [
      "Suba o cluster e o Controller: `minikube start -p lab`, `minikube addons enable ingress -p lab` e o `kubectl wait` acima. **Observe** o Pod `ingress-nginx-controller` em `Running` e confirme com `kubectl get ingressclass` a classe `nginx`.",
      "Crie o ConfigMap (`kubectl create configmap backend-py --from-file=backend.py`) e aplique `apps.yaml` e `ingress.yaml`. Confirme os Pods com `kubectl get pods` e os endpoints com `kubectl get endpointslices`.",
      "Abra o port-forward em outro terminal (`kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80`, que fica em primeiro plano) e, no terminal original, rode `curl -s -H 'Host: pitstop.local' http://127.0.0.1:8080/api/health` e o mesmo para `/`. **Observe** `api recebeu /health` (o prefixo `/api` foi removido pelo rewrite) e `web recebeu /`.",
      "Teste `/status` e `/status/extra` com o mesmo cabeçalho `Host`. **Observe** que `Exact` casa apenas o caminho exato e que o subcaminho cai na regra `/` do frontend.",
      "Rode o `kubectl exec ... cat /etc/nginx/nginx.conf | grep -n pitstop.local` e **observe** que o Controller transformou os objetos Ingress em blocos `server` de um Nginx de verdade.",
      "Provoque uma falha: `kubectl scale deployment api --replicas=0` e repita `/api/health`. **Observe** a resposta `503` do Controller (Service sem endpoints) e restaure com `--replicas=2`.",
      "Encerre o port-forward (Ctrl+C no outro terminal) e apague só as regras: `kubectl delete -f ingress.yaml`. Mantenha o perfil `lab`, o `apps.yaml` aplicado e o ConfigMap `backend-py`, porque a Etapa 09 usa o Service `web`. A limpeza completa fica no fim da Etapa 09.",
    ],
    tip: "Ao depurar, siga a ordem: Controller ativo, `ingressClassName` correta, regra reconhecida (`kubectl describe ingress`), Service com endpoints e Pod saudável. A causa costuma estar nos dois últimos itens, não no Ingress.",
    takeaway:
      "O Ingress declara uma entrada HTTP compartilhada por host e path; o Controller transforma essa intenção em proxy real, e nada funciona sem um Service com endpoints saudáveis atrás.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa08-ingress-path.svg",
            alt: "Um cliente chega por um load balancer gerenciado pelo Ingress; a regra /foo leva ao service1 e a regra /bar leva ao service2, cada um com dois Pods.",
            caption:
              "Roteamento por path: o mesmo endereço de entrada, e o caminho da URL decide o Service. É o caso do `/api` deste laboratório.",
          },
          {
            src: "/guides/servidores-web/etapa08-ingress-host.svg",
            alt: "Um cliente chega por um load balancer gerenciado pelo Ingress; o host foo.bar.com leva ao service1 e o host bar.foo.com leva ao service2, cada um com dois Pods.",
            caption:
              "Roteamento por host: o cabeçalho `Host` da requisição decide o Service. Nos dois casos, o Ingress é só a regra; quem a executa é o Ingress Controller.",
          },
        ],
        credit: "Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
    ],
  },
  {
    id: "m9",
    num: "09",
    navTitle: "TLS automático",
    tag: "cert-manager",
    title: "TLS e cert-manager",
    lead: "O site da loja roda em HTTPS, e o certificado vence em 90 dias. Alguém precisa lembrar, gerar o pedido, provar à autoridade que o domínio é da empresa, instalar o arquivo e recarregar o servidor. Com dezenas de domínios e serviços criados e removidos o tempo todo no cluster, isso não escala. Um certificado vencido derruba o acesso de todos os usuários com um aviso de segurança no navegador.",
    concept: [
      "O TLS oferece confidencialidade, integridade e autenticação do servidor. O **cert-manager** estende a API do Kubernetes com recursos declarativos para emitir, armazenar e renovar certificados automaticamente.",
      "- **Issuer** emite certificados dentro de um namespace; **ClusterIssuer** atende o cluster inteiro. Eles definem a autoridade emissora (autoassinada, uma CA interna ou o ACME).",
      "- **Certificate** declara os nomes DNS, a duração e o **Secret** que receberá a chave privada e o certificado.",
      "- Com o **ACME** (protocolo usado pelo Let's Encrypt), um desafio **HTTP-01** (publicar um token em um caminho do site) ou **DNS-01** (publicar um registro TXT) prova o controle do domínio. O cert-manager acompanha a validade e renova antes do vencimento (por padrão, a duração é de 90 dias e a renovação começa quando falta um terço dela).",
      "- O **Ingress** referencia o Secret TLS. Com a annotation `cert-manager.io/cluster-issuer`, o cert-manager cria o Certificate sozinho a partir do bloco `tls` do Ingress.",
      "- Na conexão, o cliente informa o nome do site desejado logo no início do handshake (**SNI**), e é por isso que um mesmo Controller consegue apresentar o certificado certo para cada host.",
      "A chave privada permanece no cluster e não deve ser gravada em manifestos nem em repositórios. Um Secret é codificado em base64, e isso não é criptografia: a proteção vem do controle de acesso (RBAC) sobre os Secrets.",
      "O desafio ACME exige um domínio público alcançável pela autoridade, então o Let's Encrypt só pode ser praticado com um domínio real. O laboratório usa um ClusterIssuer autoassinado, que exercita o mesmo caminho (Ingress, Certificate, Secret, renovação) sem depender de internet pública. Ao usar o Let's Encrypt de verdade, comece pelo ambiente de staging para evitar os limites de emissão.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "Issuer e ClusterIssuer",
        d: "definem quem emite os certificados (`cert-manager.io/v1`).",
        color: "blue",
      },
      {
        t: "Certificate",
        d: "o pedido (nomes DNS, duração, Secret de destino).",
        color: "signal",
      },
      {
        t: "Secret `kubernetes.io/tls`",
        d: "guarda `tls.crt` e `tls.key`; é o que o Ingress usa.",
        color: "violet",
      },
      {
        t: "ACME, HTTP-01 e DNS-01",
        d: "protocolo e desafios para provar a posse do domínio.",
        color: "ember",
      },
      {
        t: "Renovação",
        d: "automática, antes do vencimento (`renewBefore`).",
        color: "blue",
      },
      {
        t: "Staging",
        d: "ambiente de teste do Let's Encrypt, sem os limites rígidos de produção.",
        color: "signal",
      },
    ],
    examplesTitle: "Ingress integrado ao cert-manager",
    examples: [
      {
        label: "clusterissuer-selfsigned.yaml",
        lang: "yaml",
        code: "# clusterissuer-selfsigned.yaml\napiVersion: cert-manager.io/v1\nkind: ClusterIssuer\nmetadata:\n  name: selfsigned                         # nome citado nas annotations\nspec:\n  selfSigned: {}                           # emite certificados autoassinados (só para laboratório)",
      },
      {
        label: "ingress-tls.yaml",
        lang: "yaml",
        code: "# ingress-tls.yaml\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: pitstop-secure\n  annotations:\n    cert-manager.io/cluster-issuer: selfsigned   # pede ao cert-manager que emita o certificado\nspec:\n  ingressClassName: nginx\n  tls:\n    - hosts:\n        - secure.pitstop.local             # nomes cobertos pelo certificado\n      secretName: pitstop-tls              # Secret que o cert-manager vai criar\n  rules:\n    - host: secure.pitstop.local\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: web                  # Service criado na Etapa 08 (mantido até o fim desta etapa)\n                port:\n                  number: 80",
        note: "Para observar uma renovação sem esperar 60 dias, crie um Certificate explícito com a duração mínima permitida (1 hora) e uma janela de renovação de 55 minutos: a renovação ocorre cerca de 5 minutos depois da emissão.",
      },
      {
        label: "certificate-renova.yaml",
        lang: "yaml",
        code: "# certificate-renova.yaml\napiVersion: cert-manager.io/v1\nkind: Certificate\nmetadata:\n  name: renova-teste\nspec:\n  secretName: renova-teste-tls             # Secret de destino\n  duration: 1h                             # validade mínima aceita pelo cert-manager\n  renewBefore: 55m                         # renova quando restarem 55 minutos (5 minutos após emitir)\n  dnsNames:\n    - renova.pitstop.local                 # nome DNS do certificado\n  issuerRef:\n    name: selfsigned                       # emissor usado\n    kind: ClusterIssuer",
        note: "O manifesto abaixo é só leitura: ele configura o ACME do Let's Encrypt em staging e exige um domínio público alcançável na porta 80.",
      },
      {
        label: "clusterissuer-letsencrypt-staging.yaml",
        lang: "yaml",
        code: "# clusterissuer-letsencrypt-staging.yaml\napiVersion: cert-manager.io/v1\nkind: ClusterIssuer\nmetadata:\n  name: letsencrypt-staging\nspec:\n  acme:\n    server: https://acme-staging-v02.api.letsencrypt.org/directory   # staging; produção usa acme-v02\n    email: voce@exemplo.com                # contato para avisos da autoridade\n    privateKeySecretRef:\n      name: letsencrypt-staging-account    # Secret que guarda a chave da conta ACME\n    solvers:\n      - http01:\n          ingress:\n            ingressClassName: nginx        # o desafio HTTP-01 passa pelo mesmo Controller",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# Instalação do cert-manager por Helm (a versão do chart é a mais recente do repositório)\n$ helm repo add jetstack https://charts.jetstack.io\n$ helm repo update\n$ helm install cert-manager jetstack/cert-manager -n cert-manager --create-namespace --set crds.enabled=true\n\n$ kubectl apply -f clusterissuer-selfsigned.yaml -f ingress-tls.yaml\n$ kubectl get certificate -w\nNAME          READY   SECRET        AGE\npitstop-tls   False   pitstop-tls   2s\npitstop-tls   True    pitstop-tls   4s\n\n$ kubectl get secret pitstop-tls -o jsonpath='{.data.tls\\.crt}' | base64 -d \\\n    | openssl x509 -noout -issuer -dates -ext subjectAltName\n# saída aproximada\nissuer=                                    # autoassinado: o emissor é o próprio certificado (a linha pode vir vazia, porque o pedido só define o nome DNS)\nnotBefore=...\nnotAfter=...                               # cerca de 90 dias depois\nX509v3 Subject Alternative Name:\n    DNS:secure.pitstop.local\n\n# Corpo da resposta pelo HTTPS (o -k aceita o certificado autoassinado; --resolve envia o nome correto, o SNI)\n$ curl -sk --resolve secure.pitstop.local:8443:127.0.0.1 https://secure.pitstop.local:8443/\nweb recebeu /\n\n# Certificado entregue: não deve mais ser o certificado falso padrão do Controller (saída aproximada)\n$ curl -skv --resolve secure.pitstop.local:8443:127.0.0.1 https://secure.pitstop.local:8443/ 2>&1 | grep -iE 'subject:|issuer:'\n*  subject: (pode vir vazio)\n*  issuer: (pode vir vazio)",
      },
    ],
    commands: [
      {
        cmd: "kubectl get clusterissuer",
        note: "confirma a fonte de certificados",
      },
      {
        cmd: "kubectl describe certificate pitstop-tls",
        note: "mostra emissão, eventos e renovação",
      },
      {
        cmd: "kubectl get certificate,certificaterequest,order,challenge -A",
        note: "investiga o fluxo (Order e Challenge só existem com ACME)",
      },
      {
        cmd: "kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8443:443",
        note: "expõe o HTTPS do Controller localmente (em outro terminal, porque fica em primeiro plano)",
      },
      {
        cmd: "curl -sk --resolve secure.pitstop.local:8443:127.0.0.1 https://secure.pitstop.local:8443/",
        note: "mostra o corpo da resposta, enviando o nome correto (SNI); `-k` aceita o certificado autoassinado",
      },
      {
        cmd: "minikube delete -p lab",
        note: "remove o cluster `lab` ao fim da etapa, antes de subir o perfil `mesh` da Etapa 10",
      },
    ],
    handsOn: [
      "No cluster `lab`, confirme que o `apps.yaml` e o ConfigMap `backend-py` da Etapa 08 continuam aplicados (`kubectl get svc web`). Se você os apagou, recrie com `kubectl create configmap backend-py --from-file=backend.py` e `kubectl apply -f apps.yaml`, usando os arquivos da pasta `etapa08/`. Instale o cert-manager com os três comandos `helm` do exemplo e confirme com `kubectl get pods -n cert-manager` os três Pods `Running`.",
      "Aplique `clusterissuer-selfsigned.yaml` e `ingress-tls.yaml`. Rode `kubectl get certificate -w` e **observe** `READY` passar de `False` para `True`. Confirme o Secret com `kubectl get secret pitstop-tls` e **observe** o tipo `kubernetes.io/tls`.",
      "Em outro terminal, abra o port-forward da porta 443 (`kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8443:443`). No terminal original, rode primeiro `curl -sk --resolve secure.pitstop.local:8443:127.0.0.1 https://secure.pitstop.local:8443/` e **observe** a resposta `web recebeu /`. Depois rode o mesmo comando com `-v` e `2>&1 | grep -iE 'subject:|issuer:'` e **observe** que o certificado entregue já não é o `Kubernetes Ingress Controller Fake Certificate` do Controller (o certificado do cert-manager não define nome comum, então `subject` e `issuer` podem vir vazios; o nome do site aparece na extensão `subjectAltName`, que o passo 4 mostra).",
      "Inspecione o certificado do Secret com o `openssl` do exemplo e **observe** a linha `issuer=`, o nome DNS em `subjectAltName` e a validade.",
      "Aplique `certificate-renova.yaml`, espere cerca de 6 minutos e rode `kubectl describe certificate renova-teste`. **Observe** um evento de renovação e `Revision: 2` no status.",
      "Demonstre que base64 não é criptografia: `kubectl get secret pitstop-tls -o jsonpath='{.data.tls\\.key}' | base64 -d | head -n 1` mostra o início da chave privada em texto. Explique quais controles de acesso (RBAC) protegem o Secret.",
      "Limpe tudo da Etapa 08 e desta: encerre o port-forward (Ctrl+C), rode `kubectl delete -f ingress-tls.yaml -f certificate-renova.yaml`, `kubectl delete secret pitstop-tls renova-teste-tls`, `kubectl delete -f ../etapa08/apps.yaml`, `kubectl delete configmap backend-py` e, por fim, `minikube delete -p lab`. Dois clusters ligados ao mesmo tempo pesam, e a Etapa 10 sobe um perfil novo (`mesh`) com 4 CPUs e 8 GB.",
    ],
    tip: "Quando a emissão travar, leia os eventos do Certificate e, com ACME, os do Challenge. A causa quase sempre é DNS incorreto, `ingressClassName` errada ou bloqueio do caminho do desafio HTTP-01. Use o staging enquanto testa e só mude para produção quando DNS e rota estiverem corretos.",
    takeaway:
      "O cert-manager transforma o certificado em estado desejado: você declara domínio e destino, e o controlador emite, armazena no Secret e renova antes de vencer.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa09-cert-manager.svg",
            alt: "O cert-manager no centro, ligado acima a vários Issuers (Let's Encrypt de staging e de produção, Vault e outros) e abaixo a dois Certificates, cada um gerando um Secret com o par de chaves assinado.",
            caption:
              "O Certificate diz qual nome precisa de certificado e qual Issuer assina; o cert-manager pede, guarda o resultado num Secret e renova antes do vencimento. Neste laboratório, o Issuer é um ClusterIssuer autoassinado.",
          },
        ],
        credit: "Diagrama: cert-manager.io, The cert-manager Authors, Apache 2.0",
      },
    ],
  },
  {
    id: "m10",
    num: "10",
    navTitle: "Service Mesh",
    tag: "istio + sidecars",
    title: "Service Mesh e a arquitetura do Istio",
    lead: "Uma aplicação de e-commerce virou vinte microsserviços. Cada chamada interna é agora uma chamada de rede, sujeita a latência, falhas e a perguntas que ninguém respondeu: o serviço que chamou é quem diz ser? Quantas vezes tentar de novo antes de desistir? Como saber onde o pedido ficou lento? Cada equipe implementa timeout, retry, criptografia e telemetria na sua linguagem, de um jeito diferente, e o comportamento da rede se torna inconsistente. A Service Mesh move essas políticas para proxies controlados de forma central.",
    concept: [
      "No modelo **sidecar** do Istio, um proxy **Envoy** é injetado em cada Pod, ao lado do container da aplicação, e intercepta o tráfego de entrada e de saída. A aplicação segue focada na regra de negócio.",
      "- O **Data Plane** é formado pelos proxies Envoy: eles processam as requisições e aplicam roteamento, resiliência, segurança e telemetria.",
      "- O **Control Plane** é o **Istiod**: observa serviços e recursos do Istio, traduz as regras de alto nível para a configuração do Envoy, distribui descoberta de serviços e emite as identidades (certificados) das cargas de trabalho.",
      "- A injeção é habilitada por namespace (`istio-injection=enabled`) e acontece na criação do Pod: Pods já existentes só ganham o sidecar quando são recriados (por exemplo, com `kubectl rollout restart`).",
      "A abstração tem custo: cada sidecar consome CPU e memória, adiciona latência por salto e a malha é uma plataforma adicional para atualizar e diagnosticar. Para poucos serviços, o benefício pode não compensar. O Istio também oferece o modo ambient, sem sidecars; este guia usa sidecars porque o caminho do tráfego fica visível.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "Service Mesh",
        d: "camada que padroniza retry, timeout, mTLS e telemetria fora do código das aplicações.",
        color: "blue",
      },
      {
        t: "Envoy (sidecar)",
        d: "o proxy ao lado de cada workload; intercepta e processa o tráfego.",
        color: "signal",
      },
      {
        t: "Data Plane",
        d: "o conjunto de proxies que aplicam as políticas.",
        color: "violet",
      },
      {
        t: "Istiod (Control Plane)",
        d: "distribui configuração, descoberta e identidades.",
        color: "ember",
      },
      {
        t: "Injeção por namespace",
        d: "o label `istio-injection=enabled` e a recriação dos Pods.",
        color: "blue",
      },
      {
        t: "Overhead",
        d: "recursos extras, um salto a mais e mais uma plataforma para operar.",
        color: "signal",
      },
    ],
    examplesTitle: "Instalação, injeção e validação do sidecar",
    examples: [
      {
        label: "app.yaml",
        lang: "yaml",
        code: '# app.yaml\napiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: web                                # identidade do cliente (usada na Etapa 12)\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api-v1\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: api\n      version: v1\n  template:\n    metadata:\n      labels:\n        app: api                           # label recomendado pelo Istio\n        version: v1                        # versão: base dos subsets da Etapa 11\n    spec:\n      containers:\n        - name: api\n          image: python:3.12-alpine\n          command: ["python", "/app/backend.py"]\n          env:\n            - name: NAME\n              value: api-v1                # nome devolvido nas respostas\n          ports:\n            - containerPort: 3000\n          volumeMounts:\n            - name: code\n              mountPath: /app\n      volumes:\n        - name: code\n          configMap:\n            name: backend-py\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: api\nspec:\n  selector:\n    app: api                               # seleciona todas as versões da api\n  ports:\n    - name: http                           # o nome http informa o protocolo à malha\n      port: 80\n      targetPort: 3000\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      serviceAccountName: web              # o cliente chama a api com a identidade "web"\n      containers:\n        - name: web\n          image: curlimages/curl\n          command: ["sleep", "86400"]      # fica parado; usaremos kubectl exec para chamar a api',
        intro:
          "O laboratório usa um namespace `demo` com uma aplicação `api` (versão v1) e um cliente `web`. Copie o `backend.py` da Etapa 03 para `etapa10/` e rode todos os comandos abaixo a partir dessa pasta.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# Estando em etapa10/: baixa o Istio (traz o istioctl e os manifestos de exemplo) e instala o perfil demo\n$ curl -L https://istio.io/downloadIstio | sh -\n# entra na pasta baixada só para pôr o istioctl no PATH (caminho absoluto) e volta para etapa10/\n$ cd istio-* && export PATH=$PWD/bin:$PATH && cd -\n$ minikube start -p mesh --cpus=4 --memory=8192\n$ istioctl install --set profile=demo -y\n# saída aproximada\n✔ Istio core installed\n✔ Istiod installed\n✔ Egress gateways installed\n✔ Ingress gateways installed\n✔ Installation complete\n\n# Ainda em etapa10/ (onde estão backend.py e app.yaml):\n# aplica a aplicação ANTES de habilitar a injeção: os Pods nascem sem sidecar (1/1)\n$ kubectl create namespace demo\n$ kubectl create configmap backend-py --from-file=backend.py -n demo\n$ kubectl apply -f app.yaml -n demo\n$ kubectl get pods -n demo\nNAME            READY   STATUS    RESTARTS   AGE\napi-v1-xxxx     1/1     Running   0          20s\nweb-xxxx        1/1     Running   0          20s\n\n# Habilita a injeção e recria os Pods: agora cada um tem o app e o proxy (2/2)\n$ kubectl label namespace demo istio-injection=enabled\n$ kubectl rollout restart deployment -n demo\n$ kubectl get pods -n demo\nNAME            READY   STATUS    RESTARTS   AGE\napi-v1-yyyy     2/2     Running   0          15s\nweb-yyyy        2/2     Running   0          15s",
        note: "`READY 2/2` indica a aplicação e o proxy no mesmo Pod. O perfil `demo` serve ao laboratório (ele liga logs e traces em níveis altos e instala gateways extras); não é a configuração padrão de produção. O `export PATH` vale só para o terminal em que foi executado: em um terminal novo, repita-o (`export PATH=$PWD/bin:$PATH` dentro da pasta `istio-*`). Os manifestos de exemplo que a Etapa 12 usa ficam em `etapa10/istio-*/samples/addons`.",
      },
    ],
    commands: [
      {
        cmd: "istioctl install --set profile=demo -y",
        note: "instala um Istio de laboratório",
      },
      {
        cmd: "kubectl label namespace demo istio-injection=enabled",
        note: "habilita a injeção clássica por sidecar",
      },
      {
        cmd: "kubectl rollout restart deployment -n demo",
        note: "recria os Pods para que recebam o sidecar",
      },
      {
        cmd: "istioctl proxy-status",
        note: "confere se os proxies estão sincronizados com o Istiod (`SYNCED`)",
      },
      {
        cmd: 'kubectl get pod -n demo -l app=api -o jsonpath=\'{range .items[0].spec.containers[*]}{.name}{"\\t"}{.resources.requests}{"\\n"}{end}\'',
        note: "mostra os recursos reservados por cada container, inclusive `istio-proxy`",
      },
      {
        cmd: "minikube delete -p mesh",
        note: "remove o cluster do laboratório ao final das Etapas 10 a 12",
      },
    ],
    handsOn: [
      "Entre em `etapa10/` e rode os três primeiros comandos do exemplo (download, `cd istio-* && export PATH=$PWD/bin:$PATH && cd -` e `minikube start`). Confirme com `pwd` que você voltou para `etapa10/`, instale o Istio com `istioctl install --set profile=demo -y` e **observe** `Installation complete`. Rode `kubectl get pods -n istio-system` para ver o `istiod` e os gateways em `Running`.",
      "Ainda em `etapa10/`, crie o namespace `demo`, o ConfigMap e aplique `app.yaml`. **Observe** `READY 1/1` nos dois Pods, sem sidecar.",
      "Habilite a injeção, rode `kubectl rollout restart deployment -n demo` e **observe** `READY 2/2`. Rode `kubectl get pod -n demo -l app=api -o jsonpath='{.items[0].spec.containers[*].name}'` e **observe** os containers `api` e `istio-proxy`.",
      "Rode `istioctl proxy-status` e **observe** os proxies de `api-v1` e `web` em `SYNCED`. Rode também o comando de recursos reservados e registre o custo do proxy em CPU e memória.",
      "Teste a chamada interna: `kubectl exec -n demo deploy/web -c web -- curl -s http://api/`. **Observe** `api-v1 recebeu /`, agora passando por dois proxies.",
      "Crie o namespace `legacy` sem o label (`kubectl create namespace legacy`), copie o ConfigMap (`kubectl create configmap backend-py --from-file=backend.py -n legacy`) e aplique `app.yaml` com `-n legacy`. **Observe** `READY 1/1` e explique onde as políticas da malha deixam de atuar: em Pods sem sidecar, nenhuma política do Istio é aplicada.",
      "Mantenha o cluster `mesh` e o namespace `demo` para as Etapas 11 e 12. Limpe o `legacy` com `kubectl delete namespace legacy`.",
    ],
    tip: "Service Mesh não conserta código ruim nem dependência lenta: ela padroniza o comportamento da rede e oferece sinais melhores para encontrar o problema. Antes de adotá-la, descreva um cenário do seu sistema em que a complexidade da malha não compensaria; se não encontrar nenhum, provavelmente você ainda não pesou o custo.",
    takeaway:
      "O Istio separa comunicação de negócio: o Envoy executa as políticas no Data Plane e o Istiod coordena configuração e identidade no Control Plane, ao custo de recursos e de operação.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa10-istio-arquitetura.svg",
            alt: "Dentro da malha, os Services A e B têm cada um um proxy ao lado; o tráfego de entrada, o tráfego entre serviços e o de saída passam pelos proxies, e o istiod, no control plane, envia descoberta, configuração e certificados a eles.",
            caption:
              "O data plane são os proxies Envoy ao lado de cada Pod, por onde passa todo o tráfego; o control plane é o istiod, que não toca nas requisições e só distribui configuração e certificados.",
          },
        ],
        credit: "Diagrama: istio.io, Istio Authors, Apache 2.0",
      },
    ],
  },
  {
    id: "m11",
    num: "11",
    navTitle: "Tráfego no Istio",
    tag: "canary + mirror",
    title: "VirtualService, DestinationRule e deploy gradual",
    lead: "A versão 2 da API de pedidos está pronta. Liberá-la para 100% dos usuários de uma vez é arriscado: um erro que os testes não pegaram derruba as vendas inteiras, e a reversão exige um novo deploy. Seria melhor enviar uma pequena fração do tráfego real para a versão nova, observar erros e latência e só então ampliar. Fazer essa divisão por porcentagem exata, ou por características da requisição, não é algo que um Service do Kubernetes sabe fazer, porque ele distribui pelo número de Pods.",
    concept: [
      "No Istio, duas regras trabalham juntas. A **DestinationRule** nomeia grupos de Pods (**subsets**, selecionados por labels como `version: v1`) e define políticas de conexão para o destino. O **VirtualService** decide como cada chamada percorre esses grupos: pesos, condições por header ou path, retries, timeouts, espelhamento e falhas simuladas. As regras são aplicadas pelo sidecar do cliente, então só valem para chamadas que passam por um proxy da malha.",
      "Três formas de testar uma versão:",
      "- **Canary por peso** envia uma pequena porcentagem do tráfego real para a versão nova e a amplia gradualmente. Os pesos de uma rota precisam somar 100.",
      "- **A/B testing** usa características da requisição (header, cookie, path) para segmentar usuários, por exemplo enviando sempre um usuário de teste para a v2.",
      "- **Traffic mirroring** duplica as chamadas para a versão nova e descarta a resposta dela: o cliente continua recebendo a v1, e a v2 recebe carga real sem risco para o usuário.",
      "Resiliência no mesmo recurso: **retries** ajudam em falhas transitórias, mas multiplicam a carga se não forem limitados. `attempts` é o número de novas tentativas depois da primeira, `perTryTimeout` limita cada tentativa e o `timeout` da rota limita o tempo total, que precisa comportar todas as tentativas. **Circuit breaking** (na DestinationRule, com `outlierDetection`) ejeta endpoints que falham seguidamente, para evitar cascatas. A injeção de falhas (`fault`, com atraso ou aborto) permite testar a reação das aplicações.",
      "Peso é o mecanismo de entrega, não o critério de sucesso: a decisão de ampliar o canário vem de taxa de erro, latência e métricas de negócio.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "DestinationRule",
        d: "define subsets (grupos por label) e políticas do destino (`networking.istio.io/v1`).",
        color: "blue",
      },
      {
        t: "VirtualService",
        d: "define rotas, pesos, matches, retries, timeout, mirror e fault (`networking.istio.io/v1`).",
        color: "signal",
      },
      {
        t: "Canary, A/B e mirroring",
        d: "divisão por peso, segmentação por condição e cópia do tráfego.",
        color: "violet",
      },
      {
        t: "Retries e timeout",
        d: "o timeout total deve ser maior que (`attempts` + 1) × `perTryTimeout`, porque `attempts` não conta a primeira tentativa.",
        color: "ember",
      },
      {
        t: "Circuit breaking (`outlierDetection`)",
        d: "ejeta endpoints que falham em sequência.",
        color: "blue",
      },
      {
        t: "Ordem das regras",
        d: "o primeiro `match` que casa vence; a rota padrão vai por último.",
        color: "signal",
      },
    ],
    examplesTitle: "Noventa por cento v1, dez por cento v2",
    examples: [
      {
        label: "api-v2.yaml",
        lang: "yaml",
        code: '# api-v2.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api-v2\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: api\n      version: v2\n  template:\n    metadata:\n      labels:\n        app: api                           # o Service "api" seleciona este Pod também\n        version: v2                        # distingue a v2 da v1\n    spec:\n      containers:\n        - name: api\n          image: python:3.12-alpine\n          command: ["python", "/app/backend.py"]\n          env:\n            - name: NAME\n              value: api-v2\n          ports:\n            - containerPort: 3000\n          volumeMounts:\n            - name: code\n              mountPath: /app\n      volumes:\n        - name: code\n          configMap:\n            name: backend-py',
        intro:
          "Primeiro, a versão 2 da aplicação, igual à v1 exceto pelo nome e pelo label `version`.",
      },
      {
        label: "canary.yaml",
        lang: "yaml",
        code: '# canary.yaml\napiVersion: networking.istio.io/v1\nkind: DestinationRule\nmetadata:\n  name: api\nspec:\n  host: api.demo.svc.cluster.local         # nome completo do Service, para evitar ambiguidade\n  subsets:\n    - name: v1\n      labels:\n        version: v1                        # Pods com este label formam o subset v1\n    - name: v2\n      labels:\n        version: v2\n---\napiVersion: networking.istio.io/v1\nkind: VirtualService\nmetadata:\n  name: api\nspec:\n  hosts:\n    - api.demo.svc.cluster.local           # chamadas a este host passam por estas regras\n  http:\n    - match:                               # regra 1: avaliada primeiro\n        - headers:\n            x-usuario:\n              exact: teste                 # quem envia "x-usuario: teste"...\n      route:\n        - destination:\n            host: api.demo.svc.cluster.local\n            subset: v2                     # ...sempre vai para a v2 (A/B)\n    - route:                               # regra 2: todo o resto\n        - destination:\n            host: api.demo.svc.cluster.local\n            subset: v1\n          weight: 90                       # 90% para a v1\n        - destination:\n            host: api.demo.svc.cluster.local\n            subset: v2\n          weight: 10                       # 10% para a v2 (canary); os pesos somam 100\n      timeout: 2s                          # tempo total máximo da chamada\n      retries:\n        attempts: 2                        # até 2 novas tentativas depois da primeira\n        perTryTimeout: 500ms               # 3 tentativas x 500ms = 1,5s, dentro do timeout de 2s',
      },
      {
        label: "mirror.yaml",
        lang: "yaml",
        code: "# mirror.yaml\napiVersion: networking.istio.io/v1\nkind: VirtualService\nmetadata:\n  name: api                                # substitui o VirtualService anterior\nspec:\n  hosts:\n    - api.demo.svc.cluster.local\n  http:\n    - route:\n        - destination:\n            host: api.demo.svc.cluster.local\n            subset: v1                     # o cliente continua recebendo a v1\n      mirror:\n        host: api.demo.svc.cluster.local\n        subset: v2                         # cópia da chamada enviada à v2; a resposta é descartada\n      mirrorPercentage:\n        value: 100.0                       # espelha 100% das chamadas",
        note: "O manifesto abaixo é só leitura: ele mostra o circuit breaking com ejeção de endpoints, que só se manifesta quando um backend devolve erros 5xx em sequência.",
      },
      {
        label: "circuit-breaker.yaml",
        lang: "yaml",
        code: "# circuit-breaker.yaml\napiVersion: networking.istio.io/v1\nkind: DestinationRule\nmetadata:\n  name: api-cb\nspec:\n  host: api.demo.svc.cluster.local\n  trafficPolicy:\n    outlierDetection:\n      consecutive5xxErrors: 3              # 3 erros 5xx seguidos ejetam o endpoint\n      interval: 10s                        # frequência da análise\n      baseEjectionTime: 30s                # tempo mínimo fora da rotação\n      maxEjectionPercent: 50               # no máximo metade dos endpoints ejetada",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ kubectl apply -f api-v2.yaml -n demo\n$ kubectl apply -f canary.yaml -n demo\n$ istioctl analyze -n demo\n✔ No validation issues found when analyzing namespace: demo.\n\n# Conta 100 respostas a partir do cliente da malha (saída aproximada: os números variam)\n$ kubectl exec -n demo deploy/web -c web -- sh -c 'for i in $(seq 1 100); do curl -s http://api/; done' | sort | uniq -c\n     91 api-v1 recebeu /\n      9 api-v2 recebeu /\n\n# O header de teste sempre vai para a v2\n$ kubectl exec -n demo deploy/web -c web -- curl -s -H 'x-usuario: teste' http://api/\napi-v2 recebeu /",
      },
    ],
    commands: [
      {
        cmd: "kubectl apply -f canary.yaml -n demo",
        note: "publica subsets e a divisão de tráfego",
      },
      {
        cmd: "istioctl analyze -n demo",
        note: "detecta configurações inválidas (labels sem Pods, hosts inexistentes)",
      },
      {
        cmd: "kubectl exec -n demo deploy/web -c web -- sh -c 'for i in $(seq 1 100); do curl -s http://api/; done' | sort | uniq -c",
        note: "mede a proporção",
      },
      {
        cmd: "kubectl get virtualservice,destinationrule -n demo",
        note: "confere os recursos",
      },
      {
        cmd: "kubectl logs -n demo deploy/api-v2 -c api --tail 5",
        note: "mostra as requisições recebidas pela v2 (inclusive as espelhadas)",
      },
      {
        cmd: "kubectl delete virtualservice api -n demo",
        note: "reverte para o balanceamento comum do Service (rollback do canary)",
      },
    ],
    handsOn: [
      "Aplique `api-v2.yaml` e confirme `READY 2/2` nos dois Pods `api`. Rode `kubectl get endpointslices -n demo -l kubernetes.io/service-name=api` e **observe** dois endpoints: o Service seleciona as duas versões.",
      "Sem nenhum VirtualService, conte 100 respostas com o laço do exemplo. **Observe** uma divisão perto de 50 e 50, o comportamento do Service puro.",
      "Aplique `canary.yaml`, rode `istioctl analyze -n demo` e conte 100 respostas de novo. **Observe** cerca de 90 para a v1 e 10 para a v2 (a divisão é estatística, então os números variam).",
      "Envie `curl -s -H 'x-usuario: teste' http://api/` pelo cliente `web` várias vezes. **Observe** `api-v2` em todas as respostas, e o mesmo comando sem o header voltando à divisão 90/10.",
      "Aplique `mirror.yaml`, envie 10 chamadas pelo cliente e **observe** que todas as respostas são `api-v1`. Em seguida rode `kubectl logs -n demo deploy/api-v2 -c api --tail 12` e **observe** as 10 requisições chegando à v2, mesmo sem o cliente receber a resposta dela.",
      "Pratique o rollback: `kubectl delete virtualservice api -n demo` e conte 100 respostas. **Observe** a volta à divisão do Service. Se algo parecer errado, rode `istioctl analyze` antes de atribuir o desvio ao proxy.",
      "Mantenha o cluster para a Etapa 12 e deixe-o sem VirtualService, como após o rollback do passo 6. Se você reaplicar `canary.yaml` ou `mirror.yaml`, as respostas da Etapa 12 passam a vir também da v2 e os contadores lidos só no `api-v1` ficam diferentes dos mostrados lá.",
    ],
    tip: "Se todo o tráfego cai em uma versão só, confira nesta ordem: labels dos Pods contra os subsets, o `host` do VirtualService contra o Service, e a ordem das regras de `match`. Lembre também que as regras só valem para chamadas feitas por um cliente com sidecar; um cliente fora da malha ignora o VirtualService.",
    takeaway:
      "A DestinationRule define os grupos disponíveis e o VirtualService decide como cada chamada percorre esses grupos: juntos, tornam o deploy gradual observável e reversível.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa11-istio-versoes.svg",
            alt: "O Envoy ao lado do serviço A recebe regras de roteamento do Pilot e envia 99% das chamadas para a versão v1.5 do serviço B e 1% para a versão v2.0-alpha.",
            caption:
              "Canário por peso: o proxy do cliente divide as chamadas entre os subsets do serviço B, e a versão nova recebe só uma fração do tráfego. O desenho é de uma versão antiga da documentação; o Pilot, que distribui as regras, hoje faz parte do istiod.",
          },
        ],
        credit: "Diagrama: istio.io, Istio Authors, Apache 2.0",
      },
    ],
  },
  {
    id: "m12",
    num: "12",
    navTitle: "mTLS e observabilidade",
    tag: "identidade + métricas",
    title: "mTLS, autorização e observabilidade na malha",
    lead: 'O cluster está dentro de uma rede privada, então "ninguém de fora consegue chamar". Na prática, um único Pod comprometido ou mal configurado consegue chamar qualquer outro serviço, e o tráfego interno viaja em texto puro. Além disso, quando um pedido fica lento em uma cadeia de cinco serviços, ninguém sabe qual deles consumiu o tempo. Rede interna não é sinônimo de rede confiável, e é preciso autenticar quem chama, restringir o que pode chamar e enxergar o caminho do pedido.',
    concept: [
      "O Istio autentica as cargas de trabalho com certificados de curta duração emitidos pelo Istiod, criptografa o tráfego entre sidecars com **mTLS** (as duas pontas apresentam identidade) e autoriza chamadas pela identidade, que é derivada da ServiceAccount do Pod (`cluster.local/ns/demo/sa/web`).",
      "- **PeerAuthentication** controla o mTLS. `PERMISSIVE` aceita tráfego com e sem mTLS e ajuda nas migrações; `STRICT` rejeita tráfego sem identidade da malha. A política com nome `default` em um namespace vale para ele todo.",
      "- **AuthorizationPolicy** responde o que uma identidade autenticada pode fazer, por origem, método e path. Quando existe uma política `ALLOW` para uma carga de trabalho, toda requisição que não casa com nenhuma regra é negada (HTTP 403).",
      "- **Observabilidade**: o Envoy registra volume, código de resposta e duração de cada chamada. O Prometheus armazena métricas, o Grafana apresenta painéis, o Jaeger reconstrói traces e o Kiali exibe a topologia, os erros e o estado do mTLS.",
      "- **Tracing distribuído**: o proxy cria e lê headers de rastreamento, mas a aplicação precisa propagá-los nas chamadas seguintes (`x-request-id`, `x-b3-traceid`, `x-b3-spanid`, `x-b3-parentspanid`, `x-b3-sampled`, `x-b3-flags`, `b3` e, para W3C, `traceparent` e `tracestate`). Sem propagação, o trace quebra mesmo com sidecars saudáveis. Coletar traces exige configurar um provedor de tracing na malha, o que fica fora do laboratório; aqui você verifica os headers e as métricas.",
      "Autenticação responde quem é; autorização responde o que pode fazer. O mTLS não substitui uma política de acesso.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "mTLS",
        d: "as duas pontas se autenticam e criptografam o salto entre os sidecars.",
        color: "blue",
      },
      {
        t: "PeerAuthentication (`security.istio.io/v1`)",
        d: "modo `PERMISSIVE` (migração) ou `STRICT` (exige a malha).",
        color: "signal",
      },
      {
        t: "AuthorizationPolicy (`security.istio.io/v1`)",
        d: "libera origem, método e path mínimos; requisições fora das regras `ALLOW` são negadas.",
        color: "violet",
      },
      {
        t: "Identidade (principal)",
        d: "derivada da ServiceAccount; só existe quando há mTLS.",
        color: "ember",
      },
      {
        t: "Métricas do Envoy",
        d: "`istio_requests_total` registra volume e códigos de resposta por origem e destino.",
        color: "blue",
      },
      {
        t: "Propagação de headers",
        d: "responsabilidade da aplicação, indispensável para traces completos.",
        color: "signal",
      },
    ],
    examplesTitle: "MTLS estrito, política por identidade e métricas",
    examples: [
      {
        label: "mtls-strict.yaml",
        lang: "yaml",
        code: "# mtls-strict.yaml\napiVersion: security.istio.io/v1\nkind: PeerAuthentication\nmetadata:\n  name: default                            # política do namespace inteiro\n  namespace: demo\nspec:\n  mtls:\n    mode: STRICT                           # rejeita tráfego sem mTLS",
        intro:
          "As duas políticas ficam em arquivos separados para serem aplicadas e testadas uma de cada vez.",
      },
      {
        label: "authz-api.yaml",
        lang: "yaml",
        code: '# authz-api.yaml\napiVersion: security.istio.io/v1\nkind: AuthorizationPolicy\nmetadata:\n  name: api-read\n  namespace: demo\nspec:\n  selector:\n    matchLabels:\n      app: api                             # vale para os Pods da api\n  action: ALLOW                            # o que não casar com as regras abaixo é negado\n  rules:\n    - from:\n        - source:\n            principals: ["cluster.local/ns/demo/sa/web"]   # só a identidade "web"\n      to:\n        - operation:\n            methods: ["GET"]               # só leitura\n            paths: ["/api/*"]              # só caminhos sob /api/',
        note: "Para provar que a decisão é por identidade, um segundo cliente com outra ServiceAccount (a `default`), criado no namespace `demo` para receber o sidecar.",
      },
      {
        label: "outro.yaml",
        lang: "yaml",
        code: '# outro.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: outro\n  namespace: demo                          # no namespace com injeção, para ganhar o sidecar\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: outro\n  template:\n    metadata:\n      labels:\n        app: outro\n    spec:\n      containers:\n        - name: outro\n          image: curlimages/curl\n          command: ["sleep", "86400"]      # usa a ServiceAccount default do namespace',
        note: "Com a `api-v2` no ar, o Service `api` seleciona as duas versões, então as respostas e os contadores abaixo podem vir da v1 ou da v2 (nos exemplos aparece `api-v1`). Para obter exatamente as saídas mostradas, mantenha o cluster sem VirtualService, como após o rollback da Etapa 11.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# 1) Em PERMISSIVE (padrão), o cliente fora da malha consegue chamar a api\n$ kubectl create namespace legacy\n$ kubectl run curl -n legacy --image=curlimages/curl --restart=Never -- sleep 3600\n$ kubectl exec -n legacy curl -- curl -s http://api.demo.svc.cluster.local/\napi-v1 recebeu /\n\n# 2) Em STRICT, o mesmo cliente é recusado (saída aproximada: a mensagem varia)\n$ kubectl apply -f mtls-strict.yaml\n$ kubectl exec -n legacy curl -- curl -s http://api.demo.svc.cluster.local/\ncurl: (56) Recv failure: Connection reset by peer\n\n# 3) A identidade chega ao backend no cabeçalho X-Forwarded-Client-Cert\n$ kubectl exec -n demo deploy/web -c web -- curl -s http://api/api/headers | grep -iE 'x-request-id|x-forwarded-client-cert'\nX-Request-Id: 6f1c...\nX-Forwarded-Client-Cert: By=spiffe://cluster.local/ns/demo/sa/default;Hash=...;Subject=\"\";URI=spiffe://cluster.local/ns/demo/sa/web\n\n# 4) Cria o segundo cliente e aplica a autorização; depois testa identidade, método e path\n$ kubectl apply -f outro.yaml\n$ kubectl apply -f authz-api.yaml\n$ kubectl exec -n demo deploy/web -c web -- curl -s -o /dev/null -w '%{http_code}\\n' http://api/api/ping\n200\n$ kubectl exec -n demo deploy/web -c web -- curl -s -o /dev/null -w '%{http_code}\\n' http://api/\n403\n$ kubectl exec -n demo deploy/web -c web -- curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://api/api/ping\n403\n$ kubectl exec -n demo deploy/outro -c outro -- curl -s -o /dev/null -w '%{http_code}\\n' http://api/api/ping\n403\n\n# 5) Métricas do Envoy, direto do sidecar da api (saída aproximada)\n$ kubectl exec -n demo deploy/api-v1 -c istio-proxy -- pilot-agent request GET stats/prometheus | grep '^istio_requests_total' | head -n 3\nistio_requests_total{response_code=\"200\",destination_workload=\"api-v1\",...} 7\nistio_requests_total{response_code=\"403\",destination_workload=\"api-v1\",...} 3",
        note: "STRICT sem políticas e identidades testadas pode bloquear a produção: migre de `PERMISSIVE` para `STRICT` por etapas, observando quais clientes ainda falam sem mTLS, e restrinja o acesso aos poucos.",
      },
    ],
    commands: [
      {
        cmd: "kubectl apply -f mtls-strict.yaml",
        note: "aplica o mTLS estrito no namespace `demo`",
      },
      {
        cmd: "kubectl apply -f authz-api.yaml",
        note: "aplica a política de autorização da api",
      },
      {
        cmd: "kubectl get peerauthentication,authorizationpolicy -A",
        note: "lista as políticas de segurança",
      },
      {
        cmd: "istioctl proxy-config secret deploy/api-v1 -n demo",
        note: "mostra os certificados ativos no proxy (um `default` e o `ROOTCA`)",
      },
      {
        cmd: "kubectl exec -n demo deploy/api-v1 -c istio-proxy -- pilot-agent request GET stats/prometheus",
        note: "lê as métricas do Envoy sem instalar nada",
      },
      {
        cmd: "kubectl apply -f istio-*/samples/addons/prometheus.yaml -f istio-*/samples/addons/kiali.yaml",
        note: "(a partir de `etapa10/`, onde o Istio foi baixado): instala Prometheus e Kiali para o grafo da malha",
      },
      {
        cmd: "istioctl dashboard kiali",
        note: "abre o grafo da malha, com o estado de mTLS (alternativa sem navegador local: `kubectl port-forward -n istio-system svc/kiali 20001:20001`)",
      },
    ],
    handsOn: [
      "Com o cluster `mesh`, crie o namespace `legacy` e um Pod de teste sem sidecar (comandos do exemplo). Chame a api e **observe** que, em `PERMISSIVE`, a chamada sem mTLS funciona.",
      "Aplique somente a `PeerAuthentication`: `kubectl apply -f mtls-strict.yaml`. Repita a chamada do `legacy` e **observe** a recusa. Repita a chamada pelo `web` (que tem sidecar) e **observe** que continua funcionando.",
      "Aplique `outro.yaml` (ele já declara `namespace: demo`) e confirme que o Pod `outro` tem `READY 2/2`. Antes de aplicar a política, faça `kubectl exec -n demo deploy/outro -c outro -- curl -s -o /dev/null -w '%{http_code}\\n' http://api/api/ping` e **observe** `200`, porque ainda não há regra de autorização. Aplique `authz-api.yaml`, rode as quatro chamadas do item 4 do exemplo e **observe** `200` apenas para `GET /api/ping` vindo do `web`, e `403` para outro path, outro método e outra identidade (o `outro`).",
      "Rode a chamada ao `/api/headers` e **observe** que o proxy acrescentou `X-Request-Id` e `X-Forwarded-Client-Cert` com a identidade do chamador. Explique por que, para um trace completo, a aplicação precisa copiar esses headers para as chamadas que ela mesma fizer.",
      "Rode `istioctl proxy-config secret deploy/api-v1 -n demo` e leia as métricas do Envoy no sidecar. **Observe** contadores `istio_requests_total` separados por código de resposta, inclusive os `403` que você provocou. Como a api-v2 também atende ao Service, repita a leitura em `deploy/api-v2` e some os contadores se as chamadas tiverem ido para as duas.",
      "Opcional: instale Prometheus e Kiali (`samples/addons` dentro da pasta `istio-*` em `etapa10/`), gere tráfego com um laço de `curl` e abra `istioctl dashboard kiali`. **Observe** o grafo `web` para `api` e o ícone de cadeado do mTLS.",
      "Limpe tudo ao fim das Etapas 10 a 12: `minikube delete -p mesh`.",
    ],
    tip: 'Mude uma política de cada vez e teste os dois lados: uma chamada que deve passar e outra que deve falhar. Um `STRICT` que "funciona" só com os clientes que você lembrou de testar costuma quebrar o cliente que você esqueceu.',
    takeaway:
      "Na malha, identidade e telemetria viram propriedades de cada salto: o mTLS autentica, a AuthorizationPolicy restringe pela identidade e a observabilidade explica o percurso, desde que a aplicação propague os headers de rastreamento.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa12-istio-seguranca.svg",
            alt: "Arquitetura de segurança do Istio: o tráfego entre proxies usa mTLS, cada proxy aplica autorização local e guarda um certificado, e o istiod no control plane reúne a autoridade certificadora e as políticas de autenticação e autorização.",
            caption:
              "O istiod emite a identidade de cada carga de trabalho (derivada da ServiceAccount) e distribui as políticas; quem cifra com mTLS e aplica a `AuthorizationPolicy` em cada requisição é o proxy ao lado do Pod.",
          },
        ],
        credit: "Diagrama: istio.io, Istio Authors, Apache 2.0",
      },
    ],
  },
  {
    id: "m13",
    num: "13",
    navTitle: "Alta disponibilidade",
    tag: "slo + spof + vrrp",
    title: "Alta disponibilidade: SLA, SLO, SPOF e redundância",
    lead: "Às 2h da manhã, a máquina que hospeda o único balanceador da loja perde a fonte de alimentação. Os dez backends estão saudáveis, mas ninguém consegue acessá-los, porque tudo passa por aquele balanceador. Outro cenário: o contrato promete 99,9% de disponibilidade, e ninguém sabe dizer quantos minutos de indisponibilidade isso permite, nem quanto o failover do sistema realmente leva. Alta disponibilidade começa com uma meta mensurável, identifica os componentes cuja queda derruba tudo e escolhe redundância compatível com o custo e com o estado da aplicação. E precisa ser testada antes do incidente real.",
    concept: [
      "- **SLA** é a promessa externa ao cliente, possivelmente com penalidade. **SLO** é a meta interna usada pela engenharia, em geral mais rigorosa que o SLA. O **orçamento de erro** é o que o SLO permite de falha no período (100% menos o SLO). Uma meta de 99,9% em 30 dias permite cerca de 43 minutos de indisponibilidade.",
      "- Um **SPOF** (single point of failure) é qualquer servidor, balanceador, link, banco ou local cuja falha interrompe todo o serviço. Componentes em série multiplicam as disponibilidades (dois componentes de 99,9% dão cerca de 99,8%), enquanto réplicas independentes em paralelo as melhoram (duas de 99% dão cerca de 99,99%, se as falhas forem independentes). SPOFs devem ser removidos, reduzidos ou aceitos de forma explícita.",
      "- **Ativo-passivo** mantém uma instância de reserva e exige failover; simplifica a consistência. **Ativo-ativo** usa todos os nós ao mesmo tempo e redistribui a carga quando um falha, mas exige aplicações stateless ou sincronização correta do estado.",
      "- **Keepalived** com **VRRP** move um **IP virtual** (VIP) entre dois balanceadores: o nó de maior prioridade com saúde confirmada responde pelo VIP, e se ele falhar o outro assume. A configuração dos dois nós precisa permanecer sincronizada por automação (como Ansible) ou por mecanismos declarativos. Em muitas redes de nuvem o VRRP não funciona como em uma rede local, e o provedor oferece balanceadores gerenciados ou reatribuição de IP; confira a documentação do seu provedor.",
      "- Os health checks devem verificar a **função real** (por exemplo, uma resposta HTTP válida), não apenas a existência do processo.",
      "- **Chaos Engineering** formula uma hipótese, injeta uma falha controlada e mede a reação, com critérios claros para abortar. Não é falha aleatória em produção.",
      "- **HA** reduz interrupções locais; **Disaster Recovery** (DR) recupera o serviço depois de eventos amplos, como a perda de uma zona ou região. O **RTO** é o tempo máximo aceito para recuperar e o **RPO** é a perda máxima de dados aceita, medida em tempo.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "SLA, SLO e orçamento de erro",
        d: "promessa externa, meta interna e quanto de falha cabe nela.",
        color: "blue",
      },
      {
        t: "SPOF",
        d: "componente cuja falha derruba tudo; em série, as disponibilidades se multiplicam.",
        color: "signal",
      },
      {
        t: "Ativo-passivo e ativo-ativo",
        d: "reserva à espera ou capacidade compartilhada entre os nós.",
        color: "violet",
      },
      {
        t: "Keepalived, VRRP e VIP",
        d: "o IP virtual migra entre balanceadores conforme a prioridade e a saúde.",
        color: "ember",
      },
      {
        t: "Chaos Engineering",
        d: "hipótese, falha controlada, medição e critério de aborto.",
        color: "blue",
      },
      {
        t: "RTO e RPO",
        d: "tempo de recuperação aceito e perda de dados aceita no DR.",
        color: "signal",
      },
    ],
    examplesTitle: "Keepalived protegendo o balanceador",
    examples: [
      {
        label: "Dockerfile",
        lang: "sh",
        code: "# Dockerfile\nFROM nginx:stable\n# keepalived faz o VRRP; curl e iproute2 servem ao check de saúde e à inspeção do IP\nRUN apt-get update \\\n && apt-get install -y --no-install-recommends keepalived curl iproute2 \\\n && rm -rf /var/lib/apt/lists/*",
        intro:
          "O laboratório sobe dois balanceadores Nginx (`lb1` e `lb2`) em uma rede Docker com um IP virtual (`172.28.0.100`) e um cliente. Cada nó responde com o próprio nome, o que torna o failover visível.",
      },
      {
        label: "lb.conf",
        lang: "sh",
        code: '# lb.conf\nserver {\n    listen 80;\n    default_type text/plain;\n\n    location = /healthz {\n        return 200 "ok\\n";                          # rota usada pelo check de saúde\n    }\n\n    location / {\n        return 200 "atendido por $hostname\\n";      # mostra qual balanceador respondeu\n    }\n}',
      },
      {
        label: "keepalived-lb1.conf",
        lang: "sh",
        code: '# keepalived-lb1.conf\nvrrp_script check_nginx {\n    script "/usr/bin/curl -fsS --max-time 1 http://127.0.0.1/healthz"   # testa a função real do Nginx\n    interval 1                                      # roda a cada 1 segundo\n    fall 2                                          # 2 falhas seguidas: o nó é considerado doente\n    rise 2                                          # 2 sucessos seguidos: o nó volta a ser saudável\n}\n\nvrrp_instance PITSTOP {\n    state MASTER                                    # estado inicial (a prioridade decide na prática)\n    interface eth0                                  # interface que carrega o IP virtual\n    virtual_router_id 51                            # igual nos dois nós\n    priority 100                                    # maior prioridade: preferido para ter o VIP\n    advert_int 1                                    # anuncia presença a cada 1 segundo\n    unicast_src_ip 172.28.0.11                      # IP deste nó\n    unicast_peer {\n        172.28.0.12                                 # IP do outro nó (unicast, pois a rede Docker não é ideal para multicast)\n    }\n    virtual_ipaddress {\n        172.28.0.100/24                             # o IP virtual compartilhado\n    }\n    track_script {\n        check_nginx                                 # se o check falhar, o nó libera o VIP\n    }\n}',
        note: "O `keepalived-lb2.conf` é idêntico, trocando `state MASTER` por `state BACKUP`, `priority 100` por `priority 90`, `unicast_src_ip` por `172.28.0.12` e o par em `unicast_peer` por `172.28.0.11`.",
      },
      {
        label: "compose.yaml",
        lang: "yaml",
        code: '# compose.yaml\nservices:\n  lb1:\n    build: .                                        # usa o Dockerfile desta pasta\n    image: lb-ha-lab\n    hostname: lb1\n    cap_add: [NET_ADMIN, NET_BROADCAST, NET_RAW]    # permite ao Keepalived gerenciar IPs e usar VRRP\n    command: ["sh", "-c", "nginx && exec keepalived --dont-fork --log-console"]   # sobe o Nginx e depois o Keepalived\n    volumes:\n      - ./lb.conf:/etc/nginx/conf.d/default.conf:ro\n      - ./keepalived-lb1.conf:/etc/keepalived/keepalived.conf:ro\n    networks:\n      lab:\n        ipv4_address: 172.28.0.11\n  lb2:\n    image: lb-ha-lab                                # reaproveita a imagem construída por lb1\n    hostname: lb2\n    cap_add: [NET_ADMIN, NET_BROADCAST, NET_RAW]\n    command: ["sh", "-c", "nginx && exec keepalived --dont-fork --log-console"]\n    volumes:\n      - ./lb.conf:/etc/nginx/conf.d/default.conf:ro\n      - ./keepalived-lb2.conf:/etc/keepalived/keepalived.conf:ro\n    networks:\n      lab:\n        ipv4_address: 172.28.0.12\n    depends_on: [lb1]\n  client:\n    image: curlimages/curl                          # cliente dentro da mesma rede\n    entrypoint: ["tail", "-f", "/dev/null"]\n    networks: [lab]\n\nnetworks:\n  lab:\n    ipam:\n      config:\n        - subnet: 172.28.0.0/24                     # sub-rede fixa que contém o VIP',
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ docker compose up -d --build\n\n# Quem tem o VIP agora? (saída aproximada)\n$ docker compose exec lb1 ip -brief addr show eth0\neth0@if21   UP   172.28.0.11/24 172.28.0.100/24\n\n$ docker compose exec client curl -s http://172.28.0.100/\natendido por lb1\n\n# Falha controlada: para o Nginx do nó ativo e acompanha o cliente\n$ docker compose exec lb1 nginx -s stop\n$ docker compose exec client sh -c 'for i in $(seq 1 12); do echo \"$(date +%T) $(curl -s --max-time 1 http://172.28.0.100/ || echo FALHOU)\"; sleep 0.5; done'\n10:41:02 atendido por lb1\n10:41:02 atendido por lb1\n10:41:03 FALHOU\n10:41:04 atendido por lb2\n10:41:04 atendido por lb2",
        note: "O tempo de troca depende de `interval`, `fall` e `advert_int`; no laboratório costuma ficar em poucos segundos. Para medir o SLO, use a aritmética abaixo.",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "# Minutos de indisponibilidade permitidos em 30 dias para cada SLO (saída aproximada)\n$ for slo in 99 99.9 99.99; do awk -v s=$slo 'BEGIN{printf \"SLO %s%%: %.1f min\\n\", s, 30*24*60*(100-s)/100}'; done\nSLO 99%: 432.0 min\nSLO 99.9%: 43.2 min\nSLO 99.99%: 4.3 min",
      },
    ],
    commands: [
      {
        cmd: "docker compose up -d --build",
        note: "constrói a imagem e sobe os dois balanceadores e o cliente",
      },
      {
        cmd: "docker compose exec lb1 ip -brief addr show eth0",
        note: "mostra se o nó tem o VIP (repita em `lb2`)",
      },
      {
        cmd: "docker compose exec lb1 nginx -s stop",
        note: "injeta uma falha controlada no nó ativo",
      },
      {
        cmd: "docker compose exec lb1 nginx",
        note: "devolve o Nginx ao nó (o VIP volta ao nó de maior prioridade)",
      },
      {
        cmd: "docker compose logs lb1 lb2 | grep -i -E 'MASTER|BACKUP|FAULT'",
        note: "acompanha as transições de estado do VRRP",
      },
      {
        cmd: "watch -n 1 'docker compose exec -T lb2 ip -brief addr show eth0'",
        note: "acompanha o VIP migrando",
      },
    ],
    handsOn: [
      "Desenhe em papel o caminho completo de uma requisição (cliente, DNS, balanceador, aplicação, banco) e marque cada componente sem redundância. Cada marca é um SPOF.",
      "Escolha um SLO de disponibilidade para o serviço e calcule o downtime mensal permitido com o comando `awk` do exemplo. Calcule também a disponibilidade de dois componentes de 99,9% em série.",
      "Crie `etapa13/` com os arquivos do exemplo e rode `docker compose up -d --build`. Descubra qual nó tem o VIP e **observe** `atendido por lb1` ao chamar o IP virtual.",
      "Em um terminal, rode o laço do cliente. Em outro, pare o Nginx do `lb1` com `docker compose exec lb1 nginx -s stop`. **Observe** respostas de `lb1`, uma ou duas falhas e depois respostas de `lb2`, e meça quantos segundos passaram sem resposta.",
      "Rode `docker compose exec lb1 nginx` e **observe** o VIP voltar ao `lb1` (prioridade maior) após os checks de saúde passarem. Registre também em `docker compose logs` as transições de estado.",
      'Escreva uma hipótese de Chaos Engineering (por exemplo, "se o balanceador ativo cair, o cliente perde no máximo 5 segundos de resposta") com um critério de aborto (por exemplo, "se o VIP não migrar em 30 segundos, restaurar o nó e encerrar o experimento"). Compare o resultado do passo 4 com a hipótese.',
      "Limpe: `docker compose down`.",
    ],
    tip: "Uma redundância que nunca foi testada continua sendo uma suposição. Meça o tempo de failover, a perda de requisições e o tempo de recuperação, e compare com o SLO. Se você não consegue demonstrar o failover em um laboratório, não deveria confiar nele em produção.",
    takeaway:
      "Alta disponibilidade combina uma meta mensurável, a remoção de SPOFs, redundância e testes; o DR complementa quando a falha ultrapassa o servidor ou a zona local.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa13-vip-1.svg",
            alt: "O cliente aponta para o VIP 172.28.0.100, que está em lb1, MASTER com prioridade 100; lb2 é BACKUP com prioridade 90 e recebe os anúncios VRRP de lb1.",
            caption:
              "Antes da falha: lb1 tem a maior prioridade e o check_nginx em dia, então responde pelo IP virtual.",
          },
          {
            src: "/guides/servidores-web/etapa13-vip-2.svg",
            alt: "O Nginx de lb1 está parado e o check_nginx falhou duas vezes, então lb1 fica em FAULT; o VIP 172.28.0.100 passou para lb2, agora MASTER.",
            caption:
              "Depois de `nginx -s stop` em lb1: duas falhas seguidas do check_nginx tiram lb1 do posto, lb2 assume o VIP, e o cliente continua usando o mesmo endereço.",
          },
        ],
        credit: "Diagrama: feito para este guia",
      },
    ],
  },
  {
    id: "m14",
    num: "14",
    navTitle: "WAF e proteção",
    tag: "modsecurity + rate limit",
    title: "WAF, rate limiting e defesa em camadas",
    lead: "A API de login da loja recebe, de madrugada, milhares de tentativas de senha por minuto vindas de poucos IPs, e algumas requisições trazem trechos de SQL no parâmetro de busca. O firewall de rede bloqueia portas e redes, mas não entende o que está dentro de uma requisição HTTP: um payload de SQL Injection chega por uma porta legítima (443) e passa. A disponibilidade ainda depende de que o acesso legítimo continue confiável, então a borda precisa distinguir uso normal de comportamento hostil sem derrubar usuários reais.",
    concept: [
      "Firewalls de camadas 3 e 4 bloqueiam redes e portas, mas não inspecionam a camada de aplicação. Um **WAF** (Web Application Firewall) inspeciona o conteúdo HTTP. O **ModSecurity** (com a biblioteca libModSecurity e o conector para o Nginx) é o motor que aplica as regras, e o **OWASP Core Rule Set (CRS)** é uma base de regras mantida pela comunidade contra padrões como SQL Injection e XSS.",
      "- O WAF avalia as regras e acumula uma **pontuação de anomalia**; ao passar de um limite, bloqueia (por padrão no CRS, o limite de entrada é 5). Pode apenas registrar (`DetectionOnly`) ou bloquear (`On`). Comece em modo de detecção para ajustar falsos positivos antes de interromper usuários legítimos. O CRS também tem níveis de paranoia (de 1 a 4): níveis maiores detectam mais e geram mais falsos positivos.",
      "- **TLS 1.2 ou 1.3**, **HSTS** e headers seguros protegem o canal e o navegador. O HSTS manda o navegador usar só HTTPS para o domínio pelo tempo informado em `max-age`.",
      "- **Rate limiting** limita as requisições por chave (em geral o IP) e ajuda contra força bruta e abuso, mas não substitui proteção contra DDoS distribuído, em que cada origem envia pouco. No Nginx, `limit_req_zone` define a chave, a memória e a taxa; `limit_req` aplica o limite em um local; `burst` permite rajadas e `nodelay` atende a rajada sem atraso. A resposta de rejeição padrão é 503; use `limit_req_status 429` para devolver `429 Too Many Requests`. Atrás de NAT, vários usuários compartilham o mesmo IP, e atrás de um CDN ou proxy é preciso configurar o IP real do cliente.",
      "- Logs do Nginx e do ModSecurity precisam chegar a uma plataforma central, com alertas para aumento de bloqueios, de respostas 5xx e de latência. Segurança depende de revisão, atualização do CRS e testes repetíveis.",
      "Um WAF não corrige a vulnerabilidade no código: reduz a exposição e compra tempo para a correção definitiva. A defesa funciona em camadas, cada uma cobrindo o que a anterior não vê.",
    ],
    pointsTitle: "Os conceitos-chave",
    points: [
      {
        t: "WAF (ModSecurity + CRS)",
        d: "inspeciona o conteúdo HTTP com regras e pontuação de anomalia.",
        color: "blue",
      },
      {
        t: "DetectionOnly e On",
        d: "registrar sem bloquear, e bloquear; comece por registrar.",
        color: "signal",
      },
      {
        t: "Rate limiting (`limit_req_zone`, `limit_req`)",
        d: "controla abuso por chave; `limit_req_status 429` altera o código de rejeição.",
        color: "violet",
      },
      {
        t: "TLS e HSTS",
        d: "protegem o canal e obrigam o navegador a usar HTTPS.",
        color: "ember",
      },
      {
        t: "403 e 429",
        d: "403 vem do bloqueio de uma regra do WAF; 429 vem do limite de taxa configurado.",
        color: "blue",
      },
      {
        t: "Logs e alertas",
        d: "transformam bloqueios em evidência para ajustar regras e responder a incidentes.",
        color: "signal",
      },
    ],
    examplesTitle: "Borda em camadas, com TLS, limite de taxa e WAF",
    examples: [
      {
        label: "compose.yaml",
        lang: "yaml",
        code: '# compose.yaml\nservices:\n  api:\n    image: python:3.12-alpine\n    command: ["python", "/app/backend.py"]\n    environment:\n      NAME: api\n    volumes:\n      - ./backend.py:/app/backend.py:ro\n  crs:\n    image: owasp/modsecurity-crs:nginx              # WAF: Nginx com ModSecurity e OWASP CRS\n    environment:\n      BACKEND: http://api:3000                      # para onde o WAF encaminha o tráfego aprovado\n      PORT: "8080"                                  # porta de escuta do WAF dentro do container\n      MODSEC_RULE_ENGINE: DetectionOnly             # só registra; troque para On para bloquear\n      PARANOIA: "1"                                 # nível de paranoia do CRS (1 é o menos sensível)\n    depends_on: [api]\n  edge:\n    image: nginx:stable                             # borda: TLS, HSTS e limite de taxa\n    ports:\n      - "8443:443"\n    volumes:\n      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro\n      - ./certs:/etc/nginx/certs:ro\n    depends_on: [crs]',
        intro:
          "O laboratório encadeia três contêineres: o Nginx de borda (TLS, HSTS e limite de taxa), o WAF (imagem `owasp/modsecurity-crs`, que roda Nginx com ModSecurity e CRS como proxy reverso) e o backend. Copie o `backend.py` da Etapa 03 para `etapa14/` e gere um certificado autoassinado como na Etapa 02 (pasta `certs/`).",
      },
      {
        label: "nginx.conf",
        lang: "sh",
        code: '# nginx.conf\nlimit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;   # 5 requisições por minuto por IP; 10 MB de estado\n\nserver {\n    listen 443 ssl;\n    http2 on;\n    server_name localhost;\n\n    ssl_certificate     /etc/nginx/certs/cert.pem;\n    ssl_certificate_key /etc/nginx/certs/key.pem;\n    ssl_protocols       TLSv1.2 TLSv1.3;                   # recusa versões antigas de TLS\n\n    server_tokens off;                                     # oculta a versão do Nginx\n    add_header Strict-Transport-Security "max-age=300" always;   # HSTS curto no laboratório; em produção, 31536000 depois de validar tudo\n    limit_req_status 429;                                  # rejeições devolvem 429 (o padrão seria 503)\n\n    proxy_set_header Host $host;                           # herdado pelas duas rotas abaixo\n    proxy_set_header X-Real-IP $remote_addr;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\n    location = /login {\n        limit_req zone=login burst=3 nodelay;              # 1 requisição + rajada de 3; o resto recebe 429\n        proxy_pass http://crs:8080;                        # passa pelo WAF antes de chegar à aplicação\n    }\n\n    location / {\n        proxy_pass http://crs:8080;\n    }\n}',
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ docker compose up -d\n\n# TLS e HSTS (saída aproximada)\n$ curl -sk -I https://localhost:8443/ | grep -iE 'HTTP/|strict|server'\nHTTP/2 200\nserver: nginx\nstrict-transport-security: max-age=300\n\n# Em DetectionOnly, o payload malicioso passa (200), mas é registrado (os códigos de regra variam)\n$ curl -sk -G -o /dev/null -w '%{http_code}\\n' --data-urlencode \"q=<script>alert(1)</script>\" https://localhost:8443/\n200\n$ docker compose logs crs | grep -i 'ModSecurity' | tail -n 3\ncrs-1  | ... ModSecurity: Warning. ... [id \"941100\"] ... XSS Attack Detected via libinjection ...\n\n# Depois de trocar MODSEC_RULE_ENGINE para On e recriar o container (docker compose up -d), o mesmo payload é bloqueado\n$ curl -sk -G -o /dev/null -w '%{http_code}\\n' --data-urlencode \"q=<script>alert(1)</script>\" https://localhost:8443/\n403\n\n# Limite de taxa: 10 chamadas seguidas ao /login (resultado aproximado: 4 de 200 e 6 de 429)\n$ for i in $(seq 1 10); do curl -sk -o /dev/null -w '%{http_code}\\n' https://localhost:8443/login; done\n200\n200\n200\n200\n429\n429\n429\n429\n429\n429",
        note: "Com `rate=5r/m` e `burst=3 nodelay`, a primeira requisição e as três da rajada passam; as seguintes são rejeitadas até a janela de renovação (um slot a cada 12 segundos). O número exato depende da velocidade do laço e do relógio.",
      },
    ],
    commands: [
      {
        cmd: "docker compose exec edge nginx -t",
        note: "valida a sintaxe antes do reload",
      },
      {
        cmd: "docker compose exec edge nginx -s reload",
        note: "recarrega a borda depois de editar o `nginx.conf`",
      },
      {
        cmd: "docker compose restart edge",
        note: "reinicia a borda quando uma edição do `nginx.conf` não aparece depois do reload (editores e `sed -i` substituem o arquivo montado por um novo, e o container continua vendo o antigo)",
      },
      {
        cmd: "curl -sk -I https://localhost:8443/",
        note: "confere TLS e HSTS",
      },
      {
        cmd: "docker compose logs -f crs",
        note: "acompanha as regras acionadas pelo ModSecurity (o log de auditoria pode estar em arquivo, em `/var/log/modsec_audit.log` ou outro caminho; confira com `docker compose exec crs env | grep -i audit`)",
      },
      {
        cmd: "docker compose logs -f edge",
        note: "correlaciona a resposta (403, 429, 5xx) com a causa",
      },
      {
        cmd: "docker compose up -d",
        note: "recria o `crs` depois de mudar `MODSEC_RULE_ENGINE`",
      },
      {
        cmd: "curl -sk -G --data-urlencode \"id=1' OR '1'='1\" https://localhost:8443/",
        note: "payload de laboratório de SQL Injection",
      },
    ],
    handsOn: [
      "Crie `etapa14/` com `backend.py`, `compose.yaml`, `nginx.conf` e a pasta `certs/`, e rode `docker compose up -d`. Se o `edge` devolver `502`, confira com `docker compose logs crs` em que porta o WAF escuta e ajuste `PORT` e o `proxy_pass`. Se você editar o `nginx.conf` depois, rode `docker compose exec edge nginx -s reload` e, se a mudança não aparecer, `docker compose restart edge`.",
      "Envie uma requisição normal (`curl -sk https://localhost:8443/`) e **observe** `api recebeu /`, passando por borda, WAF e backend.",
      "Com o WAF em `DetectionOnly`, envie o payload XSS e o de SQL Injection do exemplo. **Observe** o `200` e procure no `docker compose logs crs` a regra acionada (um `id` de regra e a mensagem). Identifique a regra antes de habilitar o bloqueio.",
      "Troque `MODSEC_RULE_ENGINE` para `On`, rode `docker compose up -d` e repita os payloads. **Observe** `403`. Envie de novo uma requisição normal e **observe** que continua `200`.",
      "Rode as 10 chamadas seguidas ao `/login` e **observe** os `429` depois do limite. Aguarde cerca de 12 segundos e repita uma chamada para **observar** o limite liberando um slot.",
      "Confira os headers com `curl -sk -I https://localhost:8443/` e **observe** `strict-transport-security`, e a ausência da versão no cabeçalho `server`.",
      "Monte um checklist para o seu serviço: TLS 1.2 ou 1.3, HSTS, atualização do CRS, retenção de logs, alerta de picos de bloqueio e de 5xx, e um teste repetível dos payloads.",
      "Limpe: `docker compose down`.",
    ],
    tip: "O WAF não corrige vulnerabilidade no código: reduz a exposição e compra tempo, e a correção definitiva continua na aplicação. Nunca ative o bloqueio sem ter lido o log de detecção por um período com tráfego real, porque o falso positivo que derruba um cliente legítimo custa mais que o atraso em bloquear.",
    takeaway:
      "Uma borda segura combina criptografia, inspeção na camada de aplicação, controle de taxa, logs e resposta operacional: cada camada cobre o que a anterior não enxerga, e todas começam por observar antes de bloquear.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa14-camadas.svg",
            alt: "Uma requisição passa por firewall de rede, Nginx de borda com TLS, HSTS e limit_req, e WAF com ModSecurity e OWASP CRS antes de chegar à api. O firewall bloqueia porta ou rede, o Nginx de borda devolve 429 e o WAF devolve 403.",
            caption:
              "Cada camada vê uma coisa diferente: o firewall vê portas e redes, o Nginx de borda conta requisições por IP, e o WAF lê o conteúdo e soma a pontuação de anomalia. A api só recebe o que passou pelas três.",
          },
        ],
        credit: "Diagrama: feito para este guia",
      },
    ],
  },
];

export const CHECKLIST: ChecklistGroup[] = [
  {
    title: "Etapa 01: Servidor web",
    items: [
      "Sei citar as seis funções de um servidor web sem consultar o texto.",
      "Rodei um Nginx e um Apache e comparei o cabeçalho `Server` de cada um.",
      "Sei explicar por que essas funções não devem ficar dentro do código da aplicação.",
    ],
  },
  {
    title: "Etapa 02: HTTP",
    items: [
      "Sei explicar o que é head-of-line blocking e em qual camada cada versão do HTTP o resolve.",
      "Usei o `curl` para forçar versões do HTTP e observei `%{http_version}` mudar.",
      "Vi o HTTP/2 ser negociado e desaparecer ao remover `http2 on;` no meu Nginx.",
    ],
  },
  {
    title: "Etapa 03: Proxies",
    items: [
      "Sei dizer, para um cenário, se ele pede forward ou reverse proxy.",
      "Configurei um reverse proxy Nginx e confirmei os cabeçalhos recebidos pelo backend com `/headers`.",
      "Sei explicar o efeito de remover `proxy_set_header Host`, `X-Real-IP` e `X-Forwarded-For`, e por que o `peer` sempre mostra o proxy.",
      "Usei um forward proxy com `curl -x` e entendi quem abre a conexão com o destino.",
    ],
  },
  {
    title: "Etapa 04: Apache e MPMs",
    items: [
      "Sei explicar Prefork, Worker e Event em termos de processo, thread e isolamento.",
      "Confirmei o MPM de um Apache com `httpd -M` ou `apachectl -V`.",
      "Observei a diferença no número de processos entre Prefork e Event sob carga.",
      "Sei explicar por que módulos não thread-safe exigem o Prefork.",
    ],
  },
  {
    title: "Etapa 05: Nginx",
    items: [
      "Sei explicar I/O não bloqueante, event loop e o papel do `epoll`.",
      "Localizei `worker_processes` e `worker_connections` e comparei os workers com o número de núcleos.",
      "Observei que o número de processos do Nginx não cresce com a carga.",
      "Sei explicar por que, como proxy, o Nginx comporta cerca de metade das conexões do teto teórico.",
    ],
  },
  {
    title: "Etapa 06: Balanceamento",
    items: [
      "Sei escolher entre Round Robin, `weight`, `least_conn` e `ip_hash` explicando o custo de cada um.",
      "Medi a distribuição entre backends em cada algoritmo.",
      "Comparei um balanceador L4 e um L7 e expliquei o que o L4 não enxerga.",
    ],
  },
  {
    title: "Etapa 07: Failover e diagnóstico",
    items: [
      "Parei um backend durante o teste e confirmei o failover pelos logs, notando o atraso das primeiras requisições.",
      "Vi o servidor `backup` assumir e os primários voltarem.",
      "Diferenciei 502 de 504 pelo tempo de resposta e pela mensagem do log de erros.",
      "Sei dizer o que o Nginx Open Source faz (check passivo) e o que exige Plus (check ativo).",
    ],
  },
  {
    title: "Etapa 08: Ingress",
    items: [
      "Sei explicar por que Ingress e Ingress Controller não são a mesma coisa.",
      "Testei roteamento por host e path, `Prefix` contra `Exact` e a reescrita de URL.",
      "Sei explicar por que as annotations valem para o Ingress inteiro.",
    ],
  },
  {
    title: "Etapa 09: TLS e cert-manager",
    items: [
      "Acompanhei Certificate e Secret até `READY True` com um ClusterIssuer.",
      "Validei o certificado entregue pelo Ingress e li o nome DNS e a validade com `openssl`.",
      "Sei explicar por que base64 em Secret não é criptografia.",
      "Sei dizer a diferença entre HTTP-01 e DNS-01, o que é o SNI e por que o staging existe.",
    ],
  },
  {
    title: "Etapa 10: Istio",
    items: [
      "Sei separar Data Plane, Control Plane e custo operacional da malha.",
      "Confirmei a injeção do sidecar (`2/2`) e a sincronização com `istioctl proxy-status`.",
      "Sei explicar por que Pods existentes precisam ser recriados após habilitar a injeção.",
    ],
  },
  {
    title: "Etapa 11: Deploy gradual",
    items: [
      "Configurei subsets e uma divisão 90/10 e medi a proporção real.",
      "Sei diferenciar canary, A/B e mirroring e vi o espelhamento chegar à v2.",
      "Pratiquei o rollback e sei explicar a relação entre `timeout`, `attempts` e `perTryTimeout`.",
    ],
  },
  {
    title: "Etapa 12: mTLS e observabilidade",
    items: [
      "Vi a recusa de um cliente fora da malha em `STRICT`.",
      "Apliquei a `PeerAuthentication` e a `AuthorizationPolicy` em arquivos separados e provei, com respostas 200 e 403, que a autorização decide por identidade, método e path.",
      "Li as métricas do Envoy e a identidade no `X-Forwarded-Client-Cert`.",
      "Sei explicar por que a aplicação precisa propagar os headers de tracing.",
    ],
  },
  {
    title: "Etapa 13: Alta disponibilidade",
    items: [
      "Sei relacionar SLA, SLO, orçamento de erro, SPOF, RTO e RPO.",
      "Calculei o downtime mensal permitido por um SLO.",
      "Medi o failover de um IP virtual com Keepalived.",
      "Escrevi uma hipótese de Chaos Engineering com critério de aborto.",
    ],
  },
  {
    title: "Etapa 14: Defesa da borda",
    items: [
      "Testei o WAF primeiro em detecção, li a regra acionada e só depois habilitei o bloqueio.",
      "Validei TLS, HSTS, o 403 do WAF e o 429 do rate limiting.",
      "Sei explicar por que `limit_req_status 429` é necessário e o que `burst` e `nodelay` fazem.",
    ],
  },
  {
    title: "",
    items: [],
    outro:
      "**Próximos passos:** com todos os itens marcados, refaça os laboratórios sem consultar o guia e depois junte as peças. Em Docker, monte uma borda com dois backends atrás de um Nginx com balanceamento, servidor `backup`, limite de taxa e WAF, e proteja esse Nginx com um segundo nó e Keepalived. No Minikube, publique a mesma aplicação com Ingress e TLS do cert-manager e faça um canário 90/10 com o Istio, medindo a proporção real e praticando o rollback.",
  },
];

export const NOTES: string[] = [
  "Este bloco reúne detalhes que ajudam a ler os exemplos com segurança. Nada aqui muda o caminho dos exercícios; são esclarecimentos sobre comportamentos que costumam gerar dúvida.",
  "**Sobre o que você vai ver no terminal**",
  "**Saídas de exemplo.** As saídas mostradas são formatos típicos. Versões, IPs, hashes de Pods, tempos, contagens de processos e distribuições estatísticas (como a divisão 90/10 do canary) variam. Compare a estrutura, não o texto exato.",
  "**Tags de imagem.** Os laboratórios usam tags amplas (`nginx:stable`, `httpd:2.4`, `python:3.12-alpine`, `owasp/modsecurity-crs:nginx`). Elas se movem com o tempo, e o comportamento descrito vale para versões recentes (por exemplo, `http2 on;` exige Nginx 1.25.1 ou superior). Fixe versões exatas quando precisar de reprodutibilidade, e confirme a disponibilidade das imagens no momento da execução.",
  '**DNS de upstreams no Nginx.** O Nginx resolve os nomes de `upstream` e `proxy_pass` ao carregar a configuração. Se um container for recriado com outro IP, recarregue (`nginx -s reload`). Se um nome não resolver na partida, o Nginx se recusa a iniciar. Um container parado com `docker compose stop` some da rede, e a tentativa de conexão ao IP antigo costuma falhar com "No route to host" ou com timeout de conexão depois de alguns segundos, em vez de uma recusa imediata; já uma porta fechada em um container ativo é recusada na hora.',
  "**IP do cliente em Docker.** Pelo mapeamento de portas, o Nginx enxerga como origem o IP do gateway da rede Docker, e não o do seu terminal. Por isso `ip_hash` manda tudo ao mesmo backend e o `limit_req` conta todos os acessos do laboratório como um só cliente.",
  "**Apache Bench.** O `ab` fala HTTP/1.0 por padrão e abre uma conexão por requisição; `-k` ativa o keep-alive. Ele não faz HTTP/2 nem HTTP/3 e não substitui uma ferramenta de carga realista. Use os números para comparar cenários na mesma máquina, não como medida absoluta.",
  "**`kubectl get endpoints`.** Em versões recentes do Kubernetes, o comando exibe aviso de depreciação em favor de EndpointSlices. Os exemplos usam `kubectl get endpointslices`.",
  "**Arquivo único montado em container.** Montar um arquivo (como `nginx.conf` ou `h2.conf`) em um container prende o container ao arquivo original do host. Editores que gravam em um arquivo novo e o `sed -i` substituem o arquivo, e o container continua vendo a versão antiga, de modo que o `reload` parece não fazer nada. Nesse caso, reinicie o container (`docker restart <nome>` ou `docker compose restart <serviço>`) ou monte a pasta inteira em vez do arquivo.",
  "**Sobre Apache e Nginx**",
  "**Alcance da falha no Worker MPM.** Um erro grave em uma thread pode corromper ou derrubar o processo filho que a hospeda, e as conexões que ele atendia. O processo mestre e os demais filhos continuam funcionando.",
  "**HTTP/2 no Apache.** É oferecido pelo módulo `mod_http2` (`Protocols h2 http/1.1`) e é indicado para MPMs com threads, em especial o Event. Não é recomendado com o Prefork.",
  "**`MaxRequestWorkers` no Event.** Limita as requisições processadas ao mesmo tempo e precisa caber em `ServerLimit` vezes `ThreadsPerChild`. Conexões ociosas em keep-alive não consomem uma thread de trabalho cada, o que é a razão de ser do Event.",
  "**Capacidade do Nginx.** `worker_processes` vezes `worker_connections` é um teto teórico de conexões, e um proxy usa duas por requisição (cliente e backend). `use epoll;` é opcional no Linux, porque o Nginx escolhe o método mais eficiente.",
  "**Open Source e Plus.** O Nginx Open Source oferece balanceamento (Round Robin, `least_conn`, `ip_hash`, `hash`, `random`), `keepalive` com os backends, `backup` e verificação passiva (`max_fails`, `fail_timeout`). Recursos como a verificação ativa (`health_check`), a persistência de sessão por cookie (`sticky cookie`), `slow_start`, o método `least_time`, a fila de requisições (`queue`) e a API de configuração dinâmica com painel de monitoramento são exclusivos do Nginx Plus.",
  "**`limit_req_status`.** A resposta padrão do `limit_req` é 503. Para devolver 429 é necessário `limit_req_status 429`. Em `rate=5r/m` com `burst=3 nodelay`, a primeira requisição e as três da rajada passam; as seguintes são rejeitadas até que um slot (um a cada 12 segundos) seja liberado.",
  "**`add_header` e herança.** Diretivas `add_header` declaradas em um `location` substituem as herdadas do `server`. Ao adicionar um cabeçalho em um `location`, repita os de nível superior.",
  "**Sobre Kubernetes e cert-manager**",
  "**Annotations e Ingress.** A annotation `rewrite-target` com grupos de captura vale para todos os paths do mesmo Ingress, por isso o exemplo separa a rota com reescrita da rota sem reescrita. Com `rewrite-target`, o ingress-nginx passa a tratar como expressão regular os paths do host.",
  "**ingress-nginx e Gateway API.** O projeto ingress-nginx foi aposentado (anúncio em novembro de 2025, fim da manutenção em março de 2026), e a API Ingress está congelada em favor da Gateway API. Confirme o estado atual do projeto e do addon `ingress` do seu Minikube antes de usá-lo; o conceito de Ingress, Controller e Service com endpoints vale para qualquer Controller.",
  "**cert-manager.** A instalação por Helm usa `crds.enabled=true` nas versões recentes do chart (versões antigas usavam `installCRDs`). A duração padrão de um Certificate é de 90 dias, com renovação a partir de um terço da duração restante; a duração mínima é de 1 hora e o `renewBefore` mínimo é de 5 minutos. O ClusterIssuer autoassinado é só para laboratório. O certificado emitido para o laboratório define só o nome DNS (`subjectAltName`), então `subject` e `issuer` podem aparecer vazios em `openssl` e `curl -v`.",
  "**Secret e base64.** O conteúdo de um Secret é apenas codificado. A proteção real vem de RBAC, de criptografia em repouso no `etcd` e de não versionar chaves.",
  "**Sobre Istio, Keepalived e WAF**",
  "**APIs do Istio.** Os exemplos usam `networking.istio.io/v1` (VirtualService e DestinationRule) e `security.istio.io/v1` (PeerAuthentication e AuthorizationPolicy). A versão `v1beta1` ainda aparece em instalações antigas. Prefira nomes completos de serviço (`api.demo.svc.cluster.local`) nos campos `host`, porque nomes curtos são interpretados em relação ao namespace do recurso.",
  "**Retries e timeout.** `attempts` conta as novas tentativas depois da primeira; o `timeout` da rota deve comportar todas as tentativas. Retries sem limite multiplicam a carga sobre um backend já doente.",
  "**Tracing.** O sidecar gera o `x-request-id` e lê headers de rastreamento, mas a aplicação precisa propagá-los. Coletar e visualizar traces exige um provedor de tracing configurado na malha, o que não faz parte do laboratório; a Etapa 12 verifica os headers e as métricas do Envoy.",
  "**Identidade e autorização.** `principals` em uma AuthorizationPolicy só casam quando há mTLS. Com uma política `ALLOW` em vigor, o que não casa com nenhuma regra é negado com 403.",
  "**Keepalived.** O `track_script` precisa referenciar um `vrrp_script` definido no mesmo arquivo. Em produção, use `enable_script_security` e scripts com permissões restritas. O laboratório usa VRRP em unicast sobre uma rede Docker; em redes de nuvem, o VRRP costuma não funcionar como em rede local.",
  "**WAF.** As variáveis da imagem `owasp/modsecurity-crs` (`BACKEND`, `PORT`, `MODSEC_RULE_ENGINE`, `PARANOIA`) e o caminho do log de auditoria podem variar entre versões da imagem; confirme na documentação dela. Os identificadores de regra mostrados (como o 941100) são exemplos e dependem da versão do CRS. O limite de anomalia de entrada padrão do CRS é 5.",
  "**Rate limiting e DDoS.** O limite por IP ajuda contra força bruta e abuso, mas não substitui proteção contra ataques distribuídos. Atrás de CDN ou proxy, configure o módulo de IP real (`set_real_ip_from` e `real_ip_header`) para que a chave do limite seja o cliente, e não o proxy.",
  "**Pontos a verificar por quem for executar**",
  "**Imagens de terceiros.** `ubuntu/squid`, `owasp/modsecurity-crs`, `curlimages/curl` e `python:3.12-alpine` são imagens públicas; confirme a disponibilidade, o nome das variáveis de ambiente e a porta de escuta de cada uma antes de executar.",
  "**Recursos do Minikube.** O Istio com o perfil `demo` e as imagens de laboratório exigem memória e CPU; ajuste `--cpus` e `--memory` à sua máquina. Por isso o cluster `lab` das Etapas 08 e 09 é removido antes de subir o perfil `mesh`.",
  "**Keepalived em Docker.** O laboratório da Etapa 13 depende de `cap_add` de rede e de um Docker que as conceda; ambientes sem essa permissão (alguns Docker rootless e Podman) podem não rodá-lo.",
];
