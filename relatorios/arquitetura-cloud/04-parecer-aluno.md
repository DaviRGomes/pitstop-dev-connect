# Parecer do aluno: Arquitetura Cloud: da garagem alugada no circuito ao carro seguro, redundante e dentro do teto de gastos, em AWS e Azure

*Releitura após o ciclo de revisão 1 (arquivo inteiro, 1796 linhas).*

## Veredito

**APROVADO. Nota 9,5/10.**

Todos os consertos do parecer anterior foram aplicados e conferidos linha a linha: a variável `$LAB` com `mkdir -p` resolve os caminhos entre etapas, todo script tem comando de execução e gabarito, e o aviso de custo agora bate com o conteúdo. Recalculei os gabaritos novos e eles fecham. Nada novo quebrou. Sobram só três ajustes cosméticos de analogia e de vocabulário, que não atrapalham o estudo.

## O que aprendi (teste de recuperação)

1. Nuvem troca capital parado (CapEx) por consumo medido (OpEx). Só compensa quando a carga varia: com pico baixo (4 VMs), o próprio exercício mostra a nuvem ficando mais cara (790,83 contra 700,00).
2. De IaaS a SaaS, eu opero menos e controlo menos, mas a linha "Dados" é sempre minha. FaaS é stateless, então o estado vai para banco ou cache.
3. Zona protege do data center e região protege da cidade. Em série, as disponibilidades se multiplicam (piora); em paralelo, a conta é 1 menos o produto das falhas (melhora), desde que as falhas sejam independentes. SLI mede, SLO é a meta interna, SLA é a promessa com multa.
4. O Circuit Breaker abre depois de N falhas, falha rápido enquanto dura a espera e depois deixa passar uma tentativa. Se a espera for maior que o tempo decorrido, ele continua aberto mesmo com o serviço de pé (a variante 2/5 mostrou isso).
5. Na AWS a sub-rede é zonal e a NACL é stateless. Na Azure a sub-rede é regional e o NSG é stateful. O CIDR se desenha antes, sem sobreposição. O envelope DEK/KEK permite girar a chave sem recifrar os dados, e a primeira alavanca de custo é desligar o que está parado, com tags validadas por automação.

## Conferência dos consertos do ciclo 1

| Conserto pedido | Situação | Onde |
|---|---|---|
| [CRIA RECURSO] inexistente | Corrigido: "Neste guia não há nenhum comando que crie recursos" | linha 60 |
| `mkdir` e pasta base | Corrigido: `LAB="$HOME/lab-cloud"`, `mkdir -p` e aviso para redefinir a variável em terminal novo | linhas 74 a 82 |
| Caminhos entre etapas | Corrigido: todos os comandos usam `"$LAB"/etapa-XX`, e os `cd` restantes são absolutos | linhas 391, 639, 1120, 1127, 1137, 1328, 1386 |
| Comando para rodar os `.sh` | Corrigido: capex_opex, noves, matriz e economia | linhas 216, 575, 822, 1472 |
| Variante do pico (Etapa 01) | Corrigido: diz qual `10` trocar e dá o gabarito 700,00 x 790,83 (conferi) | linhas 234 a 243 |
| `list-sizes` obsoleto | Corrigido: troca por `az vm list-skus` com JMESPath sobre `capabilities` e nota sobre o aviso | linhas 429 a 446 |
| Function URLs | Acrescentado e marcado como acréscimo | linha 369 |
| Legenda da Tabela 1 | Corrigida: "Aula 02 do material, na versão corrigida conforme a Nota 1" | linha 346 |
| Separador decimal | Corrigido: convenção explicada (vírgula no texto, ponto nas saídas) e aplicada | linhas 50, 586, 723 a 725 |
| Gabarito da variante 2/5 do disjuntor | Corrigido: saída real e explicação do `sleep(2.1)` menor que `espera=5` (conferi o traço) | linhas 669 a 683 |
| Frase da conta mensal | Corrigida: 43.200 minutos no mês, 0,1% disso é 43,2 | linha 723 |
| Algoritmo NLB x Azure LB | Corrigido: os dois usam hash por fluxo; afinidade explicada | linha 532 |
| Nome de arquivo da matriz e da economia | Corrigido: `matriz.sh` e `economia.sh` | linhas 803, 1442 |
| Acesso de saída padrão da Azure | Acrescentado e marcado como acréscimo | linha 926 |
| Terminação SSL | Definida | linha 958 |
| IAM Identity Center | Acrescentado e marcado como acréscimo | linha 1221 |
| LibreSSL no macOS | Corrigido no pré-requisito e no exemplo | linhas 57, 1325 |
| Gabarito do desafio de tags | Corrigido: 3/6 = 50% com o auditor original; auditor com regex e 2/6 = 33% (conferi os dois) | linhas 1400 a 1430 |
| Security group padrão | Corrigido: em conta nova a saída costuma vir vazia | linha 1523 |
| Trusted Advisor | Corrigido: `--region us-east-1` | linha 1532 |
| GreenOps, DORA/NIS2, chargeback | Definidos | linhas 1317, 1321, 1438 |
| Notas do professor citando etapas | Corrigido: convenção "Aula 0X" x "Etapa 0X" e apontador para a etapa do guia | linhas 1763 a 1771 |
| Legendas de acréscimo nas tabelas | Acrescentadas em todas as tabelas AWS x Azure das Etapas 03, 05 e 06 | linhas 526, 897, 920, 946, 972, 994, 1217, 1235, 1254, 1291, 1311 |
| Piloto: "circuito dedicado" | Corrigido para "linha dedicada" | linhas 166, 1672 |
| Piloto: garagem com sentido único | Corrigido: AZ virou "pavilhão", sub-rede pública virou "frente voltada para o pit lane" | linhas 97, 501, 505, 916, 933, 1114, apêndice |
| Piloto: VM carro x chassi | Corrigido: "carro-padrão" em todo o guia | linhas 94, 96, 330, 335, 450 |
| Piloto: glossário | Corrigido: "cota de componentes" e "carga aerodinâmica" | linhas 33, 34 |
| Piloto: especulação da Ferrari | Removida da matriz | linha 839 |
| Piloto: balanceador | Trocado por "controle de entrada do pit lane", com health check e limite explícito | linhas 524, 962, 1633 |
| Piloto: lock-in | Trocado por "equipamento que só encaixa nas instalações de um circuito" | linha 797 |
| Comentarista: Sepang repetido | Corrigido: a transferência é explicada só na linha 7; a linha 488 remete à abertura | linhas 7, 11, 13, 488 |
| Comentarista: classificação completa | Movida para "Fontes dos dados de F1" | linha 1647 |

