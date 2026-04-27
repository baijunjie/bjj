/**
 * 发布当前包到 npm，支持自定义包名、版本与导入路径重写
 *
 * 将 `package.json#files` 声明的路径复制到 staging 目录（.publish-tmp/），
 * 生成临时 package.json 和 .npmrc 后发布，完成后清理。
 *
 * 用法: tsx scripts/publish.ts [options]
 *
 * 选项:
 *   --name <name>          发布时使用的包名
 *   --version <version>    发布的版本号
 *   --token <envVar>       鉴权 token 环境变量名（生成临时 .npmrc）
 *   --registry <url>       自定义 registry
 *   --rewrite <from=to>    字符串替换规则（可重复），对复制后的源码及生成的
 *                          package.json 应用；用于在不同 scope 发布时改写包名
 *                          例：--rewrite '@bjj/shared=@polymarbot/uitls-shared'
 *   --dry-run              仅演练 npm publish
 *
 * 约定：
 *   - 调用此脚本前请先完成构建（build 不由此脚本触发）
 *   - `package.json#files` 为必填，声明要发布的路径白名单（字面路径，不支持 glob）
 *
 * 示例:
 *   tsx scripts/publish.ts --name @bjj/shared --token BJJ_NPM_TOKEN
 *   tsx scripts/publish.ts --name @polymarbot/nuxt-layer-shadcn-ui \
 *       --token POLYMARBOT_NPM_TOKEN \
 *       --rewrite '@bjj/nuxt-layer-shadcn-ui=@polymarbot/nuxt-layer-shadcn-ui' \
 *       --rewrite '@bjj/shared=@polymarbot/uitls-shared'
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { parseArgs } from 'node:util'

const CWD = process.cwd()
const PUBLISH_DIR = path.join(CWD, '.publish-tmp')

// 对这些扩展名的文本文件应用 --rewrite
const REWRITABLE_EXTS = new Set([
  '.ts', '.tsx', '.mts', '.cts',
  '.js', '.jsx', '.mjs', '.cjs',
  '.vue', '.json', '.md', '.css', '.scss', '.html',
])

// 遍历目录时始终跳过的条目
const WALK_SKIP = new Set([ 'node_modules', '.DS_Store' ])

// 需要解析 catalog: 引用的依赖字段
const DEP_FIELDS = [ 'dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies' ] as const

interface Rewrite { from: string, to: string }

interface Catalogs {
  /** 默认 catalog（pnpm-workspace.yaml 的 `catalog:` 段，等价于 `catalogs.default`） */
  default: Record<string, string>
  /** 命名 catalog（pnpm-workspace.yaml 的 `catalogs.<name>:` 段） */
  named: Record<string, Record<string, string>>
}

function parseRewrite (spec: string): Rewrite {
  const eq = spec.indexOf('=')
  if (eq < 0) {
    console.error(`--rewrite 参数格式错误: ${spec}（需要 from=to）`)
    process.exit(1)
  }
  return { from: spec.slice(0, eq), to: spec.slice(eq + 1) }
}

