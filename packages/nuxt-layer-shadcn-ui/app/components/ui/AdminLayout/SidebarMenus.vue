<script setup lang="ts">
import type { AdminLayoutSidebarMenuItem } from './types'
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
  menus: AdminLayoutSidebarMenuItem[]
}>()

const route = useRoute()

const isExternal = (href: string) => /^https?:\/\//.test(href)

const navGroups = computed(() => {
  const groups: { label?: string, items: AdminLayoutSidebarMenuItem[] }[] = []
  const groupMap = new Map<string | undefined, AdminLayoutSidebarMenuItem[]>()

  for (const item of props.menus) {
    const key = item.group
    if (!groupMap.has(key)) {
      const items: AdminLayoutSidebarMenuItem[] = []
      groupMap.set(key, items)
      groups.push({ label: key, items })
    }
    groupMap.get(key)!.push(item)
  }

  return groups
})

function isActive (href?: string): boolean {
  if (!href || isExternal(href)) return false
  return route.path.startsWith(href)
}

function isLink (item: AdminLayoutSidebarMenuItem): boolean {
  return !!item.href
}

function hasActiveChild (item: AdminLayoutSidebarMenuItem): boolean {
  return item.children?.some(child => isActive(child.href)) ?? false
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
        :key="item.label"
      >
        <!-- Collapsible item with children -->
        <Collapsible
          v-if="item.children"
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
                  :key="child.label"
                >
                  <SidebarMenuSubButton
                    :asChild="isLink(child)"
                    :isActive="isActive(child.href)"
                  >
                    <WebLink
                      v-if="isLink(child)"
                      :href="child.href"
                      unstyled
                    >
                      <span>{{ child.label }}</span>
                    </WebLink>
                    <span
                      v-else
                      @click="child.command?.()"
                    >
                      {{ child.label }}
                    </span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        <!-- Item with actions dropdown -->
        <SidebarMenuItem v-else-if="item.actions">
          <SidebarMenuButton
            :asChild="isLink(item)"
            :isActive="isActive(item.href)"
            :tooltip="item.label"
            @click="!isLink(item) ? item.command?.() : undefined"
          >
            <WebLink
              v-if="isLink(item)"
              :href="item.href"
              :externalIcon="false"
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
                class="ml-auto size-3.5 text-sidebar-foreground/50"
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
          <DropdownMenu>
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
                  class="flex items-center gap-2"
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

        <!-- Simple item -->
        <SidebarMenuItem v-else>
          <SidebarMenuButton
            :asChild="isLink(item)"
            :isActive="isActive(item.href)"
            :tooltip="item.label"
            @click="!isLink(item) ? item.command?.() : undefined"
          >
            <WebLink
              v-if="isLink(item)"
              :href="item.href"
              :externalIcon="false"
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
                class="ml-auto size-3.5 text-sidebar-foreground/50"
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
        </SidebarMenuItem>
      </template>
    </SidebarMenu>
  </SidebarGroup>
</template>
