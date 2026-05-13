import type { DatePickerTimeConfig } from '../DatePicker/types'

export interface DateRangePickerProps {
  /**
   * Range start. When `showTime` is false, the emitted value is normalized to
   * the start of the day (00:00:00.000) so the range is inclusive.
   */
  start?: Date | string | number | null
  /**
   * Range end. When `showTime` is false, the emitted value is normalized to
   * the end of the day (23:59:59.999) so the range is inclusive.
   */
  end?: Date | string | number | null
  /** Minimum selectable date */
  minDate?: Date | string
  /** Maximum selectable date */
  maxDate?: Date | string
  /** Enable time selection, or pass DatePickerTimeConfig for fine-grained control */
  showTime?: boolean | DatePickerTimeConfig
  /** Disable the date range picker */
  disabled?: boolean
  /** Readonly mode */
  readonly?: boolean
  /** Mark the field as invalid (renders both inputs with destructive styling) */
  invalid?: boolean
  /** Placeholder for start date input */
  startPlaceholder?: string
  /** Placeholder for end date input */
  endPlaceholder?: string
  /** Maximum span in days between start and end date */
  maxSpanDays?: number
  /**
   * v-model output format. Accepts any VueDatePicker `model-type` value:
   * `'iso'`, `'timestamp'`, or a date-fns pattern (e.g. `'yyyy-MM-dd'`).
   * Omit to bind a `Date` object.
   */
  valueFormat?: string
  /** Auto apply selection without confirm button */
  autoApply?: boolean
  class?: ClassValue
}
