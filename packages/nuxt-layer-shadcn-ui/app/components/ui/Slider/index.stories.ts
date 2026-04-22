import type { Meta, StoryObj } from '@storybook/vue3'
import Slider from './index.vue'

const meta = {
  title: 'UI/Slider',
  component: Slider,
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Slider },
    setup () {
      const single = ref(50)
      const range = ref([ 20, 80 ])
      const stepped = ref(50)
      const custom = ref(500)
      return { args, single, range, stepped, custom }
    },
    template: `
      <div class="space-y-10 max-w-sm">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Slider v-model="single" v-bind="args" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ single }}</div>
        </section>

        <!-- Range (Two Thumbs) -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Range (Two Thumbs)</h3>
          <Slider v-model="range" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ range }}</div>
        </section>

        <!-- With Step -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Step (25)</h3>
          <Slider v-model="stepped" :step="25" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ stepped }}</div>
        </section>

        <!-- Custom Min / Max -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Custom Min / Max (0 - 1000)</h3>
          <Slider v-model="custom" :min="0" :max="1000" />
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ custom }}</div>
        </section>
      </div>
    `,
  }),
}
