# Parecer do aluno: Kubernetes Avançado: operando clusters de verdade, da saúde dos pods ao deploy em produção

> 2º ciclo de revisão (último). Reli o arquivo `03-comentarista.md` inteiro, da abertura às Notas do professor, e conferi cada conserto pedido no 1º ciclo.

## Veredito

APROVADO. Nota 9,0/10.

Os 15 consertos técnicos do professor foram aplicados e funcionam: os laboratórios agora se comportam como o texto diz, a liveness é demonstrada de verdade e não sobrou metáfora de carro dentro das etapas. Os gates de travessão, de tom e de F1 fora da lente passaram limpos. Nada bloqueia a publicação. Os três ajustes da lente pedidos ao piloto **não estão no arquivo** (ver "Conferência do 1º ciclo"). Eles eram sugestões de clareza, não ressalvas obrigatórias, e por isso não mudam o veredito, mas o coordenador precisa saber que essa parte não foi aplicada.

## O que bloqueia a publicação

Nada.

## O que é só sugestão (não bloqueia)

1. **[Lente, piloto] Dividir o primeiro parágrafo.** A linha 15 continua sendo um bloco único de cerca de 350 palavras, juntando probes, recursos, clipping e prioridade. Sugestão: quebrar em três parágrafos (saúde, recursos, prioridade). Responsável: **piloto**.
2. **[Lente, piloto] Amarrar reserva e teto no mesmo recurso.** A reserva continua sendo "espaço, energia elétrica e mecânicos" da garagem e o teto continua sendo "energia por volta" na pista. A linha 21 repete a separação ("a reserva de espaço e de mecânicos da garagem é o request, o teto de energia com clipping é o limit"). Sugestão: "a energia que a garagem garante a cada carro é a reserva; o limite de energia que o regulamento permite gastar é o teto". Responsável: **piloto**.
3. **[Lente, piloto] Justificar o Recreate.** O exemplo "um assoalho novo que exige outra suspensão" (linha 17) fala de incompatibilidade entre peças do mesmo carro, mas o Recreate existe porque as duas versões não podem rodar ao mesmo tempo. O item da Etapa 03 em "Onde a comparação para" (linha 77) também não fala disso. Sugestão: uma frase no item da Etapa 03, por exemplo "na F1, dois carros com especificações diferentes convivem sem problema; no Recreate, o motivo da troca total é que a versão antiga e a nova não podem atender ao mesmo tempo (por exemplo, por uma mudança de banco de dados)". Responsável: **piloto**.
4. **[Etapa 03, professor] "maxUnavailable: o piso de capacidade".** A linha 678 chama o `maxUnavailable` de "o piso de capacidade" e explica logo em seguida que ele é "quantos Pods podem ficar indisponíveis". O piso, a rigor, é N menos esse número. As linhas 703 e 818 já dizem "define o piso", que é o correto. Sugestão: trocar "é o piso de capacidade" por "define o piso de capacidade" na linha 678. Responsável: **professor**.
5. **[Etapa 01, professor] Tempo do `liveness-falha`.** Com `initialDelaySeconds: 5`, `periodSeconds: 5`, `failureThreshold: 3` e o arquivo apagado aos 20 s, o reinício costuma vir por volta de 30 a 35 s. O texto diz "cerca de 40 segundos". Como a saída está marcada como aproximada, isso não engana ninguém, mas "entre 30 e 40 segundos" seria mais exato. Responsável: **professor**.

## Conferência do 1º ciclo

