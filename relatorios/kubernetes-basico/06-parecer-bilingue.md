# Parecer bilíngue: Kubernetes Básico

Arquivos comparados:
- PT-BR: `relatorios/kubernetes-basico/final.md` (1847 linhas)
- EN: `relatorios/kubernetes-basico/05-tradutor-en.md` (1847 linhas)

## Veredito

**APROVADO COM RESSALVAS**

A estrutura está idêntica: os dois arquivos têm o mesmo número de linhas, e todos os títulos, blocos de código, tabelas, listas e itens de checklist caem nas mesmas linhas. O conversor vai encontrar as mesmas contagens nos dois idiomas. As ressalvas abaixo são de precisão da analogia e de consistência terminológica, e nenhuma delas altera contagem, código ou resultado esperado.

## 1. Contagens exigidas pelo conversor

Todas iguais nos dois arquivos (conferido etapa por etapa e por números de linha).

| Bloco | PT-BR | EN |
|---|---|---|
| Etapas | 9 | 9 |
| Parágrafos da lente de F1 (linhas 15 a 25) | 6 | 6 |
| Linhas do quadro da lente (linhas 29 a 71) | 43 | 43 |
| Blocos "Outro ângulo: na F1" / "Another angle: in F1" | 9 | 9 |
| Plataformas de prática | 7 | 7 |
| Notas do professor | 16 | 16 |
| Total de linhas estruturais (títulos, cercas de código, linhas de tabela, itens de checklist, "Onde a comparação para") | 424 | 424 |

Por etapa (conceitos-chave / blocos de código / comandos essenciais / passos de mão na massa / parágrafos do outro ângulo / linhas da tabela de correspondência / itens do checklist):

| Etapa | PT-BR | EN |
|---|---|---|
| 01 | 9 / 1 / 5 / 4 / 3 / 6 / 3 | 9 / 1 / 5 / 4 / 3 / 6 / 3 |
| 02 | 5 (+6 subitens) / 2 / 7 / 6 / 3 / 7 / 4 | 5 (+6 subitens) / 2 / 7 / 6 / 3 / 7 / 4 |
| 03 | 10 / 2 / 5 / 5 / 3 / 9 / 3 | 10 / 2 / 5 / 5 / 3 / 9 / 3 |
| 04 | 8 / 4 no exemplo + 2 dentro do mão na massa / 5 / 5 / 3 / 7 / 4 | idem |
| 05 | 6 / 3 / 6 / 6 / 3 / 6 / 4 | 6 / 3 / 6 / 6 / 3 / 6 / 4 |
| 06 | 7 / 5 / 3 / 4 / 3 / 7 / 4 | 7 / 5 / 3 / 4 / 3 / 7 / 4 |
| 07 | 8 / 4 (dois exemplos comentados) / 2 / 4 / 3 + lista numerada de 3 itens / 11 / 4 | idem |
| 08 | 8 / 4 / 4 / 5 / 3 / 6 / 4 | 8 / 4 / 4 / 5 / 3 / 6 / 4 |
| 09 | 9 / 5 / 5 / 9 / 3 / 8 / 7 | 9 / 5 / 5 / 9 / 3 / 8 / 7 |

## 2. Itens verificados sem divergência

