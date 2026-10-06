# Fontes brutas do R04: Containers e Docker

Extração textual higienizada dos seis PDFs da Fase 2. Marcas pessoais de distribuição foram removidas; o conteúdo didático foi preservado para transformação pelo pipeline do projeto.

## Aula 01, Introdução a Containers

Fonte: https://drive.google.com/file/d/1PPLAYEwUAANvQ6zQg8QSlDS5bMypUstQ/view

Introdução à Containers Introdução à Containers Página 1 de 16
| AULA 01 -
DEVOPS E ARQUITETURA CLOUD
FASE 2
INTRODUÇÃO À
CONTAINERS

ção à Containers Introdução à containers Página 2 de 16
SUMÁRIO
O QUE VEM POR AÍ?...............................................................................................3
HANDS ON ...............................................................................................................4
SAIBA MAIS..............................................................................................................5
O QUE VOCÊ VIU NESTA AULA? ...........................................................................13
REFERÊNCIAS.........................................................................................................14

ção à Containers Introdução à containers Página 3 de 16
O QUE VEM POR AÍ?
Já parou pra pensar por que, às vezes, o código que funciona na sua
máquina simplesmente não roda no servidor? Ou por que configurar um ambiente de
desenvolvimento pode virar um verdadeiro pesadelo? Se você já passou por isso (ou
teme passar), essa aula vai fazer muito sentido para você.
Nesta primeira etapa da nossa jornada, vamos entender o que são containers,
por que eles revolucionaram a forma como desenvolvemos e distribuímos
aplicações, e como o Docker se tornou uma ferramenta essencial na mochila de
qualquer dev moderno. Vamos viajar no tempo das máquinas físicas até os dias de
hoje, onde subir um ambiente completo pode ser tão simples quanto rodar um
comando no terminal.
Você vai descobrir como containers resolvem problemas clássicos de
compatibilidade, como eles se comparam com as máquinas virtuais e, claro, vai
“botar a mão na massa” para rodar o seu primeiro container com Docker. É só o
começo — e, acredite, essa caixinha mágica vai te acompanhar em muitos projetos
daqui pra frente.
“Bora” começar?

ção à Containers Introdução à containers Página 4 de 16
HANDS ON
Agora que você já entendeu o contexto e a importância dos containers,
chegou a hora de mergulhar de verdade nesse universo com a nossa sequência de
videoaulas. Serão três vídeos práticos e diretos ao ponto, pensados para te ajudar a
entender desde os conceitos básicos até a execução do seu primeiro container com
Docker.
Durante as aulas, você verá explicações visuais, analogias simples e
exemplos reais que mostrarão como os containers se encaixam no dia a dia do
desenvolvimento. E claro: vai ter hands-on! Ou seja, você vai aprender não só com
teoria, mas também com prática — comandos reais, execução de containers e tudo
o que precisa para você dar os primeiros passos com segurança.
Dica: se quiser ir acompanhando, já prepara seu terminal e, se ainda
não tiver, baixe o Docker aqui.
Juntos, vamos instalar o Docker e rodar seu primeiro container com o famoso
docker run hello-world. Também vamos te mostrar os principais comandos, aqueles
que você vai usar no dia a dia:
docker ps
docker images
docker pull
docker run
docker stop
docker rm
dockerinspect
Pronto e pronta para o desafio? Então “bora” abrir o terminal e fazer
acontecer!
Assim que você terminar de assistir os vídeos, você estará com o ambiente
pronto para continuar nossa jornada nas próximas aulas, onde aprofundaremos o
uso de imagens, Dockerfiles, volumes, redes e muito mais.
Vamos nessa? Dá o play no primeiro vídeo e “bora” aprender na prática!

ção à Containers Introdução à containers Página 5 de 16
SAIBA MAIS
Histórico da virtualização e evolução até os containers
Durante muito tempo, aplicações eram implantadas diretamente em
servidores físicos. Cada servidor precisava ser configurado manualmente, com
sistema operacional, dependências e todas as particularidades exigidas por aquela
aplicação. Esse modelo trazia vários problemas: baixa flexibilidade, desperdício de
recursos e alta complexidade para manutenção e escalabilidade.
A virtualização surgiu como resposta a esses desafios. Com ela, foi possível
dividir um único servidor físico em várias máquinas virtuais (VMs), cada uma com
seu próprio sistema operacional, drivers e bibliotecas. Isso melhorou o
aproveitamento do hardware e permitiu que diferentes aplicações compartilhassem o
mesmo servidor de forma isolada. No entanto, o custo computacional das VMs era
alto. Cada instância virtual carregava um sistema operacional completo, ocupava
bastante memória e levava mais tempo para inicializar.
Foi nesse contexto que os containers ganharam espaço. Em vez de virtualizar
a máquina inteira, os containers compartilham o kernel do sistema operacional do
host e isolam apenas o necessário: processos, rede, sistema de arquivos e recursos.
Essa abordagem reduz drasticamente o uso de recursos, acelera a inicialização e
facilita a portabilidade entre ambientes.
O avanço da tecnologia de containers foi possível graças a funcionalidades do
kernel Linux como namespaces (que isolam recursos) e cgroups (que controlam o
uso de CPU, memória e I/O). Com essa base técnica, ferramentas como o Docker
surgiram para facilitar a criação, empacotamento e execução de containers de forma
acessível e padronizada.
A transição da virtualização tradicional para o modelo baseado em containers
reflete uma mudança no modo como desenvolvedores e times de infraestrutura
pensam sobre entrega de software: menos foco na máquina, mais foco na aplicação.
O resultado é um processo de deploy mais ágil, confiável e alinhado com práticas
modernas de integração e entrega contínua.

ção à Containers Introdução à containers Página 6 de 16
Problemas de deploy tradicionais
Antes de containers e outras ferramentas modernas, o processo de colocar
uma aplicação no ar costumava ser lento, frágil e cheio de incertezas. Cada
ambiente era diferente — e isso gerava um dos erros mais clássicos: “na minha
máquina funciona”.
O principal problema vinha da forma como os ambientes eram configurados.
Devs criavam a aplicação num sistema com determinada versão de linguagem,
dependências específicas, configurações locais, e depois tentavam replicar tudo isso
em servidores que nem sempre estavam iguais. Às vezes, o servidor tinha outro
sistema operacional, permissões diferentes ou até versões conflitantes de
bibliotecas. O resultado? Falhas difíceis de rastrear e tempo perdido tentando
“ajeitar o ambiente”.
Outro ponto crítico era a instalação manual. Era comum rodar scripts
diretamente no servidor, instalar pacotes manualmente, criar diretórios e ajustar
permissões na mão. Isso tornava o processo lento e difícil de reproduzir — e
qualquer mudança pequena podia quebrar tudo. Isso sem contar que a
documentação geralmente não acompanhava essas alterações.
Além disso, escalar uma aplicação não era simples. Rodar múltiplas
instâncias da mesma aplicação exigia copiar e configurar tudo de novo em outra
máquina, ou criar uma imagem de VM inteira pra subir em outro host — o que
demandava tempo, memória e bastante coordenação.
Esse cenário também dificultava o rollback. Se uma nova versão dava
problema em produção, não era fácil voltar para a anterior. Muitas vezes, o time
precisava reconfigurar tudo de novo ou torcer para ter um backup funcional.
Esses desafios foram, aos poucos, mostrando a necessidade de soluções
mais confiáveis, rápidas de configurar e fáceis de replicar. E é justamente aí que os
containers entram: para isolar o ambiente, garantir consistência e simplificar todo
esse processo de deploy, sem depender de tantas variáveis externas.
Conceito e definição de container
O conceito de container pode parecer abstrato no começo, especialmente se
você nunca ouviu falar antes. Então, vamos simplificar:

ção à Containers Introdução à containers Página 7 de 16
Pense em um container como uma espécie de caixinha isolada onde você
coloca uma aplicação e tudo que ela precisa para rodar: bibliotecas, dependências,
arquivos de configuração e recursos específicos. Essa "caixinha" fica fechada,
isolada do ambiente externo, garantindo que a aplicação dentro dela sempre rode da
mesma forma, não importa onde ela esteja.
Tecnicamente falando, um container é um ambiente isolado no nível do
sistema operacional. Diferente das máquinas virtuais (que simulam um computador
completo, com sistema operacional e tudo), os containers compartilham o kernel
(núcleo) do sistema operacional do host. Isso significa que containers não precisam
carregar um sistema inteiro para funcionar — eles reutilizam o que já existe no host,
reduzindo drasticamente o uso de recursos.
Dois mecanismos principais do kernel Linux tornam isso possível:
● Namespaces: são responsáveis por criar ambientes isolados. Por
exemplo, cada container tem seu próprio espaço para processos, rede,
sistema de arquivos e usuários. Isso garante que um container não
interfira no outro e que aplicações possam rodar lado a lado, sem conflitos;
● Cgroups (ControlGroups): são utilizados pra controlar a quantidade de
recursos (memória, CPU, disco) que cada container pode utilizar. Assim,
mesmo que um container tente consumir mais recursos que o previsto, ele
fica limitado ao que foi definido, garantindo estabilidade ao sistema inteiro.
Mas por que tudo isso importa?
Porque essa combinação permite que você tenha um ambiente padronizado,
previsível e extremamente portátil. Uma aplicação empacotada em um container
roda exatamente do mesmo jeito na sua máquina, num servidor de teste, em
produção ou até mesmo na nuvem. Isso elimina aquele velho problema de “na
minha máquina funciona”.
Para entender na prática:
Se você desenvolve uma aplicação web que usa Node.js em uma versão
específica, antes você precisava instalar essa versão exata na máquina que rodaria
sua aplicação em produção. Com containers, você simplesmente cria uma imagem
que já contém exatamente essa versão do Node, as dependências e os arquivos

ção à Containers Introdução à containers Página 8 de 16
necessários. Ao subir essa imagem num servidor (com Docker, por exemplo), você
garante que tudo rode exatamente como você planejou — sem erros surpresa.
Namespaces e cgroups: como containers funcionam de verdade?
Quando falamos que os containers são ambientes isolados que compartilham
o kernel do sistema operacional, surge uma pergunta importante: como isso
acontece, exatamente?
Dois mecanismos internos do kernel Linux são os responsáveis diretos por
garantir esse isolamento e a distribuição controlada dos recursos. Eles se chamam
Namespaces e cgroups.
Namespaces: separando ambientes
Pense em namespaces como paredes que separam diferentes ambientes no
seu sistema operacional. Cada namespace isola certos aspectos do sistema, criando
um espaço seguro e isolado para cada aplicação rodar. Assim, processos dentro de
um namespace não têm acesso direto ao que acontece em outro.
No Linux, existem diferentes tipos de namespaces:
● PID Namespace (Process ID): cada container tem sua própria lista de
processos. O processo número 1 em um container pode ser diferente do
processo número 1 em outro container ou no host principal;
● Network Namespace: isola a rede, permitindo que cada container tenha
seu próprio conjunto de interfaces de rede e tabelas de roteamento. Assim,
containers diferentes podem usar portas idênticas sem conflitos;
● Mount Namespace: isola o sistema de arquivos. Cada container tem sua
visão única dos arquivos e diretórios, sem enxergar os arquivos dos outros
containers ou do host, a menos que explicitamente compartilhados;
● UTS Namespace: permite que cada container tenha seu próprio nome de
host (hostname), independente dos outros;
● IPC Namespace (Inter-Process Communication): garante que
mecanismos de comunicação interna entre processos (como filas,
semáforos, memória compartilhada) estejam isolados por container;

ção à Containers Introdução à containers Página 9 de 16
● UserNamespace: separa a identificação de usuários e grupos, permitindo
que um usuário com privilégios dentro do container não tenha os mesmos
privilégios no sistema operacional principal.
Esses namespaces são justamente a base para garantir que cada aplicação
rode como se estivesse completamente isolada, sem nem perceber que outros
containers existem por perto.
Cgroups: controlando os recursos
Agora que você entendeu como namespaces separam as aplicações, a
pergunta que surge é: quem limita os recursos que cada container pode consumir? É
aí que entram os cgroups.
Cgroups (abreviação para "controlgroups") são mecanismos do kernel Linux
que permitem gerenciar e limitar recursos do sistema como CPU, memória, I/O e
largura de banda de rede.
Imagine que você tenha vários containers rodando em um servidor. Se um
deles começar a consumir muita memória ou processador, ele pode prejudicar a
performance de todo o sistema. Com os cgroups, você pode definir limites claros:
● CPU: você define quanto cada container pode usar da CPU, evitando que
um container sobrecarregue todo o sistema;
● Memória: permite definir limites rígidos de memória para cada container,
evitando que um container tome toda a RAM disponível;
● I/O (entrada/saída): você pode definir prioridades e limites para o acesso
ao disco ou a operações de leitura/escrita, garantindo estabilidade no
servidor.
Cgroups, portanto, garantem que mesmo se um container apresentar
problemas de desempenho ou bugs, o impacto sobre outros containers será mínimo
ou inexistente.
Juntos, Namespaces e cgroups são as tecnologias-chave que fazem
containers funcionarem. Com eles, aplicações são empacotadas em ambientes
seguros, eficientes e isolados, permitindo que pessoas desenvolvedoras se
concentrem mais no software e menos na infraestrutura.

