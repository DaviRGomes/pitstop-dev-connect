# Containers e Docker: da especificação do carro à operação completa de pista

> Versão do piloto, construída sobre os seis materiais de origem sobre fundamentos de containers, imagens, Dockerfile, persistência, redes, Docker Compose, segurança, observabilidade e diagnóstico. Todo o conteúdo técnico foi preservado. A diferença está na leitura de pista: cada mecanismo é relacionado a uma parte concreta da operação de uma equipe de Fórmula 1.

Quando entro no carro, não recebo uma fábrica inteira dentro do cockpit. Recebo uma instância montada de uma especificação controlada, com componentes, configuração e limites conhecidos. A equipe consegue montar outra instância a partir da mesma especificação, mas cada carro em execução acumula seu próprio estado durante o uso. Essa distinção é a melhor porta de entrada para containers: a imagem é a especificação replicável; o container é uma instância executável montada a partir dela.

**O que você vai saber fazer ao final deste guia:** explicar como um container isola processos sem carregar um sistema operacional completo; diferenciar imagem de container; construir imagens reproduzíveis e enxutas; persistir dados; conectar serviços com DNS interno; descrever uma aplicação com Docker Compose; reduzir privilégios; investigar falhas; e combinar tudo isso em uma pequena stack executável.

**Pré-requisitos:** Docker Engine ou Docker Desktop com o comando `docker compose` disponível. Os exemplos usam imagens Linux. No Docker Desktop, essas imagens rodam dentro da máquina virtual Linux administrada pela própria ferramenta.

> **Cuidado com limpeza:** comandos com `prune` removem recursos não utilizados em todo o ambiente Docker. Eles aparecem apenas como referência. Confira o que será afetado antes de executá-los.

## Quadro de-para: cole isto no volante

A mesma analogia será usada nas 13 etapas. Se imagem significa especificação replicável do carro aqui, ela continuará com esse significado até o capstone.

| Containers e Docker | Fórmula 1 |
|---|---|
| Host e kernel | Infraestrutura operacional compartilhada do circuito |
| Máquina virtual | Uma instalação completa e independente, com infraestrutura própria |
| Namespace | Divisórias de operação que limitam o que cada garagem e equipe consegue enxergar |
| Cgroup | Controle de recursos que mede e limita a capacidade entregue a cada operação |
| Imagem | Especificação ou receita replicável usada para montar um carro |
| Container | Uma instância executável montada a partir da especificação |
| Registry | Arquivo central de especificações versionadas |
| Tag | Identificador de uma versão ou configuração da especificação |
| Dockerfile | Folha versionada com a sequência de montagem |
| Camada de imagem | Pacote imutável de alterações na especificação |
| Cache de build | Reaproveitamento de conjuntos já validados que não mudaram |
| Multistage build | Montagem completa na fábrica e envio à pista somente do kit necessário para operar |
| Camada gravável | Registro temporário produzido por uma instância durante sua execução |
| Volume nomeado | Cofre persistente de dados, separado do ciclo de vida do carro |
| Bind mount | Acesso direto a uma bancada específica do host |
| tmpfs | Quadro temporário da garagem, mantido em memória e apagado ao desmontar a operação |
| Rede personalizada | Canal privado de comunicação entre integrantes da mesma operação |
| DNS interno | Identificação estável por função ou indicativo, mesmo quando o endereço muda |
| Publicação de porta | Abertura controlada de um acesso interno para quem está fora da garagem |
| Docker Compose | Plano operacional que descreve todos os carros, serviços, acessos e recursos juntos |
| Política de reinício | Procedimento automático de nova tentativa após uma parada |
| Healthcheck | Verificação ativa de que o sistema consegue cumprir sua função |
| Usuário não root | Integrante que recebe apenas a credencial necessária para sua tarefa |
| Capabilities | Permissões operacionais específicas, concedidas uma a uma |
| Seccomp | Lista de procedimentos do sistema permitidos ou bloqueados |
| `.dockerignore` | Triagem do material antes de enviar o caixote para montagem |
| Secret | Credencial confidencial entregue por um canal próprio |
| Logs e eventos | Rádio, telemetria e registro cronológico da operação |
| Stack final | A operação integrada de um fim de semana de corrida |

## Onde a comparação para

A analogia ajuda a organizar o raciocínio, mas não substitui o modelo técnico. Um carro físico não compartilha o kernel de um computador, uma equipe de F1 normalmente alinha apenas dois carros e uma imagem não contém matéria física. Containers podem ser criados e removidos em segundos, replicados em grande quantidade e conectados por redes virtuais. Sempre que houver conflito, valem as definições e os comandos de Docker apresentados no texto.

---

## Etapa 01: por que containers existem

### O problema

Uma aplicação Node.js funciona no notebook da equipe, mas falha no servidor. A máquina local usa uma versão da linguagem, o servidor usa outra, uma biblioteca nativa está ausente e uma configuração foi feita manualmente sem documentação. O deploy vira uma tentativa de reconstruir, passo a passo, um ambiente que só existe na memória de quem o configurou.

Máquinas virtuais melhoraram o isolamento desse cenário, mas cada VM carrega seu próprio sistema operacional. Isso custa memória, disco e tempo de inicialização. Quando o objetivo é executar aplicações isoladas no mesmo host, repetir um sistema operacional completo pode ser desperdício.

### O conceito

