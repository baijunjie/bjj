import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from './index.vue'

const meta = {
  title: 'UI/Icon',
  component: Icon,
  argTypes: {
    name: { control: 'text' },
  },
  args: {
    name: 'house',
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

const commonIcons = [
  'house', 'search', 'settings', 'user', 'mail', 'bell',
  'heart', 'star', 'plus', 'minus', 'check', 'x',
  'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down',
  'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
  'eye', 'eye-off', 'trash-2', 'pencil', 'copy', 'download',
  'upload', 'share', 'link', 'external-link', 'info', 'triangle-alert',
]

export const Default: Story = {
  render: args => ({
    components: { Icon },
    setup: () => ({ args, commonIcons }),
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Icon v-bind="args" />
        </section>

        <!-- Common Icons -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Common Icons</h3>
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
        </section>

        <!-- Sizes -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Sizes</h3>
          <div class="flex items-end gap-4">
            <Icon name="star" class="size-3" />
            <Icon name="star" class="size-4" />
            <Icon name="star" class="size-5" />
            <Icon name="star" class="size-6" />
            <Icon name="star" class="size-8" />
          </div>
        </section>
      </div>
    `,
  }),
}
