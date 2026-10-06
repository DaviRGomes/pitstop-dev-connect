# Parecer do aluno: Escalabilidade nos servidores: do primeiro box ao pit lane que aguenta o pico

*Parecer final, após o ciclo de revisão 2.*

## Veredito

**APROVADO. Nota 9,6/10** (ciclo 0: 8,5; ciclo 1: 9,2).

A ressalva técnica que restava (Etapa 03) foi corrigida do jeito certo, e os gabaritos novos das Etapas 04, 05 e 06 estão corretos e coerentes com os comandos dos laboratórios. Não há travessões, e o que sobrou é polimento sem impacto no estudo nem na prática.

## O que aprendi (teste de recuperação)

1. Desempenho é a latência de uma tarefa. Escalar aumenta o throughput sem baixar essa latência, e otimizar baixa os dois. Antes de comprar máquina, descubra qual problema você tem.
2. Escala vertical é um servidor maior (simples, mas com teto e ponto único de falha). Horizontal é pôr mais servidores atrás de um load balancer, que distribui (round-robin, least_conn, ip_hash), tira instância doente de rotação e permite canary e blue/green com rollback.
3. Para escalar horizontalmente, a aplicação precisa ser stateless (estado no Redis ou no banco), e o trabalho lento sai do caminho da resposta: o produtor responde 202, a fila guarda e os workers escalam pelo tamanho da fila.
4. CDN é cache perto do usuário. A origem manda com `Cache-Control` e ETag, a borda responde MISS, HIT, REVALIDATED (304) ou EXPIRED, e a métrica é o cache hit ratio. Cada purge custa misses, e `private, no-store` nunca vai para a borda.
5. Banco escala leitura com cache-aside e réplicas (write splitting, consistência eventual) e escrita só com sharding (re-sharding dói). CAP é escolher C ou A durante a partição, e RPO e RTO guiam o failover. Sem métricas, logs e traces (um request ID costurando as camadas) você não acha o gargalo.

## Conferência dos consertos do ciclo 2

| Conserto pedido | Situação | Onde |
|---|---|---|
| Etapa 03: `proxy_connect_timeout 1s` e `proxy_next_upstream error timeout` | Resolvido, com comentários iguais aos da Etapa 02 | linhas 860 e 861 |
| Etapa 03: reload do `lb` após trazer a réplica de volta | Resolvido, com a mesma justificativa da Etapa 06 | linhas 922 a 927 |
| Etapa 03: promessa de "até 1 segundo" coerente com a config | Resolvido: agora o texto atribui o limite ao `proxy_connect_timeout 1s`, que existe no arquivo | linha 922 |
| Gabaritos da Etapa 04 (ex. 1 a 4) | Resolvido e correto (ver abaixo) | linhas 1282 a 1285 |
| Gabaritos da Etapa 05 (ex. 2, 3 e 4) | Resolvido e correto | linhas 1597, 1610, 1614 |
| Gabaritos da Etapa 06 (ex. 1, 2, 3 e 5) | Resolvido e correto | linhas 1924 a 1928 |
| Frase das Notas do piloto | Resolvido: "A camada de F1 não altera comandos [...]; correções técnicas vieram da revisão do professor." | linha 2000 |

**Conferência dos gabaritos novos:**
- **Etapa 04, ex. 1:** "antes, 10 MISS; depois, 1 MISS e 9 HIT". Correto: sem `Cache-Control` a borda não guarda nada (a própria linha 1155 diz isso), e com `max-age=60` guarda.
- **Etapa 04, ex. 2:** "não volta a HIT depois que a cópia de 60 s expirar ou for apagada". Correto, e a ressalva sobre a cópia do exercício anterior evita um falso negativo.
- **Etapa 04, ex. 3 e 4:** TTLs coerentes (bundle versionado longo, saldo com `no-store`). O fluxo do DNS repete corretamente o "Como funciona" da etapa.
- **Etapa 05, ex. 2:** CP recusa a leitura e AP responde e converge. Coerente com a nota do professor sobre CAP.
- **Etapa 05, ex. 3 e 4:** RTO manual, RPO como janela da replicação assíncrona, e "assíncrona basta para RPO de 5 min se o atraso for monitorado". Correto.
- **Etapa 06, ex. 1, 2, 3 e 5:** mapeiam cada ponto de falha para a etapa certa. O ex. 5 avisa, com honestidade, que a app de teste não tem cliente Postgres. Correto.

