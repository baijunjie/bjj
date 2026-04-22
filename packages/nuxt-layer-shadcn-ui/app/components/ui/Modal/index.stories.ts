import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '../Button/index.vue'
import Input from '../Input/index.vue'
import Modal from './index.vue'

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
  },
  args: {
    loading: false,
    disabled: false,
    confirmDisabled: false,
    showCancel: false,
    showClose: true,
    hideHeader: false,
    hideFooter: false,
    alignCenter: false,
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Modal, Button, Input },
    setup () {
      const controlled = ref(false)
      const withDescription = ref(false)
      const typeInfo = ref(false)
      const typeSuccess = ref(false)
      const typeHelp = ref(false)
      const typeWarn = ref(false)
      const typeDanger = ref(false)
      const scrollable = ref(false)
      return { args, controlled, withDescription, typeInfo, typeSuccess, typeHelp, typeWarn, typeDanger, scrollable }
    },
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Button @click="controlled = true">Open Modal</Button>
          <Modal
            v-model:visible="controlled"
            v-bind="args"
            title="Modal Title"
            confirmText="OK"
            cancelText="Cancel"
          >
            <p>This is the modal content.</p>
            <Input class="mt-4" placeholder="Try interacting with this input" />
          </Modal>
        </section>

        <!-- With Description -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Description</h3>
          <Button @click="withDescription = true">Open Modal</Button>
          <Modal
            v-model:visible="withDescription"
            title="Delete Project"
            description="This will permanently remove the project and all its data. This action cannot be undone."
            showCancel
            confirmVariant="destructive"
            confirmText="Delete"
          >
            <p>Are you sure you want to continue?</p>
          </Modal>
        </section>

        <!-- Scrollable Content -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Scrollable Content</h3>
          <Button @click="scrollable = true">Open Modal</Button>
          <Modal v-model:visible="scrollable" title="Terms of Service" showCancel confirmText="Accept">
            <div class="space-y-4">
              <p v-for="i in 20" :key="i">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            </div>
          </Modal>
        </section>

        <!-- With Type -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Type</h3>
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
        </section>
      </div>
    `,
  }),
}
