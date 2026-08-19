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

/** Selectable (childless) items in listing order, with grouping flattened away. */
export function flattenSidebarMenuItems (
  menus: SidebarLayoutMenuItem[],
): SidebarLayoutMenuItem[] {
  return menus.flatMap(item =>
    item.children?.length ? flattenSidebarMenuItems(item.children) : [ item ],
  )
}

export function firstSidebarMenuItemKey (
  menus: SidebarLayoutMenuItem[],
): string | undefined {
  const [ first ] = flattenSidebarMenuItems(menus)
  return first && sidebarMenuItemKey(first)
}
