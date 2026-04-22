#!/usr/bin/env tsx

/**
 * Check for i18n keys referenced in source code but missing from the merged
 * `i18n/messages/en.json` reference file.
 *
 * Usage:
 *   tsx scripts/i18n/checkUndefinedKeys
 */

import path from 'node:path'
import { I18n } from '@bjj/shared/plugins'

const cwd = process.cwd()

async function main () {
  console.debug('🔍 Checking for undefined i18n keys...\n')

  try {
    const srcDirs = [ path.resolve(cwd, 'app') ]
    const messagesDir = path.resolve(cwd, 'i18n/messages')

    const checker = new I18n.UndefinedKeysChecker(
      srcDirs,
      messagesDir,
      { referenceLocale: 'en' },
    )

    const { undefinedKeys, statistics } = await checker.check()

    console.debug('📊 Statistics:')
    console.debug(`   Defined keys: ${statistics.definedKeysCount}`)
    console.debug(`   Used keys: ${statistics.usageCount}`)
    console.debug(`   Undefined keys: ${undefinedKeys.length}\n`)

    if (undefinedKeys.length === 0) {
      console.debug('\n✅ All i18n keys are properly defined!')
      process.exit(0)
    }

    checker.printUndefinedKeys(undefinedKeys)
    process.exit(1)
  } catch (error) {
    console.error('❌ Error checking for undefined keys:')
    console.error(error)
    process.exit(1)
  }
}

main()
