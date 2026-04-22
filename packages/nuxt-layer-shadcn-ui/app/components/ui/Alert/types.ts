import type { Component } from 'vue'

export type AlertType = 'default' | 'success' | 'info' | 'help' | 'warn' | 'danger'

export interface AlertProps {
  type?: AlertType
  icon?: string | Component
  class?: ClassValue
}
