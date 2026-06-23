<script setup lang="ts" generic="TValue extends string | number = string, TMeta = unknown">
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../../shadcn/command'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from '../../shadcn/input-group'
import {
  Popover as ShadcnPopover,
  PopoverContent,
  PopoverTrigger,
} from '../../shadcn/popover'
import { ListboxFilter } from 'reka-ui'
import type { SelectOption, SelectProps } from './types'

type Option = SelectOption<TValue, TMeta>

const T = useTranslations('components.ui.Select')

const props = withDefaults(defineProps<SelectProps<TValue, TMeta>>(), {
  options: () => [],
  modelValue: undefined,
  placeholder: undefined,
  readonly: false,
  disabled: false,
  invalid: false,
  loading: false,
  clearable: true,
  filter: false,
  searchPlaceholder: undefined,
  emptyText: undefined,
  multiple: false,
})

const isInvalid = useFormItemInvalid(() => props.invalid)

// Alias the readonly prop: in this generic component vue-tsc resolves a bare
// `readonly` in the template to Vue's auto-imported readonly() instead
const readonlyActive = computed(() => props.readonly)

const emit = defineEmits<{
  'update:modelValue': [value: TValue | TValue[]]
  'search': [value: string]
  'open': []
  'close': []
}>()

defineSlots<{
  value?: (props: { option?: Option, options?: Option[] }) => any
  option?: (props: { option: Option, selected: boolean }) => any
  listEnd?: () => any
  footer?: () => any
}>()

const open = ref(false)

watch(open, value => {
  if (value && (props.disabled || readonlyActive.value)) {
    open.value = false
    return
  }
  value ? emit('open') : emit('close')
})

function handleTriggerClickCapture (event: Event) {
  if (readonlyActive.value) {
    event.preventDefault()
    event.stopPropagation()
  }
}

// -- Filter --
//
// We render our own ListboxFilter search box instead of shadcn's CommandInput:
// CommandInput only writes into Command's internal filterState (client-side
// filtering) and reka's ListboxRoot never emits `update:searchTerm`, so the
// typed term can't be observed for server-side search. Driving our own term
// surfaces it via `@search` and keeps filterState idle (no double filtering).
//
// `filter === true` matches option labels; a `filter` function is a custom
// matcher (server search passes `items => items` to show everything and filter
// on the server instead).

const searchTerm = ref('')

function handleSearchInput (value: string) {
  searchTerm.value = value
  emit('search', value)
}

// Clear the local term when the popover closes so a reopen starts fresh.
watch(open, value => {
  if (!value) searchTerm.value = ''
})

const visibleOptions = computed<Option[]>(() => {
  const options = props.options ?? []
  const keyword = searchTerm.value
  if (!props.filter || !keyword) return options
  if (typeof props.filter === 'function') {
    const kept = new Set(props.filter(options.map(opt => opt.label), keyword))
    return options.filter(opt => kept.has(opt.label))
  }
  const lower = keyword.toLowerCase()
  return options.filter(opt => opt.label.toLowerCase().includes(lower))
})

// -- Selection --

function isSelected (value: TValue): boolean {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(value)
  }
  return props.modelValue === value
}

function handleSelect (optionValue: TValue) {
  if (props.multiple && Array.isArray(props.modelValue)) {
    const current = props.modelValue
    const newValue = current.includes(optionValue)
      ? current.filter(v => v !== optionValue)
      : [ ...current, optionValue ]
    emit('update:modelValue', newValue)
  } else {
    emit('update:modelValue', optionValue)
    open.value = false
  }
}

// -- Selected display --

const selectedOption = computed(() => {
  if (props.multiple) return undefined
  return props.options?.find(opt => opt.value === props.modelValue)
})

const selectedOptions = computed(() => {
  if (!props.multiple || !Array.isArray(props.modelValue)) return []
  return props.modelValue
    .map(val => props.options?.find(opt => opt.value === val))
    .filter((opt): opt is Option => !!opt)
})

// -- Grouping --

type OptionGroupEntry = { label: string | undefined, items: Option[] }

const groupedOptions = computed<OptionGroupEntry[]>(() => {
  const groups: OptionGroupEntry[] = []
  const map = new Map<string | undefined, OptionGroupEntry>()

  for (const opt of visibleOptions.value) {
    const key = opt.group
    let group = map.get(key)
    if (!group) {
      group = { label: key, items: []}
      map.set(key, group)
      groups.push(group)
    }
    group.items.push(opt)
  }

  return groups
})

// -- Command modelValue (sync selection state with ListboxRoot) --

const commandModelValue = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.map(String)
  }
  return props.modelValue !== undefined ? String(props.modelValue) : ''
})

// -- Clear --

