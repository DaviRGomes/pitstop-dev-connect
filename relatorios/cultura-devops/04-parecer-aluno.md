# Parecer do aluno: Cultura DevOps: da briga entre fábrica e pista à esteira que leva o upgrade sozinha até o carro

*Releitura após o ciclo de revisão 1. Este parecer substitui o anterior (nota 7,5, APROVADO COM RESSALVAS).*

## Veredito

**APROVADO. Nota 9,5.**

Todos os consertos do parecer anterior foram aplicados (os 27 itens da tabela abaixo), e a variável `$LAB` resolveu de vez a cadeia de `cd` que quebrava as Etapas 03 e 04; cada laboratório agora diz onde estou, o que rodar e o que vou ver, inclusive nos casos chatos (avisos do Ansible, `[notice]` do reload, stderr do `unittest`). Sobraram só três ajustes opcionais de clareza, nenhum deles impede o estudo, e o gate de travessões passa limpo.

## O que aprendi (teste de recuperação)

1. DevOps é cultura antes de ferramenta: Dev (quer mudar) e Ops (quer estabilidade) passam a dividir um objetivo e um ciclo contínuo (planejar, desenvolver, entregar, operar e voltar ao planejamento).
2. Mede-se com as quatro DORA: frequência de deploy e lead time (velocidade), taxa de falha e tempo de restauração (estabilidade); segurar mudança pronta numa fila só piora o lead time.
3. IaC descreve o ambiente de forma declarativa (Terraform `plan` antes de `apply`; change set na AWS, `what-if` na Azure), e o Ansible converge a configuração de forma idempotente (`changed=0` na segunda vez).
4. O CI chama um script que roda igual no terminal e no servidor; blue-green troca tudo com volta imediata, canary expõe a poucos por peso; imagem versionada no registro é o mesmo artefato do teste à produção; SLI medido contra SLO dispara alerta.
5. Post-mortem sem culpa pergunta "por que o processo permitiu" e gera ações com dono; a esteira final faz varredura de segredo, CI, deploy com health check e rollback automático, e segredo vazado se revoga, não se apaga.

## Conferência dos consertos do parecer anterior

| Conserto pedido | Situação | Onde |
|---|---|---|
| Enxugar o bloco de campeonato da abertura | Feito: virou uma frase; a classificação foi para "Fontes" | linhas 7, 13 e 1606 |
| Declarar que "Leitura de cockpit" é a voz do piloto | Feito | linha 32 |
| Restaurar x apagar o `repo` na Etapa 01 | Feito, e a Limpeza explica o que fica | linhas 266 e 293 |
| PEP 668 (`pip` fora de venv) | Feito: venv em `$LAB/.venv`, com `pipx` como alternativa | linhas 39, 441 a 447 e 527 a 534 |
| Terraform passo 2 (substituição que não aparecia) | Feito: o passo 1 fecha a deriva com `apply`, e o passo 2 diz o que procurar | linhas 482 e 483 |
| Pasta do Ansible | Feito | linha 530 |
| Formato do `unittest` por versão de Python | Feito | linhas 37 e 676 |
| Raiz do repositório do GitHub Actions | Feito, com o bit de execução no Windows | linha 750 |
| `az pipelines run` sem `--org`/`--project` | Feito | linhas 616 a 620 |
| Canary 9/1 não determinístico | Feito: `zone app 64k;` explicado, mais `sleep 1` após o reload | linhas 811, 821, 825 e 829 a 833 |
| Ordem do passo 2 do canary | Feito: passos (a) a (d), com o motivo e o tempo de espera | linha 862 |
| Porta 5000 no macOS | Feito: registro na 5001 em qualquer sistema | linhas 40, 929 a 960 |
| Explicar `rate` e `http_requests_total` | Feito | linha 1079 |
| Gerador de log como arquivo | Feito: `gerar-log.sh` | linhas 1019 a 1039 e 1112 a 1113 |
| SELinux no `promtool` | Feito | linha 1099 |
| `cd` quebrado na Etapa 03 e pasta do post-mortem | Feito com `$LAB` | linhas 1240 e 1281 |
| `mkdir ../../etapa-04` e `cp -r` | Feito com `$LAB` | linhas 1428 e 1429 |
| `2>&1` na esteira | Feito, com explicação do stderr | linhas 1470 e 1496 |
| `SENHA = "x"` não detectado | Feito, virou lição sobre limites do scanner | linha 1506 |
| "aborta em `ci:`" | Feito: o texto agora descreve a saída real e o código `1` | linha 1507 |
| Marcar acréscimo também na coluna AWS | Feito em todas as tabelas, com "(citado no material)" onde vale | linhas 337, 504, 601, 779, 898, 991, 1367 e 1390 |
| Trava de imagem no ACR | Feito, com o comando | linhas 903 e 922 |
| Deployment Stacks (opcional) | Feito | linha 349 |
| Recorde de pit stop fora da abertura do Mão na massa | Feito: foi para o fechamento do setor | linhas 1504 e 1540 |
| Container: tirar "cronometragem" do kernel | Feito, também no apêndice | linhas 894 e 1666 a 1667 |
| Tracing entre serviços | Feito, também no apêndice | linhas 985 e 1675 |
| Frase do halo | Feito: removida, também no apêndice | linhas 1225 e 1688 |

