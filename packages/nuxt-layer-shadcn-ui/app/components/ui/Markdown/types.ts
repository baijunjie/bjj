/**
 * Styles trusted, already-rendered HTML passed in the default slot (docs,
 * `@nuxt/content` output …) with the GitHub theme. The slot is not sanitized
 * and renders on the server. For content users wrote in RichTextEditor, use
 * RichText instead.
 */
export interface MarkdownProps {
  hideTitle?: boolean
}
