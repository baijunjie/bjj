<script setup lang="ts">
import { Progress as ShadcnProgress } from '../../shadcn/progress'
import type { ProgressProps } from './types'

defineProps<ProgressProps>()
</script>

<template>
  <ShadcnProgress />
</template>
