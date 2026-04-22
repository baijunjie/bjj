import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '../Button/index.vue'
import Tooltip from './index.vue'

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Tooltip, Button },
    setup: () => ({ args }),
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Tooltip text="This is a tooltip" v-bind="args">
            <Button variant="outline">Hover me</Button>
          </Tooltip>
        </section>

        <!-- Positions -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Positions</h3>
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
        </section>

        <!-- Long Text -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Long Text</h3>
          <Tooltip text="This is a longer tooltip message that demonstrates how the tooltip handles multi-line content and wraps properly within its container.">
            <Button variant="outline">Long Tooltip</Button>
          </Tooltip>
        </section>
      </div>
    `,
  }),
}