| Conserto pedido | Situação |
|---|---|
| Frase de disponibilidade ("multiplicam as chances de falha") | Aplicado (linha 119, com o cálculo 0,01 × 0,01). Agora está claro. |
| Definir p99 | Aplicado (linha 117, e p95/p99 também na linha 1161). |
| `/panic` atribuído à liveness, Pod explícito, liveness real | Aplicado. O conceito explica o `restartPolicy` (linha 100), o exemplo usa nomes de Pod explícitos (linhas 203 a 211), há o novo exemplo `liveness-falha` (linhas 299 a 342) e o checklist ganhou dois itens. É o melhor conserto do ciclo. |
| Parênteses do 2 e 2 / 3 e 1 | Aplicado (linha 391). |
| Drain com `web` ainda aplicado | Aplicado (linhas 592, 628 e passo 3). |
| Contexto do `kubectl` depois de `minikube delete -p lab` | Aplicado (passo 5, linha 656, e Notas). Também entrou o `minikube stop` antes do perfil de 2 nós. |
| Dois arquivos de Pod num bloco só | Aplicado (blocos separados, linhas 473 a 514). |
| λ, μ e c antes da fórmula na Etapa 03 | Aplicado (linha 685). |
| "Freio/potência" nas etapas | Aplicado. Não sobra nenhuma ocorrência no arquivo. |
| KEDA zerando direto ao fim do cooldown | Aplicado (linhas 1547, 1560, passo 4 e checklist). Agora a teoria e o laboratório batem. |
| Saída do `redis-cli` | Aplicado (linhas 1691 e 1702). |
| Secrets do cert-manager e `openssl` | Aplicado (passos 5 e 7, linha 1906). |
| Limpeza da Etapa 10 e `helm template` do canário | Aplicado (passos 2 e 8, linha 2233). |
| Comando para conferir tags do podinfo | Aplicado (`docker manifest inspect`, linhas 134, 2174 e passo 3). |
| Glossário: revisão e rollback, disrupção, zona, RBAC | Aplicado (linhas 40, 44, 50 e 65). As quatro entradas estão em palavras simples e corretas. |
| Lente: dividir o primeiro parágrafo | **Não aplicado.** A linha 15 está idêntica à do 1º ciclo (também em `02-piloto.md`). |
| Lente: reserva e teto no mesmo recurso | **Não aplicado.** As linhas 15 e 21 estão sem mudança. |
| Lente: justificativa do Recreate | **Não aplicado.** Continuam iguais a linha 17 ("assoalho") e o item da Etapa 03 na linha 77. |

Além disso, as Notas do professor foram reescritas para o leitor: não falam mais do "bruto" e separam o que aparece no terminal, os comportamentos que surpreendem e o que conferir antes de executar. Ficou útil para quem estuda.

## O que aprendi (teste de recuperação)

1. Liveness reinicia o container quando o processo está vivo mas travado. Se o processo morre, quem reinicia é o `restartPolicy`. Readiness só tira o Pod do Service, e startup segura as outras duas até o app subir.
2. Requests reservam e o scheduler usa esse valor. Limits são o teto: memória estourada dá OOMKill e CPU estourada dá throttling. A combinação dos dois define a classe de QoS, que entra na ordem de despejo.
3. Taint repele e affinity atrai. Topology spread distribui com `maxSkew`. O PDB protege só as disrupções voluntárias (drain, upgrade, consolidação), nunca o despejo por pressão nem a retirada de uma instância Spot.
4. No RollingUpdate, `maxSurge` dá folga de Pods extras e `maxUnavailable` define o piso; o Deployment avisa o rollout travado, mas o `undo` é meu. O Helm empacota com chart e values e registra revisões, com `--atomic` para desfazer sozinho. O Blue/Green troca o selector do Service, e o canário divide o tráfego por réplicas ou por peso.
5. O Karpenter cria nós para Pods `Pending` e consolida os que sobram. O KEDA escala pela fila e zera direto ao fim do cooldown quando a fila esvazia. Na segurança: uma ServiceAccount por app, RBAC só com o que é concedido, credencial de nuvem curta e cert-manager renovando os certificados.

## Pontos confusos (por seção)

Os pontos confusos do 1º ciclo nas etapas foram resolvidos. Os únicos que ainda travam um pouco a leitura estão na lente, e são os itens 1 a 3 da seção "O que é só sugestão" (responsável: **piloto**). Na minha releitura de agora, li o primeiro parágrafo da lente duas vezes de novo para separar saúde, recursos e prioridade.

## Tom

Nenhum, aprovado. O grep de narração de transmissão (boa tarde, farol, apagaram, no verde, bandeir, não pisca, está no ar, com vocês) não encontrou nada, e o arquivo não tem nenhum ponto de exclamação. Também não há nomes de pilotos, equipes, circuitos ou GPs reais. As empresas citadas (Buffer, Shopify, Netflix, Nubank, Mercado Livre, Tinybird, Tesla) são casos de engenharia, apresentados como relatos públicos, não como analogia de F1. O tom é calmo, de guia de estudo, do começo ao fim.

## Travessões

Nenhum, aprovado. O gate automático de travessão e meia-risca encontrou uma única ocorrência: a meia-risca do intervalo das aulas 1 a 9, na linha 3. É um intervalo numérico, que a regra permite. Não há nenhuma ocorrência na prosa.

