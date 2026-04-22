import type { Meta, StoryObj } from '@storybook/vue3'
import Pagination from './index.vue'

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  argTypes: {
    simple: { control: 'boolean' },
    size: { control: 'select', options: [ 'default', 'sm' ]},
    siblingCount: { control: { type: 'number', min: 0 }},
  },
  args: {
    simple: false,
    size: 'default',
    siblingCount: 1,
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Pagination },
    setup () {
      const page = ref(1)
      const pageSize = ref(10)

      return { args, page, pageSize }
    },
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Pagination
            v-bind="args"
            :page="page"
            :total="85"
            :pageSize="pageSize"
            :pageSizeOptions="[10, 20, 50]"
            @update:page="page = $event"
            @update:pageSize="v => { pageSize = v; page = 1 }"
          />
          <div class="mt-2 text-sm text-muted-foreground">
            Page: {{ page }}, Size: {{ pageSize }}
          </div>
        </section>

        <!-- Size comparison -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Size</h3>
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
        </section>

        <!-- Simple mode -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Simple Mode</h3>
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
        </section>
      </div>
    `,
  }),
}
