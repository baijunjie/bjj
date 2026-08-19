import type { Meta, StoryObj } from '@storybook/vue3'
import type { SidebarLayoutMenuItem } from '../SidebarLayout/types'
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
    return {
      components: { SidebarModal, Button, Input, Switch },
      setup: () => ({ args, onUpdateVisible, onUpdateActive }),
      // Opening through `#trigger` keeps the demo alive on the Docs page, where
      // only the primary story's args round-trip; the emits still sync Controls.
      template: `
        <SidebarModal
          v-bind="args"
          @update:visible="onUpdateVisible"
          @update:active="onUpdateActive"
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
        <SidebarModal v-model:visible="visible" :menus="menus" title="Settings">
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
