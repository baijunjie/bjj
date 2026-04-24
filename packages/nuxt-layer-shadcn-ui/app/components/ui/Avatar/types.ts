export type AvatarSize = 'small' | 'normal' | 'large' | 'xlarge'
export type AvatarShape = 'circle' | 'square'

export interface AvatarProps {
  image?: string
  label?: string
  fallbackLabel?: string
  size?: AvatarSize
  shape?: AvatarShape
  class?: ClassValue
}
