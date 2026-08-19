<script setup lang="ts">
import type { TabsItem } from '../Tabs/types'
import type { SidebarLayoutMenuItem, SidebarLayoutProps } from './types'
import SidebarMenus from './SidebarMenus.vue'
import {
  findSidebarMenuItem,
  flattenSidebarMenuItems,
  sidebarMenuItemKey,
} from './utils'
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

const { isMobile } = useDevice()

// A 16rem column would eat a phone's width, so an embedded layout stacks its nav
// above the content there. Page mode keeps the vendored drawer instead.
const stacked = computed(() => props.embedded && isMobile.value)

const tabItems = computed<TabsItem[]>(() =>
  flattenSidebarMenuItems(props.menus).map(item => ({
    value: sidebarMenuItemKey(item),
    title: item.label,
    icon: item.icon,
  })),
)

const rootComponent = computed(() => props.embedded ? 'div' : SidebarProvider)

const rootStyle = computed(() => ({ '--sidebar-width': props.sidebarWidth }))

const rootClass = computed(() =>
  cn(
    props.embedded && 'min-h-0 flex size-full overflow-hidden',
    stacked.value && 'flex-col',
    props.class,
  ),
)

// A linked item navigates through its `WebLink`, so `command` is for the rest.
function onSelect (item: SidebarLayoutMenuItem) {
  emit('select', item)
  emit('update:active', sidebarMenuItemKey(item))
  if (!item.href) item.command?.()
}

function onTabSelect (key: string) {
  const item = findSidebarMenuItem(props.menus, key)
  if (item) onSelect(item)
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
      <!-- Stacked: the menu becomes a scrollable strip, groups flattened away. -->
      <template v-if="stacked">
        <div
          v-if="$slots.header"
          class="gap-2 p-2 flex flex-col"
        >
          <slot name="header" />
        </div>

        <div
          v-if="emptyText && !menus.length"
          class="px-4 py-3 text-sm text-muted-foreground border-b text-center"
        >
          {{ emptyText }}
        </div>
        <Tabs
          v-else
          :items="tabItems"
          :modelValue="active"
          listClass="
            h-auto w-full gap-1 rounded-none border-b bg-transparent p-2
            justify-start overflow-x-auto
          "
          triggerClass="
            data-[state=active]:bg-accent
            data-[state=active]:shadow-none
            flex-none
          "
          @update:modelValue="onTabSelect"
        />
      </template>

      <!-- `shrink-0`: wide pane content scrolls instead of squeezing the menu. -->
      <Sidebar
        v-else
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
          'min-w-0 min-h-0',
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
