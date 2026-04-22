import type { Meta, StoryObj } from '@storybook/vue3'
import InputPercent from './index.vue'

const meta = {
  title: 'UI/InputPercent',
  component: InputPercent,
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { InputPercent },
    setup () {
      const percent = ref(0.5)
      return { args, percent }
    },
    template: `
      <div class="max-w-xs space-y-4">
        <InputPercent v-model="percent" v-bind="args" />
        <div class="text-sm text-muted-foreground">Value: {{ percent }}</div>
      </div>
    `,
  }),
}
