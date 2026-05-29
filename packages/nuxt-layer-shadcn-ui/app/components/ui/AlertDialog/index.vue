<script setup lang="ts">
const { current, isOpen, isActive, close, onClosed } = useDialogState()

const modalProps = computed<Record<string, unknown> | undefined>(() => {
  const options = current.value?.options as Record<string, unknown> | undefined
  if (!options) return undefined
  // `content` (string | VNode | HTMLElement) wins over the `message` shorthand;
  // strip `message` so it never leaks onto the DOM as an unknown attribute.
  const { message, ...rest } = options
  return { ...rest, content: rest.content ?? message }
})

const isDestructive = computed(() => {
  const type = current.value?.options.type
  return type === 'danger' || type === 'error'
})
// danger/error dialogs get a destructive confirm button unless overridden
const confirmVariant = computed(
  () => current.value?.options.confirmVariant ?? (isDestructive.value ? 'destructive' : undefined),
)

// Modal's `@close` fires only after `beforeClose` allows it, but carries no
// action — so we remember the intent and resolve on the actual close. `@open`
// resets it per dialog: each one defaults to a cancel (X / Esc / outside click).
let confirmed = false
function onOpen () {
  confirmed = false
}
function onConfirm () {
  confirmed = true
}
function onCancel () {
  confirmed = false
}
function onClose () {
  close(confirmed)
}
</script>

<template>
  <Modal
    v-if="isActive"
    v-bind="modalProps"
    data-alert-dialog
    :visible="isOpen"
    :confirmVariant="confirmVariant"
    @open="onOpen"
    @confirm="onConfirm"
    @cancel="onCancel"
    @close="onClose"
    @closed="onClosed"
  />
</template>
