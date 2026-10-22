# Parecer do aluno: Containers e Docker: do isolamento de um processo a uma stack completa

Revisão do ciclo 1: releitura completa do arquivo `03-comentarista.md` depois dos consertos do professor e do piloto.

## Veredito

APROVADO COM RESSALVAS. Nota 9/10.

Quase todos os consertos do parecer anterior foram aplicados e os exercícios agora são executáveis e provam o que dizem provar: PID 1 e `--init` em todas as APIs, as duas origens do 137, tmpfs com restart, `--read-only` como root, `.dockerignore` com peso real e o segredo extraído com `docker save`. Sobram ressalvas leves: a lente encurtada perdeu a ligação explícita de cerca de vinte elementos de F1 com o termo Docker correspondente (o próprio "Onde a comparação para" ainda usa esses elementos), e há dois detalhes técnicos pequenos no glossário e no `docker history`.

## O que aprendi (teste de recuperação)

1. Container é um processo comum do host, isolado por namespaces (o que ele vê) e limitado por cgroups (quanto ele gasta), compartilhando o kernel; ele vive enquanto o processo principal (PID 1) vive, e esse PID 1 precisa de um init ou de um tratador para obedecer ao SIGTERM.
2. O Dockerfile é a receita; o build gera uma imagem imutável em camadas, o cache reaproveita até a primeira camada que muda, e apagar um arquivo numa camada posterior não o remove da imagem (dá para extraí-lo com `docker save`).
3. Dado que precisa sobreviver vai para volume nomeado; tmpfs some até num restart; bind mount herda donos e permissões do host; containers se acham pelo nome só em rede personalizada, e só publico a porta do que precisa ser acessado de fora.
4. O Compose descreve a stack; `depends_on` simples só ordena a criação, prontidão exige healthcheck com `service_healthy`, e override, política de reinício (`on-failure:3`), `--scale` e `init: true` ajustam ambiente, recuperação, réplicas e encerramento.
5. Segurança é em camadas (não root, `cap_drop`, seccomp, `read_only`, segredo como arquivo) e diagnóstico segue uma ordem: estado e código de saída (137 só é falta de memória se `OOMKilled=true`), logs, inspect, events, stats e só então exec.

## Pontos confusos (por seção)

- [Lente, parágrafo 4 (linha 27)] O piloto encurtou o parágrafo de tradução, e ele ficou legível, mas agora só liga uns quinze elementos (garagem, divisórias, disjuntor, kit, carro, manual, caixote, armários, intercom, nome de rádio, plano, credencial, parc fermé, envelope, radio check). Os parágrafos anteriores continuam descrevendo vários elementos que perderam o par explícito: catálogos de fornecedores e armazém (Docker Hub e registry privado), etiqueta "especificação B" (tag), lista com números de série (digest), folha de parâmetros (variáveis de ambiente), subconjunto reaproveitado (cache), moldes que ficam na fábrica (multistage), caixa enviada à bancada e lista do que fica de fora (contexto e `.dockerignore`), estrutura com gerador próprio (VM), pasta do notebook (bind mount), quadro-branco (tmpfs), ponto de contato para fora (porta publicada), ordem de montagem (`depends_on`), folha complementar (override), regra de religar (política de reinício), banco de testes (CI), pedidos recusados pela instalação (seccomp), código escrito na peça (segredo em camada), telemetria (log estruturado), volta de saída (`start_period`) e ordem de investigação (Etapa 11). O "Onde a comparação para" das Etapas 04, 05, 08, 11, 12 e 13 conta com esses pares ("subconjunto", "bind mount ... sem paralelo na garagem", "regra de religar", "telemetria", "etiquetas dos caixotes"). Na maioria dos casos eu adivinhei o par, mas tive de voltar ao parágrafo para confirmar. Conserto: em vez de cortar, pôr os pares numa tabela compacta "Na garagem | No Docker" logo abaixo do parágrafo 4, com uma linha por par (era a sugestão do parecer anterior). Persona: piloto.
- [Glossário, Camada gravável] "Tudo o que for anotado nele some quando o hóspede sai e o quarto é desmontado" pode ser lido como "some quando o container para". Na verdade a camada gravável sobrevive a `docker stop` e `docker start` e só some na remoção, e é isso que o passo 4 da Etapa 02 (`docker start ciclo`) e a Etapa 05 mostram. Conserto: "some quando o quarto é desmontado (o container é removido); se o hóspede só sai e volta (parar e iniciar de novo), o bloco continua lá". Persona: professor.
- [Etapa 10, segredo no histórico] A saída esperada fixa `21B` para a linha do `COPY`. Isso vale para o armazenamento clássico do Docker. Com o image store do containerd (padrão do Docker Desktop recente e de instalações novas do Engine), não tenho certeza de que o `docker history` mostra o tamanho exato do arquivo; ele pode aparecer arredondado em kB. O passo 5 do Mão na massa também cita "21B". Conserto: dizer "um tamanho diferente de `0B` (21B no armazenamento clássico; pode aparecer arredondado em kB com o image store do containerd)". Persona: professor.

