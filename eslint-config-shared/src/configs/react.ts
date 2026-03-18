import type { Options } from '../index'
import eslintReact from '@eslint-react/eslint-plugin'
import reactRefresh from 'eslint-plugin-react-refresh'
import typescript from 'typescript-eslint'

export default function (scopes: Options['scopes']) {
  const extensions = [
    'jsx',
    'tsx',
  ]
  const preset = scopes?.ts
    ? eslintReact.configs['recommended-typescript']
    : eslintReact.configs.recommended
  return [
    {
      files: [ `**/*.{${extensions.join(',')}}` ],
      ...preset,
      languageOptions: {
        ...preset.languageOptions,
        ...(scopes?.ts ? { parserOptions: { parser: typescript.parser } } : {}),
        globals: {
          React: 'readonly',
        },
      },
      plugins: {
        ...preset.plugins,
        ...(typeof scopes?.react === 'object' ? (scopes.react as { plugins: Record<string, unknown> }).plugins : {}),
      },
      rules: {
        ...preset.rules,
        ...(typeof scopes?.react === 'object' ? (scopes.react as { rules: Record<string, unknown> }).rules : {}),
      },
    },
    {
      files: [ `**/*.{${extensions.join(',')}}` ],
      extends: [
        reactRefresh.configs.recommended,
      ],
    },
  ]
}
