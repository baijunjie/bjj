export type DataTableColumnType = 'text' | 'number' | 'date' | 'unixDate' | 'currency'
export type DataTableColumnFixed = 'left' | 'right'
export type DataTableColumnAlign = 'left' | 'center' | 'right'
export type DataTableSelectionMode = 'single' | 'multiple'

/** Per-row selection gate: return false to lock a row out of selection */
export type DataTableRowSelectable<T = Record<string, any>> = (row: T, index: number) => boolean

/** Per-row click gate: return false to keep a row from emitting `rowClick` */
export type DataTableRowClickable<T = Record<string, any>> = (row: T, index: number) => boolean

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
  /** Per-row selection gate. Rows returning false get a disabled checkbox and ignore row-click selection; a selection they already hold is left untouched. */
  rowSelectable?: DataTableRowSelectable<T>
  /** Whether clicking anywhere on a row toggles its selection. Default: false — selection toggles only from the selection cell, leaving row clicks to `@rowClick`. */
  selectOnRowClick?: boolean
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
  /** Per-row click gate: rows returning false neither emit `rowClick` nor show the pointer cursor. Selection is gated separately by `rowSelectable`. */
  rowClickable?: DataTableRowClickable<T>
  /** Whether rows take a hover highlight. Default: true — turn it off where the cells hold form controls, as a tinted row reads as "not editable" there. Selected and active rows keep their highlight either way. */
  hoverable?: boolean
  /** Fixed height for the inner scroll container (e.g. '400px'). Enables internal vertical scroll, with sticky header and footer. */
  height?: string
}
