import type { Meta, StoryObj } from '@storybook/vue3'
import ScrollArea from './index.vue'

const meta = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  argTypes: {
    fadeMask: { control: 'boolean' },
  },
  args: {
    fadeMask: false,
  },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { ScrollArea },
    setup () {
      const items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`)
      const fewItems = Array.from({ length: 3 }, (_, i) => `Item ${i + 1}`)
      return { args, items, fewItems }
    },
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <div class="h-[250px] w-[250px] rounded-md border bg-card">
            <ScrollArea class="h-full" v-bind="args">
              <div class="p-4 space-y-2">
                <div
                  v-for="item in items"
                  :key="item"
                  class="rounded-md border bg-muted px-3 py-2 text-sm"
                >
                  {{ item }}
                </div>
              </div>
            </ScrollArea>
          </div>
        </section>

        <!-- No Overflow -->
        <section>
          <h3 class="mb-4 text-lg font-medium">No Overflow</h3>
          <div class="h-[250px] w-[250px] rounded-md border bg-card">
            <ScrollArea class="h-full" fadeMask>
              <div class="p-4 space-y-2">
                <div
                  v-for="item in fewItems"
                  :key="item"
                  class="rounded-md border bg-muted px-3 py-2 text-sm"
                >
                  {{ item }}
                </div>
              </div>
            </ScrollArea>
          </div>
        </section>
      </div>
    `,
  }),
}
