import type { Options } from '../index'
import { defineConfig } from 'eslint/config'
import tailwindcss from 'eslint-plugin-better-tailwindcss'

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
      plugins: {
        'better-tailwindcss': tailwindcss
      },
      rules: {
        // enable all recommended rules to report a warning
        ...tailwindcss.configs["recommended-warn"].rules,
        // enable all recommended rules to report an error
        ...tailwindcss.configs["recommended-error"].rules,
      },
      settings: {
        'better-tailwindcss': typeof scopes?.tailwindcss4 === 'object' ? scopes.tailwindcss4 : {},
      },
    },
  ])
}
