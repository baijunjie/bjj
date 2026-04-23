import type { DropdownItem } from '../Dropdown/types'

export interface AdminLayoutSidebarMenuItem {
  label: string
  icon?: string
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
  icon?: string
  image?: string
}

/**
 * Menu item for the SidebarDropdown.
 *
 * Union of Dropdown's DropdownItem with an extra 'profile' variant that renders
 * a profile header (avatar + title + subtitle) as a label inside the menu.
 */
export type AdminLayoutSidebarDropdownMenuItem
  = | DropdownItem
    | ({ type: 'profile' } & AdminLayoutSidebarDropdownProfile)

export interface AdminLayoutSidebarDropdownConfig {
  profile?: AdminLayoutSidebarDropdownProfile | null
  menuItems?: AdminLayoutSidebarDropdownMenuItem[]
}

export interface AdminLayoutProps {
  menus: AdminLayoutSidebarMenuItem[]
  headerDropdown?: AdminLayoutSidebarDropdownConfig
  footerDropdown?: AdminLayoutSidebarDropdownConfig
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}
