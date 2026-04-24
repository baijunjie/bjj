import type { Meta, StoryObj } from '@storybook/vue3'
import InputNumber from './index.vue'

const meta = {
  title: 'UI/InputNumber',
  component: InputNumber,
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    placeholder: { control: 'text' },
    showButtons: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    min: undefined,
    max: undefined,
    step: 1,
    placeholder: '',
    showButtons: true,
    disabled: false,
    invalid: false,
  },
  render: args => ({
    components: { InputNumber },
    setup () {
      const value = ref(0)
      return { args, value }
    },
    template: `
      <div class="max-w-xs">
        <InputNumber v-model="value" v-bind="args" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof InputNumber>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithMinMax: Story = {
  render: () => ({
    components: { InputNumber },
    setup () {
      const value = ref(5)
      return { value }
    },
    template: `
      <div class="max-w-xs">
        <InputNumber v-model="value" :min="0" :max="10" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
}

export const CustomStep: Story = {
  render: () => ({
    components: { InputNumber },
    setup () {
      const value = ref(0)
      return { value }
    },
    template: `
      <div class="max-w-xs">
        <InputNumber v-model="value" :step="5" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
}

export const WithoutButtons: Story = {
  render: () => ({
    components: { InputNumber },
    setup () {
      const value = ref(0)
      return { value }
    },
    template: `
      <div class="max-w-xs">
        <InputNumber v-model="value" :showButtons="false" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { InputNumber },
    setup () {
      const value = ref(0)
      return { value }
    },
    template: `
      <div class="max-w-xs">
        <InputNumber v-model="value" disabled />
      </div>
    `,
  }),
}

export const Invalid: Story = {
  render: () => ({
    components: { InputNumber },
    setup () {
      const value = ref(0)
      return { value }
    },
    template: `
      <div class="max-w-xs">
        <InputNumber v-model="value" invalid />
      </div>
    `,
  }),
}
