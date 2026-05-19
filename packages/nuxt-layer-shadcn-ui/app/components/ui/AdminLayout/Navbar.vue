<script setup lang="ts">
import { SidebarTrigger } from '../../shadcn/sidebar'

const props = defineProps<{
  class?: ClassValue
}>()

const mergedClass = computed(() =>
  cn(
    `
      h-14 gap-3 border-sidebar-border bg-card px-4 text-card-foreground
      group-has-data-[collapsible=icon]/sidebar-wrapper:h-12
      flex shrink-0 items-center border-b transition-[width,height] ease-linear
    `,
    props.class,
  ),
)
</script>

<template>
  <header :class="mergedClass">
    <SidebarTrigger class="-mx-1" />
    <Divider
      type="vertical"
      class="h-4!"
    />
    <div class="flex flex-1 items-center">
      <slot />
    </div>
  </header>
</template>
