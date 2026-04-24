<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { WebLinkProps } from './types'

const props = withDefaults(defineProps<WebLinkProps>(), {
  href: undefined,
  to: undefined,
  target: undefined,
  externalIcon: false,
  class: undefined,
})

const localePath = useLocalePath()

const isExternal = computed(() => props.href ? isUrl(props.href) : false)

const showExternalIcon = computed(() => props.externalIcon && isExternal.value)

// Compute the final destination (supports both href string and to route object)
const finalTo = computed<RouteLocationRaw | undefined>(() => {
  if (props.to) return props.to
  if (props.href) {
    // Apply locale path for internal links only
    return isExternal.value ? props.href : localePath(props.href)
  }
  return undefined
})
const finalTarget = computed(() => {
  if (props.target) return props.target
  // Auto set _blank for external links
  return isExternal.value ? '_blank' : undefined
})
const finalRel = computed(() => {
  // Add security attrs for external links opening in new tab
  return finalTarget.value === '_blank' ? 'noopener noreferrer' : undefined
})

// Merge default class with external class
const mergedClass = computed(() => {
  if (props.unstyled) {
    return props.class
  }
  return cn('text-info underline', props.class)
})
</script>

<template>
  <NuxtLink
    :to="finalTo"
    :target="finalTarget"
    :rel="finalRel"
    :class="mergedClass"
  >
    <slot />
    <Icon
      v-if="showExternalIcon"
      name="external-link"
      class="ml-0.5 inline size-[1em] align-[-0.125em]"
    />
  </NuxtLink>
</template>
