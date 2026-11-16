# Design system do pitstop.dev.br

Regras de UI/UX e web design do site, tiradas do que já está em produção
(`src/styles.css`, `src/components/`, `src/routes/__root.tsx`). Serve de
referência para criar páginas e componentes novos sem sair do padrão.

**Público:** pessoas da área de software (devs, SRE, DevOps, estudantes de TI).
**Propósito:** aprender lendo guias de estudo longos, com prática.
**Tema:** Fórmula 1 como lente, telemetria de software como linguagem visual.

---

## 1. Princípios

1. **Leitura vem antes do tema.** O conteúdo técnico é o produto; a F1 dá
   identidade (cores, pista, bandeira, cronômetro) mas nunca disputa atenção
   com o texto, o código ou os exercícios.
2. **Cara de ferramenta de dev.** Fonte mono para metadados, números, comandos
   e rótulos; fundo escuro; bordas finas de 1px. Quem lê deve se sentir num
   terminal ou num painel de telemetria, não numa revista.
3. **Escuro sempre.** O site tem um único tema, escuro. Não existe modo claro
   para as páginas do pitstop (o `.dark`/`:root` do shadcn existe, mas o
   visual do site usa os tokens do bloco "pitstop").
4. **Um destaque por vez.** O amarelo é o acento principal. Em cada bloco,
   uma coisa só ganha amarelo (o CTA, o número da etapa, o item ativo).
5. **Movimento como decoração, nunca como requisito.** Toda animação tem
   alternativa em `prefers-reduced-motion: reduce`.
6. **Progresso visível.** O leitor sempre sabe onde está (rail com etapas,
   barra de progresso em 3 setores, bandeira quadriculada no que concluiu).

---

## 2. Paleta de cores

Os tokens ficam em `:root` no bloco "pitstop.dev.br" de `src/styles.css`.
Use sempre a variável, nunca o hex solto.

### 2.1 Superfícies (fundos)

| Token     | Valor                    | Uso                                                  |
| --------- | ------------------------ | ---------------------------------------------------- |
| `--ink`   | `#0A0D14`                | Fundo da página (`body`)                              |
| `--ink-2` | `#121620`                | Blocos de código, comandos, dropdowns, aba ativa     |
| `--panel` | `#1A1F2B`                | Topo de cards (gradiente `--panel` → `--ink-2`)       |
| `--wash`  | `rgba(255,255,255,.04)`  | Hover de links/menus, linhas de tabela, chips         |

Gradiente padrão de card: `linear-gradient(180deg, var(--panel), var(--ink-2))`.

### 2.2 Linhas (bordas)

| Token           | Valor                    | Uso                                          |
| --------------- | ------------------------ | -------------------------------------------- |
| `--line`        | `rgba(255,255,255,.09)`  | Borda padrão de cards, divisórias de seção   |
| `--line-strong` | `rgba(255,255,255,.16)`  | Bordas de botões ghost, código, tags, inputs |

Divisórias internas de card (rodapé do card, "dados ao vivo") usam
`1px dashed var(--line)`.

### 2.3 Texto

| Token       | Valor     | Contraste em `--ink` | Uso                                        |
| ----------- | --------- | -------------------- | ------------------------------------------ |
| `--text`    | `#E9ECF3` | 16.4 : 1             | Títulos, `strong`, item ativo, lead        |
| `--body`    | `#C7CEDD` | 12.3 : 1             | Corpo do texto (padrão do `body`)          |
| `--muted`   | `#8B93A6` | 6.3 : 1              | Texto secundário, descrições de card       |
| `--dim`     | `#7C88A6` | 5.5 : 1 (4.65 no `--panel`) | Metadados, rótulos mono, placeholders |
| `--code-fg` | `#D9E0EF` | —                    | Texto dentro de blocos de código           |

> Todos os tokens de texto passam AA (4.5:1) tanto no `--ink` quanto no
> `--panel`. `--dim` e `--muted` ficaram próximos; a hierarquia entre eles vem
> também de tamanho e fonte (mono pequeno para `--dim`).

### 2.4 Cores da marca (F1)

