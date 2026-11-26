<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../shadcn/field'
import type { FormItemProps } from './types'

const props = defineProps<FormItemProps>()

const slots = defineSlots<{
  default?: () => any
  /** Replaces the label text; the required asterisk is still appended */
  label?: () => any
  /** Inline content right after the label text and the required asterisk */
  labelSuffix?: () => any
  /** Extra content on the label row, aligned to the trailing edge */
  labelExtra?: () => any
  description?: () => any
}>()

const [ DefineLabelText, LabelText ] = createReusableTemplate()

useFormItemInvalid(() => !!props.error)

const { labelId, descriptionId, errorId, labelFor, groupLabelledby } = provideFormItemField({
  hasLabel: () => !!props.label || !!slots.label,
  hasDescription: () => !!props.description || !!slots.description,
  hasError: () => !!props.error,
})

const errorArray = computed(() => {
  if (!props.error) return undefined
  return [{ message: props.error }]
})

// Tighter gap between the label and the content below when stacked;
// horizontal layout keeps the default column gap
const fieldClass = computed(() => {
  if (props.orientation === 'horizontal') return props.class
  if (props.orientation === 'responsive') return cn(`
    gap-2
    @md/field-group:gap-3
  `, props.class)
  return cn('gap-2', props.class)
})

const labelBaseClass = 'group-data-[invalid=true]/field:text-foreground'

// Label alignment per orientation: applied to FieldLabel itself, or to the row
// wrapping FieldLabel and labelExtra when the labelExtra slot is used
const labelAlignClass = computed(() => {
  if (props.orientation === 'horizontal') return 'mt-2 justify-end text-right'
  if (props.orientation === 'responsive') return '@md/field-group:justify-end @md/field-group:text-right @md/field-group:mt-2'
  return ''
})

const labelClass = computed(() => cn(labelBaseClass, labelAlignClass.value))

const labelRowClass = computed(() => {
  const base = 'flex items-center gap-2'
  if (props.orientation === 'horizontal') return cn(base, 'flex-auto', labelAlignClass.value)
  if (props.orientation === 'responsive') return cn(base, `
    @md/field-group:flex-auto
  `, labelAlignClass.value)
  return base
})

// Pushed to the trailing edge when stacked; in horizontal layout the label column
// is already right-aligned, so labelExtra just follows the label
const labelExtraClass = computed(() => {
  const base = 'shrink-0 text-sm leading-snug'
  if (props.orientation === 'horizontal') return base
  if (props.orientation === 'responsive') return cn(base, `
    @md/field-group:ml-0
    ml-auto
  `)
  return cn(base, 'ml-auto')
})
</script>

<template>
  <Field
    :orientation="orientation"
    :class="fieldClass"
    :data-invalid="!!error || undefined"
    :aria-labelledby="groupLabelledby"
  >
    <DefineLabelText>
      <div :class="$slots.labelSuffix ? 'gap-1 flex items-center' : undefined">
        <slot name="label">
          {{ label }}
        </slot>
        <span
          v-if="required"
          class="text-danger"
          aria-hidden="true"
        >
          *
        </span>
        <span
          v-if="$slots.labelSuffix"
          data-slot="form-item-label-suffix"
          class="flex items-center"
        >
          <slot name="labelSuffix" />
        </span>
      </div>
    </DefineLabelText>
    <div
      v-if="$slots.labelExtra"
      data-slot="form-item-label-row"
      :class="labelRowClass"
    >
      <FieldLabel
        v-if="label || $slots.label"
        :id="labelId"
        :for="labelFor"
        :class="labelBaseClass"
      >
        <LabelText />
      </FieldLabel>
      <div
        data-slot="form-item-label-extra"
        :class="labelExtraClass"
      >
        <slot name="labelExtra" />
      </div>
    </div>
    <FieldLabel
      v-else-if="label || $slots.label"
      :id="labelId"
      :for="labelFor"
      :class="labelClass"
    >
      <LabelText />
    </FieldLabel>
    <FieldContent>
      <slot />
      <FieldDescription
        v-if="description || $slots.description"
        :id="descriptionId"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </FieldDescription>
      <FieldError
        :id="errorId"
        :errors="errorArray"
      />
    </FieldContent>
  </Field>
</template>
