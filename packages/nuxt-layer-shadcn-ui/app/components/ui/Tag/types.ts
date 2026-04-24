export type TagColor = 'default' | 'primary' | 'success' | 'info' | 'help' | 'warn' | 'danger'
export type TagVariant = 'solid' | 'soft' | 'bordered' | 'flat'

export interface TagProps {
  color?: TagColor
  variant?: TagVariant
  class?: ClassValue
}
