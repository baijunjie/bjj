/**
 * 为对象的 key 排序，返回一个新对象
 * @param src 源对象
 * @param order 一个 key 数组，对象将会按照数组中 key 的顺序排序
 */
export function sortKey<T extends Record<string, unknown>> (
  src: T,
  order?: string[] | null,
): T {
  const entries = Object.entries(src).sort((a, b) => {
    const ak = a[0]
    const bk = b[0]

    if (!order || order.length === 0) return ak.localeCompare(bk)

    const ai = order.indexOf(ak)
    const bi = order.indexOf(bk)

    if (ai < 0 && bi < 0) return ak.localeCompare(bk)
    if (ai < 0) return 1
    if (bi < 0) return -1
    return ai - bi
  })

  return Object.fromEntries(entries) as T
}
