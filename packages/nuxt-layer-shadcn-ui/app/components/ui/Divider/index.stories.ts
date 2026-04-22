import type { Meta, StoryObj } from '@storybook/vue3'
import Divider from './index.vue'

const meta = {
  title: 'UI/Divider',
  component: Divider,
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Divider },
    setup: () => ({ args }),
    template: `
      <div class="space-y-10">
        <!-- Horizontal -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Horizontal</h3>
          <div class="space-y-4">
            <p>Content above</p>
            <Divider />
            <p>Content below</p>
          </div>
        </section>

        <!-- Vertical -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Vertical</h3>
          <div class="flex h-8 items-center gap-4">
            <span>Left</span>
            <Divider type="vertical" />
            <span>Center</span>
            <Divider type="vertical" />
            <span>Right</span>
          </div>
        </section>
      </div>
    `,
  }),
}
