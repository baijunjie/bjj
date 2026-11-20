import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '../../components/ui/Button/index.vue'
import DatePicker from '../../components/ui/DatePicker/index.vue'
import Icon from '../../components/ui/Icon/index.vue'
import Input from '../../components/ui/Input/index.vue'
import InputNumber from '../../components/ui/InputNumber/index.vue'
import Select from '../../components/ui/Select/index.vue'
import Textarea from '../../components/ui/Textarea/index.vue'

const sizes = [ 'xs', 'sm', 'default', 'lg' ] as const

const options = [
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vue', value: 'vue' },
  { label: 'Vite', value: 'vite' },
]

const meta = {
  title: 'Theme/Control Size',
  parameters: {
    docs: {
      description: {
        component: 'Size tiers shared by form controls (inputs, selects, pickers, buttons). Each tier sets height, font size, padding, icon and inner button size through `data-control-size`; a control without its own `size` follows the nearest ancestor.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Tiers: Story = {
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <Input v-model="text" size="sm" />
  <InputNumber v-model="count" size="sm" />
  <Select v-model="framework" :options="options" size="sm" />
  <Button size="sm" icon="search">Search</Button>
  <Button size="icon-sm" variant="outline" icon="settings" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Button, DatePicker, Icon, Input, InputNumber, Select },
    setup: () => ({
      sizes,
      iconSize: (s: typeof sizes[number]) => s === 'default' ? 'icon' : `icon-${s}`,
      options,
      text: ref('Hello'),
      count: ref(10),
      framework: ref('nuxt'),
      date: ref(new Date(2026, 10, 20)),
    }),
    template: `
      <div class="space-y-3">
        <div v-for="s in sizes" :key="s" class="flex flex-wrap items-center gap-3">
          <span class="w-14 text-sm text-muted-foreground">{{ s }}</span>
          <Input v-model="text" :size="s" class="w-44">
            <template #prefix><Icon name="search" /></template>
          </Input>
          <InputNumber v-model="count" :size="s" class="w-36" />
          <div class="w-40">
            <Select v-model="framework" :options="options" :size="s" />
          </div>
          <div class="w-44">
            <DatePicker v-model="date" :size="s" />
          </div>
          <Button :size="s" icon="search">Search</Button>
          <Button :size="iconSize(s)" variant="outline" icon="settings" />
        </div>
      </div>
    `,
  }),
}

export const InheritedFromAncestor: Story = {
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <form data-control-size="xs">
    <Input v-model="name" />
    <InputNumber v-model="count" />
    <Select v-model="framework" :options="options" />
    <Textarea v-model="note" />
    <Button icon="check">Save</Button>
  </form>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Button, Input, InputNumber, Select, Textarea },
    setup: () => ({
      options,
      name: ref('Lot A'),
      count: ref(10),
      framework: ref('vue'),
      note: ref('Every control inside follows the form tier.'),
    }),
    template: `
      <div data-control-size="xs" class="grid max-w-sm gap-2">
        <Input v-model="name" />
        <InputNumber v-model="count" />
        <Select v-model="framework" :options="options" />
        <Textarea v-model="note" />
        <div class="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button icon="check">Save</Button>
        </div>
      </div>
    `,
  }),
}
