<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../shadcn/dialog'
import type { ModalAction, ModalProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ModalProps>(), {
  modal: true,
  showCancel: true,
  showClose: true,
  closeOnClickOutside: false,
  title: undefined,
  description: undefined,
  confirmText: undefined,
  cancelText: undefined,
  content: undefined,
  confirmVariant: 'default',
  cancelVariant: 'outline',
  beforeClose: undefined,
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

const dialogOpen = ref(props.visible ?? false)
const internalLoading = ref(false)
const isLoading = computed(() => internalLoading.value || props.loading)

watch(() => props.visible, value => {
  if (value !== undefined) dialogOpen.value = value
})

watch(dialogOpen, value => {
  emit('update:visible', value)
  if (value) emit('open')
  else emit('close')
})

function onOpenUpdate (value: boolean) {
  if (!value && isLoading.value) return
  if (value) dialogOpen.value = true
  else handleClose('cancel')
}

function onConfirm () {
  emit('confirm')
  handleClose('confirm')
}

function onCancel () {
  emit('cancel')
  handleClose('cancel')
}

function handleClose (action: ModalAction) {
  if (!props.beforeClose) {
    dialogOpen.value = false
    return
  }
  const result = props.beforeClose(action)
  if (result === false) return
  if (result instanceof Promise) {
    internalLoading.value = true
    result.then(() => {
      dialogOpen.value = false
    }).finally(() => {
      internalLoading.value = false
    })
    return
  }
  dialogOpen.value = false
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
  <Dialog
    :open="dialogOpen"
    :modal="modal"
    @update:open="onOpenUpdate"
  >
    <DialogTrigger
      v-if="$slots.trigger"
      asChild
    >
      <slot name="trigger" />
    </DialogTrigger>

    <DialogContent
      v-bind="$attrs"
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
          :inert="isLoading || disabled || undefined"
          :class="[ isLoading || disabled ? 'opacity-50' : undefined ]"
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
              :disabled="isLoading"
              @click="onCancel"
            >
              {{ resolvedCancelText }}
            </Button>
            <Button
              :class="showCancel ? 'min-w-32' : 'min-w-48'"
              :variant="confirmVariant"
              :loading="isLoading"
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
        :disabled="isLoading"
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
