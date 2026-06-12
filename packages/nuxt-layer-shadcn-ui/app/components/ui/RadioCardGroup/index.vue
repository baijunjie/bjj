<script setup lang="ts">
import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem as ShadcnRadioGroupItem,
} from '../../shadcn/radio-group'
import type { RadioCardGroupProps } from './types'

const props = withDefaults(defineProps<RadioCardGroupProps>(), {
  modelValue: undefined,
  readonly: false,
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

// Cards select on click (labels forward clicks to the radio items) and arrow
// keys move the roving selection, so guard both at the group root when readonly
function handleClickCapture (event: Event) {
  if (props.readonly) {
    event.preventDefault()
    event.stopPropagation()
  }
}

function handleKeydownCapture (event: KeyboardEvent) {
  if (props.readonly && event.key.startsWith('Arrow')) {
    event.preventDefault()
    event.stopPropagation()
  }
}

const mergedClass = computed(() => cn('gap-3', props.class))

const cardClass = (optionDisabled?: boolean) =>
  cn(
    `
      gap-3 rounded-lg border-border px-4 py-3
      has-data-[state=checked]:border-primary
      flex items-center border transition-colors
      has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50
    `,
    props.readonly ? 'cursor-default' : 'cursor-pointer',
    optionDisabled
      ? 'cursor-not-allowed opacity-50'
      : !props.readonly && 'hover:bg-accent/50',
    isInvalid.value && `
      border-destructive
      has-data-[state=checked]:border-destructive
    `,
  )
</script>

<template>
  <ShadcnRadioGroup
    v-model="model"
    :disabled="disabled"
    :class="mergedClass"
    :aria-readonly="readonly || undefined"
    @click.capture="handleClickCapture"
    @keydown.capture="handleKeydownCapture"
  >
    <label
      v-for="option in options"
      :key="option.value"
      :class="cardClass(option.disabled)"
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
