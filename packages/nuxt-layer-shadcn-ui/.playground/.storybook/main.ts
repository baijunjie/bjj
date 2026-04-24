import type { StorybookConfig } from '@storybook-vue/nuxt'
import { createRequire } from 'node:module'

const config: StorybookConfig = {
  stories: [
    './*.mdx',
    '../../app/assets/**/*.stories.@(ts|tsx)',
    '../../app/components/**/*.stories.@(ts|tsx)',
  ],
  addons: [ '@storybook/addon-docs' ],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {
      docgen: 'vue-component-meta',
    },
  },
  viteFinal: async config => {
    if (process.env.STORYBOOK_BASE_PATH) {
      config.base = process.env.STORYBOOK_BASE_PATH
    }

    config.optimizeDeps = config.optimizeDeps || {}
    config.optimizeDeps.noDiscovery = true
    config.optimizeDeps.entries = []
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      'dayjs',
      'dayjs/plugin/relativeTime',
      'dayjs/plugin/localizedFormat',
      'dayjs/plugin/duration',
      'dayjs/plugin/utc',
      'dayjs/plugin/timezone',
      // @storybook/addon-docs is React-based — pre-bundle React so named
      // exports like `Component` work under Vite's `noDiscovery: true`.
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
    ]

    // Fix infinite module resolution loop in pnpm monorepo:
    // Nuxt's resolve-bare-imports plugin appends /dist/vue.esm-bundler.js
    // to the resolved path repeatedly, creating an infinitely growing path.
    // This happens because pnpm's symlink structure causes the resolved path
    // to look like a directory rather than a file.
    const require = createRequire(import.meta.url)
    const vuePath = require.resolve('vue/dist/vue.esm-bundler.js')
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}
    config.resolve.alias['vue/dist/vue.esm-bundler.js'] = vuePath

    return config
  },
}

export default config
