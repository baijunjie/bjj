import type { ModalContentProps } from '../components/ui/ModalContent/types'

export type DialogType = NonNullable<ModalContentProps['type']>
export type DialogMessageContent = NonNullable<ModalContentProps['content']>

export interface DialogOptions {
  type?: DialogType
  title?: string
  message?: DialogMessageContent
  acceptLabel?: string
  rejectLabel?: string
}

interface DialogQueueItem {
  options: DialogOptions
  resolve: (value: boolean) => void
}

const dialogQueue = reactive<DialogQueueItem[]>([])
const isOpen = ref(false)

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
    return showDialog({ ...options, rejectLabel: '' }).then(() => {})
  }

  const destroy = (options: DialogOptions): Promise<boolean> => {
    return showDialog({ ...options, type: options.type ?? 'danger' })
  }

  return { confirm, alert, destroy }
}

/**
 * Internal composable for the AlertDialog component to access dialog queue.
 */
export function useDialogState () {
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

  return { current, isOpen, close, onClosed }
}
