<script setup lang="ts">
import {
  ScrollArea as ShadcnScrollArea,
} from '../../shadcn/scroll-area'
import { useResizeObserver } from '@vueuse/core'
import type { ScrollAreaProps } from './types'

const props = defineProps<ScrollAreaProps>()

const rootRef = ref<InstanceType<typeof ShadcnScrollArea>>()
const viewportEl = ref<HTMLElement>()

const { isOverflowing, atStart, atEnd } = useScrollState(viewportEl)

onMounted(() => {
  const root = rootRef.value?.$el as HTMLElement | undefined
  viewportEl.value = root?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]') ?? undefined

  // Observe content wrapper to detect content size changes
  const contentEl = viewportEl.value?.firstElementChild as HTMLElement | undefined
  if (contentEl) {
    useResizeObserver(contentEl, () => {
      // Trigger re-evaluation by briefly toggling the ref
      const el = viewportEl.value
      viewportEl.value = undefined
      nextTick(() => {
        viewportEl.value = el
      })
    })
  }
})

// Only keep viewport in the tab order when content actually overflows;
// otherwise reka-ui's FocusScope auto-focus lands on an unscrollable container.
watchEffect(() => {
  const el = viewportEl.value
  if (!el) return
  el.setAttribute('tabindex', isOverflowing.value ? '0' : '-1')
})

const FADE_SIZE = '1.25rem'

const maskStyle = computed(() => {
  if (!props.fadeMask || !isOverflowing.value) return undefined
  if (atStart.value && atEnd.value) return undefined

  if (atStart.value) {
    return { maskImage: `linear-gradient(to bottom, #000 calc(100% - ${FADE_SIZE}), transparent 100%)` }
  }
  if (atEnd.value) {
    return { maskImage: `linear-gradient(to bottom, transparent 0, #000 ${FADE_SIZE})` }
  }
  return { maskImage: `linear-gradient(to bottom, transparent 0, #000 ${FADE_SIZE}, #000 calc(100% - ${FADE_SIZE}), transparent 100%)` }
})
</script>

<template>
  <ShadcnScrollArea
    ref="rootRef"
    :style="maskStyle"
  >
    <slot />
  </ShadcnScrollArea>
</template>
