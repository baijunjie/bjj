<script setup lang="ts">
import type { AdminLayoutProps } from './types'
import Navbar from './Navbar.vue'
import SidebarDropdown from './SidebarDropdown.vue'
import SidebarMenus from './SidebarMenus.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '../../shadcn/sidebar'

withDefaults(defineProps<AdminLayoutProps>(), {
  headerDropdown: undefined,
  footerDropdown: undefined,
  variant: 'sidebar',
  collapsible: 'icon',
})
</script>

<template>
  <SidebarProvider>
    <Sidebar
      :variant="variant"
      :collapsible="collapsible"
    >
      <SidebarHeader>
        <slot name="header">
          <SidebarDropdown
            v-if="headerDropdown"
            :profile="headerDropdown.profile"
            :menuItems="headerDropdown.menuItems"
          />
        </slot>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenus :menus="menus" />
      </SidebarContent>

      <SidebarFooter>
        <slot name="footer">
          <SidebarDropdown
            v-if="footerDropdown"
            :profile="footerDropdown.profile"
            :menuItems="footerDropdown.menuItems"
          />
        </slot>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>

    <SidebarInset class="min-w-0">
      <Navbar>
        <div class="gap-3 flex flex-1 items-center">
          <slot name="navbar-left" />
        </div>
        <div class="gap-3 flex items-center">
          <slot name="navbar-right" />
        </div>
      </Navbar>

      <div class="flex-1 overflow-auto">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
