import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import { useArgsModel } from '#storybook/argsModel'
import InputNumber from './index.vue'

const meta = {
  title: 'UI/InputNumber',
  component: InputNumber,
  argTypes: {
    modelValue: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    placeholder: { control: 'text' },
    showButtons: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    modelValue: 0,
    min: undefined,
    max: undefined,
    step: 1,
    placeholder: '',
    showButtons: true,
    disabled: false,
    invalid: false,
  },
  render: args => {
    const onUpdate = useArgsModel()
    return {
      components: { InputNumber },
      setup: () => ({ args, onUpdate }),
      template: `
        <div class="max-w-xs">
          <InputNumber v-bind="args" @update:modelValue="onUpdate" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ args.modelValue }}</div>
        </div>
      `,
    }
  },
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
