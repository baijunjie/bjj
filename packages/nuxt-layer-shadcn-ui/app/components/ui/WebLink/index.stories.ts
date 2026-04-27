import type { Meta, StoryObj } from '@storybook/vue3'
import WebLink from './index.vue'

const targets = [ '_self', '_blank', '_parent', '_top' ] as const

const meta = {
  title: 'UI/WebLink',
  component: WebLink,
  argTypes: {
    href: { control: 'text' },
    to: { control: 'object' },
    target: { control: 'select', options: targets },
    unstyled: { control: 'boolean' },
    externalIcon: { control: 'boolean' },
    class: { control: 'text' },
  },
  args: {
    href: 'https://example.com',
    to: undefined,
    target: undefined,
    unstyled: false,
    externalIcon: true,
    class: '',
  },
  render: args => ({
    components: { WebLink },
    setup: () => ({ args }),
    template: `
      <WebLink v-bind="args">Visit Example.com</WebLink>
    `,
  }),
} satisfies Meta<typeof WebLink>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const ExternalLink: Story = {
  parameters: noControls,
  render: () => ({
    components: { WebLink },
    template: `
      <div>
        <WebLink href="https://example.com">Visit Example.com</WebLink>
        <p class="mt-1 text-sm text-muted-foreground">External links automatically open in a new tab and show a trailing icon.</p>
      </div>
    `,
  }),
}

export const ExternalWithoutIcon: Story = {
  parameters: noControls,
  render: () => ({
    components: { WebLink },
    template: `
      <WebLink href="https://example.com" :externalIcon="false">No trailing icon</WebLink>
    `,
  }),
}

export const WithExplicitTarget: Story = {
  parameters: noControls,
  render: () => ({
    components: { WebLink },
    template: `
      <WebLink href="https://example.com" target="_self">Same Tab External Link</WebLink>
    `,
  }),
}

export const Unstyled: Story = {
  parameters: noControls,
  render: () => ({
    components: { WebLink },
    template: `
      <div class="flex flex-col gap-2">
        <WebLink href="/settings" unstyled>Unstyled internal link (no color or underline)</WebLink>
        <WebLink href="https://example.com" unstyled>Unstyled external link (icon still shows)</WebLink>
      </div>
    `,
  }),
}

export const InlineUsage: Story = {
  parameters: noControls,
  render: () => ({
    components: { WebLink },
    template: `
      <p class="text-sm">
        Please read our
        <WebLink href="https://example.com/terms">Terms of Service</WebLink>
        and
        <WebLink href="https://example.com/privacy">Privacy Policy</WebLink>
        before continuing.
      </p>
    `,
  }),
}
