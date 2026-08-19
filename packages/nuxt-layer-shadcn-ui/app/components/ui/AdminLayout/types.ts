import type { Component } from 'vue'
import type { DropdownItem } from '../Dropdown/types'
import type { SidebarLayoutMenuItem } from '../SidebarLayout/types'

export type AdminLayoutSidebarMenuItem = SidebarLayoutMenuItem

export interface AdminLayoutSidebarDropdownProfile {
  title?: string
  subtitle?: string
  icon?: string | Component
  image?: string
  /** Trailing affordance icon (lucide name or component). Omitted → not rendered. */
  actionIcon?: string | Component
}

/**
 * A DropdownItem, or a 'profile' variant rendering an avatar + title + subtitle.
 * With a `command` the profile is clickable (shows its `actionIcon`); without,
 * it is a static label.
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
