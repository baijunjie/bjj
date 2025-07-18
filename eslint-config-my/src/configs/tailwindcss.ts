import type { Options } from '../index'
import { defineConfig } from 'eslint/config'

export default function (scopes: Options['scopes']) {
  const extensions = [
    'js',
    'ts',
    'css',
    'less',
    'sass',
    'scss',
    'html',
  ]
  if (scopes?.react) {
    extensions.push('jsx', 'tsx')
  }
  if (scopes?.vue) {
    extensions.push('vue', 'jsx', 'tsx')
  }
  return defineConfig([
    {
      files: [ `**/*.{${extensions.join(',')}}` ],
      settings: {
        'better-tailwindcss': {},
      },
    },
  ])
}