**Nada novo quebrou.** Refiz o caminho de pastas do início ao fim: toda etapa entra com `cd "$LAB/..."`, então a ordem dos `cd` deixou de importar, e o aviso da linha 54 (repetir o `export` em terminal novo) cobre quem fizer o guia em dias diferentes. O venv é criado na 2.1, reaproveitado na 2.2 e desativado no passo 3 da 2.2 (linha 573), antes do CI, então o `ci.sh` usa o `python3` do sistema como deve. Na Etapa 04, o passo 1 tem as linhas certas (`calc.py` tem 2 linhas, então o comentário cai na linha 4, como a saída diz), e os passos 2 e 3 encadeiam sem estado sobrando. As contas de DORA (12,0 h e 15,6 h) e de SLO (2,5% e 190 ms; 0,5%; 280 ms) continuam corretas.

## Pontos confusos (por seção)

Só ajustes opcionais; nenhum trava a execução.

- [Etapa 02.2, linha 531] O bloco a copiar traz `python3 -m venv "$LAB/.venv"` com o comentário "só se você ainda não criou o ambiente na seção 2.1". Como aluno, fiquei em dúvida se recriar estragaria o `cfn-lint` já instalado. Não estraga (o `venv` sobre uma pasta existente não apaga os pacotes), mas o texto não diz. Conserto: trocar o comentário por "inofensivo se o ambiente já existe" ou tirar a linha do bloco e deixá-la só na prosa. **Persona: professor.**
- [Pré-requisitos, linha 38] Pede "Docker com `docker compose`", mas nenhum laboratório usa `compose`: todos são `docker run`. Um aluno pode perder tempo instalando o plugin. Conserto: trocar por "Docker (o `docker compose` não é necessário)". **Persona: professor.**
- [Pré-requisitos, linha 37, e nota 10 do professor, linha 1719] O mínimo declarado é Python 3.8, mas a conferência foi feita com Ansible core 2.21 e cfn-lint 1.57, que exigem Python mais novo. Com 3.8 a 3.10 o `pip` instala versões mais antigas, que funcionam, mas o aluno pode estranhar a diferença. Conserto: uma frase na linha 37: "com Python anterior ao 3.11, o `pip` instala versões mais antigas do Ansible e do cfn-lint; o laboratório funciona igual". **Persona: professor.**

## Travessões

Rodei o grep de travessão e meia-risca (`grep -nP` com os dois caracteres) no arquivo `/home/davi/repos/pitstop-dev-connect/relatorios/cultura-devops/03-comentarista.md`: **0 ocorrências**. Os intervalos do texto usam "a" ("9 a 11 de outubro") e não há citação com atribuição por travessão. Nenhum, aprovado.

## Analogias

