import type { Meta, StoryObj } from '@storybook/vue3'
import type { AsyncDataTableBatchAction, AsyncDataTableFetchParams, AsyncDataTableFetchResult } from './types'
import type { DataTableColumn } from '../DataTable/types'
import AsyncDataTable from './index.vue'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  amount: number
  createdAt: string
}

// Generate 85 mock users for pagination demo
const allUsers: User[] = Array.from({ length: 85 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: [ 'Admin', 'Editor', 'User' ][i % 3]!,
  status: i % 4 === 0 ? 'inactive' : 'active',
  amount: Math.round(Math.random() * 10000) / 100,
  createdAt: new Date(2024, 0, 1 + i).toISOString(),
}))

const columns: DataTableColumn[] = [
  { field: 'name', title: 'Name', width: '120px', sortable: true },
  { field: 'email', title: 'Email', minWidth: '200px' },
  { field: 'role', title: 'Role', width: '100px', sortable: true },
  { field: 'status', title: 'Status', width: '100px' },
  { field: 'amount', title: 'Amount', width: '120px', type: 'currency', sortable: true },
  { field: 'createdAt', title: 'Created', width: '140px', type: 'date' },
]

/** Simulated async fetch with sorting support */
function mockFetch (params: AsyncDataTableFetchParams): Promise<AsyncDataTableFetchResult<User>> {
  return new Promise(resolve => {
    setTimeout(() => {
      const data = [ ...allUsers ]

      if (params.sortBy) {
        const order = params.sortOrder ?? 1
        data.sort((a, b) => {
          const av = a[params.sortBy as keyof User]
          const bv = b[params.sortBy as keyof User]
          if (av! < bv!) return -1 * order
          if (av! > bv!) return 1 * order
          return 0
        })
      }

      const items = data.slice(params.offset, params.offset + params.limit)
      resolve({ items, total: data.length })
    }, 500)
  })
}

const batchActions: AsyncDataTableBatchAction<User>[] = [
  {
    label: 'Delete',
    icon: 'trash-2',
    color: 'danger',
    action: items => console.debug(`Delete ${items.length} items`),
  },
  {
    label: 'Export',
    icon: 'download',
    action: items => console.debug(`Export ${items.length} items`),
  },
]

const meta = {
  title: 'UI/AsyncDataTable',
  component: AsyncDataTable as any,
  argTypes: {
    columns: { control: 'object' },
    fetchMethod: { control: false },
    autoFetch: { control: 'boolean' },
    data: { control: 'object' },
    filters: { control: 'object' },
    showTopToolbar: { control: 'boolean' },
    showBottomToolbar: { control: 'boolean' },
    pageSizeOptions: { control: 'object' },
    showPagination: { control: 'boolean' },
    selectable: { control: 'boolean' },
    batchActions: { control: 'object' },
    selection: { control: 'object' },
  },
  args: {
    columns,
    fetchMethod: mockFetch,
    autoFetch: true,
    data: [],
    filters: undefined,
    showTopToolbar: undefined,
    showBottomToolbar: true,
    pageSizeOptions: [ 10, 20, 50 ],
    showPagination: true,
    selectable: false,
    batchActions: [],
    selection: [],
  },
  render: args => ({
    components: { AsyncDataTable },
    setup: () => ({ args }),
    template: '<AsyncDataTable v-bind="args" />',
  }),
} satisfies Meta<typeof AsyncDataTable>

export default meta
type Story = StoryObj<typeof meta>

/** Async fetch with pagination, sorting, page size selector */
export const Default: Story = {}

/** Batch actions with row selection and dual toolbars */
export const WithBatchActions: Story = {
  render: () => ({
    components: { AsyncDataTable },
    setup () {
      const selection = ref<User[]>([])
      return { columns, mockFetch, selection, batchActions }
    },
    template: `
      <AsyncDataTable
        :columns="columns"
        :fetchMethod="mockFetch"
        :batchActions="batchActions"
        v-model:selection="selection"
        showTopToolbar
      />
      <div class="mt-2 text-sm text-muted-foreground">
        Selected: {{ selection.length > 0 ? selection.map(r => r.name).join(', ') : 'none' }}
      </div>
    `,
  }),
}

/** Custom toolbar slot with action button */
export const WithCustomToolbar: Story = {
  render: () => ({
    components: { AsyncDataTable },
    setup: () => ({ columns, mockFetch }),
    template: `
      <AsyncDataTable
        :columns="columns"
        :fetchMethod="mockFetch"
        showTopToolbar
      >
        <template #toolbar>
          <button class="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">
            + Add User
          </button>
        </template>
      </AsyncDataTable>
    `,
  }),
}
