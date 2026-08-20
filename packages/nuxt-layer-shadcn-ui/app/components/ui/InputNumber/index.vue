<script setup lang="ts">
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '../../shadcn/number-field'
import type { InputNumberAlign, InputNumberProps } from './types'

const props = withDefaults(defineProps<InputNumberProps>(), {
  modelValue: undefined,
  min: undefined,
  max: undefined,
  step: 1,
  readonly: false,
  disabled: false,
  showButtons: true,
  placeholder: undefined,
  align: 'center',
  invalid: false,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
}>()

const slots = defineSlots<{
  prefix?: () => any
  suffix?: () => any
}>()

const model = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const isInvalid = useFormItemInvalid(() => props.invalid)

const contentClass = computed(() =>
  cn(
    `
      h-9 rounded-md border-input shadow-xs
      dark:bg-input/30
      flex items-center border transition-[color,box-shadow]
    `,
    `
      has-[[data-slot=input]:focus-visible]:border-ring
      has-[[data-slot=input]:focus-visible]:ring-ring/50
      has-[[data-slot=input]:focus-visible]:ring-[3px]
    `,
    isInvalid.value && `
      border-destructive ring-destructive/20
      dark:ring-destructive/40
      has-[[data-slot=input]:focus-visible]:border-destructive
      has-[[data-slot=input]:focus-visible]:ring-destructive/20
      dark:has-[[data-slot=input]:focus-visible]:ring-destructive/40
    `,
  ),
)

const buttonClass = 'static translate-y-0 shrink-0 cursor-pointer'

const alignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} satisfies Record<InputNumberAlign, string>

const inputClass = computed(() =>
  cn(
    `
      min-w-0 px-3 flex-1 rounded-none border-0 shadow-none
      focus-visible:ring-0
    `,
    alignClass[props.align],
    // An addon already separates the value from that edge, so tighten the gap next to it.
    slots.prefix && 'pl-2',
    slots.suffix && 'pr-2',
  ),
)

const addonClass = computed(() =>
  cn(
    `
      text-muted-foreground gap-1 text-sm font-medium flex shrink-0 cursor-text
      items-center select-none
    `,
    props.disabled && 'opacity-50',
  ),
)

// The stepper buttons pad the content edges themselves; without them the addon does it.
const prefixClass = computed(() =>
  cn(addonClass.value, !props.showButtons && 'pl-3'),
)
const suffixClass = computed(() =>
  cn(addonClass.value, !props.showButtons && 'pr-3'),
)

// Clicking an addon should feel like clicking the field itself.
function focusInput (event: MouseEvent) {
  const addon = event.currentTarget as HTMLElement
  addon.parentElement?.querySelector('input')?.focus()
}
</script>

<template>
  <NumberField
    v-model="model"
    :class="props.class"
    :min="min"
    :max="max"
    :step="step"
    :readonly="readonly"
    :disabled="disabled"
  >
    <NumberFieldContent :class="contentClass">
      <NumberFieldDecrement
        v-if="showButtons"
        :class="buttonClass"
      />
      <span
        v-if="slots.prefix"
        :class="prefixClass"
        @click="focusInput"
      >
        <slot name="prefix" />
      </span>
      <NumberFieldInput
        :placeholder="placeholder"
        :class="inputClass"
      />
      <span
        v-if="slots.suffix"
        :class="suffixClass"
        @click="focusInput"
      >
        <slot name="suffix" />
      </span>
      <NumberFieldIncrement
        v-if="showButtons"
        :class="buttonClass"
      />
    </NumberFieldContent>
  </NumberField>
</template>
