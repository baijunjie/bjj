<script setup lang="ts">
import type { CopyButtonProps } from './types'

defineOptions({ inheritAttrs: false })

const props = defineProps<CopyButtonProps>()

const T = useTranslations('components.ui.CopyButton')

const isCopied = ref(false)

const tooltipText = computed(() => {
  if (isCopied.value) {
    return props.afterCopyText || T('copied')
  }
  return props.beforeCopyText || T('copyToClipboard')
})

async function copyToClipboard () {
  if (!props.copy) return

  try {
    await navigator.clipboard.writeText(props.copy)
  } catch (err) {
    console.error('Clipboard API failed, falling back to execCommand:', err)
    const textarea = document.createElement('textarea')
    textarea.value = props.copy
    textarea.style.position = 'absolute'
    textarea.style.opacity = '0'
    textarea.style.pointerEvents = 'none'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }

  isCopied.value = true
}

function resetCopiedState () {
  // Delay reset until tooltip exit animation (150ms) completes
  setTimeout(() => {
    isCopied.value = false
  }, 150)
}
</script>

<template>
  <Tooltip
    :text="tooltipText"
    disableClosingTrigger
    @close="resetCopiedState"
  >
    <Button
      :size="$slots.default ? undefined : 'icon'"
      v-bind="$attrs"
      @click="copyToClipboard"
    >
      <div
        v-if="$slots.default"
        class="flex-1"
      >
        <slot />
      </div>

      <div class="pointer-events-none flex w-[1em] items-center justify-center">
        <Transition
          name="copy-icon-fade"
          mode="out-in"
        >
          <Icon
            v-if="isCopied"
            key="check"
            name="check"
          />
          <Icon
            v-else
            key="copy"
            name="copy"
          />
        </Transition>
      </div>
    </Button>
  </Tooltip>
</template>

<style scoped>
.copy-icon-fade-enter-active {
  transition-duration: 200ms;
  transition-property: opacity, transform;
  transition-timing-function: ease;
}

.copy-icon-fade-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
</style>