ção à Containers Introdução à containers Página 10 de 16
Se você dominar esses conceitos, estará preparado(a) não apenas para usar
containers com segurança, mas também para entender melhor o comportamento
das suas aplicações em ambientes reais de produção.
Comandos básicos do Docker: guia prático para consultar e relembrar
Uma das melhores maneiras de fixar o que você aprendeu é colocar a “mão
na massa”. Para isso, nada melhor do que ter uma lista rápida de consulta sempre
que precisar. A seguir, temos os comandos mais importantes que você viu até
agora, explicados de forma simples para você consultar, relembrar e usar no dia a
dia.
Containers em execução e gerenciamento básico
Esses comandos ajudam a controlar e acompanhar seus containers. São os
comandos que você mais vai usar diariamente:
● Listar containers em execução: docker ps;
● Listar todos os containers (inclusive parados): docker ps –a;
● Executar um container a partir de uma imagem: docker run nome-da-imagem. Exemplo: docker run hello-world;
● Executar um container interativo (com acesso ao terminal): docker run
-it nome-da-imagem /bin/bash. Exemplo: docker run -it ubuntu bash;
● Parar um container em execução: docker stop id-ou-nome-do-container;
● Iniciar novamente um container parado: docker start id-ou-nome-do-container;
● Remover um container parado: docker rm id-ou-nome-do-container;
● Forçar a remoção de um container (mesmo que ainda esteja
rodando): docker rm -f id-ou-nome-do-container.
Trabalhando com imagens
Imagens são as bases dos containers, então você precisa gerenciá-las bem.
Esses comandos vão te ajudar a baixar, listar e remover imagens locais:
● Listar imagens disponíveis localmente: docker images;

ção à Containers Introdução à containers Página 11 de 16
● Baixar uma imagem específica do Docker Hub: docker pull nome-da-imagem. Exemplo: docker pull node:20-alpine;
● Remover uma imagem localmente armazenada: docker rmi nome-ou-id-da-imagem.
Inspecionando detalhes de containers
Inspecionar é importante para entender o que acontece dentro dos seus
containers e diagnosticar possíveis problemas:
● Visualizar logs de execução do container: docker logs id-ou-nome-do-container;
● Obter informações detalhadas sobre um container ou imagem: docker
inspect id-ou-nome-do-container.
Outros comandos úteis no dia a dia
Esses comandos facilitam muito a vida quando você precisa renomear
containers ou executar comandos dentro deles rapidamente:
● Renomear um container: docker rename nome-antigo nome-novo;
● Executar comandos em containers já em execução: docker exec -it
nome-do-container comando. Exemplo: docker exec -it meu-container
bash;
● Copiar arquivos do host para o container: docker cp arquivo
host:/caminho-container;
● Copiar arquivos do container para o host: docker cp
container:/caminho-arquivo destino-host.
Limpando o ambiente Docker
Manter o ambiente limpo é fundamental para evitar problemas com espaço
em disco e garantir que tudo esteja funcionando bem:
● Remover containers parados automaticamente: docker container
prune;
● Remover imagens não utilizadas: docker image prune;
● Limpar todos os recursos Docker não utilizados: docker system prune.

ção à Containers Introdução à containers Página 12 de 16
Com esses comandos na mão, você já está preparado(a) para lidar com
Docker no seu dia a dia com muito mais agilidade e segurança. Consulte sempre
que precisar relembrar ou revisar algo, porque dominar esses comandos faz toda a
diferença no seu trabalho com containers.

ção à Containers Introdução à containers Página 13 de 16
O QUE VOCÊ VIU NESTA AULA?
Ao longo dessa aula, você deu os primeiros passos no universo dos
containers e entendeu como eles se tornaram tão importantes para o
desenvolvimento e deploy modernos.
Começamos explorando os desafios do passado: ambientes inconsistentes,
dependências conflitantes e o alto custo de rodar múltiplas aplicações em máquinas
virtuais. Em seguida, você conheceu os containers como solução para esses
problemas — oferecendo isolamento leve, portabilidade e eficiência.
Parabéns por chegar até aqui! Agora sim, você tem uma base sólida pra
construir, testar e escalar suas aplicações com containers.

ção à Containers Introdução à containers Página 14 de 16
REFERÊNCIAS
DOCKER INC. Docker Documentation. 2025. Disponível em:
https://docs.docker.com/get-started/. Acesso em: 26 mai. 2025.
HIGHTOWER, K.; BURNS, B.; BEDA, J. Kubernetes: Upand Running –
Diveintothe Future ofInfrastructure. 2. ed. Sebastopol: O’Reilly Media, 2019.
MERKEL, D. Docker: lightweight Linux containers for consistent development
and deployment. Linux Journal, 2014. Disponível em:
https://dl.acm.org/doi/10.5555/2600239.2600241. Acesso em: 26 mai. 2025.

ção à Containers Introdução à containers Página 15 de 16
PALAVRAS-CHAVE
Containers. Virtualização. Docker.

ção à Containers Introdução à containers Página 16 de 16

---

## Aula 02, Imagens e Containers

Fonte: https://drive.google.com/file/d/1d_0oGrNM7fD6ZmLycLdYOb9IDIAW-kcf/view

Imagens e containers Imagens e containers Página 1 de 14
| AULA 02 -
DEVOPS E ARQUITETURA CLOUD
FASE 2
IMAGENS E CONTAINERS

 e containers Imagens e containers Página 2 de 14
SUMÁRIO
O QUE VEM POR AÍ?...............................................................................................3
HANDS ON ...............................................................................................................4
SAIBA MAIS..............................................................................................................5
O QUE VOCÊ VIU NESTA AULA? ...........................................................................11
REFERÊNCIAS.........................................................................................................12

 e containers Imagens e containers Página 3 de 14
O QUE VEM POR AÍ?
Agora que a gente já passou pelos conceitos iniciais e entendeu o que é um
container, como ele se diferencia de uma máquina virtual e qual a lógica por trás da
arquitetura que o Docker utiliza, chegou a hora da parte prática.
Nesta aula, vamos falar sobre imagens Docker: o que elas são, como se
relacionam com containers e qual o papel delas no dia a dia de quem desenvolve ou
opera aplicações. Vamos explorar o Docker Hub, conhecer alguns comandos
fundamentais como dockerpull, dockerrun, dockerps e docker stop, e entender como
lidar com o ciclo de vida de containers — desde o momento em que você baixa uma
imagem até a hora de remover ou recriar um container.

 e containers Imagens e containers Página 4 de 14
HANDS ON
Chegamos na parte prática e agora é a hora de começar a fazer. A ideia aqui
é pegar todo o conteúdo e ver como isso se traduz na vida real, no terminal, onde a
coisa acontece de verdade.
No primeiro vídeo, a gente vai bater um papo sobre o que é uma imagem
Docker — com calma, sem mistério. Você vai entender qual é a diferença entre
imagem e container, por que isso importa e como essa estrutura toda facilita a nossa
vida no desenvolvimento. Temos uma analogia com receita e prato pronto que pode
parecer boba, mas ajuda bastante a visualizar.
O segundo vídeo, é mão na massa. Terminal aberto e comandos direto ao
ponto: como encontrar imagens no Docker Hub, como baixar, rodar, parar e remover
containers. Vamos usar o Nginx como exemplo e fazer tudo isso junto. O objetivo
aqui é te deixar confortável com o básico que você vai usar todo dia.
No terceiro vídeo, a gente sobe um nível. Mostraremos como criar imagens
mais limpas, mais seguras e preparadas pra produção. Aí entra o “multistage build”,
além de umas dicas para evitar uma imagem gigante e também como identificar o
que “deu ruim” quando o build quebra. Aqui teremos o suficiente pra você sair com
uma base sólida e saber por onde seguir.
Se quiser, pode ir abrir o terminal e testar junto comigo!

 e containers Imagens e containers Página 5 de 14
SAIBA MAIS
Docker Hub e repositórios de imagens
Docker Hub é o repositório oficial e mais utilizado para armazenar, distribuir e
gerenciar imagens Docker. É como se fosse um "GitHub das imagens Docker", feito
para simplificar. O Docker Hub permite que você encontre facilmente imagens
prontas para uso, como o Nginx, o Node.js, ou até mesmo sistemas operacionais
inteiros, como Ubuntu e Alpine.
Essas imagens podem ser organizadas em dois tipos principais de
repositórios:
Repositórios públicos: são acessíveis a qualquer pessoa. Não precisa nem
fazer login para baixar uma imagem pública do Docker Hub. Por exemplo, se você
roda o comando:
dockerpullnginx
automaticamente você baixa a imagem oficial e pública do Nginx que está
disponível no Docker Hub.
Os repositórios públicos são ótimos para distribuir software open-source ou
imagens oficiais mantidas por grandes empresas ou comunidades.
Repositórios privados: aqui, o acesso é controlado. Normalmente são
usados por empresas ou indivíduos que não querem expor suas imagens ao público
geral. Para baixar imagens privadas você precisa se autenticar no Docker Hub,
usando o comando:
docker login
Depois disso, é só rodar:
dockerpull nome-da-imagem
Essa abordagem permite que times e organizações controlem exatamente
quem acessa suas imagens, garantindo segurança e privacidade.

 e containers Imagens e containers Página 6 de 14
E como empresas maiores lidam com isso?
Em ambientes corporativos, o cenário é um pouco diferente. Muitas empresas
grandes preferem hospedar seus próprios repositórios privados dentro da
infraestrutura interna ou em serviços de cloud específicos, como:
● AWS Elastic Container Registry (ECR);
● Azure Container Registry (ACR);
● Google Container Registry (GCR);
● JFrog Artifactory ou Harbor (soluções open-source e auto-hospedadas).
Essas ferramentas permitem maior controle sobre segurança, compliance e
armazenamento. Além disso, elas costumam se integrar diretamente com pipelines
de CI/CD, automatizando a criação, distribuição e atualização das imagens internas.
Na prática, uma empresa pode ter uma estratégia híbrida:
● Imagens comuns (como bases Alpine ou Ubuntu) são buscadas no Docker
Hub público;
● Imagens sensíveis, que contêm o código da aplicação proprietária, ficam
guardadas em repositórios internos, acessíveis apenas pela equipe
autorizada.
Pontos para sempre relembrar:
✓ Docker Hub é o ponto inicial para descobrir e utilizar imagens públicas;
✓ Use imagens públicas sempre que possível, desde que confiáveis e
verificadas;
✓ Use imagens privadas para código sensível ou interno, controlando o
acesso cuidadosamente;
✓ Em ambientes maiores, considere soluções internas ou de terceiros para
melhor segurança e controle.
Se precisar voltar aqui, lembre-se: esses conceitos não mudam muito, mas as
ferramentas e boas práticas evoluem constantemente. Vale sempre revisar
periodicamente e ficar por dentro das novidades!

 e containers Imagens e containers Página 7 de 14
Dockerfile (FROM, RUN, CMD, COPY, WORKDIR)
Se tem uma coisa que você vai escrever muito ao trabalhar com Docker, é o
tal do Dockerfile. Ele é só um arquivo de texto, mas com muito poder: é ali que você
define o passo a passo para construir a imagem que vai rodar sua aplicação.
Funciona como um script declarativo — você diz o que quer que aconteça e o
Docker constrói.
O processo é bem linear, e com o tempo você decora a ordem das instruções.
Mas no começo, vale entender o papel de cada uma.
FROM
Tudo começa com o FROM. É aqui que você escolhe a base da sua imagem.
Pode ser o Node, o Python, o Ubuntu ou qualquer outra coisa. O mais comum é usar
imagens oficiais que já vêm prontas no Docker Hub.
Exemplo: FROM node:20
Isso quer dizer: “pegue a imagem do Node na versão 20 e comece a construir
em cima dela”.
WORKDIR
Depois disso, é comum definir um diretório de trabalho com WORKDIR. Isso
nada mais é do que dizer: “a partir de agora, tudo que eu fizer vai ser dentro desta
pasta aqui”. Isso evita que você tenha que dar comandos com caminhos longos o
tempo todo.
Exemplo: WORKDIR /app
COPY
Aí vem o COPY, que serve para colocar seus arquivos dentro da imagem. Ele
seleciona o que está em sua máquina e joga dentro da imagem que está sendo
construída.
Exemplo: COPY . /app
Isso copia tudo o que está no diretório atual para o /app da imagem.
RUN

 e containers Imagens e containers Página 8 de 14
