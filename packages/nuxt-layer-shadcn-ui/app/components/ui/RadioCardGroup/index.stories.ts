import type { Meta, StoryObj } from '@storybook/vue3'
import type { RadioCardGroupOption } from './types'
import RadioCardGroup from './index.vue'

const options: RadioCardGroupOption[] = [
  {
    value: 'current',
    title: 'Current view',
    description: 'Export with the currently applied filters and date range',
  },
  {
    value: 'custom',
    title: 'Custom range',
    description: 'Specify a date range to export data for the entire period',
  },
]

const manyOptions: RadioCardGroupOption[] = [
  {
    value: 'free',
    title: 'Free',
    description: '$0/month — For personal projects',
  },
  {
    value: 'pro',
    title: 'Pro',
    description: '$9/month — For small teams',
  },
  {
    value: 'enterprise',
    title: 'Enterprise',
    description: '$29/month — For large organizations',
    disabled: true,
  },
]

const meta = {
  title: 'UI/RadioCardGroup',
  component: RadioCardGroup,
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    options,
    disabled: false,
  },
} satisfies Meta<typeof RadioCardGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { RadioCardGroup },
    setup () {
      const selected = ref('current')
      return { args, selected, options }
    },
    template: `
      <div class="max-w-md space-y-4">
        <RadioCardGroup
          v-model="selected"
          :options="options"
          :disabled="args.disabled"
        />
        <div class="text-sm text-muted-foreground">Selected: {{ selected }}</div>
      </div>
    `,
  }),
}

export const WithDisabledOption: Story = {
  render: args => ({
    components: { RadioCardGroup },
    setup () {
      const selected = ref('pro')
      return { args, selected, manyOptions }
    },
    template: `
      <div class="max-w-md space-y-4">
        <RadioCardGroup
          v-model="selected"
          :options="manyOptions"
          :disabled="args.disabled"
        />
        <div class="text-sm text-muted-foreground">Selected: {{ selected }}</div>
      </div>
    `,
  }),
}
