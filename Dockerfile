# ─── deps ────────────────────────────────────────────────────────────────────
FROM oven/bun:1.2-alpine AS deps
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

# ─── build ───────────────────────────────────────────────────────────────────
FROM deps AS builder
WORKDIR /app

# URLs públicas embutidas no bundle em build-time (Vite só expõe variáveis com
# prefixo VITE_). Atrás do Caddy same-origin, deixe VITE_PITSTOP_API vazia.
# Defina VITE_SENNA_BG_URL apenas quando o vídeo estiver em uma CDN externa.
ARG VITE_PITSTOP_API=""
ENV VITE_PITSTOP_API=$VITE_PITSTOP_API
ARG VITE_SENNA_BG_URL=""
ENV VITE_SENNA_BG_URL=$VITE_SENNA_BG_URL

COPY . .
# Override the default Cloudflare target so Nitro produces a Node.js server
RUN NITRO_PRESET=node-server bun run build

# ─── production ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3005

COPY --from=builder /app/.output ./.output

EXPOSE 3005

CMD ["node", ".output/server/index.mjs"]
