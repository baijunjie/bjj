import type { DataTableColumn } from '../DataTable/types'

export interface InfiniteDataTableFetchParams {
  /** Opaque cursor pointing at the next page; absent on the first page */
  cursor?: string
  /** Page size requested */
  limit: number
  /** Filter / sort fields are spread onto the params object */
  [key: string]: any
}

export interface InfiniteDataTableFetchResult<T = Record<string, any>> {
  items: T[]
  /** Cursor for the next page; pass back as `cursor` on the next request. Absent signals "no more". */
  next?: string
  /** Optional total count */
  total?: number
}

export interface InfiniteDataTableProps<T = Record<string, any>> {
  /** Async function to fetch a page of rows */
  fetchMethod: (params: InfiniteDataTableFetchParams) => Promise<InfiniteDataTableFetchResult<T>>
  /** Column definitions */
  columns?: DataTableColumn[]
  /** Whether to fetch the first page on mount (default: true) */
  autoFetch?: boolean
  /** External filter state — changing this resets and reloads */
  filters?: Record<string, any>
  /** Number of rows per page (default: 30) */
  pageSize?: number
  /** Fixed height enabling internal vertical scroll (e.g. '400px') */
  height?: string
  /** Whether rows are clickable (shows pointer cursor and pairs with `@rowClick`) */
  clickable?: boolean
}
