<script setup lang="ts">
import { Separator } from '../../shadcn/separator'
import type { DividerProps } from './types'

withDefaults(defineProps<DividerProps>(), {
  type: 'horizontal',
})
</script>

<template>
  <Separator
    :orientation="type"
  >
    <slot />
  </Separator>
</template>