| Token              | Valor     | Nome / referência        | Papel                                                    |
| ------------------ | --------- | ------------------------ | -------------------------------------------------------- |
| `--senna-yellow`   | `#FFD400` | amarelo do capacete      | **Acento principal**: CTA, item ativo, foco, números     |
| `--mclaren-red`    | `#E4002B` | vermelho                 | "Ao vivo", fim do gradiente da marca, sintoma/erro       |
| `--brasil-green`   | `#00A651` | verde                    | Sucesso, concluído, "publicado", prompt `$`              |
| `--helmet-blue`    | `#2E7DE0` | azul do capacete         | Links, chaves em código, laboratório/prática             |
| `--fastest-purple` | `#C77DFF` | roxo da volta mais rápida | Só para "melhor tempo" no placar ao vivo                |

Gradiente da marca: `linear-gradient(90deg, var(--senna-yellow), var(--mclaren-red))`.
Aparece no filete de 3px no topo dos cards, na barra de progresso e no
destaque do título da home. Não use em áreas grandes.

### 2.5 Aliases semânticos (use estes no código novo)

| Alias          | Aponta para       | Significado                     |
| -------------- | ----------------- | ------------------------------- |
| `--k8s`        | `--senna-yellow`  | acento / estado ativo           |
| `--ember`      | `--senna-yellow`  | aviso, callout padrão           |
| `--k8s-bright` | `--helmet-blue`   | link, informação                |
| `--signal`     | `--brasil-green`  | progresso, ok, resposta         |
| `--ok`         | `--brasil-green`  | sucesso / concluído             |
| `--violet`     | `--mclaren-red`   | (legado — o nome não bate com a cor; evite em código novo) |

### 2.6 Cores fora dos tokens (existem hoje, padronizar)

| Hex        | Onde                                        | Sugestão                                  |
| ---------- | ------------------------------------------- | ----------------------------------------- |
| `#ff6b81`  | Título de "sintoma" e coluna "custo" em tabelas | criar `--danger-text` (o vermelho puro só tem 4.0:1) |
| `#C7CEDD`  | 2º lugar no pódio (prata)                   | já é `--body`; usar o token               |
| `#C08452`  | 3º lugar no pódio (bronze)                  | criar `--bronze`                          |
| `#0a0a0a`  | Texto sobre o botão amarelo                 | criar `--on-yellow`                       |
| `#fff` / `#1b2230` | Moldura de figuras e legenda interna  | ok: diagramas são desenhados em fundo branco |

### 2.7 Transparências (`color-mix`)

Fundos e bordas tingidos sempre via `color-mix(in srgb, <cor> N%, transparent)`:

| Uso                         | % da cor |
| --------------------------- | -------- |
| Fundo de callout / bloco    | 6–8%     |
| Fundo de badge / ícone      | 12–14%   |
| Borda de badge              | 32–55%   |
| Seleção de texto            | 28% amarelo |
| Sombra colorida do CTA      | 60% (75% no hover) |

### 2.8 Regras de uso de cor

- Amarelo = "olhe aqui / ação". Não use amarelo para texto corrido.
- Vermelho = "ao vivo" ou "problema". Nunca para botões de ação comuns.
- Verde = "deu certo / concluído". O botão "Marcar como concluída" fica verde.
- Azul = "clicável" (links) e "mão na massa" (laboratório).
- Roxo é exclusivo do placar ao vivo.
- Vermelho e azul como **texto pequeno** em `--panel` ficam abaixo de 4.5:1.
  Em cards, prefira `#ff6b81` (vermelho) e mantenha links azuis com tamanho
  ≥ .85rem ou sublinhado no hover (já é o padrão).

---

## 3. Tipografia

Fontes servidas pelo próprio site (`public/fonts/`, só o subconjunto latino,
licença OFL), declaradas com `@font-face` e `font-display: swap` no topo de
`src/styles.css`. A Saira Condensed 700 e a Inter são pré-carregadas no
`<head>` (`src/routes/__root.tsx`). Não volte a usar o Google Fonts: ele
obriga o navegador a abrir conexão com mais dois domínios antes do texto.

| Papel     | Família           | Pesos      | Token / onde                               |
| --------- | ----------------- | ---------- | ------------------------------------------ |
| Display   | Saira Condensed   | 600, 700   | `--display` — títulos, botões, nav, números |
| Corpo     | Inter             | 400–700    | `body` — texto corrido                      |
| Mono      | JetBrains Mono    | 400, 500   | `--mono` — código, rótulos, metadados       |

