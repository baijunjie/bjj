import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '../Button/index.vue'
import Input from '../Input/index.vue'
import Popover from './index.vue'

const meta = {
  title: 'UI/Popover',
  component: Popover,
  render: () => ({
    components: { Popover, Button },
    template: `
      <Popover>
        <template #trigger>
          <Button variant="outline">Open Popover</Button>
        </template>
        <div class="space-y-2">
          <h4 class="font-medium">Popover Content</h4>
          <p class="text-sm text-muted-foreground">This is the popover body with some informational content.</p>
        </div>
      </Popover>
    `,
  }),
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithForm: Story = {
  parameters: noControls,
  render: () => ({
    components: { Popover, Button, Input },
    template: `
      <Popover>
        <template #trigger>
          <Button variant="outline">Edit Name</Button>
        </template>
        <div class="space-y-3">
          <h4 class="font-medium">Update Name</h4>
          <Input placeholder="Enter new name" />
          <Button size="sm" class="w-full">Save</Button>
        </div>
      </Popover>
    `,
  }),
}
