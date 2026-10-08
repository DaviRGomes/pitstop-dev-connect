# Parecer do aluno: Arquitetura de aplicações: da garagem em que todo mundo faz tudo aos postos especializados que conversam pelo rádio

(Releitura após o ciclo de revisão 1: li o arquivo inteiro de novo e conferi cada conserto do parecer anterior.)

## Veredito

APROVADO. Nota 9,4/10.

Todos os consertos do parecer anterior foram aplicados, e nenhum deles quebrou outra parte. Agora sei exatamente em que pasta estou, o que rodar e o que devo ver em cada item, inclusive no macOS com zsh. O que sobrou são cinco ajustes pequenos e não bloqueantes, listados abaixo.

## O que aprendi (teste de recuperação)

1. Camadas organizam o código dentro de um único deploy. Microsserviços cortam o deploy por capacidade de negócio (DDD, bounded context), com falha e escala isoladas: o pedido de 0,1 s levou 4 s no monolito e 0,1 s no serviço próprio.
2. Status code é contrato. O gateway é a voz única na borda: roteia por prefixo, devolve `502` para o serviço caído e `404` para a rota inexistente, aplica rate limit (`429`) e carimba o X-Request-Id.
3. Cada serviço tem o próprio banco. Sem ACID global, a saga encadeia transações locais e compensa em ordem inversa, com ações idempotentes que deixam histórico.
4. O CAP só obriga a escolher entre consistência e disponibilidade durante uma partição. SQL exige migração para mudar o esquema, NoSQL aceita itens diferentes. Event Sourcing guarda eventos, e CQRS tem um modelo de leitura que fica defasado até ser atualizado.
5. A chamada síncrona propaga lentidão e falha. A fila desacopla, mas entrega "pelo menos uma vez" e exige consumidor idempotente e DLQ. O SQS e o Service Bus têm DLQ, o Queue Storage não (salvo a fila `-poison` do Azure Functions).

## Conferência dos consertos do ciclo 1

| Conserto pedido | Situação | Onde |
|---|---|---|
| `cd ..` entre etapas, com `pwd` esperado | Aplicado, com aviso geral na linha 65 | linhas 487, 711, 1142 |
| Aviso de porta ocupada (8080, 8000) | Aplicado | linhas 44 e 979 |
| `init: true` para o stop rápido, com explicação | Aplicado em todos os serviços Python | linhas 286 a 309, 517 a 533, 793 a 805, 1301, 1310 |
| "Ator condutor" e hot/cold cache definidos | Aplicado | linhas 182 e 451 |
| `pg_isready -h 127.0.0.1` no lugar de `sleep 5` | Aplicado, com explicação | linhas 919 e 924 |
| Carro de volta ao `modo/normal` | Aplicado | linhas 894 a 900 |
| `DROP TABLE IF EXISTS` e NOTICE na saída esperada | Aplicado | linhas 942 e 960 |
| `"$EP"` com aspas (bash e zsh) e `unset` na limpeza | Aplicado nas duas etapas | linhas 969 a 979, 1029, 1418 a 1425, 1474 |
| `Count: 2` no DynamoDB Local | Aplicado | linha 981 |
| `labadmin` no Azure e no RDS | Aplicado, com justificativa | linhas 1009, 1015, 1020 |
| Azure Managed Redis | Aplicado | linhas 664 e 1036 |
| Rótulos de acréscimo nas colunas AWS e Azure | Aplicado em todas as tabelas, com regra ajustada na linha 50 | linhas 50, 190, 468, 657, 1097, 1104, 1112 |
| Fila `-poison` do Azure Functions | Aplicado | linhas 1126 e 1483 |
| "Entrada 1/2" no lugar de "Porta 1/2" | Aplicado | linhas 1225 e 1239 |
| `MODO=async docker compose up -d pedidos` e `sleep 6` | Aplicado, com explicação do cache do resolver | linhas 1354 e 1355 |
| Aviso de `MODO=async` em todo `up` seguinte | Aplicado | linhas 1364 e 1377 |
| `grep "via fila"` | Aplicado, com explicação | linhas 1373 e 1377 |
| Filtro por req id no lugar de `tail -4` | Aplicado, com explicação da ordem dos logs | linhas 1384 a 1389 |
| `--skipApiVersionCheck` no Azurite | Aplicado | linhas 1409 e 1412 |
| `{"Messages": []}` no segundo receive do ElasticMQ | Aplicado | linha 1425 |
| Política SQS para o SNS e papel Storage Queue Data Contributor | Aplicado | linha 1465 |
| Concordância ("a Empresa", "o notificador") | Aplicado | linhas 596 e 1137 |
| Piloto: coreografia como mensagem "safety car" da direção de prova | Aplicado, coerente com pub/sub (linha 1119) e com o apêndice (linha 1627) | linha 685 |
| Piloto: gateway x camada de apresentação | Aplicado | linha 484 |
| Piloto: semáforo "agora visto como protocolo" | Aplicado | linha 689 |
| Piloto: limitador do pit lane como analogia do rate limit | Aplicado, com limite honesto e apêndice atualizado | linhas 1403 e 1652 |
| Piloto: voz marcada no relato de Sepang | Aplicado | linha 11 |
| Comentarista: abertura enxuta | Aplicado: nota meta virou uma frase, e a tabela de campeonato foi reduzida | linhas 9 e 13 |
| Comentarista: Multi-21 ligado a contrato | Aplicado | linha 602 |

