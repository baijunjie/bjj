import type { Meta, StoryObj } from '@storybook/vue3'
import { useArgsModel } from '#storybook/argsModel'
import InputPercent from './index.vue'

const meta = {
  title: 'UI/InputPercent',
  component: InputPercent as any,
  argTypes: {
    modelValue: { control: 'number' },
  },
  args: {
    modelValue: 0.5,
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

export const Default: Story = {}
