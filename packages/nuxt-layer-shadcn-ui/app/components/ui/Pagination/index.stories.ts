import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import Pagination from './index.vue'

const sizes = [ 'default', 'sm' ] as const

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  argTypes: {
    page: { control: { type: 'number', min: 1 }},
    total: { control: { type: 'number', min: 0 }},
    pageSize: { control: { type: 'number', min: 1 }},
    pageSizeOptions: { control: 'object' },
    simple: { control: 'boolean' },
    siblingCount: { control: { type: 'number', min: 0 }},
    size: { control: 'select', options: sizes },
  },
  args: {
    page: 1,
    total: 85,
    pageSize: 10,
    pageSizeOptions: [ 10, 20, 50 ],
    simple: false,
    siblingCount: 1,
    size: 'default',
  },
  render: args => ({
    components: { Pagination },
    setup: () => ({ args }),
    template: '<Pagination v-bind="args" />',
  }),
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Sizes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Pagination :page="3" :total="85" :pageSize="10" size="default" />
  <Pagination :page="3" :total="85" :pageSize="10" size="sm" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Pagination },
    setup: () => ({ sizes }),
    template: `
      <div class="space-y-3">
        <div v-for="s in sizes" :key="s" class="flex flex-wrap items-center gap-3">
          <span class="w-16 text-sm text-muted-foreground">{{ s }}</span>
          <Pagination :page="3" :total="85" :pageSize="10" :size="s" />
        </div>
      </div>
    `,
  }),
}

export const Simple: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Pagination :page="3" :total="85" :pageSize="10" simple size="default" />
  <Pagination :page="3" :total="85" :pageSize="10" simple size="sm" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Pagination },
    setup: () => ({ sizes }),
    template: `
      <div class="space-y-3">
        <div v-for="s in sizes" :key="s" class="flex flex-wrap items-center gap-3">
          <span class="w-16 text-sm text-muted-foreground">{{ s }}</span>
          <Pagination :page="3" :total="85" :pageSize="10" simple :size="s" />
        </div>
      </div>
    `,
  }),
}

export const EventHandling: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Pagination
    v-model:page="page"
    v-model:pageSize="pageSize"
    :total="85"
    :pageSizeOptions="[10, 20, 50]"
    @update:page="onPageUpdate"
    @update:pageSize="onPageSizeUpdate"
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Pagination, EventLog },
    setup () {
      const page = ref(1)
      const pageSize = ref(10)
      return { page, pageSize }
    },
    template: `
      <EventLog v-slot="{ record }">
        <Pagination
          v-model:page="page"
          v-model:pageSize="pageSize"
          :total="85"
          :pageSizeOptions="[10, 20, 50]"
          @update:page="(v) => record('update:page', v)"
          @update:pageSize="(v) => record('update:pageSize', v)"
        />
      </EventLog>
    `,
  }),
}
