<script setup lang="ts">
import type { ButtonGroupProps } from './types'

const props = defineProps<ButtonGroupProps>()

defineSlots<{
  default?: () => any
}>()

const mergedClass = computed(() => cn(`
  [&>*:first-child]:rounded-l-md
  [&>*:last-child]:rounded-r-md
  inline-flex items-center
  *:rounded-none *:border-r-0
  [&>*:focus-visible]:relative [&>*:focus-visible]:z-10
  [&>*:last-child]:border-r
`, props.class))
</script>

<template>
  <div
    role="group"
    :class="mergedClass"
  >
    <slot />
  </div>
</template>
