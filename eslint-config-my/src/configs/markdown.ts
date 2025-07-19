import markdown from '@eslint/markdown'

export default function () {
  return [
    {
      files: ['**/*.md'],
      plugins: {
        markdown
      },
      language: 'markdown/commonmark',
      rules: {
        'markdown/no-html': 'error'
      }
    }
  ]
}
