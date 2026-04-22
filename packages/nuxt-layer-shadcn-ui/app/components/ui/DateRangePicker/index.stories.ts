import type { Meta, StoryObj } from '@storybook/vue3'
import DateRangePicker from './index.vue'

const meta = {
  title: 'UI/DateRangePicker',
  component: DateRangePicker,
  argTypes: {
    showTime: { control: 'boolean' },
    disabled: { control: 'boolean' },
    maxSpanDays: { control: 'number' },
  },
  args: {
    showTime: false,
    disabled: false,
    maxSpanDays: undefined,
  },
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { DateRangePicker },
    setup () {
      const range = ref({ start: null, end: null })
      const withTime = ref({ start: null, end: null })
      const maxSpan = ref({ start: null, end: null })
      const preselected = ref({
        start: new Date(2025, 5, 1),
        end: new Date(2025, 5, 15),
      })
      return { args, range, withTime, maxSpan, preselected }
    },
    template: `
      <div class="max-w-lg space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <DateRangePicker v-model="range" v-bind="args" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ range }}</div>
        </section>

        <!-- With Time -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Time</h3>
          <DateRangePicker v-model="withTime" showTime />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ withTime }}</div>
        </section>

        <!-- Max Span (7 days) -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Max Span (7 days)</h3>
          <DateRangePicker v-model="maxSpan" :maxSpanDays="7" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ maxSpan }}</div>
        </section>

        <!-- Preselected -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Preselected</h3>
          <DateRangePicker v-model="preselected" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ preselected }}</div>
        </section>
      </div>
    `,
  }),
}
