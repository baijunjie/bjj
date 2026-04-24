import type { Meta, StoryObj } from '@storybook/vue3'
import Qrcode from './index.vue'

const meta = {
  title: 'UI/Qrcode',
  component: Qrcode,
  argTypes: {
    content: { control: 'text' },
  },
  args: {
    content: 'https://example.com',
  },
  render: args => ({
    components: { Qrcode },
    setup: () => ({ args }),
    template: `
      <div class="size-48">
        <Qrcode v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof Qrcode>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DynamicContent: Story = {
  render: () => ({
    components: { Qrcode },
    setup () {
      const url = ref('https://example.com')
      return { url }
    },
    template: `
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
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Qrcode },
    template: `
      <div class="flex items-end gap-6">
        <div class="size-24">
          <Qrcode content="https://example.com/small" />
        </div>
        <div class="size-48">
          <Qrcode content="https://example.com/medium" />
        </div>
      </div>
    `,
  }),
}
