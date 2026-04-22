<script setup lang="ts">
import type { HelpProps } from './types'

const props = withDefaults(defineProps<HelpProps>(), {
  text: undefined,
  position: 'top',
  class: undefined,
})

const mergedClass = computed(() =>
  cn(
    `
      flex items-center justify-center text-muted-foreground transition-colors
      hover:text-foreground
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