Com os arquivos no lugar, você pode executar comandos com RUN. Ele é
muito usado para instalar dependências, criar pastas, mover arquivos, o que for
necessário durante a construção da imagem.
Exemplo: RUN npminstall
Esse comando vai rodar dentro da imagem e o resultado fica salvo como uma
camada nova.
CMD
Por fim, vem o CMD, que define o comando que vai rodar quando o container
for iniciado. É como dizer: “quando alguém rodar essa imagem, execute isso aqui
por padrão”.
Exemplo: CMD ["node", "index.js"]
Isso vai rodar o index.js usando o Node quando o container subir.
A ordem dessas instruções importa, principalmente porque o Docker guarda o
cache de cada etapa. Se você mudar algo no topo do Dockerfile, ele vai reconstruir
tudo abaixo. Agora, se você só mexer no CMD, por exemplo, ele reaproveitará o
restante.
Com o tempo você vai aprender a montar Dockerfiles mais limpos, diretos e
fáceis de manter. Mas comece entendendo bem o básico: que o Dockerfile é onde
você escreve a lógica de construção da sua imagem. Sem mágica, sem mistério. Só
prática e clareza.
Imagens base e minimalismo
Se você já viu imagens com nomes do tipo node:alpine ou python:3.11-slim e
ficou se perguntando o que muda, a resposta é: muita coisa. Essas versões são
conhecidas como imagens enxutas — ou minimalistas. Elas são menores, ocupam
menos espaço em disco e, em geral, são mais rápidas pra transferir e subir. E para
quem trabalha com deploy, isso pesa.
Mas calma, não é só vantagem. Quando você escolhe uma imagem enxuta,
você também abre mão de várias coisas que vêm “de fábrica” nas imagens maiores.
A alpine, por exemplo, é uma distribuição Linux mínima, com menos de 10MB. Bem
leve, mas também bem limitada. Muita coisa que você acha que “vem por padrão”,

 e containers Imagens e containers Página 9 de 14
por exemplo bash, curl, ou até ferramentas básicas de build, simplesmente não
estão lá. E aí você vai ter que instalar manualmente com apkadd (o gerenciador de
pacotes do Alpine).
Já as versões slim seguem a mesma ideia: removem o que não é essencial,
mas sem ir tão longe quanto o alpine. Costumam funcionar melhor quando você
precisa de um meio-termo — menos peso, mas ainda com alguma estrutura útil.
Então, quando usar? Se você tá preparando uma imagem para ambiente de
produção e já sabe exatamente o que vai rodar dentro do container, usar alpine ou
slim pode ser uma boa. Isso reduz o tamanho final da imagem e diminui a superfície
de ataque, o que também ajuda em segurança.
Agora, para ambiente de desenvolvimento ou quando você ainda está
montando o Dockerfile e não sabe o que vai precisar instalar, talvez seja melhor
começar com uma imagem mais completa. Depois que tudo estiver funcionando, aí
sim você pode tentar “secar” a imagem.
No fim, a escolha da imagem base tem a ver com equilíbrio. O mais leve nem
sempre é melhor. Comece com o que te dá menos “dor de cabeça”, e vá otimizando
depois. Sem pressa, sem sofrimento.
Multistage Builds
Sabe quando você precisa instalar um monte de coisa só para compilar ou
construir sua aplicação, mas depois que ela está pronta, nada disso precisa estar no
ambiente final? Pois é, o Multistage Build resolve exatamente isso.
A ideia é simples: você usa uma imagem cheia de ferramentas somente
durante a fase de build, e depois copia apenas o que interessa para uma imagem
mais limpa, que vai ser usada na hora de rodar a aplicação. Isso ajuda a manter a
sua imagem final menor, mais segura e sem “tralha” desnecessária.
Na prática, funciona assim: você define uma etapa FROM para build, faz o
que precisa (instala dependência, roda build, compila, etc.), e depois abre um novo
FROM limpo, copiando só os arquivos que você precisa executar de fato.
Por exemplo, no caso de uma app Node.js:

 e containers Imagens e containers Página 10 de 14
# Etapa 1 - build
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install &&npm run build
# Etapa 2 - produção
FROM node:20-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
CMD ["node", "dist/index.js"]
Comando de Prompt 1 – Etapa FROM para build
Fonte: elaborado pelo autor (2025)
A primeira etapa instala tudo, roda o build, e a segunda só carrega o
resultado. Nada de node_modules, ferramentas de build ou arquivos temporários
indo parar na imagem final.
Esse padrão é bem comum em projetos mais maduros, porque ajuda a deixar
o deploy mais leve e evita que coisas desnecessárias (ou até perigosas) acabem
indo parar em produção.
Se você ainda não usa, comece a testar em projetos pequenos. Depois que
você se acostumar, vira um padrão.

 e containers Imagens e containers Página 11 de 14
O QUE VOCÊ VIU NESTA AULA?
Ao longo dessa aula, a gente saiu do conceito e foi para a prática.
Começamos entendendo o que é uma imagem Docker, como ela se relaciona com
um container e por que isso é importante. Discutimos a diferença entre imagem e
container — uma é o modelo, a outra é a execução — e reforçamos isso com
exemplos e analogias que ajudam a visualizar o que acontece de verdade por trás
do docker run.
Se você ficou alguma dúvida, volte aos vídeos, leia os materiais de apoio com
calma e tente repetir os comandos por conta própria. E se você já está confortável
com o que rolou aqui, ótimo! Na próxima aula, seguiremos nos aprofundando.

 e containers Imagens e containers Página 12 de 14
REFERÊNCIAS
DOCKER INC. Dockerfilereference. 2024. Disponível em:
https://docs.docker.com/reference/dockerfile/. Acesso em: 27 maio 2025.
MERKEL, D. Docker: lightweight Linux containers for consistent development
and deployment.Linux Journal, n. 239, 2014. Disponível em:
https://linuxjournal.com/article/8391. Acesso em: 27 maio 2025.
TURNBULL, J. The Docker book: containerization is the new virtualization. [S.l.]:
James Turnbull, 2014.

 e containers Imagens e containers Página 13 de 14
PALAVRAS-CHAVE
Docker. Imagem. Container.

 e containers Imagens e containers Página 14 de 14

---

## Aula 03, Dockerfile e Build de Imagens

Fonte: https://drive.google.com/file/d/1aGwaOulbu2NUGjzAmeVJudHoQss0sHgy/view

Dockerfile e build de imagens Dockerfile e build de imagens Página 1 de 16
| AULA 03 -
DEVOPS E ARQUITETURA CLOUD
FASE 2
DOCKERFILE E BUILD
DE IMAGENS

 e build de imagens Dockerfile e build de imagens Página 2 de 16
SUMÁRIO
O QUE VEM POR AÍ? ....................................................................................3
HANDS ON.....................................................................................................4
SAIBA MAIS ...................................................................................................5
O QUE VOCÊ VIU NESTA AULA?.................................................................12
REFERÊNCIAS ..............................................................................................13

 e build de imagens Dockerfile e build de imagens Página 3 de 16
O QUE VEM POR AÍ?
Depois de entender como funcionam os Dockerfiles e de criar as suas
próprias imagens, é hora de dar um passo além. Neste trecho da jornada, a gente
vai olhar para o que realmente importa quando o assunto é colocar aplicações em
produção: segurança, otimização e confiabilidade.
Vamos explorar o conceito de multistage builds, aprender a reduzir o tamanho
das imagens, evitar riscos desnecessários e escrever Dockerfiles que aguentem o
tranco de ambientes reais. Se você já escreveu um Dockerfile antes, mas sentia que
dava para melhorar, esta aula vai te mostrar como.

 e build de imagens Dockerfile e build de imagens Página 4 de 16
HANDS ON
Chegamos na parte prática da aula A proposta destes vídeos é justamente
mostrar como aplicar boas práticas de Dockerfile voltadas para a produção. Ao longo
das videoaulas você verá não só o passo a passo da construção de uma imagem
otimizada, mas também como lidar com os desafios reais que surgem no build e na
configuração de ambientes mais seguros.
Na primeira aula, vamos focar no conceito de Multistage Builds. Você vai
entender como separar o ambiente de build do ambiente de execução, podendo,
assim, deixar suas imagens mais leves, rápidas e organizadas. É uma prática muito
usada em produção e vamos construí-la juntos, do zero.
Na segunda videoaula, o foco é a segurança. Vamos revisar o uso de
imagens base mais enxutas, como alpine, e também boas práticas sobre como não
rodar como root e isolar arquivos sensíveis. Tudo isso com exemplos reais e
comandos que você pode adaptar para o seu projeto.
Pra fechar, a terceira videoaula é um combo completo: vamos construir, ao vivo, um
Dockerfile pronto para produção, aplicando as técnicas de multistage, segurança e
também estratégias de troubleshooting. Se algo der errado no meio do caminho (e
spoiler: vai dar! rs), você verá como identificar o problema e resolver.

 e build de imagens Dockerfile e build de imagens Página 5 de 16
SAIBA MAIS
Imagens base: alpine, slim e distroless
Na hora de escolher uma imagem base, vale pensar com carinho o que
realmente é necessário dentro do seu container. Quanto mais leve for a sua
imagem, menor será o tempo de build, o tempo de deploy e a superfície de ataque.
É aí que entram opções como alpine, slim e distroless.
A alpine é uma distribuição Linux mínima, com cerca de 5MB. Ela já vem
empacotada para funcionar em diversos contextos e é compatível com o apk, o
gerenciador de pacotes dela. A Alpine é muito usada por quem quer deixar o
container o mais enxuto possível, mas ela pode dar um pouco mais de trabalho caso
você precise compilar ou instalar bibliotecas que dependam de outras distribuições
mais completas.
Já a slim é uma versão reduzida da imagem padrão — por exemplo, node:18-
slim — que ainda mantém a compatibilidade com a maioria dos pacotes do Debian,
mas corta extras desnecessários. É uma escolha equilibrada pra quem quer reduzir
peso, mas ainda precisa de uma base estável.
Por fim, o distroless vai ainda mais longe: ele não tem shell, nem gerenciador
de pacotes, nem utilitários do sistema. Só leva o que sua aplicação realmente
precisa pra rodar. É excelente pra produção, especialmente do ponto de vista de
segurança, mas exige que o build seja muito bem feito e normalmente precisa de
multistage builds pra funcionar direito.
Segurança em containers: namespaces, capabilities e seccomp
Quando a gente fala sobre segurança em containers, é fácil cair na armadilha
de achar que o Docker já isola tudo e pronto, tá seguro. Mas não é bem assim. O
container não é uma VM — ele compartilha o kernel com o host. Isso quer dizer que,
se alguém escapar do container, pode ter acesso direto ao sistema. Para evitar esse
tipo de problema, o Linux oferece algumas ferramentas poderosas. As principais
delas são os namespaces, as capabilities e o seccomp. Vamos por partes.
Começando pelos namespaces. Eles são responsáveis por isolar recursos do
sistema. Quando você sobe um container, ele ganha um namespace próprio para

 e build de imagens Dockerfile e build de imagens Página 6 de 16
