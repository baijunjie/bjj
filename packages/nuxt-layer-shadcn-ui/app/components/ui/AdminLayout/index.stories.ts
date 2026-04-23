import type { Meta, StoryObj } from '@storybook/vue3'
import type { AdminLayoutSidebarDropdownProfile, AdminLayoutSidebarMenuItem, AdminLayoutSidebarDropdownMenuItem } from './types'
import AdminLayout from './index.vue'
import Avatar from '../Avatar/index.vue'
import Breadcrumb from '../Breadcrumb/index.vue'
import Button from '../Button/index.vue'
import Card from '../Card/index.vue'

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

const menuItems: AdminLayoutSidebarDropdownMenuItem[] = [
  { type: 'profile', title: 'Demo User', subtitle: 'demo@example.com' },
  { type: 'action', label: 'Account', icon: 'badge-check', command: () => {} },
  { type: 'action', label: 'Billing', icon: 'credit-card', command: () => {} },
  { type: 'action', label: 'Notifications', icon: 'bell', command: () => {} },
  { type: 'separator' },
  { type: 'action', label: 'Sign Out', icon: 'log-out', command: () => {} },
]

const profile: AdminLayoutSidebarDropdownProfile = {
  title: 'Demo User',
  subtitle: 'demo@example.com',
}

const meta = {
  title: 'UI/AdminLayout',
  component: AdminLayout,
  argTypes: {
    variant: {
      control: 'select',
      options: [ 'sidebar', 'floating', 'inset' ],
    },
    collapsible: {
      control: 'select',
      options: [ 'icon', 'offcanvas', 'none' ],
    },
  },
  args: {
    menus,
    footerDropdown: { profile, menuItems },
    variant: 'sidebar',
    collapsible: 'icon',
  },
  render: args => ({
    components: { AdminLayout, Avatar, Breadcrumb, Button, Card },
    setup () {
      const breadcrumb = [
        { label: 'Dashboard', href: '#' },
        { label: 'Overview' },
      ]
      return { args, breadcrumb }
    },
    template: `
      <AdminLayout v-bind="args">
        <template #navbar-left>
          <Breadcrumb :model="breadcrumb" />
        </template>
        <template #navbar-right>
          <Button variant="ghost" size="icon" icon="search" aria-label="Search" />
          <Button variant="ghost" size="icon" icon="bell" aria-label="Notifications" />
          <Avatar label="DU" size="small" />
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
      </AdminLayout>
    `,
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

export const Default: Story = {}

export const Floating: Story = {
  args: { variant: 'floating' },
}

export const Inset: Story = {
  args: { variant: 'inset' },
}
