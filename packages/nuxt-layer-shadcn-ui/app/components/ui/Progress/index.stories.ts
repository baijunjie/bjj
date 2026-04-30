import type { Meta, StoryObj } from '@storybook/vue3'
import Progress from './index.vue'

const meta = {
  title: 'UI/Progress',
  component: Progress,
  argTypes: {
    modelValue: { control: { type: 'number', min: 0, max: 100 }},
    max: { control: 'number' },
  },
  args: {
    modelValue: 50,
    max: 100,
  },
  render: args => ({
    components: { Progress },
    setup: () => ({ args }),
    template: `
      <div class="max-w-sm">
        <Progress v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const CustomMax: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Progress :modelValue="150" :max="200" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Progress },
    template: `
      <div class="max-w-sm space-y-2">
        <Progress :modelValue="150" :max="200" />
        <div class="text-sm text-muted-foreground">150 / 200</div>
      </div>
    `,
  }),
}

export const Animated: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Progress :modelValue="value" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Progress },
    setup () {
      const value = ref(0)
      const id = setInterval(() => {
        value.value = (value.value + 5) % 105
      }, 300)
      onUnmounted(() => clearInterval(id))
      return { value }
    },
    template: `
      <div class="max-w-sm space-y-2">
        <Progress :modelValue="value" />
        <div class="text-sm text-muted-foreground">{{ value }}%</div>
      </div>
    `,
  }),
}
