# Parecer bilíngue: Arquitetura Cloud (PT-BR x EN)

- Original aprovado: `relatorios/arquitetura-cloud/final.md` (1796 linhas)
- Candidata EN: `relatorios/arquitetura-cloud/05-tradutor-en.md` (1796 linhas)
- Data da revisão: 2026-10-07

## Veredito: APROVADO COM RESSALVAS

A tradução é fiel e completa. A numeração de linhas bate entre os dois arquivos. Não há divergência de conteúdo técnico, de código, de saídas esperadas, de exercícios ou de fatos de F1. As ressalvas são de dois tipos: (a) três ajustes pequenos do tradutor, nenhum bloqueante; (b) expressões temporais sem data e um número de campeonato a conferir, que estão no original PT e foram reproduzidos fielmente no EN. Corrigir primeiro no PT e depois espelhar no EN.

## Verificações com resultado conforme

| Item | Resultado |
|---|---|
| Seções e ordem | Iguais. Abertura, glossário, "Como ler", quadro de-para, "Onde a comparação para", Etapas 01 a 06 (O problema, O conceito, Exemplo comentado, Mão na massa, Exercícios, Anota aí), checklist, Notas do piloto (15 itens), Fontes F1, Apêndice, Notas do professor (10 itens + 7 limites), Referências, encerramento. Linhas equivalentes nos dois arquivos |
| Código, YAML, Bicep e shell | Idênticos. Só os comentários foram traduzidos, o que é aceito. Nomes de variáveis, strings literais (`"ABERTO: nem tentei"`, `"SEM TAG OU FORA DO PADRAO:"`, `UM/mes`, `dados do cliente` etc.), caminhos `$LAB/etapa-0X` e parâmetros de CLI estão preservados |
| Saídas esperadas | Idênticas: PT 222-223, 239-240, 398-399, 578-581, 645-651, 674-680, 828, 834, 1047-1055, 1392-1395, 1423-1427, 1478-1485, mesmas linhas no EN |
| Exercícios e gabaritos | Mesma quantidade (4, 4, 5, 4, 6, 7) e mesmas respostas. Valores conferidos: 43,200 min e 43.2 min (Etapa 03, ex. 2), 0.997003 (ex. 3), 9 sub-redes AWS e 3 na Azure (Etapa 05, ex. 3) |
| Números na prosa EN | Ponto decimal e vírgula de milhar aplicados (99.9%, 5.26, 0.50 UM, 43,200, 50,000, 63.8%). Valores iguais aos do PT. A nota de convenção (EN 50) foi adaptada corretamente ao inglês |
| Marcação "(material, ref. jun/2025)" | Presente nos mesmos pontos nos dois idiomas (48, 182, 556, 755, 793, 799, 1321) |
| Data de F1 2026-10-06 | Presente nos dois idiomas (7, 13, 1643, 1645). Fatos iguais: pódio Verstappen, Antonelli, Hamilton; Russell abandona; Ferrari de slicks; safety car na volta 9; Singapura de 9 a 11/10/2026 com sprint; Bahrein 2018 (multa de 50 mil euros); McLaren 2007 (100 milhões de dólares); Silverstone 2020; Suzuka 1988 |
| Tabelas AWS x Azure e rótulos de acréscimo | As 17 tabelas aparecem na mesma ordem, com as mesmas linhas. Os rótulos "acréscimo do professor", "(do material)" e "(não citado no material)" estão todos mantidos como "professor's addition", "from the material" e "(not cited in the material)" |
| Quadro de-para e apêndice | Quadro inicial com 13 linhas e apêndice com 95 linhas, iguais e na mesma ordem (PT/EN 90-103 e 1659-1755) |
| Link interno | EN 86 `#appendix-complete-reference-table` aponta para o título EN 1655 "Appendix: complete reference table". O link funciona. O link PT 86 também funciona |
| Termos técnicos | Consistentes: Leitura de cockpit = Cockpit perspective; Aqui a analogia para = Here the analogy stops; teto de gastos = cost cap; cota de componentes = component allotment; pavilhão = pavilion; disjuntor = breaker; orçamento de erros = error budget; Anota aí = Remember this |
| Gate de travessões (— e –) | Nenhuma ocorrência nos dois arquivos |
| Analogias e limitações | Os 15 limites das Notas do piloto e todos os blocos "Aqui a analogia para" estão preservados com o mesmo sentido |

