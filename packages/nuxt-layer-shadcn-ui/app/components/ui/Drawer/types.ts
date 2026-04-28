import type { ButtonVariants } from '../../shadcn/button'

export type DrawerSide = 'top' | 'right' | 'bottom' | 'left'

export interface DrawerProps {
  visible?: boolean
  loading?: boolean
  disabled?: boolean
  confirmDisabled?: boolean
  showCancel?: boolean
  showClose?: boolean
  closeOnClickOutside?: boolean
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
