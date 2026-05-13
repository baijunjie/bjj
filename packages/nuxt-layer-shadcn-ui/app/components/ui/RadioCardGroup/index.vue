<script setup lang="ts">
import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem as ShadcnRadioGroupItem,
} from '../../shadcn/radio-group'
import type { RadioCardGroupProps } from './types'

const props = withDefaults(defineProps<RadioCardGroupProps>(), {
  modelValue: undefined,
  disabled: false,
  invalid: false,
  class: undefined,
})

const isInvalid = useFormItemInvalid(() => props.invalid)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const model = computed({
  get: () => props.modelValue,
  set: value => {
    if (value !== undefined) emit('update:modelValue', value)
  },
})

const mergedClass = computed(() => cn('gap-3', props.class))
</script>

<template>
  <ShadcnRadioGroup
    v-model="model"
    :disabled="disabled"
    :class="mergedClass"
  >
    <label
      v-for="option in options"
      :key="option.value"
      class="
        gap-3 rounded-lg border-border px-4 py-3
        has-data-[state=checked]:border-primary
        flex cursor-pointer items-center border transition-colors
        has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50
      "
      :class="[
        option.disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent/50',
      ]"
    >
      <ShadcnRadioGroupItem
        :value="option.value"
        :disabled="option.disabled"
        :aria-invalid="isInvalid || undefined"
      />
      <div class="gap-0.5 grid flex-1">
        <span class="text-sm font-medium">
          {{ option.title }}
        </span>
        <span
          v-if="option.description"
          class="text-xs text-muted-foreground"
        >
          {{ option.description }}
        </span>
      </div>
    </label>
  </ShadcnRadioGroup>
</template>
