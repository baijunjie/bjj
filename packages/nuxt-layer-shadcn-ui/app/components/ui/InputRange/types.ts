import type { Component } from 'vue'
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
  /** Inner input component. Defaults to `InputNumber`; can be replaced with `InputCurrency`, `InputPercent`, etc. */
  as?: Component
}
