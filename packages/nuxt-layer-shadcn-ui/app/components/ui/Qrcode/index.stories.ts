import type { Meta, StoryObj } from '@storybook/vue3'
import Qrcode from './index.vue'

const meta = {
  title: 'UI/Qrcode',
  component: Qrcode,
} satisfies Meta<typeof Qrcode>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { content: 'https://example.com' },
  render: () => ({
    components: { Qrcode },
    setup () {
      const url = ref('https://example.com')
      return { url }
    },
    template: `
      <div class="space-y-10">
        <section>
          <h3 class="mb-4 text-lg font-medium">Basic QR Code</h3>
          <div class="size-48">
            <Qrcode content="https://example.com" />
          </div>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Dynamic Content</h3>
          <div class="space-y-3 max-w-sm">
            <input
              v-model="url"
              class="w-full rounded border border-input px-3 py-2 text-sm"
              placeholder="Enter URL or text"
            />
            <div class="size-48">
              <Qrcode :content="url" />
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Different Sizes</h3>
          <div class="flex items-end gap-6">
            <div class="size-24">
              <Qrcode content="https://example.com/small" />
            </div>
            <div class="size-48">
              <Qrcode content="https://example.com/medium" />
            </div>
          </div>
        </section>
      </div>
    `,
  }),
}
