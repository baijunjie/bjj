import type { Meta, StoryObj } from '@storybook/vue3'
import InputCurrency from './index.vue'

const meta = {
  title: 'UI/InputCurrency',
  component: InputCurrency,
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
    components: { InputCurrency },
    setup () {
      const jpy = ref(1000)
      const usd = ref(49.99)
      const eurCode = ref(29.99)
      const cadSymbol = ref(79.99)
      const cadNarrow = ref(79.99)
      const jpyName = ref(5000)
      return { args, jpy, usd, eurCode, cadSymbol, cadNarrow, jpyName }
    },
    template: `
      <div class="space-y-10 max-w-xs">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <InputCurrency v-model="jpy" v-bind="args" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ jpy }}</div>
        </section>

        <!-- USD (symbol) -->
        <section>
          <h3 class="mb-4 text-lg font-medium">USD (symbol)</h3>
          <InputCurrency v-model="usd" currency="USD" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ usd }}</div>
        </section>

        <!-- EUR (code display) -->
        <section>
          <h3 class="mb-4 text-lg font-medium">EUR (code display)</h3>
          <InputCurrency v-model="eurCode" currency="EUR" currencyDisplay="code" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ eurCode }}</div>
        </section>

        <!-- CAD symbol vs narrowSymbol -->
        <section>
          <h3 class="mb-4 text-lg font-medium">CAD (symbol → CA$)</h3>
          <InputCurrency v-model="cadSymbol" currency="CAD" currencyDisplay="symbol" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ cadSymbol }}</div>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">CAD (narrowSymbol → $)</h3>
          <InputCurrency v-model="cadNarrow" currency="CAD" currencyDisplay="narrowSymbol" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ cadNarrow }}</div>
        </section>

        <!-- JPY (name display) -->
        <section>
          <h3 class="mb-4 text-lg font-medium">JPY (name display)</h3>
          <InputCurrency v-model="jpyName" currencyDisplay="name" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ jpyName }}</div>
        </section>
      </div>
    `,
  }),
}
