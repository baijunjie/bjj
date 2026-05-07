import type { Meta, StoryObj } from '@storybook/vue3'
import EffectIntersectionChecker from './index.vue'

const meta = {
  title: 'Effect/IntersectionChecker',
  component: EffectIntersectionChecker,
  argTypes: {
    disabled: { control: 'boolean' },
    options: { control: 'object' },
  },
  args: {
    disabled: false,
    options: undefined,
  },
  render: args => ({
    components: { EffectIntersectionChecker },
    setup () {
      const count = ref(0)
      return { args, count }
    },
    template: `
      <div class="rounded border p-2">
        <div class="mb-2 text-xs text-gray-500">Scroll inside the box ↓ — show event count: {{ count }}</div>
        <div class="h-40 overflow-y-auto rounded border border-dashed border-gray-300 p-3">
          <div class="h-60 text-sm text-gray-500">Keep scrolling…</div>
          <EffectIntersectionChecker v-bind="args" @show="count++">
            <div class="rounded bg-blue-100 p-3 text-sm">Visible!</div>
          </EffectIntersectionChecker>
        </div>
      </div>
    `,
  }),
} satisfies Meta<typeof EffectIntersectionChecker>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Disabled: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="rounded border p-2">
    <div class="mb-2 text-xs text-gray-500">disabled: true — show event count stays at {{ count }}</div>
    <div class="h-40 overflow-y-auto rounded border border-dashed border-gray-300 p-3">
      <div class="h-60 text-sm text-gray-500">Keep scrolling…</div>
      <EffectIntersectionChecker disabled @show="count++">
        <div class="rounded bg-gray-100 p-3 text-sm text-gray-500">Observer is disabled — no event</div>
      </EffectIntersectionChecker>
    </div>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { EffectIntersectionChecker },
    setup () {
      const count = ref(0)
      return { count }
    },
    template: `
      <div class="rounded border p-2">
        <div class="mb-2 text-xs text-gray-500">disabled: true — show event count stays at {{ count }}</div>
        <div class="h-40 overflow-y-auto rounded border border-dashed border-gray-300 p-3">
          <div class="h-60 text-sm text-gray-500">Keep scrolling…</div>
          <EffectIntersectionChecker disabled @show="count++">
            <div class="rounded bg-gray-100 p-3 text-sm text-gray-500">Observer is disabled — no event</div>
          </EffectIntersectionChecker>
        </div>
      </div>
    `,
  }),
}

export const LazyLoad: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="rounded border p-2">
    <div class="mb-2 text-xs text-gray-500">Scroll to bottom to lazy-load more items</div>
    <div class="h-60 overflow-y-auto rounded border border-dashed border-gray-300 p-3 space-y-2">
      <div v-for="item in items" :key="item" class="rounded bg-gray-100 p-2 text-sm">{{ item }}</div>
      <EffectIntersectionChecker
        v-if="hasMore"
        :disabled="isLoading"
        class="flex items-center justify-center py-2 text-xs text-gray-500"
        @show="loadMore"
      >
        {{ isLoading ? 'Loading…' : 'Load more' }}
      </EffectIntersectionChecker>
      <div v-else class="py-2 text-center text-xs text-gray-500">No more items</div>
    </div>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { EffectIntersectionChecker },
    setup () {
      const items = ref(Array.from({ length: 5 }, (_, i) => `Item ${i + 1}`))
      const isLoading = ref(false)
      const hasMore = ref(true)

      function loadMore () {
        if (isLoading.value || !hasMore.value) return
        isLoading.value = true
        setTimeout(() => {
          const start = items.value.length
          const next = Array.from({ length: 5 }, (_, i) => `Item ${start + i + 1}`)
          items.value.push(...next)
          isLoading.value = false
          if (items.value.length >= 25) hasMore.value = false
        }, 600)
      }

      return { items, isLoading, hasMore, loadMore }
    },
    template: `
      <div class="rounded border p-2">
        <div class="mb-2 text-xs text-gray-500">Scroll to bottom to lazy-load more items</div>
        <div class="h-60 overflow-y-auto rounded border border-dashed border-gray-300 p-3 space-y-2">
          <div v-for="item in items" :key="item" class="rounded bg-gray-100 p-2 text-sm">{{ item }}</div>
          <EffectIntersectionChecker
            v-if="hasMore"
            :disabled="isLoading"
            class="flex items-center justify-center py-2 text-xs text-gray-500"
            @show="loadMore"
          >
            {{ isLoading ? 'Loading…' : 'Load more' }}
          </EffectIntersectionChecker>
          <div v-else class="py-2 text-center text-xs text-gray-500">No more items</div>
        </div>
      </div>
    `,
  }),
}

export const WithOptions: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="rounded border p-2">
    <div class="mb-2 text-xs text-gray-500">threshold: 1 (fully visible) — count: {{ count }}</div>
    <div class="h-40 overflow-y-auto rounded border border-dashed border-gray-300 p-3">
      <div class="h-60 text-sm text-gray-500">Keep scrolling until the box is fully visible…</div>
      <EffectIntersectionChecker :options="{ threshold: 1, rootMargin: '0px' }" @show="count++">
        <div class="rounded bg-blue-100 p-3 text-sm">Fully visible!</div>
      </EffectIntersectionChecker>
    </div>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { EffectIntersectionChecker },
    setup () {
      const count = ref(0)
      const options = { threshold: 1, rootMargin: '0px' }
      return { count, options }
    },
    template: `
      <div class="rounded border p-2">
        <div class="mb-2 text-xs text-gray-500">threshold: 1 (fully visible) — count: {{ count }}</div>
        <div class="h-40 overflow-y-auto rounded border border-dashed border-gray-300 p-3">
          <div class="h-60 text-sm text-gray-500">Keep scrolling until the box is fully visible…</div>
          <EffectIntersectionChecker :options="options" @show="count++">
            <div class="rounded bg-blue-100 p-3 text-sm">Fully visible!</div>
          </EffectIntersectionChecker>
        </div>
      </div>
    `,
  }),
}
