<script setup lang="ts" generic="TData extends Record<string, any>">
import type { InfiniteDataTableFetchParams, InfiniteDataTableProps } from './types'

const props = withDefaults(defineProps<InfiniteDataTableProps<TData>>(), {
  columns: () => [],
  fetchMethod: undefined,
  autoFetch: true,
  filters: undefined,
  pageSize: 30,
  height: undefined,
  clickable: false,
})

const emit = defineEmits<{
  'update:filters': [filters: Record<string, any>]
  'rowClick': [row: TData, index: number, event: MouseEvent]
}>()

const T = useTranslations('components.ui.InfiniteDataTable')

// -- Internal state --

const loading = ref(false)
const internalData = ref<TData[]>([]) as Ref<TData[]>
const next = ref<string | undefined>(undefined)
const hasMore = ref(true)
const total = ref<number | undefined>(undefined)
const requestVersion = ref(0)

const sortState = ref<{ sortBy: string | null, sortOrder: number | null }>({
  sortBy: props.filters?.sortBy ? String(props.filters.sortBy) : null,
  sortOrder: props.filters?.sortOrder ? Number(props.filters.sortOrder) : null,
})

const isInitialLoad = computed(() => loading.value && internalData.value.length === 0)

// -- IntersectionObserver root: only when internal scroll is active --

const dataTableRef = ref<{ scrollEl?: HTMLElement } | null>(null)
const intersectionOptions = computed<IntersectionObserverInit | undefined>(() => { // eslint-disable-line no-undef
  if (!props.height) return undefined
  const root = dataTableRef.value?.scrollEl
  return root ? { root } : undefined
})

// -- Helpers --

function getFilters (): Record<string, any> {
  return {
    ...(props.filters ?? {}),
    sortBy: sortState.value.sortBy,
    sortOrder: sortState.value.sortOrder,
  }
}

function buildFetchParams (): InfiniteDataTableFetchParams {
  return {
    ...getFilters(),
    next: next.value,
    limit: props.pageSize,
  }
}

function resetState () {
  internalData.value = []
  next.value = undefined
  hasMore.value = true
  total.value = undefined
}

// -- Loading --

async function loadMore () {
  if (!props.fetchMethod) return
  if (loading.value || !hasMore.value) return

  const currentVersion = ++requestVersion.value
  loading.value = true
  try {
    const result = await props.fetchMethod(buildFetchParams())
    if (currentVersion !== requestVersion.value) return

    internalData.value = [ ...internalData.value, ...result.items ]
    if (result.total != null) total.value = result.total
    next.value = result.next
    hasMore.value = !!result.next
  } catch (error) {
    if (currentVersion !== requestVersion.value) return
    console.error('InfiniteDataTable loadMore failed:', error)
  } finally {
    if (currentVersion === requestVersion.value) loading.value = false
  }
}

async function refresh () {
  resetState()
  emit('update:filters', getFilters())
  await loadMore()
}

function scrollToTop () {
  const el = dataTableRef.value?.scrollEl
  if (!el) return
  if (el.scrollHeight > el.clientHeight) {
    el.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// -- Sort: incremental loading requires a full reset on sort change --

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
    refresh()
  })
}

// -- External filters: any change resets and reloads --

watch(() => props.filters, (newVal, oldVal) => {
  if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return
  refresh()
}, { deep: true })

// -- Expose --

defineExpose({
  refresh,
  loadMore,
  scrollToTop,
})

// -- Lifecycle --

onMounted(() => {
  emit('update:filters', getFilters())
  if (props.autoFetch) loadMore()
})
</script>

<template>
  <DataTable
    ref="dataTableRef"
    :data="internalData"
    :columns
    :height
    :loading="isInitialLoad"
    :clickable
    :sortBy="sortState.sortBy"
    :sortOrder="sortState.sortOrder"
    @update:sortBy="onSortByUpdate"
    @update:sortOrder="onSortOrderUpdate"
    @rowClick="(row, i, e) => emit('rowClick', row as TData, i, e)"
  >
    <template
      v-for="name in Object.keys($slots).filter(n => n !== 'bodyEnd' && n !== 'footer')"
      :key="name"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData ?? {}"
      />
    </template>

    <template
      v-if="hasMore || internalData.length > 0"
      #bodyEnd
    >
      <div
        v-if="!hasMore"
        class="py-2 text-xs text-muted-foreground text-center"
      >
        {{ T('allLoaded') }}
      </div>
      <EffectIntersectionChecker
        v-else-if="!isInitialLoad"
        :disabled="loading"
        :options="intersectionOptions"
        class="py-2 flex items-center justify-center"
        @show="loadMore"
      >
        <Icon
          name="loader-circle"
          class="size-4 animate-spin text-muted-foreground"
        />
      </EffectIntersectionChecker>
    </template>

    <template #footer>
      <slot name="footer">
        <div class="gap-2 text-xs flex items-center justify-between">
          <div class="gap-2 flex items-center">
            <Tooltip :text="T('scrollToTop')">
              <Button
                variant="ghost"
                size="icon-sm"
                icon="arrow-up-to-line"
                :disabled="loading || internalData.length === 0"
                @click="scrollToTop"
              />
            </Tooltip>
            <Tooltip :text="T('refresh')">
              <Button
                variant="ghost"
                size="icon-sm"
                icon="rotate-cw"
                :disabled="loading"
                @click="refresh"
              />
            </Tooltip>
          </div>
          <span
            v-if="total != null"
            class="text-muted-foreground"
          >
            {{ T('count', { loaded: internalData.length, total }) }}
          </span>
        </div>
      </slot>
    </template>
  </DataTable>
</template>
