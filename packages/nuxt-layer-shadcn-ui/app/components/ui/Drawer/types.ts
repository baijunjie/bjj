import type { ButtonVariants } from '../../shadcn/button'

export type DrawerSide = 'top' | 'right' | 'bottom' | 'left'

export type DrawerAction = 'confirm' | 'cancel'

export type DrawerBeforeClose = (action: DrawerAction) => boolean | undefined | Promise<unknown>

export interface DrawerProps {
  visible?: boolean
  loading?: boolean
  disabled?: boolean
  confirmDisabled?: boolean
  modal?: boolean
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
  beforeClose?: DrawerBeforeClose
  class?: ClassValue
}
