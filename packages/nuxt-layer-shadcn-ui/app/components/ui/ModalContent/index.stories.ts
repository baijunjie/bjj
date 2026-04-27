import type { Meta, StoryObj } from '@storybook/vue3'
import type { ModalContentType } from './types'
import ModalContent from './index.vue'

const types: ModalContentType[] = [ 'default', 'success', 'info', 'help', 'warn', 'danger', 'error' ]

const meta = {
  title: 'UI/ModalContent',
  component: ModalContent,
  argTypes: {
    type: { control: 'select', options: types },
    icon: { control: 'text' },
    content: { control: 'text' },
  },
  args: {
    type: 'default',
    icon: '',
    content: 'This is a message.',
  },
  render: args => ({
    components: { ModalContent },
    setup: () => ({ args }),
    template: `
      <div class="max-w-md">
        <ModalContent v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof ModalContent>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Types: Story = {
  parameters: noControls,
  render: () => ({
    components: { ModalContent },
    setup: () => ({ types }),
    template: `
      <div class="space-y-4 max-w-md">
        <ModalContent type="default" content="This is a default message." />
        <ModalContent type="success" content="Operation completed successfully." />
        <ModalContent type="info" content="Your changes have been saved." />
        <ModalContent type="help" content="Need help? Check the documentation." />
        <ModalContent type="warn" content="This operation will affect all users." />
        <ModalContent type="danger" content="Are you sure you want to delete this item? This action cannot be undone." />
        <ModalContent type="error" content="An error occurred while processing your request." />
      </div>
    `,
  }),
}

export const WithCustomIcon: Story = {
  parameters: noControls,
  render: () => ({
    components: { ModalContent },
    template: `
      <div class="space-y-4 max-w-md">
        <ModalContent icon="shield-alert" content="Your session is about to expire." />
        <ModalContent type="warn" icon="shield-alert" content="Security warning: unusual login detected." />
      </div>
    `,
  }),
}

export const MultilineText: Story = {
  parameters: noControls,
  render: () => ({
    components: { ModalContent },
    template: `
      <div class="max-w-md">
        <ModalContent type="warn" content="Warning: This operation will affect all users.\nPlease review the changes before proceeding." />
      </div>
    `,
  }),
}
