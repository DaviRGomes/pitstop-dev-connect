# Arquitetura de aplicações: da garagem em que todo mundo faz tudo aos postos especializados que conversam pelo rádio

*Boa tarde, boa noite, bom dia, onde quer que você esteja! Está no ar a transmissão do GP da Arquitetura de Aplicações, e o grid já está formado. O que está em jogo nesta corrida é a forma da equipe: sair da garagem em que todo mundo faz tudo, com um procedimento único que trava inteiro quando um passo falha, e chegar aos postos especializados que trabalham sozinhos, guardam os próprios dados e conversam pelo rádio sem segurar o carro no box.*

*O traçado tem quatro setores, e eu narro cada um deles. Setor 1, a reta de largada: monolito, camadas e microsserviços, com o laboratório que mede o double stack e o raio de explosão de um crash. Setor 2, o trecho de desenho do circuito: onde cortar os serviços (DDD estratégico) e como publicá-los atrás de um gateway. Setor 3, a parte mais técnica da pista: banco por serviço, SQL ou NoSQL, CAP e a saga que compensa falhas. Setor 4, a reta final: chamada síncrona contra fila, rate limit na borda e o identificador de requisição seguido pelos logs. Em todos eles, AWS e Azure aparecem do mesmo jeito: dois circuitos onde a mesma equipe opera.*

*Antes da largada, dois avisos. Primeiro, para ninguém achar que é erro de digitação: em 2026 a etapa do Bahrein foi transferida para Sepang, na Malásia (conforme verificado em 2026-10-06), e por isso o guia fala em "GP do Bahrein em Sepang". Quem conta essa corrida, disputada em 4 de outubro de 2026, é o piloto, no primeiro bloco **Leitura de cockpit**, logo abaixo. Segundo: os blocos **Leitura de cockpit** são a voz do piloto, em primeira pessoa, traduzindo cada conceito para a garagem, o muro e o box. A minha voz, da cabine, é esta aqui, em itálico, na entrada e na saída de cada setor. Cinto afivelado, viseira abaixada. Vai começar!*

> Guia baseado nas quatro aulas da disciplina "Arquitetura de aplicações" (DevOps e Arquitetura Cloud, Fase 1), uma etapa por aula, cada uma com um laboratório que roda na sua máquina com Docker Compose, sem conta de nuvem. O material cita só a AWS (SQS, DynamoDB, Amazon API Gateway) e o Azure Cosmos DB; todo equivalente acrescentado vem marcado como acréscimo.

**Leitura de cockpit:** no domingo, 4 de outubro de 2026, em Sepang, o GP do Bahrein (transferido para a Malásia nesta temporada) largou com cerca de 40 minutos de atraso por causa da chuva forte. A Ferrari apostou em pneus para pista seca no Lewis Hamilton e no Charles Leclerc enquanto quase todo o grid largou de intermediários, e os dois despencaram nas primeiras voltas antes de se recuperarem. Um safety car na volta 9 abriu a janela para quem estava de intermediários trocar para pneus de pista seca. O Max Verstappen controlou a corrida e venceu; o Kimi Antonelli foi segundo e o Hamilton, terceiro. O carro do George Russell parou na reta durante o último safety car e ele saiu sem pontos. Por trás de cada uma dessas cenas há uma equipe funcionando como sistema distribuído: dezenas de postos especializados, um único canal de rádio com o piloto, dados correndo entre pista e fábrica, e decisões que dependem de quem responde a tempo. É disso que este módulo trata.

> **Dados de campeonato usados neste guia (verificados em 2026-10-06; fontes em "Fontes dos dados de F1", no fim).** Pódio em Sepang, rodada 16 de 23: Verstappen, Antonelli e Hamilton; o George Russell, segundo no campeonato, saiu sem pontos. Próxima etapa: GP de Singapura, 9 a 11 de outubro de 2026, com formato sprint pela primeira vez. Todo cenário com esses nomes que não aconteceu de fato está marcado como **hipotético**.

**Para quem não acompanha F1: o mínimo de pista para ler este guia.** Você não precisa saber nada de corrida; cada termo abaixo é explicado de novo quando aparece.

- **Box, garagem e pit lane.** Cada equipe tem uma garagem e, à frente dela, um box: o ponto do pit lane (a via paralela à reta) onde o carro para. No pit lane há velocidade máxima, controlada pelo **limitador de velocidade** do carro.
- **Pit stop e crew.** A parada no box para trocar pneus ou peças. A crew tem cerca de 20 mecânicos, cada um com uma única tarefa (pistola de uma roda, tirar o pneu, pôr o pneu, macaco dianteiro, macaco traseiro), e o carro só sai quando todos terminam. A equipe tem uma crew só para os dois carros.
- **Double stack.** Chamar os dois carros da equipe ao box na mesma volta. Como a crew é uma só, o segundo carro espera o primeiro terminar.
- **Bico, set-up e treino livre.** O bico é a ponta dianteira do carro, que leva a asa dianteira; trocá-lo numa parada demora bem mais que trocar pneus. O set-up é o ajuste do carro para o circuito (alturas, asas, pressões). Treino livre é a sessão de testes e ajustes antes da classificação.
- **Semáforo de liberação e liberação insegura.** A luz à frente do box que libera o carro; ela fica verde depois que os operadores das pistolas sinalizam que a sua roda está presa. Soltar o carro com algo errado (roda mal presa, outro carro passando) é liberação insegura, infração punida pelos comissários.
- **Engenheiro de corrida.** A única voz da equipe que fala com o piloto pelo rádio. Ele leva ao piloto o que os especialistas decidem e leva à equipe o que o piloto pede.
- **Muro dos boxes (pit wall).** A bancada à beira da pista onde ficam engenheiros e estrategistas olhando os dados do carro em tempo real.
- **Telemetria e canais.** Os dados que os sensores do carro transmitem ao vivo: cada grandeza (uma temperatura, uma pressão, uma velocidade) é um canal, com nome e unidade definidos.
- **Sala de operações remota.** A sala na fábrica onde dezenas de engenheiros acompanham a telemetria ao vivo durante o GP e apoiam o muro.
- **Disciplinas da equipe.** Engenharia é dividida por assunto: aerodinâmica, dinâmica veicular, unidade de potência (o motor híbrido), pneus, estratégia.
- **Sistema hidráulico.** Aciona câmbio, embreagem e direção assistida, entre outros sistemas. Um vazamento costuma encerrar a corrida do carro, por melhor que esteja o resto.
- **Janela.** Para o estrategista, a "janela de pit stop" é o intervalo de voltas em que compensa parar. Para o engenheiro de pneus, a "janela" é a faixa de temperatura em que o pneu funciona.
- **Safety car.** O carro de segurança que entra na pista depois de um incidente e reduz o ritmo de todos; costuma abrir uma janela barata para parar no box.
- **Direção de prova e comissários.** A direção de prova controla a sessão e manda mensagens para todas as equipes ao mesmo tempo. Os comissários julgam incidentes e aplicam penalidades, às vezes depois da bandeirada; por isso a classificação logo após a corrida é **provisória** até ser confirmada.
- **Cronometragem.** Laços instalados na pista registram cada passagem de cada carro; os tempos e as posições são calculados a partir dessas passagens.
- **Código de barras dos pneus.** Cada pneu é identificado, e a FIA (a federação que regula a F1) acompanha cada jogo do fim de semana.
- **Credenciamento do paddock.** A credencial que cada membro da equipe mostra nos portões, com o nível de acesso impresso (garagem, pit lane, muro).

**O que você vai saber fazer ao final deste guia:** explicar por que um monolito em camadas vira problema e o que os microsserviços trocam por isso; medir, num laboratório, como uma funcionalidade lenta ou com defeito afeta o resto no monolito e não afeta quando há serviços separados; desenhar fronteiras de serviço por capacidade de negócio (DDD estratégico) e publicá-las atrás de um gateway; dar a cada serviço o seu banco, escolher entre SQL e NoSQL com argumentos e coordenar uma operação distribuída com uma saga que compensa falhas; comparar, na prática, chamada síncrona (HTTP) e assíncrona (fila), observar acúmulo e recuperação de mensagens, limitar tráfego no gateway e seguir um identificador de requisição pelos logs; e, em cada etapa, apontar o serviço equivalente na AWS e no Azure e dizer onde eles realmente diferem.

**Pré-requisitos:**

- Docker Engine ou Docker Desktop, com o comando `docker compose` (Compose v2 recente). Confira com `docker compose version`.
- Um terminal com `bash`, `curl`, `sort` e `uniq`. Linux, macOS ou WSL servem.
- Conhecimento básico de containers (imagem, container, porta publicada, rede do Compose) e de HTTP.
- Nada de conta de nuvem para os laboratórios principais. Os blocos marcados como **opcional** usam emuladores locais e exigem as CLIs `aws` e `az` instaladas. Os blocos marcados como **referência de nuvem** mostram comandos reais, **criam recursos que podem gerar cobrança** e não precisam ser executados para completar o guia.

> **Cuidado com limpeza:** cada etapa deixa containers rodando. Ao terminar uma etapa, rode o bloco "Limpeza" dela antes de começar a próxima. Várias etapas usam a porta 8080. Se uma porta já estiver ocupada na sua máquina (confira com `lsof -i :8080` no macOS ou `ss -ltn` no Linux), troque só o lado esquerdo do mapeamento (por exemplo, `"8081:80"` no `ports` do compose ou `-p 8001:8000` no `docker run`) e use a nova porta nos comandos daquela etapa.

### Como ler as tabelas AWS x Azure

Toda tabela de equivalência traz três colunas: a necessidade, o serviço da AWS e o serviço do Azure. Regras do guia:

- A coluna Azure é **acréscimo do professor**, salvo quando a célula disser "citado no material" (é o caso do Azure Cosmos DB e da documentação de análise de domínio da Microsoft). Boa parte da coluna AWS também é acréscimo: o material só cita Amazon SQS, Amazon DynamoDB e Amazon API Gateway. O cabeçalho de cada tabela diz o que foi acrescentado.
- "Equivalente" quer dizer "resolve o mesmo problema", não "é idêntico". Abaixo de cada tabela há uma lista honesta de diferenças.
- Não há preços nem limites numéricos. Eles mudam com o tempo e a região; consulte a página de preços e a página de cotas do provedor antes de decidir.

### Estrutura de pastas do laboratório

```text
lab-arquitetura/
  app/                 # aplicação genérica de teste, usada nas Etapas 01 e 02
  etapa-01/            # monolito x dois serviços
  etapa-02/            # cinco serviços por domínio + gateway
  etapa-03/            # banco por serviço + saga
  etapa-04/            # HTTP síncrono x fila + gateway com rate limit
```

Cada etapa a partir da 02 começa com `cd ..`, que sai da pasta da etapa anterior e volta para `lab-arquitetura`. Todos os comandos de uma etapa rodam dentro da pasta dela.

## Quadro de-para: cole isto no volante

