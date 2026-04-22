import type { MaybeRefOrGetter, Ref } from 'vue'
import { nextTick, onMounted, ref, toValue } from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'

export interface ScrollState {
  /** Whether content overflows the container */
  isOverflowing: Readonly<Ref<boolean>>
  /** Whether scrolled to the start (top or left) */
  atStart: Readonly<Ref<boolean>>
  /** Whether scrolled to the end (bottom or right) */
  atEnd: Readonly<Ref<boolean>>
}

/**
 * Track scroll state of a scrollable element.
 *
 * @param el - The scrollable element ref
 * @param direction - Scroll axis to track: 'vertical' (default) or 'horizontal'
 */
export function useScrollState (
  el: MaybeRefOrGetter<HTMLElement | undefined>,
  direction: 'vertical' | 'horizontal' = 'vertical',
): ScrollState {
  const isOverflowing = ref(false)
  const atStart = ref(true)
  const atEnd = ref(true)

  function update () {
    const target = toValue(el)
    if (!target) return

    if (direction === 'vertical') {
      const { scrollTop, scrollHeight, clientHeight } = target
      isOverflowing.value = scrollHeight > clientHeight + 1
      atStart.value = scrollTop <= 1
      atEnd.value = scrollTop + clientHeight >= scrollHeight - 1
    } else {
      const { scrollLeft, scrollWidth, clientWidth } = target
      isOverflowing.value = scrollWidth > clientWidth + 1
      atStart.value = scrollLeft <= 1
      atEnd.value = scrollLeft + clientWidth >= scrollWidth - 1
    }
  }

  onMounted(() => nextTick(update))

  useEventListener(el, 'scroll', update, { passive: true })
  useResizeObserver(el, update)

  return { isOverflowing, atStart, atEnd }
}
