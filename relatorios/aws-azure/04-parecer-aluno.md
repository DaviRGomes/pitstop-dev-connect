# Parecer do aluno: AWS e Azure lado a lado: a mesma equipe em dois circuitos, da primeira conta à arquitetura segura

*Releitura após o ciclo de revisão 1. Reli o arquivo inteiro (2594 linhas) e conferi cada conserto do parecer anterior.*

## Veredito

**APROVADO. Nota 9/10.**

Todos os consertos do ciclo 1 foram aplicados e conferidos no texto. Os blocos de criação agora colam e rodam, o `rg-lab` é recriado em cada etapa com `az group wait --deleted`, a VM da AWS é praticável do zero e a limpeza da Etapa 09 não apaga mais nada fora da pasta do lab. O que sobrou são três sugestões pequenas que não atrapalham o estudo; o gate de travessões continua zerado.

## O que aprendi (teste de recuperação)

1. Nuvem é capacidade sob demanda em regiões e zonas; o provedor cuida da segurança DA nuvem e eu da segurança NA nuvem. Na AWS a conta junta identidade, recurso e fatura; no Azure a identidade fica no tenant do Entra ID, recurso e fatura ficam na subscription, e todo recurso vive num resource group.
2. A policy IAM traz Effect, Action, Resource e Condition, e um Deny explícito vence tudo. No Azure a role só lista ações, o "onde" vem do escopo da atribuição e as permissões só se somam; para bloquear, uso Azure Policy, lock ou deny assignment. Ser Owner não me dá os blobs (plano de controle x plano de dados).
3. A sub-rede é pública por causa da rota. A AWS tem dois firewalls (SG stateful só com Allow; NACL stateless com Allow e Deny, na sub-rede); o Azure tem um só, o NSG, stateful, com Allow e Deny por prioridade, na NIC ou na sub-rede.
4. VM Azure parada pelo sistema continua cobrando: preciso de `deallocate`. O mesmo YAML Kubernetes roda em kind, EKS e AKS, mas balanceador, disco e preço mudam por baixo; ECS não tem gêmeo, o mais próximo é o Container Apps.
5. DynamoDB x Cosmos DB (cinco níveis de consistência, várias APIs); Logs Insights e KQL são pipelines com `|`; no Azure os logs só chegam com diagnostic settings; o nome único global é o do bucket (S3) e o da storage account (Azure); o Key Vault junta segredos, chaves e certificados que a AWS separa em três serviços; certificações mudam, então confiro no site oficial.

## Conferência dos consertos do ciclo 1

| Conserto pedido | Situação | Onde |
|---|---|---|
| Comentários depois de `\` quebrando comandos | Resolvido. Os comentários saíram das continuações (viraram listas "O que cada opção faz" ou linhas `#` antes do comando). Procurei `\` seguido de espaço ou de `#` e não achei nenhum. | 818 a 873, 1034 a 1062, 1099 a 1107, 1299 a 1309 |
| `rg-lab` apagado e não recriado | Resolvido. Convenção explicada na linha 57; cada parte Azure começa com `az group create` e cada limpeza termina com `az group wait --deleted`. | 57, 641, 856, 1072, 1101, 1322, 1575, 1716, 1880, 2070, 2100 |
| `cd site && ... &` e `rm -rf` no diretório errado | Resolvido com `--directory site` e `rm -rf site index.html`, mais `pkill` como plano B. | 1939, 1973 e 1974 |
| Registro A do Route 53 ausente | Resolvido: `registro.json` com UPSERT, `change-resource-record-sets`, listagem e, na limpeza, DELETE gerado por `sed` antes do `delete-hosted-zone`. | 2088 a 2097, 2164 a 2170 |
| VM AWS impraticável | Resolvido: região fixada, AMI via SSM, key pair com `chmod 400`, VPC padrão, SG só do meu IP; limpeza com `wait instance-terminated`, SG e key pair. | 816 a 852, 931 a 935, 941 a 948 |
| Aviso de JSON com `//` | Resolvido em todos os blocos comentados. | 350, 371, 401, 1095 |
| Propagação de role na Etapa 09 | Resolvido. | 1890 e 1891 |
| `<ID-DO-GRUPO>`, `vm-lab` fora de ordem, `--region`, `sleep`, marcador de data | Resolvidos. A data do SAS agora é calculada, com a variante do macOS. | 381, 403, 508 a 511, 1187, 1203, 1898 a 1901 |
| Azure Policy incompleta | Resolvido: definição, atribuição e limpeza. | 432 a 443 |
| Só uma sub-rede na AWS | Resolvido, com aviso de que sem IGW as duas são privadas. | 632 a 638, 710 e 711 |
| App Mesh sem ressalva na tabela | Resolvido. | 1022 |
| Certificações (Expert exige Associate; nome da SysOps) | Resolvido, sempre com "confira o site oficial". | 2244, 2251 |
| Ronda de custos curta | Resolvido: EC2 não encerradas, EKS, Route 53, S3, EBS, EIP, DynamoDB, segredos, grupos e cofres em soft delete. | 2300 a 2325 |
| Rótulo "Azure (acréscimo)" | Resolvido: a promessa da linha 9 foi reescrita e todos os blocos Azure estão rotulados (a busca por "Azure:" sem rótulo não achou nenhum). | 9 e todo o texto |
| Cockpit interrompendo a frase do KQL | Resolvido: o código vem logo depois dos dois-pontos. | 1686 a 1694 |
| Abertura carregada | Resolvido: a linha 13 virou "Leitura de cockpit", a 15 ficou com uma frase e a tabela completa foi para Fontes. | 13, 15, 2426 |
| Histórias antigas sem ligação | Resolvido: cada uma agora diz em uma frase qual é a lição técnica. | 979, 1812, 2353, 2397 |
| Analogia do número do piloto | Resolvido: retirada, e as notas e o apêndice dizem que o IP fixo fica sem imagem de pista. | 774, 2411, 2494 |

