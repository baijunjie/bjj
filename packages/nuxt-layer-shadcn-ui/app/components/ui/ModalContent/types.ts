import type { VNode } from 'vue'

export type ModalContentType = 'default' | 'success' | 'info' | 'help' | 'warn' | 'danger' | 'error'

export interface ModalContentProps {
  type?: ModalContentType
  icon?: string
  content?: string | VNode | HTMLElement
}
