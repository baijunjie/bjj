import type { Meta, StoryObj } from '@storybook/vue3'
import type { SidebarLayoutMenuItem } from '../SidebarLayout/types'
import type { SidebarModalFilter } from './types'
import EventLog from '#storybook/EventLog.vue'
import { useArgsModel } from '#storybook/argsModel'
import Button from '../Button/index.vue'
import Icon from '../Icon/index.vue'
import Input from '../Input/index.vue'
import Switch from '../Switch/index.vue'
import SidebarModal from './index.vue'

const menus: SidebarLayoutMenuItem[] = [
  { key: 'general', label: 'General', icon: 'settings', group: 'Settings' },
  { key: 'account', label: 'Account', icon: 'circle-user', group: 'Settings' },
  { key: 'usage', label: 'Usage', icon: 'chart-column', group: 'Settings' },
  { key: 'capabilities', label: 'Capabilities', icon: 'briefcase-business', group: 'Settings' },
  { key: 'appearance', label: 'Appearance', icon: 'monitor', group: 'Desktop app' },
  { key: 'extensions', label: 'Extensions', icon: 'blocks', group: 'Desktop app' },
  { key: 'developer', label: 'Developer', icon: 'wrench', group: 'Desktop app' },
  { key: 'skills', label: 'Skills', icon: 'scroll-text', group: 'Customize' },
  { key: 'connectors', label: 'Connectors', icon: 'plug', group: 'Customize' },
]

const nestedMenus: SidebarLayoutMenuItem[] = [
  { key: 'general', label: 'General', icon: 'settings' },
  {
    label: 'Workspace',
    icon: 'building-2',
    expanded: true,
    children: [
      { key: 'members', label: 'Members' },
      { key: 'billing', label: 'Billing' },
    ],
  },
]

const scrollingMenus: SidebarLayoutMenuItem[] = [
  ...menus,
  ...Array.from({ length: 12 }, (_, index) => ({
    key: `plugin-${index + 1}`,
    label: `Plugin ${index + 1}`,
    icon: 'puzzle',
    group: 'Plugins',
  })),
]

// The rows each pane renders, doubling as the index a business search would hit.
const paneContent: Record<string, string[]> = {
  general: [ 'full name', 'email', 'notifications' ],
  account: [ 'password', 'two-factor', 'sessions' ],
  usage: [ 'quota', 'billing period' ],
  capabilities: [ 'beta features' ],
  appearance: [ 'theme', 'dark mode', 'font size' ],
  extensions: [ 'browser extension' ],
  developer: [ 'api key', 'webhooks' ],
  skills: [ 'custom instructions' ],
  connectors: [ 'google drive', 'slack' ],
}

const searchByContent: SidebarModalFilter = (items, keyword) => {
  if (!keyword) return items
  const needle = keyword.toLowerCase()
  return items.filter(item => {
    const key = item.key ?? item.label
    return [ item.label, item.group, ...(paneContent[key] ?? []) ]
      .join(' ')
      .toLowerCase()
      .includes(needle)
  })
}

const generalPane = `
  <template #general>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Profile</h2>
      <div class="divide-y divide-border">
        <div class="flex items-center justify-between gap-4 py-4">
          <span class="text-sm">Full name</span>
          <Input class="max-w-64" modelValue="b.jj" />
        </div>
        <div class="flex items-center justify-between gap-4 py-4">
          <span class="text-sm">Email</span>
          <Input class="max-w-64" modelValue="b.jj@example.com" />
        </div>
        <div class="flex items-center justify-between gap-4 py-4">
          <span class="text-sm">Email notifications</span>
          <Switch :modelValue="true" />
        </div>
      </div>
    </div>
  </template>
`

const accountPane = `
  <template #account>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Account</h2>
      <p class="text-sm text-muted-foreground">Manage the credentials used to sign in.</p>
      <Button variant="outline" icon="lock-keyhole">Change password</Button>
    </div>
  </template>
`

