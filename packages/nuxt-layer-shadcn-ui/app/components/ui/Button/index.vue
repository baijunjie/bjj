<script setup lang="ts">
import { Button as ShadcnButton } from '../../shadcn/button'
import WebLink from '@bjj/nuxt-layer-shadcn-ui/app/components/ui/WebLink/index.vue'
import type { ButtonProps } from './types'

const props = defineProps<ButtonProps>()
const mergedClass = computed(() => cn('cursor-pointer', props.rounded && `
  rounded-full
`, props.class))

const isLink = computed(() => !!props.href || !!props.to)
const hasIcon = computed(() => !!$slots.icon || !!props.icon)
const isIconEnd = computed(() => props.iconPosition === 'end')
const $slots = defineSlots<{
  default?: () => any
  icon?: () => any
}>()
</script>

<template>
  <ShadcnButton
    :class="mergedClass"
    :asChild="isLink"
    :type="isLink ? undefined : 'button'"
    :disabled="loading || disabled"
  >
    <component
      :is="isLink ? WebLink : 'span'"
      :class="isLink ? undefined : 'contents'"
      v-bind="isLink ? { unstyled: true, href, to, target } : {}"
    >
      <!-- Start: icon or loading -->
      <template v-if="!isIconEnd">
        <Icon
          v-if="loading"
          name="loader-circle"
          class="animate-spin"
        />
        <slot
          v-else-if="hasIcon"
          name="icon"
        >
          <Icon :name="icon!" />
        </slot>
      </template>
      <slot />
      <!-- End: icon or loading -->
      <template v-if="isIconEnd">
        <Icon
          v-if="loading"
          name="loader-circle"
          class="animate-spin"
        />
        <slot
          v-else-if="hasIcon"
          name="icon"
        >
          <Icon :name="icon!" />
        </slot>
      </template>
    </component>
  </ShadcnButton>
</template>
