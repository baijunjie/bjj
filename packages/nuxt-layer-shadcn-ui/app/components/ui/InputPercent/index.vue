<script setup lang="ts">
import type { InputPercentProps } from './types'

defineProps<InputPercentProps>()
</script>

<template>
  <InputNumber
    :formatOptions="{ style: 'percent' }"
    :step="0.01"
    :min="0"
    :max="1"
  />
</template>
