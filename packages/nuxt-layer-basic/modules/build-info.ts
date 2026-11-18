import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { addImports, addPluginTemplate, addTemplate, defineNuxtModule } from 'nuxt/kit'

const SHORT_SHA_LENGTH = 7

function resolveCommit (rootDir: string): string {
  const ciCommit = process.env.GITHUB_SHA?.trim() || process.env.BITBUCKET_COMMIT?.trim()
  if (ciCommit) return ciCommit.slice(0, SHORT_SHA_LENGTH)

  try {
    return execFileSync('git', [ 'rev-parse', `--short=${SHORT_SHA_LENGTH}`, 'HEAD' ], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: [ 'ignore', 'pipe', 'ignore' ],
    }).trim() || 'unknown'
  } catch {
    return 'unknown'
  }
}

function resolvePackageName (rootDir: string): string {
  try {
    const { name } = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
    return typeof name === 'string' ? name.trim() : ''
  } catch {
    return ''
  }
}

export default defineNuxtModule({
  meta: { name: 'nuxt-layer-basic:build-info' },
  setup (_, nuxt) {
    const { rootDir } = nuxt.options
    const buildCommit = resolveCommit(rootDir)
    const buildInfo = {
      packageName: resolvePackageName(rootDir),
      builtAt: new Date().toISOString(),
    }

    const commitTemplate = addTemplate({
      filename: 'nuxt-layer-basic-build-info.ts',
      write: true,
      getContents: () => `export const buildCommit: string = ${JSON.stringify(buildCommit)}\n`,
    })
    addImports({ name: 'buildCommit', from: commitTemplate.dst })

    addPluginTemplate({
      filename: 'nuxt-layer-basic-build-info.client.mjs',
      mode: 'client',
      getContents: () => `import { defineNuxtPlugin } from '#app'
import { buildCommit } from '#imports'

const { packageName, builtAt } = ${JSON.stringify(buildInfo)}

export default defineNuxtPlugin(() => {
  const segments = [
    [buildCommit, '#1a7f37'],
    [new Date(builtAt).toLocaleString(), '#9a5400'],
  ]
  if (packageName) segments.unshift([packageName, '#555555'])

  const args = segments.flatMap(([text, background], index) => {
    const style = [
      'padding:2px 6px;color:#fff;',
      'background:' + background + ';',
      index === 0 ? 'border-radius:4px 0 0 4px;' : '',
      index === segments.length - 1 ? 'border-radius:0 4px 4px 0;' : '',
    ].join('')
    return [style, text]
  })
  console.info('%c%s'.repeat(segments.length), ...args)
})
`,
    })
  },
})
