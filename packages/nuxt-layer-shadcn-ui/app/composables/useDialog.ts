import type { ModalProps } from '../components/ui/Modal/types'

/**
 * Imperative dialog options, aligned with `<Modal>` props (minus `visible`,
 * which the queue manages). Anything Modal accepts — `beforeClose`, `loading`,
 * `confirmVariant`, `class`, … — works here too.
 */
export interface DialogOptions extends Omit<ModalProps, 'visible'> {
  /** Plain-text body shorthand. Overridden by `content` when both are set. */
  message?: string
}

interface DialogQueueItem {
  options: DialogOptions
  resolve: (value: boolean) => void
}

// shallowReactive (not reactive): aligning DialogOptions with ModalProps pulls in
// recursive types (ClassValue) and VNode, which blow past TS's depth limit under
// deep ref-unwrapping. Queue items are written once and read whole, so array-level
// reactivity is all we need.
const dialogQueue = shallowReactive<DialogQueueItem[]>([])
const isOpen = ref(false)
const mountedInstances = ref<symbol[]>([])

function showDialog (options: DialogOptions): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    dialogQueue.push({ options, resolve })
    if (dialogQueue.length === 1) {
      isOpen.value = true
    }
  })
}

/**
 * Dialog utility composable
 *
 * Uses a reactive queue consumed by the AlertDialog UI component.
 * Supports stacked dialogs — new dialogs wait until the current one is resolved.
 */
export function useDialog () {
  const confirm = (options: DialogOptions): Promise<boolean> => {
    return showDialog(options)
  }

  const alert = (options: DialogOptions): Promise<void> => {
    return showDialog({ ...options, showCancel: false }).then(() => {})
  }

  const destroy = (options: DialogOptions): Promise<boolean> => {
    return showDialog({ ...options, type: options.type ?? 'danger' })
  }

  return { confirm, alert, destroy }
}

/**
 * Internal composable for the AlertDialog component to access dialog queue.
 *
 * Multiple `<AlertDialog />` instances can be mounted simultaneously (e.g. in
 * Storybook docs view), but only the first one renders the modal — the rest
 * stay inert via `isActive`. This prevents stacked overlays and duplicate
 * `onClosed` events from over-shifting the shared queue.
 */
export function useDialogState () {
  const id = Symbol('AlertDialog')
  mountedInstances.value.push(id)

  onScopeDispose(() => {
    const idx = mountedInstances.value.indexOf(id)
    if (idx >= 0) mountedInstances.value.splice(idx, 1)
  })

  const isActive = computed(() => mountedInstances.value[0] === id)
  const current = computed(() => dialogQueue[0] ?? null)

  /** Resolve current dialog and trigger close animation */
  function close (value: boolean) {
    dialogQueue[0]?.resolve(value)
    isOpen.value = false
  }

  /** Called after close animation ends; advance queue */
  function onClosed () {
    dialogQueue.shift()
    if (dialogQueue.length > 0) {
      nextTick(() => {
        isOpen.value = true
      })
    }
  }

  return { current, isOpen, isActive, close, onClosed }
}
