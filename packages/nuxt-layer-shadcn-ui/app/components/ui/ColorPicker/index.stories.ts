import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import { useArgsModel } from '#storybook/argsModel'
import FormItem from '../FormItem/index.vue'
import ColorPicker from './index.vue'

const sizes = [ 'xs', 'sm', 'md', 'default', 'lg' ] as const

const meta = {
  title: 'UI/ColorPicker',
  component: ColorPicker,
  argTypes: {
    modelValue: { control: 'text' },
    id: { control: 'text' },
    swatchText: { control: 'text' },
    foregroundCandidates: { control: 'object' },
    foreground: { control: 'text' },
    size: { control: 'select', options: sizes },
    rounded: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    class: { control: 'text' },
  },
  args: {
    modelValue: '#3b82f6',
    id: '',
    swatchText: '',
    foregroundCandidates: [ '#000000', '#ffffff' ],
    foreground: '',
    size: 'default',
    rounded: false,
    disabled: false,
    invalid: false,
    class: '',
  },
  render: args => {
    const onUpdate = useArgsModel()
    const onUpdateForeground = useArgsModel('foreground')
    return {
      components: { ColorPicker },
      setup: () => ({ args, onUpdate, onUpdateForeground }),
      template: `
        <div class="flex items-center gap-4">
          <ColorPicker
            v-bind="args"
            aria-label="Color"
            @update:modelValue="onUpdate"
            @update:foreground="onUpdateForeground"
          />
          <div class="text-sm text-muted-foreground">Value: {{ args.modelValue }} / Foreground: {{ args.foreground }}</div>
        </div>
      `,
    }
  },
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const InFormItem: Story = {
  parameters: {
    ...noControls,
    docs: {
      description: {
        story: 'Inside a `FormItem` its label names the hex input; elsewhere name it with `aria-label`.',
      },
      source: {
        code: `
<template>
  <FormItem label="Primary color" description="Pick from the swatch or type a hex value">
    <ColorPicker v-model="color" />
  </FormItem>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { ColorPicker, FormItem },
    setup: () => ({ color: ref('#16a34a') }),
    template: `
      <FormItem label="Primary color" description="Pick from the swatch or type a hex value" class="max-w-sm">
        <ColorPicker v-model="color" />
      </FormItem>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <ColorPicker v-model="color" size="sm" aria-label="Color" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { ColorPicker },
    setup: () => ({ sizes, color: ref('#f97316') }),
    template: `
      <div class="space-y-3">
        <div v-for="s in sizes" :key="s" class="flex items-center gap-3">
          <span class="w-14 text-sm text-muted-foreground">{{ s }}</span>
          <ColorPicker v-model="color" :size="s" :aria-label="'Color ' + s" />
        </div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: noControls,
  args: {
    disabled: true,
  },
}

export const Invalid: Story = {
  parameters: noControls,
  args: {
    invalid: true,
  },
}

export const SwatchText: Story = {
  parameters: {
    ...noControls,
    docs: {
      description: {
        story: '`swatchText` is written on the swatch in black or white, whichever contrasts more with the color.',
      },
      source: {
        code: `
<template>
  <ColorPicker v-model="color" swatchText="A" aria-label="Brand color" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { ColorPicker },
    setup: () => ({ colors: ref([ '#c4ddf8', '#1a6bd6', '#fde047', '#111827' ]) }),
    template: `
      <div class="flex flex-wrap gap-3">
        <ColorPicker
          v-for="(_, i) in colors"
          :key="i"
          v-model="colors[i]"
          swatchText="A"
          :aria-label="'Color ' + (i + 1)"
        />
      </div>
    `,
  }),
}

export const Foreground: Story = {
  parameters: {
    ...noControls,
    docs: {
      description: {
        story: '`v-model:foreground` receives the color\'s contrasting text color (`#000000` / `#ffffff`), kept in step whenever the color changes.',
      },
      source: {
        code: `
<template>
  <ColorPicker v-model="color" v-model:foreground="foreground" swatchText="A" aria-label="Brand color" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { ColorPicker },
    setup: () => ({ color: ref('#c4ddf8'), foreground: ref<string>() }),
    template: `
      <div class="flex items-center gap-4">
        <ColorPicker v-model="color" v-model:foreground="foreground" swatchText="A" aria-label="Brand color" />
        <div
          class="rounded-md px-3 py-1.5 text-sm font-medium"
          :style="{ backgroundColor: color, color: foreground }"
        >
          Foreground: {{ foreground }}
        </div>
      </div>
    `,
  }),
}

export const ForegroundCandidates: Story = {
  parameters: {
    ...noControls,
    docs: {
      description: {
        story: 'The foreground is the candidate with the highest contrast against the color. Here a dark slate and a cream stand in for black and white.',
      },
      source: {
        code: `
<template>
  <ColorPicker
    v-model="color"
    v-model:foreground="foreground"
    :foregroundCandidates="['#1e293b', '#fef3c7']"
    swatchText="A"
    aria-label="Brand color"
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { ColorPicker },
    setup: () => ({
      candidates: [ '#1e293b', '#fef3c7' ],
      colors: ref([ '#c4ddf8', '#1a6bd6', '#fde047', '#7c3aed' ]),
    }),
    template: `
      <div class="flex flex-wrap gap-3">
        <ColorPicker
          v-for="(_, i) in colors"
          :key="i"
          v-model="colors[i]"
          :foregroundCandidates="candidates"
          swatchText="A"
          :aria-label="'Color ' + (i + 1)"
        />
      </div>
    `,
  }),
}

export const CustomSwatch: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <ColorPicker v-model="color" aria-label="Text color">
    <template #swatch="{ value, foreground, radius }">
      <span
        class="flex size-full items-center justify-center border border-border text-xs font-semibold"
        :class="radius"
        :style="{ backgroundColor: value, color: foreground }"
      >
        Aa
      </span>
    </template>
  </ColorPicker>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { ColorPicker },
    setup: () => ({ color: ref('#7c3aed') }),
    template: `
      <ColorPicker v-model="color" aria-label="Text color">
        <template #swatch="{ value, foreground, radius }">
          <span
            class="flex size-full items-center justify-center border border-border text-xs font-semibold"
            :class="radius"
            :style="{ backgroundColor: value, color: foreground }"
          >
            Aa
          </span>
        </template>
      </ColorPicker>
    `,
  }),
}

export const Rounded: Story = {
  parameters: noControls,
  args: {
    rounded: true,
  },
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { ColorPicker, EventLog },
    setup: () => ({ color: ref('#0ea5e9') }),
    template: `
      <EventLog v-slot="{ record }">
        <ColorPicker
          v-model="color"
          aria-label="Color"
          @update:modelValue="(v) => record('update:modelValue', v)"
          @change="(v) => record('change', v)"
          @update:foreground="(v) => record('update:foreground', v)"
        />
      </EventLog>
    `,
  }),
}
