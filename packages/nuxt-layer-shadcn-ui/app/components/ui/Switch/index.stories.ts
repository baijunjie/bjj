import type { Meta, StoryObj } from '@storybook/vue3'
import Switch from './index.vue'

const meta = {
  title: 'UI/Switch',
  component: Switch,
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
  render: args => ({
    components: { Switch },
    setup () {
      const on = ref(true)
      return { args, on }
    },
    template: `
      <div class="flex items-center gap-4">
        <Switch v-model="on" v-bind="args" />
        <div class="text-sm text-muted-foreground">Value: {{ on }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
