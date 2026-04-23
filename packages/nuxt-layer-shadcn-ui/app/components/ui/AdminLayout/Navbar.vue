<script setup lang="ts">
import { SidebarTrigger } from '../../shadcn/sidebar'
</script>

<template>
  <header
    class="
      flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border
      bg-card px-4 text-card-foreground transition-[width,height] ease-linear
      group-has-data-[collapsible=icon]/sidebar-wrapper:h-12
    "
  >
    <SidebarTrigger class="-ml-1" />
    <Divider
      type="vertical"
      class="mr-2 h-4!"
    />
    <div class="flex flex-1 items-center">
      <slot />
    </div>
  </header>
</template>
