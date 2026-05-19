<script setup lang="ts" generic="TData extends Record<string, any>">
import type { StaticDataTableProps, StaticDataTableSortMethod } from './types'

interface StaticDataTablePagination {
  page: number
  size: number
}

const props = withDefaults(defineProps<StaticDataTableProps<TData>>(), {
  data: () => [],
  columns: () => [],
  sortMethod: undefined,
  showTopToolbar: undefined,
  topToolbarThreshold: 50,
  showBottomToolbar: true,
  pageSizeOptions: () => [ 10, 20, 50, 100 ],
  showPagination: true,
  selectable: false,
  clickable: false,
  batchActions: () => [],
  selection: () => [],
})

const emit = defineEmits<{
  'update:selection': [value: TData[]]
  'rowClick': [row: TData, index: number, event: MouseEvent]
}>()

const T = useTranslations('components.ui.StaticDataTable')
const { isMobile } = useDevice()

// -- Selection --

const selectionValue = computed(() => props.selection ?? [])

function onSelectionChange (value: TData | TData[] | null) {
  emit('update:selection', Array.isArray(value) ? value : value ? [ value ] : [])
}

// -- Internal state --

const pagination = ref<StaticDataTablePagination>({
  page: 1,
  size: props.pageSizeOptions[0] || 10,
})

const sortState = ref<{ sortBy: string | null, sortOrder: 1 | -1 | null }>({
  sortBy: null,
  sortOrder: null,
})

// -- Sorting + pagination --

const defaultSort: StaticDataTableSortMethod<TData> = (items, sortBy, sortOrder) => {
  return [ ...items ].sort((a, b) => {
    const av = a[sortBy]
    const bv = b[sortBy]
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * sortOrder
    }
    return String(av).localeCompare(String(bv)) * sortOrder
  })
}

const sortedData = computed<TData[]>(() => {
  const { sortBy, sortOrder } = sortState.value
  if (!sortBy || !sortOrder) return props.data
  const sortFn = props.sortMethod ?? defaultSort
  return sortFn(props.data, sortBy, sortOrder)
})

const totalCount = computed(() => sortedData.value.length)

const tableData = computed<TData[]>(() => {
  if (!props.showPagination) return sortedData.value
  const start = (pagination.value.page - 1) * pagination.value.size
  return sortedData.value.slice(start, start + pagination.value.size)
})

// Reset to page 1 when the underlying data shape or sort changes so the
// pagination state stays consistent with what's actually shown.
watch(
  [ () => props.data, () => sortState.value.sortBy, () => sortState.value.sortOrder ],
  () => {
    pagination.value.page = 1
  },
)

// -- Toolbar / batch actions --

const showSelectionColumn = computed(() => props.selectable || props.batchActions.length > 0)
const selectedCount = computed(() => props.selection?.length ?? 0)
const hasBatchActions = computed(() => props.batchActions.length > 0)
const batchActionsDisabled = computed(() => selectedCount.value === 0)

const hasPaginationData = computed(() => totalCount.value > 0)

const shouldShowTopToolbar = computed(() => {
  if (props.showTopToolbar !== undefined) return props.showTopToolbar
  return pagination.value.size >= props.topToolbarThreshold
})

const shouldShowBottomToolbar = computed(() => props.showBottomToolbar)

const batchMenuItems = computed<DropdownItem[]>(() =>
  props.batchActions.map(item => {
    if (item.type === 'separator' || item.type === 'label') {
      return item
    }
    const { action, disabled, ...rest } = item
    return {
      ...rest,
      disabled: disabled || batchActionsDisabled.value,
      command: () => action?.(props.selection ?? []),
    }
  }),
)

// -- Event handlers --

function onPageChange (newPage: number) {
  if (newPage === pagination.value.page) return
  pagination.value.page = newPage
}

function onPageSizeChange (newSize: number) {
  if (newSize === pagination.value.size) return
  pagination.value.size = newSize
  pagination.value.page = 1
}

function onSortByUpdate (value: string | null) {
  sortState.value.sortBy = value
}

function onSortOrderUpdate (value: number | null) {
  sortState.value.sortOrder = value as 1 | -1 | null
}
</script>

<template>
  <div>
    <!-- Top toolbar -->
    <div
      v-if="shouldShowTopToolbar && (!!$slots.toolbar || hasBatchActions || (showPagination && hasPaginationData))"
      class="mb-4 gap-4 flex flex-wrap items-center justify-between"
    >
      <div class="gap-2 flex items-center">
        <Dropdown
          v-if="hasBatchActions"
          :menus="batchMenuItems"
          trigger="click"
        >
          <Button
            :variant="batchActionsDisabled ? 'outline' : 'default'"
            :size="isMobile ? 'sm' : 'default'"
            :disabled="batchActionsDisabled"
          >
            {{ T('actions') }} ({{ selectedCount }})
            <Icon
              name="chevron-down"
              class="size-4"
            />
          </Button>
        </Dropdown>
        <slot name="toolbar" />
      </div>

      <Pagination
        v-if="showPagination"
        :page="pagination.page"
        :total="totalCount"
        :pageSize="pagination.size"
        :pageSizeOptions="pageSizeOptions"
        :simple="isMobile"
        :size="isMobile ? 'sm' : 'default'"
        @update:page="onPageChange"
        @update:pageSize="onPageSizeChange"
      />
    </div>

    <!-- DataTable -->
    <DataTable
      :selection="selectionValue"
      :data="tableData"
      :columns="columns"
      :selectionMode="showSelectionColumn ? 'multiple' : undefined"
      :clickable="clickable"
      :sortBy="sortState.sortBy"
      :sortOrder="sortState.sortOrder"
      @update:selection="onSelectionChange"
      @update:sortBy="onSortByUpdate"
      @update:sortOrder="onSortOrderUpdate"
      @rowClick="(row: TData, index: number, event: MouseEvent) => emit('rowClick', row, index, event)"
    >
      <template
        v-for="name in Object.keys($slots).filter(n => n !== 'toolbar')"
        :key="name"
        #[name]="slotData"
      >
        <slot
          :name="name"
          v-bind="slotData ?? {}"
        />
      </template>
    </DataTable>

    <!-- Bottom toolbar -->
    <div
      v-if="shouldShowBottomToolbar && (!!$slots.toolbar || hasBatchActions || (showPagination && hasPaginationData))"
      class="mt-4 gap-4 flex flex-wrap items-center justify-between"
    >
      <div class="gap-2 flex items-center">
        <Dropdown
          v-if="hasBatchActions"
          :menus="batchMenuItems"
          trigger="click"
        >
          <Button
            :variant="batchActionsDisabled ? 'outline' : 'default'"
            :size="isMobile ? 'sm' : 'default'"
            :disabled="batchActionsDisabled"
          >
            {{ T('actions') }} ({{ selectedCount }})
            <Icon
              name="chevron-down"
              class="size-4"
            />
          </Button>
        </Dropdown>
        <slot name="toolbar" />
      </div>

      <Pagination
        v-if="showPagination"
        :page="pagination.page"
        :total="totalCount"
        :pageSize="pagination.size"
        :pageSizeOptions="pageSizeOptions"
        :simple="isMobile"
        :size="isMobile ? 'sm' : 'default'"
        @update:page="onPageChange"
        @update:pageSize="onPageSizeChange"
      />
    </div>
  </div>
</template>
