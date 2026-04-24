import type { Meta, StoryObj } from '@storybook/vue3'
import type { ModalContentType } from '../ModalContent/types'
import Button from '../Button/index.vue'
import Input from '../Input/index.vue'
import Modal from './index.vue'

const types: ModalContentType[] = [ 'default', 'success', 'info', 'help', 'warn', 'danger', 'error' ]

const meta = {
  title: 'UI/Modal',
  component: Modal,
  argTypes: {
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    confirmDisabled: { control: 'boolean' },
    showCancel: { control: 'boolean' },
    showClose: { control: 'boolean' },
    hideHeader: { control: 'boolean' },
    hideFooter: { control: 'boolean' },
    alignCenter: { control: 'boolean' },
    type: { control: 'select', options: types },
    title: { control: 'text' },
    description: { control: 'text' },
    confirmText: { control: 'text' },
    cancelText: { control: 'text' },
  },
  args: {
    loading: false,
    disabled: false,
    confirmDisabled: false,
    showCancel: true,
    showClose: true,
    hideHeader: false,
    hideFooter: false,
    alignCenter: false,
    type: 'default',
    title: 'Modal Title',
    description: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
  },
  render: args => ({
    components: { Modal, Button, Input },
    setup () {
      const visible = ref(false)
      return { args, visible }
    },
    template: `
      <div>
        <Button @click="visible = true">Open Modal</Button>
        <Modal v-model:visible="visible" v-bind="args">
          <p>This is the modal content.</p>
          <Input class="mt-4" placeholder="Try interacting with this input" />
        </Modal>
      </div>
    `,
  }),
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDescription: Story = {
  render: () => ({
    components: { Modal, Button },
    setup () {
      const visible = ref(false)
      return { visible }
    },
    template: `
      <div>
        <Button @click="visible = true">Open Modal</Button>
        <Modal
          v-model:visible="visible"
          title="Delete Project"
          description="This will permanently remove the project and all its data. This action cannot be undone."
          showCancel
          confirmVariant="destructive"
          confirmText="Delete"
        >
          <p>Are you sure you want to continue?</p>
        </Modal>
      </div>
    `,
  }),
}

export const ScrollableContent: Story = {
  render: () => ({
    components: { Modal, Button },
    setup () {
      const visible = ref(false)
      return { visible }
    },
    template: `
      <div>
        <Button @click="visible = true">Open Modal</Button>
        <Modal v-model:visible="visible" title="Terms of Service" showCancel confirmText="Accept">
          <div class="space-y-4">
            <p v-for="i in 20" :key="i">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          </div>
        </Modal>
      </div>
    `,
  }),
}

export const Types: Story = {
  render: () => ({
    components: { Modal, Button },
    setup () {
      const typeInfo = ref(false)
      const typeSuccess = ref(false)
      const typeHelp = ref(false)
      const typeWarn = ref(false)
      const typeDanger = ref(false)
      return { typeInfo, typeSuccess, typeHelp, typeWarn, typeDanger }
    },
    template: `
      <div>
        <div class="flex gap-2">
          <Button variant="outline" @click="typeInfo = true">Info</Button>
          <Button variant="outline" @click="typeSuccess = true">Success</Button>
          <Button variant="outline" @click="typeHelp = true">Help</Button>
          <Button variant="outline" @click="typeWarn = true">Warn</Button>
          <Button variant="outline" @click="typeDanger = true">Danger</Button>
        </div>
        <Modal v-model:visible="typeInfo" title="Information" type="info" showCancel>
          <p>Your session will expire in 5 minutes.</p>
        </Modal>
        <Modal v-model:visible="typeSuccess" title="Success" type="success">
          <p>Your payment has been processed successfully.</p>
        </Modal>
        <Modal v-model:visible="typeHelp" title="Help" type="help" showCancel>
          <p>Need assistance? Check our documentation or contact support.</p>
        </Modal>
        <Modal v-model:visible="typeWarn" title="Warning" type="warn" showCancel confirmVariant="destructive">
          <p>This operation may affect your existing data.</p>
        </Modal>
        <Modal v-model:visible="typeDanger" title="Delete Account" type="danger" showCancel confirmVariant="destructive" confirmText="Delete">
          <p>All data will be permanently removed. This action cannot be undone.</p>
        </Modal>
      </div>
    `,
  }),
}

export const EventHandling: Story = {
  render: () => ({
    components: { Modal, Button },
    setup () {
      const visible = ref(false)
      return { visible }
    },
    template: `
      <div>
        <Button @click="visible = true">Open Modal</Button>
        <Modal
          v-model:visible="visible"
          title="Event Demo"
          description="Open the Actions panel to see emitted events."
          showCancel
          confirmText="Confirm"
          @open="() => {}"
          @close="() => {}"
          @closed="() => {}"
          @confirm="() => {}"
          @cancel="() => {}"
        >
          <p>Click Confirm, Cancel, or the close button to see events fire.</p>
        </Modal>
      </div>
    `,
  }),
}
