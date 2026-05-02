<script setup lang="ts" generic="TValue extends string | number = string, TMeta = unknown">
import { debounce } from 'lodash-es'
import type { SelectOption } from '../Select/types'
import type { SearchSelectProps } from './types'

type Option = SelectOption<TValue, TMeta>

const T = useTranslations('components.ui.SearchSelect')

const props = withDefaults(defineProps<SearchSelectProps<TValue, TMeta>>(), {
  modelValue: undefined,
  defaultOptions: () => [],
  autoLoad: false,
  loadMethod: undefined,
  loadValueOptionMethod: undefined,
  loadLimit: 20,
  placeholder: undefined,
  disabled: false,
  searchPlaceholder: undefined,
  emptyText: undefined,
  searchEmptyText: undefined,
  createNewTo: undefined,
  createNewText: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: TValue | undefined]
}>()

const model = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const keyword = ref('')
const isLoading = ref(false)
const fetchedValueOption = shallowRef<Option | null>(null)
const pagination = usePagination<Option>([], { limit: props.loadLimit })

// -- Data loading --

async function fetchOptions (offset: number, limit: number) {
  if (!props.loadMethod) return
  const result = await props.loadMethod({ keyword: keyword.value, offset, limit })
  pagination.update(result.items, { total: result.total })
}

async function loadMore () {
  if (!props.loadMethod || isLoading.value) return
  const next = pagination.next.value
  if (!next) return

  isLoading.value = true
  try {
    await fetchOptions(next.offset, next.limit)
  } finally {
    isLoading.value = false
  }
}

async function resetAndLoad () {
  if (!props.loadMethod) return

  fetchedValueOption.value = null
  pagination.reset([], { limit: props.loadLimit })
  isLoading.value = true
  try {
    await fetchOptions(0, props.loadLimit)

    // Fetch value option if not found in loaded results
    if (model.value != null && !isValueInOptions(model.value)) {
      fetchValueOption(model.value)
    }
  } finally {
    isLoading.value = false
  }
}

// -- Value option fetching --

function isValueInOptions (value: TValue): boolean {
  if (props.defaultOptions?.some(opt => opt.value === value)) return true
  if (pagination.items.value.some(opt => opt.value === value)) return true
  if (fetchedValueOption.value?.value === value) return true
  return false
}

async function fetchValueOption (value: TValue) {
  if (!props.loadValueOptionMethod) return
  if (fetchedValueOption.value?.value === value) return

  try {
    fetchedValueOption.value = await props.loadValueOptionMethod(value)
  } catch {
    fetchedValueOption.value = null
  }
}

// -- Displayed options (deduplication) --

const displayedOptions = computed<Option[]>(() => {
  const fetched = fetchedValueOption.value
  const defaults = props.defaultOptions ?? []
  const loaded = pagination.items.value

  const priorityValues = new Set<TValue>(defaults.map(opt => opt.value))
  const priorityOptions: Option[] = []

  if (fetched && !priorityValues.has(fetched.value)) {
    priorityOptions.push(fetched)
    priorityValues.add(fetched.value)
  }
  priorityOptions.push(...defaults)

  const dedupedLoaded = loaded.filter(opt => !priorityValues.has(opt.value))

  return [ ...priorityOptions, ...dedupedLoaded ]
})

const hasMore = computed(() => !!props.loadMethod && !!pagination.next.value)

// -- Filter (bypass client-side filtering, delegate to server) --

const filterFunction: SelectFilterFunction = items => items

// -- Search --

const debouncedSearch = debounce(() => resetAndLoad(), 300)

function handleSearch (value: string) {
  keyword.value = value
  debouncedSearch()
}

// -- Empty text --

const computedEmptyText = computed(() => {
  if (keyword.value) return props.searchEmptyText || T('noSearchItems')
  return props.emptyText || T('noItems')
})

// -- Popover open/close --

function handleOpen () {
  if (props.loadMethod && displayedOptions.value.length === 0) {
    resetAndLoad()
  }
}

function handleClose () {
  if (keyword.value) {
    keyword.value = ''
    debouncedSearch.cancel()
    resetAndLoad()
  }
}

// -- Auto-load --

function shouldAutoLoad (): boolean {
  if (!props.autoLoad || !props.loadMethod) return false
  if (pagination.items.value.length === 0) return true
  if (model.value != null) return !isValueInOptions(model.value)
  return false
}

watch(
  [ () => props.autoLoad, () => model.value ?? undefined ],
  () => {
    if (shouldAutoLoad()) resetAndLoad()
  },
  { immediate: true },
)

// -- Value option lookup for value slot --

function findOptionByValue (value: TValue | undefined): Option | undefined {
  if (value == null) return undefined
  return displayedOptions.value.find(opt => opt.value === value)
}

defineExpose({ refresh: resetAndLoad })
</script>

<template>
  <Select
    v-model="model"
    :options="displayedOptions"
    :filter="filterFunction"
    :placeholder="placeholder"
    :searchPlaceholder="searchPlaceholder"
    :emptyText="computedEmptyText"
    :disabled="disabled"
    :loading="isLoading"
    @search="handleSearch"
    @open="handleOpen"
    @close="handleClose"
  >
    <template
      v-if="$slots.value"
      #value="slotProps"
    >
      <slot
        name="value"
        v-bind="slotProps"
        :option="findOptionByValue(model)"
      />
    </template>

    <template
      v-if="$slots.option"
      #option="slotProps"
    >
      <slot
        name="option"
        v-bind="slotProps"
      />
    </template>

    <template #listEnd>
      <EffectIntersectionChecker
        v-if="hasMore"
        :disabled="isLoading"
        class="py-2 flex items-center justify-center"
        @show="loadMore"
      >
        <Icon
          name="loader-circle"
          class="size-4 animate-spin text-muted-foreground"
        />
      </EffectIntersectionChecker>
    </template>

    <template
      v-if="createNewTo || $slots.footer"
      #footer
    >
      <slot name="footer">
        <div class="border-border border-t">
          <WebLink
            :to="createNewTo!"
            target="_blank"
            unstyled
            class="
              gap-2 px-3 py-2 text-sm text-muted-foreground
              hover:bg-accent
              flex items-center transition-colors
            "
          >
            <Icon
              name="plus"
              class="size-4"
            />
            {{ createNewText || T('createNew') }}
          </WebLink>
        </div>
      </slot>
    </template>
  </Select>
</template>
