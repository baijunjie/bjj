import type { Meta, StoryObj } from '@storybook/vue3'
import type { BreadcrumbItem } from './types'
import Breadcrumb from './index.vue'

const home: BreadcrumbItem = { label: 'Home', icon: 'house', href: '/' }

const basicItems: BreadcrumbItem[] = [
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'Laptops' },
]

const withIconItems: BreadcrumbItem[] = [
  { label: 'Settings', icon: 'settings', href: '/settings' },
  { label: 'Profile' },
]

const meta = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  argTypes: {
    model: { control: 'object' },
    home: { control: 'object' },
  },
  args: {
    model: basicItems,
    home,
  },
  render: args => ({
    components: { Breadcrumb },
    setup: () => ({ args }),
    template: '<Breadcrumb v-bind="args" />',
  }),
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHome: Story = {
  render: () => ({
    components: { Breadcrumb },
    setup: () => ({ home, basicItems }),
    template: '<Breadcrumb :home="home" :model="basicItems" />',
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: { Breadcrumb },
    setup: () => ({ home, withIconItems }),
    template: '<Breadcrumb :home="home" :model="withIconItems" />',
  }),
}

export const SingleItem: Story = {
  render: () => ({
    components: { Breadcrumb },
    setup: () => ({ home }),
    template: '<Breadcrumb :home="home" />',
  }),
}
