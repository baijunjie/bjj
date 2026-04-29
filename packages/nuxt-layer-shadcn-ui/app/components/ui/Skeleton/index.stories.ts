import type { Meta, StoryObj } from '@storybook/vue3'
import Skeleton from './index.vue'

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: {
    width: '200px',
    height: '20px',
  },
  render: args => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: '<Skeleton v-bind="args" />',
  }),
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const VariousSizes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="space-y-3">
    <Skeleton width="100%" height="12px" />
    <Skeleton width="80%" height="12px" />
    <Skeleton width="60%" height="12px" />
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="space-y-3">
        <Skeleton width="100%" height="12px" />
        <Skeleton width="80%" height="12px" />
        <Skeleton width="60%" height="12px" />
      </div>
    `,
  }),
}

export const CardSkeleton: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex items-center gap-4">
    <Skeleton width="48px" height="48px" class="rounded-full" />
    <div class="space-y-2">
      <Skeleton width="160px" height="16px" />
      <Skeleton width="120px" height="12px" />
    </div>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex items-center gap-4">
        <Skeleton width="48px" height="48px" class="rounded-full" />
        <div class="space-y-2">
          <Skeleton width="160px" height="16px" />
          <Skeleton width="120px" height="12px" />
        </div>
      </div>
    `,
  }),
}
