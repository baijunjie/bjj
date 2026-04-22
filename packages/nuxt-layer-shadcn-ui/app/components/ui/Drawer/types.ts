import type { ButtonVariants } from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/button'

export type DrawerSide = 'top' | 'right' | 'bottom' | 'left'

export interface DrawerProps {
  visible?: boolean
  loading?: boolean
  disabled?: boolean
  confirmDisabled?: boolean
  showCancel?: boolean
  showClose?: boolean
  hideHeader?: boolean
  hideFooter?: boolean
  side?: DrawerSide
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: ButtonVariants['variant']
  cancelVariant?: ButtonVariants['variant']
  class?: ClassValue
}