**Leitura de cockpit:** uma VM se parece com levar uma instalação completa e independente para cada aplicação. O container se parece com colocar uma instância de carro em uma garagem delimitada, compartilhando a infraestrutura operacional do circuito. Namespaces formam as divisórias de visibilidade; cgroups funcionam como o controle que mede e limita os recursos destinados àquela operação.

Um container é um conjunto de processos isolados no nível do sistema operacional. Em Linux, dois mecanismos são fundamentais:

- **Namespaces** controlam o que o processo consegue enxergar, como processos, rede, pontos de montagem, hostname, comunicação entre processos e usuários.
- **Cgroups** medem e limitam recursos, como CPU, memória e operações de entrada e saída.

O container compartilha o kernel do host. Por isso ele costuma iniciar mais rápido e consumir menos recursos que uma VM. Esse compartilhamento também significa que container não é sinônimo de máquina virtual nem uma barreira absoluta de segurança.

Aqui a comparação encontra seu primeiro limite: boxes separados reduzem interferência entre equipes, mas não descrevem isolamento de processos. No Docker, o isolamento é implementado pelo kernel e continua sujeito à configuração do runtime e do host.

| Característica | Máquina virtual | Container |
|---|---|---|
| Unidade isolada | Máquina completa | Processos |
| Kernel | Próprio por VM | Compartilhado com o host |
| Inicialização | Geralmente mais lenta | Geralmente rápida |
| Imagem | Sistema operacional completo | Aplicação e suas dependências |

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

### Mão na massa

1. Execute `docker run --name fundamentos hello-world`.
2. Rode `docker ps` e depois `docker ps --all`.
3. Observe que o container aparece apenas no segundo comando.
4. Inspecione seu status com `docker inspect --format '{{.State.Status}} {{.State.ExitCode}}' fundamentos`.
5. A saída esperada é `exited 0`. Remova-o com `docker rm fundamentos`.

### Anota aí

> Container é um processo isolado e limitado pelo kernel; ele não é uma máquina virtual pequena.

---

## Etapa 02: imagem, container e ciclo de vida

### O problema

Uma equipe precisa executar a mesma versão do Nginx em desenvolvimento, teste e produção. Instalar e configurar o programa manualmente em cada ambiente recria o problema de inconsistência. Também não basta copiar um container em execução, porque ele acumula estado temporário e não representa uma receita reproduzível.

### O conceito

**Leitura de cockpit:** a imagem é a especificação imutável e versionada usada para montar o carro. O container é uma instância executável montada dessa especificação. A mesma imagem pode originar várias instâncias independentes, como uma especificação aprovada pode orientar mais de uma montagem sem transformar os carros na mesma entidade.

Uma **imagem** reúne o sistema de arquivos e os metadados necessários para iniciar um processo. Ela é composta por camadas reutilizáveis. Um **container** acrescenta uma camada gravável temporária sobre a imagem e executa o comando configurado.

O fluxo básico é:

1. `docker pull` baixa uma imagem de um registry, como o Docker Hub.
2. `docker run` cria e inicia um container a partir da imagem.
3. `docker stop` solicita a parada do processo.
4. `docker start` reinicia o mesmo container.
5. `docker rm` remove o container.
6. `docker rmi` remove uma imagem que não está sendo usada.

Tags como `node:20-alpine` identificam variantes. Evite depender de `latest` em ambientes que precisam de reprodutibilidade, pois o conteúdo associado à tag pode mudar.

Eu não aceitaria chegar ao grid com uma folha marcada apenas como "a configuração mais recente". Quero saber exatamente qual revisão foi montada. Uma tag explícita cumpre esse papel de identificação, embora uma tag ainda possa ser movida. Quando a exigência for imutabilidade forte, um digest identifica o conteúdo da imagem com precisão.

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

### Mão na massa

1. Suba `nginx:alpine` na porta 8080 com o nome `ciclo`.
2. Confirme a resposta com `curl -I http://localhost:8080`.
3. Pare o container e repita o `curl`. A conexão deve falhar.
4. Execute `docker start ciclo` e confirme que a página voltou.
5. Remova o container com `docker rm --force ciclo`.

### Anota aí

> Imagem é o artefato reproduzível; container é uma execução descartável dessa imagem.

---

## Etapa 03: Dockerfile como receita reproduzível

### O problema

Baixar uma imagem pronta resolve ferramentas comuns, mas não empacota o código da sua aplicação. Copiar arquivos manualmente para um container em execução produz um ambiente impossível de reconstruir com confiança.

### O conceito

**Leitura de cockpit:** se a imagem é a especificação replicável do carro, o Dockerfile é a folha versionada com a sequência de montagem. Cada instrução registra uma decisão necessária para repetir o resultado sem depender da memória de um mecânico.

As instruções essenciais são:

- `FROM`: escolhe a imagem base.
- `WORKDIR`: define o diretório usado pelas instruções seguintes.
- `COPY`: copia arquivos do contexto de build.
- `RUN`: executa uma ação durante a construção.
- `CMD`: define o comando padrão executado quando o container inicia.

`RUN` acontece no build e grava uma camada na imagem. `CMD` acontece no runtime, quando um container é iniciado. Misturar esses dois momentos é uma fonte comum de erro.

