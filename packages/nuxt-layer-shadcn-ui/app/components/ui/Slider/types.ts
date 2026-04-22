import type { SliderRootProps } from 'reka-ui'

export interface SliderProps extends /* @vue-ignore */ Omit<SliderRootProps, 'modelValue' | 'defaultValue'> {
  modelValue?: number | number[]
}
