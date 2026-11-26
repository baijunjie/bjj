import type { AnyExtension } from '@tiptap/vue-3'
import type { RichTextFormat } from './types'
import ImageExtension from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { Markdown, MarkdownManager } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'
import { generateHTML } from '@tiptap/vue-3'

/**
 * Content extensions shared by RichTextEditor and RichText, so a document is
 * read and rendered the same way in both. Underline and text alignment have no
 * Markdown syntax, so the Markdown format leaves them out.
 */
export function createRichTextExtensions (format: RichTextFormat): AnyExtension[] {
  const isMarkdown = format === 'markdown'
  return [
    StarterKit.configure({
      heading: { levels: [ 1, 2, 3 ]},
      underline: isMarkdown ? false : undefined,
      link: {
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer nofollow' },
      },
    }),
    ImageExtension,
    isMarkdown ? Markdown : TextAlign.configure({ types: [ 'heading', 'paragraph' ]}),
  ]
}

let markdownParser: { extensions: AnyExtension[], manager: MarkdownManager } | undefined

/** Renders Markdown to HTML with the editor's own extensions, so it shows exactly as it was edited */
export function markdownToHtml (source: string) {
  if (!markdownParser) {
    const extensions = createRichTextExtensions('markdown')
    markdownParser = { extensions, manager: new MarkdownManager({ extensions }) }
  }
  return generateHTML(markdownParser.manager.parse(source), markdownParser.extensions)
}
