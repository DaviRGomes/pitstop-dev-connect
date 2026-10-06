// Conteúdo das seis aulas do módulo de Containers e Docker, organizado em 13 etapas.

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

export type Mapping = { docker: string; f1: string };

export const DE_PARA: Mapping[] = [
  { docker: "Host e kernel", f1: "Infraestrutura operacional compartilhada do circuito" },
  { docker: "Máquina virtual", f1: "Uma instalação completa e independente" },
  { docker: "Namespace", f1: "Divisórias que limitam o que cada garagem enxerga" },
  { docker: "Cgroup", f1: "Controle que mede e limita os recursos de cada operação" },
  { docker: "Imagem", f1: "Especificação replicável usada para montar um carro" },
  { docker: "Container", f1: "Instância executável montada a partir da especificação" },
  { docker: "Registry", f1: "Arquivo central de especificações versionadas" },
  { docker: "Dockerfile", f1: "Folha versionada com a sequência de montagem" },
  { docker: "Camada e cache", f1: "Conjunto validado que pode ser reaproveitado" },
  { docker: "Multistage build", f1: "Montagem na fábrica e envio somente do kit de pista" },
  { docker: "Volume", f1: "Cofre persistente separado do ciclo de vida do carro" },
  { docker: "Bind mount", f1: "Acesso direto a uma bancada específica do host" },
  { docker: "tmpfs", f1: "Quadro temporário da garagem mantido em memória" },
  { docker: "Rede personalizada", f1: "Canal privado de comunicação da equipe" },
  { docker: "DNS interno", f1: "Indicativo estável mesmo quando o endereço muda" },
  { docker: "Publicação de porta", f1: "Acesso interno aberto de forma controlada" },
  { docker: "Docker Compose", f1: "Plano operacional completo do fim de semana" },
  { docker: "Healthcheck", f1: "Verificação ativa de que o sistema cumpre sua função" },
  { docker: "Usuário não root", f1: "Credencial limitada à tarefa necessária" },
  { docker: "Secret", f1: "Credencial entregue por um canal separado" },
  { docker: "Logs e eventos", f1: "Rádio, telemetria e cronologia da operação" },
];

export const ANALOGY_NOTES: string[] = [
  "Um carro físico não compartilha um kernel. A analogia explica organização, não o isolamento implementado pelo Linux.",
  "Uma equipe de F1 normalmente alinha dois carros, enquanto serviços podem ter dezenas de réplicas independentes.",
  "DNS apenas resolve nomes para endereços. Ele não transmite, autentica nem criptografa a comunicação.",
  "Compose local organiza arquivos de segredo, mas não transforma a origem em um cofre criptografado.",
];

