import type { SidebarLayoutMenuItem } from '../SidebarLayout/types'

export interface SidebarModalPaneSlotProps {
  active: string
  /** The selected menu item, when `active` still points at one. */
  item?: SidebarLayoutMenuItem
}

/**
 * Menus to list for the current keyword. Receives the keyword as typed (trimmed),
 * so a business search can look beyond labels — pane content, a remote index —
 * and return whatever entries should show.
 */
export type SidebarModalFilter = (
  menus: SidebarLayoutMenuItem[],
  keyword: string,
) => SidebarLayoutMenuItem[]

export interface SidebarModalProps {
  menus: SidebarLayoutMenuItem[]
  visible?: boolean
  /** Key of the selected menu item. Omitted → the first selectable item. */
  active?: string
  /**
   * Render a search field between `#header` and the menu. `true`: filter menus by
   * label and group; function: custom filter (replaces the built-in one).
   */
  searchable?: boolean | SidebarModalFilter
  /** Search keyword. Use `v-model:search` to read or drive it from the outside. */
  search?: string
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
