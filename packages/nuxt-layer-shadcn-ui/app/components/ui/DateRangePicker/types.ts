import type { DatePickerTimeConfig } from '../DatePicker/types'

export type DateRangePickerValue = [
  start: Date | string | null,
  end: Date | string | null,
]

export interface DateRangePickerProps {
  modelValue?: DateRangePickerValue
  /** Enable time selection, or pass DatePickerTimeConfig for fine-grained control */
  showTime?: boolean | DatePickerTimeConfig
  /** Disable the date range picker */
  disabled?: boolean
  /** Readonly mode */
  readonly?: boolean
  /** Placeholder for start date input */
  startPlaceholder?: string
  /** Placeholder for end date input */
  endPlaceholder?: string
  /** Minimum selectable date */
  minDate?: Date | string
  /** Maximum selectable date */
  maxDate?: Date | string
  /** Maximum span in days between start and end date */
  maxSpanDays?: number
  /** v-model output format (e.g. 'yyyy-MM-dd', 'timestamp', 'iso') */
  valueFormat?: string
  /** Auto apply selection without confirm button */
  autoApply?: boolean
  class?: ClassValue
}