## Formato (lente geral + etapas técnicas)

- **Lente geral:** presente logo depois da abertura e compreensível sozinha para quem não sabe software. As três perguntas do engenheiro de corrida, a placa na porta, a retirada ordenada de uma garagem, o segundo chassi com o número de corrida, a peça nova só no carro 1, o setup base com a folha por circuito e os passes temporários descrevem a operação sem exigir F1 avançada. Ficaram pendentes a densidade do primeiro parágrafo e o descasamento entre reserva e teto (sugestões ao piloto, não bloqueiam).
- **Glossário:** a tabela `| Termo técnico | Em palavras simples |` agora cobre todos os termos centrais, incluindo zona, disrupção voluntária e involuntária, e revisão e rollback. A linha do RBAC está correta ("não há regra que proíba, e o que não foi dado está negado"). Não usa F1 nem jargão.
- **Onde a comparação para:** um item por etapa, da 01 à 10, todos precisos.
- **F1 vazando nas etapas:** nenhum. Da Etapa 01 em diante não aparece carro, garagem, piloto, pista, mureta, chassi, freio nem potência. As etapas são puramente técnicas.

## Analogias

- **Três perguntas do engenheiro (probes):** ajudou muito, e agora combina com o laboratório, que mostra separadamente o processo morto (restartPolicy) e o processo travado (liveness), exatamente como o "reset sem trocar o carro".
- **Clipping como throttling:** ajudou, e o "Onde a comparação para" avisa que a memória não tem par.
- **Reserva na garagem e teto na pista:** ajudou em parte, pelo mesmo motivo do 1º ciclo (sugestão 2).
- **Placa na porta e autorização (taint, toleration, affinity):** continua sendo a melhor analogia do guia.
- **Retirada ordenada sem descer do mínimo (drain e PDB):** ajudou, e o laboratório agora mostra a recusa sem ruído.
- **Um carro de cada vez / conjunto inteiro (RollingUpdate e Recreate):** o RollingUpdate ajudou; o Recreate continua sem explicar por que as duas versões não podem conviver (sugestão 3).
- **Segundo chassi com o número de corrida (Blue/Green):** ajudou bastante.
- **Peça nova só no carro 1 (canário):** ajudou.
- **Setup base e folha por circuito (chart e values):** ajudou.
- **Logística e equipe de apoio (Karpenter e KEDA):** ajudou. "Sem pedidos, ninguém fica de plantão" agora bate com o laboratório, que zera direto.
- **Passes e credenciais (segurança):** ajudou.

## Exercícios

- **Etapa 01:** consegui seguir todos os passos. Usar nomes de Pod explícitos acabou com a dúvida de qual Pod recebe o `/panic`, e o `liveness-falha` mostra o `Killing` com o processo vivo.
- **Etapa 02:** consegui seguir todos os passos. O drain recusa só por causa do `fixo`, e o passo 5 me devolve ao cluster padrão antes da Etapa 03.
- **Etapa 03:** consegui seguir.
- **Etapa 04:** consegui seguir.
- **Etapa 05:** consegui seguir.
- **Etapa 06:** consegui seguir.
- **Etapa 07:** consegui seguir a parte executável. O resto está claramente marcado como só leitura.
- **Etapa 08:** consegui seguir, e o passo 4 agora explica por que a descida é de 4 direto para 0 em uns 30 s.
- **Etapa 09:** consegui seguir, com uma alternativa para quem não tem `openssl` e a limpeza completa.
- **Etapa 10:** consegui seguir. Conferir as tags antes de instalar, o `helm template` do canário explicado e a limpeza coerente com o passo 7 tiraram as dúvidas que eu tinha.

## Resumo dos consertos por persona

- **Bloqueiam publicação:** nenhum.
- **Piloto (sugestões, não aplicadas neste ciclo apesar do aviso de que tinham sido):** (1) dividir o primeiro parágrafo da lente; (2) amarrar reserva e teto ao mesmo recurso nas linhas 15 e 21; (3) justificar o Recreate na linha 17 ou no item da Etapa 03 de "Onde a comparação para".
- **Professor (sugestões):** (4) "define o piso" em vez de "é o piso" na linha 678; (5) "entre 30 e 40 segundos" no `liveness-falha`.
- **Comentarista:** nada a consertar. Tom, abertura e gates aprovados.
