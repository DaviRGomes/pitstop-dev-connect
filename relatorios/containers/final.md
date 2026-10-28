# Containers e Docker: do isolamento de um processo a uma stack completa

> Baseado nas aulas 1–6 do módulo de Containers e Docker (introdução, imagens, Dockerfile, volumes e redes, Docker Compose, boas práticas, segurança e troubleshooting), reorganizado em 13 etapas progressivas.

Este guia ensina, em 13 etapas, o caminho que uma aplicação percorre do notebook de quem a escreveu até um ambiente de produção, usando containers. Você começa entendendo por que containers existem e como o kernel Linux isola processos com namespaces e cgroups; depois separa imagem de container, escreve um Dockerfile, organiza camadas e cache e reduz o tamanho da imagem com bases mínimas e multistage build. Em seguida persiste dados com volumes, bind mounts e tmpfs, conecta serviços por nome em redes personalizadas e descreve a aplicação inteira em um arquivo do Docker Compose, com variações por ambiente, política de reinício, escala e uso em CI. Por fim, reduz privilégios (usuário não root, capabilities, seccomp, sistema de arquivos somente leitura), controla o que entra no build e como os segredos são tratados, investiga falhas com uma ordem de diagnóstico, verifica a prontidão real dos serviços com logs e healthchecks e junta tudo em uma stack pequena e defensiva. Antes das etapas, a seção seguinte apresenta a lente de F1 do guia: uma comparação geral que mostra o mesmo caminho, da fábrica ao box, funcionando dentro de uma equipe de Fórmula 1.

Cada etapa só depende do que foi explicado antes dela e termina com um exercício pequeno que prova que você entendeu. Containers se aprendem criando e destruindo coisas de propósito, então não pule os blocos "Mão na massa".

**O que você precisa ter:** Docker Engine ou Docker Desktop, com o comando `docker compose` (Compose v2) disponível, e um terminal com `curl`. Confirme com `docker version` e `docker compose version`. Os exemplos usam imagens Linux. No Docker Desktop, essas imagens rodam dentro da máquina virtual Linux administrada pela própria ferramenta. Alguns tutoriais antigos usam `docker-compose` (com hífen), o executável da primeira geração; neste guia usamos sempre `docker compose`.

**Como usar este guia:** mantenha um terminal aberto ao lado do texto e organize os arquivos em uma pasta por etapa (`etapa01/`, `etapa02/` e assim por diante), porque nomes como `Dockerfile` e `compose.yaml` se repetem. Ao fim de cada etapa, remova os containers, redes e volumes de laboratório que ela criou, para que portas como 3000 e 8080 fiquem livres para a etapa seguinte. Quando um exemplo mostra a saída esperada, compare com a sua: IDs, tempos, tamanhos e versões vão variar, e a estrutura da saída é o que importa. Saídas abreviadas estão marcadas com `...`.

**O que roda onde:** todas as etapas rodam em Docker no seu computador. Só três exemplos dependem de algo externo: o `docker push` da Etapa 02 exige um registry real com permissão de escrita, o volume NFS da Etapa 05 exige um servidor NFS acessível, e as ferramentas Dive e Snyk da Etapa 10 precisam ser instaladas à parte (o Snyk também exige uma conta). Esses trechos são marcados no texto e o restante do guia não depende deles.

**Sobre versões:** imagens e linguagens evoluem. Os exemplos de Node.js usam as tags `lts-alpine` e `lts-slim`, que sempre apontam para a versão de suporte estendido vigente, para que os exercícios não envelheçam. Em um projeto real, a Etapa 02 explica por que fixar uma versão explícita é melhor.

> **Cuidado com limpeza:** comandos com `prune` removem recursos não utilizados em todo o ambiente Docker. `docker rm --force` interrompe e remove o container sem a parada normal, descartando tudo que existia somente em sua camada gravável. `docker volume rm` apaga permanentemente o conteúdo do volume indicado. `docker compose down --volumes` remove os volumes declarados pela aplicação e os dados guardados neles. Confira nomes, faça backup do que importa e execute essas opções somente quando a perda for intencional.

## A lente de F1 deste guia

Uma equipe de Fórmula 1 não fabrica o carro no circuito. Na fábrica, os engenheiros escrevem o manual de montagem, a sequência exata de passos: comece por este chassi (a estrutura central de fibra de carbono onde tudo é fixado), instale esta unidade de potência (o motor do carro, que junta o motor a combustão e a parte elétrica que recupera e devolve energia), depois o pacote aerodinâmico. A bancada de montagem recebe só uma caixa com as peças necessárias, e uma lista diz o que fica fora dela (anotações pessoais, chaves de acesso, sobras). Seguindo o manual, os mecânicos produzem um kit fechado: o carro em subconjuntos já montados, cada caixote de transporte com o resultado de um passo do manual aplicado sobre o anterior, e sem os moldes e as ferramentas, que ficam na fábrica. Se um passo e as suas peças são idênticos aos do último kit, a fábrica reaproveita o subconjunto pronto; se uma peça de baixo muda, tudo o que vai em cima dela é refeito, e por isso o que muda a cada fim de semana entra por último. O kit fica no armazém da equipe, de acesso restrito, e as peças padrão vêm de catálogos de fornecedores abertos a qualquer equipe. Cada kit leva uma etiqueta de versão ("especificação B"), que a equipe pode depois colar em outro kit, e uma lista de conteúdo com o número de série de cada peça, que muda se qualquer peça mudar. A logística despacha o mesmo kit para qualquer circuito, enviando só os caixotes que ainda não estão no destino. O que varia de um circuito para outro é a folha de parâmetros (mapas de motor, modos de energia), entregue à parte, sem trocar nenhuma peça.

No circuito, a equipe ocupa uma garagem no pit lane (a via dos boxes, onde ficam as garagens), dividida em um box para cada um dos dois carros que o regulamento permite. Os mecânicos tiram o carro dos caixotes e o põem em funcionamento no box, e ele está em operação enquanto o motor estiver ligado. O que se altera nele durante a sessão (um ajuste feito à mão, uma anotação no chassi) fica só naquele chassi e desaparece quando ele é desmontado. Divisórias separam os boxes: os mecânicos de um carro têm as suas ferramentas, a sua lista de pessoas e o seu canal de dados, e não enxergam o box ao lado. A energia, o ar comprimido e a rede de dados vêm da mesma instalação da garagem, e cada box tem um disjuntor que limita o quanto ele pode consumir, para que um box não deixe os outros sem energia. A alternativa seria erguer dentro da garagem uma estrutura completa, com gerador e compressor próprios: isola mais, mas pesa e demora para ficar pronta. O que precisa sobreviver ao chassi fica nos armários da garagem, ligados ao carro durante a sessão. Um engenheiro também pode ligar o carro direto a uma pasta do seu notebook, e o quadro-branco do box guarda o que é rápido e se apaga ao fim da sessão. Por dentro, carros e sistemas de apoio conversam pelo intercom, o rádio interno da equipe, em canais separados, e cada um é chamado pelo seu nome de rádio, nunca pela frequência, que pode mudar. Para fora, a garagem tem poucos pontos de contato, cada um ligado a um box; o que não tem ponto aberto só é alcançável pelo intercom.

Antes de chegar, a equipe escreve o plano do fim de semana: um documento único com cada sistema de que a garagem precisa (os carros, o servidor de telemetria, o banco de tempos), os canais e os armários de cada um, de modo que uma única ordem monte tudo. O plano define a ordem de montagem, e montado primeiro não quer dizer pronto. Uma folha complementar muda só o que é diferente num dia de testes, e o plano também fixa a regra para um sistema que desliga: religar sempre, religar só depois de defeito, com um número máximo de tentativas, ou respeitar quem desligou de propósito. Na fábrica, um banco de testes automático monta o conjunto a cada peça nova, roda os testes e desmonta. Cada pessoa recebe uma credencial que abre só as áreas de que precisa, nunca o passe que abre tudo, e há pedidos que nenhum box pode fazer à instalação da garagem, como desligar o quadro geral de energia ou ligar um equipamento novo direto na rede elétrica: a instalação recusa esses pedidos, venham de quem vierem. A partir da classificação (a sessão que define a ordem de largada), o carro fica em parc fermé, o regime do regulamento em que ele fica lacrado e não pode ser modificado, com intervenções só em pontos permitidos. Códigos de acesso chegam em envelope, à pessoa certa; um código escrito numa peça durante a montagem continua registrado no kit mesmo que um passo seguinte o cubra. Durante a sessão, cada carro envia telemetria (os dados dos sensores, transmitidos continuamente) num formato fixo para os servidores da equipe. O engenheiro de corrida (quem acompanha um carro) faz de tempos em tempos o radio check, a chamada de rotina pelo rádio que confirma que o carro responde e consegue seguir o plano, o que diz mais do que ver o motor ligado; na volta de saída (a primeira, com pneus e freios ainda frios), uma resposta ruim ainda não conta. Quando um carro para, a investigação segue uma ordem: o estado e o motivo registrado da parada, os dados gravados pelo próprio carro, a ficha do que foi montado, a linha do tempo da garagem, o consumo e, só então, um notebook ligado ao carro.

É a mesma cadeia que o Docker percorre. A garagem é o host e a instalação comum é o kernel compartilhado; as divisórias entre os boxes são os namespaces e o disjuntor de cada box é o cgroup. O kit fechado é a imagem, e o carro em funcionamento no box é o container. O manual de montagem é o Dockerfile, e cada caixote do kit é uma camada da imagem. Os armários da garagem são os volumes. Cada canal do intercom é uma rede personalizada, e o nome de rádio é o DNS interno. O plano do fim de semana é o arquivo do Docker Compose. A credencial que abre só algumas áreas e o parc fermé são o menor privilégio aplicado ao container, e o envelope é o secret. O radio check é o healthcheck. Uma regra fixa vale para o guia inteiro: cada carro tirado dos caixotes e posto em funcionamento num box é um container. O kit no armazém nunca é alterado, e quem quer um carro diferente muda o manual e produz outro kit.

Se você já leu os guias de Kubernetes: aqui o guia olha uma garagem só, sem a mureta (a bancada voltada para a pista, onde ficam os engenheiros que decidem), e você dá cada ordem diretamente com o comando `docker`. Nos guias de Kubernetes, o carro passa a ser o Pod, e o container vira um dos sistemas dentro dele.

O quadro abaixo traduz cada termo técnico do guia para uma ideia do dia a dia, sem F1 e sem jargão. Não precisa decorar; volte a ele quando um termo aparecer no texto.

| Termo técnico | Em palavras simples |
|---|---|
| Container | Um quarto de hotel ocupado por um programa: ele usa só o que está dentro do quarto e não enxerga os outros quartos, mas o prédio (encanamento, energia) é compartilhado. |
| Kernel | A central do prédio que fornece energia, água e portaria para todos os quartos ao mesmo tempo. Todos os containers de um computador usam a mesma. |
| Host | O computador (ou servidor) real onde os containers funcionam, ou seja, o prédio inteiro. |
| Máquina virtual (VM) | Uma casa inteira e independente, com instalação elétrica e hidráulica própria, construída dentro do prédio. Isola bem, mas é pesada e demora mais para ficar pronta que um quarto. |
| Namespace | As paredes do quarto: definem o que cada programa consegue ver (quais processos, qual rede, quais arquivos, qual nome). |
| Cgroup | O medidor com limite em cada quarto: define quanto de processamento, memória e disco aquele programa pode gastar. |
| Processo principal (PID 1) | O primeiro programa que o container inicia, o responsável pelo quarto: quando ele sai, o quarto é fechado. Como é ele quem recebe os avisos do prédio (como "pare agora"), precisa saber reagir a eles; um "init" é um recepcionista que ocupa essa vaga e repassa os avisos ao programa. |
| Imagem | O quarto-modelo pronto e lacrado, montado seguindo a receita: planta, móveis e tudo o que o quarto precisa. Cada quarto de verdade (container) é uma cópia dele, e mexer em um quarto não altera o modelo. |
| Registry e Docker Hub | Uma biblioteca de quartos-modelo na internet, da qual você baixa os que precisa. O Docker Hub é a biblioteca pública mais conhecida; também existem bibliotecas privadas, só para quem tem senha. |
| Tag | A etiqueta de versão colada no modelo, como "edição 2". Quem etiqueta pode, mais tarde, mudar a etiqueta de um modelo para outro. |
| Digest | O número de série impresso do conteúdo exato do modelo. Se um detalhe mudar, o número muda, e por isso ele identifica sem ambiguidade. |
| Camada gravável | O bloco de notas do quarto. As anotações continuam lá quando o hóspede sai e volta (parar e reiniciar o container) e só somem quando o quarto é desmontado, isto é, quando o container é removido. |
| Dockerfile | A receita escrita: a lista de passos para montar o quarto-modelo ("comece com isto, adicione aquilo, rode este comando"), para que qualquer pessoa repita o mesmo resultado. |
| Build | O ato de seguir a receita do Dockerfile, passo a passo, para produzir o quarto-modelo. |
| EXPOSE | Uma placa na porta do quarto dizendo "atendo na porta 3000". A placa informa, mas não abre a porta para o público; quem abre é a publicação de porta. |
| Camada de imagem | Folhas transparentes empilhadas: cada passo da receita acrescenta uma folha por cima, e as folhas de baixo não mudam. |
| Cache de build | Se um passo da receita e os materiais dele são idênticos aos da última vez, o Docker reaproveita o trecho que já estava pronto em vez de refazer. |
| Imagem base (alpine, slim, distroless) | O ponto de partida da receita. Alpine é um quarto-base minúsculo, com poucos móveis; slim é um quarto reduzido, mas familiar; distroless tem só o essencial do hóspede e nenhum móvel de apoio. |
| Multistage build | Montar o quarto numa oficina cheia de ferramentas e entregar só o quarto pronto, sem as ferramentas. |
| Volume | Um armário guardado fora do quarto: o quarto pode ser trocado, e o armário continua com tudo dentro. |
| Bind mount | Uma porta que abre direto numa pasta do seu computador, de modo que o que muda em um lado aparece no outro. |
| tmpfs | Um quadro-branco: rápido, mas apagado quando a reunião termina. Fica na memória e, em geral, não é gravado em disco. |
| Rede personalizada e DNS interno | Um grupo de mensagens só com os integrantes do projeto, em que cada um é chamado pelo nome e não pelo número de telefone, que pode mudar. |
| Publicação de porta | Abrir uma janela de atendimento na fachada do prédio para o público. As outras salas continuam internas. |
| Docker Compose | Um roteiro único que lista todos os quartos do andar, como se ligam e o que cada um precisa, para montar tudo com um só pedido. |
| Serviço | Cada item do roteiro do Compose, por exemplo "a API" ou "o banco". |
| depends_on | A ordem de abertura dos quartos: "abra o do banco antes do da API". Garante só a ordem de abertura, e não que o banco já esteja pronto para atender, a menos que haja uma verificação de saúde combinada. |
| Override | Uma folha de ajustes sobreposta ao roteiro: muda só o que é diferente em um ambiente (por exemplo, abrir uma porta só no seu computador) sem reescrever o roteiro inteiro. |
| Política de reinício | A regra sobre o que fazer quando o programa para: reabrir sempre, reabrir só se parou por defeito, ou respeitar quando foi você quem mandou parar. |
| Réplica (escala) | Uma cópia idêntica de um serviço, como abrir mais um guichê igual para atender mais gente. |
| CI (integração contínua) | Um ajudante automático que, a cada mudança no projeto, monta o ambiente, roda os testes e desmonta tudo. |
| Usuário não root | Dar ao programa um crachá comum em vez da chave-mestra do prédio. Se o crachá for roubado, o estrago é bem menor. |
| Capabilities | A chave-mestra dividida em dezenas de chaves pequenas (abrir a porta A, ligar o gerador). Cada programa recebe só as chaves de que precisa. |
| Seccomp | Uma lista de pedidos que o programa pode ou não fazer à central do prédio; os pedidos perigosos são recusados. |
| Menor privilégio | A regra de dar a cada um somente o acesso necessário para a tarefa, e nada além. |
| Sistema de arquivos somente leitura | Um documento com proteção contra gravação: dá para ler, mas ninguém consegue alterar. |
| Contexto de build e .dockerignore | O contexto é a caixa de materiais enviada para quem monta o quarto-modelo. O .dockerignore é a lista do que fica de fora da caixa (rascunhos, senhas, lixo). |
| Segredo (secret) | Uma senha entregue em mãos, num envelope, em vez de escrita num cartaz na porta. |
| Variável de ambiente | Um bilhete fixado no quarto do programa: ele lê quando precisa, mas qualquer pessoa que inspecione o quarto também consegue ler. |
| ARG | Um parâmetro dado na hora de seguir a receita (como o número da versão). Fica registrado na história da montagem, então não serve para senha. |
| Vulnerabilidade (CVE) | Um defeito de segurança já catalogado e com número de registro, como o recall de um produto. |
| Dive e Snyk | Duas lupas: uma mostra o que cada folha da imagem acrescentou e quanto pesa; a outra procura defeitos de segurança já conhecidos. |
| Código de saída | O número que um programa deixa ao terminar: 0 significa "terminei bem" e qualquer outro número indica que algo deu errado. |
| OOMKilled e código 137 | OOMKilled é o registro de que o container foi encerrado por pedir mais memória do que o permitido (OOM quer dizer "sem memória"). O 137 é o número deixado por um encerramento à força; isso acontece por falta de memória, mas também quando um pedido educado de parada não é atendido a tempo. |
| Inspect | Pedir a ficha técnica completa de um container: o que ele executa, o que está montado, em qual rede está e como terminou. |
| Evento | A linha no diário do Docker que registra cada acontecimento (criado, iniciado, parado, removido), com a hora. |
| Log (stdout e stderr) | O diário que o programa escreve sozinho enquanto trabalha. Stdout recebe as mensagens normais e stderr recebe os erros. |
| Log estruturado | Diário em que cada anotação segue sempre o mesmo formulário (hora, nível, mensagem), o que permite buscar e filtrar com facilidade. |
| Healthcheck | Perguntar de tempos em tempos "você consegue atender agora?", em vez de apenas olhar se a luz do balcão está acesa. |
| start_period | O tempo de carência logo depois que o container sobe: nesse período, as respostas negativas não contam como falha, porque o programa ainda está se acomodando. |
| Prontidão | Estar realmente apto a atender, e não só ligado. |
| Stack | O conjunto completo de peças que formam uma aplicação funcionando (API, banco, rede, armazenamento). |
| Limite de recursos | Um teto de consumo: o programa pode usar até tanto de memória e processamento, mas isso não garante que ele terá esse tanto reservado. |
| Label | Uma etiqueta informativa colada no container, usada para organizar e buscar. Ela descreve e não protege nada. |

### Onde a comparação para

A comparação ajuda a fixar o caminho da fábrica até o box, mas não é uma equivalência perfeita. Estes são os pontos em que a F1 deixa de valer para cada etapa:

- **Etapa 01:** o carro é uma máquina completa e as divisórias são paredes físicas; o container é só um processo comum do host, que o kernel enxerga e pode encerrar como qualquer outro, e o isolamento é uma configuração desse mesmo kernel, não uma barreira física. Uma falha no kernel compartilhado atinge todos os containers ao mesmo tempo.
- **Etapa 02:** um kit físico vira um carro só, e montar consome as peças; uma imagem gera quantos containers forem pedidos, ao mesmo tempo, sem se gastar, e remover os containers não remove a imagem. O digest, além disso, é calculado a partir do próprio conteúdo por uma função de hash, e não atribuído por alguém como um número de série.
- **Etapa 03:** o manual de montagem é lido por mecânicos que resolvem ambiguidades; o Dockerfile é executado ao pé da letra, só enxerga os arquivos do contexto de build, e o `EXPOSE` apenas documenta a porta, sem abrir nenhum ponto de contato para fora (a porta publicada).
- **Etapa 04:** na fábrica, decidir se um subconjunto pronto (uma camada em cache) pode ser reaproveitado é um julgamento de engenharia; no build, o cache depende de comparação exata da instrução e dos arquivos de entrada, e qualquer diferença invalida aquela camada e todas as seguintes, mesmo sem efeito prático. E apagar um arquivo num passo posterior não deixa o kit mais leve: a camada que o adicionou continua na imagem.
- **Etapa 05:** os armários são móveis separados do carro; o volume é um diretório do host montado dentro do container, e o bind mount dá ao container acesso de escrita a uma pasta real do host, com as permissões dela, sem paralelo seguro na garagem. Um volume NFS remoto depende ainda da rede e das permissões do servidor, e não só do Docker.
- **Etapa 06:** no intercom, todos no canal ouvem todas as mensagens; numa rede Docker, cada container tem IP próprio e as conexões são ponto a ponto. Só as redes personalizadas resolvem nomes (a bridge padrão não resolve), e o modo `host` elimina o isolamento de rede, sem equivalente num canal de rádio.
- **Etapa 07:** o plano do fim de semana é executado por pessoas que esperam um sistema ficar pronto antes de montar o seguinte; o `depends_on` simples só garante a ordem de criação, e o Compose só espera a prontidão quando há healthcheck e a condição `service_healthy` declarada.
- **Etapa 08:** o regulamento fixa dois carros; o `--scale` cria quantas réplicas idênticas forem pedidas, limitado pelo host e pela porta fixa publicada, que só uma réplica consegue ocupar. E a regra de religar (a política de reinício) reage só ao fim do processo: um sistema que continua ligado sem responder não é religado por ela.
- **Etapa 09:** no parc fermé (a raiz somente leitura), pessoas conferem os lacres e julgam exceções; no container, `--read-only`, `--cap-drop` e seccomp são aplicados pelo kernel em cada operação, sem margem de interpretação. Além disso, por padrão o container roda como root, o que equivale a entregar o passe que abre tudo (o usuário root) até alguém configurar outro usuário, e montar o `docker.sock` num container dá a ele o comando de todos os boxes da garagem.
- **Etapa 10:** um envelope entregue em mãos só existe para quem o recebeu; um secret do Compose é um arquivo em `/run/secrets` que qualquer processo do container com permissão de leitura enxerga. E um código que entrou numa camada da imagem fica no histórico mesmo coberto por um passo seguinte, e só some quando a imagem é reconstruída sem ele.
- **Etapa 11:** um engenheiro pode ligar um notebook (o `docker exec`) a um carro parado na garagem; o `docker exec` só funciona com o container em execução, e um container encerrado deixa apenas estado, código de saída, logs e metadados. O disjuntor de cada box corta tudo de uma vez, enquanto o cgroup trata os recursos de modo diferente: excesso de CPU só deixa o processo mais lento, e é o excesso de memória que leva ao encerramento marcado como `OOMKilled`.
- **Etapa 12:** o radio check é feito por uma pessoa que entende a resposta; o healthcheck executa um comando, olha só o código de saída e prova apenas o que o teste examina. Sem orquestrador, o estado `unhealthy` fica registrado, mas o Docker não religa nem substitui o container por causa dele. E a telemetria (os logs) vai sempre para os servidores da equipe, enquanto o `docker logs` lê o que ficou no host e os logs costumam se perder com a remoção do container, a menos que sejam centralizados.
- **Etapa 13:** na garagem, pessoas compensam um item esquecido no plano do fim de semana (o arquivo Compose); na stack, cada proteção só vale se estiver declarada no arquivo. Os limites de CPU e memória funcionam como o disjuntor de cada box, contendo o consumo sem reservar capacidade para o serviço, e as labels são etiquetas de inventário, como as dos caixotes, e não lacres: descrevem e não protegem nada.

