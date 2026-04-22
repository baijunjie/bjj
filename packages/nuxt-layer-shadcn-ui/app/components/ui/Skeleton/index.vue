<script setup lang="ts">
import { Skeleton as ShadcnSkeleton } from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/skeleton'
import type { SkeletonProps } from './types'

defineProps<SkeletonProps>()
</script>

<template>
  <ShadcnSkeleton
    :style="{ width, height }"
  />
</template>
