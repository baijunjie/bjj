import sharedLint from '@bjj/eslint-config-shared'
import type { Linter } from 'eslint'
import withNuxt from './.playground/.nuxt/eslint.config.mjs'

async function build (): Promise<Linter.Config[]> {
  const nuxtConfigs = await withNuxt().toConfigs()

  return [
    ...nuxtConfigs,
    ...sharedLint({
      scopes: {
        vue: true,
        tailwindcss: {
          settings: {
            entryPoint: 'app/assets/styles/globals.css',
          },
        },
        ts: {
          rules: {
            '@typescript-eslint/no-empty-object-type': 'off',
          },
        },
      },
      ignores: [
        '.playground/.nuxt',
        'app/components/shadcn/**',
      ],
    }),
    // ESLint 10.0.3 core rule crashes on non-JS source files
    // (sourceCode.getAllComments is not a function)
    {
      files: [ '**/*.{md,json,html}' ],
      rules: {
        'no-irregular-whitespace': 'off',
      },
    },
  ]
}

export default build()
