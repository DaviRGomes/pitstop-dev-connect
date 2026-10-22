# Parecer bilíngue: Containers e Docker

Arquivos comparados:
- PT-BR: `relatorios/containers/final.md` (2925 linhas)
- EN: `relatorios/containers/05-tradutor-en.md` (2925 linhas)

## Veredito

**APROVADO COM RESSALVAS**

Os dois arquivos estão alinhados linha a linha, e a estrutura extraída pelo conversor é idêntica (verificação automática prévia: lente, glossário com 54 linhas, 13 itens de limites, 13 etapas, exemplos, comandos, passos, checklist e notas; 1101 linhas de código idênticas fora dos comentários). A leitura integral confirmou fidelidade de sentido na prosa, nos avisos, nas saídas esperadas e nos comentários de código. As ressalvas abaixo são uma inconsistência de código inline (R1, obrigatória), escolhas de palavra em inglês que mudam ou turvam o sentido (R2 a R6) e dois comentários de código errados já no original (O1 e O2). Nenhuma delas altera contagem, estrutura ou resultado esperado.

## 1. Itens verificados sem divergência

- **Seções, tabelas, exemplos, comandos e exercícios:** mesma quantidade e mesma ordem (confirmado pela verificação automática e pela leitura).
- **Código, YAML e shell:** comentários traduzidos sem mudança de sentido em todos os blocos, incluindo os avisos de `--force`, `--volumes`, `RUN rm` e `pg_isready -h`. Valores literais em português (`primeiro-container`, `dados-demo`, `etapa`, `reinicios=`, `configuração ausente`, `raiz bloqueada`, `senha-de-laboratorio` etc.) mantidos de propósito.
- **Números e saídas esperadas:** 67108864, 500000000, 21B e 0B, 50 MB, códigos 0, 1, 42, 125, 126, 127 e 137, `reinicios=3`, quatro linhas de `tentativa`, portas 3000, 3001, 5432 e 8080, limites `0.50`/`128m` e `0.75`/`512m`, prazo de 10 segundos. Todos iguais.
- **URLs e endereços:** `registry.exemplo.com`, `192.168.1.100`, `127.0.0.1`, `localhost:3000/health`. Iguais.
- **Avisos de segurança e perda de dados:** bloco "Cuidado com limpeza" / "Careful with cleanup", passos de `docker volume rm`, `docker compose down --volumes` e `docker.sock` dizem a mesma coisa nos dois idiomas.
- **Lente de F1:** os sete parágrafos (linhas 21 a 31) têm o mesmo conteúdo. Os termos de F1 foram traduzidos como termos do mundo da F1: chassis, power unit, pit lane, pit wall, qualifying, parc fermé, race engineer, radio check, out lap, engine maps, energy modes. O mapeamento para o Docker (linha 27) é idêntico.
- **Fatos de F1:** o único fato regulamentar (dois carros por equipe) e o regime de parc fermé a partir da classificação aparecem nos mesmos pontos. Nenhum dos dois arquivos cita corrida, piloto, equipe ou data real.
- **Glossário em palavras simples (linhas 35 a 88):** mesmas 54 linhas, mesmo sentido do dia a dia, sem F1 nos dois idiomas. Ressalvas só de escolha de palavra (R3).
- **"Onde a comparação para" / "Where the comparison stops" (linhas 94 a 106):** os 13 itens declaram as mesmas limitações nos dois idiomas, inclusive as ressalvas sobre digest como hash, `EXPOSE`, cache por comparação exata, bridge padrão, `depends_on` simples, `--scale` com porta fixa, root por padrão, `/run/secrets`, `docker exec` com container parado, CPU versus memória no cgroup, `unhealthy` sem orquestrador e labels que não protegem.
- **Etapas sem F1:** confirmado nos dois idiomas.
- **Tom:** calmo nos dois idiomas, sem narração de transmissão nem exclamações na prosa.
- **Imagens:** nenhum dos dois arquivos tem imagens; não há divergência de posição, texto alternativo, legenda ou crédito.
- **Travessões e meias-riscas:** zero na prosa. A única ocorrência é "aulas 1–6" / "lessons 1–6" (linha 3 dos dois arquivos), intervalo numérico permitido pelas exceções do projeto.
- **Expressões temporais:** nenhum "hoje"/"today". A única expressão relativa é "ontem"/"yesterday" no glossário (ver O3, opcional).

