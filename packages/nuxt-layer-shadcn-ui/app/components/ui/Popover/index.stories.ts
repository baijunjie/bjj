import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '../Button/index.vue'
import Input from '../Input/index.vue'
import Popover from './index.vue'

const meta = {
  title: 'UI/Popover',
  component: Popover,
  argTypes: {
    trigger: { control: 'inline-radio', options: [ 'click', 'hover' ]},
    side: { control: 'select', options: [ 'top', 'bottom', 'left', 'right' ]},
    align: { control: 'select', options: [ 'start', 'center', 'end' ]},
    sideOffset: { control: 'number' },
  },
  args: {
    trigger: 'click',
    side: undefined,
    align: undefined,
    sideOffset: undefined,
  },
  render: args => ({
    components: { Popover, Button },
    setup: () => ({ args }),
    template: `
      <Popover v-bind="args">
        <template #trigger>
          <Button variant="outline">Open Popover</Button>
        </template>
        <div class="space-y-2">
          <h4 class="font-medium">Popover Content</h4>
          <p class="text-sm text-muted-foreground">This is the popover body with some informational content.</p>
        </div>
      </Popover>
    `,
  }),
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const HoverTrigger: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Popover trigger="hover">
    <template #trigger>
      <Button variant="outline">Hover me</Button>
    </template>
    <div class="space-y-2">
      <h4 class="font-medium">Hovering opens it</h4>
      <p class="text-sm text-muted-foreground">Move the cursor away to close.</p>
    </div>
  </Popover>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Popover, Button },
    template: `
      <Popover trigger="hover">
        <template #trigger>
          <Button variant="outline">Hover me</Button>
        </template>
        <div class="space-y-2">
          <h4 class="font-medium">Hovering opens it</h4>
          <p class="text-sm text-muted-foreground">Move the cursor away to close.</p>
        </div>
      </Popover>
    `,
  }),
}

export const WithForm: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Popover>
    <template #trigger>
      <Button variant="outline">Edit Name</Button>
    </template>
    <div class="space-y-3">
      <h4 class="font-medium">Update Name</h4>
      <Input placeholder="Enter new name" />
      <Button size="sm" class="w-full">Save</Button>
    </div>
  </Popover>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Popover, Button, Input },
    template: `
      <Popover>
        <template #trigger>
          <Button variant="outline">Edit Name</Button>
        </template>
        <div class="space-y-3">
          <h4 class="font-medium">Update Name</h4>
          <Input placeholder="Enter new name" />
          <Button size="sm" class="w-full">Save</Button>
        </div>
      </Popover>
    `,
  }),
}
