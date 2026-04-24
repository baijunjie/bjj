import type { Meta, StoryObj } from '@storybook/vue3'
import type { BadgeVariant } from './types'
import Icon from '../Icon/index.vue'
import Badge from './index.vue'

const variants = [ 'default', 'secondary', 'outline', 'destructive' ] as const satisfies readonly BadgeVariant[]

const meta = {
  title: 'UI/Badge',
  component: Badge,
  argTypes: {
    variant: { control: 'select', options: variants },
  },
  args: {
    variant: 'default',
  },
  render: args => ({
    components: { Badge },
    setup: () => ({ args }),
    template: '<Badge v-bind="args">Badge</Badge>',
  }),
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => ({
    components: { Badge },
    setup: () => ({ variants }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Badge v-for="v in variants" :key="v" :variant="v">{{ v }}</Badge>
      </div>
    `,
  }),
}

export const Numeric: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Badge>1</Badge>
        <Badge variant="secondary">42</Badge>
        <Badge variant="destructive">99+</Badge>
        <Badge variant="outline">0</Badge>
      </div>
    `,
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: { Badge, Icon },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Badge><Icon name="check" /> Approved</Badge>
        <Badge variant="secondary"><Icon name="clock" /> Pending</Badge>
        <Badge variant="destructive"><Icon name="x" /> Rejected</Badge>
        <Badge variant="outline"><Icon name="star" /> Featured</Badge>
      </div>
    `,
  }),
}