## 2. Divergências e ressalvas para o tradutor

### R1. Placeholder do digest traduzido em um só ponto (obrigatória)

- Linha 254. PT-BR: `` `imagem@sha256:...` ``. EN: `` `image@sha256:...` ``.
- Linha 421 (Dica da Etapa 02). PT-BR e EN: `` `imagem@sha256:...` ``.

Em todo o EN os placeholders de comando ficaram em português (`nome`, `imagem`, `imagem:tag`, `nome:versão`, `comando`, `serviço`, `caminho`, `pacote`, `chave`, `arquivo.tar`, `perfil.json`, `<nome>`, `<pasta>`). A linha 254 é a única exceção, e o leitor vê dois padrões para o mesmo placeholder.

Correção mínima: voltar a linha 254 para `` `imagem@sha256:...` ``.

Observação de consistência entre guias: no guia de Kubernetes básico, o parecer bilíngue pediu um padrão único e o tradutor traduziu os placeholders (`<name>`, `file.yaml`). Se o projeto quiser o mesmo padrão aqui, traduza todos os placeholders das listas "Essential commands" e da prosa (linhas 211 a 213, 393 a 405, 421, 452, 462, 582 a 587, 820, 859, 986 a 994, 1151 a 1160, 1315, 1316, 1556, 1593, 1784 a 1790, 1856, 1873, 2081 a 2088, 2131, 2250 a 2257, 2441 a 2445), sem tocar em valores literais (`minha-api`, `dados-demo`, `servico=3` usado como nome real etc.). O importante é um padrão só.

### R2. "the factory to the garage" muda o ponto de chegada da lente

- Linha 5. PT-BR: "o mesmo caminho, da fábrica ao box". EN: "the same path, from the factory to the garage".
- Linha 92. PT-BR: "o caminho da fábrica até o box". EN: "the path from the factory to the garage".

No restante da lente, "box" foi traduzido como "bay" e "garagem" como "garage", e o mapeamento da linha 27 diz que a garagem é o host e o carro em funcionamento no box é o container. Com "garage", o ponto de chegada passa do container para o host. Correção: "from the factory to the bay" nas duas linhas.

### R3. Palavras do glossário com cara de jargão ou pouco naturais

- Linhas 59, 60 e 62. PT-BR: "roteiro". EN: "script". No quadro em palavras simples, "script" soa como programa de computador e o glossário pede registro do dia a dia sem jargão. Sugestão: "a single written plan" / "Each item in the Compose plan" / "laid over the plan ... the whole plan" (ou "instruction sheet"). As ocorrências de "script" fora do glossário (linhas 961, 1517, 1519, 1982, 2096, 2847, 2925) estão corretas e podem ficar.
- Linha 84. PT-BR: "O tempo de carência". EN: "The grace time". Sugestão: "The grace period", a expressão do dia a dia.

### R4. Expressão idiomática com outro sentido

- Linha 629. PT-BR: "comece com uma imagem mais completa e \"seque\" depois que tudo funcionar". EN: "\"dry it out\"". Em inglês, "dry it out" sugere desidratar ou parar de beber, não enxugar. Sugestão: "\"trim it down\"" ou "\"slim it down\"".

### R5. Frases que deslocam o sentido técnico

- Linha 1049. PT-BR: "ligam e desligam um container de uma rede em execução". EN: "attach and detach a container from a running network". Em inglês, "running" ficou preso à rede, e rede não "roda". Sugestão: "attach a running container to a network, or detach it from one". Ver também O4, sobre a ambiguidade do original.
- Linha 1268 (comentário de código). PT-BR: "Encerra containers e redes, preservando o volume." EN: "Stops containers and networks, preserving the volume." O `down` remove containers e redes, e "stop a network" não faz sentido em inglês. Sugestão: "Tears down containers and networks, preserving the volume." ("tear down" já é o termo usado para "derrubar" no EN).
- Linha 2495. PT-BR: "antes de subir de verdade". EN: "before really going up". Ambíguo em inglês. Sugestão: "before deploying for real".

