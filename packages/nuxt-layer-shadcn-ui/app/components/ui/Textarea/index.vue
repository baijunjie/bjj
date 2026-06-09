<script setup lang="ts">
import { Textarea as ShadcnTextarea } from '../../shadcn/textarea'
import type { TextareaProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: undefined,
  autocomplete: undefined,
  rows: undefined,
  maxlength: undefined,
  showCount: false,
  invalid: false,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const isInvalid = useFormItemInvalid(() => props.invalid)

// Internal value tracks the actual textarea content, independent of parent's modelValue
const internalValue = ref(props.modelValue)

// Sync internal value when parent updates modelValue
watch(() => props.modelValue, value => {
  internalValue.value = value
})

const countText = computed(() => {
  const length = internalValue.value?.length ?? 0
  return props.maxlength === undefined ? `${length}` : `${length} / ${props.maxlength}`
})

function handleInput (event: Event) {
  const target = event.target as HTMLTextAreaElement
  internalValue.value = target.value
  emit('update:modelValue', target.value)
}

function handleChange (event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('change', target.value)
}

const mergedClass = computed(() =>
  cn(
    props.rows ? 'field-sizing-fixed!' : '',
    props.class,
  ),
)
</script>

<template>
  <div>
    <ShadcnTextarea
      :modelValue="modelValue"
      :rows="rows"
      :maxlength="maxlength"
      :class="mergedClass"
      :aria-invalid="isInvalid || undefined"
      :data-1p-ignore="autocomplete === 'off' || !autocomplete ? true : undefined"
      :autocomplete="autocomplete || 'off'"
      v-bind="$attrs"
      @input="handleInput"
      @change="handleChange"
    />
    <div
      v-if="showCount"
      class="mt-1 text-sm text-muted-foreground text-right"
    >
      {{ countText }}
    </div>
  </div>
</template>
