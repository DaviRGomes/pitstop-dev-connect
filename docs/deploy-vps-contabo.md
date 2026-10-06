# Deploy na VPS (Contabo) com domínio do registro.br

Guia para publicar o **pitstop.dev.br** numa VPS Contabo, atrás de um reverse proxy
(Caddy) com HTTPS automático, usando um domínio comprado no registro.br.

> Já roda via Docker: o `Dockerfile` usa `NITRO_PRESET=node-server`, então em
> produção o site sobe como servidor Node na porta **3005** e a API de F1 na **3333**.

## Visão geral

```
registro.br (DNS)  →  IP da VPS  →  [Caddy :80/:443]  →  app :3005  (SSR / site)
                                                      →  api-prod :3333  (dados F1)
```

- **DNS**: só traduz o domínio → IP da VPS. Configurado no registro.br.
- **Caddy**: recebe na 80/443, faz o HTTPS (Let's Encrypt) e repassa pros containers.
- **Same-origin**: o backend serve tudo sob `/api/*` (e imagens de pista em `/tracks/*`),
  então o Caddy roteia por caminho no **mesmo domínio** — sem subdomínio, sem CORS,
  sem mixed-content.

---

## 1. DNS no registro.br

Painel do domínio → **DNS** → **Editar zona** → criar:

```
Tipo   Nome   Valor            TTL
A      @      <IP_DA_VPS>      3600
A      www    <IP_DA_VPS>      3600
```

- `@` = domínio raiz (`pitstop.dev.br`)
- `www` = `www.pitstop.dev.br`

Propagação leva de minutos a algumas horas. Teste:

```sh
dig +short pitstop.dev.br     # deve retornar o IP da VPS
```

Não é necessário registro `api` — a API fica no mesmo domínio, via `/api`.

---

## 2. Firewall — abrir portas 80 e 443

Na Contabo existem **duas camadas** possíveis. Confira as duas.

### 2.1 Firewall do sistema (dentro da VPS)

Veja se há algo ativo:

```sh
sudo ufw status
```

- **`Status: inactive`** → nada bloqueando nesse nível (padrão comum das imagens
  Ubuntu/Debian da Contabo). Nada a fazer aqui.
- **`active`** → libere as portas (e garanta o SSH pra não se trancar fora):

```sh
sudo ufw allow OpenSSH      # ou: sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
sudo ufw status
```

AlmaLinux/CentOS (usa `firewalld`):

```sh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

> ⚠️ Antes de `sudo ufw enable`, garanta que a regra de SSH (22) está liberada,
> senão você perde o acesso à VPS.

### 2.2 Cloud Firewall da Contabo (painel)

Firewall externo **opcional** no painel do cliente. Se estiver ativo, bloqueia antes
de chegar na VPS:

1. **my.contabo.com** → **Networking / Firewall** (Cloud Firewall).
2. Na regra da sua VPS, adicione duas regras de **entrada (inbound)**:
   - `TCP` porta `80`, origem `0.0.0.0/0`
   - `TCP` porta `443`, origem `0.0.0.0/0`
3. Salve/aplique.

Se você nunca ativou isso, provavelmente não há Cloud Firewall e nada é preciso aqui.

> **Detalhe Docker:** o Caddy publica 80/443 via Docker, que escreve regras de iptables
> **por fora do ufw**. Então as portas publicadas costumam passar mesmo com ufw ativo.
> Se o site não abrir após subir, o suspeito nº 1 é o **Cloud Firewall da Contabo**.

---

## 3. Configuração do projeto (já versionada)

Estas mudanças já estão no repositório:

- **`Dockerfile`** — aceita os build-args `VITE_PITSTOP_API` e
  `VITE_SENNA_BG_URL` e os embute no bundle (o Vite só expõe variáveis com
  prefixo `VITE_`, em build-time).
- **`docker-compose.yml`** — `app`/`api-prod` ficam só na rede interna (`expose`),
  o `app` recebe o build-arg, e há o serviço **`caddy`** publicando 80/443.
- **`Caddyfile`** — HTTPS automático e roteamento por caminho.

`Caddyfile`:

```caddyfile
{$DOMAIN}, www.{$DOMAIN} {
	encode zstd gzip

	# API de F1 e imagens de pista → container do backend (server/, porta 3333)
	@api path /api/* /tracks/*
	handle @api {
		reverse_proxy api-prod:3333
	}

	# Todo o resto → app SSR (Nitro node-server, porta 3005)
	handle {
		reverse_proxy app:3005
	}
}
```

---

## 4. Variáveis de ambiente

Crie um `.env` na raiz do projeto **na VPS**:

```env
DOMAIN=pitstop.dev.br
VITE_PITSTOP_API=
VITE_SENNA_BG_URL=
```

- `DOMAIN` — usado pelo Caddy para o certificado e o roteamento.
- `VITE_PITSTOP_API` — deixe vazio no deploy padrão same-origin. Defina somente se
  o navegador precisar chamar uma API hospedada em outra origem.
- `VITE_SENNA_BG_URL` — deixe vazio para usar o vídeo versionado. Defina uma URL
  absoluta somente se o vídeo estiver em uma CDN externa.

As opções do backend, incluindo `CACHE_CLEAR_TOKEN`, limites de cache, timeouts,
CORS e credenciais opcionais da OpenF1, estão documentadas em `.env.example` e são
repassadas ao `api-prod` pelo Compose. Nunca versione os valores reais de segredo.

---

## 5. Subir em produção

```sh
docker compose --profile prod up -d --build
```

O Caddy detecta o DNS já apontado, emite o certificado Let's Encrypt sozinho, e o site
fica no ar em `https://pitstop.dev.br` com a API funcionando via `/api/*`.

Comandos úteis:

```sh
docker compose --profile prod ps          # status dos containers
docker compose --profile prod logs -f caddy   # ver a emissão do certificado
docker compose --profile prod down        # derrubar
```

---

## 6. Verificação

Do **seu** computador (não de dentro da VPS):

```sh
curl -I http://SEU_IP           # deve responder (redirect p/ HTTPS), não travar
curl -I https://pitstop.dev.br  # 200 após o certificado emitir
```

Ou um verificador de portas: `nmap SEU_IP -p 80,443`.

---

## Notas importantes

- **As variáveis `VITE_*` são build-time.** Ao alterar uma delas, é preciso
  **rebuildar** (`--build`), não basta reiniciar. No deploy same-origin padrão,
  `VITE_PITSTOP_API` deve permanecer vazia.
- **Testar prod localmente** mudou: como `app`/`api-prod` usam `expose` (rede interna),
  não há acesso direto por `localhost:3005` no profile prod — só via Caddy/domínio.
  Para o dia a dia, use `docker compose --profile dev up` (hot-reload, portas 3005/3333
  publicadas).
- **Por que same-origin e não `api.` subdomínio:** o backend já serve sob `/api/*`, então
  o Caddy separa por caminho no mesmo domínio → um DNS só, zero CORS, HTTPS limpo.
