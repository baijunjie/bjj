<script setup lang="ts">
import { Switch as ShadcnSwitch } from '../../shadcn/switch'
import type { SwitchProps } from './types'

const props = defineProps<SwitchProps>()

// Reka toggles on click (pointer and Space) and on Enter via its own keydown
// handler, so both events need a capture-phase guard when readonly
function handleClickCapture (event: Event) {
  if (props.readonly) {
    event.preventDefault()
    event.stopPropagation()
  }
}

function handleKeydownCapture (event: KeyboardEvent) {
  if (props.readonly && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    event.stopPropagation()
  }
}
</script>

<template>
  <ShadcnSwitch
    :aria-readonly="readonly || undefined"
    @click.capture="handleClickCapture"
    @keydown.capture="handleKeydownCapture"
  />
</template>
