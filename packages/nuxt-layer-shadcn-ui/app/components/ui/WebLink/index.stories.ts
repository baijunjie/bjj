import type { Meta, StoryObj } from '@storybook/vue3'
import WebLink from './index.vue'

const meta = {
  title: 'UI/WebLink',
  component: WebLink,
} satisfies Meta<typeof WebLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { WebLink },
    template: `
      <div class="space-y-10">
        <section>
          <h3 class="mb-4 text-lg font-medium">Internal Link</h3>
          <WebLink href="/dashboard">Go to Dashboard</WebLink>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">External Link</h3>
          <WebLink href="https://example.com">Visit Example.com</WebLink>
          <p class="mt-1 text-sm text-muted-foreground">External links automatically open in a new tab and show a trailing icon.</p>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">External Link without Icon</h3>
          <WebLink href="https://example.com" :externalIcon="false">No trailing icon</WebLink>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">With Explicit Target</h3>
          <WebLink href="https://example.com" target="_self">Same Tab External Link</WebLink>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Unstyled</h3>
          <div class="flex flex-col gap-2">
            <WebLink href="/settings" unstyled>Unstyled internal link (no color or underline)</WebLink>
            <WebLink href="https://example.com" unstyled>Unstyled external link (icon still shows)</WebLink>
          </div>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Inline Usage</h3>
          <p class="text-sm">
            Please read our
            <WebLink href="https://example.com/terms">Terms of Service</WebLink>
            and
            <WebLink href="https://example.com/privacy">Privacy Policy</WebLink>
            before continuing.
          </p>
        </section>
      </div>
    `,
  }),
}
