<script setup lang="ts" generic="TValue extends string | number = string, TMeta = unknown">
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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
import type { SelectOption, SelectProps } from './types'

type Option = SelectOption<TValue, TMeta>

const T = useTranslations('components.ui.Select')

const props = withDefaults(defineProps<SelectProps<TValue, TMeta>>(), {
  options: () => [],
  modelValue: undefined,
  placeholder: undefined,
  disabled: false,
  filter: false,
  searchPlaceholder: undefined,
  emptyText: undefined,
  multiple: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: TValue | TValue[]]
  'search': [value: string]
  'open': []
  'close': []
}>()

const open = ref(false)

watch(open, value => {
  if (value && props.disabled) {
    open.value = false
    return
  }
  value ? emit('open') : emit('close')
})

// -- Filter --

const commandFilterFunction = computed(() => {
  return typeof props.filter === 'function' ? props.filter : undefined
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

  for (const opt of props.options ?? []) {
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

const showClearButton = computed(() => hasValue.value && !props.disabled)

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
        :data-disabled="disabled || undefined"
        :data-state="open ? 'open' : 'closed'"
        class="
          data-[state=open]:border-ring data-[state=open]:ring-ring/50
          cursor-pointer
          data-[state=open]:ring-[3px]
        "
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
            {{ placeholder ?? T('placeholder') }}
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
            name="chevron-down"
            class="size-4 opacity-50"
          />
        </InputGroupAddon>
      </InputGroup>
    </PopoverTrigger>
    <PopoverContent class="p-0 w-(--reka-popover-trigger-width)">
      <Command
        :modelValue="commandModelValue"
        :filterFunction="commandFilterFunction"
        :multiple="multiple"
        highlightOnHover
        @update:searchTerm="(value: string) => emit('search', value)"
      >
        <CommandInput
          v-if="!!filter"
          :placeholder="searchPlaceholder ?? T('searchPlaceholder')"
        />
        <CommandList>
          <CommandEmpty>
            {{ emptyText ?? T('noItems') }}
          </CommandEmpty>

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
