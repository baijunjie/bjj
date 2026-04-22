export interface AvatarProps {
  image?: string
  label?: string
  fallbackLabel?: string
  size?: 'small' | 'normal' | 'large' | 'xlarge'
  shape?: 'circle' | 'square'
  class?: ClassValue
}
