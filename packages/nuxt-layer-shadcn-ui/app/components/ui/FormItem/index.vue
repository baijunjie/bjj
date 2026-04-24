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

const errorArray = computed(() => {
  if (!props.error) return undefined
  return [{ message: props.error }]
})

const labelClass = computed(() => {
  if (props.orientation === 'horizontal') return '!flex-initial mt-2'
  if (props.orientation === 'responsive') return '@md/field-group:!flex-initial @md/field-group:mt-2'
  return undefined
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
