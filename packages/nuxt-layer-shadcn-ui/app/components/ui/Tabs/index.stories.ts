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
    rounded: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
  },
  args: {
    rounded: false,
    iconOnly: false,
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Tabs, Card },
    setup () {
      const value = ref<string>('account')
      return { args, items, navItems, disabledItems, value }
    },
    template: `
      <div class="max-w-md space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Tabs
            v-model="value"
            v-bind="args"
            :items="items"
          />
          <div class="mt-3 text-sm text-muted-foreground">Active: {{ value }}</div>
        </section>

        <!-- Icon Only (title used as aria-label) -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Icon Only</h3>
          <Tabs
            icon-only
            :items="items"
            default-value="account"
          />
        </section>

        <!-- Rounded -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Rounded</h3>
          <Tabs
            rounded
            :items="items"
            default-value="account"
          />
        </section>

        <!-- Disabled Item -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Disabled Item</h3>
          <Tabs
            :items="disabledItems"
            default-value="account"
          />
        </section>

        <!-- No Content (triggers only, no gap below) -->
        <section>
          <h3 class="mb-4 text-lg font-medium">No Content</h3>
          <Tabs
            :items="navItems"
            default-value="account"
          />
        </section>

        <!-- Custom Slots -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Custom Slots</h3>
          <Tabs
            :items="items"
            default-value="account"
            list-class="w-full"
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
        </section>
      </div>
    `,
  }),
}
