import type { PopoverContentProps } from 'reka-ui'

export interface PopoverProps extends /* @vue-ignore */ PopoverContentProps {
  /** Trigger mode for showing the popover. Defaults to 'click'. */
  trigger?: 'click' | 'hover'
  /** Extra class for the popover content container. */
  class?: ClassValue
}
