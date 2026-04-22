import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from '../Icon/index.vue'
import Surface from '../Surface/index.vue'
import type { AccordionItem } from './types'
import Accordion from './index.vue'

const items: AccordionItem[] = [
  {
    value: 'shipping',
    title: 'Shipping & delivery',
    content:
      'Orders are processed within 1-2 business days. Standard shipping takes 3-5 business days within the continental US.',
  },
  {
    value: 'returns',
    title: 'Returns policy',
    content:
      'We accept returns within 30 days of purchase. Items must be unworn with original tags attached.',
  },
  {
    value: 'support',
    title: 'Customer support',
    content:
      'Our support team is available Monday through Friday, 9am-6pm EST. Reach out via chat or email for assistance.',
  },
]

const meta = {
  title: 'UI/Accordion',
  component: Accordion as any,
  argTypes: {
    type: { control: 'select', options: [ 'single', 'multiple' ]},
    collapsible: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    type: 'single',
    collapsible: true,
    disabled: false,
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Accordion, Surface, Icon },
    setup () {
      const singleValue = ref<string>('shipping')
      const multipleValue = ref<string[]>([ 'shipping', 'returns' ])
      const slotValue = ref<string>('shipping')
      return { args, items, singleValue, multipleValue, slotValue }
    },
    template: `
      <div class="max-w-md space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Surface variant="bordered" class="px-4">
            <Accordion
              v-model="singleValue"
              v-bind="args"
              :items="items"
            />
          </Surface>
          <div class="mt-3 text-sm text-muted-foreground">Open: {{ singleValue || '(none)' }}</div>
        </section>

        <!-- Multiple -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Multiple</h3>
          <Surface variant="bordered" class="px-4">
            <Accordion
              v-model="multipleValue"
              type="multiple"
              :items="items"
            />
          </Surface>
          <div class="mt-3 text-sm text-muted-foreground">Open: {{ multipleValue.join(', ') || '(none)' }}</div>
        </section>

        <!-- Custom Slots -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Custom Slots</h3>
          <Surface variant="bordered" class="px-4">
            <Accordion
              v-model="slotValue"
              :items="items"
            >
              <template #title="{ item, open }">
                <span class="flex items-center gap-2">
                  <span class="inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon :name="open ? 'minus' : 'plus'" class="size-3" />
                  </span>
                  {{ item.title }}
                </span>
              </template>
              <template #content="{ item }">
                <p class="text-muted-foreground">{{ item.content }}</p>
              </template>
            </Accordion>
          </Surface>
        </section>
      </div>
    `,
  }),
}
