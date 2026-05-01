import type { Meta, StoryObj } from '@storybook/vue3'
import type { SurfaceColor } from '../Surface/types'
import type { ButtonSize, ButtonVariant } from './types'
import Icon from '../Icon/index.vue'
import Surface from '../Surface/index.vue'
import Button from './index.vue'

const variants = [
  'default',
  'secondary',
  'destructive',
  'outline',
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

const surfaceColors = [
  'default',
  'primary',
  'success',
  'info',
  'help',
  'warn',
  'danger',
] as const satisfies readonly SurfaceColor[]

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
    href: { control: 'text' },
    target: { control: 'text' },
    class: { control: 'text' },
  },
  args: {
    variant: 'default',
    size: 'default',
    rounded: false,
    icon: '',
    iconPosition: 'start',
    loading: false,
    disabled: false,
    href: '',
    target: '',
    class: '',
  },
  render: args => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Button</Button>',
  }),
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Variants: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Button variant="default">default</Button>
  <Button variant="secondary">secondary</Button>
  <Button variant="destructive">destructive</Button>
  <Button variant="outline">outline</Button>
  <Button variant="ghost">ghost</Button>
  <Button variant="link">link</Button>
</template>
`.trim(),
      },
    },
  },
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
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Button size="sm">sm</Button>
  <Button size="default">default</Button>
  <Button size="lg">lg</Button>
  <Button size="icon-sm"><Icon name="plus" /></Button>
  <Button size="icon"><Icon name="plus" /></Button>
  <Button size="icon-lg"><Icon name="plus" /></Button>
</template>
`.trim(),
      },
    },
  },
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
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Button icon="mail">Login with Email</Button>
  <Button icon="chevron-right" iconPosition="end" variant="secondary">Next</Button>
  <Button icon="trash-2" variant="destructive">Delete</Button>
  <Button icon="plus" size="icon" variant="outline" />
</template>
`.trim(),
      },
    },
  },
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
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Button loading icon="mail">Login with Email</Button>
  <Button loading icon="chevron-right" iconPosition="end" variant="secondary">Next</Button>
  <Button loading icon="trash-2" variant="destructive">Delete</Button>
  <Button loading icon="plus" size="icon" variant="outline" />
</template>
`.trim(),
      },
    },
  },
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
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Button variant="default" disabled>default</Button>
  <Button variant="destructive" disabled>destructive</Button>
  <Button variant="outline" disabled>outline</Button>
  <Button variant="secondary" disabled>secondary</Button>
  <Button variant="ghost" disabled>ghost</Button>
  <Button variant="link" disabled>link</Button>
</template>
`.trim(),
      },
    },
  },
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
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Button rounded>Rounded</Button>
  <Button rounded variant="outline">Outline</Button>
  <Button rounded variant="secondary">Secondary</Button>
  <Button rounded size="icon" variant="outline" icon="plus" />
  <Button rounded size="icon" variant="secondary" icon="sun" />
</template>
`.trim(),
      },
    },
  },
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
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Button href="/dialog" variant="outline">Internal Link</Button>
  <Button href="https://example.com" icon="external-link" iconPosition="end">External Link</Button>
</template>
`.trim(),
      },
    },
  },
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

export const InheritedHoverColor: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <!-- outline / ghost / link inherit the parent's currentColor -->
  <Surface variant="soft" color="success">
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
  </Surface>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Button, Surface },
    setup: () => ({ surfaceColors }),
    template: `
      <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Surface
          v-for="c in surfaceColors"
          :key="c"
          variant="soft"
          :color="c"
          class="p-3 flex items-center gap-2"
        >
          <span class="mr-auto text-sm font-medium capitalize">{{ c }}</span>
          <Button variant="outline" size="sm">Outline</Button>
          <Button variant="ghost" size="sm">Ghost</Button>
          <Button variant="link" size="sm">Link</Button>
        </Surface>
      </div>
    `,
  }),
}
