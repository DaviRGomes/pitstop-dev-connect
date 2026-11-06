# Parecer do aluno: Escalabilidade nos servidores: do primeiro servidor a uma arquitetura que aguenta o pico

## Veredito
APROVADO. Nota 9,0. Todos os gates (travessões, tom de transmissão, F1 só na lente, sem corridas, pilotos ou equipes reais) passam limpos, a lente ficou legível em parágrafos curtos e os consertos do ciclo 1 foram aplicados. Restam só ajustes pequenos de clareza nos laboratórios das Etapas 05 e 06 e uma observação sobre analogias do material dentro das etapas.

Escopo: nesta segunda passada li linha a linha a lente e o glossário, a Etapa 03 (do Dockerfile ao fim), o passo 4 da Etapa 04, as Etapas 05 e 06 completas e o checklist. Somado à primeira passada (abertura, Etapas 01, 02, início da 03, Etapa 04 e notas do professor), o relatório foi lido por inteiro.

## O que aprendi (teste de recuperação)
1. Desempenho é a rapidez de uma tarefa; escalabilidade é atender mais gente ao acrescentar recursos. Escalar sobe o throughput sem baixar a latência de uma requisição; otimizar melhora os dois.
2. Escala vertical é um servidor maior (simples, com teto e SPOF); a horizontal são cópias iguais atrás de um load balancer (round-robin, least connections, IP hash), com health check, failover, canary e blue/green.
3. O servidor precisa ser stateless: o estado vai para o Redis; trabalho lento vai para uma fila com workers, e a API responde 202 na hora. Sticky session é remendo.
4. A CDN guarda cópias perto do usuário, controladas por Cache-Control, TTL e ETag (304). O banco escala leitura com cache-aside e réplicas assíncronas, e escrita com sharding, sempre escolhendo entre consistência e disponibilidade (CAP), com RPO e RTO como metas.
5. Uma arquitetura completa (borda, LB, réplicas stateless, fila, banco com réplicas) só é operável com métricas, logs e traces ligados por um X-Request-ID, e com SLO e error budget como meta.

## Pontos confusos (por seção)
Os consertos do ciclo 1 foram conferidos e estão bons: lente em 9 parágrafos curtos, link "único" dito logo na abertura, glossário com Karpenter, FinOps, Weighted Round-robin, Rollback, Service mesh, Jitter, DNS inteligente e Edge computing, circuit breaker sem "circuito", e passo 4 da Etapa 04 com a conta em lista (4 ou 5 linhas, 19/20 = 95%). Pendências, todas pequenas:

- [Etapa 05, passo 7] O `cache-aside.sh` lê da réplica. Depois do `UPDATE` no primary e do `DEL`, o `MISS Camiseta Azul` esperado depende de a réplica já ter recebido a mudança. Quase sempre dá certo, mas é justo o assunto da etapa (atraso de réplica). Conserto: acrescentar `sleep 1` entre o `UPDATE` e a leitura, com uma frase explicando por que. Responsável: professor.
- [Etapa 05, "O problema"] "o 'chefão final' da escalabilidade" é gíria de jogo, destoa do tom de guia calmo. Conserto: "o ponto mais difícil de escalar". Responsável: comentarista.
- [Etapa 05, exercício 2] A volta da réplica pode levar até 1 minuto, e o texto já avisa, mas o critério de parada ("quando o status é `streaming`") está no meio do parágrafo. Conserto: separar em passos numerados (desconectar, escrever, ler, reconectar, esperar `streaming`, reler). Responsável: professor.
- [Etapa 06, exemplo do `verificar.sh`] Os outros scripts dizem "Crie `cache-aside.sh`", mas este só aparece sob o título "O script de verificação". O passo 1 do laboratório manda rodar `bash verificar.sh`, e eu fiquei um instante sem saber se o arquivo já existia. Conserto: abrir com "Crie `verificar.sh` dentro de `etapa-06`". Responsável: professor.
- [Etapa 06, passo 4, "Traces"] O grep `rid=[a-f0-9]*` depende do formato do log do `lb`; se o `grep carrinho` não achar linha (por exemplo, se o `curl` anterior foi servido antes de o log aparecer), o `RID` fica vazio e o `grep ""` imprime tudo. Conserto: acrescentar a checagem `[ -n "$RID" ] || echo "sem RID, repita o curl"`. Responsável: professor.
- [Observação sobre analogias nas etapas] "Pense num supermercado" (Etapa 01) e o controlador de tráfego aéreo (Etapa 02) continuam. O coordenador decidiu mantê-los por virem do material original e não serem F1, e aceito: são curtos, não estão em tom de transmissão e não contradizem a lente. Registro só para a persona comentarista saber que são os dois únicos pontos de analogia do dia a dia dentro das etapas. Nenhum conserto exigido.

## Tom
Nenhum, aprovado. Grep de `boa tarde|farol|apagaram|no verde|bandeir|não pisca|está no ar|com vocês` e de `!!` sem ocorrências no arquivo inteiro. Sem euforia, sem entrada ou saída de etapa em tom de transmissão. Nomes reais de pilotos, equipes e circuitos (Ferrari, McLaren, Mercedes, Red Bull, Verstappen, Hamilton, Senna, Russell, Leclerc, Norris, Interlagos, Mônaco, Monza, Silverstone, Sepang, Bahrein): zero. Empresas citadas nas etapas (Netflix, iFood, Nubank, Google, Amazon, Cloudflare) são tecnologia e vêm do material, não são analogias de F1.