Nenhum conserto quebrou outro trecho. Conferi a cadeia da Etapa 04 do início ao fim: depois do item 3, o `pedidos` fica em async e o notificador parado. Os itens 4 a 6 mantêm o async, inclusive com o `--scale` opcional. O id do item 5 sai do log do `pedidos` recriado (só `a1` a `a5`) e aparece no notificador. O item 6 vê `202` e `429`.

## Pontos confusos (por seção)

Todos são opcionais e não impedem estudar nem praticar.

- [Etapa 04, linha 1347] A saída agora é `502 em 5.0xxxxxs`, e o texto diz que o `pedidos` "só desiste depois de cerca de 5 s". Como o código tem `timeout=5` na linha 1187, eu concluí que o tempo vinha desse timeout. Mas o nome `notificador` some do DNS, e o `timeout` do `urlopen` não cobre a resolução de nome. Conserto: dizer numa frase de onde vêm os 5 s (a espera da resolução de nome que falha, e não o `timeout=5` do código) ou, se for mesmo o timeout, dizer isso. De qualquer forma, ligar a lição: "falhar devagar também derruba, porque cada pedido segura uma conexão por 5 s". Responsável: professor.
- [Etapa 01 a 04, linhas 119, 133, 146, 429, 620 e 1064] As analogias do dia a dia (restaurante, prédio, praça de alimentação, departamentos, caderno, telefonema x carta) só são reveladas como acréscimo do professor na linha 1674, no fim do documento. No ponto de uso, "a analogia do restaurante" parece vir do material. Conserto: meia frase na nota da linha 9 ("as analogias do dia a dia e as de F1 são acréscimos do guia"). Responsável: professor.
- [Etapa 03, item 5, linhas 918 e 920] Se eu repetir o item 5 sem a limpeza, o `docker run --name pg` falha com "name already in use", e o `CREATE TABLE produtos` falha com "already exists". O item 6 ganhou o `DROP TABLE IF EXISTS`, mas o 5 não. Conserto: `docker rm -f pg 2>/dev/null` antes do `docker run` e `DROP TABLE IF EXISTS produtos;` antes do `CREATE`. Responsável: professor.
- [Abertura, linhas 7 e 11] A linha 7 diz que os blocos **Leitura de cockpit** são "em primeira pessoa", mas o primeiro deles (linha 11) é um relato em terceira pessoa. Isso não atrapalha, mas a linha 7 explica a mesma coisa duas vezes ("no primeiro bloco Leitura de cockpit" e "Segundo: os blocos Leitura de cockpit são a voz do piloto"). Conserto: unir as duas frases numa só. Responsável: comentarista.
- [Fontes, linha 1565] A fonte "Classificação de pilotos após a rodada 16" continua listada, mas a classificação saiu do texto no enxugamento da linha 13 (fica só a menção a Russell ser segundo). Conserto: manter a fonte só como apoio à frase sobre o Russell, ou ajustar o rótulo. Responsável: comentarista.

## Travessões

Nenhum, aprovado. Busquei o travessão (U+2014) e a meia-risca (U+2013), além de U+2012 e U+2015, no arquivo inteiro: zero ocorrências, nem nas exceções permitidas.

