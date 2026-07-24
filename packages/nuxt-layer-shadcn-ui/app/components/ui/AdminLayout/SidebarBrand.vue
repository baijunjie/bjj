<script setup lang="ts">
import { SidebarTrigger, useSidebar } from '../../shadcn/sidebar'

defineProps<{
  /** Brand name shown next to the logo. Hidden while the sidebar is collapsed. */
  brandName?: string
}>()

defineSlots<{
  /** Brand logo/mark. */
  logo?: () => any
}>()

const { state } = useSidebar()
const T = useTranslations('components.ui.AdminLayout')

// The trigger toggles the sidebar, so its label reflects the resulting action.
const toggleLabel = computed(() =>
  state.value === 'collapsed' ? T('expandSidebar') : T('collapseSidebar'),
)
</script>

<template>
  <!-- Collapsed: only the logo shows; hovering swaps it for the toggle (which
       stays clickable while transparent, so the whole row re-expands). -->
  <div
    class="
      group/brand h-8 gap-2 relative flex items-center
      group-data-[collapsible=icon]:justify-center
    "
  >
    <div
      class="
        min-w-0 gap-2 flex flex-1 items-center
        group-data-[collapsible=icon]:flex-none
      "
    >
      <span
        class="
          size-8 flex shrink-0 items-center justify-center transition-opacity
          group-data-[collapsible=icon]:group-hover/brand:opacity-0
        "
      >
        <slot name="logo" />
      </span>
      <span
        v-if="brandName"
        class="
          text-base font-semibold truncate
          group-data-[collapsible=icon]:hidden
        "
      >
        {{ brandName }}
      </span>
    </div>

    <Tooltip
      :text="toggleLabel"
      position="right"
    >
      <SidebarTrigger
        class="
          text-muted-foreground
          group-data-[collapsible=icon]:inset-0
          shrink-0 cursor-pointer transition-opacity
          group-data-[collapsible=icon]:absolute
          group-data-[collapsible=icon]:m-auto
          group-data-[collapsible=icon]:opacity-0
          group-data-[collapsible=icon]:group-hover/brand:opacity-100
        "
      />
    </Tooltip>
  </div>
</template>
