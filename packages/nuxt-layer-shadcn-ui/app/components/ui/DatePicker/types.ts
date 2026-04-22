export interface DatePickerTimeConfig {
  enableSeconds?: boolean
  enableMinutes?: boolean
  is24?: boolean
  noHoursOverlay?: boolean
  noMinutesOverlay?: boolean
  noSecondsOverlay?: boolean
  hoursIncrement?: number | string
  minutesIncrement?: number | string
  secondsIncrement?: number | string
  hoursGridIncrement?: number | string
  minutesGridIncrement?: number | string
  secondsGridIncrement?: number | string
  timePickerInline?: boolean
  startTime?: { hours: number, minutes: number, seconds?: number }
}

export type DatePickerType = 'date' | 'month' | 'year'

export interface DatePickerProps {
  modelValue?: Date | string | null
  /** Picker type: date (default), month, or year */
  type?: DatePickerType
  /** Enable time selection, or pass DatePickerTimeConfig for fine-grained control */
  showTime?: boolean | DatePickerTimeConfig
  /** Disable the date picker */
  disabled?: boolean
  /** Readonly mode */
  readonly?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Minimum selectable date */
  minDate?: Date | string
  /** Maximum selectable date */
  maxDate?: Date | string
  /** v-model output format (e.g. 'yyyy-MM-dd', 'timestamp', 'iso') */
  valueFormat?: string
  /** Auto apply selection without confirm button */
  autoApply?: boolean
  class?: ClassValue
}
