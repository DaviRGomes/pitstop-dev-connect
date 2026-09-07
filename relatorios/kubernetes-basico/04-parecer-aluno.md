# Parecer do aluno — Kubernetes Básico: do zero ao autoscaling, com a mão no volante

> Parecer sobre `relatorios/kubernetes-basico/03-comentarista.md`, escrito do ponto de vista de um aluno iniciante-intermediário de software que gosta de F1 mas não é especialista.

## Veredito

**APROVADO — nota 9,5/10** *(atualizado no ciclo 1 de revalidação; o parecer original abaixo deu APROVADO COM RESSALVAS — 8,5 — e todas as ressalvas foram sanadas. Detalhes na seção "Revalidação — ciclo 1" ao final.)*

O guia ensina de verdade: a ordem das etapas é impecável (cada conceito usa só o que veio antes), os exercícios têm saída esperada e o fio "Pods são efêmeros → labels → Service → ReplicaSet → PVC" costura tudo. As ressalvas do primeiro ciclo eram pontuais: um risco prático real no exercício do HPA (Etapa 08), duas pequenas lacunas de instrução e um ou outro trecho onde a narração pesava a mão — todas corrigidas.

## O que aprendi (teste de recuperação)

Sem olhar o texto: Kubernetes é um orquestrador de containers que funciona por **estado desejado** — eu declaro o que quero num YAML (`apiVersion + kind + metadata + spec`) e o cluster mantém a realidade alinhada, recriando o que morrer. Pods são efêmeros e mudam de IP, então quem dá endereço fixo é o **Service**, que acha os Pods por **label selector**; configuração fica fora da imagem, em **ConfigMaps**. Em produção ninguém cria Pod avulso: o **Deployment** garante N réplicas, faz rolling update sem downtime e rollback em um comando (`kubectl rollout undo`). Dado que importa mora atrás de um **PVC** (requisição) atendido por um **PV** (storage), porque o filesystem do container morre com o Pod. `Running` não significa saudável: **liveness** falhou = reinicia, **readiness** falhou = sai do balanceador sem reiniciar, **startup** segura as outras; e o **HPA** escala réplicas sozinho — desde que exista metrics-server e `resources.requests`. Quando travar: `get → describe → logs`.

Consegui escrever isso de memória. Nesse critério, o guia cumpriu o objetivo.

## Pontos confusos (por seção) — ciclo 0, status atualizado no ciclo 1

- **[Etapa 08] O maior risco prático do guia: nginx puro quase não queima CPU.** O exercício final gerava carga com um loop de `wget` contra um nginx servindo página estática — risco real de a CPU não passar dos 70% de 100m com um único gerador busybox, deixando o aluno vendo `cpu: 2%/70%` para sempre sem saber se errou. **Conserto sugerido:** trocar a imagem por `registry.k8s.io/hpa-example` ou adicionar nota de contingência. **Persona: professor.** → **SANADO no ciclo 1.**

- **[Etapa 04] Ambiguidade sobre o que vai dentro de `app.yaml`.** O exemplo mostrava três blocos YAML e o shell mostrava `kubectl apply -f app.yaml` antes de o "Mão na massa" dizer o que salvar onde. **Conserto sugerido:** nomear os arquivos nos blocos de código. **Persona: professor.** → **SANADO no ciclo 1.**

- **[Etapa 07] `failureThreshold` citado sem nunca aparecer num YAML.** A nota da linha do tempo dizia "3 falhas seguidas (o padrão do `failureThreshold`)", mas o campo não aparecia em nenhum manifesto da etapa. **Conserto sugerido:** acrescentar o campo comentado num YAML. **Persona: professor.** → **SANADO no ciclo 1.**

- **[Etapa 01] Setup assume Windows/Docker Desktop.** O passo 1 mandava instalar "Docker Desktop" sem alternativa para Linux. **Conserto sugerido:** uma linha sobre Docker Engine. **Persona: professor.** → **SANADO no ciclo 1** (e foi além: a dica do "disjuntor" ganhou o `sudo systemctl start docker`).

- **[Etapa 07] `initialDelaySeconds: 120` na startup probe sem explicar a conta.** O YAML ilustrativo comenta "app lento: espera 2min", mas a janela de startup normalmente se define por `failureThreshold × periodSeconds`. Não está errado, só planta um modelo mental incompleto. **Persona: professor.** → **Não alterado — mantenho como observação menor, não bloqueia nada** (eu mesmo a classifiquei como "não me travou").

