<script setup lang="ts">
import { cva } from 'class-variance-authority'
import type { TagProps } from './types'

const tagVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        solid: 'border',
        soft: 'border',
        bordered: 'border bg-transparent',
        flat: '',
      },
      type: {
        default: '',
        success: '',
        info: '',
        help: '',
        warn: '',
        danger: '',
      },
    },
    compoundVariants: [
      // solid — full color background
      { variant: 'solid', type: 'default', class: `
        border-transparent bg-accent text-accent-foreground
      ` },
      { variant: 'solid', type: 'success', class: `
        border-success bg-success text-success-foreground
      ` },
      { variant: 'solid', type: 'info', class: `
        border-info bg-info text-info-foreground
      ` },
      { variant: 'solid', type: 'help', class: `
        border-help bg-help text-help-foreground
      ` },
      { variant: 'solid', type: 'warn', class: `
        border-warn bg-warn text-warn-foreground
      ` },
      { variant: 'solid', type: 'danger', class: `
        border-danger bg-danger text-danger-foreground
      ` },
      // soft — tinted background + soft border
      { variant: 'soft', type: 'default', class: `
        border-border bg-secondary text-secondary-foreground
      ` },
      { variant: 'soft', type: 'success', class: `
        border-success/50 bg-success/10 text-success
      ` },
      { variant: 'soft', type: 'info', class: `
        border-info/50 bg-info/10 text-info
      ` },
      { variant: 'soft', type: 'help', class: `
        border-help/50 bg-help/10 text-help
      ` },
      { variant: 'soft', type: 'warn', class: `
        border-warn/50 bg-warn/10 text-warn
      ` },
      { variant: 'soft', type: 'danger', class: `
        border-danger/50 bg-danger/10 text-danger
      ` },
      // bordered — border only
      { variant: 'bordered', type: 'default', class: `
        border-border text-foreground
      ` },
      { variant: 'bordered', type: 'success', class: `
        border-success/50 text-success
      ` },
      { variant: 'bordered', type: 'info', class: 'border-info/50 text-info' },
      { variant: 'bordered', type: 'help', class: 'border-help/50 text-help' },
      { variant: 'bordered', type: 'warn', class: 'border-warn/50 text-warn' },
      { variant: 'bordered', type: 'danger', class: `
        border-danger/50 text-danger
      ` },
      // flat — tinted background only
      { variant: 'flat', type: 'default', class: `
        bg-secondary text-secondary-foreground
      ` },
      { variant: 'flat', type: 'success', class: 'bg-success/10 text-success' },
      { variant: 'flat', type: 'info', class: 'bg-info/10 text-info' },
      { variant: 'flat', type: 'help', class: 'bg-help/10 text-help' },
      { variant: 'flat', type: 'warn', class: 'bg-warn/10 text-warn' },
      { variant: 'flat', type: 'danger', class: 'bg-danger/10 text-danger' },
    ],
    defaultVariants: {
      variant: 'soft',
      type: 'default',
    },
  },
)

const props = withDefaults(defineProps<TagProps>(), {
  type: 'default',
  variant: 'soft',
  class: undefined,
})

const mergedClass = computed(() =>
  cn(tagVariants({ type: props.type, variant: props.variant }), props.class),
)
</script>

<template>
  <span :class="mergedClass">
    <slot />
  </span>
</template>
