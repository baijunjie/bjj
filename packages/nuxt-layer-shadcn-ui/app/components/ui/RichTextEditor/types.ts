import type { ControlSize } from '../../../types/control'
import type { RichTextFormat } from '../RichText/types'

/**
 * A toolbar entry: a tool name, or `'|'` for a divider between groups.
 * Hiding a tool only removes its button — its keyboard shortcuts and
 * pasted formatting keep working.
 */
export type RichTextEditorTool
  = | 'undo'
    | 'redo'
    | 'heading'
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strike'
    | 'code'
    | 'bulletList'
    | 'orderedList'
    | 'blockquote'
    | 'codeBlock'
    | 'horizontalRule'
    | 'textAlign'
    | 'link'
    | 'image'
    | '|'

/** The toolbar used when `toolbar` is not set; spread it to extend or reorder the default tools */
export const richTextEditorDefaultToolbar: readonly RichTextEditorTool[] = [
  'undo', 'redo', '|',
  'heading', '|',
  'bold', 'italic', 'underline', 'strike', 'code', '|',
  'bulletList', 'orderedList', 'blockquote', 'codeBlock', 'horizontalRule', '|',
  'textAlign', '|',
  'link', 'image',
]

/** Uploads an image file and resolves with the URL to insert. Reject to abort the insert. */
export type RichTextEditorUploadImage = (file: File) => Promise<string>

export interface RichTextEditorProps {
  /** Content in the given `format`. An empty document is emitted as `''`. */
  modelValue?: string
  /**
   * Format of `modelValue`: `'html'` (default) or `'markdown'`. Markdown has no
   * underline or alignment, so those tools are dropped from the toolbar.
   * Read when the editor is created.
   */
  format?: RichTextFormat
  /** Hint shown while the document is empty */
  placeholder?: string
  /** Toolbar entries in display order; `[]` hides the toolbar. Defaults to `richTextEditorDefaultToolbar`. */
  toolbar?: RichTextEditorTool[]
  /** Maximum number of characters allowed. Read when the editor is created. */
  maxlength?: number
  /** Show the character count below the content (rendered as `count / maxlength` when maxlength is set) */
  showCount?: boolean
  /** Minimum height of the content area. Numbers are treated as px. */
  minHeight?: string | number
  /** Maximum height of the content area, beyond which it scrolls. Numbers are treated as px. */
  maxHeight?: string | number
  /**
   * Enables image upload from the image tool, paste and drop.
   * Without it, images can only be inserted by URL.
   */
  uploadImage?: RichTextEditorUploadImage
  /** Size tier. Unset follows the nearest ancestor's `data-control-size`, else `default`. */
  size?: ControlSize
  /** Hide the toolbar and show the content without editing */
  readonly?: boolean
  disabled?: boolean
  invalid?: boolean
  class?: ClassValue
}
