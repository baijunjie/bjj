import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
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

const planOptions: RadioCardGroupOption[] = [
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
    modelValue: { control: 'text' },
    options: { control: 'object' },
    disabled: { control: 'boolean' },
  },
  args: {
    modelValue: 'current',
    options,
    disabled: false,
  },
  render: args => ({
    components: { RadioCardGroup },
    setup () {
      const selected = ref(args.modelValue ?? '')
      return { args, selected }
    },
    template: `
      <div class="max-w-md space-y-4">
        <RadioCardGroup v-bind="args" v-model="selected" />
        <div class="text-sm text-muted-foreground">Selected: {{ selected }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof RadioCardGroup>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithDisabledOption: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <RadioCardGroup v-model="selected" :options="planOptions" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { RadioCardGroup },
    setup () {
      const selected = ref('pro')
      return { selected, planOptions }
    },
    template: `
      <div class="max-w-md space-y-4">
        <RadioCardGroup v-model="selected" :options="planOptions" />
        <div class="text-sm text-muted-foreground">Selected: {{ selected }}</div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: noControls,
  args: {
    disabled: true,
  },
}

export const EventHandling: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <RadioCardGroup
    v-model="selected"
    :options="options"
    @update:modelValue="onUpdate"
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { RadioCardGroup, EventLog },
    setup () {
      const selected = ref('current')
      return { selected, options }
    },
    template: `
      <EventLog v-slot="{ record }">
        <div class="max-w-md">
          <RadioCardGroup
            v-model="selected"
            :options="options"
            @update:modelValue="(v) => record('update:modelValue', v)"
          />
        </div>
      </EventLog>
    `,
  }),
}
