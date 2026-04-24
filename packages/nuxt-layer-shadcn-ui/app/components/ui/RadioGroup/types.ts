export interface RadioGroupItem {
  value: string
  label?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  modelValue?: string
  items?: RadioGroupItem[]
  disabled?: boolean
  orientation?: 'vertical' | 'horizontal'
  class?: ClassValue
}
