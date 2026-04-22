import type { Meta, StoryObj } from '@storybook/vue3'
import InputNumber from './index.vue'

const meta = {
  title: 'UI/InputNumber',
  component: InputNumber,
  argTypes: {
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    showButtons: { control: 'boolean' },
  },
  args: {
    disabled: false,
    invalid: false,
    showButtons: true,
  },
} satisfies Meta<typeof InputNumber>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { InputNumber },
    setup () {
      const basic = ref(0)
      const minMax = ref(5)
      const stepped = ref(0)
      return { args, basic, minMax, stepped }
    },
    template: `
      <div class="space-y-10 max-w-xs">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <InputNumber v-model="basic" v-bind="args" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ basic }}</div>
        </section>

        <!-- With Min / Max -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Min / Max (0 - 10)</h3>
          <InputNumber v-model="minMax" :min="0" :max="10" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ minMax }}</div>
        </section>

        <!-- Custom Step -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Custom Step (5)</h3>
          <InputNumber v-model="stepped" :step="5" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ stepped }}</div>
        </section>
      </div>
    `,
  }),
}
