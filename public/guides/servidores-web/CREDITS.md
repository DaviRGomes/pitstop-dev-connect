# Créditos das imagens

Os diagramas desta pasta vêm da documentação oficial de cada projeto.

## Kubernetes

Repositório https://github.com/kubernetes/website, © The Kubernetes Authors, licença Creative
Commons Attribution 4.0 International (CC BY 4.0): https://creativecommons.org/licenses/by/4.0/

| Arquivo | Original |
|---|---|
| etapa08-ingress-path.svg | content/en/docs/images/ingressFanOut.svg |
| etapa08-ingress-host.svg | content/en/docs/images/ingressNameBased.svg |

Alteração: os dois arquivos ganharam a regra `foreignObject{overflow:visible}` logo depois da
tag `<svg>`, para o texto não ser cortado quando a fonte Trebuchet MS não está instalada. O
desenho e o texto não mudaram.

## cert-manager

Repositório https://github.com/cert-manager/website, © The cert-manager Authors, licença
Apache 2.0: https://www.apache.org/licenses/LICENSE-2.0. Arquivo sem modificações.

| Arquivo | Original |
|---|---|
| etapa09-cert-manager.svg | public/images/high-level-overview.svg |

## Istio

Repositório https://github.com/istio/istio.io, © Istio Authors, licença Apache 2.0:
https://www.apache.org/licenses/LICENSE-2.0. Arquivos sem modificações.

| Arquivo | Original |
|---|---|
| etapa10-istio-arquitetura.svg | content/en/docs/ops/deployment/architecture/arch.svg |
| etapa12-istio-seguranca.svg | content/en/docs/concepts/security/arch-sec.svg |
| etapa11-istio-versoes.svg | archive/v0.5/docs/concepts/traffic-management/img/pilot/ServiceModel_Versions.svg |

## Wikimedia Commons

Arquivos sem modificações, apenas renomeados.

| Arquivo | Original | Autor | Licença |
|---|---|---|---|
| etapa01-conteudo-estatico.svg | https://commons.wikimedia.org/wiki/File:Web_server_serving_static_content.svg | Giga Bang | Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0): https://creativecommons.org/licenses/by-sa/4.0/ |
| etapa02-pilha-http.svg | https://commons.wikimedia.org/wiki/File:HTTP-1.1_vs._HTTP-2_vs._HTTP-3_Protocol_Stack.svg | Sedrubal | Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0): https://creativecommons.org/licenses/by-sa/4.0/ |
| etapa03-forward-proxy.svg | https://commons.wikimedia.org/wiki/File:Forward_proxy_h2g2bob.svg | H2g2bob | CC0 1.0, domínio público: https://creativecommons.org/publicdomain/zero/1.0/ |
| etapa03-reverse-proxy.svg | https://commons.wikimedia.org/wiki/File:Reverse_proxy_h2g2bob.svg | H2g2bob | CC0 1.0, domínio público: https://creativecommons.org/publicdomain/zero/1.0/ |

## HTTP/3 explained

Repositório https://github.com/bagder/http3-explained, © Daniel Stenberg e colaboradores,
licença Creative Commons Attribution 4.0 International (CC BY 4.0):
https://creativecommons.org/licenses/by/4.0/. Arquivos sem modificações, apenas renomeados.

| Arquivo | Original |
|---|---|
| etapa02-tcp-streams.png | images/tcp-chain-streams.png |
| etapa02-quic-streams.png | images/quic-chain-streams.png |

## The Architecture of Open Source Applications

Livro *The Architecture of Open Source Applications*, volume II, capítulo 14 ("nginx"), de
Andrew Alexeev, editado por Amy Brown e Greg Wilson, https://aosabook.org/en/v2/nginx.html,
licença Creative Commons Attribution 3.0 Unported (CC BY 3.0):
https://creativecommons.org/licenses/by/3.0/. Arquivo sem modificações, apenas renomeado.

| Arquivo | Original |
|---|---|
| etapa05-nginx-arquitetura.png | https://aosabook.org/static/nginx/architecture.png (Figura 14.1) |

## Diagramas próprios

Desenhados para este guia a partir dos laboratórios das etapas, sem material de terceiros. Cada
um tem uma versão em português (`.svg`) e uma em inglês (`.en.svg`).

| Arquivo | Etapa |
|---|---|
| etapa04-mpm.svg, etapa04-mpm.en.svg | 04: Prefork, Worker e Event |
| etapa06-l4-l7.svg, etapa06-l4-l7.en.svg | 06: balanceamento L4 e L7 |
| etapa07-failover.svg, etapa07-failover.en.svg | 07: failover, backup, 502 e 504 |
| etapa13-vip-1.svg, etapa13-vip-2.svg e as versões .en.svg | 13: Keepalived movendo o IP virtual |
| etapa14-camadas.svg, etapa14-camadas.en.svg | 14: defesa em camadas |
