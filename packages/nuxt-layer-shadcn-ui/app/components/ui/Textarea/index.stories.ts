import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import { useArgsModel } from '#storybook/argsModel'
import Textarea from './index.vue'

const sizes = [ 'xs', 'sm', 'default', 'lg' ] as const

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  argTypes: {
    modelValue: { control: 'text' },
    autocomplete: { control: 'text' },
    rows: { control: 'number' },
    maxlength: { control: 'number' },
    maxLines: { control: 'number' },
    showCount: { control: 'boolean' },
    size: { control: 'select', options: sizes },
    readonly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    class: { control: 'text' },
  },
  args: {
    modelValue: '',
    autocomplete: '',
    rows: undefined,
    maxlength: undefined,
    maxLines: undefined,
    showCount: false,
    size: 'default',
    readonly: false,
    disabled: false,
    invalid: false,
    class: '',
  },
  render: args => {
    const onUpdate = useArgsModel()
    return {
      components: { Textarea },
      setup: () => ({ args, onUpdate }),
      template: `
        <div class="max-w-sm">
          <Textarea v-bind="args" placeholder="Type your message here..." @update:modelValue="onUpdate" />
        </div>
      `,
    }
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithRows: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Textarea :rows="6" placeholder="6 rows of height" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Textarea },
    template: `
      <div class="max-w-sm">
        <Textarea :rows="6" placeholder="6 rows of height" />
      </div>
    `,
  }),
}

export const WithCount: Story = {
  parameters: noControls,
  args: {
    showCount: true,
    maxlength: 200,
  },
}

export const WithMaxLines: Story = {
  parameters: noControls,
  args: {
    showCount: true,
    maxLines: 3,
    modelValue: 'Line 1\nLine 2',
  },
}

export const Sizes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Textarea v-model="value" size="sm" showCount />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Textarea },
    setup: () => ({ sizes, value: ref('Compact tiers tighten padding and font size.') }),
    template: `
      <div class="space-y-3">
        <div v-for="s in sizes" :key="s" class="flex items-center gap-3">
          <span class="w-14 text-sm text-muted-foreground">{{ s }}</span>
          <Textarea v-model="value" :size="s" showCount class="w-64" />
        </div>
      </div>
    `,
  }),
}

export const Invalid: Story = {
  parameters: noControls,
  args: {
    invalid: true,
    modelValue: 'Invalid content',
  },
}

export const Disabled: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Textarea disabled model-value="Disabled textarea" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Textarea },
    template: `
      <div class="max-w-sm">
        <Textarea disabled model-value="Disabled textarea" />
      </div>
    `,
  }),
}

export const Readonly: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Textarea readonly model-value="Readonly content" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Textarea },
    template: `
      <div class="max-w-sm">
        <Textarea readonly model-value="Readonly content" />
      </div>
    `,
  }),
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { Textarea, EventLog },
    setup: () => ({ value: ref('') }),
    template: `
      <EventLog v-slot="{ record }">
        <div class="max-w-sm">
          <Textarea
            v-model="value"
            placeholder="Type to see events"
            @update:modelValue="(v) => record('update:modelValue', v)"
            @change="(v) => record('change', v)"
          />
        </div>
      </EventLog>
    `,
  }),
}
