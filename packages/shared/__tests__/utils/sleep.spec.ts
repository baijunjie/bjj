import { describe, it, expect } from 'vitest'
import { sleep } from '../../src/utils/sleep'

describe('sleep', () => {
  it('should wait for specified milliseconds', async () => {
    const start = Date.now()
    await sleep(200)
    const duration = Date.now() - start
    const tolerance = 50
    expect(duration).toBeGreaterThanOrEqual(200 - tolerance)
    expect(duration).toBeLessThanOrEqual(200 + tolerance)
  })
})