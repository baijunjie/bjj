/**
 * 将本仓库的 Nuxt layer 相关代码同步到 ele-nuxt-layers 仓库，并把 bjj 改写为 ele
 *
 * 同步范围见 ENTRIES：三个 layer 包（nuxt-layer-basic / nuxt-layer-shadcn-ui / shared）
 * 以及它们安装、lint、发布所依赖的 eslint-config-shared 包和根目录配置。
 * 每个条目下的文件取 `git ls-files --cached --others --exclude-standard`（已跟踪 + 未忽略的新文件，
 * 读工作区内容），按相同路径写入目标仓库，文件内容与路径都经过 rewrite()。
 *
 * 不同步：README.md（目标仓库自有）、.github（CI 由目标仓库自行配置）、
 * packages/eslint-config-node（layer 不依赖）、本脚本。
 * 同步后需在目标仓库执行一次 pnpm install，以清理 lockfile 中的孤立条目（见 adaptLockfile()）。
 *
 * mirror 条目以镜像方式更新：源中已不存在的文件在目标中也删除（目标中被 git 忽略的文件不受影响，
 * 如 node_modules、.nuxt）；其余条目只覆盖写入，不删除目标仓库自己加的文件。
 *
 * 用法: tsx scripts/sync-ele.ts [options]
 *
 * 选项:
 *   --target <dir>   ele-nuxt-layers 仓库路径（默认 ~/Projects/ele-nuxt-layers）
 *   --dry-run        只打印将要发生的变更，不写盘
 *   --force          同步范围内有未提交变更时仍继续（这些变更会被覆盖或删除）
 *
 * 改写规则：
 *   - package.json 去掉 release:bjj，release 只保留 elepay 发布
 *   - pnpm-workspace.yaml 加 linkWorkspacePackages: true（见 linkWorkspacePackages()）
 *   - pnpm-lock.yaml 改为链接本地 layer 包、删去未同步包（见 adaptLockfile()）
 *   - baijunjie.github.io/bjj/ → elepay-io.github.io/ele-nuxt-layers/（Storybook 文档地址）
 *   - baijunjie/bjj → elepay-io/ele-nuxt-layers（GitHub 仓库地址）
 *   - bjj → ele，保留大小写形式（BJJ → ELE、Bjj → Ele）；前后紧邻字母数字的不改（避免改坏哈希等随机串），
 *     lockfile 的 integrity 行整行不改
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { parseArgs } from 'node:util'

const SOURCE_ROOT = path.resolve(import.meta.dirname, '..')

interface Entry {
  /** 相对仓库根的文件或目录 */
  path: string
  /** 是否删除目标中源已不存在的文件 */
  mirror: boolean
}

const ENTRIES: Entry[] = [
  ...[ 'nuxt-layer-basic', 'nuxt-layer-shadcn-ui', 'shared', 'eslint-config-shared' ]
    .map(name => ({ path: `packages/${name}`, mirror: true })),
  ...[
    '.claude',
    '.husky',
    '.editorconfig',
    '.gitattributes',
    '.gitignore',
    '.lintstagedrc.json',
    '.lintstagedrc.lint-only.json',
    '.lintstagedrc.root.lint-only.mjs',
    '.lintstagedrc.root.mjs',
    'eslint.config.ts',
    'package.json',
    'pnpm-workspace.yaml',
    'pnpm-lock.yaml',
    'scripts/publish.ts',
    'tsconfig.json',
  ].map(file => ({ path: file, mirror: false })),
]

const CASE_MAP: Record<string, string> = { bjj: 'ele', BJJ: 'ELE', Bjj: 'Ele' }

