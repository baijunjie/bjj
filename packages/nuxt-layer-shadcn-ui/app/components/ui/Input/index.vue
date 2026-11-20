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

// Size classes read the shared control scale (see `data-control-size`).
const groupClass = computed(() => cn(
  `
    h-(--control-height)
    has-[>[data-align=inline-end]]:[&>input]:pr-(--control-gap)
    has-[>[data-align=inline-start]]:[&>input]:pl-(--control-gap)
  `,
  props.class,
))
// The inner input fills the group so a compact tier doesn't leave it overflowing.
const inputClass = `
  h-full px-(--control-px)
  md:text-(length:--control-font-size) md:leading-(--control-line-height)
`
const addonClass = `
  text-(length:--control-font-size) leading-(--control-line-height)
  data-[align=inline-start]:pl-(--control-px) data-[align=inline-end]:pr-(--control-px)
  [&>svg]:size-(--control-icon)
`

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
    :class="groupClass"
    :data-disabled="disabled || undefined"
    :data-control-size="size"
  >
    <InputGroupAddon
      v-if="slots.prefix"
      align="inline-start"
      :class="addonClass"
    >
      <slot name="prefix" />
    </InputGroupAddon>
    <InputGroupInput
      :modelValue="internalValue"
      :class="inputClass"
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
      :class="addonClass"
    >
      <InputGroupButton
        type="button"
        size="icon-xs"
        class="size-(--control-addon-button-size)"
        @click="clearInput"
      >
        <Icon
          name="x"
          class="size-(--control-icon)"
        />
      </InputGroupButton>
    </InputGroupAddon>
    <InputGroupAddon
      v-if="showCount"
      align="inline-end"
      :class="addonClass"
    >
      <InputGroupText
        class="
          text-(length:--control-font-size) leading-(--control-line-height)
        "
      >
        {{ countText }}
      </InputGroupText>
    </InputGroupAddon>
    <InputGroupAddon
      v-if="slots.suffix"
      align="inline-end"
      :class="addonClass"
    >
      <slot name="suffix" />
    </InputGroupAddon>
  </InputGroup>
</template>
