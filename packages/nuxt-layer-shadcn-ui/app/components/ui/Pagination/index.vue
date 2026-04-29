<script setup lang="ts">
import type { DropdownItem } from '@bjj/nuxt-layer-shadcn-ui/app/components/ui/Dropdown/types'
import { buttonVariants } from '../../shadcn/button'
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '../../shadcn/pagination'
import type { PaginationProps } from './types'

const props = withDefaults(defineProps<PaginationProps>(), {
  page: 1,
  total: 0,
  pageSize: 10,
  pageSizeOptions: () => [],
  simple: false,
  siblingCount: 1,
  size: 'default',
})

const emit = defineEmits<{
  'update:page': [value: number]
  'update:pageSize': [value: number]
}>()

const T = useTranslations('components.ui.Pagination')

const totalPages = computed(() => Math.ceil(props.total / props.pageSize) || 0)
const hasData = computed(() => props.total > 0)

const iconButtonSize = computed(() => props.size === 'sm' ? 'icon-sm' as const : 'icon' as const)
const buttonSize = computed(() => props.size === 'sm' ? 'sm' as const : 'default' as const)

const pageReport = computed(() => {
  if (!hasData.value) return ''
  const first = (props.page - 1) * props.pageSize + 1
  const last = Math.min(props.page * props.pageSize, props.total)
  return T('pageReport', { first, last, total: props.total })
})

const pageItemClass = computed(() => props.size === 'sm'
  ? 'min-w-8 w-auto! px-1.5'
  : 'min-w-9 w-auto! px-2',
)

const activePageClass = computed(() => cn(
  buttonVariants({ variant: 'default', size: iconButtonSize.value }),
  pageItemClass.value,
  `
    hover:text-primary-foreground
    dark:hover:bg-primary/90
  `,
))

const showPageSizeDropdown = computed(() => props.pageSizeOptions.length > 1)

const pageSizeMenuItems = computed<DropdownItem[]>(() =>
  props.pageSizeOptions.map(size => ({
    label: String(size),
    active: size === props.pageSize,
    command: () => emit('update:pageSize', size),
  })),
)
</script>

<template>
  <div
    v-if="hasData"
    class="gap-2 flex items-center"
  >
    <!-- Simple mode: ‹ 1/9 › -->
    <template v-if="simple">
      <Button
        variant="ghost"
        :size="iconButtonSize"
        :disabled="page <= 1"
        @click="emit('update:page', 1)"
      >
        <Icon name="chevrons-left" />
      </Button>
      <Button
        variant="ghost"
        :size="iconButtonSize"
        :disabled="page <= 1"
        @click="emit('update:page', page - 1)"
      >
        <Icon name="chevron-left" />
      </Button>
      <span
        class="min-w-12 text-sm text-muted-foreground text-center tabular-nums"
      >
        {{ page }} / {{ totalPages }}
      </span>
      <Button
        variant="ghost"
        :size="iconButtonSize"
        :disabled="page >= totalPages"
        @click="emit('update:page', page + 1)"
      >
        <Icon name="chevron-right" />
      </Button>
      <Button
        variant="ghost"
        :size="iconButtonSize"
        :disabled="page >= totalPages"
        @click="emit('update:page', totalPages)"
      >
        <Icon name="chevrons-right" />
      </Button>
    </template>

    <!-- Full mode -->
    <template v-else>
      <span class="text-sm text-muted-foreground whitespace-nowrap">
        {{ pageReport }}
      </span>
      <ShadcnPagination
        :total="total"
        :itemsPerPage="pageSize"
        :page="page"
        :siblingCount="siblingCount"
        showEdges
        class="
          mx-0 w-auto
          [&_button]:cursor-pointer
        "
        @update:page="emit('update:page', $event)"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationFirst :size="iconButtonSize">
            <Icon name="chevrons-left" />
          </PaginationFirst>
          <PaginationPrevious :size="iconButtonSize">
            <Icon name="chevron-left" />
          </PaginationPrevious>
          <template v-for="(item, index) in items">
            <PaginationItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              :size="iconButtonSize"
              :class="item.value === page ? activePageClass : pageItemClass"
            >
              {{ item.value }}
            </PaginationItem>
            <PaginationEllipsis
              v-else
              :key="`e${index}`"
            />
          </template>
          <PaginationNext :size="iconButtonSize">
            <Icon name="chevron-right" />
          </PaginationNext>
          <PaginationLast :size="iconButtonSize">
            <Icon name="chevrons-right" />
          </PaginationLast>
        </PaginationContent>
      </ShadcnPagination>
      <Dropdown
        v-if="showPageSizeDropdown"
        :menus="pageSizeMenuItems"
        trigger="click"
      >
        <Button
          variant="outline"
          :size="buttonSize"
        >
          {{ pageSize }}
          <Icon
            name="chevron-down"
            class="size-3"
          />
        </Button>
      </Dropdown>
    </template>
  </div>
</template>
