import type { Meta, StoryObj } from '@storybook/vue3'
import Card from '../Card/index.vue'
import type { TabsItem } from './types'
import Tabs from './index.vue'

const items: TabsItem[] = [
  {
    value: 'account',
    title: 'Account',
    icon: 'user',
    content: 'Manage your account details, profile information, and preferences here.',
  },
  {
    value: 'password',
    title: 'Password',
    icon: 'lock',
    content: 'Update your password and manage two-factor authentication settings.',
  },
  {
    value: 'notifications',
    title: 'Notifications',
    icon: 'bell',
    content: 'Control which notifications you receive and how they are delivered.',
  },
]

const navItems: TabsItem[] = items.map(({ content, ...rest }) => rest)

const disabledItems: TabsItem[] = items.map((item, index) =>
  index === 2 ? { ...item, disabled: true } : item,
)

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  argTypes: {
    items: { control: 'object' },
    modelValue: { control: 'text' },
    defaultValue: { control: 'text' },
    rounded: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
  },
  args: {
    items,
    modelValue: undefined,
    defaultValue: 'account',
    rounded: false,
    iconOnly: false,
  },
  render: args => ({
    components: { Tabs },
    setup: () => ({ args }),
    template: '<Tabs v-bind="args" class="max-w-md" />',
  }),
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Controlled: Story = {
  parameters: noControls,
  render: () => ({
    components: { Tabs },
    setup () {
      const value = ref<string>('account')
      return { items, value }
    },
    template: `
      <div class="max-w-md space-y-3">
        <Tabs v-model="value" :items="items" />
        <div class="text-sm text-muted-foreground">Active: {{ value }}</div>
      </div>
    `,
  }),
}

export const IconOnly: Story = {
  parameters: noControls,
  render: () => ({
    components: { Tabs },
    setup: () => ({ items }),
    template: `
      <Tabs
        icon-only
        :items="items"
        default-value="account"
        class="max-w-md"
      />
    `,
  }),
}

export const Rounded: Story = {
  parameters: noControls,
  render: () => ({
    components: { Tabs },
    setup: () => ({ items }),
    template: `
      <Tabs
        rounded
        :items="items"
        default-value="account"
        class="max-w-md"
      />
    `,
  }),
}

export const DisabledItem: Story = {
  parameters: noControls,
  render: () => ({
    components: { Tabs },
    setup: () => ({ disabledItems }),
    template: `
      <Tabs
        :items="disabledItems"
        default-value="account"
        class="max-w-md"
      />
    `,
  }),
}

export const NoContent: Story = {
  parameters: noControls,
  render: () => ({
    components: { Tabs },
    setup: () => ({ navItems }),
    template: `
      <Tabs
        :items="navItems"
        default-value="account"
        class="max-w-md"
      />
    `,
  }),
}

export const CustomSlots: Story = {
  parameters: noControls,
  render: () => ({
    components: { Tabs, Card },
    setup: () => ({ items }),
    template: `
      <Tabs
        :items="items"
        default-value="account"
        list-class="w-full"
        class="max-w-md"
      >
        <template #title="{ item, active }">
          <span :class="active ? 'font-semibold' : ''">{{ item.title }}</span>
        </template>
        <template #content="{ item }">
          <Card>
            <p class="text-sm text-muted-foreground">{{ item.content }}</p>
          </Card>
        </template>
      </Tabs>
    `,
  }),
}
