# ─── pitstop server — Node 22 + tsx (roda o .ts direto, sem build) ───────────
FROM node:22-alpine
WORKDIR /app

ENV PORT=3333

# tsx/typescript são devDependencies, mas são o runtime aqui — instala tudo
COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
COPY public ./public

# baixa os ícones de pista na build; não-fatal (o front tem fallback pro CDN)
RUN npm run icons || echo "icons: seguindo sem os PNGs locais"

ENV NODE_ENV=production
EXPOSE 3333

CMD ["npm", "start"]
