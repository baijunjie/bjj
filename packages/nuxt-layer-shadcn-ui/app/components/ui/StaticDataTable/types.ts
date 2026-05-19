import type { DataTableColumn } from '../DataTable/types'
import type { DropdownActionItem, DropdownLabelItem, DropdownSeparatorItem } from '../Dropdown/types'

export type StaticDataTableBatchAction<T = Record<string, any>>
  = | (Omit<DropdownActionItem, 'command'> & { action?: (selectedItems: T[]) => void })
    | DropdownSeparatorItem
    | DropdownLabelItem

export type StaticDataTableSortMethod<T = Record<string, any>>
  = (items: T[], sortBy: string, sortOrder: 1 | -1) => T[]

export interface StaticDataTableProps<T = Record<string, any>> {
  /** Static data array. Pre-filter externally before passing in. */
  data?: T[]
  /** Column definitions */
  columns?: DataTableColumn[]
  /** Custom sort implementation. Receives the data and the current sort state; should return sorted items. Defaults to a generic comparator on `row[sortBy]`. */
  sortMethod?: StaticDataTableSortMethod<T>
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
  batchActions?: StaticDataTableBatchAction<T>[]
  /** Selected rows (v-model:selection) */
  selection?: T[]
}
