<script setup lang="ts">
import { Textarea as ShadcnTextarea } from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/textarea'
import type { TextareaProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: undefined,
  autocomplete: undefined,
  rows: undefined,
  invalid: false,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

function handleInput (event: Event) {
  const target = event.target as HTMLTextAreaElement
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
  <ShadcnTextarea
    :modelValue="modelValue"
    :rows="rows"
    :class="mergedClass"
    :aria-invalid="invalid || undefined"
    :data-1p-ignore="autocomplete === 'off' || !autocomplete ? true : undefined"
    :autocomplete="autocomplete || 'off'"
    v-bind="$attrs"
    @input="handleInput"
    @change="handleChange"
  />
</template>
