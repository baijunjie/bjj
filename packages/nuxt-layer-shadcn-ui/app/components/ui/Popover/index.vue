<script setup lang="ts">
import {
  Popover as ShadcnPopover,
  PopoverContent,
  PopoverTrigger,
} from '../../shadcn/popover'
import type { PopoverProps } from './types'

const props = defineProps<PopoverProps>()
</script>

<template>
  <ShadcnPopover>
    <PopoverTrigger asChild>
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverContent :class="props.class">
      <slot />
    </PopoverContent>
  </ShadcnPopover>
</template>
