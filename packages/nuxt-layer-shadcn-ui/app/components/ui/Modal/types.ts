import type { ButtonVariants } from '../../shadcn/button'
import type { ModalContentProps } from '../ModalContent/types'

export interface ModalProps {
  visible?: boolean
  loading?: boolean
  disabled?: boolean
  confirmDisabled?: boolean
  showCancel?: boolean
  showClose?: boolean
  hideHeader?: boolean
  hideFooter?: boolean
  alignCenter?: boolean
  title?: string
  description?: string
  content?: ModalContentProps['content']
  confirmText?: string
  cancelText?: string
  confirmVariant?: ButtonVariants['variant']
  cancelVariant?: ButtonVariants['variant']
  type?: ModalContentProps['type']
  class?: ClassValue
}
