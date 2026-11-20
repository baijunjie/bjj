import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import { useArgsModel } from '#storybook/argsModel'
import type { SearchSelectLoadMethodParams, SearchSelectLoadMethodResult } from './types'
import SearchSelect from './index.vue'

const sizes = [ 'xs', 'sm', 'default', 'lg' ] as const

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
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    emptyText: { control: 'text' },
    searchEmptyText: { control: 'text' },
    createNewTo: { control: 'text' },
    createNewText: { control: 'text' },
    loadLimit: { control: 'number' },
    autoLoad: { control: 'boolean' },
    size: { control: 'select', options: sizes },
    readonly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    modelValue: undefined,
    placeholder: '',
    searchPlaceholder: '',
    emptyText: '',
    searchEmptyText: '',
    createNewTo: '',
    createNewText: '',
    loadLimit: 20,
    autoLoad: false,
    size: 'default',
    readonly: false,
    disabled: false,
    invalid: false,
  },
  render: args => {
    const onUpdate = useArgsModel()
    return {
      components: { SearchSelect },
      setup: () => ({ args, onUpdate, mockLoadMethod }),
      template: `
        <div class="max-w-sm">
          <SearchSelect
            v-bind="args"
            :loadMethod="mockLoadMethod"
            @update:modelValue="onUpdate"
          />
          <div class="mt-2 text-sm text-muted-foreground">Selected: {{ args.modelValue ?? 'none' }}</div>
        </div>
      `,
    }
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Preselected: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <SearchSelect
    v-model="value"
    :loadMethod="loadMethod"
    :loadValueOptionMethod="loadValueOptionMethod"
    autoLoad
  />
</template>
`.trim(),
      },
    },
  },
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
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <SearchSelect
    v-model="value"
    :loadMethod="loadMethod"
    :defaultOptions="defaultOptions"
    autoLoad
  />
</template>
`.trim(),
      },
    },
  },
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
  parameters: noControls,
  args: {
    createNewTo: '/create',
    autoLoad: true,
  },
}

export const Sizes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <SearchSelect v-model="value" :loadMethod="loadMethod" size="sm" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { SearchSelect },
    setup: () => ({ sizes, mockLoadMethod, value: ref<string>() }),
    template: `
      <div class="space-y-3">
        <div v-for="s in sizes" :key="s" class="flex items-center gap-3">
          <span class="w-14 text-sm text-muted-foreground">{{ s }}</span>
          <div class="w-64">
            <SearchSelect v-model="value" :loadMethod="mockLoadMethod" :size="s" />
          </div>
        </div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: noControls,
  args: {
    disabled: true,
  },
}

export const Invalid: Story = {
  parameters: noControls,
  args: {
    invalid: true,
  },
}

export const EventHandling: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <SearchSelect
    v-model="value"
    :loadMethod="loadMethod"
    autoLoad
    @update:modelValue="onUpdate"
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { SearchSelect, EventLog },
    setup () {
      const value = ref<string>()
      return { value, mockLoadMethod }
    },
    template: `
      <EventLog v-slot="{ record }">
        <div class="max-w-sm">
          <SearchSelect
            v-model="value"
            :loadMethod="mockLoadMethod"
            autoLoad
            @update:modelValue="(v) => record('update:modelValue', v)"
          />
        </div>
      </EventLog>
    `,
  }),
}
