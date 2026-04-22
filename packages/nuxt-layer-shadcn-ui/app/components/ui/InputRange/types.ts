import type { InputNumberProps } from '../InputNumber/types'

export interface InputRangeProps extends /* @vue-ignore */ InputNumberProps {
  start?: number
  end?: number
  min?: number
  max?: number
}
