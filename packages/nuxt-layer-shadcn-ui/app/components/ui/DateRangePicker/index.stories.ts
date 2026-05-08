import type { Meta, StoryObj } from '@storybook/vue3'
import { useArgsModel } from '#storybook/argsModel'
import DateRangePicker from './index.vue'

const meta = {
  title: 'UI/DateRangePicker',
  component: DateRangePicker,
  argTypes: {
    start: { control: 'date' },
    end: { control: 'date' },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
    showTime: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    startPlaceholder: { control: 'text' },
    endPlaceholder: { control: 'text' },
    maxSpanDays: { control: 'number' },
    valueFormat: { control: 'text' },
    autoApply: { control: 'boolean' },
    class: { control: 'text' },
  },
  args: {
    start: null,
    end: null,
    minDate: undefined,
    maxDate: undefined,
    showTime: false,
    disabled: false,
    readonly: false,
    startPlaceholder: '',
    endPlaceholder: '',
    maxSpanDays: undefined,
    valueFormat: undefined,
    autoApply: true,
    class: '',
  },
  render: args => {
    const onUpdateStart = useArgsModel('start')
    const onUpdateEnd = useArgsModel('end')
    return {
      components: { DateRangePicker },
      setup: () => ({ args, onUpdateStart, onUpdateEnd }),
      template: `
        <div class="max-w-lg">
          <DateRangePicker
            v-bind="args"
            @update:start="onUpdateStart"
            @update:end="onUpdateEnd"
          />
          <div class="mt-2 text-sm text-muted-foreground">
            <div>Start: {{ args.start }}</div>
            <div>End: {{ args.end }}</div>
          </div>
        </div>
      `,
    }
  },
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
        code: '<DateRangePicker v-model:start="start" v-model:end="end" showTime />',
      },
    },
  },
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const start = ref<Date | string | null>(null)
      const end = ref<Date | string | null>(null)
      return { start, end }
    },
    template: `
      <div class="max-w-lg">
        <DateRangePicker v-model:start="start" v-model:end="end" showTime />
        <div class="mt-2 text-sm text-muted-foreground">
          <div>Start: {{ start }}</div>
          <div>End: {{ end }}</div>
        </div>
      </div>
    `,
  }),
}

export const MaxSpanDays: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DateRangePicker v-model:start="start" v-model:end="end" :maxSpanDays="7" />',
      },
    },
  },
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const start = ref<Date | string | null>(null)
      const end = ref<Date | string | null>(null)
      return { start, end }
    },
    template: `
      <div class="max-w-lg">
        <DateRangePicker v-model:start="start" v-model:end="end" :maxSpanDays="7" />
        <div class="mt-2 text-sm text-muted-foreground">
          <div>Start: {{ start }}</div>
          <div>End: {{ end }}</div>
        </div>
      </div>
    `,
  }),
}

export const Preselected: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DateRangePicker v-model:start="start" v-model:end="end" />',
      },
    },
  },
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const start = ref<Date | string | null>(new Date(2025, 5, 1))
      const end = ref<Date | string | null>(new Date(2025, 5, 15))
      return { start, end }
    },
    template: `
      <div class="max-w-lg">
        <DateRangePicker v-model:start="start" v-model:end="end" />
        <div class="mt-2 text-sm text-muted-foreground">
          <div>Start: {{ start }}</div>
          <div>End: {{ end }}</div>
        </div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DateRangePicker v-model:start="start" v-model:end="end" disabled />',
      },
    },
  },
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const start = ref<Date | string | null>(new Date(2025, 5, 1))
      const end = ref<Date | string | null>(new Date(2025, 5, 15))
      return { start, end }
    },
    template: `
      <div class="max-w-lg">
        <DateRangePicker v-model:start="start" v-model:end="end" disabled />
      </div>
    `,
  }),
}

export const Readonly: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<DateRangePicker v-model:start="start" v-model:end="end" readonly />',
      },
    },
  },
  render: () => ({
    components: { DateRangePicker },
    setup () {
      const start = ref<Date | string | null>(new Date(2025, 5, 1))
      const end = ref<Date | string | null>(new Date(2025, 5, 15))
      return { start, end }
    },
    template: `
      <div class="max-w-lg">
        <DateRangePicker v-model:start="start" v-model:end="end" readonly />
      </div>
    `,
  }),
}
