<script setup lang="ts">
import type { AdminLayoutSidebarDropdownProfile, AdminLayoutSidebarDropdownMenuItem } from './types'
import { ChevronsUpDown } from 'lucide-vue-next'
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

// Transform 'profile' items to Dropdown's custom-label items with slot 'profile'.
// Other items pass through unchanged.
const dropdownItems = computed<DropdownItem[]>(() =>
  (props.menuItems ?? []).map(item => {
    if (item.type === 'profile') {
      const { type: _, ...rest } = item
      return { type: 'custom-label', slot: 'profile', ...rest }
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
          <div class="grid flex-1 text-left text-sm/tight">
            <span class="truncate font-medium">
              {{ profile?.title }}
            </span>
            <span class="truncate text-xs">
              {{ profile?.subtitle }}
            </span>
          </div>
          <ChevronsUpDown class="ml-auto size-4" />
        </SidebarMenuButton>

        <template #profile="{ item }">
          <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
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
            <div class="grid flex-1 text-left text-sm/tight">
              <span class="truncate font-semibold">
                {{ item.title }}
              </span>
              <span
                v-if="item.subtitle"
                class="truncate text-xs"
              >
                {{ item.subtitle }}
              </span>
            </div>
          </div>
        </template>
      </Dropdown>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
