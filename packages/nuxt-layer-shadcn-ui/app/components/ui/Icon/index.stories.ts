import type { Meta, StoryObj } from '@storybook/vue3'
import { Coffee } from 'lucide-vue-next'
import Icon from './index.vue'

const commonIcons = [
  'house', 'search', 'settings', 'user', 'mail', 'bell',
  'heart', 'star', 'plus', 'minus', 'check', 'x',
  'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down',
  'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
  'eye', 'eye-off', 'trash-2', 'pencil', 'copy', 'download',
  'upload', 'share', 'link', 'external-link', 'info', 'triangle-alert',
]

const meta = {
  title: 'UI/Icon',
  component: Icon,
  argTypes: {
    name: { control: 'text' },
    size: { control: 'number' },
    strokeWidth: { control: 'number' },
    absoluteStrokeWidth: { control: 'boolean' },
    class: { control: 'text' },
  },
  args: {
    name: 'house',
    size: undefined,
    strokeWidth: undefined,
    absoluteStrokeWidth: false,
    class: '',
  },
  render: args => ({
    components: { Icon },
    setup: () => ({ args }),
    template: '<Icon v-bind="args" />',
  }),
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const CommonIcons: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="grid grid-cols-8 gap-4">
    <div
      v-for="name in commonIcons"
      :key="name"
      class="flex flex-col items-center gap-2 rounded-md border p-3"
    >
      <Icon :name="name" class="size-5" />
      <span class="text-xs text-muted-foreground">{{ name }}</span>
    </div>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Icon },
    setup: () => ({ commonIcons }),
    template: `
      <div class="grid grid-cols-8 gap-4">
        <div
          v-for="name in commonIcons"
          :key="name"
          class="flex flex-col items-center gap-2 rounded-md border p-3"
        >
          <Icon :name="name" class="size-5" />
          <span class="text-xs text-muted-foreground">{{ name }}</span>
        </div>
      </div>
    `,
  }),
}

export const FromComponent: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<script setup lang="ts">
import { Coffee } from 'lucide-vue-next'
</script>

<template>
  <Icon :name="Coffee" class="size-6" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Icon },
    setup: () => ({ Coffee }),
    template: '<Icon :name="Coffee" class="size-6" />',
  }),
}

export const Sizes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex items-end gap-4">
    <Icon name="star" :size="12" />
    <Icon name="star" :size="16" />
    <Icon name="star" :size="20" />
    <Icon name="star" :size="24" />
    <Icon name="star" :size="32" />
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Icon },
    template: `
      <div class="flex items-end gap-4">
        <Icon name="star" :size="12" />
        <Icon name="star" :size="16" />
        <Icon name="star" :size="20" />
        <Icon name="star" :size="24" />
        <Icon name="star" :size="32" />
      </div>
    `,
  }),
}

export const StrokeWidth: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex items-end gap-4">
    <Icon name="heart" class="size-6" :stroke-width="1" />
    <Icon name="heart" class="size-6" :stroke-width="1.5" />
    <Icon name="heart" class="size-6" :stroke-width="2" />
    <Icon name="heart" class="size-6" :stroke-width="2.5" />
    <Icon name="heart" class="size-6" :stroke-width="3" />
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Icon },
    template: `
      <div class="flex items-end gap-4">
        <Icon name="heart" class="size-6" :stroke-width="1" />
        <Icon name="heart" class="size-6" :stroke-width="1.5" />
        <Icon name="heart" class="size-6" :stroke-width="2" />
        <Icon name="heart" class="size-6" :stroke-width="2.5" />
        <Icon name="heart" class="size-6" :stroke-width="3" />
      </div>
    `,
  }),
}
