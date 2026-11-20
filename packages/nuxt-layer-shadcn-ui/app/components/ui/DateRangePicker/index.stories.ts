import type { Meta, StoryObj } from '@storybook/vue3'
import { useArgsModel } from '#storybook/argsModel'
import DateRangePicker from './index.vue'

const sizes = [ 'xs', 'sm', 'default', 'lg' ] as const

const meta = {
  title: 'UI/DateRangePicker',
  component: DateRangePicker,
  argTypes: {
    start: { control: 'date' },
    end: { control: 'date' },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
    showTime: { control: 'boolean' },
    size: { control: 'select', options: sizes },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    invalid: { control: 'boolean' },
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
    size: 'default',
    disabled: false,
    readonly: false,
    invalid: false,
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

export const Sizes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <DateRangePicker v-model:start="start" v-model:end="end" size="sm" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { DateRangePicker },
    setup: () => ({ sizes, start: ref(new Date(2026, 10, 1)), end: ref(new Date(2026, 10, 20)) }),
    template: `
      <div class="space-y-3">
        <div v-for="s in sizes" :key="s" class="flex items-center gap-3">
          <span class="w-14 text-sm text-muted-foreground">{{ s }}</span>
          <DateRangePicker v-model:start="start" v-model:end="end" :size="s" class="w-120" />
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

export const Invalid: Story = {
  parameters: noControls,
  args: {
    invalid: true,
  },
}