- **[Abertura + Etapa 05] Densidade da narração.** Abertura de ~10 linhas com resultado de corrida fictícia e três nomes de pilotos; Etapa 05 empilhando duas referências históricas (Verstappen hoje + Abu Dhabi 2010) antes do problema técnico; "Cronômetro na mão... Valendo!" antes de um exercício que pede calma. **Conserto sugerido:** enxugar ~1/3, cortar uma referência, trocar o tom do interlúdio. **Persona: comentarista.** → **SANADO no ciclo 1.**

- **[Quadro de-para] 45 linhas de tabela antes de qualquer conceito.** Sem aviso, a tabela parecia leitura obrigatória — indigesta na primeira passada, ótima como referência. **Conserto sugerido:** avisar que é referência, não prova. **Persona: professor/comentarista.** → **SANADO no ciclo 1.**

## Analogias

- **Estado desejado = target ditado no rádio** — **ajudou muito**. É a analogia-mestra e o guia a retoma na auto-cura (Etapa 05) e no HPA (Etapa 08), fechando o ciclo. Foi o que fez o Kubernetes "clicar" pra mim.
- **Pod = carro / "o carro é desmontado, a spec permanece"** — **ajudou muito**. A frase "Pods são efêmeros" vira concreta, e o guia avisa (corretamente) que ela é a raiz das Etapas 04, 05 e 06.
- **Labels = etiqueta FIA vs. Annotations = caderno de debrief** — **a melhor do guia**. A distinção "selecionar vs. documentar" ficou impossível de esquecer, e o selector reaparece no Service, no ReplicaSet e no HPA sempre com a mesma imagem.
- **API Server = engenheiro de corrida / kubectl = botão de rádio** — **ajudou**. "Canal único por onde tudo passa" é exatamente o conceito.
- **Service = pit box (posição fixa, carro muda)** — **ajudou**, e a nota do piloto admitindo que o box real não balanceia N carros simultâneos evita que a analogia minta.
- **ClusterIP / NodePort / LoadBalancer = canal interno / portão numerado / entrada com bilheteria** — **ajudou** a memorizar a escala de exposição.
- **Probes: reset do carro / semáforo do box / fire-up da PU** — **ajudou muito**. A tabela mental "o que acontece quando FALHA" ficou gravada pelas três imagens. E o caso Antonelli (pole + volta mais rápida + P16) é o melhor exemplo do guia inteiro para "Running ≠ saudável" — não exige conhecimento avançado, o próprio texto dá os números.
- **PVC = requisição / PV = storage / StorageClass = catálogo; telemetria sobrevive ao carro** — **ajudou**. A separação "o carro não sabe em qual rack está a telemetria dele" traduz bem o desacoplamento.
- **HPA = endurance sem limite de inscrições** — **a mais forçada**, porque precisa quebrar a regra dos 2 carros para funcionar. Mas o guia declara a quebra duas vezes (Etapa 05 e 08) e nas Notas do piloto, então ela não confunde — só rende menos que as outras.
- **Pod multi-container = PU + MGU-K** — **neutra**. Exige saber o que é MGU-K para render algo; sem isso, é só "peças no mesmo carro". A nota do piloto reconhece a limitação. Não atrapalhou, mas também não iluminou.
- **Seção "Notas do piloto — onde as analogias quebram"** — merece elogio específico: é raro material didático com analogia declarar os limites dela. Isso me poupou de levar a analogia longe demais.

## Exercícios

