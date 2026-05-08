import type { Meta, StoryObj } from '@storybook/vue3'
import { useArgsModel } from '#storybook/argsModel'
import InputCurrency from './index.vue'

const currencyDisplays = [ 'symbol', 'narrowSymbol', 'code', 'name' ] as const

const meta = {
  title: 'UI/InputCurrency',
  component: InputCurrency as any,
  argTypes: {
    modelValue: { control: 'number' },
    currency: { control: 'text' },
    currencyDisplay: { control: 'select', options: currencyDisplays },
  },
  args: {
    modelValue: 1000,
    currency: 'JPY',
    currencyDisplay: 'symbol',
  },
  render: args => {
    const onUpdate = useArgsModel()
    return {
      components: { InputCurrency },
      setup: () => ({ args, onUpdate }),
      template: `
        <div class="max-w-xs">
          <InputCurrency v-bind="args" @update:modelValue="onUpdate" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ args.modelValue }}</div>
        </div>
      `,
    }
  },
} satisfies Meta

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