## Travessões
Nenhum, aprovado. Contagem fora das exceções: 0. O grep `—|–` no arquivo inteiro não retorna nenhuma ocorrência (nem em intervalos numéricos).

## Formato (lente geral + etapas técnicas)
- Seção `## A lente de F1 deste guia` (linha 33): presente, logo depois da abertura e dos pré-requisitos. Agora em 9 parágrafos curtos, na ordem: o fim de semana de GP e os dois lugares com o link único; a telemetria e as perguntas; as duas saídas (computador maior ou mais analistas); coordenador, confirmação periódica e ferramenta testada primeiro num carro; contexto no sistema compartilhado e fila de simulação; cópia local com validade; folha de especificação oficial e cópias de leitura; os três registros; mapeamento resumido; regra fixa "cada analista é uma réplica".
- Teste da lente: lendo só a lente, consigo entender como o sistema funciona sem saber software. O mapeamento ficou curto (requisição, frota, load balancer, stateless, fila com workers, CDN, primary e réplicas, observabilidade) e remete ao glossário em vez de despejar siglas. Passou.
- Glossário `| Termo técnico | Em palavras simples |`: presente, cerca de 70 termos, explicados com o dia a dia (cozinha, banco, livraria, portaria, central telefônica) sem F1 e sem jargão. Conferi os termos novos: Karpenter, FinOps, Weighted Round-robin, Rollback, Service mesh, Jitter, DNS inteligente, Edge computing e circuit breaker estão corretos e simples. Os termos centrais (latência, throughput, stateless, CDN, TTL, ETag, réplica assíncrona, CAP, RPO, RTO, SLO) seguem corretos. Cobertura suficiente.
- `### Onde a comparação para` (linha 131): presente, com seis itens, da Etapa 01 à 06, cada um apontando um limite real da comparação.
- F1 nas etapas: não há. Busca por F1, Fórmula, piloto, mureta, garagem, boxes, telemetria, analista, fábrica e equipe de só retorna ocorrências na abertura (linha 5) e entre as linhas 33 e 140 (lente, glossário e "Onde a comparação para"). As demais ocorrências são falsos positivos técnicos ("circuit breaker", um hash que contém "f1", "fórmula" no exercício de KEDA). Nenhum bloco de analogia de F1 em etapa.
- Estrutura repetida por etapa (O problema, O conceito, Os conceitos-chave, Exemplo comentado, Comandos essenciais, Mão na massa, Dica, Anota aí) previsível, boa para estudo. Checklist final e notas do professor com precisões úteis (CAP, Hystrix, X-Cache, jitter).

## Analogias
- Lente de F1 (sala de operações, coordenador, fila de simulação, cópia local, folha oficial com cópias de leitura): ajudou. Conceitual, sem exigir conhecimento de F1, consistente com a regra "cada analista é uma réplica". Agora sem o peso dos parágrafos longos.
- Folha de especificação oficial e cópias de leitura, com o link caído: ajudou, é a imagem que mais fixou primary, réplica assíncrona e a escolha do CAP.
- Cópia local no circuito como CDN: ajudou, e a ligação com a filial de livraria do glossário fecha a ideia.
- Fila de simulação como fila com workers: ajudou, junto com o "recebido" que vira 202.
- Glossário (cozinha, banco, livraria, central telefônica): ajudou. As imagens mudam de linha para linha, mas cada linha é independente.
- Supermercado (Etapa 01) e tráfego aéreo (Etapa 02): ajudaram a entender, curtos; mantidos por decisão do coordenador.

## Exercícios
- Etapas 01 e 02 (carga e SPOF, round-robin, failover, algoritmos, canary, blue/green): consegui seguir, com saída esperada e conta de cabeça.
- Etapa 03: consegui seguir. O contraste memória versus Redis aparece direto nas respostas (um item por resposta versus três). O passo da fila e dos workers tem tempos esperados (12 s e 4 s) e o aviso de esperar a fila esvaziar. Os exercícios de KEDA (`ceil(LLEN/4)`), de backoff e de sticky session têm resposta esperada completa.
- Etapa 04: consegui seguir. O passo 4 agora traz a conta explícita (3 linhas diretas, 1 do MISS, mais 1 se houve revalidação).
- Etapa 05: consegui seguir, com ressalva no passo 7 (atraso de réplica não lembrado) e no exercício 2 (passos misturados). A conta do exercício 1 confere: 667 de 1000 IDs trocam de shard ao passar de 2 para 3.
- Etapa 06: consegui seguir. `verificar.sh` mostra quatro linhas OK esperadas, o passo "antes e depois" dá 1,7 s contra 5 s, e o trace caseiro com `rid` é claro. Ressalvas no "Crie `verificar.sh`" e na checagem do `RID`. A conta do SLO (43,2 minutos) confere.

## Consertos restantes por persona
- Professor: `sleep 1` e explicação no passo 7 da Etapa 05; passos numerados no exercício 2 da Etapa 05; abrir o exemplo da Etapa 06 com "Crie `verificar.sh`"; checagem de `RID` vazio no passo 4 da Etapa 06.
- Piloto: nenhum.
- Comentarista: trocar "chefão final" por linguagem neutra na Etapa 05.
