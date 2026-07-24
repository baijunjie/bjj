import type { Component } from 'vue'
import type { DropdownItem } from '../Dropdown/types'

export interface AdminLayoutSidebarMenuItem {
  label: string
  icon?: string | Component
  href?: string
  command?: () => void
  group?: string
  expanded?: boolean
  children?: AdminLayoutSidebarMenuItem[]
  actions?: AdminLayoutSidebarMenuItem[]
}

export interface AdminLayoutSidebarDropdownProfile {
  title?: string
  subtitle?: string
  icon?: string | Component
  image?: string
}

/**
 * Menu item for the SidebarDropdown.
 *
 * Union of Dropdown's DropdownItem with an extra 'profile' variant that renders
 * a profile header (avatar + title + subtitle) inside the menu. Without a
 * `command` it is a static label; with one it becomes a clickable item (the
 * profile is rendered with a trailing switch affordance).
 */
export type AdminLayoutSidebarDropdownMenuItem
  = | DropdownItem
    | ({ type: 'profile', command?: () => void } & AdminLayoutSidebarDropdownProfile)

export interface AdminLayoutSidebarDropdownConfig {
  profile?: AdminLayoutSidebarDropdownProfile | null
  menuItems?: AdminLayoutSidebarDropdownMenuItem[]
}

export interface AdminLayoutProps {
  menus: AdminLayoutSidebarMenuItem[]
  /** Brand name shown next to the logo in the sidebar header (hidden when collapsed). */
  brandName?: string
  footerDropdown?: AdminLayoutSidebarDropdownConfig
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
  contentClass?: ClassValue
}
