<script setup lang="ts">
import {
  PinInput,
  PinInputGroup,
  PinInputSlot,
} from '../../shadcn/pin-input'
import type { InputOtpProps } from './types'

withDefaults(defineProps<InputOtpProps>(), {
  modelValue: '',
  length: 6,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'complete': [value: string]
}>()

function handleComplete (values: string[]) {
  emit('complete', values.join(''))
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
  >
    <PinInputGroup>
      <PinInputSlot
        v-for="(_, index) in length"
        :key="index"
        :index="index"
      />
    </PinInputGroup>
  </PinInput>
</template>
