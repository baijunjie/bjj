import type { Meta, StoryObj } from '@storybook/vue3'
import InputOtp from './index.vue'

const meta = {
  title: 'UI/InputOtp',
  component: InputOtp,
  argTypes: {
    disabled: { control: 'boolean' },
    length: { control: 'number' },
  },
  args: {
    disabled: false,
    length: 6,
  },
  render: args => ({
    components: { InputOtp },
    setup () {
      const otp = ref('')
      const completed = ref('')
      function onComplete (value: string) {
        completed.value = value
      }
      return { args, otp, completed, onComplete }
    },
    template: `
      <div class="space-y-4">
        <InputOtp v-model="otp" v-bind="args" @complete="onComplete" />
        <div class="text-sm text-muted-foreground">Value: {{ otp }}</div>
        <div v-if="completed" class="text-sm text-success">Completed: {{ completed }}</div>
      </div>
    `,
  }),
} satisfies Meta<typeof InputOtp>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
