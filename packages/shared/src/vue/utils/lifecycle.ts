import {
  getCurrentInstance,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
} from 'vue'

/**
 * Whether the current call site is within a Vue component's setup scope.
 */
export function isInSetup () {
  return !!getCurrentInstance()
}

/**
 * Wire up a pair of mounted / beforeUnmount callbacks that also respect
 * keep-alive activation and deactivation.
 *
 * Ensures each lifecycle handler is invoked at most once per "active" phase:
 * - `mounted` runs on first mount and again on `onActivated` (after a small
 *   delay to wait for route transitions to settle).
 * - `beforeUnmount` runs on unmount and on `onDeactivated`.
 */
export function onLifecycleSwitch (mounted: () => void, beforeUnmount: () => void) {
  let destroyed = true
  onMounted(() => {
    if (!destroyed) return
    destroyed = false
    mounted()
  })
  onActivated(() => {
    if (!destroyed) return
    destroyed = false
    setTimeout(() => {
      if (destroyed) return
      mounted()
    }, 400) // wait for the transition to complete
  })
  onBeforeUnmount(() => {
    if (destroyed) return
    destroyed = true
    beforeUnmount()
  })
  onDeactivated(() => {
    if (destroyed) return
    destroyed = true
    beforeUnmount()
  })
}