---

## Etapa 01: Por que containers existem

### O problema

Uma aplicação Node.js funciona no notebook da equipe, mas falha no servidor. A máquina local usa uma versão da linguagem, o servidor usa outra, uma biblioteca nativa está ausente e uma configuração foi feita à mão, sem documentação. O deploy vira uma tentativa de reconstruir, passo a passo, um ambiente que só existe na memória de quem o configurou.

O mesmo desgaste aparece em outras situações. Instalar pacotes e ajustar permissões direto no servidor é lento e difícil de reproduzir, e qualquer mudança pequena pode quebrar tudo. Subir uma segunda instância da aplicação exige copiar e configurar tudo de novo em outra máquina. E, se a versão nova dá problema, voltar para a anterior significa reconfigurar tudo ou torcer para existir um backup funcional.

As máquinas virtuais (VMs) melhoraram o isolamento desse cenário, mas cada VM carrega seu próprio sistema operacional completo. Isso custa memória, disco e tempo de inicialização. Quando o objetivo é executar aplicações isoladas no mesmo servidor, repetir um sistema operacional inteiro para cada uma pode ser desperdício.

### O conceito

A evolução foi esta: primeiro, uma aplicação por servidor físico, com configuração manual; depois, a virtualização, que divide um servidor em várias VMs; por fim, os containers, que isolam apenas os processos e compartilham o kernel do sistema operacional do host. O foco deixa de ser a máquina e passa a ser a aplicação.

Um **container** é um conjunto de processos isolados no nível do sistema operacional. Em Linux, dois mecanismos do kernel tornam isso possível:

- **Namespaces** controlam o que o processo consegue enxergar. Há um tipo para cada recurso: PID (a lista de processos), rede (interfaces e tabelas de rota), mount (sistema de arquivos), UTS (hostname), IPC (comunicação entre processos, como filas e memória compartilhada) e user (identificação de usuários e grupos).
- **Cgroups** (control groups) medem e limitam recursos, como CPU, memória e operações de entrada e saída em disco. Um container que tenta consumir mais que o previsto fica limitado ao que foi definido, e isso protege os demais.

O container compartilha o kernel do host. Por isso ele costuma iniciar mais rápido e consumir menos recursos que uma VM. Esse compartilhamento também significa que container não é sinônimo de máquina virtual nem uma barreira absoluta de segurança: a proteção depende da configuração do runtime e do host (a Etapa 09 aprofunda isso).

| Característica | Máquina virtual | Container |
|---|---|---|
| Unidade isolada | Máquina completa | Processos |
| Kernel | Próprio por VM | Compartilhado com o host |
| Inicialização | Geralmente mais lenta | Geralmente rápida |
| Imagem | Sistema operacional completo | Aplicação e suas dependências |

O **Docker** é a ferramenta que tornou containers acessíveis: ele padroniza como empacotar, distribuir e executar. Uma aplicação empacotada roda do mesmo jeito no seu notebook, no servidor de teste, em produção ou na nuvem, o que elimina o problema do "na minha máquina funciona".

![Três colunas: implantação tradicional, com aplicações direto sobre o sistema operacional e o hardware; implantação virtualizada, com várias VMs, cada uma com sistema operacional próprio, sobre um hypervisor; implantação com containers, com aplicações sobre um runtime de containers que compartilha o sistema operacional do host.](/guides/containers/etapa01-evolucao-deploy.svg "A evolução da etapa: uma aplicação por servidor, depois várias VMs com sistema operacional próprio, depois containers que isolam apenas os processos e compartilham o kernel do host. | Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0")

### Os conceitos-chave

- **Container**: processos isolados e limitados pelo kernel; ele vive somente enquanto o seu processo principal estiver ativo.
- **Kernel compartilhado**: é a diferença central em relação a uma VM e a razão de os containers serem leves.
- **Namespace**: isola a visão de processos, rede, arquivos, hostname, comunicação entre processos e usuários.
- **Cgroup**: mede e limita CPU, memória e entrada e saída de disco.
- **VM**: simula um computador completo, com kernel próprio; isola mais, mas custa mais.
- **Docker**: ferramenta que cria, empacota e executa containers de forma padronizada.

### Exemplo comentado: o primeiro container

```sh
# Baixa a imagem, cria um container, executa seu processo e exibe a saída.
docker run --name primeiro-container hello-world

# Lista também containers que já terminaram.
docker ps --all

# Mostra metadados completos do container em JSON.
docker inspect primeiro-container

# Remove o container já encerrado.
docker rm primeiro-container
```

Saída esperada, resumida:

```text
Hello from Docker!
...
CONTAINER ID   IMAGE         STATUS                     NAMES
abc123         hello-world   Exited (0) ...             primeiro-container
```

O status `Exited (0)` não indica falha. O processo principal imprimiu a mensagem e terminou com sucesso. Um container permanece em execução somente enquanto seu processo principal permanece ativo.

### Exemplo comentado: observando o isolamento

```sh
# PID namespace: dentro do container, o primeiro processo da lista é o PID 1,
# e os processos do host não aparecem.
docker run --rm alpine ps

# UTS namespace: o container tem seu próprio hostname, definido por --hostname.
docker run --rm --hostname demo alpine hostname

# Cgroups: limita a 64 MB de memória e meia CPU, e consulta o limite registrado.
docker run --detach --name limitado --memory 64m --cpus 0.5 alpine sleep 120
docker inspect --format 'memoria={{.HostConfig.Memory}} cpus={{.HostConfig.NanoCpus}}' limitado

# Remove o container de laboratório (descartável, por isso o --force).
docker rm --force limitado
```

Saída esperada, resumida:

```text
PID   USER     TIME  COMMAND
    1 root      0:00 ps
demo
memoria=67108864 cpus=500000000
```

O limite de memória aparece em bytes (64 MB são 67108864) e o de CPU em bilionésimos de CPU (meia CPU são 500000000).

### Comandos essenciais

- `docker version`: confirma que o cliente e o servidor do Docker estão acessíveis.
- `docker run hello-world`: baixa a imagem (se preciso), cria e executa um container de teste.
- `docker ps`: lista os containers em execução.
- `docker ps --all` (ou `docker ps -a`): lista também os containers parados.
- `docker inspect nome`: mostra os metadados completos em JSON.
- `docker inspect --format '{{.State.Status}} {{.State.ExitCode}}' nome`: mostra só o estado e o código de saída.
- `docker rm nome`: remove um container parado.

### Mão na massa

1. Execute `docker run --name fundamentos hello-world`.
2. Rode `docker ps` e depois `docker ps --all`.
3. Observe que o container aparece apenas no segundo comando.
4. Inspecione seu status com `docker inspect --format '{{.State.Status}} {{.State.ExitCode}}' fundamentos`.
5. A saída esperada é `exited 0`. Remova-o com `docker rm fundamentos`.
6. Rode `docker run --rm alpine ps` e observe que o único processo listado tem PID 1: o container não enxerga os processos do host.
7. Rode `docker run --rm --hostname demo alpine hostname` e depois `docker run --rm alpine hostname`. Observe que o nome muda de um container para outro, e nenhum deles é o nome do seu computador.

### Dica

Quando um container "some" logo depois de `docker run`, não suponha defeito: rode `docker ps --all` e leia o `STATUS`. Um `Exited (0)` significa que o processo principal terminou normalmente, e um container só continua vivo enquanto esse processo continuar.

### Anota aí

> Container é um processo isolado e limitado pelo kernel; ele não é uma máquina virtual pequena.

---

## Etapa 02: Imagem, container e ciclo de vida

### O problema

Uma equipe precisa executar a mesma versão do Nginx em desenvolvimento, teste e produção. Instalar e configurar o programa manualmente em cada ambiente recria o problema de inconsistência. Também não basta copiar um container em execução, porque ele acumula estado temporário e não representa uma receita reproduzível.

### O conceito

Uma **imagem** reúne o sistema de arquivos e os metadados necessários para iniciar um processo. Ela é imutável e composta por camadas reutilizáveis. Um **container** acrescenta uma camada gravável temporária sobre a imagem e executa o comando configurado. A mesma imagem pode originar vários containers independentes, e remover um container não remove a imagem.

O fluxo básico é:

1. `docker pull` baixa uma imagem de um registry, como o Docker Hub.
2. `docker run` cria e inicia um container a partir da imagem.
3. `docker stop` solicita a parada do processo.
4. `docker start` reinicia o mesmo container.
5. `docker rm` remove o container.
6. `docker rmi` remove uma imagem que não está sendo usada.

Tags como `node:lts-alpine` ou `nginx:alpine` identificam variantes. Evite depender de `latest` em ambientes que precisam de reprodutibilidade, pois o conteúdo associado à tag pode mudar. Uma tag explícita (por exemplo, a versão principal) ajuda, embora uma tag ainda possa ser movida pelo mantenedor. Quando a exigência for imutabilidade forte, um **digest** (`imagem@sha256:...`) identifica o conteúdo da imagem com precisão.

Um **registry público** permite descobrir e baixar imagens públicas, muitas vezes sem autenticação. O Docker Hub é o exemplo mais conhecido e hospeda tanto software livre (Nginx, Node.js) quanto bases de sistema (Ubuntu, Alpine). Um **registry privado** restringe o acesso a imagens internas e exige autenticação com `docker login`. Empresas costumam combinar os dois: imagens comuns vêm do registry público, e as imagens que contêm o código proprietário ficam em repositórios internos, acessíveis apenas a quem é autorizado. Entre as opções de registry privado estão o Amazon Elastic Container Registry (ECR), o Azure Container Registry (ACR), o Google Artifact Registry (que substituiu o antigo Google Container Registry), e soluções auto-hospedadas como Harbor e JFrog Artifactory. Elas se integram a pipelines de CI/CD para automatizar a criação e a distribuição das imagens.

Use imagens públicas apenas quando forem confiáveis e verificadas, e guarde em repositórios privados tudo o que for sensível ou interno.

Antes de enviar uma imagem, o nome local precisa receber uma tag que inclua o endereço do registry, o namespace e a versão.

![Um container baseado na imagem ubuntu:15.04: quatro camadas de imagem somente leitura, com um cadeado, e por cima uma camada fina de leitura e escrita, a camada do container.](/guides/containers/etapa02-camada-container.webp "Um container é a imagem, em camadas somente leitura, mais uma camada gravável fina por cima. Tudo o que o container escreve vai para essa camada. | Diagramas: docs.docker.com, Docker, Inc., Apache 2.0")
![Quatro camadas finas de leitura e escrita, uma por container, todas apontando para as mesmas quatro camadas somente leitura da imagem ubuntu:15.04.](/guides/containers/etapa02-camadas-compartilhadas.webp "Vários containers da mesma imagem compartilham as camadas somente leitura, e cada um tem a sua camada gravável. Remover um container apaga só a camada dele.")

### Os conceitos-chave

- **Imagem**: modelo imutável, em camadas, usado para criar containers.
- **Container**: execução de uma imagem, com uma camada gravável temporária por cima.
- **Camada gravável**: onde o container grava durante a execução; ela desaparece quando o container é removido.
- **Registry**: servidor que armazena e distribui imagens (Docker Hub, ECR, ACR, Artifact Registry, Harbor).
- **Tag**: nome de versão de uma imagem; é mutável, e `latest` não garante reprodutibilidade.
- **Digest**: identificador do conteúdo exato da imagem.
- **Ciclo de vida**: `pull`, `run`, `stop`, `start`, `rm`, `rmi`.

### Exemplo comentado: servir uma página com Nginx

```sh
# Baixa explicitamente a variante Alpine da imagem oficial.
docker pull nginx:alpine

# Cria um container em segundo plano.
# O nome facilita os próximos comandos.
# A porta 8080 do host é encaminhada para a porta 80 do container.
docker run --detach --name pagina --publish 8080:80 nginx:alpine

# Lista os containers em execução.
docker ps

# Consulta o servidor dentro do container pela porta publicada no host.
curl http://localhost:8080

# Mostra as mensagens produzidas pelo processo do Nginx.
docker logs pagina

# Executa um comando em um container que já está em execução.
docker exec pagina nginx -v

# Encerra e remove o container.
docker stop pagina
docker rm pagina
```

Saída esperada, resumida:

```text
CONTAINER ID   IMAGE          PORTS                  NAMES
abc123         nginx:alpine   0.0.0.0:8080->80/tcp   pagina
<!DOCTYPE html>
<title>Welcome to nginx!</title>
nginx version: nginx/...
```

### Exemplo comentado: entrar, copiar arquivos e renomear

```sh
# Modo interativo: -i mantém a entrada aberta e -t aloca um terminal.
# O container termina quando você sair do shell.
docker run -it --name sandbox ubuntu bash
#   dentro do container:  cat /etc/os-release   e depois   exit

# Remove o container interativo.
docker rm sandbox

# Cria um container que fica vivo por 5 minutos.
docker run --detach --name caixa alpine sleep 300

# Copia um arquivo do host para dentro do container.
echo "ola do host" > nota.txt
docker cp nota.txt caixa:/tmp/nota.txt

# Abre um shell em um container que já está em execução.
docker exec -it caixa sh
#   dentro do container:  cat /tmp/nota.txt   e depois   exit

# Copia do container de volta para o host, com outro nome.
docker cp caixa:/tmp/nota.txt ./nota-copia.txt

# Renomeia o container e confirma.
docker rename caixa caixa-nova
docker ps --filter name=caixa-nova

# Limpa o laboratório.
docker rm --force caixa-nova
```

Saída esperada, resumida:

```text
PRETTY_NAME="Ubuntu ..."
ola do host
CONTAINER ID   IMAGE     COMMAND       ...   NAMES
abc123         alpine    "sleep 300"   ...   caixa-nova
```

Dependendo da versão, `docker cp` pode imprimir uma linha de confirmação. Os arquivos copiados para dentro de um container ficam na camada gravável e somem com ele; para persistir dados, use volumes (Etapa 05).

### Exemplo comentado: enviar uma imagem a um registry privado

```sh
# Autentica no registry privado.
# Use o prompt ou um token; não coloque a senha diretamente no histórico do shell.
docker login registry.exemplo.com

# Adiciona à imagem local o nome completo aceito pelo registry.
docker tag minha-api:1.1 registry.exemplo.com/equipe/minha-api:1.1

# Envia a imagem versionada para o repositório privado.
docker push registry.exemplo.com/equipe/minha-api:1.1
```

Saída esperada, resumida:

```text
Login Succeeded
1.1: digest: sha256:... size: ...
```

Esses comandos exigem uma conta e um registry reais. Em um registry público, a leitura pode ser anônima, mas o `push` continua exigindo permissão de escrita. A imagem `minha-api:1.1` é a que você constrói na Etapa 03.

Para ver o digest das imagens que você já tem localmente:

```sh
# Mostra a coluna DIGEST além de repositório, tag e tamanho.
docker images --digests nginx
```

Saída esperada, resumida:

```text
REPOSITORY   TAG      DIGEST            IMAGE ID   CREATED   SIZE
nginx        alpine   sha256:...        abc123     ...       ...MB
```

### Comandos essenciais

- `docker pull imagem:tag`: baixa uma imagem de um registry.
- `docker images`: lista as imagens locais.
- `docker run --detach --name nome --publish 8080:80 imagem:tag`: cria e inicia um container em segundo plano, publicando uma porta.
- `docker run -it imagem comando`: executa um container interativo (por exemplo, `docker run -it ubuntu bash`).
- `docker stop nome`: solicita a parada do processo principal.
- `docker start nome`: reinicia um container parado.
- `docker rm nome`: remove um container parado.
- `docker rm --force nome`: interrompe e remove imediatamente; use só com container descartável.
- `docker rmi imagem`: remove uma imagem local que nenhum container usa.
- `docker logs nome`: mostra a saída do processo principal.
- `docker exec -it nome comando`: executa um comando dentro de um container em execução (por exemplo, `docker exec -it meu-container bash`).
- `docker cp origem destino`: copia arquivos entre host e container, nos dois sentidos.
- `docker rename antigo novo`: renomeia um container.
- `docker login`, `docker tag`, `docker push`: autentica, nomeia e envia uma imagem a um registry.
- `docker container prune`, `docker image prune`, `docker system prune`: removem containers parados, imagens sem uso e todos os recursos não utilizados, respectivamente. Leia a lista que o Docker apresenta e confirme o escopo antes de aceitar.

### Mão na massa

1. Suba `nginx:alpine` na porta 8080 com o nome `ciclo`.
2. Confirme a resposta com `curl -I http://localhost:8080`. A primeira linha da saída deve ser `HTTP/1.1 200 OK`.
3. Pare o container e repita o `curl`. A conexão deve falhar, com uma mensagem como `curl: (7) Failed to connect to localhost port 8080`.
4. Execute `docker start ciclo` e confirme que a página voltou (`HTTP/1.1 200 OK` de novo).
5. Confirme que não há dado necessário somente dentro do container. Então remova-o com `docker rm --force ciclo`. Essa opção interrompe e remove a instância imediatamente, por isso não deve ser usada sem conferir o alvo.
6. Rode `docker images nginx` e observe que a imagem continua disponível mesmo sem nenhum container: remover o container não remove a imagem.
7. Garanta que o arquivo `nota.txt` existe na pasta atual (`echo "ola do host" > nota.txt`). Crie um container com `docker run --detach --name caixa alpine sleep 300`, copie o arquivo para ele com `docker cp nota.txt caixa:/tmp/nota.txt`, leia-o com `docker exec caixa cat /tmp/nota.txt` (a saída é `ola do host`) e remova o container com `docker rm --force caixa`. Em seguida crie outro com o mesmo `docker run` e rode de novo `docker exec caixa cat /tmp/nota.txt`. A saída esperada agora é `cat: can't open '/tmp/nota.txt': No such file or directory`, porque o arquivo ficou na camada gravável do container que foi removido. Remova o segundo container com `docker rm --force caixa`.

### Dica

Quando precisar reproduzir exatamente uma imagem, anote o digest com `docker images --digests` e referencie `imagem@sha256:...`. Tags como `latest` e até `stable` mudam de conteúdo com o tempo; digests não.

### Anota aí

> Imagem é o artefato reproduzível; container é uma execução descartável dessa imagem.

---

## Etapa 03: Dockerfile como receita reproduzível

### O problema

Baixar uma imagem pronta resolve ferramentas comuns, mas não empacota o código da sua aplicação. Copiar arquivos manualmente para um container em execução produz um ambiente impossível de reconstruir com confiança.

### O conceito

O **Dockerfile** é um arquivo de texto que descreve, de forma declarativa, o passo a passo para construir uma imagem: você diz o que quer e o Docker constrói. O comando `docker build` lê o Dockerfile e uma pasta de arquivos (o **contexto de build**, indicado no final do comando, normalmente `.`) e produz uma imagem.

As instruções essenciais são:

- `FROM`: escolhe a imagem base. Exemplo: `FROM node:lts-alpine` significa "comece a partir da imagem do Node em uma base Alpine".
- `WORKDIR`: define o diretório usado pelas instruções seguintes, para evitar caminhos longos em cada comando. Exemplo: `WORKDIR /app`.
- `COPY`: copia arquivos do contexto de build para dentro da imagem. Exemplo: `COPY . /app` copia tudo o que está no diretório atual para `/app`.
- `RUN`: executa uma ação durante a construção (instalar dependências, criar pastas) e grava o resultado como uma nova camada. Exemplo: `RUN npm install`.
- `CMD`: define o comando padrão executado quando o container inicia. Exemplo: `CMD ["node", "index.js"]`.
- `EXPOSE`: documenta a porta usada pela aplicação. Ela não publica a porta no host.

`RUN` acontece no build e grava uma camada na imagem. `CMD` acontece no runtime, quando um container é iniciado. Misturar esses dois momentos é uma fonte comum de erro. O `CMD` pode ser substituído na linha de comando do `docker run`.

