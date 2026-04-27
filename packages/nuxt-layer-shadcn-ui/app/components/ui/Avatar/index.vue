<script setup lang="ts">
import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from '../../shadcn/avatar'
import type { AvatarProps } from './types'

const props = withDefaults(defineProps<AvatarProps>(), {
  image: undefined,
  label: undefined,
  fallbackLabel: undefined,
  size: 'normal',
  shape: 'circle',
  class: undefined,
})

// Map our size names to shadcn avatar variant sizes
const sizeClasses: Record<string, string> = {
  small: 'size-8 text-xs',
  normal: 'size-10 text-sm',
  large: 'size-12 text-base',
  xlarge: 'size-16 text-lg',
}

const effectiveLabel = computed(() => props.fallbackLabel || props.label)

const mergedClass = computed(() =>
  cn(
    sizeClasses[props.size],
    props.shape === 'square' && `
      rounded-md!
      **:rounded-md!
    `,
    props.class,
  ),
)
</script>

<template>
  <ShadcnAvatar
    :class="mergedClass"
  >
    <AvatarImage
      v-if="image"
      :src="image"
    />
    <AvatarFallback class="font-medium text-muted-foreground">
      <slot>{{ effectiveLabel }}</slot>
    </AvatarFallback>
  </ShadcnAvatar>
</template>