- **Seções e ordem:** mesmas seções, mesmos subtítulos e mesma ordem do começo ao fim, incluindo os dois exemplos comentados da Etapa 07.
- **Código, YAML e shell:** chaves, valores, portas (80, 9898, 30080, 30898), imagens e tags (`nginx:1.14.2`, `nginx:1.16.1`, `stefanprodan/podinfo:6.14.1`, `registry.k8s.io/hpa-example`), hashes ilustrativos, saídas esperadas e o JSON do `kubectl patch` são idênticos. Só comentários e anotações "←" foram traduzidos, conforme decidido. Valores literais em português (`olá do configmap!`, `sobrevivi!`, `mensagem nova`, `meu-pod`, `gerador`, `/nao-existe`, pastas `etapaNN/`) foram mantidos, conforme decidido.
- **Números:** 45s, 30s, 3 falhas, 15s, ~5min, 70%, 152%, 100m, 50m, 1Gi, faixas 1 a 10 e 2 a 8, revisões 1, 3, 4, sessões de 4 horas. A conversão `0,1 CPU` para `0.1 CPU` está correta.
- **URLs:** todas iguais (docker.com, kubernetes.io, minikube.sigs.k8s.io, killercoda.com, labs.play-with-k8s.com, kubebyexample.com, training.linuxfoundation.org, github.com/kelseyhightower, kodekloud.com, labs.iximiuz.com).
- **Fatos de F1:** o único fato regulamentar (dois carros por equipe) aparece nos mesmos pontos (lente, linha 15; limites das Etapas 01, 05 e 08). Nenhum dos dois arquivos cita corrida, piloto, equipe ou data real, então não há data de referência a divergir.
- **Limitações das analogias:** os nove parágrafos "Onde a comparação para" / "Where the comparison stops" (linhas 194, 342, 479, 663, 849, 1033, 1240, 1429, 1738) dizem a mesma coisa nos dois idiomas.
- **Tom:** calmo nos dois idiomas. As únicas exclamações estão dentro de saídas de terminal ou valores literais (`Done!`, `sobrevivi!`, `olá do configmap!`, `olá do pitstop.dev!`).
- **Travessões e meias-riscas:** zero na prosa. A única ocorrência é "aulas 1–8" / "lessons 1–8" (linha 3 dos dois arquivos), intervalo numérico permitido pelas exceções do projeto.
- **Rótulos internos:** "Hands-on", "Another angle: in F1" e "Takeaway" são citados de forma consistente com os títulos (linhas 7, 25 e 1758 do EN).

## 3. Divergências e ressalvas

### R1. Analogia dos checks da Etapa 07 perde o lado F1 no inglês (tradutor)

O PT-BR usa nomes de F1 para os checks: "check de vida", "check de prontidão", "check de partida". O EN usa os próprios termos técnicos ("liveness check", "readiness check", "startup check"). Com isso a coluna "In F1" repete a coluna "In tech" e algumas frases ficam circulares, por exemplo "The liveness check asks ... (the liveness)".

Localização (mesma linha nos dois arquivos):
- Linha 1218: "só um check de vida detecta" / "only a liveness check detects it".
- Linha 1220: "O check de vida", "O check de prontidão", "O check de partida" / "The liveness check", "The readiness check", "The startup check".
- Linha 1222: "check de vida" (duas vezes) / "liveness check" (duas vezes).
- Linhas 1233 e 1234 (tabela): "Liveness | O check de vida" e "Readiness | O check de prontidão" / "Liveness | The liveness check" e "Readiness | The readiness check".
- Linha 1721: "dois checks reais (vida e prontidão)" / "two real checks (liveness and readiness)".
- Linha 1723: "check de vida" (duas vezes) / "liveness check" (duas vezes).
- Linha 1735 (tabela): "Check de vida apontado..." / "Liveness check pointed...".

Correção: usar um nome do lado F1 que não seja o termo técnico (por exemplo "life check" ou "response check", "ready check" ou "release check", "warm-up check") e aplicá-lo em todas as ocorrências acima, mantendo os termos técnicos só nos parênteses e na coluna "In tech".

### R2. Placeholders de comando inconsistentes no inglês (tradutor)

Na Etapa 02 o EN traduziu o placeholder: linha 220, `kubectl apply -f arquivo.yaml` virou `kubectl apply -f file.yaml`. Nas demais listas de comandos o EN manteve os placeholders em português. Placeholders não são valores literais (não são nomes de Pod, pasta ou mensagem), então a decisão de manter literais em português não cobre esses casos, e o leitor inglês vê dois padrões no mesmo guia.

Localização no EN (no PT-BR são as mesmas linhas, corretas em português):
- `<nome>`: linhas 295, 296, 297, 298, 436, 606, 803, 804, 805, 806, 807, 994, 1193, 1688, 1689, 1690, 1709.
- `arquivo.yaml`: linhas 433 e 437.
- `chave=valor`: linha 436.
- `<comando>`: linha 1689.

