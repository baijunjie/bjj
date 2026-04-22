import type { Meta, StoryObj } from '@storybook/vue3'
import type { SearchSelectLoadMethodParams, SearchSelectLoadMethodResult } from './types'
import SearchSelect from './index.vue'

// Mock data: 100 items for simulating server-side search
const allItems = Array.from({ length: 100 }, (_, i) => ({
  label: `Item ${i + 1}`,
  value: `item-${i + 1}`,
}))

// Simulate async API call with keyword filter and pagination
function mockLoadMethod (params: SearchSelectLoadMethodParams): Promise<SearchSelectLoadMethodResult<string>> {
  return new Promise(resolve => {
    setTimeout(() => {
      const filtered = allItems.filter(item =>
        item.label.toLowerCase().includes(params.keyword.toLowerCase()),
      )
      const items = filtered.slice(params.offset, params.offset + params.limit)
      resolve({ items, total: filtered.length })
    }, 500)
  })
}

// Simulate fetching a single item by value
function mockLoadValueOptionMethod (value: string) {
  return new Promise<{ label: string, value: string } | null>(resolve => {
    setTimeout(() => {
      const item = allItems.find(i => i.value === value)
      resolve(item ?? null)
    }, 200)
  })
}

const meta = {
  title: 'UI/SearchSelect',
  component: SearchSelect as any,
  argTypes: {
    autoLoad: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    autoLoad: false,
    disabled: false,
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { SearchSelect },
    setup () {
      const selected = ref<string>()
      const withPreselect = ref<string>('item-42')
      const withDefaults = ref<string>()
      const withCreateNew = ref<string>()

      const defaultOptions = [
        { label: 'All Items', value: 'all' },
        { label: 'Featured', value: 'featured' },
      ]

      return {
        args,
        selected,
        withPreselect,
        withDefaults,
        withCreateNew,
        defaultOptions,
        mockLoadMethod,
        mockLoadValueOptionMethod,
      }
    },
    template: `
      <div class="space-y-10 max-w-sm">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <SearchSelect
            v-model="selected"
            :loadMethod="mockLoadMethod"
            v-bind="args"
          />
          <div class="mt-2 text-sm text-muted-foreground">Selected: {{ selected ?? 'none' }}</div>
        </section>

        <!-- Pre-selected Value -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Pre-selected Value (item-42)</h3>
          <SearchSelect
            v-model="withPreselect"
            :loadMethod="mockLoadMethod"
            :loadValueOptionMethod="mockLoadValueOptionMethod"
            autoLoad
          />
          <div class="mt-2 text-sm text-muted-foreground">Selected: {{ withPreselect ?? 'none' }}</div>
        </section>

        <!-- With Default Options -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Default Options</h3>
          <SearchSelect
            v-model="withDefaults"
            :loadMethod="mockLoadMethod"
            :defaultOptions="defaultOptions"
            autoLoad
          />
          <div class="mt-2 text-sm text-muted-foreground">Selected: {{ withDefaults ?? 'none' }}</div>
        </section>

        <!-- With Create New -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Create New</h3>
          <SearchSelect
            v-model="withCreateNew"
            :loadMethod="mockLoadMethod"
            createNewTo="/create"
            autoLoad
          />
          <div class="mt-2 text-sm text-muted-foreground">Selected: {{ withCreateNew ?? 'none' }}</div>
        </section>
      </div>
    `,
  }),
}
