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

- **`Dockerfile`** — aceita o build-arg `VITE_PITSTOP_API` e o embute no bundle
  (o Vite só expõe variáveis com prefixo `VITE_`, em build-time).
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
VITE_PITSTOP_API=https://pitstop.dev.br
```

- `DOMAIN` — usado pelo Caddy para o certificado e o roteamento.
- `VITE_PITSTOP_API` — domínio embutido no front (same-origin: o Caddy roteia `/api`).

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

- **`VITE_PITSTOP_API` é build-time.** Se mudar o domínio depois, é preciso
  **rebuildar** (`--build`), não basta reiniciar. Por isso é build-arg, não env de runtime.
- **Testar prod localmente** mudou: como `app`/`api-prod` usam `expose` (rede interna),
  não há acesso direto por `localhost:3005` no profile prod — só via Caddy/domínio.
  Para o dia a dia, use `docker compose --profile dev up` (hot-reload, portas 3005/3333
  publicadas).
- **Por que same-origin e não `api.` subdomínio:** o backend já serve sob `/api/*`, então
  o Caddy separa por caminho no mesmo domínio → um DNS só, zero CORS, HTTPS limpo.



1. Cloud Firewall da Contabo (painel) — só confirmar que não tem um firewall externo bloqueando. Entra no my.contabo.com → Networking / Firewall. Se não existir nenhum atribuído à VPS, tá liberado. Se existir, adiciona inbound TCP 80 e TCP 443 (origem 0.0.0.0/0).
2. DNS no registro.br — apontar @ e www pro IP da VPS (o do prompt sugere que já é sua VPS). Depois confirma:
dig +short pitstop.dev.br
2. Tem que retornar o IP da VPS.
3. .env na raiz do projeto:
env
DOMAIN=pitstop.dev.br
VITE_PITSTOP_API=https://pitstop.dev.br
4. Subir:
docker compose --profile prod up -d --build
5. Acompanhar o certificado (é o passo que confirma que DNS + portas estão OK):
docker compose --profile prod logs -f caddy
5. Se você ver linhas de certificate obtained successfully pro seu domínio, tá no ar em https://pitstop.dev.br. Se ver erro de ACME/challenge, quase sempre é DNS ainda não propagado ou o Cloud Firewall da Contabo bloqueando a 80 (o Let's Encrypt valida pela porta 80).