Na minha cabeça, `RUN` pertence à preparação na fábrica; `CMD` pertence ao momento em que a instância vai operar na pista. A comparação para aí: ambos são mecanismos de software registrados na imagem, não fases regulamentares de fabricação de um carro real.

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
# Usa uma versão explícita do Node em uma base pequena.
FROM node:20-alpine

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
docker run --rm --name minha-api --publish 3000:3000 minha-api:1.0
```

Em outro terminal:

```sh
curl http://localhost:3000
```

Saída esperada:

```json
{"status":"ok"}
```

### Mão na massa

1. Crie os dois arquivos do exemplo em um diretório vazio.
2. Construa `minha-api:1.0` e execute o container.
3. Troque o valor da resposta para `{"status":"pronto"}`.
4. Reconstrua com a tag `minha-api:1.1`.
5. Rode `docker images minha-api` e observe que as versões são imagens distintas.

### Anota aí

> Um Dockerfile transforma decisões manuais em uma construção repetível e versionável.

---

## Etapa 04: camadas, cache, imagens mínimas e multistage build

### O problema

Um Dockerfile copia o projeto inteiro antes de instalar dependências. Qualquer mudança de uma linha invalida o cache e baixa tudo novamente. A imagem final também leva compiladores, caches e arquivos usados apenas no build. O resultado demora para construir, custa mais para transferir e oferece uma superfície de ataque maior.

### O conceito

**Leitura de cockpit:** a fábrica usa moldes, bancadas e instrumentos que não precisam viajar no kit de pista. Levar toda a oficina porque uma ferramenta foi necessária durante a montagem aumenta peso, transferência e superfície de risco sem benefício para a execução. Um multistage build faz essa separação entre construir e operar.

O Docker reaproveita camadas anteriores enquanto a instrução e seus arquivos de entrada não mudam. Por isso, arquivos de dependências devem ser copiados antes do restante do código. Um **multistage build** usa uma etapa rica em ferramentas para construir o artefato e uma etapa final menor para executá-lo.

Variantes comuns de imagem base:

- `slim`: base Debian reduzida, com boa compatibilidade.
- `alpine`: muito pequena, mas usa musl e pode exigir ajustes para dependências nativas.
- `distroless`: contém apenas o necessário para execução, geralmente sem shell ou gerenciador de pacotes.

Menor nem sempre significa melhor. A base deve ser compatível, atualizada e suficiente para diagnosticar e executar a aplicação.

É o mesmo cuidado que temos ao retirar sensores ou ferramentas do kit: redução só é ganho quando preserva capacidade operacional. Uma imagem pequena que quebra compatibilidade ou torna qualquer incidente impossível de investigar pode custar mais que os megabytes economizados.

### Exemplo comentado: separando construção e execução

```dockerfile
# Primeira etapa: possui o ambiente necessário para construir.
FROM node:20-alpine AS build

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
FROM node:20-slim AS runtime

WORKDIR /app

# Copia o artefato pronto da etapa anterior.
COPY --from=build /app/dist ./dist

# Usa o usuário não privilegiado já presente na imagem oficial.
USER node

