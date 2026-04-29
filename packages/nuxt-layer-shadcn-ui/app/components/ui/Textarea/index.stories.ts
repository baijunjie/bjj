import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import Textarea from './index.vue'

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  argTypes: {
    modelValue: { control: 'text' },
    autocomplete: { control: 'text' },
    rows: { control: 'number' },
    invalid: { control: 'boolean' },
    class: { control: 'text' },
  },
  args: {
    modelValue: '',
    autocomplete: '',
    rows: undefined,
    invalid: false,
    class: '',
  },
  render: args => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: `
      <div class="max-w-sm">
        <Textarea v-bind="args" placeholder="Type your message here..." />
      </div>
    `,
  }),
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