## Tom

Nenhum, aprovado. O grep de narração (`boa tarde|farol|apagaram|no verde|bandeir|não pisca|está no ar|com vocês`) continua sem resultado. As únicas `!` estão em saídas de comando e código (`Hello from Docker!`, `Welcome to nginx!`, `#!/bin/sh`, `!r.ok`), e nenhum piloto, equipe, circuito ou GP real é citado. Os trechos novos (PID 1, 137, extração com `docker save`) mantêm o tom de guia de estudo.

## Travessões

Nenhum, aprovado. A busca por travessão e meia-risca encontrou uma única ocorrência, na linha 3 (a meia-risca do intervalo "aulas 1 a 6"), que está dentro da exceção de intervalo numérico.

## Formato (lente geral + etapas técnicas)

- **Lente geral:** presente logo depois da abertura. Os três parágrafos de F1 continuam explicando cada termo que usam (chassi, unidade de potência, pit lane, classificação, parc fermé, telemetria, radio check, volta de saída). O exemplo de seccomp ficou concreto ("desligar o quadro geral de energia ou ligar um equipamento novo direto na rede elétrica: a instalação recusa esses pedidos, venham de quem vierem") e agora eu entendo na primeira leitura.
- **Teste da lente:** lendo só a lente, entendo o caminho inteiro da fábrica ao box, sem saber software. A ressalva é a tradução incompleta do parágrafo 4 (ver Pontos confusos).
- **Ponte com Kubernetes:** virou uma nota condicional de duas frases ("Se você já leu os guias de Kubernetes..."). Não atrapalha mais quem está começando. Resolvido.
- **Glossário:** metáfora única para a cadeia central: Container = quarto de hotel ocupado, Imagem = quarto-modelo lacrado, Dockerfile = receita escrita para montar o quarto-modelo, Build = seguir a receita, Kernel e Host = central e prédio, Volume = armário fora do quarto. A linha duplicada "Container em execução" saiu. Termos novos corretos e em palavras simples: Processo principal (PID 1), com o init como "recepcionista que repassa os avisos", EXPOSE, depends_on, Override, OOMKilled e código 137 (com as duas origens), start_period. O tmpfs agora diz "em geral, não é gravado em disco". Resta só a ambiguidade da camada gravável.
- **`### Onde a comparação para`:** presente, 13 itens, um por etapa, todos corretos.
- **F1 nas etapas:** nenhuma. Procurei carro, box, garagem, pit, piloto, telemetria, rádio, parc fermé, kit e afins de "## Etapa 01" em diante e não achei nada. Aprovado.

## Analogias

- **Fábrica, manual, kit em caixotes (Dockerfile, build, imagem, camadas):** ajudou, e agora tem o par explícito no parágrafo 4.
- **Garagem, divisórias, disjuntor (host, namespaces, cgroup):** ajudou; é a melhor imagem do guia.
- **Armários, intercom com nome de rádio, plano do fim de semana (volumes, rede e DNS, Compose):** ajudou, com par explícito.
- **Credencial, parc fermé, envelope, radio check (menor privilégio, secret, healthcheck):** ajudou, com par explícito.
- **Pedidos recusados pela instalação (seccomp):** antes atrapalhava; agora ajuda, com exemplo concreto. Só falta o par explícito "isso é o seccomp".
- **Subconjunto reaproveitado, moldes na fábrica, etiqueta, números de série, folha de parâmetros, pasta do notebook, quadro-branco, folha complementar, regra de religar, banco de testes, código na peça, telemetria, volta de saída, ordem de investigação:** a história continua boa e eu consigo adivinhar o par, mas a lente não diz mais qual termo Docker cada um representa. Atrapalha um pouco na hora de ler os limites das Etapas 04, 05, 08, 11, 12 e 13.
- **Mureta e Pod:** deixou de atrapalhar, porque virou uma nota opcional.
- **Glossário de hotel:** ajudou. Quarto, quarto-modelo e receita agora formam uma cadeia só, e o "recepcionista" do init explica o PID 1 sem jargão.