várias coisas: processos (PID), sistema de arquivos (mount), rede (net), usuários
(user), etc. Isso significa que o que acontece dentro do container não "vaza" — ou
pelo menos, não deveria. É por isso que um processo rodando no container só
enxerga os outros processos daquele mesmo container, mesmo que na prática ele
esteja compartilhando o kernel com outros containers ou com o host.
Já as capabilities são um controle mais fino sobre o que um processo pode
ou não pode fazer. Por padrão, o root dentro do container não é tão poderoso
quanto o root do host — ele vem com várias permissões a menos. Isso é proposital.
E você pode customizar isso com a flag --cap-drop pra remover capacidades
perigosas (como NET_ADMIN, SYS_ADMIN, etc.), ou --cap-add se realmente
precisar de alguma. A ideia aqui é seguir o princípio do menor privilégio: dê para o
container só o que ele precisa pra funcionar. Nada mais.
E, por fim, tem o seccomp, que é um firewall para syscalls. O Linux tem
centenas de chamadas de sistema, e o seccomp permite bloquear várias delas com
base numa whitelist. O Docker já vem com um perfil padrão que bloqueia chamadas
perigosas (como aquelas que permitem montar novos dispositivos ou modificar o
sistema de arquivos), mas você pode criar seu próprio perfil personalizado se quiser
ser ainda mais restritivo.
Essas três camadas formam a base da segurança de containers no nível do
sistema operacional. Elas trabalham juntas para limitar o escopo e o impacto do que
roda ali dentro. Mas claro: segurança não é só isso. Uma imagem mal construída ou
uma aplicação vulnerável continua sendo um risco. Por isso, o ideal é combinar
essas técnicas com outras boas práticas, como não rodar como root, manter
dependências atualizadas, usar imagens mínimas e aplicar patches com frequência.
Se você quer colocar containers em produção com confiança, entender esses
mecanismos vai te dar muito mais controle e previsibilidade. Vale demais reservar
um tempo para estudar cada um com calma e ver como aplicar em seus projetos do
dia a dia.
Usuários não root e boas práticas de permissões
Agora vamos falar de um dos tópicos mais importantes — e muitas vezes
ignorado — quando a gente começa a colocar containers em produção: rodar como
root ou não. Spoiler: a resposta quase sempre é não.

 e build de imagens Dockerfile e build de imagens Página 7 de 16
Por padrão, quando você sobe um container, ele roda como root. E o root
dentro do container é praticamente o mesmo root do host. Mesmo que ele esteja
tecnicamente isolado, isso é um risco enorme. Se alguém conseguir escapar do
container (sim, isso pode acontecer), vai ter acesso privilegiado ao seu sistema. E
aí, já era.
A primeira boa prática aqui é criar um usuário não privilegiado dentro da
imagem, e forçar o container a rodar com ele. Você pode fazer isso com o comando
adduser (ou useradd, dependendo da imagem base) e depois usar USER
nomedousuario. E mais: se os arquivos da aplicação forem copiados para o
container, o ideal é já definir o dono desses arquivos com --chown.
Por exemplo:
FROM node:18-alpine
RUN adduser -D appuser
USER appuser
WORKDIR /app
COPY --chown=appuser . .
RUN npm ci
CMD ["npm", "start"]
Comando de Prompt 1 – Definindo o dono dos arquivos com –chown
Fonte: elaborado pelo autor (2025)
Aqui você garante que:
● Existe um usuário chamado appuser sem privilégios de root;
● O WORKDIR está no controle dele;
● Os arquivos foram copiados já com a permissão correta;
● Toda a aplicação roda com permissões limitadas.
Isso impede que qualquer tentativa de escalar privilégios tenha sucesso — o
processo dentro do container não tem poder para alterar configurações críticas,
montar volumes perigosos, acessar arquivos do host nem modificar a rede.
Outro ponto importante é: evite usar chmod 777 para resolver problemas de
permissão. Isso é como se fosse um “jeitinho”. O ideal é entender quem deve ser
dono do quê e garantir que os diretórios e arquivos tenham permissões mínimas
necessárias — nada mais.

 e build de imagens Dockerfile e build de imagens Página 8 de 16
Se você estiver usando volumes externos (com docker run -v ou no docker-compose), é bom garantir que o host também permita o acesso do usuário não root.
Em alguns casos, pode ser necessário mapear o UID/GID corretos — principalmente
se você estiver rodando a aplicação em ambiente Linux mais restrito.
Ou seja: não use root sem necessidade. Criar um usuário próprio, setar
permissões corretas e cuidar dos arquivos dentro do container são práticas simples
que reduzem MUITO a superfície de ataque.
Lembre-se: um container seguro começa na imagem. E imagem segura
começa com um bom Dockerfile.
Dockerignore e build context
Quando você roda um docker build, o Docker precisa saber o que ele vai
copiar para o contexto de build — basicamente, tudo que está na pasta onde você
roda o comando (ou no caminho que você passar).
Isso é o chamado build context. E é aqui que muita gente se atrapalha.
Por padrão, se você não filtrar nada, o Docker vai tentar mandar tudo que
está naquela pasta para o processo de build. Isso inclui .git, node_modules, arquivos
grandes, segredos... tudo mesmo. Isso não só deixa o build mais lento, como
também pode vazar dados sensíveis para a imagem final.
É aí que entra o .dockerignore. Ele funciona como um .gitignore, só que para
build. Você lista nele o que não deve ser enviado para o build context — simples
assim:
.git
node_modules
.env
.vscode
*.log
Comando de Prompt 2 – .dockerignore
Fonte: elaborado pelo autor (2025)
Com isso, o Docker ignora essas pastas e arquivos quando empacota o build
context. Resultado? Build mais rápido, imagem menor e mais segura.

 e build de imagens Dockerfile e build de imagens Página 9 de 16
Aliás, se o seu build estiver demorando demais ou parecendo pesado demais,
confira o que está no contexto. Muita gente manda gigas sem saber, só porque
esqueceu de ignorar.
Outra boa prática é sempre rodar o docker build o mais perto possível do
Dockerfile, e garantir que sua estrutura de pastas esteja organizada. Isso evita
surpresas.
Enfim, usar .dockerignore é obrigatório se você quer construir imagens
limpas, seguras e eficientes. Não é frescura — é parte do básico bem feito.
Estratégias de cache em builds com npm, pip, etc
Se você já rodou um docker build mais de uma vez, talvez tenha notado: às
vezes o build voa, às vezes demora uma eternidade. A diferença quase sempre está
no cache.
O Docker armazena o resultado de cada instrução do Dockerfile em camadas.
Se ele encontrar uma camada idêntica a uma que já construiu antes, ele reaproveita
o cache e segue em frente. Só que para isso acontecer, você precisa saber como
escrever o Dockerfile do jeito certo.
Ao longo desta aula, você viu como escrever Dockerfiles mais completos e
seguros, aplicando práticas que são comuns em ambientes de produção. Aprendeu
a usar multistage builds para reduzir o tamanho das imagens, explorou estratégias
de segurança para manter seu ambiente mais protegido e também passou por
técnicas de troubleshooting que ajudam bastante quando o build não sai como
esperado. Agora é hora de aplicar tudo isso nos seus próprios projetos:
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
Comando de Prompt 2 – .Copy package. json
Fonte: elaborado pelo autor (2025)
Por que nessa ordem? Porque o npm ci só depende dos arquivos de
dependência. Se você copiar o projeto inteiro antes e fizer alguma alteração num
arquivo qualquer, o Docker vai invalidar o cache inteiro, incluindo a camada do npm
ci. Aí, mesmo sem mudar dependência nenhuma, o build baixa tudo de novo —
perda de tempo.

 e build de imagens Dockerfile e build de imagens Página 10 de 16
A regra é: copie primeiro o mínimo necessário pra instalar as dependências,
rode a instalação, e só depois copie o restante do projeto.
Vale a mesma lógica para o pip, yarn, pnpm, composer... qualquer
gerenciador de dependências. O que muda são os nomes dos arquivos:
# Python
COPY requirements.txt .
RUN pip install -r requirements.txt
# PHP
COPY composer.json composer.lock ./
RUN composer install
# Node com pnpm
COPY pnpm-lock.yaml ./
RUN pnpm install
Outra boa prática é usar --frozen-lockfile ou ci sempre que possível para evitar
surpresas e garantir builds mais previsíveis.
Se você quer builds rápidos, confiáveis e sem estresse, pensar no cache não
é opcional, é parte do ofício. Escrever Dockerfile é quase uma arte — e o cache bem
usado é o seu melhor pincel.
Ferramentas de análise de imagem: Dive e Snyk
Criar imagens pequenas e seguras não é só uma questão de boas práticas: é
uma necessidade real quando a gente pensa em produção. E embora escrever um
Dockerfile enxuto já ajude bastante, chega uma hora que você precisa ir além do
olho e começar a inspecionar a sua imagem de verdade.
É aí que entram ferramentas como o Dive e o Snyk.
O Dive é como uma lupa nas suas camadas. Ele mostra exatamente o que foi
adicionado em cada RUN, COPY, ADD — te dá uma visão clara do que está
pesando e do que pode ser retirado. Com ele, você consegue ver, por exemplo, que
aquele apt-get install gigante está enchendo a imagem com vários pacotes que nem
são usados na fase final. É muito prático para quem está ajustando o Dockerfile e
quer manter o build sob controle.
Já o Snyk entra na parte de segurança. Ele escaneia sua imagem em busca
de vulnerabilidades conhecidas, usando uma base de dados sempre atualizada.

 e build de imagens Dockerfile e build de imagens Página 11 de 16
Instalar uma dependência com CVE grave? O Snyk vai apontar. Rodar com imagem
base desatualizada? Ele avisa também. E o melhor, funciona via CLI, fácil de
integrar em pipelines, e também tem um dashboard bonito se você estiver usando
junto com o time.
Ambos cumprem papéis diferentes, mas se complementam muito bem: o Dive
te ajuda a entender o tamanho da imagem, o Snyk cuida da segurança. Juntos, eles
deixam seu container mais enxuto, confiável e pronto para a produção.
Se você ainda não usou nenhum dos dois, vale parar uns minutos e
experimentar. É aquele tipo de ferramenta que, depois de usar uma vez, vira parte
do seu processo para sempre.

 e build de imagens Dockerfile e build de imagens Página 12 de 16
O QUE VOCÊ VIU NESTA AULA?
Nesta aula, vimos como escolher imagens base adequadas (alpine, slim e
distroless) para otimizar tamanho, desempenho e segurança, além de práticas
essenciais como uso de .dockerignore para reduzir o contexto de build e estratégias
de cache com gerenciadores de dependências (npm, pip, composer, etc.) para
acelerar builds. Também exploramos o uso de multistage builds para criar imagens
mais leves e a importância de ferramentas como Dive e Snyk para análise de
camadas e identificação de vulnerabilidades.
No aspecto de segurança, aprendemos como namespaces, capabilities e
seccomp reforçam o isolamento dos containers e como rodar aplicações com
usuários não root reduz riscos de escalonamento de privilégios. Ajustar permissões
corretamente, manter imagens enxutas e aplicar boas práticas no Dockerfile são
medidas que fortalecem a proteção em produção. Assim, unir eficiência no build com
foco em segurança garante imagens mais confiáveis e preparadas para um uso real.

 e build de imagens Dockerfile e build de imagens Página 13 de 16
REFERÊNCIAS
DOCKER INC. Dockerfile reference. 2025. Disponível em:
https://docs.docker.com/engine/ . Acesso em: 20 ago. 2025.
HIGHTOWER, K.; BURNS, B.; BEDA, J. Kubernetes: Up and Running. 2. ed.
Beijing: O’Reilly Media, 2019.
MERKEL, D. Docker: lightweight Linux containers for consistent development
and deployment.Linux Journal. Edição 239, 2014. Disponível em:
https://linuxjournal.com/content/docker-lightweight-linux-containers-consistent-development-and-deployment. Acesso em: 20 ago. 2025.

 e build de imagens Dockerfile e build de imagens Página 14 de 16
PALAVRAS-CHAVE
Docker. Containerização. Segurança da informação.

 e build de imagens Dockerfile e build de imagens Página 15 de 16

 e build de imagens Dockerfile e build de imagens Página 16 de 16

---

## Aula 04, Volumes e Redes

Fonte: https://drive.google.com/file/d/1xJl-MJB6xB1nwNOB4IN74uxy7xFml5rA/view

Volumes e Redes Volumes e Redes Página 1 de 19
| AULA 04 -
DEVOPS E ARQUITETURA CLOUD
FASE 2
VOLUMES E REDES

 e Redes Volumes e Redes Página 2 de 19
SUMÁRIO
O QUE VEM POR AÍ?...............................................................................................3
HANDS ON ...............................................................................................................4
SAIBA MAIS..............................................................................................................5
MERCADO, CASES E TENDÊNCIAS ......................................................................15
O QUE VOCÊ VIU NESTA AULA? ...........................................................................16
REFERÊNCIAS.........................................................................................................17

 e Redes Volumes e Redes Página 3 de 19