Também conferi se algo novo quebrou: as variáveis (`$SG_ID`, `$ZONA_ID`, `$GRUPO_ID`, `$AMI_ID`) são definidas antes do uso, as limpezas avisam o que fazer se o terminal foi fechado e os comentários que sobraram no fim de linha estão só na última linha de cada comando (1312, 1884, 2072), onde não quebram nada.

## Pontos confusos (por seção)

Nenhum ponto compromete o estudo. Ficam três sugestões:

- **[Etapa 02, linhas 434 a 443] O teste de Azure Policy cria o `rg-lab` e não o apaga.** A limpeza do bloco remove a atribuição e a definição, mas o grupo vazio fica (não custa nada). A Parte 3 da etapa recria e apaga o grupo, então só sobra o grupo vazio se eu fizer apenas o teste de Policy. Conserto: acrescentar `az group delete --name rg-lab --yes` ao fim da limpeza do bloco, ou uma frase dizendo que a limpeza da Parte 3 cobre isso. **Professor.**
- **[Etapa 05, linhas 1178 a 1188] `port-forward` antes de os pods ficarem prontos.** O `sleep 2` resolve o túnel, mas, se a imagem `nginx` ainda estiver sendo baixada, o `port-forward` falha com "pod is not running". Conserto: `kubectl wait --for=condition=available deployment/meu-deployment --timeout=90s` antes do `port-forward`. **Professor.**
- **[Etapa 10, linhas 2089 e 2101] Zona `.example` não testada em nuvem real.** Os comandos estão certos, mas não sei se Route 53 e Azure DNS aceitam criar zona para o TLD reservado `.example`. Conserto: meia frase dizendo "se a CLI recusar o nome, use um subdomínio de um domínio seu, por exemplo `lab.seudominio.com`". **Professor.**

## Travessões

**Nenhum, aprovado.** O grep de travessão e meia-risca no arquivo retornou zero ocorrências. Os intervalos estão escritos por extenso ("de 9 a 11 de outubro", "01 a 10").

## Analogias

- **Provedor = circuito, mesma equipe nos dois:** ajudou muito; coerente do começo ao fim e sem exigir conhecimento de F1.
- **Região = cidade-sede, zona = prédio de garagens:** ajudou, com o limite bem avisado (linha 109).
- **Passe e catraca (IAM), passe com tudo impresso x passe que só imprime o que abre (RBAC):** ajudou bastante; foi o que fez o escopo do RBAC clicar.
- **Passe preso ao equipamento (Role, Managed Identity):** ajudou.
- **Fiscais (SG, NACL, NSG):** ajudou; é a parte em que mais aprendi.
- **VM = garagem com gerador; containers = carros na mesma energia (kernel):** ajudou e se manteve consistente.
- **ERS = créditos de CPU:** ajudou, porque o glossário explica o ERS antes.
- **Apagar as luzes x devolver a garagem (parar x desalocar):** ajudou muito.
- **IP fixo:** agora sem analogia, e isso foi a decisão certa; a explicação técnica basta.
- **Ficha de operação, pintura e rádio (Deployment, label, Service):** ajudou.
- **Livro técnico x código de barras; pit stop = atomicidade; monitor x placar (consistência):** ajudaram, com os limites ditos.
- **Volta de saída = cold start; sensor com canal desligado = diagnostic settings:** ajudaram, curtas e precisas.
- **Almoxarifado, postos avançados e entrada do pit lane:** ajudou; a do pit lane é forçada, mas o texto admite.
- **Superlicença = certificado, lista de inscritos = DNS:** ajudou.
- **Histórias de corrida nos fechamentos:** antes atrapalhavam; agora cada uma diz a lição técnica e passaram a temperar sem soterrar.

## Exercícios

- **Etapa 01:** consegui; a convenção do `rg-lab` agora está clara.
- **Etapa 02:** consegui a leitura, a validação local e a criação (o `GRUPO_ID` resolveu).
- **Etapa 03:** consegui; o CIDR local bate exatamente e as duas sub-redes AWS têm limpeza.
- **Etapa 04:** consegui seguir de ponta a ponta: AMI, chave, SG do meu IP, SSH e limpeza completa.
- **Etapa 05:** consegui o caminho local com kind (o melhor exercício do guia) e os comandos de nuvem agora colam; só sugiro o `kubectl wait`.
- **Etapa 06:** consegui; o `wait table-exists` evita o erro de gravar antes da tabela ficar ativa.
- **Etapa 07:** consegui o handler local; a parte Azure é pelo portal, o que é aceitável.
- **Etapa 08:** consegui o pipeline local; o alarme continua opcional e depende de SNS ou Action Group, como avisado.
- **Etapa 09:** consegui o 304 e a limpeza agora é segura.
- **Etapa 10:** consegui `dig`, `openssl`, os dois cofres e o registro A nos dois lados, com limpeza.
- **Etapa 11:** consegui; a ronda de custos ficou completa.

---

**Resumo de consertos por persona**

- **Professor:** (1) apagar o `rg-lab` ao fim do teste de Azure Policy (linhas 440 a 443) ou remeter à limpeza da Parte 3; (2) `kubectl wait` antes do `port-forward` (linha 1186); (3) alternativa caso a CLI recuse a zona `.example` (linhas 2089 e 2101). Os três são opcionais e não bloqueiam a aprovação.
- **Piloto:** nada pendente.
- **Comentarista:** nada pendente.
