// Wraps a scoped table-cell slot and centralizes "is this cell empty?".
// Routing:
//   - `slotFn` provided and returns non-empty VNodes → render those
//   - `slotFn` provided and returns empty             → render `#empty`
//   - no `slotFn`, `empty` is true                    → render `#empty`
//   - no `slotFn`, `empty` is false                   → render `#default`
//
// Empty VNode detection catches `v-if` / `{{ value }}` returning nothing — a
// rendered element with no content (e.g. `<div/>`) still counts as non-empty.

import { Comment, Fragment, Text, type FunctionalComponent, type VNode } from 'vue'

function isEmptyVNodes (vnodes: VNode[] | undefined): boolean {
  if (!vnodes?.length) return true
  return vnodes.every(vnode => {
    if (vnode.type === Comment) return true
    if (vnode.type === Text) {
      return typeof vnode.children === 'string'
        ? vnode.children.trim() === ''
        : !vnode.children
    }
    if (vnode.type === Fragment) return isEmptyVNodes(vnode.children as VNode[])
    return false
  })
}

const CellSlot: FunctionalComponent<{
  slotFn?: (scope: Record<string, unknown>) => VNode[]
  scope: Record<string, unknown>
  /** When no `slotFn` is provided, signals that the underlying value is empty. */
  empty?: boolean
}> = (props, { slots }) => {
  if (props.slotFn) {
    const vnodes = props.slotFn(props.scope)
    if (!isEmptyVNodes(vnodes)) return vnodes
    return slots.empty?.()
  }
  return props.empty ? slots.empty?.() : slots.default?.()
}
CellSlot.props = [ 'slotFn', 'scope', 'empty' ]
CellSlot.inheritAttrs = false

export default CellSlot
