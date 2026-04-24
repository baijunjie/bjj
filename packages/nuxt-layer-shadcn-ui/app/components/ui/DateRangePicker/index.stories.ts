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
    modelValue: { start: null, end: null },
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
      const range = ref<DateRangePickerValue>({ start: null, end: null })
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

export const Default: Story = {}

export const WithTime: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const withTime = ref<DateRangePickerValue>({ start: null, end: null })
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
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const maxSpan = ref<DateRangePickerValue>({ start: null, end: null })
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
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const preselected = ref<DateRangePickerValue>({
        start: new Date(2025, 5, 1),
        end: new Date(2025, 5, 15),
      })
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
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const range = ref<DateRangePickerValue>({
        start: new Date(2025, 5, 1),
        end: new Date(2025, 5, 15),
      })
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
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const range = ref<DateRangePickerValue>({
        start: new Date(2025, 5, 1),
        end: new Date(2025, 5, 15),
      })
      return { range }
    },
    template: `
      <div class="max-w-lg">
        <DateRangePicker v-model="range" readonly />
      </div>
    `,
  }),
}