## Divergências do TRADUTOR (corrigir no EN)

1. **EN 60, rótulo não traduzido.** A prosa EN traz `**[CRIA RECURSO]**` em português. O rótulo não aparece em nenhum comando do guia, então não precisa ficar idêntico a um código. Sugestão: `**[CREATES RESOURCE]**`. PT 60 está correto. Severidade baixa.
2. **EN 1000, redundância que pesa na leitura.** "A well-applied Well-Architected review asks the same question at every review." O PT 1000 diz "Um Well-Architected bem aplicado faz a mesma pergunta a cada revisão". Sugestão: "A well-applied Well-Architected framework asks the same question at every review." Severidade baixa (estilo).
3. **EN 1564, repetição de "inspection".** "This is the parc fermé inspection, the area where cars are held for inspection after the race". Sugestão: "This is the parc fermé check, the area where cars are held for scrutineering after the race". PT 1564 está correto. Severidade baixa (estilo).

## Divergências do ORIGINAL PT (encaminhar à persona PT-BR; o EN só reproduziu)

Expressões temporais sem data ou relativas à data de leitura. Depois que o PT for corrigido, o tradutor espelha a mudança no EN.

4. **PT 488 / EN 488: "nesta semana" / "this week".** "em Singapura, nesta semana, engenheiros ... vão acompanhar". Sugestão: "em Singapura, de 9 a 11 de outubro de 2026, ...". Responsável: comentarista/piloto PT.
5. **PT 839 / EN 839: "para onde o grid vai nesta semana" / "where the grid goes this week".** Sugestão: "para onde o grid vai de 9 a 11 de outubro de 2026". Responsável: piloto PT.
6. **PT 177 / EN 177: "foi alterado ... recentemente (hoje, Azure Local)" / "recently changed ... (today, Azure Local)".** Sugestão: "(Azure Local, conforme a documentação consultada em 2026-10-06; confirme)" ou outra data efetivamente verificada. Responsável: professor PT.
7. **PT 1770 / EN 1770: "oferecem hoje criptografia em repouso" / "today offer".** Ancorar a data, por exemplo "oferecem, em 2026, ..." (com data de verificação), ou retirar "hoje". Responsável: professor PT.
8. **PT 1771 / EN 1771: "já venceram na data atual" / "at the current date".** Sugestão: "já venceram em 2026". Responsável: professor PT.
9. **PT 48 / EN 48: "hoje, em 2026" / "today, in 2026".** O ano já está ancorado, então o caso é aceitável. Para manter o padrão, sugere-se retirar "hoje": "em 2026, várias já venceram". Responsável: professor PT. Severidade baixa.
10. **PT 1225 / EN 1225: "o método mais robusto atualmente" / "currently".** A frase é atribuída ao material (jun/2025). Sugestão: "o mais robusto à época do material (jun/2025)". Responsável: professor PT. Severidade baixa.

Dado de campeonato a conferir:

11. **PT 1647 / EN 1647: soma de construtores da Red Bull.** Verstappen (188) e Hadjar (96) somam 284, mas o texto registra "Red Bull 298". As somas de Mercedes (556), Ferrari (405) e McLaren (316) fecham com os pilotos listados. Pode haver pontos de outro piloto da Red Bull na temporada, mas o texto não explica a diferença. Responsável: piloto PT. A persona deve conferir nas fontes já citadas (RaceFans, Formula1.com) e corrigir o número ou acrescentar a explicação. O EN reproduz o mesmo valor.

## Encaminhamento

- Tradutor EN: itens 1 a 3 agora. Itens 4 a 11 só depois que o PT for corrigido, espelhando a nova redação.
- Persona PT-BR (piloto, comentarista e professor): itens 4 a 11.
- Após as correções, não é preciso refazer a revisão completa. Basta reconferir as linhas citadas e rodar de novo o gate de travessões.
