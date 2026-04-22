import type { NuxtLinkProps } from '#app'
import type { RouteLocationRaw } from 'vue-router'

export interface WebLinkProps extends /* @vue-ignore */ NuxtLinkProps {
  href?: string
  to?: RouteLocationRaw
  target?: string
  unstyled?: boolean
  externalIcon?: boolean
  class?: ClassValue
}
