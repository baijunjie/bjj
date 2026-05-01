<script setup lang="ts">
import { Badge as ShadcnBadge } from '../../shadcn/badge'
import type { BadgeProps } from './types'

defineProps<BadgeProps>()
</script>

<template>
  <ShadcnBadge :variant="variant">
    <slot />
  </ShadcnBadge>
</template>
