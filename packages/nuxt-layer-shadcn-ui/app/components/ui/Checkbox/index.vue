<script setup lang="ts">
import { Checkbox as ShadcnCheckbox } from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/checkbox'
import type { CheckboxProps } from './types'

defineProps<CheckboxProps>()
</script>

<template>
  <ShadcnCheckbox
    v-slot="{ state }"
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
