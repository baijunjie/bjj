<script setup lang="ts">
import {
  PinInput,
  PinInputGroup,
  PinInputSlot,
} from '../../shadcn/pin-input'
import type { InputOtpProps } from './types'

const props = withDefaults(defineProps<InputOtpProps>(), {
  modelValue: '',
  length: 6,
  size: undefined,
  rounded: false,
  readonly: false,
  disabled: false,
  invalid: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'complete': [value: string]
}>()

const isInvalid = useFormItemInvalid(() => props.invalid)

function handleComplete (values: string[]) {
  emit('complete', values.join(''))
}

// The native readonly attribute blocks typing and pasting, but PinInput
// mutates the model directly on Backspace/Delete, so intercept them here
function handleKeydownCapture (event: KeyboardEvent) {
  if (props.readonly && (event.key === 'Backspace' || event.key === 'Delete')) {
    event.preventDefault()
    event.stopPropagation()
  }
}

function handleUpdate (value: string[]) {
  emit('update:modelValue', value.join(''))
}

</script>

<template>
  <PinInput
    :modelValue="modelValue.split('')"
    :disabled="disabled"
    @update:modelValue="handleUpdate"
    @complete="handleComplete"
    @keydown.capture="handleKeydownCapture"
  >
    <PinInputGroup :data-control-size="size">
      <PinInputSlot
        v-for="(_, index) in length"
        :key="index"
        :index="index"
        :readonly="readonly || undefined"
        :aria-invalid="isInvalid || undefined"
        :class="[
          `
            size-(--control-height) text-(length:--control-font-size)
            leading-(--control-line-height)
          `,
          rounded && `
            first:rounded-l-full
            last:rounded-r-full
          `,
        ]"
      />
    </PinInputGroup>
  </PinInput>
</template>
