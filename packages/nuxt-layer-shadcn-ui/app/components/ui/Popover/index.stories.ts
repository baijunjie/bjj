import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '../Button/index.vue'
import Input from '../Input/index.vue'
import Popover from './index.vue'

const meta = {
  title: 'UI/Popover',
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Popover, Button, Input },
    setup () {
      const controlled = ref(false)
      return { controlled }
    },
    template: `
      <div class="space-y-10">
        <section>
          <h3 class="mb-4 text-lg font-medium">Basic</h3>
          <Popover>
            <template #trigger>
              <Button variant="outline">Open Popover</Button>
            </template>
            <div class="space-y-2">
              <h4 class="font-medium">Popover Content</h4>
              <p class="text-sm text-muted-foreground">This is the popover body with some informational content.</p>
            </div>
          </Popover>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">With Form</h3>
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
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <div class="flex items-center gap-2">
            <Popover v-model:open="controlled">
              <template #trigger>
                <Button variant="outline">Controlled Popover</Button>
              </template>
              <p class="text-sm">This popover is controlled externally.</p>
            </Popover>
            <Button variant="ghost" size="sm" @click="controlled = !controlled">
              Toggle ({{ controlled ? 'Open' : 'Closed' }})
            </Button>
          </div>
        </section>
      </div>
    `,
  }),
}
