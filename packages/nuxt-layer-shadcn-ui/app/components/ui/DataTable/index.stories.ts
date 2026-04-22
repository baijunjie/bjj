import type { Meta, StoryObj } from '@storybook/vue3'
import type { DataTableColumn } from './types'
import DataTableRaw from './index.vue'

// Cast generic component for Storybook compatibility
const DataTable = DataTableRaw as any

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  amount: number
  createdAt: string
}

const sampleData: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin', status: 'active', amount: 1234.56, createdAt: '2024-01-15T10:30:00Z' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User', status: 'active', amount: 789.0, createdAt: '2024-02-20T14:15:00Z' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'Editor', status: 'inactive', amount: 2345.67, createdAt: '2024-03-10T09:00:00Z' },
  { id: 4, name: 'Diana', email: 'diana@example.com', role: 'Admin', status: 'active', amount: 456.78, createdAt: '2024-04-05T16:45:00Z' },
  { id: 5, name: 'Eve', email: 'eve@example.com', role: 'User', status: 'inactive', amount: 3456.89, createdAt: '2024-05-12T11:20:00Z' },
]

const basicColumns: DataTableColumn[] = [
  { field: 'name', title: 'Name', width: '120px' },
  { field: 'email', title: 'Email', minWidth: '200px' },
  { field: 'role', title: 'Role', width: '100px' },
  { field: 'status', title: 'Status', width: '100px' },
]

const meta = {
  title: 'UI/DataTable',
  component: DataTable,
  argTypes: {
    loading: { control: 'boolean' },
  },
  args: {
    loading: false,
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { DataTable },
    setup () {
      const singleSelection = ref(null)
      const multipleSelection = ref([])
      const sortBy = ref<string | null>(null)
      const sortOrder = ref<number | null>(null)

      const sortableColumns: DataTableColumn[] = [
        { field: 'name', title: 'Name', width: '120px', sortable: true },
        { field: 'email', title: 'Email', minWidth: '200px' },
        { field: 'role', title: 'Role', width: '100px', sortable: true },
        { field: 'amount', title: 'Amount', width: '120px', type: 'currency', sortable: true },
        { field: 'createdAt', title: 'Created', width: '140px', type: 'date', sortable: true },
      ]

      const sortedData = computed(() => {
        if (!sortBy.value || !sortOrder.value) return sampleData
        return [ ...sampleData ].sort((a, b) => {
          const av = a[sortBy.value as keyof User]
          const bv = b[sortBy.value as keyof User]
          if (av < bv) return -1 * sortOrder.value!
          if (av > bv) return 1 * sortOrder.value!
          return 0
        })
      })

      const typeColumns: DataTableColumn[] = [
        { field: 'name', title: 'Name', width: '120px' },
        { field: 'amount', title: 'Amount', width: '120px', type: 'currency' },
        { field: 'createdAt', title: 'Date', width: '140px', type: 'date' },
        { field: 'status', title: 'Empty', width: '100px', type: 'empty' },
      ]

      const slotColumns: DataTableColumn[] = [
        { field: 'name', title: 'Name', width: '120px' },
        { field: 'email', title: 'Email', minWidth: '200px' },
        { field: 'status', title: 'Status', width: '120px' },
        { field: 'amount', title: 'Amount', width: '120px' },
      ]

      const frozenColumns: DataTableColumn[] = [
        { field: 'name', title: 'Name', width: '120px', fixed: 'left' },
        { field: 'email', title: 'Email', width: '250px', fixed: 'left' },
        { field: 'role', title: 'Role', width: '150px' },
        { field: 'status', title: 'Status', width: '150px' },
        { field: 'amount', title: 'Amount', width: '150px', type: 'currency' },
        { field: 'createdAt', title: 'Created', width: '180px', type: 'date' },
        { field: 'id', title: 'Actions', width: '100px', fixed: 'right' },
      ]

      return {
        args,
        data: sampleData,
        basicColumns,
        sortableColumns,
        typeColumns,
        slotColumns,
        frozenColumns,
        singleSelection,
        multipleSelection,
        sortBy,
        sortOrder,
        sortedData,
      }
    },
    template: `
      <div class="w-full space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <DataTable :data="data" :columns="basicColumns" v-bind="args" />
        </section>

        <!-- Single Selection -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Single Selection</h3>
          <DataTable
            :data="data"
            :columns="basicColumns"
            selectionMode="single"
            v-model:selection="singleSelection"
          />
          <div class="mt-2 text-sm text-muted-foreground">
            Selected: {{ singleSelection?.name ?? 'none' }}
          </div>
        </section>

        <!-- Multiple Selection -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Multiple Selection</h3>
          <DataTable
            :data="data"
            :columns="basicColumns"
            selectionMode="multiple"
            v-model:selection="multipleSelection"
          />
          <div class="mt-2 text-sm text-muted-foreground">
            Selected: {{ multipleSelection.length > 0 ? multipleSelection.map(r => r.name).join(', ') : 'none' }}
          </div>
        </section>

        <!-- Sortable -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Sortable Columns</h3>
          <DataTable
            :data="sortedData"
            :columns="sortableColumns"
            v-model:sortBy="sortBy"
            v-model:sortOrder="sortOrder"
          />
          <div class="mt-2 text-sm text-muted-foreground">
            Sort: {{ sortBy ?? 'none' }} / {{ sortOrder ?? 'none' }}
          </div>
        </section>

        <!-- Column Types -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Column Types (text, currency, date, empty)</h3>
          <DataTable :data="data" :columns="typeColumns" />
        </section>

        <!-- Custom Slots -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Custom Cell Slots</h3>
          <DataTable :data="data" :columns="slotColumns">
            <template #status="{ value }">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  value === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
                ]"
              >
                {{ value }}
              </span>
            </template>
            <template #amount="{ value }">
              <span class="font-mono font-medium">\${{ Number(value).toFixed(2) }}</span>
            </template>
          </DataTable>
        </section>

        <!-- Empty State -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Empty State</h3>
          <DataTable :data="[]" :columns="basicColumns" />
        </section>

        <!-- Footer Slot -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Footer Slot</h3>
          <DataTable :data="data" :columns="slotColumns">
            <template #footer>
              <tr class="h-12 border-t text-sm font-medium">
                <td class="px-4">Total</td>
                <td class="px-4" colspan="2"></td>
                <td class="px-4 font-mono">\${{ data.reduce((sum, r) => sum + r.amount, 0).toFixed(2) }}</td>
              </tr>
            </template>
          </DataTable>
        </section>

        <!-- Frozen Columns -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Frozen Columns (scroll horizontally)</h3>
          <div class="max-w-[600px]">
            <DataTable
              :data="data"
              :columns="frozenColumns"
              selectionMode="multiple"
              v-model:selection="multipleSelection"
            >
              <template #id>
                <button class="text-sm text-primary underline">Edit</button>
              </template>
            </DataTable>
          </div>
        </section>
      </div>
    `,
  }),
}
