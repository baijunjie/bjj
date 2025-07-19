import type { Options } from '../index'
import { defineConfig } from 'eslint/config'
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
  return defineConfig([
    {
      files: [ `**/*.{${extensions.join(',')}}` ],
      languageOptions,
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
