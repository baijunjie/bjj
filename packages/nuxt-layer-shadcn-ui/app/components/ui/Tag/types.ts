export type TagColor = 'default' | 'primary' | 'success' | 'info' | 'help' | 'warn' | 'danger'
export type TagVariant = 'solid' | 'soft' | 'bordered' | 'flat'
export type TagSize = 'sm' | 'md'

export interface TagProps {
  color?: TagColor
  variant?: TagVariant
  size?: TagSize
  class?: ClassValue
}
