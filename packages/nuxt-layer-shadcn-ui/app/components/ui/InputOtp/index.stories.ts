import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import { useArgsModel } from '#storybook/argsModel'
import InputOtp from './index.vue'

const sizes = [ 'xs', 'sm', 'md', 'default', 'lg' ] as const

const meta = {
  title: 'UI/InputOtp',
  component: InputOtp,
  argTypes: {
    modelValue: { control: 'text' },
    length: { control: 'number' },
    size: { control: 'select', options: sizes },
    readonly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    modelValue: '',
    length: 6,
    size: 'default',
    readonly: false,
    disabled: false,
    invalid: false,
  },
  render: args => {
    const onUpdate = useArgsModel()
    return {
      components: { InputOtp },
      setup: () => ({ args, onUpdate }),
      template: `
        <div class="space-y-4">
          <InputOtp v-bind="args" @update:modelValue="onUpdate" />
          <div class="text-sm text-muted-foreground">Value: {{ args.modelValue }}</div>
        </div>
      `,
    }
  },
} satisfies Meta<typeof InputOtp>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const CustomLength: Story = {
  parameters: noControls,
  args: {
    length: 4,
  },
}

export const Sizes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <InputOtp v-model="value" size="sm" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { InputOtp },
    setup: () => ({ sizes, value: ref('123') }),
    template: `
      <div class="space-y-3">
        <div v-for="s in sizes" :key="s" class="flex items-center gap-3">
          <span class="w-14 text-sm text-muted-foreground">{{ s }}</span>
          <InputOtp v-model="value" :size="s" />
        </div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: noControls,
  args: {
    disabled: true,
    modelValue: '123456',
  },
}

export const Invalid: Story = {
  parameters: noControls,
  args: {
    invalid: true,
    modelValue: '123456',
  },
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { InputOtp, EventLog },
    setup: () => ({ otp: ref('') }),
    template: `
      <EventLog v-slot="{ record }">
        <InputOtp
          v-model="otp"
          @update:modelValue="(v) => record('update:modelValue', v)"
          @complete="(v) => record('complete', v)"
        />
      </EventLog>
    `,
  }),
}
