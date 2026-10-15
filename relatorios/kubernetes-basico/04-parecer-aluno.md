# Parecer do aluno: Kubernetes Básico, do zero ao autoscaling, com a mão no teclado

> Parecer sobre `relatorios/kubernetes-basico/03-comentarista.md` depois do ciclo de revisão 1. Lido de novo do começo ao fim por um aluno de engenharia de software que já programa, nunca estudou Kubernetes e gosta de F1 sem ser especialista.

## Veredito

**APROVADO COM RESSALVAS. Nota 9,3** (antes: 8,5).

Os três problemas centrais do parecer anterior foram resolvidos: o `/panic` agora é apresentado como crash tratado pela `restartPolicy`, existe um teste de liveness de verdade (probe apontada para `/nao-existe`, 404), e a Etapa 07 separa os três casos de recuperação na mesma ordem no texto técnico e no bloco de F1. As ressalvas que sobram são leves: uma inconsistência que a própria revisão criou entre a lente e a Etapa 01 (o que é "container" na F1), um passo da Etapa 09 que precisa esperar o rollout antes de seguir, e um parágrafo de F1 da Etapa 07 denso demais.

## O que aprendi (teste de recuperação)

1. Container é um ambiente leve que divide o kernel do hospedeiro; o Kubernetes mantém um estado desejado declarado em YAML (`apiVersion`, `kind`, `metadata`, `spec`), e tudo passa pelo API Server via kubectl, com o fluxo de debug get, describe, logs.
2. Pod é efêmero e é achado por label; o Service dá nome fixo e balanceia por conexão; a lista real de quem responde é o Endpoints; ConfigMap em variável de ambiente só vale para Pods criados depois da mudança (por isso o `rollout restart`).
3. O Deployment cria um ReplicaSet por versão (o hash do meio do nome do Pod), faz rolling update e rollback para a revisão anterior, que ganha número novo no histórico.
4. Três casos diferentes: processo cai, o kubelet reinicia o container no mesmo Pod (`restartPolicy`); Pod some, o ReplicaSet cria um Pod novo; processo vivo mas travado, só a liveness detecta. Readiness tira do Service sem reiniciar; startup segura as outras.
5. PVC é o pedido, PV o disco, StorageClass o tipo, e emptyDir morre com o Pod; o HPA escala entre piso e teto com metrics-server e `requests`, só CPU e memória vêm prontos, e ele passa a mandar no número de réplicas.

## Pontos confusos (por seção)

### Ainda pendentes

- **[Lente de F1, linha 43, contra Etapa 01, linhas 179 e 188]** A revisão mudou o container na lente para "o sistema montado a partir da folha que funciona dentro do carro; pode ser religado sem trocar o chassi", e o Pod para "o carro sobre um chassi específico". Isso ficou ótimo para a Etapa 07. Mas o bloco de F1 da Etapa 01 continua dizendo que o container é "o carro e seu kit, usando a infraestrutura do circuito" (texto e tabela). Lendo em sequência, fiquei sem saber se container é o carro ou um sistema dentro do carro. Sugestão: na Etapa 01, trocar para "o sistema do carro, montado a partir da folha e rodando sobre a infraestrutura do circuito", ou acrescentar uma frase dizendo que, nesta etapa, "o carro e seu kit" é uma simplificação e que a Etapa 03 separa sistema (container) de carro (Pod). **Persona: piloto.**

- **[Etapa 09, passos 6 e 7]** Depois de restaurar a liveness com `kubectl apply -f deployment.yaml`, o Deployment faz um novo rollout, e o passo 7 pega o primeiro Pod da lista com `head -n 1`. Se eu rodar logo em seguida, esse Pod pode ser um dos antigos (com a probe quebrada) que está terminando, e o `/readyz/disable` vai parar num Pod que some segundos depois. Sugestão: acrescentar `kubectl rollout status deployment/podinfo` logo depois da restauração, antes do passo 7. Dois detalhes do mesmo trecho: durante a falha de liveness o `kubectl get pods -w` pode mostrar `CrashLoopBackOff` entre os reinícios (vale avisar que é esperado), e o `apply` de restauração devolve `replicas: 3` até o HPA reduzir de novo para 2 (vale uma linha). **Persona: professor.**