A ordem das instruções importa porque o Docker guarda em cache o resultado de cada uma. Se você muda algo no topo, tudo o que vem abaixo é reconstruído; se muda apenas o `CMD`, o restante é reaproveitado. A Etapa 04 explora essa regra.

**O processo principal e os sinais.** O processo definido pelo `CMD` é o PID 1 do container. No Linux, o PID 1 não recebe o tratamento padrão de sinais: um sinal como SIGTERM ou SIGINT, que normalmente encerra um programa, é ignorado se o programa não instalou um tratador para ele, e o Node.js sem tratador explícito se enquadra nesse caso. O resultado é que o Ctrl+C no terminal pode não encerrar o container, e o `docker stop` espera o prazo (10 segundos por padrão) e então envia SIGKILL. A opção `--init` do `docker run` (e `init: true` no Compose) coloca um pequeno processo init como PID 1, que repassa os sinais ao seu programa. Por isso os exemplos de API deste guia usam `--init`. Para encerrar um container em primeiro plano, use o Ctrl+C no terminal dele ou, em outro terminal, `docker stop nome`. O código de saída 137 que resulta de um encerramento forçado por SIGKILL não indica, por si só, falta de memória; a Etapa 11 mostra como distinguir os dois casos.

![À esquerda, o Dockerfile com FROM, WORKDIR, COPY, RUN npm install e CMD, e o contexto de build; no centro, a imagem em camadas, com a camada de RUN npm install em destaque; à direita, depois de docker run, o container executando node index.js.](/guides/containers/etapa03-build-run.svg "O `docker build` executa o `RUN` uma vez e grava o resultado numa camada. O `CMD` fica guardado como metadado e só roda quando um container inicia, como PID 1. | Diagrama: feito para este guia")

### Os conceitos-chave

- **Dockerfile**: receita versionável que transforma decisões manuais em uma construção repetível.
- **`FROM`**: toda imagem começa em outra; a escolha da base determina tamanho, compatibilidade e superfície de ataque.
- **`WORKDIR`, `COPY`, `RUN`**: preparam o conteúdo da imagem durante o build.
- **`CMD`**: o processo principal do container, executado no runtime.
- **`EXPOSE`**: apenas documentação; quem publica a porta é `--publish` (ou `ports` no Compose).
- **Contexto de build**: a pasta enviada ao Docker no `docker build`; só o que está nela pode ser copiado.
- **Tag de build**: `--tag nome:versão` dá nome à imagem construída.
- **PID 1 e `--init`**: o processo principal não recebe o tratamento padrão de sinais; o init repassa o SIGTERM e o SIGINT ao programa.

### Exemplo comentado: uma aplicação sem dependências externas

Crie `server.js`:

```js
// Importa apenas o módulo HTTP incluído no Node.js.
const http = require("node:http");

// Lê a porta do ambiente e mantém 3000 como padrão local.
const port = Number(process.env.PORT || 3000);

// Cria uma resposta JSON simples para qualquer requisição.
const server = http.createServer((_request, response) => {
  response.writeHead(200, { "content-type": "application/json" });
  response.end(JSON.stringify({ status: "ok" }));
});

// Escuta em todas as interfaces do container.
server.listen(port, "0.0.0.0", () => {
  console.log(`Servidor disponível na porta ${port}`);
});
```

Crie `Dockerfile`:

```dockerfile
# Usa uma base pequena do Node; a tag lts-alpine acompanha a versão LTS vigente.
FROM node:lts-alpine

# Define o diretório de trabalho dentro da imagem.
WORKDIR /app

# Copia somente o arquivo necessário para este exemplo.
COPY server.js ./server.js

# Documenta a porta usada pela aplicação.
# EXPOSE não publica a porta no host.
EXPOSE 3000

# Define o processo principal do container.
CMD ["node", "server.js"]
```

Construa e execute:

```sh
# O ponto final é o contexto de build.
docker build --tag minha-api:1.0 .

# Publica a porta e remove o container quando ele terminar.
# --init coloca um init como PID 1, para que o Ctrl+C e o docker stop encerrem o Node.
docker run --rm --init --name minha-api --publish 3000:3000 minha-api:1.0
```

Saída esperada do `docker run`, que fica em primeiro plano ocupando o terminal:

```text
Servidor disponível na porta 3000
```

Em outro terminal:

```sh
curl http://localhost:3000
```

Saída esperada:

```json
{"status":"ok"}
```

Para encerrar, volte ao terminal do container e use Ctrl+C, ou rode em outro terminal:

```sh
# Pede a parada do container; com --init, o Node termina na hora.
docker stop minha-api
```

Como o container foi criado com `--rm`, ele é removido assim que para, e a porta 3000 fica livre.

### Exemplo comentado: a sequência clássica com dependências

O modelo abaixo é o padrão de uma aplicação Node.js com dependências npm. Ele precisa de um projeto real (`package.json` e `index.js`), por isso serve de referência de leitura, e a Etapa 04 mostra uma versão executável.

```dockerfile
# Base oficial na linha LTS do Node. Em produção, fixe a versão principal (por exemplo, node:22-alpine).
FROM node:lts-alpine

# Todos os comandos seguintes rodam dentro de /app.
WORKDIR /app

# Copia o projeto inteiro do contexto de build para /app.
COPY . /app

# Instala as dependências; o resultado fica salvo como uma camada nova.
RUN npm install

# Comando executado quando o container iniciar.
CMD ["node", "index.js"]
```

O `CMD` pode ser trocado na hora de executar, sem reconstruir a imagem:

```sh
# Os argumentos depois do nome da imagem substituem o CMD do Dockerfile.
docker run --rm minha-api:1.0 node -e "console.log('outro comando')"
```

Saída esperada:

```text
outro comando
```

### Comandos essenciais

- `docker build --tag nome:versão .`: constrói uma imagem a partir do Dockerfile do diretório atual.
- `docker build --file Dockerfile.dev --tag nome:dev .`: usa um Dockerfile com outro nome.
- `docker run --rm --init --publish 3000:3000 nome:versão`: executa e remove o container ao terminar, publicando a porta 3000 e usando um init como PID 1.
- `docker stop nome`: pede a parada de um container que está em primeiro plano em outro terminal.
- `docker run --rm nome:versão comando`: substitui o `CMD` por outro comando.
- `docker images nome`: lista as versões construídas de uma imagem.

### Mão na massa

1. Crie os dois arquivos do exemplo em um diretório vazio.
2. Construa `minha-api:1.0` e execute o container com `--init`, como no exemplo.
3. Em outro terminal, confirme a resposta com `curl http://localhost:3000` e encerre o container com `docker stop minha-api` (ou Ctrl+C no terminal dele). Confirme com `docker ps` que a porta 3000 ficou livre.
4. Troque o valor da resposta para `{"status":"pronto"}`.
5. Reconstrua com a tag `minha-api:1.1`.
6. Rode `docker images minha-api` e observe que as versões são imagens distintas.
7. Rode `docker run --rm minha-api:1.1 node -e "console.log('outro comando')"` e observe que o `CMD` foi substituído sem reconstruir nada.

### Dica

Guarde o Dockerfile no mesmo repositório do código. Assim, a receita da imagem é versionada junto com a aplicação, e um novo colega consegue reproduzir o ambiente com um único `docker build`.

### Anota aí

> Um Dockerfile transforma decisões manuais em uma construção repetível e versionável.

---

## Etapa 04: Camadas, cache, imagens mínimas e multistage build

### O problema

Um Dockerfile copia o projeto inteiro antes de instalar dependências. Qualquer mudança de uma linha invalida o cache e baixa tudo novamente. A imagem final também leva compiladores, caches e arquivos usados apenas no build. O resultado demora para construir, custa mais para transferir e oferece uma superfície de ataque maior.

### O conceito

O Docker armazena o resultado de cada instrução como uma camada. Se encontra uma camada idêntica à que já construiu, ele a reaproveita (aparece como `CACHED` no build). Isso só acontece enquanto a instrução e seus arquivos de entrada não mudam, e, quando uma camada é invalidada, todas as seguintes também são. Por isso arquivos de dependências devem ser copiados antes do restante do código: copie primeiro o mínimo necessário para instalar as dependências, rode a instalação e só depois copie o resto do projeto.

A mesma lógica vale para qualquer gerenciador de pacotes (npm, pip, yarn, pnpm, composer); mudam só os nomes dos arquivos. Use também o modo que respeita o lockfile (`npm ci`, `--frozen-lockfile`) para builds previsíveis.

Um **multistage build** usa uma etapa rica em ferramentas para construir o artefato e uma etapa final menor para executá-lo. Você abre um `FROM` para o build, instala dependências e compila, e depois abre um novo `FROM` limpo, copiando apenas o resultado com `COPY --from=`. Ferramentas de build, `node_modules` de desenvolvimento e arquivos temporários não vão para a imagem final.

Variantes comuns de imagem base:

- `slim`: base Debian reduzida, com boa compatibilidade. É um meio-termo entre peso e conveniência.
- `alpine`: distribuição mínima (poucos megabytes) que usa `musl` em vez da `glibc` e o gerenciador de pacotes `apk`. Faltam coisas que costumam vir por padrão, como `bash` e `curl`; instale-as com `apk add` quando precisar. Pode exigir ajustes para dependências nativas.
- `distroless`: contém apenas o necessário para executar a aplicação, sem shell, sem gerenciador de pacotes e sem utilitários. É excelente para produção do ponto de vista de segurança, mas exige um build muito bem feito e normalmente depende de multistage.

Menor nem sempre significa melhor. Para desenvolvimento, ou enquanto você ainda não sabe o que vai precisar, comece com uma imagem mais completa e "seque" depois que tudo funcionar. Para produção, quando você já sabe exatamente o que roda, `alpine` ou `slim` reduzem o tamanho final, o tempo de transferência e a superfície de ataque. A base deve ser compatível, atualizada e suficiente para diagnosticar e executar a aplicação.

O exemplo multistage a seguir copia apenas `/app/dist` para o runtime. Isso só funciona quando `dist` é autossuficiente ou quando a aplicação usa apenas módulos nativos do Node. Se o artefato importa pacotes de `node_modules`, a etapa final também precisa receber as dependências de produção, por exemplo com uma instalação `npm ci --omit=dev` própria. Multistage não autoriza deixar dependências necessárias para trás.

![As camadas de um Dockerfile: FROM ubuntu:latest, RUN apt-get, COPY main.c Makefile, WORKDIR e RUN make build, todas marcadas como em cache.](/guides/containers/etapa04-cache.png "Sem mudança nos arquivos, cada instrução reaproveita a camada já construída. | Diagramas: docs.docker.com, Docker, Inc., Apache 2.0")
![O mesmo Dockerfile: FROM e RUN apt-get continuam em cache, e COPY, WORKDIR e RUN make build aparecem em vermelho, sem cache.](/guides/containers/etapa04-cache-invalidado.png "Os arquivos copiados mudaram: o `COPY` perde o cache, e todas as instruções depois dele também. Por isso o que muda menos vem primeiro.")

### Os conceitos-chave

- **Camada**: resultado imutável de uma instrução; é a unidade de cache e de transferência.
- **Cache de build**: reaproveita camadas que não mudaram; uma camada invalidada invalida as seguintes.
- **Ordem por frequência de mudança**: o que muda pouco (dependências) vem antes do que muda muito (código).
- **Lockfile**: `package-lock.json` e equivalentes; com `npm ci` a instalação segue exatamente o que está nele.
- **`slim`, `alpine`, `distroless`**: três níveis de enxugamento, cada um com um custo de compatibilidade ou de diagnóstico.
- **Multistage build**: separa construir de executar; `COPY --from=etapa` traz só o artefato.

### Exemplo comentado: a ordem que quebra o cache e a ordem correta

```dockerfile
# ERRADO: copiar o projeto inteiro antes de instalar.
# Qualquer alteração em qualquer arquivo invalida o COPY, e o npm ci roda de novo.
FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm ci
```

```dockerfile
# CERTO: copiar primeiro só os arquivos que definem as dependências.
FROM node:lts-alpine
WORKDIR /app

# Esta camada só muda quando as dependências mudam.
COPY package.json package-lock.json ./

# npm ci só depende dos arquivos acima, então esta camada fica em cache.
RUN npm ci

# O código vem por último; alterá-lo não refaz a instalação.
COPY . .
```

O mesmo padrão em outros ecossistemas (trechos de modelo; cada um parte do seu próprio projeto):

```dockerfile
# Python: copia só a lista de dependências, instala, e depois copia o código.
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# PHP com Composer: manifesto e lockfile primeiro.
COPY composer.json composer.lock ./
RUN composer install
COPY . .

# Node com pnpm (o pnpm precisa estar disponível na imagem):
# manifesto e lockfile primeiro, e instalação travada no lockfile.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
```

### Exemplo comentado: separando construção e execução

Para tornar o teste reproduzível sem depender de um projeto anterior, crie uma pasta com o `server.js` da Etapa 03 e acrescente estes três arquivos, antes do Dockerfile.

`package.json`:

```json
{
  "name": "cache-demo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "node build.js"
  }
}
```

`package-lock.json` (permite que `npm ci` rode dentro do build sem exigir Node ou npm no host):

```json
{
  "name": "cache-demo",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "cache-demo",
      "version": "1.0.0"
    }
  }
}
```

`build.js`:

```js
// Usa somente módulos nativos, portanto o artefato final não depende de node_modules.
const fs = require("node:fs");

// Recria a pasta de saída e copia a aplicação como artefato executável.
fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist", { recursive: true });
fs.copyFileSync("server.js", "dist/index.js");
```

Agora o `Dockerfile` multistage, na mesma pasta:

```dockerfile
# Primeira etapa: possui o ambiente necessário para construir.
FROM node:lts-alpine AS build

WORKDIR /app

# Copiar manifestos primeiro preserva o cache quando só o código muda.
COPY package.json package-lock.json ./

# npm ci usa exatamente o lockfile e produz instalação reproduzível.
RUN npm ci

# O código entra depois das dependências.
COPY . .

# Gera o diretório dist da aplicação.
RUN npm run build

# Segunda etapa: contém somente o necessário para executar.
FROM node:lts-slim AS runtime

WORKDIR /app

# Copia o artefato pronto da etapa anterior.
COPY --from=build /app/dist ./dist

# Usa o usuário não privilegiado já presente na imagem oficial.
USER node

# Inicia o artefato, sem levar as ferramentas da etapa build.
CMD ["node", "dist/index.js"]
```

Construa a imagem:

```sh
docker build --tag minha-app:otimizada .
```

Saída esperada do build, resumida:

```text
=> [build ...] RUN npm ci
=> [build ...] RUN npm run build
=> [runtime ...] COPY --from=build /app/dist ./dist
=> naming to ... minha-app:otimizada
```

Na segunda construção, se apenas um arquivo do código mudar, a etapa `npm ci` deve aparecer como `CACHED`:

```text
=> CACHED [build ...] RUN npm ci
=> [build ...] COPY . .
=> [build ...] RUN npm run build
```

### Exemplo comentado: sentindo a diferença entre bases

```sh
# Alpine não traz bash: o which não encontra nada e o echo avisa.
docker run --rm alpine sh -c 'which bash || echo "sem bash"'

# A variante slim (Debian reduzido) mantém o bash.
docker run --rm node:lts-slim bash --version

# Em Alpine, pacotes extras vêm do apk; --no-cache evita guardar o índice na imagem.
docker run --rm alpine sh -c 'apk add --no-cache curl >/dev/null && curl --version | head -n 1'
```

Saída esperada, resumida:

```text
sem bash
GNU bash, version ...
curl ...
```

### Comandos essenciais

- `docker build --tag minha-app:otimizada .`: constrói a imagem; rode duas vezes e compare o uso de `CACHED`.
- `docker build --no-cache --tag minha-app:otimizada .`: ignora o cache, útil para confirmar que o build funciona do zero.
- `docker build --target build --tag minha-app:etapa-build .`: constrói somente até a etapa `build`, para inspecioná-la.
- `docker images minha-app`: compara o tamanho das imagens construídas.
- `docker run --rm --init --publish 3000:3000 minha-app:otimizada`: executa a imagem em primeiro plano; encerre com Ctrl+C ou `docker stop` em outro terminal.
- `apk add --no-cache pacote`: instala um pacote em uma base Alpine.

### Mão na massa

1. Crie uma pasta com o `server.js` da Etapa 03, o `package.json`, o `package-lock.json`, o `build.js` e o Dockerfile multistage desta etapa.
2. Confirme que o `package-lock.json` é exatamente o fornecido acima. Ele permite que `npm ci` rode dentro do build sem exigir Node ou npm no host.
3. Rode `docker build --tag minha-app:otimizada .` duas vezes.
4. Na segunda execução, observe `CACHED` nas etapas que não mudaram.
5. Altere apenas a mensagem de resposta em `server.js` e reconstrua.
6. Confirme que a etapa `npm ci` continuou em cache e teste com `docker run --rm --init --publish 3000:3000 minha-app:otimizada`, seguido de `curl http://localhost:3000` em outro terminal. Para encerrar, use Ctrl+C no terminal do container ou `docker stop` com o ID mostrado por `docker ps`, em outro terminal. Como o container foi criado sem `--name`, o Docker escolhe um nome aleatório; consulte-o em `docker ps`.
7. Troque a ordem das instruções para o formato "ERRADO" (um `COPY . .` antes do `npm ci`), altere `server.js` de novo e reconstrua. Observe que desta vez o `npm ci` roda novamente. Desfaça a troca.
8. Rode os três comandos de "sentindo a diferença entre bases" e anote o que está ausente no Alpine.

### Dica

Se uma imagem pequena quebrar em produção por causa de uma biblioteca nativa, o problema costuma ser a diferença de `musl` (Alpine) para `glibc` (Debian). Antes de culpar o código, teste a mesma aplicação sobre `slim`. E lembre que uma imagem `distroless` não tem shell: para diagnosticar, será preciso usar outros meios (logs, uma imagem de depuração separada).

### Anota aí

> Ordene camadas pela frequência de mudança e deixe ferramentas de construção fora da imagem de runtime.

---

## Etapa 05: Persistência com volumes, bind mounts e tmpfs

### O problema

Um banco grava dados no sistema de arquivos do container. Durante uma atualização, o container é removido e recriado. A imagem continua disponível, mas os dados da camada gravável desaparecem junto com o container.

### O conceito

A camada gravável do container é descartável por definição. Dados que precisam sobreviver à troca do container devem ficar em outro lugar, conectado a ele. O Docker oferece três mecanismos principais:

| Mecanismo | Administração | Persistência | Uso típico |
|---|---|---|---|
| Volume nomeado | Docker | Sim | Dados de aplicação e banco |
| Bind mount | Usuário e host | Sim | Código local em desenvolvimento |
| tmpfs | Memória do host | Não | Dados temporários ou sensíveis |

**Volume nomeado.** É a forma recomendada para produção. O Docker cria e registra o volume em seus metadados internos e o armazena, por padrão, no host em um caminho como `/var/lib/docker/volumes/<nome>/_data`; o que o container enxerga é esse diretório montado no caminho que você definiu (por exemplo, `/var/lib/mysql`). Pontos fortes: gerenciamento por comandos Docker, backup e migração mais simples, isolamento do restante do host. O caminho físico é um detalhe interno da Engine e pode variar conforme sistema e runtime, então prefira os comandos Docker em vez de manipular `/var/lib/docker` diretamente.

**Bind mount.** Aponta diretamente para um caminho específico do host, que o container enxerga exatamente como ele está, com todos os arquivos e permissões. É ótimo no desenvolvimento, porque você edita o código no host e o container vê a mudança em tempo real. Em contrapartida, não há isolamento (o container pode alterar o sistema de arquivos do host) e a portabilidade é limitada, porque depende da estrutura de pastas daquele computador.

**tmpfs.** Armazena os dados na memória do host. Ao parar ou reiniciar o container, tudo é perdido. É adequado para dados temporários ou sensíveis que, em geral, não devem ser gravados em disco (sob pressão de memória, o sistema pode mover páginas de tmpfs para a área de swap, então não o trate como garantia absoluta de que nada chega ao disco). `tmpfs` é um tipo de montagem, e não um driver de volume persistente.

**Drivers de volume.** O driver `local` é o padrão e usa o sistema de arquivos do host; atende bem à maioria dos casos e é o ponto de partida recomendado. Quando vários hosts precisam acessar o mesmo armazenamento, o volume pode usar NFS por meio do próprio driver `local` ou um plugin de terceiros compatível com o provedor (por exemplo, integrações com EBS, Azure Disk ou Ceph). Em ambientes com orquestrador na nuvem, drivers especializados ou plugins CSI no Kubernetes são as opções comuns. Essa escolha depende de rede, disponibilidade, permissões, backup e consistência exigida pela aplicação; só parta para ela se houver necessidade real de compartilhamento, persistência remota ou requisitos específicos de desempenho.

![Um container com três montagens: o volume nomeado dados-demo em /dados, guardado pelo Docker em /var/lib/docker/volumes/dados-demo/_data, que persiste; o bind mount ./site em /usr/share/nginx/html, uma pasta do host, que persiste; e o tmpfs em /dados, na memória do host, que some no restart.](/guides/containers/etapa05-montagens.svg "Cada mecanismo guarda o dado num lugar diferente do host. O volume é gerenciado pelo Docker, o bind mount é uma pasta sua sem isolamento, e o tmpfs fica na memória e some quando o container reinicia. | Diagrama: feito para este guia")

### Os conceitos-chave

