export { default as cache } from './cache'

/**
 * 判断 node 是否包含 subNode
 * @param node    {HTMLElement|String}
 * @param subNode {HTMLElement|String}
 * @param contain {Boolean} 严格包含，默认为 false。如果为 true，当 node === subNode 时会返回 false
 * @returns {Boolean}
 */
export function containElement (node, subNode, contain = false) {
  node = typeof node === 'string' ? document.querySelector(node) : node
  subNode = typeof subNode === 'string' ? document.querySelector(subNode) : subNode

  if (!node || !subNode) return false
  if (subNode === node) return !contain

  do {
    if (subNode.nodeName === 'HTML') break
    subNode = subNode.parentNode
    if (subNode === node) return true
  } while (subNode)

  return false
}

export function loadJs (src) {
  const script = document.createElement('script')
  script.setAttribute('src', src)
  script.setAttribute('async', '')
  script.setAttribute('defer', '')

  const promise = new Promise((resolve, reject) => {
    script.onload = resolve
    script.onerror = reject
  })

  document.head.appendChild(script)

  return promise
}

/**
 * 解析 query
 * @param search
 */
export function parseQuery (search = null) {
  const query = {}
  const url = search || location.search
  if (url.indexOf('?') !== -1) {
    const array = url.split('?')[1].split('&')
    array.forEach(element => {
      const parts = element.split('=')
      query[parts[0]] = decodeURIComponent(parts[1])
    })
  }
  return query
}
