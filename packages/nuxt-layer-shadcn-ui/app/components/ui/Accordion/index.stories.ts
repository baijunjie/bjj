import type { Meta, StoryObj } from '@storybook/vue3'
import type { AccordionItem } from './types'
import Icon from '../Icon/index.vue'
import Surface from '../Surface/index.vue'
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
  render: args => ({
    components: { Accordion, Surface },
    setup: () => ({ args, items }),
    template: `
      <Surface variant="bordered" class="max-w-md px-4">
        <Accordion v-bind="args" :items="items" default-value="shipping" />
      </Surface>
    `,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Multiple: Story = {
  parameters: noControls,
  render: () => ({
    components: { Accordion, Surface },
    setup () {
      const value = ref<string[]>([ 'shipping', 'returns' ])
      return { items, value }
    },
    template: `
      <div class="max-w-md">
        <Surface variant="bordered" class="px-4">
          <Accordion v-model="value" type="multiple" :items="items" />
        </Surface>
        <div class="mt-3 text-sm text-muted-foreground">Open: {{ value.join(', ') || '(none)' }}</div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  parameters: noControls,
  render: () => ({
    components: { Accordion, Surface },
    setup: () => ({ items }),
    template: `
      <Surface variant="bordered" class="max-w-md px-4">
        <Accordion disabled :items="items" default-value="shipping" />
      </Surface>
    `,
  }),
}

export const CustomSlots: Story = {
  parameters: noControls,
  render: () => ({
    components: { Accordion, Surface, Icon },
    setup () {
      const value = ref<string>('shipping')
      return { items, value }
    },
    template: `
      <Surface variant="bordered" class="max-w-md px-4">
        <Accordion v-model="value" :items="items">
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
    `,
  }),
}
