import type { PopoverContentProps } from 'reka-ui'

export interface PopoverProps extends /* @vue-ignore */ PopoverContentProps {
  /** Trigger mode for showing the popover. Defaults to 'click'. */
  trigger?: 'click' | 'hover'
  /** Gap kept from the viewport edges when repositioning on collision. Defaults to 8. */
  collisionPadding?: PopoverContentProps['collisionPadding']
  /** Extra class for the popover content container. */
  class?: ClassValue
}
