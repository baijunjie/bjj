export type TagColor = 'default' | 'primary' | 'success' | 'info' | 'help' | 'warn' | 'danger'
export type TagVariant = 'solid' | 'soft' | 'bordered' | 'flat'
/** `xs` keeps `sm`'s font and only tightens the padding */
export type TagSize = 'xs' | 'sm' | 'md'

export interface TagProps {
  color?: TagColor
  variant?: TagVariant
  size?: TagSize
  /** Fully rounded (pill) corners */
  rounded?: boolean
  /** Render a remove (×) button after the content; clicking it emits `close`. */
  closable?: boolean
  /** Accessible name of the remove button. Defaults to the localized "Remove". */
  closeLabel?: string
  class?: ClassValue
}
