export interface FormItemProps {
  /** Label text */
  label?: string
  /** Error message to display */
  error?: string
  /** Description / help text below the input */
  description?: string
  /** Whether the field is required (shows red asterisk) */
  required?: boolean
  /** Field layout orientation */
  orientation?: 'vertical' | 'horizontal' | 'responsive'
  /** Custom class for the root Field */
  class?: ClassValue
}