# Inicia o artefato, sem levar as ferramentas da etapa build.
CMD ["node", "dist/index.js"]
```

Saída esperada do build, resumida:

```text
=> [build ...] RUN npm ci
=> [build ...] RUN npm run build
=> [runtime ...] COPY --from=build /app/dist ./dist
=> naming to ... minha-app:otimizada
```

Na segunda construção, se apenas um arquivo do código mudar, a etapa `npm ci` deve aparecer como `CACHED`.

### Mão na massa

1. Em um projeto Node que possua `package-lock.json` e script `build`, use o Dockerfile do exemplo.
2. Rode `docker build --tag minha-app:otimizada .` duas vezes.
3. Na segunda execução, observe `CACHED` nas etapas que não mudaram.
4. Altere apenas um arquivo de código e reconstrua.
5. Confirme que a instalação de dependências continuou em cache.

### Anota aí

> Ordene camadas pela frequência de mudança e deixe ferramentas de construção fora da imagem de runtime.

---

## Etapa 05: persistência com volumes, bind mounts e tmpfs

### O problema

Um banco grava dados no sistema de arquivos do container. Durante uma atualização, o container é removido e recriado. A imagem continua disponível, mas os dados da camada gravável desaparecem junto com o container.

### O conceito

**Leitura de cockpit:** a camada gravável do container é o conjunto de registros temporários daquela instância do carro. Quando a instância é desmontada, esse estado vai junto. Um volume é o cofre de dados mantido fora do ciclo de vida do carro, pronto para ser conectado à próxima instância.

O Docker oferece três mecanismos principais:

| Mecanismo | Administração | Persistência | Uso típico |
|---|---|---|---|
| Volume nomeado | Docker | Sim | Dados de aplicação e banco |
| Bind mount | Usuário e host | Sim | Código local em desenvolvimento |
| tmpfs | Memória do host | Não | Dados temporários ou sensíveis |

O driver `local` é o padrão dos volumes. `tmpfs` é um tipo de montagem, não um driver de volume persistente. O caminho físico de um volume é detalhe interno da Engine e pode variar conforme sistema e runtime. Prefira os comandos Docker em vez de manipular `/var/lib/docker` diretamente.

O bind mount abre acesso direto a uma bancada específica do host, útil quando a equipe precisa editar código local durante o desenvolvimento. O `tmpfs` se parece mais com o quadro de trabalho da garagem: rápido, mantido em memória e intencionalmente apagado quando a operação termina. A comparação não significa que volumes sejam arquivos físicos transportados; eles são recursos de armazenamento administrados pelo runtime.

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

### Mão na massa

1. Execute os comandos do exemplo.
2. Confirme que o primeiro container não existe mais com `docker ps --all`.
3. Leia o arquivo usando um segundo container.
4. Compare com um `tmpfs`: `docker run --rm --tmpfs /dados alpine sh -c 'echo temporario > /dados/a && cat /dados/a'`.
5. Remova o volume de demonstração com `docker volume rm dados-demo`.

### Anota aí

> Se um dado precisa sobreviver ao container, ele não pode depender da camada gravável desse container.

---

## Etapa 06: redes, DNS interno e publicação de portas

### O problema

Uma API precisa acessar um banco. Usar o IP atual do container funciona até ele ser recriado e receber outro endereço. Publicar a porta do banco no host resolve o acesso, mas expõe um serviço que deveria ser interno.

### O conceito

**Leitura de cockpit:** uma rede Docker personalizada funciona como o canal privado de comunicação da equipe. Cada serviço chama o outro por um indicativo estável, como `web` ou `db`, mesmo que o endereço numérico mude depois de uma recriação. Publicar uma porta equivale a abrir um acesso controlado para fora dessa operação interna.

Os modos apresentados nas fontes são:

- `bridge`: rede isolada no mesmo host. Redes bridge criadas pelo usuário oferecem resolução automática por nome.
- `host`: compartilha a pilha de rede do host. Reduz isolamento e pode causar conflito de portas.
- `none`: desabilita a conectividade de rede do container.
- `overlay`: conecta serviços em múltiplos hosts em ambientes orquestrados.

A rede `bridge` padrão e uma bridge criada pelo usuário não são equivalentes. O DNS por nome de container é uma vantagem da rede personalizada. Na bridge padrão, não dependa dessa descoberta automática.

O paralelo com rádio tem limite claro: DNS não transmite conversa nem autentica participantes. Ele resolve nomes para endereços. Isolamento, criptografia e autorização exigem mecanismos próprios.

`EXPOSE 3000` documenta uma porta na imagem. `--publish 8080:3000` cria o encaminhamento da porta 8080 do host para a porta 3000 do container.

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

### Mão na massa

1. Repita o exemplo e confirme o status HTTP 200.
2. Antes de remover a rede, execute `docker run --rm curlimages/curl --head http://web` sem `--network rede-demo`.
3. Observe a falha de resolução, pois o novo container está fora da rede.
4. Conecte um container existente com `docker network connect` e inspecione a rede novamente.

### Anota aí

> Containers na mesma rede personalizada se encontram pelo nome; publique somente as portas que precisam ser acessadas pelo host.

---

## Etapa 07: Docker Compose para aplicações multicontainer

### O problema

Subir API, banco, rede e volume com vários comandos funciona até alguém esquecer uma flag, usar um nome diferente ou executar os passos na ordem errada. O ambiente deixa de ser uma configuração versionável e vira uma sequência oral de instruções.

### O conceito

**Leitura de cockpit:** comandos `docker run` isolados se parecem com ordens transmitidas uma por vez à garagem. Um arquivo Compose é o plano operacional versionado do fim de semana, com cada serviço, rede, armazenamento, configuração e relação descritos em conjunto.

Docker Compose descreve uma aplicação em YAML. Os elementos principais são:

- `services`: containers que formam a aplicação.
- `build` ou `image`: como obter a imagem de cada serviço.
- `ports`: portas publicadas no host.
- `volumes`: persistência ou compartilhamento de arquivos.
- `networks`: limites de comunicação.
- `environment` e `env_file`: configuração não secreta.
- `secrets`: arquivos montados para dados sensíveis.

O plano não pilota sozinho. Compose interpreta a definição e coordena recursos Docker, mas a aplicação ainda precisa lidar corretamente com inicialização, falhas transitórias e dependências. É como uma folha de operação perfeita: ela organiza a execução, mas não elimina a necessidade de resposta aos dados reais da pista.

### Exemplo comentado: web e banco

```yaml
services:
  web:
    # Constrói usando o Dockerfile do diretório atual.
    build:
      context: .
      dockerfile: Dockerfile
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
    # Fixa uma versão da imagem oficial.
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

### Mão na massa

1. Salve o exemplo como `compose.yaml` ao lado de um Dockerfile funcional.
2. Rode `docker compose config` antes de iniciar. Esse comando mostra a configuração consolidada e detecta erros de YAML.
3. Execute `docker compose up --detach --build`.
4. Consulte `docker compose ps` e `docker compose logs db`.
5. Finalize com `docker compose down`. Não use `--volumes` se quiser preservar os dados.

### Anota aí

> Compose transforma uma sequência frágil de comandos em uma definição versionável da aplicação.

---

## Etapa 08: ambientes, reinício, escala e CI

### O problema

Desenvolvimento precisa de bind mount e logs detalhados. Produção precisa de imagem pronta e menos exposição. Copiar todo o Compose para cada ambiente cria arquivos quase iguais que divergem com o tempo. Além disso, um processo pode falhar temporariamente e não voltar sozinho.

### O conceito

**Leitura de cockpit:** a configuração base é o plano comum da operação. Arquivos adicionais registram ajustes para treino, teste ou corrida sem duplicar toda a definição. Eu quero enxergar exatamente o que mudou entre as configurações; `docker compose ... config` entrega essa visão consolidada antes da largada.

Compose combina arquivos na ordem fornecida por `-f`. Um arquivo de produção pode substituir somente imagem, portas ou variáveis necessárias:

```sh
docker compose \
  -f compose.yaml \
  -f compose.prod.yaml \
  config
