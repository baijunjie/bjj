declare const $fetch: typeof import('ofetch').$fetch

interface ImportMeta {
  readonly client?: boolean
  readonly server?: boolean
}
