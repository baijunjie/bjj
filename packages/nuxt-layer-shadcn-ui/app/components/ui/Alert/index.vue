<script setup lang="ts">
import { Alert as ShadcnAlert } from '../../shadcn/alert'
import type { AlertProps, AlertType } from './types'

const typeIconNameMap: Partial<Record<AlertType, string>> = {
  success: 'circle-check',
  info: 'info',
  help: 'circle-question-mark',
  warn: 'triangle-alert',
  danger: 'circle-x',
}

const typeClasses: Record<AlertType, string> = {
  default: 'border-border! bg-secondary text-secondary-foreground [&>svg]:text-secondary-foreground',
  success: 'border-success/50! bg-success/10 text-success [&>svg]:text-success',
  info: 'border-info/50! bg-info/10 text-info [&>svg]:text-info',
  help: 'border-help/50! bg-help/10 text-help [&>svg]:text-help',
  warn: 'border-warn/50! bg-warn/10 text-warn [&>svg]:text-warn',
  danger: 'border-danger/50! bg-danger/10 text-danger [&>svg]:text-danger',
}

const props = withDefaults(defineProps<AlertProps>(), {
  type: 'default',
  icon: undefined,
  class: undefined,
})

const defaultIconName = computed(() => {
  // null explicitly hides the icon; any truthy value is an explicit icon.
  if (props.icon || props.icon === null) return undefined
  return typeIconNameMap[props.type]
})

const mergedClass = computed(() =>
  cn(
    typeClasses[props.type],
    props.class,
  ),
)
</script>

<template>
  <ShadcnAlert :class="mergedClass">
    <Icon
      v-if="typeof icon === 'string' && icon"
      :name="icon"
    />
    <component
      :is="icon"
      v-else-if="icon"
      class="size-4"
    />
    <Icon
      v-else-if="defaultIconName"
      :name="defaultIconName"
    />
    <div class="col-start-2">
      <slot />
    </div>
  </ShadcnAlert>
</template>
