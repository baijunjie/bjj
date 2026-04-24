import type { Meta, StoryObj } from '@storybook/vue3'
import Checkbox from './index.vue'

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  argTypes: {
    modelValue: { control: 'select', options: [ true, false, 'indeterminate' ]},
    defaultValue: { control: 'select', options: [ true, false, 'indeterminate' ]},
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    name: { control: 'text' },
    value: { control: 'text' },
  },
  args: {
    modelValue: false,
    defaultValue: false,
    disabled: false,
    required: false,
    name: '',
    value: '',
  },
  render: args => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: `
      <label class="flex items-center gap-2 cursor-pointer">
        <Checkbox v-bind="args" />
        <span class="text-sm">Accept terms and conditions</span>
      </label>
    `,
  }),
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  render: () => ({
    components: { Checkbox },
    setup () {
      const checked = ref(true)
      return { checked }
    },
    template: `
      <div>
        <label class="flex items-center gap-2 cursor-pointer">
          <Checkbox v-model="checked" />
          <span class="text-sm">Enable notifications</span>
        </label>
        <div class="mt-2 text-sm text-muted-foreground">Value: {{ checked }}</div>
      </div>
    `,
  }),
}

export const Indeterminate: Story = {
  render: () => ({
    components: { Checkbox },
    template: `
      <label class="flex items-center gap-2 cursor-pointer">
        <Checkbox model-value="indeterminate" />
        <span class="text-sm">Select all items</span>
      </label>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Checkbox },
    template: `
      <div class="flex flex-col gap-3">
        <label class="flex items-center gap-2 cursor-not-allowed opacity-50">
          <Checkbox :model-value="false" disabled />
          <span class="text-sm">Unchecked disabled</span>
        </label>
        <label class="flex items-center gap-2 cursor-not-allowed opacity-50">
          <Checkbox :model-value="true" disabled />
          <span class="text-sm">Checked disabled</span>
        </label>
        <label class="flex items-center gap-2 cursor-not-allowed opacity-50">
          <Checkbox model-value="indeterminate" disabled />
          <span class="text-sm">Indeterminate disabled</span>
        </label>
      </div>
    `,
  }),
}
