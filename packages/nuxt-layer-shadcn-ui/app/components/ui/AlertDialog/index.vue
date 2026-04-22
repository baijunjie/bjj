<script setup lang="ts">
const { current, isOpen, close, onClosed } = useDialogState()

const isAlert = computed(() => current.value?.options.rejectLabel === '')
const isDestructive = computed(() => {
  const type = current.value?.options.type
  return type === 'danger' || type === 'error'
})
</script>

<template>
  <Modal
    :visible="isOpen"
    :title="current?.options.title"
    :type="current?.options.type"
    :content="current?.options.message"
    :showCancel="!isAlert"
    :cancelText="current?.options.rejectLabel || undefined"
    :confirmText="current?.options.acceptLabel || undefined"
    :confirmVariant="isDestructive ? 'destructive' : 'default'"
    @confirm="close(true)"
    @cancel="close(false)"
    @closed="onClosed"
  />
</template>