export const LESSONS: Lesson[] = [
  {
    id: "ct1",
    num: "01",
    navTitle: "Por que containers",
    tag: "fundamentos",
    title: "Por que containers existem",
    narration:
      "Começa a volta de instalação. Antes de buscar tempo, precisamos entender por que carregar um sistema operacional inteiro para cada aplicação pode ser peso demais.",
    lead: "Containers tornam o ambiente reproduzível e isolam processos com menos sobrecarga que uma máquina virtual completa.",
    concept: [
      "Um container é um conjunto de processos isolados no nível do sistema operacional. Namespaces controlam o que esses processos enxergam; cgroups medem e limitam CPU, memória e entrada ou saída.",
      "O container compartilha o kernel do host, por isso costuma iniciar rápido e ocupar menos espaço. Esse compartilhamento também significa que ele não é uma VM pequena nem uma barreira absoluta de segurança.",
    ],
    pointsTitle: "O painel desta etapa",
    points: [
      { t: "Namespaces", d: "Isolam processos, rede, mounts, hostname e usuários.", color: "blue" },
      { t: "Cgroups", d: "Medem e limitam os recursos consumidos pela carga.", color: "signal" },
      {
        t: "Kernel compartilhado",
        d: "Reduz peso e partida, com isolamento diferente de uma VM.",
        color: "ember",
      },
    ],
    examplesTitle: "Primeiro container",
    examples: [
      {
        label: "hello-world",
        lang: "sh",
        code: `# Cria e executa o processo da imagem
$ docker run --name primeiro-container hello-world
$ docker ps --all
$ docker inspect --format '{{.State.Status}} {{.State.ExitCode}}' primeiro-container
exited 0`,
        note: "Exited (0) indica que o processo principal terminou com sucesso.",
      },
    ],
    commands: [
      { cmd: "docker run --name fundamentos hello-world", note: "cria e inicia o container" },
      { cmd: "docker ps --all", note: "lista containers ativos e encerrados" },
      { cmd: "docker rm fundamentos", note: "remove a instância encerrada" },
    ],
    handsOnIntro: "Prove que o laboratório está vivo e observe o ciclo completo do processo.",
    handsOn: [
      "Execute o hello-world com o nome fundamentos.",
      "Compare as saídas de docker ps e docker ps --all.",
      "Inspecione State.Status e State.ExitCode.",
      "Confirme exited 0 e remova o container.",
    ],
    tip: "Um container permanece ativo somente enquanto seu processo principal permanece em execução.",
    takeaway:
      "Container é um processo isolado e limitado pelo kernel, não uma máquina virtual pequena.",
    outro:
      "Fundamentos no verde. Agora vamos separar a especificação do carro da instância que entra na pista.",
  },
  {
    id: "ct2",
    num: "02",
    navTitle: "Imagem e ciclo",
    tag: "imagem + runtime",
    title: "Imagem, container e ciclo de vida",
    narration:
      "Imagem e container precisam ocupar colunas diferentes no painel. Confundir receita com execução custa reprodutibilidade.",
    lead: "A imagem é o artefato imutável e versionado; o container acrescenta uma camada gravável e executa o comando configurado.",
    concept: [
      "A mesma imagem pode originar várias instâncias independentes. Pull baixa, run cria e inicia, stop solicita a parada, start retoma a mesma instância, rm remove o container e rmi remove a imagem sem uso.",
      "Tags como node:20-alpine identificam variantes, mas podem ser movidas. Evite latest quando precisar de reprodutibilidade e use digest quando a imutabilidade for requisito.",
    ],
    pointsTitle: "O ciclo de vida",
    points: [
      {
        t: "Imagem",
        d: "Sistema de arquivos e metadados em camadas reutilizáveis.",
        color: "blue",
      },
      {
        t: "Container",
        d: "Execução independente com uma camada gravável temporária.",
        color: "signal",
      },
      {
        t: "Registry",
        d: "Distribui imagens públicas ou privadas com controle de acesso.",
        color: "violet",
      },
    ],
    examplesTitle: "Nginx em execução",
    examples: [
      {
        label: "ciclo completo",
        lang: "sh",
        code: `$ docker pull nginx:alpine
$ docker run --detach --name pagina --publish 8080:80 nginx:alpine
$ curl --head http://localhost:8080
HTTP/1.1 200 OK
$ docker logs pagina
$ docker stop pagina
$ docker rm pagina`,
        note: "EXPOSE documenta uma porta; --publish cria o encaminhamento pelo host.",
      },
    ],
    commands: [
      { cmd: "docker pull nginx:alpine", note: "baixa uma variante explícita" },
      { cmd: "docker start ciclo", note: "retoma o mesmo container parado" },
      { cmd: "docker rm --force ciclo", note: "interrompe e remove uma instância descartável" },
    ],
    handsOnIntro: "Suba, pare e retome a mesma instância para enxergar o ciclo inteiro.",
    handsOn: [
      "Suba nginx:alpine na porta 8080 com o nome ciclo.",
      "Confirme a resposta HTTP e pare o container.",
      "Verifique que a conexão falha e execute docker start ciclo.",
      "Confirme a volta do serviço e remova a instância após conferir o alvo.",
    ],
    tip: "Use tags explícitas e guarde credenciais de registry fora do histórico do shell.",
    takeaway:
      "Imagem é o artefato reproduzível; container é uma execução descartável dessa imagem.",
    outro:
      "A diferença ficou nítida. Na próxima curva, a especificação ganha uma receita versionada.",
  },
  {
    id: "ct3",
    num: "03",
    navTitle: "Dockerfile",
    tag: "build reproduzível",
    title: "Dockerfile como receita reproduzível",
    narration:
      "Entramos no trecho em que improviso perde para procedimento. Conhecimento de oficina precisa virar processo repetível.",
    lead: "O Dockerfile registra em código cada decisão necessária para reconstruir uma imagem sem depender da memória de alguém.",
    concept: [
      "FROM escolhe a base, WORKDIR define o diretório, COPY leva arquivos do contexto, RUN executa durante a construção e CMD define o processo padrão no runtime.",
      "RUN acontece no build e grava uma camada. CMD acontece quando o container inicia. EXPOSE apenas documenta a porta e não a publica no host.",
    ],
    pointsTitle: "Instruções essenciais",
    points: [
      { t: "Build", d: "FROM, COPY e RUN formam o artefato versionado.", color: "blue" },
      {
        t: "Runtime",
        d: "CMD define o processo principal iniciado pelo container.",
        color: "signal",
      },
      {
        t: "Contexto",
        d: "O ponto final do docker build define quais arquivos podem entrar.",
        color: "ember",
      },
    ],
    examplesTitle: "API mínima",
    examples: [
      {
        label: "Dockerfile",
        lang: "sh",
        code: `FROM node:20-alpine
WORKDIR /app
COPY server.js ./server.js
EXPOSE 3000
CMD ["node", "server.js"]

$ docker build --tag minha-api:1.0 .
$ docker run --rm --publish 3000:3000 minha-api:1.0`,
        note: "A forma exec de CMD permite que o processo receba sinais diretamente.",
      },
    ],
    commands: [
      {
        cmd: "docker build --tag minha-api:1.0 .",
        note: "constrói a imagem usando o diretório atual",
      },
      { cmd: "docker run --rm --publish 3000:3000 minha-api:1.0", note: "executa e publica a API" },
      { cmd: "docker images minha-api", note: "compara as tags construídas" },
    ],
    handsOnIntro: "Construa duas revisões e prove que cada tag identifica uma imagem distinta.",
    handsOn: [
      "Crie um server.js HTTP simples e o Dockerfile do exemplo.",
      "Construa e teste a tag minha-api:1.0.",
      "Altere a resposta e reconstrua como minha-api:1.1.",
      "Liste as imagens e confirme as duas revisões.",
    ],
    tip: "Prefira imagens base com versão explícita e copie apenas o necessário.",
    takeaway: "Dockerfile transforma decisões manuais em construção repetível e versionável.",
    outro:
      "Receita registrada. O próximo desafio é cortar tempo de build e peso sem retirar uma peça necessária.",
  },
  {
    id: "ct4",
    num: "04",
    navTitle: "Camadas e cache",
    tag: "otimização",
    title: "Camadas, cache e multistage build",
    narration:
      "Cada ordem no Dockerfile muda o cache, e cada ferramenta levada ao runtime precisa justificar o próprio peso.",
    lead: "Ordene camadas pela frequência de mudança e separe o ambiente de construção da imagem final de execução.",
    concept: [
      "O Docker reutiliza uma camada enquanto a instrução e suas entradas não mudam. Copiar manifestos e instalar dependências antes do código preserva o cache.",
      "Um multistage build usa uma etapa rica para compilar e uma etapa final menor para executar. Slim, Alpine e distroless têm tradeoffs de tamanho, compatibilidade e diagnóstico.",
    ],
    pointsTitle: "Onde o tempo aparece",
    points: [
      {
        t: "Ordem",
        d: "Coloque entradas estáveis antes das que mudam com frequência.",
        color: "blue",
      },
      {
        t: "Multistage",
        d: "Copie para o runtime somente artefato e dependências reais.",
        color: "signal",
      },
      {
        t: "Base mínima",
        d: "Menor só é melhor quando continua compatível e operável.",
        color: "ember",
      },
    ],
    examplesTitle: "Build separado do runtime",
    examples: [
      {
        label: "multistage",
        lang: "sh",
        code: `FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]`,
        note: "Se dist importar pacotes, copie ou instale também as dependências de produção.",
      },
    ],
    commands: [
      {
        cmd: "docker build --tag minha-app:otimizada .",
        note: "constrói e registra o uso do cache",
      },
      { cmd: "docker history minha-app:otimizada", note: "exibe as camadas da imagem" },
      { cmd: "docker images minha-app:otimizada", note: "mostra o tamanho final" },
    ],
    handsOnIntro: "Faça duas construções e acompanhe quais etapas permanecem em cache.",
    handsOn: [
      "Monte um projeto com lockfile, script de build e Dockerfile multistage.",
      "Execute o build duas vezes e localize CACHED na segunda.",
      "Altere somente o código e reconstrua.",
      "Confirme que npm ci ficou em cache e teste a imagem final.",
    ],
    tip: "Não remova ferramentas ou bibliotecas que o runtime precisa apenas para reduzir megabytes.",
    takeaway:
      "Ordene camadas pela frequência de mudança e deixe ferramentas de build fora do runtime.",
    outro:
      "Imagem mais eficiente e setor limpo. Agora precisamos preservar os dados fora da instância.",
  },
  {
    id: "ct5",
    num: "05",
    navTitle: "Persistência",
    tag: "volumes + mounts",
    title: "Persistência com volumes, bind mounts e tmpfs",
    narration:
      "Trocar a instância sem perder o que importa exige separar estado descartável de dado persistente.",
    lead: "A camada gravável acompanha o container; volumes vivem fora desse ciclo e podem ser ligados à próxima instância.",
    concept: [
      "Volumes nomeados são administrados pelo Docker. Bind mounts expõem um caminho do host. tmpfs mantém dados temporários na memória.",
      "O driver local persiste no host atual. Armazenamento entre hosts exige NFS ou integração própria, considerando rede, permissões, backup e consistência.",
    ],
    pointsTitle: "Escolha da montagem",
    points: [
      { t: "Volume", d: "Persistência administrada e separada do container.", color: "blue" },
      { t: "Bind mount", d: "Acesso direto a arquivos e diretórios do host.", color: "signal" },
      { t: "tmpfs", d: "Dados efêmeros em memória, apagados no fim da execução.", color: "violet" },
    ],
    examplesTitle: "Dado que sobrevive",
    examples: [
      {
        label: "volume nomeado",
        lang: "sh",
        code: `$ docker volume create dados-demo
$ docker run --rm --volume dados-demo:/dados alpine sh -c 'echo persistiu > /dados/mensagem.txt'
$ docker run --rm --volume dados-demo:/dados:ro alpine cat /dados/mensagem.txt
persistiu
$ docker volume inspect dados-demo`,
        note: "O sufixo :ro impede escrita pelo segundo container.",
      },
    ],
    commands: [
      { cmd: "docker volume create dados-demo", note: "cria o recurso persistente" },
      { cmd: "docker volume inspect dados-demo", note: "consulta metadados" },
      { cmd: "docker volume rm dados-demo", note: "apaga permanentemente o volume confirmado" },
    ],
    handsOnIntro: "Grave o dado, desmonte a instância e leia o arquivo em outro container.",
    handsOn: [
      "Crie dados-demo e grave mensagem.txt.",
      "Confirme que o primeiro container não existe mais.",
      "Leia o arquivo com montagem somente leitura.",
      "Compare com tmpfs e remova apenas o volume de laboratório.",
    ],
    tip: "Use comandos Docker para administrar volumes e faça backup antes de qualquer remoção.",
    takeaway: "Dado que precisa sobreviver não pode depender da camada gravável do container.",
    outro:
      "Troca concluída sem abandonar o dado nos boxes. O próximo setor exige comunicação previsível.",
  },
  {
    id: "ct6",
    num: "06",
    navTitle: "Redes e DNS",
    tag: "conectividade",
    title: "Redes, DNS interno e publicação de portas",
    narration:
      "Serviços precisam se encontrar por uma identificação estável e expor para fora somente o necessário.",
    lead: "Uma bridge criada pelo usuário oferece DNS interno por nome; publicação de porta abre um caminho controlado pelo host.",
    concept: [
      "Bridge conecta containers no mesmo host, host compartilha a pilha do sistema, none desliga a rede e overlay liga múltiplos hosts orquestrados.",
      "Na rede personalizada, nomes são resolvidos automaticamente. EXPOSE documenta; --publish encaminha uma porta do host.",
    ],
    pointsTitle: "Limites de comunicação",
    points: [
      { t: "DNS interno", d: "Use nomes estáveis em vez de IPs que mudam.", color: "blue" },
      {
        t: "Rede personalizada",
        d: "Define quem participa do mesmo domínio de comunicação.",
        color: "signal",
      },
      {
        t: "Porta publicada",
        d: "Expõe apenas o serviço que recebe acesso externo.",
        color: "ember",
      },
    ],
    examplesTitle: "Descoberta por nome",
    examples: [
      {
        label: "bridge privada",
        lang: "sh",
        code: `$ docker network create rede-demo
$ docker run --detach --name web --network rede-demo nginx:alpine
$ docker run --rm --network rede-demo curlimages/curl --silent --head http://web
HTTP/1.1 200 OK
$ docker network inspect rede-demo`,
        note: "A comunicação interna não exige porta publicada.",
      },
    ],
    commands: [
      { cmd: "docker network create rede-demo", note: "cria uma bridge com DNS interno" },
      { cmd: "docker network connect rede-demo cliente", note: "liga um container existente" },
      { cmd: "docker network inspect rede-demo", note: "lista conexões e endereços" },
    ],
    handsOnIntro: "Faça a mesma chamada dentro e fora da rede.",
    handsOn: [
      "Confirme HTTP 200 dentro da rede-demo.",
      "Repita sem conectar o cliente e observe a falha.",
      "Conecte um cliente existente e consulte web pelo nome.",
      "Inspecione e remova os recursos descartáveis.",
    ],
    tip: "Não publique banco ou serviço interno apenas para facilitar descoberta entre containers.",
    takeaway:
      "Na mesma rede personalizada, use nomes; publique somente portas acessadas pelo host.",
    outro:
      "Canal interno confirmado. Agora toda a operação será registrada em um plano reproduzível.",
  },
  {
    id: "ct7",
    num: "07",
    navTitle: "Docker Compose",
    tag: "multicontainer",
    title: "Docker Compose para aplicações multicontainer",
    narration:
      "Serviço, rede, volume e configuração passam a fazer parte de um único plano operacional versionado.",
    lead: "Compose substitui comandos frágeis por uma definição YAML que toda a equipe consegue revisar.",
    concept: [
      "services descreve containers; build ou image define a origem; ports, volumes, networks, environment e secrets completam a aplicação.",
      "depends_on simples ordena criação, mas não prova prontidão. A aplicação ainda precisa tolerar falhas transitórias.",
    ],
    pointsTitle: "O plano operacional",
    points: [
      { t: "Serviços", d: "Cada papel recebe imagem e configuração próprias.", color: "blue" },
      { t: "Recursos", d: "Redes e volumes ficam declarados junto da aplicação.", color: "signal" },
      { t: "Validação", d: "compose config verifica o YAML antes da largada.", color: "violet" },
    ],
    examplesTitle: "Web e banco",
    examples: [
      {
        label: "compose.yaml",
        lang: "yaml",
        code: `services:
  web:
    build: .
    ports: ["3000:3000"]
    environment:
      DB_HOST: db
    depends_on: [db]
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: exemplo-local
    volumes: [dados_db:/var/lib/postgresql/data]
volumes:
  dados_db:`,
        note: "Em produção, não mantenha a senha diretamente no YAML.",
      },
    ],
    commands: [
      { cmd: "docker compose config", note: "valida a configuração consolidada" },
      { cmd: "docker compose up --detach --build", note: "constrói e inicia os serviços" },
      { cmd: "docker compose down", note: "remove containers e redes, preservando volumes" },
    ],
    handsOnIntro: "Valide primeiro, suba depois e observe a stack.",
    handsOn: [
      "Salve o YAML ao lado de um Dockerfile funcional.",
      "Execute compose config.",
      "Suba e consulte ps e logs do banco.",
      "Finalize sem --volumes para preservar dados.",
    ],
    tip: "Use docker compose logs --follow para correlacionar serviços relacionados.",
    takeaway: "Compose transforma comandos soltos em uma definição versionável.",
    outro:
      "A equipe agora trabalha com um plano comum. O próximo setor trata variações e recuperação.",
  },
  {
    id: "ct8",
    num: "08",
    navTitle: "Ambientes e CI",
    tag: "operações",
    title: "Ambientes, reinício, escala e CI",
    narration:
      "A configuração precisa responder a treino, teste e produção sem duplicar o plano original.",
    lead: "Arquivos adicionais alteram só o que varia; políticas de reinício e saúde definem reação a falhas.",
    concept: [
      "Compose combina arquivos na ordem de -f. Use config para ver o resultado. no, on-failure, always e unless-stopped controlam reinícios.",
      "Reinício não garante prontidão. Escala cria instâncias, mas uma porta fixa do host não pode ser ocupada por várias réplicas.",
    ],
    pointsTitle: "Variação controlada",
    points: [
      { t: "Overrides", d: "Mudam imagem, portas ou variáveis sem copiar tudo.", color: "blue" },
      { t: "Restart", d: "Recupera o processo, mas não testa sua função.", color: "signal" },
      { t: "CI", d: "Sobe dependências, espera saúde, testa e desmonta.", color: "violet" },
    ],
    examplesTitle: "Base e produção",
    examples: [
      {
        label: "compose.yaml",
        lang: "yaml",
        code: `services:
  web:
    image: nginx:alpine
    restart: on-failure:3
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--spider", "http://localhost"]
      interval: 5s
      timeout: 2s
      retries: 5`,
        note: "Um segundo arquivo pode trocar apenas a imagem e as labels.",
      },
    ],
    commands: [
      {
        cmd: "docker compose -f compose.yaml -f compose.prod.yaml config",
        note: "mostra a fusão final",
      },
      {
        cmd: "docker compose -f compose.yaml -f compose.prod.yaml up --detach --wait",
        note: "aguarda saúde",
      },
      { cmd: "docker compose exec web nginx -t", note: "valida o serviço" },
    ],
    handsOnIntro: "Compare a base com a configuração combinada.",
    handsOn: [
      "Crie os arquivos base e de produção.",
      "Compare os resultados de compose config.",
      "Suba e aguarde healthy.",
      "Valide o Nginx e desmonte.",
    ],
    tip: "Se --wait não existir, acompanhe compose ps até healthy; Up não prova prontidão.",
    takeaway: "Overrides controlam ambientes; reinício não substitui saúde.",
    outro: "Estratégia ajustada sem duplicar o plano. Agora entramos na proteção da stack.",
  },
  {
    id: "ct9",
    num: "09",
    navTitle: "Segurança",
    tag: "menor privilégio",
    title: "Segurança em camadas",
    narration:
      "Cada permissão retirada reduz opções para uma exploração, mas nenhuma camada garante proteção sozinha.",
    lead: "Usuário, capabilities, seccomp, filesystem, imagem e mounts precisam cooperar.",
    concept: [
      "Namespaces isolam visibilidade, capabilities dividem privilégios, seccomp filtra chamadas e um usuário não root reduz impacto.",
      "UID 0 aumenta risco com mounts ou capabilities extras. Não monte docker.sock em aplicações comuns.",
    ],
    pointsTitle: "Barreiras sobrepostas",
    points: [
      { t: "Identidade", d: "Execute com UID não privilegiado.", color: "blue" },
      { t: "Capabilities", d: "Remova tudo e devolva só o necessário.", color: "signal" },
      { t: "Filesystem", d: "Use raiz somente leitura e tmpfs temporário.", color: "ember" },
    ],
    examplesTitle: "Runtime reduzido",
    examples: [
      {
        label: "menor privilégio",
        lang: "sh",
        code: `$ docker run --rm --user node --cap-drop ALL --read-only --tmpfs /tmp node:20-alpine sh -c 'touch /bloqueado 2>/dev/null || echo "raiz bloqueada"; echo ok > /tmp/teste; cat /tmp/teste'
raiz bloqueada
ok`,
        note: "O tmpfs oferece escrita efêmera sem liberar toda a raiz.",
      },
    ],
    commands: [
      { cmd: "docker run --rm node:20-alpine id", note: "observa o usuário padrão" },
      { cmd: "docker run --rm --user node node:20-alpine id", note: "confirma o UID limitado" },
      { cmd: "docker inspect CONTAINER", note: "revê configuração efetiva" },
    ],
    handsOnIntro: "Reduza privilégios e confirme as falhas intencionais.",
    handsOn: [
      "Compare o id padrão com node.",
      "Execute com raiz somente leitura e tmpfs.",
      "Confirme bloqueio na raiz e escrita em /tmp.",
      "Remova tmpfs e observe o novo bloqueio.",
    ],
    tip: "Evite chmod 777, modo privileged e montagem do socket da Engine.",
    takeaway: "Segurança depende de controles pequenos e combinados.",
    outro: "Privilégios reduzidos. Falta impedir material indevido no build.",
  },
  {
    id: "ct10",
    num: "10",
    navTitle: "Contexto e segredos",
    tag: "supply chain",
    title: "Contexto de build, segredos e análise de imagem",
    narration:
      "Tudo que entra no contexto afeta tempo, cache, tamanho e exposição. A triagem acontece antes do build.",
    lead: "O .dockerignore reduz o material enviado ao builder e evita que arquivos locais ou credenciais sejam registrados em camadas.",
    concept: [
      "Apagar um segredo numa instrução posterior não o elimina de uma camada anterior. env_file não cria um segredo e ARG serve apenas para parâmetros não confidenciais.",
      "Compose pode montar segredo como arquivo, mas a origem continua precisando de proteção. Dive e Snyk ajudam a revisar peso e vulnerabilidades.",
    ],
    pointsTitle: "Inspeção antes da pista",
    points: [
      {
        t: ".dockerignore",
        d: "Exclui dependências locais, Git, logs e arquivos de ambiente.",
        color: "blue",
      },
      { t: "ARG", d: "Parâmetro visível adequado a versão, nunca a senha.", color: "signal" },
      {
        t: "Secret",
        d: "Montado por canal próprio, com origem protegida fora do Git.",
        color: "violet",
      },
    ],
    examplesTitle: "Contexto mínimo",
    examples: [
      {
        label: ".dockerignore e análise",
        lang: "sh",
        code: `# .dockerignore
node_modules
.env
.env.*
.git
*.log
coverage
dist

$ docker build --progress plain --tag minha-app:analise .
$ docker history minha-app:analise
$ docker images minha-app:analise`,
        note: "Compare transferring context antes e depois da triagem.",
      },
    ],
    commands: [
      {
        cmd: "docker build --progress plain --tag minha-app:analise .",
        note: "mostra contexto e etapas",
      },
      { cmd: "docker history minha-app:analise", note: "revela comandos e peso das camadas" },
      { cmd: "docker inspect minha-app:analise", note: "consulta labels e configuração" },
    ],
    handsOnIntro: "Meça o contexto antes e depois do .dockerignore.",
    handsOn: [
      "Execute um build detalhado e anote o tamanho transferido.",
      "Crie o .dockerignore e repita.",
      "Compare contexto, cache e camadas maiores.",
      "Se disponível, analise a tag com Dive ou Snyk.",
    ],
    tip: "Não use ARG, ENV ou arquivos versionados para transportar tokens e senhas.",
    takeaway: "Segredo que não entra no contexto não pode vazar por uma camada do build.",
    outro:
      "Vistoria concluída. Se algo falhar, precisamos de uma sequência confiável de investigação.",
  },
  {
    id: "ct11",
    num: "11",
    navTitle: "Troubleshooting",
    tag: "diagnóstico",
    title: "Troubleshooting com uma ordem de investigação",
    narration:
      "Bandeira amarela. A velocidade certa agora é a do diagnóstico disciplinado, antes de qualquer palpite.",
    lead: "Investigue estado, logs, configuração, eventos e recursos nessa ordem, preservando a evidência até fechar a causa.",
    concept: [
      "docker ps mostra estado; logs lê stdout e stderr; inspect revela comando, mounts, rede e código; events mostra cronologia; top e stats mostram processos e consumo.",
      "docker exec testa por dentro apenas containers ativos. Reiniciar sem evidência pode mascarar o sintoma e não identifica a causa.",
    ],
    pointsTitle: "Sequência de diagnóstico",
    points: [
      { t: "Estado", d: "Localize exit code, reinícios e OOM antes de agir.", color: "blue" },
      {
        t: "Evidência",
        d: "Cruze logs, configuração e eventos com uma hipótese.",
        color: "signal",
      },
      { t: "Recursos", d: "Observe processos, CPU e memória sem alterar a carga.", color: "ember" },
    ],
    examplesTitle: "Falha controlada",
    examples: [
      {
        label: "exit code 42",
        lang: "sh",
        code: `$ docker run --name falha alpine sh -c 'echo "configuração ausente" >&2; exit 42'
$ docker inspect --format 'status={{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}}' falha
status=exited exit=42 oom=false
$ docker logs falha
configuração ausente`,
        note: "Código e logs contam partes complementares do incidente.",
      },
    ],
    commands: [
      { cmd: "docker ps --all", note: "começa pelo estado observável" },
      { cmd: "docker logs falha", note: "recupera stdout e stderr" },
      { cmd: "docker events --filter type=container", note: "acompanha a cronologia" },
    ],
    handsOnIntro: "Resista ao reinício automático e confronte uma hipótese com os dados.",
    handsOn: [
      "Provoque a falha do exemplo.",
      "Formule uma hipótese com estado e exit code.",
      "Confira logs e comando original no inspect.",
      "Registre a causa antes de remover o container.",
    ],
    tip: "Mude uma variável por vez e anote estado, hipótese, teste e resultado.",
    takeaway: "Diagnóstico começa por evidências; reiniciar não é investigar.",
    outro: "Causa antes de correção. Agora precisamos distinguir processo ativo de serviço pronto.",
  },
  {
    id: "ct12",
    num: "12",
    navTitle: "Saúde e logs",
    tag: "observabilidade",
    title: "Logs, healthcheck e prontidão operacional",
    narration:
      "Motor ligado não significa carro pronto. O serviço precisa provar que cumpre sua função.",
    lead: "O estado do processo indica presença; healthcheck verifica uma condição funcional e logs explicam o comportamento.",
    concept: [
      "Healthcheck classifica starting, healthy ou unhealthy, mas não corrige a aplicação. O teste deve representar a função certa com custo controlado.",
      "Aplicações devem escrever logs estruturados em stdout e stderr. Promtail ou Fluentd podem enviar eventos a Loki e Grafana.",
    ],
    pointsTitle: "Sinais operacionais",
    points: [
      { t: "Processo", d: "Up diz apenas que o processo principal continua vivo.", color: "blue" },
      { t: "Saúde", d: "O teste confirma uma função específica naquele momento.", color: "signal" },
      {
        t: "Logs",
        d: "Timestamp, nível, mensagem e serviço facilitam correlação.",
        color: "violet",
      },
    ],
    examplesTitle: "Healthcheck no Compose",
    examples: [
      {
        label: "verificação HTTP",
        lang: "yaml",
        code: `services:
  api:
    image: minha-api:1.0
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s`,
        note: "Garanta que curl existe ou use o runtime da aplicação.",
      },
    ],
    commands: [
      { cmd: "docker compose ps", note: "mostra o estado de saúde" },
      {
        cmd: "docker inspect --format '{{json .State.Health}}' CONTAINER",
        note: "exibe tentativas",
      },
      { cmd: "docker compose logs api", note: "correlaciona saúde e comportamento" },
    ],
    handsOnIntro: "Provoque perda de dependência e acompanhe a transição de saúde.",
    handsOn: [
      "Suba o capstone com --wait.",
      "Pare o banco e acompanhe a API até unhealthy.",
      "Inspecione Health e correlacione com logs.",
      "Recupere o banco e aguarde healthy.",
    ],
    tip: "Um endpoint raso pode ficar verde enquanto uma função importante está quebrada.",
    takeaway: "Processo ativo pergunta se roda; healthcheck pergunta se cumpre sua função.",
    outro: "Painel e telemetria contam histórias complementares. Só falta reuni-las no capstone.",
  },
  {
    id: "ct13",
    num: "13",
    navTitle: "Capstone",
    tag: "stack defensiva",
    title: "Capstone: uma stack pequena e defensiva",
    narration:
      "Última volta. Construção, rede, persistência, segredo, saúde e evidência precisam cruzar a linha como um conjunto.",
    lead: "A stack combina API Node sem root, PostgreSQL persistente, rede interna, segredo em arquivo, limites, logs e healthchecks.",
    concept: [
      "A API localiza db por DNS e testa a porta do PostgreSQL. O banco usa volume, recebe senha por arquivo e libera a API após seu healthcheck.",
      "Raiz somente leitura, tmpfs, cap_drop, limites e labels reduzem risco e melhoram inventário. Limites não garantem desempenho nem reserva exclusiva.",
    ],
    pointsTitle: "Integração final",
    points: [
      { t: "Build e identidade", d: "Multistage, artefato mínimo e usuário node.", color: "blue" },
      { t: "Dados e acesso", d: "Volume, secret em arquivo e rede interna.", color: "signal" },
      { t: "Operação", d: "Healthchecks, logs, labels, limites e restart.", color: "violet" },
    ],
    examplesTitle: "Núcleo da stack",
    examples: [
      {
        label: "compose.yaml",
        lang: "yaml",
        code: `services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DB_HOST: db
    depends_on:
      db:
        condition: service_healthy
    cap_drop: [ALL]
    read_only: true
    tmpfs: [/tmp]
    networks: [interna]
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_DB: app
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets: [db_password]
    volumes: [dados_db:/var/lib/postgresql/data]
    networks: [interna]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10
volumes:
  dados_db:
networks:
  interna:
secrets:
  db_password:
    file: ./secrets/db_password.txt`,
        note: "Inclua secrets no .dockerignore e mantenha a origem fora do Git.",
      },
    ],
    commands: [
      { cmd: "docker compose config --quiet", note: "valida antes de criar recursos" },
      { cmd: "docker compose up --detach --build --wait", note: "constrói e aguarda saúde" },
      { cmd: "docker compose down", note: "encerra preservando o volume" },
    ],
    handsOnIntro: "Execute a sequência inteira e valide cada mecanismo.",
    handsOn: [
      "Crie API, Dockerfile, .dockerignore, Compose e senha local.",
      "Valide, suba com --wait e consulte /health.",
      "Confirme saúde, logs JSON e usuário node.",
      "Derrube sem volumes, suba novamente e confirme dados_db.",
    ],
    tip: "Use down --volumes somente quando a perda definitiva dos dados for intencional.",
    takeaway:
      "Maturidade combina construção reproduzível, menor privilégio, persistência, saúde e evidência.",
    outro: "Bandeirada. O tempo final veio de decisões pequenas, verificáveis e coordenadas.",
  },
];