- **[Etapa 07, bloco "Outro ângulo", primeiro parágrafo, linha 1209]** O conteúdo está certo e na mesma ordem do técnico, mas as três situações estão num parágrafo único e longo, enquanto na parte técnica elas são uma lista numerada. Tive que reler para achar onde terminava cada caso. E a frase final do terceiro parágrafo ("O primeiro é a terceira situação; o segundo é a primeira") mistura ordinais e me fez voltar duas vezes. Sugestão: transformar as três situações numa lista numerada (1, 2, 3, como no técnico) e trocar a frase final por "o primeiro experimento é o sistema ligado e travado (situação 3); o segundo é o sistema que desliga sozinho (situação 1)". **Persona: piloto.**

- **[Etapa 07, saída do `kubectl get pods -w`, linhas 1150 e 1151]** A saída de exemplo mostra `1 (5s ago)` e logo depois `2 (10s ago)`, o que sugere reinícios a cada poucos segundos, enquanto o texto (e a nota 8) diz que o primeiro reinício leva cerca de 45 segundos e os seguintes podem demorar mais. Ponto pequeno, mas me fez duvidar da explicação. Sugestão: um comentário ao lado ("as linhas aparecem com cerca de um minuto de intervalo; o `(Xs ago)` mostra há quanto tempo foi o último reinício"). **Persona: professor.**

- **[Etapa 09, saída do `kubectl get pods,hpa`, linhas 1579 e 1580]** O cabeçalho do HPA está desalinhado com a linha de dados. Cosmético. **Persona: professor.**

### Resolvidos desde o parecer anterior

Professor:
- Etapa 07 agora separa os três casos (crash e `restartPolicy`, Pod que some e ReplicaSet, processo travado e liveness), com um experimento de crash sem probe (`kubectl run crash`) para comparar com o liveness-exec. Etapas 01 e 05 apontam para essa separação sem antecipar demais. Resolvido.
- Etapa 09: `/panic` apresentado como crash tratado pela `restartPolicy`, com `describe` mostrando `Last State: Terminated` e nenhum evento de liveness; teste real de liveness com `kubectl patch` para `/nao-existe`; checklist corrigido. Resolvido.
- Etapa 04: regra do ConfigMap explícita (variáveis lidas na criação do container, Pod precisa ser recriado), com a nuance dos ConfigMaps montados como arquivo. Resolvido.
- Etapa 09: interação HPA `minReplicas: 2` contra `replicas: 3` explicada no conceito, no passo 2, no passo 7 e na saída do `get endpoints`. Resolvido.
- Etapa 09: hostname testado com laço de `curl`, com a explicação de que o navegador reaproveita a conexão. Resolvido.
- Etapa 09: `kubectl apply -f configmap.yaml` como caminho principal e `kubectl edit` como alternativa, com aviso sobre o vi. Resolvido.
- Etapa 05: `kubectl get rs` nos exemplos e nos passos, explicação do hash do nome, passo do histórico com o "1, 3, 4" e a conferência da imagem. Resolvido.
- Etapa 06: `pod-emptydir.yaml` com outro nome de Pod, explicação de por que não editar o Pod existente e saída `No such file or directory`. Resolvido.
- Etapa 08: métricas que exigem adaptador agora no corpo; Etapa 07: ressalva da startupProbe no corpo. Resolvido.
- Etapa 01: `kubectl version --client` antes do cluster. Etapa 02: prompt `#` do shell explicado. Etapa 04: erro esperado e `kubectl get endpoints` vazio. Resolvido.
- Pasta por etapa em "Como usar este guia" e passo de limpeza em todas as etapas que criam objetos. Resolvido.
- Notas do professor reescritas para o leitor ("precisões técnicas"), sem diário de revisão. Resolvido.

Piloto:
- "Unidade de potência" explicada na lente. Resolvido.
- Frase "não precisa decorar o quadro agora" antes do quadro. Resolvido.
- Regra fixa "cada chassi montado é um Pod; trocar o chassi é criar um Pod novo; religar um sistema é reiniciar o container" na lente, aplicada nas Etapas 03, 05, 07 e 09. Resolvido (com a ressalva da Etapa 01 acima).
- NodePort recontado como o mesmo ramal fixo em todas as garagens; ficou compreensível sem a parte técnica. Resolvido.
- Bloco F1 da Etapa 04 agora diz que a folha é lida na montagem do chassi, coerente com a Etapa 09. Resolvido.
- "Posto" substituído por "garagem" nos modos de acesso da Etapa 06, ligado ao nó. Resolvido.
- Tabela da Etapa 09 com linhas separadas para `/panic` e `restartPolicy` e para a liveness em `/nao-existe`. Resolvido.

