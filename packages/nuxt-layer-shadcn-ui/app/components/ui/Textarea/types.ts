export interface TextareaProps {
  modelValue?: string
  /** Set to enable browser/password-manager autofill. Defaults to 'off'. */
  autocomplete?: string
  rows?: number
  /** Maximum number of characters allowed */
  maxlength?: number
  /** Show character count below the textarea (rendered as `count / maxlength` when maxlength is set) */
  showCount?: boolean
  readonly?: boolean
  disabled?: boolean
  invalid?: boolean
  class?: ClassValue
}
