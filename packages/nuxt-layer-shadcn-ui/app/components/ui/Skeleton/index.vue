<script setup lang="ts">
import { Skeleton as ShadcnSkeleton } from '../../shadcn/skeleton'
import type { SkeletonProps } from './types'

defineProps<SkeletonProps>()
</script>

<template>
  <ShadcnSkeleton
    :style="{ width, height }"
  />
</template>
