<script setup lang="ts">
import { isVNode } from 'vue'
import type { ModalContentProps, ModalContentType } from './types'

const typeIconNameMap: Partial<Record<ModalContentType, string>> = {
  success: 'circle-check',
  info: 'info',
  help: 'circle-question-mark',
  warn: 'triangle-alert',
  danger: 'circle-alert',
  error: 'circle-x',
}

const typeIconClasses: Record<ModalContentType, string> = {
  default: 'text-secondary-foreground',
  success: 'text-success',
  info: 'text-info',
  help: 'text-help',
  warn: 'text-warn',
  danger: 'text-danger',
  error: 'text-destructive',
}

const props = withDefaults(defineProps<ModalContentProps>(), {
  type: undefined,
  icon: undefined,
  content: undefined,
})

const iconName = computed(() => {
  if (props.icon) return props.icon
  if (props.type) return typeIconNameMap[props.type]
  return undefined
})

const iconClass = computed(() =>
  cn('size-8 shrink-0', props.type && typeIconClasses[props.type]),
)

// Check if content is HTMLElement
function isHTMLElement (value: unknown): value is HTMLElement {
  return value instanceof HTMLElement
}
</script>

<template>
  <div class="flex w-full items-center gap-4">
    <!-- Icon -->
    <Icon
      v-if="iconName"
      :name="iconName"
      :class="iconClass"
    />
    <!-- Content -->
    <div class="flex-1">
      <!-- VNode: render directly -->
      <component
        :is="content"
        v-if="isVNode(content)"
      />
      <!-- HTMLElement: mount via ref -->
      <div
        v-else-if="isHTMLElement(content)"
        ref="elementContainer"
      >
        <component :is="() => content" />
      </div>
      <!-- String: render as text with whitespace preserved -->
      <span
        v-else-if="content"
        class="whitespace-pre-wrap"
      >
        {{ content }}
      </span>
      <!-- Fallback to slot -->
      <slot v-else />
    </div>
  </div>
</template>
