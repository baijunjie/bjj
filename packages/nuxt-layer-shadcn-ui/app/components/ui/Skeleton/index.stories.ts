import type { Meta, StoryObj } from '@storybook/vue3'
import Skeleton from './index.vue'

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: {
    width: '200px',
    height: '20px',
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Skeleton v-bind="args" />
        </section>

        <!-- Various Sizes -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Various Sizes</h3>
          <div class="space-y-3">
            <Skeleton width="100%" height="12px" />
            <Skeleton width="80%" height="12px" />
            <Skeleton width="60%" height="12px" />
          </div>
        </section>

        <!-- Card Skeleton -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Card Skeleton</h3>
          <div class="flex items-center gap-4">
            <Skeleton width="48px" height="48px" class="rounded-full" />
            <div class="space-y-2">
              <Skeleton width="160px" height="16px" />
              <Skeleton width="120px" height="12px" />
            </div>
          </div>
        </section>
      </div>
    `,
  }),
}
