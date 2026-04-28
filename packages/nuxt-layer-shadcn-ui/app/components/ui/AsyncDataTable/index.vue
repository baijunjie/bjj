<script setup lang="ts" generic="TData extends Record<string, any>">
import type {
  AsyncDataTableFetchParams,
  AsyncDataTableProps,
} from './types'

interface AsyncDataTablePagination {
  page: number
  size: number
  total: number
}

const props = withDefaults(defineProps<AsyncDataTableProps<TData>>(), {
  columns: () => [],
  fetchMethod: undefined,
  autoFetch: true,
  data: () => [],
  filters: undefined,
  showTopToolbar: undefined,
  showBottomToolbar: true,
  pageSizeOptions: () => [ 10, 20, 50, 100 ],
  showPagination: true,
  selectable: false,
  clickable: false,
  batchActions: () => [],
  selection: () => [],
})

const emit = defineEmits<{
  'update:filters': [filters: Record<string, any>]
  'update:selection': [value: TData[]]
  'rowClick': [row: TData, index: number, event: MouseEvent]
}>()

const T = useTranslations('components.ui.AsyncDataTable')
const { isMobile } = useDevice()

// -- Selection --

const selectionValue = computed(() => props.selection ?? [])

function onSelectionChange (value: TData | TData[] | null) {
  emit('update:selection', Array.isArray(value) ? value : value ? [ value ] : [])
}

// -- Internal state --

const loading = ref(false)
const internalData = ref<TData[]>([]) as Ref<TData[]>
const requestVersion = ref(0)

const pagination = ref<AsyncDataTablePagination>({
  page: Number(props.filters?.page) || 1,
  size: Number(props.filters?.size) || props.pageSizeOptions[0] || 10,
  total: 0,
})

const sortState = ref<{ sortBy: string | null, sortOrder: number | null }>({
  sortBy: props.filters?.sortBy ? String(props.filters.sortBy) : null,
  sortOrder: props.filters?.sortOrder ? Number(props.filters.sortOrder) : null,
})

// -- Computed --

const useFetchMode = computed(() => !!props.fetchMethod)
const tableData = computed(() => useFetchMode.value ? internalData.value : props.data)

const showSelectionColumn = computed(() => props.selectable || props.batchActions.length > 0)
const selectedCount = computed(() => props.selection?.length ?? 0)
const hasBatchActions = computed(() => props.batchActions.length > 0)
const batchActionsDisabled = computed(() => selectedCount.value === 0)

const hasPaginationData = computed(() => pagination.value.total > 0)

const shouldShowTopToolbar = computed(() => {
  if (props.showTopToolbar !== undefined) return props.showTopToolbar
  return pagination.value.size >= 50
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

// -- Data fetching --

async function fetchData (page?: number, forceRefresh = false) {
  if (!props.fetchMethod) return
  if (loading.value && !forceRefresh) return

  const currentVersion = ++requestVersion.value

  if (page !== undefined) {
    pagination.value.page = page
  }

  loading.value = true
  try {
    const result = await props.fetchMethod(buildFetchParams())
    if (currentVersion !== requestVersion.value) return

    internalData.value = result.items as TData[]
    pagination.value.total = result.total
  } catch (error) {
    if (currentVersion !== requestVersion.value) return
    console.error('AsyncDataTable fetchData failed:', error)
  } finally {
    if (currentVersion === requestVersion.value) {
      loading.value = false
    }
  }
}

function resetPagination (overrides?: Record<string, any>) {
  pagination.value.page = 1
  pagination.value.total = 0
  emit('update:filters', getFilters(overrides))
  fetchData(undefined, true)
}

// -- Internal helpers --

function getFilters (overrides?: Record<string, any>): Record<string, any> {
  return {
    ...(props.filters ?? {}),
    ...overrides,
    page: pagination.value.page,
    size: pagination.value.size,
    sortBy: sortState.value.sortBy,
    sortOrder: sortState.value.sortOrder,
  }
}

function buildFetchParams (): AsyncDataTableFetchParams {
  const filters = getFilters()
  const { page, size, ...rest } = filters
  return {
    offset: (Number(page) - 1) * Number(size),
    limit: Number(size),
    ...rest,
  }
}

// -- Event handlers --

function onPageChange (newPage: number) {
  if (newPage === pagination.value.page) return
  pagination.value.page = newPage
  emit('update:filters', getFilters())
  fetchData()
}

function onPageSizeChange (newSize: number) {
  if (newSize === pagination.value.size) return
  pagination.value.size = newSize
  pagination.value.page = 1
  emit('update:filters', getFilters())
  fetchData(undefined, true)
}

// Batch sort updates: DataTable emits sortBy and sortOrder separately but synchronously
let sortUpdatePending = false

function onSortByUpdate (value: string | null) {
  sortState.value.sortBy = value
  scheduleAfterSort()
}

function onSortOrderUpdate (value: number | null) {
  sortState.value.sortOrder = value
  scheduleAfterSort()
}

function scheduleAfterSort () {
  if (sortUpdatePending) return
  sortUpdatePending = true
  nextTick(() => {
    sortUpdatePending = false
    pagination.value.page = 1
    emit('update:filters', getFilters())
    fetchData(1, true)
  })
}

// -- Expose --

defineExpose({
  fetchData,
  resetPagination,
})

// -- Lifecycle --

onMounted(() => {
  emit('update:filters', getFilters())
  if (props.autoFetch) {
    fetchData()
  }
})
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
        :total="pagination.total"
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
      :loading="loading"
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
        :total="pagination.total"
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
