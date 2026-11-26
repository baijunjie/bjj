/** How rich text content is stored: an HTML string, or a Markdown string */
export type RichTextFormat = 'html' | 'markdown'

/**
 * Shows content written in RichTextEditor, with the editor's own typography.
 * It is sanitized and renders in the browser only, so it is safe for
 * user-generated content. For trusted, already-rendered HTML such as docs,
 * use Markdown instead.
 */
export interface RichTextProps {
  /** Content produced by RichTextEditor, in the given `format` */
  content?: string
  /** Format of `content`. Defaults to `'html'`. */
  format?: RichTextFormat
  class?: ClassValue
}
