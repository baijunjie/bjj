import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from './index.vue'

const commonIcons = [
  'house', 'search', 'settings', 'user', 'mail', 'bell',
  'heart', 'star', 'plus', 'minus', 'check', 'x',
  'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down',
  'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
  'eye', 'eye-off', 'trash-2', 'pencil', 'copy', 'download',
  'upload', 'share', 'link', 'external-link', 'info', 'triangle-alert',
]

const meta = {
  title: 'UI/Icon',
  component: Icon,
  argTypes: {
    name: { control: 'text' },
  },
  args: {
    name: 'house',
  },
  render: args => ({
    components: { Icon },
    setup: () => ({ args }),
    template: '<Icon v-bind="args" />',
  }),
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CommonIcons: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ commonIcons }),
    template: `
      <div class="grid grid-cols-8 gap-4">
        <div
          v-for="name in commonIcons"
          :key="name"
          class="flex flex-col items-center gap-2 rounded-md border p-3"
        >
          <Icon :name="name" class="size-5" />
          <span class="text-xs text-muted-foreground">{{ name }}</span>
        </div>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Icon },
    template: `
      <div class="flex items-end gap-4">
        <Icon name="star" class="size-3" />
        <Icon name="star" class="size-4" />
        <Icon name="star" class="size-5" />
        <Icon name="star" class="size-6" />
        <Icon name="star" class="size-8" />
      </div>
    `,
  }),
}
