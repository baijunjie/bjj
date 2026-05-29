import type { Meta, StoryObj } from '@storybook/vue3'
import EffectCornerRibbon from './index.vue'

const positions = [ 'top-left', 'top-right', 'bottom-right', 'bottom-left' ] as const
const offsets = [ 0, 16, 32 ] as const

// The ribbon is `position: fixed`, so it anchors to the viewport unless an ancestor
// establishes a containing block. `transform: translateZ(0)` on the wrapper makes the
// ribbon resolve against the card instead, so `overflow: hidden` can clip it to the corner.
const cardClass = 'relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50'
const cardStyle = 'transform: translateZ(0)'

const meta = {
  title: 'Effect/CornerRibbon',
  component: EffectCornerRibbon,
  argTypes: {
    label: { control: 'text' },
    position: { control: 'select', options: positions },
    offset: { control: 'number' },
  },
  args: {
    label: 'NEW',
    position: 'top-left',
    offset: 0,
  },
  render: args => ({
    components: { EffectCornerRibbon },
    setup: () => ({ args, cardClass, cardStyle }),
    template: `
      <div :class="cardClass" :style="cardStyle" class="h-40 w-72">
        <EffectCornerRibbon v-bind="args" />
        <div class="flex h-full items-center justify-center text-sm text-gray-400">Card content</div>
      </div>
    `,
  }),
} satisfies Meta<typeof EffectCornerRibbon>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Positions: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div
    v-for="p in positions"
    :key="p"
    class="relative h-32 overflow-hidden"
    style="transform: translateZ(0)"
  >
    <EffectCornerRibbon label="NEW" :position="p" />
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { EffectCornerRibbon },
    setup: () => ({ positions, cardClass, cardStyle }),
    template: `
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="p in positions"
          :key="p"
          :class="cardClass"
          :style="cardStyle"
          class="h-32"
        >
          <EffectCornerRibbon label="NEW" :position="p" />
          <div class="flex h-full items-center justify-center text-xs text-gray-400">{{ p }}</div>
        </div>
      </div>
    `,
  }),
}

export const Offset: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div
    v-for="o in offsets"
    :key="o"
    class="relative h-32 overflow-hidden"
    style="transform: translateZ(0)"
  >
    <EffectCornerRibbon label="NEW" :offset="o" />
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { EffectCornerRibbon },
    setup: () => ({ offsets, cardClass, cardStyle }),
    template: `
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="o in offsets"
          :key="o"
          :class="cardClass"
          :style="cardStyle"
          class="h-32"
        >
          <EffectCornerRibbon label="NEW" :offset="o" />
          <div class="flex h-full items-center justify-center text-xs text-gray-400">offset: {{ o }}</div>
        </div>
      </div>
    `,
  }),
}
