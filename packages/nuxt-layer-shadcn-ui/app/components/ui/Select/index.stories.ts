import type { Meta, StoryObj } from '@storybook/vue3'
import Select from './index.vue'

const meta = {
  title: 'UI/Select',
  component: Select as any,
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Select },
    setup () {
      const selected = ref<string>()
      const filtered = ref<string>()
      const multiple = ref<string[]>([])
      const scrollable = ref<string>()
      const grouped = ref<string>()

      const frameworks = [
        { label: 'React', value: 'react' },
        { label: 'Vue', value: 'vue' },
        { label: 'Angular', value: 'angular' },
        { label: 'Svelte', value: 'svelte' },
      ]

      const withDisabled = [
        { label: 'React', value: 'react' },
        { label: 'Vue', value: 'vue' },
        { label: 'Angular', value: 'angular', disabled: true },
        { label: 'Svelte', value: 'svelte' },
      ]

      const manyOptions = Array.from({ length: 50 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `option-${i + 1}`,
      }))

      const withGroups = [
        { label: 'React', value: 'react', group: 'Frontend' },
        { label: 'Vue', value: 'vue', group: 'Frontend' },
        { label: 'Angular', value: 'angular', group: 'Frontend' },
        { label: 'Node.js', value: 'node', group: 'Backend' },
        { label: 'Django', value: 'django', group: 'Backend' },
        { label: 'Rails', value: 'rails', group: 'Backend' },
      ]

      return { args, selected, filtered, multiple, scrollable, grouped, frameworks, withDisabled, manyOptions, withGroups }
    },
    template: `
      <div class="space-y-10 max-w-sm">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Select
            v-model="selected"
            :options="frameworks"
            v-bind="args"
          />
          <div class="mt-2 text-sm text-muted-foreground">Selected: {{ selected ?? 'none' }}</div>
        </section>

        <!-- With Filter -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Filter</h3>
          <Select
            v-model="filtered"
            :options="manyOptions"
            placeholder="Search and select"
            filter
          />
          <div class="mt-2 text-sm text-muted-foreground">Selected: {{ filtered ?? 'none' }}</div>
        </section>

        <!-- Multiple -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Multiple</h3>
          <Select
            v-model="multiple"
            :options="frameworks"
            placeholder="Select frameworks"
            multiple
          />
          <div class="mt-2 text-sm text-muted-foreground">Selected: {{ multiple.length > 0 ? multiple.join(', ') : 'none' }}</div>
        </section>

        <!-- With Disabled Options -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Disabled Options</h3>
          <Select
            :options="withDisabled"
            placeholder="Select a framework"
          />
        </section>

        <!-- Scrollable (50 items) -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Scrollable (50 items)</h3>
          <Select
            v-model="scrollable"
            :options="manyOptions"
            placeholder="Select an option"
          />
          <div class="mt-2 text-sm text-muted-foreground">Selected: {{ scrollable ?? 'none' }}</div>
        </section>

        <!-- Grouped -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Grouped</h3>
          <Select
            v-model="grouped"
            :options="withGroups"
            placeholder="Select a framework"
          />
          <div class="mt-2 text-sm text-muted-foreground">Selected: {{ grouped ?? 'none' }}</div>
        </section>
      </div>
    `,
  }),
}
