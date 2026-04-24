<script setup lang="ts">
import { Toaster as ShadcnSonner } from '../../shadcn/sonner'
import 'vue-sonner/style.css'
import type { ToastProps } from './types'

defineProps<ToastProps>()
</script>

<template>
  <ShadcnSonner
    :position="position ?? 'bottom-right'"
    :duration="5000"
    richColors
    closeButton
    :style="{
      '--normal-bg': 'var(--color-popover)',
      '--normal-text': 'var(--color-popover-foreground)',
      '--normal-border': 'var(--color-border)',
    }"
  />
</template>
