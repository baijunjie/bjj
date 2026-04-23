#!/usr/bin/env tsx

/**
 * Check for i18n keys defined in `i18n/messages/en.json` but never referenced
 * in source code. Optionally remove them with `--fix`.
 *
 * Usage:
 *   tsx scripts/i18n/checkUnusedKeys              # Report unused keys
 *   tsx scripts/i18n/checkUnusedKeys --fix        # Auto-remove unused keys
 */

import path from 'node:path'
import { I18n } from '@bjj/shared/plugins'

const cwd = process.cwd()
const shouldFix = process.argv.slice(2).includes('--fix')

const WHITELIST_PREFIXES = [
  'common',
]

async function main () {
  console.debug('🔍 Checking for unused i18n keys...\n')

  const srcDir = path.resolve(cwd, 'app')
  const messagesDir = path.resolve(cwd, 'i18n/messages')

  const checker = new I18n.UnusedKeysChecker(
    srcDir,
    messagesDir,
    {
      whitelistPrefixes: WHITELIST_PREFIXES,
      referenceLocale: 'en',
    },
  )

  try {
    const { unusedKeys, fileGroups, statistics } = await checker.check()

    console.debug('📊 Statistics:')
    console.debug(`   Total defined keys: ${statistics.definedKeysCount}`)
    console.debug(`   Total used keys: ${statistics.usedKeysCount}`)
    console.debug(`   Unused keys: ${statistics.unusedKeysCount}\n`)

    if (unusedKeys.length === 0) {
      console.debug('\n✅ No unused i18n keys found!')
      process.exit(0)
    }

    checker.printUnusedKeys(fileGroups)

    if (shouldFix) {
      const fixedCount = await checker.fix(fileGroups)
      if (fixedCount > 0) {
        console.debug('\n💡 Run `pnpm i18n:build` to regenerate merged messages.')
      }
      process.exit(0)
    }

    process.exit(1)
  } catch (error) {
    console.error('❌ Error checking for unused keys:')
    console.error(error)
    process.exit(1)
  }
}

main()
