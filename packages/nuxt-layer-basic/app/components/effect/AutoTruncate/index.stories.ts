import type { Meta, StoryObj } from '@storybook/vue3'
import EffectAutoTruncate from './index.vue'

const sampleText = 'The quick brown fox jumps over the lazy dog 1234567890'

const meta = {
  title: 'Effect/AutoTruncate',
  component: EffectAutoTruncate,
  argTypes: {
    text: { control: 'text' },
    offset: { control: 'number' },
  },
  args: {
    text: sampleText,
    offset: 0,
  },
  render: args => ({
    components: { EffectAutoTruncate },
    setup: () => ({ args }),
    template: `
      <div class="space-y-2">
        <p class="text-xs text-gray-500">Drag the right edge → to resize the container — text re-truncates to fit</p>
        <div
          class="overflow-hidden rounded border-2 border-dashed border-gray-300 bg-gray-100 p-2"
          style="resize: horizontal; width: 320px; min-width: 100px; max-width: 720px;"
        >
          <EffectAutoTruncate v-bind="args" />
        </div>
      </div>
    `,
  }),
} satisfies Meta<typeof EffectAutoTruncate>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Offsets: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="space-y-3">
    <div class="space-y-1">
      <div class="text-xs text-gray-500">offset: 0 (default — truncate from end)</div>
      <div class="overflow-hidden rounded border-2 border-dashed border-gray-300 bg-gray-100 p-2" style="resize: horizontal; width: 280px;">
        <EffectAutoTruncate :text="sampleText" :offset="0" />
      </div>
    </div>
    <div class="space-y-1">
      <div class="text-xs text-gray-500">offset: 4 (preserve last 4 chars)</div>
      <div class="overflow-hidden rounded border-2 border-dashed border-gray-300 bg-gray-100 p-2" style="resize: horizontal; width: 280px;">
        <EffectAutoTruncate :text="sampleText" :offset="4" />
      </div>
    </div>
    <div class="space-y-1">
      <div class="text-xs text-gray-500">offset: 10 (preserve last 10 chars)</div>
      <div class="overflow-hidden rounded border-2 border-dashed border-gray-300 bg-gray-100 p-2" style="resize: horizontal; width: 280px;">
        <EffectAutoTruncate :text="sampleText" :offset="10" />
      </div>
    </div>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { EffectAutoTruncate },
    setup: () => ({ sampleText }),
    template: `
      <div class="space-y-2">
        <p class="text-xs text-gray-500">Drag the right edge → on each container to see how offset preserves the trailing characters</p>
        <div class="space-y-3">
          <div class="space-y-1">
            <div class="text-xs text-gray-500">offset: 0 (default — truncate from end)</div>
            <div
              class="overflow-hidden rounded border-2 border-dashed border-gray-300 bg-gray-100 p-2"
              style="resize: horizontal; width: 280px; min-width: 100px; max-width: 720px;"
            >
              <EffectAutoTruncate :text="sampleText" :offset="0" />
            </div>
          </div>
          <div class="space-y-1">
            <div class="text-xs text-gray-500">offset: 4 (preserve last 4 chars)</div>
            <div
              class="overflow-hidden rounded border-2 border-dashed border-gray-300 bg-gray-100 p-2"
              style="resize: horizontal; width: 280px; min-width: 100px; max-width: 720px;"
            >
              <EffectAutoTruncate :text="sampleText" :offset="4" />
            </div>
          </div>
          <div class="space-y-1">
            <div class="text-xs text-gray-500">offset: 10 (preserve last 10 chars)</div>
            <div
              class="overflow-hidden rounded border-2 border-dashed border-gray-300 bg-gray-100 p-2"
              style="resize: horizontal; width: 280px; min-width: 100px; max-width: 720px;"
            >
              <EffectAutoTruncate :text="sampleText" :offset="10" />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}
