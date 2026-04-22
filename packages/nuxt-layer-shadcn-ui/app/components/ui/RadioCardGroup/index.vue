<script setup lang="ts">
import {
  RadioGroup,
  RadioGroupItem,
} from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/radio-group'
import type { RadioCardGroupProps } from './types'

const props = withDefaults(defineProps<RadioCardGroupProps>(), {
  modelValue: undefined,
  disabled: false,
  class: undefined,
})

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
  <RadioGroup
    v-model="model"
    :disabled="disabled"
    :class="mergedClass"
  >
    <label
      v-for="option in options"
      :key="option.value"
      class="
        flex cursor-pointer items-center gap-3 rounded-lg border border-border
        px-4 py-3 transition-colors
        has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50
        has-data-[state=checked]:border-primary
      "
      :class="[
        option.disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent/50',
      ]"
    >
      <RadioGroupItem
        :value="option.value"
        :disabled="option.disabled"
      />
      <div class="grid flex-1 gap-0.5">
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
  </RadioGroup>
</template>
