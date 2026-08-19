import type { SidebarLayoutMenuItem } from './types'

/** Identity for key-based selection; an explicit `key` is only needed when neither fallback is unique. */
export function sidebarMenuItemKey (item: SidebarLayoutMenuItem): string {
  return item.key ?? item.href ?? item.label
}

export function findSidebarMenuItem (
  menus: SidebarLayoutMenuItem[],
  key: string,
): SidebarLayoutMenuItem | undefined {
  for (const item of menus) {
    if (sidebarMenuItemKey(item) === key) return item
    const child = item.children && findSidebarMenuItem(item.children, key)
    if (child) return child
  }
  return undefined
}

export function firstSidebarMenuItemKey (
  menus: SidebarLayoutMenuItem[],
): string | undefined {
  for (const item of menus) {
    if (!item.children?.length) return sidebarMenuItemKey(item)
    const key = firstSidebarMenuItemKey(item.children)
    if (key) return key
  }
  return undefined
}
