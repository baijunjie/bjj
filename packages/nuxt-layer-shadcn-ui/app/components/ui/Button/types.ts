import type { ButtonVariants } from '../../shadcn/button'
import type { RouteLocationRaw } from 'vue-router'

export type ButtonVariant = ButtonVariants['variant']
export type ButtonSize = ButtonVariants['size']

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  rounded?: boolean
  icon?: string
  iconPosition?: 'start' | 'end'
  href?: string
  to?: RouteLocationRaw
  target?: string
  class?: ClassValue
}
