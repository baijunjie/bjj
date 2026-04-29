import type { Meta, StoryObj } from '@storybook/vue3'
import { useDialog } from '../../../composables/useDialog'
import Button from '../Button/index.vue'
import AlertDialog from './index.vue'

const meta = {
  title: 'UI/AlertDialog',
  component: AlertDialog,
  decorators: [
    () => ({
      components: { AlertDialog },
      template: '<div><story /><AlertDialog /></div>',
    }),
  ],
  render: () => ({
    components: { Button },
    setup () {
      const { confirm } = useDialog()
      const result = ref('')
      async function handleConfirm () {
        const ok = await confirm({ title: 'Confirm', message: 'Do you want to proceed?' })
        result.value = `confirm → ${ok}`
      }
      return { handleConfirm, result }
    },
    template: `
      <div class="space-y-4">
        <Button @click="handleConfirm">Confirm</Button>
        <div v-if="result" class="rounded-md bg-muted p-4 text-sm">Result: {{ result }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `
<script setup lang="ts">
const { confirm } = useDialog()
const result = ref('')

async function handleConfirm () {
  const ok = await confirm({ title: 'Confirm', message: 'Do you want to proceed?' })
  result.value = \`confirm → \${ok}\`
}
</script>

<template>
  <Button @click="handleConfirm">Confirm</Button>
  <div v-if="result">Result: {{ result }}</div>
</template>
`.trim(),
      },
    },
  },
}

export const Alert: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<script setup lang="ts">
const { alert } = useDialog()
const result = ref('')

async function handleAlert () {
  await alert({ title: 'Error', type: 'error', message: 'Something went wrong.' })
  result.value = 'alert → closed'
}
</script>

<template>
  <Button variant="outline" @click="handleAlert">Alert</Button>
  <div v-if="result">Result: {{ result }}</div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Button },
    setup () {
      const { alert } = useDialog()
      const result = ref('')
      async function handleAlert () {
        await alert({ title: 'Error', type: 'error', message: 'Something went wrong.' })
        result.value = 'alert → closed'
      }
      return { handleAlert, result }
    },
    template: `
      <div class="space-y-4">
        <Button variant="outline" @click="handleAlert">Alert</Button>
        <div v-if="result" class="rounded-md bg-muted p-4 text-sm">Result: {{ result }}</div>
      </div>
    `,
  }),
}

export const Destroy: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<script setup lang="ts">
const { destroy } = useDialog()
const result = ref('')

async function handleDestroy () {
  const ok = await destroy({ title: 'Delete Item', message: 'This action cannot be undone.' })
  result.value = \`destroy → \${ok}\`
}
</script>

<template>
  <Button variant="destructive" @click="handleDestroy">Destroy</Button>
  <div v-if="result">Result: {{ result }}</div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Button },
    setup () {
      const { destroy } = useDialog()
      const result = ref('')
      async function handleDestroy () {
        const ok = await destroy({ title: 'Delete Item', message: 'This action cannot be undone.' })
        result.value = `destroy → ${ok}`
      }
      return { handleDestroy, result }
    },
    template: `
      <div class="space-y-4">
        <Button variant="destructive" @click="handleDestroy">Destroy</Button>
        <div v-if="result" class="rounded-md bg-muted p-4 text-sm">Result: {{ result }}</div>
      </div>
    `,
  }),
}

export const MultiDialog: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<script setup lang="ts">
const { confirm, alert, destroy } = useDialog()
const result = ref('')

async function handleMulti () {
  result.value = 'waiting...'
  const r1 = confirm({ title: 'Dialog 1', message: 'First confirm dialog' })
  const r2 = alert({ title: 'Dialog 2', message: 'Second alert dialog' })
  const r3 = destroy({ title: 'Dialog 3', message: 'Third destroy dialog' })
  const [ v1, , v3 ] = await Promise.all([ r1, r2, r3 ])
  result.value = \`multi → confirm: \${v1}, alert: done, destroy: \${v3}\`
}
</script>

<template>
  <Button variant="secondary" @click="handleMulti">Multi Dialog</Button>
  <div v-if="result">Result: {{ result }}</div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Button },
    setup () {
      const { confirm, alert, destroy } = useDialog()
      const result = ref('')
      async function handleMulti () {
        result.value = 'waiting...'
        const r1 = confirm({ title: 'Dialog 1', message: 'First confirm dialog' })
        const r2 = alert({ title: 'Dialog 2', message: 'Second alert dialog' })
        const r3 = destroy({ title: 'Dialog 3', message: 'Third destroy dialog' })
        const [ v1, , v3 ] = await Promise.all([ r1, r2, r3 ])
        result.value = `multi → confirm: ${v1}, alert: done, destroy: ${v3}`
      }
      return { handleMulti, result }
    },
    template: `
      <div class="space-y-4">
        <Button variant="secondary" @click="handleMulti">Multi Dialog</Button>
        <div v-if="result" class="rounded-md bg-muted p-4 text-sm">Result: {{ result }}</div>
      </div>
    `,
  }),
}

export const WithTypes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<script setup lang="ts">
const { confirm, alert, destroy } = useDialog()

confirm({ title: 'Warning', type: 'warn', message: 'This operation may affect your data.' })
alert({ title: 'Information', type: 'info', message: 'Your changes have been saved.' })
alert({ title: 'Success', type: 'success', message: 'Payment completed successfully.' })
destroy({ title: 'Delete Account', message: 'All data will be permanently removed.' })
</script>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Button },
    setup () {
      const { confirm, alert, destroy } = useDialog()
      const result = ref('')
      async function handleWithType () {
        const ok = await confirm({ title: 'Warning', type: 'warn', message: 'This operation may affect your data. Do you want to continue?' })
        result.value = `typed confirm → ${ok}`
      }
      async function handleAlertInfo () {
        await alert({ title: 'Information', type: 'info', message: 'Your changes have been saved successfully.' })
        result.value = 'typed alert → closed'
      }
      async function handleSuccess () {
        await alert({ title: 'Success', type: 'success', message: 'Payment completed successfully.' })
        result.value = 'success alert → closed'
      }
      async function handleDestroyDanger () {
        const ok = await destroy({ title: 'Delete Account', message: 'All data will be permanently removed. This action cannot be undone.' })
        result.value = `typed destroy → ${ok}`
      }
      return { handleWithType, handleAlertInfo, handleSuccess, handleDestroyDanger, result }
    },
    template: `
      <div class="space-y-4">
        <div class="flex gap-2">
          <Button variant="outline" @click="handleWithType">Warn Confirm</Button>
          <Button variant="outline" @click="handleAlertInfo">Info Alert</Button>
          <Button variant="outline" @click="handleSuccess">Success Alert</Button>
          <Button variant="destructive" @click="handleDestroyDanger">Danger Destroy</Button>
        </div>
        <div v-if="result" class="rounded-md bg-muted p-4 text-sm">Result: {{ result }}</div>
      </div>
    `,
  }),
}
