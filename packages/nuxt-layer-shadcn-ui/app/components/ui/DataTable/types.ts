export type DataTableColumnType = 'text' | 'date' | 'unixDate' | 'currency' | 'empty'
export type DataTableColumnFixed = 'left' | 'right'
export type DataTableColumnAlign = 'left' | 'center' | 'right'
export type DataTableSelectionMode = 'single' | 'multiple'

export interface DataTableColumn {
  /** Column identifier - used for field binding and slot naming */
  field: string
  /** Column header title */
  title?: string
  /** Column value type for formatting */
  type?: DataTableColumnType
  /** Fixed column width (e.g., '100px', '10rem') */
  width?: string
  /** Minimum column width (e.g., '100px', '10rem') */
  minWidth?: string
  /** Fixed column position: left or right */
  fixed?: DataTableColumnFixed
  /** Whether text can wrap. Default: false (no wrap) */
  wrap?: boolean
  /** Text alignment. Default: 'left' */
  align?: DataTableColumnAlign
  /** Whether this column is sortable */
  sortable?: boolean
  /** Currency code for 'currency' type (e.g., 'USD', 'JPY'). Default: 'USD' */
  currency?: string
}

export interface DataTableProps<T = Record<string, any>> {
  /** Table data rows */
  data?: T[]
  /** Column definitions */
  columns?: DataTableColumn[]
  /** Selection mode: single or multiple */
  selectionMode?: DataTableSelectionMode
  /** Current sort field */
  sortBy?: string | null
  /** Current sort order: 1 for asc, -1 for desc */
  sortOrder?: number | null
  /** Show loading overlay */
  loading?: boolean
}