const fallbackPane = `
  <template #default="{ active, item }">
    <div class="space-y-2">
      <h2 class="text-lg font-semibold">{{ item?.label }}</h2>
      <p class="text-sm text-muted-foreground">No pane is declared for "{{ active }}" yet.</p>
    </div>
  </template>
`

const scrollingPane = `
  <template #general>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">Preferences</h2>
      <div class="divide-y divide-border">
        <div
          v-for="i in 20"
          :key="i"
          class="flex items-center justify-between gap-4 py-4"
        >
          <span class="text-sm">Preference {{ i }}</span>
          <Switch :modelValue="i % 2 === 0" />
        </div>
      </div>
    </div>
  </template>
`

const meta = {
  title: 'UI/SidebarModal',
  component: SidebarModal,
  argTypes: {
    menus: { control: 'object' },
    visible: { control: 'boolean' },
    active: { control: 'text' },
    searchable: { control: 'boolean' },
    search: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    title: { control: 'text' },
    modal: { control: 'boolean' },
    showClose: { control: 'boolean' },
    closeOnClickOutside: { control: 'boolean' },
    sidebarWidth: { control: 'text' },
    contentClass: { control: 'text' },
  },
  args: {
    menus,
    visible: false,
    active: 'general',
    searchable: true,
    search: '',
    searchPlaceholder: '',
    title: 'Settings',
    modal: true,
    showClose: true,
    closeOnClickOutside: false,
    sidebarWidth: '',
    contentClass: '',
  },
  render: args => {
    const onUpdateVisible = useArgsModel('visible')
    const onUpdateActive = useArgsModel('active')
    const onUpdateSearch = useArgsModel('search')
    return {
      components: { SidebarModal, Button, Input, Switch },
      setup: () => ({ args, onUpdateVisible, onUpdateActive, onUpdateSearch }),
      // Opening through `#trigger` keeps the demo alive on the Docs page, where
      // only the primary story's args round-trip; the emits still sync Controls.
      template: `
        <SidebarModal
          v-bind="args"
          @update:visible="onUpdateVisible"
          @update:active="onUpdateActive"
          @update:search="onUpdateSearch"
        >
          <template #trigger>
            <Button>Open Settings</Button>
          </template>

          ${generalPane}
          ${accountPane}
          ${fallbackPane}
        </SidebarModal>
      `,
    }
  },
} satisfies Meta<typeof SidebarModal>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithoutSearch: Story = {
  parameters: noControls,
  args: {
    searchable: false,
  },
}

export const SearchPlaceholder: Story = {
  parameters: noControls,
  args: {
    searchPlaceholder: 'Find a setting',
  },
}

// A search flattens matched children so none stays hidden behind a closed parent.
// A `searchable` function owns the listing, so the keyword can be matched against
// pane content: "dark" surfaces Appearance even though no label contains it.
export const CustomSearch: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <SidebarModal
    :menus="menus"
    :searchable="searchByContent"
    title="Settings"
  >
    <template #trigger>
      <Button>Open Settings</Button>
    </template>

    <template #default="{ active, item }">
      <h2 class="text-lg font-semibold">{{ item?.label }}</h2>
      <div
        v-for="row in paneContent[active]"
        :key="row"
        class="py-3 text-sm"
      >
        {{ row }}
      </div>
    </template>
  </SidebarModal>
</template>

<script setup lang="ts">
// One source of truth: the rows a pane renders are the rows search matches.
const searchByContent: SidebarModalFilter = (items, keyword) => {
  if (!keyword) return items
  const needle = keyword.toLowerCase()
  return items.filter(item => [ item.label, item.group, ...paneContent[item.key] ?? [] ]
    .join(' ')
    .toLowerCase()
    .includes(needle))
}
</script>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { SidebarModal, Button },
    setup: () => ({ menus, searchByContent, paneContent }),
    template: `
      <SidebarModal
        :menus="menus"
        :searchable="searchByContent"
        title="Settings"
        searchPlaceholder="Search settings or content"
      >
        <template #trigger>
          <Button>Open Settings</Button>
        </template>

        <template #default="{ active, item }">
          <div class="space-y-4">
            <h2 class="text-lg font-semibold">{{ item?.label }}</h2>
            <div class="divide-y divide-border">
              <div
                v-for="row in paneContent[active] || []"
                :key="row"
                class="py-3 text-sm capitalize"
              >
                {{ row }}
              </div>
            </div>
          </div>
        </template>
      </SidebarModal>
    `,
  }),
}

