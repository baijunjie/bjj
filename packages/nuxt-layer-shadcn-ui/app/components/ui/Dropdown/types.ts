import type { DropdownMenuContentProps } from 'reka-ui'
import type { Component } from 'vue'

export type DropdownItemColor = 'default' | 'primary' | 'success' | 'info' | 'help' | 'warn' | 'danger'

export interface DropdownActionItem {
  /** Defaults to 'action' when omitted. */
  type?: 'action'
  /** Semantic color, matches project-wide color scheme. Defaults to 'default'. */
  color?: DropdownItemColor
  label?: string
  icon?: string | Component
  command?: () => void
  disabled?: boolean
  active?: boolean
  class?: ClassValue
  href?: string
  target?: string
}

export interface DropdownSeparatorItem {
  type: 'separator'
}

export interface DropdownLabelItem {
  type: 'label'
  label: string
}

/**
 * Custom action item: rendered as DropdownMenuItem, content comes from
 * a named slot (`slot` field). Arbitrary extra fields are passed through
 * to the slot as `item` for rendering.
 */
export interface DropdownCustomActionItem {
  type: 'custom-action'
  /** Semantic color, matches project-wide color scheme. Defaults to 'default'. */
  color?: DropdownItemColor
  slot: string
  command?: () => void
  disabled?: boolean
  active?: boolean
  class?: ClassValue
  [field: string]: unknown
}

/**
 * Custom label item: rendered as DropdownMenuLabel, content comes from
 * a named slot (`slot` field). Arbitrary extra fields are passed through
 * to the slot as `item` for rendering.
 */
export interface DropdownCustomLabelItem {
  type: 'custom-label'
  slot: string
  class?: ClassValue
  [field: string]: unknown
}

/**
 * Menu item discriminated by `type`.
 *
 * - 'action' (default): built-in action rendering.
 * - 'separator': visual divider.
 * - 'label': built-in group header.
 * - 'custom-action' / 'custom-label': rendered via named `slot`, allowing
 *   arbitrary extra fields that the slot consumer can access via `item`.
 */
export type DropdownItem
  = | DropdownActionItem
    | DropdownSeparatorItem
    | DropdownLabelItem
    | DropdownCustomActionItem
    | DropdownCustomLabelItem

export interface DropdownProps extends /* @vue-ignore */ DropdownMenuContentProps {
  /** Menu items to display in the dropdown (not required when using popup slot) */
  menus?: DropdownItem[]
  /** Trigger mode for showing the dropdown. Defaults to 'hover'. */
  trigger?: 'click' | 'hover'
  /** Extra class for the dropdown content container. */
  class?: ClassValue
}
