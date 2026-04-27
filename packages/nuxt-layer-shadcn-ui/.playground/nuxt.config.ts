import { join } from 'node:path'

const playgroundDir = import.meta.dirname

export default defineNuxtConfig({
  extends: [ '..' ],
  modules: [ '@nuxt/eslint' ],

  // Playground is the Tailwind entry (where `@import 'tailwindcss'` lives).
  css: [ join(playgroundDir, 'app/assets/styles/globals.css') ],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  // The layer intentionally leaves `defaultLocale` to consumers; the
  // playground supplies one itself to silence @nuxtjs/i18n's warning.
  // Disable browser detection so Storybook always starts in English —
  // otherwise Accept-Language overrides `defaultLocale`.
  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: false,
  },
})
