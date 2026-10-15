# Parecer bilíngue: Kubernetes Avançado

**Arquivos comparados**

- PT-BR aprovado: `relatorios/kubernetes-avancado/final.md` (2383 linhas)
- EN: `relatorios/kubernetes-avancado/05-tradutor-en.md` (2383 linhas)

Os dois arquivos foram lidos por inteiro. A tradução segue o original linha a linha, então as referências abaixo usam o mesmo número de linha nos dois arquivos, salvo quando indicado.

## Veredito

**APROVADO COM RESSALVAS**

A estrutura, os fatos, os números, a lente de F1 e o tom batem nos dois idiomas. As ressalvas são pontuais: quatro trechos de código em que o tradutor traduziu valores literais de YAML ou de comando (a regra pede código idêntico, com exceção de comentários e saídas), duas ocorrências de "hoje" que já estão no original PT-BR e foram espelhadas no EN, e uma pequena perda de precisão numa analogia da lente.

## O que foi conferido e está equivalente

- **Seções e ordem:** título, citação de origem, introdução, "Como usar", "O que roda no Minikube", lente de F1, glossário, "Onde a comparação para", Etapas 01 a 10 (cada uma com problema, conceito, conceitos-chave, exemplos comentados, comandos essenciais, mão na massa, dica e anota aí), checklist de autoavaliação e notas do professor. Mesma quantidade e mesma ordem nos dois arquivos.
- **Lente de F1 (PT 13 a 90, EN 13 a 90):** 9 parágrafos de lente com o mesmo conteúdo; glossário com as mesmas 41 linhas, na mesma ordem e com o mesmo sentido do dia a dia; "Onde a comparação para" / "Where the comparison stops" com os mesmos 10 itens (Etapas 01 a 10) e as mesmas limitações declaradas. Nenhuma corrida, piloto, equipe ou circuito real nos dois idiomas; "Grande Prêmio" aparece só como formato genérico de fim de semana. As etapas não têm F1 em nenhum dos dois idiomas.
- **Fatos e números:** Buffer (p99, 5 a 10 vezes), Shopify (cerca de 5%), Netflix/Kayenta, Nubank, Mercado Livre, Tinybird (cerca de 20%, 90% no CI), Karpenter (até 30%), Spot (70% a 90%, aviso de 2 minutos), Tesla 2018, SCARLETEEL 2023 (Sysdig), padrões do RollingUpdate (25%, 13 e 8 com 10 réplicas), limiares de despejo (10%, 100Mi, alerta em 80% a 85%), tolerância do HPA (110%, 90%, 10%), `cooldownPeriod` padrão de 300 s, janela de 5 minutos, `duration: 2160h` (90 dias) e `renewBefore: 360h` (15 dias), horários ("3h da manhã" / "3 a.m.", "sexta, às 18h" / "Friday at 6 p.m."). Todos equivalentes.
- **Termos técnicos:** consistentes do começo ao fim (probe, liveness, readiness, startup, requests, limits, throttling, OOMKill, despejo como "eviction", drain, PodDisruptionBudget, maxSurge, maxUnavailable, release, revision, values, canary, scale-to-zero, ServiceAccount, RBAC, least privilege). "Mão na massa" vira "Hands-on", "Anota aí" vira "Takeaway", "Exemplo comentado" vira "Worked example", igual ao guia básico em inglês.
- **Nomes de arquivo e de recurso:** mantidos em português e consistentes em todos os lugares (`deploy-saude.yaml`, `liveness-falha.yaml`, `/tmp/saudavel`, `pod-sem-toleration.yaml`, `pod-com-toleration.yaml`, `fixo`, `treino-ml`, `canario.yaml`, `pod-grande.yaml`, `grande`, `cliente`, `fila`, `pedidos`, `leitor`, `ler-pods`, `bind-leitor`, `ca-interna`, `meuapp`, `meu-cluster`, `nao-existe`, `etapa01/`). Placeholders traduzidos de forma coerente (`<nó>` para `<node>`, `<nome>` para `<name>`, `<verbo> <recurso>` para `<verb> <resource>`, `<revisão>` para `<revision>`, `<imagem>` para `<image>`, `chave=valor` para `key=value`).
- **Comandos, saídas e exercícios:** fora dos itens listados abaixo, todos os blocos `yaml` e `sh` são idênticos, com apenas comentários e textos de saída traduzidos. Os exercícios de "Mão na massa" e o checklist têm a mesma quantidade de passos e os mesmos resultados esperados.
- **Imagens:** nenhuma imagem em nenhum dos dois arquivos. Equivalente.
- **Tom:** calmo nos dois idiomas, sem narração de transmissão, sem exclamações (o grep por `!` não retornou nada em nenhum dos dois arquivos).
- **Gate de travessões:** o grep por travessão e meia-risca retorna uma única ocorrência em cada arquivo, na linha 3 (o intervalo das aulas 1 a 9, em PT e em EN), que é intervalo numérico permitido. Nenhum travessão ou meia-risca na prosa.

