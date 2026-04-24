import type { Meta, StoryObj } from '@storybook/vue3'
import type { RadioGroupItem } from './types'
import RadioGroup from './index.vue'

const options: RadioGroupItem[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

const plans: RadioGroupItem[] = [
  { value: 'free', label: 'Free - $0/month' },
  { value: 'pro', label: 'Pro - $9/month' },
  { value: 'enterprise', label: 'Enterprise - $29/month', disabled: true },
]

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  argTypes: {
    disabled: { control: 'boolean' },
    orientation: {
      control: 'inline-radio',
      options: [ 'vertical', 'horizontal' ],
    },
  },
  args: {
    items: options,
    disabled: false,
    orientation: 'vertical',
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { RadioGroup },
    setup () {
      const selected = ref('option1')
      const horizontal = ref('option1')
      const plan = ref('pro')
      const customized = ref('pro')
      return { args, selected, horizontal, plan, customized, plans }
    },
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <RadioGroup
            v-model="selected"
            :items="args.items"
            :disabled="args.disabled"
            :orientation="args.orientation"
          />
          <div class="mt-2 text-sm text-muted-foreground">Selected: {{ selected }}</div>
        </section>

        <!-- Horizontal -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Horizontal</h3>
          <RadioGroup
            v-model="horizontal"
            :items="args.items"
            orientation="horizontal"
          />
          <div class="mt-2 text-sm text-muted-foreground">Selected: {{ horizontal }}</div>
        </section>

        <!-- With Disabled Item -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Disabled Item</h3>
          <RadioGroup
            v-model="plan"
            :items="plans"
          />
          <div class="mt-2 text-sm text-muted-foreground">Plan: {{ plan }}</div>
        </section>

        <!-- Custom Label Slot -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Custom Label Slot</h3>
          <RadioGroup
            v-model="customized"
            :items="plans"
          >
            <template #label="{ item, checked }">
              <span :class="checked ? 'font-semibold text-primary' : 'text-foreground'">
                {{ item.label }}
              </span>
            </template>
          </RadioGroup>
          <div class="mt-2 text-sm text-muted-foreground">Plan: {{ customized }}</div>
        </section>
      </div>
    `,
  }),
}
