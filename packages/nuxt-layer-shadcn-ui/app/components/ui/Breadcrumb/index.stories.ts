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

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithIcons: Story = {
  parameters: noControls,
  args: {
    home,
    model: withIconItems,
  },
}

export const SingleItem: Story = {
  parameters: noControls,
  args: {
    home,
    model: undefined,
  },
}
