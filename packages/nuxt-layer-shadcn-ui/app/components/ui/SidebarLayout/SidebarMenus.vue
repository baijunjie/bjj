<script setup lang="ts">
import type { SidebarLayoutMenuItem } from './types'
import { sidebarMenuItemKey } from './utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../shadcn/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../shadcn/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../../shadcn/sidebar'

const props = defineProps<{
  menus: SidebarLayoutMenuItem[]
  /** Key of the selected item. Omitted → the active item is matched by route. */
  active?: string
  emptyText?: string
}>()

const emit = defineEmits<{
  select: [item: SidebarLayoutMenuItem]
}>()

const route = useRoute()

const isExternal = (href: string) => /^https?:\/\//.test(href)

const navGroups = computed(() => {
  const groups: { label?: string, items: SidebarLayoutMenuItem[] }[] = []
  const groupMap = new Map<string | undefined, SidebarLayoutMenuItem[]>()

  for (const item of props.menus) {
    const key = item.group
    if (!groupMap.has(key)) {
      const items: SidebarLayoutMenuItem[] = []
      groupMap.set(key, items)
      groups.push({ label: key, items })
    }
    groupMap.get(key)!.push(item)
  }

  return groups
})

function isActive (item: SidebarLayoutMenuItem): boolean {
  if (props.active !== undefined) return sidebarMenuItemKey(item) === props.active
  const href = item.href
  if (!href || isExternal(href)) return false
  return route.path.startsWith(href)
}

function isLink (item: SidebarLayoutMenuItem): boolean {
  return !!item.href
}

function hasActiveChild (item: SidebarLayoutMenuItem): boolean {
  return item.children?.some(isActive) ?? false
}

function handleSelect (item: SidebarLayoutMenuItem) {
  emit('select', item)
}
</script>

<template>
  <SidebarGroup
    v-for="(group, groupIndex) in navGroups"
    :key="groupIndex"
  >
    <SidebarGroupLabel v-if="group.label">
      {{ group.label }}
    </SidebarGroupLabel>
    <SidebarMenu>
      <template
        v-for="item in group.items"
        :key="sidebarMenuItemKey(item)"
      >
        <!-- Collapsible item with children -->
        <Collapsible
          v-if="item.children?.length"
          asChild
          :defaultOpen="item.expanded ?? hasActiveChild(item)"
          class="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton :tooltip="item.label">
                <Icon
                  v-if="item.icon"
                  :name="item.icon"
                />
                <span>{{ item.label }}</span>
                <Icon
                  name="chevron-right"
                  class="
                    ml-auto transition-transform duration-200
                    group-data-[state=open]/collapsible:rotate-90
                  "
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem
                  v-for="child in item.children"
                  :key="sidebarMenuItemKey(child)"
                >
                  <!-- The vendored sub-button renders `data-active=""` when active while its
                       built-in styles only match `data-active="true"`, so the active styles
                       are re-applied here via an attribute-presence selector. -->
                  <SidebarMenuSubButton
                    :asChild="isLink(child)"
                    :isActive="isActive(child)"
                    class="
                      data-active:bg-sidebar-accent
                      data-active:text-sidebar-accent-foreground
                      cursor-pointer
                    "
                    @click="handleSelect(child)"
                  >
                    <WebLink
                      v-if="isLink(child)"
                      :href="child.href"
                      unstyled
                    >
                      <span>{{ child.label }}</span>
                    </WebLink>
                    <span v-else>
                      {{ child.label }}
                    </span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        <!-- Leaf item, optionally with an actions dropdown -->
        <SidebarMenuItem v-else>
          <SidebarMenuButton
            :asChild="isLink(item)"
            :isActive="isActive(item)"
            :tooltip="item.label"
            class="cursor-pointer"
            @click="handleSelect(item)"
          >
            <WebLink
              v-if="isLink(item)"
              :href="item.href"
              unstyled
            >
              <Icon
                v-if="item.icon"
                :name="item.icon"
              />
              <span>{{ item.label }}</span>
              <Icon
                v-if="isExternal(item.href!)"
                name="external-link"
                class="size-3.5 text-sidebar-foreground/50 ml-auto"
              />
            </WebLink>
            <template v-else>
              <Icon
                v-if="item.icon"
                :name="item.icon"
              />
              <span>{{ item.label }}</span>
            </template>
          </SidebarMenuButton>

          <DropdownMenu v-if="item.actions">
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction showOnHover>
                <Icon name="ellipsis" />
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="start"
              class="min-w-48 rounded-lg"
            >
              <DropdownMenuItem
                v-for="action in item.actions"
                :key="action.label"
                @click="action.href ? undefined : action.command?.()"
              >
                <WebLink
                  v-if="isLink(action)"
                  :href="action.href"
                  unstyled
                  class="gap-2 flex items-center"
                >
                  <Icon
                    v-if="action.icon"
                    :name="action.icon"
                    class="text-muted-foreground"
                  />
                  <span>{{ action.label }}</span>
                </WebLink>
                <template v-else>
                  <Icon
                    v-if="action.icon"
                    :name="action.icon"
                    class="text-muted-foreground"
                  />
                  <span>{{ action.label }}</span>
                </template>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </template>
    </SidebarMenu>
  </SidebarGroup>

  <div
    v-if="emptyText && !navGroups.length"
    class="px-2 py-6 text-sm text-muted-foreground text-center"
  >
    {{ emptyText }}
  </div>
</template>
