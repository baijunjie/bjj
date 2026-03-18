/**
 * 发布当前包到 npm，支持自定义 scope
 * 在 dist 目录下生成临时 package.json 进行发布，不修改原始文件
 *
 * 用法: node scripts/publish.mjs --scope <scope> [--dry-run]
 * 示例:
 *   node scripts/publish.mjs --scope @polymarbot
 *   node scripts/publish.mjs --scope @bjj --dry-run
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const CWD = process.cwd()
const DIST_DIR = path.join(CWD, 'dist')

function parseArgs () {
  const args = process.argv.slice(2)
  let scope
  let dryRun = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--scope' || args[i] === '-s') {
      scope = args[++i]
    } else if (args[i] === '--dry-run') {
      dryRun = true
    }
  }

  if (!scope) {
    console.error('缺少必需参数 --scope')
    console.error('用法: node scripts/publish.mjs --scope <scope> [--dry-run]')
    console.error('示例: node scripts/publish.mjs --scope @polymarbot')
    process.exit(1)
  }

  if (!scope.startsWith('@')) {
    scope = `@${scope}`
  }

  return { scope, dryRun }
}

function replaceScope (name, newScope) {
  if (name.startsWith('@')) {
    const shortName = name.split('/').slice(1).join('/')
    return `${newScope}/${shortName}`
  }
  return `${newScope}/${name}`
}

function main () {
  const { scope, dryRun } = parseArgs()

  const pkgJsonPath = path.join(CWD, 'package.json')
  if (!fs.existsSync(pkgJsonPath)) {
    console.error('当前目录下没有 package.json')
    process.exit(1)
  }

  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))

  // 构建
  if (pkg.scripts?.build) {
    console.log('构建中...')
    execSync('npm run build', { cwd: CWD, stdio: 'inherit' })
  }

  if (!fs.existsSync(DIST_DIR)) {
    console.error('dist 目录不存在，请先执行构建')
    process.exit(1)
  }

  const newName = replaceScope(pkg.name, scope)
  console.log(`${pkg.name} -> ${newName}@${pkg.version}`)

  // 在 dist 目录下生成临时 package.json
  const distPkg = {
    name: newName,
    version: pkg.version,
    description: pkg.description,
    type: pkg.type,
    main: './index.js',
    types: './index.d.ts',
    publishConfig: { access: 'public' },
  }

  // 可选字段
  for (const field of ['license', 'author', 'repository', 'homepage', 'keywords', 'bugs']) {
    if (pkg[field]) distPkg[field] = pkg[field]
  }

  // 依赖
  if (pkg.dependencies) distPkg.dependencies = pkg.dependencies
  if (pkg.peerDependencies) distPkg.peerDependencies = pkg.peerDependencies

  const distPkgJsonPath = path.join(DIST_DIR, 'package.json')
  fs.writeFileSync(distPkgJsonPath, JSON.stringify(distPkg, null, 2) + '\n')
  console.log('已生成 dist/package.json')

  try {
    const publishCmd = `npm publish --access public${dryRun ? ' --dry-run' : ''}`
    console.log(`${dryRun ? '[DRY RUN] ' : ''}发布中...`)
    execSync(publishCmd, { cwd: DIST_DIR, stdio: 'inherit' })
    console.log(`发布成功: ${newName}@${pkg.version}`)
  } catch (err) {
    console.error(`发布失败: ${newName}`)
    throw err
  } finally {
    // 清理 dist 下的临时 package.json
    fs.unlinkSync(distPkgJsonPath)
  }
}

main()