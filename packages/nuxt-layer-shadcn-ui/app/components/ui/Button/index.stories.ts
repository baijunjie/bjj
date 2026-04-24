import type { Meta, StoryObj } from '@storybook/vue3'
import type { ButtonSize, ButtonVariant } from './types'
import Icon from '../Icon/index.vue'
import Button from './index.vue'

const variants = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
] as const satisfies readonly ButtonVariant[]

const sizes = [
  'sm',
  'default',
  'lg',
  'icon-sm',
  'icon',
  'icon-lg',
] as const satisfies readonly ButtonSize[]

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
  render: args => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Button</Button>',
  }),
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => ({
    components: { Button },
    setup: () => ({ variants }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button v-for="v in variants" :key="v" :variant="v">{{ v }}</Button>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Button, Icon },
    setup: () => ({ sizes }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button v-for="s in sizes" :key="s" :size="s">
          <Icon v-if="s.startsWith('icon')" name="plus" />
          <template v-else>{{ s }}</template>
        </Button>
      </div>
    `,
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button icon="mail">Login with Email</Button>
        <Button icon="chevron-right" iconPosition="end" variant="secondary">Next</Button>
        <Button icon="trash-2" variant="destructive">Delete</Button>
        <Button icon="plus" size="icon" variant="outline" />
      </div>
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button loading icon="mail">Login with Email</Button>
        <Button loading icon="chevron-right" iconPosition="end" variant="secondary">Next</Button>
        <Button loading icon="trash-2" variant="destructive">Delete</Button>
        <Button loading icon="plus" size="icon" variant="outline" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Button },
    setup: () => ({ variants }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button v-for="v in variants" :key="v" :variant="v" disabled>{{ v }}</Button>
      </div>
    `,
  }),
}

export const Rounded: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button rounded>Rounded</Button>
        <Button rounded variant="outline">Outline</Button>
        <Button rounded variant="secondary">Secondary</Button>
        <Button rounded size="icon" variant="outline" icon="plus" />
        <Button rounded size="icon" variant="secondary" icon="sun" />
      </div>
    `,
  }),
}

export const LinkButtons: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button href="/dialog" variant="outline">Internal Link</Button>
        <Button href="https://example.com" icon="external-link" iconPosition="end">External Link</Button>
      </div>
    `,
  }),
}
