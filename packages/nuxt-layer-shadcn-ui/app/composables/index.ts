// Re-export shared composables used by this layer. Nuxt auto-imports everything
// exported from `app/composables/**`, so listed symbols become global.
export {
  useScrollState,
  useDevice,
  usePagination,
  useTranslations,
  useDate,
} from '@bjj/shared/vue/composables'
