import type { Meta, StoryObj } from '@storybook/vue3'
import ModalContent from './index.vue'

const meta = {
  title: 'UI/ModalContent',
  component: ModalContent,
} satisfies Meta<typeof ModalContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { ModalContent },
    template: `
      <div class="space-y-4 max-w-md">
        <!-- Types -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Types</h3>
          <div class="space-y-4">
            <ModalContent type="default" content="This is a default message." />
            <ModalContent type="success" content="Operation completed successfully." />
            <ModalContent type="info" content="Your changes have been saved." />
            <ModalContent type="help" content="Need help? Check the documentation." />
            <ModalContent type="warn" content="This operation will affect all users." />
            <ModalContent type="danger" content="Are you sure you want to delete this item? This action cannot be undone." />
          </div>
        </section>

        <!-- Custom Icon -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Custom Icon</h3>
          <div class="space-y-4">
            <ModalContent icon="shield-alert" content="Your session is about to expire." />
            <ModalContent type="warn" icon="shield-alert" content="Security warning: unusual login detected." />
          </div>
        </section>

        <!-- Multiline Text -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Multiline Text</h3>
          <ModalContent type="warn" content="Warning: This operation will affect all users.\nPlease review the changes before proceeding." />
        </section>
      </div>
    `,
  }),
}
