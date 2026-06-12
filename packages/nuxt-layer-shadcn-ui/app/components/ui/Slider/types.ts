import type { SliderRootProps } from 'reka-ui'

export interface SliderProps extends /* @vue-ignore */ Omit<SliderRootProps, 'modelValue' | 'defaultValue'> {
  modelValue?: number | number[]
  /** Keep the value visible and focusable but prevent changing it */
  readonly?: boolean
}
