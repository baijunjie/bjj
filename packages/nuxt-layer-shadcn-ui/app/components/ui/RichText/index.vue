<script setup lang="ts">
import type { RichTextProps } from './types'
import { markdownToHtml } from './extensions'
import './style.css'

const props = withDefaults(defineProps<RichTextProps>(), {
  content: undefined,
  format: 'html',
  class: undefined,
})

// Sanitizing drops `target`, so links get it back afterwards, matching the editor's links
function openLinksInNewTab (html: string) {
  const template = document.createElement('template')
  template.innerHTML = html
  for (const link of template.content.querySelectorAll('a[href]')) {
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer nofollow')
  }
  return template.innerHTML
}

// Rendered in the browser only: the sanitizer passes HTML through untouched on the server
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const html = computed(() => {
  if (!mounted.value || !props.content) return ''
  const raw = props.format === 'markdown' ? markdownToHtml(props.content) : props.content
  return openLinksInNewTab(safeHtml(raw))
})
</script>

<template>
  <div
    :class="cn('rich-text', props.class)"
    v-html="html"
  />
</template>
