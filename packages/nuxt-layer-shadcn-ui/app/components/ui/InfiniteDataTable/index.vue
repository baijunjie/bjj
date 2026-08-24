<script setup lang="ts" generic="TData extends Record<string, any>">
import type { InfiniteDataTableFetchParams, InfiniteDataTableProps } from './types'
import { useEventListener } from '@vueuse/core'

const props = withDefaults(defineProps<InfiniteDataTableProps<TData>>(), {
  columns: () => [],
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

defineSlots<{
  footer?: () => any
  bodyEnd?: () => any
  [key: string]: ((props: any) => any) | undefined
}>()

const { t } = useI18n()
const T = useTranslations('components.ui.InfiniteDataTable')

// -- Internal state --

const loading = ref(false)
const internalData = ref<TData[]>([]) as Ref<TData[]>
const cursor = ref<string | undefined>(undefined)
const hasMore = ref(true)
const errored = ref(false)
const total = ref<number | undefined>(undefined)
const requestVersion = ref(0)
// Gates the IntersectionChecker and filters watcher so `autoFetch=false` isn't bypassed.
const started = ref(false)

const sortState = ref<{ sortBy: string | null, sortOrder: number | null }>({
  sortBy: normalizeSortBy(props.filters?.sortBy),
  sortOrder: normalizeSortOrder(props.filters?.sortOrder),
})

const isInitialLoad = computed(() => loading.value && internalData.value.length === 0)

// Precise gate for the bodyEnd slot. Without this, the slot's outer v-if can
// be true while every inner branch is false, leaving Vue to register an empty
// slot — DataTable's `$slots.bodyEnd` check then renders a blank trailing row.
const showBodyEnd = computed(() => {
  if (isInitialLoad.value) return false
  if (errored.value) return true
  if (!hasMore.value) return internalData.value.length > 0
  return started.value
})

// -- IntersectionObserver root: only when internal scroll is active --

const dataTableRef = ref<{ scrollEl?: HTMLElement } | null>(null)
const scrollEl = computed<HTMLElement | undefined>(() => dataTableRef.value?.scrollEl)
const intersectionOptions = computed<IntersectionObserverInit | undefined>(() => { // eslint-disable-line no-undef
  if (!props.height) return undefined
  const root = scrollEl.value
  return root ? { root } : undefined
})

// -- Scroll-to-top availability --

const { isOverflowing, atStart } = useScrollState(scrollEl)
const isWindowAboveTable = ref(false)

function updateWindowPosition () {
  const el = scrollEl.value
  isWindowAboveTable.value = !!el && el.getBoundingClientRect().top < 0
}

useEventListener(window, 'scroll', updateWindowPosition, { passive: true })
onMounted(() => nextTick(updateWindowPosition))

const isAtTop = computed(() => isOverflowing.value ? atStart.value : !isWindowAboveTable.value)

// -- Helpers --

function getFilters (): Record<string, any> {
  return {
    ...(props.filters ?? {}),
    sortBy: sortState.value.sortBy,
    sortOrder: sortState.value.sortOrder,
  }
}

// Isolate the caller-owned part of `filters`; the component-owned keys are
// compared by value instead (see the filters watcher).
function getExternalFilters (filters: Record<string, any> | undefined) {
  if (!filters) return {}
  const { sortBy, sortOrder, ...rest } = filters
  return rest
}

function normalizeSortBy (value: unknown): string | null {
  return value ? String(value) : null
}

function normalizeSortOrder (value: unknown): number | null {
  return value ? Number(value) : null
}

// Incoming shape of the component-owned keys. A query string hands numbers back
// as strings and drops null keys, so values are coerced before they're compared:
// that's what keeps our own emits inert when they return through v-model.
// An absent key means "unspecified — keep what we have"; `sortBy: null` clears
// the sort.
function normalizeFilters (filters: Record<string, any> | undefined) {
  const bag = filters ?? {}
  return {
    sortBy: bag.sortBy === undefined ? sortState.value.sortBy : normalizeSortBy(bag.sortBy),
    sortOrder: bag.sortOrder === undefined ? sortState.value.sortOrder : normalizeSortOrder(bag.sortOrder),
    external: JSON.stringify(getExternalFilters(bag)),
  }
}

function buildFetchParams (): InfiniteDataTableFetchParams {
  return {
    ...getFilters(),
    cursor: cursor.value,
    limit: props.pageSize,
  }
}

function resetState () {
  internalData.value = []
  cursor.value = undefined
  hasMore.value = true
  errored.value = false
  total.value = undefined
  // Release the loading guard so a fresh loadMore can start even when one is
  // in flight; the in-flight request bails out via the requestVersion check.
  loading.value = false
}

// -- Loading --

async function loadMore () {
  if (loading.value || !hasMore.value) return

  started.value = true
  // Calling loadMore is the retry path; the IntersectionChecker is hidden
  // while errored, so it can't trigger this branch on its own.
  errored.value = false

  const currentVersion = ++requestVersion.value
  loading.value = true
  try {
    const result = await props.fetchMethod(buildFetchParams())
    if (currentVersion !== requestVersion.value) return

    internalData.value = [ ...internalData.value, ...result.items ]
    if (result.total != null) total.value = result.total
    cursor.value = result.next
    hasMore.value = !!result.next
  } catch (error) {
    if (currentVersion !== requestVersion.value) return
    console.error('InfiniteDataTable loadMore failed:', error)
    errored.value = true
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
  const el = scrollEl.value
  if (!el) return
  if (isOverflowing.value) {
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
    if (!started.value) return
    refresh()
  })
}

// -- External filters --
// `filters` carries the whole query state, so an incoming sort is adopted as
// well — that's what lets a toolbar panel drive sorting.

let lastExternalFilters = JSON.stringify(getExternalFilters(props.filters))

watch(() => normalizeFilters(props.filters), incoming => {
  const externalChanged = incoming.external !== lastExternalFilters
  lastExternalFilters = incoming.external

  const sortChanged = incoming.sortBy !== sortState.value.sortBy
    || incoming.sortOrder !== sortState.value.sortOrder
  if (!externalChanged && !sortChanged) return

  if (sortChanged) sortState.value = { sortBy: incoming.sortBy, sortOrder: incoming.sortOrder }
  if (!started.value) {
    emit('update:filters', getFilters())
    return
  }
  refresh()
})

// -- Expose --

defineExpose({
  data: internalData,
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
      v-if="showBodyEnd"
      #bodyEnd
    >
      <div
        v-if="!hasMore"
        class="text-sm text-muted-foreground text-center"
      >
        {{ T('allLoaded') }}
      </div>
      <div
        v-else-if="errored"
        class="gap-2 text-sm flex items-center justify-center"
      >
        <span class="text-muted-foreground">
          {{ T('loadFailed') }}
        </span>
        <Button
          variant="ghost"
          size="sm"
          @click="loadMore"
        >
          {{ t('common.actions.retry') }}
        </Button>
      </div>
      <EffectIntersectionChecker
        v-else-if="started"
        :disabled="loading"
        :options="intersectionOptions"
        class="flex items-center justify-center"
        @show="loadMore"
      >
        <Icon
          name="loader-circle"
          class="size-6 animate-spin text-muted-foreground"
        />
      </EffectIntersectionChecker>
    </template>

    <template #footer>
      <slot name="footer">
        <div class="gap-2 text-xs flex items-center justify-between">
          <div>
            <span
              v-if="total != null"
              class="text-muted-foreground"
            >
              {{ T('count', { loaded: internalData.length, total }) }}
            </span>
          </div>
          <div class="gap-2 flex items-center">
            <Tooltip :text="T('scrollToTop')">
              <Button
                variant="ghost"
                size="icon-sm"
                icon="arrow-up-to-line"
                :disabled="loading || internalData.length === 0 || isAtTop"
                @click="scrollToTop"
              />
            </Tooltip>
            <Tooltip :text="t('common.actions.refresh')">
              <Button
                variant="ghost"
                size="icon-sm"
                icon="rotate-cw"
                :disabled="loading"
                @click="refresh"
              />
            </Tooltip>
          </div>
        </div>
      </slot>
    </template>
  </DataTable>
</template>