Fallbacks: `"Arial Narrow"` (display), `system-ui` (corpo), `Consolas` (mono).

### 3.1 Escala

| Elemento                 | Fonte   | Tamanho                          | Detalhes                                      |
| ------------------------ | ------- | -------------------------------- | --------------------------------------------- |
| Título da home           | Display | `clamp(2.4rem, 5.6vw, 4.6rem)`   | 700, MAIÚSCULAS, line-height .98              |
| Título do guia (`.htitle`) | Display | `clamp(2.9rem, 8vw, 5.6rem)`   | 700, MAIÚSCULAS, line-height .96              |
| `h2` de seção            | Display | `clamp(1.85rem, 4vw, 2.8rem)`    | 700, line-height 1.04                         |
| `h3`                     | Inter   | `1.1rem`                         | 600                                           |
| Título de card           | Display | `1.35–1.45rem`                   | MAIÚSCULAS                                    |
| Lead                     | Inter   | `1.06rem`                        | cor `--text`                                  |
| Corpo                    | Inter   | `16px`                           | line-height **1.7**                           |
| Texto de card            | Inter   | `.89–.93rem`                     | `--muted` ou `--body`                         |
| Código                   | Mono    | `.8rem`                          | line-height 1.6                               |
| Eyebrow / kicker         | Mono    | `.72–.78rem`                     | MAIÚSCULAS, letter-spacing `.12–.22em`        |
| Badge / rótulo mínimo    | Mono    | `.6–.66rem`                      | letter-spacing `.08–.18em`                    |

No celular (≤480px) o título do guia cai para `clamp(2rem, 11vw, 2.9rem)`
e o `h2` para `clamp(1.6rem, 7vw, 2.2rem)`.

### 3.2 Regras

- **Display sempre em MAIÚSCULAS** com tracking positivo (`.02–.16em`).
  Exceção: o título da home usa `-.01em` porque é muito grande.
- **Mono para tudo que é "dado"**: número da etapa (`01`), contagem, data,
  status, nome de comando, rótulo de tabela. Números alinhados com
  `font-variant-numeric: tabular-nums`.
- **Largura de linha**: parágrafos em `max-width: 68ch`; listas e laboratório
  até `76ch`; lead do hero `58ch`.
- `code` inline: mono `.86em`, fundo `--wash`, borda `--line`, raio 5px.
- `strong`/`b` sobem para `--text`, peso 600. Dentro de callouts, `b` herda a
  cor do callout.

---

## 4. Espaçamento, grid e layout

### 4.1 Larguras

| Contêiner        | Largura máx. | Padding lateral                       |
| ---------------- | ------------ | ------------------------------------- |
| Home (`.home`)   | 1180px       | `clamp(20px, 4vw, 48px)`              |
| Guia (`.wrap`)   | 1080px       | `clamp(20px, 5vw, 72px)` no `main`    |
| Seção da home    | 900px        | —                                     |
| Rail lateral     | 252px fixos  | 28px 22px                             |

### 4.2 Ritmo vertical

- Seção do guia: `padding: 84px 0 40px`, separada por `border-top: 1px solid var(--line)`.
- Home: `gap: 96px` entre blocos (64px ≤780px, 48px ≤480px).
- Grids de cards: `gap: 14px` (guia) ou `20px` (home).
- Espaços internos de card: 20–26px.

### 4.3 Grid

- `.g2` / `.g3` — 2 ou 3 colunas iguais; viram 1 coluna ≤880px.
- Home: categorias em 3 colunas, guias em 2; ambos 1 coluna ≤780px.
- Use `minmax(0, 1fr)` em grids com carrossel ou código para não estourar a tela.

### 4.4 Raios

| Raio   | Uso                                             |
| ------ | ----------------------------------------------- |
| 999px  | Botões CTA, badges, busca, chips, barra de progresso |
| 16px   | Cards da home e de corrida                      |
| 14px   | `.panel`, cards de categoria, laboratório       |
| 12px   | Dropdown de busca, figuras, colapsáveis         |
| 9–10px | Código, comandos, botão "concluída", callouts   |
| 8px    | Itens de menu, botão de ícone                   |
| 5px    | `code` inline                                   |

### 4.5 Breakpoints

