import {
  toPairs,
  fromPairs,
  isEmpty,
  orderBy,
} from 'lodash'

/**
 * 将参数对象拼装进 url
 * @param  {String} url    需要拼装的 url
 * @param  {Object} params 参数对象
 * @return {String}        返回拼装好的新 url
 */
export function composeUrl (url, params) {
  if (typeof params !== 'object') return url

  const paramArr = []
  for (const key of Object.keys(params)) {
    paramArr.push({
      key: key,
      value: typeof params[key] === 'object'
        ? JSON.stringify(params[key])
        : params[key],
    })
  }

  let paramStr = paramArr
    // 根据 key 进行排序
    .sort((a, b) => {
      const av = a.key
      const bv = b.key
      return av.localeCompare(bv)
    })
    .map(({ key, value }) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
    .join('&')

  if (url.indexOf('?') >= 0) {
    if (!url.endsWith('&') && !url.endsWith('?')) paramStr = '&' + paramStr
  } else {
    paramStr = '?' + paramStr
  }

  return url + paramStr
}

/**
 * 等待指定毫秒
 * @param ms
 * @returns {Promise<any>}
 */
export function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 为对象的 key 排序，返回一个新对象
 * @param src
 * @param order {Array} 一个 key 数组，对象将会按照数组中 key 的顺序为对象排序
 * @returns {Object}
 */
export function sortKey (src, order = null) {
  let arr = toPairs(src)
  arr = orderBy(arr, [ 0 ]).sort((a, b) => {
    const ak = a[0]
    const bk = b[0]
    if (isEmpty(order)) return ak.localeCompare(bk)

    const ai = order.indexOf(ak)
    const bi = order.indexOf(bk)
    if (ai < 0 && bi < 0) return ak.localeCompare(bk)
    else if (ai < 0) return 1
    else if (bi < 0) return -1
    else if (ai === bi) return 0
    else return ai < bi ? -1 : 1
  })
  return fromPairs(arr)
}
