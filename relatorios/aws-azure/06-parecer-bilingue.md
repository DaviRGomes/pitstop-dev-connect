# Parecer bilíngue: AWS e Azure lado a lado

- **Original PT-BR:** `relatorios/aws-azure/final.md` (2597 linhas)
- **Candidata EN:** `relatorios/aws-azure/05-tradutor-en.md` (2597 linhas)
- **Data de referência dos dados de F1:** 2026-10-06

## Veredito

**APROVADO COM RESSALVAS**

A versão EN está alinhada linha a linha com o PT: os dois arquivos têm 2597 linhas, e cada título, separador, bloco de código e tabela está na mesma linha nos dois. Não há travessões nem meias-riscas em nenhum dos dois. Blocos de código, saídas esperadas, números e fatos de F1 conferem. Ficam como ressalvas três termos imprecisos (tradutor) e itens do original PT: a afirmação "de 66 para 84 pontos" sem fonte e expressões temporais soltas. A remoção da frase de construtores é intencional e aparece igual nos dois arquivos (PT/EN 15 e 2429), então não é divergência.

## Resultado por verificação

| # | Verificação | Resultado |
|---|---|---|
| 1 | Seções, ordem e junções entre as 12 partes | OK. Os separadores `---` estão nas mesmas linhas nos dois arquivos (93, 274, 557, 746, 982, 1249, 1436, 1616, 1817, 2012, 2207, 2358, 2402, 2436, 2568, 2594; o da linha 1132 fica dentro do YAML). Todo `##` e `###` aparece uma vez só e na mesma linha. Não há título duplicado nem faltando nas junções. |
| 2 | Comandos, policies JSON, YAML, KQL, Python, shell | OK. Código, flags, strings literais e saídas esperadas idênticos ao PT; só os comentários foram traduzidos, e nenhum comentário vem depois de `\`. O diagrama ASCII da Etapa 09 (EN 1910 a 1919) foi traduzido e manteve o alinhamento, o que é aceitável. |
| 3 | Exercícios e gabaritos | OK. São 3 por etapa nas 11 etapas, com mesma ordem e mesmo conteúdo. |
| 4 | Tabelas AWS x Azure e rótulo "Azure (addition)" | OK. O rótulo é usado de forma consistente, incluindo "Azure (read, addition)" (621), "Traffic Manager (addition)" (2054) e as colunas das tabelas da Etapa 11 (2244, 2258). Os títulos de bloco citados em EN 1970 batem com EN 1865 e 1879. |
| 5 | Quadro de-para (59 a 78) e apêndice (2438 a 2566) | OK. Mesmas linhas, mesma ordem e mesmo significado. |
| 6 | Links internos e âncoras | OK. EN 61 `#appendix-complete-mapping-table` aponta para o título EN 2438; PT 61 `#apêndice-quadro-de-para-completo` aponta para PT 2438. A referência "F1 data sources" (EN 15) bate com o título EN 2425. |
| 7 | Fatos de F1 e data 2026-10-06 | OK do EN em relação ao PT: classificação, pódio de Sepang, 4 de outubro de 2026, Singapura de 9 a 11 de outubro de 2026 e fatos históricos (China 2007, Abu Dhabi 2010, Hungria 1998, Brasil 2008). |
| 8 | Analogias e limitações | OK. "Here the analogy stops" e **Hypothetical** estão em todos os pontos correspondentes; as 16 notas do piloto estão completas. |
| 9 | Gate de travessões | OK. Nenhum — ou – nos dois arquivos. Os únicos ` - ` estão em código (688, 1357, 1365). |
| 10 | Expressões temporais soltas | Ressalva. Vêm do original e foram reproduzidas fielmente no EN (lista abaixo). |

## Divergências do tradutor (encaminhar ao tradutor EN)

1. **"agrupador" virou "container".** PT 228 "Crie um agrupador vazio no Azure" virou EN 228 "Create an empty container on Azure"; PT 869 "`--resource-group`: o agrupador" virou EN 869 "the container". Num guia sobre containers (Etapa 05) e containers de Blob (Etapa 09), isso é erro técnico. Use "resource group" ou "grouping", alinhado com EN 136.
2. **"cobrança por atendimento" virou "billed/billing per service".** Aparece em EN 1440, 1450 (duas vezes), 2417 e 2522. Em contexto de nuvem, "per service" lembra "por serviço contratado". Use "per call" ou "per request" de forma uniforme nos cinco pontos.
3. **"instrutor habilitado" virou "certified instructor".** EN 2260. "Certified" é mais forte que "habilitado" e se confunde com o tema de certificações da etapa. Use "qualified instructor" ou "accredited educator". Item menor.
4. **"licence" genérico.** EN 31 "The licence the FIA ... issues" está em ortografia britânica num texto americano. Mantenha "Super Licence" (nome oficial) e troque só o genérico por "license". Item cosmético.

## Itens do original PT (encaminhar à persona PT-BR; depois propagar para o EN)

1. **"de 66 para 84 pontos" sem fonte.** PT 1204 / EN 1204. O 84 tem fonte (320 menos 236, PT 15 e 2429). O 66 só aparece nessa linha: o documento não traz a classificação anterior a Sepang, e o texto das fontes (2431 a 2433) não a menciona. Opções: incluir a classificação após a rodada 15 com fonte, ou reescrever como "a diferença para o Kimi Antonelli chegou a 84 pontos".
2. **Expressões temporais soltas** (cada uma na mesma linha nos dois idiomas):
   - PT/EN 7, "nesta semana" / "this week": não tem data. Sugestão: "na semana de 5 a 11 de outubro de 2026".
   - PT/EN 13, "nesta semana" / "this week": as datas vêm depois, mas a âncora relativa deve virar data.
   - PT/EN 124, "hoje oferece mais de 200 serviços" / "today": o número vem da aula (2025). Sugestão: "segundo a aula (2025)".
   - PT/EN 600 e 1845, "recomendado hoje" / "today"; PT/EN 2075, "modelo recomendado hoje" / "today". Use "na documentação vigente" ou "em outubro de 2026".
   - PT/EN 2588, "no momento" / "at the moment". Use "na data desta versão (outubro de 2026)".
   - Sem ação: PT/EN 2336 "hoje" (o exercício testa justamente o envelhecimento do dado); PT/EN 2181 e 2187 "amanhã" (dentro de um cenário hipotético); PT 2427 "no momento da escrita" (ancorado na consulta de 2026-10-06).
3. **Observações, sem ação obrigatória:**
   - PT/EN 2432 ainda descreve a fonte como cobrindo a "classificação de construtores" / "constructors' standings". Depois da remoção intencional dos números de construtores, a persona pode decidir se mantém a menção.
   - O detalhe "o carro do George Russell parou na reta durante o último safety car" (PT/EN 1204 e 1630) só tem apoio indireto no slug da URL de PT 2432 ("russell-retires-late-on").

## Encaminhamento

- **Tradutor EN:** EN 228, 869, 1440, 1450, 2417, 2522, 2260 e 31.
- **Persona PT-BR:** PT 1204, 7, 13, 124, 600, 1845, 2075 e 2588. Depois da correção, o tradutor replica nas mesmas linhas do EN, e só esses trechos voltam para conferência.
