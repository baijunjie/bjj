<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../shadcn/dialog'
import type { ModalProps } from './types'

const props = withDefaults(defineProps<ModalProps>(), {
  showClose: true,
  closeOnClickOutside: false,
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
  () => props.confirmText || t('common.actions.confirm'),
)
const resolvedCancelText = computed(
  () => props.cancelText || t('common.actions.cancel'),
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

function onPointerDownOutside (event: Event) {
  if (!props.closeOnClickOutside) event.preventDefault()
}

const contentClass = computed(() =>
  cn(
    'bg-popover gap-0 py-0',
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
      @pointerDownOutside="onPointerDownOutside"
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
            class="gap-4 flex shrink-0"
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
          top-3 right-3 size-8 text-muted-foreground ring-offset-background
          hover:bg-accent/50 hover:text-foreground
          focus:ring-ring
          absolute flex items-center justify-center rounded-full transition
          focus:ring-2 focus:ring-offset-2 focus:outline-hidden
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
