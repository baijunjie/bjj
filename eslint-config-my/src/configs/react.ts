import type { Options } from '../index'
import react from 'eslint-plugin-react'
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
  return [
    {
      files: [ `**/*.{${extensions.join(',')}}` ],
      languageOptions: {
        ...languageOptions,
        globals: {
          React: 'readonly',
        },
      },
      extends: [
        react.configs.flat.recommended,
        reactHooks.configs['recommended-latest'],
        reactRefresh.configs.recommended,
      ],
      plugins: {
        ...(typeof scopes?.react === 'object' ? (scopes.vue as { plugins: Record<string, unknown> }).plugins : {}),
      },
      rules: {
        ...(typeof scopes?.react === 'object' ? (scopes.react as { rules: Record<string, unknown> }).rules : {}),
      },
      settings: {
        react: typeof scopes?.react === 'object' && 'settings' in scopes.react ? scopes.react.settings : {},
      },
    },
  ]
}
