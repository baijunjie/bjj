import type { Meta, StoryObj } from '@storybook/vue3'
import { toast } from 'vue-sonner'
import Button from '../Button/index.vue'
import Toast from './index.vue'

const meta = {
  title: 'UI/Toast',
  component: Toast,
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Toast, Button },
    setup () {
      const showDefault = () => toast('This is a default toast')
      const showSuccess = () => toast.success('Operation completed successfully')
      const showError = () => toast.error('Something went wrong')
      const showInfo = () => toast.info('Here is some information')
      const showWarning = () => toast.warning('Please be careful')
      const showWithDescription = () => toast('Event created', { description: 'Your event has been scheduled for tomorrow at 3:00 PM.' })
      return { showDefault, showSuccess, showError, showInfo, showWarning, showWithDescription }
    },
    template: `
      <div class="space-y-10">
        <Toast position="bottom-right" />

        <section>
          <h3 class="mb-4 text-lg font-medium">Toast Types</h3>
          <div class="flex flex-wrap gap-3">
            <Button variant="outline" @click="showDefault">Default</Button>
            <Button variant="outline" @click="showSuccess">Success</Button>
            <Button variant="outline" @click="showError">Error</Button>
            <Button variant="outline" @click="showInfo">Info</Button>
            <Button variant="outline" @click="showWarning">Warning</Button>
          </div>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">With Description</h3>
          <Button variant="outline" @click="showWithDescription">Show Toast with Description</Button>
        </section>
      </div>
    `,
  }),
}