- **Fábrica x equipe de pista (Dev x Ops), linha 108:** ajudou. O limite (mesmo chefe na F1, chefes diferentes nas empresas) é exatamente a diferença que importa.
- **Provedor de nuvem = circuito, linhas 64 e 165:** ajudou muito, e segue consistente até a Etapa 04 e no apêndice.
- **DORA como cadência de upgrades e "peça parada no caminhão", linhas 154 a 159, 258 e 268:** ajudou; deixa o efeito da fila no lead time visível.
- **IaC = ficha de especificação versionada, linha 329:** ajudou; `plan`, `apply` e `destroy` ficaram fixados.
- **Idempotência = "deixe em 22 psi", linha 500:** a melhor do guia, reforçada pelo `changed=0` da linha 565.
- **CI = bancada e simulador; `ci.sh` = coreografia de pit stop, linhas 595 e 742:** ajudou, inclusive na distinção delivery x deployment.
- **Canary = peça num carro só comparada ao carro irmão, linha 773:** ajudou, e o limite (50% da frota, mistura peça com piloto) explica por que o canary de software é aleatório.
- **Container = garagem compartilhando energia e pista (kernel), linha 894:** agora ajudou; sem a "cronometragem" a imagem ficou limpa e coerente com o apêndice (linhas 1666 a 1668).
- **Tracing = peça seguida por cada estação da cadeia, linha 985:** agora ajudou; a ponte "minissetores, só que entre serviços" resolveu o que faltava.
- **SLI, SLO, alerta e `for: 5m`, linha 985:** ajudou bastante.
- **Post-mortem sem culpa = debrief; casos Grosjean 2020 e Ferrari 2018, linhas 1225 e 1275:** ajudou; sem a frase do halo o parágrafo vai direto à investigação sistêmica.
- **Segredo = credencial do paddock pintada na lateral, linha 1388:** ajudou muito.
- **Health check = volta de instalação, linha 1425:** ajudou; o glossário já tinha preparado o termo.

## Exercícios

- **Etapa 01, DORA:** consegui. Saídas e conta à mão conferem; o passo 3 agora deixa claro o que restaurar e o que pode ser apagado.
- **Etapa 02.1, Terraform:** consegui. Os três passos do Mão na massa encadeiam (deriva detectada, deriva fechada, substituição com `1 to add, 0 to change, 1 to destroy`, destroy).
- **Etapa 02.1, `cfn-lint` e `az bicep`:** consegui o `cfn-lint` no venv; o `az bicep` está corretamente marcado como dependente do Azure CLI e como não executado na conferência (linha 1719).
- **Etapa 02.2, Ansible:** consegui; pasta definida, avisos de inventário explicados, `deactivate` no fim.
- **Etapa 02.3, `ci.sh`:** consegui; a diferença de formato por versão do Python está anotada e o opcional do GitHub agora é executável.
- **Etapa 02.4, nginx:** consegui; `zone` torna o 9/1 e o 7/3 exatos, o `sleep 1` evita o worker antigo, e a ordem do passo 2 evita o `host not found`.
- **Etapa 02.5, registro:** consegui, na porta 5001.
- **Etapa 02.6, SLO e `promtool`:** consegui; o `gerar-log.sh` torna os dois ajustes triviais e a explicação de `rate` me deixa ler a regra.
- **Etapa 03, Parte A e post-mortem:** consegui; `cd "$LAB/etapa-01"` funciona de qualquer lugar e o `postmortem.md` tem pasta.
- **Etapa 04, esteira e Mão na massa:** consegui; a saída bate linha a linha com o `2>&1`, e os passos 1 e 2 descrevem o que realmente aparece.
- **Exercícios e gabaritos das quatro etapas:** consegui; coerentes com o texto e com as tabelas AWS x Azure.

## Resumo de consertos por persona

- **Professor (opcionais):** linha 531 (deixar claro que recriar o venv é inofensivo), linha 38 (tirar `docker compose` dos pré-requisitos), linha 37 (nota sobre versões do Ansible e do cfn-lint com Python anterior ao 3.11).
- **Piloto:** nenhum.
- **Comentarista:** nenhum.
