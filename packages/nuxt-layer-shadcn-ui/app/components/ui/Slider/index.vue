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
</script>

<template>
  <ShadcnSlider v-model="internalModel" />
</template>