Comentarista:
- Referência ao `00-bruto.md` removida da abertura. Resolvido.
- "etiqueta" trocada por "label" no comentário de YAML do Service da Etapa 09. Resolvido.

## Tom

Nenhum, aprovado.

O grep `boa tarde|farol|apagaram|no verde|bandeir|não pisca|está no ar|com vocês` não retornou nada. As exclamações do arquivo estão todas dentro de código ou de saídas de terminal ("Done!", "olá do configmap!", "sobrevivi!", "olá do pitstop.dev!"). Não há pilotos, equipes, circuitos ou datas reais; as pessoas citadas (Thiago Adriano, Kelsey Hightower) aparecem como fonte, não como analogia. O tom continua de guia de estudo, calmo do começo ao fim.

## Travessões

Nenhum, aprovado.

A busca por travessão e meia-risca encontrou uma única ocorrência: linha 3, a meia-risca no intervalo numérico das aulas (1 a 8). É a exceção permitida. Contagem fora das exceções: **0**.

## Formato (técnico + outro ângulo)

- **Lente geral:** presente logo depois da abertura e da nota sobre pastas (linha 13). Explica mureta, garagem, chefe de mecânicos, rádio, telemetria, folhas e número de corrida para quem não acompanha F1, agora com "unidade de potência" explicada e uma regra fixa sobre chassi, Pod e container. Única incoerência: a definição de container da lente não bate com o bloco da Etapa 01.
- **F1 vazando na parte técnica:** nenhum caso. Procurei "mureta", "carro", "garagem", "piloto", "pista", "chassi", "etiqueta" e "GP": todas as ocorrências estão na lente (linhas 13 a 71) ou dentro dos nove blocos "Outro ângulo". O resíduo "etiqueta" no YAML da Etapa 09 foi corrigido.
- **Blocos "Outro ângulo: na F1":** presentes nas nove etapas, cada um com "A mesma ideia, contada na F1", tabela `Na técnica | Na F1 | O que as duas têm em comum` e "Onde a comparação para".
- **Teste de ida e volta por etapa:**
  - Etapa 01: passa nos dois sentidos, mas a definição de container diverge da lente (ver pendentes).
  - Etapa 02: passa. Rádio, credencial, ordem direta contra plano escrito, get/describe/logs reconhecíveis um a um.
  - Etapa 03: passa. A frase "trocar o chassi é criar um carro novo, ou seja, um Pod novo" eliminou a dúvida que eu tinha na versão anterior.
  - Etapa 04: passa bem. Lendo só a F1 entendo número fixo, tabela de chassis ligados ao número (Endpoints), os três alcances e a folha lida na montagem; lendo o técnico reconheço cada passo, inclusive o endpoint vazio do exercício.
  - Etapa 05: passa. A marca da versão no nome do chassi corresponde ao hash do ReplicaSet, e a regra de reposição deixa claro que não cuida de falha interna.
  - Etapa 06: passa nos dois sentidos agora que os modos de acesso falam em garagens (nós).
  - Etapa 07: passa. Os três casos aparecem na mesma ordem nas duas partes (técnico 1, 2, 3; F1 primeira, segunda, terceira; tabela idem), e os dois experimentos também. Só a forma (parágrafo único) atrapalha a leitura.
  - Etapa 08: passa parcialmente, como antes. A própria etapa admite que a operação é hipotética; alvo, piso, teto e pré-requisitos são claros, a "carga de trabalho de pista" continua vaga. Aceitável porque o "Onde a comparação para" é honesto.
  - Etapa 09: passa. Cada teste técnico (ConfigMap e `rollout restart`, `/panic`, liveness com 404, readiness e Endpoints, HPA reduzindo para 2) tem o seu passo no bloco de F1, na mesma ordem.

## Analogias