const REWRITES: Array<[ RegExp, (match: string) => string ]> = [
  [ /baijunjie\.github\.io\/bjj\//g, () => 'elepay-io.github.io/ele-nuxt-layers/' ],
  [ /baijunjie\/bjj\b/g, () => 'elepay-io/ele-nuxt-layers' ],
  [ /(?<![a-z0-9])bjj(?![a-z0-9])/gi, match => CASE_MAP[match] ?? 'ele' ],
]

function rewrite (text: string): string {
  return REWRITES.reduce((acc, [ pattern, replacement ]) => acc.replace(pattern, replacement), text)
}

/** 去掉发布到 @bjj scope 的 release:bjj 脚本及其在 release 中的调用 */
function dropBjjRelease (text: string): string {
  return text
    .replace(/^[ \t]*"release:bjj":.*\n/m, '')
    .replace(/npm run release:bjj && /g, '')
}

/**
 * layer 之间用版本范围互相依赖（如 "@bjj/shared": "^0.7"），源仓库从 npm 装已发布的 @bjj/* 包；
 * 改名为 @ele/* 后 registry 上没有同名包，需让 pnpm 用本地 workspace 包满足这些范围。
 * 发布产物不受影响：publish.ts 的 --rewrite 会把依赖名改写为 @elepay-io/*。
 */
function linkWorkspacePackages (text: string): string {
  return text.replace(
    /^packages:\n(?:[ \t]+-.*\n)+/m,
    block => `${block}\n# Layers depend on each other by version range; resolve them from the local\n# workspace since @ele/* is not published to the registry.\nlinkWorkspacePackages: true\n`,
  )
}

/** 同步的包目录名（packages/<name>） */
const SYNCED_PACKAGES = ENTRIES.filter(entry => entry.mirror).map(entry => path.basename(entry.path))

/**
 * 让 lockfile 与目标仓库一致，锁定的依赖版本与源仓库相同：
 * - layer 之间的版本范围依赖从 registry 上的 @bjj/* 改为链接本地 workspace 包，并删去这些包的 registry 条目
 * - 删去未同步包的 importer
 * 由此留下的孤立条目由目标仓库的 pnpm install 清理。
 */
function adaptLockfile (text: string): string {
  const pkgs = SYNCED_PACKAGES.join('|')
  return text
    .replace(
      new RegExp(`(\\n {6}'@bjj/(${pkgs})':\\n {8}specifier: .*\\n {8}version: )(?!link:).*`, 'g'),
      (_, head: string, name: string) => `${head}link:../${name}`,
    )
    .replace(new RegExp(`\\n {2}'@bjj/(${pkgs})@.*:\\n(?: {4}.*\\n)*`, 'g'), '')
    .replace(/\n {2}packages\/([^/:\n]+):\n(?: {4}.*\n)*/g, (block, name: string) => SYNCED_PACKAGES.includes(name) ? block : '')
}

function transform (file: string, raw: Buffer): Buffer {
  if (raw.subarray(0, 8000).includes(0)) return raw
  let text = raw.toString('utf-8')
  if (path.basename(file) === 'package.json') text = dropBjjRelease(text)
  if (file === 'pnpm-workspace.yaml') text = linkWorkspacePackages(text)
  if (file === 'pnpm-lock.yaml') {
    text = adaptLockfile(text).split('\n').map(line => line.includes('integrity:') ? line : rewrite(line)).join('\n')
  } else {
    text = rewrite(text)
  }
  return Buffer.from(text, 'utf-8')
}

function git (cwd: string, args: string[]): string {
  return execFileSync('git', args, { cwd, encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 })
}

/** 列出 entry 下已跟踪及未被忽略、且存在于工作区的文件（相对仓库根） */
function listFiles (repoRoot: string, entry: string): string[] {
  return git(repoRoot, [ 'ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', entry ])
    .split('\0')
    .filter(file => file && fs.existsSync(path.join(repoRoot, file)))
}

function removeEmptyDirs (dir: string, stopAt: string): void {
  while (dir.startsWith(stopAt + path.sep) && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir)
    dir = path.dirname(dir)
  }
}

interface Stats { added: number, updated: number, deleted: number, unchanged: number }

function syncEntry (entry: Entry, targetRoot: string, dryRun: boolean, stats: Stats): void {
  const written = new Set<string>()

  for (const file of listFiles(SOURCE_ROOT, entry.path)) {
    const destFile = rewrite(file)
    written.add(destFile)

    const content = transform(file, fs.readFileSync(path.join(SOURCE_ROOT, file)))
    const destPath = path.join(targetRoot, destFile)
    const exists = fs.existsSync(destPath)

    if (exists && fs.readFileSync(destPath).equals(content)) {
      stats.unchanged++
      continue
    }
    console.info(`  ${exists ? 'M' : 'A'} ${destFile}`)
    exists ? stats.updated++ : stats.added++
    if (!dryRun) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true })
      fs.writeFileSync(destPath, content)
    }
  }

  if (entry.mirror) {
    const destEntry = rewrite(entry.path)
    for (const file of listFiles(targetRoot, destEntry)) {
      if (written.has(file)) continue
      console.info(`  D ${file}`)
      stats.deleted++
      if (!dryRun) {
        const destPath = path.join(targetRoot, file)
        fs.rmSync(destPath)
        removeEmptyDirs(path.dirname(destPath), path.join(targetRoot, destEntry))
      }
    }
  }
}

function main (): void {
  const { values } = parseArgs({
    options: {
      'target': { type: 'string', default: path.join(os.homedir(), 'Projects/ele-nuxt-layers') },
      'dry-run': { type: 'boolean', default: false },
      'force': { type: 'boolean', default: false },
    },
  })
  const targetRoot = path.resolve(values.target!)
  const dryRun = values['dry-run']!

  if (!fs.existsSync(path.join(targetRoot, '.git'))) {
    throw new Error(`目标不是 git 仓库: ${targetRoot}`)
  }

  const dirty = git(targetRoot, [ 'status', '--porcelain', '--', ...ENTRIES.map(entry => rewrite(entry.path)) ]).trim()
  if (dirty && !values.force) {
    throw new Error(`同步范围内有未提交变更，提交或丢弃后再同步（或加 --force 覆盖）:\n${dirty}`)
  }

  console.info(`${dryRun ? '[dry-run] ' : ''}${SOURCE_ROOT} → ${targetRoot}`)
  const total: Stats = { added: 0, updated: 0, deleted: 0, unchanged: 0 }
  for (const entry of ENTRIES) syncEntry(entry, targetRoot, dryRun, total)
  console.info(`\n新增 ${total.added} / 更新 ${total.updated} / 删除 ${total.deleted} / 未变 ${total.unchanged}`)
}

try {
  main()
} catch (error) {
  console.error((error as Error).message)
  process.exit(1)
}
