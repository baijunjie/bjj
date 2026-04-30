<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../shadcn/dropdown-menu'
import MenuItems from './MenuItems.vue'
import type { DropdownProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DropdownProps>(), {
  menus: () => [],
  trigger: 'hover',
  class: undefined,
  minWidth: undefined,
})

const contentStyle = computed<{ minWidth?: string } | undefined>(() => {
  if (props.minWidth == null) return undefined
  const value = typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth
  return { minWidth: value }
})

const slots = defineSlots<{
  default?: () => any
  popup?: (props: { hide: () => void }) => any
  empty?: () => any
  [key: string]: ((props?: any) => any) | undefined
}>()

const T = useTranslations('components.ui.Dropdown')
const { isMobile } = useDevice()

// Force click trigger on mobile devices for better touch experience
const effectiveTrigger = computed(() => {
  return isMobile.value ? 'click' : props.trigger
})

const isOpen = ref(false)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const clearHideTimeout = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
}

const hide = () => {
  isOpen.value = false
}

const handleTriggerEnter = () => {
  if (effectiveTrigger.value === 'hover') {
    clearHideTimeout()
    isOpen.value = true
  }
}

const handleTriggerLeave = () => {
  if (effectiveTrigger.value === 'hover') {
    hideTimeout = setTimeout(hide, 100)
  }
}

const handleMenuEnter = () => {
  if (effectiveTrigger.value === 'hover') {
    clearHideTimeout()
  }
}

const handleMenuLeave = () => {
  if (effectiveTrigger.value === 'hover') {
    hideTimeout = setTimeout(hide, 100)
  }
}

provide(dropdownContextKey, {
  hide,
  slots,
  contentStyle,
})

onBeforeUnmount(() => {
  clearHideTimeout()
})
</script>

<template>
  <DropdownMenu
    v-model:open="isOpen"
    :modal="effectiveTrigger !== 'hover'"
  >
    <DropdownMenuTrigger
      asChild
      @mouseenter="handleTriggerEnter"
      @mouseleave="handleTriggerLeave"
    >
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      v-bind="$attrs"
      :class="props.class"
      :style="contentStyle"
      @mouseenter="handleMenuEnter"
      @mouseleave="handleMenuLeave"
    >
      <!-- Custom popup content -->
      <template v-if="$slots.popup">
        <slot
          name="popup"
          :hide="hide"
        />
      </template>

      <!-- Default menu dropdown -->
      <MenuItems
        v-else-if="menus.length"
        :menus="menus"
      />

      <!-- Empty placeholder. Default content is wrapped; #empty slot is not. -->
      <slot
        v-else
        name="empty"
      >
        <div
          class="
            gap-2 px-2 py-4 text-sm text-muted-foreground flex flex-col
            items-center
          "
        >
          <Icon
            name="inbox"
            class="size-6"
          />
          <span>{{ T('empty') }}</span>
        </div>
      </slot>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
