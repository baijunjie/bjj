import type { Meta, StoryObj } from '@storybook/vue3'
import type { DropdownItem } from './types'
import Button from '../Button/index.vue'
import Dropdown from './index.vue'

const basicMenus: DropdownItem[] = [
  { label: 'Edit', icon: 'pencil' },
  { label: 'Duplicate', icon: 'copy' },
  { type: 'separator' },
  { label: 'Delete', icon: 'trash-2', color: 'danger' },
]

const accountMenus: DropdownItem[] = [
  { label: 'Profile', icon: 'user' },
  { label: 'Settings', icon: 'settings' },
  { label: 'Admin Panel', icon: 'shield', disabled: true },
  { type: 'separator' },
  { label: 'Logout', icon: 'log-out' },
]

const linkMenus: DropdownItem[] = [
  { label: 'Documentation', icon: 'book-open', href: 'https://example.com/docs', target: '_blank' },
  { label: 'Support', icon: 'life-buoy', href: 'https://example.com/support', target: '_blank' },
]

const groupedMenus: DropdownItem[] = [
  { type: 'label', label: 'Organization' },
  { label: 'Switch Org', icon: 'arrow-left-right' },
  { type: 'separator' },
  { type: 'label', label: 'Account' },
  { label: 'Profile', icon: 'user' },
  { label: 'Settings', icon: 'settings' },
  { type: 'separator' },
  { label: 'Logout', icon: 'log-out' },
]

const customMenus: DropdownItem[] = [
  {
    type: 'custom-label',
    slot: 'profile',
    title: 'Demo User',
    email: 'demo@example.com',
  },
  { type: 'separator' },
  { label: 'Profile', icon: 'user' },
  { label: 'Settings', icon: 'settings' },
  { type: 'separator' },
  {
    type: 'custom-action',
    slot: 'logout',
    command: () => alert('Logged out'),
  },
]

const meta = {
  title: 'UI/Dropdown',
  component: Dropdown,
  argTypes: {
    menus: { control: 'object' },
    trigger: { control: 'inline-radio', options: [ 'click', 'hover' ]},
    side: { control: 'select', options: [ 'top', 'bottom', 'left', 'right' ]},
    align: { control: 'select', options: [ 'start', 'center', 'end' ]},
    sideOffset: { control: 'number' },
  },
  args: {
    menus: basicMenus,
    trigger: 'click',
    side: undefined,
    align: undefined,
    sideOffset: undefined,
  },
  render: args => ({
    components: { Dropdown, Button },
    setup: () => ({ args }),
    template: `
      <Dropdown v-bind="args">
        <Button variant="outline">Open Menu</Button>
      </Dropdown>
    `,
  }),
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const HoverTrigger: Story = {
  parameters: noControls,
  render: () => ({
    components: { Dropdown, Button },
    setup: () => ({ basicMenus }),
    template: `
      <Dropdown :menus="basicMenus" trigger="hover">
        <Button variant="outline">Hover me</Button>
      </Dropdown>
    `,
  }),
}

export const WithDisabledItems: Story = {
  parameters: noControls,
  render: () => ({
    components: { Dropdown, Button },
    setup: () => ({ accountMenus }),
    template: `
      <Dropdown :menus="accountMenus" trigger="click">
        <Button variant="outline">Account</Button>
      </Dropdown>
    `,
  }),
}

export const WithLinks: Story = {
  parameters: noControls,
  render: () => ({
    components: { Dropdown, Button },
    setup: () => ({ linkMenus }),
    template: `
      <Dropdown :menus="linkMenus" trigger="click">
        <Button variant="outline">Resources</Button>
      </Dropdown>
    `,
  }),
}

export const WithGroups: Story = {
  parameters: noControls,
  render: () => ({
    components: { Dropdown, Button },
    setup: () => ({ groupedMenus }),
    template: `
      <Dropdown :menus="groupedMenus" trigger="click">
        <Button variant="outline">Menu with Groups</Button>
      </Dropdown>
    `,
  }),
}

export const CustomSlots: Story = {
  parameters: noControls,
  render: () => ({
    components: { Dropdown, Button },
    setup: () => ({ customMenus }),
    template: `
      <Dropdown :menus="customMenus" trigger="click">
        <Button variant="outline">Custom Slots</Button>
        <template #profile="{ item }">
          <div class="flex flex-col gap-1 px-2 py-1.5">
            <span class="font-semibold text-sm">{{ item.title }}</span>
            <span class="text-xs text-muted-foreground">{{ item.email }}</span>
          </div>
        </template>
        <template #logout>
          <span class="flex items-center gap-2 text-danger font-semibold">
            <span>🚪</span>
            <span>Custom Logout</span>
          </span>
        </template>
      </Dropdown>
    `,
  }),
}

export const PopupSlot: Story = {
  parameters: noControls,
  render: () => ({
    components: { Dropdown, Button },
    template: `
      <Dropdown trigger="click">
        <Button variant="outline">Custom Popup</Button>
        <template #popup="{ hide }">
          <div class="flex flex-col gap-2 p-3 min-w-[220px]">
            <div class="text-sm font-semibold">Custom content</div>
            <p class="text-sm text-muted-foreground">
              Use the <code>popup</code> slot to render arbitrary content inside the menu.
            </p>
            <Button size="sm" @click="hide">Close</Button>
          </div>
        </template>
      </Dropdown>
    `,
  }),
}
