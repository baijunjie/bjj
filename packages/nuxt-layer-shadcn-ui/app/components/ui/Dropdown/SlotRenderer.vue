<script setup lang="ts">
defineProps<{
  /** Name of the slot on the root Dropdown to render. */
  slotName: string
  /** Forwarded to the slot scope as `{ item }`. */
  item: object
}>()

const ctx = inject(dropdownContextKey)
</script>

<template>
  <component
    :is="ctx.slots[slotName]"
    v-if="ctx?.slots[slotName]"
    :item="item"
  />
</template>
