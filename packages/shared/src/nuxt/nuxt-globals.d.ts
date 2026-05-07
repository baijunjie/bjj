declare const $fetch: typeof import('ofetch').$fetch
declare function useStorage<
  T extends import('unstorage').StorageValue = import('unstorage').StorageValue,
> (base?: string): import('unstorage').Storage<T>

interface ImportMeta {
  readonly client?: boolean
  readonly server?: boolean
}