```

Use `config` para conferir o resultado antes de subir.

Políticas de reinício:

- `no`: não reinicia automaticamente.
- `on-failure`: reinicia quando o processo termina com código diferente de zero.
- `always`: tenta manter o container ativo.
- `unless-stopped`: semelhante a `always`, mas respeita uma parada manual.

Política de reinício não resolve ordem de inicialização nem garante que uma dependência esteja pronta. Para prontidão, combine `healthcheck` e dependências condicionadas quando sua versão do Compose oferecer suporte, e mantenha retentativas na própria aplicação.

`docker compose up --scale worker=3` cria réplicas de um serviço. Um mapeamento fixo como `8080:3000` impede várias réplicas no mesmo host porque a porta 8080 só pode ser ocupada uma vez.

Aqui a analogia com F1 quebra de propósito. Uma equipe normalmente compete com dois carros, enquanto um serviço pode ter três, trinta ou centenas de réplicas. A regra técnica é a do Docker: cada réplica é uma instância independente, e uma porta fixa do host não pode ser ocupada simultaneamente por todas elas.

### Exemplo comentado: base e produção

`compose.yaml`:

```yaml
services:
  api:
    # Em desenvolvimento, usa uma tag construída e testada localmente.
    image: registry.exemplo/minha-api:dev
    # Reinicia somente diante de falha do processo.
    restart: on-failure:3
    environment:
      LOG_LEVEL: debug
```

`compose.prod.yaml`:

```yaml
services:
  api:
    # Em produção, usa a imagem já construída e versionada.
    image: registry.exemplo/minha-api:1.4.0
    environment:
      LOG_LEVEL: info
```

Saída esperada de `docker compose -f compose.yaml -f compose.prod.yaml config`, resumida:

```yaml
services:
  api:
    image: registry.exemplo/minha-api:1.4.0
    restart: on-failure:3
    environment:
      LOG_LEVEL: info
```

Em CI, a mesma definição pode subir dependências, executar testes e ser removida ao final:

```sh
docker compose up --detach --wait
docker compose run --rm api npm test
docker compose down --volumes
```

### Mão na massa

1. Crie os dois arquivos do exemplo.
2. Compare `docker compose -f compose.yaml config` com a configuração combinada.
3. Observe quais valores foram mantidos e quais foram substituídos.
4. Em um projeto de teste, execute `docker compose up --detach --wait` e confirme que o comando só retorna após os serviços com healthcheck ficarem saudáveis.

### Anota aí

> Arquivos Compose adicionais mudam apenas o que varia entre ambientes; reinício recupera processos, mas não substitui verificação de prontidão.

---

## Etapa 09: segurança em camadas

### O problema

Uma aplicação vulnerável roda como root, recebe mais capabilities do que precisa e carrega um token dentro da imagem. Se houver exploração, o invasor encontra permissões e dados que nunca foram necessários para a tarefa do serviço.

### O conceito

**Leitura de cockpit:** segurança de container se parece com o controle de acesso de uma equipe. Divisórias restringem visibilidade, credenciais limitam ações, procedimentos perigosos são bloqueados e cada integrante recebe somente as ferramentas necessárias. Ninguém precisa da chave de toda a fábrica para trocar um pneu.

As camadas apresentadas nas fontes são:

- **Namespaces** isolam a visão de recursos.
- **Capabilities** dividem privilégios tradicionais do root em permissões menores.
- **Seccomp** filtra chamadas de sistema.
- **Usuário não root** reduz o impacto de uma exploração.
- **Permissões mínimas** evitam `chmod 777` como solução genérica.
- **Imagem pequena e atualizada** reduz ferramentas e vulnerabilidades disponíveis.
- **Segredos em arquivos próprios** evitam valores sensíveis no Dockerfile e no ambiente.

O usuário root dentro de um container não é automaticamente idêntico ao root do host, pois namespaces e capabilities impõem limites. Ainda assim, executar sem necessidade como UID 0 aumenta o risco, especialmente com mounts perigosos, capabilities extras ou falhas do runtime.

Namespaces não são paredes invioláveis e `USER node` não resolve segurança sozinho. A defesa vem da combinação de controles. Na pista também trabalhamos em camadas, mas a implementação real aqui pertence ao kernel, ao runtime, à imagem e às opções de execução.

### Exemplo comentado: runtime com privilégios reduzidos

```dockerfile
# Parte de uma imagem oficial e versionada.
FROM node:20-alpine

WORKDIR /app

# Copia os arquivos já pertencendo ao usuário node.
COPY --chown=node:node . .

# Instala dependências conforme o lockfile.
RUN npm ci --omit=dev

# As instruções seguintes de runtime usam um UID não privilegiado.
USER node

CMD ["npm", "start"]
```

```sh
# Remove todas as capabilities extras no runtime.
# Acrescente uma capability somente se o serviço provar que precisa dela.
docker run --rm \
  --cap-drop ALL \
  --read-only \
  --tmpfs /tmp \
  minha-app:segura
