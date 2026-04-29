import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
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
    class: { control: 'text' },
  },
  args: {
    modelValue: '',
    autocomplete: 'off',
    disabled: false,
    readonly: false,
    invalid: false,
    class: 'max-w-sm',
  },
  render: args => ({
    components: { Input },
    setup: () => ({ args }),
    template: `
      <Input v-bind="args" placeholder="Type something..." />
    `,
  }),
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithPrefix: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Input v-model="value" placeholder="Search...">
    <template #prefix>
      <Icon name="search" />
    </template>
  </Input>
</template>
`.trim(),
      },
    },
  },
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
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Input v-model="value" placeholder="Email">
    <template #suffix>
      <Icon name="mail" />
    </template>
  </Input>
</template>
`.trim(),
      },
    },
  },
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
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: '<Input v-model="value" type="password" placeholder="Password" />',
      },
    },
  },
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
  args: {
    disabled: true,
    modelValue: 'Disabled input',
  },
}

export const Readonly: Story = {
  parameters: noControls,
  args: {
    readonly: true,
    modelValue: 'Read-only value',
  },
}

export const Invalid: Story = {
  parameters: noControls,
  args: {
    invalid: true,
    modelValue: 'Invalid value',
  },
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { Input, EventLog },
    setup: () => ({ value: ref('') }),
    template: `
      <EventLog v-slot="{ record }">
        <Input
          v-model="value"
          class="max-w-sm"
          placeholder="Type and blur to see events"
          @update:modelValue="(v) => record('update:modelValue', v)"
          @change="(v) => record('change', v)"
        />
      </EventLog>
    `,
  }),
}