A mesma analogia vale do começo ao fim do documento. Se um microsserviço é um posto especializado da equipe na Etapa 01, ele continua sendo um posto na Etapa 04. Aqui ficam só as peças centrais; cada analogia é explicada de novo no ponto em que aparece. O quadro completo está no [Apêndice: quadro de-para completo](#apêndice-quadro-de-para-completo), no fim do documento.

Uma regra vale para o documento inteiro: **AWS e Azure não viram equipes de F1.** Os dois provedores entram na analogia do mesmo jeito, como dois circuitos diferentes onde a mesma equipe opera.

| Arquitetura de aplicações | Fórmula 1 |
|---|---|
| Aplicação (o sistema inteiro) | A operação da equipe no fim de semana: garagem, crew, muro e fábrica |
| Requisição de um cliente | Um pedido de trabalho que chega à equipe: o piloto pedindo pelo rádio ou o carro entrando no box |
| Monolito | Uma garagem em que os mesmos mecânicos fazem todas as tarefas, com um procedimento único, ensaiado e liberado em bloco |
| Arquitetura em camadas | A cadeia de comunicação: piloto, engenheiro de corrida, muro, analistas de dados; cada nível só fala com o de baixo |
| Microsserviço | Um posto especializado (pneus, estratégia, unidade de potência, a crew de cada roda), com função, gente, equipamento e ensaio próprios |
| Capacidade compartilhada | O double stack: a crew única faz o segundo carro esperar o primeiro |
| Status code HTTP | O semáforo de liberação: verde só quando está tudo preso; `200` com erro é liberação insegura |
| API Gateway | O engenheiro de corrida: única voz entre o piloto e a equipe, que encaminha cada pedido ao posto certo |
| Banco por serviço | Cada disciplina dona dos seus dados: quem precisa pede o número, não abre a planilha do outro |
| Consistência eventual | A classificação provisória, que converge para a oficial depois das decisões dos comissários |
| Saga com compensação | A logística da viagem reservada em passos e desfeita em ordem inversa, com cancelamentos que ficam no histórico |
| Chamada síncrona x fila | O carro parado no box esperando uma tarefa x os pneus retirados que vão para a pilha e são medidos depois |
| Identificador de requisição | O código de barras do pneu, seguido por todos os registros |
| Provedor de nuvem (AWS ou Azure) | O circuito: cada um tem instalações próprias, e o procedimento da equipe é o mesmo nos dois |

## Onde a comparação para

A analogia organiza o raciocínio, mas não substitui o modelo técnico. Os limites principais, que eu repito no texto quando aparecem:

- **Uma crew por equipe.** Na prática, cada equipe tem uma crew só para os dois carros, e o double stack é um custo que a estratégia administra. No software, separar a capacidade de cada serviço é uma escolha de arquitetura, e as réplicas custam pouco.
- **A parada é síncrona por natureza.** Os postos de uma equipe são especializados, mas o carro só sai do box quando as quatro rodas terminam. Microsserviços podem ser independentes também no tempo, conversando por fila.
- **Gente improvisa; gateway não.** O engenheiro de corrida entende o conteúdo, prioriza e às vezes responde de cabeça. O gateway encaminha pelo prefixo, conta pedidos e devolve códigos, sem entender o domínio.
- **A rede não é a garagem.** Dentro da garagem, uma pergunta atravessa três postos em segundos. Entre serviços, cada salto de rede acrescenta latência e uma chance de falha parcial.
- **Consistência eventual por software.** A classificação provisória converge por decisão humana dos comissários. Num sistema distribuído, a convergência é feita por eventos, compensações e regras automáticas.
- **O circuito não se escolhe.** O calendário decide onde a equipe corre. Na nuvem a escolha do provedor é sua, e dá para usar os dois ao mesmo tempo.

Sempre que houver conflito entre a pista e o terminal, vale o que está no terminal: definições, comandos e saídas esperadas do texto técnico.

---

## Etapa 01: Monolito, arquitetura em camadas e microsserviços

*APAGARAM-SE AS LUZES! Largada do GP da Arquitetura de Aplicações, e a primeira curva já cobra caro: uma mudança pequena que obriga a equipe inteira a reensaiar tudo. Antes de dividir a garagem em postos, entenda por que o bloco único trava e o que a separação cobra em troca. Fica comigo.*

### O problema

Sexta-feira, 16h. A equipe de uma plataforma de streaming precisa trocar apenas a integração de upload de vídeos, porque uma nova rede social entrou no contrato. A mudança é pequena, mas o sistema é um único projeto com um único banco e uma única interface: é preciso alterar o código, testar a aplicação inteira e fazer o deploy do bloco todo. Se o módulo de conversão de vídeo tiver um bug escondido, ele pode derrubar o upload e o resto junto. Este é o caso real que o autor do material viveu na TV Bandeirantes, e é o motivo pelo qual existe este módulo.

Antes de resolver, vamos entender a forma de arquitetura que causa a dor e a que a substituiu.

**Leitura de cockpit:** na garagem, o "sexta-feira 16h" é mudar um único passo do trabalho (digamos, a forma de encaixar a roda dianteira esquerda) numa equipe em que todo mundo faz tudo segundo um procedimento só. Como a coreografia é uma só, mudar um passo obriga a reensaiar o trabalho inteiro e a liberar o procedimento novo de uma vez, para todos. Se o passo novo tiver um problema escondido, ele não atrasa só uma roda: ele trava a parada. Guarde essa imagem, porque ela é o monolito.

### O conceito

**Monolito (a analogia do restaurante com uma única cozinha).** Uma só cozinha prepara tudo: entradas, pratos, sobremesas e bebidas. Se o fogão quebra, o restaurante inteiro para; para dobrar a capacidade, é preciso construir um restaurante inteiro novo, mesmo que o gargalo seja só a sobremesa.

Tecnicamente, a arquitetura monolítica é um design em que todos os componentes (front-end, back-end, lógica de negócio, integração com o banco) coexistem no mesmo bloco de código e são implantados como uma única entidade. Características segundo o material:

| Característica | O que significa na prática |
|---|---|
| Unidade coesa | Qualquer alteração exige recompilar e reimplantar a aplicação inteira. |
| Dependências fortes | Uma falha em um componente pode afetar o sistema todo. |
| Dificuldade em escalar | Se uma parte precisa de mais recursos, escala-se a aplicação inteira, com desperdício. |
| Ciclo de desenvolvimento lento | Toda mudança traz risco e pede testes extensivos. |
| Manutenção complexa | À medida que cresce, corrigir um bug ou adicionar um recurso pode ter efeitos inesperados em outras partes. |

**Leitura de cockpit:** pense numa garagem **hipotética** em que dois mecânicos fazem tudo: pneus, bico, ajuste de asa. Se um deles se machuca, a garagem perde metade da capacidade para todas as tarefas; para dobrar a capacidade de trocar bico, é preciso contratar mais gente que também faz tudo. No carro, o exemplo real de dependência forte é o sistema hidráulico: ele aciona câmbio, embreagem e direção assistida, e um vazamento costuma encerrar a corrida inteira, mesmo com motor, pneus e aerodinâmica perfeitos. **Aqui a analogia para:** uma equipe real de F1 já é especializada por posto. A garagem "todo mundo faz tudo" é um modelo para enxergar o problema, não uma descrição de como as equipes trabalham.

**Arquitetura em camadas (a analogia do prédio de andares).** O material diz que o sistema de exemplo (uma empresa de envio de testes, com cinco áreas: Autenticação, ADM, Professor, Empresa e Candidato) foi escrito "com as boas práticas da época", isto é, em camadas. Como as figuras do PDF não vêm no texto extraído, a descrição abaixo é a organização clássica em três camadas, explicada pelo professor: cada andar só conversa com o andar de baixo.

```text
sistema-testes/
  apresentacao/   # telas e controladores: recebem a requisição e devolvem a resposta
  negocio/        # regras: agendar teste, registrar feedback
  dados/          # repositórios: único lugar que fala com o banco
```

Ponto importante: **camadas organizam o código dentro de um único pacote de deploy**. Elas são um corte horizontal. Mesmo um monolito impecavelmente em camadas continua sendo implantado de uma vez, escalado de uma vez e derrubado de uma vez. Os microsserviços são outro eixo: um corte vertical, por funcionalidade de negócio, cada fatia com seu próprio código, deploy e dados.

**Leitura de cockpit:** a F1 tem uma arquitetura em camadas conhecida: a cadeia de comunicação. O piloto fala com o engenheiro de corrida (apresentação: recebe o pedido e devolve a resposta); o engenheiro leva ao muro de estratégia (negócio: decide se o carro para nesta volta); o muro consulta os analistas de dados, na pista e na sala de operações remota (dados: o único lugar que mexe na telemetria bruta). Cada nível só conversa com o de baixo, e isso organiza muito bem quem decide o quê. Mas a equipe continua indo para a pista inteira: carro, crew e muro chegam ao circuito, trabalham e são cobrados como um bloco. Organizar a hierarquia não muda o fato de que o fim de semana é um pacote só, e é exatamente isso que o texto diz das camadas.

**Microsserviços (a analogia da praça de alimentação).** Cada quiosque tem sua cozinha, sua equipe e seu caixa. Se o quiosque de sorvete fecha, o de pizza continua vendendo; se a fila da pizza cresce, abre-se outro balcão de pizza, não outra praça de alimentação inteira.

A definição do material: uma abordagem arquitetural que divide uma aplicação em um conjunto de serviços pequenos, independentes e focados em uma única tarefa, que podem ser desenvolvidos, implantados e escalados de forma independente. Características principais:

- **Autonomia**: cada serviço é responsável por uma única função.
- **Desenvolvimento descentralizado**: equipes diferentes, possivelmente com linguagens e tecnologias diferentes.
- **Escalabilidade**: só quem precisa de mais recursos é escalado.
- **Comunicação via API**: REST, GraphQL, RPC (Remote Procedure Call) ou mensageria.

**Leitura de cockpit:** é a garagem organizada por posto: o engenheiro de pneus, o de unidade de potência, o estrategista e, no pit stop, a crew de cada roda, cada um com sua tarefa, seu equipamento e seu ensaio. Se o posto da roda dianteira esquerda troca de pistola, os outros não reensaiam nada. Se a equipe precisa de mais gente analisando pneus num fim de semana de desgaste alto, reforça só aquele posto. E cada posto conversa por um canal combinado (o rádio interno, os canais de telemetria), que faz o papel da API. **Aqui a analogia para:** os postos de uma equipe têm independência de gente e de ferramenta, mas a parada no box ainda é síncrona: o carro só sai quando as quatro rodas terminam. Microsserviços podem (e muitas vezes devem) ser independentes também no tempo, como mostra a Etapa 04.

Como o REST é o mais comum, há um cuidado essencial: **cada resposta deve usar o status code HTTP correto**. Um serviço que devolve `200` com um corpo de erro engana o serviço que o chamou, que acha que deu certo e segue em frente.

**Leitura de cockpit:** status code é o semáforo de liberação do box. Verde quer dizer "pode sair, está tudo preso", e o resto da equipe age em cima dele sem conferir de novo. Um `200` com corpo de erro é o semáforo verde com a roda solta: a liberação insegura. Foi o que aconteceu com a Ferrari no GP do Bahrein de 2018: o carro foi liberado com um pneu ainda sendo trocado, um mecânico se feriu (quebrou a perna) e a equipe levou multa de 50 mil euros. Quem confia no sinal segue em frente, e o problema aparece mais adiante, mais caro. O sinal precisa dizer a verdade.

**O preço da independência.** O material é honesto: antes de adotar, pese os desafios.

| Desafio | Em uma frase |
|---|---|
| Complexidade | Cada serviço é simples, o conjunto é complicado (comunicação e coordenação). |
| Desenvolvimento e testes | Testar serviços que dependem de outros exige outra mentalidade e outras ferramentas. |
| Governança descentralizada | Linguagens e frameworks diferentes dificultam manutenção; padronize ao menos logs e monitoramento. |
| Latência | Cadeias de chamadas acumulam atraso; comunicação assíncrona e filas ajudam (Etapa 04). |
| Consistência de dados | Cada serviço tem seus dados; prefere-se consistência eventual a transações ACID globais (Etapa 03). |
| Gerenciamento | Exige cultura DevOps; correlacionar logs entre serviços é essencial (Etapa 04). |
| Controle de versão | Atualizar um serviço não pode quebrar quem depende dele (contratos, Etapa 02). |
| Competências da equipe | Sistemas distribuídos pedem experiência em CI, automação de infraestrutura e monitoramento. |

**Leitura de cockpit:** essa tabela é o custo de ter uma equipe com dezenas de postos. Alguém precisa coordenar (o muro); todos precisam falar a mesma língua no rádio e registrar dados no mesmo padrão (governança); cada pergunta que atravessa três postos demora três respostas (latência); e testar a parada exige ensaiar a crew inteira, não só um mecânico. Uma equipe pequena com poucos postos bem treinados ganha de uma equipe grande desorganizada.

**O case do streaming, lado a lado.** O sistema recebia dados de satélite, convertia vídeos para o navegador, cortava trechos e subia clipes para uma rede social. Na versão em microsserviços (o autor avisa que os pontos abaixo são exemplos e nem todos foram usados na época):

| Funcionalidade | No monolito | Como serviço |
|---|---|---|
| Receber dados do satélite | Módulo do mesmo projeto | Serviço com seu próprio banco; grava em banco e em storage |
| Converter vídeo | Módulo do mesmo projeto | Serviço que lê o banco, acha o arquivo e converte para formato de navegador |
| Interface | Parte do mesmo projeto | Projeto só de apresentação (o material o chama de "ator condutor", termo da arquitetura hexagonal para quem dispara ações no sistema, como a interface do usuário) |
| Cortar trechos | Módulo do mesmo projeto | Serviço que busca os trechos pedidos para criar um clipe |
| Upload na rede social | Módulo do mesmo projeto | Serviço que recebe dados de um canal por uma fila e faz o upload |

**No mercado (segundo o material):** o time-to-market faz as empresas priorizarem entregas frequentes sem impactar o sistema todo; startups e grandes empresas têm optado por **componentização gradual**, transformando partes críticas em serviços autônomos, em vez de reescrever tudo. O Mercado Livre é citado como exemplo de uso em larga escala. A adoção está ligada a DevOps (CI/CD, containers, Kubernetes, observabilidade, infraestrutura como código) e à composição de sistemas por APIs, com gateways, eventos e segurança distribuída.

**Onde isso roda na nuvem.** O material não aborda hospedagem. Como acréscimo do professor, esta é a tabela de onde cada serviço costuma viver:

| Necessidade | AWS (acréscimo do professor) | Azure (acréscimo do professor) |
|---|---|---|
| Máquina virtual (o monolito "lift and shift") | Amazon EC2 | Azure Virtual Machines |
| Containers gerenciados, sem administrar o orquestrador | Amazon ECS (com AWS Fargate para não gerenciar servidores) | Azure Container Apps |
| Kubernetes gerenciado | Amazon EKS | Azure Kubernetes Service (AKS) |
| Funções (FaaS) | AWS Lambda | Azure Functions |

Diferenças honestas: os nomes e o grau de abstração variam. O Azure Container Apps é uma plataforma de containers serverless que roda sobre Kubernetes sem expô-lo ao usuário; o ECS é o orquestrador próprio da AWS, e não Kubernetes. Para quem quer Kubernetes de verdade, EKS e AKS são os pares. Modelos de cobrança e limites de cada um mudam com frequência: consulte a documentação oficial.

**Leitura de cockpit:** AWS e Azure são dois circuitos. Em qualquer um deles, você escolhe quanto da infraestrutura local vai usar: a máquina virtual é montar a sua estrutura inteira dentro da garagem; containers gerenciados e funções são usar cada vez mais o que o circuito já entrega pronto (energia, cronometragem, estrutura) e cuidar só do carro. O procedimento da equipe é o mesmo nos dois circuitos; o que muda é o nome das instalações e o que cada uma oferece. **Aqui a analogia para:** o calendário escolhe o circuito da equipe; o provedor de nuvem é escolha sua.

### Exemplo comentado: o mesmo sistema como monolito e como dois serviços

Vamos usar uma aplicação genérica de teste. Ela é um **modelo** (uma maquete): cada instância atende no máximo N requisições ao mesmo tempo, e cada tipo de rota tem um tempo de resposta fixo. Assim os números ficam previsíveis.

**Leitura de cockpit:** no nosso mapa, cada instância é um grupo de mecânicos com `CAPACIDADE` pessoas livres ao mesmo tempo. A rota `pedidos` é a troca de pneus (rápida, 0,1 s) e a rota `relatorios` é a troca de bico (lenta, 2 s). O container `monolito` é a garagem em que os mesmos dois mecânicos fazem as duas coisas; `pedidos` e `relatorios` são dois postos separados, cada um com a sua dupla. **Aqui a analogia para:** os tempos são de maquete. O que importa é que uma tarefa é muito mais lenta que a outra, como a troca de bico é mais lenta que a de pneus.

Crie a estrutura:

```sh
mkdir -p lab-arquitetura/app lab-arquitetura/etapa-01 && cd lab-arquitetura
```

`app/app.py`:

```python
import json
import os
import socket
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

NOME = os.getenv("NOME", socket.gethostname())  # identifica quem respondeu
ROTAS = set(os.getenv("ROTAS", "pedidos,relatorios").split(","))  # prefixos que ESTE processo atende
CAPACIDADE = threading.Semaphore(int(os.getenv("CAPACIDADE", "2")))  # requisições simultâneas
DEMORA = {"relatorios": 2.0}  # segundos por rota; o padrão está abaixo
DEMORA_PADRAO = 0.1  # 100 ms para as demais rotas


class Handler(BaseHTTPRequestHandler):
    def responder(self, status, corpo):
        dados = (json.dumps(corpo, ensure_ascii=False) + "\n").encode()
        self.send_response(status)  # o status code é parte do contrato
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(dados)))
        self.end_headers()
        self.wfile.write(dados)

    def do_GET(self):
        partes = [p for p in self.path.split("?")[0].split("/") if p]
        if self.path == "/health":
            return self.responder(200, {"status": "ok"})
        if self.path == "/crash":
            os._exit(1)  # simula um defeito grave: o processo morre na hora
        if not partes or partes[0] not in ROTAS:
            return self.responder(404, {"erro": "rota inexistente neste serviço", "servico": NOME})
        area = partes[0]
        if partes[1:] == ["999"]:
            return self.responder(404, {"erro": "recurso não encontrado", "servico": NOME})
        if partes[1:] == ["erro"]:
            return self.responder(500, {"erro": "falha interna simulada", "servico": NOME})
        with CAPACIDADE:  # só N entram de cada vez; as demais esperam
            time.sleep(DEMORA.get(area, DEMORA_PADRAO))  # trabalho simulado
        self.responder(200, {"servico": NOME, "caminho": self.path})


class Servidor(ThreadingHTTPServer):
    request_queue_size = 128


if __name__ == "__main__":
    Servidor(("0.0.0.0", 8080), Handler).serve_forever()
```

`app/Dockerfile`:

```dockerfile
# Imagem pequena com Python
FROM python:3.12-alpine
# Pasta de trabalho dentro da imagem
WORKDIR /srv
# Copia só o código
COPY app.py .
# Porta que a aplicação escuta
EXPOSE 8080
# -u desliga o buffer de saída para os logs aparecerem na hora
CMD ["python", "-u", "app.py"]
```

`etapa-01/compose.yaml` (o mesmo código, em duas topologias):

```yaml
services:
  monolito:                      # UM processo atende pedidos E relatórios
    image: lab-arq-app           # imagem construída com o docker build logo abaixo
    init: true                   # init como PID 1: repassa o SIGTERM e o stop leva 1 s, não 10 s
    environment:
      NOME: monolito             # aparece nas respostas
      ROTAS: pedidos,relatorios  # as duas áreas no mesmo processo
    ports: ["8090:8080"]         # acesso direto, só para o laboratório

  pedidos:                       # serviço 1: só pedidos
    image: lab-arq-app
    init: true
    environment:
      NOME: pedidos
      ROTAS: pedidos
    ports: ["8091:8080"]

  relatorios:                    # serviço 2: só relatórios
    image: lab-arq-app
    init: true
    environment:
      NOME: relatorios
      ROTAS: relatorios
    ports: ["8092:8080"]
```

O `init: true` coloca um processo init mínimo como PID 1 do container. Sem ele, o Python vira o PID 1, ignora o SIGTERM enviado por `docker compose stop` e `docker compose down`, e o Docker espera o prazo de 10 s antes de matá-lo com SIGKILL: o comando parece travado. Os compose das próximas etapas repetem a opção nos serviços Python.

Construa a imagem e suba tudo:

```sh
docker build -t lab-arq-app ./app
cd etapa-01 && docker compose up -d
```

Saída esperada (resumida): três containers `Started`.

### Mão na massa

*Pit lane aberto! Quatro testes cronometrados com a mesma imagem em duas topologias: o status code como sinal, o double stack no monolito, a mesma carga com postos separados e um crash de propósito. Olho no `time_total`.*

**1. Conferir que as duas topologias respondem, e ver o status code como contrato.**

```sh
curl -s localhost:8090/pedidos/1
curl -s -o /dev/null -w "%{http_code}\n" localhost:8091/pedidos/999
curl -s -o /dev/null -w "%{http_code}\n" localhost:8091/pedidos/erro
curl -s -o /dev/null -w "%{http_code}\n" localhost:8091/relatorios/mensal
```

Esperado:

```text
{"servico": "monolito", "caminho": "/pedidos/1"}
404
500
404
```

O último `404` mostra uma fronteira: o serviço de pedidos não conhece a rota de relatórios. No monolito, as duas moram juntas.

**Leitura de cockpit:** o `404` do posto de pedidos para `relatorios` é o mecânico de pneu dizendo "bico não é comigo". O `500` é o posto admitindo a falha. Os dois são sinais honestos, e é com eles que o resto da equipe decide o que fazer.

**2. Uma funcionalidade lenta contamina a outra (monolito).** Disparamos quatro relatórios (2 s cada, capacidade 2) e, logo depois, um simples pedido:

```sh
for i in 1 2 3 4; do curl -s -o /dev/null localhost:8090/relatorios/mensal & done
sleep 0.2
curl -s -o /dev/null -w "pedido no monolito: %{time_total}s\n" localhost:8090/pedidos/1
wait
```

Esperado: algo entre 2 e 4 segundos (tipicamente perto de 4), para uma operação que leva 0,1 s sozinha. O pedido ficou na fila atrás dos relatórios, porque os dois dividem a mesma capacidade.

**Leitura de cockpit:** é o double stack. Exemplo **hipotético**: a McLaren chama o Lando Norris para trocar o bico e, logo atrás, o Oscar Piastri entra para uma troca simples de pneus. Como a equipe tem uma crew só, o Piastri espera parado no box até a crew terminar o carro do Norris, e a parada dele, que seria rápida, herda o tempo do companheiro. É o pedido de 0,1 s levando quase 4 s.

**3. A mesma carga, com serviços separados.**

```sh
for i in 1 2 3 4; do curl -s -o /dev/null localhost:8092/relatorios/mensal & done
sleep 0.2
curl -s -o /dev/null -w "pedido no serviço próprio: %{time_total}s\n" localhost:8091/pedidos/1
wait
```

Esperado: cerca de `0.10s`. O serviço de relatórios está saturado e o de pedidos nem percebe.

**Leitura de cockpit:** com postos separados, a fila do bico não encosta na troca de pneus. **Aqui a analogia para:** na prática, cada equipe de F1 tem uma crew só para os dois carros, então o double stack é um custo que a estratégia administra. No software, separar a capacidade é uma decisão de arquitetura, e custa pouco.

**4. O raio de explosão de um defeito.**

```sh
# Monolito: um defeito em qualquer rota mata o processo inteiro
curl -s -o /dev/null -w "crash: %{http_code}\n" localhost:8090/crash
curl -s -o /dev/null -w "pedidos no monolito depois do crash: %{http_code}\n" localhost:8090/pedidos/1

# Serviços: o defeito mata só o serviço de relatórios
curl -s -o /dev/null -w "crash: %{http_code}\n" localhost:8092/crash
curl -s -o /dev/null -w "pedidos (serviço próprio): %{http_code}\n" localhost:8091/pedidos/1
sleep 1                                   # dá tempo de o Docker registrar a saída dos processos
docker compose ps -a --format "table {{.Service}}\t{{.Status}}"
```

Esperado: `000` nos dois crashes (o processo morreu e a conexão foi fechada), `000` para os pedidos do monolito, `200` para os pedidos do serviço próprio. O `ps` mostra `monolito` e `relatorios` como `Exited (1)`.

Para recuperar: `docker compose up -d`.

**Leitura de cockpit:** o raio de explosão é o vazamento hidráulico. No monolito, uma pane em qualquer parte encerra o trabalho do processo inteiro (`Exited (1)`). Com serviços separados, a pane para um posto e o resto da equipe segue trabalhando. Em Sepang, o carro do George Russell parou na reta durante o último safety car e ele saiu sem pontos: quando o processo morre, não importa quão bom estava o resto. **Aqui a analogia para:** o `docker compose up -d` é o que a F1 não tem. Carro que abandona não volta para a corrida; um processo que caiu sobe de novo em segundos.

**Limpeza:**

```sh
docker compose down
```

### Exercícios

*Volta lançada! Quatro perguntas, sem olhar o texto. É aqui que se separa quem repete "microsserviço é moderno" de quem sabe dizer quando não migrar.*

1. **Camadas resolvem o problema do sexta-feira 16h?** Justifique. *Resposta esperada:* não. Camadas organizam o código dentro de um único artefato de deploy; a mudança no upload continua exigindo testar e implantar tudo. Quem resolve é o corte por serviço, com deploy independente.
2. **Mapeie o case.** Diga qual serviço da versão com microsserviços do streaming é o melhor candidato a ser escalado quando muitos usuários pedem clipes ao mesmo tempo, e por quê. *Resposta esperada:* o serviço que corta trechos e cria clipes, porque é ele que recebe a demanda dos usuários; só ele precisa de mais réplicas, enquanto o serviço que recebe dados do satélite pode continuar com uma instância.
3. **Status code.** Um serviço de pagamentos devolve `200` com o corpo `{"erro": "saldo insuficiente"}`. Que problemas isso causa a quem o chama? *Resposta esperada:* o cliente acha que deu certo; métricas de erro por status code (usadas para monitoramento) ficam cegas; mecanismos de retry e alertas não disparam. O correto seria um código de erro adequado (por exemplo, `4xx` para erro do cliente e `5xx` para falha do servidor).
4. **Quando NÃO migrar.** Uma equipe de 3 pessoas mantém um sistema interno com pouco tráfego. Use a tabela de desafios para argumentar. *Resposta esperada:* o ganho de independência de deploy e de escala não compensa o custo de complexidade, de latência entre serviços, de consistência de dados e de operação, especialmente com poucas pessoas e sem maturidade em CI/CD e monitoramento. Um monolito bem organizado em camadas atende melhor.

### Anota aí

> Camadas organizam o código dentro de um deploy; microsserviços dividem o próprio deploy por funcionalidade, e trocam a dor do bloco único pela complexidade de um sistema distribuído.

*Setor 1 no verde! Você mediu no cronômetro o pedido de 0,1 s herdando quase 4 s no monolito, e viu o posto de pedidos seguir de pé depois do crash do vizinho. Dependência forte decide campeonato: em Adelaide, em 1986, um pneu traseiro do Nigel Mansell explodiu na reta na última corrida do ano e levou junto o título que estava ao alcance dele. Agora vem a parte de desenho do circuito: onde cortar os serviços, na Etapa 02.*

---

## Etapa 02: Microsserviços: onde cortar e como expor

*Segundo setor, e aqui a pista exige traçado, não força bruta. A equipe já decidiu separar os postos; a pergunta agora é onde passar a faca. Corte errado vira monolito distribuído, com a latência da rede e nenhuma das vantagens. Atenção à tomada de curva.*

### O problema

A equipe decidiu migrar. Na reunião, alguém propõe: "um serviço para o banco de dados, um para as regras, um para as telas". Parece organizado, mas toda funcionalidade nova (por exemplo, "agendar bate-papo com um professor") passa a atravessar os três serviços, que precisam ser alterados e implantados juntos. Foi criado um monolito distribuído: tem a latência da rede e a complexidade dos microsserviços, sem nenhuma das vantagens. O erro foi cortar por **camada técnica**. O material é direto: os serviços devem ser estruturados por **capacidade de negócio**.

Não existe fórmula exata ("bala de prata"): é preciso refletir sobre o domínio, os requisitos e as características arquiteturais, sob pena de acabar com dependências não planejadas e interfaces mal estruturadas.

**Leitura de cockpit:** cortar por camada técnica seria organizar a equipe em "quem mexe nos dados", "quem decide" e "quem fala com o piloto", sem dono de nenhum assunto. Toda pergunta nova ("paramos uma volta antes do Leclerc para tentar ganhar a posição?") atravessaria os três grupos, e qualquer mudança exigiria os três juntos. As equipes reais se organizam por disciplina (aerodinâmica, dinâmica veicular, unidade de potência, pneus, estratégia), e é isso que o material chama de capacidade de negócio.

### O conceito

**Analogia: os departamentos de uma empresa.** Financeiro, RH e Comercial têm responsabilidades próprias e conversam por solicitações claras ("preciso de um relatório de contratações"). Ninguém no Comercial abre a gaveta do RH. Uma empresa organizada por "quem digita", "quem decide" e "quem arquiva" travaria em cada tarefa.

**Princípios para definir os limites (do material):**

- **Baixo acoplamento e alta coesão.** Dá para mudar um serviço sem mexer em outro; cada serviço tem um propósito específico (gerenciar contas de usuários, registrar o histórico de entregas).
- **Esconder a complexidade do domínio.** A interface é simples e abstrai o interior. Um candidato agenda um bate-papo sem saber como a alocação de recursos funciona.
- **Características arquiteturais por serviço.** Um serviço voltado ao cliente pode priorizar desempenho e disponibilidade; um serviço de back-end pode priorizar tolerância a falhas e segurança. Atenção: quando os serviços dependem de comunicação **síncrona**, essas características acabam compartilhadas (a disponibilidade de um depende da do outro), o que aumenta a interdependência.
- **Cada serviço com uma única responsabilidade** (SRP aplicado à arquitetura), refletindo um domínio de negócio, com **comunicação mínima e clara** entre eles.

**Leitura de cockpit:** baixo acoplamento é o engenheiro de pneus poder trocar o método de medir desgaste sem que a estratégia mude nada; alta coesão é tudo sobre pneus morar no posto de pneus. Esconder a complexidade é o que o piloto vive: ele pergunta "quantas voltas esse pneu aguenta?" e recebe um número, sem ver o modelo de desgaste por trás. E o alerta sobre comunicação síncrona já aparece aqui: se a estratégia não decide nada sem a resposta do posto de pneus, um posto de pneus fora do ar paralisa a estratégia.

*Ponto de frenagem! Bounded context não se decora, se reconhece no vocabulário de quem trabalha no negócio. É neste parágrafo que se separam os pontuadores do resto do grid; leia devagar.*

**DDD estratégico: o método para achar os cortes.** O Domain-Driven Design (DDD) propõe conversar com especialistas do negócio e desenhar o domínio antes de desenhar os serviços. O fluxo da documentação da Microsoft usada no material (citado no material) segue, em resumo, a sequência: analisar o domínio de negócio, definir os **contextos delimitados (bounded contexts)**, definir entidades, agregados e serviços dentro de cada contexto e, por fim, identificar os microsserviços. Um bounded context é uma fronteira dentro da qual um modelo e seus termos têm um significado único. A mesma palavra pode significar coisas diferentes em contextos diferentes (por exemplo, "agendamento" para o Professor é uma agenda a cumprir; para o Candidato é uma reserva de horário). Definir limites é um processo **contínuo**: com o sistema evoluindo, é normal redesenhar fronteiras.

**Leitura de cockpit:** na F1, a palavra "janela" é um contexto delimitado de livro. Para o estrategista, janela é o intervalo de voltas em que compensa parar; para o engenheiro de pneus, janela é a faixa de temperatura em que o pneu funciona. Mesma palavra, dois modelos. Uma equipe que forçasse um conceito único de "janela" criaria confusão no rádio; cada posto mantém o seu, e a conversa entre eles é traduzida na fronteira.

**Aplicando ao sistema de testes.** A divisão proposta no material:

| Serviço | Responsabilidade | Observações do material |
|---|---|---|
| Autenticação | Login, logout e segurança para todos os usuários | Pode usar **JWT** como token, compartilhável entre sistemas, com roles |
| ADM | Visão geral: professores cadastrados, empresas vinculadas, acessos por empresa, candidatos por empresa | Poderia ter só um banco de cache (estratégia hot cache, aquecido antes do uso, ou cold cache, preenchido sob demanda) e consultar uma API quando necessário |
| Professor | Listar agendamentos em aberto; registrar feedback | |
| Empresa (Company) | Listar candidatos; enviar acesso; acompanhar testes | |
| Candidato | Realizar teste; ver status (concluído, pendente, com feedback) | |

**Leitura de cockpit:** a Autenticação com JWT é o credenciamento do paddock: a credencial é emitida uma vez e mostrada em cada portão, e o nível de acesso (garagem, pit lane, muro) vem impresso nela, como as roles do token. O ADM com cache é o painel do chefe de equipe: um resumo alimentado pelos departamentos, que ele consulta sem entrar na planilha de ninguém.

**Contratos: como serviços se entendem sem se conhecer.** A comunicação precisa de contratos versionados. O material cita **OpenAPI** (descreve APIs HTTP) e **AsyncAPI** (descreve APIs orientadas a eventos e mensagens). Um contrato versionado é a resposta ao desafio "atualizar um serviço não deve quebrar os outros".

**Leitura de cockpit:** contrato versionado é a lista de canais da telemetria (nome, unidade e frequência de cada um) e o vocabulário fixo do rádio. Se o pessoal de unidade de potência renomeia um canal sem avisar, o software do muro que lia aquele canal para de mostrar o dado. Por isso a lista tem versão, e canal antigo só sai depois que todo mundo migrou. No nosso mapa, OpenAPI descreve as perguntas e respostas; AsyncAPI descreve o que é transmitido sem ninguém pedir.

**Como os serviços se encontram: service discovery.** Quando existem várias réplicas e elas sobem e descem, ninguém fixa um IP no código; usa-se um **nome** que o sistema resolve para as instâncias saudáveis. Em Docker Compose, o nome do serviço já funciona assim (DNS interno). Em Kubernetes, o objeto Service faz o mesmo.

**Leitura de cockpit:** no rádio interno da equipe, ninguém chama o mecânico pelo nome; chama-se o posto ("pneus", "estratégia"), e quem estiver escalado ali naquele dia responde. O nome do serviço no Compose, ou o Service no Kubernetes, faz o mesmo: o código chama `empresa`, e o DNS entrega uma instância saudável, seja ela qual for.

**Na nuvem (acréscimo do professor).** O material não trata de descoberta de serviços; a tabela abaixo é complemento.

| Necessidade | AWS (acréscimo do professor, salvo Amazon API Gateway, citado no material) | Azure (acréscimo do professor) |
|---|---|---|
| Descoberta de serviço, registro por nome | AWS Cloud Map; no ECS, o ECS Service Connect | Não há um produto isolado equivalente 1:1; o Azure Container Apps traz descoberta por nome integrada ao ambiente, e o AKS usa o DNS do Kubernetes |
| Kubernetes gerenciado, DNS interno por Service | EKS | AKS |
| Fachada única de entrada para os serviços | Amazon API Gateway | Azure API Management (detalhes na Etapa 04) |

Diferenças honestas: na AWS, a descoberta de serviço é um produto à parte (Cloud Map). No Azure, ela costuma vir embutida na plataforma de execução escolhida. Em Kubernetes (EKS ou AKS), o mecanismo é o mesmo: DNS do cluster. Antes de escolher, confirme na documentação o que o seu serviço de containers oferece.

**Leitura de cockpit:** nos dois circuitos o rádio interno funciona, mas a instalação muda. Num deles (AWS), o diretório de postos é uma instalação à parte que você contrata (Cloud Map); no outro (Azure), ele vem embutido na garagem que você escolher (Container Apps ou AKS). A equipe e o procedimento são os mesmos.

**Tendências citadas no material:** times multidisciplinares por produto ("You build it, you run it"), observabilidade por métricas, logs estruturados e tracing distribuído (Prometheus, Grafana, ELK Stack, Jaeger, OpenTelemetry), documentação viva, contratos versionados, testes automatizados entre serviços e engenharia de plataforma com plataformas internas de desenvolvimento.

### Exemplo comentado: cinco serviços por domínio atrás de um gateway

Vamos reaproveitar a imagem `lab-arq-app`. Cada serviço atende um prefixo (`ROTAS`), e um Nginx faz o papel de **fachada única**: o cliente conhece só `localhost:8080`, e o gateway roteia pelo prefixo da URL.

**Leitura de cockpit:** o Nginx é o engenheiro de corrida. O piloto (o cliente) conhece uma única voz, `localhost:8080`, e não sabe quem são os especialistas por trás. Ele diz "candidato" ou "empresa", e o engenheiro encaminha cada pedido para o posto certo pelo prefixo. É a mesma figura da cadeia de comunicação da Etapa 01: lá, o engenheiro era a camada de apresentação de um único bloco; aqui, o gateway ocupa esse mesmo lugar de voz única, mas agora na frente de vários postos independentes.

```sh
cd ..                               # sai de etapa-01 e volta para lab-arquitetura
mkdir -p etapa-02 && cd etapa-02
pwd                                 # deve terminar em /lab-arquitetura/etapa-02
```

`gateway.conf`:

```nginx
server {
    listen 80;
    resolver 127.0.0.11 valid=5s;   # DNS interno do Docker; resolve os nomes dos serviços em tempo de requisição

    location /autenticacao/ { set $alvo http://autenticacao:8080; proxy_pass $alvo; }  # prefixo -> serviço
    location /adm/          { set $alvo http://adm:8080;          proxy_pass $alvo; }
    location /professor/    { set $alvo http://professor:8080;    proxy_pass $alvo; }
    location /empresa/      { set $alvo http://empresa:8080;      proxy_pass $alvo; }
    location /candidato/    { set $alvo http://candidato:8080;    proxy_pass $alvo; }
}
```

Duas observações: usar uma variável no `proxy_pass` (com `resolver`) faz o Nginx resolver o nome a cada uso, de modo que o gateway sobe mesmo se um serviço estiver parado e responde `502` só para aquela rota. Sem a variável, o Nginx tenta resolver todos os nomes na partida e recusa-se a iniciar se algum não existir. Além disso, como `proxy_pass` não tem URI, o caminho original é repassado ao serviço sem alteração.

**Leitura de cockpit:** a variável no `proxy_pass` é o engenheiro que confere quem está no posto na hora do pedido, e não só antes da sessão. Se um posto está vazio, ele diz ao piloto "sem resposta desse posto agora" (`502`) e segue atendendo os outros. Sem a variável, o engenheiro se recusaria a começar a sessão se faltasse alguém na lista.

`compose.yaml`:

```yaml
services:
  autenticacao:
    image: lab-arq-app
    init: true                                                  # stop rápido (veja a Etapa 01)
    environment: { NOME: autenticacao, ROTAS: autenticacao }   # só responde pelo seu domínio
  adm:
    image: lab-arq-app
    init: true                                                  # stop rápido (veja a Etapa 01)
    environment: { NOME: adm, ROTAS: adm }
  professor:
    image: lab-arq-app
    init: true                                                  # stop rápido (veja a Etapa 01)
    environment: { NOME: professor, ROTAS: professor }
  empresa:
    image: lab-arq-app
    init: true                                                  # stop rápido (veja a Etapa 01)
    environment: { NOME: empresa, ROTAS: empresa }
  candidato:
    image: lab-arq-app
    init: true                                                  # stop rápido (veja a Etapa 01)
    environment: { NOME: candidato, ROTAS: candidato }

  gateway:
    image: nginx:1.27-alpine
    ports: ["8080:80"]                                          # única porta exposta ao mundo
    volumes:
      - ./gateway.conf:/etc/nginx/conf.d/default.conf:ro        # substitui a configuração padrão
    depends_on: [autenticacao, adm, professor, empresa, candidato]
```

Suba: `docker compose up -d`.

### Mão na massa

*Rádio ligado! Cinco serviços atrás de uma única voz em `localhost:8080`, e três chamadas para conferir: cada prefixo no seu posto, um posto derrubado de propósito e um pedido para um posto que não existe.*

**1. Cada prefixo cai no serviço do seu domínio.**

```sh
for d in autenticacao adm professor empresa candidato; do
  curl -s localhost:8080/$d/exemplo
done
```

Esperado: cinco linhas, cada uma com `"servico"` igual ao prefixo pedido, por exemplo `{"servico": "empresa", "caminho": "/empresa/exemplo"}`.

**2. Falha isolada: derrube só o serviço de Empresa.**

```sh
docker compose stop empresa
for d in autenticacao professor empresa candidato; do
  echo -n "$d: "; curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/$d/exemplo
done
```

Esperado: `200` para autenticação, professor e candidato, e `502` para empresa. O gateway é a prova de que o corte por domínio contém o dano.

**Leitura de cockpit:** derrubar `empresa` é um posto ficar fora do ar no meio da sessão. O piloto continua recebendo resposta dos outros postos; só aquele assunto fica sem retorno. **Aqui a analogia para:** o engenheiro de corrida real improvisa, prioriza e às vezes responde de cabeça. O gateway não sabe nada do domínio: só encaminha e devolve o código.

**3. Rota que nenhum serviço atende.**

```sh
curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/financeiro/relatorio
```

Esperado: `404`, devolvido pelo próprio gateway.

**Leitura de cockpit:** é o engenheiro respondendo "esse posto não existe nesta equipe" sem incomodar ninguém da garagem.

**Limpeza:**

```sh
docker compose down
```

### Exercícios

*Volta lançada! Quatro perguntas sobre onde passar a faca. Relógio rodando, e sem espiar a tabela do sistema de testes.*

1. **Cortar por camada ou por capacidade?** Classifique cada proposta de serviço: (a) "serviço de acesso a dados", (b) "serviço de agendamento", (c) "serviço de mensagens". *Resposta esperada:* (a) e (c) são camadas técnicas, indesejáveis como fronteira de serviço; (b) é capacidade de negócio.
2. **Onde mora "enviar acesso ao candidato"?** A Empresa precisa enviar credenciais, mas credenciais são da Autenticação. Proponha como os dois serviços colaboram sem a Empresa ler o banco da Autenticação. *Resposta esperada:* a Empresa chama a API (ou publica um evento) da Autenticação pedindo a criação das credenciais; a Autenticação é dona do dado e responde. A Empresa nunca acessa o banco dela (assunto da Etapa 03).
3. **ADM sem banco próprio.** O material sugere que o ADM tenha só um cache. Quais são as duas formas de ele obter "candidatos por empresa" sem ler o banco da Empresa, e qual o custo de cada? *Resposta esperada:* (i) consultar a API da Empresa quando precisar, com latência e dependência síncrona; (ii) manter um cache atualizado por eventos ou por expiração, aceitando dado temporariamente desatualizado (consistência eventual).
4. **Contexto delimitado.** Escreva uma palavra do sistema que significa coisas diferentes para o Professor e para a Empresa e explique por que isso justifica separar os serviços. *Resposta esperada:* por exemplo, "teste": para a Empresa é algo contratado e acompanhado; para o Professor é algo a avaliar e dar feedback. Modelos distintos para o mesmo termo indicam contextos distintos, e forçar um modelo único cria acoplamento.

### Anota aí

> Corte pelo negócio, não pela tecnologia: cada serviço dono de uma capacidade, com contrato claro, falhando e escalando sozinho.

*Setor 2 no verde! Serviços cortados por capacidade de negócio, contrato versionado e um gateway que contém o dano quando um posto cai. E combinado só vale se todo mundo cumpre: em Sepang, em 2013, a Red Bull pediu pelo rádio que o Sebastian Vettel mantivesse a posição atrás do Mark Webber, e ele ultrapassou mesmo assim. Foi o caso Multi-21, nome do código daquela ordem: um contrato que um lado ignora quebra quem dependia dele, e é por isso que contrato entre serviços se versiona e se cumpre. Agora a pista fica técnica de verdade: dados distribuídos, na Etapa 03.*

---

## Etapa 03: Banco de dados com microsserviços

*Terceiro setor, e é a parte mais técnica do circuito. Cada posto passa a guardar os próprios dados, e com isso acaba a transação que resolvia tudo de uma vez. Consistência eventual, CAP, saga, compensação: curva atrás de curva, sem área de escape. Mãos firmes no volante.*

### O problema

Black Friday. O serviço de pedidos e o de estoque compartilham o mesmo banco "para simplificar". A equipe de estoque renomeia uma coluna num sábado, e o serviço de pedidos, que lia aquela coluna diretamente, para de funcionar sem que ninguém de pedidos soubesse da mudança. Além disso, as duas equipes precisam escolher o mesmo banco, escalar o mesmo banco e esperar o mesmo banco. Foi o acoplamento mais forte possível, escondido atrás de dois serviços aparentemente independentes.

A resposta do material: **cada serviço tem o seu próprio banco** e ninguém lê o banco dos outros. Isso resolve o acoplamento, mas cobra caro: acabaram as transações ACID globais, e é preciso aprender a lidar com dados distribuídos.

**Leitura de cockpit:** na F1 seria o pessoal de unidade de potência renomeando um canal na base de dados deles num sábado de manhã, e o software do muro de estratégia, que lia aquele canal direto dessa base, deixando de mostrar o consumo de energia antes da classificação. Ninguém da estratégia sabia da mudança, porque o "contrato" era a tabela interna de outro departamento. Esse é o acoplamento escondido.

### O conceito

**Analogia: o caderno de cada departamento.** Se todos os departamentos escrevem no mesmo caderno, uma mudança de formato num deles quebra todos. Com um caderno por departamento, cada um organiza o seu como quiser; quando precisam de um dado de outro, pedem (API) ou recebem um recado (evento).

**Leitura de cockpit:** cada disciplina é dona dos seus dados. O engenheiro de pneus guarda o histórico de desgaste do jeito que quiser; a estratégia, quando precisa, pede o número (API) ou recebe o aviso "pneu passou do limite" (evento). Ninguém abre a base do outro.

**Banco por serviço e polyglot persistence.** Cada serviço escolhe a tecnologia que melhor atende (PostgreSQL, MongoDB...). Isso traz autonomia e escalabilidade, mas exige que os serviços encontrem formas de se comunicar e manter a consistência.

**Os quatro desafios (do material), em ordem de dependência:**

1. **Isolamento de dados.** Um serviço não acessa o banco de outro. Os dados são trocados por APIs ou eventos (um serviço de pedidos emite "pedido criado" e o de inventário ajusta o estoque). Consequências: dados duplicados e necessidade de sincronização.
2. **Consistência.** No monolito, ACID (Atomicidade, Consistência, Isolamento, Durabilidade) resolve. Em microsserviços, consistência forte pode comprometer disponibilidade e escalabilidade, e por isso muitas arquiteturas adotam a **consistência eventual**: os dados podem ficar temporariamente inconsistentes e convergem depois.
3. **Transações distribuídas.** Uma operação que envolve vários serviços precisa de coordenação (saga, 2PC), descrita adiante.
4. **Evolução de esquema.** Cada serviço evolui seu esquema por conta própria, então a compatibilidade entre versões precisa ser gerenciada. Ferramentas de migração como **Flyway** e **Liquibase** versionam as mudanças e as aplicam de forma incremental e controlada.

**Consistência eventual na prática (exemplo do material).** Num e-commerce, o último item de estoque aparece como disponível para dois usuários. Só quem concluir primeiro leva o item, e o sistema avisa o segundo. Vantagens: disponibilidade e escala horizontal. Desafios: complexidade de implementação e transparência para o usuário.

**Leitura de cockpit:** a F1 vive em consistência eventual. A classificação logo após a bandeirada é provisória: penalidades decididas pelos comissários depois da corrida podem mudar posições, e o resultado converge para o oficial. Durante a prova também: enquanto um carro está no box, a tabela de posições e a ordem real na pista divergem por alguns segundos. Ninguém para a corrida esperando todos os dados ficarem perfeitos; o sistema aceita a divergência e converge depois. **Aqui a analogia para:** na pista, a convergência final é uma decisão humana. Num sistema distribuído, ela é feita por eventos, compensações e regras automáticas.

*Curva de alta! O CAP é onde mais gente sai da pista, porque decora "escolha duas de três". Leia duas vezes a parte do "durante uma partição": é ela que vale ponto.*

**Teorema CAP.** Descreve as limitações de sistemas distribuídos entre **Consistência** (todos veem o dado mais recente), **Disponibilidade** (toda requisição recebe resposta) e **tolerância a Partição** (o sistema funciona mesmo com partes desconectadas). A leitura prática: como partições de rede acontecem, **durante uma partição** você escolhe entre consistência e disponibilidade. Sem partição, é possível ter as duas. (Veja a nota do professor.)

**Leitura de cockpit:** partição é a perda do link de telemetria entre o carro e o muro. Enquanto o link está caído, o muro tem duas opções: esperar dado fresco antes de decidir (consistência) ou seguir decidindo com o último dado que tem, sabendo que ele pode estar velho (disponibilidade). Com o link funcionando, não há dilema: dado fresco e decisão na hora. **Aqui a analogia para:** no muro, quem escolhe é uma pessoa, caso a caso. No banco, a escolha é feita antes, por projeto ou configuração, e aplicada automaticamente.

**SQL ou NoSQL?** O professor apresenta um fluxograma de decisão (a figura não vem no texto). Em termos de critérios:

| | SQL (MySQL, PostgreSQL) | NoSQL (MongoDB, Cassandra, Redis) |
|---|---|---|
| Esquema | Rígido: tabelas, colunas, tipos | Flexível: muda sem migrações complexas |
| Transações | ACID | Muitos adotam consistência eventual |
| Consultas | Complexas, com joins e agregações | Modelo orientado ao acesso |
| Escala | Tende a escalar verticalmente primeiro | Projetado para escalar horizontalmente, adicionando nós |
| Quando usar | Consistência forte e integridade: bancos, pagamentos, e-commerce | Escala rápida e dados semiestruturados: redes sociais, big data, IoT |

**Leitura de cockpit:** SQL é a planilha de set-up (o ajuste do carro para o circuito) com colunas fixas: altura, asa, pressão, cada uma com tipo e unidade. Para registrar um parâmetro novo, alguém precisa criar a coluna antes, e isso é a migração. NoSQL é o registro de telemetria em que cada sessão pode trazer canais diferentes (um sensor de teste a mais num treino livre, por exemplo) sem que ninguém altere a estrutura; em troca, quem lê precisa saber lidar com o canal que falta ou que sobra.

**Na nuvem: relacional e NoSQL gerenciados.** O material cita DynamoDB e Cosmos DB como NoSQL altamente escaláveis e globais. A tabela completa abaixo é um acréscimo do professor, exceto o par DynamoDB e Cosmos DB, que o material cita.

| Necessidade | AWS (acréscimo do professor, salvo DynamoDB, citado no material) | Azure (acréscimo do professor, salvo Cosmos DB, citado no material) |
|---|---|---|
| Relacional gerenciado (PostgreSQL, MySQL) | Amazon RDS; Amazon Aurora (compatível com MySQL e PostgreSQL) | Azure Database for PostgreSQL, Azure Database for MySQL |
| Relacional com o motor SQL Server | RDS for SQL Server | Azure SQL Database |
| NoSQL chave-valor e documento | Amazon DynamoDB | Azure Cosmos DB (citado no material) |
| API compatível com MongoDB | Amazon DocumentDB (com compatibilidade com MongoDB) | Azure Cosmos DB for MongoDB |
| API compatível com Cassandra | Amazon Keyspaces | Azure Cosmos DB for Apache Cassandra |
| Cache Redis | Amazon ElastiCache | Azure Cache for Redis; a Microsoft anunciou o Azure Managed Redis como sucessor (confira na documentação o nome e o status atuais) |
| Armazenamento de objetos (vídeos, arquivos) | Amazon S3 | Azure Blob Storage |
| Fluxo de mudanças de dados (base para CQRS e eventos) | DynamoDB Streams | Cosmos DB change feed |
| Orquestrar uma saga como fluxo de trabalho | AWS Step Functions | Azure Durable Functions (ou Logic Apps) |

**Onde AWS e Azure realmente diferem (sem números):**

- **Modelo de cobrança do NoSQL.** O DynamoDB cobra por capacidade de leitura e escrita, com modo sob demanda ou capacidade provisionada. O Cosmos DB cobra em **Request Units por segundo (RU/s)**, uma unidade que abstrai o custo de cada operação, com modos provisionado, autoscale e serverless. Para comparar custo de verdade, é preciso medir o seu padrão de acesso nos dois.
- **Consistência.** No DynamoDB, a leitura é, por padrão, eventualmente consistente, com opção de leitura fortemente consistente por requisição. O Cosmos DB oferece **cinco níveis de consistência** configuráveis (forte, obsolescência limitada, sessão, prefixo consistente e eventual), com a sessão como ponto de partida comum. É a escolha CAP na prática, exposta como configuração.
- **Modelo de API.** O Cosmos DB é multi-API (NoSQL próprio, MongoDB, Cassandra, entre outros) sobre um mesmo serviço. Na AWS, essa variedade é espalhada em serviços distintos (DynamoDB, DocumentDB, Keyspaces).
- **Relacional.** O Aurora é uma implementação própria da AWS compatível com MySQL e PostgreSQL, sem par exato no Azure. O Azure SQL Database é o motor SQL Server como serviço; na AWS, o SQL Server roda no RDS.
- **Limites** (tamanho de item, tamanho de partição, taxa de requisições) são diferentes e mudam com o tempo. Consulte a documentação dos dois antes de modelar.

**Leitura de cockpit:** os dois circuitos oferecem os mesmos tipos de armazém, com regras de uso diferentes. As diferenças que pesam são o jeito de cobrar e o nível de consistência que você pode escolher; o nome do produto pesa pouco.

*Agora a sequência mais travada do setor: saga, 2PC, Event Sourcing e CQRS, um atrás do outro. Quem entende a compensação aqui chega inteiro ao laboratório.*

**Padrões de transação:**

**Saga.** Cada passo é uma transação **local** de um serviço; se um passo falha, executam-se **ações compensatórias** dos passos anteriores. Exemplo do material: reserva de viagem (voo, hotel, carro); se o carro falha, cancelam-se hotel e voo. Duas formas de coordenar: por **orquestração** (um coordenador central diz o que cada serviço faz) ou por **coreografia** (cada serviço reage a eventos). O laboratório abaixo usa orquestração. Vantagens: falhas isoladas, escala independente. Desafios: coordenação complexa e latência.

**Leitura de cockpit:** a saga do laboratório já é logística de F1. Exemplo **hipotético**: a equipe reserva voo, hotel e carro para Singapura, que acontece de 9 a 11 de outubro de 2026. Se o carro de aluguel falha, cancela-se o hotel e depois o voo, na ordem inversa, e as reservas canceladas ficam no histórico. A orquestração é o coordenador de logística da equipe mandando em cada passo. A coreografia é a mensagem "safety car" da direção de prova, como a da volta 9 em Sepang: ninguém dá ordem individual a cada departamento, e cada um reage ao evento por conta própria e no seu tempo (a estratégia recalcula a janela de parada, a garagem prepara os pneus, o engenheiro avisa o piloto), sem esperar os outros terminarem.

**Two-Phase Commit (2PC).** Fase de preparação (todos confirmam que podem concluir) e fase de commit (finaliza). Dá consistência forte, ao custo de latência e complexidade. Exemplo do material: transferência bancária. Na prática, entre microsserviços ele costuma ser evitado, porque segura recursos enquanto espera o último participante e exige que todos suportem o protocolo.

**Leitura de cockpit:** o 2PC é o mesmo semáforo de liberação da Etapa 01, agora visto como protocolo. Na preparação, cada operador de pistola sinaliza que a sua roda está presa; no commit, a luz fica verde e o carro sai. A consistência é forte (ninguém sai com roda solta), e o preço é o mesmo do 2PC: o carro fica parado esperando o posto mais lento, e um operador que trava segura o carro inteiro. Na parada isso é aceitável, porque tudo acontece em poucos segundos e no mesmo lugar. Entre serviços na rede, segurar recursos esperando o último participante custa caro, e por isso a saga é a preferida.

**Padrões de design:**

**Event Sourcing.** Em vez de guardar o estado atual, guarda-se a **sequência imutável de eventos** (pedido criado, atualizado, enviado) e o estado é reconstruído reexecutando-os. Benefícios: auditabilidade e possibilidade de reprocessar. Custos: complexidade e espaço de armazenamento.

**CQRS (Command Query Responsibility Segregation).** Modelos separados para **comandos** (escrita, normalizado, prioriza integridade) e **consultas** (leitura, desnormalizado, rápido). Benefícios: escala independente, desempenho e flexibilidade. Custo: manter os dois modelos sincronizados, com consistência eventual na leitura.

**Leitura de cockpit:** a cronometragem da F1 ilustra bem o Event Sourcing: os laços na pista registram cada passagem de cada carro, e a classificação, a qualquer momento, é derivada dessa sequência de eventos (passagens, paradas, penalidades). Dá para reprocessar a corrida inteira e auditar qualquer posição. O CQRS é a separação entre quem grava as passagens e a tela de tempos que a equipe e o público leem: a tela é um modelo de leitura pré-calculado, atualizado em ciclos, que pode estar um instante atrás da pista. **Aqui a analogia para:** uso a ideia geral (passagens registradas e classificação derivada delas), não a implementação interna do sistema oficial de cronometragem, que eu não conheço em detalhe.

**Exemplos de integração (do material):**

- E-commerce: catálogo em MongoDB (informações flexíveis), pagamentos em PostgreSQL (transações seguras), pedidos como eventos e CQRS no carrinho.
- Streaming: usuários em Cassandra (escala horizontal), recomendações em Elasticsearch (busca rápida), cada reprodução como evento.

**No mercado (segundo o material):** a persistência poliglota ganha espaço, junto de padrões como CQRS, Event Sourcing e Sagas; Kafka e RabbitMQ aparecem como mensageria assíncrona entre serviços; Amazon, Netflix, Spotify e Mercado Livre são citados como exemplos de times independentes por domínio. O material afirma que "mais de 75% das grandes empresas" já iniciaram ou planejam migrar, citando Gartner e InfoQ; a referência fornecida não permite verificar o número (veja as notas do professor).

### Exemplo comentado: banco por serviço e uma saga de reserva de viagem

Três serviços de reserva (voo, hotel e carro), cada um com **seu próprio banco** (SQLite num volume próprio), e um orquestrador de saga em shell. Usamos SQLite para não depender de drivers externos; o princípio vale igual para PostgreSQL ou MongoDB.

```sh
cd ..                                       # sai de etapa-02 e volta para lab-arquitetura
mkdir -p etapa-03/reserva && cd etapa-03
pwd                                         # deve terminar em /lab-arquitetura/etapa-03
```

`reserva/reserva.py`:

```python
import json
import os
import sqlite3
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

NOME = os.environ["NOME"]  # voo, hotel ou carro
LOCK = threading.Lock()  # SQLite numa conexão compartilhada: serializa os acessos
ESTADO = {"falhar": False}  # interruptor para simular um serviço com defeito
DB = sqlite3.connect("/data/reservas.db", check_same_thread=False)  # banco PRÓPRIO, em volume próprio
DB.execute("CREATE TABLE IF NOT EXISTS reservas (id TEXT PRIMARY KEY, status TEXT NOT NULL)")
DB.commit()


class Handler(BaseHTTPRequestHandler):
    def responder(self, status, corpo):
        dados = (json.dumps(corpo, ensure_ascii=False) + "\n").encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(dados)))
        self.end_headers()
        self.wfile.write(dados)

    def do_GET(self):
        if self.path == "/reservas":
            with LOCK:
                linhas = DB.execute("SELECT id, status FROM reservas ORDER BY id").fetchall()
            return self.responder(200, {"servico": NOME, "reservas": [{"id": i, "status": s} for i, s in linhas]})
        self.responder(404, {"erro": "rota inexistente"})

    def do_POST(self):
        partes = [p for p in self.path.split("/") if p]
        if partes == ["modo", "falha"]:
            ESTADO["falhar"] = True
            return self.responder(200, {"servico": NOME, "modo": "falha"})
        if partes == ["modo", "normal"]:
            ESTADO["falhar"] = False
            return self.responder(200, {"servico": NOME, "modo": "normal"})
        if len(partes) == 2 and partes[0] == "reservar":
            if ESTADO["falhar"]:
                return self.responder(500, {"servico": NOME, "erro": "indisponível"})  # falha de verdade: status 500
            with LOCK:  # transação LOCAL: só este serviço e este banco
                DB.execute("INSERT OR REPLACE INTO reservas VALUES (?, 'CONFIRMADA')", (partes[1],))
                DB.commit()
            return self.responder(201, {"servico": NOME, "id": partes[1], "status": "CONFIRMADA"})
        if len(partes) == 2 and partes[0] == "cancelar":
            with LOCK:  # compensação: nova ação de negócio, idempotente (repetir não piora)
                DB.execute("UPDATE reservas SET status = 'CANCELADA' WHERE id = ?", (partes[1],))
                DB.commit()
            return self.responder(200, {"servico": NOME, "id": partes[1], "status": "CANCELADA"})
        self.responder(404, {"erro": "rota inexistente"})


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
```

`reserva/Dockerfile`:

```dockerfile
# O módulo sqlite3 já vem no Python
FROM python:3.12-alpine
WORKDIR /srv
COPY reserva.py .
EXPOSE 8080
CMD ["python", "-u", "reserva.py"]
```

`compose.yaml`:

```yaml
services:
  voo:
    build: ./reserva
    init: true                        # stop rápido (veja a Etapa 01)
    environment: { NOME: voo }
    volumes: ["voo-data:/data"]       # volume exclusivo: só este container enxerga estes dados
    ports: ["8101:8080"]
  hotel:
    build: ./reserva
    init: true                        # stop rápido (veja a Etapa 01)
    environment: { NOME: hotel }
    volumes: ["hotel-data:/data"]
    ports: ["8102:8080"]
  carro:
    build: ./reserva
    init: true                        # stop rápido (veja a Etapa 01)
    environment: { NOME: carro }
    volumes: ["carro-data:/data"]
    ports: ["8103:8080"]

volumes:                              # três volumes, três bancos independentes
  voo-data: {}
  hotel-data: {}
  carro-data: {}
```

`saga.sh` (o orquestrador; dê permissão com `chmod +x saga.sh`):

```bash
#!/usr/bin/env bash
# Saga orquestrada: reserva voo, hotel e carro; se algum passo falhar, compensa os anteriores em ordem inversa.
ID="$1"
PASSOS=(voo:8101 hotel:8102 carro:8103)   # nome:porta, na ordem de execução
FEITOS=()                                  # passos já concluídos (candidatos à compensação)

for passo in "${PASSOS[@]}"; do
  nome="${passo%%:*}"; porta="${passo##*:}"
  codigo=$(curl -s -o /dev/null -w "%{http_code}" -X POST "localhost:$porta/reservar/$ID")
  if [ "$codigo" = "201" ]; then
    echo "OK     reservar $nome"
    FEITOS+=("$passo")
  else
    echo "FALHA  reservar $nome (HTTP $codigo), compensando..."
    for ((i=${#FEITOS[@]}-1; i>=0; i--)); do   # do último concluído para o primeiro
      f="${FEITOS[$i]}"
      curl -s -o /dev/null -X POST "localhost:${f##*:}/cancelar/$ID"
      echo "DESFEZ cancelar ${f%%:*}"
    done
    exit 1
  fi
done
echo "SAGA CONCLUIDA para $ID"
```

Suba: `docker compose up -d --build`.

### Mão na massa

*Pit stop cronometrado! Oito paradas neste box: a saga no caminho feliz, a falha no último passo com a compensação em ordem inversa, o que ficou nos bancos, a prova de isolamento, o esquema rígido recusando uma coluna e o Event Sourcing em miniatura. Os dois últimos itens estão marcados como opcional e como referência de nuvem: leia as marcações antes de executar.*

**1. Caminho feliz.**

```sh
./saga.sh viagem-1
```

Esperado:

```text
OK     reservar voo
OK     reservar hotel
OK     reservar carro
SAGA CONCLUIDA para viagem-1
```

**2. Falha no último passo e compensação.**

```sh
curl -s -X POST localhost:8103/modo/falha          # o serviço de carro passa a falhar
./saga.sh viagem-2
```

Esperado:

```text
OK     reservar voo
OK     reservar hotel
FALHA  reservar carro (HTTP 500), compensando...
DESFEZ cancelar hotel
DESFEZ cancelar voo
```

**Leitura de cockpit:** o `DESFEZ` em ordem inversa é a logística desmontando a viagem do último passo concluído para o primeiro.

**3. O que a compensação deixou nos bancos.**

```sh
curl -s localhost:8101/reservas
curl -s localhost:8102/reservas
curl -s localhost:8103/reservas
```

Esperado: voo e hotel mostram `viagem-1` como `CONFIRMADA` e `viagem-2` como `CANCELADA`; carro mostra só `viagem-1`. Repare: a reserva da `viagem-2` **não foi apagada**, e sim cancelada. Compensar não é voltar no tempo (rollback): é uma nova ação de negócio, que deixa histórico. Durante a saga também houve uma janela em que voo e hotel estavam confirmados e o carro não: é a consistência eventual em ação.

Antes de seguir, devolva o serviço de carro ao modo normal. Sem isso, qualquer nova execução da saga falha no último passo:

```sh
curl -s -X POST localhost:8103/modo/normal
```

Esperado: `{"servico": "carro", "modo": "normal"}`.

**Leitura de cockpit:** o cancelamento que fica no banco é como uma reserva cancelada que continua no sistema da agência de viagem, com o status trocado. Ninguém apaga o registro; acrescenta-se uma ação nova por cima. É isso que separa compensação de rollback.

**4. Prova de isolamento: cada serviço só enxerga o seu banco.**

```sh
docker compose exec hotel python -c "import sqlite3; print(sqlite3.connect('/data/reservas.db').execute('select * from reservas').fetchall())"
docker compose exec carro python -c "import sqlite3; print(sqlite3.connect('/data/reservas.db').execute('select * from reservas').fetchall())"
```

Esperado: o hotel lista `viagem-1` e `viagem-2` (cancelada); o carro lista só `viagem-1`. O mesmo caminho `/data/reservas.db` aponta para dados diferentes em cada container, porque cada volume é exclusivo. Não existe caminho para um serviço ler o banco do outro: só pela API.

**Leitura de cockpit:** o mesmo caminho em dois containers é como o mesmo nome de arquivo no computador de dois departamentos: o `historico` do pneu e o `historico` da unidade de potência não têm nada a ver um com o outro, e ninguém de fora abre nenhum dos dois.

**5. Esquema rígido x flexível (SQL x NoSQL), com bancos de verdade.**

```sh
docker rm -f pg 2>/dev/null   # permite repetir o passo do zero
docker run -d --name pg -e POSTGRES_PASSWORD=lab postgres:16-alpine
until docker exec pg pg_isready -h 127.0.0.1 -U postgres >/dev/null 2>&1; do sleep 1; done   # espera o servidor aceitar conexões por TCP
docker exec pg psql -U postgres -c "CREATE TABLE produtos (id int PRIMARY KEY, nome text);"
docker exec pg psql -U postgres -c "INSERT INTO produtos (id, nome, tags) VALUES (1, 'Pneu', 'borracha');"
```

O laço `until` substitui um `sleep` fixo: na primeira subida, a imagem do Postgres cria o banco num servidor temporário, que só escuta no socket local, e depois reinicia. Testar por TCP (`-h 127.0.0.1`) só passa quando o servidor definitivo está no ar.

Esperado: a primeira instrução imprime `CREATE TABLE`, e a segunda falha com uma mensagem que começa em `ERROR:  column "tags" of relation "produtos" does not exist`. No esquema rígido, mudar o formato do dado exige uma **migração** (é aqui que Flyway e Liquibase entram):

```sh
docker exec pg psql -U postgres -c "ALTER TABLE produtos ADD COLUMN tags text;"
docker exec pg psql -U postgres -c "INSERT INTO produtos (id, nome, tags) VALUES (1, 'Pneu', 'borracha');"
```

Esperado: `INSERT 0 1`.

**Leitura de cockpit:** o `ERROR` é a planilha de set-up recusando um parâmetro que não tem coluna. O `ALTER TABLE` é a revisão da planilha, registrada, antes de o dado novo entrar.

**6. Event Sourcing e CQRS em miniatura (no mesmo Postgres).**

```sh
docker exec -i pg psql -U postgres <<'SQL'
-- Permite repetir o exercício: apaga a tabela e o modelo de leitura de uma execução anterior
DROP TABLE IF EXISTS eventos CASCADE;
-- Event sourcing: só se acrescenta eventos, nunca se atualiza o saldo
CREATE TABLE eventos (id serial PRIMARY KEY, conta text, tipo text, valor numeric);
INSERT INTO eventos (conta, tipo, valor) VALUES ('c1', 'deposito', 100), ('c1', 'retirada', 30), ('c1', 'deposito', 50);
-- O estado atual é reconstruído a partir dos eventos
SELECT conta, SUM(CASE WHEN tipo = 'deposito' THEN valor ELSE -valor END) AS saldo FROM eventos GROUP BY conta;
-- CQRS: um modelo de LEITURA separado, pré-calculado
CREATE MATERIALIZED VIEW saldos AS
  SELECT conta, SUM(CASE WHEN tipo = 'deposito' THEN valor ELSE -valor END) AS saldo FROM eventos GROUP BY conta;
-- Um novo evento entra no lado da escrita...
INSERT INTO eventos (conta, tipo, valor) VALUES ('c1', 'deposito', 10);
-- ...mas o modelo de leitura ainda mostra o valor antigo (consistência eventual)
SELECT * FROM saldos;
REFRESH MATERIALIZED VIEW saldos;
SELECT * FROM saldos;
SQL
```

Esperado: na primeira execução, o `DROP TABLE IF EXISTS` avisa `NOTICE:  table "eventos" does not exist, skipping`, o que é normal (nas seguintes, avisa que também apagou o `saldos`). O primeiro `SELECT` mostra saldo `120`; o `SELECT * FROM saldos` antes do refresh ainda mostra `120`; depois do `REFRESH`, mostra `130`. A leitura ficou temporariamente defasada, e a "sincronização" é o refresh. Num sistema real, esse papel é feito por eventos publicados e consumidos pelo serviço de leitura.

**Leitura de cockpit:** os eventos são as passagens pela cronometragem; o `SELECT` com soma é a classificação reconstruída; a view materializada é a tela de tempos. Antes do `REFRESH`, a tela mostra `120` com a pista já em `130`.

**7. Opcional: NoSQL local com DynamoDB Local (precisa da CLI `aws`).**

```sh
docker run -d --name ddb -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -inMemory
export AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local AWS_DEFAULT_REGION=us-east-1   # credenciais falsas, só para o emulador
EP=http://localhost:8000
aws dynamodb create-table --endpoint-url "$EP" --table-name produtos \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
aws dynamodb put-item --endpoint-url "$EP" --table-name produtos --item '{"id":{"S":"1"},"nome":{"S":"Pneu"}}'
aws dynamodb put-item --endpoint-url "$EP" --table-name produtos --item '{"id":{"S":"2"},"nome":{"S":"Capacete"},"tags":{"L":[{"S":"seguranca"}]}}'
aws dynamodb scan --endpoint-url "$EP" --table-name produtos
```

As aspas em `"$EP"` fazem o comando funcionar igual no bash e no zsh (o shell padrão do macOS). Se a porta 8000 estiver ocupada (`lsof -i :8000` no macOS), suba com `-p 8001:8000` e use `EP=http://localhost:8001`.

Esperado: o `create-table` devolve a descrição da tabela, os `put-item` não imprimem nada, e o `scan` lista os dois itens com `"Count": 2`. Os dois itens são gravados sem nenhuma migração, mesmo com atributos diferentes (o segundo tem `tags`). Só a chave (`id`) é obrigatória. É a flexibilidade de esquema do NoSQL. O custo: a validação do formato passa a ser responsabilidade da aplicação. (O Azure Cosmos DB também tem emulador local, mas a configuração é mais trabalhosa; consulte a documentação da Microsoft se quiser repetir o exercício lá.)

**Leitura de cockpit:** `Pneu` sem tags e `Capacete` com tags convivem na mesma tabela como sessões com canais diferentes no mesmo registro de telemetria. A tabela não reclama; quem lê é que precisa saber que o canal pode faltar.

**8. Referência de nuvem (não execute para completar o guia; cria recursos e gera cobrança).**

NoSQL equivalente, criação de uma tabela ou contêiner:

```sh
# AWS: tabela DynamoDB com cobrança sob demanda
aws dynamodb create-table --table-name produtos \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Azure: conta Cosmos DB, banco e contêiner com chave de partição /id
az group create --name rg-lab --location brazilsouth
az cosmosdb create --name <conta-unica> --resource-group rg-lab
az cosmosdb sql database create --account-name <conta-unica> --resource-group rg-lab --name loja
az cosmosdb sql container create --account-name <conta-unica> --resource-group rg-lab \
  --database-name loja --name produtos --partition-key-path "/id"
```

Relacional gerenciado e réplica de leitura:

```sh
# AWS: instância PostgreSQL no RDS e réplica de leitura
aws rds create-db-instance --db-instance-identifier pedidos-db --db-instance-class db.t3.micro \
  --engine postgres --allocated-storage 20 --master-username labadmin --master-user-password '<senha>'
aws rds create-db-instance-read-replica --db-instance-identifier pedidos-db-leitura \
  --source-db-instance-identifier pedidos-db

# Azure: servidor PostgreSQL flexível e réplica de leitura
az postgres flexible-server create --resource-group rg-lab --name <servidor-unico> \
  --location brazilsouth --admin-user labadmin --admin-password '<senha>'
az postgres flexible-server replica create --replica-name <replica-unica> \
  --resource-group rg-lab --source-server <servidor-unico>
```

O usuário administrador se chama `labadmin` nos dois provedores porque o Azure Database for PostgreSQL recusa nomes reservados como `admin`, `administrator`, `root`, `guest` e `azure_superuser`.

Limpeza dos recursos de nuvem: `aws dynamodb delete-table --table-name produtos` e `aws rds delete-db-instance --db-instance-identifier <id> --skip-final-snapshot` na AWS (apague a réplica antes), e `az group delete --name rg-lab --yes` no Azure, que remove tudo de uma vez. Os nomes de classe de instância e as opções de SKU mudam; confira o catálogo atual do provedor.

**Limpeza local:**

```sh
docker compose down -v
docker rm -f pg ddb 2>/dev/null
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_DEFAULT_REGION EP   # as credenciais falsas não ficam valendo na sessão
```

### Exercícios

*Volta lançada! Cinco perguntas, do banco certo para cada serviço ao orquestrador que cai no meio da saga. É a bateria mais longa do GP; ritmo constante.*

1. **Escolha o banco.** Para cada serviço do e-commerce, indique SQL ou NoSQL e a justificativa: (a) pagamentos, (b) catálogo com atributos muito variáveis por produto, (c) sessões e carrinho temporários. *Resposta esperada:* (a) SQL (ACID, integridade, consistência forte); (b) NoSQL de documentos, pela flexibilidade de esquema; (c) NoSQL chave-valor em memória (Redis), pela leitura e escrita rápidas. Na nuvem, (b) poderia ser DynamoDB ou Cosmos DB, e (c) ElastiCache ou Azure Cache for Redis (ou o sucessor anunciado, Azure Managed Redis).
2. **Idempotência.** No laboratório, rode `curl -s -X POST localhost:8101/cancelar/viagem-2` duas vezes. Qual é o resultado e por que isso é importante numa saga? *Resposta esperada:* o status continua `CANCELADA` e não há erro. A compensação precisa ser idempotente porque o orquestrador pode repeti-la depois de uma falha de rede ou queda no meio do caminho.
3. **E se o orquestrador cair no meio?** Que limitação do `saga.sh` isso expõe e como produtos gerenciados atacam isso? *Resposta esperada:* o `saga.sh` guarda o progresso só em memória; se morrer entre o hotel e o carro, ninguém sabe que é preciso compensar. Serviços de orquestração gerenciados (AWS Step Functions, Azure Durable Functions) persistem o estado do fluxo e retomam de onde parou.
4. **CAP.** Um banco NoSQL escolhe disponibilidade durante uma partição de rede. O que o usuário pode ver e como a Etapa 03 manda lidar? *Resposta esperada:* dados temporariamente desatualizados ou divergentes entre nós; o sistema deve convergir depois (consistência eventual) e comunicar claramente o estado ao usuário, usando compensação quando necessário.
5. **Comparar Cosmos DB e DynamoDB.** Diga uma diferença de cobrança e uma de consistência. *Resposta esperada:* o Cosmos DB cobra em Request Units por segundo, o DynamoDB em capacidade de leitura e escrita; o DynamoDB lê com consistência eventual por padrão, com opção de leitura forte por requisição, enquanto o Cosmos DB expõe cinco níveis configuráveis.

### Anota aí

> Cada serviço é dono dos seus dados e só se fala por API ou evento; sem transação global, a consistência vira projeto: saga para coordenar, compensação para desfazer, consistência eventual como regra.

*Setor 3 no verde, e era o trecho mais técnico do circuito! Banco por serviço, saga com compensação que deixa histórico e uma tela de tempos que fica um instante atrás da pista até o refresh. Resultado provisório é parte do jogo: em Suzuka, em 1989, o Ayrton Senna cruzou a linha em primeiro e foi desclassificado pelos comissários depois da corrida, e a vitória ficou com o Alessandro Nannini. Agora a reta final: como os postos conversam, na Etapa 04.*

---

## Etapa 04: Comunicação entre microsserviços

*Quarto setor, a reta final! Os postos já existem e cada um guarda os seus dados; falta decidir como eles se falam. Pergunta pelo rádio ou pneu na pilha? Quem escolhe errado deixa o carro parado no box por causa de uma tarefa secundária.*

### O problema

O serviço de pedidos, ao receber uma compra, chama o serviço de notificações por HTTP e espera a resposta antes de confirmar ao cliente. Na noite de promoção, o serviço de notificações fica lento por causa de um provedor de e-mail. Cada pedido passa a demorar o tempo do e-mail; as conexões se acumulam em pedidos; e logo o site inteiro está fora do ar por causa de um serviço secundário. Pior: se o serviço de notificações cai, **ninguém consegue comprar**, embora notificar não seja a parte crítica da compra.

**Leitura de cockpit:** é o carro preso no box esperando uma tarefa secundária. Imagine um procedimento **hipotético** em que a crew só libera o carro depois que o engenheiro de pneus mede o jogo que acabou de ser retirado. Num dia normal, isso já atrasa cada parada; se o equipamento de medição quebra, nenhum carro sai do box, embora medir pneu usado não tenha nada a ver com o carro voltar à pista. Por isso as equipes fazem o contrário: o carro sai, e os pneus retirados são analisados depois.

Como serviços independentes devem conversar? A resposta depende de quanto você precisa da resposta, e é isso que a aula ensina.

### O conceito

**Analogia: telefonema x carta.** Ligar para alguém (síncrono) dá a resposta na hora, mas exige que a pessoa esteja disponível agora, e você fica pendurado até ela atender. Mandar uma carta (assíncrono) permite seguir com a sua vida, mas a resposta chega depois, e a carta pode se perder ou ser entregue duas vezes.

**Leitura de cockpit:** síncrono é a pergunta pelo rádio que precisa de resposta antes de o piloto agir ("box nesta volta?"). Assíncrono é o jogo de pneus usado que vai para a pilha do engenheiro de pneus e é medido quando ele puder.

**Comunicação síncrona.** O cliente envia a requisição e **espera** a resposta antes de continuar. Os dois formatos do material:

- **REST** (Representational State Transfer): estilo de arquitetura sobre HTTP. Propriedades: recursos representados em formato textual (JSON ou XML); cliente-servidor; **sem estado** (cada requisição leva tudo o que o servidor precisa, o que melhora a escala e a tolerância a falhas); operações HTTP (GET, POST, PUT, DELETE); URI única por recurso; cache; interface uniforme; camadas. As respostas carregam **status codes** e podem alimentar métricas de erro e monitoramento.
- **gRPC**: criado pelo Google; usa serialização **Protocol Buffers** (protobuf) para enviar mensagens em binário, reduzindo latência e melhorando o desempenho, com contrato bem definido.

Vantagens: simplicidade e resposta imediata para decidir. Desvantagens: **acoplamento temporal** (se o servidor está fora ou lento, o cliente sofre) e dificuldade de escala sob muitas conexões simultâneas.

**Leitura de cockpit:** REST é o rádio com vocabulário padronizado: cada mensagem é completa, legível e independente (sem estado: o engenheiro não precisa lembrar a conversa anterior para entender a frase atual). gRPC é a telemetria: binária, compacta, com canais definidos por esquema, feita para volume e velocidade. **Aqui a analogia para:** a telemetria é um fluxo contínuo do carro para o muro, e o uso mais comum do gRPC é pergunta e resposta (ele também suporta streaming). O paralelo é com o formato, binário e com esquema, não com a direção do fluxo.

**Comunicação assíncrona.** O solicitante envia uma **mensagem** e segue; o receptor processa no seu tempo. Ferramentas citadas: RabbitMQ, Kafka e AWS SQS. Vantagens: desacoplamento temporal, e filas que absorvem picos. Desvantagens: complexidade (um sistema de mensageria é um novo ponto de falha) e **falhas de entrega**: mensagens podem ser perdidas ou duplicadas, o que exige retry e confirmação de entrega (e consumidores que tolerem repetição).

**Leitura de cockpit:** a pilha de pneus absorve o pico: num safety car, os dois carros param e os jogos se acumulam para serem medidos depois. O custo é um novo ponto de falha (a pilha e quem cuida dela) e o risco de um jogo se perder ou ser lançado duas vezes no registro. Por isso cada jogo é identificado, e lançar o mesmo jogo de novo não pode duplicar o dado.

**API Gateway.** Com muitos serviços, o gateway é o ponto central: roteia requisições, agrega respostas, centraliza segurança (autenticação, autorização, controle de acesso). Desvantagens: pode virar **ponto único de falha** ou gargalo (exige alta disponibilidade) e adiciona latência. Os gateways modernos (Kong, Apigee, Amazon API Gateway, Traefik, segundo o material) oferecem rate limiting, monitoramento, transformação de payload e integração com OpenID Connect e OAuth2.

**Leitura de cockpit:** é o engenheiro de corrida de novo: ponto único entre o piloto e a equipe, que encaminha, filtra e controla quem pode pedir o quê. E ele tem o mesmo risco: se o rádio falha, o piloto fica sem nenhum posto, por melhor que a equipe esteja. Por isso existem canais de reserva (a placa mostrada no muro, mensagens no painel do volante) e, no software, alta disponibilidade do gateway.

**Híbrido: o que se faz de verdade.** O material descreve a prática: chamadas síncronas para ações críticas e imediatas, e eventos assíncronos para propagar mudanças e desacoplar domínios. Responde-se rápido ao usuário e mantém-se a consistência por eventos.

**Leitura de cockpit:** o híbrido é como uma parada funciona de verdade: o que decide se o carro sai (rodas presas) é síncrono e acontece na hora; o que pode esperar (medir os pneus, atualizar o modelo de desgaste, avisar a fábrica) vira evento.

**Observabilidade e tracing distribuído.** Uma ação do usuário atravessa vários serviços; sem um identificador comum, correlacionar logs vira detetive sem pistas. Ferramentas citadas: OpenTelemetry, Jaeger e Honeycomb.

**Leitura de cockpit:** cada pneu tem um código de barras, e a FIA acompanha cada jogo do fim de semana. Seguir o mesmo código por todos os registros é o tracing distribuído: dá para saber por onde aquele jogo passou sem adivinhar.

**Na nuvem: filas, eventos, gateway e observabilidade (acréscimo do professor, salvo SQS e Amazon API Gateway, citados no material).**

*Filas (uma mensagem, um consumidor):*

| Necessidade | AWS (acréscimo do professor, salvo SQS, citado no material) | Azure (acréscimo do professor) |
|---|---|---|
| Fila simples e barata | Amazon SQS (standard) | Azure Queue Storage |
| Fila com ordem, sessões, deduplicação, transações | SQS FIFO | Azure Service Bus (filas) |

*Publicação e assinatura (uma mensagem, vários consumidores):*

| Necessidade | AWS (acréscimo do professor) | Azure (acréscimo do professor) |
|---|---|---|
| Fan-out de notificações | Amazon SNS | Service Bus topics e subscriptions |
| Roteamento de eventos por regras entre serviços e origens | Amazon EventBridge | Azure Event Grid |
| Fluxo contínuo de eventos em alto volume (papel do Kafka) | Kinesis Data Streams; Amazon MSK (Kafka gerenciado) | Azure Event Hubs (oferece um endpoint compatível com o protocolo Kafka) |

*Gateway e observabilidade:*

| Necessidade | AWS (acréscimo do professor, salvo Amazon API Gateway, citado no material) | Azure (acréscimo do professor) |
|---|---|---|
| API Gateway (roteamento, autenticação, limite de taxa) | Amazon API Gateway | Azure API Management |
| Métricas, logs e alarmes | Amazon CloudWatch | Azure Monitor (com Log Analytics) |
| Tracing distribuído e APM | AWS X-Ray; também suporte a OpenTelemetry | Application Insights (dentro do Azure Monitor); também suporte a OpenTelemetry |
| Prometheus e Grafana gerenciados | Amazon Managed Service for Prometheus e Amazon Managed Grafana | Azure Monitor managed service for Prometheus e Azure Managed Grafana |

**Leitura de cockpit:** fila é a pilha de pneus para o engenheiro de pneus: cada jogo é medido por um técnico só. Publicação e assinatura são as mensagens da direção de prova: uma mensagem ("safety car") chega a todas as equipes ao mesmo tempo. O fluxo de eventos (Kafka, Kinesis, Event Hubs) é o registro completo da cronometragem, que fica guardado e pode ser relido do começo. Os dois circuitos têm as três instalações, com nomes e regras diferentes, e a telemetria (métricas, logs e tracing) também existe nos dois.

*Atenção, que a pista estreita: semântica de entrega, DLQ e ciclo de vida da mensagem mudam de um circuito para o outro. É este trecho que separa quem conhece o nome do serviço de quem sabe operá-lo.*

**Onde eles diferem de verdade:**

- **Semântica de entrega.** O SQS standard entrega **pelo menos uma vez** e sem garantia de ordem; o SQS FIFO oferece ordem dentro de um grupo de mensagens e deduplicação. O Azure Queue Storage também é pelo menos uma vez e **não garante FIFO**. O Service Bus oferece ordem com **sessões**, detecção de duplicatas e dois modos de recebimento: *peek-lock* (a mensagem fica travada até você confirmar, pelo menos uma vez) e *receive-and-delete* (no máximo uma vez). Event Grid e SNS também trabalham com entrega pelo menos uma vez. Conclusão prática: nos dois provedores, **seu consumidor precisa ser idempotente**.
- **Mensagens problemáticas (DLQ).** O SQS tem fila de mensagens mortas (dead-letter queue) por política de redrive; o Service Bus tem dead-letter queue embutida por fila, com número máximo de entregas configurável; o Azure Queue Storage **não tem DLQ nativa**: a aplicação precisa olhar o contador de tentativas (dequeue count) e mover a mensagem sozinha. A exceção é quem consome a fila pelo gatilho de fila do Azure Functions: depois do número máximo de tentativas, a plataforma move a mensagem sozinha para uma fila com o sufixo `-poison` (por exemplo, `pedidos-poison`).
- **Ciclo de vida da mensagem.** SQS: *visibility timeout* depois do recebimento e `delete-message` ao concluir. Queue Storage: *visibility timeout* no `get`, com `delete` usando um recibo (pop receipt). Service Bus: *lock* da mensagem em peek-lock e `complete` ao concluir. A ideia é a mesma: a mensagem não some até o consumidor confirmar, e reaparece se ele falhar.
- **Cobrança (sem números).** O SQS cobra por requisição. O Queue Storage cobra por transação e por armazenamento, como parte de uma conta de armazenamento. O Service Bus cobra por camada: no nível Standard há um valor base mais operações, e no Premium há capacidade dedicada. Topics no Service Bus exigem Standard ou Premium; o Basic só tem filas. Consulte a página de preços.
- **Evento x mensagem.** O Event Grid é pensado para **notificar que algo aconteceu** (um evento leve, roteado por assinaturas); o Service Bus é pensado para **comandos e dados de negócio** que não podem se perder. O EventBridge e o SNS ficam em posições parecidas na AWS (eventos por regras, e fan-out), enquanto o SQS guarda o trabalho a ser feito.
- **Kafka não é só uma fila.** Kafka (citado no material) é um **log distribuído** de eventos com consumer groups: mensagens ficam retidas e podem ser relidas. O Event Hubs e o Kinesis ocupam esse mesmo espaço de fluxo de eventos, não o de filas tradicionais.
- **Gateway.** O Amazon API Gateway e o Azure API Management oferecem roteamento, autenticação, limite de taxa e importação de definições OpenAPI. O APIM tem portal de desenvolvedor e um modelo de políticas configuráveis em XML, e é ofertado em camadas; o API Gateway tem tipos diferentes de API (REST, HTTP, WebSocket) com características e preços diferentes. Compare com o seu caso de uso, não pelo nome.

**Leitura de cockpit:** o *visibility timeout*, o *peek-lock* e o recibo são o técnico que pega o jogo da pilha e marca "em análise": se ele não concluir, o jogo volta para a pilha e outro técnico pega. A DLQ é a caixa à parte para o jogo que não se consegue medir de jeito nenhum, para ninguém ficar tentando para sempre. No Queue Storage, quem monta essa caixa é você.

### Exemplo comentado: pedidos e notificações, síncrono e assíncrono

O laboratório tem quatro peças: um **gateway** (Nginx, com rate limit e geração de um identificador de requisição), o serviço de **pedidos**, o **notificador** (lento de propósito: 2 s por notificação, acessível por HTTP **e** por fila) e o **Redis**, que serve como fila.

**Leitura de cockpit:** no nosso mapa, `pedidos` é a parada no box, `notificador` é o engenheiro de pneus medindo o jogo retirado (2 s por jogo, de propósito), o Redis é a pilha de pneus, e o gateway é o engenheiro de corrida, que ainda carimba cada pedido com um identificador, como o código de barras do pneu.

```sh
cd ..                                                        # sai de etapa-03 e volta para lab-arquitetura
mkdir -p etapa-04/servicos etapa-04/gateway && cd etapa-04
pwd                                                          # deve terminar em /lab-arquitetura/etapa-04
```

`servicos/pedidos.py`:

```python
import json
import os
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import redis

MODO = os.getenv("MODO", "sync")  # "sync" chama o notificador por HTTP; "async" usa a fila
r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)


class Handler(BaseHTTPRequestHandler):
    def responder(self, status, corpo):
        dados = (json.dumps(corpo, ensure_ascii=False) + "\n").encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(dados)))
        self.end_headers()
        self.wfile.write(dados)

    def do_POST(self):
        partes = [p for p in self.path.split("/") if p]
        if len(partes) != 2 or partes[0] != "pedidos":
            return self.responder(404, {"erro": "rota inexistente"})
        pedido = partes[1]
        req = self.headers.get("X-Request-Id", "sem-id")  # identificador criado pelo gateway
        inicio = time.time()

        if MODO == "sync":
            try:
                chamada = urllib.request.Request(
                    f"http://notificador:8080/notificar/{pedido}",
                    method="POST",
                    headers={"X-Request-Id": req},  # propaga o identificador
                )
                urllib.request.urlopen(chamada, timeout=5).read()  # ESPERA a resposta (acoplamento temporal)
            except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
                print(f"req={req} pedido={pedido} FALHA ao notificar: {e}", flush=True)
                return self.responder(502, {"erro": "notificador indisponível", "pedido": pedido})
            print(f"req={req} pedido={pedido} concluido em {time.time() - inicio:.2f}s (sync)", flush=True)
            return self.responder(201, {"pedido": pedido, "status": "criado e notificado"})

        # modo async: coloca na fila e responde logo; o id viaja DENTRO da mensagem
        r.lpush("fila:notificacoes", json.dumps({"pedido": pedido, "req": req}))
        print(f"req={req} pedido={pedido} enfileirado em {time.time() - inicio:.3f}s (async)", flush=True)
        self.responder(202, {"pedido": pedido, "status": "aceito, notificação em andamento"})


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
```

`servicos/notificador.py`:

```python
import json
import os
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import redis

TRABALHO = float(os.getenv("TRABALHO_S", "2"))  # tempo de cada notificação (provedor de e-mail lento)
r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)


def notificar(pedido, req, origem):
    time.sleep(TRABALHO)  # simula o envio
    print(f"req={req} pedido={pedido} NOTIFICADO via {origem}", flush=True)


def consumidor():
    # Entrada 2 do serviço (consumidor da fila): lê a fila em segundo plano, uma mensagem por vez
    while True:
        try:
            item = r.brpop("fila:notificacoes", timeout=5)  # bloqueia até 5s esperando mensagem
            if item is None:
                continue
            msg = json.loads(item[1])
            notificar(msg["pedido"], msg["req"], "fila")
        except redis.ConnectionError:
            time.sleep(1)  # Redis ainda não subiu: tenta de novo


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Entrada 1 do serviço (HTTP síncrono): a mesma porta 8080 de sempre
        partes = [p for p in self.path.split("/") if p]
        if len(partes) == 2 and partes[0] == "notificar":
            notificar(partes[1], self.headers.get("X-Request-Id", "sem-id"), "http")
            dados = b'{"status": "notificado"}\n'
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(dados)))
            self.end_headers()
            self.wfile.write(dados)
        else:
            self.send_response(404)
            self.send_header("Content-Length", "0")
            self.end_headers()


if __name__ == "__main__":
    threading.Thread(target=consumidor, daemon=True).start()
    ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
```

`servicos/Dockerfile`:

```dockerfile
FROM python:3.12-alpine
WORKDIR /srv
# Cliente Redis (a única dependência externa)
RUN pip install --no-cache-dir redis
# Copia os dois serviços; o compose escolhe qual rodar
COPY pedidos.py notificador.py ./
CMD ["python", "-u", "pedidos.py"]
```

`gateway/nginx.conf`:

```nginx
# Zona de limite: 5 requisições por segundo por IP de origem (estado em 10 MB de memória)
limit_req_zone $binary_remote_addr zone=por_ip:10m rate=5r/s;

server {
    listen 80;
    resolver 127.0.0.11 valid=5s;
    limit_req_status 429;                       # excesso devolve 429 (padrão seria 503)

    location /pedidos/ {
        limit_req zone=por_ip burst=10 nodelay; # tolera uma rajada de 10 acima da taxa
        set $alvo http://pedidos:8080;
        proxy_set_header X-Request-Id $request_id;  # id único por requisição, criado AQUI na borda
        proxy_pass $alvo;
    }
}
```

`compose.yaml`:

```yaml
services:
  redis:
    image: redis:7-alpine                  # fila e mensageria do laboratório

  pedidos:
    build: ./servicos
    init: true                             # stop rápido (veja a Etapa 01)
    command: ["python", "-u", "pedidos.py"]
    environment:
      MODO: ${MODO:-sync}                  # sync por padrão; troque com MODO=async
      REDIS_HOST: redis
    depends_on: [redis]

  notificador:
    build: ./servicos
    init: true                             # stop rápido (veja a Etapa 01)
    command: ["python", "-u", "notificador.py"]
    environment:
      REDIS_HOST: redis
    depends_on: [redis]

  gateway:
    image: nginx:1.27-alpine
    ports: ["8080:80"]                     # único ponto de entrada
    volumes:
      - ./gateway/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on: [pedidos]
```

Suba: `docker compose up -d --build`.

### Mão na massa

*Volta rápida valendo tudo! Seis testes no laboratório principal: o cliente pagando a parte lenta, a falha se propagando, a fila segurando cinco jogos, o consumidor esvaziando a pilha, o mesmo `req=` atravessando os logs e o `429` na borda. Depois, os blocos opcional e de referência.*

**1. Síncrono: o cliente espera a notificação.**

```sh
curl -s -X POST -o /dev/null -w "%{http_code} em %{time_total}s\n" localhost:8080/pedidos/p1
```

Esperado: `201 em 2.0xxxxxs`. O cliente pagou o tempo da parte lenta.

**Leitura de cockpit:** o carro ficou 2 s a mais parado no box esperando a medição.

**2. Síncrono, com o notificador fora do ar: a falha se propaga.**

```sh
docker compose stop notificador
curl -s -X POST -o /dev/null -w "%{http_code} em %{time_total}s\n" localhost:8080/pedidos/p2
```

Esperado: `502 em 5.0xxxxxs`. Com o notificador parado, o nome `notificador` some do DNS da rede, e o `pedidos` só desiste depois de cerca de 5 s (o log dele mostra `FALHA ao notificar`). Ninguém conseguiu comprar por causa de um serviço secundário. É o acoplamento temporal.

**Leitura de cockpit:** equipamento de medição quebrado, nenhum carro sai do box.

**3. Assíncrono: o pedido é aceito mesmo com o notificador fora.** Recrie só o `pedidos` no modo assíncrono. O notificador continua parado desde o item 2:

```sh
MODO=async docker compose up -d pedidos   # recria só o pedidos; o notificador não volta
sleep 6                                   # o gateway guarda o IP antigo do pedidos por até 5 s (resolver valid=5s)
for i in 1 2 3 4 5; do
  curl -s -X POST -o /dev/null -w "%{http_code} em %{time_total}s\n" localhost:8080/pedidos/a$i
done
docker compose exec redis redis-cli LLEN fila:notificacoes
```

Esperado: cinco linhas `202 em 0.0xxxxxs`, e `5` no tamanho da fila. As mensagens estão guardadas, esperando o consumidor voltar.

Atenção: daqui até o fim da etapa, todo `docker compose up` precisa do prefixo `MODO=async`. Sem ele, o compose usa o padrão `sync` e recria o `pedidos` no modo síncrono, sem avisar.

**Leitura de cockpit:** o carro sai na hora (`202`: aceito, o resto fica para depois), e os cinco jogos esperam na pilha.

**4. Recuperação: o consumidor volta e esvazia a fila.**

```sh
docker compose start notificador
sleep 12
docker compose logs notificador | grep "via fila"
docker compose exec redis redis-cli LLEN fila:notificacoes
```

Esperado: cinco linhas `NOTIFICADO via fila`, uma a cada cerca de 2 s (um consumidor processa uma por vez), e o tamanho da fila chega a `0`. O filtro `"via fila"` deixa de fora a linha `NOTIFICADO via http` do pedido `p1`, do item 1, que continua no log. Para esvaziar mais rápido, escale o consumidor: `MODO=async docker compose up -d --scale notificador=3` (cada réplica retira mensagens diferentes; sem o `MODO=async`, o `pedidos` voltaria ao modo síncrono e o item 6 não mostraria nenhum `429`).

**Leitura de cockpit:** o engenheiro de pneus volta e mede um jogo por vez. Com `--scale notificador=3`, são três técnicos tirando jogos diferentes da mesma pilha. **Aqui a analogia para:** a lista do Redis deste laboratório não tem marcação "em análise". Se o técnico pega um jogo e some antes de medir, o jogo se perde (veja as notas do professor).

**5. Um identificador, vários logs (tracing mínimo).**

```sh
ID=$(docker compose logs --no-log-prefix pedidos | grep -o 'req=[0-9a-f]\{32\}' | tail -1)   # id do último pedido
echo "$ID"
docker compose logs pedidos notificador | grep "$ID"
```

Esperado: o `echo` mostra `req=` seguido de 32 caracteres hexadecimais, criados pelo Nginx. O `grep` devolve duas linhas com esse **mesmo** valor: uma do `pedidos` ("enfileirado") e uma do `notificador` ("NOTIFICADO via fila"). Filtrar por um id, em vez de olhar as últimas linhas, é necessário porque o `docker compose logs` não intercala os serviços em ordem cronológica. Esse valor atravessou o gateway, o serviço de pedidos, a fila e o consumidor. É o princípio do tracing distribuído, que o OpenTelemetry formaliza.

**Leitura de cockpit:** o `req=` é o código de barras: o mesmo valor aparece na parada (`pedidos`) e na medição (`notificador`).

**6. Rate limit no gateway.** Ainda em modo assíncrono, dispare 30 requisições seguidas:

```sh
for i in $(seq 1 30); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:8080/pedidos/r$i
done | sort | uniq -c
```

Esperado: algo como `202` para cerca de 11 a 15 requisições (a taxa de 5 por segundo mais a rajada de 10) e `429` para o restante. A proteção foi aplicada na borda, sem alterar nenhum serviço. (O número exato depende da velocidade da sua máquina.)

**Leitura de cockpit:** é o limitador de velocidade do pit lane. A regra é a mesma para todos, aplicada na entrada, sem olhar quem é o carro nem o que ele vai fazer no box, e nenhum posto da garagem precisa mudar nada para ela valer. O `429` é a resposta a quem passa do teto. **Aqui a analogia para:** o limitador controla a velocidade de cada carro, enquanto o rate limit controla quantos pedidos uma mesma origem faz por segundo, com folga para uma rajada curta (`burst=10`). E quem excede não leva punição depois: só tem aqueles pedidos recusados na hora.

**7. Opcional: a mesma fila, em dois dialetos (precisa das CLIs `aws` e `az`).** Emuladores locais: ElasticMQ (API compatível com o SQS) e Azurite (emulador do Azure Storage).

```sh
docker run -d --name sqs -p 9324:9324 softwaremill/elasticmq-native
docker run -d --name azurite -p 10001:10001 mcr.microsoft.com/azure-storage/azurite azurite-queue --queueHost 0.0.0.0 --skipApiVersionCheck
```

O `--skipApiVersionCheck` evita o erro `The API version ... is not supported by Azurite`, comum quando a CLI `az` é mais nova que a imagem do emulador.

AWS (SQS, contra o emulador):

```sh
export AWS_ACCESS_KEY_ID=x AWS_SECRET_ACCESS_KEY=x AWS_DEFAULT_REGION=us-east-1   # credenciais falsas, só para o emulador
EP=http://localhost:9324
Q=$(aws --endpoint-url "$EP" sqs create-queue --queue-name pedidos --query QueueUrl --output text)
aws --endpoint-url "$EP" sqs send-message --queue-url "$Q" --message-body '{"pedido":"p1"}'
aws --endpoint-url "$EP" sqs receive-message --queue-url "$Q" --max-number-of-messages 1
aws --endpoint-url "$EP" sqs receive-message --queue-url "$Q" --max-number-of-messages 1   # logo em seguida
```

Esperado: o primeiro `receive-message` devolve um JSON com `Messages`, `Body` e `ReceiptHandle`. O segundo, em seguida, não traz mensagem (sai vazio ou com `"Messages": []`, conforme a versão da CLI): a mensagem está **invisível** (visibility timeout) até você confirmar com `aws --endpoint-url "$EP" sqs delete-message --queue-url "$Q" --receipt-handle "<ReceiptHandle>"` ou até o tempo expirar, quando ela reaparece. É a garantia de "pelo menos uma vez".

Azure (Queue Storage, contra o Azurite, com a conta de desenvolvimento padrão do emulador):

```sh
AZ_CS="DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;"
az storage queue create --name pedidos --connection-string "$AZ_CS"
az storage message put --queue-name pedidos --content '{"pedido":"p1"}' --connection-string "$AZ_CS"
az storage message get --queue-name pedidos --connection-string "$AZ_CS"
```

Esperado: o `get` devolve um JSON com `id`, `popReceipt` e `dequeueCount` (igual a 1). A mensagem fica invisível até o `az storage message delete --queue-name pedidos --id <id> --pop-receipt <popReceipt> --connection-string "$AZ_CS"`. O formato do conteúdo (texto ou codificado) pode variar conforme a versão da CLI. O `dequeueCount` é o contador que, no Queue Storage, a aplicação usa para decidir quando desistir de uma mensagem e movê-la para uma fila própria de descartes. Compare com o SQS e o Service Bus, que têm isso embutido.

**Leitura de cockpit:** é a mesma pilha de pneus em dois circuitos. O procedimento (pegar, marcar em análise, confirmar) é igual; muda o nome do recibo (`ReceiptHandle` num, `popReceipt` no outro) e o fato de que, no segundo, a caixa de descarte é por sua conta.

**8. Referência de nuvem (não execute para completar o guia; cria recursos e gera cobrança).**

```sh
# AWS: fila SQS e um tópico SNS com assinatura da fila (fan-out)
aws sqs create-queue --queue-name pedidos
aws sqs send-message --queue-url <URL-da-fila> --message-body '{"pedido":"p1"}'
aws sqs receive-message --queue-url <URL-da-fila> --wait-time-seconds 10
aws sqs delete-message --queue-url <URL-da-fila> --receipt-handle <RECIBO>
aws sns create-topic --name pedido-criado
aws sns subscribe --topic-arn <ARN-do-topico> --protocol sqs --notification-endpoint <ARN-da-fila>

# Azure: Service Bus com fila e tópico com assinatura (o tópico exige a camada Standard)
az group create --name rg-lab --location brazilsouth
az servicebus namespace create --resource-group rg-lab --name <namespace-unico> \
  --location brazilsouth --sku Standard
az servicebus queue create --resource-group rg-lab --namespace-name <namespace-unico> --name pedidos
az servicebus topic create --resource-group rg-lab --namespace-name <namespace-unico> --name pedido-criado
az servicebus topic subscription create --resource-group rg-lab --namespace-name <namespace-unico> \
  --topic-name pedido-criado --name estoque

# Azure: alternativa mais simples, Queue Storage dentro de uma conta de armazenamento
az storage account create --name <conta-unica> --resource-group rg-lab --location brazilsouth --sku Standard_LRS
az storage queue create --name pedidos --account-name <conta-unica> --auth-mode login
```

Dois avisos para quem executar. A assinatura do SNS só entrega na fila se a fila tiver uma política (atributo `Policy`, aplicado com `aws sqs set-queue-attributes`) que permita `sqs:SendMessage` ao serviço `sns.amazonaws.com` para aquele tópico; sem ela, o `subscribe` funciona e nenhuma mensagem chega. E o `az storage queue create --auth-mode login` usa a sua identidade do Microsoft Entra ID, que precisa do papel "Storage Queue Data Contributor" na conta de armazenamento, mesmo que você seja dono da assinatura; sem o papel, o comando é recusado por falta de autorização.

Limpeza: `aws sqs delete-queue --queue-url <URL-da-fila>`, `aws sns delete-topic --topic-arn <ARN-do-topico>` e `az group delete --name rg-lab --yes`. O envio e o recebimento de mensagens no Service Bus costumam ser feitos por SDK ou pelo portal, não pela CLI `az`; por isso não há comando de `send` acima.

**Limpeza local:**

```sh
docker compose down
docker rm -f sqs azurite 2>/dev/null
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_DEFAULT_REGION EP Q AZ_CS   # as credenciais falsas não ficam valendo na sessão
```

### Exercícios

*Volta lançada! Cinco perguntas, do e-mail de confirmação à mensagem envenenada. É a última sessão cronometrada do GP.*

1. **Síncrono ou assíncrono?** Classifique e justifique: (a) validar o cartão antes de confirmar a compra, (b) enviar o e-mail de confirmação, (c) atualizar o estoque depois do pedido, (d) consultar o preço de um produto para exibir na tela. *Resposta esperada:* (a) síncrono, pois a resposta decide o fluxo; (b) assíncrono, não é parte crítica e pode esperar; (c) assíncrono por evento, aceitando consistência eventual; (d) síncrono, é uma consulta que precisa de resposta imediata (REST, ou gRPC se for chamada interna e crítica em desempenho).
2. **Mensagem duplicada.** Seu consumidor de pedidos recebeu duas vezes a mensagem `p1` e cobrou o cliente duas vezes. Qual propriedade faltou e como corrigir? *Resposta esperada:* idempotência. Guardar o identificador da mensagem ou do pedido já processado (por exemplo, numa tabela ou chave no Redis) e ignorar repetições, ou usar deduplicação do broker quando houver (SQS FIFO e Service Bus oferecem), sem abrir mão da checagem no consumidor.
3. **Mensagem envenenada.** Uma mensagem sempre faz o consumidor falhar e reaparece para sempre. O que fazer em SQS, Service Bus e Queue Storage? *Resposta esperada:* SQS: configurar uma dead-letter queue com número máximo de recebimentos. Service Bus: usar a dead-letter queue da própria fila, com o número máximo de entregas. Queue Storage: não há DLQ nativa; ler o `dequeueCount` e, passado o limite, mover a mensagem para outra fila e removê-la da original (com o gatilho de fila do Azure Functions, isso já acontece, para a fila `-poison`).
4. **O gateway é perigoso?** Cite duas desvantagens do API Gateway segundo o material e uma mitigação para cada. *Resposta esperada:* ponto único de falha (mitigar com alta disponibilidade: várias réplicas atrás de um balanceador, ou o serviço gerenciado do provedor); latência adicional (mitigar mantendo o gateway enxuto, só com responsabilidades transversais como autenticação e limite de taxa, sem lógica de negócio).
5. **Qual serviço de nuvem?** Escolha, nos dois provedores, a opção mais adequada para (a) notificar vários serviços de que "pedido criado" aconteceu e (b) guardar o trabalho de gerar notas fiscais, que não pode se perder. *Resposta esperada:* (a) SNS ou EventBridge na AWS, Event Grid ou Service Bus topics no Azure; (b) SQS na AWS, Service Bus (peek-lock) ou Queue Storage no Azure; com os cuidados de idempotência e de DLQ discutidos acima.

### Anota aí

> Chame de forma síncrona só o que precisa de resposta agora; todo o resto vira mensagem, com consumidor idempotente, e o gateway e o identificador de requisição cuidam do que atravessa todos os serviços.

*Setor 4 no verde! Síncrono só para o que decide o fluxo, fila com consumidor idempotente para o resto, rate limit na borda e um código de barras seguindo cada pedido. Quatro setores completos. Agora é a reta final, direto para a bandeira quadriculada.*

---

## Checklist de autoavaliação

*Última reta, bandeira quadriculada à vista! Esta é a vistoria do parque fechado, onde os carros são conferidos depois da bandeirada: marque com honestidade, porque comissário não aceita resposta decorada.*

Marque só o que você consegue fazer **sem consultar o texto**.

**Etapa 01: Monolito, camadas e microsserviços**

- [ ] Explico por que camadas não resolvem o problema do deploy único.
- [ ] Listo as cinco características de um monolito e dou um exemplo de cada.
- [ ] Defino microsserviços e cito suas quatro características principais.
- [ ] Explico por que cada resposta precisa do status code correto.
- [ ] Nomeio ao menos cinco desafios dos microsserviços e sei quando NÃO migrar.
- [ ] Mostro, no laboratório, o efeito de uma rota lenta e de um crash no monolito e nos serviços separados.
- [ ] Aponto o serviço da AWS e do Azure para VM, containers gerenciados, Kubernetes e funções.

**Etapa 02: Microsserviços**

- [ ] Explico por que cortar por camada técnica é um erro e por que se corta por capacidade de negócio.
- [ ] Descrevo baixo acoplamento, alta coesão e esconder a complexidade.
- [ ] Explico bounded context e as etapas do DDD estratégico.
- [ ] Divido o sistema de testes em serviços e justifico cada limite.
- [ ] Explico service discovery e digo onde AWS e Azure diferem nesse ponto.
- [ ] Diferencio OpenAPI e AsyncAPI e explico por que contratos versionados importam.

**Etapa 03: Banco de dados**

- [ ] Explico por que cada serviço tem o seu banco e o que isso custa.
- [ ] Distingo ACID e consistência eventual com um exemplo.
- [ ] Explico o CAP como escolha durante uma partição.
- [ ] Escolho SQL ou NoSQL com argumentos e aponto o serviço equivalente na AWS e no Azure.
- [ ] Explico DynamoDB x Cosmos DB em cobrança e em consistência.
- [ ] Executo e explico uma saga com compensação, e por que a compensação precisa ser idempotente.
- [ ] Explico Event Sourcing, CQRS, 2PC e o papel de Flyway e Liquibase.

**Etapa 04: Comunicação**

- [ ] Explico REST (incluindo stateless) e gRPC (protobuf) e comparo as duas abordagens.
- [ ] Mostro o acoplamento temporal da chamada síncrona e como a fila o resolve.
- [ ] Explico entrega "pelo menos uma vez", idempotência e DLQ nos três serviços de fila (SQS, Service Bus, Queue Storage).
- [ ] Diferencio fila, publicação e assinatura, e fluxo de eventos (SQS, SNS, EventBridge, Kinesis ou MSK, Event Grid, Event Hubs).
- [ ] Explico o que um API Gateway faz, seus riscos e o equivalente na AWS e no Azure.
- [ ] Sigo um identificador de requisição pelos logs de vários serviços.
- [ ] Digo duas diferenças reais entre um serviço da AWS e o seu par do Azure sem inventar números.

*BANDEIRA QUADRICULADA! Se as caixas estão marcadas, sobe no pódio: você largou numa garagem em que todo mundo faz tudo e cruzou a linha com postos especializados, fronteiras por domínio, um engenheiro de corrida na borda, cada disciplina dona dos seus dados, uma saga que desfaz em ordem inversa e uma pilha de pneus que segura o pico. E não tire o pé antes da linha: em Interlagos, em 2008, o Felipe Massa cruzou a chegada como campeão por alguns segundos, até o Lewis Hamilton passar o Timo Glock nas curvas finais e ficar com o título por um ponto. Ficou caixa em branco? Sem drama: box, ajusta e volta para a pista. Na sequência, os registros de bastidor do piloto e do professor.*

---

## Notas do piloto: onde as analogias quebram

A camada de F1 não altera comandos, código, tabelas técnicas, saídas esperadas nem exercícios; as correções técnicas vieram da revisão do professor. Os pontos em que a comparação não fecha 100%:

1. **A garagem "todo mundo faz tudo" é um modelo.** Equipes reais já são especializadas por posto. Usei a garagem hipotética para mostrar o monolito, não para descrever a F1.
2. **Uma crew para dois carros.** O double stack é um custo inevitável na pista; no software, separar a capacidade é escolha de arquitetura e custa pouco.
3. **A parada é síncrona.** Os postos são independentes em gente e ferramenta, mas o carro só sai quando as quatro rodas terminam. Microsserviços podem ser independentes também no tempo.
4. **Abandono não tem volta.** Carro que para na pista está fora da corrida; um processo que cai sobe de novo com um comando.
5. **O engenheiro de corrida entende o conteúdo.** O gateway encaminha por prefixo, conta pedidos por origem e devolve códigos, sem entender o domínio. O rate limit não prioriza por importância.
6. **Convergência humana x automática.** A classificação provisória converge por decisão dos comissários; a consistência eventual converge por eventos, compensações e regras.
7. **CAP é decidido antes.** No muro, uma pessoa escolhe caso a caso entre esperar dado fresco e decidir com o que tem; no banco, a escolha é de projeto ou de configuração.
8. **2PC na rede custa mais que no box.** O semáforo de liberação segura o carro por segundos, no mesmo lugar; entre serviços, segurar recursos esperando o último participante é caro e frágil.
9. **Cronometragem como modelo.** Uso a ideia geral de passagens registradas e classificação derivada, não a implementação do sistema oficial, que não conheço em detalhe.
10. **gRPC e telemetria.** O paralelo é com o formato (binário, com esquema), não com a direção do fluxo.
11. **A pilha do laboratório não marca "em análise".** A lista do Redis perde a mensagem se o consumidor morrer no meio; SQS, Service Bus e Queue Storage não perdem.
12. **Provedores e circuitos.** O calendário escolhe o circuito; na nuvem, você escolhe o provedor e pode usar os dois. Nenhum provedor foi associado a uma equipe real.

## Fontes dos dados de F1 (consultadas em 2026-10-06)

Reaproveitadas do guia de Cultura DevOps deste módulo; nenhuma busca nova foi feita para este guia.

- Classificação de pilotos após a rodada 16 de 23: [RacingNews365](https://racingnews365.com/2026-f1-championship-standings-after-bahrain-grand-prix-in-malaysia) e [Motorsport Week](https://www.motorsportweek.com/2026/10/04/f1-2026-world-championship-standings-after-the-bahrain-gp-in-malaysia/).
- Resultado e relato do GP do Bahrein em Sepang (4 de outubro de 2026), classificação de construtores: [Formula1.com](https://www.formula1.com/en/latest/article/verstappen-wins-rain-hit-bahrain-gp-in-malaysia-over-antonelli-as-russell-retires-late-on.6qfpIHPch8mIVj2YgfHdCp) e [RaceFans](https://www.racefans.net/2026/10/04/2026-bahrain-grand-prix-in-malaysia-race-result-and-championship-points/).
- GP de Singapura 2026 (9 a 11 de outubro, primeiro fim de semana sprint em Marina Bay): [RacingNews365](https://racingnews365.com/f1/races/singapore-gp) e [F1 Wiki](https://f1.fandom.com/wiki/2026_Singapore_Grand_Prix).
- Fato histórico, GP do Bahrein de 2018 (liberação insegura da Ferrari, mecânico ferido, multa de 50 mil euros): [Formula1.com](https://www.formula1.com/en/latest/article/ferrari-handed-big-fine-for-raikkonen-unsafe-release.40Rd1aQwsgKSomC2UqqQwc) e [RACER](https://racer.com/2018/04/08/ferrari-mechanic-breaks-leg-in-pit-stop-mishap).

---

## Apêndice: quadro de-para completo

Todas as analogias usadas no documento, na ordem em que aparecem. As centrais estão no quadro do início. AWS e Azure entram sempre da mesma forma, como circuitos; nenhum provedor é associado a uma equipe real.

| Arquitetura de aplicações | Fórmula 1 |
|---|---|
| Aplicação (o sistema inteiro) | A operação da equipe no fim de semana: garagem, crew, muro e fábrica |
| Requisição de um cliente | Um pedido de trabalho que chega à equipe: o piloto pedindo pelo rádio ou o carro entrando no box |
| Cliente | O piloto, que conhece uma única voz da equipe |
| Mudança pequena exigindo deploy de tudo | Mudar um passo do trabalho e ter de reensaiar e liberar o procedimento inteiro |
| Monolito | Uma garagem em que os mesmos mecânicos fazem todas as tarefas, com um procedimento único, ensaiado e liberado em bloco |
| Dependência forte e raio de explosão | O sistema hidráulico: um vazamento encerra a corrida do carro inteiro |
| Arquitetura em camadas | A cadeia de comunicação: piloto, engenheiro de corrida, muro, analistas de dados; cada nível só fala com o de baixo |
| Camada de apresentação | O engenheiro de corrida, que recebe o pedido e devolve a resposta |
| Camada de negócio | O muro de estratégia, que decide |
| Camada de dados | Os analistas, únicos que mexem na telemetria bruta |
| Microsserviço | Um posto especializado (pneus, estratégia, unidade de potência, a crew de cada roda), com função, gente, equipamento e ensaio próprios |
| Comunicação via API | O rádio interno e os canais de telemetria combinados |
| Escalar um serviço | Reforçar só o posto que está sobrecarregado |
| Status code HTTP | O semáforo de liberação: verde só quando está tudo preso |
| `200` com corpo de erro | A liberação insegura: semáforo verde com a roda solta |
| Desafios dos microsserviços | O custo de coordenar dezenas de postos: muro, padrão de rádio, perguntas que atravessam vários postos |
| Provedor de nuvem (AWS ou Azure) | O circuito: cada um tem instalações próprias, e o procedimento da equipe é o mesmo nos dois |
| VM x containers gerenciados x funções | Montar a estrutura inteira na garagem x usar cada vez mais o que o circuito entrega pronto |
| Instância com `CAPACIDADE` | Um grupo de mecânicos com N pessoas livres ao mesmo tempo |
| Rota rápida (`pedidos`) e rota lenta (`relatorios`) | A troca de pneus e a troca de bico |
| `404` de rota de outro serviço | O mecânico de pneu dizendo "bico não é comigo" |
| Capacidade compartilhada | O double stack: a crew única faz o segundo carro esperar o primeiro |
| Processo que morre (`Exited (1)`) | O abandono: o carro para e sai da corrida |
| `docker compose up -d` depois do crash | O que a F1 não tem: pôr de volta na corrida o carro que abandonou |
| Corte por camada técnica | Organizar a equipe em "quem mexe nos dados", "quem decide" e "quem fala com o piloto" |
| Corte por capacidade de negócio | Organizar a equipe por disciplina: aerodinâmica, dinâmica veicular, unidade de potência, pneus, estratégia |
| Baixo acoplamento e alta coesão | Pneus mudam o método sem a estratégia mudar nada; tudo sobre pneus mora no posto de pneus |
| Esconder a complexidade | O piloto pergunta quantas voltas o pneu aguenta e recebe um número, sem ver o modelo |
| Bounded context | A palavra "janela": de pit stop para o estrategista, de temperatura para o engenheiro de pneus |
| Autenticação com JWT e roles | O credenciamento do paddock, com o nível de acesso impresso na credencial |
| ADM com cache | O painel resumo do chefe de equipe, alimentado pelos departamentos |
| Contrato versionado (OpenAPI, AsyncAPI) | A lista de canais da telemetria e o vocabulário do rádio, com versão |
| Service discovery | Chamar o posto pela função no rádio interno; quem estiver escalado responde |
| Cloud Map x descoberta embutida | O diretório de postos como instalação à parte num circuito, embutido na garagem no outro |
| API Gateway | O engenheiro de corrida: única voz entre o piloto e a equipe, que encaminha cada pedido ao posto certo |
| `resolver` com variável no Nginx | O engenheiro que confere quem está no posto na hora do pedido |
| `502` no gateway | "Sem resposta desse posto agora", com os outros postos funcionando |
| `404` do próprio gateway | "Esse posto não existe nesta equipe" |
| Banco compartilhado | Ler o canal direto da base de outro departamento, que um dia é renomeado sem aviso |
| Banco por serviço | Cada disciplina dona dos seus dados: quem precisa pede o número, não abre a planilha do outro |
| Evento entre serviços | O aviso "pneu passou do limite" enviado à estratégia |
| Consistência eventual | A classificação provisória, que converge para a oficial depois das decisões dos comissários |
| Partição de rede (CAP) | A perda do link de telemetria entre o carro e o muro |
| SQL, esquema rígido | A planilha de set-up com colunas fixas |
| NoSQL, esquema flexível | O registro de telemetria em que cada sessão pode trazer canais diferentes |
| Migração (Flyway, Liquibase, `ALTER TABLE`) | A revisão registrada da planilha antes de o dado novo entrar |
| DynamoDB x Cosmos DB | O mesmo tipo de armazém em dois circuitos, com cobrança e consistência diferentes |
| Saga com compensação | A logística da viagem reservada em passos e desfeita em ordem inversa, com cancelamentos que ficam no histórico |
| Saga por orquestração | O coordenador de logística mandando em cada passo |
| Saga por coreografia | A mensagem "safety car" da direção de prova: cada departamento reage ao evento por conta própria, sem ordem individual |
| Two-Phase Commit | O semáforo de liberação: cada pistola confirma, depois a luz fica verde |
| Event Sourcing | A cronometragem: passagens registradas e classificação derivada delas |
| CQRS | A tela de tempos como modelo de leitura, separado de quem grava as passagens |
| `REFRESH MATERIALIZED VIEW` | A atualização da tela de tempos |
| Compensação que não apaga | A reserva cancelada que continua no sistema, com o status trocado |
| Volume exclusivo por container | O mesmo nome de arquivo em computadores de departamentos diferentes |
| Chamada síncrona com dependência secundária | O carro preso no box esperando a medição dos pneus retirados |
| Comunicação síncrona | A pergunta pelo rádio que precisa de resposta antes de o piloto agir |
| Comunicação assíncrona (fila) | Os pneus retirados que vão para a pilha e são medidos depois, com o carro já na pista |
| REST, sem estado | O rádio com vocabulário padronizado: cada mensagem completa e independente |
| gRPC com Protocol Buffers | A telemetria: binária, compacta, com canais definidos por esquema |
| Mensagem duplicada e idempotência | Lançar o mesmo jogo duas vezes no registro não pode duplicar o dado |
| Gateway como ponto único de falha | O rádio que falha e deixa o piloto sem nenhum posto |
| Alta disponibilidade do gateway | Canais de reserva: a placa no muro e as mensagens no painel do volante |
| Arquitetura híbrida | A parada real: rodas presas na hora, medição e análise depois |
| Identificador de requisição e tracing | O código de barras do pneu, seguido por todos os registros |
| Fila (SQS, Queue Storage, Service Bus) | A pilha de pneus: cada jogo medido por um técnico só |
| Publicação e assinatura (SNS, Event Grid, topics) | As mensagens da direção de prova, que chegam a todas as equipes ao mesmo tempo |
| Fluxo de eventos (Kafka, Kinesis, Event Hubs) | O registro completo da cronometragem, guardado e relido do começo |
| Visibility timeout, peek-lock e recibo | O técnico que marca o jogo "em análise"; se não concluir, o jogo volta para a pilha |
| Dead-letter queue | A caixa à parte para o jogo que não se consegue medir |
| `notificador` lento | O engenheiro de pneus medindo um jogo a cada 2 s |
| `202 Accepted` | O carro sai na hora; o resto fica para depois |
| Escalar o consumidor | Mais técnicos tirando jogos diferentes da mesma pilha |
| Rate limit no gateway (`429`) | O limitador de velocidade do pit lane: o mesmo teto para todos, aplicado na entrada |
| ElasticMQ x Azurite | A mesma pilha de pneus em dois circuitos, com nomes de recibo diferentes |

---

## Notas do professor

**Precisões e correções ao material bruto:**

1. **gRPC e HTTP (Etapa 04).** O material apresenta o gRPC como "alternativa à comunicação baseada em HTTP/texto". Na verdade, o gRPC usa **HTTP/2** como transporte; a diferença em relação ao REST é o formato (binário com Protocol Buffers, contra texto JSON ou XML) e o contrato definido por esquema.
2. **Teorema CAP (Etapa 03).** O material diz que o sistema pode oferecer "no máximo duas das três garantias" e que bancos SQL "tendem a priorizar consistência e disponibilidade". A leitura mais precisa: partições de rede acontecem, então, **durante uma partição**, escolhe-se entre consistência e disponibilidade. Sem partição, dá para ter as duas. Classificar bancos em "CP" ou "AP" é simplificação: muitos permitem ajustar o comportamento por configuração (o Cosmos DB, com seus cinco níveis, é um exemplo).
3. **Two-Phase Commit (Etapa 03).** O material apresenta o 2PC como "seguro" e o ilustra com transferência bancária. Vale acrescentar que, entre microsserviços, ele costuma ser evitado por bloquear recursos, aumentar a latência e exigir suporte de todos os participantes; a saga é a alternativa mais comum. O 2PC continua válido dentro de um sistema que o suporte nativamente.
4. **Event Sourcing e consistência eventual (Etapa 03).** O material lista "consistência eventual" como benefício do Event Sourcing. Mais exato: o registro ordenado de eventos **viabiliza** que os consumidores convirjam para o mesmo estado ao processá-los, mas a consistência eventual é uma propriedade do sistema distribuído, não algo que o padrão entrega sozinho.
5. **Dado de mercado não verificável (Etapa 03).** A afirmação de que "mais de 75% das grandes empresas" estão migrando, atribuída ao Gartner e à InfoQ, vem com um link de uma comunidade de pares do Gartner ("one minute insights"), que não permite confirmar um estudo com esse número. Mantive a frase como "segundo o material" e não a usei em nenhuma decisão técnica. Os cases (Mercado Livre, Amazon, Netflix, Spotify) também são afirmações do material e não foram verificados.
6. **Kafka como fila (Etapa 04).** O material agrupa Kafka com RabbitMQ e SQS como "filas". O Kafka é um log distribuído de eventos, com retenção e releitura, e seu equivalente em nuvem é um serviço de fluxo (Kinesis, Event Hubs), não uma fila tradicional.
7. **Fonte de figura (Etapa 01).** A Figura 5 (arquitetura do monolito do streaming) cita como fonte a mesma URL da Figura 4 (códigos de status HTTP), o que é evidentemente um erro de cópia. As figuras não vêm no texto extraído e não influenciaram o conteúdo.
8. **Referências sem relação com o conteúdo.** Na Etapa 03, a referência "O que é a tecnologia blockchain?" (AWS) e, na Etapa 04, as referências de big data (Gandomi e Haider; Laney) não correspondem ao tema das aulas. Foram omitidas da lista de referências abaixo.
9. **Descrição das camadas (Etapa 01).** O material só mostra a arquitetura em camadas numa figura; a descrição em apresentação, negócio e dados é a organização clássica e foi acrescentada pelo professor.

**Conteúdo acrescentado pelo professor (marcado nas tabelas):**

- Toda a coluna Azure e boa parte da coluna AWS das tabelas de equivalência, exceto o que o material já cita: Azure Cosmos DB, a documentação de análise de domínio da Microsoft, Amazon SQS, Amazon DynamoDB e Amazon API Gateway.
- As analogias do dia a dia (restaurante com uma cozinha, prédio de andares, praça de alimentação, departamentos, caderno de cada departamento, telefonema x carta). O material não traz analogias; o termo "ator condutor" e a estratégia de hot ou cold cache vêm dele.
- A seção de service discovery, a tabela de hospedagem (Etapa 01), as diferenças de semântica de entrega e de DLQ entre SQS, Service Bus e Queue Storage, e a tabela de observabilidade.
- Os laboratórios de saga, de esquema rígido x flexível, de Event Sourcing e CQRS em miniatura, de fila x HTTP, de rate limit e de identificador de requisição.

**Limites dos laboratórios (onde a analogia local termina):**

- A aplicação de teste da Etapa 01 **modela** a capacidade com um semáforo e um `sleep`. Os números são previsíveis por construção e servem para ver a lógica, não para medir hardware.
- O Nginx faz o papel de gateway, mas não oferece autenticação, portal de desenvolvedor, transformação de payload ou integração OAuth2 prontas como o Amazon API Gateway e o Azure API Management oferecem.
- A "fila" principal do laboratório é uma **lista do Redis** (`LPUSH` e `BRPOP`). Ela não tem confirmação nem visibility timeout: se o consumidor morrer depois de retirar a mensagem e antes de concluir, a mensagem se perde. O SQS, o Service Bus e o Queue Storage mantêm a mensagem até a confirmação, e é essa a garantia que o padrão real exige. O bloco opcional com ElasticMQ e Azurite mostra esse comportamento.
- Os emuladores (ElasticMQ, Azurite, DynamoDB Local) reproduzem a API, não a escala, a durabilidade nem a cobrança dos serviços reais. O comportamento exato pode ter pequenas diferenças em relação à nuvem.
- Os bancos por serviço usam SQLite para dispensar drivers; o princípio de isolamento vale para PostgreSQL, MongoDB e demais. O orquestrador de saga em shell guarda seu progresso em memória, ao contrário de Step Functions e Durable Functions.
- Os comandos `aws` e `az` marcados como referência de nuvem criam recursos reais. Nomes de classes de instância, SKUs, regiões e parâmetros mudam; confirme na documentação atual antes de executar, e use sempre a limpeza indicada.

---

## Referências do material

- FIELDING, R. T. *Architectural Styles and the Design of Network-based Software Architectures*. 2000.
- PRESSMAN, R. S. *Engenharia de Software: Uma Abordagem Profissional*. McGraw-Hill, 2011.
- SOMMERVILLE, I. *Engenharia de Software*. Pearson, 2011; *Software Engineering: International Version*. Pearson, 2016.
- SPLUNK. *REST API User Manual*. 2023.
- AWS. *Microsserviços*. 2019. Amazon DynamoDB. 2024.
- Microsoft Azure. *Azure Cosmos DB: Globally Distributed, Multi-Model Database*. 2024. Microsoft Learn, *Domain analysis for microservices* (Azure Architecture Center).
- BASS, L.; CLEMENTS, P.; KAZMAN, R. *Software Architecture in Practice*. Addison-Wesley, 2012.
- KRUCHTEN, P. *Architectural Blueprints: The 4+1 View Model of Software Architecture*. IEEE Software, 1995.
- SHAW, M.; GARLAN, D. *Software Architecture: Perspectives on an Emerging Discipline*. Prentice Hall, 1996.
- JSON Schema. 2023.
- Gartner, comunidade de pares, "Microservices architecture: have engineering organizations found success" (citado no material, não verificado; veja a nota 5).

---

*E assim encerramos a transmissão, direto do muro dos boxes do GP da Arquitetura de Aplicações: quatro setores, nenhum abandono e uma equipe em que cada posto trabalha sozinho e conversa pelo rádio sem segurar o carro no box. Da cabine, é tudo. A próxima parada do calendário é Singapura, de 9 a 11 de outubro de 2026; até lá, lembre: chame pelo rádio só o que precisa de resposta agora, e mande o resto para a pilha. FIM DE TRANSMISSÃO.*
