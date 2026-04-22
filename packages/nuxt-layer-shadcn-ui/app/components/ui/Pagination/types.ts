export type PaginationSize = 'default' | 'sm'

export interface PaginationProps {
  /** Current page number (1-based) */
  page?: number
  /** Total number of items */
  total?: number
  /** Items per page */
  pageSize?: number
  /** Available page size options (shows dropdown when length > 1) */
  pageSizeOptions?: number[]
  /** Compact mode: only prev/next + page indicator */
  simple?: boolean
  /** Number of sibling pages to show in full mode */
  siblingCount?: number
  /** Button size */
  size?: PaginationSize
}
