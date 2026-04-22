<script setup lang="ts" generic="TData extends Record<string, any>">
import { useResizeObserver } from '@vueuse/core'
import { get } from 'lodash-es'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/table'
import type {
  DataTableColumn,
  DataTableProps,
} from './types'

type FrozenShadow = 'left' | 'right'

const props = withDefaults(defineProps<DataTableProps<TData>>(), {
  data: () => [],
  columns: () => [],
  selectionMode: undefined,
  sortBy: undefined,
  sortOrder: undefined,
  loading: false,
})

const emit = defineEmits<{
  'update:sortBy': [value: string | null]
  'update:sortOrder': [value: number | null]
}>()

const selection = defineModel<TData | TData[] | null>('selection', { default: null })

defineSlots<
  Record<string, (_: {
    column: DataTableColumn
    row: TData
    value: unknown
    index: number
  }) => any> & {
    empty?: () => any
    footer?: () => any
  } & Record<`header-${string}`, (_: { column: DataTableColumn }) => any>
>()

const T = useTranslations('components.ui.DataTable')
const { formatDateTime } = useDate()

// -- Selection --

const showSelectionColumn = computed(() => !!props.selectionMode)

// Set of raw references for O(1) lookup, centralizes toRaw conversion
const selectedSet = computed(() => {
  if (!Array.isArray(selection.value)) return new Set<TData>()
  return new Set(selection.value.map(r => toRaw(r) as TData))
})

// Header "select all" checkbox
const allChecked = computed({
  get () {
    if (!props.data?.length) return false
    const size = selectedSet.value.size
    if (size === props.data.length) return true
    if (size > 0) return 'indeterminate' as const
    return false
  },
  set (val: boolean | 'indeterminate') {
    selection.value = val === true ? [ ...props.data ] : []
  },
})

function isRowSelected (row: TData): boolean {
  if (props.selectionMode === 'multiple') {
    return selectedSet.value.has(toRaw(row))
  }
  return toRaw(selection.value) === toRaw(row)
}

function toggleRow (row: TData) {
  const rawRow = toRaw(row) as TData
  if (props.selectionMode === 'single') {
    selection.value = isRowSelected(row) ? null : rawRow
  } else if (props.selectionMode === 'multiple') {
    const set = new Set(selectedSet.value)
    set.has(rawRow) ? set.delete(rawRow) : set.add(rawRow)
    selection.value = [ ...set ]
  }
}

// -- Sorting --
// Sort cycle: null → asc(1) → desc(-1) → null (removable sort)

function handleSort (column: DataTableColumn) {
  if (!column.sortable) return

  if (props.sortBy !== column.field) {
    emit('update:sortBy', column.field)
    emit('update:sortOrder', 1)
  } else if (props.sortOrder === 1) {
    emit('update:sortOrder', -1)
  } else {
    emit('update:sortBy', null)
    emit('update:sortOrder', null)
  }
}

function getSortIcon (column: DataTableColumn): string | null {
  if (!column.sortable) return null
  if (props.sortBy !== column.field) return 'arrow-up-down'
  return props.sortOrder === 1 ? 'arrow-up' : 'arrow-down'
}

// -- Cell formatting --

function formatCellValue (value: unknown, column: DataTableColumn): string {
  if (value === null || value === undefined) return ''

  switch (column.type) {
    case 'date':
      return formatDateTime(value as string | Date).split(' ').join('\n')

    case 'unixDate':
      return formatDateTime((value as number) * 1000).split(' ').join('\n')

    case 'currency':
      return formatCurrency(value as number | string, column.currency ?? 'JPY')

    case 'empty':
      return ''

    default:
      return String(value)
  }
}

// -- Column styles --

const totalColumns = computed(() =>
  props.columns.length + (showSelectionColumn.value ? 1 : 0),
)

// -- Scroll & frozen column state --

