import type { SwitchRootProps } from 'reka-ui'

export interface SwitchProps extends /* @vue-ignore */ SwitchRootProps {
  /** id of the switch element; the label of an enclosing FormItem points at it */
  id?: string
  /** Keep the value visible and focusable but prevent changing it */
  readonly?: boolean
}