```

Saída esperada ao consultar o usuário:

```sh
docker run --rm minha-app:segura id
```

```text
uid=1000(node) gid=1000(node) groups=1000(node)
```

Não monte `/var/run/docker.sock` em aplicações comuns. Quem controla esse socket pode controlar a Docker Engine e, na prática, comprometer o host.

### Mão na massa

1. Rode `docker run --rm node:20-alpine id` e observe o usuário padrão da imagem.
2. Rode `docker run --rm --user node node:20-alpine id`.
3. Compare UID e GID.
4. Inspecione o usuário configurado em sua imagem com `docker inspect --format '{{.Config.User}}' minha-app:segura`.
5. Teste escrita na raiz com `--read-only` e confirme que ela falha, enquanto `/tmp` funciona se estiver montado como `tmpfs`.

### Anota aí

> Segurança de container é defesa em profundidade: usuário, permissões, capabilities, chamadas de sistema, imagem e mounts precisam cooperar.

---

## Etapa 10: contexto de build, segredos e análise de imagem

### O problema

Um `docker build .` envia `.git`, `node_modules`, logs e `.env` para o contexto. O build demora, o cache invalida sem necessidade e um segredo pode acabar copiado para uma camada. Mesmo apagado numa instrução posterior, ele pode permanecer no histórico de uma camada anterior.

### O conceito

**Leitura de cockpit:** o contexto de build é o caixote entregue à área de montagem. O `.dockerignore` é a triagem realizada antes do envio. Se um mapa confidencial de motor entrou no caixote e foi registrado em uma camada, retirá-lo do produto final depois é tarde demais.

Exemplo de `.dockerignore`:

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
```

`env_file` é prático para configuração local, mas não transforma valores em segredos. Eles podem aparecer na configuração e na inspeção do container. Arquivos `.env` com credenciais não devem ser versionados.

Compose pode montar um segredo como arquivo:

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

No Compose local, isso reduz exposição acidental ao montar o valor como arquivo, mas não cria por si só um cofre criptografado. Proteja o arquivo de origem e use um gerenciador de segredos adequado no ambiente de destino.

No paralelo de equipe, o mecanismo entrega uma credencial por um canal separado do restante da especificação. A comparação para antes de sugerir proteção absoluta: Compose local não transforma o arquivo de origem em um cofre, assim como colocar um documento em um envelope não garante sozinho toda a cadeia de custódia.

Ferramentas citadas nas fontes complementam a revisão:

- **Dive** mostra o conteúdo e o peso de cada camada.
- **Snyk** verifica vulnerabilidades conhecidas na imagem e em dependências.

### Exemplo comentado: verificar o contexto e a imagem

```sh
# Mostra o andamento detalhado e o tamanho do contexto enviado.
docker build --progress plain --tag minha-app:analise .

# Exibe camadas e comandos que formaram a imagem.
docker history minha-app:analise

# Mostra o tamanho final.
docker images minha-app:analise
```

Saída esperada, com valores variáveis:

```text
transferring context: ...
IMAGE          TAG       SIZE
minha-app      analise   ...MB
```

### Mão na massa

1. Rode um build com `--progress plain` e anote o tamanho do contexto.
2. Crie o `.dockerignore` do exemplo e repita.
3. Compare o tamanho enviado e o reaproveitamento do cache.
4. Use `docker history` para identificar instruções que adicionaram mais dados.
5. Se Dive ou Snyk estiver instalado, analise a mesma tag e registre um ponto de melhoria.

### Anota aí

> Um segredo que não entra no contexto não pode vazar por uma camada criada durante o build.

---

## Etapa 11: troubleshooting com uma ordem de investigação

### O problema

Um container entra em `Exited (1)`. Reiniciá-lo repetidamente não explica a causa. Alterar várias configurações ao mesmo tempo pode esconder o sintoma e criar outros problemas.

### O conceito

**Leitura de cockpit:** quando sinto uma perda de potência, não troco cinco ajustes ao mesmo tempo. Primeiro confiro o estado no painel, descrevo o sintoma pelo rádio, cruzo a telemetria e observo a sequência de eventos. No Docker, status, logs, metadados e eventos cumprem esses papéis.

Use uma sequência previsível:

1. **Estado:** `docker ps --all` mostra se o container está rodando, encerrado ou reiniciando.
2. **Logs:** `docker logs` mostra stdout e stderr do processo.
3. **Configuração:** `docker inspect` revela comando, mounts, rede, portas e estado.
4. **Eventos:** `docker events` mostra criação, início, parada, kill e remoção em tempo real.
5. **Processo e recursos:** `docker top` e `docker stats` mostram processos e consumo.
6. **Teste interno:** `docker exec` executa uma verificação dentro de um container ainda ativo.

`docker restart` sem evidência é como desligar e ligar o carro sem ler a telemetria: pode devolver o sistema por alguns minutos, mas também apaga o contexto operacional e não identifica a causa. A ordem acima protege o diagnóstico contra palpites.

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

