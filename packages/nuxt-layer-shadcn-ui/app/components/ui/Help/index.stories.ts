import type { Meta, StoryObj } from '@storybook/vue3'
import Help from './index.vue'

const positions = [ 'top', 'bottom', 'left', 'right' ] as const

const meta = {
  title: 'UI/Help',
  component: Help,
  argTypes: {
    text: { control: 'text' },
    position: { control: 'select', options: positions },
  },
  args: {
    text: 'This is a helpful tooltip',
    position: 'top',
  },
  render: args => ({
    components: { Help },
    setup: () => ({ args }),
    template: '<Help v-bind="args" />',
  }),
} satisfies Meta<typeof Help>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Positions: Story = {
  render: () => ({
    components: { Help },
    template: `
      <div class="flex items-center gap-8 py-10 justify-center">
        <div class="flex flex-col items-center gap-2">
          <Help text="Top tooltip" position="top" />
          <span class="text-sm text-muted-foreground">Top</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Help text="Bottom tooltip" position="bottom" />
          <span class="text-sm text-muted-foreground">Bottom</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Help text="Left tooltip" position="left" />
          <span class="text-sm text-muted-foreground">Left</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Help text="Right tooltip" position="right" />
          <span class="text-sm text-muted-foreground">Right</span>
        </div>
      </div>
    `,
  }),
}

export const InlineWithLabel: Story = {
  render: () => ({
    components: { Help },
    template: `
      <div class="flex items-center gap-1">
        <span class="text-sm font-medium">API Key</span>
        <Help text="Your unique API key for authentication" />
      </div>
    `,
  }),
}
