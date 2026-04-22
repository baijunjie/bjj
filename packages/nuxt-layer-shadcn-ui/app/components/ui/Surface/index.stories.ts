import type { Meta, StoryObj } from '@storybook/vue3'
import Surface from './index.vue'

type SurfaceType = 'default' | 'success' | 'info' | 'help' | 'warn' | 'danger'
type SurfaceVariant = 'solid' | 'soft' | 'bordered' | 'flat'

const types: SurfaceType[] = [ 'default', 'success', 'info', 'help', 'warn', 'danger' ]
const variants: SurfaceVariant[] = [ 'solid', 'soft', 'bordered', 'flat' ]

const meta = {
  title: 'UI/Surface',
  component: Surface,
  argTypes: {
    type: { control: 'select', options: types },
    variant: { control: 'select', options: variants },
  },
  args: {
    type: 'default',
    variant: 'soft',
  },
} satisfies Meta<typeof Surface>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Surface },
    setup: () => ({ args, types, variants }),
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Surface v-bind="args" class="p-4">This is a controlled surface.</Surface>
        </section>

        <!-- All Variants × All Types -->
        <section v-for="v in variants" :key="v">
          <h3 class="mb-4 text-lg font-medium">Variant: {{ v }}</h3>
          <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
            <Surface v-for="t in types" :key="t" :variant="v" :type="t" class="p-4">
              <strong>{{ t }}</strong> surface
            </Surface>
          </div>
        </section>
      </div>
    `,
  }),
}
