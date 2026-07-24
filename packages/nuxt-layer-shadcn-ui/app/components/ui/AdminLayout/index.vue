<script setup lang="ts">
import type { AdminLayoutProps } from './types'
import SidebarBrand from './SidebarBrand.vue'
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
  SidebarTrigger,
} from '../../shadcn/sidebar'

const props = withDefaults(defineProps<AdminLayoutProps>(), {
  brandName: undefined,
  footerDropdown: undefined,
  variant: 'sidebar',
  collapsible: 'icon',
  contentClass: undefined,
})

defineSlots<{
  default?: () => any
  header?: () => any
  footer?: () => any
  logo?: () => any
}>()

const mergedContentClass = computed(() =>
  cn('flex-1 overflow-auto', props.contentClass),
)
</script>

<template>
  <SidebarProvider>
    <Sidebar
      :variant="variant"
      :collapsible="collapsible"
    >
      <SidebarHeader>
        <slot name="header">
          <SidebarBrand :brandName="brandName">
            <template #logo>
              <slot name="logo" />
            </template>
          </SidebarBrand>
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

    <!-- Top padding on mobile reserves a safe area for the floating trigger. -->
    <SidebarInset
      class="
        min-w-0 pt-14
        md:pt-0
      "
    >
      <!-- Mobile-only trigger: the desktop toggle lives in the sidebar header. -->
      <SidebarTrigger
        class="
          left-3 top-3 size-9 rounded-md bg-background/80 shadow-sm
          backdrop-blur-sm
          md:hidden
          absolute z-30 cursor-pointer border
        "
      />

      <div :class="mergedContentClass">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
