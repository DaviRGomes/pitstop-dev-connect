# Parecer bilíngue: Escalabilidade nos servidores (final, ciclo 1)

- **Original (PT-BR aprovado):** `relatorios/escalabilidade/final.md`
- **Candidata (EN):** `relatorios/escalabilidade/05-tradutor-en.md`
- **Data da revisão:** 2026-10-05
- **Escopo:** o ciclo 0 leu os dois arquivos inteiros. O ciclo 1 conferiu as correções T1 a T5 (tradutor) e P1 a P4 (persona PT-BR, propagadas ao EN). Como o EN foi reescrito por inteiro, o ciclo 1 também refez a checagem de paridade.

## Veredito

**APROVADO**

Todas as correções pedidas no ciclo 0 foram aplicadas, e a paridade estrutural e de código entre PT e EN continua íntegra. Não há divergências abertas. Ficam só duas observações não bloqueantes (O1 e O2), registradas para ciclos futuros.

## Correções do ciclo 0: conferência

| Item | Local (PT / EN) | Situação |
|---|---|---|
| T1 "query" no sentido errado | 1307 / 1307 | Corrigido: "Read access can be copied to as many circuits as you like". |
| T2 "primary" usado para o titular do rádio | 1352 e 2095 / 1352 e 2095 | Corrigido: "when the regular race engineer drops out", igual nas duas linhas. |
| T3 "From the cockpit" | 2144 / 2144 | Corrigido: "From the commentary box, that is all." |
| T4 "parc ferme" | n/a / 1942 | Corrigido: "parc fermé". |
| T5 formato de horário | n/a / 114 e 307 | Corrigido: o 24 h agora é usado nas duas linhas ("8:55", "18:05", "20:00", "19:50", "22:00"). |
| P1 "No domingo passado" | 11 / 11 | Corrigido: "No domingo, 4 de outubro de 2026" / "On Sunday, October 4, 2026". |
| P2 "neste fim de semana" | 1054 / 1054 | Corrigido: "Para Singapura (9 a 11 de outubro de 2026)" / "For Singapore (October 9 to 11, 2026)". |
| P3 "hoje se usam" | 2115 / 2115 | Corrigido: "em 2026, as alternativas mais usadas são outras" / "in 2026, the most widely used alternatives are others". |
| P4 "desafios atuais" | 125 / 125 | Corrigido: "desafios das arquiteturas modernas" / "challenges of modern architectures". |

## Paridade geral depois da reescrita do EN

| Verificação | PT | EN | Resultado |
|---|---|---|---|
| Linhas totais | 2145 (2144 + linha final vazia) | 2145 (idem) | Iguais |
| Títulos (`#`, `##`, `###`) | 92 | 92 | Iguais |
| Delimitadores de bloco de código | 194 | 194 | Iguais |
| Linhas de tabela | 118 | 118 | Iguais (quadro com 10 linhas e apêndice com 79, nas linhas 45-56 e 2026-2106) |
| Linhas de código e de saída (padrões de shell, YAML, nginx, JSON, `X-Cache`, `OK`) | 533 | 533 | Iguais |
| URLs `http://` dentro do código | 26 ocorrências | 26 ocorrências | Mesmas linhas |
| URLs das fontes de F1 (2016-2018) | 6 | 6 | Strings idênticas |
| Âncora interna | `#apêndice-quadro-de-para-completo` (43 para 2022) | `#appendix-complete-reference-table` (43 para 2022) | As duas resolvem |
| Strings literais e saídas esperadas em PT no EN (`latência de uma requisição`, `processando pedido`, `ok na tentativa`, `HIT  Camiseta`, `MISS Camiseta Azul`, `667 de 1000`, `20 200`, `180 v1`, `asset servido pela borda`, `seguindo $RID`) | presentes | presentes nas mesmas linhas | OK |
| Números e fatos (320/236 pontos, 1,80 s / 1.80 s, 43,2 / 43.2, Singapura 9 a 11/10/2026 nas linhas 13, 1036 e 1054) | presentes | presentes nas mesmas linhas | OK |
| Data 2026-10-05 | linhas 7, 13 e 2014 | linhas 7, 13 e 2014 | OK |
| Gate de travessões (— e –) | 0 | 0 | OK |

Não encontrei nada perdido ou alterado fora dos itens corrigidos.

## Observações não bloqueantes

**O1 (persona PT-BR, opcional).** Na linha 2115, a nova redação de P3 ("em 2026, as alternativas mais usadas são outras, como o Resilience4j") troca um advérbio temporal por uma afirmação de popularidade sem fonte. A formulação "e alternativas como o Resilience4j a substituíram na maioria dos projetos novos" é neutra e dispensa medição. Se mudar, propagar ao EN.

**O2 (persona PT-BR, opcional).** A linha 292 mantém "Hoje é o seu `sh -c`" / "Right now it is your `sh -c`". Aqui o sentido é "nesta montagem do laboratório", não uma data, então não viola a regra. Para uniformizar, "Por enquanto, é o seu `sh -c`" / "For now, it is your `sh -c`" resolve.

Continua valendo a observação do ciclo 0: o PT não tem gabarito para os exercícios 3 e 4 da Etapa 03 e dá só uma dica no exercício 1 da Etapa 05. O EN segue a mesma estrutura, então não há divergência.
