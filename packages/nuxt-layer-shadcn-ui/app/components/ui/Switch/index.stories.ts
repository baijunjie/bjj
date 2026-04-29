import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import Switch from './index.vue'

const meta = {
  title: 'UI/Switch',
  component: Switch,
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
  render: args => ({
    components: { Switch },
    setup () {
      const on = ref(true)
      return { args, on }
    },
    template: `
      <div class="flex items-center gap-4">
        <Switch v-model="on" v-bind="args" />
        <div class="text-sm text-muted-foreground">Value: {{ on }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Disabled: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex items-center gap-4">
    <Switch :modelValue="false" disabled />
    <Switch :modelValue="true" disabled />
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Switch },
    template: `
      <div class="flex items-center gap-4">
        <Switch :modelValue="false" disabled />
        <Switch :modelValue="true" disabled />
      </div>
    `,
  }),
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { Switch, EventLog },
    setup: () => ({ on: ref(false) }),
    template: `
      <EventLog v-slot="{ record }">
        <Switch
          v-model="on"
          @update:modelValue="(v) => record('update:modelValue', v)"
        />
      </EventLog>
    `,
  }),
}
