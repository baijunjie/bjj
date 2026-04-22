import type { Meta, StoryObj } from '@storybook/vue3'
import CopyButton from './index.vue'

const meta = {
  title: 'UI/CopyButton',
  component: CopyButton,
  argTypes: {
    copy: { control: 'text' },
    variant: { control: 'select', options: [ 'default', 'destructive', 'outline', 'secondary', 'ghost' ]},
    size: { control: 'select', options: [ 'default', 'sm', 'lg', 'icon' ]},
  },
  args: {
    copy: 'Hello, World!',
    variant: 'outline',
  },
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { CopyButton },
    setup: () => ({ args }),
    template: `
      <div class="space-y-10">
        <section>
          <h3 class="mb-4 text-lg font-medium">Icon Only (default)</h3>
          <div class="flex items-center gap-4">
            <CopyButton v-bind="args" />
            <CopyButton v-bind="args" variant="ghost" />
            <CopyButton v-bind="args" variant="secondary" />
          </div>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">With Label</h3>
          <div class="flex items-center gap-4">
            <CopyButton v-bind="args">Copy Text</CopyButton>
            <CopyButton v-bind="args" variant="secondary">Copy Address</CopyButton>
          </div>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Sizes</h3>
          <div class="flex items-center gap-4">
            <CopyButton v-bind="args" size="sm">Small</CopyButton>
            <CopyButton v-bind="args" size="default">Default</CopyButton>
            <CopyButton v-bind="args" size="lg">Large</CopyButton>
          </div>
        </section>
      </div>
    `,
  }),
}
