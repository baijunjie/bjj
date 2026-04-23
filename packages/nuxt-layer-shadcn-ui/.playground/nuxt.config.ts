export default defineNuxtConfig({
  extends: [ '..' ],
  modules: [ '@nuxt/eslint' ],
  devServer: { port: 8001 },

  // The layer intentionally leaves `defaultLocale` to consumers; the
  // playground supplies one itself to silence @nuxtjs/i18n's warning.
  // Disable browser detection so Storybook always starts in English —
  // otherwise Accept-Language overrides `defaultLocale`.
  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: false,
  },
})
