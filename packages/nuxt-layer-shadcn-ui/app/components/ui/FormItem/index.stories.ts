import type { Meta, StoryObj } from '@storybook/vue3'
import Input from '../Input/index.vue'
import FormItem from './index.vue'

const orientations = [ 'vertical', 'horizontal', 'responsive' ] as const

const meta = {
  title: 'UI/FormItem',
  component: FormItem,
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    description: { control: 'text' },
    required: { control: 'boolean' },
    orientation: { control: 'select', options: orientations },
    class: { control: 'text' },
  },
  args: {
    label: 'Name',
    error: '',
    description: '',
    required: false,
    orientation: 'vertical',
    class: '',
  },
  render: args => ({
    components: { FormItem, Input },
    setup: () => ({ args }),
    template: `
      <div class="max-w-md">
        <FormItem v-bind="args">
          <Input placeholder="Enter value" />
        </FormItem>
      </div>
    `,
  }),
} satisfies Meta<typeof FormItem>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Required: Story = {
  parameters: noControls,
  render: () => ({
    components: { FormItem, Input },
    setup () {
      const email = ref('')
      return { email }
    },
    template: `
      <div class="max-w-md">
        <FormItem label="Email" required>
          <Input v-model="email" placeholder="Enter your email" />
        </FormItem>
      </div>
    `,
  }),
}

export const WithError: Story = {
  parameters: noControls,
  render: () => ({
    components: { FormItem, Input },
    template: `
      <div class="max-w-md">
        <FormItem label="Username" required error="Username is already taken">
          <Input model-value="admin" />
        </FormItem>
      </div>
    `,
  }),
}

export const WithDescription: Story = {
  parameters: noControls,
  render: () => ({
    components: { FormItem, Input },
    template: `
      <div class="max-w-md">
        <FormItem label="Password" description="Must be at least 8 characters long">
          <Input type="password" placeholder="Enter password" />
        </FormItem>
      </div>
    `,
  }),
}

export const Horizontal: Story = {
  parameters: noControls,
  render: () => ({
    components: { FormItem, Input },
    template: `
      <div class="max-w-md">
        <FormItem label="Display Name" orientation="horizontal">
          <Input placeholder="Enter display name" />
        </FormItem>
      </div>
    `,
  }),
}

export const Responsive: Story = {
  parameters: noControls,
  render: () => ({
    components: { FormItem, Input },
    template: `
      <div class="max-w-md">
        <div class="@container/field-group resize-x overflow-auto rounded border border-dashed border-border bg-card p-4" style="min-width: 200px;">
          <FormItem label="Address" orientation="responsive" description="Your mailing address">
            <Input placeholder="Enter address" />
          </FormItem>
        </div>
        <p class="mt-2 text-sm text-muted-foreground">Drag the right edge to resize horizontally.</p>
      </div>
    `,
  }),
}
