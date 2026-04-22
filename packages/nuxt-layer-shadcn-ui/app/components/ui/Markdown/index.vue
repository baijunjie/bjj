<script setup lang="ts">
import type { MarkdownProps } from './types'

defineProps<MarkdownProps>()
</script>

<template>
  <div
    class="markdown-body"
    :class="{ 'hide-title': hideTitle }"
  >
    <slot />
  </div>
</template>

<style>
@import './themes/github.css';

.markdown-body.hide-title > h1:first-child {
  display: none;
}
</style>
