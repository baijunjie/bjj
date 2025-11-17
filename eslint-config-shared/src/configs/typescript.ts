import type { Options } from '../index'
import type { ExtendsElement } from '@eslint/config-helpers'
import typescript from 'typescript-eslint'

export default function (scopes: Options['scopes']) {
  const extensions = [
    'ts',
    'cts',
    'mts',
  ]
  if (scopes?.react) {
    extensions.push('tsx')
  }
  if (scopes?.vue) {
    extensions.push('vue', 'tsx')
  }
  return [
    {
      files: [ `**/*.{${extensions.join(',')}}` ],
      extends: [
        ...typescript.configs.recommended as ExtendsElement[],
      ],
      plugins: {
        ...(typeof scopes?.ts === 'object' ? (scopes.ts as { plugins: Record<string, unknown> }).plugins : {}),
      },
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            args: 'all',
            vars: 'all',
            ignoreRestSiblings: true,
            ignoreClassWithStaticInitBlock: true,
          },
        ],
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        ...(typeof scopes?.ts === 'object' ? (scopes.ts as { rules: Record<string, unknown> }).rules : {}),
      },
    },
  ]
}
