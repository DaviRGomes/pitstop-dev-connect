// Ícones de corrida — baixados de biblioteca (Material Design Icons via Iconify).
// NÃO desenhados à mão. Fonte, autor e licença de cada um em ./LICENSES.md.
// Renderização: src/components/Icon.tsx (herda currentColor).

export type IconDef = { viewBox: string; path: string }

// mdi:racing-helmet — https://icon-sets.iconify.design/mdi/racing-helmet/
export const racingHelmet: IconDef = {
  viewBox: '0 0 24 24',
  path: 'M2.2 11.2c-.2 2.4.5 4.4 2 6.2S7.7 20 10.1 20h10c.5 0 1-.2 1.4-.6s.6-.9.6-1.4v-.8c0-.6-.1-1.3-.2-2.2h-8.2c-1 0-1.8-.4-2.5-1.1s-1.1-1.6-1.1-2.5c0-1.6.7-2.7 2.2-3.3L17.1 6c-1.7-1.2-3.7-1.9-6-2c-2.2-.2-4.2.5-6 1.9S2.4 9 2.2 11.2m9.9.2c0 .4.2.8.5 1.1s.7.5 1.1.5h7.8c-.6-2.2-1.5-4-2.8-5.4l-5.6 2.3c-.7.2-1 .7-1 1.5',
}

// mdi:flag-checkered — https://icon-sets.iconify.design/mdi/flag-checkered/
export const flagCheckered: IconDef = {
  viewBox: '0 0 24 24',
  path: 'M14.4 6H20v10h-7l-.4-2H7v7H5V4h9zm-.4 8h2v-2h2v-2h-2V8h-2v2l-1-2V6h-2v2H9V6H7v2h2v2H7v2h2v-2h2v2h2v-2l1 2zm-3-4V8h2v2zm3 0h2v2h-2z',
}

// mdi:speedometer — https://icon-sets.iconify.design/mdi/speedometer/
export const speedometer: IconDef = {
  viewBox: '0 0 24 24',
  path: 'M12 16a3 3 0 0 1-3-3c0-1.12.61-2.1 1.5-2.61l9.71-5.62l-5.53 9.58c-.5.98-1.51 1.65-2.68 1.65m0-13c1.81 0 3.5.5 4.97 1.32l-2.1 1.21C14 5.19 13 5 12 5a8 8 0 0 0-8 8c0 2.21.89 4.21 2.34 5.65h.01c.39.39.39 1.02 0 1.41s-1.03.39-1.42.01A9.97 9.97 0 0 1 2 13A10 10 0 0 1 12 3m10 10c0 2.76-1.12 5.26-2.93 7.07c-.39.38-1.02.38-1.41-.01a.996.996 0 0 1 0-1.41A7.95 7.95 0 0 0 20 13c0-1-.19-2-.54-2.9L20.67 8C21.5 9.5 22 11.18 22 13',
}

// game-icons:f1-car — https://icon-sets.iconify.design/game-icons/f1-car/ (CC-BY 3.0, Lorc)
// Vista lateral, nariz apontando pra direita (X+). Rotacionamos no CSS quando precisar vertical.
export const f1Car: IconDef = {
  viewBox: '0 0 512 512',
  path: 'M355.975 292.25a24.82 24.82 0 1 0 24.82-24.81a24.84 24.84 0 0 0-24.82 24.81m-253-24.81a24.81 24.81 0 1 1-24.82 24.81a24.84 24.84 0 0 1 24.81-24.81zm-76.67-71.52h67.25l-13.61 49.28l92-50.28h57.36l1.26 34.68l32 14.76l11.74-14.44h15.62l3.16 16c137.56-13 192.61 29.17 192.61 29.17s-7.52 5-25.93 8.39c-3.88 3.31-3.66 14.44-3.66 14.44h24.2v16h-52v-27.48c-1.84.07-4.45.41-7.06.47a40.81 40.81 0 1 0-77.25 23h-204.24a40.81 40.81 0 1 0-77.61-17.67c0 1.24.06 2.46.17 3.67h-36z',
}

export const ICONS = {
  helmet: racingHelmet,
  checkeredFlag: flagCheckered,
  speedometer,
  f1Car,
} as const

export type IconName = keyof typeof ICONS
