#!/usr/bin/env tsx

/**
 * Check i18n key alignment across language files in `i18n/messages/`.
 *
 * The reference locale is `en`; other locales are compared against it.
 *
 * Usage:
 *   tsx scripts/i18n/checkI18nAlignment           # Report missing / extra keys
 *   tsx scripts/i18n/checkI18nAlignment --fix     # Auto-fix alignment issues
 */

import path from 'node:path'
import { I18n } from '@bjj/shared/plugins'

const cwd = process.cwd()
const messagesDir = path.resolve(cwd, 'i18n/messages')

const args = process.argv.slice(2)
const shouldFix = args.includes('--fix')

async function main () {
  console.debug(`🔍 Checking i18n key alignment against en.json${shouldFix ? ' (with auto-fix)' : ''}...\n`)

  try {
    const checker = new I18n.AlignmentChecker(messagesDir, {
      referenceLocale: 'en',
    })

    const { results } = await checker.check()

    if (results.length === 0) {
      process.exit(0)
    }

    checker.printAlignmentResults(results)

    const totalIssues = results.reduce(
      (sum, r) => sum + r.alignment.missing.length + r.alignment.extra.length,
      0,
    )

    if (totalIssues === 0 && !shouldFix) {
      process.exit(0)
    }

    if (shouldFix) {
      console.debug()
      await checker.fix(results)
      process.exit(0)
    }

    console.debug('💡 Run with --fix flag to automatically fix alignment issues.')
    console.debug('   Example: tsx scripts/i18n/checkI18nAlignment --fix')
    process.exit(1)
  } catch (error) {
    console.error('❌ Error checking alignment:')
    console.error(error)
    process.exit(1)
  }
}

main()