## Exercícios

- **Etapa 01:** consegui. Sem mudanças, continua correto.
- **Etapa 02:** consegui. O passo 7 agora cria o `nota.txt`, dá a saída do primeiro `cat` e o erro esperado no segundo container. Os passos 2 a 4 têm `HTTP/1.1 200 OK` e `curl: (7) Failed to connect`. Resolvido.
- **Etapa 03:** consegui. A explicação de PID 1 e sinais vem antes do exemplo, o `docker run` usa `--init`, há a saída esperada do servidor e o exemplo diz como encerrar (Ctrl+C ou `docker stop minha-api`). Com `--init` e sem `-t`, o CLI repassa o SIGINT ao init, que o repassa ao Node, e o Node, que não é mais PID 1, encerra. Resolvido.
- **Etapa 04:** consegui. Os arquivos de apoio vêm antes do Dockerfile, há a saída com `CACHED` no segundo build, e o passo 6 usa `--init` e explica como achar o nome aleatório para o `docker stop`. Resolvido.
- **Etapa 05:** consegui. O tmpfs agora prova a perda: `--detach --init`, gravação, `docker restart`, `ls -A` vazio. O restart recria o tmpfs vazio, e o `--init` evita a espera de 10 s do `sleep` como PID 1. A comparação opcional com `--volume dados-demo:/dados` também funciona, desde que rodada antes do passo 6, que apaga o volume. Resolvido.
- **Etapa 06:** consegui. O passo 1 diz para pular os dois comandos de limpeza, os passos 3, 6 e 8 têm as saídas esperadas e a linha IPv6 do `docker port` foi citada. Resolvido.
- **Etapa 07:** consegui. `init: true` no serviço `web` e a explicação do prefixo (`etapa07-db-1`, `etapa07_dados_db`). Resolvido.
- **Etapa 08:** consegui. A saída mostra as três réplicas, o passo 6 mostra a saída do `nginx -t`, e o passo 8 mostra o `Bind for 0.0.0.0:8080 failed: port is already allocated` e termina com `docker compose down`. Resolvido.
- **Etapa 09:** consegui.
  - `--read-only` agora é provado como root (`escrita permitida` sem a opção e `touch: /bloqueado: Read-only file system` com ela), e o texto explica que o teste combinado com `--user node` falha por dois motivos somados. O passo 5 dá as duas mensagens de erro do busybox. Resolvido.
  - No UID em bind mount, a tentativa `echo x >> dados-host/como-root` mostra o `Permission denied` real, o comentário de limpeza está correto (a pasta é minha, então apago pelo host) e o modo rootless foi citado ao lado do Docker Desktop. Resolvido.
  - Ficou explícito que os Dockerfiles do bloco são modelos de leitura e que os `docker run` testam as flags na imagem oficial. Resolvido.
