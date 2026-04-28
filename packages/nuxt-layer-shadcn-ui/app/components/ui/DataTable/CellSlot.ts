// Wraps a scoped table-cell slot. Branches by `slotFn` state:
//   - missing → render `#default` (no custom slot; show normal value)
//   - returns non-empty VNodes → render those
//   - returns empty (only Comment / empty Text / empty Fragment) → render
//     `#empty` (slot is authoritative — don't fall back to the value)
//
// Empty detection catches `v-if` / `{{ value }}` returning nothing — but a
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
}> = (props, { slots }) => {
  if (props.slotFn) {
    const vnodes = props.slotFn(props.scope)
    if (!isEmptyVNodes(vnodes)) return vnodes
    return slots.empty?.()
  }
  return slots.default?.()
}
CellSlot.props = [ 'slotFn', 'scope' ]
CellSlot.inheritAttrs = false

export default CellSlot
