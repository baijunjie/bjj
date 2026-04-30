<script setup lang="ts">
import ItemIcon from './ItemIcon.vue'
import type { DropdownActionItem } from './types'

defineProps<{
  item: DropdownActionItem
}>()
</script>

<template>
  <ItemIcon
    :icon="item.icon"
    :iconColor="item.iconColor"
  />
  <span class="flex-1">
    {{ item.label }}
  </span>
  <Icon
    v-if="item.active"
    name="check"
    class="size-4"
  />
</template>