const tableRef = ref<InstanceType<typeof Table>>()
const scrollEl = ref<HTMLElement>()
const headerRowEl = ref<HTMLElement>()
const { atStart, atEnd } = useScrollState(scrollEl, 'horizontal')
useResizeObserver(headerRowEl, measureFrozenOffsets)

// Frozen column offsets: measured from rendered header cells
const frozenOffsets = ref(new Map<string, string>())

onMounted(() => {
  const root = tableRef.value?.$el as HTMLElement | undefined
  scrollEl.value = root ?? undefined
  headerRowEl.value = root?.querySelector<HTMLElement>('thead tr') ?? undefined
  nextTick(measureFrozenOffsets)
})

function measureFrozenOffsets () {
  const row = headerRowEl.value
  if (!row) return

  const cells = Array.from(row.querySelectorAll<HTMLElement>('th'))
  const offsets = new Map<string, string>()
  const cols = props.columns
  const selOffset = showSelectionColumn.value ? 1 : 0

  // Left-fixed: accumulate from left (start after selection column if present)
  let left = selOffset ? (cells[0]?.offsetWidth ?? 0) : 0
  for (let i = 0; i < cols.length; i++) {
    if (cols[i]!.fixed !== 'left') break
    offsets.set(cols[i]!.field, `${left}px`)
    left += cells[i + selOffset]?.offsetWidth ?? 0
  }

  // Right-fixed: accumulate from right
  let right = 0
  for (let i = cols.length - 1; i >= 0; i--) {
    const col = cols[i]!
    if (col.fixed !== 'right') break
    offsets.set(col.field, `${right}px`)
    right += cells[i + selOffset]?.offsetWidth ?? 0
  }

  frozenOffsets.value = offsets
}

// Compute edge frozen columns for shadow effect
const lastLeftFrozenField = computed(() =>
  props.columns.findLast(c => c.fixed === 'left')?.field ?? null,
)

const firstRightFrozenField = computed(() =>
  props.columns.find(c => c.fixed === 'right')?.field ?? null,
)

function buildColumnClass (column: DataTableColumn, headerIndex?: number): string {
  const isHeader = headerIndex !== undefined
  const hasDivider = isHeader && headerIndex < props.columns.length - 1

  return cn(
    column.align === 'center' && 'text-center',
    column.align === 'right' && 'text-right',
    // Header-specific
    isHeader && column.sortable && `
      cursor-pointer select-none
      hover:text-foreground
    `,
    hasDivider && headerDividerClass,
    // Fixed column last — sticky overrides relative via tailwind-merge
    column.fixed && 'sticky z-10',
  )
}

function buildFrozenShadow (column: DataTableColumn): FrozenShadow | undefined {
  if (column.field === lastLeftFrozenField.value && !atStart.value) return 'left'
  if (column.field === firstRightFrozenField.value && !atEnd.value) return 'right'
  return undefined
}

function buildColumnStyle (column: DataTableColumn): Record<string, string> {
  const style: Record<string, string> = {}
  if (column.width) style.width = column.width
  if (column.minWidth) style.minWidth = column.minWidth

  if (column.type === 'date' || column.type === 'unixDate') {
    style.whiteSpace = 'pre'
  } else if (!column.wrap) {
    style.whiteSpace = 'nowrap'
  }

  // Frozen column offset
  const offset = frozenOffsets.value.get(column.field)
  if (offset !== undefined) {
    if (column.fixed === 'left') style.left = offset
    else if (column.fixed === 'right') style.right = offset
  }

  return style
}

// Reusable class fragments
const headerCellClass = 'h-auto bg-border px-4 py-3 text-xs font-normal text-foreground'
const headerDividerClass = 'relative after:absolute after:top-1/2 after:right-0 after:h-4 after:w-px after:-translate-y-1/2 after:bg-muted-foreground/25'
const stickyLeftClass = 'sticky left-0 z-10'

