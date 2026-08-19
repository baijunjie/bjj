<script setup lang="ts">
import type { AdminLayoutProps } from './types'
import SidebarBrand from './SidebarBrand.vue'
import SidebarDropdown from './SidebarDropdown.vue'

withDefaults(defineProps<AdminLayoutProps>(), {
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
</script>

<template>
  <SidebarLayout
    :menus="menus"
    :variant="variant"
    :collapsible="collapsible"
    :contentClass="contentClass"
  >
    <template #header>
      <slot name="header">
        <SidebarBrand :brandName="brandName">
          <template #logo>
            <slot name="logo" />
          </template>
        </SidebarBrand>
      </slot>
    </template>

    <template #footer>
      <slot name="footer">
        <SidebarDropdown
          v-if="footerDropdown"
          :profile="footerDropdown.profile"
          :menuItems="footerDropdown.menuItems"
        />
      </slot>
    </template>

    <slot />
  </SidebarLayout>
</template>
