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
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Button },
    setup () {
      const { confirm, alert, destroy } = useDialog()
      const result = ref('')

      async function handleConfirm () {
        const ok = await confirm({ title: 'Confirm', message: 'Do you want to proceed?' })
        result.value = `confirm → ${ok}`
      }
      async function handleAlert () {
        await alert({ title: 'Error', type: 'error', message: 'Something went wrong.' })
        result.value = 'alert → closed'
      }
      async function handleDestroy () {
        const ok = await destroy({ title: 'Delete Item', message: 'This action cannot be undone.' })
        result.value = `destroy → ${ok}`
      }
      async function handleMulti () {
        result.value = 'waiting...'
        const r1 = confirm({ title: 'Dialog 1', message: 'First confirm dialog' })
        const r2 = alert({ title: 'Dialog 2', message: 'Second alert dialog' })
        const r3 = destroy({ title: 'Dialog 3', message: 'Third destroy dialog' })
        const [ v1, , v3 ] = await Promise.all([ r1, r2, r3 ])
        result.value = `multi → confirm: ${v1}, alert: done, destroy: ${v3}`
      }
      async function handleWithType () {
        const ok = await confirm({ title: 'Warning', type: 'warn', message: 'This operation may affect your data. Do you want to continue?' })
        result.value = `typed confirm → ${ok}`
      }
      async function handleAlertInfo () {
        await alert({ title: 'Information', type: 'info', message: 'Your changes have been saved successfully.' })
        result.value = 'typed alert → closed'
      }
      async function handleDestroyDanger () {
        const ok = await destroy({ title: 'Delete Account', message: 'All data will be permanently removed. This action cannot be undone.' })
        result.value = `typed destroy → ${ok}`
      }
      async function handleSuccess () {
        await alert({ title: 'Success', type: 'success', message: 'Payment completed successfully.' })
        result.value = 'success alert → closed'
      }

      return { handleConfirm, handleAlert, handleDestroy, handleMulti, handleWithType, handleAlertInfo, handleDestroyDanger, handleSuccess, result }
    },
    template: `
      <div class="space-y-10">
        <!-- Confirm -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Confirm</h3>
          <Button @click="handleConfirm">Confirm</Button>
        </section>

        <!-- Alert -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Alert</h3>
          <Button variant="outline" @click="handleAlert">Alert</Button>
        </section>

        <!-- Destroy -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Destroy</h3>
          <Button variant="destructive" @click="handleDestroy">Destroy</Button>
        </section>

        <!-- Multi Dialog -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Multi Dialog</h3>
          <Button variant="secondary" @click="handleMulti">Multi Dialog</Button>
        </section>

        <!-- With Type (ModalContent) -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Type (ModalContent)</h3>
          <div class="flex gap-2">
            <Button variant="outline" @click="handleWithType">Warn Confirm</Button>
            <Button variant="outline" @click="handleAlertInfo">Info Alert</Button>
            <Button variant="outline" @click="handleSuccess">Success Alert</Button>
            <Button variant="destructive" @click="handleDestroyDanger">Danger Destroy</Button>
          </div>
        </section>

        <!-- Result -->
        <div v-if="result" class="rounded-md bg-muted p-4 text-sm">Result: {{ result }}</div>
      </div>
    `,
  }),
}
