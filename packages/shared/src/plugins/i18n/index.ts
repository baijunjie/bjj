import { I18nAlignmentChecker } from './I18nAlignmentChecker'
import { I18nUndefinedKeysChecker } from './I18nUndefinedKeysChecker'
import { I18nUnusedKeysChecker } from './I18nUnusedKeysChecker'
import { i18nMergeJsonFiles } from './i18nMergeJsonFiles'
import { I18nMergePlugin, I18nMergePluginCore } from './i18nMergePlugin'
import { parsePackagesArg } from './utils'

export const I18n = {
  AlignmentChecker: I18nAlignmentChecker,
  UndefinedKeysChecker: I18nUndefinedKeysChecker,
  UnusedKeysChecker: I18nUnusedKeysChecker,
  mergeJsonFiles: i18nMergeJsonFiles,
  MergePlugin: I18nMergePlugin,
  MergePluginCore: I18nMergePluginCore,
  parsePackagesArg,
}