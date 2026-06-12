<script setup lang="ts">
import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem as ShadcnRadioGroupItem,
} from '../../shadcn/radio-group'
import type { RadioGroupItem, RadioGroupProps } from './types'

const props = withDefaults(defineProps<RadioGroupProps>(), {
  items: () => [],
  modelValue: undefined,
  readonly: false,
  disabled: false,
  invalid: false,
  orientation: 'vertical',
  class: undefined,
})

const isInvalid = useFormItemInvalid(() => props.invalid)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineSlots<{
  label?: (props: { item: RadioGroupItem, checked: boolean }) => any
}>()

const model = computed({
  get: () => props.modelValue,
  set: value => {
    if (value !== undefined) emit('update:modelValue', value)
  },
})

// Items select on click (labels forward clicks to them) and arrow keys move
// the roving selection, so guard both at the group root when readonly
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
    :aria-readonly="readonly || undefined"
    @click.capture="handleClickCapture"
    @keydown.capture="handleKeydownCapture"
  >
    <label
      v-for="item in items"
      :key="item.value"
      :class="cn(
        `
          gap-2 flex items-center
          has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50
        `,
        readonly ? 'cursor-default' : 'cursor-pointer',
      )"
    >
      <ShadcnRadioGroupItem
        :value="item.value"
        :disabled="item.disabled"
        :aria-invalid="isInvalid || undefined"
      />
      <slot
        name="label"
        :item="item"
        :checked="model === item.value"
      >
        <span class="text-sm">
          {{ item.label || item.value }}
        </span>
      </slot>
    </label>
  </ShadcnRadioGroup>
</template>
