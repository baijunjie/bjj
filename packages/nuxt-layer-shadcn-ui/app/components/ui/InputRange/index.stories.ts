import type { Meta, StoryObj } from '@storybook/vue3'
import InputRange from './index.vue'

const meta = {
  title: 'UI/InputRange',
  component: InputRange,
  argTypes: {
    disabled: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
  },
  args: {
    disabled: false,
    min: 0,
    max: 100,
  },
} satisfies Meta<typeof InputRange>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { InputRange },
    setup () {
      const start = ref(20)
      const end = ref(80)
      return { args, start, end }
    },
    template: `
      <div class="max-w-md">
        <InputRange v-model:start="start" v-model:end="end" v-bind="args" />
        <div class="mt-2 text-sm text-muted-foreground">Start: {{ start }}, End: {{ end }}</div>
      </div>
    `,
  }),
}
