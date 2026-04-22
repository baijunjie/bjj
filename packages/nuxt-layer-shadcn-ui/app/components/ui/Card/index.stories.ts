import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '../Button/index.vue'
import Card from './index.vue'

const meta = {
  title: 'UI/Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Card, Button },
    setup: () => ({ args }),
    template: `
      <div class="space-y-10 max-w-md">
        <!-- Basic Card -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Basic Card</h3>
          <Card>
            <p>This is a basic card with default content only.</p>
          </Card>
        </section>

        <!-- Card with Title -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Card with Title</h3>
          <Card title="Card Title">
            <p>This card has a title prop set.</p>
          </Card>
        </section>

        <!-- Card with Custom Header -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Card with Custom Header</h3>
          <Card>
            <template #header>
              <div class="flex items-center justify-between">
                <span class="text-lg font-semibold">Custom Header</span>
                <Button variant="ghost" size="sm">Action</Button>
              </div>
            </template>
            <p>This card uses the header slot for a custom layout.</p>
          </Card>
        </section>

        <!-- Card with Footer -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Card with Footer</h3>
          <Card title="Settings">
            <p>Update your account settings here.</p>
            <template #footer>
              <div class="w-full flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </div>
            </template>
          </Card>
        </section>
      </div>
    `,
  }),
}
