#!/usr/bin/env tsx

/**
 * Standalone i18n build script (single-package version).
 *
 * Scans `app/` for co-located `{locale}.json` files and merges them into
 * `i18n/messages/<locale>.json`. The merged output is consumed at runtime by
 * `i18n.config.ts` through `import.meta.glob`.
 *
 * Usage:
 *   tsx scripts/i18n/build
 */

import path from 'node:path'
import { I18n } from '@bjj/shared/plugins'

const cwd = process.cwd()

async function main () {
  console.debug('🔧 Running i18n build...')
  const plugin = new I18n.MergePluginCore({
    srcDir: [ path.resolve(cwd, 'app') ],
    outputDir: path.resolve(cwd, 'i18n/messages'),
    languages: [ 'en' ],
    sortOriginalFiles: true,
  })
  await plugin.mergeI18nFiles()
  console.debug('✅ i18n build completed')
}

main().catch(err => {
  console.error('❌ i18n build failed:', err)
  process.exit(1)
})