const selectionColumnClass = '[&:has([role=checkbox])]:pr-4'
const selectionColumnStyle = { width: '1%' }
const selectionColumnShadowDir = computed<FrozenShadow | undefined>(() =>
  showSelectionColumn.value && !lastLeftFrozenField.value && !atStart.value ? 'left' : undefined,
)
</script>

<template>
  <div
    :class="cn('relative rounded-lg bg-border px-1 text-foreground', !$slots.footer && `
      pb-1
    `)"
  >
    <!-- Loading overlay -->
    <Transition
      enterActiveClass="transition-opacity duration-200"
      leaveActiveClass="transition-opacity duration-200"
      enterFromClass="opacity-0"
      leaveToClass="opacity-0"
    >
      <div
        v-if="loading"
        class="
          absolute inset-0 z-20 flex items-center justify-center rounded-lg
          bg-background/60
        "
      >
        <Icon
          name="loader-circle"
          class="size-6 animate-spin text-muted-foreground"
        />
      </div>
    </Transition>

    <Table ref="tableRef">
      <TableHeader>
        <TableRow
          class="hover:bg-transparent"
        >
          <!-- Selection header -->
          <TableHead
            v-if="showSelectionColumn"
            :class="cn(headerCellClass, headerDividerClass, stickyLeftClass, selectionColumnClass)"
            :style="selectionColumnStyle"
            :data-shadow="selectionColumnShadowDir"
          >
            <Checkbox
              v-if="selectionMode === 'multiple'"
              v-model="allChecked"
              class="bg-background"
            />
          </TableHead>

          <!-- Column headers -->
          <TableHead
            v-for="(column, colIndex) in columns"
            :key="column.field"
            :class="cn(headerCellClass, buildColumnClass(column, colIndex))"
            :style="buildColumnStyle(column)"
            :data-shadow="buildFrozenShadow(column)"
            @click="handleSort(column)"
          >
            <slot
              :name="`header-${column.field}`"
              :column="column"
            >
              <div
                :class="cn(
                  'flex items-center gap-1',
                  column.align === 'center' && 'justify-center',
                  column.align === 'right' && 'justify-end',
                )"
              >
                <span>{{ column.title }}</span>
                <Icon
                  v-if="getSortIcon(column)"
                  :name="getSortIcon(column)!"
                  :class="cn(
                    'size-3 shrink-0',
                    sortBy === column.field ? 'text-foreground' : `
                      text-muted-foreground
                    `,
                  )"
                />
              </div>
            </slot>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody
        class="
          [&_td]:px-4 [&_td]:py-2 [&_td]:text-card-foreground
          [&_tr]:h-15
        "
      >
        <template v-if="data?.length">
          <TableRow
            v-for="(row, index) in data"
            :key="index"
            :class="showSelectionColumn && 'cursor-pointer'"
            :data-state="isRowSelected(row) ? 'selected' : undefined"
            @click="showSelectionColumn && toggleRow(row)"
          >
            <!-- Selection cell: stop click to prevent double toggle with row click -->
            <TableCell
              v-if="showSelectionColumn"
              :class="cn(stickyLeftClass, selectionColumnClass)"
              :style="selectionColumnStyle"
              :data-shadow="selectionColumnShadowDir"
              @click.stop
            >
              <Checkbox
                :modelValue="isRowSelected(row)"
                class="bg-muted-foreground/15"
                @update:modelValue="toggleRow(row)"
              />
            </TableCell>

            <!-- Data cells -->
            <TableCell
              v-for="column in columns"
              :key="column.field"
              :class="buildColumnClass(column)"
              :style="buildColumnStyle(column)"
              :data-shadow="buildFrozenShadow(column)"
            >
              <slot
                :name="column.field"
                :column="column"
                :row="row"
                :value="get(row, column.field)"
                :index="index"
              >
                <span
                  v-if="!formatCellValue(get(row, column.field), column) && column.type !== 'empty'"
                  class="
                    inline-block h-0.5 w-2.5 rounded-full bg-muted-foreground/50
                    align-middle
                  "
                />
                <template v-else>
                  {{ formatCellValue(get(row, column.field), column) }}
                </template>
              </slot>
            </TableCell>
          </TableRow>
        </template>

        <template v-else>
          <TableEmpty :colspan="totalColumns">
            <slot name="empty">
              <div
                class="flex flex-col items-center gap-2 text-muted-foreground"
              >
                <Icon
                  name="inbox"
                  class="size-8"
                />
                <span class="text-sm">
                  {{ T('empty') }}
                </span>
              </div>
            </slot>
          </TableEmpty>
        </template>
      </TableBody>

      <TableFooter
        v-if="$slots.footer"
        class="border-t-0 bg-transparent"
      >
        <slot name="footer" />
      </TableFooter>
    </Table>
  </div>
</template>

<style scoped>
/* CSS variable on tr, background on td — sticky cells need opaque bg */
:deep(tbody tr) {
  --cell-bg: var(--color-card);
  --corner-r: 8px;
}

:deep(tbody tr:hover) {
  --cell-bg: var(--color-muted);
}

:deep(tbody td) {
  background: var(--cell-bg);
}

/* Rounded corners: radial-gradient positioned at each corner,
   transparent circle inside reveals cell-bg, accent fills the corner gap */
:deep(tbody tr:first-child td:first-child) {
  background:
    radial-gradient(circle at var(--corner-r) var(--corner-r), transparent var(--corner-r), var(--color-accent) var(--corner-r)) 0 0 / var(--corner-r) var(--corner-r) no-repeat,
    var(--cell-bg);
}

:deep(tbody tr:first-child td:last-child) {
  background:
    radial-gradient(circle at 0 var(--corner-r), transparent var(--corner-r), var(--color-accent) var(--corner-r)) 100% 0 / var(--corner-r) var(--corner-r) no-repeat,
    var(--cell-bg);
}

:deep(tbody tr:last-child td:first-child) {
  background:
    radial-gradient(circle at var(--corner-r) 0, transparent var(--corner-r), var(--color-accent) var(--corner-r)) 0 100% / var(--corner-r) var(--corner-r) no-repeat,
    var(--cell-bg);
}

:deep(tbody tr:last-child td:last-child) {
  background:
    radial-gradient(circle at 0 0, transparent var(--corner-r), var(--color-accent) var(--corner-r)) 100% 100% / var(--corner-r) var(--corner-r) no-repeat,
    var(--cell-bg);
}

/* Single row: combine top + bottom gradients */
:deep(tbody tr:first-child:last-child td:first-child) {
  background:
    radial-gradient(circle at var(--corner-r) var(--corner-r), transparent var(--corner-r), var(--color-accent) var(--corner-r)) 0 0 / var(--corner-r) var(--corner-r) no-repeat,
    radial-gradient(circle at var(--corner-r) 0, transparent var(--corner-r), var(--color-accent) var(--corner-r)) 0 100% / var(--corner-r) var(--corner-r) no-repeat,
    var(--cell-bg);
}

:deep(tbody tr:first-child:last-child td:last-child) {
  background:
    radial-gradient(circle at 0 var(--corner-r), transparent var(--corner-r), var(--color-accent) var(--corner-r)) 100% 0 / var(--corner-r) var(--corner-r) no-repeat,
    radial-gradient(circle at 0 0, transparent var(--corner-r), var(--color-accent) var(--corner-r)) 100% 100% / var(--corner-r) var(--corner-r) no-repeat,
    var(--cell-bg);
}

/* Frozen column shadow via ::before — ::after is reserved for header divider */
:deep([data-shadow])::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  pointer-events: none;
}

:deep([data-shadow="left"])::before {
  right: -8px;
  box-shadow: inset 4px 0 8px -4px rgba(0, 0, 0, 0.15);
}

:deep([data-shadow="right"])::before {
  left: -8px;
  box-shadow: inset -4px 0 8px -4px rgba(0, 0, 0, 0.15);
}
</style>
