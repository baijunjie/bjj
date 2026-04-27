import type { Meta, StoryObj } from '@storybook/vue3'
import CopyButton from './index.vue'

const variants = [ 'default', 'destructive', 'outline', 'secondary', 'ghost', 'link' ] as const
const sizes = [ 'sm', 'default', 'lg', 'icon-sm', 'icon', 'icon-lg' ] as const

const meta = {
  title: 'UI/CopyButton',
  component: CopyButton,
  argTypes: {
    copy: { control: 'text' },
    beforeCopyText: { control: 'text' },
    afterCopyText: { control: 'text' },
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
    rounded: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    copy: 'Hello, World!',
    beforeCopyText: '',
    afterCopyText: '',
    variant: 'outline',
    size: 'default',
    rounded: false,
    disabled: false,
    loading: false,
  },
  render: args => ({
    components: { CopyButton },
    setup: () => ({ args }),
    template: '<CopyButton v-bind="args">Copy Text</CopyButton>',
  }),
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const IconOnly: Story = {
  parameters: noControls,
  render: () => ({
    components: { CopyButton },
    template: `
      <div class="flex items-center gap-4">
        <CopyButton copy="Hello, World!" variant="outline" />
        <CopyButton copy="Hello, World!" variant="ghost" />
        <CopyButton copy="Hello, World!" variant="secondary" />
      </div>
    `,
  }),
}

export const WithLabel: Story = {
  parameters: noControls,
  render: () => ({
    components: { CopyButton },
    template: `
      <div class="flex items-center gap-4">
        <CopyButton copy="Hello, World!" variant="outline">Copy Text</CopyButton>
        <CopyButton copy="123 Main St" variant="secondary">Copy Address</CopyButton>
      </div>
    `,
  }),
}

export const Variants: Story = {
  parameters: noControls,
  render: () => ({
    components: { CopyButton },
    setup: () => ({ variants }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <CopyButton
          v-for="v in variants"
          :key="v"
          :variant="v"
          copy="Hello, World!"
        >
          {{ v }}
        </CopyButton>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: noControls,
  render: () => ({
    components: { CopyButton },
    template: `
      <div class="flex items-center gap-4">
        <CopyButton copy="Hello, World!" variant="outline" size="sm">Small</CopyButton>
        <CopyButton copy="Hello, World!" variant="outline" size="default">Default</CopyButton>
        <CopyButton copy="Hello, World!" variant="outline" size="lg">Large</CopyButton>
      </div>
    `,
  }),
}

export const CustomTooltipText: Story = {
  parameters: noControls,
  render: () => ({
    components: { CopyButton },
    template: `
      <CopyButton
        copy="secret-token-123"
        before-copy-text="Click to copy token"
        after-copy-text="Token copied!"
        variant="outline"
      >
        Copy Token
      </CopyButton>
    `,
  }),
}
