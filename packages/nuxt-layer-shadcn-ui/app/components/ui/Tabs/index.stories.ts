import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
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
    listClass: { control: 'text' },
    triggerClass: { control: 'text' },
  },
  args: {
    items,
    modelValue: undefined,
    defaultValue: 'account',
    rounded: false,
    iconOnly: false,
    listClass: '',
    triggerClass: '',
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

export const IconOnly: Story = {
  parameters: noControls,
  args: {
    iconOnly: true,
  },
}

export const Rounded: Story = {
  parameters: noControls,
  args: {
    rounded: true,
  },
}

export const DisabledItem: Story = {
  parameters: noControls,
  args: {
    items: disabledItems,
  },
}

export const NoContent: Story = {
  parameters: noControls,
  args: {
    items: navItems,
  },
}

export const CustomSlots: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
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
</template>
`.trim(),
      },
    },
  },
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

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { Tabs, EventLog },
    setup: () => ({ items, value: ref('account') }),
    template: `
      <EventLog v-slot="{ record }">
        <Tabs
          v-model="value"
          :items="items"
          class="max-w-md"
          @update:modelValue="(v) => record('update:modelValue', v)"
        />
      </EventLog>
    `,
  }),
}
