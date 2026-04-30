import type { Meta, StoryObj } from '@storybook/vue3'
import type { DateRangePickerValue } from './types'
import DateRangePicker from './index.vue'

const meta = {
  title: 'UI/DateRangePicker',
  component: DateRangePicker,
  argTypes: {
    modelValue: { control: 'object' },
    showTime: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    startPlaceholder: { control: 'text' },
    endPlaceholder: { control: 'text' },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
    maxSpanDays: { control: 'number' },
    valueFormat: { control: 'text' },
    autoApply: { control: 'boolean' },
    class: { control: 'text' },
  },
  args: {
    modelValue: [ null, null ],
    showTime: false,
    disabled: false,
    readonly: false,
    startPlaceholder: '',
    endPlaceholder: '',
    minDate: undefined,
    maxDate: undefined,
    maxSpanDays: undefined,
    valueFormat: '',
    autoApply: false,
    class: '',
  },
  render: args => ({
    components: { DateRangePicker },
    setup () {
      const range = ref<DateRangePickerValue>([ null, null ])
      return { args, range }
    },
    template: `
      <div class="max-w-lg">
        <DateRangePicker v-model="range" v-bind="args" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ range }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithTime: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DateRangePicker v-model="withTime" showTime />',
      },
    },
  },
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const withTime = ref<DateRangePickerValue>([ null, null ])
      return { withTime }
    },
    template: `
      <div class="max-w-lg">
        <DateRangePicker v-model="withTime" showTime />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ withTime }}</div>
      </div>
    `,
  }),
}

export const MaxSpanDays: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DateRangePicker v-model="maxSpan" :maxSpanDays="7" />',
      },
    },
  },
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const maxSpan = ref<DateRangePickerValue>([ null, null ])
      return { maxSpan }
    },
    template: `
      <div class="max-w-lg">
        <DateRangePicker v-model="maxSpan" :maxSpanDays="7" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ maxSpan }}</div>
      </div>
    `,
  }),
}

export const Preselected: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DateRangePicker v-model="preselected" />',
      },
    },
  },
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const preselected = ref<DateRangePickerValue>([
        new Date(2025, 5, 1),
        new Date(2025, 5, 15),
      ])
      return { preselected }
    },
    template: `
      <div class="max-w-lg">
        <DateRangePicker v-model="preselected" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ preselected }}</div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DateRangePicker v-model="range" disabled />',
      },
    },
  },
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const range = ref<DateRangePickerValue>([
        new Date(2025, 5, 1),
        new Date(2025, 5, 15),
      ])
      return { range }
    },
    template: `
      <div class="max-w-lg">
        <DateRangePicker v-model="range" disabled />
      </div>
    `,
  }),
}

export const Readonly: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DateRangePicker v-model="range" readonly />',
      },
    },
  },
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const range = ref<DateRangePickerValue>([
        new Date(2025, 5, 1),
        new Date(2025, 5, 15),
      ])
      return { range }
    },
    template: `
      <div class="max-w-lg">
        <DateRangePicker v-model="range" readonly />
      </div>
    `,
  }),
}
