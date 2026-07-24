import type { Meta, StoryObj } from '@storybook/vue3'
import type { AdminLayoutSidebarDropdownProfile, AdminLayoutSidebarMenuItem, AdminLayoutSidebarDropdownMenuItem } from './types'
import AdminLayout from './index.vue'
import Button from '../Button/index.vue'
import Card from '../Card/index.vue'

const variants = [ 'sidebar', 'floating', 'inset' ] as const
const collapsibles = [ 'icon', 'offcanvas', 'none' ] as const

const menus: AdminLayoutSidebarMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'layout-dashboard',
    href: '#',
  },
  {
    label: 'Inbox',
    icon: 'inbox',
    href: '#inbox',
  },
  {
    label: 'Documentation',
    icon: 'book-open',
    group: 'Platform',
    expanded: true,
    children: [
      { label: 'Introduction', href: '#intro' },
      { label: 'Get Started', href: '#get-started' },
      { label: 'Tutorials', href: '#tutorials' },
    ],
  },
  {
    label: 'Settings',
    icon: 'settings',
    group: 'Platform',
    children: [
      { label: 'General', href: '#general' },
      { label: 'Team', href: '#team' },
      { label: 'Billing', href: '#billing' },
    ],
  },
  {
    label: 'Design Engineering',
    icon: 'frame',
    href: '#design',
    group: 'Projects',
    actions: [
      { label: 'View Project', icon: 'folder', href: '#design' },
      { label: 'Share Project', icon: 'forward', command: () => {} },
      { label: 'Delete Project', icon: 'trash-2', command: () => {} },
    ],
  },
  {
    label: 'Sales & Marketing',
    icon: 'pie-chart',
    href: '#sales',
    group: 'Projects',
    actions: [
      { label: 'View Project', icon: 'folder', href: '#sales' },
      { label: 'Delete Project', icon: 'trash-2', command: () => {} },
    ],
  },
  {
    label: 'shadcn-vue Docs',
    icon: 'book-open-text',
    href: 'https://www.shadcn-vue.com',
    group: 'Links',
  },
  {
    label: 'Print Page',
    icon: 'printer',
    group: 'Links',
    command: () => {},
  },
]

// Footer dropdown menu: the profile carries a `command`, so it is clickable.
const menuItems: AdminLayoutSidebarDropdownMenuItem[] = [
  { type: 'profile', icon: 'building-2', title: 'Acme Inc.', subtitle: 'Owner', command: () => {}, actionIcon: 'arrow-left-right' },
  { type: 'separator' },
  { type: 'action', label: 'Change Password', icon: 'lock-keyhole', command: () => {} },
  { type: 'separator' },
  {
    type: 'action',
    label: 'Language',
    icon: 'languages',
    subMenus: [
      { label: 'English', active: true, command: () => {} },
      { label: '日本語', command: () => {} },
    ],
  },
  {
    type: 'action',
    label: 'Theme',
    icon: 'sun-moon',
    subMenus: [
      { label: 'Light', icon: 'sun', active: true, command: () => {} },
      { label: 'System', icon: 'monitor', command: () => {} },
      { label: 'Dark', icon: 'moon', command: () => {} },
    ],
  },
  { type: 'separator' },
  { type: 'action', label: 'Sign Out', icon: 'log-out', command: () => {} },
]

const profile: AdminLayoutSidebarDropdownProfile = {
  title: 'Demo User',
  subtitle: 'demo@example.com',
  actionIcon: 'chevrons-up-down',
}

const layoutContent = `
  <template #logo>
    <div class="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">A</div>
  </template>

  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Overview</h1>
        <p class="text-sm text-muted-foreground">Welcome back, here is what is happening today.</p>
      </div>
      <Button icon="plus">New Project</Button>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <Card title="Total Revenue">
        <div class="text-2xl font-semibold">$45,231.89</div>
        <p class="text-xs text-muted-foreground">+20.1% from last month</p>
      </Card>
      <Card title="Subscriptions">
        <div class="text-2xl font-semibold">+2,350</div>
        <p class="text-xs text-muted-foreground">+180.1% from last month</p>
      </Card>
      <Card title="Active Users">
        <div class="text-2xl font-semibold">+12,234</div>
        <p class="text-xs text-muted-foreground">+19% from last month</p>
      </Card>
    </div>

    <Card title="Recent Activity">
      <ul class="divide-y divide-border text-sm">
        <li class="flex items-center justify-between py-3">
          <span>Alice updated the design system</span>
          <span class="text-xs text-muted-foreground">2 min ago</span>
        </li>
        <li class="flex items-center justify-between py-3">
          <span>Bob deployed v1.4.0 to production</span>
          <span class="text-xs text-muted-foreground">1 hour ago</span>
        </li>
        <li class="flex items-center justify-between py-3">
          <span>Charlie opened a new issue</span>
          <span class="text-xs text-muted-foreground">3 hours ago</span>
        </li>
      </ul>
    </Card>
  </div>
`

const meta = {
  title: 'UI/AdminLayout',
  component: AdminLayout,
  argTypes: {
    menus: { control: 'object' },
    brandName: { control: 'text' },
    footerDropdown: { control: 'object' },
    variant: { control: 'select', options: variants },
    collapsible: { control: 'select', options: collapsibles },
  },
  args: {
    menus,
    brandName: 'Acme Inc.',
    footerDropdown: { profile, menuItems },
    variant: 'sidebar',
    collapsible: 'icon',
  },
  render: args => ({
    components: { AdminLayout, Button, Card },
    setup () {
      return { args }
    },
    template: `<AdminLayout v-bind="args">${layoutContent}</AdminLayout>`,
  }),
  decorators: [
    () => ({
      template: `
        <div
          class="relative h-[700px] overflow-hidden rounded-lg border border-border
            [&_[data-slot=sidebar]>div:last-child]:absolute!
            [&_[data-slot=sidebar]>div:last-child]:h-full!"
        >
          <story />
        </div>
      `,
    }),
  ],
} satisfies Meta<typeof AdminLayout>

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

// Phone viewport: the sidebar collapses into the drawer opened by the floating trigger.
export const Mobile: Story = {
  parameters: {
    ...noControls,
    viewport: {
      options: {
        mobile: {
          name: 'Mobile',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
      },
    },
  },
  globals: {
    viewport: { value: 'mobile', isRotated: false },
  },
}
