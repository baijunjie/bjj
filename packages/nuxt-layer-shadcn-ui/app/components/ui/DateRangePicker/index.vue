<script setup lang="ts">
import type { DateRangePickerProps } from './types'
import { format as formatDate, parse as parseDate } from 'date-fns'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  start: null,
  end: null,
  showTime: false,
  disabled: false,
  readonly: false,
  invalid: false,
  startPlaceholder: undefined,
  endPlaceholder: undefined,
  minDate: undefined,
  maxDate: undefined,
  maxSpanDays: undefined,
  valueFormat: undefined,
  autoApply: true,
  class: undefined,
})

useFormItemInvalid(() => props.invalid)

const emit = defineEmits<{
  'update:start': [value: Date | string | number | null]
  'update:end': [value: Date | string | number | null]
}>()

const { t } = useI18n()
const T = useTranslations('components.ui.DateRangePicker')

// Convert a v-model value (whose shape depends on valueFormat) into a Date for manipulation.
function parseValue (value: Date | string | number): Date | null {
  if (value instanceof Date) return new Date(value)
  if (typeof value === 'number') return new Date(value)
  const fmt = props.valueFormat
  if (!fmt || fmt === 'iso') return new Date(value)
  if (fmt === 'timestamp') return new Date(Number(value))
  if (fmt === 'format') return null // uses VueDatePicker `format` prop, not exposed here
  try {
    return parseDate(value, fmt, new Date())
  } catch {
    return null
  }
}

// Convert a Date back to the same shape as the original value.
function formatValue (date: Date, original: Date | string | number): Date | string | number {
  if (original instanceof Date) return date
  if (typeof original === 'number') return date.getTime()
  const fmt = props.valueFormat
  if (!fmt || fmt === 'iso') return date.toISOString()
  if (fmt === 'timestamp') return date.getTime()
  if (fmt === 'format') return original
  try {
    return formatDate(date, fmt)
  } catch {
    return original
  }
}

// Normalize the time portion to start/end of day so the range is inclusive.
// For date-only patterns (e.g. 'yyyy-MM-dd') the output is unchanged since the
// formatted string carries no time component — the round-trip just preserves it.
function normalizeTimeOfDay (
  value: Date | string | number | null,
  end: boolean,
): Date | string | number | null {
  if (value == null) return value
  const date = parseValue(value)
  if (!date || Number.isNaN(date.getTime())) return value
  date.setHours(end ? 23 : 0, end ? 59 : 0, end ? 59 : 0, end ? 999 : 0)
  return formatValue(date, value)
}

const start = computed({
  get: () => props.start,
  set: value => emit('update:start', props.showTime ? value : normalizeTimeOfDay(value, false)),
})

const end = computed({
  get: () => props.end,
  set: value => emit('update:end', props.showTime ? value : normalizeTimeOfDay(value, true)),
})

function addDays (date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function toDate (value: Date | string | number | null | undefined): Date | undefined {
  if (value == null) return undefined
  if (value instanceof Date) return value
  return parseValue(value) ?? undefined
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
      :placeholder="startPlaceholder || T('startPlaceholder')"
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
      :placeholder="endPlaceholder || T('endPlaceholder')"
      :minDate="endMinDate"
      :maxDate="endMaxDate"
      :valueFormat="valueFormat"
      :autoApply="autoApply"
      v-bind="$attrs"
    />
  </div>
</template>
