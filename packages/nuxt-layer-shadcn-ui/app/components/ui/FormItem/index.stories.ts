import type { Meta, StoryObj } from '@storybook/vue3'
import Input from '../Input/index.vue'
import FormItem from './index.vue'

const meta = {
  title: 'UI/FormItem',
  component: FormItem,
} satisfies Meta<typeof FormItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { FormItem, Input },
    setup () {
      const name = ref('')
      const email = ref('')
      return { name, email }
    },
    template: `
      <div class="space-y-10 max-w-md">
        <section>
          <h3 class="mb-4 text-lg font-medium">Basic</h3>
          <FormItem label="Name">
            <Input v-model="name" placeholder="Enter your name" />
          </FormItem>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Required</h3>
          <FormItem label="Email" required>
            <Input v-model="email" placeholder="Enter your email" />
          </FormItem>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">With Error</h3>
          <FormItem label="Username" required error="Username is already taken">
            <Input model-value="admin" />
          </FormItem>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">With Description</h3>
          <FormItem label="Password" description="Must be at least 8 characters long">
            <Input type="password" placeholder="Enter password" />
          </FormItem>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Horizontal Orientation</h3>
          <FormItem label="Display Name" orientation="horizontal">
            <Input placeholder="Enter display name" />
          </FormItem>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Responsive Orientation</h3>
          <p class="mb-2 text-sm text-muted-foreground">Drag the right edge to resize ↔</p>
          <div class="@container/field-group resize-x overflow-auto rounded border border-dashed border-border bg-card p-4" style="min-width: 200px;">
            <FormItem label="Address" orientation="responsive" description="Your mailing address">
              <Input placeholder="Enter address" />
            </FormItem>
          </div>
        </section>
      </div>
    `,
  }),
}
