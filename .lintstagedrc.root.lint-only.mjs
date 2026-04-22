// Files under packages/ are linted by each package's own `lint` script;
// filter them out here so root ESLint never spans multiple tsconfig roots
// (which typescript-eslint rejects with a `tsconfigRootDir` error).
export default {
  '*.{js,jsx,ts,tsx,mjs,md,json,vue,html}': files => {
    const rootFiles = files.filter(f => !f.includes('/packages/'))
    if (!rootFiles.length) return []
    const quoted = rootFiles.map(f => JSON.stringify(f)).join(' ')
    return [ `eslint --max-warnings=0 --no-warn-ignored ${quoted}` ]
  },
}
