<script setup lang="ts">
import { Switch as ShadcnSwitch } from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/switch'
import type { SwitchProps } from './types'

defineProps<SwitchProps>()
</script>

<template>
  <ShadcnSwitch />
</template>
