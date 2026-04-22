export type TagType = 'default' | 'success' | 'info' | 'help' | 'warn' | 'danger'
export type TagVariant = 'solid' | 'soft' | 'bordered' | 'flat'

export interface TagProps {
  type?: TagType
  variant?: TagVariant
  class?: ClassValue
}
