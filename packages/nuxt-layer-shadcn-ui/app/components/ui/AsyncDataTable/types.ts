import type { DataTableColumn } from '../DataTable/types'
import type { DropdownActionItem, DropdownLabelItem, DropdownSeparatorItem } from '../Dropdown/types'

export type AsyncDataTableBatchAction<T = Record<string, any>>
  = | (Omit<DropdownActionItem, 'command'> & { action?: (selectedItems: T[]) => void })
    | DropdownSeparatorItem
    | DropdownLabelItem

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
  /** Async function to fetch data */
  fetchMethod: (params: AsyncDataTableFetchParams) => Promise<AsyncDataTableFetchResult<T>>
  /** Whether to auto fetch data on mount (default: true) */
  autoFetch?: boolean
  /** Column definitions */
  columns?: DataTableColumn[]
  /** External filter state */
  filters?: Record<string, any>
  /** Whether to show top toolbar (undefined = auto when page size >= `topToolbarThreshold`) */
  showTopToolbar?: boolean
  /** Page-size threshold that triggers the top toolbar when `showTopToolbar` is undefined (default: 50) */
  topToolbarThreshold?: number
  /** Whether to show bottom toolbar (default: true) */
  showBottomToolbar?: boolean
  /** Available page size options */
  pageSizeOptions?: number[]
  /** Whether to show pagination controls (default: true) */
  showPagination?: boolean
  /** Whether rows are selectable */
  selectable?: boolean
  /** Whether rows are clickable (shows pointer cursor and pairs with `@rowClick`) */
  clickable?: boolean
  /** Batch action definitions for selected rows */
  batchActions?: AsyncDataTableBatchAction<T>[]
  /** Selected rows (v-model:selection) */
  selection?: T[]
}
