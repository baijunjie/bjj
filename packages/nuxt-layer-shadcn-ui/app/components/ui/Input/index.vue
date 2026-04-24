<script setup lang="ts">
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../../shadcn/input-group'
import type { InputProps } from './types'

defineOptions({ inheritAttrs: false })

const props = defineProps<InputProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
  'change': [value: string | undefined]
}>()

const $slots = defineSlots<{
  prefix?: () => unknown
  suffix?: () => unknown
}>()

// Internal value tracks the actual input content, independent of parent's modelValue
const internalValue = ref(props.modelValue)

// Sync internal value when parent updates modelValue
watch(() => props.modelValue, value => {
  internalValue.value = value
})

const showClearButton = computed(() => !!internalValue.value && !props.readonly && !props.disabled)

function handleChange (event: Event) {
  const target = event.target as HTMLInputElement
  emit('change', target.value)
}

function handleInput (event: Event) {
  const target = event.target as HTMLInputElement
  internalValue.value = target.value
  emit('update:modelValue', target.value)
}

function clearInput () {
  internalValue.value = undefined
  emit('update:modelValue', undefined)
  emit('change', undefined)
}
</script>

<template>
  <InputGroup
    :class="props.class"
    :data-disabled="disabled || undefined"
  >
    <InputGroupAddon
      v-if="$slots.prefix"
      align="inline-start"
    >
      <slot name="prefix" />
    </InputGroupAddon>
    <InputGroupInput
      :modelValue="internalValue"
      v-bind="$attrs"
      :readonly="readonly"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      :data-1p-ignore="autocomplete === 'off' || !autocomplete ? true : undefined"
      :autocomplete="autocomplete || 'off'"
      @input="handleInput"
      @change="handleChange"
    />
    <InputGroupAddon
      v-if="showClearButton"
      align="inline-end"
    >
      <InputGroupButton
        size="icon-xs"
        @click="clearInput"
      >
        <Icon name="x" />
      </InputGroupButton>
    </InputGroupAddon>
    <InputGroupAddon
      v-if="$slots.suffix"
      align="inline-end"
    >
      <slot name="suffix" />
    </InputGroupAddon>
  </InputGroup>
</template>
