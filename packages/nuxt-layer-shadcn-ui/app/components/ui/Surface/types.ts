export type SurfaceColor = 'default' | 'primary' | 'success' | 'info' | 'help' | 'warn' | 'danger'
export type SurfaceVariant = 'solid' | 'soft' | 'bordered' | 'flat'

export interface SurfaceProps {
  color?: SurfaceColor
  variant?: SurfaceVariant
  class?: ClassValue
}
