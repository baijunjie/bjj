export type DataTableColumnType = 'text' | 'number' | 'date' | 'unixDate' | 'currency'
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
  /** Maximum column width (e.g., '200px', '20rem') */
  maxWidth?: string
  /** Fixed column position: left or right */
  fixed?: DataTableColumnFixed
  /** Whether text can wrap. Default: false (truncate with ellipsis) */
  wrap?: boolean
  /** Text alignment. Default: 'left' */
  align?: DataTableColumnAlign
  /** Whether this column is sortable */
  sortable?: boolean
  /** Currency code for 'currency' type (e.g., 'USD', 'JPY'). Default: 'USD' */
  currency?: string
  /** How to display the currency for 'currency' type. Default: 'symbol' */
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name'
  /** Custom class applied to the body cell (`<td>`) container */
  class?: string
  /** Custom class applied to the header cell (`<th>`) container */
  headerClass?: string
}

export interface DataTableProps<T = Record<string, any>> {
  /** Table data rows */
  data?: T[]
  /** Column definitions */
  columns?: DataTableColumn[]
  /** Selection mode: single or multiple */
  selectionMode?: DataTableSelectionMode
  /** Row to highlight as active. Independent from selection; uses the same highlight style. */
  active?: T | null
  /** Current sort field */
  sortBy?: string | null
  /** Current sort order: 1 for asc, -1 for desc */
  sortOrder?: number | null
  /** Show loading overlay */
  loading?: boolean
  /** Whether rows are clickable (shows pointer cursor and pairs with `@rowClick`) */
  clickable?: boolean
  /** Fixed height for the inner scroll container (e.g. '400px'). Enables internal vertical scroll, with sticky header and footer. */
  height?: string
}
