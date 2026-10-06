# Compila TypeScript uma única vez; a imagem final leva só JS e dependências de runtime.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY scripts ./scripts
COPY public ./public
RUN npm run build
# Os PNGs são ignorados no Git; tenta materializá-los na imagem. O frontend
# mantém fallback para CDN caso a OpenF1 esteja indisponível durante o build.
RUN npm run icons || echo "icons: seguindo sem os PNGs locais"

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3333

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

USER node
EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:3333/api/health >/dev/null || exit 1

CMD ["node", "dist/index.js"]
