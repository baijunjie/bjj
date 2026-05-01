import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
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
        <InputNumber v-bind="args" v-model="value" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof InputNumber>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithMinMax: Story = {
  parameters: noControls,
  args: {
    min: 0,
    max: 10,
  },
}

export const CustomStep: Story = {
  parameters: noControls,
  args: {
    step: 5,
  },
}

export const WithoutButtons: Story = {
  parameters: noControls,
  args: {
    showButtons: false,
  },
}

export const Disabled: Story = {
  parameters: noControls,
  args: {
    disabled: true,
  },
}

export const Invalid: Story = {
  parameters: noControls,
  args: {
    invalid: true,
  },
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { InputNumber, EventLog },
    setup: () => ({ value: ref(0) }),
    template: `
      <EventLog v-slot="{ record }">
        <div class="max-w-xs">
          <InputNumber
            v-model="value"
            @update:modelValue="(v) => record('update:modelValue', v)"
          />
        </div>
      </EventLog>
    `,
  }),
}
