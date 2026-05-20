<script setup lang="ts">
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../shadcn/field'
import type { FormItemProps } from './types'

const props = defineProps<FormItemProps>()

defineSlots<{
  default?: () => any
  description?: () => any
}>()

useFormItemInvalid(() => !!props.error)

const errorArray = computed(() => {
  if (!props.error) return undefined
  return [{ message: props.error }]
})

const labelClass = computed(() => {
  const base = 'group-data-[invalid=true]/field:text-foreground'
  if (props.orientation === 'horizontal') return cn(base, `
    mt-2 justify-end text-right
  `)
  if (props.orientation === 'responsive') return cn(base, `
    @md/field-group:justify-end @md/field-group:text-right @md/field-group:mt-2
  `)
  return base
})
</script>

<template>
  <Field
    :orientation="orientation"
    :class="props.class"
    :data-invalid="!!error || undefined"
  >
    <FieldLabel
      v-if="label"
      :class="labelClass"
    >
      <div>
        {{ label }}
        <span
          v-if="required"
          class="text-danger"
          aria-hidden="true"
        >
          *
        </span>
      </div>
    </FieldLabel>
    <FieldContent>
      <slot />
      <FieldDescription v-if="description || $slots.description">
        <slot name="description">
          {{ description }}
        </slot>
      </FieldDescription>
      <FieldError :errors="errorArray" />
    </FieldContent>
  </Field>
</template>