Correção: traduzir os placeholders (`<name>`, `file.yaml`, `key=value`, `<command>`) em todas as ocorrências, ou, se o projeto decidir tratá-los como literais, voltar a linha 220 para `arquivo.yaml`. O importante é ter um padrão só. Os placeholders `<service>`, `<pod>`, `<n>` e `<URL>` já são neutros e podem ficar como estão.

### R3. Frase ambígua no "Takeaway" da Etapa 07 (tradutor, baixa prioridade)

Linha 1208. PT-BR: "liveness falhou reinicia o container, readiness falhou tira o Pod do balanceador". EN: "liveness failed restarts the container, readiness failed takes the Pod out of the load balancer". Em inglês a construção pode ser lida como dois verbos em sequência ("liveness failed and restarts"). Sugestão de sentido: "a failed liveness probe restarts the container, a failed readiness probe takes the Pod out of the load balancer". O conteúdo técnico não muda.

### R4. Expressões temporais "hoje" e "amanhã" (persona PT-BR, baixa prioridade)

Os dois idiomas estão equivalentes; a observação é sobre o original. As ocorrências são hipotéticas e não datam fatos, mas a verificação 4 pede ausência de expressões temporais soltas como "hoje".

- Linha 487 (Etapa 04, O problema), autoria do professor-software: "Hoje a API está no IP `10.244.0.5`. Amanhã o Pod morre" / "Today the API is at IP ... Tomorrow the Pod dies". Sugestão de sentido: "Num momento a API está no IP ...; depois o Pod morre".
- Linha 1729 (Etapa 09, tabela de correspondência), autoria do piloto-f1: "Garante que a unidade montada hoje é igual à de amanhã" / "Guarantees that the unit assembled today is the same as tomorrow's". Sugestão de sentido: "Garante que a unidade montada agora é igual à montada depois".
- As ocorrências de "amanhã" nas linhas 350, 366 e 461 são hipóteses condicionais ("se amanhã precisar", "existindo amanhã") e não precisam mudar.

Se a persona PT-BR alterar essas frases, o tradutor deve espelhar a mudança nas mesmas linhas do EN.

## 4. Encaminhamento

- **tradutor-en:** R1, R2 e R3 em `05-tradutor-en.md`. Nenhuma mudança de estrutura é necessária; as contagens devem continuar como estão.
- **professor-software:** R4, linha 487 de `final.md` (opcional).
- **piloto-f1:** R4, linha 1729 de `final.md` (opcional).

Corrigidas R1 e R2, a versão EN pode ser promovida a `final.en.md` sem nova revisão de estrutura.

## Fechamento do ciclo 1

- R1, R2 e R3 aplicadas pelo tradutor em `05-tradutor-en.md`: checks da F1 com nomes próprios ("life check", "ready-to-run check", "warm-up check"), placeholders traduzidos e Takeaway da Etapa 07 sem ambiguidade.
- R4 mantida como está: "hoje" e "amanhã" aparecem em cenas hipotéticas, sem data nem fato que envelheça.
- Verificação final da orquestração: zero travessões fora do intervalo "lessons 1–8", nenhum tom de transmissão, exclamações só em saídas literais, e a estrutura extraída pelo conversor (etapas, lente, exemplos, linhas de código, comandos, passos, blocos de outro ângulo e checklist) é idêntica entre `final.md` e a versão inglesa.

Veredito final: APROVADO.

## Mudança de formato (a pedido do usuário)

Os nove blocos "Outro ângulo: na F1" / "Another angle: in F1" foram removidos das etapas nos dois idiomas. A F1 ficou só na lente geral do início, e a frase "Onde a comparação para" de cada etapa passou a ser um item da nova subseção "### Onde a comparação para" / "### Where the comparison stops", dentro da lente. A abertura e a nota do quadro foram ajustadas para não citar mais os blocos por etapa, e o item da Etapa 08 foi reescrito para não depender do bloco removido. PT e EN continuam alinhados linha a linha (1636 linhas cada).
