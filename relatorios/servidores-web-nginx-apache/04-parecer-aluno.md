# Parecer do aluno: Servidores Web e Balanceamento de Carga: da borda do sistema à alta disponibilidade

Segundo ciclo de revisão (último). Reli o arquivo inteiro e conferi cada conserto pedido no primeiro parecer.

## Veredito

APROVADO. Nota 9,3.

Os três bloqueios do primeiro ciclo foram resolvidos: a Etapa 09 encontra o Service `web`, a Etapa 10 cria o ConfigMap na pasta certa e o `outro.yaml` cai no namespace `demo`. Todas as sugestões também foram aplicadas, e tom, travessões e formato passam nos gates. Sobraram só dois detalhes pequenos, que não atrapalham o estudo e não bloqueiam a publicação.

## O que aprendi (teste de recuperação)

1. O servidor web (Nginx ou Apache) fica na borda: entrega o estático, termina o TLS, faz cache e proxy, e deixa a aplicação cuidar só da regra de negócio. O reverse proxy representa o servidor e o forward proxy representa o cliente.
2. O HTTP/1.1 atende uma requisição por vez em cada conexão. O HTTP/2 multiplexa streams sobre o TCP e o HTTP/3 troca o TCP pelo QUIC, para que um pacote perdido só atrase o próprio stream.
3. O Apache escolhe um MPM (Prefork com processos, Worker com threads, Event com threads que não ficam presas a conexões ociosas). O Nginx usa poucos workers com event loop e I/O não bloqueante, e o mesmo Nginx que faz o proxy também balanceia pelo bloco `upstream`.
4. O balanceamento pode ser em L4 ou L7, com Round Robin, weight, least_conn ou ip_hash. O check passivo e o `backup` fazem o failover. O 502 aponta resposta inválida ou conexão recusada, e o 504 aponta timeout.
5. No Kubernetes, o Ingress declara e o Controller executa, e o cert-manager emite e renova o certificado. O Istio põe um Envoy ao lado de cada Pod para canário, mirroring, mTLS e autorização por identidade. A disponibilidade se mede com SLO, se protege com Keepalived e VIP, e a borda se defende com WAF, rate limiting e HSTS.

## Conferência dos consertos do 1º ciclo

| Item | Agente | Situação |
|---|---|---|
| Etapa 08 apagava o que a Etapa 09 usa | professor | Resolvido. O passo 7 apaga só o `ingress.yaml` e mantém `apps.yaml` e o ConfigMap. A Etapa 09 confere (`kubectl get svc web`), ensina a recriar se preciso e faz a limpeza completa no fim. |
| `cd istio-*` deixava na pasta errada | professor | Resolvido. `cd istio-* && export PATH=$PWD/bin:$PATH && cd -`, aviso para conferir com `pwd` e caminho dos `samples/addons` explicado. |
| `outro.yaml` sem namespace | professor | Resolvido. O manifesto declara `namespace: demo`, e o passo 3 ainda testa o `outro` antes da política (200) e depois dela (403), o que ficou melhor que o original. |
| Saída ao parar o `api-1` (Etapa 07) | professor | Resolvido. Saída com `rt=3.005`, explicação de "No route to host" e aviso de atraso no passo 3 e na nota 3. |
| Edição de arquivo montado | professor | Resolvido nas Etapas 02, 03, 06 e 14 e na nova nota 7. |
| Conclusão do passo 4 da Etapa 03 | professor | Resolvido. Agora remove os dois cabeçalhos e explica que o `peer` sempre foi o Nginx. |
| Recriar `apache-prefork` (Etapa 05) | professor | Resolvido, com o comando exato e o plano B de reconstruir a imagem. |
| Port-forward em primeiro plano (Etapa 08) | professor | Resolvido no exemplo e no passo 3. |
| Grep que escondia o corpo (Etapa 09) | professor | Resolvido. Dois comandos separados, aviso de que `subject` e `issuer` podem vir vazios e linha `issuer=` na saída do `openssl`. |
| Dois clusters ligados | professor | Resolvido. `minikube delete -p lab` no fim da Etapa 09. |
| Dividir o `security.yaml` | professor | Resolvido. Agora são `mtls-strict.yaml` e `authz-api.yaml`, também no checklist. |
| Canário opcional mudando a Etapa 12 | professor | Resolvido. A Etapa 11 deixa o cluster sem VirtualService, e a Etapa 12 avisa sobre a v2 e manda somar os contadores das duas versões. |
| Glossário: "Balanceador de carga" | professor | Resolvido. A definição agora cobre a regra de distribuição, não só "menos fila". |
| Glossário: ServiceAccount, pathType, SNI | professor | Resolvido. As três linhas foram incluídas em palavras simples, e o SNI ganhou também um item na Etapa 09. |
| Coordenador longe da recepção | piloto | Resolvido. A recepção decide qual analista recebe o pedido "no mesmo balcão", e a tradução diz que é "o mesmo Nginx que faz o proxy". |
| Rádio de voz e telemetria só na tradução | piloto | Resolvido. Um parágrafo novo na narrativa apresenta os dois formatos antes da tradução. |

