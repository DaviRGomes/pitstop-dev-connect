# Parecer bilíngue: Cultura DevOps

- PT-BR (referência aprovada): `relatorios/cultura-devops/final.md` (1724 linhas)
- EN (candidata): `relatorios/cultura-devops/05-tradutor-en.md` (1724 linhas)
- Data de referência dos dados de F1: 2026-10-06 (presente nos dois idiomas: PT/EN linhas 13, 133 e 1604)
- Data do parecer: 2026-10-07

## Veredito

**APROVADO COM RESSALVAS**

A tradução é fiel e está alinhada linha a linha com o original. Nenhuma divergência atinge código, comandos, saídas esperadas, gabaritos ou fatos. As ressalvas são de dois tipos: (a) três ajustes pontuais de terminologia e estilo do tradutor; (b) problemas que já existem no original PT e foram reproduzidos fielmente no EN, entre eles uma expressão temporal solta (linha 139) que fere a verificação 4 e precisa ser corrigida antes da publicação. Depois que a persona PT corrigir o original, o tradutor deve propagar a correção para o EN.

## Resultado por verificação

| # | Verificação | Resultado |
|---|---|---|
| 1 | Seções, tabelas, exemplos, comandos, exercícios: quantidade e ordem | OK. Mesmos títulos H2/H3/H4 nas mesmas linhas; 4 etapas, checklist, notas do piloto, fontes, apêndice e notas do professor na mesma ordem; mesmos exercícios e gabaritos (Etapa 01: 3; Etapa 02: 4; Etapa 03: 3; Etapa 04: 4) |
| 2 | Código, YAML, shell, URLs, números, saídas esperadas | OK. Só os comentários foram traduzidos. Strings literais (`printf` do `dora.sh`, `echo` do `ci.sh` e do `esteira.sh`, `ALERTA: ...`, `displayName: Rodar CI`, `name:` da task Ansible, conteúdo de `postmortem.md`) e todos os blocos `text` de saída esperada continuam idênticos ao PT. URLs das fontes idênticas. Em prosa, a vírgula decimal virou ponto (2,5% para 2.5%; 1,80 s para 1.80 s), o que está correto |
| 3 | Termos técnicos consistentes | OK com ressalvas T1 e T3 |
| 4 | Fatos de F1, data de referência e expressões temporais | Fatos e números idênticos (66 para 84 pontos, 320/236/214/191/188/188/128/96/65/41, construtores 556/405/316/298, 1,80 s, 50 mil euros, mais de 20 recomendações, 23 etapas, rodada 16 de 23, 9 a 11 de outubro de 2026). Expressão temporal solta no original: ressalva P1 |
| 5 | Analogias e limitações declaradas | OK. Todos os blocos "Aqui a analogia para" / "Here the analogy stops" estão presentes e com o mesmo sentido (PT/EN 108, 161, 268, 311, 351, 500, 595, 773, 827, 894, 1200, 1225, 1388, 1425); as 5 limitações de "Onde a comparação para" (86 a 90) e as 12 notas do piloto (1591 a 1602) estão equivalentes |
| 6 | Gate de travessões (— e –) | OK. Nenhuma ocorrência em nenhum dos dois arquivos |
| Extra | Rótulos de acréscimo e tabelas AWS x Azure | OK. `[Acréscimo do professor: Azure]` virou `[Professor's addition: Azure]`, e `[Acréscimo do professor, salvo o citado no material]` virou `[Professor's addition, except where cited in the source material]`, com tradução idêntica nas três tabelas em que aparece (337, 504, 1367). As 9 tabelas AWS x Azure e a de blocos (1352) mantêm as mesmas linhas, colunas e o "(citado no material)"/"(cited in the material)" nos mesmos lugares |
| Extra | Quadro de-para e apêndice | OK. Quadro inicial com 13 linhas (66 a 80) e apêndice com 82 linhas (1620 a 1702), nos dois idiomas, na mesma ordem e com o mesmo sentido |
| Extra | Links internos e âncoras | OK. EN 62 aponta para `#appendix-complete-reference-table`, que corresponde ao título EN 1616 `## Appendix: complete reference table`. PT 62 aponta para `#apêndice-quadro-de-para-completo`, que corresponde ao título PT 1616 |

