import type { Component, VNode } from 'vue'

export type ModalContentType = 'default' | 'success' | 'info' | 'help' | 'warn' | 'danger' | 'error'

export interface ModalContentProps {
  type?: ModalContentType
  icon?: string | Component
  content?: string | VNode | HTMLElement
}
