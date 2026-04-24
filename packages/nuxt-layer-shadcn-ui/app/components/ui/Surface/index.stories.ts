import type { Meta, StoryObj } from '@storybook/vue3'
import type { SurfaceColor, SurfaceVariant } from './types'
import Surface from './index.vue'

const colors: SurfaceColor[] = [ 'default', 'primary', 'success', 'info', 'help', 'warn', 'danger' ]
const variants: SurfaceVariant[] = [ 'solid', 'soft', 'bordered', 'flat' ]

const meta = {
  title: 'UI/Surface',
  component: Surface,
  argTypes: {
    color: { control: 'select', options: colors },
    variant: { control: 'select', options: variants },
  },
  args: {
    color: 'default',
    variant: 'soft',
  },
  render: args => ({
    components: { Surface },
    setup: () => ({ args }),
    template: '<Surface v-bind="args" class="p-4">This is a surface.</Surface>',
  }),
} satisfies Meta<typeof Surface>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Colors: Story = {
  render: () => ({
    components: { Surface },
    setup: () => ({ colors }),
    template: `
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Surface v-for="c in colors" :key="c" :color="c" class="p-4">
          <strong>{{ c }}</strong> surface
        </Surface>
      </div>
    `,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { Surface },
    setup: () => ({ variants }),
    template: `
      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Surface v-for="v in variants" :key="v" :variant="v" class="p-4">
          <strong>{{ v }}</strong> surface
        </Surface>
      </div>
    `,
  }),
}

export const VariantColorMatrix: Story = {
  render: () => ({
    components: { Surface },
    setup: () => ({ colors, variants }),
    template: `
      <div class="space-y-6">
        <div v-for="v in variants" :key="v">
          <div class="mb-2 text-sm text-muted-foreground">{{ v }}</div>
          <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
            <Surface v-for="c in colors" :key="c" :variant="v" :color="c" class="p-4">
              <strong>{{ c }}</strong> surface
            </Surface>
          </div>
        </div>
      </div>
    `,
  }),
}