## Divergências e correções

### Do tradutor (corrigir em `05-tradutor-en.md`)

**T1. "security" virou "safety" (perda de precisão técnica). Severidade: média.**
- PT 1340: "o problema de segurança identificado numa quinta"
- EN 1340: "the safety problem identified on a Thursday"
- O contexto é a "falha de segurança" do parágrafo anterior (PT 1338), que o EN 1338 traduz corretamente como "security flaw". Em DevOps, *safety* e *security* são conceitos distintos. Correção: "the security problem identified on a Thursday".

**T2. Redundância no glossário remissivo do checklist. Severidade: baixa.**
- PT 1546: "a vistoria do parque fechado (o parc fermé do glossário)"
- EN 1546: "the parc fermé inspection (the parc fermé from the glossary)"
- No PT, o parêntese explica o termo em português. No EN, ele só repete o termo. Correção sugerida: "the parc fermé inspection (see the glossary)".

**T3. "pushed" no relato com culpa é ambíguo com `git push`. Severidade: baixa.**
- PT 1235: "O João subiu a v2 sem testar direito"
- EN 1235: "João pushed v2 without testing properly"
- No PT, "subiu" quer dizer implantou, e o restante do guia trata isso como deploy. Correção sugerida: "João deployed v2 without testing properly".

**T4. Nome do módulo com capitalização inconsistente. Severidade: baixa.**
- EN 1 ("DevOps culture: ...") e EN 9 ("DevOps culture" module) usam minúscula. EN 3, 98 e 1723 ("DevOps Culture Grand Prix") usam maiúscula.
- No PT o nome do módulo é sempre "Cultura DevOps" (PT 1, 9). Sugestão: tratar o nome do módulo como nome próprio ("DevOps Culture") em EN 1 e EN 9.

**T5 (opcional). Citação do material na nota sobre CD. Severidade: baixa.**
- PT 593: o material usa "Entrega Contínua (Continuous Delivery e Deployment)"
- EN 593: the material uses "Continuous Delivery (Continuous Delivery and Deployment)"
- Na versão EN a citação parece tautológica, e o ponto do PT (um único termo em português cobrindo as duas práticas) fica menos visível. Sugestão: manter o termo original com glosa, por exemplo: the material uses "Entrega Contínua" ("Continuous Delivery") to cover both Continuous Delivery and Deployment.

Acréscimo aceito (não é divergência): EN 256 acrescenta glosas a nomes de commit em português ("carrinho, the cart"; "cupom, the coupon"; "frete, shipping"). Isso ajuda o leitor EN e não altera números nem strings literais.

### Do original PT (encaminhar à persona PT-BR responsável; depois o tradutor propaga para o EN)

**P1. Expressão temporal solta: "nesta semana". Severidade: alta (fere a verificação 4).**
- PT 139: "Singapura, nesta semana, deixa isso concreto: ... quem levar upgrade para Marina Bay terá uma única sessão para validá-lo."
- EN 139: "Singapore, this week, makes this concrete: ... will have a single session to validate it."
- O trecho não tem data e usa o futuro ("terá"/"will have"). Depois de 11 de outubro de 2026 ele fica errado. Correção sugerida no PT: "O GP de Singapura de 2026 (9 a 11 de outubro, primeiro fim de semana sprint em Marina Bay) deixa isso concreto: no formato sprint há só um treino livre antes do parc fermé, então quem levar upgrade para lá tem uma única sessão para validá-lo." O EN deve ser ajustado da mesma forma.

