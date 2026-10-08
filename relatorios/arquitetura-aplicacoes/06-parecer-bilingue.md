# Parecer bilíngue: Arquitetura de aplicações

Arquivos comparados (leitura integral, 1707 linhas cada, alinhados linha a linha):

- PT-BR aprovado: `relatorios/arquitetura-aplicacoes/final.md`
- EN candidata: `relatorios/arquitetura-aplicacoes/05-tradutor-en.md`

## Veredito: APROVADO COM RESSALVAS

Nada bloqueia a publicação. As divergências abaixo são de redação e consistência e não alteram nenhum fato, comando, código ou resultado esperado.

## Verificações

| Item | Resultado |
|---|---|
| Seções e ordem | OK. As mesmas seções na mesma ordem: abertura, glossário de F1, pré-requisitos, quadro de-para, "Onde a comparação para", Etapas 01 a 04 (problema, conceito, exemplo comentado, mão na massa, exercícios, anota aí), checklist, notas do piloto, fontes de F1, apêndice, notas do professor, referências e encerramento. Os números de linha coincidem nos dois arquivos. |
| Exemplos, comandos e código | OK. Os blocos sh, bash, python, dockerfile, yaml, nginx e SQL são idênticos. Só os comentários foram traduzidos. As strings literais (`"rota inexistente neste serviço"`, `"FALHA ao notificar"`, `"SAGA CONCLUIDA"`, `"pedido no monolito: ..."` etc.), os identificadores, as portas, as chaves do Azurite, as URLs e os placeholders (`<conta-unica>`, `<URL-da-fila>`) também são idênticos. |
| Saídas esperadas | OK. `000`, `200`, `404`, `500`, `502`, `201 em 2.0xxxxxs`, `502 em 5.0xxxxxs`, `202 em 0.0xxxxxs`, `120`/`130`, `"Count": 2`, `INSERT 0 1`, `Exited (1)`, as mensagens de `ERROR:`/`NOTICE:` e de 11 a 15 respostas `202` coincidem. Os decimais da prosa foram convertidos corretamente (0,1 s para 0.1 s). |
| Mão na massa | OK. São 4, 3, 8 e 8 itens nos dois arquivos, e as marcações opcional e referência de nuvem coincidem. |
| Exercícios e gabaritos | OK. São 4, 4, 5 e 5 exercícios, e os gabaritos são equivalentes. |
| Checklist | OK. São 7, 6, 7 e 7 itens. |
| Tabelas AWS x Azure e rótulos | OK. As 9 tabelas estão completas e são equivalentes. As ocorrências de "acréscimo do professor" e "citado no material" aparecem 1:1, nas mesmas linhas: 50, 188, 190, 442, 466, 468, 478, 655, 657, 661, 1094, 1098, 1105, 1113, 1131 e 1702. Veja a ressalva T3. |
| Quadro de-para e apêndice | OK. O quadro tem 14 linhas (PT 73-88 / EN 73-88), o apêndice tem 76 linhas (PT 1577-1654 / EN 1577-1654), e a ordem e o sentido são iguais. |
| Links e âncoras | OK. A âncora EN `#appendix-complete-reference-table` (linha 69) resolve para `## Appendix: complete reference table` (linha 1573). A referência textual "F1 data sources" (linha 13) bate com o título da linha 1562. As 8 URLs de fontes são idênticas. |
| Fatos técnicos | OK. Não há perda de precisão em CAP, 2PC, semântica de entrega, DLQ, `-poison`, os cinco níveis do Cosmos DB, Topics Standard/Premium, o papel "Storage Queue Data Contributor" etc. |
| Fatos de F1 e data | OK nos dois idiomas. A data de referência é 2026-10-06 (linhas 7, 13 e 1562). O GP do Bahrein em Sepang foi em 4/10/2026, com largada cerca de 40 min atrasada, safety car na volta 9 e pódio Verstappen, Antonelli e Hamilton. Russell abandonou e é 2º no campeonato. É a rodada 16 de 23. Singapura vai de 9 a 11/10/2026 e terá sprint pela primeira vez. Os fatos históricos estão corretos: Ferrari no Bahrein 2018 com multa de 50 mil euros, Mansell em Adelaide 1986, Multi-21 em Sepang 2013, Senna desclassificado em Suzuka 1989 com vitória de Nannini, e Massa e Hamilton em Interlagos 2008. As marcações "hipotético" aparecem 1:1 (linhas 13, 131, 357, 685 e 1059). |
| Analogias e limites | OK. Todos os blocos "Aqui a analogia para" têm par "Here the analogy stops" com o mesmo limite. A seção "Onde a comparação para" e as 12 notas do piloto são equivalentes. |
| Gate de travessões (— e –) | OK. Não há nenhuma ocorrência nos dois arquivos. |
| Expressões temporais soltas | OK. A busca por hoje/ontem/amanhã/nesta semana/último domingo/recentemente/atualmente (e equivalentes EN) não encontrou ocorrências. A única relativa é "nesta temporada" / "this season" (linha 11), que já está ancorada na mesma frase em "4 de outubro de 2026". Veja a ressalva O1. |

