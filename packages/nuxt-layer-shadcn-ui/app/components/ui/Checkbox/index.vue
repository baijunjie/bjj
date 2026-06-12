<script setup lang="ts">
import { Checkbox as ShadcnCheckbox } from '../../shadcn/checkbox'
import type { CheckboxProps } from './types'

const props = defineProps<CheckboxProps>()

const isInvalid = useFormItemInvalid(() => props.invalid)

// Reka's toggle runs on click; both keyboard and pointer activation emit a
// click event, so a capture-phase guard blocks every toggle path when readonly
function handleClickCapture (event: Event) {
  if (props.readonly) {
    event.preventDefault()
    event.stopPropagation()
  }
}
</script>

<template>
  <ShadcnCheckbox
    v-slot="{ state }"
    :aria-invalid="isInvalid || undefined"
    :aria-readonly="readonly || undefined"
    class="
      data-[state=indeterminate]:border-primary
      data-[state=indeterminate]:bg-primary
      data-[state=indeterminate]:text-primary-foreground
    "
    @click.capture="handleClickCapture"
  >
    <Icon
      v-if="state === 'indeterminate'"
      name="minus"
      class="size-3.5"
    />
  </ShadcnCheckbox>
</template>
