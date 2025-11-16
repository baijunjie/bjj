import type { Options } from '../index'
import js from '@eslint/js'
import typescript from 'typescript-eslint'

export default function (scopes: Options['scopes']) {
  const extensions = [
    'js',
    'cjs',
    'mjs',
    'ts',
    'cts',
    'mts',
    'html',
  ]
  if (scopes?.react) {
    extensions.push('jsx', 'tsx')
  }
  if (scopes?.vue) {
    extensions.push('vue', 'jsx', 'tsx')
  }
  let languageOptions
  if (scopes?.ts) {
    languageOptions = {
      parserOptions: { parser: typescript.parser },
    }
  }
  return [
    {
      files: [ `**/*.{${extensions.join(',')}}` ],
      languageOptions,
      extends: [
        js.configs.recommended,
      ],
      plugins: {
        ...(typeof scopes?.js === 'object' ? (scopes.js as { plugins: Record<string, unknown> }).plugins : {}),
      },
      rules: {
        'no-console': [ 'error', {
          allow: [
            'info',
            'debug',
            'error',
            'warn',
          ],
        }],
        'no-undef': 'off', // 未定义变量是否有效的规则
        'no-unused-vars': 'error', // 未使用的变量是否有效的规则
        'no-unused-expressions': [ 'error', { // 未使用表达式是否有效的规则
          allowShortCircuit: true,
          allowTernary: true,
        }],
        ...(typeof scopes?.js === 'object' ? (scopes.js as { rules: Record<string, unknown> }).rules : {}),
      },
    },
  ]
}