## Pontos confusos (por seção)

Nenhum ponto confuso trava o estudo. Sobram três ajustes opcionais:

- **[Etapa 03, linha 524]** "a mesma imagem do guia de Escalabilidade" cita um guia que eu, lendo só este, não conheço. Fiquei achando que tinha pulado alguma parte. Conserto: cortar o parêntese ou trocar por "(imagem usada também em outros guias desta fase)". **Piloto.**
- **[Etapa 06, linhas 1252 e 1743]** O Security Group atua por instância (a VM, que no guia é o carro), mas a analogia o põe "na porta da garagem", e garagem agora é o espaço da equipe inteira. A ideia de stateful continua clara; só a posição ficou trocada. Conserto: "o segurança ao lado do carro, que viu você chegar e deixa você sair sem conferir de novo". **Piloto.**
- **[Etapas 01 e 06, linhas 176 e 1550]** No texto técnico ainda aparece "circuito privado" e "circuito dedicado" para Direct Connect e ExpressRoute. Isso é termo correto de telecom, mas o piloto já trocou para "linha dedicada" na analogia, e manter as duas formas lado a lado reabre a confusão com circuito = provedor. Conserto: "conexão privada dedicada" nas duas linhas. **Professor.**

## Travessões

Rodei o gate (grep procurando travessão e meia-risca) no relatório: **zero ocorrências**. Não há nenhum, nem nas exceções permitidas. Nenhum, aprovado.

## Analogias

