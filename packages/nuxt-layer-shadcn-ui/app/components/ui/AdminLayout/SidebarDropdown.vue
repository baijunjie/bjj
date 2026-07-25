<script setup lang="ts">
import type { AdminLayoutSidebarDropdownProfile, AdminLayoutSidebarDropdownMenuItem } from './types'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../../shadcn/sidebar'

const props = defineProps<{
  profile?: AdminLayoutSidebarDropdownProfile | null
  menuItems?: AdminLayoutSidebarDropdownMenuItem[]
}>()

const { isMobile } = useSidebar()

// 'profile' items render through the 'profile' slot: clickable (`custom-action`,
// padding reset so the slot owns it) when it has a `command`, else a label.
const dropdownItems = computed<DropdownItem[]>(() =>
  (props.menuItems ?? []).map(item => {
    if (item.type === 'profile') {
      const { type: _, command, ...rest } = item
      return command
        ? { type: 'custom-action', slot: 'profile', command, ...rest, class: 'p-0' }
        : { type: 'custom-label', slot: 'profile', ...rest }
    }
    return item
  }),
)
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <Dropdown
        :menus="dropdownItems"
        trigger="click"
        :side="isMobile ? 'bottom' : 'right'"
        align="start"
        :sideOffset="4"
        class="min-w-56 rounded-lg"
      >
        <SidebarMenuButton
          size="lg"
          class="
            data-[state=open]:bg-sidebar-accent
            data-[state=open]:text-sidebar-accent-foreground
          "
        >
          <Avatar
            :image="profile?.icon ? undefined : (profile?.image || undefined)"
            :fallbackLabel="profile?.icon ? undefined : profile?.title?.charAt(0)?.toUpperCase()"
            shape="circle"
            class="size-8"
          >
            <Icon
              v-if="profile?.icon"
              :name="profile.icon"
              class="size-4"
            />
          </Avatar>
          <div class="text-sm/tight grid flex-1 text-left">
            <span class="font-medium truncate">
              {{ profile?.title }}
            </span>
            <span class="text-xs truncate">
              {{ profile?.subtitle }}
            </span>
          </div>
          <Icon
            v-if="profile?.actionIcon"
            :name="profile.actionIcon"
            class="size-4 ml-auto shrink-0"
          />
        </SidebarMenuButton>

        <template #profile="{ item }">
          <div
            class="gap-2 px-2 py-1.5 text-sm flex w-full items-center text-left"
          >
            <Avatar
              :image="item.icon ? undefined : (item.image || undefined)"
              :fallbackLabel="item.icon ? undefined : item.title?.charAt(0)?.toUpperCase()"
              shape="circle"
              class="size-8"
            >
              <Icon
                v-if="item.icon"
                :name="item.icon"
                class="size-4"
              />
            </Avatar>
            <div class="text-sm/tight grid flex-1 text-left">
              <span class="font-semibold truncate">
                {{ item.title }}
              </span>
              <span
                v-if="item.subtitle"
                class="text-xs truncate"
              >
                {{ item.subtitle }}
              </span>
            </div>
            <Icon
              v-if="item.command && item.actionIcon"
              :name="item.actionIcon"
              class="size-4 text-muted-foreground ml-auto shrink-0"
            />
          </div>
        </template>
      </Dropdown>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
