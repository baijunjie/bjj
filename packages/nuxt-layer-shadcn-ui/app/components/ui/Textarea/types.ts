export interface TextareaProps {
  modelValue?: string
  /** Set to enable browser/password-manager autofill. Defaults to 'off'. */
  autocomplete?: string
  rows?: number
  invalid?: boolean
  class?: ClassValue
}
