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
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    type: 'default',
    icon: '',
    title: 'Heads up!',
    description: 'You can add components to your app using the cli.',
  },
  render: args => ({
    components: { Alert },
    setup: () => ({ args }),
    template: '<Alert v-bind="args" />',
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
    <Alert
      v-for="t in types"
      :key="t"
      :type="t"
      :title="t"
      description="This is an alert message."
    />
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
        <Alert
          v-for="t in types"
          :key="t"
          :type="t"
          :title="t"
          description="This is an alert message."
        />
      </div>
    `,
  }),
}

export const TitleOnly: Story = {
  parameters: noControls,
  args: {
    type: 'info',
    title: 'A short title without description.',
    description: '',
  },
}

export const DescriptionOnly: Story = {
  parameters: noControls,
  args: {
    type: 'info',
    title: '',
    description: 'A standalone description without a title.',
  },
}

export const WithIcons: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="space-y-3">
    <Alert type="info" icon="bell" title="Custom bell icon" description="Override the default icon for this type." />
    <Alert type="success" icon="sparkles" title="Custom sparkles icon" description="Pass any lucide icon name." />
    <Alert type="warn" icon="flag" title="Custom flag icon" description="Works for every type." />
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
        <Alert type="info" icon="bell" title="Custom bell icon" description="Override the default icon for this type." />
        <Alert type="success" icon="sparkles" title="Custom sparkles icon" description="Pass any lucide icon name." />
        <Alert type="warn" icon="flag" title="Custom flag icon" description="Works for every type." />
      </div>
    `,
  }),
}

export const HiddenIcon: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Alert type="success" :icon="null" title="Icon hidden" description="Pass icon=\\"null\\" to suppress the type's default icon." />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Alert },
    template: `
      <Alert type="success" :icon="null" title="Icon hidden" description="Pass icon=&quot;null&quot; to suppress the type's default icon." />
    `,
  }),
}

export const CustomSlots: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Alert type="info">
    <template #icon>
      <Icon name="rocket" />
    </template>
    <template #title>
      <span class="underline">Custom title slot</span>
    </template>
    Description rendered via the default slot. You can put <strong>rich content</strong> here.
  </Alert>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Alert },
    template: `
      <Alert type="info">
        <template #icon>
          <Icon name="rocket" />
        </template>
        <template #title>
          <span class="underline">Custom title slot</span>
        </template>
        Description rendered via the default slot. You can put <strong>rich content</strong> here.
      </Alert>
    `,
  }),
}