O QUE VEM POR AÍ?
Você já percebeu que, quando um container é destruído, tudo o que estava
dentro dele simplesmente some? Pois é. E também já deve ter notado que, para
apps mais complexos, os containers precisam “conversar” entre si — como uma API
batendo num banco de dados ou em um serviço de autenticação.
Essa aula é o ponto de virada para quem quer levar containers para o mundo
real: você vai aprender a salvar dados de forma segura e com volumes, assim como
conectar múltiplos containers de maneira organizada usando redes Docker. A gente
vai fazer isso de um jeito simples, com teoria na medida certa e muita prática,
mostrando o que realmente importa no dia a dia de quem desenvolve e sobe apps
em um ambiente containerizado.
E mais: além de entender os conceitos, você vai praticar criando volumes,
montando redes personalizadas e resolvendo problemas reais como um dev
experiente.
Se prepara, porque depois dessa aula seus containers vão ficar muito mais
robustos, estáveis e profissionais.

 e Redes Volumes e Redes Página 4 de 19
HANDS ON
Agora é a hora de ver tudo funcionando de verdade. Nesta aula prática,
vamos entender como persistir dados de containers e como eles se comunicam
entre si em redes isoladas e organizadas.
Você vai entender na prática por que volumes são essenciais em qualquer
app sério — e também como criar redes sob medida para o seu ambiente de
containers. Vamos ver o que é possível, o que é recomendável e o que pode causar
problema caso você ignore.
Na primeira parte da aula, vamos ver por que containers perdem dados, o que
são volumes e como isso tudo funciona na prática. Você vai aprender o básico de
como criar volumes, inspecionar e remover — tudo de forma simples, com exemplos
reais.
No segundo vídeo, vamos subir containers com volumes montados, usar o -v,
explorar o conteúdo desses volumes e depois mergulhar nas redes Docker. Você vai
conhecer os tipos de redes (bridge, host e none), entender o papel de cada uma e
quando usar.
No terceiro vídeo, é hora de ir além: vamos criar redes personalizadas,
conectando containers, testando comunicação entre serviços e discutindo boas
práticas. Tudo com foco em um ambiente robusto e escalável, como deve ser em
uma produção.

 e Redes Volumes e Redes Página 5 de 19
SAIBA MAIS
Volumes Docker: funcionamento interno e drivers
Quando falamos em persistência de dados no Docker, inevitavelmente
estamos falando de volumes. Eles são a forma oficial, segura e recomendada de
manter dados fora do ciclo de vida efêmero dos containers. Mas o que realmente
acontece por trás do docker volume create?
Como o Docker gerencia volumes
Quando você cria um volume, o Docker registra esse recurso em seu próprio
mecanismo de metadados interno. Ele sabe onde o volume está no sistema de
arquivos do host, qual driver está usando e qual container está usando aquele
volume. Por padrão, esse volume é armazenado em um caminho como:
/var/lib/docker/volumes/[nome_do_volume]/_data
Comando de Prompt 1 – Volume sendo armazenado no caminho
Fonte: elaborado pelo autor (2025)
Esse _data é aquilo que o container enxerga quando você monta o volume, e
o Docker se encarrega de conectar esse diretório ao caminho interno do container
que você definiu, como por exemplo /var/lib/mysql.
Se estiver usando uma engine diferente, como containerd ou cri-o, o
funcionamento geral segue a mesma lógica, mas o caminho físico pode variar.
O que são drivers de volume
O Docker permite usar drivers diferentes para gerenciar onde e como os
dados são armazenados. Cada driver implementa uma forma específica de criar,
montar e gerenciar volumes. Os mais comuns são:
● local (padrão): usa o sistema de arquivos do host. Simples, rápido e
suficiente para a maioria dos casos;
● nfs: permite montar volumes armazenados em servidores NFS, útil para
clusters e compartilhamento em rede;
● tmpfs: armazena tudo na RAM e desaparece ao reiniciar. Serve para
dados temporários e testes;

 e Redes Volumes e Redes Página 6 de 19
● drivers de terceiros: como rexray, portworx, que integram com soluções
de storage enterprise como EBS, Azure Disk, Ceph, entre outros.
Você escolhe o driver no momento da criação:
docker volume create --driver local meu-volume
Comando de Prompt 2 – Escolhendo o driver no momento da criação
Fonte: elaborado pelo autor (2025)
Ou, para um volume NFS:
docker volume create \
 --driver local \
 --opt type=nfs \
 --opt o=addr=192.168.1.100,rw \
--opt device=:/dados/nfs \
volume-nfs
Comando de Prompt 3 – Volume NFS
Fonte: elaborado pelo autor (2025)
Como escolher o driver ideal
Depende do seu cenário:
● Ambiente de desenvolvimento: use o driver local. É simples e resolve
bem;
● Ambiente de produção com múltiplos hosts:nfs ou outro driver remoto
pode ser necessário;
● Necessidade de performance de leitura/escrita em memória: tmpfs
pode ser útil;
● Ambiente em cloud com orquestrador: drivers especializados como
rexray com EBS ou plugins CSI no Kubernetes são boas opções.
Comece com o volume local. Ele atende bem na maioria dos cenários. Só
parta para opções mais complexas se houver necessidade real de
compartilhamento, persistência remota ou requisitos específicos de performance.
Comparação aprofundada: Docker volumes VS Bind Mount vstmpfs
Quando falamos de armazenamento em containers, o Docker oferece três
mecanismos principais: volumes, bindmounts e tmpfs. Todos eles têm em comum

 e Redes Volumes e Redes Página 7 de 19
o fato de conectarem algo do host ao container, mas a forma como funcionam e os
cenários onde se encaixam melhor são bem diferentes.
Volumes: a opção oficial, segura e portável
Volumes são gerenciados pelo próprio Docker. Quando você cria um volume
com docker volume create, ele é registrado nos metadados internos do Docker e fica
salvo, por padrão, em /var/lib/docker/volumes. O que o container enxerga é o
diretório _data desse volume.
Pontos fortes:
● Isolamento entre containers e o host;
● Gerenciamento fácil via comandos Docker;
● Backup e migração mais simples;
● Recomendado para ambientes de produção.
docker run -d --name app \
-v dados-app:/usr/src/app/data \
 minha-imagem
Comando de Prompt 4 – Volumes no docker run
Fonte: elaborado pelo autor (2025)
Bind Mount: flexibilidade com riscos
Bindmounts apontam diretamente para um caminho específico no host. Isso
significa que o container terá acesso a esse diretório exatamente como ele está,
com todos os arquivos e permissões.
Pontos fortes:
● Ideal para desenvolvimento (acesso em tempo real a arquivos locais);
● Permite observar logs ou editar arquivos direto do host.
Desvantagens:
● Não há isolamento; o container pode afetar o sistema de arquivos do host;
● Portabilidade limitada, pois depende da estrutura de diretórios do host.
docker run -d --name app \
-v /home/user/projeto:/usr/src/app \
 minha-imagem
Comando de Prompt 5 – Bind Mount

 e Redes Volumes e Redes Página 8 de 19
Fonte: elaborado pelo autor (2025)
tmpfs: efêmero, leve e volátil
Volumes tmpfs armazenam os dados apenas na RAM do host. Ao reiniciar ou
parar o container, tudo é perdido. Isso é ótimo para informações temporárias ou
cenários que precisam de desempenho sem gravar em disco.
Pontos fortes:
● Alta performance (acesso direto em memória);
● Nenhuma persistência (ideal para dados sensíveis ou efêmeros).
docker run -d --name app \
--tmpfs /tmp/dados \
 minha-imagem
Comando de Prompt 6 – tmpfs
Fonte: elaborado pelo autor (2025)
Diferenças entre tipos de redes Docker
Quando falamos de redes Docker, estamos falando de como containers se
comunicam entre si e com o mundo exterior. O Docker oferece diferentes "tipos" de
rede para atender cenários variados de isolamento, performance e
interoperabilidade. Entender esses tipos é essencial para montar ambientes bem
conectados, seguros e eficientes.
Bridge: o padrão que funciona para muita coisa
Quando você não especifica uma rede, o Docker automaticamente coloca seu
container na rede bridge padrão. Essa rede cria um isolamento de rede dentro do
host e fornece resolução de nomes entre containers.
Vantagens:
● Permite comunicação entre containers no mesmo host;
● Cada container recebe um IP isolado;
● Tem DNS interno: você pode usar o nome do container como hostname.
Quando usar:
● Desenvolvimento local;

 e Redes Volumes e Redes Página 9 de 19
● Ambientes simples em que todos os containers estão no mesmo host.
docker network create --driver bridge minha-bridge
Comando de Prompt 7 – Bridge
Fonte: elaborado pelo autor (2025)
Host: quando o container precisa da rede do host
No modo host, o container simplesmente compartilha o stack de rede do host.
Nada de NAT, nada de IP isolado. Ele é o próprio host.
Vantagens:
● Mais performance (sem NAT);
● Útil para containers que precisam de acesso direto à rede do host, como
ferramentas de monitoramento.
Desvantagens:
● Zero isolamento de rede;
● Possível conflito de portas.
Quando usar:
● Containers que precisam expor portas conhecidas e fixas;
● Monitoramento, proxies locais, ou integração com apps nativos do host.
docker run --network host minha-imagem
Comando de Prompt 8 – Host
Fonte: elaborado pelo autor (2025)
None: para isolamento total
A rede none desativa completamente a conectividade do container. Nada de
rede, sem ping, sem DNS, sem acesso ao mundo externo.
Vantagens:
● Isolamento total de rede.
Quando usar:
● Ambientes de teste;
● Aplicativos que não devem se comunicar com nada;

 e Redes Volumes e Redes Página 10 de 19
● Simulações de segurança e pentests.
docker run --network none minha-imagem
Comando de Prompt 9 – None
Fonte: elaborado pelo autor (2025)
Overlay e outras redes avançadas
Se você estiver usando Docker Swarm ou Kubernetes, vai ouvir falar de redes
overlay. Elas permitem conexão entre containers em hosts diferentes. Mas isso já é
papo pra outro momento, pois entra no mundo da orquestração.
Conclusão
● Bridge é o coringa do dia a dia: segura, isolada e com DNS interno;
● Host é para quando a performance ou integração com o host é prioridade;
● None é o modo silencioso absoluto.
E se você estiver orquestrando containers em cluster, vai querer aprender
sobre overlay,macvlan e outros drivers mais avançados.
Escolher a rede certa evita dores de cabeça mais pra frente. Entender como
elas funcionam te dá autonomia pra montar ambientes mais confiáveis, seguros e
performáticos.
Criação e uso de redes personalizadas
Uma das grandes vantagens do Docker é poder simular ambientes com vários
serviços isolados, mas que ainda assim precisam conversar entre si. E é exatamente
aqui que entram as redes personalizadas. Com elas, você tem mais controle,
isolamento e previsibilidade. Vamos entender o porquê.
Como funciona o DNS interno do Docker
Quando você cria uma rede personalizada com docker network create, o
Docker automaticamente habilita um serviço de DNS interno para essa rede. Isso
significa que cada container que estiver conectado a ela pode ser referenciado pelo
seu nome (ou seja, o nome definido na flag --name).

 e Redes Volumes e Redes Página 11 de 19
docker network create minha-rede
dockerrun -d --name banco --network minha-rede postgres
dockerrun -d --nameapi --network minha-rede minha-api
Comando de Prompt 10 – DNS interno do Docker
Fonte: elaborado pelo autor (2025)
Nesse caso, a minha-api consegue se conectar ao banco de dados usando o
hostname banco, sem precisar de IP fixo, sem um “jeitinho”. O Docker cuida da
resolução de nomes.
Como containers se descobrem via hostname
Se os containers estão na mesma rede personalizada, o nome de um é
visível para o outro. Isso simplifica muito a configuração de aplicações distribuídas.
Por exemplo, uma aplicação Node.js pode se conectar ao MongoDB apenas
apontando a URI para mongodb://mongo:27017, assumindo que o container com o
Mongo se chama mongo e ambos estão na mesma rede.
Como isolar e expor serviços de forma segura
Redes personalizadas são isoladas por padrão. Isso significa que apenas
containers conectados à mesma rede conseguem se enxergar. Com isso, você
pode:
● Isolar bancos de dados, evitando que sejam acessados por containers
que não deveriam;
● Separar ambientes (ex: dev e prod);
● Reduzir a superfície de ataque, limitando o tráfego entre containers.
E caso precise expor um serviço (como um frontend ou API), basta mapear a
porta com -p no dockerrun, ou configurar diretamente no Docker Compose.
docker run -d --name frontend --network minha-rede -p 80:3000 minha-app
Comando de Prompt 11 – Isolando e expondo serviços de forma segura
Fonte: elaborado pelo autor (2025)

 e Redes Volumes e Redes Página 12 de 19