- **Camada gravável**: efêmera; some com o container.
- **Volume nomeado**: armazenamento administrado pelo Docker, independente do ciclo de vida do container.
- **Bind mount**: um caminho do host montado dentro do container; conveniente, porém acoplado ao host.
- **tmpfs**: montagem em memória, sem persistência.
- **Driver `local`**: persiste no host em que o Docker está rodando.
- **Volume remoto (NFS ou plugin)**: permite compartilhar armazenamento entre hosts, com complexidade extra.
- **`:ro`**: sufixo que monta o caminho como somente leitura.

### Exemplo comentado: dados sobrevivem ao container

```sh
# Cria um volume administrado pelo Docker.
docker volume create dados-demo

# Escreve um arquivo dentro do volume e remove o container ao terminar.
docker run --rm \
  --volume dados-demo:/dados \
  alpine sh -c 'echo persistiu > /dados/mensagem.txt'

# Um novo container lê o mesmo volume.
docker run --rm \
  --volume dados-demo:/dados:ro \
  alpine cat /dados/mensagem.txt

# Exibe metadados do volume.
docker volume inspect dados-demo
```

Saída esperada:

```text
persistiu
```

O sufixo `:ro` monta o volume como somente leitura no segundo container.

### Exemplo comentado: bind mount para editar sem reconstruir

```sh
# Cria uma pasta local com uma página.
mkdir -p site
echo '<h1>ola</h1>' > site/index.html

# Monta a pasta local no diretório servido pelo Nginx (somente leitura para o container).
docker run --detach --name bind-demo --publish 8080:80 \
  --volume "$(pwd)/site:/usr/share/nginx/html:ro" \
  nginx:alpine

# Lê a página.
curl http://localhost:8080

# Edita o arquivo NO HOST e lê de novo, sem reconstruir nem reiniciar nada.
echo '<h1>editado</h1>' > site/index.html
curl http://localhost:8080

# Limpa o laboratório.
docker rm --force bind-demo
```

Saída esperada:

```text
<h1>ola</h1>
<h1>editado</h1>
```

### Exemplo comentado: tmpfs

```sh
# Sobe um container que fica vivo, com /dados montado como tmpfs.
# --init evita que o sleep, como PID 1, ignore o pedido de parada do restart.
docker run --detach --init --name tmp-demo --tmpfs /dados alpine sleep 300

# Grava e lê um arquivo dentro do container.
docker exec tmp-demo sh -c 'echo x > /dados/a && cat /dados/a'

# Reinicia o MESMO container: o tmpfs é recriado vazio.
docker restart tmp-demo

# Lista o conteúdo de /dados depois do restart.
docker exec tmp-demo ls -A /dados

# Limpa o laboratório.
docker rm --force tmp-demo
```

Saída esperada:

```text
x
```

O primeiro `exec` imprime `x`. O segundo, depois do restart, não imprime nada: o diretório está vazio, e é isso que prova que o dado em tmpfs não sobrevive nem a um simples reinício do mesmo container. Para comparar, repita o roteiro com `--volume dados-demo:/dados` no lugar de `--tmpfs /dados`: depois do restart, o arquivo continua lá.

### Exemplo comentado: volume remoto NFS (somente leitura de estudo)

```sh
# Exemplo de volume remoto NFS.
# Substitua endereço e caminho por um servidor NFS realmente acessível.
docker volume create \
  --driver local \
  --opt type=nfs \
  --opt o=addr=192.168.1.100,rw \
  --opt device=:/dados/aplicacao \
  dados-remotos
```

Saída esperada quando o volume é registrado:

```text
dados-remotos
```

Criar o recurso não prova que o servidor remoto está acessível. A montagem efetiva ocorre quando um container usa o volume, e pode falhar por rede, export NFS ou permissão. Em orquestradores, drivers e plugins próprios da plataforma assumem esse papel.

### Comandos essenciais

- `docker volume create nome`: cria um volume (com o driver `local` por padrão).
- `docker volume create --driver local nome`: escolhe o driver explicitamente na criação.
- `docker volume ls`: lista os volumes.
- `docker volume inspect nome`: mostra driver, ponto de montagem e metadados.
- `docker volume rm nome`: remove o volume de forma permanente.
- `docker run --volume nome:/caminho imagem` (ou `-v nome:/caminho`): monta um volume nomeado.
- `docker run --volume /caminho/do/host:/caminho imagem`: cria um bind mount.
- `docker run --tmpfs /caminho imagem`: monta um tmpfs.
- `docker restart nome`: reinicia o mesmo container; o tmpfs volta vazio.

### Mão na massa

1. Execute os comandos do primeiro exemplo (volume `dados-demo`).
2. Confirme que o primeiro container não existe mais com `docker ps --all`.
3. Leia o arquivo usando um segundo container.
4. Prove que o tmpfs não sobrevive ao reinício: rode o exemplo do tmpfs (`docker run --detach --init --name tmp-demo --tmpfs /dados alpine sleep 300`, grave com `docker exec tmp-demo sh -c 'echo x > /dados/a'`, rode `docker restart tmp-demo` e liste com `docker exec tmp-demo ls -A /dados`). A listagem deve sair vazia. Remova o container com `docker rm --force tmp-demo`.
5. Rode o exemplo do bind mount e confirme que a edição feita no host aparece na resposta sem reiniciar o container.
6. Confirme que o volume contém apenas dados de laboratório. Então execute `docker volume rm dados-demo`. A remoção é permanente e não oferece lixeira ou recuperação automática.

### Dica

Para qualquer dado que não possa ser perdido (banco de dados, uploads), use volume nomeado. Reserve o bind mount para o código que você edita durante o desenvolvimento, e lembre que um bind mount em produção amarra a aplicação à estrutura de pastas daquele servidor.

### Anota aí

> Se um dado precisa sobreviver ao container, ele não pode depender da camada gravável desse container.

---

## Etapa 06: Redes, DNS interno e publicação de portas

### O problema

Uma API precisa acessar um banco. Usar o IP atual do container funciona até ele ser recriado e receber outro endereço. Publicar a porta do banco no host resolve o acesso, mas expõe um serviço que deveria ser interno.

### O conceito

Cada container recebe seu próprio namespace de rede e um IP próprio dentro de uma rede Docker. Quando você cria uma **rede personalizada** com `docker network create`, o Docker habilita nela um **DNS interno**: cada container conectado pode ser encontrado pelo nome definido em `--name`. A API se conecta ao banco usando o hostname `banco`, sem IP fixo; uma aplicação Node.js falaria com um MongoDB apenas apontando a URI para `mongodb://mongo:27017`, desde que o container se chame `mongo` e ambos estejam na mesma rede.

As redes personalizadas também são isoladas por padrão: só containers conectados à mesma rede se enxergam. Isso permite isolar bancos de dados, separar ambientes (dev e prod) e reduzir a superfície de ataque. Containers podem ser conectados e desconectados de redes a qualquer momento, o que dá controle fino sobre quem conversa com quem. A mesma lógica de redes é usada pelo Docker Compose (Etapa 07) e por orquestradores como o Kubernetes.

Os modos de rede são:

- `bridge`: rede isolada no mesmo host, com IP por container. Redes bridge criadas pelo usuário oferecem resolução automática por nome. É o modo do dia a dia, indicado para desenvolvimento local e ambientes simples em um só host.
- `host`: o container compartilha a pilha de rede do host, sem NAT e sem IP próprio. Dá mais desempenho e acesso direto à rede do host (útil para monitoramento e proxies locais), mas elimina o isolamento de rede e pode causar conflito de portas.
- `none`: desabilita a conectividade de rede do container. Útil para testes e cargas que não devem se comunicar com nada.
- `overlay`: conecta containers em hosts diferentes, usado com o Docker Swarm. Outras redes avançadas (como `macvlan`) existem para cenários específicos de orquestração e ficam fora deste guia.

A rede `bridge` padrão (a que o container recebe quando você não especifica nada) e uma bridge criada pelo usuário não são equivalentes. O DNS por nome de container é uma vantagem da rede personalizada. Na bridge padrão, não dependa dessa descoberta automática.

Descoberta por nome é diferente de acesso externo. `EXPOSE 3000` documenta uma porta na imagem. `--publish 8080:3000` cria o encaminhamento da porta 8080 do host para a porta 3000 do container. Para serviços que só outros containers acessam (como o banco), não publique nada.

DNS não transmite dados nem autentica participantes: ele só resolve nomes para endereços. Isolamento, criptografia e autorização exigem mecanismos próprios.

![No host, a rede personalizada minha-rede com frontend e banco: o frontend chega ao banco pelo nome, via DNS interno, e só o frontend recebe tráfego do navegador pela porta publicada 8080:80. Embaixo, na bridge padrão, cliente-padrao não resolve o nome alvo.](/guides/containers/etapa06-redes.svg "Na rede personalizada, o DNS interno resolve o nome do container, e só o que tem `--publish` recebe tráfego de fora. Na bridge padrão não há resolução por nome. | Diagrama: feito para este guia")

### Os conceitos-chave

- **Rede bridge personalizada**: isola um grupo de containers e oferece DNS por nome.
- **DNS interno**: traduz o nome do container para o IP atual dele.
- **`host`**: sem isolamento de rede; só para casos específicos.
- **`none`**: sem rede alguma.
- **`overlay`**: rede entre hosts, pertencente ao universo do Swarm.
- **Publicação de porta (`--publish`)**: abre um acesso do host para um container; sem ela, o serviço só é visível dentro da rede.
- **`EXPOSE`**: documentação na imagem, sem efeito de publicação.
- **`docker network connect` e `disconnect`**: ligam um container que já está em execução a uma rede, ou o desligam dela.

### Exemplo comentado: descoberta por nome

```sh
# Cria uma bridge com DNS interno.
docker network create rede-demo

# Inicia um servidor chamado web nessa rede.
docker run --detach --name web --network rede-demo nginx:alpine

# Um container temporário resolve o hostname web e faz uma requisição.
docker run --rm --network rede-demo curlimages/curl \
  --silent --head http://web

# Mostra quais containers estão conectados.
docker network inspect rede-demo

# Limpa os recursos do exercício.
docker rm --force web
docker network rm rede-demo
```

Saída esperada, resumida:

```text
HTTP/1.1 200 OK
Server: nginx/...
```

Nenhuma porta foi publicada. A comunicação aconteceu internamente, pelo hostname `web`.

### Exemplo comentado: isolar o banco e expor só a fachada

```sh
# Rede privada do projeto.
docker network create minha-rede

# O banco entra na rede e NÃO publica porta nenhuma.
docker run --detach --name banco --network minha-rede \
  --env POSTGRES_PASSWORD=exemplo-local postgres:16-alpine

# O frontend entra na mesma rede e publica a porta 8080 para o host,
# encaminhada para a porta 80 do container.
docker run --detach --name frontend --network minha-rede \
  --publish 8080:80 nginx:alpine

# Confirma qual porta do host aponta para qual porta do container.
docker port frontend

# Dentro da rede, o frontend resolve o nome "banco" para o IP do container do banco.
docker exec frontend nslookup banco

# Limpa o laboratório.
docker rm --force frontend banco
docker network rm minha-rede
```

Saída esperada, aproximada:

```text
80/tcp -> 0.0.0.0:8080
Name:      banco
Address:   172.x.x.x
```

O IP varia. O `docker port` pode imprimir também uma segunda linha para IPv6 (`80/tcp -> [::]:8080`). O banco só é alcançável de dentro da rede `minha-rede`; do seu terminal, `localhost:5432` não responde, porque a porta nunca foi publicada.

### Exemplo comentado: a bridge padrão não resolve nomes

```sh
# Sem --network, os dois containers entram na bridge padrão.
docker run --detach --name alvo nginx:alpine
docker run --detach --name cliente-padrao alpine sleep 300

# O nome "alvo" não é resolvido na bridge padrão.
docker exec cliente-padrao wget -qO- http://alvo

# Limpa o laboratório.
docker rm --force alvo cliente-padrao
```

Saída esperada, aproximada:

```text
wget: bad address 'alvo'
```

### Exemplo comentado: os modos none e host

```sh
# none: o container só tem a interface de loopback (lo).
docker run --rm --network none alpine ip addr

# host (Linux com Docker Engine): o container enxerga as interfaces do próprio host.
docker run --rm --network host alpine ip addr
```

No primeiro comando a saída lista apenas `lo`. No segundo, aparecem as interfaces reais do host (por exemplo `eth0`). No Docker Desktop, o comportamento do modo `host` difere, porque o container roda dentro de uma VM.

### Comandos essenciais

- `docker network create nome`: cria uma rede bridge personalizada (equivale a `--driver bridge`).
- `docker network ls`: lista as redes.
- `docker network inspect nome`: mostra quais containers estão conectados e seus IPs.
- `docker run --network nome imagem`: inicia um container já conectado à rede.
- `docker network connect nome container`: conecta um container existente à rede.
- `docker network disconnect nome container`: desconecta um container da rede.
- `docker network rm nome`: remove a rede (nenhum container pode estar usando-a).
- `docker run --publish host:container imagem` (ou `-p`): publica uma porta.
- `docker run --network host imagem` e `docker run --network none imagem`: modos host e none.
- `docker port nome`: mostra as portas publicadas de um container.

### Mão na massa

1. Rode o primeiro exemplo (`rede-demo`) sem os dois comandos de limpeza do final (`docker rm --force web` e `docker network rm rede-demo`), porque os passos seguintes ainda precisam do container `web` e da rede. Confirme o status `HTTP/1.1 200 OK`.
2. Execute `docker run --rm curlimages/curl --head http://web`, sem `--network rede-demo`.
3. Observe a falha de resolução, pois o novo container está fora da rede. A saída esperada é `curl: (6) Could not resolve host: web`.
4. Crie um cliente com `docker run --detach --name cliente alpine sleep 300`.
5. Conecte-o com `docker network connect rede-demo cliente`.
6. Prove a descoberta por nome com `docker exec cliente wget -qO- http://web`. A saída deve conter o HTML de boas-vindas do Nginx (`<title>Welcome to nginx!</title>`).
7. Inspecione as conexões com `docker network inspect rede-demo` e localize `web` e `cliente` na lista de containers.
8. Desconecte o cliente com `docker network disconnect rede-demo cliente`, repita o `wget` e observe que a resolução falha de novo, com `wget: bad address 'web'`.
9. Confira os nomes e remova os containers de laboratório com `docker rm --force cliente web`; depois remova a rede com `docker network rm rede-demo`. `--force` encerra os containers sem a parada normal e só é apropriado aqui porque ambos são descartáveis.
10. Rode o exemplo "a bridge padrão não resolve nomes" e compare o erro (`wget: bad address 'alvo'`) com o sucesso do passo 6.

### Dica

Para expor um serviço só ao seu computador (por exemplo, enquanto desenvolve), publique no endereço de loopback: `--publish 127.0.0.1:8080:80`. Assim a porta não fica acessível para outras máquinas da rede.

### Anota aí

> Containers na mesma rede personalizada se encontram pelo nome; publique somente as portas que precisam ser acessadas pelo host.

---

## Etapa 07: Docker Compose para aplicações multicontainer

### O problema

Subir API, banco, rede e volume com vários comandos funciona até alguém esquecer uma flag, usar um nome diferente ou executar os passos na ordem errada. O ambiente deixa de ser uma configuração versionável e vira uma sequência oral de instruções.

### O conceito

O Docker Compose descreve uma aplicação inteira em um único arquivo YAML (por padrão `compose.yaml`; o nome mais antigo `docker-compose.yml` continua aceito). Com um comando você sobe, observa e derruba todos os containers, redes e volumes. O Compose cria automaticamente uma rede para o projeto, e os serviços se encontram pelo nome do serviço (`db`, `web`), com a mesma lógica de DNS da Etapa 06. O nome do projeto é, por padrão, o nome da pasta, e os containers recebem nomes como `projeto-web-1`.

Os elementos principais do arquivo são:

- `services`: os containers que formam a aplicação.
- `build` ou `image`: como obter a imagem de cada serviço.
- `ports`: portas publicadas no host.
- `volumes`: persistência ou compartilhamento de arquivos.
- `networks`: limites de comunicação.
- `environment` e `env_file`: configuração não secreta.
- `secrets`: arquivos montados para dados sensíveis (Etapa 10).
- `init`: `init: true` executa um init como PID 1 do serviço, equivalente ao `--init` do `docker run` (Etapa 03).

Em vez de `image:`, um serviço pode usar um bloco `build:` para ser construído localmente antes de subir. Três campos dão controle sobre isso: `context` (a pasta usada como base do build), `dockerfile` (qual arquivo usar, útil para `Dockerfile.dev` e `Dockerfile.prod`) e `args` (parâmetros de build declarados com `ARG` no Dockerfile). Isso evita acumular Dockerfiles quase idênticos e permite que qualquer pessoa clone o repositório e rode `docker compose up` com builds adaptados ao fluxo do time.

O Compose não resolve tudo sozinho. Ele interpreta a definição e coordena recursos Docker, mas a aplicação ainda precisa lidar corretamente com inicialização, falhas transitórias e dependências. `depends_on` garante a ordem de criação, e não que o banco esteja pronto; a prontidão é tratada com healthchecks nas Etapas 08 e 12.

![Um usuário externo chega pela porta 443 ao serviço de frontend, que fala com o serviço de backend por uma rede; o backend grava num volume persistente, e a configuração HTTP e o certificado do servidor são montados só leitura no frontend.](/guides/containers/etapa07-compose-aplicacao.webp "Uma aplicação Compose reúne serviços, a rede entre eles, o volume que persiste os dados e os arquivos montados, tudo descrito num só arquivo. | Diagrama: docs.docker.com, Docker, Inc., Apache 2.0")

### Os conceitos-chave

- **Arquivo Compose**: descrição versionável de serviços, redes e volumes.
- **Serviço**: um container (ou um grupo de réplicas) definido no arquivo.
- **Rede do projeto**: criada automaticamente; o nome do serviço funciona como hostname.
- **`build` (`context`, `dockerfile`, `args`)**: constrói a imagem do serviço localmente.
- **`depends_on`**: ordem de criação, e não prontidão.
- **`init: true`**: coloca um init como PID 1, para que o `docker compose down` encerre o serviço Node sem esperar o prazo.
- **Volume declarado**: o bloco `volumes:` do arquivo cria o volume nomeado usado pelos serviços.
- **`docker compose config`**: mostra a configuração consolidada e acusa erros de YAML.

### Exemplo comentado: web e banco

```yaml
services:
  web:
    # Constrói usando o Dockerfile do diretório atual.
    build:
      context: .
      dockerfile: Dockerfile
    # Executa um init como PID 1, para que o Node receba o SIGTERM e o down seja rápido.
    init: true
    # Publica apenas o serviço que recebe tráfego externo.
    ports:
      - "3000:3000"
    # O hostname db será resolvido pelo DNS da rede do Compose.
    environment:
      DB_HOST: db
    # Expressa a dependência de criação, não a prontidão do banco.
    depends_on:
      - db

  db:
    # Fixa a versão principal da imagem oficial.
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: exemplo-local
    # Persiste os dados fora do ciclo de vida do container.
    volumes:
      - dados_db:/var/lib/postgresql/data

# Declara o volume nomeado usado pelo banco.
volumes:
  dados_db:
```

Comandos:

```sh
# Constrói imagens e inicia os serviços em segundo plano.
docker compose up --detach --build

# Mostra o estado da aplicação.
docker compose ps

# Acompanha logs dos serviços.
docker compose logs --follow

# Encerra containers e redes, preservando o volume.
docker compose down
```

Saída esperada, resumida:

```text
NAME          IMAGE                SERVICE   STATUS
projeto-db-1  postgres:16-alpine   db        Up
projeto-web-1 projeto-web          web       Up
```

O prefixo `projeto` é o nome da pasta onde está o `compose.yaml`. Na pasta `etapa07/`, os nomes serão `etapa07-db-1` e `etapa07-web-1`, e o volume será `etapa07_dados_db`.

Fixe a versão principal do Postgres e mantenha-a: os arquivos de dados de uma versão principal não são compatíveis com outra, então trocar de `16` para uma versão mais nova sobre o mesmo volume exige um procedimento de migração.

### Exemplo comentado: build com Dockerfile alternativo e argumentos

```yaml
services:
  frontend:
    build:
      # Pasta usada como base do build (e como contexto enviado ao Docker).
      context: ./frontend
      # Arquivo específico para o ambiente de desenvolvimento.
      dockerfile: Dockerfile.dev
      # Parâmetros de build, lidos pelas instruções ARG do Dockerfile.
      args:
        REACT_APP_API_URL: "http://localhost:3000"
```

Para os `args` terem efeito, o Dockerfile precisa declarar o parâmetro:

```dockerfile
# Declara o parâmetro; sem esta linha, o valor passado pelo Compose é ignorado.
ARG REACT_APP_API_URL
```

Este exemplo é um modelo de leitura (precisa de uma pasta `frontend` real). Quando um argumento não é consumido por nenhum `ARG`, o Docker avisa que "um ou mais build-args não foram consumidos".

### Comandos essenciais

- `docker compose config`: valida o arquivo e mostra a configuração consolidada.
- `docker compose config --quiet`: apenas valida, sem imprimir.
- `docker compose up --detach --build`: constrói (se preciso) e inicia em segundo plano.
- `docker compose ps`: lista os containers do projeto e seu estado.
- `docker compose logs --follow`: acompanha os logs de todos os serviços (ou de um, com `docker compose logs db`).
- `docker compose exec serviço comando`: executa um comando dentro de um serviço em execução.
- `docker compose stop serviço` e `docker compose start serviço`: param e retomam um serviço.
- `docker compose down`: remove containers e redes, preservando os volumes.
- `docker compose down --volumes`: remove também os volumes, apagando os dados; só use quando a perda for intencional.

