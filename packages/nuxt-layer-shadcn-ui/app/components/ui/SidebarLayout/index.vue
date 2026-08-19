<script setup lang="ts">
import type { SidebarLayoutMenuItem, SidebarLayoutProps } from './types'
import SidebarMenus from './SidebarMenus.vue'
import { sidebarMenuItemKey } from './utils'
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
import { provideSidebarContext, SIDEBAR_WIDTH } from '../../shadcn/sidebar/utils'
import { TooltipProvider } from '../../shadcn/tooltip'

const props = withDefaults(defineProps<SidebarLayoutProps>(), {
  active: undefined,
  emptyText: undefined,
  variant: 'sidebar',
  collapsible: 'icon',
  sidebarWidth: SIDEBAR_WIDTH,
  contentClass: undefined,
  class: undefined,
})

const emit = defineEmits<{
  'update:active': [key: string]
  'select': [item: SidebarLayoutMenuItem]
}>()

defineSlots<{
  default?: () => any
  header?: () => any
  footer?: () => any
}>()

// The context `Sidebar` requires, without nesting `SidebarProvider` — whose
// viewport wrapper, state cookie and Cmd/Ctrl+B toggle are page-level behaviour.
// In page mode the provider mounts anyway and shadows this.
const noop = () => {}
provideSidebarContext({
  state: computed(() => 'expanded' as const),
  open: ref(true),
  setOpen: noop,
  isMobile: ref(false),
  openMobile: ref(false),
  setOpenMobile: noop,
  toggleSidebar: noop,
})

const rootComponent = computed(() => props.embedded ? 'div' : SidebarProvider)

const rootStyle = computed(() => ({ '--sidebar-width': props.sidebarWidth }))

const rootClass = computed(() =>
  cn(props.embedded && 'min-h-0 flex size-full overflow-hidden', props.class),
)

function onSelect (item: SidebarLayoutMenuItem) {
  emit('select', item)
  emit('update:active', sidebarMenuItemKey(item))
}
</script>

<template>
  <component
    :is="rootComponent"
    :style="rootStyle"
    :class="rootClass"
  >
    <!-- Menu-button tooltips need a provider, which embedded mode has none of. -->
    <TooltipProvider>
      <!-- `shrink-0`: wide pane content scrolls instead of squeezing the menu. -->
      <Sidebar
        :variant="variant"
        :collapsible="embedded ? 'none' : collapsible"
        :class="embedded ? 'shrink-0 border-r' : undefined"
      >
        <SidebarHeader v-if="$slots.header">
          <slot name="header" />
        </SidebarHeader>

        <SidebarContent class="overflow-hidden">
          <ScrollArea
            fadeMask
            class="min-h-0 flex-1"
          >
            <SidebarMenus
              :menus="menus"
              :active="active"
              :emptyText="emptyText"
              @select="onSelect"
            />
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter v-if="$slots.footer">
          <slot name="footer" />
        </SidebarFooter>

        <SidebarRail v-if="!embedded" />
      </Sidebar>

      <!-- The nav keeps the page ground, so the content takes the raised surface —
           embedded, the container owns it (a modal is `bg-popover`).
           Top padding on mobile reserves a safe area for the floating trigger. -->
      <SidebarInset
        :class="[
          'min-w-0',
          embedded ? 'bg-transparent' : 'bg-card',
          !embedded && `
            pt-14
            md:pt-0
          `,
        ]"
      >
        <!-- Mobile-only trigger: the desktop toggle lives in the sidebar header. -->
        <SidebarTrigger
          v-if="!embedded"
          class="
            left-3 top-3 size-9 rounded-md bg-background/80 shadow-sm
            backdrop-blur-sm
            md:hidden
            absolute z-30 cursor-pointer border
          "
        />

        <ScrollArea
          fadeMask
          class="min-h-0 flex-1"
        >
          <div :class="contentClass">
            <slot />
          </div>
        </ScrollArea>
      </SidebarInset>
    </TooltipProvider>
  </component>
</template>
