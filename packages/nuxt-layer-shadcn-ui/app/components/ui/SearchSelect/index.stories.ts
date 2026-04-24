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

const defaultOptions = [
  { label: 'All Items', value: 'all' },
  { label: 'Featured', value: 'featured' },
]

const meta = {
  title: 'UI/SearchSelect',
  component: SearchSelect as any,
  argTypes: {
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    emptyText: { control: 'text' },
    searchEmptyText: { control: 'text' },
    createNewTo: { control: 'text' },
    createNewText: { control: 'text' },
    loadLimit: { control: 'number' },
    autoLoad: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: '',
    searchPlaceholder: '',
    emptyText: '',
    searchEmptyText: '',
    createNewTo: '',
    createNewText: '',
    loadLimit: 20,
    autoLoad: false,
    disabled: false,
  },
  render: args => ({
    components: { SearchSelect },
    setup () {
      const value = ref<string>()
      return { args, value, mockLoadMethod }
    },
    template: `
      <div class="max-w-sm">
        <SearchSelect
          v-model="value"
          :loadMethod="mockLoadMethod"
          v-bind="args"
        />
        <div class="mt-2 text-sm text-muted-foreground">Selected: {{ value ?? 'none' }}</div>
      </div>
    `,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Preselected: Story = {
  render: () => ({
    components: { SearchSelect },
    setup () {
      const value = ref<string>('item-42')
      return { value, mockLoadMethod, mockLoadValueOptionMethod }
    },
    template: `
      <div class="max-w-sm">
        <SearchSelect
          v-model="value"
          :loadMethod="mockLoadMethod"
          :loadValueOptionMethod="mockLoadValueOptionMethod"
          autoLoad
        />
        <div class="mt-2 text-sm text-muted-foreground">Selected: {{ value ?? 'none' }}</div>
      </div>
    `,
  }),
}

export const WithDefaultOptions: Story = {
  render: () => ({
    components: { SearchSelect },
    setup () {
      const value = ref<string>()
      return { value, mockLoadMethod, defaultOptions }
    },
    template: `
      <div class="max-w-sm">
        <SearchSelect
          v-model="value"
          :loadMethod="mockLoadMethod"
          :defaultOptions="defaultOptions"
          autoLoad
        />
        <div class="mt-2 text-sm text-muted-foreground">Selected: {{ value ?? 'none' }}</div>
      </div>
    `,
  }),
}

export const WithCreateNew: Story = {
  render: () => ({
    components: { SearchSelect },
    setup () {
      const value = ref<string>()
      return { value, mockLoadMethod }
    },
    template: `
      <div class="max-w-sm">
        <SearchSelect
          v-model="value"
          :loadMethod="mockLoadMethod"
          createNewTo="/create"
          autoLoad
        />
        <div class="mt-2 text-sm text-muted-foreground">Selected: {{ value ?? 'none' }}</div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { SearchSelect },
    setup () {
      const value = ref<string>()
      return { value, mockLoadMethod }
    },
    template: `
      <div class="max-w-sm">
        <SearchSelect v-model="value" :loadMethod="mockLoadMethod" disabled />
      </div>
    `,
  }),
}
