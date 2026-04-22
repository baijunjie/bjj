export interface SelectOption<V extends string | number = string, M = unknown> {
  label: string
  value: V
  disabled?: boolean
  group?: string
  meta?: M
}

/** Filter function signature matching Command's filterFunction */
export type SelectFilterFunction = (items: string[], keyword: string) => string[]

export type SelectBaseProps<V extends string | number = string, M = unknown> = {
  options?: SelectOption<V, M>[]
  placeholder?: string
  disabled?: boolean
  /** true: enable client-side label filter; function: custom filter (disables internal filter) */
  filter?: boolean | SelectFilterFunction
  /** Search input placeholder */
  searchPlaceholder?: string
  /** Empty state text */
  emptyText?: string
}

export type SelectSingleProps<V extends string | number = string, M = unknown> = SelectBaseProps<V, M> & {
  multiple?: false
  modelValue?: V
}

export type SelectMultipleProps<V extends string | number = string, M = unknown> = SelectBaseProps<V, M> & {
  multiple?: true
  modelValue?: V[]
}

export type SelectProps<V extends string | number = string, M = unknown> = SelectSingleProps<V, M> | SelectMultipleProps<V, M>