# Remove o recurso após o diagnóstico.
docker rm falha
```

Saída esperada:

```text
status=exited exit=42 oom=false
configuração ausente
```

Para observar eventos em tempo real, abra um terminal:

```sh
# Filtra eventos do tipo container.
docker events --filter type=container
```

Em outro terminal, inicie e pare um container. A saída mostrará ações como `create`, `start`, `die` e `destroy`.

### Mão na massa

1. Provoque a falha do exemplo.
2. Antes de olhar os logs, formule uma hipótese apenas com estado e exit code.
3. Confira a hipótese com `docker logs falha`.
4. Use `docker inspect --format '{{json .Config.Cmd}}' falha` para ver o comando original.
5. Remova o container somente depois de registrar a causa.

### Anota aí

> Diagnóstico começa pelo estado observável e avança para evidências; reiniciar não é investigar.

---

## Etapa 12: logs, healthcheck e prontidão operacional

### O problema

O processo está ativo, então o container aparece como `Up`. Mesmo assim, a aplicação não consegue atender requisições porque perdeu acesso a uma dependência. Em outro incidente, o container foi recriado e seus logs locais desapareceram.

### O conceito

**Leitura de cockpit:** motor ligado não significa carro pronto para sair do box. Pressão hidráulica, comunicação, temperatura e sistemas críticos precisam responder dentro da faixa. O estado do processo indica presença; um healthcheck verifica capacidade de serviço.

Um healthcheck executa periodicamente uma verificação e classifica o container como `starting`, `healthy` ou `unhealthy`. Ele não corrige a aplicação sozinho. A política do runtime ou do orquestrador decide como reagir.

A luz verde da verificação também tem alcance limitado. Ela prova apenas a condição examinada pelo teste naquele momento. Um endpoint raso pode ficar verde enquanto uma função importante está quebrada; um teste pesado demais pode criar carga e falso alarme. O healthcheck precisa representar a função certa com custo controlado.

Aplicações devem escrever logs em stdout e stderr. Logs estruturados, normalmente JSON com `timestamp`, `level`, `message` e `service`, facilitam busca e correlação. Em ambientes maiores:

- Promtail pode coletar logs e enviá-los ao Loki.
- Loki armazena e consulta logs.
- Fluentd pode coletar, transformar e rotear eventos.
- Grafana pode consultar e visualizar os dados.

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

### Mão na massa

1. Adicione um healthcheck compatível com sua aplicação.
2. Execute `docker compose up --detach`.
3. Acompanhe `docker inspect --format '{{json .State.Health}}' nome-do-container`.
4. Pare deliberadamente a dependência consultada pelo endpoint.
5. Observe a transição para `unhealthy` e consulte os registros das tentativas no inspect.

### Anota aí

> Processo ativo responde à pergunta “está rodando?”; healthcheck responde “consegue cumprir sua função?”.

---

## Etapa 13: capstone, uma stack pequena e defensiva

### O problema

Os conceitos isolados funcionam nos exercícios, mas produção exige que eles cooperem. A imagem precisa ser reproduzível, o processo deve rodar sem root, a API precisa localizar o banco por nome, o banco precisa persistir dados, a senha não deve virar variável exposta e o ambiente deve dizer quando cada serviço está saudável.

### O conceito

Este projeto final combina somente mecanismos já apresentados: Dockerfile, multistage build, usuário não root, rede personalizada, volume, tmpfs, segredo em arquivo, healthcheck, dependência por saúde, privilégios reduzidos, logs e Compose.

**Leitura de cockpit:** eu leio o capstone como a operação completa de um GP. A especificação gera a instância, a montagem leva à pista apenas o necessário, o canal interno conecta API e banco, o cofre preserva os dados, as credenciais chegam separadas, a telemetria registra comportamento e a verificação de saúde decide se o sistema está apto. Nenhum mecanismo isolado vence a corrida; o resultado vem da disciplina do conjunto.

A API usa apenas módulos nativos do Node. Ela testa se consegue abrir uma conexão TCP com o PostgreSQL. Isso prova descoberta por DNS e conectividade sem adicionar uma biblioteca de banco ao exercício.

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
FROM node:20-alpine AS build
WORKDIR /build
COPY app/server.js ./server.js

# Etapa final menor e separada da preparação.
FROM node:20-alpine AS runtime
WORKDIR /app

# Copia o artefato com o usuário correto.
COPY --from=build --chown=node:node /build/server.js ./server.js

# Documenta a porta e abandona privilégios de root.
EXPOSE 3000
USER node

# Usa a forma exec para que o Node receba sinais diretamente.
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
    # Impede escrita na raiz e oferece /tmp efêmero.
    read_only: true
    tmpfs:
      - /tmp
    restart: on-failure:3
    networks:
      - interna
    healthcheck:
      # fetch está disponível no Node 20 e evita instalar curl.
      test:
        - CMD
        - node
        - -e
        - fetch('http://localhost:3000/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))
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
    restart: unless-stopped
    healthcheck:
      # pg_isready já existe na imagem do PostgreSQL.
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
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

### Mão na massa

1. Crie a estrutura e os arquivos exatamente como mostrados.
2. Grave uma senha de laboratório com `mkdir -p secrets && printf 'troque-esta-senha' > secrets/db_password.txt`.
3. Valide o YAML com `docker compose config --quiet`.
4. Suba a stack com `docker compose up --detach --build --wait`.
5. Rode `curl http://localhost:3000/health`.
6. A saída esperada é `{"service":"api","database":"reachable"}`.
7. Rode `docker compose ps` e confirme que ambos os serviços estão saudáveis.
8. Rode `docker compose logs api` e localize o log JSON da requisição.
9. Confirme o usuário com `docker compose exec api id`. A saída deve identificar o usuário `node`, não `root`.
10. Execute `docker compose down`, suba novamente e confirme que o volume `dados_db` continua existindo com `docker volume ls`.
11. Ao terminar o laboratório, use `docker compose down --volumes` para remover também os dados de teste.