- **Mureta, garagem e chefe de mecânicos (control plane, worker node, kubelet):** ajudou muito, e agora o chefe de mecânicos também explica a `restartPolicy` (religar o sistema no mesmo chassi), o que amarrou a Etapa 07.
- **Rádio e credencial (API Server, kubectl, kubeconfig):** ajudou.
- **Chassi novo é Pod novo, sistema religado é container reiniciado:** ajudou muito. Foi o conserto mais útil do ciclo: resolveu a confusão entre IP que muda e Pod que é substituído, e deu base para os três casos da Etapa 07.
- **Container como "sistema dentro do carro" (lente) contra "o carro e seu kit" (Etapa 01):** atrapalhou um pouco, por inconsistência. Ver pendentes.
- **Número de corrida e tabela de chassis (Service e Endpoints):** ajudou. A tabela vazia quando ninguém tem a etiqueta explica o exercício melhor do que a versão anterior.
- **Rádio interno, ramal fixo em todas as garagens, central pública (ClusterIP, NodePort, LoadBalancer):** ajudou. O ramal igual em qualquer garagem é exatamente a ideia de porta fixa em todo nó.
- **Folha de parâmetros lida na montagem e cópia no cockpit (ConfigMap em variável e em arquivo):** ajudou, e agora é coerente entre as Etapas 04 e 09.
- **Regra de N carros e marca da versão no nome do chassi (ReplicaSet e hash):** ajudou.
- **Pedido formal de armazenamento e garagens que leem e escrevem (PVC e modos de acesso):** neutro a positivo. Continua quase técnico, mas a troca de "posto" por "garagem" ligou os modos de acesso ao nó.
- **Três situações de "o carro parou" (restartPolicy, ReplicaSet, liveness):** ajudou bastante no conteúdo; a forma em parágrafo único é o que falta ajustar.
- **Mureta pondo mais carros (HPA) e assumindo a quantidade da regra:** neutro. Os pré-requisitos e o "a mureta passa a mandar no número" ajudam; a carga em si continua abstrata.

## Exercícios

- **Etapa 01, laboratório:** consegui seguir. O `--client` evitou o susto do erro de conexão.
- **Etapa 02, ciclo de vida e pod quebrado:** consegui seguir. O aviso sobre o prompt `#` resolveu a dúvida.
- **Etapa 03, primeiro YAML e labels:** consegui seguir, com a pasta `etapa03/` e o aviso de não apagar o Pod.
- **Etapa 04, Service e ConfigMap:** consegui seguir. O `kubectl get endpoints` vazio e depois com IP é a prova mais clara do guia de que o Service acha Pods por label. Limpeza completa.
- **Etapa 05, auto-cura, rolling update e rollback:** consegui seguir, e agora vejo os três ReplicaSets aparecendo, o que tornou o rollback concreto.
- **Etapa 06, PVC contra emptyDir:** consegui seguir. O `pod-emptydir.yaml` com outro nome funciona e a saída final está mostrada.
- **Etapa 07, liveness-exec e crash:** consegui seguir. Comparar os dois `describe` (com e sem evento de liveness) foi o melhor momento de aprendizado da segunda metade.
- **Etapa 08, HPA:** consegui seguir, com plano B e limpeza.
- **Etapa 09, podinfo completo:** consegui seguir quase tudo. Passos 1 a 5 e 8 a 9 sem problema. O passo 6 funciona, mas posso ver `CrashLoopBackOff` sem aviso, e entre o 6 e o 7 falta esperar o rollout da restauração para não mirar num Pod que está terminando.
- **Checklist:** atualizado e coerente com as correções (três casos, `/panic` contra liveness, Endpoints, `get rs`, HPA reduzindo para 2).

## Consertos por persona (resumo)

- **Professor:** acrescentar `kubectl rollout status deployment/podinfo` depois de restaurar a liveness na Etapa 09, avisar sobre `CrashLoopBackOff` durante a falha e sobre o `apply` devolver `replicas: 3`; comentar o intervalo real entre as linhas do `get pods -w` na Etapa 07; alinhar o cabeçalho do HPA na saída da Etapa 09.
- **Piloto:** alinhar o bloco F1 da Etapa 01 com a lente (container como sistema do carro, não o carro inteiro); transformar as três situações do bloco F1 da Etapa 07 numa lista numerada e reescrever a frase "o primeiro é a terceira situação; o segundo é a primeira".
- **Comentarista:** nada pendente. Tom, abertura e vocabulário aprovados.
