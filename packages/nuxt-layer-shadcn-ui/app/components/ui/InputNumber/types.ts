import type { ControlSize } from '../../../types/control'

export type InputNumberAlign = 'left' | 'center' | 'right'

export interface InputNumberProps {
  /** id of the input element; the label of an enclosing FormItem points at it */
  id?: string
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
  /** Size tier. Unset follows the nearest ancestor's `data-control-size`, else `default`. */
  size?: ControlSize
  /** Fully rounded (pill) corners, as on Button */
  rounded?: boolean
  invalid?: boolean
  class?: ClassValue
}
