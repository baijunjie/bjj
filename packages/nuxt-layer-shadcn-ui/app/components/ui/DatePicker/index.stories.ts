import type { Meta, StoryObj } from '@storybook/vue3'
import DatePicker from './index.vue'

const meta = {
  title: 'UI/DatePicker',
  component: DatePicker,
  argTypes: {
    showTime: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    showTime: false,
    disabled: false,
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { DatePicker },
    setup () {
      const date = ref<Date | null>(null)
      const preselected = ref<Date>(new Date(2025, 5, 15))
      const formatted = ref<string | null>(null)
      const month = ref<Date | null>(null)
      const year = ref<Date | null>(null)
      return { args, date, month, year, preselected, formatted }
    },
    template: `
      <div class="space-y-10 max-w-xs">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <DatePicker v-model="date" v-bind="args" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ date }}</div>
        </section>

        <!-- Month Picker -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Month Picker</h3>
          <DatePicker v-model="month" type="month" placeholder="Pick a month" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ month }}</div>
        </section>

        <!-- Year Picker -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Year Picker</h3>
          <DatePicker v-model="year" type="year" placeholder="Pick a year" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ year }}</div>
        </section>

        <!-- Preselected -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Preselected</h3>
          <DatePicker v-model="preselected" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ preselected }}</div>
        </section>

        <!-- Value Format -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Value Format (yyyy-MM-dd)</h3>
          <DatePicker v-model="formatted" valueFormat="yyyy-MM-dd" placeholder="Pick a date" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ formatted }}</div>
        </section>
      </div>
    `,
  }),
}
