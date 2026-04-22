import type { Meta, StoryObj } from '@storybook/vue3'
import Tag from './index.vue'

type TagType = 'default' | 'success' | 'info' | 'help' | 'warn' | 'danger'
type TagVariant = 'solid' | 'soft' | 'bordered' | 'flat'

const types: TagType[] = [ 'default', 'success', 'info', 'help', 'warn', 'danger' ]
const variants: TagVariant[] = [ 'solid', 'soft', 'bordered', 'flat' ]

const meta = {
  title: 'UI/Tag',
  component: Tag,
  argTypes: {
    type: { control: 'select', options: types },
    variant: { control: 'select', options: variants },
  },
  args: {
    type: 'default',
    variant: 'soft',
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Tag },
    setup: () => ({ args, types, variants }),
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Tag v-bind="args">Tag</Tag>
        </section>

        <!-- Variants × Types matrix -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Variants × Types</h3>
          <div class="space-y-3">
            <div v-for="v in variants" :key="v" class="flex flex-wrap items-center gap-3">
              <span class="w-20 text-sm text-muted-foreground">{{ v }}</span>
              <Tag v-for="t in types" :key="t" :type="t" :variant="v">{{ t }}</Tag>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
}
