import type { Meta, StoryObj } from '@storybook/vue3'
import Checkbox from './index.vue'

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Checkbox },
    setup () {
      const checked = ref(false)
      const checkedOn = ref(true)
      return { checked, checkedOn }
    },
    template: `
      <div class="space-y-10">
        <section>
          <h3 class="mb-4 text-lg font-medium">Basic</h3>
          <label class="flex items-center gap-2 cursor-pointer">
            <Checkbox v-model="checked" />
            <span class="text-sm">Accept terms and conditions</span>
          </label>
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ checked }}</div>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Checked</h3>
          <label class="flex items-center gap-2 cursor-pointer">
            <Checkbox v-model="checkedOn" />
            <span class="text-sm">Enable notifications</span>
          </label>
          <div class="mt-2 text-sm text-muted-foreground">Value: {{ checkedOn }}</div>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Indeterminate</h3>
          <label class="flex items-center gap-2 cursor-pointer">
            <Checkbox model-value="indeterminate" />
            <span class="text-sm">Select all items</span>
          </label>
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Disabled</h3>
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
        </section>
      </div>
    `,
  }),
}
