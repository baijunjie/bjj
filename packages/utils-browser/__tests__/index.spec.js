import * as utils from '../index'

describe('utils-browser', () => {
  it('Test utils :: parseQuery', () => {
    expect(utils.parseQuery('/?a=1&c=3&b=2')).toEqual({ a: '1', b: '2', c: '3' })
  })

  it('Test utils :: containElement', () => {
    const node = {}
    const middleNode = { parentNode: node }
    const subNode = { parentNode: middleNode }
    const otherNode = {}
    expect(utils.containElement(node, null)).toBe(false)
    expect(utils.containElement(null, subNode)).toBe(false)
    expect(utils.containElement(node, subNode)).toBe(true)
    expect(utils.containElement(node, otherNode)).toBe(false)
    expect(utils.containElement(node, node)).toBe(true)
    expect(utils.containElement(node, node, true)).toBe(false)
  })

  it('Test utils :: cache object', () => {
    const { cache } = utils
    expect(cache).not.toBe(undefined) // utils.cache exist
    expect(cache.get('test', 456)).toBe(456) // cache.get default
    cache.set('test', 123)
    expect(cache.get('test')).toBe(123)
    expect(cache.get('test')).not.toBe('123')
    cache.set('test2', '123')
    expect(cache.get('test2')).toBe('123')
    expect(cache.get('test2')).not.toBe(123)
    expect(cache.keys()).toEqual([ 'test', 'test2' ])
    cache.del('test2')
    expect(cache.get('test2')).toBe(undefined)
    expect(cache.has('test')).toBe(true)
    expect(cache.has('test2')).toBe(false)
  })
})
