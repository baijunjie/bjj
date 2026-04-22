<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@bjj/nuxt-layer-shadcn-ui/app/components/shadcn/dialog'
import type { ModalProps } from './types'

const props = withDefaults(defineProps<ModalProps>(), {
  showClose: true,
  title: undefined,
  description: undefined,
  confirmText: undefined,
  cancelText: undefined,
  content: undefined,
  confirmVariant: 'default',
  cancelVariant: 'outline',
  type: undefined,
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

const dialogOpen = computed({
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
  cn(
    'gap-0 py-0',
    props.alignCenter && 'text-center',
    props.class,
  ),
)
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogContent
      :class="contentClass"
      :showCloseButton="false"
      @pointerDownOutside.prevent
      @closeAutoFocus="emit('closed')"
    >
      <!-- Header -->
      <DialogHeader
        v-if="!hideHeader && (!!title || !!description || !!$slots.header)"
        :class="cn('pt-5', alignCenter && 'items-center')"
      >
        <DialogTitle>
          <slot name="header">
            {{ title }}
          </slot>
        </DialogTitle>
        <DialogDescription v-if="description">
          {{ description }}
        </DialogDescription>
        <DialogDescription
          v-else
          class="sr-only"
        />
      </DialogHeader>

      <!-- A11y fallback: DialogTitle/DialogDescription required by reka-ui -->
      <template v-else>
        <DialogTitle class="sr-only">
          {{ title }}
        </DialogTitle>
        <DialogDescription class="sr-only" />
      </template>

      <!-- Content -->
      <ScrollArea
        fadeMask
        class="my-5 max-h-[60vh]"
      >
        <ModalContent
          :type="type"
          :content="content"
          :inert="loading || disabled || undefined"
          :class="[ loading || disabled ? 'opacity-50' : undefined ]"
          class="p-1"
        >
          <slot />
        </ModalContent>
      </ScrollArea>

      <!-- Footer -->
      <DialogFooter
        v-if="!hideFooter"
        class="pb-5"
      >
        <slot name="footer">
          <!-- Left side slot -->
          <div class="min-w-0 flex-1">
            <slot name="footerLeft" />
          </div>

          <!-- Right side buttons -->
          <div
            class="flex shrink-0 gap-4"
            :class="[ alignCenter ? 'justify-center' : 'justify-end' ]"
          >
            <Button
              v-if="showCancel"
              class="min-w-32"
              :variant="cancelVariant"
              :disabled="loading"
              @click="onCancel"
            >
              {{ resolvedCancelText }}
            </Button>
            <Button
              :class="showCancel ? 'min-w-32' : 'min-w-48'"
              :variant="confirmVariant"
              :loading="loading"
              :disabled="disabled || confirmDisabled"
              @click="onConfirm"
            >
              {{ resolvedConfirmText }}
            </Button>
          </div>
        </slot>
      </DialogFooter>

      <DialogClose
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
      </DialogClose>
    </DialogContent>
  </Dialog>
</template>

<style>
/* Translucent blur backdrop. DialogOverlay is rendered inside DialogPortal
   (outside component scope), so use a non-scoped style. */
[data-slot='dialog-overlay'] {
  z-index: 200;
  background-color: rgba(252, 252, 252, 0.3);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}
.dark [data-slot='dialog-overlay'] {
  background-color: rgba(25, 25, 25, 0.3);
}
/* Raise above layout header (z-100) so the dialog covers it. */
[data-slot='dialog-content'] {
  z-index: 200;
}
</style>
