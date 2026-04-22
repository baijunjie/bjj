/**
 * 发布当前包到 npm，支持自定义包名和版本
 * 将构建产物复制到 dist/npm 目录，生成临时 package.json 和 .npmrc 进行发布，发布后清理
 *
 * 用法: tsx scripts/publish.ts [--name <包名>] [--version <版本号>] [--token <环境变量名>] [--no-build] [--dry-run]
 * 示例:
 *   tsx scripts/publish.ts
 *   tsx scripts/publish.ts --name @bjj/eslint-config-shared
 *   tsx scripts/publish.ts --name @bjj/eslint-config-shared --version 1.0.0
 *   tsx scripts/publish.ts --name @bjj/eslint-config-shared --token BJJ_NPM_TOKEN
 *   tsx scripts/publish.ts --no-build   # 跳过构建，直接使用已有 dist 发布
 *   tsx scripts/publish.ts --dry-run
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const CWD = process.cwd()
const DIST_DIR = path.join(CWD, 'dist')
const PUBLISH_DIR = path.join(DIST_DIR, 'npm')

interface Args {
  name?: string
  version?: string
  token?: string
  registry?: string
  noBuild: boolean
  dryRun: boolean
}

function parseArgs (): Args {
  const args = process.argv.slice(2)
  let name: string | undefined
  let version: string | undefined
  let token: string | undefined
  let registry: string | undefined
  let noBuild = false
  let dryRun = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--name' || args[i] === '-n') {
      name = args[++i]
    } else if (args[i] === '--version' || args[i] === '-v') {
      version = args[++i]
    } else if (args[i] === '--token' || args[i] === '-t') {
      token = args[++i]
    } else if (args[i] === '--registry' || args[i] === '-r') {
      registry = args[++i]
    } else if (args[i] === '--no-build') {
      noBuild = true
    } else if (args[i] === '--dry-run') {
      dryRun = true
    }
  }

  return { name, version, token, registry, noBuild, dryRun }
}

function copyDistFiles (src: string, dest: string) {
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === 'npm') continue
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true })
      copyDistFiles(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function main () {
  const { name, version, token, registry, noBuild, dryRun } = parseArgs()

  const pkgJsonPath = path.join(CWD, 'package.json')
  if (!fs.existsSync(pkgJsonPath)) {
    console.error('当前目录下没有 package.json')
    process.exit(1)
  }

  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))

  const publishName = name || pkg.name
  const publishVersion = version || pkg.version

  // 构建
  if (!noBuild && pkg.scripts?.build) {
    console.info('构建中...')
    execSync('npm run build', { cwd: CWD, stdio: 'inherit' })
  }

  if (!fs.existsSync(DIST_DIR)) {
    console.error('dist 目录不存在，请先执行构建')
    process.exit(1)
  }

  console.info(`${pkg.name} -> ${publishName}@${publishVersion}`)

  // 创建 dist/npm 目录并复制构建产物
  fs.mkdirSync(PUBLISH_DIR, { recursive: true })
  copyDistFiles(DIST_DIR, PUBLISH_DIR)

  // 生成 package.json
  const distPkg: Record<string, any> = {
    name: publishName,
    version: publishVersion,
    main: './index.js',
    types: './index.d.ts',
  }

  const optionalFields = [
    'description', 'type', 'license', 'author', 'repository',
    'homepage', 'keywords', 'bugs', 'dependencies', 'peerDependencies',
  ]
  for (const field of optionalFields) {
    if (pkg[field]) distPkg[field] = pkg[field]
  }

  fs.writeFileSync(path.join(PUBLISH_DIR, 'package.json'), JSON.stringify(distPkg, null, 2) + '\n')
  console.info('已生成 dist/npm/package.json')

  // 指定了 token 参数时生成 .npmrc，否则使用全局配置
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
    console.info(`已生成 dist/npm/.npmrc (token: ${token}, registry: ${registryUrl})`)
  }

  try {
    const publishCmd = `npm publish --access public${dryRun ? ' --dry-run' : ''}`
    console.info(`${dryRun ? '[DRY RUN] ' : ''}发布中...`)
    execSync(publishCmd, { cwd: PUBLISH_DIR, stdio: 'inherit' })
    console.info(`发布成功: ${publishName}@${publishVersion}`)
  } catch (err) {
    console.error(`发布失败: ${publishName}`)
    throw err
  } finally {
    fs.rmSync(PUBLISH_DIR, { recursive: true, force: true })
    console.info('已清理 dist/npm/')
  }
}

main()
