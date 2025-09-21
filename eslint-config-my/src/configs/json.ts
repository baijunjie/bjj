import type { Options } from '../index'
import json from '@eslint/json'

export default function (scopes: Options['scopes']) {
  return [
    {
      files: [ '**/*.json' ],
      plugins: {
        json,
      },
      language: 'json/json',
      rules: {
        'json/no-duplicate-keys': 'error',
        ...(typeof scopes?.json === 'object' ? (scopes.json as { rules: Record<string, unknown> }).rules : {}),
      },
    },
  ]
}
