import json from '@eslint/json'

export default function () {
  return [
    {
      files: ['**/*.json'],
      plugins: {
        json
      },
      language: 'json/json',
      rules: {
        'json/no-duplicate-keys': 'error'
      }
    }
  ]
}
