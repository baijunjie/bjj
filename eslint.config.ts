import myLint from '@bjj/eslint-config-shared'
import globals from 'globals'

export default [
  ...myLint(),
  {
    files: [ '**/__tests__/**', '**/*.spec.*', '**/*.test.*' ],
    languageOptions: {
      globals: globals.jest,
    },
  },
]
