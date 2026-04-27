import type { Meta, StoryObj } from '@storybook/vue3'
import type { TagColor, TagVariant } from './types'
import Tag from './index.vue'

const colors: TagColor[] = [ 'default', 'primary', 'success', 'info', 'help', 'warn', 'danger' ]
const variants: TagVariant[] = [ 'solid', 'soft', 'bordered', 'flat' ]

const meta = {
  title: 'UI/Tag',
  component: Tag,
  argTypes: {
    color: { control: 'select', options: colors },
    variant: { control: 'select', options: variants },
  },
  args: {
    color: 'default',
    variant: 'soft',
  },
  render: args => ({
    components: { Tag },
    setup: () => ({ args }),
    template: '<Tag v-bind="args">Tag</Tag>',
  }),
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Colors: Story = {
  parameters: noControls,
  render: () => ({
    components: { Tag },
    setup: () => ({ colors }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Tag v-for="c in colors" :key="c" :color="c">{{ c }}</Tag>
      </div>
    `,
  }),
}

export const Variants: Story = {
  parameters: noControls,
  render: () => ({
    components: { Tag },
    setup: () => ({ variants }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Tag v-for="v in variants" :key="v" :variant="v">{{ v }}</Tag>
      </div>
    `,
  }),
}

export const VariantColorMatrix: Story = {
  parameters: noControls,
  render: () => ({
    components: { Tag },
    setup: () => ({ colors, variants }),
    template: `
      <div class="space-y-3">
        <div v-for="v in variants" :key="v" class="flex flex-wrap items-center gap-3">
          <span class="w-20 text-sm text-muted-foreground">{{ v }}</span>
          <Tag v-for="c in colors" :key="c" :color="c" :variant="v">{{ c }}</Tag>
        </div>
      </div>
    `,
  }),
}
