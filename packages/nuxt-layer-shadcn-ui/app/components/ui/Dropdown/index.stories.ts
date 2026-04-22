import type { Meta, StoryObj } from '@storybook/vue3'
import type { DropdownItem } from './types'
import Button from '../Button/index.vue'
import Dropdown from './index.vue'

const meta = {
  title: 'UI/Dropdown',
  component: Dropdown,
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

const basicMenus: DropdownItem[] = [
  { label: 'Edit', icon: 'pencil' },
  { label: 'Duplicate', icon: 'copy' },
  { type: 'separator' },
  { label: 'Delete', icon: 'trash-2', color: 'danger' },
]

export const Default: Story = {
  render: () => ({
    components: { Dropdown, Button },
    setup () {
      const menus: DropdownItem[] = [
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

      return { basicMenus, menus, linkMenus }
    },
    template: `
      <div class="space-y-10">
        <!-- Hover Trigger -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Hover Trigger</h3>
          <Dropdown :menus="basicMenus" trigger="hover">
            <Button variant="outline">Hover me</Button>
          </Dropdown>
        </section>

        <!-- Click Trigger -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Click Trigger</h3>
          <Dropdown :menus="basicMenus" trigger="click">
            <Button variant="outline">Click me</Button>
          </Dropdown>
        </section>

        <!-- With Disabled Items -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Disabled Items</h3>
          <Dropdown :menus="menus" trigger="click">
            <Button variant="outline">Account</Button>
          </Dropdown>
        </section>

        <!-- With Links -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Links</h3>
          <Dropdown :menus="linkMenus" trigger="click">
            <Button variant="outline">Resources</Button>
          </Dropdown>
        </section>
      </div>
    `,
  }),
}

export const WithGroups: Story = {
  render: () => ({
    components: { Dropdown, Button },
    setup () {
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

      return { groupedMenus }
    },
    template: `
      <Dropdown :menus="groupedMenus" trigger="click">
        <Button variant="outline">Menu with Groups</Button>
      </Dropdown>
    `,
  }),
}

export const WithCustomSlots: Story = {
  render: () => ({
    components: { Dropdown, Button },
    setup () {
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

      return { customMenus }
    },
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
