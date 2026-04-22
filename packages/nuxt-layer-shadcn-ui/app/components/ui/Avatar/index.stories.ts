import type { Meta, StoryObj } from '@storybook/vue3'
import Avatar from './index.vue'

type AvatarSize = 'small' | 'normal' | 'large' | 'xlarge'
type AvatarShape = 'circle' | 'square'

const sizes: AvatarSize[] = [ 'small', 'normal', 'large', 'xlarge' ]
const shapes: AvatarShape[] = [ 'circle', 'square' ]

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
    label: 'AB',
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Avatar },
    setup: () => ({ args, sizes, shapes }),
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Avatar v-bind="args" />
        </section>

        <!-- Sizes -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Sizes</h3>
          <div class="flex items-end gap-4">
            <div v-for="s in sizes" :key="s" class="flex flex-col items-center gap-2">
              <Avatar :size="s" label="AB" />
              <span class="text-xs text-muted-foreground">{{ s }}</span>
            </div>
          </div>
        </section>

        <!-- Shapes -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Shapes</h3>
          <div class="flex items-center gap-4">
            <div v-for="sh in shapes" :key="sh" class="flex flex-col items-center gap-2">
              <Avatar :shape="sh" label="AB" size="large" />
              <span class="text-xs text-muted-foreground">{{ sh }}</span>
            </div>
          </div>
        </section>

        <!-- With Image -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Image</h3>
          <div class="flex items-center gap-4">
            <Avatar image="https://i.pravatar.cc/150?u=1" size="large" />
            <Avatar image="https://i.pravatar.cc/150?u=2" size="large" shape="square" />
          </div>
        </section>

        <!-- Fallback Label -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Fallback Label</h3>
          <div class="flex items-center gap-4">
            <Avatar label="John Doe" fallback-label="JD" />
            <Avatar fallback-label="??" />
          </div>
        </section>
      </div>
    `,
  }),
}
