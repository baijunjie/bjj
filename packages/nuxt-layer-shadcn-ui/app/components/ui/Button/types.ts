import type { ButtonVariants } from '../../shadcn/button'
import type { ControlSize } from '../../../types/control'
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export type ButtonVariant = ButtonVariants['variant']
/**
 * A control size tier for text buttons, or `icon-<tier>` for a square icon-only
 * button (`icon` is the `default` tier). Heights match the inputs of the same tier.
 */
export type ButtonSize = ControlSize | 'icon-xs' | 'icon-sm' | 'icon-md' | 'icon' | 'icon-lg'

export interface ButtonProps {
  variant?: ButtonVariant
  /** Size tier. Unset follows the nearest ancestor's `data-control-size`, else `default`. */
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  rounded?: boolean
  icon?: string | Component
  iconPosition?: 'start' | 'end'
  href?: string
  to?: RouteLocationRaw
  target?: string
  class?: ClassValue
}
