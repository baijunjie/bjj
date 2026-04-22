/**
 * 解析 URL query 参数
 * @param search URL search 字符串
 */
export function parseQuery (search?: string | null): Record<string, string> {
  const url = search || location.search
  const queryIndex = url.indexOf('?')
  if (queryIndex < 0) return {}

  // 移除 hash 片段，避免污染最后一个参数值
  let queryStr = url.slice(queryIndex)
  const hashIndex = queryStr.indexOf('#')
  if (hashIndex >= 0) {
    queryStr = queryStr.slice(0, hashIndex)
  }

  const query: Record<string, string> = {}
  const params = new URLSearchParams(queryStr)
  params.forEach((value, key) => {
    query[key] = value
  })
  return query
}
