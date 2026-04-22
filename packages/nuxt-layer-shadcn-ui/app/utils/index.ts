// Re-export shared utilities used by this layer. Nuxt auto-imports everything
// exported from `app/utils/**`, so listed symbols become global.
// Also serves as the shadcn CLI `utils` alias (see components.json).
export { cn } from '@bjj/shared/vue/utils'
export { safeHtml } from '@bjj/shared/utils-browser'
export { isUrl, formatCurrency } from '@bjj/shared/utils'
