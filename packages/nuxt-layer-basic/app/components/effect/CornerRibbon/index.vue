<script setup lang="ts">
type CornerRibbonPosition = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'

const props = withDefaults(defineProps<{
  label?: string
  position?: CornerRibbonPosition
  /** Extra distance (px) from the anchored corner — larger pushes the ribbon inward */
  offset?: number
}>(), {
  label: '',
  position: 'top-left',
  offset: 0,
})

const positionClasses = computed(() => {
  switch (props.position) {
    case 'top-right':
      return 'top-0 right-0 origin-top translate-x-1/2 -translate-y-1/2 rotate-45'
    case 'bottom-right':
      return 'bottom-0 right-0 origin-bottom translate-x-1/2 translate-y-1/2 -rotate-45'
    case 'bottom-left':
      return 'bottom-0 left-0 origin-bottom -translate-x-1/2 translate-y-1/2 rotate-45'
    case 'top-left':
    default:
      return 'top-0 left-0 origin-top -translate-x-1/2 -translate-y-1/2 -rotate-45'
  }
})

// Inset from the corner. The cross-axis (vertical) inset is half a line taller than the
// along-axis (horizontal) one so the label stays centered on the corner's diagonal; `offset`
// shifts the ribbon inward along that diagonal by adding to both sides equally.
const offsetStyle = computed(() => {
  const cross = `${20 + props.offset}px`
  const along = `${8 + props.offset}px`
  switch (props.position) {
    case 'top-right':
      return { marginTop: cross, marginRight: along }
    case 'bottom-right':
      return { marginBottom: cross, marginRight: along }
    case 'bottom-left':
      return { marginBottom: cross, marginLeft: along }
    case 'top-left':
    default:
      return { marginTop: cross, marginLeft: along }
  }
})
</script>

<template>
  <div
    v-if="label"
    :class="[
      `
        pointer-events-none fixed z-1000 w-full bg-purple-600 text-center text-sm
        font-semibold text-white
        dark:bg-purple-500
      `,
      positionClasses,
    ]"
    :style="offsetStyle"
  >
    {{ label }}
  </div>
</template>
