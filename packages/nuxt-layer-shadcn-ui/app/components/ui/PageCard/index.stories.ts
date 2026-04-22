import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '../Button/index.vue'
import WebLink from '../WebLink/index.vue'
import PageCard from './index.vue'

const meta = {
  title: 'UI/PageCard',
  component: PageCard,
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    loading: { control: 'boolean' },
    ready: { control: 'boolean' },
    disabled: { control: 'boolean' },
    variant: { control: 'inline-radio', options: [ 'paper', 'card' ]},
  },
  args: {
    title: 'Settings',
    subtitle: '',
    loading: false,
    ready: true,
    disabled: false,
    variant: 'paper',
  },
} satisfies Meta<typeof PageCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { PageCard, Button, WebLink },
    setup: () => ({ args }),
    template: `
      <div class="space-y-10 max-w-2xl">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <PageCard v-bind="args">
            <p>Page card content goes here.</p>
          </PageCard>
        </section>

        <!-- With Back Button -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Back Button</h3>
          <PageCard title="Edit Profile" :back="{ action: () => {} }">
            <p>A page card with a back button in the header.</p>
          </PageCard>
        </section>

        <!-- Back + Subtitle -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Back + Subtitle</h3>
          <PageCard title="Bot Details" subtitle="View and edit your bot configuration." :back="{ action: () => {} }">
            <p>Back button combined with title and subtitle.</p>
          </PageCard>
        </section>

        <!-- With Actions -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Actions</h3>
          <PageCard title="API Keys">
            <template #actions>
              <Button variant="outline" size="sm">Export</Button>
              <Button size="sm">Create</Button>
            </template>
            <p>Action buttons rendered on the right side of the title.</p>
          </PageCard>
        </section>

        <!-- Actions + Subtitle + Back -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Actions + Subtitle + Back</h3>
          <PageCard
            title="Developer Settings"
            subtitle="Manage API keys and webhooks for your organization."
            :back="{ action: () => {} }"
          >
            <template #actions>
              <WebLink href="#" target="_blank" class="text-sm">Docs</WebLink>
              <WebLink href="#" target="_blank" class="text-sm">API Reference</WebLink>
            </template>
            <p>Back button, title, subtitle, and trailing action slot working together.</p>
          </PageCard>
        </section>

        <!-- Card Variant -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Card Variant</h3>
          <PageCard title="Profile" subtitle="Rounded corners and a visible border." variant="card">
            <p>Use variant="card" for widget-style panels; default "paper" is edge-to-edge.</p>
          </PageCard>
        </section>

        <!-- No Title -->
        <section>
          <h3 class="mb-4 text-lg font-medium">No Title</h3>
          <PageCard>
            <p>A page card without a title — just content.</p>
          </PageCard>
        </section>
      </div>
    `,
  }),
}
