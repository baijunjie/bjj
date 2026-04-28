import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from '../Icon/index.vue'
import Input from './index.vue'

const meta = {
  title: 'UI/Input',
  component: Input,
  argTypes: {
    modelValue: { control: 'text' },
    autocomplete: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    modelValue: '',
    autocomplete: 'off',
    disabled: false,
    readonly: false,
    invalid: false,
  },
  render: args => ({
    components: { Input },
    setup: () => ({ args }),
    template: `
      <Input v-bind="args" placeholder="Type something..." class="max-w-sm" />
    `,
  }),
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithPrefix: Story = {
  parameters: noControls,
  render: () => ({
    components: { Input, Icon },
    setup () {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="max-w-sm space-y-2">
        <Input v-model="value" placeholder="Search...">
          <template #prefix>
            <Icon name="search" />
          </template>
        </Input>
        <div class="text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
}

export const WithSuffix: Story = {
  parameters: noControls,
  render: () => ({
    components: { Input, Icon },
    setup () {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="max-w-sm space-y-2">
        <Input v-model="value" placeholder="Email">
          <template #suffix>
            <Icon name="mail" />
          </template>
        </Input>
        <div class="text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
}

export const Password: Story = {
  parameters: noControls,
  render: () => ({
    components: { Input },
    setup () {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="max-w-sm space-y-2">
        <Input v-model="value" type="password" placeholder="Password" />
        <div class="text-sm text-muted-foreground">Value: {{ value }}</div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: noControls,
  render: () => ({
    components: { Input },
    template: '<Input disabled placeholder="Disabled input" class="max-w-sm" />',
  }),
}

export const Readonly: Story = {
  parameters: noControls,
  render: () => ({
    components: { Input },
    template: '<Input readonly modelValue="Read-only value" class="max-w-sm" />',
  }),
}

export const Invalid: Story = {
  parameters: noControls,
  render: () => ({
    components: { Input },
    template: '<Input invalid modelValue="Invalid value" class="max-w-sm" />',
  }),
}
