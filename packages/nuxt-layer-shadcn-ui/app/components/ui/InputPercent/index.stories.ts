import type { Meta, StoryObj } from '@storybook/vue3'
import InputPercent from './index.vue'

const meta = {
  title: 'UI/InputPercent',
  component: InputPercent,
  argTypes: {},
  args: {},
  render: args => ({
    components: { InputPercent },
    setup () {
      const percent = ref(0.5)
      return { args, percent }
    },
    template: `
      <div class="max-w-xs space-y-4">
        <InputPercent v-bind="args" v-model="percent" />
        <div class="text-sm text-muted-foreground">Value: {{ percent }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof InputPercent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
