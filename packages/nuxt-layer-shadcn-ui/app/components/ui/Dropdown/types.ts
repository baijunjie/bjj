import type { DropdownMenuContentProps } from 'reka-ui'
import type { Component, ComputedRef, InjectionKey, Slots } from 'vue'

/** Semantic color, matches project-wide color scheme. */
export type DropdownItemColor = 'default' | 'primary' | 'success' | 'info' | 'help' | 'warn' | 'danger'

export interface DropdownActionItem {
  /** Item kind. Defaults to 'action' when omitted. */
  type?: 'action'
  /** Foreground color of the whole item (label + focus background). */
  color?: DropdownItemColor
  /** Override icon color independently of `color`. */
  iconColor?: DropdownItemColor
  /** Display text shown in the item. */
  label?: string
  /** Icon name (lucide kebab-case) or a Vue component. */
  icon?: string | Component
  /** Click handler. Ignored when `subMenus` is set. */
  command?: () => void
  /** Disabled items are non-interactive and visually muted. */
  disabled?: boolean
  /** Renders a trailing check icon to indicate selected/active state. */
  active?: boolean
  /** Extra class merged onto the item element. */
  class?: ClassValue
  /** Render the item as a link. Ignored when `subMenus` is set. */
  href?: string
  /** Anchor target. Only meaningful with `href`. */
  target?: string
  /** Nested sub-menu items. When provided, `command` / `href` are ignored. */
  subMenus?: DropdownItem[]
}

export interface DropdownSeparatorItem {
  /** Item kind. */
  type: 'separator'
}

export interface DropdownLabelItem {
  /** Item kind. */
  type: 'label'
  /** Group header text. */
  label: string
}

/**
 * Custom action item: rendered as DropdownMenuItem, content comes from
 * a named slot (`slot` field). Arbitrary extra fields are passed through
 * to the slot as `item` for rendering.
 */
export interface DropdownCustomActionItem {
  /** Item kind. */
  type: 'custom-action'
  /** Foreground color of the whole item (label + focus background). */
  color?: DropdownItemColor
  /** Name of the slot that renders this item's content. */
  slot: string
  /** Click handler. */
  command?: () => void
  /** Disabled items are non-interactive and visually muted. */
  disabled?: boolean
  /** Renders a trailing check icon to indicate selected/active state. */
  active?: boolean
  /** Extra class merged onto the item element. */
  class?: ClassValue
  /** Arbitrary extra data forwarded to the slot as `item`. */
  [field: string]: unknown
}

/**
 * Custom label item: rendered as DropdownMenuLabel, content comes from
 * a named slot (`slot` field). Arbitrary extra fields are passed through
 * to the slot as `item` for rendering.
 */
export interface DropdownCustomLabelItem {
  /** Item kind. */
  type: 'custom-label'
  /** Name of the slot that renders this label's content. */
  slot: string
  /** Extra class merged onto the label element. */
  class?: ClassValue
  /** Arbitrary extra data forwarded to the slot as `item`. */
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
  /** Menu items to display in the dropdown. Not required when using the `popup` slot. */
  menus?: DropdownItem[]
  /** Trigger mode for showing the dropdown. Defaults to 'hover'. */
  trigger?: 'click' | 'hover'
  /** Extra class for the dropdown content container. */
  class?: ClassValue
  /** Min-width applied to the root content and all sub-menus. Numbers are treated as px. */
  minWidth?: string | number
}

/** Context shared from the root Dropdown to nested MenuItems via provide/inject. */
export interface DropdownContext {
  /** Closes the entire dropdown (root + any open sub-menus). */
  hide: () => void
  /** The root Dropdown's slots, used to render `custom-label` / `custom-action` items. */
  slots: Slots
  /** Inline style applied to root content and all sub-menus (currently min-width). */
  contentStyle: ComputedRef<{ minWidth?: string } | undefined>
}

/** Provide/inject key for the shared DropdownContext. */
export const dropdownContextKey: InjectionKey<DropdownContext> = Symbol('dropdown-context')