### Mão na massa

1. Salve o exemplo como `compose.yaml` ao lado do `Dockerfile` e do `server.js` da Etapa 03.
2. Rode `docker compose config` antes de iniciar. Esse comando mostra a configuração consolidada e detecta erros de YAML.
3. Execute `docker compose up --detach --build`.
4. Consulte `docker compose ps` e `docker compose logs db`.
5. De dentro do serviço `web`, confirme a descoberta por nome do banco com `docker compose exec web nslookup db`. A saída deve mostrar o nome `db` e um endereço IP interno.
6. Finalize com `docker compose down`. Não use `--volumes` se quiser preservar os dados. Depois rode `docker volume ls` e observe que o volume do banco continua lá, com o nome `<pasta>_dados_db`.

### Dica

Rode `docker compose config` sempre que editar o YAML, antes de `up`. Ele pega erros de indentação e mostra os valores finais (variáveis expandidas, arquivos combinados), o que poupa muita tentativa e erro.

### Anota aí

> Compose transforma uma sequência frágil de comandos em uma definição versionável da aplicação.

---

## Etapa 08: Ambientes, reinício, escala e CI

### O problema

Desenvolvimento precisa de bind mount e logs detalhados. Produção precisa de imagem pronta e menos exposição. Copiar todo o Compose para cada ambiente cria arquivos quase iguais que divergem com o tempo. Além disso, um processo pode falhar temporariamente e não voltar sozinho, e uma pipeline de testes precisa de um ambiente descartável parecido com o real.

### O conceito

**Vários arquivos Compose.** O Compose combina arquivos na ordem fornecida por `-f`, e os posteriores sobrepõem os anteriores, desde que os serviços mantenham o mesmo nome. Um arquivo de produção pode substituir somente imagem, portas ou variáveis necessárias, sem duplicar o YAML base:

```sh
docker compose \
  -f compose.yaml \
  -f compose.prod.yaml \
  config
```

Use `config` para conferir o resultado antes de subir. Por padrão, `docker compose up` (sem `-f`) carrega automaticamente `compose.yaml` e, se existir, `compose.override.yaml` (nos nomes antigos, `docker-compose.yml` e `docker-compose.override.yml`). Isso torna o override o lugar natural dos ajustes de desenvolvimento. Ao usar `-f` explicitamente, somente os arquivos listados são carregados.

**Políticas de reinício:**

- `no` (padrão): não reinicia automaticamente.
- `on-failure`: reinicia quando o processo termina com código diferente de zero; aceita um limite de tentativas (`on-failure:3`).
- `always`: tenta manter o container ativo, qualquer que seja o motivo da parada.
- `unless-stopped`: semelhante a `always`, mas respeita uma parada manual.

Não coloque `always` em tudo: entenda o papel de cada serviço. Um banco costuma ficar bem com `unless-stopped`; uma API que depende do banco pode usar `on-failure` com limite, para evitar laços infinitos quando o erro é de configuração; um consumidor de fila que deve estar sempre ativo pode usar `always`. Política de reinício não resolve ordem de inicialização nem garante que uma dependência esteja pronta. Para prontidão, combine `healthcheck` e dependências condicionadas (`depends_on` com `condition: service_healthy`) quando sua versão do Compose oferecer suporte, e mantenha retentativas na própria aplicação.

**Escala.** `docker compose up --scale worker=3` cria réplicas de um serviço. Cada réplica é uma instância independente, e um mapeamento fixo de porta como `8080:3000` impede várias réplicas no mesmo host, porque a porta 8080 só pode ser ocupada uma vez. Réplicas atrás de uma porta única exigem um balanceador na frente delas.

**CI (integração contínua).** A mesma definição que roda na máquina de quem desenvolve pode ser usada numa pipeline: subir as dependências (por exemplo, aplicação Node.js e um banco Postgres), rodar os testes de integração e remover tudo. Isso traz consistência entre o ambiente local e a esteira de build, evita depender de serviços externos ou de mocks para tudo e aproxima o ambiente de testes do de produção. O Compose funciona em praticamente qualquer provedor de CI (GitHub Actions, GitLab CI, Bitbucket, Jenkins).

![O compose.yaml com web usando nginx:alpine, restart on-failure:3 e healthcheck, mais o compose.prod.yaml com web usando nginx:stable-alpine, resultam num config em que web usa nginx:stable-alpine e mantém o restart e o healthcheck.](/guides/containers/etapa08-override.svg "Com `-f`, o arquivo seguinte sobrepõe o anterior no serviço de mesmo nome: só a imagem muda, e o resto vem do arquivo base. Confira sempre com `config`. | Diagrama: feito para este guia")

### Os conceitos-chave

- **Override**: arquivo que altera só o que varia entre ambientes.
- **`-f` múltiplo**: define explicitamente quais arquivos combinar e em qual ordem.
- **`restart`**: reação a encerramentos do processo; não substitui verificação de prontidão.
- **`on-failure:N`**: reinicia no máximo N vezes após falhas.
- **`--scale`**: cria réplicas; porta fixa no host limita a uma réplica.
- **`--wait`**: faz o `up` aguardar até os serviços com healthcheck ficarem saudáveis.
- **CI com Compose**: ambiente descartável, subir, testar e derrubar.

### Exemplo comentado: base e produção

`compose.yaml`:

```yaml
services:
  web:
    # Usa uma imagem pública para que o exemplo rode sem projeto externo.
    image: nginx:alpine
    # Reinicia somente diante de falha do processo, até três vezes.
    restart: on-failure:3
    labels:
      ambiente: desenvolvimento
    healthcheck:
      # wget já existe nesta variante da imagem.
      test: ["CMD", "wget", "--quiet", "--spider", "http://localhost"]
      interval: 5s
      timeout: 2s
      retries: 5
```

`compose.prod.yaml`:

```yaml
services:
  web:
    # O arquivo adicional troca o canal da imagem e o ambiente.
    image: nginx:stable-alpine
    labels:
      ambiente: producao
```

Saída esperada de `docker compose -f compose.yaml -f compose.prod.yaml config`, resumida (a saída real traz também outros campos, como `name`, redes e o healthcheck completo):

```yaml
services:
  web:
    image: nginx:stable-alpine
    restart: on-failure:3
    labels:
      ambiente: producao
```

### Exemplo comentado: override automático para desenvolvimento

Com o `compose.yaml` acima, crie `compose.override.yaml` ao lado dele:

```yaml
services:
  web:
    # Publica a porta apenas no ambiente de desenvolvimento.
    ports:
      - "8080:80"
    # Monta a pasta local para editar sem reconstruir.
    volumes:
      - ./site:/usr/share/nginx/html:ro
```

```sh
# Prepara a pasta com uma página.
mkdir -p site && echo '<h1>dev</h1>' > site/index.html

# Sem -f: o Compose carrega compose.yaml e compose.override.yaml sozinho.
docker compose config

# Sobe e consulta.
docker compose up --detach --wait
curl http://localhost:8080

# Com -f explícito, o override NÃO é carregado: a porta 8080 deixa de aparecer.
docker compose -f compose.yaml config

docker compose down
```

Saída esperada do `curl`:

```text
<h1>dev</h1>
```

### Exemplo comentado: reinício e escala

```yaml
# Ambos os serviços usam uma imagem pública e não exigem projeto externo.
services:
  falhador:
    image: alpine
    # Imprime uma linha e termina com erro (código 1).
    command: sh -c 'echo tentativa; exit 1'
    # Reinicia até 3 vezes e depois desiste.
    restart: on-failure:3

  worker:
    image: alpine
    # Fica vivo por 5 minutos; sem porta publicada, aceita várias réplicas.
    command: sleep 300
```

```sh
# Sobe tudo com 3 réplicas do worker.
docker compose up --detach --scale worker=3

# Mostra worker-1, worker-2 e worker-3 em execução.
docker compose ps

# Depois de alguns segundos, o falhador esgota as tentativas e fica parado.
# RestartCount indica quantas vezes o Docker o reiniciou.
docker inspect --format '{{.State.Status}} reinicios={{.RestartCount}}' $(docker compose ps --all -q falhador)

# Cada tentativa deixou uma linha nos logs.
docker compose logs falhador

docker compose down
```

Saída esperada, aproximada:

```text
NAME               SERVICE   STATUS
pasta-worker-1     worker    Up ...
pasta-worker-2     worker    Up ...
pasta-worker-3     worker    Up ...
exited reinicios=3
falhador-1  | tentativa
falhador-1  | tentativa
falhador-1  | tentativa
falhador-1  | tentativa
```

O `docker compose ps` lista as três réplicas do `worker` (e, dependendo do momento, o `falhador` reiniciando ou já parado), com o nome da sua pasta no lugar de `pasta`. São quatro linhas de `tentativa`: a execução original e os três reinícios. Se você publicasse uma porta fixa no `worker` (por exemplo, `"8080:80"`) e pedisse três réplicas, a segunda falharia com um erro do tipo "port is already allocated".

### Exemplo comentado: o mesmo Compose em CI

```sh
#!/bin/sh
# ci.sh: roteiro de uma pipeline que sobe o ambiente, testa e derruba.

# Interrompe o script ao primeiro erro.
set -e

# Garante a limpeza mesmo que um teste falhe.
# --volumes é intencional aqui: o ambiente de CI é descartável.
trap 'docker compose down --volumes' EXIT

# --wait retorna somente quando serviços com healthcheck ficam saudáveis.
docker compose up --detach --wait

# Valida a configuração do Nginx dentro do serviço reproduzível.
docker compose exec -T web nginx -t
```

A opção `-T` desativa a alocação de terminal, que não existe em uma pipeline. Os comandos equivalentes, em uma execução manual, são:

```sh
docker compose up --detach --wait
docker compose exec web nginx -t
docker compose down
```

Saída esperada do `nginx -t`:

```text
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

`--wait` não existe nas versões mais antigas do Docker Compose. Confirme com `docker compose up --help`. Se a opção não existir, atualize o plugin ou acompanhe `docker compose ps` até o serviço aparecer como `healthy`; não trate um simples `Up` como prova de prontidão.

### Comandos essenciais

- `docker compose -f compose.yaml -f compose.prod.yaml config`: mostra o resultado da combinação dos arquivos.
- `docker compose -f compose.yaml -f compose.prod.yaml up --detach --wait`: sobe o ambiente combinado e aguarda a prontidão.
- `docker compose up --detach --scale servico=3`: cria três réplicas do serviço.
- `docker compose ps --all`: lista também os containers que já terminaram.
- `docker compose exec -T serviço comando`: executa um comando sem terminal (indicado em CI).
- `docker inspect --format '{{.RestartCount}}' container`: mostra quantas vezes o Docker reiniciou o container.
- `docker compose down`: encerra os recursos sem remover volumes persistentes.

### Mão na massa

1. Crie uma pasta vazia e salve nela os dois arquivos YAML do exemplo "base e produção". Nenhum Dockerfile ou código adicional é necessário.
2. Compare `docker compose -f compose.yaml config` com `docker compose -f compose.yaml -f compose.prod.yaml config`.
3. Observe a tag da imagem e o valor da label `ambiente` no resultado consolidado: no primeiro comando aparecem `nginx:alpine` e `desenvolvimento`; no segundo, `nginx:stable-alpine` e `producao`.
4. Execute `docker compose -f compose.yaml -f compose.prod.yaml up --detach --wait`.
5. Confirme `healthy` com `docker compose -f compose.yaml -f compose.prod.yaml ps`. A coluna de status deve terminar em `(healthy)`.
6. Valide o Nginx com `docker compose -f compose.yaml -f compose.prod.yaml exec web nginx -t`. A saída deve terminar em `test is successful`. Encerre com `docker compose -f compose.yaml -f compose.prod.yaml down`.
7. Em outra pasta, rode o exemplo de reinício e escala. Confirme três réplicas do `worker` em `docker compose ps` e o `reinicios=3` do `falhador`. Encerre com `docker compose down`.
8. Ainda nessa pasta, acrescente `ports: ["8080:80"]` ao serviço `worker` e rode `docker compose up --detach --scale worker=2`. Observe o conflito de porta: uma das réplicas não sobe e o Docker informa `Bind for 0.0.0.0:8080 failed: port is already allocated`. Finalize com `docker compose down` para liberar a pasta e a porta.

### Dica

Comece sempre por `docker compose config` ao combinar arquivos. Ver o resultado consolidado antes de subir evita a surpresa de um override que não sobrescreveu o que você esperava (ou de um `-f` que desligou o override automático).

### Anota aí

> Arquivos Compose adicionais mudam apenas o que varia entre ambientes; reinício recupera processos, mas não substitui verificação de prontidão.

---

## Etapa 09: Segurança em camadas

### O problema

Uma aplicação vulnerável roda como root, recebe mais capabilities do que precisa e carrega um token dentro da imagem. Se houver exploração, o invasor encontra permissões e dados que nunca foram necessários para a tarefa do serviço.

### O conceito

Como o container compartilha o kernel com o host, não basta confiar no isolamento padrão: um escape do container pode dar acesso ao sistema. A defesa vem da combinação de várias camadas, cada uma reduzindo o que uma exploração conseguiria fazer:

- **Namespaces** isolam a visão de recursos (Etapa 01).
- **Capabilities** dividem os privilégios tradicionais do root em permissões menores. Por padrão, o root do container já vem com menos poderes que o root do host. Você remove capacidades perigosas (como `NET_ADMIN` e `SYS_ADMIN`) com `--cap-drop` e concede uma específica com `--cap-add` somente se o serviço provar que precisa dela. A regra é o **menor privilégio**.
- **Seccomp** funciona como um filtro de chamadas de sistema (syscalls). O Linux tem centenas delas, e o seccomp permite bloquear várias, com base em uma lista permitida. O Docker já traz um perfil padrão que bloqueia chamadas perigosas, e é possível fornecer um perfil próprio, mais restritivo, com `--security-opt seccomp=perfil.json`.
- **AppArmor ou SELinux**, quando habilitados no host, acrescentam controle de acesso obrigatório.
- **Usuário não root** reduz o impacto de uma exploração. Por padrão, o container roda como root; crie um usuário sem privilégios na imagem e use `USER`.
- **Permissões mínimas** evitam `chmod 777` como solução genérica: entenda quem deve ser dono de quê e conceda o mínimo necessário.
- **Sistema de arquivos somente leitura** (`--read-only`), com `tmpfs` apenas onde a aplicação precisa gravar, impede que um invasor altere a imagem em execução.
- **Imagem pequena e atualizada** reduz ferramentas e vulnerabilidades disponíveis.
- **Segredos em arquivos próprios** evitam valores sensíveis no Dockerfile e no ambiente (Etapa 10).

O usuário root dentro de um container não é automaticamente idêntico ao root do host, pois namespaces e capabilities impõem limites. Ainda assim, executar sem necessidade como UID 0 aumenta o risco, especialmente com mounts perigosos, capabilities extras ou falhas do runtime.

Ao criar o usuário na imagem, use `adduser` (ou `useradd`, conforme a distribuição base) e defina o dono dos arquivos copiados com `--chown`. Ao usar volumes ou bind mounts, o usuário do host pode ser diferente do usuário do container, o que causa problemas de permissão; a solução comum é executar o container com os mesmos UID e GID do host (`--user "$(id -u):$(id -g)"`).

Namespaces não são paredes invioláveis e `USER node` não resolve segurança sozinho. A defesa vem da combinação de controles, e a implementação real pertence ao kernel, ao runtime, à imagem e às opções de execução. Não monte `/var/run/docker.sock` em aplicações comuns: quem controla esse socket pode controlar a Docker Engine e, na prática, comprometer o host.

![Camadas aninhadas em volta do processo da aplicação, que roda como USER node: kernel do host compartilhado, namespaces e cgroups, AppArmor ou SELinux, seccomp, --cap-drop ALL e --read-only com --tmpfs /tmp. Ao lado, o docker.sock montado atravessa todas as camadas.](/guides/containers/etapa09-camadas.svg "Cada camada reduz o que uma exploração consegue fazer, e nenhuma basta sozinha. Montar o `docker.sock` anula todas, porque dá controle do daemon, que roda como root no host. | Diagrama: feito para este guia")

### Os conceitos-chave

- **Defesa em profundidade**: várias camadas, nenhuma suficiente sozinha.
- **Usuário não root (`USER`)**: o processo roda sem privilégios administrativos.
- **`--chown`**: define o dono dos arquivos copiados para a imagem.
- **`--cap-drop ALL` e `--cap-add`**: remove todas as capabilities e devolve só as indispensáveis.
- **Seccomp**: filtro de chamadas de sistema; há um perfil padrão do Docker.
- **`--read-only` e `--tmpfs`**: raiz imutável com áreas gravíveis e efêmeras apenas onde necessário.
- **`--user uid:gid`**: faz o container usar os mesmos IDs do host, evitando problemas de permissão em mounts.
- **`docker.sock`**: acesso a ele equivale a controle sobre o Docker; não monte em aplicações comuns.

### Exemplo comentado: criar o usuário na imagem

```dockerfile
# Modelo para uma aplicação Node.js em Alpine.
FROM node:lts-alpine

# Cria um usuário sem privilégios; -D dispensa senha (comando do Alpine).
# Em bases Debian o equivalente é: RUN useradd -m appuser
RUN adduser -D appuser

WORKDIR /app

# Copia os arquivos já pertencendo ao usuário da aplicação.
COPY --chown=appuser:appuser . .

# Instala dependências conforme o lockfile, ainda com privilégio de build.
RUN npm ci --omit=dev

# As instruções seguintes e o processo principal rodam sem privilégios.
USER appuser

CMD ["npm", "start"]
```

Esse modelo garante que existe um usuário sem privilégios de root, que os arquivos foram copiados com a permissão correta e que toda a aplicação roda com permissões limitadas. Em uma imagem oficial do Node, o usuário `node` já existe, e basta usar `COPY --chown=node:node` e `USER node`.

Uma versão mínima e executável para ver o efeito:

```dockerfile
FROM alpine
# Cria o usuário e passa a executar como ele.
RUN adduser -D appuser
USER appuser
# O comando id mostra com qual usuário o processo está rodando.
CMD ["id"]
```

```sh
docker build --tag usuario-demo .
docker run --rm usuario-demo
```

Saída esperada (os números podem variar):

```text
uid=1000(appuser) gid=1000(appuser) groups=1000(appuser)
```

### Exemplo comentado: sistema de arquivos somente leitura

O Dockerfile do bloco anterior ("criar o usuário na imagem") e o de runtime abaixo são modelos de leitura. Os comandos `docker run` que vêm a seguir testam as flags diretamente na imagem oficial, sem construir nada.

```dockerfile
# Parte de uma imagem oficial e versionada.
FROM node:lts-alpine

WORKDIR /app

# Copia os arquivos já pertencendo ao usuário node.
COPY --chown=node:node . .

# Instala dependências conforme o lockfile.
RUN npm ci --omit=dev

# As instruções seguintes de runtime usam um UID não privilegiado.
USER node

CMD ["npm", "start"]
```

A prova de que `--read-only` funciona precisa ser feita com root, porque um usuário comum já não tem permissão de escrever em `/` mesmo sem a opção. Compare os dois comandos:

```sh
# Como root, sem --read-only: a escrita na raiz funciona.
docker run --rm alpine sh -c 'touch /liberado && echo "escrita permitida"'

# Como root, com --read-only: a raiz recusa a escrita, até para o root.
docker run --rm --read-only alpine touch /bloqueado
```

Saída esperada:

```text
escrita permitida
touch: /bloqueado: Read-only file system
```

Agora o comando combinado, com a configuração final de runtime: usuário comum, sem capabilities, raiz somente leitura e `/tmp` como tmpfs gravável.

```sh
# Remove todas as capabilities extras no runtime.
# Acrescente uma capability somente se o serviço provar que precisa dela.
docker run --rm \
  --user node \
  --cap-drop ALL \
  --read-only \
  --tmpfs /tmp \
  node:lts-alpine \
  sh -c 'if touch /bloqueado 2>/dev/null; then exit 1; else echo "raiz bloqueada"; fi; echo "tmpfs gravável" > /tmp/teste; cat /tmp/teste'
```

Saída esperada do teste de escrita:

```text
raiz bloqueada
tmpfs gravável
```

O primeiro `touch` falha por duas razões somadas (o usuário `node` não é dono da raiz e a raiz é somente leitura); a prova isolada do `--read-only` é o par de comandos anterior, feito como root. O segundo comando escreve em `/tmp` porque esse caminho recebeu um `tmpfs` gravável e efêmero.

### Exemplo comentado: capabilities na prática

```sh
# Com as capabilities padrão, o root do container pode trocar o dono de um arquivo.
docker run --rm alpine sh -c 'chown nobody /tmp && echo "chown permitido"'

# Sem capabilities, até o root do container perde esse poder.
docker run --rm --cap-drop ALL alpine sh -c 'chown nobody /tmp && echo "chown permitido"'
```

Saída esperada, aproximada:

```text
chown permitido
chown: /tmp: Operation not permitted
```

### Exemplo comentado: UID e GID em bind mounts

```sh
# Pasta do host que será montada no container.
mkdir -p dados-host

# Sem --user: o container roda como root e o arquivo nasce pertencendo ao root do host.
docker run --rm --volume "$(pwd)/dados-host:/dados" alpine touch /dados/como-root

# Com --user: o arquivo nasce pertencendo ao seu usuário.
docker run --rm --user "$(id -u):$(id -g)" \
  --volume "$(pwd)/dados-host:/dados" alpine touch /dados/como-eu

# Compara os donos dos dois arquivos.
ls -l dados-host