function escapeRegExp (s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 解析 pnpm-workspace.yaml 的 catalog / catalogs 段
 * 仅支持平铺的 `key: value` 形式（catalog 协议本身不支持嵌套）
 */
function parseCatalogs (yaml: string): Catalogs {
  const out: Catalogs = { default: {}, named: {}}
  const lines = yaml.replace(/\r/g, '').split('\n').map(l => l.replace(/(?:^|\s)#.*$/, ''))

  const parseEntry = (s: string): [string, string] | null => {
    const m = /^(['"]?)([^'"]+)\1\s*:\s*(.+?)\s*$/.exec(s.trim())
    if (!m) return null
    return [ m[2].trim(), m[3].replace(/^['"]|['"]$/g, '').trim() ]
  }

  let mode: null | 'catalog' | 'catalogs' = null
  let currentNamed: string | null = null
  let namedIndent = -1

  for (const line of lines) {
    if (!line.trim()) continue
    const indent = line.match(/^ */)![0].length

    if (indent === 0) {
      mode = null
      currentNamed = null
      namedIndent = -1
      const top = line.trim()
      if (top === 'catalog:') mode = 'catalog'
      else if (top === 'catalogs:') mode = 'catalogs'
      continue
    }

    if (mode === 'catalog') {
      const e = parseEntry(line)
      if (e) out.default[e[0]] = e[1]
      continue
    }

    if (mode === 'catalogs') {
      // 第一层缩进：named catalog 名称（行尾以 `:` 结束、无值）
      const nameMatch = /^(['"]?)([^'":]+)\1:\s*$/.exec(line.trim())
      if (currentNamed === null || indent <= namedIndent) {
        if (nameMatch) {
          currentNamed = nameMatch[2].trim()
          out.named[currentNamed] = {}
          namedIndent = indent
        }
      } else {
        const e = parseEntry(line)
        if (e) out.named[currentNamed][e[0]] = e[1]
      }
    }
  }

  // pnpm 把顶层 `catalog:` 视为 `catalogs.default` 的语法糖，合并两者
  if (out.named.default) {
    out.default = { ...out.named.default, ...out.default }
    delete out.named.default
  }

  return out
}

/** 沿目录上行查找 pnpm-workspace.yaml 并加载 catalog 定义 */
function loadCatalogs (start: string): Catalogs {
  let dir = start
  while (true) {
    const wsFile = path.join(dir, 'pnpm-workspace.yaml')
    if (fs.existsSync(wsFile)) return parseCatalogs(fs.readFileSync(wsFile, 'utf-8'))
    const parent = path.dirname(dir)
    if (parent === dir) return { default: {}, named: {}}
    dir = parent
  }
}

/** 把 deps 里的 `catalog:` / `catalog:<name>` 引用替换为实际版本范围 */
function resolveCatalogDeps (deps: Record<string, string> | undefined, catalogs: Catalogs, sectionName: string): void {
  if (!deps) return
  for (const [ name, spec ] of Object.entries(deps)) {
    if (!spec.startsWith('catalog:')) continue
    const catalogName = spec.slice('catalog:'.length).trim()
    const isDefault = !catalogName || catalogName === 'default'
    const catalog = isDefault ? catalogs.default : catalogs.named[catalogName]
    if (!catalog) {
      console.error(`未找到 catalog "${catalogName || 'default'}"（来自 ${sectionName}.${name}: ${spec}）`)
      process.exit(1)
    }
    const resolved = catalog[name]
    if (!resolved) {
      console.error(`catalog "${catalogName || 'default'}" 中未声明 ${name}（来自 ${sectionName}.${name}: ${spec}）`)
      process.exit(1)
    }
    deps[name] = resolved
  }
}

function applyRewrites (content: string, rewrites: Rewrite[]): string {
  if (!rewrites.length) return content
  let result = content
  for (const { from, to } of rewrites) {
    // 匹配包名边界：后跟 /、引号、空白、分隔符或行尾
    const re = new RegExp(escapeRegExp(from) + '(?=[/"\'\\s,)}\\]]|$)', 'g')
    result = result.replace(re, to)
  }
  return result
}

/** 按 pkg.files 把文件复制到 destBase，对文本文件应用 rewrites；返回复制的文件数 */
function copyPkgFiles (srcBase: string, destBase: string, pkgFiles: string[], rewrites: Rewrite[]): number {
  let count = 0

  const copyFile = (rel: string) => {
    const srcPath = path.join(srcBase, rel)
    const destPath = path.join(destBase, rel)
    fs.mkdirSync(path.dirname(destPath), { recursive: true })
    if (rewrites.length && REWRITABLE_EXTS.has(path.extname(rel))) {
      fs.writeFileSync(destPath, applyRewrites(fs.readFileSync(srcPath, 'utf-8'), rewrites))
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
    count++
  }

  const walk = (relDir: string) => {
    for (const entry of fs.readdirSync(path.join(srcBase, relDir), { withFileTypes: true })) {
      if (WALK_SKIP.has(entry.name)) continue
      const rel = path.join(relDir, entry.name)
      if (entry.isDirectory()) walk(rel)
      else copyFile(rel)
    }
  }

  for (const entry of pkgFiles) {
    const abs = path.join(srcBase, entry)
    if (!fs.existsSync(abs)) {
      console.warn(`⚠️  files 中的条目不存在，跳过: ${entry}`)
      continue
    }
    if (fs.statSync(abs).isDirectory()) walk(entry)
    else copyFile(entry)
  }

  return count
}

function main () {
  const { values } = parseArgs({
    options: {
      'name': { type: 'string', short: 'n' },
      'version': { type: 'string', short: 'v' },
      'token': { type: 'string', short: 't' },
      'registry': { type: 'string', short: 'r' },
      'rewrite': { type: 'string', multiple: true, default: []},
      'dry-run': { type: 'boolean', default: false },
    },
  })
  const { name, version, token, registry } = values
  const rewrites = (values.rewrite as string[]).map(parseRewrite)
  const dryRun = values['dry-run'] as boolean

  const pkgJsonPath = path.join(CWD, 'package.json')
  if (!fs.existsSync(pkgJsonPath)) {
    console.error('当前目录下没有 package.json')
    process.exit(1)
  }

  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
  const publishName = name || pkg.name
  const publishVersion = version || pkg.version

  if (!Array.isArray(pkg.files) || pkg.files.length === 0) {
    console.error('package.json 缺少 "files" 字段（必填，声明要发布的路径白名单）')
    process.exit(1)
  }

  console.info(`${pkg.name} -> ${publishName}@${publishVersion}`)
  if (rewrites.length) {
    console.info('rewrites:')
    for (const r of rewrites) console.info(`  ${r.from}  →  ${r.to}`)
  }

  // 清理历史残留，确保 staging 干净
  fs.rmSync(PUBLISH_DIR, { recursive: true, force: true })
  fs.mkdirSync(PUBLISH_DIR, { recursive: true })
  try {
    // 1. 按 pkg.files 复制到 staging，对文本文件应用 rewrites
    const copied = copyPkgFiles(CWD, PUBLISH_DIR, pkg.files, rewrites)
    if (copied === 0) {
      console.error('files 中没有找到任何文件可复制')
      process.exit(1)
    }

    // 2. 生成 staging 的 package.json（保留原 main/types/exports 等不变，
    //    只覆盖 name/version 并应用 rewrites）
    const distPkg: Record<string, any> = { ...pkg, name: publishName, version: publishVersion }
    // 记录源码 commit；npm 仅在 git 目录里发布时会自动注入 gitHead，这里从
    // .publish-tmp/ 发布所以要手动写入，供消费方回溯构建（如 Storybook 部署）。
    distPkg.gitHead = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim()
    // 清除 scripts 和 devDependencies 等运行时不需要的字段
    delete distPkg.scripts
    delete distPkg.devDependencies
    delete distPkg.pnpm
    delete distPkg.packageManager
    delete distPkg.workspaces
    delete distPkg.private

    // catalog: 引用 → 实际版本范围（npm 不识别 catalog: 协议，需在发布前展开）
    const catalogs = loadCatalogs(CWD)
    for (const f of DEP_FIELDS) resolveCatalogDeps(distPkg[f], catalogs, f)

    const pkgJson = applyRewrites(JSON.stringify(distPkg, null, 2), rewrites) + '\n'
    fs.writeFileSync(path.join(PUBLISH_DIR, 'package.json'), pkgJson)
    console.info('已生成 package.json')

    // 3. 指定了 token 参数时生成 .npmrc，否则使用全局配置
    if (token) {
      const registryUrl = registry || 'https://registry.npmjs.org/'
      const registryHost = new URL(registryUrl).host
      const scope = publishName.startsWith('@') ? publishName.split('/')[0] : null
      const registryKey = scope ? `${scope}:registry` : 'registry'
      const npmrc = [
        `${registryKey}=${registryUrl}`,
        `//${registryHost}/:_authToken=\${${token}}`,
        '',
      ].join('\n')
      fs.writeFileSync(path.join(PUBLISH_DIR, '.npmrc'), npmrc)
      console.info(`已生成 .npmrc (token: ${token}, registry: ${registryUrl})`)
    }

    // 4. 发布
    const publishCmd = `npm publish --access public${dryRun ? ' --dry-run' : ''}`
    console.info(`${dryRun ? '[DRY RUN] ' : ''}发布中...`)
    execSync(publishCmd, { cwd: PUBLISH_DIR, stdio: 'inherit' })
    console.info(`发布成功: ${publishName}@${publishVersion}`)
  } finally {
    fs.rmSync(PUBLISH_DIR, { recursive: true, force: true })
    console.info('已清理 staging 目录')
  }
}

main()