### R6. Construções pouco naturais (baixa prioridade)

- Linhas 2129, 2141, 2864 e 2912. EN: "runs out its deadline" / "ran out its deadline". Sugestão: "times out" ou "exceeds its grace period" (por exemplo, "when a `docker stop` times out without the process answering SIGTERM").
- Linha 961. EN: "data in tmpfs survives not even a simple restart". Sugestão: "data in tmpfs does not survive even a simple restart".
- Linha 433. EN: "Downloading a ready-made image solves common tools". Sugestão: "covers common tools" ou "works for common tools".
- Linha 2300. EN: "setting up a simple Compose setup". Sugestão: "putting together a simple Compose setup".

## 3. Erros do original (persona PT-BR)

Os dois idiomas estão equivalentes nestes pontos; o problema está no texto-fonte. Quando a persona corrigir, o tradutor deve espelhar a mudança na mesma linha do EN.

### O1. Comentário contradiz a tag usada (professor-software, recomendada)

Linha 551 (Etapa 03, "a sequência clássica com dependências"). PT-BR: "# Base oficial, com versão explícita do Node." seguido de `FROM node:lts-alpine`. EN: "# Official base, with an explicit Node version." A tag `lts-alpine` é móvel, e o próprio guia diz isso (linha 15, Etapa 02 e nota 17). Sugestão: "# Base oficial do Node; a tag lts-alpine acompanha a versão LTS vigente."

### O2. Comentário diz "menor" sem que a etapa seja menor (professor-software, baixa prioridade)

Linha 2598 (Etapa 13, Dockerfile do capstone). PT-BR: "# Etapa final menor e separada da preparação." EN: "# Smaller final stage, separate from the preparation." As duas etapas usam `node:lts-alpine`, então a final não é menor que a de build; ela só deixa a preparação para trás. Sugestão: "# Etapa final separada da preparação, só com o artefato."

### O3. "ontem" no glossário (persona do glossário, opcional)

Linha 51. PT-BR: "idênticos aos de ontem". EN: "identical to yesterday's". É uma comparação hipotética, sem data nem fato que envelheça, e os dois idiomas estão equivalentes. Se o projeto quiser zero expressões temporais relativas: "idênticos aos da última vez" / "identical to last time's".

### O4. Ambiguidade em "rede em execução" (professor-software, opcional)

Linha 1049. PT-BR: "ligam e desligam um container de uma rede em execução". A frase permite ler que a rede está em execução. Sugestão: "ligam e desligam um container de uma rede sem precisar recriá-lo". Se mudar, o tradutor ajusta R5 de acordo.

## 4. Encaminhamento

- **tradutor-en:** R1 (obrigatória), R2, R3, R4, R5 e R6 em `05-tradutor-en.md`. Nenhuma mudança de estrutura é necessária; o alinhamento linha a linha deve continuar.
- **professor-software:** O1 (recomendada), O2 e O4 (opcionais) em `final.md`.
- **persona responsável pelo glossário da lente (piloto-f1 ou comentarista):** O3 (opcional), linha 51 de `final.md`.

Corrigidas R1 e R2, e aplicadas as demais ressalvas de redação, a versão EN pode ser promovida a `final.en.md` sem nova revisão de estrutura.

## Fechamento do ciclo 1

- R1 a R6 aplicadas pelo tradutor em `05-tradutor-en.md`, com os placeholders traduzidos de forma consistente e os valores literais intactos.
- O1 a O4 corrigidos no original (`final.md`) e espelhados no inglês nas mesmas linhas: comentário da base `node:lts-alpine` (linha LTS; fixar a versão principal em produção), comentário da etapa final do multistage, "da última vez" no glossário e a frase do `docker network connect`.
- Verificação final da orquestração: 2925 linhas alinhadas linha a linha nos dois idiomas, 1101 linhas de código idênticas fora dos comentários, estrutura extraída pelo conversor idêntica e zero travessões fora de "1–6".

Veredito final: APROVADO.
