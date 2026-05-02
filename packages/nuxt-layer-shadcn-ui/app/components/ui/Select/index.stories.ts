import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import Select from './index.vue'

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

const meta = {
  title: 'UI/Select',
  component: Select as any,
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    filter: { control: 'boolean' },
    multiple: { control: 'boolean' },
    searchPlaceholder: { control: 'text' },
    emptyText: { control: 'text' },
  },
  args: {
    placeholder: 'Select an option',
    disabled: false,
    loading: false,
    filter: false,
    multiple: false,
    searchPlaceholder: '',
    emptyText: '',
  },
  render: args => ({
    components: { Select },
    setup () {
      const value = ref<string>()
      return { args, value, frameworks }
    },
    template: `
      <div class="max-w-sm">
        <Select v-bind="args" v-model="value" :options="frameworks" />
        <div class="mt-2 text-sm text-muted-foreground">Selected: {{ value ?? 'none' }}</div>
      </div>
    `,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithFilter: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Select
    v-model="value"
    :options="manyOptions"
    placeholder="Search and select"
    filter
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Select },
    setup () {
      const value = ref<string>()
      return { value, manyOptions }
    },
    template: `
      <div class="max-w-sm">
        <Select
          v-model="value"
          :options="manyOptions"
          placeholder="Search and select"
          filter
        />
        <div class="mt-2 text-sm text-muted-foreground">Selected: {{ value ?? 'none' }}</div>
      </div>
    `,
  }),
}

export const Multiple: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Select
    v-model="value"
    :options="frameworks"
    placeholder="Select frameworks"
    multiple
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Select },
    setup () {
      const value = ref<string[]>([])
      return { value, frameworks }
    },
    template: `
      <div class="max-w-sm">
        <Select
          v-model="value"
          :options="frameworks"
          placeholder="Select frameworks"
          multiple
        />
        <div class="mt-2 text-sm text-muted-foreground">Selected: {{ value.length > 0 ? value.join(', ') : 'none' }}</div>
      </div>
    `,
  }),
}

export const WithDisabledOptions: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Select
    :options="withDisabled"
    placeholder="Select a framework"
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Select },
    setup () {
      return { withDisabled }
    },
    template: `
      <div class="max-w-sm">
        <Select
          :options="withDisabled"
          placeholder="Select a framework"
        />
      </div>
    `,
  }),
}

export const Scrollable: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Select
    v-model="value"
    :options="manyOptions"
    placeholder="Select an option"
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Select },
    setup () {
      const value = ref<string>()
      return { value, manyOptions }
    },
    template: `
      <div class="max-w-sm">
        <Select
          v-model="value"
          :options="manyOptions"
          placeholder="Select an option"
        />
        <div class="mt-2 text-sm text-muted-foreground">Selected: {{ value ?? 'none' }}</div>
      </div>
    `,
  }),
}

export const Grouped: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Select
    v-model="value"
    :options="withGroups"
    placeholder="Select a framework"
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Select },
    setup () {
      const value = ref<string>()
      return { value, withGroups }
    },
    template: `
      <div class="max-w-sm">
        <Select
          v-model="value"
          :options="withGroups"
          placeholder="Select a framework"
        />
        <div class="mt-2 text-sm text-muted-foreground">Selected: {{ value ?? 'none' }}</div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Select :options="frameworks" placeholder="Disabled select" disabled />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Select },
    setup () {
      return { frameworks }
    },
    template: `
      <div class="max-w-sm">
        <Select :options="frameworks" placeholder="Disabled select" disabled />
      </div>
    `,
  }),
}

export const Loading: Story = {
  parameters: noControls,
  args: {
    loading: true,
    placeholder: 'Loading options',
  },
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { Select, EventLog },
    setup () {
      const value = ref<string>()
      return { value, frameworks }
    },
    template: `
      <EventLog v-slot="{ record }">
        <div class="max-w-sm">
          <Select
            v-model="value"
            :options="frameworks"
            filter
            placeholder="Pick a framework"
            @update:modelValue="(v) => record('update:modelValue', v)"
            @search="(q) => record('search', q)"
            @open="record('open')"
            @close="record('close')"
          />
        </div>
      </EventLog>
    `,
  }),
}