## Pontos confusos (por seção)

Nenhum que trave a leitura ou a prática. Ficam só duas sugestões opcionais, que não impedem a aprovação:

- **[Etapa 03, Exercícios 3 e 4; Etapa 05, Exercício 1 (pergunta do range)] (opcional)** São os únicos exercícios sem resposta esperada. Na pergunta do range, a dica "hotspots" já quase responde. Conserto, se quiserem fechar o padrão: ex. 3, "funciona enquanto a réplica vive; ao derrubá-la, o carrinho some, porque o estado morava nela"; ex. 4, "`replicas: 3` equivale a `deploy.replicas`, e `image` equivale a `image` do serviço"; range, "faixas populares concentram carga num shard (hotspot)". **Responsável: professor.**
- **[Abertura, linhas 7 a 13] (opcional)** Sepang ainda aparece três vezes, mas cada menção tem papel distinto (aviso, cena, dados). Aceitável como está. **Responsável: comentarista, se quiser enxugar.**

## Travessões

Rodei o grep de travessão e meia-risca (`grep -nP` com os dois caracteres) no relatório inteiro: **nenhuma ocorrência. Nenhum, aprovado.**

## Analogias

- **Servidor = box, requisição = carro, CAPACIDADE = posições de serviço:** ajudou. Consistente do começo ao fim.
- **Crew treinada x mais boxes (otimização x escala), ligada ao supermercado:** ajudou muito.
- **Unidade de potência do Russell como SPOF:** ajudou.
- **Autoscaling preditivo = radar meteorológico:** ajudou.
- **Load balancer = controle de entrada do pit lane (tradução da torre de controle):** ajudou.
- **L4 = laço de cronometragem, L7 = engenheiro no rádio:** ajudou.
- **IP hash = pit lane real:** ajudou bastante.
- **Canary = peça nova em um carro só:** ajudou.
- **Stateful = set-up na cabeça do mecânico; Redis = painel da garagem (tradução da comanda de papel):** ajudou.
- **Fila = pilha de pneus; worker = engenheiro na fábrica:** ajudou.
- **CDN = estoque no circuito; ETag = revisão da peça; purge = recall:** ajudou muito, a melhor do guia.
- **CAP = rádio caiu:** ajudou.
- **Failover de banco = o reserva no fone assume o rádio:** ajudou.
- **Error budget = cota de componentes da unidade de potência (regra explicada antes):** ajudou.
- **Lei de Conway = Brackley x Brixworth:** neutra, não atrapalha.

## Exercícios

- **Etapa 01:** consegui seguir e conferir com os gabaritos.
- **Etapa 02:** consegui. Com `zone`, o "10/10/10" é reprodutível, e o macOS tem alternativa clara.
- **Etapa 03:** consegui. O failover agora tem espera limitada a cerca de 1 s e o reload garante que o passo 4 mostre `202 0.00xs` como esperado.
- **Etapa 04:** consegui, e os gabaritos novos batem com o que o Nginx faz.
- **Etapa 05:** consegui. O primary e a réplica sobem sem arquivo faltando, os avisos de TTL e de reconexão evitam falsos negativos, e os gabaritos conferem.
- **Etapa 06:** consegui. O `verificar.sh` dá quatro OK, o reload fecha a lacuna da resiliência e os gabaritos amarram o guia inteiro.

## Resumo dos consertos restantes por persona

**Professor:** (opcional) respostas curtas para a Etapa 03, ex. 3 e 4, e para a pergunta do range na Etapa 05, ex. 1.

**Piloto:** nada pendente.

**Comentarista:** nada pendente. (Opcional: enxugar a terceira menção a Sepang.)
