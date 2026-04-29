import type { Meta, StoryObj } from '@storybook/vue3'
import ScrollArea from './index.vue'

const types = [ 'auto', 'always', 'scroll', 'hover' ] as const

const meta = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  argTypes: {
    fadeMask: { control: 'boolean' },
    type: { control: 'select', options: types },
    dir: { control: 'select', options: [ 'ltr', 'rtl' ]},
    scrollHideDelay: { control: 'number' },
  },
  args: {
    fadeMask: false,
    type: 'hover',
    dir: 'ltr',
    scrollHideDelay: 600,
  },
  render: args => ({
    components: { ScrollArea },
    setup () {
      const items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`)
      return { args, items }
    },
    template: `
      <div class="h-[250px] w-[250px] rounded-md border bg-card">
        <ScrollArea class="h-full" v-bind="args">
          <div class="p-4 space-y-2">
            <div
              v-for="item in items"
              :key="item"
              class="rounded-md border bg-muted px-3 py-2 text-sm"
            >
              {{ item }}
            </div>
          </div>
        </ScrollArea>
      </div>
    `,
  }),
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const FadeMask: Story = {
  parameters: noControls,
  args: {
    fadeMask: true,
  },
}

export const NoOverflow: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <ScrollArea class="h-full" fadeMask>
    <div class="p-4 space-y-2">
      <div v-for="item in fewItems" :key="item" class="rounded-md border bg-muted px-3 py-2 text-sm">
        {{ item }}
      </div>
    </div>
  </ScrollArea>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { ScrollArea },
    setup () {
      const fewItems = Array.from({ length: 3 }, (_, i) => `Item ${i + 1}`)
      return { fewItems }
    },
    template: `
      <div class="h-[250px] w-[250px] rounded-md border bg-card">
        <ScrollArea class="h-full" fadeMask>
          <div class="p-4 space-y-2">
            <div
              v-for="item in fewItems"
              :key="item"
              class="rounded-md border bg-muted px-3 py-2 text-sm"
            >
              {{ item }}
            </div>
          </div>
        </ScrollArea>
      </div>
    `,
  }),
}
