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
const inputClass = 'flex-1 min-w-0 border-0 shadow-none focus-visible:ring-0 rounded-none'
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
        :class="buttonClass"
      />
      <NumberFieldInput
        :placeholder="placeholder"
        :class="inputClass"
      />
      <NumberFieldIncrement
        v-if="showButtons"
        :class="buttonClass"
      />
    </NumberFieldContent>
  </NumberField>
</template>
