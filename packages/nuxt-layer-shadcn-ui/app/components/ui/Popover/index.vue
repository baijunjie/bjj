<script setup lang="ts">
import {
  Popover as ShadcnPopover,
  PopoverContent,
  PopoverTrigger,
} from '../../shadcn/popover'
import type { PopoverProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PopoverProps>(), {
  trigger: 'click',
  class: undefined,
})

const { isMobile } = useDevice()

// Force click trigger on mobile devices for better touch experience
const effectiveTrigger = computed(() => isMobile.value ? 'click' : props.trigger)

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

const handleContentEnter = () => {
  if (effectiveTrigger.value === 'hover') {
    clearHideTimeout()
  }
}

const handleContentLeave = () => {
  if (effectiveTrigger.value === 'hover') {
    hideTimeout = setTimeout(hide, 100)
  }
}

onBeforeUnmount(() => {
  clearHideTimeout()
})
</script>

<template>
  <ShadcnPopover v-model:open="isOpen">
    <PopoverTrigger
      v-if="$slots.trigger"
      asChild
      @mouseenter="handleTriggerEnter"
      @mouseleave="handleTriggerLeave"
    >
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverContent
      v-bind="$attrs"
      :class="props.class"
      @mouseenter="handleContentEnter"
      @mouseleave="handleContentLeave"
    >
      <slot />
    </PopoverContent>
  </ShadcnPopover>
</template>
