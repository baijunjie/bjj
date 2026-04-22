<script setup lang="ts">
import type { LoadingProps } from './types'

const props = defineProps<LoadingProps>()
const mergedClass = computed(() => cn(`
  size-16 animate-spin text-muted-foreground
`, props.class))
</script>

<template>
  <Icon
    name="loader-circle"
    :class="mergedClass"
  />
</template>
