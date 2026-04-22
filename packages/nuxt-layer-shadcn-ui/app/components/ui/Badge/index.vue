<script setup lang="ts">
import { Badge as ShadcnBadge } from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/badge'
import type { BadgeProps } from './types'

defineProps<BadgeProps>()
</script>

<template>
  <ShadcnBadge>
    <slot />
  </ShadcnBadge>
</template>
