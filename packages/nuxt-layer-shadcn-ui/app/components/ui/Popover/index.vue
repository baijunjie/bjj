<script setup lang="ts">
import {
  Popover as ShadcnPopover,
  PopoverContent,
  PopoverTrigger,
} from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/popover'
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
