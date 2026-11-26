<script setup lang="ts">
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  icon: string | Component
  /** Accessible name, also shown as the tooltip */
  label: string
  /** Pressed state of a toggle tool; leave unset for plain action buttons */
  active?: boolean
  disabled?: boolean
  loading?: boolean
}>(), {
  active: undefined,
})

defineEmits<{ click: []}>()

// Squares of the toolbar's tool size (see Toolbar), which follows the editor's tier
const mergedClass = computed(() => cn(
  'p-0 size-(--tool-size)',
  props.active && 'bg-accent text-accent-foreground',
))
</script>

<template>
  <Tooltip
    :text="label"
    :disabled="disabled"
  >
    <Button
      variant="ghost"
      :icon="icon"
      :loading="loading"
      :disabled="disabled"
      :class="mergedClass"
      :aria-label="label"
      :aria-pressed="active"
      @click="$emit('click')"
    />
  </Tooltip>
</template>
