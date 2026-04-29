import type { Meta, StoryObj } from '@storybook/vue3'
import Divider from './index.vue'

const types = [ 'horizontal', 'vertical' ] as const

const meta = {
  title: 'UI/Divider',
  component: Divider,
  argTypes: {
    type: { control: 'select', options: types },
  },
  args: {
    type: 'horizontal',
  },
  render: args => ({
    components: { Divider },
    setup: () => ({ args }),
    template: `
      <div v-if="args.type === 'vertical'" class="flex h-8 items-center gap-4">
        <span>Left</span>
        <Divider v-bind="args" />
        <span>Right</span>
      </div>
      <div v-else class="space-y-4">
        <p>Content above</p>
        <Divider v-bind="args" />
        <p>Content below</p>
      </div>
    `,
  }),
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Vertical: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex h-8 items-center gap-4">
    <span>Left</span>
    <Divider type="vertical" />
    <span>Center</span>
    <Divider type="vertical" />
    <span>Right</span>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Divider },
    template: `
      <div class="flex h-8 items-center gap-4">
        <span>Left</span>
        <Divider type="vertical" />
        <span>Center</span>
        <Divider type="vertical" />
        <span>Right</span>
      </div>
    `,
  }),
}
