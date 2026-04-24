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
  render: args => ({
    components: { PageCard },
    setup: () => ({ args }),
    template: `
      <PageCard v-bind="args" class="max-w-2xl">
        <p>Page card content goes here.</p>
      </PageCard>
    `,
  }),
} satisfies Meta<typeof PageCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoTitle: Story = {
  render: () => ({
    components: { PageCard },
    template: `
      <PageCard class="max-w-2xl">
        <p>A page card without a title — just content.</p>
      </PageCard>
    `,
  }),
}

export const WithSubtitle: Story = {
  render: () => ({
    components: { PageCard },
    template: `
      <PageCard
        title="Bot Details"
        subtitle="View and edit your bot configuration."
        class="max-w-2xl"
      >
        <p>Title combined with subtitle.</p>
      </PageCard>
    `,
  }),
}

export const WithBackButton: Story = {
  render: () => ({
    components: { PageCard },
    template: `
      <PageCard title="Edit Profile" :back="{ action: () => {} }" class="max-w-2xl">
        <p>A page card with a back button in the header.</p>
      </PageCard>
    `,
  }),
}

export const BackWithSubtitle: Story = {
  render: () => ({
    components: { PageCard },
    template: `
      <PageCard
        title="Bot Details"
        subtitle="View and edit your bot configuration."
        :back="{ action: () => {} }"
        class="max-w-2xl"
      >
        <p>Back button combined with title and subtitle.</p>
      </PageCard>
    `,
  }),
}

export const WithActions: Story = {
  render: () => ({
    components: { PageCard, Button },
    template: `
      <PageCard title="API Keys" class="max-w-2xl">
        <template #actions>
          <Button variant="outline" size="sm">Export</Button>
          <Button size="sm">Create</Button>
        </template>
        <p>Action buttons rendered on the right side of the title.</p>
      </PageCard>
    `,
  }),
}

export const ActionsSubtitleBack: Story = {
  render: () => ({
    components: { PageCard, WebLink },
    template: `
      <PageCard
        title="Developer Settings"
        subtitle="Manage API keys and webhooks for your organization."
        :back="{ action: () => {} }"
        class="max-w-2xl"
      >
        <template #actions>
          <WebLink href="#" target="_blank" class="text-sm">Docs</WebLink>
          <WebLink href="#" target="_blank" class="text-sm">API Reference</WebLink>
        </template>
        <p>Back button, title, subtitle, and trailing action slot working together.</p>
      </PageCard>
    `,
  }),
}

export const CustomTitleSlot: Story = {
  render: () => ({
    components: { PageCard },
    template: `
      <PageCard class="max-w-2xl">
        <template #title>
          <span class="flex items-center gap-2">
            <span class="inline-block size-2 rounded-full bg-success" />
            <span>Active Workspace</span>
          </span>
        </template>
        <template #subtitle>
          <span class="text-success">All systems operational</span>
        </template>
        <p>Title and subtitle rendered via slots.</p>
      </PageCard>
    `,
  }),
}

export const WithFooter: Story = {
  render: () => ({
    components: { PageCard, Button },
    template: `
      <PageCard title="Profile" class="max-w-2xl">
        <p>Edit your profile information and save the changes.</p>
        <template #footer>
          <div class="flex w-full justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </div>
        </template>
      </PageCard>
    `,
  }),
}

export const CardVariant: Story = {
  render: () => ({
    components: { PageCard },
    template: `
      <PageCard
        title="Profile"
        subtitle="Rounded corners and a visible border."
        variant="card"
        class="max-w-2xl"
      >
        <p>Use variant="card" for widget-style panels; default "paper" is edge-to-edge.</p>
      </PageCard>
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { PageCard },
    template: `
      <PageCard title="Saving…" loading class="max-w-2xl">
        <p>Content is covered by a centered loading overlay while <code>loading</code> is true.</p>
      </PageCard>
    `,
  }),
}

export const NotReady: Story = {
  render: () => ({
    components: { PageCard },
    template: `
      <PageCard :ready="false" class="max-w-2xl">
        <p>This content would be replaced by skeleton placeholders while data is loading.</p>
      </PageCard>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { PageCard, Button },
    template: `
      <PageCard title="Read-only" disabled class="max-w-2xl">
        <div class="flex flex-col gap-3">
          <p>When <code>disabled</code> is true, content becomes non-interactive and dimmed.</p>
          <Button>Disabled action</Button>
        </div>
      </PageCard>
    `,
  }),
}
