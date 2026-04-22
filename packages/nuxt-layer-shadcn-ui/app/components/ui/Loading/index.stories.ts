import type { Meta, StoryObj } from '@storybook/vue3'
import Loading from './index.vue'

const meta = {
  title: 'UI/Loading',
  component: Loading,
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Loading },
    setup: () => ({ args }),
    template: `
      <div class="space-y-10">
        <!-- Default -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Default</h3>
          <Loading />
        </section>

        <!-- Custom Size -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Custom Size</h3>
          <div class="flex items-end gap-6">
            <Loading class="size-6" />
            <Loading class="size-10" />
            <Loading class="size-16" />
          </div>
        </section>
      </div>
    `,
  }),
}
