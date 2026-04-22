<script setup lang="ts">
import type { DateRangePickerProps, DateRangePickerValue } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  modelValue: () => ({ start: null, end: null }),
  showTime: false,
  disabled: false,
  readonly: false,
  startPlaceholder: undefined,
  endPlaceholder: undefined,
  minDate: undefined,
  maxDate: undefined,
  maxSpanDays: undefined,
  valueFormat: undefined,
  autoApply: true,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: DateRangePickerValue]
}>()

const T = useTranslations('components.ui.DateRangePicker')

const startDate = ref<Date | string | null>(props.modelValue?.start ?? null)
const endDate = ref<Date | string | null>(props.modelValue?.end ?? null)

watch(() => props.modelValue, val => {
  startDate.value = val?.start ?? null
  endDate.value = val?.end ?? null
})

function emitRange () {
  emit('update:modelValue', {
    start: startDate.value,
    end: endDate.value,
  })
}

function handleStartUpdate (value: Date | string | null) {
  startDate.value = value
  emitRange()
}

function handleEndUpdate (value: Date | string | null) {
  // If time is disabled, set end time to end of day
  if (value instanceof Date && !props.showTime) {
    const adjusted = new Date(value)
    adjusted.setHours(23, 59, 59, 999)
    endDate.value = adjusted
  } else {
    endDate.value = value
  }
  emitRange()
}

// Helper functions for date constraints
function addDays (date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function toDate (value: Date | string | null): Date | undefined {
  if (!value) return undefined
  return value instanceof Date ? value : new Date(value)
}

// Start picker constraints
const startMinDate = computed(() => {
  const min = props.minDate
  const spanLimit = props.maxSpanDays && endDate.value
    ? addDays(toDate(endDate.value)!, -(props.maxSpanDays - 1))
    : undefined
  if (min && spanLimit) return new Date(Math.max(+new Date(min), +spanLimit))
  return min ?? spanLimit
})

const startMaxDate = computed(() => {
  const end = toDate(endDate.value)
  const max = props.maxDate
  if (end && max) return new Date(Math.min(+end, +new Date(max)))
  return end ?? max
})

// End picker constraints
const endMinDate = computed(() => {
  const start = toDate(startDate.value)
  const min = props.minDate
  if (start && min) return new Date(Math.max(+start, +new Date(min)))
  return start ?? min
})

const endMaxDate = computed(() => {
  const max = props.maxDate
  const spanLimit = props.maxSpanDays && startDate.value
    ? addDays(toDate(startDate.value)!, props.maxSpanDays - 1)
    : undefined
  if (max && spanLimit) return new Date(Math.min(+new Date(max), +spanLimit))
  return max ?? spanLimit
})
</script>

<template>
  <div :class="cn('flex items-center gap-2', props.class)">
    <DatePicker
      :modelValue="startDate"
      :showTime="showTime"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="startPlaceholder ?? T('startPlaceholder')"
      :minDate="startMinDate"
      :maxDate="startMaxDate"
      :valueFormat="valueFormat"
      :autoApply="autoApply"
      v-bind="$attrs"
      @update:modelValue="handleStartUpdate"
    />
    <span class="shrink-0 text-muted-foreground">
      {{ T('to') }}
    </span>
    <DatePicker
      :modelValue="endDate"
      :showTime="showTime"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="endPlaceholder ?? T('endPlaceholder')"
      :minDate="endMinDate"
      :maxDate="endMaxDate"
      :valueFormat="valueFormat"
      :autoApply="autoApply"
      v-bind="$attrs"
      @update:modelValue="handleEndUpdate"
    />
  </div>
</template>
