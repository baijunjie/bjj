<script setup lang="ts">
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../../shadcn/sheet'
import type { DrawerProps } from './types'

const props = withDefaults(defineProps<DrawerProps>(), {
  showClose: true,
  side: 'right',
  title: undefined,
  description: undefined,
  confirmText: undefined,
  cancelText: undefined,
  confirmVariant: 'default',
  cancelVariant: 'outline',
  class: undefined,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'open': []
  'close': []
  'closed': []
  'confirm': []
  'cancel': []
}>()

const { t } = useI18n()

const resolvedConfirmText = computed(
  () => props.confirmText ?? t('common.actions.confirm'),
)
const resolvedCancelText = computed(
  () => props.cancelText ?? t('common.actions.cancel'),
)

const sheetOpen = computed({
  get: () => props.visible ?? false,
  set: (value: boolean) => {
    if (!value && props.visible && !props.loading) {
      onCancel()
    }
  },
})

watch(() => props.visible, visible => {
  if (visible) emit('open')
  else emit('close')
})

function onConfirm () {
  emit('confirm')
  emit('update:visible', false)
}

function onCancel () {
  emit('cancel')
  emit('update:visible', false)
}

const contentClass = computed(() =>
  cn('flex flex-col gap-0 p-0', props.class),
)
</script>

<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent
      :side="side"
      :class="contentClass"
      @pointerDownOutside.prevent
      @closeAutoFocus="emit('closed')"
    >
      <!-- Header -->
      <SheetHeader
        v-if="!hideHeader && (!!title || !!description || !!$slots.header)"
        class="border-b"
      >
        <SheetTitle>
          <slot name="header">
            {{ title }}
          </slot>
        </SheetTitle>
        <SheetDescription v-if="description">
          {{ description }}
        </SheetDescription>
        <SheetDescription
          v-else
          class="sr-only"
        />
      </SheetHeader>

      <!-- A11y fallback: SheetTitle/SheetDescription required by reka-ui -->
      <template v-else>
        <SheetTitle class="sr-only">
          {{ title }}
        </SheetTitle>
        <SheetDescription class="sr-only" />
      </template>

      <!-- Content -->
      <ScrollArea
        fadeMask
        class="min-h-0 flex-1"
      >
        <div
          :inert="loading || disabled || undefined"
          :class="[ loading || disabled ? 'opacity-50' : undefined ]"
          class="p-4"
        >
          <slot />
        </div>
      </ScrollArea>

      <!-- Footer -->
      <SheetFooter
        v-if="!hideFooter"
        class="flex-row items-center border-t"
      >
        <slot name="footer">
          <div class="min-w-0 flex-1">
            <slot name="footerLeft" />
          </div>

          <div class="flex shrink-0 justify-end gap-4">
            <Button
              v-if="showCancel"
              class="min-w-24"
              :variant="cancelVariant"
              :disabled="loading"
              @click="onCancel"
            >
              {{ resolvedCancelText }}
            </Button>
            <Button
              :class="showCancel ? 'min-w-24' : 'min-w-32'"
              :variant="confirmVariant"
              :loading="loading"
              :disabled="disabled || confirmDisabled"
              @click="onConfirm"
            >
              {{ resolvedConfirmText }}
            </Button>
          </div>
        </slot>
      </SheetFooter>

      <SheetClose
        v-if="showClose"
        :disabled="loading"
        class="
          absolute top-3 right-3 flex size-8 items-center justify-center
          rounded-full text-muted-foreground ring-offset-background transition
          hover:bg-accent/50 hover:text-foreground
          focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden
          disabled:pointer-events-none disabled:opacity-50
        "
      >
        <Icon name="x" />
        <span class="sr-only">
          {{ t('common.actions.close') }}
        </span>
      </SheetClose>
    </SheetContent>
  </Sheet>
</template>

<style>
/* Translucent blur backdrop. SheetOverlay is rendered inside DialogPortal
   (outside component scope), so use a non-scoped style. */
[data-slot='sheet-overlay'] {
  background-color: rgba(252, 252, 252, 0.3);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}
.dark [data-slot='sheet-overlay'] {
  background-color: rgba(25, 25, 25, 0.3);
}

/* Hide SheetContent's hardcoded built-in close button (no data-slot);
   we render our own SheetClose above with loading-aware disable. */
[data-slot='sheet-content'] > button:not([data-slot]) {
  display: none;
}
</style>
