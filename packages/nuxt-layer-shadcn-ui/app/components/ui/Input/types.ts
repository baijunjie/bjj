export interface InputProps {
  modelValue?: string
  /** Set to enable browser/password-manager autofill (e.g. 'email', 'current-password'). Defaults to 'off'. */
  autocomplete?: string
  /** Maximum number of characters allowed */
  maxlength?: number
  /** Show character count (rendered as `count / maxlength` when maxlength is set) */
  showCount?: boolean
  readonly?: boolean
  disabled?: boolean
  invalid?: boolean
  class?: ClassValue
}
