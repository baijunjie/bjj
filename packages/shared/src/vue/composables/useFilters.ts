/**
 * Composable for syncing filters with URL query parameters.
 *
 * Each entry of the `types` argument declares a filter's runtime
 * type — same shape as Vue's runtime `defineProps({ x: String })`.
 * Serialization is type-driven:
 *
 *   - `String`  → passthrough
 *   - `Number`  → `String(...)` / `Number(...)`
 *   - `Boolean` → `'true'` / `'false'`
 *   - `Array`   → repeated keys (`?k=a&k=b`); URL elements are strings
 *   - `Object`  → JSON-encoded
 *
 * Each type has a natural empty (`''` / `0` / `false` / `[]` / `{}`)
 * which acts as the URL-strip sentinel. Use the advanced form
 * `{ type, default }` when a field must always carry a default —
 * clearing reverts to it instead of disappearing.
 *
 * "Empty" is recursive: an object whose own values are all empty
 * matches `{}`, so a partially-cleared structured value cleanly
 * strips itself from the URL.
 *
 * `initialValues` seeds keys absent from the URL on first load. The
 * route watcher never re-applies it, so the user can clear a value
 * and it stays cleared (URL wins on subsequent navigations).
 *
 * Local override of `@elepay-io/frontend-shared`'s `useFilters`.
 * Drop this file and re-export upstream once the upstream version
 * supports the same surface.
 *
 * @example
 * const filters = useFilters({
 *   a: String,
 *   b: Array,                              // → string[]
 *   c: Object,                             // → Record<string, unknown>
 *   d: { type: Number, default: 10 },      // never goes below 10
 * }, {
 *   c: { x: 1 },                           // seed `c` on first load
 * })
 */

import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQuery, LocationQueryRaw, LocationQueryValue } from 'vue-router'

type TypeConstructor
  = | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | ArrayConstructor
    | ObjectConstructor

type FilterType
  = | TypeConstructor
    | { type: TypeConstructor, default: unknown }

type ResolveCtor<C>
  = C extends StringConstructor ? string
    : C extends NumberConstructor ? number
      : C extends BooleanConstructor ? boolean
        : C extends ArrayConstructor ? string[]
          : C extends ObjectConstructor ? Record<string, unknown>
            : never

type ResolveType<T>
  = T extends { type: infer C } ? ResolveCtor<C>
    : ResolveCtor<T>

type Resolved<T extends Record<string, FilterType>> = {
  [K in keyof T]: ResolveType<T[K]>
}

interface Normalized {
  ctor: TypeConstructor
  default: unknown
}

export function useFilters<T extends Record<string, FilterType>> (
  types: T,
  initialValues?: Partial<Resolved<T>>,
): Resolved<T> {
  const route = useRoute()
  const router = useRouter()

  const normalized: Record<string, Normalized> = Object.fromEntries(
    Object.entries(types).map(([ key, def ]) => [ key, normalize(def) ]),
  )

  function readFromQuery (query: LocationQuery): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const [ key, n ] of Object.entries(normalized)) {
      const raw = query[key]
      result[key] = raw == null ? n.default : parseValue(raw, n.ctor)
    }
    return result
  }

  function writeToQuery (state: Record<string, unknown>): LocationQueryRaw {
    const query: LocationQueryRaw = {}
    // Preserve non-filter query params.
    for (const [ k, v ] of Object.entries(route.query)) {
      if (!(k in normalized)) query[k] = v
    }
    for (const [ key, n ] of Object.entries(normalized)) {
      const value = state[key]
      if (isEqual(value, n.default)) continue
      const serialized = serializeValue(value)
      if (serialized !== undefined) query[key] = serialized
    }
    return query
  }

  // Seed `initialValues` only for keys absent from the URL — first-
  // load semantic. The route watcher below never re-applies them,
  // so a user-cleared filter stays cleared.
  const initial: Record<string, unknown> = readFromQuery(route.query)
  for (const [ key, value ] of Object.entries(initialValues ?? {})) {
    if (value !== undefined && route.query[key] == null) initial[key] = value
  }
  const filters = reactive(initial) as Resolved<T>

  watch(
    () => ({ ...filters }),
    next => {
      void router.replace({ query: writeToQuery(next) })
    },
    { deep: true, immediate: true },
  )

  watch(
    () => route.query,
    newQuery => {
      Object.assign(filters, readFromQuery(newQuery))
    },
  )

  return filters
}

function normalize (def: FilterType): Normalized {
  return typeof def === 'function'
    ? { ctor: def, default: emptyOf(def) }
    : { ctor: def.type, default: def.default }
}

function emptyOf (ctor: TypeConstructor): unknown {
  if (ctor === Array) return []
  if (ctor === Object) return {}
  if (ctor === Number) return 0
  if (ctor === Boolean) return false
  return ''
}

/** Parse a raw query value into the shape implied by the constructor. */
function parseValue (
  raw: LocationQueryValue | LocationQueryValue[],
  ctor: TypeConstructor,
): unknown {
  const arr = Array.isArray(raw) ? raw : [ raw ]
  if (ctor === Array) return arr.filter((v): v is string => v != null)

  const value = arr[0]
  if (value == null) return emptyOf(ctor)

  if (ctor === Number) {
    const n = Number(value)
    return Number.isNaN(n) ? 0 : n
  }
  if (ctor === Boolean) return value === 'true' || value === '1'
  if (ctor === Object) {
    try {
      const parsed = JSON.parse(value)
      return (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed))
        ? parsed
        : {}
    } catch {
      return {}
    }
  }
  return value
}

function serializeValue (value: unknown): string | string[] | undefined {
  if (value == null || value === '') return undefined
  if (Array.isArray(value)) {
    if (!value.length) return undefined
    const items = value.map(v => {
      if (v == null || v === '') return ''
      return typeof v === 'object' ? JSON.stringify(v) : String(v)
    })
    return items.every(s => s === '') ? undefined : items
  }
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

/** Two values both being `isEmpty` count as equal — that's how an
 *  all-empty object collapses to `{}`. */
function isEqual (a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (isEmpty(a) && isEmpty(b)) return true
  return JSON.stringify(a) === JSON.stringify(b)
}

/** `null` / `undefined` / `''` / `[]` / `{}` and objects whose own
 *  values are all (recursively) empty. `0` and `false` are values. */
function isEmpty (v: unknown): boolean {
  if (v == null) return true
  if (typeof v === 'string') return v === ''
  if (Array.isArray(v)) return !v.length
  if (typeof v === 'object') return Object.values(v).every(isEmpty)
  return false
}
