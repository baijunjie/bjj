export type SurfaceType = 'default' | 'success' | 'info' | 'help' | 'warn' | 'danger'
export type SurfaceVariant = 'solid' | 'soft' | 'bordered' | 'flat'

export interface SurfaceProps {
  type?: SurfaceType
  variant?: SurfaceVariant
  class?: ClassValue
}