## Analogias

- Monolito como garagem que faz tudo, mais o sistema hidráulico: ajudou. O raio de explosão ficou concreto, e o limite está marcado.
- Camadas como cadeia de comunicação, e gateway como o mesmo engenheiro agora na frente de vários postos (linha 484): ajudou. A ligação nova resolveu a dupla função do engenheiro, que antes me confundia.
- Status code como semáforo de liberação, e 2PC como "o mesmo semáforo, agora visto como protocolo" (linha 689): ajudou. A reutilização ficou explícita e passou a ser uma vantagem.
- Double stack: ajudou, e o laboratório mede exatamente isso.
- Bounded context como "janela": ajudou. É a melhor analogia conceitual do guia.
- JWT como credencial do paddock: ajudou.
- Consistência eventual como classificação provisória, e CAP como link de telemetria caído: ajudaram, com os limites bem colocados.
- SQL x NoSQL como planilha de set-up x registro de telemetria: ajudou e casou com o `ERROR` do Postgres e o `Count: 2` do DynamoDB.
- Saga por orquestração (coordenador de logística) e por coreografia (mensagem "safety car" da direção de prova, linha 685): ajudou. Agora a coreografia é assíncrona, não contradiz mais o "a parada é síncrona" da linha 95 e conversa com a mesma imagem de pub/sub da linha 1119.
- Event Sourcing e CQRS como cronometragem e tela de tempos: ajudou, com o `120` antes e o `130` depois do `REFRESH`.
- Fila como pilha de pneus, visibility timeout como "em análise" e DLQ como caixa à parte: ajudou muito, e é consistente do conceito até o emulador.
- Rate limit como limitador do pit lane (linha 1403): ajudou. É mais literal que a versão anterior, e o limite ("controla velocidade, não pedidos por origem; não há punição depois") é honesto.
- gRPC como telemetria: neutra, mas o limite está declarado.
- AWS e Azure como dois circuitos: ajudou, e é consistente no texto todo.
- Fechamentos históricos: o Multi-21 (linha 602) agora tem a ponte explícita com contrato, e os demais (Mansell, Senna 1989, Massa 2008) se entendem sem conhecimento prévio de F1.

## Exercícios

- Etapa 01, monolito x serviços: consegui seguir. Arquivos completos, ordem certa, `sleep 1` antes do `ps` e saídas previsíveis.
- Etapa 02, gateway Nginx: consegui seguir. O `cd ..` e o `pwd` me deixam na pasta certa, e o `502` e o `404` saem como descrito. Não há `upstream` nem `zone` compartilhada, então nenhuma saída depende de round-robin.
- Etapa 03, saga com SQLite: consegui seguir. O `modo/normal` permite repetir a saga, e a prova de isolamento continua clara.
- Etapa 03, Postgres esquema rígido x flexível: consegui seguir. O laço com `pg_isready` por TCP resolve a corrida do initdb. Só não dá para repetir o item 5 sem a limpeza (ver acima).
- Etapa 03, Event Sourcing e CQRS: consegui seguir, e o bloco agora pode ser repetido, com o NOTICE documentado.
- Etapa 03, DynamoDB Local (opcional): consegui seguir, no bash e no zsh.
- Etapa 04, HTTP x fila Redis (itens 1 a 4): consegui seguir. `MODO=async ... up -d pedidos`, `sleep 6`, `grep "via fila"` e o aviso sobre o prefixo eliminam as armadilhas. Não há problema de PEP 668: o único `pip install` roda dentro da imagem oficial `python:3.12-alpine`.
- Etapa 04, X-Request-Id (item 5): consegui seguir. O filtro por id dá exatamente as duas linhas prometidas.
- Etapa 04, rate limit (item 6): consegui seguir, e o modo async é preservado mesmo com o `--scale`.
- Etapa 04, ElasticMQ e Azurite (opcional): consegui seguir. As saídas esperadas cobrem as variações da CLI.
- Comparações AWS x Azure: claras, corretas e marcadas como acréscimo em todas as tabelas (cobrança e consistência DynamoDB x Cosmos DB, semântica de entrega, DLQ e `-poison`, camadas do Service Bus, Event Hubs com Kafka, APIM x API Gateway, Managed Redis).
- Exercícios conceituais: todos respondíveis com o que o texto ensinou, com boas respostas esperadas.