Conectando e desconectando containers dinamicamente
Outro ponto importante é que você pode conectar e desconectar containers
de redes a qualquer momento:
docker network connect minha-rede containerX
docker network disconnect minha-rede containerY
Comando de Prompt 12 – Conectando e desconectando containers dinamicamente
Fonte: elaborado pelo autor (2025)
Isso permite criar arquiteturas dinâmicas, com controle fino sobre quem fala
com quem.
Redes personalizadas não só organizam o tráfego entre seus containers,
como também são uma ferramenta fundamental de segurança e isolamento.
Entender como elas funcionam e como aproveitar o DNS interno do Docker muda
completamente o jeito de estruturar suas aplicações multicontainer. E quando o
projeto crescer? A mesma lógica de redes personalizadas será usada em
ferramentas como Docker Compose e orquestradores como o Kubernetes.
Segurança com usuários não-root e permissões de arquivos
Criar containers seguros vai além de configurar uma imagem funcional. Um
dos pilares mais importantes na segurança de ambientes Docker é evitar que
containers rodem como root, além de configurar corretamente as permissões de
arquivos dentro e fora do container.
Por que evitar o usuário root?
Quando um container é iniciado com o usuário root, ele tem permissões totais
dentro daquele ambiente isolado. O problema é que, em caso de falha de segurança
ou fuga de container (container breakout), esse usuário pode comprometer o host
inteiro. A superfície de ataque aumenta consideravelmente.
Boas práticas:
● Nunca use root em containers que precisam interagir com dados sensíveis
ou que vão rodar em produção;
● Prefira rodar com um usuário com permissões mínimas necessárias;
● Adicione esse usuário no momento da construção da imagem.

 e Redes Volumes e Redes Página 13 de 19
Como criar um usuário não-root na imagem Docker
Dentro do Dockerfile, você pode criar um usuário e definir que ele será o
usuário padrão do container:
FROM node:18
# Cria o usuário
RUN useradd -m appuser
# Define permissões para a pasta da aplicação
WORKDIR /app
COPY . .
RUN chown -R appuser:appuser /app
# Troca para o usuário
USER appuser
CMD ["node", "index.js"]
Comando de Prompt 13 – Conectando e desconectando containers dinamicamente
Fonte: elaborado pelo autor (2025)
O comando USER muda o usuário efetivo usado durante a execução do
container.
Permissões de arquivos e diretórios
Mesmo com um usuário não-root, é fundamental garantir que os arquivos e
pastas tenham permissões adequadas.
● Use chmod e chown corretamente durante o build da imagem;
● Garanta que arquivos sensíveis (como tokens, .env, .ssh) estejam
protegidos ou fora do contexto do container;
● Ao usar volumes, saiba que o usuário do host pode ser diferente do
usuário do container — e isso pode gerar problemas de permissão;
Solução comum: mapear o mesmo UID/GID no host e no container, ou usar
--user $(id -u):$(id -g) ao rodar o container.
Evitando escalonamento de privilégio
Mesmo com um usuário não-root, containers mal configurados podem ser
explorados. Algumas proteções adicionais:

 e Redes Volumes e Redes Página 14 de 19
● Use readOnlyRootFilesystem (em ambientes orquestrados como
Kubernetes);
● Não monte o socket do Docker (/var/run/docker.sock) dentro do container;
● Use --cap-drop ALL para remover todas as capabilities Linux e adicione
apenas as estritamente necessárias;
● Habilite o AppArmor, SELinux ou seccomp no seu host.
Exemplo prático: rodando container com UID/GID definidos
docker run \
 --rm \
--user $(id -u):$(id -g) \
-v $(pwd):/app \
 minha-imagem
Comando de Prompt 14 – Rodando container com UID/GID definidos
Fonte: elaborado pelo autor (2025)
Esse comando garante que o usuário dentro do container terá os mesmos IDs
do usuário do host, evitando problemas de permissão nos volumes montados.
Evitar o uso do root e gerenciar corretamente permissões dentro dos
containers são passos cruciais para criar aplicações seguras e prontas para
produção. Isso reduz a superfície de ataque e garante que falhas isoladas não se
transformem em brechas críticas.
A segurança começa na imagem, passa pelo runtime e se estende até o host.
Portanto, cuide de cada camada com atenção!

 e Redes Volumes e Redes Página 15 de 19
MERCADO, CASES E TENDÊNCIAS
Para compreender mais sobre o assunto, deixo aqui a sugestão de um ótimo
livro:
“Docker: Up & Running” (3ª edição)
Autores: Sean P. Kane e Karl Matthias
Editora: O'Reilly Media
Ano: 2023
Esse livro é um prato cheio para quem já entende os fundamentos e quer
dominar recursos como BuildKit, rootless containers, redes avançadas e integração
com Kubernetes. Recomendo especialmente os capítulos sobre “Segurança”,
“Redes” e “Práticas modernas de build” — eles complementam tudo o que vimos
nessa aula.

 e Redes Volumes e Redes Página 16 de 19
O QUE VOCÊ VIU NESTA AULA?
Nesta aula, você aprendeu a usar volumes e redes no Docker de forma mais
estratégica, entendendo quando e como utilizar volumes nomeados, bindmounts e
tmpfs. Também conheceu os diferentes tipos de redes (bridge, host, none), como
criá-las, inspecioná-las e aplicá-las em cenários reais.
Além disso, praticou comandos essenciais para montar volumes, conectar
containers por redes personalizadas e resolver problemas comuns no dia a dia com
containers. Agora você tem mais controle sobre como seus containers armazenam
dados e se comunicam entre si.

 e Redes Volumes e Redes Página 17 de 19
REFERÊNCIAS
DOCKER INC. Networking overview. 2024. Disponível em:
https://docs.docker.com/network/. Acesso em: 20 ago. 2025.
DOCKER INC. Storage overview. 2024. Disponível em:
https://docs.docker.com/storage/. Acessoem: 20 ago. 2025.
KANE, S.; MATTHIAS, K. Docker: Up & Running. Sebastopol: O’Reilly Media,
2023.

 e Redes Volumes e Redes Página 18 de 19
PALAVRAS-CHAVE
Contêineres. Virtualização. Orquestração.

 e Redes Volumes e Redes Página 19 de 19

---

## Aula 05, Docker Compose

Fonte: https://drive.google.com/file/d/1_D3hJ7RxeH1xwkr1ALEipOaOZmgrHljf/view

Docker compose Docker Compose Página 1 de 16
| AULA 05 -
DEVOPS E ARQUITETURA CLOUD
FASE 2
DOCKER COMPOSE

 compose Docker Compose Página 2 de 16
SUMÁRIO
O QUE VEM POR AÍ?...............................................................................................3
HANDS ON ...............................................................................................................4
SAIBA MAIS..............................................................................................................5
MERCADO, CASES E TENDÊNCIAS ......................................................................12
O QUE VOCÊ VIU NESTA AULA? ...........................................................................13
REFERÊNCIAS.........................................................................................................14

 compose Docker Compose Página 3 de 16
O QUE VEM POR AÍ?
Pronto e pronta para elevar as suas habilidades com o Docker Compose?
Se você já brincou com Docker e containers em produção, provavelmente já
sentiu que organizar um ou dois containers é fácil, mas quando as coisas começam
a crescer, fica complicado manter tudo funcionando numa boa. É aí que entra o
Docker Compose. Já imaginou como grandes empresas gerenciam dezenas ou até
centenas de containers de maneira organizada e sem dor de cabeça?
Nesta aula, você vai aprender exatamente isso: como orquestrar e gerenciar
múltiplos containers com facilidade e eficiência usando apenas um arquivo YAML.
Vamos explorar desde o básico até técnicas mais avançadas, como configuração de
redes personalizadas, escalabilidade e boas práticas para deixar tudo redondinho e
em produção.

 compose Docker Compose Página 4 de 16
HANDS ON
Agora que você já entendeu como funciona o Docker Compose, chegou a
hora de colocar a “mão na massa”. Ao longo dos próximos vídeos, vamos sair da
teoria e partir para a prática, montando e organizando aplicações reais com múltiplos
containers, tudo rodando juntos e sem complicações.
No primeiro vídeo, vamos começar criando nosso primeiro arquivo docker-compose.yml, entendendo a sua estrutura e subindo uma aplicação simples, mas
bem funcional. Você vai ver na prática como é fácil conectar containers e deixar tudo
rodando de primeira.
Já no segundo vídeo, vamos aprofundar um pouco mais, explorando
comandos essenciais que vão facilitar muito seu dia a dia, como docker-composeup,
down, ps e logs. Além disso, veremos como usar variáveis de ambiente, portas e
volumes para personalizar o ambiente e garantir que os dados fiquem seguros e
persistentes.
E, no último vídeo da aula, vamos entrar de vez no mundo avançado do
Docker Compose. Você vai aprender técnicas essenciais para escalar serviços
automaticamente, definir redes customizadas para uma comunicação segura e ainda
gerenciar múltiplos ambientes—seja de desenvolvimento, testes ou produção. Tudo
isso sempre seguindo as melhores práticas do mercado.

 compose Docker Compose Página 5 de 16
SAIBA MAIS
Overriding e extensões com múltiplos arquivos Compose
Um dos recursos mais poderosos — e frequentemente subutilizados — do
Docker Compose é a capacidade de combinar múltiplos arquivos YAML para
representar diferentes ambientes. Isso permite manter um docker-compose.yml
principal com a configuração base da aplicação e usar arquivos complementares,
como docker-compose.override.yml, para adaptar detalhes conforme o contexto:
desenvolvimento, teste, produção, ou até mesmo execução local com recursos
adicionais.
Por padrão, quando você executa dockercomposeup, o Compose
automaticamente carrega o docker-compose.yml e, se existir, também o docker-compose.override.yml. Esse segundo arquivo "sobrepõe" configurações do primeiro:
adiciona, modifica ou remove partes do YAML, desde que os serviços mantenham o
mesmo nome.
Mas, você também pode explicitar isso usando a flag -f para apontar múltiplos
arquivos. Isso dá ainda mais controle sobre o comportamento dos ambientes:
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
Comando de prompt 1 – Flag –f
Fonte: elaborado pelo autor (2025)
No exemplo acima, o Compose carrega o docker-compose.yml com as
definições padrão e depois aplica as alterações definidas no docker-compose.prod.yml. Essa composição de arquivos permite, por exemplo, trocar a
imagem de um container, definir volumes específicos, usar variáveis de ambiente
diferentes ou configurar uma rede exclusiva para o ambiente de produção — sem
duplicar todo o YAML base.
Essa abordagem modulariza a orquestração. Em vez de manter um arquivo
gigante cheio de ifs e comentários indicando "#produção" ou "#apenas dev", você
separa essas lógicas e ainda ganha rastreabilidade (cada ambiente pode ser
versionado separadamente).

 compose Docker Compose Página 6 de 16
Builds personalizados no Docker Compose
Nem sempre a imagem que você precisa já está pronta em algum registry
público. Muitas vezes, é necessário construir a imagem localmente, a partir de um
Dockerfile personalizado — e o Docker Compose dá bastante controle sobre esse
processo.
Em vez de usar a diretiva image:, você pode definir um bloco build: para
indicar que aquele serviço deve ser construído antes de subir o container. E é aqui
que entram três componentes essenciais: context, dockerfile e args.
O context define qual pasta será usada como base para o build. Em geral, é o
diretório onde estão os arquivos da aplicação e o próprio Dockerfile. Mas você pode
apontar para qualquer lugar no seu projeto, o que é útil quando você quer manter os
Dockerfiles separados em pastas específicas ou construir imagens a partir de
estruturas reutilizáveis.
Já o dockerfile permite indicar exatamente qual arquivo deve ser usado para
construir a imagem. Isso é útil, por exemplo, quando você tem variações para
ambientes diferentes (como Dockerfile.dev e Dockerfile.prod) e quer alternar entre
eles dependendo da situação. Não precisa renomear nada manualmente — só
indicar o caminho certo no Compose.
Por fim, os args entram em cena quando você quer tornar o build mais
dinâmico. Eles funcionam como variáveis que podem ser passadas durante a
construção da imagem, e são especialmente úteis para configurar detalhes como o
ambiente (ENV=prod), a porta padrão, a versão de uma dependência ou qualquer
outro parâmetro que você queira controlar sem alterar diretamente o Dockerfile.
dev:
 build:
 context: ./frontend
