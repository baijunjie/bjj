import type { ControlSize } from '../../../types/control'

export interface InputProps {
  /** id of the input element; the label of an enclosing FormItem points at it */
  id?: string
  modelValue?: string
  /** Set to enable browser/password-manager autofill (e.g. 'email', 'current-password'). Defaults to 'off'. */
  autocomplete?: string
  /** Maximum number of characters allowed */
  maxlength?: number
  /** Show character count (rendered as `count / maxlength` when maxlength is set) */
  showCount?: boolean
  /** Size tier. Unset follows the nearest ancestor's `data-control-size`, else `default`. */
  size?: ControlSize
  /** Fully rounded (pill) corners, as on Button */
  rounded?: boolean
  readonly?: boolean
  disabled?: boolean
  invalid?: boolean
  class?: ClassValue
}
