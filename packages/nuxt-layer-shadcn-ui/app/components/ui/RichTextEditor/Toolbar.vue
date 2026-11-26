<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { RichTextEditorTool } from './types'
import ImageTool from './ImageTool.vue'
import LinkTool from './LinkTool.vue'
import ToolbarButton from './ToolbarButton.vue'

const props = defineProps<{
  editor: Editor
  tools: RichTextEditorTool[]
  disabled?: boolean
  uploadable?: boolean
  uploading?: boolean
}>()

const emit = defineEmits<{ uploadImage: [files: File[]]}>()

const T = useTranslations('components.ui.RichTextEditor')

type ButtonTool = Exclude<RichTextEditorTool, '|' | 'heading' | 'textAlign' | 'link' | 'image'>

interface ButtonToolConfig {
  icon: string
  /** A toggle whose pressed state is `editor.isActive(<tool name>)`; one-shot actions omit it */
  toggle?: boolean
  canRun?: () => boolean
  run: () => void
}

const chain = () => props.editor.chain().focus()

// Toggle tools are named after the Tiptap mark / node they switch
const buttonTools: Record<ButtonTool, ButtonToolConfig> = {
  undo: { icon: 'undo-2', canRun: () => props.editor.can().undo(), run: () => chain().undo().run() },
  redo: { icon: 'redo-2', canRun: () => props.editor.can().redo(), run: () => chain().redo().run() },
  bold: { icon: 'bold', toggle: true, run: () => chain().toggleBold().run() },
  italic: { icon: 'italic', toggle: true, run: () => chain().toggleItalic().run() },
  underline: { icon: 'underline', toggle: true, run: () => chain().toggleUnderline().run() },
  strike: { icon: 'strikethrough', toggle: true, run: () => chain().toggleStrike().run() },
  code: { icon: 'code', toggle: true, run: () => chain().toggleCode().run() },
  bulletList: { icon: 'list', toggle: true, run: () => chain().toggleBulletList().run() },
  orderedList: { icon: 'list-ordered', toggle: true, run: () => chain().toggleOrderedList().run() },
  blockquote: { icon: 'text-quote', toggle: true, run: () => chain().toggleBlockquote().run() },
  codeBlock: { icon: 'square-code', toggle: true, run: () => chain().toggleCodeBlock().run() },
  horizontalRule: { icon: 'minus', run: () => chain().setHorizontalRule().run() },
}

function isButtonTool (tool: RichTextEditorTool): tool is ButtonTool {
  return tool in buttonTools
}

const headingLevels = [ 1, 2, 3 ] as const

// Each tool reads `editor.state`, which the Vue editor keeps reactive per transaction
const headingOptions = computed(() => [
  {
    label: T('paragraph'),
    icon: 'pilcrow',
    active: props.editor.isActive('paragraph'),
    command: () => chain().setParagraph().run(),
  },
  ...headingLevels.map(level => ({
    label: T(`heading${level}`),
    icon: `heading-${level}`,
    active: props.editor.isActive('heading', { level }),
    command: () => chain().setHeading({ level }).run(),
  })),
])

const alignIcons = {
  left: 'text-align-start',
  center: 'text-align-center',
  right: 'text-align-end',
  justify: 'text-align-justify',
} as const

const alignOptions = computed(() => (Object.keys(alignIcons) as (keyof typeof alignIcons)[]).map(align => ({
  label: T(`align.${align}`),
  icon: alignIcons[align],
  active: props.editor.isActive({ textAlign: align }),
  command: () => chain().setTextAlign(align).run(),
})))

const currentHeading = computed(() => headingOptions.value.find(option => option.active) ?? headingOptions.value[0]!)
const currentAlign = computed(() => alignOptions.value.find(option => option.active) ?? alignOptions.value[0]!)

// Dropdown items already pass `active`; the extra fields are ignored by it
const dropdownTools = computed(() => ({
  heading: { label: T('heading'), current: currentHeading.value, menus: headingOptions.value },
  textAlign: { label: T('textAlign'), current: currentAlign.value, menus: alignOptions.value },
}))
</script>

<template>
  <!--
    Tools are a notch below the control height so the full toolbar fits one row at common widths.
    Pressing a tool must not move focus out of the editor, or every click would emit blur / change.
  -->
  <div
    class="
      gap-0.5 p-1 flex flex-wrap items-center border-b
      [--tool-size:calc(var(--control-height)-4px)]
    "
    role="toolbar"
    @mousedown.prevent
  >
    <template
      v-for="(tool, index) in tools"
      :key="`${tool}-${index}`"
    >
      <div
        v-if="tool === '|'"
        class="mx-1 bg-border h-[calc(var(--tool-size)*0.6)] w-px"
        role="separator"
      />
      <ToolbarButton
        v-else-if="isButtonTool(tool)"
        :icon="buttonTools[tool].icon"
        :label="T(tool)"
        :active="buttonTools[tool].toggle ? editor.isActive(tool) : undefined"
        :disabled="disabled || buttonTools[tool].canRun?.() === false"
        @click="buttonTools[tool].run()"
      />
      <!-- Keep focus in the editor when the menu closes after picking an item -->
      <Dropdown
        v-else-if="tool === 'heading' || tool === 'textAlign'"
        trigger="click"
        align="start"
        :menus="dropdownTools[tool].menus"
        @closeAutoFocus.prevent
      >
        <Button
          variant="ghost"
          :disabled="disabled"
          class="gap-0.5 h-(--tool-size) px-(--control-gap)"
          :aria-label="dropdownTools[tool].label"
        >
          <Icon
            :name="dropdownTools[tool].current.icon"
            class="size-(--control-icon)"
          />
          <Icon
            name="chevron-down"
            class="size-3 opacity-60"
          />
        </Button>
      </Dropdown>
      <LinkTool
        v-else-if="tool === 'link'"
        :editor="editor"
        :disabled="disabled"
      />
      <ImageTool
        v-else-if="tool === 'image'"
        :editor="editor"
        :disabled="disabled"
        :uploadable="uploadable"
        :uploading="uploading"
        @upload="files => emit('uploadImage', files)"
      />
    </template>
  </div>
</template>
