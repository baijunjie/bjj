export interface TextareaProps {
  modelValue?: string
  /** Set to enable browser/password-manager autofill. Defaults to 'off'. */
  autocomplete?: string
  rows?: number
  /** Maximum number of characters allowed */
  maxlength?: number
  /** Maximum number of lines allowed: extra line breaks are blocked and pasted overflow is trimmed */
  maxLines?: number
  /**
   * Show line and character count below the textarea, rendered as `lines · count`.
   * Each part gains a ` / limit` suffix when `maxLines` / `maxlength` is set.
   */
  showCount?: boolean
  readonly?: boolean
  disabled?: boolean
  invalid?: boolean
  class?: ClassValue
}
