<script setup lang="ts">
import type { InputRangeProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputRangeProps>(), {
  start: undefined,
  end: undefined,
  min: 0,
  max: undefined,
})

const emit = defineEmits<{
  'update:start': [value: number | undefined]
  'update:end': [value: number | undefined]
}>()

const { t } = useI18n()

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
  <div class="gap-2 flex items-center">
    <InputNumber
      v-model="start"
      v-bind="$attrs"
      :min="min"
      :max="end ?? max"
      fluid
    />
    <span class="leading-0 text-muted-foreground">
      {{ t('common.symbols.connector') }}
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