# O problema real: editar pelo host o arquivo que pertence ao root.
echo x >> dados-host/como-root
# Já o arquivo criado com --user é seu e aceita a edição.
echo x >> dados-host/como-eu

# Limpa: como a PASTA é sua, você consegue apagar os dois arquivos pelo host,
# mesmo o que pertence ao root; o que você não consegue é editá-lo.
rm -f dados-host/como-root dados-host/como-eu
rmdir dados-host
```

Saída esperada, resumida (em Linux com Docker Engine padrão):

```text
-rw-r--r-- 1 root  root  0 ... como-root
-rw-r--r-- 1 seu-usuario seu-grupo 0 ... como-eu
bash: dados-host/como-root: Permission denied
```

A mensagem de erro exata depende do seu shell, mas o `Permission denied` aparece só na edição do arquivo do root. No Docker Desktop e no modo rootless do Docker, a tradução de donos entre host e container pode apagar essa diferença, e os dois arquivos aparecem como seus.

### Comandos essenciais

- `docker run --user node imagem`: executa como um usuário específico.
- `docker run --user "$(id -u):$(id -g)" imagem`: usa os IDs do usuário atual do host.
- `docker run --cap-drop ALL imagem`: remove todas as capabilities.
- `docker run --cap-drop ALL --cap-add NET_BIND_SERVICE imagem`: devolve apenas uma capability necessária (exemplo: abrir portas abaixo de 1024).
- `docker run --read-only --tmpfs /tmp imagem`: raiz somente leitura com `/tmp` gravável em memória.
- `docker run --security-opt seccomp=perfil.json imagem`: usa um perfil seccomp próprio.
- `docker run imagem id`: mostra com qual usuário o processo roda.

### Mão na massa

1. Rode `docker run --rm node:lts-alpine id` e observe o usuário padrão da imagem (`uid=0(root)`).
2. Rode `docker run --rm --user node node:lts-alpine id` e confirme `uid=1000(node)`.
3. Prove o `--read-only` como root: rode `docker run --rm alpine sh -c 'touch /liberado && echo "escrita permitida"'` e depois `docker run --rm --read-only alpine touch /bloqueado`. A saída do segundo deve ser `touch: /bloqueado: Read-only file system`.
4. Execute o comando completo do exemplo de runtime com `--read-only` e `--tmpfs /tmp`, e confirme as duas mensagens esperadas: `raiz bloqueada` e `tmpfs gravável`.
5. Remova `--tmpfs /tmp` do comando combinado e repita. A escrita em `/tmp` também falha, pois ele volta a fazer parte da raiz somente para leitura. A saída esperada é `raiz bloqueada`, seguida de `sh: can't create /tmp/teste: Read-only file system` e de `cat: can't open '/tmp/teste': No such file or directory`.
6. Rode os dois comandos do exemplo de capabilities e compare o resultado.
7. Construa e execute o `usuario-demo` e confirme que o `id` mostra `appuser`, e não `root`.
8. Rode o exemplo de UID e GID e confirme que os donos dos dois arquivos são diferentes e que a edição do arquivo do root pelo host é negada (`Permission denied`).

### Dica

Quando uma aplicação falhar depois de `--cap-drop ALL`, não volte atrás por reflexo. Leia o erro, identifique qual operação foi negada e devolva apenas a capability correspondente com `--cap-add`. É assim que o conjunto mínimo se descobre.

### Anota aí

> Segurança de container é defesa em profundidade: usuário, permissões, capabilities, chamadas de sistema, imagem e mounts precisam cooperar.

---

## Etapa 10: Contexto de build, segredos e análise de imagem

### O problema

Um `docker build .` envia `.git`, `node_modules`, logs e `.env` para o contexto. O build demora, o cache invalida sem necessidade e um segredo pode acabar copiado para uma camada. Mesmo apagado numa instrução posterior, ele pode permanecer no histórico de uma camada anterior. Em outro ponto do ciclo, uma senha colocada em `environment` ou em um `.env` aparece em comandos de inspeção e pode ir parar no Git.

### O conceito

O **contexto de build** é tudo o que está na pasta indicada no `docker build` (ou no caminho que você passar). Por padrão, o Docker tenta enviar tudo, incluindo `.git`, `node_modules`, arquivos grandes e segredos. O **`.dockerignore`** funciona como um `.gitignore` para o build: lista o que não deve ser enviado ao contexto. O resultado é um build mais rápido, uma imagem menor e mais segura, e menos invalidações de cache. Mantenha o `.dockerignore` na raiz do projeto, perto do Dockerfile, e rode o `docker build` o mais perto possível do Dockerfile. Se o build parece pesado demais, confira o que está no contexto: é comum enviar gigabytes sem perceber.

Considere o projeto:

```text
meu-app/
├── node_modules/
├── .env
├── .git/
├── build/
├── src/
├── Dockerfile
└── compose.yaml
```

Um `.dockerignore` adequado:

```gitignore
# Dependências locais serão instaladas dentro da imagem.
node_modules

# Configuração local e possíveis segredos não entram no contexto.
.env
.env.*

# Histórico, metadados e arquivos temporários são desnecessários.
.git
*.log
coverage
dist
build
```

Isso evita enviar milhares de arquivos de `node_modules`, impede que o `.env` vá parar dentro da imagem, evita copiar o histórico da pasta `.git` e impede que artefatos de builds anteriores entrem por engano. Cada stack tem necessidades diferentes, então revise qualquer `.dockerignore` sugerido por ferramentas ou assistentes de código para a sua realidade.

**Variáveis de ambiente e segredos.** `env_file` é prático para configuração local, mas não transforma valores em segredos. Eles podem aparecer na configuração e na inspeção do container (`docker inspect`). Arquivos `.env` com credenciais não devem ser versionados. A diretiva `secrets:` do Compose monta o valor como arquivo dentro do container, em `/run/secrets/<nome>`, o que evita deixá-lo no ambiente do processo. Em desenvolvimento local, `env_file` continua prático; quando a aplicação passa a ter staging ou produção, migre os dados críticos para `secrets`.

**Parâmetros de build.** `ARG` declara um valor disponível durante a construção, e `build.args` fornece esse valor pelo Compose. Eles servem para dados não confidenciais, como versão, canal de distribuição ou seleção de recurso. Não use `ARG` para senha ou token: valores de build podem aparecer no histórico, em metadados e em registros da pipeline.

**Ferramentas de análise de imagem.** Passada a fase de escrever um Dockerfile enxuto, vale inspecionar a imagem de verdade:

- **Dive** mostra o conteúdo e o peso de cada camada: o que cada `RUN`, `COPY` e `ADD` adicionou, o que está pesando e o que pode sair.
- **Snyk** verifica vulnerabilidades conhecidas na imagem e em dependências, usando uma base de dados de vulnerabilidades mantida continuamente. Funciona por linha de comando e se integra a pipelines de CI.

Um complementa o outro: o Dive ajuda a entender o tamanho, e o Snyk cuida da segurança.

![A pasta meu-app: node_modules, .env, .git e build estão riscados, porque o .dockerignore os deixa fora; src, Dockerfile, compose.yaml e .dockerignore vão no contexto enviado ao builder, que gera a imagem. Embaixo, o aviso de que um segredo copiado no build fica no histórico da imagem.](/guides/containers/etapa10-contexto.svg "O `.dockerignore` decide o que nem chega ao builder: o build fica mais rápido e o `.env` não entra em nenhuma camada. Um segredo copiado no build continua no histórico, mesmo apagado numa instrução seguinte. | Diagrama: feito para este guia")

### Os conceitos-chave

- **Contexto de build**: o que é enviado ao Docker no build; tudo nele pode afetar tempo, cache e exposição.
- **`.dockerignore`**: filtra o contexto antes do envio.
- **Segredo em camada**: um segredo copiado em uma camada permanece no histórico, mesmo que depois seja apagado.
- **`env_file`**: conveniente, mas não protege valores.
- **`secrets` (Compose)**: monta o valor como arquivo em `/run/secrets/<nome>`.
- **`ARG` / `build.args`**: parâmetros de build não confidenciais.
- **Dive e Snyk**: análise de camadas e de vulnerabilidades.

### Exemplo comentado: um `ARG` não confidencial

Use uma pasta com este `Dockerfile` e o `compose.yaml` logo abaixo.

```dockerfile
# Usa uma base concreta antes de declarar o argumento do estágio.
FROM node:lts-alpine

# Declara um parâmetro não confidencial com valor padrão.
ARG APP_VERSION=dev

# Registra a versão como metadado consultável na imagem.
LABEL org.opencontainers.image.version=$APP_VERSION
```

```yaml
services:
  app:
    build:
      context: .
      args:
        # A versão orienta o build, mas não é segredo.
        APP_VERSION: "1.4.0"
    # Dá um nome fixo à imagem construída, para consultá-la depois.
    image: versao-demo
```

```sh
# Constrói a imagem do serviço app, que ficará com o nome versao-demo.
docker compose build

# Lê a label gravada na imagem.
docker inspect --format '{{index .Config.Labels "org.opencontainers.image.version"}}' versao-demo
```

Saída esperada:

```text
1.4.0
```

Um `ARG` não vira variável de runtime automaticamente; ele persiste aqui apenas porque foi gravado deliberadamente numa label.

### Exemplo comentado: segredo como arquivo no Compose

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      # A imagem lê o conteúdo do arquivo indicado.
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    # O arquivo deve existir localmente e ficar fora do Git.
    file: ./secrets/db_password.txt
```

Dentro do container, o conteúdo fica em `/run/secrets/db_password`. No Compose local, isso reduz exposição acidental ao montar o valor como arquivo, mas não cria por si só um cofre criptografado. Proteja o arquivo de origem e use um gerenciador de segredos adequado no ambiente de destino.

Para comparar com a forma menos segura, o `env_file`:

```yaml
services:
  app:
    image: minha-api
    # Carrega variáveis do arquivo .env (ex.: DB_USER, DB_PASSWORD).
    # Os valores ficam visíveis em docker inspect.
    env_file:
      - .env
```

### Exemplo comentado: um segredo que sobrevive no histórico

```dockerfile
FROM alpine
# O segredo entra numa camada.
COPY segredo.txt /tmp/segredo.txt
# Apagar depois NÃO remove a camada anterior.
RUN rm /tmp/segredo.txt
```

```sh
echo "senha-de-laboratorio" > segredo.txt
docker build --tag vazamento .

# O arquivo não existe mais no sistema de arquivos final...
docker run --rm vazamento ls /tmp

# ...mas a camada do COPY continua no histórico, com tamanho diferente de zero.
docker history vazamento
```

Saída esperada, resumida (o `ls /tmp` sai vazio, e as colunas do `docker history` variam conforme a versão):

```text
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
<id>           ...             RUN /bin/sh -c rm /tmp/segredo.txt # buildkit   0B        buildkit.dockerfile.v0
<id>           ...             COPY segredo.txt /tmp/segredo.txt # buildkit    21B       buildkit.dockerfile.v0
<id>           ...             ...                                             ...
```

A linha do `RUN rm` tem `0B`, mas a linha do `COPY` registra 21 bytes: os 20 caracteres de `senha-de-laboratorio` e a quebra de linha. O tamanho pode aparecer arredondado (por exemplo, em kB) quando o Docker usa o image store do containerd; o que importa é que a linha do `COPY` seja maior que `0B` e a do `RUN rm` continue em `0B`. O arquivo continua dentro dessa camada. Quem tiver a imagem consegue extrair o conteúdo, e o roteiro abaixo faz exatamente isso: exporta a imagem para um arquivo `.tar`, abre o arquivo e procura o segredo em cada camada.

```sh
# Exporta a imagem inteira, com todas as camadas, para um arquivo.
docker save vazamento --output vazamento.tar

# Abre o arquivo exportado.
mkdir extraido
tar -xf vazamento.tar -C extraido

# Tenta ler tmp/segredo.txt de dentro de cada arquivo extraído.
# Os arquivos que não são camadas (índices e manifestos) falham em silêncio.
for arquivo in $(find extraido -type f); do
  tar -xOf "$arquivo" tmp/segredo.txt 2>/dev/null
done

# Limpa o laboratório.
rm -rf extraido vazamento.tar segredo.txt
docker rmi vazamento
```

Saída esperada:

```text
senha-de-laboratorio
```

O segredo aparece em texto puro, embora o `RUN rm` tenha apagado o arquivo. Se a sua versão do Docker gravar os caminhos com `./` na frente, troque `tmp/segredo.txt` por `./tmp/segredo.txt` no `tar`. A solução é nunca deixar o segredo entrar no contexto (`.dockerignore`) e entregá-lo em tempo de execução, como arquivo, nunca em uma instrução do Dockerfile.

### Exemplo comentado: verificar o contexto e a imagem

Use a pasta da Etapa 04 (a que tem o `server.js`, o `package.json`, o `build.js` e o Dockerfile multistage). Ela não tem `node_modules` nem `.env`, então crie o peso de propósito, para que o `.dockerignore` tenha o que filtrar:

```sh
# Cria um node_modules com um arquivo de 50 MB, apenas para o exercício.
mkdir -p node_modules
head -c 50000000 /dev/urandom > node_modules/pesado.bin

# Primeiro build, SEM .dockerignore: o arquivo grande entra no contexto.
# --progress plain mostra o andamento detalhado, inclusive o tamanho do contexto enviado.
docker build --progress plain --tag minha-app:analise .
```

Saída esperada, resumida (o número do passo varia):

```text
#3 [internal] load build context
#3 transferring context: 50.00MB ...
```

Agora crie o `.dockerignore` do exemplo na mesma pasta e construa de novo:

```sh
# Cria o .dockerignore com as exclusões principais.
printf 'node_modules\n.env\n.env.*\n.git\n*.log\ncoverage\ndist\nbuild\n' > .dockerignore

# Segundo build: o contexto agora deixa o node_modules de fora.
docker build --progress plain --tag minha-app:analise .
```

Saída esperada, resumida:

```text
#3 [internal] load build context
#3 transferring context: 2.xxkB ...
```

O tamanho cai de cerca de 50 MB para alguns kilobytes. Rode o primeiro build uma única vez com o arquivo grande: o BuildKit transfere o contexto de forma incremental, então repetir o build sem mudanças mostra um valor pequeno mesmo sem `.dockerignore`. Depois, inspecione a imagem:

```sh
# Exibe camadas e comandos que formaram a imagem.
docker history minha-app:analise

# Mostra o tamanho final.
docker images minha-app:analise

# Remove o peso artificial do laboratório.
rm -rf node_modules
```

Saída esperada, com valores variáveis:

```text
IMAGE          TAG       SIZE
minha-app      analise   ...MB
```

Se Dive ou Snyk estiver instalado (ambos exigem instalação à parte, e o Snyk exige uma conta), a mesma imagem pode ser analisada assim:

```sh
# Navegação interativa pelas camadas e pelo desperdício de espaço.
dive minha-app:analise

# Busca vulnerabilidades conhecidas na imagem e na base.
snyk container test minha-app:analise
```

### Comandos essenciais

- `docker build --progress plain --tag nome:tag .`: build com saída detalhada, incluindo o tamanho do contexto enviado.
- `docker history nome:tag`: lista as camadas e as instruções que as criaram, com tamanho.
- `docker save nome:tag --output arquivo.tar`: exporta a imagem com todas as camadas para um arquivo.
- `docker images nome`: mostra o tamanho final da imagem.
- `docker inspect --format '{{index .Config.Labels "chave"}}' nome:tag`: lê uma label da imagem.
- `docker compose config`: mostra os valores efetivos, inclusive variáveis lidas de `env_file`; útil para perceber o que fica exposto.
- `dive nome:tag`: explora camadas (requer instalação).
- `snyk container test nome:tag`: procura vulnerabilidades (requer instalação e conta).

### Mão na massa

1. Entre na pasta da Etapa 04 e crie o peso de propósito: `mkdir -p node_modules && head -c 50000000 /dev/urandom > node_modules/pesado.bin`.
2. Rode `docker build --progress plain --tag minha-app:analise .` uma única vez e anote o tamanho do contexto (cerca de 50 MB).
3. Crie o `.dockerignore` do exemplo na mesma pasta, repita o build e compare o tamanho enviado (alguns kB) e o reaproveitamento do cache.
4. Use `docker history minha-app:analise` para identificar instruções que adicionaram mais dados. Remova o peso artificial com `rm -rf node_modules`.
5. Reproduza o exemplo "um segredo que sobrevive no histórico": confirme no `docker history` a linha do `COPY` com 21B (ou um valor um pouco maior e arredondado, se o Docker usar o image store do containerd) e a do `RUN rm` com 0B, e rode o roteiro com `docker save` para ver `senha-de-laboratorio` aparecer em texto puro.
6. Reproduza o exemplo do `ARG` com `image: versao-demo` e confirme que o `docker inspect` imprime `1.4.0`.
7. Se Dive ou Snyk estiver instalado, analise a mesma tag e registre um ponto de melhoria.

### Dica

O BuildKit também permite entregar segredos ao build sem gravá-los em nenhuma camada. Se um passo do build realmente precisa de uma credencial (por exemplo, baixar um pacote privado), consulte a documentação do Docker sobre segredos de build em vez de recorrer a `ARG` ou `COPY`.

### Anota aí

> Um segredo que não entra no contexto não pode vazar por uma camada criada durante o build.

---

## Etapa 11: Troubleshooting com uma ordem de investigação

### O problema

Um container entra em `Exited (1)`. Reiniciá-lo repetidamente não explica a causa. Alterar várias configurações ao mesmo tempo pode esconder o sintoma e criar outros problemas.

### O conceito

Use uma sequência previsível, da evidência mais barata à mais específica:

1. **Estado:** `docker ps --all` mostra se o container está rodando, encerrado ou reiniciando.
2. **Logs:** `docker logs` mostra stdout e stderr do processo.
3. **Configuração:** `docker inspect` revela comando, mounts, rede, portas e estado.
4. **Eventos:** `docker events` mostra criação, início, parada, kill e remoção em tempo real.
5. **Processo e recursos:** `docker top` e `docker stats` mostram processos e consumo.
6. **Teste interno:** `docker exec` executa uma verificação dentro de um container ainda ativo.

O `docker inspect` devolve JSON detalhado e é a fonte de respostas para perguntas como: qual comando original está sendo executado (`Config.Cmd`), quais volumes estão montados e onde (`Mounts`), quais portas estão expostas e mapeadas (`NetworkSettings.Ports`), qual é a imagem (`Image`) e se o container está parado por erro ou reiniciando (`State`). Para saber se o container morreu por falta de memória, verifique `State.OOMKilled`. A opção `--format` extrai exatamente o campo desejado, e a saída completa pode ser combinada com ferramentas como `jq` ou usada em scripts de shell.

O **código de saída** conta uma parte da história: `0` indica término normal; qualquer outro valor vem do próprio programa ou do Docker. Valores conhecidos incluem `125` (o Docker falhou ao executar o `docker run`), `126` (o comando existe mas não pôde ser invocado), `127` (o comando não foi encontrado) e `137` (o processo recebeu SIGKILL). O `137` tem mais de uma origem: pode ser falta de memória (nesse caso `OOMKilled` aparece como `true`), mas também aparece quando um `docker stop` esgota o prazo sem que o processo atenda ao SIGTERM e o Docker envia SIGKILL (nesse caso `OOMKilled` continua `false`; é o efeito do PID 1 sem tratador de sinal descrito na Etapa 03). Confirme sempre com `OOMKilled` antes de concluir que faltou memória.

O `docker events` é leve e nativo, e acompanha mudanças de estado de containers, imagens, volumes e redes, com timestamps. É especialmente útil no troubleshooting em tempo real, ao testar scripts de automação ou durante deploys. Pode ser filtrado por tipo (`--filter type=container`) ou por container (`--filter container=nome`) e a saída pode alimentar scripts ou um sistema de logs.

`docker restart` sem evidência desliga e liga o sistema sem ler o que ele disse: pode devolver o serviço por alguns minutos, mas também apaga o contexto operacional e não identifica a causa. A ordem acima protege o diagnóstico contra palpites: a inspeção vem antes de qualquer reinício.

![Seis passos em sequência: estado com docker ps --all, logs com docker logs, configuração com docker inspect, eventos com docker events, processo e recursos com docker top e docker stats, e teste interno com docker exec, da evidência mais barata à mais específica.](/guides/containers/etapa11-investigacao.svg "A ordem vai do que custa menos para olhar ao que exige entrar no container. Cada passo confirma ou descarta uma hipótese antes do próximo. | Diagrama: feito para este guia")

### Os conceitos-chave

- **Estado e código de saída**: o primeiro dado a olhar, antes de logs.
- **Logs**: a mensagem que o próprio processo deixou.
- **`docker inspect --format`**: extrai um campo específico dos metadados.
- **`OOMKilled`**: indica que o container foi morto por falta de memória.
- **Código 137**: SIGKILL; pode ser falta de memória (`OOMKilled=true`) ou um `docker stop` que esgotou o prazo (`OOMKilled=false`).
- **`docker events`**: linha do tempo de tudo o que o Docker fez.
- **`docker top` e `docker stats`**: processos e consumo em tempo real.
- **Hipótese antes da evidência**: formule o que espera encontrar e confirme.

### Exemplo comentado: provocar e localizar uma falha

```sh
# O shell registra uma mensagem de erro e termina com código 42.
docker run --name falha alpine \
  sh -c 'echo "configuração ausente" >&2; exit 42'

# Confirma o código de saída sem ler todo o JSON.
docker inspect --format \
  'status={{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}}' \
  falha

# Recupera a mensagem emitida pelo processo.
docker logs falha
```

Saída esperada:

