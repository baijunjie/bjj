<script setup lang="ts">
import { cva } from 'class-variance-authority'
import type { TagProps } from './types'

const tagVariants = cva(
  'font-medium inline-flex items-center',
  {
    variants: {
      // xs keeps sm's font and tightens only the padding.
      size: {
        xs: 'gap-0.5 rounded-sm px-1 py-0 text-[0.625rem]',
        sm: 'gap-0.5 rounded-sm px-1.5 py-0.5 text-[0.625rem]',
        md: 'gap-1 rounded-md px-2 py-1 text-xs',
      },
      variant: {
        solid: 'border',
        soft: 'border',
        bordered: 'border bg-transparent',
        flat: '',
      },
      rounded: {
        true: 'rounded-full',
        false: '',
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
    ],
    defaultVariants: {
      variant: 'soft',
      color: 'default',
      size: 'md',
      rounded: false,
    },
  },
)

// Remove button: sized from the tag's own size so it fits the text line
// without touching the tag's padding. The negative end margin pulls it into
// the padding, offsetting the whitespace around the × glyph so both sides look
// even; xs pulls less, as its padding is narrower. Colors derive from
// `currentColor`, so hover / focus follow every color × variant combination.
const closeClass = `
  inline-flex shrink-0 cursor-pointer items-center justify-center
  rounded-full
  opacity-60 transition
  hover:bg-current/15 hover:opacity-100
  focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-current/50
  focus-visible:outline-none
`

const closeSizes = {
  xs: { button: '-me-0.5 size-3.5', icon: 'size-2.5' },
  sm: { button: '-me-1 size-3.5', icon: 'size-2.5' },
  md: { button: '-me-1 size-4', icon: 'size-3' },
} as const

const props = withDefaults(defineProps<TagProps>(), {
  color: 'default',
  variant: 'soft',
  size: 'md',
  rounded: false,
  closable: false,
  closeLabel: undefined,
  class: undefined,
})

const emit = defineEmits<{
  close: [event: MouseEvent]
}>()

defineSlots<{
  default?: () => any
}>()

const T = useTranslations('components.ui.Tag')

const mergedClass = computed(() =>
  cn(tagVariants({ color: props.color, variant: props.variant, size: props.size, rounded: props.rounded }), props.class),
)
</script>

<template>
  <span :class="mergedClass">
    <slot />
    <button
      v-if="closable"
      type="button"
      data-slot="tag-close"
      :class="[ closeClass, closeSizes[size].button ]"
      :aria-label="closeLabel || T('remove')"
      @click="emit('close', $event)"
    >
      <Icon
        name="x"
        :class="closeSizes[size].icon"
      />
    </button>
  </span>
</template>