## Divergências: encaminhar ao tradutor (EN)

**T1. Nomes de serviço misturados num resultado esperado.**
- PT 569: "`200` para autenticação, professor e candidato, e `502` para empresa."
- EN 569: "`200` for authentication, professor, and candidate, and `502` for empresa."
- Problema: três nomes foram traduzidos e um ficou em português, sem formatação de código. O leitor EN pode achar que "empresa" é um erro.
- Correção: usar os identificadores do laboratório, que aparecem na saída do `echo -n "$d: "`, assim: "`200` for `autenticacao`, `professor`, and `candidato`, and `502` for `empresa`."

**T2. Frase sem sujeito.**
- PT 1404: "E quem excede não leva punição depois: só tem aqueles pedidos recusados na hora."
- EN 1404: "And whoever exceeds it gets no punishment afterwards: only has those requests refused on the spot."
- Correção: "And whoever exceeds it gets no penalty afterwards: those requests are simply refused on the spot."

**T3. Rótulo de acréscimo com duas formas (baixa prioridade).**
- PT usa sempre "acréscimo do professor". O EN usa "addition by the professor" na prosa (50, 188, 466, 655, 1094) e "added by the professor" nos cabeçalhos das tabelas (190, 468, 657, 1098, 1105, 1113).
- O sentido é o mesmo, mas a regra da linha 50 define o rótulo. Sugestão: unificar ("added by the professor" nos dois lugares) ou citar as duas formas na linha 50.

**T4. Preposição com nome de circuito (estilo, opcional).**
- EN 602 "in Sepang, in 2013", EN 1047 "in Suzuka, in 1989" e EN 390 "In Sepang". Em inglês de F1, o usual é "at Sepang" e "at Suzuka". A linha 1541 já usa "at Interlagos". Sugestão: uniformizar com "at".

**T5. Parênteses aninhados (estilo, opcional).**
- EN 182: `(the material calls it "ator condutor" (driving actor), a hexagonal architecture term ...)`. Sugestão: `(the material calls it "ator condutor", i.e. driving actor, a hexagonal architecture term ...)`.

## Divergências: encaminhar à persona PT-BR responsável (original)

**O1. Data de Singapura sem ano no trecho de cockpit da saga (baixa prioridade).**
- PT 685: "a equipe reserva voo, hotel e carro para Singapura, que acontece de 9 a 11 de outubro." / EN 685: "for Singapore, which takes place October 9 to 11."
- O trecho é ancorado pela data de referência do guia, mas está no presente e sem ano, e envelhece depois de 11/10/2026. Sugestão: "que acontece de 9 a 11 de outubro de 2026". Depois do ajuste no PT, o tradutor replica: "October 9 to 11, 2026".

**O2. Concordância no rótulo dos blocos (baixa prioridade).**
- PT 848: "Os dois últimos itens são opcional e referência de nuvem". A frase usa os rótulos como adjetivos sem concordância, e o EN 848 herda a construção truncada ("are optional and cloud reference").
- Sugestão: "Os dois últimos itens estão marcados como opcional e como referência de nuvem". Depois do ajuste, o tradutor alinha: "The last two items are marked optional and cloud reference".
- O mesmo padrão aparece, aceitável, em PT 1329 ("os blocos opcional e de referência").

## Fora de escopo de correção

- "nesta temporada" / "this season" (linha 11): está ancorada na mesma frase em "4 de outubro de 2026". Não precisa de ação.
- "Próxima etapa" (linha 13) e "A próxima parada do calendário" (linha 1706): são relativas à data de referência declarada (2026-10-06) e trazem datas absolutas. Não precisam de ação.
