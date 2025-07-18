import type { Options } from '../index'
import { defineConfig } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import typescript from 'typescript-eslint'

export default function (scopes: Options['scopes']) {
  const extensions = [
    'jsx',
    'tsx',
  ]
  let languageOptions
  if (scopes?.ts) {
    languageOptions = {
      parserOptions: { parser: typescript.parser },
    }
  }
  return defineConfig([
    {
      files: [ `**/*.{${extensions.join(',')}}` ],
      languageOptions: {
        ...languageOptions,
        React: 'readonly',
      },
      extends: [
        reactHooks.configs['recommended-latest'],
        reactRefresh,
      ],
      rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react-refresh/only-export-components': [ 'warn', { allowConstantExport: true }],
      },
    },
  ])
}
