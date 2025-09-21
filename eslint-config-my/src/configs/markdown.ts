import type { Options } from '../index'
import markdown from '@eslint/markdown'

export default function (scopes: Options['scopes']) {
  return [
    {
      files: [ '**/*.md' ],
      plugins: {
        markdown,
      },
      language: 'markdown/commonmark',
      rules: {
        'markdown/no-html': 'error',
        ...(typeof scopes?.markdown === 'object' ? (scopes.markdown as { rules: Record<string, unknown> }).rules : {}),
      },
    },
  ]
}
