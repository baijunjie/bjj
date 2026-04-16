import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/utils/index.ts',
    'src/utils-browser/index.ts',
    'src/plugins/index.ts',
  ],
  shims: true,
  format: [ 'esm' ],
})