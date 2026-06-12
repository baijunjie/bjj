export interface RadioGroupItem {
  value: string
  label?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  modelValue?: string
  items?: RadioGroupItem[]
  /** Keep the value visible and focusable but prevent changing it */
  readonly?: boolean
  disabled?: boolean
  invalid?: boolean
  orientation?: 'vertical' | 'horizontal'
  class?: ClassValue
}
