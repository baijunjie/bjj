<script setup lang="ts">
import type { HelpProps } from './types'

const props = withDefaults(defineProps<HelpProps>(), {
  text: undefined,
  position: 'top',
  class: undefined,
})

defineSlots<{
  default?: () => any
}>()

const mergedClass = computed(() =>
  cn(
    `
      text-muted-foreground
      hover:text-foreground
      flex items-center justify-center transition-colors
    `,
    props.class,
  ),
)
</script>

<template>
  <Tooltip
    :text="text"
    :position="position"
  >
    <div :class="mergedClass">
      <slot>
        <Icon
          name="circle-question-mark"
          class="cursor-help"
        />
      </slot>
    </div>
  </Tooltip>
</template>
