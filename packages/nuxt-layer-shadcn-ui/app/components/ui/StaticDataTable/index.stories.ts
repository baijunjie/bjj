import type { Meta, StoryObj } from '@storybook/vue3'
import type { StaticDataTableBatchAction, StaticDataTableSortMethod } from './types'
import type { DataTableColumn } from '../DataTable/types'
import StaticDataTable from './index.vue'

interface User {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'User'
  status: string
  amount: number
  createdAt: string
}

const allUsers: User[] = Array.from({ length: 85 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ([ 'Admin', 'Editor', 'User' ] as const)[i % 3]!,
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

const batchActions: StaticDataTableBatchAction<User>[] = [
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

/** Sort users by role priority (Admin → Editor → User), then by name as a stable tiebreaker. */
const rolePrioritySort: StaticDataTableSortMethod<User> = (items, sortBy, sortOrder) => {
  if (sortBy !== 'role') {
    return [ ...items ].sort((a, b) => {
      const av = a[sortBy as keyof User]
      const bv = b[sortBy as keyof User]
      if (av! < bv!) return -1 * sortOrder
      if (av! > bv!) return 1 * sortOrder
      return 0
    })
  }
  const rank: Record<User['role'], number> = { Admin: 0, Editor: 1, User: 2 }
  return [ ...items ].sort((a, b) => {
    const diff = (rank[a.role] - rank[b.role]) * sortOrder
    return diff !== 0 ? diff : a.name.localeCompare(b.name)
  })
}

const meta = {
  title: 'UI/StaticDataTable',
  component: StaticDataTable as any,
  argTypes: {
    data: { control: 'object' },
    columns: { control: 'object' },
    sortMethod: { control: false },
    showTopToolbar: { control: 'boolean' },
    topToolbarThreshold: { control: 'number' },
    showBottomToolbar: { control: 'boolean' },
    pageSizeOptions: { control: 'object' },
    showPagination: { control: 'boolean' },
    selectable: { control: 'boolean' },
    clickable: { control: 'boolean' },
    batchActions: { control: 'object' },
    selection: { control: 'object' },
  },
  args: {
    data: allUsers,
    columns,
    sortMethod: undefined,
    showTopToolbar: undefined,
    topToolbarThreshold: 50,
    showBottomToolbar: true,
    pageSizeOptions: [ 10, 20, 50 ],
    showPagination: true,
    selectable: false,
    clickable: false,
    batchActions: [],
    selection: [],
  },
  render: args => ({
    components: { StaticDataTable },
    setup: () => ({ args }),
    template: '<StaticDataTable v-bind="args" />',
  }),
} satisfies Meta<typeof StaticDataTable>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

/** Local data with header-driven sorting and built-in pagination. */
export const Default: Story = {}

/** Batch actions with row selection and dual toolbars. */
export const WithBatchActions: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <StaticDataTable
    :data="users"
    :columns="columns"
    :batchActions="batchActions"
    v-model:selection="selection"
    showTopToolbar
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { StaticDataTable },
    setup () {
      const selection = ref<User[]>([])
      return { users: allUsers, columns, selection, batchActions }
    },
    template: `
      <StaticDataTable
        :data="users"
        :columns="columns"
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

/** Custom toolbar slot with an action button. */
export const WithCustomToolbar: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <StaticDataTable :data="users" :columns="columns" showTopToolbar>
    <template #toolbar>
      <button class="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">
        + Add User
      </button>
    </template>
  </StaticDataTable>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { StaticDataTable },
    setup: () => ({ users: allUsers, columns }),
    template: `
      <StaticDataTable
        :data="users"
        :columns="columns"
        showTopToolbar
      >
        <template #toolbar>
          <button class="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">
            + Add User
          </button>
        </template>
      </StaticDataTable>
    `,
  }),
}

/** Override the default comparator — here `role` sorts by priority (Admin → Editor → User) instead of alphabetically. */
export const WithCustomSort: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <StaticDataTable
    :data="users"
    :columns="columns"
    :sortMethod="rolePrioritySort"
  />
</template>

<script setup>
const rolePrioritySort = (items, sortBy, sortOrder) => {
  if (sortBy !== 'role') return defaultGenericSort(items, sortBy, sortOrder)
  const rank = { Admin: 0, Editor: 1, User: 2 }
  return [ ...items ].sort((a, b) => {
    const diff = (rank[a.role] - rank[b.role]) * sortOrder
    return diff !== 0 ? diff : a.name.localeCompare(b.name)
  })
}
</script>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { StaticDataTable },
    setup: () => ({ users: allUsers, columns, rolePrioritySort }),
    template: `
      <StaticDataTable
        :data="users"
        :columns="columns"
        :sortMethod="rolePrioritySort"
      />
    `,
  }),
}