**P2. Referência relativa, mas ancorada: "último domingo". Severidade: baixa.**
- PT 7: "a corrida do último domingo, 4 de outubro de 2026" / EN 7: "last Sunday's race, October 4, 2026"
- A data absoluta está presente, mas "último domingo" só é verdade na semana de publicação. Sugestão: "a corrida de domingo, 4 de outubro de 2026" / "the race on Sunday, October 4, 2026".

**P3. Outras expressões relativas (ancoradas, sem ação obrigatória).**
- PT 11 "nesta temporada" / EN 11 "this season". A frase já traz a data de 2026, então não há ação obrigatória. Se quiser, troque por "em 2026" / "in 2026".
- PT 1606 "neste ano" / EN 1606 "this year". O parágrafo já é datado (2026-10-06, rodada de outubro de 2026). Sugestão opcional: "em 2026" / "in 2026".
- PT 1299 "esta semana" / EN 1299 "this week". É uma instrução de exercício dirigida ao leitor, não um fato datável. Aceito como está.

**P4. Linha do tempo do incidente contraditória. Severidade: média.**
- PT 1231: "na sexta às 21h, o deploy da v2 quebrou o checkout por 2 horas"
- PT 1249 (modelo `postmortem.md`): "v2 implantada às 09:00. Checkout falhou a partir das 14:00. Restaurado às 16:00", o que coincide com o histórico da Etapa 01 (PT 196 a 198, 2025-03-05, uma quarta-feira).
- O cenário narrado (sexta, 21h) contradiz o post-mortem e o histórico que o laboratório usa. O EN reproduz a contradição fielmente (EN 1231 "on Friday at 9 p.m." e EN 1249 idêntico ao PT). Correção sugerida no PT: alinhar o cenário com o modelo, por exemplo: "o deploy da v2, às 9h, quebrou o checkout das 14h às 16h". Outra opção é dizer explicitamente que o modelo usa outros horários. O tradutor ajusta EN 1231 em seguida.

**P5. Numeração de seções inconsistente. Severidade: baixa.**
- PT 39, 40 e 46 usam "Etapa 02.1" e "Etapa 02.5". PT 862 usa "Etapa 2.6". PT 441, 527, 531 e 1432 usam "seção 2.x".
- O EN reproduz a mesma variação (Stage 02.1, Stage 2.6, section 2.x). Sugestão: padronizar no PT como "seção 2.1", "seção 2.5" e "seção 2.6", e depois propagar para o EN.

## Fatos de F1 conferidos entre os idiomas (sem divergência)

- GP do Bahrein em Sepang, 4 de outubro de 2026: largada atrasada em cerca de 40 min; Ferrari de pneus de pista seca; safety car na volta 9; pódio Verstappen, Antonelli e Hamilton; abandono de Russell; diferença de 66 para 84 pontos (bate com 320 menos 236 na tabela da linha 1606). PT/EN 11, 154, 1606.
- Calendário de 23 etapas, rodada 16 de 23; Singapura de 9 a 11 de outubro de 2026, primeiro formato sprint. PT/EN 133, 1606, 1610, 1723.
- Fatos históricos: Senna em Mônaco 1988 (299), Button no Canadá 2011 (1328), recorde de 1,80 s da McLaren/Norris no Catar 2023 (1540), Senna em Interlagos 1991 (1583), liberação insegura da Ferrari no Bahrein 2018 com multa de 50 mil euros (1275, 1611), investigação do acidente de Grosjean em 2020 (1225, 1612). Tudo idêntico nos dois idiomas.
- O exemplo hipotético (PT/EN 773) está marcado como **hipotético** nos dois idiomas.

## Encaminhamento

1. Persona PT-BR responsável: corrigir P1 (obrigatório) e P4; avaliar P2, P3 e P5.
2. Tradutor EN: aplicar T1 a T4 (T5 é opcional) e, depois que o PT for corrigido, propagar P1, P2, P4 e P5 para `05-tradutor-en.md`.
3. Depois das correções, uma nova checagem rápida só das linhas 7, 139, 1231, 1235, 1340 e 1546 nos dois arquivos é suficiente.
