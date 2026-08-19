<script setup lang="ts">
import type { SidebarLayoutMenuItem } from '../SidebarLayout/types'
import type { SidebarModalPaneSlotProps, SidebarModalProps } from './types'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../../shadcn/dialog'
import { findSidebarMenuItem, firstSidebarMenuItemKey } from '../SidebarLayout/utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SidebarModalProps>(), {
  visible: undefined,
  active: undefined,
  search: undefined,
  searchPlaceholder: undefined,
  title: undefined,
  modal: true,
  showClose: true,
  closeOnClickOutside: false,
  sidebarWidth: undefined,
  contentClass: undefined,
  class: undefined,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:active': [key: string]
  'update:search': [keyword: string]
  'select': [item: SidebarLayoutMenuItem]
  'open': []
  'close': []
  'closed': []
}>()

// Each menu key doubles as a slot name (`#general`); default slot is the fallback.
defineSlots<{
  default?: (props: SidebarModalPaneSlotProps) => any
  trigger?: () => any
  header?: () => any
  footer?: () => any
  [key: string]: ((props: any) => any) | undefined
}>()

const { t } = useI18n()
const T = useTranslations('components.ui.SidebarModal')

const dialogOpen = ref(props.visible ?? false)
const activeKey = ref(props.active ?? '')
const searchQuery = ref(props.search)

const activeItem = computed(() => findSidebarMenuItem(props.menus, activeKey.value))

const paneSlotProps = computed<SidebarModalPaneSlotProps>(() => ({
  active: activeKey.value,
  item: activeItem.value,
}))

const searchKeyword = computed(() => searchQuery.value?.trim() ?? '')

const filteredMenus = computed(() => {
  // A custom filter runs for every keyword, empty included, so it fully owns the
  // listing; reading its own reactive state in there also covers async results.
  if (typeof props.searchable === 'function') {
    return props.searchable(props.menus, searchKeyword.value)
  }
  if (!searchKeyword.value) return props.menus
  return filterMenus(props.menus, searchKeyword.value.toLowerCase())
})

const dialogClass = computed(() =>
  cn(
    `
      gap-0 bg-popover p-0
      md:max-w-4xl md:h-[min(80vh,42rem)]
      flex h-[85vh] flex-col overflow-hidden
    `,
    props.class,
  ),
)

const paneClass = computed(() =>
  cn(`
    px-4 py-4
    md:px-6 md:py-5
  `, props.contentClass),
)

watch(() => props.visible, value => {
  if (value !== undefined) dialogOpen.value = value
})

watch(dialogOpen, value => {
  emit('update:visible', value)
  if (value) {
    emit('open')
    return
  }
  emit('close')
  // Drop the filter so a stale search does not greet the next open.
  searchQuery.value = undefined
})

watch(() => props.search, keyword => {
  if (keyword !== undefined) searchQuery.value = keyword
})

watch(searchQuery, keyword => emit('update:search', keyword ?? ''))

watch(() => props.active, key => {
  if (key !== undefined) activeKey.value = key
})

watch(activeKey, key => emit('update:active', key))

// Keep a pane selected, including once asynchronously loaded menus arrive.
watch(() => props.menus, () => {
  if (props.active !== undefined || activeItem.value) return
  activeKey.value = firstSidebarMenuItemKey(props.menus) ?? ''
}, { immediate: true })

function matchesKeyword (item: SidebarLayoutMenuItem, keyword: string): boolean {
  return `${item.label} ${item.group ?? ''}`.toLowerCase().includes(keyword)
}

// Matched children surface as flat entries grouped under their parent's label,
// so no result stays hidden behind a collapsed parent.
function filterMenus (menus: SidebarLayoutMenuItem[], keyword: string): SidebarLayoutMenuItem[] {
  const result: SidebarLayoutMenuItem[] = []

  for (const item of menus) {
    const selfMatch = matchesKeyword(item, keyword)
    if (item.children?.length) {
      const children = selfMatch
        ? item.children
        : item.children.filter(child => matchesKeyword(child, keyword))
      result.push(...children.map(child => ({ ...child, group: item.label })))
    } else if (selfMatch) {
      result.push(item)
    }
  }

  return result
}

function onPointerDownOutside (event: Event) {
  if (!props.closeOnClickOutside) event.preventDefault()
}
</script>

<template>
  <Dialog
    v-model:open="dialogOpen"
    :modal="modal"
  >
    <DialogTrigger
      v-if="$slots.trigger"
      asChild
    >
      <slot name="trigger" />
    </DialogTrigger>

    <DialogContent
      v-bind="$attrs"
      :class="dialogClass"
      :showCloseButton="false"
      @pointerDownOutside="onPointerDownOutside"
      @closeAutoFocus="emit('closed')"
    >
      <!-- A11y: reka-ui requires a title and a description inside the dialog. -->
      <DialogTitle
        class="
          px-4 pt-4 text-base font-semibold
          md:sr-only md:p-0
          shrink-0
        "
      >
        {{ title }}
      </DialogTitle>
      <DialogDescription class="sr-only" />

      <SidebarLayout
        v-model:active="activeKey"
        embedded
        :menus="filteredMenus"
        :emptyText="searchKeyword ? T('noResults') : undefined"
        :sidebarWidth="sidebarWidth"
        :contentClass="paneClass"
        @select="emit('select', $event)"
      >
        <template
          v-if="searchable || $slots.header"
          #header
        >
          <slot name="header" />

          <Input
            v-if="searchable"
            v-model="searchQuery"
            :placeholder="searchPlaceholder || T('searchPlaceholder')"
          >
            <template #prefix>
              <Icon name="search" />
            </template>
          </Input>
        </template>

        <template
          v-if="$slots.footer"
          #footer
        >
          <slot name="footer" />
        </template>

        <slot
          :name="activeKey || 'default'"
          v-bind="paneSlotProps"
        >
          <slot v-bind="paneSlotProps" />
        </slot>
      </SidebarLayout>

      <DialogClose
        v-if="showClose"
        class="
          top-3 right-3 size-8 text-muted-foreground ring-offset-background
          hover:bg-accent/50 hover:text-foreground
          focus:ring-ring
          absolute flex items-center justify-center rounded-full transition
          focus:ring-2 focus:ring-offset-2 focus:outline-hidden
        "
      >
        <Icon name="x" />
        <span class="sr-only">
          {{ t('common.actions.close') }}
        </span>
      </DialogClose>
    </DialogContent>
  </Dialog>
</template>
