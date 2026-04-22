<script setup lang="ts">
import type { InputRangeProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputRangeProps>(), {
  start: undefined,
  end: undefined,
  min: 0,
  max: 100,
})

const emit = defineEmits<{
  'update:start': [value: number | undefined]
  'update:end': [value: number | undefined]
}>()

const start = computed({
  get: () => props.start,
  set: value => emit('update:start', value),
})

const end = computed({
  get: () => props.end,
  set: value => emit('update:end', value),
})
</script>

<template>
  <div class="flex items-center gap-2">
    <InputNumber
      v-model="start"
      v-bind="$attrs"
      :min="min"
      :max="end ?? max"
      fluid
    />
    <span class="leading-0 text-muted-foreground">
      -
    </span>
    <InputNumber
      v-model="end"
      v-bind="$attrs"
      :min="start ?? min"
      :max="max"
      fluid
    />
  </div>
</template>
