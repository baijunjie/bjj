import type { Meta, StoryObj } from '@storybook/vue3'
import Alert from './index.vue'

type AlertType = 'default' | 'success' | 'info' | 'help' | 'warn' | 'danger'

const types: AlertType[] = [ 'default', 'success', 'info', 'help', 'warn', 'danger' ]

const meta = {
  title: 'UI/Alert',
  component: Alert,
  argTypes: {
    type: { control: 'select', options: types },
    icon: { control: 'text' },
  },
  args: {
    type: 'default',
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Alert },
    setup: () => ({ args, types }),
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Alert v-bind="args">This is a controlled alert message.</Alert>
        </section>

        <!-- All Types -->
        <section>
          <h3 class="mb-4 text-lg font-medium">All Types</h3>
          <div class="space-y-3">
            <Alert v-for="t in types" :key="t" :type="t">
              This is a <strong>{{ t }}</strong> alert message.
            </Alert>
          </div>
        </section>

        <!-- Custom Icon -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Custom Icon</h3>
          <Alert type="info" icon="bell">Alert with a custom bell icon.</Alert>
        </section>
      </div>
    `,
  }),
}
