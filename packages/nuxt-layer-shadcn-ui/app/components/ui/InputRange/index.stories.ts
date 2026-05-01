import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
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
    disabled: { control: 'boolean' },
  },
  args: {
    start: undefined,
    end: undefined,
    min: 0,
    max: 100,
    startPlaceholder: undefined,
    endPlaceholder: undefined,
    disabled: false,
  },
  render: args => ({
    components: { InputRange },
    setup () {
      return { args }
    },
    template: `
      <div class="max-w-md">
        <InputRange
          v-bind="args"
          @update:start="v => args.start = v"
          @update:end="v => args.end = v"
        />
        <div class="mt-2 text-sm text-muted-foreground">Start: {{ args.start }}, End: {{ args.end }}</div>
      </div>
    `,
  }),
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
