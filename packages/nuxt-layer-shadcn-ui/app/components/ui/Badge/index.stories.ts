import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from '../Icon/index.vue'
import Badge from './index.vue'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive'

const variants: BadgeVariant[] = [ 'default', 'secondary', 'outline', 'destructive' ]

const meta = {
  title: 'UI/Badge',
  component: Badge,
  argTypes: {
    variant: { control: 'select', options: variants },
  },
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Badge, Icon },
    setup: () => ({ args, variants }),
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Badge v-bind="args">Badge</Badge>
        </section>

        <!-- Variants -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Variants</h3>
          <div class="flex flex-wrap items-center gap-3">
            <Badge v-for="v in variants" :key="v" :variant="v">{{ v }}</Badge>
          </div>
        </section>

        <!-- Numeric -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Numeric</h3>
          <div class="flex flex-wrap items-center gap-3">
            <Badge>1</Badge>
            <Badge variant="secondary">42</Badge>
            <Badge variant="destructive">99+</Badge>
            <Badge variant="outline">0</Badge>
          </div>
        </section>

        <!-- With Icons -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Icons</h3>
          <div class="flex flex-wrap items-center gap-3">
            <Badge><Icon name="check" /> Approved</Badge>
            <Badge variant="secondary"><Icon name="clock" /> Pending</Badge>
            <Badge variant="destructive"><Icon name="x" /> Rejected</Badge>
            <Badge variant="outline"><Icon name="star" /> Featured</Badge>
          </div>
        </section>
      </div>
    `,
  }),
}
