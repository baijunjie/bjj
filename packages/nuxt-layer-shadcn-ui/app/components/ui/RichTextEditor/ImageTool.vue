<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import ToolbarPopover from './ToolbarPopover.vue'

const props = defineProps<{
  editor: Editor
  disabled?: boolean
  /** Whether image files can be uploaded, besides inserting by URL */
  uploadable?: boolean
  uploading?: boolean
}>()

const emit = defineEmits<{ upload: [files: File[]]}>()

const T = useTranslations('components.ui.RichTextEditor')

const open = ref(false)
const url = ref('')
const fileInputRef = useTemplateRef<HTMLInputElement>('fileInput')

watch(open, value => {
  if (value) url.value = ''
})

function insert () {
  const src = url.value.trim()
  if (!src) return
  props.editor.chain().focus().setImage({ src }).run()
  open.value = false
}

function handleFileChange (event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  // Reset so picking the same file again still fires `change`
  input.value = ''
  if (!files.length) return
  emit('upload', files)
  open.value = false
}
</script>

<template>
  <ToolbarPopover
    v-model:open="open"
    icon="image"
    :label="T('image')"
    :disabled="disabled"
    :loading="uploading"
  >
    <form
      class="gap-3 flex flex-col"
      @submit.prevent="insert"
    >
      <Input
        v-model="url"
        size="sm"
        :placeholder="T('imagePlaceholder')"
      />
      <div class="gap-2 flex justify-end">
        <template v-if="uploadable">
          <Button
            variant="outline"
            size="sm"
            icon="upload"
            @click="fileInputRef?.click()"
          >
            {{ T('uploadImage') }}
          </Button>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleFileChange"
          >
        </template>
        <Button
          size="sm"
          :disabled="!url.trim()"
          @click="insert"
        >
          {{ T('insert') }}
        </Button>
      </div>
    </form>
  </ToolbarPopover>
</template>