- **Provedor = circuito:** ajudou. Com "linha dedicada" no lugar de "circuito dedicado", a palavra ficou com um sentido só na camada de pista.
- **Garagem = espaço da equipe (IaaS/PaaS), pavilhão = AZ, frente para o pit lane = sub-rede pública:** ajudou. A troca para "pavilhão" acabou com a releitura que eu precisava fazer, e a frase "num autódromo real não há pavilhões independentes" (linha 501) deixa claro onde a analogia para.
- **VM = carro, carro-padrão na IaaS:** ajudou, agora está consistente do quadro (linha 96) ao apêndice (linha 1687).
- **CapEx/OpEx = túnel de vento próprio ou alugado:** ajudou.
- **FaaS = pit stop, variável global = mecânico contando de cabeça:** ajudou muito; segue sendo a melhor imagem do guia.
- **Série, paralelo e falha correlacionada (dois carros, mesma aposta de pneus):** ajudou muito.
- **SLI/SLO/SLA = telemetria, meta interna, cota de componentes:** ajudou. Com a cota no glossário, já não exige saber F1 de antemão.
- **Circuit Breaker = desligar o ERS e tentar um reset:** ajudou.
- **Balanceador = controle de entrada do pit lane:** ajudou mais que a versão anterior. O health check e a diferença camada 4 x camada 7 ("troca de pneus ou de asa") ficaram concretos, e o limite está explícito. Só sobra a referência a outro guia (linha 524).
- **Matriz ponderada = set-up por circuito, com carga aerodinâmica definida:** ajudou; sem a especulação da Ferrari, ficou mais limpa.
- **Lock-in = equipamento que só encaixa num circuito; portabilidade = encaixes padrão:** ajudou; agora é uma imagem concreta.
- **Objeto, bloco, arquivo; NAT = assessor de imprensa; CIDR = número de carro; CDN = frete marítimo; DEK/KEK = cadeado e cofre:** ajudaram.
- **Security Group = segurança, NACL = catraca:** ajudou para stateful x stateless; só a posição "porta da garagem" ficou deslocada (ponto acima).

## Exercícios

- **Etapa 01, `capex_opex.sh` e variante de 4 VMs:** consegui. Os dois gabaritos conferem (1300,00 e 973,33; 700,00 e 790,83).
- **Etapa 01, regiões com `aws` e `az`:** sintaxe plausível, somente leitura.
- **Etapa 02, `funcao.py`:** consegui. O `cd "$LAB"/etapa-02` é absoluto e não quebra mais as etapas seguintes.
- **Etapa 02, `describe-instance-types` e `az vm list-skus` com `capabilities`:** a consulta JMESPath é plausível, e a saída Name/Value com vCPUs 1 e MemoryGB 1 está correta para `Standard_B1s`.
- **Etapa 03, `noves.sh`:** consegui; as contas conferem.
- **Etapa 03, `disjuntor.py` e variante 2/5:** consegui. Tracei a variante e o gabarito bate: as chamadas 2 a 5 voltam ABERTO e a última também, porque 2,1 s é menos que 5 s. A dica de trocar o sleep por 5,1 para ver o `ok: 200` é ótima.
- **Etapa 03, zonas com `aws` e `az`:** plausível.
- **Etapa 04, `matriz.sh`:** consegui; os dois conjuntos de pesos conferem (3,90 x 3,80; 3,60 x 4,10).
- **Etapa 05, `cidr.py`:** consegui; a saída confere.
- **Etapa 05, Bicep e CloudFormation:** consegui. `file://$LAB/...` vira `file:///home/...`, que é válido; `az bicep build` gera o `vnet.json` na pasta certa.
- **Etapa 06, envelope com `openssl`:** consegui (OpenSSL 3), e a limpeza com caminho absoluto funciona.
- **Etapa 06, auditor de tags e desafio:** consegui; conferi os três gabaritos (2/5 = 40%, 3/6 = 50%, 2/6 = 33%). O aviso "rode o `echo >>` uma vez só" evita linha duplicada.
- **Etapa 06, `economia.sh`:** consegui; todos os valores conferem.
- **Etapa 06, comandos de leitura (volumes, IAM, SGs, NSGs, Advisor, budgets, Trusted Advisor, TLS):** sintaxe plausível; os avisos de conta nova e de plano de suporte estão corretos.

## Tabelas AWS x Azure

Os pares estão corretos e cada tabela agora tem a sua legenda de acréscimo. As diferenças reais estão bem explicadas:

- NACL stateless x NSG stateful na sub-rede (linha 1259).
- Security Group só permite x NSG permite e nega, com prioridade (linha 1258).
- Sub-rede zonal na AWS x regional na Azure (linha 925).
- Outposts x Azure Stack x Arc, com o HCI renomeado para Azure Local (linha 177).
- Acesso de saída padrão da Azure (linha 926).
- IAM x IAM Identity Center x Entra ID + RBAC (linha 1221).
- NLB e Azure Load Balancer com hash por fluxo (linha 532).

## Resumo dos consertos restantes por persona

- **Professor:** linhas 176 e 1550 (trocar "circuito privado/dedicado" por "conexão privada dedicada"). Opcional.
- **Piloto:** linha 524 (tirar a referência ao guia de Escalabilidade); linhas 1252 e 1743 (Security Group "ao lado do carro", não "na porta da garagem"). Opcionais.
- **Comentarista:** nenhum.
