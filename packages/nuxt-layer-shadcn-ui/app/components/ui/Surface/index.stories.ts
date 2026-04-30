import type { Meta, StoryObj } from '@storybook/vue3'
import type { SurfaceColor, SurfaceVariant } from './types'
import Surface from './index.vue'

const colors: SurfaceColor[] = [ 'default', 'primary', 'success', 'info', 'help', 'warn', 'danger' ]
const variants: SurfaceVariant[] = [ 'solid', 'soft', 'bordered', 'flat' ]

const meta = {
  title: 'UI/Surface',
  component: Surface,
  argTypes: {
    color: { control: 'select', options: colors },
    variant: { control: 'select', options: variants },
    active: { control: 'boolean' },
    clickable: { control: 'boolean' },
  },
  args: {
    color: 'default',
    variant: 'soft',
    active: false,
    clickable: false,
  },
  render: args => ({
    components: { Surface },
    setup: () => ({ args }),
    template: '<Surface v-bind="args" class="p-4">This is a surface.</Surface>',
  }),
} satisfies Meta<typeof Surface>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Colors: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
    <Surface v-for="c in colors" :key="c" :color="c" class="p-4">
      <strong>{{ c }}</strong> surface
    </Surface>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Surface },
    setup: () => ({ colors }),
    template: `
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Surface v-for="c in colors" :key="c" :color="c" class="p-4">
          <strong>{{ c }}</strong> surface
        </Surface>
      </div>
    `,
  }),
}

export const Variants: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
    <Surface v-for="v in variants" :key="v" :variant="v" class="p-4">
      <strong>{{ v }}</strong> surface
    </Surface>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Surface },
    setup: () => ({ variants }),
    template: `
      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Surface v-for="v in variants" :key="v" :variant="v" class="p-4">
          <strong>{{ v }}</strong> surface
        </Surface>
      </div>
    `,
  }),
}

export const VariantColorMatrix: Story = {
  parameters: {
    ...noControls,
    docs: {
      description: {
        story: 'Surfaces in this matrix are clickable — click any cell to toggle its active state.',
      },
      source: {
        code: `
<template>
  <div class="space-y-6">
    <div v-for="v in variants" :key="v">
      <div class="mb-2 text-sm text-muted-foreground">{{ v }}</div>
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Surface
          v-for="c in colors"
          :key="c"
          :variant="v"
          :color="c"
          clickable
          :active="selected === keyFor(v, c)"
          class="p-4"
          @click="selected = keyFor(v, c)"
        >
          <strong>{{ c }}</strong> surface
        </Surface>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selected = ref('')
const keyFor = (v: string, c: string) => \`\${v}:\${c}\`
</script>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Surface },
    setup () {
      const selected = ref('')
      const keyFor = (v: string, c: string) => `${v}:${c}`
      return { colors, variants, selected, keyFor }
    },
    template: `
      <div class="space-y-6">
        <div v-for="v in variants" :key="v">
          <div class="mb-2 text-sm text-muted-foreground">{{ v }}</div>
          <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
            <Surface
              v-for="c in colors"
              :key="c"
              :variant="v"
              :color="c"
              clickable
              :active="selected === keyFor(v, c)"
              class="p-4"
              @click="selected = keyFor(v, c)"
            >
              <strong>{{ c }}</strong> surface
            </Surface>
          </div>
        </div>
      </div>
    `,
  }),
}
