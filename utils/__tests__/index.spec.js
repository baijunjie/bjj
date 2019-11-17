import * as utils from '../index'

describe('utils', () => {
  it('Test utils :: sleep', async () => {
    const start = Date.now()
    await utils.sleep(3000)
    const end = Date.now()
    const error = 100 // 误差时间
    const duration = end - start
    expect(duration).toBeGreaterThanOrEqual(3000 - error)
    expect(duration).toBeLessThanOrEqual(3000 + error)
  })

  it('Test utils :: sortKey', () => {
    expect(JSON.stringify(utils.sortKey({ b: 2, a: 1, c: 3 }))).toBe(JSON.stringify({ a: 1, b: 2, c: 3 }))
  })
})
