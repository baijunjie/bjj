import type { Component } from 'vue'

export interface SidebarLayoutMenuItem {
  label: string
  /** Identity used for key-based selection. Falls back to `href`, then `label`. */
  key?: string
  icon?: string | Component
  href?: string
  command?: () => void
  group?: string
  expanded?: boolean
  children?: SidebarLayoutMenuItem[]
  actions?: SidebarLayoutMenuItem[]
}

export interface SidebarLayoutProps {
  menus: SidebarLayoutMenuItem[]
  /** Key of the selected item. Omitted → the active item is matched by route. */
  active?: string
  /** Placeholder shown when `menus` is empty. */
  emptyText?: string
  /** Fill the parent instead of the viewport: never collapses, no rail or mobile trigger. */
  embedded?: boolean
  variant?: 'sidebar' | 'floating' | 'inset'
  /** Collapse behaviour of the sidebar. Ignored while `embedded`. */
  collapsible?: 'offcanvas' | 'icon' | 'none'
  /** Width of the sidebar, as a CSS length. */
  sidebarWidth?: string
  contentClass?: ClassValue
  class?: ClassValue
}
