import type { Meta, StoryObj } from '@storybook/vue3'
import { RadioGroup } from '../../shadcn/radio-group'
import Radio from './index.vue'

const meta = {
  title: 'UI/Radio',
  component: Radio,
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { RadioGroup, Radio },
    setup () {
      const selected = ref('option1')
      const plan = ref('free')
      return { args, selected, plan }
    },
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <RadioGroup v-model="selected" :disabled="args.disabled" class="flex flex-col gap-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <Radio value="option1" />
              <span class="text-sm">Option 1</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <Radio value="option2" />
              <span class="text-sm">Option 2</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <Radio value="option3" />
              <span class="text-sm">Option 3</span>
            </label>
          </RadioGroup>
          <div class="mt-2 text-sm text-muted-foreground">Selected: {{ selected }}</div>
        </section>

        <!-- Plan Selection -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Plan Selection</h3>
          <RadioGroup v-model="plan" class="flex flex-col gap-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <Radio value="free" />
              <span class="text-sm">Free - $0/month</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <Radio value="pro" />
              <span class="text-sm">Pro - $9/month</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <Radio value="enterprise" />
              <span class="text-sm">Enterprise - $29/month</span>
            </label>
          </RadioGroup>
          <div class="mt-2 text-sm text-muted-foreground">Plan: {{ plan }}</div>
        </section>
      </div>
    `,
  }),
}
