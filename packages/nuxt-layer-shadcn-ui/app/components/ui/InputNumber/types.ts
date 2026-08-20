export type InputNumberAlign = 'left' | 'center' | 'right'

export interface InputNumberProps {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  readonly?: boolean
  disabled?: boolean
  showButtons?: boolean
  placeholder?: string
  /** Horizontal alignment of the value inside the input */
  align?: InputNumberAlign
  invalid?: boolean
  class?: ClassValue
}