const hasValue = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.length > 0
  }
  return props.modelValue !== undefined && props.modelValue !== null
})

const showClearButton = computed(() => props.clearable && hasValue.value && !readonlyActive.value && !props.disabled)

function handleClear (event: MouseEvent) {
  event.stopPropagation()
  if (props.multiple) {
    emit('update:modelValue', [] as TValue[])
  } else {
    emit('update:modelValue', undefined as unknown as TValue)
  }
}
</script>

<template>
  <ShadcnPopover v-model:open="open">
    <PopoverTrigger asChild>
      <InputGroup
        role="combobox"
        tabindex="0"
        :aria-expanded="open"
        :aria-invalid="isInvalid || undefined"
        :aria-readonly="readonlyActive || undefined"
        :data-disabled="disabled || undefined"
        :data-state="open ? 'open' : 'closed'"
        :class="cn(
          `
            data-[state=open]:border-ring data-[state=open]:ring-ring/50
            aria-invalid:ring-destructive/20 aria-invalid:border-destructive
            dark:aria-invalid:ring-destructive/40
            aria-invalid:data-[state=open]:border-destructive
            aria-invalid:data-[state=open]:ring-destructive/20
            dark:aria-invalid:data-[state=open]:ring-destructive/40
            data-[state=open]:ring-[3px]
          `,
          readonlyActive ? 'cursor-default' : 'cursor-pointer',
        )"
        @click.capture="handleTriggerClickCapture"
      >
        <span
          class="
            gap-2 px-3 py-1 text-base
            md:text-sm
            line-clamp-1 flex flex-1 items-center whitespace-nowrap
          "
        >
          <template v-if="multiple && selectedOptions.length > 0">
            <slot
              name="value"
              :options="selectedOptions"
            >
              {{ selectedOptions.length >= 3 ? T('itemsSelected', { count: selectedOptions.length }) : selectedOptions.map(opt => opt.label).join(', ') }}
            </slot>
          </template>
          <template v-else-if="!multiple && selectedOption">
            <slot
              name="value"
              :option="selectedOption"
            >
              {{ selectedOption.label }}
            </slot>
          </template>
          <span
            v-else
            class="text-muted-foreground"
          >
            {{ placeholder || T('placeholder') }}
          </span>
        </span>
        <InputGroupAddon
          v-if="showClearButton"
          align="inline-end"
        >
          <InputGroupButton
            type="button"
            size="icon-xs"
            @click="handleClear"
          >
            <Icon name="x" />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Icon
            v-if="loading"
            name="loader-circle"
            class="size-4 animate-spin opacity-50"
          />
          <Icon
            v-else
            name="chevron-down"
            class="size-4 opacity-50"
          />
        </InputGroupAddon>
      </InputGroup>
    </PopoverTrigger>
    <PopoverContent class="p-0 w-(--reka-popover-trigger-width)">
      <Command
        :modelValue="commandModelValue"
        :multiple="multiple"
        highlightOnHover
      >
        <div
          v-if="!!filter"
          class="gap-2 px-3 h-9 flex items-center border-b"
        >
          <Icon
            name="search"
            class="size-4 shrink-0 opacity-50"
          />
          <ListboxFilter
            :modelValue="searchTerm"
            autoFocus
            :placeholder="searchPlaceholder || T('searchPlaceholder')"
            class="
              py-3 text-sm
              placeholder:text-muted-foreground
              h-10 flex w-full bg-transparent outline-hidden
            "
            @update:modelValue="handleSearchInput"
          />
        </div>
        <CommandList>
          <div
            v-if="!loading && groupedOptions.length === 0"
            class="py-6 text-sm text-muted-foreground text-center"
          >
            {{ emptyText || T('noItems') }}
          </div>

          <template
            v-for="(group, index) in groupedOptions"
            :key="group.label ?? '_ungrouped'"
          >
            <CommandSeparator v-if="index > 0 && group.label" />
            <CommandGroup :heading="group.label">
              <CommandItem
                v-for="option in group.items"
                :key="String(option.value)"
                :value="String(option.value)"
                :disabled="option.disabled"
                @select="handleSelect(option.value)"
              >
                <slot
                  name="option"
                  :option="option"
                  :selected="isSelected(option.value)"
                >
                  {{ option.label }}
                </slot>
                <Icon
                  name="check"
                  :class="cn(
                    'size-4 ml-auto shrink-0',
                    isSelected(option.value) ? 'opacity-100' : 'opacity-0',
                  )"
                />
              </CommandItem>
            </CommandGroup>
          </template>

          <slot name="listEnd" />
        </CommandList>
      </Command>
      <slot name="footer" />
    </PopoverContent>
  </ShadcnPopover>
</template>
