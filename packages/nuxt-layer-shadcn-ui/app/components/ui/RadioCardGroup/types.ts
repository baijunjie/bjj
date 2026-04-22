export interface RadioCardGroupOption {
  value: string
  title: string
  description?: string
  disabled?: boolean
}

export interface RadioCardGroupProps {
  modelValue?: string
  options: RadioCardGroupOption[]
  disabled?: boolean
  class?: ClassValue
}
