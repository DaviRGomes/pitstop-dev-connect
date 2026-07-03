## Objetivo

Refinar o visual do guia com identidade F1 mais forte, usando os PNGs que você enviou e trocando o carro que segue o scroll por um carro **estático com detalhes animados** na pista lateral. O conteúdo das 8 etapas + seção de plataformas **não muda uma palavra**.

## Uso dos ícones enviados

- **S da Senna** (`pngwing.com.png`) → nova marca no topo da sidebar, no lugar do capacete atual. Vira o símbolo do "pitstop".
- **Capacete F1** (`capacete-f1.png`) → indicador de "etapa atual" na navegação lateral (substitui o pontinho amarelo).
- **Carro F1** (`formula.png`) → único carro na pista vertical à direita, parado no meio da pista, apontando pra cima (nariz em cima, traseira embaixo — como você pediu antes).
- **Logo F1** (`f1.png`) → assinatura no rodapé, ao lado do texto "pitstop.dev.br".

Todos entram como **PNG via Lovable Assets** (CDN), sem tentar recolorir — preservam o traço original.

## Carro estático + detalhes animados

O carro **fica parado** numa posição fixa da pista lateral. O que se mexe:

1. **Rodas girando** — dois discos girando em loop atrás do PNG (spin infinito).
2. **Chama do escapamento** — pequeno flame laranja/amarelo pulsando abaixo do carro (traseira).
3. **Linhas de velocidade** — traços na pista descendo em loop (efeito de asfalto passando), reforçando que o carro está "voando parado".
4. **Halo de calor** — glow amarelo Senna sutil ao redor do carro, pulsando devagar.

Nada disso depende de scroll. Tudo em CSS `@keyframes`.

## Refino visual geral (sem tocar no conteúdo)

- **Sidebar**: marca redesenhada com o S da Senna em amarelo #FFD400 sobre fundo preto, tipografia mais condensada (Saira Condensed já carregada).
- **Nav ativa**: item ativo ganha barra lateral vermelha McLaren + capacete em vez do ponto.
- **Hero**: título com tratamento mais "livery" — número grande estilo carro de corrida ao lado do H1, e uma faixa de bandeira quadriculada fininha embaixo.
- **Cards de etapa**: cantos com corte diagonal (clip-path) lembrando adesivo de patrocínio, borda amarela no card ativo.
- **Botão "marcar concluída"**: quando ligado, vira bandeirada quadriculada animada (sway).
- **Rodapé**: logo F1 + assinatura discreta.

Paleta mantida: Senna #FFD400, McLaren #E4002B, Brasil #00A651, fundo escuro.

## O que NÃO muda

- Texto das 8 lições (`src/data/lessons.ts`) — intocado.
- Estrutura de componentes (`LessonSection`, `ExampleTabs`, `CommandList`, `PlatformsSection`) — intocada.
- Progresso salvo em localStorage — intocado.
- Barra de progresso com sectors S1/S2/S3 no hero — mantida.

## Arquivos que serão tocados

- `src/assets/brand/` — 4 novos `.asset.json` (senna-s, helmet, f1-car, f1-logo) via `lovable-assets create`.
- `src/routes/index.tsx` — remove `carPos` + listener de scroll do carro; troca `<Icon name="helmet">` / `<Icon name="f1Car">` pelos `<img>` dos assets; ajusta brand e footer.
- `src/styles.css` — novas keyframes (`wheel-spin`, `exhaust-flame`, `speed-lines`, `heat-glow`), refino de `.brand`, `.nav a.active`, `.htitle`, `.section`, `.btn-done`, `.track-rail`, `.track-car`.
- `src/assets/icons/index.ts` + `LICENSES.md` — remove `f1Car` e `racingHelmet` (não usados mais); `checkeredFlag` e `speedometer` continuam.

## Notas técnicas

- Assets vão pra `src/assets/brand/*.png.asset.json` e são importados como `import sennaS from "@/assets/brand/senna-s.png.asset.json"` → `<img src={sennaS.url} />`.
- PNG original de `formula.png` já está no ângulo lateral correto — aplico `rotate(-90deg)` no CSS pra deixar o nariz pra cima.
- Rodas e chama são divs absolutos posicionados por cima do `<img>` do carro; para acertar a posição, uso `background-image` com o mesmo PNG num wrapper e os overlays em coordenadas fixas ajustadas pra 88px de altura.
