import type { SVGProps } from 'react'
import { ICONS, type IconName } from '../assets/icons'

type IconProps = {
  name: IconName
  size?: number
  /** Passe um label só quando o ícone carrega significado sozinho. */
  label?: string
} & Omit<SVGProps<SVGSVGElement>, 'name'>

/** Renderiza um SVG de src/assets/icons herdando a cor do texto (currentColor). */
export function Icon({ name, size = 16, label, ...rest }: IconProps) {
  const def = ICONS[name]
  return (
    <svg
      viewBox={def.viewBox}
      width={size}
      height={size}
      fill="currentColor"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      <path d={def.path} />
    </svg>
  )
}
