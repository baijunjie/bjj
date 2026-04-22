import { join } from 'node:path'

// Use full resolved paths for layer (~ resolves to consuming app, not layer)
const currentDir = import.meta.dirname

export default defineNuxtConfig({
  // Self-reference alias: lets shadcn-generated imports
  // `@bjj/nuxt-layer-shadcn-ui/app/...` resolve during layer's own dev (pnpm
  // does not create a self-symlink in workspace). Harmless in consumer
  // context — resolves to the same path that node_modules would.
  alias: {
    '@bjj/nuxt-layer-shadcn-ui': currentDir,
  },

  // Package is declared as peerDependency so consumers own the version.
  modules: [ '@nuxtjs/i18n' ],

  // Explicit absolute path so the layer's messages load regardless of the
  // consumer's vueI18n setting (each layer's vueI18n is resolved per-layer
  // and merged by @nuxtjs/i18n).
  i18n: {
    vueI18n: join(currentDir, 'i18n.config.ts'),
  },

  // Register the layer's global stylesheet. Consumers extending this layer
  // automatically inherit it via Nuxt's css array merging.
  css: [ join(currentDir, 'app/assets/styles/globals.css') ],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  components: [
    // Layer's own components (absolute paths required)
    { path: join(currentDir, 'app/components/ui'), pathPrefix: false, extensions: [ 'vue' ]},
    { path: join(currentDir, 'app/components'), pathPrefix: true, ignore: [ 'shadcn/**' ], extensions: [ 'vue' ]},
  ],

  imports: {
    dirs: [
      join(currentDir, 'app/composables/**'),
      join(currentDir, 'app/types/**'),
      join(currentDir, 'app/utils/**'),
    ],
  },

  hooks: {
    // Auto-import types from `app/components/**\/types.ts` files.
    // `.vue` files must not export types per project convention; exported
    // types live in a co-located `types.ts` that gets scanned here.
    'imports:extend': async (imports: unknown[]) => {
      // @ts-expect-error fast-glob has no types in this project scope
      const { default: fg } = await import('fast-glob')
      // @ts-expect-error unimport has no types in this project scope
      const { scanExports } = await import('unimport')
      const files = await fg('**/types.ts', {
        cwd: join(currentDir, 'app/components'),
        absolute: true,
      })
      for (const file of files) {
        const exports = await scanExports(file, true)
        imports.push(...exports)
      }
    },
  },
})
