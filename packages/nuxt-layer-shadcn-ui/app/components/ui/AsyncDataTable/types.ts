import type { Component } from 'vue'
import type { DataTableColumn } from '../DataTable/types'

export interface AsyncDataTableBatchAction<T = Record<string, any>> {
  /** Button/menu item label */
  label: string
  /** Icon name or component */
  icon?: string | Component
  /** Custom CSS class */
  class?: ClassValue
  /** Whether the action is disabled */
  disabled?: boolean
  /** Callback with selected items */
  action: (selectedItems: T[]) => void
}

export interface AsyncDataTableFetchParams {
  offset: number
  limit: number
  [key: string]: any
}

export interface AsyncDataTableFetchResult<T = Record<string, any>> {
  items: T[]
  total: number
}

export interface AsyncDataTableProps<T = Record<string, any>> {
  /** Column definitions */
  columns?: DataTableColumn[]
  /** Async function to fetch data. If not provided, uses static data mode */
  fetchMethod?: (params: AsyncDataTableFetchParams) => Promise<AsyncDataTableFetchResult<T>>
  /** Whether to auto fetch data on mount (default: true) */
  autoFetch?: boolean
  /** Static data array (used when fetchMethod is not provided) */
  data?: T[]
  /** External filter state */
  filters?: Record<string, any>
  /** Whether to show top toolbar (undefined = auto when page size >= 50) */
  showTopToolbar?: boolean
  /** Whether to show bottom toolbar (default: true) */
  showBottomToolbar?: boolean
  /** Available page size options */
  pageSizeOptions?: number[]
  /** Whether to show pagination controls (default: true) */
  showPagination?: boolean
  /** Whether rows are selectable */
  selectable?: boolean
  /** Batch action definitions for selected rows */
  batchActions?: AsyncDataTableBatchAction<T>[]
  /** Selected rows (v-model:selection) */
  selection?: T[]
}
