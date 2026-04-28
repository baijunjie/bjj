import type { Meta, StoryObj } from '@storybook/vue3'
import Pagination from './index.vue'

const sizes = [ 'default', 'sm' ] as const

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  argTypes: {
    page: { control: { type: 'number', min: 1 }},
    total: { control: { type: 'number', min: 0 }},
    pageSize: { control: { type: 'number', min: 1 }},
    pageSizeOptions: { control: 'object' },
    simple: { control: 'boolean' },
    siblingCount: { control: { type: 'number', min: 0 }},
    size: { control: 'select', options: sizes },
  },
  args: {
    page: 1,
    total: 85,
    pageSize: 10,
    pageSizeOptions: [ 10, 20, 50 ],
    simple: false,
    siblingCount: 1,
    size: 'default',
  },
  render: args => ({
    components: { Pagination },
    setup: () => ({ args }),
    template: '<Pagination v-bind="args" />',
  }),
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Sizes: Story = {
  parameters: noControls,
  render: () => ({
    components: { Pagination },
    template: `
      <div class="space-y-4">
        <div>
          <span class="mb-2 block text-sm font-medium">default</span>
          <Pagination :page="3" :total="85" :pageSize="10" />
        </div>
        <div>
          <span class="mb-2 block text-sm font-medium">sm</span>
          <Pagination :page="3" :total="85" :pageSize="10" size="sm" />
        </div>
      </div>
    `,
  }),
}

export const Simple: Story = {
  parameters: noControls,
  render: () => ({
    components: { Pagination },
    template: `
      <div class="space-y-4">
        <div>
          <span class="mb-2 block text-sm font-medium">default</span>
          <Pagination :page="3" :total="85" :pageSize="10" simple />
        </div>
        <div>
          <span class="mb-2 block text-sm font-medium">sm</span>
          <Pagination :page="3" :total="85" :pageSize="10" simple size="sm" />
        </div>
      </div>
    `,
  }),
}
