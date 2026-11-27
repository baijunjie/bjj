import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import { useArgsModel } from '#storybook/argsModel'
import InputNumber from './index.vue'

const aligns = [ 'left', 'center', 'right' ] as const
const sizes = [ 'xs', 'sm', 'md', 'default', 'lg' ] as const

const meta = {
  title: 'UI/InputNumber',
  component: InputNumber,
  argTypes: {
    modelValue: { control: 'number' },
    id: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    placeholder: { control: 'text' },
    showButtons: { control: 'boolean' },
    align: { control: 'select', options: aligns },
    size: { control: 'select', options: sizes },
    rounded: { control: 'boolean' },
    readonly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    class: { control: 'text' },
  },
  args: {
    modelValue: 0,
    id: '',
    min: undefined,
    max: undefined,
    step: 1,
    placeholder: '',
    showButtons: true,
    align: 'center',
    size: 'default',
    rounded: false,
    readonly: false,
    disabled: false,
    invalid: false,
    class: 'max-w-xs',
  },
  render: args => {
    const onUpdate = useArgsModel()
    return {
      components: { InputNumber },
      setup: () => ({ args, onUpdate }),
      template: `
        <div class="space-y-2">
          <InputNumber v-bind="args" @update:modelValue="onUpdate" />
          <div class="text-sm text-muted-foreground">Value: {{ args.modelValue }}</div>
        </div>
      `,
    }
  },
} satisfies Meta<typeof InputNumber>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithMinMax: Story = {
  parameters: noControls,
  args: {
    min: 0,
    max: 10,
  },
}

export const CustomStep: Story = {
  parameters: noControls,
  args: {
    step: 5,
  },
}

export const Placeholder: Story = {
  parameters: noControls,
  args: {
    modelValue: undefined,
    placeholder: 'Enter a number',
  },
}

export const WithoutButtons: Story = {
  parameters: noControls,
  args: {
    showButtons: false,
  },
}

export const Alignments: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <InputNumber v-model="value" align="right" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { InputNumber },
    setup: () => ({ aligns, value: ref(1234) }),
    template: `
      <div class="max-w-xs space-y-3">
        <div v-for="a in aligns" :key="a" class="flex items-center gap-3">
          <span class="w-14 text-sm text-muted-foreground">{{ a }}</span>
          <InputNumber v-model="value" :align="a" class="flex-1" />
        </div>
      </div>
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
  <InputNumber v-model="value" size="xs" class="w-26" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { InputNumber },
    setup: () => ({ sizes, value: ref(10) }),
    template: `
      <div class="space-y-3">
        <div v-for="s in sizes" :key="s" class="flex items-center gap-3">
          <span class="w-14 text-sm text-muted-foreground">{{ s }}</span>
          <InputNumber v-model="value" :size="s" class="w-48" />
          <InputNumber v-model="value" :size="s" align="left" class="w-40">
            <template #prefix>¥</template>
          </InputNumber>
        </div>
      </div>
    `,
  }),
}

export const InheritedSize: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <!-- Controls without their own size follow the nearest data-control-size -->
  <div data-control-size="sm">
    <InputNumber v-model="width" />
    <InputNumber v-model="height" />
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { InputNumber },
    setup: () => ({ width: ref(1280), height: ref(720) }),
    template: `
      <div data-control-size="sm" class="flex max-w-sm items-center gap-2">
        <InputNumber v-model="width" class="flex-1" />
        <span class="text-muted-foreground">×</span>
        <InputNumber v-model="height" class="flex-1" />
      </div>
    `,
  }),
}

export const WithPrefix: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <InputNumber v-model="value" align="left">
    <template #prefix>¥</template>
  </InputNumber>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { InputNumber },
    setup: () => ({ value: ref(1000) }),
    template: `
      <div class="max-w-xs space-y-2">
        <InputNumber v-model="value" align="left">
          <template #prefix>¥</template>
        </InputNumber>
        <div class="text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
}

export const WithSuffix: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <InputNumber v-model="value" :showButtons="false" align="right">
    <template #suffix>kg</template>
  </InputNumber>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { InputNumber },
    setup: () => ({ value: ref(65) }),
    template: `
      <div class="max-w-xs space-y-2">
        <InputNumber v-model="value" :showButtons="false" align="right">
          <template #suffix>kg</template>
        </InputNumber>
        <div class="text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
}

export const Readonly: Story = {
  parameters: noControls,
  args: {
    readonly: true,
    modelValue: 42,
  },
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

export const Rounded: Story = {
  parameters: noControls,
  args: {
    rounded: true,
  },
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { InputNumber, EventLog },
    setup: () => ({ value: ref(0) }),
    template: `
      <EventLog v-slot="{ record }">
        <div class="max-w-xs">
          <InputNumber
            v-model="value"
            @update:modelValue="(v) => record('update:modelValue', v)"
          />
        </div>
      </EventLog>
    `,
  }),
}
