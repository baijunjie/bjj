import type { Meta, StoryObj } from '@storybook/vue3'
import type { RadioGroupItem } from './types'
import RadioGroup from './index.vue'

const options: RadioGroupItem[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

const plans: RadioGroupItem[] = [
  { value: 'free', label: 'Free - $0/month' },
  { value: 'pro', label: 'Pro - $9/month' },
  { value: 'enterprise', label: 'Enterprise - $29/month', disabled: true },
]

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  argTypes: {
    items: { control: 'object' },
    modelValue: { control: 'text' },
    disabled: { control: 'boolean' },
    orientation: { control: 'inline-radio', options: [ 'vertical', 'horizontal' ]},
  },
  args: {
    items: options,
    modelValue: 'option1',
    disabled: false,
    orientation: 'vertical',
  },
  render: args => ({
    components: { RadioGroup },
    setup: () => ({ args }),
    template: '<RadioGroup v-bind="args" />',
  }),
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Horizontal: Story = {
  parameters: noControls,
  render: () => ({
    components: { RadioGroup },
    setup () {
      const selected = ref('option1')
      return { options, selected }
    },
    template: `
      <div class="space-y-2">
        <RadioGroup v-model="selected" :items="options" orientation="horizontal" />
        <div class="text-sm text-muted-foreground">Selected: {{ selected }}</div>
      </div>
    `,
  }),
}

export const WithDisabledItem: Story = {
  parameters: noControls,
  render: () => ({
    components: { RadioGroup },
    setup () {
      const plan = ref('pro')
      return { plans, plan }
    },
    template: `
      <div class="space-y-2">
        <RadioGroup v-model="plan" :items="plans" />
        <div class="text-sm text-muted-foreground">Plan: {{ plan }}</div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: noControls,
  render: () => ({
    components: { RadioGroup },
    setup () {
      const selected = ref('option1')
      return { options, selected }
    },
    template: '<RadioGroup v-model="selected" :items="options" disabled />',
  }),
}

export const CustomSlots: Story = {
  parameters: noControls,
  render: () => ({
    components: { RadioGroup },
    setup () {
      const plan = ref('pro')
      return { plans, plan }
    },
    template: `
      <div class="space-y-2">
        <RadioGroup v-model="plan" :items="plans">
          <template #label="{ item, checked }">
            <span :class="checked ? 'font-semibold text-primary' : 'text-foreground'">
              {{ item.label }}
            </span>
          </template>
        </RadioGroup>
        <div class="text-sm text-muted-foreground">Plan: {{ plan }}</div>
      </div>
    `,
  }),
}
