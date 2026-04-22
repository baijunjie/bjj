import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from '../Icon/index.vue'
import Input from './index.vue'

const meta = {
  title: 'UI/Input',
  component: Input,
  argTypes: {
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    disabled: false,
    readonly: false,
    invalid: false,
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Input, Icon },
    setup () {
      const value = ref('')
      const withPrefix = ref('')
      const withSuffix = ref('')
      const password = ref('')
      return { args, value, withPrefix, withSuffix, password }
    },
    template: `
      <div class="space-y-10 max-w-sm">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Input v-model="value" v-bind="args" placeholder="Enter your name..." />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
        </section>

        <!-- With Prefix Icon -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Prefix Icon</h3>
          <Input v-model="withPrefix" placeholder="Search...">
            <template #prefix>
              <Icon name="search" />
            </template>
          </Input>
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ withPrefix }}</div>
        </section>

        <!-- With Suffix Icon -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Suffix Icon</h3>
          <Input v-model="withSuffix" placeholder="Email">
            <template #suffix>
              <Icon name="mail" />
            </template>
          </Input>
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ withSuffix }}</div>
        </section>

        <!-- Password -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Password</h3>
          <Input v-model="password" type="password" placeholder="Password" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ password }}</div>
        </section>
      </div>
    `,
  }),
}
