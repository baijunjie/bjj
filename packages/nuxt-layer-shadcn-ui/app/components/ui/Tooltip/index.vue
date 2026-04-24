<script setup lang="ts">
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../shadcn/tooltip'
import type { TooltipProps } from './types'

const props = withDefaults(defineProps<TooltipProps>(), {
  text: undefined,
  position: 'top',
  disabled: false,
  class: undefined,
})

const emit = defineEmits<{ open: [], close: []}>()

const { isMobile } = useDevice()

const sanitizedText = computed(() => props.text ? safeHtml(props.text) : '')
const shouldShow = computed(() => !!props.text && !props.disabled)

// Mobile: programmatic open via touch; Desktop: undefined = uncontrolled
const mobileOpen = ref<boolean | undefined>(undefined)

function onTouchStart () {
  if (isMobile.value) {
    mobileOpen.value = true
  }
}

function onOpenChange (value: boolean) {
  if (isMobile.value) {
    mobileOpen.value = value
  }
  if (value) {
    emit('open')
  } else {
    emit('close')
  }
}
</script>

<template>
  <TooltipProvider
    :delayDuration="isMobile ? 0 : 300"
    :disableClosingTrigger="disableClosingTrigger || isMobile"
  >
    <ShadcnTooltip
      :open="mobileOpen"
      @update:open="onOpenChange"
    >
      <TooltipTrigger
        asChild
        @touchstart.passive="onTouchStart"
      >
        <slot />
      </TooltipTrigger>
      <TooltipContent
        v-if="shouldShow"
        :side="position"
        class="max-w-[24rem]"
      >
        <span
          :class="props.class"
          v-html="sanitizedText"
        />
      </TooltipContent>
    </ShadcnTooltip>
  </TooltipProvider>
</template>
