import type { Meta, StoryObj } from '@storybook/vue3'
import type { TagColor, TagSize, TagVariant } from './types'
import EventLog from '#storybook/EventLog.vue'
import Tag from './index.vue'

const colors: TagColor[] = [ 'default', 'primary', 'success', 'info', 'help', 'warn', 'danger' ]
const variants: TagVariant[] = [ 'solid', 'soft', 'bordered', 'flat' ]
const sizes: TagSize[] = [ 'sm', 'md' ]

const meta = {
  title: 'UI/Tag',
  component: Tag,
  argTypes: {
    color: { control: 'select', options: colors },
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
    closable: { control: 'boolean' },
    closeLabel: { control: 'text' },
  },
  args: {
    color: 'default',
    variant: 'soft',
    size: 'md',
    closable: false,
    closeLabel: '',
  },
  render: args => ({
    components: { Tag },
    setup: () => ({ args }),
    template: '<Tag v-bind="args">Tag</Tag>',
  }),
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Colors: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex flex-wrap items-center gap-3">
    <Tag v-for="c in colors" :key="c" :color="c">{{ c }}</Tag>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Tag },
    setup: () => ({ colors }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Tag v-for="c in colors" :key="c" :color="c">{{ c }}</Tag>
      </div>
    `,
  }),
}

export const Variants: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex flex-wrap items-center gap-3">
    <Tag v-for="v in variants" :key="v" :variant="v">{{ v }}</Tag>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Tag },
    setup: () => ({ variants }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Tag v-for="v in variants" :key="v" :variant="v">{{ v }}</Tag>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex flex-wrap items-center gap-3">
    <Tag v-for="s in sizes" :key="s" :size="s">{{ s }}</Tag>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Tag },
    setup: () => ({ sizes }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Tag v-for="s in sizes" :key="s" :size="s">{{ s }}</Tag>
      </div>
    `,
  }),
}

export const VariantColorMatrix: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="space-y-3">
    <div v-for="v in variants" :key="v" class="flex flex-wrap items-center gap-3">
      <span class="w-20 text-sm text-muted-foreground">{{ v }}</span>
      <Tag v-for="c in colors" :key="c" :color="c" :variant="v">{{ c }}</Tag>
    </div>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Tag },
    setup: () => ({ colors, variants }),
    template: `
      <div class="space-y-3">
        <div v-for="v in variants" :key="v" class="flex flex-wrap items-center gap-3">
          <span class="w-20 text-sm text-muted-foreground">{{ v }}</span>
          <Tag v-for="c in colors" :key="c" :color="c" :variant="v">{{ c }}</Tag>
        </div>
      </div>
    `,
  }),
}

export const Closable: Story = {
  parameters: noControls,
  args: {
    closable: true,
    closeLabel: 'Remove filter',
  },
}

export const ClosableSizes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex flex-wrap items-center gap-3">
    <Tag v-for="s in sizes" :key="s" :size="s" closable>{{ s }}</Tag>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Tag },
    setup: () => ({ sizes }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Tag v-for="s in sizes" :key="s" :size="s" closable>{{ s }}</Tag>
      </div>
    `,
  }),
}

export const ClosableVariantColorMatrix: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="space-y-3">
    <div v-for="v in variants" :key="v" class="flex flex-wrap items-center gap-3">
      <span class="w-20 text-sm text-muted-foreground">{{ v }}</span>
      <Tag v-for="c in colors" :key="c" :color="c" :variant="v" closable>{{ c }}</Tag>
    </div>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Tag },
    setup: () => ({ colors, variants }),
    template: `
      <div class="space-y-3">
        <div v-for="v in variants" :key="v" class="flex flex-wrap items-center gap-3">
          <span class="w-20 text-sm text-muted-foreground">{{ v }}</span>
          <Tag v-for="c in colors" :key="c" :color="c" :variant="v" closable>{{ c }}</Tag>
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
<script setup lang="ts">
const filters = ref([ 'Status: Active', 'Plan: Pro', 'Region: Tokyo' ])

function remove (name: string) {
  filters.value = filters.value.filter(f => f !== name)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Tag
      v-for="name in filters"
      :key="name"
      color="info"
      class="rounded-full"
      closable
      :close-label="'Remove ' + name"
      @close="remove(name)"
    >
      {{ name }}
    </Tag>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Tag, EventLog },
    setup () {
      const initial = [ 'Status: Active', 'Plan: Pro', 'Region: Tokyo' ]
      const filters = ref([ ...initial ])
      const remove = (name: string) => {
        filters.value = filters.value.filter(f => f !== name)
      }
      const reset = () => {
        filters.value = [ ...initial ]
      }
      return { filters, remove, reset }
    },
    template: `
      <EventLog v-slot="{ record }">
        <div class="flex flex-wrap items-center gap-2">
          <Tag
            v-for="name in filters"
            :key="name"
            color="info"
            class="rounded-full"
            closable
            :close-label="'Remove ' + name"
            @close="record('close', name); remove(name)"
          >
            {{ name }}
          </Tag>
          <button
            v-if="!filters.length"
            type="button"
            class="text-sm text-muted-foreground underline"
            @click="reset"
          >
            Reset
          </button>
        </div>
      </EventLog>
    `,
  }),
}
