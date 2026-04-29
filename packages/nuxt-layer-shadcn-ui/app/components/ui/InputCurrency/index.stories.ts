import type { Meta, StoryObj } from '@storybook/vue3'
import InputCurrency from './index.vue'

const currencyDisplays = [ 'symbol', 'narrowSymbol', 'code', 'name' ] as const

const meta = {
  title: 'UI/InputCurrency',
  component: InputCurrency,
  argTypes: {
    currency: { control: 'text' },
    currencyDisplay: { control: 'select', options: currencyDisplays },
  },
  args: {
    currency: 'JPY',
    currencyDisplay: 'symbol',
  },
  render: args => ({
    components: { InputCurrency },
    setup () {
      const value = ref(1000)
      return { args, value }
    },
    template: `
      <div class="max-w-xs">
        <InputCurrency v-model="value" v-bind="args" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof InputCurrency>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const UsdSymbol: Story = {
  parameters: noControls,
  args: {
    currency: 'USD',
    currencyDisplay: 'symbol',
  },
}

export const EurCodeDisplay: Story = {
  parameters: noControls,
  args: {
    currency: 'EUR',
    currencyDisplay: 'code',
  },
}

export const CadSymbol: Story = {
  parameters: noControls,
  args: {
    currency: 'CAD',
    currencyDisplay: 'symbol',
  },
}

export const CadNarrowSymbol: Story = {
  parameters: noControls,
  args: {
    currency: 'CAD',
    currencyDisplay: 'narrowSymbol',
  },
}

export const JpyNameDisplay: Story = {
  parameters: noControls,
  args: {
    currency: 'JPY',
    currencyDisplay: 'name',
  },
}
