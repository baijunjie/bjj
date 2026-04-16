/**
 * 将参数对象拼装进 url
 * @param url    需要拼装的 url
 * @param params 参数对象
 * @return 返回拼装好的新 url
 */
export function composeUrl(url: string, params: Record<string, unknown>): string {
  if (typeof params !== 'object' || params === null) return url

  const entries = Object.entries(params)
    .filter(([, v]) => v !== null && v !== undefined)

  if (entries.length === 0) return url

  const base = 'http://n'
  const u = new URL(url, base)

  for (const [key, val] of entries) {
    u.searchParams.set(key, typeof val === 'object' ? JSON.stringify(val) : String(val))
  }
  u.searchParams.sort()

  return /^https?:\/\//.test(url) ? u.toString() : u.toString().slice(base.length)
}