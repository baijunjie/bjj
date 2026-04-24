import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '../Button/index.vue'
import Tooltip from './index.vue'

const positions = [ 'top', 'bottom', 'left', 'right' ] as const

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  argTypes: {
    text: { control: 'text' },
    position: { control: 'select', options: positions },
    disabled: { control: 'boolean' },
    disableClosingTrigger: { control: 'boolean' },
  },
  args: {
    text: 'This is a tooltip',
    position: 'top',
    disabled: false,
    disableClosingTrigger: false,
  },
  render: args => ({
    components: { Tooltip, Button },
    setup: () => ({ args }),
    template: `
      <Tooltip v-bind="args">
        <Button variant="outline">Hover me</Button>
      </Tooltip>
    `,
  }),
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Positions: Story = {
  render: () => ({
    components: { Tooltip, Button },
    template: `
      <div class="flex flex-wrap items-center gap-4 py-10 justify-center">
        <Tooltip text="Top tooltip" position="top">
          <Button variant="outline">Top</Button>
        </Tooltip>
        <Tooltip text="Bottom tooltip" position="bottom">
          <Button variant="outline">Bottom</Button>
        </Tooltip>
        <Tooltip text="Left tooltip" position="left">
          <Button variant="outline">Left</Button>
        </Tooltip>
        <Tooltip text="Right tooltip" position="right">
          <Button variant="outline">Right</Button>
        </Tooltip>
      </div>
    `,
  }),
}

export const LongText: Story = {
  render: () => ({
    components: { Tooltip, Button },
    template: `
      <Tooltip text="This is a longer tooltip message that demonstrates how the tooltip handles multi-line content and wraps properly within its container.">
        <Button variant="outline">Long Tooltip</Button>
      </Tooltip>
    `,
  }),
}
