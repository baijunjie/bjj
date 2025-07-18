import { defineConfig } from 'eslint/config'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import javascript from './configs/javascript'
import typescript from './configs/typescript'
import stylistic from './configs/stylistic'
import tailwindcss from './configs/tailwindcss'
import react from './configs/react'
import vue from './configs/vue'
import { defaultsDeep } from 'lodash-es'

export type Options = {
  scopes?: {
    js?: boolean,
    ts?: boolean,
    stylistic?: boolean,
    tailwindcss?: boolean,
    react?: boolean,
    vue?: boolean,
  },
  ignores?: string[]
}

const defaultOptions: Options = {
  ignores: [],
  scopes: {
    js: true,
    ts: true,
    stylistic: true,
    tailwindcss: true,
    react: false,
    vue: false,
  },
}

export default function (options: Options = defaultOptions) {
  const {
    ignores,
    scopes,
  } = defaultsDeep(options, defaultOptions)

  return defineConfig([
    {
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.node,
        }
      }
    },
    ignores.length && globalIgnores(ignores),
    scopes.js && javascript(scopes),
    scopes.ts && typescript(scopes),
    scopes.stylistic && stylistic(scopes),
    scopes.tailwindcss && tailwindcss(scopes),
    scopes.react && react(scopes),
    scopes.vue && vue(scopes),
  ].filter(Boolean))
}
