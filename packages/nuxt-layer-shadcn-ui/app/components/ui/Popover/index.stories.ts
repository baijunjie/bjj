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

export const Default: Story = {}

export const WithForm: Story = {
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

export const Controlled: Story = {
  render: () => ({
    components: { Popover, Button },
    setup () {
      const open = ref(false)
      return { open }
    },
    template: `
      <div class="flex items-center gap-2">
        <Popover v-model:open="open">
          <template #trigger>
            <Button variant="outline">Controlled Popover</Button>
          </template>
          <p class="text-sm">This popover is controlled externally.</p>
        </Popover>
        <Button variant="ghost" size="sm" @click="open = !open">
          Toggle ({{ open ? 'Open' : 'Closed' }})
        </Button>
      </div>
    `,
  }),
}
