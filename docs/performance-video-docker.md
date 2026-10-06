# Procedimento — Lentidão no carregamento (vídeo + API) e portas do Docker

> Registrado em 05/07/2026, após sessão de diagnóstico na VPS (Contabo, França).
> Sintoma original: "trava muito o carregamento das informações do vídeo e dos dados da API".

## TL;DR

- **O servidor nunca foi o gargalo.** A API respondeu em 5–110 ms (cache quente) e ~300 ms no pior caso; até o vídeo anterior de 15,4 MB era entregue em cerca de 0,1 s localmente.
- **O gargalo observado era a distância**: a VPS fica em Lauterbourg, **França** (`vmi2987058.contaboserver.net`). O arquivo atual tem 8,6 MB, mas a latência e a banda entre França e Brasil ainda influenciam o primeiro acesso.
- Trocar imagem do Node (alpine → debian), "turbinar" a VM ou rodar em modo dev **não muda nada** — o tempo é gasto na rede, fora do servidor.
- O erro `Bind for 0.0.0.0:3333 failed: port is already allocated` **não tinha relação com o vídeo**: era o perfil dev subindo junto com o prod. Corrigido com `profiles` no compose.
- Solução definitiva para o vídeo: **CDN** (Cloudflare free na frente do domínio, ou bucket R2 + `VITE_SENNA_BG_URL`).

---

## 1. Como medir (antes de mexer em qualquer coisa)

```bash
# Produção usa apenas 80/443 no host; meça pelo Caddy, como o visitante.
SITE_URL="${SITE_URL:-https://pitstop.dev.br}"

# Latência de cada endpoint da API (cache quente)
for ep in health f1/next f1/races f1/standings f1/podiums f1/live; do
  curl -sS -o /dev/null -w "/api/$ep -> %{http_code} em %{time_total}s\n" "$SITE_URL/api/$ep"
done

# Pior caso: somente se CACHE_CLEAR_TOKEN estiver configurado no backend.
# Sem o token configurado, a rota responde 404 por segurança.
curl -sS -X POST \
  -H "Authorization: Bearer ${CACHE_CLEAR_TOKEN:?defina CACHE_CLEAR_TOKEN}" \
  "$SITE_URL/api/cache/clear"
# ... repete o loop acima

# Velocidade de entrega do vídeo e da página
curl -sS -o /dev/null -w "video: %{size_download} bytes em %{time_total}s\n" "$SITE_URL/brand/senna-bg.mp4"
curl -sS -o /dev/null -w "pagina: %{http_code} em %{time_total}s\n" "$SITE_URL/"
```

Valores medidos em 05/07/2026 (perfil prod):

| Teste                            | Resultado         |
| -------------------------------- | ----------------- |
| API cache quente                 | 5–110 ms          |
| API cache frio (upstream real)   | 195–273 ms        |
| Vídeo anterior de 15,4 MB, local | 0,18 s (~87 MB/s) |
| Página `/`                       | ~30 ms            |

**Interpretação:** se os números locais são bons e mesmo assim o site "trava" no navegador, o problema está entre o visitante e a VPS (banda/latência), não no container.

## 2. O que NÃO resolve (e por quê)

| Ideia                                    | Por que não ajuda                                                                                                                                                       |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trocar `node:22-alpine` por imagem cheia | O V8 é o mesmo; servir arquivo estático não usa CPU relevante. Alpine só dói em DNS/musl sob altíssimo volume de chamadas externas — não é o caso (a API cacheia tudo). |
| Aumentar CPU/RAM da VM                   | O servidor entrega o vídeo em 0,1 s e fica ocioso; o resto do tempo é a viagem França→Brasil. Hardware parado não acelera rede.                                         |
| Rodar em modo desenvolvimento            | É o contrário: `vite dev` + `tsx watch` adicionam overhead. O prod é o modo rápido.                                                                                     |

## 3. O vídeo (`public/brand/senna-bg.mp4`)

Fatos do arquivo atual: 960x720 (4:3), 30 fps, H.264 1,39 Mbps + AAC, 45,2 s, **8,6 MB**.
Ele **já tem faststart** (moov no início — verificado), então toca enquanto baixa. O `BootSplash` é carregado somente nas rotas iniciais `/` e `/en`, usa `preload="metadata"` e inicia a reprodução por JavaScript sem o atributo `autoplay`. Se o visitante preferir movimento reduzido ou estiver com economia de dados ativa, o componente nem cria o elemento de vídeo. O splash permanece por 2,6 s após o evento `playing`, com fade de 0,9 s; depois, o vídeo continua apenas como fundo da home.

### Gerar uma nova versão otimizada

O arquivo já está em 720p. Se a fonte for substituída, este comando mantém a resolução
e prioriza carregamento progressivo; o tamanho final varia conforme o conteúdo e o encoder.

```bash
ffmpeg -i public/brand/senna-bg.mp4 -vf scale=-2:720 \
  -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 96k -movflags +faststart senna-720.mp4

mv senna-720.mp4 public/brand/senna-bg.mp4
docker compose --profile prod up app --build -d
```

### Restaurar a versão rastreada no Git

O original está no git:

```bash
git restore public/brand/senna-bg.mp4
docker compose --profile prod up app --build -d
```

Estado verificado em 09/09/2026: **arquivo de 8,6 MB**, 960x720, presente no repositório.

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

### Portas no perfil de produção

No perfil `prod`, `app` e `api-prod` usam apenas `expose`, então é **esperado** que
`docker port` não mostre `3005` ou `3333` publicados no host. O acesso ocorre pelo
Caddy nas portas 80/443. Confira `docker compose --profile prod ps`, os logs do Caddy
e a URL HTTPS pública. No perfil `dev`, os mapeamentos 3005/3333 continuam publicados.

## 5. Modo dev

O serviço `dev` força `--port 3005` e o Compose publica `3005:3005`. Portanto,
o endereço local esperado é `http://localhost:3005`.
