import {
  toPairs,
  fromPairs,
  isEmpty,
  orderBy
} from 'lodash'

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
  arr = orderBy(arr, [0]).sort((a, b) => {
    const ak = a[0]
    const bk = b[0]
    if (isEmpty(order)) return ak.localeCompare(bk)

    const ai = order.indexOf(ak)
    const bi = order.indexOf(bk)
    if (ai < 0 && bi < 0) return ak.localeCompare(bk)
    else if (ai === bi) return 0
    else return ai < bi ? -1 : 1
  })
  return fromPairs(arr)
}
