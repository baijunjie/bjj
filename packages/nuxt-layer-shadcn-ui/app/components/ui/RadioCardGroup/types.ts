export interface RadioCardGroupOption {
  value: string
  title: string
  description?: string
  disabled?: boolean
}

export interface RadioCardGroupProps {
  modelValue?: string
  options: RadioCardGroupOption[]
  /** Keep the value visible and focusable but prevent changing it */
  readonly?: boolean
  disabled?: boolean
  invalid?: boolean
  class?: ClassValue
}