export const NestedMenus: Story = {
  parameters: noControls,
  args: {
    menus: nestedMenus,
    active: 'members',
  },
}

export const Sizing: Story = {
  parameters: noControls,
  args: {
    sidebarWidth: '12rem',
    contentClass: 'px-8 py-6',
    class: 'sm:max-w-2xl h-[560px]',
  },
}

// Both columns outgrow the dialog: the height stays capped and each side
// scrolls on its own, with the search field and the pane header staying put.
export const Scrolling: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <SidebarModal
    :menus="menus"
    title="Settings"
    searchable
  >
    <template #trigger>
      <Button>Open Settings</Button>
    </template>

    <template #general>
      <div class="divide-y divide-border">
        <div
          v-for="i in 20"
          :key="i"
          class="flex items-center justify-between gap-4 py-4"
        >
          <span class="text-sm">Preference {{ i }}</span>
          <Switch :modelValue="i % 2 === 0" />
        </div>
      </div>
    </template>
  </SidebarModal>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { SidebarModal, Button, Switch },
    setup: () => ({ menus: scrollingMenus }),
    template: `
      <SidebarModal :menus="menus" title="Settings" searchable>
        <template #trigger>
          <Button>Open Settings</Button>
        </template>

        ${scrollingPane}

        <template #default="{ item }">
          <h2 class="text-lg font-semibold">{{ item?.label }}</h2>
        </template>
      </SidebarModal>
    `,
  }),
}

export const ClickOutsideToClose: Story = {
  parameters: noControls,
  args: {
    showClose: false,
    closeOnClickOutside: true,
  },
}

export const NonModal: Story = {
  parameters: noControls,
  args: {
    modal: false,
  },
}

// The `#header` slot sits above the built-in search field rather than replacing it.
export const CustomHeader: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <SidebarModal
    v-model:visible="visible"
    :menus="menus"
    title="Settings"
    searchable
  >
    <template #header>
      <div class="flex items-center gap-2 px-2 py-1">
        <Icon name="building-2" />
        <span class="text-base font-semibold">Acme Inc.</span>
      </div>
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

    <template #default="{ item }">
      <h2 class="text-lg font-semibold">{{ item?.label }}</h2>
    </template>
  </SidebarModal>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { SidebarModal, Button, Icon },
    setup () {
      const visible = ref(false)
      return { visible, menus }
    },
    template: `
      <div>
        <Button @click="visible = true">Open Settings</Button>
        <SidebarModal v-model:visible="visible" :menus="menus" title="Settings" searchable>
          <template #header>
            <div class="flex items-center gap-2 px-2 py-1">
              <Icon name="building-2" />
              <span class="text-base font-semibold">Acme Inc.</span>
            </div>
          </template>

          <template #footer>
            <Button variant="ghost" icon="log-out" class="justify-start">Sign out</Button>
          </template>

          <template #default="{ item }">
            <h2 class="text-lg font-semibold">{{ item?.label }}</h2>
          </template>
        </SidebarModal>
      </div>
    `,
  }),
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { SidebarModal, Button, EventLog },
    setup () {
      const visible = ref(false)
      return { visible, menus }
    },
    template: `
      <EventLog v-slot="{ record }">
        <Button @click="visible = true">Open Settings</Button>
        <SidebarModal
          v-model:visible="visible"
          :menus="menus"
          title="Settings"
          searchable
          @open="record('open')"
          @close="record('close')"
          @closed="record('closed')"
          @select="(item) => record('select', item.label)"
          @update:active="(key) => record('update:active', key)"
          @update:visible="(value) => record('update:visible', value)"
        >
          <template #default="{ item }">
            <h2 class="text-lg font-semibold">{{ item?.label }}</h2>
          </template>
        </SidebarModal>
      </EventLog>
    `,
  }),
}
