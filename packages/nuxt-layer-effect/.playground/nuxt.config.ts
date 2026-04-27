import { join } from 'node:path'

const playgroundDir = import.meta.dirname

export default defineNuxtConfig({
  extends: [ '..' ],
  modules: [ '@nuxt/eslint' ],

  // Tailwind is loaded only in the playground (Storybook env) so the
  // published layer remains UI-framework-agnostic. Stories use Tailwind
  // utility classes for demo wrappers — they are dev-only artifacts.
  css: [ join(playgroundDir, 'app/assets/styles/globals.css') ],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },
})
