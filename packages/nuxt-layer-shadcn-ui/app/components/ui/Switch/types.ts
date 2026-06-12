import type { SwitchRootProps } from 'reka-ui'

export interface SwitchProps extends /* @vue-ignore */ SwitchRootProps {
  /** Keep the value visible and focusable but prevent changing it */
  readonly?: boolean
}
