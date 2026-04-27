import type { Meta, StoryObj } from '@storybook/vue3'
import Loading from './index.vue'

const meta = {
  title: 'UI/Loading',
  component: Loading,
  argTypes: {
    class: { control: 'text' },
  },
  args: {
    class: '',
  },
  render: args => ({
    components: { Loading },
    setup: () => ({ args }),
    template: '<Loading :class="args.class" />',
  }),
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const CustomSize: Story = {
  parameters: noControls,
  render: () => ({
    components: { Loading },
    template: `
      <div class="flex items-end gap-6">
        <Loading class="size-6" />
        <Loading class="size-10" />
        <Loading class="size-16" />
      </div>
    `,
  }),
}
