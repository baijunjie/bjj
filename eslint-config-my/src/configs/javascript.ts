import type { Options } from '../index'
import { defineConfig } from 'eslint/config'
import js from '@eslint/js'

export default function (scopes: Options['scopes']) {
  const extensions = [
    'js',
    'cjs',
    'mjs',
    'html',
  ]
  if (scopes?.react) {
    extensions.push('jsx')
  }
  if (scopes?.vue) {
    extensions.push('vue', 'jsx')
  }
  return defineConfig([
    {
      files: [ `**/*.{${extensions.join(',')}}` ],
      extends: [
        js.configs.recommended,
      ],
      rules: {
        'no-console': [ 'error', {
          allow: [
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
      },
    },
  ])
}
