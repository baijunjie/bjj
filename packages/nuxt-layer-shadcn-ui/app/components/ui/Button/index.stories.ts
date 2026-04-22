import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from '../Icon/index.vue'
import Button from './index.vue'

type ButtonVariant
  = | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'

const variants: ButtonVariant[] = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
]
const sizes: ButtonSize[] = [
  'sm',
  'default',
  'lg',
  'icon-sm',
  'icon',
  'icon-lg',
]

const meta = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
    rounded: { control: 'boolean' },
    icon: { control: 'text' },
    iconPosition: { control: 'select', options: [ 'start', 'end' ]},
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    size: 'default',
    rounded: false,
    icon: '',
    iconPosition: 'start',
    loading: false,
    disabled: false,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    loading: false,
  },

  render: args => ({
    components: { Button, Icon },
    setup: () => ({ args, variants, sizes }),
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Button v-bind="args">Button</Button>
        </section>

        <!-- Variants -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Variants</h3>
          <div class="flex flex-wrap items-center gap-3">
            <Button v-for="v in variants" :key="v" :variant="v">{{ v }}</Button>
          </div>
        </section>

        <!-- Sizes -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Sizes</h3>
          <div class="flex flex-wrap items-center gap-3">
            <Button v-for="s in sizes" :key="s" :size="s">
              <Icon v-if="s.startsWith('icon')" name="plus" />
              <template v-else>{{ s }}</template>
            </Button>
          </div>
        </section>

        <!-- With Icons -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Icons</h3>
          <div class="flex flex-wrap items-center gap-3">
            <Button icon="mail">Login with Email</Button>
            <Button icon="chevron-right" iconPosition="end" variant="secondary">Next</Button>
            <Button icon="trash-2" variant="destructive">Delete</Button>
            <Button icon="plus" size="icon" variant="outline" />
          </div>
        </section>

        <!-- Loading -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Loading</h3>
          <div class="flex flex-wrap items-center gap-3">
            <Button loading icon="mail">Login with Email</Button>
            <Button loading icon="chevron-right" iconPosition="end" variant="secondary">Next</Button>
            <Button loading icon="trash-2" variant="destructive">Delete</Button>
            <Button loading icon="plus" size="icon" variant="outline" />
          </div>
        </section>

        <!-- Disabled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Disabled</h3>
          <div class="flex flex-wrap items-center gap-3">
            <Button v-for="v in variants" :key="v" :variant="v" disabled>{{ v }}</Button>
          </div>
        </section>

        <!-- Rounded -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Rounded</h3>
          <div class="flex flex-wrap items-center gap-3">
            <Button rounded>Rounded</Button>
            <Button rounded variant="outline">Outline</Button>
            <Button rounded variant="secondary">Secondary</Button>
            <Button rounded size="icon" variant="outline" icon="plus" />
            <Button rounded size="icon" variant="secondary" icon="sun" />
          </div>
        </section>

        <!-- Link Buttons -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Link Buttons</h3>
          <div class="flex flex-wrap items-center gap-3">
            <Button href="/dialog" variant="outline">Internal Link</Button>
            <Button href="https://example.com" icon="chevron-right" iconPosition="end">External Link</Button>
          </div>
        </section>
      </div>
    `,
  }),
}
