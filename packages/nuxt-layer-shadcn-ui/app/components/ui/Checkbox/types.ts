import type { CheckboxRootProps } from 'reka-ui'

export interface CheckboxProps extends /* @vue-ignore */ CheckboxRootProps {
  /** id of the checkbox element; the label of an enclosing FormItem points at it */
  id?: string
  /** Keep the value visible and focusable but prevent changing it */
  readonly?: boolean
  invalid?: boolean
}
