<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import ToolbarPopover from './ToolbarPopover.vue'

const props = defineProps<{
  editor: Editor
  disabled?: boolean
}>()

const T = useTranslations('components.ui.RichTextEditor')

const open = ref(false)
const url = ref('')

const isActive = computed(() => props.editor.isActive('link'))

watch(open, value => {
  if (value) url.value = props.editor.getAttributes('link').href ?? ''
})

// Bare domains get `https://`; schemes, root-relative paths and anchors are kept as typed
function normalizeHref (value: string) {
  if (/^[a-z][a-z\d+.-]*:/i.test(value) || /^[/#?]/.test(value)) return value
  return `https://${value}`
}

function apply () {
  const value = url.value.trim()
  if (!value) {
    remove()
    return
  }
  const href = normalizeHref(value)
  const chain = props.editor.chain().focus()
  if (isActive.value) {
    chain.extendMarkRange('link').setLink({ href }).run()
  } else if (props.editor.state.selection.empty) {
    // Nothing selected: insert the URL itself as the link text
    chain.insertContent({ type: 'text', text: value, marks: [{ type: 'link', attrs: { href }}]}).run()
  } else {
    chain.setLink({ href }).run()
  }
  open.value = false
}

function remove () {
  props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
  open.value = false
}
</script>

<template>
  <ToolbarPopover
    v-model:open="open"
    icon="link"
    :label="T('link')"
    :active="isActive"
    :disabled="disabled"
  >
    <form
      class="gap-3 flex flex-col"
      @submit.prevent="apply"
    >
      <Input
        v-model="url"
        size="sm"
        :placeholder="T('linkPlaceholder')"
      />
      <div class="gap-2 flex justify-end">
        <Button
          v-if="isActive"
          variant="ghost"
          size="sm"
          @click="remove"
        >
          {{ T('removeLink') }}
        </Button>
        <Button
          size="sm"
          :disabled="!url.trim()"
          @click="apply"
        >
          {{ T('apply') }}
        </Button>
      </div>
    </form>
  </ToolbarPopover>
</template>
