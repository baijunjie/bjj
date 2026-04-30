<script setup lang="ts">
import { cva } from 'class-variance-authority'
import type { DropdownActionItem } from './types'

const props = defineProps<{
  /** Icon name (lucide kebab-case) or a Vue component. */
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
    v-if="typeof icon === 'string'"
    :name="icon"
    :class="colorClass"
  />
  <component
    :is="icon"
    v-else-if="icon"
    :class="cn('size-4', colorClass)"
  />
</template>