| Largura  | O que muda                                                       |
| -------- | ---------------------------------------------------------------- |
| ≤1100px  | Race hub empilha (carrossel em cima, campeonato embaixo)         |
| ≤1080px  | Some a pista vertical da direita                                 |
| ≤900px   | Nav vira hambúrguer; busca e idioma vão para o menu              |
| ≤880px   | Rail vira barra horizontal rolável no topo; grids 1 coluna       |
| ≤780px   | Home em 1 coluna                                                 |
| ≤480px   | Nav de 54px, títulos menores, paddings reduzidos                 |

### 4.6 Camadas (z-index)

`0` vídeo de fundo · `1` conteúdo · `5` pista · `20` rail mobile ·
`900` nav fixa · `950` resultados da busca · `9996–9999` splash de abertura.

---

## 5. Componentes

### 5.1 Botões

Todos com `display: inline-flex; align-items: center; gap: 8px` e ícone à esquerda ou direita do texto.

| Classe             | Aparência                                                                 | Quando usar                                  |
| ------------------ | ------------------------------------------------------------------------- | -------------------------------------------- |
| `.btn-primary`     | Pílula amarela, texto `#0a0a0a`, Display 700 MAIÚSCULAS `.85rem`, tracking `.12em`, padding `13px 22px`, sombra amarela | **Uma** ação principal por tela ("Ver relatórios →") |
| `.btn-ghost`       | Pílula transparente, borda `--line-strong`, texto `--text`, Display 600  | Ação secundária ao lado do primário          |
| `.btn-done`        | Mono `.74rem`, borda `--line-strong`, raio 9px; estado `.on` fica verde com pulso de "luz de largada" | Marcar etapa como concluída                  |
| `.icon-btn`        | 32×32, raio 8px, cor `--body`                                            | Ações só com ícone na nav (GitHub etc.)      |
| `.live-cal-btn`    | Pílula pequena mono `.64rem` MAIÚSCULAS                                  | Alternar visão dentro de um card             |
| `.race-live-back`  | Largura total, fundo vermelho 12%, Display MAIÚSCULAS                   | Voltar para o "ao vivo"                      |
| `.race-nav`        | Círculo 34px, borda `--line-strong`                                      | Setas de carrossel                           |
| `.hamburger`       | 34×34, raio 8px                                                          | Menu no celular                              |

**Estados**

| Estado    | Regra                                                                       |
| --------- | --------------------------------------------------------------------------- |
| Hover     | Primário sobe 1px e a sombra cresce; ghost ganha fundo `--wash`; outlines ganham borda amarela ou verde |
| Active    | `scale(.97)` (botão "Pular" da abertura)                                    |
| Foco      | `outline: 2px solid var(--k8s)` (amarelo), `offset 2px`. Sobre vídeo: branco |
| Desabilitado | `opacity: .25` (setas) ou card inteiro com `opacity: .55` e sem hover    |
| Ligado    | `aria-pressed="true"` → texto e borda amarelos                              |

**Regras**

- Texto de botão em verbo curto, escrito em minúsculas no HTML ("ver relatórios", "como funciona"); o CSS põe em MAIÚSCULAS.
- Área clicável mínima de 32px (44–48px nos controles da abertura e no celular).
- Links que parecem botão são `<a>`; ações na página são `<button>`.

### 5.2 Links

- Cor `--helmet-blue`, sem sublinhado; sublinha no hover.
- Links de navegação (nav, cards): sem sublinhado, hover muda para amarelo.
- Link externo: ícone `ExternalLink` (lucide) depois do texto.

### 5.3 Navegação

- **Nav global** (`.site-nav`): fixa no topo, 64px (54px no celular), fundo
  `--ink` a 78% com `backdrop-filter: blur(10px)`. Marca à esquerda; links em
  Display MAIÚSCULAS `.78rem` tracking `.16em`; busca; toggle PT/EN; ícone.
- **Rail do guia** (`.rail`): coluna fixa de 252px com a lista de etapas.
  Cada item tem número mono (`01`), título, e marca à direita:
  bandeira quadriculada (concluída, balançando) ou capacete (ativa).
  Item ativo: fundo amarelo 10% + borda esquerda amarela de 2px.
- **Âncoras** param abaixo da nav: `scroll-margin-top: calc(var(--nav-h) + 16px)`.

### 5.4 Marca

`.brand-mark` 40×40, raio 10px, fundo amarelo 14%, borda amarela 32%, ícone
de capacete amarelo. Texto "PITSTOP" em Display, `.dev.br` em amarelo (home)
ou mono `--dim` (rail).

