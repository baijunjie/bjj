<script setup lang="ts">
import { Slider as ShadcnSlider } from '../../shadcn/slider'
import type { SliderProps } from './types'

const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: () => [ 0 ],
})

const emit = defineEmits<{ 'update:modelValue': [value: number | number[]]}>()

// Normalize between single number and array for shadcn Slider
const isSingleValue = computed(() => typeof props.modelValue === 'number')

const internalModel = computed({
  get: () => {
    if (typeof props.modelValue === 'number') return [ props.modelValue ]
    return props.modelValue ?? [ 0 ]
  },
  set: (value: number[]) => {
    emit('update:modelValue', isSingleValue.value ? (value[0] ?? 0) : value)
  },
})

// Reka changes the value on pointer drag/track click and on thumb key
// presses, so guard both event types in the capture phase when readonly
function handlePointerdownCapture (event: Event) {
  if (props.readonly) {
    event.preventDefault()
    event.stopPropagation()
  }
}

const valueChangeKeys = [ 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown' ]

function handleKeydownCapture (event: KeyboardEvent) {
  if (props.readonly && valueChangeKeys.includes(event.key)) {
    event.preventDefault()
    event.stopPropagation()
  }
}
</script>

<template>
  <ShadcnSlider
    v-model="internalModel"
    :data-readonly="readonly ? '' : undefined"
    @pointerdown.capture="handlePointerdownCapture"
    @keydown.capture="handleKeydownCapture"
  />
</template>
