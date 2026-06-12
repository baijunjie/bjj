import type { CheckboxRootProps } from 'reka-ui'

export interface CheckboxProps extends /* @vue-ignore */ CheckboxRootProps {
  /** Keep the value visible and focusable but prevent changing it */
  readonly?: boolean
  invalid?: boolean
}
