import type { Component } from 'vue'

export type AlertType = 'default' | 'success' | 'info' | 'help' | 'warn' | 'danger'

export interface AlertProps {
  type?: AlertType
  /** Pass `null` to explicitly hide the icon; leave undefined to use the type's default. */
  icon?: string | Component | null
  /** Bold heading line. Slot `#title` takes precedence. */
  title?: string
  /** Description text. Default slot takes precedence. */
  description?: string
  class?: ClassValue
}
