<script setup lang="ts">
import type { Component } from 'vue'
import {
  Popover as ShadcnPopover,
  PopoverAnchor,
  PopoverContent,
} from '../../shadcn/popover'
import ToolbarButton from './ToolbarButton.vue'

/** A toolbar button that toggles a popover panel below it. */
const props = withDefaults(defineProps<{
  open: boolean
  icon: string | Component
  label: string
  active?: boolean
  disabled?: boolean
  loading?: boolean
}>(), {
  active: undefined,
})

const emit = defineEmits<{ 'update:open': [value: boolean]}>()

defineSlots<{
  default?: () => any
}>()

const anchorRef = useTemplateRef<InstanceType<typeof PopoverAnchor>>('anchor')

// The anchor is outside the panel, so pressing the button while open would
// close the panel on pointerdown and reopen it on click — let the click toggle it.
function handlePointerDownOutside (event: CustomEvent<{ originalEvent: PointerEvent }>) {
  const anchor = anchorRef.value?.$el as HTMLElement | undefined
  if (anchor?.contains(event.detail.originalEvent.target as Node)) event.preventDefault()
}
</script>

<template>
  <ShadcnPopover
    :open="open"
    @update:open="value => emit('update:open', value)"
  >
    <PopoverAnchor
      ref="anchor"
      class="inline-flex"
    >
      <ToolbarButton
        :icon="icon"
        :label="label"
        :active="active"
        :disabled="disabled"
        :loading="loading"
        @click="emit('update:open', !props.open)"
      />
    </PopoverAnchor>
    <PopoverContent
      align="start"
      :collisionPadding="8"
      class="w-80 p-3"
      @pointerDownOutside="handlePointerDownOutside"
      @closeAutoFocus.prevent
    >
      <slot />
    </PopoverContent>
  </ShadcnPopover>
</template>
