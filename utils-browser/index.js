export { default as cache } from './cache'

/**
 * 解析 query
 * @param search
 */
export function parseQuery (search = null) {
  const query = {}
  const url = search || location.search
  if (url.indexOf('?') !== -1) {
    const array = url.substr(1).split('&')
    array.forEach(element => {
      const parts = element.split('=')
      query[parts[0]] = decodeURIComponent(parts[1])
    })
  }
  return query
}
