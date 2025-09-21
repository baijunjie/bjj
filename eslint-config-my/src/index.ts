import { defineConfig } from 'eslint/config'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import javascript from './configs/javascript'
import typescript from './configs/typescript'
import stylistic from './configs/stylistic'
import json from './configs/json'
import markdown from './configs/markdown'
import tailwindcss from './configs/tailwindcss'
import react from './configs/react'
import vue from './configs/vue'
import { defaultsDeep } from 'lodash-es'

export type Options = {
  scopes?: {
    js?: boolean | object
    ts?: boolean | object
    stylistic?: boolean | object
    json?: boolean | object
    markdown?: boolean | object
    tailwindcss?: boolean | object
    react?: boolean | object
    vue?: boolean | object
  }
  ignores?: string[]
}

const defaultOptions: Options = {
  ignores: [],
  scopes: {
    js: true,
    ts: true,
    stylistic: true,
    json: true,
    markdown: true,
    tailwindcss: false,
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
        },
      },
    },
    ignores.length && globalIgnores(ignores),
    scopes.js && javascript(scopes),
    scopes.ts && typescript(scopes),
    scopes.stylistic && stylistic(scopes),
    scopes.json && json(scopes),
    scopes.markdown && markdown(scopes),
    scopes.tailwindcss && tailwindcss(scopes),
    scopes.react && react(scopes),
    scopes.vue && vue(scopes),
  ].filter(Boolean))
}
