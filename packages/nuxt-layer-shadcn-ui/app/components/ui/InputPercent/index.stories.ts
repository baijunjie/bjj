import type { Meta, StoryObj } from '@storybook/vue3'
import { useArgsModel } from '#storybook/argsModel'
import InputPercent from './index.vue'

const sizes = [ 'xs', 'sm', 'md', 'default', 'lg' ] as const

const meta = {
  title: 'UI/InputPercent',
  component: InputPercent as any,
  argTypes: {
    modelValue: { control: 'number' },
    size: { control: 'select', options: sizes },
    readonly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    modelValue: 0.5,
    size: 'default',
    readonly: false,
    disabled: false,
    invalid: false,
  },
  render: args => {
    const onUpdate = useArgsModel()
    return {
      components: { InputPercent },
      setup: () => ({ args, onUpdate }),
      template: `
        <div class="max-w-xs space-y-4">
          <InputPercent v-bind="args" @update:modelValue="onUpdate" />
          <div class="text-sm text-muted-foreground">Value: {{ args.modelValue }}</div>
        </div>
      `,
    }
  },
} satisfies Meta

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
  <InputPercent v-model="value" size="sm" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { InputPercent },
    setup: () => ({ sizes, value: ref(0.5) }),
    template: `
      <div class="space-y-3">
        <div v-for="s in sizes" :key="s" class="flex items-center gap-3">
          <span class="w-14 text-sm text-muted-foreground">{{ s }}</span>
          <InputPercent v-model="value" :size="s" class="w-48" />
        </div>
      </div>
    `,
  }),
}

export const Invalid: Story = {
  parameters: noControls,
  args: {
    invalid: true,
  },
}
