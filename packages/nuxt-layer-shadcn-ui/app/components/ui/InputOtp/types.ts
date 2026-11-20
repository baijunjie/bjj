import type { ControlSize } from '../../../types/control'

export interface InputOtpProps {
  modelValue?: string
  length?: number
  /** Size tier. Unset follows the nearest ancestor's `data-control-size`, else `default`. */
  size?: ControlSize
  readonly?: boolean
  disabled?: boolean
  invalid?: boolean
}
