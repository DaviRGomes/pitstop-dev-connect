# Procedimento — Lentidão no carregamento (vídeo + API) e portas do Docker

> Registrado em 05/07/2026, após sessão de diagnóstico na VPS (Contabo, França).
> Sintoma original: "trava muito o carregamento das informações do vídeo e dos dados da API".

## TL;DR

- **O servidor nunca foi o gargalo.** API responde em 5–110 ms (cache quente) e ~300 ms no pior caso; o vídeo de 15 MB é entregue em 0,1 s localmente.
- **O gargalo é a distância**: a VPS fica em Lauterbourg, **França** (`vmi2987058.contaboserver.net`). Visitante no Brasil baixa 15 MB com ~200 ms de latência — conexão TCP com latência alta rende uma fração da banda.
- Trocar imagem do Node (alpine → debian), "turbinar" a VM ou rodar em modo dev **não muda nada** — o tempo é gasto na rede, fora do servidor.
- O erro `Bind for 0.0.0.0:3333 failed: port is already allocated` **não tinha relação com o vídeo**: era o perfil dev subindo junto com o prod. Corrigido com `profiles` no compose.
- Solução definitiva para o vídeo: **CDN** (Cloudflare free na frente do domínio, ou bucket R2 + `VITE_SENNA_BG_URL`).

---

## 1. Como medir (antes de mexer em qualquer coisa)

```bash
# Latência de cada endpoint da API (cache quente)
for ep in health f1/next f1/races f1/standings f1/podiums f1/live; do
  curl -s -o /dev/null -w "/api/$ep -> %{http_code} em %{time_total}s\n" http://localhost:3333/api/$ep
done

# Pior caso: limpa o cache e mede de novo (vai na Jolpica/OpenF1 de verdade)
curl -s -X POST http://localhost:3333/api/cache/clear
# ... repete o loop acima

# Velocidade de entrega do vídeo e da página
curl -s -o /dev/null -w "video: %{size_download} bytes em %{time_total}s\n" http://localhost:3005/brand/senna-bg.mp4
curl -s -o /dev/null -w "pagina: %{http_code} em %{time_total}s\n" http://localhost:3005/
```

Valores medidos em 05/07/2026 (perfil prod):

| Teste                              | Resultado        |
| ---------------------------------- | ---------------- |
| API cache quente                   | 5–110 ms         |
| API cache frio (upstream real)     | 195–273 ms       |
| Vídeo 15 MB servido localmente     | 0,18 s (~87 MB/s)|
| Página `/`                         | ~30 ms           |

**Interpretação:** se os números locais são bons e mesmo assim o site "trava" no navegador, o problema está entre o visitante e a VPS (banda/latência), não no container.

## 2. O que NÃO resolve (e por quê)

| Ideia                                  | Por que não ajuda |
| -------------------------------------- | ----------------- |
| Trocar `node:22-alpine` por imagem cheia | O V8 é o mesmo; servir arquivo estático não usa CPU relevante. Alpine só dói em DNS/musl sob altíssimo volume de chamadas externas — não é o caso (a API cacheia tudo). |
| Aumentar CPU/RAM da VM                  | O servidor entrega o vídeo em 0,1 s e fica ocioso; o resto do tempo é a viagem França→Brasil. Hardware parado não acelera rede. |
| Rodar em modo desenvolvimento           | É o contrário: `vite dev` + `tsx watch` adicionam overhead. O prod é o modo rápido. |

## 3. O vídeo (`public/brand/senna-bg.mp4`)

Fatos do arquivo original: 1440x1080 (4:3), 30 fps, H.264 2,6 Mbps + AAC 128k, 45 s, **15,4 MB**.
Ele **já tem faststart** (moov no início — verificado), então toca enquanto baixa; o custo é só o peso na banda do visitante, que disputa com as chamadas da API no carregamento (`preload="auto"` + `autoplay` no `BootSplash`).

### Versão otimizada (opcional — 6,9 MB, 55% menor)

Testada e comparada quadro a quadro: em 720p CRF 28 fica praticamente indistinguível
(CRF 30 foi descartado por apagar detalhe nas cenas escuras).

```bash
ffmpeg -i public/brand/senna-bg.mp4 -vf scale=-2:720 \
  -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 96k -movflags +faststart senna-720.mp4

mv senna-720.mp4 public/brand/senna-bg.mp4
docker compose --profile prod up app --build -d
```

### Restaurar o original (qualidade cheia)

O original está no git:

```bash
git restore public/brand/senna-bg.mp4
docker compose --profile prod up app --build -d
```

Estado atual (05/07/2026): **original de 15,4 MB no ar**, por decisão de manter a qualidade.

### Solução definitiva: CDN (é assim que site grande faz)

1. **Cloudflare free** na frente do domínio com proxy ativado (nuvem laranja): mp4, PNGs, JS e CSS ficam cacheados em São Paulo depois do primeiro acesso.
2. Alternativa: subir o vídeo num bucket com CDN (ex.: Cloudflare R2) e apontar
   `VITE_SENNA_BG_URL=https://…/senna-bg.mp4` — o `src/assets/brand/paths.ts` **já lê essa variável**, zero mudança de código.

## 4. Docker Compose — perfis e comandos corretos

Regra do Compose que causou o erro de portas: **serviço sem `profiles` sobe sempre**, com qualquer perfil ativo. Por isso `--profile prod up` (sem nomear serviços) subia também `dev` e `api`, roubando as portas 3005/3333. Corrigido colocando `dev` e `api` no perfil `dev` no `docker-compose.yml`.

```bash
# Produção (VPS) — rebuilda e sobe app + api-prod:
docker compose --profile prod up --build -d

# Só o front:
docker compose --profile prod up app --build -d

# Desenvolvimento com hot-reload:
docker compose --profile dev up

# Parar o dev:
docker compose --profile dev down
```

Obs.: a ordem das flags não importa (`up app --build -d` == `up -d --build app`), e nomear um serviço na linha de comando ativa o perfil dele automaticamente.

### Armadilha: container "zumbi" sem porta publicada

Se um container foi **criado durante um conflito de porta**, ele pode subir depois
"rodando" mas com o mapeamento nunca programado no host:

- Sintoma: `docker ps` mostra o container Up **sem** nada na coluna de portas;
  `curl` retorna `000`; o log interno diz "Listening" normalmente.
- Diagnóstico: `docker port <container>` vazio e
  `docker inspect <container> --format '{{json .NetworkSettings.Ports}}'` retorna `{}`.
- Correção:

```bash
docker compose --profile prod up -d --force-recreate app
```

## 5. Pendência conhecida (modo dev)

O Vite dentro do container `dev` escuta na porta **8080** (config do
`@lovable.dev/vite-tanstack-config`), mas o compose mapeia **3005:3005** — ou seja,
o modo dev hoje não fica acessível. Antes de usar, alinhar: ou mapear `8080` no
compose, ou forçar `--port 3005` no comando do Vite.
