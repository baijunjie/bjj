import type { InputNumberProps } from '../InputNumber/types'

export interface InputRangeProps extends /* @vue-ignore */ InputNumberProps {
  start?: number
  end?: number
  min?: number
  max?: number
  /** Placeholder for start input */
  startPlaceholder?: string
  /** Placeholder for end input */
  endPlaceholder?: string
}
