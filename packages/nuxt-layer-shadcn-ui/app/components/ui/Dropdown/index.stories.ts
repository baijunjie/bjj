import type { Meta, StoryObj } from '@storybook/vue3'
import type { DropdownItem } from './types'
import Button from '../Button/index.vue'
import Dropdown from './index.vue'

const triggers = [ 'click', 'hover' ] as const
const sides = [ 'top', 'bottom', 'left', 'right' ] as const
const aligns = [ 'start', 'center', 'end' ] as const

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
  { label: 'Documentation', icon: 'book-open', href: 'https://example.com/docs', target: '_blank', active: true },
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

const iconColorMenus: DropdownItem[] = [
  { label: 'Default item', icon: 'circle' },
  { label: 'Primary icon only', icon: 'star', iconColor: 'primary' },
  { label: 'Success icon only', icon: 'circle-check', iconColor: 'success' },
  { label: 'Warn icon only', icon: 'triangle-alert', iconColor: 'warn' },
  { label: 'Danger icon only', icon: 'shield-alert', iconColor: 'danger' },
  { type: 'separator' },
  { label: 'Both danger', icon: 'trash-2', color: 'danger', iconColor: 'danger' },
  { label: 'Danger label, info icon', icon: 'info', color: 'danger', iconColor: 'info' },
]

const subMenus: DropdownItem[] = [
  { label: 'New File', icon: 'file-plus' },
  { label: 'New Folder', icon: 'folder-plus' },
  { type: 'separator' },
  {
    label: 'Share',
    icon: 'share-2',
    subMenus: [
      { label: 'Email link', icon: 'mail' },
      { label: 'Copy link', icon: 'link' },
      { type: 'separator' },
      {
        label: 'Social',
        icon: 'globe',
        subMenus: [
          { label: 'Twitter', icon: 'twitter' },
          { label: 'Facebook', icon: 'facebook' },
          { label: 'LinkedIn', icon: 'linkedin' },
        ],
      },
    ],
  },
  {
    label: 'Move to',
    icon: 'folder-symlink',
    active: true,
    subMenus: [
      { label: 'Documents', icon: 'folder' },
      { label: 'Downloads', icon: 'folder', active: true },
      { label: 'Trash', icon: 'trash-2', color: 'danger', iconColor: 'danger' },
    ],
  },
  { type: 'separator' },
  { label: 'Delete', icon: 'trash-2', color: 'danger' },
]

const meta = {
  title: 'UI/Dropdown',
  component: Dropdown,
  argTypes: {
    menus: { control: 'object' },
    trigger: { control: 'inline-radio', options: triggers },
    side: { control: 'select', options: sides },
    align: { control: 'select', options: aligns },
    sideOffset: { control: 'number' },
    minWidth: { control: 'text' },
  },
  args: {
    menus: basicMenus,
    trigger: 'click',
    side: undefined,
    align: undefined,
    sideOffset: undefined,
    minWidth: undefined,
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
  args: {
    menus: basicMenus,
    trigger: 'hover',
  },
}

export const WithDisabledItems: Story = {
  parameters: noControls,
  args: {
    menus: accountMenus,
    trigger: 'click',
  },
}

export const WithLinks: Story = {
  parameters: noControls,
  args: {
    menus: linkMenus,
    trigger: 'click',
  },
}

export const WithGroups: Story = {
  parameters: noControls,
  args: {
    menus: groupedMenus,
    trigger: 'click',
  },
}

export const WithIconColor: Story = {
  parameters: noControls,
  args: {
    menus: iconColorMenus,
    trigger: 'click',
  },
}

export const WithSubMenus: Story = {
  parameters: noControls,
  args: {
    menus: subMenus,
    trigger: 'click',
  },
}

export const WithSubMenusHover: Story = {
  parameters: noControls,
  args: {
    menus: subMenus,
    trigger: 'hover',
  },
}

export const WithMinWidth: Story = {
  parameters: noControls,
  args: {
    menus: subMenus,
    trigger: 'click',
    minWidth: 240,
  },
}

export const EmptyMenus: Story = {
  parameters: noControls,
  args: {
    menus: [],
    trigger: 'click',
  },
}

export const CustomSlots: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
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
</template>
`.trim(),
      },
    },
  },
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
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
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
</template>
`.trim(),
      },
    },
  },
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
