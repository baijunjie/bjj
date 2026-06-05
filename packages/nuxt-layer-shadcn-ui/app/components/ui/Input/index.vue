<script setup lang="ts">
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '../../shadcn/input-group'
import type { InputProps } from './types'

defineOptions({ inheritAttrs: false })

const props = defineProps<InputProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
  'change': [value: string | undefined]
}>()

const isInvalid = useFormItemInvalid(() => props.invalid)

const slots = defineSlots<{
  prefix?: () => any
  suffix?: () => any
}>()

// Internal value tracks the actual input content, independent of parent's modelValue
const internalValue = ref(props.modelValue)

// Sync internal value when parent updates modelValue
watch(() => props.modelValue, value => {
  internalValue.value = value
})

const showClearButton = computed(() => !!internalValue.value && !props.readonly && !props.disabled)

const countText = computed(() => {
  const length = internalValue.value?.length ?? 0
  return props.maxlength === undefined ? `${length}` : `${length} / ${props.maxlength}`
})

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
      v-if="slots.prefix"
      align="inline-start"
    >
      <slot name="prefix" />
    </InputGroupAddon>
    <InputGroupInput
      :modelValue="internalValue"
      v-bind="$attrs"
      :readonly="readonly"
      :disabled="disabled"
      :maxlength="maxlength"
      :aria-invalid="isInvalid || undefined"
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
        type="button"
        size="icon-xs"
        @click="clearInput"
      >
        <Icon name="x" />
      </InputGroupButton>
    </InputGroupAddon>
    <InputGroupAddon
      v-if="showCount"
      align="inline-end"
    >
      <InputGroupText>{{ countText }}</InputGroupText>
    </InputGroupAddon>
    <InputGroupAddon
      v-if="slots.suffix"
      align="inline-end"
    >
      <slot name="suffix" />
    </InputGroupAddon>
  </InputGroup>
</template>
