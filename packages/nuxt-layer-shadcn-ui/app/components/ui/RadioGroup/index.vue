<script setup lang="ts">
import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem as ShadcnRadioGroupItem,
} from '../../shadcn/radio-group'
import type { RadioGroupItem, RadioGroupProps } from './types'

const props = withDefaults(defineProps<RadioGroupProps>(), {
  items: () => [],
  modelValue: undefined,
  disabled: false,
  orientation: 'vertical',
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineSlots<{
  label?: (props: { item: RadioGroupItem, checked: boolean }) => unknown
}>()

const model = computed({
  get: () => props.modelValue,
  set: value => {
    if (value !== undefined) emit('update:modelValue', value)
  },
})

const orientationClass = {
  horizontal: 'flex-row flex-wrap items-center',
  vertical: 'flex-col',
} as const

const mergedClass = computed(() => cn(
  'gap-3 flex',
  orientationClass[props.orientation],
  props.class,
))
</script>

<template>
  <ShadcnRadioGroup
    v-model="model"
    :disabled="disabled"
    :orientation="orientation"
    :class="mergedClass"
  >
    <label
      v-for="item in items"
      :key="item.value"
      class="
        gap-2 flex cursor-pointer items-center
        has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50
      "
    >
      <ShadcnRadioGroupItem
        :value="item.value"
        :disabled="item.disabled"
      />
      <span class="text-sm">
        <slot
          name="label"
          :item="item"
          :checked="model === item.value"
        >
          {{ item.label || item.value }}
        </slot>
      </span>
    </label>
  </ShadcnRadioGroup>
</template>
