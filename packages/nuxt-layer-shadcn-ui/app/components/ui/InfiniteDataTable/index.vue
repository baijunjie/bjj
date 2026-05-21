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

const sortState = ref<{ sortBy: string | null, sortOrder: number | null }>({
  sortBy: props.filters?.sortBy ? String(props.filters.sortBy) : null,
  sortOrder: props.filters?.sortOrder ? Number(props.filters.sortOrder) : null,
})

const isInitialLoad = computed(() => loading.value && internalData.value.length === 0)

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
      v-if="!isInitialLoad && (hasMore || internalData.length > 0)"
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
        v-else-if="!isInitialLoad"
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