## Ressalvas

### Para o tradutor (tradutor-en)

1. **Rótulo de coluna traduzido dentro do comando (Etapa 01).**
   PT linhas 290 e 291: `-o custom-columns=NOME:.metadata.name,QOS:.status.qosClass` e cabeçalho `NOME`.
   EN linhas 290 e 291: `NAME:.metadata.name` e cabeçalho `NAME`.
   O comando deixou de ser idêntico. A troca é coerente com a saída, mas o guia básico em inglês manteve os literais em português dentro do código. Correção: voltar para `NOME` no comando e na saída do EN.

2. **Texto do `http-echo` traduzido no YAML, na saída e no exercício (Etapa 06).**
   PT linhas 1213 e 1236: `args: ["-text=v1 estavel"]` e `args: ["-text=v2 canario"]`; saída nas linhas 1260 e 1261; exercício nas linhas 1359 e 1360.
   EN linhas 1213 e 1236: `-text=v1 stable` e `-text=v2 canary`; saída nas linhas 1260 e 1261; exercício nas linhas 1359 e 1360.
   O manifesto deixou de ser idêntico. Correção: restaurar `v1 estavel` e `v2 canario` no YAML, na saída e nos dois passos do "Hands-on", para que o leitor veja no terminal exatamente o que o texto cita. (O Blue/Green, nas linhas 1059 e 1082, manteve `blue v1` e `green v2`, que já são iguais nos dois idiomas.)

3. **`description` do Chart.yaml traduzida (Etapa 04).**
   PT linha 872: `description: Chart de estudo`.
   EN linha 872: `description: Study chart`.
   Correção: manter `Chart de estudo` no YAML; se quiser, explicar em comentário (`# study chart`).

4. **Valores do chart do podinfo traduzidos (Etapa 10).**
   PT linha 1995: `description: podinfo em formato de produção`. EN linha 1995: `description: podinfo in production format`.
   PT linha 2009: `message: "olá do pitstop.dev"`. EN linha 2009: `message: "hello from pitstop.dev"`.
   Além de quebrar a regra de código idêntico, o `message` diverge do guia básico em inglês, que manteve o literal em português (`relatorios/kubernetes-basico/final.en.md`, linha 1312). Como a Etapa 10 parte justamente do podinfo do guia básico, os dois guias em inglês devem mostrar a mesma mensagem. Correção: restaurar os dois valores em português no EN; a explicação pode ficar no comentário.

5. **Precisão da analogia do segundo chassi (lente de F1).**
   PT linha 23: "com o chassi antigo intacto para voltar se for preciso".
   EN linha 23: "with the old chassis intact in case of need".
   O EN perde a ideia explícita de voltar ao chassi antigo, que é o ponto que liga a analogia ao rollback do Blue/Green. Correção sugerida: "with the old chassis intact so the team can go back to it if needed".

### Para a persona PT-BR responsável pelo conteúdo técnico (professor-software), com espelhamento posterior pelo tradutor

6. **Expressões temporais soltas, presentes no original e repetidas no EN.**
   PT linha 1382: "open source, hoje com providers para outras nuvens". EN linha 1382: "open source, now with providers for other clouds".
   PT linha 1755: "e hoje é um mecanismo legado, raramente usado". EN linha 1755: "and today it is a legacy mechanism, rarely used".
   O guia não tem data de referência, então "hoje" / "now" / "today" ficam sem âncora. Correção no PT: retirar o advérbio ("open source, com providers para outras nuvens"; "e é um mecanismo legado, raramente usado"), como já está feito na nota do professor da linha 2374. Depois, o tradutor espelha a mudança nas mesmas linhas do EN.

## Observações não bloqueantes

- PT linha 2354 / EN linha 2354: "em versões recentes do Kubernetes" / "in recent Kubernetes versions" é relativo ao momento da leitura. Se a persona PT-BR quiser mais precisão, pode citar a versão a partir da qual o aviso de depreciação aparece; o tradutor espelha. Os dois idiomas já estão equivalentes nesse ponto, então não bloqueia.
- EN linha 37: "makes the program be shut down" e "makes the program be slowed down" soam pouco naturais. Sugestão ao tradutor: "gets the program shut down" e "gets the program slowed down", sem mudar o sentido.
- EN linha 1934: "renewal happens on its own, `renewBefore` the expiry" é compreensível, mas fica mais claro como "renewal happens on its own, the `renewBefore` interval before expiry".

## Encaminhamento

- **tradutor-en:** itens 1 a 5 e, depois da correção do PT, o espelhamento do item 6. Observações de estilo das linhas 37 e 1934 a critério do tradutor.
- **professor-software:** item 6 no `final.md` (linhas 1382 e 1755) e, opcionalmente, a observação da linha 2354.

Depois dessas correções, o par fica em condição de APROVADO sem nova rodada completa: basta reconferir as linhas citadas e repetir o grep de travessões.
