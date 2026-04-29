import type { Meta, StoryObj } from '@storybook/vue3'
import { toast } from 'vue-sonner'
import Button from '../Button/index.vue'
import Toast from './index.vue'

const positions = [ 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center' ] as const

const meta = {
  title: 'UI/Toast',
  component: Toast,
  argTypes: {
    position: { control: 'select', options: positions },
  },
  args: {
    position: 'bottom-right',
  },
  render: args => ({
    components: { Toast, Button },
    setup () {
      const show = () => toast('This is a toast')
      return { args, show }
    },
    template: `
      <div class="space-y-4">
        <Toast v-bind="args" />
        <Button variant="outline" @click="show">Show Toast</Button>
      </div>
    `,
  }),
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Types: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<script setup lang="ts">
import { toast } from 'vue-sonner'

const showDefault = () => toast('This is a default toast')
const showSuccess = () => toast.success('Operation completed successfully')
const showError = () => toast.error('Something went wrong')
const showInfo = () => toast.info('Here is some information')
const showWarning = () => toast.warning('Please be careful')
</script>

<template>
  <Toast position="bottom-right" />
  <div class="flex flex-wrap gap-3">
    <Button variant="outline" @click="showDefault">Default</Button>
    <Button variant="outline" @click="showSuccess">Success</Button>
    <Button variant="outline" @click="showError">Error</Button>
    <Button variant="outline" @click="showInfo">Info</Button>
    <Button variant="outline" @click="showWarning">Warning</Button>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Toast, Button },
    setup () {
      const showDefault = () => toast('This is a default toast')
      const showSuccess = () => toast.success('Operation completed successfully')
      const showError = () => toast.error('Something went wrong')
      const showInfo = () => toast.info('Here is some information')
      const showWarning = () => toast.warning('Please be careful')
      return { showDefault, showSuccess, showError, showInfo, showWarning }
    },
    template: `
      <div>
        <Toast position="bottom-right" />
        <div class="flex flex-wrap gap-3">
          <Button variant="outline" @click="showDefault">Default</Button>
          <Button variant="outline" @click="showSuccess">Success</Button>
          <Button variant="outline" @click="showError">Error</Button>
          <Button variant="outline" @click="showInfo">Info</Button>
          <Button variant="outline" @click="showWarning">Warning</Button>
        </div>
      </div>
    `,
  }),
}

export const WithDescription: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<script setup lang="ts">
import { toast } from 'vue-sonner'

const show = () => toast('Event created', {
  description: 'Your event has been scheduled for tomorrow at 3:00 PM.',
})
</script>

<template>
  <Toast position="bottom-right" />
  <Button variant="outline" @click="show">Show Toast with Description</Button>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Toast, Button },
    setup () {
      const show = () => toast('Event created', {
        description: 'Your event has been scheduled for tomorrow at 3:00 PM.',
      })
      return { show }
    },
    template: `
      <div>
        <Toast position="bottom-right" />
        <Button variant="outline" @click="show">Show Toast with Description</Button>
      </div>
    `,
  }),
}

export const Positions: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<script setup lang="ts">
import { toast } from 'vue-sonner'

const positions = [ 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center' ] as const
const current = ref<typeof positions[number]>('bottom-right')

const show = (pos: typeof positions[number]) => {
  current.value = pos
  nextTick(() => toast(\`Toast at \${pos}\`))
}
</script>

<template>
  <Toast :position="current" />
  <div class="flex flex-wrap gap-3">
    <Button v-for="p in positions" :key="p" variant="outline" @click="show(p)">{{ p }}</Button>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Toast, Button },
    setup () {
      const current = ref<typeof positions[number]>('bottom-right')
      const show = (pos: typeof positions[number]) => {
        current.value = pos
        nextTick(() => toast(`Toast at ${pos}`))
      }
      return { positions, current, show }
    },
    template: `
      <div>
        <Toast :position="current" />
        <div class="flex flex-wrap gap-3">
          <Button v-for="p in positions" :key="p" variant="outline" @click="show(p)">{{ p }}</Button>
        </div>
      </div>
    `,
  }),
}
