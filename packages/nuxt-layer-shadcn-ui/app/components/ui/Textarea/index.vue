<script setup lang="ts">
import { Textarea as ShadcnTextarea } from '../../shadcn/textarea'
import type { TextareaProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: undefined,
  autocomplete: undefined,
  rows: undefined,
  maxlength: undefined,
  maxLines: undefined,
  showCount: false,
  readonly: false,
  disabled: false,
  invalid: false,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const { t } = useI18n()

const isInvalid = useFormItemInvalid(() => props.invalid)

// Internal value tracks the actual textarea content, independent of parent's modelValue
const internalValue = ref(props.modelValue)

// Sync internal value when parent updates modelValue
watch(() => props.modelValue, value => {
  internalValue.value = value
})

// A limit below one line would leave no room for content at all
const lineLimit = computed(() =>
  props.maxLines !== undefined && props.maxLines >= 1 ? props.maxLines : undefined,
)

function countLines (value: string) {
  return value === '' ? 0 : value.split('\n').length
}

/** Keep the leading lines and drop everything past the line limit */
function clampLines (value: string) {
  const limit = lineLimit.value
  if (limit === undefined || countLines(value) <= limit) return value
  return value.split('\n').slice(0, limit).join('\n')
}

const countText = computed(() => {
  const value = internalValue.value ?? ''
  const lines = countLines(value)
  const linesPart = lineLimit.value === undefined ? `${lines}` : `${lines} / ${lineLimit.value}`
  const charsPart = props.maxlength === undefined ? `${value.length}` : `${value.length} / ${props.maxlength}`
  return `${t('components.ui.Textarea.lines', { count: linesPart })} · ${charsPart}`
})

function handleInput (event: Event) {
  const target = event.target as HTMLTextAreaElement
  const value = clampLines(target.value)
  if (value !== target.value) {
    const caret = Math.min(target.selectionStart, value.length)
    target.value = value
    target.setSelectionRange(caret, caret)
    // Re-dispatch so the inner textarea's own v-model state follows the trimmed value
    target.dispatchEvent(new Event('input', { bubbles: true }))
    return
  }
  internalValue.value = value
  emit('update:modelValue', value)
}

// Reject line breaks beyond the line limit; overflow from pasting is trimmed in handleInput
function handleKeydown (event: KeyboardEvent) {
  const limit = lineLimit.value
  // While composing, Enter commits the IME candidate instead of inserting a line break
  if (limit === undefined || event.key !== 'Enter' || event.isComposing) return
  const { value, selectionStart, selectionEnd } = event.target as HTMLTextAreaElement
  const next = `${value.slice(0, selectionStart)}\n${value.slice(selectionEnd)}`
  if (countLines(next) > limit) event.preventDefault()
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
      :readonly="readonly"
      :disabled="disabled"
      :class="mergedClass"
      :aria-invalid="isInvalid || undefined"
      :data-1p-ignore="autocomplete === 'off' || !autocomplete ? true : undefined"
      :autocomplete="autocomplete || 'off'"
      v-bind="$attrs"
      @input="handleInput"
      @keydown="handleKeydown"
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
