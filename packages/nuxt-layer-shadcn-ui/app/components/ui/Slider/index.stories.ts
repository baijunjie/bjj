import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
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
        <Slider v-bind="args" v-model="value" />
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Range: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Slider v-model="range" />
</template>
`.trim(),
      },
    },
  },
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
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Slider v-model="value" :step="25" />
</template>
`.trim(),
      },
    },
  },
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
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Slider v-model="value" :min="0" :max="1000" />
</template>
`.trim(),
      },
    },
  },
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
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Slider v-model="value" disabled />
</template>
`.trim(),
      },
    },
  },
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

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { Slider, EventLog },
    setup: () => ({ value: ref(50) }),
    template: `
      <EventLog v-slot="{ record }">
        <div class="max-w-sm">
          <Slider
            v-model="value"
            @update:modelValue="(v) => record('update:modelValue', v)"
          />
        </div>
      </EventLog>
    `,
  }),
}
