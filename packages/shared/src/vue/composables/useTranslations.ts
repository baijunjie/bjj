import type { ComposerTranslation } from 'vue-i18n'
import { useI18n } from 'vue-i18n'

/**
 * Wrap vue-i18n's `t` with an optional namespace prefix.
 *
 * @param namespace - Dot-separated key prefix (e.g. 'pages.app.chats'). If
 *                    omitted, the raw `t` function is returned.
 */
export function useTranslations (namespace?: string): ComposerTranslation {
  const { t } = useI18n()

  if (!namespace) {
    return t
  }

  type TFunc = typeof t
  return ((key: Parameters<TFunc>[0], ...args: Parameters<TFunc> extends [any, ...infer R] ? R : never) => {
    return t(`${namespace}.${key}`, ...args)
  }) as TFunc
}
