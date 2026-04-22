import type { Meta, StoryObj } from '@storybook/vue3'
import Textarea from './index.vue'

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  argTypes: {
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    disabled: false,
    readonly: false,
    invalid: false,
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: `
      <div class="max-w-sm">
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Textarea v-bind="args" placeholder="Type your message here..." />
        </section>
      </div>
    `,
  }),
}