### 5.5 Busca

Pílula de 200px, fundo `--wash`, atalho de teclado em `.search-kbd`
(mono `.62rem`, borda, raio 4px). Resultados em dropdown `--ink-2`, raio 12px,
sombra `0 16px 40px rgba(0,0,0,.45)`. Cada resultado: guia (mono, `--dim`),
número da etapa em amarelo, título, trecho em `--muted`.

### 5.6 Cards

| Classe          | Estrutura                                                          | Hover                                      |
| --------------- | ------------------------------------------------------------------ | ------------------------------------------ |
| `.panel`        | Gradiente de card, borda `--line`, raio 14px, padding 20/22px     | —                                          |
| `.cat-card`     | Ícone 40px em quadrado amarelo 14% + tag mono + título Display     | Borda amarela, sobe 3px                    |
| `.report-card`  | Filete de 3px com gradiente da marca no topo; cabeçalho (número + status), área em mono amarelo, título, lead, rodapé tracejado com "Ler →" | Borda amarela, sobe 3px, sombra amarela |
| `.report-card--empty` | Mesmo card com `opacity .55`, filete cinza, sem hover        | —                                          |
| `.race-card`    | Filete do gradiente a 30% (100% na próxima corrida)                | —                                          |
| `.sc-node`      | Nó de mapa/fluxo; tracejado = origem, borda verde = concluído      | Borda amarela, sobe 2px                    |

Regra: card clicável inteiro é um `<a>` e sempre tem hover com borda amarela +
`translateY(-2|-3px)`. Card não clicável não muda no hover.

### 5.7 Badges e tags

Pílula, mono ou Display `.6–.7rem`, MAIÚSCULAS, tracking `.08–.18em`, padding `2–3px 9–10px`.

| Variante              | Cor                          | Uso                        |
| --------------------- | ---------------------------- | -------------------------- |
| `.badge-free`         | verde (fundo 14%, borda 35%) | "Grátis"                   |
| `.badge-tier`         | amarelo                      | "Plano pago / camada"      |
| `.report-status.s-publicado` | verde                 | Guia publicado             |
| `.report-status.s-em-breve`  | `--muted`             | Guia ainda não publicado   |
| `.race-badge`         | amarelo; `.done` verde; `.champ-live` vermelho com ponto pulsando | Estado da corrida |
| `.eyebrow .tag`       | `--dim` com borda            | Rótulo neutro              |

### 5.8 Callouts (avisos)

Borda esquerda de 3px + fundo da mesma cor a 7–8%, raio só à direita
(`0 10px 10px 0`), ícone à esquerda, `b` na cor do callout.

| Variante          | Cor      | Significado                        |
| ----------------- | -------- | ---------------------------------- |
| `.callout`        | amarelo  | Atenção / dica importante          |
| `.callout.blue`   | azul     | Informação / contexto              |
| `.callout.teal`   | verde    | Boa prática / confirmação          |
| `.lens-bridge`    | amarelo 6% | Ponte entre a lente de F1 e o técnico |
| `.narration`      | itálico `--muted`, borda amarela (verde no fechamento) | Texto de abertura/fechamento |

### 5.9 Código e terminal

- **Bloco com abas** (`.tabs` + `.code`): abas mono `.74rem` com raio só em
  cima; aba ativa cola no bloco (`top: 1px`). Bloco `--ink-2`, borda
  `--line-strong`, raio `0 10px 10px 10px`, rolagem horizontal.
- **Realce de sintaxe** (manual, sem lib):
  `.tk-key` azul · `.tk-val` `--code-fg` · `.tk-comment` `--dim` itálico ·
  `.tk-prompt` verde (o `$`) · `.tk-output` `--dim`.
- **Lista de comandos** (`.cmd`): uma linha por comando, mono `.8rem`, sem
  quebra, rolagem horizontal.
- `.code-note` abaixo do bloco em `.82rem` `--muted`.
- **Botão de copiar** (`CopyButton` em `GuideKit.tsx`): todo bloco de código
  e toda linha de comando têm um. No bloco, fica no canto superior direito
  com ícone + "Copiar" (só ícone ≤480px); na linha de comando, só ícone,
  grudado à direita mesmo com rolagem. Em blocos de terminal copia só os
  comandos (sem `$`, comentários ou saída). Ao copiar, fica verde com
  "Copiado" por 1,8s. O rótulo segue o idioma da página.

