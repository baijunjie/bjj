<script setup lang="ts">
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '../../shadcn/number-field'
import type { InputNumberProps } from './types'

const props = withDefaults(defineProps<InputNumberProps>(), {
  modelValue: undefined,
  min: undefined,
  max: undefined,
  step: 1,
  disabled: false,
  showButtons: true,
  placeholder: undefined,
  invalid: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
}>()

const model = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const contentClass = computed(() =>
  cn(
    `
      flex h-9 items-center rounded-md border border-input shadow-xs
      transition-[color,box-shadow]
      dark:bg-input/30
    `,
    `
      has-[[data-slot=input]:focus-visible]:border-ring
      has-[[data-slot=input]:focus-visible]:ring-[3px]
      has-[[data-slot=input]:focus-visible]:ring-ring/50
    `,
    props.invalid && `
      border-destructive ring-destructive/20
      dark:ring-destructive/40
    `,
  ),
)

const inputClass = 'flex-1 border-0 shadow-none focus-visible:ring-0 rounded-none'
</script>

<template>
  <NumberField
    v-model="model"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
  >
    <NumberFieldContent :class="contentClass">
      <NumberFieldDecrement
        v-if="showButtons"
        class="cursor-pointer"
      />
      <NumberFieldInput
        :placeholder="placeholder"
        :class="inputClass"
      />
      <NumberFieldIncrement
        v-if="showButtons"
        class="cursor-pointer"
      />
    </NumberFieldContent>
  </NumberField>
</template>