```text
configuração ausente
status=exited exit=42 oom=false
configuração ausente
```

A mensagem `configuração ausente` aparece duas vezes: a primeira é o stderr do próprio `docker run`, mostrado no terminal enquanto o container executava; a segunda é a mesma mensagem recuperada depois pelo `docker logs`, que lê o que ficou registrado. O container continua existindo (parado) até você removê-lo, e a remoção fica para o fim do diagnóstico:

```sh
# Remove o recurso somente depois de registrar a causa.
docker rm falha
```

Para observar eventos em tempo real, abra um terminal:

```sh
# Filtra eventos do tipo container.
docker events --filter type=container
```

Em outro terminal, inicie e pare um container. A saída mostrará ações como `create`, `start`, `die` e `destroy`.

```sh
# Gera uma sequência de eventos: create, attach, start, die, destroy.
docker run --rm --name evento alpine true
```

Saída esperada no terminal do `docker events`, resumida (os horários e os IDs variam):

```text
... container create <id> (image=alpine, name=evento)
... container attach <id> (image=alpine, name=evento)
... container start <id> (image=alpine, name=evento)
... container die <id> (exitCode=0, image=alpine, name=evento)
... container destroy <id> (image=alpine, name=evento)
```

### Exemplo comentado: erros que o próprio Docker reporta

```sh
# Comando inexistente: o Docker não consegue iniciar o processo.
docker run --rm alpine comando-inexistente
echo "codigo=$?"
```

Saída esperada, resumida:

```text
docker: Error response from daemon: ... executable file not found in $PATH ...
codigo=127
```

A mensagem diz exatamente o problema (executável não encontrado) e o código segue a convenção do `127`. Compare com o exemplo anterior, em que o erro vem do próprio programa (`42`).

### Exemplo comentado: processos e consumo

```sh
# Sobe um container de laboratório.
docker run --detach --name observado alpine sleep 120

# Processos dentro do container.
docker top observado

# Consumo de CPU e memória, uma leitura apenas.
docker stats --no-stream observado

# Comando original, tal como o Docker o registrou.
docker inspect --format '{{json .Config.Cmd}}' observado

# Limpa o laboratório.
docker rm --force observado
```

Saída esperada, resumida:

```text
UID    PID    PPID   C   STIME   TTY   TIME       CMD
root   ...    ...    0   ...     ?     00:00:00   sleep 120
CONTAINER ID   NAME       CPU %   MEM USAGE / LIMIT   MEM %   ...
abc123         observado  0.00%   ...MiB / ...GiB     ...     ...
["sleep","120"]
```

### Comandos essenciais

- `docker ps --all`: estado de todos os containers.
- `docker logs nome`: logs completos; `docker logs --tail 50 nome` mostra só o final.
- `docker inspect nome`: metadados completos.
- `docker inspect --format '{{.State.Status}}' nome`: apenas o estado (`running`, `exited`, ...).
- `docker inspect --format '{{json .Config.Cmd}}' nome`: o comando original.
- `docker events`: eventos em tempo real; `docker events --filter type=container` e `docker events --filter container=nome` restringem a saída.
- `docker top nome`: processos do container.
- `docker stats`: consumo de recursos (`--no-stream` faz uma leitura única).
- `docker exec -it nome sh`: abre um shell em um container ativo para testar por dentro.

### Mão na massa

1. Provoque a falha rodando só o primeiro comando do exemplo (o `docker run --name falha ...`), sem o `docker rm`: a remoção fica para o passo 5. A mensagem `configuração ausente` já aparece no terminal durante esse comando.
2. Antes de olhar os logs, formule uma hipótese apenas com estado e exit code: rode o `docker inspect --format` do exemplo e leia `status=exited exit=42 oom=false`.
3. Confira a hipótese com `docker logs falha`. A mesma mensagem aparece uma segunda vez, agora vinda do registro do Docker.
4. Use `docker inspect --format '{{json .Config.Cmd}}' falha` para ver o comando original.
5. Remova o container somente depois de registrar a causa: `docker rm falha`.
6. Rode `docker run --rm alpine comando-inexistente`, leia o erro e confira o código com `echo $?`. A saída esperada é `127`.
7. Com `docker events --filter type=container` aberto em um terminal, rode `docker run --rm --name evento alpine true` em outro e identifique cada evento (`create`, `attach`, `start`, `die`, `destroy`).

### Dica

Escreva sua hipótese antes de olhar cada evidência, mesmo que em uma linha. Isso treina a ler o estado e o código de saída com atenção, em vez de sair rodando comandos até algo parecer certo.

### Anota aí

> Diagnóstico começa pelo estado observável e avança para evidências; reiniciar não é investigar.

---

## Etapa 12: Logs, healthcheck e prontidão operacional

### O problema

O processo está ativo, então o container aparece como `Up`. Mesmo assim, a aplicação não consegue atender requisições porque perdeu acesso a uma dependência. Em outro incidente, o container foi recriado e seus logs locais desapareceram.

### O conceito

Um **healthcheck** executa periodicamente uma verificação e classifica o container como `starting`, `healthy` ou `unhealthy`. O estado do processo indica presença; o healthcheck verifica capacidade de serviço. Ele não corrige a aplicação sozinho: a política do runtime ou do orquestrador decide como reagir. Um bom healthcheck também funciona como alerta para instabilidade.

Um resultado `healthy` tem alcance limitado. Ele prova apenas a condição examinada pelo teste naquele momento. Um endpoint raso pode passar no teste enquanto uma função importante está quebrada; um teste pesado demais pode criar carga e falso alarme. O healthcheck precisa representar a função certa com custo controlado.

Os parâmetros principais são `test` (o comando), `interval` (de quanto em quanto tempo), `timeout` (quanto esperar por uma tentativa), `retries` (quantas falhas seguidas marcam `unhealthy`) e `start_period` (um período inicial em que falhas não contam, para a aplicação ter tempo de subir). Ele pode ser declarado no Dockerfile (instrução `HEALTHCHECK`), no Compose (`healthcheck:`) ou no `docker run` (`--health-cmd` e opções relacionadas).

**Logs.** Aplicações devem escrever logs em stdout e stderr, que é o que `docker logs` lê. Mas confiar apenas em `docker logs` deixa de bastar com múltiplas instâncias: os logs ficam fragmentados entre containers e, se o container for destruído, geralmente se perdem. A solução é centralizar e estruturar. **Logs estruturados** são registros em formato padronizado (geralmente JSON), com campos consistentes como `timestamp`, `level`, `message` e `service`, o que facilita busca e correlação de eventos. Em ambientes maiores:

- Promtail é um agente que roda junto dos containers, lê os logs locais e os envia ao Loki. (Ele é o agente histórico do Loki, e a Grafana passou a indicar outro coletor; confirme na documentação da Grafana qual agente de coleta ela recomenda.)
- Loki armazena e consulta logs de forma eficiente, com um modelo semelhante ao do Prometheus, só que para logs.
- Fluentd pode coletar, transformar e rotear eventos, e serve em cenários mais complexos, em que os logs precisam ser enriquecidos antes do envio.
- Grafana consulta e visualiza os dados, monta dashboards e correlaciona logs com métricas.

Para começar, vale montar um setup simples com Compose que inclua o coletor, o Loki e o Grafana. Combinar logs estruturados com alertas sobre eventos críticos eleva a observabilidade da aplicação.

![Três estados: starting, durante o start_period de 20s, em que falhas não contam; healthy quando o teste passa; unhealthy depois de 3 falhas seguidas, e de volta a healthy quando o teste volta a passar. Embaixo, quem reage ao estado: restart, depends_on com service_healthy e docker compose up --wait.](/guides/containers/etapa12-healthcheck.svg "Os valores do exemplo da etapa. O healthcheck só classifica o container; quem age sobre o resultado é o runtime, o Compose ou o orquestrador. | Diagrama: feito para este guia")

### Os conceitos-chave

- **Healthcheck**: verificação periódica de capacidade de serviço, e não de presença do processo.
- **`starting`, `healthy`, `unhealthy`**: os três estados de saúde.
- **`start_period`**: tolerância inicial para a aplicação subir.
- **stdout e stderr**: onde a aplicação deve escrever seus logs.
- **Log estruturado (JSON)**: campos fixos que permitem buscar e correlacionar.
- **Centralização**: coletor, armazenamento e visualização (Promtail/Fluentd, Loki, Grafana).

### Exemplo comentado: healthcheck no Compose

```yaml
services:
  api:
    image: minha-api:1.0
    healthcheck:
      # Executa uma requisição com uma ferramenta presente na imagem.
      test: ["CMD", "curl", "--fail", "http://localhost:3000/health"]
      # Verifica a cada 30 segundos.
      interval: 30s
      # Interrompe uma tentativa que passe de 10 segundos.
      timeout: 10s
      # Marca unhealthy após três falhas consecutivas.
      retries: 3
      # Dá tempo para a aplicação iniciar antes de contar falhas.
      start_period: 20s
```

Garanta que `curl` existe na imagem. Em imagens mínimas, prefira uma verificação feita pelo próprio runtime da aplicação ou inclua deliberadamente a ferramenta necessária.

Saída esperada em `docker compose ps`:

```text
NAME            SERVICE   STATUS
projeto-api-1   api       Up ... (healthy)
```

### Exemplo comentado: ver a saúde mudar com um sensor simples

```sh
# O teste de saúde verifica se o arquivo /tmp/pronto existe.
# interval curto e retries baixo só para o exercício ser rápido.
docker run --detach --name sensor \
  --health-cmd 'test -f /tmp/pronto' \
  --health-interval 2s \
  --health-retries 2 \
  alpine sleep 300

# Logo após subir, ainda nenhum teste foi concluído.
docker inspect --format '{{.State.Health.Status}}' sensor

# Depois de duas falhas seguidas, o container é marcado como unhealthy.
sleep 6
docker inspect --format '{{.State.Health.Status}}' sensor

# Cria o arquivo que o teste procura; o próximo teste passa.
docker exec sensor touch /tmp/pronto
sleep 3
docker inspect --format '{{.State.Health.Status}}' sensor

# docker ps mostra a saúde entre parênteses na coluna STATUS.
docker ps --filter name=sensor

# Limpa o laboratório.
docker rm --force sensor
```

Saída esperada:

```text
starting
unhealthy
healthy
```

### Exemplo comentado: HEALTHCHECK no Dockerfile

Use a pasta da Etapa 03 (onde está o `server.js`) e confirme que a porta 3000 está livre. Crie nela o arquivo `Dockerfile.saude` com o conteúdo do `Dockerfile` e uma instrução a mais:

```dockerfile
FROM node:lts-alpine
WORKDIR /app
COPY server.js ./server.js
EXPOSE 3000

# Verifica a cada 5 s, tolera 5 s de espera por tentativa,
# ignora falhas nos primeiros 3 s e marca unhealthy após 3 falhas seguidas.
# 127.0.0.1 evita ambiguidade de resolução de localhost; o wget já existe no Alpine.
HEALTHCHECK --interval=5s --timeout=5s --start-period=3s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
```

```sh
docker build --file Dockerfile.saude --tag minha-api:saude .
# --init para que o docker rm --force e as paradas do Node sejam imediatos.
docker run --detach --init --name api-saude --publish 3000:3000 minha-api:saude

# Logo após subir, o STATUS mostra (health: starting); depois, (healthy).
docker ps --filter name=api-saude
sleep 8
docker ps --filter name=api-saude
```

Saída esperada, resumida:

```text
CONTAINER ID   IMAGE              STATUS                            NAMES
abc123         minha-api:saude    Up 2 seconds (health: starting)   api-saude
CONTAINER ID   IMAGE              STATUS                            NAMES
abc123         minha-api:saude    Up 10 seconds (healthy)           api-saude
```

### Exemplo comentado: logs mais úteis

```sh
# Últimas 20 linhas, com horário de cada uma.
docker logs --tail 20 --timestamps api-saude

# Acompanha em tempo real (Ctrl+C para sair).
docker logs --follow api-saude

# Apenas o que foi emitido nos últimos 5 minutos.
docker logs --since 5m api-saude

# Limpa o laboratório.
docker rm --force api-saude
```

Um log estruturado, como o da API da Etapa 13, tem esta forma, e um coletor consegue filtrar por `level`:

```text
{"timestamp":"...","level":"error","path":"/health","database":"unreachable"}
```

### Comandos essenciais

- `docker ps`: a coluna `STATUS` mostra `(healthy)`, `(unhealthy)` ou `(health: starting)`.
- `docker inspect --format '{{.State.Health.Status}}' nome`: estado de saúde atual.
- `docker inspect --format '{{json .State.Health}}' nome`: histórico das últimas verificações.
- `docker run --health-cmd '...' --health-interval 5s --health-retries 3 imagem`: define o healthcheck no `docker run`.
- `docker logs --tail N`, `--follow`, `--since 5m`, `--timestamps`: variações úteis do `docker logs`.
- `docker compose logs --follow serviço`: logs de um serviço do Compose.
- `docker compose up --detach --wait`: aguarda os serviços com healthcheck ficarem saudáveis.

### Mão na massa

1. Rode o exemplo do sensor e observe a sequência `starting`, `unhealthy` e `healthy`.
2. Construa a imagem `minha-api:saude`, suba o container e acompanhe o `STATUS` em `docker ps` até aparecer `(healthy)`.
3. Rode `docker logs --tail 5 --timestamps api-saude` e observe o horário de cada linha. Depois remova o container com `docker rm --force api-saude`.

Os exercícios de perder a dependência real de uma API e ver o healthcheck reagir ficam na Etapa 13, depois que você tiver a stack completa para testar.

### Dica

Escolha o que o healthcheck testa conforme o que quebra de verdade. Um teste que só confere se a porta abre pode passar com o banco fora do ar; um que consulta o banco a cada segundo pode se tornar a maior fonte de carga. Prefira uma verificação leve que ainda dependa do que é essencial.

### Anota aí

> Processo ativo responde à pergunta "está rodando?"; healthcheck responde "consegue cumprir sua função?".

---

## Etapa 13: Capstone, uma stack pequena e defensiva

### O problema

Os conceitos isolados funcionam nos exercícios, mas produção exige que eles cooperem. A imagem precisa ser reproduzível, o processo deve rodar sem root, a API precisa localizar o banco por nome, o banco precisa persistir dados, a senha não deve virar variável exposta e o ambiente deve dizer quando cada serviço está saudável.

### O conceito

Este projeto final combina somente mecanismos já apresentados: Dockerfile, multistage build, usuário não root, rede personalizada, volume, tmpfs, segredo em arquivo, healthcheck, dependência por saúde, privilégios reduzidos, logs e Compose. Nenhum mecanismo isolado entrega uma aplicação confiável; o resultado vem da disciplina do conjunto.

A API usa apenas módulos nativos do Node. Ela testa se consegue abrir uma conexão TCP com o PostgreSQL. Isso prova descoberta por DNS e conectividade sem adicionar uma biblioteca de banco ao exercício.

O Compose também aplica limites simples de CPU e memória. Eles contêm o consumo máximo do laboratório, mas não garantem desempenho nem reservam capacidade exclusiva. Labels acrescentam metadados para inventário, automação e observabilidade; elas descrevem os serviços sem alterar seu comportamento.

O serviço `api` usa `init: true`: como a Etapa 03 explicou, o Node como PID 1 ignora o SIGTERM sem um tratador de sinal, e o init repassa o sinal, de modo que `docker compose down` e `docker compose stop` terminam em segundos em vez de esperar o prazo de 10 segundos.

O healthcheck do banco usa `pg_isready -h 127.0.0.1`, com o endereço TCP explícito. A imagem do PostgreSQL, na primeira inicialização, sobe um servidor temporário que escuta apenas em socket Unix enquanto prepara o banco. Sem o `-h`, o `pg_isready` consulta esse socket e pode responder "pronto" antes de o servidor definitivo aceitar conexões TCP, que é o caminho que a API usa. Com o endereço explícito, o teste só passa quando o banco realmente atende por TCP.

**Checklist de produção.** Antes de colocar qualquer container em produção, vale uma última revisão. O capstone cobre cada item abaixo, e o arquivo indica onde:

1. **Imagem otimizada:** evite imagens genéricas e pesadas (como `node:latest`); prefira variantes `slim`/`alpine` ou um multistage, para que só o essencial vá para produção. Coberto pelo `Dockerfile`.
2. **Variáveis sensíveis seguras:** senhas e tokens via `secrets:`, e não via `env_file` ou diretamente no Compose. Coberto pelo bloco `secrets`.
3. **Limites de recursos:** CPU e memória definidos para não sobrecarregar o host. Coberto por `cpus` e `mem_limit`.
4. **Healthcheck configurado:** serve de alerta e dá ao orquestrador o critério de reinício. Coberto pelos dois `healthcheck`.
5. **Log estruturado:** a aplicação escreve JSON em stdout, pronto para uma stack de observabilidade (Etapa 12). Coberto pelo `server.js`.
6. **Usuário sem privilégios:** `USER node` no Dockerfile. Coberto.
7. **Rede isolada:** rede específica entre serviços, em vez da bridge padrão. Coberto pela rede `interna`.
8. **Persistência garantida:** volume para que nenhum dado importante se perca em um restart. Coberto por `dados_db`.
9. **Labels e metadados:** facilitam automação e integração com ferramentas de monitoramento. Coberto pelas `labels`.
10. **Teste final local:** simule o ambiente de produção localmente, combinando os arquivos (`docker compose -f compose.yaml -f compose.prod.yaml up`) antes de subir de verdade. Veja o último passo da seção "Mão na massa".

Os limites também podem ser escritos no formato `deploy.resources.limits` do Compose, que a bibliografia usa:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          # Meia CPU e 512 MB de memória.
          cpus: "0.50"
          memory: 512M
```

Ambos os formatos são aceitos pelo Compose v2; este guia usa `cpus` e `mem_limit`. Confira o resultado com `docker compose config`.

![Na rede interna, a api, com init, USER node, read_only, tmpfs, cap_drop ALL, limites e healthcheck, recebe o cliente pela porta 3000 e fala com o db por TCP 5432 pelo nome; ela depende do db com service_healthy. O db, postgres:16-alpine sem porta publicada, usa o volume dados_db e o segredo db_password.](/guides/containers/etapa13-stack.svg "A stack do capstone num só quadro: só a api publica porta, o banco fica alcançável apenas pela rede `interna`, os dados ficam no volume e a senha chega como arquivo em `/run/secrets/`. | Diagrama: feito para este guia")

### Os conceitos-chave

- **Stack**: API, banco, rede, volume e segredo descritos juntos.
- **Dependência por saúde**: `depends_on` com `condition: service_healthy` aguarda a prontidão, e não apenas a criação.
- **Privilégios reduzidos**: `cap_drop: ALL`, `read_only: true`, `tmpfs` em `/tmp`, `USER node`.
- **`init: true`**: um init como PID 1 repassa o SIGTERM ao Node e acelera o encerramento.
- **Segredo em arquivo**: `POSTGRES_PASSWORD_FILE` aponta para `/run/secrets/db_password`.
- **Rede `interna`**: DNS por nome de serviço, sem publicar o banco.
- **Limites de recurso**: contêm o consumo, sem reservar capacidade.
- **Labels**: metadado de inventário, e não controle de segurança.
- **`pg_isready -h 127.0.0.1`**: verifica o banco pelo mesmo caminho TCP que a API usa.

### Exemplo comentado: arquivos do projeto

Estrutura:

```text
capstone/
├── app/
│   └── server.js
├── secrets/
│   └── db_password.txt
├── .dockerignore
├── Dockerfile
└── compose.yaml
```

`app/server.js`:

```js
// Usa somente módulos incluídos no Node.js.
const http = require("node:http");
const net = require("node:net");

const port = Number(process.env.PORT || 3000);
const databaseHost = process.env.DB_HOST || "db";

