export interface InputProps {
  modelValue?: string
  /** Set to enable browser/password-manager autofill (e.g. 'email', 'current-password'). Defaults to 'off'. */
  autocomplete?: string
  readonly?: boolean
  disabled?: boolean
  invalid?: boolean
  class?: ClassValue
}
