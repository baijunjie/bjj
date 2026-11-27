<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { RichTextEditorProps, RichTextEditorTool } from './types'
import { richTextEditorDefaultToolbar } from './types'
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { createRichTextExtensions } from '../RichText/extensions'
import Toolbar from './Toolbar.vue'
import '../RichText/style.css'
import './style.css'

const props = withDefaults(defineProps<RichTextEditorProps>(), {
  modelValue: undefined,
  format: 'html',
  placeholder: undefined,
  toolbar: () => [ ...richTextEditorDefaultToolbar ],
  maxlength: undefined,
  showCount: false,
  minHeight: undefined,
  maxHeight: undefined,
  uploadImage: undefined,
  size: undefined,
  rounded: false,
  readonly: false,
  disabled: false,
  invalid: false,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  /** Content changed between gaining and losing focus */
  'change': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

const isInvalid = useFormItemInvalid(() => props.invalid)

// Also keeps the Inputs in the toolbar popovers out of an enclosing FormItem
const formItemAttrs = useFormItemControl({ labelable: false })

/** Attributes of the editable element; ProseMirror stringifies every value, so unset ones are dropped */
const editorAttributes = computed(() => {
  const attrs: Record<string, string> = { 'class': 'rich-text', 'aria-multiline': 'true' }
  for (const [ key, value ] of Object.entries(formItemAttrs({}))) {
    if (value !== undefined) attrs[key] = value
  }
  return attrs
})

const editable = computed(() => !props.readonly && !props.disabled)

// The format is fixed for the editor's lifetime: it decides which extensions load
const isMarkdown = props.format === 'markdown'
const contentType = isMarkdown ? 'markdown' : 'html'

// Tools with no Markdown syntax (their extensions are not loaded for Markdown)
const markdownUnsupportedTools: RichTextEditorTool[] = [ 'underline', 'textAlign' ]

/** The toolbar without unsupported tools, and without dividers left dangling by their removal */
const tools = computed(() => {
  const result: RichTextEditorTool[] = []
  for (const tool of props.toolbar) {
    if (isMarkdown && markdownUnsupportedTools.includes(tool)) continue
    if (tool === '|' && (!result.length || result.at(-1) === '|')) continue
    result.push(tool)
  }
  if (result.at(-1) === '|') result.pop()
  return result
})

/** An empty document is reported as `''` rather than `<p></p>` */
function getValue (instance: Pick<Editor, 'isEmpty' | 'getHTML' | 'getMarkdown'>) {
  if (instance.isEmpty) return ''
  return isMarkdown ? instance.getMarkdown() : instance.getHTML()
}

function getImageFiles (files: FileList | null | undefined) {
  return Array.from(files ?? []).filter(file => file.type.startsWith('image/'))
}

const uploadingCount = ref(0)

/** Uploads the images and inserts them at `pos`, or at the selection when omitted */
async function uploadImages (files: File[], pos?: number) {
  const upload = props.uploadImage
  if (!upload) return
  uploadingCount.value++
  try {
    const urls = await Promise.all(files.map(file => upload(file)))
    const images = urls.map(src => ({ type: 'image', attrs: { src }}))
    const chain = editor.value?.chain().focus()
    if (pos === undefined) chain?.insertContent(images).run()
    else chain?.insertContentAt(pos, images).run()
  } finally {
    uploadingCount.value--
  }
}

let valueOnFocus = ''

const editor = useEditor({
  content: props.modelValue ?? '',
  contentType,
  editable: editable.value,
  extensions: [
    ...createRichTextExtensions(props.format),
    Placeholder.configure({ placeholder: () => props.placeholder ?? '' }),
    CharacterCount.configure({ limit: props.maxlength ?? null }),
  ],
  editorProps: {
    attributes: () => editorAttributes.value,
    handlePaste: (_view, event) => {
      const files = getImageFiles(event.clipboardData?.files)
      if (!props.uploadImage || !files.length) return false
      void uploadImages(files)
      return true
    },
    handleDrop: (view, event, _slice, moved) => {
      const files = getImageFiles(event.dataTransfer?.files)
      if (moved || !props.uploadImage || !files.length) return false
      void uploadImages(files, view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos)
      return true
    },
  },
  onUpdate: ({ editor: instance }) => {
    emit('update:modelValue', getValue(instance))
  },
  onFocus: ({ editor: instance, event }) => {
    valueOnFocus = getValue(instance)
    emit('focus', event)
  },
  onBlur: ({ editor: instance, event }) => {
    const value = getValue(instance)
    if (value !== valueOnFocus) emit('change', value)
    emit('blur', event)
  },
})

// ProseMirror only re-reads the attributes on a view update
watch(editorAttributes, () => editor.value?.view.setProps({}))

// Only push outside changes in, so the caret is not reset on every keystroke
watch(() => props.modelValue, value => {
  const instance = editor.value
  if (!instance || (value ?? '') === getValue(instance)) return
  instance.commands.setContent(value ?? '', { emitUpdate: false, contentType })
})

watch(editable, value => {
  editor.value?.setEditable(value, false)
})

const characterCount = computed(() => editor.value?.storage.characterCount.characters() ?? 0)

const countText = computed(() => props.maxlength === undefined
  ? `${characterCount.value}`
  : `${characterCount.value} / ${props.maxlength}`,
)

function toCssSize (value: string | number | undefined) {
  return typeof value === 'number' ? `${value}px` : value
}

const contentStyle = computed(() => ({
  minHeight: toCssSize(props.minHeight) ?? '8rem',
  maxHeight: toCssSize(props.maxHeight),
}))

const mergedClass = computed(() => cn(
  `
    border-input shadow-xs
    dark:bg-input/30
    has-[.ProseMirror-focused]:border-ring
    has-[.ProseMirror-focused]:ring-ring/50
    aria-invalid:border-destructive aria-invalid:ring-destructive/20
    dark:aria-invalid:ring-destructive/40
    flex flex-col overflow-hidden border bg-transparent
    transition-[color,box-shadow]
    has-[.ProseMirror-focused]:ring-[3px]
  `,
  // Half a single-line control's height, as on Textarea, however tall the editor is.
  props.rounded ? 'rounded-[calc(var(--control-height)/2)]' : 'rounded-md',
  props.disabled && 'cursor-not-allowed opacity-50',
  props.class,
))

defineExpose({
  /** The underlying Tiptap editor, `undefined` until mounted */
  editor,
})
</script>

<template>
  <div :data-control-size="size">
    <div
      :class="mergedClass"
      :aria-invalid="isInvalid || undefined"
      :aria-disabled="disabled || undefined"
    >
      <Toolbar
        v-if="editor && !readonly && tools.length"
        :editor="editor"
        :tools="tools"
        :disabled="disabled"
        :uploadable="!!uploadImage"
        :uploading="uploadingCount > 0"
        @uploadImage="uploadImages"
      />
      <EditorContent
        :editor="editor"
        class="rich-text-editor-content flex flex-1 flex-col overflow-y-auto"
        :style="contentStyle"
      />
    </div>
    <div
      v-if="showCount"
      class="
        mt-1 text-muted-foreground text-right text-(length:--control-font-size)
        leading-(--control-line-height)
      "
    >
      {{ countText }}
    </div>
  </div>
</template>
