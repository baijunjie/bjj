<script setup lang="ts">
import { cva } from 'class-variance-authority'
import type { SurfaceProps } from './types'

const surfaceVariants = cva(
  'rounded-lg',
  {
    variants: {
      variant: {
        solid: 'border',
        soft: 'border',
        bordered: 'border bg-transparent',
        flat: '',
      },
      color: {
        default: '',
        primary: '',
        success: '',
        info: '',
        help: '',
        warn: '',
        danger: '',
      },
      active: {
        true: 'ring-[3px]',
        false: '',
      },
      selectable: {
        true: 'cursor-pointer transition-colors',
        false: '',
      },
    },
    compoundVariants: [
      // solid — full color background
      { variant: 'solid', color: 'default', class: `
        bg-accent text-accent-foreground border-transparent
      ` },
      { variant: 'solid', color: 'primary', class: `
        border-primary bg-primary text-primary-foreground
      ` },
      { variant: 'solid', color: 'success', class: `
        border-success bg-success text-success-foreground
      ` },
      { variant: 'solid', color: 'info', class: `
        border-info bg-info text-info-foreground
      ` },
      { variant: 'solid', color: 'help', class: `
        border-help bg-help text-help-foreground
      ` },
      { variant: 'solid', color: 'warn', class: `
        border-warn bg-warn text-warn-foreground
      ` },
      { variant: 'solid', color: 'danger', class: `
        border-danger bg-danger text-danger-foreground
      ` },
      // soft — tinted background + soft border
      { variant: 'soft', color: 'default', class: `
        border-border bg-secondary text-secondary-foreground
      ` },
      { variant: 'soft', color: 'primary', class: `
        border-primary/50 bg-primary/10 text-primary
      ` },
      { variant: 'soft', color: 'success', class: `
        border-success/50 bg-success/10 text-success
      ` },
      { variant: 'soft', color: 'info', class: `
        border-info/50 bg-info/10 text-info
      ` },
      { variant: 'soft', color: 'help', class: `
        border-help/50 bg-help/10 text-help
      ` },
      { variant: 'soft', color: 'warn', class: `
        border-warn/50 bg-warn/10 text-warn
      ` },
      { variant: 'soft', color: 'danger', class: `
        border-danger/50 bg-danger/10 text-danger
      ` },
      // bordered — border only
      { variant: 'bordered', color: 'default', class: `
        border-border text-foreground
      ` },
      { variant: 'bordered', color: 'primary', class: `
        border-primary/50 text-primary
      ` },
      { variant: 'bordered', color: 'success', class: `
        border-success/50 text-success
      ` },
      { variant: 'bordered', color: 'info', class: 'border-info/50 text-info' },
      { variant: 'bordered', color: 'help', class: 'border-help/50 text-help' },
      { variant: 'bordered', color: 'warn', class: 'border-warn/50 text-warn' },
      { variant: 'bordered', color: 'danger', class: `
        border-danger/50 text-danger
      ` },
      // flat — tinted background only
      { variant: 'flat', color: 'default', class: `
        bg-secondary text-secondary-foreground
      ` },
      { variant: 'flat', color: 'primary', class: 'bg-primary/10 text-primary' },
      { variant: 'flat', color: 'success', class: 'bg-success/10 text-success' },
      { variant: 'flat', color: 'info', class: 'bg-info/10 text-info' },
      { variant: 'flat', color: 'help', class: 'bg-help/10 text-help' },
      { variant: 'flat', color: 'warn', class: 'bg-warn/10 text-warn' },
      { variant: 'flat', color: 'danger', class: 'bg-danger/10 text-danger' },
      // active — color-matched border + soft ring (mirrors Input focus)
      { active: true, color: 'default', class: 'border-ring ring-ring/50' },
      { active: true, color: 'primary', class: 'border-primary ring-primary/50' },
      { active: true, color: 'success', class: 'border-success ring-success/50' },
      { active: true, color: 'info', class: 'border-info ring-info/50' },
      { active: true, color: 'help', class: 'border-help ring-help/50' },
      { active: true, color: 'warn', class: 'border-warn ring-warn/50' },
      { active: true, color: 'danger', class: 'border-danger ring-danger/50' },
      // selectable — hover bg, one step up the variant's intensity ladder
      { selectable: true, variant: 'solid', color: 'default', class: `
        hover:bg-accent/80
      ` },
      { selectable: true, variant: 'solid', color: 'primary', class: `
        hover:bg-primary/90
      ` },
      { selectable: true, variant: 'solid', color: 'success', class: `
        hover:bg-success/90
      ` },
      { selectable: true, variant: 'solid', color: 'info', class: `
        hover:bg-info/90
      ` },
      { selectable: true, variant: 'solid', color: 'help', class: `
        hover:bg-help/90
      ` },
      { selectable: true, variant: 'solid', color: 'warn', class: `
        hover:bg-warn/90
      ` },
      { selectable: true, variant: 'solid', color: 'danger', class: `
        hover:bg-danger/90
      ` },
      { selectable: true, variant: 'soft', color: 'default', class: `
        hover:bg-secondary/70
      ` },
      { selectable: true, variant: 'soft', color: 'primary', class: `
        hover:bg-primary/20
      ` },
      { selectable: true, variant: 'soft', color: 'success', class: `
        hover:bg-success/20
      ` },
      { selectable: true, variant: 'soft', color: 'info', class: `
        hover:bg-info/20
      ` },
      { selectable: true, variant: 'soft', color: 'help', class: `
        hover:bg-help/20
      ` },
      { selectable: true, variant: 'soft', color: 'warn', class: `
        hover:bg-warn/20
      ` },
      { selectable: true, variant: 'soft', color: 'danger', class: `
        hover:bg-danger/20
      ` },
      { selectable: true, variant: 'bordered', color: 'default', class: `
        hover:bg-accent
      ` },
      { selectable: true, variant: 'bordered', color: 'primary', class: `
        hover:bg-primary/10
      ` },
      { selectable: true, variant: 'bordered', color: 'success', class: `
        hover:bg-success/10
      ` },
      { selectable: true, variant: 'bordered', color: 'info', class: `
        hover:bg-info/10
      ` },
      { selectable: true, variant: 'bordered', color: 'help', class: `
        hover:bg-help/10
      ` },
      { selectable: true, variant: 'bordered', color: 'warn', class: `
        hover:bg-warn/10
      ` },
      { selectable: true, variant: 'bordered', color: 'danger', class: `
        hover:bg-danger/10
      ` },
      { selectable: true, variant: 'flat', color: 'default', class: `
        hover:bg-secondary/70
      ` },
      { selectable: true, variant: 'flat', color: 'primary', class: `
        hover:bg-primary/20
      ` },
      { selectable: true, variant: 'flat', color: 'success', class: `
        hover:bg-success/20
      ` },
      { selectable: true, variant: 'flat', color: 'info', class: `
        hover:bg-info/20
      ` },
      { selectable: true, variant: 'flat', color: 'help', class: `
        hover:bg-help/20
      ` },
      { selectable: true, variant: 'flat', color: 'warn', class: `
        hover:bg-warn/20
      ` },
      { selectable: true, variant: 'flat', color: 'danger', class: `
        hover:bg-danger/20
      ` },
    ],
    defaultVariants: {
      variant: 'soft',
      color: 'default',
      active: false,
      selectable: false,
    },
  },
)

const props = withDefaults(defineProps<SurfaceProps>(), {
  color: 'default',
  variant: 'soft',
  active: false,
  selectable: false,
  class: undefined,
})

const mergedClass = computed(() =>
  cn(
    surfaceVariants({
      color: props.color,
      variant: props.variant,
      active: props.active,
      selectable: props.selectable,
    }),
    props.class,
  ),
)
</script>

<template>
  <div :class="mergedClass">
    <slot />
  </div>
</template>
