# Plano: Kubernetes para o Pitstop Dev Connect

> Objetivo: rodar o site (SSR TanStack Start, porta 3005) e a API de dados de F1
> (`server/`, porta 3333) em um cluster Kubernetes, replicando o que o perfil
> `prod` do `docker-compose.yml` já faz hoje.

## Visão geral da arquitetura

```
                        Internet
                           │
                     ┌─────▼─────┐
                     │  Ingress  │  meusite.com
                     └─────┬─────┘
              ┌────────────┴────────────┐
              │ /                       │ /api
        ┌─────▼─────┐             ┌─────▼─────┐
        │  Service  │             │  Service  │
        │   site    │             │    api    │
        └─────┬─────┘             └─────┬─────┘
        ┌─────▼─────┐             ┌─────▼─────┐
        │Deployment │             │Deployment │
        │ site :3005│──interno──▶ │  api :3333│
        │ (2 pods)  │  http://api │ (2 pods)  │
        └───────────┘             └───────────┘
```

Duas aplicações stateless, sem banco de dados, sem volumes persistentes.
É o cenário mais simples possível de Kubernetes.

## Inventário de manifests (~6 arquivos)

| Arquivo | Recurso | Função |
|---|---|---|
| `k8s/site-deployment.yaml` | Deployment | Roda a imagem do site SSR, réplicas, probes |
| `k8s/site-service.yaml` | Service (ClusterIP) | DNS interno estável `site:3005` |
| `k8s/api-deployment.yaml` | Deployment | Roda a imagem da API, réplicas, probes |
| `k8s/api-service.yaml` | Service (ClusterIP) | DNS interno estável `api:3333` |
| `k8s/configmap.yaml` | ConfigMap | `NODE_ENV`, URLs, variáveis não sensíveis |
| `k8s/ingress.yaml` | Ingress | Roteia `/` → site e `/api` → api, TLS |

---

## Fase 0 — Pré-requisitos

- [ ] Conta em um registry de imagens (Docker Hub, GHCR ou similar)
- [ ] `kubectl` instalado
- [ ] Cluster local para aprender: **k3d** (recomendado), kind ou minikube
- [ ] Conferir que os dois Dockerfiles buildam limpo:
  - `Dockerfile` na raiz (site, target `runner`)
  - `server/Dockerfile` (API)

## Fase 1 — Imagens no registry

No Kubernetes não existe build automático como no `docker compose up --build`.
O cluster só **puxa** imagens prontas de um registry.

- [ ] Buildar a imagem do site: `docker build -t <registry>/pitstop-site:v1 .`
- [ ] Buildar a imagem da API: `docker build -t <registry>/pitstop-api:v1 ./server`
- [ ] Push das duas imagens
- [ ] Convenção de tags: usar versão (`v1`, `v2`…) ou hash do commit — **nunca**
      só `latest`, senão o rolling update não detecta mudança

## Fase 2 — Deployments

Um Deployment para cada aplicação. Decisões a tomar em cada um:

- **Réplicas**: começar com 2 (permite rolling update sem downtime)
- **Porta**: `containerPort: 3005` (site) e `3333` (api)
- **Env**: `NODE_ENV=production` vindo do ConfigMap
- **Resources**: definir `requests` (o mínimo garantido) e `limits` (o teto).
  Chute inicial razoável: 128Mi/256Mi de memória, 100m/500m de CPU — ajustar
  observando o consumo real depois
- **Probes**:
  - `readinessProbe`: tira o pod do balanceamento se não responder
  - `livenessProbe`: reinicia o pod se travar
  - Ambas precisam de um endpoint HTTP que responda 200. Verificar se a API
    tem um `/health`; se não tiver, criar antes desta fase

- [ ] `site-deployment.yaml` escrito e aplicado
- [ ] `api-deployment.yaml` escrito e aplicado
- [ ] `kubectl get pods` mostra tudo `Running` e `READY`

## Fase 3 — Services

Um `ClusterIP` para cada Deployment. Isso cria DNS interno no cluster:
o site passa a alcançar a API por `http://api:3333`.

⚠️ **Ponto de atenção do projeto**: o site é SSR, então a API pode ser chamada
de dois lugares diferentes:

1. **Do servidor (SSR)** → usa o DNS interno do Service (`http://api:3333`)
2. **Do browser do usuário** → precisa passar pelo Ingress (`/api`)

- [ ] Mapear como o front chama a API hoje (URL hardcoded? env var?)
- [ ] Se necessário, parametrizar a URL da API via variável de ambiente
- [ ] `site-service.yaml` e `api-service.yaml` aplicados
- [ ] Testar de dentro de um pod: `curl http://api:3333/...`

## Fase 4 — Ingress (acesso externo)

- [ ] Instalar um Ingress Controller no cluster (nginx-ingress é o padrão;
      no k3d o Traefik já vem instalado)
- [ ] Regras de roteamento:
  - `meusite.com/` → Service `site:3005`
  - `meusite.com/api` → Service `api:3333` (decidir se a API remove ou espera
    o prefixo `/api` — pode precisar de rewrite no Ingress)
- [ ] Local: testar com entrada no `/etc/hosts` apontando pro IP do cluster
- [ ] Produção: TLS com cert-manager + Let's Encrypt (automatiza renovação)

## Fase 5 — Validação

- [ ] Site abre pelo Ingress, vídeo de fundo (`/brand/senna-bg.mp4`) carrega
- [ ] Dados de F1 aparecem (chamadas SSR e do browser funcionando)
- [ ] Matar um pod na mão (`kubectl delete pod ...`) → Deployment recria sozinho
- [ ] Trocar a tag da imagem → rolling update sem downtime
- [ ] `kubectl logs` mostra os logs das duas aplicações

## Fase 6 (opcional) — Produção de verdade

Só se for hospedar de fato, não necessário para aprender:

- Managed Kubernetes (GKE, EKS, DigitalOcean…) — nunca administrar control
  plane na mão para um site desse porte
- HorizontalPodAutoscaler (escala por CPU) — provavelmente overkill aqui
- Kustomize ou Helm quando houver mais de um ambiente (dev/prod)
- CI/CD: pipeline que builda a imagem, faz push e roda `kubectl apply`

---

## O que fica de FORA (e por quê)

| Não precisa | Motivo |
|---|---|
| PersistentVolume | Os volumes do compose são só `node_modules` de dev; em prod tudo está na imagem |
| StatefulSet | Não há banco de dados nem estado |
| Serviços `dev`/`api` do compose | Hot-reload é fluxo local; Kubernetes aqui é só o perfil `prod` |
| Secret | Nenhuma credencial no compose atual; adicionar só se surgir |

## Ordem resumida

```
imagens no registry → Deployments → Services → Ingress → validação
```

Cada fase é testável isoladamente antes de avançar — igual a um pit stop:
cada mecânico confere sua roda antes do carro voltar pra pista. 🏎️
