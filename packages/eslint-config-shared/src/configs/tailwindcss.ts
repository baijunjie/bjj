import type { Options } from '../index'
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
  return [
    {
      files: [ `**/*.{${extensions.join(',')}}` ],
      plugins: {
        'better-tailwindcss': tailwindcss,
        ...(typeof scopes?.tailwindcss === 'object' ? (scopes.tailwindcss as { plugins: Record<string, unknown> }).plugins : {}),
      },
      rules: {
        // enable all recommended rules to report a warning
        ...tailwindcss.configs['recommended-warn'].rules,
        // enable all recommended rules to report an error
        ...tailwindcss.configs['recommended-error'].rules,
        // disable specific rules
        'better-tailwindcss/no-unknown-classes': 'off', // 关闭未知类的检查
        ...(typeof scopes?.tailwindcss === 'object' ? (scopes.tailwindcss as { rules: Record<string, unknown> }).rules : {}),
      },
      settings: {
        'better-tailwindcss': typeof scopes?.tailwindcss === 'object' && 'settings' in scopes.tailwindcss ? scopes.tailwindcss.settings : {},
      },
    },
  ]
}