### 5.10 Tabelas

Cabeçalho em mono `.66–.7rem` MAIÚSCULAS tracking `.14–.16em` `--dim`, borda
inferior `--line-strong`; linhas com borda `--line`; células alinhadas no topo.
Primeira coluna em mono azul (termo técnico) ou Display (linha de comparação).
Colunas com sentido ganham cor no cabeçalho: verde = ganho/F1, `#ff6b81` = custo.
Sempre dentro de um wrapper com `overflow-x: auto` e `min-width` (420–520px).

### 5.11 Progresso

- **Barra** (`.progress-track`): 8px, pílula, fundo `--panel`, preenchimento
  com o gradiente da marca + "speed lines" animadas. Duas marcas verticais
  dividem a barra em **3 setores** (como os setores de uma volta).
- **Rótulos** (`.sectors`): S1 S2 S3 em mono `.6rem`; setor completo fica verde.
- **Rótulo** com ícone de velocímetro e o percentual em amarelo.
- **Etapa concluída**: bandeira quadriculada no rail + botão `.btn-done.on` verde.

### 5.12 Listas e passos

- `.handson` (passo a passo): numeração decimal com marcador mono azul.
- `.sc-steps`: número em círculo de 22px com borda azul.
- `.lens-list`: marcador mono amarelo.
- `.lens-check`: lista de verificação com ícone verde.
- `.sc-reading`: ordem de leitura em chips com contador amarelo.

### 5.13 Colapsáveis

`<details class="lens-collapse">` para glossário e limites da lente: borda
`--line-strong`, fundo `--wash`, raio 12px, seta em CSS que gira 90° ao abrir,
contador em pílula à direita. Começam fechados.

### 5.14 Figuras

`.lens-figure`: moldura **branca** (diagramas são desenhados em fundo claro),
borda `--line-strong`, raio 12px, `max-height: 460px`. Legenda em `.86rem`
`--muted` e crédito em mono `.68rem` `--dim`. Sequências em 2 colunas (1 no
celular). Ao menos uma figura por etapa; nunca foto de F1.

### 5.15 Estados de carregamento, vazio e erro

- **Skeleton** (`.race-skeleton`): ponto amarelo pulsando + texto mono `--muted`.
- **Offline** (`.race-offline`): mesmo layout, com `code` explicando a causa.
- **Vazio** (`.search-empty`, `.live-empty`): uma frase curta em `--dim`/`--muted`.
- **Erro** (`.search-error`): vermelho.
- **Ao vivo**: ponto vermelho pulsando (`.live-dot`) + filete vermelho no card.

---

## 6. Iconografia

- Componente único `Icon` (`src/components/Icon.tsx`): SVG com
  `fill="currentColor"` — a cor vem do CSS do pai. Tamanho padrão 16px.
- Ícone decorativo leva `aria-hidden`; ícone que significa algo sozinho
  recebe `label` (vira `role="img"` com `aria-label`).
- **Ícones de corrida**: Material Design Icons via Iconify — capacete
  (marca/ativo), bandeira quadriculada (concluído), velocímetro (progresso);
  carro de F1 do game-icons (CC-BY 3.0).
- **Ícones de UI**: `lucide-react` (`Terminal`, `ExternalLink`, `Info`, `Flag`…).
- Nenhum ícone desenhado à mão; toda licença registrada em
  `src/assets/icons/LICENSES.md`.
- Ícone em quadrado tingido: 40×40, raio 10px, fundo da cor a 14%.

---

## 7. Movimento

| Animação                | Duração / easing       | Onde                                   |
| ----------------------- | ---------------------- | -------------------------------------- |
| Transições de hover     | `.15–.2s ease`         | Botões, cards, links                   |
| Reveal ao rolar         | `.55s ease`, sobe 16px | `.reveal` → `.is-in`                   |
| Barra de progresso      | `.4s ease` na largura  | `.progress-fill`                       |
| Speed lines             | `.55s linear` infinito | Dentro da barra                        |
| Pista e carro           | `.7s`, `2.4s`, `1.8s`  | `.track-rail` (só ≥1080px)             |
| Bandeira balançando     | `1.4s ease-in-out`     | Etapa concluída                        |
| Luz de largada          | `.9s ease-out`, 1 vez  | Ao marcar etapa concluída              |
| Ponto ao vivo           | `1.6s ease-out`        | `.live-dot`                            |
| Splash de abertura      | `.8s ease` (fade)      | Primeira visita na home                |