## Pontos confusos (por seção)

### Bloqueiam publicação

Nenhum.

### Sugestões (não bloqueiam)

- **[Etapa 07, Comandos essenciais e passo 6] O grep não pega a mensagem que o próprio texto anuncia.** O texto avisa que o backend parado gera "No route to host", mas o grep é `refused|timed out|unreachable`, que não casa com essa frase. No passo 6 isso não faz diferença, porque `/quebrado` e `/lento` geram "refused" e "timed out". Quem usar o grep para investigar o passo 3, porém, não vai achar nada. Conserto: `grep -E 'refused|timed out|unreachable|No route'`. **Persona: professor.**
- **[Etapa 09, passo 7] Caminho do `apps.yaml`.** A limpeza roda `kubectl delete -f apps.yaml`, mas esse arquivo está em `etapa08/`, e o aluno provavelmente está em `etapa09/`. O passo 1 já lembra que os arquivos vêm de `etapa08/`, então o risco é pequeno. Conserto: escrever `kubectl delete -f ../etapa08/apps.yaml`. **Persona: professor.**

## Tom

Nenhum problema, aprovado. O grep `boa tarde|farol|apagaram|no verde|bandeir|não pisca|está no ar|com vocês` não encontrou nada. Também não há exclamações, superlativos nem nomes reais de pilotos, equipes, circuitos ou GPs. O parágrafo novo sobre rádio de voz e telemetria mantém o tom calmo e explica "engenheiro de corrida" entre parênteses. Os nomes `pitstop_api`, `pitstop.local` e `PITSTOP` são o nome do produto nos exemplos, não analogia.

## Travessões

Nenhum, aprovado. O grep encontrou uma única ocorrência, na linha 3: o intervalo "aulas 1 a 5", escrito com meia-risca. É intervalo numérico, portanto exceção permitida.

Correção do meu primeiro parecer: lá eu reproduzi esse trecho com a meia-risca na seção de travessões, o que violava a regra do próprio parecer. Nesta versão o trecho está escrito por extenso, e o parecer não tem travessão nem meia-risca.

## Formato (lente geral + etapas técnicas)

- **Lente presente e no lugar certo:** `## A lente de F1 deste guia` vem logo depois da abertura.
- **Compreensível sozinha:** sim, e melhor que no primeiro ciclo. Agora o caminho inteiro acontece num lugar só: a catraca, a recepção que entrega o pronto, escolhe o analista e encaminha, a folha de encaminhamento e a resposta voltando pela recepção. Isso bate com o laboratório, em que proxy e balanceador são o mesmo Nginx. O parágrafo do rádio de voz e da telemetria prepara a comparação com o HTTP antes da tradução. A lente continua longa, mas não precisei reler para montar o caminho.
- **Glossário:** cobre os termos centrais, incluindo agora ServiceAccount, pathType e SNI. Usa o dia a dia, sem F1 e sem jargão. Não encontrei definição que distorça o conceito.
- **"Onde a comparação para":** um item por etapa, de 01 a 14, todos com limite técnico real.
- **F1 nas etapas:** nenhuma. O grep por termos de F1 só acha ocorrências dentro da lente. "Telemetria" aparece nas Etapas 10 a 12 no sentido técnico do Istio, não como analogia.

