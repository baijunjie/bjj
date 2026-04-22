<script setup lang="ts">
import {
  Card as ShadcnCard,
  CardContent as ShadcnCardContent,
  CardFooter as ShadcnCardFooter,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
} from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/card'
import type { CardProps } from './types'

defineProps<CardProps>()
</script>

<template>
  <ShadcnCard>
    <ShadcnCardHeader v-if="title || $slots.header">
      <slot name="header">
        <ShadcnCardTitle>{{ title }}</ShadcnCardTitle>
      </slot>
    </ShadcnCardHeader>
    <ShadcnCardContent>
      <slot />
    </ShadcnCardContent>
    <ShadcnCardFooter v-if="$slots.footer">
      <slot name="footer" />
    </ShadcnCardFooter>
  </ShadcnCard>
</template>
