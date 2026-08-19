import type { SidebarLayoutMenuItem } from '../SidebarLayout/types'

export interface SidebarModalPaneSlotProps {
  active: string
  /** The selected menu item, when `active` still points at one. */
  item?: SidebarLayoutMenuItem
}

export interface SidebarModalProps {
  menus: SidebarLayoutMenuItem[]
  visible?: boolean
  /** Key of the selected menu item. Omitted → the first selectable item. */
  active?: string
  /** Render a search field above the menu, filtering items by label and group. */
  searchable?: boolean
  searchPlaceholder?: string
  /** Accessible name of the dialog, rendered for screen readers only. */
  title?: string
  modal?: boolean
  showClose?: boolean
  closeOnClickOutside?: boolean
  /** Width of the menu column, as a CSS length. */
  sidebarWidth?: string
  contentClass?: ClassValue
  class?: ClassValue
}
