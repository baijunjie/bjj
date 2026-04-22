import type { SelectOption } from '../Select/types'

/** Result returned by loadMethod */
export interface SearchSelectLoadMethodResult<V extends string | number = string, M = unknown> {
  items: SelectOption<V, M>[]
  total: number
}

/** Parameters passed to loadMethod */
export interface SearchSelectLoadMethodParams {
  keyword: string
  offset: number
  limit: number
}

export interface SearchSelectProps<V extends string | number = string, M = unknown> {
  modelValue?: V
  /** Default options displayed at the top (always visible, not affected by search) */
  defaultOptions?: SelectOption<V, M>[]
  /** Auto-load on mount or when selected value is not in options */
  autoLoad?: boolean
  /** Async function to load options */
  loadMethod?: (params: SearchSelectLoadMethodParams) => Promise<SearchSelectLoadMethodResult<V, M>>
  /** Async function to load a single option by value (called if value not found after first load) */
  loadValueOptionMethod?: (value: V) => Promise<SelectOption<V, M> | null>
  /** Items per request (default: 20) */
  loadLimit?: number
  placeholder?: string
  disabled?: boolean
  searchPlaceholder?: string
  /** Message when no options available (no search keyword) */
  emptyText?: string
  /** Message when search returns no results */
  searchEmptyText?: string
  /** Link URL for "Create new" footer action */
  createNewTo?: string
  /** Custom text for "Create new" link */
  createNewText?: string
}