- **Etapa 10:** consegui.
  - O `.dockerignore` agora tem peso real: pasta da Etapa 04, `node_modules/pesado.bin` de 50 MB e `transferring context` de cerca de 50 MB caindo para alguns kB. Há um aviso correto de que o BuildKit transfere o contexto de forma incremental, por isso o primeiro build com o arquivo grande deve ser rodado uma vez só. Resolvido.
  - O roteiro `docker save` mais `tar` funciona com o formato OCI das versões recentes. O laço percorre todos os arquivos extraídos (`find extraido -type f`), então tanto faz se as camadas estão em `<id>/layer.tar` (formato antigo) ou em `blobs/sha256/<digest>` (OCI). Os arquivos que não são tar (`index.json`, `oci-layout`, `manifest.json`, configs) só falham em silêncio por causa do `2>/dev/null`. Se os blobs vierem comprimidos com gzip (caso do image store do containerd), o GNU tar e o bsdtar do macOS detectam a compressão sozinhos na leitura de arquivo, então o `tar -xOf` continua funcionando. O caminho `tmp/segredo.txt`, sem `./`, é o que o BuildKit grava, e a variante com `./` foi citada como alternativa. Só a camada do `COPY` contém o arquivo (a do `RUN rm` traz apenas o whiteout `tmp/.wh.segredo.txt`), então a saída é uma única linha `senha-de-laboratorio`, como o texto promete. Os nomes dos blobs são hashes hexadecimais sem espaço, então o `$(find ...)` sem aspas não quebra. Resolvido. Ressalva só sobre o `21B` do `docker history` (ver Pontos confusos).
  - O `ARG` agora tem `image: versao-demo`, `docker compose build` e a saída `1.4.0`. Resolvido.
- **Etapa 11:** consegui. As duas origens do 137 estão no texto, nos conceitos-chave, no glossário, no checklist e na nota 24, sempre com o critério `OOMKilled=true` ou `false`. A saída do primeiro exemplo mostra a mensagem duas vezes e explica o motivo, o `docker rm` foi separado para o fim, e o `docker events` tem saída esperada. Resolvido.
- **Etapa 12:** consegui. "Ele prova" corrigido. O `HEALTHCHECK` usa a pasta da Etapa 03, avisa sobre a porta 3000, usa `--init` e tem saída esperada (`health: starting` e depois `healthy`; com `--start-period=3s` e intervalo de 5 s, o primeiro teste roda por volta de 5 s, então o `sleep 8` basta). Os passos que dependiam do capstone saíram, com uma frase avisando que estão na Etapa 13. Resolvido.
- **Etapa 13:** consegui. `init: true` na API, comentário do `CMD` corrigido, `chmod 644` do segredo com a explicação do usuário `postgres`, `capstone_dados_db` explicado, um bloco novo "conferindo a stack em execução" com a saída de `ps`, `id` e `volume ls`, e os passos extras 13 a 17 (parar o banco, ver `unhealthy` e o 503, voltar a `healthy`) no lugar certo e com o checklist atualizado. Resolvido. A sugestão opcional `pg_isready -h 127.0.0.1` não foi aplicada; ela não impede o exercício, porque o `--wait` e o healthcheck da API absorvem a janela de inicialização.

## Consertos do parecer anterior: resolvidos e pendentes

**Professor**
- Resolvidos: PID 1 e `--init` (Etapas 03, 04, 05, 07, 12 e 13, nota 23); 137 com duas origens (Etapa 11, glossário, checklist, nota 24); tmpfs com restart (Etapa 05); `--read-only` como root e saídas do passo 5 (Etapa 09); comentário e prova por edição no UID em bind mount (Etapa 09); aviso de modelo de leitura (Etapa 09); `.dockerignore` com peso real (Etapa 10); saída do `docker history` e roteiro `docker save` (Etapa 10); nome da imagem do `ARG` (Etapa 10); saídas esperadas das Etapas 02, 06, 08, 09 e 11; ordem dos arquivos da Etapa 04; passos movidos da Etapa 12 para a 13; "Ele prova"; prefixo do volume e `chmod` do segredo (Etapa 13); glossário com metáfora única, "receita" só para o Dockerfile, termos faltantes acrescentados e tmpfs sem "nunca".
- Pendentes: a camada gravável no glossário ("some quando o hóspede sai") e o `21B` do `docker history`, que talvez varie com o image store do containerd. Opcional: `pg_isready -h 127.0.0.1`.

**Piloto**
- Resolvidos: ponte com Kubernetes reduzida a uma nota condicional; exemplo concreto para os pedidos recusados (seccomp); parágrafo 4 mais legível.
- Pendente: o parágrafo 4 ficou legível porque deixou de traduzir cerca de vinte elementos de F1 que a lente ainda usa. Restaurar esses pares numa tabela compacta "Na garagem | No Docker".

**Comentarista**
- Nada a corrigir: tom calmo, sem narração, sem euforia, sem corridas ou pilotos reais, sem travessões.