## Analogias

- **Recepção como servidor web, reverse proxy e balanceador:** ajudou, e agora sem a confusão de localização. A frase "a própria recepção, no mesmo balcão onde o pedido chegou, e não outra pessoa em outro lugar" desfaz exatamente a dúvida que eu tinha.
- **Rádio de voz e telemetria como HTTP/1.1 e HTTP/2:** passou de "ajudou pouco" para "ajudou". O engenheiro que espera a resposta antes da próxima pergunta é o head-of-line blocking, e os fluxos identificados por sensor são os streams.
- **Bilhete como X-Forwarded-For e setor de compras como forward proxy:** continuam ajudando.
- **Salas e atendentes como MPMs e atendente que anota como event loop:** continuam sendo as melhores analogias do guia.
- **Radio check e analista reserva como health check e backup:** ajudou. O "Onde a comparação para" da Etapa 07 corrige o fato de o Nginx Open Source só ter o check passivo.
- **Folha de encaminhamento e quem a lê como Ingress e Controller; credencial como TLS e cert-manager:** ajudou.
- **Intercom com rádio de cinto como mesh e sidecar; rádio registrado e permissão de canal como mTLS e AuthorizationPolicy:** ajudou.
- **Peça no carro 1 como canário; rádio reserva no mesmo canal como VIP; catraca, revista e limite de entrevistas como firewall, WAF e rate limiting:** ajudou.
- **Observação menor:** o backend aparece como "engenheiro" na parte da recepção e como "analista" na parte do balanceamento. Dá para entender que os dois são backends, mas um aluno mais literal pode achar que são peças diferentes. Não é conserto obrigatório (persona piloto, se quiser alinhar).

## Exercícios

- **Etapa 01:** consegui. Comandos completos, saída clara.
- **Etapa 02:** consegui. O aviso do arquivo montado e o `docker restart h2-lab` fecham a armadilha do reload.
- **Etapa 03:** consegui. O passo 4, agora em duas fases, ensina o papel de cada cabeçalho.
- **Etapa 04:** consegui. A limpeza avisa que as imagens ficam para a Etapa 05.
- **Etapa 05:** consegui. O comando de recriar o `apache-prefork` está no passo.
- **Etapa 06:** consegui.
- **Etapa 07:** consegui. As saídas e os avisos de atraso batem com o que espero ver ao parar o `api-1`. Só o grep tem a lacuna do "No route".
- **Etapa 08:** consegui. Terminal do port-forward explícito e limpeza parcial correta.
- **Etapa 09:** consegui, na ordem do texto. Corpo e certificado são verificados em comandos separados, e a limpeza final derruba o perfil `lab`.
- **Etapa 10:** consegui. O `cd -` e a conferência com `pwd` deixam claro onde rodar cada comando.
- **Etapa 11:** consegui. O passo 7 deixa o cluster no estado que a Etapa 12 espera.
- **Etapa 12:** consegui. Arquivos separados permitem aplicar e testar uma política de cada vez, e o teste do `outro` antes e depois da autorização prova que a decisão é por identidade.
- **Etapa 13:** consegui.
- **Etapa 14:** consegui. Reload e restart da borda estão explicados no passo 1.

## Resumo de consertos por persona

**Bloqueiam publicação:** nenhum.

**Professor (sugestões):**
1. Etapa 07: incluir `No route` no grep de diagnóstico.
2. Etapa 09, passo 7: usar `../etapa08/apps.yaml` na limpeza.

**Piloto (sugestão opcional):** alinhar "engenheiro" e "analista" como o mesmo papel de backend, ou dizer na lente que os analistas são engenheiros de um mesmo grupo.

**Comentarista:** nada a consertar.
