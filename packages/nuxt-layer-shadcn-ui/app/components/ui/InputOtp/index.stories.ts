import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import InputOtp from './index.vue'

const meta = {
  title: 'UI/InputOtp',
  component: InputOtp,
  argTypes: {
    modelValue: { control: 'text' },
    length: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: {
    modelValue: '',
    length: 6,
    disabled: false,
  },
  render: args => ({
    components: { InputOtp },
    setup () {
      return { args }
    },
    template: `
      <div class="space-y-4">
        <InputOtp v-bind="args" @update:modelValue="v => args.modelValue = v" />
        <div class="text-sm text-muted-foreground">Value: {{ args.modelValue }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof InputOtp>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const CustomLength: Story = {
  parameters: noControls,
  args: {
    length: 4,
  },
}

export const Disabled: Story = {
  parameters: noControls,
  args: {
    disabled: true,
    modelValue: '123456',
  },
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { InputOtp, EventLog },
    setup: () => ({ otp: ref('') }),
    template: `
      <EventLog v-slot="{ record }">
        <InputOtp
          v-model="otp"
          @update:modelValue="(v) => record('update:modelValue', v)"
          @complete="(v) => record('complete', v)"
        />
      </EventLog>
    `,
  }),
}
