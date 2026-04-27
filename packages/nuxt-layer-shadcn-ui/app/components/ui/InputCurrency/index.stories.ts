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
  render: () => ({
    components: { InputCurrency },
    setup () {
      const value = ref(49.99)
      return { value }
    },
    template: `
      <div class="max-w-xs">
        <InputCurrency v-model="value" currency="USD" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
}

export const EurCodeDisplay: Story = {
  parameters: noControls,
  render: () => ({
    components: { InputCurrency },
    setup () {
      const value = ref(29.99)
      return { value }
    },
    template: `
      <div class="max-w-xs">
        <InputCurrency v-model="value" currency="EUR" currencyDisplay="code" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
}

export const CadSymbol: Story = {
  parameters: noControls,
  render: () => ({
    components: { InputCurrency },
    setup () {
      const value = ref(79.99)
      return { value }
    },
    template: `
      <div class="max-w-xs">
        <InputCurrency v-model="value" currency="CAD" currencyDisplay="symbol" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
}

export const CadNarrowSymbol: Story = {
  parameters: noControls,
  render: () => ({
    components: { InputCurrency },
    setup () {
      const value = ref(79.99)
      return { value }
    },
    template: `
      <div class="max-w-xs">
        <InputCurrency v-model="value" currency="CAD" currencyDisplay="narrowSymbol" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
}

export const JpyNameDisplay: Story = {
  parameters: noControls,
  render: () => ({
    components: { InputCurrency },
    setup () {
      const value = ref(5000)
      return { value }
    },
    template: `
      <div class="max-w-xs">
        <InputCurrency v-model="value" currencyDisplay="name" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
}
