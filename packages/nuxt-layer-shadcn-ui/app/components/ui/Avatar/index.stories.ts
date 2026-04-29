import type { Meta, StoryObj } from '@storybook/vue3'
import type { AvatarShape, AvatarSize } from './types'
import Avatar from './index.vue'

const sizes = [ 'small', 'normal', 'large', 'xlarge' ] as const satisfies readonly AvatarSize[]
const shapes = [ 'circle', 'square' ] as const satisfies readonly AvatarShape[]

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  argTypes: {
    size: { control: 'select', options: sizes },
    shape: { control: 'select', options: shapes },
    image: { control: 'text' },
    label: { control: 'text' },
    fallbackLabel: { control: 'text' },
  },
  args: {
    size: 'normal',
    shape: 'circle',
    image: '',
    label: 'AB',
    fallbackLabel: '',
  },
  render: args => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: '<Avatar v-bind="args" />',
  }),
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Sizes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex items-end gap-4">
    <Avatar v-for="s in sizes" :key="s" :size="s" label="AB" />
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Avatar },
    setup: () => ({ sizes }),
    template: `
      <div class="flex items-end gap-4">
        <div v-for="s in sizes" :key="s" class="flex flex-col items-center gap-2">
          <Avatar :size="s" label="AB" />
          <span class="text-xs text-muted-foreground">{{ s }}</span>
        </div>
      </div>
    `,
  }),
}

export const Shapes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex items-center gap-4">
    <Avatar v-for="sh in shapes" :key="sh" :shape="sh" label="AB" size="large" />
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Avatar },
    setup: () => ({ shapes }),
    template: `
      <div class="flex items-center gap-4">
        <div v-for="sh in shapes" :key="sh" class="flex flex-col items-center gap-2">
          <Avatar :shape="sh" label="AB" size="large" />
          <span class="text-xs text-muted-foreground">{{ sh }}</span>
        </div>
      </div>
    `,
  }),
}

export const WithImage: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex items-center gap-4">
    <Avatar image="https://i.pravatar.cc/150?u=1" size="large" />
    <Avatar image="https://i.pravatar.cc/150?u=2" size="large" shape="square" />
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Avatar },
    template: `
      <div class="flex items-center gap-4">
        <Avatar image="https://i.pravatar.cc/150?u=1" size="large" />
        <Avatar image="https://i.pravatar.cc/150?u=2" size="large" shape="square" />
      </div>
    `,
  }),
}

export const FallbackLabel: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex items-center gap-4">
    <Avatar label="John Doe" fallback-label="JD" />
    <Avatar fallback-label="??" />
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Avatar },
    template: `
      <div class="flex items-center gap-4">
        <Avatar label="John Doe" fallback-label="JD" />
        <Avatar fallback-label="??" />
      </div>
    `,
  }),
}
