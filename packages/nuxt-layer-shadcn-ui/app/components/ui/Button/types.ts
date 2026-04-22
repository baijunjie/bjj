import type { ButtonVariants } from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/button'
import type { RouteLocationRaw } from 'vue-router'

export interface ButtonProps extends /* @vue-ignore */ ButtonVariants {
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