dockerfile: Dockerfile.dev
args:
 REACT_APP_API_URL: "http://localhost:3000"
Comando de prompt 2 – args
Fonte: elaborado pelo autor (2025)
Com isso, você isola sua lógica de build por ambiente, ganha flexibilidade
para fazer ajustes rápidos e ainda evita aquele acúmulo de Dockerfiles quase

 compose Docker Compose Página 7 de 16
idênticos. Além disso, seu time pode clonar o repositório e rodar dockercomposeup
com builds totalmente adaptados ao seu fluxo de trabalho — sem surpresas.
Se você ainda está usando apenas image: em todos os serviços, talvez esteja
deixando uma camada poderosa do Compose de lado. Teste usar o build: num dos
seus serviços e comece a modularizar seus builds... faz a diferença!
Gerenciamento de segredos no Docker Compose
Nem toda variável de ambiente deve ser tratada da mesma forma. Quando
falamos de senhas, tokens de acesso ou qualquer informação sensível, é essencial
entender como o Docker Compose lida com segredos e variáveis de ambiente — e
por que isso importa na prática.
De forma simples, temos dois jeitos principais de passar dados de
configuração para nossos containers com Compose: usando env_file ou usando a
diretiva secrets:.
O env_file é o mais comum e prático. Ele permite carregar variáveis definidas
em um arquivo .env, como:
DB_USER=admin
DB_PASSWORD=supersegredo123
Comando de prompt 3 – Carregando variáveis definidas em um arquivo .env
Fonte: elaborado pelo autor (2025)
Depois, no seu docker-compose.yml, você pode referenciar esse arquivo:
services:
 app:
image: minha-api
env_file:
- .env
Comando de prompt 4 – Refereciando arquivo no docker-compose.yml
Fonte: elaborado pelo autor (2025)
Isso é ótimo para valores que você precisa versionar ou compartilhar em
ambientes de desenvolvimento. Mas há um detalhe: essas variáveis podem acabar
visíveis com comandos como dockerinspect ou até nos logs de build, o que não é
nada legal quando estamos lidando com dados sensíveis.
É aí que entra a diretiva secrets:. Ela oferece uma forma mais segura de lidar
com informações confidenciais, especialmente em ambientes de produção. O

 compose Docker Compose Página 8 de 16
conteúdo do segredo fica armazenado em arquivos protegidos e pode ser montado
diretamente dentro do container, em um path específico. Isso impede que o valor
fique visível no histórico de comandos ou no ambiente como um todo:
secrets:
db_password:
 file: ./secrets/db_password.txt
services:
db:
 image: postgres
 secrets:
 - db_password
Comando de prompt 5 – Diretiva secrets:
Fonte: elaborado pelo autor (2025)
Dentro do container, o conteúdo do segredo estará acessível em
/run/secrets/db_password, o que é muito mais seguro do que definir
DB_PASSWORD diretamente no ambiente.
Então, qual desses usar? Em desenvolvimento local, o env_file ainda é o “rei”
— prático, direto e compatível com praticamente tudo. Mas quando a aplicação
começa a ficar séria, com ambiente de staging ou produção, vale a pena migrar os
dados mais críticos para secrets:.
No fim do dia, não é apenas sobre rodar um container — é sobre garantir que
o que roda esteja bem protegido. Use env_file para o que pode ser compartilhado e
secrets para aquilo que, se vazar, vai te dar dor de cabeça. Uma boa stack também
é uma stack segura.
Estratégias de restart no Docker Compose
Sabe aquele container que você sobe e ele roda bonitinho, mas aí um serviço
depende de outro que ainda nem iniciou? Ou então aquele container que, por algum
motivo temporário, falha e você quer que ele volte automaticamente? A diretiva
restart: no Docker Compose é justamente para isso: garantir resiliência e
previsibilidade no comportamento dos seus containers, especialmente em ambientes
de desenvolvimento e testes mais exigentes.
A ideia é simples, mas poderosa. Existem algumas opções de política de
reinício que você pode configurar:

 compose Docker Compose Página 9 de 16
● no (padrão): não reinicia o container automaticamente. Se ele falhar ou
ficar parado, ficará assim até você intervir;
● always: sempre reinicia o container, independentemente do motivo da
parada. Útil pra serviços essenciais que você quer manter vivos;
● on-failure: reinicia apenas se o container terminar com erro (exitcode
diferente de 0). Você pode limitar o número de tentativas;
● unless-stopped: igual ao always, mas se você parar o container
manualmente, ele não volta mais sozinho.
Na prática, você pode configurar desta maneira:
services:
 web:
 image: minha-app
 restart: always
Comando de prompt 6 – Opções de política de reinício
Fonte: elaborado pelo autor (2025)
Mas não é colocar restart: always em tudo. O segredo é entender o papel de
cada serviço no seu projeto. Por exemplo:
● Um banco de dados? restart: unless-stopped costuma ser uma boa ideia.
Você quer que ele sempre volte, mas respeite sua decisão caso precise
desligar;
● Uma API que depende do banco? Pode ser on-failure para evitar loops
infinitos caso o erro seja de configuração;
● Um serviço que processa fila? Talvez restart: always faça sentido pra
garantir que ele esteja sempre ativo.
E claro, tudo isso ajuda muito quando você usa Compose em conjunto com
CI/CD ou ambientes locais com múltiplos containers. Já pensou rodar
dockercomposeup e metade dos serviços quebrarem por conta de ordem de
inicialização? Com as estratégias de restart bem definidas, seu ambiente fica mais
robusto — e você perde menos tempo “debugando” coisas que poderiam estar
cobertas desde o início.

 compose Docker Compose Página 10 de 16
Então, da próxima vez que configurar seu Compose, pense não só em "fazer
rodar", mas em "fazer rodar direito, mesmo quando der errado". É aí que o restart:
brilha.
Integração com CI/CD usando Docker Compose
Uma das maiores vantagens do Docker Compose é a facilidade que ele traz
para reproduzir ambientes complexos com um simples comando. Mas essa
simplicidade não serve apenas para desenvolvedores rodando apps localmente —
ela é perfeita para pipelines de CI/CD que precisam subir, testar e destruir
ambientes com rapidez e precisão.
Vamos pensar no seguinte: se você já tem um docker-compose.yml que roda
sua aplicação localmente, por que não usar esse mesmo arquivo para rodar seus
testes automatizados num ambiente isolado, dentro de uma pipeline? A ideia é
justamente essa: trazer consistência entre o que roda na máquina do dev e o que
roda na sua esteira de build.
Imagine um workflow de CI onde você tem um app Node.js e um banco
Postgre. Em vez de depender de serviços externos ou mockar tudo, você usa o
Compose pra subir os dois containers, roda os testes de integração e depois derruba
tudo. Tudo controlado pelo docker-composeup e down dentro do seu script de
pipeline.
Outro ponto importante é simular a produção. Usando Compose com
diferentes arquivos (como docker-compose.override.yml ou docker-compose.prod.yml), você consegue aproximar seu ambiente de CI do que realmente
roda em produção. Isso evita surpresas desagradáveis quando você faz o deploy.
E tem mais: o Compose pode ser usado para otimizar o tempo de build. Ao
definir volumes e caching corretamente, você consegue acelerar testes e builds
entre diferentes etapas da pipeline. Sem contar que o Compose é suportado por
praticamente todos os provedores de CI modernos, seja GitHub Actions, GitLab CI,
Bitbucket ou Jenkins.
No fim, é sobre isso: se você já montou sua aplicação como um conjunto de
serviços com Compose, aproveite esse mesmo setup na sua esteira. Além de evitar
inconsistências, você ganha agilidade, previsibilidade e menos “dor de cabeça”

 compose Docker Compose Página 11 de 16
quando o ambiente de testes começa a se comportar como o de produção. Ninguém
quer ouvir aquele famoso "na minha máquina funciona" em pleno 2025, não é?!

 compose Docker Compose Página 12 de 16
MERCADO, CASES E TENDÊNCIAS
Livro: A Developer's Essential Guide to Docker Compose
Autor: Emmanouil Gkatziouras
Editora: Packt Publishing
Ano: 2022
Para aprofundar ainda mais o seu domínio sobre Docker Compose,
abordando desde fundamentos até estratégias práticas para desenvolvimento diário,
CI/CD e deploy em produção, confira especialmente os capítulos sobre
“Comunicação entre Microservices” e “Como traduzir arquivos Compose em
implantações no Kubernetes”.

 compose Docker Compose Página 13 de 16
O QUE VOCÊ VIU NESTA AULA?
Nesta aula, você aprendeu a orquestrar múltiplos containers com o Docker
Compose. Começamos entendendo o que é e como surgiu essa ferramenta,
exploramos a estrutura do arquivo docker-compose.yml, vimos exemplos práticos de
aplicações multicontainer e comandos essenciais do dia a dia.
Encerramos com técnicas mais avançadas como escalonamento de serviços,
redes customizadas e estratégias para organizar ambientes de desenvolvimento e
produção. Agora você tem o que precisa para estruturar projetos mais robustos e
profissionais com muito mais facilidade.

 compose Docker Compose Página 14 de 16
REFERÊNCIAS
DOCKER Compose overview. Docker Documentation. 2024. Disponível em:
https://docs.docker.com/compose/. Acesso em: 20 ago. 2025.
DOCKER Compose: The Complete Guide to Docker Compose. 2020. Disponível
em: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04. Acesso em: 20 ago. 2025.
GKATZIOURAS, E. A Developer's Essential Guide to Docker Compose.
Birmingham: Packt Publishing, 2022.

 compose Docker Compose Página 15 de 16
PALAVRAS-CHAVE
DevOps. Integração Contínua. Orquestração de Containers.

 compose Docker Compose Página 16 de 16

---

## Aula 06, Boas Práticas, Segurança e Troubleshooting

Fonte: https://drive.google.com/file/d/1HdyCfVMXjCFfThC6PLx4lqion08JLLIY/view

