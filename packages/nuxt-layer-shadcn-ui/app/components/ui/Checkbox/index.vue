<script setup lang="ts">
import { Checkbox as ShadcnCheckbox } from '../../shadcn/checkbox'
import type { CheckboxProps } from './types'

const props = defineProps<CheckboxProps>()

const isInvalid = useFormItemInvalid(() => props.invalid)
</script>

<template>
  <ShadcnCheckbox
    v-slot="{ state }"
    :aria-invalid="isInvalid || undefined"
    class="
      data-[state=indeterminate]:border-primary
      data-[state=indeterminate]:bg-primary
      data-[state=indeterminate]:text-primary-foreground
    "
  >
    <Icon
      v-if="state === 'indeterminate'"
      name="minus"
      class="size-3.5"
    />
  </ShadcnCheckbox>
</template>
