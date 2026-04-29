import type { Meta, StoryObj } from '@storybook/vue3'
import type { DatePickerType } from './types'
import DatePicker from './index.vue'

const types: DatePickerType[] = [ 'date', 'month', 'year' ]

const meta = {
  title: 'UI/DatePicker',
  component: DatePicker,
  argTypes: {
    modelValue: { control: 'date' },
    type: { control: 'select', options: types },
    showTime: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    placeholder: { control: 'text' },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
    valueFormat: { control: 'text' },
    autoApply: { control: 'boolean' },
    class: { control: 'text' },
  },
  args: {
    modelValue: null,
    type: 'date',
    showTime: false,
    disabled: false,
    readonly: false,
    placeholder: '',
    minDate: undefined,
    maxDate: undefined,
    valueFormat: '',
    autoApply: false,
    class: '',
  },
  render: args => ({
    components: { DatePicker },
    setup () {
      const value = ref<Date | string | null>(null)
      return { args, value }
    },
    template: `
      <div class="max-w-xs">
        <DatePicker v-model="value" v-bind="args" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const MonthPicker: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DatePicker v-model="month" type="month" placeholder="Pick a month" />',
      },
    },
  },
  render: () => ({
    components: { DatePicker },
    setup () {
      const month = ref<Date | null>(null)
      return { month }
    },
    template: `
      <div class="max-w-xs">
        <DatePicker v-model="month" type="month" placeholder="Pick a month" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ month }}</div>
      </div>
    `,
  }),
}

export const YearPicker: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DatePicker v-model="year" type="year" placeholder="Pick a year" />',
      },
    },
  },
  render: () => ({
    components: { DatePicker },
    setup () {
      const year = ref<Date | null>(null)
      return { year }
    },
    template: `
      <div class="max-w-xs">
        <DatePicker v-model="year" type="year" placeholder="Pick a year" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ year }}</div>
      </div>
    `,
  }),
}

export const WithTime: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DatePicker v-model="date" showTime />',
      },
    },
  },
  render: () => ({
    components: { DatePicker },
    setup () {
      const date = ref<Date | null>(null)
      return { date }
    },
    template: `
      <div class="max-w-xs">
        <DatePicker v-model="date" showTime />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ date }}</div>
      </div>
    `,
  }),
}

export const Preselected: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DatePicker v-model="preselected" />',
      },
    },
  },
  render: () => ({
    components: { DatePicker },
    setup () {
      const preselected = ref<Date>(new Date(2025, 5, 15))
      return { preselected }
    },
    template: `
      <div class="max-w-xs">
        <DatePicker v-model="preselected" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ preselected }}</div>
      </div>
    `,
  }),
}

export const ValueFormat: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DatePicker v-model="formatted" valueFormat="yyyy-MM-dd" placeholder="Pick a date" />',
      },
    },
  },
  render: () => ({
    components: { DatePicker },
    setup () {
      const formatted = ref<string | null>(null)
      return { formatted }
    },
    template: `
      <div class="max-w-xs">
        <DatePicker v-model="formatted" valueFormat="yyyy-MM-dd" placeholder="Pick a date" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ formatted }}</div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DatePicker v-model="date" disabled />',
      },
    },
  },
  render: () => ({
    components: { DatePicker },
    setup () {
      const date = ref<Date>(new Date(2025, 5, 15))
      return { date }
    },
    template: `
      <div class="max-w-xs">
        <DatePicker v-model="date" disabled />
      </div>
    `,
  }),
}

export const Readonly: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DatePicker v-model="date" readonly />',
      },
    },
  },
  render: () => ({
    components: { DatePicker },
    setup () {
      const date = ref<Date>(new Date(2025, 5, 15))
      return { date }
    },
    template: `
      <div class="max-w-xs">
        <DatePicker v-model="date" readonly />
      </div>
    `,
  }),
}