### Anota aí

> Uma stack madura não depende de um recurso milagroso: ela combina construção reproduzível, isolamento, menor privilégio, persistência, saúde e evidências operacionais.

Na pista, eu traduziria assim: velocidade sem repetibilidade, controle e evidência dura apenas até a primeira falha.

---

## Referência rápida de comandos

| Objetivo | Comando |
|---|---|
| Listar containers ativos | `docker ps` |
| Listar todos os containers | `docker ps --all` |
| Listar imagens | `docker images` |
| Baixar imagem | `docker pull imagem:tag` |
| Executar container | `docker run imagem:tag` |
| Parar container | `docker stop nome` |
| Reiniciar container parado | `docker start nome` |
| Remover container | `docker rm nome` |
| Ver logs | `docker logs nome` |
| Executar comando | `docker exec nome comando` |
| Inspecionar recurso | `docker inspect nome` |
| Copiar arquivo | `docker cp origem destino` |
| Listar volumes | `docker volume ls` |
| Listar redes | `docker network ls` |
| Validar Compose | `docker compose config` |
| Subir aplicação | `docker compose up --detach` |
| Derrubar aplicação | `docker compose down` |
| Ver eventos | `docker events` |
| Ver consumo | `docker stats` |

Os comandos `docker container prune`, `docker image prune` e `docker system prune` removem recursos não utilizados. Leia a lista apresentada pelo Docker e confirme o escopo antes de aceitar.

---

## Checklist de autoavaliação

- [ ] Consigo explicar por que container não é uma VM pequena.
- [ ] Sei dizer o papel de namespaces e cgroups.
- [ ] Diferencio imagem, camada e container.
- [ ] Consigo explicar por que o processo principal determina a vida do container.
- [ ] Sei construir e versionar uma imagem com Dockerfile.
- [ ] Diferencio `RUN`, `CMD`, `EXPOSE` e `--publish`.
- [ ] Sei organizar um Dockerfile para aproveitar cache.
- [ ] Entendo quando escolher `slim`, `alpine` ou uma imagem mais completa.
- [ ] Consigo explicar o benefício de um multistage build.
- [ ] Sei escolher entre volume, bind mount e tmpfs.
- [ ] Sei conectar serviços por nome em uma rede personalizada.
- [ ] Publico somente as portas que precisam sair da rede interna.
- [ ] Consigo validar, subir, observar e derrubar uma aplicação Compose.
- [ ] Sei combinar arquivos Compose para diferentes ambientes.
- [ ] Entendo que restart não garante prontidão de dependências.
- [ ] Consigo configurar usuário não root, filesystem somente leitura e capabilities mínimas.
- [ ] Sei por que `.env` e segredos não devem entrar no contexto de build.
- [ ] Consigo investigar uma falha usando status, logs, inspect e events.
- [ ] Diferencio processo ativo de serviço saudável.
- [ ] Consigo explicar como logs estruturados ajudam a centralização e a busca.
- [ ] Concluí o capstone e consigo justificar cada decisão do Compose.

---

## Notas do professor

As correções abaixo resolvem imprecisões encontradas no material bruto sem alterar o objetivo das seis aulas:

1. **Portabilidade não significa independência total do sistema operacional.** Containers compartilham o kernel. Docker Desktop executa containers Linux por meio de uma VM Linux quando o host não usa esse kernel diretamente.
2. **Root no container não é automaticamente o mesmo root do host.** Namespaces e capabilities reduzem privilégios, mas executar como UID 0 ainda amplia o impacto de configurações perigosas e falhas de isolamento.
3. **`tmpfs` não é driver de volume persistente.** É uma montagem em memória e perde o conteúdo quando removida.
4. **DNS por nome é garantido em redes bridge criadas pelo usuário.** A bridge padrão não deve ser descrita como equivalente a uma rede personalizada nesse aspecto.
5. **`EXPOSE` não publica porta.** A publicação acontece com `--publish` ou `ports` no Compose.
6. **Política `restart` não corrige ordem nem prontidão.** Ela reage ao encerramento do processo. Saúde, dependência e retentativas tratam problemas diferentes.
7. **Compose secrets local não é um cofre criptografado.** Ele monta o segredo como arquivo e reduz exposição, mas o arquivo de origem ainda precisa ser protegido.
8. **Arquivo `.env` com segredo não deve ser versionado.** Facilidade local não justifica colocar credenciais no Git.
9. **Imagens mínimas envolvem troca.** Alpine, slim e distroless reduzem tamanho e superfície, mas compatibilidade e capacidade de diagnóstico também precisam ser consideradas.
10. **Remover um segredo numa camada posterior não apaga a camada anterior.** O correto é impedir sua entrada no contexto e usar mecanismos próprios de segredo.

## Fontes consolidadas

1. Aula 01, Introdução a Containers.
2. Aula 02, Imagens e Containers.
3. Aula 03, Dockerfile e Build de Imagens.
4. Aula 04, Volumes e Redes.
5. Aula 05, Docker Compose.
6. Aula 06, Boas Práticas, Segurança e Troubleshooting.
