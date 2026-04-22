<script setup lang="ts">
import type { ButtonGroupProps } from './types'

const props = defineProps<ButtonGroupProps>()

const mergedClass = computed(() => cn(`
  inline-flex items-center
  *:rounded-none *:border-r-0
  [&>*:first-child]:rounded-l-md
  [&>*:focus-visible]:relative [&>*:focus-visible]:z-10
  [&>*:last-child]:rounded-r-md [&>*:last-child]:border-r
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
