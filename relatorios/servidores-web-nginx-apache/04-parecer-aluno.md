# Parecer do aluno: Servidores Web e Balanceamento de Carga, revisão das 14 etapas

## Veredito

APROVADO. Nota 9,7. O relatório agora cobre as cinco aulas do módulo em uma progressão única: fundamentos de servidor web, balanceamento e failover, entrada no Kubernetes, TLS automático, Service Mesh, segurança interna, observabilidade, alta disponibilidade e defesa da borda. As práticas dizem o que executar e o que observar. As analogias de F1 ajudam sem esconder onde deixam de ser literais.

## Teste de recuperação

Sem consultar o relatório, consegui reconstruir o caminho completo:

1. Nginx ou Apache assume responsabilidades de borda para que a aplicação preserve foco na regra de negócio.
2. HTTP evolui de conexões sequenciais para multiplexação e QUIC; forward e reverse proxy atuam em lados opostos.
3. Apache escala com processos e threads conforme o MPM; Nginx usa poucos workers e I/O não bloqueante.
4. Balanceamento L4 usa dados de transporte; L7 entende HTTP. Round Robin, peso, `least_conn` e afinidade respondem a necessidades diferentes.
5. Health checks passivos, backup, logs e métricas permitem retirar upstreams incapazes e separar 502 de 504.
6. Ingress declara host e path; o Controller executa. cert-manager emite e renova o Secret TLS.
7. Envoy aplica políticas no Data Plane e Istiod coordena o Control Plane.
8. DestinationRule cria subsets; VirtualService controla canary, A/B, mirroring, retry e timeout.
9. PeerAuthentication exige mTLS; AuthorizationPolicy restringe ações; métricas e traces mostram o caminho.
10. HA remove SPOFs e mede continuidade com SLO; DR trata recuperação com RTO e RPO.
11. WAF, CRS, rate limiting, TLS, HSTS, logs e correção da aplicação formam defesa em camadas.

## Clareza por bloco

- **Etapas 01 a 05:** mantêm a base detalhada e corrigem a antiga inconsistência entre Docker, instalação local e porta usada nos testes.
- **Etapas 06 e 07:** tornam balanceamento observável. O exercício de parar um backend obriga a provar failover, não apenas ler a configuração.
- **Etapas 08 e 09:** separam corretamente Ingress Resource, Controller, Service e Secret TLS. A nota sobre Gateway API evita tratar Ingress como API em evolução.
- **Etapas 10 a 12:** deixam claro o custo da malha e não vendem Istio como solução automática para código ruim. A migração PERMISSIVE para STRICT é mais segura que ativar bloqueio sem inventário.
- **Etapas 13 e 14:** diferenciam HA de DR e WAF de correção permanente. Isso reduz duas confusões comuns.

## Exercícios

- Os comandos de Nginx informam validação, reload, geração de carga e sinais a observar.
- Os exercícios de Kubernetes exigem um cluster de laboratório, um Ingress Controller e Services saudáveis.
- A etapa de cert-manager recomenda staging antes de produção e orienta investigar Certificate, Order e Challenge.
- Os exercícios de Istio usam o perfil demo apenas no laboratório, confirmam injeção e incluem rollback.
- Alta disponibilidade exige medir o failover, não aceitar a troca de papel apenas pela configuração.
- O WAF começa em detecção para medir falsos positivos antes do bloqueio.

Nenhum exercício promete funcionar sem pré-requisito. Os exemplos com domínio público, certificado ACME, VRRP ou cluster deixam clara a necessidade de ambiente controlado.

## Analogias

- **Mureta como servidor web:** continua sendo a âncora principal e separa infraestrutura de lógica de negócio.
- **Estrategista como balanceador:** explica distribuição, mas o texto retorna ao algoritmo concreto antes de configurar.
- **Portão como Ingress:** ajuda a visualizar entrada e roteamento. A nota distingue declaração de Controller.
- **Unidade de telemetria como Envoy:** fixa a presença junto ao workload. A nota registra interferência, latência e custo.
- **Redundância da equipe como HA:** explica reação à falha sem fingir que F1 oferece SLA ou escala de réplicas.
- **Segurança do paddock como WAF:** ilustra inspeção, mas o relatório afirma que o conserto definitivo pertence à aplicação.

## Paridade PT-BR e inglês

As duas versões publicadas possuem os mesmos 14 ids, a mesma ordem, os mesmos blocos técnicos, exemplos equivalentes, comandos correspondentes e notas de limitação. Títulos, índice, busca, contagem de voltas, abertura e rodapé também anunciam o módulo completo.

## Gate editorial

- Etapas no relatório final: 14.
- Etapas no conteúdo PT-BR: 14.
- Etapas no conteúdo em inglês: 14.
- Travessões proibidos em `03-comentarista.md`: 0.
- Travessões proibidos em `final.md`: 0.
- Conteúdo alheio à proposta de relatórios educacionais: 0.

## Resumo de consertos por persona

- **Professor:** cobertura técnica e práticas das Aulas 02 a 05 acrescentadas; APIs do Kubernetes e Istio atualizadas.
- **Piloto:** mapa de analogias ampliado e três novos limites documentados.
- **Comentarista:** abertura, transições, setores e bandeira final reescritos para quatorze etapas.
- **Aluno:** nenhuma ressalva bloqueante após a revisão final.