- **[Etapa 01] Installation lap (minikube start/stop)** — **consegui**. Inclusive o bônus de derrubar o cluster para conhecer a cara do erro — ótima ideia. Agora com o caminho Linux explícito.
- **[Etapa 02] Ciclo run→get→describe→logs→delete + `ImagePullBackOff` proposital** — **consegui**. Forçar o primeiro erro cedo, com o caminho de diagnóstico junto, é a melhor decisão didática do guia.
- **[Etapa 03] YAML do Pod + filtros por label** — **consegui**. O aviso "não delete o pod, ele será alvo do Service" mostra que os exercícios foram encadeados de propósito.
- **[Etapa 04] Service NodePort + teste do elo + ConfigMap** — **consegui**. Com os blocos nomeados (`# app.yaml`, `# configmap-pod.yaml`), a ambiguidade de arquivos sumiu. Deletar o pod e ver o Service impassível é o experimento que prova o desacoplamento. A nota do túnel do `minikube service --url` no Windows/Docker evitou uma pegadinha clássica.
- **[Etapa 05] Auto-cura + rolling update + quebra proposital + rollback** — **consegui**. É de fato "O exercício do guia"; ver os pods antigos segurando o serviço com a imagem quebrada ensina mais que qualquer parágrafo. O novo interlúdio ("pressa é inimiga... calma e olhos abertos") combina com o que o exercício pede.
- **[Etapa 06] Escreve → destrói → lê de volta + contraste com emptyDir** — **consegui**. O passo 3 (repetir com `emptyDir` e ver o dado sumir) é o tipo de contraste que fixa conceito.
- **[Etapa 07] liveness-exec com RESTARTS subindo** — **consegui**. YAML completo no texto, saída esperada, `failureThreshold: 3` agora visível antes de a nota citá-lo, e a distinção "YAML ilustrativo vs. executável" sinalizada — sem ela eu teria tentado rodar a imagem fictícia `exemplo:latest`.
- **[Etapa 08] HPA com gerador de carga** — **consegui**. O "Plano B" com três saídas (geradores em paralelo, `requests` 50m, imagem `hpa-example`) cobre exatamente o cenário de falha que eu temia, e o passo 2 do mão na massa aponta para ele. A demo do clímax não fica mais sem rede de segurança.

---

## Revalidação — ciclo 1

Reli apenas os trechos alterados e confirmei, um a um:

1. **[Etapa 08] Plano B do HPA** — presente após o exemplo comentado, com três saídas ordenadas da mais simples à mais fiel ao tutorial oficial (2–3 geradores em paralelo; `requests.cpu: "50m"`; imagem `registry.k8s.io/hpa-example`), e o passo 2 do mão na massa remete a ele ("Se o percentual estacionar abaixo do alvo, use o plano B acima"). **Sanado — era a minha maior ressalva.**
2. **[Etapa 04] Arquivos nomeados** — `# app.yaml — salve o Service neste arquivo` e `# configmap-pod.yaml — os dois objetos no mesmo arquivo, separados por ---` nos blocos de código; o mão na massa agora diz `kubectl apply -f configmap-pod.yaml` no passo 4. **Sanado.**
3. **[Etapa 07] `failureThreshold: 3`** — comentado no YAML das 3 probes ("3 falhas seguidas → reinicia (3 é o padrão)"); a nota da linha do tempo que cita o campo deixou de referenciar algo invisível. **Sanado.** (Eu tinha sugerido no `liveness-exec.yaml`; ficou no YAML ilustrativo — funciona igual, o campo aparece antes da citação.)
4. **[Etapa 01] Linux** — o passo 1 do setup indica Docker Engine com o link da doc, e a dica do disjuntor ganhou `sudo systemctl start docker`. **Sanado, acima do pedido.**
5. **[Quadro de-para] Aviso** — "Não tente decorar esta tabela agora. Ela é o mapa do circuito, não a prova" antes da tabela. **Sanado.**
6. **[Narração]** — abertura enxugada (saíram o pódio do Hamilton e a enumeração longa do traçado; a fala ficou direta), Etapa 05 sem a referência empilhada de Abu Dhabi 2010, e o interlúdio do mão na massa da Etapa 05 trocado por um convite explícito a observar com calma — que, além de resolver o tom, reforça a instrução didática do exercício. **Sanado.**

**Pendência residual (não bloqueante):** a observação menor sobre `initialDelaySeconds: 120` na startup probe (Etapa 07) não foi alterada — eu mesmo a classifiquei como "não me travou", então não desconta de forma relevante.

**Novo veredito: APROVADO — nota 9,5/10.** As seis ressalvas foram sanadas com fidelidade ao que pedi (e em dois casos, além); o guia agora não tem nenhum ponto em que um aluno iniciante-intermediário fique sem saída nos exercícios. O 0,5 restante é a pendência residual acima e o teto natural de qualquer material: só o uso por mais alunos revela o resto.
