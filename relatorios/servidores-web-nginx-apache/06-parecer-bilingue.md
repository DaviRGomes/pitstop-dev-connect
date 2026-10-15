# Parecer bilíngue: Servidores Web e Balanceamento de Carga

**Arquivos comparados**

- PT-BR (aprovado): `relatorios/servidores-web-nginx-apache/final.md` (2474 linhas)
- EN (tradução): `relatorios/servidores-web-nginx-apache/05-tradutor-en.md` (2474 linhas)

Os dois arquivos foram lidos integralmente. A tradução segue o original linha a linha: cada linha EN corresponde à mesma linha PT, então as localizações abaixo usam o mesmo número nos dois arquivos.

## Veredito

**APROVADO COM RESSALVAS**

Nenhuma divergência de fato, número, código, comando, exercício ou estrutura. As ressalvas são três ajustes pequenos de vocabulário, nenhum bloqueia a publicação.

## Resultado por verificação

1. **Estrutura.** Mesma ordem e quantidade de seções nas 14 etapas, no checklist de autoavaliação (14 blocos com os mesmos itens) e nas Notas do professor (28 itens, mesmos grupos). As subseções de cada etapa (problema, conceito, conceitos-chave, exemplo comentado, comandos essenciais, mão na massa, dica, anota aí) aparecem nas mesmas linhas. Contagens de itens e rótulos de abas já conferidos pelo conversor.
2. **Blocos de código.** Configs Nginx, Apache, Squid, Keepalived, Dockerfiles, YAML (Compose, Kubernetes, cert-manager, Istio), Python e shell idênticos ao original; só comentários e anotações de prosa foram traduzidos. Literais que o programa usa ou imprime continuam em português, como pedido: `Protocolo negociado` (L267 a 276), `ola\n` (L300), `recebeu` e os identificadores `responder`, `com_corpo`, `linhas`, `corpo`, `dados` do `backend.py` (L381 a 421), `rede_lab` (L446), `home servida pelo proprio Nginx` (L835, L867), `/quebrado`, `/lento` e `em` no `-w` do curl (L1006 a 1037, L1065), `x-usuario: teste` (L1739 a 1740, L1811), `outro` (L1913 a 1932), `atendido por` e `FALHOU` (L2053, L2135 a 2144), pastas `etapaNN/`. A anotação `(pode vir vazio)` em L1443 a 1444 foi traduzida para `(may be empty)`; está correto, porque é nota do autor e não texto impresso pelo curl.
3. **Números e resultados esperados.** Conferidos: 1995, 1997, 2015, 40 miniaturas, cerca de seis conexões, 5.000 conexões (5,000), 16 x 25 = 400, 1024 e 4096 conexões, 15/15, 20/10, 5 contra 15, `max_fails=3 fail_timeout=10s`, 502 em 0.004s e 504 em 2.003s, 90 dias, 1h e 55m, cerca de 6 minutos, 90/10 e 91/9, `attempts: 2` com `perTryTimeout: 500ms` (1,5s convertido para 1.5s no comentário), 99,9% e 43 minutos, 432.0, 43.2 e 4.3 min, `rate=5r/m`, `burst=3`, 4 de 200 e 6 de 429, slot a cada 12 segundos, `max-age=300` e 31536000, 4 CPUs e 8 GB. Separador decimal adaptado ao inglês só na prosa e nos comentários.
4. **Termos técnicos.** Consistentes: reverse proxy, forward proxy, upstream, keep-alive, head-of-line blocking, multiplexing, worker, event loop, non-blocking I/O, health check passivo e ativo, backup, Ingress e Ingress Controller, Issuer, ClusterIssuer, Certificate, Secret, sidecar, data plane, control plane, subset, canary, mirroring, retry, circuit breaking, error budget, SPOF, VRRP, anomaly score, detection mode. "Mão na massa" vira sempre "Hands-on", inclusive nas referências em L7 e L2345.
5. **Fatos e datas.** Aposentadoria do ingress-nginx com anúncio em novembro de 2025 e fim da manutenção em março de 2026 igual em L1094 e L2455. Nenhuma expressão temporal solta ("hoje", "today", "currently", "atualmente") em nenhum dos dois arquivos.
6. **Lente de F1.** Mesmos 14 parágrafos (L17 a L43), mesma tabela de 70 linhas no glossário em palavras simples (L49 a L118) e mesmos 14 itens em "Onde a comparação para" / "Where the comparison stops" (L124 a L137), com as mesmas limitações. Nenhuma corrida, piloto ou equipe real citada. As etapas não têm F1 em nenhum dos dois idiomas.
7. **Tom.** Calmo nos dois idiomas; sem narração de transmissão, exclamações ou euforia.
8. **Imagens.** 5 imagens em cada arquivo, nas mesmas linhas e na mesma ordem (L1096, L1097, L1327, L1492, L1861), mesmo caminho de arquivo, texto alternativo e legenda traduzidos com o mesmo conteúdo e crédito presente e equivalente (kubernetes.io, The Kubernetes Authors, CC BY 4.0; cert-manager.io, The cert-manager Authors, Apache 2.0; istio.io, Istio Authors, Apache 2.0).
9. **Gate de travessões.** A busca por travessão e meia-risca encontra uma única ocorrência em cada arquivo, na linha 3, no intervalo das aulas 1 a 5 ("aulas 1" / "lessons 1" seguido de meia-risca e 5), que é a exceção permitida. Nenhuma outra ocorrência.

## Ressalvas

**R1. Glossário: "service" ambíguo para "atendimento"** (encaminhar ao tradutor-en)

- PT L56: "Cada atendimento começa do zero, como um balcão que não reconhece quem já passou ali."
- EN L56: "Every service starts from zero, like a counter that does not recognize who has already been there."
- Num guia técnico, "service" colide com Service do Kubernetes e com "serviço" no sentido de software, o que enfraquece o sentido do dia a dia que o glossário promete. Sugestão: "Every visit starts from zero" ou "Each time someone is served, it starts from zero".

**R2. Glossário: "95% of the services" para "95% dos atendimentos"** (encaminhar ao tradutor-en)

- PT L81: "Dizer que 95% dos atendimentos foram mais rápidos que um certo tempo."
- EN L81: "Saying that 95% of the services were faster than a certain time."
- Mesmo problema de R1, aqui com perda de clareza maior, porque a frase descreve uma métrica. Sugestão: "Saying that 95% of the customers were served faster than a certain time."

**R3. Lente de F1: "codifica" e "encrypts"** (encaminhar ao comentarista-f1, original PT)

- PT L31: "é esse aparelho, não a pessoa, que codifica a conversa"
- EN L31: "it is that device, not the person, that encrypts the conversation"
- A tradução usa o termo tecnicamente correto para o mTLS que a frase representa (L41). O original usa "codifica", e o próprio guia separa codificar de criptografar ao falar do Secret em base64 (L91, L1323, L2457). Para os dois idiomas dizerem a mesma coisa sem contradizer essa distinção, a correção sugerida é no PT: trocar "codifica a conversa" por "cifra a conversa" ou "criptografa a conversa". A linha L102 do glossário ("a conversa é em código" / "the conversation is in code") pode ficar como está, porque é registro do dia a dia.

## Observação opcional (não conta como ressalva)

- L2428: "Notas do professor: precisões técnicas" foi traduzido como "Teacher's notes: technical precisions". O sentido se mantém, mas "precisions" soa pouco natural em inglês. Se o tradutor quiser ajustar, "technical clarifications" acompanha o texto de abertura do bloco (L2430, "clarifications"). Como os rótulos já foram validados pelo conversor, só mude se o título não for chave de navegação.