Regras:

- Tudo que é infinito ou que desloca conteúdo para em
  `@media (prefers-reduced-motion: reduce)`, e `scroll-behavior` volta a `auto`.
- Animação nunca carrega informação sozinha (a bandeira concluída continua
  lá parada; o "ao vivo" tem texto).
- Hover desloca no máximo 3px.

---

## 8. Fundo e atmosfera

- Vídeo de fundo fixo com `opacity: .12`, `mix-blend-mode: screen`, sem
  controles nativos (escondidos em WebKit e Chromium). É decoração: a página
  funciona sem ele.
- Pista vertical com carro animado à direita nos guias (some ≤1080px).
- Na primeira visita: splash com o vídeo vívido, citação, crédito, botão de
  som e botão "Pular". Um script no `<head>` pinta a tela de preto antes do
  primeiro paint para evitar flash.

---

## 9. Acessibilidade

- Foco visível sempre: contorno amarelo de 2px (`:focus-visible`), branco
  sobre o vídeo.
- Contraste: corpo e títulos passam AAA; `--muted` e `--dim` passam AA;
  vermelho e azul em cards ficam abaixo de AA para texto pequeno (ver 2.8).
- Ícones com `aria-hidden` ou `aria-label` (nunca os dois).
- Toggle com estado usa `aria-pressed`.
- Âncoras compensam a nav fixa (`scroll-margin-top`).
- Seções longas usam `content-visibility: auto` com tamanho estimado de 760px
  para não pular o layout.
- Sem rolagem horizontal da página (`overflow-x: clip` em `html` e `body`);
  só código e tabelas rolam dentro de si.

---

## 10. Conteúdo e tom (UX writing)

- **Bilíngue**: toda página tem PT-BR e EN (rotas `/` e `/en/`), com toggle
  na nav. A estrutura das duas versões é idêntica.
- **Guias**: uma única seção "A lente de F1 deste guia" no início; as etapas
  são puramente técnicas, sem F1.
- **Tom calmo** de guia de estudo: sem narração de transmissão, sem euforia,
  sem corridas ou pilotos reais nos guias. (A home mostra o calendário e o
  placar reais da temporada; isso fica na home.)
- **Etapas numeradas** com dois dígitos (`01`, `02`…) em mono.
- Cada etapa termina com prática: laboratório, checklist ou passo a passo.
- Rótulos e botões curtos, em verbo ("ver relatórios", "como funciona", "marcar etapa como concluída").

---

## 11. Checklist para um componente novo

- [ ] Usa só tokens (`var(--…)`), nenhum hex novo
- [ ] Display em MAIÚSCULAS para títulos/botões; mono para dados e rótulos
- [ ] No máximo um elemento amarelo no bloco
- [ ] Borda 1px `--line` (ou `--line-strong` se for interativo)
- [ ] Raio da tabela 4.4
- [ ] Hover, foco e (se aplicável) desabilitado definidos
- [ ] Animação com fallback em `prefers-reduced-motion`
- [ ] Testado em 1440px, 880px e 375px, sem rolagem horizontal
- [ ] Texto que importa com contraste ≥ 4.5:1
- [ ] Versões PT e EN

---

## 12. Pendências encontradas

Coisas que hoje fogem das regras acima e valem uma limpeza:

1. **Nomes de token enganosos**: `--violet` é vermelho e `--k8s` é amarelo.
   Criar nomes por papel (`--accent`, `--info`, `--success`, `--danger`) e
   manter os antigos como alias.
2. **Hex soltos**: `#ff6b81`, `#C08452`, `#0a0a0a`, `#C7CEDD` (ver 2.6).
3. **Colisão com shadcn**: o bloco pitstop redefine `--muted` (hex), que o
   shadcn usa como cor de fundo em `oklch`. Componentes de `src/components/ui`
   que usam `bg-muted` vão pegar o cinza de texto. Hoje só o carrossel usa
   `components/ui`.
4. **`.brand-mark` duplicado** em `.brand` e `.home-brand` com as mesmas regras.
