import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import { useArgsModel } from '#storybook/argsModel'
import InputCurrency from '../InputCurrency/index.vue'
import InputRange from './index.vue'

const meta = {
  title: 'UI/InputRange',
  component: InputRange,
  argTypes: {
    start: { control: 'number' },
    end: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    startPlaceholder: { control: 'text' },
    endPlaceholder: { control: 'text' },
    readonly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    as: { control: false },
  },
  args: {
    start: undefined,
    end: undefined,
    min: 0,
    max: 100,
    startPlaceholder: '',
    endPlaceholder: '',
    readonly: false,
    disabled: false,
    invalid: false,
    as: undefined,
  },
  render: args => {
    const onUpdateStart = useArgsModel('start')
    const onUpdateEnd = useArgsModel('end')
    return {
      components: { InputRange },
      setup: () => ({ args, onUpdateStart, onUpdateEnd }),
      template: `
        <div class="max-w-md">
          <InputRange
            v-bind="args"
            @update:start="onUpdateStart"
            @update:end="onUpdateEnd"
          />
          <div class="mt-2 text-sm text-muted-foreground">Start: {{ args.start }}, End: {{ args.end }}</div>
        </div>
      `,
    }
  },
} satisfies Meta<typeof InputRange>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const CustomBounds: Story = {
  parameters: noControls,
  args: {
    start: -50,
    end: 50,
    min: -100,
    max: 100,
  },
}

export const Disabled: Story = {
  parameters: noControls,
  args: {
    disabled: true,
  },
}

export const Invalid: Story = {
  parameters: noControls,
  args: {
    invalid: true,
    start: 20,
    end: 80,
  },
}

export const CustomInput: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <InputRange
    v-model:start="start"
    v-model:end="end"
    :as="InputCurrency"
    currency="JPY"
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { InputRange },
    setup: () => ({
      start: ref<number | undefined>(1000),
      end: ref<number | undefined>(5000),
      InputCurrency,
    }),
    template: `
      <div class="max-w-md">
        <InputRange
          v-model:start="start"
          v-model:end="end"
          :as="InputCurrency"
          currency="JPY"
        />
      </div>
    `,
  }),
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { InputRange, EventLog },
    setup: () => ({
      start: ref<number | undefined>(20),
      end: ref<number | undefined>(80),
    }),
    template: `
      <EventLog v-slot="{ record }">
        <div class="max-w-md">
          <InputRange
            v-model:start="start"
            v-model:end="end"
            @update:start="(v) => record('update:start', v)"
            @update:end="(v) => record('update:end', v)"
          />
        </div>
      </EventLog>
    `,
  }),
}
