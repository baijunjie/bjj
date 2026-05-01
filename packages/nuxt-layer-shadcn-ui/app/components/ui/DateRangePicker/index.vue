<script setup lang="ts">
import type { DateRangePickerProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  start: null,
  end: null,
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
  'update:start': [value: Date | string | null]
  'update:end': [value: Date | string | null]
}>()

const { t } = useI18n()
const T = useTranslations('components.ui.DateRangePicker')

const start = computed({
  get: () => props.start,
  set: value => emit('update:start', value),
})

const end = computed({
  get: () => props.end,
  set: value => {
    // When time is disabled, normalize end to end of day so range is inclusive
    if (value instanceof Date && !props.showTime) {
      const adjusted = new Date(value)
      adjusted.setHours(23, 59, 59, 999)
      emit('update:end', adjusted)
    } else {
      emit('update:end', value)
    }
  },
})

function addDays (date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function toDate (value: Date | string | null | undefined): Date | undefined {
  if (!value) return undefined
  return value instanceof Date ? value : new Date(value)
}

const startMinDate = computed(() => {
  const min = props.minDate
  const spanLimit = props.maxSpanDays && props.end
    ? addDays(toDate(props.end)!, -(props.maxSpanDays - 1))
    : undefined
  if (min && spanLimit) return new Date(Math.max(+new Date(min), +spanLimit))
  return min ?? spanLimit
})

const startMaxDate = computed(() => {
  const endDate = toDate(props.end)
  const max = props.maxDate
  if (endDate && max) return new Date(Math.min(+endDate, +new Date(max)))
  return endDate ?? max
})

const endMinDate = computed(() => {
  const startDate = toDate(props.start)
  const min = props.minDate
  if (startDate && min) return new Date(Math.max(+startDate, +new Date(min)))
  return startDate ?? min
})

const endMaxDate = computed(() => {
  const max = props.maxDate
  const spanLimit = props.maxSpanDays && props.start
    ? addDays(toDate(props.start)!, props.maxSpanDays - 1)
    : undefined
  if (max && spanLimit) return new Date(Math.min(+new Date(max), +spanLimit))
  return max ?? spanLimit
})
</script>

<template>
  <div :class="cn('gap-2 flex items-center', props.class)">
    <DatePicker
      v-model="start"
      :showTime="showTime"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="startPlaceholder ?? T('startPlaceholder')"
      :minDate="startMinDate"
      :maxDate="startMaxDate"
      :valueFormat="valueFormat"
      :autoApply="autoApply"
      v-bind="$attrs"
    />
    <span class="text-muted-foreground shrink-0">
      {{ t('common.symbols.connector') }}
    </span>
    <DatePicker
      v-model="end"
      :showTime="showTime"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="endPlaceholder ?? T('endPlaceholder')"
      :minDate="endMinDate"
      :maxDate="endMaxDate"
      :valueFormat="valueFormat"
      :autoApply="autoApply"
      v-bind="$attrs"
    />
  </div>
</template>
