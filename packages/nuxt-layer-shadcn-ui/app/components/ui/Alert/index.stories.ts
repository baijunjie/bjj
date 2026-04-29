import type { Meta, StoryObj } from '@storybook/vue3'
import type { AlertType } from './types'
import Alert from './index.vue'

const types: AlertType[] = [ 'default', 'success', 'info', 'help', 'warn', 'danger' ]

const meta = {
  title: 'UI/Alert',
  component: Alert,
  argTypes: {
    type: { control: 'select', options: types },
    icon: { control: 'text' },
  },
  args: {
    type: 'default',
    icon: '',
  },
  render: args => ({
    components: { Alert },
    setup: () => ({ args }),
    template: '<Alert v-bind="args">This is an alert message.</Alert>',
  }),
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Types: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="space-y-3">
    <Alert v-for="t in types" :key="t" :type="t">
      This is a <strong>{{ t }}</strong> alert message.
    </Alert>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Alert },
    setup: () => ({ types }),
    template: `
      <div class="space-y-3">
        <Alert v-for="t in types" :key="t" :type="t">
          This is a <strong>{{ t }}</strong> alert message.
        </Alert>
      </div>
    `,
  }),
}

export const WithIcons: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="space-y-3">
    <Alert type="info" icon="bell">Alert with a custom bell icon.</Alert>
    <Alert type="success" icon="sparkles">Alert with a custom sparkles icon.</Alert>
    <Alert type="warn" icon="flag">Alert with a custom flag icon.</Alert>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Alert },
    template: `
      <div class="space-y-3">
        <Alert type="info" icon="bell">Alert with a custom bell icon.</Alert>
        <Alert type="success" icon="sparkles">Alert with a custom sparkles icon.</Alert>
        <Alert type="warn" icon="flag">Alert with a custom flag icon.</Alert>
      </div>
    `,
  }),
}
