import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '../Button/index.vue'
import Card from './index.vue'

const meta = {
  title: 'UI/Card',
  component: Card,
  argTypes: {
    title: { control: 'text' },
  },
  args: {
    title: 'Card Title',
  },
  render: args => ({
    components: { Card },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" class="max-w-md">
        <p>This card has a title prop set.</p>
      </Card>
    `,
  }),
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithTitle: Story = {
  parameters: noControls,
  render: () => ({
    components: { Card },
    template: `
      <Card title="Card Title" class="max-w-md">
        <p>This card has a title prop set.</p>
      </Card>
    `,
  }),
}

export const CustomHeader: Story = {
  parameters: noControls,
  render: () => ({
    components: { Card, Button },
    template: `
      <Card class="max-w-md">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold">Custom Header</span>
            <Button variant="ghost" size="sm">Action</Button>
          </div>
        </template>
        <p>This card uses the header slot for a custom layout.</p>
      </Card>
    `,
  }),
}

export const WithFooter: Story = {
  parameters: noControls,
  render: () => ({
    components: { Card, Button },
    template: `
      <Card title="Settings" class="max-w-md">
        <p>Update your account settings here.</p>
        <template #footer>
          <div class="w-full flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </div>
        </template>
      </Card>
    `,
  }),
}
