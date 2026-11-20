<script setup lang="ts">
import { Button as ShadcnButton } from '../../shadcn/button'
import WebLink from '@bjj/nuxt-layer-shadcn-ui/app/components/ui/WebLink/index.vue'
import type { ControlSize } from '../../../types/control'
import type { ButtonProps } from './types'

const props = defineProps<ButtonProps>()

const variantClasses: Partial<Record<NonNullable<ButtonVariant>, string>> = {
  outline: `
    bg-transparent
    dark:bg-transparent
    border-current/20
    dark:border-current/20
    hover:bg-current/10
    dark:hover:bg-current/10
    hover:text-current
  `,
  ghost: `
    hover:bg-current/10
    dark:hover:bg-current/10
    hover:text-current
  `,
  link: 'text-current',
}

const isIconOnly = computed(() => props.size?.startsWith('icon') ?? false)

// `icon` is the default tier; `icon-sm` → `sm` …
const tier = computed<ControlSize | undefined>(() => {
  if (!props.size) return undefined
  if (props.size === 'icon') return 'default'
  return props.size.replace('icon-', '') as ControlSize
})

// Dimensions come from the shared control scale (see `data-control-size`) so a
// button lines up with the inputs of the same tier.
const sizeClass = computed(() => isIconOnly.value
  ? 'size-(--control-height) p-0 has-[>svg]:p-0'
  : `
    h-(--control-height) gap-(--control-gap) px-(--control-button-px)
    has-[>svg]:px-(--control-button-icon-px)
  `,
)

const mergedClass = computed(() => cn(
  `
    cursor-pointer text-(length:--control-font-size)
    leading-(--control-line-height)
  `,
  sizeClass.value,
  props.variant && variantClasses[props.variant],
  props.rounded && 'rounded-full',
  props.class,
))

const isLink = computed(() => !!props.href || !!props.to)
const hasIcon = computed(() => !!slots.icon || !!props.icon)
const isIconEnd = computed(() => props.iconPosition === 'end')
const slots = defineSlots<{
  default?: () => any
  icon?: () => any
}>()
</script>

<template>
  <ShadcnButton
    :variant="variant"
    :data-control-size="tier"
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
          class="animate-spin size-(--control-icon)"
        />
        <slot
          v-else-if="hasIcon"
          name="icon"
        >
          <Icon
            :name="icon!"
            class="size-(--control-icon)"
          />
        </slot>
      </template>
      <slot />
      <!-- End: icon or loading -->
      <template v-if="isIconEnd">
        <Icon
          v-if="loading"
          name="loader-circle"
          class="animate-spin size-(--control-icon)"
        />
        <slot
          v-else-if="hasIcon"
          name="icon"
        >
          <Icon
            :name="icon!"
            class="size-(--control-icon)"
          />
        </slot>
      </template>
    </component>
  </ShadcnButton>
</template>