Boas práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 1 de 17
| AULA 06 -
DEVOPS E ARQUITETURA CLOUD
FASE 2
BOAS PRÁTICAS,
SEGURANÇA E
TROUBLESHOOTING

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 2 de 17
SUMÁRIO
O QUE VEM POR AÍ?...............................................................................................3
HANDS ON ...............................................................................................................4
SAIBA MAIS..............................................................................................................5
MERCADO, CASES E TENDÊNCIAS ......................................................................12
O QUE VOCÊ VIU NESTA AULA? ...........................................................................13
REFERÊNCIAS.........................................................................................................14

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 3 de 17
O QUE VEM POR AÍ?
Depois de entender como criar e orquestrar containers com Docker e Docker
Compose, chega o momento de encarar o que realmente separa quem só “faz rodar”
de quem entrega soluções robustas: manter tudo rodando bem, com segurança e
clareza no diagnóstico. Nesta última aula, vamos conversar sobre boas práticas que
ajudam a evitar “dor de cabeça” lá na frente, explorar medidas fundamentais de
segurança que todo container deveria seguir, e aprender como identificar e resolver
problemas quando algo dá errado — porque uma hora, vai dar. Se você quer levar
seu ambiente Dockerizado para o próximo nível, esta aula é para você.

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 4 de 17
HANDS ON
Chegou a hora de colocar a “mão na massa” e testar tudo o que
aprenderemos sobre boas práticas, segurança e troubleshooting com Docker. Nesta
etapa, vamos simular situações reais de uso e mostrar como aplicar estratégias que
deixam seu ambiente mais leve, mais seguro e muito mais confiável no dia a dia.
Nada de exemplos soltos — o foco aqui é mostrar como esses conceitos aparecem
quando você realmente precisa lidar com containers em produção.
Começaremos otimizando a criação de imagens e containers: como deixar
tudo mais enxuto e eficiente, sem abrir mão da legibilidade e da manutenção do
projeto. Em seguida, mergulharemos no tema segurança, com dicas e práticas para
reduzir riscos, evitar armadilhas e garantir que seus containers estejam bem
protegidos — desde o build até a execução. Por fim, enfrentaremos situações
comuns de erro e lentidão, e mostraremos como investigar o que está acontecendo
usando comandos e ferramentas que todo mundo deveria ter na manga.
Além disso, vamos configurar usuários não-root, verificar vulnerabilidades em
imagens e interpretar erros comuns de inicialização. Tudo com contexto e aplicação
direta, para que você entenda não só o como, mas principalmente o porquê de cada
escolha. Se você quer fechar essa jornada com Docker sentindo segurança para
criar, depurar e proteger seus containers, esse é o momento! Vamos nessa!

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 5 de 17
SAIBA MAIS
Uso de .dockerignore: economize tempo e evite vazamentos
Se você está usando Docker para empacotar aplicações, precisa conhecer
o.dockerignore. Ele funciona de forma parecida com o .gitignore, e serve para excluir
arquivos e pastas do contexto de build da imagem. Parece simples, mas isso
impacta diretamente na performance do build, na segurança da imagem gerada e
também na prevenção de bugs difíceis de rastrear.
Por que ele é importante?
Toda vez que você roda um docker build, o Docker precisa copiar o contexto
de build (ou seja, todos os arquivos e pastas do diretório atual) para dentro do
processo de build, e isso inclui coisas que você não deveria mandar para dentro da
imagem: arquivos de configuração locais, dependências, secretkeys, diretórios de
cache, e por aí vai.
Sem um .dockerignore bem configurado, você pode:
● Subir acidentalmente arquivos sensíveis (como .env, id_rsa, .git/config);
● Enviar megabytes (ou gigabytes) de arquivos desnecessários para o build;
● Quebrar a camada de cache, fazendo builds demorarem mais do que o
necessário.
Exemplo prático
Imagine que seu projeto tem a seguinte estrutura:
meu-app/
├── node_modules/
├── .env
├── .git/
├── build/
├── src/
├── Dockerfile
├── docker-compose.yml
Código-fonte 1 – Estrutura de um projeto fictício
Fonte: elaborado pelo autor (2025)
Um bom .dockerignore seria:

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 6 de 17
node_modules
.env
.git
build
*.log
Código-fonte 2 – Exemplo de um bom .dockerignore
Fonte: elaborado pelo autor (2025)
Esse simples arquivo já previne:
● Que você mande milhares de arquivos do node_modules para o interior da
imagem;
● Que o .env vá para dentro do container em produção;
● Que a pasta .git com histórico e metadados seja copiada inutilmente;
● Que arquivos de build anteriores entrem por engano na nova imagem.
Dica extra
Se você usa o GitHub Copilot ou outros assistentes de código, sempre revise
se o .dockerignore sugerido cobre os arquivos do seu projeto. Cada stack tem
necessidades diferentes e um bom .dockerignore deve ser escrito com carinho pra
sua realidade.
Ah, e uma boa prática: mantenha seu .dockerignore próximo do seu
Dockerfile, na raiz do projeto. Assim fica mais fácil de entender o que está sendo
levado para dentro da imagem e o que fica fora.
Logs estruturados e centralização com Loki, Fluentd e Promtail
Quando se trabalha com containers, especialmente em ambientes mais
robustos e com múltiplas instâncias, confiar apenas no docker logs deixa de ser
suficiente. Isso porque os logs ficam fragmentados entre vários containers e, caso
um container seja destruído, os logs geralmente se perdem. A solução? Centralizar
tudo e garantir que os logs sejam estruturados.
Logs estruturados nada mais são do que registros em formato padronizado
(geralmente JSON), onde cada entrada tem campos consistentes como timestamp,
level, message, service, entre outros. Isso facilita não só a leitura, mas
principalmente a busca e a correlação de eventos.
E é aqui que entram ferramentas como o Loki, o Fluentd e o Promtail:

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 7 de 17
● Promtail é um agente que roda junto dos seus containers, lê os logs locais
e os envia para o Loki;
● Loki é o sistema de back-end, desenvolvido pela Grafana Labs,
especializado em armazenar logs de forma eficiente, com um modelo
similar ao Prometheus (mas para logs);
● Fluentd é uma alternativa poderosa para coleta, processamento e
roteamento de logs. Ele pode substituir o Promtail em cenários mais
complexos, com necessidade de transformar ou enriquecer os logs antes
do envio.
A grande vantagem desse trio é a capacidade de coletar logs de múltiplos
containers, normalizá-los e enviá-los para uma interface como o Grafana, onde você
pode fazer queries detalhadas, montar dashboards e correlacionar eventos com
métricas.
Se você está começando agora, vale montar um setup simples com Docker
Compose que inclua Promtail, Loki e Grafana. Além de ser uma ótima experiência
prática, você vai entender o valor de logs estruturados de verdade.
Dica: Combine logs estruturados com alertas baseados em eventos
críticos. Isso eleva a sua aplicação para um novo nível de observabilidade.
Docker Events: monitore em tempo real o que acontece nos containers
Saber o que está rolando em tempo real dentro do seu ambiente Docker pode
ser a diferença entre detectar um problema antes que ele escale ou passar horas
tentando descobrir o que aconteceu. O comando dockerevents é uma ferramenta
nativa, leve e extremamente útil para acompanhar as mudanças de estado dos
containers, imagens, volumes e outros objetos Docker.
Com ele, você pode visualizar eventos como criação, inicialização, parada,
remoção, attach, kill e até falhas de rede ou reinicializações. Tudo isso com
timestamps e informações precisas.
Por exemplo, se você quiser monitorar os eventos de todos os containers:
dockerevents
Comando de Prompt 1 – Monitorando eventos de todos os containers

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 8 de 17
Fonte: elaborado pelo autor (2025)
Se quiser filtrar por container específico:
docker events --filter container=meu-container
Comando de Prompt 2 – Filtrando containers específicos
Fonte: elaborado pelo autor (2025)
Ou ainda, se quiser acompanhar apenas eventos de tipo específico (por
exemplo, apenas eventos de tipo container):
dockerevents --filtertype=container
Comando de Prompt 3 – Acompanhando eventos de tipo específico
Fonte: elaborado pelo autor (2025)
Esse comando é especialmente útil quando estamos fazendo troubleshooting
em tempo real, testando algum script de automação ou tentando entender o
comportamento da infraestrutura durante deploys.
Quer integrar isso com uma ferramenta de observabilidade? Dá para usar o
output do dockerevents junto com scripts em Shell, Python ou até encaminhar para
um sistema de logs estruturado.
Fica aqui um convite: na próxima vez que algo estranho acontecer no seu
ambiente Docker, abre um terminal e roda um dockerevents. Você pode se
surpreender com o que vai descobrir rodando “por trás dos panos”.
Diagnóstico com dockerinspect: lendo metadados como um(a) detetive
Se você já usou o dockerinspect, provavelmente foi para buscar um IP ou o
path de um volume. Mas, o que pouca gente explora, é o poder de investigação que
esse comando oferece para diagnósticos mais profundos e bem informados.
O dockerinspect devolve uma saída JSON detalhada sobre containers,
imagens, volumes, redes... praticamente qualquer recurso do Docker. Com ele, é
possível saber:
● Qual comando original está sendo executado no container (Config.Cmd),
se o container está utilizando um volume e onde ele está montado
(Mounts);

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 9 de 17
● Quais portas estão expostas e mapeadas (NetworkSettings.Ports);
● Qual é a imagem base (Image);
● Se o container está sendo reiniciado frequentemente ou se está parado
por erro (State);
Quer saber se o container está morrendo por falta de memória? Verifique
State.OOMKilled. Quer automatizar uma checagem? Use o --format para filtrar
exatamente o que precisa:
dockerinspect --format='{{.State.Status}}' meu_container
Comando de Prompt 4 – Usando --format
Fonte: elaborado pelo autor (2025)
Esse comando vai te devolver apenas o status atual, como running ou exited,
sem poluir o seu terminal. E mais, combinar dockerinspect com ferramentas como jq
ou usar em scripts de shell pode turbinar suas rotinas de troubleshooting.
Prático, poderoso e já incluído na sua instalação do Docker. Da próxima vez
que algo der errado, não chute — inspecione!
Checklist de produção: o que revisar antes de subir o seu container
Antes de colocar qualquer container em produção, vale a pena fazer uma
última checagem. A ideia aqui não é só garantir que o container roda, mas sim que
ele está pronto para um ambiente real: seguro, leve, monitorável e resiliente. Esse
checklist é uma espécie de guia prático para ajudar nesse momento decisivo.
1. Imagem otimizada: evite usar imagens genéricas e pesadas, como
node:latest. Prefira versões slim ou crie uma imagem multistage para garantir que
apenas o essencial vá para produção;
2. Variáveis de ambiente seguros: verifique se as variáveis sensíveis (como
senhas e tokens) estão sendo passadas via secrets: e não expostas via env_file ou
diretamente no Compose;
3. Limites de recursos definidos: defina limites claros de CPU e memória
para evitar que o container sobrecarregue o host:

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 10 de 17
deploy:
 resources:
 limits:
cpus: '0.50'
memory: 512M
Comando de Prompt 5 – Definindo limites claros de CPU e memória
Fonte: elaborado pelo autor (2025)
4. Healthcheck configurado: um bom healthcheck ajuda o orquestrador a
saber quando reiniciar o container. Ele também serve como alerta para
instabilidades:
healthcheck:
test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
interval: 30s
 timeout: 10s
 retries: 3
Comando de Prompt 6 – Healthcheck bem configurado
Fonte: elaborado pelo autor (2025)
5. Log estruturado: certifique-se de que o app gera logs no formato JSON
(ou outro formato estruturado) e que eles estão sendo enviados para uma stack de
observabilidade (ex.: Fluentd, Loki, Promtail);
6. Usuário sem privilégios: evite rodar containers como root. Configure o
Dockerfile ou Compose para usar um usuário sem privilégios:
USER node
Comando de Prompt 7 – Configurando o usuário sem privilégios
Fonte: elaborado pelo autor (2025)
7. Network isolada: use redes específicas para comunicação entre serviços,
evitando o uso da bridge padrão. Isso aumenta a segurança e o controle;
8. Persistência de dados garantida: volumes bem configurados para
garantir que nenhum dado importante será perdido após um restart;
9. Labels e metadados: inclua labels no Compose para facilitar a automação
e a integração com ferramentas de observabilidade e monitoramento:
labels:
com.example.service: "minha-api"
Comando de Prompt 8 – Incluindo labels no Compose
Fonte: elaborado pelo autor (2025)

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 11 de 17
10. Teste final local: simule o ambiente de produção localmente usando
docker-compose -f docker-compose.yml -f docker-compose.prod.ymlup. Se estiver
tudo certo, então pode subir com confiança.
Esse checklist não é só um ritual — é uma defesa contra surpresas
desagradáveis. Com ele, você transforma seu container de algo que "funciona na
minha máquina" para algo que roda bem, de forma previsível e segura, em
produção.

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 12 de 17
MERCADO, CASES E TENDÊNCIAS
LIVRO: “Como se faz DevOps: Organizando pessoas, dos silos aos times de
plataforma”
Autores: Leonardo Leite, Paulo Meirelles, Fabio Kon
Editora: Novatec
Ano: 2024
Para quem quer entender o DevOps além das ferramentas, este livro traz uma
abordagem prática e crítica sobre como times reais se organizam para entregar
software com qualidade e colaboração. Leia especialmente a Parte 2, que discute
diferentes formas de estruturar equipes — desde departamentos isolados até
modelos mediados por APIs — e como isso impacta a cultura, a eficiência e o
alinhamento entre desenvolvimento e operações.

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 13 de 17
O QUE VOCÊ VIU NESTA AULA?
Nesta aula final, você reuniu os aprendizados essenciais para aplicar Docker
com mais maturidade em projetos reais. Começamos revisando as boas práticas,
que ajudam a manter seus containers mais leves, organizados e eficientes. Depois,
avançamos para os cuidados de segurança: desde como evitar armadilhas comuns
até o uso de ferramentas para identificar vulnerabilidades. E, por fim, mergulhamos
em técnicas de troubleshooting, aprendendo a identificar e resolver problemas de
forma mais rápida e segura.
Agora você não só sabe construir e orquestrar containers, como também tem
uma base sólida para manter ambientes saudáveis e estáveis no dia a dia. Esse é o
tipo de conhecimento que faz a diferença na hora de trabalhar com aplicações em
produção.

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 14 de 17
REFERÊNCIAS
HIGHTOWER, K.; BURNS, B.; BEDA, J. Kubernetes: Up and Running. Beijing:
O’Reilly Media, 2017.
LEITE, L.; MEIRELLES, P.; KON, F. Como se faz DevOps: organizando pessoas,
dos silos aos times de plataforma. São Paulo: Casa do Código, 2024.
TURNBULL, J. The Docker Book: Containerization is the new virtualization. 5.
ed. USA: James Turnbull, 2014.

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 15 de 17
PALAVRAS-CHAVE
Containerização. Segurança da informação. Diagnóstico de falhas.

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 16 de 17

 práticas, segurança e troubleshooting Boas práticas, segurança e troubleshooting Página 17 de 17

