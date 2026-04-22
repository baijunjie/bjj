import type { Meta, StoryObj } from '@storybook/vue3'
import Help from './index.vue'

const meta = {
  title: 'UI/Help',
  component: Help,
} satisfies Meta<typeof Help>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Help },
    template: `
      <div class="space-y-10">
        <section>
          <h3 class="mb-4 text-lg font-medium">Basic</h3>
          <Help text="This is a helpful tooltip" />
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Positions</h3>
          <div class="flex items-center gap-8 py-10 justify-center">
            <div class="flex flex-col items-center gap-2">
              <Help text="Top tooltip" position="top" />
              <span class="text-sm text-muted-foreground">Top</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Help text="Bottom tooltip" position="bottom" />
              <span class="text-sm text-muted-foreground">Bottom</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Help text="Left tooltip" position="left" />
              <span class="text-sm text-muted-foreground">Left</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Help text="Right tooltip" position="right" />
              <span class="text-sm text-muted-foreground">Right</span>
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Inline with Label</h3>
          <div class="flex items-center gap-1">
            <span class="text-sm font-medium">API Key</span>
            <Help text="Your unique API key for authentication" />
          </div>
        </section>
      </div>
    `,
  }),
}
