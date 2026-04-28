import type { Meta, StoryObj } from '@storybook/vue3'
import Textarea from './index.vue'

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  argTypes: {
    modelValue: { control: 'text' },
    autocomplete: { control: 'text' },
    rows: { control: 'number' },
    invalid: { control: 'boolean' },
    class: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
  args: {
    modelValue: '',
    autocomplete: '',
    rows: undefined,
    invalid: false,
    class: '',
    disabled: false,
    readonly: false,
  },
  render: args => ({
    components: { Textarea },
    setup: () => ({ args }),
    template: `
      <div class="max-w-sm">
        <Textarea v-bind="args" placeholder="Type your message here..." />
      </div>
    `,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithRows: Story = {
  parameters: noControls,
  render: () => ({
    components: { Textarea },
    template: `
      <div class="max-w-sm">
        <Textarea :rows="6" placeholder="6 rows of height" />
      </div>
    `,
  }),
}

export const Invalid: Story = {
  parameters: noControls,
  render: () => ({
    components: { Textarea },
    template: `
      <div class="max-w-sm">
        <Textarea invalid model-value="Invalid content" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: noControls,
  render: () => ({
    components: { Textarea },
    template: `
      <div class="max-w-sm">
        <Textarea disabled model-value="Disabled textarea" />
      </div>
    `,
  }),
}

export const Readonly: Story = {
  parameters: noControls,
  render: () => ({
    components: { Textarea },
    template: `
      <div class="max-w-sm">
        <Textarea readonly model-value="Readonly content" />
      </div>
    `,
  }),
}
