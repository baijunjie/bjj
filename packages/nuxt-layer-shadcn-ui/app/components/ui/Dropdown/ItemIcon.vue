<script setup lang="ts">
import { cva } from 'class-variance-authority'
import type { DropdownActionItem } from './types'

const props = defineProps<{
  icon: DropdownActionItem['icon']
  /** Override icon color independently of the surrounding item color. */
  iconColor?: DropdownActionItem['iconColor']
}>()

const iconColorVariants = cva('', {
  variants: {
    color: {
      default: '',
      primary: 'text-primary',
      success: 'text-success',
      info: 'text-info',
      help: 'text-help',
      warn: 'text-warn',
      danger: 'text-danger',
    },
  },
  defaultVariants: { color: 'default' },
})

const colorClass = computed(() => iconColorVariants({ color: props.iconColor }))
</script>

<template>
  <Icon
    v-if="icon"
    :name="icon"
    :class="colorClass"
  />
</template>
