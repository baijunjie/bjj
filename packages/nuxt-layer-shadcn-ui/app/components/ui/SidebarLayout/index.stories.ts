import type { Meta, StoryObj } from '@storybook/vue3'
import type { SidebarLayoutMenuItem } from './types'
import EventLog from '#storybook/EventLog.vue'
import { useArgsModel } from '#storybook/argsModel'
import Button from '../Button/index.vue'
import SidebarLayout from './index.vue'

const variants = [ 'sidebar', 'floating', 'inset' ] as const
const collapsibles = [ 'icon', 'offcanvas', 'none' ] as const

const menus: SidebarLayoutMenuItem[] = [
  { key: 'general', label: 'General', icon: 'settings', group: 'Settings' },
  { key: 'account', label: 'Account', icon: 'circle-user', group: 'Settings' },
  { key: 'usage', label: 'Usage', icon: 'chart-column', group: 'Settings' },
  { key: 'appearance', label: 'Appearance', icon: 'monitor', group: 'Customize' },
  { key: 'connectors', label: 'Connectors', icon: 'plug', group: 'Customize' },
]

const nestedMenus: SidebarLayoutMenuItem[] = [
  { key: 'overview', label: 'Overview', icon: 'layout-dashboard' },
  {
    label: 'Documentation',
    icon: 'book-open',
    group: 'Platform',
    expanded: true,
    children: [
      { key: 'intro', label: 'Introduction' },
      { key: 'tutorials', label: 'Tutorials' },
    ],
  },
  {
    key: 'design',
    label: 'Design Engineering',
    icon: 'frame',
    group: 'Projects',
    actions: [
      { label: 'Share Project', icon: 'forward', command: () => {} },
      { label: 'Delete Project', icon: 'trash-2', command: () => {} },
    ],
  },
]

const paneTemplate = `
  <div class="space-y-3">
    <h2 class="text-lg font-semibold">{{ active || 'No selection' }}</h2>
    <p class="text-sm text-muted-foreground">
      The layout owns the menu and its active state; this pane comes from the default slot.
    </p>
  </div>
`

const brandTemplate = `
  <template #header>
    <div class="truncate px-2 py-1 text-base font-semibold group-data-[collapsible=icon]:hidden">Acme Inc.</div>
  </template>
`

const meta = {
  title: 'UI/SidebarLayout',
  component: SidebarLayout,
  argTypes: {
    menus: { control: 'object' },
    active: { control: 'text' },
    emptyText: { control: 'text' },
    embedded: { control: 'boolean' },
    variant: { control: 'select', options: variants },
    collapsible: { control: 'select', options: collapsibles },
    sidebarWidth: { control: 'text' },
    contentClass: { control: 'text' },
  },
  args: {
    menus,
    active: 'general',
    emptyText: '',
    embedded: false,
    variant: 'sidebar',
    collapsible: 'icon',
    sidebarWidth: '16rem',
    contentClass: 'p-6',
  },
  render: args => {
    const onUpdateActive = useArgsModel('active')
    return {
      components: { SidebarLayout },
      // The Docs page only round-trips the primary story's args, so selection is
      // mirrored locally to stay clickable there, and pushed back to Controls.
      setup () {
        const active = ref(args.active)
        watch(() => args.active, key => {
          active.value = key
        })
        function onSelect (key: string) {
          active.value = key
          onUpdateActive(key)
        }
        return { args, active, onSelect }
      },
      template: `
        <SidebarLayout
          v-bind="args"
          :active="active"
          @update:active="onSelect"
        >
          ${brandTemplate}
          ${paneTemplate}
        </SidebarLayout>
      `,
    }
  },
  // The page-mode sidebar is `position: fixed`; pin it to the preview frame so it
  // does not stretch across the whole Storybook viewport. `[data-state]` keeps the
  // selector off an embedded sidebar, whose last child is its own footer.
  decorators: [
    () => ({
      template: `
        <div
          class="relative h-[600px] overflow-hidden rounded-lg border border-border
            [&_[data-slot=sidebar][data-state]>div:last-child]:absolute!
            [&_[data-slot=sidebar][data-state]>div:last-child]:h-full!"
        >
          <story />
        </div>
      `,
    }),
  ],
} satisfies Meta<typeof SidebarLayout>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Floating: Story = {
  parameters: noControls,
  args: {
    variant: 'floating',
  },
}

export const Inset: Story = {
  parameters: noControls,
  args: {
    variant: 'inset',
  },
}

export const Offcanvas: Story = {
  parameters: noControls,
  args: {
    collapsible: 'offcanvas',
  },
}

export const Embedded: Story = {
  parameters: noControls,
  args: {
    embedded: true,
  },
}

export const SidebarWidth: Story = {
  parameters: noControls,
  args: {
    embedded: true,
    sidebarWidth: '11rem',
  },
}

export const NestedMenus: Story = {
  parameters: noControls,
  args: {
    embedded: true,
    menus: nestedMenus,
    active: 'intro',
  },
}

export const EmptyText: Story = {
  parameters: noControls,
  args: {
    embedded: true,
    menus: [],
    emptyText: 'No results',
  },
}

export const SidebarFooter: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <SidebarLayout
    v-model:active="active"
    embedded
    :menus="menus"
    contentClass="p-6"
  >
    <template #header>
      <div class="px-2 py-1 text-base font-semibold">Acme Inc.</div>
    </template>

    <template #footer>
      <Button
        variant="ghost"
        icon="log-out"
        class="justify-start"
      >
        Sign out
      </Button>
    </template>

    <div class="text-sm text-muted-foreground">Pane for {{ active }}</div>
  </SidebarLayout>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { SidebarLayout, Button },
    setup () {
      const active = ref('general')
      return { active, menus }
    },
    template: `
      <SidebarLayout
        v-model:active="active"
        embedded
        :menus="menus"
        contentClass="p-6"
      >
        <template #header>
          <div class="px-2 py-1 text-base font-semibold">Acme Inc.</div>
        </template>

        <template #footer>
          <Button variant="ghost" icon="log-out" class="justify-start">Sign out</Button>
        </template>

        <div class="text-sm text-muted-foreground">Pane for {{ active }}</div>
      </SidebarLayout>
    `,
  }),
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { SidebarLayout, EventLog },
    setup () {
      const active = ref('general')
      return { active, menus }
    },
    template: `
      <EventLog v-slot="{ record }">
        <SidebarLayout
          v-model:active="active"
          embedded
          :menus="menus"
          contentClass="p-6"
          class="h-80"
          @select="(item) => record('select', item.label)"
          @update:active="(key) => record('update:active', key)"
        >
          <div class="text-sm text-muted-foreground">Pick a menu item to log its events.</div>
        </SidebarLayout>
      </EventLog>
    `,
  }),
}
