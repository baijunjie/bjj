import type { Meta, StoryObj } from '@storybook/vue3'
import Slider from './index.vue'

const meta = {
  title: 'UI/Slider',
  component: Slider,
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    orientation: { control: 'select', options: [ 'horizontal', 'vertical' ]},
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    orientation: 'horizontal',
  },
  render: args => ({
    components: { Slider },
    setup () {
      const value = ref(50)
      return { args, value }
    },
    template: `
      <div class="max-w-sm">
        <Slider v-model="value" v-bind="args" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Range: Story = {
  render: () => ({
    components: { Slider },
    setup () {
      const range = ref([ 20, 80 ])
      return { range }
    },
    template: `
      <div class="max-w-sm">
        <Slider v-model="range" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ range }}</div>
      </div>
    `,
  }),
}

export const WithStep: Story = {
  render: () => ({
    components: { Slider },
    setup () {
      const stepped = ref(50)
      return { stepped }
    },
    template: `
      <div class="max-w-sm">
        <Slider v-model="stepped" :step="25" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ stepped }}</div>
      </div>
    `,
  }),
}

export const CustomMinMax: Story = {
  render: () => ({
    components: { Slider },
    setup () {
      const custom = ref(500)
      return { custom }
    },
    template: `
      <div class="max-w-sm">
        <Slider v-model="custom" :min="0" :max="1000" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ custom }}</div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Slider },
    setup () {
      const value = ref(50)
      return { value }
    },
    template: `
      <div class="max-w-sm">
        <Slider v-model="value" disabled />
      </div>
    `,
  }),
}