// Testa se a porta TCP do banco aceita conexão.
function databaseReachable() {
  return new Promise((resolve) => {
    const socket = net.createConnection(5432, databaseHost);
    const finish = (result) => {
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(1000);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

const server = http.createServer(async (request, response) => {
  const reachable = await databaseReachable();
  const status = reachable ? 200 : 503;
  const body = {
    service: "api",
    database: reachable ? "reachable" : "unreachable",
  };

  // Produz um log estruturado em stdout.
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: reachable ? "info" : "error",
    path: request.url,
    database: body.database,
  }));

  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
});

server.listen(port, "0.0.0.0", () => {
  console.log(JSON.stringify({ level: "info", message: `listening:${port}` }));
});
```

`Dockerfile`:

```dockerfile
# Etapa de preparação do artefato.
FROM node:lts-alpine AS build
WORKDIR /build
COPY app/server.js ./server.js

# Etapa final separada da preparação: leva só o necessário para executar.
FROM node:lts-alpine AS runtime
WORKDIR /app

# Copia o artefato com o usuário correto.
COPY --from=build --chown=node:node /build/server.js ./server.js

# Documenta a porta e abandona privilégios de root.
EXPOSE 3000
USER node

# A forma exec faz o Node ser o processo principal (PID 1) diretamente, sem um shell no meio.
# Isso sozinho não basta para um encerramento limpo: o init: true do Compose
# coloca um init como PID 1, que repassa o SIGTERM ao Node.
CMD ["node", "server.js"]
```

`.dockerignore`:

```gitignore
.git
.env
secrets
node_modules
*.log
```

`compose.yaml`:

```yaml
services:
  api:
    # Constrói a imagem local com o Dockerfile.
    build:
      context: .
      dockerfile: Dockerfile
    # Executa um init como PID 1, para que o SIGTERM chegue ao Node e o down seja rápido.
    init: true
    # Publica somente a API.
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
      PORT: "3000"
    # Espera o banco ficar saudável antes de criar a API.
    depends_on:
      db:
        condition: service_healthy
    # Remove capabilities que a API não utiliza.
    cap_drop:
      - ALL
    # Limita o consumo máximo do serviço no host.
    cpus: "0.50"
    mem_limit: 128m
    # Identifica o papel do container para busca e automação.
    labels:
      com.exemplo.service: api
      com.exemplo.component: backend
    # Impede escrita na raiz e oferece /tmp efêmero.
    read_only: true
    tmpfs:
      - /tmp
    restart: on-failure:3
    networks:
      - interna
    healthcheck:
      # fetch está disponível nas versões atuais do Node e evita instalar curl.
      # 127.0.0.1 evita ambiguidade na resolução de localhost.
      test:
        - CMD
        - node
        - -e
        - fetch('http://127.0.0.1:3000/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 5s

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_DB: app
      # A imagem oficial lê a senha deste arquivo.
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - dados_db:/var/lib/postgresql/data
    networks:
      - interna
    # Mantém o banco dentro de limites adequados ao laboratório.
    cpus: "0.75"
    mem_limit: 512m
    # Registra metadados sem mudar a execução do processo.
    labels:
      com.exemplo.service: db
      com.exemplo.component: database
    restart: unless-stopped
    healthcheck:
      # pg_isready já existe na imagem do PostgreSQL.
      # -h 127.0.0.1 força a checagem por TCP, o caminho que a API usa. Sem ele, o teste
      # consulta o socket Unix e pode passar durante o servidor temporário da inicialização.
      test: ["CMD-SHELL", "pg_isready -h 127.0.0.1 -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  # O banco mantém dados após a recriação do container.
  dados_db:

networks:
  # A rede criada pelo usuário oferece DNS por nome de serviço.
  interna:

secrets:
  db_password:
    # Este arquivo está fora do contexto por causa do .dockerignore.
    file: ./secrets/db_password.txt
```

Saída esperada de `curl http://localhost:3000/health` com a stack saudável:

```json
{"service":"api","database":"reachable"}
```

### Exemplo comentado: conferindo a stack em execução

```sh
# Estado e saúde dos dois serviços.
docker compose ps

# Usuário do processo da API.
docker compose exec api id

# Volumes existentes; o do banco leva o nome do projeto (a pasta) como prefixo.
docker volume ls
```

Saída esperada, resumida (os IDs e os tempos variam):

```text
NAME             SERVICE   STATUS
capstone-api-1   api       Up ... (healthy)
capstone-db-1    db        Up ... (healthy)
uid=1000(node) gid=1000(node) groups=1000(node)
DRIVER    VOLUME NAME
local     capstone_dados_db
```

O volume declarado como `dados_db` no arquivo aparece como `capstone_dados_db` porque o Compose prefixa os recursos com o nome do projeto, que por padrão é o nome da pasta (`capstone`).

### Comandos essenciais

- `docker compose config --quiet`: valida o YAML sem imprimir.
- `docker compose up --detach --build --wait`: constrói, sobe e aguarda a prontidão.
- `docker compose ps`: estado e saúde dos serviços.
- `docker compose logs api`: logs JSON da API.
- `docker compose exec api id`: confirma o usuário do processo.
- `docker volume ls`: confirma que o volume `capstone_dados_db` (prefixo = nome da pasta) continua existindo.
- `docker compose down`: encerra preservando os dados.
- `docker compose down --volumes`: encerra e apaga os dados; só quando a perda for intencional.
- `docker ps --filter publish=3000`: verifica se a porta 3000 já está em uso por outro container.
- `docker compose stop db` e `docker compose start db`: param e retomam o banco, para testar a reação do healthcheck da API.

### Mão na massa

> **Antes de subir:** a porta 3000 do host precisa estar livre. Confira com `docker ps --filter publish=3000`. Se outro container já a utiliza, pare esse recurso somente se ele for seu, ou altere o mapeamento para `"3001:3000"` e use `curl http://localhost:3001/health` nos passos seguintes.

1. Crie a estrutura e os arquivos exatamente como mostrados.
2. Grave uma senha de laboratório com `mkdir -p secrets && printf 'troque-esta-senha' > secrets/db_password.txt && chmod 644 secrets/db_password.txt`. O `chmod 644` importa porque o Postgres lê o arquivo como o usuário `postgres` dentro do container; com uma `umask` restritiva no host, o arquivo nasceria legível só por você e a leitura poderia falhar.
3. Valide o YAML com `docker compose config --quiet`.
4. Suba a stack com `docker compose up --detach --build --wait`.
5. Rode `curl http://localhost:3000/health`.
6. A saída esperada é `{"service":"api","database":"reachable"}`.
7. Rode `docker compose ps` e confirme que ambos os serviços estão saudáveis.
8. Rode `docker compose logs api` e localize o log JSON da requisição.
9. Confirme o usuário com `docker compose exec api id`. A saída deve identificar o usuário `node`, não `root`.
10. Execute `docker compose down`, suba novamente e confirme que o volume `capstone_dados_db` (o prefixo é o nome da sua pasta) continua existindo com `docker volume ls`. Repare também que o `down` termina em poucos segundos, graças ao `init: true`.
11. Se quiser preservar o banco, encerre apenas com `docker compose down`. Use `docker compose down --volumes` somente quando decidir descartar o laboratório: esse comando remove o volume `capstone_dados_db` e apaga definitivamente seu conteúdo, sem lixeira ou recuperação automática. Faça backup antes se houver qualquer dado necessário.
12. Para fechar o item 10 do checklist de produção, escreva um `compose.prod.yaml` mínimo (por exemplo, trocando `restart` ou adicionando uma label `ambiente: producao`), valide com `docker compose -f compose.yaml -f compose.prod.yaml config` e suba com `-f` nos dois arquivos antes de considerar o ambiente pronto.
13. Extra, perder o banco e voltar: com a stack no ar (`docker compose up --detach --build --wait`), confirme o estado inicial com `docker compose ps`. API e banco devem aparecer como `healthy`.
14. Extra: pare a dependência real da API com `docker compose stop db`.
15. Extra: acompanhe `docker compose ps` até a API aparecer como `unhealthy`. O endpoint retorna 503 porque o teste TCP ao banco falha, e `curl -i http://localhost:3000/health` mostra `HTTP/1.1 503` com `{"service":"api","database":"unreachable"}`.
16. Extra: consulte as tentativas com `docker inspect --format '{{json .State.Health}}' $(docker compose ps -q api)` e correlacione com `docker compose logs api`, onde as linhas de nível `error` aparecem.
17. Extra: recupere o banco com `docker compose start db` e aguarde os dois serviços voltarem a `healthy` em `docker compose ps`.

### Dica

Depois de concluir o capstone, repita-o provocando uma falha de propósito: pare o banco, remova o volume, troque a senha. Se você consegue prever e explicar cada resposta do sistema (estado, healthcheck, logs), você entendeu como as peças funcionam juntas.

### Anota aí

> Uma stack madura não depende de um único recurso: ela combina construção reproduzível, isolamento, menor privilégio, persistência, saúde e evidências operacionais.

---

## Checklist de autoavaliação

O checklist resume o que foi estudado em cada etapa. Marque cada item apenas se você **fez** ou **conseguiu explicar em voz alta**, não se apenas leu. Se algum ficar em branco, volte à etapa correspondente e refaça o "Mão na massa".

**Etapa 01: Por que containers existem**
- [ ] Consigo explicar por que container não é uma VM pequena.
- [ ] Sei dizer o papel de namespaces e cgroups.
- [ ] Consigo explicar por que o processo principal determina a vida do container.
- [ ] Vi o isolamento de PID e de hostname e li um limite de memória registrado em um container.

**Etapa 02: Imagem, container e ciclo de vida**
- [ ] Diferencio imagem, camada e container.
- [ ] Executei o ciclo `pull`, `run`, `stop`, `start` e `rm` e confirmei que a imagem sobrevive ao container.
- [ ] Sei explicar por que `latest` e outras tags não garantem reprodutibilidade e o que um digest resolve.
- [ ] Sei distinguir registry público de privado e descrever o fluxo `login`, `tag` e `push`.
- [ ] Usei `docker exec`, `docker cp` e `docker rename` em um container em execução.

**Etapa 03: Dockerfile**
- [ ] Sei construir e versionar uma imagem com Dockerfile.
- [ ] Diferencio `RUN`, `CMD`, `EXPOSE` e `--publish`.
- [ ] Substituí o `CMD` de uma imagem na linha de comando sem reconstruí-la.
- [ ] Sei encerrar um container em primeiro plano e explicar por que o `--init` ajuda o Node como PID 1.

**Etapa 04: Camadas, cache e multistage**
- [ ] Sei organizar um Dockerfile para aproveitar cache.
- [ ] Observei `CACHED` e provoquei a invalidação do cache invertendo a ordem das instruções.
- [ ] Entendo quando escolher `slim`, `alpine`, `distroless` ou uma imagem mais completa.
- [ ] Consigo explicar o benefício de um multistage build e o cuidado com as dependências de runtime.

**Etapa 05: Persistência**
- [ ] Sei escolher entre volume, bind mount e tmpfs.
- [ ] Comprovei que um dado em volume sobrevive à remoção do container e que um dado em tmpfs não sobrevive nem a um restart.
- [ ] Sei explicar o que muda ao usar um driver remoto (NFS ou plugin) em vez do `local`.

**Etapa 06: Redes**
- [ ] Sei conectar serviços por nome em uma rede personalizada.
- [ ] Mostrei a diferença entre a bridge padrão e uma rede personalizada quanto à resolução de nomes.
- [ ] Publico somente as portas que precisam sair da rede interna.
- [ ] Sei dizer quando usar `host`, `none` e `overlay`.

**Etapa 07: Docker Compose**
- [ ] Consigo validar, subir, observar e derrubar uma aplicação Compose.
- [ ] Sei explicar o que `depends_on` garante e o que não garante.
- [ ] Sei usar `build` com `context`, `dockerfile` e `args`.

**Etapa 08: Ambientes, reinício, escala e CI**
- [ ] Sei combinar arquivos Compose para diferentes ambientes e conferir o resultado com `config`.
- [ ] Sei dizer quando o override é carregado automaticamente e quando não é.
- [ ] Entendo que restart não garante prontidão de dependências.
- [ ] Vi uma porta fixa impedir réplicas no mesmo host.
- [ ] Sei descrever um roteiro de CI que sobe, testa e derruba o ambiente.

**Etapa 09: Segurança**
- [ ] Consigo configurar usuário não root, filesystem somente leitura e capabilities mínimas.
- [ ] Provei o `--read-only` como root, comparando com e sem a opção.
- [ ] Sei dizer o papel de capabilities, seccomp e menor privilégio.
- [ ] Sei resolver problemas de permissão em bind mounts com `--user` e sei por que não montar `docker.sock`.

**Etapa 10: Contexto, segredos e análise**
- [ ] Sei por que `.env` e segredos não devem entrar no contexto de build.
- [ ] Vi o tamanho do contexto cair com o `.dockerignore`.
- [ ] Sei explicar por que apagar um segredo numa camada posterior não o remove da imagem, e extraí o segredo da camada com `docker save`.
- [ ] Diferencio `ARG`, `env_file` e `secrets`.
- [ ] Sei para que servem Dive e Snyk.

**Etapa 11: Troubleshooting**
- [ ] Consigo investigar uma falha usando status, logs, inspect e events, nessa ordem.
- [ ] Sei interpretar os códigos de saída 0, 125, 126, 127 e 137 e verificar `OOMKilled`, sabendo que o 137 também aparece quando um `docker stop` esgota o prazo.

**Etapa 12: Logs, healthcheck e prontidão**
- [ ] Diferencio processo ativo de serviço saudável.
- [ ] Vi um container passar por `starting`, `unhealthy` e `healthy`.
- [ ] Consigo explicar como logs estruturados ajudam a centralização e a busca.

**Etapa 13: Capstone**
- [ ] Concluí o capstone e consigo justificar cada decisão do Compose.
- [ ] Mapeei cada item do checklist de produção para uma linha do arquivo.
- [ ] Parei o banco, vi a API ficar `unhealthy` e a vi voltar a `healthy` quando o banco retornou.

**Próximos passos:** com todos os itens marcados, refaça os laboratórios sem consultar o guia e depois junte as peças. Provoque falhas no capstone (pare o banco, troque a senha, remova o volume) e explique cada resposta do sistema antes de olhar os logs. Em seguida, acrescente um terceiro serviço (por exemplo, um cache) e leve a mesma stack para um fluxo de CI com `docker compose up --wait`.

---

## Notas do professor: precisões técnicas

Este bloco reúne as correções feitas sobre o material bruto e os detalhes que ajudam a ler os exemplos com segurança. Nada aqui muda o caminho dos exercícios.

**Correções ao material bruto**

1. **Root do container não é o root do host.** O texto bruto afirma que o root dentro do container é "praticamente o mesmo" do host. Namespaces e capabilities reduzem seus poderes. Ainda assim, executar como UID 0 amplia o impacto de mounts perigosos, capabilities extras e falhas do runtime, e por isso o guia recomenda usuário não root.
2. **User namespace não é o padrão.** O bruto apresenta o user namespace como se todo container tivesse IDs de usuário separados dos do host. Na configuração padrão do Docker, o UID 0 do container corresponde ao UID 0 do host (com capabilities reduzidas); o mapeamento só existe se `userns-remap` ou o modo rootless estiverem habilitados. É por isso que, sem `--user`, um bind mount cria arquivos pertencentes ao root do host (Etapa 09).
3. **`tmpfs` não é driver de volume persistente.** O bruto o lista entre os drivers de volume. É uma montagem em memória que perde o conteúdo quando removida.
4. **A bridge padrão não tem DNS por nome.** O bruto diz que a rede bridge padrão fornece resolução de nomes. Essa resolução é uma vantagem das redes criadas pelo usuário; na bridge padrão, não dependa dela (Etapa 06).
5. **Overlay pertence ao Docker Swarm.** O bruto associa as redes overlay ao Swarm ou ao Kubernetes. O Kubernetes não usa redes overlay do Docker; ele usa plugins de rede (CNI) próprios. O guia menciona overlay apenas como rede multi-host do Swarm.
6. **Google Container Registry.** O serviço citado no bruto foi substituído pelo Artifact Registry; o guia usa o nome do serviço substituto.
7. **`docker-compose` com hífen.** Os exemplos do bruto usam o executável da primeira geração. O guia usa `docker compose` (Compose v2) em todo o texto. O nome `docker-compose.yml` continua aceito, mas `compose.yaml` é o nome preferido.
8. **Exemplo de cache com pnpm.** O bruto copia apenas `pnpm-lock.yaml` antes de `pnpm install`, mas o gerenciador também precisa do `package.json`. O guia copia os dois e usa `--frozen-lockfile`.
9. **Ordem do `USER` no Dockerfile.** O exemplo do bruto troca para o usuário comum antes de `RUN npm ci`. Como o diretório criado por `WORKDIR` pode ter o root como dono, a instalação pode falhar por permissão. O guia instala as dependências antes de `USER` e usa `COPY --chown`.
10. **Multistage e dependências.** O bruto copia apenas `/app/dist` para o runtime sem ressalva. Isso só funciona se o artefato for autossuficiente; caso contrário, a etapa final precisa de `npm ci --omit=dev` próprio.
11. **Tamanho do Alpine.** O bruto diz "menos de 10 MB" em uma aula e "cerca de 5 MB" em outra. O guia fala em "poucos megabytes", já que o valor varia entre versões.
12. **Cgroups e rede.** O bruto inclui largura de banda de rede entre os recursos controlados por cgroups. O Docker expõe limites de CPU, memória e entrada e saída de disco por flags; o guia se restringe a esses.
13. **`env_file` e versionamento.** O bruto sugere `env_file` para valores que "você precisa versionar". Arquivos `.env` com credenciais não devem ser versionados, e valores de `env_file` ficam visíveis em `docker inspect`.
14. **Promtail.** O bruto o apresenta como o agente do Loki. Ele é o agente histórico, e a Grafana passou a indicar outro coletor; como essa recomendação pode mudar, o guia pede para confirmar na documentação qual agente ela indica.
15. **Erros de extração.** Comandos como `dockerpull`, `dockerinspect` e `docker-composeup` aparecem com espaços perdidos no bruto, e a opção `-a` de `docker ps` aparece com um hífen tipográfico longo no lugar do hífen simples. O guia os restaura para `docker pull`, `docker inspect`, `docker ps -a` e `docker compose up`.

**Sobre o que você vai ver no terminal**

16. **Saídas de exemplo.** As saídas mostradas são formatos típicos. IDs, tempos, tamanhos, IPs e versões variam. Compare a estrutura, não o texto exato.
17. **Tags de imagem.** As tags `lts-alpine` e `lts-slim` do Node acompanham a versão LTS vigente, o que evita que os exercícios envelheçam, mas as torna móveis: em um projeto, fixe a versão principal. A imagem `postgres:16-alpine` deve manter a versão principal escolhida, porque os arquivos de dados não são compatíveis entre versões principais. Confirme a disponibilidade das imagens de terceiros (como `curlimages/curl`) no momento da execução.
18. **Camada gravável e `docker cp`.** Arquivos copiados para dentro de um container ficam na camada gravável e somem com ele; para persistir, use volumes.
19. **Limites de recurso.** `cpus` e `mem_limit` (ou `deploy.resources.limits`) contêm o consumo, mas não reservam capacidade exclusiva nem substituem monitoramento.
20. **Label é metadado, não controle de segurança.** Ela ajuda inventário, automação e observabilidade, mas não impõe isolamento ou autorização.
21. **Segredos no Compose local.** `secrets` monta o valor como arquivo e reduz a exposição, mas não é um cofre criptografado; o arquivo de origem continua precisando de proteção.
22. **`ARG` não é segredo.** Valores de build podem aparecer em histórico, metadados e registros de pipeline. Para segredos de build, existe um mecanismo próprio do BuildKit.
23. **PID 1, sinais e `--init`.** No Linux, o PID 1 de um namespace de processos não recebe a ação padrão dos sinais: SIGTERM e SIGINT são ignorados se o programa não instalou um tratador. O Node.js sem tratador explícito é afetado, então o Ctrl+C pode não encerrar um container em primeiro plano e o `docker stop` espera 10 segundos antes de enviar SIGKILL. `--init` (e `init: true` no Compose) resolve isso com um init que repassa os sinais. Uma alternativa é tratar o sinal no código, com algo como `process.on("SIGTERM", () => server.close(() => process.exit(0)))`.
24. **O 137 tem duas origens.** O código de saída 137 significa SIGKILL. Ele aparece em falta de memória (com `OOMKilled=true`) e também quando um `docker stop` esgota o prazo e o Docker mata o processo (com `OOMKilled=false`). Quem leu "137" como falta de memória precisa conferir o `OOMKilled` antes de concluir.
25. **tmpfs e swap.** Um tmpfs vive na memória, mas, sob pressão de memória, o sistema pode mover suas páginas para a área de swap, e por isso ele não é uma garantia absoluta de que o dado nunca chega ao disco.
26. **Contexto de build incremental.** O BuildKit transfere o contexto de forma incremental: na segunda execução de um build, só as diferenças são enviadas. Por isso o exercício de `.dockerignore` da Etapa 10 pede que o primeiro build, com o arquivo grande, seja feito uma única vez antes de criar o `.dockerignore`.
27. **Tamanhos no `docker history`.** Dependendo da versão e do image store usado pelo Docker (o clássico ou o do containerd), os tamanhos das camadas podem aparecer arredondados ou em outra unidade. A leitura que importa é a comparação: a camada do `COPY` é maior que `0B` e a do `RUN rm` continua em `0B`.
28. **`pg_isready` e o servidor temporário.** Na primeira inicialização, a imagem oficial do PostgreSQL executa um servidor temporário só em socket Unix, reinicia e então passa a escutar em TCP. Um `pg_isready` sem `-h` pode acusar prontidão nessa fase; com `-h 127.0.0.1`, o teste reflete o caminho TCP usado pela API.

**Pontos a verificar por quem for executar**

29. **Docker Desktop.** Os containers Linux rodam dentro de uma VM. O modo de rede `host` e a tradução de donos de arquivos em bind mounts se comportam de forma diferente do Linux nativo (Etapas 06 e 09).
30. **Reinício e contagem.** O número de reinícios mostrado na Etapa 08 (`reinicios=3`) e o número de linhas de log dependem do tempo em que você consulta; aguarde alguns segundos antes de inspecionar.
31. **Serviços externos.** O `docker push` (Etapa 02) exige um registry real, o volume NFS (Etapa 05) exige um servidor NFS acessível, o Snyk (Etapa 10) exige conta, e o Dive exige instalação. Os demais exercícios não dependem deles.
32. **Portas em uso.** Os exemplos usam as portas 3000 e 8080 do host. Se alguma estiver ocupada, altere o lado esquerdo do mapeamento (por exemplo, `3001:3000`) e ajuste o `curl`.
33. **Imagens mínimas e diagnóstico.** Alpine, slim e distroless reduzem tamanho e superfície, mas compatibilidade e capacidade de diagnóstico também precisam ser consideradas; uma imagem sem shell não aceita `docker exec ... sh`.
34. **Extração de camadas com `docker save`.** O formato do arquivo exportado muda conforme a versão do Docker (camadas em diretórios próprios ou em `blobs/`, com ou sem compressão). O roteiro da Etapa 10 percorre todos os arquivos justamente para não depender desse layout; se o `tar` não encontrar o caminho, tente a variante `./tmp/segredo.txt`.
