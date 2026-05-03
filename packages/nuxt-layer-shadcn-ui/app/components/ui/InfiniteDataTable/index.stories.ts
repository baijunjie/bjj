import type { Meta, StoryObj } from '@storybook/vue3'
import type { DataTableColumn } from '../DataTable/types'
import type { InfiniteDataTableFetchParams, InfiniteDataTableFetchResult } from './types'
import InfiniteDataTable from './index.vue'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  amount: number
  createdAt: string
}

const allUsers: User[] = Array.from({ length: 120 }, (_, i) => ({
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

/** Mock fetch using offset as the opaque `next` token */
function mockFetch (params: InfiniteDataTableFetchParams): Promise<InfiniteDataTableFetchResult<User>> {
  return new Promise(resolve => {
    setTimeout(() => {
      const data = [ ...allUsers ]

      if (params.role) {
        data.splice(0, data.length, ...data.filter(u => u.role === params.role))
      }

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

      const offset = params.next ? Number(params.next) : 0
      const items = data.slice(offset, offset + params.limit)
      const nextOffset = offset + items.length
      resolve({
        items,
        next: nextOffset < data.length ? String(nextOffset) : undefined,
        total: data.length,
      })
    }, 400)
  })
}

const meta = {
  title: 'UI/InfiniteDataTable',
  component: InfiniteDataTable as any,
  argTypes: {
    columns: { control: 'object' },
    fetchMethod: { control: false },
    autoFetch: { control: 'boolean' },
    filters: { control: 'object' },
    pageSize: { control: 'number' },
    height: { control: 'text' },
    clickable: { control: 'boolean' },
  },
  args: {
    columns,
    fetchMethod: mockFetch,
    autoFetch: true,
    filters: undefined,
    pageSize: 30,
    height: '360px',
    clickable: false,
  },
  render: args => ({
    components: { InfiniteDataTable: InfiniteDataTable as any },
    setup: () => ({ args }),
    template: '<InfiniteDataTable v-bind="args" />',
  }),
} satisfies Meta<typeof InfiniteDataTable>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

/** Internal scroll container — scrolling inside the table fetches the next page */
export const Default: Story = {}

/** External `filters` changes also reset pagination — try toggling the role filter */
export const WithFilters: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <select v-model="role">
    <option value="">All</option>
    <option value="Admin">Admin</option>
    <option value="Editor">Editor</option>
    <option value="User">User</option>
  </select>
  <InfiniteDataTable
    :columns="columns"
    :fetchMethod="mockFetch"
    :filters="{ role: role || undefined }"
    height="360px"
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { InfiniteDataTable: InfiniteDataTable as any },
    setup () {
      const role = ref('')
      const filters = computed(() => ({ role: role.value || undefined }))
      return { columns, mockFetch, role, filters }
    },
    template: `
      <div class="space-y-3">
        <label class="gap-2 text-sm flex items-center">
          Role:
          <select
            v-model="role"
            class="px-2 py-1 border rounded"
          >
            <option value="">All</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="User">User</option>
          </select>
        </label>
        <InfiniteDataTable
          :columns="columns"
          :fetchMethod="mockFetch"
          :filters="filters"
          height="360px"
        />
      </div>
    `,
  }),
}

/** No fixed height — the page scrolls and triggers loading at the bottom */
export const PageScroll: Story = {
  parameters: noControls,
  args: { height: undefined },
}